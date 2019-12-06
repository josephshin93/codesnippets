import axios from "axios";
import {
  Team,
  FETCH_USER,
  FETCH_USERS,
  FETCH_SNIPPETS,
  FETCH_SNIPPET,
  FETCH_COMMENTS,
  AUTHORIZE_USER,
  FETCH_TEAMS,
  SELECT_TEAM,
  SELECT_WEEK,
  ADD_TEAM,
  EDIT_TEAM
} from "../types";
import { Dispatch, AnyAction } from "redux";

export const authorizeUser = () => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  return {
    type: AUTHORIZE_USER,
    user
  };
};

export const fetchUser = () => async (dispatch: any) => {
  console.log("get api/current_user");
  const res = await axios.get("api/current_user");
  // console.log('get api/current_user res data', res.data);

  // overwrite user data to local storage
  localStorage.removeItem("user");
  localStorage.setItem("user", JSON.stringify(res.data));

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchUsers = (value: any) => async (dispatch: any) => {
  console.log("Action: fetchUsers receives " + value);
  const res = await axios.get("api/users", {
    params: { teamSelected: value }
  });
  dispatch({ type: FETCH_USERS, payload: res.data });
};

// Get a list of snippets based on filter values
export const fetchSnippets = (values: any) => async (dispatch: any) => {
  //console.log("Action: fetchSnippets");
  const res = await axios.get("api/snippets", {
    params: { ...values }
  });
  dispatch({ type: FETCH_SNIPPETS, payload: res.data });
};

// Get a single snippet based on ID
export const fetchSnippet = (snippetID: string) => async (dispatch: any) => {
  //console.log("Action: fetchSnippet with id " + snippetID);
  const res = await axios.get("api/snippet", {
    params: { id: snippetID }
  });
  dispatch({ type: FETCH_SNIPPET, payload: res.data });
};

// Get a list of comments based on snippet ID
export const fetchComments = (snippetId: string) => async (dispatch: any) => {
  //console.log("Action: fetchComments with id " + snippetId);
  const res = await axios.get("/api/comments", {
    params: { id: snippetId }
  });
  dispatch({ type: FETCH_COMMENTS, payload: res.data });
};

// Post a snippet
export const addSnippet = (values: any) => async (dispatch: any) => {
  //console.log("Action: post api/add_snippet");
  const res = await axios.post("api/add_snippet", values);
  dispatch({ type: FETCH_SNIPPETS, payload: res.data });
};

// Post a comment
export const addComment = (values: any) => async (dispatch: any) => {
  console.log(
    "Action: addComment with " +
      values.comment +
      " and snippet id " +
      values.snippetId
  );
  const res = await axios.post("/api/add_comment", values);
  dispatch({ type: FETCH_COMMENTS, payload: res.data });
};

// Delete a comment with comment ID
export const deleteComment = (snipId: string, comId: string) => async (
  dispatch: any
) => {
  //console.log("Action: deleteComment from " + snipId + "/" + comId);
  const res = await axios.delete("/api/delete_comment", {
    params: { snippetId: snipId, commentId: comId }
  });
  dispatch({ type: FETCH_COMMENTS, payload: res.data });
};

export const fetchTeams = (teamIds?: Array<string>) => async (
  dispatch: Dispatch<AnyAction>
) => {
  console.log("get api/teams");
  const res = await axios.get("/api/teams");
  dispatch({ type: FETCH_TEAMS, payload: res.data });
};

export const selectTeam = (teamId: string) => {
  return { type: SELECT_TEAM, payload: teamId };
};

export const selectWeek = (week: any) => {
  return { type: SELECT_WEEK, payload: week };
};

// FIXME: add team actions aren't being used correctly
export const addTeam = (team: Team, next?: () => void) => async (
  dispatch: Dispatch<AnyAction>
) => {
  console.log("post api/add_team", team);

  const res = await axios.post("api/add_team", team);
  // console.log('post api/add_team res', res);

  dispatch({ type: ADD_TEAM, payload: res.data });
  dispatch(selectTeam(res.data.newTeamId));

  if (next) next();
};

// FIXME: edit team actions aren't being used correctly
export const editTeam = (
  team: Team,
  teamId: string,
  next?: () => void
) => async (dispatch: Dispatch<AnyAction>) => {
  console.log("post api/edit_team", teamId, team);

  const res = await axios.post("/api/edit_team", { teamId, ...team });

  dispatch({ type: EDIT_TEAM, payload: res.data });

  if (next) next();
};
