
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
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
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
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
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.wholeText !== data)
            text.data = data;
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
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
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
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

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                info.blocks[i] = null;
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
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
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
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
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
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
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    /* src/Tailwind.svelte generated by Svelte v3.31.0 */

    class Tailwind extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, null, safe_not_equal, {});
    	}
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
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
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);

    let idbProxyableTypes;
    let cursorAdvanceMethods;
    // This is a function to prevent it throwing up in node environments.
    function getIdbProxyableTypes() {
        return (idbProxyableTypes ||
            (idbProxyableTypes = [
                IDBDatabase,
                IDBObjectStore,
                IDBIndex,
                IDBCursor,
                IDBTransaction,
            ]));
    }
    // This is a function to prevent it throwing up in node environments.
    function getCursorAdvanceMethods() {
        return (cursorAdvanceMethods ||
            (cursorAdvanceMethods = [
                IDBCursor.prototype.advance,
                IDBCursor.prototype.continue,
                IDBCursor.prototype.continuePrimaryKey,
            ]));
    }
    const cursorRequestMap = new WeakMap();
    const transactionDoneMap = new WeakMap();
    const transactionStoreNamesMap = new WeakMap();
    const transformCache = new WeakMap();
    const reverseTransformCache = new WeakMap();
    function promisifyRequest(request) {
        const promise = new Promise((resolve, reject) => {
            const unlisten = () => {
                request.removeEventListener('success', success);
                request.removeEventListener('error', error);
            };
            const success = () => {
                resolve(wrap(request.result));
                unlisten();
            };
            const error = () => {
                reject(request.error);
                unlisten();
            };
            request.addEventListener('success', success);
            request.addEventListener('error', error);
        });
        promise
            .then((value) => {
            // Since cursoring reuses the IDBRequest (*sigh*), we cache it for later retrieval
            // (see wrapFunction).
            if (value instanceof IDBCursor) {
                cursorRequestMap.set(value, request);
            }
            // Catching to avoid "Uncaught Promise exceptions"
        })
            .catch(() => { });
        // This mapping exists in reverseTransformCache but doesn't doesn't exist in transformCache. This
        // is because we create many promises from a single IDBRequest.
        reverseTransformCache.set(promise, request);
        return promise;
    }
    function cacheDonePromiseForTransaction(tx) {
        // Early bail if we've already created a done promise for this transaction.
        if (transactionDoneMap.has(tx))
            return;
        const done = new Promise((resolve, reject) => {
            const unlisten = () => {
                tx.removeEventListener('complete', complete);
                tx.removeEventListener('error', error);
                tx.removeEventListener('abort', error);
            };
            const complete = () => {
                resolve();
                unlisten();
            };
            const error = () => {
                reject(tx.error || new DOMException('AbortError', 'AbortError'));
                unlisten();
            };
            tx.addEventListener('complete', complete);
            tx.addEventListener('error', error);
            tx.addEventListener('abort', error);
        });
        // Cache it for later retrieval.
        transactionDoneMap.set(tx, done);
    }
    let idbProxyTraps = {
        get(target, prop, receiver) {
            if (target instanceof IDBTransaction) {
                // Special handling for transaction.done.
                if (prop === 'done')
                    return transactionDoneMap.get(target);
                // Polyfill for objectStoreNames because of Edge.
                if (prop === 'objectStoreNames') {
                    return target.objectStoreNames || transactionStoreNamesMap.get(target);
                }
                // Make tx.store return the only store in the transaction, or undefined if there are many.
                if (prop === 'store') {
                    return receiver.objectStoreNames[1]
                        ? undefined
                        : receiver.objectStore(receiver.objectStoreNames[0]);
                }
            }
            // Else transform whatever we get back.
            return wrap(target[prop]);
        },
        set(target, prop, value) {
            target[prop] = value;
            return true;
        },
        has(target, prop) {
            if (target instanceof IDBTransaction &&
                (prop === 'done' || prop === 'store')) {
                return true;
            }
            return prop in target;
        },
    };
    function replaceTraps(callback) {
        idbProxyTraps = callback(idbProxyTraps);
    }
    function wrapFunction(func) {
        // Due to expected object equality (which is enforced by the caching in `wrap`), we
        // only create one new func per func.
        // Edge doesn't support objectStoreNames (booo), so we polyfill it here.
        if (func === IDBDatabase.prototype.transaction &&
            !('objectStoreNames' in IDBTransaction.prototype)) {
            return function (storeNames, ...args) {
                const tx = func.call(unwrap(this), storeNames, ...args);
                transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
                return wrap(tx);
            };
        }
        // Cursor methods are special, as the behaviour is a little more different to standard IDB. In
        // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the
        // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense
        // with real promises, so each advance methods returns a new promise for the cursor object, or
        // undefined if the end of the cursor has been reached.
        if (getCursorAdvanceMethods().includes(func)) {
            return function (...args) {
                // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
                // the original object.
                func.apply(unwrap(this), args);
                return wrap(cursorRequestMap.get(this));
            };
        }
        return function (...args) {
            // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
            // the original object.
            return wrap(func.apply(unwrap(this), args));
        };
    }
    function transformCachableValue(value) {
        if (typeof value === 'function')
            return wrapFunction(value);
        // This doesn't return, it just creates a 'done' promise for the transaction,
        // which is later returned for transaction.done (see idbObjectHandler).
        if (value instanceof IDBTransaction)
            cacheDonePromiseForTransaction(value);
        if (instanceOfAny(value, getIdbProxyableTypes()))
            return new Proxy(value, idbProxyTraps);
        // Return the same value back if we're not going to transform it.
        return value;
    }
    function wrap(value) {
        // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because
        // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.
        if (value instanceof IDBRequest)
            return promisifyRequest(value);
        // If we've already transformed this value before, reuse the transformed value.
        // This is faster, but it also provides object equality.
        if (transformCache.has(value))
            return transformCache.get(value);
        const newValue = transformCachableValue(value);
        // Not all types are transformed.
        // These may be primitive types, so they can't be WeakMap keys.
        if (newValue !== value) {
            transformCache.set(value, newValue);
            reverseTransformCache.set(newValue, value);
        }
        return newValue;
    }
    const unwrap = (value) => reverseTransformCache.get(value);

    /**
     * Open a database.
     *
     * @param name Name of the database.
     * @param version Schema version.
     * @param callbacks Additional callbacks.
     */
    function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
        const request = indexedDB.open(name, version);
        const openPromise = wrap(request);
        if (upgrade) {
            request.addEventListener('upgradeneeded', (event) => {
                upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction));
            });
        }
        if (blocked)
            request.addEventListener('blocked', () => blocked());
        openPromise
            .then((db) => {
            if (terminated)
                db.addEventListener('close', () => terminated());
            if (blocking)
                db.addEventListener('versionchange', () => blocking());
        })
            .catch(() => { });
        return openPromise;
    }

    const readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];
    const writeMethods = ['put', 'add', 'delete', 'clear'];
    const cachedMethods = new Map();
    function getMethod(target, prop) {
        if (!(target instanceof IDBDatabase &&
            !(prop in target) &&
            typeof prop === 'string')) {
            return;
        }
        if (cachedMethods.get(prop))
            return cachedMethods.get(prop);
        const targetFuncName = prop.replace(/FromIndex$/, '');
        const useIndex = prop !== targetFuncName;
        const isWrite = writeMethods.includes(targetFuncName);
        if (
        // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
        !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) ||
            !(isWrite || readMethods.includes(targetFuncName))) {
            return;
        }
        const method = async function (storeName, ...args) {
            // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(
            const tx = this.transaction(storeName, isWrite ? 'readwrite' : 'readonly');
            let target = tx.store;
            if (useIndex)
                target = target.index(args.shift());
            const returnVal = await target[targetFuncName](...args);
            if (isWrite)
                await tx.done;
            return returnVal;
        };
        cachedMethods.set(prop, method);
        return method;
    }
    replaceTraps((oldTraps) => ({
        ...oldTraps,
        get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
        has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop),
    }));

    /*! MIT License © Sindre Sorhus */

    const globals = {};

    const getGlobal = property => {
    	/* istanbul ignore next */
    	if (typeof self !== 'undefined' && self && property in self) {
    		return self;
    	}

    	/* istanbul ignore next */
    	if (typeof window !== 'undefined' && window && property in window) {
    		return window;
    	}

    	if (typeof global !== 'undefined' && global && property in global) {
    		return global;
    	}

    	/* istanbul ignore next */
    	if (typeof globalThis !== 'undefined' && globalThis) {
    		return globalThis;
    	}
    };

    const globalProperties = [
    	'Headers',
    	'Request',
    	'Response',
    	'ReadableStream',
    	'fetch',
    	'AbortController',
    	'FormData'
    ];

    for (const property of globalProperties) {
    	Object.defineProperty(globals, property, {
    		get() {
    			const globalObject = getGlobal(property);
    			const value = globalObject && globalObject[property];
    			return typeof value === 'function' ? value.bind(globalObject) : value;
    		}
    	});
    }

    const isObject = value => value !== null && typeof value === 'object';
    const supportsAbortController = typeof globals.AbortController === 'function';
    const supportsStreams = typeof globals.ReadableStream === 'function';
    const supportsFormData = typeof globals.FormData === 'function';

    const mergeHeaders = (source1, source2) => {
    	const result = new globals.Headers(source1 || {});
    	const isHeadersInstance = source2 instanceof globals.Headers;
    	const source = new globals.Headers(source2 || {});

    	for (const [key, value] of source) {
    		if ((isHeadersInstance && value === 'undefined') || value === undefined) {
    			result.delete(key);
    		} else {
    			result.set(key, value);
    		}
    	}

    	return result;
    };

    const deepMerge = (...sources) => {
    	let returnValue = {};
    	let headers = {};

    	for (const source of sources) {
    		if (Array.isArray(source)) {
    			if (!(Array.isArray(returnValue))) {
    				returnValue = [];
    			}

    			returnValue = [...returnValue, ...source];
    		} else if (isObject(source)) {
    			for (let [key, value] of Object.entries(source)) {
    				if (isObject(value) && (key in returnValue)) {
    					value = deepMerge(returnValue[key], value);
    				}

    				returnValue = {...returnValue, [key]: value};
    			}

    			if (isObject(source.headers)) {
    				headers = mergeHeaders(headers, source.headers);
    			}
    		}

    		returnValue.headers = headers;
    	}

    	return returnValue;
    };

    const requestMethods = [
    	'get',
    	'post',
    	'put',
    	'patch',
    	'head',
    	'delete'
    ];

    const responseTypes = {
    	json: 'application/json',
    	text: 'text/*',
    	formData: 'multipart/form-data',
    	arrayBuffer: '*/*',
    	blob: '*/*'
    };

    const retryMethods = [
    	'get',
    	'put',
    	'head',
    	'delete',
    	'options',
    	'trace'
    ];

    const retryStatusCodes = [
    	408,
    	413,
    	429,
    	500,
    	502,
    	503,
    	504
    ];

    const retryAfterStatusCodes = [
    	413,
    	429,
    	503
    ];

    const stop = Symbol('stop');

    class HTTPError extends Error {
    	constructor(response) {
    		// Set the message to the status text, such as Unauthorized,
    		// with some fallbacks. This message should never be undefined.
    		super(
    			response.statusText ||
    			String(
    				(response.status === 0 || response.status) ?
    					response.status : 'Unknown response error'
    			)
    		);
    		this.name = 'HTTPError';
    		this.response = response;
    	}
    }

    class TimeoutError extends Error {
    	constructor(request) {
    		super('Request timed out');
    		this.name = 'TimeoutError';
    		this.request = request;
    	}
    }

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    // `Promise.race()` workaround (#91)
    const timeout = (request, abortController, options) =>
    	new Promise((resolve, reject) => {
    		const timeoutID = setTimeout(() => {
    			if (abortController) {
    				abortController.abort();
    			}

    			reject(new TimeoutError(request));
    		}, options.timeout);

    		/* eslint-disable promise/prefer-await-to-then */
    		options.fetch(request)
    			.then(resolve)
    			.catch(reject)
    			.then(() => {
    				clearTimeout(timeoutID);
    			});
    		/* eslint-enable promise/prefer-await-to-then */
    	});

    const normalizeRequestMethod = input => requestMethods.includes(input) ? input.toUpperCase() : input;

    const defaultRetryOptions = {
    	limit: 2,
    	methods: retryMethods,
    	statusCodes: retryStatusCodes,
    	afterStatusCodes: retryAfterStatusCodes
    };

    const normalizeRetryOptions = (retry = {}) => {
    	if (typeof retry === 'number') {
    		return {
    			...defaultRetryOptions,
    			limit: retry
    		};
    	}

    	if (retry.methods && !Array.isArray(retry.methods)) {
    		throw new Error('retry.methods must be an array');
    	}

    	if (retry.statusCodes && !Array.isArray(retry.statusCodes)) {
    		throw new Error('retry.statusCodes must be an array');
    	}

    	return {
    		...defaultRetryOptions,
    		...retry,
    		afterStatusCodes: retryAfterStatusCodes
    	};
    };

    // The maximum value of a 32bit int (see issue #117)
    const maxSafeTimeout = 2147483647;

    class Ky {
    	constructor(input, options = {}) {
    		this._retryCount = 0;
    		this._input = input;
    		this._options = {
    			// TODO: credentials can be removed when the spec change is implemented in all browsers. Context: https://www.chromestatus.com/feature/4539473312350208
    			credentials: this._input.credentials || 'same-origin',
    			...options,
    			headers: mergeHeaders(this._input.headers, options.headers),
    			hooks: deepMerge({
    				beforeRequest: [],
    				beforeRetry: [],
    				afterResponse: []
    			}, options.hooks),
    			method: normalizeRequestMethod(options.method || this._input.method),
    			prefixUrl: String(options.prefixUrl || ''),
    			retry: normalizeRetryOptions(options.retry),
    			throwHttpErrors: options.throwHttpErrors !== false,
    			timeout: typeof options.timeout === 'undefined' ? 10000 : options.timeout,
    			fetch: options.fetch || globals.fetch
    		};

    		if (typeof this._input !== 'string' && !(this._input instanceof URL || this._input instanceof globals.Request)) {
    			throw new TypeError('`input` must be a string, URL, or Request');
    		}

    		if (this._options.prefixUrl && typeof this._input === 'string') {
    			if (this._input.startsWith('/')) {
    				throw new Error('`input` must not begin with a slash when using `prefixUrl`');
    			}

    			if (!this._options.prefixUrl.endsWith('/')) {
    				this._options.prefixUrl += '/';
    			}

    			this._input = this._options.prefixUrl + this._input;
    		}

    		if (supportsAbortController) {
    			this.abortController = new globals.AbortController();
    			if (this._options.signal) {
    				this._options.signal.addEventListener('abort', () => {
    					this.abortController.abort();
    				});
    			}

    			this._options.signal = this.abortController.signal;
    		}

    		this.request = new globals.Request(this._input, this._options);

    		if (this._options.searchParams) {
    			const searchParams = '?' + new URLSearchParams(this._options.searchParams).toString();
    			const url = this.request.url.replace(/(?:\?.*?)?(?=#|$)/, searchParams);

    			// To provide correct form boundary, Content-Type header should be deleted each time when new Request instantiated from another one
    			if (((supportsFormData && this._options.body instanceof globals.FormData) || this._options.body instanceof URLSearchParams) && !(this._options.headers && this._options.headers['content-type'])) {
    				this.request.headers.delete('content-type');
    			}

    			this.request = new globals.Request(new globals.Request(url, this.request), this._options);
    		}

    		if (this._options.json !== undefined) {
    			this._options.body = JSON.stringify(this._options.json);
    			this.request.headers.set('content-type', 'application/json');
    			this.request = new globals.Request(this.request, {body: this._options.body});
    		}

    		const fn = async () => {
    			if (this._options.timeout > maxSafeTimeout) {
    				throw new RangeError(`The \`timeout\` option cannot be greater than ${maxSafeTimeout}`);
    			}

    			await delay(1);
    			let response = await this._fetch();

    			for (const hook of this._options.hooks.afterResponse) {
    				// eslint-disable-next-line no-await-in-loop
    				const modifiedResponse = await hook(
    					this.request,
    					this._options,
    					this._decorateResponse(response.clone())
    				);

    				if (modifiedResponse instanceof globals.Response) {
    					response = modifiedResponse;
    				}
    			}

    			this._decorateResponse(response);

    			if (!response.ok && this._options.throwHttpErrors) {
    				throw new HTTPError(response);
    			}

    			// If `onDownloadProgress` is passed, it uses the stream API internally
    			/* istanbul ignore next */
    			if (this._options.onDownloadProgress) {
    				if (typeof this._options.onDownloadProgress !== 'function') {
    					throw new TypeError('The `onDownloadProgress` option must be a function');
    				}

    				if (!supportsStreams) {
    					throw new Error('Streams are not supported in your environment. `ReadableStream` is missing.');
    				}

    				return this._stream(response.clone(), this._options.onDownloadProgress);
    			}

    			return response;
    		};

    		const isRetriableMethod = this._options.retry.methods.includes(this.request.method.toLowerCase());
    		const result = isRetriableMethod ? this._retry(fn) : fn();

    		for (const [type, mimeType] of Object.entries(responseTypes)) {
    			result[type] = async () => {
    				this.request.headers.set('accept', this.request.headers.get('accept') || mimeType);

    				const response = (await result).clone();

    				if (type === 'json') {
    					if (response.status === 204) {
    						return '';
    					}

    					if (options.parseJson) {
    						return options.parseJson(await response.text());
    					}
    				}

    				return response[type]();
    			};
    		}

    		return result;
    	}

    	_calculateRetryDelay(error) {
    		this._retryCount++;

    		if (this._retryCount < this._options.retry.limit && !(error instanceof TimeoutError)) {
    			if (error instanceof HTTPError) {
    				if (!this._options.retry.statusCodes.includes(error.response.status)) {
    					return 0;
    				}

    				const retryAfter = error.response.headers.get('Retry-After');
    				if (retryAfter && this._options.retry.afterStatusCodes.includes(error.response.status)) {
    					let after = Number(retryAfter);
    					if (Number.isNaN(after)) {
    						after = Date.parse(retryAfter) - Date.now();
    					} else {
    						after *= 1000;
    					}

    					if (typeof this._options.retry.maxRetryAfter !== 'undefined' && after > this._options.retry.maxRetryAfter) {
    						return 0;
    					}

    					return after;
    				}

    				if (error.response.status === 413) {
    					return 0;
    				}
    			}

    			const BACKOFF_FACTOR = 0.3;
    			return BACKOFF_FACTOR * (2 ** (this._retryCount - 1)) * 1000;
    		}

    		return 0;
    	}

    	_decorateResponse(response) {
    		if (this._options.parseJson) {
    			response.json = async () => {
    				return this._options.parseJson(await response.text());
    			};
    		}

    		return response;
    	}

    	async _retry(fn) {
    		try {
    			return await fn();
    		} catch (error) {
    			const ms = Math.min(this._calculateRetryDelay(error), maxSafeTimeout);
    			if (ms !== 0 && this._retryCount > 0) {
    				await delay(ms);

    				for (const hook of this._options.hooks.beforeRetry) {
    					// eslint-disable-next-line no-await-in-loop
    					const hookResult = await hook({
    						request: this.request,
    						options: this._options,
    						error,
    						retryCount: this._retryCount
    					});

    					// If `stop` is returned from the hook, the retry process is stopped
    					if (hookResult === stop) {
    						return;
    					}
    				}

    				return this._retry(fn);
    			}

    			if (this._options.throwHttpErrors) {
    				throw error;
    			}
    		}
    	}

    	async _fetch() {
    		for (const hook of this._options.hooks.beforeRequest) {
    			// eslint-disable-next-line no-await-in-loop
    			const result = await hook(this.request, this._options);

    			if (result instanceof Request) {
    				this.request = result;
    				break;
    			}

    			if (result instanceof Response) {
    				return result;
    			}
    		}

    		if (this._options.timeout === false) {
    			return this._options.fetch(this.request.clone());
    		}

    		return timeout(this.request.clone(), this.abortController, this._options);
    	}

    	/* istanbul ignore next */
    	_stream(response, onDownloadProgress) {
    		const totalBytes = Number(response.headers.get('content-length')) || 0;
    		let transferredBytes = 0;

    		return new globals.Response(
    			new globals.ReadableStream({
    				start(controller) {
    					const reader = response.body.getReader();

    					if (onDownloadProgress) {
    						onDownloadProgress({percent: 0, transferredBytes: 0, totalBytes}, new Uint8Array());
    					}

    					async function read() {
    						const {done, value} = await reader.read();
    						if (done) {
    							controller.close();
    							return;
    						}

    						if (onDownloadProgress) {
    							transferredBytes += value.byteLength;
    							const percent = totalBytes === 0 ? 0 : transferredBytes / totalBytes;
    							onDownloadProgress({percent, transferredBytes, totalBytes}, value);
    						}

    						controller.enqueue(value);
    						read();
    					}

    					read();
    				}
    			})
    		);
    	}
    }

    const validateAndMerge = (...sources) => {
    	for (const source of sources) {
    		if ((!isObject(source) || Array.isArray(source)) && typeof source !== 'undefined') {
    			throw new TypeError('The `options` argument must be an object');
    		}
    	}

    	return deepMerge({}, ...sources);
    };

    const createInstance = defaults => {
    	const ky = (input, options) => new Ky(input, validateAndMerge(defaults, options));

    	for (const method of requestMethods) {
    		ky[method] = (input, options) => new Ky(input, validateAndMerge(defaults, options, {method}));
    	}

    	ky.HTTPError = HTTPError;
    	ky.TimeoutError = TimeoutError;
    	ky.create = newDefaults => createInstance(validateAndMerge(newDefaults));
    	ky.extend = newDefaults => createInstance(validateAndMerge(defaults, newDefaults));
    	ky.stop = stop;

    	return ky;
    };

    var ky = createInstance();

    async function fetchRates(base) {
      if (fetchRates.$$store.has(base)) {
        return fetchRates.$$store.get(base);
      }

      const call = ky
        .get(`https://api.exchangeratesapi.io/latest?base=${base}`)
        .json()
        .then(({ rates }) => rates);

      fetchRates.$$store.set(base, call);

      const rates = await call;

      fetchRates.$$store.delete(base);

      return rates;
    }

    fetchRates.$$store = new Map();

    /** @type ReturnType<openDB> */
    let dbPromise;

    const ONE_DAY = 1000 * 60 * 60 * 24;

    function open() {
      if (!dbPromise) {
        dbPromise = openDB('currencyConv', 1, {
          upgrade(db) {
            if (!db.objectStoreNames.contains('currencies')) {
              const currencies = db.createObjectStore('currencies', {
                keyPath: 'code',
              });
            }
          },
        });
      }
      return dbPromise;
    }

    async function getCurrency(currencyCode) {
      // get it from the store
      const db = await open();
      try {
        return await db.get('currencies', currencyCode);
      } catch (e) {
        // console.warn(e)
      }
      return undefined;
    }

    async function setCurrency(currencyCode, rates) {
      // get it from the store
      const db = await open();
      const tx = db.transaction('currencies', 'readwrite');
      const store = tx.objectStore('currencies');
      const data = {
        code: currencyCode,
        rates,
        lastUpdate: Date.now(),
      };
      const prev = await store.get(currencyCode);
      store[prev ? 'put' : 'add'](data);
      await tx.done;
      return data;
    }

    async function fetchCurrency(currencyCode) {
      const data = await getCurrency(currencyCode);
      // if it exists and it has been earlier than one day ago
      if (data && Date.now() <= data.lastUpdate + ONE_DAY) {
        return data;
      }

      try {
        const rates = await fetchRates(currencyCode);

        // store the data in the db
        return await setCurrency(currencyCode, rates);
      } catch (e) {
        console.warn(e);
        alert(`unable to retrieve exchange rates for ${currencyCode}`);
        return {};
      }
    }

    const inputAmount = writable(0);

    const currency = writable({
      input: 'JPY',
      output: 'EUR',
    });

    const exchangeRate = derived(
      currency,
      async ($currency) => {
        let { rates = {} } = await fetchCurrency($currency.input);
        return rates[$currency.output] || 0;
      },
      0
    );

    const convertedAmount = derived(
      [inputAmount, exchangeRate, currency],
      async ([$inputAmount, $exchangeRate, $currency]) => {
        const converted =
          (Number.parseFloat($inputAmount) || 0) * (await $exchangeRate);
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: $currency.output,
        })
          .formatToParts(converted)
          .filter(({ type }) => type !== 'currency')
          .map(({ value }) => value)
          .join('');
      },
      0
    );

    function invertCurrency() {
      currency.update(({ input, output }) => ({
        input: output,
        output: input,
      }));
    }

    function getCurrencySymbol(currency) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
      })
        .formatToParts(0)
        .find(({ type }) => type === 'currency').value;
    }

    /* src/components/CurrencyBox.svelte generated by Svelte v3.31.0 */

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (25:6) {#each currencies as currency}
    function create_each_block(ctx) {
    	let option;
    	let t0_value = /*currency*/ ctx[8] + "";
    	let t0;
    	let t1;
    	let option_selected_value;
    	let option_value_value;

    	return {
    		c() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.selected = option_selected_value = /*current*/ ctx[2] === /*currency*/ ctx[8] || undefined;
    			option.__value = option_value_value = /*currency*/ ctx[8];
    			option.value = option.__value;
    		},
    		m(target, anchor) {
    			insert(target, option, anchor);
    			append(option, t0);
    			append(option, t1);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*currencies*/ 8 && t0_value !== (t0_value = /*currency*/ ctx[8] + "")) set_data(t0, t0_value);

    			if (dirty & /*current, currencies*/ 12 && option_selected_value !== (option_selected_value = /*current*/ ctx[2] === /*currency*/ ctx[8] || undefined)) {
    				option.selected = option_selected_value;
    			}

    			if (dirty & /*currencies*/ 8 && option_value_value !== (option_value_value = /*currency*/ ctx[8])) {
    				option.__value = option_value_value;
    				option.value = option.__value;
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(option);
    		}
    	};
    }

    function create_fragment(ctx) {
    	let fieldset;
    	let legend;
    	let t0;
    	let t1;
    	let div0;
    	let label0;
    	let t2;
    	let label0_for_value;
    	let t3;
    	let img;
    	let img_src_value;
    	let t4;
    	let select;
    	let select_name_value;
    	let select_id_value;
    	let t5;
    	let div1;
    	let label1;
    	let span;
    	let t7;
    	let t8;
    	let label1_for_value;
    	let t9;
    	let current;
    	let each_value = /*currencies*/ ctx[3];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);

    	return {
    		c() {
    			fieldset = element("fieldset");
    			legend = element("legend");
    			t0 = text(/*label*/ ctx[0]);
    			t1 = space();
    			div0 = element("div");
    			label0 = element("label");
    			t2 = text("Currency");
    			t3 = space();
    			img = element("img");
    			t4 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			div1 = element("div");
    			label1 = element("label");
    			span = element("span");
    			span.textContent = "Amount";
    			t7 = space();
    			t8 = text(/*inputSymbol*/ ctx[4]);
    			t9 = space();
    			if (default_slot) default_slot.c();
    			attr(legend, "class", "sr-only");
    			attr(label0, "for", label0_for_value = /*id*/ ctx[1] + "-select");
    			attr(label0, "class", "sr-only");
    			if (img.src !== (img_src_value = /*currencyFlag*/ ctx[5])) attr(img, "src", img_src_value);
    			attr(img, "alt", "");
    			attr(img, "class", "w-6");
    			attr(img, "loading", "lazy");
    			attr(select, "name", select_name_value = /*id*/ ctx[1] + "-select");
    			attr(select, "id", select_id_value = /*id*/ ctx[1] + "-select");
    			select.disabled = true;
    			attr(select, "style", /*currencyFlag*/ ctx[5]);
    			attr(select, "class", "appearance-none w-full text-blue-900 font-bold bg-transparent border-0");
    			attr(div0, "class", "bg-blue-100 p-2 flex gap-2 items-center border-blue-200 border-b-2");
    			attr(span, "class", "sr-only");
    			attr(label1, "for", label1_for_value = /*id*/ ctx[1] + "-amount");
    			attr(div1, "class", "flex gap-x-2 items-baseline p-2");
    			attr(fieldset, "class", "p-0 border-2 border-blue-200 text-xl rounded-md min-w-0 text-gray-800");
    		},
    		m(target, anchor) {
    			insert(target, fieldset, anchor);
    			append(fieldset, legend);
    			append(legend, t0);
    			append(fieldset, t1);
    			append(fieldset, div0);
    			append(div0, label0);
    			append(label0, t2);
    			append(div0, t3);
    			append(div0, img);
    			append(div0, t4);
    			append(div0, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			append(fieldset, t5);
    			append(fieldset, div1);
    			append(div1, label1);
    			append(label1, span);
    			append(label1, t7);
    			append(label1, t8);
    			append(div1, t9);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (!current || dirty & /*label*/ 1) set_data(t0, /*label*/ ctx[0]);

    			if (!current || dirty & /*id*/ 2 && label0_for_value !== (label0_for_value = /*id*/ ctx[1] + "-select")) {
    				attr(label0, "for", label0_for_value);
    			}

    			if (!current || dirty & /*currencyFlag*/ 32 && img.src !== (img_src_value = /*currencyFlag*/ ctx[5])) {
    				attr(img, "src", img_src_value);
    			}

    			if (dirty & /*current, currencies, undefined*/ 12) {
    				each_value = /*currencies*/ ctx[3];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
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

    			if (!current || dirty & /*id*/ 2 && select_name_value !== (select_name_value = /*id*/ ctx[1] + "-select")) {
    				attr(select, "name", select_name_value);
    			}

    			if (!current || dirty & /*id*/ 2 && select_id_value !== (select_id_value = /*id*/ ctx[1] + "-select")) {
    				attr(select, "id", select_id_value);
    			}

    			if (!current || dirty & /*currencyFlag*/ 32) {
    				attr(select, "style", /*currencyFlag*/ ctx[5]);
    			}

    			if (!current || dirty & /*inputSymbol*/ 16) set_data(t8, /*inputSymbol*/ ctx[4]);

    			if (!current || dirty & /*id*/ 2 && label1_for_value !== (label1_for_value = /*id*/ ctx[1] + "-amount")) {
    				attr(label1, "for", label1_for_value);
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 64) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[6], dirty, null, null);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(fieldset);
    			destroy_each(each_blocks, detaching);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { label = "" } = $$props;
    	let { id = "" } = $$props;
    	let { current = "" } = $$props;
    	let { currencies = [] } = $$props;

    	$$self.$$set = $$props => {
    		if ("label" in $$props) $$invalidate(0, label = $$props.label);
    		if ("id" in $$props) $$invalidate(1, id = $$props.id);
    		if ("current" in $$props) $$invalidate(2, current = $$props.current);
    		if ("currencies" in $$props) $$invalidate(3, currencies = $$props.currencies);
    		if ("$$scope" in $$props) $$invalidate(6, $$scope = $$props.$$scope);
    	};

    	let inputSymbol;
    	let currencyFlag;

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*current*/ 4) {
    			 $$invalidate(4, inputSymbol = current && getCurrencySymbol(current));
    		}

    		if ($$self.$$.dirty & /*current*/ 4) {
    			 $$invalidate(5, currencyFlag = current && `/flags/${current.toLowerCase()}.png`);
    		}
    	};

    	return [label, id, current, currencies, inputSymbol, currencyFlag, $$scope, slots];
    }

    class CurrencyBox extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			label: 0,
    			id: 1,
    			current: 2,
    			currencies: 3
    		});
    	}
    }

    /* src/components/SwitchButton.svelte generated by Svelte v3.31.0 */

    function create_fragment$1(ctx) {
    	let button;
    	let svg;
    	let path;
    	let t0;
    	let span;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = space();
    			span = element("span");
    			span.textContent = "Switch";
    			attr(path, "stroke-linecap", "round");
    			attr(path, "stroke-linejoin", "round");
    			attr(path, "stroke-width", "2");
    			attr(path, "d", "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4");
    			attr(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr(svg, "focusable", "false");
    			attr(svg, "aria-hidden", "true");
    			attr(svg, "fill", "none");
    			attr(svg, "viewBox", "0 0 24 24");
    			attr(svg, "stroke", "currentColor");
    			set_style(svg, "width", "1em");
    			set_style(svg, "height", "1em");
    			attr(span, "class", "sr-only");
    			attr(button, "class", button_class_value = `text-blue-900 active:bg-blue-100 p-1 rounded-md border-none focus:outline-none focus-visible:ring-1 ring-blue-600 ${/*$$props*/ ctx[1].class}`);
    			attr(button, "type", "button");
    		},
    		m(target, anchor) {
    			insert(target, button, anchor);
    			append(button, svg);
    			append(svg, path);
    			append(button, t0);
    			append(button, span);

    			if (!mounted) {
    				dispose = listen(button, "click", function () {
    					if (is_function(/*onClick*/ ctx[0])) /*onClick*/ ctx[0].apply(this, arguments);
    				});

    				mounted = true;
    			}
    		},
    		p(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*$$props*/ 2 && button_class_value !== (button_class_value = `text-blue-900 active:bg-blue-100 p-1 rounded-md border-none focus:outline-none focus-visible:ring-1 ring-blue-600 ${/*$$props*/ ctx[1].class}`)) {
    				attr(button, "class", button_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(button);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { onClick = () => {
    		
    	} } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("onClick" in $$new_props) $$invalidate(0, onClick = $$new_props.onClick);
    	};

    	$$props = exclude_internal_props($$props);
    	return [onClick, $$props];
    }

    class SwitchButton extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { onClick: 0 });
    	}
    }

    /* src/App.svelte generated by Svelte v3.31.0 */

    function create_default_slot_1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			input = element("input");
    			attr(input, "type", "text");
    			attr(input, "inputmode", "numeric");
    			attr(input, "id", "from-amount");
    			attr(input, "name", "from-amount");
    			attr(input, "class", "px-2 py-1 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600");
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			set_input_value(input, /*$inputAmount*/ ctx[1]);

    			if (!mounted) {
    				dispose = listen(input, "input", /*input_input_handler*/ ctx[3]);
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (dirty & /*$inputAmount*/ 2 && input.value !== /*$inputAmount*/ ctx[1]) {
    				set_input_value(input, /*$inputAmount*/ ctx[1]);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(input);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (58:10) {:catch error}
    function create_catch_block(ctx) {
    	let t0;
    	let t1_value = /*error*/ ctx[5] + "";
    	let t1;
    	let t2;

    	return {
    		c() {
    			t0 = text("conversion error! (");
    			t1 = text(t1_value);
    			t2 = text(")");
    		},
    		m(target, anchor) {
    			insert(target, t0, anchor);
    			insert(target, t1, anchor);
    			insert(target, t2, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*$convertedAmount*/ 4 && t1_value !== (t1_value = /*error*/ ctx[5] + "")) set_data(t1, t1_value);
    		},
    		d(detaching) {
    			if (detaching) detach(t0);
    			if (detaching) detach(t1);
    			if (detaching) detach(t2);
    		}
    	};
    }

    // (56:10) {:then number}
    function create_then_block(ctx) {
    	let t_value = /*number*/ ctx[4] + "";
    	let t;

    	return {
    		c() {
    			t = text(t_value);
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*$convertedAmount*/ 4 && t_value !== (t_value = /*number*/ ctx[4] + "")) set_data(t, t_value);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (54:35)              ...converting           {:then number}
    function create_pending_block(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("...converting");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (44:6) <CurrencyBox         label="Output Currency"         id="to"         current={$currency.output}         currencies={[$currency.output]}>
    function create_default_slot(ctx) {
    	let output;
    	let promise;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: true,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 4,
    		error: 5
    	};

    	handle_promise(promise = /*$convertedAmount*/ ctx[2], info);

    	return {
    		c() {
    			output = element("output");
    			info.block.c();
    			attr(output, "name", "to-amount");
    			attr(output, "id", "to-amount");
    			attr(output, "for", "from-select to-select from-amount");
    			attr(output, "class", "pr-1 pt-1 pb-1 w-full truncate");
    		},
    		m(target, anchor) {
    			insert(target, output, anchor);
    			info.block.m(output, info.anchor = null);
    			info.mount = () => output;
    			info.anchor = null;
    		},
    		p(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*$convertedAmount*/ 4 && promise !== (promise = /*$convertedAmount*/ ctx[2]) && handle_promise(promise, info)) ; else {
    				const child_ctx = ctx.slice();
    				child_ctx[4] = child_ctx[5] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(output);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};
    }

    function create_fragment$2(ctx) {
    	let tailwind;
    	let t0;
    	let main;
    	let form;
    	let div0;
    	let currencybox0;
    	let t1;
    	let div1;
    	let currencybox1;
    	let t2;
    	let div2;
    	let switchbutton;
    	let current;
    	let mounted;
    	let dispose;
    	tailwind = new Tailwind({});

    	currencybox0 = new CurrencyBox({
    			props: {
    				label: "Source Currency",
    				id: "from",
    				current: /*$currency*/ ctx[0].input,
    				currencies: [/*$currency*/ ctx[0].input],
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			}
    		});

    	currencybox1 = new CurrencyBox({
    			props: {
    				label: "Output Currency",
    				id: "to",
    				current: /*$currency*/ ctx[0].output,
    				currencies: [/*$currency*/ ctx[0].output],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			}
    		});

    	switchbutton = new SwitchButton({
    			props: {
    				onClick: invertCurrency,
    				class: "text-2xl"
    			}
    		});

    	return {
    		c() {
    			create_component(tailwind.$$.fragment);
    			t0 = space();
    			main = element("main");
    			form = element("form");
    			div0 = element("div");
    			create_component(currencybox0.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			create_component(currencybox1.$$.fragment);
    			t2 = space();
    			div2 = element("div");
    			create_component(switchbutton.$$.fragment);
    			attr(div0, "class", "min-w-0");
    			attr(div1, "class", "min-w-0 md:col-start-3 order-last");
    			attr(div2, "class", "items-center col-start-2 row-start-1 flex justify-center");
    			attr(form, "class", "l-container gap-4 svelte-1o6ganl");
    			attr(main, "class", "container lg:max-w-3xl lg:pt-10 pt-4 pb-4 mx-auto px-4");
    		},
    		m(target, anchor) {
    			mount_component(tailwind, target, anchor);
    			insert(target, t0, anchor);
    			insert(target, main, anchor);
    			append(main, form);
    			append(form, div0);
    			mount_component(currencybox0, div0, null);
    			append(form, t1);
    			append(form, div1);
    			mount_component(currencybox1, div1, null);
    			append(form, t2);
    			append(form, div2);
    			mount_component(switchbutton, div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen(form, "submit", prevent_default(submit_handler));
    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			const currencybox0_changes = {};
    			if (dirty & /*$currency*/ 1) currencybox0_changes.current = /*$currency*/ ctx[0].input;
    			if (dirty & /*$currency*/ 1) currencybox0_changes.currencies = [/*$currency*/ ctx[0].input];

    			if (dirty & /*$$scope, $inputAmount*/ 66) {
    				currencybox0_changes.$$scope = { dirty, ctx };
    			}

    			currencybox0.$set(currencybox0_changes);
    			const currencybox1_changes = {};
    			if (dirty & /*$currency*/ 1) currencybox1_changes.current = /*$currency*/ ctx[0].output;
    			if (dirty & /*$currency*/ 1) currencybox1_changes.currencies = [/*$currency*/ ctx[0].output];

    			if (dirty & /*$$scope, $convertedAmount*/ 68) {
    				currencybox1_changes.$$scope = { dirty, ctx };
    			}

    			currencybox1.$set(currencybox1_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(tailwind.$$.fragment, local);
    			transition_in(currencybox0.$$.fragment, local);
    			transition_in(currencybox1.$$.fragment, local);
    			transition_in(switchbutton.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(tailwind.$$.fragment, local);
    			transition_out(currencybox0.$$.fragment, local);
    			transition_out(currencybox1.$$.fragment, local);
    			transition_out(switchbutton.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(tailwind, detaching);
    			if (detaching) detach(t0);
    			if (detaching) detach(main);
    			destroy_component(currencybox0);
    			destroy_component(currencybox1);
    			destroy_component(switchbutton);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    const submit_handler = () => {
    	
    };

    function instance$2($$self, $$props, $$invalidate) {
    	let $currency;
    	let $inputAmount;
    	let $convertedAmount;
    	component_subscribe($$self, currency, $$value => $$invalidate(0, $currency = $$value));
    	component_subscribe($$self, inputAmount, $$value => $$invalidate(1, $inputAmount = $$value));
    	component_subscribe($$self, convertedAmount, $$value => $$invalidate(2, $convertedAmount = $$value));

    	function input_input_handler() {
    		$inputAmount = this.value;
    		inputAmount.set($inputAmount);
    	}

    	return [$currency, $inputAmount, $convertedAmount, input_input_handler];
    }

    class App extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});
    	}
    }

    const app = new App({
      target: document.body,
      props: {
        name: 'world',
      },
    });

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js');
    }

    return app;

}());
//# sourceMappingURL=bundle.js.map
