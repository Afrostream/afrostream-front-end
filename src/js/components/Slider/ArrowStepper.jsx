import React, { Component, PropTypes } from 'react'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import shallowCompare from 'react-addons-shallow-compare'
import classSet from 'classnames'
import ReactDOM from'react-dom'

if (canUseDOM) {
  require('gsap')
  var {TweenMax, Expo} = window.GreenSockGlobals
}

/**
 * This HOC decorates a virtualized component and responds to arrow-key events by scrolling one row or column at a time.
 */
export default class ArrowStepper extends Component {

  static propTypes = {
    children: PropTypes.func.isRequired,
    className: PropTypes.string,
    columnCount: PropTypes.number.isRequired
  }

  componentDidMount () {
    const elTarget = ReactDOM.findDOMNode(this)
    this.container = elTarget.lastChild
    this.handleScroll()
  }

  componentWillUnmount () {
    clearTimeout(this.scrollTimeout)
  }

  /**
   * Scroll event
   */
  handleScroll () {
    clearTimeout(this.scrollTimeout)
    const self = this
    this.scrollTimeout = setTimeout(() => {
      if (this.container) {
        self._scrollLeft = this.container.scrollLeft
        self._clientWidth = this.container.clientWidth
        self._scrollWidth = this.container.scrollWidth
      }
      self.setState({
        clientWidth: this._clientWidth,
        scrollLeft: this._scrollLeft,
        scrollWidth: this._scrollWidth
      })
    }, 200)
  }


  constructor (props, context) {
    super(props, context)

    this.state = {
      scrollLeft: 0
    }

    this.clickTimer = 0
    this.clickDelay = 250
    this.continueClick = false
    this.direction = null
    this.container = null
    this.scrollTimeout = 0

    this._onScroll = ::this._onScroll
  }

  render () {
    const {className, children, columnCount} = this.props
    const {scrollLeft, scrollWidth, clientWidth} = this.state

    let maxScroll = scrollWidth - clientWidth || 0

    let leftArrowClasses = {
      'arrow': true,
      'arrow--left': true,
      'arrow--hidden': scrollLeft <= 0
    }

    let rightArrowClasses = {
      'arrow': true,
      'arrow--right': true,
      'arrow--hidden': scrollLeft === maxScroll
    }

    return (
      <div className={className}>
        <div ref="arrowLeft"
             className={classSet(leftArrowClasses)}
             onClick={::this.handleClick}
             onMouseDown={this.handleMouseDown.bind(this, 'left')}
             onMouseUp={::this.handleMouseUp}>
          <i className="zmdi zmdi-hc-8x zmdi-chevron-left"></i>
        </div>
        <div ref="arrowRight"
             className={classSet(rightArrowClasses)}
             onClick={::this.handleClick}
             onMouseDown={this.handleMouseDown.bind(this, 'right')}
             onMouseUp={::this.handleMouseUp}>
          <i className="zmdi zmdi-hc-8x zmdi-chevron-right"></i>
        </div>
        {children({
          onScroll: this._onScroll,
          columnCount,
          scrollLeft
        })}
      </div>
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
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
    this.clickTimer = setTimeout(()=>this.singleScroll(), this.clickDelay)
  }

  /**
   * Listen the click mode on mouseUp event
   * and reset all the default properties
   */
  handleMouseUp () {
    this.singleScroll()
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

  _onScroll ({clientWidth, scrollLeft, scrollWidth}) {
    this._scrollLeft = scrollLeft
    this._clientWidth = clientWidth
    this._scrollWidth = scrollWidth
    this.handleScroll()
  }
}
