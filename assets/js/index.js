$(function () {
    getuserinfo();
    var layer = layui.layer;
    // 点击按钮实现退出
    $('#btnLogout').on('click', function () {
        // 用户确实是否退出
        layer.confirm('确认退出登录？', { icon: 3, title: '提示' }, function (index) {
            // 清空本地token
            localStorage.removeItem('token');
            location.href = '/login.html';
            layer.close(index);
        });
    })
})
function getuserinfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status != 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            renderAvatar(res.data);
        }
    })
};
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp' + name);
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 渲染文字头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}