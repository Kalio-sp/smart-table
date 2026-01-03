import { sortMap } from "../lib/sort.js";

export function initSorting(columns) {
    return (query, state, action) => {
        let field;
        let order;

        if (action?.name === 'sort') {
            action.dataset.value = sortMap[action.dataset.value];
            field = action.dataset.field;
            order = action.dataset.value;

            columns.forEach(col => {
                if (col.dataset.field !== field) {
                    col.dataset.value = 'none';
                }
            });
        } else {
            columns.forEach(col => {
                if (col.dataset.value !== 'none') {
                    field = col.dataset.field;
                    order = col.dataset.value;
                }
            });
        }

        return field && order !== 'none'
            ? Object.assign({}, query, { sort: `${field}:${order}` })
            : query;
    };
}
