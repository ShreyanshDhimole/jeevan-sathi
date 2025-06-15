
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, CalendarCheck, MessageSquare, Plus, ArrowDown, ArrowUp } from "lucide-react";

const mockData = {
  routine: [
    { time: "7:00", label: "Wake up", completed: true },
    { time: "7:15", label: "Naam Jaap", completed: false },
    { time: "7:40", label: "Shower", completed: false },
    { time: "8:00", label: "Start Work", completed: false },
  ],
  tasks: [
    { category: "Work", label: "Finish project report", completed: false },
    { category: "Personal", label: "Call Tanu re: Aadhaar", completed: true },
    { category: "Spiritual", label: "Evening Naam Jaap", completed: false },
  ],
  goals: [
    {
      label: "Learn Python",
      target: "30 days",
      progress: 0.66,
      streak: 6,
      catchUp: "You’re on track!",
    },
    {
      label: "Lose 5kg",
      target: "2 months",
      progress: 0.43,
      streak: 2,
      catchUp: "You’re 3 days behind, do 90 mins today.",
    },
  ],
  points: 320,
  rewards: [
    "Watch a movie tonight",
    "Order Pizza",
  ],
  punishments: [
    "No Instagram tomorrow",
    "Cold shower next day",
  ],
};

export function DashboardTiles() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
      {/* Routine Card */}
      <Card className="col-span-1 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck size={20} />
            Today's Routine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {mockData.routine.map((item) => (
              <li key={item.time} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground w-12">{item.time}</span>
                  <span className={item.completed ? "line-through text-muted-foreground" : ""}>{item.label}</span>
                </div>
                <button
                  className={`rounded-full border w-8 h-8 flex items-center justify-center transition-colors ${item.completed ? "bg-green-50 border-green-300" : "hover:bg-accent"}`}
                  title={item.completed ? "Done" : "Mark as done"}
                >
                  <Check size={18} className={item.completed ? "text-green-600" : "text-muted-foreground"} />
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      {/* Tasks Card */}
      <Card className="col-span-1 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus size={20} />
            Today's Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {mockData.tasks.map((task) => (
              <li key={task.label} className="flex items-center justify-between group">
                <div>
                  <span className="text-xs px-2 py-0.5 mr-2 rounded bg-secondary">{task.category}</span>
                  <span className={task.completed ? "line-through text-muted-foreground" : ""}>{task.label}</span>
                </div>
                <button
                  className={`rounded-full border w-8 h-8 flex items-center justify-center transition-colors ${task.completed ? "bg-blue-50 border-blue-300" : "hover:bg-accent"}`}
                  title={task.completed ? "Done" : "Mark as done"}
                >
                  <Check size={18} className={task.completed ? "text-blue-600" : "text-muted-foreground"} />
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      {/* Goals/Progress Card */}
      <Card className="col-span-1 xl:row-span-2 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUp size={20} />
            Goal Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockData.goals.map((goal) => (
              <div key={goal.label} className="p-2 rounded-md border bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium">{goal.label}</span>
                    <span className="ml-2 text-xs text-muted-foreground">({goal.target})</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-accent">{goal.streak}d streak</span>
                </div>
                <Progress value={goal.progress * 100} className="h-2 my-2 bg-accent/40" />
                <span className="block text-xs mt-1 text-muted-foreground">{goal.catchUp}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Points/Rewards Card */}
      <Card className="col-span-1 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare size={20} />
            Points & Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <span className="text-4xl font-extrabold text-primary">{mockData.points}</span> <span className="text-muted-foreground">pts</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="font-semibold text-xs mb-1">Rewards</div>
              <ul className="list-disc ml-4 space-y-1 text-green-600">
                {mockData.rewards.map(r => <li key={r}>{r}</li>)}
              </ul>
            </div>
            <div>
              <div className="font-semibold text-xs mb-1">Punishments</div>
              <ul className="list-disc ml-4 space-y-1 text-red-500">
                {mockData.punishments.map(p => <li key={p}>{p}</li>)}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

