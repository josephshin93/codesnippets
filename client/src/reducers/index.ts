import { combineReducers } from 'redux';
import authReducer from './authReducer';
import snippetReducer from './snippetReducer';
import teamReducer from './teamReducer';

export default combineReducers({
    auth: authReducer,
    snippets: snippetReducer,
    teams: teamReducer
});