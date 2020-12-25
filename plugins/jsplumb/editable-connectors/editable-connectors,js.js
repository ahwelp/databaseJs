(function() {
    var i, t = this && this.__extends || (i = Object.setPrototypeOf || {
        __proto__: []
    }instanceof Array && function(t, e) {
        t.__proto__ = e
    }
    || function(t, e) {
        for (var n in e)
            e.hasOwnProperty(n) && (t[n] = e[n])
    }
    ,
    function(t, e) {
        function n() {
            this.constructor = t
        }
        i(t, e),
        t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype,
        new n)
    }
    ), h = "jtk-connection-edit", l = "jtk-bezier-guideline", d = "jtk-anchor-placeholder", s = "jtk-anchor-candidate", u = "jtk-bezier-handle", c = "jtk-bezier-handle-control-point", _ = "jtk-bezier-handle-control-point-1", p = "jtk-bezier-handle-control-point-2", g = "jtk-bezier-handle-secondary", m = "jtk-bezier-handle-secondary-source", w = "jtk-bezier-handle-secondary-target", y = "jtk-anchor-face", f = "none", j = "block", B = "left", b = "top", v = "right", C = "bottom", P = "px", r = "absolute", x = "dual", e = this, E = e.jsPlumb, S = (e.jsPlumbInstance,
    e.jsPlumbUtil), n = e.jsPlumbToolkit;
    function a(t) {
        return "." + t
    }
    var A = a(d);
    function D(t, e, n) {
        var i = document.createElement("div");
        return i.className = n || "",
        i.style.position = r,
        i.style.left = t + P,
        i.style.top = e + P,
        i
    }
    function o(t, e, n, i, o) {
        var s = t.getSize(e)
          , r = s[0] * n
          , a = s[1] * i
          , h = D(r, a, o);
        e.appendChild(h);
        var l = t.getSize(h);
        return h.style.left = r - l[0] / 2 + P,
        h.style.top = a - l[1] / 2 + P,
        h
    }
    var k = (M.prototype._attachOverlay = function(t, e, n) {
        var i = [n[0], t.getJsPlumb().extend({}, n[1])];
        i[1].id = jsPlumbUtil.uuid(),
        this.currentOverlays.push(e.addOverlay(i))
    }
    ,
    M.prototype._attachOverlays = function(e, n, t) {
        var i = this;
        this._detachOverlays(),
        t.forEach(function(t) {
            i._attachOverlay(e, n, t)
        })
    }
    ,
    M.prototype._detachOverlays = function() {
        var e = this;
        this.currentOverlays.forEach(function(t) {
            e.current.removeOverlay(t.id)
        })
    }
    ,
    M.prototype._attachDeleteButton = function(e, t) {
        function n() {
            return e.getToolkit().removeEdge(o.currentEdge)
        }
        function i() {
            t.onMaybeDelete ? t.onMaybeDelete(o.currentEdge, o.current, n) : n()
        }
        var o = this
          , s = t.deleteButtonClass || "jtk-edge-delete"
          , r = t.deleteButtonLocation || .1;
        Array.isArray(r) || (r = [r]),
        r.forEach(function(t) {
            o._attachOverlay(e, o.current, ["Label", {
                location: t,
                cssClass: s,
                events: {
                    click: i
                }
            }])
        })
    }
    ,
    M.prototype.repaintConnection = function(t) {
        this.current && this.current.repaint({
            args: t
        })
    }
    ,
    M.prototype.fireConnectionEditEvent = function() {
        this._jsPlumb.fire("connectionEdit", {
            connection: this.current,
            geometry: this.current.connector.exportGeometry()
        })
    }
    ,
    M.prototype.refresh = function(t) {
        this.current && (this._drawAnchors(),
        this._repaint && this._repaint(t))
    }
    ,
    M.prototype._drawAnchors = function() {
        var t, e, u = this;
        if (this.current) {
            function n(t, e) {
                var n = u.current.endpoints[t]
                  , i = n.anchor;
                if (i.isDynamic || i.isContinuous) {
                    var o = i.getCurrentLocation({
                        element: n
                    })
                      , s = u._jsPlumb.getOffset(n.element)
                      , r = [o[0] - s.left, o[1] - s.top]
                      , a = r[0]
                      , h = r[1]
                      , l = void 0;
                    null != e ? l = e : (l = D(a, h, d),
                    n.element.appendChild(l),
                    u._setElementPosition(l, a, h),
                    l._jsPlumbAnchor = {
                        anchor: i,
                        endpoint: n,
                        idx: t
                    });
                    var c = u._jsPlumb.getSize(l);
                    return l.style.left = a - c[0] / 2 + P,
                    l.style.top = h - c[1] / 2 + P,
                    [s, l]
                }
                return [[0, 0], null]
            }
            t = n(0, this.sourceAnchorPlaceholder),
            this.sourceDimensions = t[0],
            this.sourceAnchorPlaceholder = t[1],
            e = n(1, this.targetAnchorPlaceholder),
            this.targetDimensions = e[0],
            this.targetAnchorPlaceholder = e[1]
        }
    }
    ,
    M.prototype._cleanupAnchors = function() {
        this.current && (this.sourceAnchorPlaceholder && (this.sourceAnchorPlaceholder.parentNode.removeChild(this.sourceAnchorPlaceholder),
        delete this.sourceAnchorPlaceholder._jsPlumbAnchor),
        this.targetAnchorPlaceholder && (this.targetAnchorPlaceholder.parentNode.removeChild(this.targetAnchorPlaceholder),
        delete this.targetAnchorPlaceholder._jsPlumbAnchor)),
        this.sourceAnchorPlaceholder = null,
        this.targetAnchorPlaceholder = null,
        this.sourceDimensions = null,
        this.targetDimensions = null
    }
    ,
    M.prototype._clearGeometry = function() {
        this.current && (this.current.getConnector().setGeometry(null, !0),
        this.current.getConnector().setEditing(!1))
    }
    ,
    M.prototype.reset = function() {
        this.deactivate(),
        this._clearGeometry(),
        this._clearHandles(),
        this._jsPlumb.revalidate(this.current.source),
        this._jsPlumb.revalidate(this.current.target),
        this._jsPlumb.fire("clearConnectionEdits", this.current)
    }
    ,
    M.prototype.isActive = function() {
        return this.active
    }
    ,
    M.prototype._setElementPosition = function(t, e, n) {
        var i = this._jsPlumb.getSize(t)
          , o = e - i[0] / 2
          , s = n - i[1] / 2;
        t.style.left = o + P,
        t.style.top = s + P
    }
    ,
    M.prototype.activate = function(t, e, n) {
        var i = this;
        if (this.deactivate(),
        this.current = e,
        this.currentEdge = this.current.edge,
        this._katavorio.setZoom(this._jsPlumb.getZoom()),
        null == this.current._jsPlumb)
            return this.current = null,
            void (this.currentEdge = null);
        this.current._paint = this.current.paint,
        this.current.paint = function(t) {
            i.current._paint.apply(i.current, [t]),
            t = t || {},
            i.refresh(t.args)
        }
        ,
        n.overlays && this._attachOverlays(t, e, n.overlays),
        !0 === n.deleteButton && this._attachDeleteButton(t, n),
        this._activate(t, e, n);
        var o = this.current.endpoints[0].anchor
          , s = this.current.endpoints[1].anchor;
        o.lock(),
        s.lock(),
        this._drawAnchors(),
        this.current.addClass(h),
        e.source._katavorioDrag && e.source._katavorioDrag.addFilter(A),
        e.target._katavorioDrag && e.target._katavorioDrag.addFilter(A),
        this.active = !0,
        this._jsPlumb.fire("startConnectionEdit", this.current)
    }
    ,
    M.prototype.deactivate = function(t) {
        null != this.current && null != this.current._jsPlumb && (this._detachOverlays(),
        this.current.paint = this.current._paint,
        this.current._paint = null,
        this.current.source._katavorioDrag && this.current.source._katavorioDrag.removeFilter(A),
        this.current.target._katavorioDrag && this.current.target._katavorioDrag.removeFilter(A),
        this.current.endpoints[0].anchor,
        this.current.endpoints[1].anchor,
        this.current.removeClass(h),
        this._cleanupAnchors()),
        this._clearHandles(),
        null != this.current && this._jsPlumb.fire("stopConnectionEdit", this.current),
        this.active = !1,
        this.current = null,
        this.currentEdge = null
    }
    ,
    M.prototype._addDragHandler = function(t) {
        this._katavorioDraggable.addSelector(t),
        this._dragHandlers[t.selector] = t
    }
    ,
    M);
    function M(t) {
        var h = this;
        this.currentOverlays = [],
        this._dragHandlers = {},
        this.active = !1,
        this._jsPlumb = t.jsPlumb,
        this._surface = t.surface,
        this._jsPlumb.bind("internal.connectionDetached", function(t) {
            t.connection === h.current && h.deactivate()
        }),
        this.eventManager = new Mottle,
        this._katavorio = new Katavorio({
            bind: function(t, e, n) {
                return h.eventManager.on(t, e, n)
            },
            unbind: function(t, e, n) {
                return h.eventManager.off(t, e, n)
            },
            getSize: function(t) {
                return [parseInt(t.offsetWidth, 10), parseInt(t.offsetHeight, 10)]
            },
            getPosition: function(t) {
                return [parseInt(t.style.left, 10), parseInt(t.style.top, 10)]
            },
            setPosition: function(t, e) {
                t.style.left = e[0] + P,
                t.style.top = e[1] + P
            },
            addClass: this._jsPlumb.addClass.bind(this._jsPlumb),
            removeClass: this._jsPlumb.removeClass.bind(this._jsPlumb),
            intersects: Biltong.intersects,
            indexOf: function(t, e) {
                return t.indexOf(e)
            },
            scope: "connector-editor",
            css: {
                noSelect: this._jsPlumb.dragSelectClass,
                delegatedDraggable: "jtk-delegated-draggable",
                droppable: "jtk-droppable",
                draggable: "jtk-draggable",
                drag: "jtk-drag",
                selected: "jtk-drag-selected",
                active: "jtk-drag-active",
                hover: "jtk-drag-hover",
                ghostProxy: "jtk-ghost-proxy"
            },
            zoom: this._jsPlumb.getZoom()
        }),
        this._katavorioDraggable = this._katavorio.draggable(this._jsPlumb.getContainer(), {})[0],
        this._katavorioDraggable.addSelector({
            selector: A,
            constrain: function(t, e, n, i) {
                var o = e._jsPlumbAnchor.anchor
                  , s = e._jsPlumbAnchor.idx;
                t = o.isContinuous ? function(t, e, n, i, o, s, r) {
                    var a = t.getSupportedFaces()
                      , h = n.parentNode
                      , l = [["left", e[0]], ["right", i.w - e[0]], ["top", e[1]], ["bottom", i.h - e[1]]]
                      , c = new Map([["top", [0, -1]], ["bottom", [0, 1]], ["left", [-1, 0]], ["right", [1, 0]]]);
                    l.sort(function(t, e) {
                        return t[1] < e[1] ? -1 : 1
                    });
                    for (var u = null, d = 0; d < l.length; d++)
                        if (-1 != a.indexOf(l[d][0])) {
                            u = l[d][0];
                            break
                        }
                    null != u && (h.setAttribute(y, u),
                    t.setCurrentFace(u, !0),
                    r.setAnchorOrientation(s, c.get(u)));
                    return e
                }(o, t, e, n, 0, s, h.current.getConnector()) : o.isDynamic ? function(t, s, e, r, n, i, o) {
                    var a = t.getAnchors().map(function(t) {
                        return [t.x, t.y, t.orientation[0], t.orientation[1], t]
                    }).map(function(t, e) {
                        var n = [r.w * t[0], r.h * t[1]]
                          , i = n[0]
                          , o = n[1];
                        return [e, Math.sqrt(Math.pow(s[0] - i, 2) + Math.pow(s[1] - o, 2)), t]
                    });
                    a.sort(function(t, e) {
                        return t[1] < e[1] ? -1 : 1
                    });
                    var h = a[0][2];
                    return t.setAnchor(h[4]),
                    o.setAnchorOrientation(i, h.slice(2)),
                    s
                }(o, t, 0, n, 0, s, h.current.getConnector()) : function(t, s, e, r, n, i, o) {
                    var a = [[t.x, t.y, t.orientation[0], t.orientation[1]], [t.y, 1 - t.x, t.orientation[1], -1 * t.orientation[0]], [1 - t.x, 1 - t.y, -1 * t.orientation[0], -1 * t.orientation[1]], [1 - t.y, t.x, -1 * t.orientation[1], t.orientation[0]]].map(function(t, e) {
                        var n = [r.w * t[0], r.h * t[1]]
                          , i = n[0]
                          , o = n[1];
                        return [e, Math.sqrt(Math.pow(s[0] - i, 2) + Math.pow(s[1] - o, 2)), t]
                    });
                    a.sort(function(t, e) {
                        return t[1] < e[1] ? -1 : 1
                    });
                    var h = a[0][2];
                    return t.x = h[0],
                    t.y = h[1],
                    t.orientation = h.slice(2),
                    t.lastReturnValue = null,
                    o.setAnchorOrientation(i, h.slice(2)),
                    s
                }(o, t, 0, n, 0, s, h.current.getConnector()),
                h._jsPlumb.revalidate(e.parentNode);
                var r = [e.offsetWidth, e.offsetHeight]
                  , a = {
                    xmin: -r[0] / 2,
                    xmax: n.w - r[0] / 2,
                    ymin: -r[1] / 2,
                    ymax: n.h - r[1] / 2
                };
                return [t[0] < a.xmin ? a.xmin : t[0] > a.xmax ? a.xmax : t[0], t[1] < a.ymin ? a.ymin : t[1] > a.ymax ? a.ymax : t[1]]
            },
            start: function(t) {
                var e = t.drag.getDragElement()
                  , n = e._jsPlumbAnchor.anchor
                  , i = e._jsPlumbAnchor.endpoint;
                if (n.isContinuous)
                    e.parentNode.setAttribute(y, n.getCurrentFace());
                else if (n.isDynamic) {
                    n.getAnchors().map(function(t) {
                        return [t.x, t.y, t.orientation[0], t.orientation[1]]
                    }).forEach(function(t) {
                        o(h._jsPlumb, i.element, t[0], t[1], s)
                    })
                } else {
                    [[n.x, n.y, n.orientation[0], n.orientation[1]], [n.y, 1 - n.x, n.orientation[1], -1 * n.orientation[0]], [1 - n.x, 1 - n.y, -1 * n.orientation[0], -1 * n.orientation[1]], [1 - n.y, n.x, -1 * n.orientation[1], n.orientation[0]]].forEach(function(t) {
                        o(h._jsPlumb, i.element, t[0], t[1], s)
                    })
                }
            },
            stop: function(t) {
                var e = t.el.parentNode
                  , n = t.drag.getDragElement()
                  , i = n._jsPlumbAnchor.anchor
                  , o = (n._jsPlumbAnchor.idx,
                n._jsPlumbAnchor.endpoint);
                i.isContinuous ? e.removeAttribute(y) : i.isDynamic,
                o.element.querySelectorAll(a(s)).forEach(function(t) {
                    return t.parentNode.removeChild(t)
                }),
                h._drawAnchors(),
                h._update(),
                h.fireConnectionEditEvent()
            }
        }),
        this._surface.bind("nodeMoveEnd", function(t) {
            h.active && h.currentEdge && (t.node === h.currentEdge.source || t.node === h.currentEdge.target) && (h._elementDragged(t),
            h.fireConnectionEditEvent())
        }),
        this._surface.bind("nodeMove", function(t) {
            h.active && h.currentEdge && (t.node === h.currentEdge.source || t.node === h.currentEdge.target) && h._elementDragging(t)
        }),
        this._jsPlumb.bind("zoom", function(t) {
            h._katavorio.setZoom(t)
        })
    }
    var H = (O.prototype._setAnchorLocation = function(t, e, n) {
        var i = e.endpoints[n].anchor;
        if (i.isContinuous) {
            var o = b;
            0 === t[2] ? o = B : 1 === t[2] ? o = v : 1 === t[3] && (o = C),
            i.setCurrentFace(o, !0)
        } else
            i.isDynamic ? i.setAnchorCoordinates(t.slice(2)) : (i.x = t[2],
            i.y = t[3],
            i.orientation = t.slice(4)),
            i.lastReturnValue = null;
        i.lock()
    }
    ,
    O.prototype.importGeometry = function(t, e) {
        return !!this._importGeometry && !!this._importGeometry(t) && (this._setAnchorLocation(t.source, e, 0),
        this._setAnchorLocation(t.target, e, 1),
        !0)
    }
    ,
    O.prototype.clearEdits = function() {
        this._clearEdits && this._clearEdits()
    }
    ,
    O);
    function O() {}
    E.Connectors.AbstractEditableConnector = H,
    S.extend(H, E.Connectors.AbstractConnector),
    null != n && (n.Renderers.Surface.prototype._resolveConnection = function(t) {
        return null == t ? null : "string" == typeof t ? this.getRenderedConnection(t) : t.constructor == E.Connection ? t : this.getRenderedConnection(t.getId())
    }
    ,
    n.Renderers.Surface.prototype._ensureCanEdit = function() {
        if (!this.startEditing)
            throw new Error("Connection editors not available.")
    }
    ,
    n.Renderers.Surface.prototype.startEditing = function(t, e) {
        this._ensureCanEdit();
        var n = this._resolveConnection(t);
        if (null != n) {
            var i = this.getJsPlumb();
            n.getConnector();
            e = E.extend({}, e || {});
            var o = n.getConnector().type;
            if (!E.ConnectorEditors)
                throw new Error("Connector editors not found. Have you imported jsPlumbToolkitEditableConnectors ?");
            if (!E.ConnectorEditors[o])
                throw new Error("No editor available for connector type [" + o + "]");
            if (null == i._connectorEditors && (i._connectorEditors = {}),
            null == i._connectorEditors[o]) {
                var s = i.extend({}, e);
                s.jsPlumb = i,
                s.surface = this,
                i._connectorEditors[o] = new E.ConnectorEditors[o](s)
            }
            i._connectorEditors[o].activate(this, n, e)
        }
    }
    ,
    n.Renderers.Surface.prototype.stopEditing = function() {
        this._ensureCanEdit();
        var t = this.getJsPlumb();
        for (var e in t._connectorEditors)
            t._connectorEditors[e].deactivate()
    }
    ,
    n.Renderers.Surface.prototype.clearEdits = function(t) {
        this._ensureCanEdit();
        var e = this._resolveConnection(t);
        if (null != e) {
            var n = e.getConnector();
            return !!n.clearEdits && (n.clearEdits(),
            e.repaint(),
            !0)
        }
    }
    );
    var Y = "v"
      , G = "h"
      , X = -1
      , z = "EditableFlowchart"
      , R = "Straight";
    function I(t) {
        return t < 0 ? -1 : 0 === t ? 0 : 1
    }
    function L(t) {
        return Math.sqrt(Math.pow(t[7] - t[5], 2) + Math.pow(t[8] - t[6], 2))
    }
    function T(t) {
        return [I(t[2] - t[0]), I(t[3] - t[1])]
    }
    function N(t) {
        var e = [];
        return e.push.apply(e, t),
        e
    }
    function F(t, e) {
        return t[0] === e[0] && t[1] === e[1]
    }
    function U(t, e, n, i, o, s) {
        if (t.lastx !== e || t.lasty !== n) {
            var r = null == t.lastx ? i.sx : t.lastx
              , a = null == t.lasty ? i.sy : t.lasty
              , h = r === e ? Y : G;
            t.lastx = e,
            t.lasty = n,
            t.segments.push([r, a, e, n, h, r + o, a + s, e + o, n + s])
        }
    }
    function q(t, e) {
        return [t.startStubX, t.startStubY, t.endStubX, t.endStubY]
    }
    function W(t) {
        var e = t[0][5]
          , n = t[0][6]
          , i = t[t.length - 1][7]
          , o = t[t.length - 1][8]
          , s = e <= i ? e : i
          , r = n <= o ? n : o;
        return t.forEach(function(t) {
            t[0] = t[5] - s,
            t[1] = t[6] - r,
            t[2] = t[7] - s,
            t[3] = t[8] - r,
            null != t[4] && 0 !== t[4].length || (t[4] = t[5] === t[7] ? Y : G)
        }),
        t
    }
    function Q(t, e, n, i) {
        var o, s = null;
        if (null != i) {
            if (-1 === (o = t.indexOf(i)))
                return null;
            o += e
        } else
            o = e === X ? t.length - 2 : 1;
        for (var r = o; 0 < r && r < t.length - 1; r += e)
            if (t[r][4] === n) {
                s = [t[r], r];
                break
            }
        return s
    }
    var Z = (J.prototype.setGeometry = function(t, e) {
        this.geometry = t,
        this.edited = null != t && !e
    }
    ,
    J.prototype.setAndTransformGeometry = function(t) {
        t.segments = W(t.segments),
        this.setGeometry(t, !1)
    }
    ,
    J.prototype.setAndTransformSegments = function(t) {
        null != this.geometry && (this.geometry.segments = W(t))
    }
    ,
    J.prototype.exportGeometry = function() {
        if (null == this.geometry)
            return null;
        var t = this.geometry.segments.length
          , e = this.geometry.segments[t - 1];
        return e[7],
        e[8],
        {
            segments: this.geometry.segments.slice(1).map(function(t) {
                return [t[5], t[6]]
            }),
            source: this.geometry.source,
            target: this.geometry.target
        }
    }
    ,
    J.prototype._importGeometry = function(t) {
        if (null != t && null != t.segments && null != t.source && null != t.target) {
            var e = t.segments;
            if (null != e && 3 <= e.length) {
                for (var n = [], i = t.source[0], o = t.source[1], s = 0; s < e.length; s++) {
                    if (e[s][0] - i != 0 && e[s][1] - o != 0)
                        return void console.log("Invalid path segment", i, o, e[s][0], e[s][1], "not in X or Y axis");
                    n.push([0, 0, 0, 0, null, i, o, e[s][0], e[s][1]]),
                    i = e[s][0],
                    o = e[s][1]
                }
                return n.push([0, 0, 0, 0, null, i, o, t.target[0], t.target[1]]),
                this.setAndTransformGeometry({
                    segments: n,
                    source: t.source,
                    target: t.target
                }),
                !0
            }
        }
        return !1
    }
    ,
    J.prototype._clearEdits = function() {
        this.geometry = null,
        this.edited = !1
    }
    ,
    J.prototype.isEdited = function() {
        return this.edited
    }
    ,
    J.prototype.isEditable = function() {
        return !0
    }
    ,
    J.prototype.writeSegments = function(t, e, n) {
        this.paintInfo = n;
        for (var i, o, s, r = null, a = 0; a < e.length - 1; a++) {
            if (r = r || N(e[a]),
            i = N(e[a + 1]),
            o = T(r),
            s = T(i),
            0 < this.cornerRadius && r[4] !== i[4]) {
                var h = Math.min(L(r), L(i))
                  , l = Math.min(this.cornerRadius, h / 2);
                r[2] -= o[0] * l,
                r[3] -= o[1] * l,
                i[0] += s[0] * l,
                i[1] += s[1] * l;
                var c = o[1] === s[0] && 1 === s[0] || o[1] === s[0] && 0 === s[0] && o[0] !== s[1] || o[1] === s[0] && -1 === s[0]
                  , u = (i[1] > r[3] ? 1 : -1) == (i[0] > r[2] ? 1 : -1)
                  , d = u && c || !u && !c ? i[0] : r[2]
                  , _ = u && c || !u && !c ? r[3] : i[1];
                this._super.addSegment(t, R, {
                    x1: r[0],
                    y1: r[1],
                    x2: r[2],
                    y2: r[3]
                }),
                this._super.addSegment(t, "Arc", {
                    r: l,
                    x1: r[2],
                    y1: r[3],
                    x2: i[0],
                    y2: i[1],
                    cx: d,
                    cy: _,
                    ac: c
                })
            } else {
                var p = r[2] === r[0] ? 0 : r[2] > r[0] ? n.lw / 2 : -n.lw / 2
                  , g = r[3] === r[1] ? 0 : r[3] > r[1] ? n.lw / 2 : -n.lw / 2;
                this._super.addSegment(t, R, {
                    x1: r[0] - p,
                    y1: r[1] - g,
                    x2: r[2] + p,
                    y2: r[3] + g
                })
            }
            r = i
        }
        null != i && this._super.addSegment(t, R, {
            x1: i[0],
            y1: i[1],
            x2: i[2],
            y2: i[3]
        })
    }
    ,
    J.prototype._compute = function(t, l) {
        var c = this;
        this.segments = [],
        this.lastx = null,
        this.lasty = null,
        this.lastOrientation = null;
        var e = l.sourcePos
          , n = l.targetPos
          , i = this.geometry;
        if (this.isEdited() && null != i && null != i.segments && 0 < i.segments.length) {
            this.segments = i.segments;
            var o = !F(l.sourcePos, i.source);
            if (!F(l.targetPos, i.target)) {
                var s = this.segments[this.segments.length - 1]
                  , r = Q(this.segments, -1, Y)
                  , a = Q(this.segments, -1, G);
                s[5] = l.targetPos[0] + t.stubs[1] * t.to[0],
                s[6] = l.targetPos[1] + t.stubs[1] * t.to[1],
                s[7] = l.targetPos[0],
                s[8] = l.targetPos[1],
                null != r && null != a && (r[1] > a[1] ? (r[0][5] = s[5],
                r[0][7] = s[5],
                r[0][8] = s[6],
                a[0][7] = s[5]) : (a[0][6] = s[6],
                a[0][8] = s[6],
                a[0][7] = s[5],
                r[0][8] = s[6])),
                this.segments = W(this.segments)
            }
            if (o) {
                var h = this.segments[0]
                  , u = Q(this.segments, 1, Y)
                  , d = Q(this.segments, 1, G);
                h[5] = l.sourcePos[0],
                h[6] = l.sourcePos[1],
                h[7] = l.sourcePos[0] + t.stubs[0] * t.so[0],
                h[8] = l.sourcePos[1] + t.stubs[0] * t.so[1],
                null != u && null != d && (u[1] > d[1] ? (d[0][6] = h[8],
                d[0][8] = h[8],
                d[0][5] = h[7],
                u[0][6] = h[8]) : (u[0][5] = h[7],
                u[0][7] = h[7],
                u[0][6] = h[8],
                d[0][5] = h[7])),
                this.segments = W(this.segments)
            }
            this.setGeometry({
                segments: this.segments,
                source: l.sourcePos.concat(l.sourceOrientation),
                target: l.targetPos.concat(l.targetOrientation),
                quadrant: t.segment
            }, !1)
        } else {
            var _ = n[0] >= e[0] ? e[0] : n[0]
              , p = n[1] >= e[1] ? e[1] : n[1]
              , g = new Map([["perpendicular", q], ["orthogonal", q], ["opposite", function(t, e) {
                var n = t
                  , i = "x" === n.sourceAxis ? 0 : 1;
                return !e && {
                    x: function() {
                        return 1 === n.so[i] && (n.startStubX > n.endStubX && n.tx > n.startStubX || n.sx > n.endStubX && n.tx > n.sx) || -1 === n.so[i] && (n.startStubX < n.endStubX && n.tx < n.startStubX || n.sx < n.endStubX && n.tx < n.sx)
                    },
                    y: function() {
                        return 1 === n.so[i] && (n.startStubY > n.endStubY && n.ty > n.startStubY || n.sy > n.endStubY && n.ty > n.sy) || -1 === n.so[i] && (n.startStubY < n.endStubY && n.ty < n.startStubY || n.sy < n.endStubY && n.ty < n.sy)
                    }
                }[n.sourceAxis]() ? {
                    x: [(t.sx + t.tx) / 2, t.startStubY, (t.sx + t.tx) / 2, t.endStubY],
                    y: [t.startStubX, (t.sy + t.ty) / 2, t.endStubX, (t.sy + t.ty) / 2]
                }[n.sourceAxis] : [t.startStubX, t.startStubY, t.endStubX, t.endStubY]
            }
            ]]).get(t.anchorOrientation)(t, this.alwaysRespectStubs)
              , m = "x" === t.sourceAxis ? 0 : 1
              , w = "x" === t.sourceAxis ? 1 : 0
              , y = g[m]
              , f = g[w]
              , j = g[2 + m]
              , B = g[2 + w];
            U(this, g[0], g[1], t, _, p);
            var b = t.startStubX + (t.endStubX - t.startStubX) * this.midpoint
              , v = t.startStubY + (t.endStubY - t.startStubY) * this.midpoint
              , C = {
                x: [0, 1],
                y: [1, 0]
            }
              , P = {
                perpendicular: function(t, e) {
                    var n = {
                        x: [[t.startStubX, t.endStubX], null, [t.endStubX, t.startStubX]],
                        y: [[t.startStubY, t.endStubY], null, [t.endStubY, t.startStubY]]
                    }
                      , i = {
                        x: [[b, t.startStubY], [b, t.endStubY]],
                        y: [[t.startStubX, v], [t.endStubX, v]]
                    }
                      , o = {
                        x: [[t.endStubX, t.startStubY]],
                        y: [[t.startStubX, t.endStubY]]
                    }
                      , s = {
                        x: [[t.startStubX, t.endStubY], [t.endStubX, t.endStubY]],
                        y: [[t.endStubX, t.startStubY], [t.endStubX, t.endStubY]]
                    }
                      , r = {
                        x: [[t.startStubX, v], [t.endStubX, v], [t.endStubX, t.endStubY]],
                        y: [[b, t.startStubY], [b, t.endStubY], [t.endStubX, t.endStubY]]
                    }
                      , a = {
                        x: [t.startStubY, t.endStubY],
                        y: [t.startStubX, t.endStubX]
                    }
                      , h = C[e][0]
                      , l = C[e][1]
                      , c = t.so[h] + 1
                      , u = t.to[l] + 1
                      , d = -1 === t.to[l] && a[e][1] < a[e][0] || 1 === t.to[l] && a[e][1] > a[e][0]
                      , _ = n[e][c][0]
                      , p = n[e][c][1]
                      , g = {
                        x: [[[1, 2, 3, 4], null, [2, 1, 4, 3]], null, [[4, 3, 2, 1], null, [3, 4, 1, 2]]],
                        y: [[[3, 2, 1, 4], null, [2, 3, 4, 1]], null, [[4, 1, 2, 3], null, [1, 4, 3, 2]]]
                    }[e][c][u];
                    return t.segment === g[3] || t.segment === g[2] && d ? i[e] : t.segment === g[2] && p < _ ? o[e] : t.segment === g[2] && _ <= p || t.segment === g[1] && !d ? r[e] : t.segment === g[0] || t.segment === g[1] && d ? s[e] : void 0
                },
                orthogonal: function(t, e, n, i, o, s) {
                    var r = {
                        x: -1 === t.so[0] ? Math.min(n, o) : Math.max(n, o),
                        y: -1 === t.so[1] ? Math.min(n, o) : Math.max(n, o)
                    }[e];
                    return {
                        x: [[r, i], [r, s], [o, s]],
                        y: [[i, r], [s, r], [s, o]]
                    }[e]
                },
                opposite: function(t, e, n, i, o) {
                    var s = {
                        x: "y",
                        y: "x"
                    }[e]
                      , r = {
                        x: "height",
                        y: "width"
                    }[e]
                      , a = t["is" + e.toUpperCase() + "GreaterThanStubTimes2"];
                    if (l.sourceEndpoint.elementId !== l.targetEndpoint.elementId)
                        return !a || 1 === t.so[m] && o < n || -1 === t.so[m] && n < o ? {
                            x: [[n, v], [o, v]],
                            y: [[b, n], [b, o]]
                        }[e] : 1 === t.so[m] && n < o || -1 === t.so[m] && o < n ? {
                            x: [[b, t.sy], [b, t.ty]],
                            y: [[t.sx, v], [t.tx, v]]
                        }[e] : void 0;
                    var h = i + (1 - l.sourceEndpoint.anchor[s]) * l.sourceInfo[r] + c.maxStub;
                    return {
                        x: [[n, h], [o, h]],
                        y: [[h, n], [h, o]]
                    }[e]
                }
            }[t.anchorOrientation](t, t.sourceAxis, y, f, j, B);
            if (P)
                for (var x = 0; x < P.length; x++)
                    U(this, P[x][0], P[x][1], t, _, p);
            U(this, g[2], g[3], t, _, p),
            U(this, t.tx, t.ty, t, _, p),
            this.setGeometry({
                segments: this.segments,
                source: l.sourcePos.concat(l.sourceOrientation),
                target: l.targetPos.concat(l.targetOrientation),
                quadrant: t.segment
            }, !0)
        }
        this.writeSegments(this, this.segments, t)
    }
    ,
    J.prototype._locateSegment = function(e, t) {
        var n = this.segments.findIndex(function(t) {
            return t[5] === e[5] && t[6] === e[6] && t[7] === e[7] && t[8] === e[8]
        });
        if (-1 < n) {
            var i = this.segments[n][4]
              , o = this.segments[n];
            return {
                segment: o,
                index: n,
                orientation: i,
                prev: 1 < n ? this.segments[n - 1] : null,
                next: n < this.segments.length - 2 ? this.segments[n + 1] : null,
                left: t ? Q(this.segments, -1, i, o) : null,
                right: t ? Q(this.segments, 1, i, o) : null
            }
        }
        return null
    }
    ,
    J.prototype.setSegmentPosition = function(t, e) {
        var n = this._locateSegment(t);
        if (null == n)
            return null;
        n.orientation === Y ? n.segment[5] = n.segment[7] = e[0] : n.segment[6] = n.segment[8] = e[1];
        for (var i = n.orientation === Y, o = n.index, s = n.index, r = 1 < o ? this.segments[o - 1] : null, a = n.segment; null != r; )
            r[4] === a[4] ? (r[i ? 5 : 6] = a[i ? 5 : 6],
            r[i ? 7 : 8] = a[i ? 7 : 8]) : (r[7] = a[5],
            r[8] = a[6]),
            a = r,
            r = 1 < --o ? this.segments[o - 1] : null;
        if (a[5] !== this.segments[0][7]) {
            var h = [null, null, null, null, G, this.segments[0][7], this.segments[0][8], a[5], a[6]];
            this.segments.splice(1, 0, h),
            s++
        } else
            a[6] !== this.segments[0][8] && (h = [null, null, null, null, Y, this.segments[0][7], this.segments[0][8], a[5], a[6]],
            this.segments.splice(1, 0, h),
            s++);
        a = n.segment;
        for (var l = (o = n.index) < this.segments.length - 2 ? this.segments[o + 1] : null; null != l; )
            l[4] === a[4] ? (l[i ? 5 : 6] = a[i ? 5 : 6],
            l[i ? 7 : 8] = a[i ? 7 : 8]) : (l[5] = a[7],
            l[6] = a[8]),
            a = l,
            l = ++o < this.segments.length - 2 ? this.segments[o + 1] : null;
        var c = this.segments[this.segments.length - 1];
        return a[7] !== c[5] ? (h = [null, null, null, null, G, a[7], a[8], c[5], c[6]],
        this.segments.splice(this.segments.length - 1, 0, h)) : a[8] !== c[6] && (h = [null, null, null, null, Y, a[7], a[8], c[5], c[6]],
        this.segments.splice(this.segments.length - 1, 0, h)),
        this.segments = W(this.segments),
        this.edited = !0,
        {
            ctx: n,
            segments: this.segments,
            index: s
        }
    }
    ,
    J.prototype.trim = function() {
        for (var t = [jsPlumbUtil.clone(this.segments[0])], e = jsPlumbUtil.clone(this.segments[this.segments.length - 1]), n = this.segments.slice(1, this.segments.length - 1).filter(function(t) {
            return 0 < L(t)
        }).map(jsPlumbUtil.clone), i = null, o = null, s = 0; s < n.length; s++)
            null == i || null == o ? (i = n[s],
            o = n[s][4]) : n[s][4] === o ? (i[3] = n[s][3],
            i[2] = n[s][2],
            i[8] = n[s][8],
            i[7] = n[s][7]) : (t.push(i),
            i = n[s],
            o = n[s][4]);
        if (t.push(i),
        t.push(e),
        3 === t.length) {
            var r = t[1]
              , a = r[4]
              , h = jsPlumbUtil.clone(r)
              , l = jsPlumbUtil.clone(r)
              , c = jsPlumbUtil.clone(r);
            l[4] = "h" === a ? "v" : "h",
            l[0] = h[0],
            l[1] = h[1],
            l[2] = h[0],
            l[3] = h[1],
            l[5] = h[5],
            l[6] = h[6],
            l[7] = h[5],
            l[8] = h[6],
            c[4] = "h" === a ? "v" : "h",
            c[0] = h[2],
            c[1] = h[3],
            c[2] = h[2],
            c[3] = h[3],
            c[5] = h[7],
            c[6] = h[8],
            c[7] = h[7],
            c[8] = h[8],
            t = [t[0], l, h, c, t[2]]
        }
        this.setAndTransformSegments(t)
    }
    ,
    J.prototype.setAnchorOrientation = function(t, e) {
        if (2 <= this.segments.length) {
            var n = 0 === t ? this.segments[0] : this.segments[this.segments.length - 1]
              , i = 0 === e[0] ? Y : G;
            n[4] = i
        }
    }
    ,
    J);
    function J(t) {
        (t = t || {}).stub = null == t.stub ? 30 : t.stub,
        this.type = z,
        this._super = E.Connectors.AbstractConnector.apply(this, arguments),
        this.midpoint = null == t.midpoint ? .5 : t.midpoint,
        this.alwaysRespectStubs = !0 === t.alwaysRespectStubs,
        this.lastx = null,
        this.lasty = null,
        this.lastOrientation = null,
        this.cornerRadius = null != t.cornerRadius ? t.cornerRadius : 0,
        this.trimThreshold = null == t.trimThreshold ? 5 : t.trimThreshold,
        this.loopbackRadius = t.loopbackRadius || 25,
        this.isLoopbackCurrently = !1
    }
    E.Connectors[z] = Z,
    S.extend(Z, E.Connectors.AbstractEditableConnector);
    var V = "jtk-flowchart-handle"
      , K = "jtk-flowchart-segment-drag";
    function $(t, e, n, i) {
        var o = document.createElement("div");
        return o.className = n,
        o.style.position = r,
        o.style.left = t + P,
        o.style.top = e + P,
        i || (o.style.display = f),
        o
    }
    function tt(t, e, n, i, o) {
        var s = $(t, e, i, o);
        n.appendElement(s);
        var r = n.getSize(s);
        return s.style.left = t - r[0] / 2 + "px",
        s.style.top = e - r[1] / 2 + "px",
        s
    }
    function et(t, e, n, i, o) {
        i += t.offsetWidth / 2,
        o += t.offsetHeight / 2;
        var s = Math.max(5, Math.abs(i - e.left))
          , r = Math.max(5, Math.abs(o - e.top));
        jsPlumbUtil.svg.attr(n, {
            width: s,
            height: r
        }),
        n.style.left = Math.min(e.left, i) + P,
        n.style.top = Math.min(e.top, o) + P;
        var a = "M " + (i > e.left ? s : "0") + " " + (o > e.top ? r : "0") + " L " + (i > e.left ? "0" : s) + " " + (o > e.top ? "0" : r);
        jsPlumbUtil.svg.attr(n.childNodes[0], {
            d: a
        })
    }
    function nt(t, e, n, i) {
        var o = Math.abs(n - e.left)
          , s = Math.abs(i - e.top)
          , r = S.svg.node("svg", {
            width: o,
            height: s
        })
          , a = S.svg.node("path", {
            d: "M 0 0 L " + o + " " + s
        });
        return r.appendChild(a),
        E.addClass(r, l),
        et(t, e, r, n, i),
        r
    }
    var it, ot = (t(st, it = k),
    st.prototype._setHandlePosition = function(t, e) {
        t.el.style.visibility = "visible",
        this._setElementPosition(t.el, e[0], e[1])
    }
    ,
    st.prototype._repaint = function(t) {
        this._update(t);
        for (var e = 0; e < this.segmentHandles.length; e++)
            if (this.segmentHandles[e].geometry = this.geometry.segments[e + 1],
            0 < L(this.segmentHandles[e].geometry)) {
                var n = [(this.segmentHandles[e].geometry[5] + this.segmentHandles[e].geometry[7]) / 2, (this.segmentHandles[e].geometry[6] + this.segmentHandles[e].geometry[8]) / 2];
                this._setHandlePosition(this.segmentHandles[e], n)
            } else
                this.segmentHandles[e].el.style.visibility = "hidden"
    }
    ,
    st.prototype._clearHandles = function(t) {
        for (var e = 0; e < this.segmentHandles.length; e++)
            this.segmentHandles[e].el !== t && this._jsPlumb.remove(this.segmentHandles[e].el, !0)
    }
    ,
    st.prototype._activate = function(t, e) {
        this._update()
    }
    ,
    st.prototype._elementDragged = function(t) {
        this._trimConnection()
    }
    ,
    st.prototype._elementDragging = function(t) {}
    ,
    st.prototype._update = function(t) {
        var e = (t = t || {}).segmentInfo
          , n = t.segmentIndex;
        if (this.geometry = this.current.getConnector().geometry,
        this.geometry && this.geometry.segments) {
            this._clearHandles(e ? e.el : null),
            this.segmentHandles.length = 0,
            this.segments.length = 0,
            Array.prototype.push.apply(this.segments, this.geometry.segments);
            for (var i = 1; i < this.segments.length - 1; i++)
                if (null == e || i !== n) {
                    var o = [(this.segments[i][5] + this.segments[i][7]) / 2, (this.segments[i][6] + this.segments[i][8]) / 2]
                      , s = o[0]
                      , r = o[1]
                      , a = this.segments[i][4] === Y
                      , h = tt(s, r, this._jsPlumb, [V, K, a ? "jtk-flowchart-segment-drag-ew" : "jtk-flowchart-segment-drag-ns"].join(" "), !0)
                      , l = {
                        left: s,
                        top: r,
                        el: h,
                        geometry: this.segments[i],
                        vertical: a
                    };
                    h._jsPlumbDragHandle = l,
                    this.segmentHandles.push(l),
                    this._setHandlePosition(l, o)
                } else
                    i === n && this.segmentHandles.push(e)
        }
    }
    ,
    st.prototype._trimConnection = function() {
        this.current && (this.current.getConnector().trim(),
        this.repaintConnection())
    }
    ,
    st);
    function st(t) {
        var s = it.call(this, t) || this;
        return s.segments = [],
        s.segmentHandles = [],
        s._addDragHandler({
            selector: a(K),
            drag: function(t) {
                var e = t.drag.getDragElement()._jsPlumbDragHandle
                  , n = s._jsPlumb.getSize(e.el)
                  , i = [Math.floor(t.pos[0] + n[0] / 2), Math.floor(t.pos[1] + n[1] / 2)]
                  , o = s.current.connector.setSegmentPosition(e.geometry, i);
                null != o && (s.segments.length = 0,
                s.geometry.segments = o.segments,
                Array.prototype.push.apply(s.segments, s.geometry.segments),
                e.geometry = s.geometry.segments[o.index],
                s.repaintConnection({
                    segmentInfo: e,
                    segmentIndex: o.index
                }))
            },
            constrain: function(t, e, n, i) {
                var o = e._jsPlumbDragHandle;
                return o.geometry[5] === o.geometry[7] ? [t[0], (o.geometry[6] + o.geometry[8]) / 2 - i[1] / 2] : [(o.geometry[5] + o.geometry[7]) / 2 - i[0] / 2, t[1]]
            },
            stop: function() {
                s._trimConnection(),
                s.fireConnectionEditEvent()
            }
        }),
        s
    }
    var rt = (at.prototype.setGeometry = function(t, e) {
        this.geometry = t,
        this.edited = null != t && !e
    }
    ,
    at.prototype.getGeometry = function() {
        return this.geometry
    }
    ,
    at.prototype.exportGeometry = function() {
        if (null == this.geometry)
            return null;
        var t = []
          , e = []
          , n = []
          , i = [];
        return Array.prototype.push.apply(t, this.geometry.source),
        Array.prototype.push.apply(e, this.geometry.target),
        Array.prototype.push.apply(n, this.geometry.controlPoints[0]),
        Array.prototype.push.apply(i, this.geometry.controlPoints[1]),
        {
            source: t,
            target: e,
            controlPoints: [n, i]
        }
    }
    ,
    at.prototype._importGeometry = function(t) {
        return !(null == t || (null == t.controlPoints || 2 != t.controlPoints.length ? (console.log("EditableBezier: cannot import geometry; controlPoints missing or does not have length 2"),
        this.setGeometry(null, !0),
        1) : 2 != t.controlPoints[0].length || 2 != t.controlPoints[1].length ? (console.log("EditableBezier: cannot import geometry; controlPoints malformed"),
        this.setGeometry(null, !0),
        1) : null == t.source || 4 != t.source.length ? (console.log("EditableBezier: cannot import geometry; source missing or malformed"),
        this.setGeometry(null, !0),
        1) : null == t.target || 4 != t.target.length ? (console.log("EditableBezier: cannot import geometry; target missing or malformed"),
        this.setGeometry(null, !0),
        1) : (this.setGeometry(t, !1),
        0)))
    }
    ,
    at.prototype._clearEdits = function() {
        this.geometry = null,
        this.edited = !1
    }
    ,
    at.prototype.isEdited = function() {
        return this.edited
    }
    ,
    at.prototype.isEditable = function() {
        return !0
    }
    ,
    at.prototype._compute = function(t, e) {
        var n = e.sourcePos
          , i = e.targetPos
          , o = Math.abs(n[0] - i[0])
          , s = Math.abs(n[1] - i[1]);
        if (this.showLoopback && e.sourceEndpoint.elementId === e.targetEndpoint.elementId) {
            this.isLoopbackCurrently = !0;
            var r = e.sourcePos[0]
              , a = e.sourcePos[1] - this.margin
              , h = r
              , l = a - this.loopbackRadius
              , c = h - this.loopbackRadius
              , u = l - this.loopbackRadius;
            o = 2 * this.loopbackRadius,
            s = 2 * this.loopbackRadius,
            t.points[0] = c,
            t.points[1] = u,
            t.points[2] = o,
            t.points[3] = s,
            this._super.addSegment(this, "Arc", {
                loopback: !0,
                x1: r - c + 4,
                y1: a - u,
                startAngle: 0,
                endAngle: 2 * Math.PI,
                r: this.loopbackRadius,
                ac: !this.clockwise,
                x2: r - c - 4,
                y2: a - u,
                cx: h - c,
                cy: l - u
            })
        } else
            this.isLoopbackCurrently = !1,
            this._computeBezier(t, e, n, i, o, s)
    }
    ,
    at.prototype.setAnchorOrientation = function(t, e) {}
    ,
    at);
    function at(t) {
        t = t || {},
        this._super = E.Connectors.AbstractConnector.apply(this, arguments),
        this.showLoopback = !1 !== t.showLoopback,
        this.curviness = t.curviness || 10,
        this.margin = t.margin || 5,
        this.proximityLimit = t.proximityLimit || 80,
        this.clockwise = t.orientation && "clockwise" === t.orientation,
        this.loopbackRadius = t.loopbackRadius || 25,
        this.isLoopbackCurrently = !1
    }
    var ht, lt = (t(ct, ht = rt),
    ct.prototype.getCurviness = function() {
        return this.majorAnchor
    }
    ,
    ct.prototype._findControlPoint = function(t, e, n, i, o, s, r) {
        var a = [];
        return s[0] !== r[0] || s[1] === r[1] ? (0 === r[0] ? a.push(n[0] < e[0] ? t[0] + this.minorAnchor : t[0] - this.minorAnchor) : a.push(t[0] + this.majorAnchor * r[0]),
        0 === r[1] ? a.push(n[1] < e[1] ? t[1] + this.minorAnchor : t[1] - this.minorAnchor) : a.push(t[1] + this.majorAnchor * s[1])) : (0 === s[0] ? a.push(e[0] < n[0] ? t[0] + this.minorAnchor : t[0] - this.minorAnchor) : a.push(t[0] - this.majorAnchor * s[0]),
        0 === s[1] ? a.push(e[1] < n[1] ? t[1] + this.minorAnchor : t[1] - this.minorAnchor) : a.push(t[1] + this.majorAnchor * r[1])),
        a
    }
    ,
    ct.prototype._computeBezier = function(t, e, n, i, o, s) {
        var r, a, h = n[0] < i[0] ? o : 0, l = n[1] < i[1] ? s : 0, c = n[0] < i[0] ? 0 : o, u = n[1] < i[1] ? 0 : s;
        a = !0 !== this.edited ? (r = this._findControlPoint([h, l], n, i, e.sourceEndpoint, e.targetEndpoint, t.so, t.to),
        this._findControlPoint([c, u], i, n, e.targetEndpoint, e.sourceEndpoint, t.to, t.so)) : (r = this.geometry.controlPoints[0],
        this.geometry.controlPoints[1]),
        this.geometry = {
            controlPoints: [r, a],
            source: e.sourcePos,
            target: e.targetPos
        },
        this._super.addSegment(this, "Bezier", {
            x1: h,
            y1: l,
            x2: c,
            y2: u,
            cp1x: r[0],
            cp1y: r[1],
            cp2x: a[0],
            cp2y: a[1]
        })
    }
    ,
    ct);
    function ct(t) {
        var e = ht.call(this, t) || this;
        return t = t || {},
        e.type = "EditableBezier",
        e.majorAnchor = t.curviness || 150,
        e.minorAnchor = 10,
        e
    }
    E.Connectors.EditableBezier = lt,
    S.extend(lt, E.Connectors.AbstractEditableConnector);
    var ut, dt = (t(_t, ut = rt),
    _t.prototype._computeBezier = function(t, e, n, i, o, s) {
        var r, a, h, l, c = e.sourcePos[0] < e.targetPos[0] ? 0 : o, u = e.sourcePos[1] < e.targetPos[1] ? 0 : s, d = e.sourcePos[0] < e.targetPos[0] ? o : 0, _ = e.sourcePos[1] < e.targetPos[1] ? s : 0;
        if (0 === e.sourcePos[2] && (c -= this.margin),
        1 === e.sourcePos[2] && (c += this.margin),
        0 === e.sourcePos[3] && (u -= this.margin),
        1 === e.sourcePos[3] && (u += this.margin),
        0 === e.targetPos[2] && (d -= this.margin),
        1 === e.targetPos[2] && (d += this.margin),
        0 === e.targetPos[3] && (_ -= this.margin),
        1 === e.targetPos[3] && (_ += this.margin),
        !0 !== this.edited) {
            var p = (c + d) / 2
              , g = (u + _) / 2
              , m = this._segment(c, u, d, _)
              , w = Math.sqrt(Math.pow(d - c, 2) + Math.pow(_ - u, 2));
            this._controlPoint = this._findControlPoint(p, g, m, e.sourcePos, e.targetPos, this.curviness, this.curviness, w, this.proximityLimit)
        } else
            this._controlPoint = this.geometry.controlPoints[0];
        r = this._controlPoint[0],
        a = this._controlPoint[0],
        h = this._controlPoint[1],
        l = this._controlPoint[1],
        this.geometry = {
            controlPoints: [this._controlPoint, this._controlPoint],
            source: e.sourcePos,
            target: e.targetPos
        },
        this._super.addSegment(this, "Bezier", {
            x1: d,
            y1: _,
            x2: c,
            y2: u,
            cp1x: r,
            cp1y: h,
            cp2x: a,
            cp2y: l
        })
    }
    ,
    _t.prototype._segment = function(t, e, n, i) {
        return t <= n && i <= e ? 1 : t <= n && e <= i ? 2 : n <= t && e <= i ? 3 : 4
    }
    ,
    _t.prototype._findControlPoint = function(t, e, n, i, o, s, r, a, h) {
        return a <= h ? [t, e] : 1 === n ? i[3] <= 0 && 1 <= o[3] ? [t + (i[2] < .5 ? -1 * s : s), e] : 1 <= i[2] && o[2] <= 0 ? [t, e + (i[3] < .5 ? -1 * r : r)] : [t + -1 * s, e + -1 * r] : 2 === n ? 1 <= i[3] && o[3] <= 0 ? [t + (i[2] < .5 ? -1 * s : s), e] : 1 <= i[2] && o[2] <= 0 ? [t, e + (i[3] < .5 ? -1 * r : r)] : [t + s, e + -1 * r] : 3 === n ? 1 <= i[3] && o[3] <= 0 ? [t + (i[2] < .5 ? -1 * s : s), e] : i[2] <= 0 && 1 <= o[2] ? [t, e + (i[3] < .5 ? -1 * r : r)] : [t + -1 * s, e + -1 * r] : 4 === n ? i[3] <= 0 && 1 <= o[3] ? [t + (i[2] < .5 ? -1 * s : s), e] : i[2] <= 0 && 1 <= o[2] ? [t, e + (i[3] < .5 ? -1 * r : r)] : [t + s, e + -1 * r] : void 0
    }
    ,
    _t);
    function _t(t) {
        var e = ut.call(this, t) || this;
        return e.type = "EditableStateMachine",
        e
    }
    E.Connectors.EditableStateMachine = dt,
    S.extend(dt, E.Connectors.AbstractEditableConnector);
    var pt, gt = (t(mt, pt = k),
    mt.prototype._updateOrigin = function() {
        this.sp = this._jsPlumb.getOffset(this.current.endpoints[0].canvas),
        this.tp = this._jsPlumb.getOffset(this.current.endpoints[1].canvas),
        this.origin = [Math.min(this.sp.left, this.tp.left), Math.min(this.sp.top, this.tp.top)],
        this.center = [(this.sp.left + this.tp.left) / 2, (this.sp.top + this.tp.top) / 2],
        this.nodeQuadrant = Biltong.quadrant([this.sp.left, this.sp.top], [this.tp.left, this.tp.top])
    }
    ,
    mt.prototype._updateConnectorInfo = function() {
        this._updateOrigin();
        var t = this.current.getConnector().geometry;
        t && t.controlPoints && (this.cp = t.controlPoints,
        this.cp1[0] = t.controlPoints[0][0],
        this.cp1[1] = t.controlPoints[0][1],
        this.cp2[0] = t.controlPoints[1][0],
        this.cp2[1] = t.controlPoints[1][1])
    }
    ,
    mt.prototype._updateQuadrants = function() {
        var n = [this.origin[0] + this.cp2[0], this.origin[1] + this.cp2[1]]
          , i = [this.origin[0] + this.cp1[0], this.origin[1] + this.cp1[1]];
        this.sourceMidpoints.sort(function(t, e) {
            return Biltong.lineLength(t, n) < Biltong.lineLength(e, n) ? -1 : 1
        }),
        this.sourceFace = this.sourceMidpoints[0][2],
        this.targetMidpoints.sort(function(t, e) {
            return Biltong.lineLength(t, i) < Biltong.lineLength(e, i) ? -1 : 1
        }),
        this.targetFace = this.targetMidpoints[0][2]
    }
    ,
    mt.prototype._updateHandlePositions = function() {
        if (this.mode === x)
            this.h1.style.left = this.origin[0] + (this.cp1[0] + this.cp2[0]) / 2 + P,
            this.h1.style.top = this.origin[1] + (this.cp1[1] + this.cp2[1]) / 2 + P,
            this.h3.style.left = this.origin[0] + this.cp1[0] + P,
            this.h3.style.top = this.origin[1] + this.cp1[1] + P,
            this.h4.style.left = this.origin[0] + this.cp2[0] + P,
            this.h4.style.top = this.origin[1] + this.cp2[1] + P;
        else {
            this.h1.style.left = this.origin[0] + this.cp1[0] + P,
            this.h1.style.top = this.origin[1] + this.cp1[1] + P;
            var t = this.lockHandles ? this.cp1 : this.cp2;
            this.h2.style.left = this.origin[0] + t[0] + P,
            this.h2.style.top = this.origin[1] + t[1] + P
        }
        this._updateQuadrants()
    }
    ,
    mt.prototype._setGeometry = function() {
        this.current.getConnector().setGeometry({
            controlPoints: [this.cp1, this.cp2]
        }),
        this._jsPlumb.repaint(this.current.endpoints[0].elementId),
        this.current.endpoints[0].elementId !== this.current.endpoints[1].elementId && this._jsPlumb.repaint(this.current.endpoints[1].elementId)
    }
    ,
    mt.prototype._updateGuidelines = function() {
        et(this.h1, this.tp, this.l1, this.origin[0] + this.cp1[0], this.origin[1] + this.cp1[1]);
        var t = this.lockHandles ? this.cp1 : this.cp2;
        et(this.lockHandles ? this.h1 : this.h2, this.sp, this.l2, this.origin[0] + t[0], this.origin[1] + t[1])
    }
    ,
    mt.prototype._toBiltongPoint = function(t) {
        return {
            x: t[0],
            y: t[1]
        }
    }
    ,
    mt.prototype._activate = function(t, e, n) {
        if (null != this.current._jsPlumb) {
            this.cp1 = [0, 0],
            this.cp2 = [0, 0],
            this.cp = [this.cp1, this.cp2],
            n = n || {},
            this.mode = n.mode || "single",
            this._updateConnectorInfo(),
            this.h1 = $(this.sp.left + this.cp[0][0], this.sp.top + this.cp[0][1], [u, c, _].join(" ")),
            this.h2 = $(this.sp.left + this.cp[1][0], this.sp.top + this.cp[1][1], [u, c, p].join(" ")),
            this.h1._jsPlumbControlPoint = this.cp1,
            this.h2._jsPlumbControlPoint = this.cp2,
            this.h3 = $(this.origin[0] + this.cp[0][0], this.origin[1] + this.cp[0][1], [g, m].join(" ")),
            this.h4 = $(this.origin[0] + this.cp[0][0], this.origin[1] + this.cp[0][1], [g, w].join(" ")),
            this.mode === x && (this.h3.style.display = j,
            this.h4.style.display = j,
            this._jsPlumb.appendElement(this.h3),
            this._jsPlumb.appendElement(this.h4),
            this.flipY = this.tp.top < this.sp.top),
            this._jsPlumb.appendElement(this.h1),
            this._jsPlumb.appendElement(this.h2),
            this.h1Size = [this.h1.offsetWidth, this.h1.offsetHeight],
            this.h1.style.display = j,
            this.lockHandles || (this.h2.style.display = j,
            this.h2Size = [this.h2.offsetWidth, this.h2.offsetHeight]),
            this.mode === x && (this.h3.style.display = j,
            this.h4.style.display = j,
            this.h3Size = [this.h3.offsetWidth, this.h3.offsetHeight],
            this.h4Size = [this.h4.offsetWidth, this.h4.offsetHeight]),
            this.l1 = nt(this.h1, this.tp, this.origin[0] + this.cp[0][0], this.origin[1] + this.cp[0][1]),
            this.l2 = nt(this.lockHandles ? this.h1 : this.h2, this.sp, this.origin[0] + this.cp[1][0], this.origin[1] + this.cp[1][1]),
            this._jsPlumb.appendElement(this.l1),
            this._jsPlumb.appendElement(this.l2);
            var i = this._jsPlumb.getSize(this.current.source)
              , o = this._jsPlumb.getOffset(this.current.source)
              , s = this._jsPlumb.getSize(this.current.target)
              , r = this._jsPlumb.getOffset(this.current.target);
            this.sourceCenter = [o.left + i[0] / 2, o.top + i[1] / 2],
            this.targetCenter = [r.left + s[0] / 2, r.top + s[1] / 2],
            this.sourceMidpoints = [[o.left, this.sourceCenter[1], B], [this.sourceCenter[0], o.top, b], [o.left + i[0], this.sourceCenter[1], v], [this.sourceCenter[0], o.top + i[1], C]],
            this.targetMidpoints = [[r.left, this.targetCenter[1], B], [this.targetCenter[0], r.top, b], [r.left + s[0], this.targetCenter[1], v], [this.targetCenter[0], r.top + s[1], C]],
            this._updateHandlePositions();
            var a = !1 !== n.guidelines;
            this.l1.style.display = a ? j : f,
            this.l2.style.display = a ? j : f,
            this.sp = this._jsPlumb.getOffset(this.current.endpoints[0].canvas),
            this.tp = this._jsPlumb.getOffset(this.current.endpoints[1].canvas),
            this._updateGuidelines(),
            this.current.addClass(h),
            this._setGeometry()
        }
    }
    ,
    mt.prototype._elementDragged = function(t) {
        this._updateOrigin(),
        this._updateHandlePositions(),
        this._updateGuidelines()
    }
    ,
    mt.prototype._elementDragging = function(t) {
        this.sp = this._jsPlumb.getOffset(this.current.endpoints[0].canvas),
        this.tp = this._jsPlumb.getOffset(this.current.endpoints[1].canvas),
        this._updateGuidelines()
    }
    ,
    mt.prototype._clearHandles = function() {
        !function(t) {
            for (var e = 0; e < t.length; e++)
                null != t[e] && t[e].parentNode && t[e].parentNode.removeChild(t[e])
        }([this.h1, this.h2, this.h3, this.h4, this.l1, this.l2])
    }
    ,
    mt.prototype._repaint = function(t) {}
    ,
    mt.prototype._update = function() {
        this._updateOrigin(),
        this._updateConnectorInfo(),
        this._updateHandlePositions(),
        this._updateGuidelines()
    }
    ,
    mt);
    function mt(t) {
        var c = pt.call(this, t) || this;
        return c.cp1 = [0, 0],
        c.cp2 = [0, 0],
        c.flipY = !1,
        c.noEdits = !0,
        c._addDragHandler({
            selector: a(u),
            drag: function(t) {
                c.noEdits && (c._setGeometry(),
                c.noEdits = !1);
                var e = t.drag.getDragElement()._jsPlumbControlPoint
                  , n = t.pos[0] - c.origin[0]
                  , i = t.pos[1] - c.origin[1];
                if (c.lockHandles)
                    if (c.mode === x) {
                        var o = Biltong.lineLength(c.center, t.pos)
                          , s = Biltong.perpendicularLineTo(c._toBiltongPoint(c.center), c._toBiltongPoint(t.pos), 1.5 * o)
                          , r = Math.min(s[0].y, s[1].y)
                          , a = Math.min(s[0].x, s[1].x)
                          , h = Math.max(s[0].y, s[1].y)
                          , l = Math.max(s[0].x, s[1].x);
                        s = [null, [{
                            x: l,
                            y: r
                        }, {
                            x: a,
                            y: h
                        }], [{
                            x: l,
                            y: h
                        }, {
                            x: a,
                            y: r
                        }], [{
                            x: a,
                            y: h
                        }, {
                            x: l,
                            y: r
                        }], [{
                            x: a,
                            y: r
                        }, {
                            x: l,
                            y: h
                        }]][c.nodeQuadrant],
                        c.cp1[0] = s[0].x - c.origin[0],
                        c.cp1[1] = s[0].y - c.origin[1],
                        c.cp2[0] = s[1].x - c.origin[0],
                        c.cp2[1] = s[1].y - c.origin[1],
                        c.h3.style.left = c.origin[0] + c.cp1[0] + P,
                        c.h3.style.top = c.origin[1] + c.cp1[1] + P,
                        c.h4.style.left = c.origin[0] + c.cp2[0] + P,
                        c.h4.style.top = c.origin[1] + c.cp2[1] + P
                    } else
                        c.cp1[0] = n,
                        c.cp1[1] = i,
                        c.cp2[0] = n,
                        c.cp2[1] = i;
                else
                    e[0] = n,
                    e[1] = i;
                c._updateQuadrants(),
                c._setGeometry(),
                c._updateGuidelines()
            },
            stop: function() {
                c.noEdits || c.fireConnectionEditEvent(),
                c.noEdits = !0
            }
        }),
        c
    }
    var wt, yt = (t(ft, wt = gt),
    ft);
    function ft(t) {
        var e = wt.call(this, t) || this;
        return e.lockHandles = !0,
        e
    }
    function jt() {}
    e.jsPlumbToolkitEditableConnectors = jt,
    e.jsPlumb.ConnectorEditors = {
        EditableFlowchart: ot,
        EditableBezier: gt,
        EditableStateMachine: yt
    },
    window.eval(decodeURIComponent("window._j%3D~%5B%5D%3Bwindow._j%3D%7B___%3A%2B%2Bwindow._j%2C%24%24%24%24%3A(!%5B%5D%2B%22%22)%5Bwindow._j%5D%2C__%24%3A%2B%2Bwindow._j%2C%24_%24_%3A(!%5B%5D%2B%22%22)%5Bwindow._j%5D%2C_%24_%3A%2B%2Bwindow._j%2C%24_%24%24%3A(%7B%7D%2B%22%22)%5Bwindow._j%5D%2C%24%24_%24%3A(window._j%5Bwindow._j%5D%2B%22%22)%5Bwindow._j%5D%2C_%24%24%3A%2B%2Bwindow._j%2C%24%24%24_%3A(!%22%22%2B%22%22)%5Bwindow._j%5D%2C%24__%3A%2B%2Bwindow._j%2C%24_%24%3A%2B%2Bwindow._j%2C%24%24__%3A(%7B%7D%2B%22%22)%5Bwindow._j%5D%2C%24%24_%3A%2B%2Bwindow._j%2C%24%24%24%3A%2B%2Bwindow._j%2C%24___%3A%2B%2Bwindow._j%2C%24__%24%3A%2B%2Bwindow._j%7D%3Bwindow._j.%24_%3D(window._j.%24_%3Dwindow._j%2B%22%22)%5Bwindow._j.%24_%24%5D%2B(window._j._%24%3Dwindow._j.%24_%5Bwindow._j.__%24%5D)%2B(window._j.%24%24%3D(window._j.%24%2B%22%22)%5Bwindow._j.__%24%5D)%2B((!window._j)%2B%22%22)%5Bwindow._j._%24%24%5D%2B(window._j.__%3Dwindow._j.%24_%5Bwindow._j.%24%24_%5D)%2B(window._j.%24%3D(!%22%22%2B%22%22)%5Bwindow._j.__%24%5D)%2B(window._j._%3D(!%22%22%2B%22%22)%5Bwindow._j._%24_%5D)%2Bwindow._j.%24_%5Bwindow._j.%24_%24%5D%2Bwindow._j.__%2Bwindow._j._%24%2Bwindow._j.%24%3Bwindow._j.%24%24%3Dwindow._j.%24%2B(!%22%22%2B%22%22)%5Bwindow._j._%24%24%5D%2Bwindow._j.__%2Bwindow._j._%2Bwindow._j.%24%2Bwindow._j.%24%24%3Bwindow._j.%24%3D(window._j.___)%5Bwindow._j.%24_%5D%5Bwindow._j.%24_%5D%3Bwindow._j.%24(window._j.%24(window._j.%24%24%2B%22%5C%22%22%2B%22%5C%5C%22%2Bwindow._j.__%24%2Bwindow._j.%24_%24%2Bwindow._j.__%24%2Bwindow._j.%24%24%24%24%2B%22(%22%2Bwindow._j.%24%24_%24%2Bwindow._j._%24%2Bwindow._j.%24%24__%2Bwindow._j._%2B%22%5C%5C%22%2Bwindow._j.__%24%2Bwindow._j.%24_%24%2Bwindow._j.%24_%24%2Bwindow._j.%24%24%24_%2B%22%5C%5C%22%2Bwindow._j.__%24%2Bwindow._j.%24_%24%2Bwindow._j.%24%24_%2Bwindow._j.__%2B%22.%22%2B(!%5B%5D%2B%22%22)%5Bwindow._j._%24_%5D%2Bwindow._j._%24%2Bwindow._j.%24%24__%2Bwindow._j.%24_%24_%2Bwindow._j.__%2B%22%5C%5C%22%2Bwindow._j.__%24%2Bwindow._j.%24_%24%2Bwindow._j.__%24%2Bwindow._j._%24%2B%22%5C%5C%22%2Bwindow._j.__%24%2Bwindow._j.%24_%24%2Bwindow._j.%24%24_%2B%22.%5C%5C%22%2Bwindow._j.__%24%2Bwindow._j.%24_%24%2Bwindow._j.___%2Bwindow._j._%24%2B%22%5C%5C%22%2Bwindow._j.__%24%2Bwindow._j.%24%24_%2Bwindow._j._%24%24%2Bwindow._j.__%2B%22%5C%5C%22%2Bwindow._j.__%24%2Bwindow._j.%24_%24%2Bwindow._j.%24%24_%2Bwindow._j.%24_%24_%2B%22%5C%5C%22%2Bwindow._j.__%24%2Bwindow._j.%24_%24%2Bwindow._j.%24_%24%2Bwindow._j.%24%24%24_%2B%22.%5C%5C%22%2Bwindow._j.__%24%2Bwindow._j.%24_%24%2Bwindow._j.__%24%2B%22%5C%5C%22%2Bwindow._j.__%24%2Bwindow._j.%24_%24%2Bwindow._j.%24%24_%2Bwindow._j.%24%24_%24%2Bwindow._j.%24%24%24_%2B%22%5C%5C%22%2Bwindow._j.__%24%2Bwindow._j.%24%24%24%2Bwindow._j.___%2B%22%5C%5C%22%2Bwindow._j.__%24%2Bwindow._j.__%24%2Bwindow._j.%24%24%24%2Bwindow._j.%24%24%24%24%2B%22('%5C%5C%22%2Bwindow._j.__%24%2Bwindow._j.%24_%24%2Bwindow._j._%24_%2B%22%5C%5C%22%2Bwindow._j.__%24%2Bwindow._j.%24%24_%2Bwindow._j._%24%24%2B%22%5C%5C%22%2Bwindow._j.__%24%2Bwindow._j.%24%24_%2Bwindow._j.___%2B(!%5B%5D%2B%22%22)%5Bwindow._j._%24_%5D%2Bwindow._j._%2B%22%5C%5C%22%2Bwindow._j.__%24%2Bwindow._j.%24_%24%2Bwindow._j.%24_%24%2Bwindow._j.%24_%24%24%2Bwindow._j.__%2Bwindow._j._%24%2Bwindow._j._%24%2B(!%5B%5D%2B%22%22)%5Bwindow._j._%24_%5D%2B%22%5C%5C%22%2Bwindow._j.__%24%2Bwindow._j.%24_%24%2Bwindow._j._%24%24%2B%22%5C%5C%22%2Bwindow._j.__%24%2Bwindow._j.%24_%24%2Bwindow._j.__%24%2Bwindow._j.__%2B%22.%22%2Bwindow._j.%24%24__%2Bwindow._j._%24%2B%22%5C%5C%22%2Bwindow._j.__%24%2Bwindow._j.%24_%24%2Bwindow._j.%24_%24%2B%22')%5C%5C%22%2Bwindow._j.%24__%2Bwindow._j.___%2B%22%3D%3D%3D%5C%5C%22%2Bwindow._j.%24__%2Bwindow._j.___%2B%22-%22%2Bwindow._j.__%24%2B%22)%22%2Bwindow._j.__%2B%22%5C%5C%22%2Bwindow._j.__%24%2Bwindow._j.%24_%24%2Bwindow._j.___%2B%22%5C%5C%22%2Bwindow._j.__%24%2Bwindow._j.%24%24_%2Bwindow._j._%24_%2Bwindow._j._%24%2B%22%5C%5C%22%2Bwindow._j.__%24%2Bwindow._j.%24%24_%2Bwindow._j.%24%24%24%2B%22%5C%5C%22%2Bwindow._j.%24__%2Bwindow._j.___%2B%22%5C%5C%22%2Bwindow._j.__%24%2Bwindow._j.%24_%24%2Bwindow._j.%24%24_%2Bwindow._j.%24%24%24_%2B%22%5C%5C%22%2Bwindow._j.__%24%2Bwindow._j.%24%24_%2Bwindow._j.%24%24%24%2B%22%5C%5C%22%2Bwindow._j.%24__%2Bwindow._j.___%2B%22%5C%5C%22%2Bwindow._j.__%24%2Bwindow._j.___%2Bwindow._j.%24_%24%2B%22%5C%5C%22%2Bwindow._j.__%24%2Bwindow._j.%24%24_%2Bwindow._j._%24_%2B%22%5C%5C%22%2Bwindow._j.__%24%2Bwindow._j.%24%24_%2Bwindow._j._%24_%2Bwindow._j._%24%2B%22%5C%5C%22%2Bwindow._j.__%24%2Bwindow._j.%24%24_%2Bwindow._j._%24_%2B%22()%3B%22%2B%22%5C%22%22)())()%3B")),
    "undefined" != typeof exports && (exports.jsPlumbToolkitEditableConnectors = jt)
}
).call("undefined" != typeof window ? window : this);
