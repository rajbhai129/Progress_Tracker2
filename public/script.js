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
  fetchChaptersAndComponents()
  document.querySelector("#add-subject-form").addEventListener("submit", addSubject)
})






async function fetchChaptersAndComponents() {
  try {
    const response = await fetch("/get-structure");
    const data = await response.json();

    const subjectsContainer = document.getElementById("subjects");
    subjectsContainer.innerHTML = "";

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
  const chapterElement = document.createElement("div")
  chapterElement.classList.add("chapter")
  chapterElement.dataset.id = chapter.id

  chapterElement.innerHTML = `
    <div class="chapter-header">
      <h4>${chapter.name} (${chapter.weightage}%)</h4>
      <div>
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
  `

  const chapterHeader = chapterElement.querySelector(".chapter-header")
  const chapterContent = chapterElement.querySelector(".chapter-content")
  const accordionIcon = chapterElement.querySelector(".accordion-icon")

  if (isAccordionOpen(`chapter-${chapter.id}`)) {
    chapterContent.classList.add("active")
    accordionIcon.classList.add("active")
  }

  chapterHeader.addEventListener("click", () => {
    toggleAccordion(chapterHeader, `chapter-${chapter.id}`)
  })

  chapterElement.querySelector(".edit-chapter").addEventListener("click", (e) => {
    e.stopPropagation()
    editChapter(chapter)
  })
  chapterElement.querySelector(".delete-chapter").addEventListener("click", (e) => {
    e.stopPropagation()
    deleteChapter(chapter.id)
  })
  chapterElement.querySelector(".add-component").addEventListener("submit", addComponent)

  const componentsContainer = chapterElement.querySelector(".components")
  chapter.components.forEach((component) => {
    const componentElement = createComponentElement(component)
    componentsContainer.appendChild(componentElement)
  })

  return chapterElement
}

function createComponentElement(component) {
  const componentElement = document.createElement("div")
  componentElement.classList.add("component")
  componentElement.dataset.id = component.id

  componentElement.innerHTML = `
    <label>
      <input type="checkbox" ${component.completed ? "checked" : ""}>
      ${component.name} (${component.weightage}%)
    </label>
    <button class="edit-component">Edit</button>
    <button class="delete-component">Delete</button>
  `

  componentElement.querySelector("input").addEventListener("change", updateComponentProgress)
  componentElement.querySelector(".edit-component").addEventListener("click", () => editComponent(component))
  componentElement.querySelector(".delete-component").addEventListener("click", () => deleteComponent(component.id))

  return componentElement
}

async function addSubject(event) {
  event.preventDefault()
  const form = event.target
  const formData = new FormData(form)

  try {
    const response = await fetch("/add-subject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    })

    if (response.ok) {
      form.reset()
      fetchChaptersAndComponents()
    } else {
      console.error("Failed to add subject")
    }
  } catch (error) {
    console.error("Error:", error)
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

async function updateComponentProgress(event) {
  const checkbox = event.target;
  const componentId = checkbox.closest(".component").dataset.id;
  const completed = checkbox.checked;

  try {
    const response = await fetch("/update-progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ componentId, completed }),
    });

    if (response.ok) {
      // Recalculate progress for the entire structure
      updateProgress();
    } else {
      console.error("Failed to update progress");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function updateProgress() {
  document.querySelectorAll(".subject").forEach((subjectElement) => {
    const subjectProgress = calculateSubjectProgress(subjectElement)
    updateProgressBar(subjectElement.querySelector(".progress-bar"), subjectProgress)
  })

  const overallProgress = calculateOverallProgress()
  updateOverallProgress(overallProgress)
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
  const progressElement = progressBarElement.querySelector(".progress");
  progressElement.style.width = `${progress * 100}%`;
  progressElement.setAttribute("data-progress", `${(progress * 100).toFixed(2)}%`); // Add percentage label
}

function updateOverallProgress(progress) {
  const overallProgressElement = document.getElementById("overall-progress");
  if (!overallProgressElement) {
    // Create overall progress element if it doesn't exist
    const progressElement = document.createElement("div");
    progressElement.id = "overall-progress";
    progressElement.innerHTML = `
      <h2>Overall Progress</h2>
      <div class="progress-bar">
        <div class="progress" style="width: ${progress * 100}%" data-progress="${(progress * 100).toFixed(2)}%"></div>
      </div>
      <p>${(progress * 100).toFixed(2)}% of total syllabus completed</p>
    `;
    document.body.insertBefore(progressElement, document.body.firstChild);
  } else {
    // Update existing overall progress element
    const progressBar = overallProgressElement.querySelector(".progress");
    progressBar.style.width = `${progress * 100}%`;
    progressBar.setAttribute("data-progress", `${(progress * 100).toFixed(2)}%`);
    overallProgressElement.querySelector("p").textContent = `${(progress * 100).toFixed(2)}% of total syllabus completed`;
  }
}

