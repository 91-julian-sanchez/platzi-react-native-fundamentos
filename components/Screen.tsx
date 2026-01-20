import { useThemeColor } from "@/hooks/use-theme-color";
import { useTheme } from "@react-navigation/native";
import { View, StyleSheet } from "react-native";
import { ThemedView } from "./themed-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
    children?: React.ReactNode;
}

export default function Screen({ children }: Props) {
    const bg = useThemeColor({}, 'background');
    const insets = useSafeAreaInsets();
    return (
        <ThemedView style={[styles.screen, { 
            backgroundColor: bg, 
            padding: 16, 
            paddingTop: insets.top + 20, 
            paddingBottom: insets.bottom + 20 }]}>
            {children}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 16,
  },
});
