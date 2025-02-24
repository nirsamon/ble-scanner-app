import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import styles from '../styles/styles';

const AppButton = ({
  title,
  onPress,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  disabled: boolean;
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default AppButton;
