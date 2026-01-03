export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach(key => {
            elements[key].append(
                ...Object.values(indexes[key]).map(value => {
                    const option = document.createElement('option');
                    option.value = value;
                    option.textContent = value;
                    return option;
                })
            );
        });
    };

    const applyFiltering = (query, state, action) => {
        if (action?.name === 'clear') {
            const input = action.parentElement.querySelector('input');
            if (input) input.value = '';
        }

        const filter = {};

        Object.keys(elements).forEach(key => {
            const el = elements[key];
            if (el && el.value) {
                filter[`filter[${el.name}]`] = el.value;
            }
        });

        return Object.keys(filter).length
            ? Object.assign({}, query, filter)
            : query;
    };

    return { applyFiltering, updateIndexes };
}
