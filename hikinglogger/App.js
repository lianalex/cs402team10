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
    alignItems: 'center'
  },
  buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 5,
      padding: 0,
      paddingTop: 0
  },
   
  map:  {width: Dimensions.get('window').width, height: Dimensions.get('window').height/2},
  label:{ flex: 0.2, fontSize: 22, padding: 5}
});


var emptydata = [];
Geocoder.init("AIzaSyDqW8jK0xxnIRKTKXACxIK-q3UerQTiCsA");

const MapList = () => {

    const [list, setlist] = useState([]);
    const [autonav,setnav] = useState(true);
    const [ashowme,setshowme] = useState(false);

    var mlist=[];
    const [markers,setMarks] = useState(mlist);

    const getItemCount = (data) => list.length;
    const getItem = (data, index) => (list[index]);

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
            var newList = [{key: alocation, selected: false, longitude: location.lng, latitude: location.lat }]
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

    function explodeButton() {
      const newList = [];
      list.forEach((item) =>
      {
           newList.push(item);
      })

      for (var i =0; i < 10000; i++) {
        var anum = Math.random().toString(10).substring(0);
       var newitem = {key: 'obo '+anum, selected: false};
       newList.push(newitem);
     }
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

    function toggleList(aindex){
   
      const newList = list.map((item,index) => {    

        if (aindex == index)
        {
          if (item.selected)
          {
            item.selected = false;
          }
          else
          {
            if (autonav)
            {
            console.log(item.latitude);
            console.log(item.key);
            mapref.current.animateToRegion({latitude: item.latitude, longitude: item.longitude, latitudeDelta: 0.1, longitudeDelta: 0.1});
            }
            item.selected = true;
          }
        }
        else{
          item.selected = false;
        }
        return item;
      })
      setlist(newList);

    }

   var buttonrow = <View style={styles.rowblock} >
              <View style={styles.buttonContainer}>
               <Button style={styles.item} title="+" onPress={() => plusButton()}  />
               <Button title="-" onPress={() => delButton()}/>
              <Button title="Load" onPress={() => loadButton()}/>
              <Button title="Save" onPress={() => saveButton()}/>
              <Button title="Auto" onPress={() => setnav(!autonav)}/>
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
  var mymap=<MapView ref={mapref} style={smaps} >
             {markers} 
            </MapView >

   var alist=<View style={styles.container} >
      {mymap}
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
      {mymap}
      </View>

  if (SCREEN_WIDTH > SCREEN_HEIGHT)
  {
    return ablist;
  }    
  return (alist)
 
}

export default MapList;