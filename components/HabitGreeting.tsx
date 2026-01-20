import { View, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';

export default function HabitGreeting({name=""}) {
   const date = new Date();
   const hour = date.getHours();
   let greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';

   return (
    <View style={styles.container}>
        <ThemedText style={styles.title}>
          {greeting} {name ? `${name}` : ''}
        </ThemedText>
        <ThemedText style={styles.subtitle}>
            Hoy es {date.toLocaleDateString()} - {date.toLocaleTimeString()}
        </ThemedText>
    </View>
   );   
}

const styles = StyleSheet.create({
  container: { gap:4 ,padding: 16 },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { fontSize: 12, color: '#475569'},
});