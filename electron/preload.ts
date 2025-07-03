
import { contextBridge, ipcRenderer } from 'electron'

export interface ElectronAPI {
  selectDirectory: () => Promise<string | null>
  saveTasksToFile: (filePath: string, data: any) => Promise<boolean>
  loadTasksFromFile: (filePath: string) => Promise<any>
  checkFileExists: (filePath: string) => Promise<boolean>
}

contextBridge.exposeInMainWorld('electronAPI', {
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  saveTasksToFile: (filePath: string, data: any) => ipcRenderer.invoke('save-tasks', filePath, data),
  loadTasksFromFile: (filePath: string) => ipcRenderer.invoke('load-tasks', filePath),
  checkFileExists: (filePath: string) => ipcRenderer.invoke('check-file-exists', filePath)
} as ElectronAPI)
