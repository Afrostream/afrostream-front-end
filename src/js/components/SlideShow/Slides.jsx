import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import MovieInfo from '../Movies/MovieInfo';
import ReactList from 'react-list';

class Slides extends React.Component {

  static propTypes = {
    slides: PropTypes.instanceOf(Immutable.List).isRequired,
    page: React.PropTypes.number.isRequired
  };

  render() {
    const {
      props: { slides,page }
      } = this;

    const movieObj = slides.get(page);

    return (
      <div className="slides">
        <MovieInfo active={true} maxLength={200}
                   key={`slide-${movieObj.get('_id')}`}  { ...{movieObj}}/>
      </div>
    );
    //This buil all slides i test it whith only one slide for perf
    //{slides.map((movieObj, i) => <MovieInfo active={page === i} maxLength="200"
    //                                        key={`slide-${movieObj.get('_id')}-${i}`}
    //  { ...{movieObj}}/>)}
  }
}

export default Slides;
