import React from 'react'
import { connect } from 'react-redux'
import { getI18n } from '../../../../config/i18n'
import * as UserActionCreators from '../../actions/user'
import config from '../../../../config'
import _ from 'lodash'
import TextField from 'material-ui/TextField'
import Toggle from 'material-ui/Toggle'
import DatePicker from 'material-ui/DatePicker'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import VerifiedUser from 'material-ui/svg-icons/action/verified-user';

import areIntlLocalesSupported from 'intl-locales-supported'

import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'

let DateTimeFormat
/**
 * Use the native Intl.DateTimeFormat if available, or a polyfill if not.
 */
if (areIntlLocalesSupported(['fr'])) {
  DateTimeFormat = global.Intl.DateTimeFormat;
} else {
  const IntlPolyfill = require('intl');
  DateTimeFormat = IntlPolyfill.DateTimeFormat;
  require('intl/locale-data/jsonp/fr');
}

const {userProfile}= config

if (process.env.BROWSER) {
  require('./AccountProfil.less')
}

@connect(({User}) => ({User}))
class AccountProfil extends React.Component {

  constructor (props) {
    super(props)
    this.state = {fetching: false}
  }


  synchroniseHandler (key, value) {
    const {
      props: {
        dispatch
      }
    } = this

    this.setState({
      fetching: true
    })
    let putData = {}
    putData[key] = value
    dispatch(UserActionCreators.updateUserProfile(putData))
      .then(()=> {
        this.setState({
          fetching: false
        })
      }).catch(()=> {
      this.setState({
        fetching: false
      })
    })
  }


  renderFormElement (section) {
    const {
      props: {
        User
      }
    } = this

    const user = User.get('user')
    const label = getI18n().account.profile[section.key]
    const sectionValue = user.get(section.key) || ''
    const icon = section.icon || ''
    const iconStyle = section.icon || ''
    const iconRight = section.iconRight || ''
    const isEnable = Boolean(sectionValue)
    const checkLabel = getI18n().account.profile[isEnable ? 'off' : 'on']
    let inputAttributes = {
      onChange: (event, key, payload) => {
        this.synchroniseHandler(section.key, payload)
      }
    }

    let element

    switch (section.type) {
      case 'Date':
        inputAttributes = {
          onChange: (event, date) => {
            this.synchroniseHandler(section.key, date)
          }
        }
        let selectedDate = typeof sectionValue === Date ? sectionValue : new Date(sectionValue)
        element = <DatePicker defaultDate={selectedDate}
                              floatingLabelText={label}
                              hintText={label} {...inputAttributes} DateTimeFormat={DateTimeFormat}/>
        break
      case 'Radio':
        inputAttributes = {
          onChange: (event, payload) => {
            let value = payload
            this.synchroniseHandler(section.key, value)
          }
        }
        element =
          <RadioButtonGroup style={{display: 'flex'}}
                            {...inputAttributes}
                            name={section.key}
                            defaultSelected={section.defaultSelected}>
            {section.list.map((item, key) =><RadioButton style={{width: '30%'}} value={item.value}
                                                         label={ getI18n().account.profile[item.value]}
                                                         key={`${key}-item-radio`}/>)}
          </RadioButtonGroup>
        break
      case 'List':
        element = <SelectField defaultValue={sectionValue} {...inputAttributes} floatingLabelText={label}>
          {section.list.map((item, key) =><MenuItem value={item.value} primaryText={item.label}
                                                    key={`${key}-item-menu`}/>)}
        </SelectField>
        break
      case 'Boolean':

        inputAttributes = {
          onToggle: (event, payload) => {
            let value = payload
            if (section.key === 'gender') {
              value = payload ? 'man' : 'woman'
            }
            this.synchroniseHandler(section.key, value)
          }
        }

        element = <Toggle
          {...inputAttributes}
          iconStyle={{
            fill: '#FF9800'
          }}
          toggled={isEnable}
          {...{label, icon}}
          {...inputAttributes}
          disabled={this.state.fetching}
        />
        break
      default:

        let inputAttributes = {
          onChange: (event, payload) => {
            clearTimeout(this.updateTimeout)
            this.updateTimeout = setTimeout(()=> {

              this.synchroniseHandler(section.key, payload)
            }, 1500)
          }
        }

        element = <TextField floatingLabelText={label}
                             underlineShow={false}
                             disabled={section.disabled}
                             defaultValue={sectionValue}
                             name={`${section.key}-input`}
                             hintText={label}
                             {...inputAttributes}/>
        break
    }

    return element
  }

  renderUserProfile () {
    //GET SECTIONS
    return _.map(userProfile.keys, (sections, key)=> {
      let title = getI18n().account.profile[key]

      return (<div className="panel-profil" key={`${key}-profile`}>
        <div className="pannel-header">{title}</div>
        <div className="row row-profil">
          {sections.map((section)=> {
            return (<div className="col-md-6" key={`${section.key}-section`}>
                <div className="row">
                  <div className="col-md-12">
                    {this.renderFormElement(section)}
                  </div>
                </div>
              </div>
            )

          })}
        </div>
      </div>)
    })
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
      <div className="row account-details">
        <div className="account-details__container col-md-12">
          {this.renderUserProfile()}
        </div>
      </div>
    )
  }
}

export default AccountProfil
