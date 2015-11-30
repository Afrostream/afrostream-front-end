'use strict';

import React, { PropTypes,Component } from 'react';
import Helmet from 'react-helmet';
import config from '../../../config';

export default () => {

  return (MetasDataComponent) => {
    class MetasDataDecorator extends Component {

      static contextTypes = {
        store: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired
      };

      static defaultProps = {};

      state = {
        title: config.metadata.title,
        meta: config.metadata.metas,
        link: []
      };

      render() {
        const { props: { children} } = this;
        return (
          <MetasDataComponent>
            <Helmet  {...this.props} {...this.state} />
            {children}
          </MetasDataComponent>
        );
      }

      componentWillMount() {
        const {
          props: { params, location }
          } = this;
        if (params && params.movieId) {
          let data = this.context.store.getState().Movie.get(`movies/${params.movieId}`);
          this.setMetadataProps(data);
        }
      }

      setMetadataProps(data) {

        const {
          props: { params, location }
          } = this;

        //if (routeName !== 'default') {
        //  link.push({rel: 'canonical', href: this.getCanonical(routeName, params)});
        //}

        if (!data) {
          return false;
        }

        let metas = {
          title: config.metadata.title,
          meta: [],
          link: []
        };

        let title = data.get('title') || config.metadata.title;
        let slug = data.get('slug');
        let synopsis = data.get('synopsis') || config.metadata.description;
        let ogTitle = data.get('title');
        let ogDescription = data.get('synopsis');
        let poster = data.get('poster');
        let imageStyle = config.metadata.shareImage;
        if (poster) {
          imageStyle = poster.get('imgix');
        }
        let ogImage = `${imageStyle}?crop=faces&fit=clip&w=1920&h=815&q=${config.images.quality}&fm=${config.images.type})`;

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

        this.setState(metas);

      }

      getCanonical(routeName, params) {
        return url.format({
          protocol: config.protocol,
          host: config.host,
          pathname: this.context.router.makePath(routeName, params)
        });
      }

    }
    return MetasDataDecorator;
  }
}
