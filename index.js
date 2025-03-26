// index.js
const express = require('express');  // Express 모듈 불러오기
const app = express();               // Express 애플리케이션 생성
const port = 3000;                   // 서버 포트 설정
let token = "";

require('dotenv').config();
// process.env에서 환경 변수 읽기
const appkey = process.env.APPKEY;
const secretkey = process.env.SECRETKEY;

if (!appkey || !secretkey) {
    console.error('Access token is missing!');
    process.exit(1);  // 프로그램 종료
}


// 기본 라우트 설정
app.get('/', (req, res) => {


    // 접근토큰 발급
    async function fn_au10001(data) {
        // 1. 요청할 API URL
        // const host = 'https://mockapi.kiwoom.com'; // 모의투자
        const host = 'https://api.kiwoom.com'; // 실전투자
        const endpoint = '/oauth2/token';
        const url = host + endpoint;

        // 2. header 데이터
        const headers = {
            'Content-Type': 'application/json;charset=UTF-8', // 컨텐츠 타입
        };

        try {
            // 3. HTTP POST 요청
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });

            // 응답 헤더 출력
            const responseHeaders = {
                'next-key': response.headers.get('next-key'),
                'cont-yn': response.headers.get('cont-yn'),
                'api-id': response.headers.get('api-id')
            };
            console.log('code :', response.status);
            console.log('header :', JSON.stringify(responseHeaders, null, 4));

            // 응답 본문 출력
            const responseBody = await response.json();
            console.log('body :', JSON.stringify(responseBody, null, 4));

            const body = JSON.stringify(responseBody, null, 4);

            // 문자열을 객체로 파싱
            const parseData = JSON.parse(body);

            // token 값 추출
            token = parseData.token;

            res.json({ "token": token });
            console.log("##", token);

        } catch (error) {
            console.error('요청 실패:', error);
        }
    }


    // 실행 구간
    (async () => {
        // 1. 요청 데이터
        const params = {
            'grant_type': 'client_credentials',  // grant_type
            'appkey': appkey,  // 앱키
            'secretkey': secretkey,  // 시크릿키
        };

        // 2. API 실행
        await fn_au10001(params);
    })();

});



// 예시 API: /api/deposit 요청 시 예수금 정보 반환
app.get('/api/deposit', (req, res) => {

    // 예수금상세현황요청
    async function fn_kt00001(token, data, cont_yn = 'N', next_key = '') {
        // 1. 요청할 API URL
        // const host = 'https://mockapi.kiwoom.com'; // 모의투자
        const host = 'https://api.kiwoom.com'; // 실전투자
        const endpoint = '/api/dostk/acnt';
        const url = host + endpoint;

        // 2. header 데이터
        const headers = {
            'Content-Type': 'application/json;charset=UTF-8', // 컨텐츠 타입
            'authorization': `Bearer ${token}`, // 접근 토큰
            'cont-yn': cont_yn, // 연속 조회 여부
            'next-key': next_key, // 연속 조회 키
            'api-id': 'kt00001' // TR명
        };

        try {
            // 3. HTTP POST 요청
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });

            // 응답 헤더 출력
            const responseHeaders = {
                'next-key': response.headers.get('next-key'),
                'cont-yn': response.headers.get('cont-yn'),
                'api-id': response.headers.get('api-id')
            };
            console.log('code :', response.status);
            console.log('header :', JSON.stringify(responseHeaders, null, 4));

            // 응답 본문 출력
            const responseBody = await response.json();
            console.log('body :', JSON.stringify(responseBody, null, 4));

            res.json(responseBody)
        } catch (error) {
            console.error('요청 실패:', error);
        }
    }

    // 실행 구간
    (async () => {
        // 1. 토큰 설정

        const MY_ACCESS_TOKEN = token; // 접근 토큰

        // 2. 요청 데이터
        const params = {
            'qry_tp': '3', // 조회구분 3:추정조회, 2:일반조회
        };

        // 3. API 실행
        await fn_kt00001(MY_ACCESS_TOKEN, params);

        // next-key, cont-yn 값이 있을 경우
        // await fn_kt00001(MY_ACCESS_TOKEN, params, 'Y', 'nextkey..');
    })();
})


// 서버 실행
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});