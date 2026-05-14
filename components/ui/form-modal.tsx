import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { hapticLight } from '@/utils/haptics';

type FormModalProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function FormModal({ visible, title, onClose, children }: FormModalProps) {
  function close() {
    hapticLight();
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-end">
        <View className="flex-1 justify-end bg-cool-deep/80 px-3 pb-6 pt-10">
          <Pressable className="absolute inset-0" onPress={close} accessibilityRole="button" />
          <View className="z-10 max-h-[90%] w-full max-w-[420px] self-center overflow-hidden rounded-3xl border border-cool-border/90 bg-cool-elevated">
            <LinearGradient
              colors={['#5eeefa', '#41d9ec']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ height: 3, width: '100%' }}
            />
            <View className="flex-row items-start justify-between border-b border-cool-border/90 bg-cool-elevated/95 px-4 pb-4 pt-4">
              <Text className="flex-1 pr-4 text-xl font-bold tracking-tight text-cool">{title}</Text>
              <Pressable
                onPress={close}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Close"
                className="rounded-full bg-cool-bg/90 p-1.5 active:opacity-80">
                <Ionicons name="close" size={22} color="#aabdc8" />
              </Pressable>
            </View>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              className="bg-cool-elevated px-4 pt-5"
              contentContainerStyle={{ paddingBottom: 26 }}>
              {children}
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
