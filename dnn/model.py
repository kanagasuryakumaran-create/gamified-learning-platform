import torch
import torch.nn as nn

class StudentPerformanceDNN(nn.Module):
    """
    Deep Neural Network for Student Performance Prediction.
    Architecture:
    - Input Layer: 6 numerical features
    - Hidden Layer 1: 64 units + ReLU + BatchNorm + Dropout
    - Hidden Layer 2: 32 units + ReLU + BatchNorm + Dropout
    - Hidden Layer 3: 16 units + ReLU
    - Output Layer: 1 linear unit (Predicted Performance Score 0-100)
    """
    def __init__(self, input_dim=6):
        super(StudentPerformanceDNN, self).__init__()
        
        self.network = nn.Sequential(
            nn.Linear(input_dim, 64),
            nn.BatchNorm1d(64),
            nn.ReLU(),
            nn.Dropout(0.15),
            
            nn.Linear(64, 32),
            nn.BatchNorm1d(32),
            nn.ReLU(),
            nn.Dropout(0.1),
            
            nn.Linear(32, 16),
            nn.ReLU(),
            
            nn.Linear(16, 1)
        )

    def forward(self, x):
        return self.network(x)

if __name__ == "__main__":
    model = StudentPerformanceDNN()
    dummy_input = torch.randn(5, 6)
    out = model(dummy_input)
    print("Model architecture verification successful.")
    print("Dummy input shape:", dummy_input.shape)
    print("Output shape:", out.shape)
