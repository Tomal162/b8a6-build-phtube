document.addEventListener("DOMContentLoaded", function () {
    // Reference the container where category buttons will be added
    const categoryButtonsContainer = document.getElementById("categoryButtonsContainer");

    // Function to create a category button element
    function createCategoryButton(category) {
        const button = document.createElement("button");
		button.classList.add("btn", "btn-primary");
        button.textContent = category.category;
        button.addEventListener("click", function () {
            fetchVideosByCategoryId(category.category_id);
        });
        return button;
    }

    // Function to fetch videos by category ID
    function fetchVideosByCategoryId(categoryId) {
			const fetchURL = `https://openapi.programming-hero.com/api/videos/category/${categoryId}`;
			console.log(fetchURL);
			fetch(fetchURL)
            .then((response) => response.json())
            .then((datas) => {
                const categoryData = datas.data;
				
				const message = datas.message;

				// Display the message in the HTML
				const messageContainer = document.getElementById("message-container");
				messageContainer.textContent = message;
				const cardContainer = document.getElementById("video-container");
				
			

				function convertToHoursAndMinutes(date) {
                const postedDate = new Date(date);
                const now = new Date();
                const diff = now - postedDate;
                const hours = Math.floor(diff / (60 * 60 * 1000));
                const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
                return `${hours}h.${minutes}m ago`;
            }

            // Function to create a card element
            function createCard(video) {
                const card = document.createElement("div");
                card.classList.add("card", "p-4");
                

                const profile_picture = video.authors[0] ? video.authors[0].profile_picture : "Default Profile Picture";
                const views = video.others.views || "N/A";
                const profile_name = video.authors[0].profile_name || "Profile Name not available"
                const posted_date = video.others.posted_date || "N/A";

                card.innerHTML = `
                    <img src="${video.thumbnail}" alt="${video.title}" class="w-full h-40 object-cover mb-4">
                    <div class="flex items-center mb-2">
                        <img src="${profile_picture}" alt="Profile Picture" class="h-8 w-8 rounded-full mr-2">
                        <span class="font-semibold">${video.title}</span>
                        ${video.verified ? '<img src="verified.png" alt="Verified" class="h-4 w-4 ml-2">' : ''}
                    </div>
                    <p class="text-gray-600">${profile_name} &middot; ${convertToHoursAndMinutes(posted_date)}</p>
                    <p class="mt-2">Views: ${views}</p>
                `;
                
                return card;
            }

            // Clear the card container
            cardContainer.innerHTML = "";
          
            // Create and append cards for each video
            categoryData.forEach((video) => {
                const card = createCard(video);
                cardContainer.appendChild(card);
            });
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
    }

    // Fetch data from the API to get categories
    fetch("https://openapi.programming-hero.com/api/videos/categories")
        .then((response) => response.json())
        .then((data) => {
            const categoriesData = data.data;

            // Create and append buttons for each category
            categoriesData.forEach((category) => {
                const categoryButton = createCategoryButton(category);
                categoryButtonsContainer.appendChild(categoryButton);
            });
        })
        .catch((error) => {
            console.error("Error fetching category data:", error);
        });

});
