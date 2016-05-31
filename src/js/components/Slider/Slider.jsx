import React from 'react'
import ReactDOM from'react-dom'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import classSet from 'classnames'

if (canUseDOM) {
  require('gsap')
  var {TweenMax, Expo} = window.GreenSockGlobals
}

class Slider extends React.Component {

  static propTypes = {
    step: React.PropTypes.number,
    duration: React.PropTypes.number,
    axis: React.PropTypes.string
  }

  static defaultProps = {
    duration: null,
    axis: 'x'
  }

  static contextTypes = {
    lazyLoadTrigger: React.PropTypes.func
  }

  constructor (props) {
    super(props)
    this.clickTimer = 0
    this.clickDelay = 250
    this.continueClick = false
    this.direction = null
    this.container = null
    this.scrollLeft = 0
    this.scrollTimeout = 0

  }

  componentDidMount () {
    const elTarget = ReactDOM.findDOMNode(this)
    this.container = elTarget.childNodes[elTarget.childNodes.length - 2].firstChild
    this.container.addEventListener('scroll', ::this.handleScroll)
    this.handleScroll()
  }

  componentWillUnmount () {
    clearTimeout(this.scrollTimeout)
    this.container.removeEventListener('scroll', ::this.handleScroll)
  }

  /**
   * Scroll event
   */
  handleScroll () {
    clearTimeout(this.scrollTimeout)
    this.scrollTimeout = setTimeout(()=> {
      this.setState({
        scrollLeft: this.container.scrollLeft
      })
    }, 200)
  }

  onScroll ({scrollLeft, scrollTop, totalColumnsWidth, totalRowsHeight}) {
    this.setState({scrollLeft, scrollTop, totalColumnsWidth, totalRowsHeight})
  }

  /**
   * Click event is not triggered
   *
   * @param e {Object} Event
   */
  handleClick (event) {
    return event.preventDefault()
  }

  /**
   * Set direction to component
   * and listen the click mode on mouseDown event
   *
   * @param direction {String} Left|Right scroll direction
   */
  handleMouseDown (direction) {
    this.direction = direction
    this.clickTimer = setTimeout(() => this.continueScroll(), this.clickDelay)
  }

  /**
   * Listen the click mode on mouseUp event
   * and reset all the default properties
   */
  handleMouseUp () {
    if (this.continueClick) {
      // Stop continue animation on mouse up
      this.scrolling = false
    } else {
      // Start single scroll mode
      this.singleScroll()
    }

    // Reset properties
    this.direction = null
    clearTimeout(this.clickTimer)
  }

  /**
   * Defined the step according to its direction
   *
   * @param stepWidth {Number} Step transition size
   */
  scrollingTo (stepWidth) {
    return this.direction === 'left' ? -Math.abs(stepWidth) : stepWidth
  }

  /**
   * Start Continue Scroll mode animation
   */
  continueScroll () {

    let to = this.scrollingTo(this.container.scrollWidth)

    this.animateHorizontalScroll(to)
  }

  /**
   * Start Single Scroll mode animation
   */
  singleScroll () {
    let to = this.scrollingTo(this.container.offsetWidth)

    this.animateHorizontalScroll(to)
  }

  /**
   * Animation scroll function
   *
   * @param type     {String} Type of transition [single|continue]
   * @param to       {Number} Position to scroll in pixel
   * @param duration {Number} Duration of the animation
   */
  animateHorizontalScroll (to) {
    TweenMax.to(this.container, 0.8, {scrollLeft: (this.container.scrollLeft + to), ease: Expo.easeInOut})
  }

  render () {

    //sliderClasses[this.props.className] = this.props.className !== undefined

    // Display arrows
    let scrollLeft = this.state ? (this.state.scrollLeft || 0) : 0
    let maxScroll = 0
    if (this.container) {
      maxScroll = this.container.scrollWidth - this.container.clientWidth
      // Reset scrollLeft state when footer is closed and reopened
      if (this.container.scrollLeft === 0 && this.state) {
        this.state.scrollLeft = 0
      }
    }

    let leftArrowClasses = {
      'arrow': true,
      'arrow--left': true,
      'arrow--hidden': scrollLeft <= 0
    }

    let rightArrowClasses = {
      'arrow': true,
      'arrow--right': true,
      'arrow--hidden': (scrollLeft === maxScroll)
    }

    let sliderClasses = {
      'slider': true,
      'axis-x': this.props.axis === 'x'
    }

    return (

      <div {...this.props} className={classSet(sliderClasses)}>
        <a
          ref="arrowLeft"
          href="#"
          className={classSet(leftArrowClasses)}
          onClick={::this.handleClick}
          onMouseDown={this.handleMouseDown.bind(this, 'left')}
          onMouseUp={::this.handleMouseUp}>
          <i className="zmdi zmdi-hc-8x zmdi-chevron-left"></i>
        </a>
        <a
          ref="arrowRight"
          href="#"
          className={classSet(rightArrowClasses)}
          onClick={::this.handleClick}
          onMouseDown={this.handleMouseDown.bind(this, 'right')}
          onMouseUp={::this.handleMouseUp}>
          <i className="zmdi zmdi-hc-8x zmdi-chevron-right"></i>
        </a>
        {this.props.children}
      </div>
    )
  }
}

export default Slider
