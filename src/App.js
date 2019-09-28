import React from 'react';
import Layout from './Layout';
import Portfolio from './Portfolio';
import TwoPiece from './TwoPiece';
import About from './About';
import Nav from './Nav';

export default () => (
  <Layout>
    <TwoPiece 
      top={Portfolio}
      nav={Nav}
      bottom={About}
    />
  </Layout>
);
