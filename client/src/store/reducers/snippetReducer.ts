import {
  FETCH_SNIPPETS,
  FETCH_SNIPPET,
  SEARCH_SNIPPETS,
  LIKE_SNIPPET,
  DISLIKE_SNIPPET,
  Snippet
} from "../types";

// Reducer for liking a snippet
const likeSnippet = (state: Snippet[], action: any) => {
  // Setup variables
  const i = action.index;
  const count = state[i].totalLikes + 1;
  if (action.form === "push") {
    // Copy the likes array
    let newLikes = state[i].likes;
    // Push user to likes
    newLikes.push(action.userId);
    // Return state
    return [
      ...state.slice(0, i), // before the one we are updating
      { ...state[i], likes: newLikes, totalLikes: count },
      ...state.slice(i + 1) // after the one we are updating
    ];
  }
  return [
    ...state.slice(0, i),
    { ...state[i], likes: [action.userId.toString()], totalLikes: count },
    ...state.slice(i + 1)
  ];
};

// Reducer for disliking a snippet
const dislikeSnippet = (state: Snippet[], action: any) => {
  // Setup variables
  const j = action.index;
  const cnt = state[j].totalLikes - 1;
  let newLikes = state[j].likes;
  // Remove the user from the 'newLikes' array
  for (var k = 0; k < newLikes.length; k++)
    if (newLikes[k] === action.userId) newLikes.splice(k, 1);
  return [
    ...state.slice(0, j), // before the one we are updating
    { ...state[j], likes: newLikes, totalLikes: cnt },
    ...state.slice(j + 1) // after the one we are updating
  ];
};

const snippetReducer = (state: Snippet[] = [], action: any) => {
  switch (action.type) {
    case FETCH_SNIPPETS:
      return action.payload;
    case FETCH_SNIPPET:
      return action.payload;
    case SEARCH_SNIPPETS:
      return action.payload;
    case LIKE_SNIPPET:
      return likeSnippet(state, action);
    case DISLIKE_SNIPPET:
      return dislikeSnippet(state, action);
    default:
      return state;
  }
};

export default snippetReducer;
