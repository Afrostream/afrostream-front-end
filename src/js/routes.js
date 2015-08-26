'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import { Route, NotFoundRoute, Redirect, DefaultRoute } from 'react-router';
import Application from './components/Application';
import HomePage from './components/HomePage';
import MoviePage from './components/Movies/MoviePage';
import MoviesList from './components/Movies/MoviesList';
import PlayerPage from './components/Player/PlayerPage';
import LoginPage from './components/Login/LoginPage';

import AccountPage from './components/Account/AccountPage';
import NoMatch from './components/NoMatch';

export default (
  <Route name="app" component={Application}>
    <Route name="compte" path="/compte" component={AccountPage}/>
    <Route name="login" path="/login" component={LoginPage}/>
    <Route name="home" path="/" component={HomePage} ignoreScrollBehavior={true}>
      <Route name="category" path=":category" component={MoviesList}/>
      <Redirect from="/" to="/selection"/>
    </Route>
    <Route name="movie" path="/:movieId/:movieSlug" component={MoviePage} ignoreScrollBehavior={true}/>
    <Route name="player" path="/:movieId/:movieSlug(/:serieId)(/:serieSlug)(/:episodeId)(/:episodeSlug)/:videoId"
           component={PlayerPage}
           ignoreScrollBehavior={true}/>
    <Route path="*" component={NoMatch}/>
  </Route>
);
