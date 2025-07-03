import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useSettingsStore } from "@/store/settingsStore"
import { usePomodoroStore } from "@/store/pomodoroStore"
import { FolderOpen, RotateCcw, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Settings() {
  const { toast } = useToast()
  const settings = useSettingsStore()
  const pomodoro = usePomodoroStore()
  
  const [localSettings, setLocalSettings] = useState({
    workDuration: settings.workDuration,
    shortBreakDuration: settings.shortBreakDuration,
    longBreakDuration: settings.longBreakDuration,
    saveLocation: settings.saveLocation
  })

  const handleSave = () => {
    settings.setWorkDuration(localSettings.workDuration)
    settings.setShortBreakDuration(localSettings.shortBreakDuration)
    settings.setLongBreakDuration(localSettings.longBreakDuration)
    settings.setSaveLocation(localSettings.saveLocation)
    
    // Update Pomodoro store with new durations
    pomodoro.setWorkDuration(localSettings.workDuration * 60) // Convert to seconds
    pomodoro.setBreakDuration(localSettings.shortBreakDuration * 60)
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    })
  }

  const handleReset = () => {
    settings.resetToDefaults()
    setLocalSettings({
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      saveLocation: '~/Documents/Flow'
    })
    
    toast({
      title: "Settings reset",
      description: "All settings have been restored to defaults.",
    })
  }

  const handleSelectFolder = async () => {
    try {
      if (typeof window !== 'undefined' && window.electronAPI) {
        const selectedPath = await window.electronAPI.selectDirectory()
        if (selectedPath) {
          setLocalSettings({
            ...localSettings,
            saveLocation: selectedPath
          })
          toast({
            title: "Folder selected",
            description: `Tasks will be saved to: ${selectedPath}`,
          })
        }
      } else {
        toast({
          title: "Folder selection",
          description: "Folder selection is available in the desktop app.",
        })
      }
    } catch (error) {
      console.error('Folder selection error:', error)
      toast({
        title: "Error",
        description: "Failed to select folder. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="flex-1 p-6 scroll-container">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-display font-semibold text-foreground">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Customize your Flow experience
          </p>
        </div>

        <Separator />

        {/* Pomodoro Settings */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-focus rounded-full"></div>
              Pomodoro Timer
            </CardTitle>
            <CardDescription>
              Adjust your focus and break durations (in minutes)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="work-duration">Work Duration</Label>
                <Input
                  id="work-duration"
                  type="number"
                  min="1"
                  max="60"
                  value={localSettings.workDuration}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    workDuration: parseInt(e.target.value) || 25
                  })}
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="short-break">Short Break</Label>
                <Input
                  id="short-break"
                  type="number"
                  min="1"
                  max="30"
                  value={localSettings.shortBreakDuration}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    shortBreakDuration: parseInt(e.target.value) || 5
                  })}
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="long-break">Long Break</Label>
                <Input
                  id="long-break"
                  type="number"
                  min="1"
                  max="60"
                  value={localSettings.longBreakDuration}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    longBreakDuration: parseInt(e.target.value) || 15
                  })}
                  className="bg-input border-border"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Settings */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              Data Storage
            </CardTitle>
            <CardDescription>
              Choose where to save your tasks and data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="save-location">Save Location</Label>
              <div className="flex gap-2">
                <Input
                  id="save-location"
                  value={localSettings.saveLocation}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    saveLocation: e.target.value
                  })}
                  className="bg-input border-border flex-1"
                  placeholder="~/Documents/Flow"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSelectFolder}
                  className="shrink-0"
                >
                  <FolderOpen className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Tasks, timers, and app data will be saved to this location
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </Button>
          
          <Button
            onClick={handleSave}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
