let linkPrefix = "/";

if (
    !window.location.host.replace(/(localhost|127\.0\.0\.1)(:\d+)?/i, "")
  ) {

    linkPrefix = "/";
    console.log("Running on local server (ssh tunnel etc.)");
    // like: "http://127.0.0.1:<my-port>"
  } else {
    
    linkPrefix = "/WSOA3029A_1894979/";

    console.log("Running normally, via web server");
    // like: "http://<my-host-or-ip>:<my-port>"
  }

let dataVisItems = []

fetch(linkPrefix + "JSON/dataVisList.json")
.then(function(response){
    return response.json();
})
.then(function(data) {
    dataVisItems = data;

    initialiseBlogs();
})
.catch(e => {
    console.log(e);
});

let blogsToLoad = null;
const pathLocation = window.location.pathname;
let blogType = null;
let allBlogs = false;
let semanticAdjust = null;

const initialiseBlogs = () =>{
    const blogGrid = document.querySelector('.data-vis-grid');

    if (window.location.pathname === linkPrefix || window.location.pathname === linkPrefix + "index.html")
    {
        blogsToLoad = 1;
        allBlogs = true;
        semanticAdjust = "h3";
    }
    else
    {

        semanticAdjust = "h2";

        blogsToLoad = dataVisItems.length;

        allBlogs = true;
    }



    for (let i=0; i<blogsToLoad; i++){

        if (dataVisItems[i] !== undefined || dataVisItems[i] !== null){

            if (dataVisItems[i].dataVisType === blogType || allBlogs === true)
            {
            const section = document.createElement("section");
            section.className = "h-entry"
            const link = document.createElement("a");
            link.className = "blog-card";
            link.href = linkPrefix + dataVisItems[i].dataVisLocation + ".html";
        
            const img = document.createElement("img");
            img.src = linkPrefix + dataVisItems[i].dataVisImagePreview.src;
            img.alt = dataVisItems[i].dataVisImagePreview.alt;
            img.width = "320";
            img.height = "202";
            img.title = dataVisItems[i].dataVisImagePreview.imageTitle;
            img.className = "u-featured";

            const blogContentSection = document.createElement("section");
            blogContentSection.className = "blog-card-content"

            const infoSection = document.createElement("section");
            infoSection.className = "blog-card-info"
        
        
            const infoP = document.createElement("p");

            switch (dataVisItems[i].dataVisType){
                case "Data Visualization":
                    infoP.className = "visualization-blog p-category";
                    break;
            }

            infoP.innerText = dataVisItems[i].dataVisType;
            infoSection.appendChild(infoP)

            const time = document.createElement("time");
            time.dateTime = new Date(dataVisItems[i].dataVisPubDate);
            time.innerText = dataVisItems[i].dataVisPubDate;
            time.className = "dt-published";
            infoSection.appendChild(time);

            const header = document.createElement("header");

            const blogTitle = document.createElement(semanticAdjust);
            blogTitle.innerText = dataVisItems[i].title;
            blogTitle.className = "p-name";
            header.appendChild(blogTitle);
            
            const linkP = document.createElement("p");
            linkP.innerText = dataVisItems[i].dataVisDescription;
            linkP.className = "p-summary";
            
            
            link.appendChild(img);

            blogContentSection.append(infoSection);
            blogContentSection.append(header);
            blogContentSection.append(linkP);
            link.append(blogContentSection);
        
            section.appendChild(link);
        
            blogGrid.appendChild(section);
            }
        }

    }

};