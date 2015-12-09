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

  /**
   * getThumbsByCategory
   *
   * get thumb urls from the movies of a given category
   *
   * @param   {array} categoryMovies  array of movie objects
   *
   * @return  {array} thumbs          array of thumbnail urls
   */
  getThumbsByCategory(categoryMovies) {

    let thumbs = [];

    categoryMovies.forEach(function (movie) {
      let posterImg = movie.get('thumb') ? movie.get('thumb').get('imgix') : '';
      thumbs.push(posterImg);
    });

    return thumbs;
  }

  /**
   * generateThumbRow
   *
   * generate react markup containing a row of thumb images
   *
   * @param   {array}   thumbsArray array with urls of thumb images
   *
   * @return  {object}  thumbsRow   array containing react markup
   */
  generateThumbRow(thumbsArray) {
    self = this;
    let thumbsRow = [];
    thumbsArray.forEach(function(thumbUrl) {

      let bgCss = self.getBackgroundImageCss(thumbUrl);
      thumbsRow.push(<div className="payment-page__thumb" style={bgCss}></div>);
    });

    return thumbsRow;
  }

  /**
   * getBackgroundImageCss
   *
   * generate css for background image
   *
   * @param   {string}  thumbUrl  url for image
   *
   * @return {object}             react inline css style
   */
  getBackgroundImageCss(thumbUrl) {

    const baseUrl = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    let imageStyles = baseUrl;

    return {backgroundImage: `url(${thumbUrl}?crop=faces&fit=crop&w=140&h=200&q=${config.images.quality}&fm=${config.images.type})`};
  }

  /**
   * render two rows of thumbnails for the payment pages
   */
  render() {
    const {
      props: {
        Category
        }
      } = this;

    let categories = Category.get('meaList') || [];
    let movies = [];
    let notreSelection = [];
    let series = []

    categories.forEach(function(category) {
      if (category.get('_id') === 1 || category.get('_id') === 3 ) {
        movies.push(category.get('movies'));
      }
    });

    if (movies[0]){
      notreSelection = this.getThumbsByCategory(movies[0]);
    }

    if (movies[1]){
      series = this.getThumbsByCategory(movies[1]);
    }

    let nsIcons = this.generateThumbRow(notreSelection);
    let seriesIcons = this.generateThumbRow(series);

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
