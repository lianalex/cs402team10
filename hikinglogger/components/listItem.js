import * as React from 'react';
import { useState } from 'react';
import { VirtualizedList, TouchableOpacity, Button, FlatList, StyleSheet, Text, View, Modal, TextInput } from 'react-native';

const Item = ({ item, onPress, backgroundColor, textColor }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemKey, setNewItemKey] = useState(item.key);

  const updateItemKey = () => {
    item.key = newItemKey;
    console.log('New Item Key:', newItemKey);
    setModalVisible(false); 
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, marginBottom: 10 }}>
      <TouchableOpacity onPress={onPress} style={[{ padding: 10 }, backgroundColor]}>
        <Text style={textColor}>{item.key}</Text>
      </TouchableOpacity>
      <Button title="Edit" onPress={() => setModalVisible(true)} style={textColor}></Button>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, elevation: 5 }}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ alignSelf: 'flex-end' }}>
              <Text style={{ fontSize: 20 }}>X</Text>
            </TouchableOpacity>
            <Text style={styles.headerText}>Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setNewItemKey(text)}
              value={newItemKey}
            />
            <Button title="Update" onPress={updateItemKey} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  editButton: {
    padding: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});



export {Item}