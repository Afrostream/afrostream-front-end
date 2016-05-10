import React from 'react'
import { connect } from 'react-redux'
import Immutable from 'immutable'
import ReactList from 'react-list'
import MoviesSlider from './MoviesSlider'
import classSet from 'classnames'

if (process.env.BROWSER) {
  require('./MoviesList.less')
}

@connect(({Category}) => ({Category}))
class MoviesList extends React.Component {

  constructor (props) {
    super(props)
  }

  /**
   * Used in _.reduce to fill the arrays of blocs
   */
  accumulateInBloc (finalResult = [], bloc) {
    // By default, 1 page = 1 bloc
    let maxBloc = bloc.adSpot ? 1 : 2
    if (_.last(finalResult).length && _.last(finalResult)[0].adSpot) {
      maxBloc = 1
    }

    if (_.last(finalResult).length === maxBloc) {
      finalResult.push([])
    }
    _.last(finalResult).push(bloc)

    return finalResult
  }

  renderSize () {
    return 478
  }

  renderList (index) {
    const {
      props: {
        Category
      }
    } = this

    //LIST
    const categories = Category.get('meaList')
    const adSpots = Category.get(`categorys/spots`)

    //ITEM
    let categorie = categories.get(index)
    const catId = categorie.get('_id')
    let dataList = categorie.get('movies')
    let adSpotList = Immutable.fromJS([])

    //Get adspot
    let adSpot = adSpots.find((obj)=> {
      return obj.get('_id') == catId
    })

    //Concat adspots and categrorie movies
    //remove duplicates
    if (adSpot) {
      adSpotList = adSpot.get('adSpots')
      if (adSpotList && adSpotList.size) {

        let filteredList = []
        let spots = adSpotList.toJS() || []
        let jsList = dataList.toJS() || []
        spots = _.map(spots, (spot) => {
          spot.adSpot = true
          return spot
        })

        // filteredList = _.concat(filteredList, spots)
        // filteredList = _.concat(filteredList, jsList)
        filteredList = filteredList.concat(spots).concat(jsList)

        let uniqSpots = _.uniq(filteredList, (o)=> {
          return o['_id']
        })

        uniqSpots = _(uniqSpots)
          .reduce(::this.accumulateInBloc, [[]])

        dataList = Immutable.fromJS(uniqSpots)
      }
    }

    const label = categorie.get('label')
    const slug = categorie.get('slug')
    const listClass = {
      'movies-data-list': true,
      'spots': adSpotList.size
    }
    return <MoviesSlider
      className={classSet(listClass)}
      key={`categorie-${categorie.get('_id')}-${index}`} {...this.props} {...{dataList, label, slug}} />
  }

  render () {
    const {
      props: {
        Category
      }
    } = this

    const categories = Category.get('meaList')

    return (
      <div className="movies-list">
        <ReactList
          useTranslate3d={true}
          ref="react-movies-list"
          axis="y"
          itemRenderer={::this.renderList}
          length={categories.size}
          type={'simple'}
          pageSize={4}
        />
      </div>
    )
  }
}

export default MoviesList
