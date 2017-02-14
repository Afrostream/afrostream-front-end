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

import {
  injectIntl
} from 'react-intl'
import ReactTooltip from 'react-tooltip'

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
        user
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
        upload
      }
    } = this

    const imageUrl = user.get('picture')

    const pins = user.get('lifePins')

    const gloBalUser = User.get('user')

    const nickName = user.get('nickname')
    const id = user.get('_id')


    const isCurrentUser = gloBalUser && gloBalUser.get('_id') === id
    const userName = user && user.get('nickname')
    const userBio = bio && user.get('biography')

    const canUpload = upload || isCurrentUser
    const canFollow = !isCurrentUser
    const followed = this.isFollowed()

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

    const titleLabel = this.getTitle(`life.users.${(canUpload && 'upload') || (canFollow && (followed ? 'unfollow' : 'follow'))}`, {userName})

    return (
      <div className={this.props.className}>
        <Link {...propsTo}>
          <div className={classSet(avatarClass)}
               data-tip={titleLabel}
               data-place={'bottom'}
               data-for={`user-tip`}>
            {imageUrl && <ReactImgix className="avatar-card__background_image" src={`${imageUrl}?type=large`} bg={true}
                                     onError={this.onError} alt="user-avatar"/>}
          </div>
          <ReactTooltip id={`user-tip`} type="dark"
                        effect="solid"/>
          <div className="content">
            <p>{user.get('nickname')}</p>
            {pins && <p>{this.getTitle('life.sticky.nbpost', {pins: pins.size.toString()})}</p>}
            {<p>{this.getTitle('life.sticky.nbfollowers', {followers: user.get('followers').toString()})}</p>}
            {userBio && <p className="user-bio">{userBio}</p>}
          </div>
        </Link>
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
