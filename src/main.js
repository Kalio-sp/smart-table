import "./fonts/ys-display/fonts.css";
import "./style.css";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

const api = initData();

function collectState() {
  const state = processFormData(new FormData(sampleTable.container));
  return {
    ...state,
    rowsPerPage: parseInt(state.rowsPerPage),
    page: parseInt(state.page ?? 1),
  };
}

async function render(action) {
  const state = collectState();
  let query = {};

  query = applySearching(query, state, action);
  query = applyFiltering(query, state, action);
  query = applySorting(query, state, action);
  query = applyPagination(query, state, action);

  const { total, items } = await api.getRecords(query);

  updatePagination(total, query);
  sampleTable.render(items);
}

const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"],
    after: ["pagination"],
  },
  render
);

const { applyPagination, updatePagination } = initPagination(
  {
    pages: sampleTable.pagination.elements.pages,
    fromRow: sampleTable.pagination.elements.fromRow,
    toRow: sampleTable.pagination.elements.toRow,
    totalRows: sampleTable.pagination.elements.totalRows,
    firstPage: sampleTable.pagination.elements.firstPage,
    previousPage: sampleTable.pagination.elements.previousPage,
    nextPage: sampleTable.pagination.elements.nextPage,
    lastPage: sampleTable.pagination.elements.lastPage,
  },
  (el, page, isCurrent) => {
    el.querySelector("input").value = page;
    el.querySelector("input").checked = isCurrent;
    el.querySelector("span").textContent = page;
    return el;
  }
);
console.log("Pagination elements:", sampleTable.pagination.elements);

const applySorting = initSorting([
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);

const { applyFiltering, updateIndexes } = initFiltering(
  sampleTable.filter.elements
);
const applySearching = initSearching("search");

document.querySelector("#app").appendChild(sampleTable.container);

async function init() {
  const indexes = await api.getIndexes();
  updateIndexes(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers,
  });
}

init().then(render);
