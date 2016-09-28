import React, { PropTypes, Component } from 'react'
if (process.env.BROWSER) {
  require('./LifeNavigation.less')
}
export default class LifeList extends Component {

  render () {
    const {
      props: {}
    } = this

    return (
      <ul className="life-navigation">
        <li ><a href="#">Vidéo</a></li>
        <li ><a href="#">Audio</a></li>
        <li ><a href="#">Actualité</a></li>
        <li ><a href="#">Exprérience</a></li>
        <li ><a href="#">Focus</a></li>
        <li ><a href="#">Prémium</a></li>
      </ul>
    )
  }
}
