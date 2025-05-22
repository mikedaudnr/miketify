"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Music, Heart, MessageSquare, ArrowLeft } from "lucide-react"

interface Comment {
  comment_text: string
  creator: string
  createdAt: string
}

interface Song {
  uuid: string
  title: string
  artist: string
  description: string
  source: string
  thumbnail: string
  likes: number
  comments: Comment[]
  playlist_name?: string
}

export default function SongListPage({ params }: { params: Promise<{ playlistId: string }> }) {
  const { playlistId } = use(params)
  const [songs, setSongs] = useState<Song[]>([])
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [playlistName, setPlaylistName] = useState("")
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const fetchSongs = async () => {
      try {
        const response = await fetch(`https://learn.smktelkom-mlg.sch.id/ukl2/playlists/song-list/${playlistId}`)
        const data = await response.json()

        if (!response.ok) throw new Error(data.message || "Failed to fetch songs")

        const songsArray: Song[] = Array.isArray(data) ? data : data.data || []

        setSongs(songsArray)
        setFilteredSongs(songsArray)
        setPlaylistName(songsArray[0]?.playlist_name || "")
        setLoading(false)
      } catch (err: any) {
        setError(err.message || "Something went wrong")
        setLoading(false)
      }
    }

    fetchSongs()
  }, [playlistId, router])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSongs(songs)
    } else {
      const term = searchTerm.toLowerCase()
      const filtered = songs.filter(
        (song) =>
          song.title.toLowerCase().includes(term) ||
          song.artist.toLowerCase().includes(term)
      )
      setFilteredSongs(filtered)
    }
  }, [searchTerm, songs])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading songs...</p>
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
      <Button variant="ghost" className="mb-4" onClick={() => router.push("/playlists")}>        
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Playlists
      </Button>

      <h1 className="text-3xl font-bold mb-6">{playlistName || "Playlist Songs"}</h1>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by song title or artist..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {Array.isArray(filteredSongs) && filteredSongs.length === 0 ? (
        <div className="text-center py-12">
          <Music className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg">No songs found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(filteredSongs) && filteredSongs.map((song) => (
            <Card
              key={song.uuid}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/song/${song.uuid}`)}
            >
              <div className="aspect-video relative">
                <Image
                  src={`https://learn.smktelkom-mlg.sch.id/ukl2/thumbnail/${song.thumbnail}`}
                  alt={song.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=400"
                  }}
                />
              </div>
              <CardContent className="pt-4">
                <h3 className="font-bold text-lg truncate">{song.title}</h3>
                <p className="text-muted-foreground">{song.artist}</p>
                <p className="line-clamp-2 text-sm mt-2">{song.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Heart className="mr-1 h-4 w-4" />
                  <span>{song.likes.toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="mr-1 h-4 w-4" />
                  <span>{song.comments.length}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
