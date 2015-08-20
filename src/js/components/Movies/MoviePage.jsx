import React from 'react';
import { prepareRoute } from '../../decorators';
import * as MovieActionCreators from '../../actions/movie';
import MovieInfo from './MovieInfo';
import SeasonList from '../Seasons/SeasonList';

@prepareRoute(async function ({ store, params: { type, movieId } }) {
  return await * [
      store.dispatch(MovieActionCreators.getMovie(movieId)),
      store.dispatch(MovieActionCreators.getSeason(movieId))
    ];
}) class MoviePage extends React.Component {

  render() {
    const {
      props: {
        params: { movieId }
        }
      } = this;

    return (
      <div className="row-fluid row-table">
        {movieId ? <MovieInfo maxLength="600" active="true" {...{movieId}}/> : ''}
        {movieId ? <SeasonList {...{movieId}}/> : ''}
      </div>
    );
  }
}

export default MoviePage;
