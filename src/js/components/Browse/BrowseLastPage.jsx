import React from 'react'
import { prepareRoute } from '../../decorators'
import { connect } from 'react-redux'
import * as MovieActionCreators from '../../actions/movie'
import MoviesSlider from '../Movies/MoviesSlider'
import Spinner from '../Spinner/Spinner'
import {
  intlShape,
  injectIntl
} from 'react-intl'

if (process.env.BROWSER) {
  require('./BrowseLastPage.less')
}
@prepareRoute(async function ({store}) {
  return await Promise.all([
    store.dispatch(MovieActionCreators.getLast())
  ])
})
@connect(({Movie}) => ({Movie}))
class BrowseLastPage extends React.Component {

  constructor (props) {
    super(props)
  }

  renderList () {
    const {
      props: {
        Movie
      }
    } = this

    const dataList = Movie.get(`movies/last`)

    if (!dataList) {
      return (<Spinner />)
    }

    return (<div className="browse-categorie_list">

      <MoviesSlider axis="y"
                    key={`last-movies`} label="browse.last" {...this.props} {...{dataList}} />
    </div>)
  }

  render () {
    return (
      <div className="row-fluid browse-last_page">
        {this.renderList()}
      </div>
    )
  }
}

BrowseLastPage.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(BrowseLastPage)
