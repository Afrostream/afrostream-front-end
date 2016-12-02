import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import classSet from 'classnames'
import SignUpButton from '../../User/SignUpButton'
import ReactImgix from '../../Image/ReactImgix'
import config from '../../../../../config'
import { Link }from '../../Utils'

const {life, images} =config
import { I18n } from '../../Utils'
import {
  injectIntl
} from 'react-intl'

if (process.env.BROWSER) {
  require('./WelcomeLife.less')
}

@connect(({}) => ({}))
class WelcomeLife extends I18n {

  constructor (props) {
    super(props)
  }

  render () {

    let welcomeClassesSet = {
      'welcome-life': true
    }

    let posterImg = `${images.urlPrefix}${life.welcome}?crop=faces&fit=clip&w=1280&q=${images.quality}&fm=${images.type}`

    return (
      <section className={classSet(welcomeClassesSet)}>
        <Link to="/life">
          <ReactImgix key="welcome-life" className="welcome-life_img" src={posterImg} bg={true}/>
          <ReactImgix src={`/images/logo-life.png`} alt="afrostream-logo" className="afrostream-logo"/>
          <div className="welcome-life_acroche">
            <div className="welcome-life_accroche">
              {this.getTitle('life.welcome.label').split('\n').map((statement, i) => {
                return (<span key={`statement-${i}`}>{statement}</span>)
              })}
            </div>
          </div>
          <SignUpButton key="welcome-pgm-signup" className="subscribe-button"
                        label="life.welcome.action"/>
        </Link>
      </section>
    )
  }
}

WelcomeLife.propTypes = {}

WelcomeLife.defaultProps = {}

export default injectIntl(WelcomeLife)
