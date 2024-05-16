(async () => {
    const doms = {
        nickname: $('#nickname'),
        loginId: $('#loginId'),
        chatContainer: $('.chat-container'),
        msgContainer: $('.msg-container'),
        txtMsg: $('#txtMsg'),
        close: $('.close'),
    }
    // 1. 初始化页面
    // 获取用户信息
    const profile = await API.profile();
    async function init() {

        // 验证是否登录，没有登录跳转到登录页面
        if (profile.code !== 0) {
            alert('你未登录，请先登录');
            location.href = './login.html';
            return;
        }
        // 显示登录用户信息
        doms.nickname.innerText = profile.data.nickname;
        doms.loginId.innerText = profile.data.loginId;
        // 获取聊天记录
        const history = await API.getHistory();
        // 显示聊天记录
        for (const item of history.data) {
            addChat(item);
        }
        // 把聊天记录滚动条滚动到底部
        scrollBottom();
    }
    // 2. 交互
    // 发送消息表单提交事件
    doms.msgContainer.onsubmit = async function (e) {
        e.preventDefault(); // 阻止事件行为
        sendChat();
    }

    // 用户登出事件
    doms.close.onclick = function () {
        API.loginOut();
        location.href = './login.html';
        return;
    }

    // 显示单条消息
    function addChat(chatInfo) {
        const fragment = document.createDocumentFragment();
        const item = $$$('div');
        item.classList.add('chat-item');
        if (chatInfo.from) {
            item.classList.add('me');
        }

        const img = $$$('img');
        img.className = "chat-avatar";
        img.src = chatInfo.from ? './asset/avatar.png' : './asset/robot-avatar.jpg';

        const content = $$$('div');
        content.className = "chat-content";
        content.innerText = chatInfo.content;

        const date = $$$('div');
        date.className = "chat-date";
        date.innerText = formatDate(chatInfo.createdAt, 'yyyy-MM-dd HH:mm:ss');

        item.appendChild(img);
        item.appendChild(content);
        item.appendChild(date);

        fragment.appendChild(item)
        doms.chatContainer.appendChild(fragment);
    }

    // 把聊天记录滚动条滚动到底部
    function scrollBottom() {
        doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
    }

    // 发送信息
    async function sendChat() {
        const content = doms.txtMsg.value.trim();
        if (!content) return;
        addChat({
            from: profile.data.loginId,
            to: null,
            content,
            createdAt: Date.now()
        })
        scrollBottom();
        doms.txtMsg.value = '';
        const resp = await API.sendChat(content);

        if (resp.code === 0) {
            addChat({
                from: null,
                to: profile.data.loginId,
                ...resp.data
            })
            scrollBottom();
        }
    }

    // 时间戳转换格式2024-05-03 16:10:01 
    /**
     * 将日期格式化为字符串
     * @param {Date} date 要格式化的日期对象
     * @param {string} format 格式化字符串 yyyy-年  MM-月  dd-日 HH-小时 mm-分钟 ss-秒 ms-毫秒
     * @return {string} 日期字符串
     */
    function formatDate(date, format) {
        const d = new Date(date);
        var year = d.getFullYear().toString().padStart(4, '0');
        var month = (d.getMonth() + 1).toString().padStart(2, '0');
        var day = d.getDate().toString().padStart(2, '0');

        var hour = d.getHours().toString().padStart(2, '0');
        var minute = d.getMinutes().toString().padStart(2, '0');
        var second = d.getSeconds().toString().padStart(2, '0');
        var millisecond = d.getMilliseconds();

        return format
            .replace('yyyy', year)
            .replace('MM', month)
            .replace('dd', day)
            .replace('HH', hour)
            .replace('mm', minute)
            .replace('ss', second)
            .replace('ms', millisecond);
    }

    init();
})()