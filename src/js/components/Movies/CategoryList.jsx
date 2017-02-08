import React from 'react'
import { connect } from 'react-redux'
import ReactList from 'react-list'
import MoviesSlider from './MoviesSlider'
import { withRouter } from 'react-router'
import { prepareRoute } from '../../decorators'
import * as CategoryActionCreators from '../../actions/category'
import { Link } from '../Utils'

if (process.env.BROWSER) {
  require('./CategoryList.less')
}

@prepareRoute(async function ({store}) {
  return await store.dispatch(CategoryActionCreators.getMeaList())
})

@connect(({Category}) => ({Category}))
class CategoryList extends React.Component {

  constructor (props) {
    super(props)
  }


  renderList (index) {
    const {
      props: {
        Category
      }
    } = this

    //LIST
    const categories = Category.get(`meaList`)
    //ITEM
    let categorie = categories.get(index)
    if (!categorie) {
      return
    }
    const label = categorie.get('label')
    const categoryId = categorie.get('_id')
    const slug = `category/${categoryId}/${categorie.get('slug')}`
    const dataList = categorie.get('movies')

    return (<MoviesSlider virtual={false}
                          key={`categorie-${categoryId}`} {...this.props} {...{dataList, label, slug}} />)

  }

  render () {
    const {
      props: {
        Category,
        children,
      }
    } = this

    if (children) {
      return children
    }

    const categories = Category.get(`meaList`)
    if (!categories) {
      return <div />
    }

    return (
      <div className={`category-list`}>
        <ReactList
          ref="react-movies-list"
          axis="y"
          itemRenderer={::this.renderList}
          length={categories.size}
          type={'simple'}
        />
      </div>
    )
  }
}

export default withRouter(CategoryList)
