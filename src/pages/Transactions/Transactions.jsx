import React, { Component } from 'react';
import InfiniteScrollCellMeasurer from './components/InfiniteScrollCellMeasurer';

export default class Transactions extends Component {
  static displayName = 'Transactions';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="transactions-page">
        <InfiniteScrollCellMeasurer />
      </div>
    );
  }
}
