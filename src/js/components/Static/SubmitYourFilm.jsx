import React from 'react'
import { prepareRoute } from '../../decorators'
import * as EventActionCreators from '../../actions/event'
@prepareRoute(async function ({store}) {
  return await Promise.all([
    store.dispatch(EventActionCreators.pinHeader(true))
  ])
})
class SubmitYourFilm extends React.Component {
  render () {
    return (
      <div className="row-fluid static-route content-padding brand-grey">
        <div className="container brand-bg">
          <iframe height="1200" allowTransparency="true" frameborder="0" scrolling="no"
                  src="https://afrostream.wufoo.com/embed/p19umrfm00sdkmb/"></iframe>
        </div>
      </div>
    )
  }
}

export default SubmitYourFilm
