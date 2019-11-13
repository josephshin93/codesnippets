import { FETCH_SNIPPETS } from '../types'

const snippetReducer = (state = [], action: any) => {
    switch (action.type) {
        case FETCH_SNIPPETS:
            return action.payload;
        default:
            return state;
    }
};

export default snippetReducer;