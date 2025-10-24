import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
// 🔥 Import thêm 'Keyboard' để ẩn bàn phím
import { FlatList, Image, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';


const imagesMap = {
    'com-ga-xoi-mo.jpeg': require('../../assets/images/com-ga-xoi-mo.jpeg'),
    'banh-mi.jpeg': require('../../assets/images/banh-mi.jpeg'),
    'xoi-man.jpeg': require('../../assets/images/xoi-man.jpeg'),
    'pho.jpeg': require('../../assets/images/pho.jpeg'),
    'ca-phe.jpeg': require('../../assets/images/ca-phe.jpeg'),
    'com-suon.jpeg': require('../../assets/images/com-suon.jpeg'),
    'chuoi.jpeg': require('../../assets/images/chuoi.jpeg'),
    'soai.jpeg': require('../../assets/images/soai.jpeg'),
    'cam.jpeg': require('../../assets/images/cam.jpeg'),
    'kiwi.jpeg': require('../../assets/images/kiwi.jpeg'),
    'nho.jpeg': require('../../assets/images/nho.jpeg'),
    'tao.jpeg': require('../../assets/images/tao.jpeg'),
};

export default function CartScreen() {
    const [customerInfo, setCustomerInfo] = useState(null);
    const [cart, setCart] = useState([]);
    const [newPhone, setNewPhone] = useState('');
    const [newAddress, setNewAddress] = useState('');

    // Chuyển logic load dữ liệu vào useCallback
    const loadData = useCallback(async () => {
        try {
            console.log('--- Tải lại dữ liệu Giỏ hàng ---');
            const infoJson = await AsyncStorage.getItem('user');
            if (infoJson) {
                const info = JSON.parse(infoJson);
                setCustomerInfo(info);

                // Set giá trị mặc định cho TextInput nếu đã có dữ liệu
                setNewPhone(info.phone || '');
                setNewAddress(info.address || '');
            } else {
                setCustomerInfo(null);
            }

            const cartJson = await AsyncStorage.getItem('cart');
            setCart(cartJson ? JSON.parse(cartJson) : []);
        } catch (error) {
            console.error('Lỗi load dữ liệu:', error);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const handleUpdateCustomerInfo = async () => {
        const phoneTrimmed = newPhone.trim();
        const addressTrimmed = newAddress.trim();

        if (!phoneTrimmed || !addressTrimmed) {
            Toast.show({
                type: 'error',
                text1: 'Thiếu thông tin',
                text2: 'Vui lòng nhập đủ Số điện thoại và Địa chỉ.',
            });
            return;
        }

        // 🔥 RÀNG BUỘC SỐ ĐIỆN THOẠI 10 CHỮ SỐ (ĐỊNH DẠNG VIỆT NAM THÔNG DỤNG) 🔥
        // Regex kiểm tra phải là 10 chữ số
        const phoneRegex = /^\d{10}$/;

        // Kiểm tra thêm điều kiện phải bắt đầu bằng 0 (để gần với định dạng VN hơn)
        if (!phoneRegex.test(phoneTrimmed) || !phoneTrimmed.startsWith('0')) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi SĐT',
                text2: 'Nhập đúng định dạng số điện thoại',
                position: 'top',
                topOffset: 50,
            });
            return;
        }

        if (!customerInfo) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Không tìm thấy thông tin tài khoản để cập nhật.',
            });
            return;
        }

        const updatedInfo = {
            ...customerInfo,
            phone: phoneTrimmed,
            address: addressTrimmed,
        };

        try {
            await AsyncStorage.setItem('user', JSON.stringify(updatedInfo));
            setCustomerInfo(updatedInfo); // Cập nhật state
            Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: 'Đã cập nhật Số điện thoại & Địa chỉ.',
                position: 'top',
                topOffset: 50,
            });

            // 🔥 THÊM DÒNG NÀY ĐỂ ẨN BÀN PHÍM TRÊN IOS/ANDROID 🔥
            Keyboard.dismiss();

        } catch (error) {
            console.error('Lỗi cập nhật thông tin:', error);
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Không thể cập nhật thông tin. Vui lòng thử lại.',
                position: 'top',
                topOffset: 50,
            });
        }
    };

    const handleRemoveItem = async (itemId) => {
        const newCart = cart.filter(item => item.id !== itemId);

        try {
            await AsyncStorage.setItem('cart', JSON.stringify(newCart));
            setCart(newCart);

            Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: 'Đã xóa sản phẩm khỏi giỏ hàng.',
                position: 'top',
                topOffset: 50,
            });
        } catch (error) {
            console.error('Lỗi xóa sản phẩm:', error);
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Không thể xóa sản phẩm. Vui lòng thử lại.',
                position: 'top',
                topOffset: 50,
            });
        }
    };

    // Tổng tiền
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Xử lý đặt hàng (Giữ nguyên)
    const handlePlaceOrder = async () => {
        if (!customerInfo || !customerInfo.phone || !customerInfo.address) { // ĐIỀU KIỆN MỚI
            Toast.show({
                type: 'error',
                text1: 'Thiếu thông tin',
                text2: 'Vui lòng cập nhật thông tin',
                position: 'top',
                topOffset: 50,
            });
            return;
        }
        if (cart.length === 0) {
            Toast.show({
                type: 'error',
                text1: 'Giỏ hàng trống',
                text2: 'Bạn chưa có sản phẩm nào trong giỏ.',
                position: 'top',
                topOffset: 50,
            });
            return;
        }

        const order = {
            id: Date.now().toString(),
            customer: customerInfo,
            items: cart,
            total: totalPrice,
            date: new Date().toISOString(),
        };

        try {
            const ordersJson = await AsyncStorage.getItem('orders');
            let orders = ordersJson ? JSON.parse(ordersJson) : [];

            orders.push(order);

            await AsyncStorage.setItem('orders', JSON.stringify(orders));

            await AsyncStorage.removeItem('cart');
            setCart([]);

            Toast.show({
                type: 'success',
                text1: 'Đặt hàng thành công',
                text2: 'Cảm ơn bạn đã đặt hàng!',
                position: 'top',
                topOffset: 50,
            });
        } catch (error) {
            console.error('Lỗi đặt hàng:', error);
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Đặt hàng thất bại. Vui lòng thử lại.',
                position: 'top',
                topOffset: 50,
            });
        }
    };

    // --- Render Component ---
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Thông tin khách hàng</Text>
            {customerInfo ? (
                <View style={styles.customerInfo}>
                    <Text style={styles.infoText}><Text style={{ fontWeight: 'bold' }}>Tài khoản:</Text> {customerInfo.account}</Text>
                    <Text style={styles.infoText}><Text style={{ fontWeight: 'bold' }}>Email:</Text> {customerInfo.email}</Text>

                    {/* KHU VỰC NHẬP LIỆU BỔ SUNG */}
                    <Text style={styles.subHeader}>Thông tin giao hàng</Text>

                    <Text style={styles.label}>Số điện thoại:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập đúng định dạng số"
                        keyboardType="phone-pad"
                        value={newPhone}
                        onChangeText={setNewPhone}
                    />

                    <Text style={styles.label}>Địa chỉ:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập địa chỉ giao hàng chi tiết"
                        value={newAddress}
                        onChangeText={setNewAddress}
                        multiline
                    />

                    <TouchableOpacity
                        style={styles.updateButton}
                        onPress={handleUpdateCustomerInfo}
                    >
                        <Text style={styles.updateButtonText}>Cập nhật SĐT & Địa chỉ</Text>
                    </TouchableOpacity>

                    <View style={styles.currentInfo}>
                        <Text style={styles.currentInfoText}><Text style={{ fontWeight: 'bold' }}>SĐT hiện tại:</Text> {customerInfo.phone || 'Chưa có'}</Text>
                        <Text style={styles.currentInfoText}><Text style={{ fontWeight: 'bold' }}>Địa chỉ hiện tại:</Text> {customerInfo.address || 'Chưa có'}</Text>
                    </View>

                </View>
            ) : (
                <Text style={styles.missingInfo}>Chưa có thông tin tài khoản. Vui lòng Đăng nhập/Đăng ký.</Text>
            )}

            <Text style={styles.header}>Giỏ hàng</Text>
            {cart.length > 0 ? (
                <>
                    <FlatList
                        data={cart}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.cartItem}>
                                <Image source={imagesMap[item.imageName]} style={styles.itemImage} />
                                <View style={styles.itemDetails}>
                                    <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                                    <Text style={styles.itemQuantity}>SL: {item.quantity}</Text>
                                    <Text style={styles.itemPriceText}>Đơn giá: {item.price.toLocaleString('vi-VN')} đ</Text>
                                </View>
                                <View style={styles.itemRight}>
                                    <Text style={styles.itemTotalPrice}>{(item.price * item.quantity).toLocaleString('vi-VN')} đ</Text>
                                    {/* Nút Xóa */}
                                    <TouchableOpacity
                                        style={styles.removeButton}
                                        onPress={() => handleRemoveItem(item.id)}
                                    >
                                        <Text style={styles.removeButtonText}>Xóa</Text>
                                        {/* Nếu dùng Icon: <Icon name="trash-outline" size={20} color="#fff" /> */}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    />
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalText}>Tổng cộng:</Text>
                        <Text style={styles.totalTextPrice}>{totalPrice.toLocaleString('vi-VN')} đ</Text>
                    </View>

                    <TouchableOpacity style={styles.orderButton} onPress={handlePlaceOrder}>
                        <Text style={styles.orderButtonText}>Đặt hàng</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <Text>Giỏ hàng trống.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    header: { fontSize: 22, fontWeight: 'bold', marginVertical: 10 },
    subHeader: { fontSize: 16, fontWeight: 'bold', marginTop: 15, marginBottom: 5, color: '#007bff' },

    // Cập nhật Customer Info
    customerInfo: { marginBottom: 20, padding: 15, backgroundColor: '#f0f0f0', borderRadius: 8 },
    infoText: { fontSize: 14, marginBottom: 4 },
    missingInfo: { color: 'red', marginBottom: 10 },

    // Input & Button mới
    label: { fontSize: 14, marginTop: 8, marginBottom: 4, fontWeight: '500' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    updateButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 15,
    },
    updateButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    currentInfo: {
        marginTop: 5,
        padding: 10,
        backgroundColor: '#e9ecef',
        borderRadius: 5,
    },
    currentInfoText: { fontSize: 14, color: '#495057' },

    // Cải tiến Item (Giữ nguyên)
    cartItem: {
        flexDirection: 'row',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: '#eee',
        alignItems: 'center',
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 10
    },
    itemDetails: {
        flex: 1,
        marginRight: 10,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    itemQuantity: {
        fontSize: 14,
        color: '#666',
    },
    itemPriceText: {
        fontSize: 14,
        color: '#999',
    },

    // Phần bên phải (Tổng tiền và Xóa)
    itemRight: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 60,
    },
    itemTotalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#d9534f',
    },
    removeButton: {
        backgroundColor: '#dc3545',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    removeButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },

    // Total Container (Giữ nguyên)
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 15,
        borderTopWidth: 1,
        borderColor: '#ccc',
        paddingTop: 10,
    },
    totalText: { fontSize: 18, fontWeight: 'bold' },
    totalTextPrice: { fontSize: 18, fontWeight: 'bold', color: '#28a745' },

    // Order Button (Giữ nguyên)
    orderButton: {
        backgroundColor: '#28a745',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 10,
    },
    orderButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});