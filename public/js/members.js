


// Wait for the DOM to completely load before we run our JS
document.addEventListener('DOMContentLoaded', (e) => {
  console.log('dom loaded!');

  const todoContainer = document.querySelector('.media-block');
  const todoForm = document.querySelector('.panel-body');
 const bigdiv = document.querySelector(".panel");
 bigdiv.appendChild(todoForm);
  let userID = 0;

  // Inital todos array
  let todos = [];
let comments = [];
  // Helper function to hide items
  const hide = (el) => {
    el.style.display = 'none';
  };
  const show = (el) => {
    el.style.display = 'inline';
  };

  // This function resets the todos displayed with new todos from the database
  const initializeRows = () => {
    todoContainer.innerHTML = '';
    const rowsToAdd = [];
    for (let i = 0; i < todos.length; i++) {
      rowsToAdd.push(createNewRow(todos[i]));
    }

    rowsToAdd.forEach((row) => todoContainer.prepend(row));
  };
//GRAB COMMENT 
// const Getcomment = () => {
//   fetch('/api/Comments', {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log('comments', data.id);
//       commentsId = data.id;
//       userID = data.id;
//       comrow();
//     });
// };
// Getcomment();
  // Helper function to grab todos
  const getTodos = () => {
    fetch('/api/user_data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('user:', data.id);
        userID = data.id;
      });

    fetch('/api/todos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

      .then((response) => response.json())
      .then((data) => {
        console.log('Success in getting todos:', data);
        todos = data;
        comments = data.id;

        initializeRows();
      
    });
    fetch('/api/Comments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
    .then((data) => {
     
      todos = data.id;
      userID = data.id;
      comrow();
    });
// };
  
  };

  getTodos();

  // Helper function to delete a todo
  const deleteTodo = (e) => {
    e.stopPropagation();
    const { id } = e.target.dataset;
    fetch(`/api/todos/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
    .then((data) => {
      console.log('todo by id:', data[0]);
      if (userID == data[0].userId) {
        fetch(`/api/todos/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(getTodos);
      } else {
        alert("not your post!!!");
      }
    });

    
  };

  // Function to handle the editing of a todo when input is clicked
  const editTodo = (e) => {
    e.stopPropagation();
    const { id } = e.target.dataset;
    console.log(id)
    fetch(`/api/todos/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
    .then((data) => {
      console.log('todo by id:', data[0]);
      if (userID == data[0].userId){
        const itemChildren = e.target.children;
        // console.log('editTodo -> itemChildren', itemChildren);
        for (let i = 0; i < itemChildren.length; i++) {
          const currentEl = itemChildren[i];
    
          if (currentEl.tagName === 'INPUT') {
            currentEl.value = currentEl.parentElement.children[0].innerText;
            show(currentEl);
            currentEl.focus();
          }
    
          if (currentEl.tagName === 'P' || currentEl.tagName === 'BUTTON') {
            hide(currentEl);
          }
        }
      } else {
        alert("You don't have access, Your input was illegal and has been reported to the athurities");
      }
    });

  };

  // Function to handle when a user cancels editing
  const cancelEdit = (e) => {
    const itemParent = e.target.parentElement;
    if (itemParent) {
      for (let i = 0; i < itemParent.children.length; i++) {
        const currentChild = itemParent.children[i];

        if (currentChild.tagName === 'INPUT') {
          hide(currentChild);
        } else {
          show(currentChild);
        }
      }
    }
  };

  // Update a todo (PUT)
  const updateTodo = (todo) => {
    console.log('attempting to update with', todo);
    fetch('/api/todos', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    }).then((response) => console.log(response));
  };

  // Function to call when we are finished editing a todo
  const finishEdit = (e) => {
    if (e.keyCode === 13) {
      const itemParent = e.target.parentElement;
      const updatedTodo = {
        text: e.target.value.trim(),
        completed: false,
        id: e.target.dataset.id,
      };

      // Update the text in the dom
      itemParent.childNodes[0].innerText = updatedTodo.text;

      // Call on our helper function to preform a PUT request
      updateTodo(updatedTodo);

      if (itemParent) {
        for (let i = 0; i < itemParent.children.length; i++) {
          const currentChild = itemParent.children[i];

          if (currentChild.tagName === 'INPUT') {
            hide(currentChild);
          } else {
            show(currentChild);
          }
        }
      }
    }
  };
  const comrow = () => {
    todoForm.innerHTML = '';
    const rowsToAdd = [];
    for (let i = 0; i < comments.length; i++) {
      rowsToAdd.push(createNewComment(comments[i]));
    }

    rowsToAdd.forEach((row) => todoForm.prepend(row));
  };
 //comment section 
  const createNewComment = (comments) => {
    // Containing row
    const newcomerow = document.createElement('div');
    newcomerow.classList.add("comment");
const inpfor = document.createElement("input");
newcomerow.appendChild(inpfor);
    const space = document.createElement("hr");
    newcomerow.appendChild(space);
    newcomerow.setAttribute('complete', comments.complete);
    newcomerow.setAttribute('data-id', comments.id);
  }

  // Construct a todo-item row
  const createNewRow = (todo) => {
    // Containing row
    const newInputRow = document.createElement('div');
    newInputRow.classList.add("media-block");;
    const space = document.createElement("hr");
    newInputRow.appendChild(space);
    newInputRow.setAttribute('complete', todo.complete);
    newInputRow.setAttribute('data-id', todo.id);
// pic 

   var url = "https://bootdey.com/img/Content/avatar/avatar1.png";
      var img = document.createElement("a");
      var im = document.createElement("img")
      im.src = url;

    im.classList.add("img-circle" , "img-sm","media-left");
    img.appendChild(im);
    newInputRow.appendChild(img);


    // div for p
    const newdiv = document.createElement("div");
    newdiv.className = "media-body"; 
    // Span
    const rowSpan = document.createElement('p');
    rowSpan.innerText = todo.text;
    rowSpan.setAttribute('data-id', todo.id);

    // Input field
    const rowInput = document.createElement('input');
    rowInput.setAttribute('type', 'text');
    rowInput.classList.add('edit');
    rowInput.style.display = 'none';
    rowInput.setAttribute('data-id', todo.id);

// like buton
const buttondiv = document.createElement("div");
    buttondiv.className = "pad-ver";
    newdiv.appendChild(buttondiv);
    const divbtn = document.createElement("div");
    divbtn.className = "btn-group";
    buttondiv.appendChild(divbtn);
    const likebtn = document.createElement("a")
    likebtn.classList.add("fa", "fa-thumbs-up", "btn-sm", "btn", "btn-default","btn-hover-success" );
    divbtn.appendChild(likebtn);
    
    // dislike butn 
  
    const disbtn = document.createElement("a")
    disbtn.classList.add("fa","fa-thumbs-down","btn","btn-sm","btn-default","btn-hover-danger")
    divbtn.appendChild(disbtn);
// commentbtn 
    const cmtbtn = document.createElement("a")
    cmtbtn.classList.add("btn","btn-sm","btn-default","btn-hover-primary");
    cmtbtn.innerText = 'Comment'
    buttondiv.appendChild(cmtbtn);
    cmtbtn.addEventListener('click',createNewComment);

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.classList.add('delete', 'btn', 'btn-danger');
    delBtn.setAttribute('data-id', todo.id);
    rowInput.setAttribute('data-id', todo.id);
    buttondiv.appendChild(delBtn);
    delBtn.innerText = 'Delete';
    delBtn.addEventListener('click', deleteTodo);
    

    // Complete button
    // const completeBtn = document.createElement('button');
    // completeBtn.classList.add('complete', 'btn', 'btn-primary');
    // completeBtn.innerText = 'Edit';
    // completeBtn.setAttribute('data-id', todo.id);

    // completeBtn.addEventListener('click', toggleComplete);

    // Add event listener for editing
    newInputRow.addEventListener('click', editTodo);
    newInputRow.setAttribute('data-id', todo.id);
    rowInput.addEventListener('blur', cancelEdit);
    rowInput.addEventListener('keyup', finishEdit);

    // Append all items to the row
    newInputRow.appendChild(rowSpan);
    newInputRow.appendChild(rowInput);
    // newInputRow.appendChild(delBtn);
    // newInputRow.appendChild(completeBtn);
    newInputRow.appendChild(newdiv);
    // newInputRow.appendChild(buttondiv);
    // newInputRow.appendChild(divbtn);



    return newInputRow;
  };

  // const toggleComplete = (e) => {
  //   e.stopPropagation();
  //   const spanEl = e.target.parentNode.children[0];
  //   const currentTodo = {
  //     text: e.target.parentNode.children[0].innerText,
  //     complete: false,
  //     id: e.target.dataset.id,
  //   };
  //   currentTodo.complete = !currentTodo.complete;

  //   updateTodo(currentTodo);
  //   console.log('toggleComplete -> currentTodo', currentTodo);
  // };

  // Function to actually put the todo on the page
  const insertTodo = (e) => {
    console.log("TESTING: " + userID);
    e.preventDefault();
    const todo = {
      text: document.getElementById('new').value.trim(),
      complete: false,
      userId: userID
    };

    console.log("Test2: " + JSON.stringify(todo));
    if (todo.text) {
      fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      })
        .then((response) => response.json())
        .then(() => {
          document.getElementById('new').value = '';
          getTodos();
        })
        .catch((err) => alert(err));
    }
  };
  todoForm.addEventListener('submit', insertTodo);
});
