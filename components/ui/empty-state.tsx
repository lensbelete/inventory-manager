import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

type EmptyStateProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  /** Gradient behind the hero icon */
  accentColors?: readonly [string, string];
  iconTint?: string;
};

/** Centered onboarding-style empty state inside scroll areas. */
export function EmptyState({
  icon,
  title,
  subtitle,
  accentColors = ['rgba(94,238,250,0.35)', 'rgba(65,217,236,0.08)'],
  iconTint = '#41d9ec',
}: EmptyStateProps) {
  return (
    <View className="mt-10 items-center rounded-3xl border border-dashed border-cool-border/80 px-7 py-12">
      <LinearGradient
        colors={accentColors as unknown as readonly [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconFrame}>
        <Ionicons name={icon} size={34} color={iconTint} />
      </LinearGradient>
      <Text className="text-center text-[17px] font-semibold tracking-tight text-cool">{title}</Text>
      {subtitle ? (
        <Text className="mt-3 max-w-[280px] text-center text-[15px] leading-[22px] text-cool-muted">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  iconFrame: {
    marginBottom: 20,
    height: 68,
    width: 68,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
});
