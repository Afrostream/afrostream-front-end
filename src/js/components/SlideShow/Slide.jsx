import React from 'react/addons';
import {canUseDOM} from 'react/lib/ExecutionEnvironment'
import { Link } from 'react-router';

if (canUseDOM) {
  require('gsap');
  var {TimelineMax,TweenMax} = window.GreenSockGlobals;
}

class Slide extends React.Component {

  constructor(props) {
    super(props);
    this.tl = null;
  }

  initTransition() {
    const container = React.findDOMNode(this.refs.slContainer);
    const backGd = React.findDOMNode(this.refs.slBackground);
    const titleEl = React.findDOMNode(this.refs.slTitle);
    const synopsisE = React.findDOMNode(this.refs.slSynopsis);
    this.tl = new TimelineMax({paused: true});
    TweenMax.set(container, {transformStyle: 'preserve-3d', perspective: 100, perspectiveOrigin: '50% 50%'});
    this.tl.add(TweenMax.fromTo(container, 2, {autoAlpha: 0}, {autoAlpha: 1}));
    this.tl.add(TweenMax.fromTo(backGd, 22,
      {transform: 'translateZ(0)'},
      {transform: 'translateZ(5px)'}
    ), 0);
    this.tl.add(TweenMax.staggerFromTo([titleEl, synopsisE], 1,
      {transform: 'translateX(-450px)'},
      {transform: 'translateX(0)'}
      , 0.25), 0);
  }

  lunchTransition() {
    if (!this.props.active) {
      return;
    }
    if (!this.tl) {
      this.initTransition();
    }
    //Animation already started
    if (this.tl.isActive()) {
      return;
    }
    this.tl.restart();
  }

  componentDidUpdate() {
    this.lunchTransition();
  }

  componentDidMount() {
    this.lunchTransition();
  }

  render() {
    const maxLength = 450;
    const classes = React.addons.classSet({
      'slide': true,
      'slide--active': this.props.active
    });
    const {
      props: {category }
      } = this;

    let imageStyles = {backgroundImage: `url(${category.get('poster')})`};

    let title = category.get('title');
    let tags = category.get('tags') || [];
    let synopsis = category.get('synopsis') || '';
    //wrap text
    if (synopsis.length >= maxLength) {
      let cutIndex = synopsis.indexOf(' ', maxLength);
      let shortDescription = synopsis.substring(0, cutIndex) + '...';
      synopsis = shortDescription;
    }

    return (
      <div ref="slContainer" className={classes}>
        <div ref="slBackground" className="slide-background" style={imageStyles}/>
        <div className="billboard-infos">
          <ul ref="tags" className="billboard-tag-list">
            {tags.map((tag) => <li className="billboard-tag"><Link to={tag}>{tag}</Link></li>)}
          </ul>
          <div ref="slTitle" className="billboard-title">{title}</div>
          <div ref="slSynopsis" className="billboard-synopsis">{synopsis}</div>
          <a href={category.get('link')}>{category.get('link')}</a>
        </div>
      </div>
    );
  }
}

export default Slide;
