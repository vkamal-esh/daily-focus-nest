import { useState, useMemo } from "react"
import { Calendar as BigCalendar, momentLocalizer, View } from "react-big-calendar"
import moment from "moment"
import { useTaskStore } from "@/store/taskStore"
import { TaskModal } from "@/components/TaskModal"
import { FloatingButton } from "@/components/ui/floating-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { Task } from "@/store/taskStore"
import "react-big-calendar/lib/css/react-big-calendar.css"

const localizer = momentLocalizer(moment)

export default function Calendar() {
  const { tasks } = useTaskStore()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [view, setView] = useState<View>("month")
  const [date, setDate] = useState(new Date())

  const events = useMemo(() => {
    return tasks
      .filter(task => task.dueDate)
      .map(task => ({
        id: task.id,
        title: task.title,
        start: new Date(task.dueDate!),
        end: new Date(task.dueDate!),
        resource: task,
        allDay: true,
      }))
  }, [tasks])

  const handleSelectEvent = (event: any) => {
    setSelectedTask(event.resource)
    setIsModalOpen(true)
  }

  const handleSelectSlot = (slotInfo: any) => {
    // Create new task with selected date
    setSelectedTask(null)
    setIsModalOpen(true)
  }

  const handleCreateTask = () => {
    setSelectedTask(null)
    setIsModalOpen(true)
  }

  const eventStyleGetter = (event: any) => {
    const task = event.resource as Task
    let backgroundColor = "#94a3b8" // default muted color
    
    if (task.completed) {
      backgroundColor = "#10b981" // success green
    } else if (task.priority === "high") {
      backgroundColor = "#ef4444" // destructive red
    } else if (task.priority === "medium") {
      backgroundColor = "#f59e0b" // warning amber
    } else {
      backgroundColor = "#06b6d4" // focus blue
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        opacity: task.completed ? 0.7 : 1,
        color: "white",
        border: "none",
        fontSize: "12px",
        padding: "2px 6px",
      }
    }
  }

  const CustomToolbar = (toolbar: any) => {
    const goToBack = () => {
      setDate(toolbar.onNavigate("PREV"))
    }

    const goToNext = () => {
      setDate(toolbar.onNavigate("NEXT"))
    }

    const goToToday = () => {
      const now = new Date()
      setDate(now)
      toolbar.onNavigate("TODAY")
    }

    const label = () => {
      const date = moment(toolbar.date)
      if (toolbar.view === "month") {
        return date.format("MMMM YYYY")
      } else if (toolbar.view === "week") {
        return `Week of ${date.format("MMMM D, YYYY")}`
      } else {
        return date.format("MMMM D, YYYY")
      }
    }

    return (
      <div className="flex items-center justify-between mb-4 p-4 bg-gradient-card rounded-lg border border-border/50 shadow-card">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToBack}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="ml-2"
          >
            Today
          </Button>
        </div>

        <h2 className="text-lg font-display font-semibold text-foreground">
          {label()}
        </h2>

        <div className="flex items-center gap-2">
          <Button
            variant={view === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("month")}
          >
            Month
          </Button>
          <Button
            variant={view === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("week")}
          >
            Week
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-gradient-calm">
      <div className="h-full overflow-auto">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-display font-semibold text-foreground">
              Calendar
            </h1>
            <p className="text-muted-foreground">
              Plan and visualize your tasks over time.
            </p>
          </div>

          {/* Calendar */}
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardContent className="p-6">
              <div className="h-[600px]">
                <BigCalendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  view={view}
                  onView={setView}
                  date={date}
                  onNavigate={setDate}
                  onSelectEvent={handleSelectEvent}
                  onSelectSlot={handleSelectSlot}
                  selectable
                  eventPropGetter={eventStyleGetter}
                  components={{
                    toolbar: CustomToolbar,
                  }}
                  style={{
                    height: "100%",
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-display">Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-destructive rounded"></div>
                  <span className="text-sm text-muted-foreground">High Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-warning rounded"></div>
                  <span className="text-sm text-muted-foreground">Medium Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-focus rounded"></div>
                  <span className="text-sm text-muted-foreground">Low Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-success rounded opacity-70"></div>
                  <span className="text-sm text-muted-foreground">Completed</span>
                </div>
              </div>
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

      <style>{`
        .rbc-calendar {
          background: transparent;
          color: hsl(var(--foreground));
        }
        
        .rbc-header {
          background: hsl(var(--muted));
          color: hsl(var(--muted-foreground));
          border-bottom: 1px solid hsl(var(--border));
          padding: 8px;
          font-weight: 500;
          font-size: 12px;
        }
        
        .rbc-month-view {
          border: 1px solid hsl(var(--border));
          border-radius: 8px;
          overflow: hidden;
        }
        
        .rbc-date-cell {
          padding: 8px;
          font-size: 14px;
          color: hsl(var(--foreground));
        }
        
        .rbc-today {
          background-color: hsl(var(--primary) / 0.1);
        }
        
        .rbc-off-range-bg {
          background-color: hsl(var(--muted) / 0.3);
        }
        
        .rbc-day-bg {
          background: hsl(var(--background));
          border-right: 1px solid hsl(var(--border));
        }
        
        .rbc-event {
          border-radius: 4px;
          padding: 2px 6px;
          font-size: 11px;
          font-weight: 500;
        }
        
        .rbc-day-slot .rbc-time-slot {
          border-top: 1px solid hsl(var(--border));
        }
      `}</style>
    </div>
  )
}