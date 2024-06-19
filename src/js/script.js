document.addEventListener("DOMContentLoaded", function() {
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    var triangleText = document.getElementById("triangleText");
    var questionDiv = document.getElementById('question');
    var answersDiv = document.getElementById('answers');

    var currentQuestionIndex = 0;
    var currentSectionIndex = 0;
    var quizData = [];
    var clickPosition = null;  // Variable to store the click position
  

    fetch("questions.json")  // Update the file path as necessary
        .then(response => response.json())
        .then(data => {
            quizData = data.quizData;
            displayQuestion(currentSectionIndex, currentQuestionIndex);
            drawTriangle(quizData[currentSectionIndex].section, quizData[currentSectionIndex]["trade-offs"]);
        })
        .catch(error => {
            console.error('Error loading the quiz data:', error);
        });

        function pointInTriangle(px, py, v1, v2, v3) {
            var d1, d2, d3;
            var has_neg, has_pos;
    
            function sign(p1, p2, p3) {
                return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1]);
            }
    
            d1 = sign([px, py], v1, v2);
            d2 = sign([px, py], v2, v3);
            d3 = sign([px, py], v3, v1);
    
            has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
            has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);
    
            return !(has_neg && has_pos);
        }
    
        canvas.addEventListener('click', function(event) {
            var rect = canvas.getBoundingClientRect();
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;
        
            var vertices = getTriangleVertices();
            if (pointInTriangle(x, y, vertices[0], vertices[1], vertices[2])) {
                console.log('Clicked inside the triangle');
                // Clear previous content and redraw the triangle
                context.clearRect(0, 0, canvas.width, canvas.height);
                drawTriangle(quizData[currentSectionIndex].section, quizData[currentSectionIndex]["trade-offs"]);
                drawMark(x, y);  // Draw the new mark
            }
        });
        
        function drawMark(x, y) {
            var radius = 5;  // Radius of the circle mark
            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI, false);
            context.fillStyle = 'red';  // Color of the mark
            context.fill();
            context.lineWidth = 1;
            context.strokeStyle = '#003300';
            context.stroke();
        }
        
    
        canvas.addEventListener('mousemove', function(event) {
            var rect = canvas.getBoundingClientRect();
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;
    
            var vertices = getTriangleVertices();
            if (pointInTriangle(x, y, vertices[0], vertices[1], vertices[2])) {
                canvas.style.cursor = 'pointer';
            } else {
                canvas.style.cursor = 'default';
            }
        });
    
        function getTriangleVertices() {
            var triangleSize = 400;
            var centerX = canvas.width / 2;
            var centerY = canvas.height / 2;
            var height = Math.sqrt(3) * triangleSize / 2;
            return [
                [centerX - triangleSize / 2, centerY + height / 2], // Vertex A (Left vertex)
                [centerX + triangleSize / 2, centerY + height / 2], // Vertex B (Right vertex)
                [centerX, centerY - height / 2] // Vertex C (Top vertex)
            ];
        }

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
        drawTriangle(quizData[sectionIndex].section, quizData[sectionIndex]["trade-offs"]);
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
    function drawTriangle(section, tradeOffs) {
        var triangleSize = 400;
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;
        var height = Math.sqrt(3) * triangleSize / 2;
    
        var vertices = [
            [centerX - triangleSize / 2, centerY + height / 2], // Vertex A (Left vertex)
            [centerX + triangleSize / 2, centerY + height / 2], // Vertex B (Right vertex)
            [centerX, centerY - height / 2] // Vertex C (Top vertex)
        ];
    
        var centroidX = (vertices[0][0] + vertices[1][0] + vertices[2][0]) / 3;
        var centroidY = (vertices[0][1] + vertices[1][1] + vertices[2][1]) / 3;
    
        // Calculate midpoints of each side of the triangle
        var midpoints = [
            [(vertices[0][0] + vertices[1][0]) / 2, (vertices[0][1] + vertices[1][1]) / 2], // Midpoint of side AB
            [(vertices[1][0] + vertices[2][0]) / 2, (vertices[1][1] + vertices[2][1]) / 2], // Midpoint of side BC
            [(vertices[2][0] + vertices[0][0]) / 2, (vertices[2][1] + vertices[0][1]) / 2] // Midpoint of side CA
        ];
    
        // Calculate midpoints from vertices to the centroid
        var centroidToVerticesMidpoints = [
            [(vertices[0][0] + centroidX) / 2, (vertices[0][1] + centroidY) / 2],
            [(vertices[1][0] + centroidX) / 2, (vertices[1][1] + centroidY) / 2],
            [(vertices[2][0] + centroidX) / 2, (vertices[2][1] + centroidY) / 2]
        ];
    
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Set the styles for the triangle
        context.strokeStyle = 'black';
        context.fillStyle = 'black';
        context.lineWidth = 2;
    
        // Draw the main triangle
        context.beginPath();
        context.moveTo(vertices[0][0], vertices[0][1]);
        context.lineTo(vertices[1][0], vertices[1][1]);
        context.lineTo(vertices[2][0], vertices[2][1]);
        context.closePath();
        context.stroke();
    
        // Draw the section text aligned with the top vertex, spaced further
        context.font = "20px Arial";
        context.textAlign = 'center'; // Center the text horizontally
        context.fillText(section, vertices[2][0], vertices[2][1] - 38); // Draw section name above the top vertex
    
        // Draw trade-off labels on each vertex
        context.font = "16px Arial"; // Smaller font for trade-offs
        context.fillText(tradeOffs[2], vertices[0][0], vertices[0][1] + 30); // Left vertex, adjust y-coordinate for visibility below the vertex
        context.fillText(tradeOffs[1], vertices[1][0], vertices[1][1] + 30); // Right vertex, adjust y-coordinate for visibility below the vertex
        context.fillText(tradeOffs[0], vertices[2][0], vertices[2][1] - 10); // Top vertex, adjust y-coordinate to place text above section
    
        // Draw segments from vertices to centroid
        vertices.forEach((vertex, i) => {
            context.beginPath();
            context.moveTo(vertex[0], vertex[1]);
            context.lineTo(centroidX, centroidY);
            context.stroke();
        });
    
        // Draw segments from midpoints of sides to midpoints of lines from vertices to centroid
        midpoints.forEach((midpoint, i) => {
            context.beginPath();
            context.moveTo(midpoint[0], midpoint[1]);
            context.lineTo(centroidToVerticesMidpoints[i][0], centroidToVerticesMidpoints[i][1]);
            context.stroke();
    
            // Also connect midpoints to the next centroid midpoint in sequence (creating a criss-cross pattern)
            let nextIndex = (i + 1) % 3;
            context.beginPath();
            context.moveTo(midpoint[0], midpoint[1]);
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
