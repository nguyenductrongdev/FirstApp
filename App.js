import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, Button } from 'react-native';

import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { useState } from "react";
import moment from 'moment';


export default function App() {
    const [markedDates, setMarkedDates] = useState([]);

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
                                text: 'Unmark', onPress: () => {
                                    let newMarkedDates = new Set(markedDates);
                                    newMarkedDates.delete(day.timestamp);
                                    setMarkedDates([...newMarkedDates]);
                                }
                            },
                            {
                                text: 'Canncel', onPress: () => console.log('Canncel')
                            },
                            {
                                text: 'Mark', onPress: () => setMarkedDates([...new Set([...markedDates, day.timestamp])])
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
                onPress={() => setMarkedDates([])}
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
