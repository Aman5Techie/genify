// API service for video generation

const BASE_URL =  'http://127.0.0.1:5000';

export const submitPrompt = async (prompt) => {
  const response = await fetch(`${BASE_URL}/api/submit_prompt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });
  
  if (!response.ok) {
    throw new Error(`API responded with status: ${response.status}`);
  }
  
  return response.json();
};

export const checkJobStatus = async (jobId) => {
  const response = await fetch(`${BASE_URL}/api/job_status?job_id=${jobId}`);
  
  if (!response.ok) {
    throw new Error(`API responded with status: ${response.status}`);
  }
  
  return response.json();
};