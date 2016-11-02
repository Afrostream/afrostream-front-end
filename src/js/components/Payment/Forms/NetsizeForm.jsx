import React, { PropTypes } from 'react'
import ReactDOM from'react-dom'
import classSet from 'classnames'
import { getI18n } from '../../../../../config/i18n'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class NetsizeForm extends React.Component {

  constructor (props, context) {
    super(props, context)
    this.state = {
      hasLib: true
    }
  }

  static propTypes = {
    selected: React.PropTypes.bool
  }

  static defaultProps = {
    selected: false
  }

  async submit (billingInfo, currentPlan) {
    const {
      props:{}
    }=this

    return await new Promise(
      (resolve) => {
        return resolve({
          internalPlanUuid: billingInfo.internalPlanUuid,
          currency: currentPlan.get('currency'),
          amount: currentPlan.get('amount'),
          billingProviderName: 'netsize'
        })
      }
    )
  }

  onHeaderClick () {
    let clickHeader = ReactDOM.findDOMNode(this)
    if (clickHeader) {
      clickHeader.dispatchEvent(new CustomEvent('changemethod', {'detail': 'netsize', bubbles: true}))
    }
  }

  getForm () {
    if (!this.props.selected) return
    return (

      <div className="row" ref="netsizeForm">
        <h5 className="col-md-12">
          {getI18n().payment.mobile.text.replace('{submitBtn}', getI18n().planCodes.actionMobile)}
        </h5>
      </div>
    )
  }

  render () {

    let classHeader = {
      'accordion-toggle': true,
      'collapsed': !this.props.selected
    }

    let classPanel = {
      'panel': true,
      'collapsed': !this.props.selected
    }

    return (
      <div className={classSet(classPanel)}>
        <div className="payment-method-details">
          <div className={classSet(classHeader)} onClick={::this.onHeaderClick}>
            <label className="form-label">{getI18n().payment.mobile.label}</label>
            <i className="zmdi zmdi-hc-2x zmdi-smartphone-android"/>
          </div>
        </div>
        <ReactCSSTransitionGroup transitionName="accordion" className="panel-collapse collapse in"
                                 transitionEnter={true} transitionLeave={false}
                                 transitionEnterTimeout={300}
                                 transitionLeaveTimeout={300} component="div">
          {this.getForm()}
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

export default NetsizeForm
