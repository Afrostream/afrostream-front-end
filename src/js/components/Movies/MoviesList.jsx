import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import ReactList from 'react-list';
import MoviesSlider from './MoviesSlider';

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

  renderList (index) {
    const {
      props: {
        Category
      }
    } = this;

    //LIST
    const categories = Category.get('meaList');
    const adSpots = Category.get(`categorys/spots`);

    //ITEM
    let categorie = categories.get(index);
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
      className="movies-data-list spots"
      key={`categorie-${categorie.get('_id')}-${index}`} {...this.props} {...{dataList, label, slug}} />
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
        <ReactList
          ref="react-movies-list"
          useTranslate3d={true}
          axis="y"
          itemRenderer={::this.renderList}
          length={categories.size}
          type={'uniform'}
        />
      </div>
    );
  }
}

export default MoviesList;
