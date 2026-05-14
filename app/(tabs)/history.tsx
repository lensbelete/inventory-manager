import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/ui/empty-state';
import { PanelCard } from '@/components/ui/panel-card';
import { ScreenIntro } from '@/components/ui/screen-intro';
import { ScreenShell } from '@/components/ui/screen-shell';
import { SectionHeading } from '@/components/ui/section-heading';
import { useInventory } from '@/context/inventory-context';
import type { TransactionType } from '@/types/inventory';
import { hapticLight } from '@/utils/haptics';

const PAGE_SIZE = 6;
const ACCENT = '#ffd88a';

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

function badgeTone(t: TransactionType): { fg: string; bg: string; icon: keyof typeof Ionicons.glyphMap } {
  switch (t) {
    case 'PRODUCT_CREATED':
      return { fg: '#c4b4ff', bg: 'rgba(196,180,255,0.16)', icon: 'sparkles-outline' };
    case 'STOCK_ADDED':
      return { fg: '#58e0a8', bg: 'rgba(88,224,168,0.14)', icon: 'trending-up-outline' };
    case 'STOCK_REMOVED':
      return { fg: '#f0cf7a', bg: 'rgba(240,207,122,0.14)', icon: 'trending-down-outline' };
    default:
      return { fg: '#41d9ec', bg: 'rgba(65,217,236,0.12)', icon: 'document-text-outline' };
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
    <ScreenShell variant="history">
      <SafeAreaView className="flex-1 bg-transparent" edges={['bottom', 'left', 'right']}>
        <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
          <ScreenIntro tint="amber">
            Ledger of stock changes — newest first. Use the pager to skim older activity.
          </ScreenIntro>

          <View className="mt-5 overflow-hidden rounded-2xl border border-cool-border/70">
            <LinearGradient
              colors={['rgba(255,216,138,0.22)', 'rgba(57,71,87,0.92)'] as const}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.pagerStripe}>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <View className="rounded-full bg-cool-bg/45 p-1.5">
                    <Ionicons name="layers-outline" size={20} color={ACCENT} />
                  </View>
                  <Text className="text-[15px] font-semibold text-cool-muted">{rangeLabel}</Text>
                </View>
                <View className="rounded-full border border-cool-border/60 bg-cool-bg/50 px-3 py-1.5">
                  <Text className="text-[12px] font-bold uppercase tracking-wide text-cool-subtle">
                    Page {transactions.length === 0 ? 0 : page + 1}/{transactions.length === 0 ? 0 : totalPages}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View className="mt-4 flex-row gap-3">
            <Pressable
              onPress={() => {
                if (page <= 0 || transactions.length === 0) return;
                hapticLight();
                setPage((p) => Math.max(0, p - 1));
              }}
              disabled={page <= 0 || transactions.length === 0}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-cool-border bg-cool-elevated py-[14px] active:opacity-85 disabled:opacity-30">
              <Ionicons name="chevron-back" size={20} color="#aabdc8" />
              <Text className="text-[15px] font-bold text-cool">Previous</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                if (page >= totalPages - 1 || transactions.length === 0) return;
                hapticLight();
                setPage((p) => Math.min(totalPages - 1, p + 1));
              }}
              disabled={page >= totalPages - 1 || transactions.length === 0}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-cool-border bg-cool-elevated py-[14px] active:opacity-85 disabled:opacity-30">
              <Text className="text-[15px] font-bold text-cool">Next</Text>
              <Ionicons name="chevron-forward" size={20} color="#aabdc8" />
            </Pressable>
          </View>

          {transactions.length === 0 ? (
            <EmptyState
              icon="receipt-outline"
              title="Nothing in the ledger yet"
              subtitle="Create products or adjust stock — each action will appear here with timestamps."
              accentColors={['rgba(255,216,138,0.38)', 'rgba(120,90,44,0.12)']}
              iconTint={ACCENT}
            />
          ) : (
            <>
              <SectionHeading
                label="Activity feed"
                accent={ACCENT}
                count={pageItems.length}
                className="mb-3 mt-10"
              />
              {pageItems.map((row) => {
                const badge = badgeTone(row.type);
                return (
                  <PanelCard key={row.id} accent={ACCENT} containerClassName="mt-3">
                    <View className="flex-row flex-wrap items-center gap-2">
                      <View
                        className="flex-row items-center gap-1.5 rounded-full px-3 py-1.5"
                        style={{ backgroundColor: badge.bg }}>
                        <Ionicons name={badge.icon} size={14} color={badge.fg} />
                        <Text className="text-[11px] font-bold uppercase tracking-wide" style={{ color: badge.fg }}>
                          {labelForType(row.type)}
                        </Text>
                      </View>
                    </View>
                    <Text className="mt-3 font-mono text-[16px] font-semibold text-cool">{row.sku}</Text>
                    <Text className="mt-1 text-[15px] text-cool-muted">{row.productName}</Text>
                    <Text className="mt-4 text-[15px] leading-[22px] text-cool-muted">
                      Change:{' '}
                      <Text className="font-bold text-cool">
                        {row.delta > 0 ? `+${row.delta}` : row.delta}
                      </Text>
                      {' · '}
                      Balance <Text className="font-bold text-cool">{row.quantityAfter}</Text>
                    </Text>
                    <View className="mt-4 flex-row items-center gap-1.5">
                      <Ionicons name="time-outline" size={14} color="#8499a8" />
                      <Text className="text-[13px] text-cool-subtle">{formatWhen(row.createdAt)}</Text>
                    </View>
                  </PanelCard>
                );
              })}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  pagerStripe: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
});
