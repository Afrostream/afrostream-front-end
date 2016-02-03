'use strict';

import React, { PropTypes,Component } from 'react';
import Helmet from 'react-helmet';
import config from '../../../config';
import shallowEqual from 'react-pure-render/shallowEqual';

export default () => {

  return (MetasDataComponent) => {
    class MetasDataDecorator extends Component {

      static contextTypes = {
        store: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
      };

      static defaultProps = {};

      state = {
        title: config.metadata.title,
        meta: config.metadata.metas,
        link: []
      };

      render() {
        const { props: { children} } = this;
        let metas = this.getMetadata();
        return (
          <MetasDataComponent {...this.props} >
            <Helmet {...metas} />
            {children}
          </MetasDataComponent>
        );
      }

      getMetadata() {

        const {
          context: { store },
          props: { params }
          } = this;

        let metas = {
          title: config.metadata.title,
          meta: config.metadata.metas,
          link: []
        };

        const movieData = store.getState().Movie.get(`movies/${params.movieId}`);
        let seasonData;
        let episodeData;
        //if (params.videoId) {
        //  videoData = store.getState().Video.get(`videos/${params.videoId}`);
        //}
        if (params.seasonId) {
          seasonData = store.getState().Season.get(`seasons/${params.seasonId}`);
        }

        if (params.episodeId) {
          if (seasonData) {
            // episodeData = videoData.get('episode');
            let episodesList = seasonData.get('episodes');
            if (episodesList) {
              episodeData = episodesList.find(function (obj) {
                return obj.get('_id') === params.episodeId;
              });
            }
          }
          else {
            episodeData = store.getState().Episode.get(`episodes/${params.episodeId}`);
          }
        }
        //si on a les données de l'episode alors, on remplace les infos affichées
        const data = episodeData ? movieData.merge(episodeData) : movieData;

        if (!data) {
          return metas;
        }

        let title = data.get('title');
        let slug = data.get('slug');
        let synopsis = data.get('synopsis');
        let ogTitle = data.get('title');
        let ogDescription = data.get('synopsis');
        let poster = data.get('poster');
        let imageStyle = config.metadata.shareImage;
        if (poster) {
          imageStyle = poster.get('imgix');
        }
        let ogImage = `${imageStyle}?crop=faces&fit=clip&w=1920&h=815&q=${config.images.quality}&fm=${config.images.type}`;

        if (title) {
          metas.title = title;
        }

        if (synopsis) {
          metas.meta.push({
            name: 'description',
            content: synopsis
          });
        }

        if (ogTitle) {
          metas.meta.push({
            property: 'og:title',
            content: ogTitle
          });
        }

        if (ogDescription) {
          metas.meta.push({
            property: 'og:description',
            content: ogDescription
          });
        }

        if (ogImage) {
          metas.meta.push({
            property: 'og:image',
            content: ogImage
          });
        }

        if (slug) {
          metas.meta.push({
            property: 'og:url',
            content: slug
          });
        }

        return metas;
      }

    }
    return MetasDataDecorator;
  }
}
