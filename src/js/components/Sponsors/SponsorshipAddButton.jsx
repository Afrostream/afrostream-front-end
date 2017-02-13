import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import classSet from 'classnames'
import { Link, I18n } from '../Utils'
import ReactTooltip from 'react-tooltip'
import {
  injectIntl
} from 'react-intl'

if (process.env.BROWSER) {
  require('./SponsorshipAddButton.less')
}

@connect(({User}) => ({User}))
class SponsorshipAddButton extends I18n {

  constructor (props) {
    super(props)
  }


  componentDidUpdate () {
    ReactTooltip.rebuild()
  }


  render () {

    const {
      props: {
        showLabel
      }
    } = this

    let sponsorshipClass = {
      'zmdi': true,
      'zmdi-star': true
    }

    const titleLabel = this.getTitle(`sponsorship.add`)

    return (
      <Link to="/parrainage" className="btn sponsorship-add_button" type="button"
            data-tip={titleLabel}
            data-place={this.props.direction}
            data-for={`sponsor`}>
        <i className={classSet(sponsorshipClass)}></i>
        {showLabel && <span className="btn-label">{titleLabel}</span>}
        <ReactTooltip id={`sponsor`} className="fav-tooltip" type="dark"
                      effect="solid"/>
      </Link>
    )
  }
}


SponsorshipAddButton.propTypes = {
  direction: PropTypes.string,
  showLabel: PropTypes.bool
}

SponsorshipAddButton.defaultProps = {
  direction: 'top',
  showLabel: true
}

export default injectIntl(SponsorshipAddButton)
