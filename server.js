// https://jwt.io/
// https://www.base64decode.org/
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken'); // npm install jsonwebtoken

const users = [
  {
    user_id: 'test',
    user_password: '1234',
    user_name: '테스트 유저',
    user_info: '테스트 유저입니다.'
  }
]

const app = express();

app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
  methods: ['OPTIONS', 'POST', 'GET', 'DELETE'],
  credentials: true // 쿠키를 저장하기 위한 필요한 옵션
}))

app.use(cookieParser()) // 요청에서 쿠키를 파싱하여 req.cookies 객체에 쿠키 데이터를 추가
app.use(express.json()) // 요청 본문을 JSON 형식으로 파싱하여 req.body에 JSON 데이터를 추가

const secretKey = 'ozcodingschool'

app.post('/', (req, res) => {
  const { userId, userPassword } = req.body;
  const userInfo = users.find((e) => e.user_id === userId && e.user_password === userPassword);

  if (!userInfo) {
    res.status(401).send('로그인 실패')
  } else {
    const accessToken = jwt.sign({userId: userInfo.user_id}, secretKey, {expiresIn: 1000 * 60 * 10});
    // sign - 토큰을 만들때 사용하는 함수
    // expiresIn - 토큰 유효기간 얼마나 가질건지 설정
    // 토큰에 민감한 정보는 넣지말기!!
    res.cookie('accessToken', accessToken);
    res.send("세션 생성 완료!");
  }

})

app.get('/', (req, res) => {
  const { accessToken } = req.cookies;
  const payload = jwt.verify(accessToken, secretKey);
  /** verify
   * JSON Web Token (JWT)의 유효성을 검증하는 데 사용
   * 토큰이 유효한지, 즉 서명이 올바른지와 만료되지 않았는지를 확인
   */
  const userInfo = users.find(e => e.user_id === payload.userId);
  return res.json(userInfo);
})

app.delete('/', (req, res) => {
  res.clearCookie('accessToken') // 쿠키 삭제
  res.send("토큰 삭제 완료!")
})

app.listen(3000, () => console.log('3000번 서버 실행'))