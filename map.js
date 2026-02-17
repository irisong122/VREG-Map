// #region SETUP
d3.select("#main")
    .append("h1")
    .text("Options to Vote Before Election Day, 2000-2024")

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
    .domain(["All", "OVR", "AVR", "SDR"])
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

// svg.append('rect').attr('x',10)
//     .attr('y',0)
//     .attr('width',5)
//     .attr('height',5)
//     .attr("transform", "scale(8)")
//     .attr("fill", "#fc0000")
//     .attr('fill','url(#pattern-AVR)');

var colorScaleOVR = d3.scaleOrdinal()
    .domain([1, 2, 3, 4, 5, 6, 7, 8])
    .range(["#bebebe", "#efc55b", "#bebebe", "#bebebe",
        "#efc55b", "#efc55b", "#bebebe", "#efc55b"
    ]);

var colorScaleAVR = d3.scaleOrdinal()
    .domain([1, 2, 3, 4, 5, 6, 7, 8])
    .range(["#bebebe", "#bebebe", "#ef7f4d", "#bebebe",
        "#ef7f4d", "#bebebe", "#ef7f4d", "#ef7f4d"
    ]);

var colorScaleSDR = d3.scaleOrdinal()
    .domain([1, 2, 3, 4, 5, 6, 7, 8])
    .range(["#bebebe", "#bebebe", "#bebebe", "#9a53b7",
        "#bebebe", "#9a53b7", "#9a53b7", "#9a53b7"
    ]);

var colorScaleOVRAVR = d3.scaleOrdinal()
    .domain([1, 2, 3, 4, 5, 6, 7, 8])
    .range(["#bebebe", "#efc55b", "#ef7f4d", "#bebebe",
        "url(#pattern-AVR)", "#efc55b", "#ef7f4d", "url(#pattern-AVR)"
    ]);

var colorScaleOVRSDR = d3.scaleOrdinal()
    .domain([1, 2, 3, 4, 5, 6, 7, 8])
    .range(["#bebebe", "#efc55b", "#bebebe", "#9a53b7",
        "#efc55b", "url(#pattern-OVR)", "#9a53b7", "url(#pattern-OVR)"
    ]);

var colorScaleAVRSDR = d3.scaleOrdinal()
    .domain([1, 2, 3, 4, 5, 6, 7, 8])
    .range(["#bebebe", "#bebebe", "#ef7f4d", "#9a53b7",
        "#ef7f4d", "#9a53b7", "url(#pattern-SDR)", "url(#pattern-SDR)"
    ]);

var colorScaleALL = d3.scaleOrdinal()
    .domain([1, 2, 3, 4, 5, 6, 7, 8])
    .range(["#bebebe", "#efc55b", "#ef7f4d", "#9a53b7",
        "url(#pattern-AVR)", "url(#pattern-OVR)", "url(#pattern-SDR)", "#3b9171"
    ]);

var xScale = d3.scaleLinear()
    .domain([2000, 2024])
    .range([270, width-15]);

var colorScales = [colorScaleOVR, colorScaleAVR, colorScaleSDR,
    colorScaleOVRAVR, colorScaleOVRSDR, colorScaleAVRSDR, colorScaleALL
]


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
var colorScales = [colorScaleOVR, colorScaleAVR, colorScaleSDR,
    colorScaleOVRAVR, colorScaleOVRSDR, colorScaleAVRSDR, colorScaleALL
]

var colorScaleIndex;

var colorScalesText = ["All", "OVR", "AVR", "SDR"]

var colorSelection = svg.append("g")
    .attr("id", "color-selection")

var colorOptions = colorSelection.selectAll("rect")
    .data(colorScalesText)
    .enter()
    .append("rect")
    .attr("id", d => "option-" + d)
    .attr("width", 20)
    .attr("height", 20)
    .attr("x", 10)
    .attr("y", (d, i) => i * 25 + 200)
    .attr("fill", (d, i) => colorScaleMain(i))
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
    .data(colorScalesText)
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
        .attr("r", 12)
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
        .attr("r", 12)
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
let currColorScale = colorScaleAVR;
let yearSelect = 0;


// load data
Promise.all([
    d3.csv("VREG.csv"),
    d3.json("tile_map.json")
]).then(function([data, tileMap]) {
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
            .style("fill", "#bebebe");

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
    function updateMap(inputYear, colorScale) {
        currYear = (inputYear - 2000) / 2; // update currYear based on inputYear
        currColorScale = colorScale;

        // select data based on variable
        for (var i = 0; i < data.length; i++) { // loop through VBED data
            var dataState = data[i].State;
            var dataValue = data[i].Value;
            var dataYear = data[i].Year;

            for (var j = 0; j < tileMap.states.length; j++) { // loop through json until match
                var mapState = tileMap.states[j].name;

                if (dataState == mapState && dataYear == inputYear) {
                    tileMap.states[j].value = dataValue; // once match is found, update value based on year
                    console.log("updated " + dataState + dataValue)
                    break;
                }
            }
        }

        // update map
        svg.select("#map")
            .selectAll("rect")
            .transition()
            .duration(750)
            .style("fill", function(d) {
                return colorScale(d.value)
            });

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
            updateMap(2000 + currYear * 2, currColorScale);
        } else if (yearSelect == 1) { // midterm
            currYear = (currYear + 2) % 12;
            updateMap(2000 + currYear * 2, currColorScale);
        } else { // all
            currYear = (currYear + 1) % 13; 
            updateMap(2000 + currYear * 2, currColorScale);
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
                updateMap(d.year, currColorScale)

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
                updateMap(d.year, currColorScale)

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
    var colorSelected = "All"

    function colorSelect(newIndex) {
        d3.select("#option-" + colorSelected).attr("opacity", 1);
        colorScaleIndex = newIndex;
        updateMap(2000 + currYear * 2, colorScales[newIndex]);
    }

    function colorDeSelect(newIndex) {
        d3.select("#option-" + colorSelected).attr("opacity", 0.4);
        colorScaleIndex = newIndex;
        updateMap(2000 + currYear * 2, colorScales[newIndex]);
    }

    colorOptions
        .on("click", function(d, i) {
            timer.stop();
            colorSelected = i;
            if (i == "All") {
                if (colorScaleIndex == 6) {
                    return;
                } else {
                colorOptions.attr("opacity", 1)
                updateMap(2000 + currYear * 2, colorScaleALL)
                colorScaleIndex = 6;
                }
            } else if (i == "OVR") { // selecting OVR
                if (colorScaleIndex == 0) { // if OVR already selected
                    return;
                } else if (colorScaleIndex == 1) { // if AVR already selected
                    colorSelect(3);
                } else if (colorScaleIndex == 2) {
                    colorSelect(4);
                } else if (colorScaleIndex == 3) {
                    colorDeSelect(1);
                } else if (colorScaleIndex == 4) {
                    colorDeSelect(2);
                } else if (colorScaleIndex == 5) {
                    colorSelect(5)
                } else if (colorScaleIndex == 6) {
                    colorOptions.attr("opacity", 0.4)
                    colorSelect(0);
                }
            } else if (i == "AVR") {
                if (colorScaleIndex == 0) { // if OVR already selected
                    colorSelect(3);
                } else if (colorScaleIndex == 1) { // if AVR already selected
                    return;
                } else if (colorScaleIndex == 2) {
                    colorSelect(5);
                } else if (colorScaleIndex == 3) {
                    colorDeSelect(0);
                } else if (colorScaleIndex == 4) {
                    colorOptions.attr("opacity", 1)
                    updateMap(2000 + currYear * 2, colorScaleALL)
                    colorScaleIndex = 6;
                } else if (colorScaleIndex == 5) {
                    colorDeSelect(2);
                } else if (colorScaleIndex == 6) {
                    colorOptions.attr("opacity", 0.4)
                    colorSelect(1);
                }
            } else if (i == "SDR") {
                if (colorScaleIndex == 0) { // if OVR already selected
                    colorSelect(4);
                } else if (colorScaleIndex == 1) { // if AVR already selected
                    colorSelect(5);
                } else if (colorScaleIndex == 2) {
                    return;
                } else if (colorScaleIndex == 3) {
                    colorOptions.attr("opacity", 1)
                    updateMap(2000 + currYear * 2, colorScaleALL)
                    colorScaleIndex = 6;
                } else if (colorScaleIndex == 4) {
                    colorDeSelect(0);
                } else if (colorScaleIndex == 5) {
                    colorDeSelect(1)
                } else if (colorScaleIndex == 6) {
                    colorOptions.attr("opacity", 0.4)
                    colorSelect(2);
                }
            } 
        })

    colorOptions
        .transition()
        .duration(500)
        .attr("opacity", 1)
    updateMap(2000 + currYear * 2, colorScaleALL)
    colorScaleIndex = 6;

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
        updateMap(year, currColorScale);

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

// var def = svg.append("defs")
//     .append("pattern")
//     .attr('id', 'diagPattern')
//     .attr("width", 5)
//     .attr("height", 5)
//     .attr('patternUnits',"userSpaceOnUse")
//     .attr("patternTransform", "rotate(-45)")
// var defTest = def.append('rect')
//     .attr("id", "test")
//     .attr("width", 4)
//     .attr("height", 20)
//     .attr("fill", "#bebebe")

// svg.append('rect').attr('x',10)
//     .attr('y',0)
//     .attr('width',40)
//     .attr('height',40)
//     .attr("fill", "#fc0000")
//     .attr('fill','url(#diagPattern)');

// var test = svg.append('rect').attr('x',10)
//     .attr('y',10)
//     .attr('width',5)
//     .attr('height',5)
//     .attr("transform", "scale(8)")
//     .attr("fill", "#fc0000")
//     .attr('fill','url(#diagPattern)');

// test.on("click", function() {
//     d3.select("#test")
//         .transition()
//         .duration(750)
//         .attr("fill", "black")

//     console.log("test")
// })
