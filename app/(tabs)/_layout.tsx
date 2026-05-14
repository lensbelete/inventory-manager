import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_INACTIVE = '#8a9da8';
const ACCENT_USERS = '#5eeefa';
const ACCENT_PRODUCTS = '#c4b4ff';
const ACCENT_HISTORY = '#ffd88a';

const TAB_BAR_BG = '#344652';
const TAB_BAR_BORDER = '#5f778a';
const HEADER_BG = '#3d5161';

/** Icon slot matches default tab layout so items stay centered above labels. */
function TabIconSlot({
  focused,
  nameActive,
  nameInactive,
  activeColor,
  inactiveColor,
}: {
  focused: boolean;
  nameActive: keyof typeof Ionicons.glyphMap;
  nameInactive: keyof typeof Ionicons.glyphMap;
  activeColor: string;
  inactiveColor: string;
}) {
  return (
    <View style={[styles.iconSlot, focused && styles.iconSlotFocused]}>
      <Ionicons
        name={(focused ? nameActive : nameInactive) as keyof typeof Ionicons.glyphMap}
        size={24}
        color={focused ? activeColor : inactiveColor}
      />
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const tabBarPaddingBottom =
    Platform.OS === 'ios' ? Math.max(insets.bottom, 10) : Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: HEADER_BG,
        },
        headerTintColor: '#e8eef4',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 19,
          letterSpacing: -0.35,
        },
        headerShadowVisible: false,
        tabBarHideOnKeyboard: true,
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: [
          styles.tabBar,
          {
            paddingBottom: tabBarPaddingBottom,
            paddingTop: 10,
          },
          Platform.OS === 'ios' && {
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
          },
          Platform.OS === 'android' && { elevation: 10 },
        ],
        tabBarInactiveTintColor: TAB_INACTIVE,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.15,
          marginTop: 2,
        },
        tabBarItemStyle: styles.tabBarItem,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Users',
          headerTitle: 'Users',
          tabBarActiveTintColor: ACCENT_USERS,
          tabBarIcon: ({ focused }) => (
            <TabIconSlot
              focused={focused}
              nameActive="person"
              nameInactive="person-outline"
              activeColor={ACCENT_USERS}
              inactiveColor={TAB_INACTIVE}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          headerTitle: 'Products',
          tabBarActiveTintColor: ACCENT_PRODUCTS,
          tabBarIcon: ({ focused }) => (
            <TabIconSlot
              focused={focused}
              nameActive="cube"
              nameInactive="cube-outline"
              activeColor={ACCENT_PRODUCTS}
              inactiveColor={TAB_INACTIVE}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          headerTitle: 'Transaction history',
          tabBarLabel: 'History',
          tabBarActiveTintColor: ACCENT_HISTORY,
          tabBarIcon: ({ focused }) => (
            <TabIconSlot
              focused={focused}
              nameActive="time"
              nameInactive="time-outline"
              activeColor={ACCENT_HISTORY}
              inactiveColor={TAB_INACTIVE}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: TAB_BAR_BG,
    borderTopColor: TAB_BAR_BORDER,
    borderTopWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    minHeight: 56,
  },
  tabBarItem: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  iconSlot: {
    width: 44,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSlotFocused: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
});
