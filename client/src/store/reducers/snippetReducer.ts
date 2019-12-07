import {
  FETCH_SNIPPETS,
  FETCH_SNIPPET,
  SEARCH_SNIPPETS,
  LIKE_SNIPPET,
  DISLIKE_SNIPPET
} from "../types";

const snippetReducer = (state = [], action: any) => {
  switch (action.type) {
    case FETCH_SNIPPETS:
      return action.payload;
    case FETCH_SNIPPET:
      return action.payload;
    case SEARCH_SNIPPETS:
      return action.payload;
    case LIKE_SNIPPET:
      return state;
    case DISLIKE_SNIPPET:
      return state;
    default:
      return state;
  }
};

export default snippetReducer;
