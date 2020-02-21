import React from 'react';
import Layout from '_/Layout';
import Portfolio from '_/Portfolio';
import TwoPiece from '_/TwoPiece';
import About from '_/About';
import Nav from '_/Nav';
import GitTag from '_/GitTag';

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
