import { combineReducers } from "redux";

import user from "./user";
import snack from "./snack";

export default combineReducers({
  user,
  snack
});
