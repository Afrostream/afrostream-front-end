import React from 'react'
import { connect } from 'react-redux'
import ReactList from 'react-list'
import CategorySlider from './CategorySlider'
import { withRouter } from 'react-router'

if (process.env.BROWSER) {
  require('./MoviesList.less')
}

@connect(({Category}) => ({Category}))
class MoviesList extends React.Component {

  constructor (props) {
    super(props)
  }

  renderList (index) {
    const {
      props: {
        Category,
      }
    } = this

    //LIST
    const categories = Category.get(`menu`)
    //ITEM
    let categorie = categories.get(index)
    if (!categorie) {
      return
    }
    const label = categorie.get('label')
    const slug = categorie.get('slug')
    const categoryId = categorie.get('_id')

    return (<CategorySlider
      key={`categorie-${categoryId}`} {...this.props} {...{categoryId, label, slug}} />)
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

    const categories = Category.get(`menu`)
    if (!categories) {
      return <div />
    }

    return (
      <div className={`movies-list`}>
        <ReactList
          ref="react-movies-list"
          axis="y"
          itemRenderer={::this.renderList}
          length={categories.size}
          type={'simple'}
          pageSize={4}
          threshold={500}
        />
      </div>
    )
  }
}

export default withRouter(MoviesList)
