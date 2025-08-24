import React, { useState, useRef } from 'react';
import { Upload, File, X } from 'lucide-react';

const FileUpload = ({ onFilesUpload, isAnalyzing }) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    const validTypes = ['.txt', '.doc', '.docx'];
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(extension)) {
      return `File type not supported. Use: ${validTypes.join(', ')}`;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      return 'File too large (max 5MB)';
    }
    
    return null;
  };

  const processFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          id: Date.now() + Math.random(),
          name: file.name,
          content: e.target.result,
          size: file.size
        });
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const handleFiles = async (fileList) => {
    const newFiles = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const error = validateFile(file);
      
      if (error) {
        alert(`${file.name}: ${error}`);
        continue;
      }

      try {
        const fileData = await processFile(file);
        newFiles.push(fileData);
      } catch (err) {
        alert(`Failed to process ${file.name}`);
      }
    }

    if (newFiles.length > 0) {
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      onFilesUpload(updatedFiles);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (!isAnalyzing && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (fileId) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    onFilesUpload(updatedFiles);
  };

  return (
    <div className="space-y-6">
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          if (!isAnalyzing) setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? 'border-blue-400 bg-blue-50' : 'border-slate-300'
        } ${isAnalyzing ? 'opacity-50' : 'cursor-pointer'}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".txt,.doc,.docx"
          onChange={handleFileInput}
          disabled={isAnalyzing}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Upload className="w-8 h-8 text-slate-400" />
        </div>
        
        <h3 className="text-lg font-medium text-slate-900 mb-2">Upload Files</h3>
        <p className="text-sm text-slate-600 mb-4">Drag files here or click to browse</p>
        <p className="text-xs text-slate-500">Supports: .txt, .doc, .docx (max 5MB)</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Uploaded Files ({files.length})</h3>
          
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-4 bg-white rounded-lg border shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <File className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              
              <button
                onClick={() => removeFile(file.id)}
                disabled={isAnalyzing}
                className="p-2 text-slate-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;