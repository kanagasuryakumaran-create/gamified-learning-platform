import os
import pickle
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

from dnn.dataset import generate_synthetic_dataset
from dnn.model import StudentPerformanceDNN

def train_dnn_model(epochs=120, batch_size=32, lr=0.003):
    print("[+] Generating synthetic training dataset...")
    df = generate_synthetic_dataset(num_samples=2000, random_seed=42)
    
    feature_cols = [
        "average_score",
        "quiz_attempts",
        "time_spent",
        "lessons_completed",
        "previous_performance",
        "topic_score"
    ]
    
    X = df[feature_cols].values
    y = df["target_performance"].values.reshape(-1, 1)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Convert to PyTorch Tensors
    X_train_tensor = torch.FloatTensor(X_train_scaled)
    y_train_tensor = torch.FloatTensor(y_train)
    X_test_tensor = torch.FloatTensor(X_test_scaled)
    y_test_tensor = torch.FloatTensor(y_test)

    dataset = torch.utils.data.TensorDataset(X_train_tensor, y_train_tensor)
    dataloader = torch.utils.data.DataLoader(dataset, batch_size=batch_size, shuffle=True)

    model = StudentPerformanceDNN(input_dim=6)
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=lr, weight_decay=1e-4)

    print(f"[+] Starting PyTorch DNN Model Training for {epochs} epochs...")
    model.train()
    for epoch in range(1, epochs + 1):
        running_loss = 0.0
        for batch_x, batch_y in dataloader:
            optimizer.zero_grad()
            outputs = model(batch_x)
            loss = criterion(outputs, batch_y)
            loss.backward()
            optimizer.step()
            running_loss += loss.item() * batch_x.size(0)
            
        epoch_loss = running_loss / len(dataset)
        if epoch % 20 == 0 or epoch == 1:
            model.eval()
            with torch.no_grad():
                test_outputs = model(X_test_tensor)
                val_loss = criterion(test_outputs, y_test_tensor).item()
                mae = torch.mean(torch.abs(test_outputs - y_test_tensor)).item()
            print(f"Epoch {epoch:03d}/{epochs} | Train Loss (MSE): {epoch_loss:.4f} | Val Loss (MSE): {val_loss:.4f} | Val MAE: {mae:.2f}")
            model.train()

    # Save artifact
    output_dir = os.path.join(os.path.dirname(__file__), "saved_model")
    os.makedirs(output_dir, exist_ok=True)
    
    model_path = os.path.join(output_dir, "model.pt")
    scaler_path = os.path.join(output_dir, "scaler.pkl")

    torch.save(model.state_dict(), model_path)
    with open(scaler_path, "wb") as f:
        pickle.dump(scaler, f)

    print(f"[SUCCESS] PyTorch DNN Model successfully saved to: {model_path}")
    print(f"[SUCCESS] StandardScaler saved to: {scaler_path}")
    return model, scaler

if __name__ == "__main__":
    train_dnn_model()
