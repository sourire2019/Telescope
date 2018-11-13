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

import TransactionView from './TransactionView'

import Dialog from "material-ui/Dialog";


const {transactionList , transaction } = tableOperations;
const {channelsSelector, transactionListSelector, transactionSelector} = tableSelectors
const {currentChannelSelector, dashStatsSelector} = chartSelectors;
const channel = tableOperations.channels;
const {dashStats} = chartOperations;



export class EnhanceTable extends Component {
  static displayName = 'EnhanceTable';

  constructor(props) {
    super(props);
    this.queryCache = {};
    this.state = {
      transactionList : [],
      channels : [],
      selectedChannel: {},
      activeKey: 'solved',
      isLoading : true,
      txCount : 0,
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
    await this.props.getTransactionList(currentChannel,10,0)
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
      txCount : this.props.dashStats.txCount
    });
   setInterval(() => this.syncData(this.props.currentChannel), 5000);
  }

  async syncData(currentChannel) {
    await Promise.all([
      this.props.getTransactionList(currentChannel,10,0),
      this.props.getChannels(),
      this.props.getdashStats(currentChannel)
    ])
    this.setState({currentPage : 1})
   
  }
  componentWillReceiveProps(nextProps) {
    
    if (nextProps.transactionList != undefined) {
      this.setState({transactionList : nextProps.transactionList.rows, isLoading : false, txCount : nextProps.dashStats.txCount})
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
    await this.props.getTransactionList(this.props.currentChannel,10, currentPage-1)
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
    for (let i = 0; i < config.transactions.length; i++) {
      switch (config.transactions[i]) {
        case 'creator' : columnHeaders.push(
          <Table.Column key = {config.transactions[i]} title={
            <FormattedMessage
              id='page.localeProvider.creator'
              defaultMessage='Creator'
              description='Creator'
            />
            }
            dataIndex="creator_msp_id" width={100} />
        ); break
        case 'chainname' : columnHeaders.push(
          <Table.Column key = {config.transactions[i]} title={
            <FormattedMessage
              id='page.localeProvider.chainname'
              defaultMessage='Chain Name'
              description='Chain Name'
            />
            }
            dataIndex="channelname" width={110} />
        );break
        case 'txid' : columnHeaders.push(
          <Table.Column key = {config.transactions[i]} title={
              <FormattedMessage
              id='page.localeProvider.txid'
              defaultMessage='Tx Id'
              description='Tx Id'
            />}
              dataIndex="txhash"
              cell= { row =>(
                  <span>
                <a
                  className="partialHash"
                  onClick={() => this.handleDialogOpen(row)}
                  href="#/transactions"
                >
                  {row.slice(0, 16)}
                  {!row ? "" : "... "}
                </a>
              </span>
                )}
              width={100} />
        );break
        case 'type' : columnHeaders.push(
            <Table.Column key = {config.transactions[i]} title={<FormattedMessage
              id='page.localeProvider.type'
              defaultMessage='Type'
              description='Type'
            />}
              dataIndex="type"
              width={60} />
        );break

        case 'contract' : columnHeaders.push(
          <Table.Column key = {config.transactions[i]} title={<FormattedMessage
            id='page.localeProvider.contract'
            defaultMessage='Contract'
            description='Contract'
          />}
            dataIndex="contractname"
            cell= { row =>(
                  <span>
                  {row.slice(0, 16)}
                  {!row ? "" : "... "}
              </span>
                )}
            width={100} />
        );break
          
        case 'timestamp' : columnHeaders.push(
          <Table.Column key = {config.transactions[i]} title={<FormattedMessage
            id='page.localeProvider.timestamp'
            defaultMessage='Timestamp'
            description='Timestamp'
          />}
            dataIndex="createdt"
            width={200} />
        );break

        case 'txhash' : columnHeaders.push(
          <Table.Column key = {config.transactions[i]} title={<FormattedMessage
            id='page.localeProvider.txhash'
            defaultMessage='Txhash'
            description='Txhash'
          />}
            dataIndex="txhash"
            cell= { row =>(
                  <span>
                  {row.slice(0, 16)}
                  {!row ? "" : "... "}
              </span>
                )}
            width={100} />
        );break

        case 'from' : columnHeaders.push(
          <Table.Column key = {config.transactions[i]} title={<FormattedMessage
            id='page.localeProvider.from'
            defaultMessage='from'
            description='from'
          />}
            dataIndex="from"
            cell= { row =>(
              <span>
                {row.slice(0, 16)}
                {!row ? "" : "... "}
              </span>
                )}
            width={100} />
        );break

        case 'block' : columnHeaders.push(
          <Table.Column key = {config.transactions[i]} title={<FormattedMessage
            id='page.localeProvider.blockid'
            defaultMessage='blockid'
            description='blockid'
          />}
            dataIndex="blockid"
            width={70} />
        );break 

        case 'blocktime' : columnHeaders.push(
          <Table.Column key = {config.transactions[i]} title={<FormattedMessage
            id='page.localeProvider.blocktime'
            defaultMessage='blocktime'
            description='blocktime'
          />}
            dataIndex="blocktime"
            width={100} />
        );break

        case 'to' : columnHeaders.push(
          <Table.Column key = {config.transactions[i]} title={<FormattedMessage
            id='page.localeProvider.to'
            defaultMessage='to'
            description='to'
          />}
            dataIndex="to"
            cell= { row =>(
              <span>
                {row.slice(0, 16)}
                {!row ? "" : "... "}
               
              </span>
                )}
            width={100} />
        );break

        case 'status' : columnHeaders.push(
          <Table.Column key = {config.transactions[i]} title={<FormattedMessage
            id='page.localeProvider.status'
            defaultMessage='status'
            description='status'
          />}
            dataIndex="status"
            width={100} />
        );break






        default : break
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
                      总交易数：<span style={styles.tabCount}>{this.state.txCount}</span>
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
              dataSource={this.state.transactionList}
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
          <Dialog
          open={this.state.dialogOpen}
          onClose={this.handleDialogClose}
          fullWidth={true}
          maxWidth={"md"}
          style = {{padding : '0'}}
          >
            <TransactionView
              transaction={this.props.transaction}
              onClose={this.handleDialogClose}
            />
          </Dialog>
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
      transactionList : transactionListSelector(state),
      dashStats : dashStatsSelector(state),
      transaction: transactionSelector(state)
    }),
    {
      getTransactionList: transactionList,
      getChannels : channel,
      getdashStats : dashStats,
      getTransaction : transaction
    }
  )
)(EnhanceTable);