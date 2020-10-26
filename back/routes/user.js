const express = require('express');
const bcrypt = require('bcrypt');
const passport = require("passport");
const db = require('../models');

const router = express.Router();

// API는 다른 서비스가 내 서비스의 기능을 실행 할 수 있게 열어둔 창구
// router.post('/api/user', (req, res) => { => /api/user 부분을 /로 대체

router.post('/', async (req, res, next) => { // POST /api/user => 회원가
  try {
    const exUser = await db.User.findOne({
      where: {
        userId: req.body.userId,
      },
    });

    if (exUser) {
      return res.status(403).send('이미 사용중인 아이디입니다.');
    }

    // salt는 10~13 사이로 하는 것이 좋다. (시간이 오래걸림)
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const newUser = await db.User.create({
      nickname: req.body.nickname,
      userId: req.body.userId,
      password: hashedPassword,
    });

    console.log(newUser);
    return res.status(200).json(newUser);
  } catch (e) {
    console.error(e);
    // 에러 처리를 여기서
    return next(e);
  }
});

// :id는 req.params.id로 가져올 수 있다.
// 남의 정보 가져오는 것 ex) /api/user/3 => 아이디가 3인 유저정보를 get
router.get('/:id', (req, res) => {

});

router.post('/logout', (req, res) => { // /api/user/logout

});

router.post('/login', (req, res) => { // /api/user/login
  // err: 서버에러
  // user : 사용자 정보
  // info : 로직상의 에러
  passport.authenticate('local', (err, user, info) => { // err, user, info => local.js의 done의 첫번째~ 세번쨰 인자
    if (err) {
      console.log(err);
      return next(err);
    }

    if (info) {
      return res.status(401).send(info.reason);
    }

    return req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }

      // 사용자 정보를 json으로 보내준다.
      const filteredUser = Object.assign({}, user);
      delete filteredUser.password;
      return res.json(filteredUser);
    });

  })(req, res, next);
});

router.get('/:id/follow', (req, res) => { // /api/user/:id/follow

});

router.post('/:id/follow', (req, res) => {

});

router.delete('/:id/follow', (req, res) => {

});

router.delete('/:id/follower', (req, res) => {

});

router.get('/:id/posts', (req, res) => {

});

module.exports = router;
