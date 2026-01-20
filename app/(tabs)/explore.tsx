import { Image } from 'expo-image';
import { FlatList, Platform, StyleSheet, View } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useState } from 'react';
import Screen from '@/components/Screen';
import QuickAddChips from '@/components/QuickAddChips';

export default function TabTwoScreen() {
  const [picked, setPicked] = useState<string[]>([]);

  const onPicked = (t: string) => {
    setPicked((prev)=> (prev?.includes(t) ? prev : [t, ...prev]));
  }
  return (
    <Screen>
      <View>
        <ThemedText>Sugerencias rapidas </ThemedText>
        <QuickAddChips onPick={onPicked} />
        <ThemedText style={{marginTop: 16, marginBottom: 8}}>Habitos seleccionados:</ThemedText>
        <FlatList data={picked} 
          renderItem={
            ({item}) =>  <ThemedText>{item}</ThemedText>
          }
          ListEmptyComponent={
            <ThemedText>Toca para añadir</ThemedText>
          } />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
