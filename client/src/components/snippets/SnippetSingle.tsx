import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchSnippet } from "../../store/actions";
import { State, User, Snippet } from "../../store/types";
import moment from "moment";

interface Props {
  fetchSnippet: (snippetID: string) => void;

  user: User | null;
}

interface PassedProps {
  snippet: Snippet;
  updateSnippetLikes: (snippetId: string) => void;
  updateSnippetDislikes: (snippetId: string) => void;
}

// https://stackoverflow.com/questions/56963211/how-to-correctly-use-connect-in-react-redux-with-typescript
type AllProps = PassedProps & Props;

class SnippetSingle extends Component<AllProps> {
  renderTime(document: any) {
    if (document && document.timeCreated) {
      const secs = new Date(document.timeCreated._seconds * 1000);
      return moment(secs).format("lll");
    }
  }

  // Render Like button
  renderLikeButton(snippet: Snippet) {
    if (snippet && this.props.user) {
      return (
        <button
          style={{
            padding: "0",
            border: "none",
            background: "none",
            color:
              this.props.user &&
              (typeof snippet.likes === "undefined" ||
                !snippet.likes.includes(this.props.user.googleId))
                ? "black"
                : "red"
          }}
          type="button"
          onClick={e => {
            e.preventDefault();
            if (
              this.props.user &&
              (typeof snippet.likes === "undefined" ||
                !snippet.likes.includes(this.props.user.googleId))
            ) {
              // Increment
              this.props.updateSnippetLikes(snippet.id);
            } else {
              // Decrement
              this.props.updateSnippetDislikes(snippet.id);
            }
          }}
        >
          <i className="material-icons" style={{ fontSize: "18px" }}>
            thumb_up
          </i>
        </button>
      );
    }
  }

  render() {
    const { snippet } = this.props;
    return (
      <li className="collection-item">
        <div>
          <Link
            to={{
              pathname: `/snippet/${this.props.snippet.id}`,
              state: {
                snippet: this.props.snippet
              }
            }}
          >
            <span className="blue-text text-darken-3">
              <h5 className="title">{snippet.title}</h5>
            </span>
          </Link>
          <img
            src={snippet.ownerPicture}
            alt="avatar"
            className="circle"
            width="50"
            height="50"
            style={{
              verticalAlign: "middle",
              marginBottom: "4px",
              marginRight: "10px"
            }}
          ></img>
          <span>
            <b>{snippet.ownerFirstName}</b>{" "}
            <span style={{ fontSize: "small" }}>
              ({this.renderTime(snippet)})
            </span>
          </span>
          <br />
          <b>Team:</b> {snippet.team ? snippet.team.teamName : "Personal"}
          <div className="truncate">
            <b>Description:</b> {snippet.description} <br />
          </div>
          <div className="truncate">
            <b>Content:</b> {snippet.content} <br />
          </div>
          <b>Status:</b> {snippet.status} <br />
          <b>Week:</b> {snippet.week} <br />
          {/* <i className="tiny material-icons offset-s1">textsms</i> {}
          <span>{snippet.totalComments} &nbsp; &nbsp; </span>
          <i className="tiny material-icons">thumb_up</i> {snippet.totalLikes}{" "} */}
          <br />
          {this.renderLikeButton(snippet)} {snippet.totalLikes}
        </div>
      </li>
    );
  }
}

const mapStatetoProps = (state: State, passedProps: PassedProps) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = () => {
  return {
    fetchSnippet
  };
};

export default connect(mapStatetoProps, mapDispatchToProps())(SnippetSingle);
