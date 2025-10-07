# Deployment Guide

This guide provides comprehensive instructions for deploying the Digital Psychological Intervention System in various environments.

## 📋 Prerequisites

### System Requirements
- **Node.js**: v14.0.0 or higher
- **MongoDB**: v4.4.0 or higher
- **Memory**: Minimum 2GB RAM
- **Storage**: Minimum 10GB free space
- **Network**: HTTPS support recommended

### Required Accounts
- **MongoDB Atlas** (for cloud database)
- **Email Service** (Gmail, SendGrid, etc.)
- **AI Service** (OpenAI, Azure Cognitive Services)
- **Hosting Platform** (Heroku, AWS, DigitalOcean, etc.)

## 🚀 Quick Deployment Options

### Option 1: Heroku (Recommended for Beginners)

1. **Prepare the application**
   ```bash
   # Install Heroku CLI
   npm install -g heroku
   
   # Login to Heroku
   heroku login
   
   # Create Heroku app
   heroku create your-app-name
   ```

2. **Configure environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_atlas_connection_string
   heroku config:set JWT_SECRET=your_secure_jwt_secret
   heroku config:set CLIENT_URL=https://your-app-name.herokuapp.com
   heroku config:set EMAIL_HOST=smtp.gmail.com
   heroku config:set EMAIL_USER=your_email@gmail.com
   heroku config:set EMAIL_PASS=your_app_password
   heroku config:set OPENAI_API_KEY=your_openai_api_key
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 2: DigitalOcean App Platform

1. **Create App Spec**
   ```yaml
   # .do/app.yaml
   name: mental-health-system
   services:
   - name: api
     source_dir: /
     github:
       repo: your-username/mental-health-system
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: NODE_ENV
       value: production
     - key: MONGODB_URI
       value: ${MONGODB_URI}
     - key: JWT_SECRET
       value: ${JWT_SECRET}
   ```

2. **Deploy via DigitalOcean Dashboard**
   - Connect your GitHub repository
   - Configure environment variables
   - Deploy automatically

### Option 3: AWS EC2

1. **Launch EC2 Instance**
   ```bash
   # Launch Ubuntu 20.04 LTS instance
   # Configure security groups for ports 22, 80, 443, 3000, 5000
   ```

2. **Setup Server**
   ```bash
   # Connect to instance
   ssh -i your-key.pem ubuntu@your-ec2-ip
   
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx -y
   ```

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/your-username/mental-health-system.git
   cd mental-health-system
   
   # Install dependencies
   npm install
   cd client && npm install && npm run build && cd ..
   
   # Create environment file
   nano .env
   # Add your environment variables
   
   # Start with PM2
   pm2 start server.js --name "mental-health-api"
   pm2 startup
   pm2 save
   ```

4. **Configure Nginx**
   ```nginx
   # /etc/nginx/sites-available/mental-health-system
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🐳 Docker Deployment

### Docker Compose Setup

1. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   
   services:
     app:
       build: .
       ports:
         - "5000:5000"
       environment:
         - NODE_ENV=production
         - MONGODB_URI=mongodb://mongo:27017/mental-health-system
         - JWT_SECRET=your_jwt_secret
       depends_on:
         - mongo
       volumes:
         - ./uploads:/app/uploads
   
     mongo:
       image: mongo:5.0
       ports:
         - "27017:27017"
       volumes:
         - mongo_data:/data/db
       environment:
         - MONGO_INITDB_ROOT_USERNAME=admin
         - MONGO_INITDB_ROOT_PASSWORD=password
   
     nginx:
       image: nginx:alpine
       ports:
         - "80:80"
         - "443:443"
       volumes:
         - ./nginx.conf:/etc/nginx/nginx.conf
         - ./ssl:/etc/nginx/ssl
       depends_on:
         - app
   
   volumes:
     mongo_data:
   ```

2. **Create Dockerfile**
   ```dockerfile
   FROM node:16-alpine
   
   WORKDIR /app
   
   # Copy package files
   COPY package*.json ./
   RUN npm ci --only=production
   
   # Copy source code
   COPY . .
   
   # Build client
   WORKDIR /app/client
   RUN npm ci
   RUN npm run build
   
   WORKDIR /app
   
   # Create non-root user
   RUN addgroup -g 1001 -S nodejs
   RUN adduser -S nodejs -u 1001
   
   # Change ownership
   RUN chown -R nodejs:nodejs /app
   USER nodejs
   
   EXPOSE 5000
   
   CMD ["npm", "start"]
   ```

3. **Deploy with Docker**
   ```bash
   # Build and start services
   docker-compose up -d
   
   # View logs
   docker-compose logs -f
   
   # Stop services
   docker-compose down
   ```

## 🔒 SSL/HTTPS Configuration

### Let's Encrypt with Certbot

1. **Install Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   ```

2. **Obtain SSL Certificate**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

3. **Auto-renewal**
   ```bash
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

### Nginx SSL Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

## 📊 Monitoring and Logging

### PM2 Monitoring
```bash
# Install PM2 monitoring
pm2 install pm2-server-monit

# View monitoring dashboard
pm2 monit

# View logs
pm2 logs mental-health-api
```

### Application Monitoring
```javascript
// Add to server.js
const express = require('express');
const app = express();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});
```

### Log Management
```bash
# Install logrotate
sudo apt install logrotate -y

# Configure log rotation
sudo nano /etc/logrotate.d/mental-health-system
```

## 🔧 Environment-Specific Configurations

### Development Environment
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mental-health-system-dev
JWT_SECRET=dev_jwt_secret_key
CLIENT_URL=http://localhost:3000
LOG_LEVEL=debug
```

### Staging Environment
```env
NODE_ENV=staging
PORT=5000
MONGODB_URI=mongodb://staging-mongo:27017/mental-health-system-staging
JWT_SECRET=staging_jwt_secret_key
CLIENT_URL=https://staging.your-domain.com
LOG_LEVEL=info
```

### Production Environment
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/mental-health-system
JWT_SECRET=production_jwt_secret_key_very_secure
CLIENT_URL=https://your-domain.com
LOG_LEVEL=warn
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
OPENAI_API_KEY=your-openai-api-key
```

## 🚨 Security Considerations

### Database Security
```javascript
// MongoDB security configuration
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  sslValidate: true,
  authSource: 'admin',
  retryWrites: true,
  w: 'majority'
});
```

### Application Security
```javascript
// Security middleware
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

### Environment Variables Security
```bash
# Use strong, unique secrets
JWT_SECRET=$(openssl rand -base64 32)
MONGODB_PASSWORD=$(openssl rand -base64 16)

# Never commit .env files
echo ".env" >> .gitignore
echo "*.env" >> .gitignore
```

## 📈 Performance Optimization

### Database Optimization
```javascript
// MongoDB indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "studentId": 1 }, { unique: true });
db.appointments.createIndex({ "studentId": 1, "appointmentDate": 1 });
db.chatsessions.createIndex({ "userId": 1, "createdAt": -1 });
```

### Application Optimization
```javascript
// Enable compression
const compression = require('compression');
app.use(compression());

// Cache static assets
app.use(express.static('client/build', {
  maxAge: '1y',
  etag: true
}));
```

### CDN Configuration
```javascript
// Serve static assets from CDN
app.use('/static', express.static('client/build/static', {
  maxAge: '1y'
}));
```

## 🔄 Backup and Recovery

### Database Backup
```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="mongodb://localhost:27017/mental-health-system" --out="/backups/mongodb_$DATE"
tar -czf "/backups/mongodb_$DATE.tar.gz" "/backups/mongodb_$DATE"
rm -rf "/backups/mongodb_$DATE"

# Schedule daily backups
0 2 * * * /path/to/backup-script.sh
```

### Application Backup
```bash
# Backup application files
tar -czf "app-backup-$(date +%Y%m%d).tar.gz" /path/to/application
```

## 🚀 Scaling Considerations

### Horizontal Scaling
```yaml
# docker-compose.yml for scaling
version: '3.8'
services:
  app:
    build: .
    deploy:
      replicas: 3
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/mental-health-system
    depends_on:
      - mongo
      - redis
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app
  
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
```

### Load Balancer Configuration
```nginx
upstream app_servers {
    server app_1:5000;
    server app_2:5000;
    server app_3:5000;
}

server {
    listen 80;
    location / {
        proxy_pass http://app_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 📞 Support and Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check MongoDB status
   sudo systemctl status mongod
   
   # Check connection string
   echo $MONGODB_URI
   ```

2. **Port Conflicts**
   ```bash
   # Check port usage
   sudo netstat -tulpn | grep :5000
   
   # Kill process using port
   sudo kill -9 $(sudo lsof -t -i:5000)
   ```

3. **Memory Issues**
   ```bash
   # Check memory usage
   free -h
   
   # Increase swap space
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

### Log Analysis
```bash
# Application logs
pm2 logs mental-health-api --lines 100

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u nginx -f
```

### Performance Monitoring
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs -y

# Monitor system resources
htop
iotop
nethogs
```

## 📋 Deployment Checklist

### Pre-deployment
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] SSL certificates obtained
- [ ] Domain DNS configured
- [ ] Backup strategy implemented
- [ ] Monitoring tools installed

### Post-deployment
- [ ] Application accessible via HTTPS
- [ ] Database connections working
- [ ] Email notifications functioning
- [ ] AI chat system operational
- [ ] Admin dashboard accessible
- [ ] User registration working
- [ ] Appointment booking functional
- [ ] Resource upload working
- [ ] Analytics collecting data

### Security Verification
- [ ] HTTPS enforced
- [ ] Rate limiting active
- [ ] Input validation working
- [ ] Authentication secure
- [ ] Database access restricted
- [ ] Logs not exposing sensitive data
- [ ] Environment variables secure

---

**Remember**: Always test your deployment in a staging environment before going to production. Keep backups of your data and configuration files. Monitor your application regularly and update dependencies as needed.



