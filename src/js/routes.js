'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import { Route, NotFoundRoute, Redirect } from 'react-router';
import Application from './components/Application';
import HomePage from './components/HomePage';
import MoviePage from './components/MoviePage';
import PlayerPage from './components/PlayerPage';
import NoMatch from './components/NoMatch';

export default (
  <Route component={Application}>
    <Route path="/:category" component={HomePage} ignoreScrollBehavior={true}/>
    <Route name="movie" path="/:type/:movie/:slug" component={MoviePage} ignoreScrollBehavior={true}/>
    <Route name="player" path="/:type/:movie/:slug/player/:asset" component={PlayerPage} ignoreScrollBehavior={true}/>
    <Redirect from="/" to="/selection"/>
    <Route path="*" component={NoMatch}/>
  </Route>
);
