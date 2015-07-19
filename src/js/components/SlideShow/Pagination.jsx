import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import Pager from './Pager';

class Pagination extends React.Component {

  static propTypes = {
    slides: PropTypes.instanceOf(Immutable.List).isRequired,
    page: React.PropTypes.number.isRequired
  };

  render() {
    const {
      props: { slides,page }
      } = this;

    return (
      <div className="pagination">
        {slides.map((category, i) => <Pager
          active={page === i}
          index={i}
          key={`page-${category.get('_id')}-${i}`}
          {...{category}} />)}
      </div>
    );
  }
}

export default Pagination;
