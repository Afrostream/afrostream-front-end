import React from 'react';
import { prepareRoute } from '../../decorators';
import * as CategoryActionCreators from '../../actions/category';
import * as EventActionCreators from '../../actions/event';
import { Link } from 'react-router';
import SlideShow from '../SlideShow/SlideShow';
import MoviesList from '../Movies/MoviesList';
import Navigation from '../Navigation/Navigation';
@prepareRoute(async function ({ store }) {
  return await * [
    store.dispatch(EventActionCreators.pinHeader(false)),
    store.dispatch(EventActionCreators.userActive(true)),
    store.dispatch(CategoryActionCreators.getMenu()),
    store.dispatch(CategoryActionCreators.getMeaList())
  ];
})
class BrowsePage extends React.Component {

  render() {
    return (
      <div className="row-fluid">
        <Navigation />
        <SlideShow />
        <MoviesList />
      </div>
    );
  }
}

export default BrowsePage;
