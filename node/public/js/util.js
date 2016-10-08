var contact_list;
var current_contact_id;

function create_new_contact() {
    update_list();
    $('#create_modal').modal('hide');
}

function update_list() {
    var list_html = $("#contact_list").html("");
    for (var i = 0; i < contact_list.length; i++) {
        var d = contact_list[i];
        var $a = $("<a>", {"class": "list-group-item list-group-item-action", "onclick": "show_detail(" + d.contact_id + ")"});
        var $h5 = $("<h5>", {"class": "list-group-item-heading"});
        $h5.html(d.name);
        var $p = $("<p>", {"class": "list-group-item-text"});
        $p.html("Phone: " + d.phone_number);
        $a.append($h5);
        $a.append($p);
        list_html.append($a);
    }
    init_paginator();
}

function init_list() {
    $.ajax({ url: '/rest?state=Jiangxi&gender=Female', success: function(data) {
        contact_list = data;
        update_list();
    } });
}

function get_contact(id) {
    return contact_list.find(function (d) { return d.contact_id==id; });
}

function show_detail(id) {
    current_contact_id = id;
    fill_in_detail_modal(get_contact(id));
    $('#detail_modal').modal('show');
}

function update_contact(id) {
    $('#detail_modal').modal('hide');
    fill_in_update_modal(get_contact(id));
    $('#update_modal').modal('show');
}

function submit_update_contact(id) {
    $('#update_modal').modal('hide');
}

function delete_contact(id) {
    var contact = get_contact(id);
    var temp = confirm("Are you sure to delete contact " + contact.name + "?");
    if (temp) {
        $.ajax({
            type: "DELETE",
            url: "/rest/" + contact.contact_id
        });
    }
}

function fill_in_detail_modal(contact) {
    $.ajax({ url: ("/rest/relation/"+contact.contact_id), success: function(data) {
        $('#firstname_detail').html(contact.name.split(" ")[0]);
        $('#lastname_detail').html(contact.name.split(" ")[1]);
        $('#phone_detail').html(contact.phone_number);
        $('#email_detail').html(contact.email);
        $('#gender_detail').html(contact.gender_name);
        $('#country_detail').html(contact.country);
        $('#state_detail').html(contact.state);
        $('#city_detail').html(contact.city);
        var relation = data[0];
        for (var i = 1; i < data.length; i++) {
            relation += " ";
            relation += data[i];
        }
        $('#relation_detail').html(relation);
    } });
}

function fill_in_update_modal(contact) {
    $.ajax({ url: ("/rest/relation/"+contact.contact_id), success: function(data) {
        $('#firstname_update').val(contact.name.split(" ")[0]);
        $('#lastname_update').val(contact.name.split(" ")[1]);
        $('#phone_update').val(contact.phone_number);
        $('#email_update').val(contact.email);
        $('#gender_update').val(contact.gender_name);
        $('#country_update').val(contact.country);
        $('#state_update').val(contact.state);
        $('#city_update').val(contact.city);
        $('#relation_update').val(data[0]);
    } });
}
