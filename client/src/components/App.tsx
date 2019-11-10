import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from  'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../store/actions';

import ProtectedRoute from './ProtectedRoute';
import Header from './Header';
import Landing from './Landing';
import Dashboard from './Dashboard';
import NewSnippet from './snippets/NewSnippet';


interface AppProps {
    authorizeUser: () => void;
}

class App extends Component<AppProps> {
    componentDidMount() {
        this.props.authorizeUser();
    }

    render() {
        this.props.authorizeUser();
        return (
            <BrowserRouter>
                <div>
                    <Header/>
                    <Switch>
                        <Route exact path='/' component={Landing} />
                        <ProtectedRoute exact path='/dashboard' component={Dashboard} />  
                        <ProtectedRoute exact path='/newsnippet' component={NewSnippet} /> 
                        <Route render={() => (<h3>Sorry, this page does not exist.</h3>)} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}


const mapDispatchToProps = (dispatch: any) => {
    return {
        authorizeUser: () => { dispatch(actions.authorizeUser()); }
    }
};

export default connect(null, mapDispatchToProps)(App);