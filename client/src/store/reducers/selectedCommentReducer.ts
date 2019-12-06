import { SELECT_COMMENT } from "../types";

const selectedCommentReducer = (state = "", action: any) => {
  switch (action.type) {
    case SELECT_COMMENT:
      return action.payload;
    default:
      return state;
  }
};

export default selectedCommentReducer;
