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

const iconTab = document.querySelector('#icons-tab');
const icon = document.querySelectorAll('.icon');
const colors = document.querySelectorAll('.color');
const toggleBtn = document.querySelector('.mode-toggle-btn')

toggleBtn.addEventListener('click', ()=> {
    
    if(toggleBtn.getAttribute('data-value')=='light') {
        toggleBtn.setAttribute('data-value', 'dark')
        document.body.style.cssText = 'background-color: #121212; color: #e0e0e0;';
        
        iconTab.style.backgroundColor = '#1f1f1f';
        
        for(let i = 0; i<icon.length; i++) {
            icon[i].style.cssText = 'background-color: rgba(217, 243, 248, 0.2); box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);'
        }
        
        canvas.style.cssText = 'background-color: #333333; border: 1px solid #444;'
        
        for(let i = 0; i<colors.length; i++) {
            colors[i].style.cssText = 'border: 2px solid #fff; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);'
        }
        
        colors[0].style.backgroundColor = 'rgba(0, 0, 0, 0.87)'
        colors[1].style.backgroundColor = 'rgba(255, 0, 0, 0.87)'
        colors[2].style.backgroundColor = 'rgba(0, 0, 255, 0.87)'
        colors[3].style.backgroundColor = 'rgba(0, 128, 0, 0.87)'
        colors[4].style.backgroundColor = 'rgba(255, 255, 0, 0.87)'
        colors[5].style.backgroundColor = 'rgba(255, 255, 255, 0.87)'
    }

    else {

        toggleBtn.setAttribute('data-value', 'light')
        document.body.style.cssText = 'background-color: #f8f9fa;';
        
        iconTab.style.backgroundColor = '#333333';
        
        for(let i = 0; i<icon.length; i++) {
            icon[i].style.cssText = 'background-color: rgba(217, 243, 248, 0.8); border-radius: 24%;'
        }
        
        canvas.style.cssText = 'background-color: #f8f9fa;'
        
        for(let i = 0; i<colors.length; i++) {
            colors[i].style.cssText = 'border: 2px solid #fff; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);'
        }
        
        colors[0].style.backgroundColor = 'rgba(0, 0, 0, 0.87)'
        colors[1].style.backgroundColor = 'rgba(255, 0, 0, 0.87)'
        colors[2].style.backgroundColor = 'rgba(0, 0, 255, 0.87)'
        colors[3].style.backgroundColor = 'rgba(0, 128, 0, 0.87)'
        colors[4].style.backgroundColor = 'rgba(255, 255, 0, 0.87)'
        colors[5].style.backgroundColor = 'rgba(255, 255, 255, 0.87)'
    }

})

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

let selectedColor = 'black';

const palette = document.getElementById('colorPicker');
palette.addEventListener('click', (e) => {
    const colorDiv = e.target;
    if (colorDiv) {
        selectedColor = colorDiv.getAttribute('data-color');
        console.log(selectedColor)
    }
});

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
        ctx.strokeStyle = selectedColor;
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
        ctx.strokeStyle = selectedColor;
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
        ctx.strokeStyle = selectedColor;
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

