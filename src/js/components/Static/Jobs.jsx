import React from 'react'
import { prepareRoute } from '../../decorators'
import * as EventActionCreators from '../../actions/event'
@prepareRoute(async function ({store}) {
  return await Promise.all([
    store.dispatch(EventActionCreators.pinHeader(true))
  ])
})
class Jobs extends React.Component {
  render () {
    return (
      <div id="react-blog">
        <section className="backstage-section bg-linear" id="jobs">
          <div className="container-fluid container-no-padding">
            <div className="column-right">
              <h2 className="heading-2">Jobs</h2>
              <p>Aucuns job pour l'instant</p>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default Jobs
