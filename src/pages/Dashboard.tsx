import { useState } from "react"
import { useTaskStore } from "@/store/taskStore"
import { TaskCard } from "@/components/TaskCard"
import { TaskModal } from "@/components/TaskModal"
import { FloatingButton } from "@/components/ui/floating-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { Task } from "@/store/taskStore"

export default function Dashboard() {
  const { tasks, getTodayTasks, getOverdueTasks, getUpcomingTasks } = useTaskStore()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const todayTasks = getTodayTasks()
  const overdueTasks = getOverdueTasks()
  const upcomingTasks = getUpcomingTasks()
  const completedToday = tasks.filter(task => 
    task.completed && task.completedAt?.startsWith(new Date().toISOString().split('T')[0])
  )

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleCreateTask = () => {
    setSelectedTask(null)
    setIsModalOpen(true)
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="flex-1 bg-gradient-calm">
      <div className="h-full overflow-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-display font-semibold text-foreground">
              {getGreeting()}
            </h1>
            <p className="text-muted-foreground">
              Let's make today productive and meaningful.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-primary">
                      {completedToday.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-focus/10 rounded-lg">
                    <Clock className="h-4 w-4 text-focus" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-focus">
                      {todayTasks.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Today</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-destructive">
                      {overdueTasks.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Overdue</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <Clock className="h-4 w-4 text-warning" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-warning">
                      {upcomingTasks.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Upcoming</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Overdue Tasks */}
          {overdueTasks.length > 0 && (
            <Card className="bg-gradient-card border-destructive/20 shadow-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg font-display">Overdue Tasks</CardTitle>
                  <Badge variant="destructive" className="text-xs">
                    {overdueTasks.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {overdueTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                  />
                ))}
              </CardContent>
            </Card>
          )}

          {/* Today's Tasks */}
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg font-display">Today's Focus</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {todayTasks.filter(t => !t.completed).length} remaining
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayTasks.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground text-sm">
                    No tasks for today. Create your first task to get started!
                  </div>
                </div>
              ) : (
                todayTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                  />
                ))
              )}
            </CardContent>
          </Card>

          {/* Upcoming Tasks Preview */}
          {upcomingTasks.length > 0 && (
            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg font-display">Upcoming</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {upcomingTasks.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingTasks.slice(0, 3).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                  />
                ))}
                {upcomingTasks.length > 3 && (
                  <div className="text-center text-sm text-muted-foreground pt-2">
                    And {upcomingTasks.length - 3} more...
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <FloatingButton
          variant="add"
          size="lg"
          onClick={handleCreateTask}
          className="animate-float"
        >
          <Plus className="h-6 w-6" />
        </FloatingButton>
      </div>

      {/* Task Modal */}
      <TaskModal
        task={selectedTask}
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedTask(null)
        }}
      />
    </div>
  )
}