import * as ActionTypes from './action-types'
import { setCode } from './app'

export const updateCode = code => dispatch => {
  dispatch(setCode(code))
  return dispatch({
    type: ActionTypes.UPDATE_CODE,
    payload: { code },
  })
}
