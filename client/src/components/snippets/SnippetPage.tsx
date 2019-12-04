import React, { Component } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, match } from "react-router-dom";
import * as H from "history";
import { State, User } from "../../store/types";
import { withRouter } from "react-router";
import CommentList from "../comments/CommentList";
import { fetchSnippet } from "../../store/actions";
import { isEmpty } from "../../lib/lib";
import moment from "moment";

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
  }

  renderTime(document: any) {
    if (document && document.timeCreated) {
      const secs = new Date(document.timeCreated._seconds * 1000);
      return moment(secs).format("lll");
    }
  }

  render() {
    const user = this.props.user;
    const snippet = this.props.location.state.snippet;
    if (user && !isEmpty(user) && typeof snippet.id !== "undefined") {
      console.log("snippet.ownerPicture is " + snippet.ownerPicture);
      return (
        <div className="container">
          <div className="row">
            <div className="col s12">
              <ul className="collection with-header">
                <li className="collection-header avatar">
                  <h5>
                    {snippet.title}{" "}
                    <span>
                      {" "}
                      <i className="tiny material-icons">fiber_manual_record</i>
                    </span>{" "}
                    {snippet.status}
                  </h5>
                  <img
                    src={snippet.ownerPicture}
                    alt="avatar"
                    className="circle"
                    width="25"
                    height="25"
                    style={{
                      verticalAlign: "middle",
                      marginBottom: "4px",
                      marginRight: "10px"
                    }}
                  ></img>
                  <span style={{ fontWeight: "bold", fontSize: "small" }}>
                    {snippet.ownerFirstName}{" "}
                  </span>{" "}
                  <span style={{ fontSize: "x-small" }}>
                    ({this.renderTime(snippet)})
                  </span>
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
                <ul>
                  <CommentList key={snippet.id} snippetId={snippet.id} />
                </ul>
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
