'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Document {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export default function MarkdownStudio() {
  const { data: session } = useSession()
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(true)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const res = await fetch("/api/documents")
      const data = await res.json()
      setDocuments(data)
    } catch (error) {
      console.error("Failed to fetch documents:", error)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/documents", {
        method: selectedDoc ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedDoc?.id,
          title,
          content,
        }),
      })

      if (res.ok) {
        await fetchDocuments()
        setTitle("")
        setContent("")
        setSelectedDoc(null)
      }
    } catch (error) {
      console.error("Failed to save document:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return

    try {
      const res = await fetch("/api/documents", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (res.ok) {
        await fetchDocuments()
        if (selectedDoc?.id === id) {
          setSelectedDoc(null)
          setTitle("")
          setContent("")
        }
      }
    } catch (error) {
      console.error("Failed to delete document:", error)
    }
  }

  const handleSelectDoc = (doc: Document) => {
    setSelectedDoc(doc)
    setTitle(doc.title)
    setContent(doc.content)
  }

  const handleNew = () => {
    setSelectedDoc(null)
    setTitle("")
    setContent("")
  }

  return (
    <div className="h-full flex gap-6">
      {/* Documents List */}
      <div className="w-80 border border-[var(--border-color)] rounded-lg p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Documents</h2>
          <button
            onClick={handleNew}
            className="px-3 py-1 bg-[var(--office-blue)] text-white rounded-md hover:bg-[var(--office-blue-hover)] text-sm"
          >
            New
          </button>
        </div>

        <div className="space-y-2">
          {documents.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No documents yet</p>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className={`p-3 rounded-md cursor-pointer hover:bg-gray-50 ${
                  selectedDoc?.id === doc.id ? "bg-blue-50 border border-[var(--office-blue)]" : "border border-[var(--border-color)]"
                }`}
                onClick={() => handleSelectDoc(doc)}
              >
                <h3 className="font-medium truncate">{doc.title || "Untitled"}</h3>
                <p className="text-xs text-gray-500 truncate">{doc.content}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Editor and Preview */}
      <div className="flex-1 border border-[var(--border-color)] rounded-lg p-6">
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document Title"
              className="flex-1 text-2xl font-semibold border-none focus:outline-none mr-4"
            />
            <button
              onClick={() => setPreview(!preview)}
              className="px-3 py-1 border border-[var(--border-color)] rounded-md hover:bg-gray-50 text-sm"
            >
              {preview ? "Edit Mode" : "Preview Mode"}
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {preview ? (
              <div className="h-full overflow-y-auto prose max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content || "*Start typing to see preview...*"}
                </ReactMarkdown>
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your markdown here..."
                className="w-full h-full border-none focus:outline-none resize-none font-mono"
              />
            )}
          </div>

          <div className="flex gap-2 pt-4 border-t border-[var(--border-color)]">
            <button
              onClick={handleSave}
              disabled={loading || !title}
              className="px-4 py-2 bg-[var(--office-blue)] text-white rounded-md hover:bg-[var(--office-blue-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            {selectedDoc && (
              <button
                onClick={() => handleDelete(selectedDoc.id)}
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
