import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007aff', // Customize active color
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tabs.Screen
        name='food'
        options={{
          title: 'Food',
          tabBarIcon: ({ color }) => (
            <Ionicons name='fast-food-outline' size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='fruit'
        options={{
          title: 'Fruit',
          tabBarIcon: ({ color }) => (
            <Ionicons name='nutrition-outline' size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='taikhoan'
        options={{
          title: 'Tài Khoản',
          tabBarIcon: ({ color }) => (
            <Ionicons name='person-outline' size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='giohang'
        options={{
          title: 'Giỏ hàng',
          tabBarIcon: ({ color }) => (
            <Ionicons name='cart-outline' size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
