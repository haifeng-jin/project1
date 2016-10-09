    var current_page = 1;
    var per_page = 50;
    var table = $("#contact_list");
    var pagination = $("#pagination");
    var left_page = pagination.children().first();
    var right_page = pagination.children().last();
    var tr;
    var row_num;
    var page_num;
    var rows = [];

    function init_paginator() {
        tr = table.children("a");
        row_num = tr.length;
        page_num = Math.ceil(row_num / per_page);
        if (page_num < 2) {
            pagination.html("");
            return;
        }
        for (var i = 0; i < row_num; i++) {
            rows.push(tr[i]);
        }
        table.html("");
        update(current_page);
    }

    function createPaginator(current_page) {
        pagination.html("");
        pagination.append(left_page);
        pagination.append(right_page);
        left_page.attr("onclick", "update(current_page - 1)");
        right_page.attr("onclick", "update(current_page + 1)");
        for (var i = Math.max(0, current_page - 5); i <= Math.min(page_num - 1, current_page + 5); i++) {
            var li = $("<li>");
            var a = $("<a>");
            a.html(i + 1);
            a.attr("onclick", "update(" + (i + 1) + ")");
            li.append(a);
            li.insertBefore(right_page);
        }
    }

    function update(a) {
        createPaginator(a);
        if (a < 1 || a > page_num)
            return;
        current_page = a;
        var li = pagination.children("li");
        for (var i = 0; i < li.length; i++) {
            li[i].removeAttribute("class");
        }
        if (current_page === 1)
            left_page.attr("class", "disabled");
        if (current_page === page_num)
            right_page.attr("class", "disabled");
        $('li').find('a').filter(':contains("'+a+'")').parent().attr("class", "active");

        table.html("");
        var start = (current_page - 1) * per_page;
        for (var i = start; i < start + per_page; i++) {
            table.append(rows[i]);
        }
    }