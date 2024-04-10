import { colors, canvas, context, startBtn, clearBtn, createPoints } from './const.js' 
import { createPopulation, evolvePopulation, getFittestIndividual, findBestPath, shuffleArray } from './genetic.js' 
 
 
let points = []; 
let bestPath = []; 
let allowAddPoints = true; 
 
// Кнопка для установки вершин 
createPoints.addEventListener('click', () => { 
    allowAddPoints = true; 
    createPointsCanvas(); 
}); 
 
// Рисуем на холсте "canvas" - вершины, в дальнейшем для отображения пути 
function createPointsCanvas() { 
    canvas.addEventListener('click', function (event) { 
        if (allowAddPoints) { 
            const rect = canvas.getBoundingClientRect(); 
            const x = event.clientX - rect.left; 
            const y = event.clientY - rect.top; 
            points.push({ x, y }); 
            drawPoints(); 
        } 
    }); 
} 
 
// Кнопка для запуска алгоритма 
startBtn.addEventListener('click', async function () { 
    // мешаем вершины местами 
    shuffleArray(points); 
 
    // выставляем значние популяции, процент мутации и генерации 
    const populationSize = 1000; 
    const mutationRate = 50; 
    const generations = 10; 
 
    let population = createPopulation(populationSize, points.length); 
 
    for (let i = 0; i < generations; i++) { 
        population = evolvePopulation(population, mutationRate, points); // передаем массив points 
        const fittestIndividual = getFittestIndividual(population, points); // передаем массив points 
        bestPath = fittestIndividual.path; 
        drawPath(bestPath); 
        await sleep(10); 
    } 
 
    bestPath = findBestPath(points, population, mutationRate, generations); 
    drawPath(bestPath); 
    allowAddPoints = false; // Установка false, после запуска алгоритма нельзя добавлять вершины, пока не нажмется кнопка "Установить вершины" 
}); 
 
 
// Кнопка очистки холста "canvas" 
clearBtn.addEventListener('click', () => { 
    context.clearRect(0, 0, canvas.width, canvas.height); 
    points.splice(0, points.length); 
}); 
 
// Рисование вершин на холсте "canvas" 
function drawPoints() { 
    context.clearRect(0, 0, canvas.width, canvas.height); 
    points.forEach(point => { 
        context.beginPath(); 
        context.arc(point.x, point.y, 10, 0, Math.PI * 2); 
        context.fillStyle = colors.orange; 
        context.fill(); 
    }); 
} 
 
// Рисование пути по вершинам 
function drawPath(path) { 
    drawPoints(); 
    context.beginPath(); 
    context.moveTo(points[path[0]].x, points[path[0]].y); 
    for (let i = 1; i < path.length; i++) { 
        context.lineTo(points[path[i]].x, points[path[i]].y); 
    } 
    context.lineTo(points[path[0]].x, points[path[0]].y); 
    // let gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height); 
    // gradient.addColorStop(0, "rgba(255, 165, 0, 1)"); 
    // gradient.addColorStop(1, "rgba(0, 255, 0, 1)"); 
    context.lineWidth = 3; 
    context.strokeStyle = "grey"; 
    context.stroke(); 
} 
 
// Задержка для показа прохода по вершинам 
function sleep(ms) { 
    return new Promise(resolve => setTimeout(resolve, ms)); 
}