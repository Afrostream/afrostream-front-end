import React from 'react/addons';
import { Link } from 'react-router';

class Thumb extends React.Component {

  static propTypes = {
    movie: React.PropTypes.object.isRequired
  };

  render() {
    const {
      props: { movie }
      } = this;

    let imageStyles = {backgroundImage: `url(${movie.get('poster')})`};
    let title = movie.get('title');

    return (
      <li className="thumb">
        <div className="thumb-background" style={imageStyles}/>
        <div className="thumb-info">
          <div className="thumb-info__title">{title}</div>
        </div>
      </li>
    );
  }
}

export default Thumb;
