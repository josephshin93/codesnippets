import axios from 'axios';
import {
    FETCH_USER,
    FETCH_SNIPPETS,
    AUTHORIZE_USER,
} from './types';

export const authorizeUser = () => {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    return {
        type: AUTHORIZE_USER,
        user,
    };
}

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