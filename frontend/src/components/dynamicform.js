import React from 'react';
import './components.css';

const DynamicForm = ({ state }) => {
  const beautifyVariable = (variableName) =>{
    var str = variableName.toString().split("_").map((el)=>{return el.charAt(0).toUpperCase()  + el.slice(1);}).join(" ");
    alert(str);
    return str;
  };
  const keyValues = Object.keys(state.templatevalues).map( (key, ind) => {return (
    <MDBInput label="beautifyVariable(key)" value={state.templatevalues[key]} className="mt-3"/>
  )});
  return (
    {keyValues}
  );
               
};

export default DynamicForm;
