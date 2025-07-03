import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeStore {
  isDark: boolean
  // Keep for compatibility but always true
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      isDark: true, // Always dark
      
      toggleTheme: () => {
        // Always stay dark - this is just for compatibility
        set({ isDark: true })
        document.documentElement.classList.add('dark')
      }
    }),
    {
      name: 'flow-theme',
      onRehydrateStorage: () => (state) => {
        // Always apply dark theme on app load
        document.documentElement.classList.add('dark')
      }
    }
  )
)
