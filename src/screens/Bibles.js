import {useNavigation} from '@react-navigation/native';
import React, {memo, useEffect, useState} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';

import BibleAPI from '../services/apis/bible';
import Text from '../components/Text';

const BibleItem = memo(({item}) => {
  const {navigate} = useNavigation();
  const handleClickBible = () => {
    navigate('Books', {bibleId: item.id});
  };

  return (
    <View>
      <Text style={styles.bible} onPress={handleClickBible}>
        {item.name}
      </Text>
    </View>
  );
});

const BookScreen = () => {
  const [bibles, setBibles] = useState([]);
  useEffect(() => {
    BibleAPI.get('/bibles', {params: {language: 'eng'}}).then(res =>
      setBibles(res.data.data),
    );
  }, []);

  return (
    <FlatList
      data={bibles}
      keyExtractor={item => item.id}
      renderItem={({item}) => <BibleItem item={item} />}
    />
  );
};

const styles = StyleSheet.create({
  bible: {
    fontSize: 16,
    marginVertical: 5,
  },
});
export default BookScreen;
