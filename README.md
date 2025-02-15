# 🌟 Jobly - Redefining Job and Internship Hunting

A comprehensive career platform with real-time mentorship, smart job matching, and seamless user experience.

![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Spring Boot](https://img.shields.io/badge/-Spring%20Boot-6DB33F?style=flat-square&logo=spring&logoColor=white)
![Kafka](https://img.shields.io/badge/-Kafka-231F20?style=flat-square&logo=apache-kafka&logoColor=white)
![WebRTC](https://img.shields.io/badge/-WebRTC-333333?style=flat-square&logo=webrtc&logoColor=white)
![MySQL](https://img.shields.io/badge/-MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Keycloak](https://img.shields.io/badge/-Keycloak-4479A1?style=flat-square&logo=keycloak&logoColor=white)

## 🎯 Features

### 👥 For Job Seekers
- Smart job search based on skills and interests
- One-click job applications
- Customizable professional profiles
- Real-time mentorship through video calls
- Instant chat with mentors
- Document management with Google Drive integration

### 💼 For Companies
- Comprehensive applicant tracking
- Detailed candidate profiles
- Automated notification system
- Custom company profiles
- Application status management

## 🏗️ Architecture

### Microservices
- **AuthService**: Handles authentication and authorization
- **ChatService**: Manages real-time chat functionality
- **CompanyService**: Company profile and job posting management
- **DiscoveryService**: Service registry and discovery
- **EmailService**: Email notifications and communications
- **JobApplicationService**: Application processing and tracking
- **JobProfileService**: User profile management
- **JobService**: Job listing and search functionality
- **MentorService**: Mentorship matching and scheduling
- **NotificationService**: Real-time notifications
- **PaymentService**: Payment processing with Razorpay
- **SkillService**: Skills management and matching
- **UserService**: User account management

## 🛠️ Tech Stack

### Frontend
- React.js with modern hooks and patterns
- GSAP for smooth animations
- WebRTC for video calling
- WebSocket for real-time chat
- Responsive design with modern CSS

### Backend
- Reactive Spring Boot
- Spring Cloud Gateway
- Feign Client for service communication
- Spring Security with Keycloak
- OAuth2.0 authentication
- Apache Kafka for event-driven architecture
- WebSocket and SSE for real-time updates

### Database & Storage
- Reactive MySQL
- Google Drive API integration
- Distributed caching

### DevOps & Infrastructure
- Load balancer for high availability
- Microservices architecture
- Service discovery
- API Gateway
- Containerization

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 14+
- MySQL 8+
- Apache Kafka
- Keycloak Server
- Google Cloud Account (for Drive API)
- Razorpay Account

### Running Backend Services

1. Start MySQL and Kafka servers
2. Configure Keycloak server
3. Start the Discovery Service first:
```bash
cd Backend/DiscoveryService
./mvnw spring-boot:run
```

4. Start other services (in any order):
```bash
cd Backend/[ServiceName]
./mvnw spring-boot:run
```

### Running Frontend

```bash
cd Frontend/sih_frontend
npm install
npm start
```

## 🌟 Key Features in Detail

### 📹 Video Calling
- Custom WebRTC implementation
- Peer-to-peer communication
- Real-time signaling through WebSocket
- No third-party dependencies
- Low-latency HD video calls

### 💬 Real-Time Updates
- Server-Sent Events (SSE) integration
- Kafka topic subscription
- Multi-client support
- Instant notifications
- Resource-efficient push updates

### 🔒 Security
- OAuth2.0 authentication flow
- Secure API Gateway
- Role-based access control
- Encrypted communications
- Secure payment processing

## 💡 Future Enhancements
- [ ] AI-powered job matching
- [ ] Advanced analytics dashboard
- [ ] Mobile application
- [ ] Group mentorship sessions
- [ ] Blockchain-verified certificates

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by [Your Name]
