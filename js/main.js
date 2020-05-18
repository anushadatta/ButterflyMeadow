let sketchrnn_model;

// stroke = { dx: float, dy: float, pen: String ('up'/'down'/'pen')}
let strokePath = null;
let x, y;

// pen state for NEXT stroke. init pen='down' by default
let pen;

var butterfly_color = ['indigo', 'mediumvioletred', 'mediumblue', 'mediumslateblue', 'teal', 'gold', 'coral', 'darkorchid'];
var i = 0;

function setup() {

    createCanvas(windowWidth, windowHeight);
    setupNewSketch();

    // ml5.js loads SketchRNN model for 'butterfly' from cloud 
    sketchrnn_model = ml5.SketchRNN('butterfly', modelReady);
}

// model loaded and ready 
function modelReady() {

    sketchrnn_model.reset();
    sketchrnn_model.generate(gotSketch);
}

// Update stroke path value 
function gotSketch(error, s) {
    if (error) {
        console.error(error);
    } else {
        strokePath = s;
    }
}

// (pen = 'end'), start sketching new butterfly 
function setupNewSketch() {
    pen = 'down';

    // Randomly set position of new sketch 
    x = random(-width / 2, width / 2);
    y = random(-height / 2, height / 2);
}

function draw() {

    translate(width / 2, height / 2);

    if (strokePath != null) {

        // Computing new x and y coordinates for stroke & scaling down
        let newX = x + strokePath.dx * 0.18;
        let newY = y + strokePath.dy * 0.18;

        // Draw the stroke 
        if (pen == 'down') {
            stroke(butterfly_color[i]);
            strokeWeight(2);
            line(x, y, newX, newY);
        }

        // Update x, y and pen for next stroke 
        pen = strokePath.pen;
        strokePath = null;
        x = newX;
        y = newY;

        // Drawing complete, start new sketch 
        if (pen !== 'end') {
            sketchrnn_model.generate(gotSketch);
        } else {

            // Randomly pick color of next butterfly sketch 
            i = Math.floor(random(8));

            // Start new sketch 
            setupNewSketch();
            sketchrnn_model.reset();
            sketchrnn_model.generate(gotSketch);
        }
    }
}