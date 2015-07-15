import React from 'react/addons';

class Slide extends React.Component {
  render() {
    const classes = React.addons.classSet({
      'slide': true,
      'slide--active': this.props.active
    });
    const {
      props: {slideNode }
      } = this;

    let imageStyles = {backgroundImage: `url(${slideNode.get('poster')})`};

    return (
      <div className={classes}>
        <div className="slide-background" style={imageStyles}/>
        <div className="billboard-infos">
          <h2>{slideNode.get('title')}</h2>

          <h3>{slideNode.get('synopsis')}</h3>

          <p>{slideNode.get('text')}</p>
          <a href={slideNode.get('link')}>{slideNode.get('link')}</a>
        </div>
      </div>
    );
  }
}

export default Slide;
