import React from 'react'
import { connect } from 'react-redux'
import { getI18n } from '../../../../config/i18n'
import Thumb from '../../components/Movies/Thumb'
import NextGoBack from '../Player/NextGoBack'
import RateComponent from './RateComponent'
import ShareButton from '../Share/ShareButton'
import * as RecoActionCreators from '../../actions/reco'

if (process.env.BROWSER) {
  require('./RecommendationList.less')
}


@connect(({User, Video}) => ({User, Video}))
class RecommendationList extends React.Component {

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
    const getI18nReco = getI18n().recommendation
    let type = 'serie'
    if (movie) {
      type = movie.get('type')
    }
    let labelMovie = ''
    switch (type) {
      case 'movie':
        labelMovie = getI18nReco.typeMovie
        break
      case 'serie':
        labelMovie = getI18nReco.typeSerie
        break
      default:
        labelMovie = getI18nReco.typeEpisode
        break
    }

    return getI18nReco.labelLike.replace('{movieType}', labelMovie)
  }

  renderList () {
    const {
      props: {
        User,
        videoId
      }
    } = this
    const recoList = User.get(`reco/${videoId}`)

    if (!recoList) {
      return
    }
    return recoList.map((data, i) => <Thumb favorite={false} share={false}
                                            key={`spot-reco-${data.get('_id')}-${i}`} {...{data}}/>).toJS()
  }

  render () {
    const {
      props: {
        videoId
      }
    } = this
    const getI18nReco = getI18n().recommendation

    return (
      <div className="recommendation-list">
        <div className="recommendation-list__content">
          <div className="recommendation-list__label">{getI18n().share.label}</div>
          <ShareButton/>
          <div className="recommendation-list__label">{this.renderLabel()}</div>
          <RateComponent {...{videoId}}/>
          <div className="recommendation-list__label">{getI18nReco.labelPage}</div>
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
