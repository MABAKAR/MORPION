jQuery(function() {
    (function($) {
        $.fn.morpion = function(args) {
            args = $.extend({
                col: 3,
                line: 3
            }, args);
            if (args["line"] < 3) {
                args["line"] = 3;
            }
            if (args["col"] < 3) {
                args["col"] = 3;
            }
            let user1 = new User("X");
            let user2 = new User("O");
            let morpion = new Morpion(user1, args['line'], args['col']);
            morpion.game(user1, user2);
            $('#currentPlayer').text("Joueur 1");
            $('#replay').on("click", function() {
                $('.cell').each(function() {
                    $(this).text('');
                });
                $("#grid").removeClass("won");
                morpion.count = 0;
                morpion.turn = user1;
                $('#currentPlayer').text("Joueur 1");
            })
            return this;
        };
    })(jQuery);
});

jQuery(function() {
    $("#grid").morpion();
});

class User {
    static count = 1;
    constructor(letter) {
        this.id_user = User.count++;
        this.letter = letter;
        this.nb_victory = 0;
    }
}

class Morpion {
    constructor(user1, line, col) {
        this.count = 0;
        this.turn = user1;
        this.line = line;
        this.col = col;
    }
    game(user1, user2) {
        $('.cell').each((index, cell) => {
            $(cell).attr("data-pos", index);
            $(cell).on("click", () => {
                if ($(cell).text() === "") {
                    $(cell).text(this.turn.letter);
                    //checkWin(turn, this);
                    let win = this.checkWin($(cell).attr("data-pos"), this.turn);
                    if (!win) {
                        if (this.turn === user1) {
                            this.turn = user2;
                        } else {
                            this.turn = user1;
                        }
                        $('#currentPlayer').text("Joueur " + this.turn.id_user);
                        this.count++;
                        if (this.count >= 9) {
                            $(".win-display:first").text("Match nul");
                            $("#grid").addClass("won");
                        }
                    }

                }
            })
        })
    }

    checkWin(pos, player) {
        pos = parseInt(pos);
        let count_array = [
            this.checkHorizontal(pos, player),
            this.checkVerticale(pos, player),
            this.checkDiago2(pos, player),
            this.checkDiago1(pos, player)
        ];

        if (Math.max(...count_array) >= 3) {
            $(".win-display:first").text(`Joueur ${player.id_user} a gagné !`);
            $("#grid").addClass("won");
            player.nb_victory++;
            if (player.id_user === 1) {
                $("#playerOne").text(player.nb_victory);
            } else {
                $("#playerTwo").text(player.nb_victory);
            }
            return true;
        }
        return false;
    }

    checkHorizontal(pos, player) {
        let score = 1;
        let line = Math.floor(pos / this.col);
        let posNeg = pos - 1;
        let posPos = pos + 1;
        while (Math.floor(posNeg / this.col) === line) {
            if ($(`.cell[data-pos='${posNeg}'`).text() !== player.letter) {
                break;
            }
            score++;
            posNeg--;
        }
        while (Math.floor(posPos / this.col) === line) {
            if ($(`.cell[data-pos='${posPos}'`).text() !== player.letter) {
                break;
            }
            score++;
            posPos++;
        }
        return score;
    }

    checkVerticale(pos, player) {
        let score = 1;
        let up = pos - this.col;
        let down = pos + this.col;
        while ($(`.cell[data-pos='${up}'`).text() === player.letter) {
            score++;
            up -= this.col;
        }
        while ($(`.cell[data-pos='${down}'`).text() === player.letter) {
            score++;
            down += this.col;
        }
        return score;

    }

    checkDiago1(pos, player) {
        let score = 1;
        let line1 = Math.floor(pos / this.col);
        let line2 = Math.floor(pos / this.col);
        let diff = this.col - 1;
        let up = pos - diff;
        let down = pos + diff;
        while ($(`.cell[data-pos='${up}'`).text() === player.letter && Math.floor(up / this.col) !== line1) {
            score++;
            up -= diff;
            line1--;
        }
        while ($(`.cell[data-pos='${down}'`).text() === player.letter && Math.floor(down / this.col) !== line2) {
            score++;
            down += diff;
            line2++
        }
        return score;
    }

    checkDiago2(pos, player) {
        let score = 1;
        let line1 = Math.floor(pos / this.col);
        let line2 = Math.floor(pos / this.col);
        let diff = this.col + 1;
        let up = pos - diff;
        let down = pos + diff;
        while ($(`.cell[data-pos='${up}'`).text() === player.letter && Math.floor(up / this.col) !== line1) {
            score++;
            up -= diff;
            line1--;
        }
        while ($(`.cell[data-pos='${down}'`).text() === player.letter && Math.floor(down / this.col) !== line2) {
            score++;
            down += diff;
            line2++;
        }
        return score;
    }
}