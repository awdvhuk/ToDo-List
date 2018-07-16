$(document).ready(function(){
    var editID;

    $('body').on('keydown', '.new-todo', function(){
                if ( event.keyCode == 13 ) {
                    addNewTodo();
                }
            })
            .on('dblclick', 'li', startEdit)
            .on('keydown', 'li', function(){
                if ( event.keyCode == 27 ) {
                    endEdit();
                }
                if ( event.keyCode == 13 ) {
                    applyEdit();
                }
            })
            .on('blur', '.edit', endEdit)
            .on('click', '.toggle', taskCompliet)
            .on('click', '.toggle-all', pickAll)
            .on('click', '.clearAll', clearAllCompliet)
            .on('click', '.del', deliteTask)
            .on('click', '.all, .active, .compliet', listSort);
            

    function addNewTodo() {
        $('.toggle-all').prop('checked', false);
        var val = {
            text: $('.new-todo').val(),
            completed: false
        };
        if ( val.text == '' || val.text == false ) { return; }
        $('.new-todo').val('');
        $('.main label').css('display', 'unset');
        $('.operations').css('display', 'flex');
        var arr = get();
        arr.push(val);
        set(arr);
        counter(arr);
        toScreen(arr.length - 1);
    }

    function displayList() {
        var arr = get();
        if ( arr.length == 0 ) {
            localStorage.setItem('list-sort', 'all');
            borderColor();
            $('.all').css('border-color', 'rgba(175, 47, 47, 0.2)', '!important');
            $('.main label').css('display', 'none');
            $('.operations').css('display', 'none');
            return;
        }
        borderColor();
        $('.main label').css('display', 'unset');
        var count = compliteCount();
        switch ( count ) {
            case arr.length:
            $('.toggle-all').prop('checked', true);
            $('.clearAll').css('opacity', '1');
            break;

            case 0:
            $('.toggle-all').prop('checked', false);
            $('.clearAll').css('opacity', '0');
            break;

            default:
            $('.toggle-all').prop('checked', false);
            $('.clearAll').css('opacity', '1');
        }
        for ( let i = 0; i < arr.length; i++ ) {
            switch (localStorage.getItem('list-sort')) {
                case 'all':
                toScreen(i);
                break;

                case 'active':
                if ( !arr[i].completed ) {
                    toScreen(i);
                }
                break;

                case 'compliet':
                if ( arr[i].completed ) {
                    toScreen(i);
                }
                break;
            }
        }
        $('.operations').css('display', 'flex');
        counter(arr);
    }

    function toScreen(id){
        var arr = get();
        $('.list').append(`<li class="` + id + `">` + arr[id].text + `</li>`);
        $('li:last-child').append(`
            <input class="toggle ` + id + `" type="checkbox">
            <label></label>
            <button class="del ` + id + `">×</button>`);
        if ( arr[id].completed == true ) {
            li.className += ' completed';
            $('.toggle:last').prop('checked', true);
        }
    }

    function startEdit() {
        $(this).append('<input class="edit">');
        editID = $(this).attr("class");
        var split = editID.split(' ');
        editID = split[0];
        var arr = get();
        var val = arr[editID].text;
        $('.edit').val(val);
        $('.edit').focus();
        $(this).addClass('editing');
    }

    function applyEdit() {
        if ( $('.edit').val() == '' || $('.edit').val() == false ) {
            deliteTask(editID);
            return;
        }
        var arr = get();
        arr[editID].text = $('.edit').val();
        set(arr);
        $('.list').empty();
        endEdit();
        displayList();
    }

    function endEdit() {
        $('.editing').removeClass('editing');
        $('.edit').remove();
        $('.new-todo').focus();
    }

    function deliteTask(id){
        if ( id != editID ) {
            id = $(this).attr("class");
            id = id.split(' ').pop();
        }
        if ( id == '0' ) { id = 0; }
        var arr = get();
        arr.splice(+id, 1);
        set(arr);
        $('.' + id).remove();
        refresh();
    }

    function taskCompliet(){
        var id = $(this).attr("class");
        id = id.split(' ').pop();
        if ( id == '0' ) { id = 0; }
        var arr = get();
        switch (arr[id].completed) {
            case true:
            arr[id].completed = false;
            break;

            case false:
            arr[id].completed = true;
            break;
        }
        set(arr);
        refresh();
    }

    function clearAllCompliet() {
        var arr = get();
        for ( let i = 0; i < arr.length; i++ ) {
            if ( arr[i].completed ) {
                arr.splice(i, 1);
                i--;
            }
        }
        set(arr);
        refresh();
    }

    function pickAll() {
        var arr = get();
        if ( $('.toggle-all').prop('checked') ) {
            for ( let i = 0; i < arr.length; i++ ) {
                arr[i].completed = true;
            }
        
        }
        else {
            for ( let i = 0; i < arr.length; i++ ) {
                arr[i].completed = false;
            }
        }
        set(arr);
        refresh();
    }

    function compliteCount() {
        var arr = get();
        var count = 0;
        for ( let i = 0; i < arr.length; i++ ) {
            if ( arr[i].completed ) {
                count++;
            }
        }
        return count;
    }

    function counter(arr) {
        var counter = 0;
        var arr = get();
        for ( let i = 0; i < arr.length; i++ ) {
            if ( !arr[i].completed ) {
                counter++;
            }
        }
        switch (counter) {
            case 1:
            $('.count').val('1 item left');
            break;

            default:
            var screen = counter + ' items left';
            $('.count').val(screen);
        }
    }

    function listSort() {
        var buttonClass = $(this).attr('class');
        localStorage.setItem('list-sort', buttonClass);
        borderColor();
        refresh();
    }

    function borderColor() {
        switch (localStorage.getItem('list-sort')) {
            case 'all':
            $('.active, .compliet').css('border-color', '');
            break;

            case 'active':
            $('.all, .compliet').css('border-color', '');
            break;

            case 'compliet':
            $('.all, .active').css('border-color', '');
            break;
        }
        $('.' + localStorage.getItem('list-sort')).css('border-color', 'rgba(175, 47, 47, 0.2)', '!important');
    }

    function refresh() {
        $('.list').empty();
        displayList();
        $('.new-todo').focus();
    }

    function set(val) {
        localStorage.setItem('Andrews-ToDo', JSON.stringify(val));
    }

    function get() {
        return (JSON.parse(localStorage.getItem('Andrews-ToDo')) || []);
    }

    displayList();
});