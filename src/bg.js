const API_MANGADEX_BASE_URL = "https://api.mangadex.org";
const CUBARI_MANGADEX_BASE_URL = "https://cubari.moe/read/mangadex";

function getHashFromUrl(url) {
    const pathname = new URL(url).pathname;
    const id = pathname.match(/[\w-]+/g)[1];
    
    return id;
}

browser.webRequest.onBeforeRequest.addListener((req) => {
    const id = getHashFromUrl(req.url);

    return {
        redirectUrl: `${CUBARI_MANGADEX_BASE_URL}/${id}`,
    };

}, { urls: ["*://mangadex.org/title/*"], types: ["main_frame"] },
    ["blocking"]);

browser.webRequest.onBeforeRequest.addListener(async (req) => {
    const id = getHashFromUrl(req.url);

    const { data } = await fetch(`${API_MANGADEX_BASE_URL}/chapter/${id}`).then(res => res.json());

    const chapter = data.attributes.chapter;
    const manga = data.relationships.find(rel => rel.type === "manga");

    return {
        redirectUrl: `${CUBARI_MANGADEX_BASE_URL}/${manga.id}/${chapter}`,
    };

}, { urls: ["*://mangadex.org/chapter/*"], types: ["main_frame"] },
    ["blocking"]);
