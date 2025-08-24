import { calculateCosineSimilarity, calculateJaccardSimilarity } from './textAnalysis.js';

export async function analyzeFiles(files) {
  if (!files || files.length < 2) {
    throw new Error('At least 2 files are required for analysis');
  }

  const results = [];

  for (let i = 0; i < files.length; i++) {
    for (let j = i + 1; j < files.length; j++) {
      try {
        const result = compareTexts(files[i], files[j]);
        results.push(result);
      } catch (error) {
        console.error(`Error comparing ${files[i].name} and ${files[j].name}:`, error);
        results.push(createResult(files[i], files[j], 0.0));
      }
    }
  }

  return results;
}

function compareTexts(file1, file2) {
  if (!file1?.content || !file2?.content) {
    return createResult(file1, file2, 0.0);
  }

  const text1 = preprocessText(file1.content);
  const text2 = preprocessText(file2.content);
  
  if (text1 === text2) {
    return createResult(file1, file2, 100.0);
  }
  
  if (text1.length < 10 || text2.length < 10) {
    return createResult(file1, file2, 0.0);
  }

  try {
    const cosineSim = calculateCosineSimilarity(text1, text2);
    const jaccardSim = calculateJaccardSimilarity(text1, text2);
    const wordSim = calculateWordSimilarity(text1, text2);

    const finalSimilarity = (cosineSim * 0.5 + jaccardSim * 0.3 + wordSim * 0.2) * 100;
    
    return createResult(file1, file2, Math.max(0, Math.min(100, finalSimilarity)));
  } catch (error) {
    console.error('Error in similarity calculation:', error);
    return createResult(file1, file2, 0.0);
  }
}

function preprocessText(text) {
  if (typeof text !== 'string') {
    return '';
  }
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function calculateWordSimilarity(text1, text2) {
  if (!text1 || !text2) return 0;
  
  const words1 = new Set(text1.split(' ').filter(w => w.length > 2));
  const words2 = new Set(text2.split(' ').filter(w => w.length > 2));
  
  if (words1.size === 0 && words2.size === 0) return 1;
  if (words1.size === 0 || words2.size === 0) return 0;
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return union.size === 0 ? 0 : intersection.size / union.size;
}

function createResult(file1, file2, similarity) {
  return {
    id: `${file1?.id || 'unknown'}-${file2?.id || 'unknown'}`,
    file1: file1 || { name: 'Unknown', id: 'unknown' },
    file2: file2 || { name: 'Unknown', id: 'unknown' },
    similarity: Number(similarity.toFixed(2))
  };
}