import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchSnippets } from '../../store/actions';
import {
  State,
  User,
  Snippet,
} from '../../store/types';
import {
  isEmpty,
} from '../../lib/lib';
import Fuse from 'fuse.js';



interface SnippetListProps {
  fetchSnippets: () => void;
  snippets: Array<Snippet> | null;
  user: User | null;
}

interface SnippetListState {
  snippets: Array<Snippet>;
  searchText: string;
}

interface FuseOptions {
  shouldSort: boolean;
  tokenize: boolean;
  keys: Array<string>;
}

const fuseOpts: FuseOptions = {
  shouldSort: true,
  tokenize: true,
  keys: [
    'title',
    'content',
    'description',
    'ownerName', 
  ],
};

class SnippetList extends Component<SnippetListProps, SnippetListState> {
  fuse: Fuse<Snippet, FuseOptions> | null = null;
  
  constructor(props: SnippetListProps) {
    super(props);

    this.state = {
      snippets: props.snippets ? props.snippets : [],
      searchText: '',
    };
  }

  async componentDidMount() {
    // console.log('<SnippetList /> did mount');
    if (this.props.user && !isEmpty(this.props.user)) {
      await this.props.fetchSnippets();
      if (this.props.snippets) {
        this.setState({
          snippets: this.props.snippets,
        });
        this.fuse = new Fuse(this.props.snippets, fuseOpts);
      }
    }
  }

  renderSearch() {
    return (
      <div className='row'>
        <form onSubmit={(e) => {
          e.preventDefault();
          if (this.fuse) {
            let results: Array<Snippet> = this.props.snippets || [];
            if (this.state.searchText.length > 0) {
              results = this.fuse.search(this.state.searchText);
            }
            this.setState({
              snippets: results,
            });
          } else {
            console.error('Fuse search is not initialized');
          }
        }}>
          <input 
            className='col s9' 
            type='text' 
            placeholder='Search within current list of snippets' 
            value={this.state.searchText}
            onChange={(e) => {
              e.preventDefault();
              this.setState({
                searchText: e.target.value,
              });
            }} 
          />
          <input className='col s2 push-s1 btn waves-effect waves-light' type='submit' value='Search' />
        </form>
      </div>
    );
  }

  renderSnippets() {
    if (this.state.snippets && this.state.snippets.length > 0) {
      return this.state.snippets.map( (snippet: any) => {
        return (
          <li key={snippet.title} className='collection-item'>
            <div>
              <h3 className='title'>Title: {snippet.title}</h3>
              <p>
                <b>Content:</b> { snippet.content } <br />
                <b>Description:</b> { snippet.description } <br />
                <b>OwnerID:</b> { snippet.ownerID } <br />
                <b>OwnerName:</b> { snippet.ownerName } <br />
                <b>OwnerPic:</b> { snippet.ownerPic } <br />
                <b>Status:</b> { snippet.status } <br />
                <b>Team: </b>{ snippet.team } <br />
                <b>Snippet:</b> {
                  new Date(snippet.timeCreated._seconds * 1000).toLocaleDateString() 
                } <br />
                <b>TotalComments:</b> { snippet.totalComments } <br />
                <b>TotalLikes:</b> { snippet.totalLikes } <br />
              </p>
            </div>
          </li>
        );
      });
    }
    
    return (
      <li className='collection-item'>
        <h5>No snippets to display.</h5>
      </li>
    )
  }
  
  render() {
    // console.log("snippet list props", this.props);

    return (
      <ul className='collection with-header'>
        <li className='collection-header lighten-5 blue'>
          <h1>Snippets</h1> 
          <Link 
            className='waves-effect waves-light blue btn' 
            to='/newsnippet'
          >
            Add Snippet
          </Link>
        </li>
        <li className='collection-header'>
          {this.renderSearch()}
        </li>
        {this.renderSnippets()}
      </ul>
    );
  }
}

function mapStateToProps({ snippets, user }: State) {
  return { snippets, user };
}

export default connect(mapStateToProps, { fetchSnippets })(SnippetList);
