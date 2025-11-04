'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export default function Notes() {
  const { data: session } = useSession()
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes")
      const data = await res.json()
      setNotes(data)
    } catch (error) {
      console.error("Failed to fetch notes:", error)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/notes", {
        method: selectedNote ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedNote?.id,
          title,
          content,
        }),
      })

      if (res.ok) {
        await fetchNotes()
        setTitle("")
        setContent("")
        setSelectedNote(null)
      }
    } catch (error) {
      console.error("Failed to save note:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return

    try {
      const res = await fetch("/api/notes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (res.ok) {
        await fetchNotes()
        if (selectedNote?.id === id) {
          setSelectedNote(null)
          setTitle("")
          setContent("")
        }
      }
    } catch (error) {
      console.error("Failed to delete note:", error)
    }
  }

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note)
    setTitle(note.title)
    setContent(note.content)
  }

  const handleNew = () => {
    setSelectedNote(null)
    setTitle("")
    setContent("")
  }

  return (
    <div className="h-full flex gap-6">
      {/* Notes List */}
      <div className="w-80 border border-[var(--border-color)] rounded-lg p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">My Notes</h2>
          <button
            onClick={handleNew}
            className="px-3 py-1 bg-[var(--office-blue)] text-white rounded-md hover:bg-[var(--office-blue-hover)] text-sm"
          >
            New
          </button>
        </div>

        <div className="space-y-2">
          {notes.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No notes yet</p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className={`p-3 rounded-md cursor-pointer hover:bg-gray-50 ${
                  selectedNote?.id === note.id ? "bg-blue-50 border border-[var(--office-blue)]" : "border border-[var(--border-color)]"
                }`}
                onClick={() => handleSelectNote(note)}
              >
                <h3 className="font-medium truncate">{note.title || "Untitled"}</h3>
                <p className="text-xs text-gray-500 truncate">{note.content}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 border border-[var(--border-color)] rounded-lg p-6">
        <div className="h-full flex flex-col">
          <div className="mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note Title"
              className="w-full text-2xl font-semibold border-none focus:outline-none"
            />
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing your note..."
            className="flex-1 w-full border-none focus:outline-none resize-none"
          />

          <div className="flex gap-2 pt-4 border-t border-[var(--border-color)]">
            <button
              onClick={handleSave}
              disabled={loading || !title}
              className="px-4 py-2 bg-[var(--office-blue)] text-white rounded-md hover:bg-[var(--office-blue-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            {selectedNote && (
              <button
                onClick={() => handleDelete(selectedNote.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
