import React, { PropTypes } from 'react'
import ReactDOM from'react-dom'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { prepareRoute } from '../../decorators'
import SlidesContainer from './Slides'
import Pagination from './Pagination'
import Controls from './Controls'
import Spinner from '../Spinner/Spinner'
import * as SlidesActionCreators from '../../actions/slides'
import * as CategoryActionCreators from '../../actions/category'
import config from '../../../../config'
import { withRouter } from 'react-router'

if (process.env.BROWSER) {
  require('./SlideShow.less');
}
@prepareRoute(async function ({ store }) {
  return await * [
    store.dispatch(CategoryActionCreators.getSpots())
  ];
})
@connect(({ Category, Slides }) => ({Category, Slides}))
class SlideShow extends React.Component {

  constructor(props) {
    super(props);
    this.interval = 0;
  }

  _extendGestureObj (settings) {
    var obj = {};

    obj.dir = settings.dir;
    obj.id = settings.id;
    obj.start = settings.sT;
    obj.delta = {};
    obj.delta.x = settings.dX;
    obj.delta.y = settings.dY;

    return obj;
  }

  initTouch() {

    const self = this,
    // touchPosition
      sPos = {
        dY: 0,
        dX: 0,
        scroll: 0,
        dir: 0,
        userDragging: false,
        sT: null,
        listenDrag: true
      },

    // Slope to determine if user is swiping
      SLOPE = 0.5,
    // Velocity of finger movement to determine user swiping
      VELOCITY = 0.5,
    // Maximum duration between touchstart and touchend to determine tap
      TAP_THRESHOLD = 650,
    // Minimum number of pixels a user moves before dragging starts
      DRAG_THRESHOLD = 10,
    // Maximum number of pixels a user can move between taps
      TAP_DISTANCE = 10;

    const container = ReactDOM.findDOMNode(this.refs.slC);
    let touchEvent = null;

    container.addEventListener('touchstart', function (e) {
      // Stop click and other mouse events from triggering also
      if (e.target.type && e.targe.type === 'button') {
        return;
      }
      e.preventDefault();
      touchEvent = e;
      var t = e.changedTouches[0],
        s = sPos;
      // Reset touch related variables
      s.dY = 0;
      s.dX = 0;
      s.scroll = 0;
      s.dir = 0;
      s.userDragging = false;
      // Set initial touch properties
      s.sX = Math.abs(t.screenX);
      s.sY = Math.abs(t.screenY);
      s.sT = new Date().getTime();
      s.id = t.identifier;
    });
    container.addEventListener('touchmove', function (e) {
      var t = e.changedTouches[0],
        gestureEv,
        s = sPos;
      // Ignore scrolling
      if (s.scroll) {
        return;
      }

      // Set direction
      s.dir = s.dX >= (t.screenX - s.sX) ? -1 : 1;
      // Update points
      s.dX = t.screenX - s.sX;
      s.dY = t.screenY - s.sY;
      // Is scroll intended?
      if (!s.userDragging && (Math.abs(s.dY / s.dX) > SLOPE)) {
        s.scroll = 1;
        return;
      }

      // Handle drag callbacks
      if (s.userDragging || (s.listenDrag && (Math.abs(s.dY) > DRAG_THRESHOLD || Math.abs(s.dX) >= DRAG_THRESHOLD))) {
        gestureEv = self._extendGestureObj(s);
        e.preventDefault();

        if (!s.userDragging) {
          s.sX = t.screenX;
          s.sY = t.screenY;

          gestureEv = self._extendGestureObj(s);
          gestureEv.type = 'dragstart';

          s.userDragging = true;
        } else {
          gestureEv.type = 'drag';
        }
      }
    });

    container.addEventListener('touchend', function (e) {
      var t = e.changedTouches[0],
        s = sPos, d = new Date().getTime(),
        pX = Math.abs(t.screenX),
        pY = Math.abs(t.screenY),
        swipeTriggered = false,
        gestureEv,
        diffT,
        diffP;

      diffT = d - s.sT;

      // Delta between start/end points
      diffP = Math.floor(Math.sqrt(((pX - s.sX) * (pX - s.sX) + (pY - s.sY) * (pY - s.sY))));

      gestureEv = self._extendGestureObj(s);
      gestureEv.end = d;
      gestureEv.duration = diffT;

      // Determine if user swiped, and handle callback
      if ((Math.abs(s.sX - pX) / Math.abs(s.sT - d)) > VELOCITY) {
        gestureEv.velocity = (Math.abs(s.sX - pX) / Math.abs(s.sT - d));
        gestureEv.type = 'swipe';
        swipeTriggered = true;
        self.onSwipe(gestureEv)
      }
      // Determine if user dragged, and handle callback
      if (s.userDragging) {
        s.userDragging = false;
        gestureEv.type = 'dragend';
        gestureEv.swipe = swipeTriggered;
      }
      // Determine if user tapped, and handle callback
      if (TAP_THRESHOLD > diffT && TAP_DISTANCE > diffP) {
        delete gestureEv.dir;
        delete gestureEv.delta;
        gestureEv.type = 'tap';
        if (touchEvent && e.target) {
          if (e.target.pathname) {
            return self.props.router.pushState(null, e.target.pathname);
          }
        }
      }
    });
  }

  render() {
    const {
      props: {
        Category,
        Slides
        }
      } = this;

    const categoryId = Category.get(`categoryId`);
    if (!categoryId) {
      return (<div />)
    }
    const slides = Category.get(`categorys/${categoryId}/spots`);
    const page = Slides.get('page') || 0;

    return (
      <div className="slide-show" ref="slC">
        {slides ? <SlidesContainer page={page} {...{slides}}/> : <Spinner />}
        {slides ? <Pagination page={page} {...{slides}}/> : ''}
      </div>
    );
  }

  //Next prev button
  //<Controls />

  componentDidMount() {
    this.initTouch();
  }

  componentWillUnmount() {
    clearTimeout(this.interval);
  }

  componentDidUpdate() {
    clearTimeout(this.interval);
    this.interval = setTimeout(() => this.toggleNext(), config.carousel.interval);
  }

  onSwipe(e) {
    clearTimeout(this.interval);
    if (e.dir === -1) {
      this.togglePrev();
    }
    else {
      this.toggleNext();
    }
  }

  toggleNext() {

    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(SlidesActionCreators.toggleNext());
  }

  togglePrev() {

    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(SlidesActionCreators.togglePrev());
  }
}

SlideShow.propTypes = {
  history: React.PropTypes.object
};

export default withRouter(SlideShow)
