import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Link,
} from 'react-router-dom';
import {
  State,
  Team,
} from '../../store/types';
import {
  fetchTeams,
  mockFetchTeams,
} from '../../store/actions';



interface TeamListProps {
  // FIXME: is this proper type?
  // fetchTeams: () => void;
  mockFetchTeams: () => void;
  teams: Array<Team> | null;
  // FIXME: if a team is not selected, what is the value?
  selectedTeam: string | null;
}

class TeamList extends Component<TeamListProps> {
  componentDidMount() {
    // this.props.fetchTeams();
    this.props.mockFetchTeams();
  }

  // FIXME: could not implement this as a functional component
  renderTeamListItem(team: Team, selected: boolean) {
    let listItemClasses = 'collection-item';
    if (selected) listItemClasses += ' selected-team';
    return (
      <li className={listItemClasses} key={team.id}>
        <Link to={'/team/'+team.id}>{team.name}</Link> 
      </li>
    );
  }

  render() {
    // FIXME: create team-nav css class - research materialize first
    // FIXME: style team-list area
    if (this.props.teams) {
      return (
        <ul>
          {this.props.teams.map((team: Team) => 
            this.renderTeamListItem(
              team, 
              team.id === this.props.selectedTeam
            )
          )}
        </ul>
      );
    }
    
    return <p>No teams to display.</p>;
  }
}

const mapStateToProps = (state: State) => {
  // TODO: include teams and selectedTeam in store
  return {
    teams: state.teams,
    selectedTeam: state.selectedTeam,
  };
};

// FIXME: is this pattern ok for classic "mapDispatchToProps method"
export default connect(mapStateToProps, { mockFetchTeams })(TeamList);
