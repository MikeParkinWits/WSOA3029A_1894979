const dataBreachURL = "https://haveibeenpwned.com/api/v3/breaches"

let count = 0;

let topBreaches =[];

let numBreachesPerYear = [{"Year": 2010, "DataLoss": 0}, {"Year": 2011, "DataLoss": 0},{"Year": 2012, "DataLoss": 0},{"Year": 2013, "DataLoss": 0},{"Year": 2014, "DataLoss": 0},{"Year": 2015, "DataLoss": 0},{"Year": 2016, "DataLoss": 0},{"Year": 2017, "DataLoss": 0},{"Year": 2018, "DataLoss": 0},{"Year": 2019, "DataLoss": 0}];

let allBreachesInOrder = [];

let dataBreachesInOrder = [];
let dataBreachesInOrderTimeDifferences = [];

var xyz;

var seconds;
var minutes;
var hours;
var days;

let audioObj = new Audio("../../Audio/156667__unfa__stereo-tick.flac");


numBreachesPerYear.find(e => {
    if (e.Year === 2019){
        e.DataLoss += 10;

}
});


// fetch(url, {
//   method: "GET",
//   headers: {
//     "hibp-api-key": "f269230d7044457a910dc8d2d1205013"
//   }
// })
// .then(response => response.json());

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

        loadLineGraph(numBreachesPerYear);
    }
    else if (document.querySelector(".svg-bubble-graph")){
        orderData(data);
    
        LoadBubbleGraph(allBreachesInOrder);
    }
    else
    {
        checkDataArtInput(data);
    }


    
}

getAllDataBreaches().catch(error =>{
    console.error(error);
});

//console.log(d3);



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

    //console.log(numBreachesPerYear);
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

    //console.log(data);

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

    //console.log(numBreachesPerYear);
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

            let g = svgArea.append("g")
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
            
        //console.log(data);
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

const orderData = (data) => {
    data.sort((a,b) => a.PwnCount - b.PwnCount
    )

    data.reverse();

    data.forEach(element => {
        if (element.IsVerified
            && element.Domain != ""){

                let date = parseInt(element.BreachDate.substring(0,4));

        allBreachesInOrder.push({"Name": element.Name, "BreachDate": date, "PwnCount": element.PwnCount, "Description": element.Description, "LogoPath": element.LogoPath});

            }

            //console.log(allBreachesInOrder);
        
    });

    //console.log(numBreachesPerYear);
}

const LoadBubbleGraph = (data) => {

    const svgArea = d3.select("svg"),
        margin = {top:1, right: 1, bottom: 1, left: 1},
        width = svgArea.attr('width') - margin.left - margin.right,
        height = svgArea.attr('height') - margin.top - margin.bottom;
        
    svgArea
    .attr("viewBox", "0 0 750 500")
    .attr("preserveAspectRatio", "xMidYMin meet");

    const bubble = data => d3.pack()
    .size([width, height])
    .padding(2)(d3.hierarchy({ children: data }).sum(d => d.PwnCount));

    //Legend

    const keys = ["2015 and Later", "2014 and Earlier"]

    const color = d3.scaleOrdinal()
    .domain(keys)
    .range(d3.schemeSet1);

    svgArea.selectAll("legendDots")
    .data(keys)
    .enter()
    .append("circle")
        .attr("cx", width-150)
        .attr("cy", function(d,i){ return 20 + i*25})
        .attr("r", 7)
        .style("fill", d => color(d))

    svgArea.selectAll("legendLabels")
    .data(keys)
    .enter()
    .append("text")
        .attr("x", width - 130)
        .attr("y", function(d,i){ return 20 + i*25})
        .style("fill", d => color(d))
        .text(d => d)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")    

        //Visualization
   
const root = bubble(data);
const tooltip = d3.select('.tooltip');

const gElement = svgArea.selectAll()
    .data(root.children)
    .enter().append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

    gElement.transition()
    .ease(d3.easeExpInOut)
    .duration(1000)
    .attr('transform', d => `translate(${d.x}, ${d.y})`);

    //console.log(gElement);
    tooltip
    .on('click', function () {
        console.log("CLOSE");
        
        d3.select(this).select('circle').style('stroke', 'none');
        return tooltip.style('visibility', 'hidden');
    })

gElement
    .on('mouseover', function (e, d) {
        tooltip.select('img').attr('src', d.data.LogoPath);
        tooltip.select('.company-name').text(d.data.Name);
        tooltip.select('.tooltip-breach-year').text(d.data.BreachDate);
        tooltip.select('.tooltip-breach-amount').text(d.data.PwnCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "));
        tooltip.select('.tooltip-breach-description').html(d.data.Description);
        tooltip.style('visibility', 'visible');

        d3.select(this).select('circle').style('stroke', '#808080');
        //console.log(d3.select(this).size())

        /*
        d3.select(this).raise();

        d3.select(this).selectAll(".test").transition()
        .ease(d3.easeLinear)
        .duration(100).style('opacity', 1);

        d3.select(this).select(".name").transition()
        .ease(d3.easeLinear)
        .duration(100).style('opacity', 0);

        d3.select(this).select('circle').transition()
        .ease(d3.easeLinear)
        .duration(200)
        .attr('r', 150);
        */
    })
    .on('mousemove', function (e)
     {        
        if (window.matchMedia("(max-width: 760px)").matches){
            tooltip.style('top', '600px')
            .style('left', '24px')

        }
        else if (window.matchMedia("(max-width: 1024px)").matches)
        {
            tooltip.style('top', `${e.pageY + 50}px`)
                                 .style('left', `${e.pageX - 100}px`)
        }
        else
        {
            tooltip.style('top', `${e.pageY + 30}px`)
                                 .style('left', `${e.pageX - 175}px`)
        }
         
    })
    .on('mouseout', function () {

        /*
        d3.select(this).select('circle').transition()
        .ease(d3.easeLinear)
        .duration(200)
        .attr('r', d => d.r);

        d3.select(this).selectAll(".test").transition()
        .ease(d3.easeLinear)
        .duration(100).style('opacity', 0);

        d3.select(this).select(".name").transition()
        .ease(d3.easeLinear)
        .duration(100).style('opacity', 1);

        */
        
        d3.select(this).select('circle').style('stroke', 'none');
        return tooltip.style('visibility', 'hidden');
    })


const circle = gElement.append('circle')
    .style('fill', function(d) { 
        
        //console.log(d.data.BreachDate);

        if (d.data.BreachDate > 2015){
            return d3.schemeSet1[0];
        }else{
            return d3.schemeSet1[1];
        }                
    })
    .attr('height', d => d.data.PwnCount);

    circle.transition()
    .ease(d3.easeExpInOut)
    .duration(1000)
    .attr('r', d => d.r);
    
    //circle.append('text').select('.test');

    /*
    const label2 = gElement.append('text')
    .attr('y', -70)
    .attr('x', 0)
    .attr('width', '1rem')
    .attr('height', '1rem')
    .attr("text-anchor", "middle")
    .text(d => d.data.name).style('opacity', 0)
    .attr('class', 'test');

    const label3 = gElement.append('text')
    .attr('y', -50)
    .attr('x', 0)
    .attr("text-anchor", "middle")
    .text(d => d.data.score).style('opacity', 0)
    .attr('class', 'test');

    const label4 = gElement.append('text')
    .attr('y', -20)
    .attr('x', 0)
    .attr("text-anchor", "middle")
    .text(d => d.data.category).style('opacity', 0)
    .attr('class', 'test');
             
    */
                

const label = gElement.append('text')
    .attr('y', d => d.r/9)
    .attr("text-anchor", "middle")
    .style("color", "white")
    .text(d => d.data.Name)
    .style("font-size", bubbleLabelFontSize)
    .style('opacity', 0)
    .attr('class', 'name')
    .attr("margin", d => d.r);

    label.transition()
    .delay(700)
    .ease(d3.easeExpInOut)
    .duration(1000)
    .style('opacity', 1)

    function bubbleLabelFontSize(d) {
        let xPad = 8,
            diam = 2 * d.r,
            labelAvailableWidth = diam - xPad,
            labelWidth = this.getComputedTextLength();
      
        if (labelWidth < labelAvailableWidth) {
          return null;
        }

        if ((labelAvailableWidth / labelWidth) < 0) {
            return '0em';
        }
              return (labelAvailableWidth / labelWidth) + 'em';
      }
}

const sortBreachesByDate = (entireDatabase, userDatabase) => {

    /*
    userDatabase.Name = "FirstPossible";
    userDatabase.DateBreached = entireDatabase

    */

    dataBreachesInOrderTimeDifferences = [];
   
    userDatabase.forEach(element => {

        entireDatabase.forEach(dateElement => {

            if (element.Name === dateElement.Name){
                element.DateBreached = dateElement.AddedDate;
            }
    
            
        })
    })

    userDatabase.sort((a,b) => new Date(a.DateBreached) - new Date(b.DateBreached)
    )

    //userDatabase.reverse();

    console.log(userDatabase);

    //console.log(new Date(userDatabase[1].DateBreached) - new Date(userDatabase[0].DateBreached))

    for (let i = 0; i < userDatabase.length - 1; i++){
        dataBreachesInOrderTimeDifferences[i] = new Date(userDatabase[i+1].DateBreached) - new Date(userDatabase[i].DateBreached);
        
        console.log(dataBreachesInOrderTimeDifferences[i]);
    }

    let averageDataBreachTime = null;

    dataBreachesInOrderTimeDifferences.forEach(element => {
        averageDataBreachTime += element;
    })

    averageDataBreachTime = averageDataBreachTime/dataBreachesInOrderTimeDifferences.length;

    console.log(averageDataBreachTime);

    var today = new Date();

    var date = today.getFullYear()+'-'+('0' + (today.getMonth() + 1)).slice(-2)+'-'+('0' + today.getDate()).slice(-2);

var time = today.getHours() + ":" + today.getMinutes() + "Z";

var dateTime = date+'T'+time;

console.log(dateTime);

console.log(new Date((new Date(userDatabase[userDatabase.length-1].DateBreached).getTime()+ averageDataBreachTime)));

let then = (new Date(userDatabase[userDatabase.length-1].DateBreached).getTime()+ averageDataBreachTime);

loadDataArt(then, dateTime);

    // data.forEach(barChartElement => {
    //     if (barChartElement.IsVerified
    //                 && barChartElement.Domain != ""){

    //                     //Bar Graph
    //                     if (count < 10){
    //                         count++;
    //                         topBreaches.push({"Name": barChartElement.Name, "PwnCount": barChartElement.PwnCount});
    //                     }

    //                     //Line Graph
    //                     let date = parseInt(barChartElement.BreachDate.substring(0,4));
                            
    //                     numBreachesPerYear.find(e => {
    //                         if (e.Year === date){
    //                             e.DataLoss += barChartElement.PwnCount;
    //                     }
    //                     });
    //     }
    // });

    //console.log(numBreachesPerYear);
}

const loadDataArt = (then, dateTime) => {

    let then1 = null;

    then1 = then;

    const dataArtArea = document.querySelector(".data-art");

    const dataArtTitle = document.querySelector(".data-art-title");

    const dataArtSub = document.querySelector(".data-art-sub");

    const dataArtDays = document.querySelector(".time-days");
    

    const dataArtHours = document.querySelector(".time-hours");

    const dataArtMinutes = document.querySelector(".time-minutes");

    const dataArtSeconds = document.querySelector(".time-seconds");

    console.log(then);

    let dateNowDiff = null;

    if (then1 < new Date(dateTime)){
        dataArtTitle.innerText = "Watch out! You are overdue for a data breach by ";
        dataArtSub.innerText = "So it could happen any second now...";
    }
    else
    {
        dataArtTitle.innerText = "Your next data breach will happen in";
        dataArtSub.innerText = "But it could also happen at any second now...";
    }

    clearInterval(xyz);
    seconds=0;
    minutes=0;
    hours=0;
    days=0;

    dataArtDays.innerText = ('0' + days).slice(-2);
    dataArtHours.innerText = ('0' + hours).slice(-2);
    dataArtMinutes.innerText = ('0' + minutes).slice(-2);
    dataArtSeconds.innerText = ('0' + seconds).slice(-2);

    audioObj.volume = 0;

 xyz = setInterval(function() {

        if (then1 < new Date(dateTime)){
            dateNowDiff = new Date(Date.now() - then1);
        }
        else
        {
            dateNowDiff = new Date(then1 - Date.now());
        }
    
        console.log(new Date(Date.now()));
    
    
        seconds = Math.floor((dateNowDiff)/1000);
        minutes = Math.floor(seconds/60);
        hours = Math.floor(minutes/60);
        days = Math.floor(hours/24);
    
        hours = hours-(days*24);
        minutes = minutes-(days*24*60)-(hours*60);
        seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);
    
        // console.log("Days: " + days);

        dataArtDays.innerText = days;
    
        // console.log("Hours: " + hours);

        dataArtHours.innerText = ('0' + hours).slice(-2);
    
        // console.log("Minutes: " + minutes);

        dataArtMinutes.innerText = ('0' + minutes).slice(-2);
    
        // console.log("Seconds: " + seconds);

        dataArtSeconds.innerText = ('0' + seconds).slice(-2);

        audioObj.play();

        console.log(audioObj.volume);

        if (audioObj.volume < 0.9){
            audioObj.volume += 0.05;
        }
    
    }, 1000)


}

const checkDataArtInput = (data) =>{
    var ad;


var nam = document.getElementById('inputSave');

nam.addEventListener('click', function() {
    console.log(nam);

    dataBreachesInOrder = null;

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(document.getElementById('input').value))
    {
        ad = encodeURIComponent(document.getElementById('input').value);

        console.log(event.target.Name);
        console.log(ad);
    
        var x = document.querySelector('.data-art');
        var xEmail = document.querySelector('.data-art-email');
        var xNoBreach = document.querySelector('.data-art-no-breach');


        clearInterval(xyz);

        audioObj.pause();

        seconds = 0;
        minutes = 0;
        hours = 0;
        days = 0;

        const url = "https://wits-1894979-proxy.herokuapp.com/https://haveibeenpwned.com/api/v3/breachedaccount/" + ad;

        const getData = async () => {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                  "hibp-api-key": "f269230d7044457a910dc8d2d1205013"
                }
              });

              if (response.ok)
              {
                dataBreachesInOrder = await response.json();
        
                console.log(dataBreachesInOrder);
            
            
                    sortBreachesByDate(data, dataBreachesInOrder);
    
                    xEmail.style.display = "none";
                    x.style.display = "inline-flex";
              }
              else
              {
                xEmail.style.display = "none";
                xNoBreach.style.display = "inline-flex";


              }
            
            
        }
        
        getData().catch(error =>{
            console.error(error);
            getData();
        });
    }
    else
    {
      alert("Please Enter a Valid Email Address")



      return (false)
    }
});

var resetInput = document.getElementById('resetInput');

resetInput.addEventListener('click', function() {
    console.log(resetInput);
        var x = document.querySelector('.data-art');
        var xEmail = document.querySelector('.data-art-email');
        var xNoBreach = document.querySelector('.data-art-no-breach');
    
        x.style.display = "none";
        xEmail.style.display = "inline-flex";
        xNoBreach.style.display = "none";
        document.getElementById('input').value = null;
        ad = document.getElementById('input').value = null;

        audioObj.pause();

        clearInterval(xyz);


});

var resetInputNew = document.getElementById('resetInputNew');


resetInputNew.addEventListener('click', function() {
    console.log(resetInput);
        var x = document.querySelector('.data-art');
        var xEmail = document.querySelector('.data-art-email');
        var xNoBreach = document.querySelector('.data-art-no-breach');
    
        x.style.display = "none";
        xEmail.style.display = "inline-flex";
        xNoBreach.style.display = "none";

        document.getElementById('input').value = null;
        ad = document.getElementById('input').value = null;

        clearInterval(xyz);


});
}