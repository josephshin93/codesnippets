import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchTeams } from '../../actions';

interface Props {
    fetchTeams: () => void,
    teams: any
}

class TeamList extends Component<Props> {
    componentDidMount() {
        this.props.fetchTeams();
            // TODO FIX THIS...
        setTimeout(() => {
            console.log(this.props.teams);
        }, 1000);
        
    }

    renderTeams() {
        return this.props.teams.map( (team: any, i: number) => {
            return (
                <div key= { i }>
                    <h3>Team {i}:</h3>
                    <p><b>Members/Roles:</b></p>
           
                </div>
            )
        })
    }
    
    render() {
        return (
            <div>
                {this.renderTeams()}
            </div>
        );
    }
}

function mapStateToProps({ teams }: any) {
    return { teams };
}

export default connect(mapStateToProps, { fetchTeams })(TeamList);
