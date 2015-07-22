import React from 'react/addons';
import {canUseDOM} from 'react/lib/ExecutionEnvironment'
import { Link } from 'react-router';

if (canUseDOM) {
  require('gsap');
  var {TimelineMax,TweenMax,Sine} = window.GreenSockGlobals;
}

class Slide extends React.Component {

  constructor(props) {
    super(props);
    this.tlIn = null;
  }

  initTransition() {
    const container = React.findDOMNode(this.refs.slContainer);
    const backGd = React.findDOMNode(this.refs.slBackground);
    const titleEl = React.findDOMNode(this.refs.slTitle);
    const synopsisE = React.findDOMNode(this.refs.slSynopsis);
    const slTag = React.findDOMNode(this.refs.slTag || this.refs.slNull);
    const slSeasons = React.findDOMNode(this.refs.slSeasons || this.refs.slSeasonNull);
    this.tlIn = new TimelineMax({paused: true});
    TweenMax.set(container, {transformStyle: 'preserve-3d', perspective: 100, perspectiveOrigin: '50% 50%'});
    this.tlIn.add(TweenMax.fromTo(container, 2, {autoAlpha: 0}, {autoAlpha: 1}));
    this.tlIn.add(TweenMax.fromTo(backGd, 22,
      {transform: 'translateZ(0)'},
      {transform: 'translateZ(5px)'}
    ), 0);
    this.tlIn.add(TweenMax.staggerFromTo([synopsisE, slSeasons, titleEl, slTag], 0.3,
      {transform: 'translateX(-80px)'},
      {transform: 'translateX(0)', ease: Sine.easeOut}
      , 0.05), 0);
  }

  lunchTransition() {
    if (!this.props.active) {
      return;
    }
    if (!this.tlIn) {
      this.initTransition();
    }
    this.tlIn.restart();
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
    let type = category.get('type');
    let synopsis = category.get('synopsis') || '';
    let slug = category.get('slug') || '';
    let nBSeasons = category.get('seasons') || [];
    let finalSeason = nBSeasons.size ? `${nBSeasons.size} saison` : '' + (nBSeasons.size > 1 ? 's' : '');
    //wrap text
    if (synopsis.length >= maxLength) {
      let cutIndex = synopsis.indexOf(' ', maxLength);
      let shortDescription = synopsis.substring(0, cutIndex) + '...';
      synopsis = shortDescription;
    }

    return (
      <div ref="slContainer" className={classes}>

        <Link to={`${type}/${slug}`}>
          <div ref="slBackground" className="slide-background" style={imageStyles}/>
        </Link>

        <div className="btn-play"/>

        <div className="billboard-infos">
          {type ? <div ref="slTag" className="billboard-tag">{type}</div> : <div ref="slNull"/>}
          <div ref="slTitle" className="billboard-title">{title}</div>
          {nBSeasons.size ? <div ref="slSeasons" className="billboard-seasons">{finalSeason}</div> :
            <div ref="slSeasonNull"/>}
          <div ref="slSynopsis" className="billboard-synopsis">{synopsis}</div>
          <a href={category.get('link')}>{category.get('link')}</a>
        </div>
      </div>
    );
  }
}

export default Slide;
