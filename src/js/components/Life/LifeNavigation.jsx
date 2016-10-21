import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import classSet from 'classnames'
import Headroom from 'react-headrooms'

if (process.env.BROWSER) {
  require('./LifeNavigation.less')
}
@connect(({Life}) => ({Life}))
export default class LifeNavigation extends Component {

  render () {
    const {
      props: {
        Life
      }
    } = this

    const themesList = Life.get('life/themes/')

    return (
      <Headroom tolerance={5} offset={200} classes={{
        initial: 'animated',
        pinned: 'slideDownSubHeader',
        unpinned: 'slideUpSubHeader'
      }}>
        <ul className="life-navigation">
          {themesList && themesList.map((theme, i)=> {
              return (<li key={`life-theme-${i}`}>
                <Link activeClassName="active"
                      to={`/life/${theme.get('_id')}/${theme.get('slug')}`}>{theme.get('label')}</Link>
              </li>)
            }
          )}
        </ul>
      </Headroom>
    )
  }
}
