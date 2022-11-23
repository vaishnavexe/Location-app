import React from "react";
import { StyleSheet, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

export default function App({route}:any) {

    const {location}= route.params
    const place = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      return (
        <View style={styles.container}>
          <MapView
            style={styles.map}
            initialRegion={place} 
          >
            <Marker coordinate={place} />
          </MapView>
        </View>
      );
    }


    //CSS
    const styles = StyleSheet.create({
      container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1, 
        justifyContent: "flex-end",
        alignItems: "center",
      },
      map: {
        ...StyleSheet.absoluteFillObject,
      },
    });