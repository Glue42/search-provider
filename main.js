import { getActions, getClients, getInstruments, ClickedMethodName } from "./data.js";

let glue;

const random = () => {
    return `${Math.floor(Math.random() * 1000000)}_${Date.now()}`;
};

const register = async () => {
    console.log(`[main] registering search method (G42.Search.Provider)...`)
    glue = await Glue({ layouts: true, bus: false, appManager: "full" });
    glue.interop.register("T42.Search.Provider", handleSearchOperation);

    console.log(`[main] registering action method (${ClickedMethodName})`)
    glue.interop.register(ClickedMethodName, handleItemClicked)
};

const sendBackResult = (queryId, items, status) => {
    console.log(`[main] [${queryId}] [${status}] sending back result `, items)
    glue.agm.invoke("T42.Search.Client", { queryId, items, status });
}

const handleSearchOperation = async (args) => {
    const { operation, search, id } = args;
    console.log(`[main] search method invoked for operation=${operation}, search=${search}, id=${id}`);
    switch (operation) {

        case "search":            
            // we need to return and queryId to global search, so it can match the following results against it
            let queryId = random();
            console.log(`[main] [${queryId}] searching for:`, search);

            // do not send back results before this call has returned the queryId to Global Search
            // otherwise your responses will be ignored as Global Search can not match them against and id
            setTimeout(() => doSearch(queryId, search), 0)

            // return the query id to Global Search
            return {
                id: queryId
            };

        case "cancel":
            // this is a signal from Global Search that a search operation with a given id should be canceled 
            // (e.g. the user typed 'abc' which create a search operation X then added 'e' which will cancel X and create a new operation (X+1))
            // do nothing here - in real providers we might cancel long running search operations
            console.log(`[main] [${id}] search cancelled`);
            break;

        default:
            throw new Error("Received an invalid operation");
    }
};

const doSearch = (queryId, searchText) => {
    // gather data - in real providers this will be async action
    const instruments = getInstruments(searchText);
    const clients = getClients(searchText);
    const actions = getActions(searchText);

    // when ready send the data back to Global Search with status "done" - this will signal Global Search that we have sent all the results we have
    // if you have partial results you can send them by passing status "in-progress"
    // this will make Global Search showing the spinner icon until it receives the results with done status for that queryId
    sendBackResult(queryId, [...instruments, ...clients, ...actions], "done");
}

const handleItemClicked = (param) => {
    console.log(`[main] handle item click for type ${param.type} with id ${param.id}`);
}

register();
