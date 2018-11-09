import { combineReducers } from 'redux'
import types from './types'

const initialState = {}

const contractListReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CONTRACT_LIST: {
      return ({
        rows: action.payload.contract,
        loaded: true,
        errors: action.error
      })
    }
    default: {
      return state
    }
  }
}

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
  contractList: contractListReducer,
  channels: channelsReducer
})

export default reducer
