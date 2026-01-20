import { useThemeColor } from "@/hooks/use-theme-color";
import { ScrollView } from "react-native";
import { ThemedText } from "./themed-text";
import { StyleSheet, Pressable } from "react-native";

const SUGGETSIONS_HABBIT = [
  "Leer",
  "Escribir",
  "Correr",
  "Caminar",
  "Nadar"
];

export default function QuickAddChips({onPick}: {onPick: (title: string) => void}) {

    const surface = useThemeColor({}, 'surface');
    const border = useThemeColor({}, 'border');
    const text = useThemeColor({}, 'text');

  return (
    <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
            paddingHorizontal: 4,
            gap: 8,
        }}
    >
      {SUGGETSIONS_HABBIT.map((title) => (
        <Pressable
          key={title}
          onPress={() => onPick(title)}
          style={({pressed}) => {[styles.chip, {
            backgroundColor: surface,
            borderColor: border,
            opacity: 0.9,
          }]}}
          android_ripple={{color:border}}
        >
          <ThemedText style={{color: text}}>{title}</ThemedText>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
});
