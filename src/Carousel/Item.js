import React from 'react';
import ExtLink from '_/ExtLink';
import { joinClass } from '_/helpers';
import styles from './index.module.scss';

export default ({
  id, href, image, title, children, className
}) => (
  <li className={joinClass(styles.item, className)} id={id}>
    <div className={styles.shadow}>&nbsp;</div>
    <ExtLink href={href}>
      <img src={image} className={styles.image} alt={title} />
    </ExtLink>
    <div className={styles.flavor}>{children}</div>
  </li>
);
