import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SelfCheckLog, PracticeSessionLog } from '../content/types';
import { FocusLabDataExport } from '../lib/storage';

interface ActiveSessionState {
  activityId: string;
  startTimestampMs: number;
  durationMs: number;
  preCheckId?: string;
}

export interface FocusStoreState {
  checkLogs: SelfCheckLog[];
  sessionLogs: PracticeSessionLog[];
  activeSession: ActiveSessionState | null;
  theme: 'system' | 'light' | 'dark';
  soundVolume: number;

  addCheckLog: (log: Omit<SelfCheckLog, 'id' | 'timestamp'>) => SelfCheckLog;
  startSession: (
    activityId: string,
    durationMs: number,
    preCheckId?: string
  ) => void;
  completeSession: (completedFully: boolean, postCheckId?: string) => void;
  cancelSession: () => void;
  setTheme: (theme: 'system' | 'light' | 'dark') => void;
  setSoundVolume: (volume: number) => void;
  importData: (data: FocusLabDataExport) => void;
  clearAllData: () => void;
}

export const useFocusStore = create<FocusStoreState>()(
  persist(
    (set, get) => ({
      checkLogs: [],
      sessionLogs: [],
      activeSession: null,
      theme: 'system',
      soundVolume: 0.5,

      addCheckLog: (logData) => {
        const newLog: SelfCheckLog = {
          ...logData,
          id: `chk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          timestamp: Date.now(),
        };
        set((state) => ({
          checkLogs: [newLog, ...state.checkLogs],
        }));
        return newLog;
      },

      startSession: (activityId, durationMs, preCheckId) => {
        set({
          activeSession: {
            activityId,
            startTimestampMs: Date.now(),
            durationMs,
            preCheckId,
          },
        });
      },

      completeSession: (completedFully, postCheckId) => {
        const { activeSession, sessionLogs } = get();
        if (!activeSession) return;

        const now = Date.now();
        const durationMs = Math.max(0, now - activeSession.startTimestampMs);
        const newSessionLog: PracticeSessionLog = {
          id: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          activityId: activeSession.activityId,
          startedAt: activeSession.startTimestampMs,
          completedAt: now,
          durationMs,
          preCheckId: activeSession.preCheckId,
          postCheckId,
          completedFully,
        };

        set({
          sessionLogs: [newSessionLog, ...sessionLogs],
          activeSession: null,
        });
      },

      cancelSession: () => {
        set({ activeSession: null });
      },

      setTheme: (theme) => {
        set({ theme });
      },

      setSoundVolume: (soundVolume) => {
        const clamped = Math.max(0, Math.min(1, soundVolume));
        set({ soundVolume: clamped });
      },

      importData: (data) => {
        set({
          checkLogs: data.checkLogs,
          sessionLogs: data.sessionLogs,
          theme: data.userPreferences.theme,
          soundVolume: data.userPreferences.soundVolume,
          activeSession: null,
        });
      },

      clearAllData: () => {
        set({
          checkLogs: [],
          sessionLogs: [],
          activeSession: null,
          theme: 'system',
          soundVolume: 0.5,
        });
      },
    }),
    {
      name: 'focuslab-storage',
      partialize: (state) => ({
        checkLogs: state.checkLogs,
        sessionLogs: state.sessionLogs,
        theme: state.theme,
        soundVolume: state.soundVolume,
      }),
    }
  )
);
