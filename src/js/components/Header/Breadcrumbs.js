/**
 * @class Breadcrumbs
 * @description New breadcrumbs class based on ES6 structure.
 * @exports Breadcrumbs
 * @version 1.1.11
 * @extends component
 * @requires react
 * @requires react-router
 *
 */
import React from 'react'
import _ from 'lodash'
import { Router, Route, Link } from 'react-router'

class Breadcrumbs extends React.Component {

  constructor (props, context) {
    super(props, context)
  }

  _getDisplayName (route) {
    const {props:{intl}} =this

    let name = null

    if (typeof route.getDisplayName === 'function') {
      name = route.getDisplayName()
    }

    if (route.indexRoute) {
      name = name || route.indexRoute.displayName || null
    } else {
      name = name || route.displayName || null
    }

    //check to see if a custom name has been applied to the route
    if (!name && !!route.name) {
      name = route.name
    }

    //if the name exists and it's in the excludes list exclude this route
    //if (name && this.props.excludes.some(item => item === name)) return null

    if (!name && this.props.displayMissing) {
      name = this.props.displayMissingText
    }

    if (name) {
      const keyI18n = `routes.${name}`
      const hasI18n = intl.messages[keyI18n]
      if (hasI18n) {
        name = intl.formatMessage({id: keyI18n}, {}) || name
      }
    }

    return name
  }

  _resolveRouteName (route) {
    let name = this._getDisplayName(route)
    if (!name && route.breadcrumbName) name = route.breadcrumbName
    if (!name && route.name) name = route.name
    return name
  }

  _processRoute (route, createElement, makeLink) {
    const {
      context: {store}
    } = this

    //if there is no route path defined and we are set to hide these then do so
    if (!route.path && this.props.hideNoPath) return null
    let elements = []
    let name = this._resolveRouteName(route)
    if (name) {
      if ('excludes' in this.props &&
        this.props.excludes.some(item => item === name)) {
        return null
      }
      elements.push({
        name,
        link: route.path
      })
    }
    const params = this.props.params
    // Replace route param with real param (if provided)
    let path = route.path
    path = path.replace(/\(/g, '')
    path = path.replace(/\)/g, '')
    let splittedPath = path.split('/')
    splittedPath = _.remove(splittedPath, (path)=>!~this.props.excludes.indexOf(path))
    let keyValue
    splittedPath.map((link)=> {
      if (link.substring(0, 1) == ':') {
        if (params) {
          //const initialPath = _.reduce(splittedPath, (start, link)=> {
          //  return start + '/' + link
          //})
          keyValue = _.map(params, (paramValue, key) => {
            let name = paramValue
            let hasNumber
            let value
            switch (key) {
              case  'movieId':
                //case  'movieSlug':
                value = store.getState().Movie.get(`movies/${paramValue}`)
                hasNumber = value && value.size && `${value.get('title')}`
                break
              case  'seasonId':
                //case  'seasonSlug':
                value = store.getState().Season.get(`seasons/${paramValue}`)
                hasNumber = value && value.size && `S${value.get('seasonNumber')}`
                break
              case  'episodeId':
                //case  'episodeSlug':
                value = store.getState().Episode.get(`episodes/${paramValue}`)
                hasNumber = value && value.size && value && `E${value.get('episodeNumber')}`
                break
              default:
                break
            }
            if (hasNumber) {
              name = hasNumber
            }

            const excluded = Boolean(this.props.excludes.some(item => item === key) /*|| _.isMatch(this.props.excludes, key)*/ || !paramValue || parseInt(name))

            return {
              key,
              value: paramValue,
              name,
              excluded
            }
          })

          keyValue = _.remove(keyValue, (item)=> {
            return item && item.value
          })

          const copyKeyValue = _.clone(keyValue)

          keyValue = _.remove(keyValue, (item)=> {
            return !item.excluded
          })

          let pathWithParam = splittedPath.map((path, key)=> {
            //const itemIndex = _.findIndex(copyKeyValue, (item)=> {
            //  return item.key === path.replace(':', '')
            //})
            const takeValues = _.take(copyKeyValue, key)
            //const subLink = takeValues && _.reduce(takeValues, (start, next)=> {
            //    return next && ( ((start.value || start) + '/' + (next.value || next))) || start.value
            //  })
            let subLink = ''
            _.forEach(takeValues, (item)=> {
              return subLink += `/${item.value}`
            })
            let name = path
            if (keyValue && keyValue.length && path.substring(0, 1) == ':') {
              const kV = keyValue.shift()
              return {name: kV.name || name, link: subLink}
            }
            return null
          })

          pathWithParam = _.remove(pathWithParam, undefined)
          elements = pathWithParam //= _.remove(pathWithParam, (path)=> (path && path.name))
          //elements = _.remove(pathWithParam, (path)=>!parseInt(path.name))
        }
      }
    })

    if (elements.length) {
      return _.map(elements, (path, key)=> {
        var itemClass = this.props.itemClass
        if (makeLink || key < elements.length - 1) {
          var link = !createElement ? path.link :
            React.createElement(Link, {
              to: path.link || path,
            }, path.name)
        } else {
          link = path.name
          itemClass += ' ' + this.props.activeItemClass
        }
        return !createElement ? link :
          React.createElement(this.props.itemElement, {className: itemClass, key: Math.random() * 100}, link)
      })
    }

    return null

  }

  _buildRoutes (routes, createElement) {
    let crumbs = []
    let parentPath = '/'
    let isRoot = routes[1] && routes[1].hasOwnProperty('path')
    let routesWithExclude = []
    routes.forEach((_route, index) => {
      let route = Object.assign({}, _route)
      if ('props' in route && 'path' in route.props) {
        route.path = route.props.path
        route.children = route.props.children
        route.name = route.props.name
      }
      if (route.path) {
        if (route.path.charAt(0) === '/') {
          parentPath = route.path
        } else {
          if (parentPath.charAt(parentPath.length - 1) !== '/') {
            parentPath += '/'
          }
          parentPath += route.path
        }
      }
      if (0 < index && route.path && route.path.charAt(0) !== '/') {
        route.path = parentPath
      }
      let name = this._resolveRouteName(route)
      if ((this.props.displayMissing || name) && route.path && !('excludes' in this.props && this.props.excludes.some(item => item === name)))
        routesWithExclude.push(route)
    })
    routes = routesWithExclude
    routes.map((route, index) => {
      if (!route) return null
      if ('props' in route && 'path' in route.props) {
        route.path = route.props.path
        route.children = route.props.children
        route.name = route.props.name
      }
      if (route.path) {
        if (route.path.charAt(0) === '/') {
          parentPath = route.path
        } else {
          if (parentPath.charAt(parentPath.length - 1) !== '/') {
            parentPath += '/'
          }
          parentPath += route.path
        }
      }

      if (0 < index && route.path && route.path.charAt(0) !== '/') {
        route.path = parentPath
      }

      let result = this._processRoute(route, createElement, !crumbs.length)

      if (result) {
        crumbs.push(result)
      }
    })

    return !createElement ? crumbs :
      React.createElement(this.props.wrapperElement, {className: this.props.customClass || this.props.wrapperClass}, crumbs)

  }

  render () {
    return this._buildRoutes(this.props.routes, this.props.createElement)
  }
}

/**
 * @property PropTypes
 * @description Property types supported by this component
 * @type {{separator: *, createElement: *, displayMissing: *, displayName: *, breadcrumbName: *, wrapperElement: *, wrapperClass: *, itemElement: *, itemClass: *, activeItemClass: *,  customClass: *,excludes: *}}
 */
Breadcrumbs.propTypes = {
  separator: React.PropTypes.oneOfType([
    React.PropTypes.element,
    React.PropTypes.string
  ]),
  createElement: React.PropTypes.bool,
  displayMissing: React.PropTypes.bool,
  prettify: React.PropTypes.bool,
  displayMissingText: React.PropTypes.string,
  displayName: React.PropTypes.string,
  breadcrumbName: React.PropTypes.string,
  wrapperElement: React.PropTypes.string,
  wrapperClass: React.PropTypes.string,
  itemElement: React.PropTypes.string,
  itemClass: React.PropTypes.string,
  customClass: React.PropTypes.string,
  activeItemClass: React.PropTypes.string,
  excludes: React.PropTypes.arrayOf(React.PropTypes.string),
  hideNoPath: React.PropTypes.bool,
  routes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  setDocumentTitle: React.PropTypes.bool
}

/**
 * @property defaultProps
 * @description sets the default values for propTypes if they are not provided
 * @type {{separator: string, displayMissing: boolean, wrapperElement: string, itemElement: string, wrapperClass: string, customClass: string}}
 */
Breadcrumbs.defaultProps = {
  separator: ' > ',
  createElement: true,
  displayMissing: true,
  displayMissingText: 'Missing name prop from Route',
  wrapperElement: 'div',
  wrapperClass: 'breadcrumbs',
  itemElement: 'span',
  itemClass: '',
  activeItemClass: '',
  excludes: [''],
  prettify: false,
  hideNoPath: true,
  setDocumentTitle: false
}

/**
 * @property contextTypes
 * @description List of objects to incorporate into the context of this class
 * @type {{routes: *}}
 */
Breadcrumbs.contextTypes = {
  routes: React.PropTypes.array,
  params: React.PropTypes.array,
  store: React.PropTypes.object.isRequired
}

module.exports = Breadcrumbs
