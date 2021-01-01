import React from 'react';
import { Route, Switch } from 'react-router-dom';

import FormsPage from './pages/FormsPage';


class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={FormsPage} />
       
        
        <Route
          render={function() {
            return <h1>Not Found</h1>;
          }}
        />
      </Switch>
    );
  }
}

export default Routes;
