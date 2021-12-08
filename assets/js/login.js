$(function () {
    // 点击去注册账号的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    // 点击去登录连接
    $('#link_login').on('click', function () {
        $('.reg-box').hide();
        $('.login-box').show();
    })
    // 从LYAUI中获取form对象
    var form = layui.form;
    var layer = layui.layer
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 形参拿到的是确认密码框的内容还需要拿到密码框的内容，然后进行一次等于的判断，如果判断失败return一个错误消息
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致';
            }
        }
    });
    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() };
        $.post('/api/reguser', data, function (res) {
            if (res.status != 0) {
                return layer.msg(res.message);
            }
            layer.msg(res.message);
            $('#link_login').click();
        })
    })
    // 监听登录表单的登陆事件
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('登陆失败！')
                }
                layer.msg('登陆成功');
                // 将登陆成功的token字符串保存到localstorage
                localStorage.setItem('token', res.token);
                // 跳转到后台主页
                location.href = './index.html';
            }
        })
    })
})