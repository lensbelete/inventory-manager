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

import { AmbientBackdrop, ScreenHeader, SegmentToggle } from '@/components/layout/app-chrome';
import { useInventory } from '@/context/inventory-context';

type Segment = 'register' | 'directory';

export default function UsersScreen() {
  const { users, selectedUserId, setSelectedUserId, registerUser, pending } = useInventory();
  const [segment, setSegment] = useState<Segment>('register');
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
    setSegment('directory');
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top', 'left', 'right']}>
      <View className="flex-1">
        <AmbientBackdrop />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1">
          <ScrollView
            className="flex-1 px-5"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 40 }}>
            <ScreenHeader
              eyebrow="Access"
              title="Team"
              subtitle="Register teammates and pick who performs the next stock actions."
            />

            <SegmentToggle<Segment>
              value={segment}
              onChange={setSegment}
              options={[
                { key: 'register', label: 'Invite' },
                { key: 'directory', label: 'Directory' },
              ]}
            />

            {segment === 'register' ? (
              <View className="rounded-3xl border border-slate-700/60 bg-slate-900/70 p-5">
                <Text className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-slate-500">
                  New member
                </Text>
                <Text className="mb-1.5 text-xs font-medium text-slate-400">Work email</Text>
                <TextInput
                  className="mb-4 rounded-2xl border border-slate-700/80 bg-slate-950/80 px-4 py-3.5 text-base text-white"
                  placeholder="you@company.com"
                  placeholderTextColor="#64748b"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  editable={!pending}
                />
                <Text className="mb-1.5 text-xs font-medium text-slate-400">Full name</Text>
                <TextInput
                  className="mb-4 rounded-2xl border border-slate-700/80 bg-slate-950/80 px-4 py-3.5 text-base text-white"
                  placeholder="Alex Kim"
                  placeholderTextColor="#64748b"
                  value={fullName}
                  onChangeText={setFullName}
                  editable={!pending}
                />
                {error ? (
                  <Text className="mb-3 text-sm text-rose-400" accessibilityRole="alert">
                    {error}
                  </Text>
                ) : null}
                {toast ? <Text className="mb-3 text-sm text-emerald-400">{toast}</Text> : null}
                <Pressable
                  onPress={onSubmit}
                  disabled={pending}
                  className="items-center rounded-2xl bg-indigo-500 py-4 active:bg-indigo-600 disabled:opacity-40">
                  {pending ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-base font-bold text-white">Add to directory</Text>
                  )}
                </Pressable>
              </View>
            ) : (
              <View>
                <Text className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-slate-500">
                  Active actor
                </Text>
                <Text className="mb-3 text-sm text-slate-400">
                  Selection applies to catalog changes and appears on the ledger.
                </Text>
                <Pressable
                  onPress={() => setSelectedUserId(null)}
                  className={`mb-3 rounded-2xl border px-4 py-4 ${
                    selectedUserId === null
                      ? 'border-indigo-400 bg-indigo-950/50'
                      : 'border-slate-700/80 bg-slate-900/50'
                  }`}>
                  <Text className="font-semibold text-white">No selection</Text>
                  <Text className="mt-1 text-sm text-slate-500">Ledger shows “—” as actor</Text>
                </Pressable>
                {users.length === 0 ? (
                  <View className="items-center rounded-3xl border border-dashed border-slate-700 py-10">
                    <Text className="text-center text-slate-500">No people yet.</Text>
                    <Text className="mt-1 text-center text-sm text-slate-600">Switch to Invite to add one.</Text>
                  </View>
                ) : (
                  users.map((u) => (
                    <Pressable
                      key={u.id}
                      onPress={() => setSelectedUserId(u.id)}
                      className={`mb-3 rounded-2xl border px-4 py-4 ${
                        selectedUserId === u.id
                          ? 'border-indigo-400 bg-indigo-950/40'
                          : 'border-slate-700/80 bg-slate-900/50'
                      }`}>
                      <Text className="text-lg font-semibold text-white">{u.fullName}</Text>
                      <Text className="mt-0.5 text-sm text-slate-400">{u.email}</Text>
                    </Pressable>
                  ))
                )}
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}
