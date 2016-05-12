import React from 'react'
import { connect } from 'react-redux'
import * as EventActionCreators from '../../actions/event'
import classSet from 'classnames'

if (process.env.BROWSER) {
  require('./SendBirdButton.less')
}

@connect(({Event}) => ({Event}))
class SendBirdButton extends React.Component {

  componentDidMount () {
    this.attachTooltip()
  }

  componentWillReceiveProps () {
    this.attachTooltip()
  }

  attachTooltip () {
    $(this.refs.data).tooltip()
  }

  getLabel () {
    if (!this.props.label) {
      return
    }
    return <span>{this.props.label}</span>
  }

  action () {
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
      'zmdi': true
    }

    chatClass[this.props.tipClass] = true
    if (this.props.tipClassToggle && this.props.tipClassToggle !== this.props.tipClass) {
      chatClass[this.props.tipClass] = !chatMode
      chatClass[this.props.tipClassToggle] = chatMode
    }

    const inputAttributes = {
      onClick: event => ::this.action()
    }
    return (<button className="btn sendbird_button" type="button" data-toggle="tooltip" ref="data"
                    data-placement="top"
                    data-position={this.props.sendBirdPosition}
                    data-intro={this.props.sendBirdIntro}
                    title={chatMode ? this.props.tooltipToggle : this.props.tooltip}  {...inputAttributes}>
      <i className={classSet(chatClass)}></i>
      {this.getLabel()}
    </button>)
  }
}

SendBirdButton.propTypes = {
  tipClass: React.PropTypes.string,
  tipClassToggle: React.PropTypes.string,
  tooltip: React.PropTypes.string,
  tooltipToggle: React.PropTypes.string,
  sendBirdPosition: React.PropTypes.string,
  sendBirdIntro: React.PropTypes.string,
  label: React.PropTypes.string
}

SendBirdButton.defaultProps = {
  label: '',
  tipClass: 'zmdi-comment-text',
  tipClassToggle: 'zmdi-comment-text',
  tooltip: 'Ouvrir le chat',
  sendBirdPosition: 'left',
  sendBirdIntro: null,
  tooltipToggle: 'Fermer le chat'
}

export default SendBirdButton
