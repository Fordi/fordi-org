import React from 'react';
import Layout from './Layout';
import Portfolio from './Portfolio';
import TwoPiece from './TwoPiece';
import About from './About';
import Nav from './Nav';
import GitTag from './GitTag';

export default () => (
  <Layout>
    <TwoPiece
      top={Portfolio}
      nav={Nav}
      bottom={About}
    />
    <GitTag href="https://github.com/fordi/fordi-org"/>
  </Layout>
);
