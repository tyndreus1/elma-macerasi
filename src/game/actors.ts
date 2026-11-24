import Phaser from "phaser";
import {
  GRAVITY,
  INVULN_MS,
  JUMP_BUFFER_MS,
  JUMP_VELOCITY,
  MAX_APPLES,
  PLAYER_SPEED,
  START_APPLES,
  START_LIVES,
  THROW_SPEED,
  type PlayerId,
} from "./constants";
import { consumeJump, consumeThrow, sticks } from "./input";
import { sfx } from "./audio";
import { particleBurst } from "./sprites";
import type { EnemyKind } from "./levels";

export class Hero extends Phaser.Physics.Arcade.Sprite {
  pid: PlayerId;
  tex: "dad" | "boy";
  apples = START_APPLES;
  lives = START_LIVES;
  score = 0;
  facing: 1 | -1 = 1;
  invulnUntil = 0;
  throwUntil = 0;
  lastSafeX = 0;
  lastSafeY = 0;
  coyote = 0;
  jumpBuf = 0;
  alive = true;
  blinking = false;

  constructor(scene: Phaser.Scene, x: number, y: number, pid: PlayerId) {
    const tex = pid === 0 ? "dad" : "boy";
    super(scene, x, y, tex, "0");
    this.pid = pid;
    this.tex = tex;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(10);
    this.setBounce(0);
    this.setCollideWorldBounds(false);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(18, 36);
    body.setOffset(7, 12);
    body.setMaxVelocity(240, 700);
    body.setDragX(1400);
    this.lastSafeX = x;
    this.lastSafeY = y;
    this.play(`${tex}-idle`, true);
  }

  get onGround() {
    const b = this.body as Phaser.Physics.Arcade.Body;
    return b.blocked.down || b.touching.down;
  }

  hurt(scene: Phaser.Scene, fromPit = false) {
    if (!this.alive) return;
    const now = scene.time.now;
    if (!fromPit && now < this.invulnUntil) return;
    this.lives -= 1;
    this.invulnUntil = now + INVULN_MS;
    sfx.hurt();
    scene.cameras.main.shake(140, 0.006);
    if (this.lives <= 0) {
      this.alive = false;
      this.setVelocity(0, 0);
      this.setAlpha(0.25);
      this.disableBody(true, false);
      return;
    }
    this.blinking = true;
    if (fromPit) {
      this.respawn();
    } else {
      this.setVelocity(-this.facing * 80, -160);
    }
  }

  respawn() {
    this.enableBody(true, this.lastSafeX, this.lastSafeY - 8, true, true);
    this.setVelocity(0, 0);
    this.setAlpha(1);
  }

  addApple(n = 1) {
    this.apples = Math.min(MAX_APPLES, this.apples + n);
    this.score += 10;
  }

  updateHero(scene: Phaser.Scene, projectiles: Phaser.Physics.Arcade.Group, melee: Phaser.Physics.Arcade.Group) {
    if (!this.alive) return;
    const now = scene.time.now;
    const st = sticks[this.pid];
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (this.onGround) {
      this.coyote = now + 90;
      this.lastSafeX = this.x;
      this.lastSafeY = this.y;
    }

    if (st.jumpQueued) this.jumpBuf = now + JUMP_BUFFER_MS;
    consumeJump(this.pid);

    let vx = 0;
    if (st.left) vx -= PLAYER_SPEED;
    if (st.right) vx += PLAYER_SPEED;
    body.setVelocityX(vx);
    if (vx > 0) this.facing = 1;
    if (vx < 0) this.facing = -1;
    this.setFlipX(this.facing < 0);

    const canJump = this.onGround || now < this.coyote;
    if (now < this.jumpBuf && canJump) {
      body.setVelocityY(JUMP_VELOCITY);
      this.coyote = 0;
      this.jumpBuf = 0;
      sfx.jump();
    }

    if (consumeThrow(this.pid) && now > this.throwUntil) {
      this.throwUntil = now + 280;
      this.play(`${this.tex}-throw`, true);
      if (this.apples > 0) {
        this.apples -= 1;
        spawnAppleShot(scene, projectiles, this);
        sfx.throw();
      } else {
        spawnKick(scene, melee, this);
        sfx.kick();
      }
    }

    if (now < this.throwUntil) {
      /* keep throw frame */
    } else if (!this.onGround) {
      this.play(`${this.tex}-jump`, true);
    } else if (Math.abs(body.velocity.x) > 20) {
      this.play(`${this.tex}-walk`, true);
    } else {
      this.play(`${this.tex}-idle`, true);
    }

    if (now < this.invulnUntil) {
      this.setAlpha(Math.sin(now / 50) > 0 ? 1 : 0.35);
    } else if (this.blinking) {
      this.setAlpha(1);
      this.blinking = false;
    }
  }
}

function spawnAppleShot(scene: Phaser.Scene, group: Phaser.Physics.Arcade.Group, hero: Hero) {
  const shot = group.create(hero.x + hero.facing * 16, hero.y - 6, "apple") as Phaser.Physics.Arcade.Sprite;
  shot.setDepth(12);
  shot.setBounce(0.1);
  const b = shot.body as Phaser.Physics.Arcade.Body;
  b.setAllowGravity(true);
  b.setVelocity(hero.facing * THROW_SPEED, -80);
  b.setSize(10, 10);
  shot.setData("owner", hero.pid);
  shot.setData("born", scene.time.now);
  scene.time.delayedCall(1800, () => {
    if (shot.active) shot.destroy();
  });
}

function spawnKick(scene: Phaser.Scene, group: Phaser.Physics.Arcade.Group, hero: Hero) {
  const k = group.create(hero.x + hero.facing * 18, hero.y + 4, "pixel") as Phaser.Physics.Arcade.Sprite;
  k.setVisible(false);
  const b = k.body as Phaser.Physics.Arcade.Body;
  b.setAllowGravity(false);
  b.setSize(22, 18);
  k.setData("owner", hero.pid);
  k.setData("kick", true);
  scene.time.delayedCall(140, () => {
    if (k.active) k.destroy();
  });
}

export class Foe extends Phaser.Physics.Arcade.Sprite {
  kind: EnemyKind | string;
  hp: number;
  facing: 1 | -1 = -1;
  speed: number;
  scoreValue: number;
  isBoss = false;
  stunUntil = 0;
  hopUntil = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    kind: string,
    hp: number,
    opts?: { boss?: boolean; speed?: number },
  ) {
    super(scene, x, y, kind, "0");
    this.kind = kind;
    this.hp = hp;
    this.isBoss = !!opts?.boss;
    this.speed = opts?.speed ?? (kind.includes("snail") ? 28 : kind.includes("blob") ? 50 : 40);
    this.scoreValue = this.isBoss ? 500 : 100;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(10);
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (this.isBoss) {
      body.setSize(this.width * 0.7, this.height * 0.75);
      body.setOffset(this.width * 0.15, this.height * 0.2);
    } else {
      body.setSize(this.width * 0.7, this.height * 0.75);
    }
    this.play(`${kind}-walk`, true);
    this.setFlipX(this.facing < 0);
  }

  takeHit(scene: Phaser.Scene, fromX: number, dmg = 1) {
    if (this.stunUntil > scene.time.now) return false;
    this.hp -= dmg;
    this.stunUntil = scene.time.now + 180;
    this.setTintFill(0xffffff);
    scene.time.delayedCall(80, () => this.clearTint());
    const dir = this.x > fromX ? 1 : -1;
    this.setVelocityX(dir * (this.isBoss ? 60 : 120));
    this.setVelocityY(this.isBoss ? -80 : -140);
    sfx.hit();
    particleBurst(scene, this.x, this.y, 0xffe080);
    if (this.hp <= 0) {
      sfx.pop();
      particleBurst(scene, this.x, this.y, 0x88ffaa);
      this.destroy();
      return true;
    }
    return false;
  }

  chase(scene: Phaser.Scene, targets: Hero[]) {
    if (!this.active || !this.body) return;
    const now = scene.time.now;
    if (now < this.stunUntil) return;
    const alive = targets.filter((h) => h.alive);
    if (!alive.length) return;
    alive.sort((a, b) => Math.abs(a.x - this.x) - Math.abs(b.x - this.x));
    const t = alive[0];
    const body = this.body as Phaser.Physics.Arcade.Body;
    const onGround = body.blocked.down || body.touching.down;

    if (this.isBoss) {
      this.facing = t.x < this.x ? -1 : 1;
      body.setVelocityX(this.facing * this.speed);
      if (onGround && now > this.hopUntil && Math.abs(t.x - this.x) < 90) {
        body.setVelocityY(-220);
        this.hopUntil = now + 1400;
      }
    } else {
      const dist = Math.abs(t.x - this.x);
      if (dist < 160 && Math.abs(t.y - this.y) < 50) {
        this.facing = t.x < this.x ? -1 : 1;
      }
      const blockedWall = this.facing < 0 ? body.blocked.left : body.blocked.right;
      if (blockedWall) this.facing = this.facing === 1 ? -1 : 1;
      else if (onGround && dist > 40) {
        const aheadX = this.x + this.facing * (body.width / 2 + 6);
        const groundAhead = scene.physics.overlapRect(aheadX - 2, body.bottom + 2, 4, 8, false, true);
        if (!groundAhead.length && Math.abs(t.y - this.y) < 24) {
          this.facing = this.facing === 1 ? -1 : 1;
        }
      }
      const spd = this.kind === "blob" && !onGround ? this.speed * 0.4 : this.speed;
      body.setVelocityX(this.facing * spd);
      if (this.kind === "blob" && onGround && Math.random() < 0.012) {
        body.setVelocityY(-260);
      }
    }
    this.setFlipX(this.facing < 0);
    if (this.anims.currentAnim?.key !== `${this.kind}-walk`) this.play(`${this.kind}-walk`, true);
  }
}

void GRAVITY;
void START_LIVES;
void START_APPLES;
