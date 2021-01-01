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
import CreatableSelect from 'react-select/creatable';

class FormsPage extends Component {
  state = {
    formActivePanel1: 1,
    formActivePanel1Changed: false,
    template : "",
    isLoading:false,
    isError:false,
    email:"",
    subjects:{},
    templateValues:{},
    preview:{},
    members:[]
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
  
DynamicFormCreator(member){
  const beautifyVariable = (variableName) =>{
    var str = variableName.toString().split("_").map((el)=>{return el.charAt(0).toUpperCase()  + el.slice(1);}).join(" ");
    return str;
  };
  if(!this.state.templateValues)this.state.templateValues = {};
  return (
    <div>
    {Object.keys(this.state.templateValues[member]).map( (key, ind) => {return (
      
      <MDBInput label={beautifyVariable(key)} value={this.state.templateValues[member][key]}  onChange={evt => this.updateFormValue(key,member)(evt)} className="mt-3 " required/>
      )})}
    </div>
  );

};
MemberFormCreator(){
  const beautifyVariable = (variableName) =>{
    var str = variableName.toString().split("_").map((el)=>{return el.charAt(0).toUpperCase()  + el.slice(1);}).join(" ");
    return str;
  };
  console.log(this.state);
  if(!this.state.templateValues)this.state.templateValues = {};
  return (
    <div>
    {Object.keys(this.state.members).map( (key, ind) => {return (
      <div>
          <h3 className="font-weight-bold pl-0 my-4"><strong>Info for {member}</strong></h3> 
        <MDBInput label="To Email" type="email" value={this.state.members[key]} onChange={evt => {this.state.members[key] = evt.target.value; this.setState({members: this.state.members });}} className="mt-3 " required/>
        <MDBInput label="Subject" value={this.state.subjects[key]} onChange={evt => {this.state.subjects[key] = evt.target.value; this.setState({subjects: evt.target.value});}} className="mt-3 " required/>

        <h3 className="font-weight-bold pl-0 my-4"><strong>Template Values</strong></h3>
        {this.DynamicFormCreator(key)}
        
        <h3 className="font-weight-bold pl-0 my-4"><strong>Preview</strong></h3>
        <MDBInput label="Template" className="" type="textarea" id="templatetext" rows="6" value={this.state.preview[key]} required/>
        
        <MDBBtn color="success" rounded className="float-right" onClick={this.handleSubmission} type="submit">submit</MDBBtn>
      </div>
      )})}
    </div>
  );

};
handleChange = (newValue, actionMeta) => {
  console.group('Value Changed');
  console.log(newValue);
  this.state.members = newValue.map((val)=>{return val.label});
  this.setState({
    members : this.state.members
  });
  console.log(`action: ${actionMeta.action}`);
  console.groupEnd();
  this.updateKeys(this.state.template);
  this.updatePreviews(this.state.template);
};
updateFormValue = (key, member) => (evt) => {
  //Everytime the user changes one of the template values, this updates the value in state and recalculates the preview. 
  if(!this.state.templateValues[member])this.state.templateValues[member] = {};
  
  this.state.templateValues[member][key] =  evt.target.value;
  this.setState({
    templateValues: this.state.templateValues
  });
  if(!this.state.preview)this.state.preview = {};
  this.state.preview[member] = this.state.template;
  for(var kkey in this.state.templateValues[member] ){
    this.state.preview[member] = this.state.preview[member] .replace("%%" + kkey + "%%",this.state.templateValues[member][kkey]);
  }
  this.setState({
    preview: this.state.preview 
  });
}
updateKeys(tTemplate){
  var keys = tTemplate.match(/%%([a-zA-Z_]*)%%/g);
  for(var member in this.state.members){
    var prevtemplateValues = {...this.state.templateValues[member]};
    if(!prevtemplateValues)prevtemplateValues = {};
    if(!prevtemplateValues[member])prevtemplateValues[member] ={};
    this.state.templateValues[member] = {};
    if(keys){
      keys = keys.map((el)=>{return el.slice(2,el.length-2);});
      keys.forEach((val,ind)=>{
        this.state.templateValues[member][val]="";
        if(prevtemplateValues[member][val]){
          this.state.templateValues[member][val]=prevtemplateValues[val];
        }
      });
    }
  }
}
updatePreviews(tTemplate){
  for(var member in this.state.members){
    //this recalculates the preview
    if(!this.state.preview)this.state.preview = {};
    this.state.preview[member] = tTemplate;
    for(var key in this.state.templateValues[member] ){
      this.state.preview[member]  = this.state.preview[member].replace("%%" + key + "%%",this.state.templateValues[member][key]);
    }
  }
  this.setState({
    template: tTemplate,
    templateValues: this.state.templateValues,
    preview: this.state.preview 
  });
}
updateTemplateValue = (evt) => {
  var tTemplate = evt.target.value;
  console.log(tTemplate);
  //This matches out all keys of the format %%<text>%% this creates a new template values with the new keys, and transfers over the values of the previous template values with corresponding keys. 
  this.updateKeys(tTemplate);
  this.updatePreviews(tTemplate);
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
                        <form role="form" id="email_create_panel" className="needs-validation" action="" method="post" noValidate>
                    <h3 className="font-weight-bold pl-0 my-4"><strong>Template</strong></h3>
                     <MDBInput label="Template" type="textarea" id="templatetext" rows="6" value={this.state.template} onKeyDown={evt => this.updateTemplateValue(evt)} onChange={evt => this.updateTemplateValue(evt)}/>
                     <h3 className="font-weight-bold pl-0 my-4"><strong>Email</strong></h3> 
                   <MDBInput label="To Email" type="email" value={this.state.email} onChange={evt => this.setState({email: evt.target.value})} className="mt-3 " required/>
                   <MDBInput label="Subject" value={this.state.subject} onChange={evt => this.setState({subject: evt.target.value})} className="mt-3 " required/>
                   <CreatableSelect
                    isMulti
                    onChange={this.handleChange}
                  />
                   <h3 className="font-weight-bold pl-0 my-4"><strong>Template Values</strong></h3>
                   {this.MemberFormCreator()}
                   
                   <h3 className="font-weight-bold pl-0 my-4"><strong>Preview</strong></h3>
                   <MDBInput label="Template" className="" type="textarea" id="templatetext" rows="6" value={this.state.preview} required/>
                   
                   <MDBBtn color="success" rounded className="float-right" onClick={this.handleSubmission} type="submit">submit</MDBBtn>
                   </form>
                 </MDBCol>)}

                  

                    {this.state.formActivePanel1 == 4 &&
                    (<MDBCol md="12"><MDBAnimation type="fadeIn">
                         <form role="form" id="email_send_panel" class="needs-validation" action="" method="post">
                      {!this.state.isLoading && !this.state.isError && (<div><h2 className="text-center font-weight-bold my-4">Email sent!</h2>
                      <MDBInput label="To Email" type="email" value={this.state.email} readOnly className="mt-3"/>
                      <MDBInput label="Subject" value={this.state.subject} readOnly className="mt-3"/>
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
