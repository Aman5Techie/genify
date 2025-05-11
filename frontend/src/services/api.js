// API service for video generation

import { INTIAL_VIDEO } from "./asset_list";


export const submitPrompt = async (prompt) => {
   return new Promise((resolve) => {
    setTimeout(() => {
      const jobId = Math.floor(Math.random() * 1000); // Simulate job ID
      resolve({job_id: jobId});
    }, 2000);
  });
};

export const checkJobStatus = async (jobId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({status : 'done', video_url: INTIAL_VIDEO});
    }, 5000);
  });
};