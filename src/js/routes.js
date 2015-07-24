'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import {Route } from 'react-router';
import Application from './components/Application';
import HomePage from './components/HomePage';
import MoviePage from './components/MoviePage';
import NoMatch from './components/NoMatch';

export default (
  <Route path="/" component={Application}>
    <Route path="/:category" component={HomePage} ignoreScrollBehavior={true}/>
    <Route name="movie" path="/movie/:movie/:slug" component={MoviePage} ignoreScrollBehavior={true}/>
    <Route path="*" component={NoMatch}/>
  </Route>
);
