namespace advprojectiles {

    export enum ProjectileType {
        Hostile, Friendly
    }

    export enum ProjectileSystem {
        Circling, ExplosiveMine, LightSaber
    }

    export interface Projectile {

    }

    export function getWeaponIcon(projectileSystem: ProjectileSystem): Image {
        if (projectileSystem == ProjectileSystem.ExplosiveMine) {
            return img`
                . . e e e 1 . .
                . e f 4 f f 1 .
                e f f 4 f 4 f 1
                f f f 4 4 f f f
                e f f 4 f f f f
                1 e f f f f f e
                . 1 e f f f e .
                . . 1 e e e . .
            `;
        } else if (projectileSystem == ProjectileSystem.LightSaber) {
            return img`
                . 5 5 5 5 . . .
                . . . 5 5 5 . .
                . . . . 5 5 5 .
                . . . . . 5 5 5
                . . . . . 5 5 5
                . . . . 5 5 5 .
                . . . 5 5 5 . .
                . 5 5 5 5 . . .
            `;
        } else {
            return img`
                . . 4 4 . . . .
                . 4 . . 4 . . .
                4 . 4 4 . 4 . .
                4 . . . 4 . 4 .
                . 4 . 4 . . 4 .
                . . 4 . . 4 . .
                4 4 . . 4 . . .
                . 4 4 4 . . . .
            `

        }
    }

    class ExplosiveProjectile implements Projectile {

        static EXPLOSIVE_PROJECTILE_IMAGE: Image = img`
            . . e e e 1 . .
            . e f 4 f f 1 .
            e f f 4 f 4 f 1
            f f f 4 4 f f f
            e f f 4 f f f f
            1 e f f f f f e
            . 1 e f f f e .
            . . 1 e e e . .
        `

        static BABY_PROJECTILE_IMAGE : Image = img`
            44
            44
        `
        private static EXPLOSIVE_MINE_PROJECTILE_SPEED: number = 70.71
        private _sprite: Sprite
        public constructor(firingSprite: Sprite, projectileType: ProjectileType, vx: number, vy: number) {
            this._sprite = sprites.createProjectileFromSprite(
                ExplosiveProjectile.EXPLOSIVE_PROJECTILE_IMAGE, firingSprite, vx, vy)
            if (projectileType == ProjectileType.Hostile) {
                this._sprite.setKind(SpriteKind.EnemyProjectile)
            } else {
                this._sprite.setKind(SpriteKind.PlayerProjectile)
            }
            this._sprite.lifespan = 1500
            this._sprite.onDestroyed(function () {
                sprites.createProjectileFromSprite(ExplosiveProjectile.BABY_PROJECTILE_IMAGE, 
                this._sprite, ExplosiveProjectile.EXPLOSIVE_MINE_PROJECTILE_SPEED,
                 ExplosiveProjectile.EXPLOSIVE_MINE_PROJECTILE_SPEED)

                sprites.createProjectileFromSprite(ExplosiveProjectile.BABY_PROJECTILE_IMAGE, 
                 this._sprite, 0 - ExplosiveProjectile.EXPLOSIVE_MINE_PROJECTILE_SPEED,
                 0 - ExplosiveProjectile.EXPLOSIVE_MINE_PROJECTILE_SPEED)

                sprites.createProjectileFromSprite(ExplosiveProjectile.BABY_PROJECTILE_IMAGE,
                 this._sprite, 0 - ExplosiveProjectile.EXPLOSIVE_MINE_PROJECTILE_SPEED,
                 ExplosiveProjectile.EXPLOSIVE_MINE_PROJECTILE_SPEED)

                sprites.createProjectileFromSprite(ExplosiveProjectile.BABY_PROJECTILE_IMAGE,
                this._sprite, ExplosiveProjectile.EXPLOSIVE_MINE_PROJECTILE_SPEED,
                0 - ExplosiveProjectile.EXPLOSIVE_MINE_PROJECTILE_SPEED)
            })
        }

    }

    class LightSaberProjectile implements Projectile {
        static LIGHT_SABER_IMAGE: Image = img`
            . 5 5 5 5 . . . .
            . . . . 5 5 . . .
            . . . . . 5 5 . .
            . . . . . . 5 5 .
            . . . . . . 5 5 5
            . . . . . . 5 5 .
            . . . . . 5 5 . .
            . . . . 5 5 . . .
            . 5 5 5 5 . . . .
        `

        private static LIGHT_SABER_SPEED: number = 100
        private _sprite: Sprite

        public constructor(firingSprite: Sprite, projectileType: ProjectileType) {
            this._sprite = sprites.createProjectileFromSprite(LightSaberProjectile.LIGHT_SABER_IMAGE,
                firingSprite, LightSaberProjectile.LIGHT_SABER_SPEED, 0)
        }
    }


    export function fireAProjectile(firingSprite: Sprite,
        system: ProjectileSystem, projectileType: ProjectileType,
        vx: number = 0, vy: number = 0): Projectile {
        if (system == ProjectileSystem.ExplosiveMine) {
            let projectile = new ExplosiveProjectile(firingSprite, projectileType, vx, vy);
            return projectile;
        } else if (system == ProjectileSystem.LightSaber) {
            let projectile = new LightSaberProjectile(firingSprite, projectileType);
            return projectile;
        }
        return null;
    }
}