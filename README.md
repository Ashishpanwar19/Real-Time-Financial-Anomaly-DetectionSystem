Real-TimeFinancialAnomalyDetectionSystem
# Real-Time Financial Anomaly Detection  
**Low-latency GNN + Autoencoder model for transaction risk scoring**  

## 🚀 Key Features  
- **<50ms inference** via quantized PyTorch models (ONNX runtime)  
- **90% fraud recall** on 10M+ daily transactions (synthetic dataset)  
- **Graph Neural Networks** to detect collusive fraud patterns  
- **Kafka+Flink** streaming pipeline (AWS EKS)  

## 🛠️ Tech Stack  
`Python` `PyTorch Geometric` `FastAPI` `Apache Kafka` `Redis` `Kubernetes`  

## 📊 Results  
- 35% lower false positives vs. baselines  
- Scales to 100K TPS (transactions/second)  
