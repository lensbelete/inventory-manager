import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AmbientBackdrop, ScreenHeader } from '@/components/layout/app-chrome';
import { useInventory } from '@/context/inventory-context';
import type { TransactionType } from '@/types/inventory';

const PAGE_SIZE = 6;

function labelForType(t: TransactionType): string {
  switch (t) {
    case 'PRODUCT_CREATED':
      return 'Opening';
    case 'STOCK_ADDED':
      return 'Inbound';
    case 'STOCK_REMOVED':
      return 'Outbound';
    default:
      return t;
  }
}

function badgeClass(t: TransactionType): string {
  switch (t) {
    case 'PRODUCT_CREATED':
      return 'bg-violet-500/25 text-violet-200';
    case 'STOCK_ADDED':
      return 'bg-emerald-500/25 text-emerald-200';
    case 'STOCK_REMOVED':
      return 'bg-amber-500/25 text-amber-200';
    default:
      return 'bg-slate-700 text-slate-300';
  }
}

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function HistoryScreen() {
  const { transactions } = useInventory();
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));

  useEffect(() => {
    setPage((p) => Math.max(0, Math.min(p, totalPages - 1)));
  }, [totalPages, transactions.length]);

  const pageItems = useMemo(() => {
    const start = page * PAGE_SIZE;
    return transactions.slice(start, start + PAGE_SIZE);
  }, [transactions, page]);

  const rangeLabel =
    transactions.length === 0
      ? 'No rows'
      : `${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, transactions.length)} · ${transactions.length}`;

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top', 'left', 'right']}>
      <View className="flex-1">
        <AmbientBackdrop />
        <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 36 }}>
          <ScreenHeader
            eyebrow="Audit"
            title="Ledger"
            subtitle="Immutable-style event feed with light pagination — newest entries first."
          />

          <View className="mb-5 rounded-3xl border border-slate-700/60 bg-slate-900/60 p-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500">Window</Text>
                <Text className="mt-1 text-base font-semibold text-white">{rangeLabel}</Text>
              </View>
              <Text className="text-sm text-slate-500">
                {transactions.length === 0 ? '—' : `${page + 1} / ${totalPages}`}
              </Text>
            </View>
            <View className="mt-4 flex-row gap-3">
              <Pressable
                onPress={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page <= 0 || transactions.length === 0}
                className="flex-1 items-center rounded-2xl border border-slate-600/80 bg-slate-950/50 py-3.5 active:opacity-80 disabled:opacity-25">
                <Text className="font-bold text-white">Back</Text>
              </Pressable>
              <Pressable
                onPress={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1 || transactions.length === 0}
                className="flex-1 items-center rounded-2xl border border-slate-600/80 bg-slate-950/50 py-3.5 active:opacity-80 disabled:opacity-25">
                <Text className="font-bold text-white">Forward</Text>
              </Pressable>
            </View>
            {transactions.length > 0 ? (
              <View className="mt-4 flex-row justify-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <View
                    key={i}
                    className={`h-1.5 rounded-full ${i === page ? 'w-6 bg-indigo-400' : 'w-1.5 bg-slate-600'}`}
                  />
                ))}
              </View>
            ) : null}
          </View>

          {transactions.length === 0 ? (
            <View className="items-center rounded-3xl border border-dashed border-slate-700 py-14">
              <Text className="text-center text-base text-slate-400">No ledger rows yet.</Text>
              <Text className="mt-2 max-w-[280px] text-center text-sm text-slate-600">
                Create a product or move stock from Catalog — events land here automatically.
              </Text>
            </View>
          ) : null}

          {pageItems.map((row) => (
            <View
              key={row.id}
              className="mb-4 overflow-hidden rounded-3xl border border-slate-700/55 bg-slate-900/45">
              <View className="flex-row items-start justify-between border-b border-slate-800/80 px-4 py-3">
                <View className={`self-start rounded-full px-3 py-1 ${badgeClass(row.type)}`}>
                  <Text className="text-[11px] font-bold uppercase tracking-wide">
                    {labelForType(row.type)}
                  </Text>
                </View>
                <Text className="max-w-[50%] text-right text-xs text-slate-500">{formatWhen(row.createdAt)}</Text>
              </View>
              <View className="px-4 py-4">
                <Text className="font-mono text-lg font-bold text-white">{row.sku}</Text>
                <Text className="mt-0.5 text-sm text-slate-400">{row.productName}</Text>
                <View className="mt-4 flex-row flex-wrap gap-3">
                  <View className="min-w-[44%] flex-1 rounded-2xl bg-slate-950/55 px-3 py-2">
                    <Text className="text-[10px] font-bold uppercase text-slate-500">Delta</Text>
                    <Text className="text-lg font-bold text-white">
                      {row.delta > 0 ? `+${row.delta}` : row.delta}
                    </Text>
                  </View>
                  <View className="min-w-[44%] flex-1 rounded-2xl bg-slate-950/55 px-3 py-2">
                    <Text className="text-[10px] font-bold uppercase text-slate-500">Balance</Text>
                    <Text className="text-lg font-bold text-white">{row.quantityAfter}</Text>
                  </View>
                </View>
                <Text className="mt-3 text-xs text-slate-500">
                  Actor: <Text className="text-slate-400">{row.performedByLabel}</Text>
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
