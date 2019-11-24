import { combineReducers } from "redux";
import authReducer from "./authReducer";
import usersReducer from "./usersReducer";
import snippetReducer from "./snippetReducer";
import teamsReducer from "./teamsReducer";
import selectedTeamReducer from "./selectedTeamReducer";

export default combineReducers({
  user: authReducer,
  users: usersReducer,
  snippets: snippetReducer,
  teams: teamsReducer,
  selectedTeam: selectedTeamReducer
});
