import React from 'react';
import { prepareRoute } from '../../decorators';
import * as MovieActionCreators from '../../actions/movie';
import * as EventActionCreators from '../../actions/event';
import * as UserActionCreators from '../../actions/user';
import * as CategoryActionCreators from '../../actions/category';
import MovieInfo from './MovieInfo';
import SeasonList from '../Seasons/SeasonList';

@prepareRoute(async function ({ store, params: { movieId } }) {
  await * [
    store.dispatch(EventActionCreators.pinHeader(false)),
    store.dispatch(EventActionCreators.userActive(true))
  ];

  if (movieId) {
    await * [
      store.dispatch(MovieActionCreators.getMovie(movieId)),
      store.dispatch(MovieActionCreators.getSeason(movieId))
    ];
  }

  return store.dispatch(UserActionCreators.getFavorites('episodes'));
})
class MoviePage extends React.Component {

  render() {
    const {
      props: {
        params: { movieId }
        }
      } = this;

    const dataId = movieId;
    return (
      <div className="row-fluid">
        {movieId ? <MovieInfo maxLength={600} active={true} load={false} {...{dataId}}/> : ''}
        {movieId ? <SeasonList {...{movieId}}/> : ''}
      </div>
    );
  }
}

export default MoviePage;
