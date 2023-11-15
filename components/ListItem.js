import * as React from 'react';
import { VirtualizedList, TouchableOpacity, Button, FlatList, StyleSheet, Text, View } from 'react-native';

const itemstyles = StyleSheet.create({
  item: {
    padding: 0,
    fontSize: 12,
    height: 44,
  },
  title: {
    fontSize: 22,
  },
});

// Our simple Display component for our own List appearance.
// this is our custom React UI component
const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[itemstyles.item, backgroundColor]}>
    <Text style={[itemstyles.title, textColor]}>{item.key}</Text>
    
  </TouchableOpacity>
);

 

export {Item}