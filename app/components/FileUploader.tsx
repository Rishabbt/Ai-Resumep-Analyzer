import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { formatSize } from '../lib/utils'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;
        onFileSelect?.(file);
    }, [onFileSelect]);

    const maxFileSize = 20 * 1024 * 1024;

    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf'] },
        maxSize: maxFileSize,
    });

    const file = acceptedFiles[0] || null;

    return (
        <div>
            {file ? (
                <div className="dark-selected-file">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img src="/images/pdf.png" alt="pdf" style={{ width: 28, height: 28 }} />
                        <div>
                            <div className="dark-file-name">{file.name}</div>
                            <div className="dark-file-size">{formatSize(file.size)}</div>
                        </div>
                    </div>
                    <button
                        className="dark-file-remove"
                        onClick={(e) => { e.stopPropagation(); onFileSelect?.(null); }}
                    >
                        ✕
                    </button>
                </div>
            ) : (
                <div
                    className="dark-drop-zone"
                    style={{ borderColor: isDragActive ? 'var(--accent-blue)' : undefined }}
                    {...getRootProps()}
                >
                    <input {...getInputProps()} />
                    <div className="dark-drop-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M17 8l-5-5-5 5M12 3v12" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div className="dark-drop-text">
                        <span>Click to upload</span> or drag & drop
                    </div>
                    <div className="dark-drop-sub">PDF only · max {formatSize(maxFileSize)}</div>
                </div>
            )}
        </div>
    );
};

export default FileUploader;