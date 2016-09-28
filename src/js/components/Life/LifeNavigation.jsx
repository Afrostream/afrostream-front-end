import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'

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
        <li ><Link to="/life">Vidéo</Link></li>
        <li ><Link href="/life">Audio</Link></li>
        <li ><Link href="/life">Actualité</Link></li>
        <li ><Link href="/life">Exprérience</Link></li>
        <li ><Link href="/life">Focus</Link></li>
        <li ><Link href="/life">Prémium</Link></li>
      </ul>
    )
  }
}
