'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import {Route } from 'react-router';
import Application from './components/Application';
import HomePage from './components/HomePage';
import MoviePage from './components/MoviePage';
import PlayerPage from './components/PlayerPage';
import NoMatch from './components/NoMatch';

export default (
  <Route path="/" component={Application}>
    <Route path="/:category" component={HomePage} ignoreScrollBehavior={true}/>
    <Route name="movie" path="/:type/:movie/:slug" component={MoviePage} ignoreScrollBehavior={true}/>
    <Route name="player" path="/:type/:movie/:slug/player/:asset" component={PlayerPage} ignoreScrollBehavior={true}/>
    <Route path="*" component={NoMatch}/>
  </Route>
);
