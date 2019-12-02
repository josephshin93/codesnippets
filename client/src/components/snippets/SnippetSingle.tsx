import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchSnippet } from "../../store/actions";
import { State, User, Snippet } from "../../store/types";

interface Props {
  fetchSnippet: (snippetID: string) => void;

  user: User | null;
}

interface PassedProps {
  snippet: Snippet;
}

// https://stackoverflow.com/questions/56963211/how-to-correctly-use-connect-in-react-redux-with-typescript
type AllProps = PassedProps & Props;

class SnippetSingle extends Component<AllProps> {
  constructor(props: AllProps) {
    super(props);
  }

  render() {
    const { snippet } = this.props;
    return (
      <li className="collection-item">
        <div>
          <h6 className="title">
            <b>{snippet.title}</b>
          </h6>
          <div className="truncate">
            <b>Description:</b> {snippet.description} <br />
          </div>
          <div className="truncate">
            <b>Content:</b> {snippet.content} <br />
          </div>
          <b>OwnerID:</b> {snippet.ownerId} <br />
          <b>OwnerName:</b> {snippet.ownerFirstName} {snippet.ownerLastName}{" "}
          <br />
          <b>OwnerPic:</b> {snippet.ownerPicture} <br />
          <b>Status:</b> {snippet.status} <br />
          <b>Team: </b>
          {snippet.team} <br />
          <br />
          <b>Week:</b> {snippet.week} <br />
          <b>TotalComments:</b> {snippet.totalComments} <br />
          <b>TotalLikes:</b> {snippet.totalLikes} <br />
        </div>
        <div>
          <Link
            to={{
              pathname: `/snippet/${this.props.snippet.id}`,
              state: {
                snippet: this.props.snippet
              }
            }}
          >
            <h5>Test</h5>
          </Link>
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
