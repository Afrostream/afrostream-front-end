'use strict';
import React, { Component,PropTypes } from 'react';
import Immutable from 'immutable';

export default class LoadVideo extends Component {

  static propTypes = {
    data: PropTypes.instanceOf(Immutable.Map),
    dataId: PropTypes.string
  };

  static contextTypes = {
    history: PropTypes.object.isRequired
  };

  static defaultProps = {
    data: null,
    dataId: null
  };

  render() {
    return (
      <div {...this.props} />
    );
  }

  loadMovie() {
    const {
      context: { location},
      props: {
        data
        }
      } = this;

    let dataId = data.get('_id');
    let dataSlug = data.get('slug') || '';
    let link = `/${dataId}/${dataSlug}`;

    location.pushState(null, link);
  }

  getLink() {
    const {
      props: {
        data,Movie,User
        }
      } = this;

    if (!data) {
      return '';
    }

    const user = User ? User.get('user') : null;
    const planCode = user ? user.get('planCode') : null;
    let movieId = data.get('_id');
    let movieSlug = data.get('slug');
    let dataType = data.get('type');

    let link = `/${movieId}/${movieSlug}/`;
    let seasonId;
    let seasonSlug;
    let episodeId;
    let episodeSlug;

    let videoData = data.get('video');
    let videoId = planCode ? data.get('videoId') : null;

    if (dataType === 'episode') {
      let season = data.get('season');
      if (season) {
        seasonId = season.get('_id');
        seasonSlug = season.get('slug');
        movieId = season.get('movieId');
        const movieData = Movie.get(`movies/${movieId}`);
        movieSlug = movieData.get('slug');
      }
      episodeId = data.get('_id');
      episodeSlug = data.get('slug');

      link = `/${movieId}/${movieSlug}/${seasonId}/${seasonSlug}/${episodeId}/${episodeSlug}`;
    }
    else if (videoData) {
      videoId = videoId || videoData.get('_id');
    }
    link += `${videoId ? '/' + videoId : ''}`;
    return link;
  }

  //TODO Connect to last video or first video of season/video
  loadVideo(e) {
    const {
      context: { history }
      } = this;
    if (e) {
      e.preventDefault();
    }
    let link = this.getLink();
    return history.pushState(null, link);
  }

}
