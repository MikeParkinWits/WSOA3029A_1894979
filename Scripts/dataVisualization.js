const dataBreachURL = "https://haveibeenpwned.com/api/v3/breaches"

let count = 0;

let topBreaches =[];

let numBreachesPerYear = [{"Year": 2010, "DataLoss": 0}, {"Year": 2011, "DataLoss": 0},{"Year": 2012, "DataLoss": 0},{"Year": 2013, "DataLoss": 0},{"Year": 2014, "DataLoss": 0},{"Year": 2015, "DataLoss": 0},{"Year": 2016, "DataLoss": 0},{"Year": 2017, "DataLoss": 0},{"Year": 2018, "DataLoss": 0},{"Year": 2019, "DataLoss": 0}];

numBreachesPerYear.find(e => {
    if (e.Year === 2019){
        e.DataLoss += 10;

}
});

const getAllDataBreaches = async () => {
    const response = await fetch(dataBreachURL);
    const data = await response.json();

    if (document.querySelector(".svg-bar-graph")){
        sortDataOrder(data);
    
        loadBarGraph(topBreaches);
    }
    else if (document.querySelector(".svg-line-graph"))
    {
        groupDataByYear(data);
        console.log("YAY");

        loadLineGraph(numBreachesPerYear);
    }

}

getAllDataBreaches().catch(error =>{
    console.error(error);
});

console.log(d3);


const sortDataOrder = (data) => {
    data.sort((a,b) => a.PwnCount - b.PwnCount
    )

    data.reverse();

    data.forEach(barChartElement => {
        if (barChartElement.IsVerified
                    && barChartElement.Domain != ""){

                        //Bar Graph
                        if (count < 10){
                            count++;
                            topBreaches.push({"Name": barChartElement.Name, "PwnCount": barChartElement.PwnCount});
                        }

                        //Line Graph
                        let date = parseInt(barChartElement.BreachDate.substring(0,4));
                            
                        numBreachesPerYear.find(e => {
                            if (e.Year === date){
                                e.DataLoss += barChartElement.PwnCount;
                        }
                        });
        }
    });

    console.log(numBreachesPerYear);
}

const loadBarGraph = (data) => {

    const svgArea = d3.select("svg")
    .attr("viewBox", "0 0 750 500")
    .attr("preserveAspectRatio", "xMidYMin meet");

    const margin = {top: 40, right: 75, bottom: 100, left: 225},
    width = svgArea.attr('width') - margin.right - margin.left,
    height = svgArea.attr('height') - margin.bottom - margin.top;

    const yScale = d3.scaleBand()
    .domain(data.map(d => d.Name))
    .range([0, height])
    .padding(0.1);

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, dataInput => dataInput.PwnCount)])
        .range([0, width]);
    
    const g = svgArea.append('g')
        .attr('transform', "translate(" + margin.left + "," + margin.top + ")");

        


    g.append('g')
    .call(d3.axisLeft().scale(yScale))
    .selectAll('.domain, .tick line')
    .remove();
    
    const xAxisG = g.append('g')
    .call(d3.axisBottom().tickSize(-height).scale(xScale).tickFormat(d3.format('.3s')))
    .attr('transform', "translate(0," + height + ")");
    xAxisG.select('.domain')
    .remove();
    

    g.selectAll('rect')
        .data(data)
        .enter().append('rect')
            .attr('y', dataInput => yScale(dataInput.Name))
                .attr('transform', 'translate(100,0)')
            .attr('width', dataInput => 
                xScale(dataInput.PwnCount)
            )
            .attr('height', yScale.bandwidth())
                .attr('transform', 'translate(1,0)');


            xAxisG.append('text').attr('class', 'axis-lab')
            .attr('x', width/2).attr('y', 45).text('Number of Records Lost');
}

const groupDataByYear = (data) => {

    console.log(data);

    data.forEach(lineChartElement => {
        if (lineChartElement.IsVerified
                    && lineChartElement.Domain != ""){
                        let date = parseInt(lineChartElement.BreachDate.substring(0,4));
                        
                        numBreachesPerYear.find(e => {
                            if (e.Year === date){
                                e.DataLoss += lineChartElement.PwnCount;
                        }
                        });
                    
        }
    });

    console.log(numBreachesPerYear);
} 

const loadLineGraph = (data) => {

    const svgArea = d3.select("svg"),
        margin = {top:100, right: 100, bottom: 100, left: 100},
        width = svgArea.attr('width') - margin.left - margin.right,
        height = svgArea.attr('height') - margin.top - margin.bottom;

    svgArea
    .attr("viewBox", "0 0 750 500")
    .attr("preserveAspectRatio", "xMidYMin meet");

    const xScale = d3.scaleLinear()
        .domain([d3.min(data, dataInput => dataInput.Year), d3.max(data, dataInput => dataInput.Year)])
        .range([0, width]);
    
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, dataInput => dataInput.DataLoss)])
        .range([height, 0]);

            var g = svgArea.append("g")
            .attr("transform", "translate(" + 100 + "," + 100 + ")");
        
        svgArea.append('text')
        .attr('x', width/2 + 100)
        .attr('y', height + 160)
        .attr('text-anchor', 'middle')
        .attr('class', 'axis-lab')
        .text('Year');
        
        svgArea.append('text')
        .attr('text-anchor', 'middle')
        .attr('class', 'axis-lab')
        .attr('transform', 'translate(35,' + (height - 35) + ')rotate(-90)')
        .text('Total Records Lost');

        const customTickFormat = num => d3.format('.3s')(num)
        .replace('G', 'B');

        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom().scale(xScale).tickFormat(d3.format('.4r')))
            .selectAll('.tick line')
            .remove();

        g.append("g")
            .call(d3.axisLeft().scale(yScale)
            .tickFormat(customTickFormat))
            
        console.log(data);
        svgArea.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
            .attr("cx", dataInput => xScale(dataInput.Year) )
            .attr("cy", dataInput => yScale(dataInput.DataLoss) )
            .attr("transform", "translate(" + 100 + "," + 100 + ")")

        svgArea.append("path")
        .datum(data) 
            .attr("class", "line") 
            .attr("transform", "translate(" + 100 + "," + 100 + ")")
            .attr("d", d3.line()
                .x(dataInput => xScale(dataInput.Year) )
                .y(dataInput => yScale(dataInput.DataLoss))
                .curve(d3.curveMonotoneX))
}