import { useState, useEffect } from 'react';
import Axios from "axios";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
    const [data, setData] = useState([]);
    const [newDescription, setNewDescription] = useState('');
    const [newValue, setNewValue] = useState('');
    const [editItemId, setEditItemId] = useState(null);
    const [editedDescription, setEditedDescription] = useState('');
    const [editedValue, setEditedValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [serverData, setServerData] = useState([]);

    useEffect(() => {
        // Devolve os dados
        async function loadSavedData() {
            try {
                const savedData = await AsyncStorage.getItem('data');
                if (savedData !== null) {
                    setData(JSON.parse(savedData));
                }
            } catch (error) {
                console.log(error);
            }
        }
        loadSavedData();
    }, []);

    // READ Local
    useEffect(() => {
        // Salva os dados
        async function saveData() {
            try {
                await AsyncStorage.setItem('data', JSON.stringify(data));
            } catch (error) {
                console.log(error);
            }
        }
        saveData();
    }, [data]);

    // CREATE
    const handleAddItem = () => {
        // Adiciona um item
        setIsLoading(true);
        setData(prevState => [
            ...prevState,
            { items: newDescription, amount: Number(newValue) },
        ]);
        setNewDescription('');
        setNewValue('');

        Axios.post("http://192.168.1.64:3001/expense", { amount: newValue, expense: newDescription }).then(() => {
            setIsLoading(false);
        })
    };

    // READ
    useEffect(() => {
        // Busca os dados do servidor
        Axios.get("http://192.168.1.64:3001/expense")
        .then(response => {
            setData(response.data);
        })
        .catch(error => {
            console.log(error);
        });
    }, [data]);

    // UPDATE
    const handleEditItem = (id, newDescription, newValue) => {
        // Atualiza o estado dos itens
        setIsLoading(true);
        setData(prevState => {
            return prevState.map(item => {
                if (item.id === id) {
                    return { ...item, description: newDescription, value: newValue };
                }
                return item;
            });
        });
        setEditItemId(null);

        Axios.put(`http://192.168.1.64:3001/expense/${id}`,).then(() => {
            setIsLoading(false);
        }).catch(err => {
            console.log(err);
        });
    };
    // DELETE
    const handleDeleteItem = id => {
        // Deleta o item
        setIsLoading(true);
        setData(prevState => prevState.filter(item => item.id !== id));
        Axios.delete(`http://192.168.1.64:3001/expense/${id}`,).then(() => {
            setIsLoading(false);
        }).catch(err => {
            console.log(err);
        });
    };


    function formatCurrency(value) {
        // Deixa os números na moeda local
        return new Intl.NumberFormat(
            'pt-br',
            { style: 'currency', currency: 'BRL' }
        ).format(value);
    }

    const renderItem = ({ item }) => {
        const { id, items, amount } = item;
        return (
            <View style={styles.itemContainer}>

                {editItemId === id ? (

                    <View style={styles.itemEdit}>
                        <TextInput
                            style={styles.itemEditInput}
                            value={editedDescription}
                            onChangeText={setEditedDescription}
                        />
                        <TextInput
                            style={styles.itemEditInput}
                            value={editedValue}
                            keyboardType="numeric"
                            onChangeText={setEditedValue}
                        />
                        <TouchableOpacity
                            style={styles.itemEditButton}
                            onPress={() => handleEditItem(id, editedDescription, Number(editedValue))}
                        >
                            <Text style={styles.itemEditButtonText}>Salvar</Text>
                        </TouchableOpacity>
                    </View>

                ) : (

                    <View style={styles.itemData}>
                        <Text style={styles.itemDescription}>{items}</Text>
                        <Text style={styles.itemValue}>{formatCurrency(amount)}</Text>
                    </View>
                )}
                <View style={styles.itemActions}>
                    <TouchableOpacity style={styles.itemButton} onPress={() => handleDeleteItem(id)}>
                        <Text style={styles.itemButtonText}>Excluir</Text>
                    </TouchableOpacity>
                    {editItemId === id ? null : (
                        <TouchableOpacity
                            style={styles.itemButton}
                            onPress={() => {
                                setEditItemId(id);
                                setEditedDescription(items);
                                setEditedValue(amount.toString());
                            }}
                        >
                            <Text style={styles.itemButtonText}>Editar</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    return (
        <LinearGradient
            colors={['purple', 'lightgray']}
            start={{ x: 0.6, y: 0.3 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}>
            <Animatable.Image
                source={require('../../../assets/poupapp.png')}
                style={styles.logo}
                resizeMode='contain'
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Descrição"
                    value={newDescription}
                    onChangeText={setNewDescription}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Valor"
                    keyboardType="numeric"
                    value={newValue}
                    onChangeText={setNewValue}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
                    <Text>Adicionar</Text>
                </TouchableOpacity>
            </View>
            {isLoading ? (
                <Text>
                    Loading
                </Text>
            ) :
                <FlatList
                    data={data}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    style={styles.list}
                />
            }

        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    pri: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 30,
        paddingHorizontal: 20,

    },
    logo: {
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'center',
        bottom: 10
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 20,

    },
    input: {
        flex: 1,
        height: 50,
        marginRight: 10,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        fontSize: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        height: 50,
        backgroundColor: '#d6a724',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    list: {
        flex: 1,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    itemData: {
        flex: 1,
    },
    itemDescription: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    itemValue: {
        fontSize: 14,
        color: '#777',
    },
    itemActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemButton: {
        backgroundColor: '#f44336',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginLeft: 10,
    },
    itemButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    itemEdit: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemEditInput: {
        flex: 1,
        height: 40,
        marginRight: 10,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        fontSize: 14,
    },
    itemEditButton: {
        backgroundColor: '#8BC34A',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    itemEditButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

