import React, { Component } from 'react';
import { BrowserRouter, Route } from  'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Header from './Header';
import Landing from './Landing';
import Dashboard from './Dashboard';

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
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default connect(null, actions)(App);