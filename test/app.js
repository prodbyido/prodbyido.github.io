!(function(modules) {
  function __webpack_require__(moduleId) {
    if (installedModules[moduleId]) return installedModules[moduleId].exports;
    var module = (installedModules[moduleId] = {
      exports: {},
      id: moduleId,
      loaded: !1
    });
    return (
      modules[moduleId].call(
        module.exports,
        module,
        module.exports,
        __webpack_require__
      ),
      (module.loaded = !0),
      module.exports
    );
  }
  var installedModules = {};
  return (
    (__webpack_require__.m = modules),
    (__webpack_require__.c = installedModules),
    (__webpack_require__.p = "/blog/2016/07/28/loops/"),
    __webpack_require__(0)
  );
})([
  function(module, exports, __webpack_require__) {
    __webpack_require__(1),
      __webpack_require__(2),
      (module.exports = __webpack_require__(4));
  },
  function() {
    !(function(self) {
      "use strict";
      function normalizeName(name) {
        if (
          ("string" != typeof name && (name = String(name)),
          /[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name))
        )
          throw new TypeError("Invalid character in header field name");
        return name.toLowerCase();
      }
      function normalizeValue(value) {
        return "string" != typeof value && (value = String(value)), value;
      }
      function iteratorFor(items) {
        var iterator = {
          next: function() {
            var value = items.shift();
            return { done: void 0 === value, value: value };
          }
        };
        return (
          support.iterable &&
            (iterator[Symbol.iterator] = function() {
              return iterator;
            }),
          iterator
        );
      }
      function Headers(headers) {
        (this.map = {}),
          headers instanceof Headers
            ? headers.forEach(function(value, name) {
                this.append(name, value);
              }, this)
            : headers &&
              Object.getOwnPropertyNames(headers).forEach(function(name) {
                this.append(name, headers[name]);
              }, this);
      }
      function consumed(body) {
        return body.bodyUsed
          ? Promise.reject(new TypeError("Already read"))
          : ((body.bodyUsed = !0), void 0);
      }
      function fileReaderReady(reader) {
        return new Promise(function(resolve, reject) {
          (reader.onload = function() {
            resolve(reader.result);
          }),
            (reader.onerror = function() {
              reject(reader.error);
            });
        });
      }
      function readBlobAsArrayBuffer(blob) {
        var reader = new FileReader();
        return reader.readAsArrayBuffer(blob), fileReaderReady(reader);
      }
      function readBlobAsText(blob) {
        var reader = new FileReader();
        return reader.readAsText(blob), fileReaderReady(reader);
      }
      function Body() {
        return (
          (this.bodyUsed = !1),
          (this._initBody = function(body) {
            if (((this._bodyInit = body), "string" == typeof body))
              this._bodyText = body;
            else if (support.blob && Blob.prototype.isPrototypeOf(body))
              this._bodyBlob = body;
            else if (support.formData && FormData.prototype.isPrototypeOf(body))
              this._bodyFormData = body;
            else if (
              support.searchParams &&
              URLSearchParams.prototype.isPrototypeOf(body)
            )
              this._bodyText = body.toString();
            else if (body) {
              if (
                !support.arrayBuffer ||
                !ArrayBuffer.prototype.isPrototypeOf(body)
              )
                throw new Error("unsupported BodyInit type");
            } else this._bodyText = "";
            this.headers.get("content-type") ||
              ("string" == typeof body
                ? this.headers.set("content-type", "text/plain;charset=UTF-8")
                : this._bodyBlob && this._bodyBlob.type
                ? this.headers.set("content-type", this._bodyBlob.type)
                : support.searchParams &&
                  URLSearchParams.prototype.isPrototypeOf(body) &&
                  this.headers.set(
                    "content-type",
                    "application/x-www-form-urlencoded;charset=UTF-8"
                  ));
          }),
          support.blob
            ? ((this.blob = function() {
                var rejected = consumed(this);
                if (rejected) return rejected;
                if (this._bodyBlob) return Promise.resolve(this._bodyBlob);
                if (this._bodyFormData)
                  throw new Error("could not read FormData body as blob");
                return Promise.resolve(new Blob([this._bodyText]));
              }),
              (this.arrayBuffer = function() {
                return this.blob().then(readBlobAsArrayBuffer);
              }),
              (this.text = function() {
                var rejected = consumed(this);
                if (rejected) return rejected;
                if (this._bodyBlob) return readBlobAsText(this._bodyBlob);
                if (this._bodyFormData)
                  throw new Error("could not read FormData body as text");
                return Promise.resolve(this._bodyText);
              }))
            : (this.text = function() {
                var rejected = consumed(this);
                return rejected ? rejected : Promise.resolve(this._bodyText);
              }),
          support.formData &&
            (this.formData = function() {
              return this.text().then(decode);
            }),
          (this.json = function() {
            return this.text().then(JSON.parse);
          }),
          this
        );
      }
      function normalizeMethod(method) {
        var upcased = method.toUpperCase();
        return methods.indexOf(upcased) > -1 ? upcased : method;
      }
      function Request(input, options) {
        options = options || {};
        var body = options.body;
        if (Request.prototype.isPrototypeOf(input)) {
          if (input.bodyUsed) throw new TypeError("Already read");
          (this.url = input.url),
            (this.credentials = input.credentials),
            options.headers || (this.headers = new Headers(input.headers)),
            (this.method = input.method),
            (this.mode = input.mode),
            body || ((body = input._bodyInit), (input.bodyUsed = !0));
        } else this.url = input;
        if (
          ((this.credentials =
            options.credentials || this.credentials || "omit"),
          (options.headers || !this.headers) &&
            (this.headers = new Headers(options.headers)),
          (this.method = normalizeMethod(
            options.method || this.method || "GET"
          )),
          (this.mode = options.mode || this.mode || null),
          (this.referrer = null),
          ("GET" === this.method || "HEAD" === this.method) && body)
        )
          throw new TypeError("Body not allowed for GET or HEAD requests");
        this._initBody(body);
      }
      function decode(body) {
        var form = new FormData();
        return (
          body
            .trim()
            .split("&")
            .forEach(function(bytes) {
              if (bytes) {
                var split = bytes.split("="),
                  name = split.shift().replace(/\+/g, " "),
                  value = split.join("=").replace(/\+/g, " ");
                form.append(
                  decodeURIComponent(name),
                  decodeURIComponent(value)
                );
              }
            }),
          form
        );
      }
      function headers(xhr) {
        var head = new Headers(),
          pairs = (xhr.getAllResponseHeaders() || "").trim().split("\n");
        return (
          pairs.forEach(function(header) {
            var split = header.trim().split(":"),
              key = split.shift().trim(),
              value = split.join(":").trim();
            head.append(key, value);
          }),
          head
        );
      }
      function Response(bodyInit, options) {
        options || (options = {}),
          (this.type = "default"),
          (this.status = options.status),
          (this.ok = this.status >= 200 && this.status < 300),
          (this.statusText = options.statusText),
          (this.headers =
            options.headers instanceof Headers
              ? options.headers
              : new Headers(options.headers)),
          (this.url = options.url || ""),
          this._initBody(bodyInit);
      }
      if (!self.fetch) {
        var support = {
          searchParams: "URLSearchParams" in self,
          iterable: "Symbol" in self && "iterator" in Symbol,
          blob:
            "FileReader" in self &&
            "Blob" in self &&
            (function() {
              try {
                return new Blob(), !0;
              } catch (e) {
                return !1;
              }
            })(),
          formData: "FormData" in self,
          arrayBuffer: "ArrayBuffer" in self
        };
        (Headers.prototype.append = function(name, value) {
          (name = normalizeName(name)), (value = normalizeValue(value));
          var list = this.map[name];
          list || ((list = []), (this.map[name] = list)), list.push(value);
        }),
          (Headers.prototype["delete"] = function(name) {
            delete this.map[normalizeName(name)];
          }),
          (Headers.prototype.get = function(name) {
            var values = this.map[normalizeName(name)];
            return values ? values[0] : null;
          }),
          (Headers.prototype.getAll = function(name) {
            return this.map[normalizeName(name)] || [];
          }),
          (Headers.prototype.has = function(name) {
            return this.map.hasOwnProperty(normalizeName(name));
          }),
          (Headers.prototype.set = function(name, value) {
            this.map[normalizeName(name)] = [normalizeValue(value)];
          }),
          (Headers.prototype.forEach = function(callback, thisArg) {
            Object.getOwnPropertyNames(this.map).forEach(function(name) {
              this.map[name].forEach(function(value) {
                callback.call(thisArg, value, name, this);
              }, this);
            }, this);
          }),
          (Headers.prototype.keys = function() {
            var items = [];
            return (
              this.forEach(function(value, name) {
                items.push(name);
              }),
              iteratorFor(items)
            );
          }),
          (Headers.prototype.values = function() {
            var items = [];
            return (
              this.forEach(function(value) {
                items.push(value);
              }),
              iteratorFor(items)
            );
          }),
          (Headers.prototype.entries = function() {
            var items = [];
            return (
              this.forEach(function(value, name) {
                items.push([name, value]);
              }),
              iteratorFor(items)
            );
          }),
          support.iterable &&
            (Headers.prototype[Symbol.iterator] = Headers.prototype.entries);
        var methods = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
        (Request.prototype.clone = function() {
          return new Request(this);
        }),
          Body.call(Request.prototype),
          Body.call(Response.prototype),
          (Response.prototype.clone = function() {
            return new Response(this._bodyInit, {
              status: this.status,
              statusText: this.statusText,
              headers: new Headers(this.headers),
              url: this.url
            });
          }),
          (Response.error = function() {
            var response = new Response(null, { status: 0, statusText: "" });
            return (response.type = "error"), response;
          });
        var redirectStatuses = [301, 302, 303, 307, 308];
        (Response.redirect = function(url, status) {
          if (-1 === redirectStatuses.indexOf(status))
            throw new RangeError("Invalid status code");
          return new Response(null, {
            status: status,
            headers: { location: url }
          });
        }),
          (self.Headers = Headers),
          (self.Request = Request),
          (self.Response = Response),
          (self.fetch = function(input, init) {
            return new Promise(function(resolve, reject) {
              function responseURL() {
                return "responseURL" in xhr
                  ? xhr.responseURL
                  : /^X-Request-URL:/m.test(xhr.getAllResponseHeaders())
                  ? xhr.getResponseHeader("X-Request-URL")
                  : void 0;
              }
              var request;
              request =
                Request.prototype.isPrototypeOf(input) && !init
                  ? input
                  : new Request(input, init);
              var xhr = new XMLHttpRequest();
              (xhr.onload = function() {
                var options = {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    headers: headers(xhr),
                    url: responseURL()
                  },
                  body = "response" in xhr ? xhr.response : xhr.responseText;
                resolve(new Response(body, options));
              }),
                (xhr.onerror = function() {
                  reject(new TypeError("Network request failed"));
                }),
                (xhr.ontimeout = function() {
                  reject(new TypeError("Network request failed"));
                }),
                xhr.open(request.method, request.url, !0),
                "include" === request.credentials && (xhr.withCredentials = !0),
                "responseType" in xhr &&
                  support.blob &&
                  (xhr.responseType = "blob"),
                request.headers.forEach(function(value, name) {
                  xhr.setRequestHeader(name, value);
                }),
                xhr.send(
                  "undefined" == typeof request._bodyInit
                    ? null
                    : request._bodyInit
                );
            });
          }),
          (self.fetch.polyfill = !0);
      }
    })("undefined" != typeof self ? self : this);
  },
  function(module, exports, __webpack_require__) {
    !function(global, process) {
      /**
       * Copyright (c) 2014, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
       * additional grant of patent rights can be found in the PATENTS file in
       * the same directory.
       */
      !(function(global) {
        "use strict";
        function wrap(innerFn, outerFn, self, tryLocsList) {
          var generator = Object.create((outerFn || Generator).prototype),
            context = new Context(tryLocsList || []);
          return (
            (generator._invoke = makeInvokeMethod(innerFn, self, context)),
            generator
          );
        }
        function tryCatch(fn, obj, arg) {
          try {
            return { type: "normal", arg: fn.call(obj, arg) };
          } catch (err) {
            return { type: "throw", arg: err };
          }
        }
        function Generator() {}
        function GeneratorFunction() {}
        function GeneratorFunctionPrototype() {}
        function defineIteratorMethods(prototype) {
          ["next", "throw", "return"].forEach(function(method) {
            prototype[method] = function(arg) {
              return this._invoke(method, arg);
            };
          });
        }
        function AwaitArgument(arg) {
          this.arg = arg;
        }
        function AsyncIterator(generator) {
          function invoke(method, arg) {
            var result = generator[method](arg),
              value = result.value;
            return value instanceof AwaitArgument
              ? Promise.resolve(value.arg).then(invokeNext, invokeThrow)
              : Promise.resolve(value).then(function(unwrapped) {
                  return (result.value = unwrapped), result;
                });
          }
          function enqueue(method, arg) {
            function callInvokeWithMethodAndArg() {
              return invoke(method, arg);
            }
            return (previousPromise = previousPromise
              ? previousPromise.then(
                  callInvokeWithMethodAndArg,
                  callInvokeWithMethodAndArg
                )
              : new Promise(function(resolve) {
                  resolve(callInvokeWithMethodAndArg());
                }));
          }
          "object" == typeof process &&
            process.domain &&
            (invoke = process.domain.bind(invoke));
          var invokeNext = invoke.bind(generator, "next"),
            invokeThrow = invoke.bind(generator, "throw");
          invoke.bind(generator, "return");
          var previousPromise;
          this._invoke = enqueue;
        }
        function makeInvokeMethod(innerFn, self, context) {
          var state = GenStateSuspendedStart;
          return function(method, arg) {
            if (state === GenStateExecuting)
              throw new Error("Generator is already running");
            if (state === GenStateCompleted) {
              if ("throw" === method) throw arg;
              return doneResult();
            }
            for (;;) {
              var delegate = context.delegate;
              if (delegate) {
                if (
                  "return" === method ||
                  ("throw" === method &&
                    delegate.iterator[method] === undefined)
                ) {
                  context.delegate = null;
                  var returnMethod = delegate.iterator["return"];
                  if (returnMethod) {
                    var record = tryCatch(returnMethod, delegate.iterator, arg);
                    if ("throw" === record.type) {
                      (method = "throw"), (arg = record.arg);
                      continue;
                    }
                  }
                  if ("return" === method) continue;
                }
                var record = tryCatch(
                  delegate.iterator[method],
                  delegate.iterator,
                  arg
                );
                if ("throw" === record.type) {
                  (context.delegate = null),
                    (method = "throw"),
                    (arg = record.arg);
                  continue;
                }
                (method = "next"), (arg = undefined);
                var info = record.arg;
                if (!info.done) return (state = GenStateSuspendedYield), info;
                (context[delegate.resultName] = info.value),
                  (context.next = delegate.nextLoc),
                  (context.delegate = null);
              }
              if ("next" === method)
                (context._sent = arg),
                  (context.sent =
                    state === GenStateSuspendedYield ? arg : undefined);
              else if ("throw" === method) {
                if (state === GenStateSuspendedStart)
                  throw ((state = GenStateCompleted), arg);
                context.dispatchException(arg) &&
                  ((method = "next"), (arg = undefined));
              } else "return" === method && context.abrupt("return", arg);
              state = GenStateExecuting;
              var record = tryCatch(innerFn, self, context);
              if ("normal" === record.type) {
                state = context.done
                  ? GenStateCompleted
                  : GenStateSuspendedYield;
                var info = { value: record.arg, done: context.done };
                if (record.arg !== ContinueSentinel) return info;
                context.delegate && "next" === method && (arg = undefined);
              } else
                "throw" === record.type &&
                  ((state = GenStateCompleted),
                  (method = "throw"),
                  (arg = record.arg));
            }
          };
        }
        function pushTryEntry(locs) {
          var entry = { tryLoc: locs[0] };
          1 in locs && (entry.catchLoc = locs[1]),
            2 in locs &&
              ((entry.finallyLoc = locs[2]), (entry.afterLoc = locs[3])),
            this.tryEntries.push(entry);
        }
        function resetTryEntry(entry) {
          var record = entry.completion || {};
          (record.type = "normal"),
            delete record.arg,
            (entry.completion = record);
        }
        function Context(tryLocsList) {
          (this.tryEntries = [{ tryLoc: "root" }]),
            tryLocsList.forEach(pushTryEntry, this),
            this.reset(!0);
        }
        function values(iterable) {
          if (iterable) {
            var iteratorMethod = iterable[iteratorSymbol];
            if (iteratorMethod) return iteratorMethod.call(iterable);
            if ("function" == typeof iterable.next) return iterable;
            if (!isNaN(iterable.length)) {
              var i = -1,
                next = function next() {
                  for (; ++i < iterable.length; )
                    if (hasOwn.call(iterable, i))
                      return (next.value = iterable[i]), (next.done = !1), next;
                  return (next.value = undefined), (next.done = !0), next;
                };
              return (next.next = next);
            }
          }
          return { next: doneResult };
        }
        function doneResult() {
          return { value: undefined, done: !0 };
        }
        var undefined,
          hasOwn = Object.prototype.hasOwnProperty,
          iteratorSymbol =
            ("function" == typeof Symbol && Symbol.iterator) || "@@iterator",
          inModule = "object" == typeof module,
          runtime = global.regeneratorRuntime;
        if (runtime) return inModule && (module.exports = runtime), void 0;
        (runtime = global.regeneratorRuntime = inModule ? module.exports : {}),
          (runtime.wrap = wrap);
        var GenStateSuspendedStart = "suspendedStart",
          GenStateSuspendedYield = "suspendedYield",
          GenStateExecuting = "executing",
          GenStateCompleted = "completed",
          ContinueSentinel = {},
          Gp = (GeneratorFunctionPrototype.prototype = Generator.prototype);
        (GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype),
          (GeneratorFunctionPrototype.constructor = GeneratorFunction),
          (GeneratorFunction.displayName = "GeneratorFunction"),
          (runtime.isGeneratorFunction = function(genFun) {
            var ctor = "function" == typeof genFun && genFun.constructor;
            return ctor
              ? ctor === GeneratorFunction ||
                  "GeneratorFunction" === (ctor.displayName || ctor.name)
              : !1;
          }),
          (runtime.mark = function(genFun) {
            return (
              Object.setPrototypeOf
                ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype)
                : (genFun.__proto__ = GeneratorFunctionPrototype),
              (genFun.prototype = Object.create(Gp)),
              genFun
            );
          }),
          (runtime.awrap = function(arg) {
            return new AwaitArgument(arg);
          }),
          defineIteratorMethods(AsyncIterator.prototype),
          (runtime.async = function(innerFn, outerFn, self, tryLocsList) {
            var iter = new AsyncIterator(
              wrap(innerFn, outerFn, self, tryLocsList)
            );
            return runtime.isGeneratorFunction(outerFn)
              ? iter
              : iter.next().then(function(result) {
                  return result.done ? result.value : iter.next();
                });
          }),
          defineIteratorMethods(Gp),
          (Gp[iteratorSymbol] = function() {
            return this;
          }),
          (Gp.toString = function() {
            return "[object Generator]";
          }),
          (runtime.keys = function(object) {
            var keys = [];
            for (var key in object) keys.push(key);
            return (
              keys.reverse(),
              function next() {
                for (; keys.length; ) {
                  var key = keys.pop();
                  if (key in object)
                    return (next.value = key), (next.done = !1), next;
                }
                return (next.done = !0), next;
              }
            );
          }),
          (runtime.values = values),
          (Context.prototype = {
            constructor: Context,
            reset: function(skipTempReset) {
              if (
                ((this.prev = 0),
                (this.next = 0),
                (this.sent = undefined),
                (this.done = !1),
                (this.delegate = null),
                this.tryEntries.forEach(resetTryEntry),
                !skipTempReset)
              )
                for (var name in this)
                  "t" === name.charAt(0) &&
                    hasOwn.call(this, name) &&
                    !isNaN(+name.slice(1)) &&
                    (this[name] = undefined);
            },
            stop: function() {
              this.done = !0;
              var rootEntry = this.tryEntries[0],
                rootRecord = rootEntry.completion;
              if ("throw" === rootRecord.type) throw rootRecord.arg;
              return this.rval;
            },
            dispatchException: function(exception) {
              function handle(loc, caught) {
                return (
                  (record.type = "throw"),
                  (record.arg = exception),
                  (context.next = loc),
                  !!caught
                );
              }
              if (this.done) throw exception;
              for (
                var context = this, i = this.tryEntries.length - 1;
                i >= 0;
                --i
              ) {
                var entry = this.tryEntries[i],
                  record = entry.completion;
                if ("root" === entry.tryLoc) return handle("end");
                if (entry.tryLoc <= this.prev) {
                  var hasCatch = hasOwn.call(entry, "catchLoc"),
                    hasFinally = hasOwn.call(entry, "finallyLoc");
                  if (hasCatch && hasFinally) {
                    if (this.prev < entry.catchLoc)
                      return handle(entry.catchLoc, !0);
                    if (this.prev < entry.finallyLoc)
                      return handle(entry.finallyLoc);
                  } else if (hasCatch) {
                    if (this.prev < entry.catchLoc)
                      return handle(entry.catchLoc, !0);
                  } else {
                    if (!hasFinally)
                      throw new Error("try statement without catch or finally");
                    if (this.prev < entry.finallyLoc)
                      return handle(entry.finallyLoc);
                  }
                }
              }
            },
            abrupt: function(type, arg) {
              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var entry = this.tryEntries[i];
                if (
                  entry.tryLoc <= this.prev &&
                  hasOwn.call(entry, "finallyLoc") &&
                  this.prev < entry.finallyLoc
                ) {
                  var finallyEntry = entry;
                  break;
                }
              }
              finallyEntry &&
                ("break" === type || "continue" === type) &&
                finallyEntry.tryLoc <= arg &&
                arg <= finallyEntry.finallyLoc &&
                (finallyEntry = null);
              var record = finallyEntry ? finallyEntry.completion : {};
              return (
                (record.type = type),
                (record.arg = arg),
                finallyEntry
                  ? (this.next = finallyEntry.finallyLoc)
                  : this.complete(record),
                ContinueSentinel
              );
            },
            complete: function(record, afterLoc) {
              if ("throw" === record.type) throw record.arg;
              "break" === record.type || "continue" === record.type
                ? (this.next = record.arg)
                : "return" === record.type
                ? ((this.rval = record.arg), (this.next = "end"))
                : "normal" === record.type &&
                  afterLoc &&
                  (this.next = afterLoc);
            },
            finish: function(finallyLoc) {
              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var entry = this.tryEntries[i];
                if (entry.finallyLoc === finallyLoc)
                  return (
                    this.complete(entry.completion, entry.afterLoc),
                    resetTryEntry(entry),
                    ContinueSentinel
                  );
              }
            },
            catch: function(tryLoc) {
              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var entry = this.tryEntries[i];
                if (entry.tryLoc === tryLoc) {
                  var record = entry.completion;
                  if ("throw" === record.type) {
                    var thrown = record.arg;
                    resetTryEntry(entry);
                  }
                  return thrown;
                }
              }
              throw new Error("illegal catch attempt");
            },
            delegateYield: function(iterable, resultName, nextLoc) {
              return (
                (this.delegate = {
                  iterator: values(iterable),
                  resultName: resultName,
                  nextLoc: nextLoc
                }),
                ContinueSentinel
              );
            }
          });
      })(
        "object" == typeof global
          ? global
          : "object" == typeof window
          ? window
          : "object" == typeof self
          ? self
          : this
      );
    }.call(
      exports,
      (function() {
        return this;
      })(),
      __webpack_require__(3)
    );
  },
  function(module) {
    function cleanUpNextTick() {
      draining &&
        currentQueue &&
        ((draining = !1),
        currentQueue.length
          ? (queue = currentQueue.concat(queue))
          : (queueIndex = -1),
        queue.length && drainQueue());
    }
    function drainQueue() {
      if (!draining) {
        var timeout = setTimeout(cleanUpNextTick);
        draining = !0;
        for (var len = queue.length; len; ) {
          for (currentQueue = queue, queue = []; ++queueIndex < len; )
            currentQueue && currentQueue[queueIndex].run();
          (queueIndex = -1), (len = queue.length);
        }
        (currentQueue = null), (draining = !1), clearTimeout(timeout);
      }
    }
    function Item(fun, array) {
      (this.fun = fun), (this.array = array);
    }
    function noop() {}
    var currentQueue,
      process = (module.exports = {}),
      queue = [],
      draining = !1,
      queueIndex = -1;
    (process.nextTick = function(fun) {
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1)
        for (var i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
      queue.push(new Item(fun, args)),
        1 !== queue.length || draining || setTimeout(drainQueue, 0);
    }),
      (Item.prototype.run = function() {
        this.fun.apply(null, this.array);
      }),
      (process.title = "browser"),
      (process.browser = !0),
      (process.env = {}),
      (process.argv = []),
      (process.version = ""),
      (process.versions = {}),
      (process.on = noop),
      (process.addListener = noop),
      (process.once = noop),
      (process.off = noop),
      (process.removeListener = noop),
      (process.removeAllListeners = noop),
      (process.emit = noop),
      (process.binding = function() {
        throw new Error("process.binding is not supported");
      }),
      (process.cwd = function() {
        return "/";
      }),
      (process.chdir = function() {
        throw new Error("process.chdir is not supported");
      }),
      (process.umask = function() {
        return 0;
      });
  },
  function(module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var _sounds = __webpack_require__(5),
      _rainplayers = __webpack_require__(47),
      _loopplayers = __webpack_require__(48),
      _phasing = __webpack_require__(49),
      _system = __webpack_require__(57),
      _discreet = __webpack_require__(59),
      _noteplayers = __webpack_require__(63),
      _synthplayers = __webpack_require__(64),
      _tone = __webpack_require__(6);
    _interopRequireDefault(_tone),
      __webpack_require__(65),
      __webpack_require__(69);
    var sounds = new _sounds.SoundsService();
    _rainplayers.initRainPlayers(sounds),
      _loopplayers.initLoopPlayers(sounds),
      _phasing.initPhasing(sounds, 0, document.querySelector(".phasing"), !0, [
        247,
        0,
        234
      ]),
      _phasing.initPhasing(
        sounds,
        1,
        document.querySelector(".phasing-variation-1"),
        !1
      ),
      _phasing.initPhasing(
        sounds,
        2,
        document.querySelector(".phasing-variation-2"),
        !1
      ),
      _phasing.initPhasing(
        sounds,
        5,
        document.querySelector(".phasing-variation-3"),
        !1
      ),
      _noteplayers.initNotePlayers(
        sounds,
        document.querySelectorAll("[play-notes]")
      ),
      _system.initMusicForAirports(
        sounds,
        sounds.getGrandPianoSoftSampleBuffers(),
        document.querySelector(".musicforairports"),
        { soundArcRadius: 0.01, fadeInOut: !1 }
      ),
      _system.initMusicForAirports(
        sounds,
        sounds.getGrandPianoSampleBuffers(),
        document.querySelector(".musicforairports-variation-oblique"),
        { playbackRateModifier: 1 / 3, soundArcRadius: 0.01, fadeInOut: !1 }
      ),
      _system.initMusicForAirports(
        sounds,
        sounds.getCorAnglaisSampleBuffers(),
        document.querySelector(".musicforairports-variation-coranglais")
      ),
      _synthplayers.initSynthPlayers(sounds),
      _discreet.initDiscreetMusic(
        sounds,
        document.querySelector(".discreet-sequences"),
        { visualizeSequences: !0 }
      ),
      _discreet.initDiscreetMusic(
        sounds,
        document.querySelector(".discreet-sequences-echoed"),
        { visualizeSequences: !0, useEcho: !0 }
      ),
      _discreet.initDiscreetMusic(
        sounds,
        document.querySelector(".discreet-without-eq"),
        {
          visualizeSequences: !1,
          visualizeFrippertronics: !0,
          useEcho: !0,
          useFrippertronics: !0
        }
      ),
      _discreet.initDiscreetMusic(
        sounds,
        document.querySelector(".discreet-with-eq"),
        {
          visualizeSequences: !1,
          visualizeFrippertronics: !0,
          useEcho: !0,
          useFrippertronics: !0,
          useEqualizer: !0
        }
      );
  },
  function(module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor))
        throw new TypeError("Cannot call a class as a function");
    }
    Object.defineProperty(exports, "__esModule", { value: !0 }),
      (exports.SoundsService = void 0);
    var _extends =
        Object.assign ||
        function(target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source)
              Object.prototype.hasOwnProperty.call(source, key) &&
                (target[key] = source[key]);
          }
          return target;
        },
      _createClass = (function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            (descriptor.enumerable = descriptor.enumerable || !1),
              (descriptor.configurable = !0),
              "value" in descriptor && (descriptor.writable = !0),
              Object.defineProperty(target, descriptor.key, descriptor);
          }
        }
        return function(Constructor, protoProps, staticProps) {
          return (
            protoProps && defineProperties(Constructor.prototype, protoProps),
            staticProps && defineProperties(Constructor, staticProps),
            Constructor
          );
        };
      })(),
      _tone = __webpack_require__(6),
      _tone2 = _interopRequireDefault(_tone),
      SOUNDS = [
        {
          name: "It's Gonna Rain",
          sample: __webpack_require__(7),
          startAt: 3.02,
          endAt: 3.82
        },
        {
          name: "Rhythm Was Generating",
          sample: __webpack_require__(8),
          startAt: 4.55,
          endAt: 5.55
        },
        {
          name: "Kendrick",
          sample: __webpack_require__(9),
          startAt: 3.1,
          endAt: 4
        },
        {
          name: "Kendrick",
          sample: __webpack_require__(10),
          startAt: 10.1,
          endAt: 10.8
        },
        {
          name: "Laurie",
          sample: __webpack_require__(11),
          startAt: 0,
          endAt: 1.1
        },
        {
          name: "Laurie3",
          sample: __webpack_require__(12),
          startAt: 8.55,
          endAt: 9.8
        }
      ],
      SYNTH = { name: "Glass Choir", sample: __webpack_require__(13) },
      COR_ANGLAIS_TREATED = [
        { note: "F3", sample: __webpack_require__(14), rate: 1 },
        { note: "G#3", sample: __webpack_require__(15), rate: 1 },
        {
          note: "C4",
          sample: __webpack_require__(16),
          rate: Math.pow(2, 1 / 12)
        },
        {
          note: "C#4",
          sample: __webpack_require__(17),
          rate: Math.pow(2, -1 / 12)
        },
        {
          note: "D#4",
          sample: __webpack_require__(17),
          rate: Math.pow(2, 1 / 12)
        },
        { note: "F4", sample: __webpack_require__(18), rate: 1 },
        { note: "G#4", sample: __webpack_require__(19), rate: 1 }
      ],
      COR_ANGLAIS = [
        { note: "F3", sample: __webpack_require__(20), rate: 1 },
        { note: "Ab3", sample: __webpack_require__(21), rate: 1 },
        {
          note: "C4",
          sample: __webpack_require__(22),
          rate: Math.pow(2, 1 / 12)
        },
        {
          note: "Db4",
          sample: __webpack_require__(23),
          rate: Math.pow(2, -1 / 12)
        },
        {
          note: "Eb4",
          sample: __webpack_require__(23),
          rate: Math.pow(2, 1 / 12)
        },
        { note: "F4", sample: __webpack_require__(24), rate: 1 },
        { note: "Ab4", sample: __webpack_require__(25), rate: 1 }
      ],
      CHORUS_FEMALE = [
        {
          note: "F3",
          sample: __webpack_require__(26),
          rate: Math.pow(2, -2 / 12)
        },
        { note: "G#3", sample: __webpack_require__(27), rate: 1 },
        { note: "C4", sample: __webpack_require__(28), rate: 1 },
        { note: "C#4", sample: __webpack_require__(29), rate: 1 },
        { note: "D#4", sample: __webpack_require__(30), rate: 1 },
        { note: "F4", sample: __webpack_require__(31), rate: 1 },
        { note: "G#4", sample: __webpack_require__(32), rate: 1 }
      ],
      GRAND_PIANO = [
        {
          note: "F3",
          sample: __webpack_require__(33),
          rate: Math.pow(2, 2 / 12)
        },
        {
          note: "Ab3",
          sample: __webpack_require__(34),
          rate: Math.pow(2, -1 / 12)
        },
        { note: "C4", sample: __webpack_require__(35), rate: 1 },
        {
          note: "Db4",
          sample: __webpack_require__(35),
          rate: Math.pow(2, 1 / 12)
        },
        { note: "Eb4", sample: __webpack_require__(36), rate: 1 },
        {
          note: "F4",
          sample: __webpack_require__(37),
          rate: Math.pow(2, -1 / 12)
        },
        {
          note: "Ab4",
          sample: __webpack_require__(38),
          rate: Math.pow(2, -1 / 12)
        }
      ];
    [
      {
        note: "F3",
        sample: __webpack_require__(39),
        rate: Math.pow(2, 2 / 12)
      },
      {
        note: "Ab3",
        sample: __webpack_require__(40),
        rate: Math.pow(2, -1 / 12)
      },
      { note: "C4", sample: __webpack_require__(41), rate: 1 },
      {
        note: "Db4",
        sample: __webpack_require__(41),
        rate: Math.pow(2, 1 / 12)
      },
      { note: "Eb4", sample: __webpack_require__(42), rate: 1 },
      {
        note: "F4",
        sample: __webpack_require__(43),
        rate: Math.pow(2, -1 / 12)
      },
      {
        note: "Ab4",
        sample: __webpack_require__(44),
        rate: Math.pow(2, -1 / 12)
      }
    ],
      (exports.SoundsService = (function() {
        function SoundsService() {
          _classCallCheck(this, SoundsService),
            (this.audioCtx = _tone2.default.context),
            (this._bufferCache = {});
        }
        return (
          _createClass(SoundsService, [
            {
              key: "getSounds",
              value: function() {
                return SOUNDS;
              }
            },
            {
              key: "getSynth",
              value: function() {
                return SYNTH;
              }
            },
            {
              key: "getSampleBuffer",
              value: function(sound) {
                var _this = this;
                return (
                  this._bufferCache.hasOwnProperty(sound.sample) ||
                    (this._bufferCache[sound.sample] = fetch(sound.sample)
                      .then(function(res) {
                        return res.arrayBuffer();
                      })
                      .then(function(buf) {
                        return _this.audioCtx.decodeAudioData(buf);
                      })),
                  this._bufferCache[sound.sample]
                );
              }
            },
            {
              key: "getAllSampleBuffers",
              value: function(sounds) {
                var _this2 = this;
                return Promise.all(
                  sounds.map(function(s) {
                    return _this2.getSampleBuffer(s);
                  })
                )
                  .then(function(buffers) {
                    return sounds.map(function(sound, idx) {
                      return _extends({}, sound, { buffer: buffers[idx] });
                    });
                  })
                  .catch(function(e) {
                    return console.error(e);
                  });
              }
            },
            {
              key: "getCorAnglaisSampleBuffers",
              value: function() {
                return this.getAllSampleBuffers(COR_ANGLAIS);
              }
            },
            {
              key: "getCorAnglaisTreatedSampleBuffers",
              value: function() {
                return this.getAllSampleBuffers(COR_ANGLAIS_TREATED);
              }
            },
            {
              key: "getChorusFemaleSampleBuffers",
              value: function() {
                return this.getAllSampleBuffers(CHORUS_FEMALE);
              }
            },
            {
              key: "getGrandPianoSampleBuffers",
              value: function() {
                return this.getAllSampleBuffers(GRAND_PIANO);
              }
            },
            {
              key: "getGrandPianoSoftSampleBuffers",
              value: function() {
                return this.getAllSampleBuffers(GRAND_PIANO);
              }
            },
            {
              key: "getStPatricksChurchSampleBuffer",
              value: function() {
                return this.getSampleBuffer({
                  sample: __webpack_require__(45)
                });
              }
            },
            {
              key: "getAirportSampleBuffer",
              value: function() {
                return this.getSampleBuffer({
                  sample: __webpack_require__(46)
                });
              }
            }
          ]),
          SoundsService
        );
      })());
  },
  function(module, exports, __webpack_require__) {
    var __WEBPACK_AMD_DEFINE_RESULT__;
    !(function(root, factory) {
      (__WEBPACK_AMD_DEFINE_RESULT__ = function() {
        return factory();
      }.call(exports, __webpack_require__, exports, module)),
        !(
          void 0 !== __WEBPACK_AMD_DEFINE_RESULT__ &&
          (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)
        );
    })(this, function() {
      "use strict";
      function Main(func) {
        Tone = func();
      }
      function Module(func) {
        func(Tone);
      }
      var Tone;
      /**
       *  Tone.js
       *  @author Yotam Mann
       *  @license http://opensource.org/licenses/MIT MIT License
       *  @copyright 2014-2016 Yotam Mann
       */
      return (
        Main(function() {
          function isUndef(val) {
            return void 0 === val;
          }
          function isFunction(val) {
            return "function" == typeof val;
          }
          var audioContext;
          if (
            (isUndef(window.AudioContext) &&
              (window.AudioContext = window.webkitAudioContext),
            isUndef(window.OfflineAudioContext) &&
              (window.OfflineAudioContext = window.webkitOfflineAudioContext),
            isUndef(AudioContext))
          )
            throw new Error("Web Audio is not supported in this browser");
          (audioContext = new AudioContext()),
            isFunction(AudioContext.prototype.createGain) ||
              (AudioContext.prototype.createGain =
                AudioContext.prototype.createGainNode),
            isFunction(AudioContext.prototype.createDelay) ||
              (AudioContext.prototype.createDelay =
                AudioContext.prototype.createDelayNode),
            isFunction(AudioContext.prototype.createPeriodicWave) ||
              (AudioContext.prototype.createPeriodicWave =
                AudioContext.prototype.createWaveTable),
            isFunction(AudioBufferSourceNode.prototype.start) ||
              (AudioBufferSourceNode.prototype.start =
                AudioBufferSourceNode.prototype.noteGrainOn),
            isFunction(AudioBufferSourceNode.prototype.stop) ||
              (AudioBufferSourceNode.prototype.stop =
                AudioBufferSourceNode.prototype.noteOff),
            isFunction(OscillatorNode.prototype.start) ||
              (OscillatorNode.prototype.start =
                OscillatorNode.prototype.noteOn),
            isFunction(OscillatorNode.prototype.stop) ||
              (OscillatorNode.prototype.stop =
                OscillatorNode.prototype.noteOff),
            isFunction(OscillatorNode.prototype.setPeriodicWave) ||
              (OscillatorNode.prototype.setPeriodicWave =
                OscillatorNode.prototype.setWaveTable),
            isUndef(AudioNode.prototype._nativeConnect) &&
              ((AudioNode.prototype._nativeConnect =
                AudioNode.prototype.connect),
              (AudioNode.prototype.connect = function(B, outNum, inNum) {
                if (B.input)
                  Array.isArray(B.input)
                    ? (isUndef(inNum) && (inNum = 0),
                      this.connect(B.input[inNum]))
                    : this.connect(B.input, outNum, inNum);
                else
                  try {
                    B instanceof AudioNode
                      ? this._nativeConnect(B, outNum, inNum)
                      : this._nativeConnect(B, outNum);
                  } catch (e) {
                    throw new Error("error connecting to node: " + B);
                  }
              }));
          var Tone = function(inputs, outputs) {
            isUndef(inputs) || 1 === inputs
              ? (this.input = this.context.createGain())
              : inputs > 1 && (this.input = new Array(inputs)),
              isUndef(outputs) || 1 === outputs
                ? (this.output = this.context.createGain())
                : outputs > 1 && (this.output = new Array(inputs));
          };
          (Tone.prototype.set = function(params, value, rampTime) {
            if (this.isObject(params)) rampTime = value;
            else if (this.isString(params)) {
              var tmpObj = {};
              (tmpObj[params] = value), (params = tmpObj);
            }
            for (var attr in params) {
              value = params[attr];
              var parent = this;
              if (-1 !== attr.indexOf(".")) {
                for (
                  var attrSplit = attr.split("."), i = 0;
                  i < attrSplit.length - 1;
                  i++
                )
                  parent = parent[attrSplit[i]];
                attr = attrSplit[attrSplit.length - 1];
              }
              var param = parent[attr];
              isUndef(param) ||
                ((Tone.Signal && param instanceof Tone.Signal) ||
                (Tone.Param && param instanceof Tone.Param)
                  ? param.value !== value &&
                    (isUndef(rampTime)
                      ? (param.value = value)
                      : param.rampTo(value, rampTime))
                  : param instanceof AudioParam
                  ? param.value !== value && (param.value = value)
                  : param instanceof Tone
                  ? param.set(value)
                  : param !== value && (parent[attr] = value));
            }
            return this;
          }),
            (Tone.prototype.get = function(params) {
              isUndef(params)
                ? (params = this._collectDefaults(this.constructor))
                : this.isString(params) && (params = [params]);
              for (var ret = {}, i = 0; i < params.length; i++) {
                var attr = params[i],
                  parent = this,
                  subRet = ret;
                if (-1 !== attr.indexOf(".")) {
                  for (
                    var attrSplit = attr.split("."), j = 0;
                    j < attrSplit.length - 1;
                    j++
                  ) {
                    var subAttr = attrSplit[j];
                    (subRet[subAttr] = subRet[subAttr] || {}),
                      (subRet = subRet[subAttr]),
                      (parent = parent[subAttr]);
                  }
                  attr = attrSplit[attrSplit.length - 1];
                }
                var param = parent[attr];
                this.isObject(params[attr])
                  ? (subRet[attr] = param.get())
                  : Tone.Signal && param instanceof Tone.Signal
                  ? (subRet[attr] = param.value)
                  : Tone.Param && param instanceof Tone.Param
                  ? (subRet[attr] = param.value)
                  : param instanceof AudioParam
                  ? (subRet[attr] = param.value)
                  : param instanceof Tone
                  ? (subRet[attr] = param.get())
                  : isFunction(param) ||
                    isUndef(param) ||
                    (subRet[attr] = param);
              }
              return ret;
            }),
            (Tone.prototype._collectDefaults = function(constr) {
              var ret = [];
              if (
                (isUndef(constr.defaults) ||
                  (ret = Object.keys(constr.defaults)),
                !isUndef(constr._super))
              )
                for (
                  var superDefs = this._collectDefaults(constr._super), i = 0;
                  i < superDefs.length;
                  i++
                )
                  -1 === ret.indexOf(superDefs[i]) && ret.push(superDefs[i]);
              return ret;
            }),
            (Tone.prototype.toString = function() {
              for (var className in Tone) {
                var isLetter = className[0].match(/^[A-Z]$/),
                  sameConstructor = Tone[className] === this.constructor;
                if (isFunction(Tone[className]) && isLetter && sameConstructor)
                  return className;
              }
              return "Tone";
            }),
            (Tone.context = audioContext),
            (Tone.prototype.context = Tone.context),
            (Tone.prototype.bufferSize = 2048),
            (Tone.prototype.blockTime = 128 / Tone.context.sampleRate),
            (Tone.prototype.sampleTime = 1 / Tone.context.sampleRate),
            (Tone.prototype.dispose = function() {
              return (
                this.isUndef(this.input) ||
                  (this.input instanceof AudioNode && this.input.disconnect(),
                  (this.input = null)),
                this.isUndef(this.output) ||
                  (this.output instanceof AudioNode && this.output.disconnect(),
                  (this.output = null)),
                this
              );
            });
          var _silentNode = null;
          (Tone.prototype.noGC = function() {
            return this.output.connect(_silentNode), this;
          }),
            (AudioNode.prototype.noGC = function() {
              return this.connect(_silentNode), this;
            }),
            (Tone.prototype.connect = function(unit, outputNum, inputNum) {
              return (
                Array.isArray(this.output)
                  ? ((outputNum = this.defaultArg(outputNum, 0)),
                    this.output[outputNum].connect(unit, 0, inputNum))
                  : this.output.connect(unit, outputNum, inputNum),
                this
              );
            }),
            (Tone.prototype.disconnect = function(output) {
              return (
                Array.isArray(this.output)
                  ? ((output = this.defaultArg(output, 0)),
                    this.output[output].disconnect())
                  : this.isUndef(output)
                  ? this.output.disconnect()
                  : this.output.disconnect(output),
                this
              );
            }),
            (Tone.prototype.connectSeries = function() {
              if (arguments.length > 1)
                for (
                  var currentUnit = arguments[0], i = 1;
                  i < arguments.length;
                  i++
                ) {
                  var toUnit = arguments[i];
                  currentUnit.connect(toUnit), (currentUnit = toUnit);
                }
              return this;
            }),
            (Tone.prototype.chain = function() {
              if (arguments.length > 0)
                for (var currentUnit = this, i = 0; i < arguments.length; i++) {
                  var toUnit = arguments[i];
                  currentUnit.connect(toUnit), (currentUnit = toUnit);
                }
              return this;
            }),
            (Tone.prototype.fan = function() {
              if (arguments.length > 0)
                for (var i = 0; i < arguments.length; i++)
                  this.connect(arguments[i]);
              return this;
            }),
            (AudioNode.prototype.chain = Tone.prototype.chain),
            (AudioNode.prototype.fan = Tone.prototype.fan),
            (Tone.prototype.defaultArg = function(given, fallback) {
              if (this.isObject(given) && this.isObject(fallback)) {
                var ret = {};
                for (var givenProp in given)
                  ret[givenProp] = this.defaultArg(
                    fallback[givenProp],
                    given[givenProp]
                  );
                for (var fallbackProp in fallback)
                  ret[fallbackProp] = this.defaultArg(
                    given[fallbackProp],
                    fallback[fallbackProp]
                  );
                return ret;
              }
              return isUndef(given) ? fallback : given;
            }),
            (Tone.prototype.optionsObject = function(values, keys, defaults) {
              var options = {};
              if (1 === values.length && this.isObject(values[0]))
                options = values[0];
              else
                for (var i = 0; i < keys.length; i++)
                  options[keys[i]] = values[i];
              return this.isUndef(defaults)
                ? options
                : this.defaultArg(options, defaults);
            }),
            (Tone.prototype.isUndef = isUndef),
            (Tone.prototype.isFunction = isFunction),
            (Tone.prototype.isNumber = function(arg) {
              return "number" == typeof arg;
            }),
            (Tone.prototype.isObject = function(arg) {
              return (
                "[object Object]" === Object.prototype.toString.call(arg) &&
                arg.constructor === Object
              );
            }),
            (Tone.prototype.isBoolean = function(arg) {
              return "boolean" == typeof arg;
            }),
            (Tone.prototype.isArray = function(arg) {
              return Array.isArray(arg);
            }),
            (Tone.prototype.isString = function(arg) {
              return "string" == typeof arg;
            }),
            (Tone.noOp = function() {}),
            (Tone.prototype._readOnly = function(property) {
              if (Array.isArray(property))
                for (var i = 0; i < property.length; i++)
                  this._readOnly(property[i]);
              else
                Object.defineProperty(this, property, {
                  writable: !1,
                  enumerable: !0
                });
            }),
            (Tone.prototype._writable = function(property) {
              if (Array.isArray(property))
                for (var i = 0; i < property.length; i++)
                  this._writable(property[i]);
              else Object.defineProperty(this, property, { writable: !0 });
            }),
            (Tone.State = {
              Started: "started",
              Stopped: "stopped",
              Paused: "paused"
            }),
            (Tone.prototype.equalPowerScale = function(percent) {
              var piFactor = 0.5 * Math.PI;
              return Math.sin(percent * piFactor);
            }),
            (Tone.prototype.dbToGain = function(db) {
              return Math.pow(2, db / 6);
            }),
            (Tone.prototype.gainToDb = function(gain) {
              return 20 * (Math.log(gain) / Math.LN10);
            }),
            (Tone.prototype.intervalToFrequencyRatio = function(interval) {
              return Math.pow(2, interval / 12);
            }),
            (Tone.prototype.now = function() {
              return this.context.currentTime;
            }),
            (Tone.now = function() {
              return Tone.context.currentTime;
            }),
            (Tone.extend = function(child, parent) {
              function TempConstructor() {}
              isUndef(parent) && (parent = Tone),
                (TempConstructor.prototype = parent.prototype),
                (child.prototype = new TempConstructor()),
                (child.prototype.constructor = child),
                (child._super = parent);
            });
          var newContextCallbacks = [];
          return (
            (Tone._initAudioContext = function(callback) {
              callback(Tone.context), newContextCallbacks.push(callback);
            }),
            (Tone.setContext = function(ctx) {
              (Tone.prototype.context = ctx), (Tone.context = ctx);
              for (var i = 0; i < newContextCallbacks.length; i++)
                newContextCallbacks[i](ctx);
            }),
            Tone._initAudioContext(function(audioContext) {
              (Tone.prototype.blockTime = 128 / audioContext.sampleRate),
                (Tone.prototype.sampleTime = 1 / audioContext.sampleRate),
                (_silentNode = audioContext.createGain()),
                (_silentNode.gain.value = 0),
                _silentNode.connect(audioContext.destination);
            }),
            (Tone.version = "r7"),
            console.log(
              "%c * Tone.js " + Tone.version + " * ",
              "background: #000; color: #fff"
            ),
            Tone
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.SignalBase = function() {}),
            Tone.extend(Tone.SignalBase),
            (Tone.SignalBase.prototype.connect = function(
              node,
              outputNumber,
              inputNumber
            ) {
              return (
                (Tone.Signal && Tone.Signal === node.constructor) ||
                (Tone.Param && Tone.Param === node.constructor) ||
                (Tone.TimelineSignal &&
                  Tone.TimelineSignal === node.constructor)
                  ? (node._param.cancelScheduledValues(0),
                    (node._param.value = 0),
                    (node.overridden = !0))
                  : node instanceof AudioParam &&
                    (node.cancelScheduledValues(0), (node.value = 0)),
                Tone.prototype.connect.call(
                  this,
                  node,
                  outputNumber,
                  inputNumber
                ),
                this
              );
            }),
            Tone.SignalBase
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.WaveShaper = function(mapping, bufferLen) {
              (this._shaper = this.input = this.output = this.context.createWaveShaper()),
                (this._curve = null),
                Array.isArray(mapping)
                  ? (this.curve = mapping)
                  : isFinite(mapping) || this.isUndef(mapping)
                  ? (this._curve = new Float32Array(
                      this.defaultArg(mapping, 1024)
                    ))
                  : this.isFunction(mapping) &&
                    ((this._curve = new Float32Array(
                      this.defaultArg(bufferLen, 1024)
                    )),
                    this.setMap(mapping));
            }),
            Tone.extend(Tone.WaveShaper, Tone.SignalBase),
            (Tone.WaveShaper.prototype.setMap = function(mapping) {
              for (var i = 0, len = this._curve.length; len > i; i++) {
                var normalized = 2 * (i / (len - 1)) - 1;
                this._curve[i] = mapping(normalized, i);
              }
              return (this._shaper.curve = this._curve), this;
            }),
            Object.defineProperty(Tone.WaveShaper.prototype, "curve", {
              get: function() {
                return this._shaper.curve;
              },
              set: function(mapping) {
                (this._curve = new Float32Array(mapping)),
                  (this._shaper.curve = this._curve);
              }
            }),
            Object.defineProperty(Tone.WaveShaper.prototype, "oversample", {
              get: function() {
                return this._shaper.oversample;
              },
              set: function(oversampling) {
                if (-1 === ["none", "2x", "4x"].indexOf(oversampling))
                  throw new RangeError(
                    "Tone.WaveShaper: oversampling must be either 'none', '2x', or '4x'"
                  );
                this._shaper.oversample = oversampling;
              }
            }),
            (Tone.WaveShaper.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._shaper.disconnect(),
                (this._shaper = null),
                (this._curve = null),
                this
              );
            }),
            Tone.WaveShaper
          );
        }),
        Module(function(Tone) {
          /**
           *  @class Tone.TimeBase is a flexible encoding of time
           *         which can be evaluated to and from a string.
           *         Parsing code modified from https://code.google.com/p/tapdigit/
           *         Copyright 2011 2012 Ariya Hidayat, New BSD License
           *  @extends {Tone}
           *  @param  {Time}  val    The time value as a number or string
           *  @param  {String=}  units  Unit values
           *  @example
           * Tone.TimeBase(4, "n")
           * Tone.TimeBase(2, "t")
           * Tone.TimeBase("2t").add("1m")
           * Tone.TimeBase("2t + 1m");
           */
          return (
            (Tone.TimeBase = function(val, units) {
              if (!(this instanceof Tone.TimeBase))
                return new Tone.TimeBase(val, units);
              if (
                ((this._expr = this._noOp),
                (units = this.defaultArg(units, this._defaultUnits)),
                this.isString(val))
              )
                this._expr = this._parseExprString(val);
              else if (this.isNumber(val)) {
                var method = this._primaryExpressions[units].method;
                this._expr = method.bind(this, val);
              } else
                this.isUndef(val)
                  ? (this._expr = this._defaultExpr())
                  : val instanceof Tone.TimeBase && (this._expr = val._expr);
            }),
            Tone.extend(Tone.TimeBase),
            (Tone.TimeBase.prototype.set = function(exprString) {
              return (this._expr = this._parseExprString(exprString)), this;
            }),
            (Tone.TimeBase.prototype._primaryExpressions = {
              n: {
                regexp: /^(\d+)n/i,
                method: function(value) {
                  return (
                    (value = parseInt(value)),
                    1 === value
                      ? this._beatsToUnits(this._timeSignature())
                      : this._beatsToUnits(4 / value)
                  );
                }
              },
              t: {
                regexp: /^(\d+)t/i,
                method: function(value) {
                  return (
                    (value = parseInt(value)),
                    this._beatsToUnits(8 / (3 * parseInt(value)))
                  );
                }
              },
              m: {
                regexp: /^(\d+)m/i,
                method: function(value) {
                  return this._beatsToUnits(
                    parseInt(value) * this._timeSignature()
                  );
                }
              },
              i: {
                regexp: /^(\d+)i/i,
                method: function(value) {
                  return this._ticksToUnits(parseInt(value));
                }
              },
              hz: {
                regexp: /^(\d+(?:\.\d+)?)hz/i,
                method: function(value) {
                  return this._frequencyToUnits(parseFloat(value));
                }
              },
              tr: {
                regexp: /^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?):?(\d+(?:\.\d+)?)?/,
                method: function(m, q, s) {
                  var total = 0;
                  return (
                    m &&
                      "0" !== m &&
                      (total += this._beatsToUnits(
                        this._timeSignature() * parseFloat(m)
                      )),
                    q &&
                      "0" !== q &&
                      (total += this._beatsToUnits(parseFloat(q))),
                    s &&
                      "0" !== s &&
                      (total += this._beatsToUnits(parseFloat(s) / 4)),
                    total
                  );
                }
              },
              s: {
                regexp: /^(\d+(?:\.\d+)?s)/,
                method: function(value) {
                  return this._secondsToUnits(parseFloat(value));
                }
              },
              samples: {
                regexp: /^(\d+)samples/,
                method: function(value) {
                  return parseInt(value) / this.context.sampleRate;
                }
              },
              default: {
                regexp: /^(\d+(?:\.\d+)?)/,
                method: function(value) {
                  return this._primaryExpressions[
                    this._defaultUnits
                  ].method.call(this, value);
                }
              }
            }),
            (Tone.TimeBase.prototype._binaryExpressions = {
              "+": {
                regexp: /^\+/,
                precedence: 2,
                method: function(lh, rh) {
                  return lh() + rh();
                }
              },
              "-": {
                regexp: /^\-/,
                precedence: 2,
                method: function(lh, rh) {
                  return lh() - rh();
                }
              },
              "*": {
                regexp: /^\*/,
                precedence: 1,
                method: function(lh, rh) {
                  return lh() * rh();
                }
              },
              "/": {
                regexp: /^\//,
                precedence: 1,
                method: function(lh, rh) {
                  return lh() / rh();
                }
              }
            }),
            (Tone.TimeBase.prototype._unaryExpressions = {
              neg: {
                regexp: /^\-/,
                method: function(lh) {
                  return -lh();
                }
              }
            }),
            (Tone.TimeBase.prototype._syntaxGlue = {
              "(": { regexp: /^\(/ },
              ")": { regexp: /^\)/ }
            }),
            (Tone.TimeBase.prototype._tokenize = function(expr) {
              function getNextToken(expr, context) {
                for (
                  var expressions = [
                      "_binaryExpressions",
                      "_unaryExpressions",
                      "_primaryExpressions",
                      "_syntaxGlue"
                    ],
                    i = 0;
                  i < expressions.length;
                  i++
                ) {
                  var group = context[expressions[i]];
                  for (var opName in group) {
                    var op = group[opName],
                      reg = op.regexp,
                      match = expr.match(reg);
                    if (null !== match)
                      return {
                        method: op.method,
                        precedence: op.precedence,
                        regexp: op.regexp,
                        value: match[0]
                      };
                  }
                }
                throw new SyntaxError(
                  "Tone.TimeBase: Unexpected token " + expr
                );
              }
              for (var position = -1, tokens = []; expr.length > 0; ) {
                expr = expr.trim();
                var token = getNextToken(expr, this);
                tokens.push(token), (expr = expr.substr(token.value.length));
              }
              return {
                next: function() {
                  return tokens[++position];
                },
                peek: function() {
                  return tokens[position + 1];
                }
              };
            }),
            (Tone.TimeBase.prototype._matchGroup = function(
              token,
              group,
              prec
            ) {
              var ret = !1;
              if (!this.isUndef(token))
                for (var opName in group) {
                  var op = group[opName];
                  if (op.regexp.test(token.value)) {
                    if (this.isUndef(prec)) return op;
                    if (op.precedence === prec) return op;
                  }
                }
              return ret;
            }),
            (Tone.TimeBase.prototype._parseBinary = function(
              lexer,
              precedence
            ) {
              this.isUndef(precedence) && (precedence = 2);
              var expr;
              expr =
                0 > precedence
                  ? this._parseUnary(lexer)
                  : this._parseBinary(lexer, precedence - 1);
              for (
                var token = lexer.peek();
                token &&
                this._matchGroup(token, this._binaryExpressions, precedence);

              )
                (token = lexer.next()),
                  (expr = token.method.bind(
                    this,
                    expr,
                    this._parseBinary(lexer, precedence - 1)
                  )),
                  (token = lexer.peek());
              return expr;
            }),
            (Tone.TimeBase.prototype._parseUnary = function(lexer) {
              var token, expr;
              token = lexer.peek();
              var op = this._matchGroup(token, this._unaryExpressions);
              return op
                ? ((token = lexer.next()),
                  (expr = this._parseUnary(lexer)),
                  op.method.bind(this, expr))
                : this._parsePrimary(lexer);
            }),
            (Tone.TimeBase.prototype._parsePrimary = function(lexer) {
              var token, expr;
              if (((token = lexer.peek()), this.isUndef(token)))
                throw new SyntaxError(
                  "Tone.TimeBase: Unexpected end of expression"
                );
              if (this._matchGroup(token, this._primaryExpressions)) {
                token = lexer.next();
                var matching = token.value.match(token.regexp);
                return token.method.bind(
                  this,
                  matching[1],
                  matching[2],
                  matching[3]
                );
              }
              if (token && "(" === token.value) {
                if (
                  (lexer.next(),
                  (expr = this._parseBinary(lexer)),
                  (token = lexer.next()),
                  !token || ")" !== token.value)
                )
                  throw new SyntaxError("Expected )");
                return expr;
              }
              throw new SyntaxError(
                "Tone.TimeBase: Cannot process token " + token.value
              );
            }),
            (Tone.TimeBase.prototype._parseExprString = function(exprString) {
              var lexer = this._tokenize(exprString),
                tree = this._parseBinary(lexer);
              return tree;
            }),
            (Tone.TimeBase.prototype._noOp = function() {
              return 0;
            }),
            (Tone.TimeBase.prototype._defaultExpr = function() {
              return this._noOp;
            }),
            (Tone.TimeBase.prototype._defaultUnits = "s"),
            (Tone.TimeBase.prototype._frequencyToUnits = function(freq) {
              return 1 / freq;
            }),
            (Tone.TimeBase.prototype._beatsToUnits = function(beats) {
              return (60 / Tone.Transport.bpm.value) * beats;
            }),
            (Tone.TimeBase.prototype._secondsToUnits = function(seconds) {
              return seconds;
            }),
            (Tone.TimeBase.prototype._ticksToUnits = function(ticks) {
              return ticks * (this._beatsToUnits(1) / Tone.Transport.PPQ);
            }),
            (Tone.TimeBase.prototype._timeSignature = function() {
              return Tone.Transport.timeSignature;
            }),
            (Tone.TimeBase.prototype._pushExpr = function(val, name, units) {
              return (
                val instanceof Tone.TimeBase ||
                  (val = new Tone.TimeBase(val, units)),
                (this._expr = this._binaryExpressions[name].method.bind(
                  this,
                  this._expr,
                  val._expr
                )),
                this
              );
            }),
            (Tone.TimeBase.prototype.add = function(val, units) {
              return this._pushExpr(val, "+", units);
            }),
            (Tone.TimeBase.prototype.sub = function(val, units) {
              return this._pushExpr(val, "-", units);
            }),
            (Tone.TimeBase.prototype.mult = function(val, units) {
              return this._pushExpr(val, "*", units);
            }),
            (Tone.TimeBase.prototype.div = function(val, units) {
              return this._pushExpr(val, "/", units);
            }),
            (Tone.TimeBase.prototype.eval = function() {
              return this._expr();
            }),
            (Tone.TimeBase.prototype.dispose = function() {
              this._expr = null;
            }),
            Tone.TimeBase
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Time = function(val, units) {
              return this instanceof Tone.Time
                ? ((this._plusNow = !1),
                  Tone.TimeBase.call(this, val, units),
                  void 0)
                : new Tone.Time(val, units);
            }),
            Tone.extend(Tone.Time, Tone.TimeBase),
            (Tone.Time.prototype._unaryExpressions = Object.create(
              Tone.TimeBase.prototype._unaryExpressions
            )),
            (Tone.Time.prototype._unaryExpressions.quantize = {
              regexp: /^@/,
              method: function(rh) {
                return Tone.Transport.nextSubdivision(rh());
              }
            }),
            (Tone.Time.prototype._unaryExpressions.now = {
              regexp: /^\+/,
              method: function(lh) {
                return (this._plusNow = !0), lh();
              }
            }),
            (Tone.Time.prototype.quantize = function(subdiv, percent) {
              return (
                (percent = this.defaultArg(percent, 1)),
                (this._expr = function(expr, subdivision, percent) {
                  (expr = expr()), (subdivision = subdivision.toSeconds());
                  var multiple = Math.round(expr / subdivision),
                    ideal = multiple * subdivision,
                    diff = ideal - expr;
                  return expr + diff * percent;
                }.bind(
                  this,
                  this._expr,
                  new this.constructor(subdiv),
                  percent
                )),
                this
              );
            }),
            (Tone.Time.prototype.addNow = function() {
              return (this._plusNow = !0), this;
            }),
            (Tone.Time.prototype._defaultExpr = function() {
              return (this._plusNow = !0), this._noOp;
            }),
            (Tone.Time.prototype.toNotation = function() {
              var time = this.toSeconds(),
                testNotations = [
                  "1m",
                  "2n",
                  "4n",
                  "8n",
                  "16n",
                  "32n",
                  "64n",
                  "128n"
                ],
                retNotation = this._toNotationHelper(time, testNotations),
                testTripletNotations = [
                  "1m",
                  "2n",
                  "2t",
                  "4n",
                  "4t",
                  "8n",
                  "8t",
                  "16n",
                  "16t",
                  "32n",
                  "32t",
                  "64n",
                  "64t",
                  "128n"
                ],
                retTripletNotation = this._toNotationHelper(
                  time,
                  testTripletNotations
                );
              return retTripletNotation.split("+").length <
                retNotation.split("+").length
                ? retTripletNotation
                : retNotation;
            }),
            (Tone.Time.prototype._toNotationHelper = function(
              units,
              testNotations
            ) {
              for (
                var threshold = this._notationToUnits(
                    testNotations[testNotations.length - 1]
                  ),
                  retNotation = "",
                  i = 0;
                i < testNotations.length;
                i++
              ) {
                var notationTime = this._notationToUnits(testNotations[i]),
                  multiple = units / notationTime,
                  floatingPointError = 1e-6;
                if (
                  (floatingPointError > 1 - (multiple % 1) &&
                    (multiple += floatingPointError),
                  (multiple = Math.floor(multiple)),
                  multiple > 0)
                ) {
                  if (
                    ((retNotation +=
                      1 === multiple
                        ? testNotations[i]
                        : multiple.toString() + "*" + testNotations[i]),
                    (units -= multiple * notationTime),
                    threshold > units)
                  )
                    break;
                  retNotation += " + ";
                }
              }
              return "" === retNotation && (retNotation = "0"), retNotation;
            }),
            (Tone.Time.prototype._notationToUnits = function(notation) {
              for (
                var primaryExprs = this._primaryExpressions,
                  notationExprs = [
                    primaryExprs.n,
                    primaryExprs.t,
                    primaryExprs.m
                  ],
                  i = 0;
                i < notationExprs.length;
                i++
              ) {
                var expr = notationExprs[i],
                  match = notation.match(expr.regexp);
                if (match) return expr.method.call(this, match[1]);
              }
            }),
            (Tone.Time.prototype.toBarsBeatsSixteenths = function() {
              var quarterTime = this._beatsToUnits(1),
                quarters = this.toSeconds() / quarterTime,
                measures = Math.floor(quarters / this._timeSignature()),
                sixteenths = 4 * (quarters % 1);
              (quarters = Math.floor(quarters) % this._timeSignature()),
                (sixteenths = sixteenths.toString()),
                sixteenths.length > 3 &&
                  (sixteenths = parseFloat(sixteenths).toFixed(3));
              var progress = [measures, quarters, sixteenths];
              return progress.join(":");
            }),
            (Tone.Time.prototype.toTicks = function() {
              var quarterTime = this._beatsToUnits(1),
                quarters = this.eval() / quarterTime;
              return Math.floor(quarters * Tone.Transport.PPQ);
            }),
            (Tone.Time.prototype.toSamples = function() {
              return this.toSeconds() * this.context.sampleRate;
            }),
            (Tone.Time.prototype.toFrequency = function() {
              return 1 / this.eval();
            }),
            (Tone.Time.prototype.toSeconds = function() {
              return this._expr();
            }),
            (Tone.Time.prototype.eval = function() {
              var val = this._expr();
              return val + (this._plusNow ? this.now() : 0);
            }),
            Tone.Time
          );
        }),
        Module(function(Tone) {
          (Tone.Frequency = function(val, units) {
            return this instanceof Tone.Frequency
              ? (Tone.TimeBase.call(this, val, units), void 0)
              : new Tone.Frequency(val, units);
          }),
            Tone.extend(Tone.Frequency, Tone.TimeBase),
            (Tone.Frequency.prototype._primaryExpressions = Object.create(
              Tone.TimeBase.prototype._primaryExpressions
            )),
            (Tone.Frequency.prototype._primaryExpressions.midi = {
              regexp: /^(\d+(?:\.\d+)?midi)/,
              method: function(value) {
                return this.midiToFrequency(value);
              }
            }),
            (Tone.Frequency.prototype._primaryExpressions.note = {
              regexp: /^([a-g]{1}(?:b|#|x|bb)?)(-?[0-9]+)/i,
              method: function(pitch, octave) {
                var index = noteToScaleIndex[pitch.toLowerCase()],
                  noteNumber = index + 12 * (parseInt(octave) + 1);
                return this.midiToFrequency(noteNumber);
              }
            }),
            (Tone.Frequency.prototype._primaryExpressions.tr = {
              regexp: /^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?):?(\d+(?:\.\d+)?)?/,
              method: function(m, q, s) {
                var total = 1;
                return (
                  m &&
                    "0" !== m &&
                    (total *= this._beatsToUnits(
                      this._timeSignature() * parseFloat(m)
                    )),
                  q &&
                    "0" !== q &&
                    (total *= this._beatsToUnits(parseFloat(q))),
                  s &&
                    "0" !== s &&
                    (total *= this._beatsToUnits(parseFloat(s) / 4)),
                  total
                );
              }
            }),
            (Tone.Frequency.prototype.transpose = function(interval) {
              return (
                (this._expr = function(expr, interval) {
                  var val = expr();
                  return val * this.intervalToFrequencyRatio(interval);
                }.bind(this, this._expr, interval)),
                this
              );
            }),
            (Tone.Frequency.prototype.harmonize = function(intervals) {
              return (
                (this._expr = function(expr, intervals) {
                  for (
                    var val = expr(), ret = [], i = 0;
                    i < intervals.length;
                    i++
                  )
                    ret[i] = val * this.intervalToFrequencyRatio(intervals[i]);
                  return ret;
                }.bind(this, this._expr, intervals)),
                this
              );
            }),
            (Tone.Frequency.prototype.toMidi = function() {
              return this.frequencyToMidi(this.eval());
            }),
            (Tone.Frequency.prototype.toNote = function() {
              var freq = this.eval(),
                log = Math.log(freq / Tone.Frequency.A4) / Math.LN2,
                noteNumber = Math.round(12 * log) + 57,
                octave = Math.floor(noteNumber / 12);
              0 > octave && (noteNumber += -12 * octave);
              var noteName = scaleIndexToNote[noteNumber % 12];
              return noteName + octave.toString();
            }),
            (Tone.Frequency.prototype.toSeconds = function() {
              return 1 / this.eval();
            }),
            (Tone.Frequency.prototype.toTicks = function() {
              var quarterTime = this._beatsToUnits(1),
                quarters = this.eval() / quarterTime;
              return Math.floor(quarters * Tone.Transport.PPQ);
            }),
            (Tone.Frequency.prototype._frequencyToUnits = function(freq) {
              return freq;
            }),
            (Tone.Frequency.prototype._ticksToUnits = function(ticks) {
              return (
                1 /
                ((60 * ticks) / (Tone.Transport.bpm.value * Tone.Transport.PPQ))
              );
            }),
            (Tone.Frequency.prototype._beatsToUnits = function(beats) {
              return (
                1 / Tone.TimeBase.prototype._beatsToUnits.call(this, beats)
              );
            }),
            (Tone.Frequency.prototype._secondsToUnits = function(seconds) {
              return 1 / seconds;
            }),
            (Tone.Frequency.prototype._defaultUnits = "hz");
          var noteToScaleIndex = {
              cbb: -2,
              cb: -1,
              c: 0,
              "c#": 1,
              cx: 2,
              dbb: 0,
              db: 1,
              d: 2,
              "d#": 3,
              dx: 4,
              ebb: 2,
              eb: 3,
              e: 4,
              "e#": 5,
              ex: 6,
              fbb: 3,
              fb: 4,
              f: 5,
              "f#": 6,
              fx: 7,
              gbb: 5,
              gb: 6,
              g: 7,
              "g#": 8,
              gx: 9,
              abb: 7,
              ab: 8,
              a: 9,
              "a#": 10,
              ax: 11,
              bbb: 9,
              bb: 10,
              b: 11,
              "b#": 12,
              bx: 13
            },
            scaleIndexToNote = [
              "C",
              "C#",
              "D",
              "D#",
              "E",
              "F",
              "F#",
              "G",
              "G#",
              "A",
              "A#",
              "B"
            ];
          return (
            (Tone.Frequency.A4 = 440),
            (Tone.Frequency.prototype.midiToFrequency = function(midi) {
              return Tone.Frequency.A4 * Math.pow(2, (midi - 69) / 12);
            }),
            (Tone.Frequency.prototype.frequencyToMidi = function(frequency) {
              return (
                69 + (12 * Math.log(frequency / Tone.Frequency.A4)) / Math.LN2
              );
            }),
            Tone.Frequency
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.TransportTime = function(val, units) {
              return this instanceof Tone.TransportTime
                ? (Tone.Time.call(this, val, units), void 0)
                : new Tone.TransportTime(val, units);
            }),
            Tone.extend(Tone.TransportTime, Tone.Time),
            (Tone.TransportTime.prototype._unaryExpressions = Object.create(
              Tone.Time.prototype._unaryExpressions
            )),
            (Tone.TransportTime.prototype._unaryExpressions.quantize = {
              regexp: /^@/,
              method: function(rh) {
                var subdivision = this._secondsToTicks(rh()),
                  multiple = Math.ceil(Tone.Transport.ticks / subdivision);
                return this._ticksToUnits(multiple * subdivision);
              }
            }),
            (Tone.TransportTime.prototype._secondsToTicks = function(seconds) {
              var quarterTime = this._beatsToUnits(1),
                quarters = seconds / quarterTime;
              return Math.round(quarters * Tone.Transport.PPQ);
            }),
            (Tone.TransportTime.prototype.eval = function() {
              var val = this._secondsToTicks(this._expr());
              return val + (this._plusNow ? Tone.Transport.ticks : 0);
            }),
            (Tone.TransportTime.prototype.toTicks = function() {
              return this.eval();
            }),
            (Tone.TransportTime.prototype.toFrequency = function() {
              return 1 / this.toSeconds();
            }),
            Tone.TransportTime
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Type = {
              Default: "number",
              Time: "time",
              Frequency: "frequency",
              TransportTime: "transportTime",
              Ticks: "ticks",
              NormalRange: "normalRange",
              AudioRange: "audioRange",
              Decibels: "db",
              Interval: "interval",
              BPM: "bpm",
              Positive: "positive",
              Cents: "cents",
              Degrees: "degrees",
              MIDI: "midi",
              BarsBeatsSixteenths: "barsBeatsSixteenths",
              Samples: "samples",
              Hertz: "hertz",
              Note: "note",
              Milliseconds: "milliseconds",
              Seconds: "seconds",
              Notation: "notation"
            }),
            (Tone.prototype.toSeconds = function(time) {
              return this.isNumber(time)
                ? time
                : this.isString(time) || this.isUndef(time)
                ? new Tone.Time(time).eval()
                : time instanceof Tone.TransportTime
                ? time.toSeconds()
                : time instanceof Tone.Time
                ? time.eval()
                : time instanceof Tone.Frequency
                ? time.toSeconds()
                : void 0;
            }),
            (Tone.prototype.toFrequency = function(freq) {
              return this.isNumber(freq)
                ? freq
                : this.isString(freq) || this.isUndef(freq)
                ? new Tone.Frequency(freq).eval()
                : freq instanceof Tone.Frequency
                ? freq.eval()
                : freq instanceof Tone.Time
                ? freq.toFrequency()
                : void 0;
            }),
            (Tone.prototype.toTicks = function(time) {
              return this.isNumber(time) ||
                this.isString(time) ||
                this.isUndef(time)
                ? new Tone.TransportTime(time).eval()
                : time instanceof Tone.Frequency
                ? time.toTicks()
                : time instanceof Tone.TransportTime
                ? time.eval()
                : time instanceof Tone.Time
                ? time.toTicks()
                : void 0;
            }),
            Tone
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Param = function() {
              var options = this.optionsObject(
                arguments,
                ["param", "units", "convert"],
                Tone.Param.defaults
              );
              (this._param = this.input = options.param),
                (this.units = options.units),
                (this.convert = options.convert),
                (this.overridden = !1),
                this.isUndef(options.value) || (this.value = options.value);
            }),
            Tone.extend(Tone.Param),
            (Tone.Param.defaults = {
              units: Tone.Type.Default,
              convert: !0,
              param: void 0
            }),
            Object.defineProperty(Tone.Param.prototype, "value", {
              get: function() {
                return this._toUnits(this._param.value);
              },
              set: function(value) {
                var convertedVal = this._fromUnits(value);
                this._param.cancelScheduledValues(0),
                  (this._param.value = convertedVal);
              }
            }),
            (Tone.Param.prototype._fromUnits = function(val) {
              if (!this.convert && !this.isUndef(this.convert)) return val;
              switch (this.units) {
                case Tone.Type.Time:
                  return this.toSeconds(val);
                case Tone.Type.Frequency:
                  return this.toFrequency(val);
                case Tone.Type.Decibels:
                  return this.dbToGain(val);
                case Tone.Type.NormalRange:
                  return Math.min(Math.max(val, 0), 1);
                case Tone.Type.AudioRange:
                  return Math.min(Math.max(val, -1), 1);
                case Tone.Type.Positive:
                  return Math.max(val, 0);
                default:
                  return val;
              }
            }),
            (Tone.Param.prototype._toUnits = function(val) {
              if (!this.convert && !this.isUndef(this.convert)) return val;
              switch (this.units) {
                case Tone.Type.Decibels:
                  return this.gainToDb(val);
                default:
                  return val;
              }
            }),
            (Tone.Param.prototype._minOutput = 1e-5),
            (Tone.Param.prototype.setValueAtTime = function(value, time) {
              return (
                (value = this._fromUnits(value)),
                this._param.setValueAtTime(value, this.toSeconds(time)),
                this
              );
            }),
            (Tone.Param.prototype.setRampPoint = function(now) {
              now = this.defaultArg(now, this.now());
              var currentVal = this._param.value;
              return (
                0 === currentVal && (currentVal = this._minOutput),
                this._param.setValueAtTime(currentVal, now),
                this
              );
            }),
            (Tone.Param.prototype.linearRampToValueAtTime = function(
              value,
              endTime
            ) {
              return (
                (value = this._fromUnits(value)),
                this._param.linearRampToValueAtTime(
                  value,
                  this.toSeconds(endTime)
                ),
                this
              );
            }),
            (Tone.Param.prototype.exponentialRampToValueAtTime = function(
              value,
              endTime
            ) {
              return (
                (value = this._fromUnits(value)),
                (value = Math.max(this._minOutput, value)),
                this._param.exponentialRampToValueAtTime(
                  value,
                  this.toSeconds(endTime)
                ),
                this
              );
            }),
            (Tone.Param.prototype.exponentialRampToValue = function(
              value,
              rampTime,
              startTime
            ) {
              return (
                (startTime = this.toSeconds(startTime)),
                this.setRampPoint(startTime),
                this.exponentialRampToValueAtTime(
                  value,
                  startTime + this.toSeconds(rampTime)
                ),
                this
              );
            }),
            (Tone.Param.prototype.linearRampToValue = function(
              value,
              rampTime,
              startTime
            ) {
              return (
                (startTime = this.toSeconds(startTime)),
                this.setRampPoint(startTime),
                this.linearRampToValueAtTime(
                  value,
                  startTime + this.toSeconds(rampTime)
                ),
                this
              );
            }),
            (Tone.Param.prototype.setTargetAtTime = function(
              value,
              startTime,
              timeConstant
            ) {
              return (
                (value = this._fromUnits(value)),
                (value = Math.max(this._minOutput, value)),
                (timeConstant = Math.max(this._minOutput, timeConstant)),
                this._param.setTargetAtTime(
                  value,
                  this.toSeconds(startTime),
                  timeConstant
                ),
                this
              );
            }),
            (Tone.Param.prototype.setValueCurveAtTime = function(
              values,
              startTime,
              duration
            ) {
              for (var i = 0; i < values.length; i++)
                values[i] = this._fromUnits(values[i]);
              return (
                this._param.setValueCurveAtTime(
                  values,
                  this.toSeconds(startTime),
                  this.toSeconds(duration)
                ),
                this
              );
            }),
            (Tone.Param.prototype.cancelScheduledValues = function(startTime) {
              return (
                this._param.cancelScheduledValues(this.toSeconds(startTime)),
                this
              );
            }),
            (Tone.Param.prototype.rampTo = function(
              value,
              rampTime,
              startTime
            ) {
              return (
                (rampTime = this.defaultArg(rampTime, 0)),
                this.units === Tone.Type.Frequency ||
                this.units === Tone.Type.BPM ||
                this.units === Tone.Type.Decibels
                  ? this.exponentialRampToValue(value, rampTime, startTime)
                  : this.linearRampToValue(value, rampTime, startTime),
                this
              );
            }),
            (Tone.Param.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this), (this._param = null), this
              );
            }),
            Tone.Param
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Gain = function() {
              var options = this.optionsObject(
                arguments,
                ["gain", "units"],
                Tone.Gain.defaults
              );
              (this.input = this.output = this._gainNode = this.context.createGain()),
                (this.gain = new Tone.Param({
                  param: this._gainNode.gain,
                  units: options.units,
                  value: options.gain,
                  convert: options.convert
                })),
                this._readOnly("gain");
            }),
            Tone.extend(Tone.Gain),
            (Tone.Gain.defaults = { gain: 1, convert: !0 }),
            (Tone.Gain.prototype.dispose = function() {
              Tone.Param.prototype.dispose.call(this),
                this._gainNode.disconnect(),
                (this._gainNode = null),
                this._writable("gain"),
                this.gain.dispose(),
                (this.gain = null);
            }),
            Tone.Gain
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Signal = function() {
              var options = this.optionsObject(
                arguments,
                ["value", "units"],
                Tone.Signal.defaults
              );
              (this.output = this._gain = this.context.createGain()),
                (options.param = this._gain.gain),
                Tone.Param.call(this, options),
                (this.input = this._param = this._gain.gain),
                Tone.Signal._constant.chain(this._gain);
            }),
            Tone.extend(Tone.Signal, Tone.Param),
            (Tone.Signal.defaults = {
              value: 0,
              units: Tone.Type.Default,
              convert: !0
            }),
            (Tone.Signal.prototype.connect = Tone.SignalBase.prototype.connect),
            (Tone.Signal.prototype.dispose = function() {
              return (
                Tone.Param.prototype.dispose.call(this),
                (this._param = null),
                this._gain.disconnect(),
                console.log("disc"),
                Tone.Signal._constant.disconnect(this._gain),
                (this._gain = null),
                this
              );
            }),
            (Tone.Signal._constant = null),
            Tone._initAudioContext(function(audioContext) {
              for (
                var buffer = audioContext.createBuffer(
                    1,
                    128,
                    audioContext.sampleRate
                  ),
                  arr = buffer.getChannelData(0),
                  i = 0;
                i < arr.length;
                i++
              )
                arr[i] = 1;
              (Tone.Signal._constant = audioContext.createBufferSource()),
                (Tone.Signal._constant.channelCount = 1),
                (Tone.Signal._constant.channelCountMode = "explicit"),
                (Tone.Signal._constant.buffer = buffer),
                (Tone.Signal._constant.loop = !0),
                Tone.Signal._constant.start(0),
                Tone.Signal._constant.noGC();
            }),
            Tone.Signal
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Timeline = function() {
              var options = this.optionsObject(
                arguments,
                ["memory"],
                Tone.Timeline.defaults
              );
              (this._timeline = []),
                (this._toRemove = []),
                (this._iterating = !1),
                (this.memory = options.memory);
            }),
            Tone.extend(Tone.Timeline),
            (Tone.Timeline.defaults = { memory: 1 / 0 }),
            Object.defineProperty(Tone.Timeline.prototype, "length", {
              get: function() {
                return this._timeline.length;
              }
            }),
            (Tone.Timeline.prototype.addEvent = function(event) {
              if (this.isUndef(event.time))
                throw new Error(
                  "Tone.Timeline: events must have a time attribute"
                );
              if (
                ((event.time = this.toSeconds(event.time)),
                this._timeline.length)
              ) {
                var index = this._search(event.time);
                this._timeline.splice(index + 1, 0, event);
              } else this._timeline.push(event);
              if (this.length > this.memory) {
                var diff = this.length - this.memory;
                this._timeline.splice(0, diff);
              }
              return this;
            }),
            (Tone.Timeline.prototype.removeEvent = function(event) {
              if (this._iterating) this._toRemove.push(event);
              else {
                var index = this._timeline.indexOf(event);
                -1 !== index && this._timeline.splice(index, 1);
              }
              return this;
            }),
            (Tone.Timeline.prototype.getEvent = function(time) {
              time = this.toSeconds(time);
              var index = this._search(time);
              return -1 !== index ? this._timeline[index] : null;
            }),
            (Tone.Timeline.prototype.getEventAfter = function(time) {
              time = this.toSeconds(time);
              var index = this._search(time);
              return index + 1 < this._timeline.length
                ? this._timeline[index + 1]
                : null;
            }),
            (Tone.Timeline.prototype.getEventBefore = function(time) {
              time = this.toSeconds(time);
              var len = this._timeline.length;
              if (len > 0 && this._timeline[len - 1].time < time)
                return this._timeline[len - 1];
              var index = this._search(time);
              return index - 1 >= 0 ? this._timeline[index - 1] : null;
            }),
            (Tone.Timeline.prototype.cancel = function(after) {
              if (this._timeline.length > 1) {
                after = this.toSeconds(after);
                var index = this._search(after);
                if (index >= 0)
                  if (this._timeline[index].time === after) {
                    for (
                      var i = index;
                      i >= 0 && this._timeline[i].time === after;
                      i--
                    )
                      index = i;
                    this._timeline = this._timeline.slice(0, index);
                  } else this._timeline = this._timeline.slice(0, index + 1);
                else this._timeline = [];
              } else
                1 === this._timeline.length &&
                  this._timeline[0].time >= after &&
                  (this._timeline = []);
              return this;
            }),
            (Tone.Timeline.prototype.cancelBefore = function(time) {
              if (this._timeline.length) {
                time = this.toSeconds(time);
                var index = this._search(time);
                index >= 0 &&
                  (this._timeline = this._timeline.slice(index + 1));
              }
              return this;
            }),
            (Tone.Timeline.prototype._search = function(time) {
              var beginning = 0,
                len = this._timeline.length,
                end = len;
              if (len > 0 && this._timeline[len - 1].time <= time)
                return len - 1;
              for (; end > beginning; ) {
                var midPoint = Math.floor(beginning + (end - beginning) / 2),
                  event = this._timeline[midPoint],
                  nextEvent = this._timeline[midPoint + 1];
                if (event.time === time) {
                  for (var i = midPoint; i < this._timeline.length; i++) {
                    var testEvent = this._timeline[i];
                    testEvent.time === time && (midPoint = i);
                  }
                  return midPoint;
                }
                if (event.time < time && nextEvent.time > time) return midPoint;
                event.time > time
                  ? (end = midPoint)
                  : event.time < time && (beginning = midPoint + 1);
              }
              return -1;
            }),
            (Tone.Timeline.prototype._iterate = function(
              callback,
              lowerBound,
              upperBound
            ) {
              (this._iterating = !0),
                (lowerBound = this.defaultArg(lowerBound, 0)),
                (upperBound = this.defaultArg(
                  upperBound,
                  this._timeline.length - 1
                ));
              for (var i = lowerBound; upperBound >= i; i++)
                callback(this._timeline[i]);
              if (((this._iterating = !1), this._toRemove.length > 0)) {
                for (var j = 0; j < this._toRemove.length; j++) {
                  var index = this._timeline.indexOf(this._toRemove[j]);
                  -1 !== index && this._timeline.splice(index, 1);
                }
                this._toRemove = [];
              }
            }),
            (Tone.Timeline.prototype.forEach = function(callback) {
              return this._iterate(callback), this;
            }),
            (Tone.Timeline.prototype.forEachBefore = function(time, callback) {
              time = this.toSeconds(time);
              var upperBound = this._search(time);
              return (
                -1 !== upperBound && this._iterate(callback, 0, upperBound),
                this
              );
            }),
            (Tone.Timeline.prototype.forEachAfter = function(time, callback) {
              time = this.toSeconds(time);
              var lowerBound = this._search(time);
              return this._iterate(callback, lowerBound + 1), this;
            }),
            (Tone.Timeline.prototype.forEachFrom = function(time, callback) {
              time = this.toSeconds(time);
              for (
                var lowerBound = this._search(time);
                lowerBound >= 0 && this._timeline[lowerBound].time >= time;

              )
                lowerBound--;
              return this._iterate(callback, lowerBound + 1), this;
            }),
            (Tone.Timeline.prototype.forEachAtTime = function(time, callback) {
              time = this.toSeconds(time);
              var upperBound = this._search(time);
              return (
                -1 !== upperBound &&
                  this._iterate(
                    function(event) {
                      event.time === time && callback(event);
                    },
                    0,
                    upperBound
                  ),
                this
              );
            }),
            (Tone.Timeline.prototype.dispose = function() {
              Tone.prototype.dispose.call(this),
                (this._timeline = null),
                (this._toRemove = null);
            }),
            Tone.Timeline
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.TimelineSignal = function() {
              var options = this.optionsObject(
                arguments,
                ["value", "units"],
                Tone.Signal.defaults
              );
              (this._events = new Tone.Timeline(10)),
                Tone.Signal.apply(this, options),
                (options.param = this._param),
                Tone.Param.call(this, options),
                (this._initial = this._fromUnits(this._param.value));
            }),
            Tone.extend(Tone.TimelineSignal, Tone.Param),
            (Tone.TimelineSignal.Type = {
              Linear: "linear",
              Exponential: "exponential",
              Target: "target",
              Curve: "curve",
              Set: "set"
            }),
            Object.defineProperty(Tone.TimelineSignal.prototype, "value", {
              get: function() {
                var now = this.now(),
                  val = this.getValueAtTime(now);
                return this._toUnits(val);
              },
              set: function(value) {
                var convertedVal = this._fromUnits(value);
                (this._initial = convertedVal),
                  this.cancelScheduledValues(),
                  (this._param.value = convertedVal);
              }
            }),
            (Tone.TimelineSignal.prototype.setValueAtTime = function(
              value,
              startTime
            ) {
              return (
                (value = this._fromUnits(value)),
                (startTime = this.toSeconds(startTime)),
                this._events.addEvent({
                  type: Tone.TimelineSignal.Type.Set,
                  value: value,
                  time: startTime
                }),
                this._param.setValueAtTime(value, startTime),
                this
              );
            }),
            (Tone.TimelineSignal.prototype.linearRampToValueAtTime = function(
              value,
              endTime
            ) {
              return (
                (value = this._fromUnits(value)),
                (endTime = this.toSeconds(endTime)),
                this._events.addEvent({
                  type: Tone.TimelineSignal.Type.Linear,
                  value: value,
                  time: endTime
                }),
                this._param.linearRampToValueAtTime(value, endTime),
                this
              );
            }),
            (Tone.TimelineSignal.prototype.exponentialRampToValueAtTime = function(
              value,
              endTime
            ) {
              var beforeEvent = this._searchBefore(endTime);
              beforeEvent &&
                0 === beforeEvent.value &&
                this.setValueAtTime(this._minOutput, beforeEvent.time),
                (value = this._fromUnits(value));
              var setValue = Math.max(value, this._minOutput);
              return (
                (endTime = this.toSeconds(endTime)),
                this._events.addEvent({
                  type: Tone.TimelineSignal.Type.Exponential,
                  value: setValue,
                  time: endTime
                }),
                value < this._minOutput
                  ? (this._param.exponentialRampToValueAtTime(
                      this._minOutput,
                      endTime - this.sampleTime
                    ),
                    this.setValueAtTime(0, endTime))
                  : this._param.exponentialRampToValueAtTime(value, endTime),
                this
              );
            }),
            (Tone.TimelineSignal.prototype.setTargetAtTime = function(
              value,
              startTime,
              timeConstant
            ) {
              return (
                (value = this._fromUnits(value)),
                (value = Math.max(this._minOutput, value)),
                (timeConstant = Math.max(this._minOutput, timeConstant)),
                (startTime = this.toSeconds(startTime)),
                this._events.addEvent({
                  type: Tone.TimelineSignal.Type.Target,
                  value: value,
                  time: startTime,
                  constant: timeConstant
                }),
                this._param.setTargetAtTime(value, startTime, timeConstant),
                this
              );
            }),
            (Tone.TimelineSignal.prototype.setValueCurveAtTime = function(
              values,
              startTime,
              duration,
              scaling
            ) {
              scaling = this.defaultArg(scaling, 1);
              for (
                var floats = new Array(values.length), i = 0;
                i < floats.length;
                i++
              )
                floats[i] = this._fromUnits(values[i]) * scaling;
              (startTime = this.toSeconds(startTime)),
                (duration = this.toSeconds(duration)),
                this._events.addEvent({
                  type: Tone.TimelineSignal.Type.Curve,
                  value: floats,
                  time: startTime,
                  duration: duration
                }),
                this._param.setValueAtTime(floats[0], startTime);
              for (var j = 1; j < floats.length; j++) {
                var segmentTime =
                  startTime + (j / (floats.length - 1)) * duration;
                this._param.linearRampToValueAtTime(floats[j], segmentTime);
              }
              return this;
            }),
            (Tone.TimelineSignal.prototype.cancelScheduledValues = function(
              after
            ) {
              return (
                this._events.cancel(after),
                this._param.cancelScheduledValues(this.toSeconds(after)),
                this
              );
            }),
            (Tone.TimelineSignal.prototype.setRampPoint = function(time) {
              time = this.toSeconds(time);
              var val = this._toUnits(this.getValueAtTime(time)),
                before = this._searchBefore(time);
              if (before && before.time === time)
                this.cancelScheduledValues(time + this.sampleTime);
              else if (
                before &&
                before.type === Tone.TimelineSignal.Type.Curve &&
                before.time + before.duration > time
              )
                this.cancelScheduledValues(time),
                  this.linearRampToValueAtTime(val, time);
              else {
                var after = this._searchAfter(time);
                after &&
                  (this.cancelScheduledValues(time),
                  after.type === Tone.TimelineSignal.Type.Linear
                    ? this.linearRampToValueAtTime(val, time)
                    : after.type === Tone.TimelineSignal.Type.Exponential &&
                      this.exponentialRampToValueAtTime(val, time)),
                  this.setValueAtTime(val, time);
              }
              return this;
            }),
            (Tone.TimelineSignal.prototype.linearRampToValueBetween = function(
              value,
              start,
              finish
            ) {
              return (
                this.setRampPoint(start),
                this.linearRampToValueAtTime(value, finish),
                this
              );
            }),
            (Tone.TimelineSignal.prototype.exponentialRampToValueBetween = function(
              value,
              start,
              finish
            ) {
              return (
                this.setRampPoint(start),
                this.exponentialRampToValueAtTime(value, finish),
                this
              );
            }),
            (Tone.TimelineSignal.prototype._searchBefore = function(time) {
              return this._events.getEvent(time);
            }),
            (Tone.TimelineSignal.prototype._searchAfter = function(time) {
              return this._events.getEventAfter(time);
            }),
            (Tone.TimelineSignal.prototype.getValueAtTime = function(time) {
              var after = this._searchAfter(time),
                before = this._searchBefore(time),
                value = this._initial;
              if (null === before) value = this._initial;
              else if (before.type === Tone.TimelineSignal.Type.Target) {
                var previouVal,
                  previous = this._events.getEventBefore(before.time);
                (previouVal =
                  null === previous ? this._initial : previous.value),
                  (value = this._exponentialApproach(
                    before.time,
                    previouVal,
                    before.value,
                    before.constant,
                    time
                  ));
              } else
                value =
                  before.type === Tone.TimelineSignal.Type.Curve
                    ? this._curveInterpolate(
                        before.time,
                        before.value,
                        before.duration,
                        time
                      )
                    : null === after
                    ? before.value
                    : after.type === Tone.TimelineSignal.Type.Linear
                    ? this._linearInterpolate(
                        before.time,
                        before.value,
                        after.time,
                        after.value,
                        time
                      )
                    : after.type === Tone.TimelineSignal.Type.Exponential
                    ? this._exponentialInterpolate(
                        before.time,
                        before.value,
                        after.time,
                        after.value,
                        time
                      )
                    : before.value;
              return value;
            }),
            (Tone.TimelineSignal.prototype.connect =
              Tone.SignalBase.prototype.connect), //	MIT License, copyright (c) 2014 Jordan Santell
            (Tone.TimelineSignal.prototype._exponentialApproach = function(
              t0,
              v0,
              v1,
              timeConstant,
              t
            ) {
              return v1 + (v0 - v1) * Math.exp(-(t - t0) / timeConstant);
            }),
            (Tone.TimelineSignal.prototype._linearInterpolate = function(
              t0,
              v0,
              t1,
              v1,
              t
            ) {
              return v0 + (v1 - v0) * ((t - t0) / (t1 - t0));
            }),
            (Tone.TimelineSignal.prototype._exponentialInterpolate = function(
              t0,
              v0,
              t1,
              v1,
              t
            ) {
              return (
                (v0 = Math.max(this._minOutput, v0)),
                v0 * Math.pow(v1 / v0, (t - t0) / (t1 - t0))
              );
            }),
            (Tone.TimelineSignal.prototype._curveInterpolate = function(
              start,
              curve,
              duration,
              time
            ) {
              var len = curve.length;
              if (time >= start + duration) return curve[len - 1];
              if (start >= time) return curve[0];
              var progress = (time - start) / duration,
                lowerIndex = Math.floor((len - 1) * progress),
                upperIndex = Math.ceil((len - 1) * progress),
                lowerVal = curve[lowerIndex],
                upperVal = curve[upperIndex];
              return upperIndex === lowerIndex
                ? lowerVal
                : this._linearInterpolate(
                    lowerIndex,
                    lowerVal,
                    upperIndex,
                    upperVal,
                    progress * (len - 1)
                  );
            }),
            (Tone.TimelineSignal.prototype.dispose = function() {
              Tone.Signal.prototype.dispose.call(this),
                Tone.Param.prototype.dispose.call(this),
                this._events.dispose(),
                (this._events = null);
            }),
            Tone.TimelineSignal
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Pow = function(exp) {
              (this._exp = this.defaultArg(exp, 1)),
                (this._expScaler = this.input = this.output = new Tone.WaveShaper(
                  this._expFunc(this._exp),
                  8192
                ));
            }),
            Tone.extend(Tone.Pow, Tone.SignalBase),
            Object.defineProperty(Tone.Pow.prototype, "value", {
              get: function() {
                return this._exp;
              },
              set: function(exp) {
                (this._exp = exp),
                  this._expScaler.setMap(this._expFunc(this._exp));
              }
            }),
            (Tone.Pow.prototype._expFunc = function(exp) {
              return function(val) {
                return Math.pow(Math.abs(val), exp);
              };
            }),
            (Tone.Pow.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._expScaler.dispose(),
                (this._expScaler = null),
                this
              );
            }),
            Tone.Pow
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Envelope = function() {
              var options = this.optionsObject(
                arguments,
                ["attack", "decay", "sustain", "release"],
                Tone.Envelope.defaults
              );
              (this.attack = options.attack),
                (this.decay = options.decay),
                (this.sustain = options.sustain),
                (this.release = options.release),
                (this._attackCurve = "linear"),
                (this._releaseCurve = "exponential"),
                (this._sig = this.output = new Tone.TimelineSignal()),
                this._sig.setValueAtTime(0, 0),
                (this.attackCurve = options.attackCurve),
                (this.releaseCurve = options.releaseCurve);
            }),
            Tone.extend(Tone.Envelope),
            (Tone.Envelope.defaults = {
              attack: 0.01,
              decay: 0.1,
              sustain: 0.5,
              release: 1,
              attackCurve: "linear",
              releaseCurve: "exponential"
            }),
            Object.defineProperty(Tone.Envelope.prototype, "value", {
              get: function() {
                return this.getValueAtTime(this.now());
              }
            }),
            Object.defineProperty(Tone.Envelope.prototype, "attackCurve", {
              get: function() {
                if (this.isString(this._attackCurve)) return this._attackCurve;
                if (this.isArray(this._attackCurve)) {
                  for (var type in Tone.Envelope.Type)
                    if (Tone.Envelope.Type[type].In === this._attackCurve)
                      return type;
                  return this._attackCurve;
                }
              },
              set: function(curve) {
                if (Tone.Envelope.Type.hasOwnProperty(curve)) {
                  var curveDef = Tone.Envelope.Type[curve];
                  this._attackCurve = this.isObject(curveDef)
                    ? curveDef.In
                    : curveDef;
                } else {
                  if (!this.isArray(curve))
                    throw new Error("Tone.Envelope: invalid curve: " + curve);
                  this._attackCurve = curve;
                }
              }
            }),
            Object.defineProperty(Tone.Envelope.prototype, "releaseCurve", {
              get: function() {
                if (this.isString(this._releaseCurve))
                  return this._releaseCurve;
                if (this.isArray(this._releaseCurve)) {
                  for (var type in Tone.Envelope.Type)
                    if (Tone.Envelope.Type[type].Out === this._releaseCurve)
                      return type;
                  return this._releaseCurve;
                }
              },
              set: function(curve) {
                if (Tone.Envelope.Type.hasOwnProperty(curve)) {
                  var curveDef = Tone.Envelope.Type[curve];
                  this._releaseCurve = this.isObject(curveDef)
                    ? curveDef.Out
                    : curveDef;
                } else {
                  if (!this.isArray(curve))
                    throw new Error("Tone.Envelope: invalid curve: " + curve);
                  this._releaseCurve = curve;
                }
              }
            }),
            (Tone.Envelope.prototype.triggerAttack = function(time, velocity) {
              var now = this.now() + this.blockTime;
              time = this.toSeconds(time, now);
              var originalAttack = this.toSeconds(this.attack),
                attack = originalAttack,
                decay = this.toSeconds(this.decay);
              velocity = this.defaultArg(velocity, 1);
              var currentValue = this.getValueAtTime(time);
              if (currentValue > 0) {
                var attackRate = 1 / attack,
                  remainingDistance = 1 - currentValue;
                attack = remainingDistance / attackRate;
              }
              if ("linear" === this._attackCurve)
                this._sig.linearRampToValue(velocity, attack, time);
              else if ("exponential" === this._attackCurve)
                this._sig.exponentialRampToValue(velocity, attack, time);
              else if (attack > 0) {
                this._sig.setRampPoint(time);
                var curve = this._attackCurve;
                if (originalAttack > attack) {
                  var percentComplete = 1 - attack / originalAttack,
                    sliceIndex = Math.floor(
                      percentComplete * this._attackCurve.length
                    );
                  (curve = this._attackCurve.slice(sliceIndex)),
                    (curve[0] = currentValue);
                }
                this._sig.setValueCurveAtTime(curve, time, attack, velocity);
              }
              return (
                this._sig.exponentialRampToValue(
                  velocity * this.sustain,
                  decay,
                  attack + time
                ),
                this
              );
            }),
            (Tone.Envelope.prototype.triggerRelease = function(time) {
              var now = this.now() + this.blockTime;
              time = this.toSeconds(time, now);
              var currentValue = this.getValueAtTime(time);
              if (currentValue > 0) {
                var release = this.toSeconds(this.release);
                if ("linear" === this._releaseCurve)
                  this._sig.linearRampToValue(0, release, time);
                else if ("exponential" === this._releaseCurve)
                  this._sig.exponentialRampToValue(0, release, time);
                else {
                  var curve = this._releaseCurve;
                  this.isArray(curve) &&
                    (this._sig.setRampPoint(time),
                    this._sig.setValueCurveAtTime(
                      curve,
                      time,
                      release,
                      currentValue
                    ));
                }
              }
              return this;
            }),
            (Tone.Envelope.prototype.getValueAtTime = function(time) {
              return this._sig.getValueAtTime(time);
            }),
            (Tone.Envelope.prototype.triggerAttackRelease = function(
              duration,
              time,
              velocity
            ) {
              return (
                (time = this.toSeconds(time)),
                this.triggerAttack(time, velocity),
                this.triggerRelease(time + this.toSeconds(duration)),
                this
              );
            }),
            (Tone.Envelope.prototype.cancel = function(after) {
              return this._sig.cancelScheduledValues(after), this;
            }),
            (Tone.Envelope.prototype.connect = Tone.Signal.prototype.connect),
            (function() {
              function invertCurve(curve) {
                for (
                  var out = new Array(curve.length), j = 0;
                  j < curve.length;
                  j++
                )
                  out[j] = 1 - curve[j];
                return out;
              }
              function reverseCurve(curve) {
                return curve.slice(0).reverse();
              }
              var i,
                k,
                curveLen = 128,
                cosineCurve = [];
              for (i = 0; curveLen > i; i++)
                cosineCurve[i] = Math.sin((i / (curveLen - 1)) * (Math.PI / 2));
              var rippleCurve = [],
                rippleCurveFreq = 6.4;
              for (i = 0; curveLen - 1 > i; i++) {
                k = i / (curveLen - 1);
                var sineWave =
                  Math.sin(k * 2 * Math.PI * rippleCurveFreq - Math.PI / 2) + 1;
                rippleCurve[i] = sineWave / 10 + 0.83 * k;
              }
              rippleCurve[curveLen - 1] = 1;
              var stairsCurve = [],
                steps = 5;
              for (i = 0; curveLen > i; i++)
                stairsCurve[i] =
                  Math.ceil((i / (curveLen - 1)) * steps) / steps;
              var sineCurve = [];
              for (i = 0; curveLen > i; i++)
                (k = i / (curveLen - 1)),
                  (sineCurve[i] = 0.5 * (1 - Math.cos(Math.PI * k)));
              var bounceCurve = [];
              for (i = 0; curveLen > i; i++) {
                k = i / (curveLen - 1);
                var freq = 4 * Math.pow(k, 3) + 0.2,
                  val = Math.cos(2 * freq * Math.PI * k);
                bounceCurve[i] = Math.abs(val * (1 - k));
              }
              Tone.Envelope.Type = {
                linear: "linear",
                exponential: "exponential",
                bounce: { In: invertCurve(bounceCurve), Out: bounceCurve },
                cosine: { In: cosineCurve, Out: reverseCurve(cosineCurve) },
                step: { In: stairsCurve, Out: invertCurve(stairsCurve) },
                ripple: { In: rippleCurve, Out: invertCurve(rippleCurve) },
                sine: { In: sineCurve, Out: invertCurve(sineCurve) }
              };
            })(),
            (Tone.Envelope.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._sig.dispose(),
                (this._sig = null),
                (this._attackCurve = null),
                (this._releaseCurve = null),
                this
              );
            }),
            Tone.Envelope
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.AmplitudeEnvelope = function() {
              Tone.Envelope.apply(this, arguments),
                (this.input = this.output = new Tone.Gain()),
                this._sig.connect(this.output.gain);
            }),
            Tone.extend(Tone.AmplitudeEnvelope, Tone.Envelope),
            (Tone.AmplitudeEnvelope.prototype.dispose = function() {
              return (
                this.input.dispose(),
                (this.input = null),
                Tone.Envelope.prototype.dispose.call(this),
                this
              );
            }),
            Tone.AmplitudeEnvelope
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Analyser = function() {
              var options = this.optionsObject(
                arguments,
                ["type", "size"],
                Tone.Analyser.defaults
              );
              (this._analyser = this.input = this.output = this.context.createAnalyser()),
                (this._type = options.type),
                (this._returnType = options.returnType),
                (this._buffer = null),
                (this.size = options.size),
                (this.type = options.type),
                (this.returnType = options.returnType),
                (this.minDecibels = options.minDecibels),
                (this.maxDecibels = options.maxDecibels);
            }),
            Tone.extend(Tone.Analyser),
            (Tone.Analyser.defaults = {
              size: 1024,
              returnType: "byte",
              type: "fft",
              smoothing: 0.8,
              maxDecibels: -30,
              minDecibels: -100
            }),
            (Tone.Analyser.Type = { Waveform: "waveform", FFT: "fft" }),
            (Tone.Analyser.ReturnType = { Byte: "byte", Float: "float" }),
            (Tone.Analyser.prototype.analyse = function() {
              if (this._type === Tone.Analyser.Type.FFT)
                this._returnType === Tone.Analyser.ReturnType.Byte
                  ? this._analyser.getByteFrequencyData(this._buffer)
                  : this._analyser.getFloatFrequencyData(this._buffer);
              else if (this._type === Tone.Analyser.Type.Waveform)
                if (this._returnType === Tone.Analyser.ReturnType.Byte)
                  this._analyser.getByteTimeDomainData(this._buffer);
                else if (
                  this.isFunction(AnalyserNode.prototype.getFloatTimeDomainData)
                )
                  this._analyser.getFloatTimeDomainData(this._buffer);
                else {
                  var uint8 = new Uint8Array(this._buffer.length);
                  this._analyser.getByteTimeDomainData(uint8);
                  for (var i = 0; i < uint8.length; i++)
                    this._buffer[i] = 0.0078125 * (uint8[i] - 128);
                }
              return this._buffer;
            }),
            Object.defineProperty(Tone.Analyser.prototype, "size", {
              get: function() {
                return this._analyser.frequencyBinCount;
              },
              set: function(size) {
                (this._analyser.fftSize = 2 * size), (this.type = this._type);
              }
            }),
            Object.defineProperty(Tone.Analyser.prototype, "returnType", {
              get: function() {
                return this._returnType;
              },
              set: function(type) {
                if (type === Tone.Analyser.ReturnType.Byte)
                  this._buffer = new Uint8Array(
                    this._analyser.frequencyBinCount
                  );
                else {
                  if (type !== Tone.Analyser.ReturnType.Float)
                    throw new TypeError(
                      "Tone.Analayser: invalid return type: " + type
                    );
                  this._buffer = new Float32Array(
                    this._analyser.frequencyBinCount
                  );
                }
                this._returnType = type;
              }
            }),
            Object.defineProperty(Tone.Analyser.prototype, "type", {
              get: function() {
                return this._type;
              },
              set: function(type) {
                if (
                  type !== Tone.Analyser.Type.Waveform &&
                  type !== Tone.Analyser.Type.FFT
                )
                  throw new TypeError("Tone.Analyser: invalid type: " + type);
                this._type = type;
              }
            }),
            Object.defineProperty(Tone.Analyser.prototype, "smoothing", {
              get: function() {
                return this._analyser.smoothingTimeConstant;
              },
              set: function(val) {
                this._analyser.smoothingTimeConstant = val;
              }
            }),
            Object.defineProperty(Tone.Analyser.prototype, "minDecibels", {
              get: function() {
                return this._analyser.minDecibels;
              },
              set: function(val) {
                this._analyser.minDecibels = val;
              }
            }),
            Object.defineProperty(Tone.Analyser.prototype, "maxDecibels", {
              get: function() {
                return this._analyser.maxDecibels;
              },
              set: function(val) {
                this._analyser.maxDecibels = val;
              }
            }),
            (Tone.Analyser.prototype.dispose = function() {
              Tone.prototype.dispose.call(this),
                this._analyser.disconnect(),
                (this._analyser = null),
                (this._buffer = null);
            }),
            Tone.Analyser
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Compressor = function() {
              var options = this.optionsObject(
                arguments,
                ["threshold", "ratio"],
                Tone.Compressor.defaults
              );
              (this._compressor = this.input = this.output = this.context.createDynamicsCompressor()),
                (this.threshold = this._compressor.threshold),
                (this.attack = new Tone.Param(
                  this._compressor.attack,
                  Tone.Type.Time
                )),
                (this.release = new Tone.Param(
                  this._compressor.release,
                  Tone.Type.Time
                )),
                (this.knee = this._compressor.knee),
                (this.ratio = this._compressor.ratio),
                this._readOnly([
                  "knee",
                  "release",
                  "attack",
                  "ratio",
                  "threshold"
                ]),
                this.set(options);
            }),
            Tone.extend(Tone.Compressor),
            (Tone.Compressor.defaults = {
              ratio: 12,
              threshold: -24,
              release: 0.25,
              attack: 0.003,
              knee: 30
            }),
            (Tone.Compressor.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._writable([
                  "knee",
                  "release",
                  "attack",
                  "ratio",
                  "threshold"
                ]),
                this._compressor.disconnect(),
                (this._compressor = null),
                this.attack.dispose(),
                (this.attack = null),
                this.release.dispose(),
                (this.release = null),
                (this.threshold = null),
                (this.ratio = null),
                (this.knee = null),
                this
              );
            }),
            Tone.Compressor
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Add = function(value) {
              Tone.call(this, 2, 0),
                (this._sum = this.input[0] = this.input[1] = this.output = this.context.createGain()),
                (this._param = this.input[1] = new Tone.Signal(value)),
                this._param.connect(this._sum);
            }),
            Tone.extend(Tone.Add, Tone.Signal),
            (Tone.Add.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._sum.disconnect(),
                (this._sum = null),
                this._param.dispose(),
                (this._param = null),
                this
              );
            }),
            Tone.Add
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Multiply = function(value) {
              Tone.call(this, 2, 0),
                (this._mult = this.input[0] = this.output = this.context.createGain()),
                (this._param = this.input[1] = this.output.gain),
                (this._param.value = this.defaultArg(value, 0));
            }),
            Tone.extend(Tone.Multiply, Tone.Signal),
            (Tone.Multiply.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._mult.disconnect(),
                (this._mult = null),
                (this._param = null),
                this
              );
            }),
            Tone.Multiply
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Negate = function() {
              this._multiply = this.input = this.output = new Tone.Multiply(-1);
            }),
            Tone.extend(Tone.Negate, Tone.SignalBase),
            (Tone.Negate.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._multiply.dispose(),
                (this._multiply = null),
                this
              );
            }),
            Tone.Negate
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Subtract = function(value) {
              Tone.call(this, 2, 0),
                (this._sum = this.input[0] = this.output = this.context.createGain()),
                (this._neg = new Tone.Negate()),
                (this._param = this.input[1] = new Tone.Signal(value)),
                this._param.chain(this._neg, this._sum);
            }),
            Tone.extend(Tone.Subtract, Tone.Signal),
            (Tone.Subtract.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._neg.dispose(),
                (this._neg = null),
                this._sum.disconnect(),
                (this._sum = null),
                this._param.dispose(),
                (this._param = null),
                this
              );
            }),
            Tone.Subtract
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.GreaterThanZero = function() {
              (this._thresh = this.output = new Tone.WaveShaper(function(val) {
                return 0 >= val ? 0 : 1;
              }, 127)),
                (this._scale = this.input = new Tone.Multiply(1e4)),
                this._scale.connect(this._thresh);
            }),
            Tone.extend(Tone.GreaterThanZero, Tone.SignalBase),
            (Tone.GreaterThanZero.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._scale.dispose(),
                (this._scale = null),
                this._thresh.dispose(),
                (this._thresh = null),
                this
              );
            }),
            Tone.GreaterThanZero
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.GreaterThan = function(value) {
              Tone.call(this, 2, 0),
                (this._param = this.input[0] = new Tone.Subtract(value)),
                (this.input[1] = this._param.input[1]),
                (this._gtz = this.output = new Tone.GreaterThanZero()),
                this._param.connect(this._gtz);
            }),
            Tone.extend(Tone.GreaterThan, Tone.Signal),
            (Tone.GreaterThan.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._param.dispose(),
                (this._param = null),
                this._gtz.dispose(),
                (this._gtz = null),
                this
              );
            }),
            Tone.GreaterThan
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Abs = function() {
              Tone.call(this, 1, 0),
                (this._abs = this.input = this.output = new Tone.WaveShaper(
                  function(val) {
                    return 0 === val ? 0 : Math.abs(val);
                  },
                  127
                ));
            }),
            Tone.extend(Tone.Abs, Tone.SignalBase),
            (Tone.Abs.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._abs.dispose(),
                (this._abs = null),
                this
              );
            }),
            Tone.Abs
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Modulo = function(modulus) {
              Tone.call(this, 1, 1),
                (this._shaper = new Tone.WaveShaper(Math.pow(2, 16))),
                (this._multiply = new Tone.Multiply()),
                (this._subtract = this.output = new Tone.Subtract()),
                (this._modSignal = new Tone.Signal(modulus)),
                this.input.fan(this._shaper, this._subtract),
                this._modSignal.connect(this._multiply, 0, 0),
                this._shaper.connect(this._multiply, 0, 1),
                this._multiply.connect(this._subtract, 0, 1),
                this._setWaveShaper(modulus);
            }),
            Tone.extend(Tone.Modulo, Tone.SignalBase),
            (Tone.Modulo.prototype._setWaveShaper = function(mod) {
              this._shaper.setMap(function(val) {
                var multiple = Math.floor((val + 1e-4) / mod);
                return multiple;
              });
            }),
            Object.defineProperty(Tone.Modulo.prototype, "value", {
              get: function() {
                return this._modSignal.value;
              },
              set: function(mod) {
                (this._modSignal.value = mod), this._setWaveShaper(mod);
              }
            }),
            (Tone.Modulo.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._shaper.dispose(),
                (this._shaper = null),
                this._multiply.dispose(),
                (this._multiply = null),
                this._subtract.dispose(),
                (this._subtract = null),
                this._modSignal.dispose(),
                (this._modSignal = null),
                this
              );
            }),
            Tone.Modulo
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.AudioToGain = function() {
              this._norm = this.input = this.output = new Tone.WaveShaper(
                function(x) {
                  return (x + 1) / 2;
                }
              );
            }),
            Tone.extend(Tone.AudioToGain, Tone.SignalBase),
            (Tone.AudioToGain.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._norm.dispose(),
                (this._norm = null),
                this
              );
            }),
            Tone.AudioToGain
          );
        }),
        Module(function(Tone) {
          function applyBinary(Constructor, args, self) {
            var op = new Constructor();
            return (
              self._eval(args[0]).connect(op, 0, 0),
              self._eval(args[1]).connect(op, 0, 1),
              op
            );
          }
          function applyUnary(Constructor, args, self) {
            var op = new Constructor();
            return self._eval(args[0]).connect(op, 0, 0), op;
          }
          function getNumber(arg) {
            return arg ? parseFloat(arg) : void 0;
          }
          function literalNumber(arg) {
            return arg && arg.args ? parseFloat(arg.args) : void 0;
          }
          /**
           *  @class Evaluate an expression at audio rate. <br><br>
           *         Parsing code modified from https://code.google.com/p/tapdigit/
           *         Copyright 2011 2012 Ariya Hidayat, New BSD License
           *
           *  @extends {Tone.SignalBase}
           *  @constructor
           *  @param {string} expr the expression to generate
           *  @example
           * //adds the signals from input[0] and input[1].
           * var expr = new Tone.Expr("$0 + $1");
           */
          return (
            (Tone.Expr = function() {
              var expr = this._replacements(
                  Array.prototype.slice.call(arguments)
                ),
                inputCount = this._parseInputs(expr);
              (this._nodes = []), (this.input = new Array(inputCount));
              for (var i = 0; inputCount > i; i++)
                this.input[i] = this.context.createGain();
              var result,
                tree = this._parseTree(expr);
              try {
                result = this._eval(tree);
              } catch (e) {
                throw (this._disposeNodes(),
                new Error("Tone.Expr: Could evaluate expression: " + expr));
              }
              this.output = result;
            }),
            Tone.extend(Tone.Expr, Tone.SignalBase),
            (Tone.Expr._Expressions = {
              value: {
                signal: {
                  regexp: /^\d+\.\d+|^\d+/,
                  method: function(arg) {
                    var sig = new Tone.Signal(getNumber(arg));
                    return sig;
                  }
                },
                input: {
                  regexp: /^\$\d/,
                  method: function(arg, self) {
                    return self.input[getNumber(arg.substr(1))];
                  }
                }
              },
              glue: {
                "(": { regexp: /^\(/ },
                ")": { regexp: /^\)/ },
                ",": { regexp: /^,/ }
              },
              func: {
                abs: {
                  regexp: /^abs/,
                  method: applyUnary.bind(this, Tone.Abs)
                },
                mod: {
                  regexp: /^mod/,
                  method: function(args, self) {
                    var modulus = literalNumber(args[1]),
                      op = new Tone.Modulo(modulus);
                    return self._eval(args[0]).connect(op), op;
                  }
                },
                pow: {
                  regexp: /^pow/,
                  method: function(args, self) {
                    var exp = literalNumber(args[1]),
                      op = new Tone.Pow(exp);
                    return self._eval(args[0]).connect(op), op;
                  }
                },
                a2g: {
                  regexp: /^a2g/,
                  method: function(args, self) {
                    var op = new Tone.AudioToGain();
                    return self._eval(args[0]).connect(op), op;
                  }
                }
              },
              binary: {
                "+": {
                  regexp: /^\+/,
                  precedence: 1,
                  method: applyBinary.bind(this, Tone.Add)
                },
                "-": {
                  regexp: /^\-/,
                  precedence: 1,
                  method: function(args, self) {
                    return 1 === args.length
                      ? applyUnary(Tone.Negate, args, self)
                      : applyBinary(Tone.Subtract, args, self);
                  }
                },
                "*": {
                  regexp: /^\*/,
                  precedence: 0,
                  method: applyBinary.bind(this, Tone.Multiply)
                }
              },
              unary: {
                "-": {
                  regexp: /^\-/,
                  method: applyUnary.bind(this, Tone.Negate)
                },
                "!": { regexp: /^\!/, method: applyUnary.bind(this, Tone.NOT) }
              }
            }),
            (Tone.Expr.prototype._parseInputs = function(expr) {
              var inputArray = expr.match(/\$\d/g),
                inputMax = 0;
              if (null !== inputArray)
                for (var i = 0; i < inputArray.length; i++) {
                  var inputNum = parseInt(inputArray[i].substr(1)) + 1;
                  inputMax = Math.max(inputMax, inputNum);
                }
              return inputMax;
            }),
            (Tone.Expr.prototype._replacements = function(args) {
              for (var expr = args.shift(), i = 0; i < args.length; i++)
                expr = expr.replace(/\%/i, args[i]);
              return expr;
            }),
            (Tone.Expr.prototype._tokenize = function(expr) {
              function getNextToken(expr) {
                for (var type in Tone.Expr._Expressions) {
                  var group = Tone.Expr._Expressions[type];
                  for (var opName in group) {
                    var op = group[opName],
                      reg = op.regexp,
                      match = expr.match(reg);
                    if (null !== match)
                      return { type: type, value: match[0], method: op.method };
                  }
                }
                throw new SyntaxError("Tone.Expr: Unexpected token " + expr);
              }
              for (var position = -1, tokens = []; expr.length > 0; ) {
                expr = expr.trim();
                var token = getNextToken(expr);
                tokens.push(token), (expr = expr.substr(token.value.length));
              }
              return {
                next: function() {
                  return tokens[++position];
                },
                peek: function() {
                  return tokens[position + 1];
                }
              };
            }),
            (Tone.Expr.prototype._parseTree = function(expr) {
              function matchSyntax(token, syn) {
                return (
                  !isUndef(token) &&
                  "glue" === token.type &&
                  token.value === syn
                );
              }
              function matchGroup(token, groupName, prec) {
                var ret = !1,
                  group = Tone.Expr._Expressions[groupName];
                if (!isUndef(token))
                  for (var opName in group) {
                    var op = group[opName];
                    if (op.regexp.test(token.value)) {
                      if (isUndef(prec)) return !0;
                      if (op.precedence === prec) return !0;
                    }
                  }
                return ret;
              }
              function parseExpression(precedence) {
                isUndef(precedence) && (precedence = 5);
                var expr;
                expr =
                  0 > precedence
                    ? parseUnary()
                    : parseExpression(precedence - 1);
                for (
                  var token = lexer.peek();
                  matchGroup(token, "binary", precedence);

                )
                  (token = lexer.next()),
                    (expr = {
                      operator: token.value,
                      method: token.method,
                      args: [expr, parseExpression(precedence - 1)]
                    }),
                    (token = lexer.peek());
                return expr;
              }
              function parseUnary() {
                var token, expr;
                return (
                  (token = lexer.peek()),
                  matchGroup(token, "unary")
                    ? ((token = lexer.next()),
                      (expr = parseUnary()),
                      {
                        operator: token.value,
                        method: token.method,
                        args: [expr]
                      })
                    : parsePrimary()
                );
              }
              function parsePrimary() {
                var token, expr;
                if (((token = lexer.peek()), isUndef(token)))
                  throw new SyntaxError(
                    "Tone.Expr: Unexpected termination of expression"
                  );
                if ("func" === token.type)
                  return (token = lexer.next()), parseFunctionCall(token);
                if ("value" === token.type)
                  return (
                    (token = lexer.next()),
                    { method: token.method, args: token.value }
                  );
                if (matchSyntax(token, "(")) {
                  if (
                    (lexer.next(),
                    (expr = parseExpression()),
                    (token = lexer.next()),
                    !matchSyntax(token, ")"))
                  )
                    throw new SyntaxError("Expected )");
                  return expr;
                }
                throw new SyntaxError(
                  "Tone.Expr: Parse error, cannot process token " + token.value
                );
              }
              function parseFunctionCall(func) {
                var token,
                  args = [];
                if (((token = lexer.next()), !matchSyntax(token, "(")))
                  throw new SyntaxError(
                    'Tone.Expr: Expected ( in a function call "' +
                      func.value +
                      '"'
                  );
                if (
                  ((token = lexer.peek()),
                  matchSyntax(token, ")") || (args = parseArgumentList()),
                  (token = lexer.next()),
                  !matchSyntax(token, ")"))
                )
                  throw new SyntaxError(
                    'Tone.Expr: Expected ) in a function call "' +
                      func.value +
                      '"'
                  );
                return { method: func.method, args: args, name: name };
              }
              function parseArgumentList() {
                for (var token, expr, args = []; ; ) {
                  if (((expr = parseExpression()), isUndef(expr))) break;
                  if (
                    (args.push(expr),
                    (token = lexer.peek()),
                    !matchSyntax(token, ","))
                  )
                    break;
                  lexer.next();
                }
                return args;
              }
              var lexer = this._tokenize(expr),
                isUndef = this.isUndef.bind(this);
              return parseExpression();
            }),
            (Tone.Expr.prototype._eval = function(tree) {
              if (!this.isUndef(tree)) {
                var node = tree.method(tree.args, this);
                return this._nodes.push(node), node;
              }
            }),
            (Tone.Expr.prototype._disposeNodes = function() {
              for (var i = 0; i < this._nodes.length; i++) {
                var node = this._nodes[i];
                this.isFunction(node.dispose)
                  ? node.dispose()
                  : this.isFunction(node.disconnect) && node.disconnect(),
                  (node = null),
                  (this._nodes[i] = null);
              }
              this._nodes = null;
            }),
            (Tone.Expr.prototype.dispose = function() {
              Tone.prototype.dispose.call(this), this._disposeNodes();
            }),
            Tone.Expr
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.EqualPowerGain = function() {
              this._eqPower = this.input = this.output = new Tone.WaveShaper(
                function(val) {
                  return Math.abs(val) < 0.001 ? 0 : this.equalPowerScale(val);
                }.bind(this),
                4096
              );
            }),
            Tone.extend(Tone.EqualPowerGain, Tone.SignalBase),
            (Tone.EqualPowerGain.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._eqPower.dispose(),
                (this._eqPower = null),
                this
              );
            }),
            Tone.EqualPowerGain
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.CrossFade = function(initialFade) {
              Tone.call(this, 2, 1),
                (this.a = this.input[0] = this.context.createGain()),
                (this.b = this.input[1] = this.context.createGain()),
                (this.fade = new Tone.Signal(
                  this.defaultArg(initialFade, 0.5),
                  Tone.Type.NormalRange
                )),
                (this._equalPowerA = new Tone.EqualPowerGain()),
                (this._equalPowerB = new Tone.EqualPowerGain()),
                (this._invert = new Tone.Expr("1 - $0")),
                this.a.connect(this.output),
                this.b.connect(this.output),
                this.fade.chain(this._equalPowerB, this.b.gain),
                this.fade.chain(this._invert, this._equalPowerA, this.a.gain),
                this._readOnly("fade");
            }),
            Tone.extend(Tone.CrossFade),
            (Tone.CrossFade.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._writable("fade"),
                this._equalPowerA.dispose(),
                (this._equalPowerA = null),
                this._equalPowerB.dispose(),
                (this._equalPowerB = null),
                this.fade.dispose(),
                (this.fade = null),
                this._invert.dispose(),
                (this._invert = null),
                this.a.disconnect(),
                (this.a = null),
                this.b.disconnect(),
                (this.b = null),
                this
              );
            }),
            Tone.CrossFade
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Filter = function() {
              Tone.call(this);
              var options = this.optionsObject(
                arguments,
                ["frequency", "type", "rolloff"],
                Tone.Filter.defaults
              );
              (this._filters = []),
                (this.frequency = new Tone.Signal(
                  options.frequency,
                  Tone.Type.Frequency
                )),
                (this.detune = new Tone.Signal(0, Tone.Type.Cents)),
                (this.gain = new Tone.Signal({
                  value: options.gain,
                  convert: !1
                })),
                (this.Q = new Tone.Signal(options.Q)),
                (this._type = options.type),
                (this._rolloff = options.rolloff),
                (this.rolloff = options.rolloff),
                this._readOnly(["detune", "frequency", "gain", "Q"]);
            }),
            Tone.extend(Tone.Filter),
            (Tone.Filter.defaults = {
              type: "lowpass",
              frequency: 350,
              rolloff: -12,
              Q: 1,
              gain: 0
            }),
            Object.defineProperty(Tone.Filter.prototype, "type", {
              get: function() {
                return this._type;
              },
              set: function(type) {
                var types = [
                  "lowpass",
                  "highpass",
                  "bandpass",
                  "lowshelf",
                  "highshelf",
                  "notch",
                  "allpass",
                  "peaking"
                ];
                if (-1 === types.indexOf(type))
                  throw new TypeError("Tone.Filter: invalid type " + type);
                this._type = type;
                for (var i = 0; i < this._filters.length; i++)
                  this._filters[i].type = type;
              }
            }),
            Object.defineProperty(Tone.Filter.prototype, "rolloff", {
              get: function() {
                return this._rolloff;
              },
              set: function(rolloff) {
                rolloff = parseInt(rolloff, 10);
                var possibilities = [-12, -24, -48, -96],
                  cascadingCount = possibilities.indexOf(rolloff);
                if (-1 === cascadingCount)
                  throw new RangeError(
                    "Tone.Filter: rolloff can only be -12, -24, -48 or -96"
                  );
                (cascadingCount += 1),
                  (this._rolloff = rolloff),
                  this.input.disconnect();
                for (var i = 0; i < this._filters.length; i++)
                  this._filters[i].disconnect(), (this._filters[i] = null);
                this._filters = new Array(cascadingCount);
                for (var count = 0; cascadingCount > count; count++) {
                  var filter = this.context.createBiquadFilter();
                  (filter.type = this._type),
                    this.frequency.connect(filter.frequency),
                    this.detune.connect(filter.detune),
                    this.Q.connect(filter.Q),
                    this.gain.connect(filter.gain),
                    (this._filters[count] = filter);
                }
                var connectionChain = [this.input]
                  .concat(this._filters)
                  .concat([this.output]);
                this.connectSeries.apply(this, connectionChain);
              }
            }),
            (Tone.Filter.prototype.dispose = function() {
              Tone.prototype.dispose.call(this);
              for (var i = 0; i < this._filters.length; i++)
                this._filters[i].disconnect(), (this._filters[i] = null);
              return (
                (this._filters = null),
                this._writable(["detune", "frequency", "gain", "Q"]),
                this.frequency.dispose(),
                this.Q.dispose(),
                (this.frequency = null),
                (this.Q = null),
                this.detune.dispose(),
                (this.detune = null),
                this.gain.dispose(),
                (this.gain = null),
                this
              );
            }),
            Tone.Filter
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.MultibandSplit = function() {
              var options = this.optionsObject(
                arguments,
                ["lowFrequency", "highFrequency"],
                Tone.MultibandSplit.defaults
              );
              (this.input = this.context.createGain()),
                (this.output = new Array(3)),
                (this.low = this.output[0] = new Tone.Filter(0, "lowpass")),
                (this._lowMidFilter = new Tone.Filter(0, "highpass")),
                (this.mid = this.output[1] = new Tone.Filter(0, "lowpass")),
                (this.high = this.output[2] = new Tone.Filter(0, "highpass")),
                (this.lowFrequency = new Tone.Signal(
                  options.lowFrequency,
                  Tone.Type.Frequency
                )),
                (this.highFrequency = new Tone.Signal(
                  options.highFrequency,
                  Tone.Type.Frequency
                )),
                (this.Q = new Tone.Signal(options.Q)),
                this.input.fan(this.low, this.high),
                this.input.chain(this._lowMidFilter, this.mid),
                this.lowFrequency.connect(this.low.frequency),
                this.lowFrequency.connect(this._lowMidFilter.frequency),
                this.highFrequency.connect(this.mid.frequency),
                this.highFrequency.connect(this.high.frequency),
                this.Q.connect(this.low.Q),
                this.Q.connect(this._lowMidFilter.Q),
                this.Q.connect(this.mid.Q),
                this.Q.connect(this.high.Q),
                this._readOnly([
                  "high",
                  "mid",
                  "low",
                  "highFrequency",
                  "lowFrequency"
                ]);
            }),
            Tone.extend(Tone.MultibandSplit),
            (Tone.MultibandSplit.defaults = {
              lowFrequency: 400,
              highFrequency: 2500,
              Q: 1
            }),
            (Tone.MultibandSplit.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._writable([
                  "high",
                  "mid",
                  "low",
                  "highFrequency",
                  "lowFrequency"
                ]),
                this.low.dispose(),
                (this.low = null),
                this._lowMidFilter.dispose(),
                (this._lowMidFilter = null),
                this.mid.dispose(),
                (this.mid = null),
                this.high.dispose(),
                (this.high = null),
                this.lowFrequency.dispose(),
                (this.lowFrequency = null),
                this.highFrequency.dispose(),
                (this.highFrequency = null),
                this.Q.dispose(),
                (this.Q = null),
                this
              );
            }),
            Tone.MultibandSplit
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.EQ3 = function() {
              var options = this.optionsObject(
                arguments,
                ["low", "mid", "high"],
                Tone.EQ3.defaults
              );
              (this.output = this.context.createGain()),
                (this._multibandSplit = this.input = new Tone.MultibandSplit({
                  lowFrequency: options.lowFrequency,
                  highFrequency: options.highFrequency
                })),
                (this._lowGain = new Tone.Gain(
                  options.low,
                  Tone.Type.Decibels
                )),
                (this._midGain = new Tone.Gain(
                  options.mid,
                  Tone.Type.Decibels
                )),
                (this._highGain = new Tone.Gain(
                  options.high,
                  Tone.Type.Decibels
                )),
                (this.low = this._lowGain.gain),
                (this.mid = this._midGain.gain),
                (this.high = this._highGain.gain),
                (this.Q = this._multibandSplit.Q),
                (this.lowFrequency = this._multibandSplit.lowFrequency),
                (this.highFrequency = this._multibandSplit.highFrequency),
                this._multibandSplit.low.chain(this._lowGain, this.output),
                this._multibandSplit.mid.chain(this._midGain, this.output),
                this._multibandSplit.high.chain(this._highGain, this.output),
                this._readOnly([
                  "low",
                  "mid",
                  "high",
                  "lowFrequency",
                  "highFrequency"
                ]);
            }),
            Tone.extend(Tone.EQ3),
            (Tone.EQ3.defaults = {
              low: 0,
              mid: 0,
              high: 0,
              lowFrequency: 400,
              highFrequency: 2500
            }),
            (Tone.EQ3.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._writable([
                  "low",
                  "mid",
                  "high",
                  "lowFrequency",
                  "highFrequency"
                ]),
                this._multibandSplit.dispose(),
                (this._multibandSplit = null),
                (this.lowFrequency = null),
                (this.highFrequency = null),
                this._lowGain.dispose(),
                (this._lowGain = null),
                this._midGain.dispose(),
                (this._midGain = null),
                this._highGain.dispose(),
                (this._highGain = null),
                (this.low = null),
                (this.mid = null),
                (this.high = null),
                (this.Q = null),
                this
              );
            }),
            Tone.EQ3
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Scale = function(outputMin, outputMax) {
              (this._outputMin = this.defaultArg(outputMin, 0)),
                (this._outputMax = this.defaultArg(outputMax, 1)),
                (this._scale = this.input = new Tone.Multiply(1)),
                (this._add = this.output = new Tone.Add(0)),
                this._scale.connect(this._add),
                this._setRange();
            }),
            Tone.extend(Tone.Scale, Tone.SignalBase),
            Object.defineProperty(Tone.Scale.prototype, "min", {
              get: function() {
                return this._outputMin;
              },
              set: function(min) {
                (this._outputMin = min), this._setRange();
              }
            }),
            Object.defineProperty(Tone.Scale.prototype, "max", {
              get: function() {
                return this._outputMax;
              },
              set: function(max) {
                (this._outputMax = max), this._setRange();
              }
            }),
            (Tone.Scale.prototype._setRange = function() {
              (this._add.value = this._outputMin),
                (this._scale.value = this._outputMax - this._outputMin);
            }),
            (Tone.Scale.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._add.dispose(),
                (this._add = null),
                this._scale.dispose(),
                (this._scale = null),
                this
              );
            }),
            Tone.Scale
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.ScaleExp = function(outputMin, outputMax, exponent) {
              (this._scale = this.output = new Tone.Scale(
                outputMin,
                outputMax
              )),
                (this._exp = this.input = new Tone.Pow(
                  this.defaultArg(exponent, 2)
                )),
                this._exp.connect(this._scale);
            }),
            Tone.extend(Tone.ScaleExp, Tone.SignalBase),
            Object.defineProperty(Tone.ScaleExp.prototype, "exponent", {
              get: function() {
                return this._exp.value;
              },
              set: function(exp) {
                this._exp.value = exp;
              }
            }),
            Object.defineProperty(Tone.ScaleExp.prototype, "min", {
              get: function() {
                return this._scale.min;
              },
              set: function(min) {
                this._scale.min = min;
              }
            }),
            Object.defineProperty(Tone.ScaleExp.prototype, "max", {
              get: function() {
                return this._scale.max;
              },
              set: function(max) {
                this._scale.max = max;
              }
            }),
            (Tone.ScaleExp.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._scale.dispose(),
                (this._scale = null),
                this._exp.dispose(),
                (this._exp = null),
                this
              );
            }),
            Tone.ScaleExp
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.FeedbackCombFilter = function() {
              Tone.call(this);
              var options = this.optionsObject(
                arguments,
                ["delayTime", "resonance"],
                Tone.FeedbackCombFilter.defaults
              );
              (this._delay = this.input = this.output = this.context.createDelay(
                1
              )),
                (this.delayTime = new Tone.Param({
                  param: this._delay.delayTime,
                  value: options.delayTime,
                  units: Tone.Type.Time
                })),
                (this._feedback = this.context.createGain()),
                (this.resonance = new Tone.Param({
                  param: this._feedback.gain,
                  value: options.resonance,
                  units: Tone.Type.NormalRange
                })),
                this._delay.chain(this._feedback, this._delay),
                this._readOnly(["resonance", "delayTime"]);
            }),
            Tone.extend(Tone.FeedbackCombFilter),
            (Tone.FeedbackCombFilter.defaults = {
              delayTime: 0.1,
              resonance: 0.5
            }),
            (Tone.FeedbackCombFilter.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._writable(["resonance", "delayTime"]),
                this._delay.disconnect(),
                (this._delay = null),
                this.delayTime.dispose(),
                (this.delayTime = null),
                this.resonance.dispose(),
                (this.resonance = null),
                this._feedback.disconnect(),
                (this._feedback = null),
                this
              );
            }),
            Tone.FeedbackCombFilter
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Follower = function() {
              Tone.call(this);
              var options = this.optionsObject(
                arguments,
                ["attack", "release"],
                Tone.Follower.defaults
              );
              (this._abs = new Tone.Abs()),
                (this._filter = this.context.createBiquadFilter()),
                (this._filter.type = "lowpass"),
                (this._filter.frequency.value = 0),
                (this._filter.Q.value = -100),
                (this._frequencyValues = new Tone.WaveShaper()),
                (this._sub = new Tone.Subtract()),
                (this._delay = this.context.createDelay()),
                (this._delay.delayTime.value = this.blockTime),
                (this._mult = new Tone.Multiply(1e4)),
                (this._attack = options.attack),
                (this._release = options.release),
                this.input.chain(this._abs, this._filter, this.output),
                this._abs.connect(this._sub, 0, 1),
                this._filter.chain(this._delay, this._sub),
                this._sub.chain(
                  this._mult,
                  this._frequencyValues,
                  this._filter.frequency
                ),
                this._setAttackRelease(this._attack, this._release);
            }),
            Tone.extend(Tone.Follower),
            (Tone.Follower.defaults = { attack: 0.05, release: 0.5 }),
            (Tone.Follower.prototype._setAttackRelease = function(
              attack,
              release
            ) {
              var minTime = this.blockTime;
              (attack = Tone.Time(attack).toFrequency()),
                (release = Tone.Time(release).toFrequency()),
                (attack = Math.max(attack, minTime)),
                (release = Math.max(release, minTime)),
                this._frequencyValues.setMap(function(val) {
                  return 0 >= val ? attack : release;
                });
            }),
            Object.defineProperty(Tone.Follower.prototype, "attack", {
              get: function() {
                return this._attack;
              },
              set: function(attack) {
                (this._attack = attack),
                  this._setAttackRelease(this._attack, this._release);
              }
            }),
            Object.defineProperty(Tone.Follower.prototype, "release", {
              get: function() {
                return this._release;
              },
              set: function(release) {
                (this._release = release),
                  this._setAttackRelease(this._attack, this._release);
              }
            }),
            (Tone.Follower.prototype.connect = Tone.Signal.prototype.connect),
            (Tone.Follower.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._filter.disconnect(),
                (this._filter = null),
                this._frequencyValues.disconnect(),
                (this._frequencyValues = null),
                this._delay.disconnect(),
                (this._delay = null),
                this._sub.disconnect(),
                (this._sub = null),
                this._abs.dispose(),
                (this._abs = null),
                this._mult.dispose(),
                (this._mult = null),
                (this._curve = null),
                this
              );
            }),
            Tone.Follower
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.ScaledEnvelope = function() {
              var options = this.optionsObject(
                arguments,
                ["attack", "decay", "sustain", "release"],
                Tone.Envelope.defaults
              );
              Tone.Envelope.call(this, options),
                (options = this.defaultArg(
                  options,
                  Tone.ScaledEnvelope.defaults
                )),
                (this._exp = this.output = new Tone.Pow(options.exponent)),
                (this._scale = this.output = new Tone.Scale(
                  options.min,
                  options.max
                )),
                this._sig.chain(this._exp, this._scale);
            }),
            Tone.extend(Tone.ScaledEnvelope, Tone.Envelope),
            (Tone.ScaledEnvelope.defaults = { min: 0, max: 1, exponent: 1 }),
            Object.defineProperty(Tone.ScaledEnvelope.prototype, "min", {
              get: function() {
                return this._scale.min;
              },
              set: function(min) {
                this._scale.min = min;
              }
            }),
            Object.defineProperty(Tone.ScaledEnvelope.prototype, "max", {
              get: function() {
                return this._scale.max;
              },
              set: function(max) {
                this._scale.max = max;
              }
            }),
            Object.defineProperty(Tone.ScaledEnvelope.prototype, "exponent", {
              get: function() {
                return this._exp.value;
              },
              set: function(exp) {
                this._exp.value = exp;
              }
            }),
            (Tone.ScaledEnvelope.prototype.dispose = function() {
              return (
                Tone.Envelope.prototype.dispose.call(this),
                this._scale.dispose(),
                (this._scale = null),
                this._exp.dispose(),
                (this._exp = null),
                this
              );
            }),
            Tone.ScaledEnvelope
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.FrequencyEnvelope = function() {
              var options = this.optionsObject(
                arguments,
                ["attack", "decay", "sustain", "release"],
                Tone.Envelope.defaults
              );
              Tone.ScaledEnvelope.call(this, options),
                (options = this.defaultArg(
                  options,
                  Tone.FrequencyEnvelope.defaults
                )),
                (this._octaves = options.octaves),
                (this.baseFrequency = options.baseFrequency),
                (this.octaves = options.octaves);
            }),
            Tone.extend(Tone.FrequencyEnvelope, Tone.Envelope),
            (Tone.FrequencyEnvelope.defaults = {
              baseFrequency: 200,
              octaves: 4,
              exponent: 2
            }),
            Object.defineProperty(
              Tone.FrequencyEnvelope.prototype,
              "baseFrequency",
              {
                get: function() {
                  return this._scale.min;
                },
                set: function(min) {
                  this._scale.min = this.toFrequency(min);
                }
              }
            ),
            Object.defineProperty(Tone.FrequencyEnvelope.prototype, "octaves", {
              get: function() {
                return this._octaves;
              },
              set: function(octaves) {
                (this._octaves = octaves),
                  (this._scale.max = this.baseFrequency * Math.pow(2, octaves));
              }
            }),
            Object.defineProperty(
              Tone.FrequencyEnvelope.prototype,
              "exponent",
              {
                get: function() {
                  return this._exp.value;
                },
                set: function(exp) {
                  this._exp.value = exp;
                }
              }
            ),
            (Tone.FrequencyEnvelope.prototype.dispose = function() {
              return Tone.ScaledEnvelope.prototype.dispose.call(this), this;
            }),
            Tone.FrequencyEnvelope
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Gate = function() {
              Tone.call(this);
              var options = this.optionsObject(
                arguments,
                ["threshold", "attack", "release"],
                Tone.Gate.defaults
              );
              (this._follower = new Tone.Follower(
                options.attack,
                options.release
              )),
                (this._gt = new Tone.GreaterThan(
                  this.dbToGain(options.threshold)
                )),
                this.input.connect(this.output),
                this.input.chain(this._gt, this._follower, this.output.gain);
            }),
            Tone.extend(Tone.Gate),
            (Tone.Gate.defaults = {
              attack: 0.1,
              release: 0.1,
              threshold: -40
            }),
            Object.defineProperty(Tone.Gate.prototype, "threshold", {
              get: function() {
                return this.gainToDb(this._gt.value);
              },
              set: function(thresh) {
                this._gt.value = this.dbToGain(thresh);
              }
            }),
            Object.defineProperty(Tone.Gate.prototype, "attack", {
              get: function() {
                return this._follower.attack;
              },
              set: function(attackTime) {
                this._follower.attack = attackTime;
              }
            }),
            Object.defineProperty(Tone.Gate.prototype, "release", {
              get: function() {
                return this._follower.release;
              },
              set: function(releaseTime) {
                this._follower.release = releaseTime;
              }
            }),
            (Tone.Gate.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._follower.dispose(),
                this._gt.dispose(),
                (this._follower = null),
                (this._gt = null),
                this
              );
            }),
            Tone.Gate
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.TimelineState = function(initial) {
              Tone.Timeline.call(this), (this._initial = initial);
            }),
            Tone.extend(Tone.TimelineState, Tone.Timeline),
            (Tone.TimelineState.prototype.getStateAtTime = function(time) {
              var event = this.getEvent(time);
              return null !== event ? event.state : this._initial;
            }),
            (Tone.TimelineState.prototype.setStateAtTime = function(
              state,
              time
            ) {
              this.addEvent({ state: state, time: this.toSeconds(time) });
            }),
            Tone.TimelineState
          );
        }),
        Module(function(Tone) {
          (Tone.Clock = function() {
            var options = this.optionsObject(
              arguments,
              ["callback", "frequency"],
              Tone.Clock.defaults
            );
            (this.callback = options.callback),
              (this._lookAhead = "auto"),
              (this._computedLookAhead = UPDATE_RATE / 1e3),
              (this._nextTick = -1),
              (this._lastUpdate = -1),
              (this._loopID = -1),
              (this.frequency = new Tone.TimelineSignal(
                options.frequency,
                Tone.Type.Frequency
              )),
              (this.ticks = 0),
              (this._state = new Tone.TimelineState(Tone.State.Stopped)),
              (this._boundLoop = this._loop.bind(this)),
              Tone.Clock._worker.addEventListener("message", this._boundLoop),
              this._readOnly("frequency");
          }),
            Tone.extend(Tone.Clock),
            (Tone.Clock.defaults = {
              callback: Tone.noOp,
              frequency: 1,
              lookAhead: "auto"
            }),
            Object.defineProperty(Tone.Clock.prototype, "state", {
              get: function() {
                return this._state.getStateAtTime(this.now());
              }
            }),
            Object.defineProperty(Tone.Clock.prototype, "lookAhead", {
              get: function() {
                return this._lookAhead;
              },
              set: function(val) {
                this._lookAhead = "auto" === val ? "auto" : this.toSeconds(val);
              }
            }),
            (Tone.Clock.prototype.start = function(time, offset) {
              return (
                (time = this.toSeconds(time)),
                this._state.getStateAtTime(time) !== Tone.State.Started &&
                  this._state.addEvent({
                    state: Tone.State.Started,
                    time: time,
                    offset: offset
                  }),
                this
              );
            }),
            (Tone.Clock.prototype.stop = function(time) {
              return (
                (time = this.toSeconds(time)),
                this._state.cancel(time),
                this._state.setStateAtTime(Tone.State.Stopped, time),
                this
              );
            }),
            (Tone.Clock.prototype.pause = function(time) {
              return (
                (time = this.toSeconds(time)),
                this._state.getStateAtTime(time) === Tone.State.Started &&
                  this._state.setStateAtTime(Tone.State.Paused, time),
                this
              );
            }),
            (Tone.Clock.prototype._loop = function() {
              if ("auto" === this._lookAhead) {
                var time = this.now();
                if (-1 !== this._lastUpdate) {
                  var diff = time - this._lastUpdate;
                  (diff = Math.min((10 * UPDATE_RATE) / 1e3, diff)),
                    (this._computedLookAhead =
                      (9 * this._computedLookAhead + diff) / 10);
                }
                this._lastUpdate = time;
              } else this._computedLookAhead = this._lookAhead;
              var now = this.now(),
                lookAhead = 2 * this._computedLookAhead,
                event = this._state.getEvent(now + lookAhead),
                state = Tone.State.Stopped;
              if (
                (event &&
                  ((state = event.state),
                  -1 === this._nextTick &&
                    state === Tone.State.Started &&
                    ((this._nextTick = event.time),
                    this.isUndef(event.offset) || (this.ticks = event.offset))),
                state === Tone.State.Started)
              )
                for (; now + lookAhead > this._nextTick; ) {
                  var tickTime = this._nextTick;
                  (this._nextTick +=
                    1 / this.frequency.getValueAtTime(this._nextTick)),
                    this.callback(tickTime),
                    this.ticks++;
                }
              else
                state === Tone.State.Stopped
                  ? ((this._nextTick = -1), (this.ticks = 0))
                  : state === Tone.State.Paused && (this._nextTick = -1);
            }),
            (Tone.Clock.prototype.getStateAtTime = function(time) {
              return this._state.getStateAtTime(time);
            }),
            (Tone.Clock.prototype.dispose = function() {
              cancelAnimationFrame(this._loopID),
                Tone.TimelineState.prototype.dispose.call(this),
                Tone.Clock._worker.removeEventListener(
                  "message",
                  this._boundLoop
                ),
                this._writable("frequency"),
                this.frequency.dispose(),
                (this.frequency = null),
                (this._boundLoop = null),
                (this._nextTick = 1 / 0),
                (this.callback = null),
                this._state.dispose(),
                (this._state = null);
            }),
            (window.URL = window.URL || window.webkitURL);
          var UPDATE_RATE = 20,
            blob = new Blob([
              "setInterval(function(){self.postMessage('tick')}, " +
                UPDATE_RATE +
                ")"
            ]),
            blobUrl = URL.createObjectURL(blob);
          return (Tone.Clock._worker = new Worker(blobUrl)), Tone.Clock;
        }),
        Module(function(Tone) {
          return (
            (Tone.Emitter = function() {
              this._events = {};
            }),
            Tone.extend(Tone.Emitter),
            (Tone.Emitter.prototype.on = function(event, callback) {
              for (
                var events = event.split(/\W+/), i = 0;
                i < events.length;
                i++
              ) {
                var eventName = events[i];
                this._events.hasOwnProperty(eventName) ||
                  (this._events[eventName] = []),
                  this._events[eventName].push(callback);
              }
              return this;
            }),
            (Tone.Emitter.prototype.off = function(event, callback) {
              for (
                var events = event.split(/\W+/), ev = 0;
                ev < events.length;
                ev++
              )
                if (((event = events[ev]), this._events.hasOwnProperty(event)))
                  if (Tone.prototype.isUndef(callback))
                    this._events[event] = [];
                  else
                    for (
                      var eventList = this._events[event], i = 0;
                      i < eventList.length;
                      i++
                    )
                      eventList[i] === callback && eventList.splice(i, 1);
              return this;
            }),
            (Tone.Emitter.prototype.trigger = function(event) {
              if (this._events) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (this._events.hasOwnProperty(event))
                  for (
                    var eventList = this._events[event],
                      i = 0,
                      len = eventList.length;
                    len > i;
                    i++
                  )
                    eventList[i].apply(this, args);
              }
              return this;
            }),
            (Tone.Emitter.mixin = function(object) {
              var functions = ["on", "off", "trigger"];
              object._events = {};
              for (var i = 0; i < functions.length; i++) {
                var func = functions[i],
                  emitterFunc = Tone.Emitter.prototype[func];
                object[func] = emitterFunc;
              }
            }),
            (Tone.Emitter.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this), (this._events = null), this
              );
            }),
            Tone.Emitter
          );
        }),
        Module(function(Tone) {
          (Tone.IntervalTimeline = function() {
            (this._root = null), (this._length = 0);
          }),
            Tone.extend(Tone.IntervalTimeline),
            (Tone.IntervalTimeline.prototype.addEvent = function(event) {
              if (this.isUndef(event.time) || this.isUndef(event.duration))
                throw new Error(
                  "Tone.IntervalTimeline: events must have time and duration parameters"
                );
              var node = new IntervalNode(
                event.time,
                event.time + event.duration,
                event
              );
              for (
                null === this._root
                  ? (this._root = node)
                  : this._root.insert(node),
                  this._length++;
                null !== node;

              )
                node.updateHeight(),
                  node.updateMax(),
                  this._rebalance(node),
                  (node = node.parent);
              return this;
            }),
            (Tone.IntervalTimeline.prototype.removeEvent = function(event) {
              if (null !== this._root) {
                var results = [];
                this._root.search(event.time, results);
                for (var i = 0; i < results.length; i++) {
                  var node = results[i];
                  if (node.event === event) {
                    this._removeNode(node), this._length--;
                    break;
                  }
                }
              }
              return this;
            }),
            Object.defineProperty(Tone.IntervalTimeline.prototype, "length", {
              get: function() {
                return this._length;
              }
            }),
            (Tone.IntervalTimeline.prototype.cancel = function(after) {
              return (
                (after = this.toSeconds(after)),
                this.forEachAfter(
                  after,
                  function(event) {
                    this.removeEvent(event);
                  }.bind(this)
                ),
                this
              );
            }),
            (Tone.IntervalTimeline.prototype._setRoot = function(node) {
              (this._root = node),
                null !== this._root && (this._root.parent = null);
            }),
            (Tone.IntervalTimeline.prototype._replaceNodeInParent = function(
              node,
              replacement
            ) {
              null !== node.parent
                ? (node.isLeftChild()
                    ? (node.parent.left = replacement)
                    : (node.parent.right = replacement),
                  this._rebalance(node.parent))
                : this._setRoot(replacement);
            }),
            (Tone.IntervalTimeline.prototype._removeNode = function(node) {
              if (null === node.left && null === node.right)
                this._replaceNodeInParent(node, null);
              else if (null === node.right)
                this._replaceNodeInParent(node, node.left);
              else if (null === node.left)
                this._replaceNodeInParent(node, node.right);
              else {
                var replacement,
                  temp,
                  balance = node.getBalance();
                if (balance > 0)
                  if (null === node.left.right)
                    (replacement = node.left),
                      (replacement.right = node.right),
                      (temp = replacement);
                  else {
                    for (
                      replacement = node.left.right;
                      null !== replacement.right;

                    )
                      replacement = replacement.right;
                    (replacement.parent.right = replacement.left),
                      (temp = replacement.parent),
                      (replacement.left = node.left),
                      (replacement.right = node.right);
                  }
                else if (null === node.right.left)
                  (replacement = node.right),
                    (replacement.left = node.left),
                    (temp = replacement);
                else {
                  for (
                    replacement = node.right.left;
                    null !== replacement.left;

                  )
                    replacement = replacement.left;
                  (replacement.parent = replacement.parent),
                    (replacement.parent.left = replacement.right),
                    (temp = replacement.parent),
                    (replacement.left = node.left),
                    (replacement.right = node.right);
                }
                null !== node.parent
                  ? node.isLeftChild()
                    ? (node.parent.left = replacement)
                    : (node.parent.right = replacement)
                  : this._setRoot(replacement),
                  this._rebalance(temp);
              }
              node.dispose();
            }),
            (Tone.IntervalTimeline.prototype._rotateLeft = function(node) {
              var parent = node.parent,
                isLeftChild = node.isLeftChild(),
                pivotNode = node.right;
              (node.right = pivotNode.left),
                (pivotNode.left = node),
                null !== parent
                  ? isLeftChild
                    ? (parent.left = pivotNode)
                    : (parent.right = pivotNode)
                  : this._setRoot(pivotNode);
            }),
            (Tone.IntervalTimeline.prototype._rotateRight = function(node) {
              var parent = node.parent,
                isLeftChild = node.isLeftChild(),
                pivotNode = node.left;
              (node.left = pivotNode.right),
                (pivotNode.right = node),
                null !== parent
                  ? isLeftChild
                    ? (parent.left = pivotNode)
                    : (parent.right = pivotNode)
                  : this._setRoot(pivotNode);
            }),
            (Tone.IntervalTimeline.prototype._rebalance = function(node) {
              var balance = node.getBalance();
              balance > 1
                ? node.left.getBalance() < 0
                  ? this._rotateLeft(node.left)
                  : this._rotateRight(node)
                : -1 > balance &&
                  (node.right.getBalance() > 0
                    ? this._rotateRight(node.right)
                    : this._rotateLeft(node));
            }),
            (Tone.IntervalTimeline.prototype.getEvent = function(time) {
              if (null !== this._root) {
                var results = [];
                if ((this._root.search(time, results), results.length > 0)) {
                  for (var max = results[0], i = 1; i < results.length; i++)
                    results[i].low > max.low && (max = results[i]);
                  return max.event;
                }
              }
              return null;
            }),
            (Tone.IntervalTimeline.prototype.forEach = function(callback) {
              if (null !== this._root) {
                var allNodes = [];
                null !== this._root &&
                  this._root.traverse(function(node) {
                    allNodes.push(node);
                  });
                for (var i = 0; i < allNodes.length; i++) {
                  var ev = allNodes[i].event;
                  ev && callback(ev);
                }
              }
              return this;
            }),
            (Tone.IntervalTimeline.prototype.forEachAtTime = function(
              time,
              callback
            ) {
              if (((time = this.toSeconds(time)), null !== this._root)) {
                var results = [];
                this._root.search(time, results);
                for (var i = results.length - 1; i >= 0; i--) {
                  var ev = results[i].event;
                  ev && callback(ev);
                }
              }
              return this;
            }),
            (Tone.IntervalTimeline.prototype.forEachAfter = function(
              time,
              callback
            ) {
              if (((time = this.toSeconds(time)), null !== this._root)) {
                var results = [];
                this._root.searchAfter(time, results);
                for (var i = results.length - 1; i >= 0; i--) {
                  var ev = results[i].event;
                  ev && callback(ev);
                }
              }
              return this;
            }),
            (Tone.IntervalTimeline.prototype.dispose = function() {
              var allNodes = [];
              null !== this._root &&
                this._root.traverse(function(node) {
                  allNodes.push(node);
                });
              for (var i = 0; i < allNodes.length; i++) allNodes[i].dispose();
              return (allNodes = null), (this._root = null), this;
            });
          var IntervalNode = function(low, high, event) {
            (this.event = event),
              (this.low = low),
              (this.high = high),
              (this.max = this.high),
              (this._left = null),
              (this._right = null),
              (this.parent = null),
              (this.height = 0);
          };
          return (
            (IntervalNode.prototype.insert = function(node) {
              node.low <= this.low
                ? null === this.left
                  ? (this.left = node)
                  : this.left.insert(node)
                : null === this.right
                ? (this.right = node)
                : this.right.insert(node);
            }),
            (IntervalNode.prototype.search = function(point, results) {
              point > this.max ||
                (null !== this.left && this.left.search(point, results),
                this.low <= point && this.high > point && results.push(this),
                this.low > point ||
                  (null !== this.right && this.right.search(point, results)));
            }),
            (IntervalNode.prototype.searchAfter = function(point, results) {
              this.low >= point &&
                (results.push(this),
                null !== this.left && this.left.searchAfter(point, results)),
                null !== this.right && this.right.searchAfter(point, results);
            }),
            (IntervalNode.prototype.traverse = function(callback) {
              callback(this),
                null !== this.left && this.left.traverse(callback),
                null !== this.right && this.right.traverse(callback);
            }),
            (IntervalNode.prototype.updateHeight = function() {
              this.height =
                null !== this.left && null !== this.right
                  ? Math.max(this.left.height, this.right.height) + 1
                  : null !== this.right
                  ? this.right.height + 1
                  : null !== this.left
                  ? this.left.height + 1
                  : 0;
            }),
            (IntervalNode.prototype.updateMax = function() {
              (this.max = this.high),
                null !== this.left &&
                  (this.max = Math.max(this.max, this.left.max)),
                null !== this.right &&
                  (this.max = Math.max(this.max, this.right.max));
            }),
            (IntervalNode.prototype.getBalance = function() {
              var balance = 0;
              return (
                null !== this.left && null !== this.right
                  ? (balance = this.left.height - this.right.height)
                  : null !== this.left
                  ? (balance = this.left.height + 1)
                  : null !== this.right && (balance = -(this.right.height + 1)),
                balance
              );
            }),
            (IntervalNode.prototype.isLeftChild = function() {
              return null !== this.parent && this.parent.left === this;
            }),
            Object.defineProperty(IntervalNode.prototype, "left", {
              get: function() {
                return this._left;
              },
              set: function(node) {
                (this._left = node),
                  null !== node && (node.parent = this),
                  this.updateHeight(),
                  this.updateMax();
              }
            }),
            Object.defineProperty(IntervalNode.prototype, "right", {
              get: function() {
                return this._right;
              },
              set: function(node) {
                (this._right = node),
                  null !== node && (node.parent = this),
                  this.updateHeight(),
                  this.updateMax();
              }
            }),
            (IntervalNode.prototype.dispose = function() {
              (this.parent = null),
                (this._left = null),
                (this._right = null),
                (this.event = null);
            }),
            Tone.IntervalTimeline
          );
        }),
        Module(function(Tone) {
          (Tone.Transport = function() {
            Tone.Emitter.call(this),
              (this.loop = !1),
              (this._loopStart = 0),
              (this._loopEnd = 0),
              (this._ppq = TransportConstructor.defaults.PPQ),
              (this._clock = new Tone.Clock({
                callback: this._processTick.bind(this),
                frequency: 0
              })),
              (this.bpm = this._clock.frequency),
              (this.bpm._toUnits = this._toUnits.bind(this)),
              (this.bpm._fromUnits = this._fromUnits.bind(this)),
              (this.bpm.units = Tone.Type.BPM),
              (this.bpm.value = TransportConstructor.defaults.bpm),
              this._readOnly("bpm"),
              (this._timeSignature =
                TransportConstructor.defaults.timeSignature),
              (this._scheduledEvents = {}),
              (this._eventID = 0),
              (this._timeline = new Tone.Timeline()),
              (this._repeatedEvents = new Tone.IntervalTimeline()),
              (this._onceEvents = new Tone.Timeline()),
              (this._syncedSignals = []),
              (this._swingTicks = TransportConstructor.defaults.PPQ / 2),
              (this._swingAmount = 0);
          }),
            Tone.extend(Tone.Transport, Tone.Emitter),
            (Tone.Transport.defaults = {
              bpm: 120,
              swing: 0,
              swingSubdivision: "8n",
              timeSignature: 4,
              loopStart: 0,
              loopEnd: "4m",
              PPQ: 192
            }),
            (Tone.Transport.prototype._processTick = function(tickTime) {
              var ticks = this._clock.ticks;
              if (
                this._swingAmount > 0 &&
                0 !== ticks % this._ppq &&
                0 !== ticks % (2 * this._swingTicks)
              ) {
                var progress =
                    (ticks % (2 * this._swingTicks)) / (2 * this._swingTicks),
                  amount = Math.sin(progress * Math.PI) * this._swingAmount;
                tickTime +=
                  Tone.Time((2 * this._swingTicks) / 3, "i").eval() * amount;
              }
              this.loop &&
                ticks === this._loopEnd &&
                ((this.ticks = this._loopStart),
                (ticks = this._loopStart),
                this.trigger("loop", tickTime)),
                this._onceEvents.forEachBefore(ticks, function(event) {
                  event.callback(tickTime);
                }),
                this._onceEvents.cancelBefore(ticks),
                this._timeline.forEachAtTime(ticks, function(event) {
                  event.callback(tickTime);
                }),
                this._repeatedEvents.forEachAtTime(ticks, function(event) {
                  0 === (ticks - event.time) % event.interval &&
                    event.callback(tickTime);
                });
            }),
            (Tone.Transport.prototype.schedule = function(callback, time) {
              var event = { time: this.toTicks(time), callback: callback },
                id = this._eventID++;
              return (
                (this._scheduledEvents[id.toString()] = {
                  event: event,
                  timeline: this._timeline
                }),
                this._timeline.addEvent(event),
                id
              );
            }),
            (Tone.Transport.prototype.scheduleRepeat = function(
              callback,
              interval,
              startTime,
              duration
            ) {
              if (0 >= interval)
                throw new Error(
                  "Tone.Transport: repeat events must have an interval larger than 0"
                );
              var event = {
                  time: this.toTicks(startTime),
                  duration: this.toTicks(this.defaultArg(duration, 1 / 0)),
                  interval: this.toTicks(interval),
                  callback: callback
                },
                id = this._eventID++;
              return (
                (this._scheduledEvents[id.toString()] = {
                  event: event,
                  timeline: this._repeatedEvents
                }),
                this._repeatedEvents.addEvent(event),
                id
              );
            }),
            (Tone.Transport.prototype.scheduleOnce = function(callback, time) {
              var event = { time: this.toTicks(time), callback: callback },
                id = this._eventID++;
              return (
                (this._scheduledEvents[id.toString()] = {
                  event: event,
                  timeline: this._onceEvents
                }),
                this._onceEvents.addEvent(event),
                id
              );
            }),
            (Tone.Transport.prototype.clear = function(eventId) {
              if (this._scheduledEvents.hasOwnProperty(eventId)) {
                var item = this._scheduledEvents[eventId.toString()];
                item.timeline.removeEvent(item.event),
                  delete this._scheduledEvents[eventId.toString()];
              }
              return this;
            }),
            (Tone.Transport.prototype.cancel = function(after) {
              return (
                (after = this.defaultArg(after, 0)),
                (after = this.toTicks(after)),
                this._timeline.cancel(after),
                this._onceEvents.cancel(after),
                this._repeatedEvents.cancel(after),
                this
              );
            }),
            Object.defineProperty(Tone.Transport.prototype, "state", {
              get: function() {
                return this._clock.getStateAtTime(this.now());
              }
            }),
            (Tone.Transport.prototype.start = function(time, offset) {
              return (
                (time = this.toSeconds(time)),
                (offset = this.isUndef(offset)
                  ? new Tone.Time(this._clock.ticks, "i")
                  : new Tone.Time(offset)),
                this._clock.start(time, offset.toTicks()),
                this.trigger("start", time, offset.toSeconds()),
                this
              );
            }),
            (Tone.Transport.prototype.stop = function(time) {
              return (
                (time = this.toSeconds(time)),
                this._clock.stop(time),
                this.trigger("stop", time),
                this
              );
            }),
            (Tone.Transport.prototype.pause = function(time) {
              return (
                (time = this.toSeconds(time)),
                this._clock.pause(time),
                this.trigger("pause", time),
                this
              );
            }),
            Object.defineProperty(Tone.Transport.prototype, "timeSignature", {
              get: function() {
                return this._timeSignature;
              },
              set: function(timeSig) {
                this.isArray(timeSig) &&
                  (timeSig = 4 * (timeSig[0] / timeSig[1])),
                  (this._timeSignature = timeSig);
              }
            }),
            Object.defineProperty(Tone.Transport.prototype, "loopStart", {
              get: function() {
                return Tone.TransportTime(this._loopStart, "i").toSeconds();
              },
              set: function(startPosition) {
                this._loopStart = this.toTicks(startPosition);
              }
            }),
            Object.defineProperty(Tone.Transport.prototype, "loopEnd", {
              get: function() {
                return Tone.TransportTime(this._loopEnd, "i").toSeconds();
              },
              set: function(endPosition) {
                this._loopEnd = this.toTicks(endPosition);
              }
            }),
            (Tone.Transport.prototype.setLoopPoints = function(
              startPosition,
              endPosition
            ) {
              return (
                (this.loopStart = startPosition),
                (this.loopEnd = endPosition),
                this
              );
            }),
            Object.defineProperty(Tone.Transport.prototype, "swing", {
              get: function() {
                return this._swingAmount;
              },
              set: function(amount) {
                this._swingAmount = amount;
              }
            }),
            Object.defineProperty(
              Tone.Transport.prototype,
              "swingSubdivision",
              {
                get: function() {
                  return Tone.Time(this._swingTicks, "i").toNotation();
                },
                set: function(subdivision) {
                  this._swingTicks = this.toTicks(subdivision);
                }
              }
            ),
            Object.defineProperty(Tone.Transport.prototype, "position", {
              get: function() {
                return Tone.TransportTime(
                  this.ticks,
                  "i"
                ).toBarsBeatsSixteenths();
              },
              set: function(progress) {
                var ticks = this.toTicks(progress);
                this.ticks = ticks;
              }
            }),
            Object.defineProperty(Tone.Transport.prototype, "progress", {
              get: function() {
                return this.loop
                  ? (this.ticks - this._loopStart) /
                      (this._loopEnd - this._loopStart)
                  : 0;
              }
            }),
            Object.defineProperty(Tone.Transport.prototype, "ticks", {
              get: function() {
                return this._clock.ticks;
              },
              set: function(t) {
                this._clock.ticks = t;
              }
            }),
            Object.defineProperty(Tone.Transport.prototype, "PPQ", {
              get: function() {
                return this._ppq;
              },
              set: function(ppq) {
                var bpm = this.bpm.value;
                (this._ppq = ppq), (this.bpm.value = bpm);
              }
            }),
            (Tone.Transport.prototype._fromUnits = function(bpm) {
              return 1 / (60 / bpm / this.PPQ);
            }),
            (Tone.Transport.prototype._toUnits = function(freq) {
              return 60 * (freq / this.PPQ);
            }),
            (Tone.Transport.prototype.nextSubdivision = function(subdivision) {
              subdivision = this.toSeconds(subdivision);
              var now;
              if (this.state !== Tone.State.Started) return 0;
              now = this._clock._nextTick;
              var transportPos = Tone.Time(this.ticks, "i").eval(),
                remainingTime = subdivision - (transportPos % subdivision);
              return (
                0 === remainingTime && (remainingTime = subdivision),
                now + remainingTime
              );
            }),
            (Tone.Transport.prototype.syncSignal = function(signal, ratio) {
              ratio ||
                (ratio =
                  0 !== signal._param.value
                    ? signal._param.value / this.bpm._param.value
                    : 0);
              var ratioSignal = new Tone.Gain(ratio);
              return (
                this.bpm.chain(ratioSignal, signal._param),
                this._syncedSignals.push({
                  ratio: ratioSignal,
                  signal: signal,
                  initial: signal._param.value
                }),
                (signal._param.value = 0),
                this
              );
            }),
            (Tone.Transport.prototype.unsyncSignal = function(signal) {
              for (var i = this._syncedSignals.length - 1; i >= 0; i--) {
                var syncedSignal = this._syncedSignals[i];
                syncedSignal.signal === signal &&
                  (syncedSignal.ratio.dispose(),
                  (syncedSignal.signal._param.value = syncedSignal.initial),
                  this._syncedSignals.splice(i, 1));
              }
              return this;
            }),
            (Tone.Transport.prototype.dispose = function() {
              return (
                Tone.Emitter.prototype.dispose.call(this),
                this._clock.dispose(),
                (this._clock = null),
                this._writable("bpm"),
                (this.bpm = null),
                this._timeline.dispose(),
                (this._timeline = null),
                this._onceEvents.dispose(),
                (this._onceEvents = null),
                this._repeatedEvents.dispose(),
                (this._repeatedEvents = null),
                this
              );
            });
          var TransportConstructor = Tone.Transport;
          return (
            Tone._initAudioContext(function() {
              if ("function" == typeof Tone.Transport)
                Tone.Transport = new Tone.Transport();
              else {
                Tone.Transport.stop();
                var prevSettings = Tone.Transport.get();
                Tone.Transport.dispose(),
                  TransportConstructor.call(Tone.Transport),
                  Tone.Transport.set(prevSettings);
              }
            }),
            Tone.Transport
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Volume = function() {
              var options = this.optionsObject(
                arguments,
                ["volume"],
                Tone.Volume.defaults
              );
              (this.output = this.input = new Tone.Gain(
                options.volume,
                Tone.Type.Decibels
              )),
                (this._unmutedVolume = 0),
                (this._muted = !1),
                (this.volume = this.output.gain),
                this._readOnly("volume"),
                (this.mute = options.mute);
            }),
            Tone.extend(Tone.Volume),
            (Tone.Volume.defaults = { volume: 0, mute: !1 }),
            Object.defineProperty(Tone.Volume.prototype, "mute", {
              get: function() {
                return this._muted;
              },
              set: function(mute) {
                !this._muted && mute
                  ? ((this._unmutedVolume = this.volume.value),
                    (this.volume.value = -1 / 0))
                  : this._muted &&
                    !mute &&
                    (this.volume.value = this._unmutedVolume),
                  (this._muted = mute);
              }
            }),
            (Tone.Volume.prototype.dispose = function() {
              return (
                this.input.dispose(),
                Tone.prototype.dispose.call(this),
                this._writable("volume"),
                this.volume.dispose(),
                (this.volume = null),
                this
              );
            }),
            Tone.Volume
          );
        }),
        Module(function(Tone) {
          (Tone.Master = function() {
            Tone.call(this),
              (this._volume = this.output = new Tone.Volume()),
              (this.volume = this._volume.volume),
              this._readOnly("volume"),
              this.input.chain(this.output, this.context.destination);
          }),
            Tone.extend(Tone.Master),
            (Tone.Master.defaults = { volume: 0, mute: !1 }),
            Object.defineProperty(Tone.Master.prototype, "mute", {
              get: function() {
                return this._volume.mute;
              },
              set: function(mute) {
                this._volume.mute = mute;
              }
            }),
            (Tone.Master.prototype.chain = function() {
              this.input.disconnect(),
                this.input.chain.apply(this.input, arguments),
                arguments[arguments.length - 1].connect(this.output);
            }),
            (Tone.Master.prototype.dispose = function() {
              Tone.prototype.dispose.call(this),
                this._writable("volume"),
                this._volume.dispose(),
                (this._volume = null),
                (this.volume = null);
            }),
            (Tone.prototype.toMaster = function() {
              return this.connect(Tone.Master), this;
            }),
            (AudioNode.prototype.toMaster = function() {
              return this.connect(Tone.Master), this;
            });
          var MasterConstructor = Tone.Master;
          return (
            Tone._initAudioContext(function() {
              Tone.prototype.isUndef(Tone.Master)
                ? (MasterConstructor.prototype.dispose.call(Tone.Master),
                  MasterConstructor.call(Tone.Master))
                : (Tone.Master = new MasterConstructor());
            }),
            Tone.Master
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Source = function(options) {
              Tone.call(this),
                (options = this.defaultArg(options, Tone.Source.defaults)),
                (this._volume = this.output = new Tone.Volume(options.volume)),
                (this.volume = this._volume.volume),
                this._readOnly("volume"),
                (this._state = new Tone.TimelineState(Tone.State.Stopped)),
                (this._state.memory = 10),
                (this._syncStart = function(time, offset) {
                  (time = this.toSeconds(time)),
                    (time += this.toSeconds(this._startDelay)),
                    this.start(time, offset);
                }.bind(this)),
                (this._syncStop = this.stop.bind(this)),
                (this._startDelay = 0),
                (this._volume.output.output.channelCount = 2),
                (this._volume.output.output.channelCountMode = "explicit"),
                (this.mute = options.mute);
            }),
            Tone.extend(Tone.Source),
            (Tone.Source.defaults = { volume: 0, mute: !1 }),
            Object.defineProperty(Tone.Source.prototype, "state", {
              get: function() {
                return this._state.getStateAtTime(this.now());
              }
            }),
            Object.defineProperty(Tone.Source.prototype, "mute", {
              get: function() {
                return this._volume.mute;
              },
              set: function(mute) {
                this._volume.mute = mute;
              }
            }),
            (Tone.Source.prototype.start = function(time) {
              return (
                (time = this.toSeconds(time)),
                (this._state.getStateAtTime(time) !== Tone.State.Started ||
                  this.retrigger) &&
                  (this._state.setStateAtTime(Tone.State.Started, time),
                  this._start && this._start.apply(this, arguments)),
                this
              );
            }),
            (Tone.Source.prototype.stop = function(time) {
              return (
                (time = this.toSeconds(time)),
                this._state.cancel(time),
                this._state.setStateAtTime(Tone.State.Stopped, time),
                this._stop && this._stop.apply(this, arguments),
                this
              );
            }),
            (Tone.Source.prototype.sync = function(delay) {
              return (
                (this._startDelay = this.defaultArg(delay, 0)),
                Tone.Transport.on("start", this._syncStart),
                Tone.Transport.on("stop pause", this._syncStop),
                this
              );
            }),
            (Tone.Source.prototype.unsync = function() {
              return (
                (this._startDelay = 0),
                Tone.Transport.off("start", this._syncStart),
                Tone.Transport.off("stop pause", this._syncStop),
                this
              );
            }),
            (Tone.Source.prototype.dispose = function() {
              this.stop(),
                Tone.prototype.dispose.call(this),
                this.unsync(),
                this._writable("volume"),
                this._volume.dispose(),
                (this._volume = null),
                (this.volume = null),
                this._state.dispose(),
                (this._state = null),
                (this._syncStart = null),
                (this._syncStart = null);
            }),
            Tone.Source
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Oscillator = function() {
              var options = this.optionsObject(
                arguments,
                ["frequency", "type"],
                Tone.Oscillator.defaults
              );
              Tone.Source.call(this, options),
                (this._oscillator = null),
                (this.frequency = new Tone.Signal(
                  options.frequency,
                  Tone.Type.Frequency
                )),
                (this.detune = new Tone.Signal(
                  options.detune,
                  Tone.Type.Cents
                )),
                (this._wave = null),
                (this._partials = this.defaultArg(options.partials, [1])),
                (this._phase = options.phase),
                (this._type = null),
                (this.type = options.type),
                (this.phase = this._phase),
                this._readOnly(["frequency", "detune"]);
            }),
            Tone.extend(Tone.Oscillator, Tone.Source),
            (Tone.Oscillator.defaults = {
              type: "sine",
              frequency: 440,
              detune: 0,
              phase: 0,
              partials: []
            }),
            (Tone.Oscillator.Type = {
              Sine: "sine",
              Triangle: "triangle",
              Sawtooth: "sawtooth",
              Square: "square",
              Custom: "custom"
            }),
            (Tone.Oscillator.prototype._start = function(time) {
              (this._oscillator = this.context.createOscillator()),
                this._oscillator.setPeriodicWave(this._wave),
                this._oscillator.connect(this.output),
                this.frequency.connect(this._oscillator.frequency),
                this.detune.connect(this._oscillator.detune),
                this._oscillator.start(this.toSeconds(time));
            }),
            (Tone.Oscillator.prototype._stop = function(time) {
              return (
                this._oscillator &&
                  (this._oscillator.stop(this.toSeconds(time)),
                  (this._oscillator = null)),
                this
              );
            }),
            (Tone.Oscillator.prototype.syncFrequency = function() {
              return Tone.Transport.syncSignal(this.frequency), this;
            }),
            (Tone.Oscillator.prototype.unsyncFrequency = function() {
              return Tone.Transport.unsyncSignal(this.frequency), this;
            }),
            Object.defineProperty(Tone.Oscillator.prototype, "type", {
              get: function() {
                return this._type;
              },
              set: function(type) {
                var coefs = this._getRealImaginary(type, this._phase),
                  periodicWave = this.context.createPeriodicWave(
                    coefs[0],
                    coefs[1]
                  );
                (this._wave = periodicWave),
                  null !== this._oscillator &&
                    this._oscillator.setPeriodicWave(this._wave),
                  (this._type = type);
              }
            }),
            (Tone.Oscillator.prototype._getRealImaginary = function(
              type,
              phase
            ) {
              var fftSize = 4096,
                periodicWaveSize = fftSize / 2,
                real = new Float32Array(periodicWaveSize),
                imag = new Float32Array(periodicWaveSize),
                partialCount = 1;
              if (type === Tone.Oscillator.Type.Custom)
                (partialCount = this._partials.length + 1),
                  (periodicWaveSize = partialCount);
              else {
                var partial = /^(sine|triangle|square|sawtooth)(\d+)$/.exec(
                  type
                );
                partial &&
                  ((partialCount = parseInt(partial[2]) + 1),
                  (type = partial[1]),
                  (partialCount = Math.max(partialCount, 2)),
                  (periodicWaveSize = partialCount));
              }
              for (var n = 1; periodicWaveSize > n; ++n) {
                var b,
                  piFactor = 2 / (n * Math.PI);
                switch (type) {
                  case Tone.Oscillator.Type.Sine:
                    b = partialCount >= n ? 1 : 0;
                    break;
                  case Tone.Oscillator.Type.Square:
                    b = 1 & n ? 2 * piFactor : 0;
                    break;
                  case Tone.Oscillator.Type.Sawtooth:
                    b = piFactor * (1 & n ? 1 : -1);
                    break;
                  case Tone.Oscillator.Type.Triangle:
                    b =
                      1 & n
                        ? 2 *
                          piFactor *
                          piFactor *
                          (1 & ((n - 1) >> 1) ? -1 : 1)
                        : 0;
                    break;
                  case Tone.Oscillator.Type.Custom:
                    b = this._partials[n - 1];
                    break;
                  default:
                    throw new TypeError(
                      "Tone.Oscillator: invalid type: " + type
                    );
                }
                0 !== b
                  ? ((real[n] = -b * Math.sin(phase * n)),
                    (imag[n] = b * Math.cos(phase * n)))
                  : ((real[n] = 0), (imag[n] = 0));
              }
              return [real, imag];
            }),
            (Tone.Oscillator.prototype._inverseFFT = function(
              real,
              imag,
              phase
            ) {
              for (var sum = 0, len = real.length, i = 0; len > i; i++)
                sum +=
                  real[i] * Math.cos(i * phase) + imag[i] * Math.sin(i * phase);
              return sum;
            }),
            (Tone.Oscillator.prototype._getInitialValue = function() {
              for (
                var coefs = this._getRealImaginary(this._type, 0),
                  real = coefs[0],
                  imag = coefs[1],
                  maxValue = 0,
                  twoPi = 2 * Math.PI,
                  i = 0;
                8 > i;
                i++
              )
                maxValue = Math.max(
                  this._inverseFFT(real, imag, (i / 8) * twoPi),
                  maxValue
                );
              return -this._inverseFFT(real, imag, this._phase) / maxValue;
            }),
            Object.defineProperty(Tone.Oscillator.prototype, "partials", {
              get: function() {
                return this._type !== Tone.Oscillator.Type.Custom
                  ? []
                  : this._partials;
              },
              set: function(partials) {
                (this._partials = partials),
                  (this.type = Tone.Oscillator.Type.Custom);
              }
            }),
            Object.defineProperty(Tone.Oscillator.prototype, "phase", {
              get: function() {
                return this._phase * (180 / Math.PI);
              },
              set: function(phase) {
                (this._phase = (phase * Math.PI) / 180),
                  (this.type = this._type);
              }
            }),
            (Tone.Oscillator.prototype.dispose = function() {
              return (
                Tone.Source.prototype.dispose.call(this),
                null !== this._oscillator &&
                  (this._oscillator.disconnect(), (this._oscillator = null)),
                (this._wave = null),
                this._writable(["frequency", "detune"]),
                this.frequency.dispose(),
                (this.frequency = null),
                this.detune.dispose(),
                (this.detune = null),
                (this._partials = null),
                this
              );
            }),
            Tone.Oscillator
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Zero = function() {
              (this._gain = this.input = this.output = new Tone.Gain()),
                Tone.Zero._zeros.connect(this._gain);
            }),
            Tone.extend(Tone.Zero),
            (Tone.Zero.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._gain.dispose(),
                (this._gain = null),
                this
              );
            }),
            (Tone.Zero._zeros = null),
            Tone._initAudioContext(function(audioContext) {
              for (
                var buffer = audioContext.createBuffer(
                    1,
                    128,
                    audioContext.sampleRate
                  ),
                  arr = buffer.getChannelData(0),
                  i = 0;
                i < arr.length;
                i++
              )
                arr[i] = 0;
              (Tone.Zero._zeros = audioContext.createBufferSource()),
                (Tone.Zero._zeros.channelCount = 1),
                (Tone.Zero._zeros.channelCountMode = "explicit"),
                (Tone.Zero._zeros.buffer = buffer),
                (Tone.Zero._zeros.loop = !0),
                Tone.Zero._zeros.start(0),
                Tone.Zero._zeros.noGC();
            }),
            Tone.Zero
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.LFO = function() {
              var options = this.optionsObject(
                arguments,
                ["frequency", "min", "max"],
                Tone.LFO.defaults
              );
              (this._oscillator = new Tone.Oscillator({
                frequency: options.frequency,
                type: options.type
              })),
                (this.frequency = this._oscillator.frequency),
                (this.amplitude = this._oscillator.volume),
                (this.amplitude.units = Tone.Type.NormalRange),
                (this.amplitude.value = options.amplitude),
                (this._stoppedSignal = new Tone.Signal(
                  0,
                  Tone.Type.AudioRange
                )),
                (this._zeros = new Tone.Zero()),
                (this._stoppedValue = 0),
                (this._a2g = new Tone.AudioToGain()),
                (this._scaler = this.output = new Tone.Scale(
                  options.min,
                  options.max
                )),
                (this._units = Tone.Type.Default),
                (this.units = options.units),
                this._oscillator.chain(this._a2g, this._scaler),
                this._zeros.connect(this._a2g),
                this._stoppedSignal.connect(this._a2g),
                this._readOnly(["amplitude", "frequency"]),
                (this.phase = options.phase);
            }),
            Tone.extend(Tone.LFO, Tone.Oscillator),
            (Tone.LFO.defaults = {
              type: "sine",
              min: 0,
              max: 1,
              phase: 0,
              frequency: "4n",
              amplitude: 1,
              units: Tone.Type.Default
            }),
            (Tone.LFO.prototype.start = function(time) {
              return (
                (time = this.toSeconds(time)),
                this._stoppedSignal.setValueAtTime(0, time),
                this._oscillator.start(time),
                this
              );
            }),
            (Tone.LFO.prototype.stop = function(time) {
              return (
                (time = this.toSeconds(time)),
                this._stoppedSignal.setValueAtTime(this._stoppedValue, time),
                this._oscillator.stop(time),
                this
              );
            }),
            (Tone.LFO.prototype.sync = function(delay) {
              return (
                this._oscillator.sync(delay),
                this._oscillator.syncFrequency(),
                this
              );
            }),
            (Tone.LFO.prototype.unsync = function() {
              return (
                this._oscillator.unsync(),
                this._oscillator.unsyncFrequency(),
                this
              );
            }),
            Object.defineProperty(Tone.LFO.prototype, "min", {
              get: function() {
                return this._toUnits(this._scaler.min);
              },
              set: function(min) {
                (min = this._fromUnits(min)), (this._scaler.min = min);
              }
            }),
            Object.defineProperty(Tone.LFO.prototype, "max", {
              get: function() {
                return this._toUnits(this._scaler.max);
              },
              set: function(max) {
                (max = this._fromUnits(max)), (this._scaler.max = max);
              }
            }),
            Object.defineProperty(Tone.LFO.prototype, "type", {
              get: function() {
                return this._oscillator.type;
              },
              set: function(type) {
                (this._oscillator.type = type),
                  (this._stoppedValue = this._oscillator._getInitialValue()),
                  (this._stoppedSignal.value = this._stoppedValue);
              }
            }),
            Object.defineProperty(Tone.LFO.prototype, "phase", {
              get: function() {
                return this._oscillator.phase;
              },
              set: function(phase) {
                (this._oscillator.phase = phase),
                  (this._stoppedValue = this._oscillator._getInitialValue()),
                  (this._stoppedSignal.value = this._stoppedValue);
              }
            }),
            Object.defineProperty(Tone.LFO.prototype, "units", {
              get: function() {
                return this._units;
              },
              set: function(val) {
                var currentMin = this.min,
                  currentMax = this.max;
                (this._units = val),
                  (this.min = currentMin),
                  (this.max = currentMax);
              }
            }),
            Object.defineProperty(Tone.LFO.prototype, "mute", {
              get: function() {
                return this._oscillator.mute;
              },
              set: function(mute) {
                this._oscillator.mute = mute;
              }
            }),
            Object.defineProperty(Tone.LFO.prototype, "state", {
              get: function() {
                return this._oscillator.state;
              }
            }),
            (Tone.LFO.prototype.connect = function(node) {
              return (
                (node.constructor === Tone.Signal ||
                  node.constructor === Tone.Param ||
                  node.constructor === Tone.TimelineSignal) &&
                  ((this.convert = node.convert), (this.units = node.units)),
                Tone.Signal.prototype.connect.apply(this, arguments),
                this
              );
            }),
            (Tone.LFO.prototype._fromUnits = Tone.Param.prototype._fromUnits),
            (Tone.LFO.prototype._toUnits = Tone.Param.prototype._toUnits),
            (Tone.LFO.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._writable(["amplitude", "frequency"]),
                this._oscillator.dispose(),
                (this._oscillator = null),
                this._stoppedSignal.dispose(),
                (this._stoppedSignal = null),
                this._zeros.dispose(),
                (this._zeros = null),
                this._scaler.dispose(),
                (this._scaler = null),
                this._a2g.dispose(),
                (this._a2g = null),
                (this.frequency = null),
                (this.amplitude = null),
                this
              );
            }),
            Tone.LFO
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Limiter = function() {
              var options = this.optionsObject(
                arguments,
                ["threshold"],
                Tone.Limiter.defaults
              );
              (this._compressor = this.input = this.output = new Tone.Compressor(
                { attack: 0.001, decay: 0.001, threshold: options.threshold }
              )),
                (this.threshold = this._compressor.threshold),
                this._readOnly("threshold");
            }),
            Tone.extend(Tone.Limiter),
            (Tone.Limiter.defaults = { threshold: -12 }),
            (Tone.Limiter.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._compressor.dispose(),
                (this._compressor = null),
                this._writable("threshold"),
                (this.threshold = null),
                this
              );
            }),
            Tone.Limiter
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.LowpassCombFilter = function() {
              Tone.call(this);
              var options = this.optionsObject(
                arguments,
                ["delayTime", "resonance", "dampening"],
                Tone.LowpassCombFilter.defaults
              );
              (this._delay = this.input = this.context.createDelay(1)),
                (this.delayTime = new Tone.Signal(
                  options.delayTime,
                  Tone.Type.Time
                )),
                (this._lowpass = this.output = this.context.createBiquadFilter()),
                (this._lowpass.Q.value = 0),
                (this._lowpass.type = "lowpass"),
                (this.dampening = new Tone.Param({
                  param: this._lowpass.frequency,
                  units: Tone.Type.Frequency,
                  value: options.dampening
                })),
                (this._feedback = this.context.createGain()),
                (this.resonance = new Tone.Param({
                  param: this._feedback.gain,
                  units: Tone.Type.NormalRange,
                  value: options.resonance
                })),
                this._delay.chain(this._lowpass, this._feedback, this._delay),
                this.delayTime.connect(this._delay.delayTime),
                this._readOnly(["dampening", "resonance", "delayTime"]);
            }),
            Tone.extend(Tone.LowpassCombFilter),
            (Tone.LowpassCombFilter.defaults = {
              delayTime: 0.1,
              resonance: 0.5,
              dampening: 3e3
            }),
            (Tone.LowpassCombFilter.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._writable(["dampening", "resonance", "delayTime"]),
                this.dampening.dispose(),
                (this.dampening = null),
                this.resonance.dispose(),
                (this.resonance = null),
                this._delay.disconnect(),
                (this._delay = null),
                this._lowpass.disconnect(),
                (this._lowpass = null),
                this._feedback.disconnect(),
                (this._feedback = null),
                this.delayTime.dispose(),
                (this.delayTime = null),
                this
              );
            }),
            Tone.LowpassCombFilter
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Merge = function() {
              Tone.call(this, 2, 0),
                (this.left = this.input[0] = this.context.createGain()),
                (this.right = this.input[1] = this.context.createGain()),
                (this._merger = this.output = this.context.createChannelMerger(
                  2
                )),
                this.left.connect(this._merger, 0, 0),
                this.right.connect(this._merger, 0, 1),
                (this.left.channelCount = 1),
                (this.right.channelCount = 1),
                (this.left.channelCountMode = "explicit"),
                (this.right.channelCountMode = "explicit");
            }),
            Tone.extend(Tone.Merge),
            (Tone.Merge.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this.left.disconnect(),
                (this.left = null),
                this.right.disconnect(),
                (this.right = null),
                this._merger.disconnect(),
                (this._merger = null),
                this
              );
            }),
            Tone.Merge
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Meter = function() {
              var options = this.optionsObject(
                arguments,
                ["type", "smoothing"],
                Tone.Meter.defaults
              );
              (this.type = options.type),
                (this.input = this.output = this._analyser = new Tone.Analyser(
                  "waveform",
                  512
                )),
                (this._analyser.returnType = "float"),
                (this.smoothing = options.smoothing),
                (this._lastValue = 0);
            }),
            Tone.extend(Tone.Meter),
            (Tone.Meter.Type = { Level: "level", Signal: "signal" }),
            (Tone.Meter.defaults = {
              smoothing: 0.8,
              type: Tone.Meter.Type.Level
            }),
            Object.defineProperty(Tone.Meter.prototype, "value", {
              get: function() {
                var signal = this._analyser.analyse();
                if (this.type === Tone.Meter.Type.Level) {
                  for (var sum = 0, i = 0; i < signal.length; i++)
                    sum += Math.pow(signal[i], 2);
                  var rms = Math.sqrt(sum / signal.length);
                  (rms = Math.max(rms, this._lastValue * this.smoothing)),
                    (this._lastValue = rms);
                  var unity = 0.35,
                    val = rms / unity;
                  return Math.sqrt(val);
                }
                return signal[0];
              }
            }),
            (Tone.Meter.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._analyser.dispose(),
                (this._analyser = null),
                this
              );
            }),
            Tone.Meter
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Split = function() {
              Tone.call(this, 0, 2),
                (this._splitter = this.input = this.context.createChannelSplitter(
                  2
                )),
                (this.left = this.output[0] = this.context.createGain()),
                (this.right = this.output[1] = this.context.createGain()),
                this._splitter.connect(this.left, 0, 0),
                this._splitter.connect(this.right, 1, 0);
            }),
            Tone.extend(Tone.Split),
            (Tone.Split.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._splitter.disconnect(),
                this.left.disconnect(),
                this.right.disconnect(),
                (this.left = null),
                (this.right = null),
                (this._splitter = null),
                this
              );
            }),
            Tone.Split
          );
        }),
        Module(function(Tone) {
          (Tone.MidSideSplit = function() {
            Tone.call(this, 0, 2),
              (this._split = this.input = new Tone.Split()),
              (this.mid = this.output[0] = new Tone.Expr("($0 + $1) * $2")),
              (this.side = this.output[1] = new Tone.Expr("($0 - $1) * $2")),
              this._split.connect(this.mid, 0, 0),
              this._split.connect(this.mid, 1, 1),
              this._split.connect(this.side, 0, 0),
              this._split.connect(this.side, 1, 1),
              sqrtTwo.connect(this.mid, 0, 2),
              sqrtTwo.connect(this.side, 0, 2);
          }),
            Tone.extend(Tone.MidSideSplit);
          var sqrtTwo = null;
          return (
            Tone._initAudioContext(function() {
              sqrtTwo = new Tone.Signal(1 / Math.sqrt(2));
            }),
            (Tone.MidSideSplit.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this.mid.dispose(),
                (this.mid = null),
                this.side.dispose(),
                (this.side = null),
                this._split.dispose(),
                (this._split = null),
                this
              );
            }),
            Tone.MidSideSplit
          );
        }),
        Module(function(Tone) {
          (Tone.MidSideMerge = function() {
            Tone.call(this, 2, 0),
              (this.mid = this.input[0] = this.context.createGain()),
              (this._left = new Tone.Expr("($0 + $1) * $2")),
              (this.side = this.input[1] = this.context.createGain()),
              (this._right = new Tone.Expr("($0 - $1) * $2")),
              (this._merge = this.output = new Tone.Merge()),
              this.mid.connect(this._left, 0, 0),
              this.side.connect(this._left, 0, 1),
              this.mid.connect(this._right, 0, 0),
              this.side.connect(this._right, 0, 1),
              this._left.connect(this._merge, 0, 0),
              this._right.connect(this._merge, 0, 1),
              sqrtTwo.connect(this._left, 0, 2),
              sqrtTwo.connect(this._right, 0, 2);
          }),
            Tone.extend(Tone.MidSideMerge);
          var sqrtTwo = null;
          return (
            Tone._initAudioContext(function() {
              sqrtTwo = new Tone.Signal(1 / Math.sqrt(2));
            }),
            (Tone.MidSideMerge.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this.mid.disconnect(),
                (this.mid = null),
                this.side.disconnect(),
                (this.side = null),
                this._left.dispose(),
                (this._left = null),
                this._right.dispose(),
                (this._right = null),
                this._merge.dispose(),
                (this._merge = null),
                this
              );
            }),
            Tone.MidSideMerge
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.MidSideCompressor = function(options) {
              (options = this.defaultArg(
                options,
                Tone.MidSideCompressor.defaults
              )),
                (this._midSideSplit = this.input = new Tone.MidSideSplit()),
                (this._midSideMerge = this.output = new Tone.MidSideMerge()),
                (this.mid = new Tone.Compressor(options.mid)),
                (this.side = new Tone.Compressor(options.side)),
                this._midSideSplit.mid.chain(this.mid, this._midSideMerge.mid),
                this._midSideSplit.side.chain(
                  this.side,
                  this._midSideMerge.side
                ),
                this._readOnly(["mid", "side"]);
            }),
            Tone.extend(Tone.MidSideCompressor),
            (Tone.MidSideCompressor.defaults = {
              mid: {
                ratio: 3,
                threshold: -24,
                release: 0.03,
                attack: 0.02,
                knee: 16
              },
              side: {
                ratio: 6,
                threshold: -30,
                release: 0.25,
                attack: 0.03,
                knee: 10
              }
            }),
            (Tone.MidSideCompressor.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._writable(["mid", "side"]),
                this.mid.dispose(),
                (this.mid = null),
                this.side.dispose(),
                (this.side = null),
                this._midSideSplit.dispose(),
                (this._midSideSplit = null),
                this._midSideMerge.dispose(),
                (this._midSideMerge = null),
                this
              );
            }),
            Tone.MidSideCompressor
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Mono = function() {
              Tone.call(this, 1, 0),
                (this._merge = this.output = new Tone.Merge()),
                this.input.connect(this._merge, 0, 0),
                this.input.connect(this._merge, 0, 1),
                (this.input.gain.value = this.dbToGain(-10));
            }),
            Tone.extend(Tone.Mono),
            (Tone.Mono.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._merge.dispose(),
                (this._merge = null),
                this
              );
            }),
            Tone.Mono
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.MultibandCompressor = function(options) {
              (options = this.defaultArg(
                arguments,
                Tone.MultibandCompressor.defaults
              )),
                (this._splitter = this.input = new Tone.MultibandSplit({
                  lowFrequency: options.lowFrequency,
                  highFrequency: options.highFrequency
                })),
                (this.lowFrequency = this._splitter.lowFrequency),
                (this.highFrequency = this._splitter.highFrequency),
                (this.output = this.context.createGain()),
                (this.low = new Tone.Compressor(options.low)),
                (this.mid = new Tone.Compressor(options.mid)),
                (this.high = new Tone.Compressor(options.high)),
                this._splitter.low.chain(this.low, this.output),
                this._splitter.mid.chain(this.mid, this.output),
                this._splitter.high.chain(this.high, this.output),
                this._readOnly([
                  "high",
                  "mid",
                  "low",
                  "highFrequency",
                  "lowFrequency"
                ]);
            }),
            Tone.extend(Tone.MultibandCompressor),
            (Tone.MultibandCompressor.defaults = {
              low: Tone.Compressor.defaults,
              mid: Tone.Compressor.defaults,
              high: Tone.Compressor.defaults,
              lowFrequency: 250,
              highFrequency: 2e3
            }),
            (Tone.MultibandCompressor.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._splitter.dispose(),
                this._writable([
                  "high",
                  "mid",
                  "low",
                  "highFrequency",
                  "lowFrequency"
                ]),
                this.low.dispose(),
                this.mid.dispose(),
                this.high.dispose(),
                (this._splitter = null),
                (this.low = null),
                (this.mid = null),
                (this.high = null),
                (this.lowFrequency = null),
                (this.highFrequency = null),
                this
              );
            }),
            Tone.MultibandCompressor
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Panner = function(initialPan) {
              Tone.call(this),
                this._hasStereoPanner
                  ? ((this._panner = this.input = this.output = this.context.createStereoPanner()),
                    (this.pan = this._panner.pan))
                  : ((this._crossFade = new Tone.CrossFade()),
                    (this._merger = this.output = new Tone.Merge()),
                    (this._splitter = this.input = new Tone.Split()),
                    (this.pan = new Tone.Signal(0, Tone.Type.AudioRange)),
                    (this._zero = new Tone.Zero()),
                    (this._a2g = new Tone.AudioToGain()),
                    this._zero.connect(this._a2g),
                    this.pan.chain(this._a2g, this._crossFade.fade),
                    this._splitter.connect(this._crossFade, 0, 0),
                    this._splitter.connect(this._crossFade, 1, 1),
                    this._crossFade.a.connect(this._merger, 0, 0),
                    this._crossFade.b.connect(this._merger, 0, 1)),
                (this.pan.value = this.defaultArg(initialPan, 0)),
                this._readOnly("pan");
            }),
            Tone.extend(Tone.Panner),
            (Tone.Panner.prototype._hasStereoPanner = Tone.prototype.isFunction(
              Tone.context.createStereoPanner
            )),
            (Tone.Panner.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._writable("pan"),
                this._hasStereoPanner
                  ? (this._panner.disconnect(),
                    (this._panner = null),
                    (this.pan = null))
                  : (this._zero.dispose(),
                    (this._zero = null),
                    this._crossFade.dispose(),
                    (this._crossFade = null),
                    this._splitter.dispose(),
                    (this._splitter = null),
                    this._merger.dispose(),
                    (this._merger = null),
                    this.pan.dispose(),
                    (this.pan = null),
                    this._a2g.dispose(),
                    (this._a2g = null)),
                this
              );
            }),
            Tone.Panner
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.PanVol = function() {
              var options = this.optionsObject(
                arguments,
                ["pan", "volume"],
                Tone.PanVol.defaults
              );
              (this._panner = this.input = new Tone.Panner(options.pan)),
                (this.pan = this._panner.pan),
                (this._volume = this.output = new Tone.Volume(options.volume)),
                (this.volume = this._volume.volume),
                this._panner.connect(this._volume),
                this._readOnly(["pan", "volume"]);
            }),
            Tone.extend(Tone.PanVol),
            (Tone.PanVol.defaults = { pan: 0.5, volume: 0 }),
            (Tone.PanVol.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._writable(["pan", "volume"]),
                this._panner.dispose(),
                (this._panner = null),
                (this.pan = null),
                this._volume.dispose(),
                (this._volume = null),
                (this.volume = null),
                this
              );
            }),
            Tone.PanVol
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.CtrlInterpolate = function() {
              var options = this.optionsObject(
                arguments,
                ["values", "index"],
                Tone.CtrlInterpolate.defaults
              );
              (this.values = options.values), (this.index = options.index);
            }),
            Tone.extend(Tone.CtrlInterpolate),
            (Tone.CtrlInterpolate.defaults = { index: 0, values: [] }),
            Object.defineProperty(Tone.CtrlInterpolate.prototype, "value", {
              get: function() {
                var index = this.index;
                index = Math.min(index, this.values.length - 1);
                var lowerPosition = Math.floor(index),
                  lower = this.values[lowerPosition],
                  upper = this.values[Math.ceil(index)];
                return this._interpolate(index - lowerPosition, lower, upper);
              }
            }),
            (Tone.CtrlInterpolate.prototype._interpolate = function(
              index,
              lower,
              upper
            ) {
              if (this.isArray(lower)) {
                for (var retArray = [], i = 0; i < lower.length; i++)
                  retArray[i] = this._interpolate(index, lower[i], upper[i]);
                return retArray;
              }
              if (this.isObject(lower)) {
                var retObj = {};
                for (var attr in lower)
                  retObj[attr] = this._interpolate(
                    index,
                    lower[attr],
                    upper[attr]
                  );
                return retObj;
              }
              return (
                (lower = this._toNumber(lower)),
                (upper = this._toNumber(upper)),
                (1 - index) * lower + index * upper
              );
            }),
            (Tone.CtrlInterpolate.prototype._toNumber = function(val) {
              return this.isNumber(val) ? val : this.toSeconds(val);
            }),
            (Tone.CtrlInterpolate.prototype.dispose = function() {
              this.values = null;
            }),
            Tone.CtrlInterpolate
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.CtrlMarkov = function(values, initial) {
              (this.values = this.defaultArg(values, {})),
                (this.value = this.defaultArg(
                  initial,
                  Object.keys(this.values)[0]
                ));
            }),
            Tone.extend(Tone.CtrlMarkov),
            (Tone.CtrlMarkov.prototype.next = function() {
              if (this.values.hasOwnProperty(this.value)) {
                var next = this.values[this.value];
                if (this.isArray(next))
                  for (
                    var distribution = this._getProbDistribution(next),
                      rand = Math.random(),
                      total = 0,
                      i = 0;
                    i < distribution.length;
                    i++
                  ) {
                    var dist = distribution[i];
                    if (rand > total && total + dist > rand) {
                      var chosen = next[i];
                      this.value = this.isObject(chosen)
                        ? chosen.value
                        : chosen;
                    }
                    total += dist;
                  }
                else this.value = next;
              }
              return this.value;
            }),
            (Tone.CtrlMarkov.prototype._getProbDistribution = function(
              options
            ) {
              for (
                var distribution = [], total = 0, needsNormalizing = !1, i = 0;
                i < options.length;
                i++
              ) {
                var option = options[i];
                this.isObject(option)
                  ? ((needsNormalizing = !0),
                    (distribution[i] = option.probability))
                  : (distribution[i] = 1 / options.length),
                  (total += distribution[i]);
              }
              if (needsNormalizing)
                for (var j = 0; j < distribution.length; j++)
                  distribution[j] = distribution[j] / total;
              return distribution;
            }),
            (Tone.CtrlMarkov.prototype.dispose = function() {
              this.values = null;
            }),
            Tone.CtrlMarkov
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.CtrlPattern = function() {
              var options = this.optionsObject(
                arguments,
                ["values", "type"],
                Tone.CtrlPattern.defaults
              );
              (this.values = options.values),
                (this.index = 0),
                (this._type = null),
                (this._shuffled = null),
                (this._direction = null),
                (this.type = options.type);
            }),
            Tone.extend(Tone.CtrlPattern),
            (Tone.CtrlPattern.Type = {
              Up: "up",
              Down: "down",
              UpDown: "upDown",
              DownUp: "downUp",
              AlternateUp: "alternateUp",
              AlternateDown: "alternateDown",
              Random: "random",
              RandomWalk: "randomWalk",
              RandomOnce: "randomOnce"
            }),
            (Tone.CtrlPattern.defaults = {
              type: Tone.CtrlPattern.Type.Up,
              values: []
            }),
            Object.defineProperty(Tone.CtrlPattern.prototype, "value", {
              get: function() {
                if (0 !== this.values.length) {
                  if (1 === this.values.length) return this.values[0];
                  this.index = Math.min(this.index, this.values.length - 1);
                  var val = this.values[this.index];
                  return (
                    this.type === Tone.CtrlPattern.Type.RandomOnce &&
                      (this.values.length !== this._shuffled.length &&
                        this._shuffleValues(),
                      (val = this.values[this._shuffled[this.index]])),
                    val
                  );
                }
              }
            }),
            Object.defineProperty(Tone.CtrlPattern.prototype, "type", {
              get: function() {
                return this._type;
              },
              set: function(type) {
                (this._type = type),
                  (this._shuffled = null),
                  this._type === Tone.CtrlPattern.Type.Up ||
                  this._type === Tone.CtrlPattern.Type.UpDown ||
                  this._type === Tone.CtrlPattern.Type.RandomOnce ||
                  this._type === Tone.CtrlPattern.Type.AlternateUp
                    ? (this.index = 0)
                    : (this._type === Tone.CtrlPattern.Type.Down ||
                        this._type === Tone.CtrlPattern.Type.DownUp ||
                        this._type === Tone.CtrlPattern.Type.AlternateDown) &&
                      (this.index = this.values.length - 1),
                  this._type === Tone.CtrlPattern.Type.UpDown ||
                  this._type === Tone.CtrlPattern.Type.AlternateUp
                    ? (this._direction = Tone.CtrlPattern.Type.Up)
                    : (this._type === Tone.CtrlPattern.Type.DownUp ||
                        this._type === Tone.CtrlPattern.Type.AlternateDown) &&
                      (this._direction = Tone.CtrlPattern.Type.Down),
                  this._type === Tone.CtrlPattern.Type.RandomOnce
                    ? this._shuffleValues()
                    : this._type === Tone.CtrlPattern.Random &&
                      (this.index = Math.floor(
                        Math.random() * this.values.length
                      ));
              }
            }),
            (Tone.CtrlPattern.prototype.next = function() {
              var type = this.type;
              return (
                type === Tone.CtrlPattern.Type.Up
                  ? (this.index++,
                    this.index >= this.values.length && (this.index = 0))
                  : type === Tone.CtrlPattern.Type.Down
                  ? (this.index--,
                    this.index < 0 && (this.index = this.values.length - 1))
                  : type === Tone.CtrlPattern.Type.UpDown ||
                    type === Tone.CtrlPattern.Type.DownUp
                  ? (this._direction === Tone.CtrlPattern.Type.Up
                      ? this.index++
                      : this.index--,
                    this.index < 0
                      ? ((this.index = 1),
                        (this._direction = Tone.CtrlPattern.Type.Up))
                      : this.index >= this.values.length &&
                        ((this.index = this.values.length - 2),
                        (this._direction = Tone.CtrlPattern.Type.Down)))
                  : type === Tone.CtrlPattern.Type.Random
                  ? (this.index = Math.floor(
                      Math.random() * this.values.length
                    ))
                  : type === Tone.CtrlPattern.Type.RandomWalk
                  ? Math.random() < 0.5
                    ? (this.index--, (this.index = Math.max(this.index, 0)))
                    : (this.index++,
                      (this.index = Math.min(
                        this.index,
                        this.values.length - 1
                      )))
                  : type === Tone.CtrlPattern.Type.RandomOnce
                  ? (this.index++,
                    this.index >= this.values.length &&
                      ((this.index = 0), this._shuffleValues()))
                  : type === Tone.CtrlPattern.Type.AlternateUp
                  ? (this._direction === Tone.CtrlPattern.Type.Up
                      ? ((this.index += 2),
                        (this._direction = Tone.CtrlPattern.Type.Down))
                      : ((this.index -= 1),
                        (this._direction = Tone.CtrlPattern.Type.Up)),
                    this.index >= this.values.length &&
                      ((this.index = 0),
                      (this._direction = Tone.CtrlPattern.Type.Up)))
                  : type === Tone.CtrlPattern.Type.AlternateDown &&
                    (this._direction === Tone.CtrlPattern.Type.Up
                      ? ((this.index += 1),
                        (this._direction = Tone.CtrlPattern.Type.Down))
                      : ((this.index -= 2),
                        (this._direction = Tone.CtrlPattern.Type.Up)),
                    this.index < 0 &&
                      ((this.index = this.values.length - 1),
                      (this._direction = Tone.CtrlPattern.Type.Down))),
                this.value
              );
            }),
            (Tone.CtrlPattern.prototype._shuffleValues = function() {
              var copy = [];
              this._shuffled = [];
              for (var i = 0; i < this.values.length; i++) copy[i] = i;
              for (; copy.length > 0; ) {
                var randVal = copy.splice(
                  Math.floor(copy.length * Math.random()),
                  1
                );
                this._shuffled.push(randVal[0]);
              }
            }),
            (Tone.CtrlPattern.prototype.dispose = function() {
              (this._shuffled = null), (this.values = null);
            }),
            Tone.CtrlPattern
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.CtrlRandom = function() {
              var options = this.optionsObject(
                arguments,
                ["min", "max"],
                Tone.CtrlRandom.defaults
              );
              (this.min = options.min),
                (this.max = options.max),
                (this.integer = options.integer);
            }),
            Tone.extend(Tone.CtrlRandom),
            (Tone.CtrlRandom.defaults = { min: 0, max: 1, integer: !1 }),
            Object.defineProperty(Tone.CtrlRandom.prototype, "value", {
              get: function() {
                var min = this.toSeconds(this.min),
                  max = this.toSeconds(this.max),
                  rand = Math.random(),
                  val = rand * min + (1 - rand) * max;
                return this.integer && (val = Math.floor(val)), val;
              }
            }),
            Tone.CtrlRandom
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Buffer = function() {
              var options = this.optionsObject(
                arguments,
                ["url", "onload"],
                Tone.Buffer.defaults
              );
              (this._buffer = null),
                (this._reversed = options.reverse),
                (this.url = void 0),
                (this.loaded = !1),
                (this.onload = options.onload.bind(this, this)),
                options.url instanceof AudioBuffer ||
                options.url instanceof Tone.Buffer
                  ? (this.set(options.url), this.onload(this))
                  : this.isString(options.url) &&
                    ((this.url = options.url),
                    Tone.Buffer._addToQueue(options.url, this));
            }),
            Tone.extend(Tone.Buffer),
            (Tone.Buffer.defaults = {
              url: void 0,
              onload: Tone.noOp,
              reverse: !1
            }),
            (Tone.Buffer.prototype.set = function(buffer) {
              return (
                (this._buffer =
                  buffer instanceof Tone.Buffer ? buffer.get() : buffer),
                (this.loaded = !0),
                this
              );
            }),
            (Tone.Buffer.prototype.get = function() {
              return this._buffer;
            }),
            (Tone.Buffer.prototype.load = function(url, callback) {
              return (
                (this.url = url),
                (this.onload = this.defaultArg(callback, this.onload)),
                Tone.Buffer._addToQueue(url, this),
                this
              );
            }),
            (Tone.Buffer.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                Tone.Buffer._removeFromQueue(this),
                (this._buffer = null),
                (this.onload = Tone.Buffer.defaults.onload),
                this
              );
            }),
            Object.defineProperty(Tone.Buffer.prototype, "duration", {
              get: function() {
                return this._buffer ? this._buffer.duration : 0;
              }
            }),
            (Tone.Buffer.prototype._reverse = function() {
              if (this.loaded)
                for (var i = 0; i < this._buffer.numberOfChannels; i++)
                  Array.prototype.reverse.call(this._buffer.getChannelData(i));
              return this;
            }),
            Object.defineProperty(Tone.Buffer.prototype, "reverse", {
              get: function() {
                return this._reversed;
              },
              set: function(rev) {
                this._reversed !== rev &&
                  ((this._reversed = rev), this._reverse());
              }
            }),
            Tone.Emitter.mixin(Tone.Buffer),
            (Tone.Buffer._queue = []),
            (Tone.Buffer._currentDownloads = []),
            (Tone.Buffer._totalDownloads = 0),
            (Tone.Buffer.MAX_SIMULTANEOUS_DOWNLOADS = 6),
            (Tone.Buffer._addToQueue = function(url, buffer) {
              Tone.Buffer._queue.push({
                url: url,
                Buffer: buffer,
                progress: 0,
                xhr: null
              }),
                this._totalDownloads++,
                Tone.Buffer._next();
            }),
            (Tone.Buffer._removeFromQueue = function(buffer) {
              var i;
              for (i = 0; i < Tone.Buffer._queue.length; i++) {
                var q = Tone.Buffer._queue[i];
                q.Buffer === buffer && Tone.Buffer._queue.splice(i, 1);
              }
              for (i = 0; i < Tone.Buffer._currentDownloads.length; i++) {
                var dl = Tone.Buffer._currentDownloads[i];
                dl.Buffer === buffer &&
                  (Tone.Buffer._currentDownloads.splice(i, 1),
                  dl.xhr.abort(),
                  (dl.xhr.onprogress = null),
                  (dl.xhr.onload = null),
                  (dl.xhr.onerror = null));
              }
            }),
            (Tone.Buffer._next = function() {
              if (Tone.Buffer._queue.length > 0) {
                if (
                  Tone.Buffer._currentDownloads.length <
                  Tone.Buffer.MAX_SIMULTANEOUS_DOWNLOADS
                ) {
                  var next = Tone.Buffer._queue.shift();
                  Tone.Buffer._currentDownloads.push(next),
                    (next.xhr = Tone.Buffer.load(next.url, function(buffer) {
                      var index = Tone.Buffer._currentDownloads.indexOf(next);
                      Tone.Buffer._currentDownloads.splice(index, 1),
                        next.Buffer.set(buffer),
                        next.Buffer._reversed && next.Buffer._reverse(),
                        next.Buffer.onload(next.Buffer),
                        Tone.Buffer._onprogress(),
                        Tone.Buffer._next();
                    })),
                    (next.xhr.onprogress = function(event) {
                      (next.progress = event.loaded / event.total),
                        Tone.Buffer._onprogress();
                    }),
                    (next.xhr.onerror = function(e) {
                      Tone.Buffer.trigger("error", e);
                    });
                }
              } else
                0 === Tone.Buffer._currentDownloads.length &&
                  (Tone.Buffer.trigger("load"),
                  (Tone.Buffer._totalDownloads = 0));
            }),
            (Tone.Buffer._onprogress = function() {
              var curretDownloadsProgress = 0,
                currentDLLen = Tone.Buffer._currentDownloads.length,
                inprogress = 0;
              if (currentDLLen > 0) {
                for (var i = 0; currentDLLen > i; i++) {
                  var dl = Tone.Buffer._currentDownloads[i];
                  curretDownloadsProgress += dl.progress;
                }
                inprogress = curretDownloadsProgress;
              }
              var currentDownloadProgress = currentDLLen - inprogress,
                completed =
                  Tone.Buffer._totalDownloads -
                  Tone.Buffer._queue.length -
                  currentDownloadProgress;
              Tone.Buffer.trigger(
                "progress",
                completed / Tone.Buffer._totalDownloads
              );
            }),
            (Tone.Buffer.baseUrl = ""),
            (Tone.Buffer.load = function(url, callback) {
              var request = new XMLHttpRequest();
              return (
                request.open("GET", Tone.Buffer.baseUrl + url, !0),
                (request.responseType = "arraybuffer"),
                (request.onload = function() {
                  Tone.context.decodeAudioData(
                    request.response,
                    function(buff) {
                      callback(buff);
                    },
                    function() {
                      throw new Error(
                        "Tone.Buffer: could not decode audio data:" + url
                      );
                    }
                  );
                }),
                request.send(),
                request
              );
            }),
            (Tone.Buffer.supportsType = function(url) {
              var extension = url.split(".");
              extension = extension[extension.length - 1];
              var response = document
                .createElement("audio")
                .canPlayType("audio/" + extension);
              return "" !== response;
            }),
            Tone.Buffer
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Buffers = function(urls, onload, baseUrl) {
              (this._buffers = {}),
                (this.baseUrl = this.defaultArg(baseUrl, "")),
                (urls = this._flattenUrls(urls)),
                (this._loadingCount = 0);
              for (var key in urls)
                this._loadingCount++,
                  this.add(
                    key,
                    urls[key],
                    this._bufferLoaded.bind(this, onload)
                  );
            }),
            Tone.extend(Tone.Buffers),
            (Tone.Buffers.prototype.get = function(name) {
              if (this._buffers.hasOwnProperty(name))
                return this._buffers[name];
              throw new Error("Tone.Buffers: no buffer named" + name);
            }),
            (Tone.Buffers.prototype._bufferLoaded = function(callback) {
              this._loadingCount--,
                0 === this._loadingCount && callback && callback(this);
            }),
            (Tone.Buffers.prototype.add = function(name, url, callback) {
              return (
                (callback = this.defaultArg(callback, Tone.noOp)),
                url instanceof Tone.Buffer
                  ? ((this._buffers[name] = url), callback(this))
                  : url instanceof AudioBuffer
                  ? ((this._buffers[name] = new Tone.Buffer(url)),
                    callback(this))
                  : this.isString(url) &&
                    (this._buffers[name] = new Tone.Buffer(
                      this.baseUrl + url,
                      callback
                    )),
                this
              );
            }),
            (Tone.Buffers.prototype._flattenUrls = function(ob) {
              var toReturn = {};
              for (var i in ob)
                if (ob.hasOwnProperty(i))
                  if (this.isObject(ob[i])) {
                    var flatObject = this._flattenUrls(ob[i]);
                    for (var x in flatObject)
                      flatObject.hasOwnProperty(x) &&
                        (toReturn[i + "." + x] = flatObject[x]);
                  } else toReturn[i] = ob[i];
              return toReturn;
            }),
            (Tone.Buffers.prototype.dispose = function() {
              for (var name in this._buffers) this._buffers[name].dispose();
              return (this._buffers = null), this;
            }),
            Tone.Buffers
          );
        }),
        Module(function(Tone) {
          var Buses = {};
          return (
            (Tone.prototype.send = function(channelName, amount) {
              Buses.hasOwnProperty(channelName) ||
                (Buses[channelName] = this.context.createGain());
              var sendKnob = this.context.createGain();
              return (
                (sendKnob.gain.value = this.dbToGain(
                  this.defaultArg(amount, 1)
                )),
                this.output.chain(sendKnob, Buses[channelName]),
                sendKnob
              );
            }),
            (Tone.prototype.receive = function(channelName, input) {
              return (
                Buses.hasOwnProperty(channelName) ||
                  (Buses[channelName] = this.context.createGain()),
                this.isUndef(input) && (input = this.input),
                Buses[channelName].connect(input),
                this
              );
            }),
            Tone
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Delay = function() {
              var options = this.optionsObject(
                arguments,
                ["delayTime", "maxDelay"],
                Tone.Delay.defaults
              );
              (this._delayNode = this.input = this.output = this.context.createDelay(
                this.toSeconds(options.maxDelay)
              )),
                (this.delayTime = new Tone.Param({
                  param: this._delayNode.delayTime,
                  units: Tone.Type.Time,
                  value: options.delayTime
                })),
                this._readOnly("delayTime");
            }),
            Tone.extend(Tone.Delay),
            (Tone.Delay.defaults = { maxDelay: 1, delayTime: 0 }),
            (Tone.Delay.prototype.dispose = function() {
              return (
                Tone.Param.prototype.dispose.call(this),
                this._delayNode.disconnect(),
                (this._delayNode = null),
                this._writable("delayTime"),
                (this.delayTime = null),
                this
              );
            }),
            Tone.Delay
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Event = function() {
              var options = this.optionsObject(
                arguments,
                ["callback", "value"],
                Tone.Event.defaults
              );
              (this._loop = options.loop),
                (this.callback = options.callback),
                (this.value = options.value),
                (this._loopStart = this.toTicks(options.loopStart)),
                (this._loopEnd = this.toTicks(options.loopEnd)),
                (this._state = new Tone.TimelineState(Tone.State.Stopped)),
                (this._playbackRate = 1),
                (this._startOffset = 0),
                (this.probability = options.probability),
                (this.humanize = options.humanize),
                (this.mute = options.mute),
                (this.playbackRate = options.playbackRate);
            }),
            Tone.extend(Tone.Event),
            (Tone.Event.defaults = {
              callback: Tone.noOp,
              loop: !1,
              loopEnd: "1m",
              loopStart: 0,
              playbackRate: 1,
              value: null,
              probability: 1,
              mute: !1,
              humanize: !1
            }),
            (Tone.Event.prototype._rescheduleEvents = function(after) {
              return (
                (after = this.defaultArg(after, -1)),
                this._state.forEachFrom(
                  after,
                  function(event) {
                    var duration;
                    if (event.state === Tone.State.Started) {
                      this.isUndef(event.id) || Tone.Transport.clear(event.id);
                      var startTick =
                        event.time +
                        Math.round(this.startOffset / this._playbackRate);
                      if (this._loop) {
                        (duration = 1 / 0),
                          this.isNumber(this._loop) &&
                            (duration = this._loop * this._getLoopDuration());
                        var nextEvent = this._state.getEventAfter(startTick);
                        null !== nextEvent &&
                          (duration = Math.min(
                            duration,
                            nextEvent.time - startTick
                          )),
                          1 / 0 !== duration &&
                            (this._state.setStateAtTime(
                              Tone.State.Stopped,
                              startTick + duration + 1
                            ),
                            (duration = Tone.Time(duration, "i")));
                        var interval = Tone.Time(this._getLoopDuration(), "i");
                        event.id = Tone.Transport.scheduleRepeat(
                          this._tick.bind(this),
                          interval,
                          Tone.TransportTime(startTick, "i"),
                          duration
                        );
                      } else
                        event.id = Tone.Transport.schedule(
                          this._tick.bind(this),
                          startTick + "i"
                        );
                    }
                  }.bind(this)
                ),
                this
              );
            }),
            Object.defineProperty(Tone.Event.prototype, "state", {
              get: function() {
                return this._state.getStateAtTime(Tone.Transport.ticks);
              }
            }),
            Object.defineProperty(Tone.Event.prototype, "startOffset", {
              get: function() {
                return this._startOffset;
              },
              set: function(offset) {
                this._startOffset = offset;
              }
            }),
            (Tone.Event.prototype.start = function(time) {
              return (
                (time = this.toTicks(time)),
                this._state.getStateAtTime(time) === Tone.State.Stopped &&
                  (this._state.addEvent({
                    state: Tone.State.Started,
                    time: time,
                    id: void 0
                  }),
                  this._rescheduleEvents(time)),
                this
              );
            }),
            (Tone.Event.prototype.stop = function(time) {
              if (
                (this.cancel(time),
                (time = this.toTicks(time)),
                this._state.getStateAtTime(time) === Tone.State.Started)
              ) {
                this._state.setStateAtTime(Tone.State.Stopped, time);
                var previousEvent = this._state.getEventBefore(time),
                  reschedulTime = time;
                null !== previousEvent && (reschedulTime = previousEvent.time),
                  this._rescheduleEvents(reschedulTime);
              }
              return this;
            }),
            (Tone.Event.prototype.cancel = function(time) {
              return (
                (time = this.defaultArg(time, -1 / 0)),
                (time = this.toTicks(time)),
                this._state.forEachFrom(time, function(event) {
                  Tone.Transport.clear(event.id);
                }),
                this._state.cancel(time),
                this
              );
            }),
            (Tone.Event.prototype._tick = function(time) {
              if (
                !this.mute &&
                this._state.getStateAtTime(Tone.Transport.ticks) ===
                  Tone.State.Started
              ) {
                if (this.probability < 1 && Math.random() > this.probability)
                  return;
                if (this.humanize) {
                  var variation = 0.02;
                  this.isBoolean(this.humanize) ||
                    (variation = this.toSeconds(this.humanize)),
                    (time += (2 * Math.random() - 1) * variation);
                }
                this.callback(time, this.value);
              }
            }),
            (Tone.Event.prototype._getLoopDuration = function() {
              return Math.round(
                (this._loopEnd - this._loopStart) / this._playbackRate
              );
            }),
            Object.defineProperty(Tone.Event.prototype, "loop", {
              get: function() {
                return this._loop;
              },
              set: function(loop) {
                (this._loop = loop), this._rescheduleEvents();
              }
            }),
            Object.defineProperty(Tone.Event.prototype, "playbackRate", {
              get: function() {
                return this._playbackRate;
              },
              set: function(rate) {
                (this._playbackRate = rate), this._rescheduleEvents();
              }
            }),
            Object.defineProperty(Tone.Event.prototype, "loopEnd", {
              get: function() {
                return Tone.TransportTime(this._loopEnd, "i").toNotation();
              },
              set: function(loopEnd) {
                (this._loopEnd = this.toTicks(loopEnd)),
                  this._loop && this._rescheduleEvents();
              }
            }),
            Object.defineProperty(Tone.Event.prototype, "loopStart", {
              get: function() {
                return Tone.TransportTime(this._loopStart, "i").toNotation();
              },
              set: function(loopStart) {
                (this._loopStart = this.toTicks(loopStart)),
                  this._loop && this._rescheduleEvents();
              }
            }),
            Object.defineProperty(Tone.Event.prototype, "progress", {
              get: function() {
                if (this._loop) {
                  var ticks = Tone.Transport.ticks,
                    lastEvent = this._state.getEvent(ticks);
                  if (
                    null !== lastEvent &&
                    lastEvent.state === Tone.State.Started
                  ) {
                    var loopDuration = this._getLoopDuration(),
                      progress = (ticks - lastEvent.time) % loopDuration;
                    return progress / loopDuration;
                  }
                  return 0;
                }
                return 0;
              }
            }),
            (Tone.Event.prototype.dispose = function() {
              this.cancel(),
                this._state.dispose(),
                (this._state = null),
                (this.callback = null),
                (this.value = null);
            }),
            Tone.Event
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Loop = function() {
              var options = this.optionsObject(
                arguments,
                ["callback", "interval"],
                Tone.Loop.defaults
              );
              (this._event = new Tone.Event({
                callback: this._tick.bind(this),
                loop: !0,
                loopEnd: options.interval,
                playbackRate: options.playbackRate,
                probability: options.probability
              })),
                (this.callback = options.callback),
                (this.iterations = options.iterations);
            }),
            Tone.extend(Tone.Loop),
            (Tone.Loop.defaults = {
              interval: "4n",
              callback: Tone.noOp,
              playbackRate: 1,
              iterations: 1 / 0,
              probability: !0,
              mute: !1
            }),
            (Tone.Loop.prototype.start = function(time) {
              return this._event.start(time), this;
            }),
            (Tone.Loop.prototype.stop = function(time) {
              return this._event.stop(time), this;
            }),
            (Tone.Loop.prototype.cancel = function(time) {
              return this._event.cancel(time), this;
            }),
            (Tone.Loop.prototype._tick = function(time) {
              this.callback(time);
            }),
            Object.defineProperty(Tone.Loop.prototype, "state", {
              get: function() {
                return this._event.state;
              }
            }),
            Object.defineProperty(Tone.Loop.prototype, "progress", {
              get: function() {
                return this._event.progress;
              }
            }),
            Object.defineProperty(Tone.Loop.prototype, "interval", {
              get: function() {
                return this._event.loopEnd;
              },
              set: function(interval) {
                this._event.loopEnd = interval;
              }
            }),
            Object.defineProperty(Tone.Loop.prototype, "playbackRate", {
              get: function() {
                return this._event.playbackRate;
              },
              set: function(rate) {
                this._event.playbackRate = rate;
              }
            }),
            Object.defineProperty(Tone.Loop.prototype, "humanize", {
              get: function() {
                return this._event.humanize;
              },
              set: function(variation) {
                this._event.humanize = variation;
              }
            }),
            Object.defineProperty(Tone.Loop.prototype, "probability", {
              get: function() {
                return this._event.probability;
              },
              set: function(prob) {
                this._event.probability = prob;
              }
            }),
            Object.defineProperty(Tone.Loop.prototype, "mute", {
              get: function() {
                return this._event.mute;
              },
              set: function(mute) {
                this._event.mute = mute;
              }
            }),
            Object.defineProperty(Tone.Loop.prototype, "iterations", {
              get: function() {
                return this._event.loop === !0 ? 1 / 0 : this._event.loop;
              },
              set: function(iters) {
                this._event.loop = 1 / 0 === iters ? !0 : iters;
              }
            }),
            (Tone.Loop.prototype.dispose = function() {
              this._event.dispose(),
                (this._event = null),
                (this.callback = null);
            }),
            Tone.Loop
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Part = function() {
              var options = this.optionsObject(
                arguments,
                ["callback", "events"],
                Tone.Part.defaults
              );
              (this._loop = options.loop),
                (this._loopStart = this.toTicks(options.loopStart)),
                (this._loopEnd = this.toTicks(options.loopEnd)),
                (this._playbackRate = options.playbackRate),
                (this._probability = options.probability),
                (this._humanize = options.humanize),
                (this._startOffset = 0),
                (this._state = new Tone.TimelineState(Tone.State.Stopped)),
                (this._events = []),
                (this.callback = options.callback),
                (this.mute = options.mute);
              var events = this.defaultArg(options.events, []);
              if (!this.isUndef(options.events))
                for (var i = 0; i < events.length; i++)
                  Array.isArray(events[i])
                    ? this.add(events[i][0], events[i][1])
                    : this.add(events[i]);
            }),
            Tone.extend(Tone.Part, Tone.Event),
            (Tone.Part.defaults = {
              callback: Tone.noOp,
              loop: !1,
              loopEnd: "1m",
              loopStart: 0,
              playbackRate: 1,
              probability: 1,
              humanize: !1,
              mute: !1
            }),
            (Tone.Part.prototype.start = function(time, offset) {
              var ticks = this.toTicks(time);
              return (
                this._state.getStateAtTime(ticks) !== Tone.State.Started &&
                  ((offset = this._loop
                    ? this.defaultArg(offset, this._loopStart)
                    : this.defaultArg(offset, 0)),
                  (offset = this.toTicks(offset)),
                  this._state.addEvent({
                    state: Tone.State.Started,
                    time: ticks,
                    offset: offset
                  }),
                  this._forEach(function(event) {
                    this._startNote(event, ticks, offset);
                  })),
                this
              );
            }),
            (Tone.Part.prototype._startNote = function(event, ticks, offset) {
              (ticks -= offset),
                this._loop
                  ? event.startOffset >= this._loopStart &&
                    event.startOffset < this._loopEnd
                    ? (event.startOffset < offset &&
                        (ticks += this._getLoopDuration()),
                      event.start(Tone.TransportTime(ticks, "i")))
                    : event.startOffset < this._loopStart &&
                      event.startOffset >= offset &&
                      ((event.loop = !1),
                      event.start(Tone.TransportTime(ticks, "i")))
                  : event.startOffset >= offset &&
                    event.start(Tone.TransportTime(ticks, "i"));
            }),
            Object.defineProperty(Tone.Part.prototype, "startOffset", {
              get: function() {
                return this._startOffset;
              },
              set: function(offset) {
                (this._startOffset = offset),
                  this._forEach(function(event) {
                    event.startOffset += this._startOffset;
                  });
              }
            }),
            (Tone.Part.prototype.stop = function(time) {
              var ticks = this.toTicks(time);
              return (
                this._state.cancel(ticks),
                this._state.setStateAtTime(Tone.State.Stopped, ticks),
                this._forEach(function(event) {
                  event.stop(time);
                }),
                this
              );
            }),
            (Tone.Part.prototype.at = function(time, value) {
              time = Tone.TransportTime(time);
              for (
                var tickTime = Tone.Time(1, "i").toSeconds(), i = 0;
                i < this._events.length;
                i++
              ) {
                var event = this._events[i];
                if (Math.abs(time.toTicks() - event.startOffset) < tickTime)
                  return this.isUndef(value) || (event.value = value), event;
              }
              return this.isUndef(value)
                ? null
                : (this.add(time, value),
                  this._events[this._events.length - 1]);
            }),
            (Tone.Part.prototype.add = function(time, value) {
              this.isObject(time) &&
                time.hasOwnProperty("time") &&
                ((value = time), (time = value.time), delete value.time),
                (time = this.toTicks(time));
              var event;
              return (
                value instanceof Tone.Event
                  ? ((event = value), (event.callback = this._tick.bind(this)))
                  : (event = new Tone.Event({
                      callback: this._tick.bind(this),
                      value: value
                    })),
                (event.startOffset = time),
                event.set({
                  loopEnd: this.loopEnd,
                  loopStart: this.loopStart,
                  loop: this.loop,
                  humanize: this.humanize,
                  playbackRate: this.playbackRate,
                  probability: this.probability
                }),
                this._events.push(event),
                this._restartEvent(event),
                this
              );
            }),
            (Tone.Part.prototype._restartEvent = function(event) {
              var stateEvent = this._state.getEvent(this.now());
              stateEvent &&
                stateEvent.state === Tone.State.Started &&
                this._startNote(event, stateEvent.time, stateEvent.offset);
            }),
            (Tone.Part.prototype.remove = function(time, value) {
              this.isObject(time) &&
                time.hasOwnProperty("time") &&
                ((value = time), (time = value.time)),
                (time = this.toTicks(time));
              for (var i = this._events.length - 1; i >= 0; i--) {
                var event = this._events[i];
                event instanceof Tone.Part
                  ? event.remove(time, value)
                  : event.startOffset === time &&
                    (this.isUndef(value) ||
                      (!this.isUndef(value) && event.value === value)) &&
                    (this._events.splice(i, 1), event.dispose());
              }
              return this;
            }),
            (Tone.Part.prototype.removeAll = function() {
              return (
                this._forEach(function(event) {
                  event.dispose();
                }),
                (this._events = []),
                this
              );
            }),
            (Tone.Part.prototype.cancel = function(after) {
              return (
                this._forEach(function(event) {
                  event.cancel(after);
                }),
                this._state.cancel(after),
                this
              );
            }),
            (Tone.Part.prototype._forEach = function(callback, ctx) {
              ctx = this.defaultArg(ctx, this);
              for (var i = this._events.length - 1; i >= 0; i--) {
                var e = this._events[i];
                e instanceof Tone.Part
                  ? e._forEach(callback, ctx)
                  : callback.call(ctx, e);
              }
              return this;
            }),
            (Tone.Part.prototype._setAll = function(attr, value) {
              this._forEach(function(event) {
                event[attr] = value;
              });
            }),
            (Tone.Part.prototype._tick = function(time, value) {
              this.mute || this.callback(time, value);
            }),
            (Tone.Part.prototype._testLoopBoundries = function(event) {
              event.startOffset < this._loopStart ||
              event.startOffset >= this._loopEnd
                ? event.cancel()
                : event.state === Tone.State.Stopped &&
                  this._restartEvent(event);
            }),
            Object.defineProperty(Tone.Part.prototype, "probability", {
              get: function() {
                return this._probability;
              },
              set: function(prob) {
                (this._probability = prob), this._setAll("probability", prob);
              }
            }),
            Object.defineProperty(Tone.Part.prototype, "humanize", {
              get: function() {
                return this._humanize;
              },
              set: function(variation) {
                (this._humanize = variation),
                  this._setAll("humanize", variation);
              }
            }),
            Object.defineProperty(Tone.Part.prototype, "loop", {
              get: function() {
                return this._loop;
              },
              set: function(loop) {
                (this._loop = loop),
                  this._forEach(function(event) {
                    (event._loopStart = this._loopStart),
                      (event._loopEnd = this._loopEnd),
                      (event.loop = loop),
                      this._testLoopBoundries(event);
                  });
              }
            }),
            Object.defineProperty(Tone.Part.prototype, "loopEnd", {
              get: function() {
                return Tone.TransportTime(this._loopEnd, "i").toNotation();
              },
              set: function(loopEnd) {
                (this._loopEnd = this.toTicks(loopEnd)),
                  this._loop &&
                    this._forEach(function(event) {
                      (event.loopEnd = this.loopEnd),
                        this._testLoopBoundries(event);
                    });
              }
            }),
            Object.defineProperty(Tone.Part.prototype, "loopStart", {
              get: function() {
                return Tone.TransportTime(this._loopStart, "i").toNotation();
              },
              set: function(loopStart) {
                (this._loopStart = this.toTicks(loopStart)),
                  this._loop &&
                    this._forEach(function(event) {
                      (event.loopStart = this.loopStart),
                        this._testLoopBoundries(event);
                    });
              }
            }),
            Object.defineProperty(Tone.Part.prototype, "playbackRate", {
              get: function() {
                return this._playbackRate;
              },
              set: function(rate) {
                (this._playbackRate = rate), this._setAll("playbackRate", rate);
              }
            }),
            Object.defineProperty(Tone.Part.prototype, "length", {
              get: function() {
                return this._events.length;
              }
            }),
            (Tone.Part.prototype.dispose = function() {
              return (
                this.removeAll(),
                this._state.dispose(),
                (this._state = null),
                (this.callback = null),
                (this._events = null),
                this
              );
            }),
            Tone.Part
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Pattern = function() {
              var options = this.optionsObject(
                arguments,
                ["callback", "values", "pattern"],
                Tone.Pattern.defaults
              );
              Tone.Loop.call(this, options),
                (this._pattern = new Tone.CtrlPattern({
                  values: options.values,
                  type: options.pattern,
                  index: options.index
                }));
            }),
            Tone.extend(Tone.Pattern, Tone.Loop),
            (Tone.Pattern.defaults = {
              pattern: Tone.CtrlPattern.Type.Up,
              values: []
            }),
            (Tone.Pattern.prototype._tick = function(time) {
              this.callback(time, this._pattern.value), this._pattern.next();
            }),
            Object.defineProperty(Tone.Pattern.prototype, "index", {
              get: function() {
                return this._pattern.index;
              },
              set: function(i) {
                this._pattern.index = i;
              }
            }),
            Object.defineProperty(Tone.Pattern.prototype, "values", {
              get: function() {
                return this._pattern.values;
              },
              set: function(vals) {
                this._pattern.values = vals;
              }
            }),
            Object.defineProperty(Tone.Pattern.prototype, "value", {
              get: function() {
                return this._pattern.value;
              }
            }),
            Object.defineProperty(Tone.Pattern.prototype, "pattern", {
              get: function() {
                return this._pattern.type;
              },
              set: function(pattern) {
                this._pattern.type = pattern;
              }
            }),
            (Tone.Pattern.prototype.dispose = function() {
              Tone.Loop.prototype.dispose.call(this),
                this._pattern.dispose(),
                (this._pattern = null);
            }),
            Tone.Pattern
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Sequence = function() {
              var options = this.optionsObject(
                  arguments,
                  ["callback", "events", "subdivision"],
                  Tone.Sequence.defaults
                ),
                events = options.events;
              if (
                (delete options.events,
                Tone.Part.call(this, options),
                (this._subdivision = this.toTicks(options.subdivision)),
                this.isUndef(options.loopEnd) &&
                  !this.isUndef(events) &&
                  (this._loopEnd = events.length * this._subdivision),
                (this._loop = !0),
                !this.isUndef(events))
              )
                for (var i = 0; i < events.length; i++) this.add(i, events[i]);
            }),
            Tone.extend(Tone.Sequence, Tone.Part),
            (Tone.Sequence.defaults = { subdivision: "4n" }),
            Object.defineProperty(Tone.Sequence.prototype, "subdivision", {
              get: function() {
                return Tone.Time(this._subdivision, "i").toNotation();
              }
            }),
            (Tone.Sequence.prototype.at = function(index, value) {
              return (
                this.isArray(value) && this.remove(index),
                Tone.Part.prototype.at.call(this, this._indexTime(index), value)
              );
            }),
            (Tone.Sequence.prototype.add = function(index, value) {
              if (null === value) return this;
              if (this.isArray(value)) {
                var subSubdivision = Math.round(
                  this._subdivision / value.length
                );
                value = new Tone.Sequence(
                  this._tick.bind(this),
                  value,
                  Tone.Time(subSubdivision, "i")
                );
              }
              return (
                Tone.Part.prototype.add.call(
                  this,
                  this._indexTime(index),
                  value
                ),
                this
              );
            }),
            (Tone.Sequence.prototype.remove = function(index, value) {
              return (
                Tone.Part.prototype.remove.call(
                  this,
                  this._indexTime(index),
                  value
                ),
                this
              );
            }),
            (Tone.Sequence.prototype._indexTime = function(index) {
              return index instanceof Tone.TransportTime
                ? index
                : Tone.TransportTime(
                    index * this._subdivision + this.startOffset,
                    "i"
                  );
            }),
            (Tone.Sequence.prototype.dispose = function() {
              return Tone.Part.prototype.dispose.call(this), this;
            }),
            Tone.Sequence
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Effect = function() {
              Tone.call(this);
              var options = this.optionsObject(
                arguments,
                ["wet"],
                Tone.Effect.defaults
              );
              (this._dryWet = new Tone.CrossFade(options.wet)),
                (this.wet = this._dryWet.fade),
                (this.effectSend = this.context.createGain()),
                (this.effectReturn = this.context.createGain()),
                this.input.connect(this._dryWet.a),
                this.input.connect(this.effectSend),
                this.effectReturn.connect(this._dryWet.b),
                this._dryWet.connect(this.output),
                this._readOnly(["wet"]);
            }),
            Tone.extend(Tone.Effect),
            (Tone.Effect.defaults = { wet: 1 }),
            (Tone.Effect.prototype.connectEffect = function(effect) {
              return this.effectSend.chain(effect, this.effectReturn), this;
            }),
            (Tone.Effect.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._dryWet.dispose(),
                (this._dryWet = null),
                this.effectSend.disconnect(),
                (this.effectSend = null),
                this.effectReturn.disconnect(),
                (this.effectReturn = null),
                this._writable(["wet"]),
                (this.wet = null),
                this
              );
            }),
            Tone.Effect
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.AutoFilter = function() {
              var options = this.optionsObject(
                arguments,
                ["frequency", "baseFrequency", "octaves"],
                Tone.AutoFilter.defaults
              );
              Tone.Effect.call(this, options),
                (this._lfo = new Tone.LFO({
                  frequency: options.frequency,
                  amplitude: options.depth
                })),
                (this.depth = this._lfo.amplitude),
                (this.frequency = this._lfo.frequency),
                (this.filter = new Tone.Filter(options.filter)),
                (this._octaves = 0),
                this.connectEffect(this.filter),
                this._lfo.connect(this.filter.frequency),
                (this.type = options.type),
                this._readOnly(["frequency", "depth"]),
                (this.octaves = options.octaves),
                (this.baseFrequency = options.baseFrequency);
            }),
            Tone.extend(Tone.AutoFilter, Tone.Effect),
            (Tone.AutoFilter.defaults = {
              frequency: 1,
              type: "sine",
              depth: 1,
              baseFrequency: 200,
              octaves: 2.6,
              filter: { type: "lowpass", rolloff: -12, Q: 1 }
            }),
            (Tone.AutoFilter.prototype.start = function(time) {
              return this._lfo.start(time), this;
            }),
            (Tone.AutoFilter.prototype.stop = function(time) {
              return this._lfo.stop(time), this;
            }),
            (Tone.AutoFilter.prototype.sync = function(delay) {
              return this._lfo.sync(delay), this;
            }),
            (Tone.AutoFilter.prototype.unsync = function() {
              return this._lfo.unsync(), this;
            }),
            Object.defineProperty(Tone.AutoFilter.prototype, "type", {
              get: function() {
                return this._lfo.type;
              },
              set: function(type) {
                this._lfo.type = type;
              }
            }),
            Object.defineProperty(Tone.AutoFilter.prototype, "baseFrequency", {
              get: function() {
                return this._lfo.min;
              },
              set: function(freq) {
                this._lfo.min = this.toFrequency(freq);
              }
            }),
            Object.defineProperty(Tone.AutoFilter.prototype, "octaves", {
              get: function() {
                return this._octaves;
              },
              set: function(oct) {
                (this._octaves = oct),
                  (this._lfo.max = this.baseFrequency * Math.pow(2, oct));
              }
            }),
            (Tone.AutoFilter.prototype.dispose = function() {
              return (
                Tone.Effect.prototype.dispose.call(this),
                this._lfo.dispose(),
                (this._lfo = null),
                this.filter.dispose(),
                (this.filter = null),
                this._writable(["frequency", "depth"]),
                (this.frequency = null),
                (this.depth = null),
                this
              );
            }),
            Tone.AutoFilter
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.AutoPanner = function() {
              var options = this.optionsObject(
                arguments,
                ["frequency"],
                Tone.AutoPanner.defaults
              );
              Tone.Effect.call(this, options),
                (this._lfo = new Tone.LFO({
                  frequency: options.frequency,
                  amplitude: options.depth,
                  min: 0,
                  max: 1
                })),
                (this.depth = this._lfo.amplitude),
                (this._panner = new Tone.Panner()),
                (this.frequency = this._lfo.frequency),
                this.connectEffect(this._panner),
                this._lfo.connect(this._panner.pan),
                (this.type = options.type),
                this._readOnly(["depth", "frequency"]);
            }),
            Tone.extend(Tone.AutoPanner, Tone.Effect),
            (Tone.AutoPanner.defaults = {
              frequency: 1,
              type: "sine",
              depth: 1
            }),
            (Tone.AutoPanner.prototype.start = function(time) {
              return this._lfo.start(time), this;
            }),
            (Tone.AutoPanner.prototype.stop = function(time) {
              return this._lfo.stop(time), this;
            }),
            (Tone.AutoPanner.prototype.sync = function(delay) {
              return this._lfo.sync(delay), this;
            }),
            (Tone.AutoPanner.prototype.unsync = function() {
              return this._lfo.unsync(), this;
            }),
            Object.defineProperty(Tone.AutoPanner.prototype, "type", {
              get: function() {
                return this._lfo.type;
              },
              set: function(type) {
                this._lfo.type = type;
              }
            }),
            (Tone.AutoPanner.prototype.dispose = function() {
              return (
                Tone.Effect.prototype.dispose.call(this),
                this._lfo.dispose(),
                (this._lfo = null),
                this._panner.dispose(),
                (this._panner = null),
                this._writable(["depth", "frequency"]),
                (this.frequency = null),
                (this.depth = null),
                this
              );
            }),
            Tone.AutoPanner
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.AutoWah = function() {
              var options = this.optionsObject(
                arguments,
                ["baseFrequency", "octaves", "sensitivity"],
                Tone.AutoWah.defaults
              );
              Tone.Effect.call(this, options),
                (this.follower = new Tone.Follower(options.follower)),
                (this._sweepRange = new Tone.ScaleExp(0, 1, 0.5)),
                (this._baseFrequency = options.baseFrequency),
                (this._octaves = options.octaves),
                (this._inputBoost = this.context.createGain()),
                (this._bandpass = new Tone.Filter({
                  rolloff: -48,
                  frequency: 0,
                  Q: options.Q
                })),
                (this._peaking = new Tone.Filter(0, "peaking")),
                (this._peaking.gain.value = options.gain),
                (this.gain = this._peaking.gain),
                (this.Q = this._bandpass.Q),
                this.effectSend.chain(
                  this._inputBoost,
                  this.follower,
                  this._sweepRange
                ),
                this._sweepRange.connect(this._bandpass.frequency),
                this._sweepRange.connect(this._peaking.frequency),
                this.effectSend.chain(
                  this._bandpass,
                  this._peaking,
                  this.effectReturn
                ),
                this._setSweepRange(),
                (this.sensitivity = options.sensitivity),
                this._readOnly(["gain", "Q"]);
            }),
            Tone.extend(Tone.AutoWah, Tone.Effect),
            (Tone.AutoWah.defaults = {
              baseFrequency: 100,
              octaves: 6,
              sensitivity: 0,
              Q: 2,
              gain: 2,
              follower: { attack: 0.3, release: 0.5 }
            }),
            Object.defineProperty(Tone.AutoWah.prototype, "octaves", {
              get: function() {
                return this._octaves;
              },
              set: function(octaves) {
                (this._octaves = octaves), this._setSweepRange();
              }
            }),
            Object.defineProperty(Tone.AutoWah.prototype, "baseFrequency", {
              get: function() {
                return this._baseFrequency;
              },
              set: function(baseFreq) {
                (this._baseFrequency = baseFreq), this._setSweepRange();
              }
            }),
            Object.defineProperty(Tone.AutoWah.prototype, "sensitivity", {
              get: function() {
                return this.gainToDb(1 / this._inputBoost.gain.value);
              },
              set: function(sensitivy) {
                this._inputBoost.gain.value = 1 / this.dbToGain(sensitivy);
              }
            }),
            (Tone.AutoWah.prototype._setSweepRange = function() {
              (this._sweepRange.min = this._baseFrequency),
                (this._sweepRange.max = Math.min(
                  this._baseFrequency * Math.pow(2, this._octaves),
                  this.context.sampleRate / 2
                ));
            }),
            (Tone.AutoWah.prototype.dispose = function() {
              return (
                Tone.Effect.prototype.dispose.call(this),
                this.follower.dispose(),
                (this.follower = null),
                this._sweepRange.dispose(),
                (this._sweepRange = null),
                this._bandpass.dispose(),
                (this._bandpass = null),
                this._peaking.dispose(),
                (this._peaking = null),
                this._inputBoost.disconnect(),
                (this._inputBoost = null),
                this._writable(["gain", "Q"]),
                (this.gain = null),
                (this.Q = null),
                this
              );
            }),
            Tone.AutoWah
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.BitCrusher = function() {
              var options = this.optionsObject(
                arguments,
                ["bits"],
                Tone.BitCrusher.defaults
              );
              Tone.Effect.call(this, options);
              var invStepSize = 1 / Math.pow(2, options.bits - 1);
              (this._subtract = new Tone.Subtract()),
                (this._modulo = new Tone.Modulo(invStepSize)),
                (this._bits = options.bits),
                this.effectSend.fan(this._subtract, this._modulo),
                this._modulo.connect(this._subtract, 0, 1),
                this._subtract.connect(this.effectReturn);
            }),
            Tone.extend(Tone.BitCrusher, Tone.Effect),
            (Tone.BitCrusher.defaults = { bits: 4 }),
            Object.defineProperty(Tone.BitCrusher.prototype, "bits", {
              get: function() {
                return this._bits;
              },
              set: function(bits) {
                this._bits = bits;
                var invStepSize = 1 / Math.pow(2, bits - 1);
                this._modulo.value = invStepSize;
              }
            }),
            (Tone.BitCrusher.prototype.dispose = function() {
              return (
                Tone.Effect.prototype.dispose.call(this),
                this._subtract.dispose(),
                (this._subtract = null),
                this._modulo.dispose(),
                (this._modulo = null),
                this
              );
            }),
            Tone.BitCrusher
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Chebyshev = function() {
              var options = this.optionsObject(
                arguments,
                ["order"],
                Tone.Chebyshev.defaults
              );
              Tone.Effect.call(this, options),
                (this._shaper = new Tone.WaveShaper(4096)),
                (this._order = options.order),
                this.connectEffect(this._shaper),
                (this.order = options.order),
                (this.oversample = options.oversample);
            }),
            Tone.extend(Tone.Chebyshev, Tone.Effect),
            (Tone.Chebyshev.defaults = { order: 1, oversample: "none" }),
            (Tone.Chebyshev.prototype._getCoefficient = function(
              x,
              degree,
              memo
            ) {
              return memo.hasOwnProperty(degree)
                ? memo[degree]
                : ((memo[degree] =
                    0 === degree
                      ? 0
                      : 1 === degree
                      ? x
                      : 2 * x * this._getCoefficient(x, degree - 1, memo) -
                        this._getCoefficient(x, degree - 2, memo)),
                  memo[degree]);
            }),
            Object.defineProperty(Tone.Chebyshev.prototype, "order", {
              get: function() {
                return this._order;
              },
              set: function(order) {
                this._order = order;
                for (
                  var curve = new Array(4096), len = curve.length, i = 0;
                  len > i;
                  ++i
                ) {
                  var x = (2 * i) / len - 1;
                  curve[i] = 0 === x ? 0 : this._getCoefficient(x, order, {});
                }
                this._shaper.curve = curve;
              }
            }),
            Object.defineProperty(Tone.Chebyshev.prototype, "oversample", {
              get: function() {
                return this._shaper.oversample;
              },
              set: function(oversampling) {
                this._shaper.oversample = oversampling;
              }
            }),
            (Tone.Chebyshev.prototype.dispose = function() {
              return (
                Tone.Effect.prototype.dispose.call(this),
                this._shaper.dispose(),
                (this._shaper = null),
                this
              );
            }),
            Tone.Chebyshev
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.StereoEffect = function() {
              Tone.call(this);
              var options = this.optionsObject(
                arguments,
                ["wet"],
                Tone.Effect.defaults
              );
              (this._dryWet = new Tone.CrossFade(options.wet)),
                (this.wet = this._dryWet.fade),
                (this._split = new Tone.Split()),
                (this.effectSendL = this._split.left),
                (this.effectSendR = this._split.right),
                (this._merge = new Tone.Merge()),
                (this.effectReturnL = this._merge.left),
                (this.effectReturnR = this._merge.right),
                this.input.connect(this._split),
                this.input.connect(this._dryWet, 0, 0),
                this._merge.connect(this._dryWet, 0, 1),
                this._dryWet.connect(this.output),
                this._readOnly(["wet"]);
            }),
            Tone.extend(Tone.StereoEffect, Tone.Effect),
            (Tone.StereoEffect.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._dryWet.dispose(),
                (this._dryWet = null),
                this._split.dispose(),
                (this._split = null),
                this._merge.dispose(),
                (this._merge = null),
                (this.effectSendL = null),
                (this.effectSendR = null),
                (this.effectReturnL = null),
                (this.effectReturnR = null),
                this._writable(["wet"]),
                (this.wet = null),
                this
              );
            }),
            Tone.StereoEffect
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.FeedbackEffect = function() {
              var options = this.optionsObject(arguments, ["feedback"]);
              (options = this.defaultArg(
                options,
                Tone.FeedbackEffect.defaults
              )),
                Tone.Effect.call(this, options),
                (this.feedback = new Tone.Signal(
                  options.feedback,
                  Tone.Type.NormalRange
                )),
                (this._feedbackGain = this.context.createGain()),
                this.effectReturn.chain(this._feedbackGain, this.effectSend),
                this.feedback.connect(this._feedbackGain.gain),
                this._readOnly(["feedback"]);
            }),
            Tone.extend(Tone.FeedbackEffect, Tone.Effect),
            (Tone.FeedbackEffect.defaults = { feedback: 0.125 }),
            (Tone.FeedbackEffect.prototype.dispose = function() {
              return (
                Tone.Effect.prototype.dispose.call(this),
                this._writable(["feedback"]),
                this.feedback.dispose(),
                (this.feedback = null),
                this._feedbackGain.disconnect(),
                (this._feedbackGain = null),
                this
              );
            }),
            Tone.FeedbackEffect
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.StereoXFeedbackEffect = function() {
              var options = this.optionsObject(
                arguments,
                ["feedback"],
                Tone.FeedbackEffect.defaults
              );
              Tone.StereoEffect.call(this, options),
                (this.feedback = new Tone.Signal(
                  options.feedback,
                  Tone.Type.NormalRange
                )),
                (this._feedbackLR = this.context.createGain()),
                (this._feedbackRL = this.context.createGain()),
                this.effectReturnL.chain(this._feedbackLR, this.effectSendR),
                this.effectReturnR.chain(this._feedbackRL, this.effectSendL),
                this.feedback.fan(this._feedbackLR.gain, this._feedbackRL.gain),
                this._readOnly(["feedback"]);
            }),
            Tone.extend(Tone.StereoXFeedbackEffect, Tone.FeedbackEffect),
            (Tone.StereoXFeedbackEffect.prototype.dispose = function() {
              return (
                Tone.StereoEffect.prototype.dispose.call(this),
                this._writable(["feedback"]),
                this.feedback.dispose(),
                (this.feedback = null),
                this._feedbackLR.disconnect(),
                (this._feedbackLR = null),
                this._feedbackRL.disconnect(),
                (this._feedbackRL = null),
                this
              );
            }),
            Tone.StereoXFeedbackEffect
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Chorus = function() {
              var options = this.optionsObject(
                arguments,
                ["frequency", "delayTime", "depth"],
                Tone.Chorus.defaults
              );
              Tone.StereoXFeedbackEffect.call(this, options),
                (this._depth = options.depth),
                (this._delayTime = options.delayTime / 1e3),
                (this._lfoL = new Tone.LFO({
                  frequency: options.frequency,
                  min: 0,
                  max: 1
                })),
                (this._lfoR = new Tone.LFO({
                  frequency: options.frequency,
                  min: 0,
                  max: 1,
                  phase: 180
                })),
                (this._delayNodeL = this.context.createDelay()),
                (this._delayNodeR = this.context.createDelay()),
                (this.frequency = this._lfoL.frequency),
                this.effectSendL.chain(this._delayNodeL, this.effectReturnL),
                this.effectSendR.chain(this._delayNodeR, this.effectReturnR),
                this.effectSendL.connect(this.effectReturnL),
                this.effectSendR.connect(this.effectReturnR),
                this._lfoL.connect(this._delayNodeL.delayTime),
                this._lfoR.connect(this._delayNodeR.delayTime),
                this._lfoL.start(),
                this._lfoR.start(),
                this._lfoL.frequency.connect(this._lfoR.frequency),
                (this.depth = this._depth),
                (this.frequency.value = options.frequency),
                (this.type = options.type),
                this._readOnly(["frequency"]),
                (this.spread = options.spread);
            }),
            Tone.extend(Tone.Chorus, Tone.StereoXFeedbackEffect),
            (Tone.Chorus.defaults = {
              frequency: 1.5,
              delayTime: 3.5,
              depth: 0.7,
              feedback: 0.1,
              type: "sine",
              spread: 180
            }),
            Object.defineProperty(Tone.Chorus.prototype, "depth", {
              get: function() {
                return this._depth;
              },
              set: function(depth) {
                this._depth = depth;
                var deviation = this._delayTime * depth;
                (this._lfoL.min = Math.max(this._delayTime - deviation, 0)),
                  (this._lfoL.max = this._delayTime + deviation),
                  (this._lfoR.min = Math.max(this._delayTime - deviation, 0)),
                  (this._lfoR.max = this._delayTime + deviation);
              }
            }),
            Object.defineProperty(Tone.Chorus.prototype, "delayTime", {
              get: function() {
                return 1e3 * this._delayTime;
              },
              set: function(delayTime) {
                (this._delayTime = delayTime / 1e3), (this.depth = this._depth);
              }
            }),
            Object.defineProperty(Tone.Chorus.prototype, "type", {
              get: function() {
                return this._lfoL.type;
              },
              set: function(type) {
                (this._lfoL.type = type), (this._lfoR.type = type);
              }
            }),
            Object.defineProperty(Tone.Chorus.prototype, "spread", {
              get: function() {
                return this._lfoR.phase - this._lfoL.phase;
              },
              set: function(spread) {
                (this._lfoL.phase = 90 - spread / 2),
                  (this._lfoR.phase = spread / 2 + 90);
              }
            }),
            (Tone.Chorus.prototype.dispose = function() {
              return (
                Tone.StereoXFeedbackEffect.prototype.dispose.call(this),
                this._lfoL.dispose(),
                (this._lfoL = null),
                this._lfoR.dispose(),
                (this._lfoR = null),
                this._delayNodeL.disconnect(),
                (this._delayNodeL = null),
                this._delayNodeR.disconnect(),
                (this._delayNodeR = null),
                this._writable("frequency"),
                (this.frequency = null),
                this
              );
            }),
            Tone.Chorus
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Convolver = function() {
              var options = this.optionsObject(
                arguments,
                ["url"],
                Tone.Convolver.defaults
              );
              Tone.Effect.call(this, options),
                (this._convolver = this.context.createConvolver()),
                (this._buffer = new Tone.Buffer(
                  options.url,
                  function(buffer) {
                    (this.buffer = buffer), options.onload();
                  }.bind(this)
                )),
                this.connectEffect(this._convolver);
            }),
            Tone.extend(Tone.Convolver, Tone.Effect),
            (Tone.Convolver.defaults = { url: "", onload: Tone.noOp }),
            Object.defineProperty(Tone.Convolver.prototype, "buffer", {
              get: function() {
                return this._buffer.get();
              },
              set: function(buffer) {
                this._buffer.set(buffer),
                  (this._convolver.buffer = this._buffer.get());
              }
            }),
            (Tone.Convolver.prototype.load = function(url, callback) {
              return (
                this._buffer.load(
                  url,
                  function(buff) {
                    (this.buffer = buff), callback && callback();
                  }.bind(this)
                ),
                this
              );
            }),
            (Tone.Convolver.prototype.dispose = function() {
              return (
                Tone.Effect.prototype.dispose.call(this),
                this._convolver.disconnect(),
                (this._convolver = null),
                this._buffer.dispose(),
                (this._buffer = null),
                this
              );
            }),
            Tone.Convolver
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Distortion = function() {
              var options = this.optionsObject(
                arguments,
                ["distortion"],
                Tone.Distortion.defaults
              );
              Tone.Effect.call(this, options),
                (this._shaper = new Tone.WaveShaper(4096)),
                (this._distortion = options.distortion),
                this.connectEffect(this._shaper),
                (this.distortion = options.distortion),
                (this.oversample = options.oversample);
            }),
            Tone.extend(Tone.Distortion, Tone.Effect),
            (Tone.Distortion.defaults = {
              distortion: 0.4,
              oversample: "none"
            }),
            Object.defineProperty(Tone.Distortion.prototype, "distortion", {
              get: function() {
                return this._distortion;
              },
              set: function(amount) {
                this._distortion = amount;
                var k = 100 * amount,
                  deg = Math.PI / 180;
                this._shaper.setMap(function(x) {
                  return Math.abs(x) < 0.001
                    ? 0
                    : (20 * (3 + k) * x * deg) / (Math.PI + k * Math.abs(x));
                });
              }
            }),
            Object.defineProperty(Tone.Distortion.prototype, "oversample", {
              get: function() {
                return this._shaper.oversample;
              },
              set: function(oversampling) {
                this._shaper.oversample = oversampling;
              }
            }),
            (Tone.Distortion.prototype.dispose = function() {
              return (
                Tone.Effect.prototype.dispose.call(this),
                this._shaper.dispose(),
                (this._shaper = null),
                this
              );
            }),
            Tone.Distortion
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.FeedbackDelay = function() {
              var options = this.optionsObject(
                arguments,
                ["delayTime", "feedback"],
                Tone.FeedbackDelay.defaults
              );
              Tone.FeedbackEffect.call(this, options),
                (this.delayTime = new Tone.Signal(
                  options.delayTime,
                  Tone.Type.Time
                )),
                (this._delayNode = this.context.createDelay(4)),
                this.connectEffect(this._delayNode),
                this.delayTime.connect(this._delayNode.delayTime),
                this._readOnly(["delayTime"]);
            }),
            Tone.extend(Tone.FeedbackDelay, Tone.FeedbackEffect),
            (Tone.FeedbackDelay.defaults = { delayTime: 0.25 }),
            (Tone.FeedbackDelay.prototype.dispose = function() {
              return (
                Tone.FeedbackEffect.prototype.dispose.call(this),
                this.delayTime.dispose(),
                this._delayNode.disconnect(),
                (this._delayNode = null),
                this._writable(["delayTime"]),
                (this.delayTime = null),
                this
              );
            }),
            Tone.FeedbackDelay
          );
        }),
        Module(function(Tone) {
          var combFilterTunings = [
              1557 / 44100,
              1617 / 44100,
              1491 / 44100,
              1422 / 44100,
              1277 / 44100,
              1356 / 44100,
              1188 / 44100,
              1116 / 44100
            ],
            allpassFilterFrequencies = [225, 556, 441, 341];
          return (
            (Tone.Freeverb = function() {
              var options = this.optionsObject(
                arguments,
                ["roomSize", "dampening"],
                Tone.Freeverb.defaults
              );
              Tone.StereoEffect.call(this, options),
                (this.roomSize = new Tone.Signal(
                  options.roomSize,
                  Tone.Type.NormalRange
                )),
                (this.dampening = new Tone.Signal(
                  options.dampening,
                  Tone.Type.Frequency
                )),
                (this._combFilters = []),
                (this._allpassFiltersL = []),
                (this._allpassFiltersR = []);
              for (var l = 0; l < allpassFilterFrequencies.length; l++) {
                var allpassL = this.context.createBiquadFilter();
                (allpassL.type = "allpass"),
                  (allpassL.frequency.value = allpassFilterFrequencies[l]),
                  this._allpassFiltersL.push(allpassL);
              }
              for (var r = 0; r < allpassFilterFrequencies.length; r++) {
                var allpassR = this.context.createBiquadFilter();
                (allpassR.type = "allpass"),
                  (allpassR.frequency.value = allpassFilterFrequencies[r]),
                  this._allpassFiltersR.push(allpassR);
              }
              for (var c = 0; c < combFilterTunings.length; c++) {
                var lfpf = new Tone.LowpassCombFilter(combFilterTunings[c]);
                c < combFilterTunings.length / 2
                  ? this.effectSendL.chain(lfpf, this._allpassFiltersL[0])
                  : this.effectSendR.chain(lfpf, this._allpassFiltersR[0]),
                  this.roomSize.connect(lfpf.resonance),
                  this.dampening.connect(lfpf.dampening),
                  this._combFilters.push(lfpf);
              }
              this.connectSeries.apply(this, this._allpassFiltersL),
                this.connectSeries.apply(this, this._allpassFiltersR),
                this._allpassFiltersL[this._allpassFiltersL.length - 1].connect(
                  this.effectReturnL
                ),
                this._allpassFiltersR[this._allpassFiltersR.length - 1].connect(
                  this.effectReturnR
                ),
                this._readOnly(["roomSize", "dampening"]);
            }),
            Tone.extend(Tone.Freeverb, Tone.StereoEffect),
            (Tone.Freeverb.defaults = { roomSize: 0.7, dampening: 3e3 }),
            (Tone.Freeverb.prototype.dispose = function() {
              Tone.StereoEffect.prototype.dispose.call(this);
              for (var al = 0; al < this._allpassFiltersL.length; al++)
                this._allpassFiltersL[al].disconnect(),
                  (this._allpassFiltersL[al] = null);
              this._allpassFiltersL = null;
              for (var ar = 0; ar < this._allpassFiltersR.length; ar++)
                this._allpassFiltersR[ar].disconnect(),
                  (this._allpassFiltersR[ar] = null);
              this._allpassFiltersR = null;
              for (var cf = 0; cf < this._combFilters.length; cf++)
                this._combFilters[cf].dispose(), (this._combFilters[cf] = null);
              return (
                (this._combFilters = null),
                this._writable(["roomSize", "dampening"]),
                this.roomSize.dispose(),
                (this.roomSize = null),
                this.dampening.dispose(),
                (this.dampening = null),
                this
              );
            }),
            Tone.Freeverb
          );
        }),
        Module(function(Tone) {
          var combFilterDelayTimes = [0.06748, 0.06404, 0.08212, 0.09004],
            combFilterResonances = [0.773, 0.802, 0.753, 0.733],
            allpassFilterFreqs = [347, 113, 37];
          return (
            (Tone.JCReverb = function() {
              var options = this.optionsObject(
                arguments,
                ["roomSize"],
                Tone.JCReverb.defaults
              );
              Tone.StereoEffect.call(this, options),
                (this.roomSize = new Tone.Signal(
                  options.roomSize,
                  Tone.Type.NormalRange
                )),
                (this._scaleRoomSize = new Tone.Scale(-0.733, 0.197)),
                (this._allpassFilters = []),
                (this._feedbackCombFilters = []);
              for (var af = 0; af < allpassFilterFreqs.length; af++) {
                var allpass = this.context.createBiquadFilter();
                (allpass.type = "allpass"),
                  (allpass.frequency.value = allpassFilterFreqs[af]),
                  this._allpassFilters.push(allpass);
              }
              for (var cf = 0; cf < combFilterDelayTimes.length; cf++) {
                var fbcf = new Tone.FeedbackCombFilter(
                  combFilterDelayTimes[cf],
                  0.1
                );
                this._scaleRoomSize.connect(fbcf.resonance),
                  (fbcf.resonance.value = combFilterResonances[cf]),
                  this._allpassFilters[this._allpassFilters.length - 1].connect(
                    fbcf
                  ),
                  cf < combFilterDelayTimes.length / 2
                    ? fbcf.connect(this.effectReturnL)
                    : fbcf.connect(this.effectReturnR),
                  this._feedbackCombFilters.push(fbcf);
              }
              this.roomSize.connect(this._scaleRoomSize),
                this.connectSeries.apply(this, this._allpassFilters),
                this.effectSendL.connect(this._allpassFilters[0]),
                this.effectSendR.connect(this._allpassFilters[0]),
                this._readOnly(["roomSize"]);
            }),
            Tone.extend(Tone.JCReverb, Tone.StereoEffect),
            (Tone.JCReverb.defaults = { roomSize: 0.5 }),
            (Tone.JCReverb.prototype.dispose = function() {
              Tone.StereoEffect.prototype.dispose.call(this);
              for (var apf = 0; apf < this._allpassFilters.length; apf++)
                this._allpassFilters[apf].disconnect(),
                  (this._allpassFilters[apf] = null);
              this._allpassFilters = null;
              for (
                var fbcf = 0;
                fbcf < this._feedbackCombFilters.length;
                fbcf++
              )
                this._feedbackCombFilters[fbcf].dispose(),
                  (this._feedbackCombFilters[fbcf] = null);
              return (
                (this._feedbackCombFilters = null),
                this._writable(["roomSize"]),
                this.roomSize.dispose(),
                (this.roomSize = null),
                this._scaleRoomSize.dispose(),
                (this._scaleRoomSize = null),
                this
              );
            }),
            Tone.JCReverb
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.MidSideEffect = function() {
              Tone.Effect.apply(this, arguments),
                (this._midSideSplit = new Tone.MidSideSplit()),
                (this._midSideMerge = new Tone.MidSideMerge()),
                (this.midSend = this._midSideSplit.mid),
                (this.sideSend = this._midSideSplit.side),
                (this.midReturn = this._midSideMerge.mid),
                (this.sideReturn = this._midSideMerge.side),
                this.effectSend.connect(this._midSideSplit),
                this._midSideMerge.connect(this.effectReturn);
            }),
            Tone.extend(Tone.MidSideEffect, Tone.Effect),
            (Tone.MidSideEffect.prototype.dispose = function() {
              return (
                Tone.Effect.prototype.dispose.call(this),
                this._midSideSplit.dispose(),
                (this._midSideSplit = null),
                this._midSideMerge.dispose(),
                (this._midSideMerge = null),
                (this.midSend = null),
                (this.sideSend = null),
                (this.midReturn = null),
                (this.sideReturn = null),
                this
              );
            }),
            Tone.MidSideEffect
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Phaser = function() {
              var options = this.optionsObject(
                arguments,
                ["frequency", "octaves", "baseFrequency"],
                Tone.Phaser.defaults
              );
              Tone.StereoEffect.call(this, options),
                (this._lfoL = new Tone.LFO(options.frequency, 0, 1)),
                (this._lfoR = new Tone.LFO(options.frequency, 0, 1)),
                (this._lfoR.phase = 180),
                (this._baseFrequency = options.baseFrequency),
                (this._octaves = options.octaves),
                (this.Q = new Tone.Signal(options.Q, Tone.Type.Positive)),
                (this._filtersL = this._makeFilters(
                  options.stages,
                  this._lfoL,
                  this.Q
                )),
                (this._filtersR = this._makeFilters(
                  options.stages,
                  this._lfoR,
                  this.Q
                )),
                (this.frequency = this._lfoL.frequency),
                (this.frequency.value = options.frequency),
                this.effectSendL.connect(this._filtersL[0]),
                this.effectSendR.connect(this._filtersR[0]),
                this._filtersL[options.stages - 1].connect(this.effectReturnL),
                this._filtersR[options.stages - 1].connect(this.effectReturnR),
                this._lfoL.frequency.connect(this._lfoR.frequency),
                (this.baseFrequency = options.baseFrequency),
                (this.octaves = options.octaves),
                this._lfoL.start(),
                this._lfoR.start(),
                this._readOnly(["frequency", "Q"]);
            }),
            Tone.extend(Tone.Phaser, Tone.StereoEffect),
            (Tone.Phaser.defaults = {
              frequency: 0.5,
              octaves: 3,
              stages: 10,
              Q: 10,
              baseFrequency: 350
            }),
            (Tone.Phaser.prototype._makeFilters = function(
              stages,
              connectToFreq,
              Q
            ) {
              for (var filters = new Array(stages), i = 0; stages > i; i++) {
                var filter = this.context.createBiquadFilter();
                (filter.type = "allpass"),
                  Q.connect(filter.Q),
                  connectToFreq.connect(filter.frequency),
                  (filters[i] = filter);
              }
              return this.connectSeries.apply(this, filters), filters;
            }),
            Object.defineProperty(Tone.Phaser.prototype, "octaves", {
              get: function() {
                return this._octaves;
              },
              set: function(octaves) {
                this._octaves = octaves;
                var max = this._baseFrequency * Math.pow(2, octaves);
                (this._lfoL.max = max), (this._lfoR.max = max);
              }
            }),
            Object.defineProperty(Tone.Phaser.prototype, "baseFrequency", {
              get: function() {
                return this._baseFrequency;
              },
              set: function(freq) {
                (this._baseFrequency = freq),
                  (this._lfoL.min = freq),
                  (this._lfoR.min = freq),
                  (this.octaves = this._octaves);
              }
            }),
            (Tone.Phaser.prototype.dispose = function() {
              Tone.StereoEffect.prototype.dispose.call(this),
                this._writable(["frequency", "Q"]),
                this.Q.dispose(),
                (this.Q = null),
                this._lfoL.dispose(),
                (this._lfoL = null),
                this._lfoR.dispose(),
                (this._lfoR = null);
              for (var i = 0; i < this._filtersL.length; i++)
                this._filtersL[i].disconnect(), (this._filtersL[i] = null);
              this._filtersL = null;
              for (var j = 0; j < this._filtersR.length; j++)
                this._filtersR[j].disconnect(), (this._filtersR[j] = null);
              return (this._filtersR = null), (this.frequency = null), this;
            }),
            Tone.Phaser
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.PingPongDelay = function() {
              var options = this.optionsObject(
                arguments,
                ["delayTime", "feedback"],
                Tone.PingPongDelay.defaults
              );
              Tone.StereoXFeedbackEffect.call(this, options),
                (this._leftDelay = this.context.createDelay(
                  options.maxDelayTime
                )),
                (this._rightDelay = this.context.createDelay(
                  options.maxDelayTime
                )),
                (this._rightPreDelay = this.context.createDelay(
                  options.maxDelayTime
                )),
                (this.delayTime = new Tone.Signal(
                  options.delayTime,
                  Tone.Type.Time
                )),
                this.effectSendL.chain(this._leftDelay, this.effectReturnL),
                this.effectSendR.chain(
                  this._rightPreDelay,
                  this._rightDelay,
                  this.effectReturnR
                ),
                this.delayTime.fan(
                  this._leftDelay.delayTime,
                  this._rightDelay.delayTime,
                  this._rightPreDelay.delayTime
                ),
                this._feedbackLR.disconnect(),
                this._feedbackLR.connect(this._rightDelay),
                this._readOnly(["delayTime"]);
            }),
            Tone.extend(Tone.PingPongDelay, Tone.StereoXFeedbackEffect),
            (Tone.PingPongDelay.defaults = {
              delayTime: 0.25,
              maxDelayTime: 1
            }),
            (Tone.PingPongDelay.prototype.dispose = function() {
              return (
                Tone.StereoXFeedbackEffect.prototype.dispose.call(this),
                this._leftDelay.disconnect(),
                (this._leftDelay = null),
                this._rightDelay.disconnect(),
                (this._rightDelay = null),
                this._rightPreDelay.disconnect(),
                (this._rightPreDelay = null),
                this._writable(["delayTime"]),
                this.delayTime.dispose(),
                (this.delayTime = null),
                this
              );
            }),
            Tone.PingPongDelay
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.PitchShift = function() {
              var options = this.optionsObject(
                arguments,
                ["pitch"],
                Tone.PitchShift.defaults
              );
              Tone.FeedbackEffect.call(this, options),
                (this._frequency = new Tone.Signal(0)),
                (this._delayA = new Tone.Delay(0, 1)),
                (this._lfoA = new Tone.LFO({
                  min: 0,
                  max: 0.1,
                  type: "sawtooth"
                }).connect(this._delayA.delayTime)),
                (this._delayB = new Tone.Delay(0, 1)),
                (this._lfoB = new Tone.LFO({
                  min: 0,
                  max: 0.1,
                  type: "sawtooth",
                  phase: 180
                }).connect(this._delayB.delayTime)),
                (this._crossFade = new Tone.CrossFade()),
                (this._crossFadeLFO = new Tone.LFO({
                  min: 0,
                  max: 1,
                  type: "triangle",
                  phase: 90
                }).connect(this._crossFade.fade)),
                (this._feedbackDelay = new Tone.Delay(options.delayTime)),
                (this.delayTime = this._feedbackDelay.delayTime),
                this._readOnly("delayTime"),
                (this._pitch = options.pitch),
                (this._windowSize = options.windowSize),
                this._delayA.connect(this._crossFade.a),
                this._delayB.connect(this._crossFade.b),
                this._frequency.fan(
                  this._lfoA.frequency,
                  this._lfoB.frequency,
                  this._crossFadeLFO.frequency
                ),
                this.effectSend.fan(this._delayA, this._delayB),
                this._crossFade.chain(this._feedbackDelay, this.effectReturn);
              var now = this.now();
              this._lfoA.start(now),
                this._lfoB.start(now),
                this._crossFadeLFO.start(now),
                (this.windowSize = this._windowSize);
            }),
            Tone.extend(Tone.PitchShift, Tone.FeedbackEffect),
            (Tone.PitchShift.defaults = {
              pitch: 0,
              windowSize: 0.1,
              delayTime: 0,
              feedback: 0
            }),
            Object.defineProperty(Tone.PitchShift.prototype, "pitch", {
              get: function() {
                return this._pitch;
              },
              set: function(interval) {
                this._pitch = interval;
                var factor = 0;
                0 > interval
                  ? ((this._lfoA.min = 0),
                    (this._lfoA.max = this._windowSize),
                    (this._lfoB.min = 0),
                    (this._lfoB.max = this._windowSize),
                    (factor = this.intervalToFrequencyRatio(interval - 1) + 1))
                  : ((this._lfoA.min = this._windowSize),
                    (this._lfoA.max = 0),
                    (this._lfoB.min = this._windowSize),
                    (this._lfoB.max = 0),
                    (factor = this.intervalToFrequencyRatio(interval) - 1)),
                  (this._frequency.value = factor * (1.2 / this._windowSize));
              }
            }),
            Object.defineProperty(Tone.PitchShift.prototype, "windowSize", {
              get: function() {
                return this._windowSize;
              },
              set: function(size) {
                (this._windowSize = this.toSeconds(size)),
                  (this.pitch = this._pitch);
              }
            }),
            (Tone.PitchShift.prototype.dispose = function() {
              return (
                Tone.FeedbackEffect.prototype.dispose.call(this),
                this._frequency.dispose(),
                (this._frequency = null),
                this._delayA.disconnect(),
                (this._delayA = null),
                this._delayB.disconnect(),
                (this._delayB = null),
                this._lfoA.dispose(),
                (this._lfoA = null),
                this._lfoB.dispose(),
                (this._lfoB = null),
                this._crossFade.dispose(),
                (this._crossFade = null),
                this._crossFadeLFO.dispose(),
                (this._crossFadeLFO = null),
                this._writable("delayTime"),
                this._feedbackDelay.dispose(),
                (this._feedbackDelay = null),
                (this.delayTime = null),
                this
              );
            }),
            Tone.PitchShift
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.StereoFeedbackEffect = function() {
              var options = this.optionsObject(
                arguments,
                ["feedback"],
                Tone.FeedbackEffect.defaults
              );
              Tone.StereoEffect.call(this, options),
                (this.feedback = new Tone.Signal(
                  options.feedback,
                  Tone.Type.NormalRange
                )),
                (this._feedbackL = this.context.createGain()),
                (this._feedbackR = this.context.createGain()),
                this.effectReturnL.chain(this._feedbackL, this.effectSendL),
                this.effectReturnR.chain(this._feedbackR, this.effectSendR),
                this.feedback.fan(this._feedbackL.gain, this._feedbackR.gain),
                this._readOnly(["feedback"]);
            }),
            Tone.extend(Tone.StereoFeedbackEffect, Tone.FeedbackEffect),
            (Tone.StereoFeedbackEffect.prototype.dispose = function() {
              return (
                Tone.StereoEffect.prototype.dispose.call(this),
                this._writable(["feedback"]),
                this.feedback.dispose(),
                (this.feedback = null),
                this._feedbackL.disconnect(),
                (this._feedbackL = null),
                this._feedbackR.disconnect(),
                (this._feedbackR = null),
                this
              );
            }),
            Tone.StereoFeedbackEffect
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.StereoWidener = function() {
              var options = this.optionsObject(
                arguments,
                ["width"],
                Tone.StereoWidener.defaults
              );
              Tone.MidSideEffect.call(this, options),
                (this.width = new Tone.Signal(
                  options.width,
                  Tone.Type.NormalRange
                )),
                (this._midMult = new Tone.Expr("$0 * ($1 * (1 - $2))")),
                (this._sideMult = new Tone.Expr("$0 * ($1 * $2)")),
                (this._two = new Tone.Signal(2)),
                this._two.connect(this._midMult, 0, 1),
                this.width.connect(this._midMult, 0, 2),
                this._two.connect(this._sideMult, 0, 1),
                this.width.connect(this._sideMult, 0, 2),
                this.midSend.chain(this._midMult, this.midReturn),
                this.sideSend.chain(this._sideMult, this.sideReturn),
                this._readOnly(["width"]);
            }),
            Tone.extend(Tone.StereoWidener, Tone.MidSideEffect),
            (Tone.StereoWidener.defaults = { width: 0.5 }),
            (Tone.StereoWidener.prototype.dispose = function() {
              return (
                Tone.MidSideEffect.prototype.dispose.call(this),
                this._writable(["width"]),
                this.width.dispose(),
                (this.width = null),
                this._midMult.dispose(),
                (this._midMult = null),
                this._sideMult.dispose(),
                (this._sideMult = null),
                this._two.dispose(),
                (this._two = null),
                this
              );
            }),
            Tone.StereoWidener
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Tremolo = function() {
              var options = this.optionsObject(
                arguments,
                ["frequency", "depth"],
                Tone.Tremolo.defaults
              );
              Tone.StereoEffect.call(this, options),
                (this._lfoL = new Tone.LFO({
                  phase: options.spread,
                  min: 1,
                  max: 0
                })),
                (this._lfoR = new Tone.LFO({
                  phase: options.spread,
                  min: 1,
                  max: 0
                })),
                (this._amplitudeL = new Tone.Gain()),
                (this._amplitudeR = new Tone.Gain()),
                (this.frequency = new Tone.Signal(
                  options.frequency,
                  Tone.Type.Frequency
                )),
                (this.depth = new Tone.Signal(
                  options.depth,
                  Tone.Type.NormalRange
                )),
                this._readOnly(["frequency", "depth"]),
                this.effectSendL.chain(this._amplitudeL, this.effectReturnL),
                this.effectSendR.chain(this._amplitudeR, this.effectReturnR),
                this._lfoL.connect(this._amplitudeL.gain),
                this._lfoR.connect(this._amplitudeR.gain),
                this.frequency.fan(this._lfoL.frequency, this._lfoR.frequency),
                this.depth.fan(this._lfoR.amplitude, this._lfoL.amplitude),
                (this.type = options.type),
                (this.spread = options.spread);
            }),
            Tone.extend(Tone.Tremolo, Tone.StereoEffect),
            (Tone.Tremolo.defaults = {
              frequency: 10,
              type: "sine",
              depth: 0.5,
              spread: 180
            }),
            (Tone.Tremolo.prototype.start = function(time) {
              return this._lfoL.start(time), this._lfoR.start(time), this;
            }),
            (Tone.Tremolo.prototype.stop = function(time) {
              return this._lfoL.stop(time), this._lfoR.stop(time), this;
            }),
            (Tone.Tremolo.prototype.sync = function(delay) {
              return this._lfoL.sync(delay), this._lfoR.sync(delay), this;
            }),
            (Tone.Tremolo.prototype.unsync = function() {
              return this._lfoL.unsync(), this._lfoR.unsync(), this;
            }),
            Object.defineProperty(Tone.Tremolo.prototype, "type", {
              get: function() {
                return this._lfoL.type;
              },
              set: function(type) {
                (this._lfoL.type = type), (this._lfoR.type = type);
              }
            }),
            Object.defineProperty(Tone.Tremolo.prototype, "spread", {
              get: function() {
                return this._lfoR.phase - this._lfoL.phase;
              },
              set: function(spread) {
                (this._lfoL.phase = 90 - spread / 2),
                  (this._lfoR.phase = spread / 2 + 90);
              }
            }),
            (Tone.Tremolo.prototype.dispose = function() {
              return (
                Tone.StereoEffect.prototype.dispose.call(this),
                this._writable(["frequency", "depth"]),
                this._lfoL.dispose(),
                (this._lfoL = null),
                this._lfoR.dispose(),
                (this._lfoR = null),
                this._amplitudeL.dispose(),
                (this._amplitudeL = null),
                this._amplitudeR.dispose(),
                (this._amplitudeR = null),
                (this.frequency = null),
                (this.depth = null),
                this
              );
            }),
            Tone.Tremolo
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Vibrato = function() {
              var options = this.optionsObject(
                arguments,
                ["frequency", "depth"],
                Tone.Vibrato.defaults
              );
              Tone.Effect.call(this, options),
                (this._delayNode = new Tone.Delay(0, options.maxDelay)),
                (this._lfo = new Tone.LFO({
                  type: options.type,
                  min: 0,
                  max: options.maxDelay,
                  frequency: options.frequency,
                  phase: -90
                })
                  .start()
                  .connect(this._delayNode.delayTime)),
                (this.frequency = this._lfo.frequency),
                (this.depth = this._lfo.amplitude),
                (this.depth.value = options.depth),
                this._readOnly(["frequency", "depth"]),
                this.effectSend.chain(this._delayNode, this.effectReturn);
            }),
            Tone.extend(Tone.Vibrato, Tone.Effect),
            (Tone.Vibrato.defaults = {
              maxDelay: 0.005,
              frequency: 5,
              depth: 0.1,
              type: "sine"
            }),
            Object.defineProperty(Tone.Vibrato.prototype, "type", {
              get: function() {
                return this._lfo.type;
              },
              set: function(type) {
                this._lfo.type = type;
              }
            }),
            (Tone.Vibrato.prototype.dispose = function() {
              Tone.Effect.prototype.dispose.call(this),
                this._delayNode.dispose(),
                (this._delayNode = null),
                this._lfo.dispose(),
                (this._lfo = null),
                this._writable(["frequency", "depth"]),
                (this.frequency = null),
                (this.depth = null);
            }),
            Tone.Vibrato
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.PulseOscillator = function() {
              var options = this.optionsObject(
                arguments,
                ["frequency", "width"],
                Tone.Oscillator.defaults
              );
              Tone.Source.call(this, options),
                (this.width = new Tone.Signal(
                  options.width,
                  Tone.Type.NormalRange
                )),
                (this._widthGate = this.context.createGain()),
                (this._sawtooth = new Tone.Oscillator({
                  frequency: options.frequency,
                  detune: options.detune,
                  type: "sawtooth",
                  phase: options.phase
                })),
                (this.frequency = this._sawtooth.frequency),
                (this.detune = this._sawtooth.detune),
                (this._thresh = new Tone.WaveShaper(function(val) {
                  return 0 > val ? -1 : 1;
                })),
                this._sawtooth.chain(this._thresh, this.output),
                this.width.chain(this._widthGate, this._thresh),
                this._readOnly(["width", "frequency", "detune"]);
            }),
            Tone.extend(Tone.PulseOscillator, Tone.Oscillator),
            (Tone.PulseOscillator.defaults = {
              frequency: 440,
              detune: 0,
              phase: 0,
              width: 0.2
            }),
            (Tone.PulseOscillator.prototype._start = function(time) {
              (time = this.toSeconds(time)),
                this._sawtooth.start(time),
                this._widthGate.gain.setValueAtTime(1, time);
            }),
            (Tone.PulseOscillator.prototype._stop = function(time) {
              (time = this.toSeconds(time)),
                this._sawtooth.stop(time),
                this._widthGate.gain.setValueAtTime(0, time);
            }),
            Object.defineProperty(Tone.PulseOscillator.prototype, "phase", {
              get: function() {
                return this._sawtooth.phase;
              },
              set: function(phase) {
                this._sawtooth.phase = phase;
              }
            }),
            Object.defineProperty(Tone.PulseOscillator.prototype, "type", {
              get: function() {
                return "pulse";
              }
            }),
            Object.defineProperty(Tone.PulseOscillator.prototype, "partials", {
              get: function() {
                return [];
              }
            }),
            (Tone.PulseOscillator.prototype.dispose = function() {
              return (
                Tone.Source.prototype.dispose.call(this),
                this._sawtooth.dispose(),
                (this._sawtooth = null),
                this._writable(["width", "frequency", "detune"]),
                this.width.dispose(),
                (this.width = null),
                this._widthGate.disconnect(),
                (this._widthGate = null),
                (this._widthGate = null),
                this._thresh.disconnect(),
                (this._thresh = null),
                (this.frequency = null),
                (this.detune = null),
                this
              );
            }),
            Tone.PulseOscillator
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.PWMOscillator = function() {
              var options = this.optionsObject(
                arguments,
                ["frequency", "modulationFrequency"],
                Tone.PWMOscillator.defaults
              );
              Tone.Source.call(this, options),
                (this._pulse = new Tone.PulseOscillator(
                  options.modulationFrequency
                )),
                (this._pulse._sawtooth.type = "sine"),
                (this._modulator = new Tone.Oscillator({
                  frequency: options.frequency,
                  detune: options.detune,
                  phase: options.phase
                })),
                (this._scale = new Tone.Multiply(2)),
                (this.frequency = this._modulator.frequency),
                (this.detune = this._modulator.detune),
                (this.modulationFrequency = this._pulse.frequency),
                this._modulator.chain(this._scale, this._pulse.width),
                this._pulse.connect(this.output),
                this._readOnly(["modulationFrequency", "frequency", "detune"]);
            }),
            Tone.extend(Tone.PWMOscillator, Tone.Oscillator),
            (Tone.PWMOscillator.defaults = {
              frequency: 440,
              detune: 0,
              phase: 0,
              modulationFrequency: 0.4
            }),
            (Tone.PWMOscillator.prototype._start = function(time) {
              (time = this.toSeconds(time)),
                this._modulator.start(time),
                this._pulse.start(time);
            }),
            (Tone.PWMOscillator.prototype._stop = function(time) {
              (time = this.toSeconds(time)),
                this._modulator.stop(time),
                this._pulse.stop(time);
            }),
            Object.defineProperty(Tone.PWMOscillator.prototype, "type", {
              get: function() {
                return "pwm";
              }
            }),
            Object.defineProperty(Tone.PWMOscillator.prototype, "partials", {
              get: function() {
                return [];
              }
            }),
            Object.defineProperty(Tone.PWMOscillator.prototype, "phase", {
              get: function() {
                return this._modulator.phase;
              },
              set: function(phase) {
                this._modulator.phase = phase;
              }
            }),
            (Tone.PWMOscillator.prototype.dispose = function() {
              return (
                Tone.Source.prototype.dispose.call(this),
                this._pulse.dispose(),
                (this._pulse = null),
                this._scale.dispose(),
                (this._scale = null),
                this._modulator.dispose(),
                (this._modulator = null),
                this._writable(["modulationFrequency", "frequency", "detune"]),
                (this.frequency = null),
                (this.detune = null),
                (this.modulationFrequency = null),
                this
              );
            }),
            Tone.PWMOscillator
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.FMOscillator = function() {
              var options = this.optionsObject(
                arguments,
                ["frequency", "type", "modulationType"],
                Tone.FMOscillator.defaults
              );
              Tone.Source.call(this, options),
                (this._carrier = new Tone.Oscillator(
                  options.frequency,
                  options.type
                )),
                (this.frequency = new Tone.Signal(
                  options.frequency,
                  Tone.Type.Frequency
                )),
                (this.detune = this._carrier.detune),
                (this.detune.value = options.detune),
                (this.modulationIndex = new Tone.Multiply(
                  options.modulationIndex
                )),
                (this.modulationIndex.units = Tone.Type.Positive),
                (this._modulator = new Tone.Oscillator(
                  options.frequency,
                  options.modulationType
                )),
                (this.harmonicity = new Tone.Multiply(options.harmonicity)),
                (this.harmonicity.units = Tone.Type.Positive),
                (this._modulationNode = new Tone.Gain(0)),
                this.frequency.connect(this._carrier.frequency),
                this.frequency.chain(
                  this.harmonicity,
                  this._modulator.frequency
                ),
                this.frequency.chain(
                  this.modulationIndex,
                  this._modulationNode
                ),
                this._modulator.connect(this._modulationNode.gain),
                this._modulationNode.connect(this._carrier.frequency),
                this._carrier.connect(this.output),
                this.detune.connect(this._modulator.detune),
                (this.phase = options.phase),
                this._readOnly([
                  "modulationIndex",
                  "frequency",
                  "detune",
                  "harmonicity"
                ]);
            }),
            Tone.extend(Tone.FMOscillator, Tone.Oscillator),
            (Tone.FMOscillator.defaults = {
              frequency: 440,
              detune: 0,
              phase: 0,
              modulationIndex: 2,
              modulationType: "square",
              harmonicity: 1
            }),
            (Tone.FMOscillator.prototype._start = function(time) {
              (time = this.toSeconds(time)),
                this._modulator.start(time),
                this._carrier.start(time);
            }),
            (Tone.FMOscillator.prototype._stop = function(time) {
              (time = this.toSeconds(time)),
                this._modulator.stop(time),
                this._carrier.stop(time);
            }),
            Object.defineProperty(Tone.FMOscillator.prototype, "type", {
              get: function() {
                return this._carrier.type;
              },
              set: function(type) {
                this._carrier.type = type;
              }
            }),
            Object.defineProperty(
              Tone.FMOscillator.prototype,
              "modulationType",
              {
                get: function() {
                  return this._modulator.type;
                },
                set: function(type) {
                  this._modulator.type = type;
                }
              }
            ),
            Object.defineProperty(Tone.FMOscillator.prototype, "phase", {
              get: function() {
                return this._carrier.phase;
              },
              set: function(phase) {
                (this._carrier.phase = phase), (this._modulator.phase = phase);
              }
            }),
            Object.defineProperty(Tone.FMOscillator.prototype, "partials", {
              get: function() {
                return this._carrier.partials;
              },
              set: function(partials) {
                this._carrier.partials = partials;
              }
            }),
            (Tone.FMOscillator.prototype.dispose = function() {
              return (
                Tone.Source.prototype.dispose.call(this),
                this._writable([
                  "modulationIndex",
                  "frequency",
                  "detune",
                  "harmonicity"
                ]),
                this.frequency.dispose(),
                (this.frequency = null),
                (this.detune = null),
                this.harmonicity.dispose(),
                (this.harmonicity = null),
                this._carrier.dispose(),
                (this._carrier = null),
                this._modulator.dispose(),
                (this._modulator = null),
                this._modulationNode.dispose(),
                (this._modulationNode = null),
                this.modulationIndex.dispose(),
                (this.modulationIndex = null),
                this
              );
            }),
            Tone.FMOscillator
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.AMOscillator = function() {
              var options = this.optionsObject(
                arguments,
                ["frequency", "type", "modulationType"],
                Tone.AMOscillator.defaults
              );
              Tone.Source.call(this, options),
                (this._carrier = new Tone.Oscillator(
                  options.frequency,
                  options.type
                )),
                (this.frequency = this._carrier.frequency),
                (this.detune = this._carrier.detune),
                (this.detune.value = options.detune),
                (this._modulator = new Tone.Oscillator(
                  options.frequency,
                  options.modulationType
                )),
                (this._modulationScale = new Tone.AudioToGain()),
                (this.harmonicity = new Tone.Multiply(options.harmonicity)),
                (this.harmonicity.units = Tone.Type.Positive),
                (this._modulationNode = new Tone.Gain(0)),
                this.frequency.chain(
                  this.harmonicity,
                  this._modulator.frequency
                ),
                this.detune.connect(this._modulator.detune),
                this._modulator.chain(
                  this._modulationScale,
                  this._modulationNode.gain
                ),
                this._carrier.chain(this._modulationNode, this.output),
                (this.phase = options.phase),
                this._readOnly(["frequency", "detune", "harmonicity"]);
            }),
            Tone.extend(Tone.AMOscillator, Tone.Oscillator),
            (Tone.AMOscillator.defaults = {
              frequency: 440,
              detune: 0,
              phase: 0,
              modulationType: "square",
              harmonicity: 1
            }),
            (Tone.AMOscillator.prototype._start = function(time) {
              (time = this.toSeconds(time)),
                this._modulator.start(time),
                this._carrier.start(time);
            }),
            (Tone.AMOscillator.prototype._stop = function(time) {
              (time = this.toSeconds(time)),
                this._modulator.stop(time),
                this._carrier.stop(time);
            }),
            Object.defineProperty(Tone.AMOscillator.prototype, "type", {
              get: function() {
                return this._carrier.type;
              },
              set: function(type) {
                this._carrier.type = type;
              }
            }),
            Object.defineProperty(
              Tone.AMOscillator.prototype,
              "modulationType",
              {
                get: function() {
                  return this._modulator.type;
                },
                set: function(type) {
                  this._modulator.type = type;
                }
              }
            ),
            Object.defineProperty(Tone.AMOscillator.prototype, "phase", {
              get: function() {
                return this._carrier.phase;
              },
              set: function(phase) {
                (this._carrier.phase = phase), (this._modulator.phase = phase);
              }
            }),
            Object.defineProperty(Tone.AMOscillator.prototype, "partials", {
              get: function() {
                return this._carrier.partials;
              },
              set: function(partials) {
                this._carrier.partials = partials;
              }
            }),
            (Tone.AMOscillator.prototype.dispose = function() {
              return (
                Tone.Source.prototype.dispose.call(this),
                this._writable(["frequency", "detune", "harmonicity"]),
                (this.frequency = null),
                (this.detune = null),
                this.harmonicity.dispose(),
                (this.harmonicity = null),
                this._carrier.dispose(),
                (this._carrier = null),
                this._modulator.dispose(),
                (this._modulator = null),
                this._modulationNode.dispose(),
                (this._modulationNode = null),
                this._modulationScale.dispose(),
                (this._modulationScale = null),
                this
              );
            }),
            Tone.AMOscillator
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.FatOscillator = function() {
              var options = this.optionsObject(
                arguments,
                ["frequency", "type", "spread"],
                Tone.FatOscillator.defaults
              );
              Tone.Source.call(this, options),
                (this.frequency = new Tone.Signal(
                  options.frequency,
                  Tone.Type.Frequency
                )),
                (this.detune = new Tone.Signal(
                  options.detune,
                  Tone.Type.Cents
                )),
                (this._oscillators = []),
                (this._spread = options.spread),
                (this._type = options.type),
                (this._phase = options.phase),
                (this._partials = this.defaultArg(options.partials, [])),
                (this.count = options.count),
                this._readOnly(["frequency", "detune"]);
            }),
            Tone.extend(Tone.FatOscillator, Tone.Oscillator),
            (Tone.FatOscillator.defaults = {
              frequency: 440,
              detune: 0,
              phase: 0,
              spread: 20,
              count: 3,
              type: "sawtooth"
            }),
            (Tone.FatOscillator.prototype._start = function(time) {
              (time = this.toSeconds(time)),
                this._forEach(function(osc) {
                  osc.start(time);
                });
            }),
            (Tone.FatOscillator.prototype._stop = function(time) {
              (time = this.toSeconds(time)),
                this._forEach(function(osc) {
                  osc.stop(time);
                });
            }),
            (Tone.FatOscillator.prototype._forEach = function(iterator) {
              for (var i = 0; i < this._oscillators.length; i++)
                iterator.call(this, this._oscillators[i], i);
            }),
            Object.defineProperty(Tone.FatOscillator.prototype, "type", {
              get: function() {
                return this._type;
              },
              set: function(type) {
                (this._type = type),
                  this._forEach(function(osc) {
                    osc.type = type;
                  });
              }
            }),
            Object.defineProperty(Tone.FatOscillator.prototype, "spread", {
              get: function() {
                return this._spread;
              },
              set: function(spread) {
                if (((this._spread = spread), this._oscillators.length > 1)) {
                  var start = -spread / 2,
                    step = spread / (this._oscillators.length - 1);
                  this._forEach(function(osc, i) {
                    osc.detune.value = start + step * i;
                  });
                }
              }
            }),
            Object.defineProperty(Tone.FatOscillator.prototype, "count", {
              get: function() {
                return this._oscillators.length;
              },
              set: function(count) {
                if (
                  ((count = Math.max(count, 1)),
                  this._oscillators.length !== count)
                ) {
                  this._forEach(function(osc) {
                    osc.dispose();
                  }),
                    (this._oscillators = []);
                  for (var i = 0; count > i; i++) {
                    var osc = new Tone.Oscillator();
                    this.type === Tone.Oscillator.Type.Custom
                      ? (osc.partials = this._partials)
                      : (osc.type = this._type),
                      (osc.phase = this._phase),
                      (osc.volume.value = -6 - count),
                      this.frequency.connect(osc.frequency),
                      this.detune.connect(osc.detune),
                      osc.connect(this.output),
                      (this._oscillators[i] = osc);
                  }
                  (this.spread = this._spread),
                    this.state === Tone.State.Started &&
                      this._forEach(function(osc) {
                        osc.start();
                      });
                }
              }
            }),
            Object.defineProperty(Tone.FatOscillator.prototype, "phase", {
              get: function() {
                return this._phase;
              },
              set: function(phase) {
                (this._phase = phase),
                  this._forEach(function(osc) {
                    osc.phase = phase;
                  });
              }
            }),
            Object.defineProperty(Tone.FatOscillator.prototype, "partials", {
              get: function() {
                return this._partials;
              },
              set: function(partials) {
                (this._partials = partials),
                  (this._type = Tone.Oscillator.Type.Custom),
                  this._forEach(function(osc) {
                    osc.partials = partials;
                  });
              }
            }),
            (Tone.FatOscillator.prototype.dispose = function() {
              return (
                Tone.Source.prototype.dispose.call(this),
                this._writable(["frequency", "detune"]),
                this.frequency.dispose(),
                (this.frequency = null),
                this.detune.dispose(),
                (this.detune = null),
                this._forEach(function(osc) {
                  osc.dispose();
                }),
                (this._oscillators = null),
                (this._partials = null),
                this
              );
            }),
            Tone.FatOscillator
          );
        }),
        Module(function(Tone) {
          (Tone.OmniOscillator = function() {
            var options = this.optionsObject(
              arguments,
              ["frequency", "type"],
              Tone.OmniOscillator.defaults
            );
            Tone.Source.call(this, options),
              (this.frequency = new Tone.Signal(
                options.frequency,
                Tone.Type.Frequency
              )),
              (this.detune = new Tone.Signal(options.detune, Tone.Type.Cents)),
              (this._sourceType = void 0),
              (this._oscillator = null),
              (this.type = options.type),
              this._readOnly(["frequency", "detune"]),
              this.set(options);
          }),
            Tone.extend(Tone.OmniOscillator, Tone.Oscillator),
            (Tone.OmniOscillator.defaults = {
              frequency: 440,
              detune: 0,
              type: "sine",
              phase: 0
            });
          var OmniOscType = {
            Pulse: "PulseOscillator",
            PWM: "PWMOscillator",
            Osc: "Oscillator",
            FM: "FMOscillator",
            AM: "AMOscillator",
            Fat: "FatOscillator"
          };
          return (
            (Tone.OmniOscillator.prototype._start = function(time) {
              this._oscillator.start(time);
            }),
            (Tone.OmniOscillator.prototype._stop = function(time) {
              this._oscillator.stop(time);
            }),
            Object.defineProperty(Tone.OmniOscillator.prototype, "type", {
              get: function() {
                var prefix = "";
                return (
                  this._sourceType === OmniOscType.FM
                    ? (prefix = "fm")
                    : this._sourceType === OmniOscType.AM
                    ? (prefix = "am")
                    : this._sourceType === OmniOscType.Fat && (prefix = "fat"),
                  prefix + this._oscillator.type
                );
              },
              set: function(type) {
                "fm" === type.substr(0, 2)
                  ? (this._createNewOscillator(OmniOscType.FM),
                    (this._oscillator.type = type.substr(2)))
                  : "am" === type.substr(0, 2)
                  ? (this._createNewOscillator(OmniOscType.AM),
                    (this._oscillator.type = type.substr(2)))
                  : "fat" === type.substr(0, 3)
                  ? (this._createNewOscillator(OmniOscType.Fat),
                    (this._oscillator.type = type.substr(3)))
                  : "pwm" === type
                  ? this._createNewOscillator(OmniOscType.PWM)
                  : "pulse" === type
                  ? this._createNewOscillator(OmniOscType.Pulse)
                  : (this._createNewOscillator(OmniOscType.Osc),
                    (this._oscillator.type = type));
              }
            }),
            Object.defineProperty(Tone.OmniOscillator.prototype, "partials", {
              get: function() {
                return this._oscillator.partials;
              },
              set: function(partials) {
                this._oscillator.partials = partials;
              }
            }),
            (Tone.OmniOscillator.prototype.set = function(params, value) {
              return (
                "type" === params
                  ? (this.type = value)
                  : this.isObject(params) &&
                    params.hasOwnProperty("type") &&
                    (this.type = params.type),
                Tone.prototype.set.apply(this, arguments),
                this
              );
            }),
            (Tone.OmniOscillator.prototype._createNewOscillator = function(
              oscType
            ) {
              if (oscType !== this._sourceType) {
                this._sourceType = oscType;
                var OscillatorConstructor = Tone[oscType],
                  now = this.now() + this.blockTime;
                if (null !== this._oscillator) {
                  var oldOsc = this._oscillator;
                  oldOsc.stop(now),
                    setTimeout(function() {
                      oldOsc.dispose(), (oldOsc = null);
                    }, 1e3 * this.blockTime);
                }
                (this._oscillator = new OscillatorConstructor()),
                  this.frequency.connect(this._oscillator.frequency),
                  this.detune.connect(this._oscillator.detune),
                  this._oscillator.connect(this.output),
                  this.state === Tone.State.Started &&
                    this._oscillator.start(now);
              }
            }),
            Object.defineProperty(Tone.OmniOscillator.prototype, "phase", {
              get: function() {
                return this._oscillator.phase;
              },
              set: function(phase) {
                this._oscillator.phase = phase;
              }
            }),
            Object.defineProperty(Tone.OmniOscillator.prototype, "width", {
              get: function() {
                return this._sourceType === OmniOscType.Pulse
                  ? this._oscillator.width
                  : void 0;
              }
            }),
            Object.defineProperty(Tone.OmniOscillator.prototype, "count", {
              get: function() {
                return this._sourceType === OmniOscType.Fat
                  ? this._oscillator.count
                  : void 0;
              },
              set: function(count) {
                this._sourceType === OmniOscType.Fat &&
                  (this._oscillator.count = count);
              }
            }),
            Object.defineProperty(Tone.OmniOscillator.prototype, "spread", {
              get: function() {
                return this._sourceType === OmniOscType.Fat
                  ? this._oscillator.spread
                  : void 0;
              },
              set: function(spread) {
                this._sourceType === OmniOscType.Fat &&
                  (this._oscillator.spread = spread);
              }
            }),
            Object.defineProperty(
              Tone.OmniOscillator.prototype,
              "modulationType",
              {
                get: function() {
                  return this._sourceType === OmniOscType.FM ||
                    this._sourceType === OmniOscType.AM
                    ? this._oscillator.modulationType
                    : void 0;
                },
                set: function(mType) {
                  (this._sourceType === OmniOscType.FM ||
                    this._sourceType === OmniOscType.AM) &&
                    (this._oscillator.modulationType = mType);
                }
              }
            ),
            Object.defineProperty(
              Tone.OmniOscillator.prototype,
              "modulationIndex",
              {
                get: function() {
                  return this._sourceType === OmniOscType.FM
                    ? this._oscillator.modulationIndex
                    : void 0;
                }
              }
            ),
            Object.defineProperty(
              Tone.OmniOscillator.prototype,
              "harmonicity",
              {
                get: function() {
                  return this._sourceType === OmniOscType.FM ||
                    this._sourceType === OmniOscType.AM
                    ? this._oscillator.harmonicity
                    : void 0;
                }
              }
            ),
            Object.defineProperty(
              Tone.OmniOscillator.prototype,
              "modulationFrequency",
              {
                get: function() {
                  return this._sourceType === OmniOscType.PWM
                    ? this._oscillator.modulationFrequency
                    : void 0;
                }
              }
            ),
            (Tone.OmniOscillator.prototype.dispose = function() {
              return (
                Tone.Source.prototype.dispose.call(this),
                this._writable(["frequency", "detune"]),
                this.detune.dispose(),
                (this.detune = null),
                this.frequency.dispose(),
                (this.frequency = null),
                this._oscillator.dispose(),
                (this._oscillator = null),
                (this._sourceType = null),
                this
              );
            }),
            Tone.OmniOscillator
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Instrument = function(options) {
              (options = this.defaultArg(options, Tone.Instrument.defaults)),
                (this._volume = this.output = new Tone.Volume(options.volume)),
                (this.volume = this._volume.volume),
                this._readOnly("volume");
            }),
            Tone.extend(Tone.Instrument),
            (Tone.Instrument.defaults = { volume: 0 }),
            (Tone.Instrument.prototype.triggerAttack = Tone.noOp),
            (Tone.Instrument.prototype.triggerRelease = Tone.noOp),
            (Tone.Instrument.prototype.triggerAttackRelease = function(
              note,
              duration,
              time,
              velocity
            ) {
              return (
                (time = this.toSeconds(time)),
                (duration = this.toSeconds(duration)),
                this.triggerAttack(note, time, velocity),
                this.triggerRelease(time + duration),
                this
              );
            }),
            (Tone.Instrument.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._volume.dispose(),
                (this._volume = null),
                this._writable(["volume"]),
                (this.volume = null),
                this
              );
            }),
            Tone.Instrument
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Monophonic = function(options) {
              (options = this.defaultArg(options, Tone.Monophonic.defaults)),
                Tone.Instrument.call(this, options),
                (this.portamento = options.portamento);
            }),
            Tone.extend(Tone.Monophonic, Tone.Instrument),
            (Tone.Monophonic.defaults = { portamento: 0 }),
            (Tone.Monophonic.prototype.triggerAttack = function(
              note,
              time,
              velocity
            ) {
              return (
                (time = this.toSeconds(time)),
                this._triggerEnvelopeAttack(time, velocity),
                this.setNote(note, time),
                this
              );
            }),
            (Tone.Monophonic.prototype.triggerRelease = function(time) {
              return this._triggerEnvelopeRelease(time), this;
            }),
            (Tone.Monophonic.prototype._triggerEnvelopeAttack = function() {}),
            (Tone.Monophonic.prototype._triggerEnvelopeRelease = function() {}),
            (Tone.Monophonic.prototype.setNote = function(note, time) {
              if (((time = this.toSeconds(time)), this.portamento > 0)) {
                var currentNote = this.frequency.value;
                this.frequency.setValueAtTime(currentNote, time);
                var portTime = this.toSeconds(this.portamento);
                this.frequency.exponentialRampToValueAtTime(
                  note,
                  time + portTime
                );
              } else this.frequency.setValueAtTime(note, time);
              return this;
            }),
            Tone.Monophonic
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Synth = function(options) {
              (options = this.defaultArg(options, Tone.Synth.defaults)),
                Tone.Monophonic.call(this, options),
                (this.oscillator = new Tone.OmniOscillator(options.oscillator)),
                (this.frequency = this.oscillator.frequency),
                (this.detune = this.oscillator.detune),
                (this.envelope = new Tone.AmplitudeEnvelope(options.envelope)),
                this.oscillator.chain(this.envelope, this.output),
                this.oscillator.start(),
                this._readOnly([
                  "oscillator",
                  "frequency",
                  "detune",
                  "envelope"
                ]);
            }),
            Tone.extend(Tone.Synth, Tone.Monophonic),
            (Tone.Synth.defaults = {
              oscillator: { type: "triangle" },
              envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 }
            }),
            (Tone.Synth.prototype._triggerEnvelopeAttack = function(
              time,
              velocity
            ) {
              return this.envelope.triggerAttack(time, velocity), this;
            }),
            (Tone.Synth.prototype._triggerEnvelopeRelease = function(time) {
              return this.envelope.triggerRelease(time), this;
            }),
            (Tone.Synth.prototype.dispose = function() {
              return (
                Tone.Monophonic.prototype.dispose.call(this),
                this._writable([
                  "oscillator",
                  "frequency",
                  "detune",
                  "envelope"
                ]),
                this.oscillator.dispose(),
                (this.oscillator = null),
                this.envelope.dispose(),
                (this.envelope = null),
                (this.frequency = null),
                (this.detune = null),
                this
              );
            }),
            Tone.Synth
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.AMSynth = function(options) {
              (options = this.defaultArg(options, Tone.AMSynth.defaults)),
                Tone.Monophonic.call(this, options),
                (this._carrier = new Tone.Synth()),
                (this._carrier.volume.value = -10),
                (this.oscillator = this._carrier.oscillator),
                (this.envelope = this._carrier.envelope.set(options.envelope)),
                (this._modulator = new Tone.Synth()),
                (this._modulator.volume.value = -10),
                (this.modulation = this._modulator.oscillator.set(
                  options.modulation
                )),
                (this.modulationEnvelope = this._modulator.envelope.set(
                  options.modulationEnvelope
                )),
                (this.frequency = new Tone.Signal(440, Tone.Type.Frequency)),
                (this.detune = new Tone.Signal(
                  options.detune,
                  Tone.Type.Cents
                )),
                (this.harmonicity = new Tone.Multiply(options.harmonicity)),
                (this.harmonicity.units = Tone.Type.Positive),
                (this._modulationScale = new Tone.AudioToGain()),
                (this._modulationNode = this.context.createGain()),
                this.frequency.connect(this._carrier.frequency),
                this.frequency.chain(
                  this.harmonicity,
                  this._modulator.frequency
                ),
                this.detune.fan(this._carrier.detune, this._modulator.detune),
                this._modulator.chain(
                  this._modulationScale,
                  this._modulationNode.gain
                ),
                this._carrier.chain(this._modulationNode, this.output),
                this._readOnly([
                  "frequency",
                  "harmonicity",
                  "oscillator",
                  "envelope",
                  "modulation",
                  "modulationEnvelope",
                  "detune"
                ]);
            }),
            Tone.extend(Tone.AMSynth, Tone.Monophonic),
            (Tone.AMSynth.defaults = {
              harmonicity: 3,
              detune: 0,
              oscillator: { type: "sine" },
              envelope: { attack: 0.01, decay: 0.01, sustain: 1, release: 0.5 },
              moduation: { type: "square" },
              modulationEnvelope: {
                attack: 0.5,
                decay: 0,
                sustain: 1,
                release: 0.5
              }
            }),
            (Tone.AMSynth.prototype._triggerEnvelopeAttack = function(
              time,
              velocity
            ) {
              return (
                (time = this.toSeconds(time)),
                this.envelope.triggerAttack(time, velocity),
                this.modulationEnvelope.triggerAttack(time, velocity),
                this
              );
            }),
            (Tone.AMSynth.prototype._triggerEnvelopeRelease = function(time) {
              return (
                this.envelope.triggerRelease(time),
                this.modulationEnvelope.triggerRelease(time),
                this
              );
            }),
            (Tone.AMSynth.prototype.dispose = function() {
              return (
                Tone.Monophonic.prototype.dispose.call(this),
                this._writable([
                  "frequency",
                  "harmonicity",
                  "oscillator",
                  "envelope",
                  "modulation",
                  "modulationEnvelope",
                  "detune"
                ]),
                this._carrier.dispose(),
                (this._carrier = null),
                this._modulator.dispose(),
                (this._modulator = null),
                this.frequency.dispose(),
                (this.frequency = null),
                this.detune.dispose(),
                (this.detune = null),
                this.harmonicity.dispose(),
                (this.harmonicity = null),
                this._modulationScale.dispose(),
                (this._modulationScale = null),
                this._modulationNode.disconnect(),
                (this._modulationNode = null),
                (this.oscillator = null),
                (this.envelope = null),
                (this.modulationEnvelope = null),
                (this.modulation = null),
                this
              );
            }),
            Tone.AMSynth
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.MonoSynth = function(options) {
              (options = this.defaultArg(options, Tone.MonoSynth.defaults)),
                Tone.Monophonic.call(this, options),
                (this.oscillator = new Tone.OmniOscillator(options.oscillator)),
                (this.frequency = this.oscillator.frequency),
                (this.detune = this.oscillator.detune),
                (this.filter = new Tone.Filter(options.filter)),
                (this.filterEnvelope = new Tone.FrequencyEnvelope(
                  options.filterEnvelope
                )),
                (this.envelope = new Tone.AmplitudeEnvelope(options.envelope)),
                this.oscillator.chain(this.filter, this.envelope, this.output),
                this.oscillator.start(),
                this.filterEnvelope.connect(this.filter.frequency),
                this._readOnly([
                  "oscillator",
                  "frequency",
                  "detune",
                  "filter",
                  "filterEnvelope",
                  "envelope"
                ]);
            }),
            Tone.extend(Tone.MonoSynth, Tone.Monophonic),
            (Tone.MonoSynth.defaults = {
              frequency: "C4",
              detune: 0,
              oscillator: { type: "square" },
              filter: { Q: 6, type: "lowpass", rolloff: -24 },
              envelope: { attack: 0.005, decay: 0.1, sustain: 0.9, release: 1 },
              filterEnvelope: {
                attack: 0.06,
                decay: 0.2,
                sustain: 0.5,
                release: 2,
                baseFrequency: 200,
                octaves: 7,
                exponent: 2
              }
            }),
            (Tone.MonoSynth.prototype._triggerEnvelopeAttack = function(
              time,
              velocity
            ) {
              return (
                this.envelope.triggerAttack(time, velocity),
                this.filterEnvelope.triggerAttack(time),
                this
              );
            }),
            (Tone.MonoSynth.prototype._triggerEnvelopeRelease = function(time) {
              return (
                this.envelope.triggerRelease(time),
                this.filterEnvelope.triggerRelease(time),
                this
              );
            }),
            (Tone.MonoSynth.prototype.dispose = function() {
              return (
                Tone.Monophonic.prototype.dispose.call(this),
                this._writable([
                  "oscillator",
                  "frequency",
                  "detune",
                  "filter",
                  "filterEnvelope",
                  "envelope"
                ]),
                this.oscillator.dispose(),
                (this.oscillator = null),
                this.envelope.dispose(),
                (this.envelope = null),
                this.filterEnvelope.dispose(),
                (this.filterEnvelope = null),
                this.filter.dispose(),
                (this.filter = null),
                (this.frequency = null),
                (this.detune = null),
                this
              );
            }),
            Tone.MonoSynth
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.DuoSynth = function(options) {
              (options = this.defaultArg(options, Tone.DuoSynth.defaults)),
                Tone.Monophonic.call(this, options),
                (this.voice0 = new Tone.MonoSynth(options.voice0)),
                (this.voice0.volume.value = -10),
                (this.voice1 = new Tone.MonoSynth(options.voice1)),
                (this.voice1.volume.value = -10),
                (this._vibrato = new Tone.LFO(options.vibratoRate, -50, 50)),
                this._vibrato.start(),
                (this.vibratoRate = this._vibrato.frequency),
                (this._vibratoGain = this.context.createGain()),
                (this.vibratoAmount = new Tone.Param({
                  param: this._vibratoGain.gain,
                  units: Tone.Type.Positive,
                  value: options.vibratoAmount
                })),
                (this.frequency = new Tone.Signal(440, Tone.Type.Frequency)),
                (this.harmonicity = new Tone.Multiply(options.harmonicity)),
                (this.harmonicity.units = Tone.Type.Positive),
                this.frequency.connect(this.voice0.frequency),
                this.frequency.chain(this.harmonicity, this.voice1.frequency),
                this._vibrato.connect(this._vibratoGain),
                this._vibratoGain.fan(this.voice0.detune, this.voice1.detune),
                this.voice0.connect(this.output),
                this.voice1.connect(this.output),
                this._readOnly([
                  "voice0",
                  "voice1",
                  "frequency",
                  "vibratoAmount",
                  "vibratoRate"
                ]);
            }),
            Tone.extend(Tone.DuoSynth, Tone.Monophonic),
            (Tone.DuoSynth.defaults = {
              vibratoAmount: 0.5,
              vibratoRate: 5,
              harmonicity: 1.5,
              voice0: {
                volume: -10,
                portamento: 0,
                oscillator: { type: "sine" },
                filterEnvelope: {
                  attack: 0.01,
                  decay: 0,
                  sustain: 1,
                  release: 0.5
                },
                envelope: { attack: 0.01, decay: 0, sustain: 1, release: 0.5 }
              },
              voice1: {
                volume: -10,
                portamento: 0,
                oscillator: { type: "sine" },
                filterEnvelope: {
                  attack: 0.01,
                  decay: 0,
                  sustain: 1,
                  release: 0.5
                },
                envelope: { attack: 0.01, decay: 0, sustain: 1, release: 0.5 }
              }
            }),
            (Tone.DuoSynth.prototype._triggerEnvelopeAttack = function(
              time,
              velocity
            ) {
              return (
                (time = this.toSeconds(time)),
                this.voice0.envelope.triggerAttack(time, velocity),
                this.voice1.envelope.triggerAttack(time, velocity),
                this.voice0.filterEnvelope.triggerAttack(time),
                this.voice1.filterEnvelope.triggerAttack(time),
                this
              );
            }),
            (Tone.DuoSynth.prototype._triggerEnvelopeRelease = function(time) {
              return (
                this.voice0.triggerRelease(time),
                this.voice1.triggerRelease(time),
                this
              );
            }),
            (Tone.DuoSynth.prototype.dispose = function() {
              return (
                Tone.Monophonic.prototype.dispose.call(this),
                this._writable([
                  "voice0",
                  "voice1",
                  "frequency",
                  "vibratoAmount",
                  "vibratoRate"
                ]),
                this.voice0.dispose(),
                (this.voice0 = null),
                this.voice1.dispose(),
                (this.voice1 = null),
                this.frequency.dispose(),
                (this.frequency = null),
                this._vibrato.dispose(),
                (this._vibrato = null),
                this._vibratoGain.disconnect(),
                (this._vibratoGain = null),
                this.harmonicity.dispose(),
                (this.harmonicity = null),
                this.vibratoAmount.dispose(),
                (this.vibratoAmount = null),
                (this.vibratoRate = null),
                this
              );
            }),
            Tone.DuoSynth
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.FMSynth = function(options) {
              (options = this.defaultArg(options, Tone.FMSynth.defaults)),
                Tone.Monophonic.call(this, options),
                (this._carrier = new Tone.Synth(options.carrier)),
                (this._carrier.volume.value = -10),
                (this.oscillator = this._carrier.oscillator),
                (this.envelope = this._carrier.envelope.set(options.envelope)),
                (this._modulator = new Tone.Synth(options.modulator)),
                (this._modulator.volume.value = -10),
                (this.modulation = this._modulator.oscillator.set(
                  options.modulation
                )),
                (this.modulationEnvelope = this._modulator.envelope.set(
                  options.modulationEnvelope
                )),
                (this.frequency = new Tone.Signal(440, Tone.Type.Frequency)),
                (this.detune = new Tone.Signal(
                  options.detune,
                  Tone.Type.Cents
                )),
                (this.harmonicity = new Tone.Multiply(options.harmonicity)),
                (this.harmonicity.units = Tone.Type.Positive),
                (this.modulationIndex = new Tone.Multiply(
                  options.modulationIndex
                )),
                (this.modulationIndex.units = Tone.Type.Positive),
                (this._modulationNode = this.context.createGain()),
                this.frequency.connect(this._carrier.frequency),
                this.frequency.chain(
                  this.harmonicity,
                  this._modulator.frequency
                ),
                this.frequency.chain(
                  this.modulationIndex,
                  this._modulationNode
                ),
                this.detune.fan(this._carrier.detune, this._modulator.detune),
                this._modulator.connect(this._modulationNode.gain),
                (this._modulationNode.gain.value = 0),
                this._modulationNode.connect(this._carrier.frequency),
                this._carrier.connect(this.output),
                this._readOnly([
                  "frequency",
                  "harmonicity",
                  "modulationIndex",
                  "oscillator",
                  "envelope",
                  "modulation",
                  "modulationEnvelope",
                  "detune"
                ]);
            }),
            Tone.extend(Tone.FMSynth, Tone.Monophonic),
            (Tone.FMSynth.defaults = {
              harmonicity: 3,
              modulationIndex: 10,
              detune: 0,
              oscillator: { type: "sine" },
              envelope: { attack: 0.01, decay: 0.01, sustain: 1, release: 0.5 },
              moduation: { type: "square" },
              modulationEnvelope: {
                attack: 0.5,
                decay: 0,
                sustain: 1,
                release: 0.5
              }
            }),
            (Tone.FMSynth.prototype._triggerEnvelopeAttack = function(
              time,
              velocity
            ) {
              return (
                (time = this.toSeconds(time)),
                this.envelope.triggerAttack(time, velocity),
                this.modulationEnvelope.triggerAttack(time),
                this
              );
            }),
            (Tone.FMSynth.prototype._triggerEnvelopeRelease = function(time) {
              return (
                (time = this.toSeconds(time)),
                this.envelope.triggerRelease(time),
                this.modulationEnvelope.triggerRelease(time),
                this
              );
            }),
            (Tone.FMSynth.prototype.dispose = function() {
              return (
                Tone.Monophonic.prototype.dispose.call(this),
                this._writable([
                  "frequency",
                  "harmonicity",
                  "modulationIndex",
                  "oscillator",
                  "envelope",
                  "modulation",
                  "modulationEnvelope",
                  "detune"
                ]),
                this._carrier.dispose(),
                (this._carrier = null),
                this._modulator.dispose(),
                (this._modulator = null),
                this.frequency.dispose(),
                (this.frequency = null),
                this.detune.dispose(),
                (this.detune = null),
                this.modulationIndex.dispose(),
                (this.modulationIndex = null),
                this.harmonicity.dispose(),
                (this.harmonicity = null),
                this._modulationNode.disconnect(),
                (this._modulationNode = null),
                (this.oscillator = null),
                (this.envelope = null),
                (this.modulationEnvelope = null),
                (this.modulation = null),
                this
              );
            }),
            Tone.FMSynth
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.MembraneSynth = function(options) {
              (options = this.defaultArg(options, Tone.MembraneSynth.defaults)),
                Tone.Instrument.call(this, options),
                (this.oscillator = new Tone.Oscillator(
                  options.oscillator
                ).start()),
                (this.envelope = new Tone.AmplitudeEnvelope(options.envelope)),
                (this.octaves = options.octaves),
                (this.pitchDecay = options.pitchDecay),
                this.oscillator.chain(this.envelope, this.output),
                this._readOnly(["oscillator", "envelope"]);
            }),
            Tone.extend(Tone.MembraneSynth, Tone.Instrument),
            (Tone.MembraneSynth.defaults = {
              pitchDecay: 0.05,
              octaves: 10,
              oscillator: { type: "sine" },
              envelope: {
                attack: 0.001,
                decay: 0.4,
                sustain: 0.01,
                release: 1.4,
                attackCurve: "exponential"
              }
            }),
            (Tone.MembraneSynth.prototype.triggerAttack = function(
              note,
              time,
              velocity
            ) {
              (time = this.toSeconds(time)), (note = this.toFrequency(note));
              var maxNote = note * this.octaves;
              return (
                this.oscillator.frequency.setValueAtTime(maxNote, time),
                this.oscillator.frequency.exponentialRampToValueAtTime(
                  note,
                  time + this.toSeconds(this.pitchDecay)
                ),
                this.envelope.triggerAttack(time, velocity),
                this
              );
            }),
            (Tone.MembraneSynth.prototype.triggerRelease = function(time) {
              return this.envelope.triggerRelease(time), this;
            }),
            (Tone.MembraneSynth.prototype.dispose = function() {
              return (
                Tone.Instrument.prototype.dispose.call(this),
                this._writable(["oscillator", "envelope"]),
                this.oscillator.dispose(),
                (this.oscillator = null),
                this.envelope.dispose(),
                (this.envelope = null),
                this
              );
            }),
            Tone.MembraneSynth
          );
        }),
        Module(function(Tone) {
          var inharmRatios = [1, 1.483, 1.932, 2.546, 2.63, 3.897];
          return (
            (Tone.MetalSynth = function(options) {
              (options = this.defaultArg(options, Tone.MetalSynth.defaults)),
                Tone.Instrument.call(this, options),
                (this.frequency = new Tone.Signal(
                  options.frequency,
                  Tone.Type.Frequency
                )),
                (this._oscillators = []),
                (this._freqMultipliers = []),
                (this._amplitue = new Tone.Gain(0).connect(this.output)),
                (this._highpass = new Tone.Filter({
                  type: "highpass",
                  Q: 0
                }).connect(this._amplitue)),
                (this._octaves = options.octaves),
                (this._filterFreqScaler = new Tone.Scale(
                  options.resonance,
                  7e3
                )),
                (this.envelope = new Tone.Envelope({
                  attack: options.envelope.attack,
                  attackCurve: "exponential",
                  decay: options.envelope.decay,
                  sustain: 0,
                  release: options.envelope.release
                }).chain(this._filterFreqScaler, this._highpass.frequency)),
                this.envelope.connect(this._amplitue.gain);
              for (var i = 0; i < inharmRatios.length; i++) {
                var osc = new Tone.FMOscillator({
                  type: "square",
                  modulationType: "square",
                  harmonicity: options.harmonicity,
                  modulationIndex: options.modulationIndex
                });
                osc.connect(this._highpass).start(0),
                  (this._oscillators[i] = osc);
                var mult = new Tone.Multiply(inharmRatios[i]);
                (this._freqMultipliers[i] = mult),
                  this.frequency.chain(mult, osc.frequency);
              }
              this.octaves = options.octaves;
            }),
            Tone.extend(Tone.MetalSynth, Tone.Instrument),
            (Tone.MetalSynth.defaults = {
              frequency: 200,
              envelope: { attack: 0.0015, decay: 1.4, release: 0.2 },
              harmonicity: 5.1,
              modulationIndex: 32,
              resonance: 4e3,
              octaves: 1.5
            }),
            (Tone.MetalSynth.prototype.triggerAttack = function(time, vel) {
              return (
                (time = this.toSeconds(time)),
                (vel = this.defaultArg(vel, 1)),
                this.envelope.triggerAttack(time, vel),
                this
              );
            }),
            (Tone.MetalSynth.prototype.triggerRelease = function(time) {
              return (
                (time = this.toSeconds(time)),
                this.envelope.triggerRelease(time),
                this
              );
            }),
            (Tone.MetalSynth.prototype.triggerAttackRelease = function(
              duration,
              time,
              velocity
            ) {
              var now = this.now();
              return (
                (time = this.toSeconds(time, now)),
                (duration = this.toSeconds(duration, now)),
                this.triggerAttack(time, velocity),
                this.triggerRelease(time + duration),
                this
              );
            }),
            Object.defineProperty(
              Tone.MetalSynth.prototype,
              "modulationIndex",
              {
                get: function() {
                  return this._oscillators[0].modulationIndex.value;
                },
                set: function(val) {
                  for (var i = 0; i < this._oscillators.length; i++)
                    this._oscillators[i].modulationIndex.value = val;
                }
              }
            ),
            Object.defineProperty(Tone.MetalSynth.prototype, "harmonicity", {
              get: function() {
                return this._oscillators[0].harmonicity.value;
              },
              set: function(val) {
                for (var i = 0; i < this._oscillators.length; i++)
                  this._oscillators[i].harmonicity.value = val;
              }
            }),
            Object.defineProperty(Tone.MetalSynth.prototype, "resonance", {
              get: function() {
                return this._filterFreqScaler.min;
              },
              set: function(val) {
                (this._filterFreqScaler.min = val),
                  (this.octaves = this._octaves);
              }
            }),
            Object.defineProperty(Tone.MetalSynth.prototype, "octaves", {
              get: function() {
                return this._octaves;
              },
              set: function(octs) {
                (this._octaves = octs),
                  (this._filterFreqScaler.max =
                    this._filterFreqScaler.min * Math.pow(2, octs));
              }
            }),
            (Tone.MetalSynth.prototype.dispose = function() {
              Tone.Instrument.prototype.dispose.call(this);
              for (var i = 0; i < this._oscillators.length; i++)
                this._oscillators[i].dispose(),
                  this._freqMultipliers[i].dispose();
              (this._oscillators = null),
                (this._freqMultipliers = null),
                this.frequency.dispose(),
                (this.frequency = null),
                this._filterFreqScaler.dispose(),
                (this._filterFreqScaler = null),
                this._amplitue.dispose(),
                (this._amplitue = null),
                this.envelope.dispose(),
                (this.envelope = null),
                this._highpass.dispose(),
                (this._highpass = null);
            }),
            Tone.MetalSynth
          );
        }),
        Module(function(Tone) {
          (Tone.Noise = function() {
            var options = this.optionsObject(
              arguments,
              ["type"],
              Tone.Noise.defaults
            );
            Tone.Source.call(this, options),
              (this._source = null),
              (this._buffer = null),
              (this._playbackRate = options.playbackRate),
              (this.type = options.type);
          }),
            Tone.extend(Tone.Noise, Tone.Source),
            (Tone.Noise.defaults = { type: "white", playbackRate: 1 }),
            Object.defineProperty(Tone.Noise.prototype, "type", {
              get: function() {
                return this._buffer === _whiteNoise
                  ? "white"
                  : this._buffer === _brownNoise
                  ? "brown"
                  : this._buffer === _pinkNoise
                  ? "pink"
                  : void 0;
              },
              set: function(type) {
                if (this.type !== type) {
                  switch (type) {
                    case "white":
                      this._buffer = _whiteNoise;
                      break;
                    case "pink":
                      this._buffer = _pinkNoise;
                      break;
                    case "brown":
                      this._buffer = _brownNoise;
                      break;
                    default:
                      throw new TypeError("Tone.Noise: invalid type: " + type);
                  }
                  if (this.state === Tone.State.Started) {
                    var now = this.now() + this.blockTime;
                    this._stop(now), this._start(now);
                  }
                }
              }
            }),
            Object.defineProperty(Tone.Noise.prototype, "playbackRate", {
              get: function() {
                return this._playbackRate;
              },
              set: function(rate) {
                (this._playbackRate = rate),
                  this._source && (this._source.playbackRate.value = rate);
              }
            }),
            (Tone.Noise.prototype._start = function(time) {
              (this._source = this.context.createBufferSource()),
                (this._source.buffer = this._buffer),
                (this._source.loop = !0),
                (this._source.playbackRate.value = this._playbackRate),
                this._source.connect(this.output),
                this._source.start(
                  this.toSeconds(time),
                  Math.random() * (this._buffer.duration - 0.001)
                );
            }),
            (Tone.Noise.prototype._stop = function(time) {
              this._source && this._source.stop(this.toSeconds(time));
            }),
            (Tone.Noise.prototype.dispose = function() {
              return (
                Tone.Source.prototype.dispose.call(this),
                null !== this._source &&
                  (this._source.disconnect(), (this._source = null)),
                (this._buffer = null),
                this
              );
            });
          var _pinkNoise = null,
            _brownNoise = null,
            _whiteNoise = null;
          return (
            Tone._initAudioContext(function(audioContext) {
              var sampleRate = audioContext.sampleRate,
                bufferLength = 4 * sampleRate;
              (_pinkNoise = (function() {
                for (
                  var buffer = audioContext.createBuffer(
                      2,
                      bufferLength,
                      sampleRate
                    ),
                    channelNum = 0;
                  channelNum < buffer.numberOfChannels;
                  channelNum++
                ) {
                  var b0,
                    b1,
                    b2,
                    b3,
                    b4,
                    b5,
                    b6,
                    channel = buffer.getChannelData(channelNum);
                  b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0;
                  for (var i = 0; bufferLength > i; i++) {
                    var white = 2 * Math.random() - 1;
                    (b0 = 0.99886 * b0 + 0.0555179 * white),
                      (b1 = 0.99332 * b1 + 0.0750759 * white),
                      (b2 = 0.969 * b2 + 0.153852 * white),
                      (b3 = 0.8665 * b3 + 0.3104856 * white),
                      (b4 = 0.55 * b4 + 0.5329522 * white),
                      (b5 = -0.7616 * b5 - 0.016898 * white),
                      (channel[i] =
                        b0 + b1 + b2 + b3 + b4 + b5 + b6 + 0.5362 * white),
                      (channel[i] *= 0.11),
                      (b6 = 0.115926 * white);
                  }
                }
                return buffer;
              })()),
                (_brownNoise = (function() {
                  for (
                    var buffer = audioContext.createBuffer(
                        2,
                        bufferLength,
                        sampleRate
                      ),
                      channelNum = 0;
                    channelNum < buffer.numberOfChannels;
                    channelNum++
                  )
                    for (
                      var channel = buffer.getChannelData(channelNum),
                        lastOut = 0,
                        i = 0;
                      bufferLength > i;
                      i++
                    ) {
                      var white = 2 * Math.random() - 1;
                      (channel[i] = (lastOut + 0.02 * white) / 1.02),
                        (lastOut = channel[i]),
                        (channel[i] *= 3.5);
                    }
                  return buffer;
                })()),
                (_whiteNoise = (function() {
                  for (
                    var buffer = audioContext.createBuffer(
                        2,
                        bufferLength,
                        sampleRate
                      ),
                      channelNum = 0;
                    channelNum < buffer.numberOfChannels;
                    channelNum++
                  )
                    for (
                      var channel = buffer.getChannelData(channelNum), i = 0;
                      bufferLength > i;
                      i++
                    )
                      channel[i] = 2 * Math.random() - 1;
                  return buffer;
                })());
            }),
            Tone.Noise
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.NoiseSynth = function(options) {
              (options = this.defaultArg(options, Tone.NoiseSynth.defaults)),
                Tone.Instrument.call(this, options),
                (this.noise = new Tone.Noise()),
                (this.envelope = new Tone.AmplitudeEnvelope(options.envelope)),
                this.noise.chain(this.envelope, this.output),
                this.noise.start(),
                this._readOnly(["noise", "envelope"]);
            }),
            Tone.extend(Tone.NoiseSynth, Tone.Instrument),
            (Tone.NoiseSynth.defaults = {
              noise: { type: "white" },
              envelope: { attack: 0.005, decay: 0.1, sustain: 0 }
            }),
            (Tone.NoiseSynth.prototype.triggerAttack = function(
              time,
              velocity
            ) {
              return this.envelope.triggerAttack(time, velocity), this;
            }),
            (Tone.NoiseSynth.prototype.triggerRelease = function(time) {
              return this.envelope.triggerRelease(time), this;
            }),
            (Tone.NoiseSynth.prototype.triggerAttackRelease = function(
              duration,
              time,
              velocity
            ) {
              return (
                (time = this.toSeconds(time)),
                (duration = this.toSeconds(duration)),
                this.triggerAttack(time, velocity),
                this.triggerRelease(time + duration),
                this
              );
            }),
            (Tone.NoiseSynth.prototype.dispose = function() {
              return (
                Tone.Instrument.prototype.dispose.call(this),
                this._writable(["noise", "envelope"]),
                this.noise.dispose(),
                (this.noise = null),
                this.envelope.dispose(),
                (this.envelope = null),
                this
              );
            }),
            Tone.NoiseSynth
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.PluckSynth = function(options) {
              (options = this.defaultArg(options, Tone.PluckSynth.defaults)),
                Tone.Instrument.call(this, options),
                (this._noise = new Tone.Noise("pink")),
                (this.attackNoise = 1),
                (this._lfcf = new Tone.LowpassCombFilter({
                  resonance: options.resonance,
                  dampening: options.dampening
                })),
                (this.resonance = this._lfcf.resonance),
                (this.dampening = this._lfcf.dampening),
                this._noise.connect(this._lfcf),
                this._lfcf.connect(this.output),
                this._readOnly(["resonance", "dampening"]);
            }),
            Tone.extend(Tone.PluckSynth, Tone.Instrument),
            (Tone.PluckSynth.defaults = {
              attackNoise: 1,
              dampening: 4e3,
              resonance: 0.9
            }),
            (Tone.PluckSynth.prototype.triggerAttack = function(note, time) {
              (note = this.toFrequency(note)), (time = this.toSeconds(time));
              var delayAmount = 1 / note;
              return (
                this._lfcf.delayTime.setValueAtTime(delayAmount, time),
                this._noise.start(time),
                this._noise.stop(time + delayAmount * this.attackNoise),
                this
              );
            }),
            (Tone.PluckSynth.prototype.dispose = function() {
              return (
                Tone.Instrument.prototype.dispose.call(this),
                this._noise.dispose(),
                this._lfcf.dispose(),
                (this._noise = null),
                (this._lfcf = null),
                this._writable(["resonance", "dampening"]),
                (this.dampening = null),
                (this.resonance = null),
                this
              );
            }),
            Tone.PluckSynth
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.PolySynth = function() {
              Tone.Instrument.call(this);
              var options = this.optionsObject(
                arguments,
                ["polyphony", "voice"],
                Tone.PolySynth.defaults
              );
              (options = this.defaultArg(options, Tone.Instrument.defaults)),
                (options.polyphony = Math.min(
                  Tone.PolySynth.MAX_POLYPHONY,
                  options.polyphony
                )),
                (this.voices = new Array(options.polyphony)),
                (this._triggers = new Array(options.polyphony)),
                (this.detune = new Tone.Signal(
                  options.detune,
                  Tone.Type.Cents
                )),
                this._readOnly("detune");
              for (var i = 0; i < options.polyphony; i++) {
                var v = new options.voice(arguments[2], arguments[3]);
                (this.voices[i] = v),
                  v.connect(this.output),
                  v.hasOwnProperty("detune") && this.detune.connect(v.detune),
                  (this._triggers[i] = { release: -1, note: null, voice: v });
              }
              this.volume.value = options.volume;
            }),
            Tone.extend(Tone.PolySynth, Tone.Instrument),
            (Tone.PolySynth.defaults = {
              polyphony: 4,
              volume: 0,
              detune: 0,
              voice: Tone.Synth
            }),
            (Tone.PolySynth.prototype.triggerAttack = function(
              notes,
              time,
              velocity
            ) {
              Array.isArray(notes) || (notes = [notes]),
                (time = this.toSeconds(time));
              for (var i = 0; i < notes.length; i++) {
                for (
                  var val = notes[i],
                    oldest = this._triggers[0],
                    oldestIndex = 0,
                    j = 1;
                  j < this._triggers.length;
                  j++
                )
                  this._triggers[j].release < oldest.release &&
                    ((oldest = this._triggers[j]), (oldestIndex = j));
                (oldest.release = 1 / 0),
                  (oldest.note = JSON.stringify(val)),
                  oldest.voice.triggerAttack(val, time, velocity);
              }
              return this;
            }),
            (Tone.PolySynth.prototype.triggerAttackRelease = function(
              notes,
              duration,
              time,
              velocity
            ) {
              if (
                ((time = this.toSeconds(time)),
                this.triggerAttack(notes, time, velocity),
                this.isArray(duration) && this.isArray(notes))
              )
                for (var i = 0; i < notes.length; i++) {
                  var d = duration[Math.min(i, duration.length - 1)];
                  this.triggerRelease(notes[i], time + this.toSeconds(d));
                }
              else this.triggerRelease(notes, time + this.toSeconds(duration));
              return this;
            }),
            (Tone.PolySynth.prototype.triggerRelease = function(notes, time) {
              Array.isArray(notes) || (notes = [notes]),
                (time = this.toSeconds(time));
              for (var i = 0; i < notes.length; i++)
                for (
                  var stringified = JSON.stringify(notes[i]), v = 0;
                  v < this._triggers.length;
                  v++
                ) {
                  var desc = this._triggers[v];
                  desc.note === stringified &&
                    desc.release > time &&
                    (desc.voice.triggerRelease(time), (desc.release = time));
                }
              return this;
            }),
            (Tone.PolySynth.prototype.set = function(params, value, rampTime) {
              for (var i = 0; i < this.voices.length; i++)
                this.voices[i].set(params, value, rampTime);
              return this;
            }),
            (Tone.PolySynth.prototype.get = function(params) {
              return this.voices[0].get(params);
            }),
            (Tone.PolySynth.prototype.releaseAll = function(time) {
              time = this.toSeconds(time);
              for (var i = 0; i < this._triggers.length; i++) {
                var desc = this._triggers[i];
                desc.release > time &&
                  ((desc.release = time), desc.voice.triggerRelease(time));
              }
              return this;
            }),
            (Tone.PolySynth.prototype.dispose = function() {
              Tone.Instrument.prototype.dispose.call(this);
              for (var i = 0; i < this.voices.length; i++)
                this.voices[i].dispose(), (this.voices[i] = null);
              return (
                this._writable("detune"),
                this.detune.dispose(),
                (this.detune = null),
                (this.voices = null),
                (this._triggers = null),
                this
              );
            }),
            (Tone.PolySynth.MAX_POLYPHONY = 20),
            Tone.PolySynth
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Player = function(url) {
              var options;
              url instanceof Tone.Buffer
                ? ((url = url.get()), (options = Tone.Player.defaults))
                : (options = this.optionsObject(
                    arguments,
                    ["url", "onload"],
                    Tone.Player.defaults
                  )),
                Tone.Source.call(this, options),
                (this._source = null),
                (this.autostart = options.autostart),
                (this._buffer = new Tone.Buffer({
                  url: options.url,
                  onload: this._onload.bind(this, options.onload),
                  reverse: options.reverse
                })),
                url instanceof AudioBuffer && this._buffer.set(url),
                (this._loop = options.loop),
                (this._loopStart = options.loopStart),
                (this._loopEnd = options.loopEnd),
                (this._playbackRate = options.playbackRate),
                (this.retrigger = options.retrigger);
            }),
            Tone.extend(Tone.Player, Tone.Source),
            (Tone.Player.defaults = {
              onload: Tone.noOp,
              playbackRate: 1,
              loop: !1,
              autostart: !1,
              loopStart: 0,
              loopEnd: 0,
              retrigger: !1,
              reverse: !1
            }),
            (Tone.Player.prototype.load = function(url, callback) {
              return (
                this._buffer.load(url, this._onload.bind(this, callback)), this
              );
            }),
            (Tone.Player.prototype._onload = function(callback) {
              callback(this), this.autostart && this.start();
            }),
            (Tone.Player.prototype._start = function(
              startTime,
              offset,
              duration
            ) {
              if (!this._buffer.loaded)
                throw Error(
                  "Tone.Player: tried to start Player before the buffer was loaded"
                );
              return (
                (offset = this._loop
                  ? this.defaultArg(offset, this._loopStart)
                  : this.defaultArg(offset, 0)),
                (offset = this.toSeconds(offset)),
                (duration = this.defaultArg(
                  duration,
                  this._buffer.duration - offset
                )),
                (startTime = this.toSeconds(startTime)),
                (duration = this.toSeconds(duration)),
                (this._source = this.context.createBufferSource()),
                (this._source.buffer = this._buffer.get()),
                this._loop
                  ? ((this._source.loop = this._loop),
                    (this._source.loopStart = this.toSeconds(this._loopStart)),
                    (this._source.loopEnd = this.toSeconds(this._loopEnd)))
                  : this._state.setStateAtTime(
                      Tone.State.Stopped,
                      startTime + duration
                    ),
                (this._source.playbackRate.value = this._playbackRate),
                this._source.connect(this.output),
                this._loop
                  ? this._source.start(startTime, offset)
                  : this._source.start(startTime, offset, duration),
                this
              );
            }),
            (Tone.Player.prototype._stop = function(time) {
              return (
                this._source &&
                  (this._source.stop(this.toSeconds(time)),
                  (this._source = null)),
                this
              );
            }),
            (Tone.Player.prototype.setLoopPoints = function(
              loopStart,
              loopEnd
            ) {
              return (
                (this.loopStart = loopStart), (this.loopEnd = loopEnd), this
              );
            }),
            Object.defineProperty(Tone.Player.prototype, "loopStart", {
              get: function() {
                return this._loopStart;
              },
              set: function(loopStart) {
                (this._loopStart = loopStart),
                  this._source &&
                    (this._source.loopStart = this.toSeconds(loopStart));
              }
            }),
            Object.defineProperty(Tone.Player.prototype, "loopEnd", {
              get: function() {
                return this._loopEnd;
              },
              set: function(loopEnd) {
                (this._loopEnd = loopEnd),
                  this._source &&
                    (this._source.loopEnd = this.toSeconds(loopEnd));
              }
            }),
            Object.defineProperty(Tone.Player.prototype, "buffer", {
              get: function() {
                return this._buffer;
              },
              set: function(buffer) {
                this._buffer.set(buffer);
              }
            }),
            Object.defineProperty(Tone.Player.prototype, "loop", {
              get: function() {
                return this._loop;
              },
              set: function(loop) {
                (this._loop = loop), this._source && (this._source.loop = loop);
              }
            }),
            Object.defineProperty(Tone.Player.prototype, "playbackRate", {
              get: function() {
                return this._playbackRate;
              },
              set: function(rate) {
                (this._playbackRate = rate),
                  this._source && (this._source.playbackRate.value = rate);
              }
            }),
            Object.defineProperty(Tone.Player.prototype, "reverse", {
              get: function() {
                return this._buffer.reverse;
              },
              set: function(rev) {
                this._buffer.reverse = rev;
              }
            }),
            (Tone.Player.prototype.dispose = function() {
              return (
                Tone.Source.prototype.dispose.call(this),
                null !== this._source &&
                  (this._source.disconnect(), (this._source = null)),
                this._buffer.dispose(),
                (this._buffer = null),
                this
              );
            }),
            Tone.Player
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Sampler = function() {
              var options = this.optionsObject(
                arguments,
                ["url", "onload"],
                Tone.Sampler.defaults
              );
              Tone.Instrument.call(this, options),
                (this.player = new Tone.Player(options.url, options.onload)),
                (this.player.retrigger = !0),
                (this.envelope = new Tone.AmplitudeEnvelope(options.envelope)),
                this.player.chain(this.envelope, this.output),
                this._readOnly(["player", "envelope"]),
                (this.loop = options.loop),
                (this.reverse = options.reverse);
            }),
            Tone.extend(Tone.Sampler, Tone.Instrument),
            (Tone.Sampler.defaults = {
              onload: Tone.noOp,
              loop: !1,
              reverse: !1,
              envelope: { attack: 0.001, decay: 0, sustain: 1, release: 0.1 }
            }),
            (Tone.Sampler.prototype.triggerAttack = function(
              pitch,
              time,
              velocity
            ) {
              return (
                (time = this.toSeconds(time)),
                (pitch = this.defaultArg(pitch, 0)),
                (this.player.playbackRate = this.intervalToFrequencyRatio(
                  pitch
                )),
                this.player.start(time),
                this.envelope.triggerAttack(time, velocity),
                this
              );
            }),
            (Tone.Sampler.prototype.triggerRelease = function(time) {
              return (
                (time = this.toSeconds(time)),
                this.envelope.triggerRelease(time),
                this.player.stop(this.toSeconds(this.envelope.release) + time),
                this
              );
            }),
            Object.defineProperty(Tone.Sampler.prototype, "loop", {
              get: function() {
                return this.player.loop;
              },
              set: function(loop) {
                this.player.loop = loop;
              }
            }),
            Object.defineProperty(Tone.Sampler.prototype, "reverse", {
              get: function() {
                return this.player.reverse;
              },
              set: function(rev) {
                this.player.reverse = rev;
              }
            }),
            (Tone.Sampler.prototype.dispose = function() {
              return (
                Tone.Instrument.prototype.dispose.call(this),
                this._writable(["player", "envelope"]),
                this.player.dispose(),
                (this.player = null),
                this.envelope.dispose(),
                (this.envelope = null),
                this
              );
            }),
            Tone.Sampler
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.SimpleSynth = function(options) {
              console.warn("Tone.SimpleSynth is now called Tone.Synth"),
                Tone.Synth.call(this, options);
            }),
            Tone.extend(Tone.SimpleSynth, Tone.Synth),
            Tone.SimpleSynth
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.GainToAudio = function() {
              this._norm = this.input = this.output = new Tone.WaveShaper(
                function(x) {
                  return 2 * Math.abs(x) - 1;
                }
              );
            }),
            Tone.extend(Tone.GainToAudio, Tone.SignalBase),
            (Tone.GainToAudio.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._norm.dispose(),
                (this._norm = null),
                this
              );
            }),
            Tone.GainToAudio
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Normalize = function(inputMin, inputMax) {
              (this._inputMin = this.defaultArg(inputMin, 0)),
                (this._inputMax = this.defaultArg(inputMax, 1)),
                (this._sub = this.input = new Tone.Add(0)),
                (this._div = this.output = new Tone.Multiply(1)),
                this._sub.connect(this._div),
                this._setRange();
            }),
            Tone.extend(Tone.Normalize, Tone.SignalBase),
            Object.defineProperty(Tone.Normalize.prototype, "min", {
              get: function() {
                return this._inputMin;
              },
              set: function(min) {
                (this._inputMin = min), this._setRange();
              }
            }),
            Object.defineProperty(Tone.Normalize.prototype, "max", {
              get: function() {
                return this._inputMax;
              },
              set: function(max) {
                (this._inputMax = max), this._setRange();
              }
            }),
            (Tone.Normalize.prototype._setRange = function() {
              (this._sub.value = -this._inputMin),
                (this._div.value = 1 / (this._inputMax - this._inputMin));
            }),
            (Tone.Normalize.prototype.dispose = function() {
              return (
                Tone.prototype.dispose.call(this),
                this._sub.dispose(),
                (this._sub = null),
                this._div.dispose(),
                (this._div = null),
                this
              );
            }),
            Tone.Normalize
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.BufferSource = function() {
              var options = this.optionsObject(
                arguments,
                ["buffer", "onended"],
                Tone.BufferSource.defaults
              );
              (this.onended = options.onended),
                (this._startTime = -1),
                (this._gainNode = this.output = this.context.createGain()),
                (this._source = this.context.createBufferSource()),
                this._source.connect(this._gainNode),
                (this._source.onended = this._onended.bind(this)),
                (this.playbackRate = this._source.playbackRate),
                (this.fadeIn = options.fadeIn),
                (this.fadeOut = options.fadeOut),
                (this._gain = 1),
                this.isUndef(options.buffer) || (this.buffer = options.buffer),
                (this.loop = options.loop);
            }),
            Tone.extend(Tone.BufferSource),
            (Tone.BufferSource.defaults = {
              onended: Tone.noOp,
              fadeIn: 0,
              fadeOut: 0
            }),
            Object.defineProperty(Tone.BufferSource.prototype, "state", {
              get: function() {
                var now = this.now();
                return -1 !== this._startTime && now > this._startTime
                  ? Tone.State.Started
                  : Tone.State.Stopped;
              }
            }),
            (Tone.BufferSource.prototype.start = function(
              time,
              offset,
              duration,
              gain,
              fadeInTime
            ) {
              if (-1 !== this._startTime)
                throw new Error("Tone.BufferSource: can only be started once.");
              if (!this.buffer)
                throw new Error("Tone.BufferSource: no buffer set.");
              return (
                (time = this.toSeconds(time)),
                (offset = this.loop
                  ? this.defaultArg(offset, this.loopStart)
                  : this.defaultArg(offset, 0)),
                (offset = this.toSeconds(offset)),
                (time = this.toSeconds(time)),
                this._source.start(time, offset),
                (gain = this.defaultArg(gain, 1)),
                (this._gain = gain),
                (fadeInTime = this.isUndef(fadeInTime)
                  ? this.toSeconds(this.fadeIn)
                  : this.toSeconds(fadeInTime)),
                fadeInTime > 0
                  ? (this._gainNode.gain.setValueAtTime(0, time),
                    this._gainNode.gain.linearRampToValueAtTime(
                      this._gain,
                      time + fadeInTime
                    ))
                  : this._gainNode.gain.setValueAtTime(gain, time),
                (this._startTime = time + fadeInTime),
                this.isUndef(duration) ||
                  ((duration = this.defaultArg(
                    duration,
                    this.buffer.duration - offset
                  )),
                  (duration = this.toSeconds(duration)),
                  this.stop(time + duration + fadeInTime, fadeInTime)),
                this
              );
            }),
            (Tone.BufferSource.prototype.stop = function(time, fadeOutTime) {
              if (!this.buffer)
                throw new Error("Tone.BufferSource: no buffer set.");
              return (
                (time = this.toSeconds(time)),
                (fadeOutTime = this.isUndef(fadeOutTime)
                  ? this.toSeconds(this.fadeOut)
                  : this.toSeconds(fadeOutTime)),
                this._gainNode.gain.cancelScheduledValues(
                  this._startTime + this.sampleTime
                ),
                fadeOutTime > 0
                  ? (this._gainNode.gain.setValueAtTime(this._gain, time),
                    this._gainNode.gain.linearRampToValueAtTime(
                      0,
                      time + fadeOutTime
                    ),
                    (time += fadeOutTime))
                  : this._gainNode.gain.setValueAtTime(0, time),
                this._source.stop(time),
                this
              );
            }),
            (Tone.BufferSource.prototype._onended = function() {
              this.onended(this), this.dispose();
            }),
            Object.defineProperty(Tone.BufferSource.prototype, "loopStart", {
              get: function() {
                return this._source.loopStart;
              },
              set: function(loopStart) {
                this._source.loopStart = this.toSeconds(loopStart);
              }
            }),
            Object.defineProperty(Tone.BufferSource.prototype, "loopEnd", {
              get: function() {
                return this._source.loopEnd;
              },
              set: function(loopEnd) {
                this._source.loopEnd = this.toSeconds(loopEnd);
              }
            }),
            Object.defineProperty(Tone.BufferSource.prototype, "buffer", {
              get: function() {
                return this._source.buffer;
              },
              set: function(buffer) {
                this._source.buffer =
                  buffer instanceof Tone.Buffer ? buffer.get() : buffer;
              }
            }),
            Object.defineProperty(Tone.BufferSource.prototype, "loop", {
              get: function() {
                return this._source.loop;
              },
              set: function(loop) {
                this._source.loop = loop;
              }
            }),
            (Tone.BufferSource.prototype.dispose = function() {
              return (
                (this.onended = null),
                this._source &&
                  ((this._source.onended = null),
                  this._source.disconnect(),
                  (this._source = null)),
                this._gainNode &&
                  (this._gainNode.disconnect(), (this._gainNode = null)),
                (this._startTime = -1),
                (this.playbackRate = null),
                (this.output = null),
                this
              );
            }),
            Tone.BufferSource
          );
        }),
        Module(function(Tone) {
          return (
            (navigator.getUserMedia =
              navigator.getUserMedia ||
              navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia ||
              navigator.msGetUserMedia),
            (Tone.ExternalInput = function() {
              var options = this.optionsObject(
                arguments,
                ["inputNum"],
                Tone.ExternalInput.defaults
              );
              Tone.Source.call(this, options),
                (this._mediaStream = null),
                (this._stream = null),
                (this._constraints = { audio: !0 }),
                (this._inputNum = options.inputNum),
                (this._gate = new Tone.Gain(0).connect(this.output));
            }),
            Tone.extend(Tone.ExternalInput, Tone.Source),
            (Tone.ExternalInput.defaults = { inputNum: 0 }),
            (Tone.ExternalInput.prototype._getUserMedia = function(
              callback,
              error
            ) {
              Tone.ExternalInput.supported ||
                error("browser does not support 'getUserMedia'"),
                Tone.ExternalInput.sources[this._inputNum] &&
                  (this._constraints = {
                    audio: {
                      optional: [
                        {
                          sourceId:
                            Tone.ExternalInput.sources[this._inputNum].id
                        }
                      ]
                    }
                  }),
                navigator.getUserMedia(
                  this._constraints,
                  function(stream) {
                    this._onStream(stream), callback();
                  }.bind(this),
                  function(err) {
                    error(err);
                  }
                );
            }),
            (Tone.ExternalInput.prototype._onStream = function(stream) {
              if (!this.isFunction(this.context.createMediaStreamSource))
                throw new Error(
                  "Tone.ExternalInput: browser does not support the 'MediaStreamSourceNode'"
                );
              this._stream ||
                ((this._stream = stream),
                (this._mediaStream = this.context.createMediaStreamSource(
                  stream
                )),
                this._mediaStream.connect(this._gate));
            }),
            (Tone.ExternalInput.prototype.open = function(callback, error) {
              return (
                (callback = this.defaultArg(callback, Tone.noOp)),
                (error = this.defaultArg(error, Tone.noOp)),
                Tone.ExternalInput.getSources(
                  function() {
                    this._getUserMedia(callback, error);
                  }.bind(this)
                ),
                this
              );
            }),
            (Tone.ExternalInput.prototype.close = function() {
              if (this._stream) {
                var track = this._stream.getTracks()[this._inputNum];
                this.isUndef(track) || track.stop(), (this._stream = null);
              }
              return this;
            }),
            (Tone.ExternalInput.prototype._start = function(time) {
              return (
                (time = this.toSeconds(time)),
                this._gate.gain.setValueAtTime(1, time),
                this
              );
            }),
            (Tone.ExternalInput.prototype._stop = function(time) {
              return (
                (time = this.toSeconds(time)),
                this._gate.gain.setValueAtTime(0, time),
                this
              );
            }),
            (Tone.ExternalInput.prototype.dispose = function() {
              return (
                Tone.Source.prototype.dispose.call(this),
                this.close(),
                this._mediaStream &&
                  (this._mediaStream.disconnect(), (this._mediaStream = null)),
                (this._constraints = null),
                this._gate.dispose(),
                (this._gate = null),
                this
              );
            }),
            (Tone.ExternalInput.sources = []),
            (Tone.ExternalInput._canGetSources =
              !Tone.prototype.isUndef(window.MediaStreamTrack) &&
              Tone.prototype.isFunction(MediaStreamTrack.getSources)),
            Object.defineProperty(Tone.ExternalInput, "supported", {
              get: function() {
                return Tone.prototype.isFunction(navigator.getUserMedia);
              }
            }),
            (Tone.ExternalInput.getSources = function(callback) {
              return (
                0 === Tone.ExternalInput.sources.length &&
                Tone.ExternalInput._canGetSources
                  ? MediaStreamTrack.getSources(function(media_sources) {
                      for (var i = 0; i < media_sources.length; i++)
                        "audio" === media_sources[i].kind &&
                          (Tone.ExternalInput.sources[i] = media_sources[i]);
                      callback(Tone.ExternalInput.sources);
                    })
                  : callback(Tone.ExternalInput.sources),
                this
              );
            }),
            Tone.ExternalInput
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.MultiPlayer = function() {
              var options = this.optionsObject(
                arguments,
                ["urls", "onload"],
                Tone.MultiPlayer.defaults
              );
              (this.buffers =
                options.urls instanceof Tone.Buffers
                  ? options.urls
                  : new Tone.Buffers(options.urls, options.onload)),
                (this._activeSources = []),
                (this.fadeIn = options.fadeIn),
                (this.fadeOut = options.fadeOut),
                (this._volume = this.output = new Tone.Volume(options.volume)),
                (this.volume = this._volume.volume),
                this._readOnly("volume"),
                (this._volume.output.output.channelCount = 2),
                (this._volume.output.output.channelCountMode = "explicit"),
                (this.mute = options.mute);
            }),
            Tone.extend(Tone.MultiPlayer, Tone.Source),
            (Tone.MultiPlayer.defaults = {
              onload: Tone.noOp,
              fadeIn: 0,
              fadeOut: 0
            }),
            (Tone.MultiPlayer.prototype._getBuffer = function(buffer) {
              return this.isNumber(buffer) || this.isString(buffer)
                ? this.buffers.get(buffer).get()
                : buffer instanceof Tone.Buffer
                ? buffer.get()
                : buffer;
            }),
            (Tone.MultiPlayer.prototype.start = function(
              buffer,
              time,
              offset,
              duration,
              interval,
              gain
            ) {
              buffer = this._getBuffer(buffer);
              var source = new Tone.BufferSource(buffer).connect(this.output);
              return (
                this._activeSources.push(source),
                (time = this.toSeconds(time)),
                source.start(
                  time,
                  offset,
                  duration,
                  this.defaultArg(gain, 1),
                  this.fadeIn
                ),
                duration &&
                  source.stop(time + this.toSeconds(duration), this.fadeOut),
                (source.onended = this._onended.bind(this)),
                (interval = this.defaultArg(interval, 0)),
                (source.playbackRate.value = this.intervalToFrequencyRatio(
                  interval
                )),
                this
              );
            }),
            (Tone.MultiPlayer.prototype._onended = function(source) {
              var index = this._activeSources.indexOf(source);
              this._activeSources.splice(index, 1);
            }),
            (Tone.MultiPlayer.prototype.stop = function(buffer, time) {
              (buffer = this._getBuffer(buffer)), (time = this.toSeconds(time));
              for (var i = 0; i < this._activeSources.length; i++)
                this._activeSources[i].buffer === buffer &&
                  this._activeSources[i].stop(time, this.fadeOut);
              return this;
            }),
            (Tone.MultiPlayer.prototype.stopAll = function(time) {
              time = this.toSeconds(time);
              for (var i = 0; i < this._activeSources.length; i++)
                this._activeSources[i].stop(time, this.fadeOut);
              return this;
            }),
            (Tone.MultiPlayer.prototype.add = function(name, url, callback) {
              return this.buffers.add(name, url, callback), this;
            }),
            Object.defineProperty(Tone.MultiPlayer.prototype, "state", {
              get: function() {
                return this._activeSources.length > 0
                  ? Tone.State.Started
                  : Tone.State.Stopped;
              }
            }),
            Object.defineProperty(Tone.MultiPlayer.prototype, "mute", {
              get: function() {
                return this._volume.mute;
              },
              set: function(mute) {
                this._volume.mute = mute;
              }
            }),
            (Tone.MultiPlayer.prototype.dispose = function() {
              Tone.prototype.dispose.call(this),
                this._volume.dispose(),
                (this._volume = null),
                this._writable("volume"),
                (this.volume = null),
                this.buffers.dispose(),
                (this.buffers = null);
              for (var i = 0; i < this._activeSources.length; i++)
                this._activeSources[i].dispose();
              return (this._activeSources = null), this;
            }),
            Tone.MultiPlayer
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.GrainPlayer = function() {
              var options = this.optionsObject(
                arguments,
                ["url", "onload"],
                Tone.GrainPlayer.defaults
              );
              Tone.Source.call(this),
                (this.buffer = new Tone.Buffer(options.url, options.onload)),
                (this._player = this.output = new Tone.MultiPlayer()),
                (this._clock = new Tone.Clock(this._tick.bind(this), 1)),
                (this._loopStart = 0),
                (this._loopEnd = 0),
                (this._playbackRate = options.playbackRate),
                (this._grainSize = options.grainSize),
                (this._overlap = options.overlap),
                (this.detune = options.detune),
                (this.drift = options.drift),
                (this.overlap = options.overlap),
                (this.loop = options.loop),
                (this.playbackRate = options.playbackRate),
                (this.grainSize = options.grainSize),
                (this.loopStart = options.loopStart),
                (this.loopEnd = options.loopEnd),
                (this.reverse = options.reverse);
            }),
            Tone.extend(Tone.GrainPlayer, Tone.Source),
            (Tone.GrainPlayer.defaults = {
              onload: Tone.noOp,
              overlap: 0.1,
              grainSize: 0.2,
              drift: 0,
              playbackRate: 1,
              detune: 0,
              loop: !1,
              loopStart: 0,
              loopEnd: 0,
              reverse: !1
            }),
            (Tone.GrainPlayer.prototype._start = function(time, offset) {
              (offset = this.defaultArg(offset, 0)),
                (offset = this.toSeconds(offset)),
                (time = this.toSeconds(time)),
                (this._offset = offset),
                this._clock.start(time);
            }),
            (Tone.GrainPlayer.prototype._stop = function(time) {
              this._clock.stop(time),
                this._player.stop(this.buffer, time),
                (this._offset = 0);
            }),
            (Tone.GrainPlayer.prototype._tick = function(time) {
              var bufferDuration = this.buffer.duration;
              this.loop &&
                this._loopEnd > 0 &&
                (bufferDuration = this._loopEnd);
              var drift = (2 * Math.random() - 1) * this.drift,
                offset = this._offset - this._overlap + drift,
                detune = this.detune / 100,
                originalFadeIn = this._player.fadeIn;
              if (this.loop && this._offset > bufferDuration) {
                var endSegmentDuration = this._offset - bufferDuration;
                this._player.start(
                  this.buffer,
                  time,
                  offset,
                  endSegmentDuration + this._overlap,
                  detune
                ),
                  (offset = this._offset % bufferDuration),
                  (this._offset = this._loopStart),
                  (this._player.fadeIn = 0),
                  this._player.start(
                    this.buffer,
                    time + endSegmentDuration,
                    this._offset,
                    offset + this._overlap,
                    detune
                  );
              } else
                this._offset > bufferDuration
                  ? this.stop(time)
                  : (0 > offset &&
                      ((this._player.fadeIn = Math.max(
                        this._player.fadeIn + offset,
                        0
                      )),
                      (offset = 0)),
                    this._player.start(
                      this.buffer,
                      time,
                      offset,
                      this.grainSize + this._overlap,
                      detune
                    ));
              this._player.fadeIn = originalFadeIn;
              var duration = this._clock._nextTick - time;
              this._offset += duration * this._playbackRate;
            }),
            (Tone.GrainPlayer.prototype.scrub = function(offset, time) {
              return (
                (this._offset = this.toSeconds(offset)),
                this._tick(this.toSeconds(time)),
                this
              );
            }),
            Object.defineProperty(Tone.GrainPlayer.prototype, "playbackRate", {
              get: function() {
                return this._playbackRate;
              },
              set: function(rate) {
                (this._playbackRate = rate), (this.grainSize = this._grainSize);
              }
            }),
            Object.defineProperty(Tone.GrainPlayer.prototype, "loopStart", {
              get: function() {
                return this._loopStart;
              },
              set: function(time) {
                this._loopStart = this.toSeconds(time);
              }
            }),
            Object.defineProperty(Tone.GrainPlayer.prototype, "loopEnd", {
              get: function() {
                return this._loopEnd;
              },
              set: function(time) {
                this._loopEnd = this.toSeconds(time);
              }
            }),
            Object.defineProperty(Tone.GrainPlayer.prototype, "reverse", {
              get: function() {
                return this.buffer.reverse;
              },
              set: function(rev) {
                this.buffer.reverse = rev;
              }
            }),
            Object.defineProperty(Tone.GrainPlayer.prototype, "grainSize", {
              get: function() {
                return this._grainSize;
              },
              set: function(size) {
                (this._grainSize = this.toSeconds(size)),
                  (this._clock.frequency.value =
                    this._playbackRate / this._grainSize);
              }
            }),
            Object.defineProperty(Tone.GrainPlayer.prototype, "overlap", {
              get: function() {
                return this._overlap;
              },
              set: function(time) {
                (time = this.toSeconds(time)),
                  (this._overlap = time),
                  this._overlap < 0
                    ? ((this._player.fadeIn = 0.01),
                      (this._player.fadeOut = 0.01))
                    : ((this._player.fadeIn = time),
                      (this._player.fadeOut = time));
              }
            }),
            (Tone.GrainPlayer.prototype.dispose = function() {
              return (
                Tone.Source.prototype.dispose.call(this),
                this.buffer.dispose(),
                (this.buffer = null),
                this._player.dispose(),
                (this._player = null),
                this._clock.dispose(),
                (this._clock = null),
                this
              );
            }),
            Tone.GrainPlayer
          );
        }),
        Module(function(Tone) {
          return (
            (Tone.Microphone = function() {
              Tone.ExternalInput.call(this, 0);
            }),
            Tone.extend(Tone.Microphone, Tone.ExternalInput),
            Object.defineProperty(Tone.Microphone, "supported", {
              get: function() {
                return Tone.ExternalInput.supported;
              }
            }),
            Tone.Microphone
          );
        }),
        Tone
      );
    });
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "2c67b5f8174a25cfc198d4e438bdcd4d.mp3";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "2271d49925c25b4ffb681f47ff10f3e3.mp3";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "e957a599f8f8d9ed8072cac9f25d2a8e.mp3";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "a03780f114b7cd86cce96848c298adcf.mp3";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "aaf3ea7db63a541db76ed4119f000bcc.mp3";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "57d55e9fcc8de6dd7bbb8796cb4870d6.mp3";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "d9c052ef55738ce572bd2ab0b5bd9e10.wav";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "334f1a78b15d598fd30aee6ec5bd4efd.wav";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "8860158537afda1fcf2385bb22e7cfca.wav";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "d0f778ff4994701a6b71f0a7883a7d78.wav";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "573b9825c0d41adeacc19361ee478c51.wav";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "a2db3847acfabec3949626f403ebb155.wav";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "0be7464d7b1f261512fec7ab3c7f8524.wav";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "0e8a7efef4cbcd8af8d06462ba467906.mp3";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "b9fe3d296f881dc50e9c7c473986e177.mp3";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "d71584880c7942c7c86aaa65d6775826.mp3";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "ed98000a04db4ef35fbc106c7159ebf0.mp3";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "df3db22aa4ec46239e4e4888883d2d71.mp3";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "a73a597f9a49a7dbce7bd03ddea34b1a.mp3";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "394ca056be20f60241f8e547314edb70.wav";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "cec6cb84a509c2b00afdc1172c972841.wav";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "796976e8f8f0f0b2c70f303f59aac298.wav";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "0d8ceea706594b8a11a7449e382ab022.wav";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "daeebdc073b394303a755530696fa5b0.wav";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "65e22613983a8ea0d09fa5db49a1205f.wav";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "6a6cd84fea76d13933b5384296828261.wav";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "ce4dc459ad5643f0dd5e18bee62568c3.mp3";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "761d1762e0c0df2d897c828915bea4f4.mp3";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "bdb51017307be51d20ef6f4de2f75a0d.mp3";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "e80cd6f9233f92c8f9c91c67074460a2.mp3";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "82a8d3861cb36a13ab846b9a9c14ac3f.mp3";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "9dcc8aebacd9404a7d791529a03749c5.mp3";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "922f5805a3154e7a36657cdeaa4b7a64.mp3";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "666a8f3141f71e69b22b8f015795ba9d.mp3";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "192e8405d9c48c4e4236987c07e66c0e.mp3";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "de1d543334e8bf811fec1363bb67a584.mp3";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "ae077c3cdad8a0763340b14f7e57427c.mp3";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "8e3b48de50c3bf484a2a5a0494bb5b5f.mp3";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "3f7325f49095a0d3e709db445a9f2688.wav";
  },
  function(module, exports, __webpack_require__) {
    module.exports =
      __webpack_require__.p + "73884b4dae4db1636f330600e2910d9c.wav";
  },
  function(module, exports) {
    "use strict";
    function makePlayer(container, sounds, sound, loopSpecs) {
      var button = document.createElement("button");
      (button.textContent = "Play"), (button.style.float = "right");
      var playingSources = null;
      button.addEventListener("click", function() {
        if (playingSources) {
          var _iteratorNormalCompletion = !0,
            _didIteratorError = !1,
            _iteratorError = void 0;
          try {
            for (
              var _step, _iterator = playingSources[Symbol.iterator]();
              !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
              _iteratorNormalCompletion = !0
            ) {
              var src = _step.value;
              src.stop(), src.disconnect();
            }
          } catch (err) {
            (_didIteratorError = !0), (_iteratorError = err);
          } finally {
            try {
              !_iteratorNormalCompletion &&
                _iterator.return &&
                _iterator.return();
            } finally {
              if (_didIteratorError) throw _iteratorError;
            }
          }
          (playingSources = null), (button.innerHTML = "Play");
        } else
          (button.disabled = !0),
            sounds
              .getSampleBuffer(sound)
              .then(function(buf) {
                (button.disabled = !1),
                  (playingSources = loopSpecs.map(function(_ref) {
                    var _ref$loop = _ref.loop,
                      loop = void 0 === _ref$loop ? !1 : _ref$loop,
                      _ref$loopStart = _ref.loopStart,
                      loopStart =
                        void 0 === _ref$loopStart ? 0 : _ref$loopStart,
                      _ref$loopEnd = _ref.loopEnd,
                      loopEnd = void 0 === _ref$loopEnd ? null : _ref$loopEnd,
                      _ref$start = _ref.start,
                      start = void 0 === _ref$start ? 0 : _ref$start,
                      pan = _ref.pan,
                      _ref$rate = _ref.rate,
                      rate = void 0 === _ref$rate ? 1 : _ref$rate,
                      src = sounds.audioCtx.createBufferSource();
                    if (
                      ((src.buffer = buf),
                      (src.playbackRate.value = rate),
                      (src.loop = loop),
                      (src.loopStart = loopStart),
                      (src.loopEnd = loopEnd),
                      src.addEventListener("ended", function(evt) {
                        var idx = playingSources
                          ? playingSources.indexOf(evt.target)
                          : -1;
                        idx >= 0 &&
                          (playingSources.splice(idx, 1),
                          playingSources.length ||
                            ((playingSources = null),
                            (button.innerHTML = "Play")));
                      }),
                      pan)
                    ) {
                      var panner = sounds.audioCtx.createStereoPanner();
                      (panner.pan.value = pan),
                        src.connect(panner),
                        panner.connect(sounds.audioCtx.destination);
                    } else src.connect(sounds.audioCtx.destination);
                    return src.start(0, start), src;
                  }));
              })
              .catch(function(e) {
                (button.disabled = !1), console.error(e);
              }),
            (button.innerHTML = "Stop");
      }),
        container.insertBefore(button, container.firstChild);
    }
    function initRainPlayers(sounds) {
      var itsGonnaRain = document.querySelector(".player-itsgonnarain"),
        itsGonnaRainLoopedFull = document.querySelector(
          ".player-itsgonnarain-looped-full"
        ),
        itsGonnaRainLoopedSpecificStartZero = document.querySelector(
          ".player-itsgonnarain-looped-specific-startzero"
        ),
        itsGonnaRainLoopedSpecific = document.querySelector(
          ".player-itsgonnarain-looped-specific"
        ),
        itsGonnaRainTwo = document.querySelector(".player-itsgonnarain-two"),
        itsGonnaRainTwoPanned = document.querySelector(
          ".player-itsgonnarain-two-panned"
        ),
        itsGonnaRainTwoPannedPhased = document.querySelector(
          ".player-itsgonnarain-two-panned-phased"
        ),
        itsGonnaRainSound = sounds.getSounds().filter(function(s) {
          return "It's Gonna Rain" === s.name;
        })[0];
      makePlayer(itsGonnaRain, sounds, itsGonnaRainSound, [{}]),
        makePlayer(itsGonnaRainLoopedFull, sounds, itsGonnaRainSound, [
          { loop: !0 }
        ]),
        makePlayer(
          itsGonnaRainLoopedSpecificStartZero,
          sounds,
          itsGonnaRainSound,
          [{ loop: !0, loopStart: 3.02, loopEnd: 3.82 }]
        ),
        makePlayer(itsGonnaRainLoopedSpecific, sounds, itsGonnaRainSound, [
          { loop: !0, loopStart: 3.02, loopEnd: 3.82, start: 3.02 }
        ]),
        makePlayer(itsGonnaRainTwo, sounds, itsGonnaRainSound, [
          { loop: !0, loopStart: 3.02, loopEnd: 3.82, start: 3.02 },
          { loop: !0, loopStart: 3.02, loopEnd: 3.82, start: 3.02 }
        ]),
        makePlayer(itsGonnaRainTwoPanned, sounds, itsGonnaRainSound, [
          { loop: !0, loopStart: 3.02, loopEnd: 3.82, start: 3.02, pan: -1 },
          { loop: !0, loopStart: 3.02, loopEnd: 3.82, start: 3.02, pan: 1 }
        ]),
        makePlayer(itsGonnaRainTwoPannedPhased, sounds, itsGonnaRainSound, [
          {
            loop: !0,
            loopStart: 3.02,
            loopEnd: 3.82,
            start: 3.02,
            pan: -1,
            rate: 1
          },
          {
            loop: !0,
            loopStart: 3.02,
            loopEnd: 3.82,
            start: 3.02,
            pan: 1,
            rate: 1.002
          }
        ]);
    }
    Object.defineProperty(exports, "__esModule", { value: !0 }),
      (exports.initRainPlayers = initRainPlayers);
  },
  function(module, exports) {
    "use strict";
    function startLoops(container, sounds, notes, timings, delays) {
      var _ref =
          arguments.length <= 5 || void 0 === arguments[5] ? {} : arguments[5],
        _ref$interval = _ref.interval,
        interval = void 0 === _ref$interval ? !1 : _ref$interval,
        _ref$immediate = _ref.immediate,
        immediate = void 0 === _ref$immediate ? !1 : _ref$immediate,
        _ref$convolve = _ref.convolve,
        convolve = void 0 === _ref$convolve ? null : _ref$convolve,
        button = document.createElement("button");
      (button.textContent = "Play"), (button.style.float = "right");
      var started = !1,
        timeouts = [],
        playingSources = [],
        convolver = void 0;
      button.addEventListener("click", function() {
        if (started) {
          var _iteratorNormalCompletion = !0,
            _didIteratorError = !1,
            _iteratorError = void 0;
          try {
            for (
              var _step, _iterator = timeouts[Symbol.iterator]();
              !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
              _iteratorNormalCompletion = !0
            ) {
              var t = _step.value;
              interval ? clearInterval(t) : clearTimeout(t);
            }
          } catch (err) {
            (_didIteratorError = !0), (_iteratorError = err);
          } finally {
            try {
              !_iteratorNormalCompletion &&
                _iterator.return &&
                _iterator.return();
            } finally {
              if (_didIteratorError) throw _iteratorError;
            }
          }
          timeouts = [];
          var _iteratorNormalCompletion2 = !0,
            _didIteratorError2 = !1,
            _iteratorError2 = void 0;
          try {
            for (
              var _step2, _iterator2 = playingSources[Symbol.iterator]();
              !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done);
              _iteratorNormalCompletion2 = !0
            ) {
              var src = _step2.value;
              src.stop(), src.disconnect();
            }
          } catch (err) {
            (_didIteratorError2 = !0), (_iteratorError2 = err);
          } finally {
            try {
              !_iteratorNormalCompletion2 &&
                _iterator2.return &&
                _iterator2.return();
            } finally {
              if (_didIteratorError2) throw _iteratorError2;
            }
          }
          convolver && (convolver.disconnect(), (convolver = null)),
            (playingSources = []),
            (started = !1),
            (button.innerHTML = "Play");
        } else
          !(function() {
            (button.disabled = !0),
              (started = !0),
              (button.innerHTML = "Stop"),
              convolve &&
                ((convolver = sounds.audioCtx.createConvolver()),
                (convolver.buffer = convolve),
                convolver.connect(sounds.audioCtx.destination));
            var dest = convolver || sounds.audioCtx.destination;
            sounds.getGrandPianoSoftSampleBuffers().then(function(buffers) {
              (button.disabled = !1),
                (timeouts = notes.map(function(note, idx) {
                  var snd = buffers.filter(function(b) {
                    return b.note === note;
                  })[0];
                  if (immediate) {
                    var _src = sounds.audioCtx.createBufferSource();
                    (_src.buffer = snd.buffer),
                      (_src.playbackRate.value = snd.rate),
                      _src.connect(dest),
                      _src.start(sounds.audioCtx.currentTime + delays[idx]),
                      playingSources.push(_src);
                  }
                  return (interval ? setInterval : setTimeout)(function() {
                    var src = sounds.audioCtx.createBufferSource();
                    (src.buffer = snd.buffer),
                      (src.playbackRate.value = snd.rate),
                      src.connect(dest),
                      src.start(),
                      playingSources.push(src);
                  }, timings[idx]);
                })),
                interval ||
                  timeouts.push(
                    setTimeout(
                      function() {
                        (timeouts = []),
                          (playingSources = []),
                          (started = !1),
                          convolver &&
                            (convolver.disconnect(), (convolver = null)),
                          (button.innerHTML = "Play");
                      },
                      timings.reduce(function(max, t) {
                        return Math.max(max, t);
                      }, 0) + 7500
                    )
                  );
            });
          })();
      }),
        container.insertBefore(button, container.firstChild);
    }
    function initLoopPlayers(sounds) {
      var once = document.querySelector(".player-coranglais-once"),
        single = document.querySelector(".player-coranglais-single"),
        singleImmediate = document.querySelector(
          ".player-coranglais-single-immediate"
        ),
        singleDelayed = document.querySelector(
          ".player-coranglais-single-delayed"
        ),
        singleConvolved = document.querySelector(
          ".player-coranglais-single-convolved"
        );
      sounds.getAirportSampleBuffer().then(function(convolverBuffer) {
        startLoops(
          once,
          sounds,
          ["F3", "Ab3", "C4", "Db4", "Eb4", "F4", "Ab4"],
          [1e3, 2e3, 3e3, 4e3, 5e3, 6e3, 7e3],
          [0, 0, 0, 0, 0, 0, 0]
        ),
          startLoops(single, sounds, ["C4"], [2e4], [0], { interval: !0 }),
          startLoops(singleImmediate, sounds, ["C4"], [2e4], [0], {
            interval: !0,
            immediate: !0
          }),
          startLoops(singleDelayed, sounds, ["C4"], [2e4], [5], {
            interval: !0,
            immediate: !0
          }),
          startLoops(singleConvolved, sounds, ["C4"], [0], [0], {
            convolve: convolverBuffer
          });
      });
    }
    Object.defineProperty(exports, "__esModule", { value: !0 }),
      (exports.initLoopPlayers = initLoopPlayers);
  },
  function(module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function initPhasing(sounds, soundIndex, element, large) {
      var waveformColor =
          arguments.length <= 4 || void 0 === arguments[4]
            ? _randomcolor2.default({
                luminosity: "bright",
                format: "rgbArray"
              })
            : arguments[4],
        startStop = element.querySelector(".startstop"),
        waveformCanvas = element.querySelector(".canvas"),
        waveformCtx = waveformCanvas.getContext("2d"),
        spinnerCanvas = element.querySelector(".spinners"),
        spinnerCtx = spinnerCanvas.getContext("2d"),
        sound = sounds.getSounds()[soundIndex];
      sounds.getSampleBuffer(sound).then(function(audioBuffer) {
        function start() {
          (running = !0),
            loop1.start(1, -1),
            loop2.start(1.002, 1),
            (function drawVis() {
              running &&
                (_spinner_vis.visualizeSpinners(
                  spinnerCtx,
                  loop1,
                  loop2,
                  running,
                  hovering,
                  large
                ),
                _waveform_vis.visualizeWaveforms(
                  waveformCtx,
                  waveform,
                  [loop1, loop2],
                  waveformColor,
                  large
                ),
                requestAnimationFrame(drawVis));
            })();
        }
        function stop() {
          (running = !1),
            loop1.stop(),
            loop2.stop(),
            _spinner_vis.visualizeSpinners(
              spinnerCtx,
              loop1,
              loop2,
              running,
              hovering,
              large
            );
        }
        var waveform = new _waveform.Waveform(audioBuffer),
          loop1 = new _loop.Loop(
            sounds.audioCtx,
            audioBuffer,
            sound.startAt,
            sound.endAt
          ),
          loop2 = new _loop.Loop(
            sounds.audioCtx,
            audioBuffer,
            sound.startAt,
            sound.endAt
          ),
          running = !1,
          hovering = !1;
        startStop.addEventListener("click", function(evt) {
          running ? stop() : start(), evt.preventDefault();
        }),
          startStop.addEventListener("mouseover", function() {
            (hovering = !0),
              _spinner_vis.visualizeSpinners(
                spinnerCtx,
                loop1,
                loop2,
                running,
                hovering,
                large
              );
          }),
          startStop.addEventListener("mouseout", function() {
            (hovering = !1),
              _spinner_vis.visualizeSpinners(
                spinnerCtx,
                loop1,
                loop2,
                running,
                hovering,
                large
              );
          }),
          _spinner_vis.visualizeSpinners(
            spinnerCtx,
            loop1,
            loop2,
            running,
            hovering,
            large
          ),
          _waveform_vis.visualizeWaveforms(
            waveformCtx,
            waveform,
            [loop1, loop2],
            waveformColor,
            large
          );
      });
    }
    Object.defineProperty(exports, "__esModule", { value: !0 }),
      (exports.initPhasing = initPhasing);
    var _loop = __webpack_require__(50),
      _waveform = __webpack_require__(51),
      _spinner_vis = __webpack_require__(54),
      _waveform_vis = __webpack_require__(55),
      _randomcolor = __webpack_require__(56),
      _randomcolor2 = _interopRequireDefault(_randomcolor);
  },
  function(module, exports) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor))
        throw new TypeError("Cannot call a class as a function");
    }
    Object.defineProperty(exports, "__esModule", { value: !0 });
    var _createClass = (function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          (descriptor.enumerable = descriptor.enumerable || !1),
            (descriptor.configurable = !0),
            "value" in descriptor && (descriptor.writable = !0),
            Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        return (
          protoProps && defineProperties(Constructor.prototype, protoProps),
          staticProps && defineProperties(Constructor, staticProps),
          Constructor
        );
      };
    })();
    exports.Loop = (function() {
      function Loop(audioContext, audioBuffer) {
        var loopStart =
            arguments.length <= 2 || void 0 === arguments[2] ? 0 : arguments[2],
          loopEnd =
            arguments.length <= 3 || void 0 === arguments[3] ? 0 : arguments[3];
        _classCallCheck(this, Loop),
          (this.audioContext = audioContext),
          (this.audioBuffer = audioBuffer),
          (this.loopStart = loopStart),
          (this.loopEnd = loopEnd),
          (this.loopDuration = this.loopEnd - this.loopStart),
          (this.playedSoFar = 0);
      }
      return (
        _createClass(Loop, [
          {
            key: "start",
            value: function() {
              var rate =
                  arguments.length <= 0 || void 0 === arguments[0]
                    ? 1
                    : arguments[0],
                pan =
                  arguments.length <= 1 || void 0 === arguments[1]
                    ? 0
                    : arguments[1];
              (this.fullBufferSource = this.audioContext.createBufferSource()),
                (this.loopBufferSource = this.audioContext.createBufferSource()),
                (this.gain = this.audioContext.createGain()),
                (this.stereoPanner = this.audioContext.createStereoPanner()),
                (this.fullBufferSource.buffer = this.audioBuffer),
                (this.loopBufferSource.buffer = this.audioBuffer),
                (this.loopBufferSource.playbackRate.value = rate),
                (this.loopBufferSource.loop = !0),
                (this.loopBufferSource.loopStart = this.loopStart),
                (this.loopBufferSource.loopEnd = this.loopEnd),
                (this.stereoPanner.pan.value = pan),
                this.fullBufferSource.connect(this.gain),
                this.loopBufferSource.connect(this.gain),
                this.gain.connect(this.stereoPanner),
                this.stereoPanner.connect(this.audioContext.destination),
                (this.playbackRate = rate),
                this.playedSoFar < this.audioBuffer.duration &&
                  this.fullBufferSource.start(0, this.playedSoFar),
                this.loopBufferSource.start(
                  this.audioContext.currentTime +
                    (this.audioBuffer.duration - this.playedSoFar),
                  this.playedSoFar < this.audioBuffer.duration
                    ? this.loopStart
                    : this.absolutePosition
                ),
                (this.currentPlayStartedAt = this.audioContext.currentTime);
            }
          },
          {
            key: "stop",
            value: function() {
              this.playedSoFar < this.audioBuffer.duration &&
                (this.fullBufferSource.stop(),
                this.fullBufferSource.disconnect()),
                this.loopBufferSource.stop(),
                this.loopBufferSource.disconnect(),
                this.gain.disconnect(),
                this.stereoPanner.disconnect(),
                (this.playedSoFar += this.playedThisTime),
                (this.bufferSource = null),
                (this.gain = null),
                (this.stereoPanner = null),
                (this.currentPlayStartedAt = null),
                (this.playbackRate = null);
            }
          },
          {
            key: "mute",
            value: function() {
              this.gain && (this.gain.gain.value = 0);
            }
          },
          {
            key: "unmute",
            value: function() {
              this.gain && (this.gain.gain.value = 1);
            }
          },
          {
            key: "playedThisTime",
            get: function() {
              return this.currentPlayStartedAt
                ? this.audioContext.currentTime - this.currentPlayStartedAt
                : 0;
            }
          },
          {
            key: "muted",
            get: function() {
              return this.gain && 0 === this.gain.gain.value;
            }
          },
          {
            key: "duration",
            get: function() {
              return 0 === this.loopDuration
                ? this.audioBuffer.duration
                : this.loopDuration;
            }
          },
          {
            key: "relativePositionInLoop",
            get: function() {
              if (
                this.playedSoFar + this.playedThisTime >
                this.audioBuffer.duration
              ) {
                var playTime =
                  (this.playedSoFar +
                    this.playedThisTime -
                    this.audioBuffer.duration) *
                  this.playbackRate;
                return playTime / this.duration;
              }
              return 0;
            }
          },
          {
            key: "relativePositionInLoopModLoop",
            get: function() {
              var total = this.relativePositionInLoop;
              return total - Math.floor(total);
            }
          },
          {
            key: "absolutePosition",
            get: function() {
              return this.playedSoFar + this.playedThisTime >
                this.audioBuffer.duration
                ? this.loopStart +
                    this.relativePositionInLoopModLoop * this.duration
                : this.playedSoFar + this.playedThisTime;
            }
          },
          {
            key: "relativePositionInSample",
            get: function() {
              return this.absolutePosition / this.audioBuffer.duration;
            }
          }
        ]),
        Loop
      );
    })();
  },
  function(module, exports, __webpack_require__) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor))
        throw new TypeError("Cannot call a class as a function");
    }
    Object.defineProperty(exports, "__esModule", { value: !0 }),
      (exports.Waveform = void 0);
    var _createClass = (function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            (descriptor.enumerable = descriptor.enumerable || !1),
              (descriptor.configurable = !0),
              "value" in descriptor && (descriptor.writable = !0),
              Object.defineProperty(target, descriptor.key, descriptor);
          }
        }
        return function(Constructor, protoProps, staticProps) {
          return (
            protoProps && defineProperties(Constructor.prototype, protoProps),
            staticProps && defineProperties(Constructor, staticProps),
            Constructor
          );
        };
      })(),
      _lodash = __webpack_require__(52);
    exports.Waveform = (function() {
      function Waveform(audioBuffer) {
        var startPos =
            arguments.length <= 1 || void 0 === arguments[1] ? 0 : arguments[1],
          endPos =
            arguments.length <= 2 || void 0 === arguments[2]
              ? audioBuffer.duration
              : arguments[2];
        _classCallCheck(this, Waveform),
          (this.audioBuffer = audioBuffer),
          (this.startPos = startPos),
          (this.endPos = endPos),
          (this.visualization = this._downsampleBuffer());
      }
      return (
        _createClass(Waveform, [
          {
            key: "_downsampleBuffer",
            value: function() {
              for (
                var offset = this.startPos * this.audioBuffer.sampleRate,
                  sampleCount =
                    (this.endPos - this.startPos) * this.audioBuffer.sampleRate,
                  maxSampleCount = 5e3,
                  downsample = Math.ceil(sampleCount / maxSampleCount),
                  downsampledBuf = new Float32Array(
                    Math.floor(this.audioBuffer.length / downsample)
                  ),
                  bin = 0;
                bin < downsampledBuf.length;
                bin++
              ) {
                for (
                  var total = 0, chan = 0;
                  chan < this.audioBuffer.numberOfChannels;
                  chan++
                )
                  for (
                    var chanData = this.audioBuffer.getChannelData(chan),
                      idx = 0;
                    downsample > idx;
                    idx++
                  )
                    total += chanData[offset + bin * downsample + idx];
                var avg =
                  total / (this.audioBuffer.numberOfChannels * downsample);
                downsampledBuf[bin] = avg;
              }
              this._lowPassFilter(downsampledBuf, 0.5);
              for (
                var maxVal = _lodash.max(downsampledBuf), _bin = 0;
                _bin < downsampledBuf.length;
                _bin++
              )
                downsampledBuf[_bin] = downsampledBuf[_bin] / maxVal;
              return downsampledBuf;
            }
          },
          {
            key: "visualize",
            value: function() {
              var position =
                  arguments.length <= 0 || void 0 === arguments[0]
                    ? 0
                    : arguments[0],
                cutoffPoint = Math.floor(position * this.visualization.length),
                result = new Float32Array(this.visualization.length);
              return (
                result.set(
                  this.visualization.subarray(
                    cutoffPoint,
                    this.visualization.length
                  )
                ),
                result.set(
                  this.visualization.subarray(0, cutoffPoint),
                  this.visualization.length - cutoffPoint
                ),
                result
              );
            }
          },
          {
            key: "_lowPassFilter",
            value: function(arr) {
              for (
                var smoothing =
                    arguments.length <= 1 || void 0 === arguments[1]
                      ? 0.1
                      : arguments[1],
                  value = arr[0],
                  i = 1;
                i < arr.length;
                i++
              ) {
                var currentValue = arr[i];
                (value += (currentValue - value) * smoothing), (arr[i] = value);
              }
              return arr;
            }
          }
        ]),
        Waveform
      );
    })();
  },
  function(module, exports, __webpack_require__) {
    var __WEBPACK_AMD_DEFINE_RESULT__;
    !function(module, global) {
      !function() {
        function addMapEntry(map, pair) {
          return map.set(pair[0], pair[1]), map;
        }
        function addSetEntry(set, value) {
          return set.add(value), set;
        }
        function apply(func, thisArg, args) {
          var length = args.length;
          switch (length) {
            case 0:
              return func.call(thisArg);
            case 1:
              return func.call(thisArg, args[0]);
            case 2:
              return func.call(thisArg, args[0], args[1]);
            case 3:
              return func.call(thisArg, args[0], args[1], args[2]);
          }
          return func.apply(thisArg, args);
        }
        function arrayAggregator(array, setter, iteratee, accumulator) {
          for (
            var index = -1, length = array ? array.length : 0;
            ++index < length;

          ) {
            var value = array[index];
            setter(accumulator, value, iteratee(value), array);
          }
          return accumulator;
        }
        function arrayEach(array, iteratee) {
          for (
            var index = -1, length = array ? array.length : 0;
            ++index < length && iteratee(array[index], index, array) !== !1;

          );
          return array;
        }
        function arrayEachRight(array, iteratee) {
          for (
            var length = array ? array.length : 0;
            length-- && iteratee(array[length], length, array) !== !1;

          );
          return array;
        }
        function arrayEvery(array, predicate) {
          for (
            var index = -1, length = array ? array.length : 0;
            ++index < length;

          )
            if (!predicate(array[index], index, array)) return !1;
          return !0;
        }
        function arrayFilter(array, predicate) {
          for (
            var index = -1,
              length = array ? array.length : 0,
              resIndex = 0,
              result = [];
            ++index < length;

          ) {
            var value = array[index];
            predicate(value, index, array) && (result[resIndex++] = value);
          }
          return result;
        }
        function arrayIncludes(array, value) {
          var length = array ? array.length : 0;
          return !!length && baseIndexOf(array, value, 0) > -1;
        }
        function arrayIncludesWith(array, value, comparator) {
          for (
            var index = -1, length = array ? array.length : 0;
            ++index < length;

          )
            if (comparator(value, array[index])) return !0;
          return !1;
        }
        function arrayMap(array, iteratee) {
          for (
            var index = -1,
              length = array ? array.length : 0,
              result = Array(length);
            ++index < length;

          )
            result[index] = iteratee(array[index], index, array);
          return result;
        }
        function arrayPush(array, values) {
          for (
            var index = -1, length = values.length, offset = array.length;
            ++index < length;

          )
            array[offset + index] = values[index];
          return array;
        }
        function arrayReduce(array, iteratee, accumulator, initAccum) {
          var index = -1,
            length = array ? array.length : 0;
          for (
            initAccum && length && (accumulator = array[++index]);
            ++index < length;

          )
            accumulator = iteratee(accumulator, array[index], index, array);
          return accumulator;
        }
        function arrayReduceRight(array, iteratee, accumulator, initAccum) {
          var length = array ? array.length : 0;
          for (
            initAccum && length && (accumulator = array[--length]);
            length--;

          )
            accumulator = iteratee(accumulator, array[length], length, array);
          return accumulator;
        }
        function arraySome(array, predicate) {
          for (
            var index = -1, length = array ? array.length : 0;
            ++index < length;

          )
            if (predicate(array[index], index, array)) return !0;
          return !1;
        }
        function baseFindKey(collection, predicate, eachFunc) {
          var result;
          return (
            eachFunc(collection, function(value, key, collection) {
              return predicate(value, key, collection)
                ? ((result = key), !1)
                : void 0;
            }),
            result
          );
        }
        function baseFindIndex(array, predicate, fromIndex, fromRight) {
          for (
            var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
            fromRight ? index-- : ++index < length;

          )
            if (predicate(array[index], index, array)) return index;
          return -1;
        }
        function baseIndexOf(array, value, fromIndex) {
          if (value !== value) return indexOfNaN(array, fromIndex);
          for (
            var index = fromIndex - 1, length = array.length;
            ++index < length;

          )
            if (array[index] === value) return index;
          return -1;
        }
        function baseIndexOfWith(array, value, fromIndex, comparator) {
          for (
            var index = fromIndex - 1, length = array.length;
            ++index < length;

          )
            if (comparator(array[index], value)) return index;
          return -1;
        }
        function baseMean(array, iteratee) {
          var length = array ? array.length : 0;
          return length ? baseSum(array, iteratee) / length : NAN;
        }
        function baseReduce(
          collection,
          iteratee,
          accumulator,
          initAccum,
          eachFunc
        ) {
          return (
            eachFunc(collection, function(value, index, collection) {
              accumulator = initAccum
                ? ((initAccum = !1), value)
                : iteratee(accumulator, value, index, collection);
            }),
            accumulator
          );
        }
        function baseSortBy(array, comparer) {
          var length = array.length;
          for (array.sort(comparer); length--; )
            array[length] = array[length].value;
          return array;
        }
        function baseSum(array, iteratee) {
          for (
            var result, index = -1, length = array.length;
            ++index < length;

          ) {
            var current = iteratee(array[index]);
            current !== undefined &&
              (result = result === undefined ? current : result + current);
          }
          return result;
        }
        function baseTimes(n, iteratee) {
          for (var index = -1, result = Array(n); ++index < n; )
            result[index] = iteratee(index);
          return result;
        }
        function baseToPairs(object, props) {
          return arrayMap(props, function(key) {
            return [key, object[key]];
          });
        }
        function baseUnary(func) {
          return function(value) {
            return func(value);
          };
        }
        function baseValues(object, props) {
          return arrayMap(props, function(key) {
            return object[key];
          });
        }
        function cacheHas(cache, key) {
          return cache.has(key);
        }
        function charsStartIndex(strSymbols, chrSymbols) {
          for (
            var index = -1, length = strSymbols.length;
            ++index < length &&
            baseIndexOf(chrSymbols, strSymbols[index], 0) > -1;

          );
          return index;
        }
        function charsEndIndex(strSymbols, chrSymbols) {
          for (
            var index = strSymbols.length;
            index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1;

          );
          return index;
        }
        function checkGlobal(value) {
          return value && value.Object === Object ? value : null;
        }
        function countHolders(array, placeholder) {
          for (var length = array.length, result = 0; length--; )
            array[length] === placeholder && result++;
          return result;
        }
        function deburrLetter(letter) {
          return deburredLetters[letter];
        }
        function escapeHtmlChar(chr) {
          return htmlEscapes[chr];
        }
        function escapeStringChar(chr) {
          return "\\" + stringEscapes[chr];
        }
        function getValue(object, key) {
          return null == object ? undefined : object[key];
        }
        function indexOfNaN(array, fromIndex, fromRight) {
          for (
            var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
            fromRight ? index-- : ++index < length;

          ) {
            var other = array[index];
            if (other !== other) return index;
          }
          return -1;
        }
        function isHostObject(value) {
          var result = !1;
          if (null != value && "function" != typeof value.toString)
            try {
              result = !!(value + "");
            } catch (e) {}
          return result;
        }
        function iteratorToArray(iterator) {
          for (var data, result = []; !(data = iterator.next()).done; )
            result.push(data.value);
          return result;
        }
        function mapToArray(map) {
          var index = -1,
            result = Array(map.size);
          return (
            map.forEach(function(value, key) {
              result[++index] = [key, value];
            }),
            result
          );
        }
        function replaceHolders(array, placeholder) {
          for (
            var index = -1, length = array.length, resIndex = 0, result = [];
            ++index < length;

          ) {
            var value = array[index];
            (value === placeholder || value === PLACEHOLDER) &&
              ((array[index] = PLACEHOLDER), (result[resIndex++] = index));
          }
          return result;
        }
        function setToArray(set) {
          var index = -1,
            result = Array(set.size);
          return (
            set.forEach(function(value) {
              result[++index] = value;
            }),
            result
          );
        }
        function setToPairs(set) {
          var index = -1,
            result = Array(set.size);
          return (
            set.forEach(function(value) {
              result[++index] = [value, value];
            }),
            result
          );
        }
        function stringSize(string) {
          if (!string || !reHasComplexSymbol.test(string)) return string.length;
          for (
            var result = (reComplexSymbol.lastIndex = 0);
            reComplexSymbol.test(string);

          )
            result++;
          return result;
        }
        function stringToArray(string) {
          return string.match(reComplexSymbol);
        }
        function unescapeHtmlChar(chr) {
          return htmlUnescapes[chr];
        }
        function runInContext(context) {
          function lodash(value) {
            if (
              isObjectLike(value) &&
              !isArray(value) &&
              !(value instanceof LazyWrapper)
            ) {
              if (value instanceof LodashWrapper) return value;
              if (hasOwnProperty.call(value, "__wrapped__"))
                return wrapperClone(value);
            }
            return new LodashWrapper(value);
          }
          function baseLodash() {}
          function LodashWrapper(value, chainAll) {
            (this.__wrapped__ = value),
              (this.__actions__ = []),
              (this.__chain__ = !!chainAll),
              (this.__index__ = 0),
              (this.__values__ = undefined);
          }
          function LazyWrapper(value) {
            (this.__wrapped__ = value),
              (this.__actions__ = []),
              (this.__dir__ = 1),
              (this.__filtered__ = !1),
              (this.__iteratees__ = []),
              (this.__takeCount__ = MAX_ARRAY_LENGTH),
              (this.__views__ = []);
          }
          function lazyClone() {
            var result = new LazyWrapper(this.__wrapped__);
            return (
              (result.__actions__ = copyArray(this.__actions__)),
              (result.__dir__ = this.__dir__),
              (result.__filtered__ = this.__filtered__),
              (result.__iteratees__ = copyArray(this.__iteratees__)),
              (result.__takeCount__ = this.__takeCount__),
              (result.__views__ = copyArray(this.__views__)),
              result
            );
          }
          function lazyReverse() {
            if (this.__filtered__) {
              var result = new LazyWrapper(this);
              (result.__dir__ = -1), (result.__filtered__ = !0);
            } else (result = this.clone()), (result.__dir__ *= -1);
            return result;
          }
          function lazyValue() {
            var array = this.__wrapped__.value(),
              dir = this.__dir__,
              isArr = isArray(array),
              isRight = 0 > dir,
              arrLength = isArr ? array.length : 0,
              view = getView(0, arrLength, this.__views__),
              start = view.start,
              end = view.end,
              length = end - start,
              index = isRight ? end : start - 1,
              iteratees = this.__iteratees__,
              iterLength = iteratees.length,
              resIndex = 0,
              takeCount = nativeMin(length, this.__takeCount__);
            if (
              !isArr ||
              LARGE_ARRAY_SIZE > arrLength ||
              (arrLength == length && takeCount == length)
            )
              return baseWrapperValue(array, this.__actions__);
            var result = [];
            outer: for (; length-- && takeCount > resIndex; ) {
              index += dir;
              for (
                var iterIndex = -1, value = array[index];
                ++iterIndex < iterLength;

              ) {
                var data = iteratees[iterIndex],
                  iteratee = data.iteratee,
                  type = data.type,
                  computed = iteratee(value);
                if (type == LAZY_MAP_FLAG) value = computed;
                else if (!computed) {
                  if (type == LAZY_FILTER_FLAG) continue outer;
                  break outer;
                }
              }
              result[resIndex++] = value;
            }
            return result;
          }
          function Hash(entries) {
            var index = -1,
              length = entries ? entries.length : 0;
            for (this.clear(); ++index < length; ) {
              var entry = entries[index];
              this.set(entry[0], entry[1]);
            }
          }
          function hashClear() {
            this.__data__ = nativeCreate ? nativeCreate(null) : {};
          }
          function hashDelete(key) {
            return this.has(key) && delete this.__data__[key];
          }
          function hashGet(key) {
            var data = this.__data__;
            if (nativeCreate) {
              var result = data[key];
              return result === HASH_UNDEFINED ? undefined : result;
            }
            return hasOwnProperty.call(data, key) ? data[key] : undefined;
          }
          function hashHas(key) {
            var data = this.__data__;
            return nativeCreate
              ? data[key] !== undefined
              : hasOwnProperty.call(data, key);
          }
          function hashSet(key, value) {
            var data = this.__data__;
            return (
              (data[key] =
                nativeCreate && value === undefined ? HASH_UNDEFINED : value),
              this
            );
          }
          function ListCache(entries) {
            var index = -1,
              length = entries ? entries.length : 0;
            for (this.clear(); ++index < length; ) {
              var entry = entries[index];
              this.set(entry[0], entry[1]);
            }
          }
          function listCacheClear() {
            this.__data__ = [];
          }
          function listCacheDelete(key) {
            var data = this.__data__,
              index = assocIndexOf(data, key);
            if (0 > index) return !1;
            var lastIndex = data.length - 1;
            return (
              index == lastIndex ? data.pop() : splice.call(data, index, 1), !0
            );
          }
          function listCacheGet(key) {
            var data = this.__data__,
              index = assocIndexOf(data, key);
            return 0 > index ? undefined : data[index][1];
          }
          function listCacheHas(key) {
            return assocIndexOf(this.__data__, key) > -1;
          }
          function listCacheSet(key, value) {
            var data = this.__data__,
              index = assocIndexOf(data, key);
            return (
              0 > index ? data.push([key, value]) : (data[index][1] = value),
              this
            );
          }
          function MapCache(entries) {
            var index = -1,
              length = entries ? entries.length : 0;
            for (this.clear(); ++index < length; ) {
              var entry = entries[index];
              this.set(entry[0], entry[1]);
            }
          }
          function mapCacheClear() {
            this.__data__ = {
              hash: new Hash(),
              map: new (Map || ListCache)(),
              string: new Hash()
            };
          }
          function mapCacheDelete(key) {
            return getMapData(this, key)["delete"](key);
          }
          function mapCacheGet(key) {
            return getMapData(this, key).get(key);
          }
          function mapCacheHas(key) {
            return getMapData(this, key).has(key);
          }
          function mapCacheSet(key, value) {
            return getMapData(this, key).set(key, value), this;
          }
          function SetCache(values) {
            var index = -1,
              length = values ? values.length : 0;
            for (this.__data__ = new MapCache(); ++index < length; )
              this.add(values[index]);
          }
          function setCacheAdd(value) {
            return this.__data__.set(value, HASH_UNDEFINED), this;
          }
          function setCacheHas(value) {
            return this.__data__.has(value);
          }
          function Stack(entries) {
            this.__data__ = new ListCache(entries);
          }
          function stackClear() {
            this.__data__ = new ListCache();
          }
          function stackDelete(key) {
            return this.__data__["delete"](key);
          }
          function stackGet(key) {
            return this.__data__.get(key);
          }
          function stackHas(key) {
            return this.__data__.has(key);
          }
          function stackSet(key, value) {
            var cache = this.__data__;
            return (
              cache instanceof ListCache &&
                cache.__data__.length == LARGE_ARRAY_SIZE &&
                (cache = this.__data__ = new MapCache(cache.__data__)),
              cache.set(key, value),
              this
            );
          }
          function assignInDefaults(objValue, srcValue, key, object) {
            return objValue === undefined ||
              (eq(objValue, objectProto[key]) &&
                !hasOwnProperty.call(object, key))
              ? srcValue
              : objValue;
          }
          function assignMergeValue(object, key, value) {
            ((value !== undefined && !eq(object[key], value)) ||
              ("number" == typeof key &&
                value === undefined &&
                !(key in object))) &&
              (object[key] = value);
          }
          function assignValue(object, key, value) {
            var objValue = object[key];
            (hasOwnProperty.call(object, key) &&
              eq(objValue, value) &&
              (value !== undefined || key in object)) ||
              (object[key] = value);
          }
          function assocIndexOf(array, key) {
            for (var length = array.length; length--; )
              if (eq(array[length][0], key)) return length;
            return -1;
          }
          function baseAggregator(collection, setter, iteratee, accumulator) {
            return (
              baseEach(collection, function(value, key, collection) {
                setter(accumulator, value, iteratee(value), collection);
              }),
              accumulator
            );
          }
          function baseAssign(object, source) {
            return object && copyObject(source, keys(source), object);
          }
          function baseAt(object, paths) {
            for (
              var index = -1,
                isNil = null == object,
                length = paths.length,
                result = Array(length);
              ++index < length;

            )
              result[index] = isNil ? undefined : get(object, paths[index]);
            return result;
          }
          function baseClamp(number, lower, upper) {
            return (
              number === number &&
                (upper !== undefined &&
                  (number = upper >= number ? number : upper),
                lower !== undefined &&
                  (number = number >= lower ? number : lower)),
              number
            );
          }
          function baseClone(
            value,
            isDeep,
            isFull,
            customizer,
            key,
            object,
            stack
          ) {
            var result;
            if (
              (customizer &&
                (result = object
                  ? customizer(value, key, object, stack)
                  : customizer(value)),
              result !== undefined)
            )
              return result;
            if (!isObject(value)) return value;
            var isArr = isArray(value);
            if (isArr) {
              if (((result = initCloneArray(value)), !isDeep))
                return copyArray(value, result);
            } else {
              var tag = getTag(value),
                isFunc = tag == funcTag || tag == genTag;
              if (isBuffer(value)) return cloneBuffer(value, isDeep);
              if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
                if (isHostObject(value)) return object ? value : {};
                if (((result = initCloneObject(isFunc ? {} : value)), !isDeep))
                  return copySymbols(value, baseAssign(result, value));
              } else {
                if (!cloneableTags[tag]) return object ? value : {};
                result = initCloneByTag(value, tag, baseClone, isDeep);
              }
            }
            stack || (stack = new Stack());
            var stacked = stack.get(value);
            if (stacked) return stacked;
            if ((stack.set(value, result), !isArr))
              var props = isFull ? getAllKeys(value) : keys(value);
            return (
              arrayEach(props || value, function(subValue, key) {
                props && ((key = subValue), (subValue = value[key])),
                  assignValue(
                    result,
                    key,
                    baseClone(
                      subValue,
                      isDeep,
                      isFull,
                      customizer,
                      key,
                      value,
                      stack
                    )
                  );
              }),
              result
            );
          }
          function baseConforms(source) {
            var props = keys(source),
              length = props.length;
            return function(object) {
              if (null == object) return !length;
              for (var index = length; index--; ) {
                var key = props[index],
                  predicate = source[key],
                  value = object[key];
                if (
                  (value === undefined && !(key in Object(object))) ||
                  !predicate(value)
                )
                  return !1;
              }
              return !0;
            };
          }
          function baseCreate(proto) {
            return isObject(proto) ? objectCreate(proto) : {};
          }
          function baseDelay(func, wait, args) {
            if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
            return setTimeout(function() {
              func.apply(undefined, args);
            }, wait);
          }
          function baseDifference(array, values, iteratee, comparator) {
            var index = -1,
              includes = arrayIncludes,
              isCommon = !0,
              length = array.length,
              result = [],
              valuesLength = values.length;
            if (!length) return result;
            iteratee && (values = arrayMap(values, baseUnary(iteratee))),
              comparator
                ? ((includes = arrayIncludesWith), (isCommon = !1))
                : values.length >= LARGE_ARRAY_SIZE &&
                  ((includes = cacheHas),
                  (isCommon = !1),
                  (values = new SetCache(values)));
            outer: for (; ++index < length; ) {
              var value = array[index],
                computed = iteratee ? iteratee(value) : value;
              if (
                ((value = comparator || 0 !== value ? value : 0),
                isCommon && computed === computed)
              ) {
                for (var valuesIndex = valuesLength; valuesIndex--; )
                  if (values[valuesIndex] === computed) continue outer;
                result.push(value);
              } else
                includes(values, computed, comparator) || result.push(value);
            }
            return result;
          }
          function baseEvery(collection, predicate) {
            var result = !0;
            return (
              baseEach(collection, function(value, index, collection) {
                return (result = !!predicate(value, index, collection));
              }),
              result
            );
          }
          function baseExtremum(array, iteratee, comparator) {
            for (var index = -1, length = array.length; ++index < length; ) {
              var value = array[index],
                current = iteratee(value);
              if (
                null != current &&
                (computed === undefined
                  ? current === current && !isSymbol(current)
                  : comparator(current, computed))
              )
                var computed = current,
                  result = value;
            }
            return result;
          }
          function baseFill(array, value, start, end) {
            var length = array.length;
            for (
              start = toInteger(start),
                0 > start && (start = -start > length ? 0 : length + start),
                end =
                  end === undefined || end > length ? length : toInteger(end),
                0 > end && (end += length),
                end = start > end ? 0 : toLength(end);
              end > start;

            )
              array[start++] = value;
            return array;
          }
          function baseFilter(collection, predicate) {
            var result = [];
            return (
              baseEach(collection, function(value, index, collection) {
                predicate(value, index, collection) && result.push(value);
              }),
              result
            );
          }
          function baseFlatten(array, depth, predicate, isStrict, result) {
            var index = -1,
              length = array.length;
            for (
              predicate || (predicate = isFlattenable), result || (result = []);
              ++index < length;

            ) {
              var value = array[index];
              depth > 0 && predicate(value)
                ? depth > 1
                  ? baseFlatten(value, depth - 1, predicate, isStrict, result)
                  : arrayPush(result, value)
                : isStrict || (result[result.length] = value);
            }
            return result;
          }
          function baseForOwn(object, iteratee) {
            return object && baseFor(object, iteratee, keys);
          }
          function baseForOwnRight(object, iteratee) {
            return object && baseForRight(object, iteratee, keys);
          }
          function baseFunctions(object, props) {
            return arrayFilter(props, function(key) {
              return isFunction(object[key]);
            });
          }
          function baseGet(object, path) {
            path = isKey(path, object) ? [path] : castPath(path);
            for (
              var index = 0, length = path.length;
              null != object && length > index;

            )
              object = object[toKey(path[index++])];
            return index && index == length ? object : undefined;
          }
          function baseGetAllKeys(object, keysFunc, symbolsFunc) {
            var result = keysFunc(object);
            return isArray(object)
              ? result
              : arrayPush(result, symbolsFunc(object));
          }
          function baseGt(value, other) {
            return value > other;
          }
          function baseHas(object, key) {
            return (
              null != object &&
              (hasOwnProperty.call(object, key) ||
                ("object" == typeof object &&
                  key in object &&
                  null === getPrototype(object)))
            );
          }
          function baseHasIn(object, key) {
            return null != object && key in Object(object);
          }
          function baseInRange(number, start, end) {
            return (
              number >= nativeMin(start, end) && number < nativeMax(start, end)
            );
          }
          function baseIntersection(arrays, iteratee, comparator) {
            for (
              var includes = comparator ? arrayIncludesWith : arrayIncludes,
                length = arrays[0].length,
                othLength = arrays.length,
                othIndex = othLength,
                caches = Array(othLength),
                maxLength = 1 / 0,
                result = [];
              othIndex--;

            ) {
              var array = arrays[othIndex];
              othIndex &&
                iteratee &&
                (array = arrayMap(array, baseUnary(iteratee))),
                (maxLength = nativeMin(array.length, maxLength)),
                (caches[othIndex] =
                  !comparator &&
                  (iteratee || (length >= 120 && array.length >= 120))
                    ? new SetCache(othIndex && array)
                    : undefined);
            }
            array = arrays[0];
            var index = -1,
              seen = caches[0];
            outer: for (; ++index < length && result.length < maxLength; ) {
              var value = array[index],
                computed = iteratee ? iteratee(value) : value;
              if (
                ((value = comparator || 0 !== value ? value : 0),
                !(seen
                  ? cacheHas(seen, computed)
                  : includes(result, computed, comparator)))
              ) {
                for (othIndex = othLength; --othIndex; ) {
                  var cache = caches[othIndex];
                  if (
                    !(cache
                      ? cacheHas(cache, computed)
                      : includes(arrays[othIndex], computed, comparator))
                  )
                    continue outer;
                }
                seen && seen.push(computed), result.push(value);
              }
            }
            return result;
          }
          function baseInverter(object, setter, iteratee, accumulator) {
            return (
              baseForOwn(object, function(value, key, object) {
                setter(accumulator, iteratee(value), key, object);
              }),
              accumulator
            );
          }
          function baseInvoke(object, path, args) {
            isKey(path, object) ||
              ((path = castPath(path)),
              (object = parent(object, path)),
              (path = last(path)));
            var func = null == object ? object : object[toKey(path)];
            return null == func ? undefined : apply(func, object, args);
          }
          function baseIsEqual(value, other, customizer, bitmask, stack) {
            return value === other
              ? !0
              : null == value ||
                null == other ||
                (!isObject(value) && !isObjectLike(other))
              ? value !== value && other !== other
              : baseIsEqualDeep(
                  value,
                  other,
                  baseIsEqual,
                  customizer,
                  bitmask,
                  stack
                );
          }
          function baseIsEqualDeep(
            object,
            other,
            equalFunc,
            customizer,
            bitmask,
            stack
          ) {
            var objIsArr = isArray(object),
              othIsArr = isArray(other),
              objTag = arrayTag,
              othTag = arrayTag;
            objIsArr ||
              ((objTag = getTag(object)),
              (objTag = objTag == argsTag ? objectTag : objTag)),
              othIsArr ||
                ((othTag = getTag(other)),
                (othTag = othTag == argsTag ? objectTag : othTag));
            var objIsObj = objTag == objectTag && !isHostObject(object),
              othIsObj = othTag == objectTag && !isHostObject(other),
              isSameTag = objTag == othTag;
            if (isSameTag && !objIsObj)
              return (
                stack || (stack = new Stack()),
                objIsArr || isTypedArray(object)
                  ? equalArrays(
                      object,
                      other,
                      equalFunc,
                      customizer,
                      bitmask,
                      stack
                    )
                  : equalByTag(
                      object,
                      other,
                      objTag,
                      equalFunc,
                      customizer,
                      bitmask,
                      stack
                    )
              );
            if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
              var objIsWrapped =
                  objIsObj && hasOwnProperty.call(object, "__wrapped__"),
                othIsWrapped =
                  othIsObj && hasOwnProperty.call(other, "__wrapped__");
              if (objIsWrapped || othIsWrapped) {
                var objUnwrapped = objIsWrapped ? object.value() : object,
                  othUnwrapped = othIsWrapped ? other.value() : other;
                return (
                  stack || (stack = new Stack()),
                  equalFunc(
                    objUnwrapped,
                    othUnwrapped,
                    customizer,
                    bitmask,
                    stack
                  )
                );
              }
            }
            return isSameTag
              ? (stack || (stack = new Stack()),
                equalObjects(
                  object,
                  other,
                  equalFunc,
                  customizer,
                  bitmask,
                  stack
                ))
              : !1;
          }
          function baseIsMatch(object, source, matchData, customizer) {
            var index = matchData.length,
              length = index,
              noCustomizer = !customizer;
            if (null == object) return !length;
            for (object = Object(object); index--; ) {
              var data = matchData[index];
              if (
                noCustomizer && data[2]
                  ? data[1] !== object[data[0]]
                  : !(data[0] in object)
              )
                return !1;
            }
            for (; ++index < length; ) {
              data = matchData[index];
              var key = data[0],
                objValue = object[key],
                srcValue = data[1];
              if (noCustomizer && data[2]) {
                if (objValue === undefined && !(key in object)) return !1;
              } else {
                var stack = new Stack();
                if (customizer)
                  var result = customizer(
                    objValue,
                    srcValue,
                    key,
                    object,
                    source,
                    stack
                  );
                if (
                  !(result === undefined
                    ? baseIsEqual(
                        srcValue,
                        objValue,
                        customizer,
                        UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG,
                        stack
                      )
                    : result)
                )
                  return !1;
              }
            }
            return !0;
          }
          function baseIsNative(value) {
            if (!isObject(value) || isMasked(value)) return !1;
            var pattern =
              isFunction(value) || isHostObject(value)
                ? reIsNative
                : reIsHostCtor;
            return pattern.test(toSource(value));
          }
          function baseIteratee(value) {
            return "function" == typeof value
              ? value
              : null == value
              ? identity
              : "object" == typeof value
              ? isArray(value)
                ? baseMatchesProperty(value[0], value[1])
                : baseMatches(value)
              : property(value);
          }
          function baseKeys(object) {
            return nativeKeys(Object(object));
          }
          function baseKeysIn(object) {
            object = null == object ? object : Object(object);
            var result = [];
            for (var key in object) result.push(key);
            return result;
          }
          function baseLt(value, other) {
            return other > value;
          }
          function baseMap(collection, iteratee) {
            var index = -1,
              result = isArrayLike(collection) ? Array(collection.length) : [];
            return (
              baseEach(collection, function(value, key, collection) {
                result[++index] = iteratee(value, key, collection);
              }),
              result
            );
          }
          function baseMatches(source) {
            var matchData = getMatchData(source);
            return 1 == matchData.length && matchData[0][2]
              ? matchesStrictComparable(matchData[0][0], matchData[0][1])
              : function(object) {
                  return (
                    object === source || baseIsMatch(object, source, matchData)
                  );
                };
          }
          function baseMatchesProperty(path, srcValue) {
            return isKey(path) && isStrictComparable(srcValue)
              ? matchesStrictComparable(toKey(path), srcValue)
              : function(object) {
                  var objValue = get(object, path);
                  return objValue === undefined && objValue === srcValue
                    ? hasIn(object, path)
                    : baseIsEqual(
                        srcValue,
                        objValue,
                        undefined,
                        UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG
                      );
                };
          }
          function baseMerge(object, source, srcIndex, customizer, stack) {
            if (object !== source) {
              if (!isArray(source) && !isTypedArray(source))
                var props = keysIn(source);
              arrayEach(props || source, function(srcValue, key) {
                if (
                  (props && ((key = srcValue), (srcValue = source[key])),
                  isObject(srcValue))
                )
                  stack || (stack = new Stack()),
                    baseMergeDeep(
                      object,
                      source,
                      key,
                      srcIndex,
                      baseMerge,
                      customizer,
                      stack
                    );
                else {
                  var newValue = customizer
                    ? customizer(
                        object[key],
                        srcValue,
                        key + "",
                        object,
                        source,
                        stack
                      )
                    : undefined;
                  newValue === undefined && (newValue = srcValue),
                    assignMergeValue(object, key, newValue);
                }
              });
            }
          }
          function baseMergeDeep(
            object,
            source,
            key,
            srcIndex,
            mergeFunc,
            customizer,
            stack
          ) {
            var objValue = object[key],
              srcValue = source[key],
              stacked = stack.get(srcValue);
            if (stacked) return assignMergeValue(object, key, stacked), void 0;
            var newValue = customizer
                ? customizer(
                    objValue,
                    srcValue,
                    key + "",
                    object,
                    source,
                    stack
                  )
                : undefined,
              isCommon = newValue === undefined;
            isCommon &&
              ((newValue = srcValue),
              isArray(srcValue) || isTypedArray(srcValue)
                ? isArray(objValue)
                  ? (newValue = objValue)
                  : isArrayLikeObject(objValue)
                  ? (newValue = copyArray(objValue))
                  : ((isCommon = !1), (newValue = baseClone(srcValue, !0)))
                : isPlainObject(srcValue) || isArguments(srcValue)
                ? isArguments(objValue)
                  ? (newValue = toPlainObject(objValue))
                  : !isObject(objValue) || (srcIndex && isFunction(objValue))
                  ? ((isCommon = !1), (newValue = baseClone(srcValue, !0)))
                  : (newValue = objValue)
                : (isCommon = !1)),
              stack.set(srcValue, newValue),
              isCommon &&
                mergeFunc(newValue, srcValue, srcIndex, customizer, stack),
              stack["delete"](srcValue),
              assignMergeValue(object, key, newValue);
          }
          function baseNth(array, n) {
            var length = array.length;
            if (length)
              return (
                (n += 0 > n ? length : 0),
                isIndex(n, length) ? array[n] : undefined
              );
          }
          function baseOrderBy(collection, iteratees, orders) {
            var index = -1;
            iteratees = arrayMap(
              iteratees.length ? iteratees : [identity],
              baseUnary(getIteratee())
            );
            var result = baseMap(collection, function(value) {
              var criteria = arrayMap(iteratees, function(iteratee) {
                return iteratee(value);
              });
              return { criteria: criteria, index: ++index, value: value };
            });
            return baseSortBy(result, function(object, other) {
              return compareMultiple(object, other, orders);
            });
          }
          function basePick(object, props) {
            return (
              (object = Object(object)),
              arrayReduce(
                props,
                function(result, key) {
                  return key in object && (result[key] = object[key]), result;
                },
                {}
              )
            );
          }
          function basePickBy(object, predicate) {
            for (
              var index = -1,
                props = getAllKeysIn(object),
                length = props.length,
                result = {};
              ++index < length;

            ) {
              var key = props[index],
                value = object[key];
              predicate(value, key) && (result[key] = value);
            }
            return result;
          }
          function baseProperty(key) {
            return function(object) {
              return null == object ? undefined : object[key];
            };
          }
          function basePropertyDeep(path) {
            return function(object) {
              return baseGet(object, path);
            };
          }
          function basePullAll(array, values, iteratee, comparator) {
            var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
              index = -1,
              length = values.length,
              seen = array;
            for (
              array === values && (values = copyArray(values)),
                iteratee && (seen = arrayMap(array, baseUnary(iteratee)));
              ++index < length;

            )
              for (
                var fromIndex = 0,
                  value = values[index],
                  computed = iteratee ? iteratee(value) : value;
                (fromIndex = indexOf(seen, computed, fromIndex, comparator)) >
                -1;

              )
                seen !== array && splice.call(seen, fromIndex, 1),
                  splice.call(array, fromIndex, 1);
            return array;
          }
          function basePullAt(array, indexes) {
            for (
              var length = array ? indexes.length : 0, lastIndex = length - 1;
              length--;

            ) {
              var index = indexes[length];
              if (length == lastIndex || index !== previous) {
                var previous = index;
                if (isIndex(index)) splice.call(array, index, 1);
                else if (isKey(index, array)) delete array[toKey(index)];
                else {
                  var path = castPath(index),
                    object = parent(array, path);
                  null != object && delete object[toKey(last(path))];
                }
              }
            }
            return array;
          }
          function baseRandom(lower, upper) {
            return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
          }
          function baseRange(start, end, step, fromRight) {
            for (
              var index = -1,
                length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
                result = Array(length);
              length--;

            )
              (result[fromRight ? length : ++index] = start), (start += step);
            return result;
          }
          function baseRepeat(string, n) {
            var result = "";
            if (!string || 1 > n || n > MAX_SAFE_INTEGER) return result;
            do
              n % 2 && (result += string),
                (n = nativeFloor(n / 2)),
                n && (string += string);
            while (n);
            return result;
          }
          function baseSet(object, path, value, customizer) {
            path = isKey(path, object) ? [path] : castPath(path);
            for (
              var index = -1,
                length = path.length,
                lastIndex = length - 1,
                nested = object;
              null != nested && ++index < length;

            ) {
              var key = toKey(path[index]);
              if (isObject(nested)) {
                var newValue = value;
                if (index != lastIndex) {
                  var objValue = nested[key];
                  (newValue = customizer
                    ? customizer(objValue, key, nested)
                    : undefined),
                    newValue === undefined &&
                      (newValue =
                        null == objValue
                          ? isIndex(path[index + 1])
                            ? []
                            : {}
                          : objValue);
                }
                assignValue(nested, key, newValue);
              }
              nested = nested[key];
            }
            return object;
          }
          function baseSlice(array, start, end) {
            var index = -1,
              length = array.length;
            0 > start && (start = -start > length ? 0 : length + start),
              (end = end > length ? length : end),
              0 > end && (end += length),
              (length = start > end ? 0 : (end - start) >>> 0),
              (start >>>= 0);
            for (var result = Array(length); ++index < length; )
              result[index] = array[index + start];
            return result;
          }
          function baseSome(collection, predicate) {
            var result;
            return (
              baseEach(collection, function(value, index, collection) {
                return (result = predicate(value, index, collection)), !result;
              }),
              !!result
            );
          }
          function baseSortedIndex(array, value, retHighest) {
            var low = 0,
              high = array ? array.length : low;
            if (
              "number" == typeof value &&
              value === value &&
              HALF_MAX_ARRAY_LENGTH >= high
            ) {
              for (; high > low; ) {
                var mid = (low + high) >>> 1,
                  computed = array[mid];
                null !== computed &&
                !isSymbol(computed) &&
                (retHighest ? value >= computed : value > computed)
                  ? (low = mid + 1)
                  : (high = mid);
              }
              return high;
            }
            return baseSortedIndexBy(array, value, identity, retHighest);
          }
          function baseSortedIndexBy(array, value, iteratee, retHighest) {
            value = iteratee(value);
            for (
              var low = 0,
                high = array ? array.length : 0,
                valIsNaN = value !== value,
                valIsNull = null === value,
                valIsSymbol = isSymbol(value),
                valIsUndefined = value === undefined;
              high > low;

            ) {
              var mid = nativeFloor((low + high) / 2),
                computed = iteratee(array[mid]),
                othIsDefined = computed !== undefined,
                othIsNull = null === computed,
                othIsReflexive = computed === computed,
                othIsSymbol = isSymbol(computed);
              if (valIsNaN) var setLow = retHighest || othIsReflexive;
              else
                setLow = valIsUndefined
                  ? othIsReflexive && (retHighest || othIsDefined)
                  : valIsNull
                  ? othIsReflexive && othIsDefined && (retHighest || !othIsNull)
                  : valIsSymbol
                  ? othIsReflexive &&
                    othIsDefined &&
                    !othIsNull &&
                    (retHighest || !othIsSymbol)
                  : othIsNull || othIsSymbol
                  ? !1
                  : retHighest
                  ? value >= computed
                  : value > computed;
              setLow ? (low = mid + 1) : (high = mid);
            }
            return nativeMin(high, MAX_ARRAY_INDEX);
          }
          function baseSortedUniq(array, iteratee) {
            for (
              var index = -1, length = array.length, resIndex = 0, result = [];
              ++index < length;

            ) {
              var value = array[index],
                computed = iteratee ? iteratee(value) : value;
              if (!index || !eq(computed, seen)) {
                var seen = computed;
                result[resIndex++] = 0 === value ? 0 : value;
              }
            }
            return result;
          }
          function baseToNumber(value) {
            return "number" == typeof value
              ? value
              : isSymbol(value)
              ? NAN
              : +value;
          }
          function baseToString(value) {
            if ("string" == typeof value) return value;
            if (isSymbol(value))
              return symbolToString ? symbolToString.call(value) : "";
            var result = value + "";
            return "0" == result && 1 / value == -INFINITY ? "-0" : result;
          }
          function baseUniq(array, iteratee, comparator) {
            var index = -1,
              includes = arrayIncludes,
              length = array.length,
              isCommon = !0,
              result = [],
              seen = result;
            if (comparator) (isCommon = !1), (includes = arrayIncludesWith);
            else if (length >= LARGE_ARRAY_SIZE) {
              var set = iteratee ? null : createSet(array);
              if (set) return setToArray(set);
              (isCommon = !1), (includes = cacheHas), (seen = new SetCache());
            } else seen = iteratee ? [] : result;
            outer: for (; ++index < length; ) {
              var value = array[index],
                computed = iteratee ? iteratee(value) : value;
              if (
                ((value = comparator || 0 !== value ? value : 0),
                isCommon && computed === computed)
              ) {
                for (var seenIndex = seen.length; seenIndex--; )
                  if (seen[seenIndex] === computed) continue outer;
                iteratee && seen.push(computed), result.push(value);
              } else
                includes(seen, computed, comparator) ||
                  (seen !== result && seen.push(computed), result.push(value));
            }
            return result;
          }
          function baseUnset(object, path) {
            (path = isKey(path, object) ? [path] : castPath(path)),
              (object = parent(object, path));
            var key = toKey(last(path));
            return (
              !(null != object && baseHas(object, key)) || delete object[key]
            );
          }
          function baseUpdate(object, path, updater, customizer) {
            return baseSet(
              object,
              path,
              updater(baseGet(object, path)),
              customizer
            );
          }
          function baseWhile(array, predicate, isDrop, fromRight) {
            for (
              var length = array.length, index = fromRight ? length : -1;
              (fromRight ? index-- : ++index < length) &&
              predicate(array[index], index, array);

            );
            return isDrop
              ? baseSlice(
                  array,
                  fromRight ? 0 : index,
                  fromRight ? index + 1 : length
                )
              : baseSlice(
                  array,
                  fromRight ? index + 1 : 0,
                  fromRight ? length : index
                );
          }
          function baseWrapperValue(value, actions) {
            var result = value;
            return (
              result instanceof LazyWrapper && (result = result.value()),
              arrayReduce(
                actions,
                function(result, action) {
                  return action.func.apply(
                    action.thisArg,
                    arrayPush([result], action.args)
                  );
                },
                result
              )
            );
          }
          function baseXor(arrays, iteratee, comparator) {
            for (var index = -1, length = arrays.length; ++index < length; )
              var result = result
                ? arrayPush(
                    baseDifference(result, arrays[index], iteratee, comparator),
                    baseDifference(arrays[index], result, iteratee, comparator)
                  )
                : arrays[index];
            return result && result.length
              ? baseUniq(result, iteratee, comparator)
              : [];
          }
          function baseZipObject(props, values, assignFunc) {
            for (
              var index = -1,
                length = props.length,
                valsLength = values.length,
                result = {};
              ++index < length;

            ) {
              var value = valsLength > index ? values[index] : undefined;
              assignFunc(result, props[index], value);
            }
            return result;
          }
          function castArrayLikeObject(value) {
            return isArrayLikeObject(value) ? value : [];
          }
          function castFunction(value) {
            return "function" == typeof value ? value : identity;
          }
          function castPath(value) {
            return isArray(value) ? value : stringToPath(value);
          }
          function castSlice(array, start, end) {
            var length = array.length;
            return (
              (end = end === undefined ? length : end),
              !start && end >= length ? array : baseSlice(array, start, end)
            );
          }
          function cloneBuffer(buffer, isDeep) {
            if (isDeep) return buffer.slice();
            var result = new buffer.constructor(buffer.length);
            return buffer.copy(result), result;
          }
          function cloneArrayBuffer(arrayBuffer) {
            var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
            return (
              new Uint8Array(result).set(new Uint8Array(arrayBuffer)), result
            );
          }
          function cloneDataView(dataView, isDeep) {
            var buffer = isDeep
              ? cloneArrayBuffer(dataView.buffer)
              : dataView.buffer;
            return new dataView.constructor(
              buffer,
              dataView.byteOffset,
              dataView.byteLength
            );
          }
          function cloneMap(map, isDeep, cloneFunc) {
            var array = isDeep
              ? cloneFunc(mapToArray(map), !0)
              : mapToArray(map);
            return arrayReduce(array, addMapEntry, new map.constructor());
          }
          function cloneRegExp(regexp) {
            var result = new regexp.constructor(
              regexp.source,
              reFlags.exec(regexp)
            );
            return (result.lastIndex = regexp.lastIndex), result;
          }
          function cloneSet(set, isDeep, cloneFunc) {
            var array = isDeep
              ? cloneFunc(setToArray(set), !0)
              : setToArray(set);
            return arrayReduce(array, addSetEntry, new set.constructor());
          }
          function cloneSymbol(symbol) {
            return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
          }
          function cloneTypedArray(typedArray, isDeep) {
            var buffer = isDeep
              ? cloneArrayBuffer(typedArray.buffer)
              : typedArray.buffer;
            return new typedArray.constructor(
              buffer,
              typedArray.byteOffset,
              typedArray.length
            );
          }
          function compareAscending(value, other) {
            if (value !== other) {
              var valIsDefined = value !== undefined,
                valIsNull = null === value,
                valIsReflexive = value === value,
                valIsSymbol = isSymbol(value),
                othIsDefined = other !== undefined,
                othIsNull = null === other,
                othIsReflexive = other === other,
                othIsSymbol = isSymbol(other);
              if (
                (!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
                (valIsSymbol &&
                  othIsDefined &&
                  othIsReflexive &&
                  !othIsNull &&
                  !othIsSymbol) ||
                (valIsNull && othIsDefined && othIsReflexive) ||
                (!valIsDefined && othIsReflexive) ||
                !valIsReflexive
              )
                return 1;
              if (
                (!valIsNull && !valIsSymbol && !othIsSymbol && other > value) ||
                (othIsSymbol &&
                  valIsDefined &&
                  valIsReflexive &&
                  !valIsNull &&
                  !valIsSymbol) ||
                (othIsNull && valIsDefined && valIsReflexive) ||
                (!othIsDefined && valIsReflexive) ||
                !othIsReflexive
              )
                return -1;
            }
            return 0;
          }
          function compareMultiple(object, other, orders) {
            for (
              var index = -1,
                objCriteria = object.criteria,
                othCriteria = other.criteria,
                length = objCriteria.length,
                ordersLength = orders.length;
              ++index < length;

            ) {
              var result = compareAscending(
                objCriteria[index],
                othCriteria[index]
              );
              if (result) {
                if (index >= ordersLength) return result;
                var order = orders[index];
                return result * ("desc" == order ? -1 : 1);
              }
            }
            return object.index - other.index;
          }
          function composeArgs(args, partials, holders, isCurried) {
            for (
              var argsIndex = -1,
                argsLength = args.length,
                holdersLength = holders.length,
                leftIndex = -1,
                leftLength = partials.length,
                rangeLength = nativeMax(argsLength - holdersLength, 0),
                result = Array(leftLength + rangeLength),
                isUncurried = !isCurried;
              ++leftIndex < leftLength;

            )
              result[leftIndex] = partials[leftIndex];
            for (; ++argsIndex < holdersLength; )
              (isUncurried || argsLength > argsIndex) &&
                (result[holders[argsIndex]] = args[argsIndex]);
            for (; rangeLength--; ) result[leftIndex++] = args[argsIndex++];
            return result;
          }
          function composeArgsRight(args, partials, holders, isCurried) {
            for (
              var argsIndex = -1,
                argsLength = args.length,
                holdersIndex = -1,
                holdersLength = holders.length,
                rightIndex = -1,
                rightLength = partials.length,
                rangeLength = nativeMax(argsLength - holdersLength, 0),
                result = Array(rangeLength + rightLength),
                isUncurried = !isCurried;
              ++argsIndex < rangeLength;

            )
              result[argsIndex] = args[argsIndex];
            for (var offset = argsIndex; ++rightIndex < rightLength; )
              result[offset + rightIndex] = partials[rightIndex];
            for (; ++holdersIndex < holdersLength; )
              (isUncurried || argsLength > argsIndex) &&
                (result[offset + holders[holdersIndex]] = args[argsIndex++]);
            return result;
          }
          function copyArray(source, array) {
            var index = -1,
              length = source.length;
            for (array || (array = Array(length)); ++index < length; )
              array[index] = source[index];
            return array;
          }
          function copyObject(source, props, object, customizer) {
            object || (object = {});
            for (var index = -1, length = props.length; ++index < length; ) {
              var key = props[index],
                newValue = customizer
                  ? customizer(object[key], source[key], key, object, source)
                  : source[key];
              assignValue(object, key, newValue);
            }
            return object;
          }
          function copySymbols(source, object) {
            return copyObject(source, getSymbols(source), object);
          }
          function createAggregator(setter, initializer) {
            return function(collection, iteratee) {
              var func = isArray(collection) ? arrayAggregator : baseAggregator,
                accumulator = initializer ? initializer() : {};
              return func(
                collection,
                setter,
                getIteratee(iteratee),
                accumulator
              );
            };
          }
          function createAssigner(assigner) {
            return rest(function(object, sources) {
              var index = -1,
                length = sources.length,
                customizer = length > 1 ? sources[length - 1] : undefined,
                guard = length > 2 ? sources[2] : undefined;
              for (
                customizer =
                  assigner.length > 3 && "function" == typeof customizer
                    ? (length--, customizer)
                    : undefined,
                  guard &&
                    isIterateeCall(sources[0], sources[1], guard) &&
                    ((customizer = 3 > length ? undefined : customizer),
                    (length = 1)),
                  object = Object(object);
                ++index < length;

              ) {
                var source = sources[index];
                source && assigner(object, source, index, customizer);
              }
              return object;
            });
          }
          function createBaseEach(eachFunc, fromRight) {
            return function(collection, iteratee) {
              if (null == collection) return collection;
              if (!isArrayLike(collection))
                return eachFunc(collection, iteratee);
              for (
                var length = collection.length,
                  index = fromRight ? length : -1,
                  iterable = Object(collection);
                (fromRight ? index-- : ++index < length) &&
                iteratee(iterable[index], index, iterable) !== !1;

              );
              return collection;
            };
          }
          function createBaseFor(fromRight) {
            return function(object, iteratee, keysFunc) {
              for (
                var index = -1,
                  iterable = Object(object),
                  props = keysFunc(object),
                  length = props.length;
                length--;

              ) {
                var key = props[fromRight ? length : ++index];
                if (iteratee(iterable[key], key, iterable) === !1) break;
              }
              return object;
            };
          }
          function createBaseWrapper(func, bitmask, thisArg) {
            function wrapper() {
              var fn =
                this && this !== root && this instanceof wrapper ? Ctor : func;
              return fn.apply(isBind ? thisArg : this, arguments);
            }
            var isBind = bitmask & BIND_FLAG,
              Ctor = createCtorWrapper(func);
            return wrapper;
          }
          function createCaseFirst(methodName) {
            return function(string) {
              string = toString(string);
              var strSymbols = reHasComplexSymbol.test(string)
                  ? stringToArray(string)
                  : undefined,
                chr = strSymbols ? strSymbols[0] : string.charAt(0),
                trailing = strSymbols
                  ? castSlice(strSymbols, 1).join("")
                  : string.slice(1);
              return chr[methodName]() + trailing;
            };
          }
          function createCompounder(callback) {
            return function(string) {
              return arrayReduce(
                words(deburr(string).replace(reApos, "")),
                callback,
                ""
              );
            };
          }
          function createCtorWrapper(Ctor) {
            return function() {
              var args = arguments;
              switch (args.length) {
                case 0:
                  return new Ctor();
                case 1:
                  return new Ctor(args[0]);
                case 2:
                  return new Ctor(args[0], args[1]);
                case 3:
                  return new Ctor(args[0], args[1], args[2]);
                case 4:
                  return new Ctor(args[0], args[1], args[2], args[3]);
                case 5:
                  return new Ctor(args[0], args[1], args[2], args[3], args[4]);
                case 6:
                  return new Ctor(
                    args[0],
                    args[1],
                    args[2],
                    args[3],
                    args[4],
                    args[5]
                  );
                case 7:
                  return new Ctor(
                    args[0],
                    args[1],
                    args[2],
                    args[3],
                    args[4],
                    args[5],
                    args[6]
                  );
              }
              var thisBinding = baseCreate(Ctor.prototype),
                result = Ctor.apply(thisBinding, args);
              return isObject(result) ? result : thisBinding;
            };
          }
          function createCurryWrapper(func, bitmask, arity) {
            function wrapper() {
              for (
                var length = arguments.length,
                  args = Array(length),
                  index = length,
                  placeholder = getHolder(wrapper);
                index--;

              )
                args[index] = arguments[index];
              var holders =
                3 > length &&
                args[0] !== placeholder &&
                args[length - 1] !== placeholder
                  ? []
                  : replaceHolders(args, placeholder);
              if (((length -= holders.length), arity > length))
                return createRecurryWrapper(
                  func,
                  bitmask,
                  createHybridWrapper,
                  wrapper.placeholder,
                  undefined,
                  args,
                  holders,
                  undefined,
                  undefined,
                  arity - length
                );
              var fn =
                this && this !== root && this instanceof wrapper ? Ctor : func;
              return apply(fn, this, args);
            }
            var Ctor = createCtorWrapper(func);
            return wrapper;
          }
          function createFind(findIndexFunc) {
            return function(collection, predicate, fromIndex) {
              var iterable = Object(collection);
              if (
                ((predicate = getIteratee(predicate, 3)),
                !isArrayLike(collection))
              )
                var props = keys(collection);
              var index = findIndexFunc(
                props || collection,
                function(value, key) {
                  return (
                    props && ((key = value), (value = iterable[key])),
                    predicate(value, key, iterable)
                  );
                },
                fromIndex
              );
              return index > -1
                ? collection[props ? props[index] : index]
                : undefined;
            };
          }
          function createFlow(fromRight) {
            return rest(function(funcs) {
              funcs = baseFlatten(funcs, 1);
              var length = funcs.length,
                index = length,
                prereq = LodashWrapper.prototype.thru;
              for (fromRight && funcs.reverse(); index--; ) {
                var func = funcs[index];
                if ("function" != typeof func)
                  throw new TypeError(FUNC_ERROR_TEXT);
                if (prereq && !wrapper && "wrapper" == getFuncName(func))
                  var wrapper = new LodashWrapper([], !0);
              }
              for (index = wrapper ? index : length; ++index < length; ) {
                func = funcs[index];
                var funcName = getFuncName(func),
                  data = "wrapper" == funcName ? getData(func) : undefined;
                wrapper =
                  data &&
                  isLaziable(data[0]) &&
                  data[1] ==
                    (ARY_FLAG | CURRY_FLAG | PARTIAL_FLAG | REARG_FLAG) &&
                  !data[4].length &&
                  1 == data[9]
                    ? wrapper[getFuncName(data[0])].apply(wrapper, data[3])
                    : 1 == func.length && isLaziable(func)
                    ? wrapper[funcName]()
                    : wrapper.thru(func);
              }
              return function() {
                var args = arguments,
                  value = args[0];
                if (
                  wrapper &&
                  1 == args.length &&
                  isArray(value) &&
                  value.length >= LARGE_ARRAY_SIZE
                )
                  return wrapper.plant(value).value();
                for (
                  var index = 0,
                    result = length ? funcs[index].apply(this, args) : value;
                  ++index < length;

                )
                  result = funcs[index].call(this, result);
                return result;
              };
            });
          }
          function createHybridWrapper(
            func,
            bitmask,
            thisArg,
            partials,
            holders,
            partialsRight,
            holdersRight,
            argPos,
            ary,
            arity
          ) {
            function wrapper() {
              for (
                var length = arguments.length,
                  args = Array(length),
                  index = length;
                index--;

              )
                args[index] = arguments[index];
              if (isCurried)
                var placeholder = getHolder(wrapper),
                  holdersCount = countHolders(args, placeholder);
              if (
                (partials &&
                  (args = composeArgs(args, partials, holders, isCurried)),
                partialsRight &&
                  (args = composeArgsRight(
                    args,
                    partialsRight,
                    holdersRight,
                    isCurried
                  )),
                (length -= holdersCount),
                isCurried && arity > length)
              ) {
                var newHolders = replaceHolders(args, placeholder);
                return createRecurryWrapper(
                  func,
                  bitmask,
                  createHybridWrapper,
                  wrapper.placeholder,
                  thisArg,
                  args,
                  newHolders,
                  argPos,
                  ary,
                  arity - length
                );
              }
              var thisBinding = isBind ? thisArg : this,
                fn = isBindKey ? thisBinding[func] : func;
              return (
                (length = args.length),
                argPos
                  ? (args = reorder(args, argPos))
                  : isFlip && length > 1 && args.reverse(),
                isAry && length > ary && (args.length = ary),
                this &&
                  this !== root &&
                  this instanceof wrapper &&
                  (fn = Ctor || createCtorWrapper(fn)),
                fn.apply(thisBinding, args)
              );
            }
            var isAry = bitmask & ARY_FLAG,
              isBind = bitmask & BIND_FLAG,
              isBindKey = bitmask & BIND_KEY_FLAG,
              isCurried = bitmask & (CURRY_FLAG | CURRY_RIGHT_FLAG),
              isFlip = bitmask & FLIP_FLAG,
              Ctor = isBindKey ? undefined : createCtorWrapper(func);
            return wrapper;
          }
          function createInverter(setter, toIteratee) {
            return function(object, iteratee) {
              return baseInverter(object, setter, toIteratee(iteratee), {});
            };
          }
          function createMathOperation(operator) {
            return function(value, other) {
              var result;
              if (value === undefined && other === undefined) return 0;
              if (
                (value !== undefined && (result = value), other !== undefined)
              ) {
                if (result === undefined) return other;
                "string" == typeof value || "string" == typeof other
                  ? ((value = baseToString(value)),
                    (other = baseToString(other)))
                  : ((value = baseToNumber(value)),
                    (other = baseToNumber(other))),
                  (result = operator(value, other));
              }
              return result;
            };
          }
          function createOver(arrayFunc) {
            return rest(function(iteratees) {
              return (
                (iteratees =
                  1 == iteratees.length && isArray(iteratees[0])
                    ? arrayMap(iteratees[0], baseUnary(getIteratee()))
                    : arrayMap(
                        baseFlatten(iteratees, 1, isFlattenableIteratee),
                        baseUnary(getIteratee())
                      )),
                rest(function(args) {
                  var thisArg = this;
                  return arrayFunc(iteratees, function(iteratee) {
                    return apply(iteratee, thisArg, args);
                  });
                })
              );
            });
          }
          function createPadding(length, chars) {
            chars = chars === undefined ? " " : baseToString(chars);
            var charsLength = chars.length;
            if (2 > charsLength)
              return charsLength ? baseRepeat(chars, length) : chars;
            var result = baseRepeat(
              chars,
              nativeCeil(length / stringSize(chars))
            );
            return reHasComplexSymbol.test(chars)
              ? castSlice(stringToArray(result), 0, length).join("")
              : result.slice(0, length);
          }
          function createPartialWrapper(func, bitmask, thisArg, partials) {
            function wrapper() {
              for (
                var argsIndex = -1,
                  argsLength = arguments.length,
                  leftIndex = -1,
                  leftLength = partials.length,
                  args = Array(leftLength + argsLength),
                  fn =
                    this && this !== root && this instanceof wrapper
                      ? Ctor
                      : func;
                ++leftIndex < leftLength;

              )
                args[leftIndex] = partials[leftIndex];
              for (; argsLength--; ) args[leftIndex++] = arguments[++argsIndex];
              return apply(fn, isBind ? thisArg : this, args);
            }
            var isBind = bitmask & BIND_FLAG,
              Ctor = createCtorWrapper(func);
            return wrapper;
          }
          function createRange(fromRight) {
            return function(start, end, step) {
              return (
                step &&
                  "number" != typeof step &&
                  isIterateeCall(start, end, step) &&
                  (end = step = undefined),
                (start = toNumber(start)),
                (start = start === start ? start : 0),
                end === undefined
                  ? ((end = start), (start = 0))
                  : (end = toNumber(end) || 0),
                (step =
                  step === undefined
                    ? end > start
                      ? 1
                      : -1
                    : toNumber(step) || 0),
                baseRange(start, end, step, fromRight)
              );
            };
          }
          function createRelationalOperation(operator) {
            return function(value, other) {
              return (
                ("string" != typeof value || "string" != typeof other) &&
                  ((value = toNumber(value)), (other = toNumber(other))),
                operator(value, other)
              );
            };
          }
          function createRecurryWrapper(
            func,
            bitmask,
            wrapFunc,
            placeholder,
            thisArg,
            partials,
            holders,
            argPos,
            ary,
            arity
          ) {
            var isCurry = bitmask & CURRY_FLAG,
              newHolders = isCurry ? holders : undefined,
              newHoldersRight = isCurry ? undefined : holders,
              newPartials = isCurry ? partials : undefined,
              newPartialsRight = isCurry ? undefined : partials;
            (bitmask |= isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG),
              (bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG)),
              bitmask & CURRY_BOUND_FLAG ||
                (bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG));
            var newData = [
                func,
                bitmask,
                thisArg,
                newPartials,
                newHolders,
                newPartialsRight,
                newHoldersRight,
                argPos,
                ary,
                arity
              ],
              result = wrapFunc.apply(undefined, newData);
            return (
              isLaziable(func) && setData(result, newData),
              (result.placeholder = placeholder),
              result
            );
          }
          function createRound(methodName) {
            var func = Math[methodName];
            return function(number, precision) {
              if (
                ((number = toNumber(number)),
                (precision = nativeMin(toInteger(precision), 292)))
              ) {
                var pair = (toString(number) + "e").split("e"),
                  value = func(pair[0] + "e" + (+pair[1] + precision));
                return (
                  (pair = (toString(value) + "e").split("e")),
                  +(pair[0] + "e" + (+pair[1] - precision))
                );
              }
              return func(number);
            };
          }
          function createToPairs(keysFunc) {
            return function(object) {
              var tag = getTag(object);
              return tag == mapTag
                ? mapToArray(object)
                : tag == setTag
                ? setToPairs(object)
                : baseToPairs(object, keysFunc(object));
            };
          }
          function createWrapper(
            func,
            bitmask,
            thisArg,
            partials,
            holders,
            argPos,
            ary,
            arity
          ) {
            var isBindKey = bitmask & BIND_KEY_FLAG;
            if (!isBindKey && "function" != typeof func)
              throw new TypeError(FUNC_ERROR_TEXT);
            var length = partials ? partials.length : 0;
            if (
              (length ||
                ((bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG)),
                (partials = holders = undefined)),
              (ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0)),
              (arity = arity === undefined ? arity : toInteger(arity)),
              (length -= holders ? holders.length : 0),
              bitmask & PARTIAL_RIGHT_FLAG)
            ) {
              var partialsRight = partials,
                holdersRight = holders;
              partials = holders = undefined;
            }
            var data = isBindKey ? undefined : getData(func),
              newData = [
                func,
                bitmask,
                thisArg,
                partials,
                holders,
                partialsRight,
                holdersRight,
                argPos,
                ary,
                arity
              ];
            if (
              (data && mergeData(newData, data),
              (func = newData[0]),
              (bitmask = newData[1]),
              (thisArg = newData[2]),
              (partials = newData[3]),
              (holders = newData[4]),
              (arity = newData[9] =
                null == newData[9]
                  ? isBindKey
                    ? 0
                    : func.length
                  : nativeMax(newData[9] - length, 0)),
              !arity &&
                bitmask & (CURRY_FLAG | CURRY_RIGHT_FLAG) &&
                (bitmask &= ~(CURRY_FLAG | CURRY_RIGHT_FLAG)),
              bitmask && bitmask != BIND_FLAG)
            )
              result =
                bitmask == CURRY_FLAG || bitmask == CURRY_RIGHT_FLAG
                  ? createCurryWrapper(func, bitmask, arity)
                  : (bitmask != PARTIAL_FLAG &&
                      bitmask != (BIND_FLAG | PARTIAL_FLAG)) ||
                    holders.length
                  ? createHybridWrapper.apply(undefined, newData)
                  : createPartialWrapper(func, bitmask, thisArg, partials);
            else var result = createBaseWrapper(func, bitmask, thisArg);
            var setter = data ? baseSetData : setData;
            return setter(result, newData);
          }
          function equalArrays(
            array,
            other,
            equalFunc,
            customizer,
            bitmask,
            stack
          ) {
            var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
              arrLength = array.length,
              othLength = other.length;
            if (arrLength != othLength && !(isPartial && othLength > arrLength))
              return !1;
            var stacked = stack.get(array);
            if (stacked) return stacked == other;
            var index = -1,
              result = !0,
              seen =
                bitmask & UNORDERED_COMPARE_FLAG ? new SetCache() : undefined;
            for (stack.set(array, other); ++index < arrLength; ) {
              var arrValue = array[index],
                othValue = other[index];
              if (customizer)
                var compared = isPartial
                  ? customizer(othValue, arrValue, index, other, array, stack)
                  : customizer(arrValue, othValue, index, array, other, stack);
              if (compared !== undefined) {
                if (compared) continue;
                result = !1;
                break;
              }
              if (seen) {
                if (
                  !arraySome(other, function(othValue, othIndex) {
                    return seen.has(othIndex) ||
                      (arrValue !== othValue &&
                        !equalFunc(
                          arrValue,
                          othValue,
                          customizer,
                          bitmask,
                          stack
                        ))
                      ? void 0
                      : seen.add(othIndex);
                  })
                ) {
                  result = !1;
                  break;
                }
              } else if (
                arrValue !== othValue &&
                !equalFunc(arrValue, othValue, customizer, bitmask, stack)
              ) {
                result = !1;
                break;
              }
            }
            return stack["delete"](array), result;
          }
          function equalByTag(
            object,
            other,
            tag,
            equalFunc,
            customizer,
            bitmask,
            stack
          ) {
            switch (tag) {
              case dataViewTag:
                if (
                  object.byteLength != other.byteLength ||
                  object.byteOffset != other.byteOffset
                )
                  return !1;
                (object = object.buffer), (other = other.buffer);
              case arrayBufferTag:
                return object.byteLength == other.byteLength &&
                  equalFunc(new Uint8Array(object), new Uint8Array(other))
                  ? !0
                  : !1;
              case boolTag:
              case dateTag:
                return +object == +other;
              case errorTag:
                return (
                  object.name == other.name && object.message == other.message
                );
              case numberTag:
                return object != +object ? other != +other : object == +other;
              case regexpTag:
              case stringTag:
                return object == other + "";
              case mapTag:
                var convert = mapToArray;
              case setTag:
                var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
                if (
                  (convert || (convert = setToArray),
                  object.size != other.size && !isPartial)
                )
                  return !1;
                var stacked = stack.get(object);
                return stacked
                  ? stacked == other
                  : ((bitmask |= UNORDERED_COMPARE_FLAG),
                    stack.set(object, other),
                    equalArrays(
                      convert(object),
                      convert(other),
                      equalFunc,
                      customizer,
                      bitmask,
                      stack
                    ));
              case symbolTag:
                if (symbolValueOf)
                  return (
                    symbolValueOf.call(object) == symbolValueOf.call(other)
                  );
            }
            return !1;
          }
          function equalObjects(
            object,
            other,
            equalFunc,
            customizer,
            bitmask,
            stack
          ) {
            var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
              objProps = keys(object),
              objLength = objProps.length,
              othProps = keys(other),
              othLength = othProps.length;
            if (objLength != othLength && !isPartial) return !1;
            for (var index = objLength; index--; ) {
              var key = objProps[index];
              if (!(isPartial ? key in other : baseHas(other, key))) return !1;
            }
            var stacked = stack.get(object);
            if (stacked) return stacked == other;
            var result = !0;
            stack.set(object, other);
            for (var skipCtor = isPartial; ++index < objLength; ) {
              key = objProps[index];
              var objValue = object[key],
                othValue = other[key];
              if (customizer)
                var compared = isPartial
                  ? customizer(othValue, objValue, key, other, object, stack)
                  : customizer(objValue, othValue, key, object, other, stack);
              if (
                !(compared === undefined
                  ? objValue === othValue ||
                    equalFunc(objValue, othValue, customizer, bitmask, stack)
                  : compared)
              ) {
                result = !1;
                break;
              }
              skipCtor || (skipCtor = "constructor" == key);
            }
            if (result && !skipCtor) {
              var objCtor = object.constructor,
                othCtor = other.constructor;
              objCtor != othCtor &&
                "constructor" in object &&
                "constructor" in other &&
                !(
                  "function" == typeof objCtor &&
                  objCtor instanceof objCtor &&
                  "function" == typeof othCtor &&
                  othCtor instanceof othCtor
                ) &&
                (result = !1);
            }
            return stack["delete"](object), result;
          }
          function getAllKeys(object) {
            return baseGetAllKeys(object, keys, getSymbols);
          }
          function getAllKeysIn(object) {
            return baseGetAllKeys(object, keysIn, getSymbolsIn);
          }
          function getFuncName(func) {
            for (
              var result = func.name + "",
                array = realNames[result],
                length = hasOwnProperty.call(realNames, result)
                  ? array.length
                  : 0;
              length--;

            ) {
              var data = array[length],
                otherFunc = data.func;
              if (null == otherFunc || otherFunc == func) return data.name;
            }
            return result;
          }
          function getHolder(func) {
            var object = hasOwnProperty.call(lodash, "placeholder")
              ? lodash
              : func;
            return object.placeholder;
          }
          function getIteratee() {
            var result = lodash.iteratee || iteratee;
            return (
              (result = result === iteratee ? baseIteratee : result),
              arguments.length ? result(arguments[0], arguments[1]) : result
            );
          }
          function getMapData(map, key) {
            var data = map.__data__;
            return isKeyable(key)
              ? data["string" == typeof key ? "string" : "hash"]
              : data.map;
          }
          function getMatchData(object) {
            for (
              var result = keys(object), length = result.length;
              length--;

            ) {
              var key = result[length],
                value = object[key];
              result[length] = [key, value, isStrictComparable(value)];
            }
            return result;
          }
          function getNative(object, key) {
            var value = getValue(object, key);
            return baseIsNative(value) ? value : undefined;
          }
          function getPrototype(value) {
            return nativeGetPrototype(Object(value));
          }
          function getSymbols(object) {
            return getOwnPropertySymbols(Object(object));
          }
          function getTag(value) {
            return objectToString.call(value);
          }
          function getView(start, end, transforms) {
            for (
              var index = -1, length = transforms.length;
              ++index < length;

            ) {
              var data = transforms[index],
                size = data.size;
              switch (data.type) {
                case "drop":
                  start += size;
                  break;
                case "dropRight":
                  end -= size;
                  break;
                case "take":
                  end = nativeMin(end, start + size);
                  break;
                case "takeRight":
                  start = nativeMax(start, end - size);
              }
            }
            return { start: start, end: end };
          }
          function hasPath(object, path, hasFunc) {
            path = isKey(path, object) ? [path] : castPath(path);
            for (
              var result, index = -1, length = path.length;
              ++index < length;

            ) {
              var key = toKey(path[index]);
              if (!(result = null != object && hasFunc(object, key))) break;
              object = object[key];
            }
            if (result) return result;
            var length = object ? object.length : 0;
            return (
              !!length &&
              isLength(length) &&
              isIndex(key, length) &&
              (isArray(object) || isString(object) || isArguments(object))
            );
          }
          function initCloneArray(array) {
            var length = array.length,
              result = array.constructor(length);
            return (
              length &&
                "string" == typeof array[0] &&
                hasOwnProperty.call(array, "index") &&
                ((result.index = array.index), (result.input = array.input)),
              result
            );
          }
          function initCloneObject(object) {
            return "function" != typeof object.constructor ||
              isPrototype(object)
              ? {}
              : baseCreate(getPrototype(object));
          }
          function initCloneByTag(object, tag, cloneFunc, isDeep) {
            var Ctor = object.constructor;
            switch (tag) {
              case arrayBufferTag:
                return cloneArrayBuffer(object);
              case boolTag:
              case dateTag:
                return new Ctor(+object);
              case dataViewTag:
                return cloneDataView(object, isDeep);
              case float32Tag:
              case float64Tag:
              case int8Tag:
              case int16Tag:
              case int32Tag:
              case uint8Tag:
              case uint8ClampedTag:
              case uint16Tag:
              case uint32Tag:
                return cloneTypedArray(object, isDeep);
              case mapTag:
                return cloneMap(object, isDeep, cloneFunc);
              case numberTag:
              case stringTag:
                return new Ctor(object);
              case regexpTag:
                return cloneRegExp(object);
              case setTag:
                return cloneSet(object, isDeep, cloneFunc);
              case symbolTag:
                return cloneSymbol(object);
            }
          }
          function indexKeys(object) {
            var length = object ? object.length : undefined;
            return isLength(length) &&
              (isArray(object) || isString(object) || isArguments(object))
              ? baseTimes(length, String)
              : null;
          }
          function isFlattenable(value) {
            return isArray(value) || isArguments(value);
          }
          function isFlattenableIteratee(value) {
            return (
              isArray(value) && !(2 == value.length && !isFunction(value[0]))
            );
          }
          function isIndex(value, length) {
            return (
              (length = null == length ? MAX_SAFE_INTEGER : length),
              !!length &&
                ("number" == typeof value || reIsUint.test(value)) &&
                value > -1 &&
                0 == value % 1 &&
                length > value
            );
          }
          function isIterateeCall(value, index, object) {
            if (!isObject(object)) return !1;
            var type = typeof index;
            return ("number" == type
            ? isArrayLike(object) && isIndex(index, object.length)
            : "string" == type && index in object)
              ? eq(object[index], value)
              : !1;
          }
          function isKey(value, object) {
            if (isArray(value)) return !1;
            var type = typeof value;
            return "number" == type ||
              "symbol" == type ||
              "boolean" == type ||
              null == value ||
              isSymbol(value)
              ? !0
              : reIsPlainProp.test(value) ||
                  !reIsDeepProp.test(value) ||
                  (null != object && value in Object(object));
          }
          function isKeyable(value) {
            var type = typeof value;
            return "string" == type ||
              "number" == type ||
              "symbol" == type ||
              "boolean" == type
              ? "__proto__" !== value
              : null === value;
          }
          function isLaziable(func) {
            var funcName = getFuncName(func),
              other = lodash[funcName];
            if (
              "function" != typeof other ||
              !(funcName in LazyWrapper.prototype)
            )
              return !1;
            if (func === other) return !0;
            var data = getData(other);
            return !!data && func === data[0];
          }
          function isMasked(func) {
            return !!maskSrcKey && maskSrcKey in func;
          }
          function isPrototype(value) {
            var Ctor = value && value.constructor,
              proto =
                ("function" == typeof Ctor && Ctor.prototype) || objectProto;
            return value === proto;
          }
          function isStrictComparable(value) {
            return value === value && !isObject(value);
          }
          function matchesStrictComparable(key, srcValue) {
            return function(object) {
              return null == object
                ? !1
                : object[key] === srcValue &&
                    (srcValue !== undefined || key in Object(object));
            };
          }
          function mergeData(data, source) {
            var bitmask = data[1],
              srcBitmask = source[1],
              newBitmask = bitmask | srcBitmask,
              isCommon = (BIND_FLAG | BIND_KEY_FLAG | ARY_FLAG) > newBitmask,
              isCombo =
                (srcBitmask == ARY_FLAG && bitmask == CURRY_FLAG) ||
                (srcBitmask == ARY_FLAG &&
                  bitmask == REARG_FLAG &&
                  data[7].length <= source[8]) ||
                (srcBitmask == (ARY_FLAG | REARG_FLAG) &&
                  source[7].length <= source[8] &&
                  bitmask == CURRY_FLAG);
            if (!isCommon && !isCombo) return data;
            srcBitmask & BIND_FLAG &&
              ((data[2] = source[2]),
              (newBitmask |= bitmask & BIND_FLAG ? 0 : CURRY_BOUND_FLAG));
            var value = source[3];
            if (value) {
              var partials = data[3];
              (data[3] = partials
                ? composeArgs(partials, value, source[4])
                : value),
                (data[4] = partials
                  ? replaceHolders(data[3], PLACEHOLDER)
                  : source[4]);
            }
            return (
              (value = source[5]),
              value &&
                ((partials = data[5]),
                (data[5] = partials
                  ? composeArgsRight(partials, value, source[6])
                  : value),
                (data[6] = partials
                  ? replaceHolders(data[5], PLACEHOLDER)
                  : source[6])),
              (value = source[7]),
              value && (data[7] = value),
              srcBitmask & ARY_FLAG &&
                (data[8] =
                  null == data[8] ? source[8] : nativeMin(data[8], source[8])),
              null == data[9] && (data[9] = source[9]),
              (data[0] = source[0]),
              (data[1] = newBitmask),
              data
            );
          }
          function mergeDefaults(
            objValue,
            srcValue,
            key,
            object,
            source,
            stack
          ) {
            return (
              isObject(objValue) &&
                isObject(srcValue) &&
                baseMerge(
                  objValue,
                  srcValue,
                  undefined,
                  mergeDefaults,
                  stack.set(srcValue, objValue)
                ),
              objValue
            );
          }
          function parent(object, path) {
            return 1 == path.length
              ? object
              : baseGet(object, baseSlice(path, 0, -1));
          }
          function reorder(array, indexes) {
            for (
              var arrLength = array.length,
                length = nativeMin(indexes.length, arrLength),
                oldArray = copyArray(array);
              length--;

            ) {
              var index = indexes[length];
              array[length] = isIndex(index, arrLength)
                ? oldArray[index]
                : undefined;
            }
            return array;
          }
          function toKey(value) {
            if ("string" == typeof value || isSymbol(value)) return value;
            var result = value + "";
            return "0" == result && 1 / value == -INFINITY ? "-0" : result;
          }
          function toSource(func) {
            if (null != func) {
              try {
                return funcToString.call(func);
              } catch (e) {}
              try {
                return func + "";
              } catch (e) {}
            }
            return "";
          }
          function wrapperClone(wrapper) {
            if (wrapper instanceof LazyWrapper) return wrapper.clone();
            var result = new LodashWrapper(
              wrapper.__wrapped__,
              wrapper.__chain__
            );
            return (
              (result.__actions__ = copyArray(wrapper.__actions__)),
              (result.__index__ = wrapper.__index__),
              (result.__values__ = wrapper.__values__),
              result
            );
          }
          function chunk(array, size, guard) {
            size = (guard
            ? isIterateeCall(array, size, guard)
            : size === undefined)
              ? 1
              : nativeMax(toInteger(size), 0);
            var length = array ? array.length : 0;
            if (!length || 1 > size) return [];
            for (
              var index = 0,
                resIndex = 0,
                result = Array(nativeCeil(length / size));
              length > index;

            )
              result[resIndex++] = baseSlice(array, index, (index += size));
            return result;
          }
          function compact(array) {
            for (
              var index = -1,
                length = array ? array.length : 0,
                resIndex = 0,
                result = [];
              ++index < length;

            ) {
              var value = array[index];
              value && (result[resIndex++] = value);
            }
            return result;
          }
          function concat() {
            for (
              var length = arguments.length,
                args = Array(length ? length - 1 : 0),
                array = arguments[0],
                index = length;
              index--;

            )
              args[index - 1] = arguments[index];
            return length
              ? arrayPush(
                  isArray(array) ? copyArray(array) : [array],
                  baseFlatten(args, 1)
                )
              : [];
          }
          function drop(array, n, guard) {
            var length = array ? array.length : 0;
            return length
              ? ((n = guard || n === undefined ? 1 : toInteger(n)),
                baseSlice(array, 0 > n ? 0 : n, length))
              : [];
          }
          function dropRight(array, n, guard) {
            var length = array ? array.length : 0;
            return length
              ? ((n = guard || n === undefined ? 1 : toInteger(n)),
                (n = length - n),
                baseSlice(array, 0, 0 > n ? 0 : n))
              : [];
          }
          function dropRightWhile(array, predicate) {
            return array && array.length
              ? baseWhile(array, getIteratee(predicate, 3), !0, !0)
              : [];
          }
          function dropWhile(array, predicate) {
            return array && array.length
              ? baseWhile(array, getIteratee(predicate, 3), !0)
              : [];
          }
          function fill(array, value, start, end) {
            var length = array ? array.length : 0;
            return length
              ? (start &&
                  "number" != typeof start &&
                  isIterateeCall(array, value, start) &&
                  ((start = 0), (end = length)),
                baseFill(array, value, start, end))
              : [];
          }
          function findIndex(array, predicate, fromIndex) {
            var length = array ? array.length : 0;
            if (!length) return -1;
            var index = null == fromIndex ? 0 : toInteger(fromIndex);
            return (
              0 > index && (index = nativeMax(length + index, 0)),
              baseFindIndex(array, getIteratee(predicate, 3), index)
            );
          }
          function findLastIndex(array, predicate, fromIndex) {
            var length = array ? array.length : 0;
            if (!length) return -1;
            var index = length - 1;
            return (
              fromIndex !== undefined &&
                ((index = toInteger(fromIndex)),
                (index =
                  0 > fromIndex
                    ? nativeMax(length + index, 0)
                    : nativeMin(index, length - 1))),
              baseFindIndex(array, getIteratee(predicate, 3), index, !0)
            );
          }
          function flatten(array) {
            var length = array ? array.length : 0;
            return length ? baseFlatten(array, 1) : [];
          }
          function flattenDeep(array) {
            var length = array ? array.length : 0;
            return length ? baseFlatten(array, INFINITY) : [];
          }
          function flattenDepth(array, depth) {
            var length = array ? array.length : 0;
            return length
              ? ((depth = depth === undefined ? 1 : toInteger(depth)),
                baseFlatten(array, depth))
              : [];
          }
          function fromPairs(pairs) {
            for (
              var index = -1, length = pairs ? pairs.length : 0, result = {};
              ++index < length;

            ) {
              var pair = pairs[index];
              result[pair[0]] = pair[1];
            }
            return result;
          }
          function head(array) {
            return array && array.length ? array[0] : undefined;
          }
          function indexOf(array, value, fromIndex) {
            var length = array ? array.length : 0;
            if (!length) return -1;
            var index = null == fromIndex ? 0 : toInteger(fromIndex);
            return (
              0 > index && (index = nativeMax(length + index, 0)),
              baseIndexOf(array, value, index)
            );
          }
          function initial(array) {
            return dropRight(array, 1);
          }
          function join(array, separator) {
            return array ? nativeJoin.call(array, separator) : "";
          }
          function last(array) {
            var length = array ? array.length : 0;
            return length ? array[length - 1] : undefined;
          }
          function lastIndexOf(array, value, fromIndex) {
            var length = array ? array.length : 0;
            if (!length) return -1;
            var index = length;
            if (
              (fromIndex !== undefined &&
                ((index = toInteger(fromIndex)),
                (index =
                  (0 > index
                    ? nativeMax(length + index, 0)
                    : nativeMin(index, length - 1)) + 1)),
              value !== value)
            )
              return indexOfNaN(array, index - 1, !0);
            for (; index--; ) if (array[index] === value) return index;
            return -1;
          }
          function nth(array, n) {
            return array && array.length
              ? baseNth(array, toInteger(n))
              : undefined;
          }
          function pullAll(array, values) {
            return array && array.length && values && values.length
              ? basePullAll(array, values)
              : array;
          }
          function pullAllBy(array, values, iteratee) {
            return array && array.length && values && values.length
              ? basePullAll(array, values, getIteratee(iteratee))
              : array;
          }
          function pullAllWith(array, values, comparator) {
            return array && array.length && values && values.length
              ? basePullAll(array, values, undefined, comparator)
              : array;
          }
          function remove(array, predicate) {
            var result = [];
            if (!array || !array.length) return result;
            var index = -1,
              indexes = [],
              length = array.length;
            for (predicate = getIteratee(predicate, 3); ++index < length; ) {
              var value = array[index];
              predicate(value, index, array) &&
                (result.push(value), indexes.push(index));
            }
            return basePullAt(array, indexes), result;
          }
          function reverse(array) {
            return array ? nativeReverse.call(array) : array;
          }
          function slice(array, start, end) {
            var length = array ? array.length : 0;
            return length
              ? (end &&
                "number" != typeof end &&
                isIterateeCall(array, start, end)
                  ? ((start = 0), (end = length))
                  : ((start = null == start ? 0 : toInteger(start)),
                    (end = end === undefined ? length : toInteger(end))),
                baseSlice(array, start, end))
              : [];
          }
          function sortedIndex(array, value) {
            return baseSortedIndex(array, value);
          }
          function sortedIndexBy(array, value, iteratee) {
            return baseSortedIndexBy(array, value, getIteratee(iteratee));
          }
          function sortedIndexOf(array, value) {
            var length = array ? array.length : 0;
            if (length) {
              var index = baseSortedIndex(array, value);
              if (length > index && eq(array[index], value)) return index;
            }
            return -1;
          }
          function sortedLastIndex(array, value) {
            return baseSortedIndex(array, value, !0);
          }
          function sortedLastIndexBy(array, value, iteratee) {
            return baseSortedIndexBy(array, value, getIteratee(iteratee), !0);
          }
          function sortedLastIndexOf(array, value) {
            var length = array ? array.length : 0;
            if (length) {
              var index = baseSortedIndex(array, value, !0) - 1;
              if (eq(array[index], value)) return index;
            }
            return -1;
          }
          function sortedUniq(array) {
            return array && array.length ? baseSortedUniq(array) : [];
          }
          function sortedUniqBy(array, iteratee) {
            return array && array.length
              ? baseSortedUniq(array, getIteratee(iteratee))
              : [];
          }
          function tail(array) {
            return drop(array, 1);
          }
          function take(array, n, guard) {
            return array && array.length
              ? ((n = guard || n === undefined ? 1 : toInteger(n)),
                baseSlice(array, 0, 0 > n ? 0 : n))
              : [];
          }
          function takeRight(array, n, guard) {
            var length = array ? array.length : 0;
            return length
              ? ((n = guard || n === undefined ? 1 : toInteger(n)),
                (n = length - n),
                baseSlice(array, 0 > n ? 0 : n, length))
              : [];
          }
          function takeRightWhile(array, predicate) {
            return array && array.length
              ? baseWhile(array, getIteratee(predicate, 3), !1, !0)
              : [];
          }
          function takeWhile(array, predicate) {
            return array && array.length
              ? baseWhile(array, getIteratee(predicate, 3))
              : [];
          }
          function uniq(array) {
            return array && array.length ? baseUniq(array) : [];
          }
          function uniqBy(array, iteratee) {
            return array && array.length
              ? baseUniq(array, getIteratee(iteratee))
              : [];
          }
          function uniqWith(array, comparator) {
            return array && array.length
              ? baseUniq(array, undefined, comparator)
              : [];
          }
          function unzip(array) {
            if (!array || !array.length) return [];
            var length = 0;
            return (
              (array = arrayFilter(array, function(group) {
                return isArrayLikeObject(group)
                  ? ((length = nativeMax(group.length, length)), !0)
                  : void 0;
              })),
              baseTimes(length, function(index) {
                return arrayMap(array, baseProperty(index));
              })
            );
          }
          function unzipWith(array, iteratee) {
            if (!array || !array.length) return [];
            var result = unzip(array);
            return null == iteratee
              ? result
              : arrayMap(result, function(group) {
                  return apply(iteratee, undefined, group);
                });
          }
          function zipObject(props, values) {
            return baseZipObject(props || [], values || [], assignValue);
          }
          function zipObjectDeep(props, values) {
            return baseZipObject(props || [], values || [], baseSet);
          }
          function chain(value) {
            var result = lodash(value);
            return (result.__chain__ = !0), result;
          }
          function tap(value, interceptor) {
            return interceptor(value), value;
          }
          function thru(value, interceptor) {
            return interceptor(value);
          }
          function wrapperChain() {
            return chain(this);
          }
          function wrapperCommit() {
            return new LodashWrapper(this.value(), this.__chain__);
          }
          function wrapperNext() {
            this.__values__ === undefined &&
              (this.__values__ = toArray(this.value()));
            var done = this.__index__ >= this.__values__.length,
              value = done ? undefined : this.__values__[this.__index__++];
            return { done: done, value: value };
          }
          function wrapperToIterator() {
            return this;
          }
          function wrapperPlant(value) {
            for (var result, parent = this; parent instanceof baseLodash; ) {
              var clone = wrapperClone(parent);
              (clone.__index__ = 0),
                (clone.__values__ = undefined),
                result ? (previous.__wrapped__ = clone) : (result = clone);
              var previous = clone;
              parent = parent.__wrapped__;
            }
            return (previous.__wrapped__ = value), result;
          }
          function wrapperReverse() {
            var value = this.__wrapped__;
            if (value instanceof LazyWrapper) {
              var wrapped = value;
              return (
                this.__actions__.length && (wrapped = new LazyWrapper(this)),
                (wrapped = wrapped.reverse()),
                wrapped.__actions__.push({
                  func: thru,
                  args: [reverse],
                  thisArg: undefined
                }),
                new LodashWrapper(wrapped, this.__chain__)
              );
            }
            return this.thru(reverse);
          }
          function wrapperValue() {
            return baseWrapperValue(this.__wrapped__, this.__actions__);
          }
          function every(collection, predicate, guard) {
            var func = isArray(collection) ? arrayEvery : baseEvery;
            return (
              guard &&
                isIterateeCall(collection, predicate, guard) &&
                (predicate = undefined),
              func(collection, getIteratee(predicate, 3))
            );
          }
          function filter(collection, predicate) {
            var func = isArray(collection) ? arrayFilter : baseFilter;
            return func(collection, getIteratee(predicate, 3));
          }
          function flatMap(collection, iteratee) {
            return baseFlatten(map(collection, iteratee), 1);
          }
          function flatMapDeep(collection, iteratee) {
            return baseFlatten(map(collection, iteratee), INFINITY);
          }
          function flatMapDepth(collection, iteratee, depth) {
            return (
              (depth = depth === undefined ? 1 : toInteger(depth)),
              baseFlatten(map(collection, iteratee), depth)
            );
          }
          function forEach(collection, iteratee) {
            var func = isArray(collection) ? arrayEach : baseEach;
            return func(collection, getIteratee(iteratee, 3));
          }
          function forEachRight(collection, iteratee) {
            var func = isArray(collection) ? arrayEachRight : baseEachRight;
            return func(collection, getIteratee(iteratee, 3));
          }
          function includes(collection, value, fromIndex, guard) {
            (collection = isArrayLike(collection)
              ? collection
              : values(collection)),
              (fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0);
            var length = collection.length;
            return (
              0 > fromIndex && (fromIndex = nativeMax(length + fromIndex, 0)),
              isString(collection)
                ? length >= fromIndex &&
                  collection.indexOf(value, fromIndex) > -1
                : !!length && baseIndexOf(collection, value, fromIndex) > -1
            );
          }
          function map(collection, iteratee) {
            var func = isArray(collection) ? arrayMap : baseMap;
            return func(collection, getIteratee(iteratee, 3));
          }
          function orderBy(collection, iteratees, orders, guard) {
            return null == collection
              ? []
              : (isArray(iteratees) ||
                  (iteratees = null == iteratees ? [] : [iteratees]),
                (orders = guard ? undefined : orders),
                isArray(orders) || (orders = null == orders ? [] : [orders]),
                baseOrderBy(collection, iteratees, orders));
          }
          function reduce(collection, iteratee, accumulator) {
            var func = isArray(collection) ? arrayReduce : baseReduce,
              initAccum = arguments.length < 3;
            return func(
              collection,
              getIteratee(iteratee, 4),
              accumulator,
              initAccum,
              baseEach
            );
          }
          function reduceRight(collection, iteratee, accumulator) {
            var func = isArray(collection) ? arrayReduceRight : baseReduce,
              initAccum = arguments.length < 3;
            return func(
              collection,
              getIteratee(iteratee, 4),
              accumulator,
              initAccum,
              baseEachRight
            );
          }
          function reject(collection, predicate) {
            var func = isArray(collection) ? arrayFilter : baseFilter;
            return (
              (predicate = getIteratee(predicate, 3)),
              func(collection, function(value, index, collection) {
                return !predicate(value, index, collection);
              })
            );
          }
          function sample(collection) {
            var array = isArrayLike(collection)
                ? collection
                : values(collection),
              length = array.length;
            return length > 0 ? array[baseRandom(0, length - 1)] : undefined;
          }
          function sampleSize(collection, n, guard) {
            var index = -1,
              result = toArray(collection),
              length = result.length,
              lastIndex = length - 1;
            for (
              n = (guard
              ? isIterateeCall(collection, n, guard)
              : n === undefined)
                ? 1
                : baseClamp(toInteger(n), 0, length);
              ++index < n;

            ) {
              var rand = baseRandom(index, lastIndex),
                value = result[rand];
              (result[rand] = result[index]), (result[index] = value);
            }
            return (result.length = n), result;
          }
          function shuffle(collection) {
            return sampleSize(collection, MAX_ARRAY_LENGTH);
          }
          function size(collection) {
            if (null == collection) return 0;
            if (isArrayLike(collection)) {
              var result = collection.length;
              return result && isString(collection)
                ? stringSize(collection)
                : result;
            }
            if (isObjectLike(collection)) {
              var tag = getTag(collection);
              if (tag == mapTag || tag == setTag) return collection.size;
            }
            return keys(collection).length;
          }
          function some(collection, predicate, guard) {
            var func = isArray(collection) ? arraySome : baseSome;
            return (
              guard &&
                isIterateeCall(collection, predicate, guard) &&
                (predicate = undefined),
              func(collection, getIteratee(predicate, 3))
            );
          }
          function now() {
            return Date.now();
          }
          function after(n, func) {
            if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
            return (
              (n = toInteger(n)),
              function() {
                return --n < 1 ? func.apply(this, arguments) : void 0;
              }
            );
          }
          function ary(func, n, guard) {
            return (
              (n = guard ? undefined : n),
              (n = func && null == n ? func.length : n),
              createWrapper(
                func,
                ARY_FLAG,
                undefined,
                undefined,
                undefined,
                undefined,
                n
              )
            );
          }
          function before(n, func) {
            var result;
            if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
            return (
              (n = toInteger(n)),
              function() {
                return (
                  --n > 0 && (result = func.apply(this, arguments)),
                  1 >= n && (func = undefined),
                  result
                );
              }
            );
          }
          function curry(func, arity, guard) {
            arity = guard ? undefined : arity;
            var result = createWrapper(
              func,
              CURRY_FLAG,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              arity
            );
            return (result.placeholder = curry.placeholder), result;
          }
          function curryRight(func, arity, guard) {
            arity = guard ? undefined : arity;
            var result = createWrapper(
              func,
              CURRY_RIGHT_FLAG,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              arity
            );
            return (result.placeholder = curryRight.placeholder), result;
          }
          function debounce(func, wait, options) {
            function invokeFunc(time) {
              var args = lastArgs,
                thisArg = lastThis;
              return (
                (lastArgs = lastThis = undefined),
                (lastInvokeTime = time),
                (result = func.apply(thisArg, args))
              );
            }
            function leadingEdge(time) {
              return (
                (lastInvokeTime = time),
                (timerId = setTimeout(timerExpired, wait)),
                leading ? invokeFunc(time) : result
              );
            }
            function remainingWait(time) {
              var timeSinceLastCall = time - lastCallTime,
                timeSinceLastInvoke = time - lastInvokeTime,
                result = wait - timeSinceLastCall;
              return maxing
                ? nativeMin(result, maxWait - timeSinceLastInvoke)
                : result;
            }
            function shouldInvoke(time) {
              var timeSinceLastCall = time - lastCallTime,
                timeSinceLastInvoke = time - lastInvokeTime;
              return (
                lastCallTime === undefined ||
                timeSinceLastCall >= wait ||
                0 > timeSinceLastCall ||
                (maxing && timeSinceLastInvoke >= maxWait)
              );
            }
            function timerExpired() {
              var time = now();
              return shouldInvoke(time)
                ? trailingEdge(time)
                : ((timerId = setTimeout(timerExpired, remainingWait(time))),
                  void 0);
            }
            function trailingEdge(time) {
              return (
                (timerId = undefined),
                trailing && lastArgs
                  ? invokeFunc(time)
                  : ((lastArgs = lastThis = undefined), result)
              );
            }
            function cancel() {
              (lastInvokeTime = 0),
                (lastArgs = lastCallTime = lastThis = timerId = undefined);
            }
            function flush() {
              return timerId === undefined ? result : trailingEdge(now());
            }
            function debounced() {
              var time = now(),
                isInvoking = shouldInvoke(time);
              if (
                ((lastArgs = arguments),
                (lastThis = this),
                (lastCallTime = time),
                isInvoking)
              ) {
                if (timerId === undefined) return leadingEdge(lastCallTime);
                if (maxing)
                  return (
                    (timerId = setTimeout(timerExpired, wait)),
                    invokeFunc(lastCallTime)
                  );
              }
              return (
                timerId === undefined &&
                  (timerId = setTimeout(timerExpired, wait)),
                result
              );
            }
            var lastArgs,
              lastThis,
              maxWait,
              result,
              timerId,
              lastCallTime,
              lastInvokeTime = 0,
              leading = !1,
              maxing = !1,
              trailing = !0;
            if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
            return (
              (wait = toNumber(wait) || 0),
              isObject(options) &&
                ((leading = !!options.leading),
                (maxing = "maxWait" in options),
                (maxWait = maxing
                  ? nativeMax(toNumber(options.maxWait) || 0, wait)
                  : maxWait),
                (trailing =
                  "trailing" in options ? !!options.trailing : trailing)),
              (debounced.cancel = cancel),
              (debounced.flush = flush),
              debounced
            );
          }
          function flip(func) {
            return createWrapper(func, FLIP_FLAG);
          }
          function memoize(func, resolver) {
            if (
              "function" != typeof func ||
              (resolver && "function" != typeof resolver)
            )
              throw new TypeError(FUNC_ERROR_TEXT);
            var memoized = function() {
              var args = arguments,
                key = resolver ? resolver.apply(this, args) : args[0],
                cache = memoized.cache;
              if (cache.has(key)) return cache.get(key);
              var result = func.apply(this, args);
              return (memoized.cache = cache.set(key, result)), result;
            };
            return (
              (memoized.cache = new (memoize.Cache || MapCache)()), memoized
            );
          }
          function negate(predicate) {
            if ("function" != typeof predicate)
              throw new TypeError(FUNC_ERROR_TEXT);
            return function() {
              return !predicate.apply(this, arguments);
            };
          }
          function once(func) {
            return before(2, func);
          }
          function rest(func, start) {
            if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
            return (
              (start = nativeMax(
                start === undefined ? func.length - 1 : toInteger(start),
                0
              )),
              function() {
                for (
                  var args = arguments,
                    index = -1,
                    length = nativeMax(args.length - start, 0),
                    array = Array(length);
                  ++index < length;

                )
                  array[index] = args[start + index];
                switch (start) {
                  case 0:
                    return func.call(this, array);
                  case 1:
                    return func.call(this, args[0], array);
                  case 2:
                    return func.call(this, args[0], args[1], array);
                }
                var otherArgs = Array(start + 1);
                for (index = -1; ++index < start; )
                  otherArgs[index] = args[index];
                return (otherArgs[start] = array), apply(func, this, otherArgs);
              }
            );
          }
          function spread(func, start) {
            if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
            return (
              (start =
                start === undefined ? 0 : nativeMax(toInteger(start), 0)),
              rest(function(args) {
                var array = args[start],
                  otherArgs = castSlice(args, 0, start);
                return (
                  array && arrayPush(otherArgs, array),
                  apply(func, this, otherArgs)
                );
              })
            );
          }
          function throttle(func, wait, options) {
            var leading = !0,
              trailing = !0;
            if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
            return (
              isObject(options) &&
                ((leading = "leading" in options ? !!options.leading : leading),
                (trailing =
                  "trailing" in options ? !!options.trailing : trailing)),
              debounce(func, wait, {
                leading: leading,
                maxWait: wait,
                trailing: trailing
              })
            );
          }
          function unary(func) {
            return ary(func, 1);
          }
          function wrap(value, wrapper) {
            return (
              (wrapper = null == wrapper ? identity : wrapper),
              partial(wrapper, value)
            );
          }
          function castArray() {
            if (!arguments.length) return [];
            var value = arguments[0];
            return isArray(value) ? value : [value];
          }
          function clone(value) {
            return baseClone(value, !1, !0);
          }
          function cloneWith(value, customizer) {
            return baseClone(value, !1, !0, customizer);
          }
          function cloneDeep(value) {
            return baseClone(value, !0, !0);
          }
          function cloneDeepWith(value, customizer) {
            return baseClone(value, !0, !0, customizer);
          }
          function eq(value, other) {
            return value === other || (value !== value && other !== other);
          }
          function isArguments(value) {
            return (
              isArrayLikeObject(value) &&
              hasOwnProperty.call(value, "callee") &&
              (!propertyIsEnumerable.call(value, "callee") ||
                objectToString.call(value) == argsTag)
            );
          }
          function isArrayBuffer(value) {
            return (
              isObjectLike(value) &&
              objectToString.call(value) == arrayBufferTag
            );
          }
          function isArrayLike(value) {
            return (
              null != value && isLength(getLength(value)) && !isFunction(value)
            );
          }
          function isArrayLikeObject(value) {
            return isObjectLike(value) && isArrayLike(value);
          }
          function isBoolean(value) {
            return (
              value === !0 ||
              value === !1 ||
              (isObjectLike(value) && objectToString.call(value) == boolTag)
            );
          }
          function isDate(value) {
            return isObjectLike(value) && objectToString.call(value) == dateTag;
          }
          function isElement(value) {
            return (
              !!value &&
              1 === value.nodeType &&
              isObjectLike(value) &&
              !isPlainObject(value)
            );
          }
          function isEmpty(value) {
            if (
              isArrayLike(value) &&
              (isArray(value) ||
                isString(value) ||
                isFunction(value.splice) ||
                isArguments(value) ||
                isBuffer(value))
            )
              return !value.length;
            if (isObjectLike(value)) {
              var tag = getTag(value);
              if (tag == mapTag || tag == setTag) return !value.size;
            }
            for (var key in value)
              if (hasOwnProperty.call(value, key)) return !1;
            return !(nonEnumShadows && keys(value).length);
          }
          function isEqual(value, other) {
            return baseIsEqual(value, other);
          }
          function isEqualWith(value, other, customizer) {
            customizer =
              "function" == typeof customizer ? customizer : undefined;
            var result = customizer ? customizer(value, other) : undefined;
            return result === undefined
              ? baseIsEqual(value, other, customizer)
              : !!result;
          }
          function isError(value) {
            return isObjectLike(value)
              ? objectToString.call(value) == errorTag ||
                  ("string" == typeof value.message &&
                    "string" == typeof value.name)
              : !1;
          }
          function isFinite(value) {
            return "number" == typeof value && nativeIsFinite(value);
          }
          function isFunction(value) {
            var tag = isObject(value) ? objectToString.call(value) : "";
            return tag == funcTag || tag == genTag;
          }
          function isInteger(value) {
            return "number" == typeof value && value == toInteger(value);
          }
          function isLength(value) {
            return (
              "number" == typeof value &&
              value > -1 &&
              0 == value % 1 &&
              MAX_SAFE_INTEGER >= value
            );
          }
          function isObject(value) {
            var type = typeof value;
            return !!value && ("object" == type || "function" == type);
          }
          function isObjectLike(value) {
            return !!value && "object" == typeof value;
          }
          function isMap(value) {
            return isObjectLike(value) && getTag(value) == mapTag;
          }
          function isMatch(object, source) {
            return (
              object === source ||
              baseIsMatch(object, source, getMatchData(source))
            );
          }
          function isMatchWith(object, source, customizer) {
            return (
              (customizer =
                "function" == typeof customizer ? customizer : undefined),
              baseIsMatch(object, source, getMatchData(source), customizer)
            );
          }
          function isNaN(value) {
            return isNumber(value) && value != +value;
          }
          function isNative(value) {
            if (isMaskable(value))
              throw new Error(
                "This method is not supported with `core-js`. Try https://github.com/es-shims."
              );
            return baseIsNative(value);
          }
          function isNull(value) {
            return null === value;
          }
          function isNil(value) {
            return null == value;
          }
          function isNumber(value) {
            return (
              "number" == typeof value ||
              (isObjectLike(value) && objectToString.call(value) == numberTag)
            );
          }
          function isPlainObject(value) {
            if (
              !isObjectLike(value) ||
              objectToString.call(value) != objectTag ||
              isHostObject(value)
            )
              return !1;
            var proto = getPrototype(value);
            if (null === proto) return !0;
            var Ctor =
              hasOwnProperty.call(proto, "constructor") && proto.constructor;
            return (
              "function" == typeof Ctor &&
              Ctor instanceof Ctor &&
              funcToString.call(Ctor) == objectCtorString
            );
          }
          function isRegExp(value) {
            return isObject(value) && objectToString.call(value) == regexpTag;
          }
          function isSafeInteger(value) {
            return (
              isInteger(value) &&
              value >= -MAX_SAFE_INTEGER &&
              MAX_SAFE_INTEGER >= value
            );
          }
          function isSet(value) {
            return isObjectLike(value) && getTag(value) == setTag;
          }
          function isString(value) {
            return (
              "string" == typeof value ||
              (!isArray(value) &&
                isObjectLike(value) &&
                objectToString.call(value) == stringTag)
            );
          }
          function isSymbol(value) {
            return (
              "symbol" == typeof value ||
              (isObjectLike(value) && objectToString.call(value) == symbolTag)
            );
          }
          function isTypedArray(value) {
            return (
              isObjectLike(value) &&
              isLength(value.length) &&
              !!typedArrayTags[objectToString.call(value)]
            );
          }
          function isUndefined(value) {
            return value === undefined;
          }
          function isWeakMap(value) {
            return isObjectLike(value) && getTag(value) == weakMapTag;
          }
          function isWeakSet(value) {
            return (
              isObjectLike(value) && objectToString.call(value) == weakSetTag
            );
          }
          function toArray(value) {
            if (!value) return [];
            if (isArrayLike(value))
              return isString(value) ? stringToArray(value) : copyArray(value);
            if (iteratorSymbol && value[iteratorSymbol])
              return iteratorToArray(value[iteratorSymbol]());
            var tag = getTag(value),
              func =
                tag == mapTag
                  ? mapToArray
                  : tag == setTag
                  ? setToArray
                  : values;
            return func(value);
          }
          function toFinite(value) {
            if (!value) return 0 === value ? value : 0;
            if (
              ((value = toNumber(value)),
              value === INFINITY || value === -INFINITY)
            ) {
              var sign = 0 > value ? -1 : 1;
              return sign * MAX_INTEGER;
            }
            return value === value ? value : 0;
          }
          function toInteger(value) {
            var result = toFinite(value),
              remainder = result % 1;
            return result === result
              ? remainder
                ? result - remainder
                : result
              : 0;
          }
          function toLength(value) {
            return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
          }
          function toNumber(value) {
            if ("number" == typeof value) return value;
            if (isSymbol(value)) return NAN;
            if (isObject(value)) {
              var other = isFunction(value.valueOf) ? value.valueOf() : value;
              value = isObject(other) ? other + "" : other;
            }
            if ("string" != typeof value) return 0 === value ? value : +value;
            value = value.replace(reTrim, "");
            var isBinary = reIsBinary.test(value);
            return isBinary || reIsOctal.test(value)
              ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
              : reIsBadHex.test(value)
              ? NAN
              : +value;
          }
          function toPlainObject(value) {
            return copyObject(value, keysIn(value));
          }
          function toSafeInteger(value) {
            return baseClamp(
              toInteger(value),
              -MAX_SAFE_INTEGER,
              MAX_SAFE_INTEGER
            );
          }
          function toString(value) {
            return null == value ? "" : baseToString(value);
          }
          function create(prototype, properties) {
            var result = baseCreate(prototype);
            return properties ? baseAssign(result, properties) : result;
          }
          function findKey(object, predicate) {
            return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
          }
          function findLastKey(object, predicate) {
            return baseFindKey(
              object,
              getIteratee(predicate, 3),
              baseForOwnRight
            );
          }
          function forIn(object, iteratee) {
            return null == object
              ? object
              : baseFor(object, getIteratee(iteratee, 3), keysIn);
          }
          function forInRight(object, iteratee) {
            return null == object
              ? object
              : baseForRight(object, getIteratee(iteratee, 3), keysIn);
          }
          function forOwn(object, iteratee) {
            return object && baseForOwn(object, getIteratee(iteratee, 3));
          }
          function forOwnRight(object, iteratee) {
            return object && baseForOwnRight(object, getIteratee(iteratee, 3));
          }
          function functions(object) {
            return null == object ? [] : baseFunctions(object, keys(object));
          }
          function functionsIn(object) {
            return null == object ? [] : baseFunctions(object, keysIn(object));
          }
          function get(object, path, defaultValue) {
            var result = null == object ? undefined : baseGet(object, path);
            return result === undefined ? defaultValue : result;
          }
          function has(object, path) {
            return null != object && hasPath(object, path, baseHas);
          }
          function hasIn(object, path) {
            return null != object && hasPath(object, path, baseHasIn);
          }
          function keys(object) {
            var isProto = isPrototype(object);
            if (!isProto && !isArrayLike(object)) return baseKeys(object);
            var indexes = indexKeys(object),
              skipIndexes = !!indexes,
              result = indexes || [],
              length = result.length;
            for (var key in object)
              !baseHas(object, key) ||
                (skipIndexes && ("length" == key || isIndex(key, length))) ||
                (isProto && "constructor" == key) ||
                result.push(key);
            return result;
          }
          function keysIn(object) {
            for (
              var index = -1,
                isProto = isPrototype(object),
                props = baseKeysIn(object),
                propsLength = props.length,
                indexes = indexKeys(object),
                skipIndexes = !!indexes,
                result = indexes || [],
                length = result.length;
              ++index < propsLength;

            ) {
              var key = props[index];
              (skipIndexes && ("length" == key || isIndex(key, length))) ||
                ("constructor" == key &&
                  (isProto || !hasOwnProperty.call(object, key))) ||
                result.push(key);
            }
            return result;
          }
          function mapKeys(object, iteratee) {
            var result = {};
            return (
              (iteratee = getIteratee(iteratee, 3)),
              baseForOwn(object, function(value, key, object) {
                result[iteratee(value, key, object)] = value;
              }),
              result
            );
          }
          function mapValues(object, iteratee) {
            var result = {};
            return (
              (iteratee = getIteratee(iteratee, 3)),
              baseForOwn(object, function(value, key, object) {
                result[key] = iteratee(value, key, object);
              }),
              result
            );
          }
          function omitBy(object, predicate) {
            return (
              (predicate = getIteratee(predicate)),
              basePickBy(object, function(value, key) {
                return !predicate(value, key);
              })
            );
          }
          function pickBy(object, predicate) {
            return null == object
              ? {}
              : basePickBy(object, getIteratee(predicate));
          }
          function result(object, path, defaultValue) {
            path = isKey(path, object) ? [path] : castPath(path);
            var index = -1,
              length = path.length;
            for (
              length || ((object = undefined), (length = 1));
              ++index < length;

            ) {
              var value =
                null == object ? undefined : object[toKey(path[index])];
              value === undefined && ((index = length), (value = defaultValue)),
                (object = isFunction(value) ? value.call(object) : value);
            }
            return object;
          }
          function set(object, path, value) {
            return null == object ? object : baseSet(object, path, value);
          }
          function setWith(object, path, value, customizer) {
            return (
              (customizer =
                "function" == typeof customizer ? customizer : undefined),
              null == object ? object : baseSet(object, path, value, customizer)
            );
          }
          function transform(object, iteratee, accumulator) {
            var isArr = isArray(object) || isTypedArray(object);
            if (((iteratee = getIteratee(iteratee, 4)), null == accumulator))
              if (isArr || isObject(object)) {
                var Ctor = object.constructor;
                accumulator = isArr
                  ? isArray(object)
                    ? new Ctor()
                    : []
                  : isFunction(Ctor)
                  ? baseCreate(getPrototype(object))
                  : {};
              } else accumulator = {};
            return (
              (isArr ? arrayEach : baseForOwn)(object, function(
                value,
                index,
                object
              ) {
                return iteratee(accumulator, value, index, object);
              }),
              accumulator
            );
          }
          function unset(object, path) {
            return null == object ? !0 : baseUnset(object, path);
          }
          function update(object, path, updater) {
            return null == object
              ? object
              : baseUpdate(object, path, castFunction(updater));
          }
          function updateWith(object, path, updater, customizer) {
            return (
              (customizer =
                "function" == typeof customizer ? customizer : undefined),
              null == object
                ? object
                : baseUpdate(object, path, castFunction(updater), customizer)
            );
          }
          function values(object) {
            return object ? baseValues(object, keys(object)) : [];
          }
          function valuesIn(object) {
            return null == object ? [] : baseValues(object, keysIn(object));
          }
          function clamp(number, lower, upper) {
            return (
              upper === undefined && ((upper = lower), (lower = undefined)),
              upper !== undefined &&
                ((upper = toNumber(upper)),
                (upper = upper === upper ? upper : 0)),
              lower !== undefined &&
                ((lower = toNumber(lower)),
                (lower = lower === lower ? lower : 0)),
              baseClamp(toNumber(number), lower, upper)
            );
          }
          function inRange(number, start, end) {
            return (
              (start = toNumber(start) || 0),
              end === undefined
                ? ((end = start), (start = 0))
                : (end = toNumber(end) || 0),
              (number = toNumber(number)),
              baseInRange(number, start, end)
            );
          }
          function random(lower, upper, floating) {
            if (
              (floating &&
                "boolean" != typeof floating &&
                isIterateeCall(lower, upper, floating) &&
                (upper = floating = undefined),
              floating === undefined &&
                ("boolean" == typeof upper
                  ? ((floating = upper), (upper = undefined))
                  : "boolean" == typeof lower &&
                    ((floating = lower), (lower = undefined))),
              lower === undefined && upper === undefined
                ? ((lower = 0), (upper = 1))
                : ((lower = toNumber(lower) || 0),
                  upper === undefined
                    ? ((upper = lower), (lower = 0))
                    : (upper = toNumber(upper) || 0)),
              lower > upper)
            ) {
              var temp = lower;
              (lower = upper), (upper = temp);
            }
            if (floating || lower % 1 || upper % 1) {
              var rand = nativeRandom();
              return nativeMin(
                lower +
                  rand *
                    (upper -
                      lower +
                      freeParseFloat("1e-" + ((rand + "").length - 1))),
                upper
              );
            }
            return baseRandom(lower, upper);
          }
          function capitalize(string) {
            return upperFirst(toString(string).toLowerCase());
          }
          function deburr(string) {
            return (
              (string = toString(string)),
              string &&
                string.replace(reLatin1, deburrLetter).replace(reComboMark, "")
            );
          }
          function endsWith(string, target, position) {
            (string = toString(string)), (target = baseToString(target));
            var length = string.length;
            return (
              (position =
                position === undefined
                  ? length
                  : baseClamp(toInteger(position), 0, length)),
              (position -= target.length),
              position >= 0 && string.indexOf(target, position) == position
            );
          }
          function escape(string) {
            return (
              (string = toString(string)),
              string && reHasUnescapedHtml.test(string)
                ? string.replace(reUnescapedHtml, escapeHtmlChar)
                : string
            );
          }
          function escapeRegExp(string) {
            return (
              (string = toString(string)),
              string && reHasRegExpChar.test(string)
                ? string.replace(reRegExpChar, "\\$&")
                : string
            );
          }
          function pad(string, length, chars) {
            (string = toString(string)), (length = toInteger(length));
            var strLength = length ? stringSize(string) : 0;
            if (!length || strLength >= length) return string;
            var mid = (length - strLength) / 2;
            return (
              createPadding(nativeFloor(mid), chars) +
              string +
              createPadding(nativeCeil(mid), chars)
            );
          }
          function padEnd(string, length, chars) {
            (string = toString(string)), (length = toInteger(length));
            var strLength = length ? stringSize(string) : 0;
            return length && length > strLength
              ? string + createPadding(length - strLength, chars)
              : string;
          }
          function padStart(string, length, chars) {
            (string = toString(string)), (length = toInteger(length));
            var strLength = length ? stringSize(string) : 0;
            return length && length > strLength
              ? createPadding(length - strLength, chars) + string
              : string;
          }
          function parseInt(string, radix, guard) {
            return (
              guard || null == radix ? (radix = 0) : radix && (radix = +radix),
              (string = toString(string).replace(reTrim, "")),
              nativeParseInt(
                string,
                radix || (reHasHexPrefix.test(string) ? 16 : 10)
              )
            );
          }
          function repeat(string, n, guard) {
            return (
              (n = (guard
              ? isIterateeCall(string, n, guard)
              : n === undefined)
                ? 1
                : toInteger(n)),
              baseRepeat(toString(string), n)
            );
          }
          function replace() {
            var args = arguments,
              string = toString(args[0]);
            return args.length < 3
              ? string
              : nativeReplace.call(string, args[1], args[2]);
          }
          function split(string, separator, limit) {
            return (
              limit &&
                "number" != typeof limit &&
                isIterateeCall(string, separator, limit) &&
                (separator = limit = undefined),
              (limit = limit === undefined ? MAX_ARRAY_LENGTH : limit >>> 0)
                ? ((string = toString(string)),
                  string &&
                  ("string" == typeof separator ||
                    (null != separator && !isRegExp(separator))) &&
                  ((separator = baseToString(separator)),
                  "" == separator && reHasComplexSymbol.test(string))
                    ? castSlice(stringToArray(string), 0, limit)
                    : nativeSplit.call(string, separator, limit))
                : []
            );
          }
          function startsWith(string, target, position) {
            return (
              (string = toString(string)),
              (position = baseClamp(toInteger(position), 0, string.length)),
              string.lastIndexOf(baseToString(target), position) == position
            );
          }
          function template(string, options, guard) {
            var settings = lodash.templateSettings;
            guard &&
              isIterateeCall(string, options, guard) &&
              (options = undefined),
              (string = toString(string)),
              (options = assignInWith({}, options, settings, assignInDefaults));
            var isEscaping,
              isEvaluating,
              imports = assignInWith(
                {},
                options.imports,
                settings.imports,
                assignInDefaults
              ),
              importsKeys = keys(imports),
              importsValues = baseValues(imports, importsKeys),
              index = 0,
              interpolate = options.interpolate || reNoMatch,
              source = "__p += '",
              reDelimiters = RegExp(
                (options.escape || reNoMatch).source +
                  "|" +
                  interpolate.source +
                  "|" +
                  (interpolate === reInterpolate ? reEsTemplate : reNoMatch)
                    .source +
                  "|" +
                  (options.evaluate || reNoMatch).source +
                  "|$",
                "g"
              ),
              sourceURL =
                "//# sourceURL=" +
                ("sourceURL" in options
                  ? options.sourceURL
                  : "lodash.templateSources[" + ++templateCounter + "]") +
                "\n";
            string.replace(reDelimiters, function(
              match,
              escapeValue,
              interpolateValue,
              esTemplateValue,
              evaluateValue,
              offset
            ) {
              return (
                interpolateValue || (interpolateValue = esTemplateValue),
                (source += string
                  .slice(index, offset)
                  .replace(reUnescapedString, escapeStringChar)),
                escapeValue &&
                  ((isEscaping = !0),
                  (source += "' +\n__e(" + escapeValue + ") +\n'")),
                evaluateValue &&
                  ((isEvaluating = !0),
                  (source += "';\n" + evaluateValue + ";\n__p += '")),
                interpolateValue &&
                  (source +=
                    "' +\n((__t = (" +
                    interpolateValue +
                    ")) == null ? '' : __t) +\n'"),
                (index = offset + match.length),
                match
              );
            }),
              (source += "';\n");
            var variable = options.variable;
            variable || (source = "with (obj) {\n" + source + "\n}\n"),
              (source = (isEvaluating
                ? source.replace(reEmptyStringLeading, "")
                : source
              )
                .replace(reEmptyStringMiddle, "$1")
                .replace(reEmptyStringTrailing, "$1;")),
              (source =
                "function(" +
                (variable || "obj") +
                ") {\n" +
                (variable ? "" : "obj || (obj = {});\n") +
                "var __t, __p = ''" +
                (isEscaping ? ", __e = _.escape" : "") +
                (isEvaluating
                  ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n"
                  : ";\n") +
                source +
                "return __p\n}");
            var result = attempt(function() {
              return Function(
                importsKeys,
                sourceURL + "return " + source
              ).apply(undefined, importsValues);
            });
            if (((result.source = source), isError(result))) throw result;
            return result;
          }
          function toLower(value) {
            return toString(value).toLowerCase();
          }
          function toUpper(value) {
            return toString(value).toUpperCase();
          }
          function trim(string, chars, guard) {
            if (
              ((string = toString(string)),
              string && (guard || chars === undefined))
            )
              return string.replace(reTrim, "");
            if (!string || !(chars = baseToString(chars))) return string;
            var strSymbols = stringToArray(string),
              chrSymbols = stringToArray(chars),
              start = charsStartIndex(strSymbols, chrSymbols),
              end = charsEndIndex(strSymbols, chrSymbols) + 1;
            return castSlice(strSymbols, start, end).join("");
          }
          function trimEnd(string, chars, guard) {
            if (
              ((string = toString(string)),
              string && (guard || chars === undefined))
            )
              return string.replace(reTrimEnd, "");
            if (!string || !(chars = baseToString(chars))) return string;
            var strSymbols = stringToArray(string),
              end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;
            return castSlice(strSymbols, 0, end).join("");
          }
          function trimStart(string, chars, guard) {
            if (
              ((string = toString(string)),
              string && (guard || chars === undefined))
            )
              return string.replace(reTrimStart, "");
            if (!string || !(chars = baseToString(chars))) return string;
            var strSymbols = stringToArray(string),
              start = charsStartIndex(strSymbols, stringToArray(chars));
            return castSlice(strSymbols, start).join("");
          }
          function truncate(string, options) {
            var length = DEFAULT_TRUNC_LENGTH,
              omission = DEFAULT_TRUNC_OMISSION;
            if (isObject(options)) {
              var separator =
                "separator" in options ? options.separator : separator;
              (length =
                "length" in options ? toInteger(options.length) : length),
                (omission =
                  "omission" in options
                    ? baseToString(options.omission)
                    : omission);
            }
            string = toString(string);
            var strLength = string.length;
            if (reHasComplexSymbol.test(string)) {
              var strSymbols = stringToArray(string);
              strLength = strSymbols.length;
            }
            if (length >= strLength) return string;
            var end = length - stringSize(omission);
            if (1 > end) return omission;
            var result = strSymbols
              ? castSlice(strSymbols, 0, end).join("")
              : string.slice(0, end);
            if (separator === undefined) return result + omission;
            if (
              (strSymbols && (end += result.length - end), isRegExp(separator))
            ) {
              if (string.slice(end).search(separator)) {
                var match,
                  substring = result;
                for (
                  separator.global ||
                    (separator = RegExp(
                      separator.source,
                      toString(reFlags.exec(separator)) + "g"
                    )),
                    separator.lastIndex = 0;
                  (match = separator.exec(substring));

                )
                  var newEnd = match.index;
                result = result.slice(0, newEnd === undefined ? end : newEnd);
              }
            } else if (string.indexOf(baseToString(separator), end) != end) {
              var index = result.lastIndexOf(separator);
              index > -1 && (result = result.slice(0, index));
            }
            return result + omission;
          }
          function unescape(string) {
            return (
              (string = toString(string)),
              string && reHasEscapedHtml.test(string)
                ? string.replace(reEscapedHtml, unescapeHtmlChar)
                : string
            );
          }
          function words(string, pattern, guard) {
            return (
              (string = toString(string)),
              (pattern = guard ? undefined : pattern),
              pattern === undefined &&
                (pattern = reHasComplexWord.test(string)
                  ? reComplexWord
                  : reBasicWord),
              string.match(pattern) || []
            );
          }
          function cond(pairs) {
            var length = pairs ? pairs.length : 0,
              toIteratee = getIteratee();
            return (
              (pairs = length
                ? arrayMap(pairs, function(pair) {
                    if ("function" != typeof pair[1])
                      throw new TypeError(FUNC_ERROR_TEXT);
                    return [toIteratee(pair[0]), pair[1]];
                  })
                : []),
              rest(function(args) {
                for (var index = -1; ++index < length; ) {
                  var pair = pairs[index];
                  if (apply(pair[0], this, args))
                    return apply(pair[1], this, args);
                }
              })
            );
          }
          function conforms(source) {
            return baseConforms(baseClone(source, !0));
          }
          function constant(value) {
            return function() {
              return value;
            };
          }
          function identity(value) {
            return value;
          }
          function iteratee(func) {
            return baseIteratee(
              "function" == typeof func ? func : baseClone(func, !0)
            );
          }
          function matches(source) {
            return baseMatches(baseClone(source, !0));
          }
          function matchesProperty(path, srcValue) {
            return baseMatchesProperty(path, baseClone(srcValue, !0));
          }
          function mixin(object, source, options) {
            var props = keys(source),
              methodNames = baseFunctions(source, props);
            null != options ||
              (isObject(source) && (methodNames.length || !props.length)) ||
              ((options = source),
              (source = object),
              (object = this),
              (methodNames = baseFunctions(source, keys(source))));
            var chain = !(
                isObject(options) &&
                "chain" in options &&
                !options.chain
              ),
              isFunc = isFunction(object);
            return (
              arrayEach(methodNames, function(methodName) {
                var func = source[methodName];
                (object[methodName] = func),
                  isFunc &&
                    (object.prototype[methodName] = function() {
                      var chainAll = this.__chain__;
                      if (chain || chainAll) {
                        var result = object(this.__wrapped__),
                          actions = (result.__actions__ = copyArray(
                            this.__actions__
                          ));
                        return (
                          actions.push({
                            func: func,
                            args: arguments,
                            thisArg: object
                          }),
                          (result.__chain__ = chainAll),
                          result
                        );
                      }
                      return func.apply(
                        object,
                        arrayPush([this.value()], arguments)
                      );
                    });
              }),
              object
            );
          }
          function noConflict() {
            return root._ === this && (root._ = oldDash), this;
          }
          function noop() {}
          function nthArg(n) {
            return (
              (n = toInteger(n)),
              rest(function(args) {
                return baseNth(args, n);
              })
            );
          }
          function property(path) {
            return isKey(path)
              ? baseProperty(toKey(path))
              : basePropertyDeep(path);
          }
          function propertyOf(object) {
            return function(path) {
              return null == object ? undefined : baseGet(object, path);
            };
          }
          function stubArray() {
            return [];
          }
          function stubFalse() {
            return !1;
          }
          function stubObject() {
            return {};
          }
          function stubString() {
            return "";
          }
          function stubTrue() {
            return !0;
          }
          function times(n, iteratee) {
            if (((n = toInteger(n)), 1 > n || n > MAX_SAFE_INTEGER)) return [];
            var index = MAX_ARRAY_LENGTH,
              length = nativeMin(n, MAX_ARRAY_LENGTH);
            (iteratee = getIteratee(iteratee)), (n -= MAX_ARRAY_LENGTH);
            for (var result = baseTimes(length, iteratee); ++index < n; )
              iteratee(index);
            return result;
          }
          function toPath(value) {
            return isArray(value)
              ? arrayMap(value, toKey)
              : isSymbol(value)
              ? [value]
              : copyArray(stringToPath(value));
          }
          function uniqueId(prefix) {
            var id = ++idCounter;
            return toString(prefix) + id;
          }
          function max(array) {
            return array && array.length
              ? baseExtremum(array, identity, baseGt)
              : undefined;
          }
          function maxBy(array, iteratee) {
            return array && array.length
              ? baseExtremum(array, getIteratee(iteratee), baseGt)
              : undefined;
          }
          function mean(array) {
            return baseMean(array, identity);
          }
          function meanBy(array, iteratee) {
            return baseMean(array, getIteratee(iteratee));
          }
          function min(array) {
            return array && array.length
              ? baseExtremum(array, identity, baseLt)
              : undefined;
          }
          function minBy(array, iteratee) {
            return array && array.length
              ? baseExtremum(array, getIteratee(iteratee), baseLt)
              : undefined;
          }
          function sum(array) {
            return array && array.length ? baseSum(array, identity) : 0;
          }
          function sumBy(array, iteratee) {
            return array && array.length
              ? baseSum(array, getIteratee(iteratee))
              : 0;
          }
          context = context
            ? _.defaults({}, context, _.pick(root, contextProps))
            : root;
          var Date = context.Date,
            Error = context.Error,
            Math = context.Math,
            RegExp = context.RegExp,
            TypeError = context.TypeError,
            arrayProto = context.Array.prototype,
            objectProto = context.Object.prototype,
            stringProto = context.String.prototype,
            coreJsData = context["__core-js_shared__"],
            maskSrcKey = (function() {
              var uid = /[^.]+$/.exec(
                (coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO) ||
                  ""
              );
              return uid ? "Symbol(src)_1." + uid : "";
            })(),
            funcToString = context.Function.prototype.toString,
            hasOwnProperty = objectProto.hasOwnProperty,
            idCounter = 0,
            objectCtorString = funcToString.call(Object),
            objectToString = objectProto.toString,
            oldDash = root._,
            reIsNative = RegExp(
              "^" +
                funcToString
                  .call(hasOwnProperty)
                  .replace(reRegExpChar, "\\$&")
                  .replace(
                    /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
                    "$1.*?"
                  ) +
                "$"
            ),
            Buffer = moduleExports ? context.Buffer : undefined,
            Reflect = context.Reflect,
            Symbol = context.Symbol,
            Uint8Array = context.Uint8Array,
            enumerate = Reflect ? Reflect.enumerate : undefined,
            getOwnPropertySymbols = Object.getOwnPropertySymbols,
            iteratorSymbol =
              "symbol" == typeof (iteratorSymbol = Symbol && Symbol.iterator)
                ? iteratorSymbol
                : undefined,
            objectCreate = Object.create,
            propertyIsEnumerable = objectProto.propertyIsEnumerable,
            splice = arrayProto.splice,
            setTimeout = function(func, wait) {
              return context.setTimeout.call(root, func, wait);
            },
            nativeCeil = Math.ceil,
            nativeFloor = Math.floor,
            nativeGetPrototype = Object.getPrototypeOf,
            nativeIsFinite = context.isFinite,
            nativeJoin = arrayProto.join,
            nativeKeys = Object.keys,
            nativeMax = Math.max,
            nativeMin = Math.min,
            nativeParseInt = context.parseInt,
            nativeRandom = Math.random,
            nativeReplace = stringProto.replace,
            nativeReverse = arrayProto.reverse,
            nativeSplit = stringProto.split,
            DataView = getNative(context, "DataView"),
            Map = getNative(context, "Map"),
            Promise = getNative(context, "Promise"),
            Set = getNative(context, "Set"),
            WeakMap = getNative(context, "WeakMap"),
            nativeCreate = getNative(Object, "create"),
            metaMap = WeakMap && new WeakMap(),
            nonEnumShadows = !propertyIsEnumerable.call(
              { valueOf: 1 },
              "valueOf"
            ),
            realNames = {},
            dataViewCtorString = toSource(DataView),
            mapCtorString = toSource(Map),
            promiseCtorString = toSource(Promise),
            setCtorString = toSource(Set),
            weakMapCtorString = toSource(WeakMap),
            symbolProto = Symbol ? Symbol.prototype : undefined,
            symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
            symbolToString = symbolProto ? symbolProto.toString : undefined;
          (lodash.templateSettings = {
            escape: reEscape,
            evaluate: reEvaluate,
            interpolate: reInterpolate,
            variable: "",
            imports: { _: lodash }
          }),
            (lodash.prototype = baseLodash.prototype),
            (lodash.prototype.constructor = lodash),
            (LodashWrapper.prototype = baseCreate(baseLodash.prototype)),
            (LodashWrapper.prototype.constructor = LodashWrapper),
            (LazyWrapper.prototype = baseCreate(baseLodash.prototype)),
            (LazyWrapper.prototype.constructor = LazyWrapper),
            (Hash.prototype.clear = hashClear),
            (Hash.prototype["delete"] = hashDelete),
            (Hash.prototype.get = hashGet),
            (Hash.prototype.has = hashHas),
            (Hash.prototype.set = hashSet),
            (ListCache.prototype.clear = listCacheClear),
            (ListCache.prototype["delete"] = listCacheDelete),
            (ListCache.prototype.get = listCacheGet),
            (ListCache.prototype.has = listCacheHas),
            (ListCache.prototype.set = listCacheSet),
            (MapCache.prototype.clear = mapCacheClear),
            (MapCache.prototype["delete"] = mapCacheDelete),
            (MapCache.prototype.get = mapCacheGet),
            (MapCache.prototype.has = mapCacheHas),
            (MapCache.prototype.set = mapCacheSet),
            (SetCache.prototype.add = SetCache.prototype.push = setCacheAdd),
            (SetCache.prototype.has = setCacheHas),
            (Stack.prototype.clear = stackClear),
            (Stack.prototype["delete"] = stackDelete),
            (Stack.prototype.get = stackGet),
            (Stack.prototype.has = stackHas),
            (Stack.prototype.set = stackSet);
          var baseEach = createBaseEach(baseForOwn),
            baseEachRight = createBaseEach(baseForOwnRight, !0),
            baseFor = createBaseFor(),
            baseForRight = createBaseFor(!0);
          enumerate &&
            !propertyIsEnumerable.call({ valueOf: 1 }, "valueOf") &&
            (baseKeysIn = function(object) {
              return iteratorToArray(enumerate(object));
            });
          var baseSetData = metaMap
              ? function(func, data) {
                  return metaMap.set(func, data), func;
                }
              : identity,
            createSet =
              Set && 1 / setToArray(new Set([, -0]))[1] == INFINITY
                ? function(values) {
                    return new Set(values);
                  }
                : noop,
            getData = metaMap
              ? function(func) {
                  return metaMap.get(func);
                }
              : noop,
            getLength = baseProperty("length");
          getOwnPropertySymbols || (getSymbols = stubArray);
          var getSymbolsIn = getOwnPropertySymbols
            ? function(object) {
                for (var result = []; object; )
                  arrayPush(result, getSymbols(object)),
                    (object = getPrototype(object));
                return result;
              }
            : getSymbols;
          ((DataView &&
            getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
            (Map && getTag(new Map()) != mapTag) ||
            (Promise && getTag(Promise.resolve()) != promiseTag) ||
            (Set && getTag(new Set()) != setTag) ||
            (WeakMap && getTag(new WeakMap()) != weakMapTag)) &&
            (getTag = function(value) {
              var result = objectToString.call(value),
                Ctor = result == objectTag ? value.constructor : undefined,
                ctorString = Ctor ? toSource(Ctor) : undefined;
              if (ctorString)
                switch (ctorString) {
                  case dataViewCtorString:
                    return dataViewTag;
                  case mapCtorString:
                    return mapTag;
                  case promiseCtorString:
                    return promiseTag;
                  case setCtorString:
                    return setTag;
                  case weakMapCtorString:
                    return weakMapTag;
                }
              return result;
            });
          var isMaskable = coreJsData ? isFunction : stubFalse,
            setData = (function() {
              var count = 0,
                lastCalled = 0;
              return function(key, value) {
                var stamp = now(),
                  remaining = HOT_SPAN - (stamp - lastCalled);
                if (((lastCalled = stamp), remaining > 0)) {
                  if (++count >= HOT_COUNT) return key;
                } else count = 0;
                return baseSetData(key, value);
              };
            })(),
            stringToPath = memoize(function(string) {
              var result = [];
              return (
                toString(string).replace(rePropName, function(
                  match,
                  number,
                  quote,
                  string
                ) {
                  result.push(
                    quote ? string.replace(reEscapeChar, "$1") : number || match
                  );
                }),
                result
              );
            }),
            difference = rest(function(array, values) {
              return isArrayLikeObject(array)
                ? baseDifference(
                    array,
                    baseFlatten(values, 1, isArrayLikeObject, !0)
                  )
                : [];
            }),
            differenceBy = rest(function(array, values) {
              var iteratee = last(values);
              return (
                isArrayLikeObject(iteratee) && (iteratee = undefined),
                isArrayLikeObject(array)
                  ? baseDifference(
                      array,
                      baseFlatten(values, 1, isArrayLikeObject, !0),
                      getIteratee(iteratee)
                    )
                  : []
              );
            }),
            differenceWith = rest(function(array, values) {
              var comparator = last(values);
              return (
                isArrayLikeObject(comparator) && (comparator = undefined),
                isArrayLikeObject(array)
                  ? baseDifference(
                      array,
                      baseFlatten(values, 1, isArrayLikeObject, !0),
                      undefined,
                      comparator
                    )
                  : []
              );
            }),
            intersection = rest(function(arrays) {
              var mapped = arrayMap(arrays, castArrayLikeObject);
              return mapped.length && mapped[0] === arrays[0]
                ? baseIntersection(mapped)
                : [];
            }),
            intersectionBy = rest(function(arrays) {
              var iteratee = last(arrays),
                mapped = arrayMap(arrays, castArrayLikeObject);
              return (
                iteratee === last(mapped)
                  ? (iteratee = undefined)
                  : mapped.pop(),
                mapped.length && mapped[0] === arrays[0]
                  ? baseIntersection(mapped, getIteratee(iteratee))
                  : []
              );
            }),
            intersectionWith = rest(function(arrays) {
              var comparator = last(arrays),
                mapped = arrayMap(arrays, castArrayLikeObject);
              return (
                comparator === last(mapped)
                  ? (comparator = undefined)
                  : mapped.pop(),
                mapped.length && mapped[0] === arrays[0]
                  ? baseIntersection(mapped, undefined, comparator)
                  : []
              );
            }),
            pull = rest(pullAll),
            pullAt = rest(function(array, indexes) {
              indexes = baseFlatten(indexes, 1);
              var length = array ? array.length : 0,
                result = baseAt(array, indexes);
              return (
                basePullAt(
                  array,
                  arrayMap(indexes, function(index) {
                    return isIndex(index, length) ? +index : index;
                  }).sort(compareAscending)
                ),
                result
              );
            }),
            union = rest(function(arrays) {
              return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, !0));
            }),
            unionBy = rest(function(arrays) {
              var iteratee = last(arrays);
              return (
                isArrayLikeObject(iteratee) && (iteratee = undefined),
                baseUniq(
                  baseFlatten(arrays, 1, isArrayLikeObject, !0),
                  getIteratee(iteratee)
                )
              );
            }),
            unionWith = rest(function(arrays) {
              var comparator = last(arrays);
              return (
                isArrayLikeObject(comparator) && (comparator = undefined),
                baseUniq(
                  baseFlatten(arrays, 1, isArrayLikeObject, !0),
                  undefined,
                  comparator
                )
              );
            }),
            without = rest(function(array, values) {
              return isArrayLikeObject(array)
                ? baseDifference(array, values)
                : [];
            }),
            xor = rest(function(arrays) {
              return baseXor(arrayFilter(arrays, isArrayLikeObject));
            }),
            xorBy = rest(function(arrays) {
              var iteratee = last(arrays);
              return (
                isArrayLikeObject(iteratee) && (iteratee = undefined),
                baseXor(
                  arrayFilter(arrays, isArrayLikeObject),
                  getIteratee(iteratee)
                )
              );
            }),
            xorWith = rest(function(arrays) {
              var comparator = last(arrays);
              return (
                isArrayLikeObject(comparator) && (comparator = undefined),
                baseXor(
                  arrayFilter(arrays, isArrayLikeObject),
                  undefined,
                  comparator
                )
              );
            }),
            zip = rest(unzip),
            zipWith = rest(function(arrays) {
              var length = arrays.length,
                iteratee = length > 1 ? arrays[length - 1] : undefined;
              return (
                (iteratee =
                  "function" == typeof iteratee
                    ? (arrays.pop(), iteratee)
                    : undefined),
                unzipWith(arrays, iteratee)
              );
            }),
            wrapperAt = rest(function(paths) {
              paths = baseFlatten(paths, 1);
              var length = paths.length,
                start = length ? paths[0] : 0,
                value = this.__wrapped__,
                interceptor = function(object) {
                  return baseAt(object, paths);
                };
              return !(length > 1 || this.__actions__.length) &&
                value instanceof LazyWrapper &&
                isIndex(start)
                ? ((value = value.slice(start, +start + (length ? 1 : 0))),
                  value.__actions__.push({
                    func: thru,
                    args: [interceptor],
                    thisArg: undefined
                  }),
                  new LodashWrapper(value, this.__chain__).thru(function(
                    array
                  ) {
                    return (
                      length && !array.length && array.push(undefined), array
                    );
                  }))
                : this.thru(interceptor);
            }),
            countBy = createAggregator(function(result, value, key) {
              hasOwnProperty.call(result, key)
                ? ++result[key]
                : (result[key] = 1);
            }),
            find = createFind(findIndex),
            findLast = createFind(findLastIndex),
            groupBy = createAggregator(function(result, value, key) {
              hasOwnProperty.call(result, key)
                ? result[key].push(value)
                : (result[key] = [value]);
            }),
            invokeMap = rest(function(collection, path, args) {
              var index = -1,
                isFunc = "function" == typeof path,
                isProp = isKey(path),
                result = isArrayLike(collection)
                  ? Array(collection.length)
                  : [];
              return (
                baseEach(collection, function(value) {
                  var func = isFunc
                    ? path
                    : isProp && null != value
                    ? value[path]
                    : undefined;
                  result[++index] = func
                    ? apply(func, value, args)
                    : baseInvoke(value, path, args);
                }),
                result
              );
            }),
            keyBy = createAggregator(function(result, value, key) {
              result[key] = value;
            }),
            partition = createAggregator(
              function(result, value, key) {
                result[key ? 0 : 1].push(value);
              },
              function() {
                return [[], []];
              }
            ),
            sortBy = rest(function(collection, iteratees) {
              if (null == collection) return [];
              var length = iteratees.length;
              return (
                length > 1 &&
                isIterateeCall(collection, iteratees[0], iteratees[1])
                  ? (iteratees = [])
                  : length > 2 &&
                    isIterateeCall(iteratees[0], iteratees[1], iteratees[2]) &&
                    (iteratees = [iteratees[0]]),
                (iteratees =
                  1 == iteratees.length && isArray(iteratees[0])
                    ? iteratees[0]
                    : baseFlatten(iteratees, 1, isFlattenableIteratee)),
                baseOrderBy(collection, iteratees, [])
              );
            }),
            bind = rest(function(func, thisArg, partials) {
              var bitmask = BIND_FLAG;
              if (partials.length) {
                var holders = replaceHolders(partials, getHolder(bind));
                bitmask |= PARTIAL_FLAG;
              }
              return createWrapper(func, bitmask, thisArg, partials, holders);
            }),
            bindKey = rest(function(object, key, partials) {
              var bitmask = BIND_FLAG | BIND_KEY_FLAG;
              if (partials.length) {
                var holders = replaceHolders(partials, getHolder(bindKey));
                bitmask |= PARTIAL_FLAG;
              }
              return createWrapper(key, bitmask, object, partials, holders);
            }),
            defer = rest(function(func, args) {
              return baseDelay(func, 1, args);
            }),
            delay = rest(function(func, wait, args) {
              return baseDelay(func, toNumber(wait) || 0, args);
            });
          memoize.Cache = MapCache;
          var overArgs = rest(function(func, transforms) {
              transforms =
                1 == transforms.length && isArray(transforms[0])
                  ? arrayMap(transforms[0], baseUnary(getIteratee()))
                  : arrayMap(
                      baseFlatten(transforms, 1, isFlattenableIteratee),
                      baseUnary(getIteratee())
                    );
              var funcsLength = transforms.length;
              return rest(function(args) {
                for (
                  var index = -1, length = nativeMin(args.length, funcsLength);
                  ++index < length;

                )
                  args[index] = transforms[index].call(this, args[index]);
                return apply(func, this, args);
              });
            }),
            partial = rest(function(func, partials) {
              var holders = replaceHolders(partials, getHolder(partial));
              return createWrapper(
                func,
                PARTIAL_FLAG,
                undefined,
                partials,
                holders
              );
            }),
            partialRight = rest(function(func, partials) {
              var holders = replaceHolders(partials, getHolder(partialRight));
              return createWrapper(
                func,
                PARTIAL_RIGHT_FLAG,
                undefined,
                partials,
                holders
              );
            }),
            rearg = rest(function(func, indexes) {
              return createWrapper(
                func,
                REARG_FLAG,
                undefined,
                undefined,
                undefined,
                baseFlatten(indexes, 1)
              );
            }),
            gt = createRelationalOperation(baseGt),
            gte = createRelationalOperation(function(value, other) {
              return value >= other;
            }),
            isArray = Array.isArray,
            isBuffer = Buffer
              ? function(value) {
                  return value instanceof Buffer;
                }
              : stubFalse,
            lt = createRelationalOperation(baseLt),
            lte = createRelationalOperation(function(value, other) {
              return other >= value;
            }),
            assign = createAssigner(function(object, source) {
              if (nonEnumShadows || isPrototype(source) || isArrayLike(source))
                return copyObject(source, keys(source), object), void 0;
              for (var key in source)
                hasOwnProperty.call(source, key) &&
                  assignValue(object, key, source[key]);
            }),
            assignIn = createAssigner(function(object, source) {
              if (nonEnumShadows || isPrototype(source) || isArrayLike(source))
                return copyObject(source, keysIn(source), object), void 0;
              for (var key in source) assignValue(object, key, source[key]);
            }),
            assignInWith = createAssigner(function(
              object,
              source,
              srcIndex,
              customizer
            ) {
              copyObject(source, keysIn(source), object, customizer);
            }),
            assignWith = createAssigner(function(
              object,
              source,
              srcIndex,
              customizer
            ) {
              copyObject(source, keys(source), object, customizer);
            }),
            at = rest(function(object, paths) {
              return baseAt(object, baseFlatten(paths, 1));
            }),
            defaults = rest(function(args) {
              return (
                args.push(undefined, assignInDefaults),
                apply(assignInWith, undefined, args)
              );
            }),
            defaultsDeep = rest(function(args) {
              return (
                args.push(undefined, mergeDefaults),
                apply(mergeWith, undefined, args)
              );
            }),
            invert = createInverter(function(result, value, key) {
              result[value] = key;
            }, constant(identity)),
            invertBy = createInverter(function(result, value, key) {
              hasOwnProperty.call(result, value)
                ? result[value].push(key)
                : (result[value] = [key]);
            }, getIteratee),
            invoke = rest(baseInvoke),
            merge = createAssigner(function(object, source, srcIndex) {
              baseMerge(object, source, srcIndex);
            }),
            mergeWith = createAssigner(function(
              object,
              source,
              srcIndex,
              customizer
            ) {
              baseMerge(object, source, srcIndex, customizer);
            }),
            omit = rest(function(object, props) {
              return null == object
                ? {}
                : ((props = arrayMap(baseFlatten(props, 1), toKey)),
                  basePick(
                    object,
                    baseDifference(getAllKeysIn(object), props)
                  ));
            }),
            pick = rest(function(object, props) {
              return null == object
                ? {}
                : basePick(object, arrayMap(baseFlatten(props, 1), toKey));
            }),
            toPairs = createToPairs(keys),
            toPairsIn = createToPairs(keysIn),
            camelCase = createCompounder(function(result, word, index) {
              return (
                (word = word.toLowerCase()),
                result + (index ? capitalize(word) : word)
              );
            }),
            kebabCase = createCompounder(function(result, word, index) {
              return result + (index ? "-" : "") + word.toLowerCase();
            }),
            lowerCase = createCompounder(function(result, word, index) {
              return result + (index ? " " : "") + word.toLowerCase();
            }),
            lowerFirst = createCaseFirst("toLowerCase"),
            snakeCase = createCompounder(function(result, word, index) {
              return result + (index ? "_" : "") + word.toLowerCase();
            }),
            startCase = createCompounder(function(result, word, index) {
              return result + (index ? " " : "") + upperFirst(word);
            }),
            upperCase = createCompounder(function(result, word, index) {
              return result + (index ? " " : "") + word.toUpperCase();
            }),
            upperFirst = createCaseFirst("toUpperCase"),
            attempt = rest(function(func, args) {
              try {
                return apply(func, undefined, args);
              } catch (e) {
                return isError(e) ? e : new Error(e);
              }
            }),
            bindAll = rest(function(object, methodNames) {
              return (
                arrayEach(baseFlatten(methodNames, 1), function(key) {
                  (key = toKey(key)), (object[key] = bind(object[key], object));
                }),
                object
              );
            }),
            flow = createFlow(),
            flowRight = createFlow(!0),
            method = rest(function(path, args) {
              return function(object) {
                return baseInvoke(object, path, args);
              };
            }),
            methodOf = rest(function(object, args) {
              return function(path) {
                return baseInvoke(object, path, args);
              };
            }),
            over = createOver(arrayMap),
            overEvery = createOver(arrayEvery),
            overSome = createOver(arraySome),
            range = createRange(),
            rangeRight = createRange(!0),
            add = createMathOperation(function(augend, addend) {
              return augend + addend;
            }),
            ceil = createRound("ceil"),
            divide = createMathOperation(function(dividend, divisor) {
              return dividend / divisor;
            }),
            floor = createRound("floor"),
            multiply = createMathOperation(function(multiplier, multiplicand) {
              return multiplier * multiplicand;
            }),
            round = createRound("round"),
            subtract = createMathOperation(function(minuend, subtrahend) {
              return minuend - subtrahend;
            });
          return (
            (lodash.after = after),
            (lodash.ary = ary),
            (lodash.assign = assign),
            (lodash.assignIn = assignIn),
            (lodash.assignInWith = assignInWith),
            (lodash.assignWith = assignWith),
            (lodash.at = at),
            (lodash.before = before),
            (lodash.bind = bind),
            (lodash.bindAll = bindAll),
            (lodash.bindKey = bindKey),
            (lodash.castArray = castArray),
            (lodash.chain = chain),
            (lodash.chunk = chunk),
            (lodash.compact = compact),
            (lodash.concat = concat),
            (lodash.cond = cond),
            (lodash.conforms = conforms),
            (lodash.constant = constant),
            (lodash.countBy = countBy),
            (lodash.create = create),
            (lodash.curry = curry),
            (lodash.curryRight = curryRight),
            (lodash.debounce = debounce),
            (lodash.defaults = defaults),
            (lodash.defaultsDeep = defaultsDeep),
            (lodash.defer = defer),
            (lodash.delay = delay),
            (lodash.difference = difference),
            (lodash.differenceBy = differenceBy),
            (lodash.differenceWith = differenceWith),
            (lodash.drop = drop),
            (lodash.dropRight = dropRight),
            (lodash.dropRightWhile = dropRightWhile),
            (lodash.dropWhile = dropWhile),
            (lodash.fill = fill),
            (lodash.filter = filter),
            (lodash.flatMap = flatMap),
            (lodash.flatMapDeep = flatMapDeep),
            (lodash.flatMapDepth = flatMapDepth),
            (lodash.flatten = flatten),
            (lodash.flattenDeep = flattenDeep),
            (lodash.flattenDepth = flattenDepth),
            (lodash.flip = flip),
            (lodash.flow = flow),
            (lodash.flowRight = flowRight),
            (lodash.fromPairs = fromPairs),
            (lodash.functions = functions),
            (lodash.functionsIn = functionsIn),
            (lodash.groupBy = groupBy),
            (lodash.initial = initial),
            (lodash.intersection = intersection),
            (lodash.intersectionBy = intersectionBy),
            (lodash.intersectionWith = intersectionWith),
            (lodash.invert = invert),
            (lodash.invertBy = invertBy),
            (lodash.invokeMap = invokeMap),
            (lodash.iteratee = iteratee),
            (lodash.keyBy = keyBy),
            (lodash.keys = keys),
            (lodash.keysIn = keysIn),
            (lodash.map = map),
            (lodash.mapKeys = mapKeys),
            (lodash.mapValues = mapValues),
            (lodash.matches = matches),
            (lodash.matchesProperty = matchesProperty),
            (lodash.memoize = memoize),
            (lodash.merge = merge),
            (lodash.mergeWith = mergeWith),
            (lodash.method = method),
            (lodash.methodOf = methodOf),
            (lodash.mixin = mixin),
            (lodash.negate = negate),
            (lodash.nthArg = nthArg),
            (lodash.omit = omit),
            (lodash.omitBy = omitBy),
            (lodash.once = once),
            (lodash.orderBy = orderBy),
            (lodash.over = over),
            (lodash.overArgs = overArgs),
            (lodash.overEvery = overEvery),
            (lodash.overSome = overSome),
            (lodash.partial = partial),
            (lodash.partialRight = partialRight),
            (lodash.partition = partition),
            (lodash.pick = pick),
            (lodash.pickBy = pickBy),
            (lodash.property = property),
            (lodash.propertyOf = propertyOf),
            (lodash.pull = pull),
            (lodash.pullAll = pullAll),
            (lodash.pullAllBy = pullAllBy),
            (lodash.pullAllWith = pullAllWith),
            (lodash.pullAt = pullAt),
            (lodash.range = range),
            (lodash.rangeRight = rangeRight),
            (lodash.rearg = rearg),
            (lodash.reject = reject),
            (lodash.remove = remove),
            (lodash.rest = rest),
            (lodash.reverse = reverse),
            (lodash.sampleSize = sampleSize),
            (lodash.set = set),
            (lodash.setWith = setWith),
            (lodash.shuffle = shuffle),
            (lodash.slice = slice),
            (lodash.sortBy = sortBy),
            (lodash.sortedUniq = sortedUniq),
            (lodash.sortedUniqBy = sortedUniqBy),
            (lodash.split = split),
            (lodash.spread = spread),
            (lodash.tail = tail),
            (lodash.take = take),
            (lodash.takeRight = takeRight),
            (lodash.takeRightWhile = takeRightWhile),
            (lodash.takeWhile = takeWhile),
            (lodash.tap = tap),
            (lodash.throttle = throttle),
            (lodash.thru = thru),
            (lodash.toArray = toArray),
            (lodash.toPairs = toPairs),
            (lodash.toPairsIn = toPairsIn),
            (lodash.toPath = toPath),
            (lodash.toPlainObject = toPlainObject),
            (lodash.transform = transform),
            (lodash.unary = unary),
            (lodash.union = union),
            (lodash.unionBy = unionBy),
            (lodash.unionWith = unionWith),
            (lodash.uniq = uniq),
            (lodash.uniqBy = uniqBy),
            (lodash.uniqWith = uniqWith),
            (lodash.unset = unset),
            (lodash.unzip = unzip),
            (lodash.unzipWith = unzipWith),
            (lodash.update = update),
            (lodash.updateWith = updateWith),
            (lodash.values = values),
            (lodash.valuesIn = valuesIn),
            (lodash.without = without),
            (lodash.words = words),
            (lodash.wrap = wrap),
            (lodash.xor = xor),
            (lodash.xorBy = xorBy),
            (lodash.xorWith = xorWith),
            (lodash.zip = zip),
            (lodash.zipObject = zipObject),
            (lodash.zipObjectDeep = zipObjectDeep),
            (lodash.zipWith = zipWith),
            (lodash.entries = toPairs),
            (lodash.entriesIn = toPairsIn),
            (lodash.extend = assignIn),
            (lodash.extendWith = assignInWith),
            mixin(lodash, lodash),
            (lodash.add = add),
            (lodash.attempt = attempt),
            (lodash.camelCase = camelCase),
            (lodash.capitalize = capitalize),
            (lodash.ceil = ceil),
            (lodash.clamp = clamp),
            (lodash.clone = clone),
            (lodash.cloneDeep = cloneDeep),
            (lodash.cloneDeepWith = cloneDeepWith),
            (lodash.cloneWith = cloneWith),
            (lodash.deburr = deburr),
            (lodash.divide = divide),
            (lodash.endsWith = endsWith),
            (lodash.eq = eq),
            (lodash.escape = escape),
            (lodash.escapeRegExp = escapeRegExp),
            (lodash.every = every),
            (lodash.find = find),
            (lodash.findIndex = findIndex),
            (lodash.findKey = findKey),
            (lodash.findLast = findLast),
            (lodash.findLastIndex = findLastIndex),
            (lodash.findLastKey = findLastKey),
            (lodash.floor = floor),
            (lodash.forEach = forEach),
            (lodash.forEachRight = forEachRight),
            (lodash.forIn = forIn),
            (lodash.forInRight = forInRight),
            (lodash.forOwn = forOwn),
            (lodash.forOwnRight = forOwnRight),
            (lodash.get = get),
            (lodash.gt = gt),
            (lodash.gte = gte),
            (lodash.has = has),
            (lodash.hasIn = hasIn),
            (lodash.head = head),
            (lodash.identity = identity),
            (lodash.includes = includes),
            (lodash.indexOf = indexOf),
            (lodash.inRange = inRange),
            (lodash.invoke = invoke),
            (lodash.isArguments = isArguments),
            (lodash.isArray = isArray),
            (lodash.isArrayBuffer = isArrayBuffer),
            (lodash.isArrayLike = isArrayLike),
            (lodash.isArrayLikeObject = isArrayLikeObject),
            (lodash.isBoolean = isBoolean),
            (lodash.isBuffer = isBuffer),
            (lodash.isDate = isDate),
            (lodash.isElement = isElement),
            (lodash.isEmpty = isEmpty),
            (lodash.isEqual = isEqual),
            (lodash.isEqualWith = isEqualWith),
            (lodash.isError = isError),
            (lodash.isFinite = isFinite),
            (lodash.isFunction = isFunction),
            (lodash.isInteger = isInteger),
            (lodash.isLength = isLength),
            (lodash.isMap = isMap),
            (lodash.isMatch = isMatch),
            (lodash.isMatchWith = isMatchWith),
            (lodash.isNaN = isNaN),
            (lodash.isNative = isNative),
            (lodash.isNil = isNil),
            (lodash.isNull = isNull),
            (lodash.isNumber = isNumber),
            (lodash.isObject = isObject),
            (lodash.isObjectLike = isObjectLike),
            (lodash.isPlainObject = isPlainObject),
            (lodash.isRegExp = isRegExp),
            (lodash.isSafeInteger = isSafeInteger),
            (lodash.isSet = isSet),
            (lodash.isString = isString),
            (lodash.isSymbol = isSymbol),
            (lodash.isTypedArray = isTypedArray),
            (lodash.isUndefined = isUndefined),
            (lodash.isWeakMap = isWeakMap),
            (lodash.isWeakSet = isWeakSet),
            (lodash.join = join),
            (lodash.kebabCase = kebabCase),
            (lodash.last = last),
            (lodash.lastIndexOf = lastIndexOf),
            (lodash.lowerCase = lowerCase),
            (lodash.lowerFirst = lowerFirst),
            (lodash.lt = lt),
            (lodash.lte = lte),
            (lodash.max = max),
            (lodash.maxBy = maxBy),
            (lodash.mean = mean),
            (lodash.meanBy = meanBy),
            (lodash.min = min),
            (lodash.minBy = minBy),
            (lodash.stubArray = stubArray),
            (lodash.stubFalse = stubFalse),
            (lodash.stubObject = stubObject),
            (lodash.stubString = stubString),
            (lodash.stubTrue = stubTrue),
            (lodash.multiply = multiply),
            (lodash.nth = nth),
            (lodash.noConflict = noConflict),
            (lodash.noop = noop),
            (lodash.now = now),
            (lodash.pad = pad),
            (lodash.padEnd = padEnd),
            (lodash.padStart = padStart),
            (lodash.parseInt = parseInt),
            (lodash.random = random),
            (lodash.reduce = reduce),
            (lodash.reduceRight = reduceRight),
            (lodash.repeat = repeat),
            (lodash.replace = replace),
            (lodash.result = result),
            (lodash.round = round),
            (lodash.runInContext = runInContext),
            (lodash.sample = sample),
            (lodash.size = size),
            (lodash.snakeCase = snakeCase),
            (lodash.some = some),
            (lodash.sortedIndex = sortedIndex),
            (lodash.sortedIndexBy = sortedIndexBy),
            (lodash.sortedIndexOf = sortedIndexOf),
            (lodash.sortedLastIndex = sortedLastIndex),
            (lodash.sortedLastIndexBy = sortedLastIndexBy),
            (lodash.sortedLastIndexOf = sortedLastIndexOf),
            (lodash.startCase = startCase),
            (lodash.startsWith = startsWith),
            (lodash.subtract = subtract),
            (lodash.sum = sum),
            (lodash.sumBy = sumBy),
            (lodash.template = template),
            (lodash.times = times),
            (lodash.toFinite = toFinite),
            (lodash.toInteger = toInteger),
            (lodash.toLength = toLength),
            (lodash.toLower = toLower),
            (lodash.toNumber = toNumber),
            (lodash.toSafeInteger = toSafeInteger),
            (lodash.toString = toString),
            (lodash.toUpper = toUpper),
            (lodash.trim = trim),
            (lodash.trimEnd = trimEnd),
            (lodash.trimStart = trimStart),
            (lodash.truncate = truncate),
            (lodash.unescape = unescape),
            (lodash.uniqueId = uniqueId),
            (lodash.upperCase = upperCase),
            (lodash.upperFirst = upperFirst),
            (lodash.each = forEach),
            (lodash.eachRight = forEachRight),
            (lodash.first = head),
            mixin(
              lodash,
              (function() {
                var source = {};
                return (
                  baseForOwn(lodash, function(func, methodName) {
                    hasOwnProperty.call(lodash.prototype, methodName) ||
                      (source[methodName] = func);
                  }),
                  source
                );
              })(),
              { chain: !1 }
            ),
            (lodash.VERSION = VERSION),
            arrayEach(
              [
                "bind",
                "bindKey",
                "curry",
                "curryRight",
                "partial",
                "partialRight"
              ],
              function(methodName) {
                lodash[methodName].placeholder = lodash;
              }
            ),
            arrayEach(["drop", "take"], function(methodName, index) {
              (LazyWrapper.prototype[methodName] = function(n) {
                var filtered = this.__filtered__;
                if (filtered && !index) return new LazyWrapper(this);
                n = n === undefined ? 1 : nativeMax(toInteger(n), 0);
                var result = this.clone();
                return (
                  filtered
                    ? (result.__takeCount__ = nativeMin(
                        n,
                        result.__takeCount__
                      ))
                    : result.__views__.push({
                        size: nativeMin(n, MAX_ARRAY_LENGTH),
                        type: methodName + (result.__dir__ < 0 ? "Right" : "")
                      }),
                  result
                );
              }),
                (LazyWrapper.prototype[methodName + "Right"] = function(n) {
                  return this.reverse()
                    [methodName](n)
                    .reverse();
                });
            }),
            arrayEach(["filter", "map", "takeWhile"], function(
              methodName,
              index
            ) {
              var type = index + 1,
                isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;
              LazyWrapper.prototype[methodName] = function(iteratee) {
                var result = this.clone();
                return (
                  result.__iteratees__.push({
                    iteratee: getIteratee(iteratee, 3),
                    type: type
                  }),
                  (result.__filtered__ = result.__filtered__ || isFilter),
                  result
                );
              };
            }),
            arrayEach(["head", "last"], function(methodName, index) {
              var takeName = "take" + (index ? "Right" : "");
              LazyWrapper.prototype[methodName] = function() {
                return this[takeName](1).value()[0];
              };
            }),
            arrayEach(["initial", "tail"], function(methodName, index) {
              var dropName = "drop" + (index ? "" : "Right");
              LazyWrapper.prototype[methodName] = function() {
                return this.__filtered__
                  ? new LazyWrapper(this)
                  : this[dropName](1);
              };
            }),
            (LazyWrapper.prototype.compact = function() {
              return this.filter(identity);
            }),
            (LazyWrapper.prototype.find = function(predicate) {
              return this.filter(predicate).head();
            }),
            (LazyWrapper.prototype.findLast = function(predicate) {
              return this.reverse().find(predicate);
            }),
            (LazyWrapper.prototype.invokeMap = rest(function(path, args) {
              return "function" == typeof path
                ? new LazyWrapper(this)
                : this.map(function(value) {
                    return baseInvoke(value, path, args);
                  });
            })),
            (LazyWrapper.prototype.reject = function(predicate) {
              return (
                (predicate = getIteratee(predicate, 3)),
                this.filter(function(value) {
                  return !predicate(value);
                })
              );
            }),
            (LazyWrapper.prototype.slice = function(start, end) {
              start = toInteger(start);
              var result = this;
              return result.__filtered__ && (start > 0 || 0 > end)
                ? new LazyWrapper(result)
                : (0 > start
                    ? (result = result.takeRight(-start))
                    : start && (result = result.drop(start)),
                  end !== undefined &&
                    ((end = toInteger(end)),
                    (result =
                      0 > end
                        ? result.dropRight(-end)
                        : result.take(end - start))),
                  result);
            }),
            (LazyWrapper.prototype.takeRightWhile = function(predicate) {
              return this.reverse()
                .takeWhile(predicate)
                .reverse();
            }),
            (LazyWrapper.prototype.toArray = function() {
              return this.take(MAX_ARRAY_LENGTH);
            }),
            baseForOwn(LazyWrapper.prototype, function(func, methodName) {
              var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(
                  methodName
                ),
                isTaker = /^(?:head|last)$/.test(methodName),
                lodashFunc =
                  lodash[
                    isTaker
                      ? "take" + ("last" == methodName ? "Right" : "")
                      : methodName
                  ],
                retUnwrapped = isTaker || /^find/.test(methodName);
              lodashFunc &&
                (lodash.prototype[methodName] = function() {
                  var value = this.__wrapped__,
                    args = isTaker ? [1] : arguments,
                    isLazy = value instanceof LazyWrapper,
                    iteratee = args[0],
                    useLazy = isLazy || isArray(value),
                    interceptor = function(value) {
                      var result = lodashFunc.apply(
                        lodash,
                        arrayPush([value], args)
                      );
                      return isTaker && chainAll ? result[0] : result;
                    };
                  useLazy &&
                    checkIteratee &&
                    "function" == typeof iteratee &&
                    1 != iteratee.length &&
                    (isLazy = useLazy = !1);
                  var chainAll = this.__chain__,
                    isHybrid = !!this.__actions__.length,
                    isUnwrapped = retUnwrapped && !chainAll,
                    onlyLazy = isLazy && !isHybrid;
                  if (!retUnwrapped && useLazy) {
                    value = onlyLazy ? value : new LazyWrapper(this);
                    var result = func.apply(value, args);
                    return (
                      result.__actions__.push({
                        func: thru,
                        args: [interceptor],
                        thisArg: undefined
                      }),
                      new LodashWrapper(result, chainAll)
                    );
                  }
                  return isUnwrapped && onlyLazy
                    ? func.apply(this, args)
                    : ((result = this.thru(interceptor)),
                      isUnwrapped
                        ? isTaker
                          ? result.value()[0]
                          : result.value()
                        : result);
                });
            }),
            arrayEach(
              ["pop", "push", "shift", "sort", "splice", "unshift"],
              function(methodName) {
                var func = arrayProto[methodName],
                  chainName = /^(?:push|sort|unshift)$/.test(methodName)
                    ? "tap"
                    : "thru",
                  retUnwrapped = /^(?:pop|shift)$/.test(methodName);
                lodash.prototype[methodName] = function() {
                  var args = arguments;
                  if (retUnwrapped && !this.__chain__) {
                    var value = this.value();
                    return func.apply(isArray(value) ? value : [], args);
                  }
                  return this[chainName](function(value) {
                    return func.apply(isArray(value) ? value : [], args);
                  });
                };
              }
            ),
            baseForOwn(LazyWrapper.prototype, function(func, methodName) {
              var lodashFunc = lodash[methodName];
              if (lodashFunc) {
                var key = lodashFunc.name + "",
                  names = realNames[key] || (realNames[key] = []);
                names.push({ name: methodName, func: lodashFunc });
              }
            }),
            (realNames[createHybridWrapper(undefined, BIND_KEY_FLAG).name] = [
              { name: "wrapper", func: undefined }
            ]),
            (LazyWrapper.prototype.clone = lazyClone),
            (LazyWrapper.prototype.reverse = lazyReverse),
            (LazyWrapper.prototype.value = lazyValue),
            (lodash.prototype.at = wrapperAt),
            (lodash.prototype.chain = wrapperChain),
            (lodash.prototype.commit = wrapperCommit),
            (lodash.prototype.next = wrapperNext),
            (lodash.prototype.plant = wrapperPlant),
            (lodash.prototype.reverse = wrapperReverse),
            (lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue),
            iteratorSymbol &&
              (lodash.prototype[iteratorSymbol] = wrapperToIterator),
            lodash
          );
        }
        var undefined,
          VERSION = "4.13.1",
          LARGE_ARRAY_SIZE = 200,
          FUNC_ERROR_TEXT = "Expected a function",
          HASH_UNDEFINED = "__lodash_hash_undefined__",
          PLACEHOLDER = "__lodash_placeholder__",
          BIND_FLAG = 1,
          BIND_KEY_FLAG = 2,
          CURRY_BOUND_FLAG = 4,
          CURRY_FLAG = 8,
          CURRY_RIGHT_FLAG = 16,
          PARTIAL_FLAG = 32,
          PARTIAL_RIGHT_FLAG = 64,
          ARY_FLAG = 128,
          REARG_FLAG = 256,
          FLIP_FLAG = 512,
          UNORDERED_COMPARE_FLAG = 1,
          PARTIAL_COMPARE_FLAG = 2,
          DEFAULT_TRUNC_LENGTH = 30,
          DEFAULT_TRUNC_OMISSION = "...",
          HOT_COUNT = 150,
          HOT_SPAN = 16,
          LAZY_FILTER_FLAG = 1,
          LAZY_MAP_FLAG = 2,
          LAZY_WHILE_FLAG = 3,
          INFINITY = 1 / 0,
          MAX_SAFE_INTEGER = 9007199254740991,
          MAX_INTEGER = 1.7976931348623157e308,
          NAN = 0 / 0,
          MAX_ARRAY_LENGTH = 4294967295,
          MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
          HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1,
          argsTag = "[object Arguments]",
          arrayTag = "[object Array]",
          boolTag = "[object Boolean]",
          dateTag = "[object Date]",
          errorTag = "[object Error]",
          funcTag = "[object Function]",
          genTag = "[object GeneratorFunction]",
          mapTag = "[object Map]",
          numberTag = "[object Number]",
          objectTag = "[object Object]",
          promiseTag = "[object Promise]",
          regexpTag = "[object RegExp]",
          setTag = "[object Set]",
          stringTag = "[object String]",
          symbolTag = "[object Symbol]",
          weakMapTag = "[object WeakMap]",
          weakSetTag = "[object WeakSet]",
          arrayBufferTag = "[object ArrayBuffer]",
          dataViewTag = "[object DataView]",
          float32Tag = "[object Float32Array]",
          float64Tag = "[object Float64Array]",
          int8Tag = "[object Int8Array]",
          int16Tag = "[object Int16Array]",
          int32Tag = "[object Int32Array]",
          uint8Tag = "[object Uint8Array]",
          uint8ClampedTag = "[object Uint8ClampedArray]",
          uint16Tag = "[object Uint16Array]",
          uint32Tag = "[object Uint32Array]",
          reEmptyStringLeading = /\b__p \+= '';/g,
          reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
          reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g,
          reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g,
          reUnescapedHtml = /[&<>"'`]/g,
          reHasEscapedHtml = RegExp(reEscapedHtml.source),
          reHasUnescapedHtml = RegExp(reUnescapedHtml.source),
          reEscape = /<%-([\s\S]+?)%>/g,
          reEvaluate = /<%([\s\S]+?)%>/g,
          reInterpolate = /<%=([\s\S]+?)%>/g,
          reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
          reIsPlainProp = /^\w*$/,
          rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(\.|\[\])(?:\4|$))/g,
          reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
          reHasRegExpChar = RegExp(reRegExpChar.source),
          reTrim = /^\s+|\s+$/g,
          reTrimStart = /^\s+/,
          reTrimEnd = /\s+$/,
          reBasicWord = /[a-zA-Z0-9]+/g,
          reEscapeChar = /\\(\\)?/g,
          reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
          reFlags = /\w*$/,
          reHasHexPrefix = /^0x/i,
          reIsBadHex = /^[-+]0x[0-9a-f]+$/i,
          reIsBinary = /^0b[01]+$/i,
          reIsHostCtor = /^\[object .+?Constructor\]$/,
          reIsOctal = /^0o[0-7]+$/i,
          reIsUint = /^(?:0|[1-9]\d*)$/,
          reLatin1 = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g,
          reNoMatch = /($^)/,
          reUnescapedString = /['\n\r\u2028\u2029\\]/g,
          rsAstralRange = "\\ud800-\\udfff",
          rsComboMarksRange = "\\u0300-\\u036f\\ufe20-\\ufe23",
          rsComboSymbolsRange = "\\u20d0-\\u20f0",
          rsDingbatRange = "\\u2700-\\u27bf",
          rsLowerRange = "a-z\\xdf-\\xf6\\xf8-\\xff",
          rsMathOpRange = "\\xac\\xb1\\xd7\\xf7",
          rsNonCharRange = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf",
          rsPunctuationRange = "\\u2000-\\u206f",
          rsSpaceRange =
            " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",
          rsUpperRange = "A-Z\\xc0-\\xd6\\xd8-\\xde",
          rsVarRange = "\\ufe0e\\ufe0f",
          rsBreakRange =
            rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange,
          rsApos = "['’]",
          rsAstral = "[" + rsAstralRange + "]",
          rsBreak = "[" + rsBreakRange + "]",
          rsCombo = "[" + rsComboMarksRange + rsComboSymbolsRange + "]",
          rsDigits = "\\d+",
          rsDingbat = "[" + rsDingbatRange + "]",
          rsLower = "[" + rsLowerRange + "]",
          rsMisc =
            "[^" +
            rsAstralRange +
            rsBreakRange +
            rsDigits +
            rsDingbatRange +
            rsLowerRange +
            rsUpperRange +
            "]",
          rsFitz = "\\ud83c[\\udffb-\\udfff]",
          rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")",
          rsNonAstral = "[^" + rsAstralRange + "]",
          rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}",
          rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]",
          rsUpper = "[" + rsUpperRange + "]",
          rsZWJ = "\\u200d",
          rsLowerMisc = "(?:" + rsLower + "|" + rsMisc + ")",
          rsUpperMisc = "(?:" + rsUpper + "|" + rsMisc + ")",
          rsOptLowerContr = "(?:" + rsApos + "(?:d|ll|m|re|s|t|ve))?",
          rsOptUpperContr = "(?:" + rsApos + "(?:D|LL|M|RE|S|T|VE))?",
          reOptMod = rsModifier + "?",
          rsOptVar = "[" + rsVarRange + "]?",
          rsOptJoin =
            "(?:" +
            rsZWJ +
            "(?:" +
            [rsNonAstral, rsRegional, rsSurrPair].join("|") +
            ")" +
            rsOptVar +
            reOptMod +
            ")*",
          rsSeq = rsOptVar + reOptMod + rsOptJoin,
          rsEmoji =
            "(?:" + [rsDingbat, rsRegional, rsSurrPair].join("|") + ")" + rsSeq,
          rsSymbol =
            "(?:" +
            [
              rsNonAstral + rsCombo + "?",
              rsCombo,
              rsRegional,
              rsSurrPair,
              rsAstral
            ].join("|") +
            ")",
          reApos = RegExp(rsApos, "g"),
          reComboMark = RegExp(rsCombo, "g"),
          reComplexSymbol = RegExp(
            rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq,
            "g"
          ),
          reComplexWord = RegExp(
            [
              rsUpper +
                "?" +
                rsLower +
                "+" +
                rsOptLowerContr +
                "(?=" +
                [rsBreak, rsUpper, "$"].join("|") +
                ")",
              rsUpperMisc +
                "+" +
                rsOptUpperContr +
                "(?=" +
                [rsBreak, rsUpper + rsLowerMisc, "$"].join("|") +
                ")",
              rsUpper + "?" + rsLowerMisc + "+" + rsOptLowerContr,
              rsUpper + "+" + rsOptUpperContr,
              rsDigits,
              rsEmoji
            ].join("|"),
            "g"
          ),
          reHasComplexSymbol = RegExp(
            "[" +
              rsZWJ +
              rsAstralRange +
              rsComboMarksRange +
              rsComboSymbolsRange +
              rsVarRange +
              "]"
          ),
          reHasComplexWord = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,
          contextProps = [
            "Array",
            "Buffer",
            "DataView",
            "Date",
            "Error",
            "Float32Array",
            "Float64Array",
            "Function",
            "Int8Array",
            "Int16Array",
            "Int32Array",
            "Map",
            "Math",
            "Object",
            "Promise",
            "Reflect",
            "RegExp",
            "Set",
            "String",
            "Symbol",
            "TypeError",
            "Uint8Array",
            "Uint8ClampedArray",
            "Uint16Array",
            "Uint32Array",
            "WeakMap",
            "_",
            "isFinite",
            "parseInt",
            "setTimeout"
          ],
          templateCounter = -1,
          typedArrayTags = {};
        (typedArrayTags[float32Tag] = typedArrayTags[
          float64Tag
        ] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[
          int32Tag
        ] = typedArrayTags[uint8Tag] = typedArrayTags[
          uint8ClampedTag
        ] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = !0),
          (typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[
            arrayBufferTag
          ] = typedArrayTags[boolTag] = typedArrayTags[
            dataViewTag
          ] = typedArrayTags[dateTag] = typedArrayTags[
            errorTag
          ] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[
            numberTag
          ] = typedArrayTags[objectTag] = typedArrayTags[
            regexpTag
          ] = typedArrayTags[setTag] = typedArrayTags[
            stringTag
          ] = typedArrayTags[weakMapTag] = !1);
        var cloneableTags = {};
        (cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[
          arrayBufferTag
        ] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[
          dateTag
        ] = cloneableTags[float32Tag] = cloneableTags[
          float64Tag
        ] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[
          int32Tag
        ] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[
          objectTag
        ] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[
          stringTag
        ] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[
          uint8ClampedTag
        ] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = !0),
          (cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[
            weakMapTag
          ] = !1);
        var deburredLetters = {
            À: "A",
            Á: "A",
            Â: "A",
            Ã: "A",
            Ä: "A",
            Å: "A",
            à: "a",
            á: "a",
            â: "a",
            ã: "a",
            ä: "a",
            å: "a",
            Ç: "C",
            ç: "c",
            Ð: "D",
            ð: "d",
            È: "E",
            É: "E",
            Ê: "E",
            Ë: "E",
            è: "e",
            é: "e",
            ê: "e",
            ë: "e",
            Ì: "I",
            Í: "I",
            Î: "I",
            Ï: "I",
            ì: "i",
            í: "i",
            î: "i",
            ï: "i",
            Ñ: "N",
            ñ: "n",
            Ò: "O",
            Ó: "O",
            Ô: "O",
            Õ: "O",
            Ö: "O",
            Ø: "O",
            ò: "o",
            ó: "o",
            ô: "o",
            õ: "o",
            ö: "o",
            ø: "o",
            Ù: "U",
            Ú: "U",
            Û: "U",
            Ü: "U",
            ù: "u",
            ú: "u",
            û: "u",
            ü: "u",
            Ý: "Y",
            ý: "y",
            ÿ: "y",
            Æ: "Ae",
            æ: "ae",
            Þ: "Th",
            þ: "th",
            ß: "ss"
          },
          htmlEscapes = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
            "`": "&#96;"
          },
          htmlUnescapes = {
            "&amp;": "&",
            "&lt;": "<",
            "&gt;": ">",
            "&quot;": '"',
            "&#39;": "'",
            "&#96;": "`"
          },
          stringEscapes = {
            "\\": "\\",
            "'": "'",
            "\n": "n",
            "\r": "r",
            "\u2028": "u2028",
            "\u2029": "u2029"
          },
          freeParseFloat = parseFloat,
          freeParseInt = parseInt,
          freeExports = "object" == typeof exports && exports,
          freeModule = freeExports && "object" == typeof module && module,
          moduleExports = freeModule && freeModule.exports === freeExports,
          freeGlobal = checkGlobal("object" == typeof global && global),
          freeSelf = checkGlobal("object" == typeof self && self),
          thisGlobal = checkGlobal("object" == typeof this && this),
          root =
            freeGlobal || freeSelf || thisGlobal || Function("return this")(),
          _ = runInContext();
        ((freeSelf || {})._ = _),
          (__WEBPACK_AMD_DEFINE_RESULT__ = function() {
            return _;
          }.call(exports, __webpack_require__, exports, module)),
          !(
            __WEBPACK_AMD_DEFINE_RESULT__ !== undefined &&
            (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)
          );
      }.call(this);
    }.call(
      exports,
      __webpack_require__(53)(module),
      (function() {
        return this;
      })()
    );
  },
  function(module) {
    module.exports = function(module) {
      return (
        module.webpackPolyfill ||
          ((module.deprecate = function() {}),
          (module.paths = []),
          (module.children = []),
          (module.webpackPolyfill = 1)),
        module
      );
    };
  },
  function(module, exports) {
    "use strict";
    function drawArc(context, pos1, pos2, size) {
      var angle1 = 2 * pos1 * Math.PI,
        angle2 = 2 * pos2 * Math.PI;
      context.beginPath(),
        context.moveTo(size / 2, size / 2),
        context.arc(size / 2, size / 2, size / 2 - 4, angle1, angle2),
        context.lineTo(size / 2, size / 2),
        context.closePath(),
        context.fill();
    }
    function drawPlayButton(context, size) {
      var margin = size / 7;
      context.beginPath(),
        context.moveTo(size / 2 - margin, size / 2 - 1.5 * margin),
        context.lineTo(size / 2 - margin, size / 2 + 1.5 * margin),
        context.lineTo(size / 2 + 2 * margin, size / 2),
        context.closePath(),
        context.fill();
    }
    function visualizeSpinners(context, loop1, loop2) {
      var running =
          arguments.length <= 3 || void 0 === arguments[3] ? !1 : arguments[3],
        hovering =
          arguments.length <= 4 || void 0 === arguments[4] ? !1 : arguments[4],
        large =
          arguments.length <= 5 || void 0 === arguments[5] ? !1 : arguments[5],
        size = large ? 150 : 100;
      context.clearRect(0, 0, size, size),
        (context.lineWidth = 3),
        (context.strokeStyle = "rgba(100, 100, 100, 0.3)"),
        (context.fillStyle = "rgba(100, 100, 100, 0.3)"),
        context.beginPath(),
        context.arc(size / 2, size / 2, size / 2 - 4, 0, 2 * Math.PI, !0),
        context.closePath(),
        context.stroke(),
        hovering &&
          (context.save(),
          (context.fillStyle = "rgba(100, 100, 100, 0.1)"),
          context.beginPath(),
          context.arc(size / 2, size / 2, size / 2 - 6, 0, 2 * Math.PI, !0),
          context.closePath(),
          context.fill(),
          context.restore()),
        running
          ? (drawArc(
              context,
              loop1.relativePositionInLoop,
              loop2.relativePositionInLoop,
              size
            ),
            drawArc(
              context,
              loop1.relativePositionInLoop - 0.5,
              loop2.relativePositionInLoop - 0.5,
              size
            ))
          : drawPlayButton(context, size);
    }
    Object.defineProperty(exports, "__esModule", { value: !0 }),
      (exports.visualizeSpinners = visualizeSpinners);
  },
  function(module, exports, __webpack_require__) {
    "use strict";
    function getWaveformColor(color) {
      var alpha =
        arguments.length <= 1 || void 0 === arguments[1] ? 0.3 : arguments[1];
      return "rgba(" + color.concat([alpha]).join(",") + ")";
    }
    function drawWaveform(context, data, color, width, height) {
      context.beginPath(),
        (context.strokeStyle = color),
        context.moveTo(0, height / 2);
      for (var i = 0; i < data.length; i++) {
        var x = (i / data.length) * width,
          y = height / 2 + (data[i] * height) / 2;
        context.lineTo(x, y);
      }
      context.moveTo(width, height / 2), context.closePath(), context.stroke();
    }
    function drawLoopArea(context, from, to, width, height) {
      (context.fillStyle = "rgba(200, 200, 200, 0.2)"),
        context.fillRect(from * width, 0, (to - from) * width, height);
    }
    function drawMarker(context, position, width, height, alpha) {
      context.beginPath(),
        (context.strokeStyle = "rgba(0, 0, 0, " + alpha + ")"),
        (context.strokeWidth = 1),
        context.moveTo(position * width, 0),
        context.lineTo(position * width, height),
        context.stroke(),
        context.closePath();
    }
    function visualizeWaveforms(context, waveform, loops, color) {
      var large =
          arguments.length <= 4 || void 0 === arguments[4] ? !1 : arguments[4],
        width = 1e3,
        height = large ? 150 : 100,
        allMuted = _lodash.every(loops, "muted");
      context.clearRect(0, 0, width, height);
      var _iteratorNormalCompletion = !0,
        _didIteratorError = !1,
        _iteratorError = void 0;
      try {
        for (
          var _step, _iterator = loops[Symbol.iterator]();
          !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
          _iteratorNormalCompletion = !0
        ) {
          var loop = _step.value;
          drawLoopArea(
            context,
            loop.loopStart / loop.audioBuffer.duration,
            loop.loopEnd / loop.audioBuffer.duration,
            width,
            height
          );
        }
      } catch (err) {
        (_didIteratorError = !0), (_iteratorError = err);
      } finally {
        try {
          !_iteratorNormalCompletion && _iterator.return && _iterator.return();
        } finally {
          if (_didIteratorError) throw _iteratorError;
        }
      }
      drawWaveform(
        context,
        waveform.visualize(),
        getWaveformColor(color, allMuted ? 0.1 : 0.3),
        width,
        height
      );
      var _iteratorNormalCompletion2 = !0,
        _didIteratorError2 = !1,
        _iteratorError2 = void 0;
      try {
        for (
          var _step2, _iterator2 = loops[Symbol.iterator]();
          !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done);
          _iteratorNormalCompletion2 = !0
        ) {
          var _loop = _step2.value;
          _loop.relativePositionInSample &&
            drawMarker(
              context,
              _loop.relativePositionInSample,
              width,
              height,
              allMuted ? 0.3 : 1
            );
        }
      } catch (err) {
        (_didIteratorError2 = !0), (_iteratorError2 = err);
      } finally {
        try {
          !_iteratorNormalCompletion2 &&
            _iterator2.return &&
            _iterator2.return();
        } finally {
          if (_didIteratorError2) throw _iteratorError2;
        }
      }
    }
    Object.defineProperty(exports, "__esModule", { value: !0 }),
      (exports.visualizeWaveforms = visualizeWaveforms);
    var _lodash = __webpack_require__(52);
  },
  function(module, exports) {
    var __WEBPACK_AMD_DEFINE_FACTORY__,
      __WEBPACK_AMD_DEFINE_ARRAY__,
      __WEBPACK_AMD_DEFINE_RESULT__;
    !(function(root, factory) {
      (__WEBPACK_AMD_DEFINE_ARRAY__ = []),
        (__WEBPACK_AMD_DEFINE_FACTORY__ = factory),
        (__WEBPACK_AMD_DEFINE_RESULT__ =
          "function" == typeof __WEBPACK_AMD_DEFINE_FACTORY__
            ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(
                exports,
                __WEBPACK_AMD_DEFINE_ARRAY__
              )
            : __WEBPACK_AMD_DEFINE_FACTORY__),
        !(
          void 0 !== __WEBPACK_AMD_DEFINE_RESULT__ &&
          (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)
        );
    })(this, function() {
      function pickHue(options) {
        var hueRange = getHueRange(options.hue),
          hue = randomWithin(hueRange);
        return 0 > hue && (hue = 360 + hue), hue;
      }
      function pickSaturation(hue, options) {
        if ("random" === options.luminosity) return randomWithin([0, 100]);
        if ("monochrome" === options.hue) return 0;
        var saturationRange = getSaturationRange(hue),
          sMin = saturationRange[0],
          sMax = saturationRange[1];
        switch (options.luminosity) {
          case "bright":
            sMin = 55;
            break;
          case "dark":
            sMin = sMax - 10;
            break;
          case "light":
            sMax = 55;
        }
        return randomWithin([sMin, sMax]);
      }
      function pickBrightness(H, S, options) {
        var bMin = getMinimumBrightness(H, S),
          bMax = 100;
        switch (options.luminosity) {
          case "dark":
            bMax = bMin + 20;
            break;
          case "light":
            bMin = (bMax + bMin) / 2;
            break;
          case "random":
            (bMin = 0), (bMax = 100);
        }
        return randomWithin([bMin, bMax]);
      }
      function setFormat(hsv, options) {
        switch (options.format) {
          case "hsvArray":
            return hsv;
          case "hslArray":
            return HSVtoHSL(hsv);
          case "hsl":
            var hsl = HSVtoHSL(hsv);
            return "hsl(" + hsl[0] + ", " + hsl[1] + "%, " + hsl[2] + "%)";
          case "hsla":
            var hslColor = HSVtoHSL(hsv);
            return (
              "hsla(" +
              hslColor[0] +
              ", " +
              hslColor[1] +
              "%, " +
              hslColor[2] +
              "%, " +
              Math.random() +
              ")"
            );
          case "rgbArray":
            return HSVtoRGB(hsv);
          case "rgb":
            var rgb = HSVtoRGB(hsv);
            return "rgb(" + rgb.join(", ") + ")";
          case "rgba":
            var rgbColor = HSVtoRGB(hsv);
            return "rgba(" + rgbColor.join(", ") + ", " + Math.random() + ")";
          default:
            return HSVtoHex(hsv);
        }
      }
      function getMinimumBrightness(H, S) {
        for (
          var lowerBounds = getColorInfo(H).lowerBounds, i = 0;
          i < lowerBounds.length - 1;
          i++
        ) {
          var s1 = lowerBounds[i][0],
            v1 = lowerBounds[i][1],
            s2 = lowerBounds[i + 1][0],
            v2 = lowerBounds[i + 1][1];
          if (S >= s1 && s2 >= S) {
            var m = (v2 - v1) / (s2 - s1),
              b = v1 - m * s1;
            return m * S + b;
          }
        }
        return 0;
      }
      function getHueRange(colorInput) {
        if ("number" == typeof parseInt(colorInput)) {
          var number = parseInt(colorInput);
          if (360 > number && number > 0) return [number, number];
        }
        if ("string" == typeof colorInput && colorDictionary[colorInput]) {
          var color = colorDictionary[colorInput];
          if (color.hueRange) return color.hueRange;
        }
        return [0, 360];
      }
      function getSaturationRange(hue) {
        return getColorInfo(hue).saturationRange;
      }
      function getColorInfo(hue) {
        hue >= 334 && 360 >= hue && (hue -= 360);
        for (var colorName in colorDictionary) {
          var color = colorDictionary[colorName];
          if (
            color.hueRange &&
            hue >= color.hueRange[0] &&
            hue <= color.hueRange[1]
          )
            return colorDictionary[colorName];
        }
        return "Color not found";
      }
      function randomWithin(range) {
        if (null === seed)
          return Math.floor(
            range[0] + Math.random() * (range[1] + 1 - range[0])
          );
        var max = range[1] || 1,
          min = range[0] || 0;
        seed = (9301 * seed + 49297) % 233280;
        var rnd = seed / 233280;
        return Math.floor(min + rnd * (max - min));
      }
      function HSVtoHex(hsv) {
        function componentToHex(c) {
          var hex = c.toString(16);
          return 1 == hex.length ? "0" + hex : hex;
        }
        var rgb = HSVtoRGB(hsv),
          hex =
            "#" +
            componentToHex(rgb[0]) +
            componentToHex(rgb[1]) +
            componentToHex(rgb[2]);
        return hex;
      }
      function defineColor(name, hueRange, lowerBounds) {
        var sMin = lowerBounds[0][0],
          sMax = lowerBounds[lowerBounds.length - 1][0],
          bMin = lowerBounds[lowerBounds.length - 1][1],
          bMax = lowerBounds[0][1];
        colorDictionary[name] = {
          hueRange: hueRange,
          lowerBounds: lowerBounds,
          saturationRange: [sMin, sMax],
          brightnessRange: [bMin, bMax]
        };
      }
      function loadColorBounds() {
        defineColor("monochrome", null, [
          [0, 0],
          [100, 0]
        ]),
          defineColor(
            "red",
            [-26, 18],
            [
              [20, 100],
              [30, 92],
              [40, 89],
              [50, 85],
              [60, 78],
              [70, 70],
              [80, 60],
              [90, 55],
              [100, 50]
            ]
          ),
          defineColor(
            "orange",
            [19, 46],
            [
              [20, 100],
              [30, 93],
              [40, 88],
              [50, 86],
              [60, 85],
              [70, 70],
              [100, 70]
            ]
          ),
          defineColor(
            "yellow",
            [47, 62],
            [
              [25, 100],
              [40, 94],
              [50, 89],
              [60, 86],
              [70, 84],
              [80, 82],
              [90, 80],
              [100, 75]
            ]
          ),
          defineColor(
            "green",
            [63, 178],
            [
              [30, 100],
              [40, 90],
              [50, 85],
              [60, 81],
              [70, 74],
              [80, 64],
              [90, 50],
              [100, 40]
            ]
          ),
          defineColor(
            "blue",
            [179, 257],
            [
              [20, 100],
              [30, 86],
              [40, 80],
              [50, 74],
              [60, 60],
              [70, 52],
              [80, 44],
              [90, 39],
              [100, 35]
            ]
          ),
          defineColor(
            "purple",
            [258, 282],
            [
              [20, 100],
              [30, 87],
              [40, 79],
              [50, 70],
              [60, 65],
              [70, 59],
              [80, 52],
              [90, 45],
              [100, 42]
            ]
          ),
          defineColor(
            "pink",
            [283, 334],
            [
              [20, 100],
              [30, 90],
              [40, 86],
              [60, 84],
              [80, 80],
              [90, 75],
              [100, 73]
            ]
          );
      }
      function HSVtoRGB(hsv) {
        var h = hsv[0];
        0 === h && (h = 1), 360 === h && (h = 359), (h /= 360);
        var s = hsv[1] / 100,
          v = hsv[2] / 100,
          h_i = Math.floor(6 * h),
          f = 6 * h - h_i,
          p = v * (1 - s),
          q = v * (1 - f * s),
          t = v * (1 - (1 - f) * s),
          r = 256,
          g = 256,
          b = 256;
        switch (h_i) {
          case 0:
            (r = v), (g = t), (b = p);
            break;
          case 1:
            (r = q), (g = v), (b = p);
            break;
          case 2:
            (r = p), (g = v), (b = t);
            break;
          case 3:
            (r = p), (g = q), (b = v);
            break;
          case 4:
            (r = t), (g = p), (b = v);
            break;
          case 5:
            (r = v), (g = p), (b = q);
        }
        var result = [
          Math.floor(255 * r),
          Math.floor(255 * g),
          Math.floor(255 * b)
        ];
        return result;
      }
      function HSVtoHSL(hsv) {
        var h = hsv[0],
          s = hsv[1] / 100,
          v = hsv[2] / 100,
          k = (2 - s) * v;
        return [
          h,
          Math.round(1e4 * ((s * v) / (1 > k ? k : 2 - k))) / 100,
          100 * (k / 2)
        ];
      }
      function stringToInteger(string) {
        for (
          var total = 0, i = 0;
          i !== string.length && !(total >= Number.MAX_SAFE_INTEGER);
          i++
        )
          total += string.charCodeAt(i);
        return total;
      }
      var seed = null,
        colorDictionary = {};
      loadColorBounds();
      var randomColor = function(options) {
        if (
          ((options = options || {}),
          options.seed && options.seed === parseInt(options.seed, 10))
        )
          seed = options.seed;
        else if ("string" == typeof options.seed)
          seed = stringToInteger(options.seed);
        else {
          if (void 0 !== options.seed && null !== options.seed)
            throw new TypeError("The seed value must be an integer or string");
          seed = null;
        }
        var H, S, B;
        if (null !== options.count && void 0 !== options.count) {
          var totalColors = options.count,
            colors = [];
          for (options.count = null; totalColors > colors.length; )
            seed && options.seed && (options.seed += 1),
              colors.push(randomColor(options));
          return (options.count = totalColors), colors;
        }
        return (
          (H = pickHue(options)),
          (S = pickSaturation(H, options)),
          (B = pickBrightness(H, S, options)),
          setFormat([H, S, B], options)
        );
      };
      return randomColor;
    });
  },
  function(module, exports, __webpack_require__) {
    "use strict";
    function initMusicForAirports(sounds, sampleBuffersPromise, element) {
      var _ref =
          arguments.length <= 3 || void 0 === arguments[3] ? {} : arguments[3],
        _ref$playbackRateModi = _ref.playbackRateModifier,
        playbackRateModifier =
          void 0 === _ref$playbackRateModi ? 1 : _ref$playbackRateModi,
        _ref$soundArcRadius = _ref.soundArcRadius,
        soundArcRadius =
          void 0 === _ref$soundArcRadius ? 4 : _ref$soundArcRadius,
        _ref$fadeInOut = _ref.fadeInOut,
        fadeInOut = void 0 === _ref$fadeInOut ? !0 : _ref$fadeInOut;
      sampleBuffersPromise.then(function(buffers) {
        sounds.getAirportSampleBuffer().then(function(convolverBuffer) {
          function render() {
            context.clearRect(0, 0, 1e3, 1e3),
              (context.strokeStyle = "#888"),
              (context.lineWidth = 1),
              context.moveTo(325, 325),
              context.lineTo(650, 325),
              context.stroke(),
              (context.lineWidth = 30),
              (context.lineCap = "round");
            var radius = 280,
              _iteratorNormalCompletion = !0,
              _didIteratorError = !1,
              _iteratorError = void 0;
            try {
              for (
                var _step, _iterator = loops[Symbol.iterator]();
                !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
                _iteratorNormalCompletion = !0
              ) {
                var loop = _step.value,
                  size = (2 * Math.PI) / loop.loopEvery,
                  offset = playingSince
                    ? sounds.audioCtx.currentTime - playingSince
                    : 0,
                  startAt = (loop.delay - offset) * size,
                  endAt = (loop.delay + soundArcRadius - offset) * size;
                (context.strokeStyle = "rgba(220, 220, 220, 0.3)"),
                  context.beginPath(),
                  context.arc(325, 325, radius, 0, 2 * Math.PI),
                  context.stroke(),
                  (context.strokeStyle = "#ED146F"),
                  context.beginPath(),
                  context.arc(325, 325, radius, startAt, endAt),
                  context.stroke(),
                  (radius -= 35);
              }
            } catch (err) {
              (_didIteratorError = !0), (_iteratorError = err);
            } finally {
              try {
                !_iteratorNormalCompletion &&
                  _iterator.return &&
                  _iterator.return();
              } finally {
                if (_didIteratorError) throw _iteratorError;
              }
            }
            playingSince
              ? requestAnimationFrame(render)
              : ((context.fillStyle = "rgba(0, 0, 0, 0.3)"),
                (context.strokeStyle = "rgba(0, 0, 0, 0)"),
                context.beginPath(),
                context.moveTo(235, 170),
                context.lineTo(485, 325),
                context.lineTo(235, 455),
                context.lineTo(235, 170),
                context.fill());
          }
          function start() {
            (playingSince = sounds.audioCtx.currentTime),
              (convolver = sounds.audioCtx.createConvolver()),
              (convolver.buffer = convolverBuffer),
              convolver.connect(sounds.audioCtx.destination),
              loops.forEach(function(loop) {
                return loop.start(convolver);
              }),
              render();
          }
          function stop() {
            (playingSince = null),
              convolver.disconnect(),
              (convolver = null),
              loops.forEach(function(loop) {
                return loop.stop();
              }),
              render();
          }
          var canvas = element.querySelector(".spinners"),
            context = canvas.getContext("2d"),
            convolver = void 0,
            loops = buffers.map(function(sound) {
              var timing = TIMINGS[sound.note];
              return new _extendedLoop.ExtendedLoop(
                sounds.audioCtx,
                sound.buffer,
                {
                  playbackRate: sound.rate * playbackRateModifier,
                  delay: timing.delay,
                  loopEvery: timing.loop,
                  fadeInOut: fadeInOut
                }
              );
            }),
            playingSince = void 0;
          canvas.addEventListener("click", function() {
            playingSince ? stop() : start();
          }),
            render();
        });
      });
    }
    Object.defineProperty(exports, "__esModule", { value: !0 }),
      (exports.initMusicForAirports = initMusicForAirports);
    var _extendedLoop = __webpack_require__(58),
      TIMINGS = {
        F3: { delay: 4, loop: 19.7 },
        Ab3: { delay: 8.1, loop: 17.8 },
        C4: { delay: 5.6, loop: 21.3 },
        Db4: { delay: 12.6, loop: 22.1 },
        Eb4: { delay: 9.2, loop: 18.5 },
        F4: { delay: 14.1, loop: 20 },
        Ab4: { delay: 3.1, loop: 17.7 }
      };
  },
  function(module, exports) {
    "use strict";
    function _asyncToGenerator(fn) {
      return function() {
        var gen = fn.apply(this, arguments);
        return new Promise(function(resolve, reject) {
          function step(key, arg) {
            try {
              var info = gen[key](arg),
                value = info.value;
            } catch (error) {
              return reject(error), void 0;
            }
            return info.done
              ? (resolve(value), void 0)
              : Promise.resolve(value).then(
                  function(value) {
                    return step("next", value);
                  },
                  function(err) {
                    return step("throw", err);
                  }
                );
          }
          return step("next");
        });
      };
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor))
        throw new TypeError("Cannot call a class as a function");
    }
    function sleepSeconds(n) {
      return new Promise(function(res) {
        return setTimeout(res, 1e3 * n);
      });
    }
    Object.defineProperty(exports, "__esModule", { value: !0 });
    var _createClass = (function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          (descriptor.enumerable = descriptor.enumerable || !1),
            (descriptor.configurable = !0),
            "value" in descriptor && (descriptor.writable = !0),
            Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        return (
          protoProps && defineProperties(Constructor.prototype, protoProps),
          staticProps && defineProperties(Constructor, staticProps),
          Constructor
        );
      };
    })();
    exports.ExtendedLoop = (function() {
      function ExtendedLoop(audioContext, audioBuffer, _ref) {
        var _ref$playbackRate = _ref.playbackRate,
          playbackRate = void 0 === _ref$playbackRate ? 1 : _ref$playbackRate,
          _ref$delay = _ref.delay,
          delay = void 0 === _ref$delay ? 0 : _ref$delay,
          _ref$loopEvery = _ref.loopEvery,
          loopEvery =
            void 0 === _ref$loopEvery ? Number.MAX_VALUE : _ref$loopEvery,
          _ref$fadeInOut = _ref.fadeInOut,
          fadeInOut = void 0 === _ref$fadeInOut ? !0 : _ref$fadeInOut;
        _classCallCheck(this, ExtendedLoop),
          (this.audioContext = audioContext),
          (this.audioBuffer = audioBuffer),
          (this.playbackRate = playbackRate),
          (this.delay = delay),
          (this.loopEvery = loopEvery),
          (this.fadeInOut = fadeInOut);
      }
      return (
        _createClass(ExtendedLoop, [
          {
            key: "start",
            value: function(destination) {
              (this.playing = new Date().getTime()),
                this.scheduleRepeatedly(destination);
            }
          },
          {
            key: "stop",
            value: function() {
              (this.playing = null),
                this.currentSourceNode &&
                  (this.currentSourceNode.stop(),
                  this.currentSourceNode.disconnect(),
                  (this.currentSourceNode = null));
            }
          },
          {
            key: "scheduleRepeatedly",
            value: (function() {
              function scheduleRepeatedly() {
                return ref.apply(this, arguments);
              }
              var ref = _asyncToGenerator(
                regeneratorRuntime.mark(function _callee(destination) {
                  var playId, iteration;
                  return regeneratorRuntime.wrap(
                    function(_context) {
                      for (;;)
                        switch ((_context.prev = _context.next)) {
                          case 0:
                            return (
                              (playId = this.playing),
                              (iteration = 0),
                              (this.startTime = this.audioContext.currentTime),
                              (_context.next = 5),
                              sleepSeconds(this.delay)
                            );
                          case 5:
                            if (this.playing !== playId) {
                              _context.next = 11;
                              break;
                            }
                            return (
                              this.playNow(iteration++, destination),
                              (_context.next = 9),
                              sleepSeconds(this.loopEvery)
                            );
                          case 9:
                            _context.next = 5;
                            break;
                          case 11:
                          case "end":
                            return _context.stop();
                        }
                    },
                    _callee,
                    this
                  );
                })
              );
              return scheduleRepeatedly;
            })()
          },
          {
            key: "playNow",
            value: function(iteration, destination) {
              var baseTime =
                  this.startTime + this.loopEvery * iteration + this.delay,
                sourceNode = this.audioContext.createBufferSource(),
                gainNode = this.audioContext.createGain();
              this.fadeInOut
                ? (gainNode.gain.setValueAtTime(0, baseTime),
                  gainNode.gain.linearRampToValueAtTime(1, baseTime + 1),
                  gainNode.gain.setValueAtTime(
                    1,
                    baseTime + this.audioBuffer.duration / this.playbackRate - 1
                  ),
                  gainNode.gain.linearRampToValueAtTime(
                    0,
                    baseTime + this.audioBuffer.duration / this.playbackRate
                  ))
                : (gainNode.gain.value = 1),
                (sourceNode.buffer = this.audioBuffer),
                (sourceNode.playbackRate.value = this.playbackRate),
                sourceNode.connect(gainNode),
                gainNode.connect(destination),
                sourceNode.start(),
                (this.currentSourceNode = sourceNode);
            }
          }
        ]),
        ExtendedLoop
      );
    })();
  },
  function(module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor))
        throw new TypeError("Cannot call a class as a function");
    }
    function _toArray(arr) {
      return Array.isArray(arr) ? arr : Array.from(arr);
    }
    function makeSynth() {
      var synthEnvelope = { attack: 0.1, release: 4, releaseCurve: "linear" };
      return new _tone.DuoSynth({
        harmonicity: 1,
        volume: -20,
        voice0: {
          oscillator: { type: "sawtooth" },
          filterEnvelope: {
            attack: 0,
            decay: 0,
            baseFrequency: 200,
            octaves: 2,
            release: 1e3
          },
          envelope: synthEnvelope
        },
        voice1: {
          oscillator: { type: "sawtooth" },
          filterEnvelope: {
            attack: 0,
            decay: 0,
            baseFrequency: 200,
            octaves: 2,
            release: 1e3
          },
          envelope: synthEnvelope
        },
        vibratoAmount: 0.06,
        vibratoRate: 0.5
      });
    }
    function absoluteSequence(sequence, color) {
      return sequence.map(function(_ref) {
        var _ref2 = _toArray(_ref),
          _ref2$ = _slicedToArray(_ref2[0], 3),
          note = _ref2$[0],
          time = _ref2$[1],
          duration = _ref2$[2],
          rest = _ref2.slice(1),
          moves = rest.map(function(_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
              note = _ref4[0],
              time = _ref4[1];
            return [note, timeParser.toSeconds(time)];
          });
        moves.unshift([
          note,
          timeParser.toSeconds(time),
          timeParser.toSeconds(duration)
        ]);
        for (var fullDuration = moves[0][2], i = 0; i < moves.length; i++)
          i < moves.length - 1
            ? (moves[i][2] = moves[i + 1][1] - moves[i][1])
            : ((moves[i][2] = moves[0][1] + fullDuration - moves[i][1]),
              (moves[i][3] = !0)),
            (moves[i][4] = color);
        return moves;
      });
    }
    function removeOldEvents(events, currentTime) {
      return events.filter(function(e) {
        return currentTime - e[1] < 120;
      });
    }
    function scheduleSequence(seq, synth) {
      var _iteratorNormalCompletion = !0,
        _didIteratorError = !1,
        _iteratorError = void 0;
      try {
        for (
          var _step, _iterator = seq[Symbol.iterator]();
          !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
          _iteratorNormalCompletion = !0
        ) {
          var _step$value = _toArray(_step.value),
            _step$value$ = _slicedToArray(_step$value[0], 3),
            note = _step$value$[0],
            time = _step$value$[1],
            duration = _step$value$[2],
            rest = _step$value.slice(1);
          synth.triggerAttackRelease(note, duration, time);
          var _iteratorNormalCompletion2 = !0,
            _didIteratorError2 = !1,
            _iteratorError2 = void 0;
          try {
            for (
              var _step2, _iterator2 = rest[Symbol.iterator]();
              !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done);
              _iteratorNormalCompletion2 = !0
            ) {
              var _step2$value = _slicedToArray(_step2.value, 2),
                moveToNote = _step2$value[0],
                moveAtTime = _step2$value[1];
              synth.setNote(moveToNote, moveAtTime);
            }
          } catch (err) {
            (_didIteratorError2 = !0), (_iteratorError2 = err);
          } finally {
            try {
              !_iteratorNormalCompletion2 &&
                _iterator2.return &&
                _iterator2.return();
            } finally {
              if (_didIteratorError2) throw _iteratorError2;
            }
          }
        }
      } catch (err) {
        (_didIteratorError = !0), (_iteratorError = err);
      } finally {
        try {
          !_iteratorNormalCompletion && _iterator.return && _iterator.return();
        } finally {
          if (_didIteratorError) throw _iteratorError;
        }
      }
    }
    function updateFripperEvents(events, synth, seq) {
      var currentTime = synth.toSeconds(_tone.Transport.position),
        _iteratorNormalCompletion3 = !0,
        _didIteratorError3 = !1,
        _iteratorError3 = void 0;
      try {
        for (
          var _step3, _iterator3 = seq[Symbol.iterator]();
          !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done);
          _iteratorNormalCompletion3 = !0
        ) {
          var phrase = _step3.value;
          events = events.concat(
            phrase.map(function(_ref5) {
              var _ref6 = _slicedToArray(_ref5, 5),
                note = _ref6[0],
                time = _ref6[1],
                duration = _ref6[2],
                isLast = _ref6[3],
                color = _ref6[4];
              return [note, time + currentTime, duration, isLast, color];
            })
          );
        }
      } catch (err) {
        (_didIteratorError3 = !0), (_iteratorError3 = err);
      } finally {
        try {
          !_iteratorNormalCompletion3 &&
            _iterator3.return &&
            _iterator3.return();
        } finally {
          if (_didIteratorError3) throw _iteratorError3;
        }
      }
      return (events = removeOldEvents(events, currentTime));
    }
    function initEqualizerUI(container, changeCallback) {
      EQUALIZER_CENTER_FREQUENCIES.forEach(function(frequency, index) {
        var wrapper = document.createElement("div"),
          slider = document.createElement("div"),
          label = document.createElement("label");
        wrapper.classList.add("slider-wrapper"),
          slider.classList.add("slider"),
          (label.textContent =
            frequency >= 1e3 ? frequency / 1e3 + "K" : frequency),
          _nouislider2.default.create(slider, {
            start: 0,
            range: { min: -12, max: 12 },
            step: 0.1,
            direction: "rtl",
            orientation: "vertical"
          }),
          slider.noUiSlider.on("update", function(_ref8) {
            var _ref9 = _slicedToArray(_ref8, 1),
              value = _ref9[0],
              gain = +value;
            changeCallback(index, gain);
          }),
          wrapper.appendChild(slider),
          wrapper.appendChild(label),
          container.appendChild(wrapper);
      });
    }
    function initDiscreetMusic(sounds, element, _ref10) {
      function seqVisLoop() {
        if (visualizeSequences) {
          var rightWidth = 1e3,
            leftWidth = 34 * (1e3 / 37),
            currentTime = timeParser.toSeconds(_tone.Transport.position);
          _sequence_vis.visualizeSequence(
            leftCanvas.getContext("2d"),
            LEFT_SEQ_ABS,
            4,
            timeParser.toSeconds("34m"),
            currentTime,
            leftWidth,
            LEFT_COLOR
          ),
            _sequence_vis.visualizeSequence(
              rightCanvas.getContext("2d"),
              RIGHT_SEQ_ABS,
              3,
              timeParser.toSeconds("37m"),
              currentTime,
              rightWidth,
              RIGHT_COLOR
            ),
            currentPlayer && requestAnimationFrame(seqVisLoop);
        }
      }
      function fripperVisLoop() {
        if (visualizeFrippertronics) {
          var currentTime = timeParser.toSeconds(_tone.Transport.position);
          _frippertronics_vis.visualizeFrippertronics(
            fripperContext,
            6,
            0.75,
            currentPlayer ? currentPlayer.fripperEvents : [],
            currentTime,
            !!currentPlayer
          ),
            currentPlayer && requestAnimationFrame(fripperVisLoop);
        }
      }
      function startStop() {
        currentPlayer
          ? (currentPlayer.stop(),
            (currentPlayer = null),
            _tone.Transport.stop(),
            seqVisLoop(),
            fripperVisLoop())
          : ((currentPlayer = new DiscreetPlayer(sounds, {
              useEcho: useEcho,
              useFrippertronics: useFrippertronics
            })),
            currentPlayer.start(eqGains),
            _tone.Transport.start(),
            seqVisLoop(),
            fripperVisLoop());
      }
      _ref10.delaySeconds, _ref10.decay;
      var _ref10$visualizeSeque = _ref10.visualizeSequences,
        visualizeSequences =
          void 0 === _ref10$visualizeSeque ? !1 : _ref10$visualizeSeque,
        _ref10$visualizeFripp = _ref10.visualizeFrippertronics,
        visualizeFrippertronics =
          void 0 === _ref10$visualizeFripp ? !1 : _ref10$visualizeFripp,
        _ref10$useEcho = _ref10.useEcho,
        useEcho = void 0 === _ref10$useEcho ? !1 : _ref10$useEcho,
        _ref10$useFrippertron = _ref10.useFrippertronics,
        useFrippertronics =
          void 0 === _ref10$useFrippertron ? !1 : _ref10$useFrippertron,
        _ref10$useEqualizer = _ref10.useEqualizer,
        useEqualizer =
          void 0 === _ref10$useEqualizer ? !1 : _ref10$useEqualizer,
        currentPlayer = void 0,
        eqGains = EQUALIZER_CENTER_FREQUENCIES.map(function() {
          return 0;
        }),
        leftCanvas = element.querySelector(".sequence1"),
        rightCanvas = element.querySelector(".sequence2"),
        fripperCanvas = element.querySelector(".frippertronics"),
        fripperContext = fripperCanvas ? fripperCanvas.getContext("2d") : null;
      leftCanvas && leftCanvas.addEventListener("click", startStop),
        rightCanvas && rightCanvas.addEventListener("click", startStop),
        fripperCanvas && fripperCanvas.addEventListener("click", startStop),
        seqVisLoop(),
        fripperVisLoop(),
        useEqualizer &&
          initEqualizerUI(element.querySelector(".eq"), function(index, gain) {
            (eqGains[index] = gain),
              currentPlayer &&
                (currentPlayer.eqFilters[index].gain.value = gain);
          });
    }
    Object.defineProperty(exports, "__esModule", { value: !0 });
    var _createClass = (function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            (descriptor.enumerable = descriptor.enumerable || !1),
              (descriptor.configurable = !0),
              "value" in descriptor && (descriptor.writable = !0),
              Object.defineProperty(target, descriptor.key, descriptor);
          }
        }
        return function(Constructor, protoProps, staticProps) {
          return (
            protoProps && defineProperties(Constructor.prototype, protoProps),
            staticProps && defineProperties(Constructor, staticProps),
            Constructor
          );
        };
      })(),
      _slicedToArray = (function() {
        function sliceIterator(arr, i) {
          var _arr = [],
            _n = !0,
            _d = !1,
            _e = void 0;
          try {
            for (
              var _s, _i = arr[Symbol.iterator]();
              !(_n = (_s = _i.next()).done) &&
              (_arr.push(_s.value), !i || _arr.length !== i);
              _n = !0
            );
          } catch (err) {
            (_d = !0), (_e = err);
          } finally {
            try {
              !_n && _i["return"] && _i["return"]();
            } finally {
              if (_d) throw _e;
            }
          }
          return _arr;
        }
        return function(arr, i) {
          if (Array.isArray(arr)) return arr;
          if (Symbol.iterator in Object(arr)) return sliceIterator(arr, i);
          throw new TypeError(
            "Invalid attempt to destructure non-iterable instance"
          );
        };
      })();
    exports.initDiscreetMusic = initDiscreetMusic;
    var _tone = __webpack_require__(6);
    _interopRequireDefault(_tone);
    var _nouislider = __webpack_require__(60),
      _nouislider2 = _interopRequireDefault(_nouislider),
      _sequence_vis = __webpack_require__(61),
      _frippertronics_vis = __webpack_require__(62),
      EQUALIZER_CENTER_FREQUENCIES = [
        100,
        125,
        160,
        200,
        250,
        315,
        400,
        500,
        630,
        800,
        1e3,
        1250,
        1600,
        2e3,
        2500,
        3150,
        4e3,
        5e3,
        6300,
        8e3,
        1e4
      ],
      timeParser = new _tone.DuoSynth(),
      LEFT_COLOR = [237, 20, 111],
      RIGHT_COLOR = [43, 166, 203],
      LEFT_SEQUENCE = [
        [
          ["C5", "+0", "1n + 2n"],
          ["D5", "+2n"]
        ],
        [["E4", "+6m", "2n"]],
        [["G4", "+11m + 2n", "2n"]],
        [
          ["E5", "+19m", "2m"],
          ["G5", "+19m + 2n - 8n"],
          ["A5", "+19m + 2n + 2n - 4n"],
          ["G5", "+19m + 2n + 2n + 2n - 4n - 8n"]
        ]
      ],
      RIGHT_SEQUENCE = [
        [
          ["D4", "+5m", "1n + 2n"],
          ["E4", "+5m + 1n"]
        ],
        [
          ["B3", "+11m + 2n + 8n", "1n"],
          ["G3", "+12m + 8n"]
        ],
        [["G4", "+23m + 2n", "2n"]]
      ],
      LEFT_SEQ_ABS = absoluteSequence(LEFT_SEQUENCE, LEFT_COLOR),
      RIGHT_SEQ_ABS = absoluteSequence(RIGHT_SEQUENCE, RIGHT_COLOR),
      DiscreetPlayer = (function() {
        function DiscreetPlayer(sounds, _ref7) {
          var useEcho = _ref7.useEcho,
            useFrippertronics = _ref7.useFrippertronics;
          _classCallCheck(this, DiscreetPlayer),
            (this.sounds = sounds),
            (this.useEcho = useEcho),
            (this.useFrippertronics = useFrippertronics),
            (this.fripperEvents = []);
        }
        return (
          _createClass(DiscreetPlayer, [
            {
              key: "start",
              value: function(initialFilterGains) {
                var _this = this;
                (this.leftSynth = makeSynth()),
                  (this.rightSynth = makeSynth()),
                  (this.leftLoop = new _tone.Loop(function() {
                    scheduleSequence(LEFT_SEQUENCE, _this.leftSynth),
                      (_this.fripperEvents = updateFripperEvents(
                        _this.fripperEvents,
                        _this.leftSynth,
                        LEFT_SEQ_ABS
                      ));
                  }, "34m").start()),
                  (this.rightLoop = new _tone.Loop(function() {
                    scheduleSequence(RIGHT_SEQUENCE, _this.rightSynth),
                      (_this.fripperEvents = updateFripperEvents(
                        _this.fripperEvents,
                        _this.rightSynth,
                        RIGHT_SEQ_ABS
                      ));
                  }, "37m").start());
                var leftPan = this.sounds.audioCtx.createStereoPanner(),
                  rightPan = this.sounds.audioCtx.createStereoPanner();
                (this.echo = new _tone.FeedbackDelay(
                  "16n",
                  this.useEcho ? 0.2 : 0
                )),
                  (this.eqFilters = EQUALIZER_CENTER_FREQUENCIES.map(function(
                    freq,
                    index
                  ) {
                    var filter = _this.sounds.audioCtx.createBiquadFilter();
                    return (
                      (filter.type = "peaking"),
                      (filter.frequency.value = freq),
                      (filter.Q.value = 4.31),
                      (filter.gain.value = initialFilterGains[index]),
                      filter
                    );
                  }));
                var delay = this.sounds.audioCtx.createDelay(6);
                (this.gain = this.sounds.audioCtx.createGain()),
                  (leftPan.pan.value = -0.5),
                  (rightPan.pan.value = 0.5),
                  (delay.delayTime.value = 6),
                  (this.gain.gain.value = 0.75),
                  this.leftSynth.connect(leftPan),
                  leftPan.connect(this.eqFilters[0]),
                  this.rightSynth.connect(rightPan),
                  rightPan.connect(this.eqFilters[0]),
                  this.eqFilters.forEach(function(filter, index) {
                    index < _this.eqFilters.length - 1
                      ? filter.connect(_this.eqFilters[index + 1])
                      : filter.connect(_this.echo);
                  }),
                  this.useFrippertronics && this.echo.connect(delay),
                  delay.connect(this.gain),
                  this.gain.connect(delay),
                  this.echo.connect(this.sounds.audioCtx.destination),
                  this.gain.connect(this.sounds.audioCtx.destination);
              }
            },
            {
              key: "stop",
              value: function() {
                this.leftSynth.dispose(),
                  this.rightSynth.dispose(),
                  this.gain.disconnect(),
                  this.echo.disconnect(),
                  this.leftLoop.stop(),
                  this.rightLoop.stop();
              }
            }
          ]),
          DiscreetPlayer
        );
      })();
  },
  function(module, exports) {
    var __WEBPACK_AMD_DEFINE_FACTORY__,
      __WEBPACK_AMD_DEFINE_ARRAY__,
      __WEBPACK_AMD_DEFINE_RESULT__;
    !(function(factory) {
      (__WEBPACK_AMD_DEFINE_ARRAY__ = []),
        (__WEBPACK_AMD_DEFINE_FACTORY__ = factory),
        (__WEBPACK_AMD_DEFINE_RESULT__ =
          "function" == typeof __WEBPACK_AMD_DEFINE_FACTORY__
            ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(
                exports,
                __WEBPACK_AMD_DEFINE_ARRAY__
              )
            : __WEBPACK_AMD_DEFINE_FACTORY__),
        !(
          void 0 !== __WEBPACK_AMD_DEFINE_RESULT__ &&
          (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)
        );
    })(function() {
      "use strict";
      function unique(array) {
        return array.filter(function(a) {
          return this[a] ? !1 : (this[a] = !0);
        }, {});
      }
      function closest(value, to) {
        return Math.round(value / to) * to;
      }
      function offset(elem) {
        var rect = elem.getBoundingClientRect(),
          doc = elem.ownerDocument,
          docElem = doc.documentElement,
          pageOffset = getPageOffset();
        return (
          /webkit.*Chrome.*Mobile/i.test(navigator.userAgent) &&
            (pageOffset.x = 0),
          {
            top: rect.top + pageOffset.y - docElem.clientTop,
            left: rect.left + pageOffset.x - docElem.clientLeft
          }
        );
      }
      function isNumeric(a) {
        return "number" == typeof a && !isNaN(a) && isFinite(a);
      }
      function addClassFor(element, className, duration) {
        addClass(element, className),
          setTimeout(function() {
            removeClass(element, className);
          }, duration);
      }
      function limit(a) {
        return Math.max(Math.min(a, 100), 0);
      }
      function asArray(a) {
        return Array.isArray(a) ? a : [a];
      }
      function countDecimals(numStr) {
        var pieces = numStr.split(".");
        return pieces.length > 1 ? pieces[1].length : 0;
      }
      function addClass(el, className) {
        el.classList
          ? el.classList.add(className)
          : (el.className += " " + className);
      }
      function removeClass(el, className) {
        el.classList
          ? el.classList.remove(className)
          : (el.className = el.className.replace(
              new RegExp(
                "(^|\\b)" + className.split(" ").join("|") + "(\\b|$)",
                "gi"
              ),
              " "
            ));
      }
      function hasClass(el, className) {
        return el.classList
          ? el.classList.contains(className)
          : new RegExp("\\b" + className + "\\b").test(el.className);
      }
      function getPageOffset() {
        var supportPageOffset = void 0 !== window.pageXOffset,
          isCSS1Compat = "CSS1Compat" === (document.compatMode || ""),
          x = supportPageOffset
            ? window.pageXOffset
            : isCSS1Compat
            ? document.documentElement.scrollLeft
            : document.body.scrollLeft,
          y = supportPageOffset
            ? window.pageYOffset
            : isCSS1Compat
            ? document.documentElement.scrollTop
            : document.body.scrollTop;
        return { x: x, y: y };
      }
      function getActions() {
        return window.navigator.pointerEnabled
          ? { start: "pointerdown", move: "pointermove", end: "pointerup" }
          : window.navigator.msPointerEnabled
          ? {
              start: "MSPointerDown",
              move: "MSPointerMove",
              end: "MSPointerUp"
            }
          : {
              start: "mousedown touchstart",
              move: "mousemove touchmove",
              end: "mouseup touchend"
            };
      }
      function subRangeRatio(pa, pb) {
        return 100 / (pb - pa);
      }
      function fromPercentage(range, value) {
        return (100 * value) / (range[1] - range[0]);
      }
      function toPercentage(range, value) {
        return fromPercentage(
          range,
          range[0] < 0 ? value + Math.abs(range[0]) : value - range[0]
        );
      }
      function isPercentage(range, value) {
        return (value * (range[1] - range[0])) / 100 + range[0];
      }
      function getJ(value, arr) {
        for (var j = 1; value >= arr[j]; ) j += 1;
        return j;
      }
      function toStepping(xVal, xPct, value) {
        if (value >= xVal.slice(-1)[0]) return 100;
        var va,
          vb,
          pa,
          pb,
          j = getJ(value, xVal);
        return (
          (va = xVal[j - 1]),
          (vb = xVal[j]),
          (pa = xPct[j - 1]),
          (pb = xPct[j]),
          pa + toPercentage([va, vb], value) / subRangeRatio(pa, pb)
        );
      }
      function fromStepping(xVal, xPct, value) {
        if (value >= 100) return xVal.slice(-1)[0];
        var va,
          vb,
          pa,
          pb,
          j = getJ(value, xPct);
        return (
          (va = xVal[j - 1]),
          (vb = xVal[j]),
          (pa = xPct[j - 1]),
          (pb = xPct[j]),
          isPercentage([va, vb], (value - pa) * subRangeRatio(pa, pb))
        );
      }
      function getStep(xPct, xSteps, snap, value) {
        if (100 === value) return value;
        var a,
          b,
          j = getJ(value, xPct);
        return snap
          ? ((a = xPct[j - 1]), (b = xPct[j]), value - a > (b - a) / 2 ? b : a)
          : xSteps[j - 1]
          ? xPct[j - 1] + closest(value - xPct[j - 1], xSteps[j - 1])
          : value;
      }
      function handleEntryPoint(index, value, that) {
        var percentage;
        if (
          ("number" == typeof value && (value = [value]),
          "[object Array]" !== Object.prototype.toString.call(value))
        )
          throw new Error("noUiSlider: 'range' contains invalid value.");
        if (
          ((percentage =
            "min" === index ? 0 : "max" === index ? 100 : parseFloat(index)),
          !isNumeric(percentage) || !isNumeric(value[0]))
        )
          throw new Error("noUiSlider: 'range' value isn't numeric.");
        that.xPct.push(percentage),
          that.xVal.push(value[0]),
          percentage
            ? that.xSteps.push(isNaN(value[1]) ? !1 : value[1])
            : isNaN(value[1]) || (that.xSteps[0] = value[1]);
      }
      function handleStepPoint(i, n, that) {
        return n
          ? ((that.xSteps[i] =
              fromPercentage([that.xVal[i], that.xVal[i + 1]], n) /
              subRangeRatio(that.xPct[i], that.xPct[i + 1])),
            void 0)
          : !0;
      }
      function Spectrum(entry, snap, direction, singleStep) {
        (this.xPct = []),
          (this.xVal = []),
          (this.xSteps = [singleStep || !1]),
          (this.xNumSteps = [!1]),
          (this.snap = snap),
          (this.direction = direction);
        var index,
          ordered = [];
        for (index in entry)
          entry.hasOwnProperty(index) && ordered.push([entry[index], index]);
        for (
          ordered.length && "object" == typeof ordered[0][0]
            ? ordered.sort(function(a, b) {
                return a[0][0] - b[0][0];
              })
            : ordered.sort(function(a, b) {
                return a[0] - b[0];
              }),
            index = 0;
          index < ordered.length;
          index++
        )
          handleEntryPoint(ordered[index][1], ordered[index][0], this);
        for (
          this.xNumSteps = this.xSteps.slice(0), index = 0;
          index < this.xNumSteps.length;
          index++
        )
          handleStepPoint(index, this.xNumSteps[index], this);
      }
      function testStep(parsed, entry) {
        if (!isNumeric(entry))
          throw new Error("noUiSlider: 'step' is not numeric.");
        parsed.singleStep = entry;
      }
      function testRange(parsed, entry) {
        if ("object" != typeof entry || Array.isArray(entry))
          throw new Error("noUiSlider: 'range' is not an object.");
        if (void 0 === entry.min || void 0 === entry.max)
          throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");
        if (entry.min === entry.max)
          throw new Error(
            "noUiSlider: 'range' 'min' and 'max' cannot be equal."
          );
        parsed.spectrum = new Spectrum(
          entry,
          parsed.snap,
          parsed.dir,
          parsed.singleStep
        );
      }
      function testStart(parsed, entry) {
        if (
          ((entry = asArray(entry)),
          !Array.isArray(entry) || !entry.length || entry.length > 2)
        )
          throw new Error("noUiSlider: 'start' option is incorrect.");
        (parsed.handles = entry.length), (parsed.start = entry);
      }
      function testSnap(parsed, entry) {
        if (((parsed.snap = entry), "boolean" != typeof entry))
          throw new Error("noUiSlider: 'snap' option must be a boolean.");
      }
      function testAnimate(parsed, entry) {
        if (((parsed.animate = entry), "boolean" != typeof entry))
          throw new Error("noUiSlider: 'animate' option must be a boolean.");
      }
      function testAnimationDuration(parsed, entry) {
        if (((parsed.animationDuration = entry), "number" != typeof entry))
          throw new Error(
            "noUiSlider: 'animationDuration' option must be a number."
          );
      }
      function testConnect(parsed, entry) {
        if ("lower" === entry && 1 === parsed.handles) parsed.connect = 1;
        else if ("upper" === entry && 1 === parsed.handles) parsed.connect = 2;
        else if (entry === !0 && 2 === parsed.handles) parsed.connect = 3;
        else {
          if (entry !== !1)
            throw new Error(
              "noUiSlider: 'connect' option doesn't match handle count."
            );
          parsed.connect = 0;
        }
      }
      function testOrientation(parsed, entry) {
        switch (entry) {
          case "horizontal":
            parsed.ort = 0;
            break;
          case "vertical":
            parsed.ort = 1;
            break;
          default:
            throw new Error("noUiSlider: 'orientation' option is invalid.");
        }
      }
      function testMargin(parsed, entry) {
        if (!isNumeric(entry))
          throw new Error("noUiSlider: 'margin' option must be numeric.");
        if (
          0 !== entry &&
          ((parsed.margin = parsed.spectrum.getMargin(entry)), !parsed.margin)
        )
          throw new Error(
            "noUiSlider: 'margin' option is only supported on linear sliders."
          );
      }
      function testLimit(parsed, entry) {
        if (!isNumeric(entry))
          throw new Error("noUiSlider: 'limit' option must be numeric.");
        if (((parsed.limit = parsed.spectrum.getMargin(entry)), !parsed.limit))
          throw new Error(
            "noUiSlider: 'limit' option is only supported on linear sliders."
          );
      }
      function testDirection(parsed, entry) {
        switch (entry) {
          case "ltr":
            parsed.dir = 0;
            break;
          case "rtl":
            (parsed.dir = 1), (parsed.connect = [0, 2, 1, 3][parsed.connect]);
            break;
          default:
            throw new Error(
              "noUiSlider: 'direction' option was not recognized."
            );
        }
      }
      function testBehaviour(parsed, entry) {
        if ("string" != typeof entry)
          throw new Error(
            "noUiSlider: 'behaviour' must be a string containing options."
          );
        var tap = entry.indexOf("tap") >= 0,
          drag = entry.indexOf("drag") >= 0,
          fixed = entry.indexOf("fixed") >= 0,
          snap = entry.indexOf("snap") >= 0,
          hover = entry.indexOf("hover") >= 0;
        if (drag && !parsed.connect)
          throw new Error(
            "noUiSlider: 'drag' behaviour must be used with 'connect': true."
          );
        parsed.events = {
          tap: tap || snap,
          drag: drag,
          fixed: fixed,
          snap: snap,
          hover: hover
        };
      }
      function testTooltips(parsed, entry) {
        var i;
        if (entry !== !1)
          if (entry === !0)
            for (parsed.tooltips = [], i = 0; i < parsed.handles; i++)
              parsed.tooltips.push(!0);
          else {
            if (
              ((parsed.tooltips = asArray(entry)),
              parsed.tooltips.length !== parsed.handles)
            )
              throw new Error(
                "noUiSlider: must pass a formatter for all handles."
              );
            parsed.tooltips.forEach(function(formatter) {
              if (
                "boolean" != typeof formatter &&
                ("object" != typeof formatter ||
                  "function" != typeof formatter.to)
              )
                throw new Error(
                  "noUiSlider: 'tooltips' must be passed a formatter or 'false'."
                );
            });
          }
      }
      function testFormat(parsed, entry) {
        if (
          ((parsed.format = entry),
          "function" == typeof entry.to && "function" == typeof entry.from)
        )
          return !0;
        throw new Error(
          "noUiSlider: 'format' requires 'to' and 'from' methods."
        );
      }
      function testCssPrefix(parsed, entry) {
        if (void 0 !== entry && "string" != typeof entry && entry !== !1)
          throw new Error(
            "noUiSlider: 'cssPrefix' must be a string or `false`."
          );
        parsed.cssPrefix = entry;
      }
      function testCssClasses(parsed, entry) {
        if (void 0 !== entry && "object" != typeof entry)
          throw new Error("noUiSlider: 'cssClasses' must be an object.");
        if ("string" == typeof parsed.cssPrefix) {
          parsed.cssClasses = {};
          for (var key in entry)
            entry.hasOwnProperty(key) &&
              (parsed.cssClasses[key] = parsed.cssPrefix + entry[key]);
        } else parsed.cssClasses = entry;
      }
      function testOptions(options) {
        var tests,
          parsed = {
            margin: 0,
            limit: 0,
            animate: !0,
            animationDuration: 300,
            format: defaultFormatter
          };
        tests = {
          step: { r: !1, t: testStep },
          start: { r: !0, t: testStart },
          connect: { r: !0, t: testConnect },
          direction: { r: !0, t: testDirection },
          snap: { r: !1, t: testSnap },
          animate: { r: !1, t: testAnimate },
          animationDuration: { r: !1, t: testAnimationDuration },
          range: { r: !0, t: testRange },
          orientation: { r: !1, t: testOrientation },
          margin: { r: !1, t: testMargin },
          limit: { r: !1, t: testLimit },
          behaviour: { r: !0, t: testBehaviour },
          format: { r: !1, t: testFormat },
          tooltips: { r: !1, t: testTooltips },
          cssPrefix: { r: !1, t: testCssPrefix },
          cssClasses: { r: !1, t: testCssClasses }
        };
        var defaults = {
          connect: !1,
          direction: "ltr",
          behaviour: "tap",
          orientation: "horizontal",
          cssPrefix: "noUi-",
          cssClasses: {
            target: "target",
            base: "base",
            origin: "origin",
            handle: "handle",
            handleLower: "handle-lower",
            handleUpper: "handle-upper",
            horizontal: "horizontal",
            vertical: "vertical",
            background: "background",
            connect: "connect",
            ltr: "ltr",
            rtl: "rtl",
            draggable: "draggable",
            drag: "state-drag",
            tap: "state-tap",
            active: "active",
            stacking: "stacking",
            tooltip: "tooltip",
            pips: "pips",
            pipsHorizontal: "pips-horizontal",
            pipsVertical: "pips-vertical",
            marker: "marker",
            markerHorizontal: "marker-horizontal",
            markerVertical: "marker-vertical",
            markerNormal: "marker-normal",
            markerLarge: "marker-large",
            markerSub: "marker-sub",
            value: "value",
            valueHorizontal: "value-horizontal",
            valueVertical: "value-vertical",
            valueNormal: "value-normal",
            valueLarge: "value-large",
            valueSub: "value-sub"
          }
        };
        return (
          Object.keys(tests).forEach(function(name) {
            if (void 0 === options[name] && void 0 === defaults[name]) {
              if (tests[name].r)
                throw new Error("noUiSlider: '" + name + "' is required.");
              return !0;
            }
            tests[name].t(
              parsed,
              void 0 === options[name] ? defaults[name] : options[name]
            );
          }),
          (parsed.pips = options.pips),
          (parsed.style = parsed.ort ? "top" : "left"),
          parsed
        );
      }
      function closure(target, options, originalOptions) {
        function getPositions(a, b, delimit) {
          var c = a + b[0],
            d = a + b[1];
          return delimit
            ? (0 > c && (d += Math.abs(c)),
              d > 100 && (c -= d - 100),
              [limit(c), limit(d)])
            : [c, d];
        }
        function fixEvent(e, pageOffset) {
          e.preventDefault();
          var x,
            y,
            touch = 0 === e.type.indexOf("touch"),
            mouse = 0 === e.type.indexOf("mouse"),
            pointer = 0 === e.type.indexOf("pointer"),
            event = e;
          return (
            0 === e.type.indexOf("MSPointer") && (pointer = !0),
            touch &&
              ((x = e.changedTouches[0].pageX),
              (y = e.changedTouches[0].pageY)),
            (pageOffset = pageOffset || getPageOffset()),
            (mouse || pointer) &&
              ((x = e.clientX + pageOffset.x), (y = e.clientY + pageOffset.y)),
            (event.pageOffset = pageOffset),
            (event.points = [x, y]),
            (event.cursor = mouse || pointer),
            event
          );
        }
        function addHandle(direction, index) {
          var origin = document.createElement("div"),
            handle = document.createElement("div"),
            classModifier = [
              options.cssClasses.handleLower,
              options.cssClasses.handleUpper
            ];
          return (
            direction && classModifier.reverse(),
            addClass(handle, options.cssClasses.handle),
            addClass(handle, classModifier[index]),
            addClass(origin, options.cssClasses.origin),
            origin.appendChild(handle),
            origin
          );
        }
        function addConnection(connect, target, handles) {
          switch (connect) {
            case 1:
              addClass(target, options.cssClasses.connect),
                addClass(handles[0], options.cssClasses.background);
              break;
            case 3:
              addClass(handles[1], options.cssClasses.background);
            case 2:
              addClass(handles[0], options.cssClasses.connect);
            case 0:
              addClass(target, options.cssClasses.background);
          }
        }
        function addHandles(nrHandles, direction, base) {
          var index,
            handles = [];
          for (index = 0; nrHandles > index; index += 1)
            handles.push(base.appendChild(addHandle(direction, index)));
          return handles;
        }
        function addSlider(direction, orientation, target) {
          addClass(target, options.cssClasses.target),
            0 === direction
              ? addClass(target, options.cssClasses.ltr)
              : addClass(target, options.cssClasses.rtl),
            0 === orientation
              ? addClass(target, options.cssClasses.horizontal)
              : addClass(target, options.cssClasses.vertical);
          var div = document.createElement("div");
          return (
            addClass(div, options.cssClasses.base), target.appendChild(div), div
          );
        }
        function addTooltip(handle, index) {
          if (!options.tooltips[index]) return !1;
          var element = document.createElement("div");
          return (
            (element.className = options.cssClasses.tooltip),
            handle.firstChild.appendChild(element)
          );
        }
        function tooltips() {
          options.dir && options.tooltips.reverse();
          var tips = scope_Handles.map(addTooltip);
          options.dir && (tips.reverse(), options.tooltips.reverse()),
            bindEvent("update", function(f, o, r) {
              tips[o] &&
                (tips[o].innerHTML =
                  options.tooltips[o] === !0
                    ? f[o]
                    : options.tooltips[o].to(r[o]));
            });
        }
        function getGroup(mode, values, stepped) {
          if ("range" === mode || "steps" === mode) return scope_Spectrum.xVal;
          if ("count" === mode) {
            var v,
              spread = 100 / (values - 1),
              i = 0;
            for (values = []; (v = i++ * spread) <= 100; ) values.push(v);
            mode = "positions";
          }
          return "positions" === mode
            ? values.map(function(value) {
                return scope_Spectrum.fromStepping(
                  stepped ? scope_Spectrum.getStep(value) : value
                );
              })
            : "values" === mode
            ? stepped
              ? values.map(function(value) {
                  return scope_Spectrum.fromStepping(
                    scope_Spectrum.getStep(scope_Spectrum.toStepping(value))
                  );
                })
              : values
            : void 0;
        }
        function generateSpread(density, mode, group) {
          function safeIncrement(value, increment) {
            return (value + increment).toFixed(7) / 1;
          }
          var originalSpectrumDirection = scope_Spectrum.direction,
            indexes = {},
            firstInRange = scope_Spectrum.xVal[0],
            lastInRange = scope_Spectrum.xVal[scope_Spectrum.xVal.length - 1],
            ignoreFirst = !1,
            ignoreLast = !1,
            prevPct = 0;
          return (
            (scope_Spectrum.direction = 0),
            (group = unique(
              group.slice().sort(function(a, b) {
                return a - b;
              })
            )),
            group[0] !== firstInRange &&
              (group.unshift(firstInRange), (ignoreFirst = !0)),
            group[group.length - 1] !== lastInRange &&
              (group.push(lastInRange), (ignoreLast = !0)),
            group.forEach(function(current, index) {
              var step,
                i,
                q,
                newPct,
                pctDifference,
                pctPos,
                type,
                steps,
                realSteps,
                stepsize,
                low = current,
                high = group[index + 1];
              if (
                ("steps" === mode && (step = scope_Spectrum.xNumSteps[index]),
                step || (step = high - low),
                low !== !1 && void 0 !== high)
              )
                for (i = low; high >= i; i = safeIncrement(i, step)) {
                  for (
                    newPct = scope_Spectrum.toStepping(i),
                      pctDifference = newPct - prevPct,
                      steps = pctDifference / density,
                      realSteps = Math.round(steps),
                      stepsize = pctDifference / realSteps,
                      q = 1;
                    realSteps >= q;
                    q += 1
                  )
                    (pctPos = prevPct + q * stepsize),
                      (indexes[pctPos.toFixed(5)] = ["x", 0]);
                  (type = group.indexOf(i) > -1 ? 1 : "steps" === mode ? 2 : 0),
                    !index && ignoreFirst && (type = 0),
                    (i === high && ignoreLast) ||
                      (indexes[newPct.toFixed(5)] = [i, type]),
                    (prevPct = newPct);
                }
            }),
            (scope_Spectrum.direction = originalSpectrumDirection),
            indexes
          );
        }
        function addMarking(spread, filterFunc, formatter) {
          function getClasses(type, source) {
            var a = source === options.cssClasses.value,
              orientationClasses = a
                ? valueOrientationClasses
                : markerOrientationClasses,
              sizeClasses = a ? valueSizeClasses : markerSizeClasses;
            return (
              source +
              " " +
              orientationClasses[options.ort] +
              " " +
              sizeClasses[type]
            );
          }
          function getTags(offset, source, values) {
            return (
              'class="' +
              getClasses(values[1], source) +
              '" style="' +
              options.style +
              ": " +
              offset +
              '%"'
            );
          }
          function addSpread(offset, values) {
            scope_Spectrum.direction && (offset = 100 - offset),
              (values[1] =
                values[1] && filterFunc
                  ? filterFunc(values[0], values[1])
                  : values[1]),
              (out +=
                "<div " +
                getTags(offset, options.cssClasses.marker, values) +
                "></div>"),
              values[1] &&
                (out +=
                  "<div " +
                  getTags(offset, options.cssClasses.value, values) +
                  ">" +
                  formatter.to(values[0]) +
                  "</div>");
          }
          var element = document.createElement("div"),
            out = "",
            valueSizeClasses = [
              options.cssClasses.valueNormal,
              options.cssClasses.valueLarge,
              options.cssClasses.valueSub
            ],
            markerSizeClasses = [
              options.cssClasses.markerNormal,
              options.cssClasses.markerLarge,
              options.cssClasses.markerSub
            ],
            valueOrientationClasses = [
              options.cssClasses.valueHorizontal,
              options.cssClasses.valueVertical
            ],
            markerOrientationClasses = [
              options.cssClasses.markerHorizontal,
              options.cssClasses.markerVertical
            ];
          return (
            addClass(element, options.cssClasses.pips),
            addClass(
              element,
              0 === options.ort
                ? options.cssClasses.pipsHorizontal
                : options.cssClasses.pipsVertical
            ),
            Object.keys(spread).forEach(function(a) {
              addSpread(a, spread[a]);
            }),
            (element.innerHTML = out),
            element
          );
        }
        function pips(grid) {
          var mode = grid.mode,
            density = grid.density || 1,
            filter = grid.filter || !1,
            values = grid.values || !1,
            stepped = grid.stepped || !1,
            group = getGroup(mode, values, stepped),
            spread = generateSpread(density, mode, group),
            format = grid.format || { to: Math.round };
          return scope_Target.appendChild(addMarking(spread, filter, format));
        }
        function baseSize() {
          var rect = scope_Base.getBoundingClientRect(),
            alt = "offset" + ["Width", "Height"][options.ort];
          return 0 === options.ort
            ? rect.width || scope_Base[alt]
            : rect.height || scope_Base[alt];
        }
        function fireEvent(event, handleNumber, tap) {
          var i;
          for (i = 0; i < options.handles; i++)
            if (-1 === scope_Locations[i]) return;
          void 0 !== handleNumber &&
            1 !== options.handles &&
            (handleNumber = Math.abs(handleNumber - options.dir)),
            Object.keys(scope_Events).forEach(function(targetEvent) {
              var eventType = targetEvent.split(".")[0];
              event === eventType &&
                scope_Events[targetEvent].forEach(function(callback) {
                  callback.call(
                    scope_Self,
                    asArray(valueGet()),
                    handleNumber,
                    asArray(
                      inSliderOrder(Array.prototype.slice.call(scope_Values))
                    ),
                    tap || !1,
                    scope_Locations
                  );
                });
            });
        }
        function inSliderOrder(values) {
          return 1 === values.length
            ? values[0]
            : options.dir
            ? values.reverse()
            : values;
        }
        function attach(events, element, callback, data) {
          var method = function(e) {
              return scope_Target.hasAttribute("disabled")
                ? !1
                : hasClass(scope_Target, options.cssClasses.tap)
                ? !1
                : ((e = fixEvent(e, data.pageOffset)),
                  events === actions.start &&
                  void 0 !== e.buttons &&
                  e.buttons > 1
                    ? !1
                    : data.hover && e.buttons
                    ? !1
                    : ((e.calcPoint = e.points[options.ort]),
                      callback(e, data),
                      void 0));
            },
            methods = [];
          return (
            events.split(" ").forEach(function(eventName) {
              element.addEventListener(eventName, method, !1),
                methods.push([eventName, method]);
            }),
            methods
          );
        }
        function move(event, data) {
          if (
            -1 === navigator.appVersion.indexOf("MSIE 9") &&
            0 === event.buttons &&
            0 !== data.buttonsProperty
          )
            return end(event, data);
          var positions,
            i,
            handles = data.handles || scope_Handles,
            state = !1,
            proposal = (100 * (event.calcPoint - data.start)) / data.baseSize,
            handleNumber = handles[0] === scope_Handles[0] ? 0 : 1;
          if (
            ((positions = getPositions(
              proposal,
              data.positions,
              handles.length > 1
            )),
            (state = setHandle(
              handles[0],
              positions[handleNumber],
              1 === handles.length
            )),
            handles.length > 1)
          ) {
            if (
              (state =
                setHandle(handles[1], positions[handleNumber ? 0 : 1], !1) ||
                state)
            )
              for (i = 0; i < data.handles.length; i++) fireEvent("slide", i);
          } else state && fireEvent("slide", handleNumber);
        }
        function end(event, data) {
          var active = scope_Base.querySelector(
              "." + options.cssClasses.active
            ),
            handleNumber = data.handles[0] === scope_Handles[0] ? 0 : 1;
          null !== active && removeClass(active, options.cssClasses.active),
            event.cursor &&
              ((document.body.style.cursor = ""),
              document.body.removeEventListener(
                "selectstart",
                document.body.noUiListener
              ));
          var d = document.documentElement;
          d.noUiListeners.forEach(function(c) {
            d.removeEventListener(c[0], c[1]);
          }),
            removeClass(scope_Target, options.cssClasses.drag),
            fireEvent("set", handleNumber),
            fireEvent("change", handleNumber),
            void 0 !== data.handleNumber && fireEvent("end", data.handleNumber);
        }
        function documentLeave(event, data) {
          "mouseout" === event.type &&
            "HTML" === event.target.nodeName &&
            null === event.relatedTarget &&
            end(event, data);
        }
        function start(event, data) {
          var d = document.documentElement;
          if (1 === data.handles.length) {
            if (data.handles[0].hasAttribute("disabled")) return !1;
            addClass(data.handles[0].children[0], options.cssClasses.active);
          }
          event.preventDefault(), event.stopPropagation();
          var moveEvent = attach(actions.move, d, move, {
              start: event.calcPoint,
              baseSize: baseSize(),
              pageOffset: event.pageOffset,
              handles: data.handles,
              handleNumber: data.handleNumber,
              buttonsProperty: event.buttons,
              positions: [
                scope_Locations[0],
                scope_Locations[scope_Handles.length - 1]
              ]
            }),
            endEvent = attach(actions.end, d, end, {
              handles: data.handles,
              handleNumber: data.handleNumber
            }),
            outEvent = attach("mouseout", d, documentLeave, {
              handles: data.handles,
              handleNumber: data.handleNumber
            });
          if (
            ((d.noUiListeners = moveEvent.concat(endEvent, outEvent)),
            event.cursor)
          ) {
            (document.body.style.cursor = getComputedStyle(
              event.target
            ).cursor),
              scope_Handles.length > 1 &&
                addClass(scope_Target, options.cssClasses.drag);
            var f = function() {
              return !1;
            };
            (document.body.noUiListener = f),
              document.body.addEventListener("selectstart", f, !1);
          }
          void 0 !== data.handleNumber && fireEvent("start", data.handleNumber);
        }
        function tap(event) {
          var handleNumber,
            to,
            location = event.calcPoint,
            total = 0;
          return (
            event.stopPropagation(),
            scope_Handles.forEach(function(a) {
              total += offset(a)[options.style];
            }),
            (handleNumber =
              total / 2 > location || 1 === scope_Handles.length ? 0 : 1),
            scope_Handles[handleNumber].hasAttribute("disabled") &&
              (handleNumber = handleNumber ? 0 : 1),
            (location -= offset(scope_Base)[options.style]),
            (to = (100 * location) / baseSize()),
            options.events.snap ||
              addClassFor(
                scope_Target,
                options.cssClasses.tap,
                options.animationDuration
              ),
            scope_Handles[handleNumber].hasAttribute("disabled")
              ? !1
              : (setHandle(scope_Handles[handleNumber], to),
                fireEvent("slide", handleNumber, !0),
                fireEvent("set", handleNumber, !0),
                fireEvent("change", handleNumber, !0),
                options.events.snap &&
                  start(event, { handles: [scope_Handles[handleNumber]] }),
                void 0)
          );
        }
        function hover(event) {
          var location = event.calcPoint - offset(scope_Base)[options.style],
            to = scope_Spectrum.getStep((100 * location) / baseSize()),
            value = scope_Spectrum.fromStepping(to);
          Object.keys(scope_Events).forEach(function(targetEvent) {
            "hover" === targetEvent.split(".")[0] &&
              scope_Events[targetEvent].forEach(function(callback) {
                callback.call(scope_Self, value);
              });
          });
        }
        function events(behaviour) {
          if (
            (behaviour.fixed ||
              scope_Handles.forEach(function(handle, index) {
                attach(actions.start, handle.children[0], start, {
                  handles: [handle],
                  handleNumber: index
                });
              }),
            behaviour.tap &&
              attach(actions.start, scope_Base, tap, {
                handles: scope_Handles
              }),
            behaviour.hover &&
              attach(actions.move, scope_Base, hover, { hover: !0 }),
            behaviour.drag)
          ) {
            var drag = [
              scope_Base.querySelector("." + options.cssClasses.connect)
            ];
            addClass(drag[0], options.cssClasses.draggable),
              behaviour.fixed &&
                drag.push(
                  scope_Handles[drag[0] === scope_Handles[0] ? 1 : 0]
                    .children[0]
                ),
              drag.forEach(function(element) {
                attach(actions.start, element, start, {
                  handles: scope_Handles
                });
              });
          }
        }
        function setHandle(handle, to, noLimitOption) {
          var trigger = handle !== scope_Handles[0] ? 1 : 0,
            lowerMargin = scope_Locations[0] + options.margin,
            upperMargin = scope_Locations[1] - options.margin,
            lowerLimit = scope_Locations[0] + options.limit,
            upperLimit = scope_Locations[1] - options.limit;
          return (
            scope_Handles.length > 1 &&
              (to = trigger
                ? Math.max(to, lowerMargin)
                : Math.min(to, upperMargin)),
            noLimitOption !== !1 &&
              options.limit &&
              scope_Handles.length > 1 &&
              (to = trigger
                ? Math.min(to, lowerLimit)
                : Math.max(to, upperLimit)),
            (to = scope_Spectrum.getStep(to)),
            (to = limit(to)),
            to === scope_Locations[trigger]
              ? !1
              : (window.requestAnimationFrame
                  ? window.requestAnimationFrame(function() {
                      handle.style[options.style] = to + "%";
                    })
                  : (handle.style[options.style] = to + "%"),
                handle.previousSibling ||
                  (removeClass(handle, options.cssClasses.stacking),
                  to > 50 && addClass(handle, options.cssClasses.stacking)),
                (scope_Locations[trigger] = to),
                (scope_Values[trigger] = scope_Spectrum.fromStepping(to)),
                fireEvent("update", trigger),
                !0)
          );
        }
        function setValues(count, values) {
          var i, trigger, to;
          for (options.limit && (count += 1), i = 0; count > i; i += 1)
            (trigger = i % 2),
              (to = values[trigger]),
              null !== to &&
                to !== !1 &&
                ("number" == typeof to && (to = String(to)),
                (to = options.format.from(to)),
                (to === !1 ||
                  isNaN(to) ||
                  setHandle(
                    scope_Handles[trigger],
                    scope_Spectrum.toStepping(to),
                    i === 3 - options.dir
                  ) === !1) &&
                  fireEvent("update", trigger));
        }
        function valueSet(input, fireSetEvent) {
          var count,
            i,
            values = asArray(input);
          for (
            fireSetEvent = void 0 === fireSetEvent ? !0 : !!fireSetEvent,
              options.dir && options.handles > 1 && values.reverse(),
              options.animate &&
                -1 !== scope_Locations[0] &&
                addClassFor(
                  scope_Target,
                  options.cssClasses.tap,
                  options.animationDuration
                ),
              count = scope_Handles.length > 1 ? 3 : 1,
              1 === values.length && (count = 1),
              setValues(count, values),
              i = 0;
            i < scope_Handles.length;
            i++
          )
            null !== values[i] && fireSetEvent && fireEvent("set", i);
        }
        function valueGet() {
          var i,
            retour = [];
          for (i = 0; i < options.handles; i += 1)
            retour[i] = options.format.to(scope_Values[i]);
          return inSliderOrder(retour);
        }
        function destroy() {
          for (var key in options.cssClasses)
            options.cssClasses.hasOwnProperty(key) &&
              removeClass(scope_Target, options.cssClasses[key]);
          for (; scope_Target.firstChild; )
            scope_Target.removeChild(scope_Target.firstChild);
          delete scope_Target.noUiSlider;
        }
        function getCurrentStep() {
          var retour = scope_Locations.map(function(location, index) {
            var step = scope_Spectrum.getApplicableStep(location),
              stepDecimals = countDecimals(String(step[2])),
              value = scope_Values[index],
              increment = 100 === location ? null : step[2],
              prev = Number((value - step[2]).toFixed(stepDecimals)),
              decrement =
                0 === location
                  ? null
                  : prev >= step[1]
                  ? step[2]
                  : step[0] || !1;
            return [decrement, increment];
          });
          return inSliderOrder(retour);
        }
        function bindEvent(namespacedEvent, callback) {
          (scope_Events[namespacedEvent] = scope_Events[namespacedEvent] || []),
            scope_Events[namespacedEvent].push(callback),
            "update" === namespacedEvent.split(".")[0] &&
              scope_Handles.forEach(function(a, index) {
                fireEvent("update", index);
              });
        }
        function removeEvent(namespacedEvent) {
          var event = namespacedEvent && namespacedEvent.split(".")[0],
            namespace = event && namespacedEvent.substring(event.length);
          Object.keys(scope_Events).forEach(function(bind) {
            var tEvent = bind.split(".")[0],
              tNamespace = bind.substring(tEvent.length);
            (event && event !== tEvent) ||
              (namespace && namespace !== tNamespace) ||
              delete scope_Events[bind];
          });
        }
        function updateOptions(optionsToUpdate, fireSetEvent) {
          var v = valueGet(),
            newOptions = testOptions({
              start: [0, 0],
              margin: optionsToUpdate.margin,
              limit: optionsToUpdate.limit,
              step:
                void 0 === optionsToUpdate.step
                  ? options.singleStep
                  : optionsToUpdate.step,
              range: optionsToUpdate.range,
              animate: optionsToUpdate.animate,
              snap:
                void 0 === optionsToUpdate.snap
                  ? options.snap
                  : optionsToUpdate.snap
            });
          ["margin", "limit", "range", "animate"].forEach(function(name) {
            void 0 !== optionsToUpdate[name] &&
              (options[name] = optionsToUpdate[name]);
          }),
            (newOptions.spectrum.direction = scope_Spectrum.direction),
            (scope_Spectrum = newOptions.spectrum),
            (scope_Locations = [-1, -1]),
            valueSet(optionsToUpdate.start || v, fireSetEvent);
        }
        var scope_Base,
          scope_Handles,
          scope_Self,
          actions = getActions(),
          scope_Target = target,
          scope_Locations = [-1, -1],
          scope_Spectrum = options.spectrum,
          scope_Values = [],
          scope_Events = {};
        if (scope_Target.noUiSlider)
          throw new Error("Slider was already initialized.");
        return (
          (scope_Base = addSlider(options.dir, options.ort, scope_Target)),
          (scope_Handles = addHandles(
            options.handles,
            options.dir,
            scope_Base
          )),
          addConnection(options.connect, scope_Target, scope_Handles),
          options.pips && pips(options.pips),
          options.tooltips && tooltips(),
          (scope_Self = {
            destroy: destroy,
            steps: getCurrentStep,
            on: bindEvent,
            off: removeEvent,
            get: valueGet,
            set: valueSet,
            updateOptions: updateOptions,
            options: originalOptions,
            target: scope_Target,
            pips: pips
          }),
          events(options.events),
          scope_Self
        );
      }
      function initialize(target, originalOptions) {
        if (!target.nodeName)
          throw new Error("noUiSlider.create requires a single element.");
        var options = testOptions(originalOptions, target),
          slider = closure(target, options, originalOptions);
        return slider.set(options.start), (target.noUiSlider = slider), slider;
      }
      (Spectrum.prototype.getMargin = function(value) {
        return 2 === this.xPct.length ? fromPercentage(this.xVal, value) : !1;
      }),
        (Spectrum.prototype.toStepping = function(value) {
          return (
            (value = toStepping(this.xVal, this.xPct, value)),
            this.direction && (value = 100 - value),
            value
          );
        }),
        (Spectrum.prototype.fromStepping = function(value) {
          return (
            this.direction && (value = 100 - value),
            fromStepping(this.xVal, this.xPct, value)
          );
        }),
        (Spectrum.prototype.getStep = function(value) {
          return (
            this.direction && (value = 100 - value),
            (value = getStep(this.xPct, this.xSteps, this.snap, value)),
            this.direction && (value = 100 - value),
            value
          );
        }),
        (Spectrum.prototype.getApplicableStep = function(value) {
          var j = getJ(value, this.xPct),
            offset = 100 === value ? 2 : 1;
          return [
            this.xNumSteps[j - 2],
            this.xVal[j - offset],
            this.xNumSteps[j - offset]
          ];
        }),
        (Spectrum.prototype.convert = function(value) {
          return this.getStep(this.toStepping(value));
        });
      var defaultFormatter = {
        to: function(value) {
          return void 0 !== value && value.toFixed(2);
        },
        from: Number
      };
      return { create: initialize };
    });
  },
  function(module, exports) {
    "use strict";
    function noteY(noteAndOctave, baseOctave, height) {
      var _noteAndOctave$split = noteAndOctave.split(""),
        _noteAndOctave$split2 = _slicedToArray(_noteAndOctave$split, 2),
        note = _noteAndOctave$split2[0],
        octave = _noteAndOctave$split2[1],
        noteIndex = OCTAVE.indexOf(note),
        relativeOctave = parseInt(octave, 10) - baseOctave,
        relativeNote = relativeOctave * OCTAVE.length + noteIndex;
      return height - (relativeNote / (2 * OCTAVE.length)) * height;
    }
    function roundRect(context, x, y, w, h, r) {
      context.beginPath(),
        context.moveTo(x + r, y),
        context.arcTo(x + w, y, x + w, y + h, r),
        context.arcTo(x + w, y + h, x, y + h, r),
        context.arcTo(x, y + h, x, y, r),
        context.arcTo(x, y, x + w, y, r),
        context.closePath();
    }
    function visualizeSequence(
      context,
      sequence,
      baseOctave,
      sequenceDuration,
      currentTime,
      width,
      color
    ) {
      var height = 100,
        iterationsCompleted = Math.floor(currentTime / sequenceDuration),
        timeCompleted = iterationsCompleted * sequenceDuration,
        currentIteration = currentTime - timeCompleted,
        markerX = (width * currentIteration) / sequenceDuration;
      context.clearRect(0, 0, width, height),
        (context.fillStyle = "rgba(220, 220, 220, 0.3)"),
        context.fillRect(0, 0, width, height),
        (context.fillStyle = "rgb(" + color.join(",") + ")"),
        (context.strokeStyle = "#888");
      var _iteratorNormalCompletion = !0,
        _didIteratorError = !1,
        _iteratorError = void 0;
      try {
        for (
          var _step, _iterator = sequence[Symbol.iterator]();
          !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
          _iteratorNormalCompletion = !0
        ) {
          var phrase = _step.value,
            _iteratorNormalCompletion2 = !0,
            _didIteratorError2 = !1,
            _iteratorError2 = void 0;
          try {
            for (
              var _step2, _iterator2 = phrase[Symbol.iterator]();
              !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done);
              _iteratorNormalCompletion2 = !0
            ) {
              var _step2$value = _slicedToArray(_step2.value, 3),
                note = _step2$value[0],
                startAt = _step2$value[1],
                duration = _step2$value[2],
                startX = (startAt / sequenceDuration) * width,
                endX = ((startAt + duration) / sequenceDuration) * width,
                y = noteY(note, baseOctave, height);
              roundRect(context, startX, y - 4, endX - startX, 8, 2),
                context.fill();
            }
          } catch (err) {
            (_didIteratorError2 = !0), (_iteratorError2 = err);
          } finally {
            try {
              !_iteratorNormalCompletion2 &&
                _iterator2.return &&
                _iterator2.return();
            } finally {
              if (_didIteratorError2) throw _iteratorError2;
            }
          }
        }
      } catch (err) {
        (_didIteratorError = !0), (_iteratorError = err);
      } finally {
        try {
          !_iteratorNormalCompletion && _iterator.return && _iterator.return();
        } finally {
          if (_didIteratorError) throw _iteratorError;
        }
      }
      context.beginPath(),
        context.moveTo(markerX, 0),
        context.lineTo(markerX, 100),
        context.stroke();
    }
    Object.defineProperty(exports, "__esModule", { value: !0 });
    var _slicedToArray = (function() {
      function sliceIterator(arr, i) {
        var _arr = [],
          _n = !0,
          _d = !1,
          _e = void 0;
        try {
          for (
            var _s, _i = arr[Symbol.iterator]();
            !(_n = (_s = _i.next()).done) &&
            (_arr.push(_s.value), !i || _arr.length !== i);
            _n = !0
          );
        } catch (err) {
          (_d = !0), (_e = err);
        } finally {
          try {
            !_n && _i["return"] && _i["return"]();
          } finally {
            if (_d) throw _e;
          }
        }
        return _arr;
      }
      return function(arr, i) {
        if (Array.isArray(arr)) return arr;
        if (Symbol.iterator in Object(arr)) return sliceIterator(arr, i);
        throw new TypeError(
          "Invalid attempt to destructure non-iterable instance"
        );
      };
    })();
    exports.visualizeSequence = visualizeSequence;
    var OCTAVE = ["C", "D", "E", "F", "G", "A", "B"];
  },
  function(module, exports) {
    "use strict";
    function relativeNote(noteAndOctave) {
      if (!relNoteCache.hasOwnProperty(noteAndOctave)) {
        var _noteAndOctave$split = noteAndOctave.split(""),
          _noteAndOctave$split2 = _slicedToArray(_noteAndOctave$split, 2),
          note = _noteAndOctave$split2[0],
          octave = _noteAndOctave$split2[1];
        (note = OCTAVE.indexOf(note)),
          (octave = parseInt(octave, 10)),
          (relNoteCache[noteAndOctave] = octave * OCTAVE.length + note - 25);
      }
      return relNoteCache[noteAndOctave];
    }
    function noteRadius(noteAndOctave, minRadius, maxRadius) {
      return Math.floor(
        maxRadius -
          (relativeNote(noteAndOctave) / MAX_REL_NOTE) * (maxRadius - minRadius)
      );
    }
    function visualizeFrippertronics(
      context,
      delay,
      decay,
      events,
      currentTime,
      isPlaying
    ) {
      var width = 650,
        center = width / 2;
      context.clearRect(0, 0, width, width),
        (context.strokeStyle = "#888"),
        (context.lineWidth = 1),
        context.beginPath(),
        context.moveTo(center, center),
        context.lineTo(width, center),
        context.stroke(),
        (context.fillStyle = "rgba(220, 220, 220, 0.2)"),
        context.beginPath(),
        context.arc(center, center, center - 1, 0, 2 * Math.PI),
        context.fill(),
        (context.lineWidth = 0.05 * width);
      for (var i = 0; i < events.length; i++) {
        var note = events[i][0],
          time = events[i][1],
          duration = events[i][2],
          isLast = events[i][3],
          baseColor = events[i][4];
        if (!(time > currentTime)) {
          var endTime = time + duration,
            echoEndTime = time + duration + 2,
            startAge = currentTime - time,
            endAge = Math.max(0, currentTime - endTime),
            echoEndAge = currentTime - echoEndTime,
            limitedEchoEndAge = Math.max(0, echoEndAge),
            ageInLoops = startAge / delay,
            startRad = ((2 * startAge) / delay) * Math.PI,
            endRad = ((2 * endAge) / delay) * Math.PI,
            echoEndRad = ((2 * echoEndAge) / delay) * Math.PI,
            limitedEchoEndRad = ((2 * limitedEchoEndAge) / delay) * Math.PI,
            color =
              "rgba(" +
              baseColor.join(",") +
              ", " +
              Math.pow(decay, ageInLoops) +
              ")",
            radius = noteRadius(note, 20, center - 20);
          if (
            ((context.strokeStyle = color),
            context.beginPath(),
            context.arc(center, center, radius, endRad, startRad),
            context.stroke(),
            isLast)
          ) {
            var echoGradient = context.createLinearGradient(
              Math.floor(center + Math.cos(endRad) * radius),
              Math.floor(center + Math.sin(endRad) * radius),
              Math.floor(center + Math.cos(echoEndRad) * radius),
              Math.floor(center + Math.sin(echoEndRad) * radius)
            );
            echoGradient.addColorStop(0, color),
              echoGradient.addColorStop(
                1,
                "rgba(" + baseColor.join(",") + ",0)"
              ),
              (context.strokeStyle = echoGradient),
              context.beginPath(),
              context.arc(center, center, radius, limitedEchoEndRad, endRad),
              context.stroke();
          }
        }
      }
      isPlaying ||
        ((context.fillStyle = "rgba(0, 0, 0, 0.3)"),
        (context.strokeStyle = "rgba(0, 0, 0, 0)"),
        context.beginPath(),
        context.moveTo(235, 170),
        context.lineTo(485, 325),
        context.lineTo(235, 455),
        context.lineTo(235, 170),
        context.fill());
    }
    Object.defineProperty(exports, "__esModule", { value: !0 });
    var _slicedToArray = (function() {
      function sliceIterator(arr, i) {
        var _arr = [],
          _n = !0,
          _d = !1,
          _e = void 0;
        try {
          for (
            var _s, _i = arr[Symbol.iterator]();
            !(_n = (_s = _i.next()).done) &&
            (_arr.push(_s.value), !i || _arr.length !== i);
            _n = !0
          );
        } catch (err) {
          (_d = !0), (_e = err);
        } finally {
          try {
            !_n && _i["return"] && _i["return"]();
          } finally {
            if (_d) throw _e;
          }
        }
        return _arr;
      }
      return function(arr, i) {
        if (Array.isArray(arr)) return arr;
        if (Symbol.iterator in Object(arr)) return sliceIterator(arr, i);
        throw new TypeError(
          "Invalid attempt to destructure non-iterable instance"
        );
      };
    })();
    exports.visualizeFrippertronics = visualizeFrippertronics;
    var OCTAVE = ["C", "D", "E", "F", "G", "A", "B"],
      MAX_REL_NOTE = 2 * OCTAVE.length + 1,
      relNoteCache = {};
  },
  function(module, exports) {
    "use strict";
    function playSounds(sounds, noteBuffers) {
      noteBuffers.forEach(function(noteBuffer) {
        var bufferSource = sounds.audioCtx.createBufferSource();
        (bufferSource.buffer = noteBuffer.buffer),
          (bufferSource.playbackRate.value = noteBuffer.rate),
          bufferSource.connect(sounds.audioCtx.destination),
          bufferSource.start();
      });
    }
    function addClickListeners(sounds, buttons, buffers) {
      for (
        var _loop = function(i) {
            var button = buttons[i],
              notes = button.getAttribute("play-notes").split(","),
              noteBuffers = buffers.filter(function(b) {
                return notes.indexOf(b.note) >= 0;
              });
            button.addEventListener("click", function() {
              return playSounds(sounds, noteBuffers);
            });
          },
          i = 0;
        i < buttons.length;
        i++
      )
        _loop(i);
    }
    function initNotePlayers(sounds, buttons) {
      sounds.getGrandPianoSampleBuffers().then(function(buf) {
        return addClickListeners(sounds, buttons, buf);
      });
    }
    Object.defineProperty(exports, "__esModule", { value: !0 }),
      (exports.initNotePlayers = initNotePlayers);
  },
  function(module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function playOnClick(container, synthFactory) {
      var button = document.createElement("button");
      (button.style.float = "right"),
        (button.textContent = "Play"),
        button.addEventListener("click", function() {
          var synth = synthFactory();
          synth.triggerAttackRelease("C4", 1),
            setTimeout(function() {
              return synth.dispose();
            }, 5e3);
        }),
        container.insertBefore(button, container.firstChild);
    }
    function initSynthPlayers() {
      function makeMonoSquareSynth() {
        return new _tone2.default.MonoSynth().toMaster();
      }
      function makeSawtoothSynth() {
        return new _tone2.default.MonoSynth({
          oscillator: { type: "sawtooth" }
        }).toMaster();
      }
      function makeSawtoothFilteredSynth() {
        return new _tone2.default.MonoSynth({
          oscillator: { type: "sawtooth" },
          filterEnvelope: { baseFrequency: 200, octaves: 2 }
        }).toMaster();
      }
      function makeSawtoothFilteredImmediatelySynth() {
        return new _tone2.default.MonoSynth({
          oscillator: { type: "sawtooth" },
          filterEnvelope: {
            baseFrequency: 200,
            octaves: 2,
            attack: 0,
            decay: 0
          }
        }).toMaster();
      }
      function makeSynthWithAttack() {
        return new _tone2.default.MonoSynth({
          oscillator: { type: "sawtooth" },
          envelope: { attack: 0.1 },
          filterEnvelope: {
            baseFrequency: 200,
            octaves: 2,
            attack: 0,
            decay: 0
          }
        }).toMaster();
      }
      function makeSynthWithAttackRelease() {
        return new _tone2.default.MonoSynth({
          oscillator: { type: "sawtooth" },
          envelope: { attack: 0.1, release: 4, releaseCurve: "linear" },
          filterEnvelope: {
            baseFrequency: 200,
            octaves: 2,
            attack: 0,
            decay: 0
          }
        }).toMaster();
      }
      function makeSynthWithAttackReleaseFilterFix() {
        return new _tone2.default.MonoSynth({
          oscillator: { type: "sawtooth" },
          envelope: { attack: 0.1, release: 4, releaseCurve: "linear" },
          filterEnvelope: {
            baseFrequency: 200,
            octaves: 2,
            attack: 0,
            decay: 0,
            release: 1e3
          }
        }).toMaster();
      }
      function makeDuoSynth() {
        return new _tone.DuoSynth({
          voice0: {
            oscillator: { type: "sawtooth" },
            envelope: duoEnvelope,
            filterEnvelope: duoFilterEnvelope
          },
          voice1: {
            oscillator: { type: "sine" },
            envelope: duoEnvelope,
            filterEnvelope: duoFilterEnvelope
          }
        }).toMaster();
      }
      function makeDuoSynthUnison() {
        return new _tone.DuoSynth({
          harmonicity: 1,
          voice0: {
            oscillator: { type: "sawtooth" },
            envelope: duoEnvelope,
            filterEnvelope: duoFilterEnvelope
          },
          voice1: {
            oscillator: { type: "sine" },
            envelope: duoEnvelope,
            filterEnvelope: duoFilterEnvelope
          }
        }).toMaster();
      }
      function makeDuoSynthWow() {
        return new _tone.DuoSynth({
          harmonicity: 1,
          voice0: {
            oscillator: { type: "sawtooth" },
            envelope: duoEnvelope,
            filterEnvelope: duoFilterEnvelope
          },
          voice1: {
            oscillator: { type: "sine" },
            envelope: duoEnvelope,
            filterEnvelope: duoFilterEnvelope
          },
          vibratoRate: 0.5,
          vibratoAmount: 0.1
        }).toMaster();
      }
      function makeDuoSynthLeft() {
        var synth = new _tone.DuoSynth({
            harmonicity: 1,
            voice0: {
              oscillator: { type: "sawtooth" },
              envelope: duoEnvelope,
              filterEnvelope: duoFilterEnvelope
            },
            voice1: {
              oscillator: { type: "sine" },
              envelope: duoEnvelope,
              filterEnvelope: duoFilterEnvelope
            },
            vibratoRate: 0.5,
            vibratoAmount: 0.1
          }),
          panLeft = new _tone.Panner(-0.5);
        return synth.connect(panLeft), panLeft.toMaster(), [synth, panLeft];
      }
      function makeDuoSynthRight() {
        var synth = new _tone.DuoSynth({
            harmonicity: 1,
            voice0: {
              oscillator: { type: "sawtooth" },
              envelope: duoEnvelope,
              filterEnvelope: duoFilterEnvelope
            },
            voice1: {
              oscillator: { type: "sine" },
              envelope: duoEnvelope,
              filterEnvelope: duoFilterEnvelope
            },
            vibratoRate: 0.5,
            vibratoAmount: 0.1
          }),
          panRight = new _tone.Panner(0.5);
        return synth.connect(panRight), panRight.toMaster(), [synth, panRight];
      }
      var monoSquare = document.querySelector(".player-synth-monosquare"),
        sawtooth = document.querySelector(".player-synth-sawtooth"),
        sawtoothFiltered = document.querySelector(
          ".player-synth-sawtooth-filtered"
        ),
        sawtoothFilteredImmediately = document.querySelector(
          ".player-synth-sawtooth-filtered-immediately"
        ),
        withAttack = document.querySelector(".player-synth-with-attack"),
        withAttackRelease = document.querySelector(
          ".player-synth-with-attack-release"
        ),
        withAttackReleaseFilterFix = document.querySelector(
          ".player-synth-with-attack-release-filter-fix"
        ),
        duo = document.querySelector(".player-duo-synth"),
        duoRefactored = document.querySelector(".player-duo-synth-refactored"),
        duoUnison = document.querySelector(".player-duo-synth-unison"),
        duoWow = document.querySelector(".player-duo-synth-wow"),
        phraseButtons = document.querySelectorAll(".play-phrase"),
        duoEnvelope = { attack: 0.1, release: 4, releaseCurve: "linear" },
        duoFilterEnvelope = {
          baseFrequency: 200,
          octaves: 2,
          attack: 0,
          decay: 0,
          release: 1e3
        };
      playOnClick(monoSquare, makeMonoSquareSynth),
        playOnClick(sawtooth, makeSawtoothSynth),
        playOnClick(sawtoothFiltered, makeSawtoothFilteredSynth),
        playOnClick(
          sawtoothFilteredImmediately,
          makeSawtoothFilteredImmediatelySynth
        ),
        playOnClick(withAttack, makeSynthWithAttack),
        playOnClick(withAttackRelease, makeSynthWithAttackRelease),
        playOnClick(
          withAttackReleaseFilterFix,
          makeSynthWithAttackReleaseFilterFix
        ),
        playOnClick(duo, makeDuoSynth),
        playOnClick(duoRefactored, makeDuoSynth),
        playOnClick(duoUnison, makeDuoSynthUnison),
        playOnClick(duoWow, makeDuoSynthWow);
      for (
        var _loop = function(i) {
            var phraseButton = phraseButtons[i];
            phraseButton.addEventListener("click", function() {
              var _ref =
                  "left" === phraseButton.getAttribute("data-pan")
                    ? makeDuoSynthLeft()
                    : makeDuoSynthRight(),
                _ref2 = _slicedToArray(_ref, 2),
                synth = _ref2[0],
                pan = _ref2[1],
                phrase = phraseButton.getAttribute("data-phrase");
              "C5-D5" === phrase
                ? (synth.triggerAttackRelease("C5", "1n + 2n"),
                  synth.setNote("D5", "+2n"))
                : "D4-E4" === phrase
                ? (synth.triggerAttackRelease("D4", "1n + 2n"),
                  synth.setNote("E4", "+1n"))
                : "E4" === phrase
                ? synth.triggerAttackRelease("E4", "2n")
                : "B3-G3" === phrase
                ? (synth.triggerAttackRelease("B3", "1n"),
                  synth.setNote("G3", "+2n"))
                : "G4" === phrase
                ? synth.triggerAttackRelease("G4", "2n")
                : "E5-G5-A5-G5" === phrase &&
                  (synth.triggerAttackRelease("E5", "2m"),
                  synth.setNote("G5", "+2n - 8n"),
                  synth.setNote("A5", "+2n + 2n - 4n"),
                  synth.setNote("G5", "+2n + 2n + 2n - 4n - 8n")),
                setTimeout(function() {
                  synth.dispose(), pan.dispose();
                }, 1e4);
            });
          },
          i = 0;
        i < phraseButtons.length;
        i++
      )
        _loop(i);
    }
    Object.defineProperty(exports, "__esModule", { value: !0 });
    var _slicedToArray = (function() {
      function sliceIterator(arr, i) {
        var _arr = [],
          _n = !0,
          _d = !1,
          _e = void 0;
        try {
          for (
            var _s, _i = arr[Symbol.iterator]();
            !(_n = (_s = _i.next()).done) &&
            (_arr.push(_s.value), !i || _arr.length !== i);
            _n = !0
          );
        } catch (err) {
          (_d = !0), (_e = err);
        } finally {
          try {
            !_n && _i["return"] && _i["return"]();
          } finally {
            if (_d) throw _e;
          }
        }
        return _arr;
      }
      return function(arr, i) {
        if (Array.isArray(arr)) return arr;
        if (Symbol.iterator in Object(arr)) return sliceIterator(arr, i);
        throw new TypeError(
          "Invalid attempt to destructure non-iterable instance"
        );
      };
    })();
    exports.initSynthPlayers = initSynthPlayers;
    var _tone = __webpack_require__(6),
      _tone2 = _interopRequireDefault(_tone);
  },
  function(module, exports, __webpack_require__) {
    var content = __webpack_require__(66);
    "string" == typeof content && (content = [[module.id, content, ""]]);
    {
      __webpack_require__(68)(content, {});
    }
    content.locals && (module.exports = content.locals);
  },
  function(module, exports, __webpack_require__) {
    (exports = module.exports = __webpack_require__(67)()),
      exports.push([
        module.id,
        '/*! nouislider - 8.5.1 - 2016-04-24 16:00:30 */\r\n\r\n\r\n.noUi-target,.noUi-target *{-webkit-touch-callout:none;-webkit-user-select:none;-ms-touch-action:none;touch-action:none;-ms-user-select:none;-moz-user-select:none;user-select:none;-moz-box-sizing:border-box;box-sizing:border-box}.noUi-target{position:relative;direction:ltr}.noUi-base{width:100%;height:100%;position:relative;z-index:1}.noUi-origin{position:absolute;right:0;top:0;left:0;bottom:0}.noUi-handle{position:relative;z-index:1}.noUi-stacking .noUi-handle{z-index:10}.noUi-state-tap .noUi-origin{-webkit-transition:left .3s,top .3s;transition:left .3s,top .3s}.noUi-state-drag *{cursor:inherit!important}.noUi-base,.noUi-handle{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}.noUi-horizontal{height:18px}.noUi-horizontal .noUi-handle{width:34px;height:28px;left:-17px;top:-6px}.noUi-vertical{width:18px}.noUi-vertical .noUi-handle{width:28px;height:34px;left:-6px;top:-17px}.noUi-background{background:#FAFAFA;box-shadow:inset 0 1px 1px #f0f0f0}.noUi-connect{background:#3FB8AF;box-shadow:inset 0 0 3px rgba(51,51,51,.45);-webkit-transition:background 450ms;transition:background 450ms}.noUi-origin{border-radius:2px}.noUi-target{border-radius:4px;border:1px solid #D3D3D3;box-shadow:inset 0 1px 1px #F0F0F0,0 3px 6px -5px #BBB}.noUi-target.noUi-connect{box-shadow:inset 0 0 3px rgba(51,51,51,.45),0 3px 6px -5px #BBB}.noUi-draggable{cursor:w-resize}.noUi-vertical .noUi-draggable{cursor:n-resize}.noUi-handle{border:1px solid #D9D9D9;border-radius:3px;background:#FFF;cursor:default;box-shadow:inset 0 0 1px #FFF,inset 0 1px 7px #EBEBEB,0 3px 6px -3px #BBB}.noUi-active{box-shadow:inset 0 0 1px #FFF,inset 0 1px 7px #DDD,0 3px 6px -3px #BBB}.noUi-handle:after,.noUi-handle:before{content:"";display:block;position:absolute;height:14px;width:1px;background:#E8E7E6;left:14px;top:6px}.noUi-handle:after{left:17px}.noUi-vertical .noUi-handle:after,.noUi-vertical .noUi-handle:before{width:14px;height:1px;left:6px;top:14px}.noUi-vertical .noUi-handle:after{top:17px}[disabled] .noUi-connect,[disabled].noUi-connect{background:#B8B8B8}[disabled] .noUi-handle,[disabled].noUi-origin{cursor:not-allowed}.noUi-pips,.noUi-pips *{-moz-box-sizing:border-box;box-sizing:border-box}.noUi-pips{position:absolute;color:#999}.noUi-value{position:absolute;text-align:center}.noUi-value-sub{color:#ccc;font-size:10px}.noUi-marker{position:absolute;background:#CCC}.noUi-marker-large,.noUi-marker-sub{background:#AAA}.noUi-pips-horizontal{padding:10px 0;height:80px;top:100%;left:0;width:100%}.noUi-value-horizontal{-webkit-transform:translate3d(-50%,50%,0);transform:translate3d(-50%,50%,0)}.noUi-marker-horizontal.noUi-marker{margin-left:-1px;width:2px;height:5px}.noUi-marker-horizontal.noUi-marker-sub{height:10px}.noUi-marker-horizontal.noUi-marker-large{height:15px}.noUi-pips-vertical{padding:0 10px;height:100%;top:0;left:100%}.noUi-value-vertical{-webkit-transform:translate3d(0,-50%,0);transform:translate3d(0,-50%,0);padding-left:25px}.noUi-marker-vertical.noUi-marker{width:5px;height:2px;margin-top:-1px}.noUi-marker-vertical.noUi-marker-sub{width:10px}.noUi-marker-vertical.noUi-marker-large{width:15px}.noUi-tooltip{display:block;position:absolute;border:1px solid #D9D9D9;border-radius:3px;background:#fff;padding:5px;text-align:center}.noUi-horizontal .noUi-handle-lower .noUi-tooltip{top:-32px}.noUi-horizontal .noUi-handle-upper .noUi-tooltip{bottom:-32px}.noUi-vertical .noUi-handle-lower .noUi-tooltip{left:120%}.noUi-vertical .noUi-handle-upper .noUi-tooltip{right:120%}',
        ""
      ]);
  },
  function(module) {
    module.exports = function() {
      var list = [];
      return (
        (list.toString = function() {
          for (var result = [], i = 0; i < this.length; i++) {
            var item = this[i];
            item[2]
              ? result.push("@media " + item[2] + "{" + item[1] + "}")
              : result.push(item[1]);
          }
          return result.join("");
        }),
        (list.i = function(modules, mediaQuery) {
          "string" == typeof modules && (modules = [[null, modules, ""]]);
          for (var alreadyImportedModules = {}, i = 0; i < this.length; i++) {
            var id = this[i][0];
            "number" == typeof id && (alreadyImportedModules[id] = !0);
          }
          for (i = 0; i < modules.length; i++) {
            var item = modules[i];
            ("number" == typeof item[0] && alreadyImportedModules[item[0]]) ||
              (mediaQuery && !item[2]
                ? (item[2] = mediaQuery)
                : mediaQuery &&
                  (item[2] = "(" + item[2] + ") and (" + mediaQuery + ")"),
              list.push(item));
          }
        }),
        list
      );
    };
  },
  function(module) {
    function addStylesToDom(styles, options) {
      for (var i = 0; i < styles.length; i++) {
        var item = styles[i],
          domStyle = stylesInDom[item.id];
        if (domStyle) {
          domStyle.refs++;
          for (var j = 0; j < domStyle.parts.length; j++)
            domStyle.parts[j](item.parts[j]);
          for (; j < item.parts.length; j++)
            domStyle.parts.push(addStyle(item.parts[j], options));
        } else {
          for (var parts = [], j = 0; j < item.parts.length; j++)
            parts.push(addStyle(item.parts[j], options));
          stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts };
        }
      }
    }
    function listToStyles(list) {
      for (var styles = [], newStyles = {}, i = 0; i < list.length; i++) {
        var item = list[i],
          id = item[0],
          css = item[1],
          media = item[2],
          sourceMap = item[3],
          part = { css: css, media: media, sourceMap: sourceMap };
        newStyles[id]
          ? newStyles[id].parts.push(part)
          : styles.push((newStyles[id] = { id: id, parts: [part] }));
      }
      return styles;
    }
    function insertStyleElement(options, styleElement) {
      var head = getHeadElement(),
        lastStyleElementInsertedAtTop =
          styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
      if ("top" === options.insertAt)
        lastStyleElementInsertedAtTop
          ? lastStyleElementInsertedAtTop.nextSibling
            ? head.insertBefore(
                styleElement,
                lastStyleElementInsertedAtTop.nextSibling
              )
            : head.appendChild(styleElement)
          : head.insertBefore(styleElement, head.firstChild),
          styleElementsInsertedAtTop.push(styleElement);
      else {
        if ("bottom" !== options.insertAt)
          throw new Error(
            "Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'."
          );
        head.appendChild(styleElement);
      }
    }
    function removeStyleElement(styleElement) {
      styleElement.parentNode.removeChild(styleElement);
      var idx = styleElementsInsertedAtTop.indexOf(styleElement);
      idx >= 0 && styleElementsInsertedAtTop.splice(idx, 1);
    }
    function createStyleElement(options) {
      var styleElement = document.createElement("style");
      return (
        (styleElement.type = "text/css"),
        insertStyleElement(options, styleElement),
        styleElement
      );
    }
    function createLinkElement(options) {
      var linkElement = document.createElement("link");
      return (
        (linkElement.rel = "stylesheet"),
        insertStyleElement(options, linkElement),
        linkElement
      );
    }
    function addStyle(obj, options) {
      var styleElement, update, remove;
      if (options.singleton) {
        var styleIndex = singletonCounter++;
        (styleElement =
          singletonElement || (singletonElement = createStyleElement(options))),
          (update = applyToSingletonTag.bind(
            null,
            styleElement,
            styleIndex,
            !1
          )),
          (remove = applyToSingletonTag.bind(
            null,
            styleElement,
            styleIndex,
            !0
          ));
      } else
        obj.sourceMap &&
        "function" == typeof URL &&
        "function" == typeof URL.createObjectURL &&
        "function" == typeof URL.revokeObjectURL &&
        "function" == typeof Blob &&
        "function" == typeof btoa
          ? ((styleElement = createLinkElement(options)),
            (update = updateLink.bind(null, styleElement)),
            (remove = function() {
              removeStyleElement(styleElement),
                styleElement.href && URL.revokeObjectURL(styleElement.href);
            }))
          : ((styleElement = createStyleElement(options)),
            (update = applyToTag.bind(null, styleElement)),
            (remove = function() {
              removeStyleElement(styleElement);
            }));
      return (
        update(obj),
        function(newObj) {
          if (newObj) {
            if (
              newObj.css === obj.css &&
              newObj.media === obj.media &&
              newObj.sourceMap === obj.sourceMap
            )
              return;
            update((obj = newObj));
          } else remove();
        }
      );
    }
    function applyToSingletonTag(styleElement, index, remove, obj) {
      var css = remove ? "" : obj.css;
      if (styleElement.styleSheet)
        styleElement.styleSheet.cssText = replaceText(index, css);
      else {
        var cssNode = document.createTextNode(css),
          childNodes = styleElement.childNodes;
        childNodes[index] && styleElement.removeChild(childNodes[index]),
          childNodes.length
            ? styleElement.insertBefore(cssNode, childNodes[index])
            : styleElement.appendChild(cssNode);
      }
    }
    function applyToTag(styleElement, obj) {
      var css = obj.css,
        media = obj.media;
      if (
        (media && styleElement.setAttribute("media", media),
        styleElement.styleSheet)
      )
        styleElement.styleSheet.cssText = css;
      else {
        for (; styleElement.firstChild; )
          styleElement.removeChild(styleElement.firstChild);
        styleElement.appendChild(document.createTextNode(css));
      }
    }
    function updateLink(linkElement, obj) {
      var css = obj.css,
        sourceMap = obj.sourceMap;
      sourceMap &&
        (css +=
          "\n/*# sourceMappingURL=data:application/json;base64," +
          btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) +
          " */");
      var blob = new Blob([css], { type: "text/css" }),
        oldSrc = linkElement.href;
      (linkElement.href = URL.createObjectURL(blob)),
        oldSrc && URL.revokeObjectURL(oldSrc);
    }
    var stylesInDom = {},
      memoize = function(fn) {
        var memo;
        return function() {
          return (
            "undefined" == typeof memo && (memo = fn.apply(this, arguments)),
            memo
          );
        };
      },
      isOldIE = memoize(function() {
        return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
      }),
      getHeadElement = memoize(function() {
        return document.head || document.getElementsByTagName("head")[0];
      }),
      singletonElement = null,
      singletonCounter = 0,
      styleElementsInsertedAtTop = [];
    module.exports = function(list, options) {
      (options = options || {}),
        "undefined" == typeof options.singleton &&
          (options.singleton = isOldIE()),
        "undefined" == typeof options.insertAt && (options.insertAt = "bottom");
      var styles = listToStyles(list);
      return (
        addStylesToDom(styles, options),
        function(newList) {
          for (var mayRemove = [], i = 0; i < styles.length; i++) {
            var item = styles[i],
              domStyle = stylesInDom[item.id];
            domStyle.refs--, mayRemove.push(domStyle);
          }
          if (newList) {
            var newStyles = listToStyles(newList);
            addStylesToDom(newStyles, options);
          }
          for (var i = 0; i < mayRemove.length; i++) {
            var domStyle = mayRemove[i];
            if (0 === domStyle.refs) {
              for (var j = 0; j < domStyle.parts.length; j++)
                domStyle.parts[j]();
              delete stylesInDom[domStyle.id];
            }
          }
        }
      );
    };
    var replaceText = (function() {
      var textStore = [];
      return function(index, replacement) {
        return (
          (textStore[index] = replacement), textStore.filter(Boolean).join("\n")
        );
      };
    })();
  },
  function(module, exports, __webpack_require__) {
    var content = __webpack_require__(70);
    "string" == typeof content && (content = [[module.id, content, ""]]);
    {
      __webpack_require__(68)(content, {});
    }
    content.locals && (module.exports = content.locals);
  },
  function(module, exports, __webpack_require__) {
    (exports = module.exports = __webpack_require__(67)()),
      exports.push([
        module.id,
        ".eq .slider-wrapper {\n  /* Float the wrappers so the slider will render side by side */\n  float: left;\n}\n.eq .slider {\n  /* Give some horizontal space around each slider */\n  margin: auto 6px;\n  /* Set the slider height */\n  height: 150px;\n}\n/* Make the frequency labels smaller and lighter */\n.eq label {\n  color: #777;\n  display: block;\n  font-size: 0.5em;\n  text-align: center;\n  margin-bottom: 2em;\n}",
        ""
      ]);
  }
]);
