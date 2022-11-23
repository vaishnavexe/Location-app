import axios from 'axios';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import React, { useState} from 'react';
import * as Location from 'expo-location';
const MAX_STACK: number = 30;

const App = ({ navigation }: any) => {
  const [CDate, setCDate] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [stackMsg, setStackMsg] = useState(false)
  const [previousStack, setPreviousStack] = useState<any>([]);
  interface LocationInterface { latitude: number, longitude: number };
  const [location, setLocation] = useState<LocationInterface>({ latitude:0, longitude: 0 });
  const [Detail, setDetail] = useState({
    "display_name":""
  })
  
  const handleButton = () => {
    navigation.navigate('Map', {location})
}

  
  const Item = ({ id,  locationName }:any) => (
    <View style={styles.flexColumn}>
      <View style={styles.ItemContent} >
        <Text>{locationName}</Text>
        <Text>{CDate}</Text>
      </View>
      <TouchableOpacity activeOpacity={0.7} style={styles.removeButton} onPress={() => { setPreviousStack((prevState:any) => prevState.filter((_item:any, _Index:any) => _Index));}}>
        <Text>REMOVE</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }:any) => (
    <Item id={item.id} locationName={item.display_name} />
  );
  
  React.useEffect(() => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var hours = new Date().getHours();
    var min = new Date().getMinutes();
    var sec = new Date().getSeconds();
    setCDate( date + '/' + month + '/' + year + ' ' + hours + ':' + min + ':' + sec);
   

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('error');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords["latitude"],
        longitude: location.coords["longitude"]
      });
    })();
    if (previousStack.length === MAX_STACK) {
      setStackMsg(true);
    } else {
      setStackMsg(false);
    }
    if (location.latitude !== 0) {
      const setlocationdata = async () => {

      //await axios.get(`http://api.positionstack.com/v1/reverse?access_key=a265f1950e89f9dcf28bc785aea7ae1e&query=${location.latitude},${location.longitude}&limit=1`)
      //await axios.get(https://api.opencagedata.com/geocode/v1/json?=a5d0ef1e87754e17bc2e1591bc8b9ffb
       await axios.get(`https://us1.locationiq.com/v1/reverse?key=pk.b9763af812b1493b10d6f2df33496595&lat=${location.latitude}&lon=${location.longitude}&format=json`)
         
       .then((response) => {
        //console.log('xyz',response.data)
            setDetail(response.data)
  
            setPreviousStack((prev:any) => [...prev, response.data])
          }).catch(error => console.log(error));
        }
        setlocationdata();

        const interval = setInterval(() => {
          if (previousStack.length < MAX_STACK) {
            setlocationdata();
          }
        }, 30000);
        return () => clearInterval(interval);
      }      
      
    }, [location.latitude, location.longitude]);
return (

  <View style={styles.container}>
      <View style={styles.currentLocationContainer}>
        <View>
        <Text style={styles.currentLocationText}>CURRENT LOCATION</Text>
        <Text></Text>
        <Text>{Detail?.display_name}</Text>
      </View>
     
      <View>
        <Text style={styles.currentLocationDate}>{CDate},</Text>
      </View>
    </View>

      <Text style={styles.previousLocationText}>PREVIOUS LOCATION</Text>
      <View style={{flex: 1,width:"100%"}}>
      <FlatList
        data={previousStack.slice(0,5)}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.touchOpacityStyle} 
        onPress={() => { setPreviousStack((prevState:any) => prevState.filter((_item:any, _Index:any) => _Index !== _Index));}}
      >
        <Text>CLEAR ALL</Text>
      </TouchableOpacity> 
      <TouchableOpacity
        style={styles.maps} 
        onPress={() => {
          navigation.navigate('Maps', {
           location
          });
        }}
      >
        <Text>MAP</Text>
      </TouchableOpacity> 
    </View>
);

}



//CSS

const styles = StyleSheet.create({
  flexColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginVertical: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    shadowColor: '#3385ff',
    elevation: 5
  },
  currentLocationContainer: {
    backgroundColor: '#c2c2a3',
    paddingVertical: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    flexWrap: 'wrap',
    shadowColor: '#3385ff',
    elevation: 3 
  },
  currentLocationText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  ItemContent: {
    flex: 1
  },
  container: {
    flex: 1,
  },
  
  previousLocationText:{
    paddingVertical: 20,
    marginHorizontal: 15,
    fontSize: 15,
    fontWeight: 'bold'

  },
  
  recentloctaionMessage: {
    backgroundColor: '#add8e6',
    alignItems: 'center',
  },
  currentLocationDate: {
    fontSize: 15,
    paddingRight: 5,
    fontWeight: 'bold',
    color: '#000000'
  },
  flatList: {
    flex: 3,
    width: '50%',
  },

  touchOpacityStyle: {
    backgroundColor: '#3366ff',
    borderWidth: 2,
    position: 'absolute',
    bottom: 30,
    paddingHorizontal: 40,
    paddingVertical: 10,
    marginRight: 20,
    left: '5%',
   
  },
  maps: {
    backgroundColor: '#3366ff',
    borderWidth: 2,
    position: 'absolute',
    bottom: 30,
    
    paddingHorizontal: 50,
    paddingVertical: 10,
    marginRight: 20,
    left: '55%',
    
  },
  removeButton: {
    backgroundColor: '#c0c0c0',
    paddingHorizontal: 10,
    paddingVertical: 5,
  }
  
})

export default App;