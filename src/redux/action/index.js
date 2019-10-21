import { combineReducers } from "redux";

import user from "./user";
import market from "./market";

export default combineReducers({
  user,
  market
});
