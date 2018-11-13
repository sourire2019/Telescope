/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import actions from './actions'
import axios from 'axios'

const blockPerHour = channel => dispatch => {
  
  return  axios({
      method: "get",
      url: '/mock/blockPerHour.json'
    })
    .then(resp => {
      dispatch(actions.getBlockPerHour(resp.data))
    })
    .catch(error => {
      console.error(error)
    })
}

const blockPerMin = channel => dispatch => {
  return axios({
      method: "get",
      url: '/mock/blockPerMin.json'
    })
    .then(resp => {
      dispatch(actions.getBlockPerMin(resp.data))
    })
    .catch(error => {
      console.error(error)
    })
}

const changeChannel = channel => dispatch => {
  return axios({
      method: "get",
      url: '/mock/changechannel.json'
    })
    .then(resp => {
      dispatch(actions.updateChannel(resp.data))
    })
    .catch(error => {
      console.error(error)
    })
}

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

const dashStats = channel => dispatch => {
  return axios({
      method: "get",
      url: '/mock/dashstats.json'
    })
    .then(resp => {
      dispatch(actions.getDashStats(resp.data))
    })
    .catch(error => {
      console.error(error)
    })
}

const notification = notification => dispatch => {
  var notify = JSON.parse(notification)
  dispatch(actions.getNotification(notify))
}

const nodeStatus = channel => dispatch => {
  return axios({
      method: "get",
      url: '/mock/nodesStatus.json'
    })
    .then(resp => {
      dispatch(actions.getNodeStatus(resp.data))
    })
    .catch(error => {
      console.error(error)
    })
}

const transactionByOrg = channel => dispatch => {
  return axios({
      method: "get",
      url: '/mock/txByOrg.json'
    })
    .then(resp => {
      dispatch(actions.getTransactionByOrg(resp.data))
    })
    .catch(error => {
      console.error(error)
    })
}

const transactionPerHour = channel => dispatch => {
  return axios({
      method: "get",
      url: '/mock/txByHour.json'
    })
    .then(resp => {
      dispatch(actions.getTransactionPerHour(resp.data))
    })
    .catch(error => {
      console.error(error)
    })
}

const transactionPerMin = channel => dispatch => {
  return axios({
      method: "get",
      url: '/mock/transactionPerMin.json'
    })
    .then(resp => {
      dispatch(actions.getTransactionPerMin(resp.data))
    })
    .catch(error => {
      console.error(error)
    })
}

export default {
  blockPerHour,
  blockPerMin,
  transactionPerHour,
  transactionPerMin,
  transactionByOrg,
  notification,
  dashStats,
  channel,
  channelList,
  changeChannel,
  nodeStatus
}
