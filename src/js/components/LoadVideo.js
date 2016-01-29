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
        data,dataId,Movie,Season
        }
      } = this;

    let dataValue = data || Movie.get(`movies/${dataId}`);

    if (!dataValue) {
      return '';
    }

    let movieId = dataValue.get('_id');
    let movieSlug = dataValue.get('slug');
    let dataType = dataValue.get('type');

    let link = `/${movieId}/${movieSlug}`;
    let seasonId;
    let seasonSlug;
    let episodeId;
    let episodeSlug;

    let videoData = dataValue.get('video');
    let videoId = dataValue.get('videoId');

    if (dataType === 'serie') {
      videoId = null;
    }
    else if (dataType === 'episode') {
      seasonId = dataValue.get('seasonId');
      const season = Season.get(`seasons/${seasonId}`);//dataValue.get('season');
      if (season) {
        seasonId = season.get('_id');
        seasonSlug = season.get('slug');
        movieId = season.get('movieId');
        const movieData = Movie.get(`movies/${movieId}`);
        movieSlug = movieData.get('slug');
      }
      episodeId = dataValue.get('_id');
      episodeSlug = dataValue.get('slug');

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
