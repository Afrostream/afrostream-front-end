import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

if (process.env.BROWSER) {
  require('./BrowseMenu.less')
}

@connect(({Category}) => ({Category}))
class BrowseMenu extends React.Component {

  constructor (props) {
    super(props)
  }

  renderCategories () {
    const {
      props: {
        Category
      }
    } = this

    const categories = Category.get('menu')
    if (!categories) {
      return
    }
    return categories.map((categorie, key) =>(<li key={`menu-${categorie.get('_id')}`}><Link
      to={`/browse/genre/${categorie.get('_id')}/${categorie.get('slug')}`}>
      {categorie.get('label')}
    </Link></li>)).toJS()
  }

  render () {
    return (
      <ul className="sidebar-nav scrollable">
        {this.renderCategories()}
      </ul>
    )
  }
}

export default BrowseMenu
