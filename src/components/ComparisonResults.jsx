import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Download } from 'lucide-react';
import SimilarityMeter from './SimilarityMeter.jsx';

const ComparisonResults = ({ results }) => {
  const [sortBy, setSortBy] = useState('similarity');

  const getSimilarityLevel = (similarity) => {
    if (similarity >= 70) return { level: 'High Risk', color: 'red' };
    if (similarity >= 40) return { level: 'Medium Risk', color: 'yellow' };
    return { level: 'Low Risk', color: 'green' };
  };

  const sortedResults = [...results].sort((a, b) => {
    return sortBy === 'similarity' ? b.similarity - a.similarity : a.file1.name.localeCompare(b.file1.name);
  });

  const exportResults = () => {
    const data = {
      timestamp: new Date().toISOString(),
      results: results.map(r => ({
        file1: r.file1.name,
        file2: r.file2.name,
        similarity: r.similarity
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plagiarism-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const highRisk = results.filter(r => r.similarity >= 70).length;
  const mediumRisk = results.filter(r => r.similarity >= 40 && r.similarity < 70).length;
  const lowRisk = results.filter(r => r.similarity < 40).length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Analysis Results</h2>
            <p className="text-sm text-slate-600 mt-1">{results.length} comparisons found</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="similarity">Sort by Similarity</option>
              <option value="name">Sort by Name</option>
            </select>
            
            <button
              onClick={exportResults}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <span className="text-sm font-medium text-slate-600">Average Similarity</span>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {(results.reduce((sum, r) => sum + r.similarity, 0) / results.length).toFixed(1)}%
            </p>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-red-600">High Risk</span>
            </div>
            <p className="text-2xl font-bold text-red-900 mt-2">{highRisk}</p>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-600">Medium Risk</span>
            </div>
            <p className="text-2xl font-bold text-yellow-900 mt-2">{mediumRisk}</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">Low Risk</span>
            </div>
            <p className="text-2xl font-bold text-green-900 mt-2">{lowRisk}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sortedResults.map((result) => {
          const { level, color } = getSimilarityLevel(result.similarity);
          
          return (
            <div key={result.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      color === 'red' ? 'bg-red-100 text-red-800' :
                      color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {level}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    {result.file1.name} vs {result.file2.name}
                  </h3>
                  
                  <div className="text-sm text-slate-600">
                    Similarity Score: {result.similarity.toFixed(1)}%
                  </div>
                </div>
                
                <SimilarityMeter similarity={result.similarity} size="large" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComparisonResults;