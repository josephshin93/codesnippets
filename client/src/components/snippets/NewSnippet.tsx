import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import AddSnippetForm from "./AddSnippetForm";
import { State, User } from "../../store/types";

interface Props {
  // TODO: Typescript format
  addSnippet: (values: any) => void;
  user: User | null;
}

class NewSnippet extends Component<Props> {
  // Create options for Team select dropdown
  createListItems() {
    if (this.props.user && this.props.user.teams) {
      let teams = this.props.user.teams;
      return Object.keys(teams).map(keyString => {
        // Follow User interface property
        let k = Number(keyString);
        return (
          <option key={k} value={teams[k]}>
            {teams[k]}
          </option>
        );
      });
    } else
      return (
        <option key={0} value="Personal">
          Personal
        </option>
      );
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
                user={this.props.user}
              />
            }
          </div>
        </div>
      </div>
    );
  }
}

function mapStatetoProps(state: State) {
  return { user: state.user };
}

export default connect(mapStatetoProps, actions)(NewSnippet);
