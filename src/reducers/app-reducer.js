import {
  UPDATE_NAV_STATE,
  LOG_IN,
  UPDATE_CODE,
  UPDATE_TOKEN,
} from '../actions/action-types'

const initialState = {
  navState: 'closed',
  loggedIn: false,
  code: '',
  token: '',
}

const AppReducer = (state = initialState, action) => {
  const type = action.type
  switch (type) {
    case UPDATE_NAV_STATE: {
      let nav = 'closed'
      if (action.payload && action.payload.flag === 'open') {
        nav = 'open'
      }
      return { ...state, navState: nav }
    }
    case LOG_IN:
      return { ...state, loggedIn: true }
    case UPDATE_CODE: {
      state.code = action.payload.code
      return { ...state }
    }
    case UPDATE_TOKEN: {
      state.token = action.payload.token
      return { ...state }
    }
    default:
      return state
  }
}

export default AppReducer
