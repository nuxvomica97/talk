// (async () => {
// 用户登录注册通用代码
/**
 * 对某个表单项进行验证的构造函数
 */
class FieldValidator {
    /**
     * 
     * @param {String} textId 表单项的Id
     * @param {Function} validatorFunc 验证规则函数, 当需要对文本框验证时会调用该函数，并且将文本框的值传递过去， 函数的返回值为验证的错误信息，无返回则表示无错误
     */
    constructor(textId, validatorFunc) {
        this.input = $('#' + textId);
        this.p = this.input.nextElementSibling;
        this.validatorFunc = validatorFunc;
        this.input.onblur = () => {
            this.validate();
        }
    }

    // 验证函数 成功返回true 失败返回false
    async validate() {
        const err = await this.validatorFunc(this.input.value);
        if (err) {
            this.p.innerText = err;
            return false;
        }
        this.p.innerText = '';
        return true;
    }

    /**
     * 对传入的所有验证器的实例进行统一验证，所有验证通过返回true 失败返回false
     * @param  {...FieldValidator} validators FieldValidator的实例
     * @returns 
     */
    static async validate(...validators) {
        const proms = validators.map(v => v.validate());
        const result = await Promise.all(proms);
        return !result.includes(false)
    }
}


function test() {
    FieldValidator.validate(loginIdValidator, nicknameValidator).then(r => console.log(r));
}

// })()