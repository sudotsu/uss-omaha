'use client'

import { useState } from 'react'

interface RenamerClientProps {
  files: string[]
}

export function RenamerClient({ files }: RenamerClientProps) {
  const [renames, setRenames] = useState<Record<string, string>>({})
  const [script, setScript] = useState('')

  const handleRename = (original: string, newName: string) => {
    setRenames((prev) => ({
      ...prev,
      [original]: newName,
    }))
  }

  const generateScript = () => {
    let psScript = '# Rename Script\n'
    psScript += '$source = "public/temp_renamer_images"\n'
    psScript += '$dest = "public/images"\n\n'
    psScript += 'Write-Host "Starting batch rename..."\n\n'

    Object.entries(renames).forEach(([original, newName]) => {
      if (!newName.trim()) return

      const cleanName = newName.trim().replace(/\s+/g, '-').toLowerCase()
      // Preserve extension
      const ext = original.split('.').pop()
      const finalName = cleanName.endsWith(`.${ext}`) ? cleanName : `${cleanName}.${ext}`

      psScript += `Move-Item -Path "$source/${original}" -Destination "$dest/${finalName}" -Force\n`
    })

    psScript += '\nWrite-Host "Done!"'
    setScript(psScript)
  }

  return (
    <div className="bg-slate-900 text-white min-h-screen p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 sticky top-0 bg-slate-900/95 p-4 border-b border-slate-700 z-10">
          <div>
            <h1 className="text-3xl font-bold text-yellow-500">USS Omaha Image Renamer</h1>
            <p className="text-slate-400">Found {files.length} images in extracted folder</p>
          </div>
          <div className="flex gap-4">
             <button
              onClick={generateScript}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-bold transition-colors"
            >
              Generate PowerShell Script
            </button>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {files.map((file) => (
            <div key={file} className="bg-slate-800 rounded-lg p-3 border border-slate-700 hover:border-yellow-500/50 transition-colors">
              <div className="aspect-[4/3] bg-black/50 mb-3 rounded flex items-center justify-center overflow-hidden relative group">
                {/* Use regex to check for image extensions to be safe */}
                {/\.(jpg|jpeg|png|gif|webp)$/i.test(file) ? (
                   <img
                    src={`/temp_renamer_images/${file}`}
                    alt={file}
                    className="object-contain max-h-full max-w-full"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-xs text-slate-500">Not an image</span>
                )}
                <div className="absolute top-1 left-1 bg-black/70 text-xs px-1 rounded text-slate-300">
                  {file}
                </div>
              </div>

              <input
                type="text"
                placeholder="new-name (e.g. hero)"
                className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-yellow-500"
                value={renames[file] || ''}
                onChange={(e) => handleRename(file, e.target.value)}
              />
            </div>
          ))}
        </div>

        {script && (
          <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t-2 border-yellow-500 p-8 shadow-2xl z-50 h-[40vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Generated Script</h3>
              <button
                onClick={() => setScript('')}
                className="text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <textarea
              className="flex-1 w-full bg-slate-800 text-green-400 font-mono p-4 rounded text-sm overflow-auto"
              readOnly
              value={script}
              onClick={(e) => e.currentTarget.select()}
            />
            <p className="mt-2 text-sm text-slate-400">
              Copy above script and run in terminal. It will move renamed files to /public/images.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
