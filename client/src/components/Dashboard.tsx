import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
    State,
    User
} from '../store/types'

import SnippetList from './snippets/SnippetList';


interface DashboardProps {
    user: User | null;
}

class Dashboard extends Component<DashboardProps> {
    render () {
        if (this.props.user) {
            return [
                <div key="1">
                    <h1>[User]</h1>
                    <a href={this.props.user.picture}><img alt='User' src={this.props.user.picture} width="100" height="100" /></a>
                    <p>Name: <b>{this.props.user.firstName} {this.props.user.lastName}</b></p>
                    <p>Email: <b>{this.props.user.email}</b></p>
                    <p>Google ID: <b>{this.props.user.googleId}</b></p>
                </div>,
                <div key="2">
                    <h1>[Snippet List]</h1>
                    <Link to="/newsnippet">New Snippet</Link>
                    <SnippetList key="2"/>
                </div>
            ];
        }
        return '';
    }
}

const mapStateToProps = (state: State) => {
    return { user: state.user };
}

export default connect(mapStateToProps)(Dashboard);