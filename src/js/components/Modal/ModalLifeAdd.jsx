import React from 'react'
import ModalComponent from './ModalComponent'
import { connect } from 'react-redux'
import classNames from 'classnames'
import config from '../../../../config'
import _ from 'lodash'
import Q from 'q'
import TextField from 'material-ui/TextField'
import * as EventActionCreator from '../../actions/event'
import * as LifeActionCreators from '../../actions/life'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Spinner from '../Spinner/Spinner'
import ReactImgix from '../Image/ReactImgix'
import {
  FormattedMessage,
} from 'react-intl'

import {
  Step,
  StepButton,
  Stepper,
  StepLabel,
  StepContent,
} from 'material-ui/Stepper'

import shallowEqual from 'react-pure-render/shallowEqual'

const {life} = config

const textInputStyle = {
  color: '#FFFFFF',
  floatingLabel: {
    color: '#FFFFFF'
  }, errorStyle: {
    color: '#FFFFFF'
  }, hintStyle: {
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
    scrapping: false,
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

  componentWillReceiveProps (nextProps) {
    const scrappedData = nextProps.Life.get(`life/wrap`)
    if (!shallowEqual(scrappedData, this.props.Life.get(`life/wrap`))) {
      this.setState({
        scrapped: Boolean(scrappedData)
      })
    }
  }

  componentDidMount () {
    this.attachTooltip()
  }

  componentDidUpdate () {
    this.attachTooltip()
  }

  attachTooltip () {
    $('[data-toggle="tooltip"]').tooltip()
  }

  async pinType (network) {
    this.setState({
      network,
      stepIndex: 1
    })
  }


  handleNext = () => {
    const {props:{dispatch, Life, intl}} =this
    const {description} =this.refs
    const {stepIndex, finished} = this.state
    if (finished) {
      const scrappedData = Life.get(`life/wrap/original`)
      return dispatch(LifeActionCreators.publishPin(_.merge(scrappedData.toJS(), {
        description: description.getValue()
      }))).then(() => {
        dispatch(EventActionCreator.snackMessage({message: 'life.modal.success'}))
        this.closeModal()
      }).catch((err) => {
        dispatch(EventActionCreator.snackMessage(err || {message: 'life.modal.errors.post'}))
        this.closeModal()
      })
    }
    this.setState({
      stepIndex: stepIndex + 1
    })
  }

  handlePrev = () => {
    const {stepIndex} = this.state
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1})
    }
  }

  validateUrl (event, payload) {
    const {props:{dispatch, intl}} =this
    const {regex} = this.state.network
    this.setState({scrapping: true})
    Q.fcall(() => {
      return payload.match(regex)
    }).then((match) => {
      if (!match) {
        throw new Error(intl.formatMessage({id: 'life.modal.errors.url'}))
      }
      return payload
    }).then((url) => {
      return dispatch(LifeActionCreators.wrappPin(url))
    }).then(() => {
      this.setState({
        stepIndex: 2,
        finished: true,
        scrapping: false
      })
    }).catch((error) => {
      this.setState({
        error,
        finished: false,
        scrapping: false
      })
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

      return (
        <div className={classNames(shareButtonClass)}
             data-toggle="tooltip"
             data-placement="top"
             title={network.title}
             key={`pin-btn-${network.icon}`} {...inputAttributes}>
        </div>)
    })
  }

  renderStepFinal () {
    const {props:{Life}} =this
    const scrappedData = Life.get(`life/wrap`)
    if (!scrappedData) {
      return
    }
    const imageUrl = scrappedData.get('imageUrl')

    return (<div className="row no-padding">
      <div className="col-md-12">
        <div className="row">
          <div className="col-md-2">
            <label className="pin-label">Titre : </label>
          </div>
          <div className="col-md-10">
            <span className="pin-label">{scrappedData.get('title')}</span>
          </div>
        </div>
      </div>
      <div className="col-md-9 col-xs-9 ">
        <TextField className="pin-description"
                   ref="description"
                   defaultValue={scrappedData.get('description')}
                   fullWidth={true}
                   multiLine={true}
                   textareaStyle={textInputStyle}
                   hintText="Ajouter une description"/>
      </div>
      {imageUrl && <div className="col-md-3 col-xs-3">
        <ReactImgix src={imageUrl}/>
      </div>}
    </div>)
  }


  renderStepActions (step) {
    const {stepIndex, finished} = this.state

    return (
      <div style={{margin: '12px 0'}}>
        {step > 0 && !finished && (
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
    const {props:{intl}} =this
    const {finished, error, stepIndex, scrapping} = this.state

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
                      <FormattedMessage tagName="h1" id={`life.modal.title`}/>
                      <a className={closeClass} onClick={::this.handleClose}></a>
                    </div>
                    <div className="mode-container">
                      <div className="mode">
                        <Stepper className="stepper" style={{width: '100%'}} activeStep={stepIndex}
                                 orientation="vertical">
                          <Step disabled={scrapping}>
                            <StepButton
                              onClick={() => this.setState({stepIndex: 0})}>
                              <FormattedMessage id={`life.modal.step1`}/>
                            </StepButton>
                            <StepContent className="step-buttons">
                              {this.getButtons()}
                            </StepContent>
                          </Step>
                          <Step disabled={scrapping}>
                            <StepButton
                              onClick={() => stepIndex > 1 && this.setState({stepIndex: 1})}>
                              <FormattedMessage id={`life.modal.step2`}/></StepButton>
                            <StepContent>
                              {error && <span className="warn">{error.message}</span>}
                              <TextField hintText={intl.formatMessage({id: 'life.modal.step2'})}
                                         fullWidth={true}
                                         disabled={this.state.scrapping}
                                         onChange={::this.validateUrl}
                                         inputStyle={textInputStyle}/>
                              {this.state.scrapping && <Spinner />}
                              {/*{this.renderStepActions(1)}*/}
                            </StepContent>
                          </Step>
                          <Step disabled={stepIndex === 2}>
                            <StepButton><FormattedMessage id={`life.modal.step3`}/></StepButton>
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
