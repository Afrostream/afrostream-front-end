import React from 'react';
import { prepareRoute } from '../../decorators';
import * as MovieActionCreators from '../../actions/movie';
import * as EventActionCreators from '../../actions/event';
import * as UserActionCreators from '../../actions/user';
import * as CategoryActionCreators from '../../actions/category';
import MovieInfo from './MovieInfo';
import SeasonList from '../Seasons/SeasonList';

@prepareRoute(async function ({ store, params: { movieId, seasonId, episodeId} }) {
  await * [
    store.dispatch(EventActionCreators.pinHeader(false)),
    store.dispatch(EventActionCreators.userActive(true)),
    store.dispatch(CategoryActionCreators.getAllSpots())
  ];

  if (movieId && movieId !== 'undefined') {
    await * [
      store.dispatch(MovieActionCreators.getMovie(movieId)),
      store.dispatch(MovieActionCreators.getSeason(movieId))
    ];
  }

  return await * [
    store.dispatch(UserActionCreators.getFavorites('movies')),
    store.dispatch(UserActionCreators.getFavorites('episodes'))
  ];
})
class MoviePage extends React.Component {

  render() {
    const {
      props: {
        params: { movieId, seasonId, episodeId },
        children
        }
      } = this;

    const dataId = movieId;

    if (children) {
      return children;
    }
    return (
      <div className="row-fluid">
        {movieId ? <MovieInfo maxLength={550} active={true} load={true} showBtn={false} {...{dataId}}/> : ''}
        {movieId ? <SeasonList {...this.props}/> : ''}
      </div>
    );
  }
}

export default MoviePage;
