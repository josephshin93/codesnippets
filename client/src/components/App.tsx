import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from  'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../store/actions';
import {
  State,
  User,
} from '../store/types';

import ProtectedRoute from './ProtectedRoute';
import Header from './Header';
import Landing from './Landing';
import Dashboard from './Dashboard';
import NewSnippet from './snippets/NewSnippet';
import TeamForm from './teams/TeamForm';


interface AppProps {
  authorizeUser: () => void;
  user: User | null;
}

class App extends Component<AppProps> {
  componentDidMount() {
    // console.log('<App /> did mount');
    this.props.authorizeUser();
  }

  componentDidUpdate() {
    // console.log('<App /> did update');
    if (!this.props.user) this.props.authorizeUser();
  }

  render() {
    // console.log('<App /> rendering');
    return (
      <BrowserRouter>
        <div>
          <Header/>
          <Switch>
            <Route exact path='/' component={Landing} />
            <ProtectedRoute exact path='/dashboard' component={Dashboard} />  
            <ProtectedRoute exact path='/newsnippet' component={NewSnippet} />
            <ProtectedRoute exact path='/new-team' component={TeamForm} />
            <Route render={() => (<h3>Sorry, this page does not exist.</h3>)} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state: State) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        authorizeUser: () => { dispatch(actions.authorizeUser()); }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
