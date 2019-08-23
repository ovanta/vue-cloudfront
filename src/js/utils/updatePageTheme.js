const vendors = [
    'theme-color',
    'msapplication-navbutton-color',
    'apple-mobile-web-app-status-bar-style'
];

/**
 * Updates the page-color-theme
 * @param color
 */
export default color => {
    for (const name of vendors) {
        let el = document.head.querySelector(`[name="${name}"]`);

        if (!el) {
            el = document.createElement('meta');
            el.setAttribute('name', name);
            document.head.appendChild(el);
        }

        el.setAttribute('content', color);
    }
}
