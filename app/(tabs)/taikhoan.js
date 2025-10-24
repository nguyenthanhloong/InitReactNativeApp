import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

const accountItems = [
    { name: 'Tài khoản và bảo mật', icon: 'shield-checkmark-outline' },
    { name: 'Thanh toán', icon: 'card-outline' },
    { name: 'Hàng tháng thường xuyên', icon: 'calendar-outline' },
    { name: 'Điều chỉnh lịch sử', icon: 'time-outline' },
    { name: 'Nạp tiền', icon: 'wallet-outline' },
    { name: 'Báo cáo', icon: 'document-text-outline' },
    { name: 'Đơn đặt', icon: 'receipt-outline' },
];

export default function AccountScreen() {
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const router = useRouter();

    const username = params.username;
    const email = params.email;

    const handleLogout = async () => {
        await AsyncStorage.removeItem('cart');
        navigation.replace('index');
    };

    const adminEmails = ['admin@gmail.com', 'admin@yourdomain.com'];

    const [rank, setRank] = useState(
        adminEmails.includes(username?.toLowerCase()) ? 'Vàng' : 'Đồng'
    );


    const handleItemPress = (itemName) => {
        if (itemName === 'Đơn đặt') {
            router.push('/dathang');
        } else {
            Toast.show({
                type: 'info',
                text1: 'Thông báo',
                text2: 'Chức năng đang được phát triển!',
                visibilityTime: 800,
            });
        }
    };


    const rankColors = {
        Vàng: '#ffd700',
        Đồng: '#cd7f32',
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={28} color="#007aff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Thông tin người dùng</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.profileContainer}>
                <Image
                    source={require('../../assets/images/man_avatar.jpeg')}
                    style={styles.profileImage}
                />
                <Text style={styles.profileName}>{username}</Text>
                <Text style={styles.profileEmail}>{email}</Text>

                <View style={styles.membershipBadge}>
                    <Ionicons name="star" size={20} color={rankColors[rank]} />
                    <Text style={[styles.membershipText, { color: rankColors[rank] }]}>
                        Hạng Thành Viên: {rank}
                    </Text>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Đăng xuất</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={accountItems}
                renderItem={({ item }) => (
                    // CẬP NHẬT: Gọi hàm handleItemPress khi nhấn
                    <TouchableOpacity
                        style={styles.listItem}
                        activeOpacity={0.7}
                        onPress={() => handleItemPress(item.name)} // THAY ĐỔI Ở ĐÂY
                    >
                        <Ionicons name={item.icon} size={24} color="#007aff" style={styles.itemIcon} />
                        <Text style={styles.itemName}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: 30 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#222',
    },
    profileContainer: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 25,
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
    },
    profileImage: {
        width: 110,
        height: 110,
        borderRadius: 55,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#007aff',
    },
    profileName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#111',
        marginBottom: 5,
    },
    profileEmail: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
    },
    membershipBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff8dc',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginBottom: 20,
        shadowColor: '#ffd700',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 3,
    },
    membershipText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '600',
        color: '#b8860b',
    },
    logoutButton: {
        backgroundColor: '#ff3b30',
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 50,
        shadowColor: '#ff3b30',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 5,
    },
    logoutText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemIcon: {
        marginRight: 18,
    },
    itemName: {
        fontSize: 18,
        color: '#333',
        fontWeight: '600',
    },
});
