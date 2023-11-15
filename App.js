import React, { useState, useEffect, useRef } from 'react';
import { View, Button, VirtualizedList, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import DialogInput from 'react-native-dialog-input';
import Geocoder from 'react-native-geocoding';
import { useWindowDimensions } from 'react-native';
import { loadList, saveList } from './components/remoteAccess';
import { Item } from './components/ListItem';
import * as Location from 'expo-location';

const styles = StyleSheet.create({
  container: {
    /*flex: 4,
   paddingTop: 22,
   flexDirection: "column",
   borderWidth: 5*/
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  list: {
    flex: 1,
    borderWidth: 5,
    flexDirection: 'row',
  },
  rowblock: {
    height: 80,
    width: 400,
    padding: 5,
    borderWidth: 5,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 3,
  },
});

// Initialize Geocoder
Geocoder.init('AIzaSyDqW8jK0xxnIRKTKXACxIK-q3UerQTiCsA');

// declare our Virtual List App object.
const MapList = () => {
  const [list, setList] = useState([]);
  const [autonav, setnav] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [markers, setMarkers] = useState([]);
  const mapRef = React.createRef();
  const SCREEN_WIDTH = useWindowDimensions().width;
  const SCREEN_HEIGHT = useWindowDimensions().height;
  var mapStyle = { width: SCREEN_WIDTH, height: SCREEN_HEIGHT / 2 };


  const [mylocation, setLocal] = useState();
  const [mypos, setPosition] = useState();

  // gets current location
  useEffect(() => {
    getLocationAsync(setLocal, setPosition);
  }, [mypos]);

  // function to get the current location of the user
  async function getLocationAsync(alocalf, amarkf) {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alocalf('Permission to access location was denied');
    }

    let location = await Location.getCurrentPositionAsync({});

    var text = JSON.stringify(location);
    var apos = (
      <Marker
        coordinate={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }}
        title={'Your Location'}
        description={'Current Location'}
      />
    );
    amarkf(apos);
    alocalf(text);
  }

  // loads initial list
  useEffect(() => {
    if (list.length === 0) {
      const url =
        'https://cs.boisestate.edu/~scutchin/cs402/codesnips/loadjson.php?user=alexxliangg';
      loadList(url, list, setList, setMarkers);
    }
  }, [list]);

  // function to load list from remote URL
  function loadButton() {
    var urladdress =
      'https://cs.boisestate.edu/~scutchin/cs402/codesnips/loadjson.php?user=alexxliangg';
    loadList(urladdress, list, setList, setMarkers);
  }

  // function to save list to remote URL
  function saveButton() {
    var urladdress =
      'https://cs.boisestate.edu/~scutchin/cs402/codesnips/savejson.php?user=alexxliangg';
    saveList(urladdress, list);
  }

  // function to delete an entry in the virtualized list
  function delButton() {
    const newList = [];
    list.forEach((item) => {
      if (!item.selected) {
        newList.push(item);
      }
    });
    setList(newList);
  }

  const getItemCount = (data) => list.length;
  const getItem = (data, index) => list[index];

  // function to add a location to the virtualized list
  const addLocation = (locationName) => {
    Geocoder.from(locationName)
      .then((json) => {
        location = json.results[0].geometry.location;
        console.log(location);
        var newList = [
          {
            key: locationName,
            selected: false,
            longitude: location.lng,
            latitude: location.lat,
          },
          ...list,
        ];
        var newMarker = (
          <Marker
            coordinate={{ latitude: location.lat, longitude: location.lng }}
            title={locationName}
            description={'Description'}
          />
        );
        setMarkers([newMarker, ...markers]);
        setList(newList);
      })
      .catch((error) => console.warn(error));
  };

  // toggles selection for each item in the virtualized list
  const toggleList = (index) => {
    const newList = list.map((item, idx) => {
      if (idx === index) {
        item.selected = !item.selected;
        if (item.selected && autonav) {
          console.log(item.latitude);
          console.log(item.key);
          mapRef.current.animateToRegion({
            latitude: item.latitude,
            longitude: item.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          });
        }
      } else {
        item.selected = false;
      }
      return item;
    });
    setList(newList);
  };

  // renders the list items
  const renderItem = ({ item, index }) => {
    const backgroundColor = item.selected ? 'black' : 'white';
    const color = item.selected ? 'white' : 'black';
    return (
      <Item
        item={item}
        onPress={() => toggleList(index)}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={mapStyle}>
        {markers}
      </MapView>
      <Text>Whatever: {mylocation}</Text>
      <View style={styles.rowblock}>
        <View style={styles.buttonContainer}>
          <Button title="Load" onPress={() => loadButton()} />
          <Button title="Save" onPress={() => saveButton()} />
          <Button title="Delete" onPress={() => delButton()} />
          <Button title="Add Location" onPress={() => setShowDialog(true)} />
          <Button title="Auto" onPress={() => setNav(!autonav)} />
        </View>
      </View>
      <View style={styles.list}>
        <VirtualizedList
          data={list}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          getItemCount={getItemCount}
          getItem={getItem}
        />
      </View>
      <DialogInput
        isDialogVisible={showDialog}
        title="Enter Address"
        message="Enter The Address To Add"
        submitInput={(inputText) => {
          setShowDialog(false);
          addLocation(inputText);
        }}
        closeDialog={() => setShowDialog(false)}>
        <Text>Something</Text>
      </DialogInput>
    </View>
  );
};

export default MapList;
