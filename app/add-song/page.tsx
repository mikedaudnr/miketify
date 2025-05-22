"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, Upload } from "lucide-react"

export default function AddSongPage() {
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [description, setDescription] = useState("")
  const [source, setSource] = useState("")
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Check if user is logged in
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    }
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be less than 2MB")
        return
      }

      // Check file type
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        setError("Only JPG, JPEG, and PNG files are allowed")
        return
      }

      setThumbnail(file)
      setThumbnailPreview(URL.createObjectURL(file))
      setError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // Validate form
    if (!title || !artist || !description || !source || !thumbnail) {
      setError("All fields are required")
      setLoading(false)
      return
    }

    // Create form data
    const formData = new FormData()
    formData.append("title", title)
    formData.append("artist", artist)
    formData.append("description", description)
    formData.append("source", source)
    formData.append("thumbnail", thumbnail)

    try {
      const response = await fetch("https://learn.smktelkom-mlg.sch.id/ukl2/playlists/song", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to add song")
      }

      if (data.success) {
        setSuccess("Song added successfully!")
        // Reset form
        setTitle("")
        setArtist("")
        setDescription("")
        setSource("")
        setThumbnail(null)
        setThumbnailPreview(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } else {
        throw new Error(data.message || "Failed to add song")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" className="mb-4" onClick={() => router.push("/playlists")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Playlists
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Add New Song</CardTitle>
          <CardDescription>Fill in the details to add a new song to the playlist</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter song title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="artist">Artist</Label>
              <Input
                id="artist"
                placeholder="Enter artist name"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter song description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source URL (YouTube)</Label>
              <Input
                id="source"
                placeholder="https://youtu.be/..."
                value={source}
                onChange={(e) => setSource(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail Image</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {thumbnail ? "Change Image" : "Upload Image"}
                </Button>
                <Input
                  id="thumbnail"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleThumbnailChange}
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden"
                  required
                />
              </div>

              {thumbnailPreview && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                  <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-md">
                    <img
                      src={thumbnailPreview || "/placeholder.svg"}
                      alt="Thumbnail preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              )}

              <p className="text-xs text-muted-foreground mt-1">Max size: 2MB. Allowed formats: JPG, JPEG, PNG</p>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? "Adding Song..." : "Add Song"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
