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
  require('./GoBack.less')
}


@connect(({Event}) => ({Event}))
class GoBack extends React.Component {
  constructor (props, context) {
    super(props, context)
  }

  navigationGoBack () {
    this.props.router.goBack()
  }

  render () {
    let returnClassesSet = {
      'btn-xs': true,
      'btn-goback': true,
      'hidden-xs': true,
      'hidden-sm': true
    }

    return (
      <li className="pull-left">
        <button role="button" className={classSet(returnClassesSet)} onClick={::this.navigationGoBack}>
          <i className="zmdi zmdi-chevron-left zmdi-hc-3x"></i><span className="return-btn-label">RETOUR</span>
        </button>
      </li>
    )
  }
}

GoBack.propTypes = {
  history: React.PropTypes.object.isRequired
}


export default withRouter(GoBack)
