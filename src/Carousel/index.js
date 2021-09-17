import { cloneElement } from 'preact';
import { useState } from 'preact/hooks';

import html from 'html';
import css from 'css';
import classes from 'classes';

import { useI18n } from '../I18n.js';
const {
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
} = css`
  .container {
    position: relative;
  }
  .carousel {
    display: block;
    position: relative;
    padding: 0;
    margin: 0 auto;
    width: 50vw;
    max-width: 640px;
  }
  .carousel>li {
    list-style-type: none;
  }
  .activeItem {
    opacity: 1;
    transform: none;
    z-index: 5;
  }
  .earlier {
    opacity: 0;
    transform: scale(0) translate(-100vw, 0);
    z-index: 1;
  }
  .previous {
    opacity: 0.5;
    transform: scale(0.5, 0.5) translate(-50vw, 0);
    z-index: 3;
  }
  .next {
    opacity: 0.5;
    transform: scale(0.5, 0.5) translate(50vw, 0);
    z-index: 4;
  }
  .later {
    opacity: 0;
    transform: scale(0) translate(100vw, 0);
    z-index: 2;
  }
  .hidden {
    opacity: 0;
    display: none;
  }
  .control {
    position: absolute;
    z-index: 6;
    width: 50px;
    height: 50vh;
    margin: 0;
    padding: 0;
    top: 25vh;
    background: none;
    border: none;
    color: transparent;
    cursor: pointer;
  }
  .control:before {
    color: white;
    text-shadow: 0 0 5px black;
    font-size: 50px;
    line-height: 50vh;
  }
  .control:focus {
    outline: none;
  }
  .prevBtn {
    left: 0;
    cursor: w-resize;
  }
  .prevBtn:before { content: '<'; }
  .nextBtn {
    right: 0;
    cursor: e-resize;
  }
  .nextBtn:before { content: '>'; }
`;

export default ({ children, className, listClass }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const prevItem = () => setActiveIndex(((activeIndex - 1) + children.length) % children.length);
  const nextItem = () => setActiveIndex((activeIndex + 1) % children.length);
  const states = [earlier, previous, activeItem, next, later];
  const childrenWithProps = children.map((child, index) => {
    const classIndex = (index - activeIndex + 2 + children.length) % children.length;
    return cloneElement(child, { className: classes(child.props.className, states[classIndex] || hidden) });
  });
  const { title } = childrenWithProps[activeIndex].props;
  const _ = useI18n();
  return html`
    <div className=${container.and(className)}>
      <button type="button" onClick=${prevItem} className=${control.and(prevBtn)}>Previous</button>
      <button type="button" onClick=${nextItem} className=${control.and(nextBtn)}>Next</button>
      <h1>${title}</h1>
      <ul className=${carousel.and(listClass)}>
        ${childrenWithProps}
      </ul>
    </div>
  `;
};
