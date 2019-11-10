import {
    FETCH_USER,
    AUTHORIZE_USER
} from '../types';

const authReducer = (state = {}, action: any) => {
    switch (action.type) {
        case FETCH_USER:
            return action.payload || false;
        case AUTHORIZE_USER:
            return action.user || null;
        default:
            return state;
    }
};

export default authReducer;