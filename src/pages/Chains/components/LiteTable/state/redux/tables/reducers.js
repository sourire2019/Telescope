
import { combineReducers } from 'redux'
import types from './types'

const initialState = {}

const channelsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CHANNELS: {
      return ({
        rows: action.payload.channels,
        loaded: true,
        errors: action.error
      })
    }
    default: {
      return state
    }
  }
}


const reducer = combineReducers({
  channels: channelsReducer
})

export default reducer
