// Définition d'une fonction anonyme qui prend en paramètre un objet global
(function (global) {
    "use strict";

    // Création d'un objet 'computer' qui hérite des propriétés de l'objet 'player' 
    // et qui ajoute des propriétés spécifiques à l'ordinateur
    var computer = _.assign({}, player, {
        grid: [],           // grille de l'ordinateur
        tries: [],          // les coups joués par l'ordinateur
        fleet: [],          // flotte de l'ordinateur
        game: null,         // jeu en cours
        play: function () {     // méthode 'play' pour que l'ordinateur puisse jouer
            var self = this;

            // Définit un délai de 2 secondes avant que l'ordinateur joue un coup
            setTimeout(function () {
                // Choix d'une position de manière random
                var x = self.randomPos();
                var y = self.randomPos();

                // Appel de la méthode 'fire' pour tirer sur une case du joueur
                // et mise à jour des résultats des coups joués par l'ordinateur
                self.game.fire(this, x, y, function (hasSucced) {
                    self.tries[y][x] = hasSucced;
                    if(hasSucced){
                        // Changement de couleur de la case si le tir a touché un bateau du joueur
                        document.querySelector('.mini-grid').children[y].children[x].style.backgroundColor = '#8B0000';
                    }
                }); 
            }, 2000);
        },
        isShipOk: function (callback) { // Vérifie si les bateaux de l'ordinateur sont bien placés et appelle le callback une fois terminé

            var i = 0;
            while(i < 4){   // On essaie de placer 4 bateaux
                var axe = this.randomAxe(); // Utilise la méthode qui choisis l'axe de manière random
                var y = this.randomPos(); // Défini une position Y random
                var x = this.randomPos(); // Défini une position X random

                // Permet de placer le bateau avec la méthode setActiveShipPosition & de passer au suivant
                if(this.game.axe === "Horizontale" && this.setActiveShipPosition(y,x, axe) 
                || this.game.axe === "Verticale" && this.setActiveShipPosition(y,x, axe)) 
                {
                    // Cherche s'il y a encore des bateaux à placer
                    this.activateNextShip();
                    i += 1;
                }
            }
            
            // Appel du callback après un délai de 500 millisecondes
            setTimeout(function () {
                callback();
            }, 500);

            // Affichage de la grille de l'ordinateur dans la console
            console.table(this.grid);
        },
        randomAxe: function() { // Définit un axe random pour le placement des bateaux de l'ordinateur
            var rand = Math.random() * 10;
            if(rand > 4) {
                this.game.axe = 'Horizontale';
            } 
            else {
                this.game.axe = 'Verticale';
            }
        }
    });

    // Ajout de l'objet 'computer' à l'objet global
    global.computer = computer;

}(this));