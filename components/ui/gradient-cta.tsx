import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, Text } from 'react-native';

import { hapticLight } from '@/utils/haptics';

type GradientCtaProps = {
  onPress: () => void;
  label: string;
  disabled?: boolean;
  loading?: boolean;
};

export function GradientCta({ onPress, label, disabled, loading }: GradientCtaProps) {
  const locked = disabled || loading;
  return (
    <Pressable
      disabled={locked}
      onPress={() => {
        hapticLight();
        onPress();
      }}
      className="overflow-hidden rounded-2xl active:opacity-90 disabled:opacity-40">
      <LinearGradient
        colors={['#7af2ff', '#48d8eb', '#2eb4c9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingVertical: 15,
          alignItems: 'center',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.28)',
        }}>
        {loading ? (
          <ActivityIndicator color="#152830" />
        ) : (
          <Text className="text-[17px] font-bold tracking-tight text-cool-deep">{label}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}
