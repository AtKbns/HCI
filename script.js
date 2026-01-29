const margin = { top: 10, right: 200, bottom: 120, left: 60 }; 
const width = 800 - margin.left - margin.right;
const height = 550 - margin.top - margin.bottom;

const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


function drawChart(startIndex, data) {
    const subset = data.slice(startIndex, startIndex + 10);
  
    const x = d3.scaleBand()
      .domain(subset.map(d => d.name))
      .range([0, width])
      .padding(0.1);
  
    const maxY = d3.max(subset, d => d.Height < 0 ? 0 : d.Height); 
    const y = d3.scaleLinear()
      .domain([0, maxY * 1.1]) 
      .range([height, 0]);
  
    svg.selectAll(".x-axis").remove(); 
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-45)");
  
    svg.selectAll(".y-axis").remove(); 
    svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y));
  
    svg.selectAll(".bar").remove();
  
    svg.selectAll(".bar")
      .data(subset)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.name))
      .attr("width", x.bandwidth())
      .attr("y", height) 
      .attr("height", 0) 
      .style("fill", d => {
          if (d.Height > 200) {
              return "#082567"; 
          } else if (d.Height > 100) {
              return "#126180"; 
          } else if (d.Height > 50) {
              return "#4F97A3"; 
          } else {
              return "#ccc"; 
          }
      })
      .transition() 
      .duration(1000) 
      .attr("y", d => y(d.Height < 0 ? 0 : d.Height)) 
      .attr("height", d => height - y(d.Height < 0 ? 0 : d.Height)); 
}

d3.csv("superhero_data_analysis.csv").then(function(data) {
    let index = 0; 
  
    function updateChart() {
        drawChart(index, data);
    }
  
    updateChart();
  
    const nextButton = document.getElementById("nextButton");
    const backButton = document.getElementById("backButton");
    const pageSelect = document.getElementById("pageSelect");

    nextButton.addEventListener("click", function() {
        index += 10;
        if (index >= data.length) {
            index = data.length - 10;
        }
        const currentPageIndex = index / 10;
        pageSelect.value = currentPageIndex * 10; 
        drawChart(index, data);
    });

    backButton.addEventListener("click", function() {
        index -= 10;
        if (index < 0) {
            index = 0;
        }
        const currentPageIndex = index / 10;
        pageSelect.value = currentPageIndex * 10; 
        drawChart(index, data);
    });

    const pageCount = Math.ceil(data.length / 10);
    for (let i = 1; i <= pageCount; i++) {
        const option = document.createElement("option");
        option.text = "Page " + i;
        option.value = (i - 1) * 10;
        pageSelect.add(option);
    }

    pageSelect.addEventListener("change", function() {
        index = parseInt(this.value);
        drawChart(index, data);
    });
}).catch(function(error) {
    console.log("Error loading the data: " + error);
});


svg.append("text")
  .attr("class", "graph-title")
  .attr("x", width / 2)
  .attr("y", margin.top / 2)
  .attr("text-anchor", "middle")
  .text("กราฟแสดงความสูงของฮีโร่แต่ละคน (A-Z)");


svg.append("text")
  .attr("class", "y-axis-label")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("ความสูง (Height)");

svg.append("text")
  .attr("class", "x-axis-label")
  .attr("x", width / 2)
  .attr("y", height + margin.bottom - 50) 
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("ชื่อตัวละคร (Name)");

const legend = svg.append("g")
  .attr("class", "legend")
  .attr("transform", "translate(" + (width + 20) + "," + margin.top + ")");

legend.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", 20)
  .attr("height", 20)
  .style("fill", "#082567");

legend.append("text")
  .attr("x", 30)
  .attr("y", 15)
  .text("Height > 200")
  .style("font-size", "14px")
  .attr("alignment-baseline", "middle");

legend.append("rect")
  .attr("x", 0)
  .attr("y", 30)
  .attr("width", 20)
  .attr("height", 20)
  .style("fill", "#126180");

legend.append("text")
  .attr("x", 30)
  .attr("y", 45)
  .text("Height > 100")
  .style("font-size", "14px")
  .attr("alignment-baseline", "middle");

legend.append("rect")
  .attr("x", 0)
  .attr("y", 60)
  .attr("width", 20)
  .attr("height", 20)
  .style("fill", "#4F97A3");

legend.append("text")
  .attr("x", 30)
  .attr("y", 75)
  .text("Height > 50")
  .style("font-size", "14px")
  .attr("alignment-baseline", "middle");
