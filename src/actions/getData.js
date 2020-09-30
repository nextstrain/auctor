import queryString from "query-string"; // eslint-disable-line import/no-extraneous-dependencies
import { fetchDataAndDispatch } from "auspice/src/actions/loadData";

export const getDatasetAndDispatch = (dispatch, blocks) => {
  const firstURL = blocks[0].dataset;
  const firstQuery = queryString.parse(blocks[0].query);
  fetchDataAndDispatch(dispatch, firstURL, firstQuery, blocks);
};
