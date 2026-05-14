import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/ui/empty-state';
import { FormModal } from '@/components/ui/form-modal';
import { GradientCta } from '@/components/ui/gradient-cta';
import { PanelCard } from '@/components/ui/panel-card';
import { ScreenIntro } from '@/components/ui/screen-intro';
import { ScreenShell } from '@/components/ui/screen-shell';
import { SectionHeading } from '@/components/ui/section-heading';
import { useInventory } from '@/context/inventory-context';
import { hapticLight } from '@/utils/haptics';

function formatPrice(n: number): string {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

const HEADER_ACCENT = '#c4b4ff';
const ACCENT = '#c4b4ff';

export default function ProductsScreen() {
  const navigation = useNavigation();
  const { products, registerProduct, adjustStock, pending } = useInventory();

  const [addOpen, setAddOpen] = useState(false);
  const [adjustSku, setAdjustSku] = useState<string | null>(null);

  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [priceStr, setPriceStr] = useState('');
  const [qtyStr, setQtyStr] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const [adjAmount, setAdjAmount] = useState('');
  const [adjError, setAdjError] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => {
            hapticLight();
            setAddOpen(true);
          }}
          className="mr-1 rounded-full bg-[#c4b4ff]/16 p-2 active:opacity-80"
          accessibilityRole="button"
          accessibilityLabel="Register product">
          <Ionicons name="add" size={26} color={HEADER_ACCENT} />
        </Pressable>
      ),
    });
  }, [navigation]);

  const adjustProduct = adjustSku ? products.find((p) => p.sku === adjustSku) : undefined;

  function closeAdd() {
    setAddOpen(false);
    setFormError(null);
    setSku('');
    setName('');
    setPriceStr('');
    setQtyStr('');
  }

  function closeAdjust() {
    setAdjustSku(null);
    setAdjAmount('');
    setAdjError(null);
  }

  async function onCreateProduct() {
    setFormError(null);
    const price = Number(priceStr);
    const quantity = Number(qtyStr);
    if (priceStr.trim() === '' || Number.isNaN(price)) {
      setFormError('Enter a valid price.');
      return;
    }
    if (qtyStr.trim() === '' || Number.isNaN(quantity)) {
      setFormError('Enter a valid quantity.');
      return;
    }
    if (!Number.isInteger(quantity)) {
      setFormError('Quantity must be a whole number.');
      return;
    }
    const res = await registerProduct(sku, name, price, quantity);
    if (!res.ok) {
      setFormError(res.error);
      return;
    }
    closeAdd();
  }

  async function applyDelta(sign: 1 | -1) {
    if (!adjustProduct) return;
    setAdjError(null);
    const n = Math.trunc(Number(adjAmount));
    if (adjAmount.trim() === '' || Number.isNaN(n) || n <= 0) {
      setAdjError('Enter a positive whole number.');
      return;
    }
    hapticLight();
    const res = await adjustStock(adjustProduct.sku, sign * n);
    if (!res.ok) {
      setAdjError(res.error);
      return;
    }
    closeAdjust();
  }

  const inputCn =
    'rounded-2xl border border-cool-border/85 bg-cool-bg/90 px-3.5 py-3 text-[17px] text-cool placeholder:text-cool-subtle';

  return (
    <ScreenShell variant="products">
      <SafeAreaView className="flex-1 bg-transparent" edges={['bottom', 'left', 'right']}>
        <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 36 }}>
          <ScreenIntro tint="violet">
            SKUs, price, quantity, and freshness at a glance. Use + for new items — adjust quantities from each
            row.
          </ScreenIntro>

          {products.length === 0 ? (
            <EmptyState
              icon="cube-outline"
              title="Catalog is empty"
              subtitle="Register a product with SKU, name, price, and starting stock."
              accentColors={['rgba(196,180,255,0.35)', 'rgba(100,84,180,0.12)']}
              iconTint="#c4b4ff"
            />
          ) : (
            <>
              <SectionHeading label="Inventory" accent={ACCENT} count={products.length} className="mb-3 mt-9" />
              {products.map((p) => (
                <PanelCard key={p.id} accent={ACCENT} containerClassName="mb-4">
                  <View className="flex-row flex-wrap items-start justify-between gap-2">
                    <View className="min-w-[48%] flex-1 flex-row flex-wrap items-center gap-2">
                      <Text className="font-mono text-lg font-bold text-[#c4b4ff]">{p.sku}</Text>
                      <View className="rounded-full border border-cool-border/50 bg-cool-bg/55 px-2.5 py-1">
                        <Text className="text-xs font-bold text-cool">{p.quantity} in stock</Text>
                      </View>
                    </View>
                    <Text className="text-lg font-semibold tracking-tight text-cool">{formatPrice(p.price)}</Text>
                  </View>
                  <Text className="mt-2 text-[16px] text-cool-muted">{p.name}</Text>
                  <Text className="mt-3 text-[13px] text-cool-subtle">Updated {formatWhen(p.updatedAt)}</Text>
                  <Pressable
                    onPress={() => {
                      hapticLight();
                      setAdjustSku(p.sku);
                      setAdjAmount('');
                      setAdjError(null);
                    }}
                    className="mt-4 flex-row items-center justify-center gap-2 rounded-2xl border border-cool-line/90 bg-cool-elevated py-3.5 active:opacity-85">
                    <Ionicons name="swap-vertical" size={18} color="#aabdc8" />
                    <Text className="text-[15px] font-bold text-cool">Adjust stock</Text>
                  </Pressable>
                </PanelCard>
              ))}
            </>
          )}
        </ScrollView>

        <FormModal visible={addOpen} title="New product" onClose={closeAdd}>
          <Text className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-cool-subtle">SKU</Text>
          <TextInput
            className={`mb-4 font-mono ${inputCn}`}
            placeholder="SKU-001"
            placeholderTextColor="#8499a8"
            autoCapitalize="characters"
            value={sku}
            onChangeText={setSku}
            editable={!pending}
          />
          <Text className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-cool-subtle">Name</Text>
          <TextInput
            className={`mb-4 ${inputCn}`}
            placeholder="Desk lamp"
            placeholderTextColor="#8499a8"
            value={name}
            onChangeText={setName}
            editable={!pending}
          />
          <View className="mb-4 flex-row gap-3">
            <View className="flex-1">
              <Text className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-cool-subtle">
                Price (USD)
              </Text>
              <TextInput
                className={inputCn}
                placeholder="0.00"
                placeholderTextColor="#8499a8"
                keyboardType="decimal-pad"
                value={priceStr}
                onChangeText={setPriceStr}
                editable={!pending}
              />
            </View>
            <View className="flex-1">
              <Text className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-cool-subtle">Qty</Text>
              <TextInput
                className={inputCn}
                placeholder="0"
                placeholderTextColor="#8499a8"
                keyboardType="number-pad"
                value={qtyStr}
                onChangeText={setQtyStr}
                editable={!pending}
              />
            </View>
          </View>
          {formError ? (
            <Text className="mb-4 rounded-xl bg-rose-500/14 px-3 py-3 text-[15px] text-rose-300" accessibilityRole="alert">
              {formError}
            </Text>
          ) : null}
          <GradientCta onPress={onCreateProduct} label="Register product" disabled={pending} loading={pending} />
        </FormModal>

        <FormModal
          visible={adjustSku !== null}
          title={adjustProduct ? `Adjust · ${adjustProduct.sku}` : 'Adjust stock'}
          onClose={closeAdjust}>
          {adjustProduct ? (
            <>
              <Text className="mb-5 text-[16px] leading-6 text-cool-muted">{adjustProduct.name}</Text>
              <Text className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-cool-subtle">Units</Text>
              <TextInput
                className={`mb-4 ${inputCn}`}
                placeholder="Amount"
                placeholderTextColor="#8499a8"
                keyboardType="number-pad"
                value={adjAmount}
                onChangeText={(v) => {
                  setAdjAmount(v);
                  setAdjError(null);
                }}
                editable={!pending}
              />
              {adjError ? (
                <Text className="mb-4 rounded-xl bg-rose-500/14 px-3 py-3 text-[15px] text-rose-300">{adjError}</Text>
              ) : null}
              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => applyDelta(1)}
                  disabled={pending}
                  className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-cool-ok/55 bg-cool-ok/20 py-[14px] active:opacity-90 disabled:opacity-40">
                  <Ionicons name="add-circle-outline" size={22} color="#58e0a8" />
                  <Text className="text-[16px] font-bold text-cool">Add</Text>
                </Pressable>
                <Pressable
                  onPress={() => applyDelta(-1)}
                  disabled={pending}
                  className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-cool-warn/55 bg-cool-warn/18 py-[14px] active:opacity-90 disabled:opacity-40">
                  <Ionicons name="remove-circle-outline" size={22} color="#f0cf7a" />
                  <Text className="text-[16px] font-bold text-cool">Remove</Text>
                </Pressable>
              </View>
            </>
          ) : null}
        </FormModal>
      </SafeAreaView>
    </ScreenShell>
  );
}
