import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { prepareRoute } from '../../decorators';
import * as CategoryActionCreators from '../../actions/category';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import config from '../../../../config';
import Poster from '../Movies/Poster';
import _ from 'lodash';

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
        Category,catIds
        }
      } = this;

    let categories = Category.get('meaList');

    if (!categories) {
      return (<div/>);
    }

    let selectionMovies = Immutable.fromJS([]);

    _.forEach(catIds, (id)=> {
      let categorie = categories.find(function (obj) {
        return obj.get('_id') === id;
      });
      if (categorie) {
        selectionMovies = selectionMovies.concat(categorie.get('movies'));
      }
    });

    return (
      <div>
        <div className="payment-pages__thumbs-row">
          {selectionMovies ? selectionMovies.map((data, i) => <Poster
            key={`movie-payment-a-${i}`} {...{data}}/>).toJS() : ''}
        </div>
      </div>
    );

  }
}

PaymentImages.propTypes = {
  catIds: React.PropTypes.array
};

PaymentImages.defaultProps = {
  catIds: [1, 3]
};

export default PaymentImages;
