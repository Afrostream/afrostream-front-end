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
    columnCount: PropTypes.number.isRequired,
    scrollLeft: PropTypes.number
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

    this.setState({
      hideProgress: false,
      tipActive: this.activeSectionCheck()
    })

    this.scrollTimeout = setTimeout(() => {
      if (this.container) {
        this._scrollLeft = this.container.scrollLeft
        this._clientWidth = this.container.clientWidth
        this._scrollWidth = this.container.scrollWidth
        //this._nbProgressTip = Math.ceil(this._scrollWidth / this._clientWidth)
      }
      this.setState({
        clientWidth: this._clientWidth,
        scrollLeft: this._scrollLeft,
        scrollWidth: this._scrollWidth,
        hideProgress: true,
        tipActive: this.activeSectionCheck()
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
    this._nbProgressTip = 0
    this.continueClick = false
    this.direction = null
    this.container = null
    this.scrollTimeout = 0

    this._onScroll = ::this._onScroll
  }

  //ProgressTracker
  activeSectionCheck () {
    return Math.min(this._nbProgressTip - 1, Math.floor((this._scrollLeft) * this._nbProgressTip / (this._scrollWidth - this._clientWidth )))
  }

  renderProgress () {

    let classProgress = {
      'progress-tracker': true,
      'progress-hidden': this.state.hideProgress
    }

    return <div ref="progressTracker" className={classSet(classProgress)}>
      <ul>
        {
          _.times(this._nbProgressTip, (id)=> {

            const isActive = id === this.state.tipActive
            const classTip = {
              'section-tip': true,
              'active': isActive
            }
            return <li ref={`section-${id}`} className={classSet(classTip)}/>
          })
        }
      </ul>
    </div>
  }

  //Render Global

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
        {this.renderProgress()}
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
    this._nbProgressTip = Math.ceil(this._scrollWidth / this._clientWidth)
    this.handleScroll()
  }
}
