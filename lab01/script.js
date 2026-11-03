function openTab() {
    const tabButtons = document.querySelectorAll(".tab-button");
    // console.log(tabButtons);

    tabButtons.forEach(function (button) {
    
        button.addEventListener("click", function () {
            let tabName = this.dataset.tab;
            console.log(tabName);
            let tabContent = document.getElementById(tabName);

            let allTabButtons = document.querySelectorAll(".tab-button");
            let allTabContent = document.querySelectorAll(".tab-content");

            allTabContent.forEach(content => {
                content.style.display = "none";
            });

            allTabButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            tabContent.style.display = "block";
            this.classList.add("active");
        });
    });
    document.querySelector(".tab-button").click();
}

openTab();