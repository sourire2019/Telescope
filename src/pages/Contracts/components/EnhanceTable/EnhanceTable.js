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


const {contractList } = tableOperations;
const {channelsSelector, contractListSelector} = tableSelectors
const {currentChannelSelector, dashStatsSelector} = chartSelectors;
const channel = tableOperations.channels;
const {dashStats} = chartOperations;

export class EnhanceTable extends Component {
  static displayName = 'EnhanceTable';

  constructor(props) {
    super(props);
    this.queryCache = {};
    this.state = {
      contractList : [],
      channels : [],
      selectedChannel: {},
      activeKey: 'solved',
      isLoading : true,
      contractCount : 0,
      currentPage : 1,
      dialogOpen: false
    };
  }


  async componentDidMount () {
    this.queryCache.page = 1;
    this.fetchData();
    this.enquireScreenRegister();

    let arr = [];
    let selectedValue ={}
    await this.props.getChannels()
    const currentChannel = this.props.currentChannel
    await this.props.getcontractList(currentChannel,10,0)
    await this.props.getdashStats(currentChannel)


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
      contractCount : this.props.dashStats.contractCount
    });
   setInterval(() => this.syncData(this.props.currentChannel), 5000);
  }

  async syncData(currentChannel) {
    await Promise.all([
      this.props.getcontractList(currentChannel,10,0),
      this.props.getChannels(),
      this.props.getdashStats(currentChannel)
    ])
    this.setState({currentPage : 1})
   
  }
  componentWillReceiveProps(nextProps) {
    
    if (nextProps.contractList != undefined) {
      this.setState({contractList : nextProps.contractList, isLoading : false, contractCount : nextProps.dashStats.contractCount})
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
    await this.props.getcontractList(this.props.currentChannel,10, currentPage-1)
  };

  renderTitle = (value, index, record) => {
    return (
      <div style={styles.titleWrapper}>
        <span style={styles.title}>{record.title}</span>
      </div>
    );
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
                      总合约数：<span style={styles.tabCount}>{this.state.contractCount}</span>
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
              dataSource={this.state.contractList}
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
      contractList : contractListSelector(state),
      dashStats : dashStatsSelector(state)
    }),
    {
      getcontractList: contractList,
      getChannels : channel,
      getdashStats : dashStats,
    }
  )
)(EnhanceTable);