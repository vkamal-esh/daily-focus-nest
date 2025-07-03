
export interface ElectronAPI {
  selectDirectory: () => Promise<string | null>
  saveTasksToFile: (filePath: string, data: any) => Promise<boolean>
  loadTasksFromFile: (filePath: string) => Promise<any>
  checkFileExists: (filePath: string) => Promise<boolean>
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}
