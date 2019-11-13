import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";
import AddSnippetForm from "./AddSnippetForm";

interface Props {
  // TODO: Typescript format
  addSnippet: (values: any) => void;
  history: any;
  auth: any;
  teams: any;
}

class NewSnippet extends Component<Props> {
  // Create options for Team select dropdown
  createListItems() {
    if (this.props.auth) {
      let teams = this.props.auth.teams;
      return Object.keys(teams).map(k => {
        return (
          <option key={k} value={teams[k]}>
            {teams[k]}
          </option>
        );
      });
    } else return null;
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col s12">
            <h3>New Snippet</h3>
            {
              <AddSnippetForm
                teams={this.createListItems()}
                addSnippet={this.props.addSnippet}
                auth={this.props.auth}
                history={this.props.history}
              />
            }
          </div>
        </div>
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
