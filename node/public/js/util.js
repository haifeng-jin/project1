var contact_list;
var current_contact_id;

function search() {
    var name = $("#search_box").val();
    var names = name.split(" ");
    if (names.length != 2)
        return;
    $.ajax({
        type: "GET",
        url: "/rest?firstname=" + names[0] + "&lastname=" + names[1],
        success: function(data) {
            contact_list = data;
            update_list();
        }
    });
}

function create_new_contact() {
    update_list();
    var contact = created_contact();
    $('#create_modal').modal('hide');
    $.ajax({
        type: "POST",
        url: "/rest",
        data: contact
    });
    window.location.href = "/";
}

function update_list() {
    var list_html = $("#contact_list").html("");
    for (var i = 0; i < contact_list.length; i++) {
        var d = contact_list[i];
        var $div = $("<div>", {"class":"row"});
        var $a = $("<a>", {"class": "list-group-item list-group-item-action"});//, "onclick": "show_detail(" + d.contact_id + ")"});
        var $h5 = $("<b>", {"class": "list-group-item-text"});
        $h5.html(d.name);
        var $p = $("<p>", {"class": "list-group-item-text"});
        $p.html("Phone: " + d.phone_number);
        var $col = $("<div>", {"class":"col-md-9"});
        $col.append($h5);
        $col.append($p);
        $div.append($col);
        var $buttons = make_buttons(d);
        $div.append($buttons);
        $a.append($div);
        list_html.append($a);
    }
    init_paginator();
}

function make_buttons(contact) {
    var buttons = $("<div>", {"class":"col-md-3"});
    var button1 = $("<span>", {"class":"glyphicon glyphicon-th-list col-md-4", "onclick":"show_detail("+contact.contact_id+")"});
    var button2 = $("<span>", {"class":"glyphicon glyphicon-pencil col-md-4", "onclick":"update_contact("+contact.contact_id+")"});
    var button3 = $("<span>", {"class":"glyphicon glyphicon-remove col-md-4", "onclick":"delete_contact("+contact.contact_id+")"});
    var row = $("<div>", {"class":"row","style":"padding-top:10px"});
    row.append(button1);
    row.append(button2);
    row.append(button3);
    buttons.append(row);
    return buttons;
}

function init_list() {
    $('#search_box').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            search();
        }
    });

    $.ajax({ url: '/rest/all', success: function(data) {
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
    var contact = updated_contact(id);
    $.ajax({
        type: "PUT",
        url: "/rest",
        data: contact
    });
    window.location.href = "/";
}

function delete_contact(id) {
    var contact = get_contact(id);
    var temp = confirm("Are you sure to delete contact " + contact.name + "?");
    if (temp) {
        $.ajax({
            type: "DELETE",
            url: "/rest/" + contact.contact_id
        }, function () {
        });
        window.location.href = "/";
    }
}

function fill_in_detail_modal(contact) {
    $.ajax({ url: ("/rest/relation/"+contact.contact_id), success: function(relation_array) {
        $.ajax({ url: ("/rest/photo/"+contact.contact_id), success: function(photo_array) {
            $.ajax({ url: ("/rest/sound/"+contact.contact_id), success: function(sound_array) {
                $.ajax({ url: ("/rest/video/"+contact.contact_id), success: function(video_array) {

                    $('#firstname_detail').html(contact.name.split(" ")[0]);
                    $('#lastname_detail').html(contact.name.split(" ")[1]);
                    $('#phone_detail').html(contact.phone_number);
                    $('#email_detail').html(contact.email);
                    $('#gender_detail').html(contact.gender_name);
                    $('#country_detail').html(contact.country);
                    $('#state_detail').html(contact.state);
                    $('#city_detail').html(contact.city);
                    var relation = relation_array[0];
                    var i = 0;
                    for (i = 1; i < relation_array.length; i++) {
                        relation += " ";
                        relation += relation_array[i];
                    }
                    $('#relation_detail').html(relation);
                    var photo_detail = $('#photo_detail');
                    photo_detail.html("");
                    for (i = 0; i < photo_array.length; i++) {
                        var $img = $("<img>", {"src":"/img/" + photo_array[i] + ".jpg", "class":"img-thumbnail"});
                        photo_detail.append($img);
                    }
                    var sound_detail = $('#sound_detail');
                    sound_detail.html("");
                    for (i = 0; i < sound_array.length; i++) {
                        var $audio = $("<audio>", {"controls":"controls"});
                        var $source = $("<source>", {"src":"/sound/" + sound_array[i] + ".wav", "type": "audio/x-wav"});
                        $audio.append($source);
                        sound_detail.append($audio);
                    }
                    var video_detail = $('#video_detail');
                    video_detail.html("");
                    for (i = 0; i < video_array.length; i++) {

                        var $video = $("<video>", {"controls":"controls", "width":"400"});
                        var $source = $("<source>", {"src":"/video/" + video_array[i] + ".mp4", "type": "video/mp4"});
                        $video.append($source);
                        video_detail.append($video);
                    }
                } })
            } })
        } })
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

function updated_contact(id) {
    var contact = {};
    contact.contact_id = id;
    contact.name = $('#firstname_update').val() + " " + $('#lastname_update').val();
    contact.phone_number = $('#phone_update').val();
    contact.email = $('#email_update').val();
    contact.gender = $('#gender_update').val();
    contact.country = $('#country_update').val();
    contact.state = $('#state_update').val();
    contact.city = $('#city_update').val();
    contact.relation = $('#relation_update').val();
    return contact;
}

function created_contact() {
    var contact = {};
    contact.name = $('#firstname_create').val() + " " + $('#lastname_create').val();
    contact.phone_number = $('#phone_create').val();
    contact.email = $('#email_create').val();
    contact.gender = $('#gender_create').val();
    contact.country = $('#country_create').val();
    contact.state = $('#state_create').val();
    contact.city = $('#city_create').val();
    contact.relation = $('#relation_create').val();
    return contact;
}
