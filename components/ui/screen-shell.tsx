import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

export type ScreenVariant = 'users' | 'products' | 'history';

const VARIANTS: Record<ScreenVariant, readonly [string, string, string]> = {
  users: ['#163845', '#2c3d4a', '#233542'],
  products: ['#242441', '#2c3d4a', '#233541'],
  history: ['#342c28', '#2c3d4a', '#243038'],
};

/** Diagonal gradient behind each tab for depth (solid fallback via bg-cool-bg). */
export function ScreenShell({ variant, children }: { variant: ScreenVariant; children: ReactNode }) {
  const colors = VARIANTS[variant];
  return (
    <View style={styles.flex}>
      <LinearGradient
        pointerEvents="none"
        colors={[colors[0], colors[1], colors[2]]}
        start={{ x: 0.05, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#2c3d4a',
  },
});
