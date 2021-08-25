import React, {memo, useEffect, useState} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {useNavigation, useRoute, useTheme} from '@react-navigation/native';
import {AccordionList} from 'accordion-collapse-react-native';

import BibleAPI from '../services/apis/bible';
import Text from '../components/Text';

const ChapterItem = memo(({item, book}) => {
  const {navigate} = useNavigation();
  const {colors} = useTheme();
  const handleClickChapter = () => {
    navigate('Chapter', {
      bibleId: item.bibleId,
      chapterId: item.id,
      title: `${book}-${item.number}`,
    });
  };
  return (
    <Text
      style={[styles.chapterItem, {borderColor: colors.text}]}
      onPress={handleClickChapter}>
      {item.number}
    </Text>
  );
});

const BookScreen = () => {
  const {params} = useRoute();
  const [books, setBooks] = useState([]);
  const [activeBooks, setActiveBooks] = useState([]);

  useEffect(() => {
    BibleAPI.get(`/bibles/${params.bibleId}/books`, {
      params: {
        'include-chapters': true,
      },
    }).then(res => setBooks(res.data.data));
  }, [params.bibleId]);

  return (
    <AccordionList
      list={books}
      activeSections={activeBooks}
      keyExtractor={book => book.id}
      header={book => <Text style={styles.book}>{book.name}</Text>}
      body={book => (
        <FlatList
          data={book.chapters}
          keyExtractor={item => item.id}
          numColumns={5}
          columnWrapperStyle={styles.chapter_wrapper}
          renderItem={({item}) => (
            <View style={styles.chapter}>
              <ChapterItem item={item} book={book.name} />
            </View>
          )}
        />
      )}
      onChange={setActiveBooks}
    />
  );
};

const styles = StyleSheet.create({
  chapter_wrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  chapter: {
    flex: 0.2,
  },
  container: {
    flexGrow: 1,
  },
  book: {
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 12,
  },
  chapterItem: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
    textAlign: 'center',
  },
});
export default BookScreen;
