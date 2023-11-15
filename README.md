Alex Liang
CS 402: Mobile App Development
Assignment 3 - Working With Maps - (100 points)
October 16, 2023

Objectives:
- Create a Simple Map app.
- Have an Addable List of Locations.
- Load and save Locations from a remote URL.

This assignment focuses on creating a map application using React Native. The app allows the user to add and remove location markers based on typed addresses or the current GPS location. The app also supports device rotation and allows users to load and save location data from a remote URL.

Features:
- Basic Map Application
  - The app uses a simple MapView and is designed to rearrange its layout to fit different orientations of the device.
  - React's useState and useEffect are used for state management. The 'useState' is used for tracking the list of locations, markers, and other state elements.
  - The 'useWindowDimensions' is used to get the screen width and height, which are then used to adjust the size of the MapView component when the device orientation changes.

- Location List
  - The app shows a scrollable list of locations beneath the MapView. Clicking on a location will zoom in on it on the map. Each entry on the list corresponds to a marker on the map.
  - The VirtualizedList component is used for loading of the location list items.
  - The location markers are generated based on the location list. These markers are rendered inside the MapView component.

- Add and Delete
  - Users can add a location by clicking the 'Add Location' button and entering the location desired and can remove selected locations by clicking on a location in the VirtualizedList and then clicking the 'Delete' button. The application also supports geo-coding.
  - The app uses the Geocoder library to translate location names into latitude and longitude coordinates.

- Current GPS Location
  - On application startup, users can select an option for allowing the application to use their location data to mark their current GPS location.
  - Permissions: The app first requests location permissions from the user using Location.requestForegroundPermissionsAsync(). Once permission is granted, the Location.getCurrentPositionAsync({}) function is used to obtain the device’s current location, which is then displayed as a special marker on the map.

- Load and Save List Data from a Remote URL
  - Users can save their list to and load it from a remote database.
  - The app uses the fetch API to read and write data to a specific URL.
  - The URL includes a username parameter, allowing the user to have their own list.

Implementation
  - I started working on the assignment by using the code from my HW2, which already had button functionality working, fetching remote data from a URL, and utilizing a virtualized list. I then grabbed the necessary consts, vars, and components from 'SCMapView' helper code first and then moved onto grabbing the necessary code from GPSSimpleSnack code.
  - I quite enjoyed working on the project since it gave me a better understanding of how an application like Google Maps or Apple maps works under the hood.
  - On IOS some parts of the virtualized list section is cut off at the bottom in landscape mode.
