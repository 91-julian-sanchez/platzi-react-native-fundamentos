import { Alert, FlatList, StyleSheet, View } from "react-native";
import { useEffect, useState, useCallback } from "react";

import Screen from "@/components/Screen";
import QuickAddChips from "@/components/QuickAddChips";
import { useHabits } from "@/context/HabitContext";
import { suggestFor, Suggestion } from "@/services/suggest";
import { useThemeColor } from "@/hooks/use-theme-color";
import ExploreCard from "@/components/ExploreCard";
import { ThemedText } from "@/components/themed-text";

export default function TabTwoScreen() {
  const { addHabit } = useHabits();
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");

  const [energy, setEnergy] = useState<Suggestion[] | null>(null);
  const [focus, setFocus] = useState<Suggestion[] | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [a, b] = await Promise.all([suggestFor("energy"), suggestFor("focus")]);
        if (!mounted) return;
        setEnergy(a);
        setFocus(b);
      } catch (error) {
        console.warn("Error fetching suggestions", error);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const onPick = useCallback(
    (s: Suggestion) => {
      addHabit(s.title, "high");
      Alert.alert("Añadido", `Se creó el hábito: ${s.title}`);
    },
    [addHabit]
  );

  const renderItem = useCallback(
    ({ item }: { item: Suggestion }) => (
      <ExploreCard
        emoji={item.emoji}
        title={item.title}
        subtitle={item.subtitle}
        onPress={() => onPick(item)}
      />
    ),
    [onPick]
  );

  const keyExtractor = useCallback((item: Suggestion) => item.id, []);

  const Section = ({ title, data }: { title: string; data: Suggestion[] | null }) => (
    <View style={{ gap: 8 }}>
      <ThemedText style={{ fontWeight: "700", fontSize: 18, color: text }}>{title}</ThemedText>

      {data ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingRight: 8 }}
        />
      ) : (
        <FlatList
          data={[1, 2, 3]}
          keyExtractor={(x) => String(x)}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingRight: 8 }}
          renderItem={() => <ExploreCard title="Cargando" subtitle="..." />}
        />
      )}
    </View>
  );

  const onPicked = (picked: string) => {
    Alert.alert("Hábitos añadidos", `Se añadieron ${picked.length} hábitos.`);
  };

  return (
    <Screen>
      <View style={{ gap: 12 }}>
        <ThemedText style={{ color: text }}>Sugerencias rápidas</ThemedText>

        <QuickAddChips onPick={onPicked} />

        <ThemedText style={{ marginTop: 16, marginBottom: 8, color: muted }}>
          Hábitos seleccionados:
        </ThemedText>

        <Section title="Energía" data={energy} />
        <Section title="Enfoque" data={focus} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
