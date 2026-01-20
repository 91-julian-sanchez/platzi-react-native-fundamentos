import HabitCard from '@/components/HabitCard';
import HabitGreeting from '@/components/HabitGreeting';
import ProfileHeader from '@/components/ProfileHeader';
import Screen from '@/components/Screen';
import { StyleSheet, View , TextInput, Pressable, ScrollView, ListRenderItemInfo, FlatList} from 'react-native';
import { useCallback, useMemo, useState } from "react";
import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '@/components/themed-text';
import PrimaryButton from '@/components/PrimaryButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Habit = {
  id: string;
  title: string;
  streak: number;
  isCompleted: boolean;
  priority?: "low" | "mid" | "high";
};

const HABIT_INITIAL: Habit[] = [
    {
      id: 'h1',
      title: 'Correr',
      streak: 3,
      isCompleted: true,
      priority: 'mid',
    },
    {
      id: 'h2',
      title: 'Leer',
      streak: 7,
      isCompleted: false,
      priority: 'low',
    },
    {
      id: 'h3',
      title: 'Meditar',
      streak: 5,
      isCompleted: false,
      priority: 'high',
    },
    {
      id: 'h4',
      title: 'Hacer desayuno',
      streak: 0,
      isCompleted: false,
      priority: 'high',
    }
  ];

export default function HomeScreen() {
  const [items, setItems] = useState<Habit[]>(HABIT_INITIAL);
  const [newItem, setNewItem] = useState('');
  const insets = useSafeAreaInsets()

  const border = useThemeColor({}, 'border');
  const surface = useThemeColor({}, 'surface');
  const primary = useThemeColor({}, 'primary');
  const onPrimary = useThemeColor({}, 'onPrimary');
  const text = useThemeColor({}, 'text');
  const mute = useThemeColor({}, 'muted');

  const toggle = useCallback((id: string) => {
    setItems((prevItems) => 
      prevItems.map((item) => {
        if (item.id !== id) return item;
        const completed = !item.isCompleted;
        return {
          ...item,
          isCompleted: completed,
          streak: completed ? item.streak + 1 : Math.max(0, item.streak - 1),
        };
      })
    );
  },[])

  const addHabit = useCallback(()=>{
    const title = newItem.trim();
    if(!title) return;
    setItems( prev => [
      {
        id: `h${Date.now()}`,
        title,
        streak: 0,
        isCompleted: false,
        priority: 'low',
      }, ...prev
    ])
    setNewItem('');
  }, [newItem]);

  const total = items.length;
  const completed = useMemo(() => {
    return items.filter(item => item.isCompleted).length;
  }, [items]);

    

    const keyExtractor = useCallback((item: Habit) => item.id, []);

    const renderItem = useCallback(
      ({ item }: ListRenderItemInfo<Habit>) => (
        <HabitCard
          title={item.title}
          streak={item.streak}
          isCompleted={item.isCompleted}
          priority={item.priority}
          onToggle={() => toggle(item.id)}
        />
      ),
      [toggle]
    );
  
    const ItemSeparator = () => <View style={{ height: 12 }} />;
    const Empty = () => <ThemedText>No hay hábitos. Agrega uno!</ThemedText>;
  return (
    <Screen>
        
        <ProfileHeader name="Julian Sanchez" role="Usuario" />
        <HabitGreeting name="Julian" />
        
        <View style={[styles.row, {alignItems: 'center'}]} >
          <TextInput 
            value={newItem}
            onChangeText={setNewItem}
            onSubmitEditing={addHabit}
            placeholder="Agregar nuevo hábito"
            placeholderTextColor={mute}
            style={[styles.input, {borderColor: border, backgroundColor: surface, color: text }]}
          />
          {/* <Pressable
            onPress={addHabit}
            style={[styles.addBtn, {backgroundColor: primary}]}
          >
            <ThemedText style={{color: onPrimary, fontWeight: '700'}}>Agregar</ThemedText>
          </Pressable> */}
          <PrimaryButton title="Agregar" onPress={addHabit} />
        </View>
        <ThemedText>{completed}/{total} completados</ThemedText>
        {/* <ScrollView 
          style={{gap: 12}} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 16, marginTop: 8}}>
          {items.map((habit) => (
            <HabitCard 
              key={habit.id}
              title={habit.title}
              streak={habit.streak}
              isCompleted={habit.isCompleted}
              priority={habit.priority}
              onToggle={() => toggle(habit.id)}
            />
          ))}
        </ScrollView> */}
        <FlatList
          data={items}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={ItemSeparator}
          ListEmptyComponent={Empty}
          contentContainerStyle={{ paddingBottom: insets.bottom+8, marginTop: 8 }}
          initialNumToRender={8}
          windowSize={10}
          showsVerticalScrollIndicator={false}
        />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: "100%",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  addBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  }
});