import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Table } from '@icedesign/base';
import compose from "recompose/compose";
import {connect} from "react-redux";
import {chartOperations, chartSelectors} from "./state/redux/charts/";
import {tableOperations, tableSelectors} from "./state/redux/tables/";
import config from './config.json'
import { FormattedMessage } from 'react-intl'
import { IntlProvider } from 'react-intl';
import 'flag-icon-css/css/flag-icon.min.css';
import 'bootstrap/dist/css/bootstrap.css'

const {nodeList } = tableOperations;
const {channelsSelector, nodeListSelector} = tableSelectors
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


export class LiteTable extends Component {
  static displayName = 'LiteTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      nodeList : [],
      channels : [],
      selectedChannel: {}
    };
  }

  async componentDidMount () {
    let arr = [];
    let selectedValue ={}
    await this.props.getChannels()
    const currentChannel = this.props.currentChannel
    await this.props.getnodeList(currentChannel)

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
      selectedChannel: selectedValue
    });
   setInterval(() => this.syncData(this.props.currentChannel), 5000);
  }

  async syncData(currentChannel) {
    await Promise.all([
      this.props.getnodeList(currentChannel),
      this.props.getChannels(),
    ])
   
  }
  componentWillReceiveProps(nextProps) {
    this.setState({nodeList : nextProps.nodeList})
  }


  render() {
    const columnHeaders = []
    for (let i = 0; i < config.nodes.length; i++) {
      switch (config.nodes[i]) {
        case 'nodename' : columnHeaders.push(
          <Table.Column key = {config.nodes[i]} title={
            <FormattedMessage
              id='page.localeProvider.nodename'
              defaultMessage='Node Name'
              description='Node Name'
            />
            }
            dataIndex="server_hostname" width={100} />
        ); break
        case 'endpoint_url' : columnHeaders.push(
          <Table.Column key = {config.nodes[i]} title={
            <FormattedMessage
              id='page.localeProvider.endpoint'
              defaultMessage='ENDPOINT'
              description='ENDPOINT'
            />
            }
            dataIndex="requests" width={200} />
        );break
        case 'status' : columnHeaders.push(
          <Table.Column key = {config.nodes[i]} title={
              <FormattedMessage
              id='page.localeProvider.status_u'
              defaultMessage='Status'
              description='Status'
            />}
              cell= {<span style = {{color : '#00CC00'}}>success</span>}
              width={200} />
          );break
        case 'location' : columnHeaders.push(
            <Table.Column key = {config.nodes[i]} title={<FormattedMessage
              id='page.localeProvider.location'
              defaultMessage='location'
              description='location'
            />}
              cell= {<span><i className="flag-icon flag-icon-cn " /> Beijing <span style = {{color : "red"}}>• </span>
            China</span>}
              width={200} />
          );break
        default : break
      }
    }

    return (
      <div className="lite-table">
          <IceContainer style={styles.tableCard}>
            <Table dataSource={this.state.nodeList} hasBorder={false} >
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
      channels : channelsSelector(state),
      nodeList : nodeListSelector(state)
    }),
    {
      getnodeList: nodeList,
      getChannels : channel
    }
  )
)(LiteTable);