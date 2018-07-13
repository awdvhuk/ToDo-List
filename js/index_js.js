$(document).ready(function(){
    var editID;
    displayList();

    $('body').on('keydown', '.new-todo', function(){
        if ( event.keyCode == 13 ) {
            addTodo();
        }
    });

    $('body').on('keydown', 'li', function(){
        if ( event.keyCode == 27 ) {
            editEnd();
        }
        if ( event.keyCode == 13 ) {
            applyEdit();
        }
    });

    $('body').on('click', '.toggle-all', pickAll);

    $('body').on('blur', '.edit', editEnd);

    $('body').on('click', '.clearAll', clear);

    $('body').on('click', '.toggle', done);

    $('body').on('click', '.del', del);

    $('body').on('dblclick', 'li', startEdit);

    $('body').on('click', '.all, .active, .compliet', listSort);

    function addTodo() {
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

    function toScreen(id){
        var arr = get();
        var li = document.createElement('li');
        txt = document.createTextNode(arr[id].text);
        li.appendChild(txt);
        li.className = id + '';
        $('.list').append(li);
        $('li:last-child').append(`
            <input class="toggle" type="checkbox">
            <label></label>
            <button class="del">×</button>
        `);
        $('li:last-child button').addClass(id + '');
        $('li:last-child .toggle').addClass(id + '');
        
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
        var arr = get();
        arr[editID].text = $('.edit').val();
        set(arr);
        $('.list').empty();
        editEnd();
        displayList();
    }

    function editEnd() {
        $('.editing').removeClass('editing');
        $('.edit').remove();
        $('.new-todo').focus();
    }

    function del(){
        var id = $(this).attr("class");
        id = id.split(' ').pop();
        if ( id == '0' ) { id = 0; }
        var arr = get();
        arr.splice(+id, 1);
        set(arr);
        $('.' + id).remove();
        refresh();
    }

    function done(){
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

    function clear() {
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

    function refresh() {
        $('.list').empty();
        displayList();
        $('.new-todo').focus();
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

    function set(val) {
        localStorage.setItem('Andrews-ToDo', JSON.stringify(val));
    }

    function get() {
        return (JSON.parse(localStorage.getItem('Andrews-ToDo')) || []);
    }
});