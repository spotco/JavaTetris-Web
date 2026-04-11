export class PlayerManager {

    constructor(gridx, gridy, game) {
        this.gridx = gridx;
        this.gridy = gridy;
        this.game  = game;

        this.type   = 0;
        this.status = 0;
        this.leftqueue   = false;
        this.rightqueue  = false;
        this.rotatequeue = false;
        this.downqueue   = false;

        // mirrors: public int ax,ay; bx,by; cx,cy; dx,dy;
        this.ax = 0; this.ay = 0;
        this.bx = 0; this.by = 0;
        this.cx = 0; this.cy = 0;
        this.dx = 0; this.dy = 0;
    }

    // return true if game over switch on game
    generateNew(grid, rand) {
        this.status = 0;
        this.type   = rand;
        // mirrors: int gx2 = gridx/2  (Java integer division)
        const gx2 = Math.floor(this.gridx / 2);
        if (this.type === 1) { // + type
            this.ax = gx2-1; this.ay = 0; // abc
            this.bx = gx2;   this.by = 0; //  d
            this.cx = gx2+1; this.cy = 0;
            this.dx = gx2;   this.dy = 1;
        } else if (this.type === 2) { // box type
            this.ax = gx2;   this.ay = 0; // ab
            this.bx = gx2+1; this.by = 0; // cd
            this.cx = gx2;   this.cy = 1;
            this.dx = gx2+1; this.dy = 1;
        } else if (this.type === 3) { // - type
            this.ax = gx2-1; this.ay = 0; // abcd
            this.bx = gx2;   this.by = 0;
            this.cx = gx2+1; this.cy = 0;
            this.dx = gx2+2; this.dy = 0;
        } else if (this.type === 4) { // L type
            this.ax = gx2-1; this.ay = 0; // abc
            this.bx = gx2;   this.by = 0; // d
            this.cx = gx2+1; this.cy = 0;
            this.dx = gx2-1; this.dy = 1;
        } else if (this.type === 5) { // BL type
            this.ax = gx2-1; this.ay = 0; // abc
            this.bx = gx2;   this.by = 0; //   d
            this.cx = gx2+1; this.cy = 0;
            this.dx = gx2+1; this.dy = 1;
        } else if (this.type === 6) { // z type
            this.ax = gx2-1; this.ay = 0; // ab
            this.bx = gx2;   this.by = 0; //  cd
            this.cx = gx2;   this.cy = 1;
            this.dx = gx2+1; this.dy = 1;
        } else if (this.type === 7) { // s type
            this.ax = gx2;   this.ay = 0; //  ab
            this.bx = gx2+1; this.by = 0; // cd
            this.cx = gx2-1; this.cy = 1;
            this.dx = gx2;   this.dy = 1;
        }
        if (this.game.isActive(this.ax, this.ay)   || this.game.isActive(this.bx, this.by)   ||
            this.game.isActive(this.cx, this.cy)   || this.game.isActive(this.dx, this.dy)   ||
            this.game.isActive(this.ax, this.ay+1) || this.game.isActive(this.bx, this.by+1) ||
            this.game.isActive(this.cx, this.cy+1) || this.game.isActive(this.dx, this.dy+1)) {
            return true;
        } else {
            return false;
        }
    }

    fall() {
        this.ay++;
        this.by++;
        this.cy++;
        this.dy++;
    }

    hitcheck(grid) {
        if ((this.ay === this.gridy-1) || (this.by === this.gridy-1) ||
            (this.cy === this.gridy-1) || (this.dy === this.gridy-1)) {
            return true;
        } else if (!(grid[this.ax][this.ay+1] === 0) && !(grid[this.ax][this.ay+1] === 9)) {
            return true;
        } else if (!(grid[this.bx][this.by+1] === 0) && !(grid[this.bx][this.by+1] === 9)) {
            return true;
        } else if (!(grid[this.cx][this.cy+1] === 0) && !(grid[this.cx][this.cy+1] === 9)) {
            return true;
        } else if (!(grid[this.dx][this.dy+1] === 0) && !(grid[this.dx][this.dy+1] === 9)) {
            return true;
        } else {
            return false;
        }
    }

    event(grid) {
        if (this.leftqueue) {
            this.leftevent(grid);
        } else if (this.rightqueue) {
            this.rightevent(grid);
        } else if (this.rotatequeue) {
            this.rotateevent(grid);
        } else if (this.downqueue) {
            this.downevent(grid);
        }
        this.leftqueue   = false;
        this.rightqueue  = false;
        this.rotatequeue = false;
        this.downqueue   = false;
    }

    downevent(grid) {
        if ((this.ay+1 < this.gridy) && (this.by+1 < this.gridy) &&
            (this.cy+1 < this.gridy) && (this.dy+1 < this.gridy) &&
            this.canrotate(this.ax, this.ay+1, this.bx, this.by+1, this.cx, this.cy+1, this.dx, this.dy+1)) {
            this.ay++;
            this.by++;
            this.cy++;
            this.dy++;
        }
    }

    leftevent(grid) {
        let leftedgecheck = true;
        for (let y = 0; y < this.gridy; y++) {
            if (grid[0][y] === 9) {
                leftedgecheck = false;
            }
        }
        if (leftedgecheck && (grid[this.ax-1][this.ay] === 1 || grid[this.bx-1][this.by] === 1 ||
            grid[this.cx-1][this.cy] === 1 || grid[this.dx-1][this.dy] === 1)) {
            leftedgecheck = false;
        }
        if (leftedgecheck) {
            this.ax--;
            this.bx--;
            this.cx--;
            this.dx--;
        }
    }

    rightevent(grid) {
        let rightedgecheck = true;
        for (let y = 0; y < this.gridy; y++) {
            if (grid[this.gridx-1][y] === 9) {
                rightedgecheck = false;
            }
        }
        if (rightedgecheck && (grid[this.ax+1][this.ay] === 1 || grid[this.bx+1][this.by] === 1 ||
            grid[this.cx+1][this.cy] === 1 || grid[this.dx+1][this.dy] === 1)) {
            rightedgecheck = false;
        }
        if (rightedgecheck) {
            this.ax++;
            this.bx++;
            this.cx++;
            this.dx++;
        }
    }

    actionRight() {
        this.leftqueue   = false;
        this.rotatequeue = false;
        this.downqueue   = false;
        this.rightqueue  = true;
    }

    actionLeft() {
        this.rightqueue  = false;
        this.rotatequeue = false;
        this.downqueue   = false;
        this.leftqueue   = true;
    }

    actionRotate() {
        this.rotatequeue = true;
        this.rightqueue  = false;
        this.downqueue   = false;
        this.leftqueue   = false;
    }

    actionDown() {
        this.rotatequeue = false;
        this.rightqueue  = false;
        this.downqueue   = true;
        this.leftqueue   = false;
    }

    // Counter-clockwise rotation = 3 clockwise rotations applied atomically.
    // Saves all coordinates+status; restores if any step is blocked.
    rotateCCW(grid) {
        const s = {
            ax: this.ax, ay: this.ay, bx: this.bx, by: this.by,
            cx: this.cx, cy: this.cy, dx: this.dx, dy: this.dy,
            status: this.status
        };
        for (let i = 0; i < 3; i++) {
            const prevStatus = this.status;
            this.rotateevent(grid);
            if (this.status === prevStatus) {
                // Blocked or piece has no rotation — restore original state
                this.ax = s.ax; this.ay = s.ay; this.bx = s.bx; this.by = s.by;
                this.cx = s.cx; this.cy = s.cy; this.dx = s.dx; this.dy = s.dy;
                this.status = s.status;
                return;
            }
        }
    }

    rotateevent(grid) {
        // status 0,1,2,3
        if (this.status === 0) {
            this.status0(grid);
        } else if (this.status === 1) {
            this.status1(grid);
        } else if (this.status === 2) {
            this.status2(grid);
        } else if (this.status === 3) {
            this.status3(grid);
        }
    }

    canrotate(ax, ay, bx, by, cx, cy, dx, dy) {
        if ((ax > -1) && (bx > -1) && (cx > -1) && (dx > -1) &&
            (ax < this.gridx) && (bx < this.gridx) && (cx < this.gridx) && (dx < this.gridx) &&
            (ay > -1) && (by > -1) && (cy > -1) && (dy > -1) &&
            (ay < this.gridy) && (by < this.gridy) && (cy < this.gridy) && (dy < this.gridy) &&
            (!this.game.isStatic(ax,ay)) && (!this.game.isStatic(bx,by)) &&
            (!this.game.isStatic(cx,cy)) && (!this.game.isStatic(dx,dy))) {
            return true;
        }
        return false;
    }

    status0(grid) {
        if (this.type === 1) {
            if (/*DNC*/this.canrotate(this.ax+1,this.ay-1,this.bx,this.by,this.cx-1,this.cy+1,this.dx-1,this.dy-1)/*DNC*/) {
                this.status = 1;
                this.ax = this.ax + 1; this.ay = this.ay - 1;
                this.cx = this.cx - 1; this.cy = this.cy + 1;
                this.dx = this.dx - 1; this.dy = this.dy - 1;
            }
        } else if (this.type === 3) {
            if (/*DNC*/this.canrotate(this.ax+1,this.ay-1,this.bx,this.by,this.cx-1,this.cy+1,this.dx-2,this.dy+2)/*DNC*/) {
                this.status = 1;
                this.ax = this.ax + 1; this.ay = this.ay - 1;
                this.cx = this.cx - 1; this.cy = this.cy + 1;
                this.dx = this.dx - 2; this.dy = this.dy + 2;
            }
        } else if (this.type === 4) {
            if (/*DNC*/this.canrotate(this.ax,this.ay,this.bx-1,this.by+1,this.cx-2,this.cy+2,this.dx-1,this.dy-1)/*DNC*/) {
                this.status = 1;
                this.bx = this.bx - 1; this.by = this.by + 1;
                this.cx = this.cx - 2; this.cy = this.cy + 2;
                this.dx = this.dx - 1; this.dy = this.dy - 1;
            }
        } else if (this.type === 5) {
            if (/*DNC*/this.canrotate(this.ax+2,this.ay-2,this.bx+1,this.by-1,this.cx,this.cy,this.dx-1,this.dy-1)/*DNC*/) {
                this.status = 1;
                this.ax = this.ax+2; this.ay = this.ay-2;
                this.bx = this.bx+1; this.by = this.by-1;
                this.dx = this.dx-1; this.dy = this.dy-1;
            }
        } else if (this.type === 6) {
            if (/*DNC*/this.canrotate(this.ax+2,this.ay,this.bx+1,this.by+1,this.cx,this.cy,this.dx-1,this.dy+1)/*DNC*/) {
                this.status = 1;
                this.ax = this.ax + 2;
                this.bx = this.bx + 1; this.by = this.by + 1;
                this.dx = this.dx - 1; this.dy = this.dy + 1;
            }
        } else if (this.type === 7) {
            if (/*DNC*/this.canrotate(this.ax+1,this.ay+1,this.bx,this.by+2,this.cx+1,this.cy-1,this.dx,this.dy)/*DNC*/) {
                this.status = 1;
                this.ax = this.ax + 1; this.ay = this.ay + 1;
                this.by = this.by + 2;
                this.cx = this.cx + 1; this.cy = this.cy - 1;
            }
        }
    }

    status1(grid) {
        if (this.type === 1) {
            if (/*DNC*/this.canrotate(this.ax+1,this.ay-1,this.bx,this.by,this.cx-1,this.cy+1,this.dx-1,this.dy-1)/*DNC*/) {
                this.status = 2;
                this.ax = this.ax + 1; this.ay = this.ay + 1;
                this.cx = this.cx - 1; this.cy = this.cy - 1;
                this.dx = this.dx + 1; this.dy = this.dy - 1;
            }
        } else if (this.type === 3) {
            if (/*DNC*/this.canrotate(this.ax-1,this.ay+1,this.bx,this.by,this.cx+1,this.cy-1,this.dx+2,this.dy-2)/*DNC*/) {
                this.status = 0;
                this.ax = this.ax - 1; this.ay = this.ay + 1;
                this.cx = this.cx + 1; this.cy = this.cy - 1;
                this.dx = this.dx + 2; this.dy = this.dy - 2;
            }
        } else if (this.type === 4) {
            if (/*DNC*/this.canrotate(this.ax,this.ay,this.bx-1,this.by-1,this.cx-2,this.cy-2,this.dx+1,this.dy-1)/*DNC*/) {
                this.status = 2;
                this.bx = this.bx - 1; this.by = this.by - 1;
                this.cx = this.cx - 2; this.cy = this.cy - 2;
                this.dx = this.dx + 1; this.dy = this.dy - 1;
            }
        } else if (this.type === 5) {
            if (/*DNC*/this.canrotate(this.ax+2,this.ay+2,this.bx+1,this.by+1,this.cx,this.cy,this.dx+1,this.dy-1)/*DNC*/) {
                this.status = 2;
                this.ax = this.ax+2; this.ay = this.ay+2;
                this.bx = this.bx+1; this.by = this.by+1;
                this.dx = this.dx+1; this.dy = this.dy-1;
            }
        } else if (this.type === 6) {
            if (/*DNC*/this.canrotate(this.ax-2,this.ay,this.bx-1,this.by-1,this.cx,this.cy,this.dx+1,this.dy-1)/*DNC*/) {
                this.status = 0;
                this.ax = this.ax - 2;
                this.bx = this.bx - 1; this.by = this.by - 1;
                this.dx = this.dx + 1; this.dy = this.dy - 1;
            }
        } else if (this.type === 7) {
            if (/*DNC*/this.canrotate(this.ax-1,this.ay-1,this.bx,this.by-2,this.cx-1,this.cy+1,this.dx,this.dy)/*DNC*/) {
                this.status = 0;
                this.ax = this.ax - 1; this.ay = this.ay - 1;
                this.by = this.by - 2;
                this.cx = this.cx - 1; this.cy = this.cy + 1;
            }
        }
    }

    status2(grid) {
        if (this.type === 1) {
            if (/*DNC*/this.canrotate(this.ax-1,this.ay+1,this.bx,this.by,this.cx+1,this.cy-1,this.dx+1,this.dy+1)/*DNC*/) {
                this.status = 3;
                this.ax = this.ax - 1; this.ay = this.ay + 1;
                this.cx = this.cx + 1; this.cy = this.cy - 1;
                this.dx = this.dx + 1; this.dy = this.dy + 1;
            }
        } else if (this.type === 4) {
            if (/*DNC*/this.canrotate(this.ax,this.ay,this.bx+1,this.by-1,this.cx+2,this.cy-2,this.dx+1,this.dy+1)/*DNC*/) {
                this.status = 3;
                this.bx = this.bx + 1; this.by = this.by - 1;
                this.cx = this.cx + 2; this.cy = this.cy - 2;
                this.dx = this.dx + 1; this.dy = this.dy + 1;
            }
        } else if (this.type === 5) {
            if (/*DNC*/this.canrotate(this.ax-2,this.ay+2,this.bx-1,this.by-1,this.cx,this.cy,this.dx+1,this.dy+1)/*DNC*/) {
                this.status = 3;
                this.ax = this.ax-2; this.ay = this.ay+2;
                this.bx = this.bx-1; this.by = this.by+1;
                this.dx = this.dx+1; this.dy = this.dy+1;
            }
        }
    }

    status3(grid) {
        if (this.type === 1) {
            if (/*DNC*/this.canrotate(this.ax-1,this.ay-1,this.bx,this.by,this.cx+1,this.cy+1,this.dx-1,this.dy+1)/*DNC*/) {
                this.status = 0;
                this.ax = this.ax - 1; this.ay = this.ay - 1;
                this.cx = this.cx + 1; this.cy = this.cy + 1;
                this.dx = this.dx - 1; this.dy = this.dy + 1;
            }
        } else if (this.type === 4) {
            if (/*DNC*/this.canrotate(this.ax,this.ay,this.bx+1,this.by+1,this.cx+2,this.cy+2,this.dx-1,this.dy+1)/*DNC*/) {
                this.status = 0;
                this.bx = this.bx + 1; this.by = this.by + 1;
                this.cx = this.cx + 2; this.cy = this.cy + 2;
                this.dx = this.dx - 1; this.dy = this.dy + 1;
            }
        } else if (this.type === 5) {
            if (/*DNC*/this.canrotate(this.ax-2,this.ay-2,this.bx-1,this.by-1,this.cx,this.cy,this.dx-1,this.dy+1)/*DNC*/) {
                this.status = 0;
                this.ax = this.ax-2; this.ay = this.ay-2;
                this.bx = this.bx-1; this.by = this.by-1;
                this.dx = this.dx-1; this.dy = this.dy+1;
            }
        }
    }
}
