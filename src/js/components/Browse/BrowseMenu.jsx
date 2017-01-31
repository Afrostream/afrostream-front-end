import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import SubNavigation from '../Header/SubNavigation'
import Immutable from 'immutable'
import { slugify } from '../../lib/utils'
if (process.env.BROWSER) {
  require('./BrowseMenu.less')
}

@connect(({User}) => ({User}))
class BrowseMenu extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {
    const {
      props: {
        User
      }
    } = this

    const user = User.get('user')

    const themesList = Immutable.fromJS([
      {
        label: 'menu.profil',
        slug: `life/community/${user && user.get('_id') + '/' + slugify(user.get('nickname'))}`
      },
      {
        label: 'menu.favoris',
        slug: 'favoris'
      },
      {
        label: 'menu.last',
        slug: 'last'
      },
      {
        label: 'menu.sponsorship',
        slug: 'parrainage'
      }
    ])
    if (!themesList) {
      return
    }

    return (
      <SubNavigation {...{themesList}} to="/{slug}"/>
    )
  }
}

export default BrowseMenu
