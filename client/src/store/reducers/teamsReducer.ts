import {
  FETCH_TEAMS,
  ADD_TEAM,
  EDIT_TEAM,
} from '../types';

// TODO: type action
// FIXME: add team and edit team actions aren't being used correctly
const teamsReducer = (state = {}, action: any) => {
  switch (action.type) {
    case FETCH_TEAMS:
      return action.payload;
    case ADD_TEAM:
      return state;
    case EDIT_TEAM:
      return state;
    default:
      return state;
  }
};

export default teamsReducer;
