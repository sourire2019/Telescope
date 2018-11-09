
import types from './types'

const getContractList = (contractList) => ({
  type: types.CONTRACT_LIST,
  payload: contractList
})

const getChannels = (channels) => ({
  type: types.CHANNELS,
  payload: channels
})


export default {
  getContractList,
  getChannels
}
