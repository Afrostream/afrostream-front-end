import React from 'react'
import _ from 'lodash'
import { Route, Redirect, IndexRoute } from 'react-router'
import Application from './components/Application'
import MoviePage from './components/Movies/MoviePage'
import PlayerPage from './components/Player/PlayerPage'
import LoginPage from './components/Login/LoginPage'
import HomePage from './components/HomePage'
import BrowseHistoryPage from './components/Browse/BrowseHistoryPage'
import BrowseLastPage from './components/Browse/BrowseLastPage'
import BrowseGenrePage from './components/Browse/BrowseGenrePage'
import FavoritesPage from './components/Favorites/FavoritesPage'
import SponsorsPage from './components/Sponsors/SponsorsPage'
import SearchPage from './components/Search/SearchPage'
import StoreLocator from './components/Store/StoreLocator'
import { PaymentPage, PaymentForm, CashwayPage } from './components/Payment/'
import * as Static from './components/Static'
import * as Life from './components/Life'
import AccountPage from './components/Account/AccountPage'
import CancelSubscription from './components/Account/CancelSubscription'
import NoMatch from './components/NoMatch'
//STATIC
import Footer from './components/Footer/Footer'
import CaterogyList from './components/Movies/CategoryList'
import MoviesList from './components/Movies/MoviesList'
import Spots from './components/Welcome/WelcomeComponents/Spots'

const langs = ['fr', 'en']

const buildLangsRoutes = function () {
  let allRoutes = _.map(langs, (lang) =>
    <Route key={lang} name="lang" path={lang} lang={lang}>
      {buildRoutes(lang)}
    </Route>,
  )
  allRoutes.push(buildRoutes())
  return allRoutes
}

const buildLangsStaticRoutes = function () {
  let allRoutes = _.map(langs, (lang) =>
    <Route key={lang} name="lang" path={lang} lang={lang}>
      {buildStaticRoutes(lang)}
    </Route>,
  )
  allRoutes = _.concat(allRoutes, buildStaticRoutes())
  return allRoutes
}

const buildHome = function (lang) {
  const homeRoutes = [
    <Route key={`${lang}-compte`} name="account" path="account" component={AccountPage}>,
      <Route key={`${lang}-cancelSubscription`} name="cancelSubscription"
             path="cancel-subscription(/:subscriptionBillingUuid)"
             component={CancelSubscription}/>
    </Route>,
    <Route key={`${lang}-sponsorship`} name="sponsorship" path="sponsorship" component={SponsorsPage}/>,
    <Route key={`${lang}-last`} name="last" path="last" component={BrowseLastPage}/>,
    <Route key={`${lang}-history`} name="history" path="history" component={BrowseHistoryPage}/>,
    <Route key={`${lang}-favoris`} name="favorites" path="favorites" component={FavoritesPage}/>,
    <Route key={`${lang}-movie`}
           name="movie"
           path=":movieId(/:movieSlug)(/:seasonId/:seasonSlug)(/:episodeId/:episodeSlug)"
           component={MoviePage}>,
      <Route key={`${lang}-player`}
             name="player"
             path=":videoId"
             component={PlayerPage}/>
    </Route>,
    <IndexRoute key={`${lang}-home-index`} name="home" component={HomePage}/>
  ]

  const finalRoutes = (<Route key={`${lang}-home`} name="home" component={HomePage}>
    {homeRoutes}
  </Route>)

  return finalRoutes

}
const buildRoutes = function (lang) {

  let subRoutes = [
    <Route key={`${lang}-search`} name="search" path="search" component={SearchPage}/>,
    <Route key={`${lang}-company`} name="company" path="company" component={Static.StaticPage}>
      <Route key={`${lang}-company-press`} name="about" path="about" component={Static.ABOUT}/>
      <Route key={`${lang}-company-jobs`} name="jobs" path="jobs" component={Static.JOBS}>
        <Route key={`${lang}-company-jobs-job`} name="job" path=":jobId(/:jobSlug)" component={Static.JOB}/>
      </Route>
      <Route key={`${lang}-company-jobs`} name="press" path="press" component={Static.PRESS}/>
      <Route key={`${lang}-company-nomatch`} path="*" name="companynomatch" component={NoMatch}/>
    </Route>,
    <Route key={`${lang}-faq`} name="faq" path="faq" component={Static.FAQ}/>,
    <Route key={`${lang}-submit`} name="submit" path="submit-content" component={Static.SubmitYourFilm}/>,
    <Route key={`${lang}-legals`} name="legals" path="legals" component={Static.StaticRoute}/>,
    <Route key={`${lang}-cgu`} name="cgu" path="cgu" component={Static.StaticRoute}/>,
    <Route key={`${lang}-policy`} name="policy" path="policy" component={Static.StaticRoute}/>,
    <Route key={`${lang}-reset`} name="reset" path="reset" component={LoginPage}/>,
    <Route key={`${lang}-signin`} name="signin" path="signin" component={LoginPage}/>,
    <Route key={`${lang}-signup`} name="signup" path="signup" component={LoginPage}/>,
    <Route key={`${lang}-coupon`} name="coupon" path="coupon" component={LoginPage}/>,
    <Route key={`${lang}-login`} name="login" path="login" component={LoginPage}/>,
    <Route key={`${lang}-newsletter`} name="newsletter" path="newsletter" component={LoginPage}/>,
    <Route key={`${lang}-life`} name="life" path="life" component={Life.LifeHome}>
      <Route name="community" path="community" component={Life.LifeCommunity}>
        <Route name="lifeUsersTimeline" path="timeline" component={Life.LifeTimeline}/>
        <Route name="lifeUserInfos" path=":lifeUserId(/:lifeUserName)" component={Life.LifeUserInfos}/>
      </Route>
      <Route name="lifePin" path="pin/:pinId(/:pinSlug)" component={Life.LifePinView}/>
      <Route name="lifeTheme" path=":themeId(/:themeSlug)" component={Life.LifeTheme}/>
      <IndexRoute key={`${lang}-life-index`} component={Life.LifeTheme}/>
    </Route>,
    <Route key={`${lang}-store`} name="store" path="store-locator" component={StoreLocator}/>,
    <Route key={`${lang}-cash`} name="cash" path="cash" component={CashwayPage}>,
      <Route name="cashPayment" path="select-plan" component={PaymentPage}>
        <Route name="cashPaymentMethod" path=":planCode(/:status)" component={PaymentForm}/>
      </Route>
    </Route>,
    <Route key={`${lang}-payment`} name="payment" path="select-plan" component={PaymentPage}>
      <Route name="paymentMethod" path=":planCode(/:status)" component={PaymentForm}/>
    </Route>,
    <Route key={`${lang}-category`} name="category" path="category"
           component={CaterogyList}>
      <Route key={`${lang}-category-page`} name="categoryPage" path=":categoryId(/:categorySlug)"
             component={BrowseGenrePage}/>
    </Route>,
    <Redirect key={`${lang}-redirect-account`} from={`${(lang && '/' + lang) || ''}/compte/cancel-subscription/*`}
              to="account/cancel-subscription"/>,
    <Redirect key={`${lang}-redirect-account`} from={`${(lang && '/' + lang) || ''}/compte/**/*`} to="account"/>,
    <Redirect key={`${lang}-redirect-sponsorship`} from={`${(lang && '/' + lang) || ''}/parrainage/**/*`}
              to="sponsorship"/>,
    <Redirect key={`${lang}-redirect-favorites`} from={`${(lang && '/' + lang) || ''}/favoris/**/*`} to="favorites"/>,
    <Redirect key={`${lang}-redirect-search`} from={`${(lang && '/' + lang) || ''}/recherche/**/*`} to="search"/>,
    <Redirect key={`${lang}-redirect-blog`} from={`${(lang && '/' + lang) || ''}/blog/**/*`} to="life"/>,
    <Redirect key={`${lang}-redirect-browse`} from={`${(lang && '/' + lang) || ''}/browse/**/*`} to="category"/>,
    //push subroutes after static routes
    buildHome(lang)
  ]

  return subRoutes

}

const buildStaticRoutes = function (lang) {
  let subRoutes = [
    <Route key={`${lang}-footer`} name="footer" path="footer" isStatic={true} component={Footer}/>,
    <Route key={`${lang}-moviesList`} name="moviesList" path="movies/list" isStatic={true} component={MoviesList}/>,
    <Route key={`${lang}-spotsList`} name="spotsList" path="categorys/spots" isStatic={true} component={Spots}/>
  ]
  return subRoutes
}

export const staticRoutes = buildLangsStaticRoutes()

export const routes = (
  <Route name="app" path="/" component={Application}>
    {buildLangsRoutes()}
    <Route path="*" name="nomatch" component={NoMatch}/>
  </Route>
)

export default routes
