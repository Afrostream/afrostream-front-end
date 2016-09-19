import React from 'react'
import { connect } from 'react-redux'
import { getI18n } from '../../../../config/i18n'
import SwitchButton from '../SwitchButton/SwitchButton'
import * as UserActionCreators from '../../actions/user'
import config from '../../../../config'
import _ from 'lodash'

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


  synchroniseHandler ({data}) {
    const {
      props: {
        dispatch
      }
    } = this

    this.setState({
      fetching: true
    })

    dispatch(UserActionCreators.updateUserProfile(data))
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

    const sectionValue = user.get(section.key)
    const isEnable = Boolean(sectionValue)
    const checkLabel = getI18n().account.profile[isEnable ? 'off' : 'on']
    const eventObj = {}
    const inputAttributes = {
      onChange: event => ::this.synchroniseHandler(eventObj)
    }

    let element

    switch (section.type) {
      case 'Date':
        element = <input type="date"/>
        break
      case 'Boolean':
        element = <SwitchButton
          label={checkLabel}
          name={`${section.key}-synchro_check`}
          checked={isEnable}
          {...inputAttributes}
          disabled={this.state.fetching}
        />
        break
      default:
        element = <input type="text"/>
        break
    }

    return element
  }

  renderUserProfile () {
    //GET SECTIONS
    return _.map(userProfile.keys, (sections, key)=> {
      console.log(key)
      let title = getI18n().account.profile[key]

      return (<div className="row row-provider" key={`${key}-profile`}>
        <h3>{title}</h3>
        {sections.map((section)=> {
          title = getI18n().account.profile[section.key]


          return (<div className="col-md-4">
              <div className="row row-provider" key={`${section.key}-ection`}>
                <div className="col-md-6" dangerouslySetInnerHTML={{__html: title}}/>
                <div className="col-md-4">
                  {this.renderFormElement(section)}
                </div>
              </div>
            </div>
          )

        })}

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
