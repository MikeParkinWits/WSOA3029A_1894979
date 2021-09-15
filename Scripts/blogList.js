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

let blogItems = []

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


let blogsToLoad = null;
const pathLocation = window.location.pathname;
let blogType = null;
let allBlogs = false;
let semanticAdjust = null;

const initialiseBlogs = () =>{
    const blogGrid = document.querySelector('.blog-post-grid');

    if (window.location.pathname === linkPrefix || window.location.pathname === linkPrefix + "index.html")
    {
        blogsToLoad = 2;
        allBlogs = true;
        semanticAdjust = "h3";
    }
    else
    {

        console.log(window.location.pathname);


        semanticAdjust = "h2";

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



    for (let i=0; i<blogsToLoad; i++){

        if (blogItems[i] !== undefined || blogItems[i] !== null){

            if (blogItems[i].blogType === blogType || allBlogs === true)
            {
            const section = document.createElement("section");
            const link = document.createElement("a");
            link.className = "blog-card h-entry";
            link.href = linkPrefix + blogItems[i].blogLocation + ".html";
        
            const img = document.createElement("img");
            img.src = linkPrefix + blogItems[i].blogImagePreview.src;
            img.alt = blogItems[i].blogImagePreview.alt;
            img.width = "320";
            img.height = "202";
            img.title = blogItems[i].blogImagePreview.imageTitle;
            img.className = "u-featured";
        
            const header = document.createElement("header");
            const headerP = document.createElement("p");

            switch (blogItems[i].blogType){
                case "Theory":
                    headerP.className = "theory-blog p-category";
                    break;
                case "Website Development":
                    headerP.className = "website-blog p-category";
                    break;
            }




            headerP.innerText = blogItems[i].blogType;
            header.appendChild(headerP)

            const time = document.createElement("time");
            time.dateTime = new Date(blogItems[i].blogPubDate);
            time.innerText = blogItems[i].blogPubDate;
            time.className = "dt-published";
            header.appendChild(time);
            
            const blogTitle = document.createElement(semanticAdjust);
            blogTitle.innerText = blogItems[i].title;
            blogTitle.className = "p-name";
            header.appendChild(blogTitle);
            
            const linkP = document.createElement("p");
            linkP.innerText = blogItems[i].blogDescription;
            linkP.className = "p-summary";
            
            link.appendChild(img);
            link.appendChild(header);
            link.appendChild(linkP);
        
            section.appendChild(link);
        
            blogGrid.appendChild(section);
            }
        }

    }

};