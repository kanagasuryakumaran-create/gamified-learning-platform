import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { HelpCircle, Plus, Trash2, CheckCircle2, RefreshCw } from 'lucide-react';

export const ManageQuizzesPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [passingScore, setPassingScore] = useState(70);
  const [xpReward, setXpReward] = useState(20);

  // Dynamic Questions list
  const [questions, setQuestions] = useState([
    {
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_option: 'A',
      explanation: ''
    }
  ]);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getSubjects()
      .then((data) => {
        setSubjects(data);
        if (data.length > 0) setSelectedSubjectId(data[0].id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_option: 'A',
        explanation: ''
      }
    ]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!title || !selectedSubjectId) return;
    setSubmitting(true);
    try {
      await api.createQuiz({
        subject_id: Number(selectedSubjectId),
        title,
        description,
        passing_score: Number(passingScore),
        xp_reward: Number(xpReward),
        questions
      });
      alert('Quiz and questions successfully created!');
      setTitle('');
      setDescription('');
      setQuestions([{
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_option: 'A',
        explanation: ''
      }]);
    } catch (err) {
      console.error(err);
      alert('Failed to create quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[60vh] text-slate-400 gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
        <span>Loading quiz manager...</span>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-white">Manage & Create Quizzes</h1>
        <p className="text-sm text-slate-400 mt-1">Design assessment quizzes with dynamic multiple-choice questions.</p>
      </div>

      <form onSubmit={handleCreateQuiz} className="space-y-8">
        {/* Quiz General Settings */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-400" /> Quiz Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Target Subject Module</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Quiz Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Master Quiz on Data Structures"
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Passing Percentage (%)</label>
              <input
                type="number"
                min="50"
                max="100"
                value={passingScore}
                onChange={(e) => setPassingScore(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Completion XP Reward</label>
              <input
                type="number"
                min="10"
                value={xpReward}
                onChange={(e) => setXpReward(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Questions Builder */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-heading text-white">Quiz Questions ({questions.length})</h3>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Question
            </button>
          </div>

          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div key={idx} className="p-6 rounded-3xl glass-panel-glow border border-slate-800 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-emerald-400">Question #{idx + 1}</span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(idx)}
                      className="text-rose-400 hover:text-rose-300 font-semibold"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Question Prompt</label>
                  <input
                    type="text"
                    value={q.question_text}
                    onChange={(e) => handleQuestionChange(idx, 'question_text', e.target.value)}
                    placeholder="Enter question text..."
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-400 mb-1">Option A</label>
                    <input
                      type="text"
                      value={q.option_a}
                      onChange={(e) => handleQuestionChange(idx, 'option_a', e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-400 mb-1">Option B</label>
                    <input
                      type="text"
                      value={q.option_b}
                      onChange={(e) => handleQuestionChange(idx, 'option_b', e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-400 mb-1">Option C</label>
                    <input
                      type="text"
                      value={q.option_c}
                      onChange={(e) => handleQuestionChange(idx, 'option_c', e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-400 mb-1">Option D</label>
                    <input
                      type="text"
                      value={q.option_d}
                      onChange={(e) => handleQuestionChange(idx, 'option_d', e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Correct Answer Option</label>
                    <select
                      value={q.correct_option}
                      onChange={(e) => handleQuestionChange(idx, 'correct_option', e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    >
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Explanation (Optional)</label>
                    <input
                      type="text"
                      value={q.explanation}
                      onChange={(e) => handleQuestionChange(idx, 'explanation', e.target.value)}
                      placeholder="Why is this answer correct?"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 hover:scale-[1.01] transition-all disabled:opacity-50"
        >
          {submitting ? 'Creating Quiz...' : 'Publish Quiz & Questions'}
        </button>
      </form>
    </div>
  );
};
