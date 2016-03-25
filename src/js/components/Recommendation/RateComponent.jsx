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
        videoId,
        defaultValue
        }
      } = this;

    const videoData = User.get(`video/${videoId}`);

    let rating = defaultValue;

    if (videoData) {
      rating = videoData.get('rating') || defaultValue;
    }

    return (
      <StarRating name="react-star-rating" totalStars={5} size={30} editing={!this.props.disabled}
                  disabled={this.props.disabled}
                  onRatingClick={::this.handleRatingClick}
                  rating={rating}/>
    );
  }
}

RateComponent.propTypes = {
  videoId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  disabled: PropTypes.bool,
  defaultValue: PropTypes.number
};

RateComponent.defaultProps = {
  videoId: null,
  disabled: false,
  defaultValue: 3
};

export default RateComponent;
