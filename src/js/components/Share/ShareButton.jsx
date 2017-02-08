import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import * as ModalActionCreators from '../../actions/modal'
import classSet from 'classnames'
import RaisedButton from 'material-ui/RaisedButton'
import { I18n } from '../Utils'
import ReactTooltip from 'react-tooltip'
import {
  intlShape,
  injectIntl
} from 'react-intl'

if (process.env.BROWSER) {
  require('./ShareButton.less')
}

@connect(({Modal}) => ({Modal}))
class ShareButton extends I18n {

  constructor (props) {
    super(props)
  }


  componentDidUpdate () {
    ReactTooltip.rebuild()
  }


  getLabel () {
    return <span className="btn-label">{this.getTitle(this.props.tooltip)}</span>
  }

  sharePopup () {
    const {
      props: {
        dispatch, link, description, title
      }
    } = this

    dispatch(ModalActionCreators.open({target: 'strategy', data: {link, description, title}}))
  }

  render () {

    const {
      props: {
        showLabel
      }
    } = this

    let favoriteClass = {
      'zmdi': true,
      'zmdi-share': true
    }

    const inputAttributes = {
      onClick: event => ::this.sharePopup()
    }
    return (
      <button className="btn share_button" type="button"
              data-tip={this.getTitle(this.props.tooltip)}
              {...inputAttributes}>
        <i className={classSet(favoriteClass)}></i>
        {showLabel && this.getLabel()}
        <ReactTooltip className="fav-tooltip" place={this.props.direction} type="dark" effect="solid"/>
      </button>
    )
  }
}

ShareButton.propTypes = {
  link: React.PropTypes.string,
  showLabel: PropTypes.bool,
  description: React.PropTypes.string,
  title: React.PropTypes.string,
  tooltip: React.PropTypes.string,
  label: React.PropTypes.string
}

ShareButton.defaultProps = {
  link: null,
  showLabel: true,
  description: null,
  title: null,
  tooltip: 'share.tooltip',
  direction: 'top'
}

export default injectIntl(ShareButton)
