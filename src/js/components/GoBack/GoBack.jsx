import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import classSet from 'classnames'
import { withRouter } from 'react-router'
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


@connect(({Event}) => ({Event}))
class GoBack extends React.Component {
  constructor (props, context) {
    super(props, context);
  }

  navigationGoBack () {
    this.props.router.goBack()
  }

  render () {
    let returnClassesSet = {
      'return-btn': true,
      'btn': true,
      'btn-xs': true,
      'hidden-xs': true,
      'hidden-sm': true
    };

    return (
      <button className={classSet(returnClassesSet)} onClick={::this.navigationGoBack}>
        <span className="fa fa-caret-left"></span><span className="return-btn-label">RETOUR</span>
      </button>
    );
  }
}

GoBack.propTypes = {
  history: React.PropTypes.object.isRequired
};


export default withRouter(GoBack)
