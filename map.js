// #region SETUP
// d3.select("html")
//     .style("font-size", "22px")

d3.select("body")
    .append("div")
    .attr("id", "vreg-map")
    .style("display", "flex")
    .style("justify-content", "center")
    .style("align-items", "center")
    .style("flex-direction", "column")
    .style("max-width", "666px")
    .style("margin-left", "auto")
    .style("margin-right", "auto");

d3.select("#vreg-map")
    .append("h2")
    .text("Availability of Innovative Voter Registration Methods, 2000-2026")
    .style("text-align", "center");

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

var width = 666;
var height = 550;

var margin = {
    left: 20,
    right: 20
}

var svg = d3.select("#vreg-map")
  .append("svg")
  .attr("width", "100%")
  .attr("height", "auto")
  .attr("viewBox", "0 0 675 550");
  
// #endregion

// #region SCALES AND COLOR
var policyScale = d3.scaleOrdinal()
    .domain(["OVR", "SDR", "AVR", "None"])
    .range(["Online voter registration", "Same-day voter registration",
        "Automatic voter registration", "No innovative voter registration methods"])

var listScale = d3.scaleOrdinal()
    .domain(["None", "OVR", "AVR", "SDR", "OVR+AVR", "OVR+SDR", "AVR+SDR", "OVR+SDR+AVR"])
    .range(["images/None.png", "images/OVR.png", "images/AVR.png", "images/SDR.png",
        "images/OVR+AVR.png", "images/OVR+SDR.png", "images/AVR+SDR.png", "images/All.png"
    ])

var colorScaleMain = d3.scaleOrdinal()
    .domain(["OSA", "O", "A", "S"])
    .range(["#3b9171", "#efc55b", "#ef7f4d", "#9a53b7"])

var xScale = d3.scaleLinear()
    .domain([2000, 2026])
    .range([65, width-margin.right]);

// scale for the tile
var colorScale = d3.scaleOrdinal()
    .domain(["N", "S", "O", "A", "OS", "OA", "SA", "OSA"])
    .range(["#bebebe", "#bebebe", "#bebebe", "#bebebe",
        "#bebebe", "#bebebe", "#bebebe", "#bebebe"
    ])

// scale for the pattern
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
    .attr("x", (width-150) / 2)
    .attr("y", 65)
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
            selectionTri.attr("fill", "#243a76")
        } else {
            selections.attr("opacity", 0)
            selectionsText.attr("opacity", 0)
            selectionBarSelected = false;
            selectionTri.attr("fill", "#dbdbdb")
        }
    })

// triangle on selection bar to indicate to click
var selectionTri = selectionContainer.append("path")
    .attr("d", "M1, 1 L1, 3 L2, 3 L1, 2")
    .attr("transform", "translate(" + ((width-150) / 2 + 100) + ", 65) scale(12) rotate(-45)")
    .attr("fill", "#dbdbdb")
    .style("pointer-events", "none");

var selectionBarText = selectionContainer.append("text")
    .text("All Years")
    .attr("fill", "black")
    .attr("x", (width-150) / 2 + 5)
    .attr("y", 82)
    .attr("font-size", "14px");

// drop down options
var selectionOptions = selectionContainer.append("g")
    .attr("id", "selection-options")

var selections = selectionOptions
    .selectAll("rect")
    .data(yearList)
    .enter()
    .append("rect")
        .attr("width", 150)
        .attr("height", 25)
        .attr("x", (width-150) / 2)
        .attr("y", (d, i) => (i + 1) * 25 + 65)
        .attr("fill", "#ebebeb")
        .attr("opacity", 0)
    .on("mouseover", function() {
        if (!selectionBarSelected) {
            d3.select(this)
                .style("cursor", "default");
        } else if (selectionBarSelected) {
            d3.select(this)
                .style("stroke", "#243a76")
                .style("stroke-width", 0.7)
                .style("cursor", "pointer");
        }
    })
    .on("mouseout", function() {
        d3.select(this)
            .style("stroke-width", 0);
    });

var selectionsText = selectionOptions
    .selectAll("text")
    .data(yearList)
    .enter()
    .append("text")
    .text(d => d.option)
    .attr("y", (d, i) => (i + 1) * 25 + 82)
    .attr("x", (width-150) / 2 + 8)
    .attr("fill", "black")
    .attr("opacity", 0)
    .attr("font-size", "14px");

// #endregion

// #region COLOR SELECTION

var colorSelection = svg.append("g")
    .attr("id", "color-selection")

// text to tell readers to click
colorSelection.append("text")
    .text("Click to filter by policy")
    .attr("x", 475)
    .attr("y", 400)
    .attr("font-size", "13pt")

// policy selections
var colorOptions = colorSelection.selectAll("rect")
    .data(["OSA", "O", "A", "S"])
    .enter()
    .append("rect")
        .attr("id", d => "option-" + d)
        .attr("width", 20)
        .attr("height", 20)
        .attr("x", 475)
        .attr("y", (d, i) => i * 30 + 415)
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

var checkMarks = colorSelection.selectAll("path")
    .data(["OSA", "O", "A", "S"])
    .enter()
    .append("path")
        .attr("id", d => "check-" + d)
        .attr("d", "M 6 7 L 7 6 L 10 9 L 17 1 L 18 2 L 10 11 L 6 7")
        .attr("fill", "#555555")
        .attr("opacity", 0.7)
        .attr("transform", (d, i) => "translate(467," + (i * 30 + 410) + ") scale(1.8)")
        .style("pointer-events", "none");

var colorOptionsText = colorSelection
    .append("g")
    .attr("id", "color-text")
    .selectAll("text")
    .data(["All Methods", "Online Voter Registration",
         "Automatic Voter Registration", "Same Day Registration"])
    .enter()
    .append("text")
    .attr("x", 500)
    .attr("y", (d, i) => i * 30 + 430)
    .text(d => d)
    .attr("font-size", "10pt")

// #endregion

// #region YEAR TIMELINE BUTTONS

// rectangle connecting years
var yearTimeline = svg.append("g")
    .attr("id", "year-timeline")

// rect connecting years
var yearRect = yearTimeline
    .append("rect")
    .attr("id", d => "year-rect")
    .attr("x", d => xScale(2000))
    .attr("y", 20)
    .attr("width", d => xScale(2026) - xScale(2000))
    .attr("height", 2)
    .attr("fill", "#bebebe");

// circles for each year 
var yearOptions = yearTimeline
    .append("g")
    .attr("id", "year-options")
    .selectAll("circle")
    .data(yearList[0].years)
    .enter()
    .append("circle")
        .attr("id", d => "circle-" + d.year)
        .attr("cx", d => xScale(d.year))
        .attr("cy", 20)
        .attr("r", 8)
        .style("fill", "#bebebe")
        .classed("presidential", d => (d.year - 2000) % 4 == 0)
        .classed("midterm", d => (d.year - 2000) % 4 != 0);

// add text below circles
var yearLabels = yearTimeline
    .append("g")
    .attr("id", "year-labels")
    .selectAll("text")
    .data(yearList[0].years)
    .enter()
    .append("text")
        .text(d => d.year)
        .attr("x", d => xScale(d.year))
        .attr("y", 45)
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .classed("presidential-label", d => (d.year - 2000) % 4 == 0)
        .classed("midterm-label", d => (d.year - 2000) % 4 != 0);

// #endregion
    
// #region PLAY AND PAUSE BUTTON

// play button
var playButton = svg.append("g")
    .attr("id", "play-button")
    .append("path")
        .attr("id", "play")
        .attr("d", "M0,0 L8,5 L0,10 L0,0")
        .attr("fill", "#bebebe")
        .attr("transform", "translate(10, 10.1) scale(1.8)")
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
        .attr("transform", "translate(35, 10.1) scale(1.8)")
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

// #endregion

// #region TEXT

    var yearText = d3.select("#vreg-map")
        .append("div")
        .attr("id", "year-text")
        .style("text-align", "left");

    var yearHeader = yearText.append("div")
        .attr("id", "year-header")
        .append("h2")
        .style("text-align", "center");
        
    var policies = yearText.append("div")
        .attr("id", "policies-text");
        
    var policiesHeader = policies.append("h3");

    policies = policies.append("ul");

    var combinations = yearText.append("div")
        .attr("id", "combo-text");

    var comboHeader = combinations.append("h3");

    combinations = combinations.append("ul");



// #endregion

// keeps track of the current year selected
let currYear = 0;
let yearSelect = 0;
let currColorFilter;


// load data
Promise.all([
    d3.csv("data/VREG-data.csv"),
    d3.json("data/tile_map.json"),
    d3.json("data/policy_text.json"),
    d3.json("data/combo_text.json")
]).then(function([data, tileMap, policyText, comboText]) {

    // #region MAP SETUP
    var mapContainer = svg.append("g")
        .attr("id", "map-container")

    // scale variable
    var mapSize = 8;

    var map = mapContainer.append("g")
        .attr("id", "map")
        .selectAll("rect")
        .data(tileMap.states)
        .enter()
        .append("rect")
            .attr("x", d => d.x * mapSize)
            .attr("y", d => d.y * mapSize)
            .attr("width", 5 * mapSize)
            .attr("height", 5 * mapSize)
            .attr("fill", "#bebebe");

    var mapTri = mapContainer.append("g")
        .attr("id", "map-tri")
        .selectAll("path")
        .data(tileMap.states)
        .enter()
        .append("path")
            .attr("d", "M 0 0 L 5 5 L 0 5 L 0 0")
            .attr("id", d => "tri-" + d.abb)
            .attr("transform", d => "translate(" + (d.x * mapSize) + ", " + (d.y * mapSize) + ") scale(" + mapSize + ")")
            .style("fill", "#bebebe");

    // state abbreviations for tiles
    mapContainer.append("g")
        .attr("id", "map-abb")
        .selectAll("text")
        .data(tileMap.states)
        .enter()
        .append("text")
            .text(d => d.abb)
            .attr("x", d => d.x * mapSize + 19)
            .attr("y", d => d.y * mapSize + 25)
            .attr("fill", "black")
            .attr("font-size", "14px")
            .attr("text-anchor", "middle")
            .style("font-weight", "bold");

    // centering the map
    var mapWidth = d3.select('#map-container').node().getBoundingClientRect().width;
    var containerWidth = d3.select("#vreg-map").node().getBoundingClientRect().width;
    mapContainer.attr("transform", "translate(" + (containerWidth-mapWidth) / 2 + ", 50)")

    // #endregion

    // #region UPDATE MAP
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
                }
            }
        }

        // update color scale based on the selected policy
        updateColorScale(currColorFilter);
        updateColorScalePatt(currColorFilter);

        // update tiles and pattern
        map
            .transition()
            .duration(750)
            .style("fill", d => colorScale(d.value))

        mapTri
            .transition()
            .duration(750)
            .style("fill", d => colorScalePatt(d.value))

        // update circle selection
        d3.selectAll("circle")
            .transition()
            .duration(500)
            .style("fill", "#bebebe")

        d3.select("#circle-" + inputYear)
            .transition()
            .duration(500)
            .style("fill", "#243a76")

        // update text
        yearHeader
            .text(inputYear + " General Election")

        policiesHeader
            .text("Innovative Registration Policies");

        d3.selectAll("li").remove()

        var policyBullets = policies
            .selectAll("li")
            .data(policyText.policy[currYear])
            .enter()
            .append("li")
                .text(d => policyScale(d.type) + ": ")
                .style("list-style-image", d => "url(" + listScale(d.type) + ")");

        policyBullets
            .append("span")
                .style("font-weight", "bold")
                .text(d => d.maintext + " ")

        policyBullets.each(function(d) {
            if (d.change != null) {
                d3.select(this)
                    .append("span")
                    .text("(" + d.change + ")")
            }

            var currList = d3.select(this)
                    .append("ul")

            if (d.implemented != null) {
                currList
                    .append("li")
                    .text("Implemented " + d.type + ": " + d.implemented)
                    .style("list-style-image", "none");
            }

            if (d.ended != null) {
                currList
                    .append("li")
                    .text("Ended " + d.type + ": " + d.ended)
            }
        })

        comboHeader
            .text("Combinations of Policies")

        var comboBullets = combinations
            .selectAll("li")
            .data(comboText.combo[currYear])
            .enter()
            .append("li")
                .text(d => d.type + ": ")
                .style("list-style-image", d => "url(" + listScale(d.type) + ")");

        comboBullets
            .append("span")
                .style("font-weight", "bold")
                .text(d => d.maintext + " ")

        comboBullets.each(function(d) {
            if (d.change != null) {
                d3.select(this)
                    .append("span")
                    .text("(" + d.change + ")")
            }
        })

        d3.selectAll("h3")
            .style("font-size", "1.125rem")

        d3.selectAll("li")
            .style("font-size", "1.125rem")

        d3.selectAll("h2")
            .style("font-size", "1.45rem")
    }

    // #endregion

    // #region TIMER
    var timerFunc = function() {
        if (yearSelect == 2) { // presidential
            currYear = (currYear + 2) % 14;
            updateMap(2000 + currYear * 2, currColorFilter);
        } else if (yearSelect == 1) { // midterm
            currYear = (currYear + 2) % 14;
            updateMap(2000 + currYear * 2, currColorFilter);
        } else { // all
            currYear = (currYear + 1) % 14; 
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

    // #region COLOR UPDATE
    var colorSelected = "OSA"

    function colorSelect(newColor) {
        d3.select("#option-" + colorSelected).attr("opacity", 1);
        d3.select("#check-" + colorSelected).attr("opacity", 0.7);
        colorSelected = newColor;
        updateMap(2000 + currYear * 2, newColor);
    }

    function colorDeSelect(newColor) {
        d3.select("#option-" + colorSelected).attr("opacity", 0.4);
        d3.select("#check-" + colorSelected).attr("opacity", 0);
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
                    checkMarks.attr("opacity", 0.7);
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
                    colorOptions.attr("opacity", 1);
                    checkMarks.attr("opacity", 0.7);
                    currColorFilter = "OSA";
                } else if (currColorFilter == "OSA") {
                    colorOptions.attr("opacity", 0.4);
                    checkMarks.attr("opacity", 0);
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
                    colorOptions.attr("opacity", 1);
                    checkMarks.attr("opacity", 0.7);
                    updateMap(2000 + currYear * 2, "OSA");
                    currColorFilter = "OSA";
                } else if (currColorFilter == "SA") {
                    colorDeSelect("S");
                } else if (currColorFilter == "OSA") {
                    colorOptions.attr("opacity", 0.4);
                    checkMarks.attr("opacity", 0);
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
                    checkMarks.attr("opacity", 0.7);
                    updateMap(2000 + currYear * 2, "OSA")
                    currColorFilter = "OSA";
                } else if (currColorFilter == "OS") {
                    colorDeSelect("O");
                } else if (currColorFilter == "SA") {
                    colorDeSelect("A")
                } else if (currColorFilter == "OSA") {
                    colorOptions.attr("opacity", 0.4);
                    checkMarks.attr("opacity", 0);
                    colorSelect("S");
                }
            } 
        })

    // initialize color options
    colorOptions
        .transition()
        .duration(500)
        .attr("opacity", 1)

    // initialize map
    updateMap(2000, "OSA");

    // #endregion


    // #region YEAR TIMELINE BUTTON FUNCTIONS
    // initialize year button behavior
    function initYearOptions(type) {
        d3.selectAll("." + type)
            .attr("opacity", 1)
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
        
        d3.selectAll("." + type + "-label")
            .attr("opacity", 1);
    }

    initYearOptions("presidential");
    initYearOptions("midterm");

    function disableYearOptions(type) {
        d3.selectAll("." + type)
            .attr("opacity", 0.1)
            .on("click", function() {
                return;
            })
            .on("mouseover", function() {
                return;
            })
            .on("mouseout",function() {
                return;
            });

        d3.selectAll("." + type + "-label")
            .attr("opacity", 0.1);
    }

    // #endregion

    // #region SELECTION BEHAVIOR
    selections
        .on("click", function(e, d, i) {
            if (!selectionBarSelected) {
                return;
            }

            // update selections
            selections.attr("opacity", 0);
            selectionsText.attr("opacity", 0);
            selections.style("cursor", "default");

            // update selection bar
            selectionBarSelected = false;
            selectionBarText.text(d.option);

            // update arrow
            selectionTri.attr("fill", "#dbdbdb");

            // reset timer
            timer.stop();
            playButton
                .transition()
                .duration(500)
                .attr("fill", "#bebebe");

            yearSelect = d.index;

            if (yearSelect == 1) { // midterm
            yearRect // update year rectangle
                .attr("x", xScale(2002))
                .attr("width", xScale(2026) - xScale(2002))

            initYearOptions("midterm");
            disableYearOptions("presidential");
            updateMap(2002, currColorFilter);

        } else if (yearSelect == 2) { // presidental
            yearRect
                .attr("x", xScale(2000))
                .attr("width", xScale(2024) - xScale(2000));

            initYearOptions("presidential");
            disableYearOptions("midterm");
            updateMap(2000, currColorFilter);

        } else if (yearSelect == 0) { // all
            yearRect
                .attr("x", xScale(2000))
                .attr("width", xScale(2026) - xScale(2000));

            initYearOptions("presidential");
            initYearOptions("midterm");
            updateMap(2000, currColorFilter);
        }
    })

    // #endregion

    d3.selectAll("text").style("pointer-events", "none");

});

