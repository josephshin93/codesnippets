import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    State,
    User,
} from '../store/stateTypes';

interface HeaderProps {
    user: User | null;
}

class Header extends Component<HeaderProps> {
    

    renderContent() {
        switch (this.props.user) {
            // case null:
            //     return 'Loading...';
            case null:
                return <div><a href="auth/google">Log In</a></div>;
            default:
                return <div>Signed in as: <b>{this.props.user.firstName}</b> – <a href="api/logout">Log Out</a></div>;
        }
    }

    render () {
        // console.log('header props', this.props);
        return (
            this.renderContent() 
        );
    }
}

function mapStateToProps(state: State) {
    return { user: state.user };
}

export default connect(mapStateToProps)(Header);