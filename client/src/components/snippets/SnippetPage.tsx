import React, { Component } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, match } from "react-router-dom";
import * as H from "history";
import { State, User } from "../../store/types";
import { withRouter } from "react-router";
import CommentList from "../comments/CommentList";
import { fetchSnippet } from "../../store/actions";
import { isEmpty } from "../../lib/lib";

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

  // CommentTitle / Status [ ]
  // OwnerPicture OwnerName / TeamName
  // TimeCreated / WeekNumber
  // Description
  // ContentBox
  // CommentBox
  // AddCommentForm

  render() {
    const user = this.props.user;
    const snippet = this.props.location.state.snippet;
    console.log("SNIPPET " + snippet);
    if (user && !isEmpty(user) && typeof snippet.id !== "undefined") {
      console.log("snippet.ownerPicture is " + snippet.ownerPicture);
      return (
        <div className="container">
          <div className="row">
            <div className="col s12">
              <ul className="collection with-header">
                <li className="collection-header avatar">
                  <h5>
                    {snippet.title} | {snippet.status}
                  </h5>
                  <img
                    src={snippet.ownerPicture}
                    alt="avatar"
                    className="circle"
                    width="40"
                    height="40"
                    style={{
                      verticalAlign: "middle",
                      marginBottom: "4px",
                      marginRight: "10px"
                    }}
                  ></img>
                  {snippet.ownerName}
                  <br></br>
                  {snippet.description}
                </li>
                <li
                  className="collection-item"
                  style={{
                    whiteSpace: "pre-wrap"
                  }}
                >
                  {snippet.content}
                </li>
              </ul>
            </div>
            <div className="col s12">
              <ul className="collection with-header">
                <li>
                  <CommentList key={snippet.id} snippetId={snippet.id} />
                </li>
              </ul>
            </div>
            <br />
          </div>
        </div>
      );
    } else {
      return <div>Nothing here</div>;
    }
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
