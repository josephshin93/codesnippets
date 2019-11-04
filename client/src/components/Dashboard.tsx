import React, { Component } from 'react';
import { connect } from 'react-redux';

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
                return <div>
                    <h1>User: </h1>
                    <p>Name: <b>{this.props.auth.firstName} {this.props.auth.lastName}</b></p>
                    <p>Email: <b>{this.props.auth.email}</b></p>
                    <p>Google ID: <b>{this.props.auth.googleId}</b></p>
                    <p>Picture:</p>
                    <a href={this.props.auth.picture}><img alt='' src={this.props.auth.picture} title="" width="600" height="400" /></a>
                </div>;
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