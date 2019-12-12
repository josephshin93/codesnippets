import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchSnippets,
  searchSnippetList,
  fetchUsers,
  likeSnippet,
  dislikeSnippet
} from "../../store/actions";
import { State, User, Snippet } from "../../store/types";
import { isEmpty } from "../../lib/lib";
import FilterSnippetForm from "./filterSnippetForm";
import SnippetSingle from "./SnippetSingle";

interface SnippetListProps {
  fetchSnippets: (filters?: any) => void;
  fetchUsers: (selectedTeam: any) => void;
  searchSnippetList: (searchText: any) => void;
  dislikeSnippet: (snippetId: string, index: Number, googleId: string) => void;
  likeSnippet: (
    id: string,
    index: Number,
    form: string,
    googleId: string
  ) => void;

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
      searchText: ""
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
      <div className="row">
        <form
          onSubmit={e => {
            e.preventDefault();
            if (this.state.searchText.length > 0) {
              this.props.searchSnippetList(this.state.searchText);
            }
          }}
        >
          <input
            className="col s9"
            type="text"
            placeholder="Search within current list of snippets"
            value={this.state.searchText}
            onChange={e => {
              e.preventDefault();
              this.setState({
                searchText: e.target.value
              });
            }}
          />
          <input
            className="col s2 push-s1 btn waves-effect waves-light"
            type="submit"
            value="Search"
          />
        </form>
      </div>
    );
  }

  renderSnippets() {
    if (this.props.snippets && this.props.snippets.length > 0) {
      return this.props.snippets.map((snippet: any) => (
        <SnippetSingle
          key={snippet.id}
          snippet={snippet}
          updateSnippetLikes={this.updateSnippetLikes.bind(this)}
          updateSnippetDislikes={this.updateSnippetDislikes.bind(this)}
        />
      ));
    }

    return (
      <li className="collection-item">
        <h5>No snippets to display.</h5>
      </li>
    );
  }

  // Like snippet
  updateSnippetLikes(snippetId: string) {
    const snippets = this.props.snippets;

    if (snippets && this.props.user) {
      // Find snippet index in state
      const i = snippets.findIndex(snip => snip.id === snippetId);
      const googleId = this.props.user.googleId;
      // Verify how to add user to array of 'likes'
      if (
        typeof snippets[i].likes !== "undefined" &&
        snippets[i].likes.length > 0
      ) {
        // Call action
        this.props.likeSnippet(snippetId, i, "push", googleId);
      } else {
        this.props.likeSnippet(snippetId, i, "first", googleId);
      }
    }
  }

  // Dislike snippet
  updateSnippetDislikes(snippetId: string) {
    const snippets = this.props.snippets;

    if (snippets && this.props.user) {
      // Find snippet index in state
      const i = snippets.findIndex(snip => snip.id === snippetId);
      const googleId = this.props.user.googleId;
      const likes = snippets[i].likes;
      //console.log("Likes array in client ", likes);
      // Verify 'likes' field exists
      if (typeof likes !== "undefined" && likes.length > 0) {
        this.props.dislikeSnippet(snippetId, i, googleId);
      }
    }
  }

  render() {
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
        <li className="collection-header">{this.renderSearch()}</li>
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
  fetchUsers,
  likeSnippet,
  dislikeSnippet
})(SnippetList);
