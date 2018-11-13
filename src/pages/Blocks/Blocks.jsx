import React, { Component } from 'react';
import EnhanceTable from './components/EnhanceTable';

export default class Blocks extends Component {
  static displayName = 'Blocks';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="blocks-page">
        <EnhanceTable />
      </div>
    );
  }
}
