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
  

    fetch("data_narrative.json")  // Update the file path as necessary
        .then(response => response.json())
        .then(data => {
            quizData = data.quizData;
            
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
            var midpoints = calculateMidpoints(vertices);
            var centroid = calculateCentroid(vertices);
            var subTriangles = defineSubTriangles(vertices, midpoints, centroid);
            var radius = Math.sqrt(400 * Math.sqrt(3) * 400 / 2 / (21 * Math.PI)); // Triangle size hardcoded for simplicity
        
            // Check for click within the concentric circle at the centroid
            if (Math.sqrt((x - centroid[0]) ** 2 + (y - centroid[1]) ** 2) <= radius) {
                console.log('Clicked inside the concentric circle at the centroid');
                displayCircleText();
                return; // Prevent further text from being displayed if inside the circle
            }
        
            let clickedInSubTriangle = false;
        
            // Check if click is within any sub-triangle and display relevant text
            subTriangles.forEach((triangle, index) => {
                if (pointInTriangle(x, y, triangle[0], triangle[1], triangle[2])) {
                    console.log('Clicked inside sub-triangle ' + (index + 1));
                    displayTriangleText(index + 1);
                    clickedInSubTriangle = true;
                }
            });
        
            // Main triangle click check
            if (pointInTriangle(x, y, vertices[0], vertices[1], vertices[2])) {
                console.log('Clicked inside the main triangle');
        
                // Clear previous content and redraw the triangle
                context.clearRect(0, 0, canvas.width, canvas.height);
                drawTriangle(quizData[currentSectionIndex].section, quizData[currentSectionIndex]["trade-offs"]);
        
                // Draw the mark irrespective of sub-triangle click
                drawMark(x, y);
            }
        });

        function displayCircleText() {
            triangleText.innerHTML = "Text for clicks inside the concentric circle at the centroid";
        }
        
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

        function displayTriangleText(triangleNumber) {
            var textMappings = {
                1: "Text for triangle 1",
                2: "Text for triangle 2",
                3: "Text for triangle 3",
                4: "Text for triangle 4",
                5: "Text for triangle 5",
                6: "Text for triangle 6",
                7: "Text for triangle 7",
                8: "Text for triangle 8",
                9: "Text for triangle 9",
                10: "Text for triangle 10",
                11: "Text for triangle 11",
                12: "Text for triangle 12"
            };
        
            triangleText.innerHTML = textMappings[triangleNumber];
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

        function calculateMidpoints(vertices) {
            return [
                [(vertices[0][0] + vertices[1][0]) / 2, (vertices[0][1] + vertices[1][1]) / 2],
                [(vertices[1][0] + vertices[2][0]) / 2, (vertices[1][1] + vertices[2][1]) / 2],
                [(vertices[2][0] + vertices[0][0]) / 2, (vertices[2][1] + vertices[0][1]) / 2]
            ];
        }
        
        function calculateCentroid(vertices) {
            return [
                (vertices[0][0] + vertices[1][0] + vertices[2][0]) / 3,
                (vertices[0][1] + vertices[1][1] + vertices[2][1]) / 3
            ];
        }

        function defineSubTriangles(vertices, midpoints, centroid) {
            var triangles = [];
            // Centroid to vertices midpoints
            var cvMidpoints = [
                [(vertices[0][0] + centroid[0]) / 2, (vertices[0][1] + centroid[1]) / 2],
                [(vertices[1][0] + centroid[0]) / 2, (vertices[1][1] + centroid[1]) / 2],
                [(vertices[2][0] + centroid[0]) / 2, (vertices[2][1] + centroid[1]) / 2]
            ];
        
            // Triangle 1-3: Around each vertex, connecting to centroid and nearest side midpoints
            triangles.push([vertices[0], midpoints[0], cvMidpoints[0]]); // Triangle around vertex A
            triangles.push([vertices[1], midpoints[1], cvMidpoints[1]]); // Triangle around vertex B
            triangles.push([vertices[2], midpoints[2], cvMidpoints[2]]); // Triangle around vertex C
        
            // Triangle 4-6: Connecting vertex, side midpoint to adjacent vertex midpoint on line to centroid
            triangles.push([vertices[0], cvMidpoints[0], midpoints[2]]); // Triangle using Vertex A, Midpoint CA, and midpoint from A to centroid
            triangles.push([vertices[1], cvMidpoints[1], midpoints[0]]); // Triangle using Vertex B, Midpoint AB, and midpoint from B to centroid
            triangles.push([vertices[2], cvMidpoints[2], midpoints[1]]); // Triangle using Vertex C, Midpoint BC, and midpoint from C to centroid
        
            // Triangle 7-9: Formed by side midpoints, vertex to centroid midpoints, and centroid
            triangles.push([midpoints[0], cvMidpoints[0], centroid]); // Triangle M_AB, C_A, Centroid
            triangles.push([midpoints[1], cvMidpoints[1], centroid]); // Triangle M_BC, C_B, Centroid
            triangles.push([midpoints[2], cvMidpoints[2], centroid]); // Triangle M_CA, C_C, Centroid
        
            // Triangle 10-12: Alternate midpoints forming triangles with the centroid
            triangles.push([midpoints[0], cvMidpoints[1], centroid]); // Triangle M_AB, C_B, Centroid
            triangles.push([midpoints[1], cvMidpoints[2], centroid]); // Triangle M_BC, C_C, Centroid
            triangles.push([midpoints[2], cvMidpoints[0], centroid]); // Triangle M_CA, C_A, Centroid
        
            return triangles;
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

