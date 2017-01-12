import React from 'react'
import { prepareRoute } from '../../decorators'
import * as EventActionCreators from '../../actions/event'
import * as JobActionCreators from '../../actions/job'
import { Link } from '../Utils'
import { connect } from 'react-redux'

@prepareRoute(async function ({store}) {
  return await Promise.all([
    store.dispatch(JobActionCreators.fetchAll())
  ])
})
@connect(({Job}) => ({Job}))
class Jobs extends React.Component {

  renderJobs () {

    const {
      props: {
        Job
      }
    } = this


    const jobsData = Job.get(`jobs`)

    if (!jobsData) {
      return <p>Aucuns job pour l'instant</p>
    }

    return jobsData.map((job, key)=> {

      let shortDescription = job.get('description').substring(0, 300) + '...'

      return <div key={`static-videos-${key}`} className="col col-md-12">
        <Link to={`/company/jobs/${job.get('_id')}/${job.get('slug')}`}>
          <h4>{job.get('title')}</h4>
          <p>{shortDescription}</p>
        </Link>
      </div>
    }).toJS()
  }

  render () {

    const {
      props: {
        children
      }
    } = this

    return (
      <div id="react-blog">
        <section className="backstage-section bg-linear" id="jobs">
          <div className="container-fluid no-padding">
            <div className="column-right">
              <h2 className="heading-2">Jobs</h2>
              {children ? children : this.renderJobs()}
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default Jobs
