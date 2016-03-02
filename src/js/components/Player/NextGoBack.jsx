'use strict';
import React from 'react';
import ReactDOM from'react-dom';
import classSet from 'classnames';
import {dict} from '../../../../config';
const dictNext = dict.next;

if (process.env.BROWSER) {
  require('./NextGoBack.less');
}


class NextGoBack extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  goBackHandler() {
    let component = ReactDOM.findDOMNode(this);
    if (component) {
      component.dispatchEvent(new CustomEvent('gobacknext', {bubbles: true}));
    }
  }

  render() {
    let returnClassesSet = {
      'btn': true,
      'btn-next__goback': true
    };

    return (
      <button className="btn btn-end__video" onClick={::this.goBackHandler}>{dictNext.goBackBtn}</button>
    );
  }
}

export default NextGoBack;
