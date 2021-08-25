import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {useNavigation, useRoute, useTheme} from '@react-navigation/native';
import RenderHtml, {
  TChildrenRenderer,
  useTNodeChildrenProps,
} from 'react-native-render-html';
import {useDispatch} from 'react-redux';

import BibleAPI from '../services/apis/bible';
import {useScroller} from '../utils/scroller';
import {toggleFavorite} from '../redux/actions/favorites';
import Text from '../components/Text';

const HZ_MARGIN = 10;

function PRenderer(props) {
  const {params} = useRoute();
  const {scroller} = useScroller();
  const {TDefaultRenderer, tnode, ...defaultRendererProps} = props;
  const tchildrenProps = useTNodeChildrenProps(props);
  const dispatch = useDispatch();

  if (params.chapterId.includes('intro')) {
    return <TDefaultRenderer tnode={tnode} {...defaultRendererProps} />;
  }

  let children = [];
  for (var i = 0; i < tnode.children.length; i += 2) {
    children.push(
      <TChildrenRenderer
        {...tchildrenProps}
        key={tnode.children[i].data}
        propsForChildren={{verseNumber: tnode.children[i].data}}
        tchildren={[tnode.children[i + 1]]}
        renderChild={p => (
          <Text
            key={p.propsFromParent.verseNumber}
            style={[p.childTnode.styles.nativeTextFlow]}
            onPress={() =>
              dispatch(
                toggleFavorite({
                  ...params,
                  verseId: p.propsFromParent.verseNumber,
                  content: p.childTnode.data,
                }),
              )
            }
            onLayout={e => {
              scroller.registerScrollVerse(p.childTnode.data, e);
            }}>
            {p.childTnode.data}
          </Text>
        )}
      />,
    );
  }

  return (
    <TDefaultRenderer tnode={tnode} {...defaultRendererProps}>
      {children}
    </TDefaultRenderer>
  );
}

const ChapterScreen = () => {
  const {params} = useRoute();
  const {setOptions} = useNavigation();
  const [chapter, setChapter] = useState();
  const {width} = useWindowDimensions();
  const {colors} = useTheme();
  useEffect(() => {
    setOptions({title: params.title});
  }, [setOptions, params.title]);

  useEffect(() => {
    BibleAPI.get(`/bibles/${params.bibleId}/chapters/${params.chapterId}`)
      .then(res => setChapter(res.data.data))
      .catch(err => console.log(err.request));
  }, [params.bibleId, params.chapterId]);

  const {scrollViewRef, scroller} = useScroller();
  const baseStyle = {color: colors, fontSize: 18};

  return (
    <ScrollView
      {...scroller.handlers}
      style={styles.container}
      ref={scrollViewRef}
      scrollEventThrottle={100}
      contentContainerStyle={[styles.content, {width}]}>
      {chapter ? (
        <RenderHtml
          contentWidth={width}
          source={{html: chapter.content}}
          baseStyle={baseStyle}
          classesStyles={{v: {fontSize: 12, fontStyle: 'italic'}}}
          renderers={{
            p: PRenderer,
          }}
          enableExperimentalMarginCollapsing
          dangerouslyDisableHoisting
        />
      ) : (
        <ActivityIndicator />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    alignSelf: 'center',
    paddingHorizontal: HZ_MARGIN,
  },
  loading: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChapterScreen;
