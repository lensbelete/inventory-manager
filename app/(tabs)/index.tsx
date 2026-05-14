import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useInventory } from '@/context/inventory-context';

export default function UsersScreen() {
  const { users, selectedUserId, setSelectedUserId, registerUser, pending } = useInventory();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  async function onSubmit() {
    setError(null);
    const res = await registerUser(email, fullName);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setEmail('');
    setFullName('');
    setToast('User registered.');
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <ScrollView
          className="flex-1 px-4"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 24 }}>
          <Text className="pt-2 text-2xl font-semibold text-slate-100">Users</Text>
          <Text className="mt-1 text-sm text-slate-400">
            Register people who can be attributed on stock changes. Select an active user for the next actions.
          </Text>

          <View className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <Text className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">Register</Text>
            <Text className="mb-1 text-xs text-slate-400">Email</Text>
            <TextInput
              className="mb-3 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-base text-slate-100"
              placeholder="you@example.com"
              placeholderTextColor="#64748b"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              editable={!pending}
            />
            <Text className="mb-1 text-xs text-slate-400">Full name</Text>
            <TextInput
              className="mb-4 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-base text-slate-100"
              placeholder="Ada Lovelace"
              placeholderTextColor="#64748b"
              value={fullName}
              onChangeText={setFullName}
              editable={!pending}
            />
            {error ? (
              <Text className="mb-3 text-sm text-red-400" accessibilityRole="alert">
                {error}
              </Text>
            ) : null}
            {toast ? <Text className="mb-3 text-sm text-emerald-400">{toast}</Text> : null}
            <Pressable
              onPress={onSubmit}
              disabled={pending}
              className="flex-row items-center justify-center rounded-xl bg-cyan-600 py-3 active:opacity-80 disabled:opacity-40">
              {pending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-center text-base font-semibold text-white">Register user</Text>
              )}
            </Pressable>
          </View>

          <Text className="mb-2 mt-8 text-xs font-medium uppercase tracking-wide text-slate-500">
            Active user (for audit trail)
          </Text>
          <Pressable
            onPress={() => setSelectedUserId(null)}
            className={`mb-2 rounded-xl border px-3 py-3 ${selectedUserId === null ? 'border-cyan-500 bg-cyan-950/40' : 'border-slate-800 bg-slate-900/60'}`}>
            <Text className="text-slate-100">No user selected</Text>
            <Text className="text-xs text-slate-500">Actions show “—” as actor</Text>
          </Pressable>
          {users.map((u) => (
            <Pressable
              key={u.id}
              onPress={() => setSelectedUserId(u.id)}
              className={`mb-2 rounded-xl border px-3 py-3 ${selectedUserId === u.id ? 'border-cyan-500 bg-cyan-950/40' : 'border-slate-800 bg-slate-900/60'}`}>
              <Text className="font-medium text-slate-100">{u.fullName}</Text>
              <Text className="text-sm text-slate-400">{u.email}</Text>
            </Pressable>
          ))}
          {users.length === 0 ? (
            <Text className="text-sm text-slate-500">No users yet — add one above.</Text>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
