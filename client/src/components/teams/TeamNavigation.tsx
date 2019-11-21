import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Link,
} from 'react-router-dom';
import {
  State,
  User,
  Team,
  Teams,
} from '../../store/types';
import TeamList from './TeamList';



interface TeamNavigationProps {
  user: User | null;
  teams: Teams | null;
  selectedTeam: string | null;
}

class TeamNavigation extends Component<TeamNavigationProps> {

  componentDidMount() {
    // console.log('<TeamNavigation /> did mount');
  }

  // settings for the 'personal' team cannot be accessed
  renderTeamSettingsLink() {
    let targetTeam: Team | null = null;
    if (
      this.props.teams && 
      this.props.selectedTeam &&
      this.props.selectedTeam !== 'personal'
    ) {
      targetTeam = this.props.teams[this.props.selectedTeam];
    }
    if (targetTeam) {
      return (
        <Link 
          className='collection-item' 
          to={'/team-settings/'+this.props.selectedTeam}
        >
          <li>{targetTeam.name + ' Settings'}</li>
        </Link>
      );
    }
    return '';
  }

  // FIXME: determine what else needs to be in footer
  renderFooter() {
    return (
      <ul className='collection'>
        <Link className='collection-item' to='/new-team'>
          <li>+ Create a Team</li>
        </Link>
        {this.renderTeamSettingsLink()}
      </ul>
    );
  }
    
  render() {
    // console.log('<TeamNavigation /> rendering');

    // TODO: style team-list area
    // TODO: implement user picture display at top of team nav section
    return (
      <section className='team-nav'>
        <h6>Team Navigation</h6>
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
    selectedTeam: state.selectedTeam,
  };
};

export default connect(mapStateToProps)(TeamNavigation);
