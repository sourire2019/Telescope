import React, { Component } from 'react';
import ScrollList from './components/ScrollList';

export default class Blocks extends Component {
  static displayName = 'Blocks';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="blocks-page">
        <ScrollList />
      </div>
    );
  }
}
