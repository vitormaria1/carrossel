'use client';

import { useCarouselStore } from '@/lib/store';
import { useRef, useState } from 'react';

export function DocumentUpload() {
  const { docs, addDoc, removeDoc } = useCarouselStore();
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.id) {
          addDoc({ id: data.id, name: data.name, type: data.type, size: data.size, uploadedAt: Date.now() });
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
    setUploading(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleUpload(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer"
        style={{
          borderColor: dragActive ? '#3b82f6' : '#e5e7eb',
          backgroundColor: dragActive ? '#eff6ff' : '#f9fafb'
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.txt,.doc,.docx"
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
          className="hidden"
        />
        <div className="text-center">
          <div className="text-2xl mb-2">📄</div>
          <p className="text-sm font-semibold text-gray-900">
            {uploading ? 'Enviando...' : 'Clique ou arraste'}
          </p>
          <p className="text-xs text-gray-500 mt-1">PDF, TXT, DOC, DOCX</p>
        </div>
      </div>

      {docs.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-xs font-bold text-blue-900 uppercase tracking-wide mb-2">
            📚 Docs ({docs.length})
          </p>
          <div className="space-y-2">
            {docs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between bg-white p-2 rounded border border-blue-100">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{doc.name}</p>
                  <p className="text-xs text-gray-500">{(doc.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  onClick={() => removeDoc(doc.id)}
                  className="ml-2 text-red-600 hover:text-red-700 font-bold text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
