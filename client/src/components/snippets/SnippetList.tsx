import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchSnippets, fetchUsers } from "../../store/actions";
import { State, User, Snippet } from "../../store/types";
import { isEmpty } from "../../lib/lib";
import FilterSnippetForm from "./filterSnippetForm";
import SnippetSingle from "./SnippetSingle";

interface Props {
  fetchSnippets: (filters?: any) => void;
  fetchUsers: (selectedTeam: any) => void;

  snippets: Array<Snippet> | null;
  user: User | null;
  selectedTeam: string | null;
  selectedWeek: any;
}

class SnippetList extends Component<Props> {
  componentDidMount() {
    if (this.props.user && !isEmpty(this.props.user)) {
      let team = this.props.selectedTeam;
      let week = this.props.selectedWeek;
      this.props.fetchSnippets({
        teamSelected: team,
        weekSelected: week
      });
      // Fetching user names for filter dropdown
      // Placing this here allows the dropdown to update based on Team Navigation
      this.props.fetchUsers(team);
    }
  }

  renderSnippets() {
    if (this.props.snippets && this.props.snippets.length > 0) {
      return this.props.snippets.map((snippet: any) => (
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
