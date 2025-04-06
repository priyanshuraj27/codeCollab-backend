import Collab from "../models/collab.models.js";
import Project from "../models/project.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Create Collab
export const createCollab = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const userProject = await Project.findOne({
    $or: [{ owner: userId }, { collaborators: userId }],
  });

  if (!userProject) {
    throw new ApiError(404, "No associated project found for user");
  }

  const newCollab = await Collab.create({
    project: userProject._id,
    participants: [userId],
    content: "Type your code here",
  });

  res.status(201).json(
    new ApiResponse(201, newCollab, "Collab session created successfully")
  );
});

// Get Participants (Excludes Owner)
export const getParticipants = asyncHandler(async (req, res) => {
    const { collabId } = req.params;
  
    const collab = await Collab.findById(collabId)
      .populate("participants", "fullName email")
      .populate({
        path: "project",
        populate: {
          path: "owner",
          select: "fullName email"
        }
      });
  
    if (!collab) {
      throw new ApiError(404, "Collab not found");
    }
  
    const ownerDetails = collab.project.owner;
    const participantDetails = collab.participants.filter(
      (p) => p._id.toString() !== ownerDetails._id.toString()
    );
  
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Participants fetched successfully',
      data: {
        participants: participantDetails,
        owner: ownerDetails,
      },
    });
  });
  
// Get Owner of Collab (from Project)
export const getOwner = asyncHandler(async (req, res) => {
  const { collabId } = req.params;

  const collab = await Collab.findById(collabId).populate("project");

  if (!collab || !collab.project) {
    throw new ApiError(404, "Owner information not found");
  }

  const owner = await Project.findById(collab.project._id).populate("owner", "fullName email");

  res.status(200).json(new ApiResponse(200, owner.owner, "Project owner retrieved"));
});

// Update Collab Content
export const updateContent = asyncHandler(async (req, res) => {
  const { collabId } = req.params;
  const { content } = req.body;

  const collab = await Collab.findById(collabId);
  if (!collab) {
    throw new ApiError(404, "Collab not found");
  }

  collab.content = content || collab.content;

  // Optional logging
  collab.logs.push({
    user: req.user._id,
    action: "update_content",
    content,
  });

  await collab.save();

  res.status(200).json(new ApiResponse(200, collab, "Content updated successfully"));
});
