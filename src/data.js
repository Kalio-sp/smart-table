const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';

export function initData() {
    let sellers;
    let customers;
    let lastQuery;
    let lastResult;

    const mapRecords = (items) => items.map(item => ({
        id: item.receipt_id,
        date: item.date,
        seller: sellers[item.seller_id],
        customer: customers[item.customer_id],
        total: item.total_amount
    }));

    const getIndexes = async () => {
        if (!sellers || !customers) {
            [sellers, customers] = await Promise.all([
                fetch(`${BASE_URL}/sellers`).then(r => r.json()),
                fetch(`${BASE_URL}/customers`).then(r => r.json())
            ]);
        }
        return { sellers, customers };
    };

    const getRecords = async (query, isUpdated = false) => {
        const qs = new URLSearchParams(query).toString();

        if (qs === lastQuery && !isUpdated) {
            return lastResult;
        }

        const response = await fetch(`${BASE_URL}/records?${qs}`);
        const data = await response.json();

        lastQuery = qs;
        lastResult = {
            total: data.total,
            items: mapRecords(data.items)
        };

        return lastResult;
    };

    return { getIndexes, getRecords };
}
