import React from 'react'
import { useParams } from 'react-router-dom'

const ComponentDetail = () => {
  const { id } = useParams()

  const getPreviewText = () => {
    if (id === 'button-1') return 'Preview of Button 1'
    if (id === 'button-2') return 'Preview of Button 2'
    return 'Select a button to see preview'
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-5xl font-extrabold text-white">{id ? id.replace(/-/g, ' ').toUpperCase() : 'Component'}</h1>
          <p className="text-zinc-400 mt-2">Preview for {id || 'component'}</p>
        </div>
      </div>

      <div className="bg-white/2 rounded-xl p-8 mb-8 h-72 flex items-center justify-center">
        <div className="text-3xl text-violet-300 font-semibold">{getPreviewText()}</div>
      </div>
    </div>
  )
}

export default ComponentDetail