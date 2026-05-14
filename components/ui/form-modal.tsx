import { Ionicons } from '@expo/vector-icons';
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

type FormModalProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function FormModal({ visible, title, onClose, children }: FormModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-center">
        <View className="flex-1 justify-center bg-cool-deep/70 px-4">
          <Pressable className="absolute inset-0" onPress={onClose} accessibilityRole="button" />
          <View className="z-10 max-h-[88%] w-full max-w-[420px] self-center rounded-2xl border border-cool-border bg-cool-elevated">
            <View className="flex-row items-center justify-between border-b border-cool-border px-4 py-3.5">
              <Text className="flex-1 pr-2 text-lg font-semibold text-cool">{title}</Text>
              <Pressable
                onPress={onClose}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Close">
                <Ionicons name="close" size={26} color="#7d8fa3" />
              </Pressable>
            </View>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              className="px-4 py-4"
              contentContainerStyle={{ paddingBottom: 20 }}>
              {children}
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
