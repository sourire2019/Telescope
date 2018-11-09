import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import JstaLogo from './jsta.png';

export default class Logo extends PureComponent {
  render() {
    return (
      <div className="logo" style={{}}>
        <Link to="/" className="logo-text">
          <img src = {JstaLogo} className = 'logo' alt = "logo" />
        </Link>
      </div>
    );
  }
}
