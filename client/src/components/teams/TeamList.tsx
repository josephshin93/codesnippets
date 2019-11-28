import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { State, Teams, User } from "../../store/types";
import { fetchTeams, mockFetchTeams, selectTeam } from "../../store/actions";
import { isEmpty } from "../../lib/lib";

interface TeamListProps {
  fetchTeams: (teamIds?: Array<string>) => void;
  mockFetchTeams: () => void;
  selectTeam: (teamId: string) => void;

  user: User | null;
  teams: Teams | null;
  // TODO: selectedTeam should always be string ('personal' or real team name)
  selectedTeam: string | null;
}

class TeamList extends Component<TeamListProps> {
  componentDidMount() {
    // console.log('<TeamList /> did mount');

    if (this.props.user && !isEmpty(this.props.user) && this.props.teams) {
      this.props.fetchTeams(this.props.user.teams);
    }
  }

  changeTeam(teamId: string) {
    this.props.selectTeam(teamId);
  }

  render() {
    // console.log('<TeamList /> rendering');
    if (this.props.teams) {
      // console.log('teams', this.props.teams);
      // console.log('selectedTeam', this.props.selectedTeam);
      return (
        <ul className="collection">
          {Object.keys(this.props.teams).map((teamId: string) => {
            let liClasses = "collection-item";
            if (teamId === this.props.selectedTeam) liClasses += " active";
            // FIXME: why does this have to be validated again? tslinter problem?
            if (this.props.teams) {
              return (
                <Link
                  key={teamId}
                  className={liClasses}
                  onClick={() => this.changeTeam(teamId)}
                  to="#"
                >
                  <li>{this.props.teams[teamId].name}</li>
                </Link>
              );
            }
            return <li>*</li>;
          })}
        </ul>
      );
    }

    return <p>No teams to display.</p>;
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
  return {
    mockFetchTeams,
    fetchTeams,
    selectTeam
  };
};

export default connect(mapStateToProps, mapDispatchToProps())(TeamList);
