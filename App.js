import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, Modal, Pressable } from 'react-native';

import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { useState } from "react";


export default function App() {
    const [modalVisible, setModalVisible] = useState(false);
    const [markedDates, setMarkedDates] = useState([]);
    const [currentChoose, setCurrentChoose] = useState(0);

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{new Date(currentChoose).toDateString()}</Text>

                        <View style={styles.buttonContainer}>
                            <Pressable
                                style={[styles.button, styles.buttonMark]}
                                onPress={() => {
                                    setMarkedDates([...new Set([...markedDates, currentChoose])]);
                                    setModalVisible(!modalVisible)
                                }}
                            >
                                <Text style={styles.textStyle}>Marked</Text>
                            </Pressable>

                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text style={styles.textStyle}>Close</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal >

            <Calendar
                markedDates={(() => {
                    let markedDatesResult = {};
                    for (let timestamp of markedDates) {
                        markedDatesResult[new Date(timestamp).toISOString().slice(0, 10)] = { selected: true, selectedColor: 'blue' };
                    }
                    return markedDatesResult;
                })()}
                onDayPress={day => {
                    setModalVisible(true);
                    setCurrentChoose(day.timestamp);
                }}
            />
            <StatusBar style="auto" />
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // pop-up style
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonMark: {
        backgroundColor: "#2196F3",
    },
    buttonClose: {
        backgroundColor: "#333",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
});
