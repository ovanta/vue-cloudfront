import * as _ from './utils';

/**
 * Creates a new draggabe object
 *
 * Options: {
 *     draggable: <String> // Query selector
 *     include: <String> // Class of elements which are included in a dragging operation
 *
 *     startThreshold: <Number> // Pixel treshold before dragging starts
 *     target: <String> // Query selector of target elements
 *
 *     ghostLimit: <Number> // Maximum of ghost elements, default is -1 == unlimited
 *
 *     mapGhost: <Function> // Modify a cloned ghost element
 *     onDragStart: <Function> // Called on first drag
 *     onDragMove: <Function> // Called on every move
 *     onDrop: <Function> // Is getting executed after dropping
 * }
 *
 *
 * @param opt
 * @returns {{options: *, _init()}} A Draggable instance
 */
export default function (opt) {

    const selectAll = (query, element = document) => Array.from(element.querySelectorAll(query));

    const that = {

        options: Object.assign({
            startThreshold: 1,
            ghostLimit: -1,
            mapGhost: e => e,

            // Empty callbacks
            onDragStart: () => 0,
            onDragMove: () => 0,
            onDragEnd: () => 0
        }, opt),

        // Elements which are currently in drag-mode
        _inDrag: [],

        // Target elements and their bounding client rect
        _dropTargets: [],
        _dropTarget: null,
        _lastDropTarget: null, // Remember the previous drop target

        // If drag is active
        _active: false,

        _init() {
            this.enable();
        },

        _bindStartEvents(type) {

            // Add event listener
            _[type](document, 'mousedown', that._onTapStart);
            if (!that.options.disableTouch) {
                _[type](document, 'touchstart', that._onTapStart, {
                    passive: false
                });
            }
        },

        _onTapStart(evt) {
            let {x, y} = _.simplifyEvent(evt);

            // Resolve query selectors
            const draggable = selectAll(that.options.draggable);

            // Validate
            if (!(_.eventPath(evt).find(e => draggable.includes(e)))) {
                return;
            }

            // Resolve targets
            that._dropTargets = selectAll(that.options.target);

            // Save start coordinates
            that._startPos = {x, y};

            // Dragging is inactive (for now)
            that._active = false;

            // Add event listener
            _.on(document, ['mousemove', 'touchmove'], that._delayedTapMove);
            _.on(document, ['mouseup', 'touchend', 'touchcancel'], that._onTapStop);
        },

        _delayedTapMove(evt) {
            const {x, y} = _.simplifyEvent(evt);

            // Check pixel threshold and re-define event handlers
            if (Math.abs((x + y) - (that._startPos.x + that._startPos.y)) >= that.options.startThreshold) {
                const {include, mapGhost, ghostLimit} = that.options;

                _.off(document, ['mousemove', 'touchmove'], that._delayedTapMove);
                _.on(document, ['mousemove', 'touchmove'], that._onTapMove);

                // Clone nodes
                const included = selectAll(include);
                that._inDrag = (!~ghostLimit ? included : included.splice(0, ghostLimit)).map(element => {
                    const cloned = element.cloneNode(true);

                    // Set fixed position and remove trasitions
                    Object.assign(cloned.style, {
                        transition: 'none',
                        position: 'fixed',
                        top: 0,
                        left: 0
                    });

                    // Append to body
                    document.body.appendChild(cloned);

                    // Map ghost and return it
                    return mapGhost(cloned) || cloned;
                });

                // Dragging is now active
                that._active = true;

                // Trigger move event
                that._onTapMove(evt);

                // Call callback
                that.options.onDragStart.call(that, {event: evt, dropTarget: null});
            }
        },

        _onTapMove(evt) {
            const {x, y} = _.simplifyEvent(evt);
            const {_inDrag, _dropTargets} = that;

            let newDragTarget = null;

            // Set new position for draggables
            for (let i = 0, element; i < _inDrag.length; i++) {
                element = _inDrag[i];

                // Set x and y position via transform3d to enable GPU Acceleration
                Object.assign(element.style, {
                    transform: `translate3d(${x + i * 3}px, ${y + i * 3}px, 0)`
                });

                // Find (potentionally) intersecting target element
                for (let j = 0; j < _dropTargets.length; j++) {
                    const rect = _dropTargets[j].getBoundingClientRect();

                    if (x > rect.left &&
                        x < rect.right &&
                        y > rect.top &&
                        y < rect.bottom) {

                        // Save found target
                        newDragTarget = _dropTargets[j];
                        break;
                    }
                }
            }

            // No target found, reset it
            that._dropTarget = newDragTarget;

            // Call callback
            that.options.onDragMove.call(that, {
                event: evt,
                dropTarget: newDragTarget,

                // lastDropTarget cannot (or should't be) the last target, return null if so.
                lastDropTarget: that._lastDropTarget === newDragTarget ? null : that._lastDropTarget
            });

            // Save as last target
            that._lastDropTarget = newDragTarget;
        },

        _onTapStop(evt) {

            // Remove event listener
            _.off(document, ['mousemove', 'touchmove'], that._onTapMove);
            _.off(document, ['mousemove', 'touchmove'], that._delayedTapMove);
            _.off(document, ['mouseup', 'touchend', 'touchcancel'], that._onTapStop);

            // Remove elements from body
            that._inDrag.forEach(e => e.parentElement.removeChild(e));
            that._inDrag = [];

            /**
             * Mouseup wasn't recognized as dragging event
             * (hasn't exeed the threshold).
             */
            if (!that._active) {
                return;
            }

            // Fire event
            that.options.onDragEnd.call(that, {event: evt, dropTarget: that._dropTarget});
        },

        cancel() {

            // Remove elements from body
            that._inDrag.forEach(e => e.parentElement.removeChild(e));
            that._inDrag = [];

            // Remove listeners
            _.off(document, ['mousemove', 'touchmove'], that._onTapMove);
            _.off(document, ['mousemove', 'touchmove'], that._delayedTapMove);
            _.off(document, ['mouseup', 'touchend', 'touchcancel'], that._onTapStop);
        },

        enable() {
            this._bindStartEvents('on');
        },

        disable() {
            this._bindStartEvents('off');
        },

        destroy() {

            // Remove event listener
            _.off(document, ['mousedown', 'tocuhstart'], that._onTapStart);
        }

    };

    // Initialize
    that._init();

    return that;
}
