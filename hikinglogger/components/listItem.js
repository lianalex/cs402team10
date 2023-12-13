import * as React from 'react';
import { useState } from 'react';
import { VirtualizedList, TouchableOpacity, Button, FlatList, StyleSheet, Text, View, Modal, TextInput } from 'react-native';
import * as Sharing from 'expo-sharing';
import ImagePicker from 'react-native-image-picker';
const itemstyles = StyleSheet.create({
  item: {
    padding: 10,
    fontSize: 12,
    height: 44,
  },
  title: {
    fontSize: 22,
  },
});



const Item = ({ item, onPress, delButton, backgroundColor, textColor }) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [newItemKey, setNewItemKey] = useState(item.key);
  const [newItemDesc, setNewItemDesc] = useState(item.description);
  const [selectedImage, setSelectedImage] = useState(null);

  const updateItem = () => {
    item.key = newItemKey;
    item.description = newItemDesc;
    setEditModalVisible(false); 
  };

  function selectAndDelButton(){
    delButton();
  }

  async function shareHike() {
    Sharing.shareAsync(item.key);
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, marginBottom: 10 }}>
      <TouchableOpacity onPress={onPress} style={[{ padding: 10 }, backgroundColor]}>
        <Text style={textColor}>{item.key}</Text>
      </TouchableOpacity>
      <Button title="view" onPress={() => setViewModalVisible(true)} style={textColor}></Button>
      <Button title="Edit" onPress={() => setEditModalVisible(true)} style={textColor}></Button>
      <Button title="Delete" onPress={() => selectAndDelButton()}></Button>
      
      {/* modal for viewing hike */}
      <Modal 
        animationType="slide"
        transparent={true}
        visible={viewModalVisible}
        onRequestClose={() => {
          setViewModalVisible(false);
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, elevation: 5 }}>
            <TouchableOpacity onPress={() => setViewModalVisible(false)} style={{ alignSelf: 'flex-end' }}>
              <Text style={{ fontSize: 20 }}>X</Text>
            </TouchableOpacity>
            <Text style={styles.headerText}>Name:</Text>
            <Text style={styles.input}>
              {item.key}
            </Text>
            <Text style={styles.input}>
              {item.description}
            </Text>
            
            <Button title="Update" onPress={updateItem} />
            <Button title='Share' onPress={() => shareHike()} style={{padding: 0, fontSize: 20, color: 'green'}}/>
          </View>
        </View>
      </Modal>

      {/* modal for editing hike info  */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => {
          setEditModalVisible(false);
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, elevation: 5 }}>
            <TouchableOpacity onPress={() => setEditModalVisible(false)} style={{ alignSelf: 'flex-end' }}>
              <Text style={{ fontSize: 20 }}>X</Text>
            </TouchableOpacity>
            <Text style={styles.headerText}>Name:</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setNewItemKey(text)}
              value={newItemKey}
            />
            <TextInput
              style={styles.input}
              onChangeText={(text) => setNewItemDesc(text)}
              value={newItemDesc}
            />
            <Button title="Update" onPress={updateItem} />
            <Button title='Share' onPress={() => shareHike()} style={{padding: 0, fontSize: 20, color: 'green'}}/>
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