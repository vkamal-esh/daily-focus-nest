
import { NavLink } from "react-router-dom"
import { Calendar, CheckSquare, Home, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Today", href: "/", icon: Home },
  { name: "All Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  return (
    <div className="flex h-screen w-64 flex-col bg-gradient-calm border-r border-border/50 scroll-container">
      {/* Header */}
      <div className="flex h-16 items-center justify-center px-6 border-b border-border/50">
        <h1 className="text-xl font-display font-semibold text-foreground">
          Flow
        </h1>
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
            "The secret of change is to focus all of your energy not on fighting the old, but on building the new."
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">— Socrates</p>
        </div>
      </div>
    </div>
  )
}
