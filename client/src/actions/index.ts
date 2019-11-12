import axios from 'axios';
import { FETCH_USER, FETCH_SNIPPETS, FETCH_TEAMS } from './types';

export const fetchUser = () => async (dispatch: any) => {
    const res = await axios.get('api/current_user')
    dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchSnippets = () => async (dispatch: any) => {
    const res = await axios.get('api/snippets')
    dispatch({ type: FETCH_SNIPPETS, payload: res.data });
};

export const addSnippet = (values: any) => async (dispatch: any) => {
    const res = await axios.post('api/add_snippet', values);
    dispatch({ type: FETCH_SNIPPETS, payload: res.data });
};

export const fetchTeams = () => async (dispatch: any) => {
    const res = await axios.get('api/teams')
    dispatch({ type: FETCH_TEAMS, payload: res.data });
};

export const addTeam = (values: any) => async (dispatch: any) => {
    const res = await axios.post('api/add_team', values);
    dispatch({ type: FETCH_TEAMS, payload: res.data });
};
