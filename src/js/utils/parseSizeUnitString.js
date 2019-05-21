/**
 * Converts something like '25.3MB' or '12.1KiB' to bytes.
 *
 * @param size
 * @returns {number}
 */
export default size => {
    const type = size.replace(/[\d.i]+/g, '').toUpperCase();
    const amount = Number(size.replace(/\D+$/g, ''));
    const si = size.includes('i') ? 1024 : 1000;

    switch (type) {
        case'KB':
            return amount * si;
        case'MB':
            return amount * Math.pow(si, 2);
        case'GB':
            return amount * Math.pow(si, 3);
        case'TB':
            return amount * Math.pow(si, 4);
        case'PB':
            return amount * Math.pow(si, 5);
        default:
            return amount;
    }
}
