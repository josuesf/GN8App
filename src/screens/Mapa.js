import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    StatusBar,
    PermissionsAndroid,
    Platform
} from 'react-native';

import MapView from 'react-native-maps';
import IconFondation from 'react-native-vector-icons/Foundation'
import flagPinkImg from '../assets/img/logo.png';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.00922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class Mapa extends React.Component {
    static navigationOptions = {
        header: null,
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
        };
    }
    componentWillMount() {
        const { params } = this.props.navigation.state
        this.setState({
            region: {
                latitude: parseFloat(params.latitude),
                longitude: parseFloat(params.longitude),
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            markers: [{
                key: '1',
                coordinate: {
                    latitude: parseFloat(params.latitude),
                    longitude: parseFloat(params.longitude),
                }
            }],
        })
    }

    render() {
        const { markers } = this.state
        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor="white"
                    barStyle="dark-content"
                />
                <View style={[styles.toolbar]} >
                    <TouchableOpacity onPress={() => goBack()} style={{ flex: 1 }}>
                        <IconFondation name="x" size={30} color="#95a5a6"
                            style={{ marginHorizontal: 20, marginVertical: 10 }} />
                    </TouchableOpacity>
                </View>
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
                        onPress={() => this.props.navigation.goBack()}
                        style={[styles.bubble, { flexDirection: 'row', alignItems: 'center', marginVertical: 20 }]}
                    >
                        <IconFondation name="x" size={30} />
                        <Text style={{ marginHorizontal: 10, fontWeight: 'bold' }}>CERRAR</Text>
                    </TouchableOpacity>

                </View>
            </View>
        );
    }
}

Mapa.propTypes = {
    provider: MapView.ProviderPropType,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
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

module.exports = Mapa;