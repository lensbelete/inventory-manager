import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/ui/empty-state';
import { FormModal } from '@/components/ui/form-modal';
import { GradientCta } from '@/components/ui/gradient-cta';
import { PanelCard } from '@/components/ui/panel-card';
import { ScreenIntro } from '@/components/ui/screen-intro';
import { ScreenShell } from '@/components/ui/screen-shell';
import { SectionHeading } from '@/components/ui/section-heading';
import { useInventory } from '@/context/inventory-context';
import { hapticLight, hapticSuccess } from '@/utils/haptics';

const HEADER_ACCENT = '#41d9ec';
const ACCENT = '#41d9ec';

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
          onPress={() => {
            hapticLight();
            setModalOpen(true);
          }}
          className="mr-1 rounded-full bg-cool-accent/14 p-2 active:opacity-80"
          accessibilityRole="button"
          accessibilityLabel="Register user">
          <Ionicons name="person-add" size={24} color={HEADER_ACCENT} />
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
    hapticSuccess();
    setToast('User registered.');
  }

  const inputCn =
    'rounded-2xl border border-cool-border/85 bg-cool-bg/90 px-3.5 py-3 text-[17px] text-cool placeholder:text-cool-subtle';

  return (
    <ScreenShell variant="users">
      <SafeAreaView className="flex-1 bg-transparent" edges={['bottom', 'left', 'right']}>
        <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
          <ScreenIntro tint="cyan">
            Register people with email and full name — tap + in the header when you are ready.
          </ScreenIntro>

          {toast ? (
            <View className="mt-5 flex-row items-center gap-3 overflow-hidden rounded-2xl border border-cool-ok/55 bg-cool-ok/14 pl-4 pr-3 py-4">
              <View className="rounded-full bg-cool-ok/40 p-1.5">
                <Ionicons name="checkmark-circle" size={22} color="#58e0a8" />
              </View>
              <Text className="flex-1 text-[15px] font-semibold leading-5 text-cool">{toast}</Text>
            </View>
          ) : null}

          {users.length === 0 ? (
            <EmptyState
              icon="people-outline"
              title="No team members yet"
              subtitle="Add your first user to start tracking inventory activity under their identity."
            />
          ) : (
            <>
              <SectionHeading label="Registered users" accent={ACCENT} count={users.length} />
              {users.map((u) => (
                <PanelCard key={u.id} accent={ACCENT}>
                  <Text className="text-[17px] font-semibold tracking-tight text-cool">{u.fullName}</Text>
                  <Text className="mt-1 text-[15px] text-cool-muted">{u.email}</Text>
                </PanelCard>
              ))}
            </>
          )}
        </ScrollView>

        <FormModal visible={modalOpen} title="New user" onClose={closeModal}>
          <Text className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-cool-subtle">
            Email
          </Text>
          <TextInput
            className={`mb-4 ${inputCn}`}
            placeholder="you@example.com"
            placeholderTextColor="#8499a8"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            editable={!pending}
          />
          <Text className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-cool-subtle">
            Full name
          </Text>
          <TextInput
            className={`mb-4 ${inputCn}`}
            placeholder="Ada Lovelace"
            placeholderTextColor="#8499a8"
            value={fullName}
            onChangeText={setFullName}
            editable={!pending}
          />
          {error ? (
            <Text className="mb-4 rounded-xl bg-rose-500/14 px-3 py-3 text-[15px] text-rose-300" accessibilityRole="alert">
              {error}
            </Text>
          ) : null}
          <GradientCta onPress={onSubmit} label="Register" disabled={pending} loading={pending} />
        </FormModal>
      </SafeAreaView>
    </ScreenShell>
  );
}
