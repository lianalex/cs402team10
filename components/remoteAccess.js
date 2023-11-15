import * as React from 'react';
import { VirtualizedList, TouchableOpacity, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';

async function loadList(aurl,alist,asetlist,asetm) {
  const response = await fetch(aurl);  // read the remote data file via fetch 'await' blocks
  const names = await response.json(); // parse the returned json object
  
  console.log("loadlist");
  // add the returned list to the existing list
  names.forEach((item ) => {
     alist.push(item)
     console.log(item);
  })

 var blist = <Marker
            coordinate={{latitude: 44.78825,
            longitude: -122.4324}}
            title={"title"}
            description={"description"}
         />
  
  
   const newList = alist.map((item) => {return item})

   const mList = alist.map((item) => {
                      var newm = <Marker
                                  coordinate={{latitude: item.latitude, longitude: item.longitude}}
                                  title={item.key}
                                  description={"Airport"}
                                  />
                      return newm})
   asetlist(newList);
   asetm(mList)
}


async function saveList(aurl, list) {
    // POST request using fetch with async/await
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(list)
    };
    const response = await fetch(aurl, requestOptions);
    console.log(response);
}

export {loadList}
export {saveList}