import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import Slide from './Slide';
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

    return (
      <div className="slides">
        {slides.map((category, i) => <Slide active={page === i}
                                            key={`slide-${category.get('_id')}-${i}`}
          { ...{category}}/>)}
      </div>
    );
  }
}

export default Slides;
