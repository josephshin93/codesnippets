import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchSnippets, 
  searchSnippetList, 
  fetchUsers,
} from '../../store/actions';
import {
  State,
  User,
  Snippet,
} from '../../store/types';
import {
  isEmpty,
} from '../../lib/lib';
import FilterSnippetForm from './filterSnippetForm';



interface SnippetListProps {
  fetchSnippets: (filters?: any) => void;
  fetchUsers: (selectedTeam: any) => void;
  searchSnippetList: (searchText: any) => void;

  snippets: Array<Snippet> | null;
  user: User | null;
  selectedTeam: string | null;
  selectedWeek: any;
}

interface SnippetListState {
  searchText: string;
}


class SnippetList extends Component<SnippetListProps, SnippetListState> {
  
  constructor(props: SnippetListProps) {
    super(props);

    this.state = {
      searchText: '',
    };
  }

  async componentDidMount() {
    // console.log('<SnippetList /> did mount');

    if (this.props.user && !isEmpty(this.props.user)) {
      let team = this.props.selectedTeam;
      let week = this.props.selectedWeek;
      await this.props.fetchSnippets({
        teamSelected: team,
        weekSelected: week
      });
      await this.props.fetchUsers(team);
    }
  }

  renderSearch() {
    return (
      <div className='row'>
        <form onSubmit={(e) => {
          e.preventDefault();
          if (this.state.searchText.length > 0) {
            this.props.searchSnippetList(this.state.searchText);
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
    if (this.props.snippets && this.props.snippets.length > 0) {
      return this.props.snippets.map( (snippet: any) => {
        return (
          <li key={snippet.title} className="collection-item">
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
                <b>Date:</b>{" "}
                {new Date(
                  snippet.timeCreated._seconds * 1000
                ).toLocaleDateString()}{" "}
                <br />
                <b>Week:</b> {snippet.week} <br />
                <b>TotalComments:</b> {snippet.totalComments} <br />
                <b>TotalLikes:</b> {snippet.totalLikes} <br />
              </p>
            </div>
          </li>
        );
      });
    }

    return (
      <li className="collection-item">
        <h5>No snippets to display.</h5>
      </li>
    );
  }


  render() {
    // console.log("snippet list props", this.props);

    return (
      <ul className="collection with-header">
        <li className="collection-header lighten-5 blue">
          <h3>Snippets</h3>
          <span></span>
          <Link
            className="center waves-effect waves-light blue btn"
            to="/newsnippet"
          >
            Add Snippet
          </Link>
        </li>
        <li className='collection-header'>
          {this.renderSearch()}
        </li>
        <FilterSnippetForm />
        {this.renderSnippets()}
      </ul>
    );
  }
}

function mapStateToProps({
  snippets,
  user,
  selectedTeam,
  selectedWeek
}: State) {
  return { snippets, user, selectedTeam, selectedWeek };
}

export default connect(mapStateToProps, { 
  fetchSnippets, 
  searchSnippetList, 
  fetchUsers 
})(
  SnippetList
);
