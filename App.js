import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, Button } from 'react-native';

import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from "react";
import axios from 'axios';
import env from './env';

export default function App() {
    const [markedDates, setMarkedDates] = useState([]);

    useEffect(() => {
        async function fetchMarkedDates() {
            try {
                let response = await axios.get(env.API_URL + '/marked-dates');
                setMarkedDates(response.data.markedDates.map(date => parseInt(date.timestamp)));
            } catch (e) {
                Alert.alert("Error", e.message);
            }
        }
        fetchMarkedDates();
    }, [])

    return (
        <View style={styles.container}>
            <Calendar
                markingType={'period'}
                maxDate={new Date().toISOString().slice(0, 10)}
                markedDates={(() => {
                    markedDatesResult = {}
                    // define util functions
                    const toYYYYMMDD = timestamp => new Date(timestamp).toISOString().slice(0, 10)
                    const getDistanceDays = (xTimeStamp, yTimeStamp) => Math.abs((xTimeStamp - yTimeStamp) / (1000 * 3600 * 24));

                    let baseAttributes = {
                        color: 'darkblue',
                        textColor: '#eee',
                    }
                    let sortedMarkedDates = markedDates.sort((a, b) => a - b);
                    for (let i = 0; i < sortedMarkedDates.length; i++) {
                        let attribute = {
                            ...baseAttributes,
                            startingDay: i == 0 || getDistanceDays(sortedMarkedDates[i], sortedMarkedDates[i - 1]) > 1,
                            endingDay: i === sortedMarkedDates.length - 1 || getDistanceDays(sortedMarkedDates[i], sortedMarkedDates[i + 1]) > 1,
                        }
                        markedDatesResult[toYYYYMMDD(sortedMarkedDates[i])] = attribute;
                    }
                    return markedDatesResult;
                })()}
                onDayPress={day => {
                    Alert.alert(
                        'Do you want to mark the selected',
                        `${new Date(day.timestamp).toDateString()} will be marked!`,
                        [
                            {
                                text: 'Canncel', onPress: () => console.log('Canncel')
                            },
                            {
                                text: 'Unmark', onPress: async () => {
                                    try {
                                        let newMarkedDates = new Set(markedDates);
                                        if (!markedDates.find(timestamp => day.timestamp === timestamp)) {
                                            Alert.alert('Notification', "This date is not already marked");
                                            return;
                                        }
                                        await axios.delete(env.API_URL + "/marked-dates", {
                                            data: { timestamp: day.timestamp }
                                        });
                                        newMarkedDates.delete(day.timestamp);
                                        setMarkedDates([...newMarkedDates]);
                                    } catch (err) {
                                        Alert.alert("Error", err.message);
                                    }
                                }
                            },
                            {
                                text: 'Mark', onPress: async () => {
                                    try {
                                        setMarkedDates([...new Set([...markedDates, day.timestamp])]);
                                        if (markedDates.find(timestamp => day.timestamp === timestamp)) {
                                            Alert.alert('Notification', "This date is already marked");
                                            return;
                                        }
                                        await axios.post(env.API_URL + "/marked-dates", {
                                            timestamp: day.timestamp,
                                            cost: 35000,
                                        });
                                        console.log("create done");
                                    } catch (err) {
                                        Alert.alert(err.message);
                                    }
                                }
                            },
                        ],
                        { cancelable: true },
                    );
                }}
            />
            <Text style={styles.biggerText}>
                {Number(markedDates.length * 35000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND
            </Text>
            <Button
                title='Clear All'
                color="darkblue"
                onPress={async () => {
                    setMarkedDates([]);
                    for (let timestamp of markedDates) {
                        await axios.delete(env.API_URL + "/marked-dates", {
                            data: { timestamp }
                        });
                    }
                }}
            />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    biggerText: {
        fontWeight: 'bold',
        fontSize: 30
    }
});
