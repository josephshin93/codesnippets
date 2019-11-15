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

    // FIXME: determine if specific-team settings should be in footer
    // FIXME: determine what else needs to be in footer
    renderFooter() {
        return (
            <div>
                <Link to='/new-team'>+ Create a Team</Link>
                <br/>
                <Link to={'/team/team-name/settings'}>Team Name Settings</Link>
            </div>
        );
    }
    
    render() {
        // FIXME: create team-nav css class - research materialize first
        // FIXME: style team-list area
        // TODO: implement user picture display at top of team nav section
        return (
            <section className='team-nav'>
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
