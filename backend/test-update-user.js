const axios = require('axios');

async function testUpdateUser() {
  try {
    // 首先登录获取token
    const loginResponse = await axios.post('http://localhost:3001/users/login', {
      email: 'sf@whateat.com',
      password: '123456'
    });

    const token = loginResponse.data.token;

    // 测试更新用户信息，包含空密码
    const updateResponse = await axios.put('http://localhost:3001/users/7', {
      username: '小厨',
      email: 'sf@whateat.com',
      password: '', // 空密码
      role: 'admin'
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('更新成功:', updateResponse.data);

    // 测试登录是否仍然有效
    const testLoginResponse = await axios.post('http://localhost:3001/users/login', {
      email: 'sf@whateat.com',
      password: '123456'
    });

    console.log('登录测试成功:', testLoginResponse.data.user.username);
    console.log('修复成功：密码没有被更新为空');
  } catch (error) {
    console.error('测试失败:', error.response ? error.response.data : error.message);
  }
}

testUpdateUser();