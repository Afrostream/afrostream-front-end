import React from 'react';
import { connect } from 'react-redux';
import {dict} from '../../../../config';
import Thumb from '../../components/Movies/Thumb';
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

  like(value) {
    const {
      props: {dispatch, videoId}
      } = this;
    dispatch(RecoActionCreators.likeVideoOrNot(value, videoId));
  }

  getLike() {
    const {
      props: {
        User,
        videoId
        }
      } = this;

    const videoData = User.get(`video/${videoId}`);

    const likeAttributes = {
      onClick: event => ::this.like(true)
    };
    const dislikeAttributes = {
      onClick: event => ::this.like(false)
    };
    let likeThis
    if (videoData) {
      likeThis = videoData.get('like');
    }
    if (likeThis === undefined) {
      return (
        <div className="reco-buttons">
          <button className="btn reco_button" type="button" data-toggle="tooltip"
                  data-placement="top"
                  title={dictReco.like} {...likeAttributes}>
            <i className="fa fa-thumbs-up"></i>
          </button>
          <button className="btn reco_button" type="button" data-toggle="tooltip"
                  data-placement="top"
                  title={dictReco.dislike}  {...dislikeAttributes}>
            <i className="fa fa-thumbs-down"></i>
          </button>
        </div>
      );
    }
    else {
      let likeClass = {
        'fa': true,
        'fa-thumbs-up': likeThis,
        'fa-thumbs-down': !likeThis
      };

      return (
        <div className="reco-buttons">
          <div className="btn reco_button active">
            <i className={classSet(likeClass)}></i>
          </div>
        </div>)
    }
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
          {this.getLike()}
          <div className="recommendation-list__label">{dictReco.labelTitle}</div>
          <div className="recommendation-list__info">{dictReco.labelPage}</div>
          <div className="recommendation-list__thumbs">
            { this.renderList() }
          </div>
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
