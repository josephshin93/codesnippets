import { combineReducers } from "redux";
import authReducer from "./authReducer";
import usersReducer from "./usersReducer";
import snippetReducer from "./snippetReducer";
import teamsReducer from "./teamsReducer";
import selectedTeamReducer from "./selectedTeamReducer";
import selectedWeekReducer from "./selectedWeekReducer";
import selectedCommentReducer from "./selectedCommentReducer";
import commentReducer from "./commentReducer";

export default combineReducers({
  user: authReducer,
  users: usersReducer,
  snippets: snippetReducer,
  comments: commentReducer,
  teams: teamsReducer,
  selectedTeam: selectedTeamReducer,
  selectedWeek: selectedWeekReducer,
  selectedComment: selectedCommentReducer
});
