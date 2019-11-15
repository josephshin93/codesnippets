import { combineReducers } from 'redux';
import authReducer from './authReducer';
import snippetReducer from './snippetReducer';
import teamsReducer from './teamsReducer'

export default combineReducers({
    user: authReducer,
    snippets: snippetReducer,
    teams: teamsReducer,
});