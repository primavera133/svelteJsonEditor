
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (!store || typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, callback) {
        const unsub = store.subscribe(callback);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_update);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined' ? window : global);
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
                return ret;
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_update);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    const baseUrl =
      'https://raw.githubusercontent.com/primavera133/dragonsGraphQLAPI/master/api/data/';

    const dataTree = {
      aeshnidae: [
        'aeshna-affinis',
        'aeshna-caerulea',
        'aeshna-crenata',
        'aeshna-cyanea',
        'aeshna-grandis',
        'aeshna-isoceles',
        'aeshna-juncea',
        'aeshna-mixta',
        'aeshna-serrata',
        'aeshna-subarctica',
        'aeshna-viridis',
        'anax-ephippiger',
        'anax-imaculifrons',
        'anax-imperator',
        'anax-junius',
        'anax-parthenope',
        'boyeria-cretensis',
        'boyeria-irene',
        'brachytron-pratense',
        'caliaeschna-microstigma'
      ],
      calopterygidae: [
        'calopteryx-haemorrhoidalis',
        'calopteryx-splendens',
        'calopteryx-virgo',
        'calopteryx-xanthostoma'
      ],
      coenagrionidae: [
        'ceriagrion-georgifreyi',
        'ceriagrion-tenellum',
        'coenagrion-armatum',
        'coenagrion-caerulescens',
        'coenagrion-ecornutum',
        'coenagrion-glaciale',
        'coenagrion-hastulatum',
        'coenagrion-hylas',
        'coenagrion-intermedium',
        'coenagrion-johanssonii',
        'coenagrion-lunulatum',
        'coenagrion-mercuriale',
        'coenagrion-ornatum',
        'coenagrion-puella',
        'coenagrion-pulchellum',
        'coenagrion-scitulum',
        'enallagma-cyathigerum',
        'erythromma-lindenii',
        'erythromma-najas',
        'erythromma-viridulum'
      ],
      cordulegastridae: [
        'cordulegaster-bidentata',
        'cordulegaster-boltonii',
        'cordulegaster-helladica',
        'cordulegaster-heros',
        'cordulegaster-insignis',
        'cordulegaster-picta',
        'cordulegaster-trinacriae'
      ],
      corduliidae: [
        'macromia-splendens',
        'cordulia-aenea',
        'epitheca-bimaculata',
        'oxygastra-curtisii',
        'somatochlora-alpestris',
        'somatochlora-arctica',
        'somatochlora-borisi',
        'somatochlora-flavomaculata',
        'somatochlora-meridionalis',
        'somatochlora-metallica',
        'somatochlora-sahlbergi'
      ],
      euphaeidae: ['epallage-fatime'],
      gomphidae: [
        'lindenia-tetraphylla',
        'gomphus-flavipes',
        'gomphus-graslinii',
        'gomphus-pulchellus',
        'gomphus-schneiderii',
        'gomphus-simillimus',
        'gomphus-vulgatissimus',
        'onychogomphus-costae',
        'onychogomphus-forcipatus',
        'onychogomphus-uncatus',
        'ophiogomphus-cecilia',
        'paragomphus-genei'
      ],
      lestidae: [
        'chalcolestes-parvidens',
        'chalcolestes-viridis',
        'lestes-barbarus',
        'lestes-dryas',
        'lestes-macrostigma',
        'lestes-sponsa',
        'lestes-virens',
        'sympecma-fusca',
        'sympecma-paedisca'
      ],
      libellulidae: [
        'brachythemis-impartita',
        'crocothemis-erythraea',
        'leucorrhinia-albifrons',
        'brachythemis-impartita',
        'crocothemis-erythraea',
        'leucorrhinia-albifrons',
        'leucorrhinia-caudalis',
        'leucorrhinia-dubia',
        'leucorrhinia-pectoralis',
        'leucorrhinia-rubicunda',
        'libellula-depressa',
        'libellula-fulva',
        'libellula-quadrimaculata',
        'orthetrum-albistylum',
        'orthetrum-brunneum',
        'orthetrum-cancellatum',
        'orthetrum-chrysostigma',
        'orthetrum-coerulescens',
        'orthetrum-nitidinerve',
        'orthetrum-sabina',
        'orthetrum-taeniolatum',
        'orthetrum-trinacria',
        'pantala-flaviscens',
        'selysiothemis-nigra',
        'sympetrum-danae',
        'sympetrum-depressiculum',
        'sympetrum-flaveolum',
        'sympetrum-fonscolombii',
        'sympetrum-lefebvrii',
        'sympetrum-meridionale',
        'sympetrum-nigrifemur',
        'sympetrum-pedemontanum',
        'sympetrum-sanguineum',
        'sympetrum-sinaiticum',
        'sympetrum-striolatum',
        'sympetrum-vulgatum',
        'thrithemis-annulata',
        'thrithemis-arteriosa',
        'thrithemis-festiva',
        'thrithemis-kirbyi',
        'zygonyx-torridus'
      ],
      platychnemididae: [
        'platychnemis-acutipennis',
        'platychnemis-latipes',
        'platychnemis-pennipes'
      ]
    };

    var config = {
      baseUrl,
      dataTree
    };

    var bind = function bind(fn, thisArg) {
      return function wrap() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
      };
    };

    /*!
     * Determine if an object is a Buffer
     *
     * @author   Feross Aboukhadijeh <https://feross.org>
     * @license  MIT
     */

    var isBuffer = function isBuffer (obj) {
      return obj != null && obj.constructor != null &&
        typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
    };

    /*global toString:true*/

    // utils is a library of generic helper functions non-specific to axios

    var toString = Object.prototype.toString;

    /**
     * Determine if a value is an Array
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Array, otherwise false
     */
    function isArray(val) {
      return toString.call(val) === '[object Array]';
    }

    /**
     * Determine if a value is an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an ArrayBuffer, otherwise false
     */
    function isArrayBuffer(val) {
      return toString.call(val) === '[object ArrayBuffer]';
    }

    /**
     * Determine if a value is a FormData
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an FormData, otherwise false
     */
    function isFormData(val) {
      return (typeof FormData !== 'undefined') && (val instanceof FormData);
    }

    /**
     * Determine if a value is a view on an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
     */
    function isArrayBufferView(val) {
      var result;
      if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
        result = ArrayBuffer.isView(val);
      } else {
        result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
      }
      return result;
    }

    /**
     * Determine if a value is a String
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a String, otherwise false
     */
    function isString(val) {
      return typeof val === 'string';
    }

    /**
     * Determine if a value is a Number
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Number, otherwise false
     */
    function isNumber(val) {
      return typeof val === 'number';
    }

    /**
     * Determine if a value is undefined
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if the value is undefined, otherwise false
     */
    function isUndefined(val) {
      return typeof val === 'undefined';
    }

    /**
     * Determine if a value is an Object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Object, otherwise false
     */
    function isObject(val) {
      return val !== null && typeof val === 'object';
    }

    /**
     * Determine if a value is a Date
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Date, otherwise false
     */
    function isDate(val) {
      return toString.call(val) === '[object Date]';
    }

    /**
     * Determine if a value is a File
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a File, otherwise false
     */
    function isFile(val) {
      return toString.call(val) === '[object File]';
    }

    /**
     * Determine if a value is a Blob
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Blob, otherwise false
     */
    function isBlob(val) {
      return toString.call(val) === '[object Blob]';
    }

    /**
     * Determine if a value is a Function
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Function, otherwise false
     */
    function isFunction(val) {
      return toString.call(val) === '[object Function]';
    }

    /**
     * Determine if a value is a Stream
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Stream, otherwise false
     */
    function isStream(val) {
      return isObject(val) && isFunction(val.pipe);
    }

    /**
     * Determine if a value is a URLSearchParams object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a URLSearchParams object, otherwise false
     */
    function isURLSearchParams(val) {
      return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
    }

    /**
     * Trim excess whitespace off the beginning and end of a string
     *
     * @param {String} str The String to trim
     * @returns {String} The String freed of excess whitespace
     */
    function trim(str) {
      return str.replace(/^\s*/, '').replace(/\s*$/, '');
    }

    /**
     * Determine if we're running in a standard browser environment
     *
     * This allows axios to run in a web worker, and react-native.
     * Both environments support XMLHttpRequest, but not fully standard globals.
     *
     * web workers:
     *  typeof window -> undefined
     *  typeof document -> undefined
     *
     * react-native:
     *  navigator.product -> 'ReactNative'
     * nativescript
     *  navigator.product -> 'NativeScript' or 'NS'
     */
    function isStandardBrowserEnv() {
      if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                               navigator.product === 'NativeScript' ||
                                               navigator.product === 'NS')) {
        return false;
      }
      return (
        typeof window !== 'undefined' &&
        typeof document !== 'undefined'
      );
    }

    /**
     * Iterate over an Array or an Object invoking a function for each item.
     *
     * If `obj` is an Array callback will be called passing
     * the value, index, and complete array for each item.
     *
     * If 'obj' is an Object callback will be called passing
     * the value, key, and complete object for each property.
     *
     * @param {Object|Array} obj The object to iterate
     * @param {Function} fn The callback to invoke for each item
     */
    function forEach(obj, fn) {
      // Don't bother if no value provided
      if (obj === null || typeof obj === 'undefined') {
        return;
      }

      // Force an array if not already something iterable
      if (typeof obj !== 'object') {
        /*eslint no-param-reassign:0*/
        obj = [obj];
      }

      if (isArray(obj)) {
        // Iterate over array values
        for (var i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        // Iterate over object keys
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn.call(null, obj[key], key, obj);
          }
        }
      }
    }

    /**
     * Accepts varargs expecting each argument to be an object, then
     * immutably merges the properties of each object and returns result.
     *
     * When multiple objects contain the same key the later object in
     * the arguments list will take precedence.
     *
     * Example:
     *
     * ```js
     * var result = merge({foo: 123}, {foo: 456});
     * console.log(result.foo); // outputs 456
     * ```
     *
     * @param {Object} obj1 Object to merge
     * @returns {Object} Result of all merge properties
     */
    function merge(/* obj1, obj2, obj3, ... */) {
      var result = {};
      function assignValue(val, key) {
        if (typeof result[key] === 'object' && typeof val === 'object') {
          result[key] = merge(result[key], val);
        } else {
          result[key] = val;
        }
      }

      for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
      }
      return result;
    }

    /**
     * Function equal to merge with the difference being that no reference
     * to original objects is kept.
     *
     * @see merge
     * @param {Object} obj1 Object to merge
     * @returns {Object} Result of all merge properties
     */
    function deepMerge(/* obj1, obj2, obj3, ... */) {
      var result = {};
      function assignValue(val, key) {
        if (typeof result[key] === 'object' && typeof val === 'object') {
          result[key] = deepMerge(result[key], val);
        } else if (typeof val === 'object') {
          result[key] = deepMerge({}, val);
        } else {
          result[key] = val;
        }
      }

      for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
      }
      return result;
    }

    /**
     * Extends object a by mutably adding to it the properties of object b.
     *
     * @param {Object} a The object to be extended
     * @param {Object} b The object to copy properties from
     * @param {Object} thisArg The object to bind function to
     * @return {Object} The resulting value of object a
     */
    function extend(a, b, thisArg) {
      forEach(b, function assignValue(val, key) {
        if (thisArg && typeof val === 'function') {
          a[key] = bind(val, thisArg);
        } else {
          a[key] = val;
        }
      });
      return a;
    }

    var utils = {
      isArray: isArray,
      isArrayBuffer: isArrayBuffer,
      isBuffer: isBuffer,
      isFormData: isFormData,
      isArrayBufferView: isArrayBufferView,
      isString: isString,
      isNumber: isNumber,
      isObject: isObject,
      isUndefined: isUndefined,
      isDate: isDate,
      isFile: isFile,
      isBlob: isBlob,
      isFunction: isFunction,
      isStream: isStream,
      isURLSearchParams: isURLSearchParams,
      isStandardBrowserEnv: isStandardBrowserEnv,
      forEach: forEach,
      merge: merge,
      deepMerge: deepMerge,
      extend: extend,
      trim: trim
    };

    function encode(val) {
      return encodeURIComponent(val).
        replace(/%40/gi, '@').
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, '+').
        replace(/%5B/gi, '[').
        replace(/%5D/gi, ']');
    }

    /**
     * Build a URL by appending params to the end
     *
     * @param {string} url The base of the url (e.g., http://www.google.com)
     * @param {object} [params] The params to be appended
     * @returns {string} The formatted url
     */
    var buildURL = function buildURL(url, params, paramsSerializer) {
      /*eslint no-param-reassign:0*/
      if (!params) {
        return url;
      }

      var serializedParams;
      if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
      } else if (utils.isURLSearchParams(params)) {
        serializedParams = params.toString();
      } else {
        var parts = [];

        utils.forEach(params, function serialize(val, key) {
          if (val === null || typeof val === 'undefined') {
            return;
          }

          if (utils.isArray(val)) {
            key = key + '[]';
          } else {
            val = [val];
          }

          utils.forEach(val, function parseValue(v) {
            if (utils.isDate(v)) {
              v = v.toISOString();
            } else if (utils.isObject(v)) {
              v = JSON.stringify(v);
            }
            parts.push(encode(key) + '=' + encode(v));
          });
        });

        serializedParams = parts.join('&');
      }

      if (serializedParams) {
        var hashmarkIndex = url.indexOf('#');
        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }

        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
      }

      return url;
    };

    function InterceptorManager() {
      this.handlers = [];
    }

    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    InterceptorManager.prototype.use = function use(fulfilled, rejected) {
      this.handlers.push({
        fulfilled: fulfilled,
        rejected: rejected
      });
      return this.handlers.length - 1;
    };

    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     */
    InterceptorManager.prototype.eject = function eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    };

    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     */
    InterceptorManager.prototype.forEach = function forEach(fn) {
      utils.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    };

    var InterceptorManager_1 = InterceptorManager;

    /**
     * Transform the data for a request or a response
     *
     * @param {Object|String} data The data to be transformed
     * @param {Array} headers The headers for the request or response
     * @param {Array|Function} fns A single function or Array of functions
     * @returns {*} The resulting transformed data
     */
    var transformData = function transformData(data, headers, fns) {
      /*eslint no-param-reassign:0*/
      utils.forEach(fns, function transform(fn) {
        data = fn(data, headers);
      });

      return data;
    };

    var isCancel = function isCancel(value) {
      return !!(value && value.__CANCEL__);
    };

    var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
      utils.forEach(headers, function processHeader(value, name) {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
          headers[normalizedName] = value;
          delete headers[name];
        }
      });
    };

    /**
     * Update an Error with the specified config, error code, and response.
     *
     * @param {Error} error The error to update.
     * @param {Object} config The config.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The error.
     */
    var enhanceError = function enhanceError(error, config, code, request, response) {
      error.config = config;
      if (code) {
        error.code = code;
      }

      error.request = request;
      error.response = response;
      error.isAxiosError = true;

      error.toJSON = function() {
        return {
          // Standard
          message: this.message,
          name: this.name,
          // Microsoft
          description: this.description,
          number: this.number,
          // Mozilla
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          // Axios
          config: this.config,
          code: this.code
        };
      };
      return error;
    };

    /**
     * Create an Error with the specified message, config, error code, request and response.
     *
     * @param {string} message The error message.
     * @param {Object} config The config.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The created error.
     */
    var createError = function createError(message, config, code, request, response) {
      var error = new Error(message);
      return enhanceError(error, config, code, request, response);
    };

    /**
     * Resolve or reject a Promise based on response status.
     *
     * @param {Function} resolve A function that resolves the promise.
     * @param {Function} reject A function that rejects the promise.
     * @param {object} response The response.
     */
    var settle = function settle(resolve, reject, response) {
      var validateStatus = response.config.validateStatus;
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(createError(
          'Request failed with status code ' + response.status,
          response.config,
          null,
          response.request,
          response
        ));
      }
    };

    // Headers whose duplicates are ignored by node
    // c.f. https://nodejs.org/api/http.html#http_message_headers
    var ignoreDuplicateOf = [
      'age', 'authorization', 'content-length', 'content-type', 'etag',
      'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
      'last-modified', 'location', 'max-forwards', 'proxy-authorization',
      'referer', 'retry-after', 'user-agent'
    ];

    /**
     * Parse headers into an object
     *
     * ```
     * Date: Wed, 27 Aug 2014 08:58:49 GMT
     * Content-Type: application/json
     * Connection: keep-alive
     * Transfer-Encoding: chunked
     * ```
     *
     * @param {String} headers Headers needing to be parsed
     * @returns {Object} Headers parsed into an object
     */
    var parseHeaders = function parseHeaders(headers) {
      var parsed = {};
      var key;
      var val;
      var i;

      if (!headers) { return parsed; }

      utils.forEach(headers.split('\n'), function parser(line) {
        i = line.indexOf(':');
        key = utils.trim(line.substr(0, i)).toLowerCase();
        val = utils.trim(line.substr(i + 1));

        if (key) {
          if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
            return;
          }
          if (key === 'set-cookie') {
            parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
          }
        }
      });

      return parsed;
    };

    var isURLSameOrigin = (
      utils.isStandardBrowserEnv() ?

      // Standard browser envs have full support of the APIs needed to test
      // whether the request URL is of the same origin as current location.
        (function standardBrowserEnv() {
          var msie = /(msie|trident)/i.test(navigator.userAgent);
          var urlParsingNode = document.createElement('a');
          var originURL;

          /**
        * Parse a URL to discover it's components
        *
        * @param {String} url The URL to be parsed
        * @returns {Object}
        */
          function resolveURL(url) {
            var href = url;

            if (msie) {
            // IE needs attribute set twice to normalize properties
              urlParsingNode.setAttribute('href', href);
              href = urlParsingNode.href;
            }

            urlParsingNode.setAttribute('href', href);

            // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
            return {
              href: urlParsingNode.href,
              protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
              host: urlParsingNode.host,
              search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
              hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
              hostname: urlParsingNode.hostname,
              port: urlParsingNode.port,
              pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                urlParsingNode.pathname :
                '/' + urlParsingNode.pathname
            };
          }

          originURL = resolveURL(window.location.href);

          /**
        * Determine if a URL shares the same origin as the current location
        *
        * @param {String} requestURL The URL to test
        * @returns {boolean} True if URL shares the same origin, otherwise false
        */
          return function isURLSameOrigin(requestURL) {
            var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
            return (parsed.protocol === originURL.protocol &&
                parsed.host === originURL.host);
          };
        })() :

      // Non standard browser envs (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
          return function isURLSameOrigin() {
            return true;
          };
        })()
    );

    var cookies = (
      utils.isStandardBrowserEnv() ?

      // Standard browser envs support document.cookie
        (function standardBrowserEnv() {
          return {
            write: function write(name, value, expires, path, domain, secure) {
              var cookie = [];
              cookie.push(name + '=' + encodeURIComponent(value));

              if (utils.isNumber(expires)) {
                cookie.push('expires=' + new Date(expires).toGMTString());
              }

              if (utils.isString(path)) {
                cookie.push('path=' + path);
              }

              if (utils.isString(domain)) {
                cookie.push('domain=' + domain);
              }

              if (secure === true) {
                cookie.push('secure');
              }

              document.cookie = cookie.join('; ');
            },

            read: function read(name) {
              var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
              return (match ? decodeURIComponent(match[3]) : null);
            },

            remove: function remove(name) {
              this.write(name, '', Date.now() - 86400000);
            }
          };
        })() :

      // Non standard browser env (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
          return {
            write: function write() {},
            read: function read() { return null; },
            remove: function remove() {}
          };
        })()
    );

    var xhr = function xhrAdapter(config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        var requestData = config.data;
        var requestHeaders = config.headers;

        if (utils.isFormData(requestData)) {
          delete requestHeaders['Content-Type']; // Let the browser set it
        }

        var request = new XMLHttpRequest();

        // HTTP basic authentication
        if (config.auth) {
          var username = config.auth.username || '';
          var password = config.auth.password || '';
          requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
        }

        request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

        // Set the request timeout in MS
        request.timeout = config.timeout;

        // Listen for ready state
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }

          // The request errored out and we didn't get a response, this will be
          // handled by onerror instead
          // With one exception: request that using file: protocol, most browsers
          // will return status as 0 even though it's a successful request
          if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
            return;
          }

          // Prepare the response
          var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
          var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
          var response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config: config,
            request: request
          };

          settle(resolve, reject, response);

          // Clean up request
          request = null;
        };

        // Handle browser request cancellation (as opposed to a manual cancellation)
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }

          reject(createError('Request aborted', config, 'ECONNABORTED', request));

          // Clean up request
          request = null;
        };

        // Handle low level network errors
        request.onerror = function handleError() {
          // Real errors are hidden from us by the browser
          // onerror should only fire if it's a network error
          reject(createError('Network Error', config, null, request));

          // Clean up request
          request = null;
        };

        // Handle timeout
        request.ontimeout = function handleTimeout() {
          reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
            request));

          // Clean up request
          request = null;
        };

        // Add xsrf header
        // This is only done if running in a standard browser environment.
        // Specifically not if we're in a web worker, or react-native.
        if (utils.isStandardBrowserEnv()) {
          var cookies$1 = cookies;

          // Add xsrf header
          var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
            cookies$1.read(config.xsrfCookieName) :
            undefined;

          if (xsrfValue) {
            requestHeaders[config.xsrfHeaderName] = xsrfValue;
          }
        }

        // Add headers to the request
        if ('setRequestHeader' in request) {
          utils.forEach(requestHeaders, function setRequestHeader(val, key) {
            if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
              // Remove Content-Type if data is undefined
              delete requestHeaders[key];
            } else {
              // Otherwise add header to the request
              request.setRequestHeader(key, val);
            }
          });
        }

        // Add withCredentials to request if needed
        if (config.withCredentials) {
          request.withCredentials = true;
        }

        // Add responseType to request if needed
        if (config.responseType) {
          try {
            request.responseType = config.responseType;
          } catch (e) {
            // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
            // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
            if (config.responseType !== 'json') {
              throw e;
            }
          }
        }

        // Handle progress if needed
        if (typeof config.onDownloadProgress === 'function') {
          request.addEventListener('progress', config.onDownloadProgress);
        }

        // Not all browsers support upload events
        if (typeof config.onUploadProgress === 'function' && request.upload) {
          request.upload.addEventListener('progress', config.onUploadProgress);
        }

        if (config.cancelToken) {
          // Handle cancellation
          config.cancelToken.promise.then(function onCanceled(cancel) {
            if (!request) {
              return;
            }

            request.abort();
            reject(cancel);
            // Clean up request
            request = null;
          });
        }

        if (requestData === undefined) {
          requestData = null;
        }

        // Send the request
        request.send(requestData);
      });
    };

    var DEFAULT_CONTENT_TYPE = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    function setContentTypeIfUnset(headers, value) {
      if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
        headers['Content-Type'] = value;
      }
    }

    function getDefaultAdapter() {
      var adapter;
      // Only Node.JS has a process variable that is of [[Class]] process
      if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
        // For node use HTTP adapter
        adapter = xhr;
      } else if (typeof XMLHttpRequest !== 'undefined') {
        // For browsers use XHR adapter
        adapter = xhr;
      }
      return adapter;
    }

    var defaults = {
      adapter: getDefaultAdapter(),

      transformRequest: [function transformRequest(data, headers) {
        normalizeHeaderName(headers, 'Accept');
        normalizeHeaderName(headers, 'Content-Type');
        if (utils.isFormData(data) ||
          utils.isArrayBuffer(data) ||
          utils.isBuffer(data) ||
          utils.isStream(data) ||
          utils.isFile(data) ||
          utils.isBlob(data)
        ) {
          return data;
        }
        if (utils.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils.isURLSearchParams(data)) {
          setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
          return data.toString();
        }
        if (utils.isObject(data)) {
          setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
          return JSON.stringify(data);
        }
        return data;
      }],

      transformResponse: [function transformResponse(data) {
        /*eslint no-param-reassign:0*/
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (e) { /* Ignore */ }
        }
        return data;
      }],

      /**
       * A timeout in milliseconds to abort a request. If set to 0 (default) a
       * timeout is not created.
       */
      timeout: 0,

      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',

      maxContentLength: -1,

      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      }
    };

    defaults.headers = {
      common: {
        'Accept': 'application/json, text/plain, */*'
      }
    };

    utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
      defaults.headers[method] = {};
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
    });

    var defaults_1 = defaults;

    /**
     * Determines whether the specified URL is absolute
     *
     * @param {string} url The URL to test
     * @returns {boolean} True if the specified URL is absolute, otherwise false
     */
    var isAbsoluteURL = function isAbsoluteURL(url) {
      // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
      // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
      // by any combination of letters, digits, plus, period, or hyphen.
      return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
    };

    /**
     * Creates a new URL by combining the specified URLs
     *
     * @param {string} baseURL The base URL
     * @param {string} relativeURL The relative URL
     * @returns {string} The combined URL
     */
    var combineURLs = function combineURLs(baseURL, relativeURL) {
      return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
    };

    /**
     * Throws a `Cancel` if cancellation has been requested.
     */
    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }
    }

    /**
     * Dispatch a request to the server using the configured adapter.
     *
     * @param {object} config The config that is to be used for the request
     * @returns {Promise} The Promise to be fulfilled
     */
    var dispatchRequest = function dispatchRequest(config) {
      throwIfCancellationRequested(config);

      // Support baseURL config
      if (config.baseURL && !isAbsoluteURL(config.url)) {
        config.url = combineURLs(config.baseURL, config.url);
      }

      // Ensure headers exist
      config.headers = config.headers || {};

      // Transform request data
      config.data = transformData(
        config.data,
        config.headers,
        config.transformRequest
      );

      // Flatten headers
      config.headers = utils.merge(
        config.headers.common || {},
        config.headers[config.method] || {},
        config.headers || {}
      );

      utils.forEach(
        ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
        function cleanHeaderConfig(method) {
          delete config.headers[method];
        }
      );

      var adapter = config.adapter || defaults_1.adapter;

      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);

        // Transform response data
        response.data = transformData(
          response.data,
          response.headers,
          config.transformResponse
        );

        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);

          // Transform response data
          if (reason && reason.response) {
            reason.response.data = transformData(
              reason.response.data,
              reason.response.headers,
              config.transformResponse
            );
          }
        }

        return Promise.reject(reason);
      });
    };

    /**
     * Config-specific merge-function which creates a new config-object
     * by merging two configuration objects together.
     *
     * @param {Object} config1
     * @param {Object} config2
     * @returns {Object} New object resulting from merging config2 to config1
     */
    var mergeConfig = function mergeConfig(config1, config2) {
      // eslint-disable-next-line no-param-reassign
      config2 = config2 || {};
      var config = {};

      utils.forEach(['url', 'method', 'params', 'data'], function valueFromConfig2(prop) {
        if (typeof config2[prop] !== 'undefined') {
          config[prop] = config2[prop];
        }
      });

      utils.forEach(['headers', 'auth', 'proxy'], function mergeDeepProperties(prop) {
        if (utils.isObject(config2[prop])) {
          config[prop] = utils.deepMerge(config1[prop], config2[prop]);
        } else if (typeof config2[prop] !== 'undefined') {
          config[prop] = config2[prop];
        } else if (utils.isObject(config1[prop])) {
          config[prop] = utils.deepMerge(config1[prop]);
        } else if (typeof config1[prop] !== 'undefined') {
          config[prop] = config1[prop];
        }
      });

      utils.forEach([
        'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
        'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
        'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'maxContentLength',
        'validateStatus', 'maxRedirects', 'httpAgent', 'httpsAgent', 'cancelToken',
        'socketPath'
      ], function defaultToConfig2(prop) {
        if (typeof config2[prop] !== 'undefined') {
          config[prop] = config2[prop];
        } else if (typeof config1[prop] !== 'undefined') {
          config[prop] = config1[prop];
        }
      });

      return config;
    };

    /**
     * Create a new instance of Axios
     *
     * @param {Object} instanceConfig The default config for the instance
     */
    function Axios(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager_1(),
        response: new InterceptorManager_1()
      };
    }

    /**
     * Dispatch a request
     *
     * @param {Object} config The config specific for this request (merged with this.defaults)
     */
    Axios.prototype.request = function request(config) {
      /*eslint no-param-reassign:0*/
      // Allow for axios('example/url'[, config]) a la fetch API
      if (typeof config === 'string') {
        config = arguments[1] || {};
        config.url = arguments[0];
      } else {
        config = config || {};
      }

      config = mergeConfig(this.defaults, config);
      config.method = config.method ? config.method.toLowerCase() : 'get';

      // Hook up interceptors middleware
      var chain = [dispatchRequest, undefined];
      var promise = Promise.resolve(config);

      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        chain.unshift(interceptor.fulfilled, interceptor.rejected);
      });

      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        chain.push(interceptor.fulfilled, interceptor.rejected);
      });

      while (chain.length) {
        promise = promise.then(chain.shift(), chain.shift());
      }

      return promise;
    };

    Axios.prototype.getUri = function getUri(config) {
      config = mergeConfig(this.defaults, config);
      return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
    };

    // Provide aliases for supported request methods
    utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
      /*eslint func-names:0*/
      Axios.prototype[method] = function(url, config) {
        return this.request(utils.merge(config || {}, {
          method: method,
          url: url
        }));
      };
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      /*eslint func-names:0*/
      Axios.prototype[method] = function(url, data, config) {
        return this.request(utils.merge(config || {}, {
          method: method,
          url: url,
          data: data
        }));
      };
    });

    var Axios_1 = Axios;

    /**
     * A `Cancel` is an object that is thrown when an operation is canceled.
     *
     * @class
     * @param {string=} message The message.
     */
    function Cancel(message) {
      this.message = message;
    }

    Cancel.prototype.toString = function toString() {
      return 'Cancel' + (this.message ? ': ' + this.message : '');
    };

    Cancel.prototype.__CANCEL__ = true;

    var Cancel_1 = Cancel;

    /**
     * A `CancelToken` is an object that can be used to request cancellation of an operation.
     *
     * @class
     * @param {Function} executor The executor function.
     */
    function CancelToken(executor) {
      if (typeof executor !== 'function') {
        throw new TypeError('executor must be a function.');
      }

      var resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });

      var token = this;
      executor(function cancel(message) {
        if (token.reason) {
          // Cancellation has already been requested
          return;
        }

        token.reason = new Cancel_1(message);
        resolvePromise(token.reason);
      });
    }

    /**
     * Throws a `Cancel` if cancellation has been requested.
     */
    CancelToken.prototype.throwIfRequested = function throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    };

    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    CancelToken.source = function source() {
      var cancel;
      var token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token: token,
        cancel: cancel
      };
    };

    var CancelToken_1 = CancelToken;

    /**
     * Syntactic sugar for invoking a function and expanding an array for arguments.
     *
     * Common use case would be to use `Function.prototype.apply`.
     *
     *  ```js
     *  function f(x, y, z) {}
     *  var args = [1, 2, 3];
     *  f.apply(null, args);
     *  ```
     *
     * With `spread` this example can be re-written.
     *
     *  ```js
     *  spread(function(x, y, z) {})([1, 2, 3]);
     *  ```
     *
     * @param {Function} callback
     * @returns {Function}
     */
    var spread = function spread(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    };

    /**
     * Create an instance of Axios
     *
     * @param {Object} defaultConfig The default config for the instance
     * @return {Axios} A new instance of Axios
     */
    function createInstance(defaultConfig) {
      var context = new Axios_1(defaultConfig);
      var instance = bind(Axios_1.prototype.request, context);

      // Copy axios.prototype to instance
      utils.extend(instance, Axios_1.prototype, context);

      // Copy context to instance
      utils.extend(instance, context);

      return instance;
    }

    // Create the default instance to be exported
    var axios = createInstance(defaults_1);

    // Expose Axios class to allow class inheritance
    axios.Axios = Axios_1;

    // Factory for creating new instances
    axios.create = function create(instanceConfig) {
      return createInstance(mergeConfig(axios.defaults, instanceConfig));
    };

    // Expose Cancel & CancelToken
    axios.Cancel = Cancel_1;
    axios.CancelToken = CancelToken_1;
    axios.isCancel = isCancel;

    // Expose all/spread
    axios.all = function all(promises) {
      return Promise.all(promises);
    };
    axios.spread = spread;

    var axios_1 = axios;

    // Allow use of default import syntax in TypeScript
    var default_1 = axios;
    axios_1.default = default_1;

    var axios$1 = axios_1;

    var items_id = "";
    var scientific_name = "";
    var local_names = [
    ];
    var description = "";
    var behaviour = "";
    var size = {
    	length: "mm",
    	wingspan: " mm"
    };
    var similar_species = [
    ];
    var distribution = "";
    var habitat = "";
    var flight_period = "";
    var red_list = {
    	habitats_directive: "",
    	red_list_EU27: "",
    	red_list_europe: "",
    	red_list_mediterranean: "",
    	EU27_endemic: "",
    	red_list_europe_endemic: "",
    	trend_europe: ""
    };
    var initialJson = {
    	items_id: items_id,
    	scientific_name: scientific_name,
    	local_names: local_names,
    	description: description,
    	behaviour: behaviour,
    	size: size,
    	similar_species: similar_species,
    	distribution: distribution,
    	habitat: habitat,
    	flight_period: flight_period,
    	red_list: red_list
    };

    function normalize (data) {
      const strKeys = [
        'behaviour',
        'description',
        'distribution',
        'habitat',
        'flight_period'
      ];
      strKeys.forEach(key => {
        if (!data[strKeys]) data[key] = '';
      });

      if (!data.size) {
        data.size = {
          length: 'mm',
          wingspan: 'mm'
        };
      }

      if (!data.similar_species) {
        data.similar_species = [];
      }

      if (!data.red_list) {
        data.red_list = {
          habitats_directive: '',
          red_list_EU27: '',
          red_list_europe: '',
          red_list_mediterranean: '',
          EU27_endemic: '',
          red_list_europe_endemic: '',
          trend_europe: ''
        };
      }

      return data
    }

    const getJson = ({ family, species }) => {
      return new Promise((resolve, reject) => {
        try {
          const url = `${config.baseUrl}${family}/${species}.json`;
          axios$1
            .get(url)
            .then(response => {
              console.log(1111);
              resolve(normalize(response.data));
            })
            .catch(e => {
              console.log(2222);
              resolve(initialJson);
            });
        } catch (error) {
          console.log(3333);
          resolve(initialJson);
        }
      })
    };

    /* src/FamilySelector.svelte generated by Svelte v3.12.1 */
    const { Object: Object_1 } = globals;

    const file = "src/FamilySelector.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object_1.create(ctx);
    	child_ctx.family = list[i];
    	return child_ctx;
    }

    // (23:4) {#each families as family}
    function create_each_block(ctx) {
    	var option, t_value = ctx.family + "", t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = ctx.family;
    			option.value = option.__value;
    			add_location(option, file, 23, 6, 447);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(option);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block.name, type: "each", source: "(23:4) {#each families as family}", ctx });
    	return block;
    }

    function create_fragment(ctx) {
    	var div, select, option, dispose;

    	let each_value = ctx.families;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			select = element("select");
    			option = element("option");
    			option.textContent = "Välj en familj";

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			option.__value = "Välj en familj";
    			option.value = option.__value;
    			add_location(option, file, 21, 4, 378);
    			if (ctx.selected === void 0) add_render_callback(() => ctx.select_change_handler.call(select));
    			attr_dev(select, "id", "family");
    			add_location(select, file, 20, 2, 306);
    			attr_dev(div, "class", "select");
    			add_location(div, file, 19, 0, 283);

    			dispose = [
    				listen_dev(select, "change", ctx.select_change_handler),
    				listen_dev(select, "change", ctx.handleChange)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, select);
    			append_dev(select, option);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, ctx.selected);
    		},

    		p: function update(changed, ctx) {
    			if (changed.families) {
    				each_value = ctx.families;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}

    			if (changed.selected) select_option(select, ctx.selected);
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			destroy_each(each_blocks, detaching);

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	

      const families = Object.keys(config.dataTree);

      let selected;

      const { setFamily } = getContext("family");

      function handleChange() {
        setFamily(selected);
      }

    	function select_change_handler() {
    		selected = select_value(this);
    		$$invalidate('selected', selected);
    		$$invalidate('families', families);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('selected' in $$props) $$invalidate('selected', selected = $$props.selected);
    	};

    	return {
    		families,
    		selected,
    		handleChange,
    		select_change_handler
    	};
    }

    class FamilySelector extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "FamilySelector", options, id: create_fragment.name });
    	}
    }

    /* src/SpecieSelector.svelte generated by Svelte v3.12.1 */

    const file$1 = "src/SpecieSelector.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.specie = list[i];
    	return child_ctx;
    }

    // (31:0) {#if selectedFamily}
    function create_if_block(ctx) {
    	var div, select, option, t0, t1, option_value_value, dispose;

    	let each_value = ctx.species;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			select = element("select");
    			option = element("option");
    			t0 = text("Välj en art inom ");
    			t1 = text(ctx.selectedFamily);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			option.__value = option_value_value = "Välj en art inom " + ctx.selectedFamily;
    			option.value = option.__value;
    			add_location(option, file$1, 33, 6, 643);
    			if (ctx.selected === void 0) add_render_callback(() => ctx.select_change_handler.call(select));
    			attr_dev(select, "id", "species");
    			add_location(select, file$1, 32, 4, 568);
    			attr_dev(div, "class", "select select-specie svelte-130s37p");
    			add_location(div, file$1, 31, 2, 529);

    			dispose = [
    				listen_dev(select, "change", ctx.select_change_handler),
    				listen_dev(select, "change", ctx.handleChange)
    			];
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, select);
    			append_dev(select, option);
    			append_dev(option, t0);
    			append_dev(option, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, ctx.selected);
    		},

    		p: function update(changed, ctx) {
    			if (changed.selectedFamily) {
    				set_data_dev(t1, ctx.selectedFamily);
    			}

    			if ((changed.selectedFamily) && option_value_value !== (option_value_value = "Välj en art inom " + ctx.selectedFamily)) {
    				prop_dev(option, "__value", option_value_value);
    			}

    			option.value = option.__value;

    			if (changed.species || changed.selectedSpecie) {
    				each_value = ctx.species;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}

    			if (changed.selected) select_option(select, ctx.selected);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			destroy_each(each_blocks, detaching);

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block.name, type: "if", source: "(31:0) {#if selectedFamily}", ctx });
    	return block;
    }

    // (35:6) {#each species as specie}
    function create_each_block$1(ctx) {
    	var option, t_value = ctx.specie + "", t, option_selected_value, option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.selected = option_selected_value = ctx.specie === ctx.selectedSpecie;
    			option.__value = option_value_value = ctx.specie;
    			option.value = option.__value;
    			add_location(option, file$1, 35, 8, 734);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.species) && t_value !== (t_value = ctx.specie + "")) {
    				set_data_dev(t, t_value);
    			}

    			if ((changed.species || changed.selectedSpecie) && option_selected_value !== (option_selected_value = ctx.specie === ctx.selectedSpecie)) {
    				prop_dev(option, "selected", option_selected_value);
    			}

    			if ((changed.species) && option_value_value !== (option_value_value = ctx.specie)) {
    				prop_dev(option, "__value", option_value_value);
    			}

    			option.value = option.__value;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(option);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$1.name, type: "each", source: "(35:6) {#each species as specie}", ctx });
    	return block;
    }

    function create_fragment$1(ctx) {
    	var if_block_anchor;

    	var if_block = (ctx.selectedFamily) && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (ctx.selectedFamily) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);

    			if (detaching) {
    				detach_dev(if_block_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$1.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	

      let { selectedFamily, selectedSpecie } = $$props;
      let selected;

      let species = [];

      const { setSpecie } = getContext("specie");

      function handleChange() {
        setSpecie(selected);
      }

    	const writable_props = ['selectedFamily', 'selectedSpecie'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<SpecieSelector> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		selected = select_value(this);
    		$$invalidate('selected', selected);
    		$$invalidate('species', species), $$invalidate('selectedFamily', selectedFamily);
    		$$invalidate('selectedFamily', selectedFamily);
    	}

    	$$self.$set = $$props => {
    		if ('selectedFamily' in $$props) $$invalidate('selectedFamily', selectedFamily = $$props.selectedFamily);
    		if ('selectedSpecie' in $$props) $$invalidate('selectedSpecie', selectedSpecie = $$props.selectedSpecie);
    	};

    	$$self.$capture_state = () => {
    		return { selectedFamily, selectedSpecie, selected, species };
    	};

    	$$self.$inject_state = $$props => {
    		if ('selectedFamily' in $$props) $$invalidate('selectedFamily', selectedFamily = $$props.selectedFamily);
    		if ('selectedSpecie' in $$props) $$invalidate('selectedSpecie', selectedSpecie = $$props.selectedSpecie);
    		if ('selected' in $$props) $$invalidate('selected', selected = $$props.selected);
    		if ('species' in $$props) $$invalidate('species', species = $$props.species);
    	};

    	$$self.$$.update = ($$dirty = { selectedFamily: 1 }) => {
    		if ($$dirty.selectedFamily) { {
            if (selectedFamily) {
              $$invalidate('species', species = config.dataTree[selectedFamily]);
            }
          } }
    	};

    	return {
    		selectedFamily,
    		selectedSpecie,
    		selected,
    		species,
    		handleChange,
    		select_change_handler
    	};
    }

    class SpecieSelector extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, ["selectedFamily", "selectedSpecie"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "SpecieSelector", options, id: create_fragment$1.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.selectedFamily === undefined && !('selectedFamily' in props)) {
    			console.warn("<SpecieSelector> was created without expected prop 'selectedFamily'");
    		}
    		if (ctx.selectedSpecie === undefined && !('selectedSpecie' in props)) {
    			console.warn("<SpecieSelector> was created without expected prop 'selectedSpecie'");
    		}
    	}

    	get selectedFamily() {
    		throw new Error("<SpecieSelector>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedFamily(value) {
    		throw new Error("<SpecieSelector>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedSpecie() {
    		throw new Error("<SpecieSelector>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedSpecie(value) {
    		throw new Error("<SpecieSelector>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const json = writable({});
    const openField = writable(null);
    const savedSpecie = writable(null);

    /* src/EditableTextArea.svelte generated by Svelte v3.12.1 */

    const file$2 = "src/EditableTextArea.svelte";

    // (42:0) {:else}
    function create_else_block(ctx) {
    	var fieldset, button0, label, t0, label_for_value, t1, textarea, textarea_id_value, t2, button1, dispose;

    	const block = {
    		c: function create() {
    			fieldset = element("fieldset");
    			button0 = element("button");
    			label = element("label");
    			t0 = text(ctx.key);
    			t1 = space();
    			textarea = element("textarea");
    			t2 = space();
    			button1 = element("button");
    			button1.textContent = "Close";
    			attr_dev(label, "for", label_for_value = `input_text_${ctx.key}`);
    			add_location(label, file$2, 46, 6, 921);
    			attr_dev(button0, "class", "truncate button-primary-text svelte-1sm3mev");
    			add_location(button0, file$2, 43, 4, 820);
    			attr_dev(textarea, "id", textarea_id_value = `input_text_${ctx.key}`);
    			attr_dev(textarea, "name", ctx.key);
    			attr_dev(textarea, "class", "");
    			attr_dev(textarea, "rows", 12);
    			add_location(textarea, file$2, 48, 4, 986);
    			attr_dev(button1, "class", "close button-primary-text svelte-1sm3mev");
    			add_location(button1, file$2, 49, 4, 1091);
    			add_location(fieldset, file$2, 42, 2, 805);

    			dispose = [
    				listen_dev(button0, "click", ctx.click_handler_1),
    				listen_dev(textarea, "input", ctx.textarea_input_handler),
    				listen_dev(button1, "click", ctx.click_handler_2)
    			];
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, fieldset, anchor);
    			append_dev(fieldset, button0);
    			append_dev(button0, label);
    			append_dev(label, t0);
    			append_dev(fieldset, t1);
    			append_dev(fieldset, textarea);

    			set_input_value(textarea, ctx.$json[ctx.key]);

    			append_dev(fieldset, t2);
    			append_dev(fieldset, button1);
    		},

    		p: function update(changed, ctx) {
    			if (changed.key) {
    				set_data_dev(t0, ctx.key);
    			}

    			if ((changed.key) && label_for_value !== (label_for_value = `input_text_${ctx.key}`)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if ((changed.$json || changed.key)) set_input_value(textarea, ctx.$json[ctx.key]);

    			if ((changed.key) && textarea_id_value !== (textarea_id_value = `input_text_${ctx.key}`)) {
    				attr_dev(textarea, "id", textarea_id_value);
    			}

    			if (changed.key) {
    				attr_dev(textarea, "name", ctx.key);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(fieldset);
    			}

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block.name, type: "else", source: "(42:0) {:else}", ctx });
    	return block;
    }

    // (35:0) {#if !open}
    function create_if_block$1(ctx) {
    	var button, label, t0_value = ctx.getLabel() + "", t0, t1, t2_value = ctx.$json[ctx.key] + "", t2, dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = text("\n    : ");
    			t2 = text(t2_value);
    			add_location(label, file$2, 38, 4, 736);
    			attr_dev(button, "class", "truncate button-primary-text svelte-1sm3mev");
    			add_location(button, file$2, 35, 2, 643);
    			dispose = listen_dev(button, "click", ctx.click_handler);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, label);
    			append_dev(label, t0);
    			append_dev(button, t1);
    			append_dev(button, t2);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.$json || changed.key) && t2_value !== (t2_value = ctx.$json[ctx.key] + "")) {
    				set_data_dev(t2, t2_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(button);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$1.name, type: "if", source: "(35:0) {#if !open}", ctx });
    	return block;
    }

    function create_fragment$2(ctx) {
    	var if_block_anchor;

    	function select_block_type(changed, ctx) {
    		if (!ctx.open) return create_if_block$1;
    		return create_else_block;
    	}

    	var current_block_type = select_block_type(null, ctx);
    	var if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (current_block_type === (current_block_type = select_block_type(changed, ctx)) && if_block) {
    				if_block.p(changed, ctx);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);
    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if_block.d(detaching);

    			if (detaching) {
    				detach_dev(if_block_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$2.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $openField, $json;

    	validate_store(openField, 'openField');
    	component_subscribe($$self, openField, $$value => { $openField = $$value; $$invalidate('$openField', $openField); });
    	validate_store(json, 'json');
    	component_subscribe($$self, json, $$value => { $json = $$value; $$invalidate('$json', $json); });

    	

      let { key, open = false } = $$props;

      function getLabel() {
        return key.replace("_", " ");
      }

      function handleChange(key) {
        set_store_value(openField, $openField = key);
      }

    	const writable_props = ['key', 'open'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<EditableTextArea> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => handleChange(key);

    	const click_handler_1 = () => (set_store_value(openField, $openField = null));

    	function textarea_input_handler() {
    		json.update($$value => ($$value[key] = this.value, $$value));
    		$$invalidate('key', key);
    	}

    	const click_handler_2 = () => (set_store_value(openField, $openField = null));

    	$$self.$set = $$props => {
    		if ('key' in $$props) $$invalidate('key', key = $$props.key);
    		if ('open' in $$props) $$invalidate('open', open = $$props.open);
    	};

    	$$self.$capture_state = () => {
    		return { key, open, $openField, $json };
    	};

    	$$self.$inject_state = $$props => {
    		if ('key' in $$props) $$invalidate('key', key = $$props.key);
    		if ('open' in $$props) $$invalidate('open', open = $$props.open);
    		if ('$openField' in $$props) openField.set($openField);
    		if ('$json' in $$props) json.set($json);
    	};

    	$$self.$$.update = ($$dirty = { $openField: 1, key: 1 }) => {
    		if ($$dirty.$openField || $$dirty.key) { $$invalidate('open', open = $openField === key); }
    	};

    	return {
    		key,
    		open,
    		getLabel,
    		handleChange,
    		$openField,
    		$json,
    		click_handler,
    		click_handler_1,
    		textarea_input_handler,
    		click_handler_2
    	};
    }

    class EditableTextArea extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, ["key", "open"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "EditableTextArea", options, id: create_fragment$2.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.key === undefined && !('key' in props)) {
    			console.warn("<EditableTextArea> was created without expected prop 'key'");
    		}
    	}

    	get key() {
    		throw new Error("<EditableTextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<EditableTextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<EditableTextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<EditableTextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/EditableTextLine.svelte generated by Svelte v3.12.1 */

    const file$3 = "src/EditableTextLine.svelte";

    // (45:0) {:else}
    function create_else_block$1(ctx) {
    	var fieldset, button0, label, t0, label_for_value, t1, input, input_id_value, t2, button1, dispose;

    	const block = {
    		c: function create() {
    			fieldset = element("fieldset");
    			button0 = element("button");
    			label = element("label");
    			t0 = text(ctx.key);
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			button1 = element("button");
    			button1.textContent = "Close";
    			attr_dev(label, "for", label_for_value = `input_text_${ctx.key}`);
    			add_location(label, file$3, 49, 6, 957);
    			attr_dev(button0, "class", "truncate button-primary-text svelte-rqkxgg");
    			add_location(button0, file$3, 46, 4, 856);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", input_id_value = `input_text_${ctx.key}`);
    			attr_dev(input, "name", ctx.key);
    			attr_dev(input, "class", " svelte-rqkxgg");
    			add_location(input, file$3, 51, 4, 1022);
    			attr_dev(button1, "class", "close button-primary-text svelte-rqkxgg");
    			add_location(button1, file$3, 57, 4, 1147);
    			add_location(fieldset, file$3, 45, 2, 841);

    			dispose = [
    				listen_dev(button0, "click", ctx.click_handler_1),
    				listen_dev(input, "input", ctx.input_input_handler),
    				listen_dev(button1, "click", ctx.click_handler_2)
    			];
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, fieldset, anchor);
    			append_dev(fieldset, button0);
    			append_dev(button0, label);
    			append_dev(label, t0);
    			append_dev(fieldset, t1);
    			append_dev(fieldset, input);

    			set_input_value(input, ctx.$json[ctx.key]);

    			append_dev(fieldset, t2);
    			append_dev(fieldset, button1);
    		},

    		p: function update(changed, ctx) {
    			if (changed.key) {
    				set_data_dev(t0, ctx.key);
    			}

    			if ((changed.key) && label_for_value !== (label_for_value = `input_text_${ctx.key}`)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if ((changed.$json || changed.key) && (input.value !== ctx.$json[ctx.key])) set_input_value(input, ctx.$json[ctx.key]);

    			if ((changed.key) && input_id_value !== (input_id_value = `input_text_${ctx.key}`)) {
    				attr_dev(input, "id", input_id_value);
    			}

    			if (changed.key) {
    				attr_dev(input, "name", ctx.key);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(fieldset);
    			}

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block$1.name, type: "else", source: "(45:0) {:else}", ctx });
    	return block;
    }

    // (38:0) {#if !open}
    function create_if_block$2(ctx) {
    	var button, label, t0_value = ctx.getLabel() + "", t0, t1, t2_value = ctx.$json[ctx.key] + "", t2, dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = text("\n    : ");
    			t2 = text(t2_value);
    			add_location(label, file$3, 41, 4, 772);
    			attr_dev(button, "class", "truncate button-primary-text svelte-rqkxgg");
    			add_location(button, file$3, 38, 2, 679);
    			dispose = listen_dev(button, "click", ctx.click_handler);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, label);
    			append_dev(label, t0);
    			append_dev(button, t1);
    			append_dev(button, t2);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.$json || changed.key) && t2_value !== (t2_value = ctx.$json[ctx.key] + "")) {
    				set_data_dev(t2, t2_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(button);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$2.name, type: "if", source: "(38:0) {#if !open}", ctx });
    	return block;
    }

    function create_fragment$3(ctx) {
    	var if_block_anchor;

    	function select_block_type(changed, ctx) {
    		if (!ctx.open) return create_if_block$2;
    		return create_else_block$1;
    	}

    	var current_block_type = select_block_type(null, ctx);
    	var if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (current_block_type === (current_block_type = select_block_type(changed, ctx)) && if_block) {
    				if_block.p(changed, ctx);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);
    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if_block.d(detaching);

    			if (detaching) {
    				detach_dev(if_block_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$3.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $openField, $json;

    	validate_store(openField, 'openField');
    	component_subscribe($$self, openField, $$value => { $openField = $$value; $$invalidate('$openField', $openField); });
    	validate_store(json, 'json');
    	component_subscribe($$self, json, $$value => { $json = $$value; $$invalidate('$json', $json); });

    	

      let { key, open = false } = $$props;

      function getLabel() {
        return key.replace("_", " ");
      }

      function handleChange(key) {
        set_store_value(openField, $openField = key);
      }

    	const writable_props = ['key', 'open'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<EditableTextLine> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => handleChange(key);

    	const click_handler_1 = () => (set_store_value(openField, $openField = null));

    	function input_input_handler() {
    		json.update($$value => ($$value[key] = this.value, $$value));
    		$$invalidate('key', key);
    	}

    	const click_handler_2 = () => (set_store_value(openField, $openField = null));

    	$$self.$set = $$props => {
    		if ('key' in $$props) $$invalidate('key', key = $$props.key);
    		if ('open' in $$props) $$invalidate('open', open = $$props.open);
    	};

    	$$self.$capture_state = () => {
    		return { key, open, $openField, $json };
    	};

    	$$self.$inject_state = $$props => {
    		if ('key' in $$props) $$invalidate('key', key = $$props.key);
    		if ('open' in $$props) $$invalidate('open', open = $$props.open);
    		if ('$openField' in $$props) openField.set($openField);
    		if ('$json' in $$props) json.set($json);
    	};

    	$$self.$$.update = ($$dirty = { $openField: 1, key: 1 }) => {
    		if ($$dirty.$openField || $$dirty.key) { $$invalidate('open', open = $openField === key); }
    	};

    	return {
    		key,
    		open,
    		getLabel,
    		handleChange,
    		$openField,
    		$json,
    		click_handler,
    		click_handler_1,
    		input_input_handler,
    		click_handler_2
    	};
    }

    class EditableTextLine extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, ["key", "open"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "EditableTextLine", options, id: create_fragment$3.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.key === undefined && !('key' in props)) {
    			console.warn("<EditableTextLine> was created without expected prop 'key'");
    		}
    	}

    	get key() {
    		throw new Error("<EditableTextLine>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<EditableTextLine>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<EditableTextLine>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<EditableTextLine>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/EditableTextList.svelte generated by Svelte v3.12.1 */

    const file$4 = "src/EditableTextList.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.name = list[i];
    	child_ctx.each_value = list;
    	child_ctx.i = i;
    	return child_ctx;
    }

    // (66:0) {:else}
    function create_else_block$2(ctx) {
    	var fieldset, button0, label, t0, label_for_value, t1, ul, t2, button1, t4, button2, dispose;

    	let each_value = ctx.$json[ctx.key];

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			fieldset = element("fieldset");
    			button0 = element("button");
    			label = element("label");
    			t0 = text(ctx.key);
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			button1 = element("button");
    			button1.textContent = "+ Add name";
    			t4 = space();
    			button2 = element("button");
    			button2.textContent = "Close";
    			attr_dev(label, "for", label_for_value = `input_text_${ctx.key}`);
    			add_location(label, file$4, 70, 6, 1274);
    			attr_dev(button0, "class", "truncate button-primary-text svelte-1kkmgem");
    			add_location(button0, file$4, 67, 4, 1173);
    			attr_dev(ul, "class", "svelte-1kkmgem");
    			add_location(ul, file$4, 72, 4, 1339);
    			attr_dev(button1, "type", "button");
    			add_location(button1, file$4, 89, 4, 1732);
    			attr_dev(button2, "class", "close button-primary-text svelte-1kkmgem");
    			add_location(button2, file$4, 90, 4, 1799);
    			add_location(fieldset, file$4, 66, 2, 1158);

    			dispose = [
    				listen_dev(button0, "click", ctx.click_handler_1),
    				listen_dev(button1, "click", ctx.handleAdd),
    				listen_dev(button2, "click", ctx.click_handler_3)
    			];
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, fieldset, anchor);
    			append_dev(fieldset, button0);
    			append_dev(button0, label);
    			append_dev(label, t0);
    			append_dev(fieldset, t1);
    			append_dev(fieldset, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(fieldset, t2);
    			append_dev(fieldset, button1);
    			append_dev(fieldset, t4);
    			append_dev(fieldset, button2);
    		},

    		p: function update(changed, ctx) {
    			if (changed.key) {
    				set_data_dev(t0, ctx.key);
    			}

    			if ((changed.key) && label_for_value !== (label_for_value = `input_text_${ctx.key}`)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (changed.$json || changed.key) {
    				each_value = ctx.$json[ctx.key];

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(fieldset);
    			}

    			destroy_each(each_blocks, detaching);

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block$2.name, type: "else", source: "(66:0) {:else}", ctx });
    	return block;
    }

    // (59:0) {#if !open}
    function create_if_block$3(ctx) {
    	var button, label, t0_value = ctx.getLabel() + "", t0, t1, t2_value = ctx.$json[ctx.key] + "", t2, dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = text("\n    : ");
    			t2 = text(t2_value);
    			add_location(label, file$4, 62, 4, 1089);
    			attr_dev(button, "class", "truncate button-primary-text svelte-1kkmgem");
    			add_location(button, file$4, 59, 2, 996);
    			dispose = listen_dev(button, "click", ctx.click_handler);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, label);
    			append_dev(label, t0);
    			append_dev(button, t1);
    			append_dev(button, t2);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.$json || changed.key) && t2_value !== (t2_value = ctx.$json[ctx.key] + "")) {
    				set_data_dev(t2, t2_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(button);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$3.name, type: "if", source: "(59:0) {#if !open}", ctx });
    	return block;
    }

    // (74:6) {#each $json[key] as name, i}
    function create_each_block$2(ctx) {
    	var li, input, input_id_value, t0, button, t2, dispose;

    	function input_input_handler() {
    		ctx.input_input_handler.call(input, ctx);
    	}

    	function click_handler_2() {
    		return ctx.click_handler_2(ctx);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			input = element("input");
    			t0 = space();
    			button = element("button");
    			button.textContent = "-";
    			t2 = space();
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", input_id_value = `input_text_${ctx.name}`);
    			attr_dev(input, "class", " svelte-1kkmgem");
    			add_location(input, file$4, 75, 10, 1403);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "button-primary-text svelte-1kkmgem");
    			add_location(button, file$4, 80, 10, 1536);
    			attr_dev(li, "class", "svelte-1kkmgem");
    			add_location(li, file$4, 74, 8, 1388);

    			dispose = [
    				listen_dev(input, "input", input_input_handler),
    				listen_dev(button, "click", click_handler_2)
    			];
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, input);

    			set_input_value(input, ctx.name);

    			append_dev(li, t0);
    			append_dev(li, button);
    			append_dev(li, t2);
    		},

    		p: function update(changed, new_ctx) {
    			ctx = new_ctx;
    			if ((changed.$json || changed.key) && (input.value !== ctx.name)) set_input_value(input, ctx.name);

    			if ((changed.$json || changed.key) && input_id_value !== (input_id_value = `input_text_${ctx.name}`)) {
    				attr_dev(input, "id", input_id_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(li);
    			}

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$2.name, type: "each", source: "(74:6) {#each $json[key] as name, i}", ctx });
    	return block;
    }

    function create_fragment$4(ctx) {
    	var if_block_anchor;

    	function select_block_type(changed, ctx) {
    		if (!ctx.open) return create_if_block$3;
    		return create_else_block$2;
    	}

    	var current_block_type = select_block_type(null, ctx);
    	var if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (current_block_type === (current_block_type = select_block_type(changed, ctx)) && if_block) {
    				if_block.p(changed, ctx);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);
    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if_block.d(detaching);

    			if (detaching) {
    				detach_dev(if_block_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$4.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $openField, $json;

    	validate_store(openField, 'openField');
    	component_subscribe($$self, openField, $$value => { $openField = $$value; $$invalidate('$openField', $openField); });
    	validate_store(json, 'json');
    	component_subscribe($$self, json, $$value => { $json = $$value; $$invalidate('$json', $json); });

    	

      let { key, open = false } = $$props;

      function getLabel() {
        return key.replace("_", " ");
      }

      function handleDelete(i) {
        set_store_value(json, $json[key] = $json[key].slice(0, i).concat($json[key].slice(i + 1)), $json);
      }

      function handleChange(key) {
        set_store_value(openField, $openField = key);
      }

      function handleAdd() {
        set_store_value(json, $json[key] = [...$json[key], ""], $json);
      }

    	const writable_props = ['key', 'open'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<EditableTextList> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => handleChange(key);

    	const click_handler_1 = () => (set_store_value(openField, $openField = null));

    	function input_input_handler({ name, each_value, i }) {
    		each_value[i] = this.value;
    		$$invalidate('key', key);
    	}

    	const click_handler_2 = ({ i }) => handleDelete(i);

    	const click_handler_3 = () => (set_store_value(openField, $openField = null));

    	$$self.$set = $$props => {
    		if ('key' in $$props) $$invalidate('key', key = $$props.key);
    		if ('open' in $$props) $$invalidate('open', open = $$props.open);
    	};

    	$$self.$capture_state = () => {
    		return { key, open, $openField, $json };
    	};

    	$$self.$inject_state = $$props => {
    		if ('key' in $$props) $$invalidate('key', key = $$props.key);
    		if ('open' in $$props) $$invalidate('open', open = $$props.open);
    		if ('$openField' in $$props) openField.set($openField);
    		if ('$json' in $$props) json.set($json);
    	};

    	$$self.$$.update = ($$dirty = { $openField: 1, key: 1 }) => {
    		if ($$dirty.$openField || $$dirty.key) { $$invalidate('open', open = $openField === key); }
    	};

    	return {
    		key,
    		open,
    		getLabel,
    		handleDelete,
    		handleChange,
    		handleAdd,
    		$openField,
    		$json,
    		click_handler,
    		click_handler_1,
    		input_input_handler,
    		click_handler_2,
    		click_handler_3
    	};
    }

    class EditableTextList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, ["key", "open"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "EditableTextList", options, id: create_fragment$4.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.key === undefined && !('key' in props)) {
    			console.warn("<EditableTextList> was created without expected prop 'key'");
    		}
    	}

    	get key() {
    		throw new Error("<EditableTextList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<EditableTextList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<EditableTextList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<EditableTextList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/EditableObjectList.svelte generated by Svelte v3.12.1 */

    const file$5 = "src/EditableObjectList.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.selectable = list[i];
    	return child_ctx;
    }

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx._key = list[i];
    	child_ctx.i = i;
    	return child_ctx;
    }

    // (56:0) {:else}
    function create_else_block$3(ctx) {
    	var fieldset, button0, label, t0, t1, ul, t2, button1, dispose;

    	let each_value = Object.keys(ctx.$json[ctx.key]);

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			fieldset = element("fieldset");
    			button0 = element("button");
    			label = element("label");
    			t0 = text(ctx.key);
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			button1 = element("button");
    			button1.textContent = "Close";
    			add_location(label, file$5, 60, 6, 1217);
    			attr_dev(button0, "class", "truncate button-primary-text svelte-a3jvw");
    			add_location(button0, file$5, 57, 4, 1116);
    			attr_dev(ul, "class", "svelte-a3jvw");
    			add_location(ul, file$5, 62, 4, 1256);
    			attr_dev(button1, "class", "close button-primary-text svelte-a3jvw");
    			add_location(button1, file$5, 88, 4, 2034);
    			add_location(fieldset, file$5, 56, 2, 1101);

    			dispose = [
    				listen_dev(button0, "click", ctx.click_handler_1),
    				listen_dev(button1, "click", ctx.click_handler_2)
    			];
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, fieldset, anchor);
    			append_dev(fieldset, button0);
    			append_dev(button0, label);
    			append_dev(label, t0);
    			append_dev(fieldset, t1);
    			append_dev(fieldset, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(fieldset, t2);
    			append_dev(fieldset, button1);
    		},

    		p: function update(changed, ctx) {
    			if (changed.key) {
    				set_data_dev(t0, ctx.key);
    			}

    			if (changed.selectors || changed.selectedValue || changed.$json || changed.key) {
    				each_value = Object.keys(ctx.$json[ctx.key]);

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(fieldset);
    			}

    			destroy_each(each_blocks, detaching);

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block$3.name, type: "else", source: "(56:0) {:else}", ctx });
    	return block;
    }

    // (51:0) {#if !open}
    function create_if_block$4(ctx) {
    	var button, label, t0_value = ctx.getLabel() + "", t0, t1, t2_value = ctx.getTruncatedValue() + "", t2, dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = text("\n    : ");
    			t2 = text(t2_value);
    			add_location(label, file$5, 52, 4, 1023);
    			attr_dev(button, "class", "truncate button-primary-text svelte-a3jvw");
    			add_location(button, file$5, 51, 2, 938);
    			dispose = listen_dev(button, "click", ctx.click_handler);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, label);
    			append_dev(label, t0);
    			append_dev(button, t1);
    			append_dev(button, t2);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(button);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$4.name, type: "if", source: "(51:0) {#if !open}", ctx });
    	return block;
    }

    // (79:10) {:else}
    function create_else_block_1(ctx) {
    	var input, input_id_value, dispose;

    	function input_input_handler() {
    		ctx.input_input_handler.call(input, ctx);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", input_id_value = `input_text_${ctx._key}`);
    			attr_dev(input, "class", " svelte-a3jvw");
    			add_location(input, file$5, 79, 12, 1833);
    			dispose = listen_dev(input, "input", input_input_handler);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			set_input_value(input, ctx.$json[ctx.key][ctx._key]);
    		},

    		p: function update(changed, new_ctx) {
    			ctx = new_ctx;
    			if ((changed.$json || changed.key) && (input.value !== ctx.$json[ctx.key][ctx._key])) set_input_value(input, ctx.$json[ctx.key][ctx._key]);

    			if ((changed.$json || changed.key) && input_id_value !== (input_id_value = `input_text_${ctx._key}`)) {
    				attr_dev(input, "id", input_id_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(input);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block_1.name, type: "else", source: "(79:10) {:else}", ctx });
    	return block;
    }

    // (67:10) {#if selectors}
    function create_if_block_1(ctx) {
    	var select, dispose;

    	let each_value_1 = ctx.selectors[ctx._key];

    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	function select_change_handler() {
    		ctx.select_change_handler.call(select, ctx);
    	}

    	function change_handler() {
    		return ctx.change_handler(ctx);
    	}

    	const block = {
    		c: function create() {
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			if (ctx.selectedValue[ctx._key] === void 0) add_render_callback(select_change_handler);
    			add_location(select, file$5, 67, 12, 1420);

    			dispose = [
    				listen_dev(select, "change", select_change_handler),
    				listen_dev(select, "change", change_handler)
    			];
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, ctx.selectedValue[ctx._key]);
    		},

    		p: function update(changed, new_ctx) {
    			ctx = new_ctx;
    			if (changed.selectors || changed.$json || changed.key) {
    				each_value_1 = ctx.selectors[ctx._key];

    				let i;
    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value_1.length;
    			}

    			if ((changed.selectedValue || changed.$json || changed.key)) select_option(select, ctx.selectedValue[ctx._key]);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(select);
    			}

    			destroy_each(each_blocks, detaching);

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_1.name, type: "if", source: "(67:10) {#if selectors}", ctx });
    	return block;
    }

    // (71:14) {#each selectors[_key] as selectable}
    function create_each_block_1(ctx) {
    	var option, t0_value = ctx.selectable + "", t0, t1, option_selected_value, option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.selected = option_selected_value = ctx.selectable === ctx.$json[ctx.key][ctx._key];
    			option.__value = option_value_value = ctx.selectable;
    			option.value = option.__value;
    			add_location(option, file$5, 71, 16, 1595);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.selectors || changed.$json || changed.key) && t0_value !== (t0_value = ctx.selectable + "")) {
    				set_data_dev(t0, t0_value);
    			}

    			if ((changed.selectors || changed.$json || changed.key) && option_selected_value !== (option_selected_value = ctx.selectable === ctx.$json[ctx.key][ctx._key])) {
    				prop_dev(option, "selected", option_selected_value);
    			}

    			if ((changed.selectors || changed.$json || changed.key) && option_value_value !== (option_value_value = ctx.selectable)) {
    				prop_dev(option, "__value", option_value_value);
    			}

    			option.value = option.__value;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(option);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block_1.name, type: "each", source: "(71:14) {#each selectors[_key] as selectable}", ctx });
    	return block;
    }

    // (64:6) {#each Object.keys($json[key]) as _key, i}
    function create_each_block$3(ctx) {
    	var li, label, t0_value = ctx._key + "", t0, label_for_value, t1, t2;

    	function select_block_type_1(changed, ctx) {
    		if (ctx.selectors) return create_if_block_1;
    		return create_else_block_1;
    	}

    	var current_block_type = select_block_type_1(null, ctx);
    	var if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			li = element("li");
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = space();
    			if_block.c();
    			t2 = space();
    			attr_dev(label, "for", label_for_value = `input_text_${ctx._key}`);
    			add_location(label, file$5, 65, 10, 1333);
    			add_location(li, file$5, 64, 8, 1318);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, label);
    			append_dev(label, t0);
    			append_dev(li, t1);
    			if_block.m(li, null);
    			append_dev(li, t2);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.$json || changed.key) && t0_value !== (t0_value = ctx._key + "")) {
    				set_data_dev(t0, t0_value);
    			}

    			if ((changed.$json || changed.key) && label_for_value !== (label_for_value = `input_text_${ctx._key}`)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (current_block_type === (current_block_type = select_block_type_1(changed, ctx)) && if_block) {
    				if_block.p(changed, ctx);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);
    				if (if_block) {
    					if_block.c();
    					if_block.m(li, t2);
    				}
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(li);
    			}

    			if_block.d();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$3.name, type: "each", source: "(64:6) {#each Object.keys($json[key]) as _key, i}", ctx });
    	return block;
    }

    function create_fragment$5(ctx) {
    	var if_block_anchor;

    	function select_block_type(changed, ctx) {
    		if (!ctx.open) return create_if_block$4;
    		return create_else_block$3;
    	}

    	var current_block_type = select_block_type(null, ctx);
    	var if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (current_block_type === (current_block_type = select_block_type(changed, ctx)) && if_block) {
    				if_block.p(changed, ctx);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);
    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if_block.d(detaching);

    			if (detaching) {
    				detach_dev(if_block_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$5.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $openField, $json;

    	validate_store(openField, 'openField');
    	component_subscribe($$self, openField, $$value => { $openField = $$value; $$invalidate('$openField', $openField); });
    	validate_store(json, 'json');
    	component_subscribe($$self, json, $$value => { $json = $$value; $$invalidate('$json', $json); });

    	
      
      let { key, open = false, selectors } = $$props;
      let selectedValue = {};

      function getLabel() {
        return key.replace("_", " ");
      }

      function getTruncatedValue() {
        return JSON.stringify($json[key]).replace(/[{}"]/g, "");
      }

      function handleChange(key) {
        set_store_value(openField, $openField = key);
      }

      function handleSelect(_key) {
        set_store_value(json, $json[key][_key] = selectedValue[_key], $json);
      }

    	const writable_props = ['key', 'open', 'selectors'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<EditableObjectList> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => handleChange(key);

    	const click_handler_1 = () => (set_store_value(openField, $openField = null));

    	function select_change_handler({ _key }) {
    		selectedValue[_key] = select_value(this);
    		$$invalidate('selectedValue', selectedValue);
    		$$invalidate('key', key);
    		$$invalidate('selectors', selectors);
    	}

    	const change_handler = ({ _key }) => handleSelect(_key);

    	function input_input_handler({ _key }) {
    		json.update($$value => ($$value[key][_key] = this.value, $$value));
    		$$invalidate('key', key);
    		$$invalidate('selectors', selectors);
    	}

    	const click_handler_2 = () => (set_store_value(openField, $openField = null));

    	$$self.$set = $$props => {
    		if ('key' in $$props) $$invalidate('key', key = $$props.key);
    		if ('open' in $$props) $$invalidate('open', open = $$props.open);
    		if ('selectors' in $$props) $$invalidate('selectors', selectors = $$props.selectors);
    	};

    	$$self.$capture_state = () => {
    		return { key, open, selectors, selectedValue, $openField, $json };
    	};

    	$$self.$inject_state = $$props => {
    		if ('key' in $$props) $$invalidate('key', key = $$props.key);
    		if ('open' in $$props) $$invalidate('open', open = $$props.open);
    		if ('selectors' in $$props) $$invalidate('selectors', selectors = $$props.selectors);
    		if ('selectedValue' in $$props) $$invalidate('selectedValue', selectedValue = $$props.selectedValue);
    		if ('$openField' in $$props) openField.set($openField);
    		if ('$json' in $$props) json.set($json);
    	};

    	$$self.$$.update = ($$dirty = { $openField: 1, key: 1 }) => {
    		if ($$dirty.$openField || $$dirty.key) { $$invalidate('open', open = $openField === key); }
    	};

    	return {
    		key,
    		open,
    		selectors,
    		selectedValue,
    		getLabel,
    		getTruncatedValue,
    		handleChange,
    		handleSelect,
    		$openField,
    		$json,
    		click_handler,
    		click_handler_1,
    		select_change_handler,
    		change_handler,
    		input_input_handler,
    		click_handler_2
    	};
    }

    class EditableObjectList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, ["key", "open", "selectors"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "EditableObjectList", options, id: create_fragment$5.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.key === undefined && !('key' in props)) {
    			console.warn("<EditableObjectList> was created without expected prop 'key'");
    		}
    		if (ctx.selectors === undefined && !('selectors' in props)) {
    			console.warn("<EditableObjectList> was created without expected prop 'selectors'");
    		}
    	}

    	get key() {
    		throw new Error("<EditableObjectList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<EditableObjectList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<EditableObjectList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<EditableObjectList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectors() {
    		throw new Error("<EditableObjectList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectors(value) {
    		throw new Error("<EditableObjectList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/JsonEditor.svelte generated by Svelte v3.12.1 */

    const file$6 = "src/JsonEditor.svelte";

    // (41:0) {#if $json.scientific_name}
    function create_if_block$5(ctx) {
    	var div, t0, t1, t2, t3, t4, t5, t6, t7, t8, current;

    	var editabletextline0 = new EditableTextLine({
    		props: { key: "scientific_name" },
    		$$inline: true
    	});

    	var editabletextlist0 = new EditableTextList({
    		props: { key: "local_names" },
    		$$inline: true
    	});

    	var editabletextarea0 = new EditableTextArea({
    		props: { key: "description" },
    		$$inline: true
    	});

    	var editabletextarea1 = new EditableTextArea({
    		props: { key: "behaviour" },
    		$$inline: true
    	});

    	var editabletextarea2 = new EditableTextArea({
    		props: { key: "distribution" },
    		$$inline: true
    	});

    	var editabletextarea3 = new EditableTextArea({
    		props: { key: "habitat" },
    		$$inline: true
    	});

    	var editableobjectlist0 = new EditableObjectList({
    		props: { key: "size", selectors: null },
    		$$inline: true
    	});

    	var editabletextlist1 = new EditableTextList({
    		props: { key: "similar_species" },
    		$$inline: true
    	});

    	var editabletextline1 = new EditableTextLine({
    		props: { key: "flight_period" },
    		$$inline: true
    	});

    	var editableobjectlist1 = new EditableObjectList({
    		props: {
    		key: "red_list",
    		selectors: ctx.redListSelectors
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			div = element("div");
    			editabletextline0.$$.fragment.c();
    			t0 = space();
    			editabletextlist0.$$.fragment.c();
    			t1 = space();
    			editabletextarea0.$$.fragment.c();
    			t2 = space();
    			editabletextarea1.$$.fragment.c();
    			t3 = space();
    			editabletextarea2.$$.fragment.c();
    			t4 = space();
    			editabletextarea3.$$.fragment.c();
    			t5 = space();
    			editableobjectlist0.$$.fragment.c();
    			t6 = space();
    			editabletextlist1.$$.fragment.c();
    			t7 = space();
    			editabletextline1.$$.fragment.c();
    			t8 = space();
    			editableobjectlist1.$$.fragment.c();
    			attr_dev(div, "class", "editors svelte-1s0lx9d");
    			add_location(div, file$6, 41, 2, 1117);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(editabletextline0, div, null);
    			append_dev(div, t0);
    			mount_component(editabletextlist0, div, null);
    			append_dev(div, t1);
    			mount_component(editabletextarea0, div, null);
    			append_dev(div, t2);
    			mount_component(editabletextarea1, div, null);
    			append_dev(div, t3);
    			mount_component(editabletextarea2, div, null);
    			append_dev(div, t4);
    			mount_component(editabletextarea3, div, null);
    			append_dev(div, t5);
    			mount_component(editableobjectlist0, div, null);
    			append_dev(div, t6);
    			mount_component(editabletextlist1, div, null);
    			append_dev(div, t7);
    			mount_component(editabletextline1, div, null);
    			append_dev(div, t8);
    			mount_component(editableobjectlist1, div, null);
    			current = true;
    		},

    		p: noop,

    		i: function intro(local) {
    			if (current) return;
    			transition_in(editabletextline0.$$.fragment, local);

    			transition_in(editabletextlist0.$$.fragment, local);

    			transition_in(editabletextarea0.$$.fragment, local);

    			transition_in(editabletextarea1.$$.fragment, local);

    			transition_in(editabletextarea2.$$.fragment, local);

    			transition_in(editabletextarea3.$$.fragment, local);

    			transition_in(editableobjectlist0.$$.fragment, local);

    			transition_in(editabletextlist1.$$.fragment, local);

    			transition_in(editabletextline1.$$.fragment, local);

    			transition_in(editableobjectlist1.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(editabletextline0.$$.fragment, local);
    			transition_out(editabletextlist0.$$.fragment, local);
    			transition_out(editabletextarea0.$$.fragment, local);
    			transition_out(editabletextarea1.$$.fragment, local);
    			transition_out(editabletextarea2.$$.fragment, local);
    			transition_out(editabletextarea3.$$.fragment, local);
    			transition_out(editableobjectlist0.$$.fragment, local);
    			transition_out(editabletextlist1.$$.fragment, local);
    			transition_out(editabletextline1.$$.fragment, local);
    			transition_out(editableobjectlist1.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			destroy_component(editabletextline0);

    			destroy_component(editabletextlist0);

    			destroy_component(editabletextarea0);

    			destroy_component(editabletextarea1);

    			destroy_component(editabletextarea2);

    			destroy_component(editabletextarea3);

    			destroy_component(editableobjectlist0);

    			destroy_component(editabletextlist1);

    			destroy_component(editabletextline1);

    			destroy_component(editableobjectlist1);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$5.name, type: "if", source: "(41:0) {#if $json.scientific_name}", ctx });
    	return block;
    }

    function create_fragment$6(ctx) {
    	var if_block_anchor, current;

    	var if_block = (ctx.$json.scientific_name) && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (ctx.$json.scientific_name) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();
    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});
    				check_outros();
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);

    			if (detaching) {
    				detach_dev(if_block_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$6.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $json;

    	validate_store(json, 'json');
    	component_subscribe($$self, json, $$value => { $json = $$value; $$invalidate('$json', $json); });

    	

      const redListOptions = [
        "Not evaluated",
        "Data deficient",
        "Least Concern",
        "Near threatened",
        "Vulnerable",
        "Endangered",
        "Critically endangered",
        "Extinct in the wild",
        "Extinct"
      ];

      const trendOptions = ["Increasing", "Stable", "Decreasing"];

      const booleanOptions = ["Yes", "No"];

      const redListSelectors = {
        habitats_directive: ["No", "IV"],
        red_list_EU27: redListOptions,
        red_list_europe: redListOptions,
        red_list_mediterranean: redListOptions,
        EU27_endemic: booleanOptions,
        red_list_europe_endemic: booleanOptions,
        trend_europe: trendOptions
      };

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('$json' in $$props) json.set($json);
    	};

    	return { redListSelectors, $json };
    }

    class JsonEditor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "JsonEditor", options, id: create_fragment$6.name });
    	}
    }

    /* src/Exporter.svelte generated by Svelte v3.12.1 */

    const file$7 = "src/Exporter.svelte";

    // (25:0) {#if $json.items_id}
    function create_if_block$6(ctx) {
    	var button, dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Get JSON";
    			attr_dev(button, "class", "button-success");
    			add_location(button, file$7, 25, 2, 603);
    			dispose = listen_dev(button, "click", ctx.handleClick);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(button);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$6.name, type: "if", source: "(25:0) {#if $json.items_id}", ctx });
    	return block;
    }

    function create_fragment$7(ctx) {
    	var if_block_anchor;

    	var if_block = (ctx.$json.items_id) && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (ctx.$json.items_id) {
    				if (!if_block) {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);

    			if (detaching) {
    				detach_dev(if_block_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$7.name, type: "component", source: "", ctx });
    	return block;
    }

    function updateClipboard(newClip) {
      navigator.clipboard.writeText(newClip).then(
        function() {
          alert("JSON was copied to your clipboard");
        },
        function() {
          alert("FAILED");
        }
      );
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $json;

    	validate_store(json, 'json');
    	component_subscribe($$self, json, $$value => { $json = $$value; $$invalidate('$json', $json); });

    	

      const handleClick = function() {
        navigator.permissions.query({ name: "clipboard-write" }).then(result => {
          if (result.state == "granted" || result.state == "prompt") {
            /* write to the clipboard now */
            updateClipboard(JSON.stringify($json));
          }
        });
      };

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('$json' in $$props) json.set($json);
    	};

    	return { handleClick, $json };
    }

    class Exporter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Exporter", options, id: create_fragment$7.name });
    	}
    }

    /* src/Save.svelte generated by Svelte v3.12.1 */

    const file$8 = "src/Save.svelte";

    // (10:0) {#if $json.items_id}
    function create_if_block$7(ctx) {
    	var button, dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Save";
    			add_location(button, file$8, 10, 2, 236);
    			dispose = listen_dev(button, "click", ctx.handleSave);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(button);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$7.name, type: "if", source: "(10:0) {#if $json.items_id}", ctx });
    	return block;
    }

    function create_fragment$8(ctx) {
    	var if_block_anchor;

    	var if_block = (ctx.$json.items_id) && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (ctx.$json.items_id) {
    				if (!if_block) {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);

    			if (detaching) {
    				detach_dev(if_block_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$8.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $json;

    	validate_store(json, 'json');
    	component_subscribe($$self, json, $$value => { $json = $$value; $$invalidate('$json', $json); });

    	function handleSave() {
          window.localStorage.setItem($json.items_id, JSON.stringify($json));
          savedSpecie.set($json.items_id);
      }

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('$json' in $$props) json.set($json);
    	};

    	return { handleSave, $json };
    }

    class Save extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Save", options, id: create_fragment$8.name });
    	}
    }

    /* src/Recover.svelte generated by Svelte v3.12.1 */

    const file$9 = "src/Recover.svelte";

    // (15:0) {#if item}
    function create_if_block$8(ctx) {
    	var button, dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Recover";
    			add_location(button, file$9, 15, 2, 351);
    			dispose = listen_dev(button, "click", ctx.handleRecover);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(button);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$8.name, type: "if", source: "(15:0) {#if item}", ctx });
    	return block;
    }

    function create_fragment$9(ctx) {
    	var if_block_anchor;

    	var if_block = (ctx.item) && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (ctx.item) {
    				if (!if_block) {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);

    			if (detaching) {
    				detach_dev(if_block_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$9.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $json, $savedSpecie;

    	validate_store(json, 'json');
    	component_subscribe($$self, json, $$value => { $json = $$value; $$invalidate('$json', $json); });
    	validate_store(savedSpecie, 'savedSpecie');
    	component_subscribe($$self, savedSpecie, $$value => { $savedSpecie = $$value; $$invalidate('$savedSpecie', $savedSpecie); });

    	let item = null;

      function handleRecover() {
        const item = window.localStorage.getItem($json.items_id);
        json.set(JSON.parse(item));
      }

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate('item', item = $$props.item);
    		if ('$json' in $$props) json.set($json);
    		if ('$savedSpecie' in $$props) savedSpecie.set($savedSpecie);
    	};

    	$$self.$$.update = ($$dirty = { $json: 1, $savedSpecie: 1 }) => {
    		if ($$dirty.$json || $$dirty.$savedSpecie) { if ($json.items_id || $savedSpecie === $json.items) {
            $$invalidate('item', item = window.localStorage.getItem($json.items_id));
          } }
    	};

    	return { item, handleRecover };
    }

    class Recover extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Recover", options, id: create_fragment$9.name });
    	}
    }

    /* src/Reset.svelte generated by Svelte v3.12.1 */

    const file$a = "src/Reset.svelte";

    // (22:0) {#if item}
    function create_if_block$9(ctx) {
    	var button, dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Reset";
    			add_location(button, file$a, 22, 2, 528);
    			dispose = listen_dev(button, "click", ctx.handleReset);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(button);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$9.name, type: "if", source: "(22:0) {#if item}", ctx });
    	return block;
    }

    function create_fragment$a(ctx) {
    	var if_block_anchor;

    	var if_block = (ctx.item) && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (ctx.item) {
    				if (!if_block) {
    					if_block = create_if_block$9(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);

    			if (detaching) {
    				detach_dev(if_block_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$a.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $json, $savedSpecie;

    	validate_store(json, 'json');
    	component_subscribe($$self, json, $$value => { $json = $$value; $$invalidate('$json', $json); });
    	validate_store(savedSpecie, 'savedSpecie');
    	component_subscribe($$self, savedSpecie, $$value => { $savedSpecie = $$value; $$invalidate('$savedSpecie', $savedSpecie); });

    	

      let { selectedFamily = "", selectedSpecie = "" } = $$props;

      let item = null;

      function handleReset() {
        window.localStorage.removeItem($json.items_id);

        getJson({ family: selectedFamily, species: selectedSpecie }).then(data =>
          json.set(data)
        );
      }

    	const writable_props = ['selectedFamily', 'selectedSpecie'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Reset> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('selectedFamily' in $$props) $$invalidate('selectedFamily', selectedFamily = $$props.selectedFamily);
    		if ('selectedSpecie' in $$props) $$invalidate('selectedSpecie', selectedSpecie = $$props.selectedSpecie);
    	};

    	$$self.$capture_state = () => {
    		return { selectedFamily, selectedSpecie, item, $json, $savedSpecie };
    	};

    	$$self.$inject_state = $$props => {
    		if ('selectedFamily' in $$props) $$invalidate('selectedFamily', selectedFamily = $$props.selectedFamily);
    		if ('selectedSpecie' in $$props) $$invalidate('selectedSpecie', selectedSpecie = $$props.selectedSpecie);
    		if ('item' in $$props) $$invalidate('item', item = $$props.item);
    		if ('$json' in $$props) json.set($json);
    		if ('$savedSpecie' in $$props) savedSpecie.set($savedSpecie);
    	};

    	$$self.$$.update = ($$dirty = { $json: 1, $savedSpecie: 1 }) => {
    		if ($$dirty.$json || $$dirty.$savedSpecie) { if ($json.items_id || $savedSpecie === $json.items) {
            $$invalidate('item', item = window.localStorage.getItem($json.items_id));
          } }
    	};

    	return {
    		selectedFamily,
    		selectedSpecie,
    		item,
    		handleReset
    	};
    }

    class Reset extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, ["selectedFamily", "selectedSpecie"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Reset", options, id: create_fragment$a.name });
    	}

    	get selectedFamily() {
    		throw new Error("<Reset>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedFamily(value) {
    		throw new Error("<Reset>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedSpecie() {
    		throw new Error("<Reset>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedSpecie(value) {
    		throw new Error("<Reset>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.12.1 */

    const file$b = "src/App.svelte";

    // (84:8) {#if $json.scientific_name}
    function create_if_block$a(ctx) {
    	var h2, t_value = ctx.$json.scientific_name + "", t;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t = text(t_value);
    			attr_dev(h2, "class", "h4 svelte-tgntz1");
    			add_location(h2, file$b, 84, 10, 2039);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.$json) && t_value !== (t_value = ctx.$json.scientific_name + "")) {
    				set_data_dev(t, t_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(h2);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$a.name, type: "if", source: "(84:8) {#if $json.scientific_name}", ctx });
    	return block;
    }

    function create_fragment$b(ctx) {
    	var main, section0, h1, t1, div2, div0, t2, t3, div1, t4, section1, div5, div4, t5, div3, t6, t7, t8, current;

    	var familyselector = new FamilySelector({ $$inline: true });

    	var specieselector = new SpecieSelector({
    		props: {
    		selectedFamily: ctx.selectedFamily,
    		selectedSpecie: ctx.selectedSpecie
    	},
    		$$inline: true
    	});

    	var if_block = (ctx.$json.scientific_name) && create_if_block$a(ctx);

    	var jsoneditor = new JsonEditor({ $$inline: true });

    	var exporter = new Exporter({ $$inline: true });

    	var save = new Save({ $$inline: true });

    	var recover = new Recover({ $$inline: true });

    	var reset = new Reset({
    		props: {
    		selectedFamily: ctx.selectedFamily,
    		selectedSpecie: ctx.selectedSpecie
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			main = element("main");
    			section0 = element("section");
    			h1 = element("h1");
    			h1.textContent = "Dragonfly API JSON Editor";
    			t1 = space();
    			div2 = element("div");
    			div0 = element("div");
    			familyselector.$$.fragment.c();
    			t2 = space();
    			specieselector.$$.fragment.c();
    			t3 = space();
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t4 = space();
    			section1 = element("section");
    			div5 = element("div");
    			div4 = element("div");
    			jsoneditor.$$.fragment.c();
    			t5 = space();
    			div3 = element("div");
    			exporter.$$.fragment.c();
    			t6 = space();
    			save.$$.fragment.c();
    			t7 = space();
    			recover.$$.fragment.c();
    			t8 = space();
    			reset.$$.fragment.c();
    			attr_dev(h1, "class", "h4 svelte-tgntz1");
    			add_location(h1, file$b, 75, 4, 1760);
    			attr_dev(div0, "class", "col-sm-4");
    			add_location(div0, file$b, 78, 6, 1840);
    			attr_dev(div1, "class", "col-sm-8");
    			add_location(div1, file$b, 82, 6, 1970);
    			attr_dev(div2, "class", "row hero svelte-tgntz1");
    			add_location(div2, file$b, 77, 4, 1811);
    			attr_dev(section0, "class", "container svelte-tgntz1");
    			add_location(section0, file$b, 74, 2, 1728);
    			add_location(div3, file$b, 94, 8, 2248);
    			attr_dev(div4, "class", "col-sm-12");
    			add_location(div4, file$b, 91, 6, 2192);
    			attr_dev(div5, "class", "row");
    			add_location(div5, file$b, 90, 4, 2168);
    			attr_dev(section1, "class", "container svelte-tgntz1");
    			add_location(section1, file$b, 89, 2, 2136);
    			add_location(main, file$b, 73, 0, 1719);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, section0);
    			append_dev(section0, h1);
    			append_dev(section0, t1);
    			append_dev(section0, div2);
    			append_dev(div2, div0);
    			mount_component(familyselector, div0, null);
    			append_dev(div0, t2);
    			mount_component(specieselector, div0, null);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			if (if_block) if_block.m(div1, null);
    			append_dev(main, t4);
    			append_dev(main, section1);
    			append_dev(section1, div5);
    			append_dev(div5, div4);
    			mount_component(jsoneditor, div4, null);
    			append_dev(div4, t5);
    			append_dev(div4, div3);
    			mount_component(exporter, div3, null);
    			append_dev(div3, t6);
    			mount_component(save, div3, null);
    			append_dev(div3, t7);
    			mount_component(recover, div3, null);
    			append_dev(div3, t8);
    			mount_component(reset, div3, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var specieselector_changes = {};
    			if (changed.selectedFamily) specieselector_changes.selectedFamily = ctx.selectedFamily;
    			if (changed.selectedSpecie) specieselector_changes.selectedSpecie = ctx.selectedSpecie;
    			specieselector.$set(specieselector_changes);

    			if (ctx.$json.scientific_name) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    				} else {
    					if_block = create_if_block$a(ctx);
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			var reset_changes = {};
    			if (changed.selectedFamily) reset_changes.selectedFamily = ctx.selectedFamily;
    			if (changed.selectedSpecie) reset_changes.selectedSpecie = ctx.selectedSpecie;
    			reset.$set(reset_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(familyselector.$$.fragment, local);

    			transition_in(specieselector.$$.fragment, local);

    			transition_in(jsoneditor.$$.fragment, local);

    			transition_in(exporter.$$.fragment, local);

    			transition_in(save.$$.fragment, local);

    			transition_in(recover.$$.fragment, local);

    			transition_in(reset.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(familyselector.$$.fragment, local);
    			transition_out(specieselector.$$.fragment, local);
    			transition_out(jsoneditor.$$.fragment, local);
    			transition_out(exporter.$$.fragment, local);
    			transition_out(save.$$.fragment, local);
    			transition_out(recover.$$.fragment, local);
    			transition_out(reset.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(main);
    			}

    			destroy_component(familyselector);

    			destroy_component(specieselector);

    			if (if_block) if_block.d();

    			destroy_component(jsoneditor);

    			destroy_component(exporter);

    			destroy_component(save);

    			destroy_component(recover);

    			destroy_component(reset);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$b.name, type: "component", source: "", ctx });
    	return block;
    }

    let scientific_name$1 = "";

    function instance$b($$self, $$props, $$invalidate) {
    	let $json;

    	validate_store(json, 'json');
    	component_subscribe($$self, json, $$value => { $json = $$value; $$invalidate('$json', $json); });

    	

      let selectedFamily = "";
      let selectedSpecie = "";

      setContext("family", {
        setFamily: value => {
          $$invalidate('selectedFamily', selectedFamily = value);
          $$invalidate('selectedSpecie', selectedSpecie = "");
          json.set({});
        }
      });
      setContext("specie", {
        setSpecie: value => {
          $$invalidate('selectedSpecie', selectedSpecie = value);
          json.set({});
        }
      });

      onMount(() => {
        const S_KEY_CODE = 83;
        document.addEventListener(
          "keydown",
          function(e) {
            if (
              (window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) &&
              e.keyCode == S_KEY_CODE
            ) {
              e.preventDefault();
              if ($json.items_id) {
                window.localStorage.setItem($json.items_id, JSON.stringify($json));
                savedSpecie.set($json.items_id);
              }
            }
          },
          false
        );
      });

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('selectedFamily' in $$props) $$invalidate('selectedFamily', selectedFamily = $$props.selectedFamily);
    		if ('selectedSpecie' in $$props) $$invalidate('selectedSpecie', selectedSpecie = $$props.selectedSpecie);
    		if ('scientific_name' in $$props) scientific_name$1 = $$props.scientific_name;
    		if ('$json' in $$props) json.set($json);
    	};

    	$$self.$$.update = ($$dirty = { selectedFamily: 1, selectedSpecie: 1 }) => {
    		if ($$dirty.selectedFamily || $$dirty.selectedSpecie) { {
            if (selectedFamily && selectedSpecie) {
              getJson({ family: selectedFamily, species: selectedSpecie }).then(data =>
                json.set(data)
              );
            }
          } }
    	};

    	return { selectedFamily, selectedSpecie, $json };
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "App", options, id: create_fragment$b.name });
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
