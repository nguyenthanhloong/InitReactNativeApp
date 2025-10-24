import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import {
    FlatList,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import Toast from 'react-native-toast-message';

const fruitData = [
    { id: '1', name: 'Chuối', price: 15000, image: require('../../assets/images/chuoi.jpeg'), imageName: 'chuoi.jpeg' },
    { id: '2', name: 'Xoài', price: 20000, image: require('../../assets/images/soai.jpeg'), imageName: 'soai.jpeg' },
    { id: '3', name: 'Cam', price: 18000, image: require('../../assets/images/cam.jpeg'), imageName: 'cam.jpeg' },
    { id: '4', name: 'Kiwi', price: 15000, image: require('../../assets/images/kiwi.jpeg'), imageName: 'kiwi.jpeg' },
    { id: '5', name: 'Nho', price: 20000, image: require('../../assets/images/nho.jpeg'), imageName: 'nho.jpeg' },
    { id: '6', name: 'Táo', price: 18000, image: require('../../assets/images/tao.jpeg'), imageName: 'tao.jpeg' },
];

export default function FruitScreen() {
    const [search, setSearch] = useState('');

    const [isAdding, setIsAdding] = useState(false);


    const addToCart = async (item) => {
        if (isAdding) return; // tránh người dùng bấm liên tục
        setIsAdding(true);

        try {
            const cartJson = await AsyncStorage.getItem('cart');
            let cart = cartJson ? JSON.parse(cartJson) : [];

            // Đảm bảo id là string để so sánh nhất quán
            const index = cart.findIndex(cartItem => String(cartItem.id) === String(item.id));

            if (index >= 0) {
                cart[index].quantity += 1;
            } else {
                cart.push({
                    id: String(item.id),
                    name: item.name,
                    price: item.price,
                    quantity: 1,
                    imageName: item.imageName,
                });
            }

            await AsyncStorage.setItem('cart', JSON.stringify(cart));

            Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: 'Đã thêm sản phẩm vào giỏ hàng!',
                position: 'top',
                topOffset: 50,
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Không thể thêm sản phẩm vào giỏ hàng.',
                position: 'top',
                topOffset: 50,
            });
            console.error(error);
        } finally {
            setIsAdding(false);
        }
    };


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Text style={styles.title}>Trái Cây</Text>

                    <View style={styles.searchContainer}>
                        <Ionicons name="search-outline" size={22} color="#999" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            value={search}
                            onChangeText={setSearch}
                            placeholder="Tìm kiếm..."
                            placeholderTextColor="#aaa"
                            returnKeyType="search"
                        />
                    </View>

                    <FlatList
                        data={fruitData.filter(item =>
                            item.name.toLowerCase().includes(search.toLowerCase())
                        )}
                        renderItem={({ item }) => (
                            <View style={styles.listItem}>
                                <Image source={item.image} style={styles.itemImage} />
                                <View style={styles.itemTextContainer}>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    <Text style={styles.itemPrice}>
                                        {item.price.toLocaleString('vi-VN')} đ
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.addButton}
                                    onPress={() => addToCart(item)}
                                >
                                    <Text style={styles.addButtonText}>Thêm vào giỏ</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    />
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
        backgroundColor: '#e8f0fe',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1a1a1a',
        textAlign: 'center',
        marginBottom: 25,
        letterSpacing: 1.2,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 18,
        color: '#333',
    },
    listContainer: {
        paddingBottom: 30,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 18,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 6,
    },
    itemImage: {
        width: 75,
        height: 75,
        borderRadius: 37.5,
        marginRight: 18,
        borderWidth: 1.5,
        borderColor: '#007aff',
        shadowColor: '#007aff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
    },
    itemTextContainer: {
        flex: 1,
    },
    itemName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#222',
        letterSpacing: 0.5,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007aff',
        marginTop: 6,
    },
    addButton: {
        backgroundColor: '#007aff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 15,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
});
