import React, { Component } from 'react';
import EnhanceTable from './components/EnhanceTable';

export default class Chains extends Component {
  static displayName = 'Chains';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="chains-page">
        <EnhanceTable />
      </div>
    );
  }
}
