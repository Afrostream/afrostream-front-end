import React from 'react'
import { prepareRoute } from '../../decorators'
import config from '../../../../config'
import WelcomeHeader from './WelcomeComponents/WelcomeHeader'
import WelcomeLifeSlider from './WelcomeComponents/WelcomeLifeSlider'
import Spots from './WelcomeComponents/Spots'
import Devices from './WelcomeComponents/Devices'
import { SelectPlan } from '../../components/Payment/'
import InternalPlansCountDown from '../CountDown/InternalPlansCountDown'
import ModalCoupon from '../Modal/ModalCoupon'
import * as EventActionCreators from '../../actions/event'
import * as MovieActionCreators from '../../actions/movie'
import * as EpisodeActionCreators from '../../actions/episode'
import * as BillingActionCreators from '../../actions/billing'


if (process.env.BROWSER) {
  require('./WelcomePage.less')
}

@prepareRoute(async function ({store, location, params: {movieId, episodeId}}) {
  let {query} = location
  await Promise.all([
    store.dispatch(EventActionCreators.pinHeader(false)),
  ])

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
        <InternalPlansCountDown className="welcome-header" {...this.props} >
          <WelcomeHeader {...this.props}/>
        </InternalPlansCountDown>
        <Devices {...this.props} />
        <WelcomeLifeSlider dots={false} autoplay={true} infinite={true}/>
        <SelectPlan {...this.props} showImages={false}/>
        <Spots {...this.props}/>
        <ModalCoupon type="redeemCoupon" closable={false} modal={false} {...this.props}/>
      </div>
    )
  }
}

WelcomePage.propTypes = {
  history: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired
}

export default WelcomePage
