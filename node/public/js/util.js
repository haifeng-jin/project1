var contact_list;

function create_new_contact() {
    console.log("create_new_contact");
    update_list();
    $('#create_modal').modal('hide');
}

function update_list() {
    for (var i = 0; i < contact_list.length; i++) {
        var d = contact_list[i];
        var $a = $("<a>", {"class": "list-group-item list-group-item-action", "onclick": "show_detail(" + d.contact_id + ")"});
        var $h5 = $("<h5>", {"class": "list-group-item-heading"});
        $h5.html(d.firstname + " " + d.lastname);
        var $p = $("<p>", {"class": "list-group-item-text"});
        $p.html("Phone: " + d.phone);
        $a.append($h5);
        $a.append($p);
        $("#contact_list").append($a);
    }
}

function init() {
    $.ajax({ url: '/mock/list.txt', success: function(data) {
        contact_list = $.parseJSON(data);
        console.log(contact_list);
        update_list();
    } });
}