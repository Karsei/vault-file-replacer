export const replaceContent = (content: string, mappings: { [index: string]: string }) => {
    for (const replacementKey in mappings) {
        const convReplacementKey = replacementKey.replace(/\./g, "\\.");
        content = content.replace(new RegExp(`%${convReplacementKey}%`, "gm"), mappings[replacementKey]);
    }
    return content;
};
