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
import AccountEmail from './components/Account/AccountEmail';
import AccountPassword from './components/Account/AccountPassword';
import AccountCreditCard from './components/Account/AccountCreditCard';
import AccountPlan from './components/Account/AccountPlan';
import NoMatch from './components/NoMatch';

export default (
  <Route name="app" component={Application}>
    <Route name="compte" path="/compte" component={AccountPage}/>

    <Route name="compteEmail" path="/compte/email" component={AccountEmail}/>
    <Route name="comptePassword" path="/compte/password" component={AccountPassword}/>
    <Route name="compteCreditCard" path="/compte/credit-card" component={AccountCreditCard}/>
    <Route name="comptePlan" path="/compte/plan" component={AccountPlan}/>

    <Route name="login" path="/login" component={LoginPage}/>
    <Route name="home" path="/" component={HomePage} ignoreScrollBehavior={true}>
      <Route name="category" path=":category" component={MoviesList}/>
      <Redirect from="/" to="/selection"/>
    </Route>
    <Route name="movie" path="/:type/:movieId/:slug" component={MoviePage} ignoreScrollBehavior={true}/>
    <Route name="player" path="/:type/:movieId/:slug/player/:asset" component={PlayerPage} ignoreScrollBehavior={true}/>
    <Route path="*" component={NoMatch}/>
  </Route>
);
