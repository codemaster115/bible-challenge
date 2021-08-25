import React, {createContext, useContext} from 'react';
import {Platform} from 'react-native';
import {EventEmitter} from 'events';

export default class Scroller {
  scrollRef = null;
  entriesMap = {};
  entriesCoordinates = [];
  eventEmitter = new EventEmitter();
  lastEntryName = '';
  offset = 0;

  constructor(ref) {
    this.scrollRef = ref;
  }

  handlers = {
    onContentSizeChange: () => {
      this.entriesCoordinates = Object.entries(this.entriesMap).sort(
        (a, b) => a[1] - b[1],
      );
    },
    onScroll: ({nativeEvent}) => {
      const offsetY = nativeEvent.contentOffset.y - this.offset;
      const layoutHeight = nativeEvent.layoutMeasurement.height;
      // We use a conditional to avoid overheading the JS thread on Android.
      // On iOS, scrollEventThrottle will do the work.
      if (Platform.OS !== 'android' || Math.abs(nativeEvent.velocity.y) < 1) {
        for (let i = 0; i < this.entriesCoordinates.length; i++) {
          const [entryName, lowerBound] = this.entriesCoordinates[i];
          const upperBound =
            i < this.entriesCoordinates.length - 1
              ? this.entriesCoordinates[i + 1][1]
              : lowerBound + layoutHeight;
          if (offsetY >= lowerBound && offsetY < upperBound) {
            if (entryName !== this.lastEntryName) {
              this.eventEmitter.emit('select-verse', entryName);
              this.lastEntryName = entryName;
            }
            break;
          }
        }
      }
    },
  };

  setOffset(offset) {
    this.offset = offset;
  }

  addSelectedEntryListener(listener) {
    this.eventEmitter.addListener('select-verse', listener);
  }

  removeSelectedEntryListener(listener) {
    this.eventEmitter.removeListener('select-verse', listener);
  }

  registerScrollVerse(name, layout) {
    this.entriesMap[name] = layout.nativeEvent.layout.y;
  }

  scrollToVerse(verse) {
    if (verse in this.entriesMap) {
      this.scrollRef.current?.scrollTo({
        y: this.entriesMap[verse] + this.offset,
        animated: true,
      });
    }
  }
}

const ScrollerContext = createContext(null);

export function useScroller() {
  return useContext(ScrollerContext);
}

export function ScrollerProvider({children, scroller, scrollViewRef}) {
  return (
    <ScrollerContext.Provider value={{scroller, scrollViewRef}}>
      {children}
    </ScrollerContext.Provider>
  );
}
