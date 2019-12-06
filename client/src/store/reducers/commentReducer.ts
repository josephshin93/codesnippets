import { FETCH_COMMENTS } from "../types";

const commentReducer = (state = [], action: any) => {
  //console.log(action);
  switch (action.type) {
    case FETCH_COMMENTS:
      return action.payload;
    default:
      return state;
  }
};

export default commentReducer;
