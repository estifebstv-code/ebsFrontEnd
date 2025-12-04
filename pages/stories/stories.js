let currentStory = {
    title: "",
    description: "",
};

function openStory(title, description) {
    currentStory.title = title;
    currentStory.description = description;

    document.getElementById("storyTitle").innerText = title;
    document.getElementById("storyDescription").innerText = description;

    document.getElementById("storyModal").style.display = "block";
}

function closeStory() {
    document.getElementById("storyModal").style.display = "none";
}

function readFullStory() {
    closeStory();

    document.getElementById("fullStoryTitle").innerText = currentStory.title;

    // Auto-generated long story (can be replaced)
    document.getElementById("fullStoryText").innerText =
        `
${currentStory.title}

${currentStory.description}

Chapter 1:
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eleifend arcu non ligula porta, non bibendum purus tincidunt.

Chapter 2:
Morbi auctor lorem ac nunc elementum pretium. Integer venenatis magna in mi fermentum, eu volutpat purus viverra.

Chapter 3:
Donec pellentesque nec arcu eget pharetra. Quisque et ligula in sapien eleifend tristique.
`;

    document.getElementById("fullStoryPage").classList.remove("hidden");
}

function closeFullStory() {
    document.getElementById("fullStoryPage").classList.add("hidden");
}
