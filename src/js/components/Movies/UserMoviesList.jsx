import React from 'react';
import { connect } from 'react-redux';
import MoviesSlider from './MoviesSlider';
import {dict} from '../../../../config'

if (process.env.BROWSER) {
  require('./MoviesList.less');
}

@connect(({ User }) => ({User}))
class UserMoviesList extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {
      props: {
        User
        }
      } = this;

    const dataList = User.get('history');
    if (!dataList) {
      return (<div />);
    }
    const label = dict.history.label;
    const slug = 'history';
    const showDescription = true;
    const thumbW = 200;
    const thumbH = 110;
    const type = 'episode';
    return (
      <div className="movies-list">
        <MoviesSlider
          key={`user-movie-history`} {...{dataList, label, slug, showDescription, type, thumbW, thumbH}} />
      </div>
    );
  }
}

export default UserMoviesList;
