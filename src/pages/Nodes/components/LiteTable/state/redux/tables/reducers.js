/**
 *    SPDX-License-Identifier: Apache-2.0
 */

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

const nodeListReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.NODE_LIST: {
      return ({
        rows: action.payload.nodes,
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
  channels: channelsReducer,
  nodeList: nodeListReducer
})

export default reducer
