// script.js
document.addEventListener("DOMContentLoaded", function() {
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    var triangleText = document.getElementById("triangleText");

    // Define the coordinates of the equilateral triangle's vertices
    var triangleSize = 400;
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var height = Math.sqrt(3) * triangleSize / 2;

    var vertices = [
        [centerX - triangleSize / 2, centerY + height / 2], // Vertex A
        [centerX + triangleSize / 2, centerY + height / 2], // Vertex B
        [centerX, centerY - height / 2] // Vertex C
    ];

    // Calculate centroid coordinates
    var centroidX = (vertices[0][0] + vertices[1][0] + vertices[2][0]) / 3;
    var centroidY = (vertices[0][1] + vertices[1][1] + vertices[2][1]) / 3;

    // Calculate midpoints of each side
    var midpoints = [
        [(vertices[0][0] + vertices[1][0]) / 2, (vertices[0][1] + vertices[1][1]) / 2], // Midpoint of side AB
        [(vertices[1][0] + vertices[2][0]) / 2, (vertices[1][1] + vertices[2][1]) / 2], // Midpoint of side BC
        [(vertices[2][0] + vertices[0][0]) / 2, (vertices[2][1] + vertices[0][1]) / 2] // Midpoint of side CA
    ];

    // Calculate midpoints between vertices and centroid
    var centroidToMidpoints = [
        [(vertices[0][0] + centroidX) / 2, (vertices[0][1] + centroidY) / 2], // Midpoint between A and centroid
        [(vertices[1][0] + centroidX) / 2, (vertices[1][1] + centroidY) / 2], // Midpoint between B and centroid
        [(vertices[2][0] + centroidX) / 2, (vertices[2][1] + centroidY) / 2] // Midpoint between C and centroid
    ];

    // Calculate the radius of the concentric circle at the centroid
    var radius = Math.sqrt(triangleSize * height / (21 * Math.PI));

    function drawTriangle() {
        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the equilateral triangle
        context.beginPath();
        context.moveTo(vertices[0][0], vertices[0][1]);
        context.lineTo(vertices[1][0], vertices[1][1]);
        context.lineTo(vertices[2][0], vertices[2][1]);
        context.closePath();
        context.stroke();

        // Draw segments from vertices to centroid
        context.beginPath();
        context.moveTo(vertices[0][0], vertices[0][1]);
        context.lineTo(centroidX, centroidY);
        context.moveTo(vertices[1][0], vertices[1][1]);
        context.lineTo(centroidX, centroidY);
        context.moveTo(vertices[2][0], vertices[2][1]);
        context.lineTo(centroidX, centroidY);
        context.stroke();

        // Draw segments from centroid to midpoints
        context.beginPath();
        context.moveTo(centroidX, centroidY);
        context.lineTo(midpoints[0][0], midpoints[0][1]);
        context.moveTo(centroidX, centroidY);
        context.lineTo(midpoints[1][0], midpoints[1][1]);
        context.moveTo(centroidX, centroidY);
        context.lineTo(midpoints[2][0], midpoints[2][1]);
        context.stroke();

        // Draw segments from midpoint of outer sides to midpoint of segments from centroid to vertices
        context.beginPath();
        context.moveTo(midpoints[0][0], midpoints[0][1]);
        context.lineTo(centroidToMidpoints[0][0], centroidToMidpoints[0][1]);
        context.moveTo(midpoints[0][0], midpoints[0][1]);
        context.lineTo(centroidToMidpoints[1][0], centroidToMidpoints[1][1]);
        context.moveTo(midpoints[1][0], midpoints[1][1]);
        context.lineTo(centroidToMidpoints[1][0], centroidToMidpoints[1][1]);
        context.moveTo(midpoints[1][0], midpoints[1][1]);
        context.lineTo(centroidToMidpoints[2][0], centroidToMidpoints[2][1]);
        context.moveTo(midpoints[2][0], midpoints[2][1]);
        context.lineTo(centroidToMidpoints[2][0], centroidToMidpoints[2][1]);
        context.moveTo(midpoints[2][0], midpoints[2][1]);
        context.lineTo(centroidToMidpoints[0][0], centroidToMidpoints[0][1]);
        context.stroke();

        // Draw the concentric circle at the centroid
        context.beginPath();
        context.arc(centroidX, centroidY, radius, 0, 2 * Math.PI);
        context.stroke();

        // Add text to vertices
        context.font = "12px Arial";
        context.fillStyle = "black";
        context.fillText("El costo de mis fuentes de datos es menor al beneficio que obtengo por tenerlas", vertices[0][0] - 210, vertices[0][1] + 30);
        context.fillText("Considero que la información obtenida de mis fuentes de datos es confiables", vertices[1][0] - 130, vertices[1][1] + 20);
        context.fillText("El tiempo en el que se recopilan y procesan los datos me permite tomar decisiones oportunas", vertices[2][0] - 180, vertices[2][1] - 20);
    }

    drawTriangle();

    // Button event listener to choose a random point inside the triangle
    var button = document.getElementById("btn");
    button.addEventListener("click", function() {
        drawTriangle(); // Redraw the triangle to clear the previous random point

        var randomX, randomY, randomPoint;

        do {
            randomX = Math.random() * triangleSize - triangleSize / 2 + centerX;
            randomY = Math.random() * height + (centerY - height / 2);
            randomPoint = [randomX, randomY];
        } while (!isInsideTriangle(randomPoint, vertices));

        // Draw the new random point
        context.beginPath();
        context.arc(randomX, randomY, 5, 0, 2 * Math.PI);
        context.fillStyle = "red";
        context.fill();
        context.stroke();

        // Determine which triangle the point is in and display text
        var text = determineTriangle(randomX, randomY, vertices, midpoints, centroidToMidpoints, centroidX, centroidY, radius);
        triangleText.textContent = text;
    });

    function isInsideTriangle(point, vertices) {
        var x = point[0], y = point[1];
        var x1 = vertices[0][0], y1 = vertices[0][1];
        var x2 = vertices[1][0], y2 = vertices[1][1];
        var x3 = vertices[2][0], y3 = vertices[2][1];

        var d1 = sign(point, [x1, y1], [x2, y2]);
        var d2 = sign(point, [x2, y2], [x3, y3]);
        var d3 = sign(point, [x3, y3], [x1, y1]);

        var has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
        var has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);

        return !(has_neg && has_pos);
    }

    function sign(p1, p2, p3) {
        return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1]);
    }

    function determineTriangle(x, y, vertices, midpoints, centroidToMidpoints, centroidX, centroidY, radius) {
        // Check if the point is inside the concentric circle
        var distToCentroid = Math.sqrt(Math.pow(x - centroidX, 2) + Math.pow(y - centroidY, 2));
        if (distToCentroid < radius) {
            return "Point is inside the concentric circle (C)";
        }

        // Define triangles based on the provided image
        var triangles = [
            [vertices[0], centroidToMidpoints[0], midpoints[0]], // 1
            [vertices[0], midpoints[0], centroidToMidpoints[1], vertices[1]], // 2
            [centroidToMidpoints[0], midpoints[0], centroidToMidpoints[1]], // 3
            [vertices[1], centroidToMidpoints[1], midpoints[1]], // 4
            [vertices[1], midpoints[1], centroidToMidpoints[2]], // 5
            [centroidToMidpoints[1], midpoints[1], centroidToMidpoints[2]], // 6
            [vertices[2], centroidToMidpoints[2], midpoints[2]], // 7
            [vertices[2], midpoints[2], centroidToMidpoints[0]], // 8
            [centroidToMidpoints[2], midpoints[2], centroidToMidpoints[0]], // 9
            [centroidToMidpoints[0], centroidToMidpoints[1], centroidX, centroidY], // 10
            [centroidToMidpoints[1], centroidToMidpoints[2], centroidX, centroidY], // 11
            [centroidToMidpoints[2], centroidToMidpoints[0], centroidX, centroidY] // 12
        ];

        var labels = [
            "Point is inside triangle 1",
            "Point is inside triangle 2",
            "Point is inside triangle 3",
            "Point is inside triangle 4",
            "Point is inside triangle 5",
            "Point is inside triangle 6",
            "Point is inside triangle 7",
            "Point is inside triangle 8",
            "Point is inside triangle 9",
            "Point is inside triangle 10",
            "Point is inside triangle 11",
            "Point is inside triangle 12"
        ];

        for (var i = 0; i < triangles.length; i++) {
            if (isInsideTriangle([x, y], triangles[i])) {
                return labels[i];
            }
        }

        return "Point is outside all triangles";
    }
});
