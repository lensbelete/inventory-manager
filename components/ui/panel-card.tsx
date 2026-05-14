import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

type PanelCardProps = {
  accent: string;
  children: ReactNode;
  /** Margin-bottom utility class, e.g. mb-3 or mb-4 */
  containerClassName?: string;
  onPress?: () => void;
};

export function PanelCard({
  accent,
  children,
  containerClassName = 'mb-3',
  onPress,
}: PanelCardProps) {
  const body = (
    <View
      className="overflow-hidden rounded-2xl border border-cool-border/60 bg-cool-surface/94 px-4 py-4"
      style={{ borderLeftWidth: 4, borderLeftColor: accent }}>
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.02)', 'transparent']}
        locations={[0, 0.35, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.8 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View className="relative z-10">{children}</View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={containerClassName}
        android_ripple={{ color: 'rgba(255,255,255,0.12)' }}>
        {body}
      </Pressable>
    );
  }

  return <View className={containerClassName}>{body}</View>;
}
