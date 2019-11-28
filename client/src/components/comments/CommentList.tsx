import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchComments } from "../../store/actions";
import { State, User, Comment } from "../../store/types";

interface CommentListProps {
  fetchComments: (snippetId: string) => void;
  user: User | null;
  comments: Array<Comment> | null;
}

interface PassedProps {
  snippetId: string;
}

type AllProps = CommentListProps & PassedProps;

class CommentList extends Component<AllProps> {
  constructor(props: AllProps) {
    super(props);
  }

  componentDidMount() {
    console.log("<CommentList/> did mount");
    console.log("Snippet id = " + this.props.snippetId);
    if (this.props.user && this.props.snippetId) {
      console.log("inside");
      this.props.fetchComments(this.props.snippetId);
    }
  }

  renderComments() {
    if (this.props.comments) {
      return this.props.comments.map((comment: any) => (
        <ul>{comment.comment}</ul>
      ));
    }
  }

  render() {
    return <div>Comments!</div>;
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
    fetchComments
  };
};

export default connect(mapStateToProps, mapDispatchToProps())(CommentList);
