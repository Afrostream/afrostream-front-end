import React from 'react'
import { prepareRoute } from '../../decorators'
import { connect } from 'react-redux'
import * as CategoryActionCreators from '../../actions/category'
import MoviesSlider from '../Movies/MoviesSlider'
import NoMatch from '../NoMatch'

if (process.env.BROWSER) {
  require('./BrowseGenrePage.less')
}
@prepareRoute(async ({store, params: {categoryId}}) => {
  return await Promise.all([
    store.dispatch(CategoryActionCreators.getCategory(categoryId))
  ])
})
@connect(({Category}) => ({Category}))
class BrowseGenrePage extends React.Component {

  constructor (props) {
    super(props)
  }

  renderList () {
    const {
      props: {
        Category,
        params :{
          categoryId
        }
      }
    } = this

    const categorie = Category.get(`categorys/${categoryId}`)

    const type = categorie.get('type')
    const adSpots = categorie.get('adSpots')
    const dataList = categorie.get('movies')
    const label = categorie.get('label')
    const slug = categorie.get('slug')
    const poster = categorie.get('poster')

    if (type === 'error') {
      return <NoMatch {...{label, poster}}/>
    }

    return (<div className="browse-categorie_list">

      <MoviesSlider axis="y"
                    key={`genre-${categorie.get('_id')}`} {...this.props} {...{dataList, label}} />
    </div>)
  }

  render () {
    return (
      <div className="row-fluid browse-genre_page">
        {this.renderList()}
      </div>
    )
  }
}

export default BrowseGenrePage
