import React, { Component } from 'react';
import MemberList from './components/MemberList';

export default class Contracts extends Component {
  static displayName = 'Contracts';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="contracts-page">
        <MemberList />
      </div>
    );
  }
}
