import React from 'react';
import { prepareRoute } from '../../decorators';
import * as EventActionCreators from '../../actions/event';
import MarkdownIt from 'markdown-it';
import config from '../../../../config';
const md = MarkdownIt(config.markDown);

@prepareRoute(async function ({ store }) {
  return await * [
    store.dispatch(EventActionCreators.pinHeader(true))
  ];
})
class CGU extends React.Component {
  render() {
    return (
      <div className="row-fluid">
        <article>
          {md.render(require('./cgu.md'))}
        </article>
      </div >
    );
  }
}

export default CGU;
