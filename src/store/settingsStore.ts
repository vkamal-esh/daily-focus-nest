
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsStore {
  // Pomodoro settings (in minutes)
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  
  // File settings
  saveLocation: string
  
  // Actions
  setWorkDuration: (duration: number) => void
  setShortBreakDuration: (duration: number) => void
  setLongBreakDuration: (duration: number) => void
  setSaveLocation: (location: string) => void
  resetToDefaults: () => void
}

const DEFAULT_SETTINGS = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  saveLocation: '~/Documents/Flow'
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      
      setWorkDuration: (duration) => set({ workDuration: duration }),
      setShortBreakDuration: (duration) => set({ shortBreakDuration: duration }),
      setLongBreakDuration: (duration) => set({ longBreakDuration: duration }),
      setSaveLocation: (location) => set({ saveLocation: location }),
      
      resetToDefaults: () => set(DEFAULT_SETTINGS)
    }),
    {
      name: 'flow-settings'
    }
  )
)
