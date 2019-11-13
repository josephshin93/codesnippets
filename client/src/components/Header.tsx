import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    State,
    User,
} from '../store/types';


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
                return [
                    
                    <li key="1">
                        <img src={this.props.auth.picture} alt="avatar" 
                            className="circle" width="25" height="25"
                            style={{
                                verticalAlign: "middle", 
                                marginBottom: "4px", 
                                marginRight: "10px"}}>
                        </img>
                        {this.props.auth.firstName}
                    </li>,
                    <li key="2"><a style={{fontWeight: "bold"}} href="api/logout">Log Out</a></li>
                ];
        }
    }

    render () {
        return (
            <nav>
                <div className="nav-wrapper blue">
                
                    <Link to="/dashboard" className="left brand-logo">
                        <i className="material-icons" style={{marginLeft: "15px"}}>bubble_chart</i>
                        Boba
                    </Link>
                    <ul className="right">
                        {this.renderContent()} 
                    </ul>                    
                </div>
            </nav>
        );
    }
}

const mapStateToProps = (state: State) => {
    return { user: state.user };
}

export default connect(mapStateToProps)(Header);