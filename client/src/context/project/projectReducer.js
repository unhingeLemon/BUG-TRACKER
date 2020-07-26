import { GET_ALL_PROJECT, GET_CURRENT_PROJECT } from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_ALL_PROJECT:
      return {
        ...state,
        projects: action.payload,
      };
    case GET_CURRENT_PROJECT:
      return {
        ...state,
        project: action.payload,
      };
    default:
      return state;
  }
};
