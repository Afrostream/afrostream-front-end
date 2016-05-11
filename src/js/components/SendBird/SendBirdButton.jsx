import React from 'react'
import { connect } from 'react-redux'
import * as EventActionCreators from '../../actions/event'
import classSet from 'classnames'

if (process.env.BROWSER) {
  require('./SendBirdButton.less')
}

@connect(({Event}) => ({Event}))
class SendBirdButton extends React.Component {

  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.attachTooltip()
  }

  componentWillReceivedProps () {
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
        dispatch, Event
      }
    } = this

    const chatMode = Event.get('showChat')

    dispatch(EventActionCreators.showChat(!chatMode))
  }

  render () {
    const {
      props: {
        Event
      }
    } = this

    const chatMode = Event.get('showChat')

    let chatClass = {
      'fa': true,
      'fa-comments': !chatMode,
      'fa-comments-o': chatMode
    }

    const inputAttributes = {
      onClick: event => ::this.sharePopup()
    }
    return (<button className="btn sendbird_button" type="button" data-toggle="tooltip" ref="data"
                    data-placement="top"
                    title={chatMode ? this.props.tooltipToggle : this.props.tooltip}  {...inputAttributes}>
      <i className={classSet(chatClass)}></i>
      {this.getLabel()}
    </button>)
  }
}

SendBirdButton.propTypes = {
  link: React.PropTypes.string,
  description: React.PropTypes.string,
  title: React.PropTypes.string,
  tooltip: React.PropTypes.string,
  tooltipToggle: React.PropTypes.string,
  label: React.PropTypes.string
}

SendBirdButton.defaultProps = {
  link: null,
  description: null,
  title: null,
  label: '',
  tooltip: 'Ouvrir messenger',
  tooltipToggle: 'Fermer messenger',
}

export default SendBirdButton
