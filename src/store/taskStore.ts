import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  createdAt: string
  completedAt?: string
  category?: string
}

interface TaskStore {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTask: (id: string) => void
  getTodayTasks: () => Task[]
  getOverdueTasks: () => Task[]
  getUpcomingTasks: () => Task[]
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          tasks: [...state.tasks, newTask]
        }))
      },
      
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          )
        }))
      },
      
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id)
        }))
      },
      
      toggleTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  completed: !task.completed,
                  completedAt: !task.completed ? new Date().toISOString() : undefined
                }
              : task
          )
        }))
      },
      
      getTodayTasks: () => {
        const today = new Date().toISOString().split('T')[0]
        return get().tasks.filter((task) => 
          task.dueDate === today || (!task.dueDate && !task.completed)
        )
      },
      
      getOverdueTasks: () => {
        const today = new Date().toISOString().split('T')[0]
        return get().tasks.filter((task) => 
          task.dueDate && task.dueDate < today && !task.completed
        )
      },
      
      getUpcomingTasks: () => {
        const today = new Date().toISOString().split('T')[0]
        return get().tasks.filter((task) => 
          task.dueDate && task.dueDate > today && !task.completed
        )
      }
    }),
    {
      name: 'flow-tasks'
    }
  )
)