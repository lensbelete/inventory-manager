import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useInventory } from '@/context/inventory-context';
import type { TransactionType } from '@/types/inventory';

const PAGE_SIZE = 6;

function labelForType(t: TransactionType): string {
  switch (t) {
    case 'PRODUCT_CREATED':
      return 'Product created';
    case 'STOCK_ADDED':
      return 'Stock added';
    case 'STOCK_REMOVED':
      return 'Stock removed';
    default:
      return t;
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
      ? '0 of 0'
      : `${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, transactions.length)} of ${transactions.length}`;

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top', 'left', 'right']}>
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 28 }}>
        <Text className="pt-3 text-2xl font-semibold text-slate-100">Transaction history</Text>
        <Text className="mt-1 text-sm text-slate-400">Newest first. Simple pagination below.</Text>

        <View className="mt-4 flex-row items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5">
          <Text className="text-sm text-slate-400">{rangeLabel}</Text>
          <Text className="text-xs text-slate-500">
            Page {transactions.length === 0 ? 0 : page + 1} / {transactions.length === 0 ? 0 : totalPages}
          </Text>
        </View>

        <View className="mt-3 flex-row gap-2">
          <Pressable
            onPress={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page <= 0 || transactions.length === 0}
            className="flex-1 items-center rounded-xl border border-slate-700 bg-slate-900 py-3 active:opacity-80 disabled:opacity-30">
            <Text className="font-semibold text-slate-100">Previous</Text>
          </Pressable>
          <Pressable
            onPress={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1 || transactions.length === 0}
            className="flex-1 items-center rounded-xl border border-slate-700 bg-slate-900 py-3 active:opacity-80 disabled:opacity-30">
            <Text className="font-semibold text-slate-100">Next</Text>
          </Pressable>
        </View>

        {transactions.length === 0 ? (
          <Text className="mt-8 text-center text-sm text-slate-500">No transactions yet.</Text>
        ) : null}

        {pageItems.map((row) => (
          <View key={row.id} className="mt-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <Text className="text-xs font-medium uppercase tracking-wide text-cyan-500">
              {labelForType(row.type)}
            </Text>
            <Text className="mt-1 font-mono text-base text-slate-100">{row.sku}</Text>
            <Text className="text-sm text-slate-400">{row.productName}</Text>
            <Text className="mt-2 text-sm text-slate-300">
              Change:{' '}
              <Text className="font-semibold text-slate-100">
                {row.delta > 0 ? `+${row.delta}` : row.delta}
              </Text>
              {' · '}
              Quantity after: <Text className="font-semibold text-slate-100">{row.quantityAfter}</Text>
            </Text>
            <Text className="mt-1 text-xs text-slate-500">{formatWhen(row.createdAt)}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
