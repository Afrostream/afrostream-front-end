import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import classSet from 'classnames'
import { connect } from 'react-redux'
import * as ModalActionCreators from '../../actions/modal'
import * as OAuthActionCreators from '../../actions/oauth'
import * as EventActionCreators from '../../actions/event'
import * as LifeActionCreators from '../../actions/life'
import { Link } from '../Utils'
import { slugify } from '../../lib/utils'
import ReactImgix from '../Image/ReactImgix'
import { I18n } from '../Utils'
import ReactTooltip from 'react-tooltip'

import {
  injectIntl
} from 'react-intl'

if (process.env.BROWSER) {
  require('./AvatarCard.less')
}

@connect(({User, Life}) => ({User, Life}))
class AvatarCard extends I18n {

  onError (e) {
    e.target.src = require('../../../assets/images/default/134x200.jpg')
  }

  componentDidUpdate () {
    ReactTooltip.rebuild()
  }

  isFollowed () {
    const {
      props: {
        Life,
        User,
        user,
        params
      }
    } = this

    const globalUser = User.get('user')
    const pinnedUserId = user.get('_id')
    const lifeUserId = globalUser && globalUser.get('_id')
    const followedUsers = lifeUserId && Life.get(`life/users/${lifeUserId}/followedUsers`)
    const followedUser = followedUsers && followedUsers.find((follow) => follow.get('followUserId') == pinnedUserId)
    const followed = followedUser && followedUser.get('follow')
    return followed
  }

  followUser () {
    const {
      props: {
        dispatch,
        User,
        user
      }
    } = this

    const globalUser = User.get('user')
    const followed = this.isFollowed()

    if (globalUser) {
      return dispatch(LifeActionCreators.followUser({data: user, follow: !followed}))
    }
    dispatch(ModalActionCreators.open({target: 'showSignup'}))
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

  render () {
    const {
      props: {
        user,
        User,
        bio,
        upload,
        params
      }
    } = this

    const imageUrl = user.get('picture')

    const pins = user.get('lifePins')
    const pinscount = user.get('pinscount')

    const gloBalUser = User.get('user')

    const id = user.get('_id')


    const isCurrentUser = gloBalUser && gloBalUser.get('_id') === id
    const nickName = user && user.get('nickname') && `${user.get('nickname')}` || ''
    const userBio = bio && user.get('biography')

    const canUpload = upload || isCurrentUser
    const canFollow = !isCurrentUser && params.lifeUserId
    const followed = this.isFollowed()
    const followers = user && user.get('followers') || 0

    const avatarClass = {
      'avatar': true,
      'avatar-upload': canUpload,
      'avatar-follow': canFollow,
      'followed': followed
    }

    const propsTo = {
      to: `/life/community/${id}/${slugify(nickName)}`,
      onClick: () => {
        if (canUpload) {
          this.syncFB()
        }
        if (canFollow) {
          this.followUser()
        }
      }
    }

    const titleLabel = canFollow && this.getTitle(`life.users.${(canUpload && 'upload') || (followed ? 'unfollow' : 'follow')}`, {nickName}) || ''

    return (
      <div className={`row row-centered ${this.props.className}`}>
        <Link {...propsTo} className="col-centered col-md-4">
          <div className={classSet(avatarClass)}
               data-tip={titleLabel}
               data-place={'bottom'}
               data-for={`user-tip`}>
            {imageUrl && <ReactImgix className="avatar-card__background_image" src={`${imageUrl}?type=large`} bg={true}
                                     onError={this.onError} alt="user-avatar"/>}
          </div>
          <ReactTooltip id={`user-tip`} type="dark"
                        effect="solid"/>
        </Link>
        <div className="content col-centered col-md-8">
          <div className="row">
            {nickName &&
            <div className="col-md-12">
              <div className="nickname">
                {nickName}
              </div>
              <div>
                {canFollow && <Link {...propsTo} role="button" className="btn btn-follow_button"
                                    onClick={::this.followUser}>{titleLabel}</Link>}
              </div>
            </div>}
            <div className="col-md-12">
              {((pins && pins.size > 0) || (pinscount && pinscount > 0)) && <span>
                <b>{pins.size.toString()}</b>
                {this.getTitle('life.sticky.nbpost')}
              </span> || ''}
              {followers && followers > 0 && <span>
                <b>{followers.toString()}</b>
                {this.getTitle('life.sticky.nbfollowers')}
              </span> || ''}
            </div>
            <div className="col-md-12">
              {userBio && <div className="user-bio">{userBio}</div>}
            </div>
          </div>
        </div>
      </div>
    )
  }

}

AvatarCard.propTypes = {
  user: PropTypes.instanceOf(Immutable.Map),
  bio: PropTypes.bool,
  upload: PropTypes.bool,
  className: PropTypes.string
}

AvatarCard.defaultProps = {
  user: null,
  bio: false,
  upload: false,
  className: 'avatar-card'
}

export default injectIntl(AvatarCard)
