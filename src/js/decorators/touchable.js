'use strict';

import React, {Component } from 'react';

export default () => {

  return (TouchableComponent) => {
    class TouchableDecorator extends Component {

      static contextTypes = {};

      static defaultProps = {};

      state = {};

      render() {
        const { props: { children} } = this;
        return (
        {children}
        );
      }

      componentDidMount() {
        const {
          props: { params, location }
          } = this;

        this.initTouch();
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
          title: '',
          meta: [],
          link: []
        };

        let title = data.get('title');
        let slug = data.get('slug');
        let synopsis = data.get('synopsis');
        let ogTitle = data.get('title');
        let ogDescription = data.get('synopsis');
        let poster = data.get('poster');
        let imageStyle = 'https://afrostream.imgix.net/production/poster/2015/08/ab69b5337b8a05d4c896-last-letter%202560x1440.jpg';
        if (poster) {
          imageStyle = poster.get('imgix');
        }
        let ogImage = `${imageStyle}?crop=faces&fit=clip&w=1920&h=815&q=65)`;

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
    return TouchableDecorator;
  }
}
