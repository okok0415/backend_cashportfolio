// index.js
const express = require('express');  // Express 모듈 불러오기
const app = express();               // Express 애플리케이션 생성
const port = 3000;                   // 서버 포트 설정

// 기본 라우트 설정
app.get('/', (req, res) => {
    res.send('Hello, World!');         // 루트 URL로 요청 시 "Hello, World!"를 응답
});

// 예시 API: /api/account_balance 요청 시 예수금 정보 반환
app.get('/api/account_balance', (req, res) => {
    const accountBalance = {
        deposit: 1000000,  // 예시로 1,000,000 예수금을 반환
        currency: 'KRW'
    };
    res.json(accountBalance);  // JSON 형식으로 응답
});

// 서버 실행
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});