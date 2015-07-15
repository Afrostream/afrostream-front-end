import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import Pager from './Pager';

class Pagination extends React.Component {

  static propTypes = {
    slides: PropTypes.instanceOf(Immutable.List).isRequired
  }

  render() {
    const {
      props: { slides }
      } = this;

    //return (
    //  <div className="pagination">
    //    {slides.map(page => <Pager
    //      id={page.get('id')}
    //      key={page.get('id')}
    //      {...{page}} />)}
    //  </div>
    //);
    return (<div />);
  }
}

export default Pagination;
