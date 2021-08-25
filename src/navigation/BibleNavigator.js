import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import BibleScreen from '../screens/Bibles';
import BookScreen from '../screens/Books';
import ChapterScreen from '../screens/Chapter';

const Stack = createStackNavigator();

function BibleNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Bible" component={BibleScreen} />
      <Stack.Screen name="Books" component={BookScreen} />
      <Stack.Screen name="Chapter" component={ChapterScreen} />
    </Stack.Navigator>
  );
}

export default BibleNavigator;
