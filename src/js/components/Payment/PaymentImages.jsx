import React from 'react';
import { connect } from 'react-redux';
import { prepareRoute } from '../../decorators';
import * as CategoryActionCreators from '../../actions/category';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import config from '../../../../config';
import Poster from '../Movies/Poster';

if (process.env.BROWSER) {
  require('./PaymentImages.less');
}

@prepareRoute(async function ({ store }) {
  return await * [
    store.dispatch(CategoryActionCreators.getMeaList())
  ];
})
@connect(({ Category }) => ({Category}))
class PaymentImages extends React.Component {

  /**
   * render two rows of thumbnails for the payment pages
   */
  render() {
    const {
      props: {
        Category
        }
      } = this;

    let categories = Category.get('meaList');

    if (!categories) {
      return (<div/>);
    }

    let selectionMovies = categories.find(function (obj) {
      return obj.get('_id') === 1;
    });

    let seriesMovies = categories.find(function (obj) {
      return obj.get('_id') === 3;
    });

    return (
      <div>
        <div className="payment-pages__thumbs-row">
          {selectionMovies ? selectionMovies.get('movies').map((movie, i) => <Poster
            key={`movie-payment-${i}`} {...{movie}}/>) : ''}
        </div>
        <div className="payment-pages__thumbs-row">
          {seriesMovies ? seriesMovies.get('movies').map((movie, i) => <Poster
            key={`movie-paymen-t-${i}`} {...{movie}}/>) : ''}
        </div>
      </div>
    );

  }
}

export default PaymentImages;
