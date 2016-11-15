import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import * as ModalActionCreators from '../../actions/modal'
import Headroom from 'react-headrooms'

if (process.env.BROWSER) {
  require('./LifeSticky.less')
}
@connect(({Life, User}) => ({Life, User}))
class LifeSticky extends Component {

  constructor (props, context) {
    super(props, context)
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
    setTimeout(()=> {
      dispatch(ModalActionCreators.open({target: 'life-add', className: 'medium', cb: this.close.bind(this)}))
    }, 1500)
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
    if (!user || user.get('token').get('role') !== 'admin') {
      return <div />
    }
    return (
      <Headroom disableInlineStyles={true} tolerance={5} offset={200} classes={{
        initial: 'headroom',
        pinned: 'headroom--pinned',
        unpinned: 'headroom--unpinned',
        bottom: 'headroom--bottom'
      }}>
        <div className="life-sticky">
          <div className="button-wrapper" ref="stickyWrapper">
            <div className="layer"></div>
            <button className="main-button zmdi zmdi-plus" ref="stickyBtn" onClick={ e => ::this.stickyAdd()}>
              <div className="ripple"></div>
            </button>
          </div>
        </div>
      </Headroom>
    )
  }
}

export default LifeSticky
