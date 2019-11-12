import { combineReducers } from 'redux';
import authReducer from './authReducer';
import snippetReducer from './snippetReducer';

export default combineReducers({
    user: authReducer,
    snippets: snippetReducer
});