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


@connect(({ User }) => ({User}))
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

    return (
      <div className="recommendation-list">
        <div className="recommendation-list__content">
          <div className="recommendation-list__label">{dictReco.labelLike}</div>
          <RateComponent />
          <div className="recommendation-list__label">{dictReco.labelTitle}</div>
          <div className="recommendation-list__info">{dictReco.labelPage}</div>
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
