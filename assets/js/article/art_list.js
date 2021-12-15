$(function () {
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    };
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    initTable();
    initCate();
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    });
    $('tbody').on('click', '.btn-delete', function () {
        var len = $('.btn-delete').length;
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status != 0) {
                        layer.msg('文章删除失败')
                    }
                    layer.msg('文章删除成功');
                    // 当数据删除完成后应判断是否还有数据
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable();
                    layer.close(index);
                }
            })
        });
    })
    // 获取文章列表数据的函数
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('获取文章列表失败')
                }
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 调用渲染分页的方法
                renderPage(res.total);
            }
        })
    };
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('获取分类数据失败')
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    };
    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            limits: [2, 3, 5, 10],
            layour: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function (obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }
            }
        })
    }
})