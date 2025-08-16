const express = require('express');
const router = express.Router();

// Mock projects data (in a real app, this would come from a database)
let projects = [
  { 
    id: 1, 
    name: 'E-commerce Platform', 
    description: 'A modern e-commerce platform built with React and Node.js',
    status: 'active',
    owner: 'John Doe',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  { 
    id: 2, 
    name: 'Task Management App', 
    description: 'A collaborative task management application for teams',
    status: 'active',
    owner: 'Jane Smith',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  { 
    id: 3, 
    name: 'Blog System', 
    description: 'A content management system for blogs and articles',
    status: 'completed',
    owner: 'Mike Johnson',
    createdAt: '2023-12-01',
    updatedAt: '2024-01-15'
  },
];

// GET all projects
router.get('/', (req, res) => {
  const { status, owner } = req.query;
  let filteredProjects = [...projects];
  
  // Filter by status if provided
  if (status) {
    filteredProjects = filteredProjects.filter(p => p.status === status);
  }
  
  // Filter by owner if provided
  if (owner) {
    filteredProjects = filteredProjects.filter(p => 
      p.owner.toLowerCase().includes(owner.toLowerCase())
    );
  }
  
  res.json({
    success: true,
    data: filteredProjects,
    count: filteredProjects.length,
    total: projects.length
  });
});

// GET project by ID
router.get('/:id', (req, res) => {
  const project = projects.find(p => p.id === parseInt(req.params.id));
  
  if (!project) {
    return res.status(404).json({
      success: false,
      error: 'Project not found'
    });
  }
  
  res.json({
    success: true,
    data: project
  });
});

// POST create new project
router.post('/', (req, res) => {
  const { name, description, owner } = req.body;
  
  if (!name || !description || !owner) {
    return res.status(400).json({
      success: false,
      error: 'Name, description, and owner are required'
    });
  }
  
  const newProject = {
    id: projects.length + 1,
    name,
    description,
    status: 'active',
    owner,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  };
  
  projects.push(newProject);
  
  res.status(201).json({
    success: true,
    data: newProject
  });
});

// PUT update project
router.put('/:id', (req, res) => {
  const projectIndex = projects.findIndex(p => p.id === parseInt(req.params.id));
  
  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Project not found'
    });
  }
  
  const { name, description, status, owner } = req.body;
  
  projects[projectIndex] = {
    ...projects[projectIndex],
    name: name || projects[projectIndex].name,
    description: description || projects[projectIndex].description,
    status: status || projects[projectIndex].status,
    owner: owner || projects[projectIndex].owner,
    updatedAt: new Date().toISOString().split('T')[0]
  };
  
  res.json({
    success: true,
    data: projects[projectIndex]
  });
});

// DELETE project
router.delete('/:id', (req, res) => {
  const projectIndex = projects.findIndex(p => p.id === parseInt(req.params.id));
  
  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Project not found'
    });
  }
  
  const deletedProject = projects.splice(projectIndex, 1)[0];
  
  res.json({
    success: true,
    data: deletedProject,
    message: 'Project deleted successfully'
  });
});

// GET project statistics
router.get('/stats/overview', (req, res) => {
  const total = projects.length;
  const active = projects.filter(p => p.status === 'active').length;
  const completed = projects.filter(p => p.status === 'completed').length;
  const pending = projects.filter(p => p.status === 'pending').length;
  
  res.json({
    success: true,
    data: {
      total,
      active,
      completed,
      pending,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  });
});

module.exports = router;
