import { SELECT_WEEK } from "../types";
import moment from "moment";

const selectedWeekReducer = (state = moment().format("W"), action: any) => {
  switch (action.type) {
    case SELECT_WEEK:
      return action.payload;
    default:
      return state;
  }
};

export default selectedWeekReducer;
