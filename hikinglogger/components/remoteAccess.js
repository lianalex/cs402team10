import * as React from 'react';
import { VirtualizedList, TouchableOpacity, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';

async function loadList(aurl,alist,asetlist,asetm) {
  const response = await fetch(aurl);  
  const names = await response.json(); 
  
  console.log("loadlist");
  names.forEach((item ) => {
     alist.push(item)
     console.log(item);
  })
 
   const newList = alist.map((item) => {return item})

   const mList = alist.map((item) => {
      var newm = <Marker
        coordinate={{latitude: item.latitude, longitude: item.longitude}}
        title={item.key}
        description={""}
                  />
      return newm})
   asetlist(newList);
   asetm(mList)
}

async function saveList(aurl, list) {
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