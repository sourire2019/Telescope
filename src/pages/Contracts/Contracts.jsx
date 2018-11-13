import React, { Component } from 'react';
import EnhanceTable from './components/EnhanceTable';

export default class Contracts extends Component {
  static displayName = 'Contracts';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="contracts-page">
        <EnhanceTable />
      </div>
    );
  }
}
