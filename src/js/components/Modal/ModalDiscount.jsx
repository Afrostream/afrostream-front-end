import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import * as UserActionCreators from '../../actions/user'
import * as BillingActionCreators from '../../actions/billing'
import ModalComponent from './ModalComponent'
import Spinner from '../Spinner/Spinner'
import { withRouter } from 'react-router'
import Q from 'q'
import {
  injectIntl,
  intlShape
} from 'react-intl'

@connect(({Billing, User, Modal}) => ({Billing, User, Modal}))
class ModalDiscount extends ModalComponent {

  constructor(props, context) {
    super(props, context)
    this.state = {
      success: false,
      loading: false,
      coupon: null,
      signInOrUp: null
    }
  }


  handleClose(e) {
    super.handleClose(e)
  }

  handleCancel(e) {
    e.preventDefault()
    const {
      props: {
        history,
        Modal,
        data
      }
    } = this
    history.push(data.get('donePath') || '/')
    this.handleClose(e)
  }

  async handleSubmit(event) {
    event.preventDefault()

    const {
      props: {
        data,
        User,
        dispatch
      }
    } = this

    const user = User.get('user')
    const coupon = data.get('coupon')
    const currentSubscription = data.get('currentSubscription')

    this.setState({
      loading: true
    })

    //Validate coupon
    return await Q()
      .then(() => {
        if (!coupon) {
          throw new Error('cant switch plan for the moment')
        }
        return dispatch(BillingActionCreators.switchSubscription(currentSubscription, coupon.get('code')))
      })
      .then(({
               res: {
                 body
               }
             }) => {
        this.setState({
          loading: false,
          success: body.isActive
        })

        return dispatch(UserActionCreators.getProfile())
      })
      .catch((err) => {
        return this.setState({
          success: false,
          loading: false,
          error: err.message
        })
      })
  }

  getI18n() {
    return 'discount'
  }

  getForm() {

    const {
      props: {
        data,
      }
    } = this

    const mergeFormat = _.merge({
      percent: 10,
      switchPrice: 3.99,
      originalPrice: 6.99,
      originalTime: 'month',
    }, data && data.get('format') && data.get('format').toJS() || {})

    if (this.state.loading) {
      return (<div className="loading mode">
        <Spinner/>
      </div>)
    }

    if (this.state.success) {
      return (<div />)
    }

    return <form noValidate="" onSubmit={::this.handleSubmit}>
      <div className="instructions">{this.getTitle('description', mergeFormat)}</div>
      <div className="action">
        <button name="submit-btn" type="submit"
                className="primary next">{this.getTitle('action', mergeFormat)}</button>
        <div className="options">
          <a onClick={::this.handleCancel}
             className="centered btn-small cancel">{this.getTitle('cancel')}</a>
        </div>
      </div>
    </form>
  }

  render() {

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

    let titleClass = classNames({
      'hide': this.state.success
    })

    let successClass = classNames({
      'success': true,
      'hide': !this.state.success
    })

    let panelClass = {
      'panel onestep active': true,
    }

    const classType = 'discount'

    panelClass[this.props.className] = true

    return (
      <div className="lock-container">
        <div id="lock" className="lock theme-default">
          <div className={classType}>
            <div className={popupClass}>
              <div className={overlayClass}>
                <div className="centrix">
                  <div id="onestep" className={classNames(panelClass)}>
                    {/*HEADER*/}
                    <div className="header top-header ">
                      <div className="bg-gradient"></div>
                      <h1 className={titleClass}>{this.getTitle('title')}</h1>
                      <h1 className={successClass}>{this.getTitle('successTitle')}</h1>
                      <h2 className={successClass}>{this.getTitle('success')}</h2>
                      <h2 className={errClass}>{this.state.error}</h2>
                      <a className={closeClass} onClick={::this.handleClose}></a>
                    </div>
                    <div className="mode-container">
                      <div className="mode">
                        {this.getForm()}
                      </div>
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

ModalDiscount.propTypes = {
  intl: intlShape.isRequired,
  data: React.PropTypes.object,
  type: React.PropTypes.string,
  dispatch: React.PropTypes.func,
  location: React.PropTypes.object.isRequired,
  history: React.PropTypes.object.isRequired
}

export default withRouter(injectIntl(ModalDiscount))
