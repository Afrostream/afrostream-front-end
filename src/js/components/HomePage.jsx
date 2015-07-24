import React from 'react';
import { prepareRoute } from '../decorators';
import * as CategoryActionCreators from '../actions/category';
import { Link } from 'react-router';
import SlideShow from './SlideShow/SlideShow';
import MoviesList from './Movies/MoviesList';

@prepareRoute(async function ({ redux, params: { category } }) {
  return await * [
      redux.dispatch(CategoryActionCreators.getCategory(category))
    ];
}) class HomePage extends React.Component {

  render() {
    return (
      <div className="row-fluid">
        <SlideShow />
        <MoviesList />
      </div>
    );
  }
}

export default HomePage;
