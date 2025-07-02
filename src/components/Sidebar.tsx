import { NavLink } from "react-router-dom"
import { Calendar, CheckSquare, Home, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useThemeStore } from "@/store/themeStore"

const navigation = [
  { name: "Today", href: "/", icon: Home },
  { name: "All Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Calendar", href: "/calendar", icon: Calendar },
]

export function Sidebar() {
  const { isDark, toggleTheme } = useThemeStore()

  return (
    <div className="flex h-screen w-64 flex-col bg-gradient-calm border-r border-border/50">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-border/50">
        <h1 className="text-xl font-display font-semibold text-foreground">
          Flow
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="h-8 w-8 p-0 hover:bg-muted/50"
        >
          {isDark ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.name}
              to={item.href}
              end
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-muted/50 group",
                  isActive
                    ? "bg-primary/10 text-primary shadow-soft"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-all group-hover:scale-110",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <span className="transition-all group-hover:translate-x-0.5">
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Quote */}
      <div className="px-6 pb-6">
        <div className="rounded-lg bg-gradient-card p-4 border border-border/50 shadow-card">
          <p className="text-xs text-muted-foreground italic leading-relaxed">
            "Discipline is choosing between what you want now and what you want most."
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">— Abraham Lincoln</p>
        </div>
      </div>
    </div>
  )
}