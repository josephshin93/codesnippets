import { FETCH_TEAMS } from '../actions/types';

export default function(state = [], action: any) {
    switch (action.type) {
        case FETCH_TEAMS:
            return action.payload;
        default:
            return state;
    }
}