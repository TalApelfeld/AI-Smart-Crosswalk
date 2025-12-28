# AI Service ML Database - API Reference

## Overview
The AI Service now includes MongoDB for managing machine learning training data, model metrics, and false prediction tracking.

**Database:** `ai-ml-data`
**Connection:** MongoDB Atlas (same cluster as main backend)

---

## Collections

### 1. TrainingImage
Stores labeled images for model training and validation.

**Fields:**
- `imageUrl` - URL or path to image
- `sourceCamera` - Camera identifier
- `capturedAt` - When image was captured
- `labels` - Array of human-labeled bounding boxes
- `modelPredictions` - Array of model predictions for comparison
- `validationStatus` - pending/approved/rejected/needs_review
- `isValidated` - Boolean flag
- `usedForTraining` - Whether used in training
- `metadata` - Image dimensions, format, file size

### 2. ModelMetrics
Tracks performance metrics for each trained model version.

**Fields:**
- `modelVersion` - Unique version identifier (e.g., "v1.0.0", "yolo-v8-2024-12")
- `trainingStartedAt/trainingCompletedAt` - Training timestamps
- `epochs`, `batchSize`, `learningRate` - Hyperparameters
- `overallMetrics` - accuracy, meanAveragePrecision, inferenceTime
- `classMetrics` - Per-class precision, recall, F1 scores
- `lossHistory` - Training/validation loss per epoch
- `isProduction` - Whether deployed to production

### 3. FalsePrediction
Records incorrect predictions for model improvement.

**Fields:**
- `modelVersion` - Which model made the mistake
- `predictionType` - false_positive/false_negative/misclassification
- `predictedClass` - What model predicted
- `actualClass` - What it should have been
- `confidence` - Model confidence score
- `severity` - low/medium/high/critical
- `reportedBy` - user/auto_validation/human_review
- `isVerified` - Whether confirmed by human
- `addedToTrainingSet` - Whether used for retraining

---

## API Endpoints

### Training Images

**Add Training Image**
```
POST /api/ml/training-images
Content-Type: application/json

{
  "imageUrl": "https://example.com/image.jpg",
  "sourceCamera": "camera-001",
  "capturedAt": "2024-12-02T10:30:00Z",
  "labels": [
    {
      "class": "person",
      "confidence": 1.0,
      "bbox": { "x": 100, "y": 150, "width": 50, "height": 120 }
    }
  ],
  "metadata": {
    "imageWidth": 1920,
    "imageHeight": 1080,
    "format": "jpg"
  }
}
```

**Get Training Images**
```
GET /api/ml/training-images?validationStatus=pending&limit=50&skip=0
GET /api/ml/training-images?isValidated=true&usedForTraining=false
GET /api/ml/training-images?sourceCamera=camera-001
```

**Update Training Image**
```
PUT /api/ml/training-images/:id
Content-Type: application/json

{
  "validationStatus": "approved",
  "isValidated": true,
  "labeledBy": "admin-user-id",
  "usedForTraining": true
}
```

---

### False Predictions

**Record False Prediction**
```
POST /api/ml/false-predictions
Content-Type: application/json

{
  "modelVersion": "v1.0.0",
  "imageUrl": "https://example.com/error.jpg",
  "sourceCamera": "camera-002",
  "predictionType": "false_positive",
  "predictedClass": "vehicle",
  "actualClass": "none",
  "confidence": 0.85,
  "severity": "medium",
  "reportedBy": "user",
  "reporterUserId": "user-123",
  "impactDescription": "Triggered unnecessary alert"
}
```

**Get False Predictions**
```
GET /api/ml/false-predictions?modelVersion=v1.0.0&isVerified=false
GET /api/ml/false-predictions?predictionType=false_positive&severity=critical
GET /api/ml/false-predictions?limit=100&skip=0
```

---

### Model Metrics

**Save Model Metrics**
```
POST /api/ml/model-metrics
Content-Type: application/json

{
  "modelVersion": "v1.0.0",
  "modelType": "YOLO",
  "trainingStartedAt": "2024-12-01T09:00:00Z",
  "trainingCompletedAt": "2024-12-01T15:30:00Z",
  "trainingDuration": 23400,
  "epochs": 100,
  "batchSize": 16,
  "learningRate": 0.001,
  "trainingDatasetSize": 5000,
  "validationDatasetSize": 1000,
  "overallMetrics": {
    "accuracy": 0.94,
    "meanAveragePrecision": 0.89,
    "inferenceTime": 45
  },
  "classMetrics": [
    {
      "className": "person",
      "precision": 0.92,
      "recall": 0.88,
      "f1Score": 0.90,
      "truePositives": 880,
      "falsePositives": 77,
      "falseNegatives": 120
    }
  ],
  "isProduction": true
}
```

**Get All Model Metrics**
```
GET /api/ml/model-metrics?isProduction=true&limit=20
GET /api/ml/model-metrics
```

**Get Specific Model Version**
```
GET /api/ml/model-metrics/v1.0.0
```

---

### Statistics Dashboard

**Get ML Statistics**
```
GET /api/ml/statistics

Response:
{
  "success": true,
  "data": {
    "trainingData": {
      "total": 5000,
      "validated": 4500,
      "usedForTraining": 4000,
      "pendingValidation": 500
    },
    "falsePredictions": {
      "total": 150,
      "falsePositives": 90,
      "falseNegatives": 60,
      "unverified": 30
    },
    "models": {
      "total": 5,
      "inProduction": 1,
      "latestVersion": "v1.0.0",
      "latestMAP": 0.89
    }
  }
}
```

---

## Typical Workflows

### 1. Training Pipeline
1. User/system captures images → POST to `/api/ml/training-images`
2. Human labels images → PUT to `/api/ml/training-images/:id` (add labels, set validated)
3. Train model with validated images
4. POST metrics to `/api/ml/model-metrics` after training
5. Deploy model (set `isProduction: true`)

### 2. Error Tracking & Improvement
1. User reports incorrect detection → POST to `/api/ml/false-predictions`
2. Team verifies error → PUT to update `isVerified: true`
3. Add image to training set → Update `addedToTrainingSet: true`
4. Retrain model with corrected data
5. Track improvement in next model version metrics

### 3. Model Comparison
1. GET `/api/ml/model-metrics` to see all versions
2. Compare `meanAveragePrecision`, `accuracy`, `inferenceTime`
3. Check `classMetrics` for per-class performance
4. Review `falsePredictions` by model version
5. Decide which model to deploy

---

## Database Indexes
All collections have optimized indexes for common queries:
- TrainingImage: `capturedAt`, `sourceCamera`, `validationStatus`, `usedForTraining`
- ModelMetrics: `modelVersion`, `trainingCompletedAt`, `isProduction`, `meanAveragePrecision`
- FalsePrediction: `modelVersion`, `detectedAt`, `predictionType`, `severity`, `isVerified`

---

## Example: Complete ML Cycle

**Step 1: Add Training Image**
```bash
curl -X POST http://localhost:5001/api/ml/training-images \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "/uploads/camera-001/image-001.jpg",
    "sourceCamera": "camera-001",
    "labels": [{"class": "person", "confidence": 1.0, "bbox": {"x": 100, "y": 200, "width": 50, "height": 100}}],
    "validationStatus": "approved",
    "isValidated": true
  }'
```

**Step 2: Train Model & Save Metrics**
```bash
# After training completes...
curl -X POST http://localhost:5001/api/ml/model-metrics \
  -H "Content-Type: application/json" \
  -d '{
    "modelVersion": "v1.1.0",
    "epochs": 50,
    "overallMetrics": {"accuracy": 0.95, "meanAveragePrecision": 0.91, "inferenceTime": 40},
    "isProduction": true
  }'
```

**Step 3: Track Errors**
```bash
curl -X POST http://localhost:5001/api/ml/false-predictions \
  -H "Content-Type: application/json" \
  -d '{
    "modelVersion": "v1.1.0",
    "predictionType": "false_positive",
    "predictedClass": "vehicle",
    "actualClass": "shadow",
    "severity": "low",
    "reportedBy": "user"
  }'
```

**Step 4: View Statistics**
```bash
curl http://localhost:5001/api/ml/statistics
```
