import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import {
  CheckResult,
  Session,
  ActivityLog,
  Experiment,
  ExperimentRun,
  FocusLabSnapshot,
} from './types';
import { validateSnapshot } from './validation';

export interface FocusLabStore {
  checks: CheckResult[];
  sessions: Session[];
  activityLogs: ActivityLog[];
  experiments: Experiment[];

  addCheck: (check: CheckResult) => void;
  addSession: (session: Session) => void;
  addActivityLog: (log: ActivityLog) => void;
  addExperiment: (experiment: Experiment) => void;
  addExperimentRun: (experimentId: string, run: ExperimentRun) => void;

  exportData: () => string;
  importData: (json: string) => boolean;
  deleteAll: () => void;
}

const memoryStorage: Record<string, string> = {};

const safeStorage: StateStorage = {
  getItem: (name: string): string | null => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(name);
    }
    return memoryStorage[name] ?? null;
  },
  setItem: (name: string, value: string): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(name, value);
    } else {
      memoryStorage[name] = value;
    }
  },
  removeItem: (name: string): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(name);
    } else {
      delete memoryStorage[name];
    }
  },
};

export const useFocusLabStore = create<FocusLabStore>()(
  persist(
    (set, get) => ({
      checks: [],
      sessions: [],
      activityLogs: [],
      experiments: [],

      addCheck: (check) => {
        set((state) => ({ checks: [check, ...state.checks] }));
      },

      addSession: (session) => {
        set((state) => ({ sessions: [session, ...state.sessions] }));
      },

      addActivityLog: (log) => {
        set((state) => ({ activityLogs: [log, ...state.activityLogs] }));
      },

      addExperiment: (experiment) => {
        set((state) => ({ experiments: [experiment, ...state.experiments] }));
      },

      addExperimentRun: (experimentId, run) => {
        set((state) => ({
          experiments: state.experiments.map((e) =>
            e.id === experimentId ? { ...e, runs: [...e.runs, run] } : e
          ),
        }));
      },

      exportData: () => {
        const { checks, sessions, activityLogs, experiments } = get();
        const snapshot: FocusLabSnapshot = {
          version: 1,
          exportedAt: new Date().toISOString(),
          checks,
          sessions,
          activityLogs,
          experiments,
        };
        return JSON.stringify(snapshot, null, 2);
      },

      importData: (json: string): boolean => {
        try {
          const parsed: unknown = JSON.parse(json);
          const validation = validateSnapshot(parsed);
          if (!validation.valid || !validation.data) {
            return false;
          }
          const { checks, sessions, activityLogs, experiments } = validation.data;
          set({
            checks,
            sessions,
            activityLogs,
            experiments,
          });
          return true;
        } catch {
          return false;
        }
      },

      deleteAll: () => {
        set({
          checks: [],
          sessions: [],
          activityLogs: [],
          experiments: [],
        });
      },
    }),
    {
      name: 'focuslab:v1',
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      migrate: (persistedState: unknown, version: number) => {
        if (version < 1) {
          return persistedState as FocusLabStore;
        }
        return persistedState as FocusLabStore;
      },
    }
  )
);
