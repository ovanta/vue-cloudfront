export default {

    /**
     * See https://bugs.chromium.org/p/chromium/issues/detail?id=378883
     * Reads all entries from a DirectoryReader, just async
     * @returns {Promise<*>} Null or an Array of entries
     * @param item
     */
    async readEntries(item) {
        const dirItemReader = item.createReader();
        return new Promise(async resolve => {
            const entries = [];

            for (; ;) {
                const newEntries = await new Promise(res => {
                    dirItemReader.readEntries(entries => res(entries));
                });

                if (newEntries.length) {
                    entries.push(...newEntries);
                } else {
                    resolve(entries);
                    break;
                }
            }
        });
    },

    /**
     * See https://stackoverflow.com/a/20874931/7664765 and https://stackoverflow.com/a/8857445/7664765
     * Checks whenever a Files is a file
     *
     * @param file
     * @returns {Promise<*>} true or false
     */
    async isFile(file) {
        return new Promise(resolve => {

            // Perform some tests which seems correct
            if (file.size > 1048576) {
                resolve(true);
            } else {
                const reader = new FileReader();
                reader.onload = () => resolve(true);
                reader.onerror = () => resolve(false);
                reader.readAsArrayBuffer(file);
            }
        });
    }
};
