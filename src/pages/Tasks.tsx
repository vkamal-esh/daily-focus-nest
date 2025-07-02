import { useState } from "react"
import { useTaskStore } from "@/store/taskStore"
import { TaskCard } from "@/components/TaskCard"
import { TaskModal } from "@/components/TaskModal"
import { FloatingButton } from "@/components/ui/floating-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Search, Filter } from "lucide-react"
import { Task } from "@/store/taskStore"

export default function Tasks() {
  const { tasks } = useTaskStore()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed">("all")
  const [filterPriority, setFilterPriority] = useState<"all" | "low" | "medium" | "high">("all")

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filterStatus === "all" ||
                         (filterStatus === "pending" && !task.completed) ||
                         (filterStatus === "completed" && task.completed)
    
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleCreateTask = () => {
    setSelectedTask(null)
    setIsModalOpen(true)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setFilterStatus("all")
    setFilterPriority("all")
  }

  return (
    <div className="flex-1 bg-gradient-calm">
      <div className="h-full overflow-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-display font-semibold text-foreground">
              All Tasks
            </h1>
            <p className="text-muted-foreground">
              Manage and organize all your tasks.
            </p>
          </div>

          {/* Filters */}
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50"
                  />
                </div>
                
                <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                  <SelectTrigger className="w-full sm:w-40 bg-background/50 border-border/50">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterPriority} onValueChange={(value: any) => setFilterPriority(value)}>
                  <SelectTrigger className="w-full sm:w-40 bg-background/50 border-border/50">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full sm:w-auto"
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tasks List */}
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-display">
                  Tasks ({filteredTasks.length})
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-muted-foreground text-sm mb-4">
                    {searchQuery || filterStatus !== "all" || filterPriority !== "all"
                      ? "No tasks match your filters."
                      : "No tasks yet. Create your first task to get started!"
                    }
                  </div>
                  {(!searchQuery && filterStatus === "all" && filterPriority === "all") && (
                    <Button onClick={handleCreateTask} className="bg-primary hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Task
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTasks
                    .sort((a, b) => {
                      // Sort by completion status, then by priority, then by due date
                      if (a.completed !== b.completed) {
                        return a.completed ? 1 : -1
                      }
                      
                      const priorityOrder = { high: 3, medium: 2, low: 1 }
                      if (a.priority !== b.priority) {
                        return priorityOrder[b.priority] - priorityOrder[a.priority]
                      }
                      
                      if (a.dueDate && b.dueDate) {
                        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
                      }
                      
                      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    })
                    .map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={handleEditTask}
                      />
                    ))
                  }
                </div>
              )}
            </CardContent>
          </Card>
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