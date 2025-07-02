import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface PomodoroSession {
  id: string
  duration: number
  completed: boolean
  startedAt: string
  completedAt?: string
  type: 'work' | 'break'
}

interface PomodoroStore {
  sessions: PomodoroSession[]
  currentSession: PomodoroSession | null
  isRunning: boolean
  timeLeft: number
  workDuration: number
  breakDuration: number
  
  startSession: (type: 'work' | 'break') => void
  pauseSession: () => void
  resumeSession: () => void
  completeSession: () => void
  resetSession: () => void
  updateTimeLeft: (time: number) => void
  setWorkDuration: (duration: number) => void
  setBreakDuration: (duration: number) => void
  getTodayStats: () => { completedSessions: number; totalTime: number }
}

export const usePomodoroStore = create<PomodoroStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSession: null,
      isRunning: false,
      timeLeft: 25 * 60, // 25 minutes in seconds
      workDuration: 25 * 60,
      breakDuration: 5 * 60,
      
      startSession: (type) => {
        const duration = type === 'work' ? get().workDuration : get().breakDuration
        const session: PomodoroSession = {
          id: crypto.randomUUID(),
          duration,
          completed: false,
          startedAt: new Date().toISOString(),
          type
        }
        
        set({
          currentSession: session,
          isRunning: true,
          timeLeft: duration
        })
      },
      
      pauseSession: () => {
        set({ isRunning: false })
      },
      
      resumeSession: () => {
        set({ isRunning: true })
      },
      
      completeSession: () => {
        const { currentSession } = get()
        if (!currentSession) return
        
        const completedSession = {
          ...currentSession,
          completed: true,
          completedAt: new Date().toISOString()
        }
        
        set((state) => ({
          sessions: [...state.sessions, completedSession],
          currentSession: null,
          isRunning: false,
          timeLeft: state.workDuration
        }))
      },
      
      resetSession: () => {
        set((state) => ({
          currentSession: null,
          isRunning: false,
          timeLeft: state.workDuration
        }))
      },
      
      updateTimeLeft: (time) => {
        set({ timeLeft: time })
        if (time <= 0) {
          get().completeSession()
        }
      },
      
      setWorkDuration: (duration) => {
        set({ workDuration: duration })
      },
      
      setBreakDuration: (duration) => {
        set({ breakDuration: duration })
      },
      
      getTodayStats: () => {
        const today = new Date().toISOString().split('T')[0]
        const todaySessions = get().sessions.filter((session) =>
          session.completedAt?.startsWith(today)
        )
        
        return {
          completedSessions: todaySessions.length,
          totalTime: todaySessions.reduce((total, session) => total + session.duration, 0)
        }
      }
    }),
    {
      name: 'flow-pomodoro'
    }
  )
)