import actions from './actions'
import moment from 'moment-timezone'
import axios from 'axios'


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

const nodeList = (channel) => (dispatch) => {
  return axios({
      method: "get",
      url: '/mock/nodeList.json'
    })
    .then(resp => {
      dispatch(actions.getNodeList(resp.data))
    }).catch(error => {
      console.error(error)
    })
}


export default {
  channels,
  nodeList
}
