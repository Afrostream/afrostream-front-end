'use strict';
import React, { Component,PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';

export default class LoadVideo extends Component {

  static propTypes = {
    movie: PropTypes.instanceOf(Immutable.Object),
    movieId: PropTypes.string
  };

  static contextTypes = {
    location: PropTypes.object.isRequired
  };

  static defaultProps = {
    movie: null,
    movieId: null
  };

  render() {
    return (
      <div {...this.props} />
    );
  }

  loadMovie() {
    const {
      props: {
        movie
        }
      } = this;

    let movieId = movie.get('_id');
    let movieSlug = movie.get('slug') || '';
    let link = `/${movieId}/${movieSlug}`;

    this.context.location.transitionTo(link)
  }

  getLink() {
    const {
      props: {
        movie,movieId,season,episode,Movie,User
        }
      } = this;
    const user = User ? User.get('user') : null;
    let planCode = user ? user.get('planCode') : null;
    const movieDataId = movieId ? movieId : movie.get('_id');
    const movieData = movie || Movie.get(`movies/${movieDataId}`);
    let type = movieData ? movieData.get('type') : '';
    let movieSlud = movieData ? movieData.get('slug') : '';
    let link = `/${movieDataId}/${movieSlud}`;
    let videoData = movieData.get('video');
    let videoId = planCode ? movieData.get('videoId') : null;
    //let videoId = movieData.get('videoId');
    if (type === 'serie') {
      //videoId = null;
      let curSeason = season;
      //if (!curSeason) {
      //  const seasons = movieData.get('seasons');
      //  curSeason = seasons ? seasons.get(0) : null;
      //}
      if (curSeason) {
        const seasonId = curSeason.get('_id');
        const seasonSlug = curSeason.get('slug');
        //TODO get last viewed episode
        let curEpisode = episode;
        //if (!curEpisode) {
        //  const episodes = curSeason.get('episodes');
        //  curEpisode = episodes ? episodes.get(0) : null;
        //}
        if (curEpisode) {
          const episodeId = curEpisode.get('_id');
          const episodeSlug = curEpisode.get('slug');
          link += `/${seasonId}/${seasonSlug}/${episodeId}/${episodeSlug}`;
          videoData = curEpisode.get('video');
          videoId = curEpisode.get('videoId');
        }
      }
    }
    else if (videoData) {
      videoId = videoId || videoData.get('_id');
    }
    link += `${videoId ? '/' + videoId : ''}`;
    return link;
  }

  //TODO Connect to last video or first video of season/video
  loadVideo(e) {
    if (e) {
      e.preventDefault();
    }
    let link = this.getLink();
    return this.context.location.transitionTo(link);
  }

}
