import React from 'react';
import PageCurl from './PageCurl.svg';
import BackPage from './BackPage.svg';
import Code from './Code.png';
import styles from './index.module.scss';

export default ({ href }) => (
  <a href={href} className={styles.container} target="_blank" rel="noopener noreferrer">
    <img src={BackPage} className={styles.backPage} alt="" />
    <div className={styles['link--window']}>
      <div className={styles['link--inner']}>
        <img src={Code} alt="View it on GitHub" />
      </div>
    </div>
    <img src={PageCurl} className={styles.pageCurl} alt=""/>
  </a>
);
