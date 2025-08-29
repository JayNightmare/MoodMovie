import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useFlowStore = create(
  persist(
    (set, get) => ({
      status: 'idle', // idle → asking → deciding → showing → matching
      answers: [],
      questions: [],
      currentQuestionIndex: 0,
      movies: [],
      spec: null,
      error: null,

      start: () =>
        set({
          status: 'asking',
          answers: [],
          currentQuestionIndex: 0,
          movies: [],
          spec: null,
          error: null,
        }),

      addAnswer: (answer) => {
        set((state) => ({
          answers: [...state.answers, answer],
          currentQuestionIndex: state.currentQuestionIndex + 1,
        }));
      },

      setQuestions: (questions) => set({ questions }),
      setMovies: (movies) => set({ movies, status: 'showing' }),
      setSpec: (spec) => set({ spec, status: 'deciding' }),
      setStatus: (status) => set({ status }),
      setError: (error) => set({ error }),

      reset: () =>
        set({
          status: 'idle',
          answers: [],
          questions: [],
          currentQuestionIndex: 0,
          movies: [],
          spec: null,
          error: null,
        }),
    }),
    {
      name: 'flow-state', // name of the item in storage
      storage: createJSONStorage(() => sessionStorage), // use sessionStorage
    }
  )
);
