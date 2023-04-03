const selectAll = document.getElementById('select-all')
const todoActions = document.querySelectorAll('.todo-table-action')

todoChecksFunc();

function todoChecksFunc(){
    const todoChecks = document.querySelectorAll('.todo-check')

    selectAll.onchange = function(){
        todoChecks.forEach(item => {
            item.checked = selectAll.checked;
        })
        todoActions[0].classList.toggle('active', !selectAll.checked);
        todoActions[1].classList.toggle('active', selectAll.checked);
    }

    todoChecks.forEach(item=> {
        item.onchange = function() {
            const listCheck = Array.from(todoChecks).map(i=> {
                return i.checked
            })

            todoActions[0].classList.toggle('active', !listCheck.includes(true))
            todoActions[1].classList.toggle('active', listCheck.includes(true))

            selectAll.checked = !listCheck.includes(false)
        }
    })

}

function resetCheck() {
    selectAll.checked = false

    todoActions[0].classList.toggle('active', !selectAll.checked)
    todoActions[1].classList.toggle('active', selectAll.checked)
}

!localStorage.getItem('todo') && localStorage.setItem('todo', JSON.stringify([]));
const formAction = document.querySelector('.todo-form');
const todoBody = document.querySelector('.todo-table-body');
renderTodo()

formAction.onsubmit = function(e){
    e.preventDefault();
    const todo = JSON.parse(localStorage.getItem('todo'));
    if(e.target.todo.value){
        const newTodo = {
            id : getMaxId() + 1,
            todo : e.target.todo.value,
            completed: false
        }
        localStorage.setItem('todo', JSON.stringify([newTodo, ...todo]));
        formAction.reset()
        renderTodo()
    }
}

function getMaxId(){
    const todo = JSON.parse(localStorage.getItem('todo'));
    const listId = todo.map(item => item.id);
    return todo.length > 0 ? Math.max(...listId) : 0;
}

function renderTodo(){
    todoBody.innerHTML = "";
    const todo = JSON.parse(localStorage.getItem('todo'));
    if(todo.length > 0){
        todo.forEach(item => {
        const template = `
            <tr class="${item.completed ? "completed" : ''}">
                <td>
                    <input type="checkbox" class="todo-check" id="${item.id}">
                </td>  
                <td>  
                    <div class="todo-item">
                        <input type="text" class="todo-text" ondblclick="changeCompleted(this, ${item.id})" value="${item.todo}" readonly />
                        <div class="todo-item-action">
                            <span onclick="editTodo(this, ${item.id})"><i class="ri-edit-line"></i></span>
                            <span onclick="deleteTodo(${item.id})"><i class="ri-delete-bin-line"></i></span>
                        </div>
                    </div>
                </td>    
            </tr>
            `;
            todoBody.insertAdjacentHTML('beforeend', template);
        });   
    }else{
        const template = `
            <tr>
                <td colspan="2">No todo</td>
            </tr>
        `;

        todoBody.insertAdjacentHTML('beforeend', template)
    }
    todoChecksFunc()
}

function editTodo(el, id){
    const todoText = el.closest('.todo-item').querySelector('.todo-text');
    todoText.removeAttribute('readonly');
    todoText.focus()

    todoText.onblur = function(){
        todoText.setAttribute('readonly', '');
        updateTodo(id, todoText.value);
    }

    todoText.onkeydown = function(e){
        if(e.key == 'Enter'){
            e.preventDefault();
            todoText.onblur();
        }
    }
}

function updateTodo(id, val){
    if(val){
        const todo = JSON.parse(localStorage.getItem('todo'));
        const todoIndex = todo.findIndex(i => i.id == id);
        todo[todoIndex].todo = val;
        localStorage.setItem('todo', JSON.stringify(todo));
    }

    renderTodo();
}

function deleteTodo(id){
    const todo = JSON.parse(localStorage.getItem('todo'));
    const newTodo = todo.filter(item => item.id != id);
    localStorage.setItem('todo', JSON.stringify(newTodo));
    renderTodo();
}

function deleteManyItems(){
    let todo = JSON.parse(localStorage.getItem('todo'));
    const todoChecks = document.querySelectorAll('.todo-check');

    todoChecks.forEach(item => {
        if(item.checked){
            todo = todo.filter(i => i.id != item.id);
        }
    });
    localStorage.setItem('todo', JSON.stringify(todo));
    renderTodo();
    resetCheck();
}

function changeCompleted(el, id) {
    if(el.getAttribute('readonly') == '') {
        const todo = JSON.parse(localStorage.getItem('todo'))
        const todoIndex = todo.findIndex(i=> i.id == id)

        todo[todoIndex].completed = !todo[todoIndex].completed
    
        localStorage.setItem('todo', JSON.stringify(todo))
    
        renderTodo()
    }
}

function changeCompletedMany(status) {
    let todo = JSON.parse(localStorage.getItem('todo'));
    const todoChecks = document.querySelectorAll('.todo-check');

    todoChecks.forEach(item => {
        if(item.checked){
            const todoIndex = todo.findIndex(i => i.id == item.id);
            todo[todoIndex].completed = status;
        }
    })
    
    localStorage.setItem('todo', JSON.stringify(todo))
    
    renderTodo();
    resetCheck();
}