let linkPrefix = "/";

if (
    !window.location.host.replace(/(localhost|127\.0\.0\.1)(:\d+)?/i, "")
  ) {

    linkPrefix = "/";
    console.log("Running on local server");
  } 
  else 
  {
    linkPrefix = "/WSOA3029A_1894979/";

    console.log("Running via web server");
  }

let blogItems = []

const pathLocation = window.location.pathname;

if (pathLocation === linkPrefix + "Blogs/AllBlogs.html" || pathLocation === linkPrefix + "Blogs/TheoryBlogs.html" || pathLocation === linkPrefix + "Blogs/WebDevBlogs.html" || pathLocation === linkPrefix + "index.html"){
    fetch(linkPrefix + "JSON/blogPostList.json")
    .then(function(response){
        return response.json();
    })
    .then(function(data) {
        blogItems = data;

        initialiseBlogs();
    })
    .catch(e => {
        console.log(e);
    });
}

let isBlog;


const initialiseBlogs = () =>{


    let blogsToLoad = null;
let blogType = null;
let allBlogs = false;
let blogSemanticAdjust = null;
isBlog = true;

    let blogGrid  = document.querySelector('.blog-post-grid');

    if (document.querySelector('.blog-post-grid') != null){
        blogGrid = document.querySelector('.blog-post-grid');
    }
    else
    {
        blogGrid = document.querySelector('.blog-post-grid-homepage');
    }


    if (pathLocation === linkPrefix || pathLocation === linkPrefix + "index.html")
    {
        blogsToLoad = 2;
        allBlogs = true;
        blogSemanticAdjust = "h3";
    }
    else
    {

        console.log(pathLocation);


        blogSemanticAdjust = "h2";

        blogsToLoad = blogItems.length;
        switch (window.location.pathname)
        {
            case linkPrefix + "Blogs/AllBlogs.html":
                allBlogs = true;
                break;
            case linkPrefix + "Blogs/TheoryBlogs.html":
                blogType = "Theory";
                break;
            case linkPrefix + "Blogs/WebDevBlogs.html":
                blogType = "Website Development";
                break;
        }
    }

    initialiseCards(blogsToLoad, isBlog, blogType, allBlogs, blogGrid, blogSemanticAdjust);


};

let dataVisItems = []

if (pathLocation === linkPrefix + "Visualizations/AllVisualizations.html" || pathLocation === linkPrefix + "index.html"){
    fetch(linkPrefix + "JSON/dataVisList.json")
    .then(function(response){
        return response.json();
    })
    .then(function(data) {
        dataVisItems = data;
        initialiseDataVis();
    })
    .catch(e => {
        console.log(e);
    });
}


const initialiseDataVis = () =>{

    let visToLoad = null;
    const pathLocation = window.location.pathname;
    let visType = null;
    let allVis = false;
    let dataVisSemanticAdjust = null;
    let dataVisGrid;
    isBlog = false;

    if (document.querySelector('.data-vis-grid') != null){
        dataVisGrid = document.querySelector('.data-vis-grid');
    }
    else
    {
        dataVisGrid = document.querySelector('.data-vis-grid-homepage');
    }

    console.log(dataVisGrid);

    allVis = true;


    if (pathLocation === linkPrefix || pathLocation === linkPrefix + "index.html")
    {
        visToLoad = 2;
        dataVisSemanticAdjust = "h3";
    }
    else
    {
        dataVisSemanticAdjust = "h2";
        visToLoad = dataVisItems.length;
        allVis = true;
    }

    initialiseCards(visToLoad, isBlog, visType, allVis, dataVisGrid, dataVisSemanticAdjust);

};

const initialiseCards = (cardsToLoad, isBlogItem, cardType, allItems, gridOne, cardSemanticAdjust) => {

    let cardItems = [];

    if (isBlogItem){
        cardItems = blogItems.slice();
    }else{
        cardItems = dataVisItems.slice();
    }

    console.log("Card Type: " + cardType + cardItems[0].location);
    for (let i=0; i<cardsToLoad; i++){

        if (cardItems[i] !== undefined || cardItems[i] !== null){
            console.log("Card Type: " + cardType + cardItems[0].location);

            if (cardItems[i].type === cardType || allItems === true)
            {
            const section = document.createElement("section");
            const link = document.createElement("a");
            link.className = "blog-card h-entry";
            link.href = linkPrefix + cardItems[i].location + ".html";
        
            const img = document.createElement("img");
            img.src = linkPrefix + cardItems[i].imagePreview.src;
            img.alt = cardItems[i].imagePreview.alt;
            img.width = "320";
            img.height = "202";
            img.title = cardItems[i].imagePreview.imageTitle;
            img.className = "u-featured";

            const cardContentSection = document.createElement("section");
            cardContentSection.className = "card-content"

            const infoSection = document.createElement("section");
            infoSection.className = "card-info"
        
            const infoP = document.createElement("p");

            switch (cardItems[i].type){
                case "Theory":
                    infoP.className = "theory-card p-category";
                    break;
                case "Website Development":
                    infoP.className = "website-card p-category";
                    break;
                case "Data Visualization":
                    infoP.className = "visualization-card p-category";
                    break;
            }

            infoP.innerText = cardItems[i].type;
            infoSection.appendChild(infoP)

            const time = document.createElement("time");
            time.dateTime = new Date(cardItems[i].publishDate);
            time.innerText = `| ${cardItems[i].publishDate}`;
            time.className = "dt-published";
            infoSection.appendChild(time);

            const header = document.createElement("header");
            
            const cardTitle = document.createElement(cardSemanticAdjust);
            cardTitle.innerText = cardItems[i].title;
            cardTitle.className = "p-name";
            header.appendChild(cardTitle);
            
            const linkP = document.createElement("p");
            linkP.innerText = cardItems[i].description;
            linkP.className = "p-summary";
            
            link.appendChild(img);

            cardContentSection.append(infoSection);
            cardContentSection.append(header);
            cardContentSection.append(linkP);
            link.append(cardContentSection);


        
            section.appendChild(link);
        
            gridOne.appendChild(section);
            }
        }

    }
}