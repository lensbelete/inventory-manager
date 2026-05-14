import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AmbientBackdrop, ScreenHeader, SegmentToggle } from '@/components/layout/app-chrome';
import { useInventory } from '@/context/inventory-context';

function formatPrice(n: number): string {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
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

type Segment = 'add' | 'inventory';

export default function ProductsScreen() {
  const { products, registerProduct, adjustStock, pending } = useInventory();
  const [segment, setSegment] = useState<Segment>(products.length ? 'inventory' : 'add');
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [priceStr, setPriceStr] = useState('');
  const [qtyStr, setQtyStr] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formOk, setFormOk] = useState<string | null>(null);

  const [adjustAmounts, setAdjustAmounts] = useState<Record<string, string>>({});
  const [adjustErrors, setAdjustErrors] = useState<Record<string, string | null>>({});

  async function onCreateProduct() {
    setFormError(null);
    setFormOk(null);
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
    setSku('');
    setName('');
    setPriceStr('');
    setQtyStr('');
    setFormOk('Product saved.');
    setSegment('inventory');
  }

  function setAmountFor(skuKey: string, value: string) {
    setAdjustAmounts((prev) => ({ ...prev, [skuKey]: value }));
    setAdjustErrors((prev) => ({ ...prev, [skuKey]: null }));
  }

  async function applyDelta(skuKey: string, sign: 1 | -1) {
    const raw = adjustAmounts[skuKey] ?? '';
    const n = Math.trunc(Number(raw));
    if (raw.trim() === '' || Number.isNaN(n) || n <= 0) {
      setAdjustErrors((prev) => ({ ...prev, [skuKey]: 'Enter a positive whole number.' }));
      return;
    }
    const res = await adjustStock(skuKey, sign * n);
    if (!res.ok) {
      setAdjustErrors((prev) => ({ ...prev, [skuKey]: res.error }));
      return;
    }
    setAmountFor(skuKey, '');
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top', 'left', 'right']}>
      <View className="flex-1">
        <AmbientBackdrop />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1">
          <ScrollView
            className="flex-1 px-5"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 40 }}>
            <ScreenHeader
              eyebrow="Catalog"
              title="Inventory"
              subtitle="Split view: onboard a SKU, then manage bins and levels."
            />

            <SegmentToggle<Segment>
              value={segment}
              onChange={setSegment}
              options={[
                { key: 'add', label: 'New SKU' },
                { key: 'inventory', label: 'On hand' },
              ]}
            />

            {segment === 'add' ? (
              <View className="rounded-3xl border border-slate-700/60 bg-slate-900/70 p-5">
                <Text className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-slate-500">
                  Product intake
                </Text>
                <Text className="mb-1.5 text-xs font-medium text-slate-400">SKU</Text>
                <TextInput
                  className="mb-4 rounded-2xl border border-slate-700/80 bg-slate-950/80 px-4 py-3.5 font-mono text-base text-white"
                  placeholder="INV-1001"
                  placeholderTextColor="#64748b"
                  autoCapitalize="characters"
                  value={sku}
                  onChangeText={setSku}
                  editable={!pending}
                />
                <Text className="mb-1.5 text-xs font-medium text-slate-400">Display name</Text>
                <TextInput
                  className="mb-4 rounded-2xl border border-slate-700/80 bg-slate-950/80 px-4 py-3.5 text-base text-white"
                  placeholder="Hand towel — slate"
                  placeholderTextColor="#64748b"
                  value={name}
                  onChangeText={setName}
                  editable={!pending}
                />
                <View className="mb-4 flex-row gap-3">
                  <View className="flex-1">
                    <Text className="mb-1.5 text-xs font-medium text-slate-400">Price (USD)</Text>
                    <TextInput
                      className="rounded-2xl border border-slate-700/80 bg-slate-950/80 px-4 py-3.5 text-base text-white"
                      placeholder="24.00"
                      placeholderTextColor="#64748b"
                      keyboardType="decimal-pad"
                      value={priceStr}
                      onChangeText={setPriceStr}
                      editable={!pending}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="mb-1.5 text-xs font-medium text-slate-400">Opening qty</Text>
                    <TextInput
                      className="rounded-2xl border border-slate-700/80 bg-slate-950/80 px-4 py-3.5 text-base text-white"
                      placeholder="0"
                      placeholderTextColor="#64748b"
                      keyboardType="number-pad"
                      value={qtyStr}
                      onChangeText={setQtyStr}
                      editable={!pending}
                    />
                  </View>
                </View>
                {formError ? (
                  <Text className="mb-3 text-sm text-rose-400" accessibilityRole="alert">
                    {formError}
                  </Text>
                ) : null}
                {formOk ? <Text className="mb-3 text-sm text-emerald-400">{formOk}</Text> : null}
                <Pressable
                  onPress={onCreateProduct}
                  disabled={pending}
                  className="items-center rounded-2xl bg-cyan-600 py-4 active:bg-cyan-500 disabled:opacity-40">
                  {pending ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-base font-bold text-white">Save to shelf</Text>
                  )}
                </Pressable>
              </View>
            ) : products.length === 0 ? (
              <View className="items-center rounded-3xl border border-dashed border-slate-700 py-12">
                <Text className="text-center text-slate-500">Shelf is empty.</Text>
                <Text className="mt-1 text-center text-sm text-slate-600">Switch to New SKU to create one.</Text>
                <Pressable
                  onPress={() => setSegment('add')}
                  className="mt-5 rounded-2xl border border-indigo-500/50 bg-indigo-950/40 px-6 py-3 active:opacity-90">
                  <Text className="font-semibold text-indigo-200">Go to intake</Text>
                </Pressable>
              </View>
            ) : (
              <View>
                <Text className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-slate-500">
                  Live positions
                </Text>
                {products.map((p) => (
                  <View
                    key={p.id}
                    className="mb-4 overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-900/50">
                    <View className="border-b border-slate-800/80 px-4 pb-3 pt-4">
                      <View className="flex-row flex-wrap items-start justify-between gap-2">
                        <Text className="font-mono text-lg font-bold text-cyan-300">{p.sku}</Text>
                        <Text className="rounded-full bg-slate-950/80 px-3 py-1 text-sm font-semibold text-white">
                          {formatPrice(p.price)}
                        </Text>
                      </View>
                      <Text className="mt-1 text-base font-medium text-slate-200">{p.name}</Text>
                      <View className="mt-3 flex-row flex-wrap gap-3">
                        <View className="rounded-xl bg-slate-950/60 px-3 py-2">
                          <Text className="text-[10px] font-bold uppercase text-slate-500">Qty</Text>
                          <Text className="text-xl font-bold text-white">{p.quantity}</Text>
                        </View>
                        <View className="flex-1 justify-center rounded-xl bg-slate-950/40 px-3 py-2">
                          <Text className="text-[10px] font-bold uppercase text-slate-500">Updated</Text>
                          <Text className="text-sm text-slate-400">{formatWhen(p.updatedAt)}</Text>
                        </View>
                      </View>
                    </View>
                    <View className="px-4 py-4">
                      <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Movement
                      </Text>
                      <TextInput
                        className="mb-2 rounded-2xl border border-slate-700/80 bg-slate-950/60 px-4 py-3 text-base text-white"
                        placeholder="Units"
                        placeholderTextColor="#64748b"
                        keyboardType="number-pad"
                        value={adjustAmounts[p.sku] ?? ''}
                        onChangeText={(v) => setAmountFor(p.sku, v)}
                        editable={!pending}
                      />
                      {adjustErrors[p.sku] ? (
                        <Text className="mb-2 text-sm text-rose-400">{adjustErrors[p.sku]}</Text>
                      ) : null}
                      <View className="flex-row gap-3">
                        <Pressable
                          onPress={() => applyDelta(p.sku, 1)}
                          disabled={pending}
                          className="flex-1 items-center rounded-2xl bg-emerald-600/90 py-3.5 active:opacity-90 disabled:opacity-40">
                          <Text className="font-bold text-white">Receive</Text>
                        </Pressable>
                        <Pressable
                          onPress={() => applyDelta(p.sku, -1)}
                          disabled={pending}
                          className="flex-1 items-center rounded-2xl bg-amber-600/90 py-3.5 active:opacity-90 disabled:opacity-40">
                          <Text className="font-bold text-white">Issue</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}
