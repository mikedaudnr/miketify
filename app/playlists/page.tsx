"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music, LogOut, Plus } from "lucide-react"

interface Playlist {
  uuid: string
  playlist_name: string
  song_count: number
}

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    // Fetch playlists
    const fetchPlaylists = async () => {
      try {
        const response = await fetch("https://learn.smktelkom-mlg.sch.id/ukl2/playlists")
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch playlists")
        }

        if (data.success) {
          setPlaylists(data.data)
        } else {
          throw new Error(data.message || "Failed to fetch playlists")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchPlaylists()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading playlists...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Song Playlists</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/add-song")}>
            <Plus className="mr-2 h-4 w-4" /> Add Song
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <Card
            key={playlist.uuid}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(`/playlists/${playlist.uuid}`)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{playlist.playlist_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-muted-foreground">
                <Music className="mr-2 h-5 w-5" />
                <span>{playlist.song_count} songs</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full">
                View Songs
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
