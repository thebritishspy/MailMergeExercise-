import React, { Component } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
  MDBIcon,
  MDBCard,
  MDBCardBody,
  MDBModal,
  MDBModalBody,
  MDBModalFooter
} from 'mdbreact';
import DocsLink from '../components/docsLink';
import SectionContainer from '../components/sectionContainer';
import DynamicForm from '../components/dynamicform';
class FormsPage extends Component {
  state = {
    modal: false,
    formActivePanel1: 1,
    formActivePanel1Changed: false,
    template : "",
    isLoading:false,
    email:"",
    subject:"",
    templateValues:{},
    preview:""
  };

  toggle = () => {
    const { modal } = this.state;
    this.setState({
      modal: !modal
    });
  };
  swapFormActive = (a) => (param) => (e) => {
    this.setState({
      ['formActivePanel' + a]: param,
      ['formActivePanel' + a + 'Changed']: true
    });
  }
  handleTemplateNextClick = (e) => {
    this.state.templateValues = {};
    var keys = this.state.template.match(/%%([a-zA-Z_]*)%%/g);
    if(keys){
      keys = keys.map((el)=>{return el.slice(2,el.length-2);});
      keys.forEach((val,ind)=>{this.state.templateValues[val]="";});
    }
   
    console.log(this.state); 
    return this.handleNextPrevClick(1)(2)(e);
  }
  handleTemplateValuesNextClick = (e) => {
    this.state.preview = this.state.template;
    for(var key in this.state.templateValues ){
      this.state.preview = this.state.preview.replace("%%" + key + "%%",this.state.templateValues[key]);
    }
    this.setState({
      preview: this.state.preview 
    });
    console.log(this.state); 
    return this.handleNextPrevClick(1)(3)(e);
  }
  handleSubmission = (e)=>{
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
    this.setState({  isLoading:true });
    this.handleNextPrevClick(1)(4)(e);
    fetch(recipeUrl, requestMetadata)
        .then(res => res.json())
        .then(email => {
           console.log(email);
            this.setState({ preview:email.preview, isLoading:false });
        });
  }
  handleNextPrevClick = (a) => (param) => (e) => {
    
    this.setState({
      ['formActivePanel' + a]: param,
      ['formActivePanel' + a + 'Changed']: true
    });
  }
  
calculateAutofocus = (a) => {
  if (this.state['formActivePanel' + a + 'Changed']) {
    return true
  }
}
DynamicFormCreator(readonly){
  const beautifyVariable = (variableName) =>{
    var str = variableName.toString().split("_").map((el)=>{return el.charAt(0).toUpperCase()  + el.slice(1);}).join(" ");
    return str;
  };
  console.log(this.state);
  return (
    <div>
    {Object.keys(this.state.templateValues).map( (key, ind) => {return (
      <MDBInput label={beautifyVariable(key)} value={this.state.templateValues[key]}  onChange={evt => this.updateFormValue(key)(evt)} className="mt-3"/>
    )})}
    </div>
  );

};
updateFormValue = (key) => (evt) => {
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
  var keys = this.state.template.match(/%%([a-zA-Z_]*)%%/g);
  if(keys){
    keys = keys.map((el)=>{return el.slice(2,el.length-2);});
    keys.forEach((val,ind)=>{if(!this.state.templateValues[val])this.state.templateValues[val]="";});
  }
  
  this.setState({
    template: evt.target.value
  });
  
  this.state.preview = this.state.template;
  for(var key in this.state.templateValues ){
    this.state.preview = this.state.preview.replace("%%" + key + "%%",this.state.templateValues[key]);
  }
  this.setState({
    preview: this.state.preview 
  });
}
  render() {
    const { modal } = this.state;

    return (
      <MDBContainer className='mt-5'>
        
       
          <MDBRow>
            <MDBCol md='12'>
              <SectionContainer>
              <MDBContainer>
                <h2 className="text-center font-weight-bold pt-4 pb-1 mb-2"><strong>Email form  </strong></h2>
               <hr></hr>

                <form role="form" action="" method="post">
                  <MDBRow>
                    {this.state.formActivePanel1 == 1 &&
                    (<MDBCol md="12">
                    <h3 className="font-weight-bold pl-0 my-4"><strong>Template</strong></h3>
                     <MDBInput label="Template" type="textarea" id="templatetext" rows="6" value={this.state.template} onChange={evt => this.updateTemplateValue(evt)}/>
                     <h3 className="font-weight-bold pl-0 my-4"><strong>Email</strong></h3> 
                   <MDBInput label="To Email" value={this.state.email} onChange={evt => this.setState({email: evt.target.value})} className="mt-3"/>
                   <MDBInput label="Subject" value={this.state.subject} onChange={evt => this.setState({subject: evt.target.value})} className="mt-3"/>
                   <h3 className="font-weight-bold pl-0 my-4"><strong>Template Values</strong></h3>
                   {this.DynamicFormCreator()}
                   <h3 className="font-weight-bold pl-0 my-4"><strong>Preview</strong></h3>
                   <MDBInput label="Template" type="textarea" id="templatetext" rows="6" value={this.state.preview}/>
                   <MDBBtn color="success" rounded className="float-right" onClick={this.handleSubmission}>submit</MDBBtn>
                  
                 </MDBCol>)}

                  

                    {this.state.formActivePanel1 == 4 &&
                    (<MDBCol md="12">

                      {!this.state.isLoading && (<div><h2 className="text-center font-weight-bold my-4">Email sent!</h2>
                      <MDBInput label="To Email" value={this.state.email} readonly className="mt-3"/>
                      <MDBInput label="Subject" value={this.state.subject} readonly className="mt-3"/>
                      <h3 className="font-weight-bold pl-0 my-4"><strong>Preview</strong></h3>
                      <MDBInput label="Template" type="textarea" id="templatetext" rows="6" value={this.state.preview}/>
                      <MDBBtn color="mdb-color" rounded className="float-right" onClick={this.handleNextPrevClick(1)(1)}>Return to start</MDBBtn>
                      </div>)}
                      {this.state.isLoading && (
                      
                        <h2 className="text-center font-weight-bold my-4"> <div class="spinner-grow text-success" style={{fontSize:"40px"}} role="status">
                      </div>  &nbsp; Busy sending</h2>
                                           
                      )}
                      
                    </MDBCol>)}
                  </MDBRow>
                </form>
              </MDBContainer>
              </SectionContainer>
            </MDBCol>
            
          </MDBRow>

      </MDBContainer>
    );
  }
}

export default FormsPage;
