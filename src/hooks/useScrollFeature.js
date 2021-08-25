import {useMemo, useRef} from 'react';
import Scroller from '../utils/scroller';

export default function useScrollFeature(scrollerDep) {
  const scrollViewRef = useRef(null);
  const scroller = useMemo(() => new Scroller(scrollViewRef), [scrollerDep]);
  return {
    scroller,
    scrollViewRef,
  };
}
