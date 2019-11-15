import { FETCH_TEAMS } from '../types';

// FIXME: type action
const teamsReducer = (state = [], action: any) => {
    switch (action.type) {
        case FETCH_TEAMS:
            return action.payload;
        default:
            return state;
    }
};

export default teamsReducer;