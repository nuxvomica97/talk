const API = (() => {
    const BASE = 'http://study.duyiedu.com';
    const TOKEN_KEY = 'token';

    // 封装的get请求
    function get(path) {
        const headers = {};
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            headers.authorization = `Bearer ${token}`;
        }
        return fetch(BASE + path, { headers });
    }
    // 封装的post请求
    function post(path, bodyObj) {
        const headers = {
            'Content-Type': 'application/json'
        };
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            headers.authorization = `Bearer ${token}`;
        }
        return fetch(BASE + path, { method: "POST", headers, body: JSON.stringify(bodyObj) });
    }

    /**
     * 参数是一个用户信息对象
     * POST
     * /api/user/reg
     * @param {Object} userInfo 用户信息
     * {
            "loginId": "asgvzx",
            "nickname": "邓哥",
            "loginPwd": "123123"
        }
     */
    async function reg(userInfo) {
        const resp = await post('/api/user/reg', userInfo);
        return await resp.json();
    }

    /**
     * 参数是一个用户登录信息对象
     * POST
     * /api/user/login
     * @param {Object} loginInfo 用户登录信息
     * @return  
     */
    async function login(loginInfo) {
        const resp = await post('/api/user/login', loginInfo);
        const result = await resp.json();
        // 将响应头中的token保存到localStorage
        if (result.code === 0) {
            const token = resp.headers.get('authorization');
            localStorage.setItem(TOKEN_KEY, token);
        }
        return result;
    }

    /**
     * 验证账号
     * GET
     * /api/user/exists
     * @param {String} loginId 用户
     */
    async function exists(loginId) {
        const resp = await get('/api/user/exists?loginId=' + loginId);
        return await resp.json();
    }

    /**
     * 获取当前的登录信息
     * GET
     * /api/user/profile
     */
    async function profile() {
        const resp = await get('/api/user/profile');
        return await resp.json();
    }
    /**
     * 发送聊天信息
     * POST
     * /api/chat
     * @param {*} content 
     */
    async function sendChat(content) {
        const resp = await post('/api/chat', { content });
        return await resp.json();
    }
    /**
     * 获取聊天记录
     * GET
     * /api/chat/history
     */
    async function getHistory() {
        const resp = await get('/api/chat/history')
        return await resp.json();
    }

    /**
     * 退出登录
     */
    function loginOut() {
        localStorage.removeItem(TOKEN_KEY);
    }

    return {
        reg,
        login,
        exists,
        profile,
        sendChat,
        getHistory,
        loginOut
    }
})();