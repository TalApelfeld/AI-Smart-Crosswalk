# AI Smart Crosswalk - Microservices Architecture

## 🏗️ Project Structure

```
AI Smart Crosswalk/
├── ai-service/              (Port 5001) - AI Model & Detection
├── alert-service/           (Port 5002) - Alert Management
├── crosswalk-service/       (Port 5003) - Crosswalk & LED Control
├── api-gateway/             (Port 8000) - Single Entry Point
├── frontend/                (Port 3000) - React UI
├── start-all.ps1            - Launch all services
└── health-check.ps1         - System health verification
```

---

## 🎯 Microservices

### 1. **AI Service** (Port 5001)
**Responsibility:** Receives model data and sends alerts

**Endpoints:**
- `POST /api/ai/analyze` - Analyze image and detect objects
- `GET /api/ai/status` - AI service status
- `POST /api/ml/training-images` - Add training data
- `GET /api/ml/statistics` - ML statistics

**Database:** MongoDB (`ai-ml-data`) - Training images, model metrics, false predictions

**Key Files:**
- `server.js` - Main entry point
- `src/controllers/aiController.js` - AI inference logic
- `src/services/aiModelService.js` - Model execution (MOCK mode currently)
- `src/models/TrainingImage.js` - Training data schema

---

### 2. **Alert Service** (Port 5002)
**Responsibility:** Manages alerts from AI detection, saves and displays to Frontend

**Endpoints:**
- `GET /api/alerts` - Get all alerts (with filters)
- `GET /api/alerts/:id` - Get specific alert
- `POST /api/alerts` - Create new alert (from AI Service)
- `PATCH /api/alerts/:id` - Update alert status

**Database:** MongoDB (`ai-smart-crosswalk`) - Alerts collection

**Key Files:**
- `server.js` - Main entry point
- `src/controllers/alertController.js` - Alert CRUD operations
- `src/models/Alert.js` - Alert schema

**Alert Flow:**
```
AI Service → Detects danger → POST to Alert Service → Save to MongoDB → Frontend displays
```

---

### 3. **Crosswalk Service** (Port 5003)
**Responsibility:** Manages crosswalk information and LED control operations

**Endpoints:**
- `GET /api/crosswalks` - Get all crosswalks
- `GET /api/crosswalks/:id` - Get specific crosswalk
- `POST /api/crosswalks` - Create new crosswalk
- `PATCH /api/crosswalks/:id` - Update crosswalk
- `DELETE /api/crosswalks/:id` - Delete crosswalk
- `POST /api/crosswalks/:id/led/activate` - Activate LED warning
- `POST /api/crosswalks/:id/led/deactivate` - Deactivate LED
- `GET /api/crosswalks/:id/led/status` - Get LED status

**Database:** MongoDB (`ai-smart-crosswalk`) - Crosswalks collection

**Key Files:**
- `server.js` - Main entry point
- `src/controllers/crosswalkController.js` - Crosswalk CRUD + LED control
- `src/services/ledControlService.js` - LED hardware communication
- `src/models/Crosswalk.js` - Crosswalk schema

**LED Control Flow:**
```
Alert Created → Alert Service → Crosswalk Service → LED Hardware
```

---

### 4. **API Gateway** (Port 8000)
**Responsibility:** Single entry point for Frontend, routes requests to appropriate services

**Features:**
- **Request Routing** - Forwards requests to correct microservice
- **Logging** - Logs all incoming requests
- **Error Handling** - Handles service unavailability
- **Load Balancing** (Future) - Distribute load across instances

**Routing:**
```
/api/ai/*         → AI Service (5001)
/api/alerts/*     → Alert Service (5002)
/api/crosswalks/* → Crosswalk Service (5003)
```

**Key Files:**
- `server.js` - Proxy middleware configuration
- Uses `http-proxy-middleware` for routing

**Gateway Flow:**
```
Frontend (3000) → API Gateway (8000) → Microservices (5001-5003)
```

---

## 🔄 Data Flow

### Alert Creation Flow:
```
1. Camera captures image
2. POST /api/ai/analyze (via Gateway)
3. AI Service processes image
4. AI Service detects danger
5. AI Service → POST /api/alerts (Alert Service)
6. Alert Service saves to MongoDB
7. Alert Service → POST /api/crosswalks/:id/led/activate (Crosswalk Service)
8. Crosswalk Service activates LED
9. Frontend polls GET /api/alerts (via Gateway)
10. Frontend displays alert
```

### Frontend Request Flow:
```
Frontend → http://localhost:8000/api/alerts
  ↓
API Gateway receives request
  ↓
Gateway forwards to http://localhost:5002/api/alerts
  ↓
Alert Service processes request
  ↓
Response flows back: Alert Service → Gateway → Frontend
```

---

## 📊 Database Architecture

### MongoDB Cluster: `ai-smart-crosswalk`
**Collections:**
- `alerts` - All system alerts (Alert Service)
- `crosswalks` - Crosswalk locations and config (Crosswalk Service)

### MongoDB Cluster: `ai-ml-data`
**Collections:**
- `trainingimages` - Labeled images for training (AI Service)
- `modelmetrics` - Model performance tracking (AI Service)
- `falsepredictions` - Error logging for improvement (AI Service)

---

## 🚀 Starting the System

### Method 1: Startup Script (Recommended)
```powershell
.\start-microservices.ps1
```

### Method 2: Manual Start
```powershell
# Terminal 1 - AI Service
cd ai-service
npm start

# Terminal 2 - Alert Service
cd alert-service
npm start

# Terminal 3 - Crosswalk Service
cd crosswalk-service
npm start

# Terminal 4 - API Gateway
cd api-gateway
npm start

# Terminal 5 - Frontend
cd frontend
npm start
```

### Health Checks:
- AI Service: http://localhost:5001/health
- Alert Service: http://localhost:5002/health
- Crosswalk Service: http://localhost:5003/health
- API Gateway: http://localhost:8000/health
- Frontend: http://localhost:3000

---

## 🔧 Configuration

### Environment Variables

**ai-service/.env:**
```
PORT=5001
SERVICE_NAME=ai-service
MONGODB_URI=mongodb+srv://...ai-ml-data
```

**alert-service/.env:**
```
PORT=5002
SERVICE_NAME=alert-service
MONGODB_URI=mongodb+srv://...ai-smart-crosswalk
CROSSWALK_SERVICE_URL=http://localhost:5003
```

**crosswalk-service/.env:**
```
PORT=5003
SERVICE_NAME=crosswalk-service
MONGODB_URI=mongodb+srv://...ai-smart-crosswalk
```

**api-gateway/.env:**
```
PORT=8000
SERVICE_NAME=api-gateway
AI_SERVICE_URL=http://localhost:5001
ALERT_SERVICE_URL=http://localhost:5002
CROSSWALK_SERVICE_URL=http://localhost:5003
```

---

## 📦 Dependencies

All services use:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `cors` - CORS middleware
- `dotenv` - Environment variables
- `axios` - HTTP client

API Gateway additionally uses:
- `http-proxy-middleware` - Request forwarding

---

## 🎯 Future Enhancements

1. **Service Discovery** - Automatic service registration (Consul/Eureka)
2. **Load Balancing** - Multiple instances per service
3. **Message Queue** - RabbitMQ/Kafka for async communication
4. **Authentication** - JWT tokens, API keys
5. **Rate Limiting** - Prevent API abuse
6. **Circuit Breaker** - Handle service failures gracefully
7. **Monitoring** - Prometheus + Grafana
8. **Logging** - Centralized logging (ELK Stack)
9. **Containerization** - Docker + Kubernetes

---

## 📝 Notes

- **Backend folder** is legacy and will be removed in future
- **microservices folder** has been removed - services are now at root level
- All services are independent and can be scaled separately
- Frontend now connects ONLY through API Gateway (port 8000)
- Each service has its own database connection
- Services communicate via HTTP/REST (future: gRPC or message queues)

---

## 🔐 Security Considerations (Future)

- Add authentication to API Gateway
- Validate JWT tokens
- Rate limit requests
- Add HTTPS/TLS
- Secure MongoDB connections
- Environment variable encryption
- API key management

---

**Last Updated:** December 3, 2025
**Architecture:** Microservices
**Communication:** HTTP/REST via API Gateway
