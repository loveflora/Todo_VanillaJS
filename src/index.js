import { StrictMode } from "react";
import { createStore } from "redux";

const form = document.querySelector("form");
const input = document.querySelector("input");
const ul = document.querySelector("ul");

//? ACTIONS : 보통 대문자로 작명하는 듯 !
const ADD_TODO = "ADD_TODO";
const DELETE_TODO = "DELETE_TODO";

const add = (text) => {
  return {
    // action을 return
    type: ADD_TODO,
    text,
  };
};

const reducer = (state = [], action) => {
  switch (action.type) {
    case ADD_TODO:
      const newTodoObj = { text: action.text, id: Date.now() };
      // state를 change하지 않고, [...이전 text, 새로운 text]
      // 새로운 state를 create하고, 새로운 state를 return
      return [newTodoObj, ...state];
    // return state.push(action.text); ---- 직접 수정
    case DELETE_TODO:
      return state.filter((toDo) => toDo.id !== action.id);
    // id가 같지 않은 것을 반환해줌 => 같은건 걸러짐 (삭제)
    // mutate하지 않음 (array에서 obj 삭제하지 않음)
    // 삭제할 obj를 제외한, 새로운 array를 만들고 있음
    default:
      return state;
  }
};

const store = createStore(reducer);

const deleteTodo = (id) => {
  return {
    type: DELETE_TODO,
    id,
  };
};

const dispatchAddTodo = (text) => {
  store.dispatch(add(text));
};

const dispatchDeleteTodo = (e) => {
  // console.log(e.target.parentNode.id);
  const id = parseInt(e.target.parentNode.id);
  store.dispatch(deleteTodo(id));
};

const onSubmit = (e) => {
  e.preventDefault();
  const toDo = input.value; // input에서 value 값을 가져옴
  input.value = "";
  dispatchAddTodo(toDo);
  // createTodo(toDo);
};

// const createTodo = (toDo) => {
//   const li = document.createElement("li");
//   li.innerText = toDo;
//   ul.appendChild(li);
// };

const paintTodos = () => {
  const toDos = store.getState();
  ul.innerHTML = ""; // 초기화 (list 전체를 비움)
  // 다시 새로운 list 생성
  toDos.forEach((toDo) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.innerText = "삭제";
    btn.addEventListener("click", dispatchDeleteTodo);

    li.id = toDo.id;
    li.innerText = toDo.text;
    ul.appendChild(li);
    li.appendChild(btn);
  });
};

form.addEventListener("submit", onSubmit);

store.subscribe(() => console.log(store.getState()));

// store 변경될 때마다(새로운 todo가 생기면), list를 repainting 함
store.subscribe(paintTodos);

//! MUTATE STATE 사용하지 말 것 !
