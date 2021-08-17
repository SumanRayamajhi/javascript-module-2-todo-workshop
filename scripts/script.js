const todos = []

const filters = {
    searchTitle: '',
    showFinished: false,
    showUnfinished: false
}

const el = document.querySelector("#new-todo")
el.addEventListener('submit', (event) => {
    event.preventDefault()
    const text = event.target.elements.text.value.trim()

    if (text.length > 0) {
        createTodo(text)
        event.target.elements.text.value  = ''
    }

    renderTodos(todos)
})

const filterInputEl = document.getElementById("search-text")
filterInputEl.addEventListener("input", (event) => {
    setFilters({
        searchTitle: event.target.value
    })
    renderTodos(todos)
})

const checkboxFinishedEl = document.getElementById('show-finished')
checkboxFinishedEl.addEventListener('change', (event) => {+
    setFilters({
        showFinished: event.target.checked
    })
    renderTodos(todos)
})

const checkboxUnfinishedEl = document.getElementById('show-unfinished')
checkboxUnfinishedEl.addEventListener('change', (event) => {
    setFilters({
        showUnfinished: event.target.checked
    })
    renderTodos(todos)
})


const createTodo = (text) => {
    todos.push(
        {
            title: text,
            completed: false
        }
    )
    saveTodosToLocalStorage()
}

const generateTodoDOM = (todoObj) => {
    const labelEl = document.createElement('label')
    const divEl = document.createElement('div')
    const spanEl = document.createElement('span')

    const checkboxEl = document.createElement('input')
    checkboxEl.setAttribute('type', 'checkbox')
    checkboxEl.checked = todoObj.completed
    divEl.appendChild(checkboxEl)
    checkboxEl.addEventListener("change", () => {
        // debugger
        console.log("toggling ", todoObj.title)
        toggleTodo(todoObj)
        renderTodos(todos)
    })

    // Setup the todo text
    spanEl.textContent = todoObj.title
    divEl.appendChild(spanEl)

    // Setup container
    labelEl.classList.add('list-item')
    divEl.classList.add('list-item__container')
    labelEl.appendChild(divEl)

    const removeButtonEl = document.createElement("button")
    removeButtonEl.textContent = "Remove"
    removeButtonEl.classList.add('button')
    removeButtonEl.classList.add('button--text')
    removeButtonEl.addEventListener('click', () => {
        removeTodo(todoObj.title)
        renderTodos(todos)
    })

    labelEl.appendChild(removeButtonEl)

    return labelEl
}

const renderTodos = (allTodos) => {
    const todoList = document.querySelector('#todos')
    todoList.innerHTML = ''

    let todos = !filters.searchTitle
     ? allTodos
     : allTodos.filter(todo => todo.title.includes(filters.searchTitle))

    if (filters.showFinished && filters.showUnfinished) {
        // 
    }
    else if (filters.showFinished) {
        todos = todos.filter(todo => todo.completed)
    }
    else if (filters.showUnfinished) {
        todos = todos.filter(todo => !todo.completed)
    }

    if (todos.length > 0) {
        for (var i = 0; i < todos.length; i++) {
            todoList.appendChild(generateTodoDOM(todos[i]))
        }
    }
    else {
        const messageEl = document.createElement('p')
        messageEl.classList.add('empty-message')
        messageEl.textContent = 'There are no todos to show'
        todoList.appendChild(messageEl)
    }
}

const removeTodo = (title) => {
  const todoIndex = todos.findIndex((todo) => todo.title === title)

  if (todoIndex > -1) {
      todos.splice(todoIndex, 1)
  }
}

const toggleTodo = (todo) => {
    if (todo) {
        todo.completed = !todo.completed
    }
    saveTodosToLocalStorage()
}

const setFilters = (updates) => {
    if (!updates) {
        return
    }

   if (typeof updates.searchTitle === "string") {
       filters.searchTitle = updates.searchTitle
   }

    if (typeof updates.showFinished === "boolean") {
        filters.showFinished = updates.showFinished
    }

    if (typeof updates.showUnfinished === "boolean") {
        filters.showUnfinished = updates.showUnfinished
    }

    console.log(filters)
}

const saveTodosToLocalStorage = () => {
    localStorage.setItem("todos", JSON.stringify(todos))
}

const fetchTodosFromLocalStorage = () => {
    const todosJSON = localStorage.getItem("todos")
    
    todos = !todosJSON ? JSON.parse(todosJSON) : []
}

// console.log(fetchTodosFromLocalStorage)

renderTodos(todos)