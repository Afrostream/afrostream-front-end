import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as ModalActionCreators from '../../../actions/modal';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import classSet from 'classnames';
import config from '../../../../../config';
import _ from 'lodash';
import MobileDetect from 'mobile-detect';

if (process.env.BROWSER) {
  require('./WelcomeHeader.less');
}

@connect(({ User, Movie,Video,Season,Episode }) => ({User, Movie, Video, Season, Episode}))
class WelcomeHeader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isMobile: false,
      size: {
        height: 1920,
        width: 815
      }
    };
  }


  static contextTypes = {
    location: PropTypes.object.isRequired
  };

  static propTypes = {
    promoCode: React.PropTypes.string
  };

  static defaultProps = {
    promoCode: ''
  };

  componentDidMount() {
    let isMobile = false;
    if (canUseDOM) {
      const userAgent = (window.navigator && navigator.userAgent) || '';
      let agent = new MobileDetect(userAgent);
      isMobile = agent.mobile();
    }

    this.setState({
      isMobile: isMobile,
      size: {
        height: window.innerHeight,
        width: window.innerWidth
      }
    });

    let promoCode = this.hasPromo();

    if (canUseDOM && promoCode) {
      !function (a) {
        "use strict";
        "function" == typeof define && define.amd ? define(["jquery"], a) : a(jQuery)
      }(function (a) {
        "use strict";
        function b(a) {
          if (a instanceof Date)return a;
          if (String(a).match(g))return String(a).match(/^[0-9]*$/) && (a = Number(a)), String(a).match(/\-/) && (a = String(a).replace(/\-/g, "/")), new Date(a);
          throw new Error("Couldn't cast `" + a + "` to a date object.")
        }

        function c(a) {
          var b = a.toString().replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
          return new RegExp(b)
        }

        function d(a) {
          return function (b) {
            var d = b.match(/%(-|!)?[A-Z]{1}(:[^;]+;)?/gi);
            if (d)for (var f = 0, g = d.length; g > f; ++f) {
              var h = d[f].match(/%(-|!)?([a-zA-Z]{1})(:[^;]+;)?/), j = c(h[0]), k = h[1] || "", l = h[3] || "", m = null;
              h = h[2], i.hasOwnProperty(h) && (m = i[h], m = Number(a[m])), null !== m && ("!" === k && (m = e(l, m)), "" === k && 10 > m && (m = "0" + m.toString()), b = b.replace(j, m.toString()))
            }
            return b = b.replace(/%%/, "%")
          }
        }

        function e(a, b) {
          var c = "s", d = "";
          return a && (a = a.replace(/(:|;|\s)/gi, "").split(/\,/), 1 === a.length ? c = a[0] : (d = a[0], c = a[1])), 1 === Math.abs(b) ? d : c
        }

        var f = [], g = [], h = {precision: 100, elapse: !1};
        g.push(/^[0-9]*$/.source), g.push(/([0-9]{1,2}\/){2}[0-9]{4}( [0-9]{1,2}(:[0-9]{2}){2})?/.source), g.push(/[0-9]{4}([\/\-][0-9]{1,2}){2}( [0-9]{1,2}(:[0-9]{2}){2})?/.source), g = new RegExp(g.join("|"));
        var i = {
          Y: "years",
          m: "months",
          n: "daysToMonth",
          w: "weeks",
          d: "daysToWeek",
          D: "totalDays",
          H: "hours",
          M: "minutes",
          S: "seconds"
        }, j = function (b, c, d) {
          this.el = b, this.$el = a(b), this.interval = null, this.offset = {}, this.options = a.extend({}, h), this.instanceNumber = f.length, f.push(this), this.$el.data("countdown-instance", this.instanceNumber), d && ("function" == typeof d ? (this.$el.on("update.countdown", d), this.$el.on("stoped.countdown", d), this.$el.on("finish.countdown", d)) : this.options = a.extend({}, h, d)), this.setFinalDate(c), this.start()
        };
        a.extend(j.prototype, {
          start: function () {
            null !== this.interval && clearInterval(this.interval);
            var a = this;
            this.update(), this.interval = setInterval(function () {
              a.update.call(a)
            }, this.options.precision)
          }, stop: function () {
            clearInterval(this.interval), this.interval = null, this.dispatchEvent("stoped")
          }, toggle: function () {
            this.interval ? this.stop() : this.start()
          }, pause: function () {
            this.stop()
          }, resume: function () {
            this.start()
          }, remove: function () {
            this.stop.call(this), f[this.instanceNumber] = null, delete this.$el.data().countdownInstance
          }, setFinalDate: function (a) {
            this.finalDate = b(a)
          }, update: function () {
            if (0 === this.$el.closest("html").length)return void this.remove();
            var b, c = void 0 !== a._data(this.el, "events"), d = new Date;
            b = this.finalDate.getTime() - d.getTime(), b = Math.ceil(b / 1e3), b = !this.options.elapse && 0 > b ? 0 : Math.abs(b), this.totalSecsLeft !== b && c && (this.totalSecsLeft = b, this.elapsed = d >= this.finalDate, this.offset = {
              seconds: this.totalSecsLeft % 60,
              minutes: Math.floor(this.totalSecsLeft / 60) % 60,
              hours: Math.floor(this.totalSecsLeft / 60 / 60) % 24,
              days: Math.floor(this.totalSecsLeft / 60 / 60 / 24) % 7,
              daysToWeek: Math.floor(this.totalSecsLeft / 60 / 60 / 24) % 7,
              daysToMonth: Math.floor(this.totalSecsLeft / 60 / 60 / 24 % 30.4368),
              totalDays: Math.floor(this.totalSecsLeft / 60 / 60 / 24),
              weeks: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 7),
              months: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 30.4368),
              years: Math.abs(this.finalDate.getFullYear() - d.getFullYear())
            }, this.options.elapse || 0 !== this.totalSecsLeft ? this.dispatchEvent("update") : (this.stop(), this.dispatchEvent("finish")))
          }, dispatchEvent: function (b) {
            var c = a.Event(b + ".countdown");
            c.finalDate = this.finalDate, c.elapsed = this.elapsed, c.offset = a.extend({}, this.offset), c.strftime = d(this.offset), this.$el.trigger(c)
          }
        }), a.fn.countdown = function () {
          var b = Array.prototype.slice.call(arguments, 0);
          return this.each(function () {
            var c = a(this).data("countdown-instance");
            if (void 0 !== c) {
              var d = f[c], e = b[0];
              j.prototype.hasOwnProperty(e) ? d[e].apply(d, b.slice(1)) : null === String(e).match(/^[$A-Z_][0-9A-Z_$]*$/i) ? (d.setFinalDate.call(d, e), d.start()) : a.error("Method %s does not exist on jQuery.countdown".replace(/\%s/gi, e))
            } else new j(this, b[0], b[1])
          })
        }
      });
      $('#countdown').countdown(promoCode.date)
        .on('update.countdown', function (event) {
          //var format = '%H:%M:%S';
          var format = '';
          if (event.offset.seconds > 0 && event.offset.hours === 0 && event.offset.days === 0 && event.offset.weeks === 0) {
            format = '%-S seconde%!S ' + format;
          }
          //if (event.offset.minutes > 0 && event.offset.days === 0) {
          if (event.offset.minutes > 0) {
            format = '%-M minute%!M ' + format;
          }
          //if (event.offset.hours > 0 && event.offset.weeks === 0) {
          if (event.offset.hours > 0) {
            format = '%-H heure%!H ' + format;
          }
          if (event.offset.days > 0) {
            format = '%-d jour%!d ' + format;
          }
          if (event.offset.weeks > 0) {
            format = '%-w semaine%!w ' + format;
          }
          $(this).html(event.strftime(format));
          $(this).parent().show();
        })
        .on('finish.countdown', function () {
          $(this).parent().hide();
        });
    }
  }

  showLock() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(ModalActionCreators.open('showSignup'));
  }

  hasPromo() {
    let pathName = this.context.location.pathname.split('/').join('');
    let HasProm = _.find(config.promoCodes, function (promo) {
      return pathName === promo.code;
    });
    return HasProm;
  }

  showGiftLock() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(ModalActionCreators.open('showGift', true, '/select-plan/afrostreamgift/checkout'));
  }

  showPromoGiftLock() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(ModalActionCreators.open('showSignin', true, '/select-plan/afrostreamgift/checkout'));
  }

  render() {

    const {
      props: {
        Movie,Season,Episode,params
        }
      } = this;

    let { movieId,seasonId,episodeId } = params;
    let info = {
      title: 'Les meilleurs films et séries \n afro-américains et africains \n en illimité',
      poster: `${config.metadata.shareImage}`
    };

    let movieData;
    //let videoData;
    let seasonData;
    let episodeData;
    if (movieId) {
      movieData = Movie.get(`movies/${movieId}`);
    }
    if (movieData) {
      if (seasonId) {
        seasonData = Season.get(`seasons/${seasonId}`);
      }
      if (episodeId) {
        if (seasonData) {
          let episodesList = seasonData.get('episodes');
          if (episodesList) {
            episodeData = episodesList.find(function (obj) {
              return obj.get('_id') == episodeId;
            });
          }
        } else {
          episodeData = Episode.get(`episodes/${episodeId}`);
        }
      }
      //si on a les données de l'episode alors, on remplace les infos affichées
      const data = episodeData ? movieData.merge(episodeData) : movieData;

      let title = movieData.get('title');

      if (seasonData) {
        let seasonNumber = seasonData.get('seasonNumber');
        title = `${title} Saison ${seasonNumber}`;
      }
      if (episodeData) {
        let episodeNumber = episodeData.get('episodeNumber');
        title = `${title} Épisode ${episodeNumber}`;
      }


      let poster = data.get('poster');
      if (poster) {
        info.poster = poster.get('imgix');
      }
      info.movie = {
        title: title,
        synopsis: data.get('synopsis')
      }
    }

    let imageStyle = {backgroundImage: `url(${info.poster}?crop=faces&fit=clip&w=${this.state.size.width}&h=${this.state.size.height}&q=${config.images.quality}&fm=${config.images.type})`};

    let promoCode = this.hasPromo();

    let welcomeClassesSet = {
      'welcome-header': true,
      'promo': promoCode
    };


    if (!promoCode) {
      return (
        <section className={classSet(welcomeClassesSet)} style={imageStyle}>
          <div className="afrostream-movie__mask"/>
          <div className="afrostream-movie">
            { info.movie ? <div className="afrostream-movie__info">
              <h1>{info.movie.title}</h1>
              <div className='detail-text'>{info.movie.synopsis}</div>
            </div> : ''}
            <div className="afrostream-movie__subscribe">
              <div className="afrostream-statement">{info.title.split('\n').map((statement, i) => {
                return (<span key={`statement-${i}`}>{statement}</span>)
              })}</div>
              <button className="subscribe-button" type=" button" onClick={::this.showLock}>TESTER GRATUITEMENT <br />
                PENDANT UNE SEMAINE
              </button>
            </div>
          </div>
        </section>
      );
    }
    else if (promoCode && promoCode.code == 'SENEGALSERIE') {

      return (
        <section className={classSet(welcomeClassesSet)} style={imageStyle}>
          <div className="promo-content">
            <div className="promo-message">
              <h2>{promoCode.promoHeader}
                <div>avec le code promo: {promoCode.code}</div>
              </h2>
              <h5>Fin de l'offre promotionnelle dans</h5>
              <div id="countdown"></div>
              <button className="subscribe-button-promo" type=" button" onClick={::this.showLock}>PROFITEZ EN
                MAINTENANT
              </button>
            </div>
            <h6>{promoCode.promoConditions1}</h6>
            <h6>{promoCode.promoConditions2}</h6>
          </div>
        </section>
      );
    } else {

      return (
        <section className={classSet(welcomeClassesSet)} style={imageStyle}>
          <div className="promo-content">
            <div className="promo-message">
              <h2>{promoCode.promoHeader}
                <div>avec le code promo: {promoCode.code}</div>
              </h2>
              <h5>Fin de l'offre promotionnelle dans</h5>
              <div id="countdown"></div>
              <button className="subscribe-button-promo" type=" button" onClick={::this.showPromoGiftLock}>OFFRIR
                MAINTENANT
              </button>
            </div>
            <h6>{promoCode.promoConditions1}</h6>
            <h6>{promoCode.promoConditions2}</h6>
          </div>
        </section>
      );
    }
  }
}

export default WelcomeHeader;
