import React, { PropTypes } from 'react'
import { Link } from 'react-router'

if (process.env.BROWSER) {
  require('./FavoritesButton.less')
}

class FavoritesButton extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <Link className="btn-xs btn-favorites" to="/favoris" role="button"><span>Mes Favoris </span><i
        className="zmdi zmdi-playlist-plus"></i></Link>)
  }
}

export default FavoritesButton
