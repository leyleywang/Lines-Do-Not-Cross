// Lines Do Not Cross Game
// 连线不交叉游戏

class LinesDoNotCrossGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        
        if (!this.gl) {
            alert('您的浏览器不支持 WebGL，请使用其他浏览器。');
            return;
        }
        
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clearColor(0.059, 0.204, 0.376, 1.0); // #0f3460
        
        this.currentLevel = 1;
        this.totalLevels = 10;
        this.colorsPerLevel = 3;
        
        this.dotRadius = 20;
        this.lineWidth = 5;
        this.dots = [];
        this.lines = [];
        this.currentLine = null;
        this.isDrawing = false;
        this.startDot = null;
        
        this.colors = [
            [0.914, 0.267, 0.376], // 红色 #e94560
            [0.000, 1.000, 0.533], // 绿色 #00ff88
            [0.200, 0.400, 0.800], // 蓝色 #3366cc
            [1.000, 0.843, 0.000], // 黄色 #ffd700
            [0.502, 0.000, 0.502], // 紫色 #800080
            [1.000, 0.647, 0.000], // 橙色 #ffa500
            [0.294, 0.000, 0.510], // 靛蓝色 #4b0082
            [0.000, 0.502, 0.502], // 青色 #008080
            [0.545, 0.000, 0.000], // 深红色 #8b0000
            [0.000, 0.392, 0.000]  // 深绿色 #006400
        ];
        
        this.levels = this.createLevels();
        
        this.initShaders();
        this.initBuffers();
        this.initEventListeners();
        this.loadLevel(this.currentLevel);
        this.render();
    }
    
    createLevels() {
        const levels = [];
        
        // 关卡 1: 3对颜色，简单布局
        levels.push({
            pairs: 3,
            dots: [
                { x: 100, y: 100, colorIndex: 0, pairId: 0 },
                { x: 500, y: 500, colorIndex: 0, pairId: 0 },
                { x: 500, y: 100, colorIndex: 1, pairId: 1 },
                { x: 100, y: 500, colorIndex: 1, pairId: 1 },
                { x: 300, y: 150, colorIndex: 2, pairId: 2 },
                { x: 300, y: 450, colorIndex: 2, pairId: 2 }
            ]
        });
        
        // 关卡 2: 4对颜色
        levels.push({
            pairs: 4,
            dots: [
                { x: 100, y: 100, colorIndex: 0, pairId: 0 },
                { x: 500, y: 500, colorIndex: 0, pairId: 0 },
                { x: 500, y: 100, colorIndex: 1, pairId: 1 },
                { x: 100, y: 500, colorIndex: 1, pairId: 1 },
                { x: 300, y: 100, colorIndex: 2, pairId: 2 },
                { x: 300, y: 500, colorIndex: 2, pairId: 2 },
                { x: 150, y: 300, colorIndex: 3, pairId: 3 },
                { x: 450, y: 300, colorIndex: 3, pairId: 3 }
            ]
        });
        
        // 关卡 3: 5对颜色，稍微复杂
        levels.push({
            pairs: 5,
            dots: [
                { x: 100, y: 100, colorIndex: 0, pairId: 0 },
                { x: 500, y: 100, colorIndex: 0, pairId: 0 },
                { x: 100, y: 200, colorIndex: 1, pairId: 1 },
                { x: 500, y: 200, colorIndex: 1, pairId: 1 },
                { x: 100, y: 300, colorIndex: 2, pairId: 2 },
                { x: 500, y: 300, colorIndex: 2, pairId: 2 },
                { x: 100, y: 400, colorIndex: 3, pairId: 3 },
                { x: 500, y: 400, colorIndex: 3, pairId: 3 },
                { x: 100, y: 500, colorIndex: 4, pairId: 4 },
                { x: 500, y: 500, colorIndex: 4, pairId: 4 }
            ]
        });
        
        // 关卡 4: 6对颜色
        levels.push({
            pairs: 6,
            dots: [
                { x: 100, y: 100, colorIndex: 0, pairId: 0 },
                { x: 300, y: 500, colorIndex: 0, pairId: 0 },
                { x: 300, y: 100, colorIndex: 1, pairId: 1 },
                { x: 500, y: 500, colorIndex: 1, pairId: 1 },
                { x: 500, y: 100, colorIndex: 2, pairId: 2 },
                { x: 100, y: 500, colorIndex: 2, pairId: 2 },
                { x: 150, y: 300, colorIndex: 3, pairId: 3 },
                { x: 450, y: 300, colorIndex: 3, pairId: 3 },
                { x: 200, y: 200, colorIndex: 4, pairId: 4 },
                { x: 400, y: 400, colorIndex: 4, pairId: 4 },
                { x: 400, y: 200, colorIndex: 5, pairId: 5 },
                { x: 200, y: 400, colorIndex: 5, pairId: 5 }
            ]
        });
        
        // 关卡 5: 7对颜色，更复杂
        levels.push({
            pairs: 7,
            dots: [
                { x: 100, y: 100, colorIndex: 0, pairId: 0 },
                { x: 500, y: 500, colorIndex: 0, pairId: 0 },
                { x: 500, y: 100, colorIndex: 1, pairId: 1 },
                { x: 100, y: 500, colorIndex: 1, pairId: 1 },
                { x: 300, y: 100, colorIndex: 2, pairId: 2 },
                { x: 300, y: 500, colorIndex: 2, pairId: 2 },
                { x: 100, y: 300, colorIndex: 3, pairId: 3 },
                { x: 500, y: 300, colorIndex: 3, pairId: 3 },
                { x: 150, y: 150, colorIndex: 4, pairId: 4 },
                { x: 450, y: 450, colorIndex: 4, pairId: 4 },
                { x: 450, y: 150, colorIndex: 5, pairId: 5 },
                { x: 150, y: 450, colorIndex: 5, pairId: 5 },
                { x: 300, y: 200, colorIndex: 6, pairId: 6 },
                { x: 300, y: 400, colorIndex: 6, pairId: 6 }
            ]
        });
        
        // 关卡 6: 8对颜色
        levels.push({
            pairs: 8,
            dots: [
                { x: 100, y: 100, colorIndex: 0, pairId: 0 },
                { x: 500, y: 100, colorIndex: 0, pairId: 0 },
                { x: 100, y: 500, colorIndex: 1, pairId: 1 },
                { x: 500, y: 500, colorIndex: 1, pairId: 1 },
                { x: 300, y: 100, colorIndex: 2, pairId: 2 },
                { x: 300, y: 500, colorIndex: 2, pairId: 2 },
                { x: 100, y: 300, colorIndex: 3, pairId: 3 },
                { x: 500, y: 300, colorIndex: 3, pairId: 3 },
                { x: 150, y: 150, colorIndex: 4, pairId: 4 },
                { x: 450, y: 450, colorIndex: 4, pairId: 4 },
                { x: 450, y: 150, colorIndex: 5, pairId: 5 },
                { x: 150, y: 450, colorIndex: 5, pairId: 5 },
                { x: 200, y: 300, colorIndex: 6, pairId: 6 },
                { x: 400, y: 300, colorIndex: 6, pairId: 6 },
                { x: 300, y: 150, colorIndex: 7, pairId: 7 },
                { x: 300, y: 450, colorIndex: 7, pairId: 7 }
            ]
        });
        
        // 关卡 7: 9对颜色
        levels.push({
            pairs: 9,
            dots: [
                { x: 100, y: 100, colorIndex: 0, pairId: 0 },
                { x: 500, y: 500, colorIndex: 0, pairId: 0 },
                { x: 500, y: 100, colorIndex: 1, pairId: 1 },
                { x: 100, y: 500, colorIndex: 1, pairId: 1 },
                { x: 300, y: 100, colorIndex: 2, pairId: 2 },
                { x: 300, y: 500, colorIndex: 2, pairId: 2 },
                { x: 100, y: 300, colorIndex: 3, pairId: 3 },
                { x: 500, y: 300, colorIndex: 3, pairId: 3 },
                { x: 150, y: 150, colorIndex: 4, pairId: 4 },
                { x: 450, y: 450, colorIndex: 4, pairId: 4 },
                { x: 450, y: 150, colorIndex: 5, pairId: 5 },
                { x: 150, y: 450, colorIndex: 5, pairId: 5 },
                { x: 200, y: 200, colorIndex: 6, pairId: 6 },
                { x: 400, y: 400, colorIndex: 6, pairId: 6 },
                { x: 400, y: 200, colorIndex: 7, pairId: 7 },
                { x: 200, y: 400, colorIndex: 7, pairId: 7 },
                { x: 250, y: 300, colorIndex: 8, pairId: 8 },
                { x: 350, y: 300, colorIndex: 8, pairId: 8 }
            ]
        });
        
        // 关卡 8: 10对颜色，高难度
        levels.push({
            pairs: 10,
            dots: [
                { x: 100, y: 100, colorIndex: 0, pairId: 0 },
                { x: 500, y: 100, colorIndex: 0, pairId: 0 },
                { x: 100, y: 500, colorIndex: 1, pairId: 1 },
                { x: 500, y: 500, colorIndex: 1, pairId: 1 },
                { x: 300, y: 100, colorIndex: 2, pairId: 2 },
                { x: 300, y: 500, colorIndex: 2, pairId: 2 },
                { x: 100, y: 300, colorIndex: 3, pairId: 3 },
                { x: 500, y: 300, colorIndex: 3, pairId: 3 },
                { x: 150, y: 150, colorIndex: 4, pairId: 4 },
                { x: 450, y: 450, colorIndex: 4, pairId: 4 },
                { x: 450, y: 150, colorIndex: 5, pairId: 5 },
                { x: 150, y: 450, colorIndex: 5, pairId: 5 },
                { x: 200, y: 200, colorIndex: 6, pairId: 6 },
                { x: 400, y: 400, colorIndex: 6, pairId: 6 },
                { x: 400, y: 200, colorIndex: 7, pairId: 7 },
                { x: 200, y: 400, colorIndex: 7, pairId: 7 },
                { x: 250, y: 250, colorIndex: 8, pairId: 8 },
                { x: 350, y: 350, colorIndex: 8, pairId: 8 },
                { x: 350, y: 250, colorIndex: 9, pairId: 9 },
                { x: 250, y: 350, colorIndex: 9, pairId: 9 }
            ]
        });
        
        // 关卡 9: 11对颜色，挑战级
        levels.push({
            pairs: 11,
            dots: [
                { x: 100, y: 100, colorIndex: 0, pairId: 0 },
                { x: 500, y: 500, colorIndex: 0, pairId: 0 },
                { x: 500, y: 100, colorIndex: 1, pairId: 1 },
                { x: 100, y: 500, colorIndex: 1, pairId: 1 },
                { x: 300, y: 100, colorIndex: 2, pairId: 2 },
                { x: 300, y: 500, colorIndex: 2, pairId: 2 },
                { x: 100, y: 300, colorIndex: 3, pairId: 3 },
                { x: 500, y: 300, colorIndex: 3, pairId: 3 },
                { x: 150, y: 150, colorIndex: 4, pairId: 4 },
                { x: 450, y: 450, colorIndex: 4, pairId: 4 },
                { x: 450, y: 150, colorIndex: 5, pairId: 5 },
                { x: 150, y: 450, colorIndex: 5, pairId: 5 },
                { x: 200, y: 200, colorIndex: 6, pairId: 6 },
                { x: 400, y: 400, colorIndex: 6, pairId: 6 },
                { x: 400, y: 200, colorIndex: 7, pairId: 7 },
                { x: 200, y: 400, colorIndex: 7, pairId: 7 },
                { x: 250, y: 250, colorIndex: 8, pairId: 8 },
                { x: 350, y: 350, colorIndex: 8, pairId: 8 },
                { x: 350, y: 250, colorIndex: 9, pairId: 9 },
                { x: 250, y: 350, colorIndex: 9, pairId: 9 },
                { x: 300, y: 200, colorIndex: 0, pairId: 10 },
                { x: 300, y: 400, colorIndex: 0, pairId: 10 }
            ]
        });
        
        // 关卡 10: 12对颜色，终极挑战
        levels.push({
            pairs: 12,
            dots: [
                { x: 100, y: 100, colorIndex: 0, pairId: 0 },
                { x: 500, y: 100, colorIndex: 0, pairId: 0 },
                { x: 100, y: 500, colorIndex: 1, pairId: 1 },
                { x: 500, y: 500, colorIndex: 1, pairId: 1 },
                { x: 300, y: 100, colorIndex: 2, pairId: 2 },
                { x: 300, y: 500, colorIndex: 2, pairId: 2 },
                { x: 100, y: 300, colorIndex: 3, pairId: 3 },
                { x: 500, y: 300, colorIndex: 3, pairId: 3 },
                { x: 150, y: 150, colorIndex: 4, pairId: 4 },
                { x: 450, y: 450, colorIndex: 4, pairId: 4 },
                { x: 450, y: 150, colorIndex: 5, pairId: 5 },
                { x: 150, y: 450, colorIndex: 5, pairId: 5 },
                { x: 200, y: 200, colorIndex: 6, pairId: 6 },
                { x: 400, y: 400, colorIndex: 6, pairId: 6 },
                { x: 400, y: 200, colorIndex: 7, pairId: 7 },
                { x: 200, y: 400, colorIndex: 7, pairId: 7 },
                { x: 250, y: 250, colorIndex: 8, pairId: 8 },
                { x: 350, y: 350, colorIndex: 8, pairId: 8 },
                { x: 350, y: 250, colorIndex: 9, pairId: 9 },
                { x: 250, y: 350, colorIndex: 9, pairId: 9 },
                { x: 300, y: 150, colorIndex: 0, pairId: 10 },
                { x: 300, y: 450, colorIndex: 0, pairId: 10 },
                { x: 250, y: 300, colorIndex: 1, pairId: 11 },
                { x: 350, y: 300, colorIndex: 1, pairId: 11 }
            ]
        });
        
        return levels;
    }
    
    initShaders() {
        const vertexShaderSource = `
            attribute vec2 a_position;
            attribute vec4 a_color;
            varying vec4 v_color;
            
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
                v_color = a_color;
            }
        `;
        
        const fragmentShaderSource = `
            precision mediump float;
            varying vec4 v_color;
            
            void main() {
                gl_FragColor = v_color;
            }
        `;
        
        const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
        
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);
        
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(this.program));
            return null;
        }
        
        this.gl.useProgram(this.program);
        
        this.positionAttributeLocation = this.gl.getAttribLocation(this.program, 'a_position');
        this.colorAttributeLocation = this.gl.getAttribLocation(this.program, 'a_color');
    }
    
    compileShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    initBuffers() {
        this.dotBuffer = this.gl.createBuffer();
        this.lineBuffer = this.gl.createBuffer();
        this.currentLineBuffer = this.gl.createBuffer();
    }
    
    initEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this));
        
        // 触摸事件支持
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
        
        // 按钮事件
        document.getElementById('reset-level-btn').addEventListener('click', this.resetLevel.bind(this));
        document.getElementById('restart-game-btn').addEventListener('click', this.restartGame.bind(this));
        document.getElementById('next-level-btn').addEventListener('click', this.nextLevel.bind(this));
        document.getElementById('restart-btn').addEventListener('click', this.restartGame.bind(this));
    }
    
    getMousePosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    
    getTouchPosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches[0] || e.changedTouches[0];
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
    }
    
    isPointInDot(point, dot) {
        const dx = point.x - dot.x;
        const dy = point.y - dot.y;
        return Math.sqrt(dx * dx + dy * dy) <= this.dotRadius;
    }
    
    handleMouseDown(e) {
        const pos = this.getMousePosition(e);
        this.startDrawing(pos);
    }
    
    handleMouseMove(e) {
        if (!this.isDrawing) return;
        const pos = this.getMousePosition(e);
        this.updateDrawing(pos);
    }
    
    handleMouseUp(e) {
        if (!this.isDrawing) return;
        const pos = this.getMousePosition(e);
        this.endDrawing(pos);
    }
    
    handleTouchStart(e) {
        e.preventDefault();
        const pos = this.getTouchPosition(e);
        this.startDrawing(pos);
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        if (!this.isDrawing) return;
        const pos = this.getTouchPosition(e);
        this.updateDrawing(pos);
    }
    
    handleTouchEnd(e) {
        e.preventDefault();
        if (!this.isDrawing) return;
        const pos = this.getTouchPosition(e);
        this.endDrawing(pos);
    }
    
    startDrawing(pos) {
        for (let dot of this.dots) {
            if (this.isPointInDot(pos, dot)) {
                const pairLine = this.lines.find(line => line.pairId === dot.pairId);
                if (pairLine) {
                    this.lines = this.lines.filter(line => line.pairId !== dot.pairId);
                }
                
                this.isDrawing = true;
                this.startDot = dot;
                this.currentLine = {
                    points: [{ x: dot.x, y: dot.y }],
                    colorIndex: dot.colorIndex,
                    pairId: dot.pairId,
                    startDot: dot
                };
                return;
            }
        }
    }
    
    updateDrawing(pos) {
        if (!this.currentLine) return;
        
        const lastPoint = this.currentLine.points[this.currentLine.points.length - 1];
        const dx = pos.x - lastPoint.x;
        const dy = pos.y - lastPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
            this.currentLine.points.push({ x: pos.x, y: pos.y });
        }
    }
    
    endDrawing(pos) {
        if (!this.isDrawing || !this.currentLine) return;
        
        this.isDrawing = false;
        
        for (let dot of this.dots) {
            if (this.isPointInDot(pos, dot) && 
                dot.pairId === this.startDot.pairId && 
                dot !== this.startDot) {
                
                this.currentLine.points.push({ x: dot.x, y: dot.y });
                this.currentLine.endDot = dot;
                
                if (this.checkLineIntersection(this.currentLine)) {
                    this.showMessage('连线交叉啦');
                    setTimeout(() => this.hideMessage(), 1000);
                } else {
                    this.lines.push(this.currentLine);
                    
                    if (this.checkLevelComplete()) {
                        this.showLevelComplete();
                    }
                }
                break;
            }
        }
        
        this.currentLine = null;
        this.startDot = null;
    }
    
    checkLineIntersection(newLine) {
        for (let line of this.lines) {
            if (line.pairId === newLine.pairId) continue;
            
            for (let i = 0; i < line.points.length - 1; i++) {
                for (let j = 0; j < newLine.points.length - 1; j++) {
                    if (this.doLinesIntersect(
                        line.points[i], line.points[i + 1],
                        newLine.points[j], newLine.points[j + 1]
                    )) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    doLinesIntersect(p1, p2, p3, p4) {
        const d1 = this.direction(p3, p4, p1);
        const d2 = this.direction(p3, p4, p2);
        const d3 = this.direction(p1, p2, p3);
        const d4 = this.direction(p1, p2, p4);
        
        if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
            ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) {
            return true;
        }
        
        if (d1 === 0 && this.onSegment(p3, p4, p1)) return true;
        if (d2 === 0 && this.onSegment(p3, p4, p2)) return true;
        if (d3 === 0 && this.onSegment(p1, p2, p3)) return true;
        if (d4 === 0 && this.onSegment(p1, p2, p4)) return true;
        
        return false;
    }
    
    direction(p1, p2, p3) {
        return (p3.x - p1.x) * (p2.y - p1.y) - (p2.x - p1.x) * (p3.y - p1.y);
    }
    
    onSegment(p1, p2, p3) {
        const minX = Math.min(p1.x, p2.x);
        const maxX = Math.max(p1.x, p2.x);
        const minY = Math.min(p1.y, p2.y);
        const maxY = Math.max(p1.y, p2.y);
        
        if (p3.x >= minX && p3.x <= maxX && p3.y >= minY && p3.y <= maxY) {
            const distance = Math.sqrt(
                Math.pow(p3.x - p1.x, 2) + Math.pow(p3.y - p1.y, 2)
            ) + Math.sqrt(
                Math.pow(p3.x - p2.x, 2) + Math.pow(p3.y - p2.y, 2)
            );
            const lineLength = Math.sqrt(
                Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
            );
            
            return Math.abs(distance - lineLength) < 5;
        }
        return false;
    }
    
    checkLevelComplete() {
        const level = this.levels[this.currentLevel - 1];
        return this.lines.length === level.pairs;
    }
    
    showMessage(text) {
        const messageEl = document.getElementById('message');
        messageEl.textContent = text;
        messageEl.style.display = 'block';
    }
    
    hideMessage() {
        const messageEl = document.getElementById('message');
        messageEl.style.display = 'none';
    }
    
    showLevelComplete() {
        const levelCompleteEl = document.getElementById('level-complete');
        const titleEl = document.getElementById('level-complete-title');
        const textEl = document.getElementById('level-complete-text');
        const nextBtn = document.getElementById('next-level-btn');
        
        if (this.currentLevel === this.totalLevels) {
            titleEl.textContent = '恭喜通关！';
            textEl.textContent = '您已完成所有关卡！';
            nextBtn.style.display = 'none';
        } else {
            titleEl.textContent = '通关成功！';
            textEl.textContent = `准备好迎接第 ${this.currentLevel + 1} 关了吗？`;
            nextBtn.style.display = 'inline-block';
        }
        
        levelCompleteEl.style.display = 'flex';
    }
    
    hideLevelComplete() {
        const levelCompleteEl = document.getElementById('level-complete');
        levelCompleteEl.style.display = 'none';
    }
    
    loadLevel(levelNum) {
        this.currentLevel = levelNum;
        const level = this.levels[levelNum - 1];
        this.colorsPerLevel = level.pairs;
        
        this.dots = level.dots.map(dot => ({
            x: dot.x,
            y: dot.y,
            colorIndex: dot.colorIndex,
            pairId: dot.pairId
        }));
        
        this.lines = [];
        this.currentLine = null;
        this.isDrawing = false;
        this.startDot = null;
        
        document.getElementById('current-level').textContent = `关卡: ${this.currentLevel}`;
        document.getElementById('pairs-count').textContent = `颜色对: ${this.colorsPerLevel}`;
        
        this.hideLevelComplete();
        this.hideMessage();
    }
    
    resetLevel() {
        this.loadLevel(this.currentLevel);
    }
    
    nextLevel() {
        if (this.currentLevel < this.totalLevels) {
            this.loadLevel(this.currentLevel + 1);
        }
    }
    
    restartGame() {
        this.loadLevel(1);
    }
    
    screenToWebGL(x, y) {
        return {
            x: (x / this.canvas.width) * 2 - 1,
            y: 1 - (y / this.canvas.height) * 2
        };
    }
    
    createCircleVertices(x, y, radius, segments = 30) {
        const vertices = [];
        const glPos = this.screenToWebGL(x, y);
        const glRadius = radius / (this.canvas.width / 2);
        
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const vx = glPos.x + Math.cos(angle) * glRadius;
            const vy = glPos.y + Math.sin(angle) * glRadius;
            vertices.push(vx, vy);
        }
        
        return vertices;
    }
    
    createLineVertices(points) {
        const vertices = [];
        
        for (let i = 0; i < points.length - 1; i++) {
            const p1 = this.screenToWebGL(points[i].x, points[i].y);
            const p2 = this.screenToWebGL(points[i + 1].x, points[i + 1].y);
            
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            
            if (length === 0) continue;
            
            const nx = -dy / length;
            const ny = dx / length;
            
            const halfWidth = (this.lineWidth / 2) / (this.canvas.width / 2);
            
            vertices.push(
                p1.x + nx * halfWidth, p1.y + ny * halfWidth,
                p1.x - nx * halfWidth, p1.y - ny * halfWidth,
                p2.x + nx * halfWidth, p2.y + ny * halfWidth,
                p1.x - nx * halfWidth, p1.y - ny * halfWidth,
                p2.x - nx * halfWidth, p2.y - ny * halfWidth,
                p2.x + nx * halfWidth, p2.y + ny * halfWidth
            );
        }
        
        return vertices;
    }
    
    render() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        
        for (let line of this.lines) {
            this.renderLine(line);
        }
        
        if (this.currentLine && this.currentLine.points.length > 1) {
            this.renderLine(this.currentLine);
        }
        
        for (let dot of this.dots) {
            this.renderDot(dot);
        }
        
        requestAnimationFrame(this.render.bind(this));
    }
    
    renderLine(line) {
        const vertices = this.createLineVertices(line.points);
        if (vertices.length === 0) return;
        
        const color = this.colors[line.colorIndex % this.colors.length];
        
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.lineBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.DYNAMIC_DRAW);
        
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        this.gl.vertexAttribPointer(this.positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
        
        this.gl.disableVertexAttribArray(this.colorAttributeLocation);
        this.gl.vertexAttrib4fv(this.colorAttributeLocation, new Float32Array([...color, 1.0]));
        
        this.gl.drawArrays(this.gl.TRIANGLES, 0, vertices.length / 2);
    }
    
    renderDot(dot) {
        const vertices = this.createCircleVertices(dot.x, dot.y, this.dotRadius);
        const color = this.colors[dot.colorIndex % this.colors.length];
        
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.dotBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.DYNAMIC_DRAW);
        
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        this.gl.vertexAttribPointer(this.positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
        
        this.gl.disableVertexAttribArray(this.colorAttributeLocation);
        this.gl.vertexAttrib4fv(this.colorAttributeLocation, new Float32Array([...color, 1.0]));
        
        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, vertices.length / 2);
    }
}

window.addEventListener('load', () => {
    new LinesDoNotCrossGame();
});
