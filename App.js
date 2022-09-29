import {StatusBar} from 'expo-status-bar';
import {Pressable, StyleSheet, Text, TextInput, View, FlatList, Alert} from 'react-native';
import {useEffect, useState} from "react";
import {initializeApp} from 'firebase/app';
import {getDatabase, push, ref, onValue, remove} from 'firebase/database';

export default function App() {
    const [item, setItem] = useState("");
    const [amount, setAmount] = useState("");
    const [list, setList] = useState([]);
    const [references, setReferences] = useState([]);

    const firebaseConfig = {
        apiKey: "AIzaSyATK-w6Z5aL-kEoxoQKHe1-bihLXumhyXA",
        authDomain: "assignment12-4c248.firebaseapp.com",
        databaseURL: "https://assignment12-4c248-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "assignment12-4c248",
        storageBucket: "assignment12-4c248.appspot.com",
        messagingSenderId: "762422074222",
        appId: "1:762422074222:web:badc678ee85c2005477f7f"
    };
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);

    const addItem = () => {
        push(
            ref(database, 'items/'),
            {'name': item, 'amount': amount})
            .then(() => {
                console.log('item added');
                setAmount('');
                setItem('');
            })
            .then(updateList);
    }

    const deleteItem = (index) => {
        let reference = ref(database, 'items/'+references.splice(index)[0]);
        remove(
            reference
        ).then(() => {
            console.log('item removed');
            updateList();
        })
    }

    const updateList = () => {
        const itemsRef = ref(database, 'items/');
        onValue(itemsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setList(Object.values(data));
                setReferences(Object.keys(data));
            }else{
                setList([]);
            }
        });
        console.log('List updated');
    }

    useEffect(updateList, []);


    return (
        <View style={styles.container}>
            <TextInput
                keyboardType="default"
                style={styles.textInput}
                onChangeText={item => setItem(item)} value={item}
                placeholder='Item'
                textAlign='center'
            />
            <TextInput
                keyboardType="default"
                style={styles.textInput}
                onChangeText={amount => setAmount(amount)} value={amount}
                placeholder='Amount'
                textAlign='center'
            />
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Pressable
                    style={styles.button}
                    onPress={addItem}>
                    <Text style={styles.text}>Add</Text>
                </Pressable>
            </View>
            <Text style={styles.listTitle}>Shopping List</Text>
            <View style={styles.list}>
                <FlatList
                    data={list}
                    renderItem={
                        ({item, index}) =>
                            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                <Text style={styles.result}>{item.name} {item.amount}</Text>
                                <Pressable onPress={() => deleteItem(index)}>
                                    <Text style={{fontSize: 16, color: 'blue', padding: 5}}>Bought</Text>
                                </Pressable>
                            </View>
                    }
                />
            </View>
            <StatusBar style="auto"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 44,
        paddingBottom: 11,
    },
    textInput: {
        borderColor: "#000",
        height: 44,
        marginTop: 11,
        marginBottom: 5,
        width: 200,
        borderWidth: 1
    },
    result: {
        padding: 5,
        fontSize: 16
    },
    button: {
        paddingVertical: 11,
        paddingHorizontal: 11,
        marginTop: 11,
        backgroundColor: 'lightblue',
        marginHorizontal: 11
    },
    list: {
        borderColor: "black",
        borderWidth: 0.5,
        borderStyle: 'dotted',
        width: '90%',
        flex: 15,
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    listTitle: {
        fontSize: 25,
        backgroundColor: "lightblue",
        width: '90%',
        textAlign: 'center'
    }
});