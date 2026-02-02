import HabitCard from '@/components/HabitCard';
import HabitGreeting from '@/components/HabitGreeting';
import ProfileHeader from '@/components/ProfileHeader';
import Screen from '@/components/Screen';
import { StyleSheet, View , TextInput, Pressable, ScrollView, ListRenderItemInfo, FlatList, Text} from 'react-native';
import { useCallback, useMemo, useState } from "react";
import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '@/components/themed-text';
import PrimaryButton from '@/components/PrimaryButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHabits } from '@/context/HabitContext';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCelebration } from '@/context/CelebrationProvider';
import { getMotivation } from '@/services/motivation';
import { isSameDay } from '@/utils/date';

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

type HabitItem = ReturnType<typeof useHabits>['habits'][number];

export default function HomeScreen() {
  const {loading, habits, addHabit, toggleHabit} = useHabits();

  const [items, setItems] = useState<Habit[]>(HABIT_INITIAL);
  const [newItem, setNewItem] = useState('');
  const insets = useSafeAreaInsets()

  const {celebrate} = useCelebration();
  const border = useThemeColor({}, 'border');
  const surface = useThemeColor({}, 'surface');
  const text = useThemeColor({}, 'text');
  const mute = useThemeColor({}, 'muted');



const onAddHabit = useCallback(() => {
   const title = newItem.trim();
   if (title.length === 0) return;

    addHabit(title, 'low');
    setNewItem('');
}, [newItem, addHabit]);

  const total = items.length;
  const completed = useMemo(() => {
    const today = new Date().toDateString();
    return habits.filter(
      (habit) => habit.lastDoneAt && new Date(habit.lastDoneAt).toDateString() === today
    ).length;
  }, [habits]);

   async function onToggleCelebration(item: HabitItem){
      const wasToday = item.lastDoneAt ?  isSameDay(new Date(item.lastDoneAt), new Date()) : false;
      toggleHabit(item.id);
      if(!wasToday){
        const message = await getMotivation("Julian", item.title);
        celebrate(message);
      }
    }

    const keyExtractor = useCallback((item: Habit) => item.id, []);

   const renderItem = useCallback(
  ({ item }: ListRenderItemInfo<HabitItem>) => {
    const isToday = item.lastDoneAt
      ? new Date(item.lastDoneAt).toDateString() === new Date().toDateString()
      : false;

    return (
      <HabitCard
        title={item.title}
        streak={item.streak}
        isCompleted={isToday}
        priority={item.priority}
        onToggle={() => onToggleCelebration(item)}
      />
    );
  },
  [onToggleCelebration]
);

  
    const ItemSeparator = () => <View style={{ height: 12 }} />;
    const Empty = () => <ThemedText>No hay hábitos. Agrega uno!</ThemedText>;

    if(loading){
      return (
        <View style={styles.container}>
          <ThemedText style={styles.titulo}>Cargando hábitos...</ThemedText>
        </View>
      )
    }

    const isSameDay = (date1: Date, date2: Date) => 
      new Date(date1).toDateString() === new Date(date2).toDateString()
    

  return (
    <Screen>
        
        <ProfileHeader name="Julian Sanchez" role="Usuario" />
        <HabitGreeting name="Julian" />
        
        <View style={[styles.row, {alignItems: 'center'}]} >

          <Pressable
            onPress={async () => {
              try {
                await AsyncStorage.clear();
              } catch (e) {
                console.warn(e);
              }
            }}
            style={{ padding: 12, borderRadius: 8, backgroundColor: "black" }}
          >
            <Text style={{ color: "white" }}>Resetear app</Text>
          </Pressable>

          <TextInput 
            value={newItem}
            onChangeText={setNewItem}
            onSubmitEditing={onAddHabit}
            placeholder="Agregar nuevo hábito"
            placeholderTextColor={mute}
            style={[styles.input, {borderColor: border, backgroundColor: surface, color: text }]}
          />
          <PrimaryButton title="Agregar" onPress={onAddHabit} />
        </View>
        <ThemedText>{completed}/{total} completados</ThemedText>
        <FlatList
          data={habits}
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