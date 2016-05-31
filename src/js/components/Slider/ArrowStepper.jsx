import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import classSet from 'classnames'

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

  constructor (props, context) {
    super(props, context)

    this.state = {
      scrollToColumn: 0,
      scrollLeft: 0
    }

    this._columnStartIndex = 0
    this._columnStopIndex = 0

    this._onSectionRendered = this._onSectionRendered.bind(this)
    this._onScroll = this._onScroll.bind(this)
    this._scrollLeft = this._scrollLeft.bind(this)
  }

  render () {
    const {className, children, columnCount} = this.props
    const {scrollLeft, scrollToColumn, scrollLeft, scrollWidth, clientWidth} = this.state

    let maxScroll = scrollWidth - clientWidth

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

    return (
      <div className={className}>
        <div ref="arrowLeft"
             className={classSet(leftArrowClasses)}
             onClick={::this._onClickLeft}>
          <i className="zmdi zmdi-hc-8x zmdi-chevron-left"></i>
        </div>
        <div ref="arrowRight"
             className={classSet(rightArrowClasses)}
             onClick={::this._onClickRight}>
          <i className="zmdi zmdi-hc-8x zmdi-chevron-right"></i>
        </div>
        {children({
          onSectionRendered: this._onSectionRendered,
          onScroll: this._onScroll,
          scrollToColumn,
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
   * Animation scroll function
   *
   * @param type     {String} Type of transition [single|continue]
   * @param to       {Number} Position to scroll in pixel
   * @param duration {Number} Duration of the animation
   */
  animateHorizontalScroll (to) {
    TweenMax.to(this.scrollLeft, 0.8, {scrollLeft: (this.container.scrollLeft + to), ease: Expo.easeInOut})
  }

  _onClickLeft (event) {
    event.preventDefault()
    this.setState({
      scrollToColumn: Math.max(this._columnStartIndex - this._columnStopIndex, 0),
      clientWidth: this._clientWidth,
      scrollLeft: Math.max(0, this._scrollLeft - this._scrollWidth),
      scrollWidth: this._scrollWidth
    })
  }

  _onClickRight (event) {
    const {columnCount} = this.props
    event.preventDefault()
    this.setState({
      scrollToColumn: Math.min(this._columnStopIndex + this._columnStopIndex, columnCount - 1),
      clientWidth: this._clientWidth,
      scrollLeft: Math.min(this._clientWidth, this._scrollLeft + this._scrollWidth),
      scrollWidth: this._scrollWidth
    })
  }

  _onSectionRendered ({columnStartIndex, columnStopIndex}) {
    this._columnStartIndex = columnStartIndex
    this._columnStopIndex = columnStopIndex
  }

  _onScroll ({clientWidth, scrollLeft, scrollWidth}) {
    this._clientWidth = clientWidth
    this._scrollLeft = scrollLeft
    this._scrollWidth = scrollWidth
  }
}
