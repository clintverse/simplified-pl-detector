import { calculateCosineSimilarity, calculateJaccardSimilarity } from './textAnalysis.js';

export async function analyzeFiles(files) {
  const results = [];

  for (let i = 0; i < files.length; i++) {
    for (let j = i + 1; j < files.length; j++) {
      const result = compareTexts(files[i], files[j]);
      results.push(result);
    }
  }

  return results;
}

function compareTexts(file1, file2) {
  const text1 = preprocessText(file1.content);
  const text2 = preprocessText(file2.content);
  
  if (text1 === text2) {
    return createResult(file1, file2, 100.0);
  }
  
  if (text1.length < 10 || text2.length < 10) {
    return createResult(file1, file2, 0.0);
  }

  const cosineSim = calculateCosineSimilarity(text1, text2);
  const jaccardSim = calculateJaccardSimilarity(text1, text2);
  const wordSim = calculateWordSimilarity(text1, text2);

  const finalSimilarity = (cosineSim * 0.5 + jaccardSim * 0.3 + wordSim * 0.2) * 100;
  
  return createResult(file1, file2, Math.max(0, Math.min(100, finalSimilarity)));
}

function preprocessText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function calculateWordSimilarity(text1, text2) {
  const words1 = new Set(text1.split(' ').filter(w => w.length > 2));
  const words2 = new Set(text2.split(' ').filter(w => w.length > 2));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return union.size === 0 ? 0 : intersection.size / union.size;
}

function createResult(file1, file2, similarity) {
  return {
    id: `${file1.id}-${file2.id}`,
    file1,
    file2,
    similarity: Number(similarity.toFixed(2))
  };
}
