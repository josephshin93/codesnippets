import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { State, User, Team, Teams } from "../../store/types";
import TeamList from "./TeamList";
import { selectTeam } from "../../store/actions";

interface TeamNavigationProps {
  user: User | null;
  teams: Teams | null;
  selectedTeam: string | null;
  selectTeam: (teamId: string) => void;
}

class TeamNavigation extends Component<TeamNavigationProps> {
  componentDidMount() {
    console.log("<TeamNavigation /> did mount");
  }

  // settings for the 'personal' team cannot be accessed
  renderTeamSettingsLink() {
    let targetTeam: Team | null = null;
    if (
      this.props.teams &&
      this.props.selectedTeam &&
      this.props.selectedTeam !== "personal"
    ) {
      targetTeam = this.props.teams[this.props.selectedTeam];
    }
    if (targetTeam) {
      return (
        <Link
          className="collection-item"
          to={"/team-settings/" + targetTeam.id}
        >
          <li>{targetTeam.name + " Settings"}</li>
        </Link>
      );
    }
    return "";
  }

  // FIXME: determine what else needs to be in footer
  renderFooter() {
    return (
      <ul className="collection">
        <Link className="collection-item" to="/new-team">
          <li>+ Create a Team</li>
        </Link>
        {this.renderTeamSettingsLink()}
      </ul>
    );
  }

  // To help users navigate teams, the button 'All' is initially active
  // When button is clicked, the current team will be empty
  // The app will display all snippets since team filter is off
  renderAllButton() {
    let liClasses = "collection-item";
    let team = this.props.selectedTeam;
    // Check if string is empty/null/undefined
    if (!team || 0 === team.length) liClasses += " active";
    return (
      <ul className="collection">
        <Link
          key={0}
          className={liClasses}
          onClick={() => this.props.selectTeam("")}
          to="#"
        >
          All
        </Link>
      </ul>
    );
  }

  render() {
    // FIXME: style team-list area
    // TODO: implement user picture display at top of team nav section
    return (
      <section className="team-nav">
        <h6>Team Navigation</h6>
        {this.renderAllButton()}
        <TeamList />
        {this.renderFooter()}
      </section>
    );
  }
}

const mapStateToProps = (state: State) => {
  return {
    user: state.user,
    teams: state.teams,
    selectedTeam: state.selectedTeam
  };
};

const mapDispatchToProps = () => {
  return { selectTeam };
};

export default connect(mapStateToProps, mapDispatchToProps())(TeamNavigation);
