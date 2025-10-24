import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef, useState } from 'react'; // Import useRef for input focusing
import {
    Dimensions // Import Dimensions
    ,


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

const { height } = Dimensions.get('window'); // Get screen height for layout optimization

// Custom InputField component to accept new keyboard props
function InputField({ icon, placeholder, value, onChangeText, secureTextEntry, focused, onFocus, onBlur, returnKeyType, onSubmitEditing, autoFocus, inputRef, keyboardType }) {
    return (
        <View style={[
            styles.inputContainer,
            focused && styles.focusedInput
        ]}>
            <Ionicons name={icon} size={20} color={focused ? "#007aff" : "#666"} style={styles.inputIcon} />
            <TextInput
                ref={inputRef} // Assign ref
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                onFocus={onFocus}
                onBlur={onBlur}
                autoCapitalize="none"
                returnKeyType={returnKeyType}
                onSubmitEditing={onSubmitEditing}
                autoFocus={autoFocus}
                keyboardType={keyboardType} // Thêm keyboardType
                // Tối ưu hóa padding và giao diện bàn phím cho iOS
                keyboardAppearance="light"
            />
        </View>
    );
}


export default function RegisterScreen() {
    const [account, setAccount] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [focused, setFocused] = useState('');

    // Refs for sequential input focusing
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmRef = useRef(null);

    const handleRegister = async () => {
        if (!account || !email || !password || !confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Vui lòng điền đầy đủ thông tin!',
            });
            return;
        }

        // Regex kiểm tra email hợp lệ
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Email không hợp lệ!',
            });
            return;
        }

        if (password !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Mã khóa không trùng khớp!',
            });
            return;
        }

        try {
            const user = { account, email, password };
            await AsyncStorage.setItem('user', JSON.stringify(user));

            Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: 'Đăng ký thành công! Hãy đăng nhập lại.',
                position: 'top',
                topOffset: 50,
            });

            router.replace('/');
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Không thể lưu thông tin tài khoản.',
                position: 'top',
                topOffset: 50,
            });
            console.error(error);
        }
    };


    const keyboardBehavior = Platform.OS === 'ios' ? 'position' : 'height';
    const keyboardOffset = Platform.OS === 'ios' ? 44 : 0;

    return (
        <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={keyboardBehavior}
            keyboardVerticalOffset={keyboardOffset} // **[ĐÃ THÊM]** Offset để tránh bị che
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <LinearGradient
                    colors={['#ACB6E5', '#74ebd5']}
                    style={styles.container} // style.container đã được tối ưu hóa
                    pointerEvents="box-none"
                >
                    <View style={styles.header}>
                        <Image
                            source={require('../assets/images/Thumb.png')}
                            style={styles.logo}
                        />
                        <Text style={styles.title}>Tạo tài khoản Lang Eat</Text>
                    </View>

                    <View style={styles.inputSection}>
                        <InputField
                            icon="person-outline"
                            placeholder="Tên tài khoản"
                            value={account}
                            onChangeText={setAccount}
                            focused={focused === 'account'}
                            onFocus={() => setFocused('account')}
                            onBlur={() => setFocused('')}
                            returnKeyType="next"
                            onSubmitEditing={() => emailRef.current?.focus()} // Chuyển sang Email
                        />
                        <InputField
                            icon="mail-outline"
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            focused={focused === 'email'}
                            onFocus={() => setFocused('email')}
                            onBlur={() => setFocused('')}
                            returnKeyType="next"
                            onSubmitEditing={() => passwordRef.current?.focus()} // Chuyển sang Mật khẩu
                            inputRef={emailRef}
                            keyboardType="email-address"
                        />
                        <InputField
                            icon="lock-closed-outline"
                            placeholder="Mã khóa"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            focused={focused === 'password'}
                            onFocus={() => setFocused('password')}
                            onBlur={() => setFocused('')}
                            returnKeyType="next"
                            onSubmitEditing={() => confirmRef.current?.focus()} // Chuyển sang Xác nhận
                            inputRef={passwordRef}
                        />
                        <InputField
                            icon="lock-closed-outline"
                            placeholder="Xác nhận mã khóa"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            focused={focused === 'confirm'}
                            onFocus={() => setFocused('confirm')}
                            onBlur={() => setFocused('')}
                            returnKeyType="done"
                            onSubmitEditing={handleRegister} // Chạy hàm Đăng ký
                            inputRef={confirmRef}
                        />
                    </View>

                    <Pressable
                        style={({ pressed }) => [
                            styles.registerButton,
                            pressed && { backgroundColor: '#005bb5' }
                        ]}
                        onPress={handleRegister}
                    >
                        <Text style={styles.registerButtonText}>Đăng ký</Text>
                    </Pressable>

                    <TouchableOpacity onPress={() => router.push('/')}>
                        <Text style={styles.switchText}>
                            Đã có tài khoản?{' '}
                            <Text style={styles.switchLink}>Đăng nhập</Text>
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
        flexGrow: 1,
        // **[ĐÃ SỬA]** Bỏ minHeight ở đây.
        justifyContent: 'center',
    },
    container: {
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
        // Tối ưu hóa nhỏ cho iOS để text align đúng
        paddingVertical: Platform.OS === 'ios' ? 4 : 0,
    },
    focusedInput: { // Style riêng cho trạng thái focus
        borderColor: '#007aff',
        shadowColor: '#007aff',
    },
    registerButton: {
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
    registerButtonText: {
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
        // Thêm padding dưới cùng để đảm bảo footer không bị che trên các thiết bị có safe area
        paddingBottom: 20,
    },
});