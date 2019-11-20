import { SELECT_TEAM } from '../types';

const selectedTeamReducer = (state = 'personal', action: any) => {
    switch (action.type) {
      case SELECT_TEAM:
        return action.payload;
      default:
        return state;
    }
  };

export default selectedTeamReducer;