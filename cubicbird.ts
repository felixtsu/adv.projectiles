/**
* A hero controller
*/
//% weight=100 color=#6699CC icon="\uf140"
//% groups='["Actions"]'
namespace cubicbird {

    //%block
    export function startNewGame() {
        game.onUpdateInterval(1000, function () {
            hero.update()
            enemy.spawnNewEnemy()
            enemy.enemiesAttack()
        })       
        hero.init() 
    }

    export function fly() {
        
    }
}