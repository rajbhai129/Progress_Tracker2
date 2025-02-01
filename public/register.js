document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form")
  const errorMessage = document.createElement("div")
  errorMessage.style.color = "red"
  registerForm.appendChild(errorMessage)

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    errorMessage.textContent = ""

    const formData = new FormData(registerForm)
    const data = Object.fromEntries(formData)

    if (data.password !== data["confirm-password"]) {
      errorMessage.textContent = "Passwords do not match"
      return
    }

    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        window.location.href = "/"
      } else {
        errorMessage.textContent = result.error || "Registration failed"
      }
    } catch (error) {
      console.error("Error:", error)
      errorMessage.textContent = "An error occurred during registration"
    }
  })
})

