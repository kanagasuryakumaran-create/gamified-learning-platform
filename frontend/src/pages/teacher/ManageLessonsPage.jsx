import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { FileText, Plus, Trash2, Edit3, BookOpen, RefreshCw } from 'lucide-react';

export const ManageLessonsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [orderIndex, setOrderIndex] = useState(1);
  const [xpReward, setXpReward] = useState(10);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getSubjects()
      .then((data) => {
        setSubjects(data);
        if (data.length > 0) {
          setSelectedSubjectId(data[0].id);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedSubjectId) {
      api.getSubjectDetail(selectedSubjectId)
        .then((data) => setLessons(data.lessons || []))
        .catch(console.error);
    }
  }, [selectedSubjectId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !content || !selectedSubjectId) return;
    setSubmitting(true);
    try {
      await api.createLesson({
        subject_id: Number(selectedSubjectId),
        title,
        content,
        order_index: Number(orderIndex),
        xp_reward: Number(xpReward)
      });
      setTitle('');
      setContent('');
      // Refresh lessons
      const data = await api.getSubjectDetail(selectedSubjectId);
      setLessons(data.lessons || []);
    } catch (err) {
      console.error(err);
      alert('Failed to create lesson.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[60vh] text-slate-400 gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
        <span>Loading lessons manager...</span>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-white">Manage Lessons</h1>
        <p className="text-sm text-slate-400 mt-1">Add rich markdown learning lessons to course subject modules.</p>
      </div>

      {/* Select Subject Filter */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-center gap-4">
        <label className="text-xs font-semibold text-slate-300 shrink-0">Select Subject Module:</label>
        <select
          value={selectedSubjectId}
          onChange={(e) => setSelectedSubjectId(e.target.value)}
          className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 flex-1 max-w-md"
        >
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.title} ({s.category})</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Lesson Form */}
        <div className="lg:col-span-1 p-6 rounded-3xl glass-panel-glow border border-emerald-500/30 space-y-4">
          <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-400" /> Add New Lesson
          </h3>

          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Lesson Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Arrays & Memory Offsets"
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Order Index</label>
                <input
                  type="number"
                  min="1"
                  value={orderIndex}
                  onChange={(e) => setOrderIndex(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">XP Reward</label>
                <input
                  type="number"
                  min="5"
                  value={xpReward}
                  onChange={(e) => setXpReward(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Lesson Content (Markdown)</label>
              <textarea
                rows="6"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="# Lesson Overview&#10;&#10;Explain core concepts here using markdown headers and code blocks..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-lg shadow-emerald-600/30 hover:scale-[1.01] transition-all disabled:opacity-50"
            >
              {submitting ? 'Creating Lesson...' : 'Save Lesson'}
            </button>
          </form>
        </div>

        {/* Lessons List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold font-heading text-white">Module Lessons ({lessons.length})</h3>

          <div className="space-y-3">
            {lessons.map((l, idx) => (
              <div key={l.id} className="p-5 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/30 shrink-0">
                    0{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{l.title}</h4>
                    <span className="text-xs text-amber-400 font-medium">+{l.xp_reward} XP Reward</span>
                  </div>
                </div>

                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 font-mono">
                  Lesson ID #{l.id}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
