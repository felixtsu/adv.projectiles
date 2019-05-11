/**
* A hero controller
*/
//% weight=100 color=#6699CC icon="\uf140"
//% groups='["Actions"]'
namespace hero {
    export function init() {
        _hero = new Hero()
        info.setLife(3)
        info.showLife(true)
        info.setLifeImage(img`
            . . . . f f f f f f . . .
            . . f f e e e e f 2 f . .
            . f f e e e e f 2 2 2 f .
            . f e e e f f e e e e f .
            . f f f f e e 2 2 2 2 e f
            . f e 2 2 2 f f f f e 2 f
            f f f f f f f e e e f f f
            f f e 4 4 e b f 4 4 e e f
            f e e 4 d 4 1 f d d e f .
            . f e e e 4 d d d d f . .
            . . f f e e 4 4 4 e f . .
            . . . 4 d d e 2 2 2 f . .
            . . . e d d e 2 2 2 f . .
            . . . f e e f 4 5 5 f . .
            . . . . f f f f f f . . .
            . . . . . f f f . . . . .
        `)
        info.onLifeZero(function () {
            game.over()
        })
    }

    export function lostLife() {
        _hero.lostLife()
    }

    export function update() {
        _hero.update()
    }

    export function nextWeaponSystem(): void {
        _hero.nextWeaponSystem()

    }


    /**
     * let the hero splash
     * @param kind the kind to make the corgi 
     * @param x optional initial x position, eg: 10
     * @param y optional initial y position, eg: 70
     */
    //% block
    //% expandableArgumentMode=toggle
    //% inlineInputMode=inline
    //% weight=100
    //% group="Action"
    export function attack(): void {
        _hero.attack();
    }
    export function getHeroPosition(): number[] {
        return _hero.position()
    }

    class Hero {
        private _hero: Sprite

        private _bkg: Image
        private ammoLeftInCycle: number
        private isShootInThisCycle: boolean

        private static WEAPON_SYSTEM_LIST: advprojectiles.ProjectileSystem[] = [/*advprojectiles.ProjectileSystem.Circling, */
            advprojectiles.ProjectileSystem.LightSaber, advprojectiles.ProjectileSystem.ExplosiveMine]

        private _currentWeaponSystem: number = 0;


        public constructor() {
            this._hero = sprites.create(img`
                . . . . . . f f f f f f . . . .
                . . . . f f e e e e f 2 f . . .
                . . . f f e e e e f 2 2 2 f . .
                . . . f e e e f f e e e e f . .
                . . . f f f f e e 2 2 2 2 e f .
                . . . f e 2 2 2 f f f f e 2 f .
                . . f f f f f f f e e e f f f .
                . . f f e 4 4 e b f 4 4 e e f .
                . . f e e 4 d 4 1 f d d e f . .
                . . . f e e e 4 d d d d f . . .
                . . . . f f e e 4 4 4 e f . . .
                . . . . . 4 d d e 2 2 2 f . . .
                . . . . . e d d e 2 2 2 f . . .
                . . . . . f e e f 4 5 5 f . . .
                . . . . . . f f f f f f . . . .
                . . . . . . . f f f . . . . . .
            `, SpriteKind.Player)

            this._hero.onOverlap((other: Sprite) => {
                if (other.kind() == SpriteKind.Enemy
                    || other.kind() == SpriteKind.EnemyProjectile) {
                    this.lostLife()
                    other.destroy()
                }
            })

            this._hero.setPosition(20, 64)
            controller.moveSprite(this._hero, 40, 40)
            this._hero.setFlag(SpriteFlag.StayInScreen, true)

            this.initAnimation()
            this.ammoLeftInCycle = 3;

            this._bkg = scene.backgroundImage()
            this.drawWeaponSystem()
        }

        position(): number[] {
            return [this._hero.x, this._hero.y]
        }

        initAnimation(): void {

            let attackAnim: animation.Animation = animation.createAnimation(ActionKind.attack, 333)
            attackAnim.addAnimationFrame(img`
                . . . . . . . f f . . . . . . . . . . .
                . . . . f f f f 2 f f . . . . . . . . .
                . . f f e e e e f 2 f f . . . . . . . .
                . f f e e e e e f 2 2 f f . . . . . . .
                . f e e e e f f e e e e f . . . . . . .
                . f f f f f e e 2 2 2 2 e f . . . . . .
                f f f e 2 2 2 f f f f e 2 f . . . . . .
                f f f f f f f f e e e f f f . . . . . .
                f e f e 4 4 e b f 4 4 e e f . . . . . .
                . f e e 4 d 4 b f d d e f . . . . . . .
                . . f e e e 4 d d d e e . c . . . . . .
                . . . f 2 2 2 2 e e d d e c c c c c c c
                . . . f 4 4 4 e 4 4 d d e c d d d d d .
                . . . f f f f f e e e e . c c c c c . .
                . . f f f f f f f f . . . c . . . . . .
                . . f f f . . f f . . . . . . . . . . .
            `)
            attackAnim.addAnimationFrame(img`
                . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . f f f . . . . . . . . . . . .
                . . . . f f f f f 2 f . . . . . . . . . . .
                . . f f e e e e e 2 2 f f . . . . . . . . .
                . f f e e e e e e 2 2 2 f f . . . . . . . .
                . f e e e e f f f e e e e f . . . . . . . .
                . f f f f f e e e 2 2 2 2 e f . . . . . . .
                f f f e 2 2 2 f f f f f e 2 f . . . . . . .
                f f f f f f f f f e e e f f f . . . . . c c
                f e f e 4 4 e b b f 4 4 e e f . . . c c d c
                . f e e 4 d 4 b b f d d e f . . c c d d c c
                . . f e e e 4 d d d d d f e e c d d d c . .
                . . . f 2 2 2 2 2 2 2 e e d d c d c c . . .
                . . . f 4 4 4 4 4 5 e 4 4 d d c c c . . . .
                . . . f f f f f f f f e e e e . . . . . . .
                . . . f f f . . . f f . . . . . . . . . . .
            `)
            attackAnim.addAnimationFrame(img`
                . . . . . . . . . . . . . . . . .
                . . . . f f f f f f . . . . . . .
                . . f f e e e e f 2 f . . . . . .
                . f f e e e e f 2 2 2 f . . . . .
                . f e e e f f e e e e f . . . c c
                . f f f f e e 2 2 2 2 e f . c d c
                . f e 2 2 2 f f f f e 2 f c d d c
                f f f f f f f e e e f f c d d c .
                f f e 4 4 e b f 4 4 e c d d c . .
                f e e 4 d 4 1 f d d e c d c . . .
                . f e e e 4 d d d e d c c c . . .
                . . f f e e 4 4 e 4 d d e . . . .
                . . . f 2 2 2 2 4 4 e e . . . . .
                . . . f 2 2 2 2 e 2 f . . . . . .
                . . . f 4 4 4 4 5 5 f . . . . . .
                . . . . f f f f f f . . . . . . .
                . . . . . f f f . . . . . . . . .
            `)
            animation.attachAnimation(this._hero, attackAnim)
            let idleAnnim: animation.Animation = animation.createAnimation(ActionKind.Idle, 333)
            idleAnnim.addAnimationFrame(img`
                . . . . . . f f f f f f . . . .
                . . . . f f e e e e f 2 f . . .
                . . . f f e e e e f 2 2 2 f . .
                . . . f e e e f f e e e e f . .
                . . . f f f f e e 2 2 2 2 e f .
                . . . f e 2 2 2 f f f f e 2 f .
                . . f f f f f f f e e e f f f .
                . . f f e 4 4 e b f 4 4 e e f .
                . . f e e 4 d 4 1 f d d e f . .
                . . . f e e e 4 d d d d f . . .
                . . . . f f e e 4 4 4 e f . . .
                . . . . . 4 d d e 2 2 2 f . . .
                . . . . . e d d e 2 2 2 f . . .
                . . . . . f e e f 4 5 5 f . . .
                . . . . . . f f f f f f . . . .
                . . . . . . . f f f . . . . . .
            `)
            idleAnnim.addAnimationFrame(img`
                . . . . . . . . . . . . . . . .
                . . . . . . f f f f f f . . . .
                . . . . f f e e e e f 2 f . . .
                . . . f f e e e e f 2 2 2 f . .
                . . . f e e e f f e e e e f . .
                . . . f f f f e e 2 2 2 2 e f .
                . . . f e 2 2 2 f f f f e 2 f .
                . . f f f f f f f e e e f f f .
                . . f f e 4 4 e b f 4 4 e e f .
                . . f e e 4 d 4 1 f d d e f . .
                . . . f e e e e e d d d f . . .
                . . . . . f 4 d d e 4 e f . . .
                . . . . . f e d d e 2 2 f . . .
                . . . . f f f e e f 5 5 f f . .
                . . . . f f f f f f f f f f . .
                . . . . . f f . . . f f f . . .
            `)
            idleAnnim.addAnimationFrame(img`
                . . . . . . f f f f f f . . . .
                . . . . f f e e e e f 2 f . . .
                . . . f f e e e e f 2 2 2 f . .
                . . . f e e e f f e e e e f . .
                . . . f f f f e e 2 2 2 2 e f .
                . . . f e 2 2 2 f f f f e 2 f .
                . . f f f f f f f e e e f f f .
                . . f f e 4 4 e b f 4 4 e e f .
                . . f e e 4 d 4 1 f d d e f . .
                . . . f e e e 4 d d d d f . . .
                . . . . f f e e 4 4 4 e f . . .
                . . . . . 4 d d e 2 2 2 f . . .
                . . . . . e d d e 2 2 2 f . . .
                . . . . . f e e f 4 5 5 f . . .
                . . . . . . f f f f f f . . . .
                . . . . . . . f f f . . . . . .
            `)
            animation.attachAnimation(this._hero, idleAnnim)
        }

        attack(): void {
            animation.setAction(this._hero, ActionKind.attack)

            if (this.ammoLeftInCycle == 0) {
                return null;
            }
            this.ammoLeftInCycle -= 1

            if (this.currentWeaponSystem() == advprojectiles.ProjectileSystem.ExplosiveMine) {
                let projectile = advprojectiles.fireAProjectile(this._hero,
                    advprojectiles.ProjectileSystem.ExplosiveMine,
                    advprojectiles.ProjectileType.Friendly)
            } else if (this.currentWeaponSystem() == advprojectiles.ProjectileSystem.Circling) {

            } else {
                let projectile = advprojectiles.fireAProjectile(this._hero,
                    advprojectiles.ProjectileSystem.LightSaber,
                    advprojectiles.ProjectileType.Friendly)
            }

            this.drawWeaponSystem()
        }

        nextWeaponSystem(): void {
            this._currentWeaponSystem += 1;
            if (this._currentWeaponSystem >= Hero.WEAPON_SYSTEM_LIST.length) {
                this._currentWeaponSystem = 0;
            }
            this.drawWeaponSystem()
        }

        currentWeaponSystem(): advprojectiles.ProjectileSystem {
            return Hero.WEAPON_SYSTEM_LIST[this._currentWeaponSystem];
        }

        drawWeaponSystem() {
            this._bkg.fillRect(0, 120 - (image.font8.charHeight + 2), image.font8.charWidth + 2 + 10, image.font8.charHeight + 2, 3)
            this._bkg.fillRect(0, 120 - (image.font8.charHeight + 1), image.font8.charWidth + 1 + 10, image.font8.charHeight + 1, 10)
            this._bkg.drawTransparentImage(advprojectiles.getWeaponIcon(this.currentWeaponSystem()), image.font8.charWidth + 1, 120 - (image.font8.charHeight + 1))
            this._bkg.print(this.ammoLeftInCycle.toString(), 0, 120 - (image.font8.charHeight + 1))
        }

        lostLife() {
            info.changeLifeBy(-1)
            scene.cameraShake()
        }


        // called every cycle, reset state
        update() {
            // reload ammo
            this.ammoLeftInCycle = 3
            animation.setAction(this._hero, ActionKind.Idle)
            this.drawWeaponSystem()

        }

    }

    let _hero: Hero = null;

}

