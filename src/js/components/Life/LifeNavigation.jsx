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
        <li ><Link to="/life">Streaming</Link></li>
        <li ><Link href="/life">Actualité</Link></li>
        <li ><Link href="/life">Exprérience</Link></li>
      </ul>
    )
  }
}
