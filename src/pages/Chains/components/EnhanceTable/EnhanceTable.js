import React, { Component } from 'react';


import compose from "recompose/compose";
import {connect} from "react-redux";
import {chartOperations, chartSelectors} from "./state/redux/charts/";
import {tableOperations, tableSelectors} from "./state/redux/tables/";
import config from './config.json'
import { FormattedMessage } from 'react-intl'
import { IntlProvider } from 'react-intl';
import 'flag-icon-css/css/flag-icon.min.css';
import 'bootstrap/dist/css/bootstrap.css'

import { Table, Pagination, Tab, Search } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import DataBinder from '@icedesign/data-binder';
import IceLabel from '@icedesign/label';
import { enquireScreen } from 'enquire-js';


const {channelsSelector} = tableSelectors
const {currentChannelSelector, dashStatsSelector} = chartSelectors;
const channel = tableOperations.channels;
const {dashStats} = chartOperations;

export class EnhanceTable extends Component {
  static displayName = 'EnhanceTable';

  constructor(props) {
    super(props);
    this.queryCache = {};
    this.state = {
      channels : [],
      selectedChannel: {},
      activeKey: 'solved',
      isLoading : true,
      channelCount : 0,
      currentPage : 1,
      dialogOpen: false,
      channelData : []
    };
  }


  async componentWillMount () {
    this.queryCache.page = 1;
    this.enquireScreenRegister();

    let arr = [];
    let selectedValue ={}
    await this.props.getChannels()
    await this.props.getChannels(10,0)
    const currentChannel = this.props.currentChannel
    await this.props.getdashStats(currentChannel)
    this.fetchData(currentChannel);

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
      selectedChannel: selectedValue,
      channelCount : this.props.dashStats.channelCount
    });
   setInterval(() => this.syncData(this.props.currentChannel), 5000);
  }

  async syncData(currentChannel) {
    await Promise.all([
      this.props.getChannels(10,0),
      this.props.getdashStats(currentChannel)
    ])
    this.setState({currentPage : 1})
   
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.channels != undefined) {
      this.setState({channelData : nextProps.channels, isLoading : false, channelCount : nextProps.dashStats.channelCount})
    }
    
  }


  enquireScreenRegister = () => {
    const mediaCondition = 'only screen and (max-width: 720px)';

    enquireScreen((mobile) => {
      this.setState({
        isMobile: mobile,
      });
    }, mediaCondition);
  };

  fetchData = async(currentPage) => {
    await this.props.getChannels(10, currentPage-1)
  };


  changePage = (currentPage) => {
    this.queryCache.page = currentPage;
    this.setState({currentPage : currentPage})
    this.fetchData(currentPage);
  };


  onSearch = (value) => {
    this.queryCache.keywords = value.key;
    this.fetchData();
  };

  handleDialogOpen = async tid => {
    await this.props.getTransaction(this.props.currentChannel, tid);
    this.setState({dialogOpen: true});
  }

   handleDialogClose = () => {
    this.setState({dialogOpen: false});
  };

  handleEye = (row, val) => {
    const data = Object.assign({}, this.state.selection, {[row.index]: !val});
    this.setState({selection: data});
  };
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
      <div>
        <div className="enhance-table" style={styles.enhanceTable}>
          <IceContainer style={styles.card}>
            <div>
              <Tab
                size="small"
                type="text"
                activeKey={this.state.activeKey}
                contentStyle={{ display: 'none' }}
              >
                <Tab.TabPane
                  key="solved"
                  tab={
                    <span>
                      总链数：<span style={styles.tabCount}>{this.state.channelCount}</span>
                    </span>
                  }
                />
              </Tab>
            </div>
            <div style={styles.extraFilter}>
              <Search
                style={styles.search}
                type="primary"
                inputWidth={150}
                placeholder="搜索"
                searchText=""
                onSearch={this.onSearch}
              />
            </div>
          </IceContainer>
          <IceContainer>
            <Table
              dataSource={this.state.channelData}
              isLoading={this.state.isLoading}
              className="basic-table"
              style={styles.basicTable}
              hasBorder={false}
            >
             {columnHeaders}
            </Table>
            <div style={styles.pagination}>
              <Pagination
                current={this.state.currentPage}
                pageSize={this.state.pageSize}
                total={this.state.total}
                onChange={this.changePage}
                type={this.state.isMobile ? 'simple' : 'normal'}
              />
            </div>
          </IceContainer>
        </div>
      </div>
    );
  }
}

const styles = {
  titleWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    marginLeft: '10px',
    lineHeight: '20px',
  },
  enhanceTableOperation: {
    lineHeight: '28px',
  },
  operation: {
    marginRight: '12px',
    textDecoration: 'none',
  },
  card: {
    minHeight: 0,
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  tabCount: {
    color: '#3080FE',
  },
  extraFilter: {
    display: 'flex',
    alignItems: 'center',
  },
  search: {
    marginLeft: 10,
  },
  pagination: {
    textAlign: 'right',
    paddingTop: '26px',
  },
};

export default compose(
  connect(
    state => ({
      currentChannel: currentChannelSelector(state),
      channels : channelsSelector(state),
      dashStats : dashStatsSelector(state)
    }),
    {
      getChannels : channel,
      getdashStats : dashStats,
    }
  )
)(EnhanceTable);