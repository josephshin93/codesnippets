import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";

interface Props {
  addTeam: (values: any) => void;
  history: any;
  auth: any;
}

class NewTeam extends Component<Props> {
  handleSubmit = (event: any) => {
    event.preventDefault();
    
    this.props.addTeam({
      name: event.target[0].value,
      members: {
        [this.props.auth.id]: this.props.auth.firstName + " " + this.props.auth.lastName
      },
      roles: {
        [this.props.auth.id]: "admin"
      }
    });

    // TODO FIX THIS...
    setTimeout(() => {
      this.props.history.push("/dashboard");
    }, 500);
  };

  render() {
    return (
      <div>
        <h1>New Team</h1>
        <form onSubmit={this.handleSubmit}>
          Name:
          <br />
          <input type="text" name="name"></input>
          <br />
          <button>Submit</button>
        </form>
      </div>
    );
  }
}

function mapStatetoProps({ auth }: any) {
  return { auth };
}

export default connect(
  mapStatetoProps,
  actions
)(NewTeam);
