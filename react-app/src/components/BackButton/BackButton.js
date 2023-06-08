import React from 'react';
import {TouchableHighlight, Image} from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

export default function BackButton(props) {
  return (
    <TouchableHighlight onPress={props.onPress} style={styles.btnContainer}>
      <Image
        source={require('../../../assets/1564492_navigation_back_arrow_left_icon.png')}
        style={styles.btnIcon}
      />
    </TouchableHighlight>
  );
}

BackButton.propTypes = {
  onPress: PropTypes.func,
  source: PropTypes.number,
  title: PropTypes.string,
};
