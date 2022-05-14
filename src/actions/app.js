import { UPDATE_NAV_STATE, LOG_IN, UPDATE_CODE } from './action-types'

export function updateState(flag) {
  return {
    type: UPDATE_NAV_STATE,
    payload: { flag },
  }
}

export function login() {
  return {
    type: LOG_IN,
  }
}

export function setCode(code) {
  return {
    type: UPDATE_CODE,
    payload: { code },
  }
}
