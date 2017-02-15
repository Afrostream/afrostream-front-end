import React, { PropTypes } from 'react'
import { I18n } from '../Utils'

if (process.env.BROWSER) {
  require('./Snackbar.less')
}

class Snackbar extends I18n {

  constructor (props) {
    super(props)
    this.state = {show: false}
  }

  hideSnackbar () {
    this.setState({show: false})

    this.props.onRequestClose()
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.show === null || this.state.show != nextProps.show
      && this.props.message === nextProps.children
      && this.props.delay === nextProps.delay) {
      this.setState({
        show: nextProps.show
      })
      setTimeout(() => {
        this.hideSnackbar()
      }, nextProps.delay ? nextProps.delay : 3000)
    }
  }

  render () {
    return (
      <div className="main">
        <div onClick={this.hideSnackbar.bind(this)} className="react-snackbar-container">
          {this.state.show ?
            <div className="react-snackbar">
              {this.getTitle(this.props.message)}
            </div>
            : null }
        </div>
      </div>
    )
  }
}

Snackbar.propTypes = {
  show: React.PropTypes.bool,
  delay: React.PropTypes.number,
  onRequestClose: React.PropTypes.func,
}
Snackbar.defaultProps = {
  show: false,
  delay: 4000,
  onRequestClose: () => {
  }
}

export default Snackbar
