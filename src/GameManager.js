import { PlayerManager } from './PlayerManager.js';

export class GameManager {

    constructor(x, y, scene) {
        // mirrors: public int grid[][]; public PlayerManager player;
        this.gridx = x;
        this.gridy = y;
        this.scene  = scene; // needed for audio (replaces direct AudioPlayer calls)
        // mirrors: grid = new int[x][y]  (grid[x][y])
        this.grid = [];
        for (let i = 0; i < x; i++) {
            this.grid.push(new Array(y).fill(0));
        }
        this.player = new PlayerManager(x, y, this);
    }

    getPlayerInput(key) {
        if (key === 'RIGHT') {
            this.player.actionRight();
        } else if (key === 'LEFT') {
            this.player.actionLeft();
        } else if (key === 'ROTATE') {
            this.player.actionRotate();
        } else if (key === 'DOWN') {
            this.player.actionDown();
        } else if (key === 'ROTATE_CCW') {
            this.player.rotateCCW(this.grid);
        }
    }

    // 0 - inactive
    // 1 - static
    // 9 - player controlled

    // checks all y rows if all blocks are 1 status
    // if satisfy conditions, converts all to 0's
    clearlines() {
        let retpoints = 0;
        for (let y = 0; y < this.gridy; y++) {
            let clearthisline = true;
            for (let x = 0; x < this.gridx; x++) {
                if (this.grid[x][y] !== 1) { // checks if this line is in need of clearing
                    clearthisline = false;
                    break;
                }
            }
            if (clearthisline) {
                // mirrors: AudioPlayer.player.start(endsa)
                this.scene.sound.play('linebrk');
                retpoints++;
                for (let x = 0; x < this.gridx; x++) {
                    this.setInactive(x, y);
                }
                // this goes backwards
                // moves all lines above clearedline down by one
                for (let iy = y - 1; iy > 0; iy--) { // all 1's above break line down by one sq
                    for (let ix = 0; ix < this.gridx; ix++) {
                        if (this.grid[ix][iy] === 1) {
                            this.grid[ix][iy]      = 0;
                            this.grid[ix][iy + 1]  = 1;
                        }
                    }
                }
            }
        }
        return retpoints;
    }

    isStatic(x, y) {
        return (this.grid[x][y] === 1);
    }

    isActive(x, y) {
        return !(this.grid[x][y] === 0);
    }

    setActive(x, y) {
        this.grid[x][y] = 2;
    }

    setInactive(x, y) {
        this.grid[x][y] = 0;
    }

    // outputs view of current game
    // array of strings, every element is new line
    output() {
        let ret = [];
        for (let y = 0; y < this.gridy; y++) {
            let add = '';
            for (let x = 0; x < this.gridx; x++) {
                add = add + this.grid[x][y];
            }
            ret.push(add);
        }
        return ret;
    }

    viewPlayer() {
        for (let y = 0; y < this.gridy; y++) {
            for (let x = 0; x < this.gridx; x++) {
                if (this.grid[x][y] === 9) {
                    this.grid[x][y] = 0;
                }
            }
        }
        this.grid[this.player.ax][this.player.ay] = 9;
        this.grid[this.player.bx][this.player.by] = 9;
        this.grid[this.player.cx][this.player.cy] = 9;
        this.grid[this.player.dx][this.player.dy] = 9;
    }

    convertplayerstatic() {
        for (let y = 0; y < this.gridy; y++) {
            for (let x = 0; x < this.gridx; x++) {
                if (this.grid[x][y] === 9) {
                    this.grid[x][y] = 1;
                }
            }
        }
    }
}
