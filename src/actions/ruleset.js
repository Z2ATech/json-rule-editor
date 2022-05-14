import * as ActionTypes from './action-types'
import { updateState } from './app'

export const uploadRuleset = ruleset => dispatch => {
  dispatch(updateState('open'))
  return dispatch({
    type: ActionTypes.UPLOAD_RULESET,
    payload: { ruleset },
  })
}

export const addRuleset = (name, attributes, decisions) => dispatch => {
  dispatch(updateState('open'))
  if (attributes && decisions) {
    return dispatch({
      type: ActionTypes.ADD_RULESET,
      payload: { name, attributes, decisions },
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
