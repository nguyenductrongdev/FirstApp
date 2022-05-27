import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, Button } from 'react-native';

import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { useState } from "react";


export default function App() {
    const [markedDates, setMarkedDates] = useState([]);

    return (
        <View style={styles.container}>
            <Calendar
                maxDate={new Date().toISOString().slice(0, 10)}
                markedDates={(() => {
                    let markedDatesResult = {};
                    for (let timestamp of markedDates) {
                        markedDatesResult[new Date(timestamp).toISOString().slice(0, 10)] = { selected: true, selectedColor: 'blue' };
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
                color="#841584"
                onPress={() => setMarkedDates([])}
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
    biggerText: {
        fontWeight: 'bold',
        fontSize: 30
    }
});
