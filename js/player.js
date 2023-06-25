/*jslint browser this */
/*global _, shipFactory, player, utils */

(function (global) {
    "use strict";

    var ship = { dom: { parentNode: { removeChild: function () {} } } };

    var player = {
        grid: [],
        tries: [],
        fleet: [],
        game: null,
        activeShip: 0,
        soundmiss: new Audio("./img/bwop.ogg"),
        soundhit: new Audio("./img/bwop.ogg"),
        init: function () {
            // créé la flotte
            this.fleet.push(shipFactory.build(shipFactory.TYPE_BATTLESHIP));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_DESTROYER));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_SUBMARINE));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_SMALL_SHIP));

            // créé les grilles
            this.grid = utils.createGrid(10, 10);
            this.tries = utils.createGrid(10, 10);
        },
        // appel la fonction fire du game, et lui passe une calback pour récupérer le résultat du tir
        play: function (col, line) {
            // appel la fonction fire du game, et lui passe une calback pour récupérer le résultat du tir
            this.game.fire(
                this,
                col,
                line,
                _.bind(function (hasSucced) {
                    this.tries[line][col] = hasSucced;
                }, this)
            );
        },
        // quand il est attaqué le joueur doit dire si il a un bateaux ou non à l'emplacement choisi par l'adversaire
        receiveAttack: function (col, line, callback) {
            var succeed = false;

            console.log(this.grid[line][col]);
            if (this.grid[line][col] !== 0) {
                succeed = true;

                //enlever une vie au bateau touche
                const indexOfShip = this.fleet.findIndex(ship => ship.id === this.grid[line][col]);
                this.fleet[indexOfShip].life--

                if (this.fleet[indexOfShip].life === 0) {
                    const shipName = this.fleet[indexOfShip].name.toLowerCase();
                    this.shipSunk(shipName);
                }

                this.grid[line][col] = true;
                this.renderShips();
            }
            callback.call(undefined, succeed);
        },

        // Définition de la fonction setActiveShipPosition qui prend deux arguments, x et y.
        setActiveShipPosition: function (x, y) {
            var ship = this.fleet[this.activeShip];
            var getVertical = ship.getVertical(); //

            var i = 0;
            var j = 0; // j check si la case est pleine
            var h = 0; // h check si la case est pleine

            if (!getVertical) {
                x = x - Math.floor(ship.getLife() / 2);
                while (j < ship.getLife()) {
                    if (this.grid[y][x + j] != 0) {
                        return false;
                    }
                    j += 1;
                }
                while (i < ship.getLife()) {
                    this.grid[y][x + i] = ship.getId();
                    i += 1;
                }
                return true;
            } else {
                // décale le curseur pour revenir au début du ship
                y = y - Math.floor(ship.getLife() / 2);
                while (h < ship.getLife()) {
                    if (typeof this.grid[y + h] === "undefined") {
                        return false;
                    } else if (this.grid[y + h][x] !== 0) {
                        return false;
                    }
                    h += 1;
                }
                i = 0;
                while (i < ship.getLife()) {
                    this.grid[y + i][x] = ship.getId();
                    i += 1;
                }
                return true;
            }
        },

        clearPreview: function () {
            this.fleet.forEach(function (ship) {
                if (ship.dom.parentNode) {
                    // ship.dom.parentNode.removeChild(ship.dom);
                    ship.dom.remove();
                }
            });
        },
        resetShipPlacement: function () {
            this.clearPreview();

            this.activeShip = 0;
            this.grid = utils.createGrid(10, 10);
        },
        activateNextShip: function () {
            if (this.activeShip < this.fleet.length - 1) {
                this.activeShip += 1;
                return true;
            } else {
                return false;
            }
        },
        renderTries: function (grid) {
            this.tries.forEach(function (row, rid) {
                row.forEach(function (val, col) {
                    var node = grid.querySelector(
                        ".row:nth-child(" +
                        (rid + 1) +
                        ") .cell:nth-child(" +
                        (col + 1) +
                        ")"
                    );
                    if (val === true) {
                        node.style.backgroundColor = "#e60019";
                        node.classList.add("hit");
                    } else if (val === false) {
                        node.style.backgroundColor = "#aeaeae";
                        node.classList.add("miss");
                    }
                });
            });
        },
        renderShips: function (grid) {},

        setGame: function (game) {
            this.game = game;
        },
        randomPos: function () {
            return Math.floor(Math.random() * 10);
        },
        shipSunk: function (shipName) {
            let node = this.game.shipIcons.querySelector(`.${shipName}`);
            console.log(node)
            node.classList.add('sunk');
        }
    };

    global.player = player;
})(this);
