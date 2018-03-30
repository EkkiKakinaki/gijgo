﻿/* global window alert jQuery gj */
/**
  * @widget Slider
  * @plugin Base
  */
gj.slider = {
    plugins: {},
    messages: {
        'en-us': {
        }
    }
};

gj.slider.config = {
    base: {

        /** The minimum value of the Slider.
         * @type number
         * @default 0
         * @example JS.Config <!-- slider -->
         * <input id="slider" />
         * <script>
         *    $('#slider').slider({ min: 5, max: 15 });
         * </script>
         */
        min: 0,

        /** The maximum value of the Slider.
         * @type number
         * @default 10
         * @example JS.Config <!-- slider -->
         * <input id="slider" />
         * <script>
         *    $('#slider').slider({ max: 20 });
         * </script>
         */
        max: 10,

        /** The orientation of a Slider: "horizontal" or "vertical".
         * @type (horizontal|vertical)
         * @default horizontal
         * @example horizontal <!-- slider -->
         * <input id="slider" width="280" />
         * <script>
         *    $('#slider').slider({ orientation: 'horizontal' });
         * </script>
         * @example vertical <!-- slider -->
         * <input id="slider" width="280" />
         * <script>
         *    $('#slider').slider({ orientation: 'vertical' });
         * </script>
         */
        orientation: 'horizontal',

        /** The name of the UI library that is going to be in use.
         * @additionalinfo The css file for bootstrap should be manually included if you use bootstrap.
         * @type (materialdesign|bootstrap|bootstrap4)
         * @default materialdesign
         * @example MaterialDesign <!-- slider -->
         * <input id="slider" width="300" />
         * <script>
         *    $('#slider').slider({ uiLibrary: 'materialdesign' });
         * </script>
         * @example Bootstrap.3 <!-- bootstrap, slider -->
         * <input id="slider" width="300" />
         * <script>
         *     $('#slider').slider({ uiLibrary: 'bootstrap' });
         * </script>
         * @example Bootstrap.4 <!-- bootstrap4, slider -->
         * <input id="slider" width="300" />
         * <script>
         *     $('#slider').slider({ uiLibrary: 'bootstrap4' });
         * </script>
         */
        uiLibrary: 'materialdesign',

        /** The initial slider value.
         * @type number
         * @default undefined
         * @example Javascript <!-- slider -->
         * <input id="slider" width="300" />
         * <script>
         *    $('#slider').slider({ value: 3 });
         * </script>
         * @example HTML <!-- slider -->
         * <input id="slider" width="300" value="9" />
         * <script>
         *     $('#slider').slider();
         * </script>
         */
        value: undefined,

        icons: {},

        style: {
            wrapper: 'gj-slider gj-slider-md',
            progress: undefined,
            track: undefined
        }
    },

    bootstrap: {
        style: {
            wrapper: 'gj-slider gj-slider-bootstrap',
            progress: 'progress-bar',
            track: 'progress'
        },
        iconsLibrary: 'glyphicons'
    },

    bootstrap4: {
        style: {
            wrapper: 'gj-slider gj-slider-bootstrap',
            progress: 'progress-bar',
            track: 'progress'
        },
        showOtherMonths: true
    }
};

gj.slider.methods = {
    init: function (jsConfig) {
        gj.widget.prototype.init.call(this, jsConfig, 'slider');
        this.attr('data-slider', 'true');
        gj.slider.methods.initialize(this[0], this.data());
        return this;
    },

    initialize: function (slider, data) {
        var wrapper, track, handle, progress;

        slider.style.display = 'none';

        if (slider.parentElement.attributes.role !== 'wrapper') {
            wrapper = document.createElement('div');
            wrapper.setAttribute('role', 'wrapper');
            slider.parentNode.insertBefore(wrapper, slider);
            wrapper.appendChild(slider);
        } else {
            wrapper = slider.parentElement;
        }

        if (data.width) {
            wrapper.style.width = data.width + 'px';
        }
        
        gj.core.addClasses(wrapper, data.style.wrapper);

        track = slider.querySelector('[role="track"]');
        if (track == null) {
            track = document.createElement('div');
            track.setAttribute('role', 'track');
            wrapper.appendChild(track);
        }
        gj.core.addClasses(track, data.style.track);

        handle = slider.querySelector('[role="handle"]');
        if (handle == null) {
            handle = document.createElement('div');
            handle.setAttribute('role', 'handle');
            wrapper.appendChild(handle);
        }

        progress = slider.querySelector('[role="progress"]');
        if (progress == null) {
            progress = document.createElement('div');
            progress.setAttribute('role', 'progress');
            wrapper.appendChild(progress);
        }
        gj.core.addClasses(progress, data.style.progress);

        if (data.value) {
            // TODO: slide to value
        } else {
            data.value = data.min;
        }
        
        gj.documentManager.subscribeForEvent('mouseup', $(slider).data('guid'), gj.slider.methods.createMouseUpHandler(handle, data));
        handle.addEventListener('mousedown', gj.slider.methods.createMouseDownHandler(handle, data));
        gj.documentManager.subscribeForEvent('mousemove', $(slider).data('guid'), gj.slider.methods.createMouseMoveHandler(slider, track, handle, progress, data));
        
        //new gj.draggable.widget($(handle), { vertical: false, containment: wrapper, drag: gj.slider.methods.createDragHandler(slider, track, handle, progress, data) });
    },

    createMouseUpHandler: function (handle, data) {
        return function (e) {
            handle.setAttribute('drag', 'false');
        }
    },

    createMouseDownHandler: function (handle, data) {
        return function (e) {
            handle.setAttribute('drag', 'true');
        }
    },

    createMouseMoveHandler: function (slider, track, handle, progress, data) {
        return function (e) {
            var sliderPos, x, trackWidth, offset, stepSize, valuePos;
            if (handle.getAttribute('drag') === 'true') {
                sliderPos = gj.core.position(slider, true, true);
                x = new gj.widget().mouseX(e) - sliderPos.left;

                trackWidth = gj.core.width(track);
                offset = gj.core.width(handle) / 2;
                stepSize = trackWidth / (data.max - data.min);
                valuePos = data.value * stepSize;

                if (x >= offset && x <= (trackWidth + offset)) {
                    if (x > valuePos + (stepSize / 2) || x < valuePos - (stepSize / 2)) {
                        data.value = Math.round(x / stepSize);
                        slider.value = data.value;
                        handle.style.left = (data.value * stepSize) + 'px';

                    }
                }
            }
        }
    },

    //createDragHandler: function (slider, track, handle, progress, data) {
    //    return function (e, newPosition, mousePosition) {
    //        var sliderPos = gj.core.position(slider, true),
    //            trackWidth = gj.core.width(track),
    //            stepSize = trackWidth / (data.max - data.min),
    //            valuePos = data.value * stepSize,
    //            newWidth = Math.round(handle.offsetLeft) - sliderPos.left - 6;
            
    //        if ((mousePosition.x - sliderPos.left) > valuePos + (stepSize / 2) || (mousePosition.x - sliderPos.left) < valuePos - (stepSize / 2)) {
    //            progress.style.width = newWidth + 'px';
    //            console.log((mousePosition.x - sliderPos.left) + ' - ' + mousePosition.x + ' - ' + sliderPos.left + ' - ' + (valuePos + (stepSize / 2)))
    //            return true;
    //        } else {
    //            return false;
    //        }
    //    };
    //},

    destroy: function ($slider) {
        var data = $slider.data();
        if (data) {
            $slider.off();
            $slider.removeData();
            $slider.removeAttr('data-type').removeAttr('data-guid').removeAttr('data-slider');
            $slider.removeClass();
        }
        return $slider;
    }
};

gj.slider.events = {
    /**
     * Fires when the slider value changes as a result of selecting a new value with the drag handle, buttons or keyboard.
     *
     * @event change
     * @param {object} e - event data
     * @example sample <!-- slider -->
     * <input id="slider" />
     * <script>
     *     $('#slider').slider({
     *         change: function (e) {
     *             console.log('Change is fired');
     *         }
     *     });
     * </script>
     */
    change: function ($slider) {
        return $slider.triggerHandler('change');
    },

    /**
     * Fires when the user drags the drag handle to a new position.
     * @event show
     * @param {object} e - event data
     * @example sample <!-- slider -->
     * <input id="slider" />
     * <script>
     *     $('#slider').slider({
     *         slide: function (e) {
     *             console.log('Change is fired');
     *         }
     *     });
     * </script>
     */
    slide: function ($slider) {
        return $slider.triggerHandler('slide');
    }
};

gj.slider.widget = function ($element, jsConfig) {
    var self = this,
        methods = gj.slider.methods;

    /** Gets or sets the value of the slider.
     * @method
     * @param {string} value - The value that needs to be selected.
     * @return string
     * @example Get <!-- slider -->
     * <button class="gj-button-md" onclick="alert($slider.value())">Get Value</button>
     * <hr/>
     * <input id="slider" />
     * <script>
     *     var $slider = $('#slider').slider();
     * </script>
     * @example Set <!-- slider -->
     * <button class="gj-button-md" onclick="$slider.value(3)">Set Value</button>
     * <hr/>
     * <input id="slider" />
     * <script>
     *     var $slider = $('#slider').slider();
     * </script>
     */
    self.value = function (value) {
        return methods.value(this, value);
    };

    /** Remove slider functionality from the element.
     * @method
     * @return jquery element
     * @example sample <!-- slider -->
     * <button class="gj-button-md" onclick="slider.destroy()">Destroy</button>
     * <input id="slider" />
     * <script>
     *     var slider = $('#slider').slider();
     * </script>
     */
    self.destroy = function () {
        return methods.destroy(this);
    };

    $.extend($element, self);
    if ('true' !== $element.attr('data-slider')) {
        methods.init.call($element, jsConfig);
    }

    return $element;
};

gj.slider.widget.prototype = new gj.widget();
gj.slider.widget.constructor = gj.slider.widget;

(function ($) {
    $.fn.slider = function (method) {
        var $widget;
        if (this && this.length) {
            if (typeof method === 'object' || !method) {
                return new gj.slider.widget(this, method);
            } else {
                $widget = new gj.slider.widget(this, null);
                if ($widget[method]) {
                    return $widget[method].apply(this, Array.prototype.slice.call(arguments, 1));
                } else {
                    throw 'Method ' + method + ' does not exist.';
                }
            }
        }
    };
})(jQuery);