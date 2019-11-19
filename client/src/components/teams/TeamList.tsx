import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Link,
} from 'react-router-dom';
import {
  State,
  Team,
  User,
} from '../../store/types';
import {
  fetchTeams,
  mockFetchTeams,
  selectTeam,
} from '../../store/actions';



const isEmpty = (obj: Object): boolean => {
  return Object.entries(obj).length === 0 && obj.constructor === Object;
};


interface TeamListProps {
  // FIXME: is this proper type?
  fetchTeams: () => void;
  mockFetchTeams: () => void;
  selectTeam: (teamId: string) => void;

  user: User | null;
  teams: Array<Team> | null;
  // FIXME: if a team is not selected, what is the value?
  selectedTeam: string | null;
}

class TeamList extends Component<TeamListProps> {
  componentDidMount() {
    console.log('<TeamList /> did mount', this.props.user);
    if (this.props.user && !isEmpty(this.props.user)) {
      this.props.fetchTeams();
    }
    // this.props.mockFetchTeams();
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
    user: state.user,
    teams: state.teams,
    selectedTeam: state.selectedTeam,
  };
};

const mapDispatchToProps = () => {
  return {
    mockFetchTeams,
    fetchTeams,
    selectTeam,
  };
};

export default connect(mapStateToProps, mapDispatchToProps())(TeamList);
