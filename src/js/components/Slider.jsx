import React from 'react/addons';
import penner from 'penner';
import {canUseDOM} from 'react/lib/ExecutionEnvironment'
/**
 * requestAnimationFrame for Smart Animating
 * from http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
 */
const requestAnimFrame = (function () {
  if (canUseDOM) {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (callback) {
        setTimeout(() => callback(), 1000 / 60);
      };
  }
})();

class Slider extends React.Component {

  static propTypes = {
    step: React.PropTypes.number,
    duration: React.PropTypes.number
  };

  static defaultProps = {
    step: 2,
    duration: null
  };

  static contextTypes = {
    lazyLoadTrigger: React.PropTypes.func
  };

  constructor(props) {
    super(props);
    this.clickTimer = 0;
    this.clickDelay = 250;
    this.continueClick = false;
    this.direction = null;
    this.scrolling = false;
    this.container = null;
    this.scrollLeft = 0;
  }

  componentDidMount() {
    this.container = React.findDOMNode(this).lastChild;
    this.container.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    this.container.removeEventListener('scroll', this.handleScroll);
  }

  /**
   * Scroll event
   */
  handleScroll() {
    this.scrollLeft = this.container.scrollLeft;
    this.triggerLazyLoading();
  }

  /**
   * Click event is not triggered
   *
   * @param e {Object} Event
   */
  handleClick(event) {
    return event.preventDefault();
  }

  /**
   * Set direction to component
   * and listen the click mode on mouseDown event
   *
   * @param direction {String} Left|Right scroll direction
   */
  handleMouseDown(direction) {
    this.direction = direction;
    this.clickTimer = setTimeout(() => this.continueScroll(), this.clickDelay);
  }

  /**
   * Listen the click mode on mouseUp event
   * and reset all the default properties
   */
  handleMouseUp() {
    if (this.continueClick) {
      // Stop continue animation on mouse up
      this.scrolling = false;
    } else {
      // Start single scroll mode
      this.singleScroll();
    }

    // Reset properties
    this.direction = null;
    clearTimeout(this.clickTimer);
  }

  /**
   * Defined the step according to its direction
   *
   * @param stepWidth {Number} Step transition size
   */
  scrollingTo(stepWidth) {
    return this.direction === 'left' ? -Math.abs(stepWidth) : stepWidth;
  }

  /**
   * Start Continue Scroll mode animation
   */
  continueScroll() {
    this.continueClick = true;

    let to = this.scrollingTo(this.container.scrollWidth);
    let duration = this.props.duration || 800;

    this.animateHorizontalScroll('continue', to, duration);
  }

  /**
   * Start Single Scroll mode animation
   */
  singleScroll() {
    let item = this.container.firstChild;
    let itemWidth = item.offsetWidth * this.props.step;
    let to = this.scrollingTo(itemWidth);

    this.animateHorizontalScroll('single', to);
  }

  /**
   * Alert the lazy loaded components inside the slider that something has changed.
   */
  triggerLazyLoading() {
    let item = React.findDOMNode(this).lastChild.firstChild;
    let stepWidth = item.offsetWidth * this.props.step;
    if (typeof this.context.lazyLoadTrigger !== 'undefined') {
      // The overlap is set to the value of the single step scroll
      this.context.lazyLoadTrigger(stepWidth);
    }
  }

  /**
   * Animation scroll function
   *
   * @param type     {String} Type of transition [single|continue]
   * @param to       {Number} Position to scroll in pixel
   * @param duration {Number} Duration of the animation
   */
  animateHorizontalScroll(type, to, duration) {
    if (this.scrolling) {
      return;
    }

    this.scrolling = true;

    let start = this.container.scrollLeft;
    let currentTime = 0;
    let increment = 20;
    duration = duration || 500;

    let animate = type === 'single' ? penner.easeInOutCubic : penner.easeInCubic;

    let animateScroll = function () {
      currentTime += increment;
      this.container.scrollLeft = animate(currentTime, start, to, duration);

      this.triggerLazyLoading();

      if (this.scrolling && (currentTime < duration)) {
        requestAnimFrame(animateScroll.bind(this));
      } else {
        // Animation done
        this.scrolling = false;
        this.continueClick = false;
      }
    };

    requestAnimFrame(animateScroll.bind(this));
  }

  render() {

    const leftArrowClasses = React.addons.classSet({
      'arrow': true,
      'arrow--left': true
    });

    const rightArrowClasses = React.addons.classSet({
      'arrow': true,
      'arrow--right': true
    });

    const sliderClasses = React.addons.classSet({
      'slider': true
    });

    //sliderClasses[this.props.className] = this.props.className !== undefined;

    // Display arrows
    if (this.container) {
      let scrollLeft = this.scrollLeft;

      // Reset scrollLeft state when footer is closed and reopened
      if (this.container.scrollLeft === 0) {
        this.scrollLeft = 0;
      }

      let maxScroll = this.container.scrollWidth - this.container.clientWidth;
      let diffScrollWidth = this.container.scrollWidth !== this.container.clientWidth;

      //leftArrowClasses['arrow--hidden'] = scrollLeft <= 0;
      //rightArrowClasses['arrow--hidden'] = (scrollLeft === maxScroll) && diffScrollWidth;
    }

    return (

      <div {...this.props} className={sliderClasses}>
        <a
          href="#"
          className={leftArrowClasses}
          onClick={::this.handleClick}
          onMouseDown={this.handleMouseDown.bind(this, 'left')}
          onMouseUp={::this.handleMouseUp}>
          <i className="fa fa-chevron-left"></i>
        </a>
        <a
          href="#"
          className={rightArrowClasses}
          onClick={::this.handleClick}
          onMouseDown={this.handleMouseDown.bind(this, 'right')}
          onMouseUp={::this.handleMouseUp}>
          <i className="fa fa-chevron-right"></i>
        </a>
        {this.props.children}
      </div>
    );
  }
}

export default Slider;