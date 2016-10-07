import React from 'react'
import { connect } from 'react-redux'
import { getI18n } from '../../../../config/i18n'
import * as OAuthActionCreators from '../../actions/oauth'
import * as UserActionCreators from '../../actions/user'
import { Link } from 'react-router'
import config from '../../../../config'
import TextField from 'material-ui/TextField'
import Toggle from 'material-ui/Toggle'
import DatePicker from 'material-ui/DatePicker'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import Checkbox from 'material-ui/Checkbox'
import RaisedButton from 'material-ui/RaisedButton'

import areIntlLocalesSupported from 'intl-locales-supported'

import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'

let DateTimeFormat
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


  updateUserHandler (key, value) {
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
      .then(()=> {
        dispatch(UserActionCreators.getProfile())
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
    const hasFacebook = Boolean(user && user.get('facebook'))
    const label = getI18n().account.profile[section.key]
    const sectionValue = user.get(section.key) || ''
    const icon = section.icon || ''
    const isEnable = Boolean(sectionValue)
    let inputAttributes = {
      onChange: (event, key, payload) => {
        this.updateUserHandler(section.key, payload)
      }
    }

    let element

    switch (section.type) {
      case  'password':
        element = <Link to="/reset"><RaisedButton {...{label}} {...inputAttributes}/></Link>
        break
      case  'picture':
        inputAttributes = {
          onClick: (event) => this.syncFB()
        }
        element = <div className="row-fluid">
          <img className="img-responsive" {...inputAttributes} src={`${user.get('picture')}?type=large`}/>
          <RaisedButton {...{label}} {...inputAttributes} style={{
            marginTop: 20,
            minWidth: 200
          }} disabled={hasFacebook}/>
        </div>
        break
      case 'date':
        inputAttributes = {
          onChange: (event, date) => {
            this.updateUserHandler(section.key, date)
          }
        }
        let selectedDate = sectionValue && new Date(sectionValue)
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
            this.updateUserHandler(section.key, value)
          }
        }
        element =
          <RadioButtonGroup style={{display: 'flex'}}
                            {...inputAttributes}
                            name={section.key}
                            defaultSelected={section.defaultSelected}
                            valueSelected={sectionValue || section.defaultSelected}>
            {section.list.map((item, key) =><RadioButton style={{width: '30%'}} value={item.value}
                                                         label={ getI18n().account.profile[item.value]}
                                                         key={`${key}-item-radio`}/>)}
          </RadioButtonGroup>
        break
      case 'select':
        element = <SelectField value={sectionValue} {...inputAttributes} floatingLabelText={label}>
          {section.list.map((item, key) =><MenuItem value={item.value} primaryText={item.label}
                                                    key={item.value}/>)}
        </SelectField>
        break
      case 'checkbox':
        inputAttributes = {
          onCheck: (event, isInputChecked) => {
            this.updateUserHandler(section.key, isInputChecked)
          }
        }
        element = <Checkbox checked={sectionValue} {...inputAttributes} {...{label}}/>
        break
      case 'toggle':

        inputAttributes = {
          onToggle: (event, payload) => {
            let value = payload
            if (section.key === 'gender') {
              value = payload ? 'man' : 'woman'
            }
            this.updateUserHandler(section.key, value)
          }
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
            this.updateTimeout = setTimeout(()=> {

              this.updateUserHandler(section.key, payload)
            }, 1500)
          }
        }

        element = <TextField underlineShow={false}
                             autoComplete={section.autoComplete}
                             disabled={section.disabled}
                             defaultValue={sectionValue}
                             name={`${section.key}-input`}
                             hintText={label}
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
    const title = getI18n().account.profile[profile]
    const sections = userProfile.keys[profile]
    return (<div className="panel-profil" key={`${profile}-profile`}>
      <div className="pannel-header">{title}</div>
      <div className="row-fluid row-profil">
        {sections.map((section)=> {
          return (<div className={`col-md-${section.col ? section.col : 6}`} key={`${section.key}-section`}>
              <div className="row-fluid">
                <div className="col-md-12">
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
  col: 12
}


export default AccountProfil
