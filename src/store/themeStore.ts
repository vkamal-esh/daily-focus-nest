import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeStore {
  isDark: boolean
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      isDark: false,
      
      toggleTheme: () => {
        const newTheme = !get().isDark
        set({ isDark: newTheme })
        
        // Apply theme to document
        if (newTheme) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    }),
    {
      name: 'flow-theme',
      onRehydrateStorage: () => (state) => {
        // Apply theme on app load
        if (state?.isDark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    }
  )
)