
////////////////////////////////////////////////////////////

// Loads the data
d3.csv("https://raw.githubusercontent.com/Sayalinale/car_sales/main/norway_new_car_sales_by_make.csv")
    .then(function (data) {
        // get unique years and makes
        const years = [...new Set(data.map(d => d.Year))];
        const makes = [...new Set(data.map(d => d.Make))];

        // sets the dimensions  of the graph
        var cellSize = 20;
        const margin = { top: 50, right: 50, bottom: 50, left: 50 };
        var width = margin.left + margin.right + makes.length * cellSize;
        var height = margin.top + margin.bottom + years.length * cellSize;

        // append the svg object to the body of the page
        const svg = d3.select("#heatmap")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // create an array of objects that contains the quantity for each year and make combination
        const quantities = years.map(y => makes.map(m => {
            const match = data.find(d => d.Year === y && d.Make === m);
            return match ? match.Quantity : 0;
        }));

        // create a color scale for the heatmap
        const colorScale = d3.scaleLinear()
            .domain([0, d3.max(quantities.flat())])
            .range(['#d7fbe8', '#9df3c4', '#60ebb0', '#62d2a2', '#87cbb9', '#c9a0cd', '#dcb4dd', '#dfbde3', '#e3c5ea', '#e7cee0'
            ]);

        // create scales for the x-axis and y-axis
        var xScale = d3.scaleBand()
            .domain(makes)
            .range([0, makes.length * cellSize])
            .padding(0.2);

        const yScale = d3.scaleBand()
            .domain(years)
            .range([height, 0])
            .padding(0.2);

        // create a cell for each year/make combination
        const cells = svg.selectAll(".cell")
            .data(quantities)
            .enter()
            .append("g")
            .attr("class", "row")
            .attr("transform", (d, i) => `translate(0,${yScale(years[i])})`);

        cells.selectAll(".cell")
            .data(d => d)
            .enter()
            .append("rect")
            .attr("class", "cell")
            .attr("x", (d, i) => xScale(makes[i]))
            .attr("y", 0)
            .attr("width", xScale.bandwidth())
            .attr("height", yScale.bandwidth())
            .attr("fill", d => colorScale(d))
            .on("mouseover", (event, d) => {
                // get the position of the cell
                const x = event.pageX;
                const y = event.pageY;

                // show a tooltip with the quantity
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 1);

                tooltip.select("rect")
                    .attr("x", x - 30)
                    .attr("y", y - 50);

                tooltip.select("text")
                    .attr("x", x - 15)
                    .attr("y", y - 35)
                    .text(d);
            })
            .on("mouseout", () => {
                // hide the tooltip
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0);
            });

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-40)");


        // add y-axis
        svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(yScale));


        // add x-axis label
        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + 40)
            .text("Name of the manufacturer brand");


        // add y-axis label
        svg.append("text")
            .attr("class", "y-axis-label")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -40)
            .text("Year");

        // add tooltip
        const tooltip = svg.append("g")
            .attr("class", "tooltip")
            .style("opacity", 0);

        tooltip.append("rect")
            .attr("width", 60)
            .attr("height", 30)
            .attr("fill", "#fff")
            .attr("stroke", "#000");

        tooltip.append("text")
            .attr("x", 25)
            .attr("y", 15);
    }).catch(function (error) {
        console.log(error);
    });

///////////////////////////////////////////////////////////////

// Load the data
d3.csv("https://raw.githubusercontent.com/Sayalinale/car_sales/main/norway_new_car_sales_by_model.csv")
    .then(function (data) {
        var makePct = d3.rollup(data, v => d3.sum(v, d => d.Pct), d => d.Make);
        // Create an array of objects representing the word cloud data
        console.log(makePct)
        var wordData = [];
        makePct.forEach((value, key) => {
            wordData.push({ text: key, size: value * 0.1 });
        });

        // Generate random colors for each object
        wordData.forEach(function (d) {
            d.color = d3.rgb(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256));
        });
        console.log(wordData)
        // Define the word cloud layout
        var layout = d3.layout.cloud()
            .size([800, 500])
            .words(wordData)
            .padding(5)
            .rotate(() => ~~(Math.random() * 2) * 90)
            .fontSize(d => d.size)
            .on("end", draw);

        // Render the word cloud
        layout.start();

        // Draw the word cloud
        function draw(words) {
            d3.select("#word_cloud")
                .append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("viewBox", "150 150 800 300")
                .attr("preserveAspectRatio", "xMidYMid meet")
                .append("g")
                .attr("transform", "translate(570,250)")
                .selectAll("text")
                .data(words)
                .join("text")
                .attr("class", "word") // add the "word" class
                .style("font-size", function (d) {
                    // Define different font sizes for different ranges of word count sizes
                    if (d.size < 10) {
                        return "20px";
                    } else if (d.size < 20) {
                        return "25px";
                    } else if (d.size < 30) {
                        return "30px";
                    } else if (d.size < 40) {
                        return "35px";
                    } else {
                        return "40px";
                    }
                })

                .style("fill", d => d.color)
                .attr("text-anchor", "middle")
                .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
                .text(d => d.text)
                .append("title") // add a title element
                .text(d => d.size.toFixed(4)) // set the title text to the size of the word count
                .on("mouseover", function (d) {
                    // set the title attribute to the decorated size of the word count
                    d3.select(this).attr("title", "<tspan style='font-weight: bold;'>Size:</tspan> " + "<tspan style='font-style: italic;'>" + d.size.toFixed(4) + "</tspan>");
                });



        }

    })
    .catch(function (error) {
        console.log(error);
    });


//////////////////////////////////////////////////////////////// 

// Load The Data
d3.csv("https://raw.githubusercontent.com/Sayalinale/car_sales/main/norway_car_sales_by_total.csv")
    .then(function (data) {
        console.log(data);

        var width1 = 700;
        var height1 = 450;
        var innerRadius = 100;
        var outerRadius = 150;
        const circularBarChart = d3.select("#thecircularBarGraph")
            .append("svg")
            .attr("width", width1)
            .attr("height", height1)
            .append("g")
            .attr("transform", "translate(230,240)");

        // common for 2 data is x-axis
        var x = d3.scaleBand().range([0, 2 * Math.PI])// X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
            .domain(data.map(d => d.Year));

        // outer Circle scale y
        var yCo2 = d3.scaleRadial()
            .range([innerRadius, outerRadius]) // Domain will be define later.
            .domain([1000, 150000]);

        //  Scales for second barplot
        const yco2count = d3.scaleRadial()
            .range([innerRadius, 5])// Domain will be defined later.
            .domain([50, 2000]);


        // Add the bars for for the circle
        circularBarChart.append("g")
            .selectAll("path")
            .data(data)
            .join("path")
            .attr("fill", "#84bd00")
            .attr("class", "yo")
            .attr("d", d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(d => yCo2(d["Total_quantity"]))
                .startAngle(d => x(d.Year))
                .endAngle(d => x(d.Year) + x.bandwidth())
                .padAngle(0.04)
                .padRadius(innerRadius))
            .on("mouseover", function (event, d) {
                d3.select(this)
                    .style("stroke", "blac#00468ak")
                    .style("opacity", 0.7)
            })

            .on("mouseleave", function (event, d) {
                d3.select(this)
                    .style("stroke", "none")
                    .style("opacity", 1)
            })
            .on("click", function (event, d) {
                console.log(d);
                const YerasName = d.Year;
                const CouyQuantitu = d.Total_quantity;
                const amountCo2 = d.Toatal_AvgCO2;
                //    updateStackChart(YerasName);
                showCount(CouyQuantitu, amountCo2);
            });






        // Add the labels for the graph
        circularBarChart.append("g")
            .selectAll("g")
            .data(data)
            .join("g")
            .attr("text-anchor", function (d) { return (x(d.Year) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
            .attr("transform", function (d) { return "rotate(" + ((x(d.Year) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (yCo2(d['Total_quantity']) + 10) + ",0)"; })
            .append("text")
            .text(d => d.Year)
            .attr("transform", function (d) { return (x(d.Year) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
            .style("font-size", "13px")
            .attr("alignment-baseline", "middle")
            .style("font-weight", "bold")


        // Data for the outer graph
        circularBarChart.append("g")
            .selectAll("path")
            .data(data)
            .join("path")
            .attr("fill", "#f9584b")
            .attr("d", d3.arc()
                .innerRadius(d => yco2count(0))
                .outerRadius(d => yco2count(d['Toatal_AvgCO2']))
                .startAngle(d => x(d.Year))
                .endAngle(d => x(d.Year) + x.bandwidth())
                .padAngle(0.04)
                .padRadius(innerRadius))
            .on("mouseover", function (event, d) {
                d3.select(this)
                    .style("stroke", "#00468a")
                    .style("opacity", 0.7)
            })

            .on("mouseleave", function (event, d) {
                d3.select(this)
                    .style("stroke", "none")
                    .style("opacity", 1)
                    .on("click", function (event, d) {
                        const YerasName = d.Year;
                        const CouyQuantitu = d.Total_quantity;
                        const amountCo2 = d.Toatal_AvgCO2;
                        //    updateStackChart(YerasName);
                        showCount(CouyQuantitu, amountCo2);
                    })
            })


        var g = circularBarChart.append("g")
            .attr("transform", "translate(-300,-330)");
        var legendData = ["Total number of units sold", "Average CO2 emission of all cars sold (in g/km)"];
        var legendColor = d3.scaleOrdinal().domain(legendData)
            .range(["#84bd00", "#f9584b"]);

        // It will add the title for the scale
        g.selectAll("legends")
            .data(legendData).enter()
            .append('circle')
            .attr("cx", 70)
            .attr("cy", function (d, i) { return 100 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 7)
            .style("fill", function (d) { return legendColor(d) });

        // It add the bullet point
        g.selectAll("mylabels").data(legendData)
            .enter()
            .append("text")
            .attr("x", 80)
            .attr("y", function (d, i) { return 100 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function (d) { return legendColor(d) })
            .text(function (d) { return d })
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle");


        function showCount(CouyQuantitu, sCramountCo2ime) {
            circularBarChart.append("rect")
                .attr("x", 110)
                .attr("y", -240)
                .attr("width", 120)
                .attr("height", 50)
                .style("fill", "#1fab89")
                .style("stroke", "#000")
                .style("border-radius", "50%");
            circularBarChart.append("text")
                .attr("text-anchor", "middle")
                .attr("x", 150)
                .attr("y", -220)
                .text(CouyQuantitu)
                .style("fill", "#fff");
            circularBarChart.append("rect")
                .attr("x", 50)
                .attr("y", -280)
                .attr("width", 100)
                .attr("height", 30)
                .style("fill", "#1fab89")
                .style("stroke", "#000")
                .style("border-radius", "50%");
            circularBarChart.append("text")
                .attr("text-anchor", "end")
                .attr("x", 80)
                .attr("y", -260)
                .text(sCramountCo2ime)
                .attr("text-anchor", "start");

        }


    });
//////////////////////////////////////////////////////////////////////////
// Read the CSV data and create the resultArray
d3.csv("https://raw.githubusercontent.com/Sayalinale/car_sales/main/norway_new_car_sales_by_month.csv")
    .then(function (data) {
        var yearSums = {};
        data.forEach(function (d) {
            var year = d.Year;
            var quantity = parseInt(d.Quantity);
            if (yearSums[year]) {
                yearSums[year] += quantity;
            } else {
                yearSums[year] = quantity;
            }
        });
        var resultArray = [];
        for (var year in yearSums) {
            resultArray.push({ Year: year, Quantity: yearSums[year] });
        }

        //It  Defines the chart dimensions
        var margin = { top: 20, right: 70, bottom: 30, left: 150 },
            width = 500 - margin.left - margin.right,
            height = 350 - margin.top - margin.bottom;

        // Create the SVG element
        var svg = d3.select("#linecahet")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Defines the scales and axis
        var x = d3.scaleBand().range([0, width]).padding(0.1);
        var y = d3.scaleLinear().range([height, 0]);
        x.domain(resultArray.map(function (d) { return d.Year; }));
        y.domain([0, d3.max(resultArray, function (d) { return d.Quantity; })]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add the dots to the chart
        // Add the data points to the chart
        svg.selectAll(".dot")
            .data(resultArray)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", function (d) { return x(d.Year) + x.bandwidth() / 2; })
            .attr("cy", function (d) { return y(d.Quantity); })
            .attr("r", 5)
            .on('click', function (event, d) {
                // console.log(d);
                const yearName = d.Year;
                //console.log(yearName);
                updatevis(yearName);

            })
            .on("mouseover", function (event, d) {
                // Show the tooltip
                d3.select(this).attr("r", 8);
                var tooltip = d3.select("#tooltip")
                    .style("left", event.pageX + "px")
                    .style("top", event.pageY + "px");
                tooltip.select("#value").text(d.Quantity);
                tooltip.classed("hidden", false);
            })
            .on("mouseout", function () {
                // Hide the tooltip
                d3.select(this).attr("r", 5);
                d3.select("#tooltip").classed("hidden", true);
            })


        // Add the line to the chart
        svg.append("path")
            .datum(resultArray)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function (d) { return x(d.Year) + x.bandwidth() / 2; })
                .y(function (d) { return y(d.Quantity); })
                .curve(d3.curveLinear)
            );



        // add x-axis label
        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + 30)
            .text("Years");


        // add y-axis label
        svg.append("text")
            .attr("class", "y-axis-label")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 25)
            .text("Number of Cars Sold");






        // Function that updates the graph based on the selected year
        function updatevis(yearName) {
            d3.select(".bar").remove();

            var svg = d3.select("#barchart").append("svg").attr("width", 600).attr("height", 600).attr("class", "bar");

            // Load the data from the URL
            d3.csv('https://raw.githubusercontent.com/Sayalinale/car_sales/main/norway_new_car_sales_by_month.csv').then(data => {

                // Create a nested data structure that groups by year and month
                const nestedData = d3.rollup(data,
                    v => d3.sum(v, d => d.Quantity),
                    d => [d.Year, d.Month]
                );

                // Convert the nested data to an array of objects
                const dataArray = Array.from(nestedData, ([key, value]) => {
                    const [year, month] = key;
                    return { year, month, quantity: value };
                });

                console.log(dataArray)

                // Filter the data to include only the selected year
                const filteredData = dataArray.filter(d => d.year === yearName);
                console.log(filteredData)

                // Update the domain of the X and Y scales based on the filtered data


                // Update the domain of the X and Y scales based on the filtered data
                const xScale = d3.scaleBand().range([0, 500]).domain(filteredData.map(d => d.month)).padding(0.3);
                const yScale = d3.scaleLinear().range([0, 500]).domain([d3.max(filteredData, d => d.quantity), 0]);

                // Update the X and Y axes
                const xAxis = d3.axisBottom(xScale);
                const yAxis = d3.axisLeft(yScale);




                // Append the X and Y labels
                svg.append("text")
                    .attr("transform", "translate(300, 550)")
                    .style("text-anchor", "middle")
                    .text("Month");

                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 30)
                    .attr("x", -250)
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text("Number of sold cars");
                svg.append("g")
                    .attr('transform', 'translate(50,500)')
                    .call(xAxis);
                svg.append("g")
                    .attr('transform', 'translate(50,0)')
                    .call(yAxis);



                svg.append("g")
                    .attr('transform', 'translate(50,0)')
                    .selectAll(".bar")
                    .data(filteredData)
                    .enter()
                    .append("rect")
                    // .attr("class", "bar")
                    .attr("x", d => xScale(d.month))
                    .attr("y", d => yScale(d.quantity))
                    .attr("width", xScale.bandwidth())
                    .attr("height", d => 500 - yScale(d.quantity))
                    .attr("fill", "#96DED1")









            });
        }






    });


