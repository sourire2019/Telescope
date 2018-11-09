
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

const channelList = () => dispatch => {
  return axios({
      method: "get",
      url: '/mock/channels.json'
    })
    .then(resp => {
      dispatch(actions.getChannelList(resp.data))
    })
    .catch(error => {
      console.error(error)
    })
}


export default {
  channel,
  channelList
}
