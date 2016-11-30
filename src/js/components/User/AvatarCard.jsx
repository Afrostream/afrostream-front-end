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

if (process.env.BROWSER) {
  require('./AvatarCard.less')
}

@connect(({User}) => ({User}))
class AvatarCard extends React.Component {

  onError (e) {
    e.target.src = require('../../../assets/images/default/134x200.jpg')
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
      to: `/life/community/${id}/${slugify(nickName)}`
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
            {pins && <p>{`Nombre de posts : ${pins.size}`}</p>}
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

export default AvatarCard
