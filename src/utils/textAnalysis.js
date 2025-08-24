export function calculateCosineSimilarity(text1, text2) {
  const words1 = tokenize(text1);
  const words2 = tokenize(text2);
  
  const allWords = [...new Set([...words1, ...words2])];
  
  if (allWords.length === 0) return 0;
  
  const vector1 = createVector(words1, allWords);
  const vector2 = createVector(words2, allWords);
  
  return cosineSimilarity(vector1, vector2);
}

export function calculateJaccardSimilarity(text1, text2) {
  const words1 = new Set(tokenize(text1));
  const words2 = new Set(tokenize(text2));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return union.size === 0 ? 0 : intersection.size / union.size;
}

function tokenize(text) {
  return text
    .split(' ')
    .filter(word => word.length > 2 && !isStopWord(word));
}

function createVector(words, vocabulary) {
  const vector = new Array(vocabulary.length).fill(0);
  
  vocabulary.forEach((word, index) => {
    vector[index] = words.filter(w => w === word).length;
  });
  
  return vector;
}

function cosineSimilarity(vector1, vector2) {
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  
  for (let i = 0; i < vector1.length; i++) {
    dotProduct += vector1[i] * vector2[i];
    magnitude1 += vector1[i] * vector1[i];
    magnitude2 += vector2[i] * vector2[i];
  }
  
  const magnitude = Math.sqrt(magnitude1) * Math.sqrt(magnitude2);
  
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

function isStopWord(word) {
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'shall', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'this', 'that', 'these', 'those'];
  
  return stopWords.includes(word);
}