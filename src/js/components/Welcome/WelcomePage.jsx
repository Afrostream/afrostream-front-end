import React from 'react'
import { prepareRoute } from '../../decorators'
import WelcomeHeader from './WelcomeComponents/WelcomeHeader'
import Spots from './WelcomeComponents/Spots'
import Devices from './WelcomeComponents/Devices'
import PricingTable from './WelcomeComponents/PricingTable'
import Spinner from '../Spinner/Spinner'
import * as EventActionCreators from '../../actions/event'
import * as MovieActionCreators from '../../actions/movie'
import * as EpisodeActionCreators from '../../actions/episode'
import * as BillingActionCreators from '../../actions/billing'
import * as CategoryActionCreators from '../../actions/category'
import { withRouter } from 'react-router'

if (process.env.BROWSER) {
  require('./WelcomePage.less')
}

@prepareRoute(async function ({store, params: {movieId, episodeId}}) {
  await Promise.all([
    store.dispatch(EventActionCreators.pinHeader(true)),
    store.dispatch(CategoryActionCreators.getMenu())
  ])

  if (movieId && movieId !== 'undefined') {
    await store.dispatch(MovieActionCreators.getMovie(movieId))
  }

  if (episodeId && episodeId !== 'undefined') {
    await store.dispatch(EpisodeActionCreators.getEpisode(episodeId))
  }

  return await store.dispatch(BillingActionCreators.getInternalplans('common'))
})
class WelcomePage extends React.Component {

  render () {
    return (
      <div className="welcome-page">
        <WelcomeHeader {...this.props}/>
        <Devices {...this.props}/>
        <Spots {...this.props}/>
        <PricingTable {...this.props}/>
      </div>
    )
  }
}

WelcomePage.propTypes = {
  history: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired
}

export default withRouter(WelcomePage)
