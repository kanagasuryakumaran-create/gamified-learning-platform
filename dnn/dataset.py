import numpy as np
import pandas as pd

TOPICS = ["Arrays", "Loops", "Java Basics", "OOP", "Recursion", "Data Structures", "SQL Basics", "Python Functions"]

def generate_synthetic_dataset(num_samples=1500, random_seed=42):
    """
    Generates synthetic student performance data for training the DNN model.
    Features:
    - average_score: 0 - 100 (Overall average score)
    - quiz_attempts: 1 - 10 (Total attempts on quizzes)
    - time_spent: 10 - 300 (Minutes spent learning)
    - lessons_completed: 1 - 20 (Total lessons completed)
    - previous_performance: 0 - 100 (Historical performance score)
    - topic_score: 0 - 100 (Score in specific topic being evaluated)
    
    Target Output:
    - target_performance: Predicted performance (0 - 100)
    """
    np.random.seed(random_seed)

    avg_score = np.random.uniform(30, 98, num_samples)
    quiz_attempts = np.random.randint(1, 12, num_samples)
    time_spent = np.random.uniform(15, 360, num_samples)
    lessons_completed = np.random.randint(1, 25, num_samples)
    prev_perf = np.clip(avg_score + np.random.normal(0, 8, num_samples), 20, 100)
    topic_score = np.clip(avg_score + np.random.normal(-10, 15, num_samples), 10, 100)
    
    topic_indices = np.random.choice(len(TOPICS), num_samples)
    topic_names = [TOPICS[i] for i in topic_indices]

    # Target calculation based on weighted non-linear relationship + noise
    target_score = (
        0.35 * topic_score + 
        0.25 * avg_score + 
        0.20 * prev_perf + 
        0.10 * np.minimum(lessons_completed * 4, 100) + 
        0.05 * np.minimum(time_spent / 3.0, 100) + 
        0.05 * np.maximum(100 - (quiz_attempts * 5), 20) +
        np.random.normal(0, 3, num_samples)
    )
    target_score = np.clip(target_score, 0, 100)

    df = pd.DataFrame({
        "average_score": np.round(avg_score, 2),
        "quiz_attempts": quiz_attempts,
        "time_spent": np.round(time_spent, 2),
        "lessons_completed": lessons_completed,
        "previous_performance": np.round(prev_perf, 2),
        "topic_score": np.round(topic_score, 2),
        "topic_name": topic_names,
        "target_performance": np.round(target_score, 2)
    })

    return df

if __name__ == "__main__":
    df = generate_synthetic_dataset()
    print("Dataset generated successfully. Shape:", df.shape)
    print(df.head())
