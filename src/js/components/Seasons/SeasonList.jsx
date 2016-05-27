import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import Spinner from '../Spinner/Spinner'
import SeasonTabButton from './SeasonTabButton'
import * as SeasonActionCreators from '../../actions/season'
import MoviesSlider from '../Movies/MoviesSlider'

if (process.env.BROWSER) {
  require('./SeasonList.less')
}

@connect(({Movie, Season}) => ({Movie, Season}))
class SeasonList extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {
    const {
      props: {
        Movie,
        Season,
        params:{
          movieId,
          seasonId
        }
      }
    } = this

    const seasons = Movie.get(`movies/${movieId}/seasons`)
    let page = Season.get('selected') || 0


    if (seasons && seasons.size) {
      if (seasonId) {
        page = seasons.findIndex((obj) => {
          return obj.get('_id') == seasonId
        })
      }
      if ((seasons.size - 1) < page) {
        page = 0
      }
      return (
        <div className="season-list">
          {this.parseSeasonTab(page, seasons)}
          {this.parseSeasonList(page, seasons)}
        </div>
      )

    } else {
      return (<div />)
    }
  }

  parseSeasonTab (page, seasons) {

    return (
      <div className="selection">
        {seasons ? seasons.map((season, i) => <SeasonTabButton
          key={`season-${season.get('_id')}-${i}`}
          active={page === i}
          index={i}
          {...this.props}
          {...{season}}
        />).toJS() : ''}
      </div>
    )
  }

  parseSeasonList (page, seasons) {
    const {
      props: {
        dispatch,
        Season,
        params:{
          episodeId
        }
      }
    } = this

    const selectedSeasonId = seasons.get(page).get('_id')
    const season = Season.get(`seasons/${selectedSeasonId}`)
    let selectedId = null

    if (!season && selectedSeasonId) {
      dispatch(SeasonActionCreators.getSeason(selectedSeasonId))
      return (<Spinner />)
    }


    const dataList = season.get('episodes')
    const thumbW = 200
    const thumbH = 110
    const type = 'episode'
    const load = true

    if (episodeId) {
      selectedId = episodeId
    }
    return (
      <MoviesSlider key="season-list" {...this.props} {...{dataList, thumbW, thumbH, selectedId, type, load}}/>
    )
  }
}

export default SeasonList
