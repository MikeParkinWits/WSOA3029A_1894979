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

  const menuOptions = [
    {title: "Visualizations", link: linkPrefix + "Visualizations/AllVisualizations.html"},
    {title: "Blogs", link: linkPrefix + "Blogs/AllBlogs.html"},
    {title: "About Us", link: linkPrefix + "AboutPage/AboutUs.html"},
]

const initialiseMenuLogo = (ul) => {
    const li = document.createElement("li");
    li.className = "logo";
    const link = document.createElement("a");
    link.href = linkPrefix + "index.html";
    const image = document.createElement("img");
    image.src = linkPrefix + "Images/Logo.png";
    image.width = 66;
    image.height = 55;
    image.alt = "Lost Data Logo";
    link.appendChild(image);

    li.appendChild(link);

    ul.appendChild(li);
}

const initialiseMenu = () =>{

    const navBar = document.querySelector(".navbar");
    const navbarUl = document.createElement("ul");

    initialiseMenuLogo(navbarUl);
    
    const hamburgerButton = document.createElement("button");
    hamburgerButton.type = "button";
    hamburgerButton.className = "hamburger-button";

    const hamburgerButtonImg = document.createElement("img");
    hamburgerButtonImg.src = linkPrefix + "Images/Hamburger_Menu_Image.svg";
    hamburgerButtonImg.width = 20;
    hamburgerButtonImg.height = 14;
    hamburgerButtonImg.alt = "Hamburger Menu";

    hamburgerButton.appendChild(hamburgerButtonImg);


    const hamburgerLi = document.createElement("li");

    hamburgerLi.appendChild(hamburgerButton);

    navbarUl.appendChild(hamburgerLi);

    for (let option of menuOptions){
        const menuOptionsLi = document.createElement("li");
        menuOptionsLi.className = "nav-items";
        const menuOptionsLink = document.createElement("a");
        menuOptionsLink.innerText = option.title;
        menuOptionsLink.href = option.link;

        menuOptionsLi.appendChild(menuOptionsLink);
        navbarUl.appendChild(menuOptionsLi);
    }

    navBar.appendChild(navbarUl);

    HamburgerMenu(hamburgerButton);

};

const initialiseFooter = () =>{
    const footer = document.querySelector(".main-footer");

    const pFooterElements = document.createElement("p");
    pFooterElements.className = "p-name";
    pFooterElements.innerText = "Michael Parkin";
    footer.appendChild(pFooterElements);

    const ulRef = document.createElement("ul");
    const liRef = document.createElement("li");

    const linkRef = document.createElement("a");
    linkRef.innerText = "References"
    linkRef.href = linkPrefix + "ReferencePage/References.html";

    liRef.appendChild(linkRef);
    ulRef.appendChild(liRef);

    footer.appendChild(ulRef);
};

const HamburgerMenu = (hamburger) => {
    const navItems = document.querySelectorAll(".nav-items a");

    hamburger.addEventListener('click', () => {
        for (let i = 0; i< navItems.length; i++){
            navItems[i].classList.toggle("active");
        }
    }
    );
}

let dataItems;


if (document.querySelector(".blog-nav-buttons")){
    fetch(linkPrefix + "JSON/blogPostList.json")
    .then(function(response){
        return response.json();
    })
    .then(function(data) {
        dataItems = data;

        dataItems.reverse();

        NavButtons(true, ".blog-nav-buttons");
        })
    .catch(e => {
        console.log(e);
    });
}
else if (document.querySelector(".data-vis-nav-buttons"))
{
    fetch(linkPrefix + "JSON/dataVisList.json")
    .then(function(response){
        return response.json();
    })
    .then(function(data) {
        dataItems = data;

        dataItems.reverse();
        
        NavButtons(false, ".data-vis-nav-buttons");
    })
    .catch(e => {
        console.log(e);
    });
}

const NavButtons = (isBlogButton, className) => {

    let buttonPage;
    let buttonTextNext;
    let buttonTextPrevious;
    let pageNumMod;

    if (isBlogButton){
        buttonPage = "../AllBlogs/Blog";
        buttonTextNext = "Next Blog"
        buttonTextPrevious = "Previous Blog"

        pageNumMod = 5;
    }
    else
    {
        buttonPage = "../AllVisualizations/Visualization";

        buttonTextNext = "Next Visualization"
        buttonTextPrevious = "Previous Visualization"

        pageNumMod = 14;
    }

    let path = window.location.pathname;
    let pageNum = path.substring(path.lastIndexOf('/') + pageNumMod);
    pageNum = parseInt(pageNum.substring(0, pageNum.lastIndexOf('.')));

    const blogNavButtons = document.querySelector(className);
    
    if (pageNum > 1){

        const buttonAnchor = document.createElement("a");
        buttonAnchor.className = "button";
        buttonAnchor.href = buttonPage + (pageNum - 1) + ".html";
        buttonAnchor.innerText = buttonTextPrevious;
        blogNavButtons.appendChild(buttonAnchor);
    }

    if (pageNum < dataItems.length){

        const buttonAnchor = document.createElement("a");
        buttonAnchor.className = "button";
        buttonAnchor.href = buttonPage + (pageNum + 1) + ".html";
        buttonAnchor.innerText = buttonTextNext;
        blogNavButtons.appendChild(buttonAnchor);
    }

}

document.addEventListener("DOMContentLoaded", () => initialiseMenu(), initialiseFooter());

const scrollToTopButton = document.querySelector(".back-to-top");

window.onscroll = function() {
    scrollFunction()
};


const scrollFunction = () => {

    if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
        scrollToTopButton.style.display = "block";
      } else {
        scrollToTopButton.style.display = "none";
      }
};