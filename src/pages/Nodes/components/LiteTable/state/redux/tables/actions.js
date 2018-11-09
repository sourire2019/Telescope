/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import types from './types'

const getChannels = (channels) => ({
  type: types.CHANNELS,
  payload: channels
})

const getNodeList = (nodeList) => ({
  type: types.NODE_LIST,
  payload: nodeList
})


export default {
  getChannels,
  getNodeList
}
