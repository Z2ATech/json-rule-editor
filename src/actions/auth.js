import * as ActionTypes from './action-types'
import { setCode, setToken } from './app'

export const updateCode = code => dispatch => {
  dispatch(setCode(code))
  return dispatch({
    type: ActionTypes.UPDATE_CODE,
    payload: { code },
  })
}

export const updateToken = token => dispatch => {
  dispatch(setToken(token))
  return dispatch({
    type: ActionTypes.UPDATE_TOKEN,
    payload: { token },
  })
}
