const dom_AddContent = document.querySelector("#AddContent");
const dom_Add = document.querySelector("#addQ");
const dom_cancel = document.querySelector("#cancelBtn");
const dom_form = document.querySelector(".formAction");
const dom_container = document.querySelector(".container");

// Load questions from localStorage
let questions = JSON.parse(localStorage.getItem("quizQuestions")) || [];
let editingIndex = -1; // Track if we're editing or adding

dom_Add.addEventListener("click", onAdd);
dom_cancel.addEventListener("click", onCancel);
dom_form.addEventListener("submit", onSubmit);

// Load saved questions on page load
loadSavedQuestions();

function hide(element) {
  // TODO
  element.style.display = "none";
}

function show(element) {
  // TODO
  element.style.display = "flex";
}

function loadSavedQuestions() {
  // Clear existing cards (except default ones if any)
  const cards = dom_container.querySelectorAll(".question-card");
  cards.forEach((card) => card.remove());

  // Load and display saved questions
  questions.forEach((q, index) => {
    addQuestionCard(q, index);
  });
}

function addQuestionCard(questionObj, index) {
  // Create new question card
  const newCard = document.createElement("div");
  newCard.className = "question-card";
  newCard.innerHTML = `
    <span class="question-text">${questionObj.question}</span>
    <div class="actions">
      <span class="edit-icon">&#9998;</span>
      <span class="delete-icon">&#128465;</span>
    </div>
  `;

  // Add edit functionality
  const editIcon = newCard.querySelector(".edit-icon");
  editIcon.addEventListener("click", function () {
    editingIndex = index;
    // Populate form with existing data
    document.querySelector("#question").value = questionObj.question;
    document.querySelector("#optionA").value = questionObj.optionA;
    document.querySelector("#optionB").value = questionObj.optionB;
    document.querySelector("#optionC").value = questionObj.optionC;
    document.querySelector("#optionD").value = questionObj.optionD;
    document.querySelector("#correctAnswer").value = questionObj.correctAnswer;
    // Change button text and show form
    const submitBtn = document.querySelector("#submitAddQ");
    submitBtn.textContent = "Update Question";
    show(dom_AddContent);
  });

  // Add delete functionality
  const deleteIcon = newCard.querySelector(".delete-icon");
  deleteIcon.addEventListener("click", function () {
    questions.splice(index, 1);
    localStorage.setItem("quizQuestions", JSON.stringify(questions));
    loadSavedQuestions();
  });

  // Insert before the button
  const btnAdd = document.querySelector(".btn-add");
  dom_container.insertBefore(newCard, btnAdd);
}

function onAdd() {
  // Reset form for adding new question
  editingIndex = -1;
  dom_form.reset();
  const submitBtn = document.querySelector("#submitAddQ");
  submitBtn.textContent = "Add Question";
  show(dom_AddContent);
}

function onCancel() {
  // Reset editing state
  editingIndex = -1;
  dom_form.reset();
  hide(dom_AddContent);
}

function onSubmit(e) {
  e.preventDefault();

  // Get form values
  const question = document.querySelector("#question").value;
  const optionA = document.querySelector("#optionA").value;
  const optionB = document.querySelector("#optionB").value;
  const optionC = document.querySelector("#optionC").value;
  const optionD = document.querySelector("#optionD").value;
  const correctAnswer = document.querySelector("#correctAnswer").value;

  // Create question object
  const questionObj = {
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
  };

  if (editingIndex > -1) {
    // Update existing question
    questions[editingIndex] = questionObj;
    editingIndex = -1;
  } else {
    // Add new question
    questions.push(questionObj);
  }

  // Save to localStorage
  localStorage.setItem("quizQuestions", JSON.stringify(questions));

  // Reload UI
  loadSavedQuestions();

  // Clear form
  dom_form.reset();

  // Hide the form
  hide(dom_AddContent);
}
