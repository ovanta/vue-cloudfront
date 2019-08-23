/* eslint-disable */
export matchAll                   from './utils/matchAll';
export pick                       from './utils/pick';
export css                        from './utils/css';
export simplifyEvent              from './utils/simplifyEvent';
export detectKeypressCombinations from './utils/detectKeypressCombinations';
export eventPath                  from './utils/eventPath';
export parseSizeUnitString        from './utils/parseSizeUnitString';
export readableByteCount          from './utils/readableByteCount';
export fileSystem                 from './utils/fileSystem';
export limit                      from './utils/limit';
export readableStringSequence     from './utils/readableStringSequence';
export formatDate                 from './utils/formatDate';
export updatePageTheme            from './utils/updatePageTheme';
export *                          from './utils/eventListener';

import config from '../../config/config';

/**
 * Creates a download url out of a static id
 * @param staticId
 * @returns {string}
 */
export function createDownloadUrl(staticId) {
    const {apiEndPoint} = config;
    const base = apiEndPoint.startsWith('http') ? apiEndPoint : location.origin + apiEndPoint;
    return `${base}/d/${staticId}`;
}
