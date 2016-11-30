import React, { PropTypes, Component } from 'react'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'

if (process.env.BROWSER) {
  require('./CsaIcon.less')
}

let csaList

if (canUseDOM) {
  csaList = [
    require('../../../assets/images/csa/age10_tablet.png'),
    require('../../../assets/images/csa/age12_tablet.png'),
    require('../../../assets/images/csa/age16_tablet.png'),
    require('../../../assets/images/csa/age18_tablet.png')
  ]
}

class CsaIcon extends Component {


  render () {
    const {
      props: {csa}
    } = this

    if (csa < 2) {
      return (<div />)
    }

    let icon = csaList && csaList[csa - 2]

    return (
      <div className="csa-icon">
        <img src={icon}/>
      </div>
    )
  }
}

CsaIcon.propTypes = {
  csa: React.PropTypes.number
}

CsaIcon.defaultProps = {
  csa: 0
}

export default CsaIcon
