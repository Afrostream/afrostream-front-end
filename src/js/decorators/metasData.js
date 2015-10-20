'use strict';

import React, { PropTypes,Component } from 'react';
import Helmet from 'react-helmet';

export default () => {

  return (MetasDataComponent) => {
    class MetasDataDecorator extends Component {

      static contextTypes = {
        store: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired
      };

      static defaultProps = {};

      state = {
        title: '',
        meta: [],
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
          title: '',
          meta: [],
          link: []
        };

        let title = data.get('title');
        let synopsis = data.get('synopsis');
        let ogTitle = data.get('ogTitle');
        let ogDescription = data.get('ogDescription');

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
