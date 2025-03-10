const accordionState = new Map()

function toggleAccordion(element, id) {
  const content = element.nextElementSibling
  const icon = element.querySelector(".accordion-icon")
  content.classList.toggle("active")
  icon.classList.toggle("active")
  accordionState.set(id, content.classList.contains("active"))
}

function isAccordionOpen(id) {
  return accordionState.get(id) || false
}

document.addEventListener("DOMContentLoaded", () => {
  fetchChaptersAndComponents();
});

async function fetchChaptersAndComponents() {
  try {
    const response = await fetch("/get-structure");
    const data = await response.json();

    const subjectsContainer = document.getElementById("subjects");
    subjectsContainer.innerHTML = "";

    // Render each subject with its chapters and components
    data.subjects.forEach((subject, index) => {
      setTimeout(() => {
        const subjectElement = createSubjectElement(subject);
        subjectsContainer.appendChild(subjectElement);
      }, index * 100); // Staggered delay for better effect
    });

    // Update progress after rendering
    updateProgress();
  } catch (error) {
    console.error("Error fetching structure:", error);
  }
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



function createSubjectElement(subject) {
  const subjectElement = document.createElement("div");
  subjectElement.classList.add("subject");
  subjectElement.dataset.id = subject.id;

  // Generate a random color for the avatar
  const avatarColor = generateAvatarColor(subject.name);

  subjectElement.innerHTML = `
    <div class="subject-header">
      <div class="avatar" style="background-color: ${avatarColor};">
        ${subject.name[0].toUpperCase()}
      </div>
      <h3>${subject.name} (${subject.weightage}%)</h3>
      <div>
        <button class="edit-subject">Edit</button>
        <button class="delete-subject">Delete</button>
        <i class="fas fa-chevron-down accordion-icon"></i>
      </div>
    </div>
    <div class="subject-content">
      <div class="progress-bar">
        <div class="progress" style="width: 0%"></div>
      </div>
      <form class="add-chapter">
        <input type="hidden" name="subjectId" value="${subject.id}">
        <input type="text" name="name" placeholder="Chapter Name" required>
        <input type="number" name="weightage" placeholder="Weightage (%)" required>
        <button type="submit">Add Chapter</button>
      </form>
      <div class="chapters"></div>
    </div>
  `;

  // Event Listeners for subject interactions
  const subjectHeader = subjectElement.querySelector(".subject-header");
  const subjectContent = subjectElement.querySelector(".subject-content");
  const accordionIcon = subjectElement.querySelector(".accordion-icon");

  if (isAccordionOpen(`subject-${subject.id}`)) {
    subjectContent.classList.add("active");
    accordionIcon.classList.add("active");
  }

  subjectHeader.addEventListener("click", () => {
    toggleAccordion(subjectHeader, `subject-${subject.id}`);
  });

  subjectElement.querySelector(".edit-subject").addEventListener("click", (e) => {
    e.stopPropagation();
    editSubject(subject);
  });
  
  subjectElement.querySelector(".delete-subject").addEventListener("click", (e) => {
    e.stopPropagation();
    deleteSubject(subject.id);
  });
  
  subjectElement.querySelector(".add-chapter").addEventListener("submit", addChapter);

  const chaptersContainer = subjectElement.querySelector(".chapters");
  subject.chapters.forEach((chapter) => {
    const chapterElement = createChapterElement(chapter);
    chaptersContainer.appendChild(chapterElement);
  });

  return subjectElement;
}


function createChapterElement(chapter) {
  const chapterElement = document.createElement("div");
  chapterElement.classList.add("chapter");
  chapterElement.dataset.id = chapter.id;

  chapterElement.innerHTML = `
    <div class="chapter-header">
      <h4>${chapter.name} (${chapter.weightage}%)</h4>
      <div>
        <input type="checkbox" class="chapter-checkbox">
        <button class="edit-chapter">Edit</button>
        <button class="delete-chapter">Delete</button>
        <i class="fas fa-chevron-down accordion-icon"></i>
      </div>
    </div>
    <div class="chapter-content">
      <div class="progress-bar">
        <div class="progress" style="width: 0%"></div>
      </div>
      <form class="add-component">
        <input type="hidden" name="chapterId" value="${chapter.id}">
        <input type="text" name="name" placeholder="Component Name" required>
        <input type="number" name="weightage" placeholder="Weightage (%)" required>
        <button type="submit">Add Component</button>
      </form>
      <div class="components"></div>
    </div>
  `;

  const chapterHeader = chapterElement.querySelector(".chapter-header");
  const chapterContent = chapterElement.querySelector(".chapter-content");
  const accordionIcon = chapterElement.querySelector(".accordion-icon");

  if (isAccordionOpen(`chapter-${chapter.id}`)) {
    chapterContent.classList.add("active");
    accordionIcon.classList.add("active");
  }

  chapterHeader.addEventListener("click", () => {
    toggleAccordion(chapterHeader, `chapter-${chapter.id}`);
  });

  chapterElement.querySelector(".edit-chapter").addEventListener("click", (e) => {
    e.stopPropagation();
    editChapter(chapter);
  });

  chapterElement.querySelector(".delete-chapter").addEventListener("click", (e) => {
    e.stopPropagation();
    deleteChapter(chapter.id);
  });

  chapterElement.querySelector(".add-component").addEventListener("submit", addComponent);

  // Add event listener for chapter checkbox
  const chapterCheckbox = chapterElement.querySelector(".chapter-checkbox");
  chapterCheckbox.addEventListener("change", () => {
    toggleChapterCompletion(chapterElement, chapterCheckbox.checked);
  });

  const componentsContainer = chapterElement.querySelector(".components");
  chapter.components.forEach((component) => {
    const componentElement = createComponentElement(component, chapterElement);
    componentsContainer.appendChild(componentElement);
  });

  // Update chapter checkbox state after creating components
  updateChapterCheckbox(chapterElement);

  return chapterElement;
}

function createComponentElement(component, chapterElement) {
  const componentElement = document.createElement("div");
  componentElement.classList.add("component");
  componentElement.dataset.id = component.id;

  componentElement.innerHTML = `
    <label>
      <input type="checkbox" ${component.completed ? "checked" : ""}>
      ${component.name} (${component.weightage}%)
    </label>
    <button class="edit-component">Edit</button>
    <button class="delete-component">Delete</button>
  `;

  const componentCheckbox = componentElement.querySelector("input[type='checkbox']");
  componentCheckbox.addEventListener("change", async () => {
    await updateComponentProgress(component.id, componentCheckbox.checked);
    updateChapterCheckbox(chapterElement);
    const chapterProgress = calculateChapterProgress(chapterElement);
    updateProgressBar(chapterElement.querySelector(".progress-bar"), chapterProgress);
    const overallProgress = calculateOverallProgress();
    updateOverallProgress(overallProgress);
  });

  componentElement.querySelector(".edit-component").addEventListener("click", () => editComponent(component));
  componentElement.querySelector(".delete-component").addEventListener("click", () => deleteComponent(component.id));

  return componentElement;
}

async function addSubject(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  try {
    const response = await fetch("/add-subject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    if (response.ok) {
      form.reset();
      fetchChaptersAndComponents();
    } else {
      console.error("Failed to add subject");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function editSubject(subject) {
  const newName = prompt("Enter new subject name:", subject.name)
  const newWeightage = prompt("Enter new subject weightage:", subject.weightage)

  if (newName && newWeightage) {
    try {
      const response = await fetch(`/edit-subject/${subject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName, weightage: newWeightage }),
      })

      if (response.ok) {
        fetchChaptersAndComponents()
      } else {
        console.error("Failed to update subject")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }
}

async function deleteSubject(subjectId) {
  if (confirm("Are you sure you want to delete this subject?")) {
    try {
      const response = await fetch(`/delete-subject/${subjectId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchChaptersAndComponents()
      } else {
        console.error("Failed to delete subject")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }
}

async function addChapter(event) {
  event.preventDefault()
  const form = event.target
  const formData = new FormData(form)
  const subjectId = formData.get("subjectId")

  try {
    const response = await fetch("/add-chapter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    })

    if (response.ok) {
      form.reset()
      accordionState.set(`subject-${subjectId}`, true)
      await fetchChaptersAndComponents()
    } else {
      console.error("Failed to add chapter")
    }
  } catch (error) {
    console.error("Error:", error)
  }
}

async function editChapter(chapter) {
  const newName = prompt("Enter new chapter name:", chapter.name)
  const newWeightage = prompt("Enter new chapter weightage:", chapter.weightage)

  if (newName && newWeightage) {
    try {
      const response = await fetch(`/edit-chapter/${chapter.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName, weightage: newWeightage }),
      })

      if (response.ok) {
        fetchChaptersAndComponents()
      } else {
        console.error("Failed to update chapter")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }
}

async function deleteChapter(chapterId) {
  if (confirm("Are you sure you want to delete this chapter?")) {
    try {
      const response = await fetch(`/delete-chapter/${chapterId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchChaptersAndComponents()
      } else {
        console.error("Failed to delete chapter")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }
}

async function addComponent(event) {
  event.preventDefault()
  const form = event.target
  const formData = new FormData(form)
  const chapterId = formData.get("chapterId")

  try {
    const response = await fetch("/add-component", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    })

    if (response.ok) {
      form.reset()
      accordionState.set(`chapter-${chapterId}`, true)
      await fetchChaptersAndComponents()
    } else {
      console.error("Failed to add component")
    }
  } catch (error) {
    console.error("Error:", error)
  }
}

async function editComponent(component) {
  const newName = prompt("Enter new component name:", component.name)
  const newWeightage = prompt("Enter new component weightage:", component.weightage)

  if (newName && newWeightage) {
    try {
      const response = await fetch(`/edit-component/${component.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName, weightage: newWeightage }),
      })

      if (response.ok) {
        fetchChaptersAndComponents()
      } else {
        console.error("Failed to update component")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }
}

async function deleteComponent(componentId) {
  if (confirm("Are you sure you want to delete this component?")) {
    try {
      const response = await fetch(`/delete-component/${componentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchChaptersAndComponents()
      } else {
        console.error("Failed to delete component")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }
}

async function updateComponentProgress(componentId, completed) {
  try {
    const response = await fetch("/update-progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ componentId, completed }),
    });

    if (!response.ok) {
      console.error("Failed to update progress");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function updateProgress() {
  document.querySelectorAll(".subject").forEach((subjectElement) => {
    const subjectProgress = calculateSubjectProgress(subjectElement);
    updateProgressBar(subjectElement.querySelector(".progress-bar"), subjectProgress);
  });

  const overallProgress = calculateOverallProgress();
  updateOverallProgress(overallProgress);
}

function calculateSubjectProgress(subjectElement) {
  const chapters = subjectElement.querySelectorAll(".chapter");
  let totalProgress = 0;
  let totalWeightage = 0;

  chapters.forEach((chapter) => {
    const chapterWeightage = Number.parseFloat(chapter.querySelector("h4").textContent.match(/(\d+(?:\.\d+)?)%/)[1]);
    const chapterProgress = calculateChapterProgress(chapter);
    totalProgress += chapterProgress * chapterWeightage;
    totalWeightage += chapterWeightage;
  });

  const progress = totalWeightage > 0 ? totalProgress / totalWeightage : 0;
  updateProgressBar(subjectElement.querySelector(".progress-bar"), progress);
  return progress;
}

function calculateChapterProgress(chapterElement) {
  const components = chapterElement.querySelectorAll(".component");
  let totalProgress = 0;
  let totalWeightage = 0;

  if (components.length === 0) {
    // If no components, consider the chapter as 100% complete if its checkbox is checked
    const chapterCheckbox = chapterElement.querySelector("input[type='checkbox']");
    return chapterCheckbox && chapterCheckbox.checked ? 1 : 0;
  }

  components.forEach((component) => {
    const weightage = Number.parseFloat(component.textContent.match(/(\d+(?:\.\d+)?)%/)[1]);
    const completed = component.querySelector("input").checked;
    totalProgress += completed ? weightage : 0;
    totalWeightage += weightage;
  });

  const progress = totalWeightage > 0 ? totalProgress / totalWeightage : 0;
  updateProgressBar(chapterElement.querySelector(".progress-bar"), progress);
  return progress;
}

function calculateOverallProgress() {
  const subjects = document.querySelectorAll(".subject");
  let totalProgress = 0;
  let totalWeightage = 0;

  subjects.forEach((subject) => {
    const weightage = Number.parseFloat(subject.querySelector("h3").textContent.match(/(\d+(?:\.\d+)?)%/)[1]);
    const progress = calculateSubjectProgress(subject);
    totalProgress += progress * weightage;
    totalWeightage += weightage;
  });

  return totalWeightage > 0 ? totalProgress / totalWeightage : 0;
}

function updateProgressBar(progressBarElement, progress) {
  // Change this function
  const progressElement = progressBarElement.querySelector(".progress");
  const progressPercentage = (progress * 100).toFixed(2);
  progressElement.style.width = `${progressPercentage}%`;
  // Add data attribute for the label
  progressElement.setAttribute("data-progress", `${progressPercentage}%`);
}

function updateOverallProgress(progress) {
  const overallProgressBar = document.getElementById("overall-progress").querySelector(".progress");
  const overallProgressText = document.getElementById("overall-progress-text");
  const progressPercentage = (progress * 100).toFixed(2);

  console.log(`Updating overall progress to ${progressPercentage}%`); // Debugging log

  // Update the progress bar width
  overallProgressBar.style.width = `${progressPercentage}%`;

  // Update the progress text
  overallProgressText.textContent = `${progressPercentage}% of total syllabus completed`;

  // Add a checkmark when progress reaches 100%
  if (progressPercentage >= 100) {
    overallProgressText.innerHTML += ` <span class="checkmark">✔️</span>`;
  } else {
    const checkmark = overallProgressText.querySelector(".checkmark");
    if (checkmark) {
      checkmark.remove();
    }
  }
}

function toggleChapterCompletion(chapterElement, isCompleted) {
  const components = chapterElement.querySelectorAll(".component input[type='checkbox']");
  components.forEach((checkbox) => {
    checkbox.checked = isCompleted;
  });

  // Update the progress for the chapter and overall progress
  const chapterProgress = calculateChapterProgress(chapterElement);
  updateProgressBar(chapterElement.querySelector(".progress-bar"), chapterProgress);
  const overallProgress = calculateOverallProgress();
  updateOverallProgress(overallProgress);
}

function updateChapterCheckbox(chapterElement) {
  const components = chapterElement.querySelectorAll(".component input[type='checkbox']");
  const chapterCheckbox = chapterElement.querySelector(".chapter-checkbox");
  const allChecked = Array.from(components).every(checkbox => checkbox.checked);

  chapterCheckbox.checked = allChecked;
}

document.addEventListener("DOMContentLoaded", () => {
  fetchProgressData();
});

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


