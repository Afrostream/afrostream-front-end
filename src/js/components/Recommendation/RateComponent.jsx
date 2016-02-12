import React ,{ PropTypes } from 'react';
import { connect } from 'react-redux';
import StarRating from 'react-star-rating';
import * as RecoActionCreators from '../../actions/reco';
if (process.env.BROWSER) {
  require('./RateComponent.less');
}

@connect(({ User }) => ({User}))
class RateComponent extends React.Component {

  constructor(props) {
    super(props);
  }

  handleRatingClick(e, data) {
    const {
      props: {dispatch, videoId}
      } = this;
    dispatch(RecoActionCreators.rateVideo(data.rating, videoId));
  }

  render() {
    const {
      props: {
        User,
        videoId
        }
      } = this;

    const videoData = User.get(`video/${videoId}`);

    let likeThis = 3;
    if (videoData) {
      likeThis = videoData.get('like');
    }
    return (
      <StarRating name="react-star-rating" totalStars={5} size={30} editing onRatingClick={::this.handleRatingClick}
                  rating={likeThis}/>
    );
  }
}

RateComponent.propTypes = {
  videoId: PropTypes.string
};

RateComponent.defaultProps = {
  videoId: null
};

export default RateComponent;
