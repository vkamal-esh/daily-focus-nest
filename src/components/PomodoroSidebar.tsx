import { useEffect } from "react"
import { usePomodoroStore } from "@/store/pomodoroStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, Square, Coffee } from "lucide-react"
import { cn } from "@/lib/utils"

export function PomodoroSidebar() {
  const {
    currentSession,
    isRunning,
    timeLeft,
    workDuration,
    breakDuration,
    startSession,
    pauseSession,
    resumeSession,
    resetSession,
    updateTimeLeft,
    getTodayStats
  } = usePomodoroStore()

  const stats = getTodayStats()

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        updateTimeLeft(timeLeft - 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft, updateTimeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgress = () => {
    if (!currentSession) return 0
    const total = currentSession.duration
    const elapsed = total - timeLeft
    return (elapsed / total) * 100
  }

  const handleStart = (type: 'work' | 'break') => {
    if (currentSession) {
      resetSession()
    }
    startSession(type)
  }

  return (
    <div className="w-80 h-screen bg-gradient-calm border-l border-border/50 flex flex-col">
      {/* Timer Section */}
      <div className="p-6 border-b border-border/50">
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-display text-center">
              Focus Timer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-mono font-bold text-primary mb-2">
                {formatTime(timeLeft)}
              </div>
              {currentSession && (
                <div className="text-sm text-muted-foreground capitalize">
                  {currentSession.type} Session
                </div>
              )}
            </div>

            {currentSession && (
              <Progress 
                value={getProgress()} 
                className="h-2"
              />
            )}

            <div className="flex gap-2">
              {!currentSession ? (
                <>
                  <Button
                    onClick={() => handleStart('work')}
                    className="flex-1 bg-primary hover:bg-primary/90"
                    size="sm"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Work
                  </Button>
                  <Button
                    onClick={() => handleStart('break')}
                    variant="outline"
                    className="flex-1"
                    size="sm"
                  >
                    <Coffee className="h-4 w-4 mr-2" />
                    Break
                  </Button>
                </>
              ) : (
                <>
                  {isRunning ? (
                    <Button
                      onClick={pauseSession}
                      variant="outline"
                      className="flex-1"
                      size="sm"
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  ) : (
                    <Button
                      onClick={resumeSession}
                      className="flex-1 bg-primary hover:bg-primary/90"
                      size="sm"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </Button>
                  )}
                  <Button
                    onClick={resetSession}
                    variant="outline"
                    size="sm"
                    className="px-3"
                  >
                    <Square className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Section */}
      <div className="p-6">
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-display">Today's Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {stats.completedSessions}
                </div>
                <div className="text-xs text-muted-foreground">Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {Math.round(stats.totalTime / 60)}
                </div>
                <div className="text-xs text-muted-foreground">Minutes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Motivational Quote */}
      <div className="mt-auto p-6">
        <div className="rounded-lg bg-gradient-card p-4 border border-border/50 shadow-card">
          <p className="text-xs text-muted-foreground italic text-center leading-relaxed">
            {currentSession?.type === 'work' 
              ? "Deep work is like a superpower in our increasingly competitive economy."
              : "Rest when you're weary. Refresh and renew yourself."
            }
          </p>
        </div>
      </div>
    </div>
  )
}