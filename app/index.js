import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    // Thêm Dimensions để có thể điều chỉnh linh hoạt hơn
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';

// Lấy chiều cao màn hình để tối ưu hóa KeyboardAvoidingView
const { height } = Dimensions.get('window');

export default function LoginScreen() {
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [accountFocused, setAccountFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    const handleLogin = async () => {
        if (!account || !password) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Vui lòng điền đầy đủ thông tin!',
            });
            return;
        }
        try {
            const storedUser = await AsyncStorage.getItem('user');
            if (!storedUser) {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi',
                    text2: 'Không tìm thấy tài khoản. Vui lòng đăng ký trước.',
                    position: 'top',
                    topOffset: 50,
                });
                return;
            }

            const user = JSON.parse(storedUser);

            if ((user.account === account || user.email === account) && user.password === password) {
                // Sử dụng replace thay vì push nếu đây là màn hình chính của flow
                router.replace({
                    pathname: '/(tabs)/taikhoan',
                    params: {
                        username: user.account,
                        email: user.email
                    }
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi',
                    text2: 'Sai tài khoản hoặc mã khóa!',
                    position: 'top',
                    topOffset: 50,
                });
            }
        } catch (error) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Đã xảy ra lỗi khi đăng nhập.',
                position: 'top',
                topOffset: 50,
            });
        }
    };

    // **[ĐÃ SỬA]** Tối ưu hóa cho iOS: dùng 'position' thay vì 'padding' để chuyển động mượt hơn.
    const keyboardBehavior = Platform.OS === 'ios' ? 'position' : 'height';

    // **[ĐÃ THÊM]** Offset để ngăn bàn phím che mất input, 44 là giá trị chung cho chiều cao Header.
    const keyboardOffset = Platform.OS === 'ios' ? 44 : 0;

    return (
        <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={keyboardBehavior}
            keyboardVerticalOffset={keyboardOffset}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                alwaysBounceVertical={false}
                showsVerticalScrollIndicator={false}
            >
                <LinearGradient
                    colors={['#74ebd5', '#ACB6E5']}
                    style={styles.container}
                    pointerEvents="box-none"
                >
                    <View style={styles.header}>
                        {/* Thay đổi `require('../assets/images/Thumb.png')` bằng `require('@/assets/images/Thumb.png')` nếu bạn dùng alias `@` trong expo-router */}
                        <Image
                            source={require('../assets/images/Thumb.png')}
                            style={styles.logo}
                        />
                        <Text style={styles.title}>Chào mừng bạn đến với Lang Eat</Text>
                    </View>

                    <View style={styles.inputSection}>
                        <View style={[
                            styles.inputContainer,
                            accountFocused && styles.focusedInput
                        ]}>
                            <Ionicons
                                name="person-outline"
                                size={20}
                                color={accountFocused ? "#007aff" : "#666"}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                value={account}
                                onChangeText={setAccount}
                                placeholder="Tài khoản: email hoặc username"
                                placeholderTextColor="#999"
                                autoCapitalize="none"
                                onFocus={() => setAccountFocused(true)}
                                onBlur={() => setAccountFocused(false)}
                                returnKeyType="next"
                                onSubmitEditing={() => { /* logic chuyển focus đến password input */ }}
                            />
                        </View>

                        <View style={[
                            styles.inputContainer,
                            passwordFocused && styles.focusedInput
                        ]}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color={passwordFocused ? "#007aff" : "#666"}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Mã khóa ..."
                                placeholderTextColor="#999"
                                secureTextEntry
                                autoCapitalize="none"
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={() => setPasswordFocused(false)}
                                returnKeyType="done"
                                onSubmitEditing={handleLogin}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={() =>
                                Toast.show({
                                    type: 'info',
                                    text1: 'Thông báo',
                                    text2: 'Chức năng đang được phát triển!'
                                })
                            }
                        >
                            <Text style={styles.forgot}>Quên mã khóa?</Text>
                        </TouchableOpacity>
                    </View>

                    <Pressable
                        style={({ pressed }) => [
                            styles.loginButton,
                            pressed && { backgroundColor: '#005bb5' }
                        ]}
                        onPress={handleLogin}
                    >
                        <Text style={styles.loginButtonText}>Đăng nhập</Text>
                    </Pressable>

                    <TouchableOpacity onPress={() => router.push('/register')}>
                        <Text style={styles.switchText}>
                            Chưa có tài khoản?{' '}
                            <Text style={styles.switchLink}>Đăng ký</Text>
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.footerText}>© 2025 Lang Eat. All rights reserved.</Text>
                </LinearGradient>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        // Rất quan trọng: cho phép nội dung co giãn tối đa
        flexGrow: 1,
        // **[ĐÃ SỬA]** Bỏ minHeight ở đây, chỉ giữ flexGrow: 1
        justifyContent: 'center',
    },
    container: {
        // **[ĐÃ SỬA]** Bỏ flex: 1 và sử dụng minHeight: height để căn giữa mượt mà
        padding: 25,
        justifyContent: 'center',
        minHeight: height, // Sử dụng minHeight để đảm bảo giao diện full screen trước khi cuộn
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 130,
        height: 130,
        borderRadius: 65,
        borderWidth: 3,
        borderColor: '#fff',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    title: {
        fontSize: 22,
        color: '#fff',
        fontWeight: '600',
    },
    inputSection: {
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderWidth: 1.5,
        borderColor: '#ccc',
        borderRadius: 14,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 18,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 5,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 17,
        color: '#333',
        // Điều chỉnh nhỏ cho iOS để text align đúng
        paddingVertical: Platform.OS === 'ios' ? 4 : 0,
    },
    focusedInput: { // Tạo style riêng cho trạng thái focus
        borderColor: '#007aff',
        shadowColor: '#007aff',
    },
    forgot: {
        color: '#e0f0ff',
        textAlign: 'right',
        fontSize: 15,
        marginBottom: 10,
        fontWeight: '500',
        textDecorationLine: 'underline',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
    },
    loginButton: {
        backgroundColor: '#007aff',
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: 'center',
        shadowColor: '#007aff',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    switchText: {
        color: '#fff',
        textAlign: 'center',
        marginTop: 15,
        fontSize: 16,
    },
    switchLink: {
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
    footerText: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginTop: 25,
        fontWeight: '500',
        // Thêm padding dưới cùng để đảm bảo footer không bị che trên các thiết bị có "tai thỏ" hoặc bị dính sát mép dưới khi bàn phím đóng
        paddingBottom: 20,
    },
});
