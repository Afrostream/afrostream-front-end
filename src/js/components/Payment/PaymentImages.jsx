import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import Poster from '../Movies/Poster'
import _ from 'lodash'
import { prepareRoute } from '../../decorators'
import * as CategoryActionCreators from '../../actions/category'

if (process.env.BROWSER) {
  require('./PaymentImages.less')
}
@prepareRoute(async function ({store}) {
  return store.dispatch(CategoryActionCreators.getAllSpots())
})
@connect(({Category}) => ({Category}))
class PaymentImages extends React.Component {

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
      return (<div/>)
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
    let selectionMovies = Immutable.fromJS(_.take(uniqSpots, 8))

    return (
      <div>
        <div className="payment-pages__thumbs-row">
          {selectionMovies ? selectionMovies.map((data, i) => <Poster
              key={`movie-payment-a-${i}`} {...{data}}/>).toJS() : ''}
        </div>
      </div>
    )

  }
}

PaymentImages.propTypes = {}

PaymentImages.defaultProps = {}

export default PaymentImages
