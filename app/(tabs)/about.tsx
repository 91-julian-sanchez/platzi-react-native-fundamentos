import { View, Text, StyleSheet } from 'react-native';
import Screen from '@/components/Screen';
export default function About() {
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.titulo}>Sobre mi.</Text>
        <Text style={styles.subtitulo}>Vamos por esa constancia.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // centra verticalmente.
    alignItems: 'center',      // centra horizontalmente.
    backgroundColor: '#f0f0f0',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitulo: {
    fontSize: 18,
    color: '#666',
  },
});