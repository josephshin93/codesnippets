import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchTeams } from '../../actions';

interface Props {
    fetchTeams: () => void,
    teams: any
}

const Team = ({ team, members }: any ) => {
    console.log( "TEAM:", team, members);
    if (members !== null) {
        return (
            <div>
              {Object.keys(members).map((member: any, index: any) => {
                console.log(team.roles[member], member, index);  
                return (
                  <div key={index}>{team.members[member]} - {team.roles[member]}</div>
                )
              })}
            </div>
          )
    } else {
        return (
            <div></div>
        )
    }


}

class TeamList extends Component<Props> {
    componentDidMount() {
        this.props.fetchTeams();        
    }

    renderTeams() {
        return this.props.teams.map( (team: any, i: number) => {
            console.log( i, team, team.members);
            return (
                <div key= { i }>
                    <h3>{ team.name.toUpperCase() } Team</h3>
                    <h4>Members:</h4>
                    <Team key={i} team={team} members={team.members ? team.members : null}/>
                    { team.subscription ? 
                    <div>
                        <h4>Subscriptions:</h4>
                        <p>Digest: { team.subscription.digest.day } @ { team.subscription.digest.time }</p>
                        <p>Digest: { team.subscription.reminder.day } @ { team.subscription.reminder.time }</p>
                    </div>
                    : null}
                    
                    <p>---</p>
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
