import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchSnippets } from '../../store/actions';
import { State } from '../../store/types';


interface Props {
  fetchSnippets: () => void;
  snippets: any;
}

class SnippetList extends Component<Props> {
  componentDidMount() {
    this.props.fetchSnippets();
  }

  renderSnippets() {
    return this.props.snippets.map( (snippet: any) => {
      return (
        
        <li key={snippet.title} className="collection-item">
          <div>
            <h3 className="title">Title: {snippet.title}</h3>
            <p>
              <b>Content:</b> { snippet.content } <br />
              <b>Description:</b> { snippet.description } <br />
              <b>OwnerID:</b> { snippet.ownerID } <br />
              <b>OwnerName:</b> { snippet.ownerName } <br />
              <b>OwnerPic:</b> { snippet.ownerPic } <br />
              <b>Status:</b> { snippet.status } <br />
              <b>Team: </b>{ snippet.team } <br />
              <b>Snippet:</b> {new Date(snippet.timeCreated._seconds * 1000).toLocaleDateString() } <br />
              <b>TotalComments:</b> { snippet.totalComments } <br />
              <b>TotalLikes:</b> { snippet.totalLikes } <br />
            </p>
          </div>
        </li>
      )
    })
  }
  
  // FIXME: render method called 4 times for any update to state
  render() {
    // console.log("snippet list props", this.props);
    return (
      <ul className="collection with-header">
        <li className="collection-header lighten-5 blue">
          <h1>Snippets</h1> 
          <Link className="waves-effect waves-light blue btn" to="/newsnippet">Add Snippet</Link>
        </li>
        {this.renderSnippets()}
      </ul>
    );
  }
}

function mapStateToProps({ snippets }: State) {
  return { snippets };
}

export default connect(mapStateToProps, { fetchSnippets })(SnippetList);
