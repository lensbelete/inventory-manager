import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormModal } from '@/components/ui/form-modal';
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
          onPress={() => setAddOpen(true)}
          className="mr-3 p-1"
          accessibilityRole="button"
          accessibilityLabel="Register product">
          <Ionicons name="add-circle-outline" size={26} color="#b8c9d6" />
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
    const res = await adjustStock(adjustProduct.sku, sign * n);
    if (!res.ok) {
      setAdjError(res.error);
      return;
    }
    closeAdjust();
  }

  return (
    <SafeAreaView className="flex-1 bg-cool-bg" edges={['bottom', 'left', 'right']}>
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
        <Text className="pt-2 text-sm text-cool-muted">
          Product status: SKU, quantity, and last updated. Use + to register; adjust stock from each row.
        </Text>

        {products.length === 0 ? (
          <Text className="mt-10 text-center text-sm text-cool-subtle">No products yet.</Text>
        ) : (
          <>
            <Text className="mb-2 mt-8 text-xs font-semibold uppercase tracking-wide text-cool-subtle">
              Products
            </Text>
            {products.map((p) => (
              <View key={p.id} className="mb-3 rounded-xl border border-cool-border bg-cool-surface p-4">
                <View className="flex-row flex-wrap items-baseline justify-between gap-2">
                  <Text className="font-mono text-lg font-semibold text-cool-accent">{p.sku}</Text>
                  <Text className="text-base font-medium text-cool">{formatPrice(p.price)}</Text>
                </View>
                <Text className="mt-1 text-base text-cool-muted">{p.name}</Text>
                <Text className="mt-2 text-sm">
                  <Text className="text-cool-subtle">Quantity </Text>
                  <Text className="font-semibold text-cool">{p.quantity}</Text>
                </Text>
                <Text className="mt-1 text-xs text-cool-subtle">Last updated: {formatWhen(p.updatedAt)}</Text>
                <Pressable
                  onPress={() => {
                    setAdjustSku(p.sku);
                    setAdjAmount('');
                    setAdjError(null);
                  }}
                  className="mt-4 items-center rounded-xl border border-cool-line bg-cool-elevated py-2.5 active:opacity-90">
                  <Text className="text-sm font-semibold text-cool">Adjust stock</Text>
                </Pressable>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <FormModal visible={addOpen} title="Register product" onClose={closeAdd}>
        <Text className="mb-1 text-xs font-medium text-cool-muted">SKU</Text>
        <TextInput
          className="mb-4 rounded-xl border border-cool-border bg-cool-bg px-3 py-2.5 font-mono text-base text-cool"
          placeholder="SKU-001"
          placeholderTextColor="#5a6b7c"
          autoCapitalize="characters"
          value={sku}
          onChangeText={setSku}
          editable={!pending}
        />
        <Text className="mb-1 text-xs font-medium text-cool-muted">Name</Text>
        <TextInput
          className="mb-4 rounded-xl border border-cool-border bg-cool-bg px-3 py-2.5 text-base text-cool"
          placeholder="Product name"
          placeholderTextColor="#5a6b7c"
          value={name}
          onChangeText={setName}
          editable={!pending}
        />
        <View className="mb-4 flex-row gap-3">
          <View className="flex-1">
            <Text className="mb-1 text-xs font-medium text-cool-muted">Price (USD)</Text>
            <TextInput
              className="rounded-xl border border-cool-border bg-cool-bg px-3 py-2.5 text-base text-cool"
              placeholder="0.00"
              placeholderTextColor="#5a6b7c"
              keyboardType="decimal-pad"
              value={priceStr}
              onChangeText={setPriceStr}
              editable={!pending}
            />
          </View>
          <View className="flex-1">
            <Text className="mb-1 text-xs font-medium text-cool-muted">Quantity</Text>
            <TextInput
              className="rounded-xl border border-cool-border bg-cool-bg px-3 py-2.5 text-base text-cool"
              placeholder="0"
              placeholderTextColor="#5a6b7c"
              keyboardType="number-pad"
              value={qtyStr}
              onChangeText={setQtyStr}
              editable={!pending}
            />
          </View>
        </View>
        {formError ? (
          <Text className="mb-3 text-sm text-rose-400/90" accessibilityRole="alert">
            {formError}
          </Text>
        ) : null}
        <Pressable
          onPress={onCreateProduct}
          disabled={pending}
          className="items-center rounded-xl bg-cool-accent py-3.5 active:opacity-90 disabled:opacity-40">
          {pending ? (
            <ActivityIndicator color="#0a0e14" />
          ) : (
            <Text className="text-base font-semibold text-cool-deep">Register product</Text>
          )}
        </Pressable>
      </FormModal>

      <FormModal
        visible={adjustSku !== null}
        title={adjustProduct ? `Stock · ${adjustProduct.sku}` : 'Adjust stock'}
        onClose={closeAdjust}>
        {adjustProduct ? (
          <>
            <Text className="mb-4 text-sm text-cool-muted">{adjustProduct.name}</Text>
            <Text className="mb-1 text-xs font-medium text-cool-muted">Units</Text>
            <TextInput
              className="mb-3 rounded-xl border border-cool-border bg-cool-bg px-3 py-2.5 text-base text-cool"
              placeholder="Amount"
              placeholderTextColor="#5a6b7c"
              keyboardType="number-pad"
              value={adjAmount}
              onChangeText={(v) => {
                setAdjAmount(v);
                setAdjError(null);
              }}
              editable={!pending}
            />
            {adjError ? <Text className="mb-3 text-sm text-rose-400/90">{adjError}</Text> : null}
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => applyDelta(1)}
                disabled={pending}
                className="flex-1 items-center rounded-xl bg-cool-ok/50 py-3 active:opacity-90 disabled:opacity-40">
                <Text className="font-semibold text-cool">Add</Text>
              </Pressable>
              <Pressable
                onPress={() => applyDelta(-1)}
                disabled={pending}
                className="flex-1 items-center rounded-xl bg-cool-warn/45 py-3 active:opacity-90 disabled:opacity-40">
                <Text className="font-semibold text-cool">Remove</Text>
              </Pressable>
            </View>
          </>
        ) : null}
      </FormModal>
    </SafeAreaView>
  );
}
