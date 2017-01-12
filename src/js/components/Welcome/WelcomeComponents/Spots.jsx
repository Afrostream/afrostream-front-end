import React from 'react'
import Immutable from 'immutable'
import { prepareRoute, prepareStatic } from '../../../decorators'
import { connect } from 'react-redux'
import classSet from 'classnames'
import Thumb from '../../../components/Movies/Thumb'
import SignUpButton from '../../User/SignUpButton'
import * as CategoryActionCreators from '../../../actions/category'
import _ from 'lodash'
import {
  FormattedMessage
} from 'react-intl'

if (process.env.BROWSER) {
  require('./Spots.less')
}

@prepareRoute(async function ({store}) {
  return store.dispatch(CategoryActionCreators.getAllSpots())
})
@prepareStatic('components/categorys/spots')
@connect(({Category}) => ({Category}))
class Spots extends React.Component {

  renderMovie (data, index) {
    let dataId = data.get('_id')

    let params = {
      thumbW: 240,
      thumbH: 465,
      type: 'spot',
      fit: 'min',
      crop: 'face'
    }

    return (<Thumb
      favorite={false}
      share={false}
      preload={true}
      id={dataId}
      key={`data-thumb-${dataId}-${index}`}
      {...params}
      {...this.props}
      {...{data, dataId}}  />)
  }

  /**
   * render two rows of thumbnails for the payment pages
   */
  render () {
    const {
      props: {
        Category
      }
    } = this

    let categories = Category.get('categorys/spots')

    if (!categories) {
      return (<div />)
    }
    let recoList = []
    categories.map((categorie) => {
      let catMovies = categorie.get('adSpots')
      if (catMovies) {
        recoList = _.concat(recoList, catMovies.toJS())
      }
    })

    let uniqSpots = _.uniq(recoList, (o) => {
      return o['_id']
    })
    //get only 8 mea
    let categoriesList = Immutable.fromJS(_.take(uniqSpots, 8))

    let listClass = {
      'movies-data-list': true,
      'spots': true
    }

    return (
      <div className="container spots-list">
        <h2 className="browse-categorie_list_label">
          <FormattedMessage id="home.spots.title"/>
        </h2>
        <div className={classSet(listClass)}>
          {categoriesList && categoriesList.map((movie, i) => this.renderMovie(movie, i)).toJS()}
        </div>
        <div className="container sign-up__container">
          <SignUpButton label={'home.spots.action'}/>
        </div>
      </div>
    )

  }
}

export default Spots
