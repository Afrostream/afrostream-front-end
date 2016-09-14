import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import * as UserActionCreators from '../../actions/user'
import * as BillingActionCreators from '../../actions/billing'
import ModalComponent from './ModalComponent'
import { getI18n } from '../../../../config/i18n'
import SignUpButton from '../User/SignUpButton'
import { withRouter } from 'react-router'

@connect(({Billing, User}) => ({Billing, User}))
class ModalCoupon extends ModalComponent {

  constructor (props) {
    super(props)
    this.state = {
      success: false,
      loading: false,
      coupon: null,
      signInOrUp: null
    }
  }

  componentDidMount () {
    const {
      props: {location}
    } = this
    let {query} = location
    let {code} = query
    if (code) {
      this.refs.coupon.value = code
    }
  }

  async finalyse () {
    const {
      props: {
        dispatch
      }
    } = this

    return await dispatch(BillingActionCreators.couponActivate())
      .then(()=> {
        return dispatch(UserActionCreators.getProfile())
      }).then(()=> {
        return this.props.history.push('/')
      }).catch(({response:{body:{error}}, message})=> {
        return this.setState({
          success: false,
          loading: false,
          signInOrUp: false,
          error: error || message || this.getTitle('couponInvalid')
        })
      })
  }

  handleClose (e) {
    super.handleClose(e)
    this.props.history.push(`/`)
  }

  async handleSubmit (event) {
    event.preventDefault()

    const {
      props: {
        User,
        dispatch
      }
    } = this

    const self = this
    const user = User.get('user')

    let formData = {
      billingProviderName: 'afr',
      coupon: this.refs.coupon.value
    }

    this.setState({
      loading: true,
      error: '',
      internalPlanUuid: null,
      providerName: null
    })

    //Validate coupon
    return await dispatch(BillingActionCreators.couponValidate(formData))
      .then(({
        res:{
          body:{
            coupon
          }
        }
      }) => {
        //coupon valid
        if (coupon && coupon.status === 'waiting') {
          if (!user) {
            return
          }
          return this.finalyse()
        }
        //coupon invalid
        throw new Error(self.getTitle('couponInvalid'))
      })
      //Get updated profile
      .then(()=> {
        this.setState({
          loading: false,
          signInOrUp: !user,
          success: user
        })
        return dispatch(UserActionCreators.getProfile())
      })
      .catch((err) => {
        console.log('Error coupon ', err)
        this.setState({
          success: false,
          loading: false,
          signInOrUp: false,
          error: err.message || err.error || self.getTitle('couponInvalid')
        })
      })
  }

  getTitle (key = 'title') {
    const {
      props: {
        params
      }
    } = this

    return getI18n(params.lang).coupon[key] || ''
  }

  getForm () {
    if (this.state.error) {
      return
    }

    if (this.state.success) {
      return (<div className="notloggedin mode">
        <div className="instructions">{this.getTitle('successText')}</div>
        <button className="primary next" onClick={::this.handleClose}>{this.getTitle('next')}</button>
      </div>)
    }

    if (this.state.signInOrUp) {
      return (<div className="notloggedin mode">
        <SignUpButton className="primary next" target="showSignup" to="/" label={getI18n().signup.title}
                      cb={::this.finalyse}/>
        <SignUpButton className="primary next" target="showSignin" to="/" label={getI18n().signin.title}
                      cb={::this.finalyse}/>
      </div>)
    }

    if (this.state.loading) {
      return (<div className="loading mode">
        <div className="spinner spin-container">
          <div className="spinner-css">
            <span className="side sp_left">
            <span className="fill"/>
            </span>
            <span className="side sp_right">
            <span className="fill"/>
            </span>
          </div>
          <div className="spin-message"/>
        </div>
      </div>)
    }

    let formTemplate = this.getRedeemCoupon()

    return (
      <div className="notloggedin mode">
        <form noValidate="" onSubmit={::this.handleSubmit}>
          <div className="instructions">{this.getTitle('headerText')}</div>
          {formTemplate}
        </form>
      </div>
    )
  }

  getCoupon () {

    const {
      props: {
        Billing
      }
    } = this

    let couponStore = Billing.get('coupon')
    let coupon

    if (couponStore) {
      coupon = couponStore.get('coupon')
    }

    return (
      <div className="email">
        <label htmlFor="easy_email" className="sad-placeholder">
          {this.getTitle('emailPlaceholder')}
        </label>
        <div className="input-box">
          <i className="icon-barcode"></i>
          <input name="email" ref="coupon" id="easy_email" type="text" className="input-coupon" required
                 defaultValue={coupon ? coupon.get('code') : ''}
                 placeholder={this.getTitle('couponPlaceholder')}
                 title={this.getTitle('couponPlaceholder')}/>
        </div>
      </div>
    )
  }

  getRedeemCoupon () {
    return (
      <div className="emailPassword">
        <div className="inputs-wrapper">
          <div className="inputs">
            {this.getCoupon()}
          </div>
        </div>
        <div className="action">
          <button type="submit" className="primary next">{this.getTitle('action')}</button>
        </div>
      </div>
    )
  }

  render () {

    var errClass = classNames({
      'error': true,
      'hide': !this.state.error
    })


    let popupClass = classNames({
      'popup': this.props.modal
    })

    let overlayClass = classNames({
      'overlay': this.props.modal,
      'widget': !this.props.modal,
      'active': true
    })

    let closeClass = classNames({
      'close': true,
      'icon-budicon-3': true,
      'hide': !this.props.closable
    })


    const classType = 'redeemCoupon'

    return (
      <div className="lock-container">
        <div id="lock" className="lock theme-default">
          <div className={classType}>
            <div className={popupClass}>
              <div className={overlayClass}>
                <div className="centrix">
                  <div id="onestep" className="panel onestep active">
                    {/*HEADER*/}
                    <div className="header top-header ">
                      <div className="bg-gradient"></div>
                      <h1>{this.getTitle()}</h1>
                      <h2 className={errClass}>{this.state.error}</h2>
                      <a className={closeClass} href="#" onClick={::this.handleClose}></a>
                    </div>
                    <div className="mode-container">
                      {this.getForm()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ModalCoupon.propTypes = {
  type: React.PropTypes.string,
  dispatch: React.PropTypes.func,
  location: React.PropTypes.object.isRequired,
  history: React.PropTypes.object.isRequired
}

export default withRouter(ModalCoupon)
