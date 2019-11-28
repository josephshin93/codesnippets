import React, { Component } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, match } from "react-router-dom";
import * as H from "history";
import { State, User } from "../../store/types";
import { withRouter } from "react-router";
import CommentList from "../comments/CommentList";
import { fetchSnippet } from "../../store/actions";

interface MatchParams {
  snippetId?: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  fetchSnippet: (snippetId: string) => void;

  user: User | null;
  match: match<MatchParams>;
  location: H.Location;
}

class SnippetPage extends Component<Props> {
  componentDidMount() {
    console.log("<SnippetPage /> did mount");
    //this.getParams();
    // const { foo } = this.props.location;
    // console.log(this.props.location.state.snippet);
    // 1. Get the snippet ID
    // 2. Fetch the snippet
  }

  /*
  getParams() {
    const matchParams: SnippetPageMatchParams = this.props.match.params;
    if (matchParams.snippetId) {
      return matchParams.snippetId;
    }
  }
  */

  render() {
    const snippet = this.props.location.state.snippet;
    return (
      <div>
        This is the Snippet page for {snippet.title}
        <CommentList key={snippet.id} snippetId={snippet.id} />
      </div>
    );
  }
}

const mapDispatchToProps = () => {
  return {
    fetchSnippet
  };
};

const mapStatetoProps = (state: State) => {
  return {
    user: state.user
  };
};

export default withRouter(
  connect(mapStatetoProps, mapDispatchToProps())(SnippetPage)
);
