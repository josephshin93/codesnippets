import { FETCH_USERS } from "../types";

const usersReducer = (state = [], action: any) => {
  switch (action.type) {
    case FETCH_USERS:
      return action.payload;
    default:
      return state;
  }
};

export default usersReducer;
