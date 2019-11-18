import { combineReducers } from 'redux';
import authReducer from './authReducer';
import snippetReducer from './snippetReducer';
import teamsReducer from './teamsReducer'
import selectedTeamReducer from './selectedTeamReducer';


export default combineReducers({
  user: authReducer,
  snippets: snippetReducer,
  teams: teamsReducer,
  selectedTeam: selectedTeamReducer,
});