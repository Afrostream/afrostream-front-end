import React from 'react'
import { prepareRoute } from '../../decorators'
import * as EventActionCreators from '../../actions/event'
import * as JobActionCreators from '../../actions/job'
import { connect } from 'react-redux'

@prepareRoute(async function ({store, params:{jobId}}) {
  return await Promise.all([
    store.dispatch(EventActionCreators.pinHeader(true)),
    store.dispatch(JobActionCreators.fetchJob(jobId))
  ])
})
@connect(({Job}) => ({Job}))
class JobPage extends React.Component {

  renderJob () {

    const {
      props: {
        Job, params: {jobId},
      }
    } = this


    const job = Job.get(`jobs/${jobId}`)

    if (!job) {
      return <p>Le job n'est plus à pourvoir</p>
    }

    return <div className="col col-md-12">
      <h4>{job.get('title')}</h4>
      <section dangerouslySetInnerHTML={{__html: job.get('body')}}/>
    </div>
  }

  render () {

    return (
      <div id="react-blog">
        <section className="backstage-section bg-linear" id="jobs">
          <div className="container-fluid no-padding">
            {this.renderJob()}
          </div>
        </section>
      </div>
    )
  }
}

export default JobPage
