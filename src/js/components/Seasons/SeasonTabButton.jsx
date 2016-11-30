import React, { Component, PropTypes } from 'react'
import Immutable from 'immutable'

import { connect } from 'react-redux'
import classSet from 'classnames'
import * as SeasonActionCreators from '../../actions/season'
import { Link } from '../Utils'

@connect(({Season}) => ({Season}))
class SeasonTabButton extends Component {

  static propTypes = {
    active: React.PropTypes.bool.isRequired,
    index: React.PropTypes.number.isRequired,
    season: PropTypes.instanceOf(Immutable.Map),
  }

  render () {
    const {
      props: {
        active, index, season,
        params:{
          movieId,
          movieSlug
        }
      }
    } = this

    const classes = classSet({
      'season': true,
      'season--active': active
    })

    const seasonId = season.get('_id')
    const seasonSlug = season.get('slug')
    const seasonNumber = season.get('seasonNumber')
    const shortTitle = season.get('shortTitle')

    //:movieId(/:movieSlug)(/:seasonId)(/:seasonSlug)(/:episodeId)(/:episodeSlug)
    return (
      <Link className={classes}
            to={`/${movieId}/${movieSlug}/${seasonId}/${seasonSlug}`}>{shortTitle ? shortTitle : ('SAISON ' + seasonNumber)}</Link>
    )
  }

  toggleSeason () {
    const {
      props: {
        dispatch
      }
    } = this

    dispatch(SeasonActionCreators.toggleSeason(this.props.index))
  }
}

export default SeasonTabButton
