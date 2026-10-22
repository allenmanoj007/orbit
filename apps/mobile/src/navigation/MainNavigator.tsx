import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NearbyScreen } from '../screens/main/NearbyScreen';
import { DiscoverScreen } from '../screens/main/DiscoverScreen';
import { ChatsScreen } from '../screens/main/ChatsScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { Colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

// Empty component for the center camera button because it intercepts to open Camera screen
const NullComponent = () => null;

export const MainNavigator = ({ navigation }: any) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen
        name="Nearby"
        component={NearbyScreen}
        options={{
          tabBarLabel: 'Nearby',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20 }}>🧭</Text>
          ),
        }}
      />

      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          tabBarLabel: 'Discover',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20 }}>✨</Text>
          ),
        }}
      />

      <Tab.Screen
        name="SnapsTab"
        component={NullComponent}
        options={{
          tabBarLabel: '',
          tabBarButton: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Camera')}
              style={styles.centerSnapBtn}
              activeOpacity={0.85}
            >
              <Text style={styles.snapIcon}>⚡</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <Tab.Screen
        name="Chats"
        component={ChatsScreen}
        options={{
          tabBarLabel: 'Chats',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20 }}>💬</Text>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20 }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  centerSnapBtn: {
    top: -18,
    justifyContent: 'center',
    alignItems: 'center',
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  snapIcon: {
    fontSize: 26,
    color: '#FFFFFF',
  },
});
