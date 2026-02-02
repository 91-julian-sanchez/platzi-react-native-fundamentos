import { isSameDay, isYesterday, toISO } from "@/utils/date";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { Habit, Priority } from "../types/habit";

type State = { loading: boolean; habits: Habit[] };

type Action =
  | { type: "HYDRATE_HABITS"; payload: Habit[] }
  | { type: "ADD_HABIT"; title: string; priority: Priority }
  | { type: "TOGGLE"; id: string; today: Date };

export const STORAGE_KEY = "habits:v1";
export const initialState: State = { loading: true, habits: [] };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE_HABITS":
      return { loading: false, habits: action.payload };

    case "ADD_HABIT": {
      const now = new Date();
      const newHabit: Habit = {
        id: `habit-${Date.now()}`,
        title: action.title,
        priority: action.priority ?? "low",
        createdAt: toISO(now),
        lastDoneAt: null,
        streak: 0,
      };
      return { ...state, habits: [...state.habits, newHabit] };
    }

    case "TOGGLE": {
      const { id, today } = action;
      const todayISO = toISO(today);

      const updatedHabits = state.habits.map((habit) => {
        if (habit.id !== id) return habit;

        const last = habit.lastDoneAt ? new Date(habit.lastDoneAt) : null;
        const isDoneToday = last ? isSameDay(last, today) : false;

        if (isDoneToday) {
          return { ...habit, streak: Math.max(0, habit.streak - 1), lastDoneAt: null };
        }

        const newStreak = last && isYesterday(today, last) ? habit.streak + 1 : 1;
        return { ...habit, streak: newStreak, lastDoneAt: todayISO };
      });

      return { ...state, habits: updatedHabits };
    }

    default:
      return state;
  }
}

// ✅ Ajustado: toggleHabit solo recibe id
export type HabitContextType = {
  loading: boolean;
  habits: Habit[];
  addHabit: (title: string, priority: Priority) => void;
  toggleHabit: (id: string) => void;
};

export const HabitContext = React.createContext<HabitContextType | null>(null);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hidratar
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed: Habit[] = raw ? JSON.parse(raw) : [];
        dispatch({ type: "HYDRATE_HABITS", payload: parsed });
      } catch (error) {
        console.warn("No se pudo cargar hábitos", error);
        dispatch({ type: "HYDRATE_HABITS", payload: [] });
      }
    })();
  }, []);

  // Guardar (debounce)
  useEffect(() => {
    if (state.loading) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.habits)).catch((error) =>
        console.warn("No se pudo guardar hábitos", error)
      );
    }, 250);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state.habits, state.loading]);

  const addHabit = useCallback(
    (title: string, priority: Priority) => {
      const clean = title.trim();
      if (!clean) return;
      dispatch({ type: "ADD_HABIT", title: clean, priority });
    },
    [dispatch]
  );

  const toggleHabit = useCallback(
    (id: string) => {
      dispatch({ type: "TOGGLE", id, today: new Date() });
    },
    [dispatch]
  );

  const value = useMemo<HabitContextType>(
    () => ({
      loading: state.loading,
      habits: state.habits,
      addHabit,
      toggleHabit,
    }),
    [state.loading, state.habits, addHabit, toggleHabit]
  );

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;

}

export function useHabits() {
  const context = React.useContext(HabitContext);
  if (!context) {
    throw new Error("useHabits must be used within a HabitProvider");
  }
  return context;
}
export default HabitProvider;
