export function initSearching(field) {
    return (query, state) => {
        return state[field]
            ? Object.assign({}, query, { search: state[field] })
            : query;
    };
}
