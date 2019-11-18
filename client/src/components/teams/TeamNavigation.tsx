import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Link,
} from 'react-router-dom';
import {
  State,
  User,
} from '../../store/types';
import TeamList from './TeamList';




interface TeamNavigationProps {
  user: User | null;
}

class TeamNavigation extends Component<TeamNavigationProps> {

  // FIXME: team settings
  // FIXME: determine what else needs to be in footer
  renderFooter() {
    return (
      <ul className='collection'>
        <Link className='collection-item' to='/new-team'>
          <li>+ Create a Team</li>
        </Link>
        <Link className='collection-item' to='/team-settings'>
          <li>Team Settings</li>
        </Link>
      </ul>
    );
  }
    
  render() {
    // FIXME: create team-nav css class - research materialize first
    // FIXME: style team-list area
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
  };
};

// FIXME: which/if action creators are needed here

export default connect(mapStateToProps)(TeamNavigation);
