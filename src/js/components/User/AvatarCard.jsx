import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import classSet from 'classnames'
import { connect } from 'react-redux'
import * as ModalActionCreators from '../../actions/modal'
import * as OAuthActionCreators from '../../actions/oauth'
import * as EventActionCreators from '../../actions/event'
import { Link } from '../Utils'
import { slugify } from '../../lib/utils'
import ReactImgix from '../Image/ReactImgix'
import { I18n } from '../Utils'

import {
  injectIntl
} from 'react-intl'

if (process.env.BROWSER) {
  require('./AvatarCard.less')
}

@connect(({User}) => ({User}))
class AvatarCard extends I18n {

  onError (e) {
    e.target.src = require('../../../assets/images/default/134x200.jpg')
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
        upload
      }
    } = this

    const imageUrl = user.get('picture')

    const pins = user.get('lifePins')

    const gloBalUser = User.get('user')

    const nickName = user.get('nickname')
    const id = user.get('_id')

    const propsTo = {
      to: `/life/community/${id}/${slugify(nickName)}`,
      onClick: () => {
        if (isCurrentUser) {
          this.syncFB()
        }
      }
    }

    const isCurrentUser = gloBalUser && gloBalUser.get('_id') === id

    const avatarClass = {
      'avatar': true,
      'avatar-upload': upload || isCurrentUser
    }

    return (
      <div className={this.props.className}>
        <Link {...propsTo}>
          <div className={classSet(avatarClass)}>
            {imageUrl && <ReactImgix className="avatar-card__background_image" src={`${imageUrl}?type=large`} bg={true}
                                     onError={this.onError} alt="user-avatar"/>}
          </div>
          <div className="content">
            <p>{user.get('nickname')}</p>
            {pins && <p>{this.getTitle('life.sticky.nbpost', {pins: pins.size})}</p>}
          </div>
        </Link>
      </div>
    )
  }

}

AvatarCard.propTypes = {
  user: PropTypes.instanceOf(Immutable.Map),
  upload: PropTypes.bool,
  className: PropTypes.string
}

AvatarCard.defaultProps = {
  user: null,
  upload: false,
  className: 'avatar-card'
}

export default injectIntl(AvatarCard)
