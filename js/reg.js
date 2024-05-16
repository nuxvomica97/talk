(() => {
    // 账户验证
    const loginIdValidator = new FieldValidator('txtLoginId', async function (val) {
        const value = val.trim();
        if (!value) return '请填写账号！';
        const resp = await API.exists(value);
        if (resp.data) return '该账户已存在！';
    });
    // 昵称验证
    const nicknameValidator = new FieldValidator('txtNickname', async function (val) {
        const value = val.trim();
        if (!value) return '请填写账号！';
    });
    // 密码验证
    const loginPwdValidator = new FieldValidator('txtLoginPwd', async function (val) {
        const value = val.trim();
        if (!value) return '请填写密码！';
    });
    // 确认密码验证
    const loginPwdConfirmValidator = new FieldValidator('txtLoginPwdConfirm', async function (val) {
        const value = val.trim();
        if (!value) return '请填写确认密码！';
        if (loginPwdValidator.input.value !== value) return '两次密码不一致，请重新输入！';
    });

    // 注册表单提交事件
    const form = $('.user-form');
    form.onsubmit = async function (e) {
        e.preventDefault(); // 阻止事件行为
        // 使用FieldValidator的静态方法统一验证所有文本框实例是否验证通过
        const result = await FieldValidator.validate(loginIdValidator, nicknameValidator, loginPwdValidator, loginPwdConfirmValidator);
        // 验证失败直接返回
        if (!result) return;
        // 验证通过则请求注册api
        const formData = Object.fromEntries(new FormData(form).entries());
        const resp = await API.reg(formData);
        // 如果响应成功则code=0
        if (resp.code === 0) {
            alert('注册成功, 点击前往登录！');
            location.href = './login.html';
        }
    }


})()