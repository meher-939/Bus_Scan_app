import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons'; // For camera icon
import { useNavigation } from '@react-navigation/native';
import { getStuDetails } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useBusData } from '../context/BusContext';

const QRCodeScanner = ({ route }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
    const [scanning, setScanning] = useState(true)
    const cameraRef = useRef(null);
    const { busNumber } = route.params;
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false)
    const { username } = useAuth()
    const { setUpdateData } = useBusData()

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleClose = () => {
        navigation.goBack()
    };

    const handleFlashToggle = () => {
        setFlashMode(
            flashMode === Camera.Constants.FlashMode.off
                ? Camera.Constants.FlashMode.torch
                : Camera.Constants.FlashMode.off
        );
    };
    if (hasPermission === null) {
        return <View />;
    }

    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    const handleBarCode = async ({ data }) => {
        if (scanning && !loading) {
            setScanning(false)
            setLoading(true)
            const result = await getStuDetails(data, busNumber, setLoading, username)
            if (result == 404) {
                setLoading(false)
                return Alert.alert('Invalid', 'Student Not Found', [{ text: 'OK', onPress: () => setScanning(true) }])
            }
            if (result == 403) {
                setLoading(false)
                return Alert.alert('Invalid', 'Fraud Already Scanned', [{ text: 'OK', onPress: () => setScanning(true) }])
            }
            if (result == 400) {
                setLoading(false)
                return Alert.alert('Invalid', 'Already Scanned', [{ text: 'OK', onPress: () => setScanning(true) }])
            }
            return Alert.alert('Scanned Details', `Name: ${result.firstname} ${result.lastname}\nRollNo:${result.rollno}\nFeePaid:${result.feePaid}\nBusCanceled:${result.isBusCanceled}`,

                [{ text: 'OK', onPress: () => { setScanning(true); setUpdateData(true); } }])

        }

    }
    return (
        <View style={styles.container}>
            {
                <Camera
                    style={styles.camera}
                    type={CameraType.back}
                    ref={cameraRef}
                    ratio='16:9'
                    flashMode={flashMode}
                    onBarCodeScanned={scanning ? handleBarCode : undefined}
                >
                    <View style={styles.maskContainer}>
                        <View style={styles.maskInner} />
                    </View>
                    {
                        loading && <View style={{ width: '100%', height: '100%', alignItems: 'center', 'justifyContent': 'center', backgroundColor: 'rgba(0,0,0,0.34)', position: 'absolute', }}>
                            <ActivityIndicator color={"white"} size={50} />
                        </View>
                    }
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.flipButton}
                            onPress={handleClose}
                        >
                            <FontAwesome name="close" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.flashButton}
                            onPress={handleFlashToggle}
                        >
                            <FontAwesome
                                name={flashMode === Camera.Constants.FlashMode.off ? 'flash' : 'flash'}
                                size={24}
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>
                </Camera>
            }

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 20,
    },
    flipButton: {
        alignSelf: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'transparent',
        padding: 10
    },
    flashButton: {
        alignSelf: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'transparent',
        padding: 10
    },
    captureButton: {
        alignSelf: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'transparent',
        padding: 10
    },
    maskContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    maskInner: {
        backgroundColor: 'transparent',
        width: Dimensions.get('window').width * 0.6,
        height: Dimensions.get('window').width * 0.6,
        borderWidth: 2,
        borderColor: 'red'
    }
});

export default QRCodeScanner;
