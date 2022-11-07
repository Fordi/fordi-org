import { createElement } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import DefaultErrorComponent from './DefaultErrorComponent.js';
import LayoutContext, { LayoutComponent } from './LayoutContext.js';

const delay = (t) => new Promise((r) => setTimeout(r, t));

export default ({ layoutName, Loading, transitionDelay = 0 }) => {
  const { layoutCache } = useContext(LayoutContext);
  const [layoutPromise, setLayoutPromise] = useState(null);
  const [layoutData, setLayoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(async () => {
    setLoading(true);
    setLayoutPromise(delay(transitionDelay).then(() => layoutCache.get(layoutName)));
  }, [layoutName, layoutCache]);

  useEffect(async () => {
    try {
      setLayoutData(await layoutPromise);
      setLoading(false);
    } catch (e) {
      setError(e);
      setLoading(false);
    }
  }, [layoutPromise]);

  return [
    createElement(Loading, { visible: loading }),
    ...(error
      ? [createElement(DefaultErrorComponent, { error })]
      : [
        layoutData?.map(([
          componentName,
          props,
          children,
        ]) => createElement(LayoutComponent, {
          ...props,
          componentName,
          children,
        }))
      ]
    )
  ];
};
