
import types from './types'


const getChannels = (channels) => ({
  type: types.CHANNELS,
  payload: channels
})

export default {
  getChannels
}
