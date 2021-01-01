import React, { Component } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
  MDBIcon,
  MDBAnimation
} from 'mdbreact';
import SectionContainer from '../components/sectionContainer';
class FormsPage extends Component {
  state = {
    formActivePanel1: 1,
    formActivePanel1Changed: false,
    template : "",
    isLoading:false,
    isError:false,
    email:"",
    subject:"",
    templateValues:{},
    preview:""
  };


  swapFormActive = (a) => (param) => (e) => {
    this.setState({
      ['formActivePanel' + a]: param,
      ['formActivePanel' + a + 'Changed']: true
    });
  }
   
  handleSubmission = (e)=>{
    if(e.currentTarget.form.checkValidity()){
      
      const recipeUrl = 'http://localhost:9000/api/sendmail';
      const postBody = {
          template: this.state.template,
          templateValues : this.state.templateValues,
          email : this.state.email,
          subject : this.state.subject
      };
      const requestMetadata = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(postBody)
      };
      this.setState({  isLoading:true,isError:false });
      this.handleNextPrevClick(1)(4)(e);

      fetch(recipeUrl, requestMetadata)
          .then(res => res.json())
          .then(email => {
              console.log(email);
              this.setState({ preview:email.text, isLoading:false, isError:false });

          }).catch(err => {
              const errStatus = err.response ? err.response.status : 500;
            
              this.setState({ isLoading:false, isError:true, error: errStatus});
           
          });
     }
      
  }
  handleNextPrevClick = (a) => (param) => (e) => {
    
    this.setState({
      ['formActivePanel' + a]: param,
      ['formActivePanel' + a + 'Changed']: true
    });
  }
  
DynamicFormCreator(){
  const beautifyVariable = (variableName) =>{
    var str = variableName.toString().split("_").map((el)=>{return el.charAt(0).toUpperCase()  + el.slice(1);}).join(" ");
    return str;
  };
  console.log(this.state);
  return (
    <div>
    {Object.keys(this.state.templateValues).map( (key, ind) => {return (
      
      <MDBInput label={beautifyVariable(key)} value={this.state.templateValues[key]}  onChange={evt => this.updateFormValue(key)(evt)} className="mt-3 " required/>
      )})}
    </div>
  );

};
updateFormValue = (key) => (evt) => {
  //Everytime the user changes one of the template values, this updates the value in state and recalculates the preview. 
  this.state.templateValues[key] =  evt.target.value;

  this.setState({
    templateValues: this.state.templateValues
  });
  this.state.preview = this.state.template;
  for(var kkey in this.state.templateValues ){
    this.state.preview = this.state.preview.replace("%%" + kkey + "%%",this.state.templateValues[kkey]);
  }
  this.setState({
    preview: this.state.preview 
  });
}
updateTemplateValue(evt){
  //This matches out all keys of the format %%<text>%% this creates a new template values with the new keys, and transfers over the values of the previous template values with corresponding keys. 
    var keys = this.state.template.match(/%%([a-zA-Z_]*)%%/g);
  var prevtemplateValues = {...this.state.templateValues};
  this.state.templateValues = {};
  if(keys){
    keys = keys.map((el)=>{return el.slice(2,el.length-2);});
    keys.forEach((val,ind)=>{
      this.state.templateValues[val]="";
      if(prevtemplateValues[val]){
        this.state.templateValues[val]=prevtemplateValues[val];
      }
    });
  }
  
  this.setState({
    template: evt.target.value
  });
  //this recalculates the preview
  this.state.preview = this.state.template;
  for(var key in this.state.templateValues ){
    this.state.preview = this.state.preview.replace("%%" + key + "%%",this.state.templateValues[key]);
  }
  this.setState({
    preview: this.state.preview 
  });
}
  render() {

    return (
      <MDBContainer className='mt-5'>
        
       
          <MDBRow>
            <MDBCol md='12'>
              <SectionContainer>
              <MDBContainer>
                <h2 className="text-center font-weight-bold pt-4 pb-1 mb-2"><strong>Email form  </strong></h2>
               <hr></hr>

              
                  <MDBRow>
                    {this.state.formActivePanel1 == 1 &&
                    (<MDBCol md="12">
                        <form role="form" id="email_create_panel" class="needs-validation" action="" method="post" novalidate>
                    <h3 className="font-weight-bold pl-0 my-4"><strong>Template</strong></h3>
                     <MDBInput label="Template" type="textarea" id="templatetext" rows="6" value={this.state.template} onChange={evt => this.updateTemplateValue(evt)}/>
                     <h3 className="font-weight-bold pl-0 my-4"><strong>Email</strong></h3> 
                   <MDBInput label="To Email" type="email" value={this.state.email} onChange={evt => this.setState({email: evt.target.value})} className="mt-3 " required/>
                   <MDBInput label="Subject" value={this.state.subject} onChange={evt => this.setState({subject: evt.target.value})} className="mt-3 " required/>
                
                   <h3 className="font-weight-bold pl-0 my-4"><strong>Template Values</strong></h3>
                   {this.DynamicFormCreator()}
                   
                   <h3 className="font-weight-bold pl-0 my-4"><strong>Preview</strong></h3>
                   <MDBInput label="Template" className="" type="textarea" id="templatetext" rows="6" value={this.state.preview} required/>
                   
                   <MDBBtn color="success" rounded className="float-right" onClick={this.handleSubmission} type="submit">submit</MDBBtn>
                   </form>
                 </MDBCol>)}

                  

                    {this.state.formActivePanel1 == 4 &&
                    (<MDBCol md="12"><MDBAnimation type="fadeIn">
                         <form role="form" id="email_send_panel" class="needs-validation" action="" method="post">
                      {!this.state.isLoading && !this.state.isError && (<div><h2 className="text-center font-weight-bold my-4">Email sent!</h2>
                      <MDBInput label="To Email" type="email" value={this.state.email} readonly className="mt-3"/>
                      <MDBInput label="Subject" value={this.state.subject} readonly className="mt-3"/>
                      <h3 className="font-weight-bold pl-0 my-4"><strong>Preview</strong></h3>
                      <MDBInput label="Template" type="textarea" id="templatetext" rows="6" value={this.state.preview}/>
                      <MDBBtn color="mdb-color" rounded className="float-right" onClick={this.handleNextPrevClick(1)(1)}>Return to start</MDBBtn>
                      </div>)}
                      {this.state.isLoading && (
                      
                        <h2 className="text-center font-weight-bold my-4"> <div class="spinner-grow text-success" style={{fontSize:"40px"}} role="status">
                      </div>  &nbsp; Busy sending</h2>
                                           
                      )}
                       {!this.state.isLoading && this.state.isError && (
                      <div>
                        <h2 className="text-center font-weight-bold my-4"> <MDBIcon icon="exclamation-triangle" size="lg"/>  &nbsp; Error: Email not sent. Code {this.state.error} </h2>
                       <MDBBtn color="mdb-color" rounded className="float-right" onClick={this.handleNextPrevClick(1)(1)}>Return to start</MDBBtn>
                      </div>
                      )}
                       </form></MDBAnimation>
                    </MDBCol>)}
                  </MDBRow>
                
              </MDBContainer>
              </SectionContainer>
            </MDBCol>
            
          </MDBRow>

      </MDBContainer>
    );
  }
}

export default FormsPage;
