import React, { Component } from 'react';
import { connect } from 'react-redux';
import SnippetList from './snippets/SnippetList';

interface Props {
    auth: any;
}

class Dashboard extends Component<Props> {
    renderContent() {
        switch (this.props.auth) {
            case null:
                return '';
            case false:
                return '';                
            default:
                return [
                    <div key="1">
                        <h1>[User]</h1>
                        <a href={this.props.auth.picture}><img alt='User' src={this.props.auth.picture} width="100" height="100" /></a>
                        <p>Name: <b>{this.props.auth.firstName} {this.props.auth.lastName}</b></p>
                        <p>Email: <b>{this.props.auth.email}</b></p>
                        <p>Google ID: <b>{this.props.auth.googleId}</b></p>
                    </div>,
                    <div key="2">
                        <h1>[Snippet List]</h1>
                        <SnippetList key="2"/>
                    </div>
                ];
        }
    }

    render () {
        console.log(this.props);
        return (
            this.renderContent() 
        );
    }
}

function mapStateToProps({ auth }: any) {
    return { auth };
}

export default connect(mapStateToProps)(Dashboard);