import React from 'react'
import { connect } from 'react-redux'
import * as OAuthActionCreators from '../../actions/oauth'
import * as UserActionCreators from '../../actions/user'
import * as SWActionCreators from '../../actions/sw'

import { Link } from '../Utils'
import config from '../../../../config'
import TextField from 'material-ui/TextField'
import Toggle from 'material-ui/Toggle'
import DatePicker from 'material-ui/DatePicker'
import SelectField from 'material-ui/SelectField'
import AutoComplete from 'material-ui/AutoComplete'
import MenuItem from 'material-ui/MenuItem'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import Checkbox from 'material-ui/Checkbox'
import RaisedButton from 'material-ui/RaisedButton'
import AvatarCard from '../User/AvatarCard'
import window from 'global/window'
import { I18n } from '../Utils'
import {
  FormattedMessage,
} from 'react-intl'

import areIntlLocalesSupported from 'intl-locales-supported'

import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber'

let DateTimeFormat
let phoneUtil = PhoneNumberUtil.getInstance()
/**
 * Use the native Intl.DateTimeFormat if available, or a polyfill if not.
 */
if (areIntlLocalesSupported(['fr'])) {
  DateTimeFormat = global.Intl.DateTimeFormat
} else {
  const IntlPolyfill = require('intl')
  DateTimeFormat = IntlPolyfill.DateTimeFormat
  require('intl/locale-data/jsonp/fr')
}

const {userProfile} = config

if (process.env.BROWSER) {
  require('./AccountProfil.less')
}

@connect(({User, Geo}) => ({User, Geo}))
class AccountProfil extends I18n {

  constructor (props, context) {
    super(props, context)
    this.state = {fetching: false}
  }

  getAddressProperty (place, property, shortName) {
    const addressComponents = place.address_components
    for (let componentIndex in addressComponents) {
      let component = addressComponents[componentIndex]
      let types = component.types
      if (types.length > 0) {
        for (let typeIndex in types) {
          let type = types[typeIndex]
          if (type === property) {
            return (shortName) ? component.short_name : component.long_name
          }
        }
      }
    }
    return null
  }

  getStreetAddress (place) {
    let streetNumber = this.getAddressProperty(place, 'street_number')
    let street = this.getAddressProperty(place, 'route')
    let orEmpty = (entity) => {
      return entity || ''
    }
    let address = orEmpty(streetNumber) + ' ' + orEmpty(street)
    if (/\S/.test(address)) {
      return address.trim()
    }
    return place.name
  }

  initMap () {
    const places = window.google && window.google.maps && window.google.maps.places
    const {addressLocation} = this.refs
    if (places && addressLocation && !addressLocation._autocomplete) {

      addressLocation._autocomplete = new places.Autocomplete(addressLocation.input, {
        types: ['geocode']
      })
      addressLocation._autocomplete.addListener('place_changed', () => {
        const place = addressLocation._autocomplete.getPlace()

        const putData = {
          postalAddressStreet: this.getStreetAddress(place),
          postalAddressCountry: this.getAddressProperty(place, 'country', true),
          postalAddressCity: this.getAddressProperty(place, 'locality'),
          postalAddressLocality: this.getAddressProperty(place, 'administrative_area_level_1'),
          postalAddressRegion: this.getAddressProperty(place, 'administrative_area_level_2'),
          postalAddressCode: this.getAddressProperty(place, 'postal_code')
        }

        this.updateUserHandler({putData})
      })
    }
  }

  componentDidUpdate () {
    this.initMap()
  }


  updateUserHandler ({key, value, putData = {}}) {
    const {
      props: {
        dispatch
      }
    } = this

    this.setState({
      fetching: true
    })

    if (key) {
      putData[key] = value
    }

    dispatch(UserActionCreators.updateUserProfile(putData))
      .then(() => {
        this.setState({
          fetching: false
        })
      }).catch(() => {
      this.setState({
        fetching: false
      })
    })
  }


  syncFB () {
    const {
      props: {
        dispatch,
        User
      }
    } = this

    const user = User.get('user')
    const strategy = 'facebook'
    if (user.get(strategy)) {
      return
    }
    dispatch(OAuthActionCreators.strategy({strategy, isSynchro: user.get(strategy)}))
      .then(() => {
        dispatch(UserActionCreators.getProfile())
        this.setState({
          fetching: false
        })
      }).catch(() => {
      this.setState({
        fetching: false
      })
    })

  }

  validatePhone (v, bool = true) {
    const {phoneInput} = this.refs
    let parsedNumber = bool && false || v
    let isValid = false
    let message = this.getTitle('signin.language.phone')
    try {
      isValid = phoneUtil.isValidNumber(this.formatPhone(v))
    } catch (e) {
      console.log('Error formatting number', e.message)
    }
    if (phoneInput) {
      phoneInput.setState({
        errorText: !isValid ? message : ''
      })
    }
    try {
      parsedNumber = phoneUtil.format(this.formatPhone(v), PhoneNumberFormat.E164)//INTERNATIONAL
    } catch (e) {
      console.log('Error parsing input number', e)
    }
    return bool ? (isValid && parsedNumber) : parsedNumber
  }

  formatPhone (p) {
    const {
      props: {
        Geo
      }
    } = this
    const geo = Geo.get('geo')
    const countryCode = geo.get('countryCode') || 'FR'
    let formatedNumber = p
    try {
      formatedNumber = phoneUtil.parse(p, countryCode)
    } catch (e) {
      console.log('Error formating input number', e)
    }
    return formatedNumber
  }

  renderFormElement (section) {
    const {
      props: {
        User,
        dispatch,
        intl
      }
    } = this

    const user = User.get('user')
    const hasFacebook = Boolean(user && user.get('facebook'))
    const label = intl.formatMessage({id: `account.profile.${section.key}`})
    const sectionValue = user.get(section.key) || ''
    const icon = section.icon || ''
    const isEnable = Boolean(sectionValue)
    let inputAttributes = {
      onChange: (event, key, payload) => {
        this.updateUserHandler({key: section.key, value: payload})
      }
    }

    let element

    switch (section.type) {
      case  'autocomplete':

        const street = user.get('postalAddressStreet')
        const city = user.get('postalAddressCity')
        const adresse = `${(street && street + ', ') || ''} ${(city && city) || ''}`

        element = <TextField defaultValue={adresse}
                             fullWidth={true}
                             floatingLabelText={label} ref="addressLocation"
                             floatingLabelFixed={true}/>
        break
      case  'tel':

        inputAttributes = {
          onChange: (event, payload) => {
            const value = this.validatePhone(payload)
            if (value) {
              event.target.value = value
              this.updateUserHandler({key: section.key, value})
            }
          }
        }

        //const value = this.validatePhone(sectionValue, false)

        element = <TextField defaultValue={sectionValue}
                             type="tel"
                             ref="phoneInput"
                             hintText="+33660916742"
                             pattern={section.pattern}
                             fullWidth={true}
                             {...inputAttributes}
                             floatingLabelText={label}
                             floatingLabelFixed={true}/>
        break
      case  'password':
        element = <Link to="/reset"><RaisedButton {...{label}} {...inputAttributes}/></Link>
        break
      case  'picture':
        inputAttributes = {
          onClick: (event) => this.syncFB()
        }
        element = <div className="row-fluid text-center">
          <AvatarCard user={user} {...inputAttributes}/>
          <RaisedButton {...{label}} {...inputAttributes} style={{
            marginTop: 20,
            minWidth: 200
          }} disabled={hasFacebook}/>
        </div>
        break
      case 'date':
        inputAttributes = {
          onChange: (event, date) => {
            this.updateUserHandler({key: section.key, value: date})
          }
        }
        let selectedDate = (sectionValue && new Date(sectionValue) || new Date())
        element = <DatePicker value={selectedDate}
                              autoOk={true}
                              locale="fr-FR"
                              floatingLabelText={label}
                              hintText={label} {...inputAttributes} DateTimeFormat={DateTimeFormat}/>
        break
      case 'radio':
        inputAttributes = {
          onChange: (event, payload) => {
            let value = payload
            this.updateUserHandler({key: section.key, value})
          }
        }
        element =
          <RadioButtonGroup style={{display: 'flex'}}
                            {...inputAttributes}
                            name={section.key}
                            defaultSelected={section.defaultSelected}
                            valueSelected={sectionValue || section.defaultSelected}>
            {section.list.map((item, key) => <RadioButton style={{width: '30%'}} value={item.value}
                                                          label={ <FormattedMessage
                                                            id={`account.profile.${item.value}`}/>}
                                                          key={`${key}-item-radio`}/>)}
          </RadioButtonGroup>
        break
      case 'select':
        element = <SelectField value={sectionValue} {...inputAttributes} floatingLabelText={label}>
          {section.list.map((item, key) => <MenuItem value={item.value}
                                                     primaryText={intl.formatMessage({id: item.label})}
                                                     key={`select-${item.value}`}/>)}
        </SelectField>
        break
      case 'checkbox':
        inputAttributes = {
          onCheck: (event, isInputChecked) => {
            this.updateUserHandler({key: section.key, value: isInputChecked})
          }
        }
        element = <Checkbox checked={isEnable} {...inputAttributes} {...{label}}/>
        break
      case 'toggle':

        inputAttributes = {
          onToggle: (event, payload) => {
            let value = payload
            if (section.key === 'gender') {
              value = payload ? 'man' : 'woman'
            }
            if (section.key === 'webPushNotificationsData') {
              return dispatch(SWActionCreators.setPushNotifications(payload)).then(({value}) => {
                this.updateUserHandler({key: section.key, value})
              })
            }
            this.updateUserHandler({key: section.key, value})
          }
        }

        if (section.key === 'webPushNotificationsData') {
          inputAttributes.disabled = !Notification || Notification.permission === 'denied'
        }

        element = <Toggle
          iconStyle={{
            fill: '#FF9800'
          }}
          defaultValue={true}
          toggled={isEnable}
          {...{label, icon}}
          {...inputAttributes}
          disabled={this.state.fetching}
        />
        break

      default:

        inputAttributes = {
          onChange: (event, payload) => {
            clearTimeout(this.updateTimeout)
            this.updateTimeout = setTimeout(() => {

              this.updateUserHandler({key: section.key, value: payload})
            }, 1500)
          }
        }

        element = <TextField underlineShow={true}
                             rows={section.rows}
                             autoComplete={section.autoComplete}
                             multiLine={section.multiLine}
                             disabled={section.disabled}
                             defaultValue={sectionValue}
                             name={`${section.key}-input`}
                             hintText={!section.multiLine && label}
                             fullWidth={section.multiLine}
                             pattern={section.pattern}
                             type={section.type.toLowerCase()}
                             floatingLabelText={label}
                             {...inputAttributes}/>
        break
    }

    return element
  }

  renderUserProfile () {
    const {
      props: {
        profile
      }
    } = this

    //GET SECTIONS
    const sections = userProfile.keys[profile]
    return (<div className="panel-profil" key={`${profile}-profile`}>
      <div className="pannel-header">
        <FormattedMessage
          id={ `account.profile.${profile}` }/>
      </div>
      <div className="row-fluid row-profil">
        {sections.map((section) => {
          return (<div className={`col-md-${section.col ? section.col : 6}`} key={`${section.key}-section`}>
              <div className="row-fluid">
                <div className="col-md-12 no-padding">
                  {this.renderFormElement(section)}
                </div>
              </div>
            </div>
          )

        })}
      </div>
    </div>)
  }

  render () {
    const {
      props: {
        User,
        col
      }
    } = this

    const user = User.get('user')
    if (!user) {
      return <div />
    }
    return (
      <div className={`account-details__container col-md-${col}`}>
        <form>
          {this.renderUserProfile()}
        </form>
      </div>
    )
  }
}

AccountProfil.propTypes = {
  profile: React.PropTypes.string.isRequired,
  col: React.PropTypes.number
}

AccountProfil.defaultProps = {
  col: 6
}


export default AccountProfil
