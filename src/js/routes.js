'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import { Route, NotFoundRoute, DefaultRoute } from 'react-router';
import Application from './components/Application';
import HomePage from './components/HomePage';
import MoviePage from './components/MoviePage';
import PlayerPage from './components/PlayerPage';
import NoMatch from './components/NoMatch';

export default (
  <Route path="/" handler={Application}>
    <DefaultRoute handler="/selection"/>
    <Route path="/:category" handler={HomePage} ignoreScrollBehavior={true}/>
    <Route name="movie" path="/:type/:movie/:slug" handler={MoviePage} ignoreScrollBehavior={true}/>
    <Route name="player" path="/:type/:movie/:slug/player/:asset" handler={PlayerPage} ignoreScrollBehavior={true}/>
    <NotFoundRoute path="*" handler={NoMatch}/>
  </Route>
);
