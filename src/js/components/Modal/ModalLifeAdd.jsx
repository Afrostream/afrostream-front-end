import React from 'react'
import ModalComponent from './ModalComponent'
import { connect } from 'react-redux'
import classNames from 'classnames'
import config from '../../../../config'
import { getI18n } from '../../../../config/i18n'
import Q from 'q'
import TextField from 'material-ui/TextField'
import * as LifeActionCreators from '../../actions/life'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import ReactImgix from '../Image/ReactImgix'
import { extractImg } from '../../lib/utils'

import {
  Step,
  Stepper,
  StepLabel,
  StepContent,
} from 'material-ui/Stepper'

const {life} = config

const textInputStyle = {
  color: '#FFFFFF',
  floatingLabel: {
    color: '#FFFFFF'
  }, errorStyle: {
    color: '#FFFFFF'
  },
  floatingLabelStyle: {
    color: '#FFFFFF'
  },
  floatingLabelFocusStyle: {
    color: '#FFFFFF'
  },
  focusColor: '#FFFFFF',
  textColor: '#FFFFFF',
  secondaryTextColor: '#FFFFFF'
}

if (process.env.BROWSER) {
  require('./ModalLifeAdd.less')
}

@connect(({Life}) => ({Life}))
class ModalLifeAdd extends ModalComponent {

  state = {
    finished: false,
    stepIndex: 0
  }

  constructor (props, context) {
    super(props, context)
  }

  closeModal () {
    const {props:{cb}} =this
    super.closeModal()
    if (cb) {
      cb()
    }
  }

  async pinType (network) {
    this.setState({
      network,
      stepIndex: 1
    })
  }

  getButtons () {
    return _.map(life.networks, (network) => {

      const inputAttributes = {
        onClick: event => ::this.pinType(network)
      }

      let shareButtonClass = {
        'btn': true,
        'pin-btn': true
      }

      shareButtonClass[network.icon] = true

      return (<div className={classNames(shareButtonClass)} type="button" data-toggle="tooltip"
                   data-placement="top"
                   title={network.title}
                   key={`pin-btn-${network.icon}`} {...inputAttributes}>
        {this.props.showLabel && <span>{network.label}</span>}
      </div>)
    })
  }

  renderStepFinal () {
    const {props:{Life}} =this
    const scrappedData = Life.get(`life/wrap`)
    if (!scrappedData) {
      return
    }
    return (<div>
      <label className="pin-label">{scrappedData.get('title')}</label>
      <TextField className="pin-description"
                 defaultValue={scrappedData.get('description')}
                 fullWidth={true}
                 multiLine={true}
                 hintText="Ajouter une description"/>
      <ReactImgix src={scrappedData.get('imageUrl')}/>
    </div>)
  }

  validateUrl (event, payload) {
    const {props:{dispatch}} =this
    const {regex} = this.state.network

    Q.fcall(()=> {
      return payload.match(regex)
    }).then((match)=> {
      if (!match) {
        throw new Error('l\ url indiqué n\'est pas valide')
      }
      return payload
    }).then((url)=> {
      return dispatch(LifeActionCreators.wrappPin(url))
    }).then((match)=> {
      this.setState({
        stepIndex: 2
      })
    }).catch((error)=> {
      this.setState({
        error
      })
    })
  }

  handleNext = () => {
    const {stepIndex} = this.state
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
    })
  }

  handlePrev = () => {
    const {stepIndex} = this.state
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1})
    }
  }

  renderStepActions (step) {
    const {stepIndex} = this.state

    return (
      <div style={{margin: '12px 0'}}>
        {step > 0 && (
          <FlatButton
            label="Retour"
            disabled={stepIndex === 0}
            disableTouchRipple={true}
            disableFocusRipple={true}
            onTouchTap={this.handlePrev}
            style={{color: '#FFFFFF'}}
          />
        )}
        <RaisedButton
          label={stepIndex === 2 ? 'Envoyer' : 'Suivant'}
          disableTouchRipple={true}
          disableFocusRipple={true}
          primary={true}
          onTouchTap={this.handleNext}
          style={{marginRight: 12, color: '#FFFFFF'}}
        />
      </div>
    )
  }

  render () {

    const {finished, stepIndex} = this.state

    let closeClass = classNames({
      'close': true,
      'icon-budicon-3': true,
      'hide': !this.props.closable
    })

    let panelClass = {
      'panel onestep active': true,
    }

    panelClass[this.props.className] = true

    return (
      <div className="lock-container">
        <div id="lock" className="lock theme-default pin">
          <div className="signin">
            <div className="popup">
              <div className="overlay active">
                <div className="centrix">
                  <div id="onestep" className={classNames(panelClass)}>
                    {/*HEADER*/}
                    <div className="header top-header">
                      <h1>{getI18n().life.modal.title}</h1>
                      <a className={closeClass} href="#" onClick={::this.handleClose}></a>
                    </div>
                    <div className="mode-container">
                      <div className="mode">
                        <Stepper activeStep={stepIndex} orientation="vertical">
                          <Step>
                            <StepLabel style={{color: '#FFFFFFF'}}>{getI18n().life.modal.step1}</StepLabel>
                            <StepContent>
                              {this.getButtons()}
                            </StepContent>
                          </Step>
                          <Step>
                            <StepLabel style={{color: '#FFFFFFF'}}>{getI18n().life.modal.step2}</StepLabel>
                            <StepContent>
                              <TextField hintText={getI18n().life.modal.step2}
                                         fullWidth={true}
                                         onChange={::this.validateUrl}
                                         style={{color: '#FFFFFFF'}}/>
                              {this.renderStepActions(1)}
                            </StepContent>
                          </Step>
                          <Step>
                            <StepLabel style={{color: '#FFFFFFF'}}>{getI18n().life.modal.step3}</StepLabel>
                            <StepContent>
                              {this.renderStepFinal()}
                              {this.renderStepActions(2)}
                            </StepContent>
                          </Step>
                        </Stepper>
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

export default ModalLifeAdd
