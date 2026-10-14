/**
 * Dynamic Array Puzzle Generator
 * Generates dynamic coding puzzles for Array Data Structures with 3 difficulty levels: Easy, Medium, Hard.
 * Supports non-repeating dynamic generation of:
 * 1. Find largest / smallest element
 * 2. Find second largest element
 * 3. Find missing number in range 1..N
 * 4. Find duplicate number in array
 * 5. Reverse array / Missing element in reversed array
 * 6. Target sum (Two Sum) pair
 * 7. Sort array / Correct sorted order
 */

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffleArray = (arr) => {
  const res = [...arr];
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }
  return res;
};

// Puzzle Category Generators

function generateLargestSmallest(difficulty) {
  const isLargest = Math.random() > 0.5;
  const size = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 7 : 9;
  const minVal = difficulty === 'hard' ? -30 : 1;
  const maxVal = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 70 : 120;

  const numbers = new Set();
  while (numbers.size < size) {
    numbers.add(getRandomInt(minVal, maxVal));
  }
  const arr = Array.from(numbers);

  const answer = isLargest ? Math.max(...arr) : Math.min(...arr);
  const targetWord = isLargest ? "LARGEST" : "SMALLEST";

  // Wrong options
  const wrongOptions = new Set();
  while (wrongOptions.size < 3) {
    const randElem = arr[getRandomInt(0, arr.length - 1)];
    if (randElem !== answer) {
      wrongOptions.add(randElem);
    }
  }

  const options = shuffleArray([answer, ...Array.from(wrongOptions)]);

  return {
    type: 'largest_smallest',
    title: `Find the ${targetWord} Element`,
    question: `Given the array below, identify the ${targetWord.toLowerCase()} value:`,
    array: arr,
    options: options.map(String),
    correctAnswer: String(answer),
    explanation: isLargest
      ? `The maximum value in the array [${arr.join(', ')}] is ${answer}, which is greater than all other elements.`
      : `The minimum value in the array [${arr.join(', ')}] is ${answer}, which is smaller than all other elements.`
  };
}

function generateSecondLargest(difficulty) {
  const size = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 6 : 8;
  const minVal = difficulty === 'hard' ? -20 : 5;
  const maxVal = difficulty === 'easy' ? 40 : 90;

  const numbers = new Set();
  while (numbers.size < size) {
    numbers.add(getRandomInt(minVal, maxVal));
  }
  const arr = Array.from(numbers);
  const sorted = [...arr].sort((a, b) => b - a);
  const answer = sorted[1];
  const largest = sorted[0];

  const wrongOptions = new Set([largest, sorted[2], sorted[3] || sorted[0] + 3]);
  wrongOptions.delete(answer);
  while (wrongOptions.size < 3) {
    wrongOptions.add(getRandomInt(minVal, maxVal));
    wrongOptions.delete(answer);
  }

  const options = shuffleArray([answer, ...Array.from(wrongOptions).slice(0, 3)]);

  return {
    type: 'second_largest',
    title: 'Find Second Largest Element',
    question: 'Determine the second largest value in the array:',
    array: arr,
    options: options.map(String),
    correctAnswer: String(answer),
    explanation: `When sorted in descending order: [${sorted.join(', ')}]. The largest is ${largest}, making ${answer} the second largest element.`
  };
}

function generateMissingNumber(difficulty) {
  const N = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 8 : 10;
  const fullSeq = Array.from({ length: N }, (_, i) => i + 1);
  const missingIndex = getRandomInt(0, N - 1);
  const answer = fullSeq[missingIndex];
  
  const arr = fullSeq.filter((_, idx) => idx !== missingIndex);
  const shuffledArr = shuffleArray(arr);

  const wrongOptions = new Set();
  while (wrongOptions.size < 3) {
    const wrongVal = getRandomInt(1, N + 3);
    if (wrongVal !== answer && !shuffledArr.includes(wrongVal)) {
      wrongOptions.add(wrongVal);
    }
  }

  const options = shuffleArray([answer, ...Array.from(wrongOptions)]);

  return {
    type: 'missing_number',
    title: 'Find Missing Number',
    question: `The array contains numbers from 1 to ${N} with one number missing. Find the missing number:`,
    array: shuffledArr,
    options: options.map(String),
    correctAnswer: String(answer),
    explanation: `The full range 1..${N} has a total sum of ${(N * (N + 1)) / 2}. The sum of the given array is ${shuffledArr.reduce((a, b) => a + b, 0)}. Subtracting gives missing number ${answer}.`
  };
}

function generateDuplicateNumber(difficulty) {
  const size = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 7 : 9;
  const numbers = new Set();
  while (numbers.size < size - 1) {
    numbers.add(getRandomInt(1, 50));
  }
  const uniqueArr = Array.from(numbers);
  const duplicateVal = uniqueArr[getRandomInt(0, uniqueArr.length - 1)];
  
  const arr = shuffleArray([...uniqueArr, duplicateVal]);

  const wrongOptions = new Set();
  for (const val of arr) {
    if (val !== duplicateVal) wrongOptions.add(val);
    if (wrongOptions.size >= 3) break;
  }

  const options = shuffleArray([duplicateVal, ...Array.from(wrongOptions)]);

  return {
    type: 'duplicate',
    title: 'Find Duplicate Element',
    question: 'Locate the element that appears twice in the array:',
    array: arr,
    options: options.map(String),
    correctAnswer: String(duplicateVal),
    explanation: `In the array [${arr.join(', ')}], ${duplicateVal} occurs 2 times while all other elements appear exactly once.`
  };
}

function generateReverseArray(difficulty) {
  const size = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 6;
  const arr = Array.from({ length: size }, () => getRandomInt(2, 35));
  const reversed = [...arr].reverse();

  // Create 3 wrong reversed variants
  const wrong1 = [...reversed];
  wrong1[0] = wrong1[0] + 2;

  const wrong2 = [...reversed];
  [wrong2[0], wrong2[1]] = [wrong2[1], wrong2[0]];

  const wrong3 = [...arr]; // original non-reversed

  const correctStr = `[${reversed.join(', ')}]`;
  const wrongStrs = [
    `[${wrong1.join(', ')}]`,
    `[${wrong2.join(', ')}]`,
    `[${wrong3.join(', ')}]`
  ];

  const options = shuffleArray([correctStr, ...wrongStrs]);

  return {
    type: 'reverse_array',
    title: 'Reverse the Array',
    question: 'What is the correct array after reversing all elements?',
    array: arr,
    options: options,
    correctAnswer: correctStr,
    explanation: `Reversing index positions: index 0 ↔ ${size - 1}, index 1 ↔ ${size - 2}... transforms [${arr.join(', ')}] into ${correctStr}.`
  };
}

function generateTwoSum(difficulty) {
  const size = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 6 : 7;
  const arrSet = new Set();
  while (arrSet.size < size) {
    arrSet.add(getRandomInt(1, 25));
  }
  const arr = Array.from(arrSet);

  // Pick two numbers to form target
  const idx1 = getRandomInt(0, size - 1);
  let idx2 = getRandomInt(0, size - 1);
  while (idx2 === idx1) {
    idx2 = getRandomInt(0, size - 1);
  }

  const num1 = arr[idx1];
  const num2 = arr[idx2];
  const targetSum = num1 + num2;
  const correctStr = `${num1} + ${num2} = ${targetSum}`;

  const wrongPairs = new Set();
  while (wrongPairs.size < 3) {
    const p1 = arr[getRandomInt(0, size - 1)];
    const p2 = arr[getRandomInt(0, size - 1)];
    if (p1 !== p2 && (p1 + p2 !== targetSum)) {
      wrongPairs.add(`${p1} + ${p2} = ${p1 + p2}`);
    }
  }

  const options = shuffleArray([correctStr, ...Array.from(wrongPairs)]);

  return {
    type: 'two_sum',
    title: 'Target Pair Sum (Two Sum)',
    question: `Find the pair of numbers from the array that add up to Target Sum = ${targetSum}:`,
    array: arr,
    targetSum: targetSum,
    options: options,
    correctAnswer: correctStr,
    explanation: `${num1} (at index ${idx1}) and ${num2} (at index ${idx2}) add up precisely to target sum ${targetSum}.`
  };
}

function generateSortArray(difficulty) {
  const size = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 6;
  const arrSet = new Set();
  while (arrSet.size < size) {
    arrSet.add(getRandomInt(1, 50));
  }
  const arr = shuffleArray(Array.from(arrSet));
  const sorted = [...arr].sort((a, b) => a - b);
  const correctStr = `[${sorted.join(', ')}]`;

  // Wrong sortings
  const desc = [...arr].sort((a, b) => b - a);
  const wrong1 = [...sorted];
  [wrong1[wrong1.length - 1], wrong1[wrong1.length - 2]] = [wrong1[wrong1.length - 2], wrong1[wrong1.length - 1]];

  const wrong2 = [...arr];

  const options = shuffleArray([
    correctStr,
    `[${desc.join(', ')}]`,
    `[${wrong1.join(', ')}]`,
    `[${wrong2.join(', ')}]`
  ]);

  return {
    type: 'sort_array',
    title: 'Sort Array in Ascending Order',
    question: 'Which of the following represents the array correctly sorted from smallest to largest?',
    array: arr,
    options: options,
    correctAnswer: correctStr,
    explanation: `Sorting elements in ascending order yields ${correctStr}.`
  };
}

/**
 * Main generator function for a 10-puzzle session
 */
export function generateArrayPuzzleSession() {
  const puzzleGenerators = [
    generateLargestSmallest,
    generateSecondLargest,
    generateMissingNumber,
    generateDuplicateNumber,
    generateReverseArray,
    generateTwoSum,
    generateSortArray
  ];

  // Pick 10 puzzles ensuring dynamic variety
  const sessionPuzzles = [];
  const initialDifficulties = ['easy', 'easy', 'easy', 'medium', 'medium', 'medium', 'medium', 'hard', 'hard', 'hard'];

  for (let i = 0; i < 10; i++) {
    const genFunc = puzzleGenerators[i % puzzleGenerators.length];
    const diff = initialDifficulties[i];
    const puzzle = genFunc(diff);
    puzzle.id = i + 1;
    puzzle.defaultDifficulty = diff;
    sessionPuzzles.push(puzzle);
  }

  // Shuffle order of puzzle types
  return shuffleArray(sessionPuzzles).map((p, idx) => ({ ...p, id: idx + 1 }));
}
