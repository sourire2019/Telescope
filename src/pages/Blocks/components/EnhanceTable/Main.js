import EnhanceTable from './EnhanceTable';
import React, { Component } from 'react';
import chartsOperations from './state/redux/charts/operations'
import { Provider } from 'react-redux'
import createStore from './state/store'
import { unregister } from './registerServiceWorker'
import tableOperations from './state/redux/tables/operations'
import { IntlProvider, addLocaleData } from 'react-intl';
import cookie from 'react-cookies';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { createMuiTheme } from "@material-ui/core/styles";

import indigo from "@material-ui/core/colors/indigo";
import lightBlue from "@material-ui/core/colors/lightBlue";
import red from "@material-ui/core/colors/red";

const store = createStore()
store.dispatch(chartsOperations.channel())
store.dispatch(chartsOperations.channelList())
store.dispatch(tableOperations.channels())
unregister()

function getLocale(lang) {
  let result = {};
  switch (lang) {
    case 'zh-CN':
      result = require('./locales/zh-Hans');
      break;
    case 'en-US':
      result = require('./locales/en-US');
      break;
    default:
      result = require('./locales/en-US');
  }

  return result.default || result;
}

const muiTheme = createMuiTheme({
  palette: {
    contrastThreshold: 3,
    tonalOffset: 0.2,
    primary: indigo,
    secondary: lightBlue,
    error: {
      main: red[500]
    },
    toggleClass: true
  }
});

class Main extends Component {
 	constructor(props) {
	    super(props);
	    this.state = {
	      lang: 'en-US'
	    };
  	}
  render() {
  	const { lang } = this.state;

    const appLocale = getLocale(cookie.load("language"));
    addLocaleData(...appLocale.data);
    return (
      <MuiThemeProvider theme = {muiTheme}>
      	<IntlProvider
            locale={appLocale.locale}
            messages={appLocale.messages}
            formats={appLocale.formats}
          >
  	      	<Provider store={store} >
  	          	<EnhanceTable />
  	    	</Provider>
      	</IntlProvider>
      </MuiThemeProvider>
    );
  }
}

export default Main