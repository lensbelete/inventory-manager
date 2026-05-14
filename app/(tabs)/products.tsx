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

import { useInventory } from '@/context/inventory-context';

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

export default function ProductsScreen() {
  const { products, registerProduct, adjustStock, pending } = useInventory();
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
    setFormOk('Product registered.');
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <ScrollView
          className="flex-1 px-4"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 32 }}>
          <Text className="pt-3 text-2xl font-semibold text-slate-100">Products</Text>
          <Text className="mt-1 text-sm text-slate-400">
            Register a product, then adjust stock. Quantity cannot go below zero.
          </Text>

          <Text className="mb-2 mt-8 text-xs font-medium uppercase tracking-wide text-slate-500">
            Register product
          </Text>
          <View className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <Text className="mb-1 text-xs text-slate-400">SKU</Text>
            <TextInput
              className="mb-3 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 font-mono text-base text-slate-100"
              placeholder="SKU-001"
              placeholderTextColor="#64748b"
              autoCapitalize="characters"
              value={sku}
              onChangeText={setSku}
              editable={!pending}
            />
            <Text className="mb-1 text-xs text-slate-400">Name</Text>
            <TextInput
              className="mb-3 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-base text-slate-100"
              placeholder="Product name"
              placeholderTextColor="#64748b"
              value={name}
              onChangeText={setName}
              editable={!pending}
            />
            <View className="mb-3 flex-row gap-3">
              <View className="flex-1">
                <Text className="mb-1 text-xs text-slate-400">Price (USD)</Text>
                <TextInput
                  className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-base text-slate-100"
                  placeholder="0.00"
                  placeholderTextColor="#64748b"
                  keyboardType="decimal-pad"
                  value={priceStr}
                  onChangeText={setPriceStr}
                  editable={!pending}
                />
              </View>
              <View className="flex-1">
                <Text className="mb-1 text-xs text-slate-400">Quantity</Text>
                <TextInput
                  className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-base text-slate-100"
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
              <Text className="mb-2 text-sm text-red-400" accessibilityRole="alert">
                {formError}
              </Text>
            ) : null}
            {formOk ? <Text className="mb-2 text-sm text-emerald-400">{formOk}</Text> : null}
            <Pressable
              onPress={onCreateProduct}
              disabled={pending}
              className="flex-row items-center justify-center rounded-xl bg-cyan-600 py-3 active:opacity-80 disabled:opacity-40">
              {pending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-center text-base font-semibold text-white">Register product</Text>
              )}
            </Pressable>
          </View>

          <Text className="mb-2 mt-10 text-xs font-medium uppercase tracking-wide text-slate-500">
            Product status & stock
          </Text>
          {products.length === 0 ? (
            <Text className="text-sm text-slate-500">No products yet.</Text>
          ) : null}
          {products.map((p) => (
            <View key={p.id} className="mb-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <View className="flex-row flex-wrap items-baseline justify-between gap-2">
                <Text className="font-mono text-lg font-semibold text-cyan-400">{p.sku}</Text>
                <Text className="text-base font-medium text-slate-100">{formatPrice(p.price)}</Text>
              </View>
              <Text className="mt-1 text-base text-slate-200">{p.name}</Text>
              <Text className="mt-2 text-sm text-slate-300">
                <Text className="text-slate-500">Quantity </Text>
                <Text className="font-semibold text-slate-100">{p.quantity}</Text>
              </Text>
              <Text className="mt-1 text-xs text-slate-500">Last updated: {formatWhen(p.updatedAt)}</Text>

              <Text className="mb-1 mt-4 text-xs text-slate-400">Adjust stock (add / remove)</Text>
              <TextInput
                className="mb-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-base text-slate-100"
                placeholder="Amount"
                placeholderTextColor="#64748b"
                keyboardType="number-pad"
                value={adjustAmounts[p.sku] ?? ''}
                onChangeText={(v) => setAmountFor(p.sku, v)}
                editable={!pending}
              />
              {adjustErrors[p.sku] ? (
                <Text className="mb-2 text-sm text-red-400">{adjustErrors[p.sku]}</Text>
              ) : null}
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => applyDelta(p.sku, 1)}
                  disabled={pending}
                  className="flex-1 items-center rounded-xl bg-emerald-700 py-2.5 active:opacity-80 disabled:opacity-40">
                  <Text className="font-semibold text-white">Add</Text>
                </Pressable>
                <Pressable
                  onPress={() => applyDelta(p.sku, -1)}
                  disabled={pending}
                  className="flex-1 items-center rounded-xl bg-amber-700 py-2.5 active:opacity-80 disabled:opacity-40">
                  <Text className="font-semibold text-white">Remove</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
