export function initPagination({ pages, fromRow, toRow, totalRows }, createPage) {
    let pageCount = 1;

    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();

    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage;
        let page = state.page;

        if (action) {
            switch (action.name) {
                case 'prev': page = Math.max(1, page - 1); break;
                case 'next': page = Math.min(pageCount, page + 1); break;
                case 'first': page = 1; break;
                case 'last': page = pageCount; break;
            }
        }

        return Object.assign({}, query, { limit, page });
    };

    const updatePagination = (total, { page, limit }) => {
        pageCount = Math.ceil(total / limit);

        pages.replaceChildren(
            ...Array.from({ length: pageCount }, (_, i) => {
                const el = pageTemplate.cloneNode(true);
                return createPage(el, i + 1, i + 1 === page);
            })
        );

        fromRow.textContent = total ? (page - 1) * limit + 1 : 0;
        toRow.textContent = Math.min(page * limit, total);
        totalRows.textContent = total;
    };

    return { applyPagination, updatePagination };
}
