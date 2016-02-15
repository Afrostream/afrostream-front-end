import React from 'react';
import { connect } from 'react-redux';
import {dict} from '../../../../config';
import Thumb from '../../components/Movies/Thumb';
import NextGoBack from '../Player/NextGoBack';
import RateComponent from './RateComponent';
import classSet from 'classnames';
import * as RecoActionCreators from '../../actions/reco';
const dictReco = dict.recommendation;

if (process.env.BROWSER) {
  require('./RecommendationList.less');
}


@connect(({ User,Video }) => ({User, Video}))
class RecommendationList extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {
      props: {dispatch, videoId}
      } = this;

    dispatch(RecoActionCreators.getRecommendations('player', videoId));
  }

  renderLabel() {
    const {
      props: {
        Video,
        videoId
        }
      } = this;
    const video = Video.get(`videos/${videoId}`);
    const movie = video.get('movie');
    let type = 'serie';
    if (movie) {
      type = movie.get('type');
    }
    let labelMovie = '';
    switch (type) {
      case 'movie':
        labelMovie = dictReco.typeMovie;
        break;
      case 'serie':
        labelMovie = dictReco.typeSerie;
        break;
      default:
        labelMovie = dictReco.typeEpisode;
        break;
    }

    return dictReco.labelLike.replace('{movieType}', labelMovie);
  }

  renderList() {
    const {
      props: {
        User,
        videoId
        }
      } = this;

    const recoList = User.get(`reco/${videoId}`);

    if (!recoList) {
      return;
    }
    return recoList.map((data, i) => <Thumb favorite={false} share={false}
                                            key={`spot-home-${data.get('_id')}-${i}`} {...{data}}/>).toJS();
  }

  render() {
    const {
      props: {
        videoId
        }
      } = this;

    return (
      <div className="recommendation-list">
        <div className="recommendation-list__content">
          <div className="recommendation-list__label">{this.renderLabel()}</div>
          <RateComponent {...{videoId}}/>
          <div className="recommendation-list__label">{dictReco.labelPage}</div>
          <div className="recommendation-list__thumbs">
            { this.renderList() }
          </div>
          <NextGoBack />
        </div>
      </div>
    );
  }
}


RecommendationList.propTypes = {
  videoId: React.PropTypes.string
};

RecommendationList.defaultProps = {
  videoId: null
};


export default RecommendationList;
