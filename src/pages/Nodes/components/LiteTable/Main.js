import React, { Component } from 'react';
import chartsOperations from './state/redux/charts/operations'
import { Provider } from 'react-redux'
import createStore from './state/store'
import { unregister } from './registerServiceWorker'
import LiteTable from './LiteTable';
import tableOperations from './state/redux/tables/operations'
import { IntlProvider, addLocaleData } from 'react-intl';
import cookie from 'react-cookies';

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

class Main extends Component {
 	constructor(props) {
	    super(props);
	    this.state = {
	      lang: 'en-US'
	    };
  	}
  render() {
    
  	const appLocale = getLocale(cookie.load("language"));
    addLocaleData(...appLocale.data);
    return (
    	<IntlProvider
          locale={appLocale.locale}
          messages={appLocale.messages}
          formats={appLocale.formats}
        >
	      	<Provider store={store} >
	          	<LiteTable />
	    	</Provider>
    	</IntlProvider>
    );
  }
}

export default Main