import Project from "../models/project.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Create Project
export const createProject = asyncHandler(async (req, res) => {
  const { title, description, tags, joinCode: customJoinCode } = req.body;
  const joinCode = customJoinCode || Math.random().toString(36).substring(2, 10);

  const newProject = await Project.create({
    title,
    description,
    joinCode,
    owner: req.user._id,
    collaborators: [req.user._id],
    tags,
  });

  res.status(201).json(new ApiResponse(201, newProject, "Project created successfully"));
});

// Get All Projects for Logged-in User
export const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    $or: [{ owner: req.user._id }, { collaborators: req.user._id }],
  }).populate("owner collaborators", "fullName email");

  res.status(200).json(new ApiResponse(200, "Fetched user projects", projects));
});

// Get Single Project by ID
export const getProjectById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const project = await Project.findById(id).populate("owner collaborators", "fullName email");

  if (!project) throw new ApiError(404, "Project not found");

  res.status(200).json(new ApiResponse(200, project, "Fetched project"));
});

// Update Project
export const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, tags } = req.body;

  const project = await Project.findById(id);
  if (!project) throw new ApiError(404, "Project not found");

  if (!project.owner.equals(req.user._id)) {
    throw new ApiError(403, "Only the owner can update this project");
  }

  project.title = title || project.title;
  project.description = description || project.description;
  project.tags = tags || project.tags;

  await project.save();

  res.status(200).json(new ApiResponse(200, project, "Project updated successfully"));
});

// Delete Project
export const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const project = await Project.findById(id);
  if (!project) throw new ApiError(404, "Project not found");

  if (!project.owner.equals(req.user._id)) {
    throw new ApiError(403, "Only the owner can delete this project");
  }

  await project.deleteOne();

  res.status(200).json(new ApiResponse(200, null, "Project deleted successfully"));
});

// Join Project by Join Code
export const joinProjectByCode = asyncHandler(async (req, res) => {
  const { joinCode } = req.body;

  const project = await Project.findOne({ joinCode });
  if (!project) throw new ApiError(404, "Project not found with given join code");

  if (project.collaborators.includes(req.user._id)) {
    return res.status(200).json(new ApiResponse(200, project, "Already a collaborator"));
  }

  project.collaborators.push(req.user._id);
  await project.save();

  res.status(200).json(new ApiResponse(200, project, "Joined project successfully"));
});

// Remove Collaborator
export const removeCollaborator = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.body;

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  if (!project.owner.equals(req.user._id)) {
    throw new ApiError(403, "Only the owner can remove collaborators");
  }

  project.collaborators = project.collaborators.filter(
    (id) => id.toString() !== userId
  );

  await project.save();

  res.status(200).json(new ApiResponse(200, project, "Collaborator removed"));
});

// Get Projects by Tag
export const getProjectsByTag = asyncHandler(async (req, res) => {
  const { tag } = req.params;

  const projects = await Project.find({
    tags: tag,
    $or: [{ owner: req.user._id }, { collaborators: req.user._id }],
  });

  res.status(200).json(new ApiResponse(200, projects, `Projects with tag: ${tag}`));
});

// Add Collaborator by User ID
export const addCollaborator = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.body;

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  if (!project.owner.equals(req.user._id)) {
    throw new ApiError(403, "Only the owner can add collaborators");
  }

  if (project.collaborators.includes(userId)) {
    return res.status(200).json(new ApiResponse(200, project, "User is already a collaborator"));
  }

  project.collaborators.push(userId);
  await project.save();

  res.status(200).json(new ApiResponse(200, project, "Collaborator added successfully"));
});

// Get All Participants (Owner + Collaborators)
export const getParticipants = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId)
    .populate("owner", "fullName email profileImage")
    .populate("collaborators", "fullName email profileImage");

  if (!project) throw new ApiError(404, "Project not found");

  const participants = [
    {
      _id: project.owner._id,
      fullName: project.owner.fullName,
      email: project.owner.email,
      profileImage: project.owner.profileImage,
      isHost: true,
    },
    ...project.collaborators
      .filter((collab) => !collab._id.equals(project.owner._id))
      .map((collab) => ({
        _id: collab._id,
        fullName: collab.fullName,
        email: collab.email,
        profileImage: collab.profileImage,
        isHost: false,
      })),
  ];

  res.status(200).json(new ApiResponse(200, participants, "Participants fetched successfully"));
});
export const getProjectParticipants = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId).populate("owner collaborators", "fullName email profileImage");

  if (!project) throw new ApiError(404, "Project not found");

  const participants = project.collaborators.map(user => ({
    email: user.email,
    fullname: user.fullName,
    profileImage: user.profileImage || null,
    isHost: project.owner._id.equals(user._id),
    isMicOn: true, // placeholder
    isCameraOn: true // placeholder
  }));

  res.status(200).json(new ApiResponse(200, participants, "Participants fetched"));
});