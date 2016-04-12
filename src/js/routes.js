'use strict';

import React from 'react';
import { Route, Redirect } from 'react-router';
import Application from './components/Application';
import MoviePage from './components/Movies/MoviePage';
import MoviesList from './components/Movies/MoviesList';
import PlayerPage from './components/Player/PlayerPage';
import LoginPage from './components/Login/LoginPage';
import HomePage from './components/HomePage';
import BrowsePage from './components/Browse/BrowsePage';
import FavoritesPage from './components/Favorites/FavoritesPage';
import SearchPage from './components/Search/SearchPage';
import {PaymentPage,PaymentMethod,PaymentForm,CashwayPage} from './components/Payment/';
import RedeemCoupon from './components/RedeemCoupon/RedeemCoupon';
import CouponRegister from './components/RedeemCoupon/CouponRegister';
import ResetPasswordPage from './components/ResetPassword/ResetPasswordPage';
import * as Static from './components/Static';
import * as Blog from './components/Blog';
import AccountPage from './components/Account/AccountPage';
import CancelSubscription from './components/Account/CancelSubscription';
import NoMatch from './components/NoMatch';

export default (
  <Route name="app" component={Application}>
    <Route name="legals" path="legals" component={Static.Legals}/>
    <Route name="cgu" path="cgu" component={Static.CGU}/>
    <Route name="faq" path="faq" component={Static.FAQ}/>
    <Route name="policy" path="policy" component={Static.Policy}/>
    <Route name="reset" path="reset" component={ResetPasswordPage}/>
    <Route name="signin" path="signin" component={LoginPage}/>
    <Route name="signup" path="signup" component={LoginPage}/>
    <Route name="coupon" path="coupon" component={RedeemCoupon}/>
    <Route name="couponregister" path="couponregister" component={CouponRegister}/>
    <Route name="login" path="login" component={LoginPage}/>
    <Route name="blog" path="blog" component={Blog.PostList}>
      <Route name="post" path=":postId(/:postSlug)" component={Blog.PostView}/>
    </Route>
    <Route name="cash" path="cash" component={CashwayPage}>
      <Route name="cashPayment" path="select-plan" component={PaymentPage}>
        <Route name="cashPaymentMethod" path=":planCode(/:status)" component={PaymentForm}/>
      </Route>
    </Route>
    <Route name="payment" path="select-plan" component={PaymentPage}>
      <Route name="paymentMethod" path=":planCode(/:status)" component={PaymentForm}/>
    </Route>
    <Route name="home" path="/" component={HomePage}>
      <Route name="search" path="recherche" component={SearchPage}/>
      <Route name="compte" path="compte" component={AccountPage}>
        <Route name="cancelSubscription" path="cancel-subscription" component={CancelSubscription}/>
      </Route>
      <Route name="favoris" path="favoris" component={FavoritesPage}/>
      <Route name="movie" path=":movieId(/:movieSlug)(/:seasonId/:seasonSlug)(/:episodeId/:episodeSlug)"
             component={MoviePage}>
        <Route name="player"
               path=":videoId"
               component={PlayerPage}/>
      </Route>
      <Redirect from="/" to="/selection"/>
    </Route>
    <Route path="*" component={NoMatch}/>
  </Route>
);
