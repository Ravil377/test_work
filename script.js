const cells = [
  {
      fio: "Платошкин",
      birthday: "1981-03-22",
      oklad: 50000,
  },
  {
      fio: "Медведев",
      birthday: "1981-04-12",
      oklad: 40000,
  },
  {
      fio: "Иванов",
      birthday: "1997-03-22",
      oklad: 10000,
  },
  {
      fio: "Сидоров",
      birthday: "1961-03-22",
      oklad: 20000,
  },
  {
      fio: "Лаврентий",
      birthday: "1971-03-22",
      oklad: 30000,
  },
];

const table = document.querySelector(".table");
const tableBody = table.querySelector(".table__body");
const formEntry = document.querySelector(".addEntry");
const entryId = document.querySelector(".entry-id");
const entryFio = document.querySelector(".entry-fio");
const entryBirthday = document.querySelector(".entry-birthday");
const entryOklad = document.querySelector(".entry-oklad");

let editingTd;
let counter = 0;
let sum = 0;

const headerCellsSort = document.querySelectorAll('.table__cell-sort');
const tableHeader = document.querySelector('.table__header');
const tableFoot = document.querySelector('.table__foot');

class Entry {
  sum;
  counter;
  constructor(data, body, header) {
      this._data = data;
      this._table = document.querySelector(".table");
      this._tableBody = this._table.querySelector(body);
      this._header = this._table.querySelector(header);
      this._totalFio = document.querySelector(".total-fio");
      this._totalBirthday = document.querySelector(".total-birthday");
      this._totalOklad = document.querySelector(".total-oklad");
  }

  _setEventListener() {
      this._tr.querySelector(".table__entry-remove").addEventListener("click", this._removeEntry.bind(this));
      this._tr.addEventListener("click", this._tableEdit.bind(this));
  }

  _removeEntry() {
      this._totalResult(false);
      this._tr.remove();
      this._tr.querySelector(".table__entry-remove").removeEventListener("click", this._removeEntry.bind(this));
  }

  createEntry() {
      this._totalResult(true);
      this._tr = document.createElement("tr");
      this._tr.classList.add("table__entry", "table__row");
      this._tr.innerHTML = '';
      this._header.querySelectorAll('.table__cell').forEach(item => {  
        this._tr.innerHTML = this._tr.innerHTML + this._createTd(item);
      });
      
      this._setEventListener();
      return this._tr;
  }

  _createTd(item) {
    if(item.classList.contains("table__cell-fio")) {
      return `<td class="table__cell table__edit" name="fio">${this._data.fio}</td>`;
    } else if(item.classList.contains("table__cell-birthday")) {
      return `<td class="table__cell table__edit" name="bdate">${this._data.birthday}</td>`;
    } else if(item.classList.contains("table__cell-oklad")) {
      return `<td class="table__cell table__edit table__cell-oklad" name="oklad">${this._data.oklad}</td>`;
    } else if(item.classList.contains("table__cell-button")) {
      return `<td class="table__cell table__cell_auto"><button class="table__entry-remove">Удалить запись</button></td>`; 
    } else if(item.classList.contains("table__cell-id")) {
      return `<td class="table__cell">${counter}</td>`;
    }
  }
  
  

  _totalResult(isPlus) {
      if (isPlus) {
          counter++;
          sum = Number(sum + this._data.oklad);
      } else {
          counter--;
          sum -= this._data.oklad;
      }
      this._totalFio.textContent = counter;
      this._totalBirthday.textContent = counter;
      this._totalOklad.textContent = sum;
  }

  _tableEdit(e) {        
    if(this._table.querySelector('.table__cell-edit') === null && e.target.classList.contains('table__edit')) {
      this._data = e.target;
      this._data.classList.add("table__cell-edit");
      this._copyData = this._data.innerHTML;
      this._inputArea = document.createElement("input");
      if (this._data.getAttribute('Name') === "fio") {
        this._inputArea.type = "text";
      } else if (this._data.getAttribute('Name') === "bdate") {
        this._inputArea.type = "date";
      } else {
        this._inputArea.type = "number";
      }
      this._inputArea.value = this._data.innerHTML;
      this._data.innerHTML = "";
      this._data.appendChild(this._inputArea);
      this._inputArea.focus();
      this._data.insertAdjacentHTML(
        "beforeEnd", 
        '<div class="edit-controls"><button class="edit-ok">Ok</button><button class="edit-cancel">X</button></div>');
      this._btnCancel = this._data.querySelector(".edit-cancel");
      this._btnOk = this._data.querySelector(".edit-ok");
      this._btnCancel.addEventListener("click", this._editCancel.bind(this));
      this._btnOk.addEventListener("click", this._editOk.bind(this));
      this._inputArea.addEventListener("keydown", this._keyHandler);
  } 
}
    
  _keyHandler(e) {
    if (e.key.match(/[0-9]/)) return e.preventDefault();
  }

  _editCancel() {
    this._data.innerHTML = this._copyData;
    this._btnCancel.removeEventListener("click", this._editCancel.bind(this));
    this._btnOk.removeEventListener("click", this._editOk.bind(this));
    this._inputArea.removeEventListener("keydown", this._keyHandler);
    this._copyData = '';
    this._data.classList.remove("table__cell-edit");
  }

  _editOk() {
    this._btnCancel.removeEventListener("click", this._editCancel.bind(this));
    this._btnOk.removeEventListener("click", this._editOk.bind(this));
    this._inputArea.removeEventListener("keydown", this._keyHandler);
    this._data.classList.remove("table__cell-edit");
    this._data.innerHTML = this._inputArea.value;
    this._copyData = '';
  }
}

function generateEntry(item) {
  const entry = new Entry(item, ".table__body", ".table__header");
  return entry.createEntry();
}

function addEntry(evt) {
  evt.preventDefault();
  let dataEl = {
    fio: entryFio.value,
    birthday: entryBirthday.value,
    oklad: Number(entryOklad.value),
  };
  tableBody.appendChild(generateEntry(dataEl));
  entryFio.value ='';
  entryBirthday.value = '';
  entryOklad.value = '';
}

// function sortEntry(body, data) {
//   body.appendChild(
//       generateEntry({
//           fio: entryFio.value,
//           birthday: entryBirthday.value,
//           oklad: Number(entryOklad.value),
//       })
//   );
// }

function loadEntrys(cells) {
  cells.forEach(cell => {
      tableBody.appendChild(generateEntry(cell));
  });
}

loadEntrys(cells);
formEntry.addEventListener("submit", addEntry);


function getCellValue (tr, idx) {
    return tr.children[idx].innerText || tr.children[idx].textContent;
}

const comparer = function(idx, asc) {
    return function(a, b) {
        return function(v1, v2) {
            return (v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2))
                ? v1 - v2
                : v1.toString().localeCompare(v2);
        }
        (getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
    }
};

headerCellsSort.forEach(columnSort => columnSort.addEventListener('click', (() =>
    {
        const table = columnSort.closest('table');
        const tbody = table.querySelector('tbody');
        Array.from(tbody.querySelectorAll('tr'))
        .sort(comparer(Array.from(columnSort.parentNode.children).indexOf(columnSort), this.asc = !this.asc))
        .forEach(tr => tbody.appendChild(tr));
})));


let dragged;

  document.addEventListener("dragstart", function( event ) {
      dragged = event.target;
  }, false);

  document.addEventListener("dragover", function( event ) {
      event.preventDefault();
  }, false);

  document.addEventListener("dragenter", function( event ) {
      if (event.target.classList.contains("table__drop-zone")) {
          event.target.style.background = "blue";
      }
  }, false);

  document.addEventListener("dragleave", function( event ) {
      if (event.target.classList.contains("table__drop-zone")) {
          event.target.style.background = "";
      }
  }, false);

  document.addEventListener("drop", function( event ) {
      event.preventDefault();
      if (event.target.classList.contains("table__drop-zone")) {
          event.target.style.background = "";
          swapNodes(event.target, dragged);
          tableBody.querySelectorAll('.table__row').forEach(item => {
            swapNodes(item.getElementsByTagName('td')[event.target.cellIndex], item.getElementsByTagName('td')[dragged.cellIndex]);
          });
          tableFoot.querySelectorAll('.table__row').forEach(item => {
            swapNodes(item.getElementsByTagName('td')[event.target.cellIndex], item.getElementsByTagName('td')[dragged.cellIndex]);
          });
      }
  }, false);

  function swapNodes(n1, n2) {
    var p1 = n1.parentNode;
    var p2 = n2.parentNode;
    var i1, i2;
    if ( !p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1) ) return;

    for (var i = 0; i < p1.children.length; i++) {
        if (p1.children[i].isEqualNode(n1)) {
            i1 = i;
        }
    }
    for (var i = 0; i < p2.children.length; i++) {
        if (p2.children[i].isEqualNode(n2)) {
            i2 = i;
        }
    }

    if ( p1.isEqualNode(p2) && i1 < i2 ) {
        i2++;
    }
    p1.insertBefore(n2, p1.children[i1]);
    p2.insertBefore(n1, p2.children[i2]);
}