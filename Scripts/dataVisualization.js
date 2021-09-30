const dataBreachURL = "https://haveibeenpwned.com/api/v3/breaches"

const sortData = (data) => {
    data.sort((a,b) => a.PwnCount - b.PwnCount
    )

    data.reverse();

    console.log(data);


    data.forEach(element => {
        if (element.IsVerified
                && count <10
                    && element.Domain != ""){
                    count++;
                    topBreaches.push({"Name": element.Name, "PwnCount": element.PwnCount});
        }
    });
} 

let count = 0;

let topBreaches =[];

const getAllDataBreaches = async () => {
    const response = await fetch(dataBreachURL);
    const data = await response.json();

    sortData(data);

    console.log(topBreaches);

    loadBarGraph(topBreaches);
}

getAllDataBreaches().catch(error =>{
    console.error(error);
});

console.log(d3);

const svgArea = d3.select("svg");

const width = svgArea.attr('width');
const height = svgArea.attr('height');

console.log(svgArea);

const loadBarGraph = (data) => {

    svgArea
    .attr("viewBox", "0 0 750 500")
    .attr("preserveAspectRatio", "xMidYMin meet")

    const margin = {top: 40, right: 100, bottom: 100, left: 200};
    innerWidth = width - margin.right - margin.left;
    innerHeight = height - margin.bottom - margin.top;

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.PwnCount)])
        .range([0, innerWidth]);

    
        const yScale = d3.scaleBand()
        .domain(data.map(d => d.Name))
        .range([0, innerHeight])
        .padding(0.1);


        const g = svgArea.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

        const xAxis = d3.axisBottom(xScale)
        .tickSize(-innerHeight);

        g.append('g').call(d3.axisLeft(yScale))
        .selectAll('.domain, .tick line')
        .remove();
        
        const xAxisG = g.append('g').call(xAxis.tickFormat(d3.format('.3s')))
        .attr('transform', `translate(0,${innerHeight})`);
        xAxisG.select('.domain')
        .remove();;
        

        console.log(yScale.domain());

    g.selectAll('rect')
        .data(data)
        .enter().append('rect')
            .attr('y', d => yScale(d.Name))
                .attr('transform', 'translate(100,0)')
            .attr('width', d => 
                xScale(d.PwnCount)
            )
            .attr('height', yScale.bandwidth())
            .attr('transform', 'translate(1,0)');


            xAxisG.append('text').attr('class', 'x-axis-lab')
            .attr('x', innerWidth/2).attr('y', 45).text('Population');
}