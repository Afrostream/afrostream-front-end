import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import Thumb from '../../../components/Movies/Thumb';
import SignUpButton from '../../User/SignUpButton';
import _ from 'lodash';

if (process.env.BROWSER) {
  require('./Spots.less');
}

@connect(({Category}) => ({Category}))
class Spots extends React.Component {

  getMovies (data) {
    return <Thumb favorite={false}
                  key={`spot-home-${data.get('_id')}`} {...{data}}/>;
  }

  /**
   * render two rows of thumbnails for the payment pages
   */
  render () {
    const {
      props: {
        Category
      }
    } = this;

    let categories = Category.get('categorys/spots');

    if (!categories) {
      return (<div />);
    }
    let recoList = [];
    categories.map((categorie)=> {
      let catMovies = categorie.get('adSpots');
      if (catMovies) {
        recoList = recoList.concat(catMovies.toJS());
      }
    });

    let uniqSpots = _.uniq(recoList, (o)=> {
      return o['_id'];
    });

    let categoriesList = Immutable.fromJS(uniqSpots);

    return (
      <div className="categorie-list">
        <h2>Aperçu de notre catalogue</h2>
        {categoriesList ? categoriesList.map((movie, i) => this.getMovies(movie)).toJS() : ''}
        <div className="container sign-up__container">
          <SignUpButton />
        </div>
      </div>
    );

  }
}

export default Spots;
