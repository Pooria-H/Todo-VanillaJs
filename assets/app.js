// Save data in the localStorage
// hide application element before js load
// Prevent adding a todo with empty name
// Prevent editing a todo with empty name

function initApp() {
  const that = this;
  const rootElem = document.getElementById('app');
  const openNewItemElem = document.getElementById('open-new-item');
  const newItemElem = document.getElementById('new-item');
  const closeNewItemElem = document.getElementById('close-new-item');
  const itemTemplate = document.getElementById('item-template').innerHTML;
  const createTodoElem = document.getElementById('create-todo');
  const itemsElem = document.getElementById('items');
  const newItemNameElem = document.getElementById('new-item-name');
  const newItemDescElem = document.getElementById('new-item-desc');
  const numberOfItemsElem = document.getElementById('number-of-items');
  const noItemElem = document.getElementsByClassName('c-noTodo')[0];
  const allCheckItemsElem = document.getElementsByClassName('c-items__eachCheckbox');
  const allDeleteItemsElem = document.getElementsByClassName('c-items__eachDelete');
  const allEditItemsElem = document.getElementsByClassName('c-items__eachEdit');
  const allSaveEditedElem = document.getElementsByClassName('c-items__eachSaveEdit');
  const allCancelEditedElem = document.getElementsByClassName('c-items__eachCancelEdit');


  this.data = [];
  
  this.initListeners = function() {
    openNewItemElem.addEventListener('click', function () {
      newItemElem.classList.remove('u-none');
    });
  
    closeNewItemElem.addEventListener('click', function () {
      newItemElem.classList.add('u-none');
    });
  
    createTodoElem.addEventListener('click', function () {
      that.createTodo();
    });

    newItemNameElem.addEventListener('keydown', function () {
      newItemNameElem.classList.remove('u-inputError');
    });

    for (let i = 0; i < allCheckItemsElem.length; i++) {
      allCheckItemsElem[i].addEventListener('click', that.checkItem, false);
    }

    for (let i = 0; i < allDeleteItemsElem.length; i++) {
      allDeleteItemsElem[i].addEventListener('click', that.deleteItem, false);
    }

    for (let i = 0; i < allEditItemsElem.length; i++) {
      allEditItemsElem[i].addEventListener('click', that.editItem, false);
    }

    for (let i = 0; i < allSaveEditedElem.length; i++) {
      allSaveEditedElem[i].addEventListener('click', that.saveEditedItem, false);
    }

    for (let i = 0; i < allCancelEditedElem.length; i++) {
      allCancelEditedElem[i].addEventListener('click', that.cancelEditedItem, false);
    }
  };

  this.setLocalStorage = function() {
    localStorage.setItem('todos', JSON.stringify(this.data));
  };

  this.onMount = function() {
    document.getElementById('app').classList.remove('u-hidden');
    const data = JSON.parse(localStorage.getItem('todos'));
    this.data = data !== null ? data : [];
    console.log(data);

    this.data.forEach(element => {
      let e = document.createElement('div');
      e.innerHTML = itemTemplate;
      
      let itselfElem = e.children[0];
      let nameElem = e.querySelectorAll('.c-items__eachNameWrapper')[0];
      let descElem = e.querySelectorAll('.c-items__eachDescWrapper')[0];
      let nameInputElem = e.querySelectorAll('.c-items__eachNameInput')[0];
      let descTextareaElem = e.querySelectorAll('.c-items__eachDescTextarea')[0];
      let operationsElem = e.querySelectorAll('.c-items__eachOperations')[0];

      nameElem.innerHTML = element.name;
      descElem.innerHTML = element.desc;
      nameInputElem.setAttribute('value', element.name);
      descTextareaElem.setAttribute('value', element.desc);
      operationsElem.setAttribute('data-id', element.id);
      if (element.isDone) {
        itselfElem.classList.add('c-items__each--done');
      }
      itemsElem.appendChild(e);
    });

    this.showNumberOfItems();
    this.hideAndShowNoItemsElem();
  };
  
  this.createTodo = function(id, name, desc, isDone) {
    const newItemName = name ? name : newItemNameElem.value.trim();
    const newItemDesc = desc ? desc : newItemDescElem.value.trim();
    const newId = id ? id : Date.now();

    if (newItemName.length !== 0) {
      let e = document.createElement('div');
      e.innerHTML = itemTemplate;

      let nameElem = e.querySelectorAll('.c-items__eachNameWrapper')[0];
      let descElem = e.querySelectorAll('.c-items__eachDescWrapper')[0];
      let nameInputElem = e.querySelectorAll('.c-items__eachNameInput')[0];
      let descTextareaElem = e.querySelectorAll('.c-items__eachDescTextarea')[0];
      let operationsElem = e.querySelectorAll('.c-items__eachOperations')[0];

      nameElem.innerHTML = newItemName;
      descElem.innerHTML = newItemDesc;
      nameInputElem.setAttribute('value', newItemName);
      descTextareaElem.setAttribute('value', newItemDesc);
      operationsElem.setAttribute('data-id', newId);
      newItemElem.classList.add('u-none');
      newItemNameElem.value = '';
      newItemDescElem.value = '';
      itemsElem.appendChild(e);

      this.data.push({
        id: newId,
        name: newItemName,
        desc: newItemDesc,
        isDone: isDone ? isDone : false
      });
      this.setLocalStorage();
      this.hideAndShowNoItemsElem();
      this.showNumberOfItems();
      this.initListeners();

      feather.replace({
        height: 20,
        width: 20
      });
    } else {
      newItemNameElem.classList.add('u-inputError');
    }
  };

  this.hideAndShowNoItemsElem = function() {
    if (this.data.length === 0) {
      noItemElem.classList.remove('u-none');
    } else {
      noItemElem.classList.add('u-none');
    }
  };

  this.showNumberOfItems = function () {
    numberOfItemsElem.innerHTML = this.data.length;
  };

  this.checkItem = function () {
    const id = this.parentElement.getAttribute('data-id');
    const itemElem = this.closest('.c-items__each');
    that.data.forEach(element => {
      if (element.id == id) {
        element.isDone = !element.isDone;
        that.setLocalStorage();

        if (itemElem.classList) {
          itemElem.classList.toggle('c-items__each--done');
        } else {
          let classes = itemElem.className.split(' ');
          let existingIndex = classes.indexOf('c-items__each--done');
          if (existingIndex >= 0) {
            classes.splice(existingIndex, 1);
          }
          else {
            classes.push('c-items__each--done');
          }

          itemElem.className = classes.join(' ');
        }
      }
    });
  };

  this.deleteItem = function () {
    const id = this.parentElement.getAttribute('data-id');
    const itemElem = this.closest('.c-items__each');
    const index = that.data.findIndex(element => element.id == id);
    that.data.splice(index, 1);
    that.setLocalStorage();
    that.hideAndShowNoItemsElem();
    that.showNumberOfItems();

    itemElem.parentNode.removeChild(itemElem);
  };

  this.editItem = function () {
    const itemElem = this.closest('.c-items__each');

    itemElem.classList.add('c-items__each--editMode');
  };

  this.saveEditedItem = function () {
    const id = this.parentElement.getAttribute('data-id');
    const itemElem = this.closest('.c-items__each');
    const nameElem = itemElem.getElementsByClassName('c-items__eachNameInput')[0];
    const descElem = itemElem.getElementsByClassName('c-items__eachDescTextarea')[0];
    const nameWrapperElem = itemElem.getElementsByClassName('c-items__eachNameWrapper')[0];
    const descWrapperElem = itemElem.getElementsByClassName('c-items__eachDescWrapper')[0];

    that.data.forEach(element => {
      if (element.id == id) {
        element.name = nameElem.value;
        element.desc = descElem.value;
        nameWrapperElem.innerHTML = nameElem.value;
        descWrapperElem.innerHTML = descElem.value;
        that.setLocalStorage();
        itemElem.classList.remove('c-items__each--editMode');
      }
    });
  };

  this.cancelEditedItem = function () {
    const itemElem = this.closest('.c-items__each');
  
    itemElem.classList.remove('c-items__each--editMode');
  };


  this.onMount();
  this.initListeners();
}


document.onreadystatechange = function () {
  if (document.readyState == 'interactive') {
    new initApp();

    feather.replace({
      height: 20,
      width: 20
    });
  }
}