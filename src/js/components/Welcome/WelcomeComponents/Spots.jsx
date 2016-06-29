import React from 'react'
import Immutable from 'immutable'
import { prepareRoute } from '../../../decorators'
import { connect } from 'react-redux'
import Thumb from '../../../components/Movies/Thumb'
import SignUpButton from '../../User/SignUpButton'
import * as CategoryActionCreators from '../../../actions/category'
import { getI18n } from '../../../../../config/i18n'
import _ from 'lodash'

if (process.env.BROWSER) {
  require('./Spots.less')
}

@prepareRoute(async function ({store}) {
  return store.dispatch(CategoryActionCreators.getAllSpots())
})
@connect(({Category}) => ({Category}))
class Spots extends React.Component {

  getMovies (data, i) {
    return <Thumb favorite={false} share={false}
                  key={`spot-home-${data.get('_id')}-${i}`} {...{data}}/>
  }

  /**
   * render two rows of thumbnails for the payment pages
   */
  render () {
    const {
      props: {
        Category,
        params
      }
    } = this

    let categories = Category.get('categorys/spots')

    if (!categories) {
      return (<div />)
    }
    let recoList = []
    categories.map((categorie)=> {
      let catMovies = categorie.get('adSpots')
      if (catMovies) {
        recoList = _.concat(recoList, catMovies.toJS())
      }
    })

    let uniqSpots = _.uniq(recoList, (o)=> {
      return o['_id']
    })

    let categoriesList = Immutable.fromJS(uniqSpots)

    let info = getI18n(params.lang).home.spots

    return (
      <div className="spots-list">
        <h2>{info.title}</h2>
        {categoriesList ? categoriesList.map((movie, i) => this.getMovies(movie, i)).toJS() : ''}
        <div className="container sign-up__container">
          <SignUpButton label={info.action}/>
        </div>
      </div>
    )

  }
}

export default Spots
