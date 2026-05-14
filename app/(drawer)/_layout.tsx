import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { router, usePathname } from 'expo-router';
import React from 'react';
import { Pressable, Text } from 'react-native';
import { DrawerContentScrollView, type DrawerContentComponentProps } from '@react-navigation/drawer';

function CoolDrawerContent(props: DrawerContentComponentProps) {
  const pathname = usePathname();
  const isProducts = pathname.includes('products');
  const isHistory = pathname.includes('history');
  const isUsers = !isProducts && !isHistory;

  function go(target: '/' | '/products' | '/history') {
    router.navigate(target);
    props.navigation.closeDrawer();
  }

  function Row({
    label,
    icon,
    active,
    target,
  }: {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    active: boolean;
    target: '/' | '/products' | '/history';
  }) {
    return (
      <Pressable
        onPress={() => go(target)}
        className={`mb-1 flex-row items-center gap-3 rounded-xl px-3 py-3.5 active:opacity-90 ${
          active ? 'bg-cool-line/40' : ''
        }`}>
        <Ionicons name={icon} size={22} color={active ? '#b8c9d6' : '#7d8fa3'} />
        <Text className={`text-[16px] ${active ? 'font-semibold text-cool' : 'text-cool-muted'}`}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: '#070a0f',
        paddingTop: 56,
        paddingHorizontal: 12,
      }}
      style={{ backgroundColor: '#070a0f' }}>
      <Text className="mb-6 px-2 text-[11px] font-bold uppercase tracking-[0.2em] text-cool-subtle">
        Inventory
      </Text>
      <Row label="Users" icon="person-outline" active={isUsers} target="/" />
      <Row label="Products" icon="cube-outline" active={isProducts} target="/products" />
      <Row label="History" icon="time-outline" active={isHistory} target="/history" />
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(p) => <CoolDrawerContent {...p} />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#121a24',
        },
        headerTintColor: '#d0dae6',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerShadowVisible: false,
        drawerStyle: {
          width: 272,
          backgroundColor: '#070a0f',
        },
        swipeEnabled: true,
      }}>
      <Drawer.Screen
        name="index"
        options={{
          title: 'Users',
          headerTitle: 'Users',
        }}
      />
      <Drawer.Screen
        name="products"
        options={{
          title: 'Products',
          headerTitle: 'Products',
        }}
      />
      <Drawer.Screen
        name="history"
        options={{
          title: 'History',
          headerTitle: 'Transaction history',
        }}
      />
    </Drawer>
  );
}
