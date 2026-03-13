const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:3001/users/login', {
      email: 'sf@whateat.com',
      password: '123456'
    });

    console.log('登录成功:', response.data);
  } catch (error) {
    console.error('登录失败:', error.response ? error.response.data : error.message);
  }
}

testLogin();