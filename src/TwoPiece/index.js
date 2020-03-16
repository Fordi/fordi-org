import React, { useState } from 'react';
import styles from './index.module.scss';
import { joinClass } from '_/helpers';

export default ({ className, top: Top, bottom: Bottom, nav: Nav }) => {
  const [selected, setSelected] = useState('top');
  const setToTop = () => setSelected('top');
  const setToBottom = () => setSelected('bottom');
  return (
    <div className={joinClass(styles.twoPiece, className, styles[`${selected}-selected`])}>
      <div className={styles.top}>{<Top selected={selected === 'top'} />}</div>
      <Nav {...{ setToTop, setToBottom, selected }} />
      <div className={styles.bottom}>{<Bottom selected={selected === 'bottom'} />}</div>
    </div>
  );
};

