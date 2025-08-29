import { useEffect, useState, type FormEvent } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface Project {
  _id: string;
  title: string;
  description: string;
  createdAt: number;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get<Project[]>("/project");
      setProjects(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Create a new project
  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    
    try {
      setCreating(true);
      const res = await api.post("/project", { title, description });
      const { project } = res.data;
      setProjects((prev) => [project, ...prev]); // Add to beginning of list
      setTitle("");
      setDescription("");
      toast.success("Project created successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  // Delete project
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }
    
    try {
      await api.delete(`/project/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      toast.success("Project deleted");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete project");
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="/CURT.svg" 
                alt="CURT Logo" 
                className="w-16 h-16 sm:w-16 sm:h-16 object-contain" 
              />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Projects
              </h1>
            </div>
           <div className="flex items-center space-x-8">
             <div className="text-sm text-gray-500">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'}
            </div>
            <button className="bg-red-600 text-white text-sm hover:text-red-800 font-medium px-2 py-1 rounded-md" onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}>
              Logout
            </button>
           </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Create Project Form - Sidebar on large screens */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <form
                onSubmit={handleCreate}
                className="bg-white rounded-xl shadow-sm border p-6 space-y-4"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Create New Project
                  </h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      id="title"
                      type="text"
                      placeholder="Enter project title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={creating}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      placeholder="Describe your project (optional)"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={creating}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={creating || !title.trim()}
                    className="w-full bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {creating ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </div>
                    ) : (
                      "Add Project"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Projects List */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="bg-white rounded-xl shadow-sm border p-8">
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-600">Loading projects...</p>
                </div>
              </div>
            ) : projects.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                <p className="text-gray-500 mb-6">
                  Get started by creating your first project
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Projects
                </h3>
                <div className="grid gap-4">
                  {projects.map((project) => (
                    <div
                      key={project._id}
                      className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden group"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <div 
                            className="flex-1 cursor-pointer"
                            onClick={() => navigate(`/projects/${project._id}`)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {project.title}
                              </h4>
                              <div className="flex items-center text-xs text-gray-500 ml-4">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {formatDate(project.createdAt)}
                              </div>
                            </div>
                            
                            {project.description && (
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {project.description}
                              </p>
                            )}
                            
                            <div className="flex items-center text-xs text-blue-600 font-medium">
                              <span>View Project</span>
                              <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleDelete(project._id)}
                            className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete project"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}