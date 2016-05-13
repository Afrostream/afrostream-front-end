import React ,{ PropTypes } from 'react';
import Immutable from 'immutable';
import {dict,images} from '../../../../config';
import classSet from 'classnames';
import Thumb from '../../components/Movies/Thumb';
import NextGoBack from './NextGoBack';
import RateComponent from '../Recommendation/RateComponent';
import ShareButton from '../Share/ShareButton';
const dictNext = dict().next;
if (process.env.BROWSER) {
  require('./NextEpisode.less');
}


class NextEpisode extends React.Component {

  constructor(props) {
    super(props);
  }

  getLazyImageUrl(type = 'poster') {
    const {
      props: { episode }
      } = this;

    let imgData = episode.get(type);
    if (!imgData) {
      return;
    }

    let imgix = imgData.get('imgix');
    if (!imgix) {
      return;
    }

    let imageStyles = `${imgix}?crop=faces&fit=crop&w=800&h=600&q=40&fm=${images.type}`;
    return {backgroundImage: `url(${imageStyles})`};
  }

  render() {
    const {
      props: { episode, videoId }
      } = this;
    let imageStyles = this.getLazyImageUrl('thumb');
    let data = episode;
    let dataId = episode.get('_id');
    return (
      <div className="next-episode">
        <div className="next-episode__background" style={imageStyles}/>
        <div className="next-episode__content">
          <div className="next-episode__label">{dict().share.label}</div>
          <ShareButton />
          <div className="next-episode__label">{dictNext.labelLike}</div>
          <RateComponent {...{videoId}}/>
          {this.props.auto ? <div
            className="next-episode__label">{`${dictNext.label.replace('{seconds}', this.props.time)}`}</div> : '' }
          <div className="next-episode__thumbs">
            <Thumb {...{dataId, data}} favorite={false} share={false} thumbW={240} thumbH={135} type="episode"/>
          </div>
          <NextGoBack />
        </div>
      </div>
    );
  }
}


NextEpisode.propTypes = {
  episode: PropTypes.instanceOf(Immutable.Map),
  videoId: PropTypes.string,
  time: PropTypes.number,
  auto: PropTypes.bool
};

NextEpisode.defaultProps = {
  episode: null,
  videoId: null,
  time: 0,
  auto: false
};

export default NextEpisode;
