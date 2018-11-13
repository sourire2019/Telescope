/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import actions from './actions'
import moment from 'moment-timezone'
import axios from 'axios'


const blockList = (channel) => (dispatch) => {
  return  axios({
      method: "get",
      url: '/mock/blockList.json'
    })
    .then(resp => {
      dispatch(actions.getBlockList(resp.data))
    }).catch(error => {
      console.error(error)
    })
}

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

const transaction = (channel, transactionId) => (dispatch) => {
  return axios({
      method: "get",
      url: '/mock/transaction.json'
    })
    .then(resp => {
      dispatch(actions.getTransaction(resp.data))
    }).catch(error => {
      console.error(error)
    })
}

const transactionList = (channel) => (dispatch) => {
  return axios({
      method: "get",
      url: '/mock/transactionList.json'
    })
    .then(resp => {
      dispatch(actions.getTransactionList(resp.data))
    }).catch(error => {
      console.error(error)
    })
}

export default {
  blockList,
  contractList,
  channels,
  nodeList,
  transaction,
  transactionList
}
