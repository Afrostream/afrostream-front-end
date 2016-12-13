import React from 'react'
import _ from 'lodash'
import { withRouter } from 'react-router'
import classSet from 'classnames'
import window from 'global/window'
import { I18n } from '../Utils'
import {
  injectIntl,
} from 'react-intl'
class StaticMenu extends I18n {


  componentDidMount () {
    /**
     * This part handles the highlighting functionality.
     * We use the scroll functionality again, some array creation and
     * manipulation, class adding and class removing, and conditional testing
     */
    var aChildren = $('.company-submenu li').children() // find the a children of the list items
    var aArray = [] // create the empty aArray
    for (var i = 0; i < aChildren.length; i++) {
      var aChild = aChildren[i]
      var ahref = $(aChild).attr('href')
      aArray.push(ahref)
    } // this for loop fills the aArray with attribute href values

    $(window).scroll(function () {
      var windowPos = $(window).scrollTop() + 150// get the offset of the window from the top of page
      var windowHeight = $(window).height() // get the height of the window
      var docHeight = $(document).height()

      for (var i = 0; i < aArray.length; i++) {
        var theID = aArray[i]
        var el = $(theID)
        if (!el) {
          continue
        }
        try {

          var divPos = $(theID) && $(theID).offset().top // get the offset of the div from the top of page
          var divHeight = $(theID).height() // get the height of the div in question
          if (windowPos >= divPos && windowPos < (divPos + divHeight)) {
            $(`a[href="${theID}"]`).addClass('active')
          } else {
            $(`a[href="${theID}"]`).removeClass('active')
          }
        } catch (e) {
          console.log(e)
        }
      }

      if ((windowPos - 150) + windowHeight == docHeight) {
        if (!$('.company-submenu-link:last-child').hasClass('active')) {
          var navActiveCurrent = $('.company-submenu .active').attr('id')
          $(`a[href="${navActiveCurrent}"]`).removeClass('active')
          $('.company-submenu-link:last-child').addClass('active')
        }
      }
    })
  }

  renderSubLink (links) {

    let mapKeys = Object.keys(links)
    return (<ul className="company-submenu" role="tablist">
      {_.map(mapKeys, (itemValue, itemKey)=> {
          const data = links[itemValue]
          return <li key={`static-menu-sub-${itemKey}`} role="tab">
            <a className="company-submenu-link" href={`#${itemValue}`}>
              <span className="zmdi zmdi-chevron-right zmdi-hc-2x"></span>{data.label}
            </a>
            {data.links && this.renderSubLink(data.links)}
          </li>
        }
      )}
    </ul>)
  }

  renderLink () {

    const {
      props: {
        location
      }
    } = this

    let pressMenu = this.getTitleAsObject('press.menu')
    let mapKeys = Object.keys(pressMenu)
    let keys = _.map(mapKeys, (value, key)=> {
      const data = pressMenu[value]
      const itemClass = {
        'company-menu-item': true,
        'active': ~location.pathname.indexOf(value)
      }
      return (<li key={`static-menu-${key}`} className={classSet(itemClass)} role="tab"
                  data-primary-tab="company">
        <a href={`/company/${value}`}>{data.label}</a>
        {data.links && this.renderSubLink(data.links)}
      </li>)
    })

    return keys
  }

  render () {

    return (
      <div className="company-menu">
        <div id="nav-anchor"></div>
        <nav>
          <ul className="company-menu-list" role="tablist">
            {::this.renderLink()}
          </ul>
        </nav>
      </div>
    )
  }
}

StaticMenu.propTypes = {
  history: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired
}

export default injectIntl(withRouter(StaticMenu))
