let clients, instruments, actions;
export const ClickedMethodName = "DevProviderItemClicked";

export const getClients = (search) => {
    const filteredClients = clients.filter((client) => client.displayName.toLowerCase().includes(search.toLowerCase()));
    return attachActionProperty(filteredClients);
}

export const getInstruments = (search) => {
    const filteredInstruments = instruments.filter((instrument) => instrument.displayName.toLowerCase().includes(search.toLowerCase()) ||
        instrument.id.toLowerCase().includes(search.toLowerCase())
    );
    return attachActionProperty(filteredInstruments);
}

export const getActions = (search) => {
    const filteredActions = actions.filter((action) => action.displayName.toLowerCase().includes(search.toLowerCase()));
    return attachActionProperty(filteredActions);
}

const fetchData = async () => {
    console.log(`[data] fetching clients ...`);
    clients = await (await fetch("./data/clients.json")).json();
    console.log(`[data] got ${clients.length} clients ...`);

    console.log(`[data] fetching instruments ...`);
    instruments = await (await fetch("./data/instruments.json")).json();
    console.log(`[data] got ${instruments.length} instruments ...`);

    console.log(`[data] fetching actions ...`);
    actions = await (await fetch("./data/actions.json")).json();
    console.log(`[data] got ${actions.length} actions ...`);    
}

const attachActionProperty = (items) => {
    return items.map((item) => {
        item.action = {
            method: ClickedMethodName,
            params: {
                type: item.type,
                id: item.id
            }
        }
        return item;
    });
}
fetchData();