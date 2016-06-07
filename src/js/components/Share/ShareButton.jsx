import React from 'react'
import { connect } from 'react-redux'
import * as ModalActionCreators from '../../actions/modal'
import classSet from 'classnames'

if (process.env.BROWSER) {
  require('./ShareButton.less')
}

@connect(({Modal}) => ({Modal}))
class ShareButton extends React.Component {

  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.attachTooltip()
  }

  componentDidUpdate () {
    this.attachTooltip()
  }

  attachTooltip () {
    $(this.refs.data).tooltip()
  }

  getLabel () {
    if (!this.props.label) {
      return
    }
    return this.props.label
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

    let favoriteClass = {
      'fa': true,
      'fa-share': true
    }

    const inputAttributes = {
      onClick: event => ::this.sharePopup()
    }
    return (<button className="btn share_button" type="button" data-toggle="tooltip" ref="data"
                    data-placement="top"
                    title={this.props.tooltip}  {...inputAttributes}>
      <i className={classSet(favoriteClass)}></i>
      {this.getLabel()}
    </button>)
  }
}

ShareButton.propTypes = {
  link: React.PropTypes.string,
  description: React.PropTypes.string,
  title: React.PropTypes.string,
  tooltip: React.PropTypes.string,
  label: React.PropTypes.string
}

ShareButton.defaultProps = {
  link: null,
  description: null,
  title: null,
  label: '',
  tooltip: 'Recommander'
}

export default ShareButton
