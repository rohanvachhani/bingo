$(document).ready(function() {
    console.log("ready!");
    var edit_chance = 1;
    //set the grid editable

    $('td').attr('contenteditable', 'true');
    $('td').focus(function() {
        $(this).html(' ');
    });

    var table_set = 0;
    var ary = [];
    var null_cell = 99; //initially
    var error = 99; //initially
    for (var i = 0; i < 25; i++) ary[i] = 0;

    $("#set").click(function() {
        $('td').attr('contenteditable', 'false');
        var table = document.getElementById("gameBoard");

        check();

        print_arry_in_consol();
    });

    function check() {
        //initialize all with 0
        for (var i = 0; i < 25; i++) ary[i] = 0;
        null_cell = 0;
        error = 0;
        var i = 0;
        var global_index = 0;
        $('td').attr('contenteditable', 'false');
        //check for numbers (num only)
        $('#gameBoard tr').each(function(index_tr) { // 0 to 4 rows
            $(this).find('td').each(function(index_td) { //0 to 4 cols
                //do your stuff, you can use $(this) to get current cell
                global_index = (index_tr * 5) + index_td; //converted into 0 to 24 cells

                if ($(this).html()) { //if not null
                    var current_cell = $(this).html().trim(); //trim takes my half an hour to detect error;
                    console.log('global index  : ' + global_index + ' pos' + (i + 1) + " : " + current_cell);

                    if (!(current_cell >= 1 && current_cell <= 25)) {
                        //alert("PLs ONlty use num bw. 1 to 25(no-repeat)");
                        $('td').attr('contenteditable', 'true');
                        //check();
                        error = 1;
                    }

                    //check fr no repeatition
                    for (var j = 0; j < 25; j++) {
                        if (current_cell == ary[j]) {
                            //alert("no repaated values are alowed.!");

                            $('td').attr('contenteditable', 'true');
                            //check();
                            error = 2;
                        }
                    }

                } else { //if null
                    // alert("Enter a value..!");
                    null_cell = 1;
                    $('td').attr('contenteditable', 'true');
                    //check();
                }
                if (null_cell == 0 && error == 0) {
                    ary[i] = current_cell;
                    i++;
                }

            });


        });
        if (null_cell == 1 || error != 0) {
            alert('Error Because Of: \n1.)cells are null\n2.)repeated values\n3.)not numbers bw. 1 to 25');
            $('td').attr('contenteditable', 'true');
        }
        console.log("null_cell value : " + null_cell);
    }

    $('table td').on('input', function() {
        console.log($(this).text());

    });

    function print_arry_in_consol() {
        if (null_cell == 0 && error == 0) {
            for (var k = 0; k < 25; k++) {
                console.log('ary[' + (k + 1) + '] : ' + ary[k]);
            }
            console.log('input accpeted.');
            table_set = 1;
            if (confirm("BINGO CARD IS READY!\nNow Click On CREATE or JOIN ROOm")) {
                txt = "You pressed OK!";
            }
        } else {
            console.log('input is not still not appropriate...');
            console.log('status::-- null_cells: ' + null_cell + " error: " + error);
        }

    }


    //till now table is ready
    //evry time i have to check whether null_cell and error is 0 as step of precaution.!!
    //*******************************************************************************************************************
    //*******************************************************************************************************************
    //*******************************************************************************************************************



    class player {
        constructor(name) {
            this.name = name;
            this.currentTurn = true;
        }
        setCurrentTurn(turn) {
            this.currentTurn = turn;
            const message = turn ? 'Your turn' : 'Waiting for Opponent';
            $('#turn').text(message);
            $('#turn').show();
        }
        getPlayerName() {
            return this.name;
        }
        getCurrentTurn() {
            return this.currentTurn;
        }
    }
    class game {
        constructor(roomID) {
            this.roomID = roomID;

        }
        getRoomId() {
            return this.roomId;
        }
    }

    //for keeping the record of player's winnig stack
    var used = new Array(25);
    for (var i = 0; i < 26; i++) {
        used[i] = 0; //initialy no one digit is used 
    }
    var arry_of_done = [];
    var count_done = 0; //if = 5 then win
    for (var i = 0; i < 5; i++) {
        arry_of_done[i] = [];
    }

    arry_of_done_count = 0;

    //***************************************************************************
    var turn = document.getElementById("turn");
    var room = document.getElementById('room');
    var game_created = 0;
    var game_joined = 0;

    var cr_name = "",
        jn_name = "",
        gameID = "",
        global_room_id = "";
    var name = "";
    // var socket = io.connect('https://bingo-rohan.herokuapp.com');
    // var socket = io.connect('http://localhost:5001');
    var socket = io.connect('bingo-rohanvachhani.vercel.app')

    //emit the create requset to the server when user click on create room button    
    $('#create').on('click', function() {

        console.log('inside create');
        if (null_cell == 0 && error == 0) {
            console.log("all ok..");
            //**Dialog

            cr_name = prompt('Enter Your Name:', "");
            if (cr_name != "" && cr_name) {

                console.log("cr_name: " + cr_name);
                player = new player(cr_name); //object of user who creats the game
                name = cr_name; //if user is a creater of game room
                $("#join").prop("disabled", true); //disabled the join room button
                socket.emit('createGame', { name: player.name });

                game_created = 1;
                player.setCurrentTurn(true);
                const message = `Hello, ${player.getPlayerName()}`;
                console.log(message);
            }

        } else {
            alert('please, Set up the table first!');
        }
    });

    //listen the message coming from the server
    socket.on('newGame', function(data) {
        if (game_created == 1) {
            const message = `Hello, ${data.name}. Please ask your friend to enter Game ID: 
      ${data.room}. Waiting for player 2...`;
            console.log(message);
            turn.innerHTML = message;
        }
        // Create game for player 1
        game = new game(data.room);
        global_room_id = data.room;

    });

    $("#join").on('click', function() {
        console.log('inside join');
        if (null_cell == 0 && error == 0) {
            console.log("all ok..");
            //**Dialog
            while (jn_name == "" || jn_name == null) { //returns null when click on cancel button in prompt
                jn_name = prompt('Enter Your Name:', "");
            }
            while (gameID == "" || gameID == null) { //game is roomID basically
                // statement
                gameID = prompt("Enter Game ID", "");
            }

            console.log("jn_name: " + jn_name + " roomId: " + gameID);
            name = jn_name; //if user is a joiner of game room
            $("#create").prop("disabled", true); //disabled the create room button

            socket.emit('joinGame', { name: jn_name, room: gameID });
            player = new player(name);
            //game = new game(gameID);
            global_room_id = gameID;

            game_joined = 1;

        } else {
            alert('please, Set up the table first!');
        }
    });



    //***********************************************************************

    socket.on('player1', function(data) {
        const message = `Hello, ${player.getPlayerName()}`;
        console.log(message + ", " + data.name + " is joined");
        turn.innerHTML = message + ", " + data.name + " is joined";
        game_joined = 1;
        $('#room').css('display', 'none');
        //console.log('player 1 fun: game joined');
    });

    socket.on('player2', function(data) {
        room.innerHTML = "NAME: " + data.name + ", " + data.room;
        console.log('player 2: name: ' + data.name + " room: " + data.room);
        const message = `Hello, ${player.getPlayerName()}`;
        console.log(message);
        game_created = 1;

        //console.log('player 2 fun: game joined');
    });

    socket.on('err', function(data) {
        room.innerHTML = "Sorry Room Is Full";
        $("#create").prop("disabled", false); //user can now create the game
    });

    socket.on('gameEnd', function(data) {
        // turn.innerHTML = data.msg;
        // $('#turn').show();
        // socket.leave(global_room_id);
        alert(data.msg);
         location.reload();
    });


    $("#gameBoard").on('click', 'td', function() {
        if (game_created && game_joined) {
            console.log($(this).html());
            if (player.getCurrentTurn()) {
                $('#room').hide();
                $('#turn').hide();
                //****
                //alert($(this).html());
                var move = $(this).html().trim();
                console.log('Move: ' + move);

                if (!is_marked(move.trim()) /*true*/ ) {
                    //change the color of cuurent move element
                    mark_move(move.trim());
                    $(this).css('color', 'black');
                    //check win 
                    if (check_win()) {
                        var msg_to_send = ":: " + player.getPlayerName() + " is WINNER.!";
                        socket.emit('gameEnd', { msg: msg_to_send });

                        console.log(msg_to_send);
                        turn.innerHTML = msg_to_send;
                        $('#turn').show();

                        alert(msg_to_send);

                        location.reload();
                    } else {
                        //if not win
                        socket.emit('move_played', {
                            player_name: player.name,
                            move: move
                        });
                        player.setCurrentTurn(false);
                        turn.innerHTML = 'opponent\'s turn ';
                        $('#turn').show();
                    }

                }
            } else {
                turn.innerHTML = 'not your TURN.!';
                $('#turn').show();
            }
        } else {
            if (table_set) {
                turn.innerHTML = 'Please create or join the game first';
                $('#turn').show();
            }
        }
    });




    socket.on('msg_rcvd', function(data) {
        console.log('data received: ' + data.move);
        for (var i = 0; i < 25; i++) {

            if (ary[i] == data.move.trim()) {
                console.log('in if');
                $('#gameBoard tr').each(function(index_tr) { // 0 to 4 rows
                    $(this).find('td').each(function(index_td) {
                        console.log('current td:' + $(this).html().trim() + " current move:" + data.move);
                        if ($(this).html().trim() == data.move.trim()) {
                            mark_move(data.move.trim());
                            //change the color of cuurent move element
                            $(this).css('color', 'black');
                            if (check_win()) {
                                var msg_to_send = ":: " + player.getPlayerName() + " is WINNER.!";
                                console.log(msg_to_send);
                                socket.emit('gameEnd', { msg: msg_to_send });

                                //turn.innerHTML = msg;
                                //$('#turn').show();

                                alert(msg_to_send);
                                location.reload();
                            } else {
                                player.setCurrentTurn(true);
                                turn.innerHTML = 'your turn';
                                $('#turn').show();
                            }
                        }
                    });
                });

            } else {
                console.log('in else');
            }
        }

    });

    function is_marked(move) {
        for (var i = 0; i < 25; i++) {
            if (ary[i] == move.trim()) {
                if (used[ary[i]] == 0) {
                    console.log(ary[i] + 'not marked');
                    return false;
                } else {
                    console.log('already marked !');
                    return true;
                }
            }
        }
    }

    function mark_move(move) {
        for (var i = 0; i < 25; i++) {
            if (ary[i] == move.trim()) {
                used[ary[i]] = 1;
            }
        }

    }

    function already_counted(a, b, c, d, e) {
        var j = 0;
        for (var i = 0; i < 5; i++) {
            if (arry_of_done[i][j] == a && arry_of_done[i][j + 1] == b && arry_of_done[i][j + 2] == c && arry_of_done[i][j + 3] == d && arry_of_done[i][j + 4] == e) {
                return true;
            }
        }
        return false;
    }

    function check_win() {

        //rows check -> ary[0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24]
        //cols check -> ary[0,5,10,15,20],[1,6,11,16,21],[2,7,12,17,22],[3,8,13,18,23],[4,9,14,19,24]
        //diagonals check -> ary[0,6,12,18,24], [4,8,12,16,20]
        //rohan vachhani ..@RV_R_COMM_1251

        //1. row check()
        for (var i = 0; i < 25; i += 5) {
            if (used[ary[i]] == 1 && used[ary[i + 1]] == 1 && used[ary[i + 2]] == 1 && used[ary[i + 3]] == 1 && used[ary[i + 4]] == 1) {
                if (!already_counted(ary[i], ary[i + 1], ary[i + 2], ary[i + 3], ary[i + 4])) {
                    //insert that row in arry_of_done
                    var j = 0;
                    //if (!arry_of_done[arry_of_done_count]) {
                    arry_of_done[arry_of_done_count][j] = ary[i];
                    arry_of_done[arry_of_done_count][j + 1] = ary[i + 1];
                    arry_of_done[arry_of_done_count][j + 2] = ary[i + 2];
                    arry_of_done[arry_of_done_count][j + 3] = ary[i + 3];
                    arry_of_done[arry_of_done_count][j + 4] = ary[i + 4];
                    arry_of_done_count++;
                    if (arry_of_done_count == 5) {
                        console.log('WINNER');
                        return true;
                    }
                }
                console.log("row made: " + ary[i] + "," + ary[i + 1] + "," + ary[i + 2] + "," + ary[i + 3] + "," + ary[i + 4]);
                console.log('count = ' + arry_of_done_count);
            }

        }

        //2. col check()
        for (var j = 0; j < 5; j++) {
            if (used[ary[j]] == 1 && used[ary[j + 5]] == 1 && used[ary[j + 10]] == 1 && used[ary[j + 15]] == 1 && used[ary[j + 20]] == 1) {
                if (!already_counted(ary[j], ary[j + 5], ary[j + 10], ary[j + 15], ary[j + 20])) {
                    //insert that row in arry_of_done
                    var i = 0;
                    //if (!arry_of_done[arry_of_done_count]) {
                    arry_of_done[arry_of_done_count][i] = ary[j];
                    arry_of_done[arry_of_done_count][i + 1] = ary[j + 5];
                    arry_of_done[arry_of_done_count][i + 2] = ary[j + 10];
                    arry_of_done[arry_of_done_count][i + 3] = ary[j + 15];
                    arry_of_done[arry_of_done_count][i + 4] = ary[j + 20];
                    arry_of_done_count++;
                    if (arry_of_done_count == 5) {
                        console.log('WINNER');
                        return true;
                    }
                }
                console.log("column made: " + ary[j] + "," + ary[j + 5] + "," + ary[j + 10] + "," + ary[j + 15] + "," + ary[j + 20]);
                console.log('count = ' + arry_of_done_count);
            }
        }

        //3. diagonal check
        //diagonal-1
        if (used[ary[0]] == 1 && used[ary[6]] == 1 && used[ary[12]] == 1 && used[ary[18]] == 1 && used[ary[24]] == 1) {
            if (!already_counted(ary[0], ary[6], ary[12], ary[18], ary[24])) {
                //insert that row in arry_of_done
                var i = 0;
                //if (!arry_of_done[arry_of_done_count]) {
                arry_of_done[arry_of_done_count][i] = ary[0];
                arry_of_done[arry_of_done_count][i + 1] = ary[6];
                arry_of_done[arry_of_done_count][i + 2] = ary[12];
                arry_of_done[arry_of_done_count][i + 3] = ary[18];
                arry_of_done[arry_of_done_count][i + 4] = ary[24];
                arry_of_done_count++;
                if (arry_of_done_count == 5) {
                    console.log('WINNER');
                    return true;
                }
            }
            console.log("diagonal-1 made: " + ary[0] + "," + ary[6] + "," + ary[12] + "," + ary[18] + "," + ary[24]);
            console.log('count = ' + arry_of_done_count);
        }

        //diagonal-2
        if (used[ary[4]] == 1 && used[ary[8]] == 1 && used[ary[12]] == 1 && used[ary[16]] == 1 && used[ary[20]] == 1) {
            if (!already_counted(ary[4], ary[8], ary[12], ary[16], ary[20])) {
                //insert that row in arry_of_done
                var i = 0;
                //if (!arry_of_done[arry_of_done_count]) {
                arry_of_done[arry_of_done_count][i] = ary[4];
                arry_of_done[arry_of_done_count][i + 1] = ary[8];
                arry_of_done[arry_of_done_count][i + 2] = ary[12];
                arry_of_done[arry_of_done_count][i + 3] = ary[16];
                arry_of_done[arry_of_done_count][i + 4] = ary[20];
                arry_of_done_count++;
                if (arry_of_done_count == 5) {
                    console.log('WINNER');
                    return true;
                }
            }
            console.log("diagonal-2 made: " + ary[4] + "," + ary[8] + "," + ary[12] + "," + ary[16] + "," + ary[20]);
            console.log('count = ' + arry_of_done_count);
        }
    } //end of check_win functioon


});