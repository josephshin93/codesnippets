import {
  FETCH_TEAMS,
  ADD_TEAM,
  EDIT_TEAM,
} from '../types';

const initialState = {
  personal: {
    name: 'Personal',
    members: {},
    roles: {},
    subscriptions: [],
  },
}

// TODO: type action
// FIXME: add team and edit team actions aren't being used correctly
const teamsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case FETCH_TEAMS:
      return {
        ...state,
        ...action.payload,
      };
    case ADD_TEAM:
      return state;
    case EDIT_TEAM:
      return state;
    default:
      return state;
  }
};

export default teamsReducer;
