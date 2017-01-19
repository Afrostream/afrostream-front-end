import React, { PropTypes, Component } from 'react'
import Helmet from 'react-helmet'
import config from '../../../config'
import _ from 'lodash'
import qs from 'qs'
import { extractImg } from '../lib/utils'
import { I18n } from '../components/Utils'
import Immutable from 'immutable'
export default () => {

  return (MetasDataComponent) => {
    class MetasDataDecorator extends I18n {

      static contextTypes = {
        store: PropTypes.object.isRequired
      }

      static propsTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
      }

      static defaultProps = {}

      render () {
        const {props: {children}} = this
        let metas = this.getMetadata()
        return (
          <MetasDataComponent {...this.props} >
            <Helmet {...metas} />
            {children}
          </MetasDataComponent>
        )
      }

      getdata () {
        const {
          context: {store},
          props: {params, location}
        } = this

        let {lang} = params
        let {query} = location

        let slug = `${config.metadata.domain}${location.pathname !== '/' ? location.pathname : '' }`

        if (query) {
          var querystring = qs.stringify(query)
          if (querystring && querystring.length) {
            slug = `${slug}?${querystring}`
          }
        }

        let metas = {
          title: _.cloneDeep(config.metadata.title),
          description: _.cloneDeep(config.metadata.description),
          meta: _.cloneDeep(config.metadata.metas),
          htmlAttributes: {lang},
          type: 'website',
          link: [],
          slug
        }

        let seasonNumber = null
        let themes = ''
        let actors = ''
        let movieTitle = ''
        let episodeNumber = null

        let data

        switch (true) {
          case Boolean(~location.pathname.indexOf('/life')) :

            let themesList = store.getState().Life.get(`life/themes/`)
            let defaultTitle = ''
            let defaultDescription = this.getTitle('life.metas.description')
            if (params.pinId) {
              data = store.getState().Life.get(`life/pins/${params.pinId}`)
              if (data) {
                themesList = data.get(themes)
                defaultDescription = data.get('description') || defaultDescription
                defaultTitle = `${(data.get('title') || defaultTitle)} |`
                metas.type = 'article'
                metas.htmlAttributes.prefix = 'og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article#'
              }
              if (params.themeId) {
                data = store.getState().Life.get(`life/themes/${params.themeId}`)
                if (data) {
                  themesList = Immutable.List([data])
                }
              }

              if (themesList) {
                let themesFlat = themesList.map((theme) => {
                  return theme.get('label')
                })
                themes = _.join(themesFlat.toJS(), ' - ') + ' |'
              }
              defaultTitle = this.getTitle('life.metas.title', {themes, defaultTitle})
            }
            if (params.lifeUserId) {
              data = store.getState().Life.get(`life/users/${params.lifeUserId}`)
              if (data) {
                defaultTitle = this.getTitle('life.metas.user.title', {defaultTitle: data.get('nickname') || ''})
                defaultDescription = data.get('biography') || defaultDescription
                metas.htmlAttributes.prefix = 'og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# profile: http://ogp.me/ns/profile#'
                metas.type = 'profile'
              }
            }

            metas.title = defaultTitle
            metas.description = defaultDescription

            break

          case Boolean(~location.pathname.indexOf('/coupon')) :
            //META SPONSORSHIP
            let couponItem = store.getState().Billing.get('coupon')
            if (couponItem) {
              const coupon = couponItem.get('coupon')
              if (coupon) {
                const plan = coupon.get('internalPlan')
                if (plan) {
                  //TODO connect to plan name/description
                  //Replace global
                  //title = title.replace(/{planName}/g, plan.get('name'))
                  //synopsis = synopsis.replace(/{planDescription}/g, plan.get('description'))
                  metas.title = this.getTitle('sponsors.metas.title')
                  metas.description = this.getTitle('sponsors.metas.description')
                  data = plan
                }
              }
            }
            break

          default:
            //META MOVIE/SERIE/EPISODE/VIDEO
            if (params.movieId) {
              const movieData = store.getState().Movie.get(`movies/${params.movieId}`)
              if (movieData) {

                let seasonData
                let videoData
                let episodeData


                if (params.videoId) {
                  videoData = store.getState().Video.get(`videos/${params.videoId}`)
                }
                if (params.seasonId) {
                  seasonData = store.getState().Season.get(`seasons/${params.seasonId}`)
                  if (seasonData) {
                    seasonNumber = seasonData.get('seasonNumber')
                  }
                }

                if (params.episodeId) {
                  if (videoData) {
                    episodeData = videoData.get('episode')
                  }
                  else {
                    episodeData = store.getState().Episode.get(`episodes/${params.episodeId}`)
                  }
                  if (episodeData) {
                    episodeNumber = episodeData.get('episodeNumber')
                  }
                }

                let type = movieData.get('type')
                movieTitle = movieData.get('title')

                let actorsList = movieData.get('actors')
                if (actorsList) {
                  let actorsFlat = actorsList.map((actor) => {
                    return `${actor.get('firstName')} ${actor.get('lastName')}`
                  })
                  actors = _.join(actorsFlat.toJS(), ',')
                }

                if (type === 'movie') {
                  metas.title = this.getTitle('home.movie.title', {movieName: movieTitle})
                  metas.description = this.getTitle('home.movie.description', {
                    movieName: movieTitle,
                    actors: actors
                  })
                } else {
                  metas.title = this.getTitle('home.serie.title', {serieName: movieTitle})
                  metas.description = this.getTitle('home.serie.description', {serieName: movieTitle})
                }

                if (episodeData) {
                  metas.title = this.getTitle('home.episode.title', {
                    serieName: movieTitle,
                    seasonNumber,
                    episodeNumber
                  })
                  metas.description = this.getTitle('home.episode.description', {
                    serieName: movieTitle,
                    seasonNumber,
                    episodeNumber
                  })
                }

                if (seasonData) {
                  const episodes = seasonData.get('episodes')
                  metas.title = this.getTitle('home.season.title', {serieName: movieTitle, seasonNumber})
                  metas.description = this.getTitle('home.season.description', {
                    episodesNumber: episodes && episodes.size || '',
                    seasonNumber,
                    serieName: movieTitle
                  })
                }


                if (params.videoId) {
                  //metas.type = episodeData ? 'video.episode' : 'video.video'
                  //FIXME change type whaen accessible video 30s
                  metas.htmlAttributes.prefix = 'og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# video: http://ogp.me/ns/video#'
                  metas.type = 'video.other'
                }

                //si on a les données de l'episode alors, on remplace les infos affichées
                data = episodeData ? movieData.merge(episodeData) : movieData
              }
            }
            break
        }

        return {metas, data}
      }

      getMetadata () {

        const extractData = this.getdata()
        const data = extractData.data
        const metas = extractData.metas

        let image = extractImg({
          data,
          defaultImage: config.metadata.shareImage,
          keys: ['poster', 'thumb', 'image', 'picture'],
          width: 1120
        })

        metas.meta.push({
          property: 'og:title',
          content: metas.title
        })
        metas.meta.push({
          name: 'twitter:title',
          content: metas.title
        })

        if (metas.description) {
          metas.meta.push({
            name: 'description',
            content: metas.description,
          })

          metas.meta.push({
            property: 'og:description',
            content: metas.description,
          })
          metas.meta.push({
            name: 'twitter:description',
            content: metas.description,
          })
        }

        metas.meta.push({
          property: 'og:type',
          content: metas.type,
        })


        metas.meta.push({
          property: 'og:image',
          content: image,
        })

        metas.meta.push({
          property: 'og:image:width',
          content: 1200,
        })

        metas.meta.push({
          property: 'og:image:height',
          content: 630,
        })

        metas.meta.push({
          name: 'twitter:image:src',
          content: image,
        })


        metas.link.push({
          rel: 'canonical',
          href: metas.slug,
        })
        metas.meta.push({
          property: 'og:url',
          content: metas.slug,
        })
        metas.meta.push({
          name: 'twitter:site',
          content: metas.slug,
        })

        return metas
      }

    }
    return MetasDataDecorator
  }
}
