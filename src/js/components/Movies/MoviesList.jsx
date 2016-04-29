import React from 'react';
import { connect } from 'react-redux';
import MoviesSlider from './MoviesSlider';
import Immutable from 'immutable';

if (process.env.BROWSER) {
  require('./MoviesList.less');
}

@connect(({Category}) => ({Category}))
class MoviesList extends React.Component {

  constructor (props) {
    super(props);
  }

  /**
   * Used in _.reduce to fill the arrays of blocs
   */
  accumulateInBloc (finalResult = [], bloc) {
    // By default, 1 page = 1 bloc
    let maxBloc = bloc.adSpot ? 1 : 2;
    if (_.last(finalResult).length && _.last(finalResult)[0].adSpot) {
      maxBloc = 1;
    }

    if (_.last(finalResult).length === maxBloc) {
      finalResult.push([]);
    }
    _.last(finalResult).push(bloc);

    return finalResult;
  }

  render () {
    const {
      props: {
        Category
      }
    } = this;

    const categories = Category.get('meaList');
    const adSpots = Category.get(`categorys/spots`);

    return (
      <div className="movies-list">
        {categories ? categories.map((categorie, i) => {
          const catId = categorie.get('_id');
          let dataList = categorie.get('movies');
          let adSpotList;

          //Get adspot
          let adSpot = adSpots.find((obj)=> {
            return obj.get('_id') == catId;
          });

          //Concat adspots and categrorie movies
          //remove duplicates
          if (adSpot) {
            adSpotList = adSpot.get('adSpots');
            let filteredList = [];
            let spots = adSpotList.toJS() || [];
            spots = _.map(spots, (spot) => {
              spot.adSpot = true;
              return spot;
            });
            filteredList = filteredList.concat(spots).concat(dataList.toJS());

            let uniqSpots = _.uniq(filteredList, (o)=> {
              return o['_id'];
            });

            uniqSpots = _(uniqSpots)
              .reduce(::this.accumulateInBloc, [[]]);

            dataList = Immutable.fromJS(uniqSpots);
          }

          const label = categorie.get('label');
          const slug = categorie.get('slug');

          return <MoviesSlider
            key={`categorie-${categorie.get('_id')}-${i}`} {...this.props} {...{dataList, label, slug}} />
        }).toJS() : ''}
      </div>
    );
  }
}

export default MoviesList;
