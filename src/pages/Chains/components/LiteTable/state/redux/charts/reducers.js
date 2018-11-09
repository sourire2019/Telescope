
import { combineReducers } from 'redux'
import types from './types'

/* Reducers for Dashboard Charts */
const initialState = {}

const channelReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CHANNEL: {
      return action.payload.channel
    }
    case types.CHANGE_CHANNEL: {
      return action.payload.channel
    }
    default: {
      return state
    }
  }
}

const reducer = combineReducers({
  channel: channelReducer
})

export default reducer
