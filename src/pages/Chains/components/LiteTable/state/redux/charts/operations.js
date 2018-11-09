/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import actions from './actions'
import axios from 'axios'

const channel = () => dispatch => {
  return axios({
      method: "get",
      url: '/mock/changechannel.json'
    })
    .then(resp => {
      dispatch(actions.getChannel(resp.data))
    })
    .catch(error => {
      console.error(error)
    })
}


export default {
  channel
}
