import {useTheme} from '@react-navigation/native';
import React from 'react';
import {Text as RNText} from 'react-native';

const Text = props => {
  const {colors} = useTheme();
  const {style, ...rest} = props;
  return <RNText {...rest} style={[[{color: colors.text}, style]]} />;
};

export default Text;
