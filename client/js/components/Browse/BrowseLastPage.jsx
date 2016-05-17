import React from 'react'
import { prepareRoute } from '../../decorators'
import { connect } from 'react-redux'
import * as MovieActionCreators from '../../actions/movie'
import MoviesSlider from '../Movies/MoviesSlider'

if (process.env.BROWSER) {
  require('./BrowseLastPage.less')
}
@prepareRoute(async ({store}) => {
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

    const label = 'Derniers ajouts'

    return (<div className="browse-categorie_list">

      <MoviesSlider axis="y"
                    key={`last-movies`} {...this.props} {...{dataList, label}} />
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

export default BrowseLastPage
