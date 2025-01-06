const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

canvas.setAttribute('width', window.innerWidth);
canvas.setAttribute('height', window.innerHeight);

window.addEventListener('resize', () => {
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
});

const icons = document.querySelector('.icons');

let isDrawing = false;
let prevX = 0;
let prevY = 0;
let startX = 0;
let startY = 0;
let currentTool = 'freehand';
let savedCanvasData = null;

function resetCanvas() {
    canvas.style.cursor = 'default';
    canvas.removeEventListener('mousedown', startFreehand);
    canvas.removeEventListener('mousemove', drawFreehand);
    canvas.removeEventListener('mouseup', stopDrawing);

    canvas.removeEventListener('mousedown', startRectangle);
    canvas.removeEventListener('mousemove', drawRectangle);
    canvas.removeEventListener('mouseup', stopDrawing);

    canvas.removeEventListener('mousedown', startCircle);
    canvas.removeEventListener('mousemove', drawCircle);
    canvas.removeEventListener('mouseup', stopDrawing);

    canvas.removeEventListener('mousedown', startErasing);
    canvas.removeEventListener('mousemove', erase);
    canvas.removeEventListener('mouseup', stopDrawing);
}

icons.addEventListener('click', (e) => {
    resetCanvas();

    if (e.target.classList.contains('freehand-icon')) {
        canvas.style.cursor = 'crosshair';
        canvas.addEventListener('mousedown', startFreehand);
        canvas.addEventListener('mousemove', drawFreehand);
        canvas.addEventListener('mouseup', stopDrawing);
    } 
    else if (e.target.classList.contains('rectangle-icon')) {
        canvas.style.cursor = 'crosshair';
        canvas.addEventListener('mousedown', startRectangle);
        canvas.addEventListener('mousemove', drawRectangle);
        canvas.addEventListener('mouseup', stopDrawing);
    }
    else if (e.target.classList.contains('circle-icon')) {
        canvas.style.cursor = 'crosshair';
        canvas.addEventListener('mousedown', startCircle);
        canvas.addEventListener('mousemove', drawCircle);
        canvas.addEventListener('mouseup', stopDrawing);
    }
    else if (e.target.classList.contains('erase-icon')) {
        canvas.style.cursor = "url('https://imgs.search.brave.com/FtJ0f51iAzqo8bsJVqsJNiiH-LgnTHdYXOomJwCmL9w/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9idXJz/dC5zaG9waWZ5Y2Ru/LmNvbS9waG90b3Mv/YS1kcm9wLW9mLXBp/bmstYW5kLXllbGxv/dy1wYWludC1pbi13/YXRlci5qcGc_d2lk/dGg9MTAwMCZmb3Jt/YXQ9cGpwZyZleGlm/PTAmaXB0Yz0w'), 10 10 auto";
        canvas.addEventListener('mousedown', startErasing);
        canvas.addEventListener('mousemove', erase);
        canvas.addEventListener('mouseup', stopDrawing);
    }
    else if (e.target.classList.contains('eraseall-icon')) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

// Save canvas state
function saveCanvas() {
    savedCanvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

// Restore canvas state
function restoreCanvas() {
    if (savedCanvasData) {
        ctx.putImageData(savedCanvasData, 0, 0);
    }
}

// Freehand drawing
function startFreehand(e) {
    isDrawing = true;
    [prevX, prevY] = [e.offsetX, e.offsetY];
}

function drawFreehand(e) {
    if (isDrawing) {
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
        [prevX, prevY] = [e.offsetX, e.offsetY];
    }
}

// Rectangle drawing
function startRectangle(e) {
    isDrawing = true;
    [startX, startY] = [e.offsetX, e.offsetY];
    saveCanvas();
}

function drawRectangle(e) {
    if (isDrawing) {
        restoreCanvas();
        const width = e.offsetX - startX;
        const height = e.offsetY - startY;
        ctx.beginPath();
        ctx.rect(startX, startY, width, height);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

// Circle drawing
function startCircle(e) {
    isDrawing = true;
    [startX, startY] = [e.offsetX, e.offsetY];
    saveCanvas();
}

function drawCircle(e) {
    if (isDrawing) {
        restoreCanvas();
        const radius = Math.sqrt(
            Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2)
        );
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

// Erasing
function startErasing(e) {
    isDrawing = true;
    erase(e);
}

function erase(e) {
    if (isDrawing) {
        ctx.clearRect(e.offsetX - 40, e.offsetY - 10, 20, 40);
    }
}

// Stop drawing
function stopDrawing() {
    isDrawing = false;
}

