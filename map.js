// #region SETUP
d3.select("#main")
    .append("h1")
    .text("Availability of Innovative Voter Registration Methods, 2000-2024")

var yearList = [
    {option: "All Years",
        index: 0,
        years: [{year: 2000}, {year: 2002}, {year: 2004}, {year: 2006},
            {year: 2008}, {year: 2010}, {year: 2012}, {year: 2014}, {year: 2016}, 
            {year: 2018}, {year: 2020}, {year: 2022}, {year: 2024}, {year: 2026}]},
    {option: "Midterm Years",
        index: 1,
        years: [{year: 2002}, {year: 2006}, {year: 2010},
            {year: 2014}, {year: 2018}, {year: 2022}, {year: 2026}]},
    {option: "Presidential Years",
        index: 2,
        years: [{year: 2000}, {year: 2004}, {year: 2008},
            {year: 2012}, {year: 2016}, {year: 2020}, {year: 2024}]}
]

var width = 1000;
var height = 600;

var svg = d3.select("#main")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("transform", "translate(-500, 0)")

// #endregion

// #region SCALES AND COLOR
var colorScaleMain = d3.scaleOrdinal()
    .domain(["OSA", "O", "A", "S"])
    .range(["#3b9171", "#efc55b", "#ef7f4d", "#9a53b7"])

patterns = svg.append("defs")
    .selectAll("pattern")
    .data([{primary: "OVR", pattern: "AVR"},
        {primary: "AVR", pattern: "SDR"},
        {primary: "SDR", pattern: "OVR"}
    ])
    .enter()
    .append("pattern")
    .attr('id', d => 'pattern-' + d.pattern)
    .attr("width", 2)
    .attr("height", 2)
    .attr('patternUnits',"userSpaceOnUse")
    .attr("patternTransform", "rotate(-45)")

patterns.append("rect")
    .attr("width", 40)
    .attr("height", 40)
    .attr("fill", d => colorScaleMain(d.primary))

patterns.append('rect')
    .attr("width", 1)
    .attr("height", 30)
    .attr("fill", d => colorScaleMain(d.pattern))

var xScale = d3.scaleLinear()
    .domain([2000, 2026])
    .range([270, width-20]);

var colorScale = d3.scaleOrdinal()
    .domain(["N", "S", "O", "A", "OS", "OA", "SA", "OSA"])
    .range(["#bebebe", "#bebebe", "#bebebe", "#bebebe",
        "#bebebe", "#bebebe", "#bebebe", "#bebebe"
    ])

var colorScalePatt = d3.scaleOrdinal()
    .domain(["N", "S", "O", "A", "OS", "OA", "SA", "OSA"])
    .range(["#bebebe", "#bebebe", "#bebebe", "#bebebe",
        "#bebebe", "#bebebe", "#bebebe", "#bebebe"
    ])

function updateColorScale(filter) {
    if (filter == "S") {
        colorScale.range(["#bebebe", "#9a53b7", "#bebebe", "#bebebe",
            "#9a53b7", "#bebebe", "#9a53b7", "#9a53b7"
        ])
    } else if (filter == "O") {
        colorScale.range(["#bebebe", "#bebebe", "#efc55b", "#bebebe",
            "#efc55b", "#efc55b", "#bebebe", "#efc55b"
        ])
    } else if (filter == "A") {
        colorScale.range(["#bebebe", "#bebebe", "#bebebe", "#ef7f4d",
            "#bebebe", "#ef7f4d", "#ef7f4d", "#ef7f4d"
        ])
    } else if (filter == "OS") {
        colorScale.range(["#bebebe", "#9a53b7", "#efc55b", "#bebebe",
            "#efc55b", "#efc55b", "#9a53b7", "#efc55b"
        ])
    } else if (filter == "OA") {
        colorScale.range(["#bebebe", "#bebebe", "#efc55b", "#ef7f4d",
            "#efc55b", "#efc55b", "#ef7f4d", "#efc55b"
        ])
    } else if (filter == "SA") {
        colorScale.range(["#bebebe", "#9a53b7", "#bebebe", "#ef7f4d",
            "#9a53b7", "#ef7f4d", "#ef7f4d", "#ef7f4d"
        ])
    } else if (filter == "OSA") {
        colorScale.range(["#bebebe", "#9a53b7", "#efc55b", "#ef7f4d",
            "#efc55b", "#efc55b", "#ef7f4d", "#3b9171"
        ])
    }
}

function updateColorScalePatt(filter) {
    if (filter == "S") {
        colorScalePatt.range(["#bebebe", "#9a53b7", "#bebebe", "#bebebe",
            "#9a53b7", "#bebebe", "#9a53b7", "#9a53b7"
        ])
    } else if (filter == "O") {
        colorScalePatt.range(["#bebebe", "#bebebe", "#efc55b", "#bebebe",
            "#efc55b", "#efc55b", "#bebebe", "#efc55b"
        ])
    } else if (filter == "A") {
        colorScalePatt.range(["#bebebe", "#bebebe", "#bebebe", "#ef7f4d",
            "#bebebe", "#ef7f4d", "#ef7f4d", "#ef7f4d"
        ])
    } else if (filter == "OS") {
        colorScalePatt.range(["#bebebe", "#9a53b7", "#efc55b", "#bebebe",
            "#9a53b7", "#efc55b", "#9a53b7", "#9a53b7"
        ])
    } else if (filter == "OA") {
        colorScalePatt.range(["#bebebe", "#bebebe", "#efc55b", "#ef7f4d",
            "#efc55b", "#ef7f4d", "#ef7f4d", "#ef7f4d"
        ])
    } else if (filter == "SA") {
        colorScalePatt.range(["#bebebe", "#9a53b7", "#bebebe", "#ef7f4d",
            "#9a53b7", "#ef7f4d", "#9a53b7", "#9a53b7"
        ])
    } else if (filter == "OSA") {
        colorScalePatt.range(["#bebebe", "#9a53b7", "#efc55b", "#ef7f4d",
            "#9a53b7", "#ef7f4d", "#9a53b7", "#3b9171"
        ])
    }
}


// #endregion

// #region SELECTION MENU

var selectionBarSelected = false;
var selectionIndex = 0;

var selectionContainer = svg.append("g")
    .attr("id", "selection-container")

var selectionBar = selectionContainer.append("rect")
    .attr("width", 150)
    .attr("height", 25)
    .attr("x", 2)
    .attr("y", 10)
    .attr("fill", "#ebebeb")
    .on("mouseover", function() {
        d3.select(this)
            .style("stroke", "#243a76")
            .style("stroke-width", 0.7)
            .style("cursor", "pointer");
    })
    .on("mouseout", function() {
        d3.select(this)
            .style("stroke-width", 0);
    })
    .on("click", function() {
        if (!selectionBarSelected) {
            selections.attr("opacity", 1)
            selectionsText.attr("opacity", 1)
            selectionBarSelected = true;
        } else {
            selections.attr("opacity", 0)
            selectionsText.attr("opacity", 0)
            selectionBarSelected = false;
        }
    })

var selectionBarText = selectionContainer.append("text")
    .text("All Years")
    .attr("fill", "black")
    .attr("x", 10)
    .attr("y", 27)

var selectionOptions = selectionContainer.append("g")
    .attr("id", "selection-options")

var selections = selectionOptions
    .selectAll("rect")
    .data(yearList)
    .enter()
    .append("rect")
    .attr("width", 150)
    .attr("height", 25)
    .attr("x", 2)
    .attr("y", (d, i) => (i + 1) * 25 + 10)
    .attr("fill", "#ebebeb")
    .attr("opacity", 0)
    .on("mouseover", function() {
        if (selectionBarSelected) {
            d3.select(this)
                .style("stroke", "#243a76")
                .style("stroke-width", 0.7)
                .style("cursor", "pointer");
        }
    })
    .on("mouseout", function() {
        d3.select(this)
            .style("stroke-width", 0);
    })

var selectionsText = selectionOptions
    .selectAll("text")
    .data(yearList)
    .enter()
    .append("text")
    .text(d => d.option)
    .attr("y", (d, i) => (i + 1) * 27 + 27)
    .attr("x", 10)
    .attr("fill", "black")
    .attr("opacity", 0)
    .attr("font-size", "12px")

// #endregion

// #region MAP SELECTION


var colorScaleIndex;

var colorScalesText = [
    {abb: "All", policy: "OSA"},
    {abb: "OVR", policy: "O"},
    {abb: "AVR", policy: "A"},
    {abb: "SDR", policy: "S"}
]


var colorSelection = svg.append("g")
    .attr("id", "color-selection")

var colorOptions = colorSelection.selectAll("rect")
    .data(["OSA", "O", "A", "S"])
    .enter()
    .append("rect")
    .attr("id", d => "option-" + d)
    .attr("width", 20)
    .attr("height", 20)
    .attr("x", 10)
    .attr("y", (d, i) => i * 25 + 200)
    .attr("fill", (d, i) => colorScaleMain(d))
    .attr("opacity", 0.4)
    .on("mouseover", function() {
        d3.select(this)
            .attr("stroke", "#311b6d")
            .attr("stroke-width", 0.7)
            .attr("cursor", "pointer");
    })
    .on("mouseout", function() {
        d3.select(this).attr("stroke-width", 0);
    })

var colorOptionsText = colorSelection.selectAll("text")
    .data(["All", "OVR", "AVR", "SDR"])
    .enter()
    .append("text")
    .attr("x", 35)
    .attr("y", (d, i) => i * 25 + 215)
    .text(d => d)

// #endregion

// #region YEAR TIMELINE BUTTONS
svg.append("g")
    .attr("id", "year-options")
    .append("rect")
        .attr("x", 260)
        .attr("y", 20)
        .attr("width", width - 280)
        .attr("height", 2)
        .attr("fill", "#bebebe")

var midtermYears = d3.select("#year-options")
    .append("g")
    .attr("id", "midterm")
    .selectAll("circle")
    .data(yearList[1].years)
    .enter()
    .append("circle")
        .attr("id", d => "circle-" + d.year)
        .attr("cx", function(d) {return xScale(d.year); })
        .attr("cy", 20)
        .attr("r", 10)
        .style("fill", "#bebebe");

var presidentialYears = d3.select("#year-options")
    .append("g")
    .attr("id", "presidential")
    .selectAll("circle")
    .data(yearList[2].years)
    .enter()
    .append("circle")
        .attr("id", d => "circle-" + d.year)
        .attr("cx", function(d) {return xScale(d.year); })
        .attr("cy", 20)
        .attr("r", 10)
        .style("fill", "#bebebe");

// add text below circles
var yearLabels = svg.append("g")
    .attr("id", "year-labels")

var midtermLabels = d3.select("#year-labels")
    .append("g")
    .attr("id", "midterm")
    .selectAll("text")
    .data(yearList[1].years)
    .enter()
    .append("text")
        .text(function(d) {return d.year })
        .attr("x", function(d) {return xScale(d.year); })
        .attr("y", 50)
        .attr("fill", "black")
        .attr("text-anchor", "middle");

var presidentialLabels = d3.select("#year-labels")
    .append("g")
    .attr("id", "midterm")
    .selectAll("text")
    .data(yearList[2].years)
    .enter()
    .append("text")
        .text(function(d) {return d.year })
        .attr("x", function(d) {return xScale(d.year); })
        .attr("y", 50)
        .attr("fill", "black")
        .attr("text-anchor", "middle");

// #endregion
    
// #region PLAY AND PAUSE BUTTON
// play button
var playButton = svg.append("g")
    .attr("id", "play-button")
    .append("path")
        .attr("id", "play")
        .attr("d", "M0,0 L8,5 L0,10 L0,0")
        .attr("fill", "#bebebe")
        .attr("transform", "translate(180, 8.5) scale(2.5)")
        .on("mouseover", function(event, d) {
        d3.select(this)
            .style("stroke", "#243a76")
            .style("stroke-width", 0.3)
            .style("cursor", "pointer");
    })
    .on("mouseout", function(event, d) {
        d3.select(this)
            .style("stroke-width", 0);
    });

// pause button
var pauseButton = svg.append("g")
    .attr("id", "pause-button")
    .append("path")
        .attr("id", "pause")
        .attr("d", "M0,0 L0,10 L2,10 L2,0 L0,0 M4,0 L4,10 L6,10 L6,0 L4,0")
        .attr("fill", "#bebebe")
        .attr("transform", "translate(220, 8.5) scale(2.5)")
            .on("mouseover", function(event, d) {
        d3.select(this)
            .style("stroke", "#243a76")
            .style("stroke-width", 0.3)
            .style("cursor", "pointer");
    })
    .on("mouseout", function(event, d) {
        d3.select(this)
            .style("stroke-width", 0);
    });;

// #endregion

// keeps track of the current year selected
let currYear = 0;
let yearSelect = 0;
let currColorFilter;


// load data
Promise.all([
    d3.csv("VREG-data.csv"),
    d3.json("tile_map.json")
]).then(function([data, tileMap]) {
    // #region PATTERN

    var patternFill = svg.append("defs")
        .selectAll("pattern")
        .data(tileMap.states)
        .enter()
        .append("pattern")
        .attr("id", d => "pattern-" + d.abb)
        .attr("width", 2)
        .attr("height", 2)
        .attr('patternUnits',"userSpaceOnUse")
        .attr("patternTransform", "rotate(-45)")

    var fill = patternFill.append("rect")
        .attr("id", d => "fill-" + d.abb)
        .attr("width", 40)
        .attr("height", 40)
        .attr("fill", "#bebebe")
        .classed("fill", true);

    var pattern = patternFill.append('rect')
        .attr("id", d => "patt-" + d.abb)
        .attr("width", 1)
        .attr("height", 30)
        .attr("fill", "#bebebe")
        .classed("fill", true);

    // #endregion

    // #region MAP SETUP
    var mapContainer = svg.append("g")
        .attr("id", "map-container")

    var map = mapContainer.append("g")
        .attr("id", "map")
        .selectAll("rect")
        .data(tileMap.states)
        .enter()
        .append("rect")
            .attr("id", d => d.abb)
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr("width", 5)
            .attr("height", 5)
            .style("fill", d => "url(#pattern-" + d.abb + ")");

    var mapAbb = mapContainer.append("g")
        .attr("id", "map-abb")
        .selectAll("text")
        .data(tileMap.states)
        .enter()
        .append("text")
            .text(d => d.abb)
            .attr("x", d => d.x + 2.4)
            .attr("y", d => d.y + 3.2)
            .attr("fill", "black")
            .attr("font-size", "2px")
            .attr("text-anchor", "middle")

    mapContainer.attr("transform", "scale(8) translate(20, 5)")

    // #endregion

    // #region UPDATE MAP FUNCTION
    function updateMap(inputYear, colorFilter) {
        currYear = (inputYear - 2000) / 2; // update currYear based on inputYear
        currColorFilter = colorFilter;

        // select data based on variable
        for (var i = 0; i < data.length; i++) { // loop through VBED data
            var dataState = data[i].State;
            var dataValue = data[i].Policy;
            var dataYear = data[i].Year;

            for (var j = 0; j < tileMap.states.length; j++) { // loop through json until match
                var mapState = tileMap.states[j].name;

                if (dataState == mapState && dataYear == inputYear) {
                    tileMap.states[j].value = dataValue; // once match is found, update value based on year
                    console.log("patt-" + tileMap.states[j].abb)

                    var currPatt = d3.select("#patt-" + tileMap.states[j].abb);

                    if (dataValue == "N" | dataValue == "O" | dataValue == "S" | dataValue == "A") {
                        console.log("it's NOT a pattern!")
                        currPatt.classed("fill", true);
                        currPatt.classed("patt", false);
                    } else if (dataValue == "OS" | dataValue == "OA" | dataValue == "SA" | dataValue == "OSA") {
                        console.log("it's a pattern!")
                        currPatt.classed("fill", false);
                        currPatt.classed("patt", true);
                    } 
                }
            }
        }
        console.log("this is " + currColorFilter)
        updateColorScale(currColorFilter);
        updateColorScalePatt(currColorFilter);

        d3.selectAll(".fill")
            .transition()
            .duration(750)
            .attr("fill", d => colorScale(d.value))

        d3.selectAll(".patt")
            .transition()
            .duration(750)
            .attr("fill", d => colorScalePatt(d.value))

        // update circle selection
        d3.selectAll("circle")
            .transition()
            .duration(500)
            .style("fill", "#bebebe")

        d3.select("#circle-" + inputYear)
            .transition()
            .duration(500)
            .style("fill", "#243a76")
    }

    // #endregion

    // #region TIMER
    var timerFunc = function() {
        if (yearSelect == 2) { // presidential
            currYear = (currYear + 2) % 14;
            updateMap(2000 + currYear * 2, currColorFilter);
        } else if (yearSelect == 1) { // midterm
            currYear = (currYear + 2) % 12;
            updateMap(2000 + currYear * 2, currColorFilter);
        } else { // all
            currYear = (currYear + 1) % 13; 
            updateMap(2000 + currYear * 2, currColorFilter);
        }
    }

    // timer needs to be initialized so when the year options are clicked,
    // it has something to reference and stop
    let timer = d3.interval(timerFunc, 2500);
    timer.stop()

    // boolean to keep track of whether the animation is playing
    let playing = false;

    // play button behavior when clicked
    playButton
        .on("click", function() {
            if (playing) { return; } // prevents the playButton from activating when already playing

            playing = true;

            timer = d3.interval(timerFunc, 2500);
            d3.select(this)
                .attr("fill", "#243a76");

            d3.select("#pause")
                .transition()
                .duration(500)
                .attr("fill", "#bebebe");
        })

    // pause button behavior when clicked
    pauseButton 
        .on("click", function() {
            timer.stop();

            playing = false;

            d3.select(this)
                .attr("fill", "#243a76");

            d3.select("#play")
                .transition()
                .duration(500)
                .attr("fill", "#bebebe");
        })

    // #endregion

    // #region YEAR TIMELINE BUTTON FUNCTIONS
    function initMidtermYears () {
        midtermYears
            .on("click", function(e,d) {
                timer.stop()
                playing = false;
                updateMap(d.year, currColorFilter)

                d3.select(this)
                    .style("fill", "#243a76")

                d3.select("#play")
                    .transition()
                    .duration(500)
                    .attr("fill", "#bebebe");

                d3.select("#pause")
                    .transition()
                    .duration(500)
                    .attr("fill", "#bebebe");
            })
            .on("mouseover", function(e, d) {
                d3.select(this)
                    .style("stroke", "#243a76")
                    .style("stroke-width", 1.2)
                    .style("cursor", "pointer");
            })
            .on("mouseout", function(event, d) {
                d3.select(this)
                    .style("stroke-width", 0);
            });
    }

    function initPresidentialYears () {
        presidentialYears
            .on("click", function(e, d) {
                timer.stop()
                playing = false;
                updateMap(d.year, currColorFilter)

                d3.select(this)
                    .style("fill", "#243a76")

                d3.select("#play")
                    .transition()
                    .duration(500)
                    .attr("fill", "#bebebe");

                d3.select("#pause")
                    .transition()
                    .duration(500)
                    .attr("fill", "#bebebe");
            })
            .on("mouseover", function(e, d) {
                d3.select(this)
                    .style("stroke", "#243a76")
                    .style("stroke-width", 1.2)
                    .style("cursor", "pointer");
            })
            .on("mouseout", function(event, d) {
                d3.select(this)
                    .style("stroke-width", 0);
            });
    }

    initMidtermYears();
    initPresidentialYears();

    // #endregion

    // #region COLOR UPDATE
    var colorSelected = "OSA"

    function colorSelect(newColor) {
        d3.select("#option-" + colorSelected).attr("opacity", 1);
        console.log("selected option " + colorSelected)
        colorSelected = newColor;
        updateMap(2000 + currYear * 2, newColor);
    }

    function colorDeSelect(newColor) {
        d3.select("#option-" + colorSelected).attr("opacity", 0.4);
        colorSelected = newColor;
        updateMap(2000 + currYear * 2, newColor);
    }

    colorOptions
        .on("click", function(d, i) {
            timer.stop();
            colorSelected = i;
            console.log(currColorFilter)

            if (i == "OSA") {
                if (currColorFilter == "OSA") {
                    return;
                } else {
                    colorOptions.attr("opacity", 1)
                    updateMap(2000 + currYear * 2, "OSA")
                    currColorFilter = "OSA";
                }
            } else if (i == "O") { // selecting OVR
                if (currColorFilter == "O") { // if OVR already selected
                    return;
                } else if (currColorFilter == "A") { // if AVR already selected
                    colorSelect("OA");
                } else if (currColorFilter == "S") {
                    colorSelect("OS");
                } else if (currColorFilter == "OA") {
                    colorDeSelect("A");
                } else if (currColorFilter == "OS") {
                    colorDeSelect("S");
                } else if (currColorFilter == "SA") {
                    colorSelect("OSA");
                    colorOptions.attr("opacity", 1)
                    currColorFilter = "OSA";
                } else if (currColorFilter == "OSA") {
                    colorOptions.attr("opacity", 0.4)
                    colorSelect("O");
                }
            } else if (i == "A") {
                if (currColorFilter == "O") { // if OVR already selected
                    colorSelect("OA");
                } else if (currColorFilter == "A") { // if AVR already selected
                    return;
                } else if (currColorFilter == "S") {
                    colorSelect("SA");
                } else if (currColorFilter == "OA") {
                    colorDeSelect("O");
                } else if (currColorFilter == "OS") {
                    colorOptions.attr("opacity", 1)
                    updateMap(2000 + currYear * 2, "OSA")
                    currColorFilter = "OSA";
                } else if (currColorFilter == "SA") {
                    colorDeSelect("S");
                } else if (currColorFilter == "OSA") {
                    colorOptions.attr("opacity", 0.4)
                    colorSelect("A");
                }
            } else if (i == "S") {
                if (currColorFilter == "O") { // if OVR already selected
                    colorSelect("OS");
                } else if (currColorFilter == "A") { // if AVR already selected
                    colorSelect("SA");
                } else if (currColorFilter == "S") {
                    return;
                } else if (currColorFilter == "OA") {
                    colorOptions.attr("opacity", 1)
                    updateMap(2000 + currYear * 2, "OSA")
                    currColorFilter = "OSA";
                } else if (currColorFilter == "OS") {
                    colorDeSelect("O");
                } else if (currColorFilter == "SA") {
                    colorDeSelect("A")
                } else if (currColorFilter == "OSA") {
                    colorOptions.attr("opacity", 0.4)
                    colorSelect("S");
                }
            } 
        })

    colorOptions
        .transition()
        .duration(500)
        .attr("opacity", 1)

    updateMap(2000 + currYear * 2, "OSA");

    currColorFilter = "OSA";

    // #endregion

    // #region TOOLTIP
    var toolTip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    map
        .on("mouseover", function(e, d) {
            d3.select(this)
                .attr("stroke-width", 2.2);
            toolTip.style("opacity", 1)
                //.html(d.properties.name + "\t" + d.properties.value)
                //.style("left", (e.pageX-25) + "px")
                //.style("top", (e.pageY-75) + "px");
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .attr("stroke-width", 1);
            toolTip.style("opacity", 0);
        })
        .on("mousemove", function(e, d) {
            toolTip
                .html(d.name)
                .style("left", (d3.pointer(e)[0]+100) + "px")
                .style("top", (d3.pointer(e)[1]+100) + "px")
        });

    // #endregion

    // #region SELECTION BEHAVIOR
    function selectionBehavior(year, opacity1, opacity2) {
        currYear = (year - 2000) / 2;
        timer.stop();
        updateMap(year, currColorFilter);

        presidentialLabels.attr("opacity", opacity1)
        presidentialYears.attr("opacity", opacity1)
        midtermLabels.attr("opacity", opacity2)
        midtermYears.attr("opacity", opacity2)
    }

    selections
        .on("click", function(e, d, i) {
            yearSelect = d.index;
            selections.attr("opacity", 0);
            selectionsText.attr("opacity", 0);
            selectionBarSelected = false;
            
            selectionBarText.text(d.option);

            if (yearSelect == 1) { // midterm
            selectionBehavior(2002, 0.1, 1);
            initMidtermYears();
            presidentialYears
                .on("click", function() {
                    return;
                })
                .on("mouseover", function() {
                    return;
                })
                .on("mouseout",function() {
                    return;
                });

        } else if (yearSelect == 2) { // presidental
            selectionBehavior(2000, 1, 0.1);
            initPresidentialYears();
            midtermYears
                .on("click", function() {
                    return;
                })
                .on("mouseover", function() {
                    return;
                })
                .on("mouseout",function() {
                    return;
                });

        } else if (yearSelect == 0) { // all
            selectionBehavior(2000, 1, 1);
            initPresidentialYears();
            initMidtermYears();
        }
    })

    // #endregion
});

