import { FETCH_SNIPPETS, FETCH_SNIPPET } from "../types";

const snippetReducer = (state = [], action: any) => {
  switch (action.type) {
    case FETCH_SNIPPETS:
      return action.payload;
    case FETCH_SNIPPET:
      return action.payload;
    default:
      return state;
  }
};

export default snippetReducer;
