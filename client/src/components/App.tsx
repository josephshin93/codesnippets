import React, { Component } from 'react';
import { BrowserRouter, Route } from  'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Header from './Header';
import Landing from './Landing';
import Dashboard from './Dashboard';
import NewSnippet from './snippets/NewSnippet';
import NewTeam from './teams/NewTeam';

interface Props {
    fetchUser: () => void;
}

class App extends Component<Props> {
    componentDidMount() {
        this.props.fetchUser();
    }

    render() {
        return (
            <div>
                <BrowserRouter>
                    <div>
                        <Header/>
                        <Route exact path="/" component={Landing} />  
                        <Route exact path="/dashboard" component={Dashboard} />  
                        <Route exact path="/newsnippet" component={NewSnippet} />  
                        <Route exact path="/newteam" component={NewTeam} />  
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default connect(null, actions)(App);