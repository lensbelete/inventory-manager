import { Text, View } from 'react-native';

type SectionHeadingProps = {
  label: string;
  accent: string;
  count?: number;
  className?: string;
};

export function SectionHeading({ label, accent, count, className = 'mb-3 mt-9' }: SectionHeadingProps) {
  return (
    <View className={`flex-row flex-wrap items-center gap-2 ${className}`}>
      <View className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
      <Text className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: accent }}>
        {label}
      </Text>
      {count !== undefined ? (
        <View className="rounded-full border border-cool-border/60 bg-cool-bg/50 px-2 py-0.5">
          <Text className="text-[10px] font-bold text-cool-muted">{count}</Text>
        </View>
      ) : null}
    </View>
  );
}
