import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchComments, addComment, deleteComment } from "../../store/actions";
import { State, User, Comment } from "../../store/types";
import { isEmpty } from "../../lib/lib";
import AddCommentForm from "./AddCommentForm";
import moment from "moment";

interface CommentListProps {
  fetchComments: (snippetId: string) => void;
  user: User | null;
  comments: Array<Comment> | null;
  selectedComment: string;
}

interface CommentListState {
  comments: Array<Comment>;
}

interface PassedProps {
  snippetId: string;
}

interface IMapDispatchToProps {
  addComment: (values: any) => void;
  deleteComment: (snippetId: string, commentId: string) => void;
}

type AllProps = CommentListProps & PassedProps & IMapDispatchToProps;

class CommentList extends Component<AllProps, CommentListState> {
  constructor(props: AllProps) {
    super(props);

    this.state = {
      comments: props.comments ? props.comments : []
    };
  }

  async componentDidMount() {
    if (this.props.user && !isEmpty(this.props.user) && this.props.snippetId) {
      await this.props.fetchComments(this.props.snippetId);

      if (this.props.comments) {
        this.setState({
          comments: this.props.comments
        });
      }
    }
  }

  // Update comment state from form
  updateCommentState(content: string, time: Date) {
    const newCommentId = this.props.selectedComment;
    const user = this.props.user;
    //console.log("newCommenId after update is ", this.props.selectedComment);
    //console.log(time);
    if (newCommentId && user) {
      const comment: Comment = {
        id: newCommentId,
        googleId: user.googleId,
        userPicture: user.picture,
        userFirstName: user.firstName,
        comment: content,
        snippetId: this.props.snippetId,
        timeCreated: time
      };
      this.setState({
        comments: [...this.state.comments, comment]
      });
    }
  }

  // TODO: create renderButton
  // Conditional remove button if comment userId matches current userId
  // On action shows alert for now
  renderButton(commentId: string, commentUserId: string, googleId: string) {
    // Better chec
    if (commentUserId === googleId) {
      return (
        <button
          style={{
            padding: "0",
            border: "none",
            background: "none"
          }}
          type="button"
          className="material-icons"
          onClick={() => {
            this.props.deleteComment(this.props.snippetId, commentId);
            this.setState({
              comments: this.state.comments.filter(
                comment => comment.id !== commentId
              )
            });
          }}
        >
          clear
        </button>
      );
    }
    // If this user matches the comment
  }

  // Render time
  renderTime(document: any) {
    if (document && document.timeCreated._seconds) {
      const secs = new Date(document.timeCreated._seconds * 1000);
      return moment(secs).format("lll");
    } else {
      return moment(document.timeCreated).format("lll");
    }
  }

  renderComments() {
    const user = this.props.user;
    if (user === null) return;
    if (this.state.comments && this.state.comments.length > 0) {
      return this.state.comments.map((comment: any) => (
        <ul
          style={{
            whiteSpace: "pre-wrap"
          }}
          className="collection-header avatar"
          key={comment.id}
        >
          <img
            src={comment.userPicture}
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
            {comment.userFirstName}{" "}
          </span>{" "}
          <span style={{ fontSize: "x-small" }}>
            ({this.renderTime(comment)})
          </span>
          <span className="right">
            {this.renderButton(comment.id, comment.googleId, user.googleId)}
          </span>
          <br />
          {comment.comment}
        </ul>
      ));
    }
  }

  render() {
    return (
      <div>
        {this.renderComments()}
        <br />
        <AddCommentForm
          snippetId={this.props.snippetId}
          addComment={this.props.addComment}
          fetchComments={this.props.fetchComments}
          selectedComment={this.props.selectedComment}
          updateCommentState={this.updateCommentState.bind(this)}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: State, passedProps: PassedProps) => {
  return {
    user: state.user,
    comments: state.comments,
    selectedComment: state.selectedComment
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
