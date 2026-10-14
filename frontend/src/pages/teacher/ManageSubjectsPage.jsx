import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { BookPlus, Plus, Trash2, Edit3, CheckCircle2, RefreshCw } from 'lucide-react';

export const ManageSubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Computer Science');
  const [icon, setIcon] = useState('Code');
  const [submitting, setSubmitting] = useState(false);

  const fetchSubjects = async () => {
    try {
      const data = await api.getSubjects();
      setSubjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !description) return;
    setSubmitting(true);
    try {
      await api.createSubject({ title, description, category, icon });
      setTitle('');
      setDescription('');
      fetchSubjects();
    } catch (err) {
      console.error(err);
      alert('Failed to create subject.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject module?')) return;
    try {
      await api.deleteSubject(id);
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[60vh] text-slate-400 gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
        <span>Loading subjects manager...</span>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-white">Manage Subjects</h1>
        <p className="text-sm text-slate-400 mt-1">Create new curriculum subjects and edit existing course modules.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Subject Form */}
        <div className="lg:col-span-1 p-6 rounded-3xl glass-panel-glow border border-emerald-500/30 space-y-4">
          <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-400" /> Add New Subject
          </h3>

          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Subject Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Machine Learning Basics"
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Computer Science"
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Description</label>
              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a comprehensive summary of what students will learn in this subject module..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-lg shadow-emerald-600/30 hover:scale-[1.01] transition-all disabled:opacity-50"
            >
              {submitting ? 'Creating Subject...' : 'Save Subject Module'}
            </button>
          </form>
        </div>

        {/* Subjects List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold font-heading text-white">Existing Course Subjects ({subjects.length})</h3>

          <div className="space-y-3">
            {subjects.map((subj) => (
              <div key={subj.id} className="p-5 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      {subj.category}
                    </span>
                    <span className="text-xs text-slate-500">{subj.total_lessons} Lessons</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{subj.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{subj.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDelete(subj.id)}
                    className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all"
                    title="Delete Subject"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
