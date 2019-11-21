import React from 'react';
import {
  Team,
  FormTeam,
} from '../../store/types';
import { History } from 'history';
import { connect } from 'react-redux';
import {
  addTeam,
  fetchUser,
} from '../../store/actions';
import { 
  Formik, 
  Form, 
  Field, 
  ErrorMessage, 
  FieldArray, 
} from 'formik';
import * as Yup from 'yup';
import {
  formToTeam,
  teamToForm,
} from '../../lib/lib';



interface TeamFormProps {
  addTeam: (team: Team, next?: Function) => void;
  fetchUser: () => void;
  team?: Team;
  history: History;
}

const teamFormValidationSchema = Yup.object({
  name: Yup.string()
    .max(25, 'Must be 25 characters or less')
    .required('Team name is required'),
  members: Yup.array()
    .of(Yup.object({
      userId: Yup.string(),
      memberName: Yup.string()
        .max(25, 'Must be 25 characters or less'),
      role: Yup.string()
        .matches(/(admin|member)/, 'Must be \'admin\' \'or member\'')
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

const initialValues = (team?: Team): FormTeam => {
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
};

// TODO: style form (inputs, error messages, etc)

const renderTextInput = (name: string, label: string) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <Field name={name} type='text'/>
      <ErrorMessage name={name} component='div' />
    </div>
  );
};

const renderMembersInput = (members: any) => {
  return (
    <div>
      <label htmlFor={'members'}>Members</label>
      <FieldArray 
        name={'members'} 
        render={(arrayHelpers) => (
          <div>
            {members.map((member: any, index: number) => (
              <div key={index}>
                <Field 
                  name={`members[${index}].memberName`}
                  type='text'
                />
                <ErrorMessage name={`members[${index}].memberName`} />
                <Field 
                  name={`members[${index}].role`} 
                  as='select'
                  className='browswer-default'
                >
                  <option value='admin'>admin</option>
                  <option value='member'>member</option>
                </Field>
                <ErrorMessage name={`members[${index}].role`} />
                <button 
                  onClick={() => arrayHelpers.remove(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      />
    </div>
  );
};

const renderSubsInput = (subscriptions: any) => {
  return (
    <div>
      <label htmlFor='subscriptions'>Subscriptions</label>
      <FieldArray 
        name='subscriptions'
        render={(arrayHelpers) => (
          <div>
            {subscriptions.map((sub: any, index: number) => (
              <div key={index}>
                <Field name={`subscriptions[${index}].title`} type='text' />
                <ErrorMessage name={`subscriptions[${index}].title`} />
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
                <Field 
                  name={`subscriptions[${index}].content`} 
                  as='textarea' 
                />
                <ErrorMessage name={`subscriptions[${index}].content`} />
              </div>
            ))}
          </div>
        )}
      />
    </div>
  );
};


const TeamForm: React.FC<TeamFormProps> = (props) => {

  // FIXME: cannot use materialize-styled <select> elements without jQuery
  return (
    <Formik
      initialValues={initialValues(props.team)}
      validationSchema={teamFormValidationSchema}
      onSubmit={(values, actions) => {
        // console.log('submitting team form');
        // console.log(values);

        /**
         * add new team and set it as the selected team, then refresh user 
         * data to ensure accurate list of teams will be displayed
         */
        props.addTeam(formToTeam(values), () => {
          actions.setSubmitting(false);
          props.fetchUser();
          props.history.push('/dashboard');
        });
      }}
    >
      {({ values, handleSubmit }) => {
        // console.log(values);
        return (
        <Form onSubmit={handleSubmit}>
          {renderTextInput('name', 'Team Name')}
          {renderMembersInput(values.members)}
          {renderSubsInput(values.subscriptions)}
          <button type='submit'>Create Team</button>
        </Form>
        );
      }}
    </Formik>
  );
};

export default connect(null, { addTeam, fetchUser })(TeamForm);
