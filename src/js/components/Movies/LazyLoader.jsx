import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import Thumb from './Thumb';
class LazyLoader extends React.Component {

  static propTypes = {
    viewport: React.PropTypes.object,
    movies: PropTypes.instanceOf(Immutable.List).isRequired
  };

  static defaultProps = {
    viewport: {
      left: 0,
      width: 0
    }
  };

  state = {viewport: this.props.viewport};

  componentDidMount() {
    let container = React.findDOMNode(this);
    container.addEventListener('scroll', this.updateViewport.bind(this));
    container.addEventListener('resize', this.updateViewport.bind(this));
    this.updateViewport();
  }

  componentWillUnmount() {
    let container = React.findDOMNode(this);
    container.removeEventListener('scroll', this.updateViewport.bind(this));
    container.removeEventListener('resize', this.updateViewport.bind(this));
  }

  updateViewport() {
    // TODO: debounce this call
    let element = React.findDOMNode(this);
    this.setState({
      viewport: {
        left: element.scrollLeft,
        width: window.innerWidth
      }
    });
  }

  render() {
    const { props: { movies } } = this;

    return (
      <div className="slider-container">
        {movies ? movies.map((movie, i) => <Thumb viewport={this.state.viewport}
                                                  key={`movie-${movie.get('_id')}-${i}`} {...{movie}}/>) : ''}
      </div>
    );
  }
}

export default LazyLoader;
