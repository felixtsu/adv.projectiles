// Add your code here
namespace enemy {

    export enum EnemyKind {
        Car,
        Ghost,
        TracingCar
    }

    export function enemiesAttack() {
        for (let enemy of enemies) {
            enemy.attack()
        }
    }

    export interface Enemy {
        attack(): Sprite[]
        destroy(): void
    }

    abstract class EnemyBase implements Enemy {
        protected _enemy: Sprite

        public constructor() {
        }

        postConstruct() {
            this._enemy.onDestroyed(function () {
                enemies.removeElement(this);
            })
        }

        public destroy(): void {
        }

        public attack(): Sprite[] {
            return [];
        }
    }

    let enemies: Enemy[] = []

    class Ghost extends EnemyBase implements Enemy {
        private static _projectileImage: Image = img`.1.
            131
        .1.`

        public constructor() {
            super()
            this._enemy = sprites.create(img`
                . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . f f f f . . . . . . . . . .
                . . . . . . . . f f 1 1 1 1 f f . . . . . . . .
                . . . . . . . f b 1 1 1 1 1 1 b f . . . . . . .
                . . . . . . . f 1 1 1 1 1 1 1 d f . . . . . . .
                . . . . . . f d 1 1 1 1 1 1 1 d d f . . . . . .
                . . . . . . f d 1 1 1 1 1 1 d d d f . . . . . .
                . . . . . . f d 1 1 1 d d d d d d f . . . . . .
                . . . . . . f d 1 d f b d d d d b f . . . . . .
                . . . . . . f b d d f c d b b b c f . . . . . .
                . . . . . . . f 1 1 1 1 1 b b c f . . . . . . .
                . . . . . . . f 1 b 1 f f f f f . . . . . . . .
                . . . . . . . f b f c 1 1 1 b f . . . . . . . .
                . . . . . . . . f f 1 b 1 b f f . . . . . . . .
                . . . . . . . . . f b f b f f f . f . . . . . .
                . . . . . . . . . . f f f f f f f f . . . . . .
                . . . . . . . . . . . . f f f f f . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . . .
            `, SpriteKind.Enemy)
            this._enemy.setPosition(160, Math.randomRange(10, 120))
            this._enemy.setVelocity(-30, 0)
            this.postConstruct()
        }

        public attack(): Sprite[] {
            let result: Sprite[] = [];
            let projectile = sprites.createProjectileFromSprite(Ghost._projectileImage, this._enemy, -50, 0);
            projectile.setKind(SpriteKind.EnemyProjectile)
            return result;
        }

    }

    class TracingCar extends EnemyBase implements Enemy {
        private static SPEED = 160

        private vx: number
        private vy: number
        private static aimingAnimation: animation.Animation
        private aimingCycle:boolean

        static init() {
            if (TracingCar.aimingAnimation != undefined) {
                return
            }

            TracingCar.aimingAnimation = animation.createAnimation(ActionKind.Aiming, 200)
            TracingCar.aimingAnimation.addAnimationFrame(img`
                . . . . . . . . . . . . . . . .
                . . . . . . 2 2 2 2 2 2 2 2 . .
                . . . . . 2 c 2 2 2 2 2 2 4 2 .
                . . . . 2 c c 2 2 2 2 2 2 4 c 2
                . . d 2 4 c c 2 4 4 4 4 4 4 c c
                . d 2 2 4 c b e e e e e e e 2 c
                . 2 2 2 4 b e e b b b e b b e 2
                . 2 2 2 2 2 e b b b b e b b b e
                . 2 2 2 2 e 2 2 2 2 2 e 2 2 2 e
                . 2 d d 2 e f e e e f e e e e e
                . d d 2 e e e f e e f e e e e e
                . e e e e e e e f f f e e e e e
                . e e e e f f f e e e e f f f f
                . . . e f f f f f e e f f f f f
                . . . . f f f f . . . . f f f .
                . . . . . . . . . . . . . . . .
            `)
            TracingCar.aimingAnimation.addAnimationFrame(img`
                . . . . . . . . . . . . . . . .
                . . . . . . 3 3 3 3 3 3 3 3 . .
                . . . . . 3 c 3 3 3 3 3 3 d 3 .
                . . . . 3 c c 3 3 3 3 3 3 d c 3
                . . d 3 d c c 3 d d d d d d c c
                . d 3 3 d c b a a a a a a a 3 c
                . 3 3 3 d b a a b b b a b b a 3
                . 3 3 3 3 3 a b b b b a b b b a
                . 3 3 3 3 a 3 3 3 3 3 a 3 3 3 a
                . 3 d d 3 a f a a a f a a a a a
                . d d 3 a a a f a a f a a a a a
                . a a a a a a a f f f a a a a a
                . a a a a f f f a a a a f f f f
                . . . a f f f f f a a f f f f f
                . . . . f f f f . . . . f f f .
                . . . . . . . . . . . . . . . .
            `)
            TracingCar.aimingAnimation.addAnimationFrame(img`
                . . . . . . . . . . . . . . . .
                . . . . . . 6 6 6 6 6 6 6 6 . .
                . . . . . 6 c 6 6 6 6 6 6 9 6 .
                . . . . 6 c c 6 6 6 6 6 6 9 c 6
                . . d 6 9 c c 6 9 9 9 9 9 9 c c
                . d 6 6 9 c b 8 8 8 8 8 8 8 6 c
                . 6 6 6 9 b 8 8 b b b 8 b b 8 6
                . 6 6 6 6 6 8 b b b b 8 b b b 8
                . 6 6 6 6 8 6 6 6 6 6 8 6 6 6 8
                . 6 d d 6 8 f 8 8 8 f 8 8 8 8 8
                . d d 6 8 8 8 f 8 8 f 8 8 8 8 8
                . 8 8 8 8 8 8 8 f f f 8 8 8 8 8
                . 8 8 8 8 f f f 8 8 8 8 f f f f
                . . . 8 f f f f f 8 8 f f f f f
                . . . . f f f f . . . . f f f .
                . . . . . . . . . . . . . . . .
            `)

        }


        public constructor() {
            super()
            TracingCar.init()
            this._enemy = sprites.create(img`
                . . . . . . . . . . . . . . . .
                . . . . . . 2 2 2 2 2 2 2 2 . .
                . . . . . 2 c 2 2 2 2 2 2 4 2 .
                . . . . 2 c c 2 2 2 2 2 2 4 c 2
                . . d 2 4 c c 2 4 4 4 4 4 4 c c
                . d 2 2 4 c b e e e e e e e 2 c
                . 2 2 2 4 b e e b b b e b b e 2
                . 2 2 2 2 2 e b b b b e b b b e
                . 2 2 2 2 e 2 2 2 2 2 e 2 2 2 e
                . 2 d d 2 e f e e e f e e e e e
                . d d 2 e e e f e e f e e e e e
                . e e e e e e e f f f e e e e e
                . e e e e f f f e e e e f f f f
                . . . e f f f f f e e f f f f f
                . . . . f f f f . . . . f f f .
                . . . . . . . . . . . . . . . .
            `, SpriteKind.Enemy)
            this._enemy.setPosition(148, Math.randomRange(0, 80))
            this._enemy.setVelocity(0, 0)
            animation.attachAnimation(this._enemy, TracingCar.aimingAnimation)
            this.aimingCycle = true
            this.postConstruct();
        }

        private aim() {
            let heroPosition = hero.getHeroPosition();
            let tracingCarPositionX = this._enemy.x
            let tracingCarPositionY = this._enemy.y

            let radius = Math.atan2(heroPosition[0] - tracingCarPositionX, heroPosition[1] - tracingCarPositionY)
            this.vx = Math.sin(radius) * TracingCar.SPEED
            this.vy = Math.cos(radius) * TracingCar.SPEED
            this.aimingCycle = false

            animation.setAction(this._enemy, ActionKind.Aiming)
        }

        public attack(): Sprite[] {
            if (this.aimingCycle) {
                this.aimingCycle = false
                this.aim()
                return []
            } else {
                this._enemy.vx = this.vx
                this._enemy.vy = this.vy
                return [this._enemy]
            }

        }

    }

    class Car extends EnemyBase implements Enemy {

        private static _projectileImage: Image = img`.1.
            131
        .1.`

        public constructor() {
            super()
            this._enemy = sprites.create(img`
                . . . . . . . . . . . . . . . .
                . . . . . . 3 3 3 3 3 3 3 3 . .
                . . . . . 3 c 3 3 3 3 3 3 d 3 .
                . . . . 3 c c 3 3 3 3 3 3 d c 3
                . . d 3 d c c 3 d d d d d d c c
                . d 3 3 d c b a a a a a a a 3 c
                . 3 3 3 d b a a b b b a b b a 3
                . 3 3 3 3 3 a b b b b a b b b a
                . 3 3 3 3 a 3 3 3 3 3 a 3 3 3 a
                . 3 d d 3 a f a a a f a a a a a
                . d d 3 a a a f a a f a a a a a
                . a a a a a a a f f f a a a a a
                . a a a a f f f a a a a f f f f
                . . . a f f f f f a a f f f f f
                . . . . f f f f . . . . f f f .
                . . . . . . . . . . . . . . . .
            `, SpriteKind.Enemy)
            this._enemy.setPosition(160, Math.randomRange(10, 120))
            this._enemy.setVelocity(0, 0)
            this._enemy.ax += -30
            this.postConstruct()
        }

        public attack(): Sprite[] {

            let result: Sprite[] = []
            let projectile: Sprite = null
            projectile = sprites.createProjectileFromSprite(Car._projectileImage, this._enemy, -30, 0)
            projectile.setKind(SpriteKind.EnemyProjectile);
            result.push(projectile)

            projectile = sprites.createProjectileFromSprite(Car._projectileImage, this._enemy, -20, 20)
            projectile.setKind(SpriteKind.EnemyProjectile);
            result.push(projectile)

            projectile = sprites.createProjectileFromSprite(Car._projectileImage, this._enemy, 0, 30)
            projectile.setKind(SpriteKind.EnemyProjectile);
            result.push(projectile)

            projectile = sprites.createProjectileFromSprite(Car._projectileImage, this._enemy, -20, -20)
            projectile.setKind(SpriteKind.EnemyProjectile);
            result.push(projectile)

            projectile = sprites.createProjectileFromSprite(Car._projectileImage, this._enemy, 0, -30)
            projectile.setKind(SpriteKind.EnemyProjectile);
            result.push(projectile)

            return result;
        }
    }

    export function spawnNewEnemy(): EnemyKind {

        console.log("about to spawn new enemy")
        if (Math.percentChance(60)) {
            console.log("about to spawn new Ghost")
            enemies.push(new Ghost())
            return EnemyKind.Ghost
        } else if (Math.percentChance(50)) {
            console.log("about to spawn new Car")
            enemies.push(new Car())
            return EnemyKind.Car
        } else {
            console.log("about to spawn new Tracing Car")
            enemies.push(new TracingCar())
            return EnemyKind.TracingCar
        }
    }
}