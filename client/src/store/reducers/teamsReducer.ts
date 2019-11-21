import {
  FETCH_TEAMS,
  ADD_TEAM,
} from '../types';

// TODO: type action
const teamsReducer = (state = [], action: any) => {
  switch (action.type) {
    case FETCH_TEAMS:
      return action.payload;
    case ADD_TEAM:
      return state;
    default:
      return state;
  }
};

export default teamsReducer;
