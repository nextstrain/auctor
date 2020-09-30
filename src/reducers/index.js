import { combineReducers } from "redux";
import metadata from "auspice/src/reducers/metadata";
import tree from "auspice/src/reducers/tree";
import frequencies from "auspice/src/reducers/frequencies";
import entropy from "auspice/src/reducers/entropy";
import controls from "auspice/src/reducers/controls";
import browserDimensions from "auspice/src/reducers/browserDimensions";
import notifications from "auspice/src/reducers/notifications";
import narrative from "auspice/src/reducers/narrative";
import treeToo from "auspice/src/reducers/treeToo";
import general from "auspice/src/reducers/general";
import editor from "./editor";

const rootReducer = combineReducers({
  metadata,
  tree,
  frequencies,
  controls,
  entropy,
  browserDimensions,
  notifications,
  narrative,
  treeToo,
  general,
  editor
});

export default rootReducer;
