import React from 'react';
import { prepareRoute } from '../../decorators';
import * as CategoryActionCreators from '../../actions/category';
import * as EventActionCreators from '../../actions/event';
import * as UserActionCreators from '../../actions/user';
import { Link } from 'react-router';
import SlideShow from '../SlideShow/SlideShow';
import MoviesList from '../Movies/MoviesList';
import UserMoviesList from '../Movies/UserMoviesList';
@prepareRoute(async function ({store}) {
  await * [
    store.dispatch(EventActionCreators.pinHeader(false)),
    store.dispatch(EventActionCreators.userActive(true))
  ];
  return await * [
    store.dispatch(UserActionCreators.getHistory()),
    store.dispatch(UserActionCreators.getFavorites('movies'))
  ];
})
class BrowsePage extends React.Component {

  render () {
    return (
      <div className="row-fluid">
        <SlideShow />
        <UserMoviesList />
        <MoviesList />
      </div>
    );
  }
}

export default BrowsePage;
