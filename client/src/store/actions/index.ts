import axios from "axios";
import {
  FETCH_USER,
  FETCH_SNIPPETS,
  AUTHORIZE_USER,
  FETCH_TEAMS,
  SELECT_TEAM
} from "../types";
import { teams } from "../DummyData";

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

/**
 * TODO:
 *   implement this function to get snippets from a specific team, if no team
 *   is specified, then get all snippets from teams involving the current user
 */
export const fetchSnippets = (values: any) => async (dispatch: any) => {
  console.log("Action: fetchSnippets");
  const res = await axios.get("api/snippets", {
    params: { ...values }
  });
  dispatch({ type: FETCH_SNIPPETS, payload: res.data });
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

export const mockFetchTeams = () => (dispatch: Function) => {
  dispatch({ type: FETCH_TEAMS, payload: teams });
};

export const selectTeam = (teamId: string) => {
  return { type: SELECT_TEAM, payload: teamId };
};
