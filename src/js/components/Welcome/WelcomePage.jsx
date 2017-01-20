import React from 'react'
import { prepareRoute } from '../../decorators'
import WelcomeHeader from './WelcomeComponents/WelcomeHeader'
import WelcomeMoviesSlider from './WelcomeComponents/WelcomeMoviesSlider'
import WelcomeLifeSlider from './WelcomeComponents/WelcomeLifeSlider'
import Spots from './WelcomeComponents/Spots'
import Devices from './WelcomeComponents/Devices'
import { SelectPlan } from '../../components/Payment/'
import ModalCoupon from '../Modal/ModalCoupon'
import * as MovieActionCreators from '../../actions/movie'
import * as EpisodeActionCreators from '../../actions/episode'
import * as BillingActionCreators from '../../actions/billing'


if (process.env.BROWSER) {
  require('./WelcomePage.less')
}

@prepareRoute(async function ({store, location, params: {movieId, episodeId}}) {
  let {query} = location

  if (movieId && movieId !== 'undefined') {
    await store.dispatch(MovieActionCreators.getMovie(movieId))
  }

  if (episodeId && episodeId !== 'undefined') {
    await store.dispatch(EpisodeActionCreators.getEpisode(episodeId))
  }

  let contextBillingUuid = query && query.contextBillingUuid || 'common'
  let country = query && query.contextCountry

  return await store.dispatch(BillingActionCreators.getInternalplans({contextBillingUuid, country, passToken: false}))
})
class WelcomePage extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div className="welcome-page">
        <WelcomeHeader {...this.props}/>
        <Devices {...this.props} />
        <Spots {...this.props} />
        <SelectPlan {...this.props} showImages={false}/>
        <ModalCoupon type="redeemCoupon" closable={false} modal={false} {...this.props}/>
        <WelcomeLifeSlider dots={false} autoplay={true} infinite={true}/>
      </div>
    )
  }
}

WelcomePage.propTypes = {
  history: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired
}

export default WelcomePage
