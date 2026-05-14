import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AmbientBackdrop, ScreenHeader } from '@/components/layout/app-chrome';
import { useInventory } from '@/context/inventory-context';
import type { TransactionType } from '@/types/inventory';

function typeLabel(t: TransactionType): string {
  switch (t) {
    case 'PRODUCT_CREATED':
      return 'Created';
    case 'STOCK_ADDED':
      return 'Inbound';
    case 'STOCK_REMOVED':
      return 'Outbound';
    default:
      return t;
  }
}

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function DashboardScreen() {
  const { users, products, transactions, selectedUserId } = useInventory();

  const totalUnits = useMemo(() => products.reduce((s, p) => s + p.quantity, 0), [products]);
  const lowStock = useMemo(() => products.filter((p) => p.quantity > 0 && p.quantity < 6).length, [products]);
  const preview = transactions.slice(0, 4);
  const activeName =
    selectedUserId === null ? null : users.find((u) => u.id === selectedUserId)?.fullName ?? null;

  const stats = [
    { label: 'People', value: String(users.length), icon: 'people' as const, tint: '#a5b4fc' },
    { label: 'SKUs', value: String(products.length), icon: 'cube' as const, tint: '#67e8f9' },
    { label: 'Units', value: String(totalUnits), icon: 'layers' as const, tint: '#c4b5fd' },
    { label: 'Moves', value: String(transactions.length), icon: 'pulse' as const, tint: '#fbbf24' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top', 'left', 'right']}>
      <View className="flex-1">
        <AmbientBackdrop />
        <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 36 }}>
          <ScreenHeader
            eyebrow="Overview"
            title="Stockroom"
            subtitle="Local demo workspace — jump into a flow or scan the latest ledger entries."
          />

          {activeName ? (
            <View className="mb-5 flex-row items-center rounded-2xl border border-indigo-500/40 bg-indigo-950/40 px-4 py-3">
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/30">
                <Ionicons name="person-circle" size={22} color="#c7d2fe" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-semibold uppercase tracking-wide text-indigo-200/80">
                  Acting as
                </Text>
                <Text className="text-base font-semibold text-white">{activeName}</Text>
              </View>
            </View>
          ) : (
            <View className="mb-5 rounded-2xl border border-slate-700/70 bg-slate-900/40 px-4 py-3">
              <Text className="text-sm text-slate-400">No active user — open Team to choose who acts on stock.</Text>
            </View>
          )}

          <Text className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-slate-500">Signals</Text>
          <View className="mb-7 flex-row flex-wrap gap-3">
            {stats.map((s) => (
              <View
                key={s.label}
                className="min-w-[47%] flex-1 rounded-2xl border border-slate-700/70 bg-slate-900/60 p-4">
                <View className="mb-2 flex-row items-center justify-between">
                  <Text className="text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</Text>
                  <Ionicons name={s.icon} size={18} color={s.tint} />
                </View>
                <Text className="text-2xl font-bold text-white">{s.value}</Text>
              </View>
            ))}
          </View>

          {lowStock > 0 ? (
            <View className="mb-7 rounded-2xl border border-amber-500/35 bg-amber-950/25 px-4 py-3">
              <Text className="text-sm font-semibold text-amber-200">
                {lowStock} SKU{lowStock === 1 ? '' : 's'} under six units
              </Text>
              <Text className="mt-1 text-xs text-amber-200/70">Review shelf levels in Catalog.</Text>
            </View>
          ) : null}

          <Text className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-slate-500">Flows</Text>
          <View className="gap-3">
            <Link href="/users" asChild>
              <Pressable className="rounded-2xl border border-slate-700/70 bg-slate-900/60 px-4 py-4 active:opacity-90">
                <View className="flex-row items-center">
                  <View className="h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20">
                    <Ionicons name="people" size={24} color="#a5b4fc" />
                  </View>
                  <View className="ml-4 flex-1">
                    <Text className="text-lg font-bold text-white">Team</Text>
                    <Text className="text-sm text-slate-500">Users & active actor</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={22} color="#475569" />
                </View>
              </Pressable>
            </Link>
            <Link href="/products" asChild>
              <Pressable className="rounded-2xl border border-slate-700/70 bg-slate-900/60 px-4 py-4 active:opacity-90">
                <View className="flex-row items-center">
                  <View className="h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15">
                    <Ionicons name="cube" size={24} color="#67e8f9" />
                  </View>
                  <View className="ml-4 flex-1">
                    <Text className="text-lg font-bold text-white">Catalog</Text>
                    <Text className="text-sm text-slate-500">Add SKUs and move stock</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={22} color="#475569" />
                </View>
              </Pressable>
            </Link>
            <Link href="/history" asChild>
              <Pressable className="rounded-2xl border border-slate-700/70 bg-slate-900/60 px-4 py-4 active:opacity-90">
                <View className="flex-row items-center">
                  <View className="h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15">
                    <Ionicons name="git-commit" size={24} color="#c4b5fd" />
                  </View>
                  <View className="ml-4 flex-1">
                    <Text className="text-lg font-bold text-white">Ledger</Text>
                    <Text className="text-sm text-slate-500">Paginated transaction history</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={22} color="#475569" />
                </View>
              </Pressable>
            </Link>
          </View>

          <Text className="mb-3 mt-8 text-[13px] font-semibold uppercase tracking-wider text-slate-500">
            Latest
          </Text>
          {preview.length === 0 ? (
            <View className="items-center rounded-3xl border border-dashed border-slate-700 py-8">
              <Text className="text-slate-500">Ledger is quiet — create a product or adjust stock.</Text>
            </View>
          ) : (
            preview.map((row, i) => (
              <View
                key={row.id}
                className={`flex-row border-slate-800/80 pb-4 ${i < preview.length - 1 ? 'mb-4 border-b' : ''}`}>
                <View className="mr-3 w-1 self-stretch rounded-full bg-indigo-500/60" />
                <View className="flex-1">
                  <View className="flex-row flex-wrap items-center gap-2">
                    <Text className="text-xs font-bold uppercase tracking-wide text-indigo-300">
                      {typeLabel(row.type)}
                    </Text>
                    <Text className="font-mono text-sm text-slate-500">{row.sku}</Text>
                  </View>
                  <Text className="mt-0.5 text-base font-medium text-white">{row.productName}</Text>
                  <Text className="mt-1 text-xs text-slate-500">
                    {row.delta > 0 ? `+${row.delta}` : row.delta} units · after {row.quantityAfter} ·{' '}
                    {formatWhen(row.createdAt)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
