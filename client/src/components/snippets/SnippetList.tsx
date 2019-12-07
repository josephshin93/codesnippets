import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchSnippets,
  searchSnippetList,
  fetchUsers
} from "../../store/actions";
import { State, User, Snippet } from "../../store/types";
import { isEmpty } from "../../lib/lib";
import FilterSnippetForm from "./filterSnippetForm";
import SnippetSingle from "./SnippetSingle";

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
  snippets: Array<Snippet>;
}

class SnippetList extends Component<SnippetListProps, SnippetListState> {
  constructor(props: SnippetListProps) {
    super(props);

    this.state = {
      snippets: props.snippets ? props.snippets : [],
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

      if (this.props.snippets) {
        this.setState({
          snippets: this.props.snippets
        });
      }
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
    if (this.state.snippets && this.state.snippets.length > 0) {
      return this.state.snippets.map((snippet: any) => (
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

  // Update Likes in local state
  updateSnippetLikes(snippetId: string) {
    const { user } = this.props;
    if (user) {
      // Make copy
      const snips = [...this.state.snippets];
      // Find index
      const index = this.state.snippets.findIndex(
        snip => snip.id === snippetId
      );
      // Update this snippet
      if (
        typeof snips[index].likes !== "undefined" &&
        snips[index].likes.length > 0
      ) {
        snips[index].likes.push(user.googleId);
      } else {
        snips[index].likes = [user.googleId];
      }
      snips[index].totalLikes = snips[index].totalLikes + 1;
      // Set state
      this.setState({
        snippets: snips
      });
    }
  }

  // Update Dislike in local state
  updateSnippetDislikes(snippetId: string) {
    const { user } = this.props;
    if (user) {
      // Make copy
      const snips = [...this.state.snippets];
      // Find index
      const index = this.state.snippets.findIndex(
        snip => snip.id === snippetId
      );
      // Update this snippet
      let likes = snips[index].likes;
      if (typeof likes !== "undefined" && likes.length > 0) {
        // Splice the likes array
        for (var i = 0; i < likes.length; i++) {
          if (likes[i] === user.googleId) likes.splice(i, 1);
        }
      }
      snips[index].totalLikes = snips[index].totalLikes - 1;
      snips[index].likes = likes;
      console.log("After dislike, snippet's like is ", snips[index].likes);
      // Set state
      this.setState({
        snippets: snips
      });
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
  fetchUsers
})(SnippetList);
