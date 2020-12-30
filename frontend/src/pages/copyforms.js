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
    templateValues:new Object(),
    preview:{}
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
      <MDBInput label={beautifyVariable(key)} value={this.state.templateValues[key]} readonly={readonly} onChange={evt => this.updateFormValue(key)(evt)} className="mt-3"/>
    )})}
    </div>
  );

};
updateFormValue = (key) => (evt) => {
  this.state.templateValues[key] =  evt.target.value;
  this.setState({
    templateValues: this.state.templateValues
  });
}
updateTemplateValue(evt){
  this.setState({
    template: evt.target.value
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
                <h2 className="text-center font-weight-bold pt-4 pb-5 mb-2"><strong>Email form  </strong></h2>
               

                <form role="form" action="" method="post">
                  <MDBRow>
                    {this.state.formActivePanel1 == 1 &&
                    (<MDBCol md="12">
                      <h3 className="font-weight-bold pl-0 my-4">
                        <strong>Template</strong></h3>
                        <MDBInput label="Template" type="textarea" id="templatetext" rows="6" value={this.state.template} onChange={evt => this.updateTemplateValue(evt)}/>
                      <MDBBtn color="mdb-color" rounded className="float-right" onClick={this.handleTemplateNextClick}>next</MDBBtn>
                    </MDBCol>)}

                    {this.state.formActivePanel1 == 2 &&
                    (<MDBCol md="12">
                       <h3 className="font-weight-bold pl-0 my-4"><strong>Template</strong></h3>
                        <MDBInput label="Template" type="textarea" id="templatetext" rows="6" value={this.state.template} readonly onChange={evt => this.updateTemplateValue(evt)}/>
                        <h3 className="font-weight-bold pl-0 my-4"><strong>Email</strong></h3> 
                      <MDBInput label="To Email" value={this.state.email} onChange={evt => this.setState({email: evt.target.value})} className="mt-3"/>
                      <MDBInput label="Subject" value={this.state.subject} onChange={evt => this.setState({subject: evt.target.value})} className="mt-3"/>
                      <h3 className="font-weight-bold pl-0 my-4"><strong>Template Values</strong></h3>
                      {this.DynamicFormCreator()}
                      <MDBBtn color="mdb-color" rounded className="float-left" onClick={this.handleNextPrevClick(1)(1)}>previous</MDBBtn>
                      <MDBBtn color="mdb-color" rounded className="float-right" onClick={this.handleTemplateValuesNextClick}>next</MDBBtn>
                    </MDBCol>)}

                    {this.state.formActivePanel1 == 3 &&
                    (<MDBCol md="12">
                       <h3 className="font-weight-bold pl-0 my-4"><strong>Template</strong></h3>
                        <MDBInput label="Template" type="textarea" id="templatetext" rows="6" value={this.state.template} readonly onChange={evt => this.updateTemplateValue(evt)}/>
                        <h3 className="font-weight-bold pl-0 my-4"><strong>Email</strong></h3> 
                      <MDBInput label="To Email" value={this.state.email} readonly onChange={evt => this.setState({email: evt.target.value})} className="mt-3"/>
                      <MDBInput label="Subject" value={this.state.subject} readonly onChange={evt => this.setState({subject: evt.target.value})} className="mt-3"/>
                      <h3 className="font-weight-bold pl-0 my-4"><strong>Template Values</strong></h3>
                      {this.DynamicFormCreator("readonly")}
                      <h3 className="font-weight-bold pl-0 my-4"><strong>Preview</strong></h3>
                      <MDBInput label="Template" type="textarea" id="templatetext" rows="6" value={this.state.preview} readonly/>
                      <MDBBtn color="mdb-color" rounded className="float-left" onClick={this.handleNextPrevClick(1)(2)}>previous</MDBBtn>
                      <MDBBtn color="success" rounded className="float-right" onClick={this.handleSubmission}>submit</MDBBtn>
                     
                    </MDBCol>)}

                    {this.state.formActivePanel1 == 4 &&
                    (<MDBCol md="12">

                      {!this.state.isLoading && (<div><h2 className="text-center font-weight-bold my-4">Email sent!</h2>
                      <MDBInput label="To Email" value={this.state.email} readonly className="mt-3"/>
                      <MDBInput label="Subject" value={this.state.subject} readonly className="mt-3"/>
                      <h3 className="font-weight-bold pl-0 my-4"><strong>Preview</strong></h3>
                      <MDBInput label="Template" type="textarea" id="templatetext" rows="6" value={this.state.preview}/>
                      </div>)}
                      {this.state.isLoading && <h2 className="text-center font-weight-bold my-4">Busy sending</h2>}
                      <MDBBtn color="mdb-color" rounded className="float-right" onClick={this.handleNextPrevClick(1)(1)}>Return to start</MDBBtn>
                      <MDBBtn color="mdb-color" rounded className="float-left" onClick={this.handleNextPrevClick(1)(3)}>previous</MDBBtn>
                    </MDBCol>)}
                  </MDBRow>
                </form>
              </MDBContainer>
              </SectionContainer>
            </MDBCol>
            
          </MDBRow>

        <SectionContainer header='Register' className='row' noBorder>
          <MDBCol md='6'>
            <SectionContainer>
              <form>
                <p className='h5 text-center mb-4'>Sign up</p>
                <div className='grey-text'>
                  <MDBInput
                    label='Your name'
                    icon='user'
                    group
                    type='text'
                    validate
                    error='wrong'
                    success='right'
                  />
                  <MDBInput
                    label='Your email'
                    icon='envelope'
                    group
                    type='email'
                    validate
                    error='wrong'
                    success='right'
                  />
                  <MDBInput
                    label='Confirm your email'
                    icon='exclamation-triangle'
                    group
                    type='text'
                    validate
                    error='wrong'
                    success='right'
                  />
                  <MDBInput
                    label='Your password'
                    icon='lock'
                    group
                    type='password'
                    validate
                  />
                </div>
                <div className='text-center'>
                  <MDBBtn color='primary'>Register</MDBBtn>
                </div>
              </form>
            </SectionContainer>
          </MDBCol>
          <MDBCol md='6'>
            <SectionContainer>
              <form>
                <p className='h5 text-center mb-4'>Sign up</p>
                <label
                  htmlFor='defaultFormRegisterNameEx'
                  className='grey-text'
                >
                  Your name
                </label>
                <input
                  type='text'
                  id='defaultFormRegisterNameEx'
                  className='form-control'
                />
                <br />
                <label
                  htmlFor='defaultFormRegisterEmailEx'
                  className='grey-text'
                >
                  Your email
                </label>
                <input
                  type='email'
                  id='defaultFormRegisterEmailEx'
                  className='form-control'
                />
                <br />
                <label
                  htmlFor='defaultFormRegisterConfirmEx'
                  className='grey-text'
                >
                  Confirm your email
                </label>
                <input
                  type='email'
                  id='defaultFormRegisterConfirmEx'
                  className='form-control'
                />
                <br />
                <label
                  htmlFor='defaultFormRegisterPasswordEx'
                  className='grey-text'
                >
                  Your password
                </label>
                <input
                  type='password'
                  id='defaultFormRegisterPasswordEx'
                  className='form-control'
                />
                <div className='text-center mt-4'>
                  <button className='btn btn-unique' type='submit'>
                    Register
                  </button>
                </div>
              </form>
            </SectionContainer>
          </MDBCol>
        </SectionContainer>

        <SectionContainer header='Subscription' className='row' noBorder>
          <MDBCol md='6'>
            <SectionContainer>
              <form>
                <p className='h5 text-center mb-4'>Subscribe</p>
                <div className='grey-text'>
                  <MDBInput
                    label='Your name'
                    icon='user'
                    group
                    type='text'
                    validate
                    error='wrong'
                    success='right'
                  />
                  <MDBInput
                    label='Your email'
                    icon='envelope'
                    group
                    type='email'
                    validate
                    error='wrong'
                    success='right'
                  />
                </div>
                <div className='text-center'>
                  <MDBBtn outline color='info'>
                    Send <MDBIcon icon='paper-plane' className='ml-1' />
                  </MDBBtn>
                </div>
              </form>
            </SectionContainer>
          </MDBCol>
          <MDBCol md='6'>
            <SectionContainer>
              <form>
                <p className='h5 text-center mb-4'>Subscribe</p>
                <label
                  htmlFor='defaultFormSubscriptionNameEx'
                  className='grey-text'
                >
                  Your name
                </label>
                <input
                  type='text'
                  id='defaultFormSubscriptionNameEx'
                  className='form-control'
                />
                <br />
                <label
                  htmlFor='defaultFormSubscriptionEmailEx'
                  className='grey-text'
                >
                  Your email
                </label>
                <input
                  type='email'
                  id='defaultFormSubscriptionEmailEx'
                  className='form-control'
                />
                <div className='text-center mt-4'>
                  <button className='btn btn-outline-purple' type='submit'>
                    Send
                    <MDBIcon icon='paper-plane' className='ml-2' />
                  </button>
                </div>
              </form>
            </SectionContainer>
          </MDBCol>
        </SectionContainer>

        <SectionContainer header='Contact' className='row' noBorder>
          <MDBCol md='6'>
            <SectionContainer>
              <form>
                <p className='h5 text-center mb-4'>Write to us</p>
                <div className='grey-text'>
                  <MDBInput
                    label='Your name'
                    icon='user'
                    group
                    type='text'
                    validate
                    error='wrong'
                    success='right'
                  />
                  <MDBInput
                    label='Your email'
                    icon='envelope'
                    group
                    type='email'
                    validate
                    error='wrong'
                    success='right'
                  />
                  <MDBInput
                    label='Subject'
                    icon='tag'
                    group
                    type='text'
                    validate
                    error='wrong'
                    success='right'
                  />
                  <MDBInput
                    type='textarea'
                    rows='2'
                    label='Your message'
                    icon='pencil-alt'
                  />
                </div>
                <div className='text-center'>
                  <MDBBtn outline color='secondary'>
                    Send <MDBIcon icon='paper-plane' className='ml-1' />
                  </MDBBtn>
                </div>
              </form>
            </SectionContainer>
          </MDBCol>
          <MDBCol md='6'>
            <SectionContainer>
              <form>
                <p className='h5 text-center mb-4'>Write to us</p>
                <label htmlFor='defaultFormContactNameEx' className='grey-text'>
                  Your name
                </label>
                <input
                  type='text'
                  id='defaultFormContactNameEx'
                  className='form-control'
                />
                <br />
                <label
                  htmlFor='defaultFormContactEmailEx'
                  className='grey-text'
                >
                  Your email
                </label>
                <input
                  type='email'
                  id='defaultFormContactEmailEx'
                  className='form-control'
                />
                <br />
                <label
                  htmlFor='defaultFormContactSubjectEx'
                  className='grey-text'
                >
                  Subject
                </label>
                <input
                  type='text'
                  id='defaultFormContactSubjectEx'
                  className='form-control'
                />
                <br />
                <label
                  htmlFor='defaultFormContactMessageEx'
                  className='grey-text'
                >
                  Your message
                </label>
                <textarea
                  type='text'
                  id='defaultFormContactMessageEx'
                  className='form-control'
                  rows='3'
                />
                <div className='text-center mt-4'>
                  <button className='btn btn-outline-warning' type='submit'>
                    Send
                    <MDBIcon icon='paper-plane' className='ml-2' />
                  </button>
                </div>
              </form>
            </SectionContainer>
          </MDBCol>
        </SectionContainer>

        <SectionContainer header='Within a card' className='row' noBorder>
          <MDBCol md='6'>
            <MDBCard>
              <MDBCardBody>
                <form>
                  <p className='h4 text-center py-4'>Sign up</p>
                  <div className='grey-text'>
                    <MDBInput
                      label='Your name'
                      icon='user'
                      group
                      type='text'
                      validate
                      error='wrong'
                      success='right'
                    />
                    <MDBInput
                      label='Your email'
                      icon='envelope'
                      group
                      type='email'
                      validate
                      error='wrong'
                      success='right'
                    />
                    <MDBInput
                      label='Confirm your email'
                      icon='exclamation-triangle'
                      group
                      type='text'
                      validate
                      error='wrong'
                      success='right'
                    />
                    <MDBInput
                      label='Your password'
                      icon='lock'
                      group
                      type='password'
                      validate
                    />
                  </div>
                  <div className='text-center py-4 mt-3'>
                    <MDBBtn color='cyan' type='submit'>
                      Register
                    </MDBBtn>
                  </div>
                </form>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol md='6'>
            <div className='card mx-xl-5'>
              <div className='card-body'>
                <form>
                  <p className='h4 text-center py-4'>Subscribe</p>
                  <label
                    htmlFor='defaultFormCardNameEx'
                    className='grey-text font-weight-light'
                  >
                    Your name
                  </label>
                  <input
                    type='text'
                    id='defaultFormCardNameEx'
                    className='form-control'
                  />
                  <br />
                  <label
                    htmlFor='defaultFormCardEmailEx'
                    className='grey-text font-weight-light'
                  >
                    Your email
                  </label>
                  <input
                    type='email'
                    id='defaultFormCardEmailEx'
                    className='form-control'
                  />
                  <div className='text-center py-4 mt-3'>
                    <button className='btn btn-outline-purple' type='submit'>
                      Send
                      <MDBIcon icon='paper-plane' className='ml-2' />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </MDBCol>
        </SectionContainer>

        <SectionContainer header='Within a modal' flexCenter>
          <MDBBtn color='info' onClick={this.toggle}>
            Launch modal contact form
          </MDBBtn>
          <MDBModal
            isOpen={modal}
            toggle={this.toggle}
            className='cascading-modal'
          >
            <div className='modal-header primary-color white-text'>
              <h4 className='title'>
                <MDBIcon icon='pencil-alt' /> Contact form
              </h4>
              <button type='button' className='close' onClick={this.toggle}>
                <span aria-hidden='true'>×</span>
              </button>
            </div>
            <MDBModalBody>
              <form className='grey-text'>
                <MDBInput
                  size='sm'
                  label='Your name'
                  icon='user'
                  group
                  type='text'
                  validate
                  error='wrong'
                  success='right'
                />
                <MDBInput
                  size='sm'
                  label='Your email'
                  icon='envelope'
                  group
                  type='email'
                  validate
                  error='wrong'
                  success='right'
                />
                <MDBInput
                  size='sm'
                  label='Subject'
                  icon='tag'
                  group
                  type='text'
                  validate
                  error='wrong'
                  success='right'
                />
                <MDBInput
                  size='sm'
                  type='textarea'
                  rows='2'
                  label='Your message'
                  icon='pencil-alt'
                />
              </form>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={this.toggle}>
                Close
              </MDBBtn>
              <MDBBtn color='primary'>Save changes</MDBBtn>
            </MDBModalFooter>
          </MDBModal>
        </SectionContainer>
      </MDBContainer>
    );
  }
}

export default FormsPage;
