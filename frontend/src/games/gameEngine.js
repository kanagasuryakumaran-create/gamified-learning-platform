/**
 * LearnQuest Reusable Game Engine & Registry
 * Extensible framework for multi-topic interactive coding puzzle games:
 * - Arrays (Active)
 * - Strings (Upcoming)
 * - Linked Lists (Upcoming)
 * - Stacks & Queues (Upcoming)
 * - Trees (Upcoming)
 * - Graphs (Upcoming)
 * - Sorting & Searching (Upcoming)
 */

import { generateArrayPuzzleSession } from './arrayPuzzleGenerator';

export const GAME_CATALOG = [
  {
    id: 'arrays',
    topic: 'Arrays',
    title: 'Array Master Challenge',
    description: 'Master array manipulation, min/max, two-pointer search, duplicates, missing values, and sorting.',
    icon: 'Array',
    difficulty: 'Adaptive (Easy → Medium → Hard)',
    puzzleCount: 10,
    active: true,
    route: '/student/games/array',
    color: 'from-blue-600 via-indigo-600 to-purple-600',
    badge: '10 Puzzles'
  },
  {
    id: 'strings',
    topic: 'Strings',
    title: 'String Manipulation Quest',
    description: 'Solve anagrams, palindrome verification, sliding window substrings, and pattern matching.',
    icon: 'Type',
    difficulty: 'Adaptive',
    puzzleCount: 10,
    active: false,
    route: '#',
    color: 'from-purple-600 to-pink-600',
    badge: 'Coming Soon'
  },
  {
    id: 'linked_lists',
    topic: 'Linked Lists',
    title: 'Pointer & Node Expeditions',
    description: 'Navigate single & double linked lists, cycle detection, fast & slow pointers, and node reversals.',
    icon: 'GitCommit',
    difficulty: 'Adaptive',
    puzzleCount: 10,
    active: false,
    route: '#',
    color: 'from-emerald-600 to-teal-600',
    badge: 'Coming Soon'
  },
  {
    id: 'stacks_queues',
    topic: 'Stacks & Queues',
    title: 'LIFO & FIFO Battles',
    description: 'Valid parenthetical matching, monotonic stacks, priority queues, and queue-based BFS simulation.',
    icon: 'Layers',
    difficulty: 'Adaptive',
    puzzleCount: 10,
    active: false,
    route: '#',
    color: 'from-amber-600 to-orange-600',
    badge: 'Coming Soon'
  },
  {
    id: 'trees',
    topic: 'Trees',
    title: 'Binary Tree Traversal Ops',
    description: 'Inorder, Preorder, Postorder traversals, BST validation, LCA, and tree height calculation.',
    icon: 'Network',
    difficulty: 'Adaptive',
    puzzleCount: 10,
    active: false,
    route: '#',
    color: 'from-cyan-600 to-blue-600',
    badge: 'Coming Soon'
  }
];

export class AdaptiveDifficultyEngine {
  constructor(initialDifficulty = 'Easy') {
    this.currentDifficulty = initialDifficulty; // 'Easy', 'Medium', 'Hard'
    this.consecutiveCorrect = 0;
    this.consecutiveWrong = 0;
  }

  registerAnswer(isCorrect) {
    if (isCorrect) {
      this.consecutiveCorrect += 1;
      this.consecutiveWrong = 0;

      if (this.consecutiveCorrect >= 2) {
        if (this.currentDifficulty === 'Easy') {
          this.currentDifficulty = 'Medium';
          this.consecutiveCorrect = 0;
        } else if (this.currentDifficulty === 'Medium') {
          this.currentDifficulty = 'Hard';
          this.consecutiveCorrect = 0;
        }
      }
    } else {
      this.consecutiveWrong += 1;
      this.consecutiveCorrect = 0;

      if (this.consecutiveWrong >= 2) {
        if (this.currentDifficulty === 'Hard') {
          this.currentDifficulty = 'Medium';
          this.consecutiveWrong = 0;
        } else if (this.currentDifficulty === 'Medium') {
          this.currentDifficulty = 'Easy';
          this.consecutiveWrong = 0;
        }
      }
    }

    return this.currentDifficulty;
  }
}

export function loadPuzzleSession(topic = 'Arrays') {
  if (topic === 'Arrays') {
    return generateArrayPuzzleSession();
  }
  return generateArrayPuzzleSession();
}
