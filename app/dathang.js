import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function OrderHistoryScreen() {
    const navigation = useNavigation();
    const router = useRouter();
    const [orders, setOrders] = useState([]);

    // Định dạng ngày giờ cho dễ đọc
    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    // Hàm load dữ liệu đơn hàng
    const loadOrders = useCallback(async () => {
        try {
            const ordersJson = await AsyncStorage.getItem('orders');
            if (ordersJson) {
                // Sắp xếp đơn hàng mới nhất lên đầu
                const loadedOrders = JSON.parse(ordersJson);
                const sortedOrders = loadedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
                setOrders(sortedOrders);
            }
        } catch (error) {
            console.error('Lỗi tải đơn hàng:', error);
        }
    }, []);

    // Tải lại đơn hàng mỗi khi màn hình được focus
    useFocusEffect(
        useCallback(() => {
            loadOrders();
        }, [loadOrders])
    );

    // Component hiển thị chi tiết 1 đơn hàng
    const renderOrderItem = ({ item }) => (
        <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Mã Đơn: #{item.id.slice(-6)}</Text>
                <Text style={styles.orderDate}>{formatDateTime(item.date)}</Text>
            </View>

            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Khách hàng:</Text>
                <Text style={styles.detailValue}>{item.customer.account}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Địa chỉ:</Text>
                <Text style={styles.detailValue} numberOfLines={2}>{item.customer.address}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>SĐT:</Text>
                <Text style={styles.detailValue}>{item.customer.phone}</Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.itemsTitle}>Sản phẩm đã đặt:</Text>
            {item.items.map((dish, index) => (
                <View key={index} style={styles.itemRow}>
                    <Text style={styles.itemText} numberOfLines={1}>{dish.name}</Text>
                    <Text style={styles.itemQuantity}>x{dish.quantity}</Text>
                    <Text style={styles.itemSubTotal}>
                        {(dish.price * dish.quantity).toLocaleString('vi-VN')} đ
                    </Text>
                </View>
            ))}

            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>TỔNG CỘNG:</Text>
                <Text style={styles.totalPrice}>{item.total.toLocaleString('vi-VN')} đ</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/taikhoan')}>
                    <Ionicons name="chevron-back" size={28} color="#007aff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Lịch sử Đơn hàng</Text>
                <View style={{ width: 28 }} />
            </View>

            {orders.length > 0 ? (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id}
                    renderItem={renderOrderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Ionicons name="receipt-outline" size={80} color="#ccc" />
                    <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào.</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
        paddingHorizontal: 20,
        paddingTop: 100, // tăng paddingTop cho đủ chỗ header nằm trên cùng
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#222',
    },

    // Card Đơn hàng
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 8,
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007aff',
    },
    orderDate: {
        fontSize: 14,
        color: '#6c757d',
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: '600',
        width: 80, // Chiều rộng cố định cho label
        color: '#495057',
    },
    detailValue: {
        fontSize: 14,
        flex: 1,
        color: '#212529',
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 10,
    },

    // Items trong đơn hàng
    itemsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#343a40',
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    itemText: {
        flex: 1,
        fontSize: 14,
        color: '#6c757d',
    },
    itemQuantity: {
        fontSize: 14,
        fontWeight: '600',
        width: 30,
        textAlign: 'right',
        color: '#495057',
    },
    itemSubTotal: {
        fontSize: 14,
        fontWeight: '600',
        width: 80,
        textAlign: 'right',
        color: '#28a745',
    },

    // Total
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        marginTop: 10,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#343a40',
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#dc3545',
    },

    // Empty State
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -100, // Căn giữa hợp lý hơn trên màn hình
    },
    emptyText: {
        fontSize: 18,
        color: '#888',
        marginTop: 15,
    },
});