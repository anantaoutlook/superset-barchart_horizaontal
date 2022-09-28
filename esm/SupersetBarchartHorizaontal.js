var _templateObject;

function _taggedTemplateLiteralLoose(strings, raw) { if (!raw) { raw = strings.slice(0); } strings.raw = raw; return strings; }

/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React, { useEffect } from 'react';
import { styled } from '@superset-ui/core';
import * as d3 from 'd3'; // The following Styles component is a <div> element, which has been styled using Emotion
// For docs, visit https://emotion.sh/docs/styled
// Theming constiables are provided for your use via a ThemeProvider
// imported from @superset-ui/core. For constiables available, please visit
// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts

var Styles = styled.div(_templateObject || (_templateObject = _taggedTemplateLiteralLoose(["\n  background-color: ", ";\n  padding: ", "px;\n  border-radius: ", "px;\n  height: ", "px;\n  width: ", "px;\n\n  h3 {\n    /* You can use your props to control CSS! */\n    margin-top: 0;\n    margin-bottom: ", "px;\n    font-size: ", "px;\n    font-weight: ", ";\n  }\n\n  pre {\n    height: ", "px;\n  }\n  .bar {\n    fill: #5f89ad;\n}\n\n.axis {\n    font-size: 13px;\n}\n\n.axis path,\n.axis line {\n    fill: none;\n    display: none;\n}\n\n.label {\n    font-size: 13px;\n}\n"])), _ref => {
  var {
    theme
  } = _ref;
  return theme.colors.secondary.light2;
}, _ref2 => {
  var {
    theme
  } = _ref2;
  return theme.gridUnit * 4;
}, _ref3 => {
  var {
    theme
  } = _ref3;
  return theme.gridUnit * 2;
}, _ref4 => {
  var {
    height
  } = _ref4;
  return height;
}, _ref5 => {
  var {
    width
  } = _ref5;
  return width;
}, _ref6 => {
  var {
    theme
  } = _ref6;
  return theme.gridUnit * 3;
}, _ref7 => {
  var {
    theme,
    headerFontSize
  } = _ref7;
  return theme.typography.sizes[headerFontSize];
}, _ref8 => {
  var {
    theme,
    boldText
  } = _ref8;
  return theme.typography.weights[boldText ? 'bold' : 'normal'];
}, _ref9 => {
  var {
    theme,
    headerFontSize,
    height
  } = _ref9;
  return height - theme.gridUnit * 12 - theme.typography.sizes[headerFontSize];
});
/**
 * ******************* WHAT YOU CAN BUILD HERE *******************
 *  In essence, a chart is given a few key ingredients to work with:
 *  * Data: provided via `props.data`
 *  * A DOM element
 *  * FormData (your controls!) provided as props by transformProps.ts
 */

export default function SupersetBarchartHorizaontal(props) {
  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  var {
    data,
    height,
    width
  } = props;
  useEffect(() => {
    render();
  }, [props]);

  var wrap = (text, width) => {
    text.each(function () {
      var text = d3.select("#graphic").append("svg");
      var words = text.text().split(/\s+/).reverse();
      var word = '';
      var line = [];
      var lineNumber = 0;
      var lineHeight = 1.1; // ems

      var y = text.attr("y");
      var dy = parseFloat(text.attr("dy"));
      var tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");

      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));

        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  };

  var render = () => {
    // create tooltip element  
    var tooltip = d3.select("body").append("div").attr("class", "d3-tooltip").style("position", "absolute").style("z-index", "10").style("visibility", "hidden").style("padding", "5px 10px").style("background", "#fff").style("border-radius", "5px").style("color", "#000").text("a simple tooltip"); //sort bars based on value

    var newData = data.sort(function (a, b) {
      return d3.ascending(a.state_count, b.state_count);
    }); //set up svg using margin conventions - we'll need plenty of room on the left for labels

    var margin = {
      top: 0,
      right: 20,
      bottom: 15,
      left: 100
    };
    var svgWidth = width - margin.left - margin.right;
    var svgHeight = height - margin.top - margin.bottom;
    d3.select("#graphic").selectAll('svg').remove();
    var svg = d3.select("#graphic").append("svg").attr("width", svgWidth + margin.left + margin.right).attr("height", svgHeight + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // let labelWidth = 0;

    var maxCount = Math.max(...newData.map(o => o.state_count));
    var x = d3.scaleLinear().range([0, svgWidth]).domain([0, maxCount]);
    var y = d3.scaleBand().domain(newData.map((d, i) => d.state)).rangeRound([0, svgHeight]).padding(0.1); //make y axis to show bar names
    // const tickVals = data.map((d)=> (d.state));

    var yAxis = d3.axisLeft(y).scale(y).ticks(newData.length).tickSize(4).tickFormat(x => "" + x).tickSizeOuter(0);
    var xAxis = d3.axisBottom(x).scale(x) //no tick marks
    .tickSize(4).ticks(newData.length).tickFormat(x => "" + x).tickSizeOuter(0);
    svg.append("g").attr("class", "y axis").call(yAxis).selectAll(".tick text"); // .call(wrap, x.rangeBand());
    // .call(wrap, x.rangeBand());

    svg.append('g').call(xAxis).attr('transform', "translate(0, " + (svgHeight - 10) + ")");
    svg.selectAll('.bar').remove();
    var bars = svg.selectAll(".bar").data(newData).enter().append("g"); //append rects

    bars.append("rect").attr("class", "bar").attr('fill', '#1fa8c9').attr("y", d => y(d.state)).attr("height", y.bandwidth()) // bar height
    .attr("x", 0.5) // .attr("fill", (d:any) => "rgb("+ Math.round(d.state_count * 8) + ",0," + Math.round(d * 10) + ")")  //Change the color of the bar depending on the value
    .attr("width", d => x(d.state_count)).on("mouseover", function (d, i) {
      tooltip.html("State: " + i.state + "\n        " + (i.state_count ? ",\n District count: " + i.state_count : '')).style("visibility", "visible");
    }).on("mousemove", function (event) {
      tooltip.style("border", '1px solid #16829d').style("box-shadow", '0px 0px 5px solid #16829d').style("top", event.pageY - 10 + "px").style("left", event.pageX + 10 + "px");
      d3.select(this).attr("fill", '#16829d'); // d3.select(this).attr("fill", (d:any) => "rgb("+ Math.round(d.state_count * 8) + ",0," + Math.round(d * 10) + ")")
    }).on("mouseout", function () {
      tooltip.html("").style("visibility", "hidden");
      d3.select(this).attr("fill", '#1fa8c9');
    }); // rotate yaxis label text

    svg.selectAll("y axis tick text") // select all the text elements for the xaxis
    .attr("transform", d => "translate(" + svgHeight * -2 + "," + svgHeight + ")rotate(-45)");
  };

  return /*#__PURE__*/React.createElement("div", {
    id: "graphic"
  });
}