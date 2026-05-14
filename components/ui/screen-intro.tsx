import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';
import type { ReactNode } from 'react';

type ScreenIntroProps = {
  children: ReactNode;
  /** Accent wash inside the pill */
  tint?: 'cyan' | 'violet' | 'amber';
};

const TINT_GRADIENT: Record<NonNullable<ScreenIntroProps['tint']>, readonly [string, string]> = {
  cyan: ['rgba(94,238,250,0.18)', 'rgba(44,61,74,0.42)'],
  violet: ['rgba(196,180,255,0.22)', 'rgba(44,61,74,0.42)'],
  amber: ['rgba(255,216,138,0.2)', 'rgba(44,61,74,0.42)'],
};

const TINT_DOT: Record<NonNullable<ScreenIntroProps['tint']>, string> = {
  cyan: '#5eeefa',
  violet: '#c4b4ff',
  amber: '#ffd88a',
};

/** Soft contextual blurb below the navigation header with a tinted surface. */
export function ScreenIntro({ children, tint = 'cyan' }: ScreenIntroProps) {
  const g = TINT_GRADIENT[tint];
  return (
    <View className="mt-2 overflow-hidden rounded-2xl border border-cool-border/55">
      <LinearGradient
        colors={g as unknown as readonly [string, string]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{ flexDirection: 'row' }}>
        <View className="w-1 rounded-l-2xl" style={{ backgroundColor: TINT_DOT[tint] }} />
        <View className="flex-1 px-3.5 py-3.5">
          <Text className="text-[15px] leading-[22px] text-cool-muted">{children}</Text>
        </View>
      </LinearGradient>
    </View>
  );
}
