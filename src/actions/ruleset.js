import * as ActionTypes from './action-types'
import { updateState } from './app'

export const uploadRuleset = ruleset => dispatch => {
  dispatch(updateState('open'))
  return dispatch({
    type: ActionTypes.UPLOAD_RULESET,
    payload: { ruleset },
  })
}

export const clearRuleset = () => dispatch => {
  dispatch(updateState('open'))
  return dispatch({
    type: ActionTypes.CLEAR_RULESETS,
  })
}
export const removeRuleset =
  (removeAll = false, ruleSetIndex = 0) =>
  (dispatch) => {
    dispatch(updateState('open'));
    return dispatch({
      type: ActionTypes.REMOVE_RULESET,
      payload: { removeAll, ruleSetIndex },
    });
  };

export const addRuleset =
  (name, attributes, decisions, initial) => dispatch => {
    dispatch(updateState('open'))
    if (attributes && decisions) {
      return dispatch({
        type: ActionTypes.ADD_RULESET,
        payload: { name, attributes, decisions, initial: initial },
      })
    } else {
      return dispatch({
        type: ActionTypes.ADD_RULESET,
        payload: { name },
      })
    }
  }

export const updateRulesetIndex = name => {
  return {
    type: ActionTypes.UPDATE_RULESET_INDEX,
    payload: { name },
  }
}
