import { Pressable, Text, View } from 'react-native';

export function AmbientBackdrop() {
  return (
    <View pointerEvents="none" className="absolute inset-0 overflow-hidden">
      <View className="absolute -right-16 -top-28 h-80 w-80 rounded-full bg-indigo-600/30" />
      <View className="absolute -bottom-36 -left-20 h-96 w-96 rounded-full bg-cyan-500/20" />
      <View className="absolute left-10 top-[42%] h-56 w-56 rounded-full bg-violet-500/15" />
    </View>
  );
}

export function ScreenHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <View className="mb-2">
      {eyebrow ? (
        <Text className="text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-300">{eyebrow}</Text>
      ) : null}
      <Text className="mt-2 text-[28px] font-bold leading-8 tracking-tight text-white">{title}</Text>
      {subtitle ? <Text className="mt-2 text-[15px] leading-6 text-slate-400">{subtitle}</Text> : null}
    </View>
  );
}

export function SegmentToggle<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { key: T; label: string }[];
}) {
  return (
    <View className="mb-6 flex-row rounded-2xl border border-slate-700/80 bg-slate-900/90 p-1">
      {options.map((opt) => {
        const on = value === opt.key;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
            className={`flex-1 rounded-xl py-2.5 active:opacity-90 ${on ? 'bg-indigo-500 shadow-lg shadow-indigo-900/40' : ''}`}>
            <Text
              className={`text-center text-sm font-semibold ${on ? 'text-white' : 'text-slate-500'}`}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
