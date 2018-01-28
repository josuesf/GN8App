import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    StatusBar,
    PermissionsAndroid,
    Platform,
    ActivityIndicator,
    Image,
} from 'react-native';

import MapView from 'react-native-maps';
import IconFondation from 'react-native-vector-icons/Foundation'
import flagPinkImg from '../assets/img/logo.png';
import Toolbar from '../components/toolbar'
const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.03900;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class Index extends React.Component {
    static navigationOptions = {
        title: 'Home',
        headerTintColor: 'purple',
        header: null,
        tabBarLabel: Platform.OS == 'android' ? ({ tintColor, focused }) => (
            <Text style={{ fontSize: 10, color: focused ? tintColor : '#95a5a6' }}>
                HOME
            </Text>
        ) : "HOME",
        tabBarIcon: ({ tintColor, focused }) => (
            <IconFondation
                name={focused ? 'home' : 'home'}
                size={30}
                color={focused ? tintColor : '#95a5a6'}
            />
        ),
    };
    constructor(props) {
        super(props);

        this.state = {
            region: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            markers: [],
            buscandoPosicion:true,
        };
    }
    componentWillMount() {
        //requestLocationPermission()
        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                this.setState({
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    },
                    error: null,
                    buscandoPosicion:false
                },()=> navigator.geolocation.clearWatch(this.watchId))
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
        );


    }
    BuscarActividad=()=>{
        this.setState({buscandoPosicion:true})
    }

    render() {
        const { markers } = this.state
        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor="white"
                    barStyle="dark-content"
                />
                <Toolbar banner={"GN8"} />
                {this.state.buscandoPosicion ? <Image source={require('../assets/img/loadingmapa.gif')}
                 style={{ marginVertical: 10, height: 50, width: 50, alignSelf: 'center' }} />:
                <View style={{
                    //flex: 1,
                    height: height - 120,
                    //...StyleSheet.absoluteFillObject,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                }}>
                    <MapView
                        provider={this.props.provider}
                        style={styles.map}
                        region={this.state.region}
                        onPress={markers.length == 0 ? this.onMapPress : null}
                        showsUserLocation={true}
                    >
                        {this.state.markers.map(marker => (
                            <MapView.Marker
                                //pinColor={"blue"}
                                //image={flagPinkImg}
                                key={marker.key}
                                coordinate={marker.coordinate}
                            >
                                <IconFondation name="marker" size={50} color="#9b59b6" />
                            </MapView.Marker>
                        ))}
                    </MapView>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={this.BuscarActividad}
                            style={[styles.bubble, { flexDirection: 'row', alignItems: 'center', marginVertical: 20 }]}
                        >
                            <Image source={require('../assets/img/loadingmapa.gif')}
                 style={{ height: 25, width: 25, }} />
                            <Text style={{ marginHorizontal: 10, fontWeight: 'bold' }}>Buscar Actividad</Text>
                        </TouchableOpacity>

                    </View>
                </View>}

            </View>
        );
    }
}

Index.propTypes = {
    provider: MapView.ProviderPropType,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //...StyleSheet.absoluteFillObject,
        //justifyContent: 'flex-end',
        //alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    bubble: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    latlng: {
        width: 200,
        alignItems: 'stretch',
    },
    button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
});

module.exports = Index;