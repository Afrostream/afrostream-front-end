import React from 'react';
import { connect } from 'redux/react';
import { prepareRoute } from '../decorators';
import * as CategoryActionCreators from '../actions/category';
import * as SlidesActionCreators from '../actions/slides';
import { Link } from 'react-router';
import SlideShow from './SlideShow/SlideShow';

@prepareRoute(async function ({ redux, params: { category } }) {
  return await * [
      redux.dispatch(CategoryActionCreators.getCategory(category)),
      redux.dispatch(SlidesActionCreators.getTopByCategory(category))
    ];
})
@connect(({ Category }) => ({Category})) class HomePage extends React.Component {

  render() {
    const {
      props: {
        Category,
        params: { category }
        }
      } = this;

    console.log(Category);
    const list = Category.get(`category/${category}`);

    return (
      <div className="row-fluid">
        {list ? <SlideShow /> : 'Loading...'}
      </div>
    );
  }
}

export default HomePage;
