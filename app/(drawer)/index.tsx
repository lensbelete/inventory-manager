import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormModal } from '@/components/ui/form-modal';
import { useInventory } from '@/context/inventory-context';

export default function UsersScreen() {
  const navigation = useNavigation();
  const { users, registerUser, pending } = useInventory();
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => setModalOpen(true)}
          className="mr-3 p-1"
          accessibilityRole="button"
          accessibilityLabel="Register user">
          <Ionicons name="person-add-outline" size={26} color="#b8c9d6" />
        </Pressable>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  function closeModal() {
    setModalOpen(false);
    setError(null);
    setEmail('');
    setFullName('');
  }

  async function onSubmit() {
    setError(null);
    const res = await registerUser(email, fullName);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    closeModal();
    setToast('User registered.');
  }

  return (
    <SafeAreaView className="flex-1 bg-cool-bg" edges={['bottom', 'left', 'right']}>
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 28 }}>
        <Text className="pt-2 text-sm text-cool-muted">
          Register users with email and full name. Open the form from the + button above.
        </Text>

        {toast ? (
          <View className="mt-4 rounded-xl border border-cool-line/60 bg-cool-elevated px-3 py-2.5">
            <Text className="text-sm text-cool-ok">{toast}</Text>
          </View>
        ) : null}

        {users.length === 0 ? (
          <Text className="mt-10 text-center text-sm text-cool-subtle">No users yet.</Text>
        ) : (
          <>
            <Text className="mb-2 mt-8 text-xs font-semibold uppercase tracking-wide text-cool-subtle">
              Registered users
            </Text>
            {users.map((u) => (
              <View
                key={u.id}
                className="mb-2 rounded-xl border border-cool-border bg-cool-surface px-3 py-3.5">
                <Text className="font-medium text-cool">{u.fullName}</Text>
                <Text className="mt-0.5 text-sm text-cool-muted">{u.email}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <FormModal visible={modalOpen} title="Register user" onClose={closeModal}>
        <Text className="mb-1 text-xs font-medium text-cool-muted">Email</Text>
        <TextInput
          className="mb-4 rounded-xl border border-cool-border bg-cool-bg px-3 py-2.5 text-base text-cool"
          placeholder="you@example.com"
          placeholderTextColor="#5a6b7c"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          editable={!pending}
        />
        <Text className="mb-1 text-xs font-medium text-cool-muted">Full name</Text>
        <TextInput
          className="mb-4 rounded-xl border border-cool-border bg-cool-bg px-3 py-2.5 text-base text-cool"
          placeholder="Full name"
          placeholderTextColor="#5a6b7c"
          value={fullName}
          onChangeText={setFullName}
          editable={!pending}
        />
        {error ? (
          <Text className="mb-3 text-sm text-rose-400/90" accessibilityRole="alert">
            {error}
          </Text>
        ) : null}
        <Pressable
          onPress={onSubmit}
          disabled={pending}
          className="items-center rounded-xl bg-cool-accent py-3.5 active:opacity-90 disabled:opacity-40">
          {pending ? (
            <ActivityIndicator color="#0a0e14" />
          ) : (
            <Text className="text-base font-semibold text-cool-deep">Register</Text>
          )}
        </Pressable>
      </FormModal>
    </SafeAreaView>
  );
}
