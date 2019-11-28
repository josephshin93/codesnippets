import React, { Component } from 'react';
import {
  State,
  User,
  Team,
  Teams,
  FormTeam,
  FormTeamMember,
  Subscription,
} from '../../store/types';
import { History } from 'history';
import { match } from 'react-router';
import { connect } from 'react-redux';
import {
  addTeam,
  editTeam,
  fetchUser,
} from '../../store/actions';
import { 
  Formik, 
  Form, 
  Field, 
  ErrorMessage, 
  FieldArray, 
} from 'formik';
import DropdownSearch from './DropdownSearch';
import * as Yup from 'yup';
import {
  formToTeam,
  teamToForm,
} from '../../lib/lib';
import Axios from 'axios';
const TrieSearch = require('trie-search');



interface TeamFormProps {
  addTeam: (team: Team, next?: () => void) => void;
  editTeam: (team: Team, teamId: string, next?: () => void) => void;
  fetchUser: () => void;
  teams: Teams | null;
  history: History;
  match: match;
}

interface TeamFormState {
  users: Array<User>;
  targetTeamId: string | null;
  targetTeam: Team;
}

interface TeamFormMatchParams {
  teamId?: string;
}

const teamFormValidationSchema = Yup.object({
  name: Yup.string()
    .max(25, 'Must be 25 characters or less')
    .required('Team name is required'),
  members: Yup.array()
    .of(Yup.object({
      userId: Yup.string(),
      memberName: Yup.string()
        .max(45, 'Must be 45 characters or less'),
      role: Yup.string()
        .matches(
          /(admin|member|pending)/, 
          'Must be \'admin\' or \'member\' or \'pending\''
        )
    })),
  subscriptions: Yup.array()
    .of(Yup.object({
      title: Yup.string()
        .max(25, 'Must be 25 characters or less')
        .required('Subscription title is required'),
      issueTime: Yup.number()
        .min(100)
        .max(2359)
        .required('Issue time is required'),
      issueDay: Yup.number()
        .min(0)
        .max(6)
        .required('Issue day is required'),
      content: Yup.string()
        .max(100, 'Must be 100 characters or less')
    })),
});

// FIXME: should we make the member name of team members unedit-able?
// FIXME: should we remove the pending status for the time being?
/**
 * FIXME:
 *  at least one member should be able to edit the team,
 *  maybe create a creator status and automatically assign at team creation
 *  and design a way to change the creator so there is only and always one
 */

class TeamForm extends Component<TeamFormProps, TeamFormState> {
  _isMounted = false;

  constructor(props: TeamFormProps) {
    super(props);

    // initialize state data
    let targetTeamId: string = '';
    let targetTeam: Team = {
      name: '',
      members: {},
      roles: {},
      subscriptions: [],
    };
    let users: Array<User> = [];
    
    // set targetTeamId and targetTeam if corresponding data is available
    const matchParams: TeamFormMatchParams = props.match.params;
    if (matchParams.teamId) {
      targetTeamId = matchParams.teamId;

      if (props.teams && props.teams[targetTeamId]) {
        targetTeam = props.teams[targetTeamId];
      }
    }

    // set the state
    this.state = {
      targetTeamId,
      targetTeam,
      users, 
    };

    // bind functions
    this.initialValues = this.initialValues.bind(this);
  }

  // FIXME: component mounts twice on refresh and route
  async componentDidMount() {
    // console.log('<TeamForm /> did mount', this.props, this.state);
    this._isMounted = true;

    // get all the users for adding members
    let usersDataRes = await Axios.get('/api/all_users');
    let users = usersDataRes ? usersDataRes.data : [];
    console.log('get /api/all_users', usersDataRes);

    // get target team if it is required (empty name means empty target Team)
    let targetTeamDataRes = null;
    if (
      this.state.targetTeamId !== '' && 
      (this.state.targetTeam === null || this.state.targetTeam.name === '')
    ) {
      targetTeamDataRes = await Axios.get(
        '/api/team', 
        { params: { targetTeamId: this.state.targetTeamId } }
      );
      console.log('get /api/team', this.state.targetTeamId, targetTeamDataRes);
    }
    let targetTeam = targetTeamDataRes ? 
      targetTeamDataRes.data : 
      this.state.targetTeam;

    if (this._isMounted) {
      this.setState({
        users,
        targetTeam,
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  initialValues(team: Team | null): FormTeam {
    if (team) {
      return teamToForm(team);
    }
    return {
      name: '',
      members: [
        { userId: '', memberName: '', role: '' },
      ],
      subscriptions: [
        { title: '', issueTime: 700, issueDay: 1, content: '' }
      ],
    };
  }

  addMember(userId: string, arrayHelpers: any) {
    const newUser = this.state.users.find(user => user.id === userId);

    // let newTeam = this.state.targetTeam;
    // if (newTeam && newUser) {
    //   newTeam.members[newUser.id] = newUser.firstName + ' ' + newUser.lastName;
    //   newTeam.roles[newUser.id] = 'pending';
    // }

    // console.log('new member added', newTeam);

    // this.setState({
    //   targetTeam: newTeam,
    // });

    if (newUser) {
      arrayHelpers.push({
        userId: newUser.id,
        memberName: newUser.firstName + ' ' + newUser.lastName,
        role: 'pending',
      });
    }
  }

  renderTeamNameInput(name: string, label: string) {
    return (
      <div className='row'>
        <div className='input-field col s12'>
          <label htmlFor={name}>{label}</label>
          <Field 
            name={name} 
            type='text' 
            placeholder='Enter team name'
          />
          <ErrorMessage 
            className='red-text text-darken-2' 
            name={name} 
            component='span' 
          />
        </div>
      </div>
    );
  }

  renderMembers(members: Array<FormTeamMember>, arrayHelpers: any) {
    if (members.length === 0) {
      return (
        <div className='row'>
          <div className='col s6'>
            <p className='grey-text text-lighten-2'>
              <em>Team has no members.</em>
            </p>
          </div>
        </div>
      );
    } else {
      return members.map((member: FormTeamMember, index: number) => (
        <div className='row' key={index}>
          <div className='col s7'>
            <Field 
              name={`members[${index}].memberName`}
              type='text'
              placeholder='Team member name'
            />
            <ErrorMessage 
              className='red-text text-darken-2' 
              name={`members[${index}].memberName`} 
            />
          </div>

          <div className='col s3'>
            <Field 
              name={`members[${index}].role`} 
              as='select'
              className='browser-default'
            >
              <option value='admin'>admin</option>
              <option value='member'>member</option>
              <option value='pending'>pending</option>
            </Field>
            <ErrorMessage 
              className='red-text text-darken-2'
              name={`members[${index}].role`} 
            />
          </div>

          <div className='col s1 offset-s1'>
            <button 
              className='waves-effect waves-light btn-floating red darken-1'
              onClick={(e) => {
                e.preventDefault();

                // remove specific team member in the local state
                // let newTeam = this.state.targetTeam;
                // if (newTeam) {
                //   delete newTeam.members[member.userId];
                //   delete newTeam.roles[member.userId];
                // }

                // this.setState({
                //   targetTeam: newTeam,
                // });

                arrayHelpers.remove(index, 1);
              }}
            >
              <i className='material-icons'>clear</i>
              {/* Remove */}
            </button>
          </div>
        </div>
      ));
    }
  }

  renderMembersInput(members: Array<FormTeamMember>) {
    let ts = new TrieSearch('email');
    ts.addAll(this.state.users);

    return (
      <div className='row'>
        <div className='col s12'>
          <label htmlFor={'members'}>Members</label>
          <FieldArray 
            name={'members'} 
            render={(arrayHelpers) => (
              <div>
                {this.renderMembers(members, arrayHelpers)}
                <div className='row'>
                  <div className='col s8'>
                    <p style={{color: '#26a69a', fontWeight: 'bolder'}}>
                      ADD MEMBERS
                    </p>
                    <DropdownSearch 
                      search={ts} 
                      onAct={
                        (userId: string) => 
                          this.addMember(userId, arrayHelpers)
                      } 
                    />
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    );
  }

  renderSubs(subscriptions: Array<Subscription>, arrayHelpers: any) {
    if (subscriptions.length === 0) {
      return (
        <div className='row'>
          <div className='col s6'>
            <p className='grey-text text-lighten-2'>
              <em>Team has no subscriptions.</em>
            </p>
          </div>
        </div>
      );
    } else {
      return subscriptions.map((sub: Subscription, index: number) => (
        <div className='row' key={index}>
          <div className='col s12'>
            <div className='row'>
              <div className='col s6'>
                <Field 
                  name={`subscriptions[${index}].title`} 
                  type='text' 
                  placeholder='Enter subscription title'
                />
                <ErrorMessage 
                  className='red-text text-darken-2'
                  name={`subscriptions[${index}].title`} 
                  component='span'
                />
              </div>
              <div className='col s2'>
                <Field 
                  name={`subscriptions[${index}].issueTime`} 
                  as='select' 
                  className='browser-default'
                >
                  <option value='500'>5:00 AM</option>
                  <option value='600'>6:00 AM</option>
                  <option value='700'>7:00 AM</option>                  
                  <option value='800'>8:00 AM</option>
                  <option value='900'>9:00 AM</option>
                  <option value='1000'>10:00 AM</option>                  
                  <option value='1100'>11:00 AM</option>
                  <option value='1200'>12:00 PM</option>
                  <option value='1300'>1:00 PM</option>                  
                  <option value='1400'>2:00 PM</option>
                  <option value='1500'>3:00 PM</option>
                  <option value='1600'>4:00 PM</option>                  
                  <option value='1700'>5:00 PM</option>
                  <option value='1800'>6:00 PM</option>
                  <option value='1900'>7:00 PM</option>                  
                  <option value='2000'>8:00 PM</option>                  
                  <option value='2100'>9:00 PM</option>                  
                  <option value='2200'>10:00 PM</option>                  
                  <option value='2300'>11:00 PM</option>                   
                </Field>
                <ErrorMessage name={`subscriptions[${index}].issueTime`} />
              </div>
              <div className='col s2'>
                <Field 
                  name={`subscriptions[${index}].issueDay`} 
                  as='select' 
                  className='browser-default'
                >
                  <option value='0'>Sunday</option>
                  <option value='1'>Monday</option>
                  <option value='2'>Tuesday</option>
                  <option value='3'>Wednesday</option>
                  <option value='4'>Thursday</option>
                  <option value='5'>Friday</option>
                  <option value='6'>Saturday</option>
                </Field>
                <ErrorMessage name={`subscriptions[${index}].issueDay`} />
              </div>
              <div className='col s1 offset-s1'>
                  <button 
                    className='waves-effect waves-light btn-floating red darken-1'
                    onClick={(e) => {
                      e.preventDefault();
                      
                      // let newTeam = this.state.targetTeam;
                      // newTeam.subscriptions.splice(index, 1);

                      // this.setState({
                      //   targetTeam: newTeam,
                      // });

                      arrayHelpers.remove(index);
                    }}
                  >
                    <i className='material-icons'>clear</i>
                  </button>
              </div>
            </div>


            <div className='row'>
              <div className='input-field col s10'>
                <Field 
                  className='materialize-textarea'
                  name={`subscriptions[${index}].content`} 
                  as='textarea' 
                  placeholder='Enter subscription content'
                />
                <ErrorMessage 
                  className='red-text text-darken-2'
                  name={`subscriptions[${index}].content`} 
                />
              </div>
            </div>
          </div>
          
        </div>
      ));
    }
  }

  renderSubsInput(subscriptions: Array<Subscription>) {
    return (
      <div className='row'>
        <div className='col s12'>
          <label htmlFor='subscriptions'>Subscriptions</label>
          <FieldArray 
            name='subscriptions'
            render={(arrayHelpers) => (
              <div>
                {this.renderSubs(subscriptions, arrayHelpers)}
                <div className='row'>
                  <div className='col s6'>
                    <button 
                      className='btn-small waves-effect waves-light'
                      onClick={(e) => {
                        e.preventDefault();
                        
                        const defaultSub: Subscription = {
                          title: '',
                          issueDay: 1,
                          issueTime: 700,
                          content: '',
                        };
                        // let newTeam = this.state.targetTeam;
                        // newTeam.subscriptions.push(defaultSub);

                        // this.setState({
                        //   targetTeam: newTeam,
                        // });

                        arrayHelpers.push(defaultSub);
                      }}
                    >
                      Add new subscription
                    </button>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    );
  }

  render() {
    // console.log('<TeamForm /> rendering', this.state, this.props);

    return (
      <div className='container'>
        <div className='row'>
          <div className='col s12'>
            <h2>
              {this.state.targetTeamId === '' ? 
                'New Team' : 
                'Team Settings'
              }
            </h2>
          </div>
        </div>
        <Formik
          initialValues={this.initialValues(this.state.targetTeam)}
          enableReinitialize
          validationSchema={teamFormValidationSchema}
          onSubmit={(values, actions) => {
            // console.log('submitting team form');
            // console.log(values);

            if (this.state.targetTeamId === '') {
              /**
               * add new team and set it as the selected team, then refresh 
               * user data to ensure accurate list of teams will be displayed
               */
              this.props.addTeam(formToTeam(values), () => {
                actions.setSubmitting(false);
                this.props.fetchUser();
                this.props.history.push('/dashboard');
              });
            } else {
              this.props.editTeam(
                formToTeam(values), 
                this.state.targetTeamId || '', 
                () => {
                  actions.setSubmitting(false);
                  this.props.fetchUser();
                  this.props.history.push('/dashboard');
                }
              );
            }
            
          }}
        >
          {({ values, handleSubmit }) => {
            // console.log(values);
            return (
            <Form onSubmit={handleSubmit}>
              {this.renderTeamNameInput('name', 'Team Name')}
              <div style={{width:'100%', marginTop:'4rem'}}></div>
              {this.renderMembersInput(values.members)}
              <div style={{width:'100%', marginTop:'4rem'}}></div>
              {this.renderSubsInput(values.subscriptions)}
              <div style={{width:'100%', marginTop:'4rem'}}></div>
              <button 
                className='waves-effect waves-light btn-large blue'
                type='submit'
              >
                {this.state.targetTeamId === '' ? 
                  'Create Team' : 
                  'Confirm Edit'
                }
              </button>
            </Form>
            );
          }}
        </Formik>
      </div>
    );
  }
}


const mapStateToProps = ({ teams }: State) => {
  return { teams };
};

const mapDispatchToProps = () => {
  return {
    editTeam,
    addTeam,
    fetchUser,
  };
};

export default connect(mapStateToProps, mapDispatchToProps())(TeamForm);
