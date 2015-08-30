import React from 'react';

if (process.env.BROWSER) {
  require('./Press.less');
}

class Press extends React.Component {

  render() {

    return (
      <section className="press">
        <div className="press-text">
          <h2>Ils parlent de nous</h2>
        </div>

        <div className="press-images">
          <div className="press-image">
            <a
              href="http://www.lemonde.fr/afrique/article/2015/02/26/afrostream-se-reve-en-netflix-africain_4584215_3212.html"
              target="_blank">
              <img src="/images/thumb_lemonde.jpg"/>
            </a>
          </div>
          <div className="press-image">
            <a href="/articles/forbes_article.pdf" target="_blank">
              <img src="/images/thumb_forbes.jpg"/>
            </a>
          </div>
          <div className="press-image">
            <a href="http://www.ebony.com/entertainment-culture/afrostream-the-african-netflix#axzz3bmSywRgn"
               target="_blank">
              <img src="/images/thumb_ebony.jpg"/>
            </a>
          </div>
          <div className="press-image">
            <a href="http://techcrunch.com/2015/07/17/afrostream-is-netflix-for-african-and-african-american-movies/"
               target="_blank">
              <img src="/images/thumb_techcrunch.jpg"/>
            </a>
          </div>
          <div className="press-image">
            <a
              href="http://www.lesechos.fr/tech-medias/medias/021219626643-afrostream-le-netflix-africain-accelere-1138741.php"
              target="_blank">
              <img src="/images/lesechos.png"/>
            </a>
          </div>
          <div className="press-image">
            <a
              href="http://afrique.lepoint.fr/culture/vod-tonje-bakang-afrostream-le-cinema-afro-s-invite-a-la-maison-03-03-2015-1909711_2256.php"
              target="_blank">
              <img src="/images/thumb_lepoint.jpg"/>
            </a>
          </div>
          <div className="press-image">
            <a href="https://www.youtube.com/watch?v=L-rnHG2daSE&sns=em" target="_blank">
              <img src="/images/thumb_bfm.jpg"/>
            </a>
          </div>
          <div className="press-image">
            <a href="http://www.jeuneafrique.com/Article/JA2822p070.xml0/" target="_blank">
              <img src="/images/thumb_jeune_afrique.jpg"/>
            </a>
          </div>
        </div>
      </section>
    );
  }
}

export default Press;
