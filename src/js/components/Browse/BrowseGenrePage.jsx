import React from 'react';
import { prepareRoute } from '../../decorators';
import { connect } from 'react-redux';
import * as CategoryActionCreators from '../../actions/category';
import MoviesSlider from '../Movies/MoviesSlider';
import Spinner from '../Spinner/Spinner';
import NoMatch from '../NoMatch';

if (process.env.BROWSER) {
  require('./BrowseGenrePage.less');
}
@prepareRoute(async function ({store, params: {categoryId}}) {
  return await * [
    store.dispatch(CategoryActionCreators.getCategory(categoryId))
  ];
})
@connect(({Category}) => ({Category}))
class BrowseGenrePage extends React.Component {

  constructor (props) {
    super(props);
  }

  renderList () {
    const {
      props: {
        Category,
        params :{
          categoryId
        }
      }
    } = this;

    const categorie = Category.get(`categorys/${categoryId}`);

    if (!categorie) {
      return (<Spinner />);
    }

    const type = categorie.get('type');
    const adSpots = categorie.get('adSpots');
    const dataList = categorie.get('movies');
    const label = categorie.get('label');
    const slug = categorie.get('slug');
    const poster = categorie.get('poster');

    if (type === 'error') {
      return <NoMatch {...{label, poster}}/>;
    }

    return (<div className="browse-categorie_list">

      <MoviesSlider axis="x" className="movies-data-list ad-spots" thumbW={239} thumbH={465} type="adspot"
                    fit="facearea" crop="faces"
                    key={`genre-adspot-${categorie.get('_id')}`}
                    dataList={adSpots} {...this.props} {...{label}}/>

      <MoviesSlider axis="y"
                    key={`genre-${categorie.get('_id')}`} {...this.props} {...{dataList}} />
    </div>);
  }

  render () {
    return (
      <div className="row-fluid browse-genre_page">
        {this.renderList()}
      </div>
    );
  }
}

export default BrowseGenrePage;
