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
  selectTeam,
} from '../../store/actions';



interface TeamListProps {
  // FIXME: is this proper type?
  // fetchTeams: () => void;
  mockFetchTeams: () => void;
  selectTeam: (teamId: string) => void;
  teams: Array<Team> | null;
  // FIXME: if a team is not selected, what is the value?
  selectedTeam: string | null;
}

class TeamList extends Component<TeamListProps> {
  componentDidMount() {
    // this.props.fetchTeams();
    this.props.mockFetchTeams();
  }

  changeTeam(teamId: string) {
    this.props.selectTeam(teamId);
  }

  render() {
    if (this.props.teams) {
      return (
        <ul className='collection'>
          {this.props.teams.map((team: Team) => {
            let liClasses = 'collection-item';
            if (team.id === this.props.selectedTeam) liClasses += ' active';
            return (
              <Link
                key={team.id} 
                className= {liClasses} 
                onClick={() => this.changeTeam(team.id)} 
                to='#'
              >
                <li>{team.name}</li>
              </Link>
            );
          })}
        </ul>
      );
    }
    
    return <p>No teams to display.</p>;
  }
}

const mapStateToProps = (state: State) => {
  return {
    teams: state.teams,
    selectedTeam: state.selectedTeam,
  };
};

// FIXME: is this pattern ok for classic "mapDispatchToProps method"
export default connect(mapStateToProps, { mockFetchTeams, selectTeam })(TeamList);
