import React from 'react';
import { metasData,prepareRoute,analytics } from '../../decorators';
import * as MovieActionCreators from '../../actions/movie';
import * as EventActionCreators from '../../actions/event';
import MovieInfo from './MovieInfo';
import SeasonList from '../Seasons/SeasonList';

@prepareRoute(async function ({ store, location, params: { movieId } }) {
  return await * [
    store.dispatch(EventActionCreators.pinHeader(false)),
    store.dispatch(EventActionCreators.userActive(true)),
    store.dispatch(MovieActionCreators.getMovie(movieId, location)),
    store.dispatch(MovieActionCreators.getSeason(movieId))
  ];
})
class MoviePage extends React.Component {

  render() {
    const {
      props: {
        params: { movieId }
        }
      } = this;

    return (
      <div className="row-fluid">
        {movieId ? <MovieInfo maxLength={600} active={true} load={false} {...{movieId}}/> : ''}
        {movieId ? <SeasonList {...{movieId}}/> : ''}
      </div>
    );
  }
}

export default MoviePage;
