import * as alt from 'alt-client';
import alt__default, { Vector3 as Vector3$1 } from 'alt-client';
import * as native from 'natives';
import native__default from 'natives';

const Metadata = new WeakMap();
function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
    return ordinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
}
function decorate(decorators, target, propertyKey, attributes) {
    if (decorators.length === 0) {
        throw new TypeError();
    }
    if (typeof target === 'function') {
        return decorateConstructor(decorators, target);
    }
    else if (propertyKey !== undefined) {
        return decorateProperty(decorators, target, propertyKey, attributes);
    }
    return;
}
function metadata(metadataKey, metadataValue) {
    return function decorator(target, propertyKey) {
        ordinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
    };
}
function getMetadata(metadataKey, target, propertyKey) {
    return ordinaryGetMetadata(metadataKey, target, propertyKey);
}
function getOwnMetadata(metadataKey, target, propertyKey) {
    return ordinaryGetOwnMetadata(metadataKey, target, propertyKey);
}
function hasOwnMetadata(metadataKey, target, propertyKey) {
    return !!ordinaryGetOwnMetadata(metadataKey, target, propertyKey);
}
function hasMetadata(metadataKey, target, propertyKey) {
    return !!ordinaryGetMetadata(metadataKey, target, propertyKey);
}
function decorateConstructor(decorators, target) {
    decorators.reverse().forEach((decorator) => {
        const decorated = decorator(target);
        if (decorated) {
            target = decorated;
        }
    });
    return target;
}
function decorateProperty(decorators, target, propertyKey, descriptor) {
    decorators.reverse().forEach((decorator) => {
        descriptor = decorator(target, propertyKey, descriptor) || descriptor;
    });
    return descriptor;
}
function ordinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey) {
    if (propertyKey && !['string', 'symbol'].includes(typeof propertyKey)) {
        throw new TypeError();
    }
    (getMetadataMap(target, propertyKey) || createMetadataMap(target, propertyKey))
        .set(metadataKey, metadataValue);
}
function ordinaryGetMetadata(metadataKey, target, propertyKey) {
    return !!ordinaryGetOwnMetadata(metadataKey, target, propertyKey)
        ? ordinaryGetOwnMetadata(metadataKey, target, propertyKey)
        : Object.getPrototypeOf(target)
            ? ordinaryGetMetadata(metadataKey, Object.getPrototypeOf(target), propertyKey)
            : undefined;
}
function ordinaryGetOwnMetadata(metadataKey, target, propertyKey) {
    if (target === undefined) {
        throw new TypeError();
    }
    const metadataMap = getMetadataMap(target, propertyKey);
    return metadataMap && metadataMap.get(metadataKey);
}
function getMetadataMap(target, propertyKey) {
    return Metadata.get(target) && Metadata.get(target).get(propertyKey);
}
function createMetadataMap(target, propertyKey) {
    const targetMetadata = Metadata.get(target) || new Map();
    Metadata.set(target, targetMetadata);
    const metadataMap = targetMetadata.get(propertyKey) || (new Map());
    targetMetadata.set(propertyKey, metadataMap);
    return metadataMap;
}
const Reflection = {
    decorate,
    defineMetadata,
    getMetadata,
    getOwnMetadata,
    hasMetadata,
    hasOwnMetadata,
    metadata,
};
Object.assign(Reflect, Reflection);

var Lifecycle;
(function (Lifecycle) {
    Lifecycle[Lifecycle["Transient"] = 0] = "Transient";
    Lifecycle[Lifecycle["Singleton"] = 1] = "Singleton";
    Lifecycle[Lifecycle["ResolutionScoped"] = 2] = "ResolutionScoped";
    Lifecycle[Lifecycle["ContainerScoped"] = 3] = "ContainerScoped";
})(Lifecycle || (Lifecycle = {}));
var Lifecycle$1 = Lifecycle;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

var INJECTION_TOKEN_METADATA_KEY = "injectionTokens";
function getParamInfo(target) {
    var params = Reflect.getMetadata("design:paramtypes", target) || [];
    var injectionTokens = Reflect.getOwnMetadata(INJECTION_TOKEN_METADATA_KEY, target) || {};
    Object.keys(injectionTokens).forEach(function (key) {
        params[+key] = injectionTokens[key];
    });
    return params;
}

function isClassProvider(provider) {
    return !!provider.useClass;
}

function isFactoryProvider(provider) {
    return !!provider.useFactory;
}

var DelayedConstructor = (function () {
    function DelayedConstructor(wrap) {
        this.wrap = wrap;
        this.reflectMethods = [
            "get",
            "getPrototypeOf",
            "setPrototypeOf",
            "getOwnPropertyDescriptor",
            "defineProperty",
            "has",
            "set",
            "deleteProperty",
            "apply",
            "construct",
            "ownKeys"
        ];
    }
    DelayedConstructor.prototype.createProxy = function (createObject) {
        var _this = this;
        var target = {};
        var init = false;
        var value;
        var delayedObject = function () {
            if (!init) {
                value = createObject(_this.wrap());
                init = true;
            }
            return value;
        };
        return new Proxy(target, this.createHandler(delayedObject));
    };
    DelayedConstructor.prototype.createHandler = function (delayedObject) {
        var handler = {};
        var install = function (name) {
            handler[name] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                args[0] = delayedObject();
                var method = Reflect[name];
                return method.apply(void 0, __spread(args));
            };
        };
        this.reflectMethods.forEach(install);
        return handler;
    };
    return DelayedConstructor;
}());

function isNormalToken(token) {
    return typeof token === "string" || typeof token === "symbol";
}
function isTokenDescriptor(descriptor) {
    return (typeof descriptor === "object" &&
        "token" in descriptor &&
        "multiple" in descriptor);
}
function isTransformDescriptor(descriptor) {
    return (typeof descriptor === "object" &&
        "token" in descriptor &&
        "transform" in descriptor);
}
function isConstructorToken(token) {
    return typeof token === "function" || token instanceof DelayedConstructor;
}

function isTokenProvider(provider) {
    return !!provider.useToken;
}

function isValueProvider(provider) {
    return provider.useValue != undefined;
}

function isProvider(provider) {
    return (isClassProvider(provider) ||
        isValueProvider(provider) ||
        isTokenProvider(provider) ||
        isFactoryProvider(provider));
}

var RegistryBase = (function () {
    function RegistryBase() {
        this._registryMap = new Map();
    }
    RegistryBase.prototype.entries = function () {
        return this._registryMap.entries();
    };
    RegistryBase.prototype.getAll = function (key) {
        this.ensure(key);
        return this._registryMap.get(key);
    };
    RegistryBase.prototype.get = function (key) {
        this.ensure(key);
        var value = this._registryMap.get(key);
        return value[value.length - 1] || null;
    };
    RegistryBase.prototype.set = function (key, value) {
        this.ensure(key);
        this._registryMap.get(key).push(value);
    };
    RegistryBase.prototype.setAll = function (key, value) {
        this._registryMap.set(key, value);
    };
    RegistryBase.prototype.has = function (key) {
        this.ensure(key);
        return this._registryMap.get(key).length > 0;
    };
    RegistryBase.prototype.clear = function () {
        this._registryMap.clear();
    };
    RegistryBase.prototype.ensure = function (key) {
        if (!this._registryMap.has(key)) {
            this._registryMap.set(key, []);
        }
    };
    return RegistryBase;
}());

var Registry = (function (_super) {
    __extends(Registry, _super);
    function Registry() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Registry;
}(RegistryBase));

var ResolutionContext = (function () {
    function ResolutionContext() {
        this.scopedResolutions = new Map();
    }
    return ResolutionContext;
}());

function formatDependency(params, idx) {
    if (params === null) {
        return "at position #" + idx;
    }
    var argName = params.split(",")[idx].trim();
    return "\"" + argName + "\" at position #" + idx;
}
function composeErrorMessage(msg, e, indent) {
    if (indent === void 0) { indent = "    "; }
    return __spread([msg], e.message.split("\n").map(function (l) { return indent + l; })).join("\n");
}
function formatErrorCtor(ctor, paramIdx, error) {
    var _a = __read(ctor.toString().match(/constructor\(([\w, ]+)\)/) || [], 2), _b = _a[1], params = _b === void 0 ? null : _b;
    var dep = formatDependency(params, paramIdx);
    return composeErrorMessage("Cannot inject the dependency " + dep + " of \"" + ctor.name + "\" constructor. Reason:", error);
}

var PreResolutionInterceptors = (function (_super) {
    __extends(PreResolutionInterceptors, _super);
    function PreResolutionInterceptors() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PreResolutionInterceptors;
}(RegistryBase));
var PostResolutionInterceptors = (function (_super) {
    __extends(PostResolutionInterceptors, _super);
    function PostResolutionInterceptors() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PostResolutionInterceptors;
}(RegistryBase));
var Interceptors = (function () {
    function Interceptors() {
        this.preResolution = new PreResolutionInterceptors();
        this.postResolution = new PostResolutionInterceptors();
    }
    return Interceptors;
}());

var typeInfo = new Map();
var InternalDependencyContainer = (function () {
    function InternalDependencyContainer(parent) {
        this.parent = parent;
        this._registry = new Registry();
        this.interceptors = new Interceptors();
    }
    InternalDependencyContainer.prototype.register = function (token, providerOrConstructor, options) {
        if (options === void 0) { options = { lifecycle: Lifecycle$1.Transient }; }
        var provider;
        if (!isProvider(providerOrConstructor)) {
            provider = { useClass: providerOrConstructor };
        }
        else {
            provider = providerOrConstructor;
        }
        if (isTokenProvider(provider)) {
            var path = [token];
            var tokenProvider = provider;
            while (tokenProvider != null) {
                var currentToken = tokenProvider.useToken;
                if (path.includes(currentToken)) {
                    throw new Error("Token registration cycle detected! " + __spread(path, [currentToken]).join(" -> "));
                }
                path.push(currentToken);
                var registration = this._registry.get(currentToken);
                if (registration && isTokenProvider(registration.provider)) {
                    tokenProvider = registration.provider;
                }
                else {
                    tokenProvider = null;
                }
            }
        }
        if (options.lifecycle === Lifecycle$1.Singleton ||
            options.lifecycle == Lifecycle$1.ContainerScoped ||
            options.lifecycle == Lifecycle$1.ResolutionScoped) {
            if (isValueProvider(provider) || isFactoryProvider(provider)) {
                throw new Error("Cannot use lifecycle \"" + Lifecycle$1[options.lifecycle] + "\" with ValueProviders or FactoryProviders");
            }
        }
        this._registry.set(token, { provider: provider, options: options });
        return this;
    };
    InternalDependencyContainer.prototype.registerType = function (from, to) {
        if (isNormalToken(to)) {
            return this.register(from, {
                useToken: to
            });
        }
        return this.register(from, {
            useClass: to
        });
    };
    InternalDependencyContainer.prototype.registerInstance = function (token, instance) {
        return this.register(token, {
            useValue: instance
        });
    };
    InternalDependencyContainer.prototype.registerSingleton = function (from, to) {
        if (isNormalToken(from)) {
            if (isNormalToken(to)) {
                return this.register(from, {
                    useToken: to
                }, { lifecycle: Lifecycle$1.Singleton });
            }
            else if (to) {
                return this.register(from, {
                    useClass: to
                }, { lifecycle: Lifecycle$1.Singleton });
            }
            throw new Error('Cannot register a type name as a singleton without a "to" token');
        }
        var useClass = from;
        if (to && !isNormalToken(to)) {
            useClass = to;
        }
        return this.register(from, {
            useClass: useClass
        }, { lifecycle: Lifecycle$1.Singleton });
    };
    InternalDependencyContainer.prototype.resolve = function (token, context) {
        if (context === void 0) { context = new ResolutionContext(); }
        var registration = this.getRegistration(token);
        if (!registration && isNormalToken(token)) {
            throw new Error("Attempted to resolve unregistered dependency token: \"" + token.toString() + "\"");
        }
        this.executePreResolutionInterceptor(token, "Single");
        if (registration) {
            var result = this.resolveRegistration(registration, context);
            this.executePostResolutionInterceptor(token, result, "Single");
            return result;
        }
        if (isConstructorToken(token)) {
            var result = this.construct(token, context);
            this.executePostResolutionInterceptor(token, result, "Single");
            return result;
        }
        throw new Error("Attempted to construct an undefined constructor. Could mean a circular dependency problem. Try using `delay` function.");
    };
    InternalDependencyContainer.prototype.executePreResolutionInterceptor = function (token, resolutionType) {
        var e_1, _a;
        if (this.interceptors.preResolution.has(token)) {
            var remainingInterceptors = [];
            try {
                for (var _b = __values(this.interceptors.preResolution.getAll(token)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var interceptor = _c.value;
                    if (interceptor.options.frequency != "Once") {
                        remainingInterceptors.push(interceptor);
                    }
                    interceptor.callback(token, resolutionType);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.interceptors.preResolution.setAll(token, remainingInterceptors);
        }
    };
    InternalDependencyContainer.prototype.executePostResolutionInterceptor = function (token, result, resolutionType) {
        var e_2, _a;
        if (this.interceptors.postResolution.has(token)) {
            var remainingInterceptors = [];
            try {
                for (var _b = __values(this.interceptors.postResolution.getAll(token)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var interceptor = _c.value;
                    if (interceptor.options.frequency != "Once") {
                        remainingInterceptors.push(interceptor);
                    }
                    interceptor.callback(token, result, resolutionType);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            this.interceptors.postResolution.setAll(token, remainingInterceptors);
        }
    };
    InternalDependencyContainer.prototype.resolveRegistration = function (registration, context) {
        if (registration.options.lifecycle === Lifecycle$1.ResolutionScoped &&
            context.scopedResolutions.has(registration)) {
            return context.scopedResolutions.get(registration);
        }
        var isSingleton = registration.options.lifecycle === Lifecycle$1.Singleton;
        var isContainerScoped = registration.options.lifecycle === Lifecycle$1.ContainerScoped;
        var returnInstance = isSingleton || isContainerScoped;
        var resolved;
        if (isValueProvider(registration.provider)) {
            resolved = registration.provider.useValue;
        }
        else if (isTokenProvider(registration.provider)) {
            resolved = returnInstance
                ? registration.instance ||
                    (registration.instance = this.resolve(registration.provider.useToken, context))
                : this.resolve(registration.provider.useToken, context);
        }
        else if (isClassProvider(registration.provider)) {
            resolved = returnInstance
                ? registration.instance ||
                    (registration.instance = this.construct(registration.provider.useClass, context))
                : this.construct(registration.provider.useClass, context);
        }
        else if (isFactoryProvider(registration.provider)) {
            resolved = registration.provider.useFactory(this);
        }
        else {
            resolved = this.construct(registration.provider, context);
        }
        if (registration.options.lifecycle === Lifecycle$1.ResolutionScoped) {
            context.scopedResolutions.set(registration, resolved);
        }
        return resolved;
    };
    InternalDependencyContainer.prototype.resolveAll = function (token, context) {
        var _this = this;
        if (context === void 0) { context = new ResolutionContext(); }
        var registrations = this.getAllRegistrations(token);
        if (!registrations && isNormalToken(token)) {
            throw new Error("Attempted to resolve unregistered dependency token: \"" + token.toString() + "\"");
        }
        this.executePreResolutionInterceptor(token, "All");
        if (registrations) {
            var result_1 = registrations.map(function (item) {
                return _this.resolveRegistration(item, context);
            });
            this.executePostResolutionInterceptor(token, result_1, "All");
            return result_1;
        }
        var result = [this.construct(token, context)];
        this.executePostResolutionInterceptor(token, result, "All");
        return result;
    };
    InternalDependencyContainer.prototype.isRegistered = function (token, recursive) {
        if (recursive === void 0) { recursive = false; }
        return (this._registry.has(token) ||
            (recursive &&
                (this.parent || false) &&
                this.parent.isRegistered(token, true)));
    };
    InternalDependencyContainer.prototype.reset = function () {
        this._registry.clear();
        this.interceptors.preResolution.clear();
        this.interceptors.postResolution.clear();
    };
    InternalDependencyContainer.prototype.clearInstances = function () {
        var e_3, _a;
        try {
            for (var _b = __values(this._registry.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), token = _d[0], registrations = _d[1];
                this._registry.setAll(token, registrations
                    .filter(function (registration) { return !isValueProvider(registration.provider); })
                    .map(function (registration) {
                    registration.instance = undefined;
                    return registration;
                }));
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    InternalDependencyContainer.prototype.createChildContainer = function () {
        var e_4, _a;
        var childContainer = new InternalDependencyContainer(this);
        try {
            for (var _b = __values(this._registry.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), token = _d[0], registrations = _d[1];
                if (registrations.some(function (_a) {
                    var options = _a.options;
                    return options.lifecycle === Lifecycle$1.ContainerScoped;
                })) {
                    childContainer._registry.setAll(token, registrations.map(function (registration) {
                        if (registration.options.lifecycle === Lifecycle$1.ContainerScoped) {
                            return {
                                provider: registration.provider,
                                options: registration.options
                            };
                        }
                        return registration;
                    }));
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return childContainer;
    };
    InternalDependencyContainer.prototype.beforeResolution = function (token, callback, options) {
        if (options === void 0) { options = { frequency: "Always" }; }
        this.interceptors.preResolution.set(token, {
            callback: callback,
            options: options
        });
    };
    InternalDependencyContainer.prototype.afterResolution = function (token, callback, options) {
        if (options === void 0) { options = { frequency: "Always" }; }
        this.interceptors.postResolution.set(token, {
            callback: callback,
            options: options
        });
    };
    InternalDependencyContainer.prototype.getRegistration = function (token) {
        if (this.isRegistered(token)) {
            return this._registry.get(token);
        }
        if (this.parent) {
            return this.parent.getRegistration(token);
        }
        return null;
    };
    InternalDependencyContainer.prototype.getAllRegistrations = function (token) {
        if (this.isRegistered(token)) {
            return this._registry.getAll(token);
        }
        if (this.parent) {
            return this.parent.getAllRegistrations(token);
        }
        return null;
    };
    InternalDependencyContainer.prototype.construct = function (ctor, context) {
        var _this = this;
        if (ctor instanceof DelayedConstructor) {
            return ctor.createProxy(function (target) {
                return _this.resolve(target, context);
            });
        }
        var paramInfo = typeInfo.get(ctor);
        if (!paramInfo || paramInfo.length === 0) {
            if (ctor.length === 0) {
                return new ctor();
            }
            else {
                throw new Error("TypeInfo not known for \"" + ctor.name + "\"");
            }
        }
        var params = paramInfo.map(this.resolveParams(context, ctor));
        return new (ctor.bind.apply(ctor, __spread([void 0], params)))();
    };
    InternalDependencyContainer.prototype.resolveParams = function (context, ctor) {
        var _this = this;
        return function (param, idx) {
            var _a, _b, _c;
            try {
                if (isTokenDescriptor(param)) {
                    if (isTransformDescriptor(param)) {
                        return param.multiple
                            ? (_a = _this.resolve(param.transform)).transform.apply(_a, __spread([_this.resolveAll(param.token)], param.transformArgs)) : (_b = _this.resolve(param.transform)).transform.apply(_b, __spread([_this.resolve(param.token, context)], param.transformArgs));
                    }
                    else {
                        return param.multiple
                            ? _this.resolveAll(param.token)
                            : _this.resolve(param.token, context);
                    }
                }
                else if (isTransformDescriptor(param)) {
                    return (_c = _this.resolve(param.transform, context)).transform.apply(_c, __spread([_this.resolve(param.token, context)], param.transformArgs));
                }
                return _this.resolve(param, context);
            }
            catch (e) {
                throw new Error(formatErrorCtor(ctor, idx, e));
            }
        };
    };
    return InternalDependencyContainer;
}());
var instance = new InternalDependencyContainer();

function injectable() {
    return function (target) {
        typeInfo.set(target, getParamInfo(target));
    };
}

function singleton() {
    return function (target) {
        injectable()(target);
        instance.registerSingleton(target);
    };
}

if (typeof Reflect === "undefined" || !Reflect.getMetadata) {
    throw new Error("tsyringe requires a reflect polyfill. Please add 'import \"reflect-metadata\"' to the top of your entry point.");
}

/**
 * Convert given value to event name.
 * e.g: myAwesomeEvent => my:awesome:event
 * Only for custom events, alt:v client events would be excluded
 *
 *
 * @param {string} value
 * @returns {string}
 */
function convertToEventName(value) {
    const clientEvents = [
        'anyResourceError',
        'anyResourceStart',
        'anyResourceStop',
        'connectionComplete',
        'consoleCommand',
        'disconnect',
        'gameEntityCreate',
        'gameEntityDestroy',
        'keydown',
        'keyup',
        'removeEntity',
        'resourceStart',
        'resourceStop',
        'syncedMetaChange',
        'streamSyncedMetaChange',
        'enteredVehicle',
        'changedVehicleSeat',
        'leftVehicle',
        'taskChange'
    ];
    return clientEvents.includes(value)
        ? value
        : value.replace(/([a-zA-Z])(?=[A-Z])/g, '$1:')
            .toLowerCase();
}
const loadModel = async (modelHash, timeoutMs = 10000) => {
    return new Promise((resolve, reject) => {
        if (!native.isModelValid(modelHash)) {
            reject(new Error(`Model does not exist: ${modelHash}`));
            return;
        }
        if (native.hasModelLoaded(modelHash)) {
            resolve(true);
            return;
        }
        native.requestModel(modelHash);
        const deadline = new Date().getTime() + timeoutMs;
        const inter = alt.setInterval(() => {
            if (native.hasModelLoaded(modelHash)) {
                alt.clearInterval(inter);
                resolve(true);
            }
            else if (deadline < new Date().getTime()) {
                alt.clearInterval(inter);
                const error = `Error: Async loading failed for model: ${modelHash}`;
                alt.log(error);
                reject(resolve(false));
            }
        }, 10);
    });
};
function getGroundZ(x, y, z, tries = 0) {
    native.setFocusPosAndVel(x, y, z, 0, 0, 0);
    let [_, height] = native.getGroundZFor3dCoord(x, y, z + 1, 0, undefined, undefined);
    if (!height && tries < 20)
        return getGroundZ(x, y, z + 5, ++tries);
    native.clearFocus();
    if (!height)
        return 0;
    return height;
}
const UUIDV4 = () => {
    let uuid = '';
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    for (let ii = 0; 32 > ii; ii += 1)
        8 === ii || 20 === ii ? (uuid += '-', uuid += (0 | 16 * Math.random()).toString(16)) : 12 === ii ? (uuid += '-', uuid += '4') : 16 === ii ? (uuid += '-', uuid += (8 | 4 * Math.random()).toString(16)) : uuid += (0 | 16 * Math.random()).toString(16);
    return uuid;
};
const UID = () => {
    return Math.floor(Math.random() * 9999999);
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

let LoggerModule = class LoggerModule {
    info(...messages) {
        alt.log(...messages);
    }
    warning(...messages) {
        alt.logWarning(...messages);
    }
    error(...messages) {
        alt.logError(...messages);
    }
};
LoggerModule = __decorate([
    singleton()
], LoggerModule);

let EventModule = class EventModule {
    logger;
    /**
     * Available listener types for client
     *
     * @type {string[]}
     */
    availableListenerTypes = ['on', 'onServer', 'onGui'];
    constructor(logger) {
        this.logger = logger;
    }
    /**
     * Register listener
     *
     * @param {string} type
     * @param {string} name
     * @param {Function} callback
     */
    listener(type, name, callback) {
        if (this.availableListenerTypes.includes(type)) {
            this[type](name, callback);
        }
    }
    /**
     * Receive event from client
     *
     * @param {string} name
     * @param {(...args: any[]) => void} callback
     */
    on(name, callback) {
        alt.on(name, callback);
    }
    /**
     * Receive event from gui
     *
     * @param name
     * @param {(...args: any[]) => void} callback
     */
    onGui(name, callback) {
        alt.emit('gui:on', name, callback);
    }
    /**
     * Receive event from server
     *
     * @param {string} name
     * @param {(...args: any[]) => void} callback
     */
    onServer(name, callback) {
        alt.onServer(name, callback);
    }
    /**
     * Emit event to server
     *
     * @param {string} name
     * @param args
     */
    emit(name, ...args) {
        //this.logger.info("EventModule: Emit event '" + name + "' with args: " + args);
        alt.emit(name, ...args);
    }
    /**
     * Emit event to server
     *
     * @param {string} name
     * @param args
     */
    emitServer(name, ...args) {
        // this.logger.info("EventModule: Emit server event '" + name + "' with args: " + args);
        alt.emitServer(name, ...args);
    }
    /**
     * Emit event to gui
     *
     * @param {string} name
     * @param args
     */
    emitGui(name, ...args) {
        //this.logger.info("EventModule: Emit gui event '" + name + "' with args: " + JSON.stringify(args));
        alt.emit('gui:emit', name, ...args);
    }
};
EventModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [LoggerModule])
], EventModule);

let KeyEventModule = class KeyEventModule {
    /**
     * Contains all keyup events
     * @type {Map<any, any>}
     */
    keyupEvents = new Map();
    /**
     * Contains all keydown events
     * @type {Map<any, any>}
     */
    keydownEvents = new Map();
    /**
     * Contains available listener types
     * @type {string[]}
     */
    availableListeners = ['keyup', 'keydown'];
    /**
     * Add listener helper for decorators
     *
     * @param {string} type
     * @param {number} key
     * @param {Function} callback
     */
    listener(type, key, callback) {
        if (this.availableListeners.includes(type)) {
            this[type](key, callback);
        }
    }
    /**
     * Register keyup events
     *
     * @param {number} key
     * @param {Function} callback
     */
    keyup(key, callback) {
        if (this.keyupEvents.has(key)) {
            // throw some errors
            return;
        }
        this.keyupEvents.set(key, callback);
    }
    /**
     * Register keydown events
     *
     * @param {number} key
     * @param {Function} callback
     */
    keydown(key, callback) {
        if (this.keydownEvents.has(key)) {
            // throw some errors
            return;
        }
        this.keydownEvents.set(key, callback);
    }
    /**
     * Run available key commands
     *
     * @param {string} type
     * @param {number} key
     */
    run(type, key) {
        if (this.availableListeners.includes(type)) {
            const eventMap = this[`${type}Events`];
            if (eventMap.has(key)) {
                eventMap.get(key).apply(this);
            }
        }
    }
};
KeyEventModule = __decorate([
    singleton()
], KeyEventModule);

instance.register('EventModule', { useValue: instance.resolve(EventModule) });
instance.register('LoggerModule', { useValue: instance.resolve(LoggerModule) });
instance.register('KeyEventModule', { useValue: instance.resolve(KeyEventModule) });
instance.register('convertToEventName', { useValue: convertToEventName });

/**
 * Extend given proto class with the target
 *
 * @param {Function} protoClass
 * @returns {ClassDecorator}
 * @constructor
 */
const PrototypeFor = (protoClass) => {
    return (target) => {
        protoClass.prototype = target.prototype;
    };
};

let WebView = class WebView extends alt.WebView {
};
WebView = __decorate([
    PrototypeFor(alt.WebView)
], WebView);

let UpdateModule = class UpdateModule {
    updates = [];
    constructor() {
        alt.everyTick(() => {
            for (const update of this.updates) {
                if (update === undefined)
                    continue;
                update.f();
            }
        });
    }
    disconnect() {
        this.updates = [];
    }
    add(func) {
        const r = { f: func, uuid: UUIDV4() };
        this.updates.push(r);
        return r.uuid;
    }
    remove(uuid) {
        this.updates = this.updates.filter(m => m.uuid !== uuid);
    }
};
UpdateModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [])
], UpdateModule);

let CameraModule = class CameraModule {
    logger;
    get getCamera() {
        return this.camera;
    }
    get camPos() {
        return native.getCamCoord(this.camera);
    }
    get camRot() {
        return native.getCamRot(this.camera, 0);
    }
    camera;
    isCamMoving;
    constructor(logger) {
        this.logger = logger;
    }
    createCamera(pos, rot = new alt.Vector3(0, 0, 0), fov = 70) {
        if (this.camera) {
            this.destroyCamera();
        }
        native.setFocusPosAndVel(pos.x, pos.y, pos.z, 0.0, 0.0, 0.0);
        native.setHdArea(pos.x, pos.y, pos.z, 30);
        this.camera = native.createCam("DEFAULT_SCRIPTED_CAMERA", true);
        native.setCamActive(this.camera, true);
        native.renderScriptCams(true, true, 0, false, false, 0);
        native.setCamCoord(this.camera, pos.x, pos.y, pos.z);
        native.setCamRot(this.camera, rot.x, rot.y, rot.z, 0);
        native.setCamFov(this.camera, fov);
    }
    destroyCamera() {
        native.renderScriptCams(false, false, 0, false, false, 0);
        if (this.camera !== undefined && native.doesCamExist(this.camera)) {
            native.destroyCam(this.camera, true);
        }
        native.setFollowPedCamViewMode(1);
        native.clearFocus();
        native.clearHdArea();
        this.camera = undefined;
    }
    moveCamera(pos, rot = new alt.Vector3(0, 0, 0), duration = 1000, override = false) {
        if (this.isCamMoving && !override)
            return;
        const targetPosCam = native.createCam("DEFAULT_SCRIPTED_CAMERA", true);
        native.setCamCoord(targetPosCam, pos.x, pos.y, pos.z);
        native.setCamRot(targetPosCam, rot.x, rot.y, rot.z, 0);
        native.setFocusPosAndVel(pos.x, pos.y, pos.z, 0.0, 0.0, 0.0);
        native.setHdArea(pos.x, pos.y, pos.z, 30);
        native.setCamActiveWithInterp(targetPosCam, this.camera, duration, 0, 0);
        this.isCamMoving = true;
        alt.setTimeout(() => {
            native.setCamCoord(this.camera, pos.x, pos.y, pos.z);
            native.setCamRot(this.camera, rot.x, rot.y, rot.z, 0);
            native.destroyCam(targetPosCam, true);
            this.isCamMoving = false;
        }, duration + 10);
    }
    setPos(pos) {
        native.setCamCoord(this.camera, pos.x, pos.y, pos.z);
        native.setFocusPosAndVel(pos.x, pos.y, pos.z, 0.0, 0.0, 0.0);
        native.setHdArea(pos.x, pos.y, pos.z, 30);
    }
    pointAt(pos) {
        native.pointCamAtCoord(this.camera, pos.x, pos.y, pos.z);
    }
};
CameraModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [LoggerModule])
], CameraModule);

var InputType;
(function (InputType) {
    InputType[InputType["NEXT_CAMERA"] = 0] = "NEXT_CAMERA";
    InputType[InputType["LOOK_LR"] = 1] = "LOOK_LR";
    InputType[InputType["LOOK_UD"] = 2] = "LOOK_UD";
    InputType[InputType["LOOK_UP_ONLY"] = 3] = "LOOK_UP_ONLY";
    InputType[InputType["LOOK_DOWN_ONLY"] = 4] = "LOOK_DOWN_ONLY";
    InputType[InputType["LOOK_LEFT_ONLY"] = 5] = "LOOK_LEFT_ONLY";
    InputType[InputType["LOOK_RIGHT_ONLY"] = 6] = "LOOK_RIGHT_ONLY";
    InputType[InputType["CINEMATIC_SLOWMO"] = 7] = "CINEMATIC_SLOWMO";
    InputType[InputType["SCRIPTED_FLY_UD"] = 8] = "SCRIPTED_FLY_UD";
    InputType[InputType["SCRIPTED_FLY_LR"] = 9] = "SCRIPTED_FLY_LR";
    InputType[InputType["SCRIPTED_FLY_ZUP"] = 10] = "SCRIPTED_FLY_ZUP";
    InputType[InputType["SCRIPTED_FLY_ZDOWN"] = 11] = "SCRIPTED_FLY_ZDOWN";
    InputType[InputType["WEAPON_WHEEL_UD"] = 12] = "WEAPON_WHEEL_UD";
    InputType[InputType["WEAPON_WHEEL_LR"] = 13] = "WEAPON_WHEEL_LR";
    InputType[InputType["WEAPON_WHEEL_NEXT"] = 14] = "WEAPON_WHEEL_NEXT";
    InputType[InputType["WEAPON_WHEEL_PREV"] = 15] = "WEAPON_WHEEL_PREV";
    InputType[InputType["SELECT_NEXT_WEAPON"] = 16] = "SELECT_NEXT_WEAPON";
    InputType[InputType["SELECT_PREV_WEAPON"] = 17] = "SELECT_PREV_WEAPON";
    InputType[InputType["SKIP_CUTSCENE"] = 18] = "SKIP_CUTSCENE";
    InputType[InputType["CHARACTER_WHEEL"] = 19] = "CHARACTER_WHEEL";
    InputType[InputType["MULTIPLAYER_INFO"] = 20] = "MULTIPLAYER_INFO";
    InputType[InputType["SPRINT"] = 21] = "SPRINT";
    InputType[InputType["JUMP"] = 22] = "JUMP";
    InputType[InputType["ENTER"] = 23] = "ENTER";
    InputType[InputType["ATTACK"] = 24] = "ATTACK";
    InputType[InputType["AIM"] = 25] = "AIM";
    InputType[InputType["LOOK_BEHIND"] = 26] = "LOOK_BEHIND";
    InputType[InputType["PHONE"] = 27] = "PHONE";
    InputType[InputType["SPECIAL_ABILITY"] = 28] = "SPECIAL_ABILITY";
    InputType[InputType["SPECIAL_ABILITY_SECONDARY"] = 29] = "SPECIAL_ABILITY_SECONDARY";
    InputType[InputType["MOVE_LR"] = 30] = "MOVE_LR";
    InputType[InputType["MOVE_UD"] = 31] = "MOVE_UD";
    InputType[InputType["MOVE_UP_ONLY"] = 32] = "MOVE_UP_ONLY";
    InputType[InputType["MOVE_DOWN_ONLY"] = 33] = "MOVE_DOWN_ONLY";
    InputType[InputType["MOVE_LEFT_ONLY"] = 34] = "MOVE_LEFT_ONLY";
    InputType[InputType["MOVE_RIGHT_ONLY"] = 35] = "MOVE_RIGHT_ONLY";
    InputType[InputType["DUCK"] = 36] = "DUCK";
    InputType[InputType["SELECT_WEAPON"] = 37] = "SELECT_WEAPON";
    InputType[InputType["PICKUP"] = 38] = "PICKUP";
    InputType[InputType["SNIPER_ZOOM"] = 39] = "SNIPER_ZOOM";
    InputType[InputType["SNIPER_ZOOM_IN_ONLY"] = 40] = "SNIPER_ZOOM_IN_ONLY";
    InputType[InputType["SNIPER_ZOOM_OUT_ONLY"] = 41] = "SNIPER_ZOOM_OUT_ONLY";
    InputType[InputType["SNIPER_ZOOM_IN_SECONDARY"] = 42] = "SNIPER_ZOOM_IN_SECONDARY";
    InputType[InputType["SNIPER_ZOOM_OUT_SECONDARY"] = 43] = "SNIPER_ZOOM_OUT_SECONDARY";
    InputType[InputType["COVER"] = 44] = "COVER";
    InputType[InputType["RELOAD"] = 45] = "RELOAD";
    InputType[InputType["TALK"] = 46] = "TALK";
    InputType[InputType["DETONATE"] = 47] = "DETONATE";
    InputType[InputType["HUD_SPECIAL"] = 48] = "HUD_SPECIAL";
    InputType[InputType["ARREST"] = 49] = "ARREST";
    InputType[InputType["ACCURATE_AIM"] = 50] = "ACCURATE_AIM";
    InputType[InputType["CONTEXT"] = 51] = "CONTEXT";
    InputType[InputType["CONTEXT_SECONDARY"] = 52] = "CONTEXT_SECONDARY";
    InputType[InputType["WEAPON_SPECIAL"] = 53] = "WEAPON_SPECIAL";
    InputType[InputType["WEAPON_SPECIAL_TWO"] = 54] = "WEAPON_SPECIAL_TWO";
    InputType[InputType["DIVE"] = 55] = "DIVE";
    InputType[InputType["DROP_WEAPON"] = 56] = "DROP_WEAPON";
    InputType[InputType["DROP_AMMO"] = 57] = "DROP_AMMO";
    InputType[InputType["THROW_GRENADE"] = 58] = "THROW_GRENADE";
    InputType[InputType["VEH_MOVE_LR"] = 59] = "VEH_MOVE_LR";
    InputType[InputType["VEH_MOVE_UD"] = 60] = "VEH_MOVE_UD";
    InputType[InputType["VEH_MOVE_UP_ONLY"] = 61] = "VEH_MOVE_UP_ONLY";
    InputType[InputType["VEH_MOVE_DOWN_ONLY"] = 62] = "VEH_MOVE_DOWN_ONLY";
    InputType[InputType["VEH_MOVE_LEFT_ONLY"] = 63] = "VEH_MOVE_LEFT_ONLY";
    InputType[InputType["VEH_MOVE_RIGHT_ONLY"] = 64] = "VEH_MOVE_RIGHT_ONLY";
    InputType[InputType["VEH_SPECIAL"] = 65] = "VEH_SPECIAL";
    InputType[InputType["VEH_GUN_LR"] = 66] = "VEH_GUN_LR";
    InputType[InputType["VEH_GUN_UD"] = 67] = "VEH_GUN_UD";
    InputType[InputType["VEH_AIM"] = 68] = "VEH_AIM";
    InputType[InputType["VEH_ATTACK"] = 69] = "VEH_ATTACK";
    InputType[InputType["VEH_ATTACK2"] = 70] = "VEH_ATTACK2";
    InputType[InputType["VEH_ACCELERATE"] = 71] = "VEH_ACCELERATE";
    InputType[InputType["VEH_BRAKE"] = 72] = "VEH_BRAKE";
    InputType[InputType["VEH_DUCK"] = 73] = "VEH_DUCK";
    InputType[InputType["VEH_HEADLIGHT"] = 74] = "VEH_HEADLIGHT";
    InputType[InputType["VEH_EXIT"] = 75] = "VEH_EXIT";
    InputType[InputType["VEH_HANDBRAKE"] = 76] = "VEH_HANDBRAKE";
    InputType[InputType["VEH_HOTWIRE_LEFT"] = 77] = "VEH_HOTWIRE_LEFT";
    InputType[InputType["VEH_HOTWIRE_RIGHT"] = 78] = "VEH_HOTWIRE_RIGHT";
    InputType[InputType["VEH_LOOK_BEHIND"] = 79] = "VEH_LOOK_BEHIND";
    InputType[InputType["VEH_CIN_CAM"] = 80] = "VEH_CIN_CAM";
    InputType[InputType["VEH_NEXT_RADIO"] = 81] = "VEH_NEXT_RADIO";
    InputType[InputType["VEH_PREV_RADIO"] = 82] = "VEH_PREV_RADIO";
    InputType[InputType["VEH_NEXT_RADIO_TRACK"] = 83] = "VEH_NEXT_RADIO_TRACK";
    InputType[InputType["VEH_PREV_RADIO_TRACK"] = 84] = "VEH_PREV_RADIO_TRACK";
    InputType[InputType["VEH_RADIO_WHEEL"] = 85] = "VEH_RADIO_WHEEL";
    InputType[InputType["VEH_HORN"] = 86] = "VEH_HORN";
    InputType[InputType["VEH_FLY_THROTTLE_UP"] = 87] = "VEH_FLY_THROTTLE_UP";
    InputType[InputType["VEH_FLY_THROTTLE_DOWN"] = 88] = "VEH_FLY_THROTTLE_DOWN";
    InputType[InputType["VEH_FLY_YAW_LEFT"] = 89] = "VEH_FLY_YAW_LEFT";
    InputType[InputType["VEH_FLY_YAW_RIGHT"] = 90] = "VEH_FLY_YAW_RIGHT";
    InputType[InputType["VEH_PASSENGER_AIM"] = 91] = "VEH_PASSENGER_AIM";
    InputType[InputType["VEH_PASSENGER_ATTACK"] = 92] = "VEH_PASSENGER_ATTACK";
    InputType[InputType["VEH_SPECIAL_ABILITY_FRANKLIN"] = 93] = "VEH_SPECIAL_ABILITY_FRANKLIN";
    InputType[InputType["VEH_STUNT_UD"] = 94] = "VEH_STUNT_UD";
    InputType[InputType["VEH_CINEMATIC_UD"] = 95] = "VEH_CINEMATIC_UD";
    InputType[InputType["VEH_CINEMATIC_UP_ONLY"] = 96] = "VEH_CINEMATIC_UP_ONLY";
    InputType[InputType["VEH_CINEMATIC_DOWN_ONLY"] = 97] = "VEH_CINEMATIC_DOWN_ONLY";
    InputType[InputType["VEH_CINEMATIC_LR"] = 98] = "VEH_CINEMATIC_LR";
    InputType[InputType["VEH_SELECT_NEXT_WEAPON"] = 99] = "VEH_SELECT_NEXT_WEAPON";
    InputType[InputType["VEH_SELECT_PREV_WEAPON"] = 100] = "VEH_SELECT_PREV_WEAPON";
    InputType[InputType["VEH_ROOF"] = 101] = "VEH_ROOF";
    InputType[InputType["VEH_JUMP"] = 102] = "VEH_JUMP";
    InputType[InputType["VEH_GRAPPLING_HOOK"] = 103] = "VEH_GRAPPLING_HOOK";
    InputType[InputType["VEH_SHUFFLE"] = 104] = "VEH_SHUFFLE";
    InputType[InputType["VEH_DROP_PROJECTILE"] = 105] = "VEH_DROP_PROJECTILE";
    InputType[InputType["VEH_MOUSE_CONTROL_OVERRIDE"] = 106] = "VEH_MOUSE_CONTROL_OVERRIDE";
    InputType[InputType["VEH_FLY_ROLL_LR"] = 107] = "VEH_FLY_ROLL_LR";
    InputType[InputType["VEH_FLY_ROLL_LEFT_ONLY"] = 108] = "VEH_FLY_ROLL_LEFT_ONLY";
    InputType[InputType["VEH_FLY_ROLL_RIGHT_ONLY"] = 109] = "VEH_FLY_ROLL_RIGHT_ONLY";
    InputType[InputType["VEH_FLY_PITCH_UD"] = 110] = "VEH_FLY_PITCH_UD";
    InputType[InputType["VEH_FLY_PITCH_UP_ONLY"] = 111] = "VEH_FLY_PITCH_UP_ONLY";
    InputType[InputType["VEH_FLY_PITCH_DOWN_ONLY"] = 112] = "VEH_FLY_PITCH_DOWN_ONLY";
    InputType[InputType["VEH_FLY_UNDERCARRIAGE"] = 113] = "VEH_FLY_UNDERCARRIAGE";
    InputType[InputType["VEH_FLY_ATTACK"] = 114] = "VEH_FLY_ATTACK";
    InputType[InputType["VEH_FLY_SELECT_NEXT_WEAPON"] = 115] = "VEH_FLY_SELECT_NEXT_WEAPON";
    InputType[InputType["VEH_FLY_SELECT_PREV_WEAPON"] = 116] = "VEH_FLY_SELECT_PREV_WEAPON";
    InputType[InputType["VEH_FLY_SELECT_TARGET_LEFT"] = 117] = "VEH_FLY_SELECT_TARGET_LEFT";
    InputType[InputType["VEH_FLY_SELECT_TARGET_RIGHT"] = 118] = "VEH_FLY_SELECT_TARGET_RIGHT";
    InputType[InputType["VEH_FLY_VERTICAL_FLIGHT_MODE"] = 119] = "VEH_FLY_VERTICAL_FLIGHT_MODE";
    InputType[InputType["VEH_FLY_DUCK"] = 120] = "VEH_FLY_DUCK";
    InputType[InputType["VEH_FLY_ATTACK_CAMERA"] = 121] = "VEH_FLY_ATTACK_CAMERA";
    InputType[InputType["VEH_FLY_MOUSE_CONTROL_OVERRIDE"] = 122] = "VEH_FLY_MOUSE_CONTROL_OVERRIDE";
    InputType[InputType["VEH_SUB_TURN_LR"] = 123] = "VEH_SUB_TURN_LR";
    InputType[InputType["VEH_SUB_TURN_LEFT_ONLY"] = 124] = "VEH_SUB_TURN_LEFT_ONLY";
    InputType[InputType["VEH_SUB_TURN_RIGHT_ONLY"] = 125] = "VEH_SUB_TURN_RIGHT_ONLY";
    InputType[InputType["VEH_SUB_PITCH_UD"] = 126] = "VEH_SUB_PITCH_UD";
    InputType[InputType["VEH_SUB_PITCH_UP_ONLY"] = 127] = "VEH_SUB_PITCH_UP_ONLY";
    InputType[InputType["VEH_SUB_PITCH_DOWN_ONLY"] = 128] = "VEH_SUB_PITCH_DOWN_ONLY";
    InputType[InputType["VEH_SUB_THROTTLE_UP"] = 129] = "VEH_SUB_THROTTLE_UP";
    InputType[InputType["VEH_SUB_THROTTLE_DOWN"] = 130] = "VEH_SUB_THROTTLE_DOWN";
    InputType[InputType["VEH_SUB_ASCEND"] = 131] = "VEH_SUB_ASCEND";
    InputType[InputType["VEH_SUB_DESCEND"] = 132] = "VEH_SUB_DESCEND";
    InputType[InputType["VEH_SUB_TURN_HARD_LEFT"] = 133] = "VEH_SUB_TURN_HARD_LEFT";
    InputType[InputType["VEH_SUB_TURN_HARD_RIGHT"] = 134] = "VEH_SUB_TURN_HARD_RIGHT";
    InputType[InputType["VEH_SUB_MOUSE_CONTROL_OVERRIDE"] = 135] = "VEH_SUB_MOUSE_CONTROL_OVERRIDE";
    InputType[InputType["VEH_PUSHBIKE_PEDAL"] = 136] = "VEH_PUSHBIKE_PEDAL";
    InputType[InputType["VEH_PUSHBIKE_SPRINT"] = 137] = "VEH_PUSHBIKE_SPRINT";
    InputType[InputType["VEH_PUSHBIKE_FRONT_BRAKE"] = 138] = "VEH_PUSHBIKE_FRONT_BRAKE";
    InputType[InputType["VEH_PUSHBIKE_REAR_BRAKE"] = 139] = "VEH_PUSHBIKE_REAR_BRAKE";
    InputType[InputType["MELEE_ATTACK_LIGHT"] = 140] = "MELEE_ATTACK_LIGHT";
    InputType[InputType["MELEE_ATTACK_HEAVY"] = 141] = "MELEE_ATTACK_HEAVY";
    InputType[InputType["MELEE_ATTACK_ALTERNATE"] = 142] = "MELEE_ATTACK_ALTERNATE";
    InputType[InputType["MELEE_BLOCK"] = 143] = "MELEE_BLOCK";
    InputType[InputType["PARACHUTE_DEPLOY"] = 144] = "PARACHUTE_DEPLOY";
    InputType[InputType["PARACHUTE_DETACH"] = 145] = "PARACHUTE_DETACH";
    InputType[InputType["PARACHUTE_TURN_LR"] = 146] = "PARACHUTE_TURN_LR";
    InputType[InputType["PARACHUTE_TURN_LEFT_ONLY"] = 147] = "PARACHUTE_TURN_LEFT_ONLY";
    InputType[InputType["PARACHUTE_TURN_RIGHT_ONLY"] = 148] = "PARACHUTE_TURN_RIGHT_ONLY";
    InputType[InputType["PARACHUTE_PITCH_UD"] = 149] = "PARACHUTE_PITCH_UD";
    InputType[InputType["PARACHUTE_PITCH_UP_ONLY"] = 150] = "PARACHUTE_PITCH_UP_ONLY";
    InputType[InputType["PARACHUTE_PITCH_DOWN_ONLY"] = 151] = "PARACHUTE_PITCH_DOWN_ONLY";
    InputType[InputType["PARACHUTE_BRAKE_LEFT"] = 152] = "PARACHUTE_BRAKE_LEFT";
    InputType[InputType["PARACHUTE_BRAKE_RIGHT"] = 153] = "PARACHUTE_BRAKE_RIGHT";
    InputType[InputType["PARACHUTE_SMOKE"] = 154] = "PARACHUTE_SMOKE";
    InputType[InputType["PARACHUTE_PRECISION_LANDING"] = 155] = "PARACHUTE_PRECISION_LANDING";
    InputType[InputType["MAP"] = 156] = "MAP";
    InputType[InputType["SELECT_WEAPON_UNARMED"] = 157] = "SELECT_WEAPON_UNARMED";
    InputType[InputType["SELECT_WEAPON_MELEE"] = 158] = "SELECT_WEAPON_MELEE";
    InputType[InputType["SELECT_WEAPON_HANDGUN"] = 159] = "SELECT_WEAPON_HANDGUN";
    InputType[InputType["SELECT_WEAPON_SHOTGUN"] = 160] = "SELECT_WEAPON_SHOTGUN";
    InputType[InputType["SELECT_WEAPON_SMG"] = 161] = "SELECT_WEAPON_SMG";
    InputType[InputType["SELECT_WEAPON_AUTO_RIFLE"] = 162] = "SELECT_WEAPON_AUTO_RIFLE";
    InputType[InputType["SELECT_WEAPON_SNIPER"] = 163] = "SELECT_WEAPON_SNIPER";
    InputType[InputType["SELECT_WEAPON_HEAVY"] = 164] = "SELECT_WEAPON_HEAVY";
    InputType[InputType["SELECT_WEAPON_SPECIAL"] = 165] = "SELECT_WEAPON_SPECIAL";
    InputType[InputType["SELECT_CHARACTER_MICHAEL"] = 166] = "SELECT_CHARACTER_MICHAEL";
    InputType[InputType["SELECT_CHARACTER_FRANKLIN"] = 167] = "SELECT_CHARACTER_FRANKLIN";
    InputType[InputType["SELECT_CHARACTER_TREVOR"] = 168] = "SELECT_CHARACTER_TREVOR";
    InputType[InputType["SELECT_CHARACTER_MULTIPLAYER"] = 169] = "SELECT_CHARACTER_MULTIPLAYER";
    InputType[InputType["SAVE_REPLAY_CLIP"] = 170] = "SAVE_REPLAY_CLIP";
    InputType[InputType["SPECIAL_ABILITY_PC"] = 171] = "SPECIAL_ABILITY_PC";
    InputType[InputType["CELLPHONE_UP"] = 172] = "CELLPHONE_UP";
    InputType[InputType["CELLPHONE_DOWN"] = 173] = "CELLPHONE_DOWN";
    InputType[InputType["CELLPHONE_LEFT"] = 174] = "CELLPHONE_LEFT";
    InputType[InputType["CELLPHONE_RIGHT"] = 175] = "CELLPHONE_RIGHT";
    InputType[InputType["CELLPHONE_SELECT"] = 176] = "CELLPHONE_SELECT";
    InputType[InputType["CELLPHONE_CANCEL"] = 177] = "CELLPHONE_CANCEL";
    InputType[InputType["CELLPHONE_OPTION"] = 178] = "CELLPHONE_OPTION";
    InputType[InputType["CELLPHONE_EXTRA_OPTION"] = 179] = "CELLPHONE_EXTRA_OPTION";
    InputType[InputType["CELLPHONE_SCROLL_FORWARD"] = 180] = "CELLPHONE_SCROLL_FORWARD";
    InputType[InputType["CELLPHONE_SCROLL_BACKWARD"] = 181] = "CELLPHONE_SCROLL_BACKWARD";
    InputType[InputType["CELLPHONE_CAMERA_FOCUS_LOCK"] = 182] = "CELLPHONE_CAMERA_FOCUS_LOCK";
    InputType[InputType["CELLPHONE_CAMERA_GRID"] = 183] = "CELLPHONE_CAMERA_GRID";
    InputType[InputType["CELLPHONE_CAMERA_SELFIE"] = 184] = "CELLPHONE_CAMERA_SELFIE";
    InputType[InputType["CELLPHONE_CAMERA_DOF"] = 185] = "CELLPHONE_CAMERA_DOF";
    InputType[InputType["CELLPHONE_CAMERA_EXPRESSION"] = 186] = "CELLPHONE_CAMERA_EXPRESSION";
    InputType[InputType["FRONTEND_DOWN"] = 187] = "FRONTEND_DOWN";
    InputType[InputType["FRONTEND_UP"] = 188] = "FRONTEND_UP";
    InputType[InputType["FRONTEND_LEFT"] = 189] = "FRONTEND_LEFT";
    InputType[InputType["FRONTEND_RIGHT"] = 190] = "FRONTEND_RIGHT";
    InputType[InputType["FRONTEND_RDOWN"] = 191] = "FRONTEND_RDOWN";
    InputType[InputType["FRONTEND_RUP"] = 192] = "FRONTEND_RUP";
    InputType[InputType["FRONTEND_RLEFT"] = 193] = "FRONTEND_RLEFT";
    InputType[InputType["FRONTEND_RRIGHT"] = 194] = "FRONTEND_RRIGHT";
    InputType[InputType["FRONTEND_AXIS_X"] = 195] = "FRONTEND_AXIS_X";
    InputType[InputType["FRONTEND_AXIS_Y"] = 196] = "FRONTEND_AXIS_Y";
    InputType[InputType["FRONTEND_RIGHT_AXIS_X"] = 197] = "FRONTEND_RIGHT_AXIS_X";
    InputType[InputType["FRONTEND_RIGHT_AXIS_Y"] = 198] = "FRONTEND_RIGHT_AXIS_Y";
    InputType[InputType["FRONTEND_PAUSE"] = 199] = "FRONTEND_PAUSE";
    InputType[InputType["FRONTEND_PAUSE_ALTERNATE"] = 200] = "FRONTEND_PAUSE_ALTERNATE";
    InputType[InputType["FRONTEND_ACCEPT"] = 201] = "FRONTEND_ACCEPT";
    InputType[InputType["FRONTEND_CANCEL"] = 202] = "FRONTEND_CANCEL";
    InputType[InputType["FRONTEND_X"] = 203] = "FRONTEND_X";
    InputType[InputType["FRONTEND_Y"] = 204] = "FRONTEND_Y";
    InputType[InputType["FRONTEND_LB"] = 205] = "FRONTEND_LB";
    InputType[InputType["FRONTEND_RB"] = 206] = "FRONTEND_RB";
    InputType[InputType["FRONTEND_LT"] = 207] = "FRONTEND_LT";
    InputType[InputType["FRONTEND_RT"] = 208] = "FRONTEND_RT";
    InputType[InputType["FRONTEND_LS"] = 209] = "FRONTEND_LS";
    InputType[InputType["FRONTEND_RS"] = 210] = "FRONTEND_RS";
    InputType[InputType["FRONTEND_LEADERBOARD"] = 211] = "FRONTEND_LEADERBOARD";
    InputType[InputType["FRONTEND_SOCIAL_CLUB"] = 212] = "FRONTEND_SOCIAL_CLUB";
    InputType[InputType["FRONTEND_SOCIAL_CLUB_SECONDARY"] = 213] = "FRONTEND_SOCIAL_CLUB_SECONDARY";
    InputType[InputType["FRONTEND_DELETE"] = 214] = "FRONTEND_DELETE";
    InputType[InputType["FRONTEND_ENDSCREEN_ACCEPT"] = 215] = "FRONTEND_ENDSCREEN_ACCEPT";
    InputType[InputType["FRONTEND_ENDSCREEN_EXPAND"] = 216] = "FRONTEND_ENDSCREEN_EXPAND";
    InputType[InputType["FRONTEND_SELECT"] = 217] = "FRONTEND_SELECT";
    InputType[InputType["SCRIPT_LEFT_AXIS_X"] = 218] = "SCRIPT_LEFT_AXIS_X";
    InputType[InputType["SCRIPT_LEFT_AXIS_Y"] = 219] = "SCRIPT_LEFT_AXIS_Y";
    InputType[InputType["SCRIPT_RIGHT_AXIS_X"] = 220] = "SCRIPT_RIGHT_AXIS_X";
    InputType[InputType["SCRIPT_RIGHT_AXIS_Y"] = 221] = "SCRIPT_RIGHT_AXIS_Y";
    InputType[InputType["SCRIPT_RUP"] = 222] = "SCRIPT_RUP";
    InputType[InputType["SCRIPT_RDOWN"] = 223] = "SCRIPT_RDOWN";
    InputType[InputType["SCRIPT_RLEFT"] = 224] = "SCRIPT_RLEFT";
    InputType[InputType["SCRIPT_RRIGHT"] = 225] = "SCRIPT_RRIGHT";
    InputType[InputType["SCRIPT_LB"] = 226] = "SCRIPT_LB";
    InputType[InputType["SCRIPT_RB"] = 227] = "SCRIPT_RB";
    InputType[InputType["SCRIPT_LT"] = 228] = "SCRIPT_LT";
    InputType[InputType["SCRIPT_RT"] = 229] = "SCRIPT_RT";
    InputType[InputType["SCRIPT_LS"] = 230] = "SCRIPT_LS";
    InputType[InputType["SCRIPT_RS"] = 231] = "SCRIPT_RS";
    InputType[InputType["SCRIPT_PAD_UP"] = 232] = "SCRIPT_PAD_UP";
    InputType[InputType["SCRIPT_PAD_DOWN"] = 233] = "SCRIPT_PAD_DOWN";
    InputType[InputType["SCRIPT_PAD_LEFT"] = 234] = "SCRIPT_PAD_LEFT";
    InputType[InputType["SCRIPT_PAD_RIGHT"] = 235] = "SCRIPT_PAD_RIGHT";
    InputType[InputType["SCRIPT_SELECT"] = 236] = "SCRIPT_SELECT";
    InputType[InputType["CURSOR_ACCEPT"] = 237] = "CURSOR_ACCEPT";
    InputType[InputType["CURSOR_CANCEL"] = 238] = "CURSOR_CANCEL";
    InputType[InputType["CURSOR_X"] = 239] = "CURSOR_X";
    InputType[InputType["CURSOR_Y"] = 240] = "CURSOR_Y";
    InputType[InputType["CURSOR_SCROLL_UP"] = 241] = "CURSOR_SCROLL_UP";
    InputType[InputType["CURSOR_SCROLL_DOWN"] = 242] = "CURSOR_SCROLL_DOWN";
    InputType[InputType["ENTER_CHEAT_CODE"] = 243] = "ENTER_CHEAT_CODE";
    InputType[InputType["INTERACTION_MENU"] = 244] = "INTERACTION_MENU";
    InputType[InputType["MP_TEXT_CHAT_ALL"] = 245] = "MP_TEXT_CHAT_ALL";
    InputType[InputType["MP_TEXT_CHAT_TEAM"] = 246] = "MP_TEXT_CHAT_TEAM";
    InputType[InputType["MP_TEXT_CHAT_FRIENDS"] = 247] = "MP_TEXT_CHAT_FRIENDS";
    InputType[InputType["MP_TEXT_CHAT_CREW"] = 248] = "MP_TEXT_CHAT_CREW";
    InputType[InputType["PUSH_TO_TALK"] = 249] = "PUSH_TO_TALK";
    InputType[InputType["CREATOR_LS"] = 250] = "CREATOR_LS";
    InputType[InputType["CREATOR_RS"] = 251] = "CREATOR_RS";
    InputType[InputType["CREATOR_LT"] = 252] = "CREATOR_LT";
    InputType[InputType["CREATOR_RT"] = 253] = "CREATOR_RT";
    InputType[InputType["CREATOR_MENU_TOGGLE"] = 254] = "CREATOR_MENU_TOGGLE";
    InputType[InputType["CREATOR_ACCEPT"] = 255] = "CREATOR_ACCEPT";
    InputType[InputType["CREATOR_DELETE"] = 256] = "CREATOR_DELETE";
    InputType[InputType["ATTACK2"] = 257] = "ATTACK2";
    InputType[InputType["RAPPEL_JUMP"] = 258] = "RAPPEL_JUMP";
    InputType[InputType["RAPPEL_LONG_JUMP"] = 259] = "RAPPEL_LONG_JUMP";
    InputType[InputType["RAPPEL_SMASH_WINDOW"] = 260] = "RAPPEL_SMASH_WINDOW";
    InputType[InputType["PREV_WEAPON"] = 261] = "PREV_WEAPON";
    InputType[InputType["NEXT_WEAPON"] = 262] = "NEXT_WEAPON";
    InputType[InputType["MELEE_ATTACK1"] = 263] = "MELEE_ATTACK1";
    InputType[InputType["MELEE_ATTACK2"] = 264] = "MELEE_ATTACK2";
    InputType[InputType["WHISTLE"] = 265] = "WHISTLE";
    InputType[InputType["MOVE_LEFT"] = 266] = "MOVE_LEFT";
    InputType[InputType["MOVE_RIGHT"] = 267] = "MOVE_RIGHT";
    InputType[InputType["MOVE_UP"] = 268] = "MOVE_UP";
    InputType[InputType["MOVE_DOWN"] = 269] = "MOVE_DOWN";
    InputType[InputType["LOOK_LEFT"] = 270] = "LOOK_LEFT";
    InputType[InputType["LOOK_RIGHT"] = 271] = "LOOK_RIGHT";
    InputType[InputType["LOOK_UP"] = 272] = "LOOK_UP";
    InputType[InputType["LOOK_DOWN"] = 273] = "LOOK_DOWN";
    InputType[InputType["SNIPER_ZOOM_IN"] = 274] = "SNIPER_ZOOM_IN";
    InputType[InputType["SNIPER_ZOOM_OUT"] = 275] = "SNIPER_ZOOM_OUT";
    InputType[InputType["SNIPER_ZOOM_IN_ALTERNATE"] = 276] = "SNIPER_ZOOM_IN_ALTERNATE";
    InputType[InputType["SNIPER_ZOOM_OUT_ALTERNATE"] = 277] = "SNIPER_ZOOM_OUT_ALTERNATE";
    InputType[InputType["VEH_MOVE_LEFT"] = 278] = "VEH_MOVE_LEFT";
    InputType[InputType["VEH_MOVE_RIGHT"] = 279] = "VEH_MOVE_RIGHT";
    InputType[InputType["VEH_MOVE_UP"] = 280] = "VEH_MOVE_UP";
    InputType[InputType["VEH_MOVE_DOWN"] = 281] = "VEH_MOVE_DOWN";
    InputType[InputType["VEH_GUN_LEFT"] = 282] = "VEH_GUN_LEFT";
    InputType[InputType["VEH_GUN_RIGHT"] = 283] = "VEH_GUN_RIGHT";
    InputType[InputType["VEH_GUN_UP"] = 284] = "VEH_GUN_UP";
    InputType[InputType["VEH_GUN_DOWN"] = 285] = "VEH_GUN_DOWN";
    InputType[InputType["VEH_LOOK_LEFT"] = 286] = "VEH_LOOK_LEFT";
    InputType[InputType["VEH_LOOK_RIGHT"] = 287] = "VEH_LOOK_RIGHT";
    InputType[InputType["REPLAY_START_STOP_RECORDING"] = 288] = "REPLAY_START_STOP_RECORDING";
    InputType[InputType["REPLAY_START_STOP_RECORDING_SECONDARY"] = 289] = "REPLAY_START_STOP_RECORDING_SECONDARY";
    InputType[InputType["SCALED_LOOK_LR"] = 290] = "SCALED_LOOK_LR";
    InputType[InputType["SCALED_LOOK_UD"] = 291] = "SCALED_LOOK_UD";
    InputType[InputType["SCALED_LOOK_UP_ONLY"] = 292] = "SCALED_LOOK_UP_ONLY";
    InputType[InputType["SCALED_LOOK_DOWN_ONLY"] = 293] = "SCALED_LOOK_DOWN_ONLY";
    InputType[InputType["SCALED_LOOK_LEFT_ONLY"] = 294] = "SCALED_LOOK_LEFT_ONLY";
    InputType[InputType["SCALED_LOOK_RIGHT_ONLY"] = 295] = "SCALED_LOOK_RIGHT_ONLY";
    InputType[InputType["REPLAY_MARKER_DELETE"] = 296] = "REPLAY_MARKER_DELETE";
    InputType[InputType["REPLAY_CLIP_DELETE"] = 297] = "REPLAY_CLIP_DELETE";
    InputType[InputType["REPLAY_PAUSE"] = 298] = "REPLAY_PAUSE";
    InputType[InputType["REPLAY_REWIND"] = 299] = "REPLAY_REWIND";
    InputType[InputType["REPLAY_FFWD"] = 300] = "REPLAY_FFWD";
    InputType[InputType["REPLAY_NEWMARKER"] = 301] = "REPLAY_NEWMARKER";
    InputType[InputType["REPLAY_RECORD"] = 302] = "REPLAY_RECORD";
    InputType[InputType["REPLAY_SCREENSHOT"] = 303] = "REPLAY_SCREENSHOT";
    InputType[InputType["REPLAY_HIDEHUD"] = 304] = "REPLAY_HIDEHUD";
    InputType[InputType["REPLAY_STARTPOINT"] = 305] = "REPLAY_STARTPOINT";
    InputType[InputType["REPLAY_ENDPOINT"] = 306] = "REPLAY_ENDPOINT";
    InputType[InputType["REPLAY_ADVANCE"] = 307] = "REPLAY_ADVANCE";
    InputType[InputType["REPLAY_BACK"] = 308] = "REPLAY_BACK";
    InputType[InputType["REPLAY_TOOLS"] = 309] = "REPLAY_TOOLS";
    InputType[InputType["REPLAY_RESTART"] = 310] = "REPLAY_RESTART";
    InputType[InputType["REPLAY_SHOWHOTKEY"] = 311] = "REPLAY_SHOWHOTKEY";
    InputType[InputType["REPLAY_CYCLEMARKERLEFT"] = 312] = "REPLAY_CYCLEMARKERLEFT";
    InputType[InputType["REPLAY_CYCLEMARKERRIGHT"] = 313] = "REPLAY_CYCLEMARKERRIGHT";
    InputType[InputType["REPLAY_FOVINCREASE"] = 314] = "REPLAY_FOVINCREASE";
    InputType[InputType["REPLAY_FOVDECREASE"] = 315] = "REPLAY_FOVDECREASE";
    InputType[InputType["REPLAY_CAMERAUP"] = 316] = "REPLAY_CAMERAUP";
    InputType[InputType["REPLAY_CAMERADOWN"] = 317] = "REPLAY_CAMERADOWN";
    InputType[InputType["REPLAY_SAVE"] = 318] = "REPLAY_SAVE";
    InputType[InputType["REPLAY_TOGGLETIME"] = 319] = "REPLAY_TOGGLETIME";
    InputType[InputType["REPLAY_TOGGLETIPS"] = 320] = "REPLAY_TOGGLETIPS";
    InputType[InputType["REPLAY_PREVIEW"] = 321] = "REPLAY_PREVIEW";
    InputType[InputType["REPLAY_TOGGLE_TIMELINE"] = 322] = "REPLAY_TOGGLE_TIMELINE";
    InputType[InputType["REPLAY_TIMELINE_PICKUP_CLIP"] = 323] = "REPLAY_TIMELINE_PICKUP_CLIP";
    InputType[InputType["REPLAY_TIMELINE_DUPLICATE_CLIP"] = 324] = "REPLAY_TIMELINE_DUPLICATE_CLIP";
    InputType[InputType["REPLAY_TIMELINE_PLACE_CLIP"] = 325] = "REPLAY_TIMELINE_PLACE_CLIP";
    InputType[InputType["REPLAY_CTRL"] = 326] = "REPLAY_CTRL";
    InputType[InputType["REPLAY_TIMELINE_SAVE"] = 327] = "REPLAY_TIMELINE_SAVE";
    InputType[InputType["REPLAY_PREVIEW_AUDIO"] = 328] = "REPLAY_PREVIEW_AUDIO";
    InputType[InputType["VEH_DRIVE_LOOK"] = 329] = "VEH_DRIVE_LOOK";
    InputType[InputType["VEH_DRIVE_LOOK2"] = 330] = "VEH_DRIVE_LOOK2";
    InputType[InputType["VEH_FLY_ATTACK2"] = 331] = "VEH_FLY_ATTACK2";
    InputType[InputType["RADIO_WHEEL_UD"] = 332] = "RADIO_WHEEL_UD";
    InputType[InputType["RADIO_WHEEL_LR"] = 333] = "RADIO_WHEEL_LR";
    InputType[InputType["VEH_SLOWMO_UD"] = 334] = "VEH_SLOWMO_UD";
    InputType[InputType["VEH_SLOWMO_UP_ONLY"] = 335] = "VEH_SLOWMO_UP_ONLY";
    InputType[InputType["VEH_SLOWMO_DOWN_ONLY"] = 336] = "VEH_SLOWMO_DOWN_ONLY";
    InputType[InputType["VEH_HYDRAULICS_CONTROL_TOGGLE"] = 337] = "VEH_HYDRAULICS_CONTROL_TOGGLE";
    InputType[InputType["VEH_HYDRAULICS_CONTROL_LEFT"] = 338] = "VEH_HYDRAULICS_CONTROL_LEFT";
    InputType[InputType["VEH_HYDRAULICS_CONTROL_RIGHT"] = 339] = "VEH_HYDRAULICS_CONTROL_RIGHT";
    InputType[InputType["VEH_HYDRAULICS_CONTROL_UP"] = 340] = "VEH_HYDRAULICS_CONTROL_UP";
    InputType[InputType["VEH_HYDRAULICS_CONTROL_DOWN"] = 341] = "VEH_HYDRAULICS_CONTROL_DOWN";
    InputType[InputType["VEH_HYDRAULICS_CONTROL_UD"] = 342] = "VEH_HYDRAULICS_CONTROL_UD";
    InputType[InputType["VEH_HYDRAULICS_CONTROL_LR"] = 343] = "VEH_HYDRAULICS_CONTROL_LR";
    InputType[InputType["SWITCH_VISOR"] = 344] = "SWITCH_VISOR";
    InputType[InputType["VEH_MELEE_HOLD"] = 345] = "VEH_MELEE_HOLD";
    InputType[InputType["VEH_MELEE_LEFT"] = 346] = "VEH_MELEE_LEFT";
    InputType[InputType["VEH_MELEE_RIGHT"] = 347] = "VEH_MELEE_RIGHT";
    InputType[InputType["MAP_POI"] = 348] = "MAP_POI";
    InputType[InputType["REPLAY_SNAPMATIC_PHOTO"] = 349] = "REPLAY_SNAPMATIC_PHOTO";
    InputType[InputType["VEH_CAR_JUMP"] = 350] = "VEH_CAR_JUMP";
    InputType[InputType["VEH_ROCKET_BOOST"] = 351] = "VEH_ROCKET_BOOST";
    InputType[InputType["VEH_FLY_BOOST"] = 352] = "VEH_FLY_BOOST";
    InputType[InputType["VEH_PARACHUTE"] = 353] = "VEH_PARACHUTE";
    InputType[InputType["VEH_BIKE_WINGS"] = 354] = "VEH_BIKE_WINGS";
    InputType[InputType["VEH_FLY_BOMB_BAY"] = 355] = "VEH_FLY_BOMB_BAY";
    InputType[InputType["VEH_FLY_COUNTER"] = 356] = "VEH_FLY_COUNTER";
    InputType[InputType["VEH_TRANSFORM"] = 357] = "VEH_TRANSFORM";
})(InputType || (InputType = {}));

let Player = class Player extends alt.Player {
    update;
    event;
    logger;
    directions = [0, 45, 90, 135, 180, 225, 270, 315, 360];
    directionNames = ["N", "NW", "W", "SW", "S", "SO", "O", "NO", "N"];
    directionNamesLong = ["Nördlich", "Nord-westlich", "Westlich", "Süd-westlich", "Südlich", "Süd-westlich", "Östlich", "Nord-östlich", "Nördlich"];
    oldStreet = null;
    oldDirection = null;
    oldHealth = null;
    oldArmour = null;
    isInInterior = false;
    set setIsInInterior(isInInterior) {
        this.isInInterior = isInInterior;
    }
    get getIsInInterior() {
        return this.isInInterior;
    }
    set setIsChatting(state) {
        this.isChatting = state;
    }
    ;
    get getIsChatting() {
        return this.isChatting;
    }
    ;
    set setIsInventoryOpen(state) {
        this.isInventoryOpen = state;
        this.event.emitServer("player:setinventorystate", this.isInventoryOpen);
    }
    get getIsInventoryOpen() {
        return this.isInventoryOpen;
    }
    set setIsPhoneOpen(state) {
        this.isPhoneOpen = state;
        this.event.emitServer("player:setphonestate", this.isPhoneOpen);
    }
    get getIsPhoneOpen() {
        return this.isPhoneOpen;
    }
    set setIsAnyTextFieldFocused(state) {
        this.isAnyTextFieldFocused = state;
        this.blockGameControls(state);
    }
    get getIsAnyTextFieldFocused() {
        return this.isAnyTextFieldFocused || this.isChatting;
    }
    get getIsAnyTextOpen() {
        return this.isAnyTextFieldFocused || this.isChatting || this.isAnyMenuOpen;
    }
    get getIsCursorVisible() {
        return this.isCursorVisible;
    }
    set setIsAnyMenuOpen(state) {
        this.isAnyMenuOpen = state;
    }
    get getIsAnyMenuOpen() {
        return this.isAnyMenuOpen || this.getIsInventoryOpen;
    }
    characterId;
    isFreezed;
    adminFreezed;
    isCrouched;
    isSpawnedCharacter;
    isAduty;
    isDuty;
    isInAPrison;
    isInHouse;
    isControlsEnabled = true;
    hasInteractionOpen;
    isInvBlocked;
    isCursorVisible;
    isChatting;
    isInventoryOpen;
    isPhoneOpen;
    isAnyTextFieldFocused;
    isAnyMenuOpen;
    cameraLocked = true;
    escBlocked = false;
    constructor(update, event, logger) {
        super();
        this.update = update;
        this.event = event;
        this.logger = logger;
        this.update.add(() => this.tick());
    }
    setVisible(state) {
        native.setEntityVisible(alt.Player.local.scriptID, state, false);
    }
    showCursor() {
        if (this.isCursorVisible)
            return;
        alt.showCursor(true);
        const [, x, y] = native.getActiveScreenResolution(0, 0);
        const pos = new alt.Vector3(x * 0.5, y * 0.5, 0);
        alt.setCursorPos(pos);
        this.isCursorVisible = true;
    }
    hideCursor(force = false) {
        if (!force) {
            if (!this.isCursorVisible || this.getIsInventoryOpen || this.getIsPhoneOpen || this.getIsAnyMenuOpen) {
                return;
            }
        }
        alt.showCursor(false);
        this.isCursorVisible = false;
    }
    blurScreen(time = 0) {
        native.triggerScreenblurFadeIn(time);
        const int = alt.setInterval(() => {
            if (!native.isScreenblurFadeRunning()) {
                native.triggerScreenblurFadeIn(time);
                alt.clearInterval(int);
            }
        }, 1);
    }
    unblurScreen(time = 0) {
        native.triggerScreenblurFadeOut(time);
        const int = alt.setInterval(() => {
            if (!native.isScreenblurFadeRunning()) {
                native.triggerScreenblurFadeOut(time);
                alt.clearInterval(int);
            }
        }, 1);
    }
    fadeOut(time = 0) {
        native.doScreenFadeOut(time);
        alt.setTimeout(() => {
            this.event.emitGui("screen:disable");
        }, time);
    }
    fadeIn(time = 0) {
        native.doScreenFadeIn(time);
        alt.setTimeout(() => {
            this.event.emitGui("screen:enable");
        }, time * 0.9);
    }
    showRadarAndHud(force = false) {
        if (alt.Player.local.vehicle !== null || this.isAduty || force) {
            this.event.emitGui("hud:moveup");
            native.displayRadar(true);
        }
        native.displayHud(true);
    }
    hideRadarAndHud(force = false) {
        if (this.isAduty && !force
            || alt.Player.local.vehicle !== null && !force) {
            return;
        }
        native.displayRadar(false);
        native.displayHud(false);
    }
    showHud() {
        native.displayHud(true);
        this.event.emitGui("hud:toggleui", true);
    }
    hideHud() {
        native.displayHud(false);
    }
    showRadar() {
        this.event.emitGui("hud:moveup");
        native.displayRadar(true);
    }
    hideRadar() {
        if (this.isAduty || alt.Player.local.vehicle !== null) {
            return;
        }
        native.displayRadar(false);
        this.event.emitGui("hud:movedown");
    }
    blockGameControls(state) {
        if (!state && this.getIsAnyTextOpen) {
            return;
        }
        this.isControlsEnabled = !state;
        alt.toggleGameControls(!state);
    }
    lockCamera(state, force = false) {
        if (!force) {
            if (!state && (this.getIsInventoryOpen || this.getIsPhoneOpen)) {
                return;
            }
        }
        this.cameraLocked = state;
    }
    blockESC(state) {
        if (!state && (this.getIsInventoryOpen || this.getIsPhoneOpen)) {
            return;
        }
        this.escBlocked = state;
    }
    freeze(administrative = false) {
        this.isFreezed = true;
        if (!administrative && this.adminFreezed) {
            return;
        }
        if (administrative) {
            this.adminFreezed = true;
        }
        alt.toggleGameControls(false);
        native.freezeEntityPosition(alt.Player.local.scriptID, true);
        if (alt.Player.local.vehicle) {
            native.freezeEntityPosition(alt.Player.local.vehicle.scriptID, true);
        }
    }
    unfreeze(administrative = false) {
        this.isFreezed = false;
        if (!administrative && this.adminFreezed) {
            return;
        }
        if (administrative) {
            this.adminFreezed = false;
        }
        alt.toggleGameControls(true);
        native.freezeEntityPosition(alt.Player.local.scriptID, false);
        if (alt.Player.local.vehicle) {
            native.freezeEntityPosition(alt.Player.local.vehicle.scriptID, false);
        }
    }
    switchOut() {
        native.freezeEntityPosition(alt.Player.local.scriptID, true);
        native.switchOutPlayer(alt.Player.local.scriptID, 0, 1);
    }
    switchIn() {
        native.switchInPlayer(alt.Player.local.scriptID);
        native.freezeEntityPosition(alt.Player.local.scriptID, true);
    }
    getBoneIndex(boneID) {
        return native.getPedBoneIndex(alt.Player.local.scriptID, boneID);
    }
    loadPlayerHead() {
        return new Promise(resolve => {
            const interval = alt.setInterval(() => {
                if (native.isPedheadshotReady(this.scriptID) && native.isPedheadshotValid(this.scriptID)) {
                    alt.clearInterval(interval);
                    return resolve(native.getPedheadshotTxdString(this.scriptID));
                }
            }, 0);
        });
    }
    showLoginCam() {
        const camera = instance.resolve(CameraModule);
        camera.createCamera(new alt.Vector3(-102, -1315, 60), new alt.Vector3(0, 0, 208));
        native.setEntityCoords(alt.Player.local.scriptID, -124.1021, -1298.052, 29.37553, false, false, false, false);
    }
    updatePositionInHUD(force = false) {
        const getStreet = native.getStreetNameAtCoord(alt.Player.local.pos.x, alt.Player.local.pos.y, alt.Player.local.pos.z, 0, 0);
        const streetName = native.getStreetNameFromHashKey(getStreet[1]);
        const crossingStreetName = native.getStreetNameFromHashKey(getStreet[2]);
        const zone = native.getLabelText(native.getNameOfZone(alt.Player.local.pos.x, alt.Player.local.pos.y, alt.Player.local.pos.z));
        let direction = null;
        for (let index = 0; index < this.directions.length; index++) {
            const element = this.directions[index];
            const heading = native.getEntityHeading(alt.Player.local.scriptID);
            if (Math.abs(heading - element) < 22.5) {
                direction = this.directionNamesLong[index];
            }
        }
        if (force || this.oldStreet !== streetName || this.oldDirection !== direction) {
            this.oldDirection = direction;
            this.oldStreet = streetName;
            this.event.emitGui("hud:sendposition", zone, direction, streetName, crossingStreetName);
        }
    }
    updateHealthInHUD(force = false) {
        if (force
            || this.oldHealth != alt.Player.local.health
            || this.oldArmour != alt.Player.local.armour) {
            this.oldHealth = alt.Player.local.health;
            this.oldArmour = alt.Player.local.armour;
            this.event.emitGui("hud:updatehealth", this.oldHealth, this.oldArmour);
        }
    }
    clearTasksImmediately() {
        native.clearPedTasksImmediately(alt.Player.local.scriptID);
    }
    tick() {
        if (this.cameraLocked) {
            native.disableControlAction(0, InputType.LOOK_LR, true);
            native.disableControlAction(0, InputType.LOOK_UD, true);
        }
        if (this.isCursorVisible) {
            native.disableControlAction(0, InputType.LOOK_LR, true);
            native.disableControlAction(0, InputType.LOOK_UD, true);
            native.disableControlAction(0, InputType.SCRIPT_RIGHT_AXIS_X, true);
            native.disableControlAction(0, InputType.SCRIPT_RIGHT_AXIS_Y, true);
            native.disableControlAction(0, InputType.WEAPON_WHEEL_NEXT, true);
            native.disableControlAction(0, InputType.WEAPON_WHEEL_PREV, true);
            native.disableControlAction(0, InputType.SELECT_NEXT_WEAPON, true);
            native.disableControlAction(0, InputType.SELECT_PREV_WEAPON, true);
            native.disableControlAction(0, InputType.SELECT_WEAPON, true);
            native.disableControlAction(0, InputType.NEXT_WEAPON, true);
            native.disableControlAction(0, InputType.PREV_WEAPON, true);
            native.disableControlAction(0, InputType.AIM, true);
            native.disableControlAction(0, InputType.ATTACK, true);
            native.disableControlAction(0, InputType.ATTACK2, true);
            native.disableControlAction(0, InputType.MELEE_ATTACK_LIGHT, true);
            native.disableControlAction(0, InputType.MELEE_ATTACK_HEAVY, true);
            native.disableControlAction(0, InputType.MELEE_ATTACK_ALTERNATE, true);
            native.disableControlAction(0, InputType.RADIO_WHEEL_LR, true);
            native.disableControlAction(0, InputType.RADIO_WHEEL_UD, true);
            native.disableControlAction(0, InputType.VEH_NEXT_RADIO_TRACK, true);
            native.disableControlAction(0, InputType.VEH_PREV_RADIO_TRACK, true);
            native.disableControlAction(0, InputType.VEH_RADIO_WHEEL, true);
            native.disableControlAction(0, InputType.ENTER, true);
            native.disableControlAction(0, InputType.VEH_EXIT, true);
        }
        native.setPedCanSwitchWeapon(alt.Player.local.scriptID, !this.isCursorVisible);
        if (this.escBlocked) {
            native.disableControlAction(0, InputType.FRONTEND_PAUSE, true);
            native.disableControlAction(0, InputType.FRONTEND_PAUSE_ALTERNATE, true);
        }
    }
};
Player = __decorate([
    PrototypeFor(alt.Player),
    singleton(),
    __metadata("design:paramtypes", [UpdateModule,
        EventModule,
        LoggerModule])
], Player);

let GuiModule = class GuiModule {
    logger;
    event;
    player;
    webview = undefined;
    constructor(logger, event, player) {
        this.logger = logger;
        this.event = event;
        this.player = player;
    }
    createView(url) {
        this.webview = new WebView(url, true);
        this.webview.on("gui:ready", () => {
            alt__default.setTimeout(() => {
                this.event.emit("gui:ready");
                this.logger.info("WebViewModule: GUI is ready to use.");
            }, 100);
        });
        this.logger.info("WebViewModule: Create single-instance of south central ui.");
    }
    focusView() {
        this.webview.focus();
    }
    unfocusView(force = false) {
        if (!force) {
            if (this.player.getIsInventoryOpen || this.player.getIsPhoneOpen || this.player.getIsAnyMenuOpen) {
                return;
            }
        }
        this.webview.unfocus();
    }
    guiEmit(name, ...args) {
        this.webview.emit(name, ...args);
    }
    guiOn(name, callback) {
        this.webview.on(name, callback);
    }
};
GuiModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [LoggerModule,
        EventModule,
        Player])
], GuiModule);

/**
 * Helper for adding events to meta data
 *
 * @param target
 * @param {string} type
 * @param {string} name
 * @param {string} propertyKey
 */
function validateEventExistsAndPush(target, type, name, propertyKey) {
    let eventName = name || propertyKey;
    const convertToEventName = instance.resolve('convertToEventName');
    eventName = convertToEventName(eventName);
    if (!Reflection.hasMetadata('events', target.constructor)) {
        Reflection.defineMetadata('events', [], target.constructor);
    }
    const events = Reflection.getMetadata('events', target.constructor);
    events.push({
        type,
        name: eventName,
        method: propertyKey
    });
    Reflection.defineMetadata('events', events, target.constructor);
}
/**
 * Add on event listener
 *
 * @param {string} name
 * @returns {MethodDecorator}
 */
const on = (name) => {
    return (target, propertyKey) => {
        validateEventExistsAndPush(target, 'on', name, propertyKey);
    };
};
/**
 * Add onServer event listener
 *
 * @param {string} name
 * @returns {MethodDecorator}
 */
const onServer = (name) => {
    return (target, propertyKey) => {
        validateEventExistsAndPush(target, 'onServer', name, propertyKey);
    };
};
/**
 * Add onGui event listener
 *
 * @param {string} name
 * @returns {MethodDecorator}
 */
const onGui = (name) => {
    return (target, propertyKey) => {
        validateEventExistsAndPush(target, 'onGui', name, propertyKey);
    };
};

/**
 * Provide the ability to use method decorators
 *
 * @returns {ClassDecorator}
 * @constructor
 */
const foundation = () => {
    return function (target) {
        let currentInstance = instance.resolve(target);
        addEvents(target, currentInstance);
        addKeyEvents(target, currentInstance);
    };
};
/**
 * Register event listener as decorator
 *
 * @param target
 * @param currentInstance
 */
function addEvents(target, currentInstance) {
    if (Reflection.hasMetadata('events', target)) {
        let eventModule = instance.resolve('EventModule');
        let events = Reflection.getMetadata('events', target) || [];
        events.forEach((event) => {
            eventModule.listener(event.type, event.name, currentInstance[event.method].bind(currentInstance));
        });
    }
}
/**
 * Add key events
 *
 * @param target
 * @param currentInstance
 */
function addKeyEvents(target, currentInstance) {
    if (Reflection.hasMetadata('keyup', target) || Reflection.hasMetadata('keydown', target)) {
        let keyEventModule = instance.resolve('KeyEventModule');
        let keyupEvents = Reflection.getMetadata('keyup', target) || [];
        let keydownEvents = Reflection.getMetadata('keydown', target) || [];
        keyupEvents.forEach((keyup) => {
            keyEventModule.keyup(keyup.key, currentInstance[keyup.callback].bind(currentInstance));
        });
        keydownEvents.forEach((keydown) => {
            keyEventModule.keydown(keydown.key, currentInstance[keydown.callback].bind(currentInstance));
        });
    }
}

var LoadingSpinnerType;
(function (LoadingSpinnerType) {
    LoadingSpinnerType[LoadingSpinnerType["CLOCKWISE1"] = 1] = "CLOCKWISE1";
    LoadingSpinnerType[LoadingSpinnerType["CLOCKWISE2"] = 2] = "CLOCKWISE2";
    LoadingSpinnerType[LoadingSpinnerType["CLOCKWISE3"] = 3] = "CLOCKWISE3";
    LoadingSpinnerType[LoadingSpinnerType["SOCIAL_CLUB_SAVING"] = 4] = "SOCIAL_CLUB_SAVING";
    LoadingSpinnerType[LoadingSpinnerType["REGULAR_CLOCKWISE"] = 5] = "REGULAR_CLOCKWISE";
})(LoadingSpinnerType || (LoadingSpinnerType = {}));

let LoadingSpinnerModule = class LoadingSpinnerModule {
    get isActive() {
        return native.busyspinnerIsOn();
    }
    show(loadingText = null, spinnerType = LoadingSpinnerType.REGULAR_CLOCKWISE) {
        this.hide();
        if (loadingText == null) {
            native.beginTextCommandBusyspinnerOn("");
        }
        else {
            native.beginTextCommandBusyspinnerOn("STRING");
            native.addTextComponentSubstringPlayerName(loadingText);
        }
        native.endTextCommandBusyspinnerOn(spinnerType);
    }
    hide() {
        if (this.isActive) {
            const int = alt.setInterval(() => {
                if (native.busyspinnerIsDisplaying()) {
                    native.busyspinnerOff();
                    alt.clearInterval(int);
                }
            }, 1);
        }
    }
};
LoadingSpinnerModule = __decorate([
    singleton()
], LoadingSpinnerModule);

let SessionHandler = class SessionHandler {
    player;
    camera;
    gui;
    spinner;
    logger;
    constructor(player, camera, gui, spinner, logger) {
        this.player = player;
        this.camera = camera;
        this.gui = gui;
        this.spinner = spinner;
        this.logger = logger;
    }
    onPlayerDisconnect() {
        this.player.fadeOut(0);
        this.camera.destroyCamera();
        native.destroyAllCams(true);
    }
    onPlayerConnectionComplete() {
        this.player.fadeOut(0);
        this.player.blurScreen(0);
        this.player.hideRadarAndHud();
        this.player.setVisible(false);
        this.player.freeze();
        this.player.showLoginCam();
        native.setClockTime(12, 0, 0);
        native.replaceHudColourWithRgba(143, 231, 76, 60, 255);
        native.replaceHudColourWithRgba(116, 231, 76, 60, 255);
        this.logger.info("Connection completed got called.");
        this.loadIpls();
    }
    loadIpls() {
        alt.requestIpl("facelobby");
        alt.requestIpl("v_tunnel_hole");
        alt.requestIpl("v_tunnel_hole_lod");
        native.activateInteriorEntitySet(native.getInteriorAtCoordsWithType(-38.62, -1099.01, 27.31, "v_carshowroom"), "csr_beforeMission");
        native.activateInteriorEntitySet(native.getInteriorAtCoordsWithType(-38.62, -1099.01, 27.31, "v_carshowroom"), "shutter_closed");
        alt.requestIpl('ex_dt1_02_office_02b');
        alt.requestIpl('chop_props');
        alt.requestIpl('FIBlobby');
        alt.removeIpl('FIBlobbyfake');
        alt.requestIpl('FBI_colPLUG');
        alt.requestIpl('FBI_repair');
        alt.requestIpl('v_tunnel_hole');
        alt.requestIpl('TrevorsMP');
        alt.requestIpl('TrevorsTrailer');
        alt.requestIpl('TrevorsTrailerTidy');
        alt.removeIpl('farmint');
        alt.removeIpl('farm_burnt');
        alt.removeIpl('farm_burnt_props');
        alt.removeIpl('des_farmhs_endimap');
        alt.removeIpl('des_farmhs_end_occl');
        alt.requestIpl('farm');
        alt.requestIpl('farm_props');
        alt.requestIpl('farm_int');
        alt.requestIpl('facelobby');
        alt.removeIpl('CS1_02_cf_offmission');
        alt.requestIpl('CS1_02_cf_onmission1');
        alt.requestIpl('CS1_02_cf_onmission2');
        alt.requestIpl('CS1_02_cf_onmission3');
        alt.requestIpl('CS1_02_cf_onmission4');
        alt.requestIpl('v_rockclub');
        alt.requestIpl('v_janitor');
        alt.removeIpl('hei_bi_hw1_13_door');
        alt.requestIpl('bkr_bi_hw1_13_int');
        alt.removeIpl('v_carshowroom');
        alt.removeIpl('shutter_open');
        alt.removeIpl('shutter_closed');
        alt.removeIpl('shr_int');
        alt.requestIpl('csr_afterMission');
        alt.requestIpl('v_carshowroom');
        alt.requestIpl('shr_int');
        alt.requestIpl('shutter_closed');
        alt.requestIpl('smboat');
        alt.requestIpl('smboat_distantlights');
        alt.requestIpl('smboat_lod');
        alt.requestIpl('smboat_lodlights');
        alt.requestIpl('cargoship');
        alt.requestIpl('railing_start');
        alt.removeIpl('sp1_10_fake_interior');
        alt.removeIpl('sp1_10_fake_interior_lod');
        alt.requestIpl('sp1_10_real_interior');
        alt.requestIpl('sp1_10_real_interior_lod');
        alt.removeIpl('id2_14_during_door');
        alt.removeIpl('id2_14_during1');
        alt.removeIpl('id2_14_during2');
        alt.removeIpl('id2_14_on_fire');
        alt.removeIpl('id2_14_post_no_int');
        alt.removeIpl('id2_14_pre_no_int');
        alt.removeIpl('id2_14_during_door');
        alt.requestIpl('id2_14_during1');
        alt.removeIpl('Coroner_Int_off');
        alt.requestIpl('coronertrash');
        alt.requestIpl('Coroner_Int_on');
        alt.removeIpl('bh1_16_refurb');
        alt.removeIpl('jewel2fake');
        alt.removeIpl('bh1_16_doors_shut');
        alt.requestIpl('refit_unload');
        alt.requestIpl('post_hiest_unload');
        alt.requestIpl('Carwash_with_spinners');
        alt.requestIpl('KT_CarWash');
        alt.requestIpl('ferris_finale_Anim');
        alt.removeIpl('ch1_02_closed');
        alt.requestIpl('ch1_02_open');
        alt.requestIpl('AP1_04_TriAf01');
        alt.requestIpl('CS2_06_TriAf02');
        alt.requestIpl('CS4_04_TriAf03');
        alt.removeIpl('scafstartimap');
        alt.requestIpl('scafendimap');
        alt.removeIpl('DT1_05_HC_REMOVE');
        alt.requestIpl('DT1_05_HC_REQ');
        alt.requestIpl('DT1_05_REQUEST');
        alt.requestIpl('dt1_05_hc_remove');
        alt.requestIpl('dt1_05_hc_remove_lod');
        alt.requestIpl('FINBANK');
        alt.removeIpl('DT1_03_Shutter');
        alt.removeIpl('DT1_03_Gr_Closed');
        alt.requestIpl('golfflags');
        alt.requestIpl('airfield');
        alt.requestIpl('v_garages');
        alt.requestIpl('v_foundry');
        alt.requestIpl('hei_yacht_heist');
        alt.requestIpl('hei_yacht_heist_Bar');
        alt.requestIpl('hei_yacht_heist_Bedrm');
        alt.requestIpl('hei_yacht_heist_Bridge');
        alt.requestIpl('hei_yacht_heist_DistantLights');
        alt.requestIpl('hei_yacht_heist_enginrm');
        alt.requestIpl('hei_yacht_heist_LODLights');
        alt.requestIpl('hei_yacht_heist_Lounge');
        alt.requestIpl('hei_carrier');
        alt.requestIpl('hei_Carrier_int1');
        alt.requestIpl('hei_Carrier_int2');
        alt.requestIpl('hei_Carrier_int3');
        alt.requestIpl('hei_Carrier_int4');
        alt.requestIpl('hei_Carrier_int5');
        alt.requestIpl('hei_Carrier_int6');
        alt.requestIpl('hei_carrier_LODLights');
        alt.requestIpl('bkr_bi_id1_23_door');
        alt.requestIpl('lr_cs6_08_grave_closed');
        alt.requestIpl('hei_sm_16_interior_v_bahama_milo_');
        alt.requestIpl('CS3_07_MPGates');
        alt.requestIpl('cs5_4_trains');
        alt.requestIpl('v_lesters');
        alt.requestIpl('v_trevors');
        alt.requestIpl('v_michael');
        alt.requestIpl('v_comedy');
        alt.requestIpl('v_cinema');
        alt.requestIpl('V_Sweat');
        alt.requestIpl('V_35_Fireman');
        alt.requestIpl('redCarpet');
        alt.requestIpl('triathlon2_VBprops');
        alt.requestIpl('jetstenativeurnel');
        alt.requestIpl('Jetsteal_ipl_grp1');
        alt.requestIpl('v_hospital');
        alt.removeIpl('RC12B_Default');
        alt.removeIpl('RC12B_Fixed');
        alt.requestIpl('RC12B_Destroyed');
        alt.requestIpl('RC12B_HospitalInterior');
        alt.requestIpl('canyonriver01');
        alt.requestIpl('canyonriver01_lod');
        alt.requestIpl('cs3_05_water_grp1');
        alt.requestIpl('cs3_05_water_grp1_lod');
        alt.requestIpl('trv1_trail_start');
        alt.requestIpl('CanyonRvrShallow');
        // CASINO
        alt.requestIpl('vw_casino_penthouse');
        alt.requestIpl('vw_casino_main');
        alt.requestIpl('vw_casino_carpark');
        alt.requestIpl('vw_dlc_casino_door');
        alt.requestIpl('vw_casino_door');
        alt.requestIpl('hei_dlc_windows_casino');
        alt.requestIpl('hei_dlc_casino_door');
        alt.requestIpl('hei_dlc_casino_aircon');
        alt.requestIpl('vw_casino_garage');
        let interiorID = native.getInteriorAtCoords(1100.0, 220.0, -50.0);
        if (native.isValidInterior(interiorID)) {
            native.activateInteriorEntitySet(interiorID, '0x30240D11');
            native.activateInteriorEntitySet(interiorID, '0xA3C89BB2');
            native.refreshInterior(interiorID);
        }
        interiorID = native.getInteriorAtCoords(976.6364, 70.29476, 115.1641);
        if (native.isValidInterior(interiorID)) {
            native.activateInteriorEntitySet(interiorID, 'teste1');
            native.activateInteriorEntitySet(interiorID, 'teste2');
            native.activateInteriorEntitySet(interiorID, 'teste3');
            native.activateInteriorEntitySet(interiorID, 'teste4');
            native.activateInteriorEntitySet(interiorID, 'teste11');
            native.activateInteriorEntitySet(interiorID, 'teste17');
            native.activateInteriorEntitySet(interiorID, 'teste18');
            native.activateInteriorEntitySet(interiorID, 'teste19');
            native.activateInteriorEntitySet(interiorID, 'teste20');
            native.activateInteriorEntitySet(interiorID, 'teste21');
            native.activateInteriorEntitySet(interiorID, 'teste29');
            native.activateInteriorEntitySet(interiorID, 'teste32');
            native.activateInteriorEntitySet(interiorID, 'teste33');
            native.activateInteriorEntitySet(interiorID, 'teste34');
            native.activateInteriorEntitySet(interiorID, 'teste1');
            native.activateInteriorEntitySet(interiorID, 'teste2');
            native.activateInteriorEntitySet(interiorID, 'teste4');
            native.activateInteriorEntitySet(interiorID, 'teste11');
            native.refreshInterior(interiorID);
        }
    }
};
__decorate([
    on("disconnect"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SessionHandler.prototype, "onPlayerDisconnect", null);
__decorate([
    on("connectionComplete"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SessionHandler.prototype, "onPlayerConnectionComplete", null);
SessionHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [Player,
        CameraModule,
        GuiModule,
        LoadingSpinnerModule,
        LoggerModule])
], SessionHandler);

var GenderType;
(function (GenderType) {
    GenderType[GenderType["MALE"] = 0] = "MALE";
    GenderType[GenderType["FEMALE"] = 1] = "FEMALE";
})(GenderType || (GenderType = {}));

var CharacterCreatorPurchaseType;
(function (CharacterCreatorPurchaseType) {
    CharacterCreatorPurchaseType[CharacterCreatorPurchaseType["CHARACTER"] = 0] = "CHARACTER";
    CharacterCreatorPurchaseType[CharacterCreatorPurchaseType["VEHICLE"] = 1] = "VEHICLE";
    CharacterCreatorPurchaseType[CharacterCreatorPurchaseType["HOUSE"] = 2] = "HOUSE";
    CharacterCreatorPurchaseType[CharacterCreatorPurchaseType["MONEY"] = 3] = "MONEY";
    CharacterCreatorPurchaseType[CharacterCreatorPurchaseType["ITEM"] = 4] = "ITEM";
    CharacterCreatorPurchaseType[CharacterCreatorPurchaseType["CLOTHINGS"] = 5] = "CLOTHINGS";
})(CharacterCreatorPurchaseType || (CharacterCreatorPurchaseType = {}));

var DialogType;
(function (DialogType) {
    DialogType[DialogType["ONE_BUTTON_DIALOG"] = 0] = "ONE_BUTTON_DIALOG";
    DialogType[DialogType["TWO_BUTTON_DIALOG"] = 1] = "TWO_BUTTON_DIALOG";
})(DialogType || (DialogType = {}));

var ItemState;
(function (ItemState) {
    ItemState[ItemState["DROPPED"] = 0] = "DROPPED";
    ItemState[ItemState["NOT_EQUIPPED"] = 1] = "NOT_EQUIPPED";
    ItemState[ItemState["EQUIPPED"] = 2] = "EQUIPPED";
    ItemState[ItemState["FORCE_EQUIPPED"] = 3] = "FORCE_EQUIPPED";
})(ItemState || (ItemState = {}));

let ClothingModule = class ClothingModule {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    isClothingItem(name) {
        switch (name) {
            case "CLOTHING_HAT":
            case "CLOTHING_GLASSES":
            case "CLOTHING_EARS":
            case "CLOTHING_MASK":
            case "CLOTHING_TOP":
            case "CLOTHING_UNDERSHIRT":
            case "CLOTHING_ACCESSORIES":
            case "CLOTHING_WATCH":
            case "CLOTHING_BRACELET":
            case "CLOTHING_PANTS":
            case "CLOTHING_BACKPACK":
            case "CLOTHING_BODY_ARMOR":
            case "CLOTHING_SHOES":
                return true;
            default:
                this.logger.warning("ClothingModule: " + name + " ist kein Kleidungsitem.");
                return false;
        }
    }
    isClothingItemAProp(name) {
        switch (name) {
            case "CLOTHING_HAT":
            case "CLOTHING_GLASSES":
            case "CLOTHING_EARS":
            case "CLOTHING_WATCH":
            case "CLOTHING_BRACELET":
                return true;
            default:
                return false;
        }
    }
    getMaxDrawableVariations(pedId) {
        return {
            maxHat: native__default.getNumberOfPedPropDrawableVariations(pedId, 0),
            maxGlasses: native__default.getNumberOfPedPropDrawableVariations(pedId, 1),
            maxEars: native__default.getNumberOfPedPropDrawableVariations(pedId, 2),
            maxWatches: native__default.getNumberOfPedPropDrawableVariations(pedId, 6),
            maxBracelets: native__default.getNumberOfPedPropDrawableVariations(pedId, 7),
            maxMask: native__default.getNumberOfPedDrawableVariations(pedId, 1),
            maxTorsos: native__default.getNumberOfPedDrawableVariations(pedId, 3),
            maxTops: native__default.getNumberOfPedDrawableVariations(pedId, 11),
            maxBodyArmors: native__default.getNumberOfPedDrawableVariations(pedId, 9),
            maxBackPacks: native__default.getNumberOfPedDrawableVariations(pedId, 5),
            maxUnderShirts: native__default.getNumberOfPedDrawableVariations(pedId, 8),
            maxAccessories: native__default.getNumberOfPedDrawableVariations(pedId, 7),
            maxPants: native__default.getNumberOfPedDrawableVariations(pedId, 4),
            maxShoes: native__default.getNumberOfPedDrawableVariations(pedId, 6)
        };
    }
    getMaxTextureVariations(pedId, clothes) {
        return {
            maxHat: native__default.getNumberOfPedPropTextureVariations(pedId, 0, clothes.hat !== null ? clothes.hat.drawableId : -1) - 1,
            maxGlasses: native__default.getNumberOfPedPropTextureVariations(pedId, 1, clothes.glasses !== null ? clothes.glasses.drawableId : -1) - 1,
            maxEars: native__default.getNumberOfPedPropTextureVariations(pedId, 2, clothes.ears !== null ? clothes.ears.drawableId : -1) - 1,
            maxWatches: native__default.getNumberOfPedPropTextureVariations(pedId, 6, clothes.watch !== null ? clothes.watch.drawableId : -1) - 1,
            maxBracelets: native__default.getNumberOfPedPropTextureVariations(pedId, 7, clothes.bracelets !== null ? clothes.bracelets.drawableId : -1) - 1,
            maxMask: native__default.getNumberOfPedTextureVariations(pedId, 1, clothes.mask !== null ? clothes.mask.drawableId : -1) - 1,
            maxTorsos: native__default.getNumberOfPedTextureVariations(pedId, 3, clothes.torso !== null ? clothes.torso.drawableId : -1) - 1,
            maxTops: native__default.getNumberOfPedTextureVariations(pedId, 11, clothes.top !== null ? clothes.top.drawableId : -1) - 1,
            maxBodyArmors: native__default.getNumberOfPedTextureVariations(pedId, 9, clothes.bodyArmor !== null ? clothes.bodyArmor.drawableId : -1) - 1,
            maxBackPacks: native__default.getNumberOfPedTextureVariations(pedId, 5, clothes.backPack !== null ? clothes.backPack.drawableId : -1) - 1,
            maxUnderShirts: native__default.getNumberOfPedTextureVariations(pedId, 8, clothes.underShirt !== null ? clothes.underShirt.drawableId : -1) - 1,
            maxAccessories: native__default.getNumberOfPedTextureVariations(pedId, 7, clothes.accessories !== null ? clothes.accessories.drawableId : -1) - 1,
            maxPants: native__default.getNumberOfPedTextureVariations(pedId, 4, clothes.pants !== null ? clothes.pants.drawableId : -1) - 1,
            maxShoes: native__default.getNumberOfPedTextureVariations(pedId, 6, clothes.shoes !== null ? clothes.shoes.drawableId : -1) - 1
        };
    }
    getClothCategoryPrice(catalogItemName, compId) {
        let price = 0;
        if (this.isClothingItemAProp(catalogItemName)) {
            switch (compId) {
                case 0:
                    price = 100;
                    break;
                case 1:
                    price = 100;
                    break;
                case 2:
                    price = 500;
                    break;
                case 6:
                    price = 500;
                    break;
                case 7:
                    price = 500;
                    break;
            }
        }
        else {
            switch (compId) {
                case 1:
                    price = 50;
                    break;
                case 4:
                    price = 50;
                    break;
                case 5:
                    price = 100;
                    break;
                case 6:
                    price = 50;
                    break;
                case 7:
                    price = 250;
                    break;
                case 8:
                    price = 25;
                    break;
                case 9:
                    price = 150;
                    break;
                case 10:
                    price = 25;
                    break;
                case 11:
                    price = 50;
                    break;
            }
        }
        return price;
    }
};
ClothingModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [LoggerModule])
], ClothingModule);

let CharacterModule = class CharacterModule {
    logger;
    event;
    clothing;
    get getCachedCharacter() {
        return this.cachedCharacter;
    }
    get getMaleNudeShoes() {
        return 34;
    }
    get getFemaleNudeShoes() {
        return 35;
    }
    get getPedComponents() {
        return this.pedComponents;
    }
    hairOverlaysMale = {
        0: { collection: 'mpbeach_overlays', overlay: 'FM_Hair_Fuzz' },
        1: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_001' },
        2: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_002' },
        3: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_003' },
        4: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_004' },
        5: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_005' },
        6: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_006' },
        7: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_007' },
        8: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_008' },
        9: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_009' },
        10: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_013' },
        11: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_002' },
        12: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_011' },
        13: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_012' },
        14: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_014' },
        15: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_015' },
        16: { collection: 'multiplayer_overlays', overlay: 'NGBea_M_Hair_000' },
        17: { collection: 'multiplayer_overlays', overlay: 'NGBea_M_Hair_001' },
        18: { collection: 'multiplayer_overlays', overlay: 'NGBus_M_Hair_000' },
        19: { collection: 'multiplayer_overlays', overlay: 'NGBus_M_Hair_001' },
        20: { collection: 'multiplayer_overlays', overlay: 'NGHip_M_Hair_000' },
        21: { collection: 'multiplayer_overlays', overlay: 'NGHip_M_Hair_001' },
        22: { collection: 'multiplayer_overlays', overlay: 'NGInd_M_Hair_000' },
        24: { collection: 'mplowrider_overlays', overlay: 'LR_M_Hair_000' },
        25: { collection: 'mplowrider_overlays', overlay: 'LR_M_Hair_001' },
        26: { collection: 'mplowrider_overlays', overlay: 'LR_M_Hair_002' },
        27: { collection: 'mplowrider_overlays', overlay: 'LR_M_Hair_003' },
        28: { collection: 'mplowrider2_overlays', overlay: 'LR_M_Hair_004' },
        29: { collection: 'mplowrider2_overlays', overlay: 'LR_M_Hair_005' },
        30: { collection: 'mplowrider2_overlays', overlay: 'LR_M_Hair_006' },
        31: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_000_M' },
        32: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_001_M' },
        33: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_002_M' },
        34: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_003_M' },
        35: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_004_M' },
        36: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_005_M' },
        37: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_001' },
        38: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_002' },
        39: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_003' },
        40: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_004' },
        41: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_005' },
        42: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_006' },
        43: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_007' },
        44: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_008' },
        45: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_009' },
        46: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_013' },
        47: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_002' },
        48: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_011' },
        49: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_012' },
        50: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_014' },
        51: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_015' },
        52: { collection: 'multiplayer_overlays', overlay: 'NGBea_M_Hair_000' },
        53: { collection: 'multiplayer_overlays', overlay: 'NGBea_M_Hair_001' },
        54: { collection: 'multiplayer_overlays', overlay: 'NGBus_M_Hair_000' },
        55: { collection: 'multiplayer_overlays', overlay: 'NGBus_M_Hair_001' },
        56: { collection: 'multiplayer_overlays', overlay: 'NGHip_M_Hair_000' },
        57: { collection: 'multiplayer_overlays', overlay: 'NGHip_M_Hair_001' },
        58: { collection: 'multiplayer_overlays', overlay: 'NGInd_M_Hair_000' },
        59: { collection: 'mplowrider_overlays', overlay: 'LR_M_Hair_000' },
        60: { collection: 'mplowrider_overlays', overlay: 'LR_M_Hair_001' },
        61: { collection: 'mplowrider_overlays', overlay: 'LR_M_Hair_002' },
        62: { collection: 'mplowrider_overlays', overlay: 'LR_M_Hair_003' },
        63: { collection: 'mplowrider2_overlays', overlay: 'LR_M_Hair_004' },
        64: { collection: 'mplowrider2_overlays', overlay: 'LR_M_Hair_005' },
        65: { collection: 'mplowrider2_overlays', overlay: 'LR_M_Hair_006' },
        66: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_000_M' },
        67: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_001_M' },
        68: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_002_M' },
        69: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_003_M' },
        70: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_004_M' },
        71: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_005_M' },
        72: { collection: 'mpgunrunning_overlays', overlay: 'MP_Gunrunning_Hair_M_000_M' },
        73: { collection: 'mpgunrunning_overlays', overlay: 'MP_Gunrunning_Hair_M_001_M' }
    };
    hairOverlaysFemale = {
        0: { collection: 'mpbeach_overlays', overlay: 'FM_Hair_Fuzz' },
        1: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_001' },
        2: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_002' },
        3: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_003' },
        4: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_004' },
        5: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_005' },
        6: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_006' },
        7: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_007' },
        8: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_008' },
        9: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_009' },
        10: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_010' },
        11: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_011' },
        12: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_012' },
        13: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_013' },
        14: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_014' },
        15: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_015' },
        16: { collection: 'multiplayer_overlays', overlay: 'NGBea_F_Hair_000' },
        17: { collection: 'multiplayer_overlays', overlay: 'NGBea_F_Hair_001' },
        18: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_007' },
        19: { collection: 'multiplayer_overlays', overlay: 'NGBus_F_Hair_000' },
        20: { collection: 'multiplayer_overlays', overlay: 'NGBus_F_Hair_001' },
        21: { collection: 'multiplayer_overlays', overlay: 'NGBea_F_Hair_001' },
        22: { collection: 'multiplayer_overlays', overlay: 'NGHip_F_Hair_000' },
        23: { collection: 'multiplayer_overlays', overlay: 'NGInd_F_Hair_000' },
        25: { collection: 'mplowrider_overlays', overlay: 'LR_F_Hair_000' },
        26: { collection: 'mplowrider_overlays', overlay: 'LR_F_Hair_001' },
        27: { collection: 'mplowrider_overlays', overlay: 'LR_F_Hair_002' },
        28: { collection: 'mplowrider2_overlays', overlay: 'LR_F_Hair_003' },
        29: { collection: 'mplowrider2_overlays', overlay: 'LR_F_Hair_003' },
        30: { collection: 'mplowrider2_overlays', overlay: 'LR_F_Hair_004' },
        31: { collection: 'mplowrider2_overlays', overlay: 'LR_F_Hair_006' },
        32: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_000_F' },
        33: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_001_F' },
        34: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_002_F' },
        35: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_003_F' },
        36: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_003' },
        37: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_006_F' },
        38: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_004_F' },
        39: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_001' },
        40: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_002' },
        41: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_003' },
        42: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_004' },
        43: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_005' },
        44: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_006' },
        45: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_007' },
        46: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_008' },
        47: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_009' },
        48: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_010' },
        49: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_011' },
        50: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_012' },
        51: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_013' },
        52: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_014' },
        53: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_015' },
        54: { collection: 'multiplayer_overlays', overlay: 'NGBea_F_Hair_000' },
        55: { collection: 'multiplayer_overlays', overlay: 'NGBea_F_Hair_001' },
        56: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_007' },
        57: { collection: 'multiplayer_overlays', overlay: 'NGBus_F_Hair_000' },
        58: { collection: 'multiplayer_overlays', overlay: 'NGBus_F_Hair_001' },
        59: { collection: 'multiplayer_overlays', overlay: 'NGBea_F_Hair_001' },
        60: { collection: 'multiplayer_overlays', overlay: 'NGHip_F_Hair_000' },
        61: { collection: 'multiplayer_overlays', overlay: 'NGInd_F_Hair_000' },
        62: { collection: 'mplowrider_overlays', overlay: 'LR_F_Hair_000' },
        63: { collection: 'mplowrider_overlays', overlay: 'LR_F_Hair_001' },
        64: { collection: 'mplowrider_overlays', overlay: 'LR_F_Hair_002' },
        65: { collection: 'mplowrider2_overlays', overlay: 'LR_F_Hair_003' },
        66: { collection: 'mplowrider2_overlays', overlay: 'LR_F_Hair_003' },
        67: { collection: 'mplowrider2_overlays', overlay: 'LR_F_Hair_004' },
        68: { collection: 'mplowrider2_overlays', overlay: 'LR_F_Hair_006' },
        69: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_000_F' },
        70: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_001_F' },
        71: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_002_F' },
        72: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_003_F' },
        73: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_003' },
        74: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_006_F' },
        75: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_004_F' },
        76: { collection: 'mpgunrunning_overlays', overlay: 'MP_Gunrunning_Hair_F_000_F' },
        77: { collection: 'mpgunrunning_overlays', overlay: 'MP_Gunrunning_Hair_F_001_F' }
    };
    cachedCharacter;
    pedComponents = [];
    constructor(logger, event, clothing) {
        this.logger = logger;
        this.event = event;
        this.clothing = clothing;
        this.readComponentsFromJson();
    }
    apply(character, pedId) {
        native.clearPedBloodDamage(pedId);
        native.clearPedDecorations(pedId);
        native.setPedHeadBlendData(pedId, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);
        this.updateParents(character.mother, character.father, character.similarity, character.skinSimilarity, character.gender, pedId);
        this.updateFaceFeatures(character.faceFeatures, pedId);
        this.updateAppearance(character.appearances, character.gender, pedId);
        character.clothes = this.getClothesFromInventory(character.inventory);
        character.clothes.torso = {
            drawableId: character.torso,
            textureId: character.torsoTexture,
            title: "",
            genderType: GenderType.MALE,
        };
        this.updateClothes(character.clothes, pedId, character.gender);
        this.updateTattoos(character.tattoos, pedId);
        this.cachedCharacter = character;
    }
    createClothesBasedOnInventory(inventory, pedId, gender) {
        const clothes = this.getClothesFromInventory(inventory);
        clothes.torso = {
            drawableId: this.cachedCharacter.torso,
            textureId: this.cachedCharacter.torsoTexture,
            title: "",
            genderType: GenderType.MALE,
        };
        this.updateClothes(clothes, pedId, gender);
    }
    updateClothes(clothes, pedId, gender) {
        if (clothes.hat !== null) {
            native.setPedPreloadPropData(pedId, 0, clothes.hat.drawableId, clothes.hat.textureId);
            native.setPedPropIndex(pedId, 0, clothes.hat.drawableId, clothes.hat.textureId, true);
        }
        else {
            native.clearPedProp(pedId, 0);
        }
        if (clothes.glasses !== null) {
            native.setPedPropIndex(pedId, 1, clothes.glasses.drawableId, clothes.glasses.textureId, true);
        }
        else {
            native.clearPedProp(pedId, 1);
        }
        if (clothes.ears !== null) {
            native.setPedPropIndex(pedId, 2, clothes.ears.drawableId, clothes.ears.textureId, true);
        }
        else {
            native.clearPedProp(pedId, 2);
        }
        if (clothes.mask !== null) {
            native.setPedComponentVariation(pedId, 1, clothes.mask.drawableId, clothes.mask.textureId, 2);
        }
        else {
            native.setPedComponentVariation(pedId, 1, 0, 0, 2);
        }
        if (clothes.watch !== null) {
            native.setPedPropIndex(pedId, 6, clothes.watch.drawableId, clothes.watch.textureId, true);
        }
        else {
            native.clearPedProp(pedId, 6);
        }
        if (clothes.bracelets !== null) {
            native.setPedPropIndex(pedId, 7, clothes.bracelets.drawableId, clothes.bracelets.textureId, true);
        }
        else {
            native.clearPedProp(pedId, 7);
        }
        if (clothes.top !== null) {
            native.setPedComponentVariation(pedId, 11, clothes.top.drawableId, clothes.top.textureId, 2);
        }
        else {
            if (gender === GenderType.MALE) {
                native.setPedComponentVariation(pedId, 11, 15, 0, 0);
            }
            else {
                native.setPedComponentVariation(pedId, 11, 18, 0, 0);
            }
        }
        if (clothes.torso !== null) {
            this.updateTorso(pedId, clothes.torso.drawableId, clothes.torso.textureId);
        }
        else {
            this.updateTorso(pedId, 15, 0);
        }
        if (clothes.bodyArmor !== null) {
            native.setPedComponentVariation(pedId, 9, clothes.bodyArmor.drawableId, clothes.bodyArmor.textureId, 2);
        }
        else {
            native.setPedComponentVariation(pedId, 9, 0, 0, 0);
        }
        if (clothes.backPack !== null) {
            native.setPedComponentVariation(pedId, 5, clothes.backPack.drawableId, clothes.backPack.textureId, 2);
        }
        else {
            native.setPedComponentVariation(pedId, 5, 0, 0, 0);
        }
        if (clothes.underShirt !== null) {
            native.setPedComponentVariation(pedId, 8, clothes.underShirt.drawableId, clothes.underShirt.textureId, 2);
        }
        else {
            native.setPedComponentVariation(pedId, 8, 15, 0, 0);
        }
        if (clothes.accessories !== null) {
            native.setPedComponentVariation(pedId, 7, clothes.accessories.drawableId, clothes.accessories.textureId, 2);
        }
        else {
            native.setPedComponentVariation(pedId, 7, 0, 0, 0);
        }
        if (clothes.pants !== null) {
            native.setPedComponentVariation(pedId, 4, clothes.pants.drawableId, clothes.pants.textureId, 2);
        }
        else {
            if (gender === GenderType.MALE) {
                native.setPedComponentVariation(pedId, 4, 61, 0, 0);
            }
            else {
                native.setPedComponentVariation(pedId, 4, 17, 0, 0);
            }
        }
        if (clothes.shoes !== null) {
            native.setPedComponentVariation(pedId, 6, clothes.shoes.drawableId, clothes.shoes.textureId, 2);
        }
        else {
            if (gender === GenderType.MALE) {
                native.setPedComponentVariation(pedId, 6, this.getMaleNudeShoes, 0, 2);
            }
            else {
                native.setPedComponentVariation(pedId, 6, this.getFemaleNudeShoes, 0, 2);
            }
        }
    }
    updateTorso(pedId, drawableId, textureId) {
        native.setPedComponentVariation(pedId, 3, drawableId, textureId, 0);
    }
    updateTattoos(tattoos, pedId) {
        native.clearPedDecorations(pedId);
        native.addPedDecorationFromHashes(pedId, native.getHashKey(tattoos.headCollection), Number.parseInt(tattoos.headHash));
        native.addPedDecorationFromHashes(pedId, native.getHashKey(tattoos.torsoCollection), Number.parseInt(tattoos.torsoHash));
        native.addPedDecorationFromHashes(pedId, native.getHashKey(tattoos.leftArmCollection), Number.parseInt(tattoos.leftArmHash));
        native.addPedDecorationFromHashes(pedId, native.getHashKey(tattoos.rightArmCollection), Number.parseInt(tattoos.rightArmHash));
        native.addPedDecorationFromHashes(pedId, native.getHashKey(tattoos.leftLegCollection), Number.parseInt(tattoos.leftLegHash));
        native.addPedDecorationFromHashes(pedId, native.getHashKey(tattoos.rightLegCollection), Number.parseInt(tattoos.rightLegHash));
    }
    setNude(pedId, gender) {
        native.clearAllPedProps(pedId);
        if (gender === GenderType.MALE) {
            native.setPedComponentVariation(pedId, 11, 15, 0, 0);
        }
        else {
            native.setPedComponentVariation(pedId, 11, 18, 0, 0);
        }
        this.updateTorso(pedId, 15, 0);
        native.setPedComponentVariation(pedId, 1, 0, 0, 0);
        native.setPedComponentVariation(pedId, 9, 0, 0, 0);
        native.setPedComponentVariation(pedId, 5, 0, 0, 0);
        native.setPedComponentVariation(pedId, 8, 15, 0, 0);
        native.setPedComponentVariation(pedId, 7, 0, 0, 0);
        if (gender === GenderType.MALE) {
            native.setPedComponentVariation(pedId, 4, 61, 0, 0);
        }
        else {
            native.setPedComponentVariation(pedId, 4, 17, 0, 0);
        }
        if (gender === GenderType.MALE) {
            native.setPedComponentVariation(pedId, 6, this.getMaleNudeShoes, 0, 2);
        }
        else {
            native.setPedComponentVariation(pedId, 6, this.getFemaleNudeShoes, 0, 2);
        }
    }
    updateAppearance(appearances, gender, pedId) {
        if (!appearances)
            return;
        native.clearPedDecorations(pedId);
        native.setPedEyeColor(pedId, appearances.eyeColor);
        native.setPedComponentVariation(pedId, 2, appearances.hair, 0, 0);
        native.setPedHairColor(pedId, appearances.primHairColor, appearances.secHairColor);
        if (gender === GenderType.MALE) {
            if (this.hairOverlaysMale[appearances.hair]) {
                const collection = this.hairOverlaysMale[appearances.hair].collection;
                const overlay = this.hairOverlaysMale[appearances.hair].overlay;
                native.addPedDecorationFromHashes(pedId, alt.hash(collection), alt.hash(overlay));
            }
        }
        else {
            if (this.hairOverlaysFemale[appearances.hair]) {
                const collection = this.hairOverlaysFemale[appearances.hair].collection;
                const overlay = this.hairOverlaysFemale[appearances.hair].overlay;
                native.addPedDecorationFromHashes(pedId, alt.hash(collection), alt.hash(overlay));
            }
        }
        native.setPedHeadOverlay(pedId, 0, appearances.blemishesValue, appearances.blemishesOpacity);
        native.setPedHeadOverlayColor(pedId, 0, this.getColorType(0), appearances.blemishesColor, 0);
        native.setPedHeadOverlay(pedId, 1, appearances.facialhairValue, appearances.facialhairOpacity);
        native.setPedHeadOverlayColor(pedId, 1, this.getColorType(1), appearances.facialhairColor, 0);
        native.setPedHeadOverlay(pedId, 2, appearances.eyebrowsValue, appearances.eyebrowsOpacity);
        native.setPedHeadOverlayColor(pedId, 2, this.getColorType(2), appearances.eyebrowsColor, 0);
        native.setPedHeadOverlay(pedId, 3, appearances.ageingValue, appearances.ageingOpacity);
        native.setPedHeadOverlayColor(pedId, 3, this.getColorType(3), appearances.ageingColor, 0);
        native.setPedHeadOverlay(pedId, 4, appearances.makeupValue, appearances.makeupOpacity);
        native.setPedHeadOverlayColor(pedId, 4, this.getColorType(4), appearances.makeupColor, 0);
        native.setPedHeadOverlay(pedId, 5, appearances.blushValue, appearances.blushOpacity);
        native.setPedHeadOverlayColor(pedId, 5, this.getColorType(5), appearances.blushColor, 0);
        native.setPedHeadOverlay(pedId, 6, appearances.complexionValue, appearances.complexionOpacity);
        native.setPedHeadOverlayColor(pedId, 6, this.getColorType(6), appearances.complexionColor, 0);
        native.setPedHeadOverlay(pedId, 7, appearances.sundamageValue, appearances.sundamageOpacity);
        native.setPedHeadOverlayColor(pedId, 7, this.getColorType(7), appearances.sundamageColor, 0);
        native.setPedHeadOverlay(pedId, 8, appearances.lipstickValue, appearances.lipstickOpacity);
        native.setPedHeadOverlayColor(pedId, 8, this.getColorType(8), appearances.lipstickColor, 0);
        native.setPedHeadOverlay(pedId, 9, appearances.frecklesValue, appearances.frecklesOpacity);
        native.setPedHeadOverlayColor(pedId, 9, this.getColorType(9), appearances.frecklesColor, 0);
        native.setPedHeadOverlay(pedId, 10, appearances.chesthairValue, appearances.chesthairOpacity);
        native.setPedHeadOverlayColor(pedId, 10, this.getColorType(10), appearances.chesthairColor, 0);
        native.setPedHeadOverlay(pedId, 11, appearances.bodyblemishesValue, appearances.bodyblemishesOpacity);
        native.setPedHeadOverlayColor(pedId, 11, this.getColorType(11), appearances.bodyblemishesColor, 0);
        native.setPedHeadOverlay(pedId, 12, appearances.addbodyblemihesValue, appearances.addbodyblemihesOpacity);
        native.setPedHeadOverlayColor(pedId, 12, this.getColorType(12), appearances.addbodyblemihesColor, 0);
    }
    createEmptyClothings() {
        return {
            hat: null,
            glasses: null,
            ears: null,
            watch: null,
            bracelets: null,
            mask: null,
            top: null,
            torso: null,
            bodyArmor: null,
            backPack: null,
            underShirt: null,
            accessories: null,
            pants: null,
            shoes: null
        };
    }
    getClothesFromInventory(inventory) {
        // This will only filter items from the inventory that are clothing item types and equipped.
        const clothingItems = inventory.items.filter(i => i.itemState === ItemState.EQUIPPED && this.clothing.isClothingItem(i.catalogItemName));
        const clothes = this.createEmptyClothings();
        for (let index = 0; index < clothingItems.length; index++) {
            const item = clothingItems[index];
            const clothing = JSON.parse(item.customData);
            switch (item.catalogItemName) {
                case "CLOTHING_HAT":
                    clothes.hat = clothing;
                    break;
                case "CLOTHING_GLASSES":
                    clothes.glasses = clothing;
                    break;
                case "CLOTHING_EARS":
                    clothes.ears = clothing;
                    break;
                case "CLOTHING_MASK":
                    clothes.mask = clothing;
                    break;
                case "CLOTHING_TOP":
                    clothes.top = clothing;
                    break;
                case "CLOTHING_UNDERSHIRT":
                    clothes.underShirt = clothing;
                    break;
                case "CLOTHING_ACCESSORIES":
                    clothes.accessories = clothing;
                    break;
                case "CLOTHING_WATCH":
                    clothes.watch = clothing;
                    break;
                case "CLOTHING_BRACELET":
                    clothes.bracelets = clothing;
                    break;
                case "CLOTHING_PANTS":
                    clothes.pants = clothing;
                    break;
                case "CLOTHING_BACKPACK":
                    clothes.backPack = clothing;
                    break;
                case "CLOTHING_BODY_ARMOR":
                    clothes.bodyArmor = clothing;
                    break;
                case "CLOTHING_SHOES":
                    clothes.shoes = clothing;
                    break;
                default:
                    this.logger.error("Es wurde kein Kleidungstyp mit dem Namen " + name + " gefunden.");
            }
        }
        return clothes;
    }
    updateParents(mother, father, similarity, skinSimilarity, gender, pedId) {
        native.setPedHeadBlendData(pedId, mother, father, 0, mother, father, 0, similarity, skinSimilarity, 0, false);
    }
    updateFaceFeatures(faceFeatures, pedId) {
        if (!faceFeatures)
            return;
        native.setPedFaceFeature(pedId, 0, faceFeatures.noseWidth);
        native.setPedFaceFeature(pedId, 1, faceFeatures.noseHeight);
        native.setPedFaceFeature(pedId, 2, faceFeatures.noseLength);
        native.setPedFaceFeature(pedId, 3, faceFeatures.noseBridge);
        native.setPedFaceFeature(pedId, 4, faceFeatures.noseTip);
        native.setPedFaceFeature(pedId, 5, faceFeatures.noseBridgeShift);
        native.setPedFaceFeature(pedId, 6, faceFeatures.browHeight);
        native.setPedFaceFeature(pedId, 7, faceFeatures.browWidth);
        native.setPedFaceFeature(pedId, 8, faceFeatures.cheekboneHeight);
        native.setPedFaceFeature(pedId, 9, faceFeatures.cheekboneWidth);
        native.setPedFaceFeature(pedId, 10, faceFeatures.cheekWidth);
        native.setPedFaceFeature(pedId, 11, faceFeatures.eyesSize);
        native.setPedFaceFeature(pedId, 12, faceFeatures.lipsThickness);
        native.setPedFaceFeature(pedId, 13, faceFeatures.jawWidth);
        native.setPedFaceFeature(pedId, 14, faceFeatures.jawHeight);
        native.setPedFaceFeature(pedId, 15, faceFeatures.chinLength);
        native.setPedFaceFeature(pedId, 16, faceFeatures.chinPosition);
        native.setPedFaceFeature(pedId, 17, faceFeatures.chinWidth);
        native.setPedFaceFeature(pedId, 18, faceFeatures.chinShape);
        native.setPedFaceFeature(pedId, 19, faceFeatures.neckWidth);
    }
    getColorType(overlayId) {
        let returnVal = 0;
        switch (overlayId) {
            case 1:
            case 2:
            case 10:
                returnVal = 1;
                break;
            case 5:
            case 8:
                returnVal = 2;
                break;
            default:
                returnVal = 0;
        }
        return returnVal;
    }
    readComponentsFromJson() {
        if (alt.File.exists("@southcentral-assets/dumps/pedComponentVariations.json")) {
            const dumps = alt.File.read("@southcentral-assets/dumps/pedComponentVariations.json");
            this.pedComponents = JSON.parse(dumps);
            this.pedComponents.forEach((component) => {
                component.ComponentVariations = component.ComponentVariations.filter(cv => cv.TranslatedLabel !== null);
                component.Props = component.Props.filter(cv => cv.TranslatedLabel !== null);
            });
        }
        else {
            this.logger.error("CharacterService: PedComponentVariation Dump is not loaded.");
        }
    }
};
CharacterModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [LoggerModule,
        EventModule,
        ClothingModule])
], CharacterModule);

let CharCreatorModule = class CharCreatorModule {
    event;
    logger;
    clothing;
    get getCharacterData() {
        return this.characterCreatorData;
    }
    characterCreatorData;
    MONEY_TO_SOUTH_CENTRAL_POINTS_VALUE = 0;
    constructor(event, logger, clothing) {
        this.event = event;
        this.logger = logger;
        this.clothing = clothing;
    }
    setup(character, moneyToSouthCentralPointsValue) {
        this.characterCreatorData = {
            character: character,
            startMoney: 0,
            hasPhone: false,
            purchaseOrders: [],
            spawnId: 0
        };
        this.MONEY_TO_SOUTH_CENTRAL_POINTS_VALUE = moneyToSouthCentralPointsValue;
    }
    orderVehicleLimit() {
        return (this.characterCreatorData.purchaseOrders.filter(po => po.type === CharacterCreatorPurchaseType.VEHICLE).length > 1);
    }
    addPurchase(purchase) {
        this.characterCreatorData.purchaseOrders.push(purchase);
        this.event.emitGui("charcreator:updatepurchaseorders", this.characterCreatorData.purchaseOrders);
    }
    removePurchase(purchaseOrder) {
        this.characterCreatorData.purchaseOrders = this.characterCreatorData.purchaseOrders.filter(po => po.id !== purchaseOrder.id);
        this.event.emitGui("charcreator:updatepurchaseorders", this.characterCreatorData.purchaseOrders);
        switch (purchaseOrder.type) {
            case CharacterCreatorPurchaseType.HOUSE:
                this.event.emitServer("houseselector:unselect");
                this.event.emitGui("houseselector:select", null);
                break;
        }
    }
    resetTypePurchaseOrders(type) {
        this.characterCreatorData.purchaseOrders = this.characterCreatorData.purchaseOrders.filter(po => po.type !== type);
        this.event.emitGui("charcreator:updatepurchaseorders", this.characterCreatorData.purchaseOrders);
    }
    setSpawn(id) {
        this.characterCreatorData.spawnId = id;
    }
    setCharacter(character) {
        this.characterCreatorData.character = character;
    }
    setForm(form) {
        this.characterCreatorData.character.firstName = form.profile.firstName;
        this.characterCreatorData.character.lastName = form.profile.lastName;
        this.characterCreatorData.character.origin = form.profile.origin;
        this.characterCreatorData.character.story = form.profile.story;
        this.characterCreatorData.character.age = form.profile.age;
        this.characterCreatorData.character.bodySize = form.profile.bodySize;
        this.characterCreatorData.character.physique = form.profile.physique;
        this.characterCreatorData.startMoney = form.startMoney;
        this.characterCreatorData.hasPhone = form.hasPhone;
    }
    getInventoryClothingItems(character) {
        this.resetTypePurchaseOrders(CharacterCreatorPurchaseType.CLOTHINGS);
        character.inventory.items = [];
        if (character.clothes.hat) {
            character.inventory.items.push(this.getClothingItem("CLOTHING_HAT", 0, character.clothes.hat));
        }
        if (character.clothes.glasses) {
            character.inventory.items.push(this.getClothingItem("CLOTHING_GLASSES", 1, character.clothes.glasses));
        }
        if (character.clothes.ears) {
            character.inventory.items.push(this.getClothingItem("CLOTHING_EARS", 2, character.clothes.ears));
        }
        if (character.clothes.mask) {
            character.inventory.items.push(this.getClothingItem("CLOTHING_MASK", 1, character.clothes.mask));
        }
        if (character.clothes.top) {
            character.inventory.items.push(this.getClothingItem("CLOTHING_TOP", 11, character.clothes.top));
        }
        if (character.clothes.backPack) {
            character.inventory.items.push(this.getClothingItem("CLOTHING_BACKPACK", 5, character.clothes.backPack));
        }
        if (character.clothes.underShirt) {
            character.inventory.items.push(this.getClothingItem("CLOTHING_UNDERSHIRT", 8, character.clothes.underShirt));
        }
        if (character.clothes.accessories) {
            character.inventory.items.push(this.getClothingItem("CLOTHING_ACCESSORIES", 7, character.clothes.accessories));
        }
        if (character.clothes.watch) {
            character.inventory.items.push(this.getClothingItem("CLOTHING_WATCH", 6, character.clothes.watch));
        }
        if (character.clothes.bracelets) {
            character.inventory.items.push(this.getClothingItem("CLOTHING_BRACELET", 7, character.clothes.bracelets));
        }
        if (character.clothes.pants) {
            character.inventory.items.push(this.getClothingItem("CLOTHING_PANTS", 4, character.clothes.pants));
        }
        if (character.clothes.bodyArmor) {
            character.inventory.items.push(this.getClothingItem("CLOTHING_BODY_ARMOR", 9, character.clothes.bodyArmor));
        }
        if (character.clothes.shoes) {
            character.inventory.items.push(this.getClothingItem("CLOTHING_SHOES", 6, character.clothes.shoes));
        }
        return character.inventory.items;
    }
    getClothingItem(catalogItemName, compId, clothing) {
        const price = this.clothing.getClothCategoryPrice(catalogItemName, compId);
        this.addPurchase({
            id: UID(),
            type: CharacterCreatorPurchaseType.CLOTHINGS,
            name: clothing.title,
            description: "Kleidungsstück",
            southCentralPoints: Number.parseInt((price * this.MONEY_TO_SOUTH_CENTRAL_POINTS_VALUE).toFixed(0)),
            removeable: false,
            orderedVehicle: null
        });
        return {
            id: UID(),
            amount: 1,
            catalogItemName: catalogItemName,
            catalogItem: null,
            note: "",
            customData: JSON.stringify(clothing),
            condition: null,
            isBought: true,
            itemState: ItemState.EQUIPPED
        };
    }
};
CharCreatorModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        LoggerModule,
        ClothingModule])
], CharCreatorModule);

let DialogModule = class DialogModule {
    event;
    gui;
    player;
    get getCurrentDialog() {
        return this.currentDialog;
    }
    currentDialog;
    constructor(event, gui, player) {
        this.event = event;
        this.gui = gui;
        this.player = player;
    }
    create(dialog) {
        this.player.setIsAnyMenuOpen = true;
        this.currentDialog = dialog;
        if (dialog.freezeGameControls) {
            this.player.blockGameControls(true);
            this.player.showCursor();
            this.gui.focusView();
        }
        this.event.emitGui("dialog:create", dialog);
    }
    destroy() {
        this.player.setIsAnyMenuOpen = false;
        if (this.currentDialog.freezeGameControls) {
            this.player.blockGameControls(false);
            this.player.hideCursor();
            this.gui.unfocusView();
        }
        this.currentDialog = undefined;
        this.event.emitGui("dialog:destroy");
    }
};
DialogModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        GuiModule,
        Player])
], DialogModule);

let CharacterCreatorHandler = class CharacterCreatorHandler {
    camera;
    character;
    player;
    event;
    update;
    logger;
    loading;
    charCreator;
    dialog;
    clothing;
    pedId;
    everyTickRef;
    isNewCharacter = false;
    isTutorial = false;
    setNudeMode = false;
    camPortrait = {
        pos: new alt.Vector3(403.16586, -998.3614, -98.53971),
        rot: new alt.Vector3(-14.409467, 4.2688686, 28.610905)
    };
    camFace = {
        pos: new alt.Vector3(402.86017, -997.1442, -98.344),
        rot: new alt.Vector3(1.4960656, -0, 16.131594)
    };
    camTorso = {
        pos: new alt.Vector3(402.92615, -997.37085, -98.78486),
        rot: new alt.Vector3(1.4960656, 0, 16.131594)
    };
    camPants = {
        pos: new alt.Vector3(402.92615, -997.37085, -99.574425),
        rot: new alt.Vector3(1.4960656, 0, 16.131594)
    };
    camFeets = {
        pos: new alt.Vector3(402.92615, -997.37085, -99.67937),
        rot: new alt.Vector3(-19.803135, 4.268868, 15.383445)
    };
    characterPos = new alt.Vector3(402.857, -996.672, -100);
    lastIndex = 0;
    MONEY_TO_SOUTH_CENTRAL_POINTS_VALUE = 0;
    PHONE_POINTS_PRICE = 0;
    constructor(camera, character, player, event, update, logger, loading, charCreator, dialog, clothing) {
        this.camera = camera;
        this.character = character;
        this.player = player;
        this.event = event;
        this.update = update;
        this.logger = logger;
        this.loading = loading;
        this.charCreator = charCreator;
        this.dialog = dialog;
        this.clothing = clothing;
    }
    async onOpen(character, isTutorial, moneyToSouthCentralPointsValue, baseCharacterCosts, phonePointsPrice) {
        this.isTutorial = isTutorial;
        this.MONEY_TO_SOUTH_CENTRAL_POINTS_VALUE = moneyToSouthCentralPointsValue;
        this.PHONE_POINTS_PRICE = phonePointsPrice;
        if (this.isTutorial) ;
        native.setClockTime(12, 0, 0);
        this.createCamera();
        const mHash = native.getHashKey("mp_m_freemode_01");
        const fHash = native.getHashKey("mp_f_freemode_01");
        await loadModel(mHash);
        await loadModel(fHash);
        this.isNewCharacter = (character != null);
        this.pedId = native.createPed(2, mHash, this.characterPos.x, this.characterPos.y, this.characterPos.z, 180, false, false);
        this.charCreator.setup(character, this.MONEY_TO_SOUTH_CENTRAL_POINTS_VALUE);
        this.charCreator.addPurchase({
            id: UID(),
            type: CharacterCreatorPurchaseType.CHARACTER,
            name: "Neuen Charakter",
            description: "Einen neuen Charakter erstellt",
            southCentralPoints: baseCharacterCosts,
            removeable: false,
            orderedVehicle: null
        });
        this.character.apply(character, this.pedId);
        this.event.emitGui("gui:routeto", "charcreator");
        this.loading.show("Lade Charaktererstellung...");
        alt.setTimeout(() => {
            this.player.fadeIn(500);
            this.player.unblurScreen(250);
            this.loading.hide();
        }, 1500);
    }
    onResetCamera() {
        this.createCamera();
        this.onChangeCamPos(this.lastIndex, 0);
    }
    onReset() {
        native.deletePed(this.pedId);
        this.loading.hide();
    }
    onCantFinishedCreation() {
        this.player.fadeIn(250);
        this.loading.hide();
        this.event.emitGui("charcreator:resetissaving");
    }
    onRemovePurchaseOrder(purchaseOrder) {
        if (!purchaseOrder.removeable) {
            return;
        }
        this.charCreator.removePurchase(purchaseOrder);
    }
    onRequestClose() {
        this.dialog.create({
            type: DialogType.TWO_BUTTON_DIALOG,
            title: "Charakter Erstellung verlassen",
            description: "Bist du dir sicher das du die Charakter Erstellung verlassen möchtest? Dein aktueller Charakter würde nicht gespeichert werden!",
            hasBankAccountSelection: false,
            hasInputField: false,
            dataJson: "[]",
            freezeGameControls: false,
            primaryButton: "Ja",
            secondaryButton: "Nein",
            primaryButtonClientEvent: "charcreator:close",
        });
    }
    onClose() {
        native.deletePed(this.pedId);
        this.player.fadeOut(500);
        alt.setTimeout(() => {
            this.event.emitServer("charcreator:close");
            this.event.emitGui("charcreator:reset");
        }, 700);
    }
    onGetCharacter() {
        this.event.emitGui("charcreator:setcharacter", this.character.getCachedCharacter, this.clothing.getMaxDrawableVariations(this.pedId), this.isNewCharacter);
    }
    onChangeCamPos(index, time = 850) {
        let pos;
        let rot;
        this.lastIndex = index;
        switch (index) {
            case 0:
                pos = this.camPortrait.pos;
                rot = this.camPortrait.rot;
                break;
            case 1:
                pos = this.camFace.pos;
                rot = this.camFace.rot;
                break;
            case 2:
                pos = this.camTorso.pos;
                rot = this.camTorso.rot;
                break;
            case 3:
                pos = this.camPants.pos;
                rot = this.camPants.rot;
                break;
            case 4:
                pos = this.camFeets.pos;
                rot = this.camFeets.rot;
                break;
            default:
                pos = this.camPortrait.pos;
                rot = this.camPortrait.rot;
                break;
        }
        this.camera.moveCamera(pos, rot, time);
        alt.setTimeout(() => {
            this.event.emitGui("charcreator:resetcamerabuttons");
        }, time + 10);
    }
    onRotateCharacter(dir) {
        this.update.remove(this.everyTickRef);
        this.everyTickRef = this.update.add(() => this.tick(dir));
    }
    onRotateStop() {
        this.update.remove(this.everyTickRef);
    }
    onSetForm(form) {
        this.charCreator.setForm(form);
        this.charCreator.resetTypePurchaseOrders(CharacterCreatorPurchaseType.MONEY);
        this.charCreator.resetTypePurchaseOrders(CharacterCreatorPurchaseType.ITEM);
        if (form.startMoney > 0) {
            this.charCreator.addPurchase({
                id: UID(),
                type: CharacterCreatorPurchaseType.MONEY,
                name: `$${form.startMoney} Startgeld`,
                description: "Geld im Inventar des Charakters",
                southCentralPoints: Number.parseInt((form.startMoney * this.MONEY_TO_SOUTH_CENTRAL_POINTS_VALUE).toFixed(0)),
                removeable: false,
                orderedVehicle: null
            });
        }
        if (form.hasPhone) {
            this.charCreator.addPurchase({
                id: UID(),
                type: CharacterCreatorPurchaseType.ITEM,
                name: `Handy`,
                description: "Item im Inventar des Charakters",
                southCentralPoints: Number.parseInt((this.PHONE_POINTS_PRICE).toFixed(0)),
                removeable: false,
                orderedVehicle: null
            });
        }
    }
    onUpdateChar(character, genderChanged) {
        if (genderChanged) {
            this.switchGender(character);
        }
        this.updateCharacter(character);
        this.event.emitGui("clothesmenu:setmaxtexturevariation", this.clothing.getMaxTextureVariations(this.pedId, character.clothes));
        if (this.setNudeMode) {
            this.character.setNude(this.pedId, character.gender);
        }
    }
    onSetNude() {
        this.setNudeMode = true;
        this.character.setNude(this.pedId, this.charCreator.getCharacterData.character.gender);
    }
    onLoadClothes() {
        this.setNudeMode = false;
        this.character.apply(this.charCreator.getCharacterData.character, this.pedId);
    }
    onRequestBuyCharacter(character) {
        this.updateCharacter(character);
        this.dialog.create({
            type: DialogType.TWO_BUTTON_DIALOG,
            title: "Charakter kaufen",
            description: "Bist du dir sicher das du diesen Charakter so kaufen möchtest? Du kannst später einige Dinge nicht mehr anpassen! Beachte das du in allen Tabs oben was einstellen kannst, bist du dir sicher das du den Charakter so erstellen möchtest?",
            hasBankAccountSelection: false,
            hasInputField: false,
            dataJson: "[]",
            freezeGameControls: false,
            primaryButton: "Ja",
            secondaryButton: "Nein",
            primaryButtonClientEvent: "charcreator:buycharacter",
            secondaryButtonClientEvent: "charcreator:cantfinishedcreation",
            closeButtonClientEvent: "charcreator:cantfinishedcreation"
        });
    }
    onBuyCharacter() {
        this.player.fadeOut(500);
        this.loading.show("Transaktion wird bearbeitet...");
        alt.setTimeout(() => {
            this.event.emitServer("charcreator:createcharacter", JSON.stringify(this.charCreator.getCharacterData));
        }, 600);
    }
    createCamera() {
        this.camera.createCamera(this.camPortrait.pos, this.camPortrait.rot);
    }
    tick(dir) {
        let heading = native.getEntityHeading(this.pedId);
        const newHeading = (heading += dir);
        native.setEntityHeading(this.pedId, newHeading);
    }
    switchGender(char) {
        native.deletePed(this.pedId);
        if (char.gender == GenderType.MALE) {
            this.pedId = native.createPed(2, 1885233650, this.characterPos.x, this.characterPos.y, this.characterPos.z, 180, false, false);
        }
        else if (char.gender == GenderType.FEMALE) {
            this.pedId = native.createPed(2, -1667301416, this.characterPos.x, this.characterPos.y, this.characterPos.z, 180, false, false);
        }
        char.father = 0;
        char.mother = 21;
        char.similarity = (char.gender === GenderType.MALE) ? 0 : 1;
        char.skinSimilarity = (char.gender === GenderType.MALE) ? 0 : 1;
        char.appearances.hair = 0;
        this.event.emitGui("charcreator:setgender", char.gender, this.clothing.getMaxDrawableVariations(this.pedId));
    }
    updateCharacter(character) {
        // Generate cloth items based on the given cloth interface. 
        character.inventory.items = this.charCreator.getInventoryClothingItems(character);
        // Save the torso extra because its not a cloth item.
        if (character.clothes.torso) {
            character.torso = character.clothes.torso.drawableId;
            character.torsoTexture = character.clothes.torso.textureId;
        }
        this.charCreator.setCharacter(character);
        this.character.apply(character, this.pedId);
    }
};
__decorate([
    onServer("charcreator:open"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Boolean, Number, Number, Number]),
    __metadata("design:returntype", Promise)
], CharacterCreatorHandler.prototype, "onOpen", null);
__decorate([
    onGui("charcreator:resetcamera"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CharacterCreatorHandler.prototype, "onResetCamera", null);
__decorate([
    onServer("charcreator:reset"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CharacterCreatorHandler.prototype, "onReset", null);
__decorate([
    onServer("charcreator:cantfinishedcreation"),
    on("charcreator:cantfinishedcreation"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CharacterCreatorHandler.prototype, "onCantFinishedCreation", null);
__decorate([
    onGui("charcreator:removepurchaseorder"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CharacterCreatorHandler.prototype, "onRemovePurchaseOrder", null);
__decorate([
    onGui("charcreator:requestclose"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CharacterCreatorHandler.prototype, "onRequestClose", null);
__decorate([
    on("charcreator:close"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CharacterCreatorHandler.prototype, "onClose", null);
__decorate([
    onGui("charcreator:getcharacter"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CharacterCreatorHandler.prototype, "onGetCharacter", null);
__decorate([
    onGui("charcreator:setcamerapos"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], CharacterCreatorHandler.prototype, "onChangeCamPos", null);
__decorate([
    onGui("charcreator:rotatecharacter"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CharacterCreatorHandler.prototype, "onRotateCharacter", null);
__decorate([
    onGui("charcreator:rotatestop"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CharacterCreatorHandler.prototype, "onRotateStop", null);
__decorate([
    onGui("charcreator:setform"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CharacterCreatorHandler.prototype, "onSetForm", null);
__decorate([
    onGui("charcreator:updatechar"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Boolean]),
    __metadata("design:returntype", void 0)
], CharacterCreatorHandler.prototype, "onUpdateChar", null);
__decorate([
    onGui("charcreator:setnude"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CharacterCreatorHandler.prototype, "onSetNude", null);
__decorate([
    onGui("charcreator:loadclothes"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CharacterCreatorHandler.prototype, "onLoadClothes", null);
__decorate([
    onGui("charcreator:requestbuycharacter"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CharacterCreatorHandler.prototype, "onRequestBuyCharacter", null);
__decorate([
    on("charcreator:buycharacter"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CharacterCreatorHandler.prototype, "onBuyCharacter", null);
CharacterCreatorHandler = __decorate([
    foundation(),
    injectable(),
    __metadata("design:paramtypes", [CameraModule,
        CharacterModule,
        Player,
        EventModule,
        UpdateModule,
        LoggerModule,
        LoadingSpinnerModule,
        CharCreatorModule,
        DialogModule,
        ClothingModule])
], CharacterCreatorHandler);

let CharacterSelectorHandler = class CharacterSelectorHandler {
    event;
    logger;
    character;
    camera;
    player;
    loading;
    gui;
    update;
    pedId;
    cachedCharacters = [];
    lastSelectedCharacterId;
    constructor(event, logger, character, camera, player, loading, gui, update) {
        this.event = event;
        this.logger = logger;
        this.character = character;
        this.camera = camera;
        this.player = player;
        this.loading = loading;
        this.gui = gui;
        this.update = update;
    }
    async openCharSelector(characters, lastSelectedCharacterId) {
        this.cachedCharacters = characters;
        this.player.showCursor();
        this.player.isSpawnedCharacter = false;
        this.player.hideRadarAndHud(true);
        this.player.blockGameControls(true);
        this.createCamera();
        this.lastSelectedCharacterId = lastSelectedCharacterId;
        if (this.cachedCharacters.length !== 0 && this.lastSelectedCharacterId !== undefined) {
            const lastCharacter = this.cachedCharacters.find(cc => cc.id === this.lastSelectedCharacterId);
            if (lastCharacter) {
                await this.loadPed(lastCharacter);
            }
        }
        this.event.emitGui("gui:routeto", "charselector");
        this.loading.show("Lade Charakterauswahl...");
        alt.setTimeout(() => {
            this.player.fadeIn(500);
            this.player.unblurScreen(500);
            this.loading.hide();
            this.gui.focusView();
        }, 700);
    }
    onClose() {
        this.resetCharacter();
    }
    onUpdateCharacters(characters, lastSelectedCharacterId) {
        this.cachedCharacters = characters;
        this.lastSelectedCharacterId = lastSelectedCharacterId;
        if (this.cachedCharacters.length !== 0 && this.lastSelectedCharacterId !== undefined) {
            const lastCharacter = this.cachedCharacters.find(cc => cc.id === this.lastSelectedCharacterId);
            if (lastCharacter) {
                this.loadPed(lastCharacter);
            }
        }
        else {
            this.resetCharacter();
        }
        this.event.emitGui("charselector:setup", this.cachedCharacters, this.lastSelectedCharacterId);
    }
    onCharSelectorLoaded() {
        this.event.emitGui("charselector:setup", this.cachedCharacters, this.lastSelectedCharacterId);
    }
    resetCharacter() {
        if (this.pedId !== undefined) {
            native.deletePed(this.pedId);
            this.pedId = undefined;
        }
    }
    async selectCharacter(id) {
        await this.loadPed(this.cachedCharacters.find(c => c.id === id));
    }
    onPlay(id) {
        this.player.fadeOut(500);
        alt.setTimeout(() => {
            this.event.emitServer("charselector:play", id);
        }, 600);
    }
    onNewChar() {
        this.player.fadeOut(500);
        alt.setTimeout(() => {
            this.event.emitServer("charcreator:requestnewchar");
        }, 700);
    }
    createCamera() {
        const pos = new alt.Vector3(402.7, -998.15, -98.18);
        const rot = new alt.Vector3(-26.96, 0, -3.85);
        this.camera.createCamera(pos, rot);
    }
    async loadPed(character) {
        this.onClose();
        let modelId = 0;
        if (character.gender === GenderType.MALE) {
            modelId = 1885233650;
        }
        if (character.gender === GenderType.FEMALE) {
            modelId = 2627665880;
        }
        await loadModel(modelId);
        this.pedId = native.createPed(2, modelId, 402.7121, -996.778, -100, 180, false, false);
        this.character.apply(character, this.pedId);
    }
};
__decorate([
    onServer("charselector:open"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Number]),
    __metadata("design:returntype", Promise)
], CharacterSelectorHandler.prototype, "openCharSelector", null);
__decorate([
    onServer("charselector:close"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CharacterSelectorHandler.prototype, "onClose", null);
__decorate([
    onServer("charselector:update"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Number]),
    __metadata("design:returntype", void 0)
], CharacterSelectorHandler.prototype, "onUpdateCharacters", null);
__decorate([
    onGui("charselector:ready"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CharacterSelectorHandler.prototype, "onCharSelectorLoaded", null);
__decorate([
    onGui("charselector:reset"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CharacterSelectorHandler.prototype, "resetCharacter", null);
__decorate([
    onGui("charselector:select"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CharacterSelectorHandler.prototype, "selectCharacter", null);
__decorate([
    onGui("charselector:play"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CharacterSelectorHandler.prototype, "onPlay", null);
__decorate([
    onGui("charselector:newchar"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CharacterSelectorHandler.prototype, "onNewChar", null);
CharacterSelectorHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        LoggerModule,
        CharacterModule,
        CameraModule,
        Player,
        LoadingSpinnerModule,
        GuiModule,
        UpdateModule])
], CharacterSelectorHandler);

var KeyCodes;
(function (KeyCodes) {
    KeyCodes[KeyCodes["BACKSPACE"] = 8] = "BACKSPACE";
    KeyCodes[KeyCodes["TAB"] = 9] = "TAB";
    KeyCodes[KeyCodes["ENTER"] = 13] = "ENTER";
    KeyCodes[KeyCodes["SHIFT"] = 16] = "SHIFT";
    KeyCodes[KeyCodes["CTRL"] = 17] = "CTRL";
    KeyCodes[KeyCodes["ALT"] = 18] = "ALT";
    KeyCodes[KeyCodes["PAUSE"] = 19] = "PAUSE";
    KeyCodes[KeyCodes["CAPS_LOCK"] = 20] = "CAPS_LOCK";
    KeyCodes[KeyCodes["ESCAPE"] = 27] = "ESCAPE";
    KeyCodes[KeyCodes["SPACE"] = 32] = "SPACE";
    KeyCodes[KeyCodes["PAGE_UP"] = 33] = "PAGE_UP";
    KeyCodes[KeyCodes["PAGE_DOWN"] = 34] = "PAGE_DOWN";
    KeyCodes[KeyCodes["END"] = 35] = "END";
    KeyCodes[KeyCodes["HOME"] = 36] = "HOME";
    KeyCodes[KeyCodes["LEFT_ARROW"] = 37] = "LEFT_ARROW";
    KeyCodes[KeyCodes["UP_ARROW"] = 38] = "UP_ARROW";
    KeyCodes[KeyCodes["RIGHT_ARROW"] = 39] = "RIGHT_ARROW";
    KeyCodes[KeyCodes["DOWN_ARROW"] = 40] = "DOWN_ARROW";
    KeyCodes[KeyCodes["INSERT"] = 45] = "INSERT";
    KeyCodes[KeyCodes["DELETE"] = 46] = "DELETE";
    KeyCodes[KeyCodes["_0"] = 48] = "_0";
    KeyCodes[KeyCodes["_1"] = 49] = "_1";
    KeyCodes[KeyCodes["_2"] = 50] = "_2";
    KeyCodes[KeyCodes["_3"] = 51] = "_3";
    KeyCodes[KeyCodes["_4"] = 52] = "_4";
    KeyCodes[KeyCodes["_5"] = 53] = "_5";
    KeyCodes[KeyCodes["_6"] = 54] = "_6";
    KeyCodes[KeyCodes["_7"] = 55] = "_7";
    KeyCodes[KeyCodes["_8"] = 56] = "_8";
    KeyCodes[KeyCodes["_9"] = 57] = "_9";
    KeyCodes[KeyCodes["A"] = 65] = "A";
    KeyCodes[KeyCodes["B"] = 66] = "B";
    KeyCodes[KeyCodes["C"] = 67] = "C";
    KeyCodes[KeyCodes["D"] = 68] = "D";
    KeyCodes[KeyCodes["E"] = 69] = "E";
    KeyCodes[KeyCodes["F"] = 70] = "F";
    KeyCodes[KeyCodes["G"] = 71] = "G";
    KeyCodes[KeyCodes["H"] = 72] = "H";
    KeyCodes[KeyCodes["I"] = 73] = "I";
    KeyCodes[KeyCodes["J"] = 74] = "J";
    KeyCodes[KeyCodes["K"] = 75] = "K";
    KeyCodes[KeyCodes["L"] = 76] = "L";
    KeyCodes[KeyCodes["M"] = 77] = "M";
    KeyCodes[KeyCodes["N"] = 78] = "N";
    KeyCodes[KeyCodes["O"] = 79] = "O";
    KeyCodes[KeyCodes["P"] = 80] = "P";
    KeyCodes[KeyCodes["Q"] = 81] = "Q";
    KeyCodes[KeyCodes["R"] = 82] = "R";
    KeyCodes[KeyCodes["S"] = 83] = "S";
    KeyCodes[KeyCodes["T"] = 84] = "T";
    KeyCodes[KeyCodes["U"] = 85] = "U";
    KeyCodes[KeyCodes["V"] = 86] = "V";
    KeyCodes[KeyCodes["W"] = 87] = "W";
    KeyCodes[KeyCodes["X"] = 88] = "X";
    KeyCodes[KeyCodes["Y"] = 89] = "Y";
    KeyCodes[KeyCodes["Z"] = 90] = "Z";
    KeyCodes[KeyCodes["LEFT_META"] = 91] = "LEFT_META";
    KeyCodes[KeyCodes["RIGHT_META"] = 92] = "RIGHT_META";
    KeyCodes[KeyCodes["SELECT"] = 93] = "SELECT";
    KeyCodes[KeyCodes["NUMPAD_0"] = 96] = "NUMPAD_0";
    KeyCodes[KeyCodes["NUMPAD_1"] = 97] = "NUMPAD_1";
    KeyCodes[KeyCodes["NUMPAD_2"] = 98] = "NUMPAD_2";
    KeyCodes[KeyCodes["NUMPAD_3"] = 99] = "NUMPAD_3";
    KeyCodes[KeyCodes["NUMPAD_4"] = 100] = "NUMPAD_4";
    KeyCodes[KeyCodes["NUMPAD_5"] = 101] = "NUMPAD_5";
    KeyCodes[KeyCodes["NUMPAD_6"] = 102] = "NUMPAD_6";
    KeyCodes[KeyCodes["NUMPAD_7"] = 103] = "NUMPAD_7";
    KeyCodes[KeyCodes["NUMPAD_8"] = 104] = "NUMPAD_8";
    KeyCodes[KeyCodes["NUMPAD_9"] = 105] = "NUMPAD_9";
    KeyCodes[KeyCodes["MULTIPLY"] = 106] = "MULTIPLY";
    KeyCodes[KeyCodes["ADD"] = 107] = "ADD";
    KeyCodes[KeyCodes["SUBTRACT"] = 109] = "SUBTRACT";
    KeyCodes[KeyCodes["DECIMAL"] = 110] = "DECIMAL";
    KeyCodes[KeyCodes["DIVIDE"] = 111] = "DIVIDE";
    KeyCodes[KeyCodes["F1"] = 112] = "F1";
    KeyCodes[KeyCodes["F2"] = 113] = "F2";
    KeyCodes[KeyCodes["F3"] = 114] = "F3";
    KeyCodes[KeyCodes["F4"] = 115] = "F4";
    KeyCodes[KeyCodes["F5"] = 116] = "F5";
    KeyCodes[KeyCodes["F6"] = 117] = "F6";
    KeyCodes[KeyCodes["F7"] = 118] = "F7";
    KeyCodes[KeyCodes["F8"] = 119] = "F8";
    KeyCodes[KeyCodes["F9"] = 120] = "F9";
    KeyCodes[KeyCodes["F10"] = 121] = "F10";
    KeyCodes[KeyCodes["F11"] = 122] = "F11";
    KeyCodes[KeyCodes["F12"] = 123] = "F12";
    KeyCodes[KeyCodes["NUM_LOCK"] = 144] = "NUM_LOCK";
    KeyCodes[KeyCodes["SCROLL_LOCK"] = 145] = "SCROLL_LOCK";
    KeyCodes[KeyCodes["SEMICOLON"] = 186] = "SEMICOLON";
    KeyCodes[KeyCodes["EQUALS"] = 187] = "EQUALS";
    KeyCodes[KeyCodes["COMMA"] = 188] = "COMMA";
    KeyCodes[KeyCodes["DASH"] = 189] = "DASH";
    KeyCodes[KeyCodes["PERIOD"] = 190] = "PERIOD";
    KeyCodes[KeyCodes["FORWARD_SLASH"] = 191] = "FORWARD_SLASH";
    KeyCodes[KeyCodes["GRAVE_ACCENT"] = 192] = "GRAVE_ACCENT";
    KeyCodes[KeyCodes["OPEN_BRACKET"] = 219] = "OPEN_BRACKET";
    KeyCodes[KeyCodes["BACK_SLASH"] = 220] = "BACK_SLASH";
    KeyCodes[KeyCodes["CLOSE_BRACKET"] = 221] = "CLOSE_BRACKET";
    KeyCodes[KeyCodes["SINGLE_QUOTE"] = 222] = "SINGLE_QUOTE";
})(KeyCodes || (KeyCodes = {}));

class AnimationOptions {
    speed = 3;
    speedMultiplier = -8;
    duration = -1;
    flag;
    playbackRate = 0;
    lockX = false;
    lockY = false;
    lockZ = false;
}

let AnimationModule = class AnimationModule {
    dicts = new Map();
    constructor() {
    }
    /**
     * Load and cache animations
     *
     * @param {string} dict
     * @returns {Promise<boolean>}
     */
    load(dict) {
        return new Promise((resolve) => {
            if (this.dicts.has(dict)) {
                return resolve(true);
            }
            native.requestAnimDict(dict);
            let interval = alt.setInterval(() => {
                if (native.hasAnimDictLoaded(dict)) {
                    this.dicts.set(dict, true);
                    alt.clearInterval(interval);
                    return resolve(true);
                }
            }, 10);
        });
    }
    /**
     * Play Animation for current player
     *
     * @param {string} dict
     * @param {string} clip
     * @param {AnimationOptions} options
     */
    play(dict, clip, options = {}) {
        const defaultOptions = new AnimationOptions();
        options = { ...defaultOptions, ...options };
        native.taskPlayAnim(alt.Player.local.scriptID, dict, clip, options.speed, options.speedMultiplier, options.duration, options.flag, options.playbackRate, options.lockX, options.lockY, options.lockZ);
    }
    clear() {
        native.clearPedTasks(alt.Player.local.scriptID);
    }
    isPlaying(dict, clip) {
        return native.isEntityPlayingAnim(alt.Player.local.scriptID, dict, clip, 3);
    }
};
AnimationModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [])
], AnimationModule);

let RaycastModule = class RaycastModule {
    constructor() {
    }
    /**
     * Shoots a line racast and returns a result object.
     * @param startPos The start position from the raycast.
     * @param dir The direction from the raycast.
     * @param dist The max distance for the raycast, be carefull Number.MAX_VALUE dosen't work.
     * @param flags The diffrent flags for this raycast, see wiki for more informations.
     * @param ignoredEntity The entity that get ignored when the raycast got fired.
     */
    line(startPos, dir, dist, flags, ignoredEntity) {
        let targetPos = this.getTargetPos(startPos, new alt.Vector3(dir.x * dist, dir.y * dist, dir.z * dist));
        let ray = native.startExpensiveSynchronousShapeTestLosProbe(startPos.x, startPos.y, startPos.z, targetPos.x, targetPos.y, targetPos.z, flags, ignoredEntity, // entity that get ignored from raycast.
        0);
        return this.result(ray);
    }
    getTargetPos(entityVector, forwardVector) {
        return new alt.Vector3(entityVector.x + forwardVector.x, entityVector.y + forwardVector.y, entityVector.z + forwardVector.z);
    }
    result(ray) {
        let result = native.getShapeTestResult(ray, undefined, undefined, undefined, undefined);
        let hitEntity = result[4];
        return {
            isHit: result[1],
            pos: new alt.Vector3(result[2].x, result[2].y, result[2].z),
            normal: new alt.Vector3(result[3].x, result[3].y, result[3].z),
            entity: hitEntity
        };
    }
    getModel(entity) {
        if (!native.isModelValid(entity))
            return null;
        native.getEntityModel(entity);
    }
};
RaycastModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [])
], RaycastModule);

let MathModule = class MathModule {
    raycast;
    camera;
    logger;
    constructor(raycast, camera, logger) {
        this.raycast = raycast;
        this.camera = camera;
        this.logger = logger;
    }
    // Get the direction based on rotation.
    rotationToDirection(rotation) {
        const z = this.degToRad(rotation.z);
        const x = this.degToRad(rotation.x);
        const num = Math.abs(Math.cos(x));
        return new alt.Vector3(-Math.sin(z) * num, Math.cos(z) * num, Math.sin(x));
    }
    // Get the distance between to vectors.
    distance(vector1, vector2) {
        const x = vector1.x - vector2.x;
        const y = vector1.y - vector2.y;
        const z = vector1.z - vector2.z;
        return Math.sqrt(x * x + y * y + z * z);
    }
    screenToWorld(x, y, flags, ignore = 0, distance = 1000) {
        const camera = this.camera.getCamera;
        let camPos;
        if (camera) {
            camPos = native.getCamCoord(this.camera.getCamera);
        }
        else {
            camPos = native.getGameplayCamCoord();
        }
        const processedCoords = this.processCoordinates(x, y);
        const target = this.s2w(camPos, processedCoords.x, processedCoords.y);
        const dir = this.subVector3(target, camPos);
        return this.raycast.line(camPos, dir, distance, flags, ignore);
    }
    getEntityFrontPosition(entityHandle, distance = 0) {
        const modelDimensions = native.getModelDimensions(native.getEntityModel(entityHandle), undefined, undefined);
        return this.getOffsetPositionInWorldCoords(entityHandle, new alt.Vector3(0, modelDimensions[2].y + distance, 0));
    }
    getEntityRearPosition(entityHandle) {
        const modelDimensions = native.getModelDimensions(native.getEntityModel(entityHandle), undefined, undefined);
        return this.getOffsetPositionInWorldCoords(entityHandle, new alt.Vector3(0, modelDimensions[1].y, 0));
    }
    getOffsetPositionInWorldCoords(entityHandle, offset) {
        return native.getOffsetFromEntityInWorldCoords(entityHandle, offset.x, offset.y, offset.z);
    }
    worldToScreen(position) {
        let result = native.getScreenCoordFromWorldCoord(position.x, position.y, position.z, undefined, undefined);
        if (!result[0]) {
            return undefined;
        }
        return new alt.Vector3((result[1] - 0.5) * 2, (result[2] - 0.5) * 2, 0);
    }
    degToRad(deg) {
        return (deg * Math.PI) / 180.0;
    }
    radToDeg(rad) {
        return (rad * 180.0) / Math.PI;
    }
    addVector3(vector1, vector2) {
        return new alt.Vector3(vector1.x + vector2.x, vector1.y + vector2.y, vector1.z + vector2.z);
    }
    subVector3(vector1, vector2) {
        return new alt.Vector3(vector1.x - vector2.x, vector1.y - vector2.y, vector1.z - vector2.z);
    }
    mulVector(vector1, value) {
        return new alt.Vector3(vector1.x * value, vector1.y * value, vector1.z * value);
    }
    dot(vector1, vector2) {
        return (vector1.x * vector2.x) + (vector1.y * vector2.y) + (vector1.z * vector2.z);
    }
    normalize2d(x, y) {
        const t = native.sqrt(x * x + y * y);
        if (t > 0.000001) {
            let fRcpt = 1 / t;
            x *= fRcpt;
            y *= fRcpt;
        }
        return new alt.Vector3(x, y, 0);
    }
    getPointAtPoint(pos, radius, angle) {
        const p = {
            x: 0,
            y: 0
        };
        let s = radius * Math.sin(angle);
        let c = radius * Math.cos(angle);
        p.x = pos.x + s;
        p.y = pos.y + c;
        return p;
    }
    processCoordinates(x, y) {
        var res = native.getActiveScreenResolution(0, 0);
        let screenX = res[1];
        let screenY = res[2];
        let relativeX = 1 - (x / screenX) * 1.0 * 2;
        let relativeY = 1 - (y / screenY) * 1.0 * 2;
        if (relativeX > 0.0) {
            relativeX = -relativeX;
        }
        else {
            relativeX = Math.abs(relativeX);
        }
        if (relativeY > 0.0) {
            relativeY = -relativeY;
        }
        else {
            relativeY = Math.abs(relativeY);
        }
        return { x: relativeX, y: relativeY };
    }
    s2w(camPos, relX, relY) {
        let camRot;
        const camera = this.camera.getCamera;
        if (camera)
            camRot = native.getCamRot(this.camera.getCamera, 2);
        else
            camRot = native.getGameplayCamRot(2);
        const camForward = this.rotationToDirection(camRot);
        const rotUp = this.addVector3(camRot, new alt.Vector3(10, 0, 0));
        const rotDown = this.addVector3(camRot, new alt.Vector3(-10, 0, 0));
        const rotLeft = this.addVector3(camRot, new alt.Vector3(0, 0, -10));
        const rotRight = this.addVector3(camRot, new alt.Vector3(0, 0, 10));
        let camRight = this.subVector3(this.rotationToDirection(rotRight), this.rotationToDirection(rotLeft));
        let camUp = this.subVector3(this.rotationToDirection(rotUp), this.rotationToDirection(rotDown));
        let rollRad = -this.degToRad(camRot.y);
        let camRightRoll = this.subVector3(this.mulVector(camRight, Math.cos(rollRad)), this.mulVector(camUp, Math.sin(rollRad)));
        let camUpRoll = this.addVector3(this.mulVector(camRight, Math.sin(rollRad)), this.mulVector(camUp, Math.cos(rollRad)));
        let point3D = this.addVector3(this.addVector3(this.addVector3(camPos, this.mulVector(camForward, 10.0)), camRightRoll), camUpRoll);
        let point2D = this.worldToScreen(point3D);
        if (point2D === undefined) {
            return this.addVector3(camPos, this.mulVector(camForward, 10.0));
        }
        let point3DZero = this.addVector3(camPos, this.mulVector(camForward, 10.0));
        let point2DZero = this.worldToScreen(point3DZero);
        if (point2DZero === undefined) {
            return this.addVector3(camPos, this.mulVector(camForward, 10.0));
        }
        let eps = 0.001;
        if (Math.abs(point2D.x - point2DZero.x) < eps ||
            Math.abs(point2D.y - point2DZero.y) < eps) {
            return this.addVector3(camPos, this.mulVector(camForward, 10.0));
        }
        let scaleX = (relX - point2DZero.x) / (point2D.x - point2DZero.x);
        let scaleY = (relY - point2DZero.y) / (point2D.y - point2DZero.y);
        let point3Dret = this.addVector3(this.addVector3(this.addVector3(camPos, this.mulVector(camForward, 10.0)), this.mulVector(camRightRoll, scaleX)), this.mulVector(camUpRoll, scaleY));
        return point3Dret;
    }
};
MathModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [RaycastModule,
        CameraModule,
        LoggerModule])
], MathModule);

let FreeCamModule = class FreeCamModule {
    math;
    camera;
    update;
    player;
    event;
    logger;
    get isActive() {
        return this.isFreeCamActive;
    }
    freezed;
    actions = {
        moveF: false,
        moveB: false,
        moveL: false,
        moveR: false,
        moveU: false,
        moveD: false,
    };
    speed = {
        move: 2.0,
        turn: 1.5
    };
    everyTickRef;
    updatePosInterval;
    isFreeCamActive;
    leftMouseClicked;
    spectatingTarget;
    constructor(math, camera, update, player, event, logger) {
        this.math = math;
        this.camera = camera;
        this.update = update;
        this.player = player;
        this.event = event;
        this.logger = logger;
    }
    start(pos, rot = new alt.Vector3(0, 0, 0)) {
        this.camera.createCamera(pos, rot);
        this.isFreeCamActive = true;
        this.player.freeze();
        this.unfreeze();
        native.setEntityAlpha(alt.Player.local.scriptID, 0, false);
        native.setEntityCollision(alt.Player.local.scriptID, false, false);
        native.freezeEntityPosition(alt.Player.local.scriptID, true);
        native.setPedCanBeTargetted(alt.Player.local.scriptID, false);
        alt.toggleGameControls(true);
        native.networkSetEntityInvisibleToNetwork(alt.Player.local.scriptID, true);
        alt.on('keydown', (key) => this.keydown(key));
        alt.on('keyup', (key) => this.keyup(key));
        if (this.everyTickRef) {
            this.update.remove(this.everyTickRef);
            this.everyTickRef = undefined;
        }
        this.everyTickRef = this.update.add(() => this.tick());
        this.updatePosInterval = alt.setInterval(() => {
            if (!this.spectatingTarget) {
                if (this.camera.getCamera) {
                    this.event.emitServer("freecam:update", this.camera.camPos.x, this.camera.camPos.y, this.camera.camPos.z);
                }
            }
            else {
                const coords = native.getEntityCoords(this.spectatingTarget, true);
                this.event.emitServer("freecam:update", coords.x, coords.y, coords.z + 2);
            }
        }, 500);
        this.event.emitGui("hud:setfreecam", true);
    }
    setPos(pos) {
        if (this.everyTickRef) {
            this.update.remove(this.everyTickRef);
            this.everyTickRef = undefined;
        }
        this.camera.setPos(pos);
        alt.setTimeout(() => {
            this.everyTickRef = this.update.add(() => this.tick());
        }, 100);
    }
    stop(teleportToPosition) {
        if (teleportToPosition) {
            if (this.spectatingTarget) {
                const coords = native.getEntityCoords(this.spectatingTarget, true);
                this.event.emitServer("freecam:stop", coords.x, coords.y, coords.z + 2);
            }
            else {
                this.event.emitServer("freecam:stop", this.camera.camPos.x, this.camera.camPos.y, this.camera.camPos.z);
            }
        }
        this.camera.destroyCamera();
        this.isFreeCamActive = false;
        this.player.unfreeze();
        if (this.spectatingTarget) {
            this.spectatingTarget = undefined;
            native.networkSetInSpectatorMode(false, undefined);
        }
        native.resetEntityAlpha(alt.Player.local.scriptID);
        native.setEntityCollision(alt.Player.local.scriptID, true, true);
        native.freezeEntityPosition(alt.Player.local.scriptID, false);
        native.setPedCanBeTargetted(alt.Player.local.scriptID, true);
        native.networkSetEntityInvisibleToNetwork(alt.Player.local.scriptID, false);
        alt.off('keydown', (key) => this.keydown(key));
        alt.off('keyup', (key) => this.keyup(key));
        if (this.everyTickRef) {
            this.update.remove(this.everyTickRef);
            this.everyTickRef = undefined;
        }
        if (this.updatePosInterval !== undefined) {
            alt.clearInterval(this.updatePosInterval);
        }
        this.event.emitGui("hud:setfreecam", false);
    }
    tick() {
        if (!this.spectatingTarget) {
            if (!this.freezed) {
                this.executeActions();
            }
            this.blockActionsWhileFreecam();
        }
        else {
            const coords = native.getEntityCoords(this.spectatingTarget, true);
            native.setEntityCoords(alt.Player.local.scriptID, coords.x, coords.y, coords.z, false, false, false, false);
            this.blockActionsWhileSpectating();
        }
        this.handleMouseClicks();
    }
    freeze() {
        if (this.freezed)
            return;
        this.freezed = true;
    }
    unfreeze() {
        if (!this.freezed)
            return;
        this.freezed = false;
    }
    keydown(key) {
        if (key == KeyCodes.W) {
            this.actions.moveF = true;
        }
        if (key == KeyCodes.A) {
            this.actions.moveL = true;
        }
        if (key == KeyCodes.D) {
            this.actions.moveR = true;
        }
        if (key == KeyCodes.S) {
            this.actions.moveB = true;
        }
        if (key == KeyCodes.SPACE) {
            this.actions.moveU = true;
        }
        if (key == KeyCodes.SHIFT) {
            this.actions.moveD = true;
        }
    }
    keyup(key) {
        if (key == KeyCodes.W) {
            this.actions.moveF = false;
        }
        if (key == KeyCodes.A) {
            this.actions.moveL = false;
        }
        if (key == KeyCodes.D) {
            this.actions.moveR = false;
        }
        if (key == KeyCodes.S) {
            this.actions.moveB = false;
        }
        if (key == KeyCodes.SPACE) {
            this.actions.moveU = false;
        }
        if (key == KeyCodes.SHIFT) {
            this.actions.moveD = false;
        }
    }
    executeActions() {
        let camPos = native.getCamCoord(this.camera.getCamera);
        let camRot = native.getCamRot(this.camera.getCamera, 2);
        let camDir = this.math.rotationToDirection(camRot);
        if (this.actions.moveF) {
            let x = camPos.x + (camDir.x * this.speed.move);
            let y = camPos.y + (camDir.y * this.speed.move);
            let z = camPos.z + (camDir.z * this.speed.move);
            camPos = new alt.Vector3(x, y, z);
        }
        if (this.actions.moveB) {
            let x = camPos.x - (camDir.x * this.speed.move);
            let y = camPos.y - (camDir.y * this.speed.move);
            let z = camPos.z - (camDir.z * this.speed.move);
            camPos = new alt.Vector3(x, y, z);
        }
        if (this.actions.moveR) {
            let camDir = this.calcCameraDirectionRight(camRot);
            let x = camPos.x + (camDir.x * this.speed.move);
            let y = camPos.y + (camDir.y * this.speed.move);
            let z = camPos.z;
            camPos = new alt.Vector3(x, y, z);
        }
        if (this.actions.moveL) {
            let camDir = this.calcCameraDirectionRight(camRot);
            let x = camPos.x - (camDir.x * this.speed.move);
            let y = camPos.y - (camDir.y * this.speed.move);
            let z = camPos.z;
            camPos = new alt.Vector3(x, y, z);
        }
        if (this.actions.moveU) {
            let z = camPos.z + this.speed.move;
            camPos = new alt.Vector3(camPos.x, camPos.y, z);
        }
        if (this.actions.moveD) {
            let z = camPos.z - this.speed.move;
            camPos = new alt.Vector3(camPos.x, camPos.y, z);
        }
        const rightAxisX = native.getDisabledControlNormal(0, InputType.SCRIPT_RIGHT_AXIS_X);
        const rightAxisY = native.getDisabledControlNormal(0, InputType.SCRIPT_RIGHT_AXIS_Y);
        let x = camRot.x + rightAxisY * -5.0;
        let z = camRot.z + rightAxisX * -5.0;
        // Clamp the value between 80 and negative 80.
        x = Math.min(Math.max(x, -80), 80);
        camRot = new alt.Vector3(x, 0, z);
        native.setCamRot(this.camera.getCamera, camRot.x, camRot.y, camRot.z, 2);
        let scrollWheel = -native.getDisabledControlNormal(0, InputType.WEAPON_WHEEL_NEXT);
        scrollWheel += native.getDisabledControlNormal(0, InputType.WEAPON_WHEEL_PREV);
        if (scrollWheel != 0) {
            this.speed.move += scrollWheel * 0.25;
            this.speed.move = Math.min(Math.max(this.speed.move, 0.001), 20);
        }
        this.camera.setPos({ x: camPos.x, y: camPos.y, z: camPos.z });
    }
    handleMouseClicks() {
        const attack = native.getDisabledControlNormal(0, InputType.ATTACK);
        if (attack > 0) {
            if (this.leftMouseClicked) {
                return;
            }
            this.leftMouseClicked = true;
            if (this.spectatingTarget) {
                this.spectatingTarget = undefined;
                this.camera.createCamera(alt.Player.local.pos, alt.Player.local.rot);
                native.networkSetInSpectatorMode(false, undefined);
            }
            else {
                const entity = this.getEntiyAroundMouse();
                if (!entity) {
                    return;
                }
                this.camera.destroyCamera();
                this.spectatingTarget = entity;
                const coords = native.getEntityCoords(this.spectatingTarget, true);
                native.setEntityCoords(alt.Player.local.scriptID, coords.x, coords.y, coords.z, false, false, false, false);
                native.setHdArea(coords.x, coords.y, coords.z, 30);
                native.requestCollisionAtCoord(coords.x, coords.y, coords.z);
                alt.nextTick(() => {
                    native.networkSetInSpectatorMode(true, this.spectatingTarget);
                });
            }
        }
        else {
            this.leftMouseClicked = false;
        }
    }
    blockActionsWhileFreecam() {
        native.disableControlAction(0, InputType.LOOK_LR, true);
        native.disableControlAction(0, InputType.LOOK_UD, true);
        native.disableControlAction(0, InputType.SCRIPT_RIGHT_AXIS_X, true);
        native.disableControlAction(0, InputType.SCRIPT_RIGHT_AXIS_Y, true);
        native.disableControlAction(0, InputType.WEAPON_WHEEL_NEXT, true);
        native.disableControlAction(0, InputType.WEAPON_WHEEL_PREV, true);
        native.disableControlAction(0, InputType.SELECT_NEXT_WEAPON, true);
        native.disableControlAction(0, InputType.SELECT_PREV_WEAPON, true);
        native.disableControlAction(0, InputType.SELECT_WEAPON, true);
        native.disableControlAction(0, InputType.NEXT_WEAPON, true);
        native.disableControlAction(0, InputType.PREV_WEAPON, true);
        native.disableControlAction(0, InputType.AIM, true);
        native.disableControlAction(0, InputType.ATTACK, true);
        native.disableControlAction(0, InputType.ATTACK2, true);
        native.disableControlAction(0, InputType.MELEE_ATTACK_LIGHT, true);
        native.disableControlAction(0, InputType.MELEE_ATTACK_HEAVY, true);
        native.disableControlAction(0, InputType.MELEE_ATTACK_ALTERNATE, true);
    }
    blockActionsWhileSpectating() {
        native.disableControlAction(0, InputType.SCRIPT_RIGHT_AXIS_X, true);
        native.disableControlAction(0, InputType.SCRIPT_RIGHT_AXIS_Y, true);
        native.disableControlAction(0, InputType.WEAPON_WHEEL_NEXT, true);
        native.disableControlAction(0, InputType.WEAPON_WHEEL_PREV, true);
        native.disableControlAction(0, InputType.SELECT_NEXT_WEAPON, true);
        native.disableControlAction(0, InputType.SELECT_PREV_WEAPON, true);
        native.disableControlAction(0, InputType.SELECT_WEAPON, true);
        native.disableControlAction(0, InputType.NEXT_WEAPON, true);
        native.disableControlAction(0, InputType.PREV_WEAPON, true);
        native.disableControlAction(0, InputType.AIM, true);
        native.disableControlAction(0, InputType.ATTACK, true);
        native.disableControlAction(0, InputType.ATTACK2, true);
        native.disableControlAction(0, InputType.MELEE_ATTACK_LIGHT, true);
        native.disableControlAction(0, InputType.MELEE_ATTACK_HEAVY, true);
        native.disableControlAction(0, InputType.MELEE_ATTACK_ALTERNATE, true);
    }
    calcCameraDirectionRight(camRot) {
        let rotInRad = {
            x: camRot.x * (Math.PI / 180),
            y: camRot.y * (Math.PI / 180),
            z: camRot.z * (Math.PI / 180)
        };
        let camDir = {
            x: Math.cos(rotInRad.z),
            y: Math.sin(rotInRad.z),
            z: Math.sin(rotInRad.x)
        };
        return camDir;
    }
    getEntiyAroundMouse() {
        const [, x, y] = native.getActiveScreenResolution(0, 0);
        const pos = new alt.Vector3(x * 0.5, y * 0.5, 0);
        const worldCord = this.math.screenToWorld(pos.x, pos.y, -1, this.camera.getCamera, 5000);
        if (worldCord.isHit) {
            const closestVehicle = this.getClosestVehicle(worldCord.pos);
            if (closestVehicle) {
                return closestVehicle.scriptID;
            }
            const player = this.getClosestPlayer(worldCord.pos);
            if (player) {
                return player.scriptID;
            }
            return undefined;
        }
    }
    getClosestVehicle(pos) {
        let radius = 5;
        let closestDistance = -1;
        let closestVehicle = undefined;
        for (let i = 0; i < alt.Vehicle.all.length; i++) {
            const veh = alt.Vehicle.all[i];
            const distance = veh.pos.distanceTo(pos);
            if (distance <= radius && (distance < closestDistance || closestDistance == -1)) {
                closestDistance = distance;
                closestVehicle = veh;
            }
        }
        return closestVehicle;
    }
    getClosestPlayer(pos) {
        let radius = 5;
        let closestDistance = -1;
        let closestPlayer = undefined;
        for (let i = 0; i < alt.Player.all.length; i++) {
            const player = alt.Player.all[i];
            if (player.scriptID === alt.Player.local.scriptID) {
                continue;
            }
            const distance = player.pos.distanceTo(pos);
            if (distance <= radius && (distance < closestDistance || closestDistance == -1)) {
                closestDistance = distance;
                closestPlayer = player;
            }
        }
        return closestPlayer;
    }
};
FreeCamModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [MathModule,
        CameraModule,
        UpdateModule,
        Player,
        EventModule,
        LoggerModule])
], FreeCamModule);

let ChatModule = class ChatModule {
    event;
    freecam;
    player;
    gui;
    update;
    ready = false;
    inputActive = false;
    chatVisible = false;
    showTimestamp = false;
    updateId;
    constructor(event, freecam, player, gui, update) {
        this.event = event;
        this.freecam = freecam;
        this.player = player;
        this.gui = gui;
        this.update = update;
    }
    openChat() {
        if (!this.chatVisible || this.inputActive
            || this.player.getIsAnyTextFieldFocused
            || this.player.getIsAnyTextOpen)
            return;
        if (this.freecam.isActive) {
            this.freecam.freeze();
        }
        this.player.showCursor();
        this.player.blockESC(true);
        this.gui.focusView();
        this.setChatInput(true);
    }
    closeChat(delay = 0) {
        if (!this.chatVisible)
            return;
        this.player.blockESC(false);
        this.setChatInput(false, delay);
    }
    sendMessage(message) {
        this.event.emitGui("chat:pushmessage", message);
    }
    toggleChatVisibility() {
        this.chatVisible = !this.chatVisible;
        this.event.emitGui("chat:togglevisibility", this.chatVisible);
    }
    toggleTimestamp() {
        this.showTimestamp = !this.showTimestamp;
        this.event.emitGui("chat:toggletimestamp", this.showTimestamp);
    }
    setChatInput(state, delay = 0) {
        this.player.setIsChatting = state;
        this.inputActive = state;
        if (state) {
            if (!this.updateId) {
                this.updateId = this.update.add(() => this.toggleActions(false));
            }
            this.player.blockGameControls(true);
        }
        else {
            alt.setTimeout(() => {
                if (!this.player.getIsInventoryOpen && !this.player.getIsPhoneOpen) {
                    this.player.hideCursor();
                    this.gui.unfocusView();
                }
                this.update.remove(this.updateId);
                this.updateId = null;
                this.player.blockGameControls(false);
                this.toggleActions(true);
            }, delay);
        }
        this.event.emitGui("chat:toggleinput", this.inputActive);
    }
    toggleActions(allowed) {
        native.disableControlAction(0, InputType.ENTER, allowed);
        native.disableControlAction(0, InputType.VEH_EXIT, allowed);
    }
};
ChatModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        FreeCamModule,
        Player,
        GuiModule,
        UpdateModule])
], ChatModule);

let BlipModule = class BlipModule {
    constructor() { }
    createBlip(position, color, sprite, text, longRangeVisible = true) {
        const blip = native.addBlipForCoord(position.x, position.y, position.z);
        native.setBlipSprite(blip, sprite);
        native.setBlipNameFromTextFile(blip, text);
        native.setBlipColour(blip, color);
        native.setBlipDisplay(blip, longRangeVisible ? 2 : 8);
        native.setBlipAsShortRange(blip, !longRangeVisible);
        return blip;
    }
    createBlipForEntity(target, color, sprite, text = null, longRangeVisible = true) {
        const blip = native.addBlipForEntity(target);
        native.setBlipSprite(blip, sprite);
        native.setBlipNameFromTextFile(blip, text);
        native.setBlipColour(blip, color);
        native.setBlipDisplay(blip, longRangeVisible ? 2 : 8);
        return blip;
    }
    destroyBlipForEntity(target) {
        const blip = native.getBlipFromEntity(target);
        if (native.doesBlipExist(blip)) {
            native.removeBlip(blip);
        }
    }
    destroyBlip(blipId) {
        if (native.doesBlipExist(blipId)) {
            native.removeBlip(blipId);
        }
    }
};
BlipModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [])
], BlipModule);

let PericoIslandModule = class PericoIslandModule {
    math;
    islandPos = new alt.Vector3(4895.28, -5744.58, 26.351);
    loaded = false;
    constructor(math) {
        this.math = math;
    }
    loadIsland() {
        //let dist = this.math.distance(this.islandPos, alt.Player.local.pos);
        //if (dist <= 2000 && !this.loaded) {
        //    // @ts-ignore
        //    native.setIplSetEnabled('HeistIsland', true);
        //    this.loaded = true;
        //}
        //else if (dist > 2000 && this.loaded) {
        //    // @ts-ignore
        //    native.setIplSetEnabled('HeistIsland', false);
        //    this.loaded = false;
        //}
    }
};
PericoIslandModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [MathModule])
], PericoIslandModule);

var LeaseCompanyType;
(function (LeaseCompanyType) {
    LeaseCompanyType[LeaseCompanyType["SUPERMARKET"] = 1] = "SUPERMARKET";
    LeaseCompanyType[LeaseCompanyType["CLOTHING_STORE"] = 2] = "CLOTHING_STORE";
    LeaseCompanyType[LeaseCompanyType["HAIR_STUDIO"] = 3] = "HAIR_STUDIO";
    LeaseCompanyType[LeaseCompanyType["TATTOO_STUDIO"] = 4] = "TATTOO_STUDIO";
    LeaseCompanyType[LeaseCompanyType["AMMUNATION"] = 5] = "AMMUNATION";
    LeaseCompanyType[LeaseCompanyType["GAS_STATION"] = 6] = "GAS_STATION";
})(LeaseCompanyType || (LeaseCompanyType = {}));

let LeaseCompanyModule = class LeaseCompanyModule {
    constructor() { }
    getCompanyTypeName(type) {
        switch (type) {
            case LeaseCompanyType.SUPERMARKET:
                return "Supermarkt";
            case LeaseCompanyType.CLOTHING_STORE:
                return "Kleidungsladen";
            case LeaseCompanyType.HAIR_STUDIO:
                return "Haarsalon";
            case LeaseCompanyType.TATTOO_STUDIO:
                return "Tattoostudio";
            case LeaseCompanyType.AMMUNATION:
                return "Waffenladen";
            case LeaseCompanyType.GAS_STATION:
                return "Tankstelle";
        }
    }
    getCompanyTypeBlip(type) {
        switch (type) {
            case LeaseCompanyType.SUPERMARKET:
                return 52;
            case LeaseCompanyType.CLOTHING_STORE:
                return 73;
            case LeaseCompanyType.HAIR_STUDIO:
                return 71;
            case LeaseCompanyType.TATTOO_STUDIO:
                return 75;
            case LeaseCompanyType.AMMUNATION:
                return 110;
            case LeaseCompanyType.GAS_STATION:
                return 361;
        }
    }
};
LeaseCompanyModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [])
], LeaseCompanyModule);

let HouseModule = class HouseModule {
    logger;
    blip;
    leaseCompany;
    player;
    get getHouses() {
        return this.houses;
    }
    get getInteriors() {
        return this.interiors;
    }
    adutyHouseBlips = [];
    leaseCompanyBlips = [];
    ownedHouseBlips = [];
    houses = [];
    interiors = [];
    constructor(logger, blip, leaseCompany, player) {
        this.logger = logger;
        this.blip = blip;
        this.leaseCompany = leaseCompany;
        this.player = player;
    }
    add(house) {
        house.streetName = this.getStreet(house.streetDirection, new alt.Vector3(house.positionX, house.positionY, house.positionZ));
        this.houses.push(house);
    }
    remove(houseId) {
        this.houses = this.houses.filter(h => h.id !== houseId);
    }
    async update(house) {
        this.updateHouse(house);
    }
    async syncChunk(houses) {
        for (const house of houses) {
            house.streetName = this.getStreet(house.streetDirection, new alt.Vector3(house.positionX, house.positionY, house.positionZ));
        }
        this.houses = this.houses.concat(houses);
    }
    syncExits(positions) {
        this.interiors = positions;
    }
    getStreet(direction, pos) {
        const [_, street, crossingStreet] = native.getStreetNameAtCoord(pos.x, pos.y, pos.z, 0, 0);
        if (direction === 1) {
            return native.getStreetNameFromHashKey(street);
        }
        if (direction === 2) {
            return native.getStreetNameFromHashKey(crossingStreet);
        }
    }
    updateBlips() {
        if (this.player.isAduty) {
            this.hideDebugBlips();
            this.showDebugBlips();
        }
        this.hideOwnerIcon();
        this.showOwnerIcon();
        this.hideLeaseCompanyBlips();
        this.showLeaseCompanyBlips();
    }
    showOwnerIcon() {
        this.houses.filter(h => h.houseType === 0 && h.ownerId === this.player.characterId).forEach((house) => {
            this.ownedHouseBlips.push(this.blip.createBlip(new alt.Vector3(house.positionX, house.positionY, house.positionZ), 2, 40, "Deine Immobilie", false));
        });
    }
    showDebugBlips() {
        this.houses.filter(h => h.houseType === 0).forEach((house) => {
            this.adutyHouseBlips.push(this.blip.createBlip(new alt.Vector3(house.positionX, house.positionY, house.positionZ), 2, 40, "Immobilie", false));
        });
    }
    showLeaseCompanyBlips() {
        this.houses.filter(h => h.houseType === 1).forEach((house) => {
            let sprite = this.leaseCompany.getCompanyTypeBlip(house.leaseCompanyType);
            const color = house.playerDuty ? 2 : 4;
            this.leaseCompanyBlips.push(this.blip.createBlip(new alt.Vector3(house.positionX, house.positionY, house.positionZ), color, sprite, "", false));
        });
    }
    hideOwnerIcon() {
        this.ownedHouseBlips.forEach((houseBlip) => {
            this.blip.destroyBlip(houseBlip);
        });
    }
    hideDebugBlips() {
        this.adutyHouseBlips.forEach((houseBlip) => {
            this.blip.destroyBlip(houseBlip);
        });
    }
    hideLeaseCompanyBlips() {
        this.leaseCompanyBlips.forEach((houseBlip) => {
            this.blip.destroyBlip(houseBlip);
        });
    }
    isHouse(house) {
        return house.houseType === 0;
    }
    isLeaseCompany(house) {
        return house.houseType === 1;
    }
    updateHouse(house) {
        const savedHouse = this.houses.find(h => h.id === house.id);
        if (!savedHouse) {
            return;
        }
        house.streetName = this.getStreet(house.streetDirection, new alt.Vector3(house.positionX, house.positionY, house.positionZ));
        const index = this.houses.indexOf(savedHouse);
        this.houses[index] = house;
    }
};
HouseModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [LoggerModule,
        BlipModule,
        LeaseCompanyModule,
        Player])
], HouseModule);

let Vector3 = class Vector3 extends alt.Vector3 {
};
Vector3 = __decorate([
    PrototypeFor(alt.Vector3)
], Vector3);

var AnimationFlag;
(function (AnimationFlag) {
    AnimationFlag[AnimationFlag["Loop"] = 1] = "Loop";
    AnimationFlag[AnimationFlag["StopOnLastFrame"] = 2] = "StopOnLastFrame";
    AnimationFlag[AnimationFlag["OnlyAnimateUpperBody"] = 16] = "OnlyAnimateUpperBody";
    AnimationFlag[AnimationFlag["AllowPlayerControl"] = 32] = "AllowPlayerControl";
    AnimationFlag[AnimationFlag["Cancellable"] = 128] = "Cancellable";
})(AnimationFlag || (AnimationFlag = {}));

let PlayerHandler = class PlayerHandler {
    event;
    player;
    animation;
    update;
    math;
    camera;
    chat;
    blip;
    pericoIsland;
    house;
    logger;
    cuffTick;
    lastSeatShuffle = Date.now();
    adutyPlayerBlips = [];
    dutyInterval;
    constructor(event, player, animation, update, math, camera, chat, blip, pericoIsland, house, logger) {
        this.event = event;
        this.player = player;
        this.animation = animation;
        this.update = update;
        this.math = math;
        this.camera = camera;
        this.chat = chat;
        this.blip = blip;
        this.pericoIsland = pericoIsland;
        this.house = house;
        this.logger = logger;
        this.update.add(() => this.tick());
        alt.setInterval(() => {
            native.invalidateIdleCam();
            native.invalidateVehicleIdleCam();
        }, 20000);
        alt.setInterval(() => {
            this.pericoIsland.loadIsland();
        }, 1000);
    }
    onKeydown(key) {
        if (key === KeyCodes.G) {
            if (this.player.getIsAnyTextOpen) {
                return;
            }
            if (alt.Player.local.vehicle) {
                if (Date.now() < this.lastSeatShuffle)
                    return;
                if (native.canShuffleSeat(alt.Player.local.vehicle.scriptID, 0)) {
                    native.taskShuffleToNextVehicleSeat(alt.Player.local.vehicle.scriptID, alt.Player.local.vehicle.scriptID, 0);
                    this.lastSeatShuffle = Date.now() + 5;
                }
            }
            else {
                const vehicles = alt.Vehicle.all;
                const playerPos = alt.Player.local.pos;
                let closestVehicle;
                let lastDistance = 5;
                vehicles.forEach(vehicle => {
                    const vehiclePosition = vehicle.pos;
                    const distance = this.math.distance(playerPos, vehiclePosition);
                    if (distance < lastDistance) {
                        closestVehicle = vehicle;
                        lastDistance = distance;
                    }
                });
                if (closestVehicle === undefined)
                    return;
                const vehicle = closestVehicle.scriptID;
                const seats = native.getVehicleModelNumberOfSeats(closestVehicle.model);
                for (let i = 0; i < seats; i++) {
                    if (native.isVehicleSeatFree(vehicle, i, false)) {
                        break;
                    }
                    return;
                }
                const boneFRDoor = native.getEntityBoneIndexByName(vehicle, 'door_pside_f'); //Front right
                const posFRDoor = native.getWorldPositionOfEntityBone(vehicle, boneFRDoor);
                const distFRDoor = this.math.distance(new alt.Vector3(posFRDoor.x, posFRDoor.y, posFRDoor.z), alt.Player.local.pos);
                const boneBLDoor = native.getEntityBoneIndexByName(vehicle, 'door_dside_r'); //Back Left
                const posBLDoor = native.getWorldPositionOfEntityBone(vehicle, boneBLDoor);
                const distBLDoor = this.math.distance(new alt.Vector3(posBLDoor.x, posBLDoor.y, posBLDoor.z), alt.Player.local.pos);
                const boneBRDoor = native.getEntityBoneIndexByName(vehicle, 'door_pside_r'); //Back Right
                const posBRDoor = native.getWorldPositionOfEntityBone(vehicle, boneBRDoor);
                const distBRDoor = this.math.distance(new alt.Vector3(posBRDoor.x, posBRDoor.y, posBRDoor.z), alt.Player.local.pos);
                let minDist = Math.min(distFRDoor, distBLDoor, distBRDoor);
                if (minDist == distFRDoor) {
                    if (minDist > 1.8)
                        return;
                    if (native.isVehicleSeatFree(vehicle, 0, false)) {
                        native.taskEnterVehicle(alt.Player.local.scriptID, vehicle, 5000, 0, 2, 1, 0);
                    }
                    else if (native.isVehicleSeatFree(vehicle, 2, false)) {
                        native.taskEnterVehicle(alt.Player.local.scriptID, vehicle, 5000, 2, 2, 1, 0);
                    }
                }
                if (minDist == distBLDoor) {
                    if (minDist > 1.8)
                        return;
                    if (native.isVehicleSeatFree(vehicle, 1, false)) {
                        native.taskEnterVehicle(alt.Player.local.scriptID, vehicle, 5000, 1, 2, 1, 0);
                    }
                }
                if (minDist == distBRDoor) {
                    if (minDist > 1.8)
                        return;
                    if (native.isVehicleSeatFree(vehicle, 2, false)) {
                        native.taskEnterVehicle(alt.Player.local.scriptID, vehicle, 5000, 2, 2, 1, 0);
                    }
                    else if (native.isVehicleSeatFree(vehicle, 0, false)) {
                        native.taskEnterVehicle(alt.Player.local.scriptID, vehicle, 5000, 0, 2, 1, 0);
                    }
                }
            }
        }
    }
    onGameEntityCreate(entity) {
        if (entity instanceof alt.Player) {
            if (this.player.isAduty) {
                this.updateBlips();
            }
        }
    }
    onGameEntityDestroy(entity) {
        if (entity instanceof alt.Player) {
            if (this.player.isAduty) {
                this.updateBlips();
            }
        }
    }
    onSetAduty(state) {
        this.player.isAduty = state;
        native.setPedCanRagdoll(alt.Player.local.scriptID, !state);
        if (state) {
            this.showDebugBlips();
            this.player.showRadar();
        }
        else {
            this.destroyDebugBlips();
            this.player.hideRadar();
        }
    }
    onSetDuty(state, houseId) {
        this.player.isDuty = state;
        if (state) {
            const house = this.house.getHouses.find(h => h.id === houseId);
            this.dutyInterval = alt.setInterval(() => {
                if (this.math.distance(alt.Player.local.pos, new Vector3(house.positionX, house.positionY, house.positionZ)) > 30) {
                    // To far away from lease company house.
                    this.event.emitServer("player:clearduty", house.id);
                    this.player.isDuty = false;
                    alt.clearInterval(this.dutyInterval);
                }
            }, 1000);
        }
        else {
            alt.clearInterval(this.dutyInterval);
        }
    }
    onSetInHouse(state) {
        this.player.isInHouse = state;
    }
    onFadeScreenIn(fadeTime) {
        this.player.fadeIn(fadeTime);
    }
    onFadeScreenOut(fadeTime) {
        this.player.fadeOut(fadeTime);
    }
    onClearTasksImmediately() {
        this.player.clearTasksImmediately();
    }
    onToggleControls(state) {
        this.player.blockGameControls(state);
    }
    onFreeze(state) {
        if (state) {
            this.player.freeze(true);
        }
        else {
            this.player.unfreeze(true);
        }
    }
    onToggleCamera(state) {
        this.player.lockCamera(state);
    }
    switchOut() {
        this.player.freeze();
        this.player.switchOut();
    }
    switchIn() {
        this.player.switchIn();
        this.player.unfreeze();
    }
    async onCuffPlayer() {
        await this.animation.load("mp_arresting");
        native.setPedComponentVariation(alt.Player.local.scriptID, 7, 41, 0, 5);
        native.setPedCanSwitchWeapon(alt.Player.local.scriptID, false);
        native.setPlayerCanDoDriveBy(alt.Player.local.scriptID, false);
        native.setCurrentPedWeapon(alt.Player.local.scriptID, 0xA2719263, true);
        this.cuffTick = this.update.add(() => {
            if (!this.animation.isPlaying("mp_arresting", "idle")) {
                this.animation.play("mp_arresting", "idle", {
                    flag: AnimationFlag.Loop | AnimationFlag.OnlyAnimateUpperBody | AnimationFlag.AllowPlayerControl
                });
            }
            native.disableControlAction(0, InputType.ENTER, true);
            native.disableControlAction(0, InputType.ATTACK, true);
            native.disableControlAction(0, InputType.ATTACK2, true);
            native.disableControlAction(0, InputType.AIM, true);
            native.disableControlAction(0, InputType.JUMP, true);
        });
    }
    onUncuffPlayer() {
        this.animation.clear();
        native.setPedComponentVariation(alt.Player.local.scriptID, 7, -1, 0, 5);
        native.setPedCanSwitchWeapon(alt.Player.local.scriptID, true);
        native.setPlayerCanDoDriveBy(alt.Player.local.scriptID, true);
        this.update.remove(this.cuffTick);
    }
    getCameraInfo(name) {
        const pos = this.camera.camPos;
        const rot = this.camera.camRot;
        this.event.emitServer("data:sendcamerainfo", name, pos.x, pos.y, pos.z, rot.x, rot.y, rot.z);
    }
    onFocusInput(state) {
        this.player.setIsAnyTextFieldFocused = state;
    }
    updateBlips() {
        this.destroyDebugBlips();
        this.showDebugBlips();
    }
    showDebugBlips() {
        alt.Player.all.forEach((otherPlayer) => {
            if (otherPlayer !== alt.Player.local) {
                this.adutyPlayerBlips.push(this.blip.createBlipForEntity(otherPlayer.scriptID, 5, 1, "", true));
            }
        });
    }
    destroyDebugBlips() {
        this.adutyPlayerBlips.forEach((blip) => {
            this.blip.destroyBlip(blip);
        });
    }
    tick() {
        //Marker and Webview Fix:
        native.drawRect(0, 0, 0, 0, 0, 0, 0, 0, false);
        if (!this.player.isSpawnedCharacter) {
            return;
        }
        this.player.updatePositionInHUD();
        this.player.updateHealthInHUD();
        this.disableOneHitMelee();
        this.leftClickOnlyWithRightClick();
        // hide default health bar
        alt.beginScaleformMovieMethodMinimap('SETUP_HEALTH_ARMOUR');
        native.scaleformMovieMethodAddParamInt(3);
        native.endScaleformMovieMethod();
        native.hideHudComponentThisFrame(6);
        native.hideHudComponentThisFrame(7);
        native.hideHudComponentThisFrame(8);
        native.hideHudComponentThisFrame(9);
    }
    disableOneHitMelee() {
        if (native.isPedArmed(alt.Player.local.scriptID, 6)) {
            native.disableControlAction(0, InputType.MELEE_ATTACK_LIGHT, true);
            native.disableControlAction(0, InputType.MELEE_ATTACK_HEAVY, true);
            native.disableControlAction(0, InputType.MELEE_ATTACK_ALTERNATE, true);
        }
    }
    leftClickOnlyWithRightClick() {
        native.disableControlAction(0, InputType.ATTACK, true);
        native.disableControlAction(0, InputType.MELEE_ATTACK_LIGHT, true);
        if (native.isControlPressed(0, InputType.AIM)) {
            native.enableControlAction(0, InputType.ATTACK, true);
            native.enableControlAction(0, InputType.MELEE_ATTACK_LIGHT, true);
        }
    }
};
__decorate([
    on("keydown"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PlayerHandler.prototype, "onKeydown", null);
__decorate([
    on("gameEntityCreate"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [alt.Entity]),
    __metadata("design:returntype", void 0)
], PlayerHandler.prototype, "onGameEntityCreate", null);
__decorate([
    on("gameEntityDestroy"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [alt.Entity]),
    __metadata("design:returntype", void 0)
], PlayerHandler.prototype, "onGameEntityDestroy", null);
__decorate([
    onServer("player:setaduty"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", void 0)
], PlayerHandler.prototype, "onSetAduty", null);
__decorate([
    onServer("player:setduty"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, Number]),
    __metadata("design:returntype", void 0)
], PlayerHandler.prototype, "onSetDuty", null);
__decorate([
    onServer("player:setinhouse"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", void 0)
], PlayerHandler.prototype, "onSetInHouse", null);
__decorate([
    onServer("player:fadescreenin"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PlayerHandler.prototype, "onFadeScreenIn", null);
__decorate([
    onServer("player:fadescreenout"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PlayerHandler.prototype, "onFadeScreenOut", null);
__decorate([
    onServer("player:cleartaskimmediately"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlayerHandler.prototype, "onClearTasksImmediately", null);
__decorate([
    onGui("player:blockcontrols"),
    onServer("player:blockcontrols"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", void 0)
], PlayerHandler.prototype, "onToggleControls", null);
__decorate([
    onServer("player:adminfreeze"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", void 0)
], PlayerHandler.prototype, "onFreeze", null);
__decorate([
    onGui("player:togglecamera"),
    onServer("player:togglecamera"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", void 0)
], PlayerHandler.prototype, "onToggleCamera", null);
__decorate([
    onServer("player:switchout"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlayerHandler.prototype, "switchOut", null);
__decorate([
    onServer("player:switchin"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlayerHandler.prototype, "switchIn", null);
__decorate([
    onServer("player:cuff"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlayerHandler.prototype, "onCuffPlayer", null);
__decorate([
    onServer("player:uncuff"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlayerHandler.prototype, "onUncuffPlayer", null);
__decorate([
    onServer("player:getcamerainfo"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlayerHandler.prototype, "getCameraInfo", null);
__decorate([
    onGui("player:focusinput"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", void 0)
], PlayerHandler.prototype, "onFocusInput", null);
PlayerHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        Player,
        AnimationModule,
        UpdateModule,
        MathModule,
        CameraModule,
        ChatModule,
        BlipModule,
        PericoIslandModule,
        HouseModule,
        LoggerModule])
], PlayerHandler);

let NotificationModule = class NotificationModule {
    event;
    constructor(event) {
        this.event = event;
    }
    sendNotification(notification) {
        this.event.emitGui("notification:push", notification);
    }
};
NotificationModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [EventModule])
], NotificationModule);

let InventoryModule = class InventoryModule {
    event;
    update;
    gui;
    player;
    logger;
    math;
    notification;
    freecam;
    inventories = [];
    blocked = false;
    constructor(event, update, gui, player, logger, math, notification, freecam) {
        this.event = event;
        this.update = update;
        this.gui = gui;
        this.player = player;
        this.logger = logger;
        this.math = math;
        this.notification = notification;
        this.freecam = freecam;
    }
    setup(inventories) {
        this.inventories = inventories;
    }
    open() {
        if (this.player.getIsAnyMenuOpen
            || this.player.isInAPrison
            || !this.player.isSpawnedCharacter
            || this.freecam.isActive
            || this.player.isInvBlocked
            || this.player.getIsAnyTextOpen) {
            return;
        }
        this.event.emitServer("inventory:request");
    }
    close() {
        if (!this.player.getIsInventoryOpen || this.blocked)
            return;
        this.player.setIsInventoryOpen = false;
        this.gui.unfocusView();
        this.player.hideCursor();
        this.player.lockCamera(false);
        this.player.blockGameControls(false);
        this.blocked = false;
        this.event.emitGui("inventory:toggleui", false);
        alt.setTimeout(() => {
            this.player.blockESC(false);
        }, 100);
        this.event.emitServer("inventory:close");
    }
    splitItem(itemId, amountToSplit) {
        this.event.emitServer("inventory:splititem", itemId, amountToSplit);
    }
    giveItemToCharacter(characterId, itemId) {
        this.event.emitServer("item:giveitemtocharacter", characterId, itemId);
    }
    swapItem(draggingItemId, droppedItemId) {
        this.event.emitServer("inventory:swapitem", draggingItemId, droppedItemId);
    }
    switchItem(invId, itemId) {
        this.event.emitServer("inventory:switchitem", invId, itemId);
    }
    placeItem(itemId) {
        const local = alt.Player.local;
        const frontPos = this.math.getEntityFrontPosition(local.scriptID, 0.5);
        const pos = new alt.Vector3(frontPos.x, frontPos.y, local.pos.z - 1);
        const z = getGroundZ(pos.x, pos.y, pos.z, 10);
        const itemPosition = new alt.Vector3(pos.x, pos.y, z);
        if (this.math.distance(alt.Player.local.pos, itemPosition) > 2) {
            return;
        }
        const inventoryDrop = {
            itemId: itemId,
            position: itemPosition
        };
        this.event.emitServer("placeableitem:place", JSON.stringify(inventoryDrop));
    }
};
InventoryModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        UpdateModule,
        GuiModule,
        Player,
        LoggerModule,
        MathModule,
        NotificationModule,
        FreeCamModule])
], InventoryModule);

var InventoryType;
(function (InventoryType) {
    InventoryType[InventoryType["INVALID"] = -1] = "INVALID";
    InventoryType[InventoryType["PLAYER"] = 0] = "PLAYER";
    InventoryType[InventoryType["VEHICLE"] = 1] = "VEHICLE";
    InventoryType[InventoryType["HOUSE"] = 2] = "HOUSE";
    InventoryType[InventoryType["GROUP_MEMBER"] = 3] = "GROUP_MEMBER";
    InventoryType[InventoryType["CLOTHING"] = 4] = "CLOTHING";
    InventoryType[InventoryType["FRISK"] = 5] = "FRISK";
})(InventoryType || (InventoryType = {}));

let InventoryHandler = class InventoryHandler {
    event;
    player;
    inventory;
    freecam;
    gui;
    update;
    math;
    logger;
    ready = false;
    tickId;
    openPosition;
    constructor(event, player, inventory, freecam, gui, update, math, logger) {
        this.event = event;
        this.player = player;
        this.inventory = inventory;
        this.freecam = freecam;
        this.gui = gui;
        this.update = update;
        this.math = math;
        this.logger = logger;
    }
    onKeydown(key) {
        if (!this.ready || this.player.getIsAnyTextFieldFocused)
            return;
        if (key === KeyCodes.I) {
            if (!this.player.getIsInventoryOpen) {
                this.inventory.open();
            }
            else {
                this.close();
            }
        }
        if (key === KeyCodes.ESCAPE) {
            if (this.player.getIsChatting) {
                return;
            }
            if (!this.player.getIsInventoryOpen)
                return;
            this.close();
        }
    }
    onInventoryOpen(inventories) {
        this.player.lockCamera(true);
        this.player.blockESC(true);
        this.player.setIsInventoryOpen = true;
        this.player.showCursor();
        this.gui.focusView();
        this.event.emitGui("inventory:toggleui", true);
        if (inventories.some(i => i.inventoryType === InventoryType.GROUP_MEMBER
            || i.inventoryType === InventoryType.VEHICLE || i.inventoryType === InventoryType.FRISK)) {
            this.openPosition = alt__default.Player.local.pos;
            this.tickId = this.update.add(() => this.tick());
        }
        this.onInventoryUpdate(inventories);
    }
    onInventoryUpdate(inventories) {
        this.inventory.setup(inventories);
        if (this.ready) {
            this.event.emitGui("inventory:setup", this.inventory.inventories);
        }
    }
    onInventoryLoaded() {
        this.ready = true;
        this.event.emitGui("inventory:setup", this.inventory.inventories);
    }
    onSplitItem(itemId, amountToSplit) {
        this.inventory.splitItem(itemId, amountToSplit);
    }
    onNoteItem(itemId, note) {
        this.event.emitServer("inventory:noteitem", itemId, note);
    }
    onRenameItem(itemId, newName) {
        this.event.emitServer("inventory:renameitem", itemId, newName);
    }
    onGiveItemToCharacter(characterId, itemId) {
        this.inventory.giveItemToCharacter(characterId, itemId);
    }
    onSwapItem(draggedItemId, droppedItemId) {
        this.inventory.swapItem(draggedItemId, droppedItemId);
    }
    onSwitchItem(invId, itemId) {
        this.inventory.switchItem(invId, itemId);
    }
    onItemPlace(itemId) {
        this.inventory.placeItem(itemId);
    }
    tick() {
        if (this.math.distance(alt__default.Player.local.pos, this.openPosition) > 0.5) {
            this.close();
        }
    }
    close() {
        this.inventory.close();
        if (this.tickId !== undefined) {
            this.update.remove(this.tickId);
            this.tickId = undefined;
        }
    }
};
__decorate([
    on("keydown"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InventoryHandler.prototype, "onKeydown", null);
__decorate([
    onServer("inventory:open"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], InventoryHandler.prototype, "onInventoryOpen", null);
__decorate([
    onServer("inventory:update"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], InventoryHandler.prototype, "onInventoryUpdate", null);
__decorate([
    onGui("inventory:ready"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryHandler.prototype, "onInventoryLoaded", null);
__decorate([
    onGui("inventory:splititem"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], InventoryHandler.prototype, "onSplitItem", null);
__decorate([
    onGui("inventory:noteitem"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], InventoryHandler.prototype, "onNoteItem", null);
__decorate([
    onGui("inventory:renameitem"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], InventoryHandler.prototype, "onRenameItem", null);
__decorate([
    onGui("item:giveitemtocharacter"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], InventoryHandler.prototype, "onGiveItemToCharacter", null);
__decorate([
    onGui("inventory:swapitem"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], InventoryHandler.prototype, "onSwapItem", null);
__decorate([
    onGui("inventory:switchitem"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], InventoryHandler.prototype, "onSwitchItem", null);
__decorate([
    onGui("item:placeonground"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InventoryHandler.prototype, "onItemPlace", null);
InventoryHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        Player,
        InventoryModule,
        FreeCamModule,
        GuiModule,
        UpdateModule,
        MathModule,
        LoggerModule])
], InventoryHandler);

var ChatType;
(function (ChatType) {
    ChatType[ChatType["WISPER"] = 0] = "WISPER";
    ChatType[ChatType["SPEAK"] = 1] = "SPEAK";
    ChatType[ChatType["SCREAM"] = 2] = "SCREAM";
    ChatType[ChatType["LOW_EMOTE"] = 3] = "LOW_EMOTE";
    ChatType[ChatType["EMOTE"] = 4] = "EMOTE";
    ChatType[ChatType["MY"] = 5] = "MY";
    ChatType[ChatType["DO"] = 6] = "DO";
    ChatType[ChatType["OOC"] = 7] = "OOC";
    ChatType[ChatType["MEGAPHONE"] = 8] = "MEGAPHONE";
    ChatType[ChatType["PHONE_SPEAK"] = 9] = "PHONE_SPEAK";
    ChatType[ChatType["PHONE_SCREAM"] = 10] = "PHONE_SCREAM";
    ChatType[ChatType["PHONE_WISPER"] = 11] = "PHONE_WISPER";
    ChatType[ChatType["ADMIN_CHAT"] = 12] = "ADMIN_CHAT";
    ChatType[ChatType["RADIO_SPEAK"] = 13] = "RADIO_SPEAK";
    ChatType[ChatType["RADIO_SCREAM"] = 14] = "RADIO_SCREAM";
    ChatType[ChatType["RADIO_WISPER"] = 15] = "RADIO_WISPER";
    ChatType[ChatType["DEP_SPEAK"] = 16] = "DEP_SPEAK";
    ChatType[ChatType["DEP_SCREAM"] = 17] = "DEP_SCREAM";
    ChatType[ChatType["DEP_WISPER"] = 18] = "DEP_WISPER";
})(ChatType || (ChatType = {}));

let ChatHandler = class ChatHandler {
    event;
    freecam;
    chat;
    player;
    logger;
    raycast;
    math;
    cachedCommands = [];
    constructor(event, freecam, chat, player, logger, raycast, math) {
        this.event = event;
        this.freecam = freecam;
        this.chat = chat;
        this.player = player;
        this.logger = logger;
        this.raycast = raycast;
        this.math = math;
    }
    keydown(key) {
        if (!this.chat.ready || this.player.isInAPrison || !this.player.isSpawnedCharacter)
            return;
        if (key === KeyCodes.T || key === KeyCodes.ENTER) {
            this.chat.openChat();
        }
        if (key === KeyCodes.ESCAPE) {
            if (this.chat.inputActive) {
                this.chat.closeChat(100);
                if (this.freecam.isActive) {
                    this.freecam.unfreeze();
                }
            }
        }
        if (key === KeyCodes.F5) {
            this.chat.toggleChatVisibility();
        }
        if (key === KeyCodes.F4) {
            this.chat.toggleTimestamp();
        }
    }
    setCommands(commands) {
        this.cachedCommands = commands;
        if (this.chat.ready) {
            this.event.emitGui("chat:setcommands", this.cachedCommands);
        }
    }
    onPushMessage(dimension, message, position = null) {
        const currInterior = native.getInteriorFromEntity(alt.Player.local.scriptID);
        const playerPos = alt.Player.local.pos;
        let mumble = false;
        if (dimension !== 0) {
            const dist = this.math.distance(playerPos, position);
            // Check if player is inside an interior and if the message source is 3 meters away.
            if (currInterior !== 0 && dist > 3) {
                const dir = this.math.subVector3(position, playerPos).normalize();
                const result = this.raycast.line(playerPos, dir, dist + 2, 1, alt.Player.local.scriptID);
                // Something is in the way cant read chat.
                if (result.isHit) {
                    mumble = true;
                    // If source is /not/ any screaming or megaphone
                    if (message.chatType !== ChatType.SCREAM
                        && message.chatType !== ChatType.MEGAPHONE
                        && message.chatType !== ChatType.DEP_SCREAM
                        && message.chatType !== ChatType.PHONE_SCREAM
                        && message.chatType !== ChatType.RADIO_SCREAM) {
                        return;
                    }
                }
            }
        }
        if (mumble) {
            const contextArray = message.context.split(" ");
            for (let i = 0; i < Math.floor(contextArray.length * 0.2); i++) {
                contextArray[Math.floor(Math.random() * contextArray.length)] = " <i>**undeutlich**</i> ";
            }
            message.context = contextArray.join(" ");
        }
        // Could be the place to add other addons to the chat message
        // source is drunk or on drunks
        // source is heavly wounded
        // knocked out on ground
        // mouth is covered
        this.chat.sendMessage(message);
    }
    onChatLoaded() {
        this.event.emitGui("chat:setcommands", this.cachedCommands);
        this.chat.ready = true;
        this.chat.chatVisible = true;
    }
    sendMessage(isCommand, message) {
        if (message && message.length > 0) {
            if (isCommand) {
                this.event.emitServer("command:execute", message);
            }
            else {
                this.event.emitServer("chat:sendmessage", message);
            }
        }
        this.chat.closeChat();
        if (this.freecam.isActive) {
            this.freecam.unfreeze();
        }
    }
};
__decorate([
    on("keydown"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ChatHandler.prototype, "keydown", null);
__decorate([
    onServer("chat:setcommands"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], ChatHandler.prototype, "setCommands", null);
__decorate([
    onServer("chat:pushmessage"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, alt.Vector3]),
    __metadata("design:returntype", void 0)
], ChatHandler.prototype, "onPushMessage", null);
__decorate([
    onGui("chat:ready"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChatHandler.prototype, "onChatLoaded", null);
__decorate([
    onGui("chat:sendmessage"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, String]),
    __metadata("design:returntype", void 0)
], ChatHandler.prototype, "sendMessage", null);
ChatHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        FreeCamModule,
        ChatModule,
        Player,
        LoggerModule,
        RaycastModule,
        MathModule])
], ChatHandler);

var WeatherType;
(function (WeatherType) {
    WeatherType[WeatherType["EXTRA_SUNNY"] = 0] = "EXTRA_SUNNY";
    WeatherType[WeatherType["CLEAR"] = 1] = "CLEAR";
    WeatherType[WeatherType["CLOUDS"] = 2] = "CLOUDS";
    WeatherType[WeatherType["SMOKG"] = 3] = "SMOKG";
    WeatherType[WeatherType["FOGGY"] = 4] = "FOGGY";
    WeatherType[WeatherType["OVERCAST"] = 5] = "OVERCAST";
    WeatherType[WeatherType["RAIN"] = 6] = "RAIN";
    WeatherType[WeatherType["THUNDER"] = 7] = "THUNDER";
    WeatherType[WeatherType["CLEARING"] = 8] = "CLEARING";
    WeatherType[WeatherType["NEUTRAL"] = 9] = "NEUTRAL";
    WeatherType[WeatherType["SNOW"] = 10] = "SNOW";
    WeatherType[WeatherType["BLIZZARD"] = 11] = "BLIZZARD";
    WeatherType[WeatherType["SNOWLIGHT"] = 12] = "SNOWLIGHT";
    WeatherType[WeatherType["XMAS"] = 13] = "XMAS";
    WeatherType[WeatherType["HALLOWEEN"] = 14] = "HALLOWEEN";
})(WeatherType || (WeatherType = {}));

let WeatherModule = class WeatherModule {
    event;
    logger;
    weatherNameMap = new Map([
        [WeatherType.CLEAR, "CLEAR"],
        [WeatherType.EXTRA_SUNNY, "EXTRASUNNY"],
        [WeatherType.CLOUDS, "CLOUDS"],
        [WeatherType.OVERCAST, "OVERCAST"],
        [WeatherType.RAIN, "RAIN"],
        [WeatherType.CLEARING, "CLEARING"],
        [WeatherType.THUNDER, "THUNDER"],
        [WeatherType.SMOKG, "SMOG"],
        [WeatherType.XMAS, "XMAS"],
    ]);
    oldWeather;
    constructor(event, logger) {
        this.event = event;
        this.logger = logger;
    }
    startSync() {
        native.setWeatherTypeNowPersist(this.weatherNameMap.get(alt.getSyncedMeta("Weather")));
        alt.setMsPerGameMinute(60000);
        let date = new Date();
        native.setClockTime(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    }
};
WeatherModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        LoggerModule])
], WeatherModule);

var NotificationType;
(function (NotificationType) {
    NotificationType[NotificationType["INFO"] = 0] = "INFO";
    NotificationType[NotificationType["WARNING"] = 1] = "WARNING";
    NotificationType[NotificationType["ERROR"] = 2] = "ERROR";
    NotificationType[NotificationType["SUCCESS"] = 3] = "SUCCESS";
})(NotificationType || (NotificationType = {}));

let PhoneModule = class PhoneModule {
    event;
    player;
    gui;
    logger;
    updater;
    notification;
    phoneId;
    phoneNumber;
    hasPhone = false;
    ready = false;
    inCall = false;
    updateId;
    phone;
    constructor(event, player, gui, logger, updater, notification) {
        this.event = event;
        this.player = player;
        this.gui = gui;
        this.logger = logger;
        this.updater = updater;
        this.notification = notification;
    }
    setup(phone) {
        this.phoneId = phone.id;
        this.phoneNumber = phone.phoneNumber;
        this.phone = phone;
        this.hasPhone = true;
        if (this.ready) {
            this.sendToUI();
        }
    }
    update(phone) {
        this.phone = phone;
        if (this.ready) {
            this.sendToUI();
        }
    }
    sendToUI() {
        this.event.emitGui("phone:setup", this.phone);
    }
    remove() {
        this.close();
        this.hasPhone = false;
        this.event.emitGui("phone:reset");
    }
    open() {
        if (this.player.getIsPhoneOpen && this.hasPhone)
            return;
        this.updateId = this.updater.add(() => this.toggleActions());
        this.player.setIsPhoneOpen = true;
        this.player.showCursor();
        this.player.lockCamera(true);
        this.player.blockESC(true);
        this.gui.focusView();
        native.setPlayerCanDoDriveBy(alt.Player.local.scriptID, false);
        this.event.emitGui("phone:toggle", true);
    }
    close() {
        if (!this.player.getIsPhoneOpen && this.hasPhone)
            return;
        alt.setTimeout(() => {
            this.updater.remove(this.updateId);
        }, 100);
        this.player.setIsPhoneOpen = false;
        this.player.setIsAnyTextFieldFocused = false;
        this.player.lockCamera(false);
        this.player.blockGameControls(false);
        this.player.hideCursor();
        this.player.blockESC(false);
        this.gui.unfocusView();
        native.setPlayerCanDoDriveBy(alt.Player.local.scriptID, true);
        this.event.emitGui("phone:toggle", false);
    }
    getCallFrom(displayedName) {
        this.event.emitGui("phone:getcallfrom", displayedName);
    }
    callNumber(displayedName) {
        this.event.emitGui("phone:setupcall", displayedName);
    }
    updateLastUsage(chatId) {
        this.event.emitServer("phone:updatelastusage", this.phoneId, chatId);
    }
    openNewChat(oldId, chat) {
        this.event.emitGui("phone:opennewchat", oldId, chat);
    }
    addChat(chat) {
        this.event.emitServer("phone:addchat", this.phoneId, JSON.stringify(chat));
    }
    deleteChat(chatId) {
        this.event.emitServer("phone:deletechat", chatId);
    }
    pushMessage(message) {
        this.event.emitServer("phone:pushmessage", this.phoneId, message.chatId, message.context);
    }
    addContact(contact) {
        this.event.emitServer("phone:addcontact", this.phoneId, JSON.stringify(contact));
    }
    editContact(contact) {
        this.event.emitServer("phone:editcontact", this.phoneId, JSON.stringify(contact));
    }
    removeContact(contactId) {
        this.event.emitServer("phone:removecontact", this.phoneId, contactId);
    }
    denyCurrentCall() {
        this.event.emitServer("phone:denycall");
    }
    acceptCurrentCall() {
        this.event.emitServer("phone:acceptcall", this.phoneId);
        this.inCall = true;
        this.notification.sendNotification({
            type: NotificationType.INFO,
            text: "Mit der Pfeiltaste nach unten kannst du dein Handy wegpacken und wieder laufen.",
        });
    }
    hangupCurrentCall() {
        this.event.emitServer("phone:hangup");
        this.inCall = false;
    }
    callGotHanguped() {
        this.event.emitGui("phone:callgothungup");
        this.inCall = false;
    }
    callGotDenied() {
        this.event.emitGui("phone:callgotdenied");
        this.inCall = false;
    }
    toggleActions() {
        native.disableControlAction(0, InputType.LOOK_LR, true);
        native.disableControlAction(0, InputType.LOOK_UD, true);
        native.disableControlAction(0, InputType.SCRIPT_RIGHT_AXIS_X, true);
        native.disableControlAction(0, InputType.SCRIPT_RIGHT_AXIS_Y, true);
        native.disableControlAction(0, InputType.WEAPON_WHEEL_NEXT, true);
        native.disableControlAction(0, InputType.WEAPON_WHEEL_PREV, true);
        native.disableControlAction(0, InputType.SELECT_NEXT_WEAPON, true);
        native.disableControlAction(0, InputType.SELECT_PREV_WEAPON, true);
        native.disableControlAction(0, InputType.SELECT_WEAPON, true);
        native.disableControlAction(0, InputType.NEXT_WEAPON, true);
        native.disableControlAction(0, InputType.PREV_WEAPON, true);
        native.disableControlAction(0, InputType.AIM, true);
        native.disableControlAction(0, InputType.ATTACK, true);
        native.disableControlAction(0, InputType.ATTACK2, true);
        native.disableControlAction(0, InputType.MELEE_ATTACK1, true);
        native.disableControlAction(0, InputType.MELEE_ATTACK2, true);
        native.disableControlAction(0, InputType.MELEE_ATTACK_LIGHT, true);
        native.disableControlAction(0, InputType.MELEE_ATTACK_HEAVY, true);
        native.disableControlAction(0, InputType.MELEE_ATTACK_ALTERNATE, true);
        native.disableControlAction(0, InputType.RADIO_WHEEL_LR, true);
        native.disableControlAction(0, InputType.RADIO_WHEEL_UD, true);
        native.disableControlAction(0, InputType.VEH_NEXT_RADIO, true);
        native.disableControlAction(0, InputType.VEH_PREV_RADIO, true);
        native.disableControlAction(0, InputType.VEH_RADIO_WHEEL, true);
        native.disableControlAction(0, InputType.VEH_SELECT_NEXT_WEAPON, true);
        native.disableControlAction(0, InputType.VEH_SELECT_PREV_WEAPON, true);
    }
};
PhoneModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        Player,
        GuiModule,
        LoggerModule,
        UpdateModule,
        NotificationModule])
], PhoneModule);

let CharacterHandler = class CharacterHandler {
    character;
    player;
    camera;
    event;
    gui;
    weather;
    house;
    loading;
    logger;
    phone;
    isMenuOpen = false;
    constructor(character, player, camera, event, gui, weather, house, loading, logger, phone) {
        this.character = character;
        this.player = player;
        this.camera = camera;
        this.event = event;
        this.gui = gui;
        this.weather = weather;
        this.house = house;
        this.loading = loading;
        this.logger = logger;
        this.phone = phone;
    }
    onKeydown(key) {
        if (this.player.isInAPrison || !this.player.isSpawnedCharacter || this.player.getIsAnyTextFieldFocused) {
            return;
        }
        if (key === KeyCodes.F9) {
            if (this.isMenuOpen) {
                this.setMenuState(false);
            }
            else {
                if (this.player.isSpawnedCharacter) {
                    this.event.emitServer("character:requestmenu");
                }
            }
        }
    }
    onShowMenu() {
        this.setMenuState(true);
    }
    updateModel(character) {
        this.character.apply(character, alt.Player.local.scriptID);
    }
    spawn(character) {
        const localPlayer = alt.Player.local;
        this.character.apply(character, localPlayer.scriptID);
        this.player.characterId = character.id;
        if (this.player.getIsPhoneOpen) {
            this.phone.close();
        }
        this.player.hideCursor();
        this.player.unfreeze();
        this.player.lockCamera(false, true);
        this.player.setVisible(true);
        this.player.showHud();
        this.player.isSpawnedCharacter = true;
        this.gui.unfocusView();
        this.camera.destroyCamera();
        this.loading.hide();
        this.weather.startSync();
        this.house.updateBlips();
        this.event.emitGui("gui:routeto", "game");
        alt.setTimeout(() => {
            this.player.fadeIn(500);
            this.player.updatePositionInHUD(true);
            this.player.updateHealthInHUD(true);
        }, 600);
        native.setPedConfigFlag(localPlayer, 35, false); // Disable Auto Helmet when your on a motorcycle 
        native.setPedConfigFlag(localPlayer, 241, true); // Disable Stopping Engine
        native.setPedConfigFlag(localPlayer, 429, true); // Disable Starting Engine
        native.setPedConfigFlag(localPlayer, 184, true); // Disable Seat Shuffling
        //Disable headshot
        native.setPedSuffersCriticalHits(localPlayer, false);
        native.setAudioFlag("DisableFlightMusic", true);
        alt.setStat("stamina" /* Stamina */, 100);
        alt.setStat("lung_capacity" /* LungCapacity */, 100);
        alt.setStat("shooting_ability" /* Shooting */, 100);
        alt.setStat("flying_ability" /* Flying */, 100);
    }
    onSync(character) {
        this.event.emitGui("character:sync", character.id);
        this.character.apply(character, alt.Player.local.scriptID);
    }
    onUpdateTorso(torso) {
        this.character.updateTorso(alt.Player.local.scriptID, torso, 0);
    }
    onUpdateClothes(inventory) {
        this.character.createClothesBasedOnInventory(inventory, alt.Player.local.scriptID, this.character.getCachedCharacter.gender);
    }
    onRequestClose() {
        this.setMenuState(false);
    }
    setMenuState(state) {
        if (!this.player.isSpawnedCharacter) {
            return;
        }
        if (this.player.getIsAnyMenuOpen && !this.isMenuOpen || this.player.getIsInventoryOpen) {
            return;
        }
        this.isMenuOpen = state;
        this.player.setIsAnyMenuOpen = this.isMenuOpen;
        this.player.blockGameControls(this.isMenuOpen);
        if (this.isMenuOpen) {
            this.player.showCursor();
            this.gui.focusView();
        }
        else {
            this.player.hideCursor();
            this.gui.unfocusView();
        }
        this.event.emitGui("charactermenu:toggle", this.isMenuOpen);
    }
};
__decorate([
    on("keydown"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CharacterHandler.prototype, "onKeydown", null);
__decorate([
    onServer("character:showmenu"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CharacterHandler.prototype, "onShowMenu", null);
__decorate([
    onServer("character:apply"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CharacterHandler.prototype, "updateModel", null);
__decorate([
    onServer("character:spawn"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CharacterHandler.prototype, "spawn", null);
__decorate([
    onServer("character:sync"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CharacterHandler.prototype, "onSync", null);
__decorate([
    onServer("character:updatetorso"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CharacterHandler.prototype, "onUpdateTorso", null);
__decorate([
    onServer("character:updateclothes"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CharacterHandler.prototype, "onUpdateClothes", null);
__decorate([
    onGui("charactermenu:requestclose"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CharacterHandler.prototype, "onRequestClose", null);
CharacterHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [CharacterModule,
        Player,
        CameraModule,
        EventModule,
        GuiModule,
        WeatherModule,
        HouseModule,
        LoadingSpinnerModule,
        LoggerModule,
        PhoneModule])
], CharacterHandler);

let VehicleModule = class VehicleModule {
    math;
    constructor(math) {
        this.math = math;
    }
    fix(vehicle, amount = 1000, fixCosmetics = false) {
        for (let index = 0; index < vehicle.wheelsCount; index++) {
            native.setVehicleTyreFixed(vehicle.scriptID, index);
        }
        if (fixCosmetics) {
            native.setVehicleDeformationFixed(vehicle.scriptID);
        }
    }
    createShowcaseVehicle(hash, x, y, z, heading, primColor, secColor) {
        const vehicle = native.createVehicle(hash, x, y, z, heading, false, true, true);
        native.setEntityCollision(vehicle, false, false);
        native.freezeEntityPosition(vehicle, true);
        native.setVehicleNumberPlateText(vehicle, "");
        native.setVehicleColours(vehicle, primColor, secColor);
        native.setVehicleModKit(vehicle, 0);
        return vehicle;
    }
    setTrunkState(vehicle, state) {
        if (state) {
            native.playVehicleDoorOpenSound(vehicle.scriptID, 5);
            native.setVehicleDoorOpen(vehicle.scriptID, 5, true, true);
        }
        else {
            native.playVehicleDoorCloseSound(vehicle.scriptID, 5);
            native.setVehicleDoorShut(vehicle.scriptID, 5, true);
        }
    }
    removeMod(vehicle, mod) {
        native.removeVehicleMod(vehicle, mod);
    }
    addMod(vehicle, mod, index) {
        native.setVehicleMod(vehicle, mod, index, false);
    }
    addMods(vehicle, mods) {
        this.addMod(vehicle, 0, mods.spoilers);
        this.addMod(vehicle, 1, mods.frontBumper);
        this.addMod(vehicle, 2, mods.rearBumper);
        this.addMod(vehicle, 3, mods.sideSkirt);
        this.addMod(vehicle, 4, mods.exhaust);
        this.addMod(vehicle, 5, mods.frame);
        this.addMod(vehicle, 6, mods.grille);
        this.addMod(vehicle, 7, mods.bonnet);
        this.addMod(vehicle, 8, mods.leftWing);
        this.addMod(vehicle, 9, mods.rightWing);
        this.addMod(vehicle, 10, mods.roof);
        this.addMod(vehicle, 11, mods.engine);
        this.addMod(vehicle, 12, mods.brakes);
        this.addMod(vehicle, 13, mods.transmission);
        this.addMod(vehicle, 14, mods.horns);
        this.addMod(vehicle, 15, mods.suspension);
        this.addMod(vehicle, 16, mods.armor);
        this.addMod(vehicle, 18, mods.turbo);
        this.addMod(vehicle, 20, mods.tireSmoke);
        this.addMod(vehicle, 22, mods.xenon);
        this.addMod(vehicle, 23, mods.frontWheels);
        this.addMod(vehicle, 24, mods.backWheels);
        this.addMod(vehicle, 25, mods.plateHolders);
        this.addMod(vehicle, 26, mods.plateVanity);
        this.addMod(vehicle, 27, mods.trimDesign);
        this.addMod(vehicle, 28, mods.ornaments);
        this.addMod(vehicle, 30, mods.dialDesign);
        this.addMod(vehicle, 31, mods.doorInterior);
        this.addMod(vehicle, 32, mods.seats);
        this.addMod(vehicle, 33, mods.steeringWheel);
        this.addMod(vehicle, 34, mods.shiftLever);
        this.addMod(vehicle, 35, mods.plaques);
        this.addMod(vehicle, 36, mods.rearShelf);
        this.addMod(vehicle, 37, mods.trunk);
        this.addMod(vehicle, 38, mods.hydraulics);
        this.addMod(vehicle, 39, mods.engineBlock);
        this.addMod(vehicle, 40, mods.airFilter);
        this.addMod(vehicle, 41, mods.strutBar);
        this.addMod(vehicle, 42, mods.archCover);
        this.addMod(vehicle, 43, mods.antenna);
        this.addMod(vehicle, 44, mods.exteriorParts);
        this.addMod(vehicle, 45, mods.tank);
        this.addMod(vehicle, 46, mods.door);
        this.addMod(vehicle, 48, mods.livery);
    }
    changePrimColor(vehicle, color) {
        const [_, primColor, secColor] = native.getVehicleColours(vehicle, null, null);
        native.setVehicleColours(vehicle, color, secColor);
    }
    changeSecColor(vehicle, color) {
        const [_, primColor, secColor] = native.getVehicleColours(vehicle, null, null);
        native.setVehicleColours(vehicle, primColor, color);
    }
    getColor(vehicle) {
        const [_, primColor, secColor] = native.getVehicleColours(vehicle, null, null);
        return [primColor, secColor];
    }
    getClass(vehicle) {
        return native.getVehicleClass(vehicle);
    }
    // We need to devide by one to get the correct index on client side.
    // Mod indexes are shiftet by -1 on client side. So -1 is stock and 0 is the first mod.
    convertToClient(mods) {
        const returnMods = {
            spoilers: mods.spoilers - 1,
            frontBumper: mods.frontBumper - 1,
            rearBumper: mods.rearBumper - 1,
            sideSkirt: mods.sideSkirt - 1,
            exhaust: mods.exhaust - 1,
            frame: mods.frame - 1,
            grille: mods.grille - 1,
            bonnet: mods.bonnet - 1,
            leftWing: mods.leftWing - 1,
            rightWing: mods.rightWing - 1,
            roof: mods.roof - 1,
            engine: mods.engine - 1,
            brakes: mods.brakes - 1,
            transmission: mods.transmission - 1,
            horns: mods.horns - 1,
            suspension: mods.suspension - 1,
            armor: mods.armor - 1,
            turbo: mods.turbo - 1,
            tireSmoke: mods.tireSmoke - 1,
            xenon: mods.xenon - 1,
            frontWheels: mods.frontWheels - 1,
            backWheels: mods.backWheels - 1,
            plateHolders: mods.plateHolders - 1,
            plateVanity: mods.plateVanity - 1,
            trimDesign: mods.trimDesign - 1,
            ornaments: mods.ornaments - 1,
            dialDesign: mods.dialDesign - 1,
            doorInterior: mods.doorInterior - 1,
            seats: mods.seats - 1,
            steeringWheel: mods.steeringWheel - 1,
            shiftLever: mods.shiftLever - 1,
            plaques: mods.plaques - 1,
            rearShelf: mods.rearShelf - 1,
            trunk: mods.trunk - 1,
            hydraulics: mods.hydraulics - 1,
            engineBlock: mods.engineBlock - 1,
            airFilter: mods.airFilter - 1,
            strutBar: mods.strutBar - 1,
            archCover: mods.archCover - 1,
            antenna: mods.antenna - 1,
            exteriorParts: mods.exteriorParts - 1,
            tank: mods.tank - 1,
            door: mods.door - 1,
            livery: mods.livery - 1
        };
        return returnMods;
    }
    // We need to add by one to get the correct index on server side.
    // Mod indexes starting on server side at 0 so 0 is stock and 1 is the first mod.
    convertToServer(mods) {
        const returnMods = {
            spoilers: mods.spoilers + 1,
            frontBumper: mods.frontBumper + 1,
            rearBumper: mods.rearBumper + 1,
            sideSkirt: mods.sideSkirt + 1,
            exhaust: mods.exhaust + 1,
            frame: mods.frame + 1,
            grille: mods.grille + 1,
            bonnet: mods.bonnet + 1,
            leftWing: mods.leftWing + 1,
            rightWing: mods.rightWing + 1,
            roof: mods.roof + 1,
            engine: mods.engine + 1,
            brakes: mods.brakes + 1,
            transmission: mods.transmission + 1,
            horns: mods.horns + 1,
            suspension: mods.suspension + 1,
            armor: mods.armor + 1,
            turbo: mods.turbo + 1,
            tireSmoke: mods.tireSmoke + 1,
            xenon: mods.xenon + 1,
            frontWheels: mods.frontWheels + 1,
            backWheels: mods.backWheels + 1,
            plateHolders: mods.plateHolders + 1,
            plateVanity: mods.plateVanity + 1,
            trimDesign: mods.trimDesign + 1,
            ornaments: mods.ornaments + 1,
            dialDesign: mods.dialDesign + 1,
            doorInterior: mods.doorInterior + 1,
            seats: mods.seats + 1,
            steeringWheel: mods.steeringWheel + 1,
            shiftLever: mods.shiftLever + 1,
            plaques: mods.plaques + 1,
            rearShelf: mods.rearShelf + 1,
            trunk: mods.trunk + 1,
            hydraulics: mods.hydraulics + 1,
            engineBlock: mods.engineBlock + 1,
            airFilter: mods.airFilter + 1,
            strutBar: mods.strutBar + 1,
            archCover: mods.archCover + 1,
            antenna: mods.antenna + 1,
            exteriorParts: mods.exteriorParts + 1,
            tank: mods.tank + 1,
            door: mods.door + 1,
            livery: mods.livery + 1
        };
        return returnMods;
    }
    getCurrentSpeed(vehicle) {
        return native.getEntitySpeed(vehicle.scriptID) * 3.6;
    }
    getClosestVehicle() {
        const obj = {
            distance: null,
            vehicle: null
        };
        for (const vehicle of alt.Vehicle.streamedIn) {
            const distance = this.math.distance(alt.Player.local.pos, vehicle.pos);
            if (obj.distance == null || obj.distance > distance) {
                obj.distance = distance;
                obj.vehicle = vehicle;
            }
        }
        return obj.vehicle;
    }
    getClosestVehicleDoor(vehicle) {
        const _vehicle = vehicle == null ? this.getClosestVehicle() : vehicle;
        if (!_vehicle) {
            return -1;
        }
        const obj = { distance: null, door: -1 };
        for (let i = 0, l = native.getNumberOfVehicleDoors(_vehicle); i < l; i++) {
            const distance = this.math.distance(alt.Player.local.pos, native.getEntryPositionOfDoor(_vehicle, i));
            if (obj.distance == null || obj.distance > distance) {
                obj.distance = distance;
                obj.door = i;
            }
        }
        return obj.door;
    }
};
VehicleModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [MathModule])
], VehicleModule);

let VehicleSelectorHandler = class VehicleSelectorHandler {
    camera;
    event;
    update;
    vehicle;
    logger;
    notification;
    charCreator;
    updateId;
    showcaseVehicle = null;
    currentIndex = 0;
    vehicles = [];
    constructor(camera, event, update, vehicle, logger, notification, charCreator) {
        this.camera = camera;
        this.event = event;
        this.update = update;
        this.vehicle = vehicle;
        this.logger = logger;
        this.notification = notification;
        this.charCreator = charCreator;
    }
    onOpen(vehicles) {
        this.createCamera();
        this.vehicles = vehicles;
        if (this.vehicles.length > 0) {
            this.changeVehicle(this.vehicles[this.currentIndex]);
            if (this.updateId) {
                this.update.remove(this.updateId);
                this.updateId = null;
            }
            this.updateId = this.update.add(() => this.tick());
        }
    }
    close() {
        this.update.remove(this.updateId);
        this.updateId = null;
        native.deleteVehicle(this.showcaseVehicle);
        this.showcaseVehicle = null;
        this.currentIndex = 0;
    }
    onChange(direction) {
        this.currentIndex += direction;
        if (this.currentIndex < 0) {
            this.currentIndex = this.vehicles.length - 1;
        }
        if (this.currentIndex > this.vehicles.length - 1) {
            this.currentIndex = 0;
        }
        this.changeVehicle(this.vehicles[this.currentIndex]);
        alt.setTimeout(() => {
            this.event.emitGui("vehicleselector:unlocksetfree");
        }, 500);
    }
    onOrder(model) {
        const vehicle = this.vehicles.find(v => v.model === model);
        if (this.charCreator.orderVehicleLimit()) {
            this.notification.sendNotification({
                type: NotificationType.ERROR,
                text: "Du kannst nicht mehr als zwei Fahrzeuge bestellen."
            });
            return;
        }
        this.charCreator.addPurchase({
            id: UID(),
            type: CharacterCreatorPurchaseType.VEHICLE,
            name: vehicle.displayName,
            description: `Fahrzeug Klasse: ${vehicle.displayClass}`,
            southCentralPoints: vehicle.southCentralPoints,
            removeable: true,
            orderedVehicle: vehicle
        });
    }
    createCamera() {
        const pos = new alt.Vector3(171.6923065185547, -1000.2988891601562, -98.0146484375);
        const rot = new alt.Vector3(-20, 0, 200);
        this.camera.createCamera(pos, rot, 60);
    }
    async changeVehicle(vehicle) {
        if (this.showcaseVehicle) {
            native.deleteVehicle(this.showcaseVehicle);
            this.showcaseVehicle = null;
        }
        await this.createVehicle(vehicle).then(() => {
            this.updateStats(vehicle);
            this.updateInfo(vehicle);
        });
    }
    async createVehicle(vehicle) {
        if (this.showcaseVehicle)
            return;
        const hash = alt.hash(vehicle.model);
        await loadModel(hash);
        this.showcaseVehicle = this.vehicle.createShowcaseVehicle(hash, 173.129, -1004.294, -100.00, -12.533, 111, 111);
    }
    updateStats(vehicle) {
        if (!this.showcaseVehicle)
            return;
        const vehicleClass = native.getVehicleClass(this.showcaseVehicle);
        const speed = native.getVehicleEstimatedMaxSpeed(this.showcaseVehicle);
        const maxSpeed = native.getVehicleClassEstimatedMaxSpeed(vehicleClass);
        const speedPercent = (speed / maxSpeed) * 100;
        const acceleration = native.getVehicleAcceleration(this.showcaseVehicle);
        const maxAcceleration = native.getVehicleClassMaxAcceleration(vehicleClass);
        const accelerationPercent = (acceleration / maxAcceleration) * 100;
        const breaks = native.getVehicleMaxBraking(this.showcaseVehicle);
        const maxBreaks = native.getVehicleClassMaxBraking(vehicleClass);
        const breaksPercent = (breaks / maxBreaks) * 100;
        const vehicleStats = {
            speed: speedPercent,
            acceleration: accelerationPercent,
            breaks: breaksPercent
        };
        const hash = alt.hash(vehicle.model);
        const vehicleName = native.getDisplayNameFromVehicleModel(hash);
        const localName = native.getLabelText(vehicleName);
        this.event.emitGui("vehicle:updatestats", vehicleStats, localName);
    }
    updateInfo(vehicle) {
        this.event.emitGui("vehicleselector:setvehicleinfo", vehicle);
    }
    tick() {
        if (!this.showcaseVehicle)
            return;
        let heading = native.getEntityHeading(this.showcaseVehicle);
        let newHeading = heading += 0.10;
        const rot = new alt.Vector3(0, 0, newHeading);
        native.setEntityRotation(this.showcaseVehicle, rot.x, rot.y, rot.z, 0, false);
    }
};
__decorate([
    onServer("vehicleselector:open"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], VehicleSelectorHandler.prototype, "onOpen", null);
__decorate([
    onGui("vehicleselector:close"),
    on("disconnect"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VehicleSelectorHandler.prototype, "close", null);
__decorate([
    onGui("vehicleselector:change"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VehicleSelectorHandler.prototype, "onChange", null);
__decorate([
    onGui("vehicleselector:order"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VehicleSelectorHandler.prototype, "onOrder", null);
VehicleSelectorHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [CameraModule,
        EventModule,
        UpdateModule,
        VehicleModule,
        LoggerModule,
        NotificationModule,
        CharCreatorModule])
], VehicleSelectorHandler);

let TextModule = class TextModule {
    math;
    player;
    constructor(math, player) {
        this.math = math;
        this.player = player;
    }
    drawText2d(message, posX, posY, scale, fontType, align, r, g, b, a, useOutline = true, useDropShadow = true) {
        native.beginTextCommandDisplayText('STRING');
        native.addTextComponentSubstringPlayerName(message);
        native.setTextFont(fontType);
        native.setTextScale(1, scale);
        native.setTextWrap(0.0, 1.0);
        native.setTextCentre(true);
        native.setTextColour(r, g, b, a);
        native.setTextJustification(align);
        if (useOutline)
            native.setTextOutline();
        if (useDropShadow)
            native.setTextDropShadow();
        native.endTextCommandDisplayText(posX, posY, 0);
    }
    drawText3d(message, posX, posY, posZ, scale, fontType, r, g, b, a, useOutline = true, useDropShadow = true) {
        native.setDrawOrigin(posX, posY, posZ, 0);
        native.beginTextCommandDisplayText('STRING');
        native.addTextComponentSubstringPlayerName(message);
        native.setTextFont(fontType);
        native.setTextScale(1, scale);
        native.setTextWrap(0.0, 1.0);
        native.setTextCentre(true);
        native.setTextColour(r, g, b, a);
        if (useOutline) {
            native.setTextOutline();
        }
        if (useDropShadow) {
            native.setTextDropShadow();
        }
        native.endTextCommandDisplayText(0, 0, 0);
        native.clearDrawOrigin();
    }
    drawText3dWithDistance(message, posX, posY, posZ, scale, fontType, r, g, b, a, useOutline = true, useDropShadow = true, distance = 20) {
        if (this.math.distance(alt.Player.local.pos, new Vector3(posX, posY, posZ)) <= distance) {
            this.drawText3d(message, posX, posY, posZ, scale, fontType, r, g, b, a, useOutline, useDropShadow);
        }
    }
};
TextModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [MathModule,
        Player])
], TextModule);

let VehicleHandler = class VehicleHandler {
    player;
    event;
    update;
    text;
    logger;
    vehicle;
    gui;
    drivingTickId;
    tickId;
    maxFuel;
    wasLastFrameInVehicle;
    constructor(player, event, update, text, logger, vehicle, gui) {
        this.player = player;
        this.event = event;
        this.update = update;
        this.text = text;
        this.logger = logger;
        this.vehicle = vehicle;
        this.gui = gui;
        this.tickId = this.update.add(() => this.tick());
    }
    onKeydown(key) {
        const vehicle = alt.Player.local.vehicle;
        if (vehicle instanceof alt.Vehicle) {
            if (key === KeyCodes.Y) {
                if (this.player.getIsAnyTextOpen || native.getVehicleClass(vehicle.scriptID) === 13)
                    return;
                this.event.emitServer("vehicle:toggleengine");
            }
        }
    }
    onEnteringVehicle(vehicle) {
        if (native.getVehicleDoorLockStatus(vehicle.scriptID) === 2) {
            let i = 0;
            const interval = alt.setInterval(() => {
                if (i === 15) {
                    alt.clearInterval(interval);
                    return;
                }
                if (native.getVehicleDoorLockStatus(vehicle.scriptID) === 1) {
                    this.overrideVehicleEntrance();
                    alt.clearInterval(interval);
                    return;
                }
                i++;
            }, 200);
        }
    }
    onEnteredVehicle(vehicle, oldSeat, seat) {
        if (vehicle.hasSyncedMeta("MAX_FUEL")) {
            this.maxFuel = vehicle.getSyncedMeta("MAX_FUEL");
        }
        else {
            this.maxFuel = 0;
        }
        this.updateUI(vehicle);
        this.drivingTickId = this.update.add(() => this.drivingTick(vehicle));
        if (!this.player.getIsInventoryOpen && native.getVehicleClass(vehicle.scriptID) != 13) {
            this.event.emitGui("speedo:toggleui", true);
            this.player.showRadar();
        }
        this.wasLastFrameInVehicle = true;
    }
    onLeftVehicle(vehicle, seat) {
        this.update.remove(this.drivingTickId);
        this.event.emitGui("speedo:toggleui", false);
        this.player.hideRadar();
    }
    repairVehicle(vehicle, vehicleDbId, amount, fixCosmetics) {
        if (vehicle === undefined) {
            return;
        }
        this.vehicle.fix(vehicle, amount, fixCosmetics);
    }
    onSellVehicleMenuShow(hasBankAccount, isInGroup) {
        this.player.setIsAnyMenuOpen = true;
        this.player.freeze();
        this.player.showCursor();
        this.gui.focusView();
        this.event.emitGui("vehiclesellmenu:show", hasBankAccount, isInGroup);
    }
    onSellVehicleMenuClose() {
        this.player.setIsAnyMenuOpen = false;
        this.player.unfreeze();
        this.player.hideCursor();
        this.gui.unfocusView();
    }
    overrideVehicleEntrance() {
        const vehicle = this.vehicle.getClosestVehicle();
        if (!vehicle) {
            return;
        }
        const vehicleDoor = this.vehicle.getClosestVehicleDoor(vehicle);
        if (vehicleDoor > -1) {
            native.taskEnterVehicle(alt.Player.local, vehicle, -1, vehicleDoor - 1, 1, 1, 0);
        }
    }
    drivingTick(vehicle) {
        if (vehicle == null) {
            return;
        }
        if (!vehicle.valid) {
            return;
        }
        this.blockPlayerVehicleRollingOver(vehicle);
        this.updateUI(vehicle);
    }
    tick() {
        alt.Vehicle.all.forEach((vehicle) => {
            this.drawAdminDebug(vehicle);
        });
        if (this.wasLastFrameInVehicle) {
            if (alt.Player.local.vehicle === undefined) {
                this.event.emitGui("speedo:toggleui", false);
                this.wasLastFrameInVehicle = false;
            }
        }
    }
    updateUI(vehicle) {
        if (vehicle == null || !vehicle.valid) {
            return;
        }
        if (native.getVehicleClass(vehicle.scriptID) === 13) {
            return;
        }
        let fuelPercentage = 1;
        let drivenKilometre = -1;
        if (vehicle.hasSyncedMeta("FUEL")) {
            const fuel = vehicle.getSyncedMeta("FUEL");
            fuelPercentage = fuel / this.maxFuel;
        }
        if (vehicle.hasSyncedMeta("DRIVEN_KILOMETRE")) {
            drivenKilometre = vehicle.getSyncedMeta("DRIVEN_KILOMETRE");
        }
        this.event.emitGui("speedo:getinformation", {
            speed: this.vehicle.getCurrentSpeed(vehicle),
            rpm: vehicle.rpm,
            gear: vehicle.gear,
            fuelPercentage: fuelPercentage,
            engine: native.getIsVehicleEngineRunning(vehicle.scriptID),
            drivenKilometre: drivenKilometre,
        });
    }
    blockPlayerVehicleRollingOver(vehicle) {
        const roll = native.getEntityRoll(vehicle.scriptID);
        if (roll > 75 || roll < -75) {
            native.disableControlAction(2, InputType.VEH_MOVE_LR, true);
            native.disableControlAction(2, InputType.VEH_MOVE_UD, true);
        }
    }
    drawAdminDebug(vehicle) {
        if (!this.player.isAduty || !vehicle.hasSyncedMeta("ID")) {
            return;
        }
        const id = vehicle.getSyncedMeta("ID");
        const owner = vehicle.getSyncedMeta("OWNER");
        const engineHealth = native.getVehicleEngineHealth(vehicle.scriptID);
        const bodyHealth = native.getVehicleBodyHealth(vehicle.scriptID);
        this.text.drawText3dWithDistance(`Id: ${id}\nEigentümer: ${owner}\nEngine Health: ${engineHealth.toFixed(2)}\nBody Health: ${bodyHealth.toFixed(2)}`, vehicle.pos.x, vehicle.pos.y, vehicle.pos.z + 0.5, 0.4, 0, 41, 128, 185, 255, false, true, 5);
    }
};
__decorate([
    on('keydown'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VehicleHandler.prototype, "onKeydown", null);
__decorate([
    onServer("vehicle:entering"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [alt.Vehicle]),
    __metadata("design:returntype", void 0)
], VehicleHandler.prototype, "onEnteringVehicle", null);
__decorate([
    on("enteredVehicle"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [alt.Vehicle, Number, Number]),
    __metadata("design:returntype", void 0)
], VehicleHandler.prototype, "onEnteredVehicle", null);
__decorate([
    on("leftVehicle"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [alt.Vehicle, Number]),
    __metadata("design:returntype", void 0)
], VehicleHandler.prototype, "onLeftVehicle", null);
__decorate([
    onServer("vehicle:repair"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [alt.Vehicle, Number, Number, Boolean]),
    __metadata("design:returntype", void 0)
], VehicleHandler.prototype, "repairVehicle", null);
__decorate([
    onServer("vehiclesellmenu:show"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, Boolean]),
    __metadata("design:returntype", void 0)
], VehicleHandler.prototype, "onSellVehicleMenuShow", null);
__decorate([
    onServer("vehiclesellmenu:close"),
    onGui("vehiclesellmenu:close"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VehicleHandler.prototype, "onSellVehicleMenuClose", null);
VehicleHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [Player,
        EventModule,
        UpdateModule,
        TextModule,
        LoggerModule,
        VehicleModule,
        GuiModule])
], VehicleHandler);

let WebviewHandler = class WebviewHandler {
    gui;
    event;
    constructor(gui, event) {
        this.gui = gui;
        this.event = event;
    }
    create(url) {
        this.gui.createView(url);
    }
    guiOn(name, callback) {
        this.gui.guiOn(name, callback);
    }
    guiEmit(name, ...args) {
        this.gui.guiEmit(name, ...args);
    }
    guiEmitToServer(name, ...args) {
        this.event.emitServer(name, ...args);
    }
    guiEmitFromServer(name, ...args) {
        this.gui.guiEmit(name, ...args);
    }
};
__decorate([
    onServer("webview:create"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WebviewHandler.prototype, "create", null);
__decorate([
    on(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", void 0)
], WebviewHandler.prototype, "guiOn", null);
__decorate([
    on(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WebviewHandler.prototype, "guiEmit", null);
__decorate([
    onGui("gui:emitserver"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WebviewHandler.prototype, "guiEmitToServer", null);
__decorate([
    onServer("gui:emit"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WebviewHandler.prototype, "guiEmitFromServer", null);
WebviewHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [GuiModule,
        EventModule])
], WebviewHandler);

let TuningHandler = class TuningHandler {
};
TuningHandler = __decorate([
    foundation(),
    singleton()
], TuningHandler);

let FreeCamHandler = class FreeCamHandler {
    freecam;
    constructor(freecam) {
        this.freecam = freecam;
    }
    onStreamSyncedMetaChange(entity, key, value, oldValue) {
        native.setEntityAlpha(entity.scriptID, entity.hasStreamSyncedMeta("FREECAM") ? 0 : 255, false);
        native.setEntityCollision(entity.scriptID, !entity.hasStreamSyncedMeta("FREECAM"), false);
        native.freezeEntityPosition(entity.scriptID, entity.hasStreamSyncedMeta("FREECAM"));
        native.setPedCanBeTargetted(entity.scriptID, !entity.hasStreamSyncedMeta("FREECAM"));
    }
    onGameEntityCreate(entity) {
        native.setEntityAlpha(entity.scriptID, entity.hasStreamSyncedMeta("FREECAM") ? 0 : 255, false);
        native.setEntityCollision(entity.scriptID, !entity.hasStreamSyncedMeta("FREECAM"), false);
        native.freezeEntityPosition(entity.scriptID, entity.hasStreamSyncedMeta("FREECAM"));
        native.setPedCanBeTargetted(entity.scriptID, !entity.hasStreamSyncedMeta("FREECAM"));
    }
    onOpen() {
        const camPos = alt.Player.local.pos;
        const camRot = alt.Player.local.rot;
        this.freecam.start(camPos, camRot);
    }
    onSetPos(pos) {
        this.freecam.setPos(pos);
    }
    onClose(teleportToPosition) {
        this.freecam.stop(teleportToPosition);
    }
};
__decorate([
    on("streamSyncedMetaChange"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [alt.Entity, String, Object, Object]),
    __metadata("design:returntype", void 0)
], FreeCamHandler.prototype, "onStreamSyncedMetaChange", null);
__decorate([
    on("gameEntityCreate"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [alt.Entity]),
    __metadata("design:returntype", void 0)
], FreeCamHandler.prototype, "onGameEntityCreate", null);
__decorate([
    onServer("freecam:open"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FreeCamHandler.prototype, "onOpen", null);
__decorate([
    onServer("freecam:setpos"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [alt.Vector3]),
    __metadata("design:returntype", void 0)
], FreeCamHandler.prototype, "onSetPos", null);
__decorate([
    onServer("freecam:close"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", void 0)
], FreeCamHandler.prototype, "onClose", null);
FreeCamHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [FreeCamModule])
], FreeCamHandler);

let NotificationHandler = class NotificationHandler {
    notification;
    constructor(notification) {
        this.notification = notification;
    }
    sendNotification(notification) {
        this.notification.sendNotification(notification);
    }
    guiError(errorMessage) {
        const notification = {
            type: NotificationType.ERROR,
            text: errorMessage
        };
        this.notification.sendNotification(notification);
    }
};
__decorate([
    onServer("notification:send"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationHandler.prototype, "sendNotification", null);
__decorate([
    onGui("notification:error"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationHandler.prototype, "guiError", null);
NotificationHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [NotificationModule])
], NotificationHandler);

let AuthenticationHandler = class AuthenticationHandler {
    player;
    event;
    gui;
    constructor(player, event, gui) {
        this.player = player;
        this.event = event;
        this.gui = gui;
    }
    guiIsReady() {
        // Discord offline
        if (alt.Discord.currentUser === null) {
            this.player.fadeIn(500);
            this.event.emitGui("gui:routeto", "offline", alt.Player.local.name);
            return;
        }
        this.gui.focusView();
        this.player.showCursor();
        this.event.emitServer("auth:requestlogin", alt.Discord.currentUser.id);
    }
    onShowLogin() {
        this.player.fadeIn(500);
        this.event.emitGui("gui:routeto", "signin", alt.Player.local.name);
    }
    onShowRegister() {
        this.player.fadeIn(500);
        this.event.emitGui("gui:routeto", "signup", alt.Player.local.name);
    }
};
__decorate([
    on("gui:ready"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthenticationHandler.prototype, "guiIsReady", null);
__decorate([
    onServer("auth:showlogin"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthenticationHandler.prototype, "onShowLogin", null);
__decorate([
    onServer("auth:showsignup"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthenticationHandler.prototype, "onShowRegister", null);
AuthenticationHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [Player,
        EventModule,
        GuiModule])
], AuthenticationHandler);

let TutorialHandler = class TutorialHandler {
    player;
    event;
    gui;
    constructor(player, event, gui) {
        this.player = player;
        this.event = event;
        this.gui = gui;
    }
};
TutorialHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [Player,
        EventModule,
        GuiModule])
], TutorialHandler);

let NameTagHandler = class NameTagHandler {
    math;
    text;
    update;
    player;
    constructor(math, text, update, player) {
        this.math = math;
        this.text = text;
        this.update = update;
        this.player = player;
        this.update.add(() => this.tick());
    }
    tick() {
        this.renderNameTags();
    }
    renderNameTags() {
        if (alt.Player.all.length <= 1)
            return;
        const currentPlayers = [...alt.Player.all];
        let count = 0;
        currentPlayers.forEach((target) => {
            if (count >= 30) {
                return;
            }
            const renderData = this.getPlayerOnScreen(target);
            if (!renderData) {
                return;
            }
            count += 1;
            if (target.hasStreamSyncedMeta("FREECAM")) {
                return;
            }
            const characterId = target.getSyncedMeta("ID");
            const rpName = target.getSyncedMeta("CHARACTER_NAME");
            const color = target.getSyncedMeta("NAMECOLOR");
            const isTyping = target.getSyncedMeta("IS_TYPING");
            let finalText = `${color}${rpName} [${characterId}]`;
            if (isTyping) {
                finalText = `${finalText}\n~b~~w~(schreibt)`;
            }
            const scale = 0.4 - renderData.dist * 0.01;
            this.text.drawText3d(finalText, renderData.pos.x, renderData.pos.y, renderData.pos.z + 1.3, scale, 4, 255, 255, 255, 200, true, false);
        });
    }
    getPlayerOnScreen(target) {
        if (target === alt.Player.local) {
            return undefined;
        }
        const onScreen = native.isEntityOnScreen(target.scriptID);
        if (!onScreen) {
            return undefined;
        }
        const dist = this.math.distance(alt.Player.local.pos, target.pos);
        if (dist > 25) {
            return undefined;
        }
        const id = alt.Player.local.scriptID;
        const los = native.hasEntityClearLosToEntity(id, target.scriptID, 17);
        if (!los) {
            return undefined;
        }
        return { name: target.name, dist, pos: target.pos };
    }
};
NameTagHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [MathModule,
        TextModule,
        UpdateModule,
        Player])
], NameTagHandler);

let HudHandler = class HudHandler {
    event;
    ready;
    money = 0;
    constructor(event) {
        this.event = event;
    }
    onLoaded() {
        this.ready = true;
        this.event.emitGui("hud:setmoney", this.money);
        this.event.emitGui("hud:updatehealth", alt.Player.local.health, alt.Player.local.armour);
    }
    setMoney(amount) {
        this.money = amount;
        if (this.ready) {
            this.event.emitGui("hud:setmoney", this.money);
        }
    }
};
__decorate([
    onGui("hud:ready"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HudHandler.prototype, "onLoaded", null);
__decorate([
    onServer("hud:setmoney"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HudHandler.prototype, "setMoney", null);
HudHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [EventModule])
], HudHandler);

let InVehicleMenu = class InVehicleMenu {
    logger;
    event;
    constructor(logger, event) {
        this.logger = logger;
        this.event = event;
    }
    interact(currentVehicle) {
        this.event.emitServer("invehicleactions:get");
    }
};
InVehicleMenu = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [LoggerModule,
        EventModule])
], InVehicleMenu);

let PlayerMenu = class PlayerMenu {
    logger;
    event;
    constructor(logger, event) {
        this.logger = logger;
        this.event = event;
    }
    interact(entityId) {
        this.event.emitServer("playeractions:get");
    }
};
PlayerMenu = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [LoggerModule,
        EventModule])
], PlayerMenu);

let PedMenu = class PedMenu {
    logger;
    event;
    constructor(logger, event) {
        this.logger = logger;
        this.event = event;
    }
    interact(entityId) {
        const targetPlayer = alt.Player.all.find(x => x.scriptID === entityId);
        let targetPlayerId = undefined;
        if (targetPlayer) {
            targetPlayerId = targetPlayer.getSyncedMeta("ID");
        }
        this.event.emitServer("pedactions:get", native.getEntityModel(entityId), targetPlayerId);
    }
};
PedMenu = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [LoggerModule,
        EventModule])
], PedMenu);

let DateModule = class DateModule {
    getNumericDate(dateJson) {
        if (dateJson === "") {
            return "";
        }
        const date = new Date(JSON.parse(dateJson));
        return date.toLocaleDateString("de-DE", { hour: 'numeric', minute: 'numeric', year: 'numeric', month: 'numeric', day: 'numeric' });
    }
    getDate(dateJson) {
        if (dateJson === "") {
            return "";
        }
        const date = new Date(JSON.parse(dateJson));
        return date.toLocaleDateString("de-DE", { hour: 'numeric', minute: 'numeric', year: 'numeric', month: 'long', day: 'numeric' });
    }
};
DateModule = __decorate([
    singleton()
], DateModule);

let ObjectSyncModule = class ObjectSyncModule {
    logger;
    update;
    player;
    text;
    date;
    objects = [];
    constructor(logger, update, player, text, date) {
        this.logger = logger;
        this.update = update;
        this.player = player;
        this.text = text;
        this.date = date;
        this.update.add(() => {
            for (const key in this.objects) {
                const object = this.objects[key];
                if (object.entity !== undefined) {
                    if (this.player.isAduty) {
                        if (object.itemId === -1) {
                            this.text.drawText3dWithDistance(`Erstellt von: ${object.ownerName}\nErstellt um: ${this.date.getDate(object.createdAtJson)}`, object.position.x, object.position.y, object.position.z + 0.5, 0.4, 0, 255, 255, 255, 255, false, true, 5);
                        }
                        else {
                            this.text.drawText3dWithDistance(`ItemId: ${object.itemId}\nErstellt von: ${object.ownerName}\nErstellt um: ${this.date.getDate(object.createdAtJson)}`, object.position.x, object.position.y, object.position.z + 0.5, 0.4, 0, 255, 255, 255, 255, false, true, 5);
                        }
                    }
                }
            }
        });
    }
    add(id, model, name, position, rotation, freeze, onFire, itemId, ownerName, createdAtJson) {
        loadModel(alt.hash(model)).then(() => {
            const entity = native.createObject(native.getHashKey(model), position.x, position.y, position.z, false, false, false);
            this.objects[id] = {
                id: id,
                model: model,
                name: name,
                entity: entity,
                freeze: freeze,
                position: position,
                rotation: rotation,
                onFire: onFire,
                itemId: itemId,
                ownerName: ownerName,
                createdAtJson: createdAtJson
            };
            this.setFreeze(id, freeze);
            this.setPosition(id, position);
            this.setRotation(id, rotation);
            this.setOnFire(id, onFire);
        });
    }
    restore(id) {
        if (this.objects.hasOwnProperty(id)) {
            const obj = this.objects[id];
            loadModel(alt.hash(obj.model)).then(() => {
                this.objects[id].entity = native.createObject(native.getHashKey(obj.model), obj.position.x, obj.position.y, obj.position.z, false, false, false);
                this.setFreeze(id, obj.freeze);
                this.setPosition(id, obj.position);
                this.setRotation(id, obj.rotation);
                this.setOnFire(id, obj.onFire);
            });
        }
    }
    remove(id) {
        if (this.objects.hasOwnProperty(id)) {
            native.deleteObject(this.objects[id].entity);
            this.objects[id].entity = null;
        }
    }
    clear(id) {
        if (this.objects.hasOwnProperty(id)) {
            delete this.objects[id];
        }
    }
    setFreeze(id, freeze) {
        if (this.objects.hasOwnProperty(id)) {
            native.freezeEntityPosition(this.objects[id].entity, freeze);
            this.objects[id].freeze = freeze;
        }
    }
    getObject(id) {
        if (this.objects.hasOwnProperty(id)) {
            return this.objects[id];
        }
    }
    getObjectByEntity(entity) {
        const currentObjects = this.objects.filter(obj => obj !== null);
        return currentObjects.find(obj => obj.entity === entity);
    }
    setPosition(id, position) {
        if (this.objects.hasOwnProperty(id)) {
            this.objects[id].position = position;
            native.setEntityCoords(this.objects[id].entity, position.x, position.y, position.z, false, false, false, false);
        }
    }
    setRotation(id, rotation) {
        if (this.objects.hasOwnProperty(id)) {
            native.setEntityRotation(this.objects[id].entity, rotation.x, rotation.y, rotation.z, 0, true);
            this.objects[id].rotation = rotation;
        }
    }
    setOnFire(id, onFire = null) {
        if (this.objects.hasOwnProperty(id)) {
            if (onFire) {
                this.objects[id].fireEntity = native.startScriptFire(this.objects[id].position.x, this.objects[id].position.y, this.objects[id].position.z, 1, true);
            }
            else {
                if (this.objects[id].fireEntity !== undefined) {
                    native.removeScriptFire(this.objects[id].fireEntity);
                    this.objects[id].fireEntity = null;
                }
            }
            this.objects[id].onFire = onFire;
        }
    }
};
ObjectSyncModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [LoggerModule,
        UpdateModule,
        Player,
        TextModule,
        DateModule])
], ObjectSyncModule);

let ObjectMenu = class ObjectMenu {
    event;
    objectSync;
    logger;
    player;
    constructor(event, objectSync, logger, player) {
        this.event = event;
        this.objectSync = objectSync;
        this.logger = logger;
        this.player = player;
    }
    interact(entityId) {
        const model = native.getEntityModel(entityId);
        if (this.player.isAduty) {
            alt.logWarning("Id: " + model + ", Position: " + JSON.stringify(native.getEntityCoords(entityId, false)));
        }
        let droppedObjId = undefined;
        const object = this.objectSync.getObjectByEntity(entityId);
        if (object) {
            droppedObjId = object.id;
        }
        this.event.emitServer("objectactions:get", entityId, model, droppedObjId);
    }
};
ObjectMenu = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        ObjectSyncModule,
        LoggerModule,
        Player])
], ObjectMenu);

let VehicleMenu = class VehicleMenu {
    logger;
    event;
    math;
    constructor(logger, event, math) {
        this.logger = logger;
        this.event = event;
        this.math = math;
    }
    interact(coords) {
        let closestVehicle;
        let lastDistance = 5;
        alt.Vehicle.all.forEach(vehicle => {
            const vehiclePosition = vehicle.pos;
            const distance = this.math.distance(coords, vehiclePosition);
            if (distance < lastDistance) {
                closestVehicle = vehicle;
                lastDistance = distance;
            }
        });
        if (closestVehicle === undefined) {
            return;
        }
        if (closestVehicle.hasSyncedMeta("ID")) {
            const id = closestVehicle.getSyncedMeta("ID");
            this.event.emitServer("vehicleactions:get", id);
        }
    }
};
VehicleMenu = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [LoggerModule,
        EventModule,
        MathModule])
], VehicleMenu);

let ContextModule = class ContextModule {
    event;
    player;
    update;
    math;
    camera;
    gui;
    get getIsOpen() {
        return this.isOpen;
    }
    lastX;
    lastY;
    everyTickRef;
    endPoint;
    isOpen;
    constructor(event, player, update, math, camera, gui) {
        this.event = event;
        this.player = player;
        this.update = update;
        this.math = math;
        this.camera = camera;
        this.gui = gui;
    }
    open(title, actions, useLastPos = false, onCenter = false) {
        const [_, width, height] = native.getActiveScreenResolution(0, 0);
        if (!useLastPos) {
            this.lastX = width * native.getControlNormal(0, InputType.CURSOR_X);
            this.lastY = height * native.getControlNormal(0, InputType.CURSOR_Y);
        }
        if (onCenter) {
            const [_, x, y] = native.getActiveScreenResolution(0, 0);
            const pos = new alt.Vector3(x * 0.5, y * 0.5, 0);
            this.lastX = pos.x;
            this.lastY = pos.y;
        }
        const contextMenu = {
            title: title,
            x: this.lastX,
            y: this.lastY,
            actions: actions
        };
        this.isOpen = true;
        this.event.emitGui("contextmenu:setup", contextMenu);
    }
    close() {
        if (this.everyTickRef) {
            this.update.remove(this.everyTickRef);
            this.everyTickRef = null;
        }
        this.endPoint = undefined;
        this.player.hideCursor();
        this.gui.unfocusView();
        this.isOpen = false;
        this.event.emitGui("contextmenu:close");
    }
};
ContextModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        Player,
        UpdateModule,
        MathModule,
        CameraModule,
        GuiModule])
], ContextModule);

let InteractModule = class InteractModule {
    event;
    player;
    update;
    math;
    camera;
    gui;
    logger;
    inVehicleMenu;
    playerMenu;
    pedMenu;
    objectMenu;
    vehicleMenu;
    contextMenu;
    MAX_DISTANCE = 2;
    everyTickRef;
    endPoint;
    lastRaycast = Date.now();
    clickCooldown = Date.now();
    currentPlayerPos;
    constructor(event, player, update, math, camera, gui, logger, inVehicleMenu, playerMenu, pedMenu, objectMenu, vehicleMenu, contextMenu) {
        this.event = event;
        this.player = player;
        this.update = update;
        this.math = math;
        this.camera = camera;
        this.gui = gui;
        this.logger = logger;
        this.inVehicleMenu = inVehicleMenu;
        this.playerMenu = playerMenu;
        this.pedMenu = pedMenu;
        this.objectMenu = objectMenu;
        this.vehicleMenu = vehicleMenu;
        this.contextMenu = contextMenu;
    }
    startInteract() {
        if (!this.player.isSpawnedCharacter || this.player.getIsAnyTextOpen) {
            return;
        }
        this.player.showCursor();
        if (alt.Player.local.vehicle) {
            this.inVehicleMenu.interact(alt.Player.local.vehicle);
        }
        else {
            if (this.everyTickRef) {
                this.update.remove(this.everyTickRef);
                this.everyTickRef = null;
            }
            this.everyTickRef = this.update.add(() => this.tick());
        }
        this.player.hasInteractionOpen = true;
    }
    stopInteraction() {
        this.contextMenu.close();
        this.player.hasInteractionOpen = false;
        if (this.everyTickRef) {
            this.update.remove(this.everyTickRef);
            this.everyTickRef = null;
        }
    }
    tick() {
        this.drawMenu();
        if (!alt.isKeyDown(KeyCodes.ALT) || (this.contextMenu.getIsOpen && this.player.getIsAnyTextOpen)) {
            this.stopInteraction();
        }
    }
    drawMenu() {
        const x = alt.getCursorPos().x;
        const y = alt.getCursorPos().y;
        if (Date.now() > this.lastRaycast) {
            this.lastRaycast = Date.now();
            const result = this.math.screenToWorld(x, y, 22);
            const entityType = native.getEntityType(result.entity);
            if (!result.isHit || entityType === 0) {
                this.endPoint = undefined;
                return;
            }
            this.endPoint = result.pos;
        }
        this.drawVisualLine();
        if (native.isDisabledControlJustPressed(0, InputType.AIM)) {
            if (Date.now() < this.clickCooldown) {
                return;
            }
            this.clickCooldown = Date.now() + 100;
            const result = this.math.screenToWorld(x, y, 22);
            const entityType = native.getEntityType(result.entity);
            if (!result.isHit || entityType === 0) {
                this.endPoint = undefined;
                return;
            }
            const rayCastInfo = {
                isHit: result.isHit,
                pos: result.pos,
                normal: result.normal,
                entity: result.entity,
            };
            if (this.math.distance(alt.Player.local.pos, rayCastInfo.pos) > this.MAX_DISTANCE) {
                return;
            }
            // We have to reset the ui.
            this.event.emitGui("contextmenu:close");
            this.gui.focusView();
            this.currentPlayerPos = alt.Player.local.pos;
            switch (entityType) {
                case 1:
                    this.openPedMenu(rayCastInfo.entity, rayCastInfo.pos);
                    break;
                case 2:
                    this.openVehicleMenu(rayCastInfo.entity, rayCastInfo.pos);
                    break;
                case 3:
                    this.openObjectMenu(rayCastInfo.entity, rayCastInfo.pos);
                    break;
            }
        }
        if (this.currentPlayerPos !== undefined) {
            if (this.math.distance(alt.Player.local.pos, this.currentPlayerPos) > 1) {
                this.event.emitGui("contextmenu:close");
            }
        }
    }
    drawVisualLine() {
        if (this.endPoint === undefined) {
            return;
        }
        let lineColor;
        if (this.math.distance(alt.Player.local.pos, this.endPoint) > this.MAX_DISTANCE) {
            lineColor = { red: 255, green: 25, blue: 25 };
        }
        else {
            lineColor = { red: 255, green: 255, blue: 255 };
        }
        native.drawLine(alt.Player.local.pos.x, alt.Player.local.pos.y, alt.Player.local.pos.z, this.endPoint.x, this.endPoint.y, this.endPoint.z, lineColor.red, lineColor.green, lineColor.blue, 50);
    }
    openPedMenu(entityId, coords) {
        if (entityId === alt.Player.local.scriptID) {
            this.playerMenu.interact(entityId);
            return;
        }
        else {
            this.pedMenu.interact(entityId);
            return;
        }
    }
    openObjectMenu(entityId, coords) {
        if (alt.Player.local.vehicle) {
            return;
        }
        this.objectMenu.interact(entityId);
    }
    openVehicleMenu(entityId, coords) {
        if (alt.Player.local.vehicle) {
            return;
        }
        this.vehicleMenu.interact(coords);
    }
};
InteractModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        Player,
        UpdateModule,
        MathModule,
        CameraModule,
        GuiModule,
        LoggerModule,
        InVehicleMenu,
        PlayerMenu,
        PedMenu,
        ObjectMenu,
        VehicleMenu,
        ContextModule])
], InteractModule);

let ContextMenuHandler = class ContextMenuHandler {
    interact;
    player;
    logger;
    event;
    contextMenu;
    constructor(interact, player, logger, event, contextMenu) {
        this.interact = interact;
        this.player = player;
        this.logger = logger;
        this.event = event;
        this.contextMenu = contextMenu;
    }
    onKeydown(key) {
        if (this.player.isInAPrison || !this.player.isSpawnedCharacter) {
            return;
        }
        if (key === KeyCodes.ALT) {
            if (!this.player.hasInteractionOpen) {
                this.interact.startInteract();
            }
        }
    }
    keyup(key) {
        if (this.player.isInAPrison || !this.player.isSpawnedCharacter) {
            return;
        }
        if (key === KeyCodes.ALT) {
            if (this.player.hasInteractionOpen) {
                this.interact.stopInteraction();
            }
        }
    }
    onOpen(title, actions) {
        this.contextMenu.open(title, actions);
    }
    onSelectAction(action) {
        this.event.emitServer(action.event, action.customData);
        this.contextMenu.close();
    }
};
__decorate([
    on("keydown"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ContextMenuHandler.prototype, "onKeydown", null);
__decorate([
    on("keyup"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ContextMenuHandler.prototype, "keyup", null);
__decorate([
    onServer("contextmenu:open"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", void 0)
], ContextMenuHandler.prototype, "onOpen", null);
__decorate([
    onGui("contextmenu:selectaction"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContextMenuHandler.prototype, "onSelectAction", null);
ContextMenuHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [InteractModule,
        Player,
        LoggerModule,
        EventModule,
        ContextModule])
], ContextMenuHandler);

var BankingPermission;
(function (BankingPermission) {
    BankingPermission[BankingPermission["NONE"] = 0] = "NONE";
    BankingPermission[BankingPermission["DEPOSIT"] = 1] = "DEPOSIT";
    BankingPermission[BankingPermission["WITHDRAW"] = 2] = "WITHDRAW";
    BankingPermission[BankingPermission["TRANSFER"] = 4] = "TRANSFER";
    BankingPermission[BankingPermission["SEE_HISTORY"] = 8] = "SEE_HISTORY";
    BankingPermission[BankingPermission["MANAGEMENT"] = 16] = "MANAGEMENT";
})(BankingPermission || (BankingPermission = {}));

var LicenseType;
(function (LicenseType) {
    LicenseType[LicenseType["NONE"] = 0] = "NONE";
    LicenseType[LicenseType["VEHICLE_WORKSHOP"] = 1] = "VEHICLE_WORKSHOP";
    LicenseType[LicenseType["GOODS_TRANSPORT"] = 2] = "GOODS_TRANSPORT";
    LicenseType[LicenseType["PERSON_TRANSPORT"] = 4] = "PERSON_TRANSPORT";
    LicenseType[LicenseType["TOWNING_AGENCY"] = 8] = "TOWNING_AGENCY";
})(LicenseType || (LicenseType = {}));

let PhoneHandler = class PhoneHandler {
    event;
    phone;
    gui;
    player;
    notification;
    logger;
    phoneKeyPressedTimes = 0;
    constructor(event, phone, gui, player, notification, logger) {
        this.event = event;
        this.phone = phone;
        this.gui = gui;
        this.player = player;
        this.notification = notification;
        this.logger = logger;
        alt.setInterval(() => {
            if (!this.phone.hasPhone)
                return;
            if (this.phoneKeyPressedTimes > 0) {
                this.phoneKeyPressedTimes--;
            }
        }, 700);
    }
    onKeydown(key) {
        if (!this.phone.hasPhone || this.player.isInAPrison || !this.player.isSpawnedCharacter)
            return;
        if (key === KeyCodes.UP_ARROW) {
            if (this.player.getIsChatting || this.player.getIsAnyMenuOpen || this.player.hasInteractionOpen)
                return;
            this.phoneKeyPressedTimes++;
            if (this.phoneKeyPressedTimes >= 2) {
                this.event.emitServer("phone:requestopen", this.phone.phoneId);
                this.phoneKeyPressedTimes = 0;
            }
            if (this.phone.inCall) {
                this.event.emitGui("phone:setphonedown", false);
            }
            if (this.player.getIsPhoneOpen) {
                this.gui.focusView();
                this.player.showCursor();
                this.player.lockCamera(true);
            }
        }
        if (key === KeyCodes.DOWN_ARROW) {
            if (this.player.getIsPhoneOpen) {
                if (this.phone.inCall) {
                    this.gui.unfocusView(true);
                    this.player.hideCursor(true);
                    this.player.lockCamera(false, true);
                    this.event.emitGui("phone:setphonedown", true);
                    this.notification.sendNotification({
                        type: NotificationType.INFO,
                        text: "Mit der Pfeiltaste nach oben kannst du dein Handy wieder fokussieren.",
                    });
                }
                else {
                    this.phone.close();
                }
            }
        }
    }
    onSetup(phone) {
        this.phone.setup(phone);
    }
    onUpdate(phone) {
        if (this.phone.phoneId === phone.id) {
            this.phone.update(phone);
        }
    }
    onRemove() {
        this.phone.remove();
    }
    onOpenPhone(phone) {
        this.phone.setup(phone);
        this.phone.open();
    }
    onClosePhone() {
        this.phone.close();
    }
    onGetCallFrom(displayedName, callOnPhoneId) {
        if (this.phone.phoneId === callOnPhoneId) {
            this.phone.getCallFrom(displayedName);
        }
    }
    onCallNumber(displayedName) {
        this.phone.callNumber(displayedName);
    }
    onCallGotHangup() {
        this.phone.callGotHanguped();
        this.event.emitGui("phone:setphonedown", false);
        this.gui.focusView();
        this.player.showCursor();
        this.player.lockCamera(true);
    }
    onCallGotDenied() {
        this.phone.callGotDenied();
        this.event.emitGui("phone:setphonedown", false);
        this.gui.focusView();
        this.player.showCursor();
        this.player.lockCamera(true);
    }
    onOpenNewChat(oldId, chat) {
        this.phone.openNewChat(oldId, chat);
    }
    onPhoneLoaded() {
        this.phone.ready = true;
        this.phone.sendToUI();
    }
    onCallPhone(phoneNumber) {
        this.event.emitServer("phone:call", phoneNumber, this.phone.phoneNumber);
        this.phone.inCall = true;
        this.notification.sendNotification({
            type: NotificationType.INFO,
            text: "Mit der Pfeiltaste nach unten kannst du dein Handy wegpacken und wieder laufen.",
        });
    }
    onUpdateLastUsage(chatId) {
        this.phone.updateLastUsage(chatId);
    }
    onAddChat(chat) {
        this.phone.addChat(chat);
    }
    onDeleteChat(chatId) {
        this.phone.deleteChat(chatId);
    }
    onPushMessage(message) {
        this.phone.pushMessage(message);
    }
    onAddContact(contact) {
        this.phone.addContact(contact);
    }
    onEditContact(contact) {
        this.phone.editContact(contact);
    }
    onRemoveContact(contactId) {
        this.phone.removeContact(contactId);
    }
    onDeniedCall() {
        this.phone.denyCurrentCall();
    }
    onAcceptCall() {
        this.phone.acceptCurrentCall();
    }
    onHangupCall() {
        this.phone.hangupCurrentCall();
    }
    onSelectBackground(id) {
        this.event.emitServer("phone:selectbackground", this.phone.phoneId, id);
    }
    onOpenNotifications() {
        this.event.emitServer("phone:opennotifications", this.phone.phoneId);
    }
    onDeleteNotification(id) {
        this.event.emitServer("phone:deletenotification", this.phone.phoneId, id);
    }
    onPhoneBankCreateAccount(bankAccountId) {
        this.event.emitServer("phonebank:createaccount", this.phone.phoneId, bankAccountId);
    }
    onPhoneBankAddCharacter(bankAccountId, characterName) {
        this.event.emitServer("bank:addcharacteraccess", this.phone.phoneId, bankAccountId, characterName);
    }
    onPhoneBankRemoveAccess(bankAccountId, characterId) {
        this.event.emitServer("bank:removeaccess", this.phone.phoneId, bankAccountId, characterId);
    }
    onPhoneBankAddPermission(bankAccountId, characterId, permission) {
        this.event.emitServer("bank:addpermission", this.phone.phoneId, bankAccountId, characterId, permission);
    }
    onPhoneBankRemovePermission(bankAccountId, characterId, permission) {
        this.event.emitServer("bank:removepermission", this.phone.phoneId, bankAccountId, characterId, permission);
    }
    onPhoneBankDeleteAccount(bankAccountId) {
        this.event.emitServer("bank:deletebankaccount", this.phone.phoneId, bankAccountId);
    }
    onPhoneCompanyCreate(name, bankAccountId, houseId) {
        this.event.emitServer("company:create", this.phone.phoneId, name, bankAccountId, houseId);
    }
    onOrderProducts(amount) {
        this.event.emitServer("delivery:orderproducts", this.phone.phoneId, amount);
    }
    onSelectDelivery(deliveryId) {
        this.event.emitServer("delivery:selectdelivery", this.phone.phoneId, deliveryId);
    }
    onBuyLicenses(companyId, license) {
        this.event.emitServer("company:buylicenses", this.phone.phoneId, companyId, license);
    }
    onSellLicenses(companyId, license) {
        this.event.emitServer("company:selllicenses", this.phone.phoneId, companyId, license);
    }
    onLeaseCompanyCancelContract(companyId, leaseCompanyId) {
        this.event.emitServer("leasecompany:cancelcontract", this.phone.phoneId, companyId, leaseCompanyId);
    }
};
__decorate([
    on("keydown"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onKeydown", null);
__decorate([
    onServer("phone:setup"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onSetup", null);
__decorate([
    onServer("phone:update"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onUpdate", null);
__decorate([
    onServer("phone:remove"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onRemove", null);
__decorate([
    onServer("phone:open"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onOpenPhone", null);
__decorate([
    onServer("phone:close"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onClosePhone", null);
__decorate([
    onServer("phone:getcallfrom"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onGetCallFrom", null);
__decorate([
    onServer("phone:callnumber"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onCallNumber", null);
__decorate([
    onServer("phone:callgothungup"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onCallGotHangup", null);
__decorate([
    onServer("phone:callgotdenied"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onCallGotDenied", null);
__decorate([
    onServer("phone:opennewchat"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onOpenNewChat", null);
__decorate([
    onGui("phone:ready"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onPhoneLoaded", null);
__decorate([
    onGui("phone:call"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onCallPhone", null);
__decorate([
    onGui("phone:updatelastusage"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onUpdateLastUsage", null);
__decorate([
    onGui("phone:addchat"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onAddChat", null);
__decorate([
    onGui("phone:deletechat"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onDeleteChat", null);
__decorate([
    onGui("phone:pushmessage"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onPushMessage", null);
__decorate([
    onGui("phone:addcontact"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onAddContact", null);
__decorate([
    onGui("phone:editcontact"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onEditContact", null);
__decorate([
    onGui("phone:removecontact"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onRemoveContact", null);
__decorate([
    onGui("phone:denycall"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onDeniedCall", null);
__decorate([
    onGui("phone:acceptcall"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onAcceptCall", null);
__decorate([
    onGui("phone:hangup"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onHangupCall", null);
__decorate([
    onGui("phone:selectbackground"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onSelectBackground", null);
__decorate([
    onGui("phone:opennotifications"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onOpenNotifications", null);
__decorate([
    onGui("phone:deletenotification"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onDeleteNotification", null);
__decorate([
    onGui("phonebank:createaccount"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onPhoneBankCreateAccount", null);
__decorate([
    onGui("phonebank:addcharacteraccess"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onPhoneBankAddCharacter", null);
__decorate([
    onGui("phonebank:removeaccess"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onPhoneBankRemoveAccess", null);
__decorate([
    onGui("phonebank:addpermission"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onPhoneBankAddPermission", null);
__decorate([
    onGui("phonebank:removepermission"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onPhoneBankRemovePermission", null);
__decorate([
    onGui("phonebank:deletebankaccount"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onPhoneBankDeleteAccount", null);
__decorate([
    onGui("phonecompany:create"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onPhoneCompanyCreate", null);
__decorate([
    onGui("phonedelivery:orderproducts"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onOrderProducts", null);
__decorate([
    onGui("phonedelivery:selectdelivery"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onSelectDelivery", null);
__decorate([
    onGui("phonecompany:buylicenses"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onBuyLicenses", null);
__decorate([
    onGui("phonecompany:selllicenses"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onSellLicenses", null);
__decorate([
    onGui("phoneleasecompany:cancelcontract"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], PhoneHandler.prototype, "onLeaseCompanyCancelContract", null);
PhoneHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        PhoneModule,
        GuiModule,
        Player,
        NotificationModule,
        LoggerModule])
], PhoneHandler);

let AccountModule = class AccountModule {
    get getAccount() {
        return this.account;
    }
    account;
    constructor() { }
    setup(account) {
        this.account = account;
    }
};
AccountModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [])
], AccountModule);

let AdminHandler = class AdminHandler {
    event;
    player;
    gui;
    account;
    isMenuOpen = false;
    constructor(event, player, gui, account) {
        this.event = event;
        this.player = player;
        this.gui = gui;
        this.account = account;
    }
    onKeydown(key) {
        if (this.player.isInAPrison || !this.player.isSpawnedCharacter) {
            return;
        }
        if (key === KeyCodes.F11) {
            if (this.isMenuOpen) {
                this.setMenuState(false);
            }
            else {
                this.event.emitServer("admin:requestmenu");
            }
        }
    }
    onShowMenu() {
        this.setMenuState(true);
    }
    setMenuState(state) {
        if (!this.player.isSpawnedCharacter) {
            return;
        }
        if (this.player.getIsAnyMenuOpen && !this.isMenuOpen || this.player.getIsInventoryOpen) {
            return;
        }
        this.isMenuOpen = state;
        this.player.setIsAnyMenuOpen = this.isMenuOpen;
        this.player.blockGameControls(this.isMenuOpen);
        if (this.isMenuOpen) {
            this.player.showCursor();
            this.gui.focusView();
        }
        else {
            this.player.hideCursor();
            this.gui.unfocusView();
        }
        this.event.emitGui("adminmenu:toggle", this.isMenuOpen);
    }
};
__decorate([
    on("keydown"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminHandler.prototype, "onKeydown", null);
__decorate([
    onServer("admin:showmenu"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminHandler.prototype, "onShowMenu", null);
AdminHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        Player,
        GuiModule,
        AccountModule])
], AdminHandler);

let HouseHandler = class HouseHandler {
    text;
    update;
    logger;
    house;
    event;
    math;
    blip;
    leaseCompany;
    player;
    constructor(text, update, logger, house, event, math, blip, leaseCompany, player) {
        this.text = text;
        this.update = update;
        this.logger = logger;
        this.house = house;
        this.event = event;
        this.math = math;
        this.blip = blip;
        this.leaseCompany = leaseCompany;
        this.player = player;
        this.update.add(() => this.tick());
    }
    onKeydown(key) {
        if (this.player.getIsAnyTextOpen) {
            return;
        }
        if (key === KeyCodes.F) {
            const house = this.house.getHouses.find(h => this.math.distance(new alt.Vector3(h.positionX, h.positionY, h.positionZ), alt.Player.local.pos) <= 1.5);
            const exit = this.house.getInteriors.find(e => this.math.distance(new alt.Vector3(e.x, e.y, e.z), alt.Player.local.pos) <= 1.5);
            if (!alt.Player.local.vehicle && house || !alt.Player.local.vehicle && exit) {
                this.event.emitServer("house:enterexit");
            }
        }
    }
    onAdd(house) {
        this.house.add(house);
        this.house.updateBlips();
    }
    remove(houseId) {
        this.house.remove(houseId);
        this.house.updateBlips();
    }
    async updateHouse(house) {
        await this.house.update(house);
        this.house.updateBlips();
    }
    async sync(houses) {
        await this.house.syncChunk(houses);
        this.house.updateBlips();
    }
    syncExits(interiors) {
        this.house.syncExits(interiors);
    }
    setAduty(state) {
        if (state) {
            this.house.showDebugBlips();
        }
        else {
            this.house.hideDebugBlips();
        }
        this.house.updateBlips();
    }
    onUpdateCharacterHouses(houses) {
        houses.forEach((house) => {
            if (this.house.isLeaseCompany(house)) {
                const leaseCompany = house;
                leaseCompany.typeName = this.leaseCompany.getCompanyTypeName(leaseCompany.leaseCompanyType);
            }
            house.streetName = this.house.getStreet(house.streetDirection, new alt.Vector3(house.positionX, house.positionY, house.positionZ));
        });
        this.event.emitGui("house:updatecharacterhouses", houses);
    }
    tick() {
        this.drawHouseTexts();
    }
    drawHouseTexts() {
        this.house.getHouses.forEach((house) => {
            if (house) {
                if (house.blockedOwnership && !this.player.isAduty) {
                    return;
                }
                const houseNumberText = `Nr. ${house.houseNumber}`;
                const streetText = `${house.streetName}.`;
                let houseTypeText = "Immobilie";
                let lowerText = `${streetText} ${houseNumberText}`;
                let colorText = "~g~";
                if (house.subName.length !== 0) {
                    lowerText = `${streetText} ${house.subName} ${houseNumberText}`;
                }
                if (house.rentable) {
                    houseTypeText = "Mietbare Immobilie";
                }
                if (house.houseType === 1) {
                    const leaseCompany = house;
                    houseTypeText = "Pachtbarer Unternehmenssitz";
                    colorText = "~b~";
                    if (house.subName !== "") {
                        lowerText = `${house.subName} ${this.leaseCompany.getCompanyTypeName(leaseCompany.leaseCompanyType)}`;
                    }
                    else {
                        lowerText = `${this.leaseCompany.getCompanyTypeName(leaseCompany.leaseCompanyType)}`;
                    }
                    const index = this.house.getHouses.indexOf(leaseCompany);
                    this.house.getHouses[index] = leaseCompany;
                }
                let defaultText = `${colorText}${houseTypeText}:\n~w~${lowerText}`;
                if (this.player.isAduty) {
                    defaultText = `${colorText}${houseTypeText} [${house.id}]:\n~w~${lowerText}`;
                }
                if (house.ownerId !== -1 || house.groupOwnerId !== -1) {
                    this.text.drawText3dWithDistance(defaultText, house.positionX, house.positionY, house.positionZ + 1, 0.4, 0, 255, 255, 255, 175, false, true, 2);
                }
                else {
                    if (house.rentable) {
                        this.text.drawText3dWithDistance(`${defaultText}\n${colorText}$${house.price} /renthouse`, house.positionX, house.positionY, house.positionZ + 1, 0.4, 0, 255, 255, 255, 175, false, true, 2);
                    }
                    else {
                        this.text.drawText3dWithDistance(`${defaultText}\n${colorText}$${house.price} /buyhouse`, house.positionX, house.positionY, house.positionZ + 1, 0.4, 0, 255, 255, 255, 175, false, true, 2);
                    }
                }
            }
        });
    }
};
__decorate([
    on("keydown"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HouseHandler.prototype, "onKeydown", null);
__decorate([
    onServer("houses:add"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HouseHandler.prototype, "onAdd", null);
__decorate([
    onServer("houses:remove"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HouseHandler.prototype, "remove", null);
__decorate([
    onServer("houses:update"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HouseHandler.prototype, "updateHouse", null);
__decorate([
    onServer("houses:syncchunk"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], HouseHandler.prototype, "sync", null);
__decorate([
    onServer("houses:syncexits"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], HouseHandler.prototype, "syncExits", null);
__decorate([
    onServer("player:setaduty"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", void 0)
], HouseHandler.prototype, "setAduty", null);
__decorate([
    onServer("house:updatecharacterhouses"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], HouseHandler.prototype, "onUpdateCharacterHouses", null);
HouseHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [TextModule,
        UpdateModule,
        LoggerModule,
        HouseModule,
        EventModule,
        MathModule,
        BlipModule,
        LeaseCompanyModule,
        Player])
], HouseHandler);

let SubTitleModule = class SubTitleModule {
    constructor() { }
    draw(text, durationInMs = 5000) {
        native.beginTextCommandPrint('STRING');
        native.addTextComponentSubstringPlayerName(text);
        native.endTextCommandPrint(durationInMs, true);
    }
    clear() {
        native.beginTextCommandPrint('STRING');
        native.addTextComponentSubstringPlayerName("");
        native.endTextCommandPrint(0, true);
    }
};
SubTitleModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [])
], SubTitleModule);

let SubTitleHandler = class SubTitleHandler {
    subtitle;
    constructor(subtitle) {
        this.subtitle = subtitle;
    }
    draw(message, durationInMs) {
        this.subtitle.draw(message, durationInMs);
    }
    clear() {
        this.subtitle.clear();
    }
};
__decorate([
    onServer("subtitle:draw"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], SubTitleHandler.prototype, "draw", null);
__decorate([
    onServer("subtitle:clera"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SubTitleHandler.prototype, "clear", null);
SubTitleHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [SubTitleModule])
], SubTitleHandler);

let HouseSelectorHandler = class HouseSelectorHandler {
    camera;
    notification;
    logger;
    event;
    math;
    house;
    charCreator;
    houses;
    currentIndex = 0;
    currentHouseId = -1;
    currentHouseIndex = -1;
    stayedOnBuyedHouse = false;
    cameraState = 0;
    helicopterCamInt = 0;
    constructor(camera, notification, logger, event, math, house, charCreator) {
        this.camera = camera;
        this.notification = notification;
        this.logger = logger;
        this.event = event;
        this.math = math;
        this.house = house;
        this.charCreator = charCreator;
    }
    onReset() {
        this.currentIndex = 0;
        this.currentHouseId = -1;
        this.currentHouseIndex = -1;
        this.cameraState = 0;
        if (this.helicopterCamInt) {
            alt.clearInterval(this.helicopterCamInt);
            this.helicopterCamInt = null;
        }
        this.camera.destroyCamera();
    }
    onOpen(maxPoints) {
        this.houses = this.house.getHouses.filter(h => h.southCentralPoints <= maxPoints && h.ownerId === -1 && h.houseType === 0);
        this.selectHouse(this.houses[this.currentIndex]);
    }
    onUpdate(houses) {
        // When the current house is no longer in the list of available houses.
        const currentHouse = houses.find(h => h.id == this.currentHouseId);
        if (currentHouse.ownerId && currentHouse.id !== this.currentHouseId) {
            this.notification.sendNotification({
                type: NotificationType.ERROR,
                text: "Diese Immobilie wurde gerade gekauft, tut uns leid. Die Auswahl an Immobilien wird in Echtzeit kalkuliert."
            });
            this.stayedOnBuyedHouse = true;
            this.event.emitGui("houseselector:block", true);
        }
        else {
            if (this.stayedOnBuyedHouse) {
                this.notification.sendNotification({
                    type: NotificationType.INFO,
                    text: "Diese Immobilie wurde wieder auf dem Markt freigegeben."
                });
                this.event.emitGui("houseselector:block", false);
            }
        }
        this.houses = houses;
    }
    onSelect(houseId) {
        this.currentHouseIndex = this.houses.findIndex(h => h.id === houseId);
        this.currentHouseId = houseId;
        const houseData = this.houses.find(h => h.id === houseId);
        this.stayedOnBuyedHouse = false;
        this.charCreator.resetTypePurchaseOrders(CharacterCreatorPurchaseType.HOUSE);
        this.charCreator.addPurchase({
            id: UID(),
            type: CharacterCreatorPurchaseType.HOUSE,
            name: `${houseData.streetName} ${houseData.subName} ${houseData.houseNumber}`,
            description: "Eine Immobilie",
            southCentralPoints: houseData.southCentralPoints,
            removeable: true,
            orderedVehicle: null
        });
        this.event.emitGui("houseselector:select", houseData);
    }
    onClose() {
        if (this.helicopterCamInt) {
            alt.clearInterval(this.helicopterCamInt);
            this.helicopterCamInt = null;
        }
        this.stayedOnBuyedHouse = false;
    }
    onChange(direction) {
        this.currentIndex += direction;
        if (this.currentIndex < 0) {
            this.currentIndex = this.houses.length - 1;
        }
        if (this.currentIndex > this.houses.length - 1) {
            this.currentIndex = 0;
        }
        this.selectHouse(this.houses[this.currentIndex]);
    }
    onTrySelect(houseId) {
        this.event.emitServer("houseselector:tryselect", houseId);
    }
    onShow() {
        this.selectHouse(this.houses[this.currentHouseIndex]);
    }
    onRemove() {
        this.charCreator.resetTypePurchaseOrders(CharacterCreatorPurchaseType.HOUSE);
        this.event.emitServer("houseselector:unselect");
        this.event.emitGui("houseselector:select", null);
    }
    onChangeCamera(state) {
        this.cameraState = state;
        const houseData = this.houses.find(h => h.id === this.currentHouseId);
        this.selectHouse(houseData);
    }
    selectHouse(houseData) {
        const doorPos = new alt.Vector3(houseData.positionX, houseData.positionY, houseData.positionZ + 1);
        const rot = new alt.Vector3(this.math.radToDeg(houseData.roll), this.math.radToDeg(houseData.pitch), this.math.radToDeg(houseData.yaw));
        const dir = this.math.rotationToDirection(rot);
        const camPos = new alt.Vector3((dir.x * 3) + houseData.positionX, (dir.y * 3) + houseData.positionY, houseData.positionZ + 2);
        this.updateCamera(camPos, doorPos);
        this.currentHouseId = houseData.id;
        this.stayedOnBuyedHouse = false;
        this.updateInfo(houseData);
    }
    updateCamera(camPos, doorPos) {
        if (this.helicopterCamInt) {
            alt.clearInterval(this.helicopterCamInt);
            this.helicopterCamInt = null;
        }
        if (this.cameraState === 0) {
            this.createDoorCam(camPos, doorPos);
        }
        else if (this.cameraState === 1) {
            this.createHelicopterCam(doorPos);
        }
    }
    createDoorCam(camPos, doorPos) {
        this.camera.createCamera(camPos, new Vector3(0, 0, 0));
        this.camera.pointAt(doorPos);
    }
    createHelicopterCam(doorPos) {
        let angle = 0;
        const p = this.math.getPointAtPoint(doorPos, 30, angle);
        this.camera.createCamera(new Vector3(p.x, p.y, doorPos.z + 15), new Vector3(0, 0, 0));
        this.camera.pointAt(new Vector3(doorPos.x, doorPos.y, doorPos.z - 3));
        this.helicopterCamInt = alt.setInterval(() => {
            const p = this.math.getPointAtPoint(doorPos, 30, angle);
            this.camera.setPos(new Vector3(p.x, p.y, doorPos.z + 15));
            this.camera.pointAt(new Vector3(doorPos.x, doorPos.y, doorPos.z - 3));
            angle += 0.0009;
        }, 10);
    }
    updateInfo(houseData) {
        houseData.streetName = this.house.getStreet(houseData.streetDirection, new alt.Vector3(houseData.positionX, houseData.positionY, houseData.positionZ));
        this.event.emitGui("houseselector:sethouseinfo", houseData);
    }
};
__decorate([
    onServer("houseselector:reset"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HouseSelectorHandler.prototype, "onReset", null);
__decorate([
    onServer("houseselector:open"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HouseSelectorHandler.prototype, "onOpen", null);
__decorate([
    onServer("houseselector:updatechunk"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], HouseSelectorHandler.prototype, "onUpdate", null);
__decorate([
    onServer("houseselector:select"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HouseSelectorHandler.prototype, "onSelect", null);
__decorate([
    onGui("houseselector:close"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HouseSelectorHandler.prototype, "onClose", null);
__decorate([
    onGui("houseselector:change"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HouseSelectorHandler.prototype, "onChange", null);
__decorate([
    onGui("houseselector:tryselect"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HouseSelectorHandler.prototype, "onTrySelect", null);
__decorate([
    onGui("houseselector:show"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HouseSelectorHandler.prototype, "onShow", null);
__decorate([
    onGui("houseselector:remove"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HouseSelectorHandler.prototype, "onRemove", null);
__decorate([
    onGui("houseselector:changecamera"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HouseSelectorHandler.prototype, "onChangeCamera", null);
HouseSelectorHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [CameraModule,
        NotificationModule,
        LoggerModule,
        EventModule,
        MathModule,
        HouseModule,
        CharCreatorModule])
], HouseSelectorHandler);

let SpawnSelectorHandler = class SpawnSelectorHandler {
    camera;
    notification;
    logger;
    event;
    math;
    charCreator;
    spawns = [];
    currentIndex = 0;
    currentSpawnIndex = 0;
    helicopterCamInt = 0;
    constructor(camera, notification, logger, event, math, charCreator) {
        this.camera = camera;
        this.notification = notification;
        this.logger = logger;
        this.event = event;
        this.math = math;
        this.charCreator = charCreator;
    }
    onReset() {
        this.currentIndex = 0;
        this.currentSpawnIndex = this.currentIndex;
        if (this.helicopterCamInt) {
            alt.clearInterval(this.helicopterCamInt);
            this.helicopterCamInt = null;
        }
        this.camera.destroyCamera();
    }
    onOpen(spawns) {
        this.spawns = spawns;
        this.event.emitGui("spawnselector:defaultselect", this.spawns[this.currentIndex]);
        this.selectSpawn(this.spawns[this.currentIndex]);
    }
    onChange(direction) {
        this.currentIndex += direction;
        if (this.currentIndex < 0) {
            this.currentIndex = this.spawns.length - 1;
        }
        if (this.currentIndex > this.spawns.length - 1) {
            this.currentIndex = 0;
        }
        this.selectSpawn(this.spawns[this.currentIndex]);
    }
    onClose() {
        if (this.helicopterCamInt) {
            alt.clearInterval(this.helicopterCamInt);
            this.helicopterCamInt = null;
        }
    }
    onSelect(spawnId) {
        this.currentSpawnIndex = this.currentIndex;
        this.event.emitServer("charcreatorspawn:select", spawnId);
    }
    onShow() {
        this.currentIndex = this.currentSpawnIndex;
        this.selectSpawn(this.spawns[this.currentIndex]);
    }
    selectSpawn(spawn) {
        let pos = new alt.Vector3(spawn.x, spawn.y, spawn.z);
        if (spawn.id === 0) { // LS Airport
            pos = new alt.Vector3(spawn.x, spawn.y, spawn.z + 25);
        }
        this.charCreator.setSpawn(spawn.id);
        this.event.emitGui("spawnselector:setinfo", spawn);
        this.updateCamera(pos);
    }
    updateCamera(spawnPos) {
        if (this.helicopterCamInt) {
            alt.clearInterval(this.helicopterCamInt);
            this.helicopterCamInt = null;
        }
        this.createHelicopterCam(spawnPos);
    }
    createHelicopterCam(pos) {
        let angle = 0;
        const p = this.math.getPointAtPoint(pos, 25, angle);
        this.camera.createCamera(new Vector3$1(p.x, p.y, pos.z + 15), new Vector3$1(0, 0, 0));
        this.camera.pointAt(new Vector3$1(pos.x, pos.y, pos.z - 5));
        this.helicopterCamInt = alt.setInterval(() => {
            const p = this.math.getPointAtPoint(pos, 25, angle);
            this.camera.setPos(new Vector3$1(p.x, p.y, pos.z + 15));
            this.camera.pointAt(new Vector3$1(pos.x, pos.y, pos.z - 5));
            angle += 0.0009;
        }, 10);
    }
};
__decorate([
    onServer("spawnselector:reset"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SpawnSelectorHandler.prototype, "onReset", null);
__decorate([
    onServer("spawnselector:open"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], SpawnSelectorHandler.prototype, "onOpen", null);
__decorate([
    onGui("spawnselector:change"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SpawnSelectorHandler.prototype, "onChange", null);
__decorate([
    onGui("spawnselector:close"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SpawnSelectorHandler.prototype, "onClose", null);
__decorate([
    onGui("spawnselector:select"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SpawnSelectorHandler.prototype, "onSelect", null);
__decorate([
    onGui("spawnselector:show"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SpawnSelectorHandler.prototype, "onShow", null);
SpawnSelectorHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [CameraModule,
        NotificationModule,
        LoggerModule,
        EventModule,
        MathModule,
        CharCreatorModule])
], SpawnSelectorHandler);

let DefinedJobHandler = class DefinedJobHandler {
    player;
    event;
    logger;
    constructor(player, event, logger) {
        this.player = player;
        this.event = event;
        this.logger = logger;
    }
    openMenu(jobs, playerDefinedJob) {
        this.event.emitGui("jobmenu:setup", jobs, playerDefinedJob);
    }
};
__decorate([
    onServer("definedjob:openmenu"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", void 0)
], DefinedJobHandler.prototype, "openMenu", null);
DefinedJobHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [Player,
        EventModule,
        LoggerModule])
], DefinedJobHandler);

let BankHandler = class BankHandler {
    event;
    gui;
    player;
    constructor(event, gui, player) {
        this.event = event;
        this.gui = gui;
        this.player = player;
    }
    onOpenMenu() {
        this.player.setIsAnyMenuOpen = true;
        this.player.freeze();
        this.player.showCursor();
        this.gui.focusView();
        this.event.emitGui("atm:openmenu");
    }
};
__decorate([
    onServer("atm:openmenu"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BankHandler.prototype, "onOpenMenu", null);
BankHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        GuiModule,
        Player])
], BankHandler);

let VehicleInventoryHandler = class VehicleInventoryHandler {
    inventory;
    player;
    vehicle;
    logger;
    update;
    math;
    notification;
    event;
    currentVehicle;
    constructor(inventory, player, vehicle, logger, update, math, notification, event) {
        this.inventory = inventory;
        this.player = player;
        this.vehicle = vehicle;
        this.logger = logger;
        this.update = update;
        this.math = math;
        this.notification = notification;
        this.event = event;
    }
    onKeydown(key) {
        if (key === KeyCodes.ESCAPE || key === KeyCodes.I) {
            if (this.currentVehicle === undefined) {
                return;
            }
            this.close();
        }
    }
    onInteract(vehicle) {
        if (this.math.distance(this.math.getEntityRearPosition(vehicle.scriptID), alt.Player.local.pos) > 1) {
            this.notification.sendNotification({
                type: NotificationType.ERROR,
                text: "Dein Charakter befindet sich nicht am Kofferraum."
            });
            return;
        }
        this.currentVehicle = vehicle;
        this.vehicle.setTrunkState(vehicle, true);
        this.inventory.open();
    }
    close() {
        this.vehicle.setTrunkState(this.currentVehicle, false);
        this.currentVehicle = undefined;
        this.event.emitServer("vehicleinventory:close");
    }
};
__decorate([
    on('keydown'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VehicleInventoryHandler.prototype, "onKeydown", null);
__decorate([
    onServer("vehicleinventory:interact"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [alt.Vehicle]),
    __metadata("design:returntype", void 0)
], VehicleInventoryHandler.prototype, "onInteract", null);
VehicleInventoryHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [InventoryModule,
        Player,
        VehicleModule,
        LoggerModule,
        UpdateModule,
        MathModule,
        NotificationModule,
        EventModule])
], VehicleInventoryHandler);

let PublicGarageHandler = class PublicGarageHandler {
    text;
    update;
    blip;
    logger;
    event;
    player;
    gui;
    constructor(text, update, blip, logger, event, player, gui) {
        this.text = text;
        this.update = update;
        this.blip = blip;
        this.logger = logger;
        this.event = event;
        this.player = player;
        this.gui = gui;
    }
    onSetupUnpark(vehicles) {
        this.player.setIsAnyMenuOpen = true;
        this.player.blockGameControls(true);
        this.player.showCursor();
        this.gui.focusView();
        this.event.emitGui("publicgarage:setupunpark", vehicles);
    }
    onShowRespawnVehicleList(vehicles) {
        this.player.setIsAnyMenuOpen = true;
        this.player.blockGameControls(true);
        this.player.showCursor();
        this.gui.focusView();
        this.event.emitGui("publicgarage:showrespawnvehiclelist", vehicles);
    }
};
__decorate([
    onServer("publicgarage:setupunpark"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], PublicGarageHandler.prototype, "onSetupUnpark", null);
__decorate([
    onServer("publicgarage:showrespawnvehiclelist"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], PublicGarageHandler.prototype, "onShowRespawnVehicleList", null);
PublicGarageHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [TextModule,
        UpdateModule,
        BlipModule,
        LoggerModule,
        EventModule,
        Player,
        GuiModule])
], PublicGarageHandler);

let GroupModule = class GroupModule {
    get getAllGroups() {
        return this.allGroups;
    }
    get getGroups() {
        return this.groups;
    }
    get getCompany() {
        return this.company;
    }
    get getFaction() {
        return this.faction;
    }
    allGroups;
    groups;
    company;
    faction;
    constructor() { }
    setup(allGroups, groups, company, faction) {
        this.allGroups = allGroups;
        this.groups = groups;
        this.company = company;
        this.faction = faction;
    }
};
GroupModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [])
], GroupModule);

let GroupDataHandler = class GroupDataHandler {
    event;
    house;
    logger;
    group;
    constructor(event, house, logger, group) {
        this.event = event;
        this.house = house;
        this.logger = logger;
        this.group = group;
    }
    onSetup(allGroups, groups, company, faction) {
        for (let i = 0; i < allGroups.length; i++) {
            const group = allGroups[i];
            for (let g = 0; g < group.houses.length; g++) {
                group.houses[g].streetName = this.house.getStreet(group.houses[g].streetDirection, new alt.Vector3(group.houses[g].positionX, group.houses[g].positionY, group.houses[g].positionZ));
            }
        }
        if (company !== null) {
            for (let g = 0; g < company.houses.length; g++) {
                company.houses[g].streetName = this.house.getStreet(company.houses[g].streetDirection, new alt.Vector3(company.houses[g].positionX, company.houses[g].positionY, company.houses[g].positionZ));
            }
        }
        if (faction !== null) {
            for (let g = 0; g < faction.houses.length; g++) {
                faction.houses[g].streetName = this.house.getStreet(faction.houses[g].streetDirection, new alt.Vector3(faction.houses[g].positionX, faction.houses[g].positionY, faction.houses[g].positionZ));
            }
        }
        this.group.setup(allGroups, groups, company, faction);
        this.event.emitGui("group:setup", allGroups, groups, company, faction);
    }
};
__decorate([
    onServer("group:setup"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array, Object, Object]),
    __metadata("design:returntype", void 0)
], GroupDataHandler.prototype, "onSetup", null);
GroupDataHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        HouseModule,
        LoggerModule,
        GroupModule])
], GroupDataHandler);

let GroupsMenuHandler = class GroupsMenuHandler {
    event;
    player;
    constructor(event, player) {
        this.event = event;
        this.player = player;
    }
    onLeaveCompany(id) {
        this.event.emitServer("companymenu:leavegroup", id);
    }
};
__decorate([
    onGui("companymenu:leavegroup"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], GroupsMenuHandler.prototype, "onLeaveCompany", null);
GroupsMenuHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        Player])
], GroupsMenuHandler);

let WaypointModule = class WaypointModule {
    logger;
    update;
    blip;
    math;
    updateId;
    currentWaypointBlip;
    currentTargetPos;
    constructor(logger, update, blip, math) {
        this.logger = logger;
        this.update = update;
        this.blip = blip;
        this.math = math;
    }
    set(x, y, z, color, sprite) {
        if (this.currentWaypointBlip !== undefined) {
            this.destroy();
        }
        this.currentTargetPos = new alt.Vector3(x, y, z);
        this.currentWaypointBlip = this.blip.createBlip(this.currentTargetPos, color, sprite, "", true);
        native.setBlipRoute(this.currentWaypointBlip, true);
        native.setBlipRouteColour(this.currentWaypointBlip, color);
        this.updateId = this.update.add(() => this.tick());
    }
    destroy() {
        this.update.remove(this.updateId);
        this.blip.destroyBlip(this.currentWaypointBlip);
    }
    tick() {
        if (this.math.distance(alt.Player.local.pos, this.currentTargetPos) < 4) {
            this.destroy();
        }
    }
};
WaypointModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [LoggerModule,
        UpdateModule,
        BlipModule,
        MathModule])
], WaypointModule);

let WaypointHandler = class WaypointHandler {
    blip;
    update;
    waypoint;
    constructor(blip, update, waypoint) {
        this.blip = blip;
        this.update = update;
        this.waypoint = waypoint;
    }
    onSet(x, y, z, color, sprite) {
        this.waypoint.set(x, y, z, color, sprite);
    }
    onClear() {
        this.waypoint.destroy();
    }
};
__decorate([
    onServer("waypoint:set"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Number, Number]),
    __metadata("design:returntype", void 0)
], WaypointHandler.prototype, "onSet", null);
__decorate([
    onServer("waypoint:clear"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WaypointHandler.prototype, "onClear", null);
WaypointHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [BlipModule,
        UpdateModule,
        WaypointModule])
], WaypointHandler);

let DialogHandler = class DialogHandler {
    event;
    dialog;
    logger;
    constructor(event, dialog, logger) {
        this.event = event;
        this.dialog = dialog;
        this.logger = logger;
    }
    onCreate(dialog) {
        this.dialog.create(dialog);
    }
    onCloseButtonClicked(serverEvent, clientEvent) {
        this.sendEvents(serverEvent, clientEvent);
        this.dialog.destroy();
    }
    onPrimaryButtonClicked(serverEvent, clientEvent, bankAccountId, inputContent) {
        this.handleButtonClicked(serverEvent, clientEvent, bankAccountId, inputContent);
    }
    onSecondaryButtonClicked(serverEvent, clientEvent, bankAccountId, inputContent) {
        this.handleButtonClicked(serverEvent, clientEvent, bankAccountId, inputContent);
    }
    handleButtonClicked(serverEvent, clientEvent, bankAccountId, inputContent) {
        this.sendEvents(serverEvent, clientEvent, bankAccountId, inputContent);
        this.dialog.destroy();
    }
    sendEvents(serverEvent, clientEvent, bankAccountId = -1, inputContent = "") {
        if (this.dialog.getCurrentDialog.dataJson !== "null") {
            const data = JSON.parse(this.dialog.getCurrentDialog.dataJson);
            if (this.dialog.getCurrentDialog.hasBankAccountSelection) {
                if (this.dialog.getCurrentDialog.hasInputField) {
                    if (serverEvent !== null) {
                        this.event.emitServer(serverEvent, bankAccountId, inputContent, ...data);
                    }
                    if (clientEvent !== null) {
                        this.event.emit(clientEvent, bankAccountId, inputContent, ...data);
                    }
                }
                else {
                    if (serverEvent !== null) {
                        this.event.emitServer(serverEvent, bankAccountId, ...data);
                    }
                    if (clientEvent !== null) {
                        this.event.emit(clientEvent, bankAccountId, ...data);
                    }
                }
            }
            else {
                if (this.dialog.getCurrentDialog.hasInputField) {
                    if (serverEvent !== null) {
                        this.event.emitServer(serverEvent, inputContent, ...data);
                    }
                    if (clientEvent !== null) {
                        this.event.emit(clientEvent, inputContent, ...data);
                    }
                }
                else {
                    if (serverEvent !== null) {
                        this.event.emitServer(serverEvent, ...data);
                    }
                    if (clientEvent !== null) {
                        this.event.emit(clientEvent, ...data);
                    }
                }
            }
        }
        else {
            if (this.dialog.getCurrentDialog.hasInputField) {
                if (this.dialog.getCurrentDialog.hasBankAccountSelection) {
                    if (serverEvent !== null) {
                        this.event.emitServer(serverEvent, bankAccountId, inputContent);
                    }
                    if (clientEvent !== null) {
                        this.event.emit(clientEvent, bankAccountId, inputContent);
                    }
                }
                else {
                    if (serverEvent !== null) {
                        this.event.emitServer(serverEvent, inputContent);
                    }
                    if (clientEvent !== null) {
                        this.event.emit(clientEvent, inputContent);
                    }
                }
            }
            else {
                if (this.dialog.getCurrentDialog.hasBankAccountSelection) {
                    if (serverEvent !== null) {
                        this.event.emitServer(serverEvent, bankAccountId);
                    }
                    if (clientEvent !== null) {
                        this.event.emit(clientEvent, bankAccountId);
                    }
                }
                else {
                    if (serverEvent !== null) {
                        this.event.emitServer(serverEvent);
                    }
                    if (clientEvent !== null) {
                        this.event.emit(clientEvent);
                    }
                }
            }
        }
    }
};
__decorate([
    onServer("dialog:create"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DialogHandler.prototype, "onCreate", null);
__decorate([
    onGui("dialog:closebuttonclicked"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DialogHandler.prototype, "onCloseButtonClicked", null);
__decorate([
    onGui("dialog:primarybuttonclicked"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, String]),
    __metadata("design:returntype", void 0)
], DialogHandler.prototype, "onPrimaryButtonClicked", null);
__decorate([
    onGui("dialog:secondarybuttonclicked"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, String]),
    __metadata("design:returntype", void 0)
], DialogHandler.prototype, "onSecondaryButtonClicked", null);
DialogHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        DialogModule,
        LoggerModule])
], DialogHandler);

let InteriorHandler = class InteriorHandler {
    logger;
    notification;
    player;
    gui;
    event;
    oldInterior = 0;
    intervalId;
    constructor(logger, notification, player, gui, event) {
        this.logger = logger;
        this.notification = notification;
        this.player = player;
        this.gui = gui;
        this.event = event;
    }
    startTracking() {
        if (this.intervalId) {
            alt.clearInterval(this.intervalId);
        }
        this.intervalId = alt.setInterval(() => this.interval(), 500);
    }
    interval() {
        const currInterior = native.getInteriorFromEntity(alt.Player.local.scriptID);
        // this.logger.info("currInterior: " + currInterior);
        if (!this.player.getIsInInterior && currInterior !== 0) {
            this.player.setIsInInterior = true;
            this.event.emitServer("interior:enter", currInterior);
            this.oldInterior = currInterior;
        }
        else {
            if (currInterior != this.oldInterior) {
                this.player.setIsInInterior = false;
                this.event.emitServer("interior:left", currInterior);
                this.oldInterior = 0;
            }
        }
    }
};
__decorate([
    onServer("character:spawn"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InteriorHandler.prototype, "startTracking", null);
InteriorHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [LoggerModule,
        NotificationModule,
        Player,
        GuiModule,
        EventModule])
], InteriorHandler);

let SupermarketHandler = class SupermarketHandler {
    logger;
    notification;
    player;
    gui;
    event;
    constructor(logger, notification, player, gui, event) {
        this.logger = logger;
        this.notification = notification;
        this.player = player;
        this.gui = gui;
        this.event = event;
    }
    onOpenMenu(buyableItems) {
        if (!this.player.getIsInInterior) {
            return;
        }
        this.player.setIsAnyMenuOpen = true;
        this.player.freeze();
        this.player.showCursor();
        this.gui.focusView();
        this.event.emitGui("supermarket:openmenu", buyableItems);
    }
};
__decorate([
    onServer("supermarket:openmenu"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], SupermarketHandler.prototype, "onOpenMenu", null);
SupermarketHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [LoggerModule,
        NotificationModule,
        Player,
        GuiModule,
        EventModule])
], SupermarketHandler);

let AmmunationHandler = class AmmunationHandler {
    logger;
    notification;
    player;
    gui;
    event;
    constructor(logger, notification, player, gui, event) {
        this.logger = logger;
        this.notification = notification;
        this.player = player;
        this.gui = gui;
        this.event = event;
    }
    onOpenMenu(buyableItems) {
        if (!this.player.getIsInInterior) {
            return;
        }
        this.player.setIsAnyMenuOpen = true;
        this.player.freeze();
        this.player.showCursor();
        this.gui.focusView();
        this.event.emitGui("ammunation:openmenu", buyableItems);
    }
};
__decorate([
    onServer("ammunation:openmenu"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], AmmunationHandler.prototype, "onOpenMenu", null);
AmmunationHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [LoggerModule,
        NotificationModule,
        Player,
        GuiModule,
        EventModule])
], AmmunationHandler);

let MenuHandler = class MenuHandler {
    player;
    gui;
    constructor(player, gui) {
        this.player = player;
        this.gui = gui;
    }
    onClose() {
        this.player.setIsAnyMenuOpen = false;
        this.player.unfreeze();
        this.player.hideCursor();
        this.gui.unfocusView();
    }
};
__decorate([
    onGui("menu:close"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MenuHandler.prototype, "onClose", null);
MenuHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [Player,
        GuiModule])
], MenuHandler);

let CountdownModule = class CountdownModule {
    event;
    countdowns = new Map();
    constructor(event) {
        this.event = event;
    }
    create(id, serverEvent, duration) {
        this.countdowns.set(id, alt.setTimeout(() => {
            this.event.emitServer(serverEvent);
        }, duration));
    }
    destroy(id) {
        const timeout = this.countdowns.get(id);
        alt.clearTimeout(timeout);
        this.countdowns.delete(id);
    }
};
CountdownModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [EventModule])
], CountdownModule);

let CountdownHandler = class CountdownHandler {
    countdown;
    constructor(countdown) {
        this.countdown = countdown;
    }
    onCreate(idString, serverEvent, duration) {
        this.countdown.create(idString, serverEvent, duration);
    }
    onDestroy(idString) {
        this.countdown.destroy(idString);
    }
};
__decorate([
    onServer("countdown:create"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", void 0)
], CountdownHandler.prototype, "onCreate", null);
__decorate([
    onServer("countdown:destroy"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CountdownHandler.prototype, "onDestroy", null);
CountdownHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [CountdownModule])
], CountdownHandler);

let AccountHandler = class AccountHandler {
    event;
    account;
    logger;
    constructor(event, account, logger) {
        this.event = event;
        this.account = account;
        this.logger = logger;
    }
    onSync(account) {
        this.account.setup(account);
        this.event.emitGui("account:sync", account);
    }
    onSetPermission(permission) {
        this.account.getAccount.permission = permission;
        this.event.emitGui("account:sync", this.account.getAccount);
    }
};
__decorate([
    onServer("account:sync"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AccountHandler.prototype, "onSync", null);
__decorate([
    onServer("account:setpermissions"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AccountHandler.prototype, "onSetPermission", null);
AccountHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        AccountModule,
        LoggerModule])
], AccountHandler);

let VehicleCatalogHandler = class VehicleCatalogHandler {
    event;
    constructor(event) {
        this.event = event;
    }
    onGetCatalogVeh(catalogVehicle) {
        if (alt.Player.local.vehicle == null) {
            return;
        }
        const vehicleName = native.getDisplayNameFromVehicleModel(alt.Player.local.vehicle.model);
        const classNumber = native.getVehicleClassFromName(alt.Player.local.vehicle.model);
        const localName = native.getLabelText(vehicleName);
        const vehicle = catalogVehicle;
        vehicle.model = vehicle.model == "" ? vehicleName.toLowerCase() : vehicle.model;
        vehicle.displayName = localName;
        vehicle.displayClass = this.getClassName(classNumber);
        this.event.emitServer("vehiclecatalog:saveveh", JSON.stringify(vehicle));
    }
    getClassName(classId) {
        switch (classId) {
            case 0:
                return "Compact";
            case 1:
                return "Sedan";
            case 2:
                return "SUV";
            case 3:
                return "Coupe";
            case 4:
                return "Muscle";
            case 5:
                return "Sport Classic";
            case 6:
                return "Sport";
            case 7:
                return "Super";
            case 8:
                return "Motorrad";
            case 9:
                return "Off-Road";
            case 10:
                return "Industrial";
            case 11:
                return "Utility";
            case 12:
                return "Vans";
            case 13:
                return "Fahrrad";
            case 14:
                return "Boot";
            case 15:
                return "Helikopter";
            case 16:
                return "Flugzeug";
            case 17:
                return "Module";
            case 18:
                return "Einsatzfahrzeug";
            case 19:
                return "Military";
            case 20:
                return "Commercial";
            case 21:
                return "Zug";
        }
    }
};
__decorate([
    onServer("vehiclecatalog:getcatalogveh"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VehicleCatalogHandler.prototype, "onGetCatalogVeh", null);
VehicleCatalogHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [EventModule])
], VehicleCatalogHandler);

let MarkerModule = class MarkerModule {
    math;
    player;
    constructor(math, player) {
        this.math = math;
        this.player = player;
    }
    drawMarkerWithDistance(marker, distance = 5) {
        if (this.math.distance(alt.Player.local.pos, new alt.Vector3(marker.positionX, marker.positionY, marker.positionZ)) <= distance) {
            this.drawMarker(marker);
        }
    }
    drawMarker(marker) {
        native.drawMarker(marker.type, marker.positionX, marker.positionY, marker.positionZ, 0, 0, 0, 0, 0, 0, marker.sizeX, marker.sizeY, marker.sizeZ, marker.red, marker.green, marker.blue, marker.alpha, marker.bobUpAndDown, false, 2, false, undefined, undefined, false);
    }
};
MarkerModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [MathModule,
        Player])
], MarkerModule);

let AdminPrisonHandler = class AdminPrisonHandler {
    event;
    logger;
    camera;
    gui;
    marker;
    blip;
    update;
    math;
    player;
    checkpointPositions = [
        { x: 395.86813, y: 6493.1343, z: 27.049805 },
        { x: 394.6022, y: 6546.58, z: 26.460083 },
        { x: 309.25714, y: 6546.5933, z: 28.111328 },
        { x: 306.30328, y: 6492.949, z: 28.380981 },
        { x: 303.3231, y: 6447.798, z: 31.161133 },
        { x: 392.84836, y: 6458.492, z: 29.189697 }
    ];
    index = 0;
    currentCheckpointPos;
    tickId;
    reachedCheckpoint;
    currentBlip;
    totalCheckpoints;
    constructor(event, logger, camera, gui, marker, blip, update, math, player) {
        this.event = event;
        this.logger = logger;
        this.camera = camera;
        this.gui = gui;
        this.marker = marker;
        this.blip = blip;
        this.update = update;
        this.math = math;
        this.player = player;
    }
    onStart(totalCheckpoints) {
        this.player.isInAPrison = true;
        this.event.emitGui("gui:routeto", "adminprison");
        this.player.fadeIn(500);
        this.player.unblurScreen(500);
        this.player.showRadar();
        this.player.hideHud();
        this.player.hideCursor();
        this.player.unfreeze();
        this.player.lockCamera(false);
        this.player.setVisible(true);
        this.player.blockGameControls(false);
        this.camera.destroyCamera();
        this.gui.unfocusView();
        this.index = 0;
        this.reachedCheckpoint = false;
        this.currentCheckpointPos = this.checkpointPositions[this.index];
        if (this.tickId != undefined) {
            this.update.remove(this.tickId);
        }
        this.tickId = this.update.add(() => this.tick());
        if (this.currentBlip != undefined) {
            this.blip.destroyBlip(this.currentBlip);
        }
        this.currentBlip = this.blip.createBlip(this.checkpointPositions[this.index], 1, 1, "", true);
        this.totalCheckpoints = totalCheckpoints;
    }
    onStop() {
        this.blip.destroyBlip(this.currentBlip);
        this.currentBlip = undefined;
        this.currentCheckpointPos = undefined;
        this.update.remove(this.tickId);
        this.tickId = undefined;
        this.player.isInAPrison = false;
    }
    onSendNextCheckpoint(leftCheckpoints) {
        this.reachedCheckpoint = false;
        this.index++;
        if (this.index >= this.checkpointPositions.length) {
            this.index = 0;
        }
        this.currentCheckpointPos = this.checkpointPositions[this.index];
        this.blip.destroyBlip(this.currentBlip);
        this.currentBlip = this.blip.createBlip(this.checkpointPositions[this.index], 1, 1, "", true);
        this.event.emitGui("adminprison:update", leftCheckpoints);
    }
    OnUiReady() {
        this.event.emitGui("adminprison:start", this.totalCheckpoints);
    }
    tick() {
        if (this.currentCheckpointPos !== undefined && !this.reachedCheckpoint) {
            if (this.math.distance(alt.Player.local.pos, this.currentCheckpointPos) <= 1) {
                this.event.emitServer("adminprison:requestnextcheckpoint");
                this.reachedCheckpoint = true;
            }
            this.marker.drawMarker({
                positionX: this.currentCheckpointPos.x,
                positionY: this.currentCheckpointPos.y,
                positionZ: this.currentCheckpointPos.z,
                sizeX: 1,
                sizeY: 1,
                sizeZ: 1,
                text: "",
                hasText: false,
                red: 192,
                green: 57,
                blue: 43,
                alpha: 100,
                type: 1,
                bobUpAndDown: false
            });
        }
    }
};
__decorate([
    onServer("adminprison:start"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminPrisonHandler.prototype, "onStart", null);
__decorate([
    onServer("adminprison:stop"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminPrisonHandler.prototype, "onStop", null);
__decorate([
    onServer("adminprison:sendnextcheckpoint"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminPrisonHandler.prototype, "onSendNextCheckpoint", null);
__decorate([
    onGui("adminprison:ready"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminPrisonHandler.prototype, "OnUiReady", null);
AdminPrisonHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        LoggerModule,
        CameraModule,
        GuiModule,
        MarkerModule,
        BlipModule,
        UpdateModule,
        MathModule,
        Player])
], AdminPrisonHandler);

let HairSalonHandler = class HairSalonHandler {
    logger;
    player;
    gui;
    event;
    camera;
    character;
    update;
    everyTickRef;
    pedId;
    newAppearances;
    constructor(logger, player, gui, event, camera, character, update) {
        this.logger = logger;
        this.player = player;
        this.gui = gui;
        this.event = event;
        this.camera = camera;
        this.character = character;
        this.update = update;
    }
    async onOpen(character) {
        this.player.setIsAnyMenuOpen = true;
        this.player.freeze();
        this.player.showCursor();
        this.player.lockCamera(true);
        this.player.hideRadarAndHud();
        this.player.setVisible(false);
        this.player.blockGameControls(true);
        this.gui.focusView();
        await this.loadPed(character);
        this.createCamera();
        this.event.emitGui("gui:routeto", "hairsalon");
    }
    onReset() {
        native__default.deletePed(this.pedId);
    }
    onGetCharacter() {
        this.event.emitGui("hairsalon:setcharacter", this.character.getCachedCharacter);
    }
    onUpdateCharacter(appearances) {
        this.newAppearances = appearances;
        this.character.updateAppearance(appearances, this.character.getCachedCharacter.gender, this.pedId);
    }
    onRotateCharacter(dir) {
        this.update.remove(this.everyTickRef);
        this.everyTickRef = this.update.add(() => this.tick(dir));
    }
    onRotateStop() {
        this.update.remove(this.everyTickRef);
    }
    onClose() {
        this.event.emitServer("hairsalon:cancel");
        this.close();
    }
    onBuy() {
        this.event.emitServer("hairsalon:requestbuydialog", JSON.stringify(this.newAppearances));
        this.close();
    }
    close() {
        this.onReset();
        this.player.setIsAnyMenuOpen = false;
        this.player.unfreeze();
        this.player.hideCursor();
        this.player.lockCamera(false);
        this.player.showRadarAndHud();
        this.player.setVisible(true);
        this.player.blockGameControls(false);
        this.gui.unfocusView();
        native__default.deletePed(this.pedId);
        this.camera.destroyCamera();
        this.event.emitGui("gui:routeto", "game");
    }
    createCamera() {
        const pos = new alt__default.Vector3(139.14793, -1708.0115, 29.952124);
        const rot = new alt__default.Vector3(-1, 0, -128.81789);
        this.camera.createCamera(pos, rot, 55);
    }
    async loadPed(character) {
        let modelId = 0;
        if (character.gender === GenderType.MALE) {
            await loadModel(1885233650);
            modelId = 1885233650;
        }
        if (character.gender === GenderType.FEMALE) {
            await loadModel(2627665880);
            modelId = 2627665880;
        }
        this.pedId = native__default.createPed(2, modelId, 139.76703, -1708.5758, 28.313599, 35, false, false);
        this.character.apply(character, this.pedId);
        this.character.setNude(this.pedId, character.gender);
    }
    tick(dir) {
        let heading = native__default.getEntityHeading(this.pedId);
        const newHeading = (heading += dir);
        native__default.setEntityHeading(this.pedId, newHeading);
    }
};
__decorate([
    onServer("hairsalon:open"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HairSalonHandler.prototype, "onOpen", null);
__decorate([
    onServer("hairsalon:reset"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HairSalonHandler.prototype, "onReset", null);
__decorate([
    onGui("hairsalon:getcharacter"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HairSalonHandler.prototype, "onGetCharacter", null);
__decorate([
    onGui("hairsalon:updatechar"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HairSalonHandler.prototype, "onUpdateCharacter", null);
__decorate([
    onGui("hairsalon:rotatecharacter"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HairSalonHandler.prototype, "onRotateCharacter", null);
__decorate([
    onGui("hairsalon:rotatestop"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HairSalonHandler.prototype, "onRotateStop", null);
__decorate([
    onGui("hairsalon:close"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HairSalonHandler.prototype, "onClose", null);
__decorate([
    onGui("hairsalon:buy"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HairSalonHandler.prototype, "onBuy", null);
HairSalonHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [LoggerModule,
        Player,
        GuiModule,
        EventModule,
        CameraModule,
        CharacterModule,
        UpdateModule])
], HairSalonHandler);

let TattooStudioHandler = class TattooStudioHandler {
    logger;
    player;
    gui;
    event;
    camera;
    character;
    update;
    everyTickRef;
    pedId;
    newTattoos;
    constructor(logger, player, gui, event, camera, character, update) {
        this.logger = logger;
        this.player = player;
        this.gui = gui;
        this.event = event;
        this.camera = camera;
        this.character = character;
        this.update = update;
    }
    async onOpen(character) {
        this.player.setIsAnyMenuOpen = true;
        this.player.freeze();
        this.player.showCursor();
        this.player.lockCamera(true);
        this.player.setVisible(false);
        this.player.hideRadarAndHud();
        this.player.blockGameControls(true);
        this.gui.focusView();
        await this.loadPed(character);
        this.createCamera();
        this.character.setNude(this.pedId, this.character.getCachedCharacter.gender);
        this.event.emitGui("gui:routeto", "tattoostudio");
    }
    onReset() {
        native__default.deletePed(this.pedId);
    }
    onGetCharacter() {
        this.event.emitGui("tattoostudio:setcharacter", this.character.getCachedCharacter);
    }
    onUpdateCharacter(tattoos) {
        this.newTattoos = tattoos;
        this.character.updateAppearance(this.character.getCachedCharacter.appearances, this.character.getCachedCharacter.gender, this.pedId);
        this.character.updateTattoos(tattoos, this.pedId);
    }
    onRotateCharacter(dir) {
        this.update.remove(this.everyTickRef);
        this.everyTickRef = this.update.add(() => this.tick(dir));
    }
    onRotateStop() {
        this.update.remove(this.everyTickRef);
    }
    onClose() {
        this.event.emitServer("tattoostudio:cancel");
        this.close();
    }
    onBuy() {
        this.event.emitServer("tattoostudio:requestbuydialog", JSON.stringify(this.newTattoos));
        this.close();
    }
    close() {
        this.onReset();
        this.player.setIsAnyMenuOpen = false;
        this.player.unfreeze();
        this.player.hideCursor();
        this.player.lockCamera(false);
        this.player.setVisible(true);
        this.player.showRadarAndHud();
        this.player.blockGameControls(false);
        this.gui.unfocusView();
        native__default.deletePed(this.pedId);
        this.camera.destroyCamera();
        this.event.emitGui("gui:routeto", "game");
    }
    createCamera() {
        const pos = new alt__default.Vector3(1321.6317, -1652.8184, 52.647587);
        const rot = new alt__default.Vector3(-15.74, 0, -158.44);
        this.camera.createCamera(pos, rot, 60);
    }
    async loadPed(character) {
        let modelId = 0;
        if (character.gender === GenderType.MALE) {
            await loadModel(1885233650);
            modelId = 1885233650;
        }
        if (character.gender === GenderType.FEMALE) {
            await loadModel(2627665880);
            modelId = 2627665880;
        }
        this.pedId = native__default.createPed(2, modelId, 1321.7935, -1654.6022, 51.26306, 0, false, false);
        this.character.apply(character, this.pedId);
        this.character.setNude(this.pedId, character.gender);
    }
    tick(dir) {
        let heading = native__default.getEntityHeading(this.pedId);
        const newHeading = (heading += dir);
        native__default.setEntityHeading(this.pedId, newHeading);
    }
};
__decorate([
    onServer("tattoostudio:open"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TattooStudioHandler.prototype, "onOpen", null);
__decorate([
    onServer("tattoostudio:reset"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TattooStudioHandler.prototype, "onReset", null);
__decorate([
    onGui("tattoostudio:getcharacter"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TattooStudioHandler.prototype, "onGetCharacter", null);
__decorate([
    onGui("tattoostudio:updatechar"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TattooStudioHandler.prototype, "onUpdateCharacter", null);
__decorate([
    onGui("tattoostudio:rotatecharacter"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TattooStudioHandler.prototype, "onRotateCharacter", null);
__decorate([
    onGui("tattoostudio:rotatestop"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TattooStudioHandler.prototype, "onRotateStop", null);
__decorate([
    onGui("tattoostudio:close"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TattooStudioHandler.prototype, "onClose", null);
__decorate([
    onGui("tattoostudio:buy"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TattooStudioHandler.prototype, "onBuy", null);
TattooStudioHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [LoggerModule,
        Player,
        GuiModule,
        EventModule,
        CameraModule,
        CharacterModule,
        UpdateModule])
], TattooStudioHandler);

let ClothingStoreHandler = class ClothingStoreHandler {
    logger;
    player;
    gui;
    event;
    camera;
    character;
    update;
    clothing;
    everyTickRef;
    pedId;
    newClothes;
    constructor(logger, player, gui, event, camera, character, update, clothing) {
        this.logger = logger;
        this.player = player;
        this.gui = gui;
        this.event = event;
        this.camera = camera;
        this.character = character;
        this.update = update;
        this.clothing = clothing;
    }
    async onStartChangeClothes(character) {
        if (!this.player.getIsInInterior) {
            return;
        }
        this.player.setIsAnyMenuOpen = true;
        this.player.freeze();
        this.player.showCursor();
        this.player.lockCamera(true);
        this.player.setVisible(false);
        this.player.blockGameControls(true);
        this.gui.focusView();
        await this.loadPed(character);
        this.createCamera();
        this.event.emitGui("gui:routeto", "clothingstore");
    }
    onReset() {
        native__default.deletePed(this.pedId);
    }
    onGetCharacter() {
        this.event.emitGui("clothingstore:setcharacter", this.clothing.getMaxDrawableVariations(this.pedId), this.character.getCachedCharacter.gender);
    }
    onUpdateCharacter(clothes) {
        this.newClothes = clothes;
        this.event.emitGui("clothesmenu:setmaxtexturevariation", this.clothing.getMaxTextureVariations(this.pedId, clothes));
        this.character.updateClothes(clothes, this.pedId, this.character.getCachedCharacter.gender);
    }
    onRotateCharacter(dir) {
        this.update.remove(this.everyTickRef);
        this.everyTickRef = this.update.add(() => this.tick(dir));
    }
    onRotateStop() {
        this.update.remove(this.everyTickRef);
    }
    onClose() {
        this.event.emitServer("clothingstore:cancel");
        this.close();
    }
    onRequestBuy() {
        this.event.emitServer("clothingstore:requestitems", JSON.stringify(this.newClothes));
        this.close();
    }
    close() {
        this.onReset();
        this.player.setIsAnyMenuOpen = false;
        this.player.unfreeze();
        this.player.hideCursor();
        this.player.lockCamera(false);
        this.player.setVisible(true);
        this.player.blockGameControls(false);
        this.gui.unfocusView();
        native__default.deletePed(this.pedId);
        this.camera.destroyCamera();
        this.event.emitGui("gui:routeto", "game");
    }
    createCamera() {
        const pos = new alt__default.Vector3(71.12921, -1388.6207, 29.395094);
        const rot = new alt__default.Vector3(-2.91335, 0, 0);
        this.camera.createCamera(pos, rot);
    }
    async loadPed(character) {
        let modelId = 0;
        if (character.gender === GenderType.MALE) {
            await loadModel(1885233650);
            modelId = 1885233650;
        }
        if (character.gender === GenderType.FEMALE) {
            await loadModel(2627665880);
            modelId = 2627665880;
        }
        this.pedId = native__default.createPed(2, modelId, 71.1033, -1387.0286, 28.364136, 178.58267, false, false);
        this.character.apply(character, this.pedId);
        this.character.setNude(this.pedId, character.gender);
    }
    tick(dir) {
        let heading = native__default.getEntityHeading(this.pedId);
        const newHeading = (heading += dir);
        native__default.setEntityHeading(this.pedId, newHeading);
    }
};
__decorate([
    onServer("clothingstore:startchangeclothes"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClothingStoreHandler.prototype, "onStartChangeClothes", null);
__decorate([
    onServer("clothingstore:reset"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClothingStoreHandler.prototype, "onReset", null);
__decorate([
    onGui("clothingstore:getcharacter"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClothingStoreHandler.prototype, "onGetCharacter", null);
__decorate([
    onGui("clothingstore:updatechar"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClothingStoreHandler.prototype, "onUpdateCharacter", null);
__decorate([
    onGui("clothingstore:rotatecharacter"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ClothingStoreHandler.prototype, "onRotateCharacter", null);
__decorate([
    onGui("clothingstore:rotatestop"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClothingStoreHandler.prototype, "onRotateStop", null);
__decorate([
    onGui("clothingstore:close"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClothingStoreHandler.prototype, "onClose", null);
__decorate([
    onGui("clothingstore:requestbuy"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClothingStoreHandler.prototype, "onRequestBuy", null);
ClothingStoreHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [LoggerModule,
        Player,
        GuiModule,
        EventModule,
        CameraModule,
        CharacterModule,
        UpdateModule,
        ClothingModule])
], ClothingStoreHandler);

let DrivingSchoolHandler = class DrivingSchoolHandler {
    event;
    logger;
    camera;
    gui;
    marker;
    waypoint;
    update;
    math;
    vehicle;
    checkpointPositions = [
        { x: 262.02197, y: -1859.6176, z: 25.864 },
        { x: 413.2879, y: -1717.2395, z: 28.274 },
        { x: 445.37143, y: -1605.2307, z: 28.24 },
        { x: 385.91208, y: -1553.6044, z: 28.206 },
        { x: 348.72528, y: -1529.9473, z: 28.324 },
        { x: 142.86594, y: -1380, z: 28.308 },
        { x: -204.87033, y: -1418.6373, z: 30.33 },
        { x: -150.48792, y: -1518.2373, z: 33.093 },
        { x: -51.929672, y: -1601.4725, z: 28.274 },
        { x: -96.87033, y: -1685.1296, z: 28.324 },
        { x: -97.094505, y: -1773.4813, z: 28.358 },
        { x: -55.806595, y: -1809.4945, z: 26.016 },
        { x: -7.1340637, y: -1790.0967, z: 27.179 },
        { x: -50.228573, y: -1733.5253, z: 28.274 },
        { x: 30.276924, y: -1692.4352, z: 28.206 },
        { x: 90.14506, y: -1720.8, z: 27.92 },
    ];
    MAX_SPEED = 80;
    index = 0;
    currentCheckpointPos;
    startPos;
    tickId;
    reachedCheckpoint;
    speedingReported;
    speedingReports = 0;
    lastCheckpoint;
    constructor(event, logger, camera, gui, marker, waypoint, update, math, vehicle) {
        this.event = event;
        this.logger = logger;
        this.camera = camera;
        this.gui = gui;
        this.marker = marker;
        this.waypoint = waypoint;
        this.update = update;
        this.math = math;
        this.vehicle = vehicle;
    }
    onStart(startX, startY, startZ) {
        this.onRestart(startX, startY, startZ, 0);
    }
    onStop() {
        this.waypoint.destroy();
        this.currentCheckpointPos = undefined;
        this.update.remove(this.tickId);
        this.speedingReports = 0;
    }
    onRestart(startX, startY, startZ, index) {
        this.startPos = { x: startX, y: startY, z: startZ };
        this.index = index;
        this.reachedCheckpoint = false;
        this.lastCheckpoint = false;
        this.speedingReported = false;
        if (this.index >= this.checkpointPositions.length) {
            this.currentCheckpointPos = this.startPos;
            this.lastCheckpoint = true;
        }
        else {
            this.currentCheckpointPos = this.checkpointPositions[this.index];
        }
        this.tickId = this.update.add(() => this.tick());
        this.waypoint.set(this.checkpointPositions[this.index].x, this.checkpointPositions[this.index].y, this.checkpointPositions[this.index].z, 1, 1);
    }
    onSendNextCheckpoint() {
        this.reachedCheckpoint = false;
        this.index++;
        if (this.index >= this.checkpointPositions.length) {
            this.currentCheckpointPos = this.startPos;
            this.lastCheckpoint = true;
        }
        else {
            this.currentCheckpointPos = this.checkpointPositions[this.index];
        }
        this.waypoint.set(this.currentCheckpointPos.x, this.currentCheckpointPos.y, this.currentCheckpointPos.z, 1, 1);
    }
    onResetLastCheckpoint() {
        this.reachedCheckpoint = false;
    }
    onResetReportSpeeding() {
        if (!this.speedingReported) {
            return;
        }
        alt.setTimeout(() => {
            this.speedingReported = false;
        }, 3000);
    }
    tick() {
        if (alt.Player.local.vehicle) {
            if (this.vehicle.getCurrentSpeed(alt.Player.local.vehicle) > this.MAX_SPEED && !this.speedingReported) {
                this.speedingReports++;
                this.event.emitServer("drivingschool:reportspeeding", this.speedingReports);
                this.speedingReported = true;
            }
            if (this.currentCheckpointPos !== undefined && !this.reachedCheckpoint) {
                if (this.math.distance(alt.Player.local.pos, this.currentCheckpointPos) <= 4) {
                    this.event.emitServer("drivingschool:requestnextcheckpoint", this.index, this.lastCheckpoint);
                    this.reachedCheckpoint = true;
                }
                // ped sync for driving school ped
                if (this.math.distance(alt.Player.local.pos, this.currentCheckpointPos) > 500) {
                    this.event.emitServer("drivingschool:forcestop");
                }
                this.marker.drawMarker({
                    positionX: this.currentCheckpointPos.x,
                    positionY: this.currentCheckpointPos.y,
                    positionZ: this.currentCheckpointPos.z,
                    sizeX: 3,
                    sizeY: 3,
                    sizeZ: 1,
                    text: "",
                    hasText: false,
                    red: 192,
                    green: 57,
                    blue: 43,
                    alpha: 100,
                    type: 1,
                    bobUpAndDown: false
                });
            }
        }
    }
};
__decorate([
    onServer("drivingschool:start"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", void 0)
], DrivingSchoolHandler.prototype, "onStart", null);
__decorate([
    onServer("drivingschool:stop"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DrivingSchoolHandler.prototype, "onStop", null);
__decorate([
    onServer("drivingschool:restart"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Number]),
    __metadata("design:returntype", void 0)
], DrivingSchoolHandler.prototype, "onRestart", null);
__decorate([
    onServer("drivingschool:sendnextcheckpoint"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DrivingSchoolHandler.prototype, "onSendNextCheckpoint", null);
__decorate([
    onServer("drivingschool:resetlastcheckpoint"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DrivingSchoolHandler.prototype, "onResetLastCheckpoint", null);
__decorate([
    onServer("drivingschool:resetreportspeeding"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DrivingSchoolHandler.prototype, "onResetReportSpeeding", null);
DrivingSchoolHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        LoggerModule,
        CameraModule,
        GuiModule,
        MarkerModule,
        WaypointModule,
        UpdateModule,
        MathModule,
        VehicleModule])
], DrivingSchoolHandler);

let WeatherHandler = class WeatherHandler {
    weather;
    interval;
    constructor(weather) {
        this.weather = weather;
    }
    onUpdateWeather(secondsForTransition) {
        const currentWeather = alt__default.getSyncedMeta("Weather");
        if (this.weather.oldWeather === currentWeather) {
            return;
        }
        const weatherString = this.weather.weatherNameMap.get(currentWeather);
        const oldWeatherHash = native__default.getHashKey(this.weather.weatherNameMap.get(this.weather.oldWeather));
        const currentWeatherHash = native__default.getHashKey(weatherString);
        if (this.interval !== undefined) {
            alt__default.clearInterval(this.interval);
        }
        let percentage = 0;
        this.interval = alt__default.setInterval(() => {
            percentage++;
            if (percentage < 100) {
                native__default.setWeatherTypeTransition(oldWeatherHash, currentWeatherHash, (percentage / 100));
            }
            else {
                alt__default.clearInterval(this.interval);
                this.weather.oldWeather = currentWeather;
            }
        }, (secondsForTransition * 10));
        if (weatherString === "XMAS") {
            native__default.setForceVehicleTrails(true);
            native__default.setForcePedFootstepsTracks(true);
        }
        else {
            native__default.setForceVehicleTrails(false);
            native__default.setForcePedFootstepsTracks(false);
        }
    }
};
__decorate([
    onServer("weather:updateweather"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], WeatherHandler.prototype, "onUpdateWeather", null);
WeatherHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [WeatherModule])
], WeatherHandler);

let WeaponModule = class WeaponModule {
    event;
    logger;
    constructor(event, logger) {
        this.event = event;
        this.logger = logger;
    }
    static getWeaponOfAmmoType(name) {
        switch (name) {
            case "AMMO_PISTOL":
                return 0x1B06D571; // pistol
            case "AMMO_MACHINE_GUN":
                return 0x2BE6766B; // smg
            case "AMMO_ASSAULT":
                return 0xBFEFFF6D; // assault rifle
            case "AMMO_SNIPER":
                return 0x05FC3C11; // sniper
            case "AMMO_SHOTGUN":
                return 0x1D073A89; // shotgun
            case "AMMO_LIGHT_MACHINE_GUN":
                return 0x7FD62962; // combatmg
            default: {
                alt.logError("Kein Waffentyp mit den Namen " + name + " gefunden.");
                break;
            }
        }
    }
};
WeaponModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        LoggerModule])
], WeaponModule);

let WeaponHandler = class WeaponHandler {
    gui;
    event;
    player;
    update;
    logger;
    wasShooting = false;
    constructor(gui, event, player, update, logger) {
        this.gui = gui;
        this.event = event;
        this.player = player;
        this.update = update;
        this.logger = logger;
        this.update.add(() => this.tick());
    }
    onGiveAmmo(name, ammo) {
        native__default.addAmmoToPed(alt__default.Player.local.scriptID, WeaponModule.getWeaponOfAmmoType(name), ammo);
    }
    onRemoveAmmo(name, ammo) {
        native__default.addAmmoToPed(alt__default.Player.local.scriptID, WeaponModule.getWeaponOfAmmoType(name), -ammo);
    }
    tick() {
        if (native__default.isPedShooting(alt__default.Player.local)) {
            this.wasShooting = true;
        }
        else {
            if (this.wasShooting) {
                this.wasShooting = false;
                this.updateAmmoMeta();
            }
        }
    }
    updateAmmoMeta() {
        let pistolAmmo = native__default.getAmmoInPedWeapon(alt__default.Player.local, WeaponModule.getWeaponOfAmmoType("AMMO_PISTOL"));
        let machineGunAmmo = native__default.getAmmoInPedWeapon(alt__default.Player.local, WeaponModule.getWeaponOfAmmoType("AMMO_MACHINE_GUN"));
        let assaultAmmo = native__default.getAmmoInPedWeapon(alt__default.Player.local, WeaponModule.getWeaponOfAmmoType("AMMO_ASSAULT"));
        let sniperAmmo = native__default.getAmmoInPedWeapon(alt__default.Player.local, WeaponModule.getWeaponOfAmmoType("AMMO_SNIPER"));
        let shotgunAmmo = native__default.getAmmoInPedWeapon(alt__default.Player.local, WeaponModule.getWeaponOfAmmoType("AMMO_SHOTGUN"));
        let lightMachineGunAmmo = native__default.getAmmoInPedWeapon(alt__default.Player.local, WeaponModule.getWeaponOfAmmoType("AMMO_LIGHT_MACHINE_GUN"));
        // thorwables 
        let baseballAmmo = native__default.getAmmoInPedWeapon(alt__default.Player.local, 0x23C9F95C);
        let bzgasAmmo = native__default.getAmmoInPedWeapon(alt__default.Player.local, 0xA0973D5E);
        let flareAmmo = native__default.getAmmoInPedWeapon(alt__default.Player.local, 0x497FACC3);
        let grenadeAmmo = native__default.getAmmoInPedWeapon(alt__default.Player.local, 0x93E220BD);
        let molotovAmmo = native__default.getAmmoInPedWeapon(alt__default.Player.local, 0x24B17070);
        let snowballAmmo = native__default.getAmmoInPedWeapon(alt__default.Player.local, 0x787F0BB);
        this.event.emitServer("weapon:sendammo", JSON.stringify({
            PistolAmmo: pistolAmmo,
            MachineGunAmmo: machineGunAmmo,
            AssaultAmmo: assaultAmmo,
            SniperAmmo: sniperAmmo,
            ShotgunAmmo: shotgunAmmo,
            LightMachineGunAmmo: lightMachineGunAmmo,
            BaseballAmmo: baseballAmmo,
            BzgasAmmo: bzgasAmmo,
            FlareAmmo: flareAmmo,
            GrenadeAmmo: grenadeAmmo,
            MolotovAmmo: molotovAmmo,
            SnowballAmmo: snowballAmmo,
        }));
    }
};
__decorate([
    onServer("weapon:giveammo"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], WeaponHandler.prototype, "onGiveAmmo", null);
__decorate([
    onServer("weapon:removeammo"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], WeaponHandler.prototype, "onRemoveAmmo", null);
WeaponHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [GuiModule,
        EventModule,
        Player,
        UpdateModule,
        LoggerModule])
], WeaponHandler);

let GasStationHandler = class GasStationHandler {
    logger;
    notification;
    player;
    gui;
    event;
    math;
    distanceCheckInt = 0;
    constructor(logger, notification, player, gui, event, math) {
        this.logger = logger;
        this.notification = notification;
        this.player = player;
        this.gui = gui;
        this.event = event;
        this.math = math;
    }
    onOpenRefuelMenu(maxPossibleFuel, fuelPrice) {
        this.player.setIsAnyMenuOpen = true;
        this.player.freeze();
        this.player.showCursor();
        this.gui.focusView();
        this.event.emitGui("gasstation:openrefuelmenu", maxPossibleFuel, fuelPrice);
    }
    onStartDistanceCheck() {
        const cachedPlayerPos = alt__default.Player.local.pos;
        this.distanceCheckInt = alt__default.setInterval(() => {
            if (this.math.distance(alt__default.Player.local.pos, cachedPlayerPos) > 30) {
                // If player is to far away from gas station.
                this.event.emitServer("gasstation:playerleftarea");
                alt__default.clearInterval(this.distanceCheckInt);
            }
        }, 1000);
    }
    onStopDistanceCheck() {
        alt__default.clearInterval(this.distanceCheckInt);
    }
    onCloseMenu() {
        this.player.setIsAnyMenuOpen = false;
        this.player.unfreeze();
        this.player.hideCursor();
        this.gui.unfocusView();
    }
};
__decorate([
    onServer("gasstation:openrefuelmenu"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], GasStationHandler.prototype, "onOpenRefuelMenu", null);
__decorate([
    onServer("gasstation:startdistancecheck"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GasStationHandler.prototype, "onStartDistanceCheck", null);
__decorate([
    onServer("gasstation:stopdistancecheck"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GasStationHandler.prototype, "onStopDistanceCheck", null);
__decorate([
    onGui("gasstation:close"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GasStationHandler.prototype, "onCloseMenu", null);
GasStationHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [LoggerModule,
        NotificationModule,
        Player,
        GuiModule,
        EventModule,
        MathModule])
], GasStationHandler);

let ClothingHandler = class ClothingHandler {
    event;
    clothing;
    character;
    player;
    gui;
    oldDrawableId = 0;
    oldTextureId = 0;
    constructor(event, clothing, character, player, gui) {
        this.event = event;
        this.clothing = clothing;
        this.character = character;
        this.player = player;
        this.gui = gui;
    }
    onSetTorsoMenuShow() {
        this.player.blockGameControls(true);
        this.player.showCursor();
        this.gui.focusView();
        this.oldDrawableId = this.character.getCachedCharacter.torso;
        this.oldTextureId = this.character.getCachedCharacter.torsoTexture;
        this.event.emitGui("settorsomenu:show", native__default.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 3), this.character.getCachedCharacter.gender);
    }
    onUpdateTorso(drawableId, textureId) {
        this.character.updateTorso(alt.Player.local.scriptID, drawableId, textureId);
        this.event.emitGui("settorsomenu:setmaxtextures", native__default.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 3, drawableId) - 1);
    }
    onSaveTorso(drawableId, textureId) {
        this.player.blockGameControls(false);
        this.player.hideCursor();
        this.gui.unfocusView();
        this.character.updateTorso(alt.Player.local.scriptID, drawableId, textureId);
        this.event.emitServer("settorsomenu:savetorso", drawableId, textureId);
    }
    onClose() {
        this.player.blockGameControls(false);
        this.player.hideCursor();
        this.gui.unfocusView();
        this.character.updateTorso(alt.Player.local.scriptID, this.oldDrawableId, this.oldTextureId);
    }
};
__decorate([
    onServer("settorsomenu:show"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClothingHandler.prototype, "onSetTorsoMenuShow", null);
__decorate([
    onGui("settorsomenu:updatetorso"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], ClothingHandler.prototype, "onUpdateTorso", null);
__decorate([
    onGui("settorsomenu:savetorso"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], ClothingHandler.prototype, "onSaveTorso", null);
__decorate([
    onGui("settorsomenu:close"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClothingHandler.prototype, "onClose", null);
ClothingHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        ClothingModule,
        CharacterModule,
        Player,
        GuiModule])
], ClothingHandler);

let AnimationsHandler = class AnimationsHandler {
    event;
    animation;
    constructor(event, animation) {
        this.event = event;
        this.animation = animation;
    }
    async onPlay(dictionary, clip, options = {}) {
        const loaded = await this.animation.load(dictionary);
        if (loaded) {
            this.animation.play(dictionary, clip, options);
        }
    }
    onClear() {
        this.animation.clear();
    }
};
__decorate([
    onServer("animation:play"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, AnimationOptions]),
    __metadata("design:returntype", Promise)
], AnimationsHandler.prototype, "onPlay", null);
__decorate([
    onServer("animation:clear"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AnimationsHandler.prototype, "onClear", null);
AnimationsHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        AnimationModule])
], AnimationsHandler);

let PlayersListHandler = class PlayersListHandler {
    event;
    player;
    gui;
    logger;
    isMenuOpen = false;
    constructor(event, player, gui, logger) {
        this.event = event;
        this.player = player;
        this.gui = gui;
        this.logger = logger;
    }
    onKeydown(key) {
        if (!this.player.isSpawnedCharacter) {
            return;
        }
        if (key === KeyCodes.O) {
            if (this.isMenuOpen) {
                this.setMenuState(false);
            }
            else {
                if (this.player.getIsAnyTextOpen) {
                    return;
                }
                this.event.emitServer("playerslist:requestmenu");
            }
        }
    }
    onShowMenu(players) {
        this.setMenuState(true, players);
    }
    setMenuState(state, players = []) {
        if (this.player.getIsAnyMenuOpen && !this.isMenuOpen) {
            return;
        }
        this.isMenuOpen = state;
        this.player.setIsAnyMenuOpen = this.isMenuOpen;
        this.player.blockGameControls(this.isMenuOpen);
        if (this.isMenuOpen) {
            this.player.showCursor();
            this.gui.focusView();
        }
        else {
            this.player.hideCursor();
            this.gui.unfocusView();
        }
        this.event.emitGui("playerslist:toggle", this.isMenuOpen, players);
    }
};
__decorate([
    on("keydown"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PlayersListHandler.prototype, "onKeydown", null);
__decorate([
    onServer("playerslist:show"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], PlayersListHandler.prototype, "onShowMenu", null);
PlayersListHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        Player,
        GuiModule,
        LoggerModule])
], PlayersListHandler);

var EntityType;
(function (EntityType) {
    EntityType[EntityType["Object"] = 0] = "Object";
    EntityType[EntityType["Marker"] = 1] = "Marker";
    EntityType[EntityType["Ped"] = 2] = "Ped";
    EntityType[EntityType["Blip"] = 3] = "Blip";
    EntityType[EntityType["Door"] = 4] = "Door";
})(EntityType || (EntityType = {}));

let ObjectSyncHandler = class ObjectSyncHandler {
    objectSync;
    constructor(objectSync) {
        this.objectSync = objectSync;
        alt.onServer("entitySync:create", (id, entityType, position, currEntityData) => {
            if (currEntityData) {
                const data = currEntityData;
                if (data != undefined) {
                    if (entityType === EntityType.Object) {
                        objectSync.add(id, data.model, data.name, position, data.rotation, data.freeze, data.onFire, data.itemId, data.ownerName, data.createdAtJson);
                    }
                }
            }
            else {
                if (entityType === EntityType.Object) {
                    objectSync.restore(id);
                }
            }
        });
        alt.onServer("entitySync:remove", (id, entityType) => {
            if (entityType === EntityType.Object) {
                objectSync.remove(id);
            }
        });
        alt.onServer("entitySync:clearCache", (id, entityType) => {
            if (entityType === EntityType.Object) {
                objectSync.clear(id);
            }
        });
    }
};
ObjectSyncHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [ObjectSyncModule])
], ObjectSyncHandler);

let MarkerSyncModule = class MarkerSyncModule {
    update;
    player;
    text;
    date;
    logger;
    markers = [];
    constructor(update, player, text, date, logger) {
        this.update = update;
        this.player = player;
        this.text = text;
        this.date = date;
        this.logger = logger;
        this.update.add(() => {
            for (const key in this.markers) {
                const marker = this.markers[key];
                if (marker.onDisplay) {
                    native.drawMarker(marker.markerType, marker.position.x, marker.position.y, marker.position.z, marker.direction.x, marker.direction.y, marker.direction.z, marker.rotation.x, marker.rotation.y, marker.rotation.z, marker.scale.x, marker.scale.y, marker.scale.z, marker.color.red, marker.color.green, marker.color.blue, marker.color.alpha, marker.bobUpDown, false, 2, false, undefined, undefined, false);
                    if (marker.text.length !== 0) {
                        this.text.drawText3dWithDistance(marker.text, marker.position.x, marker.position.y, marker.position.z + 1, 0.4, 0, 255, 255, 255, 175, false, true, 10);
                    }
                    if (this.player.isAduty && marker.ownerName && marker.createdAtJson) {
                        this.text.drawText3dWithDistance(`Erstellt von: ${marker.ownerName}\nErstellt um: ${this.date.getDate(marker.createdAtJson)}`, marker.position.x, marker.position.y, marker.position.z + 0.5, 0.4, 0, marker.color.red, marker.color.green, marker.color.blue, 255, false, true, 5);
                    }
                }
            }
        });
    }
    add(id, markerType, position, direction, rotation, scale, color, bobUpDown, text, ownerName, createdAtJson) {
        this.remove(id);
        this.clear(id);
        this.markers[id] = {
            id: id,
            markerType: markerType,
            position: position,
            direction: direction,
            rotation: rotation,
            scale: scale,
            color: color,
            onDisplay: true,
            bobUpDown: bobUpDown,
            text: text,
            ownerName: ownerName,
            createdAtJson: createdAtJson
        };
    }
    restore(id) {
        if (this.markers.hasOwnProperty(id)) {
            this.markers[id].onDisplay = true;
        }
    }
    remove(id) {
        if (this.markers.hasOwnProperty(id)) {
            this.markers[id].onDisplay = false;
        }
    }
    clear(id) {
        if (this.markers.hasOwnProperty(id)) {
            delete this.markers[id];
        }
    }
    setBobUpDown(id, bobUpDown = false) {
        if (this.markers.hasOwnProperty(id)) {
            this.markers[id].bobUpDown = bobUpDown;
        }
    }
    setColor(id, color) {
        if (this.markers.hasOwnProperty(id)) {
            this.markers[id].color = color;
        }
    }
    setScale(id, scale) {
        if (this.markers.hasOwnProperty(id)) {
            this.markers[id].scale = scale;
        }
    }
    setDirection(id, direction) {
        if (this.markers.hasOwnProperty(id)) {
            this.markers[id].direction = direction;
        }
    }
    setRotation(id, rotation) {
        if (this.markers.hasOwnProperty(id)) {
            this.markers[id].rotation = rotation;
        }
    }
    setPosition(id, position) {
        if (this.markers.hasOwnProperty(id)) {
            this.markers[id].position = position;
        }
    }
};
MarkerSyncModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [UpdateModule,
        Player,
        TextModule,
        DateModule,
        LoggerModule])
], MarkerSyncModule);

let MarkerSyncHandler = class MarkerSyncHandler {
    markerSync;
    constructor(markerSync) {
        this.markerSync = markerSync;
        alt.onServer("entitySync:create", (id, entityType, position, currEntityData) => {
            if (currEntityData) {
                const data = currEntityData;
                if (data != undefined) {
                    if (entityType === EntityType.Marker) {
                        markerSync.add(id, data.markerType, position, data.direction, data.rotation, data.scale, data.color, data.bobUpDown, data.text, data.ownerName, data.createdAtJson);
                    }
                }
            }
            else {
                if (entityType === EntityType.Marker) {
                    markerSync.restore(id);
                }
            }
        });
        alt.onServer("entitySync:remove", (id, entityType) => {
            if (entityType === EntityType.Marker) {
                markerSync.remove(id);
            }
        });
        alt.onServer("entitySync:updatePosition", (id, entityType, position) => {
            if (entityType == 0) {
                markerSync.setPosition(id, position);
            }
        });
        alt.onServer("entitySync:clearCache", (id, entityType) => {
            if (entityType === EntityType.Marker) {
                markerSync.clear(id);
            }
        });
    }
};
MarkerSyncHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [MarkerSyncModule])
], MarkerSyncHandler);

var PedSyncModule_1;
let PedSyncModule = PedSyncModule_1 = class PedSyncModule {
    logger;
    peds = [];
    constructor(logger) {
        this.logger = logger;
    }
    add(id, model, position, heading, vehicle, seat) {
        const hash = alt.hash(model);
        loadModel(hash).then(() => {
            if (vehicle !== null) {
                alt.setTimeout(() => {
                    const entity = native.createPedInsideVehicle(vehicle.scriptID, 0, hash, seat, false, false);
                    PedSyncModule_1.makePedStupid(entity);
                    this.peds[id] = {
                        id: id,
                        model: model,
                        entity: entity,
                        position: position,
                        heading: heading,
                        vehicle: vehicle,
                        seat: seat,
                    };
                }, 100);
            }
            else {
                const entity = native.createPed(0, hash, position.x, position.y, position.z, heading, false, false);
                PedSyncModule_1.makePedStupid(entity);
                this.peds[id] = {
                    id: id,
                    model: model,
                    entity: entity,
                    position: position,
                    heading: heading,
                    vehicle: vehicle,
                    seat: seat,
                };
            }
        });
    }
    restore(id) {
        if (this.peds.hasOwnProperty(id)) {
            const ped = this.peds[id];
            const hash = alt.hash(ped.model);
            loadModel(hash).then(() => {
                if (ped.vehicle !== null) {
                    alt.setTimeout(() => {
                        this.peds[id].entity = native.createPedInsideVehicle(ped.vehicle.scriptID, 0, hash, ped.seat, false, false);
                        PedSyncModule_1.makePedStupid(this.peds[id].entity);
                    }, 100);
                }
                else {
                    this.peds[id].entity = native.createPed(0, hash, ped.position.x, ped.position.y, ped.position.z, ped.heading, false, false);
                    PedSyncModule_1.makePedStupid(this.peds[id].entity);
                }
            });
        }
    }
    remove(id) {
        if (this.peds.hasOwnProperty(id)) {
            native.deletePed(this.peds[id].entity);
            this.peds[id].entity = null;
        }
    }
    clear(id) {
        if (this.peds.hasOwnProperty(id)) {
            delete this.peds[id];
        }
    }
    setHeading(id, heading) {
        if (this.peds.hasOwnProperty(id)) {
            this.peds[id].heading = heading;
            native.setEntityHeading(this.peds[id].entity, heading);
        }
    }
    setPosition(id, position) {
        if (this.peds.hasOwnProperty(id)) {
            this.peds[id].position = position;
            native.setEntityCoords(this.peds[id].entity, position.x, position.y, position.z, false, false, false, false);
        }
    }
    static makePedStupid(entity) {
        native.setEntityAsMissionEntity(entity, true, false); // make sure its not despawned by game engine
        native.setBlockingOfNonTemporaryEvents(entity, true); // make sure ped doesnt flee etc only do what its told
        native.setPedCanBeTargetted(entity, false);
        native.setPedCanBeKnockedOffVehicle(entity, 1);
        native.setPedCanBeDraggedOut(entity, false);
        native.setPedSuffersCriticalHits(entity, false);
        native.setPedDropsWeaponsWhenDead(entity, false);
        native.setPedDiesInstantlyInWater(entity, false);
        native.setPedCanRagdoll(entity, false);
        native.setPedDiesWhenInjured(entity, false);
        native.taskSetBlockingOfNonTemporaryEvents(entity, true);
        native.setPedFleeAttributes(entity, 0, false);
        native.setPedConfigFlag(entity, 32, false); // ped cannot fly thru windscreen
        native.setPedConfigFlag(entity, 281, true); // ped no writhe
        native.setPedGetOutUpsideDownVehicle(entity, false);
        native.setPedCanEvasiveDive(entity, false);
        native.freezeEntityPosition(entity, true);
        native.setEntityInvincible(entity, true);
    }
};
PedSyncModule = PedSyncModule_1 = __decorate([
    singleton(),
    __metadata("design:paramtypes", [LoggerModule])
], PedSyncModule);

let PedSyncHandler = class PedSyncHandler {
    pedSync;
    constructor(pedSync) {
        this.pedSync = pedSync;
        alt.onServer("entitySync:create", (id, entityType, position, currEntityData) => {
            if (currEntityData) {
                const data = currEntityData;
                if (data != undefined) {
                    if (entityType === EntityType.Ped) {
                        pedSync.add(id, data.model, position, data.heading, data.vehicle, data.seat);
                    }
                }
            }
            else {
                if (entityType === EntityType.Ped) {
                    pedSync.restore(id);
                }
            }
        });
        alt.onServer("entitySync:remove", (id, entityType) => {
            if (entityType === EntityType.Ped) {
                pedSync.remove(id);
            }
        });
        alt.onServer("entitySync:updatePosition", (id, entityType, position) => {
            if (entityType === EntityType.Ped) {
                pedSync.setPosition(id, position);
            }
        });
        alt.onServer("entitySync:clearCache", (id, entityType) => {
            if (entityType === EntityType.Ped) {
                pedSync.clear(id);
            }
        });
        alt.onServer("entitySync:updateData", (id, entityType, newEntityData) => {
            if (entityType === EntityType.Ped) {
                if (newEntityData.hasOwnProperty("heading")) {
                    pedSync.setHeading(id, newEntityData.heading);
                }
            }
        });
    }
};
PedSyncHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [PedSyncModule])
], PedSyncHandler);

let AnimationWheelHandler = class AnimationWheelHandler {
    event;
    animation;
    player;
    gui;
    freecam;
    isMenuOpen = false;
    playerAnimations = [];
    constructor(event, animation, player, gui, freecam) {
        this.event = event;
        this.animation = animation;
        this.player = player;
        this.gui = gui;
        this.freecam = freecam;
    }
    onKeydown(key) {
        if (key === KeyCodes.U) {
            if (this.isMenuOpen) {
                this.setMenuState(false);
            }
            else {
                if (this.player.getIsAnyMenuOpen
                    || this.player.isInAPrison
                    || !this.player.isSpawnedCharacter
                    || this.freecam.isActive
                    || this.player.getIsChatting
                    || this.player.getIsAnyTextOpen
                    || this.player.hasInteractionOpen) {
                    return;
                }
                this.event.emitServer("animationswheel:requestmenu");
            }
        }
    }
    onShowAnimationWheel(animations) {
        this.playerAnimations = animations;
        this.setMenuState(true);
    }
    async onRequestAnim(animationId) {
        const animation = this.playerAnimations.find(pa => pa.id === animationId);
        const loaded = await this.animation.load(animation.dictionary);
        if (loaded) {
            const options = {
                flag: animation.flags
            };
            this.animation.play(animation.dictionary, animation.clip, options);
        }
        this.setMenuState(false);
    }
    onAnimationWheelClear() {
        this.animation.clear();
        this.setMenuState(false);
    }
    setMenuState(state) {
        this.isMenuOpen = state;
        this.player.setIsAnyMenuOpen = this.isMenuOpen;
        this.player.blockGameControls(this.isMenuOpen);
        if (this.isMenuOpen) {
            this.player.showCursor();
            this.gui.focusView();
            this.event.emitGui("animationwheel:setanimations", this.playerAnimations);
        }
        else {
            this.player.hideCursor();
            this.gui.unfocusView();
        }
        this.event.emitGui("animationwheel:toggle", this.isMenuOpen);
    }
};
__decorate([
    on("keydown"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AnimationWheelHandler.prototype, "onKeydown", null);
__decorate([
    onServer("animationwheel:showmenu"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], AnimationWheelHandler.prototype, "onShowAnimationWheel", null);
__decorate([
    onGui("animationwheel:requestanim"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AnimationWheelHandler.prototype, "onRequestAnim", null);
__decorate([
    onGui("animationwheel:stopanim"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AnimationWheelHandler.prototype, "onAnimationWheelClear", null);
AnimationWheelHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        AnimationModule,
        Player,
        GuiModule,
        FreeCamModule])
], AnimationWheelHandler);

var DeathState;
(function (DeathState) {
    DeathState[DeathState["ALIVE"] = 0] = "ALIVE";
    DeathState[DeathState["DEAD"] = 1] = "DEAD";
})(DeathState || (DeathState = {}));

let DeathHandler = class DeathHandler {
    event;
    animation;
    constructor(event, animation) {
        this.event = event;
        this.animation = animation;
    }
    onStreamSyncedMetaChange(entity, key, value, oldValue) {
        if (!entity.hasStreamSyncedMeta("DEATH_STATE")) {
            return;
        }
        const deathState = entity.getStreamSyncedMeta("DEATH_STATE");
        native__default.setEntityInvincible(entity.scriptID, deathState === DeathState.DEAD);
    }
};
__decorate([
    on("streamSyncedMetaChange"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [alt__default.Entity, String, Object, Object]),
    __metadata("design:returntype", void 0)
], DeathHandler.prototype, "onStreamSyncedMetaChange", null);
DeathHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        AnimationModule])
], DeathHandler);

let DoorSyncModule = class DoorSyncModule {
    logger;
    doors = [];
    constructor(logger) {
        this.logger = logger;
    }
    add(id, position, heading, hash, locked) {
        this.clear(id);
        this.doors[id] = {
            hash: hash,
            locked: locked,
            position: position,
            heading: heading,
            id: id,
        };
        this.setLockState(id, locked);
    }
    getDoor(entityId) {
        if (this.doors.hasOwnProperty(entityId)) {
            return this.doors[entityId];
        }
        else {
            return null;
        }
    }
    restore(id) {
        if (this.doors.hasOwnProperty(id)) {
            let door = this.doors[id];
            this.setLockState(id, door.locked);
        }
    }
    remove(id) {
        if (this.doors.hasOwnProperty(id)) {
            delete this.doors[id];
        }
    }
    clear(id) {
        if (this.doors.hasOwnProperty(id)) {
            delete this.doors[id];
        }
    }
    clearAllDoor() {
        this.doors = [];
    }
    setPosition(id, position) {
        if (this.doors.hasOwnProperty(id)) {
            this.doors[id].position = position;
        }
    }
    setLockState(id, locked) {
        if (this.doors.hasOwnProperty(id)) {
            this.doors[id].locked = locked;
            let door = this.doors[id];
            native.setStateOfClosestDoorOfType(door.hash, door.position.x, door.position.y, door.position.z, door.locked, door.heading, false);
            native.doorControl(door.hash, door.position.x, door.position.y, door.position.z, door.locked, 0.0, door.heading, 0.0);
        }
    }
};
DoorSyncModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [LoggerModule])
], DoorSyncModule);

let DoorSyncHandler = class DoorSyncHandler {
    doorSync;
    constructor(doorSync) {
        this.doorSync = doorSync;
        alt.onServer("entitySync:create", (id, entityType, position, currEntityData) => {
            if (currEntityData) {
                const data = currEntityData;
                if (data != undefined) {
                    if (entityType === EntityType.Door) {
                        doorSync.add(id, position, data.heading, data.hash, data.locked);
                    }
                }
            }
            else {
                if (entityType === EntityType.Door) {
                    doorSync.restore(id);
                }
            }
        });
        alt.onServer("entitySync:remove", (id, entityType) => {
            if (entityType === EntityType.Door) {
                doorSync.remove(id);
            }
        });
        alt.onServer("entitySync:clearCache", (id, entityType) => {
            if (entityType === EntityType.Door) {
                doorSync.clear(id);
            }
        });
        alt.onServer("entitySync:updatePosition", (id, entityType, position) => {
            if (entityType === EntityType.Door) {
                doorSync.setPosition(id, position);
            }
        });
        alt.onServer("entitySync:updateData", (id, entityType, newEntityData) => {
            if (entityType === EntityType.Door) {
                if (newEntityData.hasOwnProperty("locked")) {
                    doorSync.setLockState(id, newEntityData.locked);
                }
            }
        });
    }
};
DoorSyncHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [DoorSyncModule])
], DoorSyncHandler);

var BlipType;
(function (BlipType) {
    BlipType[BlipType["POINT"] = 0] = "POINT";
    BlipType[BlipType["RADIUS"] = 1] = "RADIUS";
})(BlipType || (BlipType = {}));

let BlipSyncModule = class BlipSyncModule {
    logger;
    blips = [];
    constructor(logger) {
        this.logger = logger;
    }
    add(id, position, name, sprite, color, scale, shortRange, player, blipType, radius, alpha) {
        if (player?.id !== alt.Player.local.id) {
            return;
        }
        let handle = null;
        switch (blipType) {
            case BlipType.POINT:
                handle = new alt.PointBlip(position.x, position.y, position.z);
                handle.sprite = sprite;
                handle.scale = scale;
                break;
            case BlipType.RADIUS:
                handle = new alt.RadiusBlip(position.x, position.y, position.z, radius);
                break;
        }
        if (handle === null) {
            return;
        }
        handle.alpha = alpha;
        handle.color = color;
        handle.name = name;
        handle.shortRange = shortRange;
        this.blips[id] = { id: id, handle: handle, position: position, sprite: sprite, color: color,
            scale: scale, name: name, shortRange: shortRange, blipType: blipType, player: player, radius: radius };
    }
    get(entityId) {
        if (this.blips.hasOwnProperty(entityId)) {
            return this.blips[entityId];
        }
        else {
            return null;
        }
    }
    restore(id) {
        if (this.blips.hasOwnProperty(id)) {
            const blip = this.blips[id];
            if (blip.player?.id !== alt.Player.local.id) {
                return;
            }
            let handle = null;
            switch (blip.blipType) {
                case BlipType.POINT:
                    handle = new alt.PointBlip(blip.position.x, blip.position.y, blip.position.z);
                    handle.sprite = blip.sprite;
                    handle.scale = blip.scale;
                    break;
                case BlipType.RADIUS:
                    handle = new alt.RadiusBlip(blip.position.x, blip.position.y, blip.position.z, blip.radius);
                    break;
            }
            if (handle === null) {
                return;
            }
            blip.handle.sprite = blip.sprite;
            blip.handle.color = blip.color;
            blip.handle.scale = blip.scale;
            blip.handle.name = blip.name;
            blip.handle.shortRange = blip.shortRange;
        }
    }
    remove(id) {
        if (this.blips.hasOwnProperty(id)) {
            this.blips[id].handle.destroy();
            this.blips[id].handle = null;
            delete this.blips[id];
        }
    }
    clear(id) {
        if (this.blips.hasOwnProperty(id)) {
            this.blips[id].handle.destroy();
            this.blips[id].handle = null;
            delete this.blips[id];
        }
    }
    clearAll() {
        this.blips = [];
    }
    setPosition(id, position) {
        if (this.blips.hasOwnProperty(id)) {
            this.blips[id].handle.pos = position;
            this.blips[id].position = position;
        }
    }
};
BlipSyncModule = __decorate([
    singleton(),
    __metadata("design:paramtypes", [LoggerModule])
], BlipSyncModule);

let BlipSyncHandler = class BlipSyncHandler {
    blipSync;
    constructor(blipSync) {
        this.blipSync = blipSync;
        alt.onServer("entitySync:create", (id, entityType, position, currEntityData) => {
            if (currEntityData) {
                const data = currEntityData;
                if (data != undefined) {
                    if (entityType === EntityType.Blip) {
                        blipSync.add(id, position, data.name, data.sprite, data.color, data.scale, data.shortRange, data.player, data.blipType, data.radius, data.alpha);
                    }
                }
            }
            else {
                if (entityType === EntityType.Blip) {
                    blipSync.restore(id);
                }
            }
        });
        alt.onServer("entitySync:remove", (id, entityType) => {
            if (entityType === EntityType.Blip) {
                blipSync.remove(id);
            }
        });
        alt.onServer("entitySync:clearCache", (id, entityType) => {
            if (entityType === EntityType.Blip) {
                blipSync.clear(id);
            }
        });
        alt.onServer("entitySync:updatePosition", (id, entityType, position) => {
            if (entityType === EntityType.Blip) {
                blipSync.setPosition(id, position);
            }
        });
        alt.onServer("entitySync:updateData", (id, entityType, newEntityData) => {
            if (entityType === EntityType.Blip) ;
        });
    }
};
BlipSyncHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [BlipSyncModule])
], BlipSyncHandler);

var FactionType;
(function (FactionType) {
    FactionType[FactionType["CITIZEN"] = 0] = "CITIZEN";
    FactionType[FactionType["POLICE_DEPARTMENT"] = 1] = "POLICE_DEPARTMENT";
    FactionType[FactionType["FIRE_DEPARTMENT"] = 2] = "FIRE_DEPARTMENT";
})(FactionType || (FactionType = {}));

let MdcHandler = class MdcHandler {
    player;
    gui;
    event;
    logger;
    constructor(player, gui, event, logger) {
        this.player = player;
        this.gui = gui;
        this.event = event;
        this.logger = logger;
    }
    onOpen(factionType, canLogin, characterName, rankName) {
        this.player.setIsAnyMenuOpen = true;
        this.player.setIsAnyTextFieldFocused = true;
        this.player.showCursor();
        this.player.blurScreen(250);
        this.gui.focusView();
        this.event.emitGui("mdc:open", factionType, canLogin, characterName, rankName);
    }
    onClose() {
        this.player.setIsAnyMenuOpen = false;
        this.player.setIsAnyTextFieldFocused = false;
        this.player.hideCursor();
        this.player.unblurScreen(250);
        this.gui.unfocusView();
        this.event.emitGui("mdc:close");
    }
};
__decorate([
    onServer("mdc:open"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean, String, String]),
    __metadata("design:returntype", void 0)
], MdcHandler.prototype, "onOpen", null);
__decorate([
    onGui("mdc:close"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MdcHandler.prototype, "onClose", null);
MdcHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [Player,
        GuiModule,
        EventModule,
        LoggerModule])
], MdcHandler);

let EmergencyCallHandler = class EmergencyCallHandler {
    chat;
    event;
    constructor(chat, event) {
        this.chat = chat;
        this.event = event;
    }
    onStartDialog(content) {
        this.chat.sendMessage({
            chatType: ChatType.PHONE_SPEAK,
            color: "#f3f59f",
            context: content,
            afterName: " sagt: ",
            sender: "Dispatch",
            sendetAt: Date.now().toString()
        });
    }
};
__decorate([
    onServer("emergencycall:sendmessage"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmergencyCallHandler.prototype, "onStartDialog", null);
EmergencyCallHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [ChatModule, EventModule])
], EmergencyCallHandler);

let PoliceMdcHandler = class PoliceMdcHandler {
    event;
    house;
    constructor(event, house) {
        this.event = event;
        this.house = house;
    }
    onOpenCharacterRecord(character, records, nodes, vehicles, houses, bankAccounts, phoneNumbers) {
        houses.forEach((house) => {
            house.streetName = this.house.getStreet(house.streetDirection, new alt__default.Vector3(house.positionX, house.positionY, house.positionZ));
        });
        this.event.emitGui("policemdc:opencharacterrecord", character, records, nodes, vehicles, houses, bankAccounts, phoneNumbers);
    }
};
__decorate([
    onServer("policemdc:opencharacterrecord"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array, Array, Array, Array, Array, Array]),
    __metadata("design:returntype", void 0)
], PoliceMdcHandler.prototype, "onOpenCharacterRecord", null);
PoliceMdcHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        HouseModule])
], PoliceMdcHandler);

let VehicleSirenHandler = class VehicleSirenHandler {
    event;
    constructor(event) {
        this.event = event;
    }
    keydown(key) {
        if (!alt__default.Player.local.vehicle) {
            return;
        }
        if (key === KeyCodes.G) {
            this.event.emitServer("vehiclesiren:toggle");
        }
    }
    onStreamSyncedMetaChange(entity, key, value, oldValue) {
        if (!entity.hasStreamSyncedMeta("SIREN_MUTED")) {
            return;
        }
        const muted = entity.getStreamSyncedMeta("SIREN_MUTED");
        native__default.setVehicleHasMutedSirens(entity.scriptID, muted);
    }
};
__decorate([
    on("keydown"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VehicleSirenHandler.prototype, "keydown", null);
__decorate([
    on("streamSyncedMetaChange"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [alt__default.Entity, String, Object, Object]),
    __metadata("design:returntype", void 0)
], VehicleSirenHandler.prototype, "onStreamSyncedMetaChange", null);
VehicleSirenHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [EventModule])
], VehicleSirenHandler);

let FireMdcHandler = class FireMdcHandler {
    event;
    house;
    constructor(event, house) {
        this.event = event;
        this.house = house;
    }
    onOpenPatientRecord(character, houses, phoneNumbers, medicalHistory, allergies) {
        houses.forEach((house) => {
            house.streetName = this.house.getStreet(house.streetDirection, new alt__default.Vector3(house.positionX, house.positionY, house.positionZ));
        });
        this.event.emitGui("firemdc:openpatientrecord", character, houses, phoneNumbers, medicalHistory, allergies);
    }
};
__decorate([
    onServer("firemdc:openpatientrecord"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array, Array, Array, Array]),
    __metadata("design:returntype", void 0)
], FireMdcHandler.prototype, "onOpenPatientRecord", null);
FireMdcHandler = __decorate([
    foundation(),
    singleton(),
    __metadata("design:paramtypes", [EventModule,
        HouseModule])
], FireMdcHandler);

let ClientStartup = class ClientStartup {
    fireMdcHandler;
    vehicleSirenHandler;
    policeMdcHandler;
    emergencyCallHandler;
    mdcHandler;
    blipSyncHandler;
    doorSyncHandler;
    pedSyncHandler;
    markerSyncHandler;
    objectSyncHandler;
    playersList;
    animationWheelHandler;
    animations;
    deathHandler;
    clothing;
    weapon;
    weather;
    webview;
    session;
    charcreator;
    charselector;
    player;
    inventory;
    chat;
    character;
    vehicleSelector;
    vehicle;
    tuning;
    freecam;
    notification;
    auth;
    tutorial;
    nameTag;
    hud;
    context;
    phone;
    admin;
    house;
    subtitle;
    houseSelector;
    spawnSelector;
    definedJob;
    bank;
    vehicleInventory;
    publicGarage;
    groupData;
    groupsMenu;
    waypoint;
    dialogHandler;
    interiorHandler;
    supermarketHandler;
    ammuniationHandler;
    gasstationHandler;
    menuHandler;
    countdownHandler;
    accountHandler;
    vehicleCatalogHandler;
    adminPrisonHandler;
    hairSalonHandler;
    tattooStudioHandler;
    clothingStoreHandler;
    drivingSchoolHandler;
    constructor(fireMdcHandler, vehicleSirenHandler, policeMdcHandler, emergencyCallHandler, mdcHandler, blipSyncHandler, doorSyncHandler, pedSyncHandler, markerSyncHandler, objectSyncHandler, playersList, animationWheelHandler, animations, deathHandler, clothing, weapon, weather, webview, session, charcreator, charselector, player, inventory, chat, character, vehicleSelector, vehicle, tuning, freecam, notification, auth, tutorial, nameTag, hud, context, phone, admin, house, subtitle, houseSelector, spawnSelector, definedJob, bank, vehicleInventory, publicGarage, groupData, groupsMenu, waypoint, dialogHandler, interiorHandler, supermarketHandler, ammuniationHandler, gasstationHandler, menuHandler, countdownHandler, accountHandler, vehicleCatalogHandler, adminPrisonHandler, hairSalonHandler, tattooStudioHandler, clothingStoreHandler, drivingSchoolHandler) {
        this.fireMdcHandler = fireMdcHandler;
        this.vehicleSirenHandler = vehicleSirenHandler;
        this.policeMdcHandler = policeMdcHandler;
        this.emergencyCallHandler = emergencyCallHandler;
        this.mdcHandler = mdcHandler;
        this.blipSyncHandler = blipSyncHandler;
        this.doorSyncHandler = doorSyncHandler;
        this.pedSyncHandler = pedSyncHandler;
        this.markerSyncHandler = markerSyncHandler;
        this.objectSyncHandler = objectSyncHandler;
        this.playersList = playersList;
        this.animationWheelHandler = animationWheelHandler;
        this.animations = animations;
        this.deathHandler = deathHandler;
        this.clothing = clothing;
        this.weapon = weapon;
        this.weather = weather;
        this.webview = webview;
        this.session = session;
        this.charcreator = charcreator;
        this.charselector = charselector;
        this.player = player;
        this.inventory = inventory;
        this.chat = chat;
        this.character = character;
        this.vehicleSelector = vehicleSelector;
        this.vehicle = vehicle;
        this.tuning = tuning;
        this.freecam = freecam;
        this.notification = notification;
        this.auth = auth;
        this.tutorial = tutorial;
        this.nameTag = nameTag;
        this.hud = hud;
        this.context = context;
        this.phone = phone;
        this.admin = admin;
        this.house = house;
        this.subtitle = subtitle;
        this.houseSelector = houseSelector;
        this.spawnSelector = spawnSelector;
        this.definedJob = definedJob;
        this.bank = bank;
        this.vehicleInventory = vehicleInventory;
        this.publicGarage = publicGarage;
        this.groupData = groupData;
        this.groupsMenu = groupsMenu;
        this.waypoint = waypoint;
        this.dialogHandler = dialogHandler;
        this.interiorHandler = interiorHandler;
        this.supermarketHandler = supermarketHandler;
        this.ammuniationHandler = ammuniationHandler;
        this.gasstationHandler = gasstationHandler;
        this.menuHandler = menuHandler;
        this.countdownHandler = countdownHandler;
        this.accountHandler = accountHandler;
        this.vehicleCatalogHandler = vehicleCatalogHandler;
        this.adminPrisonHandler = adminPrisonHandler;
        this.hairSalonHandler = hairSalonHandler;
        this.tattooStudioHandler = tattooStudioHandler;
        this.clothingStoreHandler = clothingStoreHandler;
        this.drivingSchoolHandler = drivingSchoolHandler;
    }
};
ClientStartup = __decorate([
    injectable(),
    __metadata("design:paramtypes", [FireMdcHandler,
        VehicleSirenHandler,
        PoliceMdcHandler,
        EmergencyCallHandler,
        MdcHandler,
        BlipSyncHandler,
        DoorSyncHandler,
        PedSyncHandler,
        MarkerSyncHandler,
        ObjectSyncHandler,
        PlayersListHandler,
        AnimationWheelHandler,
        AnimationsHandler,
        DeathHandler,
        ClothingHandler,
        WeaponHandler,
        WeatherHandler,
        WebviewHandler,
        SessionHandler,
        CharacterCreatorHandler,
        CharacterSelectorHandler,
        PlayerHandler,
        InventoryHandler,
        ChatHandler,
        CharacterHandler,
        VehicleSelectorHandler,
        VehicleHandler,
        TuningHandler,
        FreeCamHandler,
        NotificationHandler,
        AuthenticationHandler,
        TutorialHandler,
        NameTagHandler,
        HudHandler,
        ContextMenuHandler,
        PhoneHandler,
        AdminHandler,
        HouseHandler,
        SubTitleHandler,
        HouseSelectorHandler,
        SpawnSelectorHandler,
        DefinedJobHandler,
        BankHandler,
        VehicleInventoryHandler,
        PublicGarageHandler,
        GroupDataHandler,
        GroupsMenuHandler,
        WaypointHandler,
        DialogHandler,
        InteriorHandler,
        SupermarketHandler,
        AmmunationHandler,
        GasStationHandler,
        MenuHandler,
        CountdownHandler,
        AccountHandler,
        VehicleCatalogHandler,
        AdminPrisonHandler,
        HairSalonHandler,
        TattooStudioHandler,
        ClothingStoreHandler,
        DrivingSchoolHandler])
], ClientStartup);

instance.resolve(ClientStartup);
