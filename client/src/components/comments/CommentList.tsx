import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchComments, addComment, deleteComment } from "../../store/actions";
import { State, User, Comment } from "../../store/types";
import { isEmpty } from "../../lib/lib";
import AddCommentForm from "./AddCommentForm";

interface CommentListProps {
  fetchComments: (snippetId: string) => void;
  user: User | null;
  comments: Array<Comment> | null;
}

interface PassedProps {
  snippetId: string;
}

interface IMapDispatchToProps {
  addComment: (values: any) => void;
  deleteComment: (snippetId: string, commentId: string) => void;
}

type AllProps = CommentListProps & PassedProps & IMapDispatchToProps;

class CommentList extends Component<AllProps> {
  constructor(props: AllProps) {
    super(props);
  }

  componentDidMount() {
    console.log("<CommentList/> did mount");
    if (this.props.user && !isEmpty(this.props.user) && this.props.snippetId) {
      console.log(
        "Google ID = " +
          this.props.user.googleId +
          " Snippet ID = " +
          this.props.snippetId
      );
      this.props.fetchComments(this.props.snippetId);
    }
  }

  // TODO: create renderButton
  // Conditional remove button if comment userId matches current userId
  // On action shows alert for now
  renderButton(commentId: string, commentUserId: string, googleId: string) {
    console.log(
      "commentId: " +
        commentId +
        " commentUserId: " +
        commentUserId +
        " googleId: " +
        googleId
    );
    // Better chec
    if (commentUserId === googleId) {
      return (
        /*
        <span>
          <i disabled="" className="material-icons">clear</i>
        </span>
        */
        <button
          type="button"
          className="material-icons"
          onClick={() =>
            this.props.deleteComment(this.props.snippetId, commentId)
          }
        >
          clear
        </button>
      );
    }
    // If this user matches the comment
  }

  renderComments() {
    const user = this.props.user;
    if (user === null) return;
    if (this.props.comments && this.props.comments.length > 0) {
      return this.props.comments.map((comment: any) => (
        <ul className="collection-item avatar" key={comment.id}>
          <img
            src={user.picture}
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
          {comment.comment} ---
          <span>
            {this.renderButton(comment.id, comment.googleId, user.googleId)}
          </span>
        </ul>
      ));
    }
  }

  render() {
    return (
      <div>
        Comments!
        {this.renderComments()}
        <br />
        <AddCommentForm
          snippetId={this.props.snippetId}
          addComment={this.props.addComment}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: State, passedProps: PassedProps) => {
  return {
    user: state.user,
    comments: state.comments
  };
};

const mapDispatchToProps = () => {
  return {
    fetchComments,
    addComment,
    deleteComment
  };
};

export default connect(mapStateToProps, mapDispatchToProps())(CommentList);
