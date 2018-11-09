import React, { Component } from 'react';
import LiteTable from './components/LiteTable';

export default class Chains extends Component {
  static displayName = 'Chains';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="chains-page">
        <LiteTable />
      </div>
    );
  }
}
