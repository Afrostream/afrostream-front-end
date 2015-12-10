'use strict';
import React, { Component,PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';

export default class LoadVideo extends Component {

  static propTypes = {
    movie: PropTypes.instanceOf(Immutable.Object),
    movieId: PropTypes.string,
    load: PropTypes.bool,
    movieId: PropTypes.string
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static defaultProps = {
    movie: null,
    movieId: null,
    load: true
  };

  loadMovie() {
    const {
      props: {
        movie
        }
      } = this;

    let movieId = movie.get('_id');
    let movieSlug = movie.get('slug') || '';
    let link = `/${movieId}/${movieSlug}`;

    this.context.router.transitionTo(link)
  }

  //TODO Connect to last video or first video of season/video
  loadVideo(e) {
    if (e) {
      e.preventDefault();
    }
    const {
      props: {
        movie,movieId,season,episode,load,Movie
        }
      } = this;

    const movieDataId = movieId ? movieId : movie.get('_id');
    const movieData = movie || Movie.get(`movies/${movieDataId}`);
    let type = movieData ? movieData.get('type') : '';
    let movieSlud = movieData ? movieData.get('slug') : '';
    let link = `/${movieDataId}/${movieSlud}`;
    let videoData = movieData.get('video');
    let videoId = movieData.get('videoId');
    if (type === 'serie') {
      videoId = null;
      let curSeason = season;
      //if (!curSeason) {
      //  const seasons = movieData.get('seasons');
      //  curSeason = seasons ? seasons.get(0) : null;
      //}
      if (curSeason && load) {
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
      videoId = videoId = videoData.get('_id');
    }
    link += `${videoId ? '/' + videoId : ''}`;
    return this.context.router.transitionTo(link);
  }

}
