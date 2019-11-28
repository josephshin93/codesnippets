import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchSnippet } from "../../store/actions";
import { State, User, Snippet } from "../../store/types";
import { isEmpty } from "../../lib/lib";

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
          <h5 className="title">{snippet.title}</h5>
          <p>
            <b>Description:</b> {snippet.description} <br />
            <b>Content:</b> {snippet.content} <br />
            <b>OwnerID:</b> {snippet.ownerID} <br />
            <b>OwnerName:</b> {snippet.ownerName} <br />
            <b>OwnerPic:</b> {snippet.ownerPic} <br />
            <b>Status:</b> {snippet.status} <br />
            <b>Team: </b>
            {snippet.team} <br />
            <br />
            <b>Week:</b> {snippet.week} <br />
            <b>TotalComments:</b> {snippet.totalComments} <br />
            <b>TotalLikes:</b> {snippet.totalLikes} <br />
          </p>
        </div>
        <div>
          <Link
            to={{
              pathname: `/snippet/${this.props.snippet.id}`,
              state: {
                foo: this.props.snippet
              }
            }}
          >
            Test
          </Link>
          <Link to={`/snippet/${this.props.snippet.id}`}>
            <h5 className="title">Go</h5>
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
