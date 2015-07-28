import React from 'react';
import { prepareRoute } from '../../decorators';
import * as MovieActionCreators from '../../actions/movie';
import MovieInfo from './MovieInfo';
import SeasonList from '../Seasons/SeasonList';

@prepareRoute(async function ({ store, params: { type, movie } }) {
  return await * [
      store.dispatch(MovieActionCreators.getMovie(movie)),
      store.dispatch(MovieActionCreators.getSeason(movie))
    ];
}) class HomePage extends React.Component {

  render() {
    const {
      props: {
        params: { movie }
        }
      } = this;

    return (
      <div className="row-fluid">
        {movie ? <MovieInfo maxLength="600" active="true" {...{movie}}/> : ''}
        {movie ? <SeasonList {...{movie}}/> : ''}
      </div>
    );
  }
}

export default HomePage;
