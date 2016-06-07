import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import _ from 'lodash'

if (process.env.BROWSER) {
  require('./BrowseMenu.less')
}

@connect(({Category}) => ({Category}))
class BrowseMenu extends React.Component {

  constructor (props) {
    super(props)
  }

  componentDidMount () {
    $('.dropdown').hover(
      ()=> {
        $('.dropdown-menu', this).fadeIn('fast')
      },
      () => {
        $('.dropdown-menu', this).fadeOut('fast')
      })
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

    const jsCat = categories.toJS()
    const splitSize = 5
    const colSize = Math.floor(9 / (jsCat.length / splitSize))

    return _.chunk(jsCat, splitSize).map((splitedCategorie, key) => <li key={`menu-${key}`}
                                                                        className={`mega-menu-column col-md-${colSize} col-xs-6`}>
      <ul>
        {_.map(splitedCategorie, (categorie)=>
          <li
            key={`menu-${categorie._id}`}>
            <Link to={`/browse/genre/${categorie._id}/${categorie.slug}`}>
              {categorie.label}
            </Link>
          </li>
        )}
      </ul>
    </li>)
  }

  render () {
    return (
      <ul className="dropdown-menu mega-menu row-fluid">
        <li className="mega-menu-column col-md-3 col-xs-6">
          <ul>
            <li><Link to="/">Accueil <i className="fa fa-home"/></Link></li>
            <li><Link to="/favoris">Mes Favoris <i className="zmdi zmdi-favorite"/></Link></li>
            <li><Link to="/last">Derniers ajouts</Link></li>
            <li><Link to="/compte">Mon compte</Link></li>
          </ul>
        </li>
        {this.renderCategories()}
      </ul>
    )
  }
}

export default BrowseMenu
