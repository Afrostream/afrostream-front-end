import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import MovieInfo from '../Movies/MovieInfo';

class Slides extends React.Component {

  static propTypes = {
    slides: PropTypes.instanceOf(Immutable.List).isRequired,
    page: React.PropTypes.number.isRequired
  };

  render() {
    const {
      props: { slides,page }
      } = this;

    if (!slides) {
      return (<div />)
    }
    const data = slides.get(page);
    const dataId = data.get('_id');
    return (
      <MovieInfo active={true} maxLength={200} load={true}
                 key={`slide-${data.get('_id')}`}  { ...{data, dataId}}/>
    );
  }
}

export default Slides;
