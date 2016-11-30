import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import SubNavigation from '../Header/SubNavigation'

if (process.env.BROWSER) {
  require('./BrowseMenu.less')
}

@connect(({Category}) => ({Category}))
class BrowseMenu extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {
    const {
      props: {
        Category
      }
    } = this

    const themesList = Category.get('menu')
    if (!themesList) {
      return
    }

    return (
      <SubNavigation {...{themesList}} to="/category/{_id}/{slug}"/>
    )
  }
}

export default BrowseMenu
