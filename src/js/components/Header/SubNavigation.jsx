import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import classSet from 'classnames'
import Headroom from 'react-headrooms'
import Immutable from 'immutable'

if (process.env.BROWSER) {
  require('./SubNavigation.less')
}

class SubNavigation extends Component {

  render () {
    const {
      props: {
        themesList,
        to
      }
    } = this

    return (
      <Headroom tolerance={5} offset={200} classes={{
        initial: 'animated',
        pinned: 'slideDownSubHeader',
        unpinned: 'slideUpSubHeader'
      }}>
        <ul className="sub-navigation">
          {themesList && themesList.map((theme, i)=> {

              let mapTo = to
              mapTo = mapTo.replace(/{_id}/g, theme.get('_id'))
              mapTo = mapTo.replace(/{slug}/g, theme.get('slug'))

              return (<li key={`theme-${i}`}>
                <Link activeClassName="active"
                      to={mapTo}>{theme.get('label')}</Link>
              </li>)
            }
          )}
        </ul>
      </Headroom>
    )
  }
}


SubNavigation.propTypes = {
  themesList: PropTypes.instanceOf(Immutable.List).isRequired,
  to: PropTypes.string.isRequired,
}

SubNavigation.defaultProps = {}


export default SubNavigation
