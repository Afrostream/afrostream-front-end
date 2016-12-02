import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import classSet from 'classnames'
import SignUpButton from '../../User/SignUpButton'
import ReactImgix from '../../Image/ReactImgix'
import config from '../../../../../config'
import { Link }from '../../Utils'

const {images} =config
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

    let posterImg = `${images.urlPrefix}${this.props.imageUrl}?crop=faces&fit=clip&w=1280&q=${images.quality}&fm=${images.type}&txt=©DR&txtclr=fff&txtsize=10&markalpha=70&txtalign=bottom,left`

    return (
      <section className={classSet(welcomeClassesSet)}>
        <Link to="/life">
          <ReactImgix key="welcome-life" className="welcome-life_img" src={posterImg} bg={true}>
            <div className="afrostream-life__mask"/>
          </ReactImgix>
          <ReactImgix src={`/images/logo-life.png`} alt="afrostream-logo" className="afrostream-logo"/>
          <div className="welcome-life_acroche">
            <div className="welcome-life_accroche">
              {this.getTitle(this.props.title).split('\n').map((statement, i) => {
                return (<span key={`statement-${i}`}>{statement}</span>)
              })}
            </div>
          </div>
          <SignUpButton key="welcome-pgm-signup" className="subscribe-button"
                        label={this.props.action}/>
        </Link>
      </section>
    )
  }
}

WelcomeLife.propTypes = {
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired
}

WelcomeLife.defaultProps = {}

export default injectIntl(WelcomeLife)
