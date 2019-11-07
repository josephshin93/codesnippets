import { FETCH_USER, AUTHORIZE_USER } from '../actions/types';

export default function(state = {}, action: any) {
    switch (action.type) {
        case FETCH_USER:
            return action.payload || false;
        case AUTHORIZE_USER:
            // return {
            //     ...state,
            //     user: action.user || null,
            // };
            return action.user || null;
        default:
            return state;
    }
};