import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import Slide from './Slide';
import ReactList from 'react-list';

class Slides extends React.Component {

  static propTypes = {
    slides: PropTypes.instanceOf(Immutable.List).isRequired,
    page: React.PropTypes.number.isRequired
  }

  //renderItem(index, key) {
  //  const slideNode = this.slides[index];
  //  console.log(slideNode,index,key);
  //  return <Slide key={key} imagePath={slideNode.imagePath}
  //                imageAlt={slideNode.imageAlt}
  //                title={slideNode.title} subtitle={slideNode.subtitle} text={slideNode.text}
  //                action={slideNode.action}
  //                actionHref={slideNode.actionHref}/>;
  //}

  render() {
    const {
      props: { slides,page }
      } = this;

    return (
      <div className="slides">
        {slides.map((category, i) => <Slide active={page === i}
                                            key={category._id}
          { ...{category}}/>)}
      </div>
    );
//    return (
//      <div className="slides">
//        <ReactList itemRenderer={this.renderItem}
//                   length={slides.size} slides={slides}
//                   type='uniform'/>
//      </div>
//    );
  }
}

export default Slides;
