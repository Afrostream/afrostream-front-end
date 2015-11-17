'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import { Route, Redirect } from 'react-router';
import Application from './components/Application';
import MoviePage from './components/Movies/MoviePage';
import MoviesList from './components/Movies/MoviesList';
import PlayerPage from './components/Player/PlayerPage';
import LoginPage from './components/Login/LoginPage';
import HomePage from './components/HomePage';
import BrowsePage from './components/Browse/BrowsePage';
import ResetPasswordPage from './components/ResetPassword/ResetPasswordPage';
import * as Static from './components/Static';
import * as Blog from './components/Blog';

import AccountPage from './components/Account/AccountPage';
import CancelSubscription from './components/Account/CancelSubscription';
//import AccountEmail from './components/Account/AccountEmail';
//import AccountPassword from './components/Account/AccountPassword';
//import AccountCreditCard from './components/Account/AccountCreditCard';
//import AccountPlan from './components/Account/AccountPlan';
import NoMatch from './components/NoMatch';

export default (
  <Route name="app" component={Application}>
    <Route name="legals" path="/legals" component={Static.Legals}/>
    <Route name="cgu" path="/cgu" component={Static.CGU}/>
    <Route name="faq" path="/faq" component={Static.FAQ}/>
    <Route name="policy" path="/policy" component={Static.Policy}/>
    <Route name="reset" path="/reset" component={ResetPasswordPage}/>
    <Route name="login" path="/login" component={LoginPage}/>
    <Route name="blog" path="/blog" component={Blog.List}>
    </Route>
    <Route name="post" path="/blog/:postId/:postSlug" component={Blog.View}/>
    <Route name="home" path="/" component={HomePage} scrollOnTransition={true}>
      <Route name="movie" path="/:movieId/:movieSlug" component={MoviePage}/>
      <Route name="player"
             path="/:movieId/:movieSlug(/:seasonId)(/:seasonSlug)(/:episodeId)(/:episodeSlug)/:videoId"
             component={PlayerPage}
             scrollOnTransition={true}/>
      <Route name="compte" path="/compte" component={AccountPage}>
        <Route name="cancelSubscription" path="/cancel-subscription" component={CancelSubscription}/>
      </Route>
      <Route name="browse" path="/:category" component={BrowsePage}/>
      <Redirect from="/" to="/selection"/>
    </Route>
    <Route path="*" component={NoMatch}/>
  </Route>
);
