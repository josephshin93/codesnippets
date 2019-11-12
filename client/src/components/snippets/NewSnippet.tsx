import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";

interface Props {
  addSnippet: (values: any) => void;
  history: any;
  auth: any;
}

class NewSnippet extends Component<Props> {
  handleSubmit = (event: any) => {
    event.preventDefault();
    // console.log(event.target[0].value);
    this.props.addSnippet({
      title: event.target[0].value,
      content: event.target[1].value,
      description: event.target[2].value,
      status: event.target[3].value,
      team: event.target[4].value,
      ownerID: this.props.auth.googleId,
      ownerName: this.props.auth.firstName + " " + this.props.auth.lastName
    });

    // TODO FIX THIS...
    setTimeout(() => {
      this.props.history.push("/dashboard");
    }, 500);
  };

  render() {
    return (
      <div>
        <h1>New Snippet</h1>
        <form onSubmit={this.handleSubmit}>
          Title:
          <br />
          <input type="text" name="title"></input>
          <br />
          Content:
          <br />
          <input type="text" name="content"></input>
          <br />
          Description:
          <br />
          <input type="text" name="description"></input>
          <br />
          Status:
          <br />
          <input type="text" name="status"></input>
          <br />
          Team:
          <br />
          <input type="text" name="team"></input>
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
)(NewSnippet);
