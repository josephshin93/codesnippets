import axios from "axios";
import {
  Team,
  FETCH_USER,
  FETCH_USERS,
  FETCH_SNIPPETS,
  AUTHORIZE_USER,
  FETCH_TEAMS,
  SELECT_TEAM,
  SELECT_WEEK,
  ADD_TEAM,
  EDIT_TEAM,
} from '../types';
import {
  teams,
} from '../DummyData';
import {
  Dispatch, 
  AnyAction, 
} from 'redux';



export const authorizeUser = () => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  return {
    type: AUTHORIZE_USER,
    user
  };
};

export const fetchUser = () => async (dispatch: any) => {
  console.log('get api/current_user');
  const res = await axios.get('api/current_user');
  // console.log('get api/current_user res data', res.data);

  // overwrite user data to local storage
  localStorage.removeItem('user');
  localStorage.setItem('user', JSON.stringify(res.data));

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchUsers = (value: any) => async (dispatch: any) => {
  console.log("Action: fetchUsers receives " + value);
  const res = await axios.get("api/users", {
    params: { teamSelected: value }
  });
  dispatch({ type: FETCH_USERS, payload: res.data });
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
  dispatch: Dispatch<AnyAction>
) => {
  console.log('get api/teams');
  const res = await axios.get('/api/teams');
  dispatch({ type: FETCH_TEAMS, payload: res.data });
 };

export const mockFetchTeams = () => (dispatch: Dispatch<AnyAction>) => {
  dispatch({ type: FETCH_TEAMS, payload: teams });
};

export const selectTeam = (teamId: string) => {
  return { type: SELECT_TEAM, payload: teamId };
};

export const selectWeek = (week: any) => {
  return { type: SELECT_WEEK, payload: week };
};

// FIXME: add team actions aren't being used correctly
export const addTeam = (team: Team, next?: () => void) => 
  async (dispatch: Dispatch<AnyAction>) => {
    console.log('post api/add_team', team);

    const res = await axios.post('api/add_team', team);
    // console.log('post api/add_team res', res);

    dispatch({ type: ADD_TEAM, payload: res.data });
    dispatch(selectTeam(res.data.newTeamId));

    if (next) next();
  };

// FIXME: edit team actions aren't being used correctly
export const editTeam = (team: Team, teamId: string, next?: () => void) => 
  async (dispatch: Dispatch<AnyAction>) => {
    console.log('post api/edit_team', teamId, team);

    const res = await axios.post('/api/edit_team', { teamId, ...team });

    dispatch({ type: EDIT_TEAM, payload: res.data });
    
    if (next) next();
  };
