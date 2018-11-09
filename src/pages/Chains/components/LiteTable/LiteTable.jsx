import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Table } from '@icedesign/base';

import compose from "recompose/compose";
import {connect} from "react-redux";
import {chartOperations, chartSelectors} from "./state/redux/charts/";
import {tableOperations, tableSelectors} from "./state/redux/tables/";
import config from './config.json';
import { FormattedMessage } from 'react-intl'

const {channelsSelector} = tableSelectors
const {currentChannelSelector} = chartSelectors;
const channel = tableOperations.channels;
const styles = {
  processing: {
    color: '#5485F7',
  },
  finish: {
    color: '#64D874',
  },
  terminated: {
    color: '#999999',
  },
  pass: {
    color: '#FA7070',
  },
};


export  class LiteTable extends Component {
  static displayName = 'LiteTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {      
      chains : [],
      channels : [],
      selectedChannel: {}
    };
  }

  async componentWillMount () {
    let arr = [];
    let selectedValue ={}
    await Promise.all([this.props.getChannels()])
    const currentChannel = this.props.currentChannel

    if (this.props.channels) {
      this.props.channels.forEach(element => {
      if (element.genesis_block_hash === this.props.currentChannel) {
        selectedValue = {
          value: element.genesis_block_hash,
          label: element.channelname
        };

      }
      arr.push({
        value: element.genesis_block_hash,
        label: element.channelname
      });
    });
    }
    this.setState({
      channels: arr,
      chains : this.props.channels,
      selectedChannel: selectedValue
    });
    setInterval(() => this.syncData(this.props.currentChannel), 5000);
  }

  async syncData(currentChannel) {
    await Promise.all([
      this.props.getChannels(),
    ])
   
  }
  componentWillReceiveProps(nextProps) {
    this.setState({chains : nextProps.channels})
  }

  render() {
    const columnHeaders = []
    for (let i = 0; i < config.chains.length; i++) {
      switch(config.chains[i]) {
        case "id" : columnHeaders.push(
          <Table.Column key = {config.chains[i]} title={
            <FormattedMessage
              id="page.localeProvider.id"
              defaultMessage='ID'
              description='ID'
            />
            }
            dataIndex="id" width={100} />
        ); break;
        case "chainname" : columnHeaders.push(
          <Table.Column key = {config.chains[i]} title={
            <FormattedMessage
              id="page.localeProvider.chainname"
              defaultMessage='Chain Name'
              description='Chain Name'
            />
            }
            dataIndex="channelname"  />
        ); break;
          
        case "channelhash" : columnHeaders.push(
          <Table.Column key = {config.chains[i]} title={
            <FormattedMessage
              id="page.localeProvider.channelhash"
              defaultMessage='Channel Hash'
              description='Channel Hash'
              />
            }
            dataIndex="channel_hash"  />
        ); break;
        case "blocks" : columnHeaders.push(
          <Table.Column key = {config.chains[i]} title={
            <FormattedMessage
              id="page.localeProvider.blocks_l"
              defaultMessage='Blocks'
              description='Blocks'
              />
            }
            dataIndex="blocks" width = {125} />
        ); break;
        case "transactions" : columnHeaders.push(
          <Table.Column key = {config.chains[i]} title={
            <FormattedMessage
              id="page.localeProvider.transactionsl"
              defaultMessage='Transactions'
              description='Transactions'
              />
            }
            dataIndex="transactions" width = {125} />
        ); break;
        case "timestamp" : columnHeaders.push(
          <Table.Column key = {config.chains[i]} title={
            <FormattedMessage
              id="page.localeProvider.timestamp"
              defaultMessage='Timestamp'
              description='Timestamp'
              />
            }
            dataIndex="createdat"  />
        ); break;
        default : break;

      }
    }
    return (
      <div className="lite-table">
        <IceContainer style={styles.tableCard}>
          <Table dataSource={this.state.chains} hasBorder={false}>
            {columnHeaders}
          </Table>
        </IceContainer>
      </div>
    );
  }
}

export default compose(
  connect(
    state => ({
      currentChannel: currentChannelSelector(state),
      channels : channelsSelector(state)
    }),
    {
      getChannels : channel
    }
  )
)(LiteTable);