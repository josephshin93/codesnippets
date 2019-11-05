import React, { Component } from 'react';
import { connect } from 'react-redux';

interface Props {
    auth: any;
}

class Header extends Component<Props> {
    renderContent() {
        switch (this.props.auth) {
            case null:
                return 'Loading...';
            case false:
                return <div><a href="auth/google">Log In</a></div>;
            default:
                return <div>Signed in as: <b>{this.props.auth.firstName}</b> – <a href="api/logout">Log Out</a></div>;
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

export default connect(mapStateToProps)(Header);