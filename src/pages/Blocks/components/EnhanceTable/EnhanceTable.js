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

import Transaction from './Transaction'
import BlockView from './BlockView'
import Dialog from "material-ui/Dialog";


const {blockList, transaction } = tableOperations;
const {channelsSelector, blockListSelector,   transactionSelector} = tableSelectors
const {currentChannelSelector, dashStatsSelector} = chartSelectors;
const channel = tableOperations.channels;
const {dashStats} = chartOperations;


export class EnhanceTable extends Component {
  static displayName = 'EnhanceTable';

  constructor(props) {
    super(props);
    this.queryCache = {};
    this.state = {
      blockList : [],
      channels : [],
      selectedChannel: {},
      activeKey: 'solved',
      latestBlock : 0,
      currentPage : 1,
      dialogOpen: false,
      loading: false,
      dialogOpenBlockHash: false,
      transactions : []
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
    await this.props.getblockList(currentChannel, 10, 0)
    await this.props.getTransaction(currentChannel) 
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
      latestBlock : this.props.dashStats.latestBlock
    });
   setInterval(() => this.syncData(this.props.currentChannel), 5000);
  }

  async syncData(currentChannel) {
    await Promise.all([
      this.props.getblockList(currentChannel,10,0),
      this.props.getChannels(),
      this.props.getdashStats(currentChannel)
    ])
    this.setState({currentPage : 1})
   
  }
  componentWillReceiveProps(nextProps) {
    
    if (nextProps.blockList != undefined) {
      this.setState({blockList : nextProps.blockList, isLoading : false, latestBlock : nextProps.dashStats.latestBlock})
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
    await this.props.getblockList(this.props.currentChannel,10, currentPage-1)
  };

  renderTitle = (value, index, record) => {
    return (
      <div style={styles.titleWrapper}>
        <span style={styles.title}>{record.title}</span>
      </div>
    );
  };

  handleDialogCloseBlockHash = () => {
    this.setState({dialogOpenBlockHash: false});
  }
  
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

  handleDialogOpenTransactions = transactions =>{
    const data = [];
    transactions.forEach(element => {
      data.push({
        txhash: element
      })
    })
    this.setState({dialogOpen: true , transactions: data});
  }
  handleDialogOpenBlockHash = blockHash => {
    const data = this.props.blockList.find(item => {
      return item.blockhash === blockHash;
    });

    this.setState({
      dialogOpenBlockHash: true,
      blockHash: data
    });
  }
  render() {
    const columnHeaders = []
    for (let i = 0; i < config.blocks.length; i++) {
      switch (config.blocks[i]) {
        case 'blocknumber' : columnHeaders.push(
          <Table.Column key = {config.blocks[i]} title={
            <FormattedMessage
              id='page.localeProvider.blocknum'
              defaultMessage='blocknum'
              description='blocknum'
            />
            }
            dataIndex="blocknum" width={100} />
        ); break
        case 'chainname' : columnHeaders.push(
          <Table.Column key = {config.blocks[i]} title={
            <FormattedMessage
              id='page.localeProvider.chainname'
              defaultMessage='Chain Name'
              description='Chain Name'
            />
            }
            dataIndex="channelname" width={110} />
        );break
        case 'number_of_tx' : columnHeaders.push(
          <Table.Column key = {config.blocks[i]} title={
              <FormattedMessage
              id='page.localeProvider.num'
              defaultMessage='Number of Tx'
              description='Number of Tx'
            />}
              dataIndex="txcount"
              width={100} />
        );break
        case 'datahash' : columnHeaders.push(
            <Table.Column key = {config.blocks[i]} title={<FormattedMessage
              id='page.localeProvider.datah'
              defaultMessage='datahash'
              description='datahash'
            />}
              dataIndex="datahash"
              width={60} />
        );break

        case 'blockhash' : columnHeaders.push(
          <Table.Column key = {config.blocks[i]} title={<FormattedMessage
            id='page.localeProvider.blockhash'
            defaultMessage='blockhash'
            description='blockhash'
          />}
            dataIndex="blockhash"
            cell= { row =>(
              <span>
                <a
                  className="partialHash"
                  onClick={() => this.handleDialogOpenBlockHash(row)}
                  href="#/blocks"
                >
                  <div className="fullHash" id="showTransactionId">
                    {row}
                  </div>{" "}
                  {row.slice(0, 8)}
                  {!row ? "" : "... "}
                </a>
              </span>
                )}
            width={100} />
        );break
          
        case 'prehash' : columnHeaders.push(
          <Table.Column key = {config.blocks[i]} title={<FormattedMessage
            id='page.localeProvider.prehash'
            defaultMessage='prehash'
            description='prehash'
          />}
            dataIndex="prehash"
            width={200} />
        );break

        case 'transactions' : columnHeaders.push(
          <Table.Column key = {config.blocks[i]} title={<FormattedMessage
            id='page.localeProvider.transactions'
            defaultMessage='transactions'
            description='transactions'
          />}
            dataIndex="txhash"
            cell= { row =>(
              <span>
                <button
                  className="partialHash"
                  onClick={() => this.handleDialogOpenTransactions(row)}
                  disabled= {row ? "" : "disabled"}
                  href="#/blocks"
                >
                  <div className="fullHash" id="showTransactionId">
                    <FormattedMessage
                    id="page.localeProvider.details"
                    defaultMessage="Details"
                    description="Details"
                    />
                  </div>{" "}
                    <FormattedMessage
                    id="page.localeProvider.details"
                    defaultMessage="Details"
                    description="Details"
                    />
                </button>{" "}
              </span>
            )}
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
                      总块数：<span style={styles.tabCount}>{this.state.latestBlock}</span>
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
              dataSource={this.state.blockList}
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
        >
          <Transaction
            transaction={this.state.transactions}
            onClose={this.handleDialogClose}
            transactions = {this.props.transaction}
            getTransaction = {this.props.getTransaction}
          />
        </Dialog>

        <Dialog
          open={this.state.dialogOpenBlockHash}
          onClose={this.handleDialogCloseBlockHash}
          fullWidth={true}
          maxWidth={"md"}
        >
          <BlockView
            blockHash={this.state.blockHash}
            onClose={this.handleDialogCloseBlockHash}
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
      blockList : blockListSelector(state),
      dashStats : dashStatsSelector(state),
      transaction: transactionSelector(state)
    }),
    {
      getblockList: blockList,
      getChannels : channel,
      getdashStats : dashStats,
      getTransaction : transaction
    }
  )
)(EnhanceTable);