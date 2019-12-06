import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchSnippets, fetchUsers } from "../../store/actions";
import { State, User, Snippet } from "../../store/types";
import { isEmpty } from "../../lib/lib";
import FilterSnippetForm from "./filterSnippetForm";
import Fuse from "fuse.js";
import SnippetSingle from "./SnippetSingle";

interface SnippetListProps {
  fetchSnippets: (filters?: any) => void;
  fetchUsers: (selectedTeam: any) => void;

  snippets: Array<Snippet> | null;
  user: User | null;
  selectedTeam: string | null;
  selectedWeek: any;
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
  keys: ["title", "content", "description", "ownerName"]
};

class SnippetList extends Component<SnippetListProps, SnippetListState> {
  fuse: Fuse<Snippet, FuseOptions> | null = null;

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
        this.fuse = new Fuse(this.props.snippets, fuseOpts);
      }
      // Fetching user names for filter dropdown
      // Placing this here allows the dropdown to update based on Team Navigation
      this.props.fetchUsers(team);
    }
  }

  renderSearch() {
    return (
      <div className="row">
        <form
          onSubmit={e => {
            e.preventDefault();
            if (this.fuse) {
              let results: Array<Snippet> = this.props.snippets || [];
              if (this.state.searchText.length > 0) {
                results = this.fuse.search(this.state.searchText);
              }
              this.setState({
                snippets: results
              });
            } else {
              console.error("Fuse search is not initialized");
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
        <SnippetSingle key={snippet.id} snippet={snippet} />
      ));
    }

    return (
      <li className="collection-item">
        <h5>No snippets to display.</h5>
      </li>
    );
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

export default connect(mapStateToProps, { fetchSnippets, fetchUsers })(
  SnippetList
);
