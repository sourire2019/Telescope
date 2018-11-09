import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Table } from '@icedesign/base';
import ContainerTitle from './ContainerTitle';


import compose from "recompose/compose";
import {connect} from "react-redux";
import {chartOperations, chartSelectors} from "./state/redux/charts/";
import {tableOperations, tableSelectors} from "./state/redux/tables/";
import config from './config.json';
import { FormattedMessage } from 'react-intl';

const {contractList } = tableOperations;
const {channelsSelector, contractListSelector} = tableSelectors
const {currentChannelSelector} = chartSelectors;
const channel = tableOperations.channels;

export class MemberList extends Component {
  static displayName = 'MemberList';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  renderProfile = (value, index, record) => {
    return (
      <div style={styles.profile}>
        <img src={record.avatar} alt="" style={styles.avatar} />
        <span style={styles.name}>{record.name}</span>
      </div>
    );
  };

  renderOper = () => {
    return (
      <div>
        <a style={{ ...styles.link, ...styles.edit }}>修改</a>
        <a style={{ ...styles.link, ...styles.delete }}>删除</a>
      </div>
    );
  };

  async componentWillMount () {
    let arr = [];
    let selectedValue ={}
    await this.props.getChannels()
    const currentChannel = this.props.currentChannel
    await this.props.getcontractList(currentChannel)

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
      this.props.getcontractList(currentChannel),
      this.props.getChannels(),
    ])
   
  }
  componentWillReceiveProps(nextProps) {
    this.setState({contractList : nextProps.contractList})
  }

  render() {
    const columnHeaders = [];
    for (let i = 0; i < config.contract.length; i++) {
      switch(config.contract[i]) {
        case 'contractname' : columnHeaders.push(
            <Table.Column key = {config.contract[i]} title={<FormattedMessage
              id='page.localeProvider.contractname'
              defaultMessage='Contract Name'
              description='Contract Name'
            />}
              dataIndex="contractname"
              cell= {row => (
                <a className = "hash-hide" onClick={() => this.sourceDialogOpen(row.original)}  href="#/contracts" >
                {row.value}</a>
              )}
              width={200} />
          );break

        case "channelname" : columnHeaders.push(
          <Table.Column key = {config.contract[i]} title={<FormattedMessage
            id="page.localeProvider.channelname"
            defaultMessage='Channel Name'
            description='Channel Name'
            />}
            dataIndex="channelName"
            width={200} />
        ); break;

        case "path" : columnHeaders.push(
          <Table.Column key = {config.contract[i]} title={<FormattedMessage
            id="page.localeProvider.path"
            defaultMessage='Path'
            description='Path'
            />}
            dataIndex="path"
            width={200} />
        ); break;
        case "transactions_count" : columnHeaders.push(
          <Table.Column key = {config.contract[i]} title={<FormattedMessage
            id="page.localeProvider.txcount"
            defaultMessage='Transaction Count'
            description='Transaction Count'
            />}
            dataIndex="txCount"
            width={200} />
        ); break;

        case "version" : columnHeaders.push(
            <Table.Column key = {config.contract[i]} title={<FormattedMessage
            id="page.localeProvider.version"
            defaultMessage='Version'
            description='Version'
            />}
            dataIndex="version"
            width={200} />
              
        ); break;

        case "name" : columnHeaders.push(
           <Table.Column key = {config.contract[i]} title={<FormattedMessage
            id="page.localeProvider.name"
            defaultMessage='name'
            description='name'
            />}
            dataIndex="name"
            width={200} />
         
        ); break;

        case "balance" : columnHeaders.push(
          <Table.Column key = {config.contract[i]} title={<FormattedMessage
            id="page.localeProvider.balance"
            defaultMessage='balance'
            description='balance'
            />}
            dataIndex="balance"
            width={200} />
        ); break;

        case "txcount" : columnHeaders.push(
          <Table.Column key = {config.contract[i]} title={<FormattedMessage
            id="page.localeProvider.txcount"
            defaultMessage='txcount'
            description='txcount'
            />}
            dataIndex="txcount"
            width={200} />
        ); break;

        case "creator" : columnHeaders.push(
          <Table.Column key = {config.contract[i]} title={<FormattedMessage
            id="page.localeProvider.creator"
            defaultMessage='creator'
            description='creator'
            />}
            dataIndex="creator"
            width={200} />
        ); break;

        case "creator_hash" : columnHeaders.push(
          <Table.Column key = {config.contract[i]} title={<FormattedMessage
            id="page.localeProvider.creator_hash"
            defaultMessage='Creator Hash'
            description='Creator Hash'
            />}
            dataIndex="creator_hash"
            width={200} />
        ); break;

        case "contract_code" : columnHeaders.push(
          <Table.Column key = {config.contract[i]} title={<FormattedMessage
            id="page.localeProvider.contract_code"
            defaultMessage='Contract Code'
            description='Contract Code'
            />}
            dataIndex="contract_code"
            width={200} />
        ); break;


        default : break;

        }
    }
    return (
      <IceContainer style={styles.container}>
        {/*<ContainerTitle
                  title="项目成员"
                  buttonText="添加成员"
                  style={styles.title}
                />*/}
        <Table dataSource={this.state.contractList} hasBorder={false}>
          {columnHeaders}
        </Table>
      </IceContainer>
    );
  }
}

const styles = {
  container: {
    padding: '0',
  },
  title: {
    borderBottom: '0',
  },
  profile: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    width: '24px',
    height: '24px',
    border: '1px solid #eee',
    background: '#eee',
    borderRadius: '50px',
  },
  name: {
    marginLeft: '15px',
    color: '#314659',
    fontSize: '14px',
  },
  link: {
    cursor: 'pointer',
    color: '#1890ff',
  },
  edit: {
    marginRight: '5px',
  },
};


export default compose(
  connect(
    state => ({
      currentChannel: currentChannelSelector(state),
      channels : channelsSelector(state),
      contractList : contractListSelector(state)
    }),
    {
      getcontractList: contractList,
      getChannels : channel
    }
  )
)(MemberList);