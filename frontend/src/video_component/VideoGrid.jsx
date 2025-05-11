import React from 'react';
import { useVideoContext } from '../context/VideoContext';
import { Plus, GripVertical, Play } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Create a sortable video item component
const SortableVideoItem = ({
  video,
  index,
  setSelectedVideoIndex,
  selectedVideoIndex,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `video-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSelected = index === selectedVideoIndex;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mb-2 p-2 rounded-md border-2 
        ${isDragging ? "bg-gray-600" : "bg-gray-800"} 
        ${isSelected ? "border-purple-500" : "border-transparent"}`}
    >
      <div className="flex items-center gap-3">
        <div
          {...attributes}
          {...listeners}
          className="p-2 cursor-grab bg-gray-700 hover:bg-gray-600 rounded"
        >
          <GripVertical size={16} className="text-gray-300" />
        </div>

        <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full">
          <span className="text-sm font-medium text-white">{index + 1}</span>
        </div>

        <div
          className="flex-1 flex items-center gap-3 cursor-pointer"
          onClick={() => setSelectedVideoIndex(index)}
        >
          <div className="w-20 aspect-video bg-black rounded overflow-hidden">
            <video
              src={video.url}
              className="w-full h-full object-cover"
              preload="metadata"
            />
          </div>

          <div>
            <p className="text-sm text-white font-medium">
              {video.title || `Video ${index + 1}`}
            </p>
          </div>
        </div>

        <button
          className="p-2 bg-purple-600 hover:bg-purple-700 rounded-full"
          onClick={() => setSelectedVideoIndex(index)}
        >
          <Play size={14} className="text-white" />
        </button>
      </div>
    </div>
  );
};

function VideoGrid({ onAddVideo }) {
  const { videos, setSelectedVideoIndex, reorderVideos, selectedVideoIndex } = useVideoContext();

  console.log("VideoGrid videos:", videos);
  
  // Set up sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle the end of a drag operation
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    // Return if dropped outside the list or if there's no over element
    if (!over) return;
    
    const sourceId = active.id;
    const destinationId = over.id;
    
    // If the source and destination are the same, no need to reorder
    if (sourceId === destinationId) return;
    
    // Extract indices from the IDs
    const sourceIndex = parseInt(sourceId.split('-')[1]);
    const destinationIndex = parseInt(destinationId.split('-')[1]);
    
    // Call the reorderVideos function from context
    reorderVideos(sourceIndex, destinationIndex);
  };

  return (
    <div className="max-h-[400px] overflow-y-auto pr-2">
      <h3 className="text-white font-medium mb-3 px-2">Video Sequence</h3>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="p-2 rounded-md">
          <SortableContext 
            items={videos.map((_, index) => `video-${index}`)} 
            strategy={verticalListSortingStrategy}
          >
            {videos.map((video, index) => (
              <SortableVideoItem 
                key={`video-${index}`} 
                video={video} 
                index={index}
                setSelectedVideoIndex={setSelectedVideoIndex}
                selectedVideoIndex={selectedVideoIndex}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
      
      <button 
        onClick={onAddVideo}
        className="w-full mt-4 bg-gray-800 hover:bg-gray-700 rounded-lg py-2 px-3 flex items-center justify-center gap-2 transition-colors duration-300 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <Plus className="text-purple-400" size={20} />
        <span className="text-white text-sm font-medium">Add Video</span>
      </button>
    </div>
  );
}

export default VideoGrid;