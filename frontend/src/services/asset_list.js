export const asset_dict = {
    "intial_video" : "https://res.cloudinary.com/dvq5cfzcw/video/upload/v1746959701/intial_ju8h7a.mp4",
    "final_video" : "https://res.cloudinary.com/dvq5cfzcw/video/upload/v1746959724/final_wvpsul.mp4",
    "combined_if" : "https://res.cloudinary.com/dvq5cfzcw/video/upload/v1746960058/output_if_vuccsm.mp4",
    "combined_fi" : "https://res.cloudinary.com/dvq5cfzcw/video/upload/v1746960070/output_fi_nit3zo.mp4"
}


export const INTIAL_VIDEO = asset_dict["intial_video"];
export const FINAL_VIDEO = asset_dict["final_video"];
export const COMBINED_IF = asset_dict["combined_if"];
export const COMBINED_FI = asset_dict["combined_fi"];



export const INTIAL_PROMPT = `Generate an animation that visualizes the fundamental architecture of a Large Language Model (LLM). The animation should:
1. Start with a clear visualization of the transformer architecture
2. Show the token embedding process with animated tokens entering the system
3. Visualize the self-attention mechanism with colorful weighted connections between tokens
4. Demonstrate how positional encoding works with clear visual indicators
5. Include labels, mathematical notations, and explanatory text overlays
6. Use attractive color schemes and smooth transitions between concepts
`;


export const FINAL_PROMPT = `Generate Another animation to visualize:
1. The training process of an LLM, showing how weights update during backpropagation
2. The concept of gradient descent with a 3D loss landscape that changes as training progresses
3. Visual representation of overfitting vs. generalization with test and training data
4. The concept of large-scale pre-training followed by fine-tuning, with separate visuals for each phase
5. Include animated graphs showing performance metrics improving over training time

`