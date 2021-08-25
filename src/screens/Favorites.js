import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, FlatList, Pressable, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';

import {useScroller} from '../utils/scroller';
import Text from '../components/Text';

const FavoriteScreen = () => {
  const {list} = useSelector(state => state.favs);
  const {navigate} = useNavigation();
  const {scroller} = useScroller();

  return (
    <View>
      <FlatList
        data={list}
        renderItem={({item}) => (
          <Pressable
            onPress={() => {
              navigate('Chapter', item);
              scroller.scrollToVerse(item.content);
            }}>
            <Text style={styles.favorite}>
              {item.chapterId}
              {'\n'}
              {item.content}
            </Text>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  favorite: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  separator: {
    height: 1,
    marginVertical: 5,
    backgroundColor: 'grey',
  },
});
export default FavoriteScreen;
