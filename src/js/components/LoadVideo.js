import React, { Component, PropTypes } from 'react'
import Immutable from 'immutable'
import { I18n } from './Utils'
import { slugify } from '../lib/utils'

export default class LoadVideo extends I18n {

  static propTypes = {
    data: PropTypes.instanceOf(Immutable.Map),
    dataId: PropTypes.string,
    load: PropTypes.bool
  }

  static defaultProps = {
    data: null,
    dataId: null,
    load: false
  }

  render () {
    return (
      <div {...this.props} />
    )
  }

  getType () {
    const {
      props: {Movie, data, dataId}
    } = this

    let dataValue = data || Movie.get(`movies/${dataId}`)
    return dataValue && dataValue.get('type')
  }

  isValid () {
    const {
      props: {data, dataId}
    } = this

    return (data || dataId) && this.getType() !== 'error'
  }

  getLink () {
    const {
      props: {
        data, dataId, Movie, Season, load
      }
    } = this

    if (!this.isValid()) {
      return ''
    }

    let dataValue = data || Movie.get(`movies/${dataId}`)

    if (!dataValue) {
      return ''
    }

    let movieId = dataValue.get('_id')
    let movieTitle = dataValue.get('title')
    let movieSlug = dataValue.get('slug') || slugify(movieTitle)
    let dataType = dataValue.get('type')
    let fixedType = this.getType()
    let link = `/${movieId}/${movieSlug}`
    if (fixedType === 'pin') {
      return `/life/pin${link}`
    }
    if (fixedType === 'user') {
      movieSlug = dataValue.get('nickname')
      let link = `/${movieId}/${movieSlug}`
      return `/life/community${link}`
    }
    let seasonId
    let seasonSlug
    let episodeId
    let episodeSlug

    let videoData = dataValue.get('video')
    let videoId = null

    if (load) {
      videoId = dataValue.get('videoId')
    }

    if (dataType === 'serie') {
      videoId = null
    }
    else if (dataType === 'episode') {
      seasonId = dataValue.get('seasonId')
      const season = Season.get(`seasons/${seasonId}`) || dataValue.get('season')
      if (season) {
        seasonId = season.get('_id')
        seasonSlug = season.get('slug')
        movieId = season.get('movieId')
        const movieData = Movie.get(`movies/${movieId}`)
        if (movieData) {
          movieSlug = movieData.get('slug')
        }
      }
      episodeId = dataValue.get('_id')
      episodeSlug = dataValue.get('slug')
      videoId = dataValue.get('videoId')

      link = `/${movieId}/${movieSlug}/${seasonId}/${seasonSlug}/${episodeId}/${episodeSlug}`
    }
    else if (videoData) {
      videoId = videoId || videoData.get('_id')
    }
    link += `${videoId ? '/' + videoId : ''}`
    return link
  }

}
