/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import actions from './actions'
import moment from 'moment-timezone'
import axios from 'axios'

// table channel
const channels = () => (dispatch) => {
  return axios({
      method: "get",
      url: '/mock/channels.json'
    })
    .then(resp => {
      dispatch(actions.getChannels(resp.data))
    }).catch(error => {
      console.error(error)
    })
}

export default {
  channels
}
