import React from 'react';
import {SafeAreaView, StatusBar, Text, useColorScheme} from 'react-native';
import {Provider} from 'react-redux';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {PersistGate} from 'redux-persist/integration/react';

import AppNavigator from './src/navigation';
import createStore from './src/redux/store';
import {ScrollerProvider} from './src/utils/scroller';
import useScrollFeature from './src/hooks/useScrollFeature';

const {store, persistor} = createStore();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };
  const {scrollViewRef, scroller} = useScrollFeature();

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ScrollerProvider scroller={scroller} scrollViewRef={scrollViewRef}>
            <AppNavigator />
          </ScrollerProvider>
        </PersistGate>
      </Provider>
    </SafeAreaView>
  );
};

export default App;
