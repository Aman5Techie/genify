import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { submitPrompt, checkJobStatus } from '../services/api';
import PromptForm from './PromptForm';
import VideoDisplay from './VideoDisplay';
import ErrorDisplay from './ErrorDisplay';
import VideoShower from '../video_component/VideoShower';


function VideoGenerator() {
  const [jobId, setJobId] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  
  // Mutation for submitting a prompt
  const submitMutation = useMutation({
    mutationFn: submitPrompt,
    onSuccess: (data) => {
      setJobId(data.job_id);
    },
  });
  
  // Query for checking job status - only enabled when we have a jobId
  const statusQuery = useQuery({
    queryKey: ['jobStatus', jobId],
    queryFn: () => checkJobStatus(jobId),
    enabled: !!jobId, // Only run when jobId exists
    refetchInterval: (queryInfo) => {
      console.log("RefetchInterval callback with data:", queryInfo?.state?.data);
      
      // If completed or failed, stop polling
      if (queryInfo?.state?.data?.status === 'done' || queryInfo?.state?.data?.status === 'failed') {
        console.log("Polling stopped, status:", queryInfo?.state?.data?.status);
        return false; // Stop polling
      }
      // Otherwise, poll every 5 seconds
      return 5000;
    },
  });

  // Use useEffect to react to changes in statusQuery.data
  useEffect(() => {
    if (statusQuery.data) {
      console.log('Job status from useEffect:', statusQuery.data.status);
      
      if (statusQuery.data.status === 'done') {
        console.log('Job completed, setting video URL:', statusQuery.data.video_url);
        setVideoUrl(statusQuery.data.video_url);
        setJobId(null); // Clear job ID
      }
    }
  }, [statusQuery.data]);

  const handleSubmit = (promptText) => {

    submitMutation.mutate(promptText);
  };

  const resetForm = () => {
    setVideoUrl('');
    setJobId(null);
  };

  // For debugging
  useEffect(() => {
    if (statusQuery.isSuccess) {
      console.log("Query successful with data:", statusQuery.data);
    }
    if (statusQuery.isError) {
      console.log("Query error:", statusQuery.error);
    }
  }, [statusQuery.isSuccess, statusQuery.isError, statusQuery.data, statusQuery.error]);

  // Determine if there's an error from either the mutation or query
  const error = submitMutation.error?.message || 
                (statusQuery.data?.status === 'failed' ? 'Video generation failed' : null);

  // Determine if loading
  const isLoading = submitMutation.isPending || (jobId && !statusQuery.isError);

  return (
    <>
      {!videoUrl && !error ? (
        <PromptForm 
          onSubmit={handleSubmit} 
          isLoading={isLoading} 
          jobId={jobId} 
        />
      ) : error ? (
        <ErrorDisplay error={error} onReset={resetForm} />
      ) : (
      <VideoShower videoUrl={{
        id: 'video_1',
        url: videoUrl,
        title: 'Video 1',
      }}/>
      )}

    
    </>

  );
}

export default VideoGenerator;