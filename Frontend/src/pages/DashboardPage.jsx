import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Welcome, {user?.fullName}!</h1>
      <p className="text-muted-foreground">{user?.email}</p>
      <Button variant="outline" onClick={handleLogout}>Logout</Button>
    </div>
  )
}
