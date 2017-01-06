import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import * as ModalActionCreators from '../../actions/modal'
import { I18n } from '../Utils'
import ReactTooltip from 'react-tooltip'
import {
  injectIntl
} from 'react-intl'

if (process.env.BROWSER) {
  require('./LifeSticky.less')
}
@connect(({Life, User}) => ({Life, User}))
class LifeSticky extends I18n {

  constructor (props, context) {
    super(props, context)
  }

  componentDidMount () {
    this.attachTooltip()
  }

  componentDidUpdate () {
    this.attachTooltip()
  }

  attachTooltip () {
    ReactTooltip.rebuild()
  }

  stickyAdd () {
    const {
      props: {
        dispatch
      }
    } = this
    const {stickyBtn, stickyWrapper} =this.refs
    stickyBtn.classList.add('rippling')
    stickyWrapper.classList.add('clicked')
    setTimeout(() => {
      dispatch(ModalActionCreators.open({target: 'life-add', className: 'medium', cb: this.close.bind(this)}))
    }, 300)
  }

  close () {
    const {stickyBtn, stickyWrapper} =this.refs
    stickyBtn.classList.remove('rippling')
    stickyWrapper.classList.remove('clicked')
  }

  render () {
    const {
      props: {
        User
      }
    } = this

    const user = User.get('user')
    if (!user) {
      return <div />
    }
    return (
      <div className="life-sticky">
        <div className="button-wrapper" ref="stickyWrapper">
          <div className="layer"></div>
          <button className="main-button fa fa-pencil-square-o"
                  data-for={`sticky-btn`}
                  ref="stickyBtn" onClick={ e => ::this.stickyAdd()}>
            <div className="ripple"></div>
            <ReactTooltip id={`sticky-btn`} class="sticky-tooltip" place="bottom" type="dark"
                          effect="solid"
                          getContent={this.getTitle('life.sticky.tooltip')}/>
          </button>
        </div>
      </div>
    )
  }
}

export default injectIntl(LifeSticky)
