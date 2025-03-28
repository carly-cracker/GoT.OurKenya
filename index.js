document.addEventListener('DOMContentLoaded',main)

const topBar = document.getElementById("safari-packages")
function fetchImages (){
    return fetch('http://localhost:3000/safaris')
    .then ((res) => res.json())
    .then((safaris) => {
        topBar.classList.add('image-gallery');
            
            safaris.forEach(safari => {
                const imgSafari = document.createElement("img");
                imgSafari.src = safari.image;
                imgSafari .alt = safari.name;

                const imageContainer = document.createElement("div");
                imageContainer.classList.add('gallery-item');
                
                imageContainer.appendChild(imgSafari);

                const nameSafari = document.createElement("p");
                nameSafari.textContent = safari.name;
                nameSafari.classList.add('image-caption');
                imageContainer.appendChild(nameSafari);

                const safariPrice = document.createElement("p");
                safariPrice.textContent = safari.pricing;
                safariPrice.classList.add('image-price');
                imageContainer.appendChild(safariPrice);

                const safariSite =document.createElement("h4")
                safariSite.textContent = safari.location
                safariSite.classList.add('image-caption')
                imageContainer.appendChild(safariSite)

                const exploreButton = document.createElement("button");
                exploreButton.textContent = "Explore";
                exploreButton.classList.add("explore-btn")
                imageContainer.appendChild(exploreButton)

                imageContainer.addEventListener("click", (event)=>{
                    event.preventDefault()
                    handleSafariClick(safari)
                    document.getElementById("display").scrollIntoView({behavior:"smooth"})
            })
                

                topBar.appendChild(imageContainer);
            });
        })
        .catch(error => {
            console.error("Error fetching images:", error)
        });
}

const safariInfo = document.getElementById("safari-detail")
function fetchDetails(){
 return fetch(`http://localhost:3000/safaris/${safariId}`)
 .then((res)=>res.json())
 .then(handleSafariClick)
 .catch(error => console.error("Error fetching safari details:", error))
}

function handleSafariClick(safari){
    safariInfo.innerHTML=""
    const safariName = document.createElement("h3")
    safariName.innerHTML =safari.name
    safariName.classList.add('image-caption')
    safariName.style.fontSize = "25px"
    safariName.style.textAlign = "center"
    

    const imgSafari = document.createElement("img")
    imgSafari.src = safari.image
    imgSafari.alt = safari.name
    imgSafari.style.width = "700px"; 
    imgSafari.style.height = "500px"; 
    imgSafari.style.objectFit = "cover"; 
    imgSafari.style.borderRadius = "10px"; 
    imgSafari.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.5)";
    imgSafari.style.display = "block"
    imgSafari.style.margin = "20px auto"

    const safariDetails = document.createElement("h6")
    safariDetails.style.color= '#fff'
    safariDetails.style.fontSize = "16px"
    safariDetails.style.lineHeight = "1.6";  
    safariDetails.style.padding = "10px";  
    safariDetails.style.background = "rgba(0, 0, 0, 0.6)"; 
    safariDetails.style.borderRadius = "10px"; 
    safariDetails.style.textAlign = "center"; 
    safariDetails.style.marginTop = "10px"

    const likeButton = document.createElement("button");
    likeButton.textContent = `🤍`;
    likeButton.type = "button"
    likeButton.style.display = "flex";
    likeButton.style.margin = "10px auto";
    likeButton.style.padding = "10px";
    likeButton.style.background = "#ff4757";
    likeButton.style.color = "white";
    likeButton.style.border = "none";
    likeButton.style.borderRadius = "5px";
    likeButton.style.cursor = "pointer";

    const likeDisplay = document.createElement("p");
    likeDisplay.textContent = `${safari.likes}`;
    likeDisplay.style.textAlign = "center";
    likeDisplay.style.color = "#fff";

    likeButton.addEventListener("click", (event) => {
        event.preventDefault()
        event.stopPropagation()
    currentLikes = parseInt(likeDisplay.textContent,10) || 0
    let newLikes = currentLikes + 1
    likeDisplay.textContent = newLikes;
    updateLikeCount(safari.id, newLikes).then(() => {
       })
})
    safariDetails.innerHTML = safari.details
    safariInfo.appendChild(safariName)
    safariInfo.appendChild(imgSafari)
    safariInfo.appendChild(safariDetails)
    safariDetails.appendChild(likeDisplay)
    safariDetails.appendChild(likeButton)
}

const searchInput = document.getElementById("search-bar");
const resultBar = document.getElementById("results");
let safaris = [];

function fetchData() {
    fetch("http://localhost:3000/safaris")
        .then((res) => res.json())
        .then((data) => {
            safaris = data;
        })
        .catch((error) => console.error("Error fetching data:", error));
}

searchInput.addEventListener("input", () => {
    const searchText = searchInput.value.toLowerCase();
    const filteredResults = safaris.filter(safari =>
        safari.name.toLowerCase().includes(searchText)
    );

    displayResults(filteredResults);
});

function displayResults(results) {
    resultBar.innerHTML = ""; 

    if (results.length === 0) {
        resultBar.innerHTML = "<p>No safaris found.</p>";
        return;
    }

    results.forEach(safari => {
        const safariItem = document.createElement("div");
        
        const safariLink = document.createElement("a")
        safariLink.textContent = safari.name;
        safariLink.href = "#display";
        
        safariLink.addEventListener("click", (event) =>{
            event.preventDefault();
            handleSafariClick(safari)
            document.getElementById("display").scrollIntoView({ behavior: "smooth" })
        });

       safariItem.appendChild(safariLink)
        resultBar.appendChild(safariItem);
    });
}
 
 function updateLikeCount(safariId, newLikes) {
    return fetch(`http://localhost:3000/safaris/${safariId}`, {
         method: "PATCH",
         headers: {
             "Content-Type": "application/json"
         },
         body: JSON.stringify({ likes: newLikes })
     })
     .then((res) => {
        if (!res.ok) {
            throw new Error(`Failed to update likes (Status: ${res.status})`);
        }
        return res.json();
    })
     .then((updatedSafari) => console.log("Likes updated:", updatedSafari))
     .catch((error) => console.error("Error updating likes:", error));
}


function main(){
    fetchImages()
    fetchData()
}