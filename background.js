async function saveContext() {
    
    // lê as tabs abertas
    const tabs = await chrome.tabs.query({currentWindow: true});
    // cria objeto de contexto com info das tabs
    const context = {
        name: "contexto",
        savedAt: new Date().toISOString(),
        tabs: tabs.map(tab => ({
            url: tab.url,
            title: tab.title,
            pinned: tab.pinned
        })),
    };

    // salva contexto no armazenamento local
    const storage = await chrome.storage.local.get("contexts");
    const contexts = storage.contexts || [];
    contexts["contexto"] = context;
    await chrome.storage.local.set({contexts})
}

async function restoreContext() {
    
    //lê os contextos salvos
    const getTabs = await chrome.storage.local.get("contexts");
    const contexts = getTabs.contexts || {};

    for (const tab of contexts["contexto"].tabs) {
        chrome.tabs.create({
            url: tab.url,
            pinned: tab.pinned
        })
    };
}

async function closeContext() {
    // salva o estado atual das tabs
    await saveContext();

    // pega as abas abertas que tem id
    const tabs = await chrome.tabs.query({currentWindow: true});
    const tabIds = tabs.map(tab => tab.id);

    await chrome.tabs.create({url: "chrome://newtab", active: true});

    //fecha as tabs
    chrome.tabs.remove(tabIds);
}
