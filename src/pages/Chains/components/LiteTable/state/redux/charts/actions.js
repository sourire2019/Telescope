/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import types from './types'

const getChannel = (channel) => ({
  type: types.CHANNEL,
  payload: { channel }
})


export default {
  getChannel
}
