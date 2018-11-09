
import actions from './actions'
import moment from 'moment-timezone'
import axios from 'axios'


const contractList = (channel) => (dispatch) => {
  return axios({
      method: "get",
      url: '/mock/contractList.json'
    })
    .then(resp => {
      dispatch(actions.getContractList(resp.data))
    }).catch(error => {
      console.error(error)
    })
}

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
  contractList,
  channels
}
