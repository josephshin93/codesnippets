import axios from "axios";
import {
  FETCH_USER,
  FETCH_USERS,
  FETCH_SNIPPETS,
  FETCH_SNIPPET,
  FETCH_COMMENTS,
  AUTHORIZE_USER,
  FETCH_TEAMS,
  SELECT_TEAM,
  SELECT_WEEK
} from "../types";
import { async } from "q";

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
  console.log("Action: fetchSnippets");
  const res = await axios.get("api/snippets", {
    params: { ...values }
  });
  dispatch({ type: FETCH_SNIPPETS, payload: res.data });
};

// Get a single snippet based on ID
export const fetchSnippet = (snippetID: string) => async (dispatch: any) => {
  console.log("Action: fetchSnippet with id " + snippetID);
  const res = await axios.get("api/snippet", {
    params: { id: snippetID }
  });
  dispatch({ type: FETCH_SNIPPET, payload: res.data });
};

// Get a list of comments based on snippet ID
export const fetchComments = (snippetId: string) => async (dispatch: any) => {
  console.log("Action: fetchComments with id " + snippetId);
  const res = await axios.get("api/comments", {
    params: { snippetId: snippetId }
  });
  dispatch({ type: FETCH_COMMENTS, payload: res.data });
};

export const addSnippet = (values: any) => async (dispatch: any) => {
  console.log("get api/add_snippet");
  const res = await axios.post("api/add_snippet", values);
  dispatch({ type: FETCH_SNIPPETS, payload: res.data });
};

export const fetchTeams = (teamIds?: Array<string>) => async (
  dispatch: Function
) => {
  console.log("get api/teams");
  const res = await axios.get("api/teams");
  dispatch({ type: FETCH_TEAMS, payload: res.data });
};

/*
export const mockFetchTeams = () => (dispatch: Function) => {
  dispatch({ type: FETCH_TEAMS, payload: teams });
};
*/

export const selectTeam = (teamId: string) => {
  return { type: SELECT_TEAM, payload: teamId };
};

export const selectWeek = (week: any) => {
  return { type: SELECT_WEEK, payload: week };
};
