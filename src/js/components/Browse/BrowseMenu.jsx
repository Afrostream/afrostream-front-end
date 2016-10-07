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
        <li><Link to="/"><i className="zmdi zmdi-home"/>Accueil</Link></li>
        <li><Link to="/favoris"><i className="zmdi zmdi-favorite"/>Mes Favoris</Link></li>
        <li><Link to="/last"><i className="zmdi zmdi-movie"/>Derniers ajouts</Link></li>
        <li role="separator" className="divider"></li>
        {this.renderCategories()}
      </ul>
    )
  }
}

export default BrowseMenu
