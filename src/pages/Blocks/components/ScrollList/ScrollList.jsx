import React, { Component } from 'react';
import { Loading } from '@icedesign/base';
import dataSource from './list-data';
import ReactList from 'react-list';
import IceContainer from '@icedesign/container';
import avatar from './images/TB1L6tBXQyWBuNjy0FpXXassXXa-80-80.png';

import compose from "recompose/compose";
import {connect} from "react-redux";
import {chartOperations, chartSelectors} from "./state/redux/charts/";
import {tableOperations, tableSelectors} from "./state/redux/tables/";

const {blockList, transaction } = tableOperations;
const {channelsSelector, blockListSelector,   transactionSelector} = tableSelectors
const {currentChannelSelector} = chartSelectors;
const channel = tableOperations.channels;

export  class ScrollList extends Component {
  static displayName = 'ScrollList';

  static defaultProps = {
    height: '300px',
  };

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      total: 20,
      isLoading: false,
      pageSize: 20,
      pageNo: 0,
      blockList : [],
      channels : [],
      selectedChannel: {}
    };
  }

  fetchDataMethod = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(dataSource);
      }, 500);
    });
  };

  fetchData = () => {
    this.setState({
      isLoading: true,
    });
    this.fetchDataMethod().then((res) => {
      if (res.status === 'SUCCESS') {
        this.setState((prevState) => {
          return {
            list: [...prevState.list, ...res.data.list],
            total: res.data.total,
            pageNo: prevState.pageNo + 1,
            isLoading: false,
          };
        });
      }
    });
  };

  renderItem = (index, key) => {
    return this.state.list[index] ? (
      <div key={key} style={styles.listItem}>
        <img src={avatar} style={styles.avatar} />
        <div style={styles.info}>
          <div style={styles.infoItem}>{this.state.list[index].name}</div>
          <div>This is the {index + 1} row</div>
        </div>
      </div>
    ) : (
      ''
    );
  };

  handleScroll = () => {
    const lastVisibleIndex = this.refs.list.getVisibleRange()[1];
    // 提前 5条 预加载
    if (
      lastVisibleIndex >= this.state.pageNo * this.state.pageSize - 5 &&
      !this.state.isLoading
    ) {
      this.fetchData();
    }
  };

  async componentDidMount() {
    this.fetchData();
    let arr = [];
    let selectedValue ={}
    await this.props.getChannels()
    const currentChannel = this.props.currentChannel
    await this.props.getblockList(currentChannel)
    await this.props.getTransaction(currentChannel) 

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
      this.props.getblockList(currentChannel),
      this.props.getChannels(),
    ])
   
  }
  componentWillReceiveProps(nextProps) {
    this.setState({blockList : nextProps.blockList})
  }
  render() {
    console.log(this.props)
    return (
      <Loading
        shape="fusion-reactor"
        color="#66AAFF"
        style={{ display: 'block' }}
        visible={this.state.isLoading}
      >
        <IceContainer
          style={{ height: this.props.height, overflow: 'auto' }}
          onScroll={this.handleScroll}
        >
          <ReactList
            ref="list"
            itemRenderer={this.renderItem}
            length={this.state.total}
            pageSize={this.state.pageSize}
          />
        </IceContainer>
      </Loading>
    );
  }
}

const styles = {
  listItem: {
    padding: 10,
    background: '#fff',
    borderBottom: '1px solid #ddd',
  },
  avatar: {
    width: 50,
    height: 50,
    verticalAlign: 'middle',
  },
  info: {
    display: 'inline-block',
    verticalAlign: 'middle',
    marginLeft: 20,
  },
  infoItem: {
    marginBottom: '4px',
  },
};

export default compose(
  connect(
    state => ({
      currentChannel: currentChannelSelector(state),
      channels : channelsSelector(state),
      blockList : blockListSelector(state),
      transaction: transactionSelector(state),
    }),
    {
      getblockList: blockList,
      getChannels : channel,
      getTransaction: transaction
    }
  )
)(ScrollList);