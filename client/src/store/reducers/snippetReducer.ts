import { FETCH_SNIPPETS, SEARCH_SNIPPETS } from '../types'

const snippetReducer = (state = [], action: any) => {
    switch (action.type) {
        case FETCH_SNIPPETS:
            return action.payload;
        case SEARCH_SNIPPETS:
            return action.payload;
        default:
            return state;
    }
};

export default snippetReducer;