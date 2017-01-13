import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Headroom from 'react-headroom'
import UserButton from './../User/UserButton'
import SearchInput from './../Search/SearchBox'
import classSet from 'classnames'
import config from '../../../../config'
import { withRouter } from 'react-router'
import * as EventActionCreators from '../../actions/event'
import Breadcrumbs from './Breadcrumbs'
import _ from 'lodash'

const {apps} = config

if (process.env.BROWSER) {
  require('./Header.less')
}

@connect(({Event, User}) => ({Event, User}))
class Header extends React.Component {

  toggleSideBar () {
    const {
      props: {
        dispatch
      }
    } = this

    dispatch(EventActionCreators.toggleSideBar(false))
  }

  render () {

    const {
      props: {
        Event,
        User,
        router,
        routes,
        params:{
          videoId
        }
      }
    } = this

    const sideBarToggled = Event.get('sideBarToggled')
    const hiddenMode = !Event.get('userActive')
    const user = User.get('user')

    let excludedBreacrumbsRoutes = [
      'home',
      'player',
      'search',
      'lang',
      'themeId',
      'pinId',
      'movieId',
      'episodeId',
      'seasonId',
      'videoId',
      'categoryId',
      'lifeUserId',
      'planCode',
      'subscriptionBillingUuid'
    ]

    let planCode
    if (user) {
      planCode = user.get('planCode')
      excludedBreacrumbsRoutes.shift()
    }

    const isOnLife = router.isActive('life')
    const isOnPlayer = router.isActive('player') || _.find(routes, route => ( route.name === 'player')) || videoId

    let sliderClasses = {
      'topbar': true,
      'topbar-life': isOnLife,
      'topbar-hidden': hiddenMode && isOnPlayer && !sideBarToggled,
      'topbar-fixed-color': true
    }


    return (
      <Headroom disableInlineStyles>

        <header className={classSet(sliderClasses)}>
          <div dangerouslySetInnerHTML={{__html: '<!--googleoff: all-->'}}/>
          <nav className="float--left" role="navigation">
            <ul className="nav">
              <li>
                <button role="button" className="btn-home" onClick={::this.toggleSideBar}>
                  <i className="open-menu-icon zmdi zmdi-menu"/>
                  <img src={`/images/logo.png`} alt="afrostream-logo" className="logo"/>
                </button>
              </li>
              {user && <li>
                <SearchInput/>
              </li>}


            </ul>
          </nav>
          <nav className="float--left float-bottom-mobile" role="navigation">
            <Breadcrumbs
              {...this.context}
              {...this.props}
              excludes={excludedBreacrumbsRoutes}
              hideNoPath={true}
              displayMissing={false}
              setDocumentTitle={false}
              wrapperClass="nav breadcrumbs"
              itemClass="step"
              wrapperElement="ul"
              activeItemClass="active"
              itemElement="li"/>
          </nav>
          <nav className="float--right" role="navigation">
            <UserButton {...this.props}/>
          </nav>
          <div dangerouslySetInnerHTML={{__html: '<!--googleon: all-->'}}/>
        </header>
      </Headroom>
    )
  }
}

Header.propTypes = {
  location: React.PropTypes.object.isRequired,
  history: React.PropTypes.object.isRequired
}

Header.defaultProps = {}

export default withRouter(Header)
