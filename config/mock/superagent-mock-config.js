// ./superagent-mock-config.js file
import _ from 'lodash';
import *  as Fixtures from './fixtures';
import config from '../index';

const getPaginatedItems = function (items, page, per_page) {
  var page = page || 1,
    per_page = per_page || 3,
    offset = (page - 1) * per_page,
    paginatedItems = _.rest(items, offset).slice(0, per_page);
  return {
    page: page,
    per_page: per_page,
    total: items.length,
    total_pages: Math.ceil(items.length / per_page),
    data: paginatedItems
  };
};

const superAgentConfig = [,
  {
    pattern: `${config.apiServer.urlPrefix}/movies/([\\w-]+)/season`,

    fixtures: Fixtures.SeasonMock,
    callback: function (match, data) {
      //var list = Fixtures.CategoryMock;
      //console.log(list.length);
      //
      //var final = _.forEach(data, function (n) {
      //  n.episodes = _.shuffle(list).slice(0, _.random(Fixtures.MovieMock.length - 1));
      //});

      let movie = _.find(Fixtures.MovieMock(), function (item) {
        return item._id === match[1];
      });

      if (movie.type !== 'serie') {
        data = [];
      }

      return {
        body: data
      };
    }
  },
  {
    pattern: `${config.apiServer.urlPrefix}/movies/([\\w]+)`,

    fixtures: Fixtures.MovieMock,
    callback: function (match, data) {
      return {
        body: _.find(data, function (item) {
          return item._id === match[1];
        })
      };
    }
  },
  {
    pattern: `${config.apiServer.urlPrefix}/movies/([\\w]+)/([\\w-]+)`,

    fixtures: Fixtures.MovieMock,
    callback: function (match, data) {
      return {
        body: _.find(data, function (item) {
          return item._id === match[1] || item.slug === match[2];
        })
      };
    }
  },
  {
    pattern: `${config.apiServer.urlPrefix}/categorys/([\\w]+)/spots`,

    fixtures: Fixtures.CategoryMock,
    callback: function (match, data) {
      var datasPaginated = getPaginatedItems(data, 1, 5).data;
      return {
        body: _.shuffle(datasPaginated)
      };
    }
  },
  {
    pattern: `${config.apiServer.urlPrefix}/categorys/mea`,

    fixtures: Fixtures.CategoryMock,
    callback: function (match, data) {
      // on clone les data afin d'avoir plus de données
      let cloned = _.cloneDeep(data);
      // on ajoutes les datas clonées entre elles
      let unions = _.union(data, cloned);
      // on split en sections afin d'avoir des categories pas type listé dans le menu (slités en n x)
      let splited = _.chunk(unions, 10);
      let navigationList = _.forEach(Fixtures.CategoryMenu(), function (item, key) {
        item.movies = splited[key];
      });

      return {
        body: navigationList
      };
    }
  },
  {
    pattern: `${config.apiServer.urlPrefix}/categorys/menu`,

    fixtures: Fixtures.CategoryMenu,
    callback: function (match, data) {
      return {
        body: data
      };
    }
  },
  {
    pattern: `${config.apiServer.urlPrefix}/categorys/([\\w-]+)`,

    fixtures: Fixtures.CategoryMock,
    callback: function (match, data) {
      return {
        body: _.shuffle(data)
      };
    }
  },
  {
    pattern: `${config.apiServer.urlPrefix}/assets/([\\w-]+)`,

    fixtures: Fixtures.AssetMock,
    callback: function (match, data) {
      /*return {
        body: data
      };*/
      return {
        body: _.find(data, function (item) {
          return item._id === match[1];

        })
      };
    }
  }
];

export default superAgentConfig;
