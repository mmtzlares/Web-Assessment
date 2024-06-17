document.addEventListener("DOMContentLoaded", function() {
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    var triangleText = document.getElementById("triangleText");
    var questionDiv = document.getElementById('question');
    var answersDiv = document.getElementById('answers');

    var currentQuestionIndex = 0;
    var currentSectionIndex = 0;
    var quizData = [];  

    fetch("../../data/data.json")  // Update the file path as necessary
        .then(response => response.json())
        .then(data => {
            quizData = data.quizData;
            displayQuestion(currentSectionIndex, currentQuestionIndex);
            drawTriangle();
        })
        .catch(error => {
            console.error('Error loading the quiz data:', error);
        });

    function displayQuestion(sectionIndex, questionIndex) {
        if (sectionIndex >= quizData.length || questionIndex >= quizData[sectionIndex].questions.length) {
            console.error('Index out of bounds');
            return;
        }

        const questionData = quizData[sectionIndex].questions[questionIndex];
        questionDiv.innerHTML = questionData.question;
        answersDiv.innerHTML = questionData.answers
            .map((answer, idx) => `<li><button class="answer-btn" data-answer="${idx}">${answer}</button></li>`)
            .join('');
        setupAnswerListeners();
        drawTriangle();
    }

    function setupAnswerListeners() {
        document.querySelectorAll('.answer-btn').forEach(button => {
            button.addEventListener('click', function() {
                currentQuestionIndex++;
                if (currentQuestionIndex < quizData[currentSectionIndex].questions.length) {
                    displayQuestion(currentSectionIndex, currentQuestionIndex);
                } else {
                    currentSectionIndex++;
                    if (currentSectionIndex < quizData.length) {
                        currentQuestionIndex = 0;
                        displayQuestion(currentSectionIndex, currentQuestionIndex);
                    } else {
                        questionDiv.innerHTML = "Quiz completed!";
                        answersDiv.innerHTML = '';
                    }
                }
            });
        });
    }

    function drawTriangle() {
        var triangleSize = 400;
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;
        var height = Math.sqrt(3) * triangleSize / 2;
    
        var vertices = [
            [centerX - triangleSize / 2, centerY + height / 2], // Vertex A
            [centerX + triangleSize / 2, centerY + height / 2], // Vertex B
            [centerX, centerY - height / 2] // Vertex C
        ];
    
        var centroidX = (vertices[0][0] + vertices[1][0] + vertices[2][0]) / 3;
        var centroidY = (vertices[0][1] + vertices[1][1] + vertices[2][1]) / 3;
    
        var midpoints = [
            [(vertices[0][0] + vertices[1][0]) / 2, (vertices[0][1] + vertices[1][1]) / 2], // Midpoint of side AB
            [(vertices[1][0] + vertices[2][0]) / 2, (vertices[1][1] + vertices[2][1]) / 2], // Midpoint of side BC
            [(vertices[2][0] + vertices[0][0]) / 2, (vertices[2][1] + vertices[0][1]) / 2] // Midpoint of side CA
        ];
    
        var centroidToVerticesMidpoints = [
            [(vertices[0][0] + centroidX) / 2, (vertices[0][1] + centroidY) / 2],
            [(vertices[1][0] + centroidX) / 2, (vertices[1][1] + centroidY) / 2],
            [(vertices[2][0] + centroidX) / 2, (vertices[2][1] + centroidY) / 2]
        ];
    
        context.clearRect(0, 0, canvas.width, canvas.height);
    
        // Draw the main triangle
        context.beginPath();
        context.moveTo(vertices[0][0], vertices[0][1]);
        context.lineTo(vertices[1][0], vertices[1][1]);
        context.lineTo(vertices[2][0], vertices[2][1]);
        context.closePath();
        context.stroke();
    
        // Draw segments from vertices to centroid
        vertices.forEach((vertex, i) => {
            context.beginPath();
            context.moveTo(vertex[0], vertex[1]);
            context.lineTo(centroidX, centroidY);
            context.stroke();
        });
    
        // Draw segments from midpoints of sides to midpoints of lines from vertices to centroid
        vertices.forEach((vertex, i) => {
            context.beginPath();
            context.moveTo(midpoints[i][0], midpoints[i][1]);
            context.lineTo(centroidToVerticesMidpoints[i][0], centroidToVerticesMidpoints[i][1]);
            context.stroke();
    
            // Also connect midpoints to the next centroid midpoint in sequence (creating a criss-cross pattern)
            let nextIndex = (i + 1) % 3;
            context.beginPath();
            context.moveTo(midpoints[i][0], midpoints[i][1]);
            context.lineTo(centroidToVerticesMidpoints[nextIndex][0], centroidToVerticesMidpoints[nextIndex][1]);
            context.stroke();
        });

        // Draw segments from the centroid to each side's midpoint
        midpoints.forEach(midpoint => {
        context.beginPath();
        context.moveTo(centroidX, centroidY);
        context.lineTo(midpoint[0], midpoint[1]);
        context.stroke();
        });
    
        // Draw the concentric circle at the centroid
        var radius = Math.sqrt(triangleSize * height / (21 * Math.PI));
        context.beginPath();
        context.arc(centroidX, centroidY, radius, 0, 2 * Math.PI);
        context.stroke();
    }
            
});
