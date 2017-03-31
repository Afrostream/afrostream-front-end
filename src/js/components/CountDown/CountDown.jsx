import React from 'react'
import moment from 'moment'
import { I18n } from '../Utils'
import {
  injectIntl,
} from 'react-intl'

if (process.env.BROWSER) {
  require('./CountDown.less')
}

class CountDown extends I18n {
  constructor (props) {
    super(props)
    this.ticker = null
    this.state = {
      duration: this._getTimeDifferenceAsDuration()
    }
  }

  componentDidMount () {
    this.ticker = setInterval(() => {
      const duration = ::this._getTimeDifferenceAsDuration()
      if (duration.asSeconds() <= 0) {
        this.setState({eventAvailableText: this.props.eventAvailableText})
        clearInterval(this.ticker)
        this.ticker = null
        return
      }
      this.setState({
        duration,
      })
    }, this.props.interval)
  }

  componentWillUnmount () {
    clearInterval(this.ticker)
    this.ticker = null
  }

  _getTimeDifferenceAsDuration () {
    const {eventTime} = this.props
    const end = new Date(eventTime).getTime()
    const present = new Date().getTime()
    const difference = (end - present) > 0 ? end - present : 0
    return moment.duration(difference, 'milliseconds')
  }

  _formatTime (time, debug) {
    const timeString = '' + time
    if (timeString.length === 1) {
      return '0' + timeString
    }
    return timeString
  }

  _getTimeData (duration) {
    return {
      days: this._formatTime(duration.days()),
      hours: this._formatTime(duration.hours()),
      minutes: this._formatTime(duration.minutes()),
      seconds: this._formatTime(duration.seconds())
    }
  }

  _renderCountDown ({days, hours, minutes, seconds}, children) {
    return (
      <div className="countdown-wrapper">
        {this.props.contentPosition === 'top' && <div className="countdown-content">
          {this.props.infos && <div className="countdown-infos">{this.props.infos}</div>}
          {children}
        </div>}
        <div className="countdown-timer">
          <div className="countdown-number-row">
            <span className="countdown-text-unit countdown-prez">{this.getTitle(this.props.beforeText)}</span>
            <span>{days} <span className="countdown-text-unit">{this.getTitle('countdown.days')}</span></span>
            <span>{hours} <span className="countdown-text-unit">{this.getTitle('countdown.hours')}</span></span>
            <span>{minutes} <span className="countdown-text-unit">{this.getTitle('countdown.minutes')}</span></span>
            <span>{seconds} <span className="countdown-text-unit">{this.getTitle('countdown.seconds')}</span></span>
            <span className="countdown-text-unit countdown-prez">{this.getTitle(this.props.afterText)}</span>
          </div>
          {this.state.eventAvailableText && <div className="event-available-text">
            {this.state.eventAvailableText}
          </div>}
        </div>
        {this.props.contentPosition === 'bottom' && <div className="countdown-content">
          {children}
          {this.props.infos && <div className="countdown-infos">{this.props.infos}</div>}
        </div>}
      </div>
    )
  }

  render () {
    return ::this._renderCountDown(::this._getTimeData(this.state.duration), this.props.children)
  }
}

CountDown.propTypes = {
  // Interval between ticks in ms, defaults to 1000
  interval: React.PropTypes.number,
  // Position of the children content, at the 'top' of the countdown or at the 'bottom', defaults to 'bottom'
  contentPosition: React.PropTypes.oneOf(['top', 'bottom']),
  // Date and hour of the incoming event, formatted for Date.parse() : "YYYY-MM-DD HH:MM [GMT]"
  eventTime: React.PropTypes.string.isRequired,
  // Supplementary optional text displayed in the countdown when it attains 0
  eventAvailableText: React.PropTypes.string,
  infos: React.PropTypes.string
}

CountDown.defaultProps = {
  interval: 1000,
  contentPosition: 'bottom',
  beforeText: 'countdown.beforeText',
  infos: null,
  afterText: 'countdown.afterText'
}

export default injectIntl(CountDown)
