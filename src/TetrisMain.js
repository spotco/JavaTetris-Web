// TetrisMain.js — mirrors TetrisMain.java
// Java's JFrame + main() loop  →  Phaser.Scene
// Java's Thread.sleep(TIME) game loop  →  update() with delta accumulator
// Java's KeyAdapter inner classes  →  Phaser keyboard events

import { GameManager } from './GameManager.js';

// mirrors: public static final int TIME = 25; gridx = 11; gridy = 19; notypes = 7;
const TIME    = 25;
const gridx   = 11;
const gridy   = 19;
const notypes = 7;

// ─── TetrisMain (mirrors TetrisMain.main) ─────────────────────────────────────

class TetrisMain extends Phaser.Scene {

    constructor() {
        super({ key: 'TetrisMain' });
    }

    // mirrors: loading ImageIcon / AudioStream resources
    preload() {
        this.load.image('title',   'img/title.gif');
        this.load.image('title0',  'img/title0.gif');
        this.load.image('block0',  'img/block0.png');
        for (let i = 1; i <= notypes; i++) {
            this.load.image('piece' + i, 'img/' + i + '.png');
        }
        this.load.audio('titlescreen', 'snd/titlescreen.wav');
        this.load.audio('mains',       'snd/mains.wav');
        this.load.audio('linebrk',     'snd/linebrk.wav');
        this.load.audio('end',         'snd/end.wav');
    }

    // mirrors: JFrame setup + initial state in TetrisMain.main()
    create() {
        // mirrors: int highscore = 0;  boolean trip = false (titlekey.trip)
        this.highscore = 0;
        this.trip      = false;  // toggled by Z key — mirrors TitleListener.trip

        // ── Title screen objects ──────────────────────────────────────────────
        // mirrors: JLabel titlescreen + highscore1
        // Java setBounds(0,-25,255,420) → center at (127, 185), size 255×420
        this.titlescreen = this.add.image(127, 185, 'title')
            .setDisplaySize(255, 420)
            .setOrigin(0.5, 0.5)
            .setVisible(false);

        // mirrors: highscore1.setBounds(123, 47, 225, 50)
        this.highscoredisp = this.add.text(123, 47, '0', {
            fontFamily: 'Consolas', fontStyle: 'italic', fontSize: '10px', color: '#ffff00'
        }).setOrigin(0, 0).setVisible(false);

        // ── In-game HUD objects ───────────────────────────────────────────────
        // mirrors: staticdisp.setBounds(11, 355 ...)
        this.staticdisp = this.add.text(11, 355, 'SCORE:      SPEED:      NEXT:', {
            fontFamily: 'Consolas', fontStyle: 'italic', fontSize: '10px', color: '#ffff00'
        }).setOrigin(0, 0).setVisible(false);

        // mirrors: pointdisp.setBounds(55, 355 ...)
        this.pointdisp = this.add.text(55, 355, '0', {
            fontFamily: 'Consolas', fontStyle: 'italic', fontSize: '10px', color: '#ffff00'
        }).setOrigin(0, 0).setVisible(false);

        // mirrors: spddisp.setBounds(130, 355 ...)
        this.spddisp = this.add.text(130, 355, '1', {
            fontFamily: 'Consolas', fontStyle: 'italic', fontSize: '10px', color: '#ffff00'
        }).setOrigin(0, 0).setVisible(false);

        // mirrors: nxtdisp.setBounds(195, 365, 30, 30)  → center at (210, 380)
        this.nxtdisp = this.add.image(210, 380, 'piece1')
            .setDisplaySize(30, 30)
            .setOrigin(0.5, 0.5)
            .setVisible(false);

        // ── Game-over overlay ─────────────────────────────────────────────────
        // mirrors: gameoverdisp.setBounds(65, 355 ...)
        this.gameoverdisp = this.add.text(65, 355, 'GAME OVER (SPACE)', {
            fontFamily: 'Consolas', fontStyle: 'italic', fontSize: '10px', color: '#ffff00'
        }).setOrigin(0, 0).setVisible(false);

        // ── Block sprite pool (mirrors ArrayList<JLabel> dispblock) ───────────
        // Pre-allocate gridx*gridy sprites; display() shows/hides each frame
        // mirrors: dispblock.setBounds(5+(x*19), 5+(y*19), 18, 18)
        this.dispblocks = [];
        for (let y = 0; y < gridy; y++) {
            for (let x = 0; x < gridx; x++) {
                let spr = this.add.image(5 + x*19, 5 + y*19, 'block0')
                    .setOrigin(0, 0)
                    .setDisplaySize(18, 18)
                    .setVisible(false);
                this.dispblocks.push(spr);
            }
        }

        // ── Audio (mirrors AudioPlayer setup) ─────────────────────────────────
        this.titleMusic = this.sound.add('titlescreen');
        this.mainMusic  = this.sound.add('mains');
        this.endMusic   = this.sound.add('end');

        // ── Input (mirrors KeyListener + TitleListener inner classes) ─────────
        // TitleListener: SPACE → cont=false,  Z → trip=true
        // KeyListener:   arrow keys → game.getPlayerInput()
        this.input.keyboard.on('keydown-SPACE', () => this.onSpace());
        this.input.keyboard.on('keydown-Z',     () => this.onZ());
        this.input.keyboard.on('keydown-RIGHT', () => this.onRight());
        this.input.keyboard.on('keydown-LEFT',  () => this.onLeft());
        this.input.keyboard.on('keydown-UP',    () => this.onUp());
        this.input.keyboard.on('keydown-DOWN',  () => this.onDown());

        this.tickAccum = 0;
        this.state     = 'TITLE';

        this.enterTitle();
    }

    // mirrors: outer while(true) program loop — enter title state
    enterTitle() {
        this.state = 'TITLE';

        this.highscoredisp.setText('' + this.highscore).setVisible(true);
        this.titlescreen.setTexture('title').setVisible(true);
        this.staticdisp.setVisible(false);
        this.pointdisp.setVisible(false);
        this.spddisp.setVisible(false);
        this.nxtdisp.setVisible(false);
        this.gameoverdisp.setVisible(false);
        this.clearDisplayBlocks();

        // mirrors: AudioPlayer.player.start(as) + 28100ms restart timer
        this.titleMusic.play();
        this.titleMusicTimer = this.time.addEvent({
            delay: 28100,
            callback: () => { if (this.state === 'TITLE') this.titleMusic.play(); },
            loop: true
        });
    }

    // mirrors: beginning of game loop after title screen dismissed
    enterGame() {
        this.state = 'GAME';

        if (this.titleMusicTimer) this.titleMusicTimer.destroy();
        this.titleMusic.stop();

        this.titlescreen.setVisible(false);
        this.highscoredisp.setVisible(false);

        // mirrors: GameManager game = new GameManager(gridx, gridy);
        this.game = new GameManager(gridx, gridy, this);

        this.staticdisp.setVisible(true);
        this.pointdisp.setText('0').setVisible(true);
        this.spddisp.setText('1').setVisible(true);
        this.nxtdisp.setVisible(true);

        // mirrors: game.player.generateNew(game.grid, r.nextInt(notypes)+1)
        this.game.player.generateNew(this.game.grid, Phaser.Math.Between(1, notypes));
        this.nextsto = Phaser.Math.Between(1, notypes);
        this.changenext(this.nextsto);

        // mirrors: int counter=0; fallspd=20; speedup=0; points=0;
        this.counter  = 0;
        this.fallspd  = 20;
        this.speedup  = 0;
        this.points   = 0;
        this.tickAccum = 0;

        // mirrors: AudioPlayer.player.start(asd) + 62400ms restart timer
        this.mainMusic.play();
        this.mainMusicTimer = this.time.addEvent({
            delay: 62400,
            callback: () => { if (this.state === 'GAME') this.mainMusic.play(); },
            loop: true
        });
    }

    // mirrors: post-game-loop game-over section
    enterGameOver() {
        this.state = 'GAMEOVER';

        if (this.mainMusicTimer) this.mainMusicTimer.destroy();
        this.mainMusic.stop();

        this.staticdisp.setVisible(false);
        this.pointdisp.setVisible(false);
        this.spddisp.setVisible(false);
        this.nxtdisp.setVisible(false);
        this.gameoverdisp.setVisible(true);

        // mirrors: highscore = Math.max(highscore, points)
        this.highscore = Math.max(this.highscore, this.points);

        // mirrors: AudioPlayer.player.start(endsa)
        this.endMusic.play();

        // mirrors: blinking GAME OVER label (count==5 hide, count==10 show+reset)
        this.gameOverBlinkCount = 0;
        this.gameOverBlinkTimer = this.time.addEvent({
            delay: 100,
            callback: () => {
                this.gameOverBlinkCount++;
                if (this.gameOverBlinkCount === 5)  this.gameoverdisp.setVisible(false);
                if (this.gameOverBlinkCount === 10) { this.gameoverdisp.setVisible(true); this.gameOverBlinkCount = 0; }
            },
            loop: true
        });
    }

    // mirrors: Thread.sleep(TIME) game loop — called every TIME ms via delta accumulation
    update(time, delta) {
        if (this.state === 'GAME') {
            this.tickAccum += delta;
            while (this.tickAccum >= TIME) {
                this.tickAccum -= TIME;
                this.gameTick();
            }
        }
    }

    // mirrors: the body of while(true) { // game loop } in TetrisMain.main()
    gameTick() {
        if (this.game.player.hitcheck(this.game.grid)) { // player piece hit static
            this.game.convertplayerstatic();
            if (this.game.player.generateNew(this.game.grid, this.nextsto)) {
                // game over — mirrors the break out of the game loop
                this.game.viewPlayer();
                this.display(this.game.output());
                this.enterGameOver();
                return;
            }
            this.nextsto = Phaser.Math.Between(1, notypes);
        } else {
            if (this.counter >= this.fallspd) { // change this variable based on game speed
                this.game.player.fall();
                this.counter = 0;
            }
            this.game.player.event(this.game.grid); // player event (refresh every cycle)
        }
        this.counter++;
        this.game.viewPlayer();

        let stopoints = this.game.clearlines();
        if (stopoints > 0) {
            this.speedup++;
            if (this.speedup === 20) {
                if (this.fallspd > 1) {
                    this.fallspd--;
                }
                this.speedup = 0;
            }
            this.points = this.points + (21 - this.fallspd) * stopoints;
        }

        // mirrors: spddisp.setText / pointdisp.setText / changenext / display
        this.spddisp.setText('' + (21 - this.fallspd));
        this.pointdisp.setText('' + this.points);
        this.changenext(this.nextsto);
        this.display(this.game.output());
    }

    // ─── Input handlers ────────────────────────────────────────────────────────

    // mirrors: TitleListener.keyPressed — SPACE → cont = false
    onSpace() {
        if (this.state === 'TITLE') {
            this.enterGame();
        } else if (this.state === 'GAMEOVER') {
            if (this.gameOverBlinkTimer) this.gameOverBlinkTimer.destroy();
            this.endMusic.stop();
            this.gameoverdisp.setVisible(false);
            this.clearDisplayBlocks();
            this.enterTitle();
        }
    }

    // mirrors: TitleListener.keyPressed — Z (keyCode 90) → trip = true
    onZ() {
        this.trip = true;
        if (this.state === 'TITLE') {
            this.titlescreen.setTexture('title0');
        }
    }

    // mirrors: KeyListener.keyPressed — arrow key 39 (RIGHT)
    onRight() { if (this.state === 'GAME') this.game.getPlayerInput('RIGHT'); }

    // mirrors: KeyListener.keyPressed — arrow key 37 (LEFT)
    onLeft()  { if (this.state === 'GAME') this.game.getPlayerInput('LEFT');  }

    // mirrors: KeyListener.keyPressed — arrow key 38 (UP → ROTATE)
    onUp()    { if (this.state === 'GAME') this.game.getPlayerInput('ROTATE'); }

    // mirrors: KeyListener.keyPressed — arrow key 40 (DOWN)
    onDown()  { if (this.state === 'GAME') this.game.getPlayerInput('DOWN');  }

    // ─── Display helpers ───────────────────────────────────────────────────────

    // mirrors: TetrisMain.changenext()
    // Java: nxtdisp.setIcon(new ImageIcon("img\\" + nextsto + ".png"))
    changenext(nextsto) {
        this.nxtdisp.setTexture('piece' + nextsto);
    }

    // mirrors: TetrisMain.display()
    // Java creates new JLabels each frame; here we reuse pre-allocated sprites
    display(output) {
        // mirrors: dispblock.clear() + frame.getContentPane().removeAll()
        for (let i = 0; i < this.dispblocks.length; i++) {
            this.dispblocks[i].setVisible(false);
        }
        for (let y = 0; y < output.length; y++) {
            let sto = output[y];
            for (let x = 0; x < sto.length; x++) {
                if (sto.substring(x, x+1) === '1' || sto.substring(x, x+1) === '9') {
                    let spr = this.dispblocks[y * gridx + x];
                    spr.setVisible(true);
                    // trip mode: Java uses block0.gif (animated); here we use a magenta tint
                    if (this.trip) {
                        spr.setTint(0xff00ff);
                    } else {
                        spr.clearTint();
                    }
                }
            }
        }
    }

    // mirrors: TetrisMain.print() — placeholder text-based debug output
    // NOTE: gui should not show y row 0
    print(output) {
        let lines = [];
        for (let i = 0; i < output.length; i++) {
            let sto = output[i];
            let line = '';
            for (let j = 0; j < sto.length; j++) {
                line += sto.substring(j, j+1) === '0' ? ' ' : 'X';
            }
            lines.push(line + output[i]);
        }
        console.log('\n\n' + lines.join('\n'));
    }

    clearDisplayBlocks() {
        for (let i = 0; i < this.dispblocks.length; i++) {
            this.dispblocks[i].setVisible(false);
        }
    }
}

// ─── Entry point (mirrors TetrisMain.main) ────────────────────────────────────
// Java: new JFrame("javaTetris"); frame.setSize(225, 420); background = BLACK
new Phaser.Game({
    type:            Phaser.AUTO,
    width:           225,
    height:          420,
    backgroundColor: '#000000',
    scene:           TetrisMain,
    scale: {
        mode:       Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
});
