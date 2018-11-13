import React, { Component } from 'react';
import { Grid } from '@icedesign/base';
import {chartOperations, chartSelectors} from "./state/redux/charts/";
import {tableOperations, tableSelectors} from "./state/redux/tables/";
import compose from "recompose/compose";
import {connect} from "react-redux";
import { FormattedMessage } from 'react-intl';

import {
  Row,
  Col
} from 'reactstrap';

const {channelsSelector} = tableSelectors
const {currentChannelSelector, dashStatsSelector} = chartSelectors;
const channel = tableOperations.channels;
const {dashStats} = chartOperations;

export class ProductInfo extends Component {
  static displayName = 'ProductInfo';

  constructor(props) {
    super(props);
    this.state = {
      channels : [],
      dashStats : []
    };
  }
  data = (dashStats) =>{
    const dataSource = [
      {
        title: <FormattedMessage
                id="page.localeProvider.blocks"
                defaultMessage="BLOCKS"
                description="BLOCKS"
                />,
        pic: require('./images/TB1i7OMif6H8KJjSspmXXb2WXXa-210-210.png'),
        desc: dashStats.latestBlock,
      },
      {
        title: <FormattedMessage
              id="page.localeProvider.transactions"
              defaultMessage="TRANSACTIONS"
              description="TRANSACTIONS"
              />,
        pic: require('./images/TB1EfLYfOqAXuNjy1XdXXaYcVXa-207-210.png'),
        desc: dashStats.txCount,
      },
      {
        title: <FormattedMessage
                      id="page.localeProvider.nodes"
                      defaultMessage="NODES"
                      description="NODES"
                      />,
        pic: require('./images/TB1laelicjI8KJjSsppXXXbyVXa-210-210.png'),
        desc: dashStats.nodeCount,
      },
      {
        title: <FormattedMessage
                id="page.localeProvider.contracts"
                defaultMessage="CONTRACTS"
                description="CONTRACTS"
                />,
        pic: require('./images/TB1a31mignH8KJjSspcXXb3QFXa-210-210.png'),
        desc: dashStats.contractCount,
      }
    ];
    return dataSource
  }

  async componentWillMount () {

    let arr = [];
    let selectedValue ={}
    await this.props.getChannels()
    await this.props.getChannels(10,0)
    const currentChannel = this.props.currentChannel
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
      channelCount : this.props.dashStats.channelCount
    });
   setInterval(() => this.syncData(this.props.currentChannel), 5000);
  }

  async syncData(currentChannel) {
    await Promise.all([
      this.props.getChannels(10,0),
      this.props.getdashStats(currentChannel)
    ])
   
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.channels != undefined) {
      this.setState({channels : nextProps.channels, dashStats : nextProps.dashStats})
    }
    
  }
  render() {
    return (
      <div className="product-info" style={styles.container}>
        <Row wrap style = {{width : '100%'}}>
          {this.data(this.state.dashStats).map((item, index) => {
            return (
              <Col sm= "3" key={index} style={styles.item}>
                <img src={item.pic} style={styles.pic} alt="" />
                <h3 style={styles.title}>{item.title}</h3>
                <p style={styles.desc}>{item.desc}</p>
              </Col>
            );
          })}
        </Row>
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: '1080px',
    margin: '0 auto',
    padding: '80px 0',
  },
  item: {
    textAlign: 'center',
    padding: '10px 22px',
    marginBottom: '20px',
  },
  pic: {
    width: 100,
    height: 100,
  },
  title: {
    fontWeight: 'bold',
  },
  desc: {
    lineHeight: '22px',
    color: '#999',
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
)(ProductInfo);