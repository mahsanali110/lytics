(window.webpackJsonp = window.webpackJsonp || []).push([
  [1],
  {
    0: function (e, t, n) {
      e.exports = n('zUnb');
    },
    zUnb: function (e, t, n) {
      'use strict';
      function s(e) {
        return 'function' == typeof e;
      }
      n.r(t);
      let r = !1;
      const i = {
        Promise: void 0,
        set useDeprecatedSynchronousErrorHandling(e) {
          if (e) {
            const e = new Error();
            console.warn(
              'DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n' +
                e.stack
            );
          } else r && console.log('RxJS: Back to a better error behavior. Thank you. <3');
          r = e;
        },
        get useDeprecatedSynchronousErrorHandling() {
          return r;
        },
      };
      function o(e) {
        setTimeout(() => {
          throw e;
        }, 0);
      }
      const a = {
          closed: !0,
          next(e) {},
          error(e) {
            if (i.useDeprecatedSynchronousErrorHandling) throw e;
            o(e);
          },
          complete() {},
        },
        l = (() => Array.isArray || (e => e && 'number' == typeof e.length))();
      function u(e) {
        return null !== e && 'object' == typeof e;
      }
      const c = (() => {
        function e(e) {
          return (
            Error.call(this),
            (this.message = e
              ? `${e.length} errors occurred during unsubscription:\n${e
                  .map((e, t) => `${t + 1}) ${e.toString()}`)
                  .join('\n  ')}`
              : ''),
            (this.name = 'UnsubscriptionError'),
            (this.errors = e),
            this
          );
        }
        return (e.prototype = Object.create(Error.prototype)), e;
      })();
      let h = (() => {
        class e {
          constructor(e) {
            (this.closed = !1),
              (this._parentOrParents = null),
              (this._subscriptions = null),
              e && (this._unsubscribe = e);
          }
          unsubscribe() {
            let t;
            if (this.closed) return;
            let { _parentOrParents: n, _unsubscribe: r, _subscriptions: i } = this;
            if (
              ((this.closed = !0),
              (this._parentOrParents = null),
              (this._subscriptions = null),
              n instanceof e)
            )
              n.remove(this);
            else if (null !== n) for (let e = 0; e < n.length; ++e) n[e].remove(this);
            if (s(r))
              try {
                r.call(this);
              } catch (o) {
                t = o instanceof c ? d(o.errors) : [o];
              }
            if (l(i)) {
              let e = -1,
                n = i.length;
              for (; ++e < n; ) {
                const n = i[e];
                if (u(n))
                  try {
                    n.unsubscribe();
                  } catch (o) {
                    (t = t || []), o instanceof c ? (t = t.concat(d(o.errors))) : t.push(o);
                  }
              }
            }
            if (t) throw new c(t);
          }
          add(t) {
            let n = t;
            if (!t) return e.EMPTY;
            switch (typeof t) {
              case 'function':
                n = new e(t);
              case 'object':
                if (n === this || n.closed || 'function' != typeof n.unsubscribe) return n;
                if (this.closed) return n.unsubscribe(), n;
                if (!(n instanceof e)) {
                  const t = n;
                  (n = new e()), (n._subscriptions = [t]);
                }
                break;
              default:
                throw new Error('unrecognized teardown ' + t + ' added to Subscription.');
            }
            let { _parentOrParents: s } = n;
            if (null === s) n._parentOrParents = this;
            else if (s instanceof e) {
              if (s === this) return n;
              n._parentOrParents = [s, this];
            } else {
              if (-1 !== s.indexOf(this)) return n;
              s.push(this);
            }
            const r = this._subscriptions;
            return null === r ? (this._subscriptions = [n]) : r.push(n), n;
          }
          remove(e) {
            const t = this._subscriptions;
            if (t) {
              const n = t.indexOf(e);
              -1 !== n && t.splice(n, 1);
            }
          }
        }
        return (
          (e.EMPTY = (function (e) {
            return (e.closed = !0), e;
          })(new e())),
          e
        );
      })();
      function d(e) {
        return e.reduce((e, t) => e.concat(t instanceof c ? t.errors : t), []);
      }
      const p = (() =>
        'function' == typeof Symbol ? Symbol('rxSubscriber') : '@@rxSubscriber_' + Math.random())();
      class f extends h {
        constructor(e, t, n) {
          switch (
            (super(),
            (this.syncErrorValue = null),
            (this.syncErrorThrown = !1),
            (this.syncErrorThrowable = !1),
            (this.isStopped = !1),
            arguments.length)
          ) {
            case 0:
              this.destination = a;
              break;
            case 1:
              if (!e) {
                this.destination = a;
                break;
              }
              if ('object' == typeof e) {
                e instanceof f
                  ? ((this.syncErrorThrowable = e.syncErrorThrowable),
                    (this.destination = e),
                    e.add(this))
                  : ((this.syncErrorThrowable = !0), (this.destination = new m(this, e)));
                break;
              }
            default:
              (this.syncErrorThrowable = !0), (this.destination = new m(this, e, t, n));
          }
        }
        [p]() {
          return this;
        }
        static create(e, t, n) {
          const s = new f(e, t, n);
          return (s.syncErrorThrowable = !1), s;
        }
        next(e) {
          this.isStopped || this._next(e);
        }
        error(e) {
          this.isStopped || ((this.isStopped = !0), this._error(e));
        }
        complete() {
          this.isStopped || ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
          this.closed || ((this.isStopped = !0), super.unsubscribe());
        }
        _next(e) {
          this.destination.next(e);
        }
        _error(e) {
          this.destination.error(e), this.unsubscribe();
        }
        _complete() {
          this.destination.complete(), this.unsubscribe();
        }
        _unsubscribeAndRecycle() {
          const { _parentOrParents: e } = this;
          return (
            (this._parentOrParents = null),
            this.unsubscribe(),
            (this.closed = !1),
            (this.isStopped = !1),
            (this._parentOrParents = e),
            this
          );
        }
      }
      class m extends f {
        constructor(e, t, n, r) {
          let i;
          super(), (this._parentSubscriber = e);
          let o = this;
          s(t)
            ? (i = t)
            : t &&
              ((i = t.next),
              (n = t.error),
              (r = t.complete),
              t !== a &&
                ((o = Object.create(t)),
                s(o.unsubscribe) && this.add(o.unsubscribe.bind(o)),
                (o.unsubscribe = this.unsubscribe.bind(this)))),
            (this._context = o),
            (this._next = i),
            (this._error = n),
            (this._complete = r);
        }
        next(e) {
          if (!this.isStopped && this._next) {
            const { _parentSubscriber: t } = this;
            i.useDeprecatedSynchronousErrorHandling && t.syncErrorThrowable
              ? this.__tryOrSetError(t, this._next, e) && this.unsubscribe()
              : this.__tryOrUnsub(this._next, e);
          }
        }
        error(e) {
          if (!this.isStopped) {
            const { _parentSubscriber: t } = this,
              { useDeprecatedSynchronousErrorHandling: n } = i;
            if (this._error)
              n && t.syncErrorThrowable
                ? (this.__tryOrSetError(t, this._error, e), this.unsubscribe())
                : (this.__tryOrUnsub(this._error, e), this.unsubscribe());
            else if (t.syncErrorThrowable)
              n ? ((t.syncErrorValue = e), (t.syncErrorThrown = !0)) : o(e), this.unsubscribe();
            else {
              if ((this.unsubscribe(), n)) throw e;
              o(e);
            }
          }
        }
        complete() {
          if (!this.isStopped) {
            const { _parentSubscriber: e } = this;
            if (this._complete) {
              const t = () => this._complete.call(this._context);
              i.useDeprecatedSynchronousErrorHandling && e.syncErrorThrowable
                ? (this.__tryOrSetError(e, t), this.unsubscribe())
                : (this.__tryOrUnsub(t), this.unsubscribe());
            } else this.unsubscribe();
          }
        }
        __tryOrUnsub(e, t) {
          try {
            e.call(this._context, t);
          } catch (n) {
            if ((this.unsubscribe(), i.useDeprecatedSynchronousErrorHandling)) throw n;
            o(n);
          }
        }
        __tryOrSetError(e, t, n) {
          if (!i.useDeprecatedSynchronousErrorHandling) throw new Error('bad call');
          try {
            t.call(this._context, n);
          } catch (s) {
            return i.useDeprecatedSynchronousErrorHandling
              ? ((e.syncErrorValue = s), (e.syncErrorThrown = !0), !0)
              : (o(s), !0);
          }
          return !1;
        }
        _unsubscribe() {
          const { _parentSubscriber: e } = this;
          (this._context = null), (this._parentSubscriber = null), e.unsubscribe();
        }
      }
      const g = (() => ('function' == typeof Symbol && Symbol.observable) || '@@observable')();
      function y(e) {
        return e;
      }
      let _ = (() => {
        class e {
          constructor(e) {
            (this._isScalar = !1), e && (this._subscribe = e);
          }
          lift(t) {
            const n = new e();
            return (n.source = this), (n.operator = t), n;
          }
          subscribe(e, t, n) {
            const { operator: s } = this,
              r = (function (e, t, n) {
                if (e) {
                  if (e instanceof f) return e;
                  if (e[p]) return e[p]();
                }
                return e || t || n ? new f(e, t, n) : new f(a);
              })(e, t, n);
            if (
              (r.add(
                s
                  ? s.call(r, this.source)
                  : this.source ||
                    (i.useDeprecatedSynchronousErrorHandling && !r.syncErrorThrowable)
                  ? this._subscribe(r)
                  : this._trySubscribe(r)
              ),
              i.useDeprecatedSynchronousErrorHandling &&
                r.syncErrorThrowable &&
                ((r.syncErrorThrowable = !1), r.syncErrorThrown))
            )
              throw r.syncErrorValue;
            return r;
          }
          _trySubscribe(e) {
            try {
              return this._subscribe(e);
            } catch (t) {
              i.useDeprecatedSynchronousErrorHandling &&
                ((e.syncErrorThrown = !0), (e.syncErrorValue = t)),
                (function (e) {
                  for (; e; ) {
                    const { closed: t, destination: n, isStopped: s } = e;
                    if (t || s) return !1;
                    e = n && n instanceof f ? n : null;
                  }
                  return !0;
                })(e)
                  ? e.error(t)
                  : console.warn(t);
            }
          }
          forEach(e, t) {
            return new (t = v(t))((t, n) => {
              let s;
              s = this.subscribe(
                t => {
                  try {
                    e(t);
                  } catch (r) {
                    n(r), s && s.unsubscribe();
                  }
                },
                n,
                t
              );
            });
          }
          _subscribe(e) {
            const { source: t } = this;
            return t && t.subscribe(e);
          }
          [g]() {
            return this;
          }
          pipe(...e) {
            return 0 === e.length
              ? this
              : (0 === (t = e).length
                  ? y
                  : 1 === t.length
                  ? t[0]
                  : function (e) {
                      return t.reduce((e, t) => t(e), e);
                    })(this);
            var t;
          }
          toPromise(e) {
            return new (e = v(e))((e, t) => {
              let n;
              this.subscribe(
                e => (n = e),
                e => t(e),
                () => e(n)
              );
            });
          }
        }
        return (e.create = t => new e(t)), e;
      })();
      function v(e) {
        if ((e || (e = i.Promise || Promise), !e)) throw new Error('no Promise impl found');
        return e;
      }
      const b = (() => {
        function e() {
          return (
            Error.call(this),
            (this.message = 'object unsubscribed'),
            (this.name = 'ObjectUnsubscribedError'),
            this
          );
        }
        return (e.prototype = Object.create(Error.prototype)), e;
      })();
      class w extends h {
        constructor(e, t) {
          super(), (this.subject = e), (this.subscriber = t), (this.closed = !1);
        }
        unsubscribe() {
          if (this.closed) return;
          this.closed = !0;
          const e = this.subject,
            t = e.observers;
          if (((this.subject = null), !t || 0 === t.length || e.isStopped || e.closed)) return;
          const n = t.indexOf(this.subscriber);
          -1 !== n && t.splice(n, 1);
        }
      }
      class S extends f {
        constructor(e) {
          super(e), (this.destination = e);
        }
      }
      let E = (() => {
        class e extends _ {
          constructor() {
            super(),
              (this.observers = []),
              (this.closed = !1),
              (this.isStopped = !1),
              (this.hasError = !1),
              (this.thrownError = null);
          }
          [p]() {
            return new S(this);
          }
          lift(e) {
            const t = new T(this, this);
            return (t.operator = e), t;
          }
          next(e) {
            if (this.closed) throw new b();
            if (!this.isStopped) {
              const { observers: t } = this,
                n = t.length,
                s = t.slice();
              for (let r = 0; r < n; r++) s[r].next(e);
            }
          }
          error(e) {
            if (this.closed) throw new b();
            (this.hasError = !0), (this.thrownError = e), (this.isStopped = !0);
            const { observers: t } = this,
              n = t.length,
              s = t.slice();
            for (let r = 0; r < n; r++) s[r].error(e);
            this.observers.length = 0;
          }
          complete() {
            if (this.closed) throw new b();
            this.isStopped = !0;
            const { observers: e } = this,
              t = e.length,
              n = e.slice();
            for (let s = 0; s < t; s++) n[s].complete();
            this.observers.length = 0;
          }
          unsubscribe() {
            (this.isStopped = !0), (this.closed = !0), (this.observers = null);
          }
          _trySubscribe(e) {
            if (this.closed) throw new b();
            return super._trySubscribe(e);
          }
          _subscribe(e) {
            if (this.closed) throw new b();
            return this.hasError
              ? (e.error(this.thrownError), h.EMPTY)
              : this.isStopped
              ? (e.complete(), h.EMPTY)
              : (this.observers.push(e), new w(this, e));
          }
          asObservable() {
            const e = new _();
            return (e.source = this), e;
          }
        }
        return (e.create = (e, t) => new T(e, t)), e;
      })();
      class T extends E {
        constructor(e, t) {
          super(), (this.destination = e), (this.source = t);
        }
        next(e) {
          const { destination: t } = this;
          t && t.next && t.next(e);
        }
        error(e) {
          const { destination: t } = this;
          t && t.error && this.destination.error(e);
        }
        complete() {
          const { destination: e } = this;
          e && e.complete && this.destination.complete();
        }
        _subscribe(e) {
          const { source: t } = this;
          return t ? this.source.subscribe(e) : h.EMPTY;
        }
      }
      function x(e) {
        return e && 'function' == typeof e.schedule;
      }
      class k extends f {
        constructor(e, t, n) {
          super(),
            (this.parent = e),
            (this.outerValue = t),
            (this.outerIndex = n),
            (this.index = 0);
        }
        _next(e) {
          this.parent.notifyNext(this.outerValue, e, this.outerIndex, this.index++, this);
        }
        _error(e) {
          this.parent.notifyError(e, this), this.unsubscribe();
        }
        _complete() {
          this.parent.notifyComplete(this), this.unsubscribe();
        }
      }
      const C = e => t => {
        for (let n = 0, s = e.length; n < s && !t.closed; n++) t.next(e[n]);
        t.complete();
      };
      function P() {
        return 'function' == typeof Symbol && Symbol.iterator ? Symbol.iterator : '@@iterator';
      }
      const A = P();
      const L = e => {
        if (e && 'function' == typeof e[g])
          return (
            (i = e),
            e => {
              const t = i[g]();
              if ('function' != typeof t.subscribe)
                throw new TypeError(
                  'Provided object does not correctly implement Symbol.observable'
                );
              return t.subscribe(e);
            }
          );
        if ((t = e) && 'number' == typeof t.length && 'function' != typeof t) return C(e);
        var t, n, s, r, i;
        if ((n = e) && 'function' != typeof n.subscribe && 'function' == typeof n.then)
          return (
            (r = e),
            e => (
              r
                .then(
                  t => {
                    e.closed || (e.next(t), e.complete());
                  },
                  t => e.error(t)
                )
                .then(null, o),
              e
            )
          );
        if (e && 'function' == typeof e[A])
          return (
            (s = e),
            e => {
              const t = s[A]();
              for (;;) {
                const n = t.next();
                if (n.done) {
                  e.complete();
                  break;
                }
                if ((e.next(n.value), e.closed)) break;
              }
              return (
                'function' == typeof t.return &&
                  e.add(() => {
                    t.return && t.return();
                  }),
                e
              );
            }
          );
        {
          const t = u(e) ? 'an invalid object' : `'${e}'`;
          throw new TypeError(
            `You provided ${t} where a stream was expected.` +
              ' You can provide an Observable, Promise, Array, or Iterable.'
          );
        }
      };
      function N(e, t, n, s, r = new k(e, n, s)) {
        if (!r.closed) return t instanceof _ ? t.subscribe(r) : L(t)(r);
      }
      class I extends f {
        notifyNext(e, t, n, s, r) {
          this.destination.next(t);
        }
        notifyError(e, t) {
          this.destination.error(e);
        }
        notifyComplete(e) {
          this.destination.complete();
        }
      }
      function D(e, t) {
        return function (n) {
          if ('function' != typeof e)
            throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
          return n.lift(new F(e, t));
        };
      }
      class F {
        constructor(e, t) {
          (this.project = e), (this.thisArg = t);
        }
        call(e, t) {
          return t.subscribe(new M(e, this.project, this.thisArg));
        }
      }
      class M extends f {
        constructor(e, t, n) {
          super(e), (this.project = t), (this.count = 0), (this.thisArg = n || this);
        }
        _next(e) {
          let t;
          try {
            t = this.project.call(this.thisArg, e, this.count++);
          } catch (n) {
            return void this.destination.error(n);
          }
          this.destination.next(t);
        }
      }
      function O(e, t) {
        return new _(n => {
          const s = new h();
          let r = 0;
          return (
            s.add(
              t.schedule(function () {
                r !== e.length
                  ? (n.next(e[r++]), n.closed || s.add(this.schedule()))
                  : n.complete();
              })
            ),
            s
          );
        });
      }
      function R(e, t, n = Number.POSITIVE_INFINITY) {
        return 'function' == typeof t
          ? s =>
              s.pipe(
                R((n, s) => {
                  return ((r = e(n, s)), r instanceof _ ? r : new _(L(r))).pipe(
                    D((e, r) => t(n, e, s, r))
                  );
                  var r;
                }, n)
              )
          : ('number' == typeof t && (n = t), t => t.lift(new V(e, n)));
      }
      class V {
        constructor(e, t = Number.POSITIVE_INFINITY) {
          (this.project = e), (this.concurrent = t);
        }
        call(e, t) {
          return t.subscribe(new j(e, this.project, this.concurrent));
        }
      }
      class j extends I {
        constructor(e, t, n = Number.POSITIVE_INFINITY) {
          super(e),
            (this.project = t),
            (this.concurrent = n),
            (this.hasCompleted = !1),
            (this.buffer = []),
            (this.active = 0),
            (this.index = 0);
        }
        _next(e) {
          this.active < this.concurrent ? this._tryNext(e) : this.buffer.push(e);
        }
        _tryNext(e) {
          let t;
          const n = this.index++;
          try {
            t = this.project(e, n);
          } catch (s) {
            return void this.destination.error(s);
          }
          this.active++, this._innerSub(t, e, n);
        }
        _innerSub(e, t, n) {
          const s = new k(this, t, n),
            r = this.destination;
          r.add(s);
          const i = N(this, e, void 0, void 0, s);
          i !== s && r.add(i);
        }
        _complete() {
          (this.hasCompleted = !0),
            0 === this.active && 0 === this.buffer.length && this.destination.complete(),
            this.unsubscribe();
        }
        notifyNext(e, t, n, s, r) {
          this.destination.next(t);
        }
        notifyComplete(e) {
          const t = this.buffer;
          this.remove(e),
            this.active--,
            t.length > 0
              ? this._next(t.shift())
              : 0 === this.active && this.hasCompleted && this.destination.complete();
        }
      }
      function H(e, t) {
        return t ? O(e, t) : new _(C(e));
      }
      function B(...e) {
        let t = Number.POSITIVE_INFINITY,
          n = null,
          s = e[e.length - 1];
        return (
          x(s)
            ? ((n = e.pop()), e.length > 1 && 'number' == typeof e[e.length - 1] && (t = e.pop()))
            : 'number' == typeof s && (t = e.pop()),
          null === n && 1 === e.length && e[0] instanceof _
            ? e[0]
            : (function (e = Number.POSITIVE_INFINITY) {
                return R(y, e);
              })(t)(H(e, n))
        );
      }
      function z() {
        return function (e) {
          return e.lift(new q(e));
        };
      }
      class q {
        constructor(e) {
          this.connectable = e;
        }
        call(e, t) {
          const { connectable: n } = this;
          n._refCount++;
          const s = new $(e, n),
            r = t.subscribe(s);
          return s.closed || (s.connection = n.connect()), r;
        }
      }
      class $ extends f {
        constructor(e, t) {
          super(e), (this.connectable = t);
        }
        _unsubscribe() {
          const { connectable: e } = this;
          if (!e) return void (this.connection = null);
          this.connectable = null;
          const t = e._refCount;
          if (t <= 0) return void (this.connection = null);
          if (((e._refCount = t - 1), t > 1)) return void (this.connection = null);
          const { connection: n } = this,
            s = e._connection;
          (this.connection = null), !s || (n && s !== n) || s.unsubscribe();
        }
      }
      class U extends _ {
        constructor(e, t) {
          super(),
            (this.source = e),
            (this.subjectFactory = t),
            (this._refCount = 0),
            (this._isComplete = !1);
        }
        _subscribe(e) {
          return this.getSubject().subscribe(e);
        }
        getSubject() {
          const e = this._subject;
          return (e && !e.isStopped) || (this._subject = this.subjectFactory()), this._subject;
        }
        connect() {
          let e = this._connection;
          return (
            e ||
              ((this._isComplete = !1),
              (e = this._connection = new h()),
              e.add(this.source.subscribe(new K(this.getSubject(), this))),
              e.closed && ((this._connection = null), (e = h.EMPTY))),
            e
          );
        }
        refCount() {
          return z()(this);
        }
      }
      const G = (() => {
        const e = U.prototype;
        return {
          operator: { value: null },
          _refCount: { value: 0, writable: !0 },
          _subject: { value: null, writable: !0 },
          _connection: { value: null, writable: !0 },
          _subscribe: { value: e._subscribe },
          _isComplete: { value: e._isComplete, writable: !0 },
          getSubject: { value: e.getSubject },
          connect: { value: e.connect },
          refCount: { value: e.refCount },
        };
      })();
      class K extends S {
        constructor(e, t) {
          super(e), (this.connectable = t);
        }
        _error(e) {
          this._unsubscribe(), super._error(e);
        }
        _complete() {
          (this.connectable._isComplete = !0), this._unsubscribe(), super._complete();
        }
        _unsubscribe() {
          const e = this.connectable;
          if (e) {
            this.connectable = null;
            const t = e._connection;
            (e._refCount = 0), (e._subject = null), (e._connection = null), t && t.unsubscribe();
          }
        }
      }
      function W() {
        return new E();
      }
      function Q(e) {
        return { toString: e }.toString();
      }
      function Z(e, t, n) {
        return Q(() => {
          const s = (function (e) {
            return function (...t) {
              if (e) {
                const n = e(...t);
                for (const e in n) this[e] = n[e];
              }
            };
          })(t);
          function r(...e) {
            if (this instanceof r) return s.apply(this, e), this;
            const t = new r(...e);
            return (n.annotation = t), n;
            function n(e, n, s) {
              const r = e.hasOwnProperty('__parameters__')
                ? e.__parameters__
                : Object.defineProperty(e, '__parameters__', { value: [] }).__parameters__;
              for (; r.length <= s; ) r.push(null);
              return (r[s] = r[s] || []).push(t), e;
            }
          }
          return (
            n && (r.prototype = Object.create(n.prototype)),
            (r.prototype.ngMetadataName = e),
            (r.annotationCls = r),
            r
          );
        });
      }
      const J = Z('Inject', e => ({ token: e })),
        X = Z('Optional'),
        Y = Z('Self'),
        ee = Z('SkipSelf');
      var te = (function (e) {
        return (
          (e[(e.Default = 0)] = 'Default'),
          (e[(e.Host = 1)] = 'Host'),
          (e[(e.Self = 2)] = 'Self'),
          (e[(e.SkipSelf = 4)] = 'SkipSelf'),
          (e[(e.Optional = 8)] = 'Optional'),
          e
        );
      })({});
      function ne(e) {
        for (let t in e) if (e[t] === ne) return t;
        throw Error('Could not find renamed property on target object.');
      }
      function se(e) {
        return {
          token: e.token,
          providedIn: e.providedIn || null,
          factory: e.factory,
          value: void 0,
        };
      }
      function re(e) {
        return { factory: e.factory, providers: e.providers || [], imports: e.imports || [] };
      }
      function ie(e) {
        return oe(e, e[le]) || oe(e, e[he]);
      }
      function oe(e, t) {
        return t && t.token === e ? t : null;
      }
      function ae(e) {
        return e && (e.hasOwnProperty(ue) || e.hasOwnProperty(de)) ? e[ue] : null;
      }
      const le = ne({ '\u0275prov': ne }),
        ue = ne({ '\u0275inj': ne }),
        ce = ne({ '\u0275provFallback': ne }),
        he = ne({ ngInjectableDef: ne }),
        de = ne({ ngInjectorDef: ne });
      function pe(e) {
        if ('string' == typeof e) return e;
        if (Array.isArray(e)) return '[' + e.map(pe).join(', ') + ']';
        if (null == e) return '' + e;
        if (e.overriddenName) return `${e.overriddenName}`;
        if (e.name) return `${e.name}`;
        const t = e.toString();
        if (null == t) return '' + t;
        const n = t.indexOf('\n');
        return -1 === n ? t : t.substring(0, n);
      }
      function fe(e, t) {
        return null == e || '' === e
          ? null === t
            ? ''
            : t
          : null == t || '' === t
          ? e
          : e + ' ' + t;
      }
      const me = ne({ __forward_ref__: ne });
      function ge(e) {
        return (
          (e.__forward_ref__ = ge),
          (e.toString = function () {
            return pe(this());
          }),
          e
        );
      }
      function ye(e) {
        return 'function' == typeof (t = e) && t.hasOwnProperty(me) && t.__forward_ref__ === ge
          ? e()
          : e;
        var t;
      }
      const _e = 'undefined' != typeof globalThis && globalThis,
        ve = 'undefined' != typeof window && window,
        be =
          'undefined' != typeof self &&
          'undefined' != typeof WorkerGlobalScope &&
          self instanceof WorkerGlobalScope &&
          self,
        we = 'undefined' != typeof global && global,
        Se = _e || we || ve || be,
        Ee = ne({ '\u0275cmp': ne }),
        Te = ne({ '\u0275dir': ne }),
        xe = ne({ '\u0275pipe': ne }),
        ke = ne({ '\u0275mod': ne }),
        Ce = ne({ '\u0275loc': ne }),
        Pe = ne({ '\u0275fac': ne }),
        Ae = ne({ __NG_ELEMENT_ID__: ne });
      class Le {
        constructor(e, t) {
          (this._desc = e),
            (this.ngMetadataName = 'InjectionToken'),
            (this.ɵprov = void 0),
            'number' == typeof t
              ? (this.__NG_ELEMENT_ID__ = t)
              : void 0 !== t &&
                (this.ɵprov = se({
                  token: this,
                  providedIn: t.providedIn || 'root',
                  factory: t.factory,
                }));
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      }
      const Ne = new Le('INJECTOR', -1),
        Ie = {},
        De = /\n/gm,
        Fe = ne({ provide: String, useValue: ne });
      let Me,
        Oe = void 0;
      function Re(e) {
        const t = Oe;
        return (Oe = e), t;
      }
      function Ve(e) {
        const t = Me;
        return (Me = e), t;
      }
      function je(e, t = te.Default) {
        if (void 0 === Oe) throw new Error('inject() must be called from an injection context');
        return null === Oe ? Be(e, void 0, t) : Oe.get(e, t & te.Optional ? null : void 0, t);
      }
      function He(e, t = te.Default) {
        return (Me || je)(ye(e), t);
      }
      function Be(e, t, n) {
        const s = ie(e);
        if (s && 'root' == s.providedIn)
          return void 0 === s.value ? (s.value = s.factory()) : s.value;
        if (n & te.Optional) return null;
        if (void 0 !== t) return t;
        throw new Error(`Injector: NOT_FOUND [${pe(e)}]`);
      }
      function ze(e) {
        const t = [];
        for (let n = 0; n < e.length; n++) {
          const s = ye(e[n]);
          if (Array.isArray(s)) {
            if (0 === s.length) throw new Error('Arguments array must have arguments.');
            let e = void 0,
              n = te.Default;
            for (let t = 0; t < s.length; t++) {
              const r = s[t];
              r instanceof X || 'Optional' === r.ngMetadataName || r === X
                ? (n |= te.Optional)
                : r instanceof ee || 'SkipSelf' === r.ngMetadataName || r === ee
                ? (n |= te.SkipSelf)
                : r instanceof Y || 'Self' === r.ngMetadataName || r === Y
                ? (n |= te.Self)
                : (e = r instanceof J || r === J ? r.token : r);
            }
            t.push(He(e, n));
          } else t.push(He(s));
        }
        return t;
      }
      class qe {
        get(e, t = Ie) {
          if (t === Ie) {
            const t = new Error(`NullInjectorError: No provider for ${pe(e)}!`);
            throw ((t.name = 'NullInjectorError'), t);
          }
          return t;
        }
      }
      class $e {}
      function Ue(e, t) {
        e.forEach(e => (Array.isArray(e) ? Ue(e, t) : t(e)));
      }
      function Ge(e, t, n) {
        t >= e.length ? e.push(n) : e.splice(t, 0, n);
      }
      function Ke(e, t) {
        return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
      }
      function We(e, t, n) {
        let s = Ze(e, t);
        return (
          s >= 0
            ? (e[1 | s] = n)
            : ((s = ~s),
              (function (e, t, n, s) {
                let r = e.length;
                if (r == t) e.push(n, s);
                else if (1 === r) e.push(s, e[0]), (e[0] = n);
                else {
                  for (r--, e.push(e[r - 1], e[r]); r > t; ) (e[r] = e[r - 2]), r--;
                  (e[t] = n), (e[t + 1] = s);
                }
              })(e, s, t, n)),
          s
        );
      }
      function Qe(e, t) {
        const n = Ze(e, t);
        if (n >= 0) return e[1 | n];
      }
      function Ze(e, t) {
        return (function (e, t, n) {
          let s = 0,
            r = e.length >> 1;
          for (; r !== s; ) {
            const n = s + ((r - s) >> 1),
              i = e[n << 1];
            if (t === i) return n << 1;
            i > t ? (r = n) : (s = n + 1);
          }
          return ~(r << 1);
        })(e, t);
      }
      const Je = (function () {
          var e = { OnPush: 0, Default: 1 };
          return (e[e.OnPush] = 'OnPush'), (e[e.Default] = 'Default'), e;
        })(),
        Xe = (function () {
          var e = { Emulated: 0, Native: 1, None: 2, ShadowDom: 3 };
          return (
            (e[e.Emulated] = 'Emulated'),
            (e[e.Native] = 'Native'),
            (e[e.None] = 'None'),
            (e[e.ShadowDom] = 'ShadowDom'),
            e
          );
        })(),
        Ye = {},
        et = [];
      let tt = 0;
      function nt(e) {
        return Q(() => {
          const t = e.type,
            n = t.prototype,
            s = {},
            r = {
              type: t,
              providersResolver: null,
              decls: e.decls,
              vars: e.vars,
              factory: null,
              template: e.template || null,
              consts: e.consts || null,
              ngContentSelectors: e.ngContentSelectors,
              hostBindings: e.hostBindings || null,
              hostVars: e.hostVars || 0,
              hostAttrs: e.hostAttrs || null,
              contentQueries: e.contentQueries || null,
              declaredInputs: s,
              inputs: null,
              outputs: null,
              exportAs: e.exportAs || null,
              onChanges: null,
              onInit: n.ngOnInit || null,
              doCheck: n.ngDoCheck || null,
              afterContentInit: n.ngAfterContentInit || null,
              afterContentChecked: n.ngAfterContentChecked || null,
              afterViewInit: n.ngAfterViewInit || null,
              afterViewChecked: n.ngAfterViewChecked || null,
              onDestroy: n.ngOnDestroy || null,
              onPush: e.changeDetection === Je.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              selectors: e.selectors || et,
              viewQuery: e.viewQuery || null,
              features: e.features || null,
              data: e.data || {},
              encapsulation: e.encapsulation || Xe.Emulated,
              id: 'c',
              styles: e.styles || et,
              _: null,
              setInput: null,
              schemas: e.schemas || null,
              tView: null,
            },
            i = e.directives,
            o = e.features,
            a = e.pipes;
          return (
            (r.id += tt++),
            (r.inputs = at(e.inputs, s)),
            (r.outputs = at(e.outputs)),
            o && o.forEach(e => e(r)),
            (r.directiveDefs = i ? () => ('function' == typeof i ? i() : i).map(st) : null),
            (r.pipeDefs = a ? () => ('function' == typeof a ? a() : a).map(rt) : null),
            r
          );
        });
      }
      function st(e) {
        return (
          ut(e) ||
          (function (e) {
            return e[Te] || null;
          })(e)
        );
      }
      function rt(e) {
        return (function (e) {
          return e[xe] || null;
        })(e);
      }
      const it = {};
      function ot(e) {
        const t = {
          type: e.type,
          bootstrap: e.bootstrap || et,
          declarations: e.declarations || et,
          imports: e.imports || et,
          exports: e.exports || et,
          transitiveCompileScopes: null,
          schemas: e.schemas || null,
          id: e.id || null,
        };
        return (
          null != e.id &&
            Q(() => {
              it[e.id] = e.type;
            }),
          t
        );
      }
      function at(e, t) {
        if (null == e) return Ye;
        const n = {};
        for (const s in e)
          if (e.hasOwnProperty(s)) {
            let r = e[s],
              i = r;
            Array.isArray(r) && ((i = r[1]), (r = r[0])), (n[r] = s), t && (t[r] = i);
          }
        return n;
      }
      const lt = nt;
      function ut(e) {
        return e[Ee] || null;
      }
      function ct(e, t) {
        return e.hasOwnProperty(Pe) ? e[Pe] : null;
      }
      function ht(e, t) {
        const n = e[ke] || null;
        if (!n && !0 === t) throw new Error(`Type ${pe(e)} does not have '\u0275mod' property.`);
        return n;
      }
      function dt(e) {
        return Array.isArray(e) && 'object' == typeof e[1];
      }
      function pt(e) {
        return Array.isArray(e) && !0 === e[1];
      }
      function ft(e) {
        return 0 != (8 & e.flags);
      }
      function mt(e) {
        return 2 == (2 & e.flags);
      }
      function gt(e) {
        return 1 == (1 & e.flags);
      }
      function yt(e) {
        return null !== e.template;
      }
      function _t(e) {
        return 0 != (512 & e[2]);
      }
      let vt = void 0;
      function bt(e) {
        return !!e.listen;
      }
      const wt = {
        createRenderer: (e, t) =>
          void 0 !== vt ? vt : 'undefined' != typeof document ? document : void 0,
      };
      function St(e) {
        for (; Array.isArray(e); ) e = e[0];
        return e;
      }
      function Et(e, t) {
        return St(t[e + 19]);
      }
      function Tt(e, t) {
        return St(t[e.index]);
      }
      function xt(e, t) {
        return e.data[t + 19];
      }
      function kt(e, t) {
        const n = t[e];
        return dt(n) ? n : n[0];
      }
      function Ct(e) {
        const t = (function (e) {
          return e.__ngContext__ || null;
        })(e);
        return t ? (Array.isArray(t) ? t : t.lView) : null;
      }
      function Pt(e) {
        return 4 == (4 & e[2]);
      }
      function At(e) {
        return 128 == (128 & e[2]);
      }
      function Lt(e, t) {
        return null === e || null == t ? null : e[t];
      }
      function Nt(e) {
        e[18] = 0;
      }
      const It = { lFrame: Qt(null), bindingsEnabled: !0, checkNoChangesMode: !1 };
      function Dt() {
        return It.bindingsEnabled;
      }
      function Ft() {
        return It.lFrame.lView;
      }
      function Mt() {
        return It.lFrame.tView;
      }
      function Ot() {
        return It.lFrame.previousOrParentTNode;
      }
      function Rt(e, t) {
        (It.lFrame.previousOrParentTNode = e), (It.lFrame.isParent = t);
      }
      function Vt() {
        return It.lFrame.isParent;
      }
      function jt() {
        It.lFrame.isParent = !1;
      }
      function Ht() {
        return It.checkNoChangesMode;
      }
      function Bt(e) {
        It.checkNoChangesMode = e;
      }
      function zt() {
        return It.lFrame.bindingIndex++;
      }
      function qt(e, t) {
        const n = It.lFrame;
        (n.bindingIndex = n.bindingRootIndex = e), (n.currentDirectiveIndex = t);
      }
      function $t() {
        return It.lFrame.currentQueryIndex;
      }
      function Ut(e) {
        It.lFrame.currentQueryIndex = e;
      }
      function Gt(e, t) {
        const n = Wt();
        (It.lFrame = n), (n.previousOrParentTNode = t), (n.lView = e);
      }
      function Kt(e, t) {
        const n = Wt(),
          s = e[1];
        (It.lFrame = n),
          (n.previousOrParentTNode = t),
          (n.lView = e),
          (n.tView = s),
          (n.contextLView = e),
          (n.bindingIndex = s.bindingStartIndex);
      }
      function Wt() {
        const e = It.lFrame,
          t = null === e ? null : e.child;
        return null === t ? Qt(e) : t;
      }
      function Qt(e) {
        const t = {
          previousOrParentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: 0,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentSanitizer: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: e,
          child: null,
        };
        return null !== e && (e.child = t), t;
      }
      function Zt() {
        const e = It.lFrame;
        return (It.lFrame = e.parent), (e.previousOrParentTNode = null), (e.lView = null), e;
      }
      const Jt = Zt;
      function Xt() {
        const e = Zt();
        (e.isParent = !0),
          (e.tView = null),
          (e.selectedIndex = 0),
          (e.contextLView = null),
          (e.elementDepthCount = 0),
          (e.currentDirectiveIndex = -1),
          (e.currentNamespace = null),
          (e.currentSanitizer = null),
          (e.bindingRootIndex = -1),
          (e.bindingIndex = -1),
          (e.currentQueryIndex = 0);
      }
      function Yt() {
        return It.lFrame.selectedIndex;
      }
      function en(e) {
        It.lFrame.selectedIndex = e;
      }
      function tn(e, t) {
        for (let n = t.directiveStart, s = t.directiveEnd; n < s; n++) {
          const t = e.data[n];
          t.afterContentInit &&
            (e.contentHooks || (e.contentHooks = [])).push(-n, t.afterContentInit),
            t.afterContentChecked &&
              ((e.contentHooks || (e.contentHooks = [])).push(n, t.afterContentChecked),
              (e.contentCheckHooks || (e.contentCheckHooks = [])).push(n, t.afterContentChecked)),
            t.afterViewInit && (e.viewHooks || (e.viewHooks = [])).push(-n, t.afterViewInit),
            t.afterViewChecked &&
              ((e.viewHooks || (e.viewHooks = [])).push(n, t.afterViewChecked),
              (e.viewCheckHooks || (e.viewCheckHooks = [])).push(n, t.afterViewChecked)),
            null != t.onDestroy && (e.destroyHooks || (e.destroyHooks = [])).push(n, t.onDestroy);
        }
      }
      function nn(e, t, n) {
        on(e, t, 3, n);
      }
      function sn(e, t, n, s) {
        (3 & e[2]) === n && on(e, t, n, s);
      }
      function rn(e, t) {
        let n = e[2];
        (3 & n) === t && ((n &= 1023), (n += 1), (e[2] = n));
      }
      function on(e, t, n, s) {
        const r = null != s ? s : -1;
        let i = 0;
        for (let o = void 0 !== s ? 65535 & e[18] : 0; o < t.length; o++)
          if ('number' == typeof t[o + 1]) {
            if (((i = t[o]), null != s && i >= s)) break;
          } else
            t[o] < 0 && (e[18] += 65536),
              (i < r || -1 == r) && (an(e, n, t, o), (e[18] = (4294901760 & e[18]) + o + 2)),
              o++;
      }
      function an(e, t, n, s) {
        const r = n[s] < 0,
          i = n[s + 1],
          o = e[r ? -n[s] : n[s]];
        r ? e[2] >> 10 < e[18] >> 16 && (3 & e[2]) === t && ((e[2] += 1024), i.call(o)) : i.call(o);
      }
      class ln {
        constructor(e, t, n) {
          (this.factory = e),
            (this.resolving = !1),
            (this.canSeeViewProviders = t),
            (this.injectImpl = n);
        }
      }
      function un(e, t, n) {
        const s = bt(e);
        let r = 0;
        for (; r < n.length; ) {
          const i = n[r];
          if ('number' == typeof i) {
            if (0 !== i) break;
            r++;
            const o = n[r++],
              a = n[r++],
              l = n[r++];
            s ? e.setAttribute(t, a, l, o) : t.setAttributeNS(o, a, l);
          } else {
            const o = i,
              a = n[++r];
            cn(o)
              ? s && e.setProperty(t, o, a)
              : s
              ? e.setAttribute(t, o, a)
              : t.setAttribute(o, a),
              r++;
          }
        }
        return r;
      }
      function cn(e) {
        return 64 === e.charCodeAt(0);
      }
      function hn(e, t) {
        if (null === t || 0 === t.length);
        else if (null === e || 0 === e.length) e = t.slice();
        else {
          let n = -1;
          for (let s = 0; s < t.length; s++) {
            const r = t[s];
            'number' == typeof r
              ? (n = r)
              : 0 === n || dn(e, n, r, null, -1 === n || 2 === n ? t[++s] : null);
          }
        }
        return e;
      }
      function dn(e, t, n, s, r) {
        let i = 0,
          o = e.length;
        if (-1 === t) o = -1;
        else
          for (; i < e.length; ) {
            const n = e[i++];
            if ('number' == typeof n) {
              if (n === t) {
                o = -1;
                break;
              }
              if (n > t) {
                o = i - 1;
                break;
              }
            }
          }
        for (; i < e.length; ) {
          const t = e[i];
          if ('number' == typeof t) break;
          if (t === n) {
            if (null === s) return void (null !== r && (e[i + 1] = r));
            if (s === e[i + 1]) return void (e[i + 2] = r);
          }
          i++, null !== s && i++, null !== r && i++;
        }
        -1 !== o && (e.splice(o, 0, t), (i = o + 1)),
          e.splice(i++, 0, n),
          null !== s && e.splice(i++, 0, s),
          null !== r && e.splice(i++, 0, r);
      }
      function pn(e) {
        return -1 !== e;
      }
      function fn(e) {
        return 32767 & e;
      }
      function mn(e) {
        return e >> 16;
      }
      function gn(e, t) {
        let n = mn(e),
          s = t;
        for (; n > 0; ) (s = s[15]), n--;
        return s;
      }
      function yn(e) {
        return 'string' == typeof e ? e : null == e ? '' : '' + e;
      }
      function _n(e) {
        return 'function' == typeof e
          ? e.name || e.toString()
          : 'object' == typeof e && null != e && 'function' == typeof e.type
          ? e.type.name || e.type.toString()
          : yn(e);
      }
      const vn = (() =>
        (('undefined' != typeof requestAnimationFrame && requestAnimationFrame) || setTimeout).bind(
          Se
        ))();
      function bn(e) {
        return { name: 'document', target: e.ownerDocument };
      }
      function wn(e) {
        return e instanceof Function ? e() : e;
      }
      let Sn = !0;
      function En(e) {
        const t = Sn;
        return (Sn = e), t;
      }
      let Tn = 0;
      function xn(e, t) {
        const n = Cn(e, t);
        if (-1 !== n) return n;
        const s = t[1];
        s.firstCreatePass &&
          ((e.injectorIndex = t.length), kn(s.data, e), kn(t, null), kn(s.blueprint, null));
        const r = Pn(e, t),
          i = e.injectorIndex;
        if (pn(r)) {
          const e = fn(r),
            n = gn(r, t),
            s = n[1].data;
          for (let r = 0; r < 8; r++) t[i + r] = n[e + r] | s[e + r];
        }
        return (t[i + 8] = r), i;
      }
      function kn(e, t) {
        e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
      }
      function Cn(e, t) {
        return -1 === e.injectorIndex ||
          (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
          null == t[e.injectorIndex + 8]
          ? -1
          : e.injectorIndex;
      }
      function Pn(e, t) {
        if (e.parent && -1 !== e.parent.injectorIndex) return e.parent.injectorIndex;
        let n = t[6],
          s = 1;
        for (; n && -1 === n.injectorIndex; ) (n = (t = t[15]) ? t[6] : null), s++;
        return n ? n.injectorIndex | (s << 16) : -1;
      }
      function An(e, t, n) {
        !(function (e, t, n) {
          let s = 'string' != typeof n ? n[Ae] : n.charCodeAt(0) || 0;
          null == s && (s = n[Ae] = Tn++);
          const r = 255 & s,
            i = 1 << r,
            o = 64 & r,
            a = 32 & r,
            l = t.data;
          128 & r
            ? o
              ? a
                ? (l[e + 7] |= i)
                : (l[e + 6] |= i)
              : a
              ? (l[e + 5] |= i)
              : (l[e + 4] |= i)
            : o
            ? a
              ? (l[e + 3] |= i)
              : (l[e + 2] |= i)
            : a
            ? (l[e + 1] |= i)
            : (l[e] |= i);
        })(e, t, n);
      }
      function Ln(e, t, n, s = te.Default, r) {
        if (null !== e) {
          const r = (function (e) {
            if ('string' == typeof e) return e.charCodeAt(0) || 0;
            const t = e[Ae];
            return 'number' == typeof t && t > 0 ? 255 & t : t;
          })(n);
          if ('function' == typeof r) {
            Gt(t, e);
            try {
              const e = r();
              if (null != e || s & te.Optional) return e;
              throw new Error(`No provider for ${_n(n)}!`);
            } finally {
              Jt();
            }
          } else if ('number' == typeof r) {
            if (-1 === r) return new Rn(e, t);
            let i = null,
              o = Cn(e, t),
              a = -1,
              l = s & te.Host ? t[16][6] : null;
            for (
              (-1 === o || s & te.SkipSelf) &&
              ((a = -1 === o ? Pn(e, t) : t[o + 8]),
              On(s, !1) ? ((i = t[1]), (o = fn(a)), (t = gn(a, t))) : (o = -1));
              -1 !== o;

            ) {
              a = t[o + 8];
              const e = t[1];
              if (Mn(r, o, e.data)) {
                const e = In(o, t, n, i, s, l);
                if (e !== Nn) return e;
              }
              On(s, t[1].data[o + 8] === l) && Mn(r, o, t)
                ? ((i = e), (o = fn(a)), (t = gn(a, t)))
                : (o = -1);
            }
          }
        }
        if ((s & te.Optional && void 0 === r && (r = null), 0 == (s & (te.Self | te.Host)))) {
          const e = t[9],
            i = Ve(void 0);
          try {
            return e ? e.get(n, r, s & te.Optional) : Be(n, r, s & te.Optional);
          } finally {
            Ve(i);
          }
        }
        if (s & te.Optional) return r;
        throw new Error(`NodeInjector: NOT_FOUND [${_n(n)}]`);
      }
      const Nn = {};
      function In(e, t, n, s, r, i) {
        const o = t[1],
          a = o.data[e + 8],
          l = Dn(a, o, n, null == s ? mt(a) && Sn : s != o && 3 === a.type, r & te.Host && i === a);
        return null !== l ? Fn(t, o, l, a) : Nn;
      }
      function Dn(e, t, n, s, r) {
        const i = e.providerIndexes,
          o = t.data,
          a = 65535 & i,
          l = e.directiveStart,
          u = i >> 16,
          c = r ? a + u : e.directiveEnd;
        for (let h = s ? a : a + u; h < c; h++) {
          const e = o[h];
          if ((h < l && n === e) || (h >= l && e.type === n)) return h;
        }
        if (r) {
          const e = o[l];
          if (e && yt(e) && e.type === n) return l;
        }
        return null;
      }
      function Fn(e, t, n, s) {
        let r = e[n];
        const i = t.data;
        if (r instanceof ln) {
          const o = r;
          if (o.resolving) throw new Error(`Circular dep for ${_n(i[n])}`);
          const a = En(o.canSeeViewProviders);
          let l;
          (o.resolving = !0), o.injectImpl && (l = Ve(o.injectImpl)), Gt(e, s);
          try {
            (r = e[n] = o.factory(void 0, i, e, s)),
              t.firstCreatePass &&
                n >= s.directiveStart &&
                (function (e, t, n) {
                  const { onChanges: s, onInit: r, doCheck: i } = t;
                  s &&
                    ((n.preOrderHooks || (n.preOrderHooks = [])).push(e, s),
                    (n.preOrderCheckHooks || (n.preOrderCheckHooks = [])).push(e, s)),
                    r && (n.preOrderHooks || (n.preOrderHooks = [])).push(-e, r),
                    i &&
                      ((n.preOrderHooks || (n.preOrderHooks = [])).push(e, i),
                      (n.preOrderCheckHooks || (n.preOrderCheckHooks = [])).push(e, i));
                })(n, i[n], t);
          } finally {
            o.injectImpl && Ve(l), En(a), (o.resolving = !1), Jt();
          }
        }
        return r;
      }
      function Mn(e, t, n) {
        const s = 64 & e,
          r = 32 & e;
        let i;
        return (
          (i =
            128 & e
              ? s
                ? r
                  ? n[t + 7]
                  : n[t + 6]
                : r
                ? n[t + 5]
                : n[t + 4]
              : s
              ? r
                ? n[t + 3]
                : n[t + 2]
              : r
              ? n[t + 1]
              : n[t]),
          !!(i & (1 << e))
        );
      }
      function On(e, t) {
        return !(e & te.Self || (e & te.Host && t));
      }
      class Rn {
        constructor(e, t) {
          (this._tNode = e), (this._lView = t);
        }
        get(e, t) {
          return Ln(this._tNode, this._lView, e, void 0, t);
        }
      }
      function Vn(e) {
        return e.ngDebugContext;
      }
      function jn(e) {
        return e.ngOriginalError;
      }
      function Hn(e, ...t) {
        e.error(...t);
      }
      class Bn {
        constructor() {
          this._console = console;
        }
        handleError(e) {
          const t = this._findOriginalError(e),
            n = this._findContext(e),
            s = (function (e) {
              return e.ngErrorLogger || Hn;
            })(e);
          s(this._console, 'ERROR', e),
            t && s(this._console, 'ORIGINAL ERROR', t),
            n && s(this._console, 'ERROR CONTEXT', n);
        }
        _findContext(e) {
          return e ? (Vn(e) ? Vn(e) : this._findContext(jn(e))) : null;
        }
        _findOriginalError(e) {
          let t = jn(e);
          for (; t && jn(t); ) t = jn(t);
          return t;
        }
      }
      let zn = !0,
        qn = !1;
      function $n() {
        return (qn = !0), zn;
      }
      function Un(e, t) {
        e.__ngContext__ = t;
      }
      function Gn(e) {
        throw new Error(`Multiple components match node with tagname ${e.tagName}`);
      }
      function Kn() {
        throw new Error('Cannot mix multi providers and regular providers');
      }
      function Wn(e, t, n) {
        let s = e.length;
        for (;;) {
          const r = e.indexOf(t, n);
          if (-1 === r) return r;
          if (0 === r || e.charCodeAt(r - 1) <= 32) {
            const n = t.length;
            if (r + n === s || e.charCodeAt(r + n) <= 32) return r;
          }
          n = r + 1;
        }
      }
      function Qn(e, t, n) {
        let s = 0;
        for (; s < e.length; ) {
          let r = e[s++];
          if (n && 'class' === r) {
            if (((r = e[s]), -1 !== Wn(r.toLowerCase(), t, 0))) return !0;
          } else if (1 === r) {
            for (; s < e.length && 'string' == typeof (r = e[s++]); )
              if (r.toLowerCase() === t) return !0;
            return !1;
          }
        }
        return !1;
      }
      function Zn(e, t, n) {
        return t === (0 !== e.type || n ? e.tagName : 'ng-template');
      }
      function Jn(e, t, n) {
        let s = 4;
        const r = e.attrs || [],
          i = (function (e) {
            for (let n = 0; n < e.length; n++) if (3 === (t = e[n]) || 4 === t || 6 === t) return n;
            var t;
            return e.length;
          })(r);
        let o = !1;
        for (let a = 0; a < t.length; a++) {
          const l = t[a];
          if ('number' != typeof l) {
            if (!o)
              if (4 & s) {
                if (
                  ((s = 2 | (1 & s)), ('' !== l && !Zn(e, l, n)) || ('' === l && 1 === t.length))
                ) {
                  if (Xn(s)) return !1;
                  o = !0;
                }
              } else {
                const u = 8 & s ? l : t[++a];
                if (8 & s && null !== e.attrs) {
                  if (!Qn(e.attrs, u, n)) {
                    if (Xn(s)) return !1;
                    o = !0;
                  }
                  continue;
                }
                const c = Yn(8 & s ? 'class' : l, r, 0 == e.type && 'ng-template' !== e.tagName, n);
                if (-1 === c) {
                  if (Xn(s)) return !1;
                  o = !0;
                  continue;
                }
                if ('' !== u) {
                  let e;
                  e = c > i ? '' : r[c + 1].toLowerCase();
                  const t = 8 & s ? e : null;
                  if ((t && -1 !== Wn(t, u, 0)) || (2 & s && u !== e)) {
                    if (Xn(s)) return !1;
                    o = !0;
                  }
                }
              }
          } else {
            if (!o && !Xn(s) && !Xn(l)) return !1;
            if (o && Xn(l)) continue;
            (o = !1), (s = l | (1 & s));
          }
        }
        return Xn(s) || o;
      }
      function Xn(e) {
        return 0 == (1 & e);
      }
      function Yn(e, t, n, s) {
        if (null === t) return -1;
        let r = 0;
        if (s || !n) {
          let n = !1;
          for (; r < t.length; ) {
            const s = t[r];
            if (s === e) return r;
            if (3 === s || 6 === s) n = !0;
            else {
              if (1 === s || 2 === s) {
                let e = t[++r];
                for (; 'string' == typeof e; ) e = t[++r];
                continue;
              }
              if (4 === s) break;
              if (0 === s) {
                r += 4;
                continue;
              }
            }
            r += n ? 1 : 2;
          }
          return -1;
        }
        return (function (e, t) {
          let n = e.indexOf(4);
          if (n > -1)
            for (n++; n < e.length; ) {
              if (e[n] === t) return n;
              n++;
            }
          return -1;
        })(t, e);
      }
      function es(e, t, n = !1) {
        for (let s = 0; s < t.length; s++) if (Jn(e, t[s], n)) return !0;
        return !1;
      }
      function ts(e, t) {
        return e ? ':not(' + t.trim() + ')' : t;
      }
      function ns(e) {
        let t = e[0],
          n = 1,
          s = 2,
          r = '',
          i = !1;
        for (; n < e.length; ) {
          let o = e[n];
          if ('string' == typeof o)
            if (2 & s) {
              const t = e[++n];
              r += '[' + o + (t.length > 0 ? '="' + t + '"' : '') + ']';
            } else 8 & s ? (r += '.' + o) : 4 & s && (r += ' ' + o);
          else '' === r || Xn(o) || ((t += ts(i, r)), (r = '')), (s = o), (i = i || !Xn(s));
          n++;
        }
        return '' !== r && (t += ts(i, r)), t;
      }
      const ss = {};
      function rs(e) {
        const t = e[3];
        return pt(t) ? t[3] : t;
      }
      function is(e) {
        os(Mt(), Ft(), Yt() + e, Ht());
      }
      function os(e, t, n, s) {
        if (!s)
          if (3 == (3 & t[2])) {
            const s = e.preOrderCheckHooks;
            null !== s && nn(t, s, n);
          } else {
            const s = e.preOrderHooks;
            null !== s && sn(t, s, 0, n);
          }
        en(n);
      }
      function as(e, t) {
        return (e << 17) | (t << 2);
      }
      function ls(e) {
        return (e >> 17) & 32767;
      }
      function us(e) {
        return 2 | e;
      }
      function cs(e) {
        return (131068 & e) >> 2;
      }
      function hs(e, t) {
        return (-131069 & e) | (t << 2);
      }
      function ds(e) {
        return 1 | e;
      }
      function ps(e, t) {
        const n = e.contentQueries;
        if (null !== n)
          for (let s = 0; s < n.length; s += 2) {
            const r = n[s],
              i = n[s + 1];
            if (-1 !== i) {
              const n = e.data[i];
              Ut(r), n.contentQueries(2, t[i], i);
            }
          }
      }
      function fs(e, t, n) {
        return bt(t)
          ? t.createElement(e, n)
          : null === n
          ? t.createElement(e)
          : t.createElementNS(n, e);
      }
      function ms(e, t, n, s, r, i, o, a, l, u) {
        const c = t.blueprint.slice();
        return (
          (c[0] = r),
          (c[2] = 140 | s),
          Nt(c),
          (c[3] = c[15] = e),
          (c[8] = n),
          (c[10] = o || (e && e[10])),
          (c[11] = a || (e && e[11])),
          (c[12] = l || (e && e[12]) || null),
          (c[9] = u || (e && e[9]) || null),
          (c[6] = i),
          (c[16] = 2 == t.type ? e[16] : c),
          c
        );
      }
      function gs(e, t, n, s, r, i) {
        const o = n + 19,
          a =
            e.data[o] ||
            (function (e, t, n, s, r, i) {
              const o = Ot(),
                a = Vt(),
                l = a ? o : o && o.parent,
                u = (e.data[n] = ks(0, l && l !== t ? l : null, s, n, r, i));
              return (
                null === e.firstChild && (e.firstChild = u),
                o &&
                  (!a || null != o.child || (null === u.parent && 2 !== o.type)
                    ? a || (o.next = u)
                    : (o.child = u)),
                u
              );
            })(e, t, o, s, r, i);
        return Rt(a, !0), a;
      }
      function ys(e, t, n) {
        Kt(t, t[6]);
        try {
          const s = e.viewQuery;
          null !== s && Ws(1, s, n);
          const r = e.template;
          null !== r && bs(e, t, r, 1, n),
            e.firstCreatePass && (e.firstCreatePass = !1),
            e.staticContentQueries && ps(e, t),
            e.staticViewQueries && Ws(2, e.viewQuery, n);
          const i = e.components;
          null !== i &&
            (function (e, t) {
              for (let n = 0; n < t.length; n++) qs(e, t[n]);
            })(t, i);
        } finally {
          (t[2] &= -5), Xt();
        }
      }
      function _s(e, t, n, s) {
        const r = t[2];
        if (256 == (256 & r)) return;
        Kt(t, t[6]);
        const i = Ht();
        try {
          Nt(t), (It.lFrame.bindingIndex = e.bindingStartIndex), null !== n && bs(e, t, n, 2, s);
          const o = 3 == (3 & r);
          if (!i)
            if (o) {
              const n = e.preOrderCheckHooks;
              null !== n && nn(t, n, null);
            } else {
              const n = e.preOrderHooks;
              null !== n && sn(t, n, 0, null), rn(t, 0);
            }
          if (
            ((function (e) {
              let t = e[13];
              for (; null !== t; ) {
                let n;
                if (pt(t) && (n = t[2]) >> 1 == -1) {
                  for (let e = 9; e < t.length; e++) {
                    const n = t[e],
                      s = n[1];
                    At(n) && _s(s, n, s.template, n[8]);
                  }
                  0 != (1 & n) && Bs(t, e[16]);
                }
                t = t[4];
              }
            })(t),
            null !== e.contentQueries && ps(e, t),
            !i)
          )
            if (o) {
              const n = e.contentCheckHooks;
              null !== n && nn(t, n);
            } else {
              const n = e.contentHooks;
              null !== n && sn(t, n, 1), rn(t, 1);
            }
          !(function (e, t) {
            try {
              const n = e.expandoInstructions;
              if (null !== n) {
                let s = e.expandoStartIndex,
                  r = -1,
                  i = -1;
                for (let e = 0; e < n.length; e++) {
                  const o = n[e];
                  'number' == typeof o
                    ? o <= 0
                      ? ((i = 0 - o), en(i), (s += 9 + n[++e]), (r = s))
                      : (s += o)
                    : (null !== o && (qt(s, r), o(2, t[r])), r++);
                }
              }
            } finally {
              en(-1);
            }
          })(e, t);
          const a = e.components;
          null !== a &&
            (function (e, t) {
              for (let n = 0; n < t.length; n++) zs(e, t[n]);
            })(t, a);
          const l = e.viewQuery;
          if ((null !== l && Ws(2, l, s), !i))
            if (o) {
              const n = e.viewCheckHooks;
              null !== n && nn(t, n);
            } else {
              const n = e.viewHooks;
              null !== n && sn(t, n, 2), rn(t, 2);
            }
          !0 === e.firstUpdatePass && (e.firstUpdatePass = !1), i || (t[2] &= -73);
        } finally {
          Xt();
        }
      }
      function vs(e, t, n, s) {
        const r = t[10],
          i = !Ht(),
          o = Pt(t);
        try {
          i && !o && r.begin && r.begin(), o && ys(e, t, s), _s(e, t, n, s);
        } finally {
          i && !o && r.end && r.end();
        }
      }
      function bs(e, t, n, s, r) {
        const i = Yt();
        try {
          en(-1), 2 & s && t.length > 19 && os(e, t, 0, Ht()), n(s, r);
        } finally {
          en(i);
        }
      }
      function ws(e, t, n) {
        if (ft(t)) {
          const s = t.directiveEnd;
          for (let r = t.directiveStart; r < s; r++) {
            const t = e.data[r];
            t.contentQueries && t.contentQueries(1, n[r], r);
          }
        }
      }
      function Ss(e, t, n) {
        Dt() &&
          ((function (e, t, n, s) {
            const r = n.directiveStart,
              i = n.directiveEnd;
            e.firstCreatePass || xn(n, t), Un(s, t);
            const o = n.initialInputs;
            for (let a = r; a < i; a++) {
              const s = e.data[a],
                i = yt(s);
              i && Rs(t, n, s);
              const l = Fn(t, e, a, n);
              Un(l, t), null !== o && Vs(0, a - r, l, s, 0, o), i && (kt(n.index, t)[8] = l);
            }
          })(e, t, n, Tt(n, t)),
          128 == (128 & n.flags) &&
            (function (e, t, n) {
              const s = n.directiveStart,
                r = n.directiveEnd,
                i = e.expandoInstructions,
                o = e.firstCreatePass,
                a = n.index - 19;
              try {
                en(a);
                for (let n = s; n < r; n++) {
                  const s = e.data[n],
                    r = t[n];
                  null !== s.hostBindings || 0 !== s.hostVars || null !== s.hostAttrs
                    ? Ns(s, r)
                    : o && i.push(null);
                }
              } finally {
                en(-1);
              }
            })(e, t, n));
      }
      function Es(e, t, n = Tt) {
        const s = t.localNames;
        if (null !== s) {
          let r = t.index + 1;
          for (let i = 0; i < s.length; i += 2) {
            const o = s[i + 1],
              a = -1 === o ? n(t, e) : e[o];
            e[r++] = a;
          }
        }
      }
      function Ts(e) {
        return (
          e.tView ||
          (e.tView = xs(
            1,
            -1,
            e.template,
            e.decls,
            e.vars,
            e.directiveDefs,
            e.pipeDefs,
            e.viewQuery,
            e.schemas,
            e.consts
          ))
        );
      }
      function xs(e, t, n, s, r, i, o, a, l, u) {
        const c = 19 + s,
          h = c + r,
          d = (function (e, t) {
            const n = [];
            for (let s = 0; s < t; s++) n.push(s < e ? null : ss);
            return n;
          })(c, h);
        return (d[1] = {
          type: e,
          id: t,
          blueprint: d,
          template: n,
          queries: null,
          viewQuery: a,
          node: null,
          data: d.slice().fill(null, c),
          bindingStartIndex: c,
          expandoStartIndex: h,
          expandoInstructions: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: 'function' == typeof i ? i() : i,
          pipeRegistry: 'function' == typeof o ? o() : o,
          firstChild: null,
          schemas: l,
          consts: u,
        });
      }
      function ks(e, t, n, s, r, i) {
        return {
          type: n,
          index: s,
          injectorIndex: t ? t.injectorIndex : -1,
          directiveStart: -1,
          directiveEnd: -1,
          directiveStylingLast: -1,
          propertyBindings: null,
          flags: 0,
          providerIndexes: 0,
          tagName: r,
          attrs: i,
          mergedAttrs: null,
          localNames: null,
          initialInputs: void 0,
          inputs: null,
          outputs: null,
          tViews: null,
          next: null,
          projectionNext: null,
          child: null,
          parent: t,
          projection: null,
          styles: null,
          residualStyles: void 0,
          classes: null,
          residualClasses: void 0,
          classBindings: 0,
          styleBindings: 0,
        };
      }
      function Cs(e, t, n) {
        for (let s in e)
          if (e.hasOwnProperty(s)) {
            const r = e[s];
            (n = null === n ? {} : n).hasOwnProperty(s) ? n[s].push(t, r) : (n[s] = [t, r]);
          }
        return n;
      }
      function Ps(e, t, n, s) {
        let r = !1;
        if (Dt()) {
          const i = (function (e, t, n) {
              const s = e.directiveRegistry;
              let r = null;
              if (s)
                for (let i = 0; i < s.length; i++) {
                  const o = s[i];
                  es(n, o.selectors, !1) &&
                    (r || (r = []),
                    An(xn(n, t), e, o.type),
                    yt(o) ? (2 & n.flags && Gn(n), Ds(e, n), r.unshift(o)) : r.push(o));
                }
              return r;
            })(e, t, n),
            o = null === s ? null : { '': -1 };
          if (null !== i) {
            let s = 0;
            (r = !0), Ms(n, e.data.length, i.length);
            for (let e = 0; e < i.length; e++) {
              const t = i[e];
              t.providersResolver && t.providersResolver(t);
            }
            Is(e, n, i.length);
            let a = !1,
              l = !1;
            for (let r = 0; r < i.length; r++) {
              const u = i[r];
              (n.mergedAttrs = hn(n.mergedAttrs, u.hostAttrs)),
                Os(e, t, u),
                Fs(e.data.length - 1, u, o),
                null !== u.contentQueries && (n.flags |= 8),
                (null === u.hostBindings && null === u.hostAttrs && 0 === u.hostVars) ||
                  (n.flags |= 128),
                !a &&
                  (u.onChanges || u.onInit || u.doCheck) &&
                  ((e.preOrderHooks || (e.preOrderHooks = [])).push(n.index - 19), (a = !0)),
                l ||
                  (!u.onChanges && !u.doCheck) ||
                  ((e.preOrderCheckHooks || (e.preOrderCheckHooks = [])).push(n.index - 19),
                  (l = !0)),
                As(e, u),
                (s += u.hostVars);
            }
            !(function (e, t) {
              const n = t.directiveEnd,
                s = e.data,
                r = t.attrs,
                i = [];
              let o = null,
                a = null;
              for (let l = t.directiveStart; l < n; l++) {
                const e = s[l],
                  t = e.inputs;
                i.push(null !== r ? js(t, r) : null), (o = Cs(t, l, o)), (a = Cs(e.outputs, l, a));
              }
              null !== o &&
                (o.hasOwnProperty('class') && (t.flags |= 16),
                o.hasOwnProperty('style') && (t.flags |= 32)),
                (t.initialInputs = i),
                (t.inputs = o),
                (t.outputs = a);
            })(e, n),
              Ls(e, t, s);
          }
          o &&
            (function (e, t, n) {
              if (t) {
                const s = (e.localNames = []);
                for (let e = 0; e < t.length; e += 2) {
                  const r = n[t[e + 1]];
                  if (null == r) throw new Error(`Export of name '${t[e + 1]}' not found!`);
                  s.push(t[e], r);
                }
              }
            })(n, s, o);
        }
        return (n.mergedAttrs = hn(n.mergedAttrs, n.attrs)), r;
      }
      function As(e, t) {
        const n = e.expandoInstructions;
        n.push(t.hostBindings), 0 !== t.hostVars && n.push(t.hostVars);
      }
      function Ls(e, t, n) {
        for (let s = 0; s < n; s++) t.push(ss), e.blueprint.push(ss), e.data.push(null);
      }
      function Ns(e, t) {
        null !== e.hostBindings && e.hostBindings(1, t);
      }
      function Is(e, t, n) {
        const s = 19 - t.index,
          r = e.data.length - (65535 & t.providerIndexes);
        (e.expandoInstructions || (e.expandoInstructions = [])).push(s, r, n);
      }
      function Ds(e, t) {
        (t.flags |= 2), (e.components || (e.components = [])).push(t.index);
      }
      function Fs(e, t, n) {
        if (n) {
          if (t.exportAs) for (let s = 0; s < t.exportAs.length; s++) n[t.exportAs[s]] = e;
          yt(t) && (n[''] = e);
        }
      }
      function Ms(e, t, n) {
        (e.flags |= 1), (e.directiveStart = t), (e.directiveEnd = t + n), (e.providerIndexes = t);
      }
      function Os(e, t, n) {
        e.data.push(n);
        const s = n.factory || (n.factory = ct(n.type)),
          r = new ln(s, yt(n), null);
        e.blueprint.push(r), t.push(r);
      }
      function Rs(e, t, n) {
        const s = Tt(t, e),
          r = Ts(n),
          i = e[10],
          o = $s(e, ms(e, r, null, n.onPush ? 64 : 16, s, t, i, i.createRenderer(s, n)));
        e[t.index] = o;
      }
      function Vs(e, t, n, s, r, i) {
        const o = i[t];
        if (null !== o) {
          const e = s.setInput;
          for (let t = 0; t < o.length; ) {
            const r = o[t++],
              i = o[t++],
              a = o[t++];
            null !== e ? s.setInput(n, a, r, i) : (n[i] = a);
          }
        }
      }
      function js(e, t) {
        let n = null,
          s = 0;
        for (; s < t.length; ) {
          const r = t[s];
          if (0 !== r)
            if (5 !== r) {
              if ('number' == typeof r) break;
              e.hasOwnProperty(r) && (null === n && (n = []), n.push(r, e[r], t[s + 1])), (s += 2);
            } else s += 2;
          else s += 4;
        }
        return n;
      }
      function Hs(e, t, n, s) {
        return new Array(e, !0, -2, t, null, null, s, n, null);
      }
      function Bs(e, t) {
        const n = e[5];
        for (let s = 0; s < n.length; s++) {
          const e = n[s],
            r = e[3][3][16];
          if (r !== t && 0 == (16 & r[2])) {
            const t = e[1];
            _s(t, e, t.template, e[8]);
          }
        }
      }
      function zs(e, t) {
        const n = kt(t, e);
        if (At(n) && 80 & n[2]) {
          const e = n[1];
          _s(e, n, e.template, n[8]);
        }
      }
      function qs(e, t) {
        const n = kt(t, e),
          s = n[1];
        !(function (e, t) {
          for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
        })(s, n),
          ys(s, n, n[8]);
      }
      function $s(e, t) {
        return e[13] ? (e[14][4] = t) : (e[13] = t), (e[14] = t), t;
      }
      function Us(e) {
        for (; e; ) {
          e[2] |= 64;
          const t = rs(e);
          if (_t(e) && !t) return e;
          e = t;
        }
        return null;
      }
      function Gs(e, t, n) {
        const s = t[10];
        s.begin && s.begin();
        try {
          _s(e, t, e.template, n);
        } catch (r) {
          throw (Xs(t, r), r);
        } finally {
          s.end && s.end();
        }
      }
      function Ks(e) {
        !(function (e) {
          for (let t = 0; t < e.components.length; t++) {
            const n = e.components[t],
              s = Ct(n),
              r = s[1];
            vs(r, s, r.template, n);
          }
        })(e[8]);
      }
      function Ws(e, t, n) {
        Ut(0), t(e, n);
      }
      const Qs = (() => Promise.resolve(null))();
      function Zs(e) {
        return e[7] || (e[7] = []);
      }
      function Js(e) {
        return e.cleanup || (e.cleanup = []);
      }
      function Xs(e, t) {
        const n = e[9],
          s = n ? n.get(Bn, null) : null;
        s && s.handleError(t);
      }
      function Ys(e, t, n, s, r) {
        for (let i = 0; i < n.length; ) {
          const o = n[i++],
            a = n[i++],
            l = t[o],
            u = e.data[o];
          null !== u.setInput ? u.setInput(l, r, s, a) : (l[a] = r);
        }
      }
      function er(e, t) {
        const n = t[3];
        return -1 === e.index ? (pt(n) ? n : null) : n;
      }
      function tr(e, t) {
        const n = er(e, t);
        return n ? dr(t[11], n[7]) : null;
      }
      function nr(e, t, n, s, r) {
        if (null != s) {
          let i,
            o = !1;
          pt(s) ? (i = s) : dt(s) && ((o = !0), (s = s[0]));
          const a = St(s);
          0 === e && null !== n
            ? null == r
              ? cr(t, n, a)
              : ur(t, n, a, r || null)
            : 1 === e && null !== n
            ? ur(t, n, a, r || null)
            : 2 === e
            ? (function (e, t, n) {
                const s = dr(e, t);
                s &&
                  (function (e, t, n, s) {
                    bt(e) ? e.removeChild(t, n, s) : t.removeChild(n);
                  })(e, s, t, n);
              })(t, a, o)
            : 3 === e && t.destroyNode(a),
            null != i &&
              (function (e, t, n, s, r) {
                const i = n[7];
                i !== St(n) && nr(t, e, s, i, r);
                for (let o = 9; o < n.length; o++) {
                  const r = n[o];
                  gr(r[1], r, e, t, s, i);
                }
              })(t, e, i, n, r);
        }
      }
      function sr(e, t, n, s) {
        const r = tr(e.node, t);
        r && gr(e, t, t[11], n ? 1 : 2, r, s);
      }
      function rr(e, t) {
        const n = e[5],
          s = n.indexOf(t);
        n.splice(s, 1);
      }
      function ir(e, t) {
        if (e.length <= 9) return;
        const n = 9 + t,
          s = e[n];
        if (s) {
          const r = s[17];
          null !== r && r !== e && rr(r, s), t > 0 && (e[n - 1][4] = s[4]);
          const i = Ke(e, 9 + t);
          sr(s[1], s, !1, null);
          const o = i[5];
          null !== o && o.detachView(i[1]), (s[3] = null), (s[4] = null), (s[2] &= -129);
        }
        return s;
      }
      function or(e, t) {
        if (!(256 & t[2])) {
          const n = t[11];
          bt(n) && n.destroyNode && gr(e, t, n, 3, null, null),
            (function (e) {
              let t = e[13];
              if (!t) return lr(e[1], e);
              for (; t; ) {
                let n = null;
                if (dt(t)) n = t[13];
                else {
                  const e = t[9];
                  e && (n = e);
                }
                if (!n) {
                  for (; t && !t[4] && t !== e; ) dt(t) && lr(t[1], t), (t = ar(t, e));
                  null === t && (t = e), dt(t) && lr(t[1], t), (n = t && t[4]);
                }
                t = n;
              }
            })(t);
        }
      }
      function ar(e, t) {
        let n;
        return dt(e) && (n = e[6]) && 2 === n.type ? er(n, e) : e[3] === t ? null : e[3];
      }
      function lr(e, t) {
        if (!(256 & t[2])) {
          (t[2] &= -129),
            (t[2] |= 256),
            (function (e, t) {
              let n;
              if (null != e && null != (n = e.destroyHooks))
                for (let s = 0; s < n.length; s += 2) {
                  const e = t[n[s]];
                  e instanceof ln || n[s + 1].call(e);
                }
            })(e, t),
            (function (e, t) {
              const n = e.cleanup;
              if (null !== n) {
                const e = t[7];
                for (let s = 0; s < n.length - 1; s += 2)
                  if ('string' == typeof n[s]) {
                    const r = n[s + 1],
                      i = 'function' == typeof r ? r(t) : St(t[r]),
                      o = e[n[s + 2]],
                      a = n[s + 3];
                    'boolean' == typeof a
                      ? i.removeEventListener(n[s], o, a)
                      : a >= 0
                      ? e[a]()
                      : e[-a].unsubscribe(),
                      (s += 2);
                  } else n[s].call(e[n[s + 1]]);
                t[7] = null;
              }
            })(e, t);
          const n = t[6];
          n && 3 === n.type && bt(t[11]) && t[11].destroy();
          const s = t[17];
          if (null !== s && pt(t[3])) {
            s !== t[3] && rr(s, t);
            const n = t[5];
            null !== n && n.detachView(e);
          }
        }
      }
      function ur(e, t, n, s) {
        bt(e) ? e.insertBefore(t, n, s) : t.insertBefore(n, s, !0);
      }
      function cr(e, t, n) {
        bt(e) ? e.appendChild(t, n) : t.appendChild(n);
      }
      function hr(e, t, n, s) {
        null !== s ? ur(e, t, n, s) : cr(e, t, n);
      }
      function dr(e, t) {
        return bt(e) ? e.parentNode(t) : t.parentNode;
      }
      function pr(e, t, n, s) {
        const r = (function (e, t, n) {
          let s = t.parent;
          for (; null != s && (4 === s.type || 5 === s.type); ) s = (t = s).parent;
          if (null == s) {
            const e = n[6];
            return 2 === e.type ? tr(e, n) : n[0];
          }
          if (t && 5 === t.type && 4 & t.flags) return Tt(t, n).parentNode;
          if (2 & s.flags) {
            const t = e.data,
              n = t[t[s.index].directiveStart].encapsulation;
            if (n !== Xe.ShadowDom && n !== Xe.Native) return null;
          }
          return Tt(s, n);
        })(e, s, t);
        if (null != r) {
          const e = t[11],
            i = (function (e, t) {
              if (2 === e.type) {
                const n = er(e, t);
                return null === n ? null : fr(n.indexOf(t, 9) - 9, n);
              }
              return 4 === e.type || 5 === e.type ? Tt(e, t) : null;
            })(s.parent || t[6], t);
          if (Array.isArray(n)) for (let t = 0; t < n.length; t++) hr(e, r, n[t], i);
          else hr(e, r, n, i);
        }
      }
      function fr(e, t) {
        const n = 9 + e + 1;
        if (n < t.length) {
          const e = t[n],
            s = e[1].firstChild;
          if (null !== s)
            return (function e(t, n) {
              if (null !== n) {
                const s = n.type;
                if (3 === s) return Tt(n, t);
                if (0 === s) return fr(-1, t[n.index]);
                if (4 === s || 5 === s) {
                  const s = n.child;
                  if (null !== s) return e(t, s);
                  {
                    const e = t[n.index];
                    return pt(e) ? fr(-1, e) : St(e);
                  }
                }
                {
                  const s = t[16],
                    r = s[6],
                    i = rs(s),
                    o = r.projection[n.projection];
                  return null != o ? e(i, o) : e(t, n.next);
                }
              }
              return null;
            })(e, s);
        }
        return t[7];
      }
      function mr(e, t, n, s, r, i, o) {
        for (; null != n; ) {
          const a = s[n.index],
            l = n.type;
          o && 0 === t && (a && Un(St(a), s), (n.flags |= 4)),
            64 != (64 & n.flags) &&
              (4 === l || 5 === l
                ? (mr(e, t, n.child, s, r, i, !1), nr(t, e, r, a, i))
                : 1 === l
                ? yr(e, t, s, n, r, i)
                : nr(t, e, r, a, i)),
            (n = o ? n.projectionNext : n.next);
        }
      }
      function gr(e, t, n, s, r, i) {
        mr(n, s, e.node.child, t, r, i, !1);
      }
      function yr(e, t, n, s, r, i) {
        const o = n[16],
          a = o[6].projection[s.projection];
        if (Array.isArray(a)) for (let l = 0; l < a.length; l++) nr(t, e, r, a[l], i);
        else mr(e, t, a, o[3], r, i, !0);
      }
      function _r(e, t, n) {
        bt(e) ? e.setAttribute(t, 'style', n) : (t.style.cssText = n);
      }
      function vr(e, t, n) {
        bt(e)
          ? '' === n
            ? e.removeAttribute(t, 'class')
            : e.setAttribute(t, 'class', n)
          : (t.className = n);
      }
      class br {
        constructor(e, t) {
          (this._lView = e),
            (this._cdRefInjectingView = t),
            (this._appRef = null),
            (this._viewContainerRef = null),
            (this._tViewNode = null);
        }
        get rootNodes() {
          const e = this._lView;
          return null == e[0]
            ? (function e(t, n, s, r, i = !1) {
                for (; null !== s; ) {
                  const o = n[s.index];
                  if ((null !== o && r.push(St(o)), pt(o)))
                    for (let t = 9; t < o.length; t++) {
                      const n = o[t],
                        s = n[1].firstChild;
                      null !== s && e(n[1], n, s, r);
                    }
                  const a = s.type;
                  if (4 === a || 5 === a) e(t, n, s.child, r);
                  else if (1 === a) {
                    const t = n[16],
                      i = t[6],
                      o = rs(t);
                    let a = i.projection[s.projection];
                    null !== a && null !== o && e(o[1], o, a, r, !0);
                  }
                  s = i ? s.projectionNext : s.next;
                }
                return r;
              })(e[1], e, e[6].child, [])
            : [];
        }
        get context() {
          return this._lView[8];
        }
        get destroyed() {
          return 256 == (256 & this._lView[2]);
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._viewContainerRef) {
            const e = this._viewContainerRef.indexOf(this);
            e > -1 && this._viewContainerRef.detach(e), (this._viewContainerRef = null);
          }
          or(this._lView[1], this._lView);
        }
        onDestroy(e) {
          var t, n, s;
          (t = this._lView[1]),
            (s = e),
            Zs((n = this._lView)).push(s),
            t.firstCreatePass && Js(t).push(n[7].length - 1, null);
        }
        markForCheck() {
          Us(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[2] &= -129;
        }
        reattach() {
          this._lView[2] |= 128;
        }
        detectChanges() {
          Gs(this._lView[1], this._lView, this.context);
        }
        checkNoChanges() {
          !(function (e, t, n) {
            Bt(!0);
            try {
              Gs(e, t, n);
            } finally {
              Bt(!1);
            }
          })(this._lView[1], this._lView, this.context);
        }
        attachToViewContainerRef(e) {
          if (this._appRef)
            throw new Error('This view is already attached directly to the ApplicationRef!');
          this._viewContainerRef = e;
        }
        detachFromAppRef() {
          var e;
          (this._appRef = null), gr(this._lView[1], (e = this._lView), e[11], 2, null, null);
        }
        attachToAppRef(e) {
          if (this._viewContainerRef)
            throw new Error('This view is already attached to a ViewContainer!');
          this._appRef = e;
        }
      }
      class wr extends br {
        constructor(e) {
          super(e), (this._view = e);
        }
        detectChanges() {
          Ks(this._view);
        }
        checkNoChanges() {
          !(function (e) {
            Bt(!0);
            try {
              Ks(e);
            } finally {
              Bt(!1);
            }
          })(this._view);
        }
        get context() {
          return null;
        }
      }
      let Sr, Er, Tr;
      function xr(e, t, n) {
        return Sr || (Sr = class extends e {}), new Sr(Tt(t, n));
      }
      function kr(e, t, n, s) {
        return (
          Er ||
            (Er = class extends e {
              constructor(e, t, n) {
                super(),
                  (this._declarationView = e),
                  (this._declarationTContainer = t),
                  (this.elementRef = n);
              }
              createEmbeddedView(e) {
                const t = this._declarationTContainer.tViews,
                  n = ms(this._declarationView, t, e, 16, null, t.node);
                n[17] = this._declarationView[this._declarationTContainer.index];
                const s = this._declarationView[5];
                null !== s && (n[5] = s.createEmbeddedView(t)), ys(t, n, e);
                const r = new br(n);
                return (r._tViewNode = n[6]), r;
              }
            }),
          0 === n.type ? new Er(s, n, xr(t, n, s)) : null
        );
      }
      function Cr(e, t, n, s) {
        let r;
        Tr ||
          (Tr = class extends e {
            constructor(e, t, n) {
              super(), (this._lContainer = e), (this._hostTNode = t), (this._hostView = n);
            }
            get element() {
              return xr(t, this._hostTNode, this._hostView);
            }
            get injector() {
              return new Rn(this._hostTNode, this._hostView);
            }
            get parentInjector() {
              const e = Pn(this._hostTNode, this._hostView),
                t = gn(e, this._hostView),
                n = (function (e, t, n) {
                  if (n.parent && -1 !== n.parent.injectorIndex) {
                    const e = n.parent.injectorIndex;
                    let t = n.parent;
                    for (; null != t.parent && e == t.parent.injectorIndex; ) t = t.parent;
                    return t;
                  }
                  let s = mn(e),
                    r = t,
                    i = t[6];
                  for (; s > 1; ) (r = r[15]), (i = r[6]), s--;
                  return i;
                })(e, this._hostView, this._hostTNode);
              return pn(e) && null != n ? new Rn(n, t) : new Rn(null, this._hostView);
            }
            clear() {
              for (; this.length > 0; ) this.remove(this.length - 1);
            }
            get(e) {
              return (null !== this._lContainer[8] && this._lContainer[8][e]) || null;
            }
            get length() {
              return this._lContainer.length - 9;
            }
            createEmbeddedView(e, t, n) {
              const s = e.createEmbeddedView(t || {});
              return this.insert(s, n), s;
            }
            createComponent(e, t, n, s, r) {
              const i = n || this.parentInjector;
              if (!r && null == e.ngModule && i) {
                const e = i.get($e, null);
                e && (r = e);
              }
              const o = e.create(i, s, void 0, r);
              return this.insert(o.hostView, t), o;
            }
            insert(e, t) {
              const n = e._lView,
                s = n[1];
              if (e.destroyed)
                throw new Error('Cannot insert a destroyed View in a ViewContainer!');
              if ((this.allocateContainerIfNeeded(), pt(n[3]))) {
                const t = this.indexOf(e);
                if (-1 !== t) this.detach(t);
                else {
                  const t = n[3],
                    s = new Tr(t, t[6], t[3]);
                  s.detach(s.indexOf(e));
                }
              }
              const r = this._adjustIndex(t);
              return (
                (function (e, t, n, s) {
                  const r = 9 + s,
                    i = n.length;
                  s > 0 && (n[r - 1][4] = t),
                    s < i - 9 ? ((t[4] = n[r]), Ge(n, 9 + s, t)) : (n.push(t), (t[4] = null)),
                    (t[3] = n);
                  const o = t[17];
                  null !== o &&
                    n !== o &&
                    (function (e, t) {
                      const n = e[5],
                        s = t[3][3][16];
                      16 != (16 & s[2]) && t[16] !== s && (e[2] |= 1),
                        null === n ? (e[5] = [t]) : n.push(t);
                    })(o, t);
                  const a = t[5];
                  null !== a && a.insertView(e), (t[2] |= 128);
                })(s, n, this._lContainer, r),
                sr(s, n, !0, fr(r, this._lContainer)),
                e.attachToViewContainerRef(this),
                Ge(this._lContainer[8], r, e),
                e
              );
            }
            move(e, t) {
              if (e.destroyed) throw new Error('Cannot move a destroyed View in a ViewContainer!');
              return this.insert(e, t);
            }
            indexOf(e) {
              const t = this._lContainer[8];
              return null !== t ? t.indexOf(e) : -1;
            }
            remove(e) {
              this.allocateContainerIfNeeded();
              const t = this._adjustIndex(e, -1);
              (function (e, t) {
                const n = ir(e, t);
                n && or(n[1], n);
              })(this._lContainer, t),
                Ke(this._lContainer[8], t);
            }
            detach(e) {
              this.allocateContainerIfNeeded();
              const t = this._adjustIndex(e, -1),
                n = ir(this._lContainer, t);
              return n && null != Ke(this._lContainer[8], t) ? new br(n) : null;
            }
            _adjustIndex(e, t = 0) {
              return null == e ? this.length + t : e;
            }
            allocateContainerIfNeeded() {
              null === this._lContainer[8] && (this._lContainer[8] = []);
            }
          });
        const i = s[n.index];
        if (pt(i))
          (r = i),
            (function (e, t) {
              e[2] = -2;
            })(r);
        else {
          let e;
          if (4 === n.type) e = St(i);
          else if (((e = s[11].createComment('')), _t(s))) {
            const t = s[11],
              r = Tt(n, s);
            ur(
              t,
              dr(t, r),
              e,
              (function (e, t) {
                return bt(e) ? e.nextSibling(t) : t.nextSibling;
              })(t, r)
            );
          } else pr(s[1], s, e, n);
          (s[n.index] = r = Hs(i, s, e, n)), $s(s, r);
        }
        return new Tr(r, n, s);
      }
      let Pr = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = () => Ar()), e;
      })();
      const Ar = function (e = !1) {
          return (function (e, t, n) {
            if (!n && mt(e)) {
              const n = kt(e.index, t);
              return new br(n, n);
            }
            return 3 === e.type || 0 === e.type || 4 === e.type || 5 === e.type
              ? new br(t[16], t)
              : null;
          })(Ot(), Ft(), e);
        },
        Lr = new Le('Set Injector scope.'),
        Nr = {},
        Ir = {},
        Dr = [];
      let Fr = void 0;
      function Mr() {
        return void 0 === Fr && (Fr = new qe()), Fr;
      }
      function Or(e, t = null, n = null, s) {
        return new Rr(e, n, t || Mr(), s);
      }
      class Rr {
        constructor(e, t, n, s = null) {
          (this.parent = n),
            (this.records = new Map()),
            (this.injectorDefTypes = new Set()),
            (this.onDestroy = new Set()),
            (this._destroyed = !1);
          const r = [];
          t && Ue(t, n => this.processProvider(n, e, t)),
            Ue([e], e => this.processInjectorType(e, [], r)),
            this.records.set(Ne, jr(void 0, this));
          const i = this.records.get(Lr);
          (this.scope = null != i ? i.value : null),
            (this.source = s || ('object' == typeof e ? null : pe(e)));
        }
        get destroyed() {
          return this._destroyed;
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          try {
            this.onDestroy.forEach(e => e.ngOnDestroy());
          } finally {
            this.records.clear(), this.onDestroy.clear(), this.injectorDefTypes.clear();
          }
        }
        get(e, t = Ie, n = te.Default) {
          this.assertNotDestroyed();
          const s = Re(this);
          try {
            if (!(n & te.SkipSelf)) {
              let t = this.records.get(e);
              if (void 0 === t) {
                const n =
                  ('function' == typeof (r = e) || ('object' == typeof r && r instanceof Le)) &&
                  ie(e);
                (t = n && this.injectableDefInScope(n) ? jr(Vr(e), Nr) : null),
                  this.records.set(e, t);
              }
              if (null != t) return this.hydrate(e, t);
            }
            return (n & te.Self ? Mr() : this.parent).get(
              e,
              (t = n & te.Optional && t === Ie ? null : t)
            );
          } catch (i) {
            if ('NullInjectorError' === i.name) {
              if (((i.ngTempTokenPath = i.ngTempTokenPath || []).unshift(pe(e)), s)) throw i;
              return (function (e, t, n, s) {
                const r = e.ngTempTokenPath;
                throw (
                  (t.__source && r.unshift(t.__source),
                  (e.message = (function (e, t, n, s = null) {
                    e = e && '\n' === e.charAt(0) && '\u0275' == e.charAt(1) ? e.substr(2) : e;
                    let r = pe(t);
                    if (Array.isArray(t)) r = t.map(pe).join(' -> ');
                    else if ('object' == typeof t) {
                      let e = [];
                      for (let n in t)
                        if (t.hasOwnProperty(n)) {
                          let s = t[n];
                          e.push(n + ':' + ('string' == typeof s ? JSON.stringify(s) : pe(s)));
                        }
                      r = `{${e.join(', ')}}`;
                    }
                    return `${n}${s ? '(' + s + ')' : ''}[${r}]: ${e.replace(De, '\n  ')}`;
                  })('\n' + e.message, r, n, s)),
                  (e.ngTokenPath = r),
                  (e.ngTempTokenPath = null),
                  e)
                );
              })(i, e, 'R3InjectorError', this.source);
            }
            throw i;
          } finally {
            Re(s);
          }
          var r;
        }
        _resolveInjectorDefTypes() {
          this.injectorDefTypes.forEach(e => this.get(e));
        }
        toString() {
          const e = [];
          return this.records.forEach((t, n) => e.push(pe(n))), `R3Injector[${e.join(', ')}]`;
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new Error('Injector has already been destroyed.');
        }
        processInjectorType(e, t, n) {
          if (!(e = ye(e))) return !1;
          let s = ae(e);
          const r = (null == s && e.ngModule) || void 0,
            i = void 0 === r ? e : r,
            o = -1 !== n.indexOf(i);
          if ((void 0 !== r && (s = ae(r)), null == s)) return !1;
          if (null != s.imports && !o) {
            let e;
            n.push(i);
            try {
              Ue(s.imports, s => {
                this.processInjectorType(s, t, n) && (void 0 === e && (e = []), e.push(s));
              });
            } finally {
            }
            if (void 0 !== e)
              for (let t = 0; t < e.length; t++) {
                const { ngModule: n, providers: s } = e[t];
                Ue(s, e => this.processProvider(e, n, s || Dr));
              }
          }
          this.injectorDefTypes.add(i), this.records.set(i, jr(s.factory, Nr));
          const a = s.providers;
          if (null != a && !o) {
            const t = e;
            Ue(a, e => this.processProvider(e, t, a));
          }
          return void 0 !== r && void 0 !== e.providers;
        }
        processProvider(e, t, n) {
          let s = Br((e = ye(e))) ? e : ye(e && e.provide);
          const r = (function (e, t, n) {
            return Hr(e)
              ? jr(void 0, e.useValue)
              : jr(
                  (function (e, t, n) {
                    let s = void 0;
                    if (Br(e)) {
                      const t = ye(e);
                      return ct(t) || Vr(t);
                    }
                    if (Hr(e)) s = () => ye(e.useValue);
                    else if ((r = e) && r.useFactory) s = () => e.useFactory(...ze(e.deps || []));
                    else if (
                      (function (e) {
                        return !(!e || !e.useExisting);
                      })(e)
                    )
                      s = () => He(ye(e.useExisting));
                    else {
                      const r = ye(e && (e.useClass || e.provide));
                      if (
                        (r ||
                          (function (e, t, n) {
                            let s = '';
                            throw (
                              (e &&
                                t &&
                                (s = ` - only instances of Provider and Type are allowed, got: [${t
                                  .map(e => (e == n ? '?' + n + '?' : '...'))
                                  .join(', ')}]`),
                              new Error(`Invalid provider for the NgModule '${pe(e)}'` + s))
                            );
                          })(t, n, e),
                        !(function (e) {
                          return !!e.deps;
                        })(e))
                      )
                        return ct(r) || Vr(r);
                      s = () => new r(...ze(e.deps));
                    }
                    var r;
                    return s;
                  })(e, t, n),
                  Nr
                );
          })(e, t, n);
          if (Br(e) || !0 !== e.multi) {
            const e = this.records.get(s);
            e && void 0 !== e.multi && Kn();
          } else {
            let t = this.records.get(s);
            t
              ? void 0 === t.multi && Kn()
              : ((t = jr(void 0, Nr, !0)), (t.factory = () => ze(t.multi)), this.records.set(s, t)),
              (s = e),
              t.multi.push(e);
          }
          this.records.set(s, r);
        }
        hydrate(e, t) {
          var n;
          return (
            t.value === Ir
              ? (function (e) {
                  throw new Error(`Cannot instantiate cyclic dependency! ${e}`);
                })(pe(e))
              : t.value === Nr && ((t.value = Ir), (t.value = t.factory())),
            'object' == typeof t.value &&
              t.value &&
              null !== (n = t.value) &&
              'object' == typeof n &&
              'function' == typeof n.ngOnDestroy &&
              this.onDestroy.add(t.value),
            t.value
          );
        }
        injectableDefInScope(e) {
          return (
            !!e.providedIn &&
            ('string' == typeof e.providedIn
              ? 'any' === e.providedIn || e.providedIn === this.scope
              : this.injectorDefTypes.has(e.providedIn))
          );
        }
      }
      function Vr(e) {
        const t = ie(e),
          n = null !== t ? t.factory : ct(e);
        if (null !== n) return n;
        const s = ae(e);
        if (null !== s) return s.factory;
        if (e instanceof Le) throw new Error(`Token ${pe(e)} is missing a \u0275prov definition.`);
        if (e instanceof Function)
          return (function (e) {
            const t = e.length;
            if (t > 0) {
              const n = (function (e, t) {
                const n = [];
                for (let s = 0; s < e; s++) n.push('?');
                return n;
              })(t);
              throw new Error(`Can't resolve all parameters for ${pe(e)}: (${n.join(', ')}).`);
            }
            const n = (function (e) {
              const t = e && (e[le] || e[he] || (e[ce] && e[ce]()));
              if (t) {
                const n = (function (e) {
                  if (e.hasOwnProperty('name')) return e.name;
                  const t = ('' + e).match(/^function\s*([^\s(]+)/);
                  return null === t ? '' : t[1];
                })(e);
                return (
                  console.warn(
                    `DEPRECATED: DI is instantiating a token "${n}" that inherits its @Injectable decorator but does not provide one itself.\n` +
                      `This will become an error in v10. Please add @Injectable() to the "${n}" class.`
                  ),
                  t
                );
              }
              return null;
            })(e);
            return null !== n ? () => n.factory(e) : () => new e();
          })(e);
        throw new Error('unreachable');
      }
      function jr(e, t, n = !1) {
        return { factory: e, value: t, multi: n ? [] : void 0 };
      }
      function Hr(e) {
        return null !== e && 'object' == typeof e && Fe in e;
      }
      function Br(e) {
        return 'function' == typeof e;
      }
      const zr = function (e, t, n) {
        return (function (e, t = null, n = null, s) {
          const r = Or(e, t, n, s);
          return r._resolveInjectorDefTypes(), r;
        })({ name: n }, t, e, n);
      };
      let qr = (() => {
          class e {
            static create(e, t) {
              return Array.isArray(e) ? zr(e, t, '') : zr(e.providers, e.parent, e.name || '');
            }
          }
          return (
            (e.THROW_IF_NOT_FOUND = Ie),
            (e.NULL = new qe()),
            (e.ɵprov = se({ token: e, providedIn: 'any', factory: () => He(Ne) })),
            (e.__NG_ELEMENT_ID__ = -1),
            e
          );
        })(),
        $r = new Map();
      const Ur = new Set();
      function Gr(e) {
        return 'string' == typeof e ? e : e.text();
      }
      function Kr(e, t) {
        let n = e.styles,
          s = e.classes,
          r = 0;
        for (let i = 0; i < t.length; i++) {
          const e = t[i];
          'number' == typeof e
            ? (r = e)
            : 1 == r
            ? (s = fe(s, e))
            : 2 == r && (n = fe(n, e + ': ' + t[++i] + ';'));
        }
        null !== n && (e.styles = n), null !== s && (e.classes = s);
      }
      let Wr = null;
      function Qr() {
        if (!Wr) {
          const e = Se.Symbol;
          if (e && e.iterator) Wr = e.iterator;
          else {
            const e = Object.getOwnPropertyNames(Map.prototype);
            for (let t = 0; t < e.length; ++t) {
              const n = e[t];
              'entries' !== n &&
                'size' !== n &&
                Map.prototype[n] === Map.prototype.entries &&
                (Wr = n);
            }
          }
        }
        return Wr;
      }
      function Zr(e, t) {
        return e === t || ('number' == typeof e && 'number' == typeof t && isNaN(e) && isNaN(t));
      }
      function Jr(e) {
        return !!Xr(e) && (Array.isArray(e) || (!(e instanceof Map) && Qr() in e));
      }
      function Xr(e) {
        return null !== e && ('function' == typeof e || 'object' == typeof e);
      }
      function Yr(e, t, n) {
        return !Object.is(e[t], n) && ((e[t] = n), !0);
      }
      function ei(e, t, n, s, r, i, o, a) {
        const l = Ft(),
          u = Mt(),
          c = e + 19,
          h = u.firstCreatePass
            ? (function (e, t, n, s, r, i, o, a, l) {
                const u = t.consts,
                  c = gs(t, n[6], e, 0, o || null, Lt(u, a));
                Ps(t, n, c, Lt(u, l)), tn(t, c);
                const h = (c.tViews = xs(
                    2,
                    -1,
                    s,
                    r,
                    i,
                    t.directiveRegistry,
                    t.pipeRegistry,
                    null,
                    t.schemas,
                    u
                  )),
                  d = ks(0, null, 2, -1, null, null);
                return (
                  (d.injectorIndex = c.injectorIndex),
                  (h.node = d),
                  null !== t.queries &&
                    (t.queries.template(t, c), (h.queries = t.queries.embeddedTView(c))),
                  c
                );
              })(e, u, l, t, n, s, r, i, o)
            : u.data[c];
        Rt(h, !1);
        const d = l[11].createComment('');
        pr(u, l, d, h),
          Un(d, l),
          $s(l, (l[c] = Hs(d, l, d, h))),
          gt(h) && Ss(u, l, h),
          null != o && Es(l, h, a);
      }
      function ti(e, t = te.Default) {
        const n = Ft();
        return null == n ? He(e, t) : Ln(Ot(), n, ye(e), t);
      }
      function ni(e, t, n) {
        const s = Ft();
        return (
          Yr(s, zt(), t) &&
            (function (e, t, n, s, r, i, o, a) {
              const l = Tt(t, n);
              let u,
                c = t.inputs;
              var h;
              null != c && (u = c[s])
                ? (Ys(e, n, u, s, r),
                  mt(t) &&
                    (function (e, t) {
                      const n = kt(t, e);
                      16 & n[2] || (n[2] |= 64);
                    })(n, t.index))
                : 3 === t.type &&
                  ((s =
                    'class' === (h = s)
                      ? 'className'
                      : 'for' === h
                      ? 'htmlFor'
                      : 'formaction' === h
                      ? 'formAction'
                      : 'innerHtml' === h
                      ? 'innerHTML'
                      : 'readonly' === h
                      ? 'readOnly'
                      : 'tabindex' === h
                      ? 'tabIndex'
                      : h),
                  (r = null != o ? o(r, t.tagName || '', s) : r),
                  bt(i)
                    ? i.setProperty(l, s, r)
                    : cn(s) || (l.setProperty ? l.setProperty(s, r) : (l[s] = r)));
            })(
              Mt(),
              (function () {
                const e = It.lFrame;
                return xt(e.tView, e.selectedIndex);
              })(),
              s,
              e,
              t,
              s[11],
              n
            ),
          ni
        );
      }
      function si(e, t, n, s, r) {
        const i = r ? 'class' : 'style';
        Ys(e, n, t.inputs[i], i, s);
      }
      function ri(e, t, n, s) {
        const r = Ft(),
          i = Mt(),
          o = 19 + e,
          a = r[11],
          l = (r[o] = fs(t, a, It.lFrame.currentNamespace)),
          u = i.firstCreatePass
            ? (function (e, t, n, s, r, i, o) {
                const a = t.consts,
                  l = Lt(a, i),
                  u = gs(t, n[6], e, 3, r, l);
                return (
                  Ps(t, n, u, Lt(a, o)),
                  null !== u.mergedAttrs && Kr(u, u.mergedAttrs),
                  null !== t.queries && t.queries.elementStart(t, u),
                  u
                );
              })(e, i, r, 0, t, n, s)
            : i.data[o];
        Rt(u, !0);
        const c = u.mergedAttrs;
        null !== c && un(a, l, c);
        const h = u.classes;
        null !== h && vr(a, l, h);
        const d = u.styles;
        null !== d && _r(a, l, d),
          pr(i, r, l, u),
          0 === It.lFrame.elementDepthCount && Un(l, r),
          It.lFrame.elementDepthCount++,
          gt(u) && (Ss(i, r, u), ws(i, u, r)),
          null !== s && Es(r, u);
      }
      function ii() {
        let e = Ot();
        Vt() ? jt() : ((e = e.parent), Rt(e, !1));
        const t = e;
        It.lFrame.elementDepthCount--;
        const n = Mt();
        n.firstCreatePass && (tn(n, e), ft(e) && n.queries.elementEnd(e)),
          null !== t.classes &&
            (function (e) {
              return 0 != (16 & e.flags);
            })(t) &&
            si(n, t, Ft(), t.classes, !0),
          null !== t.styles &&
            (function (e) {
              return 0 != (32 & e.flags);
            })(t) &&
            si(n, t, Ft(), t.styles, !1);
      }
      function oi(e, t, n, s) {
        ri(e, t, n, s), ii();
      }
      function ai(e, t, n) {
        const s = Ft(),
          r = Mt(),
          i = e + 19,
          o = r.firstCreatePass
            ? (function (e, t, n, s, r) {
                const i = t.consts,
                  o = Lt(i, s),
                  a = gs(t, n[6], e, 4, 'ng-container', o);
                return (
                  null !== o && Kr(a, o),
                  Ps(t, n, a, Lt(i, r)),
                  null !== t.queries && t.queries.elementStart(t, a),
                  a
                );
              })(e, r, s, t, n)
            : r.data[i];
        Rt(o, !0);
        const a = (s[i] = s[11].createComment(''));
        pr(r, s, a, o), Un(a, s), gt(o) && (Ss(r, s, o), ws(r, o, s)), null != n && Es(s, o);
      }
      function li() {
        let e = Ot();
        const t = Mt();
        Vt() ? jt() : ((e = e.parent), Rt(e, !1)),
          t.firstCreatePass && (tn(t, e), ft(e) && t.queries.elementEnd(e));
      }
      function ui(e) {
        return !!e && 'function' == typeof e.then;
      }
      function ci(e, t, n = !1, s) {
        const r = Ft(),
          i = Mt(),
          o = Ot();
        return (
          (function (e, t, n, s, r, i, o = !1, a) {
            const l = gt(s),
              u = e.firstCreatePass && (e.cleanup || (e.cleanup = [])),
              c = Zs(t);
            let h = !0;
            if (3 === s.type) {
              const d = Tt(s, t),
                p = a ? a(d) : Ye,
                f = p.target || d,
                m = c.length,
                g = a ? e => a(St(e[s.index])).target : s.index;
              if (bt(n)) {
                let o = null;
                if (
                  (!a &&
                    l &&
                    (o = (function (e, t, n, s) {
                      const r = e.cleanup;
                      if (null != r)
                        for (let i = 0; i < r.length - 1; i += 2) {
                          const e = r[i];
                          if (e === n && r[i + 1] === s) {
                            const e = t[7],
                              n = r[i + 2];
                            return e.length > n ? e[n] : null;
                          }
                          'string' == typeof e && (i += 2);
                        }
                      return null;
                    })(e, t, r, s.index)),
                  null !== o)
                )
                  ((o.__ngLastListenerFn__ || o).__ngNextListenerFn__ = i),
                    (o.__ngLastListenerFn__ = i),
                    (h = !1);
                else {
                  i = di(s, t, i, !1);
                  const e = n.listen(p.name || f, r, i);
                  c.push(i, e), u && u.push(r, g, m, m + 1);
                }
              } else
                (i = di(s, t, i, !0)),
                  f.addEventListener(r, i, o),
                  c.push(i),
                  u && u.push(r, g, m, o);
            }
            const d = s.outputs;
            let p;
            if (h && null !== d && (p = d[r])) {
              const e = p.length;
              if (e)
                for (let n = 0; n < e; n += 2) {
                  const e = t[p[n]][p[n + 1]].subscribe(i),
                    o = c.length;
                  c.push(i, e), u && u.push(r, s.index, o, -(o + 1));
                }
            }
          })(i, r, r[11], o, e, t, n, s),
          ci
        );
      }
      function hi(e, t, n) {
        try {
          return !1 !== t(n);
        } catch (s) {
          return Xs(e, s), !1;
        }
      }
      function di(e, t, n, s) {
        return function r(i) {
          if (i === Function) return n;
          const o = 2 & e.flags ? kt(e.index, t) : t;
          0 == (32 & t[2]) && Us(o);
          let a = hi(t, n, i),
            l = r.__ngNextListenerFn__;
          for (; l; ) (a = hi(t, l, i) && a), (l = l.__ngNextListenerFn__);
          return s && !1 === a && (i.preventDefault(), (i.returnValue = !1)), a;
        };
      }
      function pi(e = 1) {
        return (function (e) {
          return (It.lFrame.contextLView = (function (e, t) {
            for (; e > 0; ) (t = t[15]), e--;
            return t;
          })(e, It.lFrame.contextLView))[8];
        })(e);
      }
      const fi = [];
      function mi(e, t, n, s, r) {
        const i = e[n + 1],
          o = null === t;
        let a = s ? ls(i) : cs(i),
          l = !1;
        for (; 0 !== a && (!1 === l || o); ) {
          const n = e[a + 1];
          gi(e[a], t) && ((l = !0), (e[a + 1] = s ? ds(n) : us(n))), (a = s ? ls(n) : cs(n));
        }
        l && (e[n + 1] = s ? us(i) : ds(i));
      }
      function gi(e, t) {
        return (
          null === e ||
          null == t ||
          (Array.isArray(e) ? e[1] : e) === t ||
          (!(!Array.isArray(e) || 'string' != typeof t) && Ze(e, t) >= 0)
        );
      }
      function yi(e, t, n) {
        return (
          (function (e, t, n, s) {
            const r = Ft(),
              i = Mt(),
              o = (function (e) {
                const t = It.lFrame,
                  n = t.bindingIndex;
                return (t.bindingIndex = t.bindingIndex + 2), n;
              })();
            if (
              (i.firstUpdatePass &&
                (function (e, t, n, s) {
                  const r = e.data;
                  if (null === r[n + 1]) {
                    const s = r[Yt() + 19],
                      i = (function (e, t) {
                        return t >= e.expandoStartIndex;
                      })(e, n);
                    (function (e, t) {
                      return 0 != (32 & e.flags);
                    })(s) &&
                      null === t &&
                      !i &&
                      (t = !1),
                      (t = (function (e, t, n, s) {
                        const r = (function (e) {
                          const t = It.lFrame.currentDirectiveIndex;
                          return -1 === t ? null : e[t];
                        })(e);
                        let i = t.residualStyles;
                        if (null === r)
                          0 === t.styleBindings &&
                            ((n = vi((n = _i(null, e, t, n, !1)), t.attrs, !1)), (i = null));
                        else {
                          const s = t.directiveStylingLast;
                          if (-1 === s || e[s] !== r)
                            if (((n = _i(r, e, t, n, !1)), null === i)) {
                              let n = (function (e, t, n) {
                                const s = t.styleBindings;
                                if (0 !== cs(s)) return e[ls(s)];
                              })(e, t);
                              void 0 !== n &&
                                Array.isArray(n) &&
                                ((n = _i(null, e, t, n[1], !1)),
                                (n = vi(n, t.attrs, !1)),
                                (function (e, t, n, s) {
                                  e[ls(t.styleBindings)] = s;
                                })(e, t, 0, n));
                            } else
                              i = (function (e, t, n) {
                                let s = void 0;
                                const r = t.directiveEnd;
                                for (let i = 1 + t.directiveStylingLast; i < r; i++)
                                  s = vi(s, e[i].hostAttrs, !1);
                                return vi(s, t.attrs, !1);
                              })(e, t);
                        }
                        return void 0 !== i && (t.residualStyles = i), n;
                      })(r, s, t)),
                      (function (e, t, n, s, r, i) {
                        let o = t.styleBindings,
                          a = ls(o),
                          l = cs(o);
                        e[s] = n;
                        let u,
                          c = !1;
                        if (Array.isArray(n)) {
                          const e = n;
                          (u = e[1]), (null === u || Ze(e, u) > 0) && (c = !0);
                        } else u = n;
                        if (r)
                          if (0 !== l) {
                            const t = ls(e[a + 1]);
                            (e[s + 1] = as(t, a)),
                              0 !== t && (e[t + 1] = hs(e[t + 1], s)),
                              (e[a + 1] = (131071 & e[a + 1]) | (s << 17));
                          } else
                            (e[s + 1] = as(a, 0)), 0 !== a && (e[a + 1] = hs(e[a + 1], s)), (a = s);
                        else
                          (e[s + 1] = as(l, 0)),
                            0 === a ? (a = s) : (e[l + 1] = hs(e[l + 1], s)),
                            (l = s);
                        c && (e[s + 1] = us(e[s + 1])),
                          mi(e, u, s, !0),
                          mi(e, u, s, !1),
                          (function (e, t, n, s, r) {
                            const i = e.residualStyles;
                            null != i &&
                              'string' == typeof t &&
                              Ze(i, t) >= 0 &&
                              (n[s + 1] = ds(n[s + 1]));
                          })(t, u, e, s),
                          (o = as(a, l)),
                          (t.styleBindings = o);
                      })(r, s, t, n, i);
                  }
                })(i, e, o),
              t !== ss && Yr(r, o, t))
            ) {
              let s;
              null == n &&
                (s = (function () {
                  const e = It.lFrame;
                  return null === e ? null : e.currentSanitizer;
                })()) &&
                (n = s),
                (function (e, t, n, s, r, i, o, a) {
                  if (3 !== t.type) return;
                  const l = e.data,
                    u = l[a + 1];
                  wi(1 == (1 & u) ? bi(l, t, n, r, cs(u), !1) : void 0) ||
                    (wi(i) ||
                      ((function (e) {
                        return 2 == (2 & e);
                      })(u) &&
                        (i = bi(l, null, n, r, a, !1))),
                    (function (e, t, n, s, r) {
                      const i = bt(e);
                      {
                        const t = -1 == s.indexOf('-') ? void 0 : 2;
                        null == r
                          ? i
                            ? e.removeStyle(n, s, t)
                            : n.style.removeProperty(s)
                          : i
                          ? e.setStyle(n, s, r, t)
                          : n.style.setProperty(s, r);
                      }
                    })(s, 0, Et(Yt(), n), r, i));
                })(
                  i,
                  i.data[Yt() + 19],
                  r,
                  r[11],
                  e,
                  (r[o + 1] = (function (e, t) {
                    return (
                      null == e ||
                        ('function' == typeof t
                          ? (e = t(e))
                          : 'string' == typeof t
                          ? (e += t)
                          : 'object' == typeof e &&
                            (e = pe(
                              (function (e) {
                                return e instanceof
                                  class {
                                    constructor(e) {
                                      this.changingThisBreaksApplicationSecurity = e;
                                    }
                                    toString() {
                                      return (
                                        `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity}` +
                                        ' (see http://g.co/ng/security#xss)'
                                      );
                                    }
                                  }
                                  ? e.changingThisBreaksApplicationSecurity
                                  : e;
                              })(e)
                            ))),
                      e
                    );
                  })(t, n)),
                  0,
                  o
                );
            }
          })(e, t, n),
          yi
        );
      }
      function _i(e, t, n, s, r) {
        let i = null;
        const o = n.directiveEnd;
        let a = n.directiveStylingLast;
        for (
          -1 === a ? (a = n.directiveStart) : a++;
          a < o && ((i = t[a]), (s = vi(s, i.hostAttrs, r)), i !== e);

        )
          a++;
        return null !== e && (n.directiveStylingLast = a), s;
      }
      function vi(e, t, n) {
        const s = n ? 1 : 2;
        let r = -1;
        if (null !== t)
          for (let i = 0; i < t.length; i++) {
            const o = t[i];
            'number' == typeof o
              ? (r = o)
              : r === s &&
                (Array.isArray(e) || (e = void 0 === e ? [] : ['', e]), We(e, o, !!n || t[++i]));
          }
        return void 0 === e ? null : e;
      }
      function bi(e, t, n, s, r, i) {
        const o = null === t;
        let a = void 0;
        for (; r > 0; ) {
          const t = e[r],
            i = Array.isArray(t),
            l = i ? t[1] : t,
            u = null === l;
          let c = n[r + 1];
          c === ss && (c = u ? fi : void 0);
          let h = u ? Qe(c, s) : l === s ? c : void 0;
          if ((i && !wi(h) && (h = Qe(t, s)), wi(h) && ((a = h), o))) return a;
          const d = e[r + 1];
          r = o ? ls(d) : cs(d);
        }
        if (null !== t) {
          let e = i ? t.residualClasses : t.residualStyles;
          null != e && (a = Qe(e, s));
        }
        return a;
      }
      function wi(e) {
        return void 0 !== e;
      }
      function Si(e, t = '') {
        const n = Ft(),
          s = Mt(),
          r = e + 19,
          i = s.firstCreatePass ? gs(s, n[6], e, 3, null, null) : s.data[r],
          o = (n[r] = (function (e, t) {
            return bt(t) ? t.createText(e) : t.createTextNode(e);
          })(t, n[11]));
        pr(s, n, o, i), Rt(i, !1);
      }
      function Ei(e) {
        return Ti('', e, ''), Ei;
      }
      function Ti(e, t, n) {
        const s = Ft(),
          r = (function (e, t, n, s) {
            return Yr(e, zt(), n) ? t + yn(n) + s : ss;
          })(s, e, t, n);
        return (
          r !== ss &&
            (function (e, t, n) {
              const s = Et(t, e),
                r = e[11];
              bt(r) ? r.setValue(s, n) : (s.textContent = n);
            })(s, Yt(), r),
          Ti
        );
      }
      function xi(e, t) {
        const n = Ct(e)[1],
          s = n.data.length - 1;
        tn(n, { directiveStart: s, directiveEnd: s + 1 });
      }
      class ki {
        constructor(e, t, n) {
          (this.previousValue = e), (this.currentValue = t), (this.firstChange = n);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function Ci(e) {
        e.type.prototype.ngOnChanges &&
          ((e.setInput = Pi),
          (e.onChanges = function () {
            const e = Ai(this),
              t = e && e.current;
            if (t) {
              const n = e.previous;
              if (n === Ye) e.previous = t;
              else for (let e in t) n[e] = t[e];
              (e.current = null), this.ngOnChanges(t);
            }
          }));
      }
      function Pi(e, t, n, s) {
        const r =
            Ai(e) ||
            (function (e, t) {
              return (e.__ngSimpleChanges__ = t);
            })(e, { previous: Ye, current: null }),
          i = r.current || (r.current = {}),
          o = r.previous,
          a = this.declaredInputs[n],
          l = o[a];
        (i[a] = new ki(l && l.currentValue, t, o === Ye)), (e[s] = t);
      }
      function Ai(e) {
        return e.__ngSimpleChanges__ || null;
      }
      Ci.ngInherit = !0;
      class Li {}
      class Ni {
        resolveComponentFactory(e) {
          throw (function (e) {
            const t = Error(
              `No component factory found for ${pe(
                e
              )}. Did you add it to @NgModule.entryComponents?`
            );
            return (t.ngComponent = e), t;
          })(e);
        }
      }
      let Ii = (() => {
          class e {}
          return (e.NULL = new Ni()), e;
        })(),
        Di = (() => {
          class e {
            constructor(e) {
              this.nativeElement = e;
            }
          }
          return (e.__NG_ELEMENT_ID__ = () => Fi(e)), e;
        })();
      const Fi = function (e) {
        return xr(e, Ot(), Ft());
      };
      class Mi {}
      const Oi = (function () {
        var e = { Important: 1, DashCase: 2 };
        return (e[e.Important] = 'Important'), (e[e.DashCase] = 'DashCase'), e;
      })();
      let Ri = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = () => Vi()), e;
      })();
      const Vi = function () {
        const e = Ft(),
          t = kt(Ot().index, e);
        return (function (e) {
          const t = e[11];
          if (bt(t)) return t;
          throw new Error('Cannot inject Renderer2 when the application uses Renderer3!');
        })(dt(t) ? t : e);
      };
      let ji = (() => {
        class e {}
        return (e.ɵprov = se({ token: e, providedIn: 'root', factory: () => null })), e;
      })();
      class Hi {
        constructor(e) {
          (this.full = e),
            (this.major = e.split('.')[0]),
            (this.minor = e.split('.')[1]),
            (this.patch = e.split('.').slice(2).join('.'));
        }
      }
      const Bi = new Hi('9.0.7');
      class zi {
        constructor() {}
        supports(e) {
          return Jr(e);
        }
        create(e) {
          return new $i(e);
        }
      }
      const qi = (e, t) => t;
      class $i {
        constructor(e) {
          (this.length = 0),
            (this._linkedRecords = null),
            (this._unlinkedRecords = null),
            (this._previousItHead = null),
            (this._itHead = null),
            (this._itTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._movesHead = null),
            (this._movesTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null),
            (this._identityChangesHead = null),
            (this._identityChangesTail = null),
            (this._trackByFn = e || qi);
        }
        forEachItem(e) {
          let t;
          for (t = this._itHead; null !== t; t = t._next) e(t);
        }
        forEachOperation(e) {
          let t = this._itHead,
            n = this._removalsHead,
            s = 0,
            r = null;
          for (; t || n; ) {
            const i = !n || (t && t.currentIndex < Wi(n, s, r)) ? t : n,
              o = Wi(i, s, r),
              a = i.currentIndex;
            if (i === n) s--, (n = n._nextRemoved);
            else if (((t = t._next), null == i.previousIndex)) s++;
            else {
              r || (r = []);
              const e = o - s,
                t = a - s;
              if (e != t) {
                for (let n = 0; n < e; n++) {
                  const s = n < r.length ? r[n] : (r[n] = 0),
                    i = s + n;
                  t <= i && i < e && (r[n] = s + 1);
                }
                r[i.previousIndex] = t - e;
              }
            }
            o !== a && e(i, o, a);
          }
        }
        forEachPreviousItem(e) {
          let t;
          for (t = this._previousItHead; null !== t; t = t._nextPrevious) e(t);
        }
        forEachAddedItem(e) {
          let t;
          for (t = this._additionsHead; null !== t; t = t._nextAdded) e(t);
        }
        forEachMovedItem(e) {
          let t;
          for (t = this._movesHead; null !== t; t = t._nextMoved) e(t);
        }
        forEachRemovedItem(e) {
          let t;
          for (t = this._removalsHead; null !== t; t = t._nextRemoved) e(t);
        }
        forEachIdentityChange(e) {
          let t;
          for (t = this._identityChangesHead; null !== t; t = t._nextIdentityChange) e(t);
        }
        diff(e) {
          if ((null == e && (e = []), !Jr(e)))
            throw new Error(
              `Error trying to diff '${pe(e)}'. Only arrays and iterables are allowed`
            );
          return this.check(e) ? this : null;
        }
        onDestroy() {}
        check(e) {
          this._reset();
          let t,
            n,
            s,
            r = this._itHead,
            i = !1;
          if (Array.isArray(e)) {
            this.length = e.length;
            for (let t = 0; t < this.length; t++)
              (n = e[t]),
                (s = this._trackByFn(t, n)),
                null !== r && Zr(r.trackById, s)
                  ? (i && (r = this._verifyReinsertion(r, n, s, t)),
                    Zr(r.item, n) || this._addIdentityChange(r, n))
                  : ((r = this._mismatch(r, n, s, t)), (i = !0)),
                (r = r._next);
          } else
            (t = 0),
              (function (e, t) {
                if (Array.isArray(e)) for (let n = 0; n < e.length; n++) t(e[n]);
                else {
                  const n = e[Qr()]();
                  let s;
                  for (; !(s = n.next()).done; ) t(s.value);
                }
              })(e, e => {
                (s = this._trackByFn(t, e)),
                  null !== r && Zr(r.trackById, s)
                    ? (i && (r = this._verifyReinsertion(r, e, s, t)),
                      Zr(r.item, e) || this._addIdentityChange(r, e))
                    : ((r = this._mismatch(r, e, s, t)), (i = !0)),
                  (r = r._next),
                  t++;
              }),
              (this.length = t);
          return this._truncate(r), (this.collection = e), this.isDirty;
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._movesHead ||
            null !== this._removalsHead ||
            null !== this._identityChangesHead
          );
        }
        _reset() {
          if (this.isDirty) {
            let e, t;
            for (e = this._previousItHead = this._itHead; null !== e; e = e._next)
              e._nextPrevious = e._next;
            for (e = this._additionsHead; null !== e; e = e._nextAdded)
              e.previousIndex = e.currentIndex;
            for (
              this._additionsHead = this._additionsTail = null, e = this._movesHead;
              null !== e;
              e = t
            )
              (e.previousIndex = e.currentIndex), (t = e._nextMoved);
            (this._movesHead = this._movesTail = null),
              (this._removalsHead = this._removalsTail = null),
              (this._identityChangesHead = this._identityChangesTail = null);
          }
        }
        _mismatch(e, t, n, s) {
          let r;
          return (
            null === e ? (r = this._itTail) : ((r = e._prev), this._remove(e)),
            null !== (e = null === this._linkedRecords ? null : this._linkedRecords.get(n, s))
              ? (Zr(e.item, t) || this._addIdentityChange(e, t), this._moveAfter(e, r, s))
              : null !==
                (e = null === this._unlinkedRecords ? null : this._unlinkedRecords.get(n, null))
              ? (Zr(e.item, t) || this._addIdentityChange(e, t), this._reinsertAfter(e, r, s))
              : (e = this._addAfter(new Ui(t, n), r, s)),
            e
          );
        }
        _verifyReinsertion(e, t, n, s) {
          let r = null === this._unlinkedRecords ? null : this._unlinkedRecords.get(n, null);
          return (
            null !== r
              ? (e = this._reinsertAfter(r, e._prev, s))
              : e.currentIndex != s && ((e.currentIndex = s), this._addToMoves(e, s)),
            e
          );
        }
        _truncate(e) {
          for (; null !== e; ) {
            const t = e._next;
            this._addToRemovals(this._unlink(e)), (e = t);
          }
          null !== this._unlinkedRecords && this._unlinkedRecords.clear(),
            null !== this._additionsTail && (this._additionsTail._nextAdded = null),
            null !== this._movesTail && (this._movesTail._nextMoved = null),
            null !== this._itTail && (this._itTail._next = null),
            null !== this._removalsTail && (this._removalsTail._nextRemoved = null),
            null !== this._identityChangesTail &&
              (this._identityChangesTail._nextIdentityChange = null);
        }
        _reinsertAfter(e, t, n) {
          null !== this._unlinkedRecords && this._unlinkedRecords.remove(e);
          const s = e._prevRemoved,
            r = e._nextRemoved;
          return (
            null === s ? (this._removalsHead = r) : (s._nextRemoved = r),
            null === r ? (this._removalsTail = s) : (r._prevRemoved = s),
            this._insertAfter(e, t, n),
            this._addToMoves(e, n),
            e
          );
        }
        _moveAfter(e, t, n) {
          return this._unlink(e), this._insertAfter(e, t, n), this._addToMoves(e, n), e;
        }
        _addAfter(e, t, n) {
          return (
            this._insertAfter(e, t, n),
            (this._additionsTail =
              null === this._additionsTail
                ? (this._additionsHead = e)
                : (this._additionsTail._nextAdded = e)),
            e
          );
        }
        _insertAfter(e, t, n) {
          const s = null === t ? this._itHead : t._next;
          return (
            (e._next = s),
            (e._prev = t),
            null === s ? (this._itTail = e) : (s._prev = e),
            null === t ? (this._itHead = e) : (t._next = e),
            null === this._linkedRecords && (this._linkedRecords = new Ki()),
            this._linkedRecords.put(e),
            (e.currentIndex = n),
            e
          );
        }
        _remove(e) {
          return this._addToRemovals(this._unlink(e));
        }
        _unlink(e) {
          null !== this._linkedRecords && this._linkedRecords.remove(e);
          const t = e._prev,
            n = e._next;
          return (
            null === t ? (this._itHead = n) : (t._next = n),
            null === n ? (this._itTail = t) : (n._prev = t),
            e
          );
        }
        _addToMoves(e, t) {
          return e.previousIndex === t
            ? e
            : ((this._movesTail =
                null === this._movesTail
                  ? (this._movesHead = e)
                  : (this._movesTail._nextMoved = e)),
              e);
        }
        _addToRemovals(e) {
          return (
            null === this._unlinkedRecords && (this._unlinkedRecords = new Ki()),
            this._unlinkedRecords.put(e),
            (e.currentIndex = null),
            (e._nextRemoved = null),
            null === this._removalsTail
              ? ((this._removalsTail = this._removalsHead = e), (e._prevRemoved = null))
              : ((e._prevRemoved = this._removalsTail),
                (this._removalsTail = this._removalsTail._nextRemoved = e)),
            e
          );
        }
        _addIdentityChange(e, t) {
          return (
            (e.item = t),
            (this._identityChangesTail =
              null === this._identityChangesTail
                ? (this._identityChangesHead = e)
                : (this._identityChangesTail._nextIdentityChange = e)),
            e
          );
        }
      }
      class Ui {
        constructor(e, t) {
          (this.item = e),
            (this.trackById = t),
            (this.currentIndex = null),
            (this.previousIndex = null),
            (this._nextPrevious = null),
            (this._prev = null),
            (this._next = null),
            (this._prevDup = null),
            (this._nextDup = null),
            (this._prevRemoved = null),
            (this._nextRemoved = null),
            (this._nextAdded = null),
            (this._nextMoved = null),
            (this._nextIdentityChange = null);
        }
      }
      class Gi {
        constructor() {
          (this._head = null), (this._tail = null);
        }
        add(e) {
          null === this._head
            ? ((this._head = this._tail = e), (e._nextDup = null), (e._prevDup = null))
            : ((this._tail._nextDup = e),
              (e._prevDup = this._tail),
              (e._nextDup = null),
              (this._tail = e));
        }
        get(e, t) {
          let n;
          for (n = this._head; null !== n; n = n._nextDup)
            if ((null === t || t <= n.currentIndex) && Zr(n.trackById, e)) return n;
          return null;
        }
        remove(e) {
          const t = e._prevDup,
            n = e._nextDup;
          return (
            null === t ? (this._head = n) : (t._nextDup = n),
            null === n ? (this._tail = t) : (n._prevDup = t),
            null === this._head
          );
        }
      }
      class Ki {
        constructor() {
          this.map = new Map();
        }
        put(e) {
          const t = e.trackById;
          let n = this.map.get(t);
          n || ((n = new Gi()), this.map.set(t, n)), n.add(e);
        }
        get(e, t) {
          const n = this.map.get(e);
          return n ? n.get(e, t) : null;
        }
        remove(e) {
          const t = e.trackById;
          return this.map.get(t).remove(e) && this.map.delete(t), e;
        }
        get isEmpty() {
          return 0 === this.map.size;
        }
        clear() {
          this.map.clear();
        }
      }
      function Wi(e, t, n) {
        const s = e.previousIndex;
        if (null === s) return s;
        let r = 0;
        return n && s < n.length && (r = n[s]), s + t + r;
      }
      class Qi {
        constructor() {}
        supports(e) {
          return e instanceof Map || Xr(e);
        }
        create() {
          return new Zi();
        }
      }
      class Zi {
        constructor() {
          (this._records = new Map()),
            (this._mapHead = null),
            (this._appendAfter = null),
            (this._previousMapHead = null),
            (this._changesHead = null),
            (this._changesTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null);
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._changesHead ||
            null !== this._removalsHead
          );
        }
        forEachItem(e) {
          let t;
          for (t = this._mapHead; null !== t; t = t._next) e(t);
        }
        forEachPreviousItem(e) {
          let t;
          for (t = this._previousMapHead; null !== t; t = t._nextPrevious) e(t);
        }
        forEachChangedItem(e) {
          let t;
          for (t = this._changesHead; null !== t; t = t._nextChanged) e(t);
        }
        forEachAddedItem(e) {
          let t;
          for (t = this._additionsHead; null !== t; t = t._nextAdded) e(t);
        }
        forEachRemovedItem(e) {
          let t;
          for (t = this._removalsHead; null !== t; t = t._nextRemoved) e(t);
        }
        diff(e) {
          if (e) {
            if (!(e instanceof Map || Xr(e)))
              throw new Error(`Error trying to diff '${pe(e)}'. Only maps and objects are allowed`);
          } else e = new Map();
          return this.check(e) ? this : null;
        }
        onDestroy() {}
        check(e) {
          this._reset();
          let t = this._mapHead;
          if (
            ((this._appendAfter = null),
            this._forEach(e, (e, n) => {
              if (t && t.key === n)
                this._maybeAddToChanges(t, e), (this._appendAfter = t), (t = t._next);
              else {
                const s = this._getOrCreateRecordForKey(n, e);
                t = this._insertBeforeOrAppend(t, s);
              }
            }),
            t)
          ) {
            t._prev && (t._prev._next = null), (this._removalsHead = t);
            for (let e = t; null !== e; e = e._nextRemoved)
              e === this._mapHead && (this._mapHead = null),
                this._records.delete(e.key),
                (e._nextRemoved = e._next),
                (e.previousValue = e.currentValue),
                (e.currentValue = null),
                (e._prev = null),
                (e._next = null);
          }
          return (
            this._changesTail && (this._changesTail._nextChanged = null),
            this._additionsTail && (this._additionsTail._nextAdded = null),
            this.isDirty
          );
        }
        _insertBeforeOrAppend(e, t) {
          if (e) {
            const n = e._prev;
            return (
              (t._next = e),
              (t._prev = n),
              (e._prev = t),
              n && (n._next = t),
              e === this._mapHead && (this._mapHead = t),
              (this._appendAfter = e),
              e
            );
          }
          return (
            this._appendAfter
              ? ((this._appendAfter._next = t), (t._prev = this._appendAfter))
              : (this._mapHead = t),
            (this._appendAfter = t),
            null
          );
        }
        _getOrCreateRecordForKey(e, t) {
          if (this._records.has(e)) {
            const n = this._records.get(e);
            this._maybeAddToChanges(n, t);
            const s = n._prev,
              r = n._next;
            return s && (s._next = r), r && (r._prev = s), (n._next = null), (n._prev = null), n;
          }
          const n = new Ji(e);
          return this._records.set(e, n), (n.currentValue = t), this._addToAdditions(n), n;
        }
        _reset() {
          if (this.isDirty) {
            let e;
            for (
              this._previousMapHead = this._mapHead, e = this._previousMapHead;
              null !== e;
              e = e._next
            )
              e._nextPrevious = e._next;
            for (e = this._changesHead; null !== e; e = e._nextChanged)
              e.previousValue = e.currentValue;
            for (e = this._additionsHead; null != e; e = e._nextAdded)
              e.previousValue = e.currentValue;
            (this._changesHead = this._changesTail = null),
              (this._additionsHead = this._additionsTail = null),
              (this._removalsHead = null);
          }
        }
        _maybeAddToChanges(e, t) {
          Zr(t, e.currentValue) ||
            ((e.previousValue = e.currentValue), (e.currentValue = t), this._addToChanges(e));
        }
        _addToAdditions(e) {
          null === this._additionsHead
            ? (this._additionsHead = this._additionsTail = e)
            : ((this._additionsTail._nextAdded = e), (this._additionsTail = e));
        }
        _addToChanges(e) {
          null === this._changesHead
            ? (this._changesHead = this._changesTail = e)
            : ((this._changesTail._nextChanged = e), (this._changesTail = e));
        }
        _forEach(e, t) {
          e instanceof Map ? e.forEach(t) : Object.keys(e).forEach(n => t(e[n], n));
        }
      }
      class Ji {
        constructor(e) {
          (this.key = e),
            (this.previousValue = null),
            (this.currentValue = null),
            (this._nextPrevious = null),
            (this._next = null),
            (this._prev = null),
            (this._nextAdded = null),
            (this._nextRemoved = null),
            (this._nextChanged = null);
        }
      }
      let Xi = (() => {
          class e {
            constructor(e) {
              this.factories = e;
            }
            static create(t, n) {
              if (null != n) {
                const e = n.factories.slice();
                t = t.concat(e);
              }
              return new e(t);
            }
            static extend(t) {
              return {
                provide: e,
                useFactory: n => {
                  if (!n)
                    throw new Error('Cannot extend IterableDiffers without a parent injector');
                  return e.create(t, n);
                },
                deps: [[e, new ee(), new X()]],
              };
            }
            find(e) {
              const t = this.factories.find(t => t.supports(e));
              if (null != t) return t;
              throw new Error(
                `Cannot find a differ supporting object '${e}' of type '${
                  ((n = e), n.name || typeof n)
                }'`
              );
              var n;
            }
          }
          return (
            (e.ɵprov = se({ token: e, providedIn: 'root', factory: () => new e([new zi()]) })), e
          );
        })(),
        Yi = (() => {
          class e {
            constructor(e) {
              this.factories = e;
            }
            static create(t, n) {
              if (n) {
                const e = n.factories.slice();
                t = t.concat(e);
              }
              return new e(t);
            }
            static extend(t) {
              return {
                provide: e,
                useFactory: n => {
                  if (!n)
                    throw new Error('Cannot extend KeyValueDiffers without a parent injector');
                  return e.create(t, n);
                },
                deps: [[e, new ee(), new X()]],
              };
            }
            find(e) {
              const t = this.factories.find(t => t.supports(e));
              if (t) return t;
              throw new Error(`Cannot find a differ supporting object '${e}'`);
            }
          }
          return (
            (e.ɵprov = se({ token: e, providedIn: 'root', factory: () => new e([new Qi()]) })), e
          );
        })();
      const eo = [new Qi()],
        to = new Xi([new zi()]),
        no = new Yi(eo);
      let so = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = () => ro(e, Di)), e;
      })();
      const ro = function (e, t) {
        return kr(e, t, Ot(), Ft());
      };
      let io = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = () => oo(e, Di)), e;
      })();
      const oo = function (e, t) {
          return Cr(e, t, Ot(), Ft());
        },
        ao = {};
      class lo extends Ii {
        constructor(e) {
          super(), (this.ngModule = e);
        }
        resolveComponentFactory(e) {
          const t = ut(e);
          return new ho(t, this.ngModule);
        }
      }
      function uo(e) {
        const t = [];
        for (let n in e) e.hasOwnProperty(n) && t.push({ propName: e[n], templateName: n });
        return t;
      }
      const co = new Le('SCHEDULER_TOKEN', { providedIn: 'root', factory: () => vn });
      class ho extends Li {
        constructor(e, t) {
          super(),
            (this.componentDef = e),
            (this.ngModule = t),
            (this.componentType = e.type),
            (this.selector = e.selectors.map(ns).join(',')),
            (this.ngContentSelectors = e.ngContentSelectors ? e.ngContentSelectors : []),
            (this.isBoundToModule = !!t);
        }
        get inputs() {
          return uo(this.componentDef.inputs);
        }
        get outputs() {
          return uo(this.componentDef.outputs);
        }
        create(e, t, n, s) {
          const r = (s = s || this.ngModule)
              ? (function (e, t) {
                  return {
                    get: (n, s, r) => {
                      const i = e.get(n, ao, r);
                      return i !== ao || s === ao ? i : t.get(n, s, r);
                    },
                  };
                })(e, s.injector)
              : e,
            i = r.get(Mi, wt),
            o = r.get(ji, null),
            a = i.createRenderer(null, this.componentDef),
            l = this.componentDef.selectors[0][0] || 'div',
            u = n
              ? (function (e, t, n) {
                  if (bt(e)) return e.selectRootElement(t, n === Xe.ShadowDom);
                  let s = 'string' == typeof t ? e.querySelector(t) : t;
                  return (s.textContent = ''), s;
                })(a, n, this.componentDef.encapsulation)
              : fs(
                  l,
                  i.createRenderer(null, this.componentDef),
                  (function (e) {
                    const t = e.toLowerCase();
                    return 'svg' === t
                      ? 'http://www.w3.org/2000/svg'
                      : 'math' === t
                      ? 'http://www.w3.org/1998/MathML/'
                      : null;
                  })(l)
                ),
            c = this.componentDef.onPush ? 576 : 528,
            h = 'string' == typeof n && /^#root-ng-internal-isolated-\d+/.test(n),
            d = { components: [], scheduler: vn, clean: Qs, playerHandler: null, flags: 0 },
            p = xs(0, -1, null, 1, 0, null, null, null, null, null),
            f = ms(null, p, d, c, null, null, i, a, o, r);
          let m, g;
          Kt(f, null);
          try {
            const e = (function (e, t, n, s, r, i) {
              const o = n[1];
              n[19] = e;
              const a = gs(o, null, 0, 3, null, null),
                l = (a.mergedAttrs = t.hostAttrs);
              null !== l &&
                (Kr(a, l),
                null !== e &&
                  (un(r, e, l),
                  null !== a.classes && vr(r, e, a.classes),
                  null !== a.styles && _r(r, e, a.styles)));
              const u = s.createRenderer(e, t),
                c = ms(n, Ts(t), null, t.onPush ? 64 : 16, n[19], a, s, u, void 0);
              return (
                o.firstCreatePass && (An(xn(a, n), o, t.type), Ds(o, a), Ms(a, n.length, 1)),
                $s(n, c),
                (n[19] = c)
              );
            })(u, this.componentDef, f, i, a);
            if (u)
              if (n) un(a, u, ['ng-version', Bi.full]);
              else {
                const { attrs: e, classes: t } = (function (e) {
                  const t = [],
                    n = [];
                  let s = 1,
                    r = 2;
                  for (; s < e.length; ) {
                    let i = e[s];
                    if ('string' == typeof i)
                      2 === r ? '' !== i && t.push(i, e[++s]) : 8 === r && n.push(i);
                    else {
                      if (!Xn(r)) break;
                      r = i;
                    }
                    s++;
                  }
                  return { attrs: t, classes: n };
                })(this.componentDef.selectors[0]);
                e && un(a, u, e), t && t.length > 0 && vr(a, u, t.join(' '));
              }
            (g = xt(f[1], 0)),
              t && (g.projection = t.map(e => Array.from(e))),
              (m = (function (e, t, n, s, r) {
                const i = n[1],
                  o = (function (e, t, n) {
                    const s = Ot();
                    e.firstCreatePass &&
                      (n.providersResolver && n.providersResolver(n), Is(e, s, 1), Os(e, t, n));
                    const r = Fn(t, e, t.length - 1, s);
                    Un(r, t);
                    const i = Tt(s, t);
                    return i && Un(i, t), r;
                  })(i, n, t);
                s.components.push(o),
                  (e[8] = o),
                  r && r.forEach(e => e(o, t)),
                  t.contentQueries && t.contentQueries(1, o, n.length - 1);
                const a = Ot();
                if (i.firstCreatePass && (null !== t.hostBindings || null !== t.hostAttrs)) {
                  en(a.index - 19);
                  const e = n[1];
                  As(e, t), Ls(e, n, t.hostVars), Ns(t, o);
                }
                return o;
              })(e, this.componentDef, f, d, [xi])),
              ys(p, f, null);
          } finally {
            Xt();
          }
          const y = new po(this.componentType, m, xr(Di, g, f), f, g);
          return (n && !h) || (y.hostView._tViewNode.child = g), y;
        }
      }
      class po extends class {} {
        constructor(e, t, n, s, r) {
          super(),
            (this.location = n),
            (this._rootLView = s),
            (this._tNode = r),
            (this.destroyCbs = []),
            (this.instance = t),
            (this.hostView = this.changeDetectorRef = new wr(s)),
            (this.hostView._tViewNode = (function (e, t, n, s) {
              let r = e.node;
              return null == r && (e.node = r = ks(0, null, 2, -1, null, null)), (s[6] = r);
            })(s[1], 0, 0, s)),
            (this.componentType = e);
        }
        get injector() {
          return new Rn(this._tNode, this._rootLView);
        }
        destroy() {
          this.destroyCbs &&
            (this.destroyCbs.forEach(e => e()),
            (this.destroyCbs = null),
            !this.hostView.destroyed && this.hostView.destroy());
        }
        onDestroy(e) {
          this.destroyCbs && this.destroyCbs.push(e);
        }
      }
      const fo = void 0;
      var mo = [
        'en',
        [['a', 'p'], ['AM', 'PM'], fo],
        [['AM', 'PM'], fo, fo],
        [
          ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
          ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        ],
        fo,
        [
          ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
          ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ],
        ],
        fo,
        [
          ['B', 'A'],
          ['BC', 'AD'],
          ['Before Christ', 'Anno Domini'],
        ],
        0,
        [6, 0],
        ['M/d/yy', 'MMM d, y', 'MMMM d, y', 'EEEE, MMMM d, y'],
        ['h:mm a', 'h:mm:ss a', 'h:mm:ss a z', 'h:mm:ss a zzzz'],
        ['{1}, {0}', fo, "{1} 'at' {0}", fo],
        ['.', ',', ';', '%', '+', '-', 'E', '\xd7', '\u2030', '\u221e', 'NaN', ':'],
        ['#,##0.###', '#,##0%', '\xa4#,##0.00', '#E0'],
        'USD',
        '$',
        'US Dollar',
        {},
        function (e) {
          let t = Math.floor(Math.abs(e)),
            n = e.toString().replace(/^[^.]*\.?/, '').length;
          return 1 === t && 0 === n ? 1 : 5;
        },
      ];
      let go = {};
      function yo(e) {
        return (
          e in go ||
            (go[e] = Se.ng && Se.ng.common && Se.ng.common.locales && Se.ng.common.locales[e]),
          go[e]
        );
      }
      const _o = (function () {
        var e = {
          LocaleId: 0,
          DayPeriodsFormat: 1,
          DayPeriodsStandalone: 2,
          DaysFormat: 3,
          DaysStandalone: 4,
          MonthsFormat: 5,
          MonthsStandalone: 6,
          Eras: 7,
          FirstDayOfWeek: 8,
          WeekendRange: 9,
          DateFormat: 10,
          TimeFormat: 11,
          DateTimeFormat: 12,
          NumberSymbols: 13,
          NumberFormats: 14,
          CurrencyCode: 15,
          CurrencySymbol: 16,
          CurrencyName: 17,
          Currencies: 18,
          PluralCase: 19,
          ExtraData: 20,
        };
        return (
          (e[e.LocaleId] = 'LocaleId'),
          (e[e.DayPeriodsFormat] = 'DayPeriodsFormat'),
          (e[e.DayPeriodsStandalone] = 'DayPeriodsStandalone'),
          (e[e.DaysFormat] = 'DaysFormat'),
          (e[e.DaysStandalone] = 'DaysStandalone'),
          (e[e.MonthsFormat] = 'MonthsFormat'),
          (e[e.MonthsStandalone] = 'MonthsStandalone'),
          (e[e.Eras] = 'Eras'),
          (e[e.FirstDayOfWeek] = 'FirstDayOfWeek'),
          (e[e.WeekendRange] = 'WeekendRange'),
          (e[e.DateFormat] = 'DateFormat'),
          (e[e.TimeFormat] = 'TimeFormat'),
          (e[e.DateTimeFormat] = 'DateTimeFormat'),
          (e[e.NumberSymbols] = 'NumberSymbols'),
          (e[e.NumberFormats] = 'NumberFormats'),
          (e[e.CurrencyCode] = 'CurrencyCode'),
          (e[e.CurrencySymbol] = 'CurrencySymbol'),
          (e[e.CurrencyName] = 'CurrencyName'),
          (e[e.Currencies] = 'Currencies'),
          (e[e.PluralCase] = 'PluralCase'),
          (e[e.ExtraData] = 'ExtraData'),
          e
        );
      })();
      let vo = 'en-US';
      function bo(e) {
        var t, n;
        (n = 'Expected localeId to be defined'),
          null == (t = e) &&
            (function (e, t, n, s) {
              throw new Error(`ASSERTION ERROR: ${e}` + ` [Expected=> null != ${t} <=Actual]`);
            })(n, t),
          'string' == typeof e && (vo = e.toLowerCase().replace(/_/g, '-'));
      }
      const wo = new Map();
      class So extends $e {
        constructor(e, t) {
          super(),
            (this._parent = t),
            (this._bootstrapComponents = []),
            (this.injector = this),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new lo(this));
          const n = ht(e),
            s = e[Ce] || null;
          s && bo(s),
            (this._bootstrapComponents = wn(n.bootstrap)),
            (this._r3Injector = Or(
              e,
              t,
              [
                { provide: $e, useValue: this },
                { provide: Ii, useValue: this.componentFactoryResolver },
              ],
              pe(e)
            )),
            this._r3Injector._resolveInjectorDefTypes(),
            (this.instance = this.get(e));
        }
        get(e, t = qr.THROW_IF_NOT_FOUND, n = te.Default) {
          return e === qr || e === $e || e === Ne ? this : this._r3Injector.get(e, t, n);
        }
        destroy() {
          const e = this._r3Injector;
          !e.destroyed && e.destroy(), this.destroyCbs.forEach(e => e()), (this.destroyCbs = null);
        }
        onDestroy(e) {
          this.destroyCbs.push(e);
        }
      }
      class Eo extends class {} {
        constructor(e) {
          super(),
            (this.moduleType = e),
            null !== ht(e) &&
              (function e(t) {
                if (null !== t.ɵmod.id) {
                  const e = t.ɵmod.id;
                  (function (e, t, n) {
                    if (t && t !== n)
                      throw new Error(
                        `Duplicate module registered for ${e} - ${pe(t)} vs ${pe(t.name)}`
                      );
                  })(e, wo.get(e), t),
                    wo.set(e, t);
                }
                let n = t.ɵmod.imports;
                n instanceof Function && (n = n()), n && n.forEach(t => e(t));
              })(e);
        }
        create(e) {
          return new So(this.moduleType, e);
        }
      }
      class To extends E {
        constructor(e = !1) {
          super(), (this.__isAsync = e);
        }
        emit(e) {
          super.next(e);
        }
        subscribe(e, t, n) {
          let s,
            r = e => null,
            i = () => null;
          e && 'object' == typeof e
            ? ((s = this.__isAsync
                ? t => {
                    setTimeout(() => e.next(t));
                  }
                : t => {
                    e.next(t);
                  }),
              e.error &&
                (r = this.__isAsync
                  ? t => {
                      setTimeout(() => e.error(t));
                    }
                  : t => {
                      e.error(t);
                    }),
              e.complete &&
                (i = this.__isAsync
                  ? () => {
                      setTimeout(() => e.complete());
                    }
                  : () => {
                      e.complete();
                    }))
            : ((s = this.__isAsync
                ? t => {
                    setTimeout(() => e(t));
                  }
                : t => {
                    e(t);
                  }),
              t &&
                (r = this.__isAsync
                  ? e => {
                      setTimeout(() => t(e));
                    }
                  : e => {
                      t(e);
                    }),
              n &&
                (i = this.__isAsync
                  ? () => {
                      setTimeout(() => n());
                    }
                  : () => {
                      n();
                    }));
          const o = super.subscribe(s, r, i);
          return e instanceof h && e.add(o), o;
        }
      }
      function xo() {
        return this._results[Qr()]();
      }
      class ko {
        constructor() {
          (this.dirty = !0), (this._results = []), (this.changes = new To()), (this.length = 0);
          const e = Qr(),
            t = ko.prototype;
          t[e] || (t[e] = xo);
        }
        map(e) {
          return this._results.map(e);
        }
        filter(e) {
          return this._results.filter(e);
        }
        find(e) {
          return this._results.find(e);
        }
        reduce(e, t) {
          return this._results.reduce(e, t);
        }
        forEach(e) {
          this._results.forEach(e);
        }
        some(e) {
          return this._results.some(e);
        }
        toArray() {
          return this._results.slice();
        }
        toString() {
          return this._results.toString();
        }
        reset(e) {
          (this._results = (function e(t, n) {
            void 0 === n && (n = t);
            for (let s = 0; s < t.length; s++) {
              let r = t[s];
              Array.isArray(r) ? (n === t && (n = t.slice(0, s)), e(r, n)) : n !== t && n.push(r);
            }
            return n;
          })(e)),
            (this.dirty = !1),
            (this.length = this._results.length),
            (this.last = this._results[this.length - 1]),
            (this.first = this._results[0]);
        }
        notifyOnChanges() {
          this.changes.emit(this);
        }
        setDirty() {
          this.dirty = !0;
        }
        destroy() {
          this.changes.complete(), this.changes.unsubscribe();
        }
      }
      class Co {
        constructor(e) {
          (this.queryList = e), (this.matches = null);
        }
        clone() {
          return new Co(this.queryList);
        }
        setDirty() {
          this.queryList.setDirty();
        }
      }
      class Po {
        constructor(e = []) {
          this.queries = e;
        }
        createEmbeddedView(e) {
          const t = e.queries;
          if (null !== t) {
            const n = null !== e.contentQueries ? e.contentQueries[0] : t.length,
              s = [];
            for (let e = 0; e < n; e++) {
              const n = t.getByIndex(e);
              s.push(this.queries[n.indexInDeclarationView].clone());
            }
            return new Po(s);
          }
          return null;
        }
        insertView(e) {
          this.dirtyQueriesWithMatches(e);
        }
        detachView(e) {
          this.dirtyQueriesWithMatches(e);
        }
        dirtyQueriesWithMatches(e) {
          for (let t = 0; t < this.queries.length; t++)
            null !== Vo(e, t).matches && this.queries[t].setDirty();
        }
      }
      class Ao {
        constructor(e, t, n, s = null) {
          (this.predicate = e), (this.descendants = t), (this.isStatic = n), (this.read = s);
        }
      }
      class Lo {
        constructor(e = []) {
          this.queries = e;
        }
        elementStart(e, t) {
          for (let n = 0; n < this.queries.length; n++) this.queries[n].elementStart(e, t);
        }
        elementEnd(e) {
          for (let t = 0; t < this.queries.length; t++) this.queries[t].elementEnd(e);
        }
        embeddedTView(e) {
          let t = null;
          for (let n = 0; n < this.length; n++) {
            const s = null !== t ? t.length : 0,
              r = this.getByIndex(n).embeddedTView(e, s);
            r && ((r.indexInDeclarationView = n), null !== t ? t.push(r) : (t = [r]));
          }
          return null !== t ? new Lo(t) : null;
        }
        template(e, t) {
          for (let n = 0; n < this.queries.length; n++) this.queries[n].template(e, t);
        }
        getByIndex(e) {
          return this.queries[e];
        }
        get length() {
          return this.queries.length;
        }
        track(e) {
          this.queries.push(e);
        }
      }
      class No {
        constructor(e, t = -1) {
          (this.metadata = e),
            (this.matches = null),
            (this.indexInDeclarationView = -1),
            (this.crossesNgTemplate = !1),
            (this._appliesToNextNode = !0),
            (this._declarationNodeIndex = t);
        }
        elementStart(e, t) {
          this.isApplyingToNode(t) && this.matchTNode(e, t);
        }
        elementEnd(e) {
          this._declarationNodeIndex === e.index && (this._appliesToNextNode = !1);
        }
        template(e, t) {
          this.elementStart(e, t);
        }
        embeddedTView(e, t) {
          return this.isApplyingToNode(e)
            ? ((this.crossesNgTemplate = !0), this.addMatch(-e.index, t), new No(this.metadata))
            : null;
        }
        isApplyingToNode(e) {
          if (this._appliesToNextNode && !1 === this.metadata.descendants) {
            const t = this._declarationNodeIndex;
            let n = e.parent;
            for (; null !== n && 4 === n.type && n.index !== t; ) n = n.parent;
            return t === (null !== n ? n.index : -1);
          }
          return this._appliesToNextNode;
        }
        matchTNode(e, t) {
          if (Array.isArray(this.metadata.predicate)) {
            const n = this.metadata.predicate;
            for (let s = 0; s < n.length; s++) this.matchTNodeWithReadOption(e, t, Io(t, n[s]));
          } else {
            const n = this.metadata.predicate;
            n === so
              ? 0 === t.type && this.matchTNodeWithReadOption(e, t, -1)
              : this.matchTNodeWithReadOption(e, t, Dn(t, e, n, !1, !1));
          }
        }
        matchTNodeWithReadOption(e, t, n) {
          if (null !== n) {
            const s = this.metadata.read;
            if (null !== s)
              if (s === Di || s === io || (s === so && 0 === t.type)) this.addMatch(t.index, -2);
              else {
                const n = Dn(t, e, s, !1, !1);
                null !== n && this.addMatch(t.index, n);
              }
            else this.addMatch(t.index, n);
          }
        }
        addMatch(e, t) {
          null === this.matches ? (this.matches = [e, t]) : this.matches.push(e, t);
        }
      }
      function Io(e, t) {
        const n = e.localNames;
        if (null !== n) for (let s = 0; s < n.length; s += 2) if (n[s] === t) return n[s + 1];
        return null;
      }
      function Do(e, t, n, s) {
        return -1 === n
          ? (function (e, t) {
              return 3 === e.type || 4 === e.type
                ? xr(Di, e, t)
                : 0 === e.type
                ? kr(so, Di, e, t)
                : null;
            })(t, e)
          : -2 === n
          ? (function (e, t, n) {
              return n === Di
                ? xr(Di, t, e)
                : n === so
                ? kr(so, Di, t, e)
                : n === io
                ? Cr(io, Di, t, e)
                : void 0;
            })(e, t, s)
          : Fn(e, e[1], n, t);
      }
      function Fo(e, t, n, s) {
        const r = t[5].queries[s];
        if (null === r.matches) {
          const s = e.data,
            i = n.matches,
            o = [];
          for (let e = 0; e < i.length; e += 2) {
            const r = i[e];
            o.push(r < 0 ? null : Do(t, s[r], i[e + 1], n.metadata.read));
          }
          r.matches = o;
        }
        return r.matches;
      }
      function Mo(e) {
        const t = Ft(),
          n = Mt(),
          s = $t();
        Ut(s + 1);
        const r = Vo(n, s);
        if (e.dirty && Pt(t) === r.metadata.isStatic) {
          if (null === r.matches) e.reset([]);
          else {
            const i = r.crossesNgTemplate
              ? (function e(t, n, s, r) {
                  const i = t.queries.getByIndex(s),
                    o = i.matches;
                  if (null !== o) {
                    const a = Fo(t, n, i, s);
                    for (let t = 0; t < o.length; t += 2) {
                      const s = o[t];
                      if (s > 0) r.push(a[t / 2]);
                      else {
                        const i = o[t + 1],
                          a = n[-s];
                        for (let t = 9; t < a.length; t++) {
                          const n = a[t];
                          n[17] === n[3] && e(n[1], n, i, r);
                        }
                        if (null !== a[5]) {
                          const t = a[5];
                          for (let n = 0; n < t.length; n++) {
                            const s = t[n];
                            e(s[1], s, i, r);
                          }
                        }
                      }
                    }
                  }
                  return r;
                })(n, t, s, [])
              : Fo(n, t, r, s);
            e.reset(i), e.notifyOnChanges();
          }
          return !0;
        }
        return !1;
      }
      function Oo(e, t, n) {
        !(function (e, t, n, s, r, i) {
          e.firstCreatePass &&
            (function (e, t, n) {
              null === e.queries && (e.queries = new Lo()), e.queries.track(new No(t, -1));
            })(e, new Ao(n, s, !1, r)),
            (function (e, t) {
              const n = new ko();
              !(function (e, t, n, s) {
                const r = Zs(t);
                r.push(n), e.firstCreatePass && Js(e).push(s, r.length - 1);
              })(e, t, n, n.destroy),
                null === t[5] && (t[5] = new Po()),
                t[5].queries.push(new Co(n));
            })(e, t);
        })(Mt(), Ft(), e, t, n);
      }
      function Ro() {
        return (e = Ft()), (t = $t()), e[5].queries[t].queryList;
        var e, t;
      }
      function Vo(e, t) {
        return e.queries.getByIndex(t);
      }
      const jo = new Le('Application Initializer');
      let Ho = (() => {
        class e {
          constructor(e) {
            (this.appInits = e),
              (this.initialized = !1),
              (this.done = !1),
              (this.donePromise = new Promise((e, t) => {
                (this.resolve = e), (this.reject = t);
              }));
          }
          runInitializers() {
            if (this.initialized) return;
            const e = [],
              t = () => {
                (this.done = !0), this.resolve();
              };
            if (this.appInits)
              for (let n = 0; n < this.appInits.length; n++) {
                const t = this.appInits[n]();
                ui(t) && e.push(t);
              }
            Promise.all(e)
              .then(() => {
                t();
              })
              .catch(e => {
                this.reject(e);
              }),
              0 === e.length && t(),
              (this.initialized = !0);
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(He(jo, 8));
          }),
          (e.ɵprov = se({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const Bo = new Le('AppId'),
        zo = {
          provide: Bo,
          useFactory: function () {
            return `${qo()}${qo()}${qo()}`;
          },
          deps: [],
        };
      function qo() {
        return String.fromCharCode(97 + Math.floor(25 * Math.random()));
      }
      const $o = new Le('Platform Initializer'),
        Uo = new Le('Platform ID'),
        Go = new Le('appBootstrapListener');
      let Ko = (() => {
        class e {
          log(e) {
            console.log(e);
          }
          warn(e) {
            console.warn(e);
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵprov = se({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const Wo = new Le('LocaleId'),
        Qo = new Le('DefaultCurrencyCode');
      class Zo {
        constructor(e, t) {
          (this.ngModuleFactory = e), (this.componentFactories = t);
        }
      }
      const Jo = function (e) {
          return new Eo(e);
        },
        Xo = Jo,
        Yo = function (e) {
          return Promise.resolve(Jo(e));
        },
        ea = function (e) {
          const t = Jo(e),
            n = wn(ht(e).declarations).reduce((e, t) => {
              const n = ut(t);
              return n && e.push(new ho(n)), e;
            }, []);
          return new Zo(t, n);
        },
        ta = ea,
        na = function (e) {
          return Promise.resolve(ea(e));
        };
      let sa = (() => {
        class e {
          constructor() {
            (this.compileModuleSync = Xo),
              (this.compileModuleAsync = Yo),
              (this.compileModuleAndAllComponentsSync = ta),
              (this.compileModuleAndAllComponentsAsync = na);
          }
          clearCache() {}
          clearCacheFor(e) {}
          getModuleId(e) {}
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵprov = se({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const ra = new Le('compilerOptions'),
        ia = (() => Promise.resolve(0))();
      function oa(e) {
        'undefined' == typeof Zone
          ? ia.then(() => {
              e && e.apply(null, null);
            })
          : Zone.current.scheduleMicroTask('scheduleMicrotask', e);
      }
      class aa {
        constructor({ enableLongStackTrace: e = !1, shouldCoalesceEventChangeDetection: t = !1 }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new To(!1)),
            (this.onMicrotaskEmpty = new To(!1)),
            (this.onStable = new To(!1)),
            (this.onError = new To(!1)),
            'undefined' == typeof Zone)
          )
            throw new Error('In this configuration Angular requires Zone.js');
          Zone.assertZonePatched(),
            (this._nesting = 0),
            (this._outer = this._inner = Zone.current),
            Zone.wtfZoneSpec && (this._inner = this._inner.fork(Zone.wtfZoneSpec)),
            Zone.TaskTrackingZoneSpec &&
              (this._inner = this._inner.fork(new Zone.TaskTrackingZoneSpec())),
            e &&
              Zone.longStackTraceZoneSpec &&
              (this._inner = this._inner.fork(Zone.longStackTraceZoneSpec)),
            (this.shouldCoalesceEventChangeDetection = t),
            (this.lastRequestAnimationFrameId = -1),
            (this.nativeRequestAnimationFrame = (function () {
              let e = Se.requestAnimationFrame,
                t = Se.cancelAnimationFrame;
              if ('undefined' != typeof Zone && e && t) {
                const n = e[Zone.__symbol__('OriginalDelegate')];
                n && (e = n);
                const s = t[Zone.__symbol__('OriginalDelegate')];
                s && (t = s);
              }
              return { nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: t };
            })().nativeRequestAnimationFrame),
            (function (e) {
              const t =
                !!e.shouldCoalesceEventChangeDetection &&
                e.nativeRequestAnimationFrame &&
                (() => {
                  !(function (e) {
                    -1 === e.lastRequestAnimationFrameId &&
                      ((e.lastRequestAnimationFrameId = e.nativeRequestAnimationFrame.call(
                        Se,
                        () => {
                          (e.lastRequestAnimationFrameId = -1), ha(e), ca(e);
                        }
                      )),
                      ha(e));
                  })(e);
                });
              e._inner = e._inner.fork({
                name: 'angular',
                properties: { isAngularZone: !0, maybeDelayChangeDetection: t },
                onInvokeTask: (n, s, r, i, o, a) => {
                  try {
                    return da(e), n.invokeTask(r, i, o, a);
                  } finally {
                    t && 'eventTask' === i.type && t(), pa(e);
                  }
                },
                onInvoke: (t, n, s, r, i, o, a) => {
                  try {
                    return da(e), t.invoke(s, r, i, o, a);
                  } finally {
                    pa(e);
                  }
                },
                onHasTask: (t, n, s, r) => {
                  t.hasTask(s, r),
                    n === s &&
                      ('microTask' == r.change
                        ? ((e._hasPendingMicrotasks = r.microTask), ha(e), ca(e))
                        : 'macroTask' == r.change && (e.hasPendingMacrotasks = r.macroTask));
                },
                onHandleError: (t, n, s, r) => (
                  t.handleError(s, r), e.runOutsideAngular(() => e.onError.emit(r)), !1
                ),
              });
            })(this);
        }
        static isInAngularZone() {
          return !0 === Zone.current.get('isAngularZone');
        }
        static assertInAngularZone() {
          if (!aa.isInAngularZone())
            throw new Error('Expected to be in Angular Zone, but it is not!');
        }
        static assertNotInAngularZone() {
          if (aa.isInAngularZone())
            throw new Error('Expected to not be in Angular Zone, but it is!');
        }
        run(e, t, n) {
          return this._inner.run(e, t, n);
        }
        runTask(e, t, n, s) {
          const r = this._inner,
            i = r.scheduleEventTask('NgZoneEvent: ' + s, e, ua, la, la);
          try {
            return r.runTask(i, t, n);
          } finally {
            r.cancelTask(i);
          }
        }
        runGuarded(e, t, n) {
          return this._inner.runGuarded(e, t, n);
        }
        runOutsideAngular(e) {
          return this._outer.run(e);
        }
      }
      function la() {}
      const ua = {};
      function ca(e) {
        if (0 == e._nesting && !e.hasPendingMicrotasks && !e.isStable)
          try {
            e._nesting++, e.onMicrotaskEmpty.emit(null);
          } finally {
            if ((e._nesting--, !e.hasPendingMicrotasks))
              try {
                e.runOutsideAngular(() => e.onStable.emit(null));
              } finally {
                e.isStable = !0;
              }
          }
      }
      function ha(e) {
        e.hasPendingMicrotasks = !!(
          e._hasPendingMicrotasks ||
          (e.shouldCoalesceEventChangeDetection && -1 !== e.lastRequestAnimationFrameId)
        );
      }
      function da(e) {
        e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
      }
      function pa(e) {
        e._nesting--, ca(e);
      }
      class fa {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new To()),
            (this.onMicrotaskEmpty = new To()),
            (this.onStable = new To()),
            (this.onError = new To());
        }
        run(e, t, n) {
          return e.apply(t, n);
        }
        runGuarded(e, t, n) {
          return e.apply(t, n);
        }
        runOutsideAngular(e) {
          return e();
        }
        runTask(e, t, n, s) {
          return e.apply(t, n);
        }
      }
      let ma = (() => {
          class e {
            constructor(e) {
              (this._ngZone = e),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                this._watchAngularEvents(),
                e.run(() => {
                  this.taskTrackingZone =
                    'undefined' == typeof Zone ? null : Zone.current.get('TaskTrackingZone');
                });
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  (this._didWork = !0), (this._isZoneStable = !1);
                },
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      aa.assertNotInAngularZone(),
                        oa(() => {
                          (this._isZoneStable = !0), this._runCallbacksIfReady();
                        });
                    },
                  });
                });
            }
            increasePendingRequestCount() {
              return (this._pendingCount += 1), (this._didWork = !0), this._pendingCount;
            }
            decreasePendingRequestCount() {
              if (((this._pendingCount -= 1), this._pendingCount < 0))
                throw new Error('pending async requests below zero');
              return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
              return (
                this._isZoneStable && 0 === this._pendingCount && !this._ngZone.hasPendingMacrotasks
              );
            }
            _runCallbacksIfReady() {
              if (this.isStable())
                oa(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let e = this._callbacks.pop();
                    clearTimeout(e.timeoutId), e.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let e = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter(
                  t => !t.updateCb || !t.updateCb(e) || (clearTimeout(t.timeoutId), !1)
                )),
                  (this._didWork = !0);
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone
                ? this.taskTrackingZone.macroTasks.map(e => ({
                    source: e.source,
                    creationLocation: e.creationLocation,
                    data: e.data,
                  }))
                : [];
            }
            addCallback(e, t, n) {
              let s = -1;
              t &&
                t > 0 &&
                (s = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter(e => e.timeoutId !== s)),
                    e(this._didWork, this.getPendingTasks());
                }, t)),
                this._callbacks.push({ doneCb: e, timeoutId: s, updateCb: n });
            }
            whenStable(e, t, n) {
              if (n && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/dist/task-tracking.js" loaded?'
                );
              this.addCallback(e, t, n), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
              return this._pendingCount;
            }
            findProviders(e, t, n) {
              return [];
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(He(aa));
            }),
            (e.ɵprov = se({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        ga = (() => {
          class e {
            constructor() {
              (this._applications = new Map()), va.addToWindow(this);
            }
            registerApplication(e, t) {
              this._applications.set(e, t);
            }
            unregisterApplication(e) {
              this._applications.delete(e);
            }
            unregisterAllApplications() {
              this._applications.clear();
            }
            getTestability(e) {
              return this._applications.get(e) || null;
            }
            getAllTestabilities() {
              return Array.from(this._applications.values());
            }
            getAllRootElements() {
              return Array.from(this._applications.keys());
            }
            findTestabilityInTree(e, t = !0) {
              return va.findTestabilityInTree(this, e, t);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = se({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      class ya {
        addToWindow(e) {}
        findTestabilityInTree(e, t, n) {
          return null;
        }
      }
      let _a,
        va = new ya(),
        ba = function (e, t, n) {
          const s = new Eo(n);
          if (0 === $r.size) return Promise.resolve(s);
          const r = (function (e) {
            const t = [];
            return e.forEach(e => e && t.push(...e)), t;
          })(
            e
              .get(ra, [])
              .concat(t)
              .map(e => e.providers)
          );
          if (0 === r.length) return Promise.resolve(s);
          const i = (function () {
              const e = Se.ng;
              if (!e || !e.ɵcompilerFacade)
                throw new Error(
                  "Angular JIT compilation failed: '@angular/compiler' not loaded!\n  - JIT compilation is discouraged for production use-cases! Consider AOT mode instead.\n  - Did you bootstrap using '@angular/platform-browser-dynamic' or '@angular/platform-server'?\n  - Alternatively provide the compiler with 'import \"@angular/compiler\";' before bootstrapping."
                );
              return e.ɵcompilerFacade;
            })(),
            o = qr.create({ providers: r }).get(i.ResourceLoader);
          return (function (e) {
            const t = [],
              n = new Map();
            function s(e) {
              let t = n.get(e);
              if (!t) {
                const s = (e => Promise.resolve(o.get(e)))(e);
                n.set(e, (t = s.then(Gr)));
              }
              return t;
            }
            return (
              $r.forEach((e, n) => {
                const r = [];
                e.templateUrl &&
                  r.push(
                    s(e.templateUrl).then(t => {
                      e.template = t;
                    })
                  );
                const i = e.styleUrls,
                  o = e.styles || (e.styles = []),
                  a = e.styles.length;
                i &&
                  i.forEach((t, n) => {
                    o.push(''),
                      r.push(
                        s(t).then(s => {
                          (o[a + n] = s),
                            i.splice(i.indexOf(t), 1),
                            0 == i.length && (e.styleUrls = void 0);
                        })
                      );
                  });
                const l = Promise.all(r).then(() =>
                  (function (e) {
                    Ur.delete(e);
                  })(n)
                );
                t.push(l);
              }),
              ($r = new Map()),
              Promise.all(t).then(() => {})
            );
          })().then(() => s);
        };
      const wa = new Le('AllowMultipleToken');
      function Sa(e, t, n = []) {
        const s = `Platform: ${t}`,
          r = new Le(s);
        return (t = []) => {
          let i = Ea();
          if (!i || i.injector.get(wa, !1))
            if (e) e(n.concat(t).concat({ provide: r, useValue: !0 }));
            else {
              const e = n
                .concat(t)
                .concat({ provide: r, useValue: !0 }, { provide: Lr, useValue: 'platform' });
              !(function (e) {
                if (_a && !_a.destroyed && !_a.injector.get(wa, !1))
                  throw new Error(
                    'There can be only one platform. Destroy the previous one to create a new one.'
                  );
                _a = e.get(Ta);
                const t = e.get($o, null);
                t && t.forEach(e => e());
              })(qr.create({ providers: e, name: s }));
            }
          return (function (e) {
            const t = Ea();
            if (!t) throw new Error('No platform exists!');
            if (!t.injector.get(e, null))
              throw new Error(
                'A platform with a different configuration has been created. Please destroy it first.'
              );
            return t;
          })(r);
        };
      }
      function Ea() {
        return _a && !_a.destroyed ? _a : null;
      }
      let Ta = (() => {
        class e {
          constructor(e) {
            (this._injector = e),
              (this._modules = []),
              (this._destroyListeners = []),
              (this._destroyed = !1);
          }
          bootstrapModuleFactory(e, t) {
            const n = (function (e, t) {
                let n;
                return (
                  (n =
                    'noop' === e
                      ? new fa()
                      : ('zone.js' === e ? void 0 : e) ||
                        new aa({
                          enableLongStackTrace: $n(),
                          shouldCoalesceEventChangeDetection: t,
                        })),
                  n
                );
              })(t ? t.ngZone : void 0, (t && t.ngZoneEventCoalescing) || !1),
              s = [{ provide: aa, useValue: n }];
            return n.run(() => {
              const t = qr.create({ providers: s, parent: this.injector, name: e.moduleType.name }),
                r = e.create(t),
                i = r.injector.get(Bn, null);
              if (!i)
                throw new Error('No ErrorHandler. Is platform module (BrowserModule) included?');
              return (
                r.onDestroy(() => Ca(this._modules, r)),
                n.runOutsideAngular(() =>
                  n.onError.subscribe({
                    next: e => {
                      i.handleError(e);
                    },
                  })
                ),
                (function (e, t, n) {
                  try {
                    const s = n();
                    return ui(s)
                      ? s.catch(n => {
                          throw (t.runOutsideAngular(() => e.handleError(n)), n);
                        })
                      : s;
                  } catch (s) {
                    throw (t.runOutsideAngular(() => e.handleError(s)), s);
                  }
                })(i, n, () => {
                  const e = r.injector.get(Ho);
                  return (
                    e.runInitializers(),
                    e.donePromise.then(
                      () => (
                        bo(r.injector.get(Wo, 'en-US') || 'en-US'), this._moduleDoBootstrap(r), r
                      )
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(e, t = []) {
            const n = xa({}, t);
            return ba(this.injector, n, e).then(e => this.bootstrapModuleFactory(e, n));
          }
          _moduleDoBootstrap(e) {
            const t = e.injector.get(ka);
            if (e._bootstrapComponents.length > 0)
              e._bootstrapComponents.forEach(e => t.bootstrap(e));
            else {
              if (!e.instance.ngDoBootstrap)
                throw new Error(
                  `The module ${pe(
                    e.instance.constructor
                  )} was bootstrapped, but it does not declare "@NgModule.bootstrap" components nor a "ngDoBootstrap" method. ` +
                    'Please define one of these.'
                );
              e.instance.ngDoBootstrap(t);
            }
            this._modules.push(e);
          }
          onDestroy(e) {
            this._destroyListeners.push(e);
          }
          get injector() {
            return this._injector;
          }
          destroy() {
            if (this._destroyed) throw new Error('The platform has already been destroyed!');
            this._modules.slice().forEach(e => e.destroy()),
              this._destroyListeners.forEach(e => e()),
              (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(He(qr));
          }),
          (e.ɵprov = se({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function xa(e, t) {
        return Array.isArray(t) ? t.reduce(xa, e) : Object.assign(Object.assign({}, e), t);
      }
      let ka = (() => {
        class e {
          constructor(e, t, n, s, r, i) {
            (this._zone = e),
              (this._console = t),
              (this._injector = n),
              (this._exceptionHandler = s),
              (this._componentFactoryResolver = r),
              (this._initStatus = i),
              (this._bootstrapListeners = []),
              (this._views = []),
              (this._runningTick = !1),
              (this._enforceNoNewChanges = !1),
              (this._stable = !0),
              (this.componentTypes = []),
              (this.components = []),
              (this._enforceNoNewChanges = $n()),
              this._zone.onMicrotaskEmpty.subscribe({
                next: () => {
                  this._zone.run(() => {
                    this.tick();
                  });
                },
              });
            const o = new _(e => {
                (this._stable =
                  this._zone.isStable &&
                  !this._zone.hasPendingMacrotasks &&
                  !this._zone.hasPendingMicrotasks),
                  this._zone.runOutsideAngular(() => {
                    e.next(this._stable), e.complete();
                  });
              }),
              a = new _(e => {
                let t;
                this._zone.runOutsideAngular(() => {
                  t = this._zone.onStable.subscribe(() => {
                    aa.assertNotInAngularZone(),
                      oa(() => {
                        this._stable ||
                          this._zone.hasPendingMacrotasks ||
                          this._zone.hasPendingMicrotasks ||
                          ((this._stable = !0), e.next(!0));
                      });
                  });
                });
                const n = this._zone.onUnstable.subscribe(() => {
                  aa.assertInAngularZone(),
                    this._stable &&
                      ((this._stable = !1),
                      this._zone.runOutsideAngular(() => {
                        e.next(!1);
                      }));
                });
                return () => {
                  t.unsubscribe(), n.unsubscribe();
                };
              });
            this.isStable = B(
              o,
              a.pipe(e => {
                return z()(
                  ((t = W),
                  function (e) {
                    let n;
                    n =
                      'function' == typeof t
                        ? t
                        : function () {
                            return t;
                          };
                    const s = Object.create(e, G);
                    return (s.source = e), (s.subjectFactory = n), s;
                  })(e)
                );
                var t;
              })
            );
          }
          bootstrap(e, t) {
            if (!this._initStatus.done)
              throw new Error(
                'Cannot bootstrap as there are still asynchronous initializers running. Bootstrap components in the `ngDoBootstrap` method of the root module.'
              );
            let n;
            (n = e instanceof Li ? e : this._componentFactoryResolver.resolveComponentFactory(e)),
              this.componentTypes.push(n.componentType);
            const s = n.isBoundToModule ? void 0 : this._injector.get($e),
              r = n.create(qr.NULL, [], t || n.selector, s);
            r.onDestroy(() => {
              this._unloadComponent(r);
            });
            const i = r.injector.get(ma, null);
            return (
              i && r.injector.get(ga).registerApplication(r.location.nativeElement, i),
              this._loadComponent(r),
              $n() &&
                this._console.log(
                  'Angular is running in the development mode. Call enableProdMode() to enable the production mode.'
                ),
              r
            );
          }
          tick() {
            if (this._runningTick) throw new Error('ApplicationRef.tick is called recursively');
            try {
              this._runningTick = !0;
              for (let e of this._views) e.detectChanges();
              if (this._enforceNoNewChanges) for (let e of this._views) e.checkNoChanges();
            } catch (e) {
              this._zone.runOutsideAngular(() => this._exceptionHandler.handleError(e));
            } finally {
              this._runningTick = !1;
            }
          }
          attachView(e) {
            const t = e;
            this._views.push(t), t.attachToAppRef(this);
          }
          detachView(e) {
            const t = e;
            Ca(this._views, t), t.detachFromAppRef();
          }
          _loadComponent(e) {
            this.attachView(e.hostView),
              this.tick(),
              this.components.push(e),
              this._injector
                .get(Go, [])
                .concat(this._bootstrapListeners)
                .forEach(t => t(e));
          }
          _unloadComponent(e) {
            this.detachView(e.hostView), Ca(this.components, e);
          }
          ngOnDestroy() {
            this._views.slice().forEach(e => e.destroy());
          }
          get viewCount() {
            return this._views.length;
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(He(aa), He(Ko), He(qr), He(Bn), He(Ii), He(Ho));
          }),
          (e.ɵprov = se({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function Ca(e, t) {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
      }
      const Pa = Sa(null, 'core', [
          { provide: Uo, useValue: 'unknown' },
          { provide: Ta, deps: [qr] },
          { provide: ga, deps: [] },
          { provide: Ko, deps: [] },
        ]),
        Aa = [
          { provide: ka, useClass: ka, deps: [aa, Ko, qr, Bn, Ii, Ho] },
          {
            provide: co,
            deps: [aa],
            useFactory: function (e) {
              let t = [];
              return (
                e.onStable.subscribe(() => {
                  for (; t.length; ) t.pop()();
                }),
                function (e) {
                  t.push(e);
                }
              );
            },
          },
          { provide: Ho, useClass: Ho, deps: [[new X(), jo]] },
          { provide: sa, useClass: sa, deps: [] },
          zo,
          {
            provide: Xi,
            useFactory: function () {
              return to;
            },
            deps: [],
          },
          {
            provide: Yi,
            useFactory: function () {
              return no;
            },
            deps: [],
          },
          {
            provide: Wo,
            useFactory: function (e) {
              return (
                bo((e = e || ('undefined' != typeof $localize && $localize.locale) || 'en-US')), e
              );
            },
            deps: [[new J(Wo), new X(), new ee()]],
          },
          { provide: Qo, useValue: 'USD' },
        ];
      let La = (() => {
          class e {
            constructor(e) {}
          }
          return (
            (e.ɵmod = ot({ type: e })),
            (e.ɵinj = re({
              factory: function (t) {
                return new (t || e)(He(ka));
              },
              providers: Aa,
            })),
            e
          );
        })(),
        Na = null;
      function Ia() {
        return Na;
      }
      const Da = new Le('DocumentToken'),
        Fa = (function () {
          var e = { Zero: 0, One: 1, Two: 2, Few: 3, Many: 4, Other: 5 };
          return (
            (e[e.Zero] = 'Zero'),
            (e[e.One] = 'One'),
            (e[e.Two] = 'Two'),
            (e[e.Few] = 'Few'),
            (e[e.Many] = 'Many'),
            (e[e.Other] = 'Other'),
            e
          );
        })();
      class Ma {}
      let Oa = (() => {
        class e extends Ma {
          constructor(e) {
            super(), (this.locale = e);
          }
          getPluralCategory(e, t) {
            switch (
              (function (e) {
                return (function (e) {
                  const t = (function (e) {
                    return e.toLowerCase().replace(/_/g, '-');
                  })(e);
                  let n = yo(t);
                  if (n) return n;
                  const s = t.split('-')[0];
                  if (((n = yo(s)), n)) return n;
                  if ('en' === s) return mo;
                  throw new Error(`Missing locale data for the locale "${e}".`);
                })(e)[_o.PluralCase];
              })(t || this.locale)(e)
            ) {
              case Fa.Zero:
                return 'zero';
              case Fa.One:
                return 'one';
              case Fa.Two:
                return 'two';
              case Fa.Few:
                return 'few';
              case Fa.Many:
                return 'many';
              default:
                return 'other';
            }
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(He(Wo));
          }),
          (e.ɵprov = se({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function Ra(e, t) {
        t = encodeURIComponent(t);
        for (const n of e.split(';')) {
          const e = n.indexOf('='),
            [s, r] = -1 == e ? [n, ''] : [n.slice(0, e), n.slice(e + 1)];
          if (s.trim() === t) return decodeURIComponent(r);
        }
        return null;
      }
      class Va {
        constructor(e, t, n, s) {
          (this.$implicit = e), (this.ngForOf = t), (this.index = n), (this.count = s);
        }
        get first() {
          return 0 === this.index;
        }
        get last() {
          return this.index === this.count - 1;
        }
        get even() {
          return this.index % 2 == 0;
        }
        get odd() {
          return !this.even;
        }
      }
      let ja = (() => {
        class e {
          constructor(e, t, n) {
            (this._viewContainer = e),
              (this._template = t),
              (this._differs = n),
              (this._ngForOf = null),
              (this._ngForOfDirty = !0),
              (this._differ = null);
          }
          set ngForOf(e) {
            (this._ngForOf = e), (this._ngForOfDirty = !0);
          }
          set ngForTrackBy(e) {
            $n() &&
              null != e &&
              'function' != typeof e &&
              console &&
              console.warn &&
              console.warn(
                `trackBy must be a function, but received ${JSON.stringify(e)}. ` +
                  'See https://angular.io/api/common/NgForOf#change-propagation for more information.'
              ),
              (this._trackByFn = e);
          }
          get ngForTrackBy() {
            return this._trackByFn;
          }
          set ngForTemplate(e) {
            e && (this._template = e);
          }
          ngDoCheck() {
            if (this._ngForOfDirty) {
              this._ngForOfDirty = !1;
              const n = this._ngForOf;
              if (!this._differ && n)
                try {
                  this._differ = this._differs.find(n).create(this.ngForTrackBy);
                } catch (t) {
                  throw new Error(
                    `Cannot find a differ supporting object '${n}' of type '${
                      ((e = n), e.name || typeof e)
                    }'. NgFor only supports binding to Iterables such as Arrays.`
                  );
                }
            }
            var e;
            if (this._differ) {
              const e = this._differ.diff(this._ngForOf);
              e && this._applyChanges(e);
            }
          }
          _applyChanges(e) {
            const t = [];
            e.forEachOperation((e, n, s) => {
              if (null == e.previousIndex) {
                const n = this._viewContainer.createEmbeddedView(
                    this._template,
                    new Va(null, this._ngForOf, -1, -1),
                    null === s ? void 0 : s
                  ),
                  r = new Ha(e, n);
                t.push(r);
              } else if (null == s) this._viewContainer.remove(null === n ? void 0 : n);
              else if (null !== n) {
                const r = this._viewContainer.get(n);
                this._viewContainer.move(r, s);
                const i = new Ha(e, r);
                t.push(i);
              }
            });
            for (let n = 0; n < t.length; n++) this._perViewChange(t[n].view, t[n].record);
            for (let n = 0, s = this._viewContainer.length; n < s; n++) {
              const e = this._viewContainer.get(n);
              (e.context.index = n), (e.context.count = s), (e.context.ngForOf = this._ngForOf);
            }
            e.forEachIdentityChange(e => {
              this._viewContainer.get(e.currentIndex).context.$implicit = e.item;
            });
          }
          _perViewChange(e, t) {
            e.context.$implicit = t.item;
          }
          static ngTemplateContextGuard(e, t) {
            return !0;
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(ti(io), ti(so), ti(Xi));
          }),
          (e.ɵdir = lt({
            type: e,
            selectors: [['', 'ngFor', '', 'ngForOf', '']],
            inputs: {
              ngForOf: 'ngForOf',
              ngForTrackBy: 'ngForTrackBy',
              ngForTemplate: 'ngForTemplate',
            },
          })),
          e
        );
      })();
      class Ha {
        constructor(e, t) {
          (this.record = e), (this.view = t);
        }
      }
      let Ba = (() => {
        class e {
          constructor(e, t) {
            (this._viewContainer = e),
              (this._context = new za()),
              (this._thenTemplateRef = null),
              (this._elseTemplateRef = null),
              (this._thenViewRef = null),
              (this._elseViewRef = null),
              (this._thenTemplateRef = t);
          }
          set ngIf(e) {
            (this._context.$implicit = this._context.ngIf = e), this._updateView();
          }
          set ngIfThen(e) {
            qa('ngIfThen', e),
              (this._thenTemplateRef = e),
              (this._thenViewRef = null),
              this._updateView();
          }
          set ngIfElse(e) {
            qa('ngIfElse', e),
              (this._elseTemplateRef = e),
              (this._elseViewRef = null),
              this._updateView();
          }
          _updateView() {
            this._context.$implicit
              ? this._thenViewRef ||
                (this._viewContainer.clear(),
                (this._elseViewRef = null),
                this._thenTemplateRef &&
                  (this._thenViewRef = this._viewContainer.createEmbeddedView(
                    this._thenTemplateRef,
                    this._context
                  )))
              : this._elseViewRef ||
                (this._viewContainer.clear(),
                (this._thenViewRef = null),
                this._elseTemplateRef &&
                  (this._elseViewRef = this._viewContainer.createEmbeddedView(
                    this._elseTemplateRef,
                    this._context
                  )));
          }
          static ngTemplateContextGuard(e, t) {
            return !0;
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(ti(io), ti(so));
          }),
          (e.ɵdir = lt({
            type: e,
            selectors: [['', 'ngIf', '']],
            inputs: { ngIf: 'ngIf', ngIfThen: 'ngIfThen', ngIfElse: 'ngIfElse' },
          })),
          e
        );
      })();
      class za {
        constructor() {
          (this.$implicit = null), (this.ngIf = null);
        }
      }
      function qa(e, t) {
        if (t && !t.createEmbeddedView)
          throw new Error(`${e} must be a TemplateRef, but received '${pe(t)}'.`);
      }
      let $a = (() => {
          class e {
            constructor(e, t, n) {
              (this._ngEl = e),
                (this._differs = t),
                (this._renderer = n),
                (this._ngStyle = null),
                (this._differ = null);
            }
            set ngStyle(e) {
              (this._ngStyle = e),
                !this._differ && e && (this._differ = this._differs.find(e).create());
            }
            ngDoCheck() {
              if (this._differ) {
                const e = this._differ.diff(this._ngStyle);
                e && this._applyChanges(e);
              }
            }
            _setStyle(e, t) {
              const [n, s] = e.split('.');
              null != (t = null != t && s ? `${t}${s}` : t)
                ? this._renderer.setStyle(this._ngEl.nativeElement, n, t)
                : this._renderer.removeStyle(this._ngEl.nativeElement, n);
            }
            _applyChanges(e) {
              e.forEachRemovedItem(e => this._setStyle(e.key, null)),
                e.forEachAddedItem(e => this._setStyle(e.key, e.currentValue)),
                e.forEachChangedItem(e => this._setStyle(e.key, e.currentValue));
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(ti(Di), ti(Yi), ti(Ri));
            }),
            (e.ɵdir = lt({
              type: e,
              selectors: [['', 'ngStyle', '']],
              inputs: { ngStyle: 'ngStyle' },
            })),
            e
          );
        })(),
        Ua = (() => {
          class e {}
          return (
            (e.ɵmod = ot({ type: e })),
            (e.ɵinj = re({
              factory: function (t) {
                return new (t || e)();
              },
              providers: [{ provide: Ma, useClass: Oa }],
            })),
            e
          );
        })();
      class Ga extends class extends class {} {
        constructor() {
          super();
        }
        supportsDOMEvents() {
          return !0;
        }
      } {
        static makeCurrent() {
          var e;
          (e = new Ga()), Na || (Na = e);
        }
        getProperty(e, t) {
          return e[t];
        }
        log(e) {
          window.console && window.console.log && window.console.log(e);
        }
        logGroup(e) {
          window.console && window.console.group && window.console.group(e);
        }
        logGroupEnd() {
          window.console && window.console.groupEnd && window.console.groupEnd();
        }
        onAndCancel(e, t, n) {
          return (
            e.addEventListener(t, n, !1),
            () => {
              e.removeEventListener(t, n, !1);
            }
          );
        }
        dispatchEvent(e, t) {
          e.dispatchEvent(t);
        }
        remove(e) {
          return e.parentNode && e.parentNode.removeChild(e), e;
        }
        getValue(e) {
          return e.value;
        }
        createElement(e, t) {
          return (t = t || this.getDefaultDocument()).createElement(e);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument('fakeTitle');
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(e) {
          return e.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(e) {
          return e instanceof DocumentFragment;
        }
        getGlobalEventTarget(e, t) {
          return 'window' === t ? window : 'document' === t ? e : 'body' === t ? e.body : null;
        }
        getHistory() {
          return window.history;
        }
        getLocation() {
          return window.location;
        }
        getBaseHref(e) {
          const t =
            Wa || ((Wa = document.querySelector('base')), Wa) ? Wa.getAttribute('href') : null;
          return null == t
            ? null
            : ((n = t),
              Ka || (Ka = document.createElement('a')),
              Ka.setAttribute('href', n),
              '/' === Ka.pathname.charAt(0) ? Ka.pathname : '/' + Ka.pathname);
          var n;
        }
        resetBaseElement() {
          Wa = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        performanceNow() {
          return window.performance && window.performance.now
            ? window.performance.now()
            : new Date().getTime();
        }
        supportsCookies() {
          return !0;
        }
        getCookie(e) {
          return Ra(document.cookie, e);
        }
      }
      let Ka,
        Wa = null;
      const Qa = new Le('TRANSITION_ID'),
        Za = [
          {
            provide: jo,
            useFactory: function (e, t, n) {
              return () => {
                n.get(Ho).donePromise.then(() => {
                  const n = Ia();
                  Array.prototype.slice
                    .apply(t.querySelectorAll('style[ng-transition]'))
                    .filter(t => t.getAttribute('ng-transition') === e)
                    .forEach(e => n.remove(e));
                });
              };
            },
            deps: [Qa, Da, qr],
            multi: !0,
          },
        ];
      class Ja {
        static init() {
          var e;
          (e = new Ja()), (va = e);
        }
        addToWindow(e) {
          (Se.getAngularTestability = (t, n = !0) => {
            const s = e.findTestabilityInTree(t, n);
            if (null == s) throw new Error('Could not find testability for element.');
            return s;
          }),
            (Se.getAllAngularTestabilities = () => e.getAllTestabilities()),
            (Se.getAllAngularRootElements = () => e.getAllRootElements()),
            Se.frameworkStabilizers || (Se.frameworkStabilizers = []),
            Se.frameworkStabilizers.push(e => {
              const t = Se.getAllAngularTestabilities();
              let n = t.length,
                s = !1;
              const r = function (t) {
                (s = s || t), n--, 0 == n && e(s);
              };
              t.forEach(function (e) {
                e.whenStable(r);
              });
            });
        }
        findTestabilityInTree(e, t, n) {
          if (null == t) return null;
          const s = e.getTestability(t);
          return null != s
            ? s
            : n
            ? Ia().isShadowRoot(t)
              ? this.findTestabilityInTree(e, t.host, !0)
              : this.findTestabilityInTree(e, t.parentElement, !0)
            : null;
        }
      }
      const Xa = new Le('EventManagerPlugins');
      let Ya = (() => {
        class e {
          constructor(e, t) {
            (this._zone = t),
              (this._eventNameToPlugin = new Map()),
              e.forEach(e => (e.manager = this)),
              (this._plugins = e.slice().reverse());
          }
          addEventListener(e, t, n) {
            return this._findPluginFor(t).addEventListener(e, t, n);
          }
          addGlobalEventListener(e, t, n) {
            return this._findPluginFor(t).addGlobalEventListener(e, t, n);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(e) {
            const t = this._eventNameToPlugin.get(e);
            if (t) return t;
            const n = this._plugins;
            for (let s = 0; s < n.length; s++) {
              const t = n[s];
              if (t.supports(e)) return this._eventNameToPlugin.set(e, t), t;
            }
            throw new Error(`No event manager plugin found for event ${e}`);
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(He(Xa), He(aa));
          }),
          (e.ɵprov = se({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class el {
        constructor(e) {
          this._doc = e;
        }
        addGlobalEventListener(e, t, n) {
          const s = Ia().getGlobalEventTarget(this._doc, e);
          if (!s) throw new Error(`Unsupported event target ${s} for event ${t}`);
          return this.addEventListener(s, t, n);
        }
      }
      let tl = (() => {
          class e {
            constructor() {
              this._stylesSet = new Set();
            }
            addStyles(e) {
              const t = new Set();
              e.forEach(e => {
                this._stylesSet.has(e) || (this._stylesSet.add(e), t.add(e));
              }),
                this.onStylesAdded(t);
            }
            onStylesAdded(e) {}
            getAllStyles() {
              return Array.from(this._stylesSet);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = se({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        nl = (() => {
          class e extends tl {
            constructor(e) {
              super(),
                (this._doc = e),
                (this._hostNodes = new Set()),
                (this._styleNodes = new Set()),
                this._hostNodes.add(e.head);
            }
            _addStylesToHost(e, t) {
              e.forEach(e => {
                const n = this._doc.createElement('style');
                (n.textContent = e), this._styleNodes.add(t.appendChild(n));
              });
            }
            addHost(e) {
              this._addStylesToHost(this._stylesSet, e), this._hostNodes.add(e);
            }
            removeHost(e) {
              this._hostNodes.delete(e);
            }
            onStylesAdded(e) {
              this._hostNodes.forEach(t => this._addStylesToHost(e, t));
            }
            ngOnDestroy() {
              this._styleNodes.forEach(e => Ia().remove(e));
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(He(Da));
            }),
            (e.ɵprov = se({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      const sl = {
          svg: 'http://www.w3.org/2000/svg',
          xhtml: 'http://www.w3.org/1999/xhtml',
          xlink: 'http://www.w3.org/1999/xlink',
          xml: 'http://www.w3.org/XML/1998/namespace',
          xmlns: 'http://www.w3.org/2000/xmlns/',
        },
        rl = /%COMP%/g;
      function il(e, t, n) {
        for (let s = 0; s < t.length; s++) {
          let r = t[s];
          Array.isArray(r) ? il(e, r, n) : ((r = r.replace(rl, e)), n.push(r));
        }
        return n;
      }
      function ol(e) {
        return t => {
          if ('__ngUnwrap__' === t) return e;
          !1 === e(t) && (t.preventDefault(), (t.returnValue = !1));
        };
      }
      let al = (() => {
        class e {
          constructor(e, t, n) {
            (this.eventManager = e),
              (this.sharedStylesHost = t),
              (this.appId = n),
              (this.rendererByCompId = new Map()),
              (this.defaultRenderer = new ll(e));
          }
          createRenderer(e, t) {
            if (!e || !t) return this.defaultRenderer;
            switch (t.encapsulation) {
              case Xe.Emulated: {
                let n = this.rendererByCompId.get(t.id);
                return (
                  n ||
                    ((n = new ul(this.eventManager, this.sharedStylesHost, t, this.appId)),
                    this.rendererByCompId.set(t.id, n)),
                  n.applyToHost(e),
                  n
                );
              }
              case Xe.Native:
              case Xe.ShadowDom:
                return new cl(this.eventManager, this.sharedStylesHost, e, t);
              default:
                if (!this.rendererByCompId.has(t.id)) {
                  const e = il(t.id, t.styles, []);
                  this.sharedStylesHost.addStyles(e),
                    this.rendererByCompId.set(t.id, this.defaultRenderer);
                }
                return this.defaultRenderer;
            }
          }
          begin() {}
          end() {}
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(He(Ya), He(nl), He(Bo));
          }),
          (e.ɵprov = se({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class ll {
        constructor(e) {
          (this.eventManager = e), (this.data = Object.create(null));
        }
        destroy() {}
        createElement(e, t) {
          return t ? document.createElementNS(sl[t] || t, e) : document.createElement(e);
        }
        createComment(e) {
          return document.createComment(e);
        }
        createText(e) {
          return document.createTextNode(e);
        }
        appendChild(e, t) {
          e.appendChild(t);
        }
        insertBefore(e, t, n) {
          e && e.insertBefore(t, n);
        }
        removeChild(e, t) {
          e && e.removeChild(t);
        }
        selectRootElement(e, t) {
          let n = 'string' == typeof e ? document.querySelector(e) : e;
          if (!n) throw new Error(`The selector "${e}" did not match any elements`);
          return t || (n.textContent = ''), n;
        }
        parentNode(e) {
          return e.parentNode;
        }
        nextSibling(e) {
          return e.nextSibling;
        }
        setAttribute(e, t, n, s) {
          if (s) {
            t = s + ':' + t;
            const r = sl[s];
            r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n);
          } else e.setAttribute(t, n);
        }
        removeAttribute(e, t, n) {
          if (n) {
            const s = sl[n];
            s ? e.removeAttributeNS(s, t) : e.removeAttribute(`${n}:${t}`);
          } else e.removeAttribute(t);
        }
        addClass(e, t) {
          e.classList.add(t);
        }
        removeClass(e, t) {
          e.classList.remove(t);
        }
        setStyle(e, t, n, s) {
          s & Oi.DashCase
            ? e.style.setProperty(t, n, s & Oi.Important ? 'important' : '')
            : (e.style[t] = n);
        }
        removeStyle(e, t, n) {
          n & Oi.DashCase ? e.style.removeProperty(t) : (e.style[t] = '');
        }
        setProperty(e, t, n) {
          e[t] = n;
        }
        setValue(e, t) {
          e.nodeValue = t;
        }
        listen(e, t, n) {
          return 'string' == typeof e
            ? this.eventManager.addGlobalEventListener(e, t, ol(n))
            : this.eventManager.addEventListener(e, t, ol(n));
        }
      }
      class ul extends ll {
        constructor(e, t, n, s) {
          super(e), (this.component = n);
          const r = il(s + '-' + n.id, n.styles, []);
          t.addStyles(r),
            (this.contentAttr = '_ngcontent-%COMP%'.replace(rl, s + '-' + n.id)),
            (this.hostAttr = (function (e) {
              return '_nghost-%COMP%'.replace(rl, e);
            })(s + '-' + n.id));
        }
        applyToHost(e) {
          super.setAttribute(e, this.hostAttr, '');
        }
        createElement(e, t) {
          const n = super.createElement(e, t);
          return super.setAttribute(n, this.contentAttr, ''), n;
        }
      }
      class cl extends ll {
        constructor(e, t, n, s) {
          super(e),
            (this.sharedStylesHost = t),
            (this.hostEl = n),
            (this.component = s),
            (this.shadowRoot =
              s.encapsulation === Xe.ShadowDom
                ? n.attachShadow({ mode: 'open' })
                : n.createShadowRoot()),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const r = il(s.id, s.styles, []);
          for (let i = 0; i < r.length; i++) {
            const e = document.createElement('style');
            (e.textContent = r[i]), this.shadowRoot.appendChild(e);
          }
        }
        nodeOrShadowRoot(e) {
          return e === this.hostEl ? this.shadowRoot : e;
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot);
        }
        appendChild(e, t) {
          return super.appendChild(this.nodeOrShadowRoot(e), t);
        }
        insertBefore(e, t, n) {
          return super.insertBefore(this.nodeOrShadowRoot(e), t, n);
        }
        removeChild(e, t) {
          return super.removeChild(this.nodeOrShadowRoot(e), t);
        }
        parentNode(e) {
          return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(e)));
        }
      }
      let hl = (() => {
        class e extends el {
          constructor(e) {
            super(e);
          }
          supports(e) {
            return !0;
          }
          addEventListener(e, t, n) {
            return e.addEventListener(t, n, !1), () => this.removeEventListener(e, t, n);
          }
          removeEventListener(e, t, n) {
            return e.removeEventListener(t, n);
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(He(Da));
          }),
          (e.ɵprov = se({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const dl = ['alt', 'control', 'meta', 'shift'],
        pl = {
          '\b': 'Backspace',
          '\t': 'Tab',
          '\x7f': 'Delete',
          '\x1b': 'Escape',
          Del: 'Delete',
          Esc: 'Escape',
          Left: 'ArrowLeft',
          Right: 'ArrowRight',
          Up: 'ArrowUp',
          Down: 'ArrowDown',
          Menu: 'ContextMenu',
          Scroll: 'ScrollLock',
          Win: 'OS',
        },
        fl = {
          A: '1',
          B: '2',
          C: '3',
          D: '4',
          E: '5',
          F: '6',
          G: '7',
          H: '8',
          I: '9',
          J: '*',
          K: '+',
          M: '-',
          N: '.',
          O: '/',
          '`': '0',
          '\x90': 'NumLock',
        },
        ml = {
          alt: e => e.altKey,
          control: e => e.ctrlKey,
          meta: e => e.metaKey,
          shift: e => e.shiftKey,
        };
      let gl = (() => {
        class e extends el {
          constructor(e) {
            super(e);
          }
          supports(t) {
            return null != e.parseEventName(t);
          }
          addEventListener(t, n, s) {
            const r = e.parseEventName(n),
              i = e.eventCallback(r.fullKey, s, this.manager.getZone());
            return this.manager
              .getZone()
              .runOutsideAngular(() => Ia().onAndCancel(t, r.domEventName, i));
          }
          static parseEventName(t) {
            const n = t.toLowerCase().split('.'),
              s = n.shift();
            if (0 === n.length || ('keydown' !== s && 'keyup' !== s)) return null;
            const r = e._normalizeKey(n.pop());
            let i = '';
            if (
              (dl.forEach(e => {
                const t = n.indexOf(e);
                t > -1 && (n.splice(t, 1), (i += e + '.'));
              }),
              (i += r),
              0 != n.length || 0 === r.length)
            )
              return null;
            const o = {};
            return (o.domEventName = s), (o.fullKey = i), o;
          }
          static getEventFullKey(e) {
            let t = '',
              n = (function (e) {
                let t = e.key;
                if (null == t) {
                  if (((t = e.keyIdentifier), null == t)) return 'Unidentified';
                  t.startsWith('U+') &&
                    ((t = String.fromCharCode(parseInt(t.substring(2), 16))),
                    3 === e.location && fl.hasOwnProperty(t) && (t = fl[t]));
                }
                return pl[t] || t;
              })(e);
            return (
              (n = n.toLowerCase()),
              ' ' === n ? (n = 'space') : '.' === n && (n = 'dot'),
              dl.forEach(s => {
                s != n && (0, ml[s])(e) && (t += s + '.');
              }),
              (t += n),
              t
            );
          }
          static eventCallback(t, n, s) {
            return r => {
              e.getEventFullKey(r) === t && s.runGuarded(() => n(r));
            };
          }
          static _normalizeKey(e) {
            switch (e) {
              case 'esc':
                return 'escape';
              default:
                return e;
            }
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(He(Da));
          }),
          (e.ɵprov = se({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const yl = Sa(Pa, 'browser', [
          { provide: Uo, useValue: 'browser' },
          {
            provide: $o,
            useValue: function () {
              Ga.makeCurrent(), Ja.init();
            },
            multi: !0,
          },
          {
            provide: Da,
            useFactory: function () {
              return (
                (function (e) {
                  vt = e;
                })(document),
                document
              );
            },
            deps: [],
          },
        ]),
        _l = [
          [],
          { provide: Lr, useValue: 'root' },
          {
            provide: Bn,
            useFactory: function () {
              return new Bn();
            },
            deps: [],
          },
          { provide: Xa, useClass: hl, multi: !0, deps: [Da, aa, Uo] },
          { provide: Xa, useClass: gl, multi: !0, deps: [Da] },
          [],
          { provide: al, useClass: al, deps: [Ya, nl, Bo] },
          { provide: Mi, useExisting: al },
          { provide: tl, useExisting: nl },
          { provide: nl, useClass: nl, deps: [Da] },
          { provide: ma, useClass: ma, deps: [aa] },
          { provide: Ya, useClass: Ya, deps: [Xa, aa] },
          [],
        ];
      let vl = (() => {
        class e {
          constructor(e) {
            if (e)
              throw new Error(
                'BrowserModule has already been loaded. If you need access to common directives such as NgIf and NgFor from a lazy loaded module, import CommonModule instead.'
              );
          }
          static withServerTransition(t) {
            return {
              ngModule: e,
              providers: [{ provide: Bo, useValue: t.appId }, { provide: Qa, useExisting: Bo }, Za],
            };
          }
        }
        return (
          (e.ɵmod = ot({ type: e })),
          (e.ɵinj = re({
            factory: function (t) {
              return new (t || e)(He(e, 12));
            },
            providers: _l,
            imports: [Ua, La],
          })),
          e
        );
      })();
      'undefined' != typeof window && window;
      const bl = (() => {
          const e = Element.prototype;
          return (
            e.matches ||
            e.matchesSelector ||
            e.mozMatchesSelector ||
            e.msMatchesSelector ||
            e.oMatchesSelector ||
            e.webkitMatchesSelector
          );
        })(),
        wl = {
          schedule(e, t) {
            const n = setTimeout(e, t);
            return () => clearTimeout(n);
          },
          scheduleBeforeRender(e) {
            if ('undefined' == typeof window) return wl.schedule(e, 0);
            if (void 0 === window.requestAnimationFrame) return wl.schedule(e, 16);
            const t = window.requestAnimationFrame(e);
            return () => window.cancelAnimationFrame(t);
          },
        };
      function Sl(e, t, n) {
        let s = n;
        return (
          (function (e) {
            return !!e && e.nodeType === Node.ELEMENT_NODE;
          })(e) &&
            t.some(
              (t, n) =>
                !(
                  '*' === t ||
                  !(function (e, t) {
                    return bl.call(e, t);
                  })(e, t) ||
                  ((s = n), 0)
                )
            ),
          s
        );
      }
      class El {
        constructor(e, t) {
          this.componentFactory = t.get(Ii).resolveComponentFactory(e);
        }
        create(e) {
          return new Tl(this.componentFactory, e);
        }
      }
      class Tl {
        constructor(e, t) {
          (this.componentFactory = e),
            (this.injector = t),
            (this.componentRef = null),
            (this.inputChanges = null),
            (this.implementsOnChanges = !1),
            (this.scheduledChangeDetectionFn = null),
            (this.scheduledDestroyFn = null),
            (this.initialInputValues = new Map()),
            (this.unchangedInputs = new Set());
        }
        connect(e) {
          if (null !== this.scheduledDestroyFn)
            return this.scheduledDestroyFn(), void (this.scheduledDestroyFn = null);
          null === this.componentRef && this.initializeComponent(e);
        }
        disconnect() {
          null !== this.componentRef &&
            null === this.scheduledDestroyFn &&
            (this.scheduledDestroyFn = wl.schedule(() => {
              null !== this.componentRef &&
                (this.componentRef.destroy(), (this.componentRef = null));
            }, 10));
        }
        getInputValue(e) {
          return null === this.componentRef
            ? this.initialInputValues.get(e)
            : this.componentRef.instance[e];
        }
        setInputValue(e, t) {
          var n, s;
          null !== this.componentRef
            ? (((n = t) !== (s = this.getInputValue(e)) && (n == n || s == s)) ||
                (void 0 === t && this.unchangedInputs.has(e))) &&
              (this.recordInputChange(e, t),
              (this.componentRef.instance[e] = t),
              this.scheduleDetectChanges())
            : this.initialInputValues.set(e, t);
        }
        initializeComponent(e) {
          const t = qr.create({ providers: [], parent: this.injector }),
            n = (function (e, t) {
              const n = e.childNodes,
                s = t.map(() => []);
              let r = -1;
              t.some((e, t) => '*' === e && ((r = t), !0));
              for (let i = 0, o = n.length; i < o; ++i) {
                const e = n[i],
                  o = Sl(e, t, r);
                -1 !== o && s[o].push(e);
              }
              return s;
            })(e, this.componentFactory.ngContentSelectors);
          (this.componentRef = this.componentFactory.create(t, n, e)),
            (this.implementsOnChanges =
              'function' == typeof this.componentRef.instance.ngOnChanges),
            this.initializeInputs(),
            this.initializeOutputs(this.componentRef),
            this.detectChanges(),
            this.injector.get(ka).attachView(this.componentRef.hostView);
        }
        initializeInputs() {
          this.componentFactory.inputs.forEach(({ propName: e }) => {
            this.implementsOnChanges && this.unchangedInputs.add(e),
              this.initialInputValues.has(e) &&
                this.setInputValue(e, this.initialInputValues.get(e));
          }),
            this.initialInputValues.clear();
        }
        initializeOutputs(e) {
          const t = this.componentFactory.outputs.map(({ propName: t, templateName: n }) =>
            e.instance[t].pipe(D(e => ({ name: n, value: e })))
          );
          this.events = B(...t);
        }
        callNgOnChanges(e) {
          if (!this.implementsOnChanges || null === this.inputChanges) return;
          const t = this.inputChanges;
          (this.inputChanges = null), e.instance.ngOnChanges(t);
        }
        scheduleDetectChanges() {
          this.scheduledChangeDetectionFn ||
            (this.scheduledChangeDetectionFn = wl.scheduleBeforeRender(() => {
              (this.scheduledChangeDetectionFn = null), this.detectChanges();
            }));
        }
        recordInputChange(e, t) {
          if (null !== this.componentRef && !this.implementsOnChanges) return;
          null === this.inputChanges && (this.inputChanges = {});
          const n = this.inputChanges[e];
          if (n) return void (n.currentValue = t);
          const s = this.unchangedInputs.has(e);
          this.unchangedInputs.delete(e);
          const r = s ? void 0 : this.getInputValue(e);
          this.inputChanges[e] = new ki(r, t, s);
        }
        detectChanges() {
          null !== this.componentRef &&
            (this.callNgOnChanges(this.componentRef),
            this.componentRef.changeDetectorRef.detectChanges());
        }
      }
      class xl extends HTMLElement {
        constructor() {
          super(...arguments), (this.ngElementEventsSubscription = null);
        }
      }
      function kl(e, t) {
        e.forEach(({ propName: e }) => {
          Object.defineProperty(t, e, {
            get() {
              return this.ngElementStrategy.getInputValue(e);
            },
            set(t) {
              this.ngElementStrategy.setInputValue(e, t);
            },
            configurable: !0,
            enumerable: !0,
          });
        });
      }
      class Cl {}
      function Pl(e, t = null) {
        return { type: 2, steps: e, options: t };
      }
      function Al(e) {
        return { type: 6, styles: e, offset: null };
      }
      function Ll(e) {
        Promise.resolve(null).then(e);
      }
      class Nl {
        constructor(e = 0, t = 0) {
          (this._onDoneFns = []),
            (this._onStartFns = []),
            (this._onDestroyFns = []),
            (this._started = !1),
            (this._destroyed = !1),
            (this._finished = !1),
            (this.parentPlayer = null),
            (this.totalTime = e + t);
        }
        _onFinish() {
          this._finished ||
            ((this._finished = !0), this._onDoneFns.forEach(e => e()), (this._onDoneFns = []));
        }
        onStart(e) {
          this._onStartFns.push(e);
        }
        onDone(e) {
          this._onDoneFns.push(e);
        }
        onDestroy(e) {
          this._onDestroyFns.push(e);
        }
        hasStarted() {
          return this._started;
        }
        init() {}
        play() {
          this.hasStarted() || (this._onStart(), this.triggerMicrotask()), (this._started = !0);
        }
        triggerMicrotask() {
          Ll(() => this._onFinish());
        }
        _onStart() {
          this._onStartFns.forEach(e => e()), (this._onStartFns = []);
        }
        pause() {}
        restart() {}
        finish() {
          this._onFinish();
        }
        destroy() {
          this._destroyed ||
            ((this._destroyed = !0),
            this.hasStarted() || this._onStart(),
            this.finish(),
            this._onDestroyFns.forEach(e => e()),
            (this._onDestroyFns = []));
        }
        reset() {}
        setPosition(e) {}
        getPosition() {
          return 0;
        }
        triggerCallback(e) {
          const t = 'start' == e ? this._onStartFns : this._onDoneFns;
          t.forEach(e => e()), (t.length = 0);
        }
      }
      class Il {
        constructor(e) {
          (this._onDoneFns = []),
            (this._onStartFns = []),
            (this._finished = !1),
            (this._started = !1),
            (this._destroyed = !1),
            (this._onDestroyFns = []),
            (this.parentPlayer = null),
            (this.totalTime = 0),
            (this.players = e);
          let t = 0,
            n = 0,
            s = 0;
          const r = this.players.length;
          0 == r
            ? Ll(() => this._onFinish())
            : this.players.forEach(e => {
                e.onDone(() => {
                  ++t == r && this._onFinish();
                }),
                  e.onDestroy(() => {
                    ++n == r && this._onDestroy();
                  }),
                  e.onStart(() => {
                    ++s == r && this._onStart();
                  });
              }),
            (this.totalTime = this.players.reduce((e, t) => Math.max(e, t.totalTime), 0));
        }
        _onFinish() {
          this._finished ||
            ((this._finished = !0), this._onDoneFns.forEach(e => e()), (this._onDoneFns = []));
        }
        init() {
          this.players.forEach(e => e.init());
        }
        onStart(e) {
          this._onStartFns.push(e);
        }
        _onStart() {
          this.hasStarted() ||
            ((this._started = !0), this._onStartFns.forEach(e => e()), (this._onStartFns = []));
        }
        onDone(e) {
          this._onDoneFns.push(e);
        }
        onDestroy(e) {
          this._onDestroyFns.push(e);
        }
        hasStarted() {
          return this._started;
        }
        play() {
          this.parentPlayer || this.init(), this._onStart(), this.players.forEach(e => e.play());
        }
        pause() {
          this.players.forEach(e => e.pause());
        }
        restart() {
          this.players.forEach(e => e.restart());
        }
        finish() {
          this._onFinish(), this.players.forEach(e => e.finish());
        }
        destroy() {
          this._onDestroy();
        }
        _onDestroy() {
          this._destroyed ||
            ((this._destroyed = !0),
            this._onFinish(),
            this.players.forEach(e => e.destroy()),
            this._onDestroyFns.forEach(e => e()),
            (this._onDestroyFns = []));
        }
        reset() {
          this.players.forEach(e => e.reset()),
            (this._destroyed = !1),
            (this._finished = !1),
            (this._started = !1);
        }
        setPosition(e) {
          const t = e * this.totalTime;
          this.players.forEach(e => {
            const n = e.totalTime ? Math.min(1, t / e.totalTime) : 1;
            e.setPosition(n);
          });
        }
        getPosition() {
          let e = 0;
          return (
            this.players.forEach(t => {
              const n = t.getPosition();
              e = Math.min(n, e);
            }),
            e
          );
        }
        beforeDestroy() {
          this.players.forEach(e => {
            e.beforeDestroy && e.beforeDestroy();
          });
        }
        triggerCallback(e) {
          const t = 'start' == e ? this._onStartFns : this._onDoneFns;
          t.forEach(e => e()), (t.length = 0);
        }
      }
      function Dl() {
        return 'undefined' != typeof process && '[object process]' === {}.toString.call(process);
      }
      function Fl(e) {
        switch (e.length) {
          case 0:
            return new Nl();
          case 1:
            return e[0];
          default:
            return new Il(e);
        }
      }
      function Ml(e, t, n, s, r = {}, i = {}) {
        const o = [],
          a = [];
        let l = -1,
          u = null;
        if (
          (s.forEach(e => {
            const n = e.offset,
              s = n == l,
              c = (s && u) || {};
            Object.keys(e).forEach(n => {
              let s = n,
                a = e[n];
              if ('offset' !== n)
                switch (((s = t.normalizePropertyName(s, o)), a)) {
                  case '!':
                    a = r[n];
                    break;
                  case '*':
                    a = i[n];
                    break;
                  default:
                    a = t.normalizeStyleValue(n, s, a, o);
                }
              c[s] = a;
            }),
              s || a.push(c),
              (u = c),
              (l = n);
          }),
          o.length)
        ) {
          const e = '\n - ';
          throw new Error(`Unable to animate due to the following errors:${e}${o.join(e)}`);
        }
        return a;
      }
      function Ol(e, t, n, s) {
        switch (t) {
          case 'start':
            e.onStart(() => s(n && Rl(n, 'start', e)));
            break;
          case 'done':
            e.onDone(() => s(n && Rl(n, 'done', e)));
            break;
          case 'destroy':
            e.onDestroy(() => s(n && Rl(n, 'destroy', e)));
        }
      }
      function Rl(e, t, n) {
        const s = n.totalTime,
          r = Vl(
            e.element,
            e.triggerName,
            e.fromState,
            e.toState,
            t || e.phaseName,
            null == s ? e.totalTime : s,
            !!n.disabled
          ),
          i = e._data;
        return null != i && (r._data = i), r;
      }
      function Vl(e, t, n, s, r = '', i = 0, o) {
        return {
          element: e,
          triggerName: t,
          fromState: n,
          toState: s,
          phaseName: r,
          totalTime: i,
          disabled: !!o,
        };
      }
      function jl(e, t, n) {
        let s;
        return (
          e instanceof Map
            ? ((s = e.get(t)), s || e.set(t, (s = n)))
            : ((s = e[t]), s || (s = e[t] = n)),
          s
        );
      }
      function Hl(e) {
        const t = e.indexOf(':');
        return [e.substring(1, t), e.substr(t + 1)];
      }
      let Bl = (e, t) => !1,
        zl = (e, t) => !1,
        ql = (e, t, n) => [];
      const $l = Dl();
      ($l || 'undefined' != typeof Element) &&
        ((Bl = (e, t) => e.contains(t)),
        (zl = (() => {
          if ($l || Element.prototype.matches) return (e, t) => e.matches(t);
          {
            const e = Element.prototype,
              t =
                e.matchesSelector ||
                e.mozMatchesSelector ||
                e.msMatchesSelector ||
                e.oMatchesSelector ||
                e.webkitMatchesSelector;
            return t ? (e, n) => t.apply(e, [n]) : zl;
          }
        })()),
        (ql = (e, t, n) => {
          let s = [];
          if (n) s.push(...e.querySelectorAll(t));
          else {
            const n = e.querySelector(t);
            n && s.push(n);
          }
          return s;
        }));
      let Ul = null,
        Gl = !1;
      function Kl(e) {
        Ul ||
          ((Ul = ('undefined' != typeof document ? document.body : null) || {}),
          (Gl = !!Ul.style && 'WebkitAppearance' in Ul.style));
        let t = !0;
        return (
          Ul.style &&
            !(function (e) {
              return 'ebkit' == e.substring(1, 6);
            })(e) &&
            ((t = e in Ul.style), !t && Gl) &&
            (t = 'Webkit' + e.charAt(0).toUpperCase() + e.substr(1) in Ul.style),
          t
        );
      }
      const Wl = zl,
        Ql = Bl,
        Zl = ql;
      function Jl(e) {
        const t = {};
        return (
          Object.keys(e).forEach(n => {
            const s = n.replace(/([a-z])([A-Z])/g, '$1-$2');
            t[s] = e[n];
          }),
          t
        );
      }
      let Xl = (() => {
          class e {
            validateStyleProperty(e) {
              return Kl(e);
            }
            matchesElement(e, t) {
              return Wl(e, t);
            }
            containsElement(e, t) {
              return Ql(e, t);
            }
            query(e, t, n) {
              return Zl(e, t, n);
            }
            computeStyle(e, t, n) {
              return n || '';
            }
            animate(e, t, n, s, r, i = [], o) {
              return new Nl(n, s);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = se({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Yl = (() => {
          class e {}
          return (e.NOOP = new Xl()), e;
        })();
      function eu(e) {
        if ('number' == typeof e) return e;
        const t = e.match(/^(-?[\.\d]+)(m?s)/);
        return !t || t.length < 2 ? 0 : tu(parseFloat(t[1]), t[2]);
      }
      function tu(e, t) {
        switch (t) {
          case 's':
            return 1e3 * e;
          default:
            return e;
        }
      }
      function nu(e, t, n) {
        return e.hasOwnProperty('duration')
          ? e
          : (function (e, t, n) {
              let s,
                r = 0,
                i = '';
              if ('string' == typeof e) {
                const n = e.match(
                  /^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i
                );
                if (null === n)
                  return (
                    t.push(`The provided timing value "${e}" is invalid.`),
                    { duration: 0, delay: 0, easing: '' }
                  );
                s = tu(parseFloat(n[1]), n[2]);
                const o = n[3];
                null != o && (r = tu(parseFloat(o), n[4]));
                const a = n[5];
                a && (i = a);
              } else s = e;
              if (!n) {
                let n = !1,
                  i = t.length;
                s < 0 &&
                  (t.push('Duration values below 0 are not allowed for this animation step.'),
                  (n = !0)),
                  r < 0 &&
                    (t.push('Delay values below 0 are not allowed for this animation step.'),
                    (n = !0)),
                  n && t.splice(i, 0, `The provided timing value "${e}" is invalid.`);
              }
              return { duration: s, delay: r, easing: i };
            })(e, t, n);
      }
      function su(e, t = {}) {
        return (
          Object.keys(e).forEach(n => {
            t[n] = e[n];
          }),
          t
        );
      }
      function ru(e, t, n = {}) {
        if (t) for (let s in e) n[s] = e[s];
        else su(e, n);
        return n;
      }
      function iu(e, t, n) {
        return n ? t + ':' + n + ';' : '';
      }
      function ou(e) {
        let t = '';
        for (let n = 0; n < e.style.length; n++) {
          const s = e.style.item(n);
          t += iu(0, s, e.style.getPropertyValue(s));
        }
        for (const n in e.style)
          e.style.hasOwnProperty(n) &&
            !n.startsWith('_') &&
            (t += iu(0, n.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(), e.style[n]));
        e.setAttribute('style', t);
      }
      function au(e, t, n) {
        e.style &&
          (Object.keys(t).forEach(s => {
            const r = mu(s);
            n && !n.hasOwnProperty(s) && (n[s] = e.style[r]), (e.style[r] = t[s]);
          }),
          Dl() && ou(e));
      }
      function lu(e, t) {
        e.style &&
          (Object.keys(t).forEach(t => {
            const n = mu(t);
            e.style[n] = '';
          }),
          Dl() && ou(e));
      }
      function uu(e) {
        return Array.isArray(e) ? (1 == e.length ? e[0] : Pl(e)) : e;
      }
      const cu = new RegExp('{{\\s*(.+?)\\s*}}', 'g');
      function hu(e) {
        let t = [];
        if ('string' == typeof e) {
          let n;
          for (; (n = cu.exec(e)); ) t.push(n[1]);
          cu.lastIndex = 0;
        }
        return t;
      }
      function du(e, t, n) {
        const s = e.toString(),
          r = s.replace(cu, (e, s) => {
            let r = t[s];
            return (
              t.hasOwnProperty(s) ||
                (n.push(`Please provide a value for the animation param ${s}`), (r = '')),
              r.toString()
            );
          });
        return r == s ? e : r;
      }
      function pu(e) {
        const t = [];
        let n = e.next();
        for (; !n.done; ) t.push(n.value), (n = e.next());
        return t;
      }
      const fu = /-+([a-z0-9])/g;
      function mu(e) {
        return e.replace(fu, (...e) => e[1].toUpperCase());
      }
      function gu(e, t) {
        return 0 === e || 0 === t;
      }
      function yu(e, t, n) {
        const s = Object.keys(n);
        if (s.length && t.length) {
          let i = t[0],
            o = [];
          if (
            (s.forEach(e => {
              i.hasOwnProperty(e) || o.push(e), (i[e] = n[e]);
            }),
            o.length)
          )
            for (var r = 1; r < t.length; r++) {
              let n = t[r];
              o.forEach(function (t) {
                n[t] = vu(e, t);
              });
            }
        }
        return t;
      }
      function _u(e, t, n) {
        switch (t.type) {
          case 7:
            return e.visitTrigger(t, n);
          case 0:
            return e.visitState(t, n);
          case 1:
            return e.visitTransition(t, n);
          case 2:
            return e.visitSequence(t, n);
          case 3:
            return e.visitGroup(t, n);
          case 4:
            return e.visitAnimate(t, n);
          case 5:
            return e.visitKeyframes(t, n);
          case 6:
            return e.visitStyle(t, n);
          case 8:
            return e.visitReference(t, n);
          case 9:
            return e.visitAnimateChild(t, n);
          case 10:
            return e.visitAnimateRef(t, n);
          case 11:
            return e.visitQuery(t, n);
          case 12:
            return e.visitStagger(t, n);
          default:
            throw new Error(`Unable to resolve animation metadata node #${t.type}`);
        }
      }
      function vu(e, t) {
        return window.getComputedStyle(e)[t];
      }
      function bu(e, t) {
        const n = [];
        return (
          'string' == typeof e
            ? e.split(/\s*,\s*/).forEach(e =>
                (function (e, t, n) {
                  if (':' == e[0]) {
                    const s = (function (e, t) {
                      switch (e) {
                        case ':enter':
                          return 'void => *';
                        case ':leave':
                          return '* => void';
                        case ':increment':
                          return (e, t) => parseFloat(t) > parseFloat(e);
                        case ':decrement':
                          return (e, t) => parseFloat(t) < parseFloat(e);
                        default:
                          return (
                            t.push(`The transition alias value "${e}" is not supported`), '* => *'
                          );
                      }
                    })(e, n);
                    if ('function' == typeof s) return void t.push(s);
                    e = s;
                  }
                  const s = e.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
                  if (null == s || s.length < 4)
                    return n.push(`The provided transition expression "${e}" is not supported`), t;
                  const r = s[1],
                    i = s[2],
                    o = s[3];
                  t.push(Eu(r, o)), '<' != i[0] || ('*' == r && '*' == o) || t.push(Eu(o, r));
                })(e, n, t)
              )
            : n.push(e),
          n
        );
      }
      const wu = new Set(['true', '1']),
        Su = new Set(['false', '0']);
      function Eu(e, t) {
        const n = wu.has(e) || Su.has(e),
          s = wu.has(t) || Su.has(t);
        return (r, i) => {
          let o = '*' == e || e == r,
            a = '*' == t || t == i;
          return (
            !o && n && 'boolean' == typeof r && (o = r ? wu.has(e) : Su.has(e)),
            !a && s && 'boolean' == typeof i && (a = i ? wu.has(t) : Su.has(t)),
            o && a
          );
        };
      }
      const Tu = new RegExp('s*:selfs*,?', 'g');
      function xu(e, t, n) {
        return new ku(e).build(t, n);
      }
      class ku {
        constructor(e) {
          this._driver = e;
        }
        build(e, t) {
          const n = new Cu(t);
          return this._resetContextStyleTimingState(n), _u(this, uu(e), n);
        }
        _resetContextStyleTimingState(e) {
          (e.currentQuerySelector = ''),
            (e.collectedStyles = {}),
            (e.collectedStyles[''] = {}),
            (e.currentTime = 0);
        }
        visitTrigger(e, t) {
          let n = (t.queryCount = 0),
            s = (t.depCount = 0);
          const r = [],
            i = [];
          return (
            '@' == e.name.charAt(0) &&
              t.errors.push(
                "animation triggers cannot be prefixed with an `@` sign (e.g. trigger('@foo', [...]))"
              ),
            e.definitions.forEach(e => {
              if ((this._resetContextStyleTimingState(t), 0 == e.type)) {
                const n = e,
                  s = n.name;
                s
                  .toString()
                  .split(/\s*,\s*/)
                  .forEach(e => {
                    (n.name = e), r.push(this.visitState(n, t));
                  }),
                  (n.name = s);
              } else if (1 == e.type) {
                const r = this.visitTransition(e, t);
                (n += r.queryCount), (s += r.depCount), i.push(r);
              } else
                t.errors.push(
                  'only state() and transition() definitions can sit inside of a trigger()'
                );
            }),
            {
              type: 7,
              name: e.name,
              states: r,
              transitions: i,
              queryCount: n,
              depCount: s,
              options: null,
            }
          );
        }
        visitState(e, t) {
          const n = this.visitStyle(e.styles, t),
            s = (e.options && e.options.params) || null;
          if (n.containsDynamicStyles) {
            const r = new Set(),
              i = s || {};
            if (
              (n.styles.forEach(e => {
                if (Pu(e)) {
                  const t = e;
                  Object.keys(t).forEach(e => {
                    hu(t[e]).forEach(e => {
                      i.hasOwnProperty(e) || r.add(e);
                    });
                  });
                }
              }),
              r.size)
            ) {
              const n = pu(r.values());
              t.errors.push(
                `state("${
                  e.name
                }", ...) must define default values for all the following style substitutions: ${n.join(
                  ', '
                )}`
              );
            }
          }
          return { type: 0, name: e.name, style: n, options: s ? { params: s } : null };
        }
        visitTransition(e, t) {
          (t.queryCount = 0), (t.depCount = 0);
          const n = _u(this, uu(e.animation), t);
          return {
            type: 1,
            matchers: bu(e.expr, t.errors),
            animation: n,
            queryCount: t.queryCount,
            depCount: t.depCount,
            options: Au(e.options),
          };
        }
        visitSequence(e, t) {
          return { type: 2, steps: e.steps.map(e => _u(this, e, t)), options: Au(e.options) };
        }
        visitGroup(e, t) {
          const n = t.currentTime;
          let s = 0;
          const r = e.steps.map(e => {
            t.currentTime = n;
            const r = _u(this, e, t);
            return (s = Math.max(s, t.currentTime)), r;
          });
          return (t.currentTime = s), { type: 3, steps: r, options: Au(e.options) };
        }
        visitAnimate(e, t) {
          const n = (function (e, t) {
            let n = null;
            if (e.hasOwnProperty('duration')) n = e;
            else if ('number' == typeof e) return Lu(nu(e, t).duration, 0, '');
            const s = e;
            if (s.split(/\s+/).some(e => '{' == e.charAt(0) && '{' == e.charAt(1))) {
              const e = Lu(0, 0, '');
              return (e.dynamic = !0), (e.strValue = s), e;
            }
            return (n = n || nu(s, t)), Lu(n.duration, n.delay, n.easing);
          })(e.timings, t.errors);
          let s;
          t.currentAnimateTimings = n;
          let r = e.styles ? e.styles : Al({});
          if (5 == r.type) s = this.visitKeyframes(r, t);
          else {
            let r = e.styles,
              i = !1;
            if (!r) {
              i = !0;
              const e = {};
              n.easing && (e.easing = n.easing), (r = Al(e));
            }
            t.currentTime += n.duration + n.delay;
            const o = this.visitStyle(r, t);
            (o.isEmptyStep = i), (s = o);
          }
          return (t.currentAnimateTimings = null), { type: 4, timings: n, style: s, options: null };
        }
        visitStyle(e, t) {
          const n = this._makeStyleAst(e, t);
          return this._validateStyleAst(n, t), n;
        }
        _makeStyleAst(e, t) {
          const n = [];
          Array.isArray(e.styles)
            ? e.styles.forEach(e => {
                'string' == typeof e
                  ? '*' == e
                    ? n.push(e)
                    : t.errors.push(`The provided style string value ${e} is not allowed.`)
                  : n.push(e);
              })
            : n.push(e.styles);
          let s = !1,
            r = null;
          return (
            n.forEach(e => {
              if (Pu(e)) {
                const t = e,
                  n = t.easing;
                if ((n && ((r = n), delete t.easing), !s))
                  for (let e in t)
                    if (t[e].toString().indexOf('{{') >= 0) {
                      s = !0;
                      break;
                    }
              }
            }),
            {
              type: 6,
              styles: n,
              easing: r,
              offset: e.offset,
              containsDynamicStyles: s,
              options: null,
            }
          );
        }
        _validateStyleAst(e, t) {
          const n = t.currentAnimateTimings;
          let s = t.currentTime,
            r = t.currentTime;
          n && r > 0 && (r -= n.duration + n.delay),
            e.styles.forEach(e => {
              'string' != typeof e &&
                Object.keys(e).forEach(n => {
                  if (!this._driver.validateStyleProperty(n))
                    return void t.errors.push(
                      `The provided animation property "${n}" is not a supported CSS property for animations`
                    );
                  const i = t.collectedStyles[t.currentQuerySelector],
                    o = i[n];
                  let a = !0;
                  o &&
                    (r != s &&
                      r >= o.startTime &&
                      s <= o.endTime &&
                      (t.errors.push(
                        `The CSS property "${n}" that exists between the times of "${o.startTime}ms" and "${o.endTime}ms" is also being animated in a parallel animation between the times of "${r}ms" and "${s}ms"`
                      ),
                      (a = !1)),
                    (r = o.startTime)),
                    a && (i[n] = { startTime: r, endTime: s }),
                    t.options &&
                      (function (e, t, n) {
                        const s = t.params || {},
                          r = hu(e);
                        r.length &&
                          r.forEach(e => {
                            s.hasOwnProperty(e) ||
                              n.push(
                                `Unable to resolve the local animation param ${e} in the given list of values`
                              );
                          });
                      })(e[n], t.options, t.errors);
                });
            });
        }
        visitKeyframes(e, t) {
          const n = { type: 5, styles: [], options: null };
          if (!t.currentAnimateTimings)
            return t.errors.push('keyframes() must be placed inside of a call to animate()'), n;
          let s = 0;
          const r = [];
          let i = !1,
            o = !1,
            a = 0;
          const l = e.steps.map(e => {
            const n = this._makeStyleAst(e, t);
            let l =
                null != n.offset
                  ? n.offset
                  : (function (e) {
                      if ('string' == typeof e) return null;
                      let t = null;
                      if (Array.isArray(e))
                        e.forEach(e => {
                          if (Pu(e) && e.hasOwnProperty('offset')) {
                            const n = e;
                            (t = parseFloat(n.offset)), delete n.offset;
                          }
                        });
                      else if (Pu(e) && e.hasOwnProperty('offset')) {
                        const n = e;
                        (t = parseFloat(n.offset)), delete n.offset;
                      }
                      return t;
                    })(n.styles),
              u = 0;
            return (
              null != l && (s++, (u = n.offset = l)),
              (o = o || u < 0 || u > 1),
              (i = i || u < a),
              (a = u),
              r.push(u),
              n
            );
          });
          o && t.errors.push('Please ensure that all keyframe offsets are between 0 and 1'),
            i && t.errors.push('Please ensure that all keyframe offsets are in order');
          const u = e.steps.length;
          let c = 0;
          s > 0 && s < u
            ? t.errors.push('Not all style() steps within the declared keyframes() contain offsets')
            : 0 == s && (c = 1 / (u - 1));
          const h = u - 1,
            d = t.currentTime,
            p = t.currentAnimateTimings,
            f = p.duration;
          return (
            l.forEach((e, s) => {
              const i = c > 0 ? (s == h ? 1 : c * s) : r[s],
                o = i * f;
              (t.currentTime = d + p.delay + o),
                (p.duration = o),
                this._validateStyleAst(e, t),
                (e.offset = i),
                n.styles.push(e);
            }),
            n
          );
        }
        visitReference(e, t) {
          return { type: 8, animation: _u(this, uu(e.animation), t), options: Au(e.options) };
        }
        visitAnimateChild(e, t) {
          return t.depCount++, { type: 9, options: Au(e.options) };
        }
        visitAnimateRef(e, t) {
          return {
            type: 10,
            animation: this.visitReference(e.animation, t),
            options: Au(e.options),
          };
        }
        visitQuery(e, t) {
          const n = t.currentQuerySelector,
            s = e.options || {};
          t.queryCount++, (t.currentQuery = e);
          const [r, i] = (function (e) {
            const t = !!e.split(/\s*,\s*/).find(e => ':self' == e);
            return (
              t && (e = e.replace(Tu, '')),
              [
                (e = e
                  .replace(/@\*/g, '.ng-trigger')
                  .replace(/@\w+/g, e => '.ng-trigger-' + e.substr(1))
                  .replace(/:animating/g, '.ng-animating')),
                t,
              ]
            );
          })(e.selector);
          (t.currentQuerySelector = n.length ? n + ' ' + r : r),
            jl(t.collectedStyles, t.currentQuerySelector, {});
          const o = _u(this, uu(e.animation), t);
          return (
            (t.currentQuery = null),
            (t.currentQuerySelector = n),
            {
              type: 11,
              selector: r,
              limit: s.limit || 0,
              optional: !!s.optional,
              includeSelf: i,
              animation: o,
              originalSelector: e.selector,
              options: Au(e.options),
            }
          );
        }
        visitStagger(e, t) {
          t.currentQuery || t.errors.push('stagger() can only be used inside of query()');
          const n =
            'full' === e.timings
              ? { duration: 0, delay: 0, easing: 'full' }
              : nu(e.timings, t.errors, !0);
          return { type: 12, animation: _u(this, uu(e.animation), t), timings: n, options: null };
        }
      }
      class Cu {
        constructor(e) {
          (this.errors = e),
            (this.queryCount = 0),
            (this.depCount = 0),
            (this.currentTransition = null),
            (this.currentQuery = null),
            (this.currentQuerySelector = null),
            (this.currentAnimateTimings = null),
            (this.currentTime = 0),
            (this.collectedStyles = {}),
            (this.options = null);
        }
      }
      function Pu(e) {
        return !Array.isArray(e) && 'object' == typeof e;
      }
      function Au(e) {
        var t;
        return e ? (e = su(e)).params && (e.params = (t = e.params) ? su(t) : null) : (e = {}), e;
      }
      function Lu(e, t, n) {
        return { duration: e, delay: t, easing: n };
      }
      function Nu(e, t, n, s, r, i, o = null, a = !1) {
        return {
          type: 1,
          element: e,
          keyframes: t,
          preStyleProps: n,
          postStyleProps: s,
          duration: r,
          delay: i,
          totalTime: r + i,
          easing: o,
          subTimeline: a,
        };
      }
      class Iu {
        constructor() {
          this._map = new Map();
        }
        consume(e) {
          let t = this._map.get(e);
          return t ? this._map.delete(e) : (t = []), t;
        }
        append(e, t) {
          let n = this._map.get(e);
          n || this._map.set(e, (n = [])), n.push(...t);
        }
        has(e) {
          return this._map.has(e);
        }
        clear() {
          this._map.clear();
        }
      }
      const Du = new RegExp(':enter', 'g'),
        Fu = new RegExp(':leave', 'g');
      function Mu(e, t, n, s, r, i = {}, o = {}, a, l, u = []) {
        return new Ou().buildKeyframes(e, t, n, s, r, i, o, a, l, u);
      }
      class Ou {
        buildKeyframes(e, t, n, s, r, i, o, a, l, u = []) {
          l = l || new Iu();
          const c = new Vu(e, t, l, s, r, u, []);
          (c.options = a), c.currentTimeline.setStyles([i], null, c.errors, a), _u(this, n, c);
          const h = c.timelines.filter(e => e.containsAnimation());
          if (h.length && Object.keys(o).length) {
            const e = h[h.length - 1];
            e.allowOnlyTimelineStyles() || e.setStyles([o], null, c.errors, a);
          }
          return h.length ? h.map(e => e.buildKeyframes()) : [Nu(t, [], [], [], 0, 0, '', !1)];
        }
        visitTrigger(e, t) {}
        visitState(e, t) {}
        visitTransition(e, t) {}
        visitAnimateChild(e, t) {
          const n = t.subInstructions.consume(t.element);
          if (n) {
            const s = t.createSubContext(e.options),
              r = t.currentTimeline.currentTime,
              i = this._visitSubInstructions(n, s, s.options);
            r != i && t.transformIntoNewTimeline(i);
          }
          t.previousNode = e;
        }
        visitAnimateRef(e, t) {
          const n = t.createSubContext(e.options);
          n.transformIntoNewTimeline(),
            this.visitReference(e.animation, n),
            t.transformIntoNewTimeline(n.currentTimeline.currentTime),
            (t.previousNode = e);
        }
        _visitSubInstructions(e, t, n) {
          let s = t.currentTimeline.currentTime;
          const r = null != n.duration ? eu(n.duration) : null,
            i = null != n.delay ? eu(n.delay) : null;
          return (
            0 !== r &&
              e.forEach(e => {
                const n = t.appendInstructionToTimeline(e, r, i);
                s = Math.max(s, n.duration + n.delay);
              }),
            s
          );
        }
        visitReference(e, t) {
          t.updateOptions(e.options, !0), _u(this, e.animation, t), (t.previousNode = e);
        }
        visitSequence(e, t) {
          const n = t.subContextCount;
          let s = t;
          const r = e.options;
          if (
            r &&
            (r.params || r.delay) &&
            ((s = t.createSubContext(r)), s.transformIntoNewTimeline(), null != r.delay)
          ) {
            6 == s.previousNode.type &&
              (s.currentTimeline.snapshotCurrentStyles(), (s.previousNode = Ru));
            const e = eu(r.delay);
            s.delayNextStep(e);
          }
          e.steps.length &&
            (e.steps.forEach(e => _u(this, e, s)),
            s.currentTimeline.applyStylesToKeyframe(),
            s.subContextCount > n && s.transformIntoNewTimeline()),
            (t.previousNode = e);
        }
        visitGroup(e, t) {
          const n = [];
          let s = t.currentTimeline.currentTime;
          const r = e.options && e.options.delay ? eu(e.options.delay) : 0;
          e.steps.forEach(i => {
            const o = t.createSubContext(e.options);
            r && o.delayNextStep(r),
              _u(this, i, o),
              (s = Math.max(s, o.currentTimeline.currentTime)),
              n.push(o.currentTimeline);
          }),
            n.forEach(e => t.currentTimeline.mergeTimelineCollectedStyles(e)),
            t.transformIntoNewTimeline(s),
            (t.previousNode = e);
        }
        _visitTiming(e, t) {
          if (e.dynamic) {
            const n = e.strValue;
            return nu(t.params ? du(n, t.params, t.errors) : n, t.errors);
          }
          return { duration: e.duration, delay: e.delay, easing: e.easing };
        }
        visitAnimate(e, t) {
          const n = (t.currentAnimateTimings = this._visitTiming(e.timings, t)),
            s = t.currentTimeline;
          n.delay && (t.incrementTime(n.delay), s.snapshotCurrentStyles());
          const r = e.style;
          5 == r.type
            ? this.visitKeyframes(r, t)
            : (t.incrementTime(n.duration), this.visitStyle(r, t), s.applyStylesToKeyframe()),
            (t.currentAnimateTimings = null),
            (t.previousNode = e);
        }
        visitStyle(e, t) {
          const n = t.currentTimeline,
            s = t.currentAnimateTimings;
          !s && n.getCurrentStyleProperties().length && n.forwardFrame();
          const r = (s && s.easing) || e.easing;
          e.isEmptyStep ? n.applyEmptyStep(r) : n.setStyles(e.styles, r, t.errors, t.options),
            (t.previousNode = e);
        }
        visitKeyframes(e, t) {
          const n = t.currentAnimateTimings,
            s = t.currentTimeline.duration,
            r = n.duration,
            i = t.createSubContext().currentTimeline;
          (i.easing = n.easing),
            e.styles.forEach(e => {
              i.forwardTime((e.offset || 0) * r),
                i.setStyles(e.styles, e.easing, t.errors, t.options),
                i.applyStylesToKeyframe();
            }),
            t.currentTimeline.mergeTimelineCollectedStyles(i),
            t.transformIntoNewTimeline(s + r),
            (t.previousNode = e);
        }
        visitQuery(e, t) {
          const n = t.currentTimeline.currentTime,
            s = e.options || {},
            r = s.delay ? eu(s.delay) : 0;
          r &&
            (6 === t.previousNode.type ||
              (0 == n && t.currentTimeline.getCurrentStyleProperties().length)) &&
            (t.currentTimeline.snapshotCurrentStyles(), (t.previousNode = Ru));
          let i = n;
          const o = t.invokeQuery(
            e.selector,
            e.originalSelector,
            e.limit,
            e.includeSelf,
            !!s.optional,
            t.errors
          );
          t.currentQueryTotal = o.length;
          let a = null;
          o.forEach((n, s) => {
            t.currentQueryIndex = s;
            const o = t.createSubContext(e.options, n);
            r && o.delayNextStep(r),
              n === t.element && (a = o.currentTimeline),
              _u(this, e.animation, o),
              o.currentTimeline.applyStylesToKeyframe(),
              (i = Math.max(i, o.currentTimeline.currentTime));
          }),
            (t.currentQueryIndex = 0),
            (t.currentQueryTotal = 0),
            t.transformIntoNewTimeline(i),
            a &&
              (t.currentTimeline.mergeTimelineCollectedStyles(a),
              t.currentTimeline.snapshotCurrentStyles()),
            (t.previousNode = e);
        }
        visitStagger(e, t) {
          const n = t.parentContext,
            s = t.currentTimeline,
            r = e.timings,
            i = Math.abs(r.duration),
            o = i * (t.currentQueryTotal - 1);
          let a = i * t.currentQueryIndex;
          switch (r.duration < 0 ? 'reverse' : r.easing) {
            case 'reverse':
              a = o - a;
              break;
            case 'full':
              a = n.currentStaggerTime;
          }
          const l = t.currentTimeline;
          a && l.delayNextStep(a);
          const u = l.currentTime;
          _u(this, e.animation, t),
            (t.previousNode = e),
            (n.currentStaggerTime =
              s.currentTime - u + (s.startTime - n.currentTimeline.startTime));
        }
      }
      const Ru = {};
      class Vu {
        constructor(e, t, n, s, r, i, o, a) {
          (this._driver = e),
            (this.element = t),
            (this.subInstructions = n),
            (this._enterClassName = s),
            (this._leaveClassName = r),
            (this.errors = i),
            (this.timelines = o),
            (this.parentContext = null),
            (this.currentAnimateTimings = null),
            (this.previousNode = Ru),
            (this.subContextCount = 0),
            (this.options = {}),
            (this.currentQueryIndex = 0),
            (this.currentQueryTotal = 0),
            (this.currentStaggerTime = 0),
            (this.currentTimeline = a || new ju(this._driver, t, 0)),
            o.push(this.currentTimeline);
        }
        get params() {
          return this.options.params;
        }
        updateOptions(e, t) {
          if (!e) return;
          const n = e;
          let s = this.options;
          null != n.duration && (s.duration = eu(n.duration)),
            null != n.delay && (s.delay = eu(n.delay));
          const r = n.params;
          if (r) {
            let e = s.params;
            e || (e = this.options.params = {}),
              Object.keys(r).forEach(n => {
                (t && e.hasOwnProperty(n)) || (e[n] = du(r[n], e, this.errors));
              });
          }
        }
        _copyOptions() {
          const e = {};
          if (this.options) {
            const t = this.options.params;
            if (t) {
              const n = (e.params = {});
              Object.keys(t).forEach(e => {
                n[e] = t[e];
              });
            }
          }
          return e;
        }
        createSubContext(e = null, t, n) {
          const s = t || this.element,
            r = new Vu(
              this._driver,
              s,
              this.subInstructions,
              this._enterClassName,
              this._leaveClassName,
              this.errors,
              this.timelines,
              this.currentTimeline.fork(s, n || 0)
            );
          return (
            (r.previousNode = this.previousNode),
            (r.currentAnimateTimings = this.currentAnimateTimings),
            (r.options = this._copyOptions()),
            r.updateOptions(e),
            (r.currentQueryIndex = this.currentQueryIndex),
            (r.currentQueryTotal = this.currentQueryTotal),
            (r.parentContext = this),
            this.subContextCount++,
            r
          );
        }
        transformIntoNewTimeline(e) {
          return (
            (this.previousNode = Ru),
            (this.currentTimeline = this.currentTimeline.fork(this.element, e)),
            this.timelines.push(this.currentTimeline),
            this.currentTimeline
          );
        }
        appendInstructionToTimeline(e, t, n) {
          const s = {
              duration: null != t ? t : e.duration,
              delay: this.currentTimeline.currentTime + (null != n ? n : 0) + e.delay,
              easing: '',
            },
            r = new Hu(
              this._driver,
              e.element,
              e.keyframes,
              e.preStyleProps,
              e.postStyleProps,
              s,
              e.stretchStartingKeyframe
            );
          return this.timelines.push(r), s;
        }
        incrementTime(e) {
          this.currentTimeline.forwardTime(this.currentTimeline.duration + e);
        }
        delayNextStep(e) {
          e > 0 && this.currentTimeline.delayNextStep(e);
        }
        invokeQuery(e, t, n, s, r, i) {
          let o = [];
          if ((s && o.push(this.element), e.length > 0)) {
            e = (e = e.replace(Du, '.' + this._enterClassName)).replace(
              Fu,
              '.' + this._leaveClassName
            );
            let t = this._driver.query(this.element, e, 1 != n);
            0 !== n && (t = n < 0 ? t.slice(t.length + n, t.length) : t.slice(0, n)), o.push(...t);
          }
          return (
            r ||
              0 != o.length ||
              i.push(
                `\`query("${t}")\` returned zero elements. (Use \`query("${t}", { optional: true })\` if you wish to allow this.)`
              ),
            o
          );
        }
      }
      class ju {
        constructor(e, t, n, s) {
          (this._driver = e),
            (this.element = t),
            (this.startTime = n),
            (this._elementTimelineStylesLookup = s),
            (this.duration = 0),
            (this._previousKeyframe = {}),
            (this._currentKeyframe = {}),
            (this._keyframes = new Map()),
            (this._styleSummary = {}),
            (this._pendingStyles = {}),
            (this._backFill = {}),
            (this._currentEmptyStepKeyframe = null),
            this._elementTimelineStylesLookup || (this._elementTimelineStylesLookup = new Map()),
            (this._localTimelineStyles = Object.create(this._backFill, {})),
            (this._globalTimelineStyles = this._elementTimelineStylesLookup.get(t)),
            this._globalTimelineStyles ||
              ((this._globalTimelineStyles = this._localTimelineStyles),
              this._elementTimelineStylesLookup.set(t, this._localTimelineStyles)),
            this._loadKeyframe();
        }
        containsAnimation() {
          switch (this._keyframes.size) {
            case 0:
              return !1;
            case 1:
              return this.getCurrentStyleProperties().length > 0;
            default:
              return !0;
          }
        }
        getCurrentStyleProperties() {
          return Object.keys(this._currentKeyframe);
        }
        get currentTime() {
          return this.startTime + this.duration;
        }
        delayNextStep(e) {
          const t = 1 == this._keyframes.size && Object.keys(this._pendingStyles).length;
          this.duration || t
            ? (this.forwardTime(this.currentTime + e), t && this.snapshotCurrentStyles())
            : (this.startTime += e);
        }
        fork(e, t) {
          return (
            this.applyStylesToKeyframe(),
            new ju(this._driver, e, t || this.currentTime, this._elementTimelineStylesLookup)
          );
        }
        _loadKeyframe() {
          this._currentKeyframe && (this._previousKeyframe = this._currentKeyframe),
            (this._currentKeyframe = this._keyframes.get(this.duration)),
            this._currentKeyframe ||
              ((this._currentKeyframe = Object.create(this._backFill, {})),
              this._keyframes.set(this.duration, this._currentKeyframe));
        }
        forwardFrame() {
          (this.duration += 1), this._loadKeyframe();
        }
        forwardTime(e) {
          this.applyStylesToKeyframe(), (this.duration = e), this._loadKeyframe();
        }
        _updateStyle(e, t) {
          (this._localTimelineStyles[e] = t),
            (this._globalTimelineStyles[e] = t),
            (this._styleSummary[e] = { time: this.currentTime, value: t });
        }
        allowOnlyTimelineStyles() {
          return this._currentEmptyStepKeyframe !== this._currentKeyframe;
        }
        applyEmptyStep(e) {
          e && (this._previousKeyframe.easing = e),
            Object.keys(this._globalTimelineStyles).forEach(e => {
              (this._backFill[e] = this._globalTimelineStyles[e] || '*'),
                (this._currentKeyframe[e] = '*');
            }),
            (this._currentEmptyStepKeyframe = this._currentKeyframe);
        }
        setStyles(e, t, n, s) {
          t && (this._previousKeyframe.easing = t);
          const r = (s && s.params) || {},
            i = (function (e, t) {
              const n = {};
              let s;
              return (
                e.forEach(e => {
                  '*' === e
                    ? ((s = s || Object.keys(t)),
                      s.forEach(e => {
                        n[e] = '*';
                      }))
                    : ru(e, !1, n);
                }),
                n
              );
            })(e, this._globalTimelineStyles);
          Object.keys(i).forEach(e => {
            const t = du(i[e], r, n);
            (this._pendingStyles[e] = t),
              this._localTimelineStyles.hasOwnProperty(e) ||
                (this._backFill[e] = this._globalTimelineStyles.hasOwnProperty(e)
                  ? this._globalTimelineStyles[e]
                  : '*'),
              this._updateStyle(e, t);
          });
        }
        applyStylesToKeyframe() {
          const e = this._pendingStyles,
            t = Object.keys(e);
          0 != t.length &&
            ((this._pendingStyles = {}),
            t.forEach(t => {
              this._currentKeyframe[t] = e[t];
            }),
            Object.keys(this._localTimelineStyles).forEach(e => {
              this._currentKeyframe.hasOwnProperty(e) ||
                (this._currentKeyframe[e] = this._localTimelineStyles[e]);
            }));
        }
        snapshotCurrentStyles() {
          Object.keys(this._localTimelineStyles).forEach(e => {
            const t = this._localTimelineStyles[e];
            (this._pendingStyles[e] = t), this._updateStyle(e, t);
          });
        }
        getFinalKeyframe() {
          return this._keyframes.get(this.duration);
        }
        get properties() {
          const e = [];
          for (let t in this._currentKeyframe) e.push(t);
          return e;
        }
        mergeTimelineCollectedStyles(e) {
          Object.keys(e._styleSummary).forEach(t => {
            const n = this._styleSummary[t],
              s = e._styleSummary[t];
            (!n || s.time > n.time) && this._updateStyle(t, s.value);
          });
        }
        buildKeyframes() {
          this.applyStylesToKeyframe();
          const e = new Set(),
            t = new Set(),
            n = 1 === this._keyframes.size && 0 === this.duration;
          let s = [];
          this._keyframes.forEach((r, i) => {
            const o = ru(r, !0);
            Object.keys(o).forEach(n => {
              const s = o[n];
              '!' == s ? e.add(n) : '*' == s && t.add(n);
            }),
              n || (o.offset = i / this.duration),
              s.push(o);
          });
          const r = e.size ? pu(e.values()) : [],
            i = t.size ? pu(t.values()) : [];
          if (n) {
            const e = s[0],
              t = su(e);
            (e.offset = 0), (t.offset = 1), (s = [e, t]);
          }
          return Nu(this.element, s, r, i, this.duration, this.startTime, this.easing, !1);
        }
      }
      class Hu extends ju {
        constructor(e, t, n, s, r, i, o = !1) {
          super(e, t, i.delay),
            (this.element = t),
            (this.keyframes = n),
            (this.preStyleProps = s),
            (this.postStyleProps = r),
            (this._stretchStartingKeyframe = o),
            (this.timings = { duration: i.duration, delay: i.delay, easing: i.easing });
        }
        containsAnimation() {
          return this.keyframes.length > 1;
        }
        buildKeyframes() {
          let e = this.keyframes,
            { delay: t, duration: n, easing: s } = this.timings;
          if (this._stretchStartingKeyframe && t) {
            const r = [],
              i = n + t,
              o = t / i,
              a = ru(e[0], !1);
            (a.offset = 0), r.push(a);
            const l = ru(e[0], !1);
            (l.offset = Bu(o)), r.push(l);
            const u = e.length - 1;
            for (let s = 1; s <= u; s++) {
              let o = ru(e[s], !1);
              (o.offset = Bu((t + o.offset * n) / i)), r.push(o);
            }
            (n = i), (t = 0), (s = ''), (e = r);
          }
          return Nu(this.element, e, this.preStyleProps, this.postStyleProps, n, t, s, !0);
        }
      }
      function Bu(e, t = 3) {
        const n = Math.pow(10, t - 1);
        return Math.round(e * n) / n;
      }
      class zu {}
      class qu extends zu {
        normalizePropertyName(e, t) {
          return mu(e);
        }
        normalizeStyleValue(e, t, n, s) {
          let r = '';
          const i = n.toString().trim();
          if ($u[t] && 0 !== n && '0' !== n)
            if ('number' == typeof n) r = 'px';
            else {
              const t = n.match(/^[+-]?[\d\.]+([a-z]*)$/);
              t && 0 == t[1].length && s.push(`Please provide a CSS unit value for ${e}:${n}`);
            }
          return i + r;
        }
      }
      const $u = (() =>
        (function (e) {
          const t = {};
          return e.forEach(e => (t[e] = !0)), t;
        })(
          'width,height,minWidth,minHeight,maxWidth,maxHeight,left,top,bottom,right,fontSize,outlineWidth,outlineOffset,paddingTop,paddingLeft,paddingBottom,paddingRight,marginTop,marginLeft,marginBottom,marginRight,borderRadius,borderWidth,borderTopWidth,borderLeftWidth,borderRightWidth,borderBottomWidth,textIndent,perspective'.split(
            ','
          )
        ))();
      function Uu(e, t, n, s, r, i, o, a, l, u, c, h, d) {
        return {
          type: 0,
          element: e,
          triggerName: t,
          isRemovalTransition: r,
          fromState: n,
          fromStyles: i,
          toState: s,
          toStyles: o,
          timelines: a,
          queriedElements: l,
          preStyleProps: u,
          postStyleProps: c,
          totalTime: h,
          errors: d,
        };
      }
      const Gu = {};
      class Ku {
        constructor(e, t, n) {
          (this._triggerName = e), (this.ast = t), (this._stateStyles = n);
        }
        match(e, t, n, s) {
          return (function (e, t, n, s, r) {
            return e.some(e => e(t, n, s, r));
          })(this.ast.matchers, e, t, n, s);
        }
        buildStyles(e, t, n) {
          const s = this._stateStyles['*'],
            r = this._stateStyles[e],
            i = s ? s.buildStyles(t, n) : {};
          return r ? r.buildStyles(t, n) : i;
        }
        build(e, t, n, s, r, i, o, a, l, u) {
          const c = [],
            h = (this.ast.options && this.ast.options.params) || Gu,
            d = this.buildStyles(n, (o && o.params) || Gu, c),
            p = (a && a.params) || Gu,
            f = this.buildStyles(s, p, c),
            m = new Set(),
            g = new Map(),
            y = new Map(),
            _ = 'void' === s,
            v = { params: Object.assign(Object.assign({}, h), p) },
            b = u ? [] : Mu(e, t, this.ast.animation, r, i, d, f, v, l, c);
          let w = 0;
          if (
            (b.forEach(e => {
              w = Math.max(e.duration + e.delay, w);
            }),
            c.length)
          )
            return Uu(t, this._triggerName, n, s, _, d, f, [], [], g, y, w, c);
          b.forEach(e => {
            const n = e.element,
              s = jl(g, n, {});
            e.preStyleProps.forEach(e => (s[e] = !0));
            const r = jl(y, n, {});
            e.postStyleProps.forEach(e => (r[e] = !0)), n !== t && m.add(n);
          });
          const S = pu(m.values());
          return Uu(t, this._triggerName, n, s, _, d, f, b, S, g, y, w);
        }
      }
      class Wu {
        constructor(e, t) {
          (this.styles = e), (this.defaultParams = t);
        }
        buildStyles(e, t) {
          const n = {},
            s = su(this.defaultParams);
          return (
            Object.keys(e).forEach(t => {
              const n = e[t];
              null != n && (s[t] = n);
            }),
            this.styles.styles.forEach(e => {
              if ('string' != typeof e) {
                const r = e;
                Object.keys(r).forEach(e => {
                  let i = r[e];
                  i.length > 1 && (i = du(i, s, t)), (n[e] = i);
                });
              }
            }),
            n
          );
        }
      }
      class Qu {
        constructor(e, t) {
          (this.name = e),
            (this.ast = t),
            (this.transitionFactories = []),
            (this.states = {}),
            t.states.forEach(e => {
              this.states[e.name] = new Wu(e.style, (e.options && e.options.params) || {});
            }),
            Zu(this.states, 'true', '1'),
            Zu(this.states, 'false', '0'),
            t.transitions.forEach(t => {
              this.transitionFactories.push(new Ku(e, t, this.states));
            }),
            (this.fallbackTransition = new Ku(
              e,
              {
                type: 1,
                animation: { type: 2, steps: [], options: null },
                matchers: [(e, t) => !0],
                options: null,
                queryCount: 0,
                depCount: 0,
              },
              this.states
            ));
        }
        get containsQueries() {
          return this.ast.queryCount > 0;
        }
        matchTransition(e, t, n, s) {
          return this.transitionFactories.find(r => r.match(e, t, n, s)) || null;
        }
        matchStyles(e, t, n) {
          return this.fallbackTransition.buildStyles(e, t, n);
        }
      }
      function Zu(e, t, n) {
        e.hasOwnProperty(t)
          ? e.hasOwnProperty(n) || (e[n] = e[t])
          : e.hasOwnProperty(n) && (e[t] = e[n]);
      }
      const Ju = new Iu();
      class Xu {
        constructor(e, t, n) {
          (this.bodyNode = e),
            (this._driver = t),
            (this._normalizer = n),
            (this._animations = {}),
            (this._playersById = {}),
            (this.players = []);
        }
        register(e, t) {
          const n = [],
            s = xu(this._driver, t, n);
          if (n.length)
            throw new Error(
              `Unable to build the animation due to the following errors: ${n.join('\n')}`
            );
          this._animations[e] = s;
        }
        _buildPlayer(e, t, n) {
          const s = e.element,
            r = Ml(0, this._normalizer, 0, e.keyframes, t, n);
          return this._driver.animate(s, r, e.duration, e.delay, e.easing, [], !0);
        }
        create(e, t, n = {}) {
          const s = [],
            r = this._animations[e];
          let i;
          const o = new Map();
          if (
            (r
              ? ((i = Mu(this._driver, t, r, 'ng-enter', 'ng-leave', {}, {}, n, Ju, s)),
                i.forEach(e => {
                  const t = jl(o, e.element, {});
                  e.postStyleProps.forEach(e => (t[e] = null));
                }))
              : (s.push("The requested animation doesn't exist or has already been destroyed"),
                (i = [])),
            s.length)
          )
            throw new Error(
              `Unable to create the animation due to the following errors: ${s.join('\n')}`
            );
          o.forEach((e, t) => {
            Object.keys(e).forEach(n => {
              e[n] = this._driver.computeStyle(t, n, '*');
            });
          });
          const a = Fl(
            i.map(e => {
              const t = o.get(e.element);
              return this._buildPlayer(e, {}, t);
            })
          );
          return (
            (this._playersById[e] = a), a.onDestroy(() => this.destroy(e)), this.players.push(a), a
          );
        }
        destroy(e) {
          const t = this._getPlayer(e);
          t.destroy(), delete this._playersById[e];
          const n = this.players.indexOf(t);
          n >= 0 && this.players.splice(n, 1);
        }
        _getPlayer(e) {
          const t = this._playersById[e];
          if (!t) throw new Error(`Unable to find the timeline player referenced by ${e}`);
          return t;
        }
        listen(e, t, n, s) {
          const r = Vl(t, '', '', '');
          return Ol(this._getPlayer(e), n, r, s), () => {};
        }
        command(e, t, n, s) {
          if ('register' == n) return void this.register(e, s[0]);
          if ('create' == n) return void this.create(e, t, s[0] || {});
          const r = this._getPlayer(e);
          switch (n) {
            case 'play':
              r.play();
              break;
            case 'pause':
              r.pause();
              break;
            case 'reset':
              r.reset();
              break;
            case 'restart':
              r.restart();
              break;
            case 'finish':
              r.finish();
              break;
            case 'init':
              r.init();
              break;
            case 'setPosition':
              r.setPosition(parseFloat(s[0]));
              break;
            case 'destroy':
              this.destroy(e);
          }
        }
      }
      const Yu = [],
        ec = {
          namespaceId: '',
          setForRemoval: !1,
          setForMove: !1,
          hasAnimation: !1,
          removedBeforeQueried: !1,
        },
        tc = {
          namespaceId: '',
          setForMove: !1,
          setForRemoval: !1,
          hasAnimation: !1,
          removedBeforeQueried: !0,
        };
      class nc {
        constructor(e, t = '') {
          this.namespaceId = t;
          const n = e && e.hasOwnProperty('value');
          if (((this.value = null != (s = n ? e.value : e) ? s : null), n)) {
            const t = su(e);
            delete t.value, (this.options = t);
          } else this.options = {};
          var s;
          this.options.params || (this.options.params = {});
        }
        get params() {
          return this.options.params;
        }
        absorbOptions(e) {
          const t = e.params;
          if (t) {
            const e = this.options.params;
            Object.keys(t).forEach(n => {
              null == e[n] && (e[n] = t[n]);
            });
          }
        }
      }
      const sc = new nc('void');
      class rc {
        constructor(e, t, n) {
          (this.id = e),
            (this.hostElement = t),
            (this._engine = n),
            (this.players = []),
            (this._triggers = {}),
            (this._queue = []),
            (this._elementListeners = new Map()),
            (this._hostClassName = 'ng-tns-' + e),
            hc(t, this._hostClassName);
        }
        listen(e, t, n, s) {
          if (!this._triggers.hasOwnProperty(t))
            throw new Error(
              `Unable to listen on the animation trigger event "${n}" because the animation trigger "${t}" doesn't exist!`
            );
          if (null == n || 0 == n.length)
            throw new Error(
              `Unable to listen on the animation trigger "${t}" because the provided event is undefined!`
            );
          if ('start' != (r = n) && 'done' != r)
            throw new Error(
              `The provided animation trigger event "${n}" for the animation trigger "${t}" is not supported!`
            );
          var r;
          const i = jl(this._elementListeners, e, []),
            o = { name: t, phase: n, callback: s };
          i.push(o);
          const a = jl(this._engine.statesByElement, e, {});
          return (
            a.hasOwnProperty(t) || (hc(e, 'ng-trigger'), hc(e, 'ng-trigger-' + t), (a[t] = sc)),
            () => {
              this._engine.afterFlush(() => {
                const e = i.indexOf(o);
                e >= 0 && i.splice(e, 1), this._triggers[t] || delete a[t];
              });
            }
          );
        }
        register(e, t) {
          return !this._triggers[e] && ((this._triggers[e] = t), !0);
        }
        _getTrigger(e) {
          const t = this._triggers[e];
          if (!t) throw new Error(`The provided animation trigger "${e}" has not been registered!`);
          return t;
        }
        trigger(e, t, n, s = !0) {
          const r = this._getTrigger(t),
            i = new oc(this.id, t, e);
          let o = this._engine.statesByElement.get(e);
          o ||
            (hc(e, 'ng-trigger'),
            hc(e, 'ng-trigger-' + t),
            this._engine.statesByElement.set(e, (o = {})));
          let a = o[t];
          const l = new nc(n, this.id);
          if (
            (!(n && n.hasOwnProperty('value')) && a && l.absorbOptions(a.options),
            (o[t] = l),
            a || (a = sc),
            'void' !== l.value && a.value === l.value)
          ) {
            if (
              !(function (e, t) {
                const n = Object.keys(e),
                  s = Object.keys(t);
                if (n.length != s.length) return !1;
                for (let r = 0; r < n.length; r++) {
                  const s = n[r];
                  if (!t.hasOwnProperty(s) || e[s] !== t[s]) return !1;
                }
                return !0;
              })(a.params, l.params)
            ) {
              const t = [],
                n = r.matchStyles(a.value, a.params, t),
                s = r.matchStyles(l.value, l.params, t);
              t.length
                ? this._engine.reportError(t)
                : this._engine.afterFlush(() => {
                    lu(e, n), au(e, s);
                  });
            }
            return;
          }
          const u = jl(this._engine.playersByElement, e, []);
          u.forEach(e => {
            e.namespaceId == this.id && e.triggerName == t && e.queued && e.destroy();
          });
          let c = r.matchTransition(a.value, l.value, e, l.params),
            h = !1;
          if (!c) {
            if (!s) return;
            (c = r.fallbackTransition), (h = !0);
          }
          return (
            this._engine.totalQueuedPlayers++,
            this._queue.push({
              element: e,
              triggerName: t,
              transition: c,
              fromState: a,
              toState: l,
              player: i,
              isFallbackTransition: h,
            }),
            h ||
              (hc(e, 'ng-animate-queued'),
              i.onStart(() => {
                dc(e, 'ng-animate-queued');
              })),
            i.onDone(() => {
              let t = this.players.indexOf(i);
              t >= 0 && this.players.splice(t, 1);
              const n = this._engine.playersByElement.get(e);
              if (n) {
                let e = n.indexOf(i);
                e >= 0 && n.splice(e, 1);
              }
            }),
            this.players.push(i),
            u.push(i),
            i
          );
        }
        deregister(e) {
          delete this._triggers[e],
            this._engine.statesByElement.forEach((t, n) => {
              delete t[e];
            }),
            this._elementListeners.forEach((t, n) => {
              this._elementListeners.set(
                n,
                t.filter(t => t.name != e)
              );
            });
        }
        clearElementCache(e) {
          this._engine.statesByElement.delete(e), this._elementListeners.delete(e);
          const t = this._engine.playersByElement.get(e);
          t && (t.forEach(e => e.destroy()), this._engine.playersByElement.delete(e));
        }
        _signalRemovalForInnerTriggers(e, t) {
          const n = this._engine.driver.query(e, '.ng-trigger', !0);
          n.forEach(e => {
            if (e.__ng_removed) return;
            const n = this._engine.fetchNamespacesByElement(e);
            n.size
              ? n.forEach(n => n.triggerLeaveAnimation(e, t, !1, !0))
              : this.clearElementCache(e);
          }),
            this._engine.afterFlushAnimationsDone(() => n.forEach(e => this.clearElementCache(e)));
        }
        triggerLeaveAnimation(e, t, n, s) {
          const r = this._engine.statesByElement.get(e);
          if (r) {
            const i = [];
            if (
              (Object.keys(r).forEach(t => {
                if (this._triggers[t]) {
                  const n = this.trigger(e, t, 'void', s);
                  n && i.push(n);
                }
              }),
              i.length)
            )
              return (
                this._engine.markElementAsRemoved(this.id, e, !0, t),
                n && Fl(i).onDone(() => this._engine.processLeaveNode(e)),
                !0
              );
          }
          return !1;
        }
        prepareLeaveAnimationListeners(e) {
          const t = this._elementListeners.get(e);
          if (t) {
            const n = new Set();
            t.forEach(t => {
              const s = t.name;
              if (n.has(s)) return;
              n.add(s);
              const r = this._triggers[s].fallbackTransition,
                i = this._engine.statesByElement.get(e)[s] || sc,
                o = new nc('void'),
                a = new oc(this.id, s, e);
              this._engine.totalQueuedPlayers++,
                this._queue.push({
                  element: e,
                  triggerName: s,
                  transition: r,
                  fromState: i,
                  toState: o,
                  player: a,
                  isFallbackTransition: !0,
                });
            });
          }
        }
        removeNode(e, t) {
          const n = this._engine;
          if (
            (e.childElementCount && this._signalRemovalForInnerTriggers(e, t),
            this.triggerLeaveAnimation(e, t, !0))
          )
            return;
          let s = !1;
          if (n.totalAnimations) {
            const t = n.players.length ? n.playersByQueriedElement.get(e) : [];
            if (t && t.length) s = !0;
            else {
              let t = e;
              for (; (t = t.parentNode); )
                if (n.statesByElement.get(t)) {
                  s = !0;
                  break;
                }
            }
          }
          if ((this.prepareLeaveAnimationListeners(e), s))
            n.markElementAsRemoved(this.id, e, !1, t);
          else {
            const s = e.__ng_removed;
            (s && s !== ec) ||
              (n.afterFlush(() => this.clearElementCache(e)),
              n.destroyInnerAnimations(e),
              n._onRemovalComplete(e, t));
          }
        }
        insertNode(e, t) {
          hc(e, this._hostClassName);
        }
        drainQueuedTransitions(e) {
          const t = [];
          return (
            this._queue.forEach(n => {
              const s = n.player;
              if (s.destroyed) return;
              const r = n.element,
                i = this._elementListeners.get(r);
              i &&
                i.forEach(t => {
                  if (t.name == n.triggerName) {
                    const s = Vl(r, n.triggerName, n.fromState.value, n.toState.value);
                    (s._data = e), Ol(n.player, t.phase, s, t.callback);
                  }
                }),
                s.markedForDestroy
                  ? this._engine.afterFlush(() => {
                      s.destroy();
                    })
                  : t.push(n);
            }),
            (this._queue = []),
            t.sort((e, t) => {
              const n = e.transition.ast.depCount,
                s = t.transition.ast.depCount;
              return 0 == n || 0 == s
                ? n - s
                : this._engine.driver.containsElement(e.element, t.element)
                ? 1
                : -1;
            })
          );
        }
        destroy(e) {
          this.players.forEach(e => e.destroy()),
            this._signalRemovalForInnerTriggers(this.hostElement, e);
        }
        elementContainsData(e) {
          let t = !1;
          return (
            this._elementListeners.has(e) && (t = !0),
            (t = !!this._queue.find(t => t.element === e) || t),
            t
          );
        }
      }
      class ic {
        constructor(e, t, n) {
          (this.bodyNode = e),
            (this.driver = t),
            (this._normalizer = n),
            (this.players = []),
            (this.newHostElements = new Map()),
            (this.playersByElement = new Map()),
            (this.playersByQueriedElement = new Map()),
            (this.statesByElement = new Map()),
            (this.disabledNodes = new Set()),
            (this.totalAnimations = 0),
            (this.totalQueuedPlayers = 0),
            (this._namespaceLookup = {}),
            (this._namespaceList = []),
            (this._flushFns = []),
            (this._whenQuietFns = []),
            (this.namespacesByHostElement = new Map()),
            (this.collectedEnterElements = []),
            (this.collectedLeaveElements = []),
            (this.onRemovalComplete = (e, t) => {});
        }
        _onRemovalComplete(e, t) {
          this.onRemovalComplete(e, t);
        }
        get queuedPlayers() {
          const e = [];
          return (
            this._namespaceList.forEach(t => {
              t.players.forEach(t => {
                t.queued && e.push(t);
              });
            }),
            e
          );
        }
        createNamespace(e, t) {
          const n = new rc(e, t, this);
          return (
            t.parentNode
              ? this._balanceNamespaceList(n, t)
              : (this.newHostElements.set(t, n), this.collectEnterElement(t)),
            (this._namespaceLookup[e] = n)
          );
        }
        _balanceNamespaceList(e, t) {
          const n = this._namespaceList.length - 1;
          if (n >= 0) {
            let s = !1;
            for (let r = n; r >= 0; r--)
              if (this.driver.containsElement(this._namespaceList[r].hostElement, t)) {
                this._namespaceList.splice(r + 1, 0, e), (s = !0);
                break;
              }
            s || this._namespaceList.splice(0, 0, e);
          } else this._namespaceList.push(e);
          return this.namespacesByHostElement.set(t, e), e;
        }
        register(e, t) {
          let n = this._namespaceLookup[e];
          return n || (n = this.createNamespace(e, t)), n;
        }
        registerTrigger(e, t, n) {
          let s = this._namespaceLookup[e];
          s && s.register(t, n) && this.totalAnimations++;
        }
        destroy(e, t) {
          if (!e) return;
          const n = this._fetchNamespace(e);
          this.afterFlush(() => {
            this.namespacesByHostElement.delete(n.hostElement), delete this._namespaceLookup[e];
            const t = this._namespaceList.indexOf(n);
            t >= 0 && this._namespaceList.splice(t, 1);
          }),
            this.afterFlushAnimationsDone(() => n.destroy(t));
        }
        _fetchNamespace(e) {
          return this._namespaceLookup[e];
        }
        fetchNamespacesByElement(e) {
          const t = new Set(),
            n = this.statesByElement.get(e);
          if (n) {
            const e = Object.keys(n);
            for (let s = 0; s < e.length; s++) {
              const r = n[e[s]].namespaceId;
              if (r) {
                const e = this._fetchNamespace(r);
                e && t.add(e);
              }
            }
          }
          return t;
        }
        trigger(e, t, n, s) {
          if (ac(t)) {
            const r = this._fetchNamespace(e);
            if (r) return r.trigger(t, n, s), !0;
          }
          return !1;
        }
        insertNode(e, t, n, s) {
          if (!ac(t)) return;
          const r = t.__ng_removed;
          if (r && r.setForRemoval) {
            (r.setForRemoval = !1), (r.setForMove = !0);
            const e = this.collectedLeaveElements.indexOf(t);
            e >= 0 && this.collectedLeaveElements.splice(e, 1);
          }
          if (e) {
            const s = this._fetchNamespace(e);
            s && s.insertNode(t, n);
          }
          s && this.collectEnterElement(t);
        }
        collectEnterElement(e) {
          this.collectedEnterElements.push(e);
        }
        markElementAsDisabled(e, t) {
          t
            ? this.disabledNodes.has(e) || (this.disabledNodes.add(e), hc(e, 'ng-animate-disabled'))
            : this.disabledNodes.has(e) &&
              (this.disabledNodes.delete(e), dc(e, 'ng-animate-disabled'));
        }
        removeNode(e, t, n, s) {
          if (ac(t)) {
            const r = e ? this._fetchNamespace(e) : null;
            if ((r ? r.removeNode(t, s) : this.markElementAsRemoved(e, t, !1, s), n)) {
              const n = this.namespacesByHostElement.get(t);
              n && n.id !== e && n.removeNode(t, s);
            }
          } else this._onRemovalComplete(t, s);
        }
        markElementAsRemoved(e, t, n, s) {
          this.collectedLeaveElements.push(t),
            (t.__ng_removed = {
              namespaceId: e,
              setForRemoval: s,
              hasAnimation: n,
              removedBeforeQueried: !1,
            });
        }
        listen(e, t, n, s, r) {
          return ac(t) ? this._fetchNamespace(e).listen(t, n, s, r) : () => {};
        }
        _buildInstruction(e, t, n, s, r) {
          return e.transition.build(
            this.driver,
            e.element,
            e.fromState.value,
            e.toState.value,
            n,
            s,
            e.fromState.options,
            e.toState.options,
            t,
            r
          );
        }
        destroyInnerAnimations(e) {
          let t = this.driver.query(e, '.ng-trigger', !0);
          t.forEach(e => this.destroyActiveAnimationsForElement(e)),
            0 != this.playersByQueriedElement.size &&
              ((t = this.driver.query(e, '.ng-animating', !0)),
              t.forEach(e => this.finishActiveQueriedAnimationOnElement(e)));
        }
        destroyActiveAnimationsForElement(e) {
          const t = this.playersByElement.get(e);
          t &&
            t.forEach(e => {
              e.queued ? (e.markedForDestroy = !0) : e.destroy();
            });
        }
        finishActiveQueriedAnimationOnElement(e) {
          const t = this.playersByQueriedElement.get(e);
          t && t.forEach(e => e.finish());
        }
        whenRenderingDone() {
          return new Promise(e => {
            if (this.players.length) return Fl(this.players).onDone(() => e());
            e();
          });
        }
        processLeaveNode(e) {
          const t = e.__ng_removed;
          if (t && t.setForRemoval) {
            if (((e.__ng_removed = ec), t.namespaceId)) {
              this.destroyInnerAnimations(e);
              const n = this._fetchNamespace(t.namespaceId);
              n && n.clearElementCache(e);
            }
            this._onRemovalComplete(e, t.setForRemoval);
          }
          this.driver.matchesElement(e, '.ng-animate-disabled') &&
            this.markElementAsDisabled(e, !1),
            this.driver.query(e, '.ng-animate-disabled', !0).forEach(e => {
              this.markElementAsDisabled(e, !1);
            });
        }
        flush(e = -1) {
          let t = [];
          if (
            (this.newHostElements.size &&
              (this.newHostElements.forEach((e, t) => this._balanceNamespaceList(e, t)),
              this.newHostElements.clear()),
            this.totalAnimations && this.collectedEnterElements.length)
          )
            for (let n = 0; n < this.collectedEnterElements.length; n++)
              hc(this.collectedEnterElements[n], 'ng-star-inserted');
          if (
            this._namespaceList.length &&
            (this.totalQueuedPlayers || this.collectedLeaveElements.length)
          ) {
            const n = [];
            try {
              t = this._flushAnimations(n, e);
            } finally {
              for (let e = 0; e < n.length; e++) n[e]();
            }
          } else
            for (let n = 0; n < this.collectedLeaveElements.length; n++)
              this.processLeaveNode(this.collectedLeaveElements[n]);
          if (
            ((this.totalQueuedPlayers = 0),
            (this.collectedEnterElements.length = 0),
            (this.collectedLeaveElements.length = 0),
            this._flushFns.forEach(e => e()),
            (this._flushFns = []),
            this._whenQuietFns.length)
          ) {
            const e = this._whenQuietFns;
            (this._whenQuietFns = []),
              t.length
                ? Fl(t).onDone(() => {
                    e.forEach(e => e());
                  })
                : e.forEach(e => e());
          }
        }
        reportError(e) {
          throw new Error(
            `Unable to process animations due to the following failed trigger transitions\n ${e.join(
              '\n'
            )}`
          );
        }
        _flushAnimations(e, t) {
          const n = new Iu(),
            s = [],
            r = new Map(),
            i = [],
            o = new Map(),
            a = new Map(),
            l = new Map(),
            u = new Set();
          this.disabledNodes.forEach(e => {
            u.add(e);
            const t = this.driver.query(e, '.ng-animate-queued', !0);
            for (let n = 0; n < t.length; n++) u.add(t[n]);
          });
          const c = this.bodyNode,
            h = Array.from(this.statesByElement.keys()),
            d = cc(h, this.collectedEnterElements),
            p = new Map();
          let f = 0;
          d.forEach((e, t) => {
            const n = 'ng-enter' + f++;
            p.set(t, n), e.forEach(e => hc(e, n));
          });
          const m = [],
            g = new Set(),
            y = new Set();
          for (let L = 0; L < this.collectedLeaveElements.length; L++) {
            const e = this.collectedLeaveElements[L],
              t = e.__ng_removed;
            t &&
              t.setForRemoval &&
              (m.push(e),
              g.add(e),
              t.hasAnimation
                ? this.driver.query(e, '.ng-star-inserted', !0).forEach(e => g.add(e))
                : y.add(e));
          }
          const _ = new Map(),
            v = cc(h, Array.from(g));
          v.forEach((e, t) => {
            const n = 'ng-leave' + f++;
            _.set(t, n), e.forEach(e => hc(e, n));
          }),
            e.push(() => {
              d.forEach((e, t) => {
                const n = p.get(t);
                e.forEach(e => dc(e, n));
              }),
                v.forEach((e, t) => {
                  const n = _.get(t);
                  e.forEach(e => dc(e, n));
                }),
                m.forEach(e => {
                  this.processLeaveNode(e);
                });
            });
          const b = [],
            w = [];
          for (let L = this._namespaceList.length - 1; L >= 0; L--)
            this._namespaceList[L].drainQueuedTransitions(t).forEach(e => {
              const t = e.player,
                r = e.element;
              if ((b.push(t), this.collectedEnterElements.length)) {
                const e = r.__ng_removed;
                if (e && e.setForMove) return void t.destroy();
              }
              const u = !c || !this.driver.containsElement(c, r),
                h = _.get(r),
                d = p.get(r),
                f = this._buildInstruction(e, n, d, h, u);
              if (!f.errors || !f.errors.length)
                return u
                  ? (t.onStart(() => lu(r, f.fromStyles)),
                    t.onDestroy(() => au(r, f.toStyles)),
                    void s.push(t))
                  : e.isFallbackTransition
                  ? (t.onStart(() => lu(r, f.fromStyles)),
                    t.onDestroy(() => au(r, f.toStyles)),
                    void s.push(t))
                  : (f.timelines.forEach(e => (e.stretchStartingKeyframe = !0)),
                    n.append(r, f.timelines),
                    i.push({ instruction: f, player: t, element: r }),
                    f.queriedElements.forEach(e => jl(o, e, []).push(t)),
                    f.preStyleProps.forEach((e, t) => {
                      const n = Object.keys(e);
                      if (n.length) {
                        let e = a.get(t);
                        e || a.set(t, (e = new Set())), n.forEach(t => e.add(t));
                      }
                    }),
                    void f.postStyleProps.forEach((e, t) => {
                      const n = Object.keys(e);
                      let s = l.get(t);
                      s || l.set(t, (s = new Set())), n.forEach(e => s.add(e));
                    }));
              w.push(f);
            });
          if (w.length) {
            const e = [];
            w.forEach(t => {
              e.push(`@${t.triggerName} has failed due to:\n`),
                t.errors.forEach(t => e.push(`- ${t}\n`));
            }),
              b.forEach(e => e.destroy()),
              this.reportError(e);
          }
          const S = new Map(),
            E = new Map();
          i.forEach(e => {
            const t = e.element;
            n.has(t) &&
              (E.set(t, t), this._beforeAnimationBuild(e.player.namespaceId, e.instruction, S));
          }),
            s.forEach(e => {
              const t = e.element;
              this._getPreviousPlayers(t, !1, e.namespaceId, e.triggerName, null).forEach(e => {
                jl(S, t, []).push(e), e.destroy();
              });
            });
          const T = m.filter(e => fc(e, a, l)),
            x = new Map();
          uc(x, this.driver, y, l, '*').forEach(e => {
            fc(e, a, l) && T.push(e);
          });
          const k = new Map();
          d.forEach((e, t) => {
            uc(k, this.driver, new Set(e), a, '!');
          }),
            T.forEach(e => {
              const t = x.get(e),
                n = k.get(e);
              x.set(e, Object.assign(Object.assign({}, t), n));
            });
          const C = [],
            P = [],
            A = {};
          i.forEach(e => {
            const { element: t, player: i, instruction: o } = e;
            if (n.has(t)) {
              if (u.has(t))
                return (
                  i.onDestroy(() => au(t, o.toStyles)),
                  (i.disabled = !0),
                  i.overrideTotalTime(o.totalTime),
                  void s.push(i)
                );
              let e = A;
              if (E.size > 1) {
                let n = t;
                const s = [];
                for (; (n = n.parentNode); ) {
                  const t = E.get(n);
                  if (t) {
                    e = t;
                    break;
                  }
                  s.push(n);
                }
                s.forEach(t => E.set(t, e));
              }
              const n = this._buildAnimation(i.namespaceId, o, S, r, k, x);
              if ((i.setRealPlayer(n), e === A)) C.push(i);
              else {
                const t = this.playersByElement.get(e);
                t && t.length && (i.parentPlayer = Fl(t)), s.push(i);
              }
            } else
              lu(t, o.fromStyles),
                i.onDestroy(() => au(t, o.toStyles)),
                P.push(i),
                u.has(t) && s.push(i);
          }),
            P.forEach(e => {
              const t = r.get(e.element);
              if (t && t.length) {
                const n = Fl(t);
                e.setRealPlayer(n);
              }
            }),
            s.forEach(e => {
              e.parentPlayer ? e.syncPlayerEvents(e.parentPlayer) : e.destroy();
            });
          for (let L = 0; L < m.length; L++) {
            const e = m[L],
              t = e.__ng_removed;
            if ((dc(e, 'ng-leave'), t && t.hasAnimation)) continue;
            let n = [];
            if (o.size) {
              let t = o.get(e);
              t && t.length && n.push(...t);
              let s = this.driver.query(e, '.ng-animating', !0);
              for (let e = 0; e < s.length; e++) {
                let t = o.get(s[e]);
                t && t.length && n.push(...t);
              }
            }
            const s = n.filter(e => !e.destroyed);
            s.length ? pc(this, e, s) : this.processLeaveNode(e);
          }
          return (
            (m.length = 0),
            C.forEach(e => {
              this.players.push(e),
                e.onDone(() => {
                  e.destroy();
                  const t = this.players.indexOf(e);
                  this.players.splice(t, 1);
                }),
                e.play();
            }),
            C
          );
        }
        elementContainsData(e, t) {
          let n = !1;
          const s = t.__ng_removed;
          return (
            s && s.setForRemoval && (n = !0),
            this.playersByElement.has(t) && (n = !0),
            this.playersByQueriedElement.has(t) && (n = !0),
            this.statesByElement.has(t) && (n = !0),
            this._fetchNamespace(e).elementContainsData(t) || n
          );
        }
        afterFlush(e) {
          this._flushFns.push(e);
        }
        afterFlushAnimationsDone(e) {
          this._whenQuietFns.push(e);
        }
        _getPreviousPlayers(e, t, n, s, r) {
          let i = [];
          if (t) {
            const t = this.playersByQueriedElement.get(e);
            t && (i = t);
          } else {
            const t = this.playersByElement.get(e);
            if (t) {
              const e = !r || 'void' == r;
              t.forEach(t => {
                t.queued || ((e || t.triggerName == s) && i.push(t));
              });
            }
          }
          return (
            (n || s) &&
              (i = i.filter(e => !((n && n != e.namespaceId) || (s && s != e.triggerName)))),
            i
          );
        }
        _beforeAnimationBuild(e, t, n) {
          const s = t.element,
            r = t.isRemovalTransition ? void 0 : e,
            i = t.isRemovalTransition ? void 0 : t.triggerName;
          for (const o of t.timelines) {
            const e = o.element,
              a = e !== s,
              l = jl(n, e, []);
            this._getPreviousPlayers(e, a, r, i, t.toState).forEach(e => {
              const t = e.getRealPlayer();
              t.beforeDestroy && t.beforeDestroy(), e.destroy(), l.push(e);
            });
          }
          lu(s, t.fromStyles);
        }
        _buildAnimation(e, t, n, s, r, i) {
          const o = t.triggerName,
            a = t.element,
            l = [],
            u = new Set(),
            c = new Set(),
            h = t.timelines.map(t => {
              const h = t.element;
              u.add(h);
              const d = h.__ng_removed;
              if (d && d.removedBeforeQueried) return new Nl(t.duration, t.delay);
              const p = h !== a,
                f = (function (e) {
                  const t = [];
                  return (
                    (function e(t, n) {
                      for (let s = 0; s < t.length; s++) {
                        const r = t[s];
                        r instanceof Il ? e(r.players, n) : n.push(r);
                      }
                    })(e, t),
                    t
                  );
                })((n.get(h) || Yu).map(e => e.getRealPlayer())).filter(
                  e => !!e.element && e.element === h
                ),
                m = r.get(h),
                g = i.get(h),
                y = Ml(0, this._normalizer, 0, t.keyframes, m, g),
                _ = this._buildPlayer(t, y, f);
              if ((t.subTimeline && s && c.add(h), p)) {
                const t = new oc(e, o, h);
                t.setRealPlayer(_), l.push(t);
              }
              return _;
            });
          l.forEach(e => {
            jl(this.playersByQueriedElement, e.element, []).push(e),
              e.onDone(() =>
                (function (e, t, n) {
                  let s;
                  if (e instanceof Map) {
                    if (((s = e.get(t)), s)) {
                      if (s.length) {
                        const e = s.indexOf(n);
                        s.splice(e, 1);
                      }
                      0 == s.length && e.delete(t);
                    }
                  } else if (((s = e[t]), s)) {
                    if (s.length) {
                      const e = s.indexOf(n);
                      s.splice(e, 1);
                    }
                    0 == s.length && delete e[t];
                  }
                  return s;
                })(this.playersByQueriedElement, e.element, e)
              );
          }),
            u.forEach(e => hc(e, 'ng-animating'));
          const d = Fl(h);
          return (
            d.onDestroy(() => {
              u.forEach(e => dc(e, 'ng-animating')), au(a, t.toStyles);
            }),
            c.forEach(e => {
              jl(s, e, []).push(d);
            }),
            d
          );
        }
        _buildPlayer(e, t, n) {
          return t.length > 0
            ? this.driver.animate(e.element, t, e.duration, e.delay, e.easing, n)
            : new Nl(e.duration, e.delay);
        }
      }
      class oc {
        constructor(e, t, n) {
          (this.namespaceId = e),
            (this.triggerName = t),
            (this.element = n),
            (this._player = new Nl()),
            (this._containsRealPlayer = !1),
            (this._queuedCallbacks = {}),
            (this.destroyed = !1),
            (this.markedForDestroy = !1),
            (this.disabled = !1),
            (this.queued = !0),
            (this.totalTime = 0);
        }
        setRealPlayer(e) {
          this._containsRealPlayer ||
            ((this._player = e),
            Object.keys(this._queuedCallbacks).forEach(t => {
              this._queuedCallbacks[t].forEach(n => Ol(e, t, void 0, n));
            }),
            (this._queuedCallbacks = {}),
            (this._containsRealPlayer = !0),
            this.overrideTotalTime(e.totalTime),
            (this.queued = !1));
        }
        getRealPlayer() {
          return this._player;
        }
        overrideTotalTime(e) {
          this.totalTime = e;
        }
        syncPlayerEvents(e) {
          const t = this._player;
          t.triggerCallback && e.onStart(() => t.triggerCallback('start')),
            e.onDone(() => this.finish()),
            e.onDestroy(() => this.destroy());
        }
        _queueEvent(e, t) {
          jl(this._queuedCallbacks, e, []).push(t);
        }
        onDone(e) {
          this.queued && this._queueEvent('done', e), this._player.onDone(e);
        }
        onStart(e) {
          this.queued && this._queueEvent('start', e), this._player.onStart(e);
        }
        onDestroy(e) {
          this.queued && this._queueEvent('destroy', e), this._player.onDestroy(e);
        }
        init() {
          this._player.init();
        }
        hasStarted() {
          return !this.queued && this._player.hasStarted();
        }
        play() {
          !this.queued && this._player.play();
        }
        pause() {
          !this.queued && this._player.pause();
        }
        restart() {
          !this.queued && this._player.restart();
        }
        finish() {
          this._player.finish();
        }
        destroy() {
          (this.destroyed = !0), this._player.destroy();
        }
        reset() {
          !this.queued && this._player.reset();
        }
        setPosition(e) {
          this.queued || this._player.setPosition(e);
        }
        getPosition() {
          return this.queued ? 0 : this._player.getPosition();
        }
        triggerCallback(e) {
          const t = this._player;
          t.triggerCallback && t.triggerCallback(e);
        }
      }
      function ac(e) {
        return e && 1 === e.nodeType;
      }
      function lc(e, t) {
        const n = e.style.display;
        return (e.style.display = null != t ? t : 'none'), n;
      }
      function uc(e, t, n, s, r) {
        const i = [];
        n.forEach(e => i.push(lc(e)));
        const o = [];
        s.forEach((n, s) => {
          const i = {};
          n.forEach(e => {
            const n = (i[e] = t.computeStyle(s, e, r));
            (n && 0 != n.length) || ((s.__ng_removed = tc), o.push(s));
          }),
            e.set(s, i);
        });
        let a = 0;
        return n.forEach(e => lc(e, i[a++])), o;
      }
      function cc(e, t) {
        const n = new Map();
        if ((e.forEach(e => n.set(e, [])), 0 == t.length)) return n;
        const s = new Set(t),
          r = new Map();
        return (
          t.forEach(e => {
            const t = (function e(t) {
              if (!t) return 1;
              let i = r.get(t);
              if (i) return i;
              const o = t.parentNode;
              return (i = n.has(o) ? o : s.has(o) ? 1 : e(o)), r.set(t, i), i;
            })(e);
            1 !== t && n.get(t).push(e);
          }),
          n
        );
      }
      function hc(e, t) {
        if (e.classList) e.classList.add(t);
        else {
          let n = e.$$classes;
          n || (n = e.$$classes = {}), (n[t] = !0);
        }
      }
      function dc(e, t) {
        if (e.classList) e.classList.remove(t);
        else {
          let n = e.$$classes;
          n && delete n[t];
        }
      }
      function pc(e, t, n) {
        Fl(n).onDone(() => e.processLeaveNode(t));
      }
      function fc(e, t, n) {
        const s = n.get(e);
        if (!s) return !1;
        let r = t.get(e);
        return r ? s.forEach(e => r.add(e)) : t.set(e, s), n.delete(e), !0;
      }
      class mc {
        constructor(e, t, n) {
          (this.bodyNode = e),
            (this._driver = t),
            (this._triggerCache = {}),
            (this.onRemovalComplete = (e, t) => {}),
            (this._transitionEngine = new ic(e, t, n)),
            (this._timelineEngine = new Xu(e, t, n)),
            (this._transitionEngine.onRemovalComplete = (e, t) => this.onRemovalComplete(e, t));
        }
        registerTrigger(e, t, n, s, r) {
          const i = e + '-' + s;
          let o = this._triggerCache[i];
          if (!o) {
            const e = [],
              t = xu(this._driver, r, e);
            if (e.length)
              throw new Error(
                `The animation trigger "${s}" has failed to build due to the following errors:\n - ${e.join(
                  '\n - '
                )}`
              );
            (o = (function (e, t) {
              return new Qu(e, t);
            })(s, t)),
              (this._triggerCache[i] = o);
          }
          this._transitionEngine.registerTrigger(t, s, o);
        }
        register(e, t) {
          this._transitionEngine.register(e, t);
        }
        destroy(e, t) {
          this._transitionEngine.destroy(e, t);
        }
        onInsert(e, t, n, s) {
          this._transitionEngine.insertNode(e, t, n, s);
        }
        onRemove(e, t, n, s) {
          this._transitionEngine.removeNode(e, t, s || !1, n);
        }
        disableAnimations(e, t) {
          this._transitionEngine.markElementAsDisabled(e, t);
        }
        process(e, t, n, s) {
          if ('@' == n.charAt(0)) {
            const [e, r] = Hl(n);
            this._timelineEngine.command(e, t, r, s);
          } else this._transitionEngine.trigger(e, t, n, s);
        }
        listen(e, t, n, s, r) {
          if ('@' == n.charAt(0)) {
            const [e, s] = Hl(n);
            return this._timelineEngine.listen(e, t, s, r);
          }
          return this._transitionEngine.listen(e, t, n, s, r);
        }
        flush(e = -1) {
          this._transitionEngine.flush(e);
        }
        get players() {
          return this._transitionEngine.players.concat(this._timelineEngine.players);
        }
        whenRenderingDone() {
          return this._transitionEngine.whenRenderingDone();
        }
      }
      function gc(e, t) {
        let n = null,
          s = null;
        return (
          Array.isArray(t) && t.length
            ? ((n = _c(t[0])), t.length > 1 && (s = _c(t[t.length - 1])))
            : t && (n = _c(t)),
          n || s ? new yc(e, n, s) : null
        );
      }
      let yc = (() => {
        class e {
          constructor(t, n, s) {
            (this._element = t), (this._startStyles = n), (this._endStyles = s), (this._state = 0);
            let r = e.initialStylesByElement.get(t);
            r || e.initialStylesByElement.set(t, (r = {})), (this._initialStyles = r);
          }
          start() {
            this._state < 1 &&
              (this._startStyles && au(this._element, this._startStyles, this._initialStyles),
              (this._state = 1));
          }
          finish() {
            this.start(),
              this._state < 2 &&
                (au(this._element, this._initialStyles),
                this._endStyles && (au(this._element, this._endStyles), (this._endStyles = null)),
                (this._state = 1));
          }
          destroy() {
            this.finish(),
              this._state < 3 &&
                (e.initialStylesByElement.delete(this._element),
                this._startStyles &&
                  (lu(this._element, this._startStyles), (this._endStyles = null)),
                this._endStyles && (lu(this._element, this._endStyles), (this._endStyles = null)),
                au(this._element, this._initialStyles),
                (this._state = 3));
          }
        }
        return (e.initialStylesByElement = new WeakMap()), e;
      })();
      function _c(e) {
        let t = null;
        const n = Object.keys(e);
        for (let s = 0; s < n.length; s++) {
          const r = n[s];
          vc(r) && ((t = t || {}), (t[r] = e[r]));
        }
        return t;
      }
      function vc(e) {
        return 'display' === e || 'position' === e;
      }
      class bc {
        constructor(e, t, n, s, r, i, o) {
          (this._element = e),
            (this._name = t),
            (this._duration = n),
            (this._delay = s),
            (this._easing = r),
            (this._fillMode = i),
            (this._onDoneFn = o),
            (this._finished = !1),
            (this._destroyed = !1),
            (this._startTime = 0),
            (this._position = 0),
            (this._eventFn = e => this._handleCallback(e));
        }
        apply() {
          !(function (e, t) {
            const n = kc(e, '').trim();
            n.length &&
              ((function (e, t) {
                let n = 0;
                for (let s = 0; s < e.length; s++) ',' === e.charAt(s) && n++;
              })(n),
              (t = `${n}, ${t}`)),
              xc(e, '', t);
          })(
            this._element,
            `${this._duration}ms ${this._easing} ${this._delay}ms 1 normal ${this._fillMode} ${this._name}`
          ),
            Tc(this._element, this._eventFn, !1),
            (this._startTime = Date.now());
        }
        pause() {
          wc(this._element, this._name, 'paused');
        }
        resume() {
          wc(this._element, this._name, 'running');
        }
        setPosition(e) {
          const t = Sc(this._element, this._name);
          (this._position = e * this._duration),
            xc(this._element, 'Delay', `-${this._position}ms`, t);
        }
        getPosition() {
          return this._position;
        }
        _handleCallback(e) {
          const t = e._ngTestManualTimestamp || Date.now(),
            n = 1e3 * parseFloat(e.elapsedTime.toFixed(3));
          e.animationName == this._name &&
            Math.max(t - this._startTime, 0) >= this._delay &&
            n >= this._duration &&
            this.finish();
        }
        finish() {
          this._finished ||
            ((this._finished = !0), this._onDoneFn(), Tc(this._element, this._eventFn, !0));
        }
        destroy() {
          this._destroyed ||
            ((this._destroyed = !0),
            this.finish(),
            (function (e, t) {
              const n = kc(e, '').split(','),
                s = Ec(n, t);
              s >= 0 && (n.splice(s, 1), xc(e, '', n.join(',')));
            })(this._element, this._name));
        }
      }
      function wc(e, t, n) {
        xc(e, 'PlayState', n, Sc(e, t));
      }
      function Sc(e, t) {
        const n = kc(e, '');
        return n.indexOf(',') > 0 ? Ec(n.split(','), t) : Ec([n], t);
      }
      function Ec(e, t) {
        for (let n = 0; n < e.length; n++) if (e[n].indexOf(t) >= 0) return n;
        return -1;
      }
      function Tc(e, t, n) {
        n ? e.removeEventListener('animationend', t) : e.addEventListener('animationend', t);
      }
      function xc(e, t, n, s) {
        const r = 'animation' + t;
        if (null != s) {
          const t = e.style[r];
          if (t.length) {
            const e = t.split(',');
            (e[s] = n), (n = e.join(','));
          }
        }
        e.style[r] = n;
      }
      function kc(e, t) {
        return e.style['animation' + t];
      }
      class Cc {
        constructor(e, t, n, s, r, i, o, a) {
          (this.element = e),
            (this.keyframes = t),
            (this.animationName = n),
            (this._duration = s),
            (this._delay = r),
            (this._finalStyles = o),
            (this._specialStyles = a),
            (this._onDoneFns = []),
            (this._onStartFns = []),
            (this._onDestroyFns = []),
            (this._started = !1),
            (this.currentSnapshot = {}),
            (this._state = 0),
            (this.easing = i || 'linear'),
            (this.totalTime = s + r),
            this._buildStyler();
        }
        onStart(e) {
          this._onStartFns.push(e);
        }
        onDone(e) {
          this._onDoneFns.push(e);
        }
        onDestroy(e) {
          this._onDestroyFns.push(e);
        }
        destroy() {
          this.init(),
            this._state >= 4 ||
              ((this._state = 4),
              this._styler.destroy(),
              this._flushStartFns(),
              this._flushDoneFns(),
              this._specialStyles && this._specialStyles.destroy(),
              this._onDestroyFns.forEach(e => e()),
              (this._onDestroyFns = []));
        }
        _flushDoneFns() {
          this._onDoneFns.forEach(e => e()), (this._onDoneFns = []);
        }
        _flushStartFns() {
          this._onStartFns.forEach(e => e()), (this._onStartFns = []);
        }
        finish() {
          this.init(),
            this._state >= 3 ||
              ((this._state = 3),
              this._styler.finish(),
              this._flushStartFns(),
              this._specialStyles && this._specialStyles.finish(),
              this._flushDoneFns());
        }
        setPosition(e) {
          this._styler.setPosition(e);
        }
        getPosition() {
          return this._styler.getPosition();
        }
        hasStarted() {
          return this._state >= 2;
        }
        init() {
          this._state >= 1 ||
            ((this._state = 1), this._styler.apply(), this._delay && this._styler.pause());
        }
        play() {
          this.init(),
            this.hasStarted() ||
              (this._flushStartFns(),
              (this._state = 2),
              this._specialStyles && this._specialStyles.start()),
            this._styler.resume();
        }
        pause() {
          this.init(), this._styler.pause();
        }
        restart() {
          this.reset(), this.play();
        }
        reset() {
          this._styler.destroy(), this._buildStyler(), this._styler.apply();
        }
        _buildStyler() {
          this._styler = new bc(
            this.element,
            this.animationName,
            this._duration,
            this._delay,
            this.easing,
            'forwards',
            () => this.finish()
          );
        }
        triggerCallback(e) {
          const t = 'start' == e ? this._onStartFns : this._onDoneFns;
          t.forEach(e => e()), (t.length = 0);
        }
        beforeDestroy() {
          this.init();
          const e = {};
          if (this.hasStarted()) {
            const t = this._state >= 3;
            Object.keys(this._finalStyles).forEach(n => {
              'offset' != n && (e[n] = t ? this._finalStyles[n] : vu(this.element, n));
            });
          }
          this.currentSnapshot = e;
        }
      }
      class Pc extends Nl {
        constructor(e, t) {
          super(),
            (this.element = e),
            (this._startingStyles = {}),
            (this.__initialized = !1),
            (this._styles = Jl(t));
        }
        init() {
          !this.__initialized &&
            this._startingStyles &&
            ((this.__initialized = !0),
            Object.keys(this._styles).forEach(e => {
              this._startingStyles[e] = this.element.style[e];
            }),
            super.init());
        }
        play() {
          this._startingStyles &&
            (this.init(),
            Object.keys(this._styles).forEach(e =>
              this.element.style.setProperty(e, this._styles[e])
            ),
            super.play());
        }
        destroy() {
          this._startingStyles &&
            (Object.keys(this._startingStyles).forEach(e => {
              const t = this._startingStyles[e];
              t ? this.element.style.setProperty(e, t) : this.element.style.removeProperty(e);
            }),
            (this._startingStyles = null),
            super.destroy());
        }
      }
      class Ac {
        constructor() {
          (this._count = 0),
            (this._head = document.querySelector('head')),
            (this._warningIssued = !1);
        }
        validateStyleProperty(e) {
          return Kl(e);
        }
        matchesElement(e, t) {
          return Wl(e, t);
        }
        containsElement(e, t) {
          return Ql(e, t);
        }
        query(e, t, n) {
          return Zl(e, t, n);
        }
        computeStyle(e, t, n) {
          return window.getComputedStyle(e)[t];
        }
        buildKeyframeElement(e, t, n) {
          n = n.map(e => Jl(e));
          let s = `@keyframes ${t} {\n`,
            r = '';
          n.forEach(e => {
            r = ' ';
            const t = parseFloat(e.offset);
            (s += `${r}${100 * t}% {\n`),
              (r += ' '),
              Object.keys(e).forEach(t => {
                const n = e[t];
                switch (t) {
                  case 'offset':
                    return;
                  case 'easing':
                    return void (n && (s += `${r}animation-timing-function: ${n};\n`));
                  default:
                    return void (s += `${r}${t}: ${n};\n`);
                }
              }),
              (s += `${r}}\n`);
          }),
            (s += '}\n');
          const i = document.createElement('style');
          return (i.innerHTML = s), i;
        }
        animate(e, t, n, s, r, i = [], o) {
          o && this._notifyFaultyScrubber();
          const a = i.filter(e => e instanceof Cc),
            l = {};
          gu(n, s) &&
            a.forEach(e => {
              let t = e.currentSnapshot;
              Object.keys(t).forEach(e => (l[e] = t[e]));
            });
          const u = (function (e) {
            let t = {};
            return (
              e &&
                (Array.isArray(e) ? e : [e]).forEach(e => {
                  Object.keys(e).forEach(n => {
                    'offset' != n && 'easing' != n && (t[n] = e[n]);
                  });
                }),
              t
            );
          })((t = yu(e, t, l)));
          if (0 == n) return new Pc(e, u);
          const c = `gen_css_kf_${this._count++}`,
            h = this.buildKeyframeElement(e, c, t);
          document.querySelector('head').appendChild(h);
          const d = gc(e, t),
            p = new Cc(e, t, c, n, s, r, u, d);
          return (
            p.onDestroy(() => {
              var e;
              (e = h).parentNode.removeChild(e);
            }),
            p
          );
        }
        _notifyFaultyScrubber() {
          this._warningIssued ||
            (console.warn(
              '@angular/animations: please load the web-animations.js polyfill to allow programmatic access...\n',
              '  visit http://bit.ly/IWukam to learn more about using the web-animation-js polyfill.'
            ),
            (this._warningIssued = !0));
        }
      }
      class Lc {
        constructor(e, t, n, s) {
          (this.element = e),
            (this.keyframes = t),
            (this.options = n),
            (this._specialStyles = s),
            (this._onDoneFns = []),
            (this._onStartFns = []),
            (this._onDestroyFns = []),
            (this._initialized = !1),
            (this._finished = !1),
            (this._started = !1),
            (this._destroyed = !1),
            (this.time = 0),
            (this.parentPlayer = null),
            (this.currentSnapshot = {}),
            (this._duration = n.duration),
            (this._delay = n.delay || 0),
            (this.time = this._duration + this._delay);
        }
        _onFinish() {
          this._finished ||
            ((this._finished = !0), this._onDoneFns.forEach(e => e()), (this._onDoneFns = []));
        }
        init() {
          this._buildPlayer(), this._preparePlayerBeforeStart();
        }
        _buildPlayer() {
          if (this._initialized) return;
          this._initialized = !0;
          const e = this.keyframes;
          (this.domPlayer = this._triggerWebAnimation(this.element, e, this.options)),
            (this._finalKeyframe = e.length ? e[e.length - 1] : {}),
            this.domPlayer.addEventListener('finish', () => this._onFinish());
        }
        _preparePlayerBeforeStart() {
          this._delay ? this._resetDomPlayerState() : this.domPlayer.pause();
        }
        _triggerWebAnimation(e, t, n) {
          return e.animate(t, n);
        }
        onStart(e) {
          this._onStartFns.push(e);
        }
        onDone(e) {
          this._onDoneFns.push(e);
        }
        onDestroy(e) {
          this._onDestroyFns.push(e);
        }
        play() {
          this._buildPlayer(),
            this.hasStarted() ||
              (this._onStartFns.forEach(e => e()),
              (this._onStartFns = []),
              (this._started = !0),
              this._specialStyles && this._specialStyles.start()),
            this.domPlayer.play();
        }
        pause() {
          this.init(), this.domPlayer.pause();
        }
        finish() {
          this.init(),
            this._specialStyles && this._specialStyles.finish(),
            this._onFinish(),
            this.domPlayer.finish();
        }
        reset() {
          this._resetDomPlayerState(),
            (this._destroyed = !1),
            (this._finished = !1),
            (this._started = !1);
        }
        _resetDomPlayerState() {
          this.domPlayer && this.domPlayer.cancel();
        }
        restart() {
          this.reset(), this.play();
        }
        hasStarted() {
          return this._started;
        }
        destroy() {
          this._destroyed ||
            ((this._destroyed = !0),
            this._resetDomPlayerState(),
            this._onFinish(),
            this._specialStyles && this._specialStyles.destroy(),
            this._onDestroyFns.forEach(e => e()),
            (this._onDestroyFns = []));
        }
        setPosition(e) {
          this.domPlayer.currentTime = e * this.time;
        }
        getPosition() {
          return this.domPlayer.currentTime / this.time;
        }
        get totalTime() {
          return this._delay + this._duration;
        }
        beforeDestroy() {
          const e = {};
          this.hasStarted() &&
            Object.keys(this._finalKeyframe).forEach(t => {
              'offset' != t &&
                (e[t] = this._finished ? this._finalKeyframe[t] : vu(this.element, t));
            }),
            (this.currentSnapshot = e);
        }
        triggerCallback(e) {
          const t = 'start' == e ? this._onStartFns : this._onDoneFns;
          t.forEach(e => e()), (t.length = 0);
        }
      }
      class Nc {
        constructor() {
          (this._isNativeImpl = /\{\s*\[native\s+code\]\s*\}/.test(Ic().toString())),
            (this._cssKeyframesDriver = new Ac());
        }
        validateStyleProperty(e) {
          return Kl(e);
        }
        matchesElement(e, t) {
          return Wl(e, t);
        }
        containsElement(e, t) {
          return Ql(e, t);
        }
        query(e, t, n) {
          return Zl(e, t, n);
        }
        computeStyle(e, t, n) {
          return window.getComputedStyle(e)[t];
        }
        overrideWebAnimationsSupport(e) {
          this._isNativeImpl = e;
        }
        animate(e, t, n, s, r, i = [], o) {
          if (!o && !this._isNativeImpl) return this._cssKeyframesDriver.animate(e, t, n, s, r, i);
          const a = { duration: n, delay: s, fill: 0 == s ? 'both' : 'forwards' };
          r && (a.easing = r);
          const l = {},
            u = i.filter(e => e instanceof Lc);
          gu(n, s) &&
            u.forEach(e => {
              let t = e.currentSnapshot;
              Object.keys(t).forEach(e => (l[e] = t[e]));
            });
          const c = gc(e, (t = yu(e, (t = t.map(e => ru(e, !1))), l)));
          return new Lc(e, t, a, c);
        }
      }
      function Ic() {
        return (
          ('undefined' != typeof window &&
            void 0 !== window.document &&
            Element.prototype.animate) ||
          {}
        );
      }
      let Dc = (() => {
        class e extends Cl {
          constructor(e, t) {
            super(),
              (this._nextAnimationId = 0),
              (this._renderer = e.createRenderer(t.body, {
                id: '0',
                encapsulation: Xe.None,
                styles: [],
                data: { animation: [] },
              }));
          }
          build(e) {
            const t = this._nextAnimationId.toString();
            this._nextAnimationId++;
            const n = Array.isArray(e) ? Pl(e) : e;
            return Oc(this._renderer, null, t, 'register', [n]), new Fc(t, this._renderer);
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(He(Mi), He(Da));
          }),
          (e.ɵprov = se({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class Fc extends class {} {
        constructor(e, t) {
          super(), (this._id = e), (this._renderer = t);
        }
        create(e, t) {
          return new Mc(this._id, e, t || {}, this._renderer);
        }
      }
      class Mc {
        constructor(e, t, n, s) {
          (this.id = e),
            (this.element = t),
            (this._renderer = s),
            (this.parentPlayer = null),
            (this._started = !1),
            (this.totalTime = 0),
            this._command('create', n);
        }
        _listen(e, t) {
          return this._renderer.listen(this.element, `@@${this.id}:${e}`, t);
        }
        _command(e, ...t) {
          return Oc(this._renderer, this.element, this.id, e, t);
        }
        onDone(e) {
          this._listen('done', e);
        }
        onStart(e) {
          this._listen('start', e);
        }
        onDestroy(e) {
          this._listen('destroy', e);
        }
        init() {
          this._command('init');
        }
        hasStarted() {
          return this._started;
        }
        play() {
          this._command('play'), (this._started = !0);
        }
        pause() {
          this._command('pause');
        }
        restart() {
          this._command('restart');
        }
        finish() {
          this._command('finish');
        }
        destroy() {
          this._command('destroy');
        }
        reset() {
          this._command('reset');
        }
        setPosition(e) {
          this._command('setPosition', e);
        }
        getPosition() {
          return 0;
        }
      }
      function Oc(e, t, n, s, r) {
        return e.setProperty(t, `@@${n}:${s}`, r);
      }
      let Rc = (() => {
        class e {
          constructor(e, t, n) {
            (this.delegate = e),
              (this.engine = t),
              (this._zone = n),
              (this._currentId = 0),
              (this._microtaskId = 1),
              (this._animationCallbacksBuffer = []),
              (this._rendererCache = new Map()),
              (this._cdRecurDepth = 0),
              (this.promise = Promise.resolve(0)),
              (t.onRemovalComplete = (e, t) => {
                t && t.parentNode(e) && t.removeChild(e.parentNode, e);
              });
          }
          createRenderer(e, t) {
            const n = this.delegate.createRenderer(e, t);
            if (!(e && t && t.data && t.data.animation)) {
              let e = this._rendererCache.get(n);
              return e || ((e = new Vc('', n, this.engine)), this._rendererCache.set(n, e)), e;
            }
            const s = t.id,
              r = t.id + '-' + this._currentId;
            this._currentId++, this.engine.register(r, e);
            const i = t => {
              Array.isArray(t) ? t.forEach(i) : this.engine.registerTrigger(s, r, e, t.name, t);
            };
            return t.data.animation.forEach(i), new jc(this, r, n, this.engine);
          }
          begin() {
            this._cdRecurDepth++, this.delegate.begin && this.delegate.begin();
          }
          _scheduleCountTask() {
            this.promise.then(() => {
              this._microtaskId++;
            });
          }
          scheduleListenerCallback(e, t, n) {
            e >= 0 && e < this._microtaskId
              ? this._zone.run(() => t(n))
              : (0 == this._animationCallbacksBuffer.length &&
                  Promise.resolve(null).then(() => {
                    this._zone.run(() => {
                      this._animationCallbacksBuffer.forEach(e => {
                        const [t, n] = e;
                        t(n);
                      }),
                        (this._animationCallbacksBuffer = []);
                    });
                  }),
                this._animationCallbacksBuffer.push([t, n]));
          }
          end() {
            this._cdRecurDepth--,
              0 == this._cdRecurDepth &&
                this._zone.runOutsideAngular(() => {
                  this._scheduleCountTask(), this.engine.flush(this._microtaskId);
                }),
              this.delegate.end && this.delegate.end();
          }
          whenRenderingDone() {
            return this.engine.whenRenderingDone();
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(He(Mi), He(mc), He(aa));
          }),
          (e.ɵprov = se({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class Vc {
        constructor(e, t, n) {
          (this.namespaceId = e),
            (this.delegate = t),
            (this.engine = n),
            (this.destroyNode = this.delegate.destroyNode ? e => t.destroyNode(e) : null);
        }
        get data() {
          return this.delegate.data;
        }
        destroy() {
          this.engine.destroy(this.namespaceId, this.delegate), this.delegate.destroy();
        }
        createElement(e, t) {
          return this.delegate.createElement(e, t);
        }
        createComment(e) {
          return this.delegate.createComment(e);
        }
        createText(e) {
          return this.delegate.createText(e);
        }
        appendChild(e, t) {
          this.delegate.appendChild(e, t), this.engine.onInsert(this.namespaceId, t, e, !1);
        }
        insertBefore(e, t, n) {
          this.delegate.insertBefore(e, t, n), this.engine.onInsert(this.namespaceId, t, e, !0);
        }
        removeChild(e, t, n) {
          this.engine.onRemove(this.namespaceId, t, this.delegate, n);
        }
        selectRootElement(e, t) {
          return this.delegate.selectRootElement(e, t);
        }
        parentNode(e) {
          return this.delegate.parentNode(e);
        }
        nextSibling(e) {
          return this.delegate.nextSibling(e);
        }
        setAttribute(e, t, n, s) {
          this.delegate.setAttribute(e, t, n, s);
        }
        removeAttribute(e, t, n) {
          this.delegate.removeAttribute(e, t, n);
        }
        addClass(e, t) {
          this.delegate.addClass(e, t);
        }
        removeClass(e, t) {
          this.delegate.removeClass(e, t);
        }
        setStyle(e, t, n, s) {
          this.delegate.setStyle(e, t, n, s);
        }
        removeStyle(e, t, n) {
          this.delegate.removeStyle(e, t, n);
        }
        setProperty(e, t, n) {
          '@' == t.charAt(0) && '@.disabled' == t
            ? this.disableAnimations(e, !!n)
            : this.delegate.setProperty(e, t, n);
        }
        setValue(e, t) {
          this.delegate.setValue(e, t);
        }
        listen(e, t, n) {
          return this.delegate.listen(e, t, n);
        }
        disableAnimations(e, t) {
          this.engine.disableAnimations(e, t);
        }
      }
      class jc extends Vc {
        constructor(e, t, n, s) {
          super(t, n, s), (this.factory = e), (this.namespaceId = t);
        }
        setProperty(e, t, n) {
          '@' == t.charAt(0)
            ? '.' == t.charAt(1) && '@.disabled' == t
              ? this.disableAnimations(e, (n = void 0 === n || !!n))
              : this.engine.process(this.namespaceId, e, t.substr(1), n)
            : this.delegate.setProperty(e, t, n);
        }
        listen(e, t, n) {
          if ('@' == t.charAt(0)) {
            const s = (function (e) {
              switch (e) {
                case 'body':
                  return document.body;
                case 'document':
                  return document;
                case 'window':
                  return window;
                default:
                  return e;
              }
            })(e);
            let r = t.substr(1),
              i = '';
            return (
              '@' != r.charAt(0) &&
                ([r, i] = (function (e) {
                  const t = e.indexOf('.');
                  return [e.substring(0, t), e.substr(t + 1)];
                })(r)),
              this.engine.listen(this.namespaceId, s, r, i, e => {
                this.factory.scheduleListenerCallback(e._data || -1, n, e);
              })
            );
          }
          return this.delegate.listen(e, t, n);
        }
      }
      let Hc = (() => {
        class e extends mc {
          constructor(e, t, n) {
            super(e.body, t, n);
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(He(Da), He(Yl), He(zu));
          }),
          (e.ɵprov = se({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const Bc = [
        {
          provide: Yl,
          useFactory: function () {
            return 'function' == typeof Ic() ? new Nc() : new Ac();
          },
        },
        { provide: new Le('AnimationModuleType'), useValue: 'BrowserAnimations' },
        { provide: Cl, useClass: Dc },
        {
          provide: zu,
          useFactory: function () {
            return new qu();
          },
        },
        { provide: mc, useClass: Hc },
        {
          provide: Mi,
          useFactory: function (e, t, n) {
            return new Rc(e, t, n);
          },
          deps: [al, mc, aa],
        },
      ];
      let zc = (() => {
        class e {}
        return (
          (e.ɵmod = ot({ type: e })),
          (e.ɵinj = re({
            factory: function (t) {
              return new (t || e)();
            },
            providers: Bc,
            imports: [vl],
          })),
          e
        );
      })();
      function qc(...e) {
        let t = e[e.length - 1];
        return x(t) ? (e.pop(), O(e, t)) : H(e);
      }
      class $c {
        constructor(e, t) {
          (this.predicate = e), (this.thisArg = t);
        }
        call(e, t) {
          return t.subscribe(new Uc(e, this.predicate, this.thisArg));
        }
      }
      class Uc extends f {
        constructor(e, t, n) {
          super(e), (this.predicate = t), (this.thisArg = n), (this.count = 0);
        }
        _next(e) {
          let t;
          try {
            t = this.predicate.call(this.thisArg, e, this.count++);
          } catch (n) {
            return void this.destination.error(n);
          }
          t && this.destination.next(e);
        }
      }
      class Gc {}
      class Kc {}
      class Wc {
        constructor(e) {
          (this.normalizedNames = new Map()),
            (this.lazyUpdate = null),
            e
              ? (this.lazyInit =
                  'string' == typeof e
                    ? () => {
                        (this.headers = new Map()),
                          e.split('\n').forEach(e => {
                            const t = e.indexOf(':');
                            if (t > 0) {
                              const n = e.slice(0, t),
                                s = n.toLowerCase(),
                                r = e.slice(t + 1).trim();
                              this.maybeSetNormalizedName(n, s),
                                this.headers.has(s)
                                  ? this.headers.get(s).push(r)
                                  : this.headers.set(s, [r]);
                            }
                          });
                      }
                    : () => {
                        (this.headers = new Map()),
                          Object.keys(e).forEach(t => {
                            let n = e[t];
                            const s = t.toLowerCase();
                            'string' == typeof n && (n = [n]),
                              n.length > 0 &&
                                (this.headers.set(s, n), this.maybeSetNormalizedName(t, s));
                          });
                      })
              : (this.headers = new Map());
        }
        has(e) {
          return this.init(), this.headers.has(e.toLowerCase());
        }
        get(e) {
          this.init();
          const t = this.headers.get(e.toLowerCase());
          return t && t.length > 0 ? t[0] : null;
        }
        keys() {
          return this.init(), Array.from(this.normalizedNames.values());
        }
        getAll(e) {
          return this.init(), this.headers.get(e.toLowerCase()) || null;
        }
        append(e, t) {
          return this.clone({ name: e, value: t, op: 'a' });
        }
        set(e, t) {
          return this.clone({ name: e, value: t, op: 's' });
        }
        delete(e, t) {
          return this.clone({ name: e, value: t, op: 'd' });
        }
        maybeSetNormalizedName(e, t) {
          this.normalizedNames.has(t) || this.normalizedNames.set(t, e);
        }
        init() {
          this.lazyInit &&
            (this.lazyInit instanceof Wc ? this.copyFrom(this.lazyInit) : this.lazyInit(),
            (this.lazyInit = null),
            this.lazyUpdate &&
              (this.lazyUpdate.forEach(e => this.applyUpdate(e)), (this.lazyUpdate = null)));
        }
        copyFrom(e) {
          e.init(),
            Array.from(e.headers.keys()).forEach(t => {
              this.headers.set(t, e.headers.get(t)),
                this.normalizedNames.set(t, e.normalizedNames.get(t));
            });
        }
        clone(e) {
          const t = new Wc();
          return (
            (t.lazyInit = this.lazyInit && this.lazyInit instanceof Wc ? this.lazyInit : this),
            (t.lazyUpdate = (this.lazyUpdate || []).concat([e])),
            t
          );
        }
        applyUpdate(e) {
          const t = e.name.toLowerCase();
          switch (e.op) {
            case 'a':
            case 's':
              let n = e.value;
              if (('string' == typeof n && (n = [n]), 0 === n.length)) return;
              this.maybeSetNormalizedName(e.name, t);
              const s = ('a' === e.op ? this.headers.get(t) : void 0) || [];
              s.push(...n), this.headers.set(t, s);
              break;
            case 'd':
              const r = e.value;
              if (r) {
                let e = this.headers.get(t);
                if (!e) return;
                (e = e.filter(e => -1 === r.indexOf(e))),
                  0 === e.length
                    ? (this.headers.delete(t), this.normalizedNames.delete(t))
                    : this.headers.set(t, e);
              } else this.headers.delete(t), this.normalizedNames.delete(t);
          }
        }
        forEach(e) {
          this.init(),
            Array.from(this.normalizedNames.keys()).forEach(t =>
              e(this.normalizedNames.get(t), this.headers.get(t))
            );
        }
      }
      class Qc {
        encodeKey(e) {
          return Zc(e);
        }
        encodeValue(e) {
          return Zc(e);
        }
        decodeKey(e) {
          return decodeURIComponent(e);
        }
        decodeValue(e) {
          return decodeURIComponent(e);
        }
      }
      function Zc(e) {
        return encodeURIComponent(e)
          .replace(/%40/gi, '@')
          .replace(/%3A/gi, ':')
          .replace(/%24/gi, '$')
          .replace(/%2C/gi, ',')
          .replace(/%3B/gi, ';')
          .replace(/%2B/gi, '+')
          .replace(/%3D/gi, '=')
          .replace(/%3F/gi, '?')
          .replace(/%2F/gi, '/');
      }
      class Jc {
        constructor(e = {}) {
          if (
            ((this.updates = null),
            (this.cloneFrom = null),
            (this.encoder = e.encoder || new Qc()),
            e.fromString)
          ) {
            if (e.fromObject) throw new Error('Cannot specify both fromString and fromObject.');
            this.map = (function (e, t) {
              const n = new Map();
              return (
                e.length > 0 &&
                  e.split('&').forEach(e => {
                    const s = e.indexOf('='),
                      [r, i] =
                        -1 == s
                          ? [t.decodeKey(e), '']
                          : [t.decodeKey(e.slice(0, s)), t.decodeValue(e.slice(s + 1))],
                      o = n.get(r) || [];
                    o.push(i), n.set(r, o);
                  }),
                n
              );
            })(e.fromString, this.encoder);
          } else
            e.fromObject
              ? ((this.map = new Map()),
                Object.keys(e.fromObject).forEach(t => {
                  const n = e.fromObject[t];
                  this.map.set(t, Array.isArray(n) ? n : [n]);
                }))
              : (this.map = null);
        }
        has(e) {
          return this.init(), this.map.has(e);
        }
        get(e) {
          this.init();
          const t = this.map.get(e);
          return t ? t[0] : null;
        }
        getAll(e) {
          return this.init(), this.map.get(e) || null;
        }
        keys() {
          return this.init(), Array.from(this.map.keys());
        }
        append(e, t) {
          return this.clone({ param: e, value: t, op: 'a' });
        }
        set(e, t) {
          return this.clone({ param: e, value: t, op: 's' });
        }
        delete(e, t) {
          return this.clone({ param: e, value: t, op: 'd' });
        }
        toString() {
          return (
            this.init(),
            this.keys()
              .map(e => {
                const t = this.encoder.encodeKey(e);
                return this.map
                  .get(e)
                  .map(e => t + '=' + this.encoder.encodeValue(e))
                  .join('&');
              })
              .filter(e => '' !== e)
              .join('&')
          );
        }
        clone(e) {
          const t = new Jc({ encoder: this.encoder });
          return (
            (t.cloneFrom = this.cloneFrom || this),
            (t.updates = (this.updates || []).concat([e])),
            t
          );
        }
        init() {
          null === this.map && (this.map = new Map()),
            null !== this.cloneFrom &&
              (this.cloneFrom.init(),
              this.cloneFrom.keys().forEach(e => this.map.set(e, this.cloneFrom.map.get(e))),
              this.updates.forEach(e => {
                switch (e.op) {
                  case 'a':
                  case 's':
                    const t = ('a' === e.op ? this.map.get(e.param) : void 0) || [];
                    t.push(e.value), this.map.set(e.param, t);
                    break;
                  case 'd':
                    if (void 0 === e.value) {
                      this.map.delete(e.param);
                      break;
                    }
                    {
                      let t = this.map.get(e.param) || [];
                      const n = t.indexOf(e.value);
                      -1 !== n && t.splice(n, 1),
                        t.length > 0 ? this.map.set(e.param, t) : this.map.delete(e.param);
                    }
                }
              }),
              (this.cloneFrom = this.updates = null));
        }
      }
      function Xc(e) {
        return 'undefined' != typeof ArrayBuffer && e instanceof ArrayBuffer;
      }
      function Yc(e) {
        return 'undefined' != typeof Blob && e instanceof Blob;
      }
      function eh(e) {
        return 'undefined' != typeof FormData && e instanceof FormData;
      }
      class th {
        constructor(e, t, n, s) {
          let r;
          if (
            ((this.url = t),
            (this.body = null),
            (this.reportProgress = !1),
            (this.withCredentials = !1),
            (this.responseType = 'json'),
            (this.method = e.toUpperCase()),
            (function (e) {
              switch (e) {
                case 'DELETE':
                case 'GET':
                case 'HEAD':
                case 'OPTIONS':
                case 'JSONP':
                  return !1;
                default:
                  return !0;
              }
            })(this.method) || s
              ? ((this.body = void 0 !== n ? n : null), (r = s))
              : (r = n),
            r &&
              ((this.reportProgress = !!r.reportProgress),
              (this.withCredentials = !!r.withCredentials),
              r.responseType && (this.responseType = r.responseType),
              r.headers && (this.headers = r.headers),
              r.params && (this.params = r.params)),
            this.headers || (this.headers = new Wc()),
            this.params)
          ) {
            const e = this.params.toString();
            if (0 === e.length) this.urlWithParams = t;
            else {
              const n = t.indexOf('?');
              this.urlWithParams = t + (-1 === n ? '?' : n < t.length - 1 ? '&' : '') + e;
            }
          } else (this.params = new Jc()), (this.urlWithParams = t);
        }
        serializeBody() {
          return null === this.body
            ? null
            : Xc(this.body) || Yc(this.body) || eh(this.body) || 'string' == typeof this.body
            ? this.body
            : this.body instanceof Jc
            ? this.body.toString()
            : 'object' == typeof this.body ||
              'boolean' == typeof this.body ||
              Array.isArray(this.body)
            ? JSON.stringify(this.body)
            : this.body.toString();
        }
        detectContentTypeHeader() {
          return null === this.body
            ? null
            : eh(this.body)
            ? null
            : Yc(this.body)
            ? this.body.type || null
            : Xc(this.body)
            ? null
            : 'string' == typeof this.body
            ? 'text/plain'
            : this.body instanceof Jc
            ? 'application/x-www-form-urlencoded;charset=UTF-8'
            : 'object' == typeof this.body ||
              'number' == typeof this.body ||
              Array.isArray(this.body)
            ? 'application/json'
            : null;
        }
        clone(e = {}) {
          const t = e.method || this.method,
            n = e.url || this.url,
            s = e.responseType || this.responseType,
            r = void 0 !== e.body ? e.body : this.body,
            i = void 0 !== e.withCredentials ? e.withCredentials : this.withCredentials,
            o = void 0 !== e.reportProgress ? e.reportProgress : this.reportProgress;
          let a = e.headers || this.headers,
            l = e.params || this.params;
          return (
            void 0 !== e.setHeaders &&
              (a = Object.keys(e.setHeaders).reduce((t, n) => t.set(n, e.setHeaders[n]), a)),
            e.setParams &&
              (l = Object.keys(e.setParams).reduce((t, n) => t.set(n, e.setParams[n]), l)),
            new th(t, n, r, {
              params: l,
              headers: a,
              reportProgress: o,
              responseType: s,
              withCredentials: i,
            })
          );
        }
      }
      const nh = (function () {
        var e = {
          Sent: 0,
          UploadProgress: 1,
          ResponseHeader: 2,
          DownloadProgress: 3,
          Response: 4,
          User: 5,
        };
        return (
          (e[e.Sent] = 'Sent'),
          (e[e.UploadProgress] = 'UploadProgress'),
          (e[e.ResponseHeader] = 'ResponseHeader'),
          (e[e.DownloadProgress] = 'DownloadProgress'),
          (e[e.Response] = 'Response'),
          (e[e.User] = 'User'),
          e
        );
      })();
      class sh {
        constructor(e, t = 200, n = 'OK') {
          (this.headers = e.headers || new Wc()),
            (this.status = void 0 !== e.status ? e.status : t),
            (this.statusText = e.statusText || n),
            (this.url = e.url || null),
            (this.ok = this.status >= 200 && this.status < 300);
        }
      }
      class rh extends sh {
        constructor(e = {}) {
          super(e), (this.type = nh.ResponseHeader);
        }
        clone(e = {}) {
          return new rh({
            headers: e.headers || this.headers,
            status: void 0 !== e.status ? e.status : this.status,
            statusText: e.statusText || this.statusText,
            url: e.url || this.url || void 0,
          });
        }
      }
      class ih extends sh {
        constructor(e = {}) {
          super(e), (this.type = nh.Response), (this.body = void 0 !== e.body ? e.body : null);
        }
        clone(e = {}) {
          return new ih({
            body: void 0 !== e.body ? e.body : this.body,
            headers: e.headers || this.headers,
            status: void 0 !== e.status ? e.status : this.status,
            statusText: e.statusText || this.statusText,
            url: e.url || this.url || void 0,
          });
        }
      }
      class oh extends sh {
        constructor(e) {
          super(e, 0, 'Unknown Error'),
            (this.name = 'HttpErrorResponse'),
            (this.ok = !1),
            (this.message =
              this.status >= 200 && this.status < 300
                ? `Http failure during parsing for ${e.url || '(unknown url)'}`
                : `Http failure response for ${e.url || '(unknown url)'}: ${e.status} ${
                    e.statusText
                  }`),
            (this.error = e.error || null);
        }
      }
      function ah(e, t) {
        return {
          body: t,
          headers: e.headers,
          observe: e.observe,
          params: e.params,
          reportProgress: e.reportProgress,
          responseType: e.responseType,
          withCredentials: e.withCredentials,
        };
      }
      let lh = (() => {
        class e {
          constructor(e) {
            this.handler = e;
          }
          request(e, t, n = {}) {
            let s;
            if (e instanceof th) s = e;
            else {
              let r = void 0;
              r = n.headers instanceof Wc ? n.headers : new Wc(n.headers);
              let i = void 0;
              n.params &&
                (i = n.params instanceof Jc ? n.params : new Jc({ fromObject: n.params })),
                (s = new th(e, t, void 0 !== n.body ? n.body : null, {
                  headers: r,
                  params: i,
                  reportProgress: n.reportProgress,
                  responseType: n.responseType || 'json',
                  withCredentials: n.withCredentials,
                }));
            }
            const r = qc(s).pipe(R(e => this.handler.handle(e), void 0, 1));
            if (e instanceof th || 'events' === n.observe) return r;
            const i = r.pipe(
              ((o = e => e instanceof ih),
              function (e) {
                return e.lift(new $c(o, void 0));
              })
            );
            var o;
            switch (n.observe || 'body') {
              case 'body':
                switch (s.responseType) {
                  case 'arraybuffer':
                    return i.pipe(
                      D(e => {
                        if (null !== e.body && !(e.body instanceof ArrayBuffer))
                          throw new Error('Response is not an ArrayBuffer.');
                        return e.body;
                      })
                    );
                  case 'blob':
                    return i.pipe(
                      D(e => {
                        if (null !== e.body && !(e.body instanceof Blob))
                          throw new Error('Response is not a Blob.');
                        return e.body;
                      })
                    );
                  case 'text':
                    return i.pipe(
                      D(e => {
                        if (null !== e.body && 'string' != typeof e.body)
                          throw new Error('Response is not a string.');
                        return e.body;
                      })
                    );
                  case 'json':
                  default:
                    return i.pipe(D(e => e.body));
                }
              case 'response':
                return i;
              default:
                throw new Error(`Unreachable: unhandled observe type ${n.observe}}`);
            }
          }
          delete(e, t = {}) {
            return this.request('DELETE', e, t);
          }
          get(e, t = {}) {
            return this.request('GET', e, t);
          }
          head(e, t = {}) {
            return this.request('HEAD', e, t);
          }
          jsonp(e, t) {
            return this.request('JSONP', e, {
              params: new Jc().append(t, 'JSONP_CALLBACK'),
              observe: 'body',
              responseType: 'json',
            });
          }
          options(e, t = {}) {
            return this.request('OPTIONS', e, t);
          }
          patch(e, t, n = {}) {
            return this.request('PATCH', e, ah(n, t));
          }
          post(e, t, n = {}) {
            return this.request('POST', e, ah(n, t));
          }
          put(e, t, n = {}) {
            return this.request('PUT', e, ah(n, t));
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(He(Gc));
          }),
          (e.ɵprov = se({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class uh {
        constructor(e, t) {
          (this.next = e), (this.interceptor = t);
        }
        handle(e) {
          return this.interceptor.intercept(e, this.next);
        }
      }
      const ch = new Le('HTTP_INTERCEPTORS');
      let hh = (() => {
        class e {
          intercept(e, t) {
            return t.handle(e);
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵprov = se({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const dh = /^\)\]\}',?\n/;
      class ph {}
      let fh = (() => {
          class e {
            constructor() {}
            build() {
              return new XMLHttpRequest();
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = se({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        mh = (() => {
          class e {
            constructor(e) {
              this.xhrFactory = e;
            }
            handle(e) {
              if ('JSONP' === e.method)
                throw new Error(
                  'Attempted to construct Jsonp request without JsonpClientModule installed.'
                );
              return new _(t => {
                const n = this.xhrFactory.build();
                if (
                  (n.open(e.method, e.urlWithParams),
                  e.withCredentials && (n.withCredentials = !0),
                  e.headers.forEach((e, t) => n.setRequestHeader(e, t.join(','))),
                  e.headers.has('Accept') ||
                    n.setRequestHeader('Accept', 'application/json, text/plain, */*'),
                  !e.headers.has('Content-Type'))
                ) {
                  const t = e.detectContentTypeHeader();
                  null !== t && n.setRequestHeader('Content-Type', t);
                }
                if (e.responseType) {
                  const t = e.responseType.toLowerCase();
                  n.responseType = 'json' !== t ? t : 'text';
                }
                const s = e.serializeBody();
                let r = null;
                const i = () => {
                    if (null !== r) return r;
                    const t = 1223 === n.status ? 204 : n.status,
                      s = n.statusText || 'OK',
                      i = new Wc(n.getAllResponseHeaders()),
                      o =
                        (function (e) {
                          return 'responseURL' in e && e.responseURL
                            ? e.responseURL
                            : /^X-Request-URL:/m.test(e.getAllResponseHeaders())
                            ? e.getResponseHeader('X-Request-URL')
                            : null;
                        })(n) || e.url;
                    return (r = new rh({ headers: i, status: t, statusText: s, url: o })), r;
                  },
                  o = () => {
                    let { headers: s, status: r, statusText: o, url: a } = i(),
                      l = null;
                    204 !== r && (l = void 0 === n.response ? n.responseText : n.response),
                      0 === r && (r = l ? 200 : 0);
                    let u = r >= 200 && r < 300;
                    if ('json' === e.responseType && 'string' == typeof l) {
                      const e = l;
                      l = l.replace(dh, '');
                      try {
                        l = '' !== l ? JSON.parse(l) : null;
                      } catch (c) {
                        (l = e), u && ((u = !1), (l = { error: c, text: l }));
                      }
                    }
                    u
                      ? (t.next(
                          new ih({
                            body: l,
                            headers: s,
                            status: r,
                            statusText: o,
                            url: a || void 0,
                          })
                        ),
                        t.complete())
                      : t.error(
                          new oh({
                            error: l,
                            headers: s,
                            status: r,
                            statusText: o,
                            url: a || void 0,
                          })
                        );
                  },
                  a = e => {
                    const { url: s } = i(),
                      r = new oh({
                        error: e,
                        status: n.status || 0,
                        statusText: n.statusText || 'Unknown Error',
                        url: s || void 0,
                      });
                    t.error(r);
                  };
                let l = !1;
                const u = s => {
                    l || (t.next(i()), (l = !0));
                    let r = { type: nh.DownloadProgress, loaded: s.loaded };
                    s.lengthComputable && (r.total = s.total),
                      'text' === e.responseType &&
                        n.responseText &&
                        (r.partialText = n.responseText),
                      t.next(r);
                  },
                  c = e => {
                    let n = { type: nh.UploadProgress, loaded: e.loaded };
                    e.lengthComputable && (n.total = e.total), t.next(n);
                  };
                return (
                  n.addEventListener('load', o),
                  n.addEventListener('error', a),
                  e.reportProgress &&
                    (n.addEventListener('progress', u),
                    null !== s && n.upload && n.upload.addEventListener('progress', c)),
                  n.send(s),
                  t.next({ type: nh.Sent }),
                  () => {
                    n.removeEventListener('error', a),
                      n.removeEventListener('load', o),
                      e.reportProgress &&
                        (n.removeEventListener('progress', u),
                        null !== s && n.upload && n.upload.removeEventListener('progress', c)),
                      n.abort();
                  }
                );
              });
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(He(ph));
            }),
            (e.ɵprov = se({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      const gh = new Le('XSRF_COOKIE_NAME'),
        yh = new Le('XSRF_HEADER_NAME');
      class _h {}
      let vh = (() => {
          class e {
            constructor(e, t, n) {
              (this.doc = e),
                (this.platform = t),
                (this.cookieName = n),
                (this.lastCookieString = ''),
                (this.lastToken = null),
                (this.parseCount = 0);
            }
            getToken() {
              if ('server' === this.platform) return null;
              const e = this.doc.cookie || '';
              return (
                e !== this.lastCookieString &&
                  (this.parseCount++,
                  (this.lastToken = Ra(e, this.cookieName)),
                  (this.lastCookieString = e)),
                this.lastToken
              );
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(He(Da), He(Uo), He(gh));
            }),
            (e.ɵprov = se({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        bh = (() => {
          class e {
            constructor(e, t) {
              (this.tokenService = e), (this.headerName = t);
            }
            intercept(e, t) {
              const n = e.url.toLowerCase();
              if (
                'GET' === e.method ||
                'HEAD' === e.method ||
                n.startsWith('http://') ||
                n.startsWith('https://')
              )
                return t.handle(e);
              const s = this.tokenService.getToken();
              return (
                null === s ||
                  e.headers.has(this.headerName) ||
                  (e = e.clone({ headers: e.headers.set(this.headerName, s) })),
                t.handle(e)
              );
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(He(_h), He(yh));
            }),
            (e.ɵprov = se({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        wh = (() => {
          class e {
            constructor(e, t) {
              (this.backend = e), (this.injector = t), (this.chain = null);
            }
            handle(e) {
              if (null === this.chain) {
                const e = this.injector.get(ch, []);
                this.chain = e.reduceRight((e, t) => new uh(e, t), this.backend);
              }
              return this.chain.handle(e);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(He(Kc), He(qr));
            }),
            (e.ɵprov = se({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Sh = (() => {
          class e {
            static disable() {
              return { ngModule: e, providers: [{ provide: bh, useClass: hh }] };
            }
            static withOptions(t = {}) {
              return {
                ngModule: e,
                providers: [
                  t.cookieName ? { provide: gh, useValue: t.cookieName } : [],
                  t.headerName ? { provide: yh, useValue: t.headerName } : [],
                ],
              };
            }
          }
          return (
            (e.ɵmod = ot({ type: e })),
            (e.ɵinj = re({
              factory: function (t) {
                return new (t || e)();
              },
              providers: [
                bh,
                { provide: ch, useExisting: bh, multi: !0 },
                { provide: _h, useClass: vh },
                { provide: gh, useValue: 'XSRF-TOKEN' },
                { provide: yh, useValue: 'X-XSRF-TOKEN' },
              ],
            })),
            e
          );
        })(),
        Eh = (() => {
          class e {}
          return (
            (e.ɵmod = ot({ type: e })),
            (e.ɵinj = re({
              factory: function (t) {
                return new (t || e)();
              },
              providers: [
                lh,
                { provide: Gc, useClass: wh },
                mh,
                { provide: Kc, useExisting: mh },
                fh,
                { provide: ph, useExisting: fh },
              ],
              imports: [[Sh.withOptions({ cookieName: 'XSRF-TOKEN', headerName: 'X-XSRF-TOKEN' })]],
            })),
            e
          );
        })(),
        Th = (() => {
          class e {
            static AshxPipe(e) {
              return null != this.ashx && null != e && e.startsWith('./ashx/')
                ? null != this.webhost
                  ? this.webhost + e.substr(6)
                  : this.ashx + e.substr(6)
                : e;
            }
            static MRToDate(e) {
              var t = e.split('_');
              return new Date(1 * t[0], 1 * t[1] - 1, 1 * t[2], 1 * t[3], 1 * t[4], 1 * t[5], 0);
            }
            static MRToDateWithMS(e) {
              var t = e.split('_');
              return new Date(
                1 * t[0],
                1 * t[1] - 1,
                1 * t[2],
                1 * t[3],
                1 * t[4],
                1 * t[5],
                1 * t[6]
              );
            }
            static AddSeconds(e, t) {
              return new Date(e.getTime() + 1e3 * t);
            }
            static ToMRFormat(e) {
              var t = e.getFullYear() + '_',
                n = e.getMonth() + 1 + '';
              return (
                (t += (1 == n.length ? '0' : '') + n + '_'),
                (t += (1 == (n = e.getDate() + '').length ? '0' : '') + n + '_'),
                (t += (1 == (n = e.getHours() + '').length ? '0' : '') + n + '_'),
                (t += (1 == (n = e.getMinutes() + '').length ? '0' : '') + n + '_') +
                  (1 == (n = e.getSeconds() + '').length ? '0' : '') +
                  n
              );
            }
            static GetDTStartSubtitle(e) {
              return this.MRToDate(e.start);
            }
            static GetDTEndSubtitle(e) {
              var t = this.MRToDate(e.start);
              return this.AddSeconds(t, e.duration / 10);
            }
            static SetSubtitlePosition(e, t) {
              var n = 1 * t.screen_width,
                s = 1 * t.screen_height,
                r = 1 * t.sub_left,
                i = 1 * t.sub_top,
                o = 1 * t.sub_width,
                a = t.sub_height;
              (e.style.position = 'absolute'),
                (e.style.left = (100 * r) / n + '%'),
                (e.style.top = (100 * i) / s + '%'),
                (e.style.width = (100 * o) / n + '%'),
                (e.style.height = (100 * a) / s + '%');
            }
            static SetSubtitlePositionCCPlus(e, t) {
              for (var n = -1, s = [], r = 0; r < t.length; r++) {
                var i = 1 * t[r].sub_top,
                  o = 1 * t[r].region;
                -1 == s.indexOf(o) && s.push(o), (-1 == n || n > i) && (n = i);
              }
              var a = s.length;
              for (
                a < 2 && (a = 2), e.style.height = 25 * a + 18 + 'px', r = 0;
                r < t.length;
                r++
              ) {
                var l = 1 * t[r].screen_width,
                  u = 1 * t[r].screen_height,
                  c = 1 * t[r].sub_left,
                  h = ((i = 1 * t[r].sub_top), 1 * t[r].sub_width),
                  d = t[r].sub_height,
                  p = document.createElement('img');
                p.setAttribute('src', t[r].url),
                  (p.style.position = 'absolute'),
                  (p.style.left = (100 * c) / l + '%'),
                  (p.style.width = (100 * h) / l + '%'),
                  (p.style.top = 22 + (100 * (i - n)) / (u - n) + '%'),
                  (p.style.height = (100 * d) / u - n + '%'),
                  e.appendChild(p);
              }
            }
            static searchNotSpace(e) {
              for (var t = 0; ' ' == e[t]; ) if (++t > e.length - 1) return -1;
              return t;
            }
            static searchLastNotSpace(e) {
              for (var t = e.length - 1; ' ' == e[t]; ) if (--t < 0) return -1;
              return t + 1;
            }
            static getSizeOfFreeAtom(e) {
              var t = 0,
                n = this.arr2int32(e, t),
                s = this.arr2Name(e, (t += 4));
              return (t += 4), 'free' == s ? n : 0;
            }
            static getFreeAtomObject(e) {
              for (var t = { audioChannelsNumber: 2 }, n = 0; n < e.length; ) {
                var s = this.arr2int32(e, n),
                  r = this.arr2Name(e, (n += 4));
                switch (((n += 4), r)) {
                  case 'stmp':
                    (t.timeStamp = this.arr2int64(e, n)), (n += 8);
                    break;
                  case 'ofst':
                    (t.offset = this.arr2int64(e, n)), (n += 8);
                    break;
                  case 'move':
                    (t.moveToLive = e[n]), n++;
                    break;
                  case 'chnl':
                    (t.audioChannelsNumber = e[n]), n++;
                    break;
                  case 'slvl':
                    t.soundLVL = new Array(s - 8);
                    for (var i = n; i < n + (s - 8); i++) t.soundLVL[i - n] = e[i];
                    n += s - 8;
                    break;
                  case 'errr':
                    var o = new Array(s - 8);
                    for (i = n; i < n + (s - 8); i++) o[i - n] = e[i];
                    (n += s - 8), (t.error = this.bin2String(o));
                    break;
                  default:
                    n += s - 8;
                }
              }
              return t;
            }
            static bin2String(e) {
              for (var t = '', n = 0; n < e.length; n += 2) {
                var s = e[n];
                e[n + 1] && (s += 256 * e[n + 1]), (t += String.fromCharCode(s));
              }
              return t;
            }
            static arr2int32(e, t) {
              var n = 0;
              return (
                (n += 256 * e[t] * 256 * 256),
                (n += 256 * e[t + 1] * 256),
                (n += 256 * e[t + 2]) + e[t + 3]
              );
            }
            static arr2Name(e, t) {
              return String.fromCharCode(e[t], e[t + 1], e[t + 2], e[t + 3]);
            }
            static arr2int64(e, t) {
              var n = 0;
              return (
                (n += 256 * e[t] * 256 * 256 * 256 * 256 * 256 * 256),
                (n += 256 * e[t + 1] * 256 * 256 * 256 * 256 * 256),
                (n += 256 * e[t + 2] * 256 * 256 * 256 * 256),
                (n += 256 * e[t + 3] * 256 * 256 * 256),
                (n += 256 * e[t + 4] * 256 * 256),
                (n += 256 * e[t + 5] * 256),
                (n += 256 * e[t + 6]) + e[t + 7]
              );
            }
            static secToTimeString(e) {
              let t = new Date(2e3, 0, 1, 0, 0, 0);
              t = new Date(t.getTime() + 1e3 * Math.abs(e));
              let n = t.getHours() + '';
              n.length < 2 && (n = '0' + n);
              let s = n + ':';
              return (
                (n = t.getMinutes() + ''),
                n.length < 2 && (n = '0' + n),
                (s += n + ':'),
                (n = t.getSeconds() + ''),
                n.length < 2 && (n = '0' + n),
                s + n
              );
            }
            static secToTimeStringWithMS(e) {
              let t = new Date(2e3, 0, 1, 0, 0, 0);
              t = new Date(t.getTime() + 1e3 * Math.abs(e));
              let n = t.getHours() + '';
              n.length < 2 && (n = '0' + n);
              let s = n + ':';
              for (
                n = t.getMinutes() + '',
                  n.length < 2 && (n = '0' + n),
                  s += n + ':',
                  n = t.getSeconds() + '',
                  n.length < 2 && (n = '0' + n),
                  s += n + '.',
                  n = t.getMilliseconds() + '';
                n.length < 3;

              )
                n = '0' + n;
              return s + n;
            }
          }
          return (e.webhost = null), (e.ashx = ''), e;
        })();
      class xh {
        static mainLoop(e) {
          if (null == e) return;
          if (null == document.getElementById(e.videoElement.id)) return;
          if (
            (-1 != e.gotoPart &&
              ((e.currentVideoPart = e.gotoPart),
              (e.currentAudioPart = e.gotoPart),
              (e.gotoPart = -1)),
            e.mediaSourceType == e.mediaSourceTypes.STORAGE)
          ) {
            if (
              1 * e.filesParts.duration <
              e.videoElement.currentTime - 1 * e.filesParts.one_sec_fwd
            )
              return e.videoElement.pause(), void setTimeout(xh.mainLoop, 40, e);
            null != e.filesParts.no_media_from &&
              (e.filesParts.no_media_from <=
              e.videoElement.currentTime - 1 * e.filesParts.one_sec_fwd
                ? ((e.videoElement.muted = !0),
                  e.filesParts.no_media_muted ||
                    (e.videoElement.previousSibling.style.opacity = '1.0'),
                  (e.filesParts.no_media_muted = !0),
                  (e.videoElement.style.opacity = '0.0'))
                : (e.filesParts.no_media_muted &&
                    ((e.filesParts.no_media_muted = !1),
                    (e.videoElement.muted = !1),
                    (e.videoElement.previousSibling.style.opacity = '0.0')),
                  (e.videoElement.style.opacity = '')));
          }
          if (
            e.mediaSourceType == e.mediaSourceTypes.FILE &&
            2 * e.currentAudioPart >= Math.floor(e.videoElement.duration)
          )
            return void setTimeout(xh.mainLoop, 40, e);
          let t = 10;
          e.mediaSourceType == e.mediaSourceTypes.LIVE && 1 == e.realLive && (t = 4);
          for (var n = 0; n < e.videoElement.buffered.length; n++)
            if (
              e.videoElement.buffered.end(n) - e.videoElement.currentTime > t &&
              e.videoElement.buffered.start(n) <= e.videoElement.currentTime
            )
              return void setTimeout(xh.mainLoop, 10, e);
          e.mediaSourceType != e.mediaSourceTypes.NONE &&
            xh.playAudio(e.mediaSource.sourceBuffers[0], e);
        }
        static onSeeking(e, t) {
          if (e.mediaSourceType == e.mediaSourceTypes.FILE) {
            let t = Math.floor(e.videoElement.currentTime / 2 - 1);
            e.gotoPart = t;
          }
          if (e.mediaSourceType == e.mediaSourceTypes.STORAGE) {
            let t =
              e.filesParts.parts[0].start_part +
              Math.floor(e.videoElement.currentTime / ((2 * e.filesParts.GOP_duration) / 1e3) - 1);
            t < e.filesParts.parts[0].start_part && (t = e.filesParts.parts[0].start_part),
              (e.gotoPart = t);
          }
        }
        static updateAudioFunct(e, t) {
          null != e &&
            (1 == e.audioOnly ? xh.mainLoop(e) : xh.playVideo(e.mediaSource.sourceBuffers[1], e));
        }
        static updateVideoFunct(e, t) {
          null != e && xh.mainLoop(e);
        }
        static playVideo(e, t) {
          if (null == t) return;
          let n = new XMLHttpRequest();
          if (
            (t.mediaSourceType == t.mediaSourceTypes.FILE &&
              (n.open(
                'GET',
                Th.AshxPipe(
                  './ashx/streamer/StreamingServer.ashx?playback=file&type=video&part=' +
                    t.currentVideoPart +
                    '&timestamp=0&file=' +
                    t.filePath +
                    '&test=' +
                    new Date().getTime()
                )
              ),
              t.currentVideoPart++),
            t.mediaSourceType == t.mediaSourceTypes.LIVE &&
              (-1 == t.currentVideoPart
                ? n.open(
                    'GET',
                    Th.AshxPipe(
                      './ashx/streamer/StreamingServer.ashx?playback=live&type=video&part=' +
                        t.currentVideoPart +
                        '&offset=' +
                        t.liveOffset +
                        '&media_root=' +
                        t.mediaRoot +
                        '&media_live_root=' +
                        t.mediaLiveRoot +
                        '&device=' +
                        t.deviceName +
                        '&test=' +
                        new Date().getTime()
                    )
                  )
                : (n.open(
                    'GET',
                    Th.AshxPipe(
                      './ashx/streamer/StreamingServer.ashx?playback=live&type=video&part=' +
                        t.currentVideoPart +
                        '&timestamp=' +
                        t.currentVideoTimeStamp +
                        '&live_microchunk_number=' +
                        t.currentLiveVideoMicroChunk +
                        '&media_root=' +
                        t.mediaLiveRoot +
                        '&device=' +
                        t.deviceName +
                        '&test=' +
                        new Date().getTime()
                    )
                  ),
                  (t.currentLiveVideoMicroChunk += 2)),
              t.currentVideoPart++),
            t.mediaSourceType == t.mediaSourceTypes.FAKELIVE &&
              (-1 == t.currentVideoPart
                ? (n.open(
                    'GET',
                    Th.AshxPipe(
                      './ashx/streamer/StreamingServer.ashx?playback=fakelive&type=video&part=' +
                        t.currentVideoPart +
                        '&media_root=' +
                        t.mediaRoot +
                        '&device=' +
                        t.deviceName +
                        '&live_start=' +
                        t.fakeLiveStart +
                        '&test=' +
                        new Date().getTime()
                    )
                  ),
                  (t.currentVideoPart = t.fakeLiveStartPart))
                : (n.open(
                    'GET',
                    Th.AshxPipe(
                      './ashx/streamer/StreamingServer.ashx?playback=fakelive&type=video&part=' +
                        t.currentVideoPart +
                        '&timestamp=' +
                        t.currentVideoTimeStamp +
                        '&media_root=' +
                        t.mediaRoot +
                        '&device=' +
                        t.deviceName +
                        '&live_start=' +
                        t.fakeLiveStart +
                        '&test=' +
                        new Date().getTime()
                    )
                  ),
                  t.currentVideoPart++)),
            t.mediaSourceType == t.mediaSourceTypes.STORAGE)
          )
            if (-1 == t.currentVideoPart)
              n.open(
                'GET',
                Th.AshxPipe(
                  './ashx/streamer/StreamingServer.ashx?playback=storage&type=video&part=' +
                    t.currentVideoPart +
                    '&media_root=' +
                    t.mediaRoot +
                    '&device=' +
                    t.deviceName +
                    '&file_start=' +
                    t.filesParts.parts[0].chunk_time +
                    '&alter_file_start=' +
                    t.filesParts.parts[0].alter_chunk_time +
                    '&duration=' +
                    t.filesParts.duration +
                    '&test=' +
                    new Date().getTime()
                )
              ),
                (t.currentVideoPart = t.filesParts.parts[0].start_part);
            else {
              let e = t.filesParts.parts[0].start_part,
                s = t.filesParts.parts[0].end_part - e,
                r = 0,
                i = 0,
                o = 0;
              for (; i < t.filesParts.parts.length && e + s <= t.currentVideoPart; )
                (o += t.filesParts.parts[i].end_part),
                  (e += s),
                  (r += t.filesParts.parts[i].vsamples),
                  i++,
                  i < t.filesParts.parts.length &&
                    (s = t.filesParts.parts[i].end_part - t.filesParts.parts[i].start_part);
              n.open(
                'GET',
                Th.AshxPipe(
                  './ashx/streamer/StreamingServer.ashx?playback=storage&type=video&sequence_number=' +
                    (t.currentVideoPart - t.filesParts.parts[0].start_part) +
                    '&part=' +
                    (t.currentVideoPart - o) +
                    '&timestamp=' +
                    r * t.filesParts.GOP_duration +
                    '&starttimestamp=' +
                    t.filesParts.parts[i].vstartsample * t.filesParts.GOP_duration +
                    '&media_root=' +
                    t.mediaRoot +
                    '&device=' +
                    t.deviceName +
                    '&file_start=' +
                    t.filesParts.parts[i].chunk_time +
                    '&alter_file_start=' +
                    t.filesParts.parts[i].alter_chunk_time +
                    '&chunk_from_live_extension=' +
                    t.filesParts.parts[i].chunk_from_live_extension +
                    '&test=' +
                    new Date().getTime()
                )
              ),
                t.currentVideoPart++;
            }
          try {
            n.send(),
              (n.responseType = 'arraybuffer'),
              n.addEventListener(
                'readystatechange',
                function (t, s) {
                  if (n.readyState == n.DONE)
                    try {
                      let r = Th.getSizeOfFreeAtom(new Uint8Array(n.response, 0, 8));
                      if (r > 0) {
                        let e = Th.getFreeAtomObject(new Uint8Array(n.response, 8, r - 8));
                        if (e.error)
                          return t.mediaSourceType == t.mediaSourceTypes.LIVE &&
                            t.mediaSourceType == t.mediaSourceTypes.LIVE &&
                            t.currentVideoPart > 0
                            ? ((t.currentLiveVideoMicroChunk -= 2),
                              t.currentVideoPart--,
                              void setTimeout(xh.playVideo, 1e3, t.mediaSource.sourceBuffers[1], t))
                            : void t.logPlayerError(
                                'Stream Error.',
                                'Exception while getting video microchunk :[1] ' + e.error
                              );
                        t.mediaSourceType == t.mediaSourceTypes.LIVE && t.logPlayerError('', ''),
                          t.mediaSourceType == t.mediaSourceTypes.LIVE &&
                            1 == t.realLive &&
                            1 * e.moveToLive > 0 &&
                            (t.currentLiveVideoMicroChunk++,
                            t.currentLiveAudioMicroChunk++,
                            t.realLiveCorrection++),
                            // console.log('move 1 sec forward')
                          (t.currentVideoTimeStamp = e.timeStamp);
                      }
                      if (void 0 !== e)
                        try {
                          e.appendBuffer(new Uint8Array(n.response));
                        } catch (s) {}
                    } catch (s) {
                      t.logPlayerError(
                        'Stream Error.',
                        'Exception while getting video microchunk :[2] ' + s.message
                      );
                    }
                }.bind(n, t),
                !1
              );
          } catch (s) {
            t.logPlayerError(
              'Stream Error.',
              'Exception while getting video microchunk :[3] ' + s.message
            );
          }
        }
        static getAddLang(e, t, n) {
          if (null == e) return;
          let s = new XMLHttpRequest();
          s.open('GET', n);
          try {
            s.send(),
              (s.responseType = 'arraybuffer'),
              s.addEventListener(
                'readystatechange',
                function (e, n) {
                  if (s.readyState == s.DONE)
                    try {
                      let n = Th.getSizeOfFreeAtom(new Uint8Array(s.response, 0, 8));
                      if (n > 0) {
                        let i = Th.getFreeAtomObject(new Uint8Array(s.response, 8, n - 8));
                        if (i.error) return;
                        if (e.addLangs)
                          for (var r = 0; r < e.addLangs.length; r++)
                            e.addLangs[r] == t && e.metaDataForAddLangs[r].push(i);
                      }
                    } catch (n) {}
                }.bind(s, e),
                !1
              );
          } catch (r) {}
        }
        static playAudio(e, t) {
          if (null == t) return;
          let n = new XMLHttpRequest();
          if (
            (t.mediaSourceType == t.mediaSourceTypes.FILE &&
              (n.open(
                'GET',
                Th.AshxPipe(
                  './ashx/streamer/StreamingServer.ashx?playback=file&type=audio&part=' +
                    t.currentAudioPart +
                    '&timestamp=0&file=' +
                    t.filePath +
                    '&audio_offset=' +
                    2 * t.currentAudioPart +
                    '&test=' +
                    new Date().getTime()
                )
              ),
              t.currentAudioPart++),
            t.mediaSourceType == t.mediaSourceTypes.LIVE)
          ) {
            if (-1 == t.currentAudioPart)
              n.open(
                'GET',
                Th.AshxPipe(
                  './ashx/streamer/StreamingServer.ashx?playback=live&type=audio&part=' +
                    t.currentAudioPart +
                    '&offset=' +
                    t.liveOffset +
                    '&media_root=' +
                    t.mediaRoot +
                    '&media_live_root=' +
                    t.mediaLiveRoot +
                    '&device=' +
                    t.deviceName +
                    '&lang=' +
                    t.lang +
                    '&test=' +
                    new Date().getTime()
                )
              );
            else {
              if (
                (n.open(
                  'GET',
                  Th.AshxPipe(
                    './ashx/streamer/StreamingServer.ashx?playback=live&type=audio&part=' +
                      t.currentAudioPart +
                      '&timestamp=' +
                      t.currentAudioTimeStamp +
                      '&live_microchunk_number=' +
                      t.currentLiveAudioMicroChunk +
                      '&media_root=' +
                      t.mediaLiveRoot +
                      '&device=' +
                      t.deviceName +
                      '&lang=' +
                      t.lang +
                      '&audio_offset=' +
                      2 * t.currentAudioPart +
                      '&test=' +
                      new Date().getTime()
                  )
                ),
                t.addLangs && t.addLangs.length > 0)
              )
                for (var s = 0; s < t.addLangs.length; s++)
                  ('' == t.lang ? t.addLangs[0] : t.lang) != t.addLangs[s] &&
                    this.getAddLang(
                      t,
                      t.addLangs[s],
                      Th.AshxPipe(
                        './ashx/streamer/StreamingServer.ashx?playback=live&type=audio&part=' +
                          t.currentAudioPart +
                          '&timestamp=' +
                          t.currentAudioTimeStamp +
                          '&live_microchunk_number=' +
                          t.currentLiveAudioMicroChunk +
                          '&media_root=' +
                          t.mediaLiveRoot +
                          '&device=' +
                          t.deviceName +
                          '&lang=' +
                          (0 == s ? '' : t.addLangs[s]) +
                          '&audio_offset=' +
                          2 * t.currentAudioPart +
                          '&test=' +
                          new Date().getTime()
                      )
                    );
              t.currentLiveAudioMicroChunk += 2;
            }
            t.currentAudioPart++;
          }
          if (t.mediaSourceType == t.mediaSourceTypes.FAKELIVE)
            if (-1 == t.currentAudioPart)
              n.open(
                'GET',
                Th.AshxPipe(
                  './ashx/streamer/StreamingServer.ashx?playback=fakelive&type=audio&part=' +
                    t.currentAudioPart +
                    '&media_root=' +
                    t.mediaRoot +
                    '&device=' +
                    t.deviceName +
                    '&live_start=' +
                    t.fakeLiveStart +
                    '&lang=' +
                    t.lang +
                    '&test=' +
                    new Date().getTime()
                )
              ),
                (t.currentAudioPart = t.fakeLiveStartPart);
            else {
              if (
                (n.open(
                  'GET',
                  Th.AshxPipe(
                    './ashx/streamer/StreamingServer.ashx?playback=fakelive&type=audio&part=' +
                      t.currentAudioPart +
                      '&timestamp=' +
                      t.currentAudioTimeStamp +
                      '&media_root=' +
                      t.mediaRoot +
                      '&device=' +
                      t.deviceName +
                      '&live_start=' +
                      t.fakeLiveStart +
                      '&lang=' +
                      t.lang +
                      '&audio_offset=' +
                      2 * (t.currentAudioPart - t.fakeLiveStartPart) +
                      '&test=' +
                      new Date().getTime()
                  )
                ),
                t.addLangs &&
                  t.addLangs.length > 0 &&
                  ('' == t.lang ? t.addLangs[0] : t.lang) != t.addLangs[s])
              )
                for (s = 0; s < t.addLangs.length; s++)
                  this.getAddLang(
                    t,
                    t.addLangs[s],
                    Th.AshxPipe(
                      './ashx/streamer/StreamingServer.ashx?playback=fakelive&type=audio&part=' +
                        t.currentAudioPart +
                        '&timestamp=' +
                        t.currentAudioTimeStamp +
                        '&media_root=' +
                        t.mediaRoot +
                        '&device=' +
                        t.deviceName +
                        '&live_start=' +
                        t.fakeLiveStart +
                        '&lang=' +
                        (0 == s ? '' : t.addLangs[s]) +
                        '&audio_offset=' +
                        2 * (t.currentAudioPart - t.fakeLiveStartPart) +
                        '&test=' +
                        new Date().getTime()
                    )
                  );
              t.currentAudioPart++;
            }
          if (t.mediaSourceType == t.mediaSourceTypes.STORAGE)
            if (-1 == t.currentAudioPart)
              n.open(
                'GET',
                Th.AshxPipe(
                  './ashx/streamer/StreamingServer.ashx?playback=storage&type=audio&part=' +
                    t.currentAudioPart +
                    '&media_root=' +
                    t.mediaRoot +
                    '&device=' +
                    t.deviceName +
                    '&file_start=' +
                    t.filesParts.parts[0].chunk_time +
                    '&alter_file_start=' +
                    t.filesParts.parts[0].alter_chunk_time +
                    '&duration=' +
                    t.filesParts.duration +
                    '&lang=' +
                    t.lang +
                    '&test=' +
                    new Date().getTime()
                )
              ),
                (t.currentAudioPart = t.filesParts.parts[0].start_part);
            else {
              let e = t.filesParts.parts[0].start_part,
                r = t.filesParts.parts[0].end_part - e,
                i = 0,
                o = 0,
                a = 0;
              for (; o < t.filesParts.parts.length && e + r <= t.currentAudioPart; )
                (a += t.filesParts.parts[o].end_part),
                  (e += r),
                  (i += t.filesParts.parts[o].asamples),
                  o++,
                  o < t.filesParts.parts.length &&
                    (r = t.filesParts.parts[o].end_part - t.filesParts.parts[o].start_part);
              if (o >= t.filesParts.parts.length) return void setTimeout(xh.mainLoop, 40, t);
              if (
                (n.open(
                  'GET',
                  Th.AshxPipe(
                    './ashx/streamer/StreamingServer.ashx?playback=storage&type=audio&sequence_number=' +
                      (t.currentAudioPart - t.filesParts.parts[0].start_part) +
                      '&part=' +
                      (t.currentAudioPart - a) +
                      '&timestamp=' +
                      1024 * i +
                      '&starttimestamp=' +
                      1024 * t.filesParts.parts[o].astartsample +
                      '&media_root=' +
                      t.mediaRoot +
                      '&device=' +
                      t.deviceName +
                      '&file_start=' +
                      t.filesParts.parts[o].chunk_time +
                      '&alter_file_start=' +
                      t.filesParts.parts[o].alter_chunk_time +
                      '&chunk_from_live_extension=' +
                      t.filesParts.parts[o].chunk_from_live_extension +
                      '&lang=' +
                      t.lang +
                      '&audio_offset=' +
                      2 * (t.currentAudioPart - t.filesParts.parts[0].start_part) +
                      '&test=' +
                      new Date().getTime()
                  )
                ),
                t.addLangs && t.addLangs.length > 0)
              )
                for (s = 0; s < t.addLangs.length; s++)
                  ('' == t.lang ? t.addLangs[0] : t.lang) != t.addLangs[s] &&
                    this.getAddLang(
                      t,
                      t.addLangs[s],
                      Th.AshxPipe(
                        './ashx/streamer/StreamingServer.ashx?playback=storage&type=audio&sequence_number=' +
                          (t.currentAudioPart - t.filesParts.parts[0].start_part) +
                          '&part=' +
                          (t.currentAudioPart % 150) +
                          '&timestamp=' +
                          1024 * i +
                          '&starttimestamp=' +
                          1024 * t.filesParts.parts[o].astartsample +
                          '&media_root=' +
                          t.mediaRoot +
                          '&device=' +
                          t.deviceName +
                          '&file_start=' +
                          t.filesParts.parts[o].chunk_time +
                          '&chunk_from_live_extension=' +
                          t.filesParts.parts[o].chunk_from_live_extension +
                          '&lang=' +
                          (0 == s ? '' : t.addLangs[s]) +
                          '&audio_offset=' +
                          2 * (t.currentAudioPart - t.filesParts.parts[0].start_part) +
                          '&test=' +
                          new Date().getTime()
                      )
                    );
              t.currentAudioPart++;
            }
          try {
            n.send(),
              (n.responseType = 'arraybuffer'),
              n.addEventListener(
                'readystatechange',
                function (t, s) {
                  if (n.readyState == n.DONE)
                    try {
                      let i = Th.getSizeOfFreeAtom(new Uint8Array(n.response, 0, 8));
                      if (i > 0) {
                        let e = Th.getFreeAtomObject(new Uint8Array(n.response, 8, i - 8));
                        if (e.error)
                          return t.mediaSourceType == t.mediaSourceTypes.LIVE &&
                            t.currentAudioPart > 0
                            ? ((t.currentLiveAudioMicroChunk -= 2),
                              t.currentAudioPart--,
                              void setTimeout(xh.mainLoop, 1e3, t))
                            : void t.logPlayerError(
                                'Stream Error.',
                                'Exception while getting audio microchunk :[1] ' + e.error
                              );
                        if (
                          (t.mediaSourceType == t.mediaSourceTypes.LIVE && t.logPlayerError('', ''),
                          t.mediaSourceType == t.mediaSourceTypes.LIVE &&
                            1 == t.realLive &&
                            1 == t.audioOnly &&
                            1 * e.moveToLive > 0 &&
                            (t.currentLiveAudioMicroChunk++, t.realLiveCorrection++),
                          (t.currentAudioTimeStamp = e.timeStamp),
                          t.addLangs)
                        ) {
                          let n = '' == t.lang ? t.addLangs[0] : t.lang;
                          for (var r = 0; r < t.addLangs.length; r++)
                            t.addLangs[r] == n && t.metaDataForAddLangs[r].push(e);
                        }
                      }
                      if (void 0 !== e)
                        try {
                          e.appendBuffer(new Uint8Array(n.response));
                        } catch (s) {}
                    } catch (s) {
                      t.logPlayerError(
                        'Stream Error.',
                        'Exception while getting audio microchunk :[2] ' + s.message
                      );
                    }
                }.bind(n, t),
                !1
              );
          } catch (r) {
            t.logPlayerError(
              'Stream Error.',
              'Exception while getting audio microchunk :[3] ' + r.message
            );
          }
        }
        static sourceOpen(e, t) {
          try {
            if (this.sourceBuffers.length > 0) return;
            this.addSourceBuffer('audio/mp4;codecs="mp4a.40.2"'),
              this.sourceBuffers[0].addEventListener(
                'updateend',
                xh.updateAudioFunct.bind(this.sourceBuffers[0], e),
                !1
              ),
              0 == e.audioOnly &&
                (this.addSourceBuffer('video/mp4;codecs="avc1.4D001F"'),
                this.sourceBuffers[1].addEventListener(
                  'updateend',
                  xh.updateVideoFunct.bind(this.sourceBuffers[1], e),
                  !1
                )),
              xh.mainLoop(e);
          } catch (t) {
            return void e.logPlayerError(
              'Create Audio Video Buffers Error.',
              'Exception calling addSourceBuffer for video or audio ' + t.message
            );
          }
        }
      }
      class kh {
        constructor(e, t) {
          (this.waiting = !1),
            (this.mediaSourceTypes = { NONE: 0, FILE: 1, LIVE: 2, FAKELIVE: 3, STORAGE: 4 }),
            (this.mediaSourceType = this.mediaSourceTypes.NONE),
            (this.filePath = ''),
            (this.mediaRoot = ''),
            (this.mediaLiveRoot = ''),
            (this.deviceName = ''),
            (this.lang = ''),
            (this.addLangs = []),
            (this.liveOffset = ''),
            (this.fromDateTime = '0000_00_00_00_00_00'),
            (this.toDateTime = '0000_00_00_00_00_00'),
            (this.audioOnly = !1),
            (this.realLive = !1),
            (this.realLiveCorrection = 0),
            (this.currentVideoPart = -1),
            (this.currentAudioPart = -1),
            (this.currentVideoTimeStamp = 0),
            (this.currentAudioTimeStamp = 0),
            (this.liveStartTime = '0000_00_00_00_00_00'),
            (this.currentLiveVideoMicroChunk = 0),
            (this.currentLiveAudioMicroChunk = 0),
            (this.fakeLiveStart = '0000_00_00_00_00_00'),
            (this.fakeLiveStartPart = 0),
            (this.filesParts = null),
            (this.metaDataForAddLangs = []),
            (this.gotoPart = -1),
            (this.logPlayerError = function (e, t) {
              -1 != t.indexOf('ActusException::') &&
                ((e = t.split('::')[1]), (t = t.split('::')[2]));
              var n = document.createEvent('Event');
              (n.data = { title: e, description: t }),
                n.initEvent('playerEvent', !0, !0),
                this.parentTag.dispatchEvent(n);
            }),
            (this.PlayLive = function (e, t, n, s, r, i, o) {
              (this.waiting = !0),
                (this.audioOnly = o),
                (this.mediaRoot = e),
                (this.mediaLiveRoot = t),
                (this.deviceName = n),
                (this.lang = s),
                (this.liveOffset = r),
                (this.metaDataForAddLangs = []),
                (this.mchunk_test = -1),
                (this.test_counter = 0),
                null == i
                  ? setTimeout(this.TestLive, 0, this)
                  : this.PlayLiveEnd(e, t, n, s, r, i, o);
            }),
            (this.TestLive = function (e) {
              var t = new XMLHttpRequest();
              t.open(
                'GET',
                Th.AshxPipe(
                  './ashx/streamer/GetStartParameters.ashx?playback=live&offset=' +
                    e.liveOffset +
                    '&start_date=null&media_root=' +
                    e.mediaRoot +
                    '&media_live_root=' +
                    e.mediaLiveRoot +
                    '&device=' +
                    e.deviceName +
                    '&test=' +
                    new Date().getTime()
                )
              );
              try {
                t.send(),
                  (t.responseType = 'text'),
                  t.addEventListener(
                    'readystatechange',
                    function (n, s) {
                      if (t.readyState == t.DONE)
                        try {
                          var r = JSON.parse(t.response);
                          if ('' != r.error)
                            return void n.logPlayerError('No live media.', r.error);
                          if (
                            ((n.filesParts = r),
                            -1 == n.mchunk_test && (n.mchunk_test = 1 * r.fst_mchunk),
                            n.mchunk_test == 1 * r.fst_mchunk)
                          )
                            return (
                              n.test_counter++,
                              n.test_counter > 20
                                ? ((n.waiting = !1),
                                  void n.logPlayerError(
                                    'No live media.',
                                    'Recorder doesnt create new chunks.'
                                  ))
                                : void setTimeout(n.TestLive, 1e3, n)
                            );
                          n.PlayLiveEnd(
                            n.mediaRoot,
                            n.mediaLiveRoot,
                            n.deviceName,
                            n.lang,
                            n.liveOffset,
                            null,
                            n.audioOnly
                          ),
                            (e.waiting = !1);
                        } catch (s) {
                          (n.waiting = !1),
                            n.logPlayerError(
                              'Load Error.',
                              'Exception while getting live start parameters :[1] ' + s.message
                            );
                        }
                    }.bind(t, e),
                    !1
                  );
              } catch (n) {
                (e.waiting = !1),
                  e.logPlayerError(
                    'Load Error.',
                    'Exception while getting live start parameters :[2] ' + n.message
                  );
              }
            }),
            (this.PlayLiveEnd = function (e, t, n, s, r, i, o) {
              this.waiting = !0;
              var a = null == i ? 'null' : Th.ToMRFormat(i),
                l = new XMLHttpRequest();
              l.open(
                'GET',
                Th.AshxPipe(
                  './ashx/streamer/GetStartParameters.ashx?playback=live&offset=' +
                    this.liveOffset +
                    '&start_date=' +
                    a +
                    '&media_root=' +
                    this.mediaRoot +
                    '&media_live_root=' +
                    this.mediaLiveRoot +
                    '&device=' +
                    this.deviceName +
                    '&test=' +
                    new Date().getTime()
                )
              );
              try {
                l.send(),
                  (l.responseType = 'text'),
                  l.addEventListener(
                    'readystatechange',
                    function (e, t) {
                      if (l.readyState == l.DONE)
                        try {
                          var n = JSON.parse(l.response);
                          if ('' != n.error) return void e.logPlayerError('Load Error.', n.error);
                          (e.filesParts = n),
                            'live' == n.type &&
                              ((e.mediaSourceType = e.mediaSourceTypes.LIVE),
                              (e.liveStartTime = n.time_start),
                              (e.currentLiveVideoMicroChunk = 1 * n.fst_mchunk),
                              (e.currentLiveAudioMicroChunk = 1 * n.fst_mchunk)),
                            'fakelive' == n.type &&
                              ((e.realLive = !1),
                              (e.mediaSourceType = e.mediaSourceTypes.FAKELIVE),
                              (e.fakeLiveStart = n.time_start),
                              (e.fakeLiveStartPart = n.part)),
                            (e.mediaSource = new (window.MediaSource ||
                              window.WebKitMediaSource)()),
                            e.mediaSource.addEventListener(
                              'sourceopen',
                              xh.sourceOpen.bind(e.mediaSource, e),
                              !1
                            );
                          var s = URL.createObjectURL(e.mediaSource);
                          (e.videoElement.src = s),
                            (e.videoElement.style.opacity = ''),
                            (e.videoElement.previousSibling.style.opacity = '0.0'),
                            e.videoElement.addEventListener(
                              'seeking',
                              xh.onSeeking.bind(e.videoElement, e),
                              !1
                            ),
                            (e.waiting = !1);
                        } catch (t) {
                          (e.waiting = !1),
                            e.logPlayerError(
                              'Load Error.',
                              'Exception while getting live start parameters :[1] ' + t.message
                            );
                        }
                    }.bind(l, this),
                    !1
                  );
              } catch (u) {
                (this.waiting = !1),
                  this.logPlayerError(
                    'Load Error.',
                    'Exception while getting live start parameters :[2] ' + u.message
                  );
              }
            }),
            (this.PlayStorage = function (e, t, n, s, r, i, o, a) {
              (this.waiting = !0),
                (this.audioOnly = a),
                (this.mediaRoot = e),
                (this.deviceName = t),
                (this.lang = n),
                (this.fromDateTime = s),
                (this.toDateTime = r),
                (this.metaDataForAddLangs = []);
              var l = new XMLHttpRequest();
              l.open(
                'GET',
                Th.AshxPipe(
                  './ashx/streamer/GetStartParameters.ashx?playback=storage&media_root=' +
                    this.mediaRoot +
                    '&device=' +
                    this.deviceName +
                    '&from=' +
                    this.fromDateTime +
                    '&to=' +
                    this.toDateTime +
                    '&test=' +
                    new Date().getTime()
                )
              );
              try {
                l.send(),
                  (l.responseType = 'text'),
                  l.addEventListener(
                    'readystatechange',
                    function (e, t) {
                      if (l.readyState == l.DONE)
                        try {
                          e.mediaSourceType = e.mediaSourceTypes.STORAGE;
                          var n = JSON.parse(l.response);
                          if ('' != n.error) return void e.logPlayerError('Load Error.', n.error);
                          (e.filesParts = n),
                            (e.mediaSource = new (window.MediaSource ||
                              window.WebKitMediaSource)()),
                            e.mediaSource.addEventListener(
                              'sourceopen',
                              xh.sourceOpen.bind(e.mediaSource, e),
                              !1
                            );
                          var s = URL.createObjectURL(e.mediaSource);
                          (e.videoElement.src = s),
                            (e.videoElement.style.opacity = ''),
                            (e.videoElement.previousSibling.style.opacity = '0.0'),
                            null != o && 0 == o && (e.videoElement.autoplay = !1),
                            e.videoElement.addEventListener(
                              'seeking',
                              xh.onSeeking.bind(e.videoElement, e),
                              !1
                            ),
                            (e.videoElement.currentTime =
                              (i && 1 * i > 0 ? 1 * i : 0) +
                              (1 * e.filesParts.one_sec_fwd > 0
                                ? 1 * e.filesParts.one_sec_fwd
                                : 0)),
                            (e.waiting = !1);
                        } catch (t) {
                          (e.waiting = !1),
                            e.logPlayerError(
                              'Load Error.',
                              'Exception while getting storage start parameters :[1] ' + t.message
                            );
                        }
                    }.bind(l, this),
                    !1
                  );
              } catch (u) {
                (this.waiting = !1),
                  this.logPlayerError(
                    'Load Error.',
                    'Exception while getting storage start parameters :[2] ' + u.message
                  );
              }
            }),
            (this.videoElement = e),
            (this.parentTag = t);
        }
        setAdditionalLanguages(e) {
          (this.addLangs = []), (this.metaDataForAddLangs = []);
          for (var t = 0; t < e.length; t++)
            this.metaDataForAddLangs.push([]), this.addLangs.push(e[t]);
        }
        PlayFile(e, t) {
          (this.audioOnly = t),
            (this.mediaSourceType = this.mediaSourceTypes.FILE),
            (this.filePath = e),
            (this.metaDataForAddLangs = []),
            (this.mediaSource = new (window.MediaSource || window.WebKitMediaSource)()),
            this.mediaSource.addEventListener(
              'sourceopen',
              xh.sourceOpen.bind(this.mediaSource, this),
              !1
            );
          var n = URL.createObjectURL(this.mediaSource);
          (this.videoElement.src = n),
            this.videoElement.addEventListener(
              'seeking',
              xh.onSeeking.bind(this.videoElement, this),
              !1
            );
        }
      }
      let Ch = (() => {
        class e {
          static support() {
            let e = document.createElement('canvas'),
              t = e.getContext('2d');
            return {
              canvas: !!t,
              imageData: !!t.getImageData,
              dataURL: !!e.toDataURL,
              btoa: !!window.btoa,
            };
          }
          static scaleCanvas(e, t, n) {
            var s = e.width,
              r = e.height;
            null == t && (t = s), null == n && (n = r);
            var i = document.createElement('canvas'),
              o = i.getContext('2d');
            return (i.width = t), (i.height = n), o.drawImage(e, 0, 0, s, r, 0, 0, t, n), i;
          }
          static getDataURL(t, n, s, r) {
            return (t = e.scaleCanvas(t, s, r)).toDataURL(n);
          }
          static saveFile(e, t) {
            var n = document.createElement('a');
            (n.download = t + '.png'),
              (n.href = e),
              document.body.appendChild(n),
              n.click(),
              document.body.removeChild(n);
          }
          static genImage(e) {
            var t = document.createElement('img');
            return (t.src = e), t;
          }
          static fixType(e) {
            return (
              'image/' + (e = e.toLowerCase().replace(/jpg/i, 'jpeg')).match(/png|jpeg|bmp|gif/)[0]
            );
          }
          static encodeData(e) {
            if (!window.btoa) throw 'btoa undefined';
            var t = '';
            if ('string' == typeof e) t = e;
            else for (var n = 0; n < e.length; n++) t += String.fromCharCode(e[n]);
            return btoa(t);
          }
          static getImageData(e) {
            var t = e.width,
              n = e.height;
            return e.getContext('2d').getImageData(0, 0, t, n);
          }
          static makeURI(e, t) {
            return 'data:' + t + ';base64,' + e;
          }
          static saveAsImage(t, n, s, r, i) {
            if (e.$support.canvas && e.$support.dataURL)
              if (
                ('string' == typeof t && (t = document.getElementById(t)),
                null == r && (r = 'png'),
                (r = e.fixType(r)),
                /bmp/.test(r))
              ) {
                var o = e.getImageData(e.scaleCanvas(t, n, s)),
                  a = e.genBitmapImage(o);
                e.saveFile(e.makeURI(a, e.downloadMime), i);
              } else {
                var l = e.getDataURL(t, r, n, s);
                e.saveFile(l.replace(r, e.downloadMime), i);
              }
          }
          static convertToImage(t, n, s, r) {
            if (e.$support.canvas && e.$support.dataURL) {
              if (
                ('string' == typeof t && (t = document.getElementById(t)),
                null == r && (r = 'png'),
                (r = e.fixType(r)),
                /bmp/.test(r))
              ) {
                var i = e.getImageData(e.scaleCanvas(t, n, s)),
                  o = e.genBitmapImage(i);
                return e.genImage(e.makeURI(o, 'image/bmp'));
              }
              var a = e.getDataURL(t, r, n, s);
              return e.genImage(a);
            }
          }
          static saveAsPNG(t, n, s, r) {
            return e.saveAsImage(t, n, s, 'png', r);
          }
          static saveAsJPEG(t, n, s, r) {
            return e.saveAsImage(t, n, s, 'jpeg', r);
          }
          static saveAsGIF(t, n, s, r) {
            return e.saveAsImage(t, n, s, 'gif', r);
          }
          static saveAsBMP(t, n, s, r) {
            return e.saveAsImage(t, n, s, 'bmp', r);
          }
          static convertToPNG(t, n, s) {
            return e.convertToImage(t, n, s, 'png');
          }
          static convertToJPEG(t, n, s) {
            return e.convertToImage(t, n, s, 'jpeg');
          }
          static convertToGIF(t, n, s) {
            return e.convertToImage(t, n, s, 'gif');
          }
          static convertToBMP(t, n, s) {
            return e.convertToImage(t, n, s, 'bmp');
          }
        }
        return (
          (e.downloadMime = 'image/octet-stream'),
          (e.$support = e.support()),
          (e.genBitmapImage = function (t) {
            var n = t.width,
              s = t.height,
              r = n * s * 3,
              i = r + 54,
              o = [
                66,
                77,
                255 & i,
                (i >> 8) & 255,
                (i >> 16) & 255,
                (i >> 24) & 255,
                0,
                0,
                0,
                0,
                54,
                0,
                0,
                0,
              ],
              a = [
                40,
                0,
                0,
                0,
                255 & n,
                (n >> 8) & 255,
                (n >> 16) & 255,
                (n >> 24) & 255,
                255 & s,
                (s >> 8) & 255,
                (s >> 16) & 255,
                (s >> 24) & 255,
                1,
                0,
                24,
                0,
                0,
                0,
                0,
                0,
                255 & r,
                (r >> 8) & 255,
                (r >> 16) & 255,
                (r >> 24) & 255,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
              ],
              l = (4 - ((3 * n) % 4)) % 4,
              u = t.data,
              c = '',
              h = n << 2,
              d = s,
              p = String.fromCharCode;
            do {
              for (var f = h * (d - 1), m = '', g = 0; g < n; g++) {
                var y = g << 2;
                m += p(u[f + y + 2]) + p(u[f + y + 1]) + p(u[f + y]);
              }
              for (var _ = 0; _ < l; _++) m += String.fromCharCode(0);
              c += m;
            } while (--d);
            return e.encodeData(o.concat(a)) + e.encodeData(c);
          }),
          e
        );
      })();
      class Ph {
        constructor(e, t, n) {
          (this.mobile = !1),
            (this.logoUrl = void 0),
            (this.error = null),
            (this.curlang = 'eng'),
            (this.channelAudio = []),
            (this.currentAudioLevels = []),
            (this.videoH = 0),
            (this.videoW = 0),
            (this.mediaSyncCounter = 0),
            (this.realLiveWatcherPositionBak = 0),
            (this.prevPosition = 0),
            (this.bufferingCounter = void 0),
            (this.mutePlayer = function (e) {
              this.SetMute(e);
            }),
            (this.backwardSpeed = 0),
            (this.subtitles = ''),
            (this.subtitles_name = ''),
            (this.sbtlStructure = []),
            (this.cursbtl = ''),
            (this.subtitlesOnScreen = new Array()),
            (this.subtitles_arr = []),
            (this.teletext_arr = []),
            (this.widthControl = function (e) {}),
            (this.shortt = null),
            (this.shorttb = null),
            (this.longt = null),
            (this.longtb = null),
            (this.range = null),
            (this.momentary = null),
            (this.truepeak = null),
            (this.momentaryperc = null),
            (this.truepeakperc = null),
            (this.screenShot = function (e) {
              var t = this.videoElement,
                n = t.parentNode.children[4],
                s = document.createElement('canvas');
              document.body.appendChild(s),
                (s.height = t.videoHeight),
                (s.width = t.videoWidth),
                (s.style.visibility = 'hidden');
              var r = s.getContext('2d');
              r.drawImage(t, 0, 0, s.width, s.height);
              for (var i = !1, o = 0; o < n.children.length; o++) {
                if ('svg' == n.children[o].tagName) {
                  i = !0;
                  var a = n.children[o].outerHTML.replace(/>,</g, '><').replace(/&nbsp;/g, ' ');
                  this.drawInlineSVG(r, a, function () {
                    Ch.saveAsPNG(s, s.width, s.height, e), document.body.removeChild(s);
                  });
                }
                if ('IMG' == n.children[o].tagName) {
                  var l = n.children[o].style.left.replace('%', ''),
                    u = n.children[o].style.top.replace('%', ''),
                    c = n.children[o].style.width.replace('%', ''),
                    h = n.children[o].style.height.replace('%', '');
                  r.drawImage(
                    n.children[o],
                    (l = (l * s.width) / 100),
                    (u = (u * s.height) / 100),
                    (c = (c * s.width) / 100),
                    (h = (h * s.height) / 100)
                  );
                }
              }
              i ||
                (s.toDataURL(),
                Ch.saveAsPNG(s, s.width, s.height, e),
                document.body.removeChild(s));
            }),
            (this.parentTag = e),
            (this.ccplusPlace = t),
            (this.mobile = 'mobile' == e.id),
            (this.videoElement = document.createElement('video')),
            (this.videoElement.controls = !1),
            (this.videoElement.autoplay = !0),
            (this.videoElement.style.position = 'absolute'),
            (this.videoElement.id = new Date().getTime()),
            (this.audio_logo = document.createElement('div')),
            (this.audio_logo.style.position = 'absolute'),
            (this.audio_logo.style.top = '0%'),
            (this.audio_logo.style.left = '0%'),
            (this.audio_logo.style.bottom = '0%'),
            (this.audio_logo.style.right = '0%'),
            (this.canvas = document.createElement('canvas')),
            (this.canvas.style.position = 'absolute'),
            (this.canvas.style.top = '0%'),
            (this.canvas.style.left = '0%'),
            (this.canvas.style.bottom = '0%'),
            (this.canvas.style.right = '0%'),
            1 == this.mobile && (this.canvas.style.pointerEvents = 'none'),
            (this.canvasCtx = this.canvas.getContext('2d')),
            (this.subtitleElement = document.createElement('div')),
            (this.subtitleElement.style.position = 'absolute'),
            (this.subtitleElement.style.top = '0%'),
            (this.subtitleElement.style.left = '0%'),
            (this.subtitleElement.style.bottom = '0%'),
            (this.subtitleElement.style.right = '0%'),
            (this.subtitleElement.style.fontFamily = 'monospace'),
            1 == this.mobile && (this.subtitleElement.style.pointerEvents = 'none'),
            (this.messageElement = document.createElement('div')),
            (this.messageElement.style.position = 'absolute'),
            (this.messageElement.style.top = '0%'),
            (this.messageElement.style.left = '0%'),
            (this.messageElement.style.bottom = '0%'),
            (this.messageElement.style.right = '0%'),
            1 == this.mobile && (this.messageElement.style.pointerEvents = 'none'),
            (this.video_background = document.createElement('div')),
            (this.video_background.style.position = 'absolute'),
            (this.video_background.style.top = '0%'),
            (this.video_background.style.left = '0%'),
            (this.video_background.style.bottom = '0%'),
            (this.video_background.style.right = '0%'),
            (this.video_background.style.opacity = '0.0'),
            (this.video_background.innerHTML =
              "<table style='width:100%; height: 100%; background: transparent; color: white; font-size: 24px'><tr><td width='50%'></td><td></td><td width='50%'></td></tr><tr><td></td><td><span style='padding: 10px; border-radius: 5px; background-color:rgba(0, 0, 0, 0.5)'>No&nbsp;media&nbsp;yet.</span></td><td></td></tr><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></table>"),
            this.parentTag.appendChild(this.audio_logo),
            this.parentTag.appendChild(this.video_background),
            this.parentTag.appendChild(this.videoElement),
            this.parentTag.appendChild(this.canvas),
            this.parentTag.appendChild(this.subtitleElement),
            this.parentTag.appendChild(this.messageElement),
            this.subtitleDelivery(this),
            this.ShowSubtitles(this),
            this.realLiveWatcher(this),
            this.statusWatcher(this);
        }
        soundDraw(e) {
          if (e.MediaSource) {
            if (0 == e.MediaSource.audioOnly)
              return (e.canvas.width = 0), void (e.canvas.height = 0);
            var t = 0;
            if ('' != this.curlang)
              for (var n = 0; n < this.MediaSource.addLangs.length; n++)
                this.MediaSource.addLangs == this.curlang && (t = n);
            var s = e.videoElement.clientWidth,
              r = e.videoElement.clientHeight,
              i = Math.floor(s / 5);
            if (0 == e.VideoIsPlaying());
            else
              for (
                e.currentAudioLevels.push(e.getAudioLevels().old);
                e.currentAudioLevels.length > i;

              )
                e.currentAudioLevels.shift();
            (e.canvasCtx.fillStyle = 'rgb(0, 0, 0)'), (e.canvas.width = s), (e.canvas.height = r);
            var o,
              a = s / i,
              l = 0;
            for (n = 0; n < e.currentAudioLevels.length; n++)
              (e.canvasCtx.fillStyle =
                'rgb(50,' + ((o = e.currentAudioLevels[n][2 * t]) + 100) + ',50)'),
                e.canvasCtx.fillRect(l, r / 2 - o, a - 1, o),
                (l += a);
            for (l = 0, n = 0; n < e.currentAudioLevels.length; n++)
              (e.canvasCtx.fillStyle =
                'rgb(50,' + ((o = e.currentAudioLevels[n][2 * t + 1]) + 100) + ',50)'),
                e.canvasCtx.fillRect(l, r / 2, a - 1, o),
                (l += a);
          }
        }
        realLiveWatcher(e) {
          if (
            e.MediaSource &&
            (e.mediaSyncCounter++,
            e.mediaSyncCounter > 12 && (e.Sync(), (e.mediaSyncCounter = 0)),
            1 == e.MediaSource.realLive)
          ) {
            var t = e.MediaSource.videoElement.currentTime;
            e.realLiveWatcherPositionBak == t && ((e.error = null), e.gotoLive()),
              (e.realLiveWatcherPositionBak = t);
          }
          setTimeout(e.realLiveWatcher, 1e4, e);
        }
        statusWatcher(e) {
          if (e.MediaSource) {
            e.soundDraw(e);
            var t = e.GetStatus();
            null != t.error
              ? e.showStatus(t.error.title, t.error.description)
              : e.showStatus(e.backwardFlag ? '' : t.statusText, '');
            var n = e.videoElement.videoWidth,
              s = e.videoElement.videoHeight;
            if (n > 0 && s > 0 && (n != e.videoW || s != e.videoH)) {
              if (((e.videoW = n), (e.videoH = s), n / s < 16 / 9)) {
                var r = (100 - ((9 / s) * n * 100) / 16) / 2;
                1 == e.MediaSource.audioOnly &&
                  ((e.canvas.style.left = r + '%'), (e.canvas.style.right = r + '%')),
                  (e.subtitleElement.style.left = r + '%'),
                  (e.subtitleElement.style.right = r + '%'),
                  (e.messageElement.style.left = r + '%'),
                  (e.messageElement.style.right = r + '%');
              }
              n / s > 16 / 9 &&
                ((r = (100 - ((16 / n) * s * 100) / 9) / 2),
                1 == e.MediaSource.audioOnly &&
                  ((e.canvas.style.top = r + '%'), (e.canvas.style.bottom = r + '%')),
                (e.subtitleElement.style.top = r + '%'),
                (e.subtitleElement.style.bottom = r + '%'),
                (e.messageElement.style.top = r + '%'),
                (e.messageElement.style.bottom = r + '%'));
            }
          }
          setTimeout(e.statusWatcher, 100, e);
        }
        getFileDuration() {
          if (this.MediaSource) return this.videoElement.duration;
        }
        showStatus(e, t) {
          this.messageElement.innerHTML =
            '' != e
              ? '' == t
                ? "<table style='height: 100%; width: 100%; background: transparent; font-size:16px; color: white'><tr><td align='center' valign='middle'><span style='padding: 10px; border-radius: 5px; background-color:rgba(0, 0, 0, 0.5)'>" +
                  this.htmlEncode(e) +
                  '</span></td></tr></table>'
                : "<table style='height: 100%; width: 100%; background: transparent; font-size:16px; color: white' ><tr><td align='center' valign='middle'><span data-toggle='tooltip' data-placement='top' title='" +
                  this.htmlEncode(t) +
                  "' style='padding: 10px; border-radius: 5px; background-color:rgba(0, 0, 0, 0.5)'>" +
                  this.htmlEncode(e) +
                  '</span></td></tr></table>'
              : '';
        }
        htmlEncode(e) {
          return e.replace(/[^]/g, function (e) {
            return '&#' + e.charCodeAt(0) + ';';
          });
        }
        catchPlayerException(e, t) {
          '' != t.data.title || '' != t.data.description
            ? (e.error = t.data)
            : null != e.error && (e.error = null);
        }
        PlayFile(e, t) {
          t || (t = !1),
            (this.error = null),
            this.setSubtitle(''),
            this.Load(),
            (this.MediaSource.realLive = !1),
            this.MediaSource.PlayFile(e, t);
        }
        PlayLive(e, t, n, s, r, i) {
          i || (i = !1),
            (this.error = null),
            this.setSubtitle(''),
            this.Load(),
            this.MediaSource.PlayLive(
              t == e ? e : t.toLowerCase().replace('live', 'record'),
              t,
              n,
              s,
              r,
              null,
              i
            ),
            (this.MediaSource.realLive = !0),
            (this.MediaSource.realLiveCorrection = 0);
        }
        PlayLiveFromDateTime(e, t, n, s, r, i) {
          i || (i = !1),
            (this.error = null),
            this.setSubtitle(''),
            this.Load(),
            this.MediaSource.PlayLive(
              t == e ? e : t.toLowerCase().replace('live', 'record'),
              t,
              n,
              s,
              0,
              r,
              i
            ),
            (this.MediaSource.realLive = !0),
            (this.MediaSource.realLiveCorrection = 0);
        }
        PlayStorage(e, t, n, s, r, i, o, a) {
          a || (a = !1),
            (this.error = null),
            this.setSubtitle(''),
            this.Load(),
            (this.MediaSource.realLive = !1),
            this.MediaSource.PlayStorage(e, t, n, s, r, i, o, a);
        }
        Load() {
          this.videoElement.pause(),
            this.Stop(),
            (this.videoElement.style.width = '100%'),
            (this.videoElement.style.height = '100%'),
            this.logoUrl &&
              (this.audio_logo.innerHTML =
                "<table style='width:100%; height: 100%; background: transparent'><tr><td width='30%'></td><td><img style='width: 100%; object-fit: contain' src=" +
                this.logoUrl +
                "></td><td width='30%'></td></tr></table>"),
            (this.MediaSource = new kh(this.videoElement, this.parentTag)),
            this.parentTag.addEventListener(
              'playerEvent',
              this.catchPlayerException.bind(this.parentTag, this),
              !1
            );
        }
        Stop() {
          null != this.MediaSource &&
            ((this.MediaSource.mediaSourceType = this.MediaSource.mediaSourceTypes.NONE),
            this.videoElement.removeEventListener(
              'seeking',
              xh.onSeeking.bind(this.videoElement, this),
              !1
            ),
            this.parentTag.removeEventListener(
              'playerEvent',
              this.catchPlayerException.bind(this.parentTag, this),
              !1
            ),
            (this.videoElement.src = ''),
            (this.MediaSource = null),
            delete this.MediaSource);
        }
        SetPosition(e) {
          if (
            this.MediaSource &&
            this.MediaSource.mediaSourceType == this.MediaSource.mediaSourceTypes.STORAGE
          )
            return (this.videoElement.currentTime =
              e + 1 * this.MediaSource.filesParts.one_sec_fwd);
          if (
            !this.MediaSource ||
            (this.MediaSource.mediaSourceType != this.MediaSource.mediaSourceTypes.LIVE &&
              this.MediaSource.mediaSourceType != this.MediaSource.mediaSourceTypes.FAKELIVE)
          )
            return (this.videoElement.currentTime = e);
          var t = this.MediaSource.mediaRoot,
            n = this.MediaSource.mediaLiveRoot,
            s = this.MediaSource.deviceName,
            r = this.MediaSource.lang,
            i = this.MediaSource.liveOffset,
            o = this.MediaSource.audioOnly,
            a = this.GetLiveStart();
          null != e
            ? (1 == this.MediaSource.realLive &&
                ((e += this.MediaSource.realLiveCorrection),
                (this.MediaSource.realLiveCorrection = 0)),
              (a = Th.AddSeconds(a, e)))
            : (a = null),
            this.Load(),
            (this.MediaSource.realLive = null == a),
            this.MediaSource.PlayLive(t, n, s, r, i, a, o),
            this.setAdditionalLanguages(this.channelAudio);
        }
        GetPosition() {
          return this.MediaSource &&
            this.MediaSource.mediaSourceType == this.MediaSource.mediaSourceTypes.STORAGE
            ? null == this.MediaSource.filesParts
              ? 0
              : this.videoElement.currentTime - 1 * this.MediaSource.filesParts.one_sec_fwd
            : this.videoElement.currentTime;
        }
        Sync() {
          this.videoElement.currentTime = this.videoElement.currentTime;
        }
        getPlayerSourceType() {
          return this.MediaSource ? this.MediaSource.mediaSourceType : 0;
        }
        getPointTimesMap(e) {
          for (var t = this.MediaSource, n = [], s = 0, r = 0; r < t.filesParts.parts.length; r++)
            n.push(
              (s += t.filesParts.parts[r].asamples + t.filesParts.parts[r].astartsample) *
                (1024 / 48e3)
            );
          if (null != e) {
            var i = [];
            for (r = 0; r < e.length; r++) {
              for (
                var o =
                    t.filesParts.parts[0].astartsample * (1024 / 48e3) +
                    e[r].offset +
                    t.filesParts.one_sec_fwd,
                  a = 0;
                n[a] < o;

              )
                a++;
              i.push({ file: t.filesParts.parts[a].chunk_time, offset: 0 == a ? o : o - n[a - 1] });
            }
            return i;
          }
        }
        setAdditionalLanguages(e) {
          (this.channelAudio = e), this.MediaSource.setAdditionalLanguages(e);
        }
        SetCurLang(e) {
          if (
            ((this.curlang = e),
            this.MediaSource &&
              this.MediaSource.mediaSourceType != this.MediaSource.mediaSourceTypes.NONE)
          )
            switch (this.MediaSource.mediaSourceType) {
              case this.MediaSource.mediaSourceTypes.LIVE:
              case this.MediaSource.mediaSourceTypes.FAKELIVE:
                var t = this.MediaSource.mediaRoot,
                  n = this.MediaSource.mediaLiveRoot,
                  s = this.MediaSource.deviceName,
                  r = this.MediaSource.liveOffset,
                  i = this.MediaSource.audioOnly,
                  o = this.GetLiveStart();
                (o = Th.AddSeconds(o, this.videoElement.currentTime)),
                  this.setSubtitle(''),
                  this.Load(),
                  this.MediaSource.PlayLive(t, n, s, this.curlang, r, o, i),
                  this.setAdditionalLanguages(this.channelAudio);
                break;
              case this.MediaSource.mediaSourceTypes.STORAGE:
                var a = this.GetPosition(),
                  l = this.VideoIsPlaying(),
                  u =
                    ((t = this.MediaSource.mediaRoot),
                    (s = this.MediaSource.deviceName),
                    this.MediaSource.fromDateTime),
                  c = this.MediaSource.toDateTime;
                (i = this.MediaSource.audioOnly),
                  this.setSubtitle(''),
                  this.Load(),
                  this.MediaSource.PlayStorage(t, s, this.curlang, u, c, a, l, i),
                  this.setAdditionalLanguages(this.channelAudio);
            }
        }
        GetCurLang() {
          return this.curlang;
        }
        SetMute(e) {
          this.videoElement.muted = e;
        }
        GetMute() {
          return this.videoElement.muted;
        }
        SetVolumeLevel(e) {
          this.videoElement.volume = e;
        }
        GetVolumeLevel() {
          return this.videoElement.volume;
        }
        GetStatus() {
          var e = 0;
          if ('' != this.curlang && this.MediaSource.addLangs)
            for (var t = 0; t < this.MediaSource.addLangs.length; t++)
              this.MediaSource.addLangs[t] == this.curlang && (e = t);
          var n = this.getAudioLevels();
          return {
            realLive: this.MediaSource.realLive,
            speed: this.getPlaybackSpeed(),
            play: this.VideoIsPlaying(),
            mute: this.GetMute(),
            volumeLevel: this.videoElement.volume,
            duration: this.videoElement.duration,
            audioLevels: n.old,
            audioLevelsFull: n.all_audio_channels,
            curAudioLevelIndex: e,
            position: this.GetPosition(),
            dateTimePosition: this.GetDateTimePosition(),
            currentAudioLanguage: this.curlang,
            currentSubtitleLanguage: this.getCurrentSubtitle(),
            error: this.error,
            ccPlusShow: !1,
            loudnessShow: !1,
            statusText: this.GetStatusString(),
            readyState: this.videoElement ? this.videoElement.readyState : 0,
          };
        }
        VideoIsPlaying() {
          return !!(this.videoElement.readyState > 2 && '' == this.GetPlayingStatus());
        }
        GetStatusString() {
          if (this.MediaSource && 1 == this.MediaSource.waiting) return 'Loading...';
          if ((this.bufferingCounter || (this.bufferingCounter = new Date()), null != this.error))
            return '';
          var e = this.videoElement.readyState;
          if (
            this.MediaSource.mediaSourceType == this.MediaSource.mediaSourceTypes.FILE &&
            Math.abs(Math.floor(this.videoElement.duration) - this.videoElement.currentTime) <= 1
          )
            return '';
          if (e > 0 && e < 3 && 0 == this.videoElement.paused) return 'Buffering...';
          if (1 == this.VideoIsPlaying()) {
            var t = this.GetPosition();
            if (this.prevPosition == t) {
              if (new Date().getTime() - this.bufferingCounter.getTime() > 1e3)
                return 'Buffering...';
            } else this.bufferingCounter = new Date();
            this.prevPosition = t;
          }
          return '';
        }
        GetStartTime() {
          return Th.MRToDate(this.MediaSource.fromDateTime);
        }
        GetLiveStart() {
          if (this.MediaSource.mediaSourceType == this.MediaSource.mediaSourceTypes.LIVE) {
            var e = this.MediaSource.liveStartTime.split('_');
            return new Date(1 * e[0], 1 * e[1] - 1, 1 * e[2], 1 * e[3], 1 * e[4], 1 * e[5], 0);
          }
          if (this.MediaSource.mediaSourceType == this.MediaSource.mediaSourceTypes.FAKELIVE) {
            e = this.MediaSource.fakeLiveStart.split('_');
            var t = new Date(1 * e[0], 1 * e[1] - 1, 1 * e[2], 1 * e[3], 1 * e[4], 1 * e[5], 0);
            return new Date(t.getTime() + 2 * this.MediaSource.fakeLiveStartPart * 1e3);
          }
        }
        GetDateTimePosition() {
          if (!this.MediaSource || !this.MediaSource.filesParts) return null;
          if (this.MediaSource.mediaSourceType == this.MediaSource.mediaSourceTypes.LIVE) {
            var e = this.MediaSource.liveStartTime.split('_'),
              t = new Date(1 * e[0], 1 * e[1] - 1, 1 * e[2], 1 * e[3], 1 * e[4], 1 * e[5], 0);
            return new Date(
              t.getTime() +
                (1 == this.MediaSource.realLive
                  ? this.MediaSource.realLiveCorrection * this.MediaSource.filesParts.GOP_duration
                  : 0) +
                1e3 * this.videoElement.currentTime
            );
          }
          return this.MediaSource.mediaSourceType == this.MediaSource.mediaSourceTypes.FAKELIVE
            ? ((e = this.MediaSource.fakeLiveStart.split('_')),
              (t = new Date(1 * e[0], 1 * e[1] - 1, 1 * e[2], 1 * e[3], 1 * e[4], 1 * e[5], 0)),
              new Date(
                t.getTime() +
                  2 *
                    this.MediaSource.fakeLiveStartPart *
                    this.MediaSource.filesParts.GOP_duration +
                  1e3 * this.videoElement.currentTime
              ))
            : this.MediaSource.mediaSourceType == this.MediaSource.mediaSourceTypes.STORAGE
            ? ((e = this.MediaSource.fromDateTime.split('_')),
              (t = new Date(1 * e[0], 1 * e[1] - 1, 1 * e[2], 1 * e[3], 1 * e[4], 1 * e[5], 0)),
              new Date(
                t.getTime() +
                  1e3 * this.videoElement.currentTime -
                  1e3 * this.MediaSource.filesParts.one_sec_fwd
              ))
            : null;
        }
        GetInternalStatus() {
          return null != this.videoElement.error ? this.videoElement.error.code : '0';
        }
        GetPlayingStatus() {
          return this.videoElement.paused ? 'paused' : this.videoElement.ended ? 'ended' : '';
        }
        GetReadyStatus() {
          var e = '';
          switch (this.videoElement.readyState) {
            case 0:
              e = 'HAVE_NOTHING';
              break;
            case 1:
              e = 'HAVE_METADATA';
              break;
            case 2:
              e = 'HAVE_CURRENT_DATA';
              break;
            case 3:
              e = 'HAVE_FUTURE_DATA';
              break;
            case 4:
              e = 'HAVE_ENOUGH_DATA';
          }
          return e;
        }
        GetPlaybackPartsStatus() {
          var e = '',
            t = this.videoElement.buffered.length;
          e += 'Buffered Length:' + t + '<br/>';
          for (var n = 0; n < t; n++)
            e +=
              this.videoElement.buffered.start(n) +
              ' : ' +
              this.videoElement.buffered.end(n) +
              '<br/>';
          var s = this.videoElement.played.length;
          for (e += 'Played Length:' + s + '<br/>', n = 0; n < s; n++)
            e +=
              this.videoElement.played.start(n) + ' : ' + this.videoElement.played.end(n) + '<br/>';
          var r = this.videoElement.seekable.length;
          for (e += 'Seekable Length:' + r + '<br/>', n = 0; n < r; n++)
            e +=
              this.videoElement.seekable.start(n) +
              ' : ' +
              this.videoElement.seekable.end(n) +
              '<br/>';
          return e;
        }
        play() {
          this.stopBackward(), (this.videoElement.playbackRate = 1), this.videoElement.play();
        }
        pause() {
          this.stopBackward(), this.videoElement.pause(), (this.MediaSource.realLive = !1);
        }
        nextFrame() {
          this.stopBackward(),
            this.pause(),
            this.SetPosition(this.GetPosition() + 1 * this.MediaSource.filesParts.i_frame_step);
        }
        previousFrame() {
          this.stopBackward(),
            this.pause(),
            this.SetPosition(this.GetPosition() - 1 * this.MediaSource.filesParts.i_frame_step);
        }
        gotoLive() {
          (this.error = null),
            (this.MediaSource.mediaSourceType = this.MediaSource.mediaSourceTypes.LIVE),
            this.SetPosition(null),
            (this.MediaSource.realLive = !0),
            (this.MediaSource.realLiveCorrection = 0);
        }
        setVolume(e) {
          this.SetVolumeLevel(e);
        }
        gotoPosition(e) {
          this.SetPosition(this.GetPosition() + e);
        }
        getPlaybackSpeed() {
          return 0 != this.backwardSpeed ? -this.backwardSpeed : this.videoElement.playbackRate;
        }
        rewind() {
          this.videoElement.playbackRate -= 0.5;
        }
        backward() {
          (this.videoElement.playbackRate = 1),
            this.videoElement.pause(),
            0 == this.backwardSpeed
              ? this.startBackward()
              : this.backwardSpeed < 10 &&
                ((this.backwardSpeed *= 2), this.backwardSpeed > 10 && (this.backwardSpeed = 10));
        }
        startBackward() {
          this.stopBackward(),
            (this.backwardSpeed = 0.5),
            (this.timer_id = setInterval(() => {
              this.moveBackward();
            }, 40));
        }
        stopBackward() {
          (this.backwardSpeed = 0), this.timer_id && clearInterval(this.timer_id);
        }
        moveBackward() {
          this.GetPosition() <= 0
            ? this.stopBackward()
            : this.SetPosition(this.GetPosition() - 0.041 * this.backwardSpeed);
        }
        forward() {
          switch ((this.stopBackward(), this.videoElement.play(), this.videoElement.playbackRate)) {
            case 0.5:
            case 1:
              this.videoElement.playbackRate = 2;
              break;
            case 2:
              this.videoElement.playbackRate = 4;
              break;
            case 4:
              this.videoElement.playbackRate = 8;
              break;
            case 8:
              this.videoElement.playbackRate = 10;
          }
        }
        slowMotion() {
          this.stopBackward(), this.videoElement.play(), (this.videoElement.playbackRate = 0.5);
        }
        setLanguage(e) {
          this.SetCurLang(e);
        }
        getAudioLevels() {
          var e = { old: [], all_audio_channels: [] };
          try {
            var t = this.GetPosition();
            if (this.MediaSource.metaDataForAddLangs)
              for (var n = 0; n < this.MediaSource.metaDataForAddLangs.length; n++) {
                e.old.push(0),
                  e.old.push(0),
                  e.all_audio_channels.push({ values: [], names: '', positions: '2.0' });
                for (var s = 0; s < this.MediaSource.metaDataForAddLangs[n].length; s++)
                  if (
                    t >= this.MediaSource.metaDataForAddLangs[n][s].offset &&
                    t < this.MediaSource.metaDataForAddLangs[n][s].offset + 2
                  ) {
                    var r = this.MediaSource.metaDataForAddLangs[n][s],
                      i = (t - r.offset) / 2;
                    (i = Math.round((r.soundLVL.length / r.audioChannelsNumber) * i)) *
                      r.audioChannelsNumber +
                      1 >=
                      r.soundLVL.length && (i = r.soundLVL.length / r.audioChannelsNumber - 1),
                      r.audioChannelsNumber > 2
                        ? ((e.old[e.old.length - 2] = r.soundLVL[i * r.audioChannelsNumber + 1]),
                          (e.old[e.old.length - 1] = r.soundLVL[i * r.audioChannelsNumber + 2]))
                        : ((e.old[e.old.length - 2] = r.soundLVL[i * r.audioChannelsNumber + 0]),
                          (e.old[e.old.length - 1] = r.soundLVL[i * r.audioChannelsNumber + 1]));
                    var o = [],
                      a = '2.0';
                    switch (r.audioChannelsNumber) {
                      case 2:
                        (o = ['L', 'R']), (a = '');
                        break;
                      case 3:
                        (o = ['C', 'L', 'R']), (a = '2.1');
                        break;
                      case 4:
                        (o = ['C', 'L', 'R', 'BC']), (a = '2.2');
                        break;
                      case 5:
                        (o = ['C', 'L', 'R', 'BL', 'BR']), (a = '5.0');
                        break;
                      case 6:
                        (o = ['C', 'L', 'R', 'BL', 'BR', 'SW']), (a = '5.1');
                        break;
                      case 8:
                        (o = ['C', 'L', 'R', 'SL', 'SR', 'BL', 'BR', 'SW']), (a = '7.1');
                    }
                    (e.all_audio_channels[e.all_audio_channels.length - 1].names = o),
                      (e.all_audio_channels[e.all_audio_channels.length - 1].positions = a),
                      (e.all_audio_channels[e.all_audio_channels.length - 1].values = []);
                    for (var l = 0; l < r.audioChannelsNumber; l++)
                      e.all_audio_channels[e.all_audio_channels.length - 1].values.push(
                        r.soundLVL[i * r.audioChannelsNumber + l]
                      );
                  }
              }
            return e;
          } catch (u) {}
          return [0, 0];
        }
        setSubtitle(e) {
          this.setCurrentSubtitle(e);
        }
        setTeletext(e) {
          this.setCurrentSubtitle(null == e ? '' : e + 'ttxt');
        }
        ShowSubtitles(e) {
          if ((e.widthControl(e), e.sbtlStructure && e.subtitlesOnScreen))
            if (0 != e.sbtlStructure.length) {
              if (e.sbtlStructure.length > 0) {
                var t = [];
                for (c = 0; c < e.subtitlesOnScreen.length; c++) t.push('');
                var n = e.GetDateTimePosition();
                for (c = e.sbtlStructure.length - 1; c >= 0; c--)
                  for (var s = 0; s < e.sbtlStructure[c].langs.length; s++)
                    for (var r = e.sbtlStructure[c].langs[s].items.length - 1; r >= 0; r--) {
                      var i = Th.GetDTStartSubtitle(e.sbtlStructure[c].langs[s].items[r]);
                      n >= i &&
                        n < Th.GetDTEndSubtitle(e.sbtlStructure[c].langs[s].items[r]) &&
                        (-1 ==
                        e.subtitlesOnScreen[s]
                          .map(function (e) {
                            return e.url;
                          })
                          .indexOf(e.sbtlStructure[c].langs[s].items[r].url)
                          ? '' == t[s]
                            ? ((e.subtitlesOnScreen[s] = new Array()),
                              (t[s] = 'replace'),
                              e.subtitlesOnScreen[s].push(e.sbtlStructure[c].langs[s].items[r]))
                            : Th.ToMRFormat(i) ==
                                Th.ToMRFormat(Th.GetDTStartSubtitle(e.subtitlesOnScreen[s][0])) &&
                              e.subtitlesOnScreen[s].push(e.sbtlStructure[c].langs[s].items[r])
                          : (t[s] = 'no changes'));
                    }
                for (c = 0; c < e.subtitlesOnScreen.length; c++)
                  '' == t[c] &&
                    (t[c] = e.subtitlesOnScreen[c].length > 0 ? 'delete' : 'no changes');
                var o = e.subtitles.split(',');
                for (c = 0; c < e.subtitlesOnScreen.length; c++) {
                  var a = o[c] == e.cursbtl;
                  if (
                    ('delete' == t[c] && (e.subtitlesOnScreen[c] = new Array()),
                    'delete' == t[c] || 'replace' == t[c])
                  ) {
                    if (1 == a)
                      if ('ttxt' == e.cursbtl.substr(-4) && 'replace' == t[c]);
                      else
                        for (; e.subtitleElement.firstChild; )
                          e.subtitleElement.removeChild(e.subtitleElement.firstChild);
                    if (e.ccplusPlace.childNodes.length > c) {
                      for (h = e.ccplusPlace.childNodes[c + 1]; h.childNodes.length > 1; )
                        h.removeChild(h.childNodes[h.childNodes.length - 1]);
                      h.style.height = '68px';
                    }
                  }
                  if ('replace' == t[c]) {
                    for (r = 0; r < e.subtitlesOnScreen[c].length; r++) {
                      var l = e.subtitlesOnScreen[c][r].url.length;
                      if (1 == a)
                        if ('g' == e.subtitlesOnScreen[c][r].url[l - 1]) {
                          var u = document.createElement('img');
                          u.setAttribute('src', e.subtitlesOnScreen[c][r].url),
                            Th.SetSubtitlePosition(u, e.subtitlesOnScreen[c][r]),
                            e.subtitleElement.appendChild(u);
                        } else e.loadTeletext(e.subtitlesOnScreen[c][r].url, null);
                    }
                    e.ccplusPlace.childNodes.length > c &&
                      ('g' ==
                      e.subtitlesOnScreen[c][0].url[(l = e.subtitlesOnScreen[c][0].url.length) - 1]
                        ? Th.SetSubtitlePositionCCPlus(
                            e.ccplusPlace.childNodes[c + 1],
                            e.subtitlesOnScreen[c]
                          )
                        : e.loadTeletext(
                            e.subtitlesOnScreen[c][0].url,
                            e.ccplusPlace.childNodes[c + 1]
                          ));
                  }
                }
              }
              setTimeout(e.ShowSubtitles, 40, e);
            } else {
              for (var c = 0; c < e.subtitlesOnScreen.length; c++) {
                for (e.subtitlesOnScreen[c] = new Array(); e.subtitleElement.firstChild; )
                  e.subtitleElement.removeChild(e.subtitleElement.firstChild);
                if (e.ccplusPlace.childNodes.length > c) {
                  for (var h = e.ccplusPlace.childNodes[c + 1]; h.childNodes.length > 1; )
                    h.removeChild(h.childNodes[h.childNodes.length - 1]);
                  h.style.height = '68px';
                }
              }
              setTimeout(e.ShowSubtitles, 40, e);
            }
          else setTimeout(e.ShowSubtitles, 40, e);
        }
        loadTeletext(e, t) {
          var n = new XMLHttpRequest();
          n.open('GET', e);
          try {
            n.send(),
              (n.responseType = 'text'),
              n.addEventListener(
                'readystatechange',
                function (e, t, s) {
                  if (n.readyState == n.DONE)
                    try {
                      var r = JSON.parse(n.response);
                      e.showTeletext(r.rawtext, t);
                    } catch (s) {
                      e.MediaSource &&
                        console.log(
                          'Load Teletext Error. Exception while getting Teletext : [1]' + s.message
                        );
                    }
                }.bind(n, this, t),
                !1
              );
          } catch (s) {
            this.MediaSource &&
              console.log(
                'Load Teletext Error. Exception while getting Teletext : [2]' + s.message
              );
          }
        }
        showTeletext(e, t) {
          var n = (i = e.split('\n')).length,
            s = [];
          if (null != t) {
            for (var r = 0; r < i.length && '' == i[r].replace(/ /g, ''); ) r++;
            var i;
            if ((i.length - r < 2 && (r = i.length - 2), (i = i.splice(r)).length > 2)) {
              for (r = i.length - 1; r > -1 && '' == i[r].replace(/ /g, ''); ) r--;
              for (i.splice(r + 1); i.length < 2; ) i.push('');
            }
          } else for (; i.length < 24; ) i.push('');
          s.push(
            '<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute; top:' +
              (null != t ? 23 : 0) +
              'px; left:' +
              (null != t ? 5 : 0) +
              'px; width:' +
              (null != t ? 'calc(100% - 10px)' : '100%') +
              '; height:' +
              (null != t ? 'calc(100% - 30px)' : '100%') +
              '" viewBox="0 0 100 100" preserveAspectRatio="none">'
          );
          var o = Math.round(
              this.videoElement.videoWidth / ((this.videoElement.videoHeight / n / 4) * 2.5)
            ),
            a = i.length;
          null != t && ((t.style.height = 25 * a + 18 + 'px'), (o = 40));
          for (var l = 100 / a, u = 100 / o, c = 0; c < i.length; c++)
            if ('' != i[c].replace(/ /g, '')) {
              var h = Th.searchNotSpace(i[c]),
                d = Th.searchLastNotSpace(i[c]);
              s.push(
                '<rect x="' +
                  (h += (o - 40) / 2) * u +
                  '%" width="' +
                  ((d += (o - 40) / 2) - h) * u +
                  '%" y="' +
                  (c * l + 0) +
                  '%" height="' +
                  (l + 0) +
                  '%" fill="black" />'
              );
            }
          for (c = 0; c < i.length; c++)
            if ('' != i[c].replace(/ /g, '')) {
              (h = Th.searchNotSpace(i[c])), (d = Th.searchLastNotSpace(i[c]));
              var p = h + (o - 40) / 2;
              s.push(
                '<text font-family="Courier New" font-size="' +
                  (l - 0) +
                  '" x="' +
                  p * u +
                  '%" y="' +
                  ((c + 1) * l - l / 5) +
                  '%" textLength="' +
                  (d + (o - 40) / 2 - p) * u +
                  '%" fill="white" lengthAdjust="spacingAndGlyphs">' +
                  i[c].substring(h, d).replace(/ /g, '&nbsp;') +
                  '</text>'
              );
            }
          s.push('</svg>'),
            null == t ? (this.subtitleElement.innerHTML = s.join()) : (t.innerHTML += s.join());
        }
        showTeletextOLD(e, t) {
          var n = e.split('\n'),
            s = [];
          if (null != t) {
            for (var r = 0; r < n.length && '' == n[r].replace(/ /g, ''); ) r++;
            n.length - r < 2 && (r = n.length - 2), (n = n.splice(r));
          } else for (; n.length < 24; ) n.push('');
          s.push(
            '<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute; top:' +
              (null != t ? 16 : 0) +
              'px; left:0px; width:100%; height:' +
              (null != t ? 65 : 100) +
              '%" viewBox="0 0 100 100" preserveAspectRatio="none">'
          );
          var i = n.length;
          null != t && (t.style.height = 25 * i + 18 + 'px');
          for (var o = 100 / i, a = 0; a < n.length; a++)
            if ('' != n[a].replace(/ /g, '')) {
              var l = Th.searchNotSpace(n[a]),
                u = Th.searchLastNotSpace(n[a]);
              0 == l && ((l = 0), (u = 40)),
                s.push(
                  '<rect x="' +
                    2.5 * l +
                    '%" width="' +
                    2.5 * (u - l) +
                    '%" y="' +
                    (a * o + 0) +
                    '%" height="' +
                    (o + 0) +
                    '%" fill="black" />'
                );
            }
          for (a = 0; a < n.length; a++)
            '' != n[a].replace(/ /g, '') &&
              ((l = Th.searchNotSpace(n[a])),
              (u = Th.searchLastNotSpace(n[a])),
              0 == l && ((l = 0), (u = 40)),
              s.push(
                '<text font-family="monospace" font-size="' +
                  (o - 0) +
                  '" x="' +
                  2.5 * l +
                  '%" y="' +
                  ((a + 1) * o - o / 5) +
                  '%" textLength="' +
                  2.5 * (u - l) +
                  '%" fill="white" lengthAdjust="spacingAndGlyphs">' +
                  n[a].substring(l, u).replace(/ /g, '&nbsp;') +
                  '</text>'
              ));
          s.push('</svg>'),
            null == t ? (this.subtitleElement.innerHTML = s.join()) : (t.innerHTML += s.join());
        }
        setSubtitles(e, t, n) {
          e || (e = []),
            t || (t = []),
            n || (n = []),
            (this.subtitles_arr = e),
            (this.teletext_arr = t);
          var s = t.map(function (e) {
            return e + 'ttxt';
          });
          this.subtitles = e.concat(s).join(',');
          for (var r = 0; r < e.length; r++) n[r] = n[r] + ' (Subtitles)';
          for (var i = e.length; i < n.length; i++) n[i] = n[i] + ' (CC/Teletext)';
          if (
            ((this.subtitles_name = n.join(',')),
            (this.sbtlStructure = []),
            (this.subtitlesOnScreen = new Array()),
            '' != this.subtitles)
          )
            for (r = 0; r < this.subtitles.split(',').length; r++)
              this.subtitlesOnScreen.push(new Array());
        }
        getSubtitles() {
          return this.subtitles;
        }
        setCurrentSubtitle(e) {
          for (this.cursbtl = e; this.subtitleElement.firstChild; )
            this.subtitleElement.removeChild(this.subtitleElement.firstChild);
        }
        getCurrentSubtitle() {
          return this.cursbtl;
        }
        subtitleDelivery(e) {
          if ('' != e.getSubtitles()) {
            var t = e.GetDateTimePosition();
            if (null == t) return void setTimeout(e.subtitleDelivery, 40, e);
            var n = !1,
              s = !1;
            if (
              (e.sbtlStructure.length > 0 &&
                t >= Th.AddSeconds(Th.MRToDate(e.sbtlStructure[0].from), 10) &&
                t < Th.MRToDate(e.sbtlStructure[e.sbtlStructure.length - 1].to) &&
                ((n = !0),
                e.sbtlStructure.length > 1 &&
                  t < Th.MRToDate(e.sbtlStructure[e.sbtlStructure.length - 2].to) &&
                  (s = !0)),
              0 == n)
            )
              return (
                (e.sbtlStructure = []),
                void e.loadSubtitles(Th.ToMRFormat(Th.AddSeconds(t, -11)), 14)
              );
            if (0 == s)
              return (
                e.sbtlStructure.length > 3 && e.sbtlStructure.splice(0, 1),
                void e.loadSubtitles(e.sbtlStructure[e.sbtlStructure.length - 1].to, 5)
              );
            setTimeout(e.subtitleDelivery, 40, e);
          } else setTimeout(e.subtitleDelivery, 40, e);
        }
        loadSubtitles(e, t) {
          var n = new XMLHttpRequest();
          n.open(
            'GET',
            Th.AshxPipe(
              './ashx/ListMediaMetadata.ashx?recording_root=' +
                this.MediaSource.mediaRoot +
                '&physical_channel=' +
                this.MediaSource.deviceName +
                '&from=' +
                e +
                '&to=' +
                Th.ToMRFormat(Th.AddSeconds(Th.MRToDate(e), t)) +
                (this.subtitles_arr.length > 0 ? '&subtitle=' + this.subtitles_arr.join(',') : '') +
                (this.teletext_arr.length > 0 ? '&teletext=' + this.teletext_arr.join(',') : '') +
                '&test=' +
                new Date().getTime()
            )
          );
          try {
            n.send(),
              (n.responseType = 'text'),
              n.addEventListener(
                'readystatechange',
                function (e, t) {
                  if (n.readyState == n.DONE)
                    try {
                      var s = JSON.parse(n.response);
                      if ('' != s.error)
                        return (
                          e.MediaSource &&
                            console.log(
                              'Load Subtitles Error. Exception while getting Subtitles : [1]' +
                                t.message
                            ),
                          void setTimeout(e.subtitleDelivery, 1e3, e)
                        );
                      if (((s.langs = []), s.subtitle)) {
                        for (var r = 0; r < s.subtitle.length; r++)
                          s.subtitle[r].items.forEach(e => {
                            e.url = Th.AshxPipe(e.url);
                          }),
                            s.langs.push(s.subtitle[r]);
                        delete s.subtitle;
                      }
                      if (s.teletext) {
                        for (r = 0; r < s.teletext.length; r++)
                          (s.teletext[r].language += 'ttxt'),
                            s.teletext[r].items.forEach(e => {
                              e.url = Th.AshxPipe(e.url);
                            }),
                            s.langs.push(s.teletext[r]);
                        delete s.teletext;
                      }
                      e.sbtlStructure.push(s), setTimeout(e.subtitleDelivery, 40, e);
                    } catch (t) {
                      e.MediaSource &&
                        console.log(
                          'Load Subtitles Error. Exception while getting Subtitles : [2]' +
                            t.message
                        ),
                        setTimeout(e.subtitleDelivery, 1e3, e);
                    }
                }.bind(n, this),
                !1
              );
          } catch (s) {
            this.MediaSource &&
              console.log(
                'Load Subtitles Error. Exception while getting Subtitles : [3]' + s.message
              );
          }
        }
        setCCPlus(e) {
          if (1 == e) {
            this.ccplusPlace.style.background = '#FFFFFF';
            var t = this.subtitles_name.split(',');
            (this.ccplusPlace.style.width = '330px'),
              (this.ccplusPlace.style.overflowY = 'auto'),
              (this.ccplusPlace.style.overflowX = 'hidden'),
              ((s = document.createElement('div')).style.width = '310px'),
              (s.style.height = '68px'),
              (s.style.borderBottom = '1px solid #FFFFFF'),
              (s.style.margin = '0px'),
              (s.style.position = 'relative'),
              this.ccplusPlace.appendChild(s),
              (s.innerHTML =
                "<table class=table style='color:#8156A8; width: 100%; height: 100%; background: transparent' cellpadding='0' cellspacing='0' border='0'><tr><td style='vertical-align: middle; padding: 10px; font-size: large'>CC+</td></tr></table>");
            for (var n = 0; n < t.length; n++) {
              var s,
                r = n % 6;
              switch (
                (((s = document.createElement('div')).style.width = '310px'),
                (s.style.height = '68px'),
                (s.style.borderBottom = '1px solid #FFFFFF'),
                (s.style.margin = '0px'),
                (s.style.position = 'relative'),
                r)
              ) {
                case 0:
                  s.style.background = '#F58641';
                  break;
                case 1:
                  s.style.background = '#EBC72D';
                  break;
                case 2:
                  s.style.background = '#00B9FF';
                  break;
                case 3:
                  s.style.background = '#87AFA7';
                  break;
                case 4:
                  s.style.background = '#4D5462';
                  break;
                case 5:
                  s.style.background = '#939393';
                  break;
                default:
                  s.style.background = '#F58641';
              }
              var i = document.createElement('span');
              (i.style.paddingLeft = '3px'),
                (i.style.paddingRight = '3px'),
                (i.style.opacity = '0.6'),
                (i.style.background = '#FFFFFF'),
                (i.style.fontSize = '10px'),
                (i.style.fontWeight = 'bold'),
                (i.style.fontFamily = 'Verdana'),
                (i.style.position = 'absolute'),
                (i.style.lineHeight = '14px'),
                (i.style.color = 'black'),
                i.appendChild(document.createTextNode(t[n])),
                s.appendChild(i),
                this.ccplusPlace.appendChild(s);
            }
            this.ccplusPlace.appendChild(s);
          } else {
            for (; this.ccplusPlace.firstChild; )
              this.ccplusPlace.removeChild(this.ccplusPlace.firstChild);
            (this.ccplusPlace.style.overflowY = 'none'),
              (this.ccplusPlace.style.overflowX = 'none'),
              (this.ccplusPlace.style.width = '0px');
          }
        }
        setLoudness(e) {
          if (1 == e) {
            (this.ccplusPlace.style.width = '370px'),
              (this.ccplusPlace.style.background = '#FFFFFF');
            var t = document.createElement('div');
            (t.style.width = '370px'),
              (t.style.height = '100%'),
              (t.style.border = '0px solid #FF0000'),
              (t.style.margin = '0px'),
              (t.style.position = 'relative'),
              (t.style.paddingRight = '15px'),
              this.ccplusPlace.appendChild(t),
              (t.innerHTML =
                '<table border=0 style="width:100%; height:100%; background: transparent">\n<tr>\n    <td>\n        <span style="font-family:Arial; font-size:large; font-weight:bold; color:#8156a8;\n            margin-left:10px">LOUDNESS</span>\n    </td>\n</tr>\n<tr>\n    <td>\n        <table style="width:100%; background: transparent">\n            <tr>\n                <td>\n                    <div style="width:10px"></div>\n                </td>\n                <td>\n                    <div style="border-radius: 15px; padding:10px; background-color: #8156a8">\n                        <table style="width:100%; background-color: #8156a8">\n                            <tr>\n                                <td align=center> <span style="background-color: transparent; font-family:Arial;\n                                        font-size:small; font-weight:bold; color:white; white-space:nowrap">SHORT\n                                        TERM</span> </td>\n                            </tr>\n                            <tr>\n                                <td align="center"> <span id="shortt" style="font-family:Arial;\n                                        font-size:large; font-weight:bold; color: white">-23</span> </td>\n                            </tr>\n                            <tr>\n                                <td>\n                                    <table style="width:100%; background-color: #8156a8">\n                                        <tr>\n                                            <td>\n                                                <div id="shorttb" style="width:30px;font-family:Arial;\n                                                    font-size:small; color:white">-22.7</div>\n                                            </td>\n                                            <td style="width:100%"> &nbsp; </td>\n                                            <td> <span style="font-family:Arial; font-size:small;\n                                                    color:white">LKFS</span> </td>\n                                        </tr>\n                                    </table>\n                                </td>\n                            </tr>\n                        </table>\n                    </div>\n                </td>\n                <td>\n                    <div style="width:10px"></div>\n                </td>\n                <td>\n                    <div style="border-radius: 15px; padding:10px; background: #8156a8">\n                        <table style="width:100%; background-color: #8156a8">\n                            <tr>\n                                <td align=center> <span style="font-family:Arial; font-size:small;\n                                        font-weight:bold; color:white; white-space:nowrap">LONG TERM</span> </td>\n                            </tr>\n                            <tr>\n                                <td align="center"> <span id="longt" style="font-family:Arial; font-size:large;\n                                        font-weight:bold; color:white">-23</span> </td>\n                            </tr>\n                            <tr>\n                                <td>\n                                    <table style="width:100%; background-color: #8156a8">\n                                        <tr>\n                                            <td>\n                                                <div id="longtb" style="width:30px;font-family:Arial;\n                                                    font-size:small; color:white">-22.7</div>\n                                            </td>\n                                            <td style="width:100%"> &nbsp; </td>\n                                            <td> <span style="font-family:Arial; font-size:small;\n                                                    color:white">LKFS</span> </td>\n                                        </tr>\n                                    </table>\n                                </td>\n                            </tr>\n                        </table>\n                    </div>\n                </td>\n                <td>\n                    <div style="width:10px"></div>\n                </td>\n                <td>\n                    <div style="border-radius: 15px; padding:10px; background: #8156a8">\n                        <table style="width:100%; background-color: #8156a8">\n                            <tr>\n                                <td align=center> <span style="font-family:Arial; font-size:small;\n                                        font-weight:bold; color:white">RANGE</span> </td>\n                            </tr>\n                            <tr>\n                                <td align="center"> <span id="range" style="font-family:Arial; font-size:large;\n                                        font-weight:bold; color:white">20</span> </td>\n                            </tr>\n                            <tr>\n                                <td>\n                                    <table style="width:100%; background-color: #8156a8">\n                                        <tr>\n                                            <td style="width:50%"> &nbsp; </td>\n                                            <td style="width:50%"> &nbsp; </td>\n                                            <td> <span style="font-family:Arial; font-size:small;\n                                                    color:white">LU</span> </td>\n                                        </tr>\n                                    </table>\n                                </td>\n                            </tr>\n                        </table>\n                    </div>\n                </td>\n            </tr>\n        </table>\n    </td>\n</tr>\n<tr>\n    <td>\n        <div style="height:10px"></div>\n    </td>\n</tr>\n<tr>\n    <td>\n        <table style="width:100%; background: transparent">\n            <tr>\n                <td>\n                    <div style="width:10px"></div>\n                </td>\n                <td style=\'width: 100%\'>\n                    <table style="width:100%; background: transparent">\n                        <tr>\n                            <td>\n                                <table style="background: transparent">\n                                    <tr>\n                                        <td><span style="font-family:Arial; font-size:small;\n                                                color:#8156a8">Momentary</span></td>\n                                        <td style="width:100%">&nbsp; </td>\n                                        <td><span style="font-family:Arial; font-size:small; font-weight:bold;\n                                                color:#8156a8">LKFS</span></td>\n                                    </tr>\n                                </table>\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>\n                                <div style="height:10px; width:100%; background: lightgray">\n                                    <div id="momentaryperc" style="height:10px; width:50%; background: #8156a8">\n                                    </div>\n                                </div>\n                            </td>\n                        </tr>\n                    </table>\n                </td>\n                <td>\n                    <div style="width:10px"></div>\n                </td>\n                <td>\n                    <div style="border-radius: 10px; padding:10px; background: #8156a8; width:50px">\n                        <table style="width:100%; background-color: #8156a8">\n                            <tr>\n                                <td>\n                                    <div id="momentary" style="width:30px; font-family:Arial; font-size:small;\n                                        font-weight:bold; color:white; text-align:center">-10.3</div>\n                                </td>\n                            </tr>\n                        </table>\n                    </div>\n                </td>\n            </tr>\n        </table>\n    </td>\n</tr>\n<tr>\n    <td>\n        <div style="height:10px"></div>\n    </td>\n</tr>\n<tr>\n    <td>\n        <table style="width:100%; background: transparent">\n            <tr>\n                <td>\n                    <div style="width:10px"></div>\n                </td>\n                <td style=\'width: 100%\'>\n                    <table style="width:100%; background: transparent">\n                        <tr>\n                            <td>\n                                <table style="background: transparent" cellpadding="0" cellspacing="0">\n                                    <tr>\n                                        <td><span style="font-family:Arial; font-size:small; color:#8156a8;\n                                                white-space:nowrap">True Peak</span></td>\n                                        <td style="width:100%">&nbsp; </td>\n                                        <td><span style="font-family:Arial; font-size:small; font-weight:bold;\n                                                color:#8156a8">dBTP</span></td>\n                                    </tr>\n                                </table>\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>\n                                <div style="height:10px; width:100%; background: lightgray">\n                                    <div id="truepeakperc" style="height:10px; width:50%; background: #8156a8">\n                                    </div>\n                                </div>\n                            </td>\n                        </tr>\n                    </table>\n                </td>\n                <td>\n                    <div style="width:10px"></div>\n                </td>\n                <td>\n                    <div style="border-radius: 10px; padding:10px; background: #8156a8; width:50px">\n                        <table style="width:100%; background-color: #8156a8">\n                            <tr>\n                                <td>\n                                    <div id="truepeak" style="width:30px; font-family:Arial; font-size:small;\n                                        font-weight:bold; color:white; text-align:center">-10.3</div>\n                                </td>\n                            </tr>\n                        </table>\n                    </div>\n                </td>\n            </tr>\n        </table>\n    </td>\n</tr>\n<tr style="height:100%">\n    <td align=right valign="bottom"> \x3c!--button id="loudExpBtn" type="button" class="btn btn-default">Export\n            Loudness to CSV</button--\x3e </td>\n</tr>\n<tr>\n    <td>\n        <div style=\'height: 10px\'></div>\n    </td>\n</tr>\n</table>'),
              (this.shortt = t.querySelector('#shortt')),
              (this.shortt.innerHTML = '-0'),
              (this.shorttb = t.querySelector('#shorttb')),
              (this.shorttb.innerHTML = '-0'),
              (this.longt = t.querySelector('#longt')),
              (this.longt.innerHTML = '-0'),
              (this.longtb = t.querySelector('#longtb')),
              (this.longtb.innerHTML = '-0'),
              (this.range = t.querySelector('#range')),
              (this.range.innerHTML = '0'),
              (this.momentary = t.querySelector('#momentary')),
              (this.momentary.innerHTML = '-0'),
              (this.truepeak = t.querySelector('#truepeak')),
              (this.truepeak.innerHTML = '-0'),
              (this.momentaryperc = t.querySelector('#momentaryperc')),
              (this.momentaryperc.style.width = '0%'),
              (this.truepeakperc = t.querySelector('#truepeakperc')),
              (this.truepeakperc.style.width = '0%'),
              this.loadLoudness();
          } else
            (this.shortt = null),
              (this.shorttb = null),
              (this.longt = null),
              (this.longtb = null),
              (this.range = null),
              (this.momentary = null),
              (this.truepeak = null),
              (this.momentaryperc = null),
              (this.truepeakperc = null),
              (this.ccplusPlace.innerHTML = ''),
              (this.ccplusPlace.style.width = '0px');
        }
        loadLoudness() {
          var e = new XMLHttpRequest();
          e.open(
            'GET',
            Th.AshxPipe(
              './ashx/GetLoudnessTable.ashx?MediaRoot=' +
                this.MediaSource.mediaRoot +
                '&Channel=' +
                this.MediaSource.deviceName +
                '&From=' +
                this.MediaSource.fromDateTime +
                '&To=' +
                this.MediaSource.toDateTime +
                '&Lang=' +
                ('' == this.MediaSource.lang ? this.channelAudio[0] : this.MediaSource.lang) +
                '&test=' +
                new Date().getTime()
            )
          );
          try {
            e.send(),
              (e.responseType = 'text'),
              e.addEventListener(
                'readystatechange',
                function (t, n) {
                  if (e.readyState == e.DONE)
                    try {
                      var s = e.response.split('\r\n');
                      (t.titles = s[0].split(',')), (t.LNValues = []);
                      for (var r = 1; r < s.length; r++) {
                        var i = s[r].split(','),
                          o = [],
                          a = Th.MRToDateWithMS(i[0]);
                        o.push(a);
                        for (var l = 1; l < i.length; l++) o.push(i[l]);
                        t.LNValues.push(o);
                      }
                      t.showLoudness(t);
                    } catch (n) {
                      t.MediaSource &&
                        console.log(
                          'Load Loudness Data Error. Exception while getting Loudness Data : [2]' +
                            n.message
                        );
                    }
                }.bind(e, this),
                !1
              );
          } catch (t) {
            this.MediaSource &&
              console.log(
                'Load Loudness Data Error. Exception while getting Loudness Data : [3]' + t.message
              );
          }
        }
        showLoudness(e) {
          if ((e.widthControl(e), null != e.LNValues)) {
            for (var t = e.GetDateTimePosition(), n = 0; n < e.LNValues.length - 1; n++)
              if (t >= e.LNValues[n][0] && t < e.LNValues[n + 1][0])
                for (var s = 0; s < e.titles.length; s++) {
                  var r, i;
                  switch (e.titles[s]) {
                    case 'Short Term':
                      (r = 1 * e.LNValues[n][s]),
                        (e.shortt.innerHTML = Math.round(r)),
                        (e.shorttb.innerHTML = Math.round(10 * r) / 10);
                      break;
                    case 'Long Term':
                      (r = 1 * e.LNValues[n][s]),
                        (e.longt.innerHTML = Math.round(r)),
                        (e.longtb.innerHTML = Math.round(10 * r) / 10);
                      break;
                    case 'LRA':
                      (r = 1 * e.LNValues[n][s]), (e.range.innerHTML = Math.round(r));
                      break;
                    case 'Momentary':
                      (r = 1 * e.LNValues[n][s]),
                        (e.momentary.innerHTML = Math.round(10 * r) / 10),
                        (i = Math.abs(r)) > 100 && (i = 100),
                        (e.momentaryperc.style.width = i + '%');
                      break;
                    case 'True Peak':
                      (r = 1 * e.LNValues[n][s]),
                        (e.truepeak.innerHTML = Math.round(10 * r) / 10),
                        (i = Math.abs(r)) > 100 && (i = 100),
                        (e.truepeakperc.style.width = i + '%');
                  }
                }
            setTimeout(e.showLoudness, 40, e);
          }
        }
        drawInlineSVG(e, t, n) {
          var s = new Blob([t], { type: 'image/svg+xml;charset=utf-8' }),
            r = URL.createObjectURL(s),
            i = new Image();
          (i.onload = function () {
            e.drawImage(this, 0, 0), URL.revokeObjectURL(r), n(this);
          }),
            (i.src = r);
        }
      }
      const Ah = ['mediadiv'],
        Lh = function (e) {
          return { height: e };
        };
      function Nh(e, t) {
        if (
          (1 & e && (ai(0), oi(1, 'div', 12), ri(2, 'div', 13), oi(3, 'div', 14), ii(), li()),
          2 & e)
        ) {
          const e = t.$implicit;
          is(3),
            ni(
              'ngStyle',
              ((n = 1),
              (s = Lh),
              (r = 100 - e + '%'),
              (function (e, t, n, s, r, i) {
                const o = t + n;
                return Yr(e, o, r)
                  ? (function (e, t, n) {
                      return (e[t] = n);
                    })(e, o + 1, i ? s.call(i, r) : s(r))
                  : (function (e, t) {
                      const n = e[t];
                      return n === ss ? void 0 : n;
                    })(e, o + 1);
              })(
                Ft(),
                (function () {
                  const e = It.lFrame;
                  let t = e.bindingRootIndex;
                  return -1 === t && (t = e.bindingRootIndex = e.tView.bindingStartIndex), t;
                })(),
                n,
                s,
                r,
                i
              ))
            );
        }
        var n, s, r, i;
      }
      function Ih(e, t) {
        if ((1 & e && (ri(0, 'div', 15), Si(1), ii()), 2 & e)) {
          const e = t.$implicit;
          is(1), Ei(e);
        }
      }
      function Dh(e, t) {
        if ((1 & e && (ri(0, 'span', 16), Si(1), ii()), 2 & e)) {
          const e = pi().index,
            t = pi(2);
          is(1), Ti(' ', t.playerStatus.audioLevelsFull[e].positions, ' ');
        }
      }
      function Fh(e, t) {
        if (
          (1 & e &&
            (ai(0),
            oi(1, 'div', 5),
            ri(2, 'div', 6),
            ei(3, Nh, 4, 3, 'ng-container', 4),
            ri(4, 'div', 7),
            ei(5, Ih, 2, 1, 'div', 8),
            ii(),
            ri(6, 'div', 9),
            ei(7, Dh, 2, 1, 'span', 10),
            ii(),
            ri(8, 'div', 11),
            Si(9),
            ii(),
            ii(),
            li()),
          2 & e)
        ) {
          const e = t.$implicit,
            n = t.index,
            s = pi(2);
          is(3),
            ni('ngForOf', s.playerStatus.audioLevelsFull[n].values),
            is(2),
            ni('ngForOf', s.playerStatus.audioLevelsFull[n].names),
            is(2),
            ni('ngIf', '' != s.playerStatus.audioLevelsFull[n].positions),
            is(2),
            Ti('\xa0', e, ' ');
        }
      }
      function Mh(e, t) {
        if ((1 & e && (ri(0, 'div', 3), ei(1, Fh, 10, 4, 'ng-container', 4), ii()), 2 & e)) {
          const e = pi();
          is(1), ni('ngForOf', e.playerParameters.audioLng);
        }
      }
      let Oh = (() => {
        class e {
          constructor() {}
          ngOnInit() {}
          ngAfterViewInit() {
            this.player = new Ph(
              this.mediadiv.nativeElement,
              this.mediaMDpanel,
              this.playerParameters
            );
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵcmp = nt({
            type: e,
            selectors: [['app-player-media']],
            viewQuery: function (e, t) {
              var n;
              1 & e && Oo(Ah, !0), 2 & e && Mo((n = Ro())) && (t.mediadiv = n.first);
            },
            inputs: {
              playerParameters: ['player-parameters', 'playerParameters'],
              playerStatus: ['player-status', 'playerStatus'],
              mediaMDpanel: ['media-md-panel', 'mediaMDpanel'],
            },
            decls: 3,
            vars: 1,
            consts: [
              [
                2,
                'position',
                'absolute',
                'top',
                '0',
                'left',
                '0',
                'right',
                '0',
                'bottom',
                '0',
                'background',
                'black',
              ],
              ['mediadiv', ''],
              [
                'id',
                'addlangsplace',
                'style',
                'border-radius: 3px; padding: 5px; padding-left: 2px; position: absolute; top:10%; right: 5px; bottom: 10%; z-index: 0; font-size: 0px; background: rgba(0,0,0,0.7)',
                4,
                'ngIf',
              ],
              [
                'id',
                'addlangsplace',
                2,
                'border-radius',
                '3px',
                'padding',
                '5px',
                'padding-left',
                '2px',
                'position',
                'absolute',
                'top',
                '10%',
                'right',
                '5px',
                'bottom',
                '10%',
                'z-index',
                '0',
                'font-size',
                '0px',
                'background',
                'rgba(0,0,0,0.7)',
              ],
              [4, 'ngFor', 'ngForOf'],
              [
                2,
                'display',
                'inline-block',
                'position',
                'relative',
                'height',
                '100%',
                'width',
                '4px',
              ],
              [2, 'display', 'inline-block', 'position', 'relative', 'height', '100%'],
              [2, 'font-size', '8px', 'font-weight', 'normal', 'color', 'white'],
              [
                'style',
                'display: inline-block; width: 13px; text-align: center',
                4,
                'ngFor',
                'ngForOf',
              ],
              [
                2,
                'font-size',
                '8px',
                'font-weight',
                'normal',
                'color',
                'white',
                'text-align',
                'center',
                'height',
                '15px',
              ],
              [
                'style',
                'border: 1px solid rgb(1, 207, 1); background: rgb(1, 207, 1); border-radius: 3px; padding-left: 5px; padding-right: 5px',
                4,
                'ngIf',
              ],
              [
                2,
                'font-size',
                '8px',
                'font-weight',
                'normal',
                'color',
                'white',
                'text-align',
                'center',
              ],
              [
                2,
                'display',
                'inline-block',
                'position',
                'relative',
                'width',
                '1px',
                'height',
                'calc(100% - 40px)',
              ],
              [
                2,
                'opacity',
                '1.0',
                'display',
                'inline-block',
                'position',
                'relative',
                'width',
                '12px',
                'height',
                'calc(100% - 40px)',
                'background',
                'linear-gradient(to top, #56ff28 60%,  #56ff28 , yellow, red)',
              ],
              [
                1,
                'addlevels',
                2,
                'position',
                'absolute',
                'background',
                'black',
                'opacity',
                '0.8',
                'width',
                '12px',
                'right',
                '0',
                3,
                'ngStyle',
              ],
              [2, 'display', 'inline-block', 'width', '13px', 'text-align', 'center'],
              [
                2,
                'border',
                '1px solid rgb(1, 207, 1)',
                'background',
                'rgb(1, 207, 1)',
                'border-radius',
                '3px',
                'padding-left',
                '5px',
                'padding-right',
                '5px',
              ],
            ],
            template: function (e, t) {
              1 & e && (oi(0, 'div', 0, 1), ei(2, Mh, 2, 1, 'div', 2)),
                2 & e &&
                  (is(2),
                  ni('ngIf', t.playerParameters && 1 == t.playerParameters.showAddLanguagesFlag));
            },
            directives: [Ba, ja, $a],
            styles: [''],
          })),
          e
        );
      })();
      class Rh {
        static preparePlayerParameters(e, t) {
          e.logoUrl && (e.logoUrl = Th.AshxPipe(e.logoUrl)),
            e.currentLang || (e.currentLang = e.audioLng ? e.audioLng[0] : ''),
            (e.volumeLevel = 0.5),
            (e.showAddLanguagesFlag = !1),
            ((e.subtitleLng && e.subtitleLng.length > 0) ||
              (e.teletextLng && e.teletextLng.length > 0)) &&
              ((e.sub_ttxt_names = []),
              e.subtitleLng &&
                e.subtitleLng.forEach(n => {
                  e.sub_ttxt_names.push(t.languages[n]);
                }),
              e.teletextLng &&
                e.teletextLng.forEach(n => {
                  e.sub_ttxt_names.push(t.languages[n]);
                }));
        }
        static checkPlayerParameters(e, t, n) {
          if (e && t) {
            switch (t.mediaSourceType) {
              case 'none':
                e.Stop();
                break;
              case 'file':
                this.playFile(e, t, n);
                break;
              case 'live':
                this.playLive(e, t, n);
                break;
              case 'storage':
                this.playStorage(e, t, n);
            }
            e.setVolume(t.volumeLevel);
          }
        }
        static playFile(e, t, n) {
          t.audioOnly && (e.logoUrl = t.logoUrl || void 0),
            e.PlayFile(t.file, t.audioOnly || !1),
            t.mute && e.SetMute(!0),
            e.setAdditionalLanguages(['']);
        }
        static playLive(e, t, n) {
          t.audioOnly && t.logoUrl && (e.logoUrl = t.logoUrl),
            t.liveRecordingRoot ||
              (t.liveRecordingRoot = t.recordingRoot.toLowerCase().replace('record', 'live')),
            t.start_from
              ? e.PlayLiveFromDateTime(
                  t.recordingRoot,
                  t.liveRecordingRoot,
                  t.physicalName,
                  t.currentLang == t.audioLng[0] ? '' : t.currentLang,
                  t.start_from,
                  t.audioOnly || !1
                )
              : e.PlayLive(
                  t.recordingRoot,
                  t.liveRecordingRoot,
                  t.physicalName,
                  t.currentLang == t.audioLng[0] ? '' : t.currentLang,
                  t.offset || 0,
                  t.audioOnly || !1
                ),
            t.mute && e.SetMute(!0),
            this.setLangSubtitlesTeletext(e, t, n);
        }
        static playStorage(e, t, n) {
          t.audioOnly && t.logoUrl && (e.logoUrl = t.logoUrl),
            e.PlayStorage(
              t.recordingRoot,
              t.physicalName,
              t.currentLang == t.audioLng[0] ? '' : t.currentLang,
              Th.ToMRFormat(t.from),
              Th.ToMRFormat(t.to),
              t.start_offset || 0,
              null == t.auto_play || t.auto_play,
              t.audioOnly || !1
            ),
            t.mute && e.SetMute(!0),
            this.setLangSubtitlesTeletext(e, t, n);
        }
        static setLangSubtitlesTeletext(e, t, n) {
          e.setAdditionalLanguages(t.audioLng || ['']),
            (t.subtitleLng || t.teletextLng) &&
              (e.setSubtitles(t.subtitleLng || [], t.teletextLng || [], t.sub_ttxt_names),
              t.currentTeletext ? e.setTeletext(t.currentTeletext) : (t.currentTeletext = ''),
              t.currentSub ? e.setSubtitle(t.currentSub) : (t.currentSub = ''));
        }
      }
      const Vh = ['playerpanel'],
        jh = ['mediamdpanel'],
        Hh = ['zoombar_boundary'],
        Bh = ['scrollcontainer'];
      let zh = (() => {
        class e {
          constructor(e) {
            (this.cd = e),
              (this.hasProgressBar = !1),
              (this.showControls = !0),
              (this.quickExport = !1),
              (this.partsChange = new To()),
              (this.on_close = new To()),
              (this.on_reopen = new To()),
              (this.on_expand = new To()),
              (this.on_open_date_time_dialog = new To()),
              (this.on_status_change = new To()),
              (this.on_create_project = new To()),
              (this.showClosetBtn = !1),
              (this.showReopenBtn = !1),
              (this.showDTDialogBtn = !1),
              (this.showCreateProjectBtn = !1),
              (this.playerStatusWidth = 0),
              (this.fullScreenPadding = ''),
              (this.fullScreenWidth = ''),
              (this.hideControlTime = new Date(2040, 1, 1)),
              (this.zoom = 100),
              (this.theLastZoomPosition = 0),
              (this.zoomDragPosition = { x: 0, y: 0 }),
              (this.isMoving = !1);
          }
          set playerParameters(e) {
            (this._playerParameters = e),
              Rh.checkPlayerParameters(this.mediaPlayer, this.playerParameters, this.config);
          }
          get playerParameters() {
            return this._playerParameters;
          }
          callPartChange(e) {
            this.partsChange.emit(e);
          }
          ngOnChanges(e) {}
          ngOnInit() {
            (Th.webhost = this.webHost),
              (this.zoom = 100),
              (this.showClosetBtn = this.on_close.observers.length > 0),
              (this.showReopenBtn = this.on_reopen.observers.length > 0),
              (this.showDTDialogBtn = this.on_open_date_time_dialog.observers.length > 0),
              (this.showCreateProjectBtn = this.on_create_project.observers.length > 0),
              (this.config = this.playerConfig),
              Rh.preparePlayerParameters(this.playerParameters, this.config);
          }
          ngAfterViewInit() {
            this.cd.detectChanges(),
              (this.mediaPlayer = this.playerMedia.player),
              Rh.checkPlayerParameters(this.mediaPlayer, this.playerParameters, this.config),
              (this.timer_id = setInterval(() => {
                (this.playerStatus = this.mediaPlayer.GetStatus()),
                  (this.playerParameters.status = {
                    speed: this.playerStatus.speed,
                    playing: this.playerStatus.play,
                    position: this.playerStatus.position,
                    date_time_position: this.playerStatus.dateTimePosition,
                    mute: this.playerStatus.mute,
                    error:
                      this.playerStatus.error && this.playerStatus.error.title
                        ? this.playerStatus.error.title
                        : null,
                    volume: Math.round(10 * this.playerStatus.volumeLevel) / 10,
                  }),
                  (this.playerStatusWidth = this.playerParameters.status.width),
                  this.playerStatusWidth < 650 && (this.playerParameters.openRightPanel = !1),
                  this.on_status_change.emit(this.playerParameters),
                  this.setZoomBarPosition(this.zoom),
                  this.checkFSHideControls();
              }, 100));
          }
          ngOnDestroy() {
            this.timer_id && clearInterval(this.timer_id),
              this.mediaPlayer && (this.mediaPlayer.stopBackward(), this.mediaPlayer.Stop());
          }
          ctrl_action(e) {
            switch (e.action) {
              case 'fullscreen':
                this.fullScreen();
                break;
              case 'open_date_time_dialog':
                (this.playerParameters.openRightPanel = !1),
                  this.on_open_date_time_dialog.emit(this.playerParameters);
                break;
              case 'reopen':
                (this.playerParameters.openRightPanel = !1),
                  'storage' == this.playerParameters.mediaSourceType &&
                    ((this.playerParameters.start_offset = this.mediaPlayer.GetPosition()),
                    (this.playerParameters.auto_play = this.mediaPlayer.VideoIsPlaying())),
                  this.on_reopen.emit(this.playerParameters);
                break;
              case 'expand_clip':
                let t = 1 * e.value;
                (this.playerParameters.openRightPanel = !1),
                  'storage' == this.playerParameters.mediaSourceType &&
                    (t < 0 &&
                      (this.playerParameters.from = new Date(
                        this.playerParameters.from.getTime() + 60 * t * 1e3
                      )),
                    t > 0 &&
                      (this.playerParameters.to = new Date(
                        this.playerParameters.to.getTime() + 60 * t * 1e3
                      )),
                    (this.playerParameters.start_offset =
                      this.mediaPlayer.GetPosition() + (t < 0 ? -60 * t : 0)),
                    (this.playerParameters.auto_play = this.mediaPlayer.VideoIsPlaying())),
                  this.on_expand.emit(this.playerParameters);
                break;
              case 'close':
                this.on_close.emit(this.playerParameters);
                break;
              case 'create_project':
                this.on_create_project.emit(this.playerParameters);
                break;
              case 'add_marker':
                this.addMarker();
            }
            (class {
              static do_command(e, t, n) {
                switch (t.action) {
                  case 'fast_backward':
                    e.backward();
                    break;
                  case 'previous_frame':
                    e.previousFrame();
                    break;
                  case 'play':
                    e.play();
                    break;
                  case 'pause':
                    e.pause();
                    break;
                  case 'slow_motion':
                    e.slowMotion();
                    break;
                  case 'next_frame':
                    e.nextFrame();
                    break;
                  case 'fast_forward':
                    e.forward();
                    break;
                  case 'live_position':
                    e.gotoPosition(1 * t.value);
                    break;
                  case 'goto_live':
                    e.gotoLive();
                    break;
                  case 'right_panel_close':
                    e.setLoudness(!1), e.setCCPlus(!1), (n.openRightPanel = !1);
                    break;
                  case 'right_panel_ccplus':
                    (n.openRightPanel = !0), e.setLoudness(!1), e.setCCPlus(!0);
                    break;
                  case 'right_panel_loudness':
                    (n.openRightPanel = !0), e.setCCPlus(!1), e.setLoudness(!0);
                    break;
                  case 'sbt_set':
                    e.setSubtitle(t.value), (n.currentSub = t.value), (n.currentTeletext = '');
                    break;
                  case 'ttxt_set':
                    e.setTeletext(t.value), (n.currentSub = ''), (n.currentTeletext = t.value);
                    break;
                  case 'lang_set':
                    e.SetCurLang(t.value == n.audioLng[0] ? '' : t.value),
                      (n.currentLang = t.value);
                    break;
                  case 'volume':
                    (n.volumeLevel = 1 * t.value), e.setVolume(1 * t.value);
                    break;
                  case 'mute':
                    e.SetMute(t.value);
                    break;
                  case 'show_sound_levels':
                    n.showAddLanguagesFlag = !n.showAddLanguagesFlag;
                    break;
                  case 'progress-bar-position':
                    e.SetPosition(1 * t.value);
                    break;
                  case 'next_frame':
                    e.nextFrame();
                    break;
                  case 'next_frame':
                    e.previousFrame();
                    break;
                  case 'slow_motion':
                    e.slowMotion();
                    break;
                  case 'fast_forward':
                    e.forward();
                    break;
                  case 'fast_backward':
                    e.backward();
                    break;
                  case 'screenshot':
                    e.screenShot(t.value);
                }
              }
            }).do_command(this.mediaPlayer, e, this.playerParameters);
          }
          play() {
            this.playerStatus && this.mediaPlayer.play();
          }
          pause() {
            this.playerStatus && this.mediaPlayer.pause();
          }
          setMute(e) {
            this.mediaPlayer.mutePlayer(e);
          }
          fastForward() {
            'storage' == this.playerParameters.mediaSourceType &&
              this.playerStatus &&
              this.mediaPlayer.forward();
          }
          fastBackward() {
            'storage' == this.playerParameters.mediaSourceType &&
              this.playerStatus &&
              this.mediaPlayer.backward();
          }
          nextFrame() {
            'storage' == this.playerParameters.mediaSourceType &&
              this.playerStatus &&
              this.mediaPlayer.nextFrame();
          }
          previousFrame() {
            'storage' == this.playerParameters.mediaSourceType &&
              this.playerStatus &&
              this.mediaPlayer.previousFrame();
          }
          setPosition(e) {
            'storage' == this.playerParameters.mediaSourceType &&
              this.playerStatus &&
              this.mediaPlayer.SetPosition(e);
          }
          onFullScreenChange(e) {
            document.fullscreenElement ||
              ((this.hideControlTime = new Date(2040, 1, 1)),
              (this.fullScreenPadding = ''),
              (this.fullScreenWidth = ''));
          }
          fullScreen() {
            document.fullscreenElement
              ? document.exitFullscreen && document.exitFullscreen()
              : this.playerpanel.nativeElement.requestFullscreen &&
                (this.setFSHideControlTime(),
                this.setFSSizes(!0),
                this.playerpanel.nativeElement.requestFullscreen());
          }
          setFSHideControlTime() {
            document.fullscreenElement &&
              ((this.hideControlTime = new Date(new Date().getTime() + 5e3)), this.setFSSizes(!0));
          }
          checkFSHideControls() {
            document.fullscreenElement &&
              new Date().getTime() > this.hideControlTime.getTime() &&
              this.setFSSizes(!1);
          }
          setFSSizes(e) {
            let t = screen.width,
              n = screen.height,
              s = this.playerpanel.nativeElement.children[0].offsetHeight,
              r = this.playerpanel.nativeElement.children[0].offsetWidth,
              i = Math.round(s - (r / 16) * 9);
            (s -= i), 1 == e && (n -= i);
            let o = (n * r) / s;
            o > t && (o = t),
              (this.fullScreenWidth = Math.round(o) + 'px'),
              (this.fullScreenPadding = Math.round((t - o) / 2) + 'px');
          }
          addMarker() {}
          zoom_send_event(e, t) {
            switch (e) {
              case 'start':
                this.isMoving = !0;
                break;
              case 'move':
                (this.theLastZoomPosition = t.source.freeDragPosition.x + t.distance.x),
                  (this.scrollcontainer.nativeElement.scrollLeft =
                    this.scrollcontainer.nativeElement.offsetWidth *
                    (this.zoom / 100 - 1) *
                    (this.theLastZoomPosition /
                      (this.zoombar_boundary.nativeElement.offsetWidth * (1 - 100 / this.zoom))));
                break;
              case 'end':
                (this.zoomDragPosition = { x: this.theLastZoomPosition, y: 0 }),
                  (this.isMoving = !1);
            }
          }
          setZoom(e) {
            (this.zoom = e), this.setZoomBarPosition(e);
          }
          setZoomBarPosition(e) {
            if (this.isMoving) return;
            if (!this.scrollcontainer) return;
            if (100 == e)
              return (
                (this.theLastZoomPosition = 0),
                void (this.zoomDragPosition = { x: this.theLastZoomPosition, y: 0 })
              );
            let t = this.zoombar_boundary.nativeElement.offsetWidth * (1 - 100 / this.zoom);
            this.theLastZoomPosition > t &&
              ((this.theLastZoomPosition = t),
              (this.zoomDragPosition = { x: this.theLastZoomPosition, y: 0 })),
              (this.scrollcontainer.nativeElement.scrollLeft =
                this.scrollcontainer.nativeElement.offsetWidth *
                (this.zoom / 100 - 1) *
                (this.theLastZoomPosition / t));
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(ti(Pr));
          }),
          (e.ɵcmp = nt({
            type: e,
            selectors: [['app-player']],
            viewQuery: function (e, t) {
              var n;
              1 & e && (Oo(Vh, !0), Oo(jh, !0), Oo(Hh, !0), Oo(Bh, !0), Oo(Oh, !0)),
                2 & e &&
                  (Mo((n = Ro())) && (t.playerpanel = n.first),
                  Mo((n = Ro())) && (t.mediamdpanel = n.first),
                  Mo((n = Ro())) && (t.zoombar_boundary = n.first),
                  Mo((n = Ro())) && (t.scrollcontainer = n.first),
                  Mo((n = Ro())) && (t.playerMedia = n.first));
            },
            hostBindings: function (e, t) {
              1 & e &&
                ci(
                  'fullscreenchange',
                  function (e) {
                    return t.onFullScreenChange(e);
                  },
                  !1,
                  bn
                );
            },
            inputs: {
              playerParameters: ['player-parameters', 'playerParameters'],
              playerConfig: ['player-config', 'playerConfig'],
              showControls: ['show-controls', 'showControls'],
              quickExport: ['quick-export', 'quickExport'],
              webHost: ['web-host', 'webHost'],
              parts: 'parts',
            },
            outputs: {
              partsChange: 'partsChange',
              on_close: 'on_close',
              on_reopen: 'on_reopen',
              on_expand: 'on_expand',
              on_open_date_time_dialog: 'on_open_date_time_dialog',
              on_status_change: 'on_status_change',
              on_create_project: 'on_create_project',
            },
            features: [Ci],
            decls: 12,
            vars: 7,
            consts: [
              [2, 'position', 'relative', 'height', '100%', 3, 'mousemove'],
              ['playerpanel', ''],
              [1, 'player-table'],
              [1, 'player-row'],
              ['colspan', '2'],
              [2, 'height', '100%', 'width', '100%'],
              [2, 'width', '100%'],
              [3, 'player-parameters', 'media-md-panel', 'player-status'],
              [2, 'vertical-align', 'top', 'background', 'white'],
              [2, 'height', '100%', 'background', 'black'],
              ['mediamdpanel', ''],
            ],
            template: function (e, t) {
              if (
                (1 & e &&
                  (ri(0, 'div', 0, 1),
                  ci('mousemove', function () {
                    return t.setFSHideControlTime();
                  }),
                  ri(2, 'table', 2),
                  ri(3, 'tr', 3),
                  ri(4, 'td', 4),
                  ri(5, 'table', 5),
                  ri(6, 'tr'),
                  ri(7, 'td', 6),
                  oi(8, 'app-player-media', 7),
                  ii(),
                  ri(9, 'td', 8),
                  oi(10, 'div', 9, 10),
                  ii(),
                  ii(),
                  ii(),
                  ii(),
                  ii(),
                  ii(),
                  ii()),
                2 & e)
              ) {
                const e = It.lFrame.contextLView[30];
                yi('padding-left', t.fullScreenPadding),
                  is(2),
                  yi('width', t.fullScreenWidth),
                  is(6),
                  ni('player-parameters', t.playerParameters)('media-md-panel', e)(
                    'player-status',
                    t.playerStatus
                  );
              }
            },
            directives: [Oh],
            styles: [''],
          })),
          e
        );
      })();
      function qh() {}
      class $h {
        constructor(e, t, n) {
          (this.nextOrObserver = e), (this.error = t), (this.complete = n);
        }
        call(e, t) {
          return t.subscribe(new Uh(e, this.nextOrObserver, this.error, this.complete));
        }
      }
      class Uh extends f {
        constructor(e, t, n, r) {
          super(e),
            (this._tapNext = qh),
            (this._tapError = qh),
            (this._tapComplete = qh),
            (this._tapError = n || qh),
            (this._tapComplete = r || qh),
            s(t)
              ? ((this._context = this), (this._tapNext = t))
              : t &&
                ((this._context = t),
                (this._tapNext = t.next || qh),
                (this._tapError = t.error || qh),
                (this._tapComplete = t.complete || qh));
        }
        _next(e) {
          try {
            this._tapNext.call(this._context, e);
          } catch (t) {
            return void this.destination.error(t);
          }
          this.destination.next(e);
        }
        _error(e) {
          try {
            this._tapError.call(this._context, e);
          } catch (e) {
            return void this.destination.error(e);
          }
          this.destination.error(e);
        }
        _complete() {
          try {
            this._tapComplete.call(this._context);
          } catch (e) {
            return void this.destination.error(e);
          }
          return this.destination.complete();
        }
      }
      class Gh {
        constructor(e) {
          this.selector = e;
        }
        call(e, t) {
          return t.subscribe(new Kh(e, this.selector, this.caught));
        }
      }
      class Kh extends I {
        constructor(e, t, n) {
          super(e), (this.selector = t), (this.caught = n);
        }
        error(e) {
          if (!this.isStopped) {
            let n;
            try {
              n = this.selector(e, this.caught);
            } catch (t) {
              return void super.error(t);
            }
            this._unsubscribeAndRecycle();
            const s = new k(this, void 0, void 0);
            this.add(s);
            const r = N(this, n, void 0, void 0, s);
            r !== s && this.add(r);
          }
        }
      }
      let Wh = (() => {
        class e {
          constructor(e) {
            (this.http = e), (this.api = 'api/channels'), (this.loginapi = 'api/account/auth');
          }
          getChannel(e, t) {
            return this.http.get(`${e}${this.api}/${t}`).pipe();
          }
          getChannels(e, t) {
            return this.http
              .get(`${e}${this.api}`, { headers: { ActAuth: `${t.scheme} ${t.token}` } })
              .pipe();
          }
          login(e, t, n) {
            return this.http
              .post(`${e}${this.loginapi}`, {
                username: t,
                password: n,
                application: 'player_api',
                scope: 'play',
              })
              .pipe(
                ((r = e => this.log('login')),
                function (e) {
                  return e.lift(new $h(r, void 0, void 0));
                }),
                ((s = this.handleError('login', { error: '' })),
                function (e) {
                  const t = new Gh(s),
                    n = e.lift(t);
                  return (t.caught = n);
                })
              );
            var s, r;
          }
          handleError(e = 'operation', t) {
            return n => ((t.error = `${e} failed: ${n.message}`), qc(t));
          }
          log(e) {}
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(He(lh));
          }),
          (e.ɵprov = se({ token: e, factory: e.ɵfac, providedIn: 'root' })),
          e
        );
      })();
      function Qh(e, t) {
        if (1 & e) {
          const e = Ft();
          ri(0, 'app-player', 2),
            ci('on_status_change', function (t) {
              return (It.lFrame.contextLView = e), pi().showStatus(t);
            }),
            ii();
        }
        if (2 & e) {
          const e = pi();
          ni('show-controls', !0)('web-host', e.webhost)('player-config', e.config)(
            'player-parameters',
            e.playerParameters
          );
        }
      }
      let Zh = (() => {
          class e {
            constructor(e) {
              (this.channelsService = e),
                (this.webhost = ''),
                (this.webhostapi = ''),
                (this.playerParameters = null),
                (this.channels = []),
                (this.config = { languages: {} }),
                (this.onStatusChange = new To()),
                (this.onResponse = new To());
            }
            get source() {
              return this._source;
            }
            set source(e) {
              if ('null' == e)
                return (
                  (this.playerParameters = null),
                  this.onStatusChange.emit(''),
                  void this.onResponse.emit('')
                );
              this._source = JSON.parse(e);
              let t = this.channels.find(
                e => e.displayName.toLowerCase() == this._source.channel.toLowerCase()
              );
              t
                ? ((this._source.channel = t.id),
                  'live' == this._source.mode && this.livePlayer(this._source),
                  'storage' == this._source.mode &&
                    ((this._source.from = new Date(JSON.parse(this._source.from))),
                    (this._source.to = new Date(JSON.parse(this._source.to))),
                    this.storagePlayer(this._source)))
                : this.onResponse.emit({ error: `${this._source.channel} not found.` });
            }
            get control() {
              return this._control;
            }
            set control(e) {
              (this._control = JSON.parse(e)), this.player.ctrl_action(this._control);
            }
            get login() {
              return this._login;
            }
            set login(e) {
              (this._login = JSON.parse(e)), this.getLogin(this._login);
            }
            ngOnInit() {
              (this.webhostapi = this.web_host + ('/' == this.web_host.slice(-1) ? '' : '/')),
                (this.webhost = this.webhostapi + 'ashx');
            }
            getLogin(e) {
              this.channelsService.login(this.webhostapi, e.user, e.password).subscribe(e => {
                e.error ? this.onResponse.emit(e) : this.getChannels(e);
              });
            }
            showStatus(e) {
              delete e.status.mute, this.onStatusChange.emit(e.status);
            }
            getChannels(e) {
              this.channelsService.getChannels(this.webhostapi, e).subscribe(e => {
                this.channels = e;
                let t = { channels: [] };
                e.forEach(e => {
                  t.channels.push({ name: e.displayName });
                }),
                  this.onResponse.emit(t);
              });
            }
            getChannel(e) {
              this.channelsService.getChannel(this.webhostapi, e).subscribe(e => {
                console.log(e);
              });
            }
            livePlayer(e) {
              (this.playerParameters = null),
                this.channelsService.getChannel(this.webhostapi, e.channel).subscribe(e => {
                  (this.currentChannel = e),
                    this.onResponse.emit({
                      languages: e.audioLng,
                      teletext: e.teletextLng,
                      subtitles: e.subtitleLng,
                    }),
                    this.livePlayerEnd(e);
                });
            }
            livePlayerEnd(e) {
              setTimeout(
                () =>
                  (this.playerParameters = {
                    playerId: 1,
                    mediaSourceType: 'live',
                    recordingRoot: e.recordingRoot,
                    framesRoot: e.framesRoot,
                    liveRecordingRoot: e.liveRecordingRoot,
                    physicalName: e.physicalName,
                    displayName: e.displayName,
                    logoUrl: e.logoUrl,
                    audioOnly: e.audioOnly,
                    audioLng: e.audioLng,
                    teletextLng: e.teletextLng,
                    subtitleLng: e.subtitleLng,
                    openRightPanel: !1,
                    showControls: !0,
                  }),
                100
              );
            }
            storagePlayer(e) {
              (this.playerParameters = null),
                this.channelsService.getChannel(this.webhostapi, e.channel).subscribe(t => {
                  (this.currentChannel = t),
                    this.onResponse.emit({
                      languages: t.audioLng,
                      teletext: t.teletextLng,
                      subtitles: t.subtitleLng,
                    }),
                    this.storagePlayerEnd(t, e);
                });
            }
            storagePlayerEnd(e, t) {
              setTimeout(
                () =>
                  (this.playerParameters = {
                    playerId: 2,
                    mediaSourceType: 'storage',
                    recordingRoot: e.recordingRoot,
                    framesRoot: e.framesRoot,
                    liveRecordingRoot: e.liveRecordingRoot,
                    physicalName: e.physicalName,
                    displayName: e.displayName,
                    logoUrl: e.logoUrl,
                    audioOnly: e.audioOnly,
                    audioLng: e.audioLng,
                    teletextLng: e.teletextLng,
                    subtitleLng: e.subtitleLng,
                    openRightPanel: !1,
                    showControls: !0,
                    from: t.from,
                    to: t.to,
                  }),
                100
              );
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(ti(Wh));
            }),
            (e.ɵcmp = nt({
              type: e,
              selectors: [['app-app-player']],
              viewQuery: function (e, t) {
                var n;
                1 & e && Oo(zh, !0), 2 & e && Mo((n = Ro())) && (t.player = n.first);
              },
              inputs: {
                web_host: ['web-host', 'web_host'],
                source: 'source',
                control: 'control',
                login: 'login',
              },
              outputs: { onStatusChange: 'status-change', onResponse: 'onresponse' },
              decls: 2,
              vars: 1,
              consts: [
                [2, 'width', '100%', 'height', '100%'],
                [
                  3,
                  'show-controls',
                  'web-host',
                  'player-config',
                  'player-parameters',
                  'on_status_change',
                  4,
                  'ngIf',
                ],
                [
                  3,
                  'show-controls',
                  'web-host',
                  'player-config',
                  'player-parameters',
                  'on_status_change',
                ],
              ],
              template: function (e, t) {
                1 & e && (ri(0, 'div', 0), ei(1, Qh, 1, 4, 'app-player', 1), ii()),
                  2 & e && (is(1), ni('ngIf', t.playerParameters));
              },
              directives: [Ba, zh],
              styles: [''],
            })),
            e
          );
        })(),
        Jh = (() => {
          class e {
            constructor(e) {
              this.injector = e;
              const t = (function (e, t) {
                const n = (function (e, t) {
                    return t.get(Ii).resolveComponentFactory(e).inputs;
                  })(e, t.injector),
                  s = t.strategyFactory || new El(e, t.injector),
                  r = (function (e) {
                    const t = {};
                    return (
                      e.forEach(({ propName: e, templateName: n }) => {
                        var s;
                        t[((s = n), s.replace(/[A-Z]/g, e => `-${e.toLowerCase()}`))] = e;
                      }),
                      t
                    );
                  })(n);
                class i extends xl {
                  constructor(e) {
                    super(), (this.injector = e);
                  }
                  get ngElementStrategy() {
                    if (!this._ngElementStrategy) {
                      const e = (this._ngElementStrategy = s.create(this.injector || t.injector)),
                        r = n
                          .filter(({ propName: e }) => this.hasOwnProperty(e))
                          .map(({ propName: e }) => [e, this[e]]);
                      this instanceof i ? r.forEach(([e]) => delete this[e]) : kl(n, this),
                        r.forEach(([t, n]) => e.setInputValue(t, n));
                    }
                    return this._ngElementStrategy;
                  }
                  attributeChangedCallback(e, t, n, s) {
                    this.ngElementStrategy.setInputValue(r[e], n);
                  }
                  connectedCallback() {
                    this.ngElementStrategy.connect(this),
                      (this.ngElementEventsSubscription = this.ngElementStrategy.events.subscribe(
                        e => {
                          const t = (function (e, t, n) {
                            if ('function' != typeof CustomEvent) {
                              const s = e.createEvent('CustomEvent');
                              return s.initCustomEvent(t, !1, !1, n), s;
                            }
                            return new CustomEvent(t, { bubbles: !1, cancelable: !1, detail: n });
                          })(this.ownerDocument, e.name, e.value);
                          this.dispatchEvent(t);
                        }
                      ));
                  }
                  disconnectedCallback() {
                    this._ngElementStrategy && this._ngElementStrategy.disconnect(),
                      this.ngElementEventsSubscription &&
                        (this.ngElementEventsSubscription.unsubscribe(),
                        (this.ngElementEventsSubscription = null));
                  }
                }
                return (i.observedAttributes = Object.keys(r)), kl(n, i.prototype), i;
              })(Zh, { injector: e });
              customElements.define('actus-player', t);
            }
            ngDoBootstrap() {}
          }
          return (
            (e.ɵmod = ot({ type: e })),
            (e.ɵinj = re({
              factory: function (t) {
                return new (t || e)(He(qr));
              },
              providers: [],
              imports: [[vl, zc, Eh]],
            })),
            e
          );
        })();
      (function () {
        if (qn) throw new Error('Cannot enable prod mode after platform setup.');
        zn = !1;
      })(),
        yl()
          .bootstrapModule(Jh)
          .catch(e => console.error(e));
    },
    zn8P: function (e, t) {
      function n(e) {
        return Promise.resolve().then(function () {
          var t = new Error("Cannot find module '" + e + "'");
          throw ((t.code = 'MODULE_NOT_FOUND'), t);
        });
      }
      (n.keys = function () {
        return [];
      }),
        (n.resolve = n),
        (e.exports = n),
        (n.id = 'zn8P');
    },
  },
  [[0, 0]],
]);
