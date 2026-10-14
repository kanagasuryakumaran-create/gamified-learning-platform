import os
import pickle
import numpy as np
import torch

from dnn.model import StudentPerformanceDNN

MODEL_DIR = os.path.join(os.path.dirname(__file__), "saved_model")
MODEL_PATH = os.path.join(MODEL_DIR, "model.pt")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.pkl")

_model = None
_scaler = None

def load_model_and_scaler():
    global _model, _scaler
    if _model is not None and _scaler is not None:
        return _model, _scaler

    if not os.path.exists(MODEL_PATH) or not os.path.exists(SCALER_PATH):
        print("[!] Saved PyTorch model not found. Triggering training pipeline...")
        from dnn.train import train_dnn_model
        train_dnn_model()

    _model = StudentPerformanceDNN(input_dim=6)
    _model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device('cpu')))
    _model.eval()

    with open(SCALER_PATH, "rb") as f:
        _scaler = pickle.load(f)

    return _model, _scaler

def predict_dnn(data: dict):
    """
    Input dict format:
    {
      "average_score": 65,
      "quiz_attempts": 4,
      "time_spent": 120,
      "lessons_completed": 8,
      "previous_performance": 60,
      "topic_score": 45,
      "topic_name": "Arrays"  (optional context)
    }
    """
    model, scaler = load_model_and_scaler()

    raw_features = np.array([[
        float(data.get("average_score", 50)),
        float(data.get("quiz_attempts", 1)),
        float(data.get("time_spent", 30)),
        float(data.get("lessons_completed", 1)),
        float(data.get("previous_performance", 50)),
        float(data.get("topic_score", 50))
    ]])

    scaled_features = scaler.transform(raw_features)
    tensor_input = torch.FloatTensor(scaled_features)

    with torch.no_grad():
        output = model(tensor_input)
        predicted_score = float(output.numpy()[0][0])

    predicted_score = max(0.0, min(100.0, round(predicted_score, 1)))

    topic = data.get("topic_name", "Arrays")
    topic_score = float(data.get("topic_score", 50))

    # Weak topic detection and recommended topic / difficulty determination via DNN outputs
    if topic_score < 60 or predicted_score < 65:
        difficulty = "Beginner"
        weak_topic = topic
        recommended_topic = topic
        reason = f"Your recent performance in {topic} ({topic_score}%) is below your average target. DNN predicts {predicted_score}% mastery."
    elif topic_score < 80 or predicted_score < 82:
        difficulty = "Intermediate"
        weak_topic = topic
        recommended_topic = topic
        reason = f"Solid foundation in {topic}. Practice intermediate scenarios to push predicted score ({predicted_score}%) above 85%."
    else:
        difficulty = "Advanced"
        weak_topic = "None (High Mastery)"
        recommended_topic = "Advanced Problem Solving & Data Structures"
        reason = f"Excellent performance! High predicted mastery ({predicted_score}%). Recommended advanced challenges."

    return {
        "predicted_performance": predicted_score,
        "weak_topic": weak_topic,
        "recommended_topic": recommended_topic,
        "difficulty": difficulty,
        "reason": reason
    }

if __name__ == "__main__":
    sample_data = {
        "average_score": 65,
        "quiz_attempts": 4,
        "time_spent": 120,
        "lessons_completed": 8,
        "previous_performance": 60,
        "topic_score": 45,
        "topic_name": "Arrays"
    }
    res = predict_dnn(sample_data)
    print("DNN Inference Test Result:")
    print(res)
