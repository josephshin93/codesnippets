import React, { Component } from "react";
// import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { State, User } from "../store/types";

import SnippetList from "./snippets/SnippetList";
import TeamNavigation from "./teams/TeamNavigation";

interface DashboardProps {
  user: User | null;
}

class Dashboard extends Component<DashboardProps> {
  render() {
    if (this.props.user) {
      return [
        <div key="1" className="container">
          <div className="row">
            <div className="col s12">
              <div className="card horizontal">
                <div className="card-content">
                  <span className="card-title">User Info</span>
                  <img
                    src={this.props.user.picture}
                    alt="avatar"
                    className="circle left"
                    width="70"
                    height="70"
                    style={{
                      verticalAlign: "middle",
                      marginBottom: "4px",
                      marginRight: "10px"
                    }}
                  ></img>
                  <div className="right" style={{ marginLeft: "20px" }}>
                    <p>
                      Name:{" "}
                      <b>
                        {this.props.user.firstName} {this.props.user.lastName}
                      </b>
                    </p>
                    <p>
                      Email: <b>{this.props.user.email}</b>
                    </p>
                    <p>
                      Google ID: <b>{this.props.user.googleId}</b>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              <SnippetList key="2" />
            </div>
          </div>
          <div className='row'>
            <div className='col s12'>
              <TeamNavigation />
            </div>
          </div>
        </div>
      ];
    }
    return "";
  }
}

const mapStateToProps = (state: State) => {
  return { user: state.user };
};

export default connect(mapStateToProps)(Dashboard);
