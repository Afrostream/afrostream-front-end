import React from 'react'
import { connect } from 'react-redux'
import Thumb from '../../components/Movies/Thumb'
import NextGoBack from '../Player/NextGoBack'
import RateComponent from './RateComponent'
import ShareButton from '../Share/ShareButton'
import * as RecoActionCreators from '../../actions/reco'
import { I18n } from '../Utils'

if (process.env.BROWSER) {
  require('./RecommendationList.less')
}


@connect(({User, Video}) => ({User, Video}))
class RecommendationList extends I18n {

  constructor (props) {
    super(props)
  }

  componentDidMount () {
    const {
      props: {dispatch, videoId}
    } = this

    dispatch(RecoActionCreators.getRecommendations('player', videoId))
  }

  renderLabel () {
    const {
      props: {
        Video,
        videoId
      }
    } = this
    const video = Video.get(`videos/${videoId}`)
    const movie = video.get('movie')
    let type = 'serie'
    if (movie) {
      type = movie.get('type')
    }
    let labelMovie = ''
    switch (type) {
      case 'movie':
        labelMovie = this.getTitle('recommendation.typeMovie')
        break
      case 'serie':
        labelMovie = this.getTitle('recommendation.typeSerie')
        break
      default:
        labelMovie = this.getTitle('recommendation.typeEpisode')
        break
    }

    return this.getTitle('recommendation.labelLike', {movieType: labelMovie})
  }

  renderList () {
    const {
      props: {
        User,
        videoId
      }
    } = this
    const recoList = User.get(`reco/${videoId}`)

    if (!recoList || !recoList.size) {
      return
    }
    return recoList.map((data, i) => {
      return <Thumb favorite={false} share={false}
                    key={`spot-reco-${data.get('_id')}-${i}`} {...{data}}/>
    })
  }

  render () {
    const {
      props: {
        videoId
      }
    } = this

    return (
      <div className="recommendation-list">
        <div className="recommendation-list__content">
          <div className="recommendation-list__label">{this.getTitle('share.label')}</div>
          <ShareButton/>
          <div className="recommendation-list__label">{this.renderLabel()}</div>
          <RateComponent {...{videoId}}/>
          <div className="recommendation-list__label">{this.getTitle('recommendation.labelPage')}</div>
          <div className="recommendation-list__thumbs">
            { this.renderList() }
          </div>
          <NextGoBack />
        </div>
      </div>
    )
  }
}


RecommendationList.propTypes = {
  videoId: React.PropTypes.string
}

RecommendationList.defaultProps = {
  videoId: null
}


export default RecommendationList
