import React from 'react'
import { Route, Redirect, IndexRoute } from 'react-router'
import Application from './components/Application'
//import MoviePage from './components/Movies/MoviePage'
//import PlayerPage from './components/Player/PlayerPage'
//import LoginPage from './components/Login/LoginPage'
//import HomePage from './components/HomePage'
//import BrowseLastPage from './components/Browse/BrowseLastPage'
//import BrowseGenrePage from './components/Browse/BrowseGenrePage'
//import FavoritesPage from './components/Favorites/FavoritesPage'
//import SponsorsPage from './components/Sponsors/SponsorsPage'
//import SearchPage from './components/Search/SearchPage'
//import { PaymentPage, PaymentForm, CashwayPage } from './components/Payment/'
//import ResetPasswordPage from './components/ResetPassword/ResetPasswordPage'
//import * as Static from './components/Static'
//import * as Blog from './components/Blog'
//import AccountPage from './components/Account/AccountPage'
//import CancelSubscription from './components/Account/CancelSubscription'
import NoMatch from './components/NoMatch'
import _ from 'lodash'

const langs = ['fr', 'en']

const buildSubRoutes = function () {
  return _.map(langs, (lang) =>
    <Route key={lang} path={lang}>
      {buildRoutes(lang)}
    </Route>
  )
}
const buildHome = function (lang) {
  const homeRoutes = [
    <Route key={`${lang}-search`} name="search" path="recherche"
           getComponent={(nextState, cb) => System.import('./components/Search/SearchPage').then(module => cb(null, module))}/>,
    <Route key={`${lang}-compte`} name="compte" path="compte" component={AccountPage}>,
      <Route key={`${lang}-cancelSubscription`} name="cancelSubscription" path="cancel-subscription"
             component={CancelSubscription}/>
    </Route>,
    <Route key={`${lang}-sponsorship`} name="sponsorship" path="parrainage" component={SponsorsPage}/>,
    <Route key={`${lang}-browse`} name="browse" path="browse/genre(/:categoryId)(/:categorySlug)"
           component={BrowseGenrePage}/>,
    <Route key={`${lang}-last`} name="last" path="last" component={BrowseLastPage}/>,
    <Route key={`${lang}-favoris`} name="favoris" path="favoris" component={FavoritesPage}/>,
    <Route key={`${lang}-movie`} name="movie"
           path=":movieId(\\d+)(/:movieSlug)(/:seasonId/:seasonSlug)(/:episodeId/:episodeSlug)"
           component={MoviePage}>,
      <Route key={`${lang}-player`} name="player"
             path=":videoId"
             component={PlayerPage}/>
    </Route>
  ]

  if (lang) {
    return homeRoutes
  }
  const langRoutes = buildSubRoutes()
  homeRoutes.unshift(langRoutes)

  return (<Route key={`${lang}-home`} path="/" component={HomePage}>
    {homeRoutes}
  </Route>)

}
const buildRoutes = function (lang) {

  let subRoutes = [
    <Route key={`${lang}-company`} name="company" path="company"
           getComponent={(nextState, cb) => System.import('./components/Static/StaticPage').then(module => cb(null, module))}>
      <Route key={`${lang}-company-press`} name="about" path="about"
             getComponent={(nextState, cb) => System.import('./components/Static/About').then(module => cb(null, module))}/>
      <Route key={`${lang}-company-jobs`} name="jobs" path="jobs"
             getComponent={(nextState, cb) => System.import('./components/Static/Jobs').then(module => cb(null, module))}/>
      <Route key={`${lang}-company-jobs`} name="press" path="press"
             getComponent={(nextState, cb) => System.import('./components/Static/Press').then(module => cb(null, module))}/>
      <Route key={`${lang}-company-nomatch`} path="*" name="companynomatch" component={NoMatch}/>
    </Route>,
    <Route key={`${lang}-faq`} name="faq" path="faq"
           getComponent={(nextState, cb) => System.import('./components/Static/Faq').then(module => cb(null, module))}/>,
    <Route key={`${lang}-legals`} name="legals" path="legals"
           getComponent={(nextState, cb) => System.import('./components/Static/StaticRoute').then(module => cb(null, module))}/>,
    <Route key={`${lang}-cgu`} name="cgu" path="cgu"
           getComponent={(nextState, cb) => System.import('./components/Static/StaticRoute').then(module => cb(null, module))}/>,
    <Route key={`${lang}-policy`} name="policy" path="policy"
           getComponent={(nextState, cb) => System.import('./components/Static/StaticRoute').then(module => cb(null, module))}/>,
    <Route key={`${lang}-reset`} name="reset" path="reset"
           getComponent={(nextState, cb) => System.import('./components/ResetPassword/ResetPasswordPage').then(module => cb(null, module))}/>,
    <Route key={`${lang}-signin`} name="signin" path="signin"
           getComponent={(nextState, cb) => System.import('./components/Login/LoginPage').then(module => cb(null, module))}/>,
    <Route key={`${lang}-signup`} name="signup" path="signup"
           getComponent={(nextState, cb) => System.import('./components/Login/LoginPage').then(module => cb(null, module))}/>,

    <Route key={`${lang}-coupon`} name="coupon" path="coupon"
           getComponent={(nextState, cb) => System.import('./components/Login/LoginPage').then(module => cb(null, module))}/>,

    <Route key={`${lang}-login`} name="login" path="login"
           getComponent={(nextState, cb) => System.import('./components/Login/LoginPage').then(module => cb(null, module))}/>,

    <Route key={`${lang}-newsletter`} name="newsletter" path="newsletter"
           getComponent={(nextState, cb) => System.import('./components/Login/LoginPage').then(module => cb(null, module))}/>,

    <Route key={`${lang}-blog`} name="blog" path="blog"
           getComponent={(nextState, cb) => System.import('./components/Blog/PostList').then(module => cb(null, module))}>
      <Route name="post" path=":postId(/:postSlug)"
             getComponent={(nextState, cb) => System.import('./components/Blog/PostView').then(module => cb(null, module))}/>

    </Route >,
    <Route key={`${lang}-cash`} name="cash" path="cash" component={CashwayPage}>,
      <Route name="cashPayment" path="select-plan" component={PaymentPage}>
        <Route name="cashPaymentMethod" path=":planCode(/:status)" component={PaymentForm}/>
      </Route>
    </Route>,
    <Route key={`${lang}-payment`} name="payment" path="select-plan" component={PaymentPage}>
      <Route name="paymentMethod" path=":planCode(/:status)" component={PaymentForm}/>
    </Route>,
    //push subroutes after static routes
    buildHome(lang),
    <Route key={`${lang}-nomatch`} path="*" name="nomatch" component={NoMatch}/>
  ]

  return subRoutes

}

export default () => {
  const loadRouteAsync = path => (nextState, cb) => {
    console.log(path)
    System.import(path).then(module => {
      cb(null, module)
    })
  }

  return (
    <Route name="app" component={Application}>
      {buildRoutes()}
    </Route>)
}
