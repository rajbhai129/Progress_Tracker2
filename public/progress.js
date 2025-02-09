document.addEventListener("DOMContentLoaded", () => {
  fetchProgressData()
})

async function fetchProgressData() {
  try {
    const response = await fetch("/get-structure");
    const data = await response.json();

    const subjectsProgressContainer = document.getElementById("subjects-progress");
    subjectsProgressContainer.innerHTML = "";

    let overallProgress = 0;
    let overallWeightage = 0;

    data.subjects.forEach((subject, index) => {
      setTimeout(() => {
        const subjectProgress = calculateSubjectProgress(subject);
        overallProgress += subjectProgress * subject.weightage;
        overallWeightage += Number.parseFloat(subject.weightage);

        const subjectElement = createProgressElement(subject, subjectProgress);
        subjectsProgressContainer.appendChild(subjectElement);

        // Update overall progress after each subject is added
        if (index === data.subjects.length - 1) {
          const totalProgress = overallWeightage > 0 ? overallProgress / overallWeightage : 0;
          updateOverallProgress(totalProgress);
        }
      }, index * 100); // Delayed appearance for smooth effect
    });
  } catch (error) {
    console.error("Error fetching progress data:", error);
  }
}


function updateProgress(subjects) {
  const subjectsProgressContainer = document.getElementById("subjects-progress");
  subjectsProgressContainer.innerHTML = "";

  let overallProgress = 0;
  let overallWeightage = 0;

  subjects.forEach((subject) => {
    const subjectProgress = calculateSubjectProgress(subject);
    overallProgress += subjectProgress * subject.weightage;
    overallWeightage += Number.parseFloat(subject.weightage);

    const subjectElement = createProgressElement(subject, subjectProgress);
    subjectsProgressContainer.appendChild(subjectElement);
  });

  const totalProgress = overallWeightage > 0 ? overallProgress / overallWeightage : 0;
  updateOverallProgress(totalProgress);
}

function calculateSubjectProgress(subject) {
  let subjectProgress = 0
  let subjectWeightage = 0

  subject.chapters.forEach((chapter) => {
    const chapterProgress = calculateChapterProgress(chapter)
    subjectProgress += chapterProgress * chapter.weightage
    subjectWeightage += Number.parseFloat(chapter.weightage)
  })

  return subjectWeightage > 0 ? subjectProgress / subjectWeightage : 0
}

function calculateChapterProgress(chapter) {
  let chapterProgress = 0
  let chapterWeightage = 0

  chapter.components.forEach((component) => {
    if (component.completed) {
      chapterProgress += Number.parseFloat(component.weightage)
    }
    chapterWeightage += Number.parseFloat(component.weightage)
  })

  return chapterWeightage > 0 ? chapterProgress / chapterWeightage : 0
}

function generateAvatarColor(name) {
  const colors = [
    "#ffadad", "#ffda77", "#a0c4ff", "#bdb2ff", "#ffc6ff",
    "#9bf6ff", "#ff9b85", "#caffbf", "#fdb44b", "#6a85b6"
  ];
  let hash = 0;
  
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}


function createProgressElement(subject, subjectProgress) {
  const subjectElement = document.createElement("div");
  subjectElement.classList.add("progress-item", "subject");
  const progressPercentage = (subjectProgress * 100).toFixed(2);

  const avatarColor = generateAvatarColor(subject.name);

  subjectElement.innerHTML = `
      <div class="subject-header">
          <div class="avatar" style="background-color: ${avatarColor};">
              ${subject.name[0].toUpperCase()}
          </div>
          <h3>${subject.name} (${subject.weightage}%)</h3>
          <div>
              <span>${progressPercentage}% completed</span>
              <i class="fas fa-chevron-down accordion-icon"></i>
          </div>
      </div>
      <div class="subject-content">
          <div class="progress-bar">
              <div class="progress" style="width: ${progressPercentage}%" data-progress="${progressPercentage}%"></div>
          </div>
          <div class="chapters-container"></div>
      </div>
  `;

  // Add event listeners for accordion functionality
  const subjectHeader = subjectElement.querySelector(".subject-header");
  const subjectContent = subjectElement.querySelector(".subject-content");
  const accordionIcon = subjectElement.querySelector(".accordion-icon");

  subjectHeader.addEventListener("click", () => {
    subjectContent.classList.toggle("active");
    accordionIcon.classList.toggle("active");
  });

  // Render chapters inside the subject
  const chaptersContainer = subjectElement.querySelector(".chapters-container");
  subject.chapters.forEach((chapter) => {
    const chapterProgress = calculateChapterProgress(chapter);
    const chapterElement = createChapterElement(chapter, chapterProgress);
    chaptersContainer.appendChild(chapterElement);
  });

  return subjectElement;
}

function createChapterElement(chapter, chapterProgress) {
  const chapterElement = document.createElement("div");
  chapterElement.classList.add("progress-item", "chapter-item");
  const progressPercentage = (chapterProgress * 100).toFixed(2);

  chapterElement.innerHTML = `
      <div class="chapter-header">
          <h4>${chapter.name} (${chapter.weightage}%)</h4>
          <div>
              <span>${progressPercentage}% completed</span>
              <i class="fas fa-chevron-down accordion-icon"></i>
          </div>
      </div>
      <div class="chapter-content">
          <div class="progress-bar">
              <div class="progress" style="width: ${progressPercentage}%" data-progress="${progressPercentage}%"></div>
          </div>
          <ul class="components-list"></ul>
      </div>
  `;

  // Add event listeners for accordion functionality
  const chapterHeader = chapterElement.querySelector(".chapter-header");
  const chapterContent = chapterElement.querySelector(".chapter-content");
  const accordionIcon = chapterElement.querySelector(".accordion-icon");

  chapterHeader.addEventListener("click", () => {
    chapterContent.classList.toggle("active");
    accordionIcon.classList.toggle("active");
  });

  // Render components inside the chapter
  const componentsList = chapterElement.querySelector(".components-list");
  chapter.components.forEach((component) => {
    const componentItem = document.createElement("li");
    componentItem.innerHTML = `
          <input type="checkbox" ${component.completed ? "checked" : ""} disabled>
          ${component.name} (${component.weightage}%)
      `;
    componentsList.appendChild(componentItem);
  });

  return chapterElement;
}
function updateOverallProgress(progress) {
  const overallProgressBar = document.getElementById("overall-progress");
  const overallProgressText = document.getElementById("overall-progress-text");
  const progressPercentage = (progress * 100).toFixed(2);

  // Update the progress bar width
  overallProgressBar.style.width = `${progressPercentage}%`;

  // Update the progress text
  overallProgressText.textContent = `${progressPercentage}% of total syllabus completed`;

  // Add a checkmark when progress reaches 100%
  if (progressPercentage >= 100) {
    overallProgressText.innerHTML += ` <span class="checkmark">✔️</span>`;
  } else {
    // Remove the checkmark if progress is less than 100%
    const checkmark = overallProgressText.querySelector(".checkmark");
    if (checkmark) {
      checkmark.remove();
    }
  }
}


