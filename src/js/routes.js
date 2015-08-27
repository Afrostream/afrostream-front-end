'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import { Route, NotFoundRoute, Redirect, DefaultRoute } from 'react-router';
import Application from './components/Application';
import HomePage from './components/HomePage';
import MoviePage from './components/Movies/MoviePage';
import MoviesList from './components/Movies/MoviesList';
import PlayerPage from './components/Player/PlayerPage';
import LoginPage from './components/Login/LoginPage';
import ResetPasswordPage from './components/ResetPassword/ResetPasswordPage';

import AccountPage from './components/Account/AccountPage';
import AccountEmail from './components/Account/AccountEmail';
import AccountPassword from './components/Account/AccountPassword';
import AccountCreditCard from './components/Account/AccountCreditCard';
import AccountPlan from './components/Account/AccountPlan';
import NoMatch from './components/NoMatch';

export default (
  <Route name="app" component={Application}>
    <Route name="reset" path="/reset" component={ResetPasswordPage}/>
    <Route name="login" path="/login" component={LoginPage}/>
    <Route name="home" path="/" component={HomePage} ignoreScrollBehavior={true}>
      <Route name="category" path=":category" component={MoviesList}/>
      <Redirect from="/" to="/selection"/>
    </Route>
    {/*<Route name="compte" path="/compte" component={AccountPage}>
     <Route name="compteEmail" path="/email" component={AccountEmail}/>
     <Route name="comptePassword" path="/password" component={AccountPassword}/>
     <Route name="compteCreditCard" path="/credit-card" component={AccountCreditCard}/>
     <Route name="comptePlan" path="/plan" component={AccountPlan}/>
     </Route>*/}
    <Route name="movie" path="/:movieId/:movieSlug" component={MoviePage} ignoreScrollBehavior={true}/>
    <Route name="player" path="/:movieId/:movieSlug(/:serieId)(/:serieSlug)(/:episodeId)(/:episodeSlug)/:videoId"
           component={PlayerPage}
           ignoreScrollBehavior={true}/>
    <Route path="*" component={NoMatch}/>
  </Route>
);
