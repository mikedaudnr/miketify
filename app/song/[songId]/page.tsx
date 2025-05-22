"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

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
}

export default function SongDetailPage({ params }: { params: Promise<{ songId: string }> }) {
  const { songId } = use(params)  // ✅ Unwrap params dengan React.use()
  const [song, setSong] = useState<Song | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const fetchSongDetails = async () => {
      try {
        const response = await fetch(`https://learn.smktelkom-mlg.sch.id/ukl2/playlists/song/${songId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch song details")
        }

        if (data.success) {
          setSong(data.data)
        } else {
          throw new Error(data.message || "Failed to fetch song details")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchSongDetails()
  }, [songId, router])

  const getYoutubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (e) {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading song details...</p>
        </div>
      </div>
    )
  }

  if (error || !song) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error || "Song not found"}</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const videoId = getYoutubeVideoId(song.source)

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {videoId ? (
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={song.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          ) : (
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <Image
                src={`https://learn.smktelkom-mlg.sch.id/ukl2/thumbnail/${song.thumbnail}`}
                alt={song.title}
                fill
                className="object-cover"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=400&width=800"
                }}
              />
            </div>
          )}

          <div className="mt-6">
            <h1 className="text-3xl font-bold">{song.title}</h1>
            <p className="text-xl text-muted-foreground mt-1">{song.artist}</p>

            <div className="flex items-center mt-4 text-muted-foreground">
              <Heart className="h-5 w-5 mr-2" />
              <span>{song.likes.toLocaleString()} likes</span>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">{song.description}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Comments ({song.comments.length})</h2>

          {song.comments.length === 0 ? (
            <p className="text-muted-foreground">No comments yet.</p>
          ) : (
            <div className="space-y-4">
              {song.comments.map((comment, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold">{comment.creator}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatDate(comment.createdAt)}</span>
                      </div>
                    </div>
                    <p className="mt-2">{comment.comment_text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
