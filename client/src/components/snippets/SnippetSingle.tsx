import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchSnippet } from "../../store/actions";
import { State, User, Snippet } from "../../store/types";
import { isEmpty } from "../../lib/lib";

interface Props {
  fetchSnippet: (snippetID: string) => void;

  user: User | null;
  snippets: Snippet | null;
}

class SnippetSingle extends Component<Props> {
  render() {
    return <div>Hi</div>;
  }
}

const mapStatetoProps = (state: State) => {
  return {
    user: state.user,
    snippets: state.snippet
  };
};

const mapDispatchToProps = () => {
  return {
    fetchSnippet
  };
};

export default connect(mapStatetoProps, mapDispatchToProps())(SnippetSingle);
