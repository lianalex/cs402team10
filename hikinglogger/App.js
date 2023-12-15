import React, {useState, useEffect} from 'react';
import {Alert, Dimensions, VirtualizedList, TouchableOpacity, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import {Item} from './components/listItem.js'
import {loadList, saveList} from './components/remoteAccess'
import MapView from 'react-native-maps';
import Geolocation from 'react-native-maps';
import {Marker} from 'react-native-maps';
import {useWindowDimensions} from 'react-native';
import DialogInput from 'react-native-dialog-input';
import Geocoder from 'react-native-geocoding'
import { getDistance } from 'geolib';
import ImagePicker from 'react-native-image-picker';
import { Polyline } from 'react-native-maps';
import axios from 'axios';

const styles = StyleSheet.create({
  container: {
   flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  bcontainer: {
   flexDirection: "row",
   flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  list: {
   flex: 20,
   paddingTop: 2,
   borderWidth: 5,
  },
  
  rowblock: {
    height: 80,
    width: 300,
    padding: 5,
    borderWidth: 0,
    alignItems: 'center',
  },
  buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 5,
      padding: 0,
      paddingTop: 0,
  },
   
  map:  {width: Dimensions.get('window').width, height: Dimensions.get('window').height/2},
  label:{ flex: 0.2, fontSize: 22, padding: 5}
});


var emptydata = [];
Geocoder.init("");

const MapList = () => {

    const [list, setlist] = useState([]);
    const [autonav,setnav] = useState(true);
    const [ashowme,setshowme] = useState(false);

    var mlist=[];
    const [markers,setMarks] = useState(mlist);

    const getItemCount = (data) => list.length;
    const getItem = (data, index) => (list[index]);

    const [hikePath, setHikePath] = useState([]);
    const [waypoints, setWaypoints] = useState([]);

    const [mapType, setMapType] = useState('standard');
    const [currentWeather, setCurrentWeather] = useState(null);


    useEffect(() => {
   
      if (list.length == 0)
      {
        var urladdress = "https://cs.boisestate.edu/~scutchin/cs402/codesnips/loadjson.php?user=tommytrov"
        const response = loadList(urladdress,list,setlist,setMarks)
      }
     
    }, [list])

    function loadButton() {
        var urladdress = "https://cs.boisestate.edu/~scutchin/cs402/codesnips/loadjson.php?user=tommytrov"
        const response = loadList(urladdress,list,setlist,setMarks)
    }

    function saveButton() {
        var urladdress = "https://cs.boisestate.edu/~scutchin/cs402/codesnips/savejson.php?user=tommytrov"
        const response = saveList(urladdress,list)
    }

    function plusButton() {
      setshowme(true);
    }
   
    function addLocation(alocation) { 
      
      var location = {};
      // Geolocation.getCurrentPosition(info);
      Geocoder.from(alocation)
       
		.then(json => {
			location = json.results[0].geometry.location;
			console.log(location);
		    console.log(location);

            var newList = [{key: alocation, description: "", selected: false, longitude: location.lng, latitude: location.lat }]
      var amark = <Marker
                        coordinate={{latitude: location.lat, longitude: location.lng}}
                                  title={alocation}
                                  description={"Location"}
                                  />
      newList = newList.concat(list)
      
      var marklist = markers.concat(amark);
      setlist(newList);
      setMarks(marklist);
    })
		.catch(error => console.warn(error));
    }

    function delButton() {
      const newList = [];
      list.forEach((item) =>
      {
         if (!item.selected) {
           newList.push(item);
         }
      })
      setlist(newList);
    }
 
    const renderItem = ({ item,index }) => {
        const backgroundColor = item.selected ? 'black' : 'white';
         const color = item.selected ? 'white' : 'black';
             return (
      <Item item={item} onPress={() => {toggleList(index)}}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
        };

    function toggleList(aindex) {
      const newList = list.map((item, index) => {
        if (aindex === index) {
          if (!item.selected) {
            item.selected = true;
            fetchWeatherData(item.latitude, item.longitude); 
            if (autonav) {
              mapref.current.animateToRegion({
                latitude: item.latitude,
                longitude: item.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              });
            }
          } else {
            item.selected = false;
          }
        } else {
          item.selected = false;
        }
        return item;
      });
      setlist(newList);
    }
        

    const addWaypoint = (coordinate) => {
      setWaypoints(currentWaypoints => [...currentWaypoints, coordinate]);
    };

    const removeLastWaypoint = () => {
      setWaypoints(currentWaypoints => [...currentWaypoints.slice(0, -1)]);
    }

    const calculateTotalDistance = () => {
      let totalDistance = 0;
      for (let i = 0; i < waypoints.length - 1; i++) {
        totalDistance += getDistance(
          { latitude: waypoints[i].latitude, longitude: waypoints[i].longitude },
          { latitude: waypoints[i + 1].latitude, longitude: waypoints[i + 1].longitude }
        );
      }
      return totalDistance;
    };

    const fetchWeatherData = async (latitude, longitude) => {
      const apiKey = '';
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      
      try {
        const response = await axios.get(url);
        const weatherData = response.data;
        setCurrentWeather(weatherData);
        console.log(weatherData);
      } catch (error) {
        console.log(error);
        setCurrentWeather(null);
      }
    };

    const handleLongPress = (event) => {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      addWaypoint({ latitude, longitude });

    };
    

   var buttonrow = <View style={styles.rowblock} >
              <View style={styles.buttonContainer}>
               <Button style={styles.item} title="+" onPress={() => plusButton()}  />
               <Button title="-" onPress={() => delButton()}/>
              <Button title="Load" onPress={() => loadButton()}/>
              <Button title="Save" onPress={() => saveButton()}/>
              <Button title="Auto" onPress={() => setnav(!autonav)}/>
              <Button title="Remove Waypoint" onPress={() => removeLastWaypoint()}/>
              </View>
              </View>

   var avirtlist =<VirtualizedList styles={styles.list}
        data={emptydata}
        initialNumToRender={4}
        renderItem={renderItem}
        keyExtractor={(item,index) => index}
        getItemCount={getItemCount}
        getItem={getItem}
      />

  const mapref = React.createRef();
  const SCREEN_WIDTH = useWindowDimensions().width;
  const SCREEN_HEIGHT = useWindowDimensions().height;
    var smaps = {width: SCREEN_WIDTH, height: SCREEN_HEIGHT/2}
  if (SCREEN_WIDTH > SCREEN_HEIGHT)
  {
    smaps = {width: SCREEN_WIDTH, height: SCREEN_HEIGHT}

  }
  // updated MapView to handle long presses and render markers
  var mymap = (
    <MapView
        mapType={mapType}
        ref={mapref}
        style={smaps}
        onLongPress={handleLongPress} 
    >
    {waypoints.map((waypoint, index) => (
      <Marker
        key={index}
        coordinate={waypoint}
        title={`Waypoint ${index + 1}`}
      />
    ))}
    {waypoints.length > 1 && (
      <Polyline
        coordinates={waypoints}
        strokeColor="#000"
        strokeWidth={6}
      />
    )}
  </MapView>
  );

  var mapTypeSelector = (
    <View style={styles.buttonContainer}>
      <Button title="Standard" onPress={() => setMapType('standard')} />
      <Button title="Satellite" onPress={() => setMapType('satellite')} />
      <Button title="Hybrid" onPress={() => setMapType('hybrid')} />
      <Button title="Terrain" onPress={() => setMapType('terrain')} />
    </View>
  );

  var alist=<View style={styles.container} >
        {currentWeather && (
      <Text>Current Temperature: {currentWeather.main.temp}°C</Text>
    )}
    {mymap}
    {mapTypeSelector}
    {buttonrow}
    {avirtlist} 

    <Text>Total Distance: {calculateTotalDistance()} meters</Text>

    <DialogInput isDialogVisible={ashowme} 
        title="Enter Address"
        message="Enter The Address To Add"
        submitInput={ (inputText) =>{setshowme(false); addLocation(inputText)}}
        closeDialog={() => {setshowme(false)}}
        >
    <Text>Something</Text>
    </DialogInput>
    </View>

  var ablist=<View style={styles.bcontainer} >
    <View >
    {buttonrow}
    {avirtlist}     
    <DialogInput isDialogVisible={ashowme} 
        title="Enter Address"
        message="Enter The Address To Add"
        submitInput={ (inputText) =>{setshowme(false); addLocation(inputText)}}
        closeDialog={() => {setshowme(false)}}
        >
    <Text>Something</Text>
    </DialogInput>
    </View >
    {mapTypeSelector}
    {mymap}
    </View>

  

  if (SCREEN_WIDTH > SCREEN_HEIGHT)
  {
    return ablist;
  }    
  return (alist)
  
 
}

export default MapList;
