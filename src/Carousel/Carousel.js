import React, { Children, cloneElement, useState } from 'react';
import { joinClass } from '../globals';

import { 
  container,
  carousel,
  earlier,
  previous,
  next,
  later,
  hidden,
  activeItem,
  nextBtn,
  prevBtn,
  control
} from './index.module.scss';

export default ({ children, className, listClass }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const prevItem = () => setActiveIndex(((activeIndex - 1) + children.length) % children.length);
  const nextItem = () => setActiveIndex((activeIndex + 1) % children.length);
  const classes = [earlier, previous, activeItem, next, later];
  const childrenWithProps = Children.map(children, (child, index) => {
    const classIndex = (index - activeIndex + 2 + children.length) % children.length;
    return cloneElement(child, { className: joinClass(child.props.className, classes[classIndex] || hidden) });
  });
  const { title } = childrenWithProps[activeIndex].props;
  return (
    <div className={joinClass(container, className)}>
      <button type="button" onClick={prevItem} className={joinClass(control, prevBtn)}>Previous</button>
      <button type="button" onClick={nextItem} className={joinClass(control, nextBtn)}>Next</button>
      <h1>{title}</h1>
      <ul className={joinClass(carousel, listClass)}>
        {childrenWithProps}
      </ul>
    </div>
  );
};
