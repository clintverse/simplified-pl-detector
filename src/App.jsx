import React, { useState } from 'react';
import { FileText, Upload, AlertTriangle } from 'lucide-react';
import FileUpload from './components/FileUpload.jsx';
import ComparisonResults from './components/ComparisonResults.jsx';
import { analyzeFiles } from './utils/analysisEngine.js';

function App() {
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const handleFilesUpload = (uploadedFiles) => {
    setFiles(uploadedFiles);
    setResults([]);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (files.length < 2) {
      setError('Please upload at least 2 files for comparison');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const analysisResults = await analyzeFiles(files);
      setResults(analysisResults);
    } catch (err) {
      setError('Analysis failed. Please check your files and try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearFiles = () => {
    setFiles([]);
    setResults([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Plagiarism Detector</h1>
              <p className="text-sm text-slate-600">Document similarity analysis system</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Text Similarity Analysis</h2>
          <p className="text-lg text-slate-600">Upload documents to detect potential plagiarism</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <FileUpload onFilesUpload={handleFilesUpload} isAnalyzing={isAnalyzing} />
          </div>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Analysis Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Files uploaded:</span>
                  <span className="text-sm font-medium">{files.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Status:</span>
                  <span className={`text-sm font-medium ${files.length >= 2 ? 'text-green-600' : 'text-orange-600'}`}>
                    {files.length >= 2 ? 'Ready' : 'Need more files'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={files.length < 2 || isAnalyzing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  <span>Start Analysis</span>
                </>
              )}
            </button>
            
            {files.length > 0 && (
              <button
                onClick={clearFiles}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-lg"
              >
                Clear Files
              </button>
            )}
          </div>
        </div>

        {results.length > 0 && (
          <ComparisonResults results={results} />
        )}
      </main>
    </div>
  );
}

export default App;