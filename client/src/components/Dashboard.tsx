import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
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
                    <div key="1" className="container">                        
                        <div className="row">
                            <div className="col s12">
                                <div className="card horizontal">
                                    <div className="card-content">
                                        <span className="card-title">User Info</span>
                                        <img src={this.props.auth.picture} alt="avatar" 
                                            className="circle left" width="70" height="70"
                                            style={{
                                                verticalAlign: "middle", 
                                                marginBottom: "4px",
                                                marginRight: "10px"}}>
                                        </img>
                                        <div className="right" style={{marginLeft: "20px"}}>
                                            <p>Name: <b>{this.props.auth.firstName} {this.props.auth.lastName}</b></p>
                                            <p>Email: <b>{this.props.auth.email}</b></p>
                                            <p>Google ID: <b>{this.props.auth.googleId}</b></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col s12">
                                <SnippetList key="2"/>
                            </div>
                        </div>
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