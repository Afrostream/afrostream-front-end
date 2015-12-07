import React from 'react';
import { connect } from 'react-redux';
import { prepareRoute } from '../../decorators';
import * as CategoryActionCreators from '../../actions/category';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import config from '../../../../config';

if (process.env.BROWSER) {
  require('./PaymentImages.less');
}

@prepareRoute(async function ({ store }) {
  return await * [
      store.dispatch(CategoryActionCreators.getMeaList())
    ];
})
@connect(({ Category }) => ({Category})) class PaymentImages extends React.Component {

  getBackgroundImageCss(thumbUrl) {

    const baseUrl = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    let imageStyles = baseUrl;

    return {backgroundImage: `url(${thumbUrl}?crop=faces&fit=crop&w=140&h=200&q=${config.images.quality}&fm=${config.images.type})`};
  }

  generateIconRows(thumbsArray) {
    self = this;
    let thumbsRow = [];
    thumbsArray.forEach(function(thumbUrl) {

      let bgCss = self.getBackgroundImageCss(thumbUrl);
      thumbsRow.push(<div className="payment-page__thumb" style={bgCss}></div>);
    });

    return thumbsRow;
  }


  render() {
    const {
      props: {
        Category
        }
      } = this;

    const categories = Category.get('meaList') ? Category.get('meaList') : [];
    let movies = [];
    let notreSelection = [];
    let series = []

    categories.forEach(function(category) {
      movies.push(category.get('movies'));
    });

    if (movies[0]){
      movies[0].forEach(function (movie) {
        let posterImg = movie.get('thumb').get('imgix');
        notreSelection.push(posterImg);
      });
    }

    if (movies[1]){
      movies[1].forEach(function (movie) {
        let posterImg = movie.get('thumb').get('imgix');
        series.push(posterImg);
      });
    }

    let nsIcons = this.generateIconRows(notreSelection);
    let seriesIcons = this.generateIconRows(series);

    return (
      <div>
        <div className="payment-pages__thumbs-row">
        {nsIcons}
        </div>
        <div className="payment-pages__thumbs-row">
          {seriesIcons}
        </div>
      </div>
    );

  }
}

export default PaymentImages;
