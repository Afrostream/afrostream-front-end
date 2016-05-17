import React from 'react';
import ReactDOM from'react-dom';
import { dict } from '../../../../config';

if (process.env.BROWSER) {
  require('./NextGoBack.less');
}


class NextGoBack extends React.Component {
  constructor (props, context) {
    super(props, context);
  }

  goBackHandler () {
    let component = ReactDOM.findDOMNode(this);
    if (component) {
      component.dispatchEvent(new CustomEvent('gobacknext', {bubbles: true}));
    }
  }

  render () {
    return (
      <button className="btn btn-end__video" onClick={::this.goBackHandler}>{dict().next.goBackBtn}</button>
    );
  }
}

export default NextGoBack;
