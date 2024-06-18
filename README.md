# 2024-1 소프 캡스톤디자인 백엔드 레포지토리

### 프로젝트 구현에 사용된 기술과 버전
```
"dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/config": "^3.2.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/mapped-types": "*",
    "@nestjs/microservices": "^10.3.7",
    "@nestjs/passport": "^10.0.3",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/schedule": "^4.0.2",
    "@nestjs/swagger": "^7.3.0",
    "@nestjs/typeorm": "^10.0.2",
    "@types/cookie-parser": "^1.4.7",
    "@types/nodemailer": "^6.4.14",
    "amqp-connection-manager": "^4.1.14",
    "amqplib": "^0.10.4",
    "bcryptjs": "^2.4.3",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "cookie-parser": "^1.4.6",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "joi": "^17.12.3",
    "mysql2": "^3.9.7",
    "nestjs-pino": "^4.0.0",
    "nodemailer": "^6.9.13",
    "passport": "^0.7.0",
    "passport-github": "^1.1.0",
    "passport-google-oauth20": "^2.0.0",
    "passport-jwt": "^4.0.1",
    "passport-local": "^1.0.0",
    "pg": "^8.11.3",
    "pino-http": "^9.0.0",
    "pino-pretty": "^11.0.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1",
    "swagger-ui-express": "^5.0.0",
    "typeorm": "^0.3.20"
  },
```

### 프로젝트 설치 및 실행
* node.js와 docker가 설치되어 있어야 합니다.
1. 이 레포지토리를 클론합니다.
2. `cd` 로 프로젝트 폴더로 이동합니다.
3. 'docker-compose up --build' 명령어를 실행하여 프로젝트를 빌드하고 실행합니다.
4. `http://localhost:3000`으로 접속하여 프로젝트를 확인합니다.(true가 반환됩니다.)

* 환경변수 적용을 위해서
5. 환경변수는 k8s/secret-forest/secret.yaml에 저장되어 있습니다.(원래 프로젝트에는 없습니다만 테스트를 위해 추가하였습니다.)
6. `kubectl apply -f k8s/secret-forest/secret.yaml` 명령어를 실행하여 secret을 생성합니다.