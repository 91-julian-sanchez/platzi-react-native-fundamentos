import { useThemeColor } from "@/hooks/use-theme-color";
import { useTheme } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
    title: string;
    streak: number;
    isCompleted?: boolean;
    priority?: 'low' | 'mid' | 'high';
    onToggle?: () => void;
};

const priorityStyles = {
  low: {
    backgroundColor: "#ECFCCB",
    color: "#3F6212",
  },
  mid: {
    backgroundColor: "#FEF9C3",
    color: "#92400E",
  },
  high: {
    backgroundColor: "#FFE4E6",
    color: "#9F1239",
  },
} as const;


export default function HabitCard({
    title, 
    streak,
    isCompleted = false,   
    priority = 'mid' ,
    onToggle,
}: Props){
    const surface = useThemeColor({}, 'surface');
    const success = useThemeColor({}, 'success');
    const border = useThemeColor({}, 'border');

    const priorityStyle = priorityStyles[priority];
    return (
        <Pressable 
            onPress={onToggle} 
            style={({pressed})=>[styles.card,
                {
                    backgroundColor: surface,
                    opacity: pressed ? 0.7 : 1,
                    borderColor: isCompleted ? success : border,
                },
                isCompleted && styles.cardDone
            ]}
            >
            <View style={styles.row}>
                <Text style={styles.title}>{title}</Text>
                <Text style={[styles.badge, {backgroundColor: priorityStyle.backgroundColor, color: priorityStyle.color, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8  }]}>
                    {priority}
                </Text>
            </View>
            <View style={styles.row}>
                {isCompleted && <Text style={styles.badge}>✓ Hoy</Text>}
                <Text style={styles.streak}>🔥 {streak} días</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 12, backgroundColor: '#222' },
  cardDone: { backgroundColor: '#2e7d32' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#fff', fontWeight: '600' },
  badge: { color: '#fff', fontSize: 16 },
  streak: { color: '#ccc', marginTop: 8 },
});
