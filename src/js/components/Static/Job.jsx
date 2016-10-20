import React from 'react'
import { prepareRoute } from '../../decorators'
import * as EventActionCreators from '../../actions/event'
import * as JobActionCreators from '../../actions/job'
import { connect } from 'react-redux'
import MarkdownIt from 'markdown-it'
const md = MarkdownIt({
  html: true,        // Enable HTML tags in source
  xhtmlOut: true,        // Use '/' to close single tags (<br />).
  // This is only for full CommonMark compatibility.
  breaks: true,        // Convert '\n' in paragraphs into <br>
  langPrefix: 'language-',  // CSS language prefix for fenced blocks. Can be
                            // useful for external highlighters.
  linkify: true        // Autoconvert URL-like text to links
})

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
      <section dangerouslySetInnerHTML={{__html: md.render(job.get('body'))}}/>
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
