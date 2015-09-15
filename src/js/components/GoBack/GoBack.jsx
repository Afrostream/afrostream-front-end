'use strict';
import React ,{PropTypes } from 'react';
import { connect } from 'react-redux';
import classSet from 'classnames';
/**
 * GoBack component
 * Simple history back button
 *
 * How to use in JSX:
 * <GoBack className="btn" ><span>return</span></GoBack>
 *
 * @props className {String} Class name of img dom element
 *
 * @require react-router
 */
if (process.env.BROWSER) {
  require('./GoBack.less');
}


@connect(({ Event }) => ({Event})) class GoBack extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  navigationGoBack(event) {
    event.preventDefault();

    let router = this.context.router;
    if (!router.goBack()) {
      router.transitionTo('home');
    }
  }

  render() {

    const {
      props: {
        Event
        }
      } = this;

    let returnClassesSet = {
      'return-btn': true,
      'btn': true,
      'btn-xs': true
    };

    return (
      <a href="#" className={classSet(returnClassesSet)} onClick={::this.navigationGoBack}>
        <span className="fa fa-caret-left"></span><span className="return-btn-label">RETOUR</span>
      </a>
    );
  }
}

export default GoBack;
