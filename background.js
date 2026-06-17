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