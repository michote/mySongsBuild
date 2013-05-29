
// minifier: path aliases

enyo.path.addPaths({layout: "/home/micha/stopandgo/Enyo2/mySongs/enyo/../lib/layout/", onyx: "/home/micha/stopandgo/Enyo2/mySongs/enyo/../lib/onyx/source/", g11n: "/home/micha/stopandgo/Enyo2/mySongs/enyo/../lib/g11n/", canvas: "/home/micha/stopandgo/Enyo2/mySongs/enyo/../lib/canvas/", helper: "source/helper/"});

// FittableLayout.js

enyo.kind({
name: "enyo.FittableLayout",
kind: "Layout",
calcFitIndex: function() {
for (var e = 0, t = this.container.children, n; n = t[e]; e++) if (n.fit && n.showing) return e;
},
getFitControl: function() {
var e = this.container.children, t = e[this.fitIndex];
return t && t.fit && t.showing || (this.fitIndex = this.calcFitIndex(), t = e[this.fitIndex]), t;
},
getLastControl: function() {
var e = this.container.children, t = e.length - 1, n = e[t];
while ((n = e[t]) && !n.showing) t--;
return n;
},
_reflow: function(e, t, n, r) {
this.container.addRemoveClass("enyo-stretch", !this.container.noStretch);
var i = this.getFitControl();
if (!i) return;
var s = 0, o = 0, u = 0, a, f = this.container.hasNode();
f && (a = enyo.dom.calcPaddingExtents(f), s = f[t] - (a[n] + a[r]));
var l = i.getBounds();
o = l[n] - (a && a[n] || 0);
var c = this.getLastControl();
if (c) {
var h = enyo.dom.getComputedBoxValue(c.hasNode(), "margin", r) || 0;
if (c != i) {
var p = c.getBounds(), d = l[n] + l[e], v = p[n] + p[e] + h;
u = v - d;
} else u = h;
}
var m = s - (o + u);
i.applyStyle(e, m + "px");
},
reflow: function() {
this.orient == "h" ? this._reflow("width", "clientWidth", "left", "right") : this._reflow("height", "clientHeight", "top", "bottom");
}
}), enyo.kind({
name: "enyo.FittableColumnsLayout",
kind: "FittableLayout",
orient: "h",
layoutClass: "enyo-fittable-columns-layout"
}), enyo.kind({
name: "enyo.FittableRowsLayout",
kind: "FittableLayout",
layoutClass: "enyo-fittable-rows-layout",
orient: "v"
});

// FittableRows.js

enyo.kind({
name: "enyo.FittableRows",
layoutKind: "FittableRowsLayout",
noStretch: !1
});

// FittableColumns.js

enyo.kind({
name: "enyo.FittableColumns",
layoutKind: "FittableColumnsLayout",
noStretch: !1
});

// FlyweightRepeater.js

enyo.kind({
name: "enyo.FlyweightRepeater",
published: {
count: 0,
noSelect: !1,
multiSelect: !1,
toggleSelected: !1,
clientClasses: "",
clientStyle: "",
rowOffset: 0
},
events: {
onSetupItem: "",
onRenderRow: ""
},
bottomUp: !1,
components: [ {
kind: "Selection",
onSelect: "selectDeselect",
onDeselect: "selectDeselect"
}, {
name: "client"
} ],
create: function() {
this.inherited(arguments), this.noSelectChanged(), this.multiSelectChanged(), this.clientClassesChanged(), this.clientStyleChanged();
},
noSelectChanged: function() {
this.noSelect && this.$.selection.clear();
},
multiSelectChanged: function() {
this.$.selection.setMulti(this.multiSelect);
},
clientClassesChanged: function() {
this.$.client.setClasses(this.clientClasses);
},
clientStyleChanged: function() {
this.$.client.setStyle(this.clientStyle);
},
setupItem: function(e) {
this.doSetupItem({
index: e,
selected: this.isSelected(e)
});
},
generateChildHtml: function() {
var e = "";
this.index = null;
for (var t = 0, n = 0; t < this.count; t++) n = this.rowOffset + (this.bottomUp ? this.count - t - 1 : t), this.setupItem(n), this.$.client.setAttribute("data-enyo-index", n), e += this.inherited(arguments), this.$.client.teardownRender();
return e;
},
previewDomEvent: function(e) {
var t = this.index = this.rowForEvent(e);
e.rowIndex = e.index = t, e.flyweight = this;
},
decorateEvent: function(e, t, n) {
var r = t && t.index != null ? t.index : this.index;
t && r != null && (t.index = r, t.flyweight = this), this.inherited(arguments);
},
tap: function(e, t) {
if (this.noSelect || t.index === -1) return;
this.toggleSelected ? this.$.selection.toggle(t.index) : this.$.selection.select(t.index);
},
selectDeselect: function(e, t) {
this.renderRow(t.key);
},
getSelection: function() {
return this.$.selection;
},
isSelected: function(e) {
return this.getSelection().isSelected(e);
},
renderRow: function(e) {
if (e < this.rowOffset || e >= this.count + this.rowOffset) return;
this.setupItem(e);
var t = this.fetchRowNode(e);
t && (enyo.dom.setInnerHtml(t, this.$.client.generateChildHtml()), this.$.client.teardownChildren(), this.doRenderRow({
rowIndex: e
}));
},
fetchRowNode: function(e) {
if (this.hasNode()) return this.node.querySelector('[data-enyo-index="' + e + '"]');
},
rowForEvent: function(e) {
if (!this.hasNode()) return -1;
var t = e.target;
while (t && t !== this.node) {
var n = t.getAttribute && t.getAttribute("data-enyo-index");
if (n !== null) return Number(n);
t = t.parentNode;
}
return -1;
},
prepareRow: function(e) {
if (e < 0 || e >= this.count) return;
this.setupItem(e);
var t = this.fetchRowNode(e);
enyo.FlyweightRepeater.claimNode(this.$.client, t);
},
lockRow: function() {
this.$.client.teardownChildren();
},
performOnRow: function(e, t, n) {
if (e < 0 || e >= this.count) return;
t && (this.prepareRow(e), enyo.call(n || null, t), this.lockRow());
},
statics: {
claimNode: function(e, t) {
var n;
t && (t.id !== e.id ? n = t.querySelector("#" + e.id) : n = t), e.generated = Boolean(n || !e.tag), e.node = n, e.node && e.rendered();
for (var r = 0, i = e.children, s; s = i[r]; r++) this.claimNode(s, t);
}
}
});

// List.js

enyo.kind({
name: "enyo.List",
kind: "Scroller",
classes: "enyo-list",
published: {
count: 0,
rowsPerPage: 50,
bottomUp: !1,
noSelect: !1,
multiSelect: !1,
toggleSelected: !1,
fixedHeight: !1,
reorderable: !1,
centerReorderContainer: !0,
reorderComponents: [],
pinnedReorderComponents: [],
swipeableComponents: [],
enableSwipe: !1,
persistSwipeableItem: !1
},
events: {
onSetupItem: "",
onSetupReorderComponents: "",
onSetupPinnedReorderComponents: "",
onReorder: "",
onSetupSwipeItem: "",
onSwipeDrag: "",
onSwipe: "",
onSwipeComplete: ""
},
handlers: {
onAnimateFinish: "animateFinish",
onRenderRow: "rowRendered",
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish",
onup: "up",
onholdpulse: "holdpulse"
},
rowHeight: 0,
listTools: [ {
name: "port",
classes: "enyo-list-port enyo-border-box",
components: [ {
name: "generator",
kind: "FlyweightRepeater",
canGenerate: !1,
components: [ {
tag: null,
name: "client"
} ]
}, {
name: "holdingarea",
allowHtml: !0,
classes: "enyo-list-holdingarea"
}, {
name: "page0",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "page1",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "placeholder"
}, {
name: "swipeableComponents",
style: "position:absolute; display:block; top:-1000px; left:0;"
} ]
} ],
reorderHoldTimeMS: 600,
draggingRowIndex: -1,
draggingRowNode: null,
placeholderRowIndex: -1,
dragToScrollThreshold: .1,
prevScrollTop: 0,
autoScrollTimeoutMS: 20,
autoScrollTimeout: null,
autoscrollPageY: 0,
pinnedReorderMode: !1,
initialPinPosition: -1,
itemMoved: !1,
currentPageNumber: -1,
completeReorderTimeout: null,
swipeIndex: null,
swipeDirection: null,
persistentItemVisible: !1,
persistentItemOrigin: null,
swipeComplete: !1,
completeSwipeTimeout: null,
completeSwipeDelayMS: 500,
normalSwipeSpeedMS: 200,
fastSwipeSpeedMS: 100,
percentageDraggedThreshold: .2,
importProps: function(e) {
e && e.reorderable && (this.touch = !0), this.inherited(arguments);
},
create: function() {
this.pageHeights = [], this.inherited(arguments), this.getStrategy().translateOptimized = !0, this.bottomUpChanged(), this.noSelectChanged(), this.multiSelectChanged(), this.toggleSelectedChanged(), this.$.generator.setRowOffset(0), this.$.generator.setCount(this.count);
},
initComponents: function() {
this.createReorderTools(), this.inherited(arguments), this.createSwipeableComponents();
},
createReorderTools: function() {
this.createComponent({
name: "reorderContainer",
classes: "enyo-list-reorder-container",
ondown: "sendToStrategy",
ondrag: "sendToStrategy",
ondragstart: "sendToStrategy",
ondragfinish: "sendToStrategy",
onflick: "sendToStrategy"
});
},
createStrategy: function() {
this.controlParentName = "strategy", this.inherited(arguments), this.createChrome(this.listTools), this.controlParentName = "client", this.discoverControlParent();
},
createSwipeableComponents: function() {
for (var e = 0; e < this.swipeableComponents.length; e++) this.$.swipeableComponents.createComponent(this.swipeableComponents[e], {
owner: this.owner
});
},
rendered: function() {
this.inherited(arguments), this.$.generator.node = this.$.port.hasNode(), this.$.generator.generated = !0, this.reset();
},
resizeHandler: function() {
this.inherited(arguments), this.refresh();
},
bottomUpChanged: function() {
this.$.generator.bottomUp = this.bottomUp, this.$.page0.applyStyle(this.pageBound, null), this.$.page1.applyStyle(this.pageBound, null), this.pageBound = this.bottomUp ? "bottom" : "top", this.hasNode() && this.reset();
},
noSelectChanged: function() {
this.$.generator.setNoSelect(this.noSelect);
},
multiSelectChanged: function() {
this.$.generator.setMultiSelect(this.multiSelect);
},
toggleSelectedChanged: function() {
this.$.generator.setToggleSelected(this.toggleSelected);
},
countChanged: function() {
this.hasNode() && this.updateMetrics();
},
sendToStrategy: function(e, t) {
this.$.strategy.dispatchEvent("on" + t.type, t, e);
},
updateMetrics: function() {
this.defaultPageHeight = this.rowsPerPage * (this.rowHeight || 100), this.pageCount = Math.ceil(this.count / this.rowsPerPage), this.portSize = 0;
for (var e = 0; e < this.pageCount; e++) this.portSize += this.getPageHeight(e);
this.adjustPortSize();
},
holdpulse: function(e, t) {
if (!this.getReorderable() || this.isReordering()) return;
if (t.holdTime >= this.reorderHoldTimeMS && this.shouldStartReordering(e, t)) return t.preventDefault(), this.startReordering(t), !1;
},
dragstart: function(e, t) {
if (this.isReordering()) return !0;
if (this.isSwipeable()) return this.swipeDragStart(e, t);
},
drag: function(e, t) {
if (this.shouldDoReorderDrag(t)) return t.preventDefault(), this.reorderDrag(t), !0;
if (this.isSwipeable()) return t.preventDefault(), this.swipeDrag(e, t), !0;
},
dragfinish: function(e, t) {
this.isReordering() ? this.finishReordering(e, t) : this.isSwipeable() && this.swipeDragFinish(e, t);
},
up: function(e, t) {
this.isReordering() && this.finishReordering(e, t);
},
generatePage: function(e, t) {
this.page = e;
var n = this.rowsPerPage * this.page;
this.$.generator.setRowOffset(n);
var r = Math.min(this.count - n, this.rowsPerPage);
this.$.generator.setCount(r);
var i = this.$.generator.generateChildHtml();
t.setContent(i), this.getReorderable() && this.draggingRowIndex > -1 && this.hideReorderingRow();
var s = t.getBounds().height;
!this.rowHeight && s > 0 && (this.rowHeight = Math.floor(s / r), this.updateMetrics());
if (!this.fixedHeight) {
var o = this.getPageHeight(e);
this.pageHeights[e] = s, this.portSize += s - o;
}
},
pageForRow: function(e) {
return Math.floor(e / this.rowsPerPage);
},
preserveDraggingRowNode: function(e) {
this.draggingRowNode && this.pageForRow(this.draggingRowIndex) === e && (this.$.holdingarea.hasNode().appendChild(this.draggingRowNode), this.draggingRowNode = null, this.removedInitialPage = !0);
},
update: function(e) {
var t = !1, n = this.positionToPageInfo(e), r = n.pos + this.scrollerHeight / 2, i = Math.floor(r / Math.max(n.height, this.scrollerHeight) + .5) + n.no, s = i % 2 === 0 ? i : i - 1;
this.p0 != s && this.isPageInRange(s) && (this.preserveDraggingRowNode(this.p0), this.generatePage(s, this.$.page0), this.positionPage(s, this.$.page0), this.p0 = s, t = !0, this.p0RowBounds = this.getPageRowHeights(this.$.page0)), s = i % 2 === 0 ? Math.max(1, i - 1) : i, this.p1 != s && this.isPageInRange(s) && (this.preserveDraggingRowNode(this.p1), this.generatePage(s, this.$.page1), this.positionPage(s, this.$.page1), this.p1 = s, t = !0, this.p1RowBounds = this.getPageRowHeights(this.$.page1)), t && (this.$.generator.setRowOffset(0), this.$.generator.setCount(this.count), this.fixedHeight || (this.adjustBottomPage(), this.adjustPortSize()));
},
getPageRowHeights: function(e) {
var t = {}, n = e.hasNode().querySelectorAll("div[data-enyo-index]");
for (var r = 0, i, s; r < n.length; r++) i = n[r].getAttribute("data-enyo-index"), i !== null && (s = enyo.dom.getBounds(n[r]), t[parseInt(i, 10)] = {
height: s.height,
width: s.width
});
return t;
},
updateRowBounds: function(e) {
this.p0RowBounds[e] ? this.updateRowBoundsAtIndex(e, this.p0RowBounds, this.$.page0) : this.p1RowBounds[e] && this.updateRowBoundsAtIndex(e, this.p1RowBounds, this.$.page1);
},
updateRowBoundsAtIndex: function(e, t, n) {
var r = n.hasNode().querySelector('div[data-enyo-index="' + e + '"]'), i = enyo.dom.getBounds(r);
t[e].height = i.height, t[e].width = i.width;
},
updateForPosition: function(e) {
this.update(this.calcPos(e));
},
calcPos: function(e) {
return this.bottomUp ? this.portSize - this.scrollerHeight - e : e;
},
adjustBottomPage: function() {
var e = this.p0 >= this.p1 ? this.$.page0 : this.$.page1;
this.positionPage(e.pageNo, e);
},
adjustPortSize: function() {
this.scrollerHeight = this.getBounds().height;
var e = Math.max(this.scrollerHeight, this.portSize);
this.$.port.applyStyle("height", e + "px");
},
positionPage: function(e, t) {
t.pageNo = e;
var n = this.pageToPosition(e);
t.applyStyle(this.pageBound, n + "px");
},
pageToPosition: function(e) {
var t = 0, n = e;
while (n > 0) n--, t += this.getPageHeight(n);
return t;
},
positionToPageInfo: function(e) {
var t = -1, n = this.calcPos(e), r = this.defaultPageHeight;
while (n >= 0) t++, r = this.getPageHeight(t), n -= r;
return t = Math.max(t, 0), {
no: t,
height: r,
pos: n + r,
startRow: t * this.rowsPerPage,
endRow: Math.min((t + 1) * this.rowsPerPage - 1, this.count - 1)
};
},
isPageInRange: function(e) {
return e == Math.max(0, Math.min(this.pageCount - 1, e));
},
getPageHeight: function(e) {
var t = this.pageHeights[e];
if (!t) {
var n = this.rowsPerPage * e, r = Math.min(this.count - n, this.rowsPerPage);
t = this.defaultPageHeight * (r / this.rowsPerPage);
}
return Math.max(1, t);
},
invalidatePages: function() {
this.p0 = this.p1 = null, this.p0RowBounds = {}, this.p1RowBounds = {}, this.$.page0.setContent(""), this.$.page1.setContent("");
},
invalidateMetrics: function() {
this.pageHeights = [], this.rowHeight = 0, this.updateMetrics();
},
scroll: function(e, t) {
var n = this.inherited(arguments), r = this.getScrollTop();
return this.lastPos === r ? n : (this.lastPos = r, this.update(r), this.pinnedReorderMode && this.reorderScroll(e, t), n);
},
setScrollTop: function(e) {
this.update(e), this.inherited(arguments), this.twiddle();
},
getScrollPosition: function() {
return this.calcPos(this.getScrollTop());
},
setScrollPosition: function(e) {
this.setScrollTop(this.calcPos(e));
},
scrollToBottom: function() {
this.update(this.getScrollBounds().maxTop), this.inherited(arguments);
},
scrollToRow: function(e) {
var t = this.pageForRow(e), n = e % this.rowsPerPage, r = this.pageToPosition(t);
this.updateForPosition(r), r = this.pageToPosition(t), this.setScrollPosition(r);
if (t == this.p0 || t == this.p1) {
var i = this.$.generator.fetchRowNode(e);
if (i) {
var s = i.offsetTop;
this.bottomUp && (s = this.getPageHeight(t) - i.offsetHeight - s);
var o = this.getScrollPosition() + s;
this.setScrollPosition(o);
}
}
},
scrollToStart: function() {
this[this.bottomUp ? "scrollToBottom" : "scrollToTop"]();
},
scrollToEnd: function() {
this[this.bottomUp ? "scrollToTop" : "scrollToBottom"]();
},
refresh: function() {
this.invalidatePages(), this.update(this.getScrollTop()), this.stabilize(), enyo.platform.android === 4 && this.twiddle();
},
reset: function() {
this.getSelection().clear(), this.invalidateMetrics(), this.invalidatePages(), this.stabilize(), this.scrollToStart();
},
getSelection: function() {
return this.$.generator.getSelection();
},
select: function(e, t) {
return this.getSelection().select(e, t);
},
deselect: function(e) {
return this.getSelection().deselect(e);
},
isSelected: function(e) {
return this.$.generator.isSelected(e);
},
renderRow: function(e) {
this.$.generator.renderRow(e);
},
rowRendered: function(e, t) {
this.updateRowBounds(t.rowIndex);
},
prepareRow: function(e) {
this.$.generator.prepareRow(e);
},
lockRow: function() {
this.$.generator.lockRow();
},
performOnRow: function(e, t, n) {
this.$.generator.performOnRow(e, t, n);
},
animateFinish: function(e) {
return this.twiddle(), !0;
},
twiddle: function() {
var e = this.getStrategy();
enyo.call(e, "twiddle");
},
pageForPageNumber: function(e, t) {
return e % 2 === 0 ? !t || e === this.p0 ? this.$.page0 : null : !t || e === this.p1 ? this.$.page1 : null;
},
shouldStartReordering: function(e, t) {
return !!this.getReorderable() && t.rowIndex >= 0 && !this.pinnedReorderMode && e === this.$.strategy && t.index >= 0 ? !0 : !1;
},
startReordering: function(e) {
this.$.strategy.listReordering = !0, this.buildReorderContainer(), this.doSetupReorderComponents(e), this.styleReorderContainer(e), this.draggingRowIndex = this.placeholderRowIndex = e.rowIndex, this.draggingRowNode = e.target, this.removedInitialPage = !1, this.itemMoved = !1, this.initialPageNumber = this.currentPageNumber = this.pageForRow(e.rowIndex), this.prevScrollTop = this.getScrollTop(), this.replaceNodeWithPlaceholder(e.rowIndex);
},
buildReorderContainer: function() {
this.$.reorderContainer.destroyClientControls();
for (var e = 0; e < this.reorderComponents.length; e++) this.$.reorderContainer.createComponent(this.reorderComponents[e], {
owner: this.owner
});
this.$.reorderContainer.render();
},
styleReorderContainer: function(e) {
this.setItemPosition(this.$.reorderContainer, e.rowIndex), this.setItemBounds(this.$.reorderContainer, e.rowIndex), this.$.reorderContainer.setShowing(!0), this.centerReorderContainer && this.centerReorderContainerOnPointer(e);
},
appendNodeToReorderContainer: function(e) {
this.$.reorderContainer.createComponent({
allowHtml: !0,
content: e.innerHTML
}).render();
},
centerReorderContainerOnPointer: function(e) {
var t = enyo.dom.calcNodePosition(this.hasNode()), n = e.pageX - t.left - parseInt(this.$.reorderContainer.domStyles.width, 10) / 2, r = e.pageY - t.top + this.getScrollTop() - parseInt(this.$.reorderContainer.domStyles.height, 10) / 2;
this.getStrategyKind() != "ScrollStrategy" && (n -= this.getScrollLeft(), r -= this.getScrollTop()), this.positionReorderContainer(n, r);
},
positionReorderContainer: function(e, t) {
this.$.reorderContainer.addClass("enyo-animatedTopAndLeft"), this.$.reorderContainer.addStyles("left:" + e + "px;top:" + t + "px;"), this.setPositionReorderContainerTimeout();
},
setPositionReorderContainerTimeout: function() {
this.clearPositionReorderContainerTimeout(), this.positionReorderContainerTimeout = setTimeout(enyo.bind(this, function() {
this.$.reorderContainer.removeClass("enyo-animatedTopAndLeft"), this.clearPositionReorderContainerTimeout();
}), 100);
},
clearPositionReorderContainerTimeout: function() {
this.positionReorderContainerTimeout && (clearTimeout(this.positionReorderContainerTimeout), this.positionReorderContainerTimeout = null);
},
shouldDoReorderDrag: function() {
return !this.getReorderable() || this.draggingRowIndex < 0 || this.pinnedReorderMode ? !1 : !0;
},
reorderDrag: function(e) {
this.positionReorderNode(e), this.checkForAutoScroll(e), this.updatePlaceholderPosition(e.pageY);
},
updatePlaceholderPosition: function(e) {
var t = this.getRowIndexFromCoordinate(e);
t !== -1 && (t >= this.placeholderRowIndex ? this.movePlaceholderToIndex(Math.min(this.count, t + 1)) : this.movePlaceholderToIndex(t));
},
positionReorderNode: function(e) {
var t = this.$.reorderContainer.getBounds(), n = t.left + e.ddx, r = t.top + e.ddy;
r = this.getStrategyKind() == "ScrollStrategy" ? r + (this.getScrollTop() - this.prevScrollTop) : r, this.$.reorderContainer.addStyles("top: " + r + "px ; left: " + n + "px"), this.prevScrollTop = this.getScrollTop();
},
checkForAutoScroll: function(e) {
var t = enyo.dom.calcNodePosition(this.hasNode()), n = this.getBounds(), r;
this.autoscrollPageY = e.pageY, e.pageY - t.top < n.height * this.dragToScrollThreshold ? (r = 100 * (1 - (e.pageY - t.top) / (n.height * this.dragToScrollThreshold)), this.scrollDistance = -1 * r) : e.pageY - t.top > n.height * (1 - this.dragToScrollThreshold) ? (r = 100 * ((e.pageY - t.top - n.height * (1 - this.dragToScrollThreshold)) / (n.height - n.height * (1 - this.dragToScrollThreshold))), this.scrollDistance = 1 * r) : this.scrollDistance = 0, this.scrollDistance === 0 ? this.stopAutoScrolling() : this.autoScrollTimeout || this.startAutoScrolling();
},
stopAutoScrolling: function() {
this.autoScrollTimeout && (clearTimeout(this.autoScrollTimeout), this.autoScrollTimeout = null);
},
startAutoScrolling: function() {
this.autoScrollTimeout = setInterval(enyo.bind(this, this.autoScroll), this.autoScrollTimeoutMS);
},
autoScroll: function() {
this.scrollDistance === 0 ? this.stopAutoScrolling() : this.autoScrollTimeout || this.startAutoScrolling(), this.setScrollPosition(this.getScrollPosition() + this.scrollDistance), this.positionReorderNode({
ddx: 0,
ddy: 0
}), this.updatePlaceholderPosition(this.autoscrollPageY);
},
movePlaceholderToIndex: function(e) {
var t, n;
if (e < 0) return;
e >= this.count ? (t = null, n = this.pageForPageNumber(this.pageForRow(this.count - 1)).hasNode()) : (t = this.$.generator.fetchRowNode(e), n = t.parentNode);
var r = this.pageForRow(e);
r >= this.pageCount && (r = this.currentPageNumber), n.insertBefore(this.placeholderNode, t), this.currentPageNumber !== r && (this.updatePageHeight(this.currentPageNumber), this.updatePageHeight(r), this.updatePagePositions(r)), this.placeholderRowIndex = e, this.currentPageNumber = r, this.itemMoved = !0;
},
finishReordering: function(e, t) {
if (!this.isReordering() || this.pinnedReorderMode || this.completeReorderTimeout) return;
return this.stopAutoScrolling(), this.$.strategy.listReordering = !1, this.moveReorderedContainerToDroppedPosition(t), this.completeReorderTimeout = setTimeout(enyo.bind(this, this.completeFinishReordering, t), 100), t.preventDefault(), !0;
},
moveReorderedContainerToDroppedPosition: function() {
var e = this.getRelativeOffset(this.placeholderNode, this.hasNode()), t = this.getStrategyKind() == "ScrollStrategy" ? e.top : e.top - this.getScrollTop(), n = e.left - this.getScrollLeft();
this.positionReorderContainer(n, t);
},
completeFinishReordering: function(e) {
this.completeReorderTimeout = null, this.placeholderRowIndex > this.draggingRowIndex && (this.placeholderRowIndex = Math.max(0, this.placeholderRowIndex - 1));
if (this.draggingRowIndex == this.placeholderRowIndex && this.pinnedReorderComponents.length && !this.pinnedReorderMode && !this.itemMoved) {
this.beginPinnedReorder(e);
return;
}
this.removeDraggingRowNode(), this.removePlaceholderNode(), this.emptyAndHideReorderContainer(), this.pinnedReorderMode = !1, this.reorderRows(e), this.draggingRowIndex = this.placeholderRowIndex = -1, this.refresh();
},
beginPinnedReorder: function(e) {
this.buildPinnedReorderContainer(), this.doSetupPinnedReorderComponents(enyo.mixin(e, {
index: this.draggingRowIndex
})), this.pinnedReorderMode = !0, this.initialPinPosition = e.pageY;
},
emptyAndHideReorderContainer: function() {
this.$.reorderContainer.destroyComponents(), this.$.reorderContainer.setShowing(!1);
},
buildPinnedReorderContainer: function() {
this.$.reorderContainer.destroyClientControls();
for (var e = 0; e < this.pinnedReorderComponents.length; e++) this.$.reorderContainer.createComponent(this.pinnedReorderComponents[e], {
owner: this.owner
});
this.$.reorderContainer.render();
},
reorderRows: function(e) {
this.doReorder(this.makeReorderEvent(e)), this.positionReorderedNode(), this.updateListIndices();
},
makeReorderEvent: function(e) {
return e.reorderFrom = this.draggingRowIndex, e.reorderTo = this.placeholderRowIndex, e;
},
positionReorderedNode: function() {
if (!this.removedInitialPage) {
var e = this.$.generator.fetchRowNode(this.placeholderRowIndex);
e && (e.parentNode.insertBefore(this.hiddenNode, e), this.showNode(this.hiddenNode)), this.hiddenNode = null;
if (this.currentPageNumber != this.initialPageNumber) {
var t, n, r = this.pageForPageNumber(this.currentPageNumber), i = this.pageForPageNumber(this.currentPageNumber + 1);
this.initialPageNumber < this.currentPageNumber ? (t = r.hasNode().firstChild, i.hasNode().appendChild(t)) : (t = r.hasNode().lastChild, n = i.hasNode().firstChild, i.hasNode().insertBefore(t, n)), this.correctPageHeights(), this.updatePagePositions(this.initialPageNumber);
}
}
},
updateListIndices: function() {
if (this.shouldDoRefresh()) {
this.refresh(), this.correctPageHeights();
return;
}
var e = Math.min(this.draggingRowIndex, this.placeholderRowIndex), t = Math.max(this.draggingRowIndex, this.placeholderRowIndex), n = this.draggingRowIndex - this.placeholderRowIndex > 0 ? 1 : -1, r, i, s, o;
if (n === 1) {
r = this.$.generator.fetchRowNode(this.draggingRowIndex), r && r.setAttribute("data-enyo-index", "reordered");
for (i = t - 1, s = t; i >= e; i--) {
r = this.$.generator.fetchRowNode(i);
if (!r) continue;
o = parseInt(r.getAttribute("data-enyo-index"), 10), s = o + 1, r.setAttribute("data-enyo-index", s);
}
r = this.hasNode().querySelector('[data-enyo-index="reordered"]'), r.setAttribute("data-enyo-index", this.placeholderRowIndex);
} else {
r = this.$.generator.fetchRowNode(this.draggingRowIndex), r && r.setAttribute("data-enyo-index", this.placeholderRowIndex);
for (i = e + 1, s = e; i <= t; i++) {
r = this.$.generator.fetchRowNode(i);
if (!r) continue;
o = parseInt(r.getAttribute("data-enyo-index"), 10), s = o - 1, r.setAttribute("data-enyo-index", s);
}
}
},
shouldDoRefresh: function() {
return Math.abs(this.initialPageNumber - this.currentPageNumber) > 1;
},
getNodeStyle: function(e) {
var t = this.$.generator.fetchRowNode(e);
if (!t) return;
var n = this.getRelativeOffset(t, this.hasNode()), r = enyo.dom.getBounds(t);
return {
h: r.height,
w: r.width,
left: n.left,
top: n.top
};
},
getRelativeOffset: function(e, t) {
var n = {
top: 0,
left: 0
};
if (e !== t && e.parentNode) do n.top += e.offsetTop || 0, n.left += e.offsetLeft || 0, e = e.offsetParent; while (e && e !== t);
return n;
},
replaceNodeWithPlaceholder: function(e) {
var t = this.$.generator.fetchRowNode(e);
if (!t) {
enyo.log("No node - " + e);
return;
}
this.placeholderNode = this.createPlaceholderNode(t), this.hiddenNode = this.hideNode(t);
var n = this.pageForPageNumber(this.currentPageNumber);
n.hasNode().insertBefore(this.placeholderNode, this.hiddenNode);
},
createPlaceholderNode: function(e) {
var t = this.$.placeholder.hasNode().cloneNode(!0), n = enyo.dom.getBounds(e);
return t.style.height = n.height + "px", t.style.width = n.width + "px", t;
},
removePlaceholderNode: function() {
this.removeNode(this.placeholderNode), this.placeholderNode = null;
},
removeDraggingRowNode: function() {
this.draggingRowNode = null;
var e = this.$.holdingarea.hasNode();
e.innerHTML = "";
},
removeNode: function(e) {
if (!e || !e.parentNode) return;
e.parentNode.removeChild(e);
},
updatePageHeight: function(e) {
if (e < 0) return;
var t = this.pageForPageNumber(e, !0);
if (t) {
var n = this.pageHeights[e], r = Math.max(1, t.getBounds().height);
this.pageHeights[e] = r, this.portSize += r - n;
}
},
updatePagePositions: function(e) {
this.positionPage(this.currentPageNumber, this.pageForPageNumber(this.currentPageNumber)), this.positionPage(e, this.pageForPageNumber(e));
},
correctPageHeights: function() {
this.updatePageHeight(this.currentPageNumber), this.initialPageNumber != this.currentPageNumber && this.updatePageHeight(this.initialPageNumber);
},
hideNode: function(e) {
return e.style.display = "none", e;
},
showNode: function(e) {
return e.style.display = "block", e;
},
dropPinnedRow: function(e) {
this.moveReorderedContainerToDroppedPosition(e), this.completeReorderTimeout = setTimeout(enyo.bind(this, this.completeFinishReordering, e), 100);
return;
},
cancelPinnedMode: function(e) {
this.placeholderRowIndex = this.draggingRowIndex, this.dropPinnedRow(e);
},
getRowIndexFromCoordinate: function(e) {
var t = this.getScrollTop() + e - enyo.dom.calcNodePosition(this.hasNode()).top;
if (t < 0) return -1;
var n = this.positionToPageInfo(t), r = n.no == this.p0 ? this.p0RowBounds : this.p1RowBounds;
if (!r) return this.count;
var i = n.pos, s = this.placeholderNode ? enyo.dom.getBounds(this.placeholderNode).height : 0, o = 0;
for (var u = n.startRow; u <= n.endRow; ++u) {
if (u === this.placeholderRowIndex) {
o += s;
if (o >= i) return -1;
}
if (u !== this.draggingRowIndex) {
o += r[u].height;
if (o >= i) return u;
}
}
return u;
},
getIndexPosition: function(e) {
return enyo.dom.calcNodePosition(this.$.generator.fetchRowNode(e));
},
setItemPosition: function(e, t) {
var n = this.getNodeStyle(t), r = this.getStrategyKind() == "ScrollStrategy" ? n.top : n.top - this.getScrollTop(), i = "top:" + r + "px; left:" + n.left + "px;";
e.addStyles(i);
},
setItemBounds: function(e, t) {
var n = this.getNodeStyle(t), r = "width:" + n.w + "px; height:" + n.h + "px;";
e.addStyles(r);
},
reorderScroll: function(e, t) {
this.getStrategyKind() == "ScrollStrategy" && this.$.reorderContainer.addStyles("top:" + (this.initialPinPosition + this.getScrollTop() - this.rowHeight) + "px;"), this.updatePlaceholderPosition(this.initialPinPosition);
},
hideReorderingRow: function() {
var e = this.hasNode().querySelector('[data-enyo-index="' + this.draggingRowIndex + '"]');
e && (this.hiddenNode = this.hideNode(e));
},
isReordering: function() {
return this.draggingRowIndex > -1;
},
isSwiping: function() {
return this.swipeIndex != null && !this.swipeComplete && this.swipeDirection != null;
},
swipeDragStart: function(e, t) {
return t.index == null || t.vertical ? !0 : (this.completeSwipeTimeout && this.completeSwipe(t), this.swipeComplete = !1, this.swipeIndex != t.index && (this.clearSwipeables(), this.swipeIndex = t.index), this.swipeDirection = t.xDirection, this.persistentItemVisible || this.startSwipe(t), this.draggedXDistance = 0, this.draggedYDistance = 0, !0);
},
swipeDrag: function(e, t) {
return this.persistentItemVisible ? (this.dragPersistentItem(t), this.preventDragPropagation) : this.isSwiping() ? (this.dragSwipeableComponents(this.calcNewDragPosition(t.ddx)), this.draggedXDistance = t.dx, this.draggedYDistance = t.dy, !0) : !1;
},
swipeDragFinish: function(e, t) {
if (this.persistentItemVisible) this.dragFinishPersistentItem(t); else {
if (!this.isSwiping()) return !1;
var n = this.calcPercentageDragged(this.draggedXDistance);
n > this.percentageDraggedThreshold && t.xDirection === this.swipeDirection ? this.swipe(this.fastSwipeSpeedMS) : this.backOutSwipe(t);
}
return this.preventDragPropagation;
},
isSwipeable: function() {
return this.enableSwipe && this.$.swipeableComponents.controls.length !== 0 && !this.isReordering() && !this.pinnedReorderMode;
},
positionSwipeableContainer: function(e, t) {
var n = this.$.generator.fetchRowNode(e);
if (!n) return;
var r = this.getRelativeOffset(n, this.hasNode()), i = enyo.dom.getBounds(n), s = t == 1 ? -1 * i.width : i.width;
this.$.swipeableComponents.addStyles("top: " + r.top + "px; left: " + s + "px; height: " + i.height + "px; width: " + i.width + "px;");
},
calcNewDragPosition: function(e) {
var t = this.$.swipeableComponents.getBounds(), n = t.left, r = this.$.swipeableComponents.getBounds(), i = this.swipeDirection == 1 ? 0 : -1 * r.width, s = this.swipeDirection == 1 ? n + e > i ? i : n + e : n + e < i ? i : n + e;
return s;
},
dragSwipeableComponents: function(e) {
this.$.swipeableComponents.applyStyle("left", e + "px");
},
startSwipe: function(e) {
e.index = this.swipeIndex, this.positionSwipeableContainer(this.swipeIndex, e.xDirection), this.$.swipeableComponents.setShowing(!0), this.setPersistentItemOrigin(e.xDirection), this.doSetupSwipeItem(e);
},
dragPersistentItem: function(e) {
var t = 0, n = this.persistentItemOrigin == "right" ? Math.max(t, t + e.dx) : Math.min(t, t + e.dx);
this.$.swipeableComponents.applyStyle("left", n + "px");
},
dragFinishPersistentItem: function(e) {
var t = this.calcPercentageDragged(e.dx) > .2, n = e.dx > 0 ? "right" : e.dx < 0 ? "left" : null;
this.persistentItemOrigin == n ? t ? this.slideAwayItem() : this.bounceItem(e) : this.bounceItem(e);
},
setPersistentItemOrigin: function(e) {
this.persistentItemOrigin = e == 1 ? "left" : "right";
},
calcPercentageDragged: function(e) {
return Math.abs(e / this.$.swipeableComponents.getBounds().width);
},
swipe: function(e) {
this.swipeComplete = !0, this.animateSwipe(0, e);
},
backOutSwipe: function(e) {
var t = this.$.swipeableComponents.getBounds(), n = this.swipeDirection == 1 ? -1 * t.width : t.width;
this.animateSwipe(n, this.fastSwipeSpeedMS), this.swipeDirection = null;
},
bounceItem: function(e) {
var t = this.$.swipeableComponents.getBounds();
t.left != t.width && this.animateSwipe(0, this.normalSwipeSpeedMS);
},
slideAwayItem: function() {
var e = this.$.swipeableComponents, t = e.getBounds().width, n = this.persistentItemOrigin == "left" ? -1 * t : t;
this.animateSwipe(n, this.normalSwipeSpeedMS), this.persistentItemVisible = !1, this.setPersistSwipeableItem(!1);
},
clearSwipeables: function() {
this.$.swipeableComponents.setShowing(!1), this.persistentItemVisible = !1, this.setPersistSwipeableItem(!1);
},
completeSwipe: function(e) {
this.completeSwipeTimeout && (clearTimeout(this.completeSwipeTimeout), this.completeSwipeTimeout = null), this.getPersistSwipeableItem() ? this.persistentItemVisible = !0 : (this.$.swipeableComponents.setShowing(!1), this.swipeComplete && this.doSwipeComplete({
index: this.swipeIndex,
xDirection: this.swipeDirection
})), this.swipeIndex = null, this.swipeDirection = null;
},
animateSwipe: function(e, t) {
var n = enyo.now(), r = 0, i = this.$.swipeableComponents, s = parseInt(i.domStyles.left, 10), o = e - s;
this.stopAnimateSwipe();
var u = enyo.bind(this, function() {
var e = enyo.now() - n, r = e / t, a = s + o * Math.min(r, 1);
i.applyStyle("left", a + "px"), this.job = enyo.requestAnimationFrame(u), e / t >= 1 && (this.stopAnimateSwipe(), this.completeSwipeTimeout = setTimeout(enyo.bind(this, function() {
this.completeSwipe();
}), this.completeSwipeDelayMS));
});
this.job = enyo.requestAnimationFrame(u);
},
stopAnimateSwipe: function() {
this.job && (this.job = enyo.cancelRequestAnimationFrame(this.job));
}
});

// PulldownList.js

enyo.kind({
name: "enyo.PulldownList",
kind: "List",
touch: !0,
pully: null,
pulldownTools: [ {
name: "pulldown",
classes: "enyo-list-pulldown",
components: [ {
name: "puller",
kind: "Puller"
} ]
} ],
events: {
onPullStart: "",
onPullCancel: "",
onPull: "",
onPullRelease: "",
onPullComplete: ""
},
handlers: {
onScrollStart: "scrollStartHandler",
onScrollStop: "scrollStopHandler",
ondragfinish: "dragfinish"
},
pullingMessage: "Pull down to refresh...",
pulledMessage: "Release to refresh...",
loadingMessage: "Loading...",
pullingIconClass: "enyo-puller-arrow enyo-puller-arrow-down",
pulledIconClass: "enyo-puller-arrow enyo-puller-arrow-up",
loadingIconClass: "",
create: function() {
var e = {
kind: "Puller",
showing: !1,
text: this.loadingMessage,
iconClass: this.loadingIconClass,
onCreate: "setPully"
};
this.listTools.splice(0, 0, e), this.inherited(arguments), this.setPulling();
},
initComponents: function() {
this.createChrome(this.pulldownTools), this.accel = enyo.dom.canAccelerate(), this.translation = this.accel ? "translate3d" : "translate", this.strategyKind = this.resetStrategyKind(), this.inherited(arguments);
},
resetStrategyKind: function() {
return enyo.platform.android >= 3 ? "TranslateScrollStrategy" : "TouchScrollStrategy";
},
setPully: function(e, t) {
this.pully = t.originator;
},
scrollStartHandler: function() {
this.firedPullStart = !1, this.firedPull = !1, this.firedPullCancel = !1;
},
scroll: function(e, t) {
var n = this.inherited(arguments);
this.completingPull && this.pully.setShowing(!1);
var r = this.getStrategy().$.scrollMath || this.getStrategy(), i = -1 * this.getScrollTop();
return r.isInOverScroll() && i > 0 && (enyo.dom.transformValue(this.$.pulldown, this.translation, "0," + i + "px" + (this.accel ? ",0" : "")), this.firedPullStart || (this.firedPullStart = !0, this.pullStart(), this.pullHeight = this.$.pulldown.getBounds().height), i > this.pullHeight && !this.firedPull && (this.firedPull = !0, this.firedPullCancel = !1, this.pull()), this.firedPull && !this.firedPullCancel && i < this.pullHeight && (this.firedPullCancel = !0, this.firedPull = !1, this.pullCancel())), n;
},
scrollStopHandler: function() {
this.completingPull && (this.completingPull = !1, this.doPullComplete());
},
dragfinish: function() {
if (this.firedPull) {
var e = this.getStrategy().$.scrollMath || this.getStrategy();
e.setScrollY(-1 * this.getScrollTop() - this.pullHeight), this.pullRelease();
}
},
completePull: function() {
this.completingPull = !0;
var e = this.getStrategy().$.scrollMath || this.getStrategy();
e.setScrollY(this.pullHeight), e.start();
},
pullStart: function() {
this.setPulling(), this.pully.setShowing(!1), this.$.puller.setShowing(!0), this.doPullStart();
},
pull: function() {
this.setPulled(), this.doPull();
},
pullCancel: function() {
this.setPulling(), this.doPullCancel();
},
pullRelease: function() {
this.$.puller.setShowing(!1), this.pully.setShowing(!0), this.doPullRelease();
},
setPulling: function() {
this.$.puller.setText(this.pullingMessage), this.$.puller.setIconClass(this.pullingIconClass);
},
setPulled: function() {
this.$.puller.setText(this.pulledMessage), this.$.puller.setIconClass(this.pulledIconClass);
}
}), enyo.kind({
name: "enyo.Puller",
classes: "enyo-puller",
published: {
text: "",
iconClass: ""
},
events: {
onCreate: ""
},
components: [ {
name: "icon"
}, {
name: "text",
tag: "span",
classes: "enyo-puller-text"
} ],
create: function() {
this.inherited(arguments), this.doCreate(), this.textChanged(), this.iconClassChanged();
},
textChanged: function() {
this.$.text.setContent(this.text);
},
iconClassChanged: function() {
this.$.icon.setClasses(this.iconClass);
}
});

// AroundList.js

enyo.kind({
name: "enyo.AroundList",
kind: "enyo.List",
listTools: [ {
name: "port",
classes: "enyo-list-port enyo-border-box",
components: [ {
name: "aboveClient"
}, {
name: "generator",
kind: "FlyweightRepeater",
canGenerate: !1,
components: [ {
tag: null,
name: "client"
} ]
}, {
name: "holdingarea",
allowHtml: !0,
classes: "enyo-list-holdingarea"
}, {
name: "page0",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "page1",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "belowClient"
}, {
name: "placeholder"
}, {
name: "swipeableComponents",
style: "position:absolute; display:block; top:-1000px; left:0px;"
} ]
} ],
aboveComponents: null,
initComponents: function() {
this.inherited(arguments), this.aboveComponents && this.$.aboveClient.createComponents(this.aboveComponents, {
owner: this.owner
}), this.belowComponents && this.$.belowClient.createComponents(this.belowComponents, {
owner: this.owner
});
},
updateMetrics: function() {
this.defaultPageHeight = this.rowsPerPage * (this.rowHeight || 100), this.pageCount = Math.ceil(this.count / this.rowsPerPage), this.aboveHeight = this.$.aboveClient.getBounds().height, this.belowHeight = this.$.belowClient.getBounds().height, this.portSize = this.aboveHeight + this.belowHeight;
for (var e = 0; e < this.pageCount; e++) this.portSize += this.getPageHeight(e);
this.adjustPortSize();
},
positionPage: function(e, t) {
t.pageNo = e;
var n = this.pageToPosition(e), r = this.bottomUp ? this.belowHeight : this.aboveHeight;
n += r, t.applyStyle(this.pageBound, n + "px");
},
scrollToContentStart: function() {
var e = this.bottomUp ? this.belowHeight : this.aboveHeight;
this.setScrollPosition(e);
}
});

// Slideable.js

enyo.kind({
name: "enyo.Slideable",
kind: "Control",
published: {
axis: "h",
value: 0,
unit: "px",
min: 0,
max: 0,
accelerated: "auto",
overMoving: !0,
draggable: !0
},
events: {
onAnimateFinish: "",
onChange: ""
},
preventDragPropagation: !1,
tools: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorComplete"
} ],
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
kDragScalar: 1,
dragEventProp: "dx",
unitModifier: !1,
canTransform: !1,
create: function() {
this.inherited(arguments), this.acceleratedChanged(), this.transformChanged(), this.axisChanged(), this.valueChanged(), this.addClass("enyo-slideable");
},
initComponents: function() {
this.createComponents(this.tools), this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments), this.canModifyUnit(), this.updateDragScalar();
},
resizeHandler: function() {
this.inherited(arguments), this.updateDragScalar();
},
canModifyUnit: function() {
if (!this.canTransform) {
var e = this.getInitialStyleValue(this.hasNode(), this.boundary);
e.match(/px/i) && this.unit === "%" && (this.unitModifier = this.getBounds()[this.dimension]);
}
},
getInitialStyleValue: function(e, t) {
var n = enyo.dom.getComputedStyle(e);
return n ? n.getPropertyValue(t) : e && e.currentStyle ? e.currentStyle[t] : "0";
},
updateBounds: function(e, t) {
var n = {};
n[this.boundary] = e, this.setBounds(n, this.unit), this.setInlineStyles(e, t);
},
updateDragScalar: function() {
if (this.unit == "%") {
var e = this.getBounds()[this.dimension];
this.kDragScalar = e ? 100 / e : 1, this.canTransform || this.updateBounds(this.value, 100);
}
},
transformChanged: function() {
this.canTransform = enyo.dom.canTransform();
},
acceleratedChanged: function() {
enyo.platform.android > 2 || enyo.dom.accelerate(this, this.accelerated);
},
axisChanged: function() {
var e = this.axis == "h";
this.dragMoveProp = e ? "dx" : "dy", this.shouldDragProp = e ? "horizontal" : "vertical", this.transform = e ? "translateX" : "translateY", this.dimension = e ? "width" : "height", this.boundary = e ? "left" : "top";
},
setInlineStyles: function(e, t) {
var n = {};
this.unitModifier ? (n[this.boundary] = this.percentToPixels(e, this.unitModifier), n[this.dimension] = this.unitModifier, this.setBounds(n)) : (t ? n[this.dimension] = t : n[this.boundary] = e, this.setBounds(n, this.unit));
},
valueChanged: function(e) {
var t = this.value;
this.isOob(t) && !this.isAnimating() && (this.value = this.overMoving ? this.dampValue(t) : this.clampValue(t)), enyo.platform.android > 2 && (this.value ? (e === 0 || e === undefined) && enyo.dom.accelerate(this, this.accelerated) : enyo.dom.accelerate(this, !1)), this.canTransform ? enyo.dom.transformValue(this, this.transform, this.value + this.unit) : this.setInlineStyles(this.value, !1), this.doChange();
},
getAnimator: function() {
return this.$.animator;
},
isAtMin: function() {
return this.value <= this.calcMin();
},
isAtMax: function() {
return this.value >= this.calcMax();
},
calcMin: function() {
return this.min;
},
calcMax: function() {
return this.max;
},
clampValue: function(e) {
var t = this.calcMin(), n = this.calcMax();
return Math.max(t, Math.min(e, n));
},
dampValue: function(e) {
return this.dampBound(this.dampBound(e, this.min, 1), this.max, -1);
},
dampBound: function(e, t, n) {
var r = e;
return r * n < t * n && (r = t + (r - t) / 4), r;
},
percentToPixels: function(e, t) {
return Math.floor(t / 100 * e);
},
pixelsToPercent: function(e) {
var t = this.unitModifier ? this.getBounds()[this.dimension] : this.container.getBounds()[this.dimension];
return e / t * 100;
},
shouldDrag: function(e) {
return this.draggable && e[this.shouldDragProp];
},
isOob: function(e) {
return e > this.calcMax() || e < this.calcMin();
},
dragstart: function(e, t) {
if (this.shouldDrag(t)) return t.preventDefault(), this.$.animator.stop(), t.dragInfo = {}, this.dragging = !0, this.drag0 = this.value, this.dragd0 = 0, this.preventDragPropagation;
},
drag: function(e, t) {
if (this.dragging) {
t.preventDefault();
var n = this.canTransform ? t[this.dragMoveProp] * this.kDragScalar : this.pixelsToPercent(t[this.dragMoveProp]), r = this.drag0 + n, i = n - this.dragd0;
return this.dragd0 = n, i && (t.dragInfo.minimizing = i < 0), this.setValue(r), this.preventDragPropagation;
}
},
dragfinish: function(e, t) {
if (this.dragging) return this.dragging = !1, this.completeDrag(t), t.preventTap(), this.preventDragPropagation;
},
completeDrag: function(e) {
this.value !== this.calcMax() && this.value != this.calcMin() && this.animateToMinMax(e.dragInfo.minimizing);
},
isAnimating: function() {
return this.$.animator.isAnimating();
},
play: function(e, t) {
this.$.animator.play({
startValue: e,
endValue: t,
node: this.hasNode()
});
},
animateTo: function(e) {
this.play(this.value, e);
},
animateToMin: function() {
this.animateTo(this.calcMin());
},
animateToMax: function() {
this.animateTo(this.calcMax());
},
animateToMinMax: function(e) {
e ? this.animateToMin() : this.animateToMax();
},
animatorStep: function(e) {
return this.setValue(e.value), !0;
},
animatorComplete: function(e) {
return this.doAnimateFinish(e), !0;
},
toggleMinMax: function() {
this.animateToMinMax(!this.isAtMin());
}
});

// Arranger.js

enyo.kind({
name: "enyo.Arranger",
kind: "Layout",
layoutClass: "enyo-arranger",
accelerated: "auto",
dragProp: "ddx",
dragDirectionProp: "xDirection",
canDragProp: "horizontal",
incrementalPoints: !1,
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n._arranger = null;
this.inherited(arguments);
},
arrange: function(e, t) {},
size: function() {},
start: function() {
var e = this.container.fromIndex, t = this.container.toIndex, n = this.container.transitionPoints = [ e ];
if (this.incrementalPoints) {
var r = Math.abs(t - e) - 2, i = e;
while (r >= 0) i += t < e ? -1 : 1, n.push(i), r--;
}
n.push(this.container.toIndex);
},
finish: function() {},
calcArrangementDifference: function(e, t, n, r) {},
canDragEvent: function(e) {
return e[this.canDragProp];
},
calcDragDirection: function(e) {
return e[this.dragDirectionProp];
},
calcDrag: function(e) {
return e[this.dragProp];
},
drag: function(e, t, n, r, i) {
var s = this.measureArrangementDelta(-e, t, n, r, i);
return s;
},
measureArrangementDelta: function(e, t, n, r, i) {
var s = this.calcArrangementDifference(t, n, r, i), o = s ? e / Math.abs(s) : 0;
return o *= this.container.fromIndex > this.container.toIndex ? -1 : 1, o;
},
_arrange: function(e) {
this.containerBounds || this.reflow();
var t = this.getOrderedControls(e);
this.arrange(t, e);
},
arrangeControl: function(e, t) {
e._arranger = enyo.mixin(e._arranger || {}, t);
},
flow: function() {
this.c$ = [].concat(this.container.getPanels()), this.controlsIndex = 0;
for (var e = 0, t = this.container.getPanels(), n; n = t[e]; e++) {
enyo.dom.accelerate(n, this.accelerated);
if (enyo.platform.safari) {
var r = n.children;
for (var i = 0, s; s = r[i]; i++) enyo.dom.accelerate(s, this.accelerated);
}
}
},
reflow: function() {
var e = this.container.hasNode();
this.containerBounds = e ? {
width: e.clientWidth,
height: e.clientHeight
} : {}, this.size();
},
flowArrangement: function() {
var e = this.container.arrangement;
if (e) for (var t = 0, n = this.container.getPanels(), r; r = n[t]; t++) this.flowControl(r, e[t]);
},
flowControl: function(e, t) {
enyo.Arranger.positionControl(e, t);
var n = t.opacity;
n != null && enyo.Arranger.opacifyControl(e, n);
},
getOrderedControls: function(e) {
var t = Math.floor(e), n = t - this.controlsIndex, r = n > 0, i = this.c$ || [];
for (var s = 0; s < Math.abs(n); s++) r ? i.push(i.shift()) : i.unshift(i.pop());
return this.controlsIndex = t, i;
},
statics: {
positionControl: function(e, t, n) {
var r = n || "px";
if (!this.updating) if (enyo.dom.canTransform() && !enyo.platform.android && enyo.platform.ie !== 10) {
var i = t.left, s = t.top;
i = enyo.isString(i) ? i : i && i + r, s = enyo.isString(s) ? s : s && s + r, enyo.dom.transform(e, {
translateX: i || null,
translateY: s || null
});
} else e.setBounds(t, n);
},
opacifyControl: function(e, t) {
var n = t;
n = n > .99 ? 1 : n < .01 ? 0 : n, enyo.platform.ie < 9 ? e.applyStyle("filter", "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + n * 100 + ")") : e.applyStyle("opacity", n);
}
}
});

// CardArranger.js

enyo.kind({
name: "enyo.CardArranger",
kind: "Arranger",
layoutClass: "enyo-arranger enyo-arranger-fit",
calcArrangementDifference: function(e, t, n, r) {
return this.containerBounds.width;
},
arrange: function(e, t) {
for (var n = 0, r, i, s; r = e[n]; n++) s = n === 0 ? 1 : 0, this.arrangeControl(r, {
opacity: s
});
},
start: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) {
var r = n.showing;
n.setShowing(t == this.container.fromIndex || t == this.container.toIndex), n.showing && !r && n.resized();
}
},
finish: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.toIndex);
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.opacifyControl(n, 1), n.showing || n.setShowing(!0);
this.inherited(arguments);
}
});

// CardSlideInArranger.js

enyo.kind({
name: "enyo.CardSlideInArranger",
kind: "CardArranger",
start: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) {
var r = n.showing;
n.setShowing(t == this.container.fromIndex || t == this.container.toIndex), n.showing && !r && n.resized();
}
var i = this.container.fromIndex;
t = this.container.toIndex, this.container.transitionPoints = [ t + "." + i + ".s", t + "." + i + ".f" ];
},
finish: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.toIndex);
},
arrange: function(e, t) {
var n = t.split("."), r = n[0], i = n[1], s = n[2] == "s", o = this.containerBounds.width;
for (var u = 0, a = this.container.getPanels(), f, l; f = a[u]; u++) l = o, i == u && (l = s ? 0 : -o), r == u && (l = s ? o : 0), i == u && i == r && (l = 0), this.arrangeControl(f, {
left: l
});
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null
});
this.inherited(arguments);
}
});

// CarouselArranger.js

enyo.kind({
name: "enyo.CarouselArranger",
kind: "Arranger",
size: function() {
var e = this.container.getPanels(), t = this.containerPadding = this.container.hasNode() ? enyo.dom.calcPaddingExtents(this.container.node) : {}, n = this.containerBounds, r, i, s, o, u;
n.height -= t.top + t.bottom, n.width -= t.left + t.right;
var a;
for (r = 0, s = 0; u = e[r]; r++) o = enyo.dom.calcMarginExtents(u.hasNode()), u.width = u.getBounds().width, u.marginWidth = o.right + o.left, s += (u.fit ? 0 : u.width) + u.marginWidth, u.fit && (a = u);
if (a) {
var f = n.width - s;
a.width = f >= 0 ? f : a.width;
}
for (r = 0, i = t.left; u = e[r]; r++) u.setBounds({
top: t.top,
bottom: t.bottom,
width: u.fit ? u.width : null
});
},
arrange: function(e, t) {
this.container.wrap ? this.arrangeWrap(e, t) : this.arrangeNoWrap(e, t);
},
arrangeNoWrap: function(e, t) {
var n, r, i, s, o = this.container.getPanels(), u = this.container.clamp(t), a = this.containerBounds.width;
for (n = u, i = 0; s = o[n]; n++) {
i += s.width + s.marginWidth;
if (i > a) break;
}
var f = a - i, l = 0;
if (f > 0) {
var c = u;
for (n = u - 1, r = 0; s = o[n]; n--) {
r += s.width + s.marginWidth;
if (f - r <= 0) {
l = f - r, u = n;
break;
}
}
}
var h, p;
for (n = 0, p = this.containerPadding.left + l; s = o[n]; n++) h = s.width + s.marginWidth, n < u ? this.arrangeControl(s, {
left: -h
}) : (this.arrangeControl(s, {
left: Math.floor(p)
}), p += h);
},
arrangeWrap: function(e, t) {
for (var n = 0, r = this.containerPadding.left, i, s; s = e[n]; n++) this.arrangeControl(s, {
left: r
}), r += s.width + s.marginWidth;
},
calcArrangementDifference: function(e, t, n, r) {
var i = Math.abs(e % this.c$.length);
return t[i].left - r[i].left;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("top", null), n.applyStyle("bottom", null), n.applyStyle("left", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// CollapsingArranger.js

enyo.kind({
name: "enyo.CollapsingArranger",
kind: "CarouselArranger",
peekWidth: 0,
size: function() {
this.clearLastSize(), this.inherited(arguments);
},
clearLastSize: function() {
for (var e = 0, t = this.container.getPanels(), n; n = t[e]; e++) n._fit && e != t.length - 1 && (n.applyStyle("width", null), n._fit = null);
},
constructor: function() {
this.inherited(arguments), this.peekWidth = this.container.peekWidth != null ? this.container.peekWidth : this.peekWidth;
},
arrange: function(e, t) {
var n = this.container.getPanels();
for (var r = 0, i = this.containerPadding.left, s, o, u = 0; o = n[r]; r++) o.getShowing() ? (this.arrangeControl(o, {
left: i + u * this.peekWidth
}), r >= t && (i += o.width + o.marginWidth - this.peekWidth), u++) : (this.arrangeControl(o, {
left: i
}), r >= t && (i += o.width + o.marginWidth)), r == n.length - 1 && t < 0 && this.arrangeControl(o, {
left: i - t
});
},
calcArrangementDifference: function(e, t, n, r) {
var i = this.container.getPanels().length - 1;
return Math.abs(r[i].left - t[i].left);
},
flowControl: function(e, t) {
this.inherited(arguments);
if (this.container.realtimeFit) {
var n = this.container.getPanels(), r = n.length - 1, i = n[r];
e == i && this.fitControl(e, t.left);
}
},
finish: function() {
this.inherited(arguments);
if (!this.container.realtimeFit && this.containerBounds) {
var e = this.container.getPanels(), t = this.container.arrangement, n = e.length - 1, r = e[n];
this.fitControl(r, t[n].left);
}
},
fitControl: function(e, t) {
e._fit = !0, e.applyStyle("width", this.containerBounds.width - t + "px"), e.resized();
}
});

// DockRightArranger.js

enyo.kind({
name: "enyo.DockRightArranger",
kind: "Arranger",
basePanel: !1,
overlap: 0,
layoutWidth: 0,
constructor: function() {
this.inherited(arguments), this.overlap = this.container.overlap != null ? this.container.overlap : this.overlap, this.layoutWidth = this.container.layoutWidth != null ? this.container.layoutWidth : this.layoutWidth;
},
size: function() {
var e = this.container.getPanels(), t = this.containerPadding = this.container.hasNode() ? enyo.dom.calcPaddingExtents(this.container.node) : {}, n = this.containerBounds, r, i, s;
n.width -= t.left + t.right;
var o = n.width, u = e.length;
this.container.transitionPositions = {};
for (r = 0; s = e[r]; r++) s.width = r === 0 && this.container.basePanel ? o : s.getBounds().width;
for (r = 0; s = e[r]; r++) {
r === 0 && this.container.basePanel && s.setBounds({
width: o
}), s.setBounds({
top: t.top,
bottom: t.bottom
});
for (j = 0; s = e[j]; j++) {
var a;
if (r === 0 && this.container.basePanel) a = 0; else if (j < r) a = o; else {
if (r !== j) break;
var f = o > this.layoutWidth ? this.overlap : 0;
a = o - e[r].width + f;
}
this.container.transitionPositions[r + "." + j] = a;
}
if (j < u) {
var l = !1;
for (k = r + 1; k < u; k++) {
var f = 0;
if (l) f = 0; else if (e[r].width + e[k].width - this.overlap > o) f = 0, l = !0; else {
f = e[r].width - this.overlap;
for (i = r; i < k; i++) {
var c = f + e[i + 1].width - this.overlap;
if (!(c < o)) {
f = o;
break;
}
f = c;
}
f = o - f;
}
this.container.transitionPositions[r + "." + k] = f;
}
}
}
},
arrange: function(e, t) {
var n, r, i = this.container.getPanels(), s = this.container.clamp(t);
for (n = 0; r = i[n]; n++) {
var o = this.container.transitionPositions[n + "." + s];
this.arrangeControl(r, {
left: o
});
}
},
calcArrangementDifference: function(e, t, n, r) {
var i = this.container.getPanels(), s = e < n ? i[n].width : i[e].width;
return s;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("top", null), n.applyStyle("bottom", null), n.applyStyle("left", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// OtherArrangers.js

enyo.kind({
name: "enyo.LeftRightArranger",
kind: "Arranger",
margin: 40,
axisSize: "width",
offAxisSize: "height",
axisPosition: "left",
constructor: function() {
this.inherited(arguments), this.margin = this.container.margin != null ? this.container.margin : this.margin;
},
size: function() {
var e = this.container.getPanels(), t = this.containerBounds[this.axisSize], n = t - this.margin - this.margin;
for (var r = 0, i, s; s = e[r]; r++) i = {}, i[this.axisSize] = n, i[this.offAxisSize] = "100%", s.setBounds(i);
},
start: function() {
this.inherited(arguments);
var e = this.container.fromIndex, t = this.container.toIndex, n = this.getOrderedControls(t), r = Math.floor(n.length / 2);
for (var i = 0, s; s = n[i]; i++) e > t ? i == n.length - r ? s.applyStyle("z-index", 0) : s.applyStyle("z-index", 1) : i == n.length - 1 - r ? s.applyStyle("z-index", 0) : s.applyStyle("z-index", 1);
},
arrange: function(e, t) {
var n, r, i, s;
if (this.container.getPanels().length == 1) {
s = {}, s[this.axisPosition] = this.margin, this.arrangeControl(this.container.getPanels()[0], s);
return;
}
var o = Math.floor(this.container.getPanels().length / 2), u = this.getOrderedControls(Math.floor(t) - o), a = this.containerBounds[this.axisSize] - this.margin - this.margin, f = this.margin - a * o;
for (n = 0; r = u[n]; n++) s = {}, s[this.axisPosition] = f, this.arrangeControl(r, s), f += a;
},
calcArrangementDifference: function(e, t, n, r) {
if (this.container.getPanels().length == 1) return 0;
var i = Math.abs(e % this.c$.length);
return t[i][this.axisPosition] - r[i][this.axisPosition];
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), enyo.Arranger.opacifyControl(n, 1), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.TopBottomArranger",
kind: "LeftRightArranger",
dragProp: "ddy",
dragDirectionProp: "yDirection",
canDragProp: "vertical",
axisSize: "height",
offAxisSize: "width",
axisPosition: "top"
}), enyo.kind({
name: "enyo.SpiralArranger",
kind: "Arranger",
incrementalPoints: !0,
inc: 20,
size: function() {
var e = this.container.getPanels(), t = this.containerBounds, n = this.controlWidth = t.width / 3, r = this.controlHeight = t.height / 3;
for (var i = 0, s; s = e[i]; i++) s.setBounds({
width: n,
height: r
});
},
arrange: function(e, t) {
var n = this.inc;
for (var r = 0, i = e.length, s; s = e[r]; r++) {
var o = Math.cos(r / i * 2 * Math.PI) * r * n + this.controlWidth, u = Math.sin(r / i * 2 * Math.PI) * r * n + this.controlHeight;
this.arrangeControl(s, {
left: o,
top: u
});
}
},
start: function() {
this.inherited(arguments);
var e = this.getOrderedControls(this.container.toIndex);
for (var t = 0, n; n = e[t]; t++) n.applyStyle("z-index", e.length - t);
},
calcArrangementDifference: function(e, t, n, r) {
return this.controlWidth;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.applyStyle("z-index", null), enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.GridArranger",
kind: "Arranger",
incrementalPoints: !0,
colWidth: 100,
colHeight: 100,
size: function() {
var e = this.container.getPanels(), t = this.colWidth, n = this.colHeight;
for (var r = 0, i; i = e[r]; r++) i.setBounds({
width: t,
height: n
});
},
arrange: function(e, t) {
var n = this.colWidth, r = this.colHeight, i = Math.max(1, Math.floor(this.containerBounds.width / n)), s;
for (var o = 0, u = 0; u < e.length; o++) for (var a = 0; a < i && (s = e[u]); a++, u++) this.arrangeControl(s, {
left: n * a,
top: r * o
});
},
flowControl: function(e, t) {
this.inherited(arguments), enyo.Arranger.opacifyControl(e, t.top % this.colHeight !== 0 ? .25 : 1);
},
calcArrangementDifference: function(e, t, n, r) {
return this.colWidth;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// Panels.js

enyo.kind({
name: "enyo.Panels",
classes: "enyo-panels",
published: {
index: 0,
draggable: !0,
animate: !0,
wrap: !1,
arrangerKind: "CardArranger",
narrowFit: !0
},
events: {
onTransitionStart: "",
onTransitionFinish: ""
},
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish",
onscroll: "domScroll"
},
tools: [ {
kind: "Animator",
onStep: "step",
onEnd: "completed"
} ],
fraction: 0,
create: function() {
this.transitionPoints = [], this.inherited(arguments), this.arrangerKindChanged(), this.narrowFitChanged(), this.indexChanged();
},
rendered: function() {
this.inherited(arguments), enyo.makeBubble(this, "scroll");
},
domScroll: function(e, t) {
this.hasNode() && this.node.scrollLeft > 0 && (this.node.scrollLeft = 0);
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
arrangerKindChanged: function() {
this.setLayoutKind(this.arrangerKind);
},
narrowFitChanged: function() {
this.addRemoveClass("enyo-panels-fit-narrow", this.narrowFit);
},
destroy: function() {
this.destroying = !0, this.inherited(arguments);
},
removeControl: function(e) {
this.inherited(arguments), this.destroying && this.controls.length > 0 && this.isPanel(e) && (this.setIndex(Math.max(this.index - 1, 0)), this.flow(), this.reflow());
},
isPanel: function() {
return !0;
},
flow: function() {
this.arrangements = [], this.inherited(arguments);
},
reflow: function() {
this.arrangements = [], this.inherited(arguments), this.refresh();
},
getPanels: function() {
var e = this.controlParent || this;
return e.children;
},
getActive: function() {
var e = this.getPanels(), t = this.index % e.length;
return t < 0 && (t += e.length), e[t];
},
getAnimator: function() {
return this.$.animator;
},
setIndex: function(e) {
this.setPropertyValue("index", e, "indexChanged");
},
setIndexDirect: function(e) {
this.setIndex(e), this.completed();
},
previous: function() {
this.setIndex(this.index - 1);
},
next: function() {
this.setIndex(this.index + 1);
},
clamp: function(e) {
var t = this.getPanels().length - 1;
return this.wrap ? e : Math.max(0, Math.min(e, t));
},
indexChanged: function(e) {
this.lastIndex = e, this.index = this.clamp(this.index), !this.dragging && this.$.animator && (this.$.animator.isAnimating() && this.completed(), this.$.animator.stop(), this.hasNode() && (this.animate ? (this.startTransition(), this.$.animator.play({
startValue: this.fraction
})) : this.refresh()));
},
step: function(e) {
this.fraction = e.value, this.stepTransition();
},
completed: function() {
this.$.animator.isAnimating() && this.$.animator.stop(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
dragstart: function(e, t) {
if (this.draggable && this.layout && this.layout.canDragEvent(t)) return t.preventDefault(), this.dragstartTransition(t), this.dragging = !0, this.$.animator.stop(), !0;
},
drag: function(e, t) {
this.dragging && (t.preventDefault(), this.dragTransition(t));
},
dragfinish: function(e, t) {
this.dragging && (this.dragging = !1, t.preventTap(), this.dragfinishTransition(t));
},
dragstartTransition: function(e) {
if (!this.$.animator.isAnimating()) {
var t = this.fromIndex = this.index;
this.toIndex = t - (this.layout ? this.layout.calcDragDirection(e) : 0);
} else this.verifyDragTransition(e);
this.fromIndex = this.clamp(this.fromIndex), this.toIndex = this.clamp(this.toIndex), this.fireTransitionStart(), this.layout && this.layout.start();
},
dragTransition: function(e) {
var t = this.layout ? this.layout.calcDrag(e) : 0, n = this.transitionPoints, r = n[0], i = n[n.length - 1], s = this.fetchArrangement(r), o = this.fetchArrangement(i), u = this.layout ? this.layout.drag(t, r, s, i, o) : 0, a = t && !u;
a, this.fraction += u;
var f = this.fraction;
if (f > 1 || f < 0 || a) (f > 0 || a) && this.dragfinishTransition(e), this.dragstartTransition(e), this.fraction = 0;
this.stepTransition();
},
dragfinishTransition: function(e) {
this.verifyDragTransition(e), this.setIndex(this.toIndex), this.dragging && this.fireTransitionFinish();
},
verifyDragTransition: function(e) {
var t = this.layout ? this.layout.calcDragDirection(e) : 0, n = Math.min(this.fromIndex, this.toIndex), r = Math.max(this.fromIndex, this.toIndex);
if (t > 0) {
var i = n;
n = r, r = i;
}
n != this.fromIndex && (this.fraction = 1 - this.fraction), this.fromIndex = n, this.toIndex = r;
},
refresh: function() {
this.$.animator && this.$.animator.isAnimating() && this.$.animator.stop(), this.startTransition(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
startTransition: function() {
this.fromIndex = this.fromIndex != null ? this.fromIndex : this.lastIndex || 0, this.toIndex = this.toIndex != null ? this.toIndex : this.index, this.layout && this.layout.start(), this.fireTransitionStart();
},
finishTransition: function() {
this.layout && this.layout.finish(), this.transitionPoints = [], this.fraction = 0, this.fromIndex = this.toIndex = null, this.fireTransitionFinish();
},
fireTransitionStart: function() {
var e = this.startTransitionInfo;
this.hasNode() && (!e || e.fromIndex != this.fromIndex || e.toIndex != this.toIndex) && (this.startTransitionInfo = {
fromIndex: this.fromIndex,
toIndex: this.toIndex
}, this.doTransitionStart(enyo.clone(this.startTransitionInfo)));
},
fireTransitionFinish: function() {
var e = this.finishTransitionInfo;
this.hasNode() && (!e || e.fromIndex != this.lastIndex || e.toIndex != this.index) && (this.finishTransitionInfo = {
fromIndex: this.lastIndex,
toIndex: this.index
}, this.doTransitionFinish(enyo.clone(this.finishTransitionInfo))), this.lastIndex = this.index;
},
stepTransition: function() {
if (this.hasNode()) {
var e = this.transitionPoints, t = (this.fraction || 0) * (e.length - 1), n = Math.floor(t);
t -= n;
var r = e[n], i = e[n + 1], s = this.fetchArrangement(r), o = this.fetchArrangement(i);
this.arrangement = s && o ? enyo.Panels.lerp(s, o, t) : s || o, this.arrangement && this.layout && this.layout.flowArrangement();
}
},
fetchArrangement: function(e) {
return e != null && !this.arrangements[e] && this.layout && (this.layout._arrange(e), this.arrangements[e] = this.readArrangement(this.getPanels())), this.arrangements[e];
},
readArrangement: function(e) {
var t = [];
for (var n = 0, r = e, i; i = r[n]; n++) t.push(enyo.clone(i._arranger));
return t;
},
statics: {
isScreenNarrow: function() {
return enyo.dom.getWindowWidth() <= 800;
},
lerp: function(e, t, n) {
var r = [];
for (var i = 0, s = enyo.keys(e), o; o = s[i]; i++) r.push(this.lerpObject(e[o], t[o], n));
return r;
},
lerpObject: function(e, t, n) {
var r = enyo.clone(e), i, s;
if (t) for (var o in e) i = e[o], s = t[o], i != s && (r[o] = i - (i - s) * n);
return r;
}
}
});

// Node.js

enyo.kind({
name: "enyo.Node",
published: {
expandable: !1,
expanded: !1,
icon: "",
onlyIconExpands: !1,
selected: !1
},
style: "padding: 0 0 0 16px;",
content: "Node",
defaultKind: "Node",
classes: "enyo-node",
components: [ {
name: "icon",
kind: "Image",
showing: !1
}, {
kind: "Control",
name: "caption",
Xtag: "span",
style: "display: inline-block; padding: 4px;",
allowHtml: !0
}, {
kind: "Control",
name: "extra",
tag: "span",
allowHtml: !0
} ],
childClient: [ {
kind: "Control",
name: "box",
classes: "enyo-node-box",
Xstyle: "border: 1px solid orange;",
components: [ {
kind: "Control",
name: "client",
classes: "enyo-node-client",
Xstyle: "border: 1px solid lightblue;"
} ]
} ],
handlers: {
ondblclick: "dblclick"
},
events: {
onNodeTap: "nodeTap",
onNodeDblClick: "nodeDblClick",
onExpand: "nodeExpand",
onDestroyed: "nodeDestroyed"
},
create: function() {
this.inherited(arguments), this.selectedChanged(), this.iconChanged();
},
destroy: function() {
this.doDestroyed(), this.inherited(arguments);
},
initComponents: function() {
this.expandable && (this.kindComponents = this.kindComponents.concat(this.childClient)), this.inherited(arguments);
},
contentChanged: function() {
this.$.caption.setContent(this.content);
},
iconChanged: function() {
this.$.icon.setSrc(this.icon), this.$.icon.setShowing(Boolean(this.icon));
},
selectedChanged: function() {
this.addRemoveClass("enyo-selected", this.selected);
},
rendered: function() {
this.inherited(arguments), this.expandable && !this.expanded && this.quickCollapse();
},
addNodes: function(e) {
this.destroyClientControls();
for (var t = 0, n; n = e[t]; t++) this.createComponent(n);
this.$.client.render();
},
addTextNodes: function(e) {
this.destroyClientControls();
for (var t = 0, n; n = e[t]; t++) this.createComponent({
content: n
});
this.$.client.render();
},
tap: function(e, t) {
return this.onlyIconExpands ? t.target == this.$.icon.hasNode() ? this.toggleExpanded() : this.doNodeTap() : (this.toggleExpanded(), this.doNodeTap()), !0;
},
dblclick: function(e, t) {
return this.doNodeDblClick(), !0;
},
toggleExpanded: function() {
this.setExpanded(!this.expanded);
},
quickCollapse: function() {
this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "0");
var e = this.$.client.getBounds().height;
this.$.client.setBounds({
top: -e
});
},
_expand: function() {
this.addClass("enyo-animate");
var e = this.$.client.getBounds().height;
this.$.box.setBounds({
height: e
}), this.$.client.setBounds({
top: 0
}), setTimeout(enyo.bind(this, function() {
this.expanded && (this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "auto"));
}), 225);
},
_collapse: function() {
this.removeClass("enyo-animate");
var e = this.$.client.getBounds().height;
this.$.box.setBounds({
height: e
}), setTimeout(enyo.bind(this, function() {
this.addClass("enyo-animate"), this.$.box.applyStyle("height", "0"), this.$.client.setBounds({
top: -e
});
}), 25);
},
expandedChanged: function(e) {
if (!this.expandable) this.expanded = !1; else {
var t = {
expanded: this.expanded
};
this.doExpand(t), t.wait || this.effectExpanded();
}
},
effectExpanded: function() {
this.$.client && (this.expanded ? this._expand() : this._collapse());
}
});

// ImageViewPin.js

enyo.kind({
name: "enyo.ImageViewPin",
kind: "enyo.Control",
published: {
highlightAnchorPoint: !1,
anchor: {
top: 0,
left: 0
},
position: {
top: 0,
left: 0
}
},
style: "position:absolute;z-index:1000;width:0px;height:0px;",
handlers: {
onPositionPin: "reAnchor"
},
create: function() {
this.inherited(arguments), this.styleClientControls(), this.positionClientControls(), this.highlightAnchorPointChanged(), this.anchorChanged();
},
styleClientControls: function() {
var e = this.getClientControls();
for (var t = 0; t < e.length; t++) e[t].applyStyle("position", "absolute");
},
positionClientControls: function() {
var e = this.getClientControls();
for (var t = 0; t < e.length; t++) for (var n in this.position) e[t].applyStyle(n, this.position[n] + "px");
},
highlightAnchorPointChanged: function() {
this.addRemoveClass("pinDebug", this.highlightAnchorPoint);
},
anchorChanged: function() {
var e = null, t = null;
for (t in this.anchor) {
e = this.anchor[t].toString().match(/^(\d+(?:\.\d+)?)(.*)$/);
if (!e) continue;
this.anchor[t + "Coords"] = {
value: e[1],
units: e[2] || "px"
};
}
},
reAnchor: function(e, t) {
var n = t.scale, r = t.bounds, i = this.anchor.right ? this.anchor.rightCoords.units == "px" ? r.width + r.x - this.anchor.rightCoords.value * n : r.width * (100 - this.anchor.rightCoords.value) / 100 + r.x : this.anchor.leftCoords.units == "px" ? this.anchor.leftCoords.value * n + r.x : r.width * this.anchor.leftCoords.value / 100 + r.x, s = this.anchor.bottom ? this.anchor.bottomCoords.units == "px" ? r.height + r.y - this.anchor.bottomCoords.value * n : r.height * (100 - this.anchor.bottomCoords.value) / 100 + r.y : this.anchor.topCoords.units == "px" ? this.anchor.topCoords.value * n + r.y : r.height * this.anchor.topCoords.value / 100 + r.y;
this.applyStyle("left", i + "px"), this.applyStyle("top", s + "px");
}
});

// ImageView.js

enyo.kind({
name: "enyo.ImageView",
kind: enyo.Scroller,
touchOverscroll: !1,
thumb: !1,
animate: !0,
verticalDragPropagation: !0,
horizontalDragPropagation: !0,
published: {
scale: "auto",
disableZoom: !1,
src: undefined
},
events: {
onZoom: ""
},
touch: !0,
preventDragPropagation: !1,
handlers: {
ondragstart: "dragPropagation"
},
components: [ {
name: "animator",
kind: "Animator",
onStep: "zoomAnimationStep",
onEnd: "zoomAnimationEnd"
}, {
name: "viewport",
style: "overflow:hidden;min-height:100%;min-width:100%;",
classes: "enyo-fit",
ongesturechange: "gestureTransform",
ongestureend: "saveState",
ontap: "singleTap",
ondblclick: "doubleClick",
onmousewheel: "mousewheel",
components: [ {
kind: "Image",
ondown: "down"
} ]
} ],
create: function() {
this.inherited(arguments), this.canTransform = enyo.dom.canTransform(), this.canTransform || this.$.image.applyStyle("position", "relative"), this.canAccelerate = enyo.dom.canAccelerate(), this.bufferImage = new Image, this.bufferImage.onload = enyo.bind(this, "imageLoaded"), this.bufferImage.onerror = enyo.bind(this, "imageError"), this.srcChanged(), this.getStrategy().setDragDuringGesture(!1), this.getStrategy().$.scrollMath && this.getStrategy().$.scrollMath.start();
},
down: function(e, t) {
t.preventDefault();
},
dragPropagation: function(e, t) {
var n = this.getStrategy().getScrollBounds(), r = n.top === 0 && t.dy > 0 || n.top >= n.maxTop - 2 && t.dy < 0, i = n.left === 0 && t.dx > 0 || n.left >= n.maxLeft - 2 && t.dx < 0;
return !(r && this.verticalDragPropagation || i && this.horizontalDragPropagation);
},
mousewheel: function(e, t) {
t.pageX |= t.clientX + t.target.scrollLeft, t.pageY |= t.clientY + t.target.scrollTop;
var n = (this.maxScale - this.minScale) / 10, r = this.scale;
if (t.wheelDelta > 0 || t.detail < 0) this.scale = this.limitScale(this.scale + n); else if (t.wheelDelta < 0 || t.detail > 0) this.scale = this.limitScale(this.scale - n);
return this.eventPt = this.calcEventLocation(t), this.transformImage(this.scale), r != this.scale && this.doZoom({
scale: this.scale
}), this.ratioX = this.ratioY = null, t.preventDefault(), !0;
},
srcChanged: function() {
this.src && this.src.length > 0 && this.bufferImage && this.src != this.bufferImage.src && (this.bufferImage.src = this.src);
},
imageLoaded: function(e) {
this.originalWidth = this.bufferImage.width, this.originalHeight = this.bufferImage.height, this.scaleChanged(), this.$.image.setSrc(this.bufferImage.src), enyo.dom.transformValue(this.getStrategy().$.client, "translate3d", "0px, 0px, 0"), this.positionClientControls(this.scale), this.alignImage();
},
resizeHandler: function() {
this.inherited(arguments), this.$.image.src && this.scaleChanged();
},
scaleChanged: function() {
var e = this.hasNode();
if (e) {
this.containerWidth = e.clientWidth, this.containerHeight = e.clientHeight;
var t = this.containerWidth / this.originalWidth, n = this.containerHeight / this.originalHeight;
this.minScale = Math.min(t, n), this.maxScale = this.minScale * 3 < 1 ? 1 : this.minScale * 3, this.scale == "auto" ? this.scale = this.minScale : this.scale == "width" ? this.scale = t : this.scale == "height" ? this.scale = n : this.scale == "fit" ? (this.fitAlignment = "center", this.scale = Math.max(t, n)) : (this.maxScale = Math.max(this.maxScale, this.scale), this.scale = this.limitScale(this.scale));
}
this.eventPt = this.calcEventLocation(), this.transformImage(this.scale);
},
imageError: function(e) {
enyo.error("Error loading image: " + this.src), this.bubble("onerror", e);
},
alignImage: function() {
if (this.fitAlignment && this.fitAlignment === "center") {
var e = this.getScrollBounds();
this.setScrollLeft(e.maxLeft / 2), this.setScrollTop(e.maxTop / 2);
}
},
gestureTransform: function(e, t) {
this.eventPt = this.calcEventLocation(t), this.transformImage(this.limitScale(this.scale * t.scale));
},
calcEventLocation: function(e) {
var t = {
x: 0,
y: 0
};
if (e && this.hasNode()) {
var n = this.node.getBoundingClientRect();
t.x = Math.round(e.pageX - n.left - this.imageBounds.x), t.x = Math.max(0, Math.min(this.imageBounds.width, t.x)), t.y = Math.round(e.pageY - n.top - this.imageBounds.y), t.y = Math.max(0, Math.min(this.imageBounds.height, t.y));
}
return t;
},
transformImage: function(e) {
this.tapped = !1;
var t = this.imageBounds || this.innerImageBounds(e);
this.imageBounds = this.innerImageBounds(e), this.scale > this.minScale ? this.$.viewport.applyStyle("cursor", "move") : this.$.viewport.applyStyle("cursor", null), this.$.viewport.setBounds({
width: this.imageBounds.width + "px",
height: this.imageBounds.height + "px"
}), this.ratioX = this.ratioX || (this.eventPt.x + this.getScrollLeft()) / t.width, this.ratioY = this.ratioY || (this.eventPt.y + this.getScrollTop()) / t.height;
var n, r;
this.$.animator.ratioLock ? (n = this.$.animator.ratioLock.x * this.imageBounds.width - this.containerWidth / 2, r = this.$.animator.ratioLock.y * this.imageBounds.height - this.containerHeight / 2) : (n = this.ratioX * this.imageBounds.width - this.eventPt.x, r = this.ratioY * this.imageBounds.height - this.eventPt.y), n = Math.max(0, Math.min(this.imageBounds.width - this.containerWidth, n)), r = Math.max(0, Math.min(this.imageBounds.height - this.containerHeight, r));
if (this.canTransform) {
var i = {
scale: e
};
this.canAccelerate ? i = enyo.mixin({
translate3d: Math.round(this.imageBounds.left) + "px, " + Math.round(this.imageBounds.top) + "px, 0px"
}, i) : i = enyo.mixin({
translate: this.imageBounds.left + "px, " + this.imageBounds.top + "px"
}, i), enyo.dom.transform(this.$.image, i);
} else this.$.image.setBounds({
width: this.imageBounds.width + "px",
height: this.imageBounds.height + "px",
left: this.imageBounds.left + "px",
top: this.imageBounds.top + "px"
});
this.setScrollLeft(n), this.setScrollTop(r), this.positionClientControls(e);
},
limitScale: function(e) {
return this.disableZoom ? e = this.scale : e > this.maxScale ? e = this.maxScale : e < this.minScale && (e = this.minScale), e;
},
innerImageBounds: function(e) {
var t = this.originalWidth * e, n = this.originalHeight * e, r = {
x: 0,
y: 0,
transX: 0,
transY: 0
};
return t < this.containerWidth && (r.x += (this.containerWidth - t) / 2), n < this.containerHeight && (r.y += (this.containerHeight - n) / 2), this.canTransform && (r.transX -= (this.originalWidth - t) / 2, r.transY -= (this.originalHeight - n) / 2), {
left: r.x + r.transX,
top: r.y + r.transY,
width: t,
height: n,
x: r.x,
y: r.y
};
},
saveState: function(e, t) {
var n = this.scale;
this.scale *= t.scale, this.scale = this.limitScale(this.scale), n != this.scale && this.doZoom({
scale: this.scale
}), this.ratioX = this.ratioY = null;
},
doubleClick: function(e, t) {
enyo.platform.ie == 8 && (this.tapped = !0, t.pageX = t.clientX + t.target.scrollLeft, t.pageY = t.clientY + t.target.scrollTop, this.singleTap(e, t), t.preventDefault());
},
singleTap: function(e, t) {
setTimeout(enyo.bind(this, function() {
this.tapped = !1;
}), 300), this.tapped ? (this.tapped = !1, this.smartZoom(e, t)) : this.tapped = !0;
},
smartZoom: function(e, t) {
var n = this.hasNode(), r = this.$.image.hasNode();
if (n && r && this.hasNode() && !this.disableZoom) {
var i = this.scale;
this.scale != this.minScale ? this.scale = this.minScale : this.scale = this.maxScale, this.eventPt = this.calcEventLocation(t);
if (this.animate) {
var s = {
x: (this.eventPt.x + this.getScrollLeft()) / this.imageBounds.width,
y: (this.eventPt.y + this.getScrollTop()) / this.imageBounds.height
};
this.$.animator.play({
duration: 350,
ratioLock: s,
baseScale: i,
deltaScale: this.scale - i
});
} else this.transformImage(this.scale), this.doZoom({
scale: this.scale
});
}
},
zoomAnimationStep: function(e, t) {
var n = this.$.animator.baseScale + this.$.animator.deltaScale * this.$.animator.value;
this.transformImage(n);
},
zoomAnimationEnd: function(e, t) {
this.doZoom({
scale: this.scale
}), this.$.animator.ratioLock = undefined;
},
positionClientControls: function(e) {
this.waterfallDown("onPositionPin", {
scale: e,
bounds: this.imageBounds
});
}
});

// ImageCarousel.js

enyo.kind({
name: "enyo.ImageCarousel",
kind: enyo.Panels,
arrangerKind: "enyo.CarouselArranger",
defaultScale: "auto",
disableZoom: !1,
lowMemory: !1,
published: {
images: []
},
handlers: {
onTransitionStart: "transitionStart",
onTransitionFinish: "transitionFinish"
},
create: function() {
this.inherited(arguments), this.imageCount = this.images.length, this.images.length > 0 && (this.initContainers(), this.loadNearby());
},
initContainers: function() {
for (var e = 0; e < this.images.length; e++) this.$["container" + e] || (this.createComponent({
name: "container" + e,
style: "height:100%; width:100%;"
}), this.$["container" + e].render());
for (e = this.images.length; e < this.imageCount; e++) this.$["image" + e] && this.$["image" + e].destroy(), this.$["container" + e].destroy();
this.imageCount = this.images.length;
},
loadNearby: function() {
var e = this.getBufferRange();
for (var t in e) this.loadImageView(e[t]);
},
getBufferRange: function() {
var e = [];
if (this.layout.containerBounds) {
var t = 1, n = this.layout.containerBounds, r, i, s, o, u, a;
o = this.index - 1, u = 0, a = n.width * t;
while (o >= 0 && u <= a) s = this.$["container" + o], u += s.width + s.marginWidth, e.unshift(o), o--;
o = this.index, u = 0, a = n.width * (t + 1);
while (o < this.images.length && u <= a) s = this.$["container" + o], u += s.width + s.marginWidth, e.push(o), o++;
}
return e;
},
reflow: function() {
this.inherited(arguments), this.loadNearby();
},
loadImageView: function(e) {
return this.wrap && (e = (e % this.images.length + this.images.length) % this.images.length), e >= 0 && e <= this.images.length - 1 && (this.$["image" + e] ? this.$["image" + e].src != this.images[e] && (this.$["image" + e].setSrc(this.images[e]), this.$["image" + e].setScale(this.defaultScale), this.$["image" + e].setDisableZoom(this.disableZoom)) : (this.$["container" + e].createComponent({
name: "image" + e,
kind: "ImageView",
scale: this.defaultScale,
disableZoom: this.disableZoom,
src: this.images[e],
verticalDragPropagation: !1,
style: "height:100%; width:100%;"
}, {
owner: this
}), this.$["image" + e].render())), this.$["image" + e];
},
setImages: function(e) {
this.setPropertyValue("images", e, "imagesChanged");
},
imagesChanged: function() {
this.initContainers(), this.loadNearby();
},
indexChanged: function() {
this.loadNearby(), this.lowMemory && this.cleanupMemory(), this.inherited(arguments);
},
transitionStart: function(e, t) {
if (t.fromIndex == t.toIndex) return !0;
},
transitionFinish: function(e, t) {
this.loadNearby(), this.lowMemory && this.cleanupMemory();
},
getActiveImage: function() {
return this.getImageByIndex(this.index);
},
getImageByIndex: function(e) {
return this.$["image" + e] || this.loadImageView(e);
},
cleanupMemory: function() {
var e = getBufferRange();
for (var t = 0; t < this.images.length; t++) enyo.indexOf(t, e) === -1 && this.$["image" + t] && this.$["image" + t].destroy();
}
});

// Icon.js

enyo.kind({
name: "onyx.Icon",
published: {
src: "",
disabled: !1
},
classes: "onyx-icon",
create: function() {
this.inherited(arguments), this.src && this.srcChanged(), this.disabledChanged();
},
disabledChanged: function() {
this.addRemoveClass("disabled", this.disabled);
},
srcChanged: function() {
this.applyStyle("background-image", "url(" + enyo.path.rewrite(this.src) + ")");
}
});

// Button.js

enyo.kind({
name: "onyx.Button",
kind: "enyo.Button",
classes: "onyx-button enyo-unselectable",
create: function() {
enyo.platform.firefoxOS && (this.handlers.ondown = "down", this.handlers.onleave = "leave"), this.inherited(arguments);
},
down: function(e, t) {
this.addClass("pressed");
},
leave: function(e, t) {
this.removeClass("pressed");
}
});

// IconButton.js

enyo.kind({
name: "onyx.IconButton",
kind: "onyx.Icon",
published: {
active: !1
},
classes: "onyx-icon-button",
create: function() {
enyo.platform.firefoxOS && (this.handlers.ondown = "down", this.handlers.onleave = "leave"), this.inherited(arguments);
},
down: function(e, t) {
this.addClass("pressed");
},
leave: function(e, t) {
this.removeClass("pressed");
},
rendered: function() {
this.inherited(arguments), this.activeChanged();
},
tap: function() {
if (this.disabled) return !0;
this.setActive(!0);
},
activeChanged: function() {
this.bubble("onActivate");
}
});

// Checkbox.js

enyo.kind({
name: "onyx.Checkbox",
classes: "onyx-checkbox",
kind: enyo.Checkbox,
tag: "div",
handlers: {
onclick: ""
},
tap: function(e, t) {
return this.disabled || (this.setChecked(!this.getChecked()), this.bubble("onchange")), !this.disabled;
},
dragstart: function() {}
});

// Drawer.js

enyo.kind({
name: "onyx.Drawer",
published: {
open: !0,
orient: "v",
animated: !0
},
style: "overflow: hidden; position: relative;",
tools: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorEnd"
}, {
name: "client",
style: "position: relative;",
classes: "enyo-border-box"
} ],
create: function() {
this.inherited(arguments), this.animatedChanged(), this.openChanged();
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
animatedChanged: function() {
!this.animated && this.hasNode() && this.$.animator.isAnimating() && (this.$.animator.stop(), this.animatorEnd());
},
openChanged: function() {
this.$.client.show();
if (this.hasNode()) if (this.$.animator.isAnimating()) this.$.animator.reverse(); else {
var e = this.orient == "v", t = e ? "height" : "width", n = e ? "top" : "left";
this.applyStyle(t, null);
var r = this.hasNode()[e ? "scrollHeight" : "scrollWidth"];
this.animated ? this.$.animator.play({
startValue: this.open ? 0 : r,
endValue: this.open ? r : 0,
dimension: t,
position: n
}) : this.animatorEnd();
} else this.$.client.setShowing(this.open);
},
animatorStep: function(e) {
if (this.hasNode()) {
var t = e.dimension;
this.node.style[t] = this.domStyles[t] = e.value + "px";
}
var n = this.$.client.hasNode();
if (n) {
var r = e.position, i = this.open ? e.endValue : e.startValue;
n.style[r] = this.$.client.domStyles[r] = e.value - i + "px";
}
this.container && this.container.resized();
},
animatorEnd: function() {
if (!this.open) this.$.client.hide(); else {
this.$.client.domCssText = enyo.Control.domStylesToCssText(this.$.client.domStyles);
var e = this.orient == "v", t = e ? "height" : "width", n = e ? "top" : "left", r = this.$.client.hasNode();
r && (r.style[n] = this.$.client.domStyles[n] = null), this.node && (this.node.style[t] = this.domStyles[t] = null);
}
this.container && this.container.resized();
}
});

// Grabber.js

enyo.kind({
name: "onyx.Grabber",
classes: "onyx-grabber"
});

// Groupbox.js

enyo.kind({
name: "onyx.Groupbox",
classes: "onyx-groupbox"
}), enyo.kind({
name: "onyx.GroupboxHeader",
classes: "onyx-groupbox-header"
});

// Input.js

enyo.kind({
name: "onyx.Input",
kind: "enyo.Input",
classes: "onyx-input"
});

// Popup.js

enyo.kind({
name: "onyx.Popup",
kind: "Popup",
classes: "onyx-popup",
published: {
scrimWhenModal: !0,
scrim: !1,
scrimClassName: ""
},
statics: {
count: 0
},
defaultZ: 120,
showingChanged: function() {
this.showing ? (onyx.Popup.count++, this.applyZIndex()) : onyx.Popup.count > 0 && onyx.Popup.count--, this.showHideScrim(this.showing), this.inherited(arguments);
},
showHideScrim: function(e) {
if (this.floating && (this.scrim || this.modal && this.scrimWhenModal)) {
var t = this.getScrim();
if (e) {
var n = this.getScrimZIndex();
this._scrimZ = n, t.showAtZIndex(n);
} else t.hideAtZIndex(this._scrimZ);
enyo.call(t, "addRemoveClass", [ this.scrimClassName, t.showing ]);
}
},
getScrimZIndex: function() {
return this.findZIndex() - 1;
},
getScrim: function() {
return this.modal && this.scrimWhenModal && !this.scrim ? onyx.scrimTransparent.make() : onyx.scrim.make();
},
applyZIndex: function() {
this._zIndex = onyx.Popup.count * 2 + this.findZIndex() + 1, this.applyStyle("z-index", this._zIndex);
},
findZIndex: function() {
var e = this.defaultZ;
return this._zIndex ? e = this._zIndex : this.hasNode() && (e = Number(enyo.dom.getComputedStyleValue(this.node, "z-index")) || e), this._zIndex = e;
}
});

// TextArea.js

enyo.kind({
name: "onyx.TextArea",
kind: "enyo.TextArea",
classes: "onyx-textarea"
});

// RichText.js

enyo.kind({
name: "onyx.RichText",
kind: "enyo.RichText",
classes: "onyx-richtext"
});

// InputDecorator.js

enyo.kind({
name: "onyx.InputDecorator",
kind: "enyo.ToolDecorator",
tag: "label",
classes: "onyx-input-decorator",
published: {
alwaysLooksFocused: !1
},
handlers: {
onDisabledChange: "disabledChange",
onfocus: "receiveFocus",
onblur: "receiveBlur"
},
create: function() {
this.inherited(arguments), this.updateFocus(!1);
},
alwaysLooksFocusedChanged: function(e) {
this.updateFocus(this.focus);
},
updateFocus: function(e) {
this.focused = e, this.addRemoveClass("onyx-focused", this.alwaysLooksFocused || this.focused);
},
receiveFocus: function() {
this.updateFocus(!0);
},
receiveBlur: function() {
this.updateFocus(!1);
},
disabledChange: function(e, t) {
this.addRemoveClass("onyx-disabled", t.originator.disabled);
}
});

// Tooltip.js

enyo.kind({
name: "onyx.Tooltip",
kind: "onyx.Popup",
classes: "onyx-tooltip below left-arrow",
autoDismiss: !1,
showDelay: 500,
defaultLeft: -6,
handlers: {
onRequestShowTooltip: "requestShow",
onRequestHideTooltip: "requestHide"
},
requestShow: function() {
return this.showJob = setTimeout(enyo.bind(this, "show"), this.showDelay), !0;
},
cancelShow: function() {
clearTimeout(this.showJob);
},
requestHide: function() {
return this.cancelShow(), this.inherited(arguments);
},
showingChanged: function() {
this.cancelShow(), this.adjustPosition(!0), this.inherited(arguments);
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
adjustPosition: function(e) {
if (this.showing && this.hasNode()) {
var t = this.node.getBoundingClientRect();
t.top + t.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), t.left + t.width > window.innerWidth && (this.applyPosition({
"margin-left": -t.width,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !1), this.addRemoveClass("right-arrow", !0));
}
},
resizeHandler: function() {
this.applyPosition({
"margin-left": this.defaultLeft,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !0), this.addRemoveClass("right-arrow", !1), this.adjustPosition(!0), this.inherited(arguments);
}
});

// TooltipDecorator.js

enyo.kind({
name: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator",
handlers: {
onenter: "enter",
onleave: "leave"
},
enter: function() {
this.requestShowTooltip();
},
leave: function() {
this.requestHideTooltip();
},
tap: function() {
this.requestHideTooltip();
},
requestShowTooltip: function() {
this.waterfallDown("onRequestShowTooltip");
},
requestHideTooltip: function() {
this.waterfallDown("onRequestHideTooltip");
}
});

// MenuDecorator.js

enyo.kind({
name: "onyx.MenuDecorator",
kind: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator enyo-unselectable",
handlers: {
onActivate: "activated",
onHide: "menuHidden"
},
activated: function(e, t) {
this.requestHideTooltip(), t.originator.active && (this.menuActive = !0, this.activator = t.originator, this.activator.addClass("active"), this.requestShowMenu());
},
requestShowMenu: function() {
this.waterfallDown("onRequestShowMenu", {
activator: this.activator
});
},
requestHideMenu: function() {
this.waterfallDown("onRequestHideMenu");
},
menuHidden: function() {
this.menuActive = !1, this.activator && (this.activator.setActive(!1), this.activator.removeClass("active"));
},
enter: function(e) {
this.menuActive || this.inherited(arguments);
},
leave: function(e, t) {
this.menuActive || this.inherited(arguments);
}
});

// Menu.js

enyo.kind({
name: "onyx.Menu",
kind: "onyx.Popup",
modal: !0,
defaultKind: "onyx.MenuItem",
classes: "onyx-menu",
published: {
maxHeight: 200,
scrolling: !0
},
handlers: {
onActivate: "itemActivated",
onRequestShowMenu: "requestMenuShow",
onRequestHideMenu: "requestHide"
},
childComponents: [ {
name: "client",
kind: "enyo.Scroller",
strategyKind: "TouchScrollStrategy"
} ],
showOnTop: !1,
scrollerName: "client",
create: function() {
this.inherited(arguments), this.maxHeightChanged();
},
initComponents: function() {
this.scrolling && this.createComponents(this.childComponents, {
isChrome: !0
}), this.inherited(arguments);
},
getScroller: function() {
return this.$[this.scrollerName];
},
maxHeightChanged: function() {
this.scrolling && this.getScroller().setMaxHeight(this.maxHeight + "px");
},
itemActivated: function(e, t) {
return t.originator.setActive(!1), !0;
},
showingChanged: function() {
this.inherited(arguments), this.scrolling && this.getScroller().setShowing(this.showing), this.adjustPosition(!0);
},
requestMenuShow: function(e, t) {
if (this.floating) {
var n = t.activator.hasNode();
if (n) {
var r = this.activatorOffset = this.getPageOffset(n);
this.applyPosition({
top: r.top + (this.showOnTop ? 0 : r.height),
left: r.left,
width: r.width
});
}
}
return this.show(), !0;
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
getPageOffset: function(e) {
var t = e.getBoundingClientRect(), n = window.pageYOffset === undefined ? document.documentElement.scrollTop : window.pageYOffset, r = window.pageXOffset === undefined ? document.documentElement.scrollLeft : window.pageXOffset, i = t.height === undefined ? t.bottom - t.top : t.height, s = t.width === undefined ? t.right - t.left : t.width;
return {
top: t.top + n,
left: t.left + r,
height: i,
width: s
};
},
adjustPosition: function() {
if (this.showing && this.hasNode()) {
this.scrolling && !this.showOnTop && this.getScroller().setMaxHeight(this.maxHeight + "px"), this.removeClass("onyx-menu-up"), this.floating || this.applyPosition({
left: "auto"
});
var e = this.node.getBoundingClientRect(), t = e.height === undefined ? e.bottom - e.top : e.height, n = window.innerHeight === undefined ? document.documentElement.clientHeight : window.innerHeight, r = window.innerWidth === undefined ? document.documentElement.clientWidth : window.innerWidth;
this.menuUp = e.top + t > n && n - e.bottom < e.top - t, this.addRemoveClass("onyx-menu-up", this.menuUp);
if (this.floating) {
var i = this.activatorOffset;
this.menuUp ? this.applyPosition({
top: i.top - t + (this.showOnTop ? i.height : 0),
bottom: "auto"
}) : e.top < i.top && i.top + (this.showOnTop ? 0 : i.height) + t < n && this.applyPosition({
top: i.top + (this.showOnTop ? 0 : i.height),
bottom: "auto"
});
}
e.right > r && (this.floating ? this.applyPosition({
left: r - e.width
}) : this.applyPosition({
left: -(e.right - r)
})), e.left < 0 && (this.floating ? this.applyPosition({
left: 0,
right: "auto"
}) : this.getComputedStyleValue("right") == "auto" ? this.applyPosition({
left: -e.left
}) : this.applyPosition({
right: e.left
}));
if (this.scrolling && !this.showOnTop) {
e = this.node.getBoundingClientRect();
var s;
this.menuUp ? s = this.maxHeight < e.bottom ? this.maxHeight : e.bottom : s = e.top + this.maxHeight < n ? this.maxHeight : n - e.top, this.getScroller().setMaxHeight(s + "px");
}
}
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
},
requestHide: function() {
this.setShowing(!1);
}
});

// MenuItem.js

enyo.kind({
name: "onyx.MenuItem",
kind: "enyo.Button",
events: {
onSelect: "",
onItemContentChange: ""
},
classes: "onyx-menu-item",
tag: "div",
create: function() {
this.inherited(arguments), this.active && this.bubble("onActivate");
},
tap: function(e) {
this.inherited(arguments), this.bubble("onRequestHideMenu"), this.doSelect({
selected: this,
content: this.content
});
},
contentChanged: function(e) {
this.inherited(arguments), this.doItemContentChange({
content: this.content
});
}
});

// PickerDecorator.js

enyo.kind({
name: "onyx.PickerDecorator",
kind: "onyx.MenuDecorator",
classes: "onyx-picker-decorator",
defaultKind: "onyx.PickerButton",
handlers: {
onChange: "change"
},
change: function(e, t) {
this.waterfallDown("onChange", t);
}
});

// PickerButton.js

enyo.kind({
name: "onyx.PickerButton",
kind: "onyx.Button",
handlers: {
onChange: "change"
},
change: function(e, t) {
t.content !== undefined && this.setContent(t.content);
}
});

// Picker.js

enyo.kind({
name: "onyx.Picker",
kind: "onyx.Menu",
classes: "onyx-picker enyo-unselectable",
published: {
selected: null
},
events: {
onChange: ""
},
handlers: {
onItemContentChange: "itemContentChange"
},
floating: !0,
showOnTop: !0,
initComponents: function() {
this.setScrolling(!0), this.inherited(arguments);
},
showingChanged: function() {
this.getScroller().setShowing(this.showing), this.inherited(arguments), this.showing && this.selected && this.scrollToSelected();
},
scrollToSelected: function() {
this.getScroller().scrollToControl(this.selected, !this.menuUp);
},
itemActivated: function(e, t) {
return this.processActivatedItem(t.originator), this.inherited(arguments);
},
processActivatedItem: function(e) {
e.active && this.setSelected(e);
},
selectedChanged: function(e) {
e && e.removeClass("selected"), this.selected && (this.selected.addClass("selected"), this.doChange({
selected: this.selected,
content: this.selected.content
}));
},
itemContentChange: function(e, t) {
t.originator == this.selected && this.doChange({
selected: this.selected,
content: this.selected.content
});
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
}
});

// FlyweightPicker.js

enyo.kind({
name: "onyx.FlyweightPicker",
kind: "onyx.Picker",
classes: "onyx-flyweight-picker",
published: {
count: 0
},
events: {
onSetupItem: "",
onSelect: ""
},
handlers: {
onSelect: "itemSelect"
},
components: [ {
name: "scroller",
kind: "enyo.Scroller",
strategyKind: "TouchScrollStrategy",
components: [ {
name: "flyweight",
kind: "FlyweightRepeater",
noSelect: !0,
ontap: "itemTap"
} ]
} ],
scrollerName: "scroller",
initComponents: function() {
this.controlParentName = "flyweight", this.inherited(arguments), this.$.flyweight.$.client.children[0].setActive(!0);
},
create: function() {
this.inherited(arguments), this.countChanged();
},
rendered: function() {
this.inherited(arguments), this.selectedChanged();
},
scrollToSelected: function() {
var e = this.$.flyweight.fetchRowNode(this.selected);
this.getScroller().scrollToNode(e, !this.menuUp);
},
countChanged: function() {
this.$.flyweight.count = this.count;
},
processActivatedItem: function(e) {
this.item = e;
},
selectedChanged: function(e) {
if (!this.item) return;
e != null && (this.item.removeClass("selected"), this.$.flyweight.renderRow(e));
var t;
this.selected != null && (this.item.addClass("selected"), this.$.flyweight.renderRow(this.selected), this.item.removeClass("selected"), t = this.$.flyweight.fetchRowNode(this.selected)), this.doChange({
selected: this.selected,
content: t && t.textContent || this.item.content
});
},
itemTap: function(e, t) {
this.setSelected(t.rowIndex), this.doSelect({
selected: this.item,
content: this.item.content
});
},
itemSelect: function(e, t) {
if (t.originator != this) return !0;
}
});

// DatePicker.js

enyo.kind({
name: "onyx.DatePicker",
classes: "onyx-toolbar-inline",
published: {
disabled: !1,
locale: "en_us",
dayHidden: !1,
monthHidden: !1,
yearHidden: !1,
minYear: 1900,
maxYear: 2099,
value: null
},
events: {
onSelect: ""
},
create: function() {
this.inherited(arguments), enyo.g11n && (this.locale = enyo.g11n.currentLocale().getLocale()), this.initDefaults();
},
initDefaults: function() {
var e = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];
enyo.g11n && (this._tf = new enyo.g11n.Fmts({
locale: this.locale
}), e = this._tf.getMonthFields()), this.setupPickers(this._tf ? this._tf.getDateFieldOrder() : "mdy"), this.dayHiddenChanged(), this.monthHiddenChanged(), this.yearHiddenChanged();
var t = this.value = this.value || new Date;
for (var n = 0, r; r = e[n]; n++) this.$.monthPicker.createComponent({
content: r,
value: n,
active: n == t.getMonth()
});
var i = t.getFullYear();
this.$.yearPicker.setSelected(i - this.minYear);
for (n = 1; n <= this.monthLength(t.getYear(), t.getMonth()); n++) this.$.dayPicker.createComponent({
content: n,
value: n,
active: n == t.getDate()
});
},
monthLength: function(e, t) {
return 32 - (new Date(e, t, 32)).getDate();
},
setupYear: function(e, t) {
this.$.year.setContent(this.minYear + t.index);
},
setupPickers: function(e) {
var t = e.split(""), n, r, i;
for (r = 0, i = t.length; r < i; r++) {
n = t[r];
switch (n) {
case "d":
this.createDay();
break;
case "m":
this.createMonth();
break;
case "y":
this.createYear();
break;
default:
}
}
},
createYear: function() {
var e = this.maxYear - this.minYear;
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateYear",
components: [ {
classes: "onyx-datepicker-year",
name: "yearPickerButton",
disabled: this.disabled
}, {
name: "yearPicker",
kind: "onyx.FlyweightPicker",
count: ++e,
onSetupItem: "setupYear",
components: [ {
name: "year"
} ]
} ]
});
},
createMonth: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateMonth",
components: [ {
classes: "onyx-datepicker-month",
name: "monthPickerButton",
disabled: this.disabled
}, {
name: "monthPicker",
kind: "onyx.Picker"
} ]
});
},
createDay: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateDay",
components: [ {
classes: "onyx-datepicker-day",
name: "dayPickerButton",
disabled: this.disabled
}, {
name: "dayPicker",
kind: "onyx.Picker"
} ]
});
},
localeChanged: function() {
this.refresh();
},
dayHiddenChanged: function() {
this.$.dayPicker.getParent().setShowing(this.dayHidden ? !1 : !0);
},
monthHiddenChanged: function() {
this.$.monthPicker.getParent().setShowing(this.monthHidden ? !1 : !0);
},
yearHiddenChanged: function() {
this.$.yearPicker.getParent().setShowing(this.yearHidden ? !1 : !0);
},
minYearChanged: function() {
this.refresh();
},
maxYearChanged: function() {
this.refresh();
},
valueChanged: function() {
this.refresh();
},
disabledChanged: function() {
this.$.yearPickerButton.setDisabled(this.disabled), this.$.monthPickerButton.setDisabled(this.disabled), this.$.dayPickerButton.setDisabled(this.disabled);
},
updateDay: function(e, t) {
var n = this.calcDate(this.value.getFullYear(), this.value.getMonth(), t.selected.value);
return this.doSelect({
name: this.name,
value: n
}), this.setValue(n), !0;
},
updateMonth: function(e, t) {
var n = this.calcDate(this.value.getFullYear(), t.selected.value, this.value.getDate());
return this.doSelect({
name: this.name,
value: n
}), this.setValue(n), !0;
},
updateYear: function(e, t) {
if (t.originator.selected != -1) {
var n = this.calcDate(this.minYear + t.originator.selected, this.value.getMonth(), this.value.getDate());
this.doSelect({
name: this.name,
value: n
}), this.setValue(n);
}
return !0;
},
calcDate: function(e, t, n) {
return new Date(e, t, n, this.value.getHours(), this.value.getMinutes(), this.value.getSeconds(), this.value.getMilliseconds());
},
refresh: function() {
this.destroyClientControls(), this.initDefaults(), this.render();
}
});

// TimePicker.js

enyo.kind({
name: "onyx.TimePicker",
classes: "onyx-toolbar-inline",
published: {
disabled: !1,
locale: "en_us",
is24HrMode: null,
value: null
},
events: {
onSelect: ""
},
create: function() {
this.inherited(arguments), enyo.g11n && (this.locale = enyo.g11n.currentLocale().getLocale()), this.initDefaults();
},
initDefaults: function() {
var e = "AM", t = "PM";
this.is24HrMode == null && (this.is24HrMode = !1), enyo.g11n && (this._tf = new enyo.g11n.Fmts({
locale: this.locale
}), e = this._tf.getAmCaption(), t = this._tf.getPmCaption(), this.is24HrMode == null && (this.is24HrMode = !this._tf.isAmPm())), this.setupPickers(this._tf ? this._tf.getTimeFieldOrder() : "hma");
var n = this.value = this.value || new Date, r;
if (!this.is24HrMode) {
var i = n.getHours();
i = i === 0 ? 12 : i;
for (r = 1; r <= 12; r++) this.$.hourPicker.createComponent({
content: r,
value: r,
active: r == (i > 12 ? i % 12 : i)
});
} else for (r = 0; r < 24; r++) this.$.hourPicker.createComponent({
content: r,
value: r,
active: r == n.getHours()
});
for (r = 0; r <= 59; r++) this.$.minutePicker.createComponent({
content: r < 10 ? "0" + r : r,
value: r,
active: r == n.getMinutes()
});
n.getHours() >= 12 ? this.$.ampmPicker.createComponents([ {
content: e
}, {
content: t,
active: !0
} ]) : this.$.ampmPicker.createComponents([ {
content: e,
active: !0
}, {
content: t
} ]), this.$.ampmPicker.getParent().setShowing(!this.is24HrMode);
},
setupPickers: function(e) {
var t = e.split(""), n, r, i;
for (r = 0, i = t.length; r < i; r++) {
n = t[r];
switch (n) {
case "h":
this.createHour();
break;
case "m":
this.createMinute();
break;
case "a":
this.createAmPm();
break;
default:
}
}
},
createHour: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateHour",
components: [ {
classes: "onyx-timepicker-hour",
name: "hourPickerButton",
disabled: this.disabled
}, {
name: "hourPicker",
kind: "onyx.Picker"
} ]
});
},
createMinute: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateMinute",
components: [ {
classes: "onyx-timepicker-minute",
name: "minutePickerButton",
disabled: this.disabled
}, {
name: "minutePicker",
kind: "onyx.Picker"
} ]
});
},
createAmPm: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateAmPm",
components: [ {
classes: "onyx-timepicker-ampm",
name: "ampmPickerButton",
disabled: this.disabled
}, {
name: "ampmPicker",
kind: "onyx.Picker"
} ]
});
},
disabledChanged: function() {
this.$.hourPickerButton.setDisabled(this.disabled), this.$.minutePickerButton.setDisabled(this.disabled), this.$.ampmPickerButton.setDisabled(this.disabled);
},
localeChanged: function() {
this.is24HrMode = null, this.refresh();
},
is24HrModeChanged: function() {
this.refresh();
},
valueChanged: function() {
this.refresh();
},
updateHour: function(e, t) {
var n = t.selected.value;
if (!this.is24HrMode) {
var r = this.$.ampmPicker.getParent().controlAtIndex(0).content;
n = n + (n == 12 ? -12 : 0) + (this.isAm(r) ? 0 : 12);
}
return this.value = this.calcTime(n, this.value.getMinutes()), this.doSelect({
name: this.name,
value: this.value
}), !0;
},
updateMinute: function(e, t) {
return this.value = this.calcTime(this.value.getHours(), t.selected.value), this.doSelect({
name: this.name,
value: this.value
}), !0;
},
updateAmPm: function(e, t) {
var n = this.value.getHours();
return this.is24HrMode || (n += n > 11 ? this.isAm(t.content) ? -12 : 0 : this.isAm(t.content) ? 0 : 12), this.value = this.calcTime(n, this.value.getMinutes()), this.doSelect({
name: this.name,
value: this.value
}), !0;
},
calcTime: function(e, t) {
return new Date(this.value.getFullYear(), this.value.getMonth(), this.value.getDate(), e, t, this.value.getSeconds(), this.value.getMilliseconds());
},
isAm: function(e) {
var t, n, r;
try {
t = this._tf.getAmCaption(), n = this._tf.getPmCaption();
} catch (i) {
t = "AM", n = "PM";
}
return e == t ? !0 : !1;
},
refresh: function() {
this.destroyClientControls(), this.initDefaults(), this.render();
}
});

// RadioButton.js

enyo.kind({
name: "onyx.RadioButton",
kind: "Button",
classes: "onyx-radiobutton"
});

// RadioGroup.js

enyo.kind({
name: "onyx.RadioGroup",
kind: "Group",
defaultKind: "onyx.RadioButton",
highlander: !0
});

// ToggleButton.js

enyo.kind({
name: "onyx.ToggleButton",
classes: "onyx-toggle-button",
published: {
active: !1,
value: !1,
onContent: "On",
offContent: "Off",
disabled: !1
},
events: {
onChange: ""
},
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
components: [ {
name: "contentOn",
classes: "onyx-toggle-content on"
}, {
name: "contentOff",
classes: "onyx-toggle-content off"
}, {
classes: "onyx-toggle-button-knob"
} ],
create: function() {
this.inherited(arguments), this.value = Boolean(this.value || this.active), this.onContentChanged(), this.offContentChanged(), this.disabledChanged();
},
rendered: function() {
this.inherited(arguments), this.updateVisualState();
},
updateVisualState: function() {
this.addRemoveClass("off", !this.value), this.$.contentOn.setShowing(this.value), this.$.contentOff.setShowing(!this.value), this.setActive(this.value);
},
valueChanged: function() {
this.updateVisualState(), this.doChange({
value: this.value
});
},
activeChanged: function() {
this.setValue(this.active), this.bubble("onActivate");
},
onContentChanged: function() {
this.$.contentOn.setContent(this.onContent || ""), this.$.contentOn.addRemoveClass("empty", !this.onContent);
},
offContentChanged: function() {
this.$.contentOff.setContent(this.offContent || ""), this.$.contentOff.addRemoveClass("empty", !this.onContent);
},
disabledChanged: function() {
this.addRemoveClass("disabled", this.disabled);
},
updateValue: function(e) {
this.disabled || this.setValue(e);
},
tap: function() {
this.updateValue(!this.value);
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, this.dragged = !1, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = t.dx;
return Math.abs(n) > 10 && (this.updateValue(n > 0), this.dragged = !0), !0;
}
},
dragfinish: function(e, t) {
this.dragging = !1, this.dragged && t.preventTap();
}
});

// ToggleIconButton.js

enyo.kind({
name: "onyx.ToggleIconButton",
kind: "onyx.Icon",
published: {
active: !1,
value: !1
},
events: {
onChange: ""
},
classes: "onyx-icon-button onyx-icon-toggle",
activeChanged: function() {
this.addRemoveClass("active", this.value), this.bubble("onActivate");
},
updateValue: function(e) {
this.disabled || (this.setValue(e), this.doChange({
value: this.value
}));
},
tap: function() {
this.updateValue(!this.value);
},
valueChanged: function() {
this.setActive(this.value);
},
create: function() {
this.inherited(arguments), this.value = Boolean(this.value || this.active);
},
rendered: function() {
this.inherited(arguments), this.valueChanged(), this.removeClass("onyx-icon");
}
});

// Toolbar.js

enyo.kind({
name: "onyx.Toolbar",
classes: "onyx onyx-toolbar onyx-toolbar-inline",
create: function() {
this.inherited(arguments), this.hasClass("onyx-menu-toolbar") && enyo.platform.android >= 4 && this.applyStyle("position", "static");
}
});

// Tooltip.js

enyo.kind({
name: "onyx.Tooltip",
kind: "onyx.Popup",
classes: "onyx-tooltip below left-arrow",
autoDismiss: !1,
showDelay: 500,
defaultLeft: -6,
handlers: {
onRequestShowTooltip: "requestShow",
onRequestHideTooltip: "requestHide"
},
requestShow: function() {
return this.showJob = setTimeout(enyo.bind(this, "show"), this.showDelay), !0;
},
cancelShow: function() {
clearTimeout(this.showJob);
},
requestHide: function() {
return this.cancelShow(), this.inherited(arguments);
},
showingChanged: function() {
this.cancelShow(), this.adjustPosition(!0), this.inherited(arguments);
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
adjustPosition: function(e) {
if (this.showing && this.hasNode()) {
var t = this.node.getBoundingClientRect();
t.top + t.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), t.left + t.width > window.innerWidth && (this.applyPosition({
"margin-left": -t.width,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !1), this.addRemoveClass("right-arrow", !0));
}
},
resizeHandler: function() {
this.applyPosition({
"margin-left": this.defaultLeft,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !0), this.addRemoveClass("right-arrow", !1), this.adjustPosition(!0), this.inherited(arguments);
}
});

// TooltipDecorator.js

enyo.kind({
name: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator",
handlers: {
onenter: "enter",
onleave: "leave"
},
enter: function() {
this.requestShowTooltip();
},
leave: function() {
this.requestHideTooltip();
},
tap: function() {
this.requestHideTooltip();
},
requestShowTooltip: function() {
this.waterfallDown("onRequestShowTooltip");
},
requestHideTooltip: function() {
this.waterfallDown("onRequestHideTooltip");
}
});

// ProgressBar.js

enyo.kind({
name: "onyx.ProgressBar",
classes: "onyx-progress-bar",
published: {
progress: 0,
min: 0,
max: 100,
barClasses: "",
showStripes: !0,
animateStripes: !0,
increment: 0
},
events: {
onAnimateProgressFinish: ""
},
components: [ {
name: "progressAnimator",
kind: "Animator",
onStep: "progressAnimatorStep",
onEnd: "progressAnimatorComplete"
}, {
name: "bar",
classes: "onyx-progress-bar-bar"
} ],
create: function() {
this.inherited(arguments), this.progressChanged(), this.barClassesChanged(), this.showStripesChanged(), this.animateStripesChanged();
},
barClassesChanged: function(e) {
this.$.bar.removeClass(e), this.$.bar.addClass(this.barClasses);
},
showStripesChanged: function() {
this.$.bar.addRemoveClass("striped", this.showStripes);
},
animateStripesChanged: function() {
this.$.bar.addRemoveClass("animated", this.animateStripes);
},
progressChanged: function() {
this.progress = this.clampValue(this.min, this.max, this.progress);
var e = this.calcPercent(this.progress);
this.updateBarPosition(e);
},
calcIncrement: function(e) {
return Math.round(e / this.increment) * this.increment;
},
clampValue: function(e, t, n) {
return Math.max(e, Math.min(n, t));
},
calcRatio: function(e) {
return (e - this.min) / (this.max - this.min);
},
calcPercent: function(e) {
return this.calcRatio(e) * 100;
},
updateBarPosition: function(e) {
this.$.bar.applyStyle("width", e + "%");
},
animateProgressTo: function(e) {
this.$.progressAnimator.play({
startValue: this.progress,
endValue: e,
node: this.hasNode()
});
},
progressAnimatorStep: function(e) {
return this.setProgress(e.value), !0;
},
progressAnimatorComplete: function(e) {
return this.doAnimateProgressFinish(e), !0;
}
});

// ProgressButton.js

enyo.kind({
name: "onyx.ProgressButton",
kind: "onyx.ProgressBar",
classes: "onyx-progress-button",
events: {
onCancel: ""
},
components: [ {
name: "progressAnimator",
kind: "Animator",
onStep: "progressAnimatorStep",
onEnd: "progressAnimatorComplete"
}, {
name: "bar",
classes: "onyx-progress-bar-bar onyx-progress-button-bar"
}, {
name: "client",
classes: "onyx-progress-button-client"
}, {
kind: "onyx.Icon",
src: "$lib/onyx/images/progress-button-cancel.png",
classes: "onyx-progress-button-icon",
ontap: "cancelTap"
} ],
cancelTap: function() {
this.doCancel();
}
});

// Scrim.js

enyo.kind({
name: "onyx.Scrim",
showing: !1,
classes: "onyx-scrim enyo-fit",
floating: !1,
create: function() {
this.inherited(arguments), this.zStack = [], this.floating && this.setParent(enyo.floatingLayer);
},
showingChanged: function() {
this.floating && this.showing && !this.hasNode() && this.render(), this.inherited(arguments);
},
addZIndex: function(e) {
enyo.indexOf(e, this.zStack) < 0 && this.zStack.push(e);
},
removeZIndex: function(e) {
enyo.remove(e, this.zStack);
},
showAtZIndex: function(e) {
this.addZIndex(e), e !== undefined && this.setZIndex(e), this.show();
},
hideAtZIndex: function(e) {
this.removeZIndex(e);
if (!this.zStack.length) this.hide(); else {
var t = this.zStack[this.zStack.length - 1];
this.setZIndex(t);
}
},
setZIndex: function(e) {
this.zIndex = e, this.applyStyle("z-index", e);
},
make: function() {
return this;
}
}), enyo.kind({
name: "onyx.scrimSingleton",
kind: null,
constructor: function(e, t) {
this.instanceName = e, enyo.setObject(this.instanceName, this), this.props = t || {};
},
make: function() {
var e = new onyx.Scrim(this.props);
return enyo.setObject(this.instanceName, e), e;
},
showAtZIndex: function(e) {
var t = this.make();
t.showAtZIndex(e);
},
hideAtZIndex: enyo.nop,
show: function() {
var e = this.make();
e.show();
}
}), new onyx.scrimSingleton("onyx.scrim", {
floating: !0,
classes: "onyx-scrim-translucent"
}), new onyx.scrimSingleton("onyx.scrimTransparent", {
floating: !0,
classes: "onyx-scrim-transparent"
});

// Slider.js

enyo.kind({
name: "onyx.Slider",
kind: "onyx.ProgressBar",
classes: "onyx-slider",
published: {
value: 0,
lockBar: !0,
tappable: !0
},
events: {
onChange: "",
onChanging: "",
onAnimateFinish: ""
},
showStripes: !1,
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
moreComponents: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorComplete"
}, {
classes: "onyx-slider-taparea"
}, {
name: "knob",
classes: "onyx-slider-knob"
} ],
create: function() {
this.inherited(arguments), enyo.platform.firefoxOS && (this.moreComponents[2].ondown = "down", this.moreComponents[2].onleave = "leave"), this.createComponents(this.moreComponents), this.valueChanged();
},
valueChanged: function() {
this.value = this.clampValue(this.min, this.max, this.value);
var e = this.calcPercent(this.value);
this.updateKnobPosition(e), this.lockBar && this.setProgress(this.value);
},
updateKnobPosition: function(e) {
this.$.knob.applyStyle("left", e + "%");
},
calcKnobPosition: function(e) {
var t = e.clientX - this.hasNode().getBoundingClientRect().left;
return t / this.getBounds().width * (this.max - this.min) + this.min;
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = this.calcKnobPosition(t);
return n = this.increment ? this.calcIncrement(n) : n, this.setValue(n), this.doChanging({
value: this.value
}), !0;
}
},
dragfinish: function(e, t) {
return this.dragging = !1, t.preventTap(), this.doChange({
value: this.value
}), !0;
},
tap: function(e, t) {
if (this.tappable) {
var n = this.calcKnobPosition(t);
return n = this.increment ? this.calcIncrement(n) : n, this.tapped = !0, this.animateTo(n), !0;
}
},
down: function(e, t) {
this.addClass("pressed");
},
leave: function(e, t) {
this.removeClass("pressed");
},
animateTo: function(e) {
this.$.animator.play({
startValue: this.value,
endValue: e,
node: this.hasNode()
});
},
animatorStep: function(e) {
return this.setValue(e.value), !0;
},
animatorComplete: function(e) {
return this.tapped && (this.tapped = !1, this.doChange({
value: this.value
})), this.doAnimateFinish(e), !0;
}
});

// RangeSlider.js

enyo.kind({
name: "onyx.RangeSlider",
kind: "onyx.ProgressBar",
classes: "onyx-slider",
published: {
rangeMin: 0,
rangeMax: 100,
rangeStart: 0,
rangeEnd: 100,
beginValue: 0,
endValue: 0
},
events: {
onChange: "",
onChanging: ""
},
showStripes: !1,
showLabels: !1,
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish",
ondown: "down"
},
moreComponents: [ {
name: "startKnob",
classes: "onyx-slider-knob"
}, {
name: "endKnob",
classes: "onyx-slider-knob onyx-range-slider-knob"
} ],
create: function() {
this.inherited(arguments), this.createComponents(this.moreComponents), this.initControls();
},
rendered: function() {
this.inherited(arguments);
var e = this.calcPercent(this.beginValue);
this.updateBarPosition(e);
},
initControls: function() {
this.$.bar.applyStyle("position", "relative"), this.refreshRangeSlider(), this.showLabels && (this.$.startKnob.createComponent({
name: "startLabel",
kind: "onyx.RangeSliderKnobLabel"
}), this.$.endKnob.createComponent({
name: "endLabel",
kind: "onyx.RangeSliderKnobLabel"
}));
},
refreshRangeSlider: function() {
this.beginValue = this.calcKnobPercent(this.rangeStart), this.endValue = this.calcKnobPercent(this.rangeEnd), this.beginValueChanged(), this.endValueChanged();
},
calcKnobRatio: function(e) {
return (e - this.rangeMin) / (this.rangeMax - this.rangeMin);
},
calcKnobPercent: function(e) {
return this.calcKnobRatio(e) * 100;
},
beginValueChanged: function(e) {
if (e === undefined) {
var t = this.calcPercent(this.beginValue);
this.updateKnobPosition(t, this.$.startKnob);
}
},
endValueChanged: function(e) {
if (e === undefined) {
var t = this.calcPercent(this.endValue);
this.updateKnobPosition(t, this.$.endKnob);
}
},
calcKnobPosition: function(e) {
var t = e.clientX - this.hasNode().getBoundingClientRect().left;
return t / this.getBounds().width * (this.max - this.min) + this.min;
},
updateKnobPosition: function(e, t) {
t.applyStyle("left", e + "%"), this.updateBarPosition();
},
updateBarPosition: function() {
if (this.$.startKnob !== undefined && this.$.endKnob !== undefined) {
var e = this.calcKnobPercent(this.rangeStart), t = this.calcKnobPercent(this.rangeEnd) - e;
this.$.bar.applyStyle("left", e + "%"), this.$.bar.applyStyle("width", t + "%");
}
},
calcRangeRatio: function(e) {
return e / 100 * (this.rangeMax - this.rangeMin) + this.rangeMin - this.increment / 2;
},
swapZIndex: function(e) {
e === "startKnob" ? (this.$.startKnob.applyStyle("z-index", 1), this.$.endKnob.applyStyle("z-index", 0)) : e === "endKnob" && (this.$.startKnob.applyStyle("z-index", 0), this.$.endKnob.applyStyle("z-index", 1));
},
down: function(e, t) {
this.swapZIndex(e.name);
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = this.calcKnobPosition(t), r, i, s;
if (e.name === "startKnob" && n >= 0) {
if (!(n <= this.endValue && t.xDirection === -1 || n <= this.endValue)) return this.drag(this.$.endKnob, t);
this.setBeginValue(n), r = this.calcRangeRatio(this.beginValue), i = this.increment ? this.calcIncrement(r + .5 * this.increment) : r, s = this.calcKnobPercent(i), this.updateKnobPosition(s, this.$.startKnob), this.setRangeStart(i), this.doChanging({
value: i
});
} else if (e.name === "endKnob" && n <= 100) {
if (!(n >= this.beginValue && t.xDirection === 1 || n >= this.beginValue)) return this.drag(this.$.startKnob, t);
this.setEndValue(n), r = this.calcRangeRatio(this.endValue), i = this.increment ? this.calcIncrement(r + .5 * this.increment) : r, s = this.calcKnobPercent(i), this.updateKnobPosition(s, this.$.endKnob), this.setRangeEnd(i), this.doChanging({
value: i
});
}
return !0;
}
},
dragfinish: function(e, t) {
this.dragging = !1, t.preventTap();
var n;
return e.name === "startKnob" ? (n = this.calcRangeRatio(this.beginValue), this.doChange({
value: n,
startChanged: !0
})) : e.name === "endKnob" && (n = this.calcRangeRatio(this.endValue), this.doChange({
value: n,
startChanged: !1
})), !0;
},
rangeMinChanged: function() {
this.refreshRangeSlider();
},
rangeMaxChanged: function() {
this.refreshRangeSlider();
},
rangeStartChanged: function() {
this.refreshRangeSlider();
},
rangeEndChanged: function() {
this.refreshRangeSlider();
},
setStartLabel: function(e) {
this.$.startKnob.waterfallDown("onSetLabel", e);
},
setEndLabel: function(e) {
this.$.endKnob.waterfallDown("onSetLabel", e);
}
}), enyo.kind({
name: "onyx.RangeSliderKnobLabel",
classes: "onyx-range-slider-label",
handlers: {
onSetLabel: "setLabel"
},
setLabel: function(e, t) {
this.setContent(t);
}
});

// Item.js

enyo.kind({
name: "onyx.Item",
classes: "onyx-item",
tapHighlight: !0,
handlers: {
onhold: "hold",
onrelease: "release"
},
hold: function(e, t) {
this.tapHighlight && onyx.Item.addRemoveFlyweightClass(this.controlParent || this, "onyx-highlight", !0, t);
},
release: function(e, t) {
this.tapHighlight && onyx.Item.addRemoveFlyweightClass(this.controlParent || this, "onyx-highlight", !1, t);
},
statics: {
addRemoveFlyweightClass: function(e, t, n, r, i) {
var s = r.flyweight;
if (s) {
var o = i !== undefined ? i : r.index;
s.performOnRow(o, function() {
e.addRemoveClass(t, n);
});
}
}
}
});

// Spinner.js

enyo.kind({
name: "onyx.Spinner",
classes: "onyx-spinner",
stop: function() {
this.setShowing(!1);
},
start: function() {
this.setShowing(!0);
},
toggle: function() {
this.setShowing(!this.getShowing());
}
});

// MoreToolbar.js

enyo.kind({
name: "onyx.MoreToolbar",
classes: "onyx-toolbar onyx-more-toolbar",
menuClass: "",
movedClass: "",
layoutKind: "FittableColumnsLayout",
noStretch: !0,
handlers: {
onHide: "reflow"
},
published: {
clientLayoutKind: "FittableColumnsLayout"
},
tools: [ {
name: "client",
noStretch: !0,
fit: !0,
classes: "onyx-toolbar-inline"
}, {
name: "nard",
kind: "onyx.MenuDecorator",
showing: !1,
onActivate: "activated",
components: [ {
kind: "onyx.IconButton",
classes: "onyx-more-button"
}, {
name: "menu",
kind: "onyx.Menu",
scrolling: !1,
classes: "onyx-more-menu"
} ]
} ],
initComponents: function() {
this.menuClass && this.menuClass.length > 0 && !this.$.menu.hasClass(this.menuClass) && this.$.menu.addClass(this.menuClass), this.createChrome(this.tools), this.inherited(arguments), this.$.client.setLayoutKind(this.clientLayoutKind);
},
clientLayoutKindChanged: function() {
this.$.client.setLayoutKind(this.clientLayoutKind);
},
reflow: function() {
this.inherited(arguments), this.isContentOverflowing() ? (this.$.nard.show(), this.popItem() && this.reflow()) : this.tryPushItem() ? this.reflow() : this.$.menu.children.length || (this.$.nard.hide(), this.$.menu.hide());
},
activated: function(e, t) {
this.addRemoveClass("active", t.originator.active);
},
popItem: function() {
var e = this.findCollapsibleItem();
if (e) {
this.movedClass && this.movedClass.length > 0 && !e.hasClass(this.movedClass) && e.addClass(this.movedClass), this.$.menu.addChild(e, null);
var t = this.$.menu.hasNode();
return t && e.hasNode() && e.insertNodeInParent(t), !0;
}
},
pushItem: function() {
var e = this.$.menu.children, t = e[0];
if (t) {
this.movedClass && this.movedClass.length > 0 && t.hasClass(this.movedClass) && t.removeClass(this.movedClass), this.$.client.addChild(t);
var n = this.$.client.hasNode();
if (n && t.hasNode()) {
var r, i;
for (var s = 0; s < this.$.client.children.length; s++) {
var o = this.$.client.children[s];
if (o.toolbarIndex !== undefined && o.toolbarIndex != s) {
r = o, i = s;
break;
}
}
if (r && r.hasNode()) {
t.insertNodeInParent(n, r.node);
var u = this.$.client.children.pop();
this.$.client.children.splice(i, 0, u);
} else t.appendNodeToParent(n);
}
return !0;
}
},
tryPushItem: function() {
if (this.pushItem()) {
if (!this.isContentOverflowing()) return !0;
this.popItem();
}
},
isContentOverflowing: function() {
if (this.$.client.hasNode()) {
var e = this.$.client.children, t = e[e.length - 1].hasNode();
if (t) return this.$.client.reflow(), t.offsetLeft + t.offsetWidth > this.$.client.node.clientWidth;
}
},
findCollapsibleItem: function() {
var e = this.$.client.children;
for (var t = e.length - 1; c = e[t]; t--) {
if (!c.unmoveable) return c;
c.toolbarIndex === undefined && (c.toolbarIndex = t);
}
}
});

// IntegerPicker.js

enyo.kind({
name: "onyx.IntegerPicker",
kind: "onyx.Picker",
published: {
value: 0,
min: 0,
max: 9
},
create: function() {
this.inherited(arguments), this.rangeChanged();
},
minChanged: function() {
this.destroyClientControls(), this.rangeChanged(), this.render();
},
maxChanged: function() {
this.destroyClientControls(), this.rangeChanged(), this.render();
},
rangeChanged: function() {
for (var e = this.min; e <= this.max; e++) this.createComponent({
content: e,
active: e === this.value ? !0 : !1
});
},
valueChanged: function(e) {
var t = this.getClientControls(), n = t.length;
this.value = this.value >= this.min && this.value <= this.max ? this.value : this.min;
for (var r = 0; r < n; r++) if (this.value === parseInt(t[r].content)) {
this.setSelected(t[r]);
break;
}
},
selectedChanged: function(e) {
e && e.removeClass("selected"), this.selected && (this.selected.addClass("selected"), this.doChange({
selected: this.selected,
content: this.selected.content
})), this.value = parseInt(this.selected.content);
}
});

// ContextualPopup.js

enyo.kind({
name: "onyx.ContextualPopup",
kind: "enyo.Popup",
modal: !0,
autoDismiss: !0,
floating: !1,
classes: "onyx-contextual-popup enyo-unselectable",
published: {
maxHeight: 100,
scrolling: !0,
title: undefined,
actionButtons: []
},
vertFlushMargin: 60,
horizFlushMargin: 50,
widePopup: 200,
longPopup: 200,
horizBuffer: 16,
events: {
onTap: ""
},
handlers: {
onActivate: "itemActivated",
onRequestShowMenu: "requestShow",
onRequestHideMenu: "requestHide"
},
components: [ {
name: "title",
classes: "onyx-contextual-popup-title"
}, {
classes: "onyx-contextual-popup-scroller",
components: [ {
name: "client",
kind: "enyo.Scroller",
vertical: "auto",
classes: "enyo-unselectable",
thumb: !1,
strategyKind: "TouchScrollStrategy"
} ]
}, {
name: "actionButtons",
classes: "onyx-contextual-popup-action-buttons"
} ],
scrollerName: "client",
create: function() {
this.inherited(arguments), this.maxHeightChanged(), this.titleChanged(), this.actionButtonsChanged();
},
getScroller: function() {
return this.$[this.scrollerName];
},
titleChanged: function() {
this.$.title.setContent(this.title);
},
actionButtonsChanged: function() {
for (var e = 0; e < this.actionButtons.length; e++) this.$.actionButtons.createComponent({
kind: "onyx.Button",
content: this.actionButtons[e].content,
classes: this.actionButtons[e].classes + " onyx-contextual-popup-action-button",
name: this.actionButtons[e].name ? this.actionButtons[e].name : "ActionButton" + e,
index: e,
tap: enyo.bind(this, this.tapHandler)
});
},
tapHandler: function(e, t) {
return t.actionButton = !0, t.popup = this, this.bubble("ontap", t), !0;
},
maxHeightChanged: function() {
this.scrolling && this.getScroller().setMaxHeight(this.maxHeight + "px");
},
itemActivated: function(e, t) {
return t.originator.setActive(!1), !0;
},
showingChanged: function() {
this.inherited(arguments), this.scrolling && this.getScroller().setShowing(this.showing), this.adjustPosition();
},
requestShow: function(e, t) {
var n = t.activator.hasNode();
return n && (this.activatorOffset = this.getPageOffset(n)), this.show(), !0;
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
getPageOffset: function(e) {
var t = this.getBoundingRect(e), n = window.pageYOffset === undefined ? document.documentElement.scrollTop : window.pageYOffset, r = window.pageXOffset === undefined ? document.documentElement.scrollLeft : window.pageXOffset, i = t.height === undefined ? t.bottom - t.top : t.height, s = t.width === undefined ? t.right - t.left : t.width;
return {
top: t.top + n,
left: t.left + r,
height: i,
width: s
};
},
adjustPosition: function() {
if (this.showing && this.hasNode()) {
this.resetPositioning();
var e = this.getViewWidth(), t = this.getViewHeight(), n = this.vertFlushMargin, r = t - this.vertFlushMargin, i = this.horizFlushMargin, s = e - this.horizFlushMargin;
if (this.activatorOffset.top + this.activatorOffset.height < n || this.activatorOffset.top > r) {
if (this.applyVerticalFlushPositioning(i, s)) return;
if (this.applyHorizontalFlushPositioning(i, s)) return;
if (this.applyVerticalPositioning()) return;
} else if (this.activatorOffset.left + this.activatorOffset.width < i || this.activatorOffset.left > s) if (this.applyHorizontalPositioning()) return;
var o = this.getBoundingRect(this.node);
if (o.width > this.widePopup) {
if (this.applyVerticalPositioning()) return;
} else if (o.height > this.longPopup && this.applyHorizontalPositioning()) return;
if (this.applyVerticalPositioning()) return;
if (this.applyHorizontalPositioning()) return;
}
},
initVerticalPositioning: function() {
this.resetPositioning(), this.addClass("vertical");
var e = this.getBoundingRect(this.node), t = this.getViewHeight();
return this.floating ? this.activatorOffset.top < t / 2 ? (this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height,
bottom: "auto"
}), this.addClass("below")) : (this.applyPosition({
top: this.activatorOffset.top - e.height,
bottom: "auto"
}), this.addClass("above")) : e.top + e.height > t && t - e.bottom < e.top - e.height ? this.addClass("above") : this.addClass("below"), e = this.getBoundingRect(this.node), e.top + e.height > t || e.top < 0 ? !1 : !0;
},
applyVerticalPositioning: function() {
if (!this.initVerticalPositioning()) return !1;
var e = this.getBoundingRect(this.node), t = this.getViewWidth();
if (this.floating) {
var n = this.activatorOffset.left + this.activatorOffset.width / 2 - e.width / 2;
n + e.width > t ? (this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width - e.width
}), this.addClass("left")) : n < 0 ? (this.applyPosition({
left: this.activatorOffset.left
}), this.addClass("right")) : this.applyPosition({
left: n
});
} else {
var r = this.activatorOffset.left + this.activatorOffset.width / 2 - e.left - e.width / 2;
e.right + r > t ? (this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width - e.right
}), this.addRemoveClass("left", !0)) : e.left + r < 0 ? this.addRemoveClass("right", !0) : this.applyPosition({
left: r
});
}
return !0;
},
applyVerticalFlushPositioning: function(e, t) {
if (!this.initVerticalPositioning()) return !1;
var n = this.getBoundingRect(this.node), r = this.getViewWidth();
return this.activatorOffset.left + this.activatorOffset.width / 2 < e ? (this.activatorOffset.left + this.activatorOffset.width / 2 < this.horizBuffer ? this.applyPosition({
left: this.horizBuffer + (this.floating ? 0 : -n.left)
}) : this.applyPosition({
left: this.activatorOffset.width / 2 + (this.floating ? this.activatorOffset.left : 0)
}), this.addClass("right"), this.addClass("corner"), !0) : this.activatorOffset.left + this.activatorOffset.width / 2 > t ? (this.activatorOffset.left + this.activatorOffset.width / 2 > r - this.horizBuffer ? this.applyPosition({
left: r - this.horizBuffer - n.right
}) : this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width / 2 - n.right
}), this.addClass("left"), this.addClass("corner"), !0) : !1;
},
initHorizontalPositioning: function() {
this.resetPositioning();
var e = this.getBoundingRect(this.node), t = this.getViewWidth();
return this.floating ? this.activatorOffset.left + this.activatorOffset.width < t / 2 ? (this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width
}), this.addRemoveClass("left", !0)) : (this.applyPosition({
left: this.activatorOffset.left - e.width
}), this.addRemoveClass("right", !0)) : this.activatorOffset.left - e.width > 0 ? (this.applyPosition({
left: this.activatorOffset.left - e.left - e.width
}), this.addRemoveClass("right", !0)) : (this.applyPosition({
left: this.activatorOffset.width
}), this.addRemoveClass("left", !0)), this.addRemoveClass("horizontal", !0), e = this.getBoundingRect(this.node), e.left < 0 || e.left + e.width > t ? !1 : !0;
},
applyHorizontalPositioning: function() {
if (!this.initHorizontalPositioning()) return !1;
var e = this.getBoundingRect(this.node), t = this.getViewHeight(), n = this.activatorOffset.top + this.activatorOffset.height / 2;
return this.floating ? n >= t / 2 - .05 * t && n <= t / 2 + .05 * t ? this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height / 2 - e.height / 2,
bottom: "auto"
}) : this.activatorOffset.top + this.activatorOffset.height < t / 2 ? (this.applyPosition({
top: this.activatorOffset.top - this.activatorOffset.height,
bottom: "auto"
}), this.addRemoveClass("high", !0)) : (this.applyPosition({
top: this.activatorOffset.top - e.height + this.activatorOffset.height * 2,
bottom: "auto"
}), this.addRemoveClass("low", !0)) : n >= t / 2 - .05 * t && n <= t / 2 + .05 * t ? this.applyPosition({
top: (this.activatorOffset.height - e.height) / 2
}) : this.activatorOffset.top + this.activatorOffset.height < t / 2 ? (this.applyPosition({
top: -this.activatorOffset.height
}), this.addRemoveClass("high", !0)) : (this.applyPosition({
top: e.top - e.height - this.activatorOffset.top + this.activatorOffset.height
}), this.addRemoveClass("low", !0)), !0;
},
applyHorizontalFlushPositioning: function(e, t) {
if (!this.initHorizontalPositioning()) return !1;
var n = this.getBoundingRect(this.node), r = this.getViewWidth();
return this.floating ? this.activatorOffset.top < innerHeight / 2 ? (this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height / 2
}), this.addRemoveClass("high", !0)) : (this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height / 2 - n.height
}), this.addRemoveClass("low", !0)) : n.top + n.height > innerHeight && innerHeight - n.bottom < n.top - n.height ? (this.applyPosition({
top: n.top - n.height - this.activatorOffset.top - this.activatorOffset.height / 2
}), this.addRemoveClass("low", !0)) : (this.applyPosition({
top: this.activatorOffset.height / 2
}), this.addRemoveClass("high", !0)), this.activatorOffset.left + this.activatorOffset.width < e ? (this.addClass("left"), this.addClass("corner"), !0) : this.activatorOffset.left > t ? (this.addClass("right"), this.addClass("corner"), !0) : !1;
},
getBoundingRect: function(e) {
var t = e.getBoundingClientRect();
return !t.width || !t.height ? {
left: t.left,
right: t.right,
top: t.top,
bottom: t.bottom,
width: t.right - t.left,
height: t.bottom - t.top
} : t;
},
getViewHeight: function() {
return window.innerHeight === undefined ? document.documentElement.clientHeight : window.innerHeight;
},
getViewWidth: function() {
return window.innerWidth === undefined ? document.documentElement.clientWidth : window.innerWidth;
},
resetPositioning: function() {
this.removeClass("right"), this.removeClass("left"), this.removeClass("high"), this.removeClass("low"), this.removeClass("corner"), this.removeClass("below"), this.removeClass("above"), this.removeClass("vertical"), this.removeClass("horizontal"), this.applyPosition({
left: "auto"
}), this.applyPosition({
top: "auto"
});
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
},
requestHide: function() {
this.setShowing(!1);
}
});

// javascript/g11n.js

if (!this.enyo) {
this.enyo = {};
var empty = {};
enyo.mixin = function(e, t) {
e = e || {};
if (t) {
var n, r;
for (n in t) r = t[n], empty[n] !== r && (e[n] = r);
}
return e;
};
}

"trim" in String.prototype || (String.prototype.trim = function() {
return this.replace(/^\s+|\s+$/g, "");
}), enyo.g11n = function() {}, enyo.g11n._init = function() {
if (!enyo.g11n._initialized) {
typeof window != "undefined" ? (enyo.g11n._platform = "browser", enyo.g11n._enyoAvailable = !0) : (enyo.g11n._platform = "node", enyo.g11n._enyoAvailable = !1);
if (navigator) {
var t = (navigator.language || navigator.userLanguage).replace(/-/g, "_").toLowerCase();
enyo.g11n._locale = new enyo.g11n.Locale(t), enyo.g11n._formatLocale = enyo.g11n._locale, enyo.g11n._phoneLocale = enyo.g11n._locale;
}
enyo.g11n._locale === undefined && (enyo.warn("enyo.g11n._init: could not find current locale, so using default of en_us."), enyo.g11n._locale = new enyo.g11n.Locale("en_us")), enyo.g11n._formatLocale === undefined && (enyo.warn("enyo.g11n._init: could not find current formats locale, so using default of us."), enyo.g11n._formatLocale = new enyo.g11n.Locale("en_us")), enyo.g11n._phoneLocale === undefined && (enyo.warn("enyo.g11n._init: could not find current phone locale, so defaulting to the same thing as the formats locale."), enyo.g11n._phoneLocale = enyo.g11n._formatLocale), enyo.g11n._sourceLocale === undefined && (enyo.g11n._sourceLocale = new enyo.g11n.Locale("en_us")), enyo.g11n._initialized = !0;
}
}, enyo.g11n.getPlatform = function() {
return enyo.g11n._platform || enyo.g11n._init(), enyo.g11n._platform;
}, enyo.g11n.isEnyoAvailable = function() {
return enyo.g11n._enyoAvailable || enyo.g11n._init(), enyo.g11n._enyoAvailable;
}, enyo.g11n.currentLocale = function() {
return enyo.g11n._locale || enyo.g11n._init(), enyo.g11n._locale;
}, enyo.g11n.formatLocale = function() {
return enyo.g11n._formatLocale || enyo.g11n._init(), enyo.g11n._formatLocale;
}, enyo.g11n.phoneLocale = function() {
return enyo.g11n._phoneLocale || enyo.g11n._init(), enyo.g11n._phoneLocale;
}, enyo.g11n.sourceLocale = function() {
return enyo.g11n._sourceLocale || enyo.g11n._init(), enyo.g11n._sourceLocale;
}, enyo.g11n.setLocale = function(t) {
t && (enyo.g11n._init(), t.uiLocale && (enyo.g11n._locale = new enyo.g11n.Locale(t.uiLocale)), t.formatLocale && (enyo.g11n._formatLocale = new enyo.g11n.Locale(t.formatLocale)), t.phoneLocale && (enyo.g11n._phoneLocale = new enyo.g11n.Locale(t.phoneLocale)), t.sourceLocale && (enyo.g11n._sourceLocale = new enyo.g11n.Locale(t.sourceLocale)), enyo.g11n._enyoAvailable && enyo.reloadG11nResources());
};

// javascript/fmts.js

enyo.g11n.Fmts = function(t) {
var n;
typeof t == "undefined" || !t.locale ? this.locale = enyo.g11n.formatLocale() : typeof t.locale == "string" ? this.locale = new enyo.g11n.Locale(t.locale) : this.locale = t.locale, this.dateTimeFormatHash = enyo.g11n.Utils.getJsonFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/formats",
locale: this.locale,
type: "region"
}), this.dateTimeHash = enyo.g11n.Utils.getJsonFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/datetime_data",
locale: this.locale
}), this.dateTimeHash || (this.dateTimeHash = enyo.g11n.Utils.getJsonFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/datetime_data",
locale: enyo.g11n.currentLocale()
})), this.dateTimeHash || (this.dateTimeHash = enyo.g11n.Utils.getJsonFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/datetime_data",
locale: new enyo.g11n.Locale("en_us")
}));
}, enyo.g11n.Fmts.prototype.isAmPm = function() {
return typeof this.twelveHourFormat == "undefined" && (this.twelveHourFormat = this.dateTimeFormatHash.is12HourDefault), this.twelveHourFormat;
}, enyo.g11n.Fmts.prototype.isAmPmDefault = function() {
return this.dateTimeFormatHash.is12HourDefault;
}, enyo.g11n.Fmts.prototype.getFirstDayOfWeek = function() {
return this.dateTimeFormatHash.firstDayOfWeek;
}, enyo.g11n.Fmts.prototype.getDateFieldOrder = function() {
return this.dateTimeFormatHash ? this.dateTimeFormatHash.dateFieldOrder : (enyo.warn("Failed to load date time format hash"), "mdy");
}, enyo.g11n.Fmts.prototype.getTimeFieldOrder = function() {
return this.dateTimeFormatHash ? this.dateTimeFormatHash.timeFieldOrder : (enyo.warn("Failed to load date time format hash"), "hma");
}, enyo.g11n.Fmts.prototype.getMonthFields = function() {
return this.dateTimeHash ? this.dateTimeHash.medium.month : [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
}, enyo.g11n.Fmts.prototype.getAmCaption = function() {
return this.dateTimeHash ? this.dateTimeHash.am : (enyo.error("Failed to load dateTimeHash."), "AM");
}, enyo.g11n.Fmts.prototype.getPmCaption = function() {
return this.dateTimeHash ? this.dateTimeHash.pm : (enyo.error("Failed to load dateTimeHash."), "PM");
}, enyo.g11n.Fmts.prototype.getMeasurementSystem = function() {
return this.dateTimeFormatHash && this.dateTimeFormatHash.measurementSystem || "metric";
}, enyo.g11n.Fmts.prototype.getDefaultPaperSize = function() {
return this.dateTimeFormatHash && this.dateTimeFormatHash.defaultPaperSize || "A4";
}, enyo.g11n.Fmts.prototype.getDefaultPhotoSize = function() {
return this.dateTimeFormatHash && this.dateTimeFormatHash.defaultPhotoSize || "10X15CM";
}, enyo.g11n.Fmts.prototype.getDefaultTimeZone = function() {
return this.dateTimeFormatHash && this.dateTimeFormatHash.defaultTimeZone || "Europe/London";
}, enyo.g11n.Fmts.prototype.isAsianScript = function() {
return this.dateTimeFormatHash && typeof this.dateTimeFormatHash.asianScript != "undefined" ? this.dateTimeFormatHash.asianScript : !1;
}, enyo.g11n.Fmts.prototype.isHanTraditional = function() {
return this.dateTimeFormatHash && typeof this.dateTimeFormatHash.scriptStyle != "undefined" ? this.dateTimeFormatHash.scriptStyle === "traditional" : !1;
}, enyo.g11n.Fmts.prototype.textDirection = function() {
return this.dateTimeFormatHash && this.dateTimeFormatHash.scriptDirection || "ltr";
};

// javascript/locale.js

enyo.g11n.Locale = function(t) {
var n = t ? t.split(/_/) : [];
return this.locale = t, this.language = n[0] || undefined, this.region = n[1] ? n[1].toLowerCase() : undefined, this.variant = n[2] ? n[2].toLowerCase() : undefined, this;
}, enyo.g11n.Locale.prototype.getLocale = function() {
return this.locale;
}, enyo.g11n.Locale.prototype.getLanguage = function() {
return this.language;
}, enyo.g11n.Locale.prototype.getRegion = function() {
return this.region;
}, enyo.g11n.Locale.prototype.getVariant = function() {
return this.variant;
}, enyo.g11n.Locale.prototype.toString = function() {
return this.locale || (this.locale = this.language + "_" + this.region, this.variant && (this.locale = this.locale + "_" + this.variant)), this.locale;
}, enyo.g11n.Locale.prototype.toISOString = function() {
var e = this.language || "";
return this.region && (e += "_" + this.region.toUpperCase()), this.variant && (e += "_" + this.variant.toUpperCase()), e;
}, enyo.g11n.Locale.prototype.isMatch = function(e) {
return e.language && e.region ? (!this.language || this.language === e.language) && (!this.region || this.region === e.region) : e.language ? !this.language || this.language === e.language : !this.region || this.region === e.region;
}, enyo.g11n.Locale.prototype.equals = function(e) {
return this.language === e.language && this.region === e.region && this.variant === e.variant;
}, enyo.g11n.Locale.prototype.useDefaultLang = function() {
var e, t, n;
this.language || (e = enyo.g11n.Utils.getNonLocaleFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/formats/defLangs.json"
}), t = e && e[this.region], t || (n = enyo.g11n.currentLocale(), t = n.language), this.language = t || "en", this.locale = this.language + "_" + this.region);
};

// javascript/loadfile.js

enyo.g11n.Utils = enyo.g11n.Utils || function() {}, enyo.g11n.Utils._fileCache = {}, enyo.g11n.Utils._getBaseURL = function(e) {
if ("baseURI" in e) return e.baseURI;
var t = e.getElementsByTagName("base");
return t.length > 0 ? t[0].href : window.location.href;
}, enyo.g11n.Utils._fetchAppRootPath = function() {
var e = window.document, t = enyo.g11n.Utils._getBaseURL(e).match(new RegExp(".*://[^#]*/"));
if (t) return t[0];
}, enyo.g11n.Utils._setRoot = function(t) {
var n = t;
return !t && enyo.g11n.isEnyoAvailable() ? n = enyo.g11n.Utils._fetchAppRootPath() + "assets" : n = ".", enyo.g11n.root = n;
}, enyo.g11n.Utils._getRoot = function() {
return enyo.g11n.root || enyo.g11n.Utils._setRoot();
}, enyo.g11n.Utils._getEnyoRoot = function(t) {
var n = "";
return !enyo.g11n.isEnyoAvailable() && t && (n = t), n + enyo.path.paths.enyo + "/../lib/g11n/source";
}, enyo.g11n.Utils._loadFile = function(t) {
var n, r, i = enyo.g11n.getPlatform();
if (i === "node") try {
this.fs || (this.fs = IMPORTS.require("fs")), r = this.fs.readFileSync(t, "utf8"), r && (n = JSON.parse(r));
} catch (s) {
n = undefined;
} else try {
n = JSON.parse(enyo.xhr.request({
url: t,
sync: !0
}).responseText);
} catch (o) {}
return n;
}, enyo.g11n.Utils.getNonLocaleFile = function(t) {
var n, r, i;
if (!t || !t.path) return undefined;
t.path.charAt(0) !== "/" ? (r = t.root || this._getRoot(), i = r + "/" + t.path) : i = t.path;
if (enyo.g11n.Utils._fileCache[i] !== undefined) n = enyo.g11n.Utils._fileCache[i].json; else {
n = enyo.g11n.Utils._loadFile(i);
if (t.cache === undefined || t.cache !== !1) enyo.g11n.Utils._fileCache[i] = {
path: i,
json: n,
locale: undefined,
timestamp: new Date
}, this.oldestStamp === undefined && (this.oldestStamp = enyo.g11n.Utils._fileCache[i].timestamp);
}
return n;
}, enyo.g11n.Utils.getJsonFile = function(t) {
var n, r, i, s, o, u, a, f, l;
if (!t || !t.path || !t.locale) return undefined;
i = t.path.charAt(0) !== "/" ? t.root || this._getRoot() : "", i.slice(-1) !== "/" && (i += "/"), t.path ? (s = t.path, s.slice(-1) !== "/" && (s += "/")) : s = "", s += t.prefix || "", i += s, l = i + t.locale.toString() + ".json";
if (enyo.g11n.Utils._fileCache[l] !== undefined) n = enyo.g11n.Utils._fileCache[l].json; else {
t.merge ? (t.locale.language && (r = i + t.locale.language + ".json", o = this._loadFile(r)), t.locale.region && (r = i + t.locale.language + "_" + t.locale.region + ".json", u = this._loadFile(r), t.locale.language !== t.locale.region && (r = i + t.locale.region + ".json", a = this._loadFile(r))), t.locale.variant && (r = i + t.locale.language + "_" + t.locale.region + "_" + t.locale.variant + ".json", f = this._loadFile(r)), n = this._merge([ o, a, u, f ])) : (r = i + t.locale.toString() + ".json", n = this._loadFile(r), !n && t.type !== "region" && t.locale.language && (r = i + t.locale.language + ".json", n = this._loadFile(r)), !n && t.type !== "language" && t.locale.region && (r = i + t.locale.region + ".json", n = this._loadFile(r)), !n && t.type !== "language" && t.locale.region && (r = i + "_" + t.locale.region + ".json", n = this._loadFile(r)));
if (t.cache === undefined || t.cache !== !1) enyo.g11n.Utils._fileCache[l] = {
path: l,
json: n,
locale: t.locale,
timestamp: new Date
}, this.oldestStamp === undefined && (this.oldestStamp = enyo.g11n.Utils._fileCache[l].timestamp);
}
return n;
}, enyo.g11n.Utils._merge = function(t) {
var n, r, i = {};
for (n = 0, r = t.length; n < r; n++) i = enyo.mixin(i, t[n]);
return i;
}, enyo.g11n.Utils.releaseAllJsonFiles = function(t, n) {
var r = new Date, i = [], s, o, u, a;
t = t || 6e4;
if (this.oldestStamp !== undefined && this.oldestStamp.getTime() + t < r.getTime()) {
s = r;
for (o in enyo.g11n.Utils._fileCache) o && enyo.g11n.Utils._fileCache[o] && (a = enyo.g11n.Utils._fileCache[o], !a.locale || n || !enyo.g11n.currentLocale().isMatch(a.locale) && !enyo.g11n.formatLocale().isMatch(a.locale) && !enyo.g11n.phoneLocale().isMatch(a.locale) ? a.timestamp.getTime() + t < r.getTime() ? i.push(a.path) : a.timestamp.getTime() < s.getTime() && (s = a.timestamp) : a.timestamp.getTime() < s.getTime() && (s = a.timestamp));
this.oldestStamp = s.getTime() < r.getTime() ? s : undefined;
for (u = 0; u < i.length; u++) enyo.g11n.Utils._fileCache[i[u]] = undefined;
}
return i.length;
}, enyo.g11n.Utils._cacheSize = function() {
var t = 0, n;
for (n in enyo.g11n.Utils._fileCache) enyo.g11n.Utils._fileCache[n] && t++;
return t;
};

// javascript/template.js

enyo.g11n.Template = function(e, t) {
this.template = e, this.pattern = t || /(.?)(#\{(.*?)\})/;
}, enyo.g11n.Template.prototype._evalHelper = function(e, t) {
function s(e) {
return e === undefined || e === null ? "" : e;
}
function o(e, n, r) {
var i = t, o, u;
e = s(e);
if (e === "\\") return n;
o = r.split("."), u = o.shift();
while (i && u) {
i = i[u], u = o.shift();
if (!u) return e + s(i) || e || "";
}
return e || "";
}
var n = [], r = this.pattern, i;
if (!t || !e) return "";
while (e.length) i = e.match(r), i ? (n.push(e.slice(0, i.index)), n.push(o(i[1], i[2], i[3])), e = e.slice(i.index + i[0].length)) : (n.push(e), e = "");
return n.join("");
}, enyo.g11n.Template.prototype.evaluate = function(e) {
return this._evalHelper(this.template, e);
}, enyo.g11n.Template.prototype.formatChoice = function(e, t) {
try {
var n = this.template ? this.template.split("|") : [], r = [], i = [], s = "", o;
t = t || {};
for (o = 0; o < n.length; o++) {
var u = enyo.indexOf("#", n[o]);
if (u !== -1) {
r[o] = n[o].substring(0, u), i[o] = n[o].substring(u + 1);
if (e == r[o]) return this._evalHelper(i[o], t);
r[o] === "" && (s = i[o]);
}
}
for (o = 0; o < r.length; o++) {
var a = r[o];
if (a) {
var f = a.charAt(a.length - 1), l = parseFloat(a);
if (f === "<" && e < l || f === ">" && e > l) return this._evalHelper(i[o], t);
}
}
return this._evalHelper(s, t);
} catch (c) {
return enyo.error("formatChoice error : ", c), "";
}
};

// javascript/resources.js

$L = function(e) {
return $L._resources || ($L._resources = new enyo.g11n.Resources), $L._resources.$L(e);
}, $L._resources = null, enyo.g11n.Resources = function(e) {
e && e.root && (this.root = typeof window != "undefined" ? enyo.path.rewrite(e.root) : e.root), this.root = this.root || enyo.g11n.Utils._getRoot(), this.resourcePath = this.root + "/resources/", e && e.locale ? this.locale = typeof e.locale == "string" ? new enyo.g11n.Locale(e.locale) : e.locale : this.locale = enyo.g11n.currentLocale(), this.$L = this.locale.toString() === "en_pl" ? this._pseudo : this._$L, this.localizedResourcePath = this.resourcePath + this.locale.locale + "/", this.languageResourcePath = this.resourcePath + (this.locale.language ? this.locale.language + "/" : ""), this.regionResourcePath = this.languageResourcePath + (this.locale.region ? this.locale.region + "/" : ""), this.carrierResourcePath = this.regionResourcePath + (this.locale.variant ? this.locale.variant + "/" : "");
}, enyo.g11n.Resources.prototype.getResource = function(e) {
var t;
if (this.carrierResourcePath) try {
t = enyo.g11n.Utils.getNonLocaleFile({
path: this.carrierResourcePath + e
});
} catch (n) {
t = undefined;
}
if (!t) try {
t = enyo.g11n.Utils.getNonLocaleFile({
path: this.regionResourcePath + e
});
} catch (r) {
t = undefined;
}
if (!t) try {
t = enyo.g11n.Utils.getNonLocaleFile({
path: this.languageResourcePath + e
});
} catch (i) {
t = undefined;
}
if (!t) try {
t = enyo.g11n.Utils.getNonLocaleFile({
path: this.resourcePath + "en/" + e
});
} catch (s) {
t = undefined;
}
if (!t) try {
t = enyo.g11n.Utils.getNonLocaleFile({
path: this.root + "/" + e
});
} catch (o) {
t = undefined;
}
return t;
}, enyo.g11n.Resources.prototype.$L = function(e) {}, enyo.g11n.Resources.prototype._$L = function(e) {
var t, n;
return e ? this.locale.equals(enyo.g11n.sourceLocale()) ? typeof e == "string" ? e : e.value : (this.strings || this._loadStrings(), typeof e == "string" ? (t = e, n = e) : (t = e.key, n = e.value), this.strings && typeof this.strings[t] != "undefined" ? this.strings[t] : n) : "";
}, enyo.g11n.Resources.prototype._pseudo = function(e) {
var t, n;
if (!e) return "";
n = "";
for (t = 0; t < e.length; t++) if (e.charAt(t) === "#" && t + 1 < e.length && e.charAt(t + 1) === "{") {
while (e.charAt(t) !== "}" && t < e.length) n += e.charAt(t++);
t < e.length && (n += e.charAt(t));
} else if (e.charAt(t) === "<") {
while (e.charAt(t) !== ">" && t < e.length) n += e.charAt(t++);
t < e.length && (n += e.charAt(t));
} else if (e.charAt(t) === "&" && t + 1 < e.length && !enyo.g11n.Char.isSpace(e.charAt(t + 1))) {
while (e.charAt(t) !== ";" && !enyo.g11n.Char.isSpace(e.charAt(t)) && t < e.length) n += e.charAt(t++);
t < e.length && (n += e.charAt(t));
} else n += enyo.g11n.Resources._pseudoMap[e.charAt(t)] || e.charAt(t);
return n;
}, enyo.g11n.Resources.prototype._loadStrings = function() {
this.strings = enyo.g11n.Utils.getJsonFile({
root: this.root,
path: "resources",
locale: this.locale,
merge: !0
}), enyo.g11n.Utils.releaseAllJsonFiles();
}, enyo.g11n.Resources._pseudoMap = {
a: "\u00e1",
e: "\u00e8",
i: "\u00ef",
o: "\u00f5",
u: "\u00fb",
c: "\u00e7",
A: "\u00c5",
E: "\u00cb",
I: "\u00ce",
O: "\u00d5",
U: "\u00db",
C: "\u00c7",
B: "\u00df",
y: "\u00ff",
Y: "\u00dd",
D: "\u010e",
d: "\u0111",
g: "\u011d",
G: "\u011c",
H: "\u0124",
h: "\u0125",
J: "\u0134",
j: "\u0135",
K: "\u0136",
k: "\u0137",
N: "\u00d1",
n: "\u00f1",
S: "\u015e",
s: "\u015f",
T: "\u0164",
t: "\u0165",
W: "\u0174",
w: "\u0175",
Z: "\u0179",
z: "\u017a"
};

// javascript/character.js

enyo.g11n.Char = enyo.g11n.Char || {}, enyo.g11n.Char._strTrans = function(t, n) {
var r = "", i, s;
for (s = 0; s < t.length; s++) i = n[t.charAt(s)], r += i || t.charAt(s);
return r;
}, enyo.g11n.Char._objectIsEmpty = function(e) {
var t;
for (t in e) return !1;
return !0;
}, enyo.g11n.Char._isIdeoLetter = function(e) {
return e >= 19968 && e <= 40907 || e >= 63744 && e <= 64217 || e >= 13312 && e <= 19893 || e >= 12353 && e <= 12447 || e >= 12449 && e <= 12543 || e >= 65382 && e <= 65437 || e >= 12784 && e <= 12799 || e >= 12549 && e <= 12589 || e >= 12704 && e <= 12727 || e >= 12593 && e <= 12686 || e >= 65440 && e <= 65500 || e >= 44032 && e <= 55203 || e >= 40960 && e <= 42124 || e >= 4352 && e <= 4607 || e >= 43360 && e <= 43388 || e >= 55216 && e <= 55291 ? !0 : !1;
}, enyo.g11n.Char._isIdeoOther = function(e) {
return e >= 42125 && e <= 42191 || e >= 12544 && e <= 12548 || e >= 12590 && e <= 12591 || e >= 64218 && e <= 64255 || e >= 55292 && e <= 55295 || e >= 40908 && e <= 40959 || e >= 43389 && e <= 43391 || e >= 12800 && e <= 13055 || e >= 13056 && e <= 13183 || e >= 13184 && e <= 13311 || e === 12592 || e === 12687 || e === 12448 || e === 12352 || e === 12294 || e === 12348 ? !0 : !1;
}, enyo.g11n.Char.isIdeo = function(t) {
var n;
return !t || t.length < 1 ? !1 : (n = t.charCodeAt(0), enyo.g11n.Char._isIdeoLetter(n) || enyo.g11n.Char._isIdeoOther(n));
}, enyo.g11n.Char.isPunct = function(t) {
var n, r;
return !t || t.length < 1 ? !1 : (n = enyo.g11n.Utils.getNonLocaleFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/character_data/chartype.punct.json"
}), r = n && t.charAt(0) in n, enyo.g11n.Utils.releaseAllJsonFiles(), r);
}, enyo.g11n.Char._space = {
9: 1,
10: 1,
11: 1,
12: 1,
13: 1,
32: 1,
133: 1,
160: 1,
5760: 1,
6158: 1,
8192: 1,
8193: 1,
8194: 1,
8195: 1,
8196: 1,
8197: 1,
8198: 1,
8199: 1,
8200: 1,
8201: 1,
8202: 1,
8232: 1,
8233: 1,
8239: 1,
8287: 1,
12288: 1
}, enyo.g11n.Char.isSpace = function(t) {
var n;
return !t || t.length < 1 ? !1 : (n = t.charCodeAt(0), n in enyo.g11n.Char._space);
}, enyo.g11n.Char.toUpper = function(t, n) {
var r;
if (!t) return undefined;
n || (n = enyo.g11n.currentLocale()), r = enyo.g11n.Utils.getJsonFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/character_data",
locale: n
});
if (!r || !r.upperMap) r = enyo.g11n.Utils.getJsonFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/character_data",
locale: new enyo.g11n.Locale("en")
});
return r && r.upperMap !== undefined ? enyo.g11n.Char._strTrans(t, r.upperMap) : (enyo.g11n.Utils.releaseAllJsonFiles(), t);
}, enyo.g11n.Char.isLetter = function(t) {
var n, r, i, s;
return !t || t.length < 1 ? !1 : (n = t.charAt(0), r = t.charCodeAt(0), i = enyo.g11n.Utils.getNonLocaleFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/character_data/chartype.letter.json"
}), s = i && n in i || enyo.g11n.Char._isIdeoLetter(r), enyo.g11n.Utils.releaseAllJsonFiles(), s);
}, enyo.g11n.Char.getIndexChars = function(t) {
var n, r, i, s, o = [];
t ? typeof t == "string" ? r = new enyo.g11n.Locale(t) : r = t : r = enyo.g11n.currentLocale(), enyo.g11n.Char._resources || (enyo.g11n.Char._resources = {}), enyo.g11n.Char._resources[r.locale] || (enyo.g11n.Char._resources[r.locale] = new enyo.g11n.Resources({
root: enyo.g11n.Utils._getEnyoRoot() + "/base",
locale: r
})), i = enyo.g11n.Char._resources[r.locale], n = enyo.g11n.Char._resources[r.locale].$L({
key: "indexChars",
value: "ABCDEFGHIJKLMNOPQRSTUVWXYZ#"
});
for (s = 0; s < n.length; s++) o.push(n[s]);
return o;
}, enyo.g11n.Char.getBaseString = function(t, n) {
var r, i;
if (!t) return undefined;
n ? typeof n == "string" ? i = new enyo.g11n.Locale(n) : i = n : i = enyo.g11n.currentLocale(), r = enyo.g11n.Utils.getJsonFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/character_data",
locale: i
});
if (!r || enyo.g11n.Char._objectIsEmpty(r)) r = enyo.g11n.Utils.getJsonFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/character_data",
locale: new enyo.g11n.Locale("en")
});
return r && r.baseChars !== undefined && (t = enyo.g11n.Char._strTrans(t, r.baseChars)), enyo.g11n.Utils.releaseAllJsonFiles(), t;
};

// javascript/timezone.js

enyo.g11n._TZ = enyo.g11n._TZ || {}, enyo.g11n.TzFmt = function(e) {
return this.setTZ(), e !== undefined && e.TZ !== undefined && this.setCurrentTimeZone(e.TZ), enyo.g11n.Utils.releaseAllJsonFiles(), this;
}, enyo.g11n.TzFmt.prototype = {
toString: function() {
return this.TZ !== undefined ? this.TZ : this._TZ;
},
setTZ: function() {
var e = (new Date).toString(), t = enyo.indexOf("(", e), n = enyo.indexOf(")", e), r = e.slice(t + 1, n);
r !== undefined ? this.setCurrentTimeZone(r) : this.setDefaultTimeZone();
},
getCurrentTimeZone: function() {
return this.TZ !== undefined ? this.TZ : this._TZ !== undefined ? this._TZ : "unknown";
},
setCurrentTimeZone: function(e) {
this._TZ = e, this.TZ = e;
},
setDefaultTimeZone: function() {
var e = (new Date).toString().match(/\(([A-Z]+)\)/);
this._TZ = e && e[1] || "PST";
}
};

// javascript/datetime.js

enyo.g11n.DateFmt = function(e) {
var t, n, r, i, s;
s = this, s._normalizedComponents = {
date: {
dm: "DM",
md: "DM",
my: "MY",
ym: "MY",
d: "D",
dmy: "",
dym: "",
mdy: "",
myd: "",
ydm: "",
ymd: ""
},
time: {
az: "AZ",
za: "AZ",
a: "A",
z: "Z",
"": ""
},
timeLength: {
"short": "small",
medium: "small",
"long": "big",
full: "big"
}
}, s._normalizeDateTimeFormatComponents = function(e) {
var t = e.dateComponents, n = e.timeComponents, r, i, o, u = e.time;
return e.date && t && (r = s._normalizedComponents.date[t], r === undefined && (enyo.log("date component error: '" + t + "'"), r = "")), u && n !== undefined && (o = s._normalizedComponents.timeLength[u], o === undefined && (enyo.log("time format error: " + u), o = "small"), i = s._normalizedComponents.time[n], i === undefined && enyo.log("time component error: '" + n + "'")), e.dateComponents = r, e.timeComponents = i, e;
}, s._finalDateTimeFormat = function(e, t, n) {
var r = s.dateTimeFormatHash.dateTimeFormat || s.defaultFormats.dateTimeFormat;
return e && t ? s._buildDateTimeFormat(r, "dateTime", {
TIME: t,
DATE: e
}) : t || e || "M/d/yy h:mm a";
}, s._buildDateTimeFormat = function(e, t, n) {
var r, i, o = [], u = s._getTokenizedFormat(e, t), a;
for (r = 0, i = u.length; r < i && u[r] !== undefined; ++r) a = n[u[r]], a ? o.push(a) : o.push(u[r]);
return o.join("");
}, s._getDateFormat = function(e, t) {
var n = s._formatFetch(e, t.dateComponents, "Date");
if (e !== "full" && t.weekday) {
var r = s._formatFetch(t.weekday === !0 ? e : t.weekday, "", "Weekday");
n = s._buildDateTimeFormat(s.dateTimeFormatHash.weekDateFormat || s.defaultFormats.weekDateFormat, "weekDate", {
WEEK: r,
DATE: n
});
}
return n;
}, s._getTimeFormat = function(e, t) {
var n = s._formatFetch(e, "", s.twelveHourFormat ? "Time12" : "Time24");
if (t.timeComponents) {
var r = "time" + t.timeComponents, i = r + "Format";
return s._buildDateTimeFormat(s.dateTimeFormatHash[i] || s.defaultFormats[i], r, {
TIME: n,
AM: "a",
ZONE: "zzz"
});
}
return n;
}, s.ParserChunks = {
full: "('[^']+'|y{2,4}|M{1,4}|d{1,2}|z{1,3}|a|h{1,2}|H{1,2}|k{1,2}|K{1,2}|E{1,4}|m{1,2}|s{1,2}|[^A-Za-z']+)?",
dateTime: "(DATE|TIME|[^A-Za-z]+|'[^']+')?",
weekDate: "(DATE|WEEK|[^A-Za-z]+|'[^']+')?",
timeA: "(TIME|AM|[^A-Za-z]+|'[^']+')?",
timeZ: "(TIME|ZONE|[^A-Za-z]+|'[^']+')?",
timeAZ: "(TIME|AM|ZONE|[^A-Za-z]+|'[^']+')?"
}, s._getTokenizedFormat = function(e, t) {
var n = t && s.ParserChunks[t] || s.ParserChunks.full, r = e.length, i = [], o, u, a = new RegExp(n, "g");
while (r > 0) {
o = a.exec(e)[0], u = o.length;
if (u === 0) return [];
i.push(o), r -= u;
}
return i;
}, s._formatFetch = function(e, t, n, r) {
switch (e) {
case "short":
case "medium":
case "long":
case "full":
case "small":
case "big":
case "default":
return s.dateTimeFormatHash[e + (t || "") + n];
default:
return e;
}
}, s._dayOffset = function(e, t) {
var n;
return t = s._roundToMidnight(t), e = s._roundToMidnight(e), n = (e.getTime() - t.getTime()) / 864e5, n;
}, s._roundToMidnight = function(e) {
var t = e.getTime(), n = new Date;
return n.setTime(t), n.setHours(0), n.setMinutes(0), n.setSeconds(0), n.setMilliseconds(0), n;
}, s.inputParams = e, typeof e == "undefined" || !e.locale ? t = enyo.g11n.formatLocale() : typeof e.locale == "string" ? t = new enyo.g11n.Locale(e.locale) : t = e.locale, t.language || t.useDefaultLang(), this.locale = t, typeof e == "string" ? s.formatType = e : typeof e == "undefined" ? (e = {
format: "short"
}, s.formatType = e.format) : s.formatType = e.format, !s.formatType && !e.time && !e.date && (e ? e.format = "short" : e = {
format: "short"
}, s.formatType = "short"), s.dateTimeHash = enyo.g11n.Utils.getJsonFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/datetime_data",
locale: t,
type: "language"
}), s.dateTimeHash || (s.dateTimeHash = enyo.g11n.Utils.getJsonFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/datetime_data",
locale: new enyo.g11n.Locale("en_us")
})), s.dateTimeFormatHash = enyo.g11n.Utils.getJsonFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/formats",
locale: t,
type: "region"
}), s.dateTimeFormatHash || (s.dateTimeFormatHash = enyo.g11n.Utils.getJsonFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/formats",
locale: new enyo.g11n.Locale("en_us"),
type: "region"
})), s.rb = new enyo.g11n.Resources({
root: enyo.g11n.Utils._getEnyoRoot() + "/base",
locale: t
}), typeof e == "undefined" || typeof e.twelveHourFormat == "undefined" ? s.twelveHourFormat = s.dateTimeFormatHash.is12HourDefault : s.twelveHourFormat = e.twelveHourFormat;
if (s.formatType) switch (s.formatType) {
case "short":
case "medium":
case "long":
case "full":
case "default":
s.partsLength = s.formatType, i = s._finalDateTimeFormat(s._getDateFormat(s.formatType, e), s._getTimeFormat(s.formatType, e), e);
break;
default:
i = s.formatType;
} else e = s._normalizeDateTimeFormatComponents(e), e.time && (r = s._getTimeFormat(e.time, e), s.partsLength = e.time), e.date && (n = s._getDateFormat(e.date, e), s.partsLength = e.date), i = s._finalDateTimeFormat(n, r, e);
s.tokenized = s._getTokenizedFormat(i), s.partsLength || (s.partsLength = "full");
}, enyo.g11n.DateFmt.prototype.toString = function() {
return this.tokenized.join("");
}, enyo.g11n.DateFmt.prototype.isAmPm = function() {
return this.twelveHourFormat;
}, enyo.g11n.DateFmt.prototype.isAmPmDefault = function() {
return this.dateTimeFormatHash.is12HourDefault;
}, enyo.g11n.DateFmt.prototype.getFirstDayOfWeek = function() {
return this.dateTimeFormatHash.firstDayOfWeek;
}, enyo.g11n.DateFmt.prototype._format = function(e, t) {
var n = this, r, i = [], s, o, u, a, f, l, c, h;
c = n.dateTimeHash;
for (f = 0, l = t.length; f < l && t[f] !== undefined; f++) {
switch (t[f]) {
case "yy":
s = "", i.push((e.getFullYear() + "").substring(2));
break;
case "yyyy":
s = "", i.push(e.getFullYear());
break;
case "MMMM":
s = "long", o = "month", u = e.getMonth();
break;
case "MMM":
s = "medium", o = "month", u = e.getMonth();
break;
case "MM":
s = "short", o = "month", u = e.getMonth();
break;
case "M":
s = "single", o = "month", u = e.getMonth();
break;
case "dd":
s = "short", o = "date", u = e.getDate() - 1;
break;
case "d":
s = "single", o = "date", u = e.getDate() - 1;
break;
case "zzz":
s = "", typeof n.timezoneFmt == "undefined" && (typeof n.inputParams == "undefined" || typeof n.inputParams.TZ == "undefined" ? n.timezoneFmt = new enyo.g11n.TzFmt : n.timezoneFmt = new enyo.g11n.TzFmt(n.inputParams)), a = n.timezoneFmt.getCurrentTimeZone(), i.push(a);
break;
case "a":
s = "", e.getHours() > 11 ? i.push(c.pm) : i.push(c.am);
break;
case "K":
s = "", i.push(e.getHours() % 12);
break;
case "KK":
s = "", r = e.getHours() % 12, i.push(r < 10 ? "0" + ("" + r) : r);
break;
case "h":
s = "", r = e.getHours() % 12, i.push(r === 0 ? 12 : r);
break;
case "hh":
s = "", r = e.getHours() % 12, i.push(r === 0 ? 12 : r < 10 ? "0" + ("" + r) : r);
break;
case "H":
s = "", i.push(e.getHours());
break;
case "HH":
s = "", r = e.getHours(), i.push(r < 10 ? "0" + ("" + r) : r);
break;
case "k":
s = "", r = e.getHours() % 12, i.push(r === 0 ? 12 : r);
break;
case "kk":
s = "", r = e.getHours() % 12, i.push(r === 0 ? 12 : r < 10 ? "0" + ("" + r) : r);
break;
case "EEEE":
s = "long", o = "day", u = e.getDay();
break;
case "EEE":
s = "medium", o = "day", u = e.getDay();
break;
case "EE":
s = "short", o = "day", u = e.getDay();
break;
case "E":
s = "single", o = "day", u = e.getDay();
break;
case "mm":
case "m":
s = "";
var p = e.getMinutes();
i.push(p < 10 ? "0" + ("" + p) : p);
break;
case "ss":
case "s":
s = "";
var d = e.getSeconds();
i.push(d < 10 ? "0" + ("" + d) : d);
break;
default:
h = /'([A-Za-z]+)'/.exec(t[f]), s = "", h ? i.push(h[1]) : i.push(t[f]);
}
s && i.push(c[s][o][u]);
}
return i.join("");
}, enyo.g11n.DateFmt.prototype.format = function(e) {
var t = this;
return typeof e != "object" || t.tokenized === null ? (enyo.warn("DateFmt.format: no date to format or no format loaded"), undefined) : this._format(e, t.tokenized);
}, enyo.g11n.DateFmt.prototype.formatRelativeDate = function(e, t) {
var n, r, i, s, o = this;
if (typeof e != "object") return undefined;
typeof t == "undefined" ? (r = !1, n = new Date) : (typeof t.referenceDate != "undefined" ? n = t.referenceDate : n = new Date, typeof t.verbosity != "undefined" ? r = t.verbosity : r = !1), s = o._dayOffset(n, e);
switch (s) {
case 0:
return o.dateTimeHash.relative.today;
case 1:
return o.dateTimeHash.relative.yesterday;
case -1:
return o.dateTimeHash.relative.tomorrow;
default:
if (s < 7) return o.dateTimeHash.long.day[e.getDay()];
if (s < 30) {
if (r) {
i = new enyo.g11n.Template(o.dateTimeHash.relative.thisMonth);
var u = Math.floor(s / 7);
return i.formatChoice(u, {
num: u
});
}
return o.format(e);
}
if (s < 365) {
if (r) {
i = new enyo.g11n.Template(o.dateTimeHash.relative.thisYear);
var a = Math.floor(s / 30);
return i.formatChoice(a, {
num: a
});
}
return o.format(e);
}
return o.format(e);
}
}, enyo.g11n.DateFmt.prototype.formatRange = function(e, t) {
var n, r, i, s, o, u, a, f, l = this.partsLength || "medium", c = this.dateTimeHash, h = this.dateTimeFormatHash;
return !e && !t ? "" : !e || !t ? this.format(e || t) : (t.getTime() < e.getTime() && (n = t, t = e, e = n), a = new Date(e.getTime()), a.setHours(0), a.setMinutes(0), a.setSeconds(0), a.setMilliseconds(0), f = new Date(t.getTime()), f.setHours(0), f.setMinutes(0), f.setSeconds(0), f.setMilliseconds(0), f.getTime() - a.getTime() === 864e5 ? (s = "shortTime" + (this.twelveHourFormat ? "12" : "24"), r = this._getTokenizedFormat(h[s]), s = l + "Date", i = this._getTokenizedFormat(h[s]), u = new enyo.g11n.Template(this.rb.$L({
key: "dateRangeConsecutiveDays",
value: "#{startDate} #{startTime} - #{endDate} #{endTime}"
})), u.evaluate({
startTime: this._format(e, r),
endTime: this._format(t, r),
startDate: this._format(e, i),
endDate: this._format(t, i)
})) : e.getYear() === t.getYear() ? (o = l === "short" || l === "single" ? (e.getFullYear() + "").substring(2) : e.getFullYear(), e.getMonth() === t.getMonth() ? e.getDate() === t.getDate() ? (s = "shortTime" + (this.twelveHourFormat ? "12" : "24"), r = this._getTokenizedFormat(h[s]), s = l + "Date", i = this._getTokenizedFormat(h[s]), u = new enyo.g11n.Template(this.rb.$L({
key: "dateRangeWithinDay",
value: "#{startTime}-#{endTime}, #{date}"
})), u.evaluate({
startTime: this._format(e, r),
endTime: this._format(t, r),
date: this._format(e, i)
})) : (s = l + "DDate", i = this._getTokenizedFormat(h[s]), u = new enyo.g11n.Template(this.rb.$L({
key: "dateRangeWithinMonth",
value: "#{month} #{startDate}-#{endDate}, #{year}"
})), u.evaluate({
month: c[l].month[e.getMonth()],
startDate: this._format(e, i),
endDate: this._format(t, i),
year: o
})) : (l === "full" ? l = "long" : l === "single" && (l = "short"), s = l + "DMDate", i = this._getTokenizedFormat(h[s]), u = new enyo.g11n.Template(this.rb.$L({
key: "dateRangeWithinYear",
value: "#{start} - #{end}, #{year}"
})), u.evaluate({
start: this._format(e, i),
end: this._format(t, i),
year: o
}))) : t.getYear() - e.getYear() < 2 ? (s = l + "Date", i = this._getTokenizedFormat(h[s]), u = new enyo.g11n.Template(this.rb.$L({
key: "dateRangeWithinConsecutiveYears",
value: "#{start} - #{end}"
})), u.evaluate({
start: this._format(e, i),
end: this._format(t, i)
})) : (l === "full" ? l = "long" : l === "single" && (l = "short"), s = l + "MYDate", i = this._getTokenizedFormat(h[s]), u = new enyo.g11n.Template(this.rb.$L({
key: "dateRangeMultipleYears",
value: "#{startMonthYear} - #{endMonthYear}"
})), u.evaluate({
startMonthYear: this._format(e, i),
endMonthYear: this._format(t, i)
})));
};

// javascript/numberfmt.js

enyo.g11n.NumberFmt = function(e) {
var t, n, r, i, s, o, u;
typeof e == "number" ? this.fractionDigits = e : e && typeof e.fractionDigits == "number" && (this.fractionDigits = e.fractionDigits), !e || !e.locale ? this.locale = enyo.g11n.formatLocale() : typeof e.locale == "string" ? this.locale = new enyo.g11n.Locale(e.locale) : this.locale = e.locale, this.style = e && e.style || "number", t = enyo.g11n.Utils.getJsonFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/formats",
locale: this.locale,
type: "region"
}), this.style === "currency" && (r = e && e.currency || t && t.currency && t.currency.name, r ? (r = r.toUpperCase(), this.currencyStyle = e && e.currencyStyle === "iso" ? "iso" : "common", n = enyo.g11n.Utils.getNonLocaleFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/number_data/iso4217.json"
}), n ? (i = n[r], i || (s = new enyo.g11n.Locale(r), u = enyo.g11n.Utils.getJsonFile({
root: enyo.g11n.Utils._getEnyoRoot(),
path: "base/formats",
locale: s,
type: "region"
}), u && (r = u.currency && u.currency.name, i = n[r])), i || (r = t && t.currency && t.currency.name, i = n[r]), i ? (this.sign = this.currencyStyle !== "iso" ? i.sign : r, this.fractionDigits = e && typeof e.fractionDigits == "number" ? e.fractionDigits : i.digits) : this.style = "number") : (r = t && t.currency && t.currency.name, this.sign = r)) : (r = t && t.currency && t.currency.name, this.sign = r), r ? (o = t && t.currency && t.currency[this.currencyStyle] || "#{sign} #{amt}", this.currencyTemplate = new enyo.g11n.Template(o)) : this.style = "number"), t ? (this.decimal = t.numberDecimal || ".", this.divider = t.numberDivider || ",", t.dividerIndex ? t.dividerIndex === 4 ? this.numberGroupRegex = /(\d+)(\d{4})/ : this.numberGroupRegex = /(\d+)(\d{3})/ : this.numberGroupRegex = /(\d+)(\d{3})/, this.percentageSpace = t.percentageSpace) : (this.decimal = ".", this.divider = ",", this.numberGroupRegex = /(\d+)(\d{3})/, this.percentageSpace = !1), this.numberGroupRegex.compile(this.numberGroupRegex), enyo.g11n.Utils.releaseAllJsonFiles();
}, enyo.g11n.NumberFmt.prototype.format = function(e) {
try {
var t, n, r, i;
typeof e == "string" && (e = parseFloat(e));
if (isNaN(e)) return undefined;
typeof this.fractionDigits != "undefined" ? t = e.toFixed(this.fractionDigits) : t = e.toString(), n = t.split("."), r = n[0];
while (this.divider && this.numberGroupRegex.test(r)) r = r.replace(this.numberGroupRegex, "$1" + this.divider + "$2");
return n[0] = r, i = n.join(this.decimal), this.style === "currency" && this.currencyTemplate ? i = this.currencyTemplate.evaluate({
amt: i,
sign: this.sign
}) : this.style === "percent" && (i += this.percentageSpace ? " %" : "%"), i;
} catch (s) {
return enyo.log("formatNumber error : " + s), (e || "0") + "." + (this.fractionDigits || "");
}
};

// javascript/duration.js

enyo.g11n.DurationFmt = function(e) {
typeof e == "undefined" ? (this.locale = enyo.g11n.formatLocale(), this.style = "short") : (e.locale ? typeof e.locale == "string" ? this.locale = new enyo.g11n.Locale(e.locale) : this.locale = e.locale : this.locale = enyo.g11n.formatLocale(), e.style ? (this.style = e.style, this.style !== "short" && this.style !== "medium" && this.style !== "long" && this.style !== "full" && (this.style = "short")) : this.style = "short"), this.rb = new enyo.g11n.Resources({
root: enyo.g11n.Utils._getEnyoRoot() + "/base",
locale: this.locale
}), this.style === "short" ? this.parts = {
years: new enyo.g11n.Template(this.rb.$L({
key: "yearsFormatShort",
value: "##{num}y"
})),
months: new enyo.g11n.Template(this.rb.$L({
key: "monthsFormatShort",
value: "##{num}m"
})),
weeks: new enyo.g11n.Template(this.rb.$L({
key: "weeksFormatShort",
value: "##{num}w"
})),
days: new enyo.g11n.Template(this.rb.$L({
key: "daysFormatShort",
value: "##{num}d"
})),
hours: new enyo.g11n.Template(this.rb.$L({
key: "hoursFormatShort",
value: "##{num}"
})),
minutes: new enyo.g11n.Template(this.rb.$L({
key: "minutesFormatShort",
value: "##{num}"
})),
seconds: new enyo.g11n.Template(this.rb.$L({
key: "secondsFormatShort",
value: "##{num}"
})),
separator: this.rb.$L({
key: "separatorShort",
value: " "
}),
dateTimeSeparator: this.rb.$L({
key: "dateTimeSeparatorShort",
value: " "
}),
longTimeFormat: new enyo.g11n.Template(this.rb.$L({
key: "longTimeFormatShort",
value: "#{hours}:#{minutes}:#{seconds}"
})),
shortTimeFormat: new enyo.g11n.Template(this.rb.$L({
key: "shortTimeFormatShort",
value: "#{minutes}:#{seconds}"
})),
finalSeparator: ""
} : this.style === "medium" ? this.parts = {
years: new enyo.g11n.Template(this.rb.$L({
key: "yearsFormatMedium",
value: "##{num} yr"
})),
months: new enyo.g11n.Template(this.rb.$L({
key: "monthsFormatMedium",
value: "##{num} mo"
})),
weeks: new enyo.g11n.Template(this.rb.$L({
key: "weeksFormatMedium",
value: "##{num} wk"
})),
days: new enyo.g11n.Template(this.rb.$L({
key: "daysFormatMedium",
value: "##{num} dy"
})),
hours: new enyo.g11n.Template(this.rb.$L({
key: "hoursFormatMedium",
value: "##{num}"
})),
minutes: new enyo.g11n.Template(this.rb.$L({
key: "minutesFormatMedium",
value: "##{num}"
})),
seconds: new enyo.g11n.Template(this.rb.$L({
key: "secondsFormatMedium",
value: "##{num}"
})),
separator: this.rb.$L({
key: "separatorMedium",
value: " "
}),
dateTimeSeparator: this.rb.$L({
key: "dateTimeSeparatorMedium",
value: " "
}),
longTimeFormat: new enyo.g11n.Template(this.rb.$L({
key: "longTimeFormatMedium",
value: "#{hours}:#{minutes}:#{seconds}"
})),
shortTimeFormat: new enyo.g11n.Template(this.rb.$L({
key: "shortTimeFormatMedium",
value: "#{minutes}:#{seconds}"
})),
finalSeparator: ""
} : this.style === "long" ? this.parts = {
years: new enyo.g11n.Template(this.rb.$L({
key: "yearsFormatLong",
value: "1#1 yr|1>##{num} yrs"
})),
months: new enyo.g11n.Template(this.rb.$L({
key: "monthsFormatLong",
value: "1#1 mon|1>##{num} mos"
})),
weeks: new enyo.g11n.Template(this.rb.$L({
key: "weeksFormatLong",
value: "1#1 wk|1>##{num} wks"
})),
days: new enyo.g11n.Template(this.rb.$L({
key: "daysFormatLong",
value: "1#1 day|1>##{num} dys"
})),
hours: new enyo.g11n.Template(this.rb.$L({
key: "hoursFormatLong",
value: "0#|1#1 hr|1>##{num} hrs"
})),
minutes: new enyo.g11n.Template(this.rb.$L({
key: "minutesFormatLong",
value: "0#|1#1 min|1>##{num} min"
})),
seconds: new enyo.g11n.Template(this.rb.$L({
key: "secondsFormatLong",
value: "0#|1#1 sec|1>##{num} sec"
})),
separator: this.rb.$L({
key: "separatorLong",
value: " "
}),
dateTimeSeparator: this.rb.$L({
key: "dateTimeSeparatorLong",
value: " "
}),
longTimeFormat: "",
shortTimeFormat: "",
finalSeparator: ""
} : this.style === "full" && (this.parts = {
years: new enyo.g11n.Template(this.rb.$L({
key: "yearsFormatFull",
value: "1#1 year|1>##{num} years"
})),
months: new enyo.g11n.Template(this.rb.$L({
key: "monthsFormatFull",
value: "1#1 month|1>##{num} months"
})),
weeks: new enyo.g11n.Template(this.rb.$L({
key: "weeksFormatFull",
value: "1#1 week|1>##{num} weeks"
})),
days: new enyo.g11n.Template(this.rb.$L({
key: "daysFormatFull",
value: "1#1 day|1>##{num} days"
})),
hours: new enyo.g11n.Template(this.rb.$L({
key: "hoursFormatFull",
value: "0#|1#1 hour|1>##{num} hours"
})),
minutes: new enyo.g11n.Template(this.rb.$L({
key: "minutesFormatFull",
value: "0#|1#1 minute|1>##{num} minutes"
})),
seconds: new enyo.g11n.Template(this.rb.$L({
key: "secondsFormatFull",
value: "0#|1#1 second|1>##{num} seconds"
})),
separator: this.rb.$L({
key: "separatorFull",
value: ", "
}),
dateTimeSeparator: this.rb.$L({
key: "dateTimeSeparatorFull",
value: ", "
}),
longTimeFormat: "",
shortTimeFormat: "",
finalSeparator: this.rb.$L({
key: "finalSeparatorFull",
value: " and "
})
}), this.dateParts = [ "years", "months", "weeks", "days" ], this.timeParts = [ "hours", "minutes", "seconds" ];
}, enyo.g11n.DurationFmt.prototype.format = function(e) {
var t = [], n = [], r, i, s, o;
if (!e || enyo.g11n.Char._objectIsEmpty(e)) return "";
for (i = 0; i < this.dateParts.length; i++) s = e[this.dateParts[i]] || 0, s > 0 && (o = this.parts[this.dateParts[i]].formatChoice(s, {
num: s
}), o && o.length > 0 && (t.length > 0 && t.push(this.parts.separator), t.push(o)));
if (this.style === "long" || this.style === "full") for (i = 0; i < this.timeParts.length; i++) s = e[this.timeParts[i]] || 0, s > 0 && (o = this.parts[this.timeParts[i]].formatChoice(s, {
num: s
}), o && o.length > 0 && (n.length > 0 && n.push(this.parts.separator), n.push(o))); else {
var u = {}, a = e.hours ? this.parts.longTimeFormat : this.parts.shortTimeFormat;
for (i = 0; i < this.timeParts.length; i++) {
s = e[this.timeParts[i]] || 0;
if (s < 10) switch (this.timeParts[i]) {
case "minutes":
e.hours && (s = "0" + s);
break;
case "seconds":
s = "0" + s;
break;
case "hours":
}
o = this.parts[this.timeParts[i]].formatChoice(s, {
num: s
}), o && o.length > 0 && (u[this.timeParts[i]] = o);
}
n.push(a.evaluate(u));
}
r = t, r.length > 0 && n.length > 0 && r.push(this.parts.dateTimeSeparator);
for (i = 0; i < n.length; i++) r.push(n[i]);
return r.length > 2 && this.style === "full" && (r[r.length - 2] = this.parts.finalSeparator), r.join("") || "";
};

// Canvas.js

enyo.kind({
name: "enyo.Canvas",
kind: enyo.Control,
tag: "canvas",
attributes: {
width: 500,
height: 500
},
defaultKind: "enyo.canvas.Control",
generateInnerHtml: function() {
return "";
},
teardownChildren: function() {},
rendered: function() {
this.renderChildren();
},
addChild: function() {
enyo.UiComponent.prototype.addChild.apply(this, arguments);
},
removeChild: function() {
enyo.UiComponent.prototype.removeChild.apply(this, arguments);
},
renderChildren: function(e) {
var t = e, n = this.hasNode();
t || n.getContext && (t = n.getContext("2d"));
if (t) for (var r = 0, i; i = this.children[r]; r++) i.render(t);
},
update: function() {
var e = this.hasNode();
if (e.getContext) {
var t = e.getContext("2d"), n = this.getBounds();
t.clearRect(0, 0, n.width, n.height), this.renderChildren(t);
}
}
});

// CanvasControl.js

enyo.kind({
name: "enyo.canvas.Control",
kind: enyo.UiComponent,
defaultKind: "enyo.canvas.Control",
published: {
bounds: null
},
events: {
onRender: ""
},
constructor: function() {
this.bounds = {
l: enyo.irand(400),
t: enyo.irand(400),
w: enyo.irand(100),
h: enyo.irand(100)
}, this.inherited(arguments);
},
importProps: function(e) {
this.inherited(arguments), e && e.bounds && (enyo.mixin(this.bounds, e.bounds), delete e.bounds);
},
renderSelf: function(e) {
this.doRender({
context: e
});
},
render: function(e) {
this.children.length ? this.renderChildren(e) : this.renderSelf(e);
},
renderChildren: function(e) {
for (var t = 0, n; n = this.children[t]; t++) n.render(e);
}
});

// Shape.js

enyo.kind({
name: "enyo.canvas.Shape",
kind: enyo.canvas.Control,
published: {
color: "red",
outlineColor: ""
},
fill: function(e) {
e.fill();
},
outline: function(e) {
e.stroke();
},
draw: function(e) {
this.color && (e.fillStyle = this.color, this.fill(e)), this.outlineColor && (e.strokeStyle = this.outlineColor, this.outline(e));
}
});

// Circle.js

enyo.kind({
name: "enyo.canvas.Circle",
kind: enyo.canvas.Shape,
renderSelf: function(e) {
e.beginPath(), e.arc(this.bounds.l, this.bounds.t, this.bounds.w, 0, Math.PI * 2), this.draw(e);
}
});

// Rectangle.js

enyo.kind({
name: "enyo.canvas.Rectangle",
kind: enyo.canvas.Shape,
published: {
clear: !1
},
renderSelf: function(e) {
this.clear ? e.clearRect(this.bounds.l, this.bounds.t, this.bounds.w, this.bounds.h) : this.draw(e);
},
fill: function(e) {
e.fillRect(this.bounds.l, this.bounds.t, this.bounds.w, this.bounds.h);
},
outline: function(e) {
e.strokeRect(this.bounds.l, this.bounds.t, this.bounds.w, this.bounds.h);
}
});

// Text.js

enyo.kind({
name: "enyo.canvas.Text",
kind: enyo.canvas.Shape,
published: {
text: "",
font: "12pt Arial",
align: "left"
},
renderSelf: function(e) {
e.textAlign = this.align, e.font = this.font, this.draw(e);
},
fill: function(e) {
e.fillText(this.text, this.bounds.l, this.bounds.t);
},
outline: function(e) {
e.strokeText(this.text, this.bounds.l, this.bounds.t);
}
});

// Image.js

enyo.kind({
name: "enyo.canvas.Image",
kind: enyo.canvas.Control,
published: {
src: ""
},
create: function() {
this.image = new Image, this.inherited(arguments), this.srcChanged();
},
srcChanged: function() {
this.src && (this.image.src = this.src);
},
renderSelf: function(e) {
e.drawImage(this.image, this.bounds.l, this.bounds.t);
}
});

// Helper.js

function Helper() {}

Helper.app = "mySongs", Helper.vers = "0.5", Helper.ratio = function() {
var e = enyo.platform;
return e.blackberry ? "2.24" : "1.0";
}, Helper.iconPath = function() {
return "assets/images/" + this.ratio() + "/";
}, Helper.phone = function() {
var e = enyo.platform;
return window.innerWidth < 800 || e.blackberry ? !0 : !1;
}, Helper.browser = function() {
var e = enyo.platform;
return e.chrome || e.firefox || e.safari || e.ie ? !0 : !1;
}, Helper.handleDoubles = function(e) {
var t, n = 1, r = e.length, i = [], s = {};
for (t = 0; t < r; t++) s[e[t]] ? (s[e[t] + n] = t, n += 1) : s[e[t]] = t;
for (t in s) i.push(t);
return i;
}, Helper.removeDoubles = function(e) {
var t, n = 1, r = e.length, i = [], s = {};
for (t = 0; t < r; t++) s[e[t]] ? (s[e[t]] = t, n += 1) : s[e[t]] = t;
for (t in s) i.push(t);
return i;
}, Helper.orderLyrics = function(e, t, n) {
var r = {}, s = this.handleDoubles(t);
for (i = 0; i < t.length; i++) !n && e[t[i]] ? r[s[i]] = [ t[i], e[t[i]][1] ] : n && e[t[i]] && (r[s[i]] = [ t[i].split("_")[0], e[t[i]][1] ]);
return r;
}, Helper.orderLanguage = function(e, t) {
var n = [];
for (i in e) n.push(e[i] + "_" + t);
return n;
}, Helper.insertSame = function(e, t, n, r) {
var s = {};
for (i in e) i === r && t === r ? s[i] = n : i === r && t !== r ? s[t] = n : s[i] = e[i];
return s;
}, Helper.filter = function(e, t, n) {
switch (e) {
case "titles":
return this.searchTitles(t, n);
case "authors":
return this.searchAuthors(t, n);
case "lyrics":
return this.searchLyrics(t, n);
case "keys":
return this.searchKeys(t, n);
}
}, Helper.isIn = function(e, t) {
var n = t.indexOf(e);
return n >= 0;
}, Helper.searchTitles = function(e, t) {
var n = ParseXml.get_titles(t), r = [];
for (j in n) r.push(n[j].title.toLowerCase().replace(/,/g, ""));
return this.isIn(e, r.join()) ? !0 : !1;
}, Helper.searchAuthors = function(e, t) {
var n = ParseXml.authorsToString(ParseXml.get_authors(t)), r = [];
for (j in n) r.push(n[j].toLowerCase());
return this.isIn(e, r.join()) ? !0 : !1;
}, Helper.searchLyrics = function(e, t) {
var n = ParseXml.get_lyrics(t, [ "" ], !1, !0, 0).lyrics, r = [];
for (j in n) r.push(n[j][1].replace(/&nbsp;/g, " ").replace(/(<([^>]+)>)/ig, "").replace(/,/g, "").replace(/\./g, " "));
return enyo.log(r), this.isIn(e, r.join().toLowerCase()) ? !0 : !1;
}, Helper.searchKeys = function(e, t) {
var n = ParseXml.get_themes(t), r = ParseXml.get_comments(t), i = [];
for (j in n) i.push(n[j].theme.toLowerCase());
for (k in r) i.push(r[k].toLowerCase());
return this.isIn(e, i.join()) ? !0 : !1;
}, Helper.setItem = function(e, t) {
localStorage.setItem(e, JSON.stringify(t));
}, Helper.getItem = function(e) {
return JSON.parse(localStorage.getItem(e));
}, Helper.calcNodeOffset = function(e) {
if (e.getBoundingClientRect) {
var t = e.getBoundingClientRect();
return {
left: t.left,
top: t.top,
width: t.width,
height: t.height
};
}
}, Helper.html = function(e) {
return String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}, Helper.logKindTree = function(e, t) {
e.log("========================"), Helper.kindTree(e, 0, t), e.log("========================");
}, Helper.kindTree = function(e, t, n) {
n || (n = 2);
var r = n * t, i = t + ":" + e.name;
for (s = 0; s < r; ++s) i = " " + i;
e.log(i + ", " + e.kind);
var s = 0;
while (s < e.children.length) this.kindTree(e.children[s], t + 1, n), ++s;
};

// ParseXml.js

function ParseXml() {}

function toArray(e) {
for (var t = [], n = e.length; n--; t[n] = e[n]) ;
return t;
}

ParseXml.parse_dom = function(e) {
var t = new DOMParser;
return t.parseFromString(e, "text/xml");
}, ParseXml.get_metadata = function(e, t) {
var n = undefined, r = e.getElementsByTagName(t);
if (r[0]) for (i = 0, len = r.length; i < len; i++) n = r[i].firstChild.nodeValue;
return n;
}, ParseXml.get_titles = function(e) {
var t = [], n = e.getElementsByTagName("title");
if (n[0]) {
for (i = 0, len1 = n.length; i < len1; i++) t.push({
title: n[i].firstChild.nodeValue,
lang: n[i].getAttribute("lang")
});
return t;
}
return !1;
}, ParseXml.titlesToString = function(e, t) {
var n = [];
if (t) for (i = 0, len2 = e.length; i < len2; i++) e[i].lang === t ? n.push(e[i].title) : e[i].lang || n.push(e[i].title); else for (i = 0, len3 = e.length; i < len3; i++) n.push(e[i].title);
return n.join(" &ndash; ");
}, ParseXml.get_authors = function(e) {
var t = [], n = e.getElementsByTagName("author");
if (n[0]) for (i = 0, len3 = n.length; i < len3; i++) {
var r = n[i].getAttribute("type");
r === "translation" ? t.push({
type: r,
author: n[i].firstChild.nodeValue,
lang: n[i].getAttribute("lang")
}) : t.push({
type: r,
author: n[i].firstChild.nodeValue
});
}
return t;
}, ParseXml.authorsToString = function(e) {
var t = [];
for (i = 0, len4 = e.length; i < len4; i++) {
var n = e[i].type;
n === "music" || n === "words" ? t.push($L(n + ":") + e[i].author) : n === "translation" ? t.push($L(n) + " (" + e[i].lang + "): " + e[i].author) : t.push(e[i].author);
}
return t;
}, ParseXml.get_songbooks = function(e) {
var t = [], n = e.getElementsByTagName("songbook");
if (n[0] !== undefined) for (i = 0, len5 = n.length; i < len5; i++) t.push({
book: n[i].getAttribute("name"),
no: n[i].getAttribute("entry")
});
return t;
}, ParseXml.get_themes = function(e) {
var t = [], n = e.getElementsByTagName("theme");
if (n[0] !== undefined) for (i = 0, len6 = n.length; i < len6; i++) t.push({
theme: n[i].firstChild.nodeValue,
lang: n[i].getAttribute("lang")
});
return t;
}, ParseXml.get_comments = function(e) {
var t = [], n = e.getElementsByTagName("comments")[0];
if (n !== undefined) var r = n.getElementsByTagName("comment");
if (r !== undefined) for (i = 0, len7 = r.length; i < len7; i++) t.push(r[i].firstChild.nodeValue);
return t;
}, ParseXml.formatChordDiv = function(e) {
return e.substring(1) ? e = e.charAt(0) + "<small>" + e.substring(1).replace(/([0-9]+)/g, "<sup>$1</sup>") + "</small>" : e = e.charAt(0), e;
}, ParseXml.formatChord = function(e, t) {
return t ? e.indexOf("/") >= 0 ? (e = e.split("/"), ParseXml.formatChordDiv(Transposer.transpose(e[0], t)) + "/" + ParseXml.formatChordDiv(Transposer.transpose(e[1], t))) : ParseXml.formatChordDiv(Transposer.transpose(e, t)) : e.indexOf("/") >= 0 ? (e = e.split("/"), ParseXml.formatChordDiv(e[0]) + "/" + ParseXml.formatChordDiv(e[1])) : ParseXml.formatChordDiv(e);
}, ParseXml.parselines = function(e, t, n, r, i) {
var s = "<div class='text'>", o = !0, u = !1, a = !1, f = "";
for (var l = [], c = e.length; c--; l[c] = e[c]) ;
var h = 0;
while (h < l.length) {
if (t && n) if (l[h].nodeValue === null) if (l[h].tagName === "chord") {
o = !1;
var p = l[h].getAttribute("name");
s = s + "<div class='" + f + "chordbox'><div class='" + f + "chord'>" + ParseXml.formatChord(p, i) + "&nbsp;" + "</div>", !l[h + 1] || l[h + 1].nodeValue !== null && l[h + 1].nodeValue.replace(/^[\s\xA0]+/, "") !== "" ? !l[h + 1] && !o && (s += "<div class='txt'> </div></div>") : s += "<div class='txt'> </div></div>";
} else l[h].tagName === "br" ? (o = !0, s += "<div style='clear:both;'></div>") : l[h].tagName === "comment" && (r ? s += "<i>" + l[h].firstChild.nodeValue + "</i>" : s += "<span style='line-height: 0;'></span>"); else {
var d = l[h].nodeValue.replace(/^[\s\xA0]+/, " ");
if (d !== " ") {
if (o || l[h].nodeType === "mo") d = d.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, "&nbsp;"), barPrefix = d[0] === "|" ? "" : f, s = s + "<div class='" + barPrefix + "chordbox'><div class='chord'>&nbsp;</div>";
if (a && d !== ".") {
var v = d;
d = v[0];
var m = 1;
while (m < v.length) l.splice(h + m, 0, {
nodeValue: v[m],
nodeType: "mo"
}), m++;
}
d = d.replace(/^[\s\xA0]+/, "&nbsp;").replace(/[\s\xA0]+$/, "&nbsp;"), s += "<div class='txt'>" + d + "</div></div>", d[0] === "|" && h == 0 && (a = !0, f = "mo");
}
} else if (t && !n) if (l[h].nodeValue === null) l[h].tagName !== "chord" && (l[h].tagName === "br" ? u ? u = !1 : s += "<br>" : l[h].tagName === "comment" && (r ? s += "<i>" + l[h].firstChild.nodeValue + "</i>" : u = !0)); else {
var d = l[h].nodeValue.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, "&nbsp;");
d !== "" && (s += d);
} else l[h].nodeValue === null ? l[h].tagName === "br" ? u ? u = !1 : s += "<br>" : l[h].tagName === "comment" && (r ? s += "<i>" + l[h].firstChild.nodeValue + "</i>" : u = !0) : s += l[h].nodeValue;
h++;
}
return s += "</div><div style='clear:both;'></div>", s;
}, ParseXml.get_lyrics = function(e, t, n, r, s) {
var o = {}, u = e.getElementsByTagName("verse");
o.lyrics = {};
if (u[0] != undefined) {
var a = !1;
t ? o.verseOrder = !1 : (a = !0, o.verseOrder = []);
for (i = 0, len9 = u.length; i < len9; i++) {
u[i].getElementsByTagName("chord").length > 0 && (o.haschords = !0);
var f = [];
for (k = 0, len10 = u[i].childElementCount; k < len10; k++) f = f.concat(u[i].getElementsByTagName("lines")[k]);
var l = "";
for (m = 0, len11 = f.length; m < len11; m++) f[m].getAttribute("part") !== null && (l += "<font color='#9E0508'><i>" + f[m].getAttribute("part") + "</i></font><br>"), l += ParseXml.parselines(f[m].childNodes, o.haschords, n, r, s);
var c;
u[i].getAttribute("lang") ? c = u[i].getAttribute("name") + "_" + u[i].getAttribute("lang") : c = u[i].getAttribute("name"), o.lyrics[c] = [ u[i].getAttribute("name"), l ], a && o.verseOrder.push(u[i].getAttribute("name"));
}
} else o.lyrics = "nolyrics";
return o;
}, ParseXml.parse = function(e, t, n, r) {
var s = {};
if (e.getElementsByTagName("song")[0].getAttribute("version") != .8) return s.lyrics = "wrongversion", enyo.log($L("wrongversion")), s;
s.titles = this.get_titles(e), s.authors = this.get_authors(e), s.copyright = this.get_metadata(e, "copyright"), s.released = this.get_metadata(e, "released"), s.publisher = this.get_metadata(e, "publisher"), s.duration = this.get_metadata(e, "duration"), this.get_metadata(e, "verseOrder") && (s.verseOrder = this.get_metadata(e, "verseOrder").split(" ")), s.key = this.get_metadata(e, "key"), s.tempo = this.get_metadata(e, "tempo"), s.ccli = this.get_metadata(e, "ccliNo"), s.songbooks = this.get_songbooks(e), s.comments = this.get_comments(e);
var o = this.get_lyrics(e, s.verseOrder, t, n, r);
o.verseOrder && (s.verseOrder = o.verseOrder), s.haschords = o.haschords, s.lyrics = o.lyrics, s.haslang = [];
for (i in s.lyrics) i.split("_")[1] && s.haslang.push(i.split("_")[1]);
return s.haslang = Helper.removeDoubles(s.haslang), s;
}, ParseXml.allMetadata = function(e) {
var t = {};
t.created = e.getElementsByTagName("song")[0].getAttribute("createdIn"), t.titles = this.get_titles(e), t.authors = this.get_authors(e);
var n = [ "copyright", "ccliNo", "released", "transposition", "tempo", "key", "variant", "publisher", "version", "keywords", "verseOrder", "duration" ];
for (i in n) t[n[i]] = this.get_metadata(e, n[i]);
return t.songbooks = this.get_songbooks(e), t.themes = this.get_themes(e), t.comments = this.get_comments(e), t;
}, ParseXml.editLyrics = function(e) {
var t = {}, n = e.getElementsByTagName("verse");
for (i = 0, len12 = n.length; i < len12; i++) {
var r = n[i].getAttribute("name"), s = n[i].getAttribute("lang"), o = {};
o.elname = r, o.language = s;
var u = [];
o.lines = [];
for (k = 0; k < n[i].childElementCount; k++) u = u.concat(n[i].getElementsByTagName("lines")[k]);
var a = new XMLSerializer;
for (m = 0, len13 = u.length; m < len13; m++) {
var l = a.serializeToString(u[m]);
l = l.replace('<lines xmlns="http://openlyrics.info/namespace/2009/song"', "");
var c = l.indexOf(">"), h = l.indexOf("part"), p = "";
h !== -1 && h < c ? (p = l.slice(h, c).split('"')[1], l = l.replace(l.slice(0, c + 1), "")) : l = l.slice(c + 1), l = l.replace("</lines>", "");
var d = [];
for (f in l.split("\n")) d.push(l.split("\n")[f].replace(/^[\s\xA0]+/, ""));
l = d.join(""), l = l.replace(/<chord name="/g, "[").replace(/"\/>/g, "]"), l = l.replace(/<comment>/g, "*").replace(/<\/comment>/g, "*"), o.lines.push({
part: p,
text: l
});
}
s ? t[r + "_" + s] = o : t[r] = o;
}
return t;
};

// Transposer.js

function Transposer() {}

Transposer.chordList = [ {
name: "Ab",
value: 0,
type: "b"
}, {
name: "A",
value: 1,
type: "n"
}, {
name: "Bb",
value: 2,
type: "n"
}, {
name: "B",
value: 3,
type: "n"
}, {
name: "C",
value: 4,
type: "n"
}, {
name: "C#",
value: 5,
type: "#"
}, {
name: "Db",
value: 5,
type: "b"
}, {
name: "D",
value: 6,
type: "n"
}, {
name: "D#",
value: 7,
type: "#"
}, {
name: "Eb",
value: 7,
type: "b"
}, {
name: "E",
value: 8,
type: "n"
}, {
name: "F",
value: 9,
type: "n"
}, {
name: "F#",
value: 10,
type: "#"
}, {
name: "Gb",
value: 10,
type: "b"
}, {
name: "G",
value: 11,
type: "n"
}, {
name: "G#",
value: 0,
type: "#"
} ], Transposer.getValue = function(e) {
for (c in this.chordList) if (this.chordList[c].name === e) return this.chordList[c];
return "?";
}, Transposer.getBase = function(e) {
if (e.charAt(1) === "b" || e.charAt(1) === "#") {
var t = this.getValue(e.substring(0, 2));
return t.rest = e.substring(2), t;
}
var t = this.getValue(e.charAt(0));
return t.rest = e.substring(1), t;
}, Transposer.getNew = function(e, t) {
var n = e.value + t;
n > 11 ? n -= 12 : n < 0 && (n += 12);
for (y in this.chordList) if (this.chordList[y].value === n) {
if (this.chordList[y].type === "n") return this.chordList[y].name;
if (this.chordList[y].type === e.type) return this.chordList[y].name;
if (t > 0 && this.chordList[y].type === "#") return this.chordList[y].name;
if (t < 0 && this.chordList[y].type === "b") return this.chordList[y].name;
}
}, Transposer.transpose = function(e, t) {
var n = this.getBase(e);
if (n.name) {
var r = this.getNew(n, t);
return r + n.rest;
}
return "?";
}, Transposer.getDelta = function(e, t) {
var n = this.getBase(e), r = this.getBase(t);
for (x in this.chordList) if (this.chordList[x].name === n.name) var i = this.chordList[x].value; else if (this.chordList[x].name === r.name) var s = this.chordList[x].value;
return s - i;
};

// WriteXml.js

function WriteXml() {}

WriteXml.date = function() {
var e = new Date;
return e.toISOString();
}, WriteXml.edit = function(e, t, n) {
var r = new XMLWriter("UTF-8", "1.0");
r.indentChar = " ", r.indentation = 2, r.writeStartDocument(), r.writeStartElement("song"), r.writeAttributeString("xmlns", "http://openlyrics.info/namespace/2009/song"), r.writeAttributeString("version", "0.8"), r.writeAttributeString("createdIn", t.created), r.writeAttributeString("modifiedIn", Helper.app + " " + Helper.vers), r.writeAttributeString("modifiedDate", WriteXml.date()), r.writeStartElement("properties"), r.writeStartElement("titles");
for (i in t.titles) r.writeStartElement("title"), t.titles[i].lang && r.writeAttributeString("lang", t.titles[i].lang), r.writeString(t.titles[i].title), r.writeEndElement();
r.writeEndElement(), t.authors[0] && r.writeStartElement("authors");
for (i in t.authors) r.writeStartElement("author"), t.authors[i].type && r.writeAttributeString("type", t.authors[i].type), t.authors[i].lang && r.writeAttributeString("lang", t.authors[i].lang), r.writeString(t.authors[i].author), r.writeEndElement();
t.authors[0] && r.writeEndElement();
var s = [ "copyright", "ccliNo", "released", "transposition", "tempo", "key", "variant", "publisher", "version", "keywords", "verseOrder", "duration" ];
for (i in s) t[s[i]] && r.writeElementString(s[i], t[s[i]]);
t.songbooks[0] && r.writeStartElement("songbooks");
for (i in t.songbooks) r.writeStartElement("songbook"), r.writeAttributeString("name", t.songbooks[i].book), t.songbooks[i].no && r.writeAttributeString("entry", t.songbooks[i].no), r.writeEndElement();
t.songbooks[0] && r.writeEndElement(), t.themes[0] && r.writeStartElement("themes");
for (i in t.themes) r.writeStartElement("theme"), t.themes[i].lang && r.writeAttributeString("lang", t.themes[i].lang), r.writeString(t.themes[i].theme), r.writeEndElement();
t.themes[0] && r.writeEndElement(), t.comments[0] && r.writeStartElement("comments");
for (i in t.comments) r.writeElementString("comment", t.comments[i]);
t.comments[0] && r.writeEndElement(), r.writeEndElement(), r.writeStartElement("lyrics");
for (i in n) {
r.writeStartElement("verse"), r.writeAttributeString("name", n[i].elname), n[i].language && r.writeAttributeString("lang", n[i].language);
for (j in n[i].lines) {
var o = n[i].lines[j];
r.writeStartElement("lines"), o.part && r.writeAttributeString("part", o.part);
var u = o.text.replace(/\[/g, "$[").replace(/\]/g, "]$");
u = u.replace(/<br>/g, "$<br>$").replace(/<comment>/g, "$<comment>"), u = u.replace(/<\/comment>/g, "</comment>$").replace(/&nbsp;/g, " "), u = u.split("$");
var a = "";
for (k in u) u[k].search(/^\[.+\]$/) > -1 ? a += '<chord name="' + u[k].replace(/\[/g, "").replace(/\]/g, "") + '"/>' : u[k].search(/<br>/) > -1 ? a += "<br/>$" : u[k].search(/^\*.+\*$/) > -1 ? a += "<comment>" + u[k].replace(/\*/g, "") + "</comment>" : u[k] && (a += u[k]);
for (m in a.split("$")) r.writeString(a.split("$")[m]);
r.writeEndElement();
}
r.writeEndElement();
}
return r.writeEndElement(), r.writeEndDocument(), r.flush();
}, WriteXml.create = function(e) {
var t = new XMLWriter("UTF-8", "1.0");
return t.indentChar = " ", t.indentation = 2, t.writeStartDocument(), t.writeStartElement("song"), t.writeAttributeString("xmlns", "http://openlyrics.info/namespace/2009/song"), t.writeAttributeString("version", "0.8"), t.writeAttributeString("createdIn", Helper.app + " " + Helper.vers), t.writeAttributeString("modifiedIn", Helper.app + " " + Helper.vers), t.writeAttributeString("modifiedDate", WriteXml.date()), t.writeStartElement("properties"), t.writeStartElement("titles"), t.writeElementString("title", e), t.writeEndElement(), t.writeEndElement(), t.writeStartElement("lyrics"), t.writeStartElement("verse"), t.writeAttributeString("name", "v1"), t.writeElementString("lines", ""), t.writeEndElement(), t.writeEndElement(), t.writeEndElement(), t.writeEndDocument(), t.flush();
};

// cursorScrollBar.js

enyo.kind({
name: "enyo.cursorScrollBar",
kind: "Control",
style: "width: 30px",
components: [ {
kind: "enyo.Canvas",
attributes: {
width: 20,
height: 300
},
components: [ {
name: "cursor",
kind: "cursorImage",
style: "z-index: 99"
} ]
} ],
ms8: 0,
eighthCycle: 0,
start: 0,
counterTime: 0,
elapsed: 0,
timer: 0,
published: {
onColor: "#434437",
offColor: "#D4D7AC"
},
create: function() {
this.inherited(arguments);
},
setY: function(e) {
this.$.cursor.cursorRow = e, this.$.canvas.update();
},
cursorOn: function() {
this.$.cursor.color = this.onColor, this.$.canvas.update();
},
cursorOff: function() {
this.$.cursor.color = this.offColor, this.$.canvas.update();
}
}), enyo.kind({
name: "enyo.cursorImage",
kind: "enyo.canvas.Shape",
published: {
color: "#D4D7AC",
cursorRow: 10
},
renderSelf: function(e) {
e.fillStyle = this.color, e.beginPath(), e.arc(13, this.cursorRow, 6, 1.23, 5.05, !0), e.lineTo(0, this.cursorRow - 11), e.lineTo(0, this.cursorRow + 11), e.closePath(), e.fill();
},
create: function() {
this.inherited(arguments);
},
destroy: function() {
this.inherited(arguments);
}
});

// XMLWriter-1.0.0-min.js

function XMLWriter(e, t) {
e && (this.encoding = e), t && (this.version = t);
}

(function() {
function e(t) {
var n = t.c.length;
while (n--) typeof t.c[n] == "object" && e(t.c[n]);
t.n = t.a = t.c = null;
}
function t(e, n, r, i) {
var s = n + "<" + e.n, o = e.c.length, u, a, f = 0;
for (u in e.a) s += " " + u + '="' + e.a[u] + '"';
s += o ? ">" : " />", i.push(s);
if (o) {
do {
a = e.c[f++];
if (typeof a == "string") {
if (o == 1) return i.push(i.pop() + a + "</" + e.n + ">");
i.push(n + r + a);
} else typeof a == "object" && t(a, n + r, r, i);
} while (f < o);
i.push(n + "</" + e.n + ">");
}
}
XMLWriter.prototype = {
encoding: "ISO-8859-1",
version: "1.0",
formatting: "indented",
indentChar: "	",
indentation: 1,
newLine: "\n",
writeStartDocument: function(e) {
this.close(), this.stack = [], this.standalone = e;
},
writeEndDocument: function() {
this.active = this.root, this.stack = [];
},
writeDocType: function(e) {
this.doctype = e;
},
writeStartElement: function(e, t) {
t && (e = t + ":" + e);
var n = this, r = n.active, i = {
n: e,
a: {},
c: []
};
r ? (r.c.push(i), this.stack.push(r)) : n.root = i, n.active = i;
},
writeEndElement: function() {
this.active = this.stack.pop() || this.root;
},
writeAttributeString: function(e, t) {
this.active && (this.active.a[e] = t);
},
writeString: function(e) {
this.active && this.active.c.push(e);
},
writeElementString: function(e, t, n) {
this.writeStartElement(e, n), this.writeString(t), this.writeEndElement();
},
writeCDATA: function(e) {
this.writeString("<![CDATA[" + e + "]]>");
},
writeComment: function(e) {
this.writeString("<!-- " + e + " -->");
},
flush: function() {
var e = this, n = "", r = "", i = e.indentation, s = e.formatting.toLowerCase() == "indented", o = '<?xml version="' + e.version + '" encoding="' + e.encoding + '"';
e.stack && e.stack[0] && e.writeEndDocument(), e.standalone !== undefined && (o += ' standalone="' + !!e.standalone + '"'), o += " ?>", o = [ o ], e.doctype && e.root && o.push("<!DOCTYPE " + e.root.n + " " + e.doctype + ">");
if (s) while (i--) n += e.indentChar;
return e.root && t(e.root, r, n, o), o.join(s ? e.newLine : "");
},
close: function() {
var t = this;
t.root && e(t.root), t.active = t.root = t.stack = null;
},
getDocument: window.ActiveXObject ? function() {
var e = new ActiveXObject("Microsoft.XMLDOM");
return e.async = !1, e.loadXML(this.flush()), e;
} : function() {
return (new DOMParser).parseFromString(this.flush(), "text/xml");
}
};
})();

// txtConverter.js

function convLyrics(e) {
var t = !1, n = [];
destLyrics = "", verseName = "v", verseNum = 1, verse = 1, chorus = 1, prechorus = 1, bridge = 1, ending = 1, lang = "", lyricLines = e.split(/\r?\n|\r/);
for (r = lyricsStartLine; r < lyricLines.length; r++) lyricLines[r] = lyricLines[r].replace(/\s+$/, "");
if (lyricLines[1] == "" || lyricLines[0][0] == "{") t = !0, doProperties(e);
var r = 0;
while (r < lyricLines.length - 1) lyricLines[r] == "" && lyricLines[r + 1] == "" && lyricLines.splice(r, 1), r++;
var i = !1, s = !1;
destLyrics += "  <lyrics>\n";
while (lyricLines[lyricLines.length - 1] === "") lyricLines.pop();
for (r = lyricsStartLine; r < lyricLines.length; r++) if (!isVerseLine(lyricLines[r])) {
lang = langInLine(lyricLines[r]);
if (lyricLines[r] === "") verseNum = verse, verseName = "v"; else if (lyricLines[r].length > 1) switch (lyricLines[r][1]) {
case "v":
case "V":
verseNum = verse, verseName = "v";
break;
case "c":
case "C":
verseNum = chorus, verseName = "c";
break;
case "b":
case "B":
verseNum = bridge, verseName = "b";
break;
case "e":
case "E":
verseNum = ending, verseName = "e";
break;
case "p":
case "P":
verseNum = prechorus, verseName = "p";
break;
default:
lang = "";
}
r !== lyricsStartLine && (destLyrics += "      </lines>\n    </verse>\n"), openVerse(lang);
} else {
r == lyricsStartLine && openVerse("");
if (!i) i = checkChordsFound(lyricLines[r]), lyricLines[r][0] == "." && i && (lyricLines[r] = lyricLines[r].substring(1, lyricLines[r].length - 1), s = !0); else {
chIdx = 0, chName = "", insIdx = 0;
while (chIdx < lyricLines[r - 1].length) {
if (lyricLines[r - 1][chIdx] != " ") {
chName = "";
while (lyricLines[r - 1][chIdx] != " " && chIdx < lyricLines[r - 1].length) chName += lyricLines[r - 1][chIdx], chIdx++;
var o = lyricLines[r].substring(0, insIdx), u = lyricLines[r].substring(insIdx, lyricLines[r].length), a = '<chord name="' + chName + '"/>';
lyricLines[r] = o + a + u, insIdx = insIdx + a.length + chName.length;
}
chIdx++, insIdx++;
}
i = !1, s = !1;
}
i || (lyricLines[r] = expandChordPro(lyricLines[r]), destLyrics = destLyrics + "        " + lyricLines[r], r == lyricLines.length - 1 || lyricLines[r + 1] == "" || !isVerseLine(lyricLines[r + 1]) ? destLyrics += "\n" : destLyrics += "<br/>\n");
}
return destLyrics += "      </lines>\n    </verse>\n  </lyrics>\n", t && (destLyrics += "</song>"), destLyrics;
}

function langInLine(e) {
var t = e.indexOf("lang="), n = "";
if (t !== -1) {
t += 5;
while (t < e.length && e[t] !== " ") n += e[t], t++;
}
return n;
}

function abbrevDirectives() {
for (i = 0; i < lyricLines.length; i++) if (lyricLines[i][0] === "{") {
var e = lyricLines[i].indexOf("}");
if (e != -1) {
lyricLines[i] = lyricLines[i].slice(0, e + 1);
while (lyricLines[i][e - 1] === " ") lyricLines[i] = lyricLines[i].slice(e - 1, e - 1), e--;
ChordPro = !0;
var t = lyricLines[i].indexOf(":");
if (t == -1) {
var n = lyricLines[i].indexOf(" ");
n !== -1 ? lyricLines[i] = lyricLines[i].replace(" ", ": ") : lyricLines[i] = lyricLines[i].replace("}", ":}"), t = lyricLines[i].indexOf(":");
}
var r = lyricLines[i].slice(1, t), s = r;
switch (r) {
case "title":
s = "t";
break;
case "subtitle":
s = "t";
break;
case "comment":
s = "c";
break;
case "start_of_chorus":
s = "soc";
break;
case "start_of_bridge":
s = "sob";
break;
case "end_of_bridge":
s = "eob";
break;
case "start_of_tab":
s = "sot";
break;
case "end_of_tab":
s = "eot";
break;
default:
}
lyricLines[i] = lyricLines[i].replace(r, s);
}
}
}

function removePrevLine(e) {
e > 2 && chordProLyrics && lyricLines[e - 1] === "" && (lyricLines.splice(e - 1, 1), e--);
}

function convChordPro() {
abbrevDirectives(), chordProLyrics = !1;
var e = 0;
while (e < lyricLines.length) {
var t = lyricLines[e].indexOf(":");
if (t !== -1) {
var n = lyricLines[e].slice(0, lyricLines[e].indexOf(":") + 1);
if (lyricLines[e][0] === "{") switch (n) {
case "{t:":
e === 0 ? lyricLines[e] = lyricLines[e].replace(n, "") : lyricLines[e] = lyricLines[e].replace(n, "title "), lyricLines[e] = lyricLines[e].replace("}", ""), lyricLines[e + 1] === "" && lyricLines.splice(e + 1, 0, "");
break;
case "{c:":
lyricLines[e] = lyricLines[e].replace(n, "comment "), lyricLines[e] = lyricLines[e].replace("}", "");
break;
case "{sob:":
lyricLines[e] = lyricLines[e].replace(n, "[b]"), lyricLines[e].replace("}", ""), removePrevLine(e), chordProLyrics = !0;
break;
case "{soc:":
lyricLines[e] = lyricLines[e].replace(n, "[c]"), lyricLines[e].replace("}", ""), removePrevLine(e), chordProLyrics = !0;
break;
case "{sot:":
lyricLines[e] = lyricLines[e].replace(n, "[v]"), lyricLines[e] = lyricLines[e].replace("}", ""), removePrevLine(e), chordProLyrics = !0;
break;
default:
lyricLines[e] = "";
}
}
e++;
}
}

function doProperties() {
convChordPro(), lyricsStartLine = 0;
var e = 0;
while (e < lyricLines.length - 1) lyricLines[e] == "" && lyricLines[e + 1] == "" && lyricLines.splice(e, 1), e++;
destLyrics += '<?xml version="1.0" encoding="UTF-8" ?>\n', destLyrics += '<song xmlns="http://openlyrics.info/namespace/2009/song"\n', destLyrics += '  version="0.8"\n', destLyrics = destLyrics + '  createdIn="' + Helper.app + " " + Helper.vers + '"\n', destLyrics += '  modifiedIn=""\n', destLyrics += '  modifiedDate="';
var t = new Date;
destLyrics = destLyrics + t.toISOString() + '">\n', destLyrics += "  <properties>\n";
var n = "", r = "";
while (lyricLines[lyricsStartLine + 1] == "") {
lyricsStartLine == 0 ? (n = "title", r = lyricLines[lyricsStartLine]) : (n = lyricLines[lyricsStartLine].slice(0, lyricLines[lyricsStartLine].indexOf(" ")), r = lyricLines[lyricsStartLine].slice(lyricLines[lyricsStartLine].indexOf(" ") + 1, lyricLines[lyricsStartLine].length));
switch (n) {
case "author":
case "title":
case "theme":
lang = langInLine(lyricLines[lyricsStartLine]), lang !== "" && (r = r.replace(" lang=" + lang, ""));
var i = !1;
destLyrics.indexOf("</" + n + ">") == -1 && (i = !0, destLyrics = destLyrics + "    <" + n + "s>\n");
if (i) destLyrics = destLyrics + "      <" + n, lang !== "" && (destLyrics = destLyrics + ' lang="' + lang + '"'), destLyrics = destLyrics + ">" + r + "</" + n + ">\n"; else {
var s = "    </" + n + "s>", o = "      <" + n;
lang !== "" && (o = o + ' lang="' + lang + '"'), o = o + ">" + r + "</" + n + ">\n    </" + n + "s>\n";
var u = destLyrics.indexOf(s), a = destLyrics.substring(0, u), f = destLyrics.substring(u + s.length + 1, destLyrics.length);
destLyrics = a + o + f;
}
i && (destLyrics = destLyrics + "    </" + n + "s>\n", i = !1);
break;
case "tempo":
var l = "0123456789.", c = !0, h;
for (e = 0; e < r.length && c == 1; e++) h = r.charAt(e), l.indexOf(h) == -1 && (c = !1);
var p = "";
c ? p = "bpm" : p = "text", destLyrics = destLyrics + '    <tempo type="' + p + '">' + r + "</tempo>\n";
break;
default:
destLyrics = destLyrics + "    <" + n + ">" + r + "</" + n + ">\n";
}
lyricsStartLine += 2;
}
destLyrics += "  </properties>\n";
}

function isOpenLyricsChord(e) {
return openLyricsChords.indexOf(e) != -1;
}

function checkChordsFound(e) {
if (e == "") return !1;
var t = e;
t = t.replace(/  +/g, " "), t = t.replace(/^\s+|\s+$/g, "");
var n = t.split(" "), r = 0;
for (j = 0; j < n.length; j++) if (isOpenLyricsChord(n[j])) r++; else if (n[j].indexOf("/") != -1) {
var i = n[j].split("/");
i.length == 2 && isOpenLyricsChord(i[0]) != -1 && isOpenLyricsChord(i[1]) && r++;
}
return r / n.length >= .5;
}

function isVerseLine(e) {
return e.length > 5 && e.indexOf("lang=") === -1 || checkChordsFound(e);
}

function openVerse(e) {
destLyrics = destLyrics + '    <verse name="' + verseName + verseNum + '"', e !== "" && (destLyrics = destLyrics + '  lang="' + e + '"'), destLyrics += ">\n      <lines>\n";
switch (verseName) {
case "v":
verse++;
break;
case "c":
chorus++;
break;
case "b":
bridge++;
break;
case "e":
ending++;
break;
case "p":
prechorus++;
break;
default:
}
}

function expandChordPro(e) {
var t = "", n = 0;
while (n < e.length) {
if (e[n] === "[") {
n++, t += '<chord name="';
while (e[n] !== "]" && n < e.length) t += e[n], n++;
t += '"/>';
} else t += e[n];
n++;
}
return t;
}

var lyricLines = new Array, destLyrics = "", lyricsStartLine = 0, ChordPro = !1, chordProLyrics = !1, verseName, verseNum, verse, chorus, prechorus, bridge, ending, chIdx, chName, insIdx, lang, openLyricsChords = "Ab Ab+ Ab4 Ab7 Ab11 Absus Absus4 Abdim Abmaj Abmaj7 Abm Abm7 A A+ A4 A6 A7 A7+ A9 A11 A13 A7sus4 A9sus Asus Asus2 Asus4 Adim Amaj Amaj7 Am A/D A/F# A/G# Am#7 Am6 Am7 Am7sus4 Am9 Am/G Amadd9 Am(add9) A# A#+ A#4 A#7 A#sus A#sus4 A#maj A#maj7 A#dim A#m A#m7 Bb Bb+ Bb4 Bb6 Bb7 Bb9 Bb11 Bbsus Bbsus4 Bbmaj Bbmaj7 Bbdim Bbm Bbm7 Bbm9 B B+ B4 B7 B7+ B7#9 B7(#9) B9 B11 B13 Bsus Bsus4 Bmaj Bmaj7 Bdim Bm B/F# BaddE B(addE) BaddE/F# Bm6 Bm7 Bmmaj7 Bm(maj7) Bmsus9 Bm(sus9) Bm7b5 C C+ C4 C6 C7 C9 C9(11) C11 Csus Csus2 Csus4 Csus9 Cmaj Cmaj7 Cm Cdim C/B Cadd2/B CaddD C(addD) Cadd9 C(add9) Cm7 Cm11 C# C#+ C#4 C#7 C#7(b5) C#sus C#sus4 C#maj C#maj7 C#dim C#m C#add9 C#(add9) C#m7 Db Db+ Db7 Dbsus Dbsus4 Dbmaj Dbmaj7 Dbdim Dbm Dbm7 D D+ D4 D6 D7 D7#9 D7(#9) D9 D11 Dsus Dsus2 Dsus4 D7sus2 D7sus4 Dmaj Dmaj7 Ddim Dm D/A D/B D/C D/C# D/E D/G D5/E Dadd9 D(add9) D9add6 D9(add6) Dm7 Dm#5 Dm(#5) Dm#7 Dm(#7) Dm/A Dm/B Dm/C Dm/C# Dm9 D# D#+ D#4 D#7 D#sus D#sus4 D#maj D#maj7 D#dim D#m D#m7 Eb Eb+ Eb4 Eb7 Ebsus Ebsus4 Ebmaj Ebmaj7 Ebdim Ebadd9 Eb(add9) Ebm Ebm7 E E+ E5 E6 E7 E7#9 E7(#9) E7b9 E7(b9) E7(11) E9 E11 Esus Esus4 Emaj Emaj7 Edim Em Em6 Em7 Em/B Em/D Em7/D Emsus4 Em(sus4) Emadd9 Em(add9) F F+ F4 F6 F7 F9 F11 Fsus Fsus4 Fmaj Fmaj7 Fdim Fm F/A F/C F/D F/G F7/A Fmaj7/A Fmaj7/C Fmaj7(#5) Fadd9 F(add9) FaddG FaddG Fm6 Fm7 Fmmaj7 F# F#+ F#7 F#9 F#11 F#sus F#sus4 F#maj F#maj7 F#dim F#m F#/E F#4 F#m6 F#m7 Gb Gb+ Gb7 Gb9 Gbsus Gbsus4 Gbmaj Gbmaj7 Gbdim Gbm Gbm7 G G+ G4 G6 G7 G7+ G7b9 G7(b9) G7#9 G7(#9) G9 G9(11) G11 Gsus Gsus4 G6sus4 G6(sus4) G7sus4 G7(sus4) Gmaj Gmaj7 Gmaj7sus4 Gmaj9 Gm Gdim Gadd9 G(add9) G/A G/B G/D G/F# Gm6 Gm7 Gm/Bb G# G#+ G#4 G#7 G#sus G#sus4 G#maj G#maj7 G#dim G#m G#m6 G#m7 G#m9maj7 G#m9(maj7)";

// dropbox.js

(function() {
var e, t, n, r, i, s, o, u, a, f, l, c, h, p, d, v, m, g, y, b, w, E, S, x, T, N, C, k, L, A, O, M = [].indexOf || function(e) {
for (var t = 0, n = this.length; t < n; t++) if (t in this && this[t] === e) return t;
return -1;
}, _ = {}.hasOwnProperty, D = function(e, t) {
function r() {
this.constructor = e;
}
for (var n in t) _.call(t, n) && (e[n] = t[n]);
return r.prototype = t.prototype, e.prototype = new r, e.__super__ = t.prototype, e;
};
e = function() {
return null;
}, e.Util = {}, e.EventSource = function() {
function e(e) {
this._cancelable = e && e.cancelable, this._listeners = [];
}
return e.prototype.addListener = function(e) {
if (typeof e != "function") throw new TypeError("Invalid listener type; expected function");
return M.call(this._listeners, e) < 0 && this._listeners.push(e), this;
}, e.prototype.removeListener = function(e) {
var t, n, r, i, s, o;
if (this._listeners.indexOf) n = this._listeners.indexOf(e), n !== -1 && this._listeners.splice(n, 1); else {
o = this._listeners;
for (t = i = 0, s = o.length; i < s; t = ++i) {
r = o[t];
if (r === e) {
this._listeners.splice(t, 1);
break;
}
}
}
return this;
}, e.prototype.dispatch = function(e) {
var t, n, r, i, s;
s = this._listeners;
for (r = 0, i = s.length; r < i; r++) {
t = s[r], n = t(e);
if (this._cancelable && n === !1) return !1;
}
return !0;
}, e;
}(), e.ApiError = function() {
function e(e, t, n) {
var r, i;
this.method = t, this.url = n, this.status = e.status;
if (e.responseType) try {
r = e.response || e.responseText;
} catch (s) {
i = s;
try {
r = e.responseText;
} catch (s) {
i = s, r = null;
}
} else try {
r = e.responseText;
} catch (s) {
i = s, r = null;
}
if (r) try {
this.responseText = r.toString(), this.response = JSON.parse(r);
} catch (s) {
i = s, this.response = null;
} else this.responseText = "(no response)", this.response = null;
}
return e.prototype.status = void 0, e.prototype.method = void 0, e.prototype.url = void 0, e.prototype.responseText = void 0, e.prototype.response = void 0, e.NETWORK_ERROR = 0, e.INVALID_PARAM = 400, e.INVALID_TOKEN = 401, e.OAUTH_ERROR = 403, e.NOT_FOUND = 404, e.INVALID_METHOD = 405, e.RATE_LIMITED = 503, e.OVER_QUOTA = 507, e.prototype.toString = function() {
return "Dropbox API error " + this.status + " from " + this.method + " " + this.url + " :: " + this.responseText;
}, e.prototype.inspect = function() {
return this.toString();
}, e;
}(), e.AuthDriver = function() {
function t() {}
return t.prototype.url = function(t) {
return "https://some.url?dboauth_token=" + e.Xhr.urlEncode(t);
}, t.prototype.doAuthorize = function(e, t, n, r) {
return r("oauth-token");
}, t.prototype.onAuthStateChange = function(e, t) {
return t();
}, t;
}(), e.Drivers = {}, typeof p == "function" && typeof b == "function" ? (p = function(e) {
return window.atob(e);
}, b = function(e) {
return window.btoa(e);
}) : typeof window == "undefined" && typeof self == "undefined" || typeof navigator == "undefined" || typeof navigator.userAgent != "string" ? (p = function(e) {
var t, n;
return t = new Buffer(e, "base64"), function() {
var e, r, i;
i = [];
for (n = e = 0, r = t.length; 0 <= r ? e < r : e > r; n = 0 <= r ? ++e : --e) i.push(String.fromCharCode(t[n]));
return i;
}().join("");
}, b = function(e) {
var t, n;
return t = new Buffer(function() {
var t, r, i;
i = [];
for (n = t = 0, r = e.length; 0 <= r ? t < r : t > r; n = 0 <= r ? ++t : --t) i.push(e.charCodeAt(n));
return i;
}()), t.toString("base64");
}) : (v = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", w = function(e, t, n) {
var r, i;
i = 3 - t, e <<= i * 8, r = 3;
while (r >= i) n.push(v.charAt(e >> r * 6 & 63)), r -= 1;
r = t;
while (r < 3) n.push("="), r += 1;
return null;
}, d = function(e, t, n) {
var r, i;
i = 4 - t, e <<= i * 6, r = 2;
while (r >= i) n.push(String.fromCharCode(e >> 8 * r & 255)), r -= 1;
return null;
}, b = function(e) {
var t, n, r, i, s, o;
i = [], t = 0, n = 0;
for (r = s = 0, o = e.length; 0 <= o ? s < o : s > o; r = 0 <= o ? ++s : --s) t = t << 8 | e.charCodeAt(r), n += 1, n === 3 && (w(t, n, i), t = n = 0);
return n > 0 && w(t, n, i), i.join("");
}, p = function(e) {
var t, n, r, i, s, o, u;
s = [], t = 0, r = 0;
for (i = o = 0, u = e.length; 0 <= u ? o < u : o > u; i = 0 <= u ? ++o : --o) {
n = e.charAt(i);
if (n === "=") break;
t = t << 6 | v.indexOf(n), r += 1, r === 4 && (d(t, r, s), t = r = 0);
}
return r > 0 && d(t, r, s), s.join("");
}), e.Util.atob = p, e.Util.btoa = b, e.Client = function() {
function t(t) {
var n = this;
this.sandbox = t.sandbox || !1, this.apiServer = t.server || this.defaultApiServer(), this.authServer = t.authServer || this.defaultAuthServer(), this.fileServer = t.fileServer || this.defaultFileServer(), this.downloadServer = t.downloadServer || this.defaultDownloadServer(), this.onXhr = new e.EventSource({
cancelable: !0
}), this.onError = new e.EventSource, this.onAuthStateChange = new e.EventSource, this.xhrOnErrorHandler = function(e, t) {
return n.handleXhrError(e, t);
}, this.oauth = new e.Oauth(t), this.driver = null, this.filter = null, this.uid = null, this.authState = null, this.authError = null, this._credentials = null, this.setCredentials(t), this.setupUrls();
}
return t.prototype.authDriver = function(e) {
return this.driver = e, this;
}, t.prototype.onXhr = null, t.prototype.onError = null, t.prototype.onAuthStateChange = null, t.prototype.dropboxUid = function() {
return this.uid;
}, t.prototype.credentials = function() {
return this._credentials || this.computeCredentials(), this._credentials;
}, t.prototype.authenticate = function(e, t) {
var n, i, s, o = this;
!t && typeof e == "function" && (t = e, e = null), e && "interactive" in e ? n = e.interactive : n = !0;
if (!this.driver && this.authState !== r.DONE) throw new Error("Call authDriver to set an authentication driver");
if (this.authState === r.ERROR) throw new Error("Client got in an error state. Call reset() to reuse it!");
return i = null, s = function() {
var e;
if (i !== o.authState) {
i = o.authState;
if (o.driver && o.driver.onAuthStateChange) {
o.driver.onAuthStateChange(o, s);
return;
}
}
switch (o.authState) {
case r.RESET:
if (!n) {
t && t(null, o);
return;
}
return o.requestToken(function(e, t) {
var n, i;
return e ? (o.authError = e, o.authState = r.ERROR) : (n = t.oauth_token, i = t.oauth_token_secret, o.oauth.setToken(n, i), o.authState = r.REQUEST), o._credentials = null, o.onAuthStateChange.dispatch(o), s();
});
case r.REQUEST:
if (!n) {
t && t(null, o);
return;
}
return e = o.authorizeUrl(o.oauth.token), o.driver.doAuthorize(e, o.oauth.token, o.oauth.tokenSecret, function() {
return o.authState = r.AUTHORIZED, o._credentials = null, o.onAuthStateChange.dispatch(o), s();
});
case r.AUTHORIZED:
return o.getAccessToken(function(e, t) {
return e ? (o.authError = e, o.authState = r.ERROR) : (o.oauth.setToken(t.oauth_token, t.oauth_token_secret), o.uid = t.uid, o.authState = r.DONE), o._credentials = null, o.onAuthStateChange.dispatch(o), s();
});
case r.DONE:
t && t(null, o);
break;
case r.SIGNED_OFF:
return o.authState = r.RESET, o.reset(), s();
case r.ERROR:
t && t(o.authError, o);
}
}, s(), this;
}, t.prototype.isAuthenticated = function() {
return this.authState === r.DONE;
}, t.prototype.signOut = function(t) {
var n, i = this;
return n = new e.Xhr("POST", this.urls.signOut), n.signWithOauth(this.oauth), this.dispatchXhr(n, function(e) {
if (e) {
t && t(e);
return;
}
i.authState = r.RESET, i.reset(), i.authState = r.SIGNED_OFF, i.onAuthStateChange.dispatch(i);
if (i.driver && i.driver.onAuthStateChange) return i.driver.onAuthStateChange(i, function() {
if (t) return t(e);
});
if (t) return t(e);
});
}, t.prototype.signOff = function(e) {
return this.signOut(e);
}, t.prototype.getUserInfo = function(t, n) {
var r, i;
return !n && typeof t == "function" && (n = t, t = null), r = !1, t && t.httpCache && (r = !0), i = new e.Xhr("GET", this.urls.accountInfo), i.signWithOauth(this.oauth, r), this.dispatchXhr(i, function(t, r) {
return n(t, e.UserInfo.parse(r), r);
});
}, t.prototype.readFile = function(t, n, r) {
var i, s, o, u, a, f, l;
return !r && typeof n == "function" && (r = n, n = null), s = {}, f = "text", u = null, i = !1, n && (n.versionTag ? s.rev = n.versionTag : n.rev && (s.rev = n.rev), n.arrayBuffer ? f = "arraybuffer" : n.blob ? f = "blob" : n.buffer ? f = "buffer" : n.binary && (f = "b"), n.length ? (n.start != null ? (a = n.start, o = n.start + n.length - 1) : (a = "", o = n.length), u = "bytes=" + a + "-" + o) : n.start != null && (u = "bytes=" + n.start + "-"), n.httpCache && (i = !0)), l = new e.Xhr("GET", "" + this.urls.getFile + "/" + this.urlEncodePath(t)), l.setParams(s).signWithOauth(this.oauth, i), l.setResponseType(f), u && (u && l.setHeader("Range", u), l.reportResponseHeaders()), this.dispatchXhr(l, function(t, n, i, s) {
var o;
return s ? o = e.RangeInfo.parse(s["content-range"]) : o = null, r(t, n, e.Stat.parse(i), o);
});
}, t.prototype.writeFile = function(t, n, r, i) {
var s;
return !i && typeof r == "function" && (i = r, r = null), s = e.Xhr.canSendForms && typeof n == "object", s ? this.writeFileUsingForm(t, n, r, i) : this.writeFileUsingPut(t, n, r, i);
}, t.prototype.writeFileUsingForm = function(t, n, r, i) {
var s, o, u, a;
u = t.lastIndexOf("/"), u === -1 ? (s = t, t = "") : (s = t.substring(u), t = t.substring(0, u)), o = {
file: s
};
if (r) {
r.noOverwrite && (o.overwrite = "false");
if (r.lastVersionTag) o.parent_rev = r.lastVersionTag; else if (r.parentRev || r.parent_rev) o.parent_rev = r.parentRev || r.parent_rev;
}
return a = new e.Xhr("POST", "" + this.urls.postFile + "/" + this.urlEncodePath(t)), a.setParams(o).signWithOauth(this.oauth).setFileField("file", s, n, "application/octet-stream"), delete o.file, this.dispatchXhr(a, function(t, n) {
if (i) return i(t, e.Stat.parse(n));
});
}, t.prototype.writeFileUsingPut = function(t, n, r, i) {
var s, o;
s = {};
if (r) {
r.noOverwrite && (s.overwrite = "false");
if (r.lastVersionTag) s.parent_rev = r.lastVersionTag; else if (r.parentRev || r.parent_rev) s.parent_rev = r.parentRev || r.parent_rev;
}
return o = new e.Xhr("POST", "" + this.urls.putFile + "/" + this.urlEncodePath(t)), o.setBody(n).setParams(s).signWithOauth(this.oauth), this.dispatchXhr(o, function(t, n) {
if (i) return i(t, e.Stat.parse(n));
});
}, t.prototype.resumableUploadStep = function(t, n, r) {
var i, s;
return n ? (i = {
offset: n.offset
}, n.tag && (i.upload_id = n.tag)) : i = {
offset: 0
}, s = new e.Xhr("POST", this.urls.chunkedUpload), s.setBody(t).setParams(i).signWithOauth(this.oauth), this.dispatchXhr(s, function(t, n) {
return t && t.status === e.ApiError.INVALID_PARAM && t.response && t.response.upload_id && t.response.offset ? r(null, e.UploadCursor.parse(t.response)) : r(t, e.UploadCursor.parse(n));
});
}, t.prototype.resumableUploadFinish = function(t, n, r, i) {
var s, o;
!i && typeof r == "function" && (i = r, r = null), s = {
upload_id: n.tag
};
if (r) {
if (r.lastVersionTag) s.parent_rev = r.lastVersionTag; else if (r.parentRev || r.parent_rev) s.parent_rev = r.parentRev || r.parent_rev;
r.noOverwrite && (s.overwrite = "false");
}
return o = new e.Xhr("POST", "" + this.urls.commitChunkedUpload + "/" + this.urlEncodePath(t)), o.setParams(s).signWithOauth(this.oauth), this.dispatchXhr(o, function(t, n) {
if (i) return i(t, e.Stat.parse(n));
});
}, t.prototype.stat = function(t, n, r) {
var i, s, o;
!r && typeof n == "function" && (r = n, n = null), s = {}, i = !1;
if (n) {
n.version != null && (s.rev = n.version);
if (n.removed || n.deleted) s.include_deleted = "true";
n.readDir && (s.list = "true", n.readDir !== !0 && (s.file_limit = n.readDir.toString())), n.cacheHash && (s.hash = n.cacheHash), n.httpCache && (i = !0);
}
return s.include_deleted || (s.include_deleted = "false"), s.list || (s.list = "false"), o = new e.Xhr("GET", "" + this.urls.metadata + "/" + this.urlEncodePath(t)), o.setParams(s).signWithOauth(this.oauth, i), this.dispatchXhr(o, function(t, n) {
var i, s, o;
return o = e.Stat.parse(n), (n != null ? n.contents : void 0) ? i = function() {
var t, r, i, o;
i = n.contents, o = [];
for (t = 0, r = i.length; t < r; t++) s = i[t], o.push(e.Stat.parse(s));
return o;
}() : i = void 0, r(t, o, i);
});
}, t.prototype.readdir = function(e, t, n) {
var r;
!n && typeof t == "function" && (n = t, t = null), r = {
readDir: !0
};
if (t) {
t.limit != null && (r.readDir = t.limit), t.versionTag && (r.versionTag = t.versionTag);
if (t.removed || t.deleted) r.removed = t.removed || t.deleted;
t.httpCache && (r.httpCache = t.httpCache);
}
return this.stat(e, r, function(e, t, r) {
var i, s;
return r ? i = function() {
var e, t, n;
n = [];
for (e = 0, t = r.length; e < t; e++) s = r[e], n.push(s.name);
return n;
}() : i = null, n(e, i, t, r);
});
}, t.prototype.metadata = function(e, t, n) {
return this.stat(e, t, n);
}, t.prototype.makeUrl = function(t, n, r) {
var i, s, o, u, a, f = this;
return !r && typeof n == "function" && (r = n, n = null), n && (n["long"] || n.longUrl || n.downloadHack) ? s = {
short_url: "false"
} : s = {}, t = this.urlEncodePath(t), o = "" + this.urls.shares + "/" + t, i = !1, u = !1, n && (n.downloadHack ? (i = !0, u = !0) : n.download && (i = !0, o = "" + this.urls.media + "/" + t)), a = (new e.Xhr("POST", o)).setParams(s).signWithOauth(this.oauth), this.dispatchXhr(a, function(t, n) {
return u && (n != null ? n.url : void 0) && (n.url = n.url.replace(f.authServer, f.downloadServer)), r(t, e.PublicUrl.parse(n, i));
});
}, t.prototype.history = function(t, n, r) {
var i, s, o;
return !r && typeof n == "function" && (r = n, n = null), s = {}, i = !1, n && (n.limit != null && (s.rev_limit = n.limit), n.httpCache && (i = !0)), o = new e.Xhr("GET", "" + this.urls.revisions + "/" + this.urlEncodePath(t)), o.setParams(s).signWithOauth(this.oauth, i), this.dispatchXhr(o, function(t, n) {
var i, s;
return n ? s = function() {
var t, r, s;
s = [];
for (t = 0, r = n.length; t < r; t++) i = n[t], s.push(e.Stat.parse(i));
return s;
}() : s = void 0, r(t, s);
});
}, t.prototype.revisions = function(e, t, n) {
return this.history(e, t, n);
}, t.prototype.thumbnailUrl = function(e, t) {
var n;
return n = this.thumbnailXhr(e, t), n.paramsToUrl().url;
}, t.prototype.readThumbnail = function(t, n, r) {
var i, s;
return !r && typeof n == "function" && (r = n, n = null), i = "b", n && (n.blob && (i = "blob"), n.arrayBuffer && (i = "arraybuffer"), n.buffer && (i = "buffer")), s = this.thumbnailXhr(t, n), s.setResponseType(i), this.dispatchXhr(s, function(t, n, i) {
return r(t, n, e.Stat.parse(i));
});
}, t.prototype.thumbnailXhr = function(t, n) {
var r, i;
return r = {}, n && (n.format ? r.format = n.format : n.png && (r.format = "png"), n.size && (r.size = n.size)), i = new e.Xhr("GET", "" + this.urls.thumbnails + "/" + this.urlEncodePath(t)), i.setParams(r).signWithOauth(this.oauth);
}, t.prototype.revertFile = function(t, n, r) {
var i;
return i = new e.Xhr("POST", "" + this.urls.restore + "/" + this.urlEncodePath(t)), i.setParams({
rev: n
}).signWithOauth(this.oauth), this.dispatchXhr(i, function(t, n) {
if (r) return r(t, e.Stat.parse(n));
});
}, t.prototype.restore = function(e, t, n) {
return this.revertFile(e, t, n);
}, t.prototype.findByName = function(t, n, r, i) {
var s, o, u;
!i && typeof r == "function" && (i = r, r = null), o = {
query: n
}, s = !1;
if (r) {
r.limit != null && (o.file_limit = r.limit);
if (r.removed || r.deleted) o.include_deleted = !0;
r.httpCache && (s = !0);
}
return u = new e.Xhr("GET", "" + this.urls.search + "/" + this.urlEncodePath(t)), u.setParams(o).signWithOauth(this.oauth, s), this.dispatchXhr(u, function(t, n) {
var r, s;
return n ? s = function() {
var t, i, s;
s = [];
for (t = 0, i = n.length; t < i; t++) r = n[t], s.push(e.Stat.parse(r));
return s;
}() : s = void 0, i(t, s);
});
}, t.prototype.search = function(e, t, n, r) {
return this.findByName(e, t, n, r);
}, t.prototype.makeCopyReference = function(t, n) {
var r;
return r = new e.Xhr("GET", "" + this.urls.copyRef + "/" + this.urlEncodePath(t)), r.signWithOauth(this.oauth), this.dispatchXhr(r, function(t, r) {
return n(t, e.CopyReference.parse(r));
});
}, t.prototype.copyRef = function(e, t) {
return this.makeCopyReference(e, t);
}, t.prototype.pullChanges = function(t, n) {
var r, i;
return !n && typeof t == "function" && (n = t, t = null), t ? t.cursorTag ? r = {
cursor: t.cursorTag
} : r = {
cursor: t
} : r = {}, i = new e.Xhr("POST", this.urls.delta), i.setParams(r).signWithOauth(this.oauth), this.dispatchXhr(i, function(t, r) {
return n(t, e.PulledChanges.parse(r));
});
}, t.prototype.delta = function(e, t) {
return this.pullChanges(e, t);
}, t.prototype.mkdir = function(t, n) {
var r;
return r = new e.Xhr("POST", this.urls.fileopsCreateFolder), r.setParams({
root: this.fileRoot,
path: this.normalizePath(t)
}).signWithOauth(this.oauth), this.dispatchXhr(r, function(t, r) {
if (n) return n(t, e.Stat.parse(r));
});
}, t.prototype.remove = function(t, n) {
var r;
return r = new e.Xhr("POST", this.urls.fileopsDelete), r.setParams({
root: this.fileRoot,
path: this.normalizePath(t)
}).signWithOauth(this.oauth), this.dispatchXhr(r, function(t, r) {
if (n) return n(t, e.Stat.parse(r));
});
}, t.prototype.unlink = function(e, t) {
return this.remove(e, t);
}, t.prototype["delete"] = function(e, t) {
return this.remove(e, t);
}, t.prototype.copy = function(t, n, r) {
var i, s, o;
return !r && typeof i == "function" && (r = i, i = null), s = {
root: this.fileRoot,
to_path: this.normalizePath(n)
}, t instanceof e.CopyReference ? s.from_copy_ref = t.tag : s.from_path = this.normalizePath(t), o = new e.Xhr("POST", this.urls.fileopsCopy), o.setParams(s).signWithOauth(this.oauth), this.dispatchXhr(o, function(t, n) {
if (r) return r(t, e.Stat.parse(n));
});
}, t.prototype.move = function(t, n, r) {
var i, s;
return !r && typeof i == "function" && (r = i, i = null), s = new e.Xhr("POST", this.urls.fileopsMove), s.setParams({
root: this.fileRoot,
from_path: this.normalizePath(t),
to_path: this.normalizePath(n)
}).signWithOauth(this.oauth), this.dispatchXhr(s, function(t, n) {
if (r) return r(t, e.Stat.parse(n));
});
}, t.prototype.reset = function() {
var e;
return this.uid = null, this.oauth.setToken(null, ""), e = this.authState, this.authState = r.RESET, e !== this.authState && this.onAuthStateChange.dispatch(this), this.authError = null, this._credentials = null, this;
}, t.prototype.setCredentials = function(e) {
var t;
return t = this.authState, this.oauth.reset(e), this.uid = e.uid || null, e.authState ? this.authState = e.authState : e.token ? this.authState = r.DONE : this.authState = r.RESET, this.authError = null, this._credentials = null, t !== this.authState && this.onAuthStateChange.dispatch(this), this;
}, t.prototype.appHash = function() {
return this.oauth.appHash();
}, t.prototype.setupUrls = function() {
return this.fileRoot = this.sandbox ? "sandbox" : "dropbox", this.urls = {
requestToken: "" + this.apiServer + "/1/oauth/request_token",
authorize: "" + this.authServer + "/1/oauth/authorize",
accessToken: "" + this.apiServer + "/1/oauth/access_token",
signOut: "" + this.apiServer + "/1/unlink_access_token",
accountInfo: "" + this.apiServer + "/1/account/info",
getFile: "" + this.fileServer + "/1/files/" + this.fileRoot,
postFile: "" + this.fileServer + "/1/files/" + this.fileRoot,
putFile: "" + this.fileServer + "/1/files_put/" + this.fileRoot,
metadata: "" + this.apiServer + "/1/metadata/" + this.fileRoot,
delta: "" + this.apiServer + "/1/delta",
revisions: "" + this.apiServer + "/1/revisions/" + this.fileRoot,
restore: "" + this.apiServer + "/1/restore/" + this.fileRoot,
search: "" + this.apiServer + "/1/search/" + this.fileRoot,
shares: "" + this.apiServer + "/1/shares/" + this.fileRoot,
media: "" + this.apiServer + "/1/media/" + this.fileRoot,
copyRef: "" + this.apiServer + "/1/copy_ref/" + this.fileRoot,
thumbnails: "" + this.fileServer + "/1/thumbnails/" + this.fileRoot,
chunkedUpload: "" + this.fileServer + "/1/chunked_upload",
commitChunkedUpload: "" + this.fileServer + "/1/commit_chunked_upload/" + this.fileRoot,
fileopsCopy: "" + this.apiServer + "/1/fileops/copy",
fileopsCreateFolder: "" + this.apiServer + "/1/fileops/create_folder",
fileopsDelete: "" + this.apiServer + "/1/fileops/delete",
fileopsMove: "" + this.apiServer + "/1/fileops/move"
};
}, t.prototype.authState = null, t.ERROR = 0, t.RESET = 1, t.REQUEST = 2, t.AUTHORIZED = 3, t.DONE = 4, t.SIGNED_OFF = 5, t.prototype.urlEncodePath = function(t) {
return e.Xhr.urlEncodeValue(this.normalizePath(t)).replace(/%2F/gi, "/");
}, t.prototype.normalizePath = function(e) {
var t;
if (e.substring(0, 1) === "/") {
t = 1;
while (e.substring(t, t + 1) === "/") t += 1;
return e.substring(t);
}
return e;
}, t.prototype.requestToken = function(t) {
var n;
return n = (new e.Xhr("POST", this.urls.requestToken)).signWithOauth(this.oauth), this.dispatchXhr(n, t);
}, t.prototype.authorizeUrl = function(t) {
var n, r;
return n = this.driver.url(t), n === null ? r = {
oauth_token: t
} : r = {
oauth_token: t,
oauth_callback: n
}, "" + this.urls.authorize + "?" + e.Xhr.urlEncode(r);
}, t.prototype.getAccessToken = function(t) {
var n;
return n = (new e.Xhr("POST", this.urls.accessToken)).signWithOauth(this.oauth), this.dispatchXhr(n, t);
}, t.prototype.dispatchXhr = function(e, t) {
var n;
return e.setCallback(t), e.onError = this.xhrOnErrorHandler, e.prepare(), n = e.xhr, this.onXhr.dispatch(e) && e.send(), n;
}, t.prototype.handleXhrError = function(t, n) {
var i = this;
if (t.status === e.ApiError.INVALID_TOKEN && this.authState === r.DONE) {
this.authError = t, this.authState = r.ERROR, this.onAuthStateChange.dispatch(this);
if (this.driver && this.driver.onAuthStateChange) return this.driver.onAuthStateChange(this, function() {
return i.onError.dispatch(t), n(t);
}), null;
}
return this.onError.dispatch(t), n(t), null;
}, t.prototype.defaultApiServer = function() {
return "https://api.dropbox.com";
}, t.prototype.defaultAuthServer = function() {
return this.apiServer.replace("api.", "www.");
}, t.prototype.defaultFileServer = function() {
return this.apiServer.replace("api.", "api-content.");
}, t.prototype.defaultDownloadServer = function() {
return this.apiServer.replace("api.", "dl.");
}, t.prototype.computeCredentials = function() {
var e;
return e = {
key: this.oauth.key,
sandbox: this.sandbox
}, this.oauth.secret && (e.secret = this.oauth.secret), this.oauth.token && (e.token = this.oauth.token, e.tokenSecret = this.oauth.tokenSecret), this.uid && (e.uid = this.uid), this.authState !== r.ERROR && this.authState !== r.RESET && this.authState !== r.DONE && this.authState !== r.SIGNED_OFF && (e.authState = this.authState), this.apiServer !== this.defaultApiServer() && (e.server = this.apiServer), this.authServer !== this.defaultAuthServer() && (e.authServer = this.authServer), this.fileServer !== this.defaultFileServer() && (e.fileServer = this.fileServer), this.downloadServer !== this.defaultDownloadServer() && (e.downloadServer = this.downloadServer), this._credentials = e;
}, t;
}(), r = e.Client, e.Drivers.BrowserBase = function() {
function t(e) {
this.rememberUser = (e != null ? e.rememberUser : void 0) || !1, this.useQuery = (e != null ? e.useQuery : void 0) || !1, this.scope = (e != null ? e.scope : void 0) || "default", this.storageKey = null, this.dbTokenRe = new RegExp("(#|\\?|&)dboauth_token=([^&#]+)(&|#|$)"), this.rejectedRe = new RegExp("(#|\\?|&)not_approved=true(&|#|$)"), this.tokenRe = new RegExp("(#|\\?|&)oauth_token=([^&#]+)(&|#|$)");
}
return t.prototype.onAuthStateChange = function(e, t) {
var n = this;
this.setStorageKey(e);
switch (e.authState) {
case r.RESET:
return this.loadCredentials(function(r) {
return r ? r.authState ? (e.setCredentials(r), t()) : n.rememberUser ? (e.setCredentials(r), e.getUserInfo(function(r) {
return r ? (e.reset(), n.forgetCredentials(t)) : t();
})) : n.forgetCredentials(t) : t();
});
case r.REQUEST:
return this.storeCredentials(e.credentials(), t);
case r.DONE:
if (this.rememberUser) return this.storeCredentials(e.credentials(), t);
return this.forgetCredentials(t);
case r.SIGNED_OFF:
return this.forgetCredentials(t);
case r.ERROR:
return this.forgetCredentials(t);
default:
return t(), this;
}
}, t.prototype.setStorageKey = function(e) {
return this.storageKey = "dropbox-auth:" + this.scope + ":" + e.appHash(), this;
}, t.prototype.storeCredentials = function(e, t) {
return localStorage.setItem(this.storageKey, JSON.stringify(e)), t(), this;
}, t.prototype.loadCredentials = function(e) {
var t, n;
n = localStorage.getItem(this.storageKey);
if (!n) return e(null), this;
try {
e(JSON.parse(n));
} catch (r) {
t = r, e(null);
}
return this;
}, t.prototype.forgetCredentials = function(e) {
return localStorage.removeItem(this.storageKey), e(), this;
}, t.prototype.computeUrl = function(e) {
var t, n, r, i;
return i = "_dropboxjs_scope=" + encodeURIComponent(this.scope) + "&dboauth_token=", n = e, n.indexOf("#") === -1 ? t = null : (r = n.split("#", 2), n = r[0], t = r[1]), this.useQuery ? (n.indexOf("?") === -1 ? n += "?" + i : n += "&" + i, t ? [ n, "#" + t ] : [ n, "" ]) : [ n + "#?" + i, "" ];
}, t.prototype.locationToken = function(t) {
var n, r, i;
return n = t || e.Drivers.BrowserBase.currentLocation(), i = "_dropboxjs_scope=" + encodeURIComponent(this.scope) + "&", (typeof n.indexOf == "function" ? n.indexOf(i) : void 0) === -1 ? null : this.rejectedRe.test(n) ? (r = this.dbTokenRe.exec(n), r ? decodeURIComponent(r[2]) : null) : (r = this.tokenRe.exec(n), r ? decodeURIComponent(r[2]) : null);
}, t.currentLocation = function() {
return window.location.href;
}, t;
}(), e.Drivers.Redirect = function(t) {
function n(t) {
var r;
n.__super__.constructor.call(this, t), r = this.computeUrl(e.Drivers.BrowserBase.currentLocation()), this.receiverUrl1 = r[0], this.receiverUrl2 = r[1];
}
return D(n, t), n.prototype.onAuthStateChange = function(e, t) {
var i, s = this;
return i = function() {
return function() {
return n.__super__.onAuthStateChange.call(s, e, t);
};
}(), this.setStorageKey(e), e.authState === r.RESET ? this.loadCredentials(function(e) {
return e && e.authState ? e.token === s.locationToken() && e.authState === r.REQUEST ? (e.authState = r.AUTHORIZED, s.storeCredentials(e, i)) : s.forgetCredentials(i) : i();
}) : i();
}, n.prototype.url = function(e) {
return this.receiverUrl1 + encodeURIComponent(e) + this.receiverUrl2;
}, n.prototype.doAuthorize = function(e) {
return window.location.assign(e);
}, n;
}(e.Drivers.BrowserBase), e.Drivers.Popup = function(t) {
function n(e) {
var t;
n.__super__.constructor.call(this, e), t = this.computeUrl(this.baseUrl(e)), this.receiverUrl1 = t[0], this.receiverUrl2 = t[1];
}
return D(n, t), n.prototype.onAuthStateChange = function(e, t) {
var i, s = this;
return i = function() {
return function() {
return n.__super__.onAuthStateChange.call(s, e, t);
};
}(), this.setStorageKey(e), e.authState === r.RESET ? this.loadCredentials(function(e) {
return e && e.authState ? s.forgetCredentials(i) : i();
}) : i();
}, n.prototype.doAuthorize = function(e, t, n, r) {
return this.listenForMessage(t, r), this.openWindow(e);
}, n.prototype.url = function(e) {
return this.receiverUrl1 + encodeURIComponent(e) + this.receiverUrl2;
}, n.prototype.baseUrl = function(t) {
var n;
if (t) {
if (t.receiverUrl) return t.receiverUrl;
if (t.receiverFile) return n = e.Drivers.BrowserBase.currentLocation().split("/"), n[n.length - 1] = t.receiverFile, n.join("/");
}
return e.Drivers.BrowserBase.currentLocation();
}, n.prototype.openWindow = function(e) {
return window.open(e, "_dropboxOauthSigninWindow", this.popupWindowSpec(980, 700));
}, n.prototype.popupWindowSpec = function(e, t) {
var n, r, i, s, o, u, a, f, l, c;
return o = (a = window.screenX) != null ? a : window.screenLeft, u = (f = window.screenY) != null ? f : window.screenTop, s = (l = window.outerWidth) != null ? l : document.documentElement.clientWidth, n = (c = window.outerHeight) != null ? c : document.documentElement.clientHeight, r = Math.round(o + (s - e) / 2), i = Math.round(u + (n - t) / 2.5), r < o && (r = o), i < u && (i = u), "width=" + e + ",height=" + t + "," + ("left=" + r + ",top=" + i) + "dialog=yes,dependent=yes,scrollbars=yes,location=yes";
}, n.prototype.listenForMessage = function(t, n) {
var r, i = this;
return r = function(s) {
var o;
s.data ? o = s.data : o = s;
if (i.locationToken(o) === t) return t = null, window.removeEventListener("message", r), e.Drivers.Popup.onMessage.removeListener(r), n();
}, window.addEventListener("message", r, !1), e.Drivers.Popup.onMessage.addListener(r);
}, n.oauthReceiver = function() {
return window.addEventListener("load", function() {
var e, t, n;
n = window.opener, window.parent !== window.top && (n || (n = window.parent));
if (n) {
try {
n.postMessage(window.location.href, "*");
} catch (r) {
t = r;
}
try {
n.Dropbox.Drivers.Popup.onMessage.dispatch(window.location.href);
} catch (r) {
e = r;
}
}
return window.close();
});
}, n.onMessage = new e.EventSource, n;
}(e.Drivers.BrowserBase), t = null, n = null, typeof chrome != "undefined" && chrome !== null && (chrome.runtime && (chrome.runtime.onMessage && (t = chrome.runtime.onMessage), chrome.runtime.sendMessage && (n = function(e) {
return chrome.runtime.sendMessage(e);
})), chrome.extension && (chrome.extension.onMessage && (t || (t = chrome.extension.onMessage)), chrome.extension.sendMessage && (n || (n = function(e) {
return chrome.extension.sendMessage(e);
}))), t || function() {
var t, n;
n = function(t) {
return t.Dropbox ? (e.Drivers.Chrome.prototype.onMessage = t.Dropbox.Drivers.Chrome.onMessage, e.Drivers.Chrome.prototype.sendMessage = t.Dropbox.Drivers.Chrome.sendMessage) : (t.Dropbox = e, e.Drivers.Chrome.prototype.onMessage = new e.EventSource, e.Drivers.Chrome.prototype.sendMessage = function(t) {
return e.Drivers.Chrome.prototype.onMessage.dispatch(t);
});
};
if (chrome.extension && chrome.extension.getBackgroundPage) if (t = chrome.extension.getBackgroundPage()) return n(t);
if (chrome.runtime && chrome.runtime.getBackgroundPage) return chrome.runtime.getBackgroundPage(function(e) {
return n(e);
});
}()), e.Drivers.Chrome = function(r) {
function i(e) {
var t, n;
i.__super__.constructor.call(this, e), t = e && e.receiverPath || "chrome_oauth_receiver.html", this.rememberUser = !0, this.useQuery = !0, n = this.computeUrl(this.expandUrl(t)), this.receiverUrl = n[0], this.receiverUrl2 = n[1], this.storageKey = "dropbox_js_" + this.scope + "_credentials";
}
return D(i, r), i.prototype.onMessage = t, i.prototype.sendMessage = n, i.prototype.expandUrl = function(e) {
return chrome.runtime && chrome.runtime.getURL ? chrome.runtime.getURL(e) : chrome.extension && chrome.extension.getURL ? chrome.extension.getURL(e) : e;
}, i.prototype.onAuthStateChange = function(t, n) {
var r = this;
switch (t.authState) {
case e.Client.RESET:
return this.loadCredentials(function(e) {
if (e) {
if (e.authState) return r.forgetCredentials(n);
t.setCredentials(e);
}
return n();
});
case e.Client.DONE:
return this.storeCredentials(t.credentials(), n);
case e.Client.SIGNED_OFF:
return this.forgetCredentials(n);
case e.Client.ERROR:
return this.forgetCredentials(n);
default:
return n();
}
}, i.prototype.doAuthorize = function(e, t, n, r) {
var i, s, o, u, a = this;
return ((s = chrome.identity) != null ? s.launchWebAuthFlow : void 0) ? chrome.identity.launchWebAuthFlow({
url: e,
interactive: !0
}, function(e) {
if (a.locationToken(e) === t) return r();
}) : ((o = chrome.experimental) != null ? (u = o.identity) != null ? u.launchWebAuthFlow : void 0 : void 0) ? chrome.experimental.identity.launchWebAuthFlow({
url: e,
interactive: !0
}, function(e) {
if (a.locationToken(e) === t) return r();
}) : (i = {
handle: null
}, this.listenForMessage(t, i, r), this.openWindow(e, function(e) {
return i.handle = e;
}));
}, i.prototype.openWindow = function(e, t) {
return chrome.tabs && chrome.tabs.create ? (chrome.tabs.create({
url: e,
active: !0,
pinned: !1
}, function(e) {
return t(e);
}), this) : this;
}, i.prototype.closeWindow = function(e) {
return chrome.tabs && chrome.tabs.remove && e.id ? (chrome.tabs.remove(e.id), this) : chrome.app && chrome.app.window && e.close ? (e.close(), this) : this;
}, i.prototype.url = function(e) {
return this.receiverUrl + encodeURIComponent(e);
}, i.prototype.listenForMessage = function(e, t, n) {
var r, i = this;
return r = function(s, o) {
if (o && o.tab && o.tab.url.substring(0, i.receiverUrl.length) !== i.receiverUrl) return;
if (!s.dropbox_oauth_receiver_href) return;
if (i.locationToken(s.dropbox_oauth_receiver_href) === e) return t.handle && i.closeWindow(t.handle), i.onMessage.removeListener(r), n();
}, this.onMessage.addListener(r);
}, i.prototype.storeCredentials = function(e, t) {
var n;
return n = {}, n[this.storageKey] = e, chrome.storage.local.set(n, t), this;
}, i.prototype.loadCredentials = function(e) {
var t = this;
return chrome.storage.local.get(this.storageKey, function(n) {
return e(n[t.storageKey] || null);
}), this;
}, i.prototype.forgetCredentials = function(e) {
return chrome.storage.local.remove(this.storageKey, e), this;
}, i.oauthReceiver = function() {
return window.addEventListener("load", function() {
var t;
t = new e.Drivers.Chrome, t.sendMessage({
dropbox_oauth_receiver_href: window.location.href
});
if (window.close) return window.close();
});
}, i;
}(e.Drivers.BrowserBase), e.Drivers.Cordova = function(e) {
function t(e) {
this.rememberUser = (e != null ? e.rememberUser : void 0) || !1, this.scope = (e != null ? e.scope : void 0) || "default";
}
return D(t, e), t.prototype.doAuthorize = function(e, t, n, r) {
var i, s, o, u;
return s = window.open(e, "_blank", "location=yes"), u = !1, i = /^[^/]*\/\/[^/]*\//.exec(e)[0], o = function(t) {
if (t.url === e && u === !1) {
u = !0;
return;
}
if (t.url && t.url.substring(0, i.length) !== i) {
u = !1;
return;
}
if (t.type === "exit" || u) return s.removeEventListener("loadstop", o), s.removeEventListener("exit", o), t.type !== "exit" && s.close(), r();
}, s.addEventListener("loadstop", o), s.addEventListener("exit", o);
}, t.prototype.url = function() {
return null;
}, t.prototype.onAuthStateChange = function(e, n) {
var i, s = this;
return i = function() {
return function() {
return t.__super__.onAuthStateChange.call(s, e, n);
};
}(), this.setStorageKey(e), e.authState === r.RESET ? this.loadCredentials(function(e) {
return e && e.authState ? s.forgetCredentials(i) : i();
}) : i();
}, t;
}(e.Drivers.BrowserBase), e.Drivers.NodeServer = function() {
function e(e) {
this.port = (e != null ? e.port : void 0) || 8912, this.faviconFile = (e != null ? e.favicon : void 0) || null, this.fs = require("fs"), this.http = require("http"), this.open = require("open"), this.callbacks = {}, this.nodeUrl = require("url"), this.createApp();
}
return e.prototype.url = function(e) {
return "http://localhost:" + this.port + "/oauth_callback?dboauth_token=" + encodeURIComponent(e);
}, e.prototype.doAuthorize = function(e, t, n, r) {
return this.callbacks[t] = r, this.openBrowser(e);
}, e.prototype.openBrowser = function(e) {
if (!e.match(/^https?:\/\//)) throw new Error("Not a http/https URL: " + e);
return "BROWSER" in process.env ? this.open(e, process.env.BROWSER) : this.open(e);
}, e.prototype.createApp = function() {
var e = this;
return this.app = this.http.createServer(function(t, n) {
return e.doRequest(t, n);
}), this.app.listen(this.port);
}, e.prototype.closeServer = function() {
return this.app.close();
}, e.prototype.doRequest = function(e, t) {
var n, r, i, s, o = this;
return s = this.nodeUrl.parse(e.url, !0), s.pathname === "/oauth_callback" && (s.query.not_approved === "true" ? (r = !0, i = s.query.dboauth_token) : (r = !1, i = s.query.oauth_token), this.callbacks[i] && (this.callbacks[i](r), delete this.callbacks[i])), n = "", e.on("data", function(e) {
return n += e;
}), e.on("end", function() {
return o.faviconFile && s.pathname === "/favicon.ico" ? o.sendFavicon(t) : o.closeBrowser(t);
});
}, e.prototype.closeBrowser = function(e) {
var t;
return t = '<!doctype html>\n<script type="text/javascript">window.close();</script>\n<p>Please close this window.</p>', e.writeHead(200, {
"Content-Length": t.length,
"Content-Type": "text/html"
}), e.write(t), e.end();
}, e.prototype.sendFavicon = function(e) {
return this.fs.readFile(this.faviconFile, function(t, n) {
return e.writeHead(200, {
"Content-Length": n.length,
"Content-Type": "image/x-icon"
}), e.write(n), e.end();
});
}, e;
}(), m = function(e, t) {
return h(x(L(e), L(t), e.length, t.length));
}, g = function(e) {
return h(k(L(e), e.length));
};
if (typeof require != "undefined") try {
E = require("crypto"), E.createHmac && E.createHash && (m = function(e, t) {
var n;
return n = E.createHmac("sha1", t), n.update(e), n.digest("base64");
}, g = function(e) {
var t;
return t = E.createHash("sha1"), t.update(e), t.digest("base64");
});
} catch (P) {
N = P;
}
e.Util.hmac = m, e.Util.sha1 = g, x = function(e, t, n, r) {
var i, s, o, u;
return t.length > 16 && (t = k(t, r)), o = function() {
var e, n;
n = [];
for (s = e = 0; e < 16; s = ++e) n.push(t[s] ^ 909522486);
return n;
}(), u = function() {
var e, n;
n = [];
for (s = e = 0; e < 16; s = ++e) n.push(t[s] ^ 1549556828);
return n;
}(), i = k(o.concat(e), 64 + n), k(u.concat(i), 84);
}, k = function(e, t) {
var n, r, i, s, o, u, a, f, l, h, p, d, v, m, g, y, b, w;
e[t >> 2] |= 1 << 31 - ((t & 3) << 3), e[(t + 8 >> 6 << 4) + 15] = t << 3, y = Array(80), n = 1732584193, i = -271733879, o = -1732584194, a = 271733878, l = -1009589776, d = 0, g = e.length;
while (d < g) {
r = n, s = i, u = o, f = a, h = l;
for (v = w = 0; w < 80; v = ++w) v < 16 ? y[v] = e[d + v] : y[v] = C(y[v - 3] ^ y[v - 8] ^ y[v - 14] ^ y[v - 16], 1), v < 20 ? (p = i & o | ~i & a, m = 1518500249) : v < 40 ? (p = i ^ o ^ a, m = 1859775393) : v < 60 ? (p = i & o | i & a | o & a, m = -1894007588) : (p = i ^ o ^ a, m = -899497514), b = c(c(C(n, 5), p), c(c(l, y[v]), m)), l = a, a = o, o = C(i, 30), i = n, n = b;
n = c(n, r), i = c(i, s), o = c(o, u), a = c(a, f), l = c(l, h), d += 16;
}
return [ n, i, o, a, l ];
}, C = function(e, t) {
return e << t | e >>> 32 - t;
}, c = function(e, t) {
var n, r;
return r = (e & 65535) + (t & 65535), n = (e >> 16) + (t >> 16) + (r >> 16), n << 16 | r & 65535;
}, h = function(e) {
var t, n, r, i, s;
i = "", t = 0, r = e.length * 4;
while (t < r) n = t, s = (e[n >> 2] >> (3 - (n & 3) << 3) & 255) << 16, n += 1, s |= (e[n >> 2] >> (3 - (n & 3) << 3) & 255) << 8, n += 1, s |= e[n >> 2] >> (3 - (n & 3) << 3) & 255, i += O[s >> 18 & 63], i += O[s >> 12 & 63], t += 1, t >= r ? i += "=" : i += O[s >> 6 & 63], t += 1, t >= r ? i += "=" : i += O[s & 63], t += 1;
return i;
}, O = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", L = function(e) {
var t, n, r, i, s;
t = [], r = 255;
for (n = i = 0, s = e.length; 0 <= s ? i < s : i > s; n = 0 <= s ? ++i : --i) t[n >> 2] |= (e.charCodeAt(n) & r) << (3 - (n & 3) << 3);
return t;
}, e.Oauth = function() {
function t(e) {
this.key = this.k = null, this.secret = this.s = null, this.token = null, this.tokenSecret = null, this._appHash = null, this.reset(e);
}
return t.prototype.reset = function(e) {
var t, n, r, i;
if (e.secret) this.k = this.key = e.key, this.s = this.secret = e.secret, this._appHash = null; else if (e.key) this.key = e.key, this.secret = null, r = p(S(this.key).split("|", 2)[1]), i = r.split("?", 2), t = i[0], n = i[1], this.k = decodeURIComponent(t), this.s = decodeURIComponent(n), this._appHash = null; else if (!this.k) throw new Error("No API key supplied");
return e.token ? this.setToken(e.token, e.tokenSecret) : this.setToken(null, "");
}, t.prototype.setToken = function(t, n) {
if (t && !n) throw new Error("No secret supplied with the user token");
return this.token = t, this.tokenSecret = n || "", this.hmacKey = e.Xhr.urlEncodeValue(this.s) + "&" + e.Xhr.urlEncodeValue(n), null;
}, t.prototype.authHeader = function(t, n, r) {
var i, s, o, u, a, f;
this.addAuthParams(t, n, r), s = [];
for (o in r) u = r[o], o.substring(0, 6) === "oauth_" && s.push(o);
s.sort(), i = [];
for (a = 0, f = s.length; a < f; a++) o = s[a], i.push(e.Xhr.urlEncodeValue(o) + '="' + e.Xhr.urlEncodeValue(r[o]) + '"'), delete r[o];
return "OAuth " + i.join(",");
}, t.prototype.addAuthParams = function(e, t, n) {
return this.boilerplateParams(n), n.oauth_signature = this.signature(e, t, n), n;
}, t.prototype.boilerplateParams = function(t) {
return t.oauth_consumer_key = this.k, t.oauth_nonce = e.Oauth.nonce(), t.oauth_signature_method = "HMAC-SHA1", this.token && (t.oauth_token = this.token), t.oauth_timestamp = Math.floor(Date.now() / 1e3), t.oauth_version = "1.0", t;
}, t.nonce = function() {
return Math.random().toString(36);
}, t.prototype.signature = function(t, n, r) {
var i;
return i = t.toUpperCase() + "&" + e.Xhr.urlEncodeValue(n) + "&" + e.Xhr.urlEncodeValue(e.Xhr.urlEncode(r)), m(i, this.hmacKey);
}, t.prototype.appHash = function() {
return this._appHash ? this._appHash : this._appHash = g(this.k).replace(/\=/g, "");
}, t;
}(), Date.now == null && (Date.now = function() {
return (new Date).getTime();
}), S = function(e, t) {
var n, r, i, s, o, u, a, f, l, c, h, d;
t ? (t = [ encodeURIComponent(e), encodeURIComponent(t) ].join("?"), e = function() {
var t, r, i;
i = [];
for (n = t = 0, r = e.length / 2; 0 <= r ? t < r : t > r; n = 0 <= r ? ++t : --t) i.push((e.charCodeAt(n * 2) & 15) * 16 + (e.charCodeAt(n * 2 + 1) & 15));
return i;
}()) : (c = e.split("|", 2), e = c[0], t = c[1], e = p(e), e = function() {
var t, r, i;
i = [];
for (n = t = 0, r = e.length; 0 <= r ? t < r : t > r; n = 0 <= r ? ++t : --t) i.push(e.charCodeAt(n));
return i;
}(), t = p(t)), s = function() {
d = [];
for (f = 0; f < 256; f++) d.push(f);
return d;
}.apply(this), u = 0;
for (o = l = 0; l < 256; o = ++l) u = (u + s[n] + e[o % e.length]) % 256, h = [ s[u], s[o] ], s[o] = h[0], s[u] = h[1];
return o = u = 0, i = function() {
var e, n, i, f;
f = [];
for (a = e = 0, n = t.length; 0 <= n ? e < n : e > n; a = 0 <= n ? ++e : --e) o = (o + 1) % 256, u = (u + s[o]) % 256, i = [ s[u], s[o] ], s[o] = i[0], s[u] = i[1], r = s[(s[o] + s[u]) % 256], f.push(String.fromCharCode((r ^ t.charCodeAt(a)) % 256));
return f;
}(), e = function() {
var t, r, i;
i = [];
for (n = t = 0, r = e.length; 0 <= r ? t < r : t > r; n = 0 <= r ? ++t : --t) i.push(String.fromCharCode(e[n]));
return i;
}(), [ b(e.join("")), b(i.join("")) ].join("|");
}, e.Util.encodeKey = S, e.PulledChanges = function() {
function t(t) {
var n;
this.blankSlate = t.reset || !1, this.cursorTag = t.cursor, this.shouldPullAgain = t.has_more, this.shouldBackOff = !this.shouldPullAgain, t.cursor && t.cursor.length ? this.changes = function() {
var r, i, s, o;
s = t.entries, o = [];
for (r = 0, i = s.length; r < i; r++) n = s[r], o.push(e.PullChange.parse(n));
return o;
}() : this.changes = [];
}
return t.parse = function(t) {
return t && typeof t == "object" ? new e.PulledChanges(t) : t;
}, t.prototype.blankSlate = void 0, t.prototype.cursorTag = void 0, t.prototype.changes = void 0, t.prototype.shouldPullAgain = void 0, t.prototype.shouldBackOff = void 0, t.prototype.cursor = function() {
return this.cursorTag;
}, t;
}(), e.PullChange = function() {
function t(t) {
this.path = t[0], this.stat = e.Stat.parse(t[1]), this.stat ? this.wasRemoved = !1 : (this.stat = null, this.wasRemoved = !0);
}
return t.parse = function(t) {
return t && typeof t == "object" ? new e.PullChange(t) : t;
}, t.prototype.path = void 0, t.prototype.wasRemoved = void 0, t.prototype.stat = void 0, t;
}(), e.RangeInfo = function() {
function t(e) {
var t;
(t = /^bytes (\d*)-(\d*)\/(.*)$/.exec(e)) ? (this.start = parseInt(t[1]), this.end = parseInt(t[2]), t[3] === "*" ? this.size = null : this.size = parseInt(t[3])) : (this.start = 0, this.end = 0, this.size = null);
}
return t.parse = function(t) {
return typeof t == "string" ? new e.RangeInfo(t) : t;
}, t.prototype.start = null, t.prototype.size = null, t.prototype.end = null, t;
}(), e.PublicUrl = function() {
function t(e, t) {
this.url = e.url, this.expiresAt = new Date(Date.parse(e.expires)), t === !0 ? this.isDirect = !0 : t === !1 ? this.isDirect = !1 : "direct" in e ? this.isDirect = e.direct : this.isDirect = Date.now() - this.expiresAt <= 864e5, this.isPreview = !this.isDirect, this._json = null;
}
return t.parse = function(t, n) {
return t && typeof t == "object" ? new e.PublicUrl(t, n) : t;
}, t.prototype.url = null, t.prototype.expiresAt = null, t.prototype.isDirect = null, t.prototype.isPreview = null, t.prototype.json = function() {
return this._json || (this._json = {
url: this.url,
expires: this.expiresAt.toString(),
direct: this.isDirect
});
}, t;
}(), e.CopyReference = function() {
function t(e) {
typeof e == "object" ? (this.tag = e.copy_ref, this.expiresAt = new Date(Date.parse(e.expires)), this._json = e) : (this.tag = e, this.expiresAt = new Date(Math.ceil(Date.now() / 1e3) * 1e3), this._json = null);
}
return t.parse = function(t) {
return !t || typeof t != "object" && typeof t != "string" ? t : new e.CopyReference(t);
}, t.prototype.tag = null, t.prototype.expiresAt = null, t.prototype.json = function() {
return this._json || (this._json = {
copy_ref: this.tag,
expires: this.expiresAt.toString()
});
}, t;
}(), e.Stat = function() {
function t(e) {
var t, n, r, i;
this._json = e, this.path = e.path, this.path.substring(0, 1) !== "/" && (this.path = "/" + this.path), t = this.path.length - 1, t >= 0 && this.path.substring(t) === "/" && (this.path = this.path.substring(0, t)), n = this.path.lastIndexOf("/"), this.name = this.path.substring(n + 1), this.isFolder = e.is_dir || !1, this.isFile = !this.isFolder, this.isRemoved = e.is_deleted || !1, this.typeIcon = e.icon, ((r = e.modified) != null ? r.length : void 0) ? this.modifiedAt = new Date(Date.parse(e.modified)) : this.modifiedAt = null, ((i = e.client_mtime) != null ? i.length : void 0) ? this.clientModifiedAt = new Date(Date.parse(e.client_mtime)) : this.clientModifiedAt = null;
switch (e.root) {
case "dropbox":
this.inAppFolder = !1;
break;
case "app_folder":
this.inAppFolder = !0;
break;
default:
this.inAppFolder = null;
}
this.size = e.bytes || 0, this.humanSize = e.size || "", this.hasThumbnail = e.thumb_exists || !1, this.isFolder ? (this.versionTag = e.hash, this.mimeType = e.mime_type || "inode/directory") : (this.versionTag = e.rev, this.mimeType = e.mime_type || "application/octet-stream");
}
return t.parse = function(t) {
return t && typeof t == "object" ? new e.Stat(t) : t;
}, t.prototype.path = null, t.prototype.name = null, t.prototype.inAppFolder = null, t.prototype.isFolder = null, t.prototype.isFile = null, t.prototype.isRemoved = null, t.prototype.typeIcon = null, t.prototype.versionTag = null, t.prototype.mimeType = null, t.prototype.size = null, t.prototype.humanSize = null, t.prototype.hasThumbnail = null, t.prototype.modifiedAt = null, t.prototype.clientModifiedAt = null, t.prototype.json = function() {
return this._json;
}, t;
}(), e.UploadCursor = function() {
function t(e) {
this.replace(e);
}
return t.parse = function(t) {
return !t || typeof t != "object" && typeof t != "string" ? t : new e.UploadCursor(t);
}, t.prototype.tag = null, t.prototype.offset = null, t.prototype.expiresAt = null, t.prototype.json = function() {
return this._json || (this._json = {
upload_id: this.tag,
offset: this.offset,
expires: this.expiresAt.toString()
});
}, t.prototype.replace = function(e) {
return typeof e == "object" ? (this.tag = e.upload_id || null, this.offset = e.offset || 0, this.expiresAt = new Date(Date.parse(e.expires) || Date.now()), this._json = e) : (this.tag = e || null, this.offset = 0, this.expiresAt = new Date(Math.floor(Date.now() / 1e3) * 1e3), this._json = null), this;
}, t;
}(), e.UserInfo = function() {
function t(e) {
var t;
this._json = e, this.name = e.display_name, this.email = e.email, this.countryCode = e.country || null, this.uid = e.uid.toString(), e.public_app_url ? (this.publicAppUrl = e.public_app_url, t = this.publicAppUrl.length - 1, t >= 0 && this.publicAppUrl.substring(t) === "/" && (this.publicAppUrl = this.publicAppUrl.substring(0, t))) : this.publicAppUrl = null, this.referralUrl = e.referral_link, this.quota = e.quota_info.quota, this.privateBytes = e.quota_info.normal || 0, this.sharedBytes = e.quota_info.shared || 0, this.usedQuota = this.privateBytes + this.sharedBytes;
}
return t.parse = function(t) {
return t && typeof t == "object" ? new e.UserInfo(t) : t;
}, t.prototype.name = null, t.prototype.email = null, t.prototype.countryCode = null, t.prototype.uid = null, t.prototype.referralUrl = null, t.prototype.publicAppUrl = null, t.prototype.quota = null, t.prototype.usedQuota = null, t.prototype.privateBytes = null, t.prototype.sharedBytes = null, t.prototype.json = function() {
return this._json;
}, t;
}(), typeof XMLHttpRequest == "undefined" || typeof window == "undefined" && typeof self == "undefined" || typeof navigator == "undefined" || typeof navigator.userAgent != "string" ? (a = require("xhr2"), u = !1, s = !1, o = !1) : (typeof XDomainRequest == "undefined" || "withCredentials" in new XMLHttpRequest ? (a = XMLHttpRequest, u = !1, s = typeof FormData != "undefined" && navigator.userAgent.indexOf("Firefox") === -1) : (a = XDomainRequest, u = !0, s = !1), o = !0);
if (typeof Uint8Array == "undefined") i = null, l = !1, f = !1; else {
Object.getPrototypeOf ? i = Object.getPrototypeOf(Object.getPrototypeOf(new Uint8Array(0))).constructor : Object.__proto__ && (i = (new Uint8Array(0)).__proto__.__proto__.constructor);
if (typeof Blob == "undefined") l = !1, f = !0; else {
try {
(new Blob([ new Uint8Array(2) ])).size === 2 ? (l = !0, f = !0) : (f = !1, l = (new Blob([ new ArrayBuffer(2) ])).size === 2);
} catch (P) {
y = P, f = !1, l = !1, typeof WebKitBlobBuilder != "undefined" && navigator.userAgent.indexOf("Android") !== -1 && (s = !1);
}
i === Object && (f = !1);
}
}
e.Xhr = function() {
function t(e, t) {
this.method = e, this.isGet = this.method === "GET", this.url = t, this.wantHeaders = !1, this.headers = {}, this.params = null, this.body = null, this.preflight = !this.isGet && this.method !== "POST", this.signed = !1, this.completed = !1, this.responseType = null, this.callback = null, this.xhr = null, this.onError = null;
}
return t.Request = a, t.ieXdr = u, t.canSendForms = s, t.doesPreflight = o, t.ArrayBufferView = i, t.sendArrayBufferView = f, t.wrapBlob = l, t.prototype.xhr = null, t.prototype.onError = null, t.prototype.setParams = function(e) {
if (this.signed) throw new Error("setParams called after addOauthParams or addOauthHeader");
if (this.params) throw new Error("setParams cannot be called twice");
return this.params = e, this;
}, t.prototype.setCallback = function(e) {
return this.callback = e, this;
}, t.prototype.signWithOauth = function(t, n) {
return e.Xhr.ieXdr ? this.addOauthParams(t) : this.preflight || !e.Xhr.doesPreflight ? this.addOauthHeader(t) : this.isGet && n ? this.addOauthHeader(t) : this.addOauthParams(t);
}, t.prototype.addOauthParams = function(e) {
if (this.signed) throw new Error("Request already has an OAuth signature");
return this.params || (this.params = {}), e.addAuthParams(this.method, this.url, this.params), this.signed = !0, this;
}, t.prototype.addOauthHeader = function(e) {
if (this.signed) throw new Error("Request already has an OAuth signature");
return this.params || (this.params = {}), this.signed = !0, this.setHeader("Authorization", e.authHeader(this.method, this.url, this.params));
}, t.prototype.setBody = function(e) {
if (this.isGet) throw new Error("setBody cannot be called on GET requests");
if (this.body !== null) throw new Error("Request already has a body");
return typeof e != "string" && (typeof FormData != "undefined" && e instanceof FormData || (this.headers["Content-Type"] = "application/octet-stream", this.preflight = !0)), this.body = e, this;
}, t.prototype.setResponseType = function(e) {
return this.responseType = e, this;
}, t.prototype.setHeader = function(e, t) {
var n;
if (this.headers[e]) throw n = this.headers[e], new Error("HTTP header " + e + " already set to " + n);
if (e === "Content-Type") throw new Error("Content-Type is automatically computed based on setBody");
return this.preflight = !0, this.headers[e] = t, this;
}, t.prototype.reportResponseHeaders = function() {
return this.wantHeaders = !0;
}, t.prototype.setFileField = function(t, n, r, i) {
var s, o, u, a;
if (this.body !== null) throw new Error("Request already has a body");
if (this.isGet) throw new Error("setFileField cannot be called on GET requests");
if (typeof r == "object") {
typeof ArrayBuffer != "undefined" && (r instanceof ArrayBuffer ? e.Xhr.sendArrayBufferView && (r = new Uint8Array(r)) : !e.Xhr.sendArrayBufferView && r.byteOffset === 0 && r.buffer instanceof ArrayBuffer && (r = r.buffer)), i || (i = "application/octet-stream");
try {
r = new Blob([ r ], {
type: i
});
} catch (f) {
y = f;
if (window.WebKitBlobBuilder) {
u = new WebKitBlobBuilder, u.append(r);
if (s = u.getBlob(i)) r = s;
}
}
typeof File != "undefined" && r instanceof File && (r = new Blob([ r ], {
type: r.type
})), a = r instanceof Blob;
} else a = !1;
return a ? (this.body = new FormData, this.body.append(t, r, n)) : (i || (i = "application/octet-stream"), o = this.multipartBoundary(), this.headers["Content-Type"] = "multipart/form-data; boundary=" + o, this.body = [ "--", o, "\r\n", 'Content-Disposition: form-data; name="', t, '"; filename="', n, '"\r\n', "Content-Type: ", i, "\r\n", "Content-Transfer-Encoding: binary\r\n\r\n", r, "\r\n", "--", o, "--", "\r\n" ].join(""));
}, t.prototype.multipartBoundary = function() {
return [ Date.now().toString(36), Math.random().toString(36) ].join("----");
}, t.prototype.paramsToUrl = function() {
var t;
return this.params && (t = e.Xhr.urlEncode(this.params), t.length !== 0 && (this.url = [ this.url, "?", t ].join("")), this.params = null), this;
}, t.prototype.paramsToBody = function() {
if (this.params) {
if (this.body !== null) throw new Error("Request already has a body");
if (this.isGet) throw new Error("paramsToBody cannot be called on GET requests");
this.headers["Content-Type"] = "application/x-www-form-urlencoded", this.body = e.Xhr.urlEncode(this.params), this.params = null;
}
return this;
}, t.prototype.prepare = function() {
var t, n, r, i, s = this;
n = e.Xhr.ieXdr, this.isGet || this.body !== null || n ? (this.paramsToUrl(), this.body !== null && typeof this.body == "string" && (this.headers["Content-Type"] = "text/plain; charset=utf8")) : this.paramsToBody(), this.xhr = new e.Xhr.Request, n ? (this.xhr.onload = function() {
return s.onXdrLoad();
}, this.xhr.onerror = function() {
return s.onXdrError();
}, this.xhr.ontimeout = function() {
return s.onXdrError();
}, this.xhr.onprogress = function() {}) : this.xhr.onreadystatechange = function() {
return s.onReadyStateChange();
}, this.xhr.open(this.method, this.url, !0);
if (!n) {
i = this.headers;
for (t in i) {
if (!_.call(i, t)) continue;
r = i[t], this.xhr.setRequestHeader(t, r);
}
}
return this.responseType && (this.responseType === "b" ? this.xhr.overrideMimeType && this.xhr.overrideMimeType("text/plain; charset=x-user-defined") : this.xhr.responseType = this.responseType), this;
}, t.prototype.send = function(t) {
var n, r;
this.callback = t || this.callback;
if (this.body !== null) {
n = this.body, e.Xhr.sendArrayBufferView ? n instanceof ArrayBuffer && (n = new Uint8Array(n)) : n.byteOffset === 0 && n.buffer instanceof ArrayBuffer && (n = n.buffer);
try {
this.xhr.send(n);
} catch (i) {
r = i;
if (!!e.Xhr.sendArrayBufferView || !e.Xhr.wrapBlob) throw r;
n = new Blob([ n ], {
type: "application/octet-stream"
}), this.xhr.send(n);
}
} else this.xhr.send();
return this;
}, t.urlEncode = function(e) {
var t, n, r;
t = [];
for (n in e) r = e[n], t.push(this.urlEncodeValue(n) + "=" + this.urlEncodeValue(r));
return t.sort().join("&");
}, t.urlEncodeValue = function(e) {
return encodeURIComponent(e.toString()).replace(/\!/g, "%21").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A");
}, t.urlDecode = function(e) {
var t, n, r, i, s, o;
n = {}, o = e.split("&");
for (i = 0, s = o.length; i < s; i++) r = o[i], t = r.split("="), n[decodeURIComponent(t[0])] = decodeURIComponent(t[1]);
return n;
}, t.prototype.onReadyStateChange = function() {
var t, n, r, i, s, o, u, a, f, l, c, h;
if (this.xhr.readyState !== 4) return !0;
if (this.completed) return !0;
this.completed = !0;
if (this.xhr.status < 200 || this.xhr.status >= 300) return n = new e.ApiError(this.xhr, this.method, this.url), this.onError ? this.onError(n, this.callback) : this.callback(n), !0;
this.wantHeaders ? (t = this.xhr.getAllResponseHeaders(), t ? s = e.Xhr.parseResponseHeaders(t) : s = this.guessResponseHeaders(), f = s["x-dropbox-metadata"]) : (s = void 0, f = this.xhr.getResponseHeader("x-dropbox-metadata"));
if (f != null ? f.length : void 0) try {
a = JSON.parse(f);
} catch (p) {
u = p, a = void 0;
} else a = void 0;
if (this.responseType) {
if (this.responseType === "b") {
i = this.xhr.responseText != null ? this.xhr.responseText : this.xhr.response, r = [];
for (o = c = 0, h = i.length; 0 <= h ? c < h : c > h; o = 0 <= h ? ++c : --c) r.push(String.fromCharCode(i.charCodeAt(o) & 255));
l = r.join(""), this.callback(null, l, a, s);
} else this.callback(null, this.xhr.response, a, s);
return !0;
}
l = this.xhr.responseText != null ? this.xhr.responseText : this.xhr.response;
switch (this.xhr.getResponseHeader("Content-Type")) {
case "application/x-www-form-urlencoded":
this.callback(null, e.Xhr.urlDecode(l), a, s);
break;
case "application/json":
case "text/javascript":
this.callback(null, JSON.parse(l), a, s);
break;
default:
this.callback(null, l, a, s);
}
return !0;
}, t.parseResponseHeaders = function(e) {
var t, n, r, i, s, o, u, a;
r = {}, n = e.split("\n");
for (u = 0, a = n.length; u < a; u++) i = n[u], t = i.indexOf(":"), s = i.substring(0, t).trim().toLowerCase(), o = i.substring(t + 1).trim(), r[s] = o;
return r;
}, t.prototype.guessResponseHeaders = function() {
var e, t, n, r, i, s;
e = {}, s = [ "cache-control", "content-language", "content-range", "content-type", "expires", "last-modified", "pragma", "x-dropbox-metadata" ];
for (r = 0, i = s.length; r < i; r++) t = s[r], n = this.xhr.getResponseHeader(t), n && (e[t] = n);
return e;
}, t.prototype.onXdrLoad = function() {
var t, n, r;
if (this.completed) return !0;
this.completed = !0, r = this.xhr.responseText, this.wantHeaders ? t = {
"content-type": this.xhr.contentType
} : t = void 0, n = void 0;
if (this.responseType) return this.callback(null, r, n, t), !0;
switch (this.xhr.contentType) {
case "application/x-www-form-urlencoded":
this.callback(null, e.Xhr.urlDecode(r), n, t);
break;
case "application/json":
case "text/javascript":
this.callback(null, JSON.parse(r), n, t);
break;
default:
this.callback(null, r, n, t);
}
return !0;
}, t.prototype.onXdrError = function() {
var t;
return this.completed ? !0 : (this.completed = !0, t = new e.ApiError(this.xhr, this.method, this.url), this.onError ? this.onError(t, this.callback) : this.callback(t), !0);
}, t;
}();
if (typeof module != "undefined" && "exports" in module) module.exports = e; else if (typeof window != "undefined" && window !== null) if (window.Dropbox) for (T in e) {
if (!_.call(e, T)) continue;
A = e[T], window.Dropbox[T] = A;
} else window.Dropbox = e; else {
if (typeof self == "undefined" || self === null) throw new Error("This library only supports node.js and modern browsers.");
self.Dropbox = e;
}
}).call(this);

// dropboxHelper.js

function dropboxHelper() {}

dropboxHelper.client = {}, dropboxHelper.connect = function(e, t) {
var n = this, r = new Dropbox.Client({
key: "lpeVNiL3tbA=|x788bF+1BPiRNPVBsEVpNQMzzXxnRQvH+i19rNMJ+Q==",
sandbox: !0
});
Helper.browser() ? r.authDriver(new Dropbox.Drivers.Popup({
receiverUrl: "https://dl.dropbox.com/u/1429945/MySongBook/index.html",
rememberUser: !0
})) : r.authDriver(new Dropbox.Drivers.Cordova({
receiverUrl: "https://dl.dropbox.com/u/1429945/MySongBook/index.html",
rememberUser: !0
})), r.authenticate(function(r, i) {
enyo.log(i), r ? t(n.showError(r)) : (n.client = i, i.getUserInfo(function(r, i) {
r ? t(n.showError(r)) : (enyo.log(i.name + $L(" connected to Dropbox")), e());
}));
});
}, dropboxHelper.showError = function(e) {
switch (e.status) {
case 401:
return "The user token expired.";
case 404:
return "The file or folder you tried to access is not in the user's Dropbox.";
case 507:
return "The user is over their Dropbox quota.";
case 503:
return "Too many API requests.";
case 400:
return "Bad input parameter";
case 403:
return "Bad OAuth request.";
case 405:
return "Request method not expected";
default:
return "An error occured! Please refresh the library";
}
}, dropboxHelper.readDir = function(e, t) {
dropboxHelper.client.readdir("/", function(n, r) {
n ? t(dropboxHelper.showError(n)) : e(r);
});
}, dropboxHelper.readFile = function(e, t, n) {
dropboxHelper.client.readFile(e, function(r, i, s) {
r ? n(dropboxHelper.showError(r)) : t(i, e, s.modifiedAt);
});
}, dropboxHelper.writeFile = function(e, t, n, r, i) {
dropboxHelper.client.writeFile(e, t, function(s, o) {
s ? i(dropboxHelper.showError(s)) : r(o.modifiedAt, e, t, n);
});
}, dropboxHelper.deleteFile = function(e, t, n) {
dropboxHelper.client.remove(e, function(r, i) {
r ? n(dropboxHelper.showError(r)) : t(i, e);
});
}, dropboxHelper.signOut = function(e) {
var t = this;
return this.client.signOut(function(t) {
t ? enyo.log(dropboxHelper.showError(t)) : e();
});
};

// database-enyo.js

enyo.kind({
name: "onecrayon.Database",
kind: enyo.Component,
published: {
database: "",
version: "1",
estimatedSize: null,
debug: !1
},
db: undefined,
dbVersion: null,
lastInsertRowId: 0,
constructor: function() {
this.inherited(arguments), this.bound = {
setSchema: enyo.bind(this, this.setSchema),
insertData: enyo.bind(this, this.insertData),
_errorHandler: enyo.bind(this, this._errorHandler)
}, this.lastInsertID = this.lastInsertId, this.setSchemaFromURL = this.setSchemaFromUrl, this.insertDataFromURL = this.insertDataFromUrl, this.changeVersionWithSchemaFromURL = this.changeVersionWithSchemaFromUrl;
},
create: function() {
this.inherited(arguments);
if (this.database === "") return this.error("Database: you must define a name for your database when instantiating the kind using the `database` property."), null;
this.database.indexOf("ext:") !== 0 && this.warn("Database: you are working with an internal database, which will limit its size to 1 MB. Prepend `ext:` to your database name to remove this restriction."), this.db = openDatabase(this.database, this.version, "", this.estimatedSize);
if (!this.db) return this.error("Database: failed to open database named " + this.database), null;
this.dbVersion = this.db.version;
},
getVersion: function() {
return this.dbVersion;
},
lastInsertId: function() {
return this.lastInsertRowId;
},
close: function() {
this.db.close();
},
remove: function(e) {
this.error("Database: there is currently no way to destroy a database. Hopefully we will be able to add this in the future.");
},
query: function(e, t) {
if (!this.db) {
this._db_lost();
return;
}
var t = typeof t != "undefined" ? t : {};
enyo.isString(e) || (t.values = e.values, e = e.sql), t = this._getOptions(t, {
values: []
}), e = e.replace(/^\s+|\s+$/g, ""), e.lastIndexOf(";") !== e.length - 1 && (e += ";");
var n = this;
this.db.transaction(function(r) {
n.debug && n.log(e, " ==> ", t.values), r.executeSql(e, t.values, function(e, r) {
try {
n.lastInsertRowId = r.insertId;
} catch (i) {}
t.onSuccess && t.onSuccess(n._convertResultSet(r));
}, t.onError);
});
},
queries: function(e, t) {
if (!this.db) {
this._db_lost();
return;
}
var t = typeof t != "undefined" ? t : {};
t = this._getOptions(t);
var n = this.debug, r = this;
this.db.transaction(function(i) {
var s = e.length, o = null, u = "", a = [];
for (var f = 0; f < s; f++) o = e[f], enyo.isString(o) ? u = o : (u = o.sql, a = o.values), n && r.log(u, " ==> ", a), f === s - 1 ? i.executeSql(u, a, t.onSuccess) : i.executeSql(u, a);
}, t.onError);
},
setSchema: function(e, t) {
enyo.isArray(e) || (e = [ e ]);
var t = typeof t != "undefined" ? t : {};
t = this._getOptions(t);
var n = [], r = [], i = e.length, s = null;
for (var o = 0; o < i; o++) s = e[o], enyo.isString(s) ? n.push(s) : (typeof s.columns != "undefined" && n.push(this.getCreateTable(s.table, s.columns)), typeof s.data != "undefined" && r.push({
table: s.table,
data: s.data
}));
if (r.length > 0) {
var u = enyo.bind(this, this.insertData, r, t);
this.queries(n, {
onSuccess: u,
onError: t.onError
});
} else this.queries(n, t);
},
setSchemaFromUrl: function(e, t) {
this._readUrl(e, this.bound.setSchema, t);
},
insertData: function(e, t) {
enyo.isArray(e) || (e = [ e ]);
var t = typeof t != "undefined" ? t : {};
t = this._getOptions(t);
var n = [], r = e.length, i = null, s, o, u = 0, a = null;
for (s = 0; s < r; s++) {
i = e[s];
if (typeof i.data != "undefined") {
var f = i.table, l = null;
enyo.isArray(i.data) ? l = i.data : l = [ i.data ], u = l.length;
for (o = 0; o < u; o++) a = l[o], n.push(this.getInsert(f, a));
}
}
this.queries(n, t);
},
insertDataFromUrl: function(e, t) {
this._readUrl(e, this.bound.insertData, t);
},
changeVersion: function(e) {
arguments.length > 1 && (e = arguments[1]);
var t = this;
this.db.changeVersion(this.dbVersion, e, function() {}, function() {
t.debug && t.error("DATABASE VERSION UPDATE FAILED: " + e);
}, function() {
t.debug && t.log("DATABASE VERSION UPDATE SUCCESS: " + e);
}), this.dbVersion = e;
},
changeVersionWithSchema: function(e, t, n) {
enyo.isArray(t) || (t = [ t ]);
var n = typeof n != "undefined" ? n : {};
n = this._getOptions(n), this.db.changeVersion(this.dbVersion, e, enyo.bind(this, function(e) {
var n = t.length, r = null, i = null, s = null, o = null;
for (var u = 0; u < n; u++) r = t[u], enyo.isString(r) ? i = r : typeof r.columns != "undefined" && (i = this.getCreateTable(r.table, r.columns)), s = enyo.isString(i) ? i : i.sql, o = typeof i.values != "undefined" ? i.values : null, this.debug && this.log(s, " ==> ", o), o !== null ? e.executeSql(s, o) : e.executeSql(s);
}), n.onError, enyo.bind(this, this._versionChanged, e, n.onSuccess));
},
changeVersionWithSchemaFromUrl: function(e, t, n) {
this._readUrl(t, enyo.bind(this, this.changeVersionWithSchema, e));
},
getInsert: function(e, t) {
var n = "INSERT INTO " + e + " (", r = " VALUES (", i = [];
for (var s in t) i.push(t[s]), n += s, r += "?", n += ", ", r += ", ";
return n = n.substr(0, n.length - 2) + ")", r = r.substr(0, r.length - 2) + ")", n += r, new onecrayon.DatabaseQuery({
sql: n,
values: i
});
},
getSelect: function(e, t, n) {
var r = "SELECT ", i = "";
if (t === null || t === "") i = "*"; else if (enyo.isArray(t)) {
var s = t.length, i = [];
for (var o = 0; o < s; o++) i.push(t[o]);
i = i.join(", ");
}
r += i + " FROM " + e;
if (typeof n != "undefined") {
r += " WHERE ";
var u = [], a = [];
for (var f in n) u.push(n[f]), a.push(f + " = ?");
r += a.join(" AND ");
}
return new onecrayon.DatabaseQuery({
sql: r,
values: u
});
},
getUpdate: function(e, t, n) {
var r = "UPDATE " + e + " SET ", i = [], s = [];
for (var o in t) s.push(o + " = ?"), i.push(t[o]);
r += s.join(", "), r += " WHERE ";
var u = [];
for (var o in n) u.push(o + " = ?"), i.push(n[o]);
return r += u.join(" AND "), new onecrayon.DatabaseQuery({
sql: r,
values: i
});
},
getDelete: function(e, t) {
var n = "DELETE FROM " + e + " WHERE ", r = [], i = [];
for (var s in t) i.push(s + " = ?"), r.push(t[s]);
return n += i.join(" AND "), new onecrayon.DatabaseQuery({
sql: n,
values: r
});
},
getCreateTable: function(e, t, n) {
var n = typeof n != "undefined" ? n : !0, r = "CREATE TABLE ";
n && (r += "IF NOT EXISTS "), r += e + " (";
var i = t.length, s = null, o = [], u = "";
for (var a = 0; a < i; a++) s = t[a], u = s.column + " " + s.type, s.constraints && (u += " " + s.constraints.join(" ")), o.push(u);
return r += o.join(", ") + ")", r;
},
getDropTable: function(e) {
return "DROP TABLE IF EXISTS " + e;
},
_versionChanged: function(e, t) {
this.dbVersion = e, t();
},
_getOptions: function(e, t) {
var n = {
onSuccess: this._emptyFunction,
onError: this.bound._errorHandler
};
typeof t != "undefined" && (n = enyo.mixin(n, t));
if (typeof e == "undefined") var e = {};
return enyo.mixin(n, e);
},
_emptyFunction: function() {},
_readUrl: function(e, t, n) {
var r = enyo.bind(this, function(r, i) {
if (i.status === 200 || i.status === 0) try {
var s = enyo.json.parse(r);
t(s, n);
} catch (o) {
this.error("JSON request error:", o);
} else this.error("Database: failed to read JSON at URL `" + e + "`");
});
typeof enyo.xhrGet != "undefined" ? enyo.xhrGet({
url: e,
load: r
}) : enyo.xhr.request({
url: e,
callback: r
});
},
_convertResultSet: function(e) {
var t = [];
if (e.rows) for (var n = 0; n < e.rows.length; n++) t.push(e.rows.item(n));
return t;
},
_errorHandler: function(e, t) {
if (typeof t == "undefined") var t = e;
this.error("Database error (" + t.code + "): " + t.message);
},
_db_lost: function() {
this.error("Database: connection has been closed or lost; cannot execute SQL");
}
}), onecrayon.DatabaseQuery = function(e) {
this.sql = typeof e.sql != "undefined" ? e.sql : "", this.values = typeof e.values != "undefined" ? e.values : [];
};

// CombinedSlider.js

enyo.kind({
name: "CombinedSlider",
kind: "onyx.ProgressBar",
classes: "onyx-slider",
published: {
rangeMin: 0,
rangeMax: 100,
rangeStart: 0,
rangeEnd: 100,
beginValue: 0,
endValue: 0,
isSimple: !1
},
events: {
onChange: "",
onChanging: ""
},
showStripes: !1,
showLabels: !1,
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish",
ondown: "down"
},
moreComponents: [ {
name: "startKnob",
classes: "onyx-slider-knob"
}, {
name: "endKnob",
classes: "onyx-slider-knob onyx-range-slider-knob"
} ],
create: function() {
this.inherited(arguments), this.createComponents(this.moreComponents), this.initControls();
},
rendered: function() {
this.inherited(arguments);
var e = this.calcPercent(this.beginValue);
this.updateBarPosition(e);
},
initControls: function() {
this.$.bar.applyStyle("position", "relative"), this.refreshRangeSlider(), this.showLabels && (this.$.startKnob.createComponent({
name: "startLabel",
kind: "onyx.RangeSliderKnobLabel"
}), this.$.endKnob.createComponent({
name: "endLabel",
kind: "onyx.RangeSliderKnobLabel"
}));
},
refreshRangeSlider: function() {
this.isSimple ? (this.$.startKnob.applyStyle("visibility", "hidden"), this.rangeStart = this.rangeMin) : this.$.startKnob.applyStyle("visibility", "visible"), this.beginValue = this.calcKnobPercent(this.rangeStart), this.endValue = this.calcKnobPercent(this.rangeEnd), this.beginValueChanged(), this.endValueChanged();
},
calcKnobRatio: function(e) {
return (e - this.rangeMin) / (this.rangeMax - this.rangeMin);
},
calcKnobPercent: function(e) {
return this.calcKnobRatio(e) * 100;
},
beginValueChanged: function(e) {
if (e === undefined) {
var t = this.calcPercent(this.beginValue);
this.updateKnobPosition(t, this.$.startKnob);
}
},
endValueChanged: function(e) {
if (e === undefined) {
var t = this.calcPercent(this.endValue);
this.updateKnobPosition(t, this.$.endKnob);
}
},
calcKnobPosition: function(e) {
var t = e.clientX - this.hasNode().getBoundingClientRect().left;
return t / this.getBounds().width * (this.max - this.min) + this.min;
},
updateKnobPosition: function(e, t) {
t.applyStyle("left", e + "%"), this.updateBarPosition();
},
updateBarPosition: function() {
if (this.$.startKnob !== undefined && this.$.endKnob !== undefined) {
var e = this.calcKnobPercent(this.rangeStart), t = this.calcKnobPercent(this.rangeEnd) - e;
this.$.bar.applyStyle("left", e + "%"), this.$.bar.applyStyle("width", t + "%");
}
},
calcRangeRatio: function(e) {
return e / 100 * (this.rangeMax - this.rangeMin) + this.rangeMin - this.increment / 2;
},
swapZIndex: function(e) {
e === "startKnob" ? (this.$.startKnob.applyStyle("z-index", 1), this.$.endKnob.applyStyle("z-index", 0)) : e === "endKnob" && (this.$.startKnob.applyStyle("z-index", 0), this.$.endKnob.applyStyle("z-index", 1));
},
down: function(e, t) {
this.swapZIndex(e.name);
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = this.calcKnobPosition(t), r, i, s;
if (e.name === "startKnob" && n >= 0 && !this.isSimple) {
if (!(n <= this.endValue && t.xDirection === -1 || n <= this.endValue)) return this.drag(this.$.endKnob, t);
this.setBeginValue(n), r = this.calcRangeRatio(this.beginValue), i = this.increment ? this.calcIncrement(r + .5 * this.increment) : r, s = this.calcKnobPercent(i), this.updateKnobPosition(s, this.$.startKnob), this.setRangeStart(i), this.doChanging({
value: i
});
} else if (e.name === "endKnob" && n <= 100) {
if (!(n >= this.beginValue && t.xDirection === 1 || n >= this.beginValue)) return this.drag(this.$.startKnob, t);
this.setEndValue(n), r = this.calcRangeRatio(this.endValue), i = this.increment ? this.calcIncrement(r + .5 * this.increment) : r, s = this.calcKnobPercent(i), this.updateKnobPosition(s, this.$.endKnob), this.setRangeEnd(i), this.doChanging({
value: i
});
}
return !0;
}
},
dragfinish: function(e, t) {
this.dragging = !1, t.preventTap();
var n;
return e.name === "startKnob" ? (n = this.calcRangeRatio(this.beginValue), this.doChange({
value: n,
startChanged: !0
})) : e.name === "endKnob" && (n = this.calcRangeRatio(this.endValue), this.doChange({
value: n,
startChanged: !1
})), !0;
},
rangeMinChanged: function() {
this.refreshRangeSlider();
},
rangeMaxChanged: function() {
this.refreshRangeSlider();
},
rangeStartChanged: function() {
this.refreshRangeSlider();
},
rangeEndChanged: function() {
this.refreshRangeSlider();
},
setStartLabel: function(e) {
this.$.startKnob.waterfallDown("onSetLabel", e);
},
setEndLabel: function(e) {
this.$.endKnob.waterfallDown("onSetLabel", e);
}
});

// modules/JMTKspinner/heartcode_canvas.js

(function(e) {
var t = function(e, t) {
typeof t == "undefined" && (t = {}), this.init(e, t);
}, n = t.prototype, r, i = [ "canvas", "vml" ], s = [ "oval", "spiral", "square", "rect", "roundRect" ], o = /^\#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/, u = navigator.appVersion.indexOf("MSIE") !== -1 && parseFloat(navigator.appVersion.split("MSIE")[1]) === 8 ? !0 : !1, a = !!document.createElement("canvas").getContext, f = !0, l = function(e, t, n) {
var e = document.createElement(e), r;
for (r in n) e[r] = n[r];
return typeof t != "undefined" && t.appendChild(e), e;
}, c = function(e, t) {
for (var n in t) e.style[n] = t[n];
return e;
}, h = function(e, t) {
for (var n in t) e.setAttribute(n, t[n]);
return e;
}, p = function(e, t, n, r) {
e.save(), e.translate(t, n), e.rotate(r), e.translate(-t, -n), e.beginPath();
};
n.init = function(e, n) {
typeof n.safeVML == "boolean" && (f = n.safeVML);
try {
this.mum = document.getElementById(e) !== void 0 ? document.getElementById(e) : document.body;
} catch (s) {
this.mum = document.body;
}
n.id = typeof n.id != "undefined" ? n.id : "canvasLoader", this.cont = l("div", this.mum, {
id: n.id
});
if (a) r = i[0], this.can = l("canvas", this.cont), this.con = this.can.getContext("2d"), this.cCan = c(l("canvas", this.cont), {
display: "none"
}), this.cCon = this.cCan.getContext("2d"); else {
r = i[1];
if (typeof t.vmlSheet == "undefined") {
document.getElementsByTagName("head")[0].appendChild(l("style")), t.vmlSheet = document.styleSheets[document.styleSheets.length - 1];
var o = [ "group", "oval", "roundrect", "fill" ], u;
for (u in o) t.vmlSheet.addRule(o[u], "behavior:url(#default#VML); position:absolute;");
}
this.vml = l("group", this.cont);
}
this.setColor(this.color), this.draw(), c(this.cont, {
display: "none"
});
}, n.cont = {}, n.can = {}, n.con = {}, n.cCan = {}, n.cCon = {}, n.timer = {}, n.activeId = 0, n.diameter = 40, n.setDiameter = function(e) {
this.diameter = Math.round(Math.abs(e)), this.redraw();
}, n.getDiameter = function() {
return this.diameter;
}, n.cRGB = {}, n.color = "#000000", n.setColor = function(e) {
this.color = o.test(e) ? e : "#000000", this.cRGB = this.getRGB(this.color), this.redraw();
}, n.getColor = function() {
return this.color;
}, n.shape = s[0], n.setShape = function(e) {
for (var t in s) if (e === s[t]) {
this.shape = e, this.redraw();
break;
}
}, n.getShape = function() {
return this.shape;
}, n.density = 40, n.setDensity = function(e) {
this.density = f && r === i[1] ? Math.round(Math.abs(e)) <= 40 ? Math.round(Math.abs(e)) : 40 : Math.round(Math.abs(e)), this.density > 360 && (this.density = 360), this.activeId = 0, this.redraw();
}, n.getDensity = function() {
return this.density;
}, n.range = 1.3, n.setRange = function(e) {
this.range = Math.abs(e), this.redraw();
}, n.getRange = function() {
return this.range;
}, n.speed = 2, n.setSpeed = function(e) {
this.speed = Math.round(Math.abs(e));
}, n.getSpeed = function() {
return this.speed;
}, n.fps = 24, n.setFPS = function(e) {
this.fps = Math.round(Math.abs(e)), this.reset();
}, n.getFPS = function() {
return this.fps;
}, n.getRGB = function(e) {
return e = e.charAt(0) === "#" ? e.substring(1, 7) : e, {
r: parseInt(e.substring(0, 2), 16),
g: parseInt(e.substring(2, 4), 16),
b: parseInt(e.substring(4, 6), 16)
};
}, n.draw = function() {
var e = 0, t, n, o, a, f, d, g, y = this.density, b = Math.round(y * this.range), w, E, S = 0;
E = this.cCon;
var x = this.diameter;
if (r === i[0]) {
E.clearRect(0, 0, 1e3, 1e3), h(this.can, {
width: x,
height: x
});
for (h(this.cCan, {
width: x,
height: x
}); e < y; ) {
w = e <= b ? 1 - 1 / b * e : w = 0, d = 270 - 360 / y * e, g = d / 180 * Math.PI, E.fillStyle = "rgba(" + this.cRGB.r + "," + this.cRGB.g + "," + this.cRGB.b + "," + w.toString() + ")";
switch (this.shape) {
case s[0]:
case s[1]:
t = x * .07, a = x * .47 + Math.cos(g) * (x * .47 - t) - x * .47, f = x * .47 + Math.sin(g) * (x * .47 - t) - x * .47, E.beginPath(), this.shape === s[1] ? E.arc(x * .5 + a, x * .5 + f, t * w, 0, Math.PI * 2, !1) : E.arc(x * .5 + a, x * .5 + f, t, 0, Math.PI * 2, !1);
break;
case s[2]:
t = x * .12, a = Math.cos(g) * (x * .47 - t) + x * .5, f = Math.sin(g) * (x * .47 - t) + x * .5, p(E, a, f, g), E.fillRect(a, f - t * .5, t, t);
break;
case s[3]:
case s[4]:
n = x * .3, o = n * .27, a = Math.cos(g) * (o + (x - o) * .13) + x * .5, f = Math.sin(g) * (o + (x - o) * .13) + x * .5, p(E, a, f, g), this.shape === s[3] ? E.fillRect(a, f - o * .5, n, o) : (t = o * .55, E.moveTo(a + t, f - o * .5), E.lineTo(a + n - t, f - o * .5), E.quadraticCurveTo(a + n, f - o * .5, a + n, f - o * .5 + t), E.lineTo(a + n, f - o * .5 + o - t), E.quadraticCurveTo(a + n, f - o * .5 + o, a + n - t, f - o * .5 + o), E.lineTo(a + t, f - o * .5 + o), E.quadraticCurveTo(a, f - o * .5 + o, a, f - o * .5 + o - t), E.lineTo(a, f - o * .5 + t), E.quadraticCurveTo(a, f - o * .5, a + t, f - o * .5));
}
E.closePath(), E.fill(), E.restore(), ++e;
}
} else {
c(this.cont, {
width: x,
height: x
}), c(this.vml, {
width: x,
height: x
});
switch (this.shape) {
case s[0]:
case s[1]:
g = "oval", t = 140;
break;
case s[2]:
g = "roundrect", t = 120;
break;
case s[3]:
case s[4]:
g = "roundrect", t = 300;
}
n = o = t, a = 500 - o;
for (f = -o * .5; e < y; ) {
w = e <= b ? 1 - 1 / b * e : w = 0, d = 270 - 360 / y * e;
switch (this.shape) {
case s[1]:
n = o = t * w, a = 500 - t * .5 - t * w * .5, f = (t - t * w) * .5;
break;
case s[0]:
case s[2]:
u && (f = 0, this.shape === s[2] && (a = 500 - o * .5));
break;
case s[3]:
case s[4]:
n = t * .95, o = n * .28, u ? (a = 0, f = 500 - o * .5) : (a = 500 - n, f = -o * .5), S = this.shape === s[4] ? .6 : 0;
}
E = h(c(l("group", this.vml), {
width: 1e3,
height: 1e3,
rotation: d
}), {
coordsize: "1000,1000",
coordorigin: "-500,-500"
}), E = c(l(g, E, {
stroked: !1,
arcSize: S
}), {
width: n,
height: o,
top: f,
left: a
}), l("fill", E, {
color: this.color,
opacity: w
}), ++e;
}
}
this.tick(!0);
}, n.clean = function() {
if (r === i[0]) this.con.clearRect(0, 0, 1e3, 1e3); else {
var e = this.vml;
if (e.hasChildNodes()) for (; e.childNodes.length >= 1; ) e.removeChild(e.firstChild);
}
}, n.redraw = function() {
this.clean(), this.draw();
}, n.reset = function() {
typeof this.timer == "number" && (this.hide(), this.show());
}, n.tick = function(e) {
var t = this.con, n = this.diameter;
e || (this.activeId += 360 / this.density * this.speed), r === i[0] ? (t.clearRect(0, 0, n, n), p(t, n * .5, n * .5, this.activeId / 180 * Math.PI), t.drawImage(this.cCan, 0, 0, n, n), t.restore()) : (this.activeId >= 360 && (this.activeId -= 360), c(this.vml, {
rotation: this.activeId
}));
}, n.show = function() {
if (typeof this.timer != "number") {
var e = this;
this.timer = self.setInterval(function() {
e.tick();
}, Math.round(1e3 / this.fps)), c(this.cont, {
display: "block"
});
}
}, n.hide = function() {
typeof this.timer == "number" && (clearInterval(this.timer), delete this.timer, c(this.cont, {
display: "none"
}));
}, n.kill = function() {
var e = this.cont;
typeof this.timer == "number" && this.hide(), r === i[0] ? (e.removeChild(this.can), e.removeChild(this.cCan)) : e.removeChild(this.vml);
for (var t in this) delete this[t];
}, e.CanvasLoader = t;
})(window);

// modules/JMTKspinner/canvasSpinner.js

enyo.kind({
name: "jmtk.Spinner",
kind: "enyo.Control",
published: {
color: "#000000",
shape: "oval",
diameter: "90",
density: "85",
range: "1",
speed: "2.5",
fps: "30"
},
rendered: function() {
this.cl = new CanvasLoader(this.hasNode().id), this.colorChanged(), this.shapeChanged(), this.diameterChanged(), this.densityChanged(), this.rangeChanged(), this.speedChanged(), this.fpsChanged(), this.show();
},
show: function() {
this.cl.show(), this.inherited(arguments);
},
hide: function() {
this.cl.hide(), this.inherited(arguments);
},
colorChanged: function() {
this.cl.setColor(this.color);
},
shapeChanged: function() {
this.cl.setShape(this.shape);
},
diameterChanged: function() {
this.cl.setDiameter(this.diameter);
},
densityChanged: function() {
this.cl.setDensity(this.density);
},
rangeChanged: function() {
this.cl.setRange(this.range);
},
speedChanged: function() {
this.cl.setSpeed(this.speed);
},
fpsChanged: function() {
this.cl.setFPS(this.fps);
}
});

// MySongs.js

enyo.kind({
name: "mySongs",
fit: !0,
realtimeFit: !0,
pathCount: {
a: [],
b: []
},
newSong: !1,
textSrce: "",
online: undefined,
databaseOn: !1,
silent: !1,
published: {
dataList: {},
libraryList: {
content: []
},
savedLists: {
data: [],
modified: null
},
customList: !1,
searchList: {
content: []
},
css: undefined,
currentList: "libraryList",
sync: "auto",
currentIndex: undefined,
dropboxDate: 0,
db: undefined
},
components: [ {
kind: "Signals",
ondeviceready: "deviceReadyHandler"
}, {
kind: "Panels",
name: "infoPanels",
classes: "enyo-fit",
arrangerKind: "CollapsingArranger",
draggable: !1,
realtimeFit: !0,
components: [ {
kind: "Panels",
name: "mainPanels",
onTransitionFinish: "doResizeLyrics",
classes: "app-panels inner-panels",
arrangerKind: "CollapsingArranger",
draggable: !1,
realtimeFit: !0,
narrowFit: !1,
components: [ {
name: "songListPane",
kind: "SongList"
}, {
name: "viewPane",
kind: "ViewPane",
style: "height: 100%;"
} ]
}, {
name: "sidePane",
kind: "SidePane",
style: "height: 100%;"
} ]
}, {
name: "newSongDialog",
kind: "onyx.Popup",
style: "padding: 1rem;",
centered: !0,
modal: !0,
floating: !0,
scrim: !0,
components: [ {
kind: "FittableRows",
style: "padding: .5rem; background-color: rgba(255, 255, 255, 0.5)",
components: [ {
kind: "FittableColumns",
style: "width: 100%;",
components: [ {
content: $L("New song"),
tag: "b",
fit: !0,
style: "font-size: 1.2rem;"
}, {
kind: "onyx.Button",
style: "color: #fff;",
content: $L("Import"),
ontap: "openImportSong"
} ]
}, {
kind: "onyx.InputDecorator",
style: "width: 14.75rem; margin-top: .5rem;",
components: [ {
name: "songName",
kind: "onyx.Input",
placeholder: $L("Enter songname"),
style: "width: 100%;"
} ]
}, {
components: [ {
kind: "onyx.Button",
classes: "onyx-negative",
style: "margin: .5rem 0 0;",
content: $L("Cancel"),
ontap: "closeCreateSong"
}, {
kind: "onyx.Button",
classes: "onyx-affirmative",
style: "margin: .5rem 0 0 .5rem;",
content: $L("Save"),
ontap: "createSong"
} ]
} ]
} ]
} ],
deviceReadyHandler: function() {
this.log("phonegap deviceready");
if (!enyo.platform.webos) {
this.connect();
var e = enyo.bind(this, this.isOnline);
document.addEventListener("offline", e, !1), document.addEventListener("online", e, !1);
}
},
create: function() {
this.inherited(arguments), this.getPreferences(), this.online = navigator.onLine, this.log("online:", this.online), enyo.platform.firefox || (this.databaseOn = !0, this.createComponent({
name: "mySongsDbase",
kind: "onecrayon.Database",
database: "ext:ms_database",
version: "",
estimatedSize: 5e6,
debug: !0,
owner: this
}));
if (Helper.browser()) {
var e = enyo.bind(this, this.isOnline);
window.addEventListener("offline", e, !1), window.addEventListener("online", e, !1), this.connect();
}
this.log("database on", this.databaseOn), this.databaseOn && this.openMyDatabase();
},
rendered: function() {
this.inherited(arguments), this.log(), navigator.splashscreen && enyo.platform.android && setTimeout(function() {
navigator.splashscreen.hide();
}, 800);
},
isOnline: function(e) {
this.log("now", e.type), this.online = e.type === "online";
if (this.online && this.sync === "auto") {
this.log("upload offline changes to Dropbox"), this.silent = !0;
var t = enyo.bind(this, this.connect);
setTimeout(t, 2e3);
}
},
connect: function() {
this.log("sync prefs: ", this.sync), this.sync !== "manual" && this.online ? dropboxHelper.client.uid ? this.readDirectory() : this.connectToDropbox() : this.databaseOn && this.initDatabaseRead();
},
connectToDropbox: function() {
this.log("Connecting to Dropbox, please confirm the popup if any"), this.silent ? this.$.songListPane.$.searchSpinner.show() : (this.$.songListPane.$.readFiles.setContent($L("Connecting...")), this.$.songListPane.$.readProgress.setMax(3), this.$.songListPane.$.readProgress.animateProgressTo(1), this.$.songListPane.$.listPane.setIndex(0));
var e = enyo.bind(this, this.readDirectory), t = enyo.bind(this, this.connectError);
setTimeout(function() {
dropboxHelper.connect(e, t);
}, 20);
},
refreshLibrary: function() {
this.log("refreshing library ..."), this.libraryList.content = [], this.$.songListPane.$.library.setDisabled(!0), this.$.songListPane.$.library.setValue(!0), this.$.songListPane.$.list.setDisabled(!0), this.$.songListPane.goToSync(), this.online ? this.connect() : this.databaseOn && this.readFilesFromDatabase();
},
connectError: function(e) {
this.$.songListPane.showError($L("Connection error: ") + e), enyo.error("Connection error: ", e), this.$.songListPane.goToLibrary(), this.$.songListPane.$.library.setValue(!1), this.online = !1;
},
dropboxError: function(e) {
this.$.songListPane.showError($L("Dropbox error: ") + e), enyo.error("Dropbox error: ", e), this.$.songListPane.goToLibrary(), this.$.songListPane.$.library.setValue(!1);
},
signOut: function() {
this.log("signing out from dropbox ...");
var e = enyo.bind(this, this.signOutSuccess);
dropboxHelper.signOut(e);
},
signOutSuccess: function() {
this.log(), this.$.viewPane.$.preferences.setDropboxClient(!1), this.$.songListPane.$.listPane.setIndex(6), this.log("successfully logged out from Dropbbox");
},
openMyDatabase: function() {
this.log(), this.db = this.$.mySongsDbase, this.db.query("SELECT COUNT(*) FROM 'songs';", {
onError: enyo.bind(this, function(e) {
this.log("Error: (" + e.message + ") Need to create tables from JSON now"), this.db.setSchema([ {
table: "songs",
columns: [ {
column: "filename",
type: "TEXT",
constraints: [ "PRIMARY KEY" ]
}, {
column: "title",
type: "TEXT"
}, {
column: "xml",
type: "TEXT"
}, {
column: "date",
type: "INTEGER"
} ]
}, {
table: "changes",
columns: [ {
column: "filename",
type: "TEXT",
constraints: [ "PRIMARY KEY" ]
}, {
column: "action",
type: "TEXT"
} ]
} ]);
})
});
},
dbError: function() {
this.log(), this.$.songListPane.goToLibrary(), this.$.songListPane.$.library.setValue(!1);
},
initDatabaseRead: function() {
this.log(), this.$.songListPane.$.readFiles.setContent($L("Connecting...")), this.$.songListPane.$.readProgress.setMax(3), this.$.songListPane.$.readProgress.animateProgressTo(1), this.$.songListPane.$.listPane.setIndex(0), this.libraryList.content = [], this.readFilesFromDatabase();
},
readFilesFromDatabase: function() {
this.log("reading filenames from database..."), this.pathCount.a = [], this.pathCount.b = [], this.libraryList.content = [], this.$.songListPane.$.readProgress.animateProgressTo(2);
var e = this.db.getSelect("songs", [ "filename" ]), t = enyo.bind(this, this.handleDatabaseFiles), n = enyo.bind(this, this.dbError);
this.db.query(e, {
onSuccess: t,
onError: n
});
},
handleDatabaseFiles: function(e) {
this.$.songListPane.$.readProgress.animateProgressTo(3);
if (e.length === 0) this.log("no files in Database: first use?"), this.$.songListPane.$.listPane.setIndex(5); else {
this.log(e.length + " files to parse ..."), this.$.songListPane.$.readProgress.setProgress(0), this.$.songListPane.$.readProgress.setMax(e.length + 1), this.$.songListPane.$.readFiles.setContent($L("Reading files..."));
for (i = 0; i < e.length; i++) if (e[i].filename.split(".").pop() === "xml") {
this.pathCount.a.push({
idx: i,
file: e[i].filename
}), this.log("reading dbase file", i + 1, "of", e.length);
var t = this.db.getSelect("songs", "", {
filename: e[i].filename
}), n = enyo.bind(this, this.gotDatabaseFile), r = enyo.bind(this, this.dbFileNotRead);
this.db.query(t, {
onSuccess: n,
onError: r
});
}
}
},
gotDatabaseFile: function(e) {
this.log();
var t = e[0].filename, n = e[0].title, r = e[0].xml;
this.log("Got database file");
var i = ParseXml.parse_dom(r);
this.dataList[t.toLowerCase()] = i;
var s = {
file: t,
title: n
};
this.log(t, "parsed"), this.libraryList.content.push(s), this.fileDone(s.title);
},
dbFileNotRead: function() {
this.log("Error reading database file");
},
readDirectory: function() {
this.log(), this.pathCount.a = [], this.pathCount.b = [], this.silent ? this.$.songListPane.$.searchSpinner.show() : (this.libraryList.content = [], this.log("reading app directory..."), this.$.songListPane.$.readProgress.animateProgressTo(2)), this.$.viewPane.$.preferences.setDropboxClient(!0);
var e = enyo.bind(this, this.handleDropboxfiles), t = enyo.bind(this, this.dropboxError);
dropboxHelper.readDir(e, t);
},
handleDropboxfiles: function(e, t) {
this.log(), this.silent || this.$.songListPane.$.readProgress.animateProgressTo(3);
if (e.length === 0) this.log("no files in Dropbox: first use?"), this.$.songListPane.$.listPane.setIndex(5); else {
this.log(e.length + " files to parse ..."), this.silent || (this.$.songListPane.$.readProgress.setProgress(0), this.$.songListPane.$.readProgress.setMax(e.length + 1), this.$.songListPane.$.readFiles.setContent($L("Reading Files...")));
var n = enyo.bind(this, this.gotDropboxFile), r = enyo.bind(this, this.gotListFile), s = enyo.bind(this, this.dropboxError);
for (i = 0; i < e.length; i++) e[i].split(".").pop() === "xml" ? (this.pathCount.a.push({
idx: i,
file: e[i]
}), this.log("parsing dropbox file", i + 1, "of", e.length, e[i]), dropboxHelper.readFile(e[i], n, s)) : e[i] === "lists.json" && dropboxHelper.readFile(e[i], r, s);
}
},
gotDropboxFile: function(e, t, n) {
this.log(n);
var r = ParseXml.parse_dom(e);
if (ParseXml.get_titles(r)) {
this.dataList[t.toLowerCase()] = r;
var i = {
file: t,
title: ParseXml.get_titles(r)[0].title
};
this.silent || this.libraryList.content.push(i);
if (this.databaseOn) {
var s = r.childNodes[0].attributes.modifiedDate.value, o = {
filename: t,
title: i.title,
xml: e,
date: Date.parse(s)
}, u = this.db.getSelect("songs", "", {
filename: t
}), a = enyo.bind(this, this.processDbRecord, o);
this.log("attempting to read db file : " + t), this.db.query(u, {
onSuccess: a
});
} else this.fileDone(i.title);
}
},
processDbRecord: function(e, t) {
this.log();
if (t.length !== 0) {
this.log(e.filename);
var n = enyo.bind(this, this.fileDone, t[0].title);
if (t[0].date < e.date) {
this.silent && this.updateLibraryData(e), this.log("Upating database from Dropbox file ", e.filename);
var r = enyo.bind(this, this.dbfileNotUpdated, e.filename), i = this.db.getUpdate("songs", e, {
filename: e.filename
});
this.db.query(i, {
onSuccess: n,
onError: r
});
} else if (t[0].date > e.date) {
this.log("Upating dropbox with newer ", t[0].filename);
var r = enyo.bind(this, this.dropboxError);
dropboxHelper.writeFile(t[0].filename, t[0].xml, t[0].title, n, r), this.dataList[t[0].filename.toLowerCase()] = ParseXml.parse_dom(t[0].xml);
} else t[0].date === e.date && this.fileDone(e.title);
} else {
this.log("Extra Dropbox file ", e.filename);
var i = this.db.getSelect("changes", "", {
filename: e.filename,
action: "deleted"
}), n = enyo.bind(this, this.checkDbDelete, e);
this.db.query(i, {
onSuccess: n
});
}
},
updateLibraryData: function(e) {
this.log("Upating library from Dropbox file", e.filename);
for (i in this.libraryList.content) if (this.libraryList.content.file === e.filename) {
this.libraryList.content.title = e.title;
break;
}
this.dataList[e.filename.toLowerCase()] = ParseXml.parse_dom(e.xml);
},
checkDbDelete: function(e, t) {
this.log();
if (t.length !== 0) {
this.log(e.filename, " was deleted offline, deleting from Dropbox");
var n = enyo.bind(this, this.removeFromLibrary, e.filename), r = enyo.bind(this, this.dropboxError);
dropboxHelper.deleteFile(e.filename, n, r);
} else {
this.log(e.filename, " created externally, being added to the database"), this.silent && (this.log("and library"), this.libraryList.content.push({
file: e.filename,
title: e.title
}), this.dataList[e.filename.toLowerCase()] = ParseXml.parse_dom(e.xml));
var n = enyo.bind(this, this.fileDone, e.filename), i = e.xml.slice(e.xml.indexOf("modifiedDate") + 14);
i = i.substring(0, i.indexOf('"', 1)), e.date = Date.parse(i), this.db.insertData({
table: "songs",
data: e
}, {
onSuccess: n
});
}
},
removeFromLibrary: function(e) {
this.log(e);
var t = 0;
while (t < this.libraryList.content.length) {
if (this.libraryList.content[t].file === e) {
this.libraryList.content.splice(t, 1), this.pathCount.a.splice(t, 1), this.pathCount.b.splice(t, 1);
break;
}
t++;
}
var n = enyo.bind(this, this.checkAllDone), r = this.db.getDelete("changes", {
filename: e
});
this.db.query(r, {
onSuccess: n
});
},
dbfileNotUpdated: function(e) {
this.log(e);
},
fileDone: function(e) {
this.pathCount.b.push(1), this.log(this.pathCount.b.length, e), this.silent || this.$.songListPane.$.readProgress.animateProgressTo(this.pathCount.b.length), this.checkAllDone();
},
checkAllDone: function() {
this.log(this.pathCount.b.length, this.pathCount.a.length);
if (this.pathCount.b.length === this.pathCount.a.length) {
this.sortAndRefresh();
if (this.online && this.databaseOn) {
var e = this.db.getSelect("songs", ""), t = enyo.bind(this, this.doExtraDbFiles);
this.db.query(e, {
onSuccess: t
});
}
}
},
doExtraDbFiles: function(e) {
for (i in e) {
var t = !1;
for (j in this.pathCount.a) e[i].filename === this.pathCount.a[j].file && (t = !0);
if (!t) {
var n = this.db.getSelect("changes", "", {
filename: e[i].filename,
action: "created"
}), r = enyo.bind(this, this.checkDbCreate, e[i]);
this.db.query(n, {
onSuccess: r
});
}
}
},
checkDbCreate: function(e, t) {
this.log();
if (t.length !== 0) {
this.log(e.filename, " was created offline, adding to Dropbox");
var n = enyo.bind(this, this.dropboxError), r = enyo.bind(this, this.dboxFileAdded, e);
dropboxHelper.writeFile(e.filename, e.xml, e.title, r, n);
} else {
this.log(e.filename, " was not created offline, deleting from database");
var r = enyo.bind(this, this.sortAndRefresh), i = this.db.getDelete("songs", {
filename: e.filename
});
this.db.query(i, {
onSuccess: r
});
}
},
dboxFileAdded: function(e) {
this.log(), this.silent || (this.libraryList.content.push({
file: e.filename,
title: e.title
}), this.dataList[e.filename.toLowerCase()] = ParseXml.parse_dom(e.xml));
var t = enyo.bind(this, this.sortAndRefresh), n = this.db.getDelete("changes", {
filename: e.filename
});
this.db.query(n, {
onSuccess: t
});
},
sortByTitle: function(e, t) {
return e.title.toLowerCase() < t.title.toLowerCase() ? -1 : e.title.toLowerCase() > t.title.toLowerCase() ? 1 : 0;
},
sortAndRefresh: function(e) {
this.log(), this.libraryList.content.sort(this.sortByTitle), this.$.songListPane.goToLibrary(), this.$.songListPane.$.library.setDisabled(!1), this.$.songListPane.$.list.setDisabled(!1), this.$.songListPane.$.library.setValue(!0), this.$.songListPane.$.searchSpinner.hide();
var t;
if (e) {
this.log("file to select", e);
for (i in this.libraryList.content) if (this.libraryList.content[i].file === e) {
t = i, this.currentIndex = i;
break;
}
} else this.currentIndex && (t = this.currentIndex);
t && this.silent ? (this.$.songListPane.$.libraryList.scrollToRow(t), this.$.songListPane.$[this.currentList === "searchList" ? "libraryList" : this.currentList].select(t)) : t && (this.log(t), this.$.songListPane.$[this.currentList === "searchList" ? "libraryList" : this.currentList].select(t), this.$.songListPane.$.libraryList.scrollToRow(t), this.openSong(t));
},
findIndex: function() {
for (i in this.libraryList.content) if (this.searchList.content.length > 0 && this.currentIndex >= 0 && this.libraryList.content[i].file === this.searchList.content[this.currentIndex].file) {
this.setCurrentIndex(i);
break;
}
},
openSong: function(e) {
this.log("list ", this.currentList);
var t = this.currentList === "customList" ? this.savedLists.data[this.customList].content[e].file : this[this.currentList].content[e].file;
this.log("open song: ", t), this.$.viewPane.$.songViewPane.setFirst(!0), this.$.viewPane.$.songViewPane.setFile(t), this.$.viewPane.$.songViewPane.start(), this.$.viewPane.$.songViewPane.$.viewScroller.setScrollTop(0), this.$.viewPane.$.viewPanels.setIndex(1), this.handleSidepane(), !Helper.phone() || this.$.mainPanels.setIndex(1);
},
handleSidepane: function() {
this.log("sidepane: ", this.$.sidePane.$.Pane.getIndex());
switch (this.$.sidePane.$.Pane.getIndex()) {
case 1:
this.$.infoPanels.getIndex() === 1 && this.$.viewPane.$.songViewPane.showInfo();
break;
case 2:
break;
default:
this.$.infoPanels.setIndex(0);
}
},
currentIndexChanged: function() {
this.log(this.currentIndex), this.silent = !1, this.currentIndex >= 0 ? (this.$.songListPane.$[this.currentList === "searchList" ? "libraryList" : this.currentList].select(this.currentIndex), this.openSong(this.currentIndex)) : this.$.songListPane.$[this.currentList].refresh();
},
getPreferences: function() {
this.log(), Helper.getItem("css") && (this.setFont(Helper.getItem("css")), this.$.sidePane.setCss(Helper.getItem("css"))), this.customList = Helper.getItem("customList"), Helper.getItem("savedLists") && (this.savedLists = Helper.getItem("savedLists")), this.log("got Prefs: css: ", Helper.getItem("css"), "customList: ", Helper.getItem("customList"), "savedLists: ", Helper.getItem("savedLists"));
},
gotListFile: function(e, t, n) {
var r = new Date(n), i = new Date(this.savedLists.modified);
r > i ? (this.log("Dropbox listfile newer, use this data"), this.savedLists = JSON.parse(e), this.$.songListPane.refreshAllLists()) : r < i && (this.log("local list newer, sync it to dropbox"), this.saveLists());
},
saveLists: function() {
if (this.online) {
var e = enyo.bind(this, this.writeListSuccess), t = enyo.bind(this, this.dropboxError);
dropboxHelper.writeFile("lists.json", JSON.stringify(this.savedLists, null, 2), null, e, t);
} else this.savedLists.modified = (new Date).toString(), Helper.setItem("savedLists", this.savedLists);
},
writeListSuccess: function(e) {
this.log("List saved at " + e), this.savedLists.modified = e, Helper.setItem("savedLists", this.savedLists), this.log("saved: savedLists: ", this.savedLists, "customList: ", this.customList), this.log("saved lists to file");
},
saveCss: function(e) {
Helper.setItem("css", e), this.log("saved: css", e);
},
setFont: function(e) {
if (e) {
var t = e.size * 10 * Helper.ratio() + 80 + "%", n = e.space * 8 + 100 + "%";
this.log("set font css: size: ", t, "space: ", n), this.$.viewPane.$.songViewPane.$.lyric.applyStyle("font-size", t), this.$.viewPane.$.songViewPane.$.lyric.applyStyle("line-height", n), this.$.viewPane.$.songViewPane.lyricDataSet(), this.$.viewPane.$.help.$.helpContent.applyStyle("font-size", t);
}
},
dbWriteXml: function(e, t, n, r) {
this.log("database write file", e);
var i = {
filename: e,
title: r,
xml: t,
date: n
}, s = enyo.bind(this, this.dbStoreRec, e, t, n, r, i), o = this.db.getSelect("songs", [ "filename" ], {
filename: e
});
this.db.query(o, {
onSuccess: s
});
},
dbStoreRec: function(e, t, n, r, i, s) {
var o = enyo.bind(this, this.dbWriteToChanges, 0, e, t, r);
if (s.length === 0) this.db.insertData({
table: "songs",
data: {
filename: e,
title: r,
xml: t,
date: n
}
}, {
onSuccess: o
}); else {
var u = this.db.getUpdate("songs", i, {
filename: e
});
this.db.query(u, {
onSuccess: o
});
}
},
dbWriteToChanges: function(e, t, n, r) {
if (!this.online) {
this.log(t);
var i = this.db.getDelete("changes", {
filename: t
});
this.db.query(i);
var s = enyo.bind(this, this.writeFileSuccess, e, t, n, r);
this.db.insertData({
table: "changes",
data: {
filename: t,
action: "created"
}
}, {
onSuccess: s
});
}
},
writeXml: function(e, t, n) {
this.log("dropbox write file", e);
var r = enyo.bind(this, this.writeFileSuccess), i = enyo.bind(this, this.dropboxError);
dropboxHelper.writeFile(e, t, n, r, i);
},
writeFileSuccess: function(e, t, n, r) {
this.log("File saved at " + e), this.$.infoPanels.setIndex(0);
if (this.newSong) this.log("append", t, "to librarylist and select it"), this.libraryList.content.push({
file: t,
title: r
}), this.dataList[t.toLowerCase()] = ParseXml.parse_dom(n), this.sortAndRefresh(t), this.newSong = !1, this.$.viewPane.$.songViewPane.openEdit(); else {
this.log(t, "changed");
for (i in this.libraryList.content) {
if (this.libraryList.content[i].file === t && r !== this.libraryList.content[i].title) {
this.log("title changed"), this.libraryList.content[i].title = r;
break;
}
if (this.libraryList.content[i].file === t) break;
}
this.dataList[t.toLowerCase()] = ParseXml.parse_dom(n), this.sortAndRefresh(t);
}
},
openCreateSong: function() {
this.$.newSongDialog.show(), this.$.songName.setValue(""), this.$.songName.focus();
},
closeCreateSong: function() {
this.$.newSongDialog.hide();
},
openImportSong: function() {
this.$.infoPanels.setIndex(1), this.$.sidePane.showImport(), this.$.newSongDialog.hide();
},
testFilename: function(e) {
var t = this.dataList, n = !0;
while (n) if (t[e.toLowerCase()]) {
this.log("filename already exist: ", e);
var r = e.match(/\(([0-9]+)\)/);
r && parseInt(r[1], 10) > 0 ? e = e.replace(r[0], "(" + (parseInt(r[1], 10) + 1) + ")") : e = e.substring(0, e.length - 4) + "(1).xml";
} else n = !1;
return e;
},
importError: function(e) {
this.$.songListPane.showError($L("Error in importing: ") + e), this.$.infoPanels.setIndex(0);
},
importSong: function(e) {
this.log(), this.newSong = !0;
var t = ParseXml.get_titles(ParseXml.parse_dom(e))[0];
if (t && t.title) {
var n = t.title.replace(/\s+/g, "_").replace(/,/g, "") + ".xml";
n = this.testFilename(n), this.log("create imported file: ", n), this.writeXml(n, e, t.title);
} else this.importError(e);
},
createSong: function() {
var e = this.$.songName.getValue(), t = e.replace(/\s+/g, "_") + ".xml";
t = this.testFilename(t), this.log("create file: ", t), this.newSong = !0;
if (this.online) {
var n = enyo.bind(this, this.gotTxtFile, t, e), r = enyo.bind(this, this.contCreateSong, t, e, "");
dropboxHelper.readFile(e + ".txt", n, r);
} else this.contCreateSong(t, e, "");
},
gotTxtFile: function(e, t, n, r) {
this.log(r), n ? this.contCreateSong(e, t, n) : this.contCreateSong(e, t, "");
},
contCreateSong: function(e, t, n) {
this.log(t);
if (n === "") var r = WriteXml.create(t); else var r = convLyrics(n);
var i = r.slice(r.indexOf("modifiedDate") + 14);
i = i.substring(0, i.indexOf("Z") + 1), this.dbWriteXml(e, r, Date.parse(i), t), this.online && this.writeXml(e, r, t), this.$.newSongDialog.hide();
},
deleteFile: function(e) {
this.log("delete ", e), this.file = e;
if (this.online) {
var t = enyo.bind(this, this.dropboxError), n = enyo.bind(this, this.deleteFromDbase);
setTimeout(function() {
dropboxHelper.deleteFile(e, n, t);
}, 10);
} else this.deleteFromDbase();
var r = !1;
for (i in this.savedLists.data) for (j in this.savedLists.data[i].content) this.savedLists.data[i].content[j].file === e && (this.savedLists.data[i].content.splice(j, 1), this.log(e, "removed from savedLists"), r = !0);
r && (this.saveLists(), this.currentList === "customList" && this.$.songListPane.$.customList.reset());
},
deleteFromDbase: function() {
var e = enyo.bind(this, this.dbError), t = enyo.bind(this, this.deleteUpdateChanges, this.file), n = this.db.getDelete("songs", {
filename: this.file
});
this.db.query(n, {
onSuccess: t,
onError: e
});
},
deleteUpdateChanges: function(e) {
if (!this.online) {
var t = enyo.bind(this, this.dbError), n = enyo.bind(this, this.deleteSuccess), r = this.db.getDelete("changes", {
filename: this.file
});
this.db.query(r), this.db.insertData({
table: "changes",
data: {
filename: e,
action: "deleted"
}
}, {
onSuccess: n,
onError: t
});
} else this.deleteSuccess();
},
deleteSuccess: function() {
this.log(this.file, "deleted"), delete this.dataList[this.file.toLowerCase()];
for (i in this.libraryList.content) if (this.libraryList.content[i].file === this.file) {
this.libraryList.content.splice(i, 1);
break;
}
this.currentIndex = this.currentIndex === this.libraryList.content.length ? this.currentIndex - 1 : this.currentIndex, this.log("currentIndex", this.currentIndex), this.$.viewPane.$.viewPanels.setIndex(1), this.file = undefined, this.sortAndRefresh();
}
});

// Preferences.js

enyo.kind({
name: "Preferences",
kind: "FittableRows",
classes: "enyo-fit",
published: {
oldIndex: 0,
dropboxClient: !1,
showPrefs: {
sortLyrics: !0,
showinToolbar: "copyright",
showChords: !0,
showComments: !1,
showName: !0,
showTransposer: !0,
showPrint: !1,
showScroll: !0,
showAuto: !0,
scrollToNext: !0
},
sync: "auto"
},
components: [ {
name: "headerToolbar",
kind: "onyx.Toolbar",
style: "text-align:center;",
components: [ {
name: "title",
classes: "title",
content: $L("Preferences"),
allowHtml: !0
} ]
}, {
kind: "enyo.Scroller",
fit: !0,
classes: "michote-scroller",
horizontal: "hidden",
components: [ {
name: "box",
kind: "FittableRows",
classes: "box-center",
components: [ {
kind: "onyx.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: $L("Display Settings")
}, {
style: "padding: .5rem;",
components: [ {
content: $L("Sort Lyric"),
style: "display: inline-block; width: 73%;"
}, {
kind: "onyx.ToggleButton",
name: "sortLyrics",
style: "display: inline-block; float: right; max-width: 27%;",
value: !1,
onChange: "toggle",
onContent: $L("yes"),
offContent: $L("no")
} ]
}, {
kind: Helper.phone() ? "FittableRows" : "FittableColumns",
style: "padding: .5rem;",
components: [ {
content: $L("Show in bottom toolbar:")
}, {
name: "showinToolbar",
kind: "onyx.RadioGroup",
onActivate: "toggleShowinToolbar",
style: "display: inline-block; float: right; margin: -.1875rem 0 !important",
components: [ {
name: "copyright",
content: $L("copyright")
}, {
name: "authors",
content: $L("author")
}, {
name: "publisher",
content: $L("publisher")
} ]
}, {
tag: "br",
style: "clear:both;"
} ]
}, {
style: "padding: .5rem;",
components: [ {
content: $L("Show Chords"),
style: "display: inline-block; width: 73%;"
}, {
kind: "onyx.ToggleButton",
name: "showChords",
style: "display: inline-block; float: right; max-width: 27%;",
value: !1,
onChange: "toggle",
onContent: $L("yes"),
offContent: $L("no")
} ]
}, {
style: "padding: .5rem;",
components: [ {
content: $L("Show Comments"),
style: "display: inline-block; width: 73%;"
}, {
kind: "onyx.ToggleButton",
name: "showComments",
style: "display: inline-block; float: right; max-width: 27%;",
value: !1,
onChange: "toggle",
onContent: $L("yes"),
offContent: $L("no")
} ]
}, {
style: "padding: .5rem;",
components: [ {
content: $L("Show elementname (e.g. V1:)"),
style: "display: inline-block; width: 73%;"
}, {
kind: "onyx.ToggleButton",
name: "showName",
style: "display: inline-block; float: right; max-width: 27%;",
value: !1,
onChange: "toggle",
onContent: $L("yes"),
offContent: $L("no")
} ]
} ]
}, {
kind: "onyx.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: $L("Button Settings")
}, {
style: "padding: .5rem;",
components: [ {
content: $L("Show Transposer"),
style: "display: inline-block; width: 73%;"
}, {
kind: "onyx.ToggleButton",
name: "showTransposer",
style: "display: inline-block; float: right; max-width: 27%;",
value: !1,
onChange: "toggle",
onContent: $L("yes"),
offContent: $L("no")
} ]
}, {
style: "padding: .5rem;",
components: [ {
content: $L("Show Scrollbuttons"),
style: "display: inline-block; width: 73%;"
}, {
kind: "onyx.ToggleButton",
name: "showScroll",
style: "display: inline-block; float: right; max-width: 27%;",
value: !1,
onChange: "toggle",
onContent: $L("yes"),
offContent: $L("no")
} ]
}, {
style: "padding: .5rem;",
components: [ {
content: $L("Show Autoscrollbutton"),
style: "display: inline-block; width: 73%;"
}, {
kind: "onyx.ToggleButton",
name: "showAuto",
style: "display: inline-block; float: right; max-width: 27%;",
value: !1,
onChange: "toggle",
onContent: $L("yes"),
offContent: $L("no")
} ]
}, {
style: "padding: .5rem;",
components: [ {
content: $L("Autoscroll end to next page (on button press)"),
style: "display: inline-block; width: 73%;"
}, {
kind: "onyx.ToggleButton",
name: "scrollToNext",
style: "display: inline-block; float: right; max-width: 27%;",
value: !1,
onChange: "toggle",
onContent: $L("yes"),
offContent: $L("no")
} ]
}, {
style: "padding: .5rem;",
components: [ {
content: $L("Show Printbutton"),
style: "display: inline-block; width: 73%;"
}, {
kind: "onyx.ToggleButton",
name: "showPrint",
style: "display: inline-block; float: right; max-width: 27%;",
value: !1,
onChange: "toggle",
onContent: $L("yes"),
offContent: $L("no")
} ]
} ]
}, {
kind: "onyx.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: $L("Dropbox Settings")
}, {
kind: Helper.phone() ? "FittableRows" : "FittableColumns",
style: "padding: .5rem;",
components: [ {
content: $L("Sync")
}, {
name: "sync",
kind: "onyx.RadioGroup",
onActivate: "toggleSync",
style: "display: inline-block; float: right; margin: -.1875rem 0 !important",
components: [ {
name: "startup",
content: $L("on startup")
}, {
name: "auto",
content: $L("automatically")
}, {
name: "manual",
content: $L("manually")
} ]
}, {
tag: "br",
style: "clear:both;"
} ]
}, {
style: "padding: .5rem;",
components: [ {
content: $L("Logout from Dropbox"),
style: "display: inline-block; width: 65%;"
}, {
name: "login",
kind: "onyx.Button",
content: "Login",
classes: "onyx-affirmative",
style: "float: right;",
ontap: "logTapped",
showing: !1
}, {
name: "logout",
kind: "onyx.Button",
content: "Logout",
classes: "onyx-negative",
style: "float: right;",
ontap: "logTapped"
}, {
name: "spinner",
kind: "jmtk.Spinner",
color: "#000000",
diameter: Helper.ratio() * 32,
style: "margin-right: .5rem; height: 2rem; display: inline-block; float: right;"
} ]
} ]
} ]
} ]
}, {
name: "footerToolbar",
kind: "onyx.Toolbar",
style: "text-align:center;",
components: [ {
kind: "my.Grabber",
ontap: "grabber"
}, {
kind: "onyx.Button",
content: $L("Done"),
style: "width: 10rem;",
ontap: "savePrefs"
} ]
} ],
create: function() {
this.inherited(arguments), this.log(), this.getPrefs(), this.owner.$.songViewPane.setShowPrefs(this.showPrefs);
},
dropboxClientChanged: function() {
this.log("show Logout Button", this.dropboxClient), this.$.spinner.hide(), this.$.login.setShowing(!this.dropboxClient), this.$.logout.setShowing(this.dropboxClient);
},
logTapped: function(e) {
this.$.spinner.show(), e.name === "logout" ? this.owner.owner.signOut() : (this.owner.owner.connectToDropbox(), this.setOldIndex(0));
},
getPrefs: function() {
Helper.getItem("showPrefs") && (this.showPrefs = Helper.getItem("showPrefs")), Helper.getItem("sync") && (this.sync = Helper.getItem("sync"), this.owner.owner.setSync(this.sync)), this.log("got showPrefs", Helper.getItem("showPrefs"), "sync:", Helper.getItem("sync"));
},
setPrefs: function() {
this.getPrefs(), this.log("setting Preferences in UI");
for (i in this.showPrefs) this.log("set ", i, this.showPrefs[i]), i === "showinToolbar" ? this.$[this.showPrefs[i]].setActive(!0) : this.$[i].setValue(this.showPrefs[i]);
this.log("set sync:", this.sync), this.$[this.sync].setActive(!0);
},
savePrefs: function() {
Helper.setItem("showPrefs", this.showPrefs), this.log("saved showPrefs", this.showPrefs), this.owner.$.songViewPane.setShowPrefs(this.showPrefs), this.owner.$.viewPanels.setIndex(this.oldIndex);
},
toggleShowinToolbar: function(e, t) {
t.originator.getActive() && (this.log("toggled:", e.name, t.originator.name), this.showPrefs[e.name] = t.originator.name);
},
toggle: function(e, t) {
this.log("toggled:", e.name, t.value), this.showPrefs[e.name] = t.value;
},
toggleSync: function(e, t) {
t.originator.getActive() && (this.log("toggled:", e.name, t.originator.name), this.sync = t.originator.name, Helper.setItem("sync", this.sync), this.owner.owner.setSync(this.sync));
},
grabber: function() {
this.owner.owner.$.mainPanels.setIndex(this.owner.owner.$.mainPanels.index ? 0 : 1);
}
});

// SongList.js

enyo.kind({
name: "SongList",
kind: "FittableRows",
classes: "bg enyo-fit",
searchF: "titles",
searchCount: {
a: [],
b: []
},
xmlList: [],
listIndex: undefined,
swipeToAdd: !1,
components: [ {
name: "performanceDrawer",
kind: "onyx.Drawer",
open: !1,
classes: "searchbar",
components: [ {
style: "color: #fff; padding: .5rem; background-color: rgba(0,0,0,0.6); text-align: center;",
ontap: "closePerformance",
components: [ {
name: "performanceText",
classes: "title",
allowHtml: !0
} ]
} ]
}, {
name: "headerToolbar",
kind: "onyx.Toolbar",
ondragfinish: "performanceDragFinish",
components: [ {
kind: "FittableColumns",
style: "width: 100%; margin: 0; padding: 0;",
components: [ {
name: "title",
fit: !0,
classes: "title",
style: "line-height: 2rem;",
content: $L("Song List")
}, {
kind: "FittableColumns",
classes: "searchbuttons",
components: [ {
name: "prefsButton",
kind: "onyx.IconButton",
src: Helper.iconPath() + "prefs.png",
style: "float: right;",
classes: "hochk",
ontap: "showMenu"
}, {
name: "searchButton",
kind: "onyx.ToggleIconButton",
src: Helper.iconPath() + "search.png",
style: "float: right",
onChange: "extendSearch",
disabled: !0
}, {
name: "searchSpinner",
style: "float: right; margin-top: 0;",
showing: !1,
components: [ {
kind: "jmtk.Spinner",
color: "#FFFFFF",
diameter: Helper.ratio() * 30
} ]
} ]
} ]
} ]
}, {
name: "searchBar",
kind: "onyx.Drawer",
open: !1,
classes: "searchbar",
components: [ {
kind: "onyx.InputDecorator",
alwaysLooksFocused: !0,
components: [ {
name: "searchBox",
kind: "onyx.Input",
placeholder: $L("search for ..."),
style: "min-width: 90%; max-width: 95%;",
oninput: "startSearch"
} ]
}, {
style: "width: 100%;",
components: [ {
kind: "onyx.RadioGroup",
onActivate: "searchFilter",
style: "background-color: rgba(0,0,0,0.5); border-bottom: .0625rem solid rgba(0, 0, 0, 0.8);",
controlClasses: "onyx-tabbutton tbicongroup",
components: [ {
name: "titles",
style: "width: 25%;",
components: [ {
kind: "onyx.Icon",
src: Helper.iconPath() + "title-help.png"
} ],
active: !0
}, {
name: "authors",
style: "width: 25%;",
components: [ {
kind: "onyx.Icon",
src: Helper.iconPath() + "author-help.png"
} ]
}, {
name: "lyrics",
style: "width: 25%;",
components: [ {
kind: "onyx.Icon",
src: Helper.iconPath() + "lyrics-help.png"
} ]
}, {
name: "keys",
style: "width: 25%;",
components: [ {
kind: "onyx.Icon",
src: Helper.iconPath() + "key-help.png"
} ]
} ]
} ]
} ]
}, {
name: "newList",
kind: "onyx.Drawer",
open: !1,
classes: "searchbar",
components: [ {
kind: "onyx.InputDecorator",
alwaysLooksFocused: !0,
components: [ {
name: "listName",
kind: "onyx.Input",
placeholder: $L("Enter listname"),
style: "min-width: 90%; max-width: 95%;",
onchange: "saveClicked"
} ]
}, {
name: "errorContent",
style: "color: #fff; padding: .5rem; background-color: #9E0508;",
showing: !1
}, {
kind: "FittableColumns",
fit: !0,
classes: "newlist",
style: "padding: .25rem 0; text-align: center;",
components: [ {
kind: "onyx.Button",
classes: "onyx-negative",
content: $L("Cancel"),
ontap: "clearDialog"
}, {
style: "width: .5rem;"
}, {
kind: "onyx.Button",
classes: "onyx-affirmative",
content: $L("Save"),
ontap: "saveClicked"
} ]
} ]
}, {
name: "error",
kind: "onyx.Drawer",
open: !1,
classes: "searchbar",
components: [ {
style: "color: #fff; padding: .5rem; background-color: #9E0508; text-align: center; max-height: 20rem;",
components: [ {
name: "errorText"
}, {
tag: "br"
}, {
kind: "onyx.Button",
classes: "onyx-negative",
style: "width: 80%;",
content: $L("Close"),
ontap: "closeError"
} ]
} ]
}, {
name: "listPane",
kind: "Panels",
arrangerKind: "CarouselArranger",
draggable: !1,
fit: 1,
index: 6,
components: [ {
classes: "inner-panels",
components: [ {
classes: "deco enyo-center",
style: "text-align: center;",
components: [ {
kind: "jmtk.Spinner",
color: "#9E0508",
diameter: Helper.ratio() * 90
}, {
name: "readProgress",
kind: "onyx.ProgressBar",
showStripes: !1
}, {
name: "readFiles",
tag: "b"
} ]
} ]
}, {
name: "libraryList",
kind: "List",
classes: "inner-panels",
style: "height: 100%;",
reorderable: !1,
centerReorderContainer: !1,
enableSwipe: !0,
onSetupItem: "getLibrary",
onSetupSwipeItem: "setupLibrarySwipeItem",
onSwipeComplete: "librarySwipeComplete",
components: [ {
name: "libraryListItem",
ontap: "listTab",
components: [ {
name: "libraryListTitle",
classes: "item"
} ]
} ],
swipeableComponents: [ {
name: "librarySwipeItem",
classes: "enyo-fit swipe",
components: [ {
name: "librarySwipeTitle",
classes: "item"
}, {
name: "librarySwipeButtons",
kind: "FittableColumns",
fit: !0,
style: "padding: .25rem; text-align: center;",
components: [ {
kind: "onyx.Button",
classes: "onyx-negative",
content: $L("Delete"),
ontap: "deleteSong"
}, {
style: "width: .5rem;"
}, {
kind: "onyx.Button",
content: $L("Cancel"),
ontap: "hideSwipe"
} ]
} ]
} ]
}, {
name: "customList",
kind: "List",
classes: "inner-panels",
style: "height: 100%;",
reorderable: !0,
centerReorderContainer: !1,
enableSwipe: !0,
onSetupItem: "getCustomList",
onReorder: "customListReorder",
onSetupReorderComponents: "setupCustomReorderComponents",
onSetupSwipeItem: "setupCustomSwipeItem",
onSwipeComplete: "customSwipeComplete",
components: [ {
name: "customListItem",
ontap: "listTab",
components: [ {
name: "customListTitle",
classes: "item"
} ]
} ],
reorderComponents: [ {
name: "customReorderContent",
classes: "enyo-fit reorder",
components: [ {
name: "customReorderTitle",
classes: "item"
} ]
} ],
swipeableComponents: [ {
name: "customSwipeItem",
classes: "enyo-fit swipe swipe-delete",
components: [ {
name: "customSwipeTitle",
classes: "item"
} ]
} ]
}, {
name: "customListList",
kind: "List",
classes: "inner-panels",
style: "height: 100%;",
reorderable: !0,
centerReorderContainer: !1,
enableSwipe: !0,
onSetupItem: "getListNames",
onReorder: "manageListReorder",
onSetupReorderComponents: "setupManageReorderComponents",
onSetupSwipeItem: "setupManageSwipeItem",
onSwipeComplete: "manageSwipeComplete",
components: [ {
name: "listNameItem",
ontap: "manageTab",
components: [ {
name: "listNameTitle",
classes: "item"
} ]
} ],
reorderComponents: [ {
name: "listNameReorderContent",
classes: "enyo-fit reorder",
components: [ {
name: "listNameReorderTitle",
classes: "item"
} ]
} ],
swipeableComponents: [ {
name: "listNameSwipeItem",
classes: "enyo-fit swipe swipe-delete",
components: [ {
kind: "FittableColumns",
fit: !0,
style: "padding: .25rem; text-align: center;",
components: [ {
kind: "onyx.Button",
classes: "onyx-negative",
content: $L("Delete"),
ontap: "deleteList"
}, {
style: "width: .5rem;"
}, {
kind: "onyx.Button",
content: $L("Cancel"),
ontap: "hideSwipe"
} ]
} ]
} ]
}, {
classes: "inner-panels",
components: [ {
classes: "deco enyo-center",
style: "text-align: center;",
components: [ {
content: $L("Please select or define a list"),
allowHtml: !0
}, {
tag: "br"
}, {
kind: "onyx.Button",
content: $L("Manage Lists"),
style: "width: 100%; color: white;",
ontap: "openListManager"
} ]
} ]
}, {
classes: "inner-panels",
components: [ {
classes: "deco enyo-center",
style: "text-align: center;",
components: [ {
content: $L("No songfiles found!") + "<br>" + $L("Please add ") + '<a href="http://openlyrics.info/" target="_blank">OpenLyrics</a>' + $L(" files to your Dropbox App-Folder") + "<br><br>" + $L("An example package can be found here: ") + '<a href="http://openlyrics.info/" target="_blank">openlyrics.info</a>',
allowHtml: !0
}, {
tag: "br"
}, {
kind: "onyx.Button",
content: $L("Refresh Library"),
style: "width: 100%; color: white;",
ontap: "refresh"
} ]
} ]
}, {
classes: "inner-panels",
components: [ {
classes: "deco enyo-center",
style: "text-align: center;",
components: [ {
content: $L("Not connected to Dropbox! Please allow dropboxaccess"),
allowHtml: !0
}, {
tag: "br"
}, {
kind: "onyx.Button",
content: $L("Connect"),
style: "width: 100%; color: white;",
ontap: "connect"
} ]
} ]
} ]
}, {
name: "footerToolbar",
kind: "onyx.Toolbar",
components: [ {
kind: "FittableColumns",
style: "width: 100%; margin: 0; padding: 0;",
components: [ {
name: "open",
kind: "onyx.ToggleIconButton",
src: Helper.iconPath() + "open.png",
onChange: "openListManager",
disabled: !0
}, {
kind: "FittableColumns",
fit: !0,
style: "margin: 0; padding: 0; text-align: center;",
components: [ {
name: "library",
kind: "onyx.ToggleIconButton",
src: Helper.iconPath() + "library.png",
onChange: "goToLibrary",
disabled: !0
}, {
name: "list",
kind: "onyx.ToggleIconButton",
src: Helper.iconPath() + "list.png",
onChange: "goToList",
disabled: !0
} ]
}, {
name: "addRem",
kind: "onyx.IconButton",
src: Helper.iconPath() + "add.png",
ontap: "addRem",
disabled: !0
} ]
} ]
} ],
create: function() {
this.inherited(arguments);
},
refresh: function() {
this.owner.refreshLibrary();
},
connect: function() {
this.owner.connectToDropbox();
},
getLibrary: function(e, t) {
var n = this.owner[this.owner.currentList === "searchList" ? "searchList" : "libraryList"].content[t.index], r = e.isSelected(t.index);
this.$.libraryListItem.addRemoveClass("item-selected", r), this.$.libraryListItem.addRemoveClass("item-not-selected", !r), this.$.libraryListTitle.setContent(n.title);
},
listTab: function(e, t) {
this.$[this.owner.currentList === "searchList" ? "libraryList" : this.owner.currentList].select(t.rowIndex);
var n = enyo.bind(this, this.openSong, t.rowIndex);
setTimeout(n, 50);
},
openSong: function(e) {
e === this.owner.currentIndex ? this.owner.openSong(e) : this.owner.setCurrentIndex(e);
},
setupLibrarySwipeItem: function(e, t) {
this.log();
var n = this.owner[this.owner.currentList].content, r = t.index;
if (!n[r]) return;
t.xDirection === -1 ? (this.$.libraryList.setPersistSwipeableItem(!0), this.$.librarySwipeTitle.hide(), this.$.librarySwipeButtons.show(), this.$.librarySwipeItem.addClass("swipe-delete"), this.listIndex = r) : (this.$.librarySwipeTitle.show(), this.$.librarySwipeButtons.hide(), this.$.librarySwipeItem.removeClass("swipe-delete"), this.$.librarySwipeTitle.setContent($L("Add: ") + n[r].title));
},
librarySwipeComplete: function(e, t) {
this.log(), this.addToCustomlist(t.index);
},
deleteSong: function(e, t) {
this.log(), this.owner.deleteFile(this.owner.libraryList.content[this.listIndex].file), this.$.libraryList.clearSwipeables(), this.listIndex = undefined;
},
hideSwipe: function(e, t) {
this.listIndex = undefined, this.$.libraryList.clearSwipeables(), this.$.customListList.clearSwipeables();
},
getCustomList: function(e, t) {
var n = this.owner.savedLists.data[this.owner.customList];
if (n.content[t.index]) {
var r = e.isSelected(t.index);
this.$.customListItem.addRemoveClass("item-selected", r), this.$.customListItem.addRemoveClass("item-not-selected", !r), this.$.customListTitle.setContent(n.content[t.index].title);
}
},
customListReorder: function(e, t) {
var n = this.owner.savedLists.data[this.owner.customList].content, r = enyo.clone(n[t.reorderFrom]);
n.splice(t.reorderFrom, 1), n.splice(t.reorderTo, 0, r), this.owner.setCurrentIndex(t.reorderTo), this.addLists();
},
setupCustomReorderComponents: function(e, t) {
var n = this.owner.savedLists.data[this.owner.customList].content, r = t.index;
if (!n[r]) return;
this.$.customReorderTitle.setContent(n[r].title);
},
setupCustomSwipeItem: function(e, t) {
var n = this.owner.savedLists.data[this.owner.customList].content, r = t.index;
if (!n[r]) return;
this.$.customSwipeTitle.setContent($L("Remove: ") + n[r].title);
},
customSwipeComplete: function(e, t) {
this.removeFromCustomlist(t.index);
},
getListNames: function(e, t) {
var n = this.owner.savedLists.data[t.index], r = e.isSelected(t.index);
this.$.listNameItem.addRemoveClass("item-selected", r), this.$.listNameItem.addRemoveClass("item-not-selected", !r), this.$.listNameTitle.setContent(n.title + " (" + n.content.length + ")");
},
manageTab: function(e, t) {
this.listIndex = t.rowIndex, this.owner.customList = t.rowIndex, Helper.setItem("customList", t.rowIndex), this.$.list.setValue(!0), this.goToList();
},
manageListReorder: function(e, t) {
var n = this.owner.savedLists.data, r = enyo.clone(n[t.reorderFrom]);
n.splice(t.reorderFrom, 1), n.splice(t.reorderTo, 0, r), this.listIndex = t.reorderTo, this.addLists();
},
setupManageReorderComponents: function(e, t) {
var n = this.owner.savedLists.data, r = t.index;
if (!n[r]) return;
this.$.listNameReorderTitle.setContent(n[r].title);
},
setupManageSwipeItem: function(e, t) {
this.log();
var n = this.owner.savedLists.data, r = t.index;
if (!n[r]) return;
this.$.customListList.setPersistSwipeableItem(!0), this.listIndex = r;
},
deleteList: function(e, t) {
this.log(), this.listIndex >= 0 && (this.log("remove custom list:", this.owner.savedLists.data[this.listIndex].title), this.owner.savedLists.data.splice(this.listIndex, 1), this.owner.customList = !1, this.listIndex = undefined, this.owner.saveLists(), this.$.customListList.setCount(this.owner.savedLists.data.length), this.$.customListList.refresh()), this.$.customListList.clearSwipeables(), this.listIndex = undefined;
},
extendSearch: function() {
this.$.searchBar.setOpen(!this.$.searchBar.open), this.$.searchSpinner.setShowing(this.$.searchBar.open), this.$.searchBar.open ? (this.closeError(), this.$.searchBox.focus()) : this.clearSearch();
},
clearSearch: function() {
this.log(), this.owner.currentList = "libraryList", this.goToLibrary(), this.owner.findIndex(), this.$.searchBox.setValue(""), this.$.searchSpinner.hide(), this.$.list.setDisabled(!1);
},
closeSearch: function() {
this.clearSearch(), this.$.searchBar.setOpen(!1), this.$.searchButton.setValue(!1);
},
searchFilter: function(e, t) {
t.originator.getActive() && this.$.searchBar.open && (this.log("search for", t.originator.name), this.searchF = t.originator.name, this.$.searchBox.focus(), this.startSearch());
},
startSearch: function() {
this.log(), this.owner.searchList.content = [];
if (this.$.searchBox.getValue() !== "") {
term = this.$.searchBox.getValue().toLowerCase(), this.log("search term:", term), this.$.searchSpinner.show();
for (i in this.owner.libraryList.content) {
var e = this.owner.libraryList.content[i], t = Helper.filter(this.searchF, term, this.owner.dataList[e.file.toLowerCase()]);
t && this.owner.searchList.content.push(e);
}
this.log("searchList:", this.owner.searchList), this.owner.currentList = "searchList", this.$.title.setContent($L("Search List") + " (" + this.owner.searchList.content.length + ")"), this.$.libraryList.setCount(this.owner.searchList.content.length), this.$.libraryList.reset(), this.$.searchSpinner.hide();
} else this.clearSearch();
},
showMenu: function() {
this.owner.$.infoPanels.setIndex(1), this.owner.$.sidePane.showMenu();
},
performanceDragFinish: function(e, t) {
this.$.listPane.getIndex() === 2 && (+t.dy > 50 && this.$.performanceDrawer.setOpen(!0), +t.dy < -50 && this.$.performanceDrawer.setOpen(!1));
},
closePerformance: function() {
this.running || this.$.performanceDrawer.setOpen(!1);
},
goToSync: function() {
this.log(), this.closeError(), this.$.newList.setOpen(!1), this.$.searchBar.setOpen(!1), this.$.searchButton.setValue(!1), this.owner.currentList = "libraryList", this.$.libraryList.setCount(0), this.$.title.setContent($L("Song List")), this.$.open.setValue(!1), this.$.addRem.setSrc(Helper.iconPath() + "add.png"), this.$.searchButton.setDisabled(!0), this.$.addRem.setDisabled(!0), this.$.open.setDisabled(!0), this.$.list.setValue(!1), this.$.listPane.setIndex(0);
},
goToLibrary: function() {
this.log(), this.$.newList.setOpen(!1), this.$.searchButton.setDisabled(!1), this.owner.currentList = "libraryList", this.$.title.setContent($L("Song List") + " (" + this.owner.libraryList.content.length + ")"), this.$.libraryList.setCount(this.owner.libraryList.content.length), this.$.libraryList.reset(), this.$.open.setValue(!1), this.$.addRem.setSrc(Helper.iconPath() + "add.png"), this.$.addRem.setDisabled(!1), this.$.open.setDisabled(!1), this.$.list.setValue(!1), this.$.listPane.setIndex(1);
},
goToList: function() {
this.log(), this.$.newList.setOpen(!1), this.$.searchBar.setOpen(!1), this.$.searchButton.setValue(!1), this.$.searchButton.setDisabled(!0), this.$.library.setValue(!1), this.$.customList.reset(), enyo.warn(this.owner.savedLists.data[this.owner.customList]), this.owner.savedLists.data[this.owner.customList] ? (this.owner.currentList = "customList", this.owner.setCurrentIndex(undefined), this.$.title.setContent(this.owner.savedLists.data[this.owner.customList].title + " (" + this.owner.savedLists.data[this.owner.customList].content.length + ")"), this.$.performanceText.setContent("<big><b>" + this.owner.savedLists.data[this.owner.customList].content.length + " " + $L("title") + "</b></big><br> Total duration:  s"), this.$.addRem.setSrc(Helper.iconPath() + "remove.png"), this.$.open.setValue(!1), this.$.addRem.setDisabled(!1), this.$.listPane.setIndex(2), this.$.customList.setCount(this.owner.savedLists.data[this.owner.customList].content.length), this.$.customList.refresh()) : this.noList();
},
openListManager: function() {
this.log(), this.closeError(), this.$.searchBar.setOpen(!1), this.$.searchButton.setValue(!1), this.$.searchButton.setDisabled(!0), this.$.addRem.setDisabled(!1), this.$.listPane.setIndex(3), this.owner.$.viewPane.$.viewPanels.setIndex(0), this.$.title.setContent($L("Manage Lists")), this.$.open.setValue(!0), this.$.addRem.setSrc(Helper.iconPath() + "add.png"), this.owner.currentList === "customList" ? this.$.list.setValue(!1) : this.$.library.setValue(!1), this.$.customListList.setCount(this.owner.savedLists.data.length), this.$.customListList.reset();
},
noList: function() {
this.log(), this.closeError(), this.$.listPane.setIndex(4), this.$.title.setContent($L("List?")), this.$.addRem.setSrc(Helper.iconPath() + "add.png"), this.$.addRem.setDisabled(!0), this.$.list.setValue(!1), this.owner.currentList === "customList" ? this.$.list.setValue(!1) : this.$.library.setValue(!1);
},
addRem: function() {
this.log(this.$.listPane.getIndex());
switch (this.$.listPane.getIndex()) {
case 2:
this.removeFromCustomlist(this.owner.currentIndex);
break;
case 3:
this.$.newList.setOpen(!0), this.$.listName.focus();
break;
default:
this.addToCustomlist(this.owner.currentIndex);
}
},
addToCustomlist: function(e) {
this.owner.savedLists.data[this.owner.customList] ? e >= 0 && (this.owner.savedLists.data[this.owner.customList].content.push(this.owner[this.owner.currentList].content[e]), this.owner.saveLists()) : this.noList();
},
removeFromCustomlist: function(e) {
e >= 0 && (this.log("remove", this.owner.savedLists.data[this.owner.customList].content[e].title, "from", this.owner.savedLists.data[this.owner.customList]), this.owner.savedLists.data[this.owner.customList].content.splice(e, 1), this.$.customList.setCount(this.owner.savedLists.data[this.owner.customList].content.length), this.$.customList.refresh(), this.$.title.setContent(this.owner.savedLists.data[this.owner.customList].title + " (" + this.owner.savedLists.data[this.owner.customList].content.length + ")"), this.owner.saveLists());
},
refreshAllLists: function() {
this.$.customList.setCount(this.owner.savedLists.data[this.owner.customList].content.length), this.$.customList.reset(), this.$.customListList.reset();
},
showError: function(e) {
this.$.error.setOpen(!0), this.$.errorText.setContent(e.substring(0, 300) + "...");
},
closeError: function() {
this.$.error.setOpen(!1), this.$.searchSpinner.hide();
},
clearDialog: function() {
this.$.listName.setValue(""), this.$.errorContent.hide(), this.$.newList.setOpen(!1);
},
saveClicked: function(e) {
this.log(this.$.listName.getValue());
if (this.$.listName.getValue() !== "") {
for (i in this.owner.savedLists.data) if (this.owner.savedLists.data[i].title === this.$.listName.getValue()) {
this.log("Name already exist:", this.$.listName.getValue()), this.$.errorContent.setContent($L("Name already exist")), this.$.errorContent.show(), this.resized();
return;
}
this.owner.savedLists.data.push({
title: this.$.listName.getValue(),
content: []
}), this.owner.savedLists.data[this.owner.customList] || (this.owner.customList = 0), this.$.customListList.setCount(this.owner.savedLists.data.length), this.$.customListList.refresh(), this.owner.saveLists(), this.$.listName.setValue(""), this.clearDialog();
} else this.$.errorContent.setContent($L("Name is empty")), this.$.errorContent.show(), this.resized();
}
});

// ViewPanels.js

enyo.kind({
name: "ViewPane",
fit: !0,
realtimeFit: !0,
classes: "bg",
components: [ {
kind: "Image",
src: Helper.iconPath() + "bg.png",
classes: "plec"
}, {
name: "viewPanels",
kind: "Panels",
classes: "enyo-fit",
arrangerKind: "CarouselArranger",
draggable: !1,
realtimeFit: !0,
components: [ {
name: "help",
kind: "Help",
classes: "inner-panels"
}, {
name: "songViewPane",
kind: "SongView",
classes: "inner-panels",
onBack: "goBack",
onEdit: "editSong",
onLinkClick: "linkClicked"
}, {
name: "preferences",
kind: "Preferences",
classes: "inner-panels"
}, {
name: "editToaster",
kind: "Edit",
classes: "inner-panels"
} ]
} ]
}), enyo.kind({
name: "my.Spacer",
kind: "FittableColumns",
style: "height: 2rem;",
components: [ {
style: "width: " + (Helper.phone() ? .5 : 1) + "rem; border-right: .0625rem solid rgba(0,0,0,0.7); height: 2rem;"
}, {
style: "width: " + (Helper.phone() ? .5 : 1) + "rem; border-left: .0625rem solid rgba(255,255,255,0.3); height: 2rem;"
} ]
}), enyo.kind({
name: "my.Grabber",
kind: "onyx.IconButton",
src: Helper.iconPath() + "grabber.png",
style: "float: left;"
});

// SongView.js

enyo.kind({
name: "SongView",
kind: "FittableRows",
classes: "enyo-fit",
defaultSongSecs: 200,
songSecs: this.defaultSongSecs,
scrollTimeout: 0,
running: !1,
lyricsCurrRow: 0,
perRowMSecs: 0,
halfHt: 0,
rowsTraversed: 0,
cursorRow: 0,
initTime: 0,
currIntDate: 0,
currTime: 0,
diffTime: 0,
reqPrms: 0,
prevRow: 0,
tapTimer: undefined,
tapTimer2: undefined,
tapTimer3: undefined,
textIndex: 0,
scroll: 0,
transpose: 0,
order: [],
fullscreen: !1,
lang: undefined,
finished: !0,
dur: [ "Ab", "A", "Bb", "B", "C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#" ],
moll: [ "Abm", "Am", "Bbm", "Bm", "Cm", "C#m", "Dbm", "Dm", "D#m", "Ebm", "Em", "Fm", "F#m", "Gbm", "Gm", "G#m" ],
transposeList: [],
published: {
file: "",
data: {},
xml: undefined,
first: !0,
showPrefs: {
sortLyrics: !0,
showinToolbar: "copyright",
showChords: !0,
showComments: !1,
showName: !0,
showTransposer: !0,
showPrint: !1,
showScroll: !0,
showAuto: !0,
scrollToNext: !0
}
},
components: [ {
kind: "Signals",
onkeydown: "handleKeyPress"
}, {
name: "titleDrawer",
kind: "onyx.Drawer",
open: !1,
classes: "searchbar hochk",
components: [ {
style: "color: #fff; padding: .5rem; background-color: rgba(0,0,0,0.6); text-align: center;",
ontap: "closeTitle",
components: [ {
name: "titleText",
classes: "title",
allowHtml: !0
} ]
} ]
}, {
name: "headerToolbar",
kind: "onyx.Toolbar",
ondragfinish: "titleDragFinish",
components: [ {
name: "titlefit",
kind: "FittableColumns",
style: "width: 100%; margin: 0; padding: 0;",
components: [ {
fit: !0,
components: [ {
name: "title",
classes: "title quer",
style: "line-height: 2rem;",
allowHtml: !0
} ]
}, {
kind: "FittableColumns",
components: [ {
name: "languagegr",
kind: "Group",
defaultKind: "onyx.IconButton",
onActivate: "toggleLang"
}, {
name: "trSpacer",
kind: "my.Spacer",
showing: !1
}, {
name: "transposergr",
kind: "FittableColumns",
components: [ {
name: "transminus",
kind: "onyx.IconButton",
src: Helper.iconPath() + "minus.png",
style: "width: 1.25rem;",
ontap: "transMinus",
disabled: !0
}, {
name: "transposer",
kind: "onyx.Button",
classes: "reintext-button",
style: "width: " + (Helper.phone() ? 3.5 : 5) + "rem; margin-top: -.125rem !important",
ontap: "transButton"
}, {
kind: "onyx.IconButton",
name: "transplus",
src: Helper.iconPath() + "plus.png",
style: "width: 1.25rem;",
ontap: "transPlus",
disabled: !0
}, {
kind: "my.Spacer"
} ]
}, {
name: "fontButton",
kind: "onyx.IconButton",
src: Helper.iconPath() + "font.png",
ontap: "showFontDialog"
}, {
name: "prefsButton",
kind: "onyx.IconButton",
src: Helper.iconPath() + "prefs.png",
ontap: "showMenu"
} ]
} ]
} ]
}, {
name: "transposePanels",
kind: "Panels",
fit: !0,
arrangerKind: "CollapsingArranger",
draggable: !1,
components: [ {
name: "viewIncScrollBar",
kind: "FittableColumns",
fit: !0,
classes: "app-panels inner-panels",
components: [ {
name: "cursorScrollBar",
kind: "cursorScrollBar",
ontap: "cursorTapHandler",
classes: "cursor"
}, {
name: "viewScroller",
kind: "enyo.Scroller",
classes: "michote-scroller",
horizontal: "hidden",
fit: !0,
components: [ {
name: "lyric",
ondragfinish: "songDragFinish",
ontap: "onDoubleTap"
} ]
} ]
}, {
name: "transposeList",
kind: "List",
touch: !0,
count: 16,
style: "height: 100%; min-width: 4rem; max-width: 4rem; visibility: hidden;",
classes: "side-pane",
onSetupItem: "getTranspose",
components: [ {
name: "transposeListItem",
ontap: "transposeTab",
components: [ {
name: "transposeListTitle",
classes: "item"
} ]
} ]
} ]
}, {
name: "footerToolbar",
kind: "onyx.Toolbar",
pack: "center",
components: [ {
kind: "FittableColumns",
style: "width: 100%; margin: 0; padding: 0;",
components: [ {
kind: "FittableColumns",
classes: "side",
components: [ {
kind: "my.Grabber",
ontap: "grabber"
}, {
name: "copy",
classes: "title copy quer",
fit: !0,
content: "&copy; michote",
style: "padding: .3125rem 0;",
allowHtml: !0
} ]
}, {
kind: "FittableColumns",
classes: "middle",
components: [ {
name: "backButton",
kind: "onyx.IconButton",
disabled: !0,
src: Helper.iconPath() + "back.png",
ontap: "textBack"
}, {
style: "width: " + (Helper.phone() ? .75 : 2) + "rem;"
}, {
name: "forthButton",
kind: "onyx.IconButton",
disabled: !0,
src: Helper.iconPath() + "forth.png",
ontap: "textForth"
} ]
}, {
name: "buttonfit",
kind: "FittableColumns",
classes: "side",
stlye: "text-align: right;",
components: [ {
name: "playButton",
kind: "onyx.IconButton",
toggling: !0,
src: Helper.iconPath() + "play.png",
ontap: "togglePlay"
}, {
fit: !0
}, {
name: "printButton",
kind: "onyx.IconButton",
src: Helper.iconPath() + "print.png",
ontap: "print",
showing: Helper.browser()
}, {
name: "editButton",
kind: "onyx.IconButton",
src: Helper.iconPath() + "edit.png",
ontap: "openEdit"
}, {
name: "infoButton",
kind: "onyx.IconButton",
src: Helper.iconPath() + "info.png",
ontap: "showInfo"
} ]
} ]
} ]
} ],
create: function() {
this.inherited(arguments);
},
showPrefsChanged: function() {
this.xml ? this.renderLyrics() : this.buttons();
},
buttons: function() {
this.log("redraw buttons"), this.$.backButton.setShowing(this.showPrefs.showScroll), this.$.forthButton.setShowing(this.showPrefs.showScroll), this.$.transposergr.setShowing(this.showPrefs.showTransposer), this.$.playButton.setShowing(this.showPrefs.showAuto), this.$.printButton.setShowing(Helper.browser() ? this.showPrefs.showPrint : !1), this.$.buttonfit.resized();
},
start: function() {
this.renderLyrics(), this.initCursor();
},
renderLyrics: function() {
this.xml = this.owner.owner.dataList[this.file.toLowerCase()], this.lang = undefined, this.log("render lyrics of", this.file), this.buttons(), this.$.transposeList.applyStyle("visibility", "hidden");
var e = ParseXml.get_metadata(this.xml, "transposition");
e && this.first ? (this.transpose = parseInt(e), this.first = !1) : this.first ? (this.transpose = 0, this.first = !1) : this.first = !1, this.data = ParseXml.parse(this.xml, this.showPrefs.showChords, this.showPrefs.showComments, this.transpose), this.log("get data"), this.data.titles !== undefined && (this.textIndex = 0, this.scroll = 0, this.$.languagegr.destroyClientControls(), this.$.trSpacer.hide(), this.data.haslang[0] && (this.createLangToggle(this.data.haslang), this.$.trSpacer.show(), this.$.languagegr.render()), this.metaDataSet(), this.lyricDataSet(), this.enableTransposer(this.data.key, this.data.haschords, this.transpose), this.finished && (this.$.editButton.setDisabled(!1), this.$.printButton.setDisabled(!1), this.$.backButton.setDisabled(!0), this.data.verseOrder && this.textIndex === this.data.verseOrder.length - 1 ? this.$.forthButton.setDisabled(!0) : this.$.forthButton.setDisabled(!1))), this.$.titlefit.resized();
},
getTranspose: function(e, t) {
var n = this.transposeList[t.index], r = e.isSelected(t.index);
this.$.transposeListItem.addRemoveClass("item-selected", r), this.$.transposeListItem.addRemoveClass("item-not-selected-trans", !r), this.$.transposeListTitle.setContent(n);
},
enableTransposer: function(e, t, n) {
if (e && t) {
this.log("enable Transposer"), this.$.transminus.setDisabled(!1), this.$.transplus.setDisabled(!1), this.transposeList = e.charAt(e.length - 1) === "m" ? this.moll : this.dur, this.$.transposeList.reset();
for (i in this.transposeList) this.transposeList[i] === e && this.$.transposeList.select(i);
this.$.transposer.setContent(n ? Transposer.transpose(e, n) : e), this.$.transposer.show();
} else !e && t ? (this.log("enable Transposer without key"), this.$.transminus.setDisabled(!1), this.$.transplus.setDisabled(!1), this.$.transposer.hide()) : (this.$.transminus.setDisabled(!0), this.$.transplus.setDisabled(!0), this.$.transposer.hide());
},
transButton: function() {
this.$.transposeList.applyStyle("visibility", "visible");
},
transposeTab: function(e, t) {
this.setTrans(Transposer.getDelta(this.data.key, this.transposeList[t.rowIndex])), this.$.transposeList.applyStyle("visibility", "hidden");
},
setTrans: function(e) {
e > 11 ? e -= 12 : e < -11 && (e += 12), this.log(e), this.transpose = e, this.renderLyrics();
},
transPlus: function() {
this.setTrans(this.transpose += 1);
},
transMinus: function() {
this.setTrans(this.transpose -= 1);
},
transPick: function() {
this.setTrans(Transposer.getDelta(this.data.key, this.$.transposer.getValue()));
},
createLangToggle: function(e) {
for (i in e) this.addLangToggle(e[i]);
this.lang ? this.lang : this.lang = e[0], this.$[this.lang].setActive(!0);
},
addLangToggle: function(e) {
this.log("add", e, "toggle"), this.$.languagegr.createComponent({
name: e,
kind: "onyx.IconButton",
src: Helper.iconPath() + "flag.png",
owner: this,
components: [ {
content: e,
classes: "flag-button"
} ]
});
},
toggleLang: function(e, t) {
t.originator.getActive() && (this.log('The "' + t.originator.name + '" radio button is selected.'), this.lang = t.originator.name, this.metaDataSet(), this.lyricDataSet());
},
metaDataSet: function() {
this.log();
var e = this.data, t = ParseXml.titlesToString(e.titles, this.lang);
this.$.title.setContent(t);
var n = e.released ? e.released + ": " : "", r = "";
e[this.showPrefs.showinToolbar] ? r = this.showPrefs.showinToolbar === "authors" ? n + ParseXml.authorsToString(e.authors).join(", ") : "&copy; " + n + e[this.showPrefs.showinToolbar] : r = "&copy; " + n + $L("no" + this.showPrefs.showinToolbar), this.$.copy.setContent(r), this.$.titleText.setContent("<big><b>" + t + "</b></big><br><small>" + r + "</small>");
},
lyricDataSet: function() {
this.order = this.lang ? Helper.orderLanguage(this.data.verseOrder, this.lang) : this.data.verseOrder, this.$.lyric.destroyClientControls();
var e = this.data;
if (e.lyrics) {
var t = "";
if (e.lyrics === "nolyrics") t = $L(e.lyrics); else if (e.lyrics === "wrongversion") t = $L(e.lyrics); else {
if (this.showPrefs.sortLyrics) {
var n = Helper.orderLyrics(e.lyrics, this.order, this.lang);
this.order = Helper.handleDoubles(this.order);
} else var n = e.lyrics;
for (var r in n) {
this.log("create element ", r);
if (this.showPrefs.showName) {
var i = $L(n[r][0].charAt(0)).charAt(0) + n[r][0].substring(1, n[r][0].length) + ":";
this.$.lyric.createComponent({
name: r,
kind: "FittableColumns",
fit: !0,
classes: Helper.phone() ? "lyric lyricmar-phone" : "lyric lyricmar",
components: [ {
content: i,
classes: "element",
style: "width: 2em;"
}, {
content: n[r][1],
fit: !0,
allowHtml: !0
} ]
}, {
owner: this
});
} else this.$.lyric.createComponent({
name: r,
classes: Helper.phone() ? "lyric lyricmar-phone" : "lyric lyricmar",
components: [ {
content: n[r][1],
allowHtml: !0
} ]
}, {
owner: this
});
Helper.browser && this.$.lyric.createComponent({
classes: "pageBreak"
});
}
}
this.$.lyric.render();
if (this.$.lyric.node.lastChild) {
var s = this.$.lyric.node.lastChild.clientHeight, o = window.innerHeight - 138 - s;
o > 0 && this.$.lyric.createComponent({
name: "scrollspacer",
style: "height:" + o + "px;width:100%;",
classes: "scrollspacer"
});
}
}
this.$.lyric.render();
},
togglePlay: function() {
this.log(), this.tapTimer2 = undefined, this.$.playButton.src === Helper.iconPath() + "play.png" ? (this.lyricsCurrRow !== 0 ? (this.running = !0, this.resetStartTime(), this.showLyrics(!1)) : (this.initForTextPlay(), this.$.cursorScrollBar.cursorOn(), this.running = !0, this.finished = !1, this.perRowMSecs = 1e3 * this.songSecs / this.rowsTraversed, this.log("Require to scroll a row per", this.perRowMSecs, "mSecs. duration", this.songSecs), this.resetStartTime(), this.showLyrics(!0)), this.$.playButton.set("src", Helper.iconPath() + "pause.png"), this.$.forthButton.setDisabled(!1), this.$.forthButton.setDisabled(!0), this.$.backButton.setDisabled(!0), this.$.printButton.setDisabled(!0)) : (this.$.playButton.set("src", Helper.iconPath() + "play.png"), this.running = !1, this.finished && (this.initCursor(), this.showPrefs.scrollToNext && this.nextSong()));
},
movingLyrics: function() {
return this.lyricsCurrRow > this.halfHt && this.lyricsCurrRow < this.rowsTraversed - this.halfHt ? !0 : !1;
},
cursorTapHandler: function(e, t) {
return this.tapTimer2 === undefined ? this.tapTimer2 = window.setTimeout(enyo.bind(this, this.togglePlay), 300) : this.running && this.tapTimer3 === undefined && (window.clearTimeout(this.tapTimer2), this.tapTimer2 = undefined, this.tapTimer3 = window.setTimeout(enyo.bind(this, this.undefTimer3), 200), this.resetCursorTiming(t)), !1;
},
undefTimer3: function() {
this.tapTimer3 = undefined;
},
resetStartTime: function() {
this.currIntDate = new Date, this.currTime = this.currIntDate.getTime(), this.initTime = this.currTime - this.diffTime, this.prevRow = this.lyricsCurrRow - 1;
},
resetCursorTiming: function(e) {
var t = e.clientY - this.$.headerToolbar.getBounds().height - this.cursorRow, n = this.lyricsCurrRow;
this.lyricsCurrRow = this.lyricsCurrRow + t, this.lyricsCurrRow < this.halfHt ? this.cursorRow = this.lyricsCurrRow : this.lyricsCurrRow > this.rowsTraversed - this.halfHt ? (this.cursorRow = 2 * this.halfHt - (this.rowsTraversed - this.lyricsCurrRow), this.$.viewScroller.setScrollTop(this.lyricsCurrRow - this.cursorRow)) : this.cursorRow = this.halfHt, this.$.cursorScrollBar.setY(this.cursorRow), this.songSecs = this.songSecs * n / this.lyricsCurrRow, window.clearTimeout(this.scrollTimeout), this.perRowMSecs = 1e3 * this.songSecs / this.rowsTraversed, this.diffTime = this.perRowMSecs * this.lyricsCurrRow, this.resetStartTime(), this.showLyrics(!1);
if (this.data.titles) var r = ParseXml.titlesToString(this.data.titles);
this.$.title.setContent(r + " (" + Math.floor(this.songSecs) + " secs)");
},
showLyrics: function(e) {
if (this.running) {
if (this.lyricsCurrRow === 0 && e) {
var t = new Date;
this.initTime = t.getTime(), this.prevRow = 0, this.diffTime = 0;
}
this.currIntDate = new Date, this.currTime = this.currIntDate.getTime(), this.lyricsCurrRow = this.rowsTraversed * (this.currTime - this.initTime) / (this.songSecs * 1e3), this.prevRow !== this.lyricsCurrRow && (this.movingLyrics() ? this.$.viewScroller.setScrollTop(this.lyricsCurrRow - this.cursorRow) : (this.cursorRow = this.lyricsCurrRow < this.halfHt ? this.lyricsCurrRow : 2 * this.halfHt - this.rowsTraversed + this.lyricsCurrRow, this.$.cursorScrollBar.setY(this.cursorRow))), this.prevRow = this.lyricsCurrRow;
if (this.lyricsCurrRow > this.rowsTraversed) window.clearTimeout(this.scrollTimeout), this.$.cursorScrollBar.cursorOff(), this.finished = !0, this.running = !1, this.log("duration ", ((new Date).getTime() - this.initTime) / 1e3, "secs"); else {
var n = this;
this.scrollTimeout = window.setTimeout(function() {
enyo.requestAnimationFrame(enyo.bind(n, "showLyrics", !1));
}, this.perRowMSecs);
}
} else this.diffTime = this.currTime - this.initTime;
},
initCursor: function() {
this.log(), this.cursorRow = 0, this.lyricsCurrRow = 0, this.$.viewScroller.setScrollTop(this.lyricsCurrRow), this.$.cursorScrollBar.setY(this.cursorRow), this.$.cursorScrollBar.cursorOff(), window.clearTimeout(this.scrollTimeout), this.$.playButton.setProperty("src", Helper.iconPath() + "play.png"), this.running = !1, this.finished = !1, this.$.editButton.setDisabled(!1), this.$.fontButton.setDisabled(!1), this.$.forthButton.setDisabled(!1), this.$.backButton.setDisabled(!1), this.$.printButton.setDisabled(!1), this.resizeHandler();
},
resizeHandler: function() {
this.inherited(arguments), this.log();
var e = document.getElementsByClassName("mochordbox");
if (e) for (i = 0; i < e.length; i++) e[i].style.width = "auto";
if (this.$.lyric.node !== null && this.owner.owner.$.sidePane.css.autoResize === !0) {
this.log();
var t = 100;
this.$.lyric.applyStyle("font-size", t + "%"), this.$.lyric.applyStyle("display", "inline-block");
var n = t * (this.$.lyric.owner.width - 108) / (this.$.lyric.node.clientWidth - 72), r = this.owner.owner.$.sidePane.css.fMin * 10 * Helper.ratio() + 80;
n = n < r ? r : n, r = this.owner.owner.$.sidePane.css.fMax * 10 * Helper.ratio() + 80, n = n > r ? r : n, this.$.lyric.applyStyle("font-size", Math.floor(n) + "%"), this.$.lyric.applyStyle("display", "block");
}
if (e) {
var s = 0;
for (i = 0; i < e.length; i++) e[i].clientWidth > s && (s = e[i].clientWidth);
for (i = 0; i < e.length; i++) e[i].style.width = s + "px";
}
},
initForTextPlay: function() {
this.log();
var e = this.$.lyric.getControls();
this.resizeLyrics(), this.rowsTraversed = this.$.lyric.node.clientHeight;
for (i = 0; i < e.length; i++) e[i].name === "scrollspacer" && (this.rowsTraversed = this.rowsTraversed - this.$.lyric.node.lastChild.clientHeight + 20);
this.halfHt = this.$.viewScroller.node.clientHeight / 2, this.$.viewScroller.setScrollTop(this.lyricsCurrRow), this.$.cursorScrollBar.$.canvas.setAttribute("height", this.$.viewScroller.node.clientHeight), this.songSecs = this.data.duration ? this.data.duration : this.defaultSongSecs, this.$.cursorScrollBar.cursorOff(), this.$.cursorScrollBar.hasNode().height = this.$.viewScroller.node.clientHeight, this.$.editButton.setDisabled(!0), this.$.fontButton.setDisabled(!0);
},
scrollHelper: function() {
var e = this.$[this.order[this.textIndex]].hasNode(), t = Helper.calcNodeOffset(e).top - 74;
this.scroll = this.$.viewScroller.getScrollTop(), this.$.viewScroller.scrollTo(0, this.scroll + t);
},
textForth: function() {
this.textIndex += 1, this.textIndex === 1 ? this.$.backButton.setDisabled(!1) : this.textIndex === this.data.verseOrder.length - 1 && this.$.forthButton.setDisabled(!0), this.textIndex === this.data.verseOrder.length + 1 && this.nextSong(), this.textIndex <= this.data.verseOrder.length - 1 && this.scrollHelper();
},
textBack: function() {
this.textIndex -= 1, this.textIndex === 0 ? this.$.backButton.setDisabled(!0) : this.textIndex === this.data.verseOrder.length - 2 && this.$.forthButton.setDisabled(!1), this.textIndex === -2 && this.prevSong(), this.textIndex >= 0 && this.scrollHelper();
},
handleKeyPress: function(e, t) {
this.running || (k = t.keyCode, this.log(k), (k === 33 || k === 38 || k === 37 || k === 32) && this.textIndex > -2 ? this.textBack() : (k === 34 || k === 40 || k === 39 || k === 13) && this.textIndex < this.data.verseOrder.length + 1 && this.textForth());
},
nextSong: function() {
var e = this.owner.owner;
e.currentIndex >= 0 && e.currentIndex < e[e.currentList].content.length - 1 && (this.log("next Song"), e.setCurrentIndex(e.currentIndex + 1));
},
prevSong: function() {
var e = this.owner.owner;
e.currentIndex > 0 && (this.log("prev Song"), e.setCurrentIndex(e.currentIndex - 1));
},
songDragFinish: function(e, t) {
this.log(), +t.dx > 120 && this.nextSong(), +t.dx < -120 && this.prevSong();
},
titleDragFinish: function(e, t) {
Helper.phone && !this.running && (+t.dy > 50 && this.$.titleDrawer.setOpen(!0), +t.dy < -50 && this.$.titleDrawer.setOpen(!1));
},
closeTitle: function() {
this.running || this.$.titleDrawer.setOpen(!1);
},
onDoubleTap: function() {
if (this.tapTimer !== undefined) return this.log("double tap: set fullscreen: ", !this.fullscreen), window.clearTimeout(this.tapTimer), this.tapTimer = undefined, this.fullscreen = !this.fullscreen, this.fullscreen === !0 ? (this.$.headerToolbar.hide(), this.$.footerToolbar.hide(), this.$.titleDrawer.setOpen(!1), this.owner.owner.$.mainPanels.setIndex(1)) : (this.$.headerToolbar.show(), this.$.footerToolbar.show(), Helper.phone() ? this.owner.owner.$.mainPanels.setIndex(1) : this.owner.owner.$.mainPanels.setIndex(0)), window.PalmSystem && enyo.setFullScreen(this.fullscreen), this.log("mainPanels index", this.owner.owner.$.mainPanels.index), !0;
this.tapTimer = window.setTimeout(enyo.bind(this, this.undefTimer), 500);
},
undefTimer: function() {
this.tapTimer = undefined;
},
grabber: function() {
this.owner.owner.$.mainPanels.setIndex(this.owner.owner.$.mainPanels.index ? 0 : 1);
},
showMenu: function() {
this.log("show menu"), this.owner.owner.$.infoPanels.setIndex(1), this.owner.owner.$.sidePane.showMenu();
},
openEdit: function() {
this.log("open editmode for: ", this.file), this.owner.$.viewPanels.setIndex(3), this.owner.$.editToaster.setXml(this.xml), this.owner.$.editToaster.setFile(this.file), this.owner.$.editToaster.populate();
},
showInfo: function() {
this.owner.owner.$.infoPanels.setIndex(1), this.owner.owner.$.sidePane.showInfo(this.data);
},
showFontDialog: function() {
this.owner.owner.$.infoPanels.setIndex(1), this.owner.owner.$.sidePane.showFont();
},
print: function() {
var e = document.URL;
e = e.slice(0, e.lastIndexOf("/") + 1);
var t = window.open(e, "Print Popup", "width=800, height=600"), n = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">';
n += "<html><head><title>Print Popup</title>", n += '<link href="build/app.css" rel="stylesheet" />', n += "</head><body>", n += this.printHeader(), n += this.$.lyric.node.innerHTML, n += this.printFooter(), n += "</body></html>", t.document.write(n);
var r = 0, s = t.document.getElementsByClassName("text");
for (i in s) s[i].clientWidth > r && (r = s[i].clientWidth);
var o = (s[0].parentElement.clientWidth - 30) / r, u = t.document.getElementsByClassName("scrollspacer");
while (u.length > 0) u[0].parentNode.removeChild(u[0]);
t.document.body.style.fontSize = 20 * o + "px";
var a = this;
this.timer = window.setTimeout(function() {
a.printIt(t);
}, 500);
},
printIt: function(e) {
e.print(), e.close();
},
printHeader: function() {
var e = "";
if (this.data.titles != []) for (n = 0; n < this.data.titles.length; ++n) {
var t = this.data.titles[n];
if (t.lang == this.lang || t.lang == null) e += '<div class="printTitle">' + t.title + "</div>";
}
for (var n = 0; n < this.data.comments.length; n++) e += this.data.comments[n] + "<br>";
return this.data.key && (e += "Key : " + this.data.key + "<br>"), this.data.duration && (e += "Duration : " + this.data.duration + "secs" + "<br>"), this.data.tempo && (e += "Tempo : " + this.data.tempo + "<br>"), e;
},
printFooter: function() {
if (this.data.authors !== []) {
var e, t = '<div class="printCopy">by<br>';
for (i = 0; i < this.data.authors.length; ++i) {
var e = this.data.authors[i];
if (e.lang == this.lang || e.lang == undefined || e.lang == "") t += "&nbsp;&nbsp;" + e.author, e.type !== null && (t += " (" + e.lang + " " + e.type + ")"), t += "<br>";
}
}
return this.data.released && (t += this.data.released + " "), this.data.copyright && (t += "&copy; " + this.data.copyright + "<br>"), this.data.publisher && (t += this.data.publisher + "<br>"), t += "<br><br><center>Printed with mySongs</center></div>", t;
}
});

// Help.js

enyo.kind({
name: "Help",
kind: "FittableRows",
components: [ {
name: "headerToolbar",
kind: "onyx.Toolbar",
style: "text-align:center;",
components: [ {
name: "title",
classes: "title",
content: $L("Help"),
allowHtml: !0
}, {
name: "prefsButton",
kind: "onyx.IconButton",
src: Helper.iconPath() + "prefs.png",
style: "float: right",
ontap: "showMenu"
}, {
name: "fontButton",
kind: "onyx.IconButton",
src: Helper.iconPath() + "font.png",
style: "float: right",
ontap: "showFontDialog"
} ]
}, {
name: "viewScroller",
kind: "enyo.Scroller",
classes: "michote-scroller",
horizontal: "hidden",
fit: 1,
components: [ {
name: "helpContent",
kind: "FittableRows",
classes: Helper.phone() ? "lyric lyricmar-phone" : "lyric lyricmar",
components: [ {
allowHtml: !0,
content: "<h1>" + $L("Welcome to ") + Helper.app
}, {
allowHtml: !0,
content: $L("Display, manage and edit your songs on your device.") + "<br>" + '<a href="http://openlyrics.info/" target="_blank">OpenLyrics XML Standard</a>' + "<br>" + $L(" TODO") + "<br><br>"
}, {
allowHtml: !0,
content: "<h2>" + $L("Icon Guide") + "</h2>"
}, {
allowHtml: !0,
content: "<h3>" + $L("Main View") + "</h3>"
}, {
tag: "ul",
classes: "help",
components: [ {
tag: "il",
components: [ {
kind: "Image",
src: Helper.iconPath() + "flag-help.png",
fit: !1
}, {
tag: "p",
content: $L("toggles language if present")
} ]
}, {
tag: "il",
components: [ {
kind: "Image",
src: Helper.iconPath() + "minus-help.png"
}, {
kind: "Image",
src: Helper.iconPath() + "plus-help.png"
}, {
tag: "p",
content: $L("Transposer")
} ]
}, {
tag: "il",
components: [ {
kind: "Image",
src: Helper.iconPath() + "font-help.png",
fit: !1
}, {
tag: "p",
content: $L("change fontsize and linespacing")
} ]
}, {
tag: "il",
components: [ {
kind: "Image",
src: Helper.iconPath() + "back-help.png"
}, {
tag: "p",
content: $L("scrolls lyrics back depending on verseorder")
} ]
}, {
tag: "il",
components: [ {
kind: "Image",
src: Helper.iconPath() + "forth-help.png"
}, {
tag: "p",
content: $L("scrolls lyrics forth depending on verseorder")
} ]
}, {
tag: "il",
components: [ {
kind: "Image",
src: Helper.iconPath() + "play-help.png"
}, {
tag: "p",
content: $L("start autoscroll")
} ]
}, {
tag: "il",
components: [ {
kind: "Image",
src: Helper.iconPath() + "info-help.png"
}, {
tag: "p",
content: $L("shows songinfo")
} ]
} ]
}, {
allowHtml: !0,
content: "<h3>" + $L("List Pane") + "</h3>"
}, {
tag: "ul",
classes: "help",
components: [ {
tag: "il",
components: [ {
kind: "Image",
src: Helper.iconPath() + "search-help.png"
}, {
tag: "p",
content: $L("opens and closes searchwindow")
} ]
}, {
tag: "il",
components: [ {
kind: "Image",
src: Helper.iconPath() + "open-help.png"
}, {
tag: "p",
content: $L("opens listpicker")
} ]
}, {
tag: "il",
components: [ {
kind: "Image",
src: Helper.iconPath() + "library-help.png"
}, {
tag: "p",
content: $L("toogles library")
} ]
}, {
tag: "il",
components: [ {
kind: "Image",
src: Helper.iconPath() + "list-help.png"
}, {
tag: "p",
content: $L("toogles custom list")
} ]
}, {
tag: "il",
components: [ {
kind: "Image",
src: Helper.iconPath() + "add-help.png"
}, {
tag: "p",
content: $L("adds song to active list or creates a new custom list")
} ]
}, {
tag: "il",
components: [ {
kind: "Image",
src: Helper.iconPath() + "remove-help.png"
}, {
tag: "p",
content: $L("removes song from list or removes the custom list")
} ]
} ]
}, {
allowHtml: !0,
content: "<h3>" + $L("Search") + "</h3>"
}, {
tag: "ul",
classes: "help",
components: [ {
tag: "il",
components: [ {
kind: "Image",
src: Helper.iconPath() + "title-help.png"
}, {
tag: "p",
content: $L("searches in titles")
} ]
}, {
tag: "il",
components: [ {
kind: "Image",
src: Helper.iconPath() + "author-help.png"
}, {
tag: "p",
content: $L("searches in authors")
} ]
}, {
tag: "il",
components: [ {
kind: "Image",
src: Helper.iconPath() + "lyrics-help.png"
}, {
tag: "p",
content: $L("searches in lyrics")
} ]
}, {
tag: "il",
components: [ {
kind: "Image",
src: Helper.iconPath() + "key-help.png"
}, {
tag: "p",
content: $L("searches in comments and themes")
} ]
} ]
}, {
allowHtml: !0,
content: "<h3>" + $L("Editing") + "</h3>"
}, {
tag: "p",
content: $L("Note: Everything you edit will only be stored temporarily until you hit 'done' and actually write the changes to XML or 'discard' to discard all changes you made.")
}, {
tag: "ul",
classes: "help",
components: [ {
tag: "il",
components: [ {
kind: "Image",
src: Helper.iconPath() + "title-help.png"
}, {
tag: "p",
content: $L("opens metadata editing page")
} ]
}, {
tag: "il",
components: [ {
kind: "Image",
src: Helper.iconPath() + "lyrics-help.png"
}, {
tag: "p",
content: $L("opens lyrics editing page")
} ]
}, {
tag: "il",
components: [ {
kind: "Image",
src: Helper.iconPath() + "add-help.png"
}, {
tag: "p",
content: $L("adds a new metadata or lyric element")
} ]
}, {
tag: "il",
components: [ {
kind: "Image",
src: Helper.iconPath() + "edit-help.png"
}, {
tag: "p",
content: $L("edits a lyric element (rename, language, parts and delete)")
} ]
} ]
}, {
allowHtml: !0,
content: "<h2>" + $L("Gesture Guide") + "</h2>"
}, {
allowHtml: !0,
content: "<h3>" + $L("Main View") + "</h3>"
}, {
allowHtml: !0,
content: "<ul>             <li>" + $L("Swipe to the right to open next song in list") + "</li>             <li>" + $L("Swipe to the left to open previous song in list") + "</li>             <li>" + $L("Doubletab maximizes mainview") + "</li>             <li>" + $L("Swipe the sidepane to the right to close it") + "</li>             <li>" + $L("Swipe an librarylist item to add it to the current custom list") + "</li>             <li>" + $L("Swipe an custom list item to remove it from this list") + "</li>             <li>" + $L("Swipe a list to remove it") + "</li>           </ul>"
}, {
tag: "br"
}, {
allowHtml: !0,
content: '<h2><a href="http://dl.dropbox.com/u/1429945/MySongBook%20Documentation/index.html" target="_blank">Online Documentation</a></h2>'
}, {
allowHtml: !0,
content: "<br>"
}, {
allowHtml: !0,
content: "<h2>" + $L("Contact") + "</h2>"
}, {
tag: "ul",
allowHtml: !0,
content: '<li><a href="mailto:reischuck.micha@googlemail.com">Micha Reischuck</a></li>           <li><a href="https://twitter.com/michote_" target="_blank">@michote_</a></li>           <li><a href="http://forums.webosnation.com/webos-homebrew-apps/318615-mysongbook.html" target="_blank">          webOS Nation forum thread</a></li>'
}, {
allowHtml: !0,
content: "<br>"
}, {
allowHtml: !0,
content: "<h2>" + $L("Open Source") + "</h2>"
}, {
allowHtml: !0,
content: Helper.app + ' is available under the terms of the           <a href="http://opensource.org/licenses/mit-license.php" target="_blank">MIT license</a>.<br> The source can be found on           <a href="https://github.com/michote/mySongs" target="_blank">github</a>.'
}, {
allowHtml: !0,
content: "<br>"
}, {
allowHtml: !0,
content: "<h2>" + $L("Changelog") + "</h2>"
}, {
allowHtml: !0,
content: "<b>Version 0.5</b>"
}, {
tag: "ul",
allowHtml: !0,
content: "<li>Rewrite in Enyo2</li>"
}, {
allowHtml: !0,
content: "<br>"
} ]
} ]
}, {
name: "footerToolbar",
kind: "onyx.Toolbar",
components: [ {
kind: "my.Grabber",
ontap: "grabber"
} ]
} ],
grabber: function() {
this.owner.owner.$.mainPanels.setIndex(this.owner.owner.$.mainPanels.index ? 0 : 1);
},
showFontDialog: function() {
this.owner.owner.$.infoPanels.setIndex(2), this.owner.owner.$.sidePane.showFont();
},
showMenu: function() {
this.owner.owner.$.infoPanels.setIndex(1), this.owner.owner.$.sidePane.showMenu();
}
});

// SidePane.js

enyo.kind({
name: "SidePane",
kind: "FittableRows",
classes: "side-pane enyo-fit",
metaList: [ "title", "author", "songbook", "comment" ],
lyricsList: [ "v", "c", "b", "p", "e" ],
baseChord: [ "Ab", "A", "A#", "Bb", "B", "C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#" ],
chordExten: [ "", "m", "7", "m7", "maj7", "sus4", "0", "9", "maj", "sus", "dim", "+", "11" ],
base: undefined,
exten: undefined,
back: undefined,
parts: [ 1 ],
published: {
css: {
size: 4,
space: 2,
fMin: 2,
fMax: 12,
autoResize: !1
},
element: undefined
},
components: [ {
name: "headerToolbar",
kind: "onyx.Toolbar",
style: "text-align: center;",
ondragfinish: "dragFinish",
components: [ {
name: "title",
classes: "title",
content: $L("Song Info")
} ]
}, {
name: "Pane",
kind: "Panels",
draggable: !1,
fit: !0,
components: [ {
name: "menuScroller",
kind: "enyo.Scroller",
fit: !0,
ondragfinish: "dragFinish",
components: [ {
kind: "onyx.MenuItem",
onSelect: "showPreferences",
components: [ {
kind: "onyx.Icon",
src: Helper.iconPath() + "menu-settings.png"
}, {
content: $L("Preferences")
} ]
}, {
kind: "onyx.MenuItem",
onSelect: "newSong",
components: [ {
kind: "onyx.Icon",
src: Helper.iconPath() + "menu-new.png"
}, {
content: $L("Create new song")
} ]
}, {
kind: "onyx.MenuItem",
onSelect: "refresh",
components: [ {
kind: "onyx.Icon",
src: Helper.iconPath() + "menu-sync.png"
}, {
content: $L("Refresh Library")
} ]
}, {
kind: "onyx.MenuItem",
onSelect: "showHelp",
components: [ {
kind: "onyx.Icon",
src: Helper.iconPath() + "menu-help.png"
}, {
content: $L("Help")
} ]
}, {
kind: "onyx.MenuItem",
onSelect: "showAbout",
components: [ {
kind: "onyx.Icon",
src: Helper.iconPath() + "menu-about.png"
}, {
content: $L("About")
} ]
}, {
name: "about",
kind: "onyx.Drawer",
open: !1,
components: [ {
classes: "deco",
style: "text-align: center;",
components: [ {
content: '<span style="color: #9E0508; font-weight: bold;">' + Helper.app + " &ndash; v. " + Helper.vers + "</span><br>" + '&copy; 2013: <a href="mailto:reischuck.micha@googlemail.com">Micha Reischuck</a>' + ', <a href="mailto:johncc@internode.on.net">John Carragher</a><br>' + 'License: <a href="http://opensource.org/licenses/mit-license.php">MIT</a>',
allowHtml: !0
}, {
kind: "Image",
src: Helper.iconPath() + "icon128.png"
} ]
} ]
} ]
}, {
name: "infoScroller",
kind: "enyo.Scroller",
fit: !0,
ondragfinish: "dragFinish",
components: [ {
classes: "deco",
components: [ {
name: "copyboxdiv",
classes: "divider",
content: $L("Copyright"),
showing: !1
}, {
name: "copybox"
}, {
name: "authorboxdiv",
classes: "divider",
content: $L("Author(s)"),
showing: !1
}, {
name: "authorbox"
}, {
name: "songboxdiv",
classes: "divider",
content: $L("Song"),
showing: !1
}, {
name: "songbox"
}, {
name: "commentboxdiv",
classes: "divider",
content: $L("comments"),
showing: !1
}, {
name: "commentbox"
} ]
} ]
}, {
kind: "enyo.Scroller",
fit: 1,
ondragfinish: "dragFinish",
components: [ {
classes: "deco",
components: [ {
content: $L("Font size:"),
classes: "divider"
}, {
components: [ {
style: "width:50%; display:inline-block; text-align:left;",
content: $L("small")
}, {
style: "width:50%; display:inline-block; text-align:right;",
content: $L("large")
} ]
}, {
name: "size",
kind: "CombinedSlider",
rangeMin: 1,
rangeStart: 2,
rangeEnd: 8,
rangeMax: 20,
isSimple: !1,
increment: .1,
showLabels: !1,
onChanging: "sliderChanging",
onChange: "sliderChanged"
}, {
style: "padding: .5rem;",
components: [ {
content: $L("Auto resize"),
style: "display: inline; line-height: 32px"
}, {
kind: "onyx.ToggleButton",
name: "autoSize",
style: "display: inline; float: right;",
value: !1,
onChange: "toggle",
onContent: $L("yes"),
offContent: $L("no")
}, {
tag: "br"
} ]
}, {
tag: "br"
}, {
content: $L("Line spacing:"),
classes: "divider"
}, {
components: [ {
style: "width:50%; display:inline-block; text-align:left;",
content: $L("small")
}, {
style: "width:50%; display:inline-block; text-align:right;",
content: $L("large")
} ]
}, {
name: "space",
kind: "onyx.Slider",
onChange: "sliderChanged",
max: 10
} ]
} ]
}, {
name: "addList",
kind: "List",
classes: "inner-panels",
ondragfinish: "dragFinish",
style: "height: 100%;",
onSetupItem: "getAdd",
components: [ {
name: "addItem",
ontap: "addTab",
components: [ {
name: "addTitle",
classes: "item"
} ]
} ]
}, {
kind: "enyo.Scroller",
fit: 1,
ondragfinish: "dragFinish",
components: [ {
classes: "deco",
components: [ {
kind: "FittableColumns",
style: "margin: .5rem;",
components: [ {
content: $L("name") + ": ",
style: "width: 5.5rem; padding: .5rem 0;",
classes: "editlabel"
}, {
kind: "onyx.InputDecorator",
style: "width: 60%;",
components: [ {
name: "elname",
kind: "onyx.Input",
placeholder: $L("name")
} ]
} ]
}, {
kind: "FittableColumns",
style: "margin: .5rem;",
components: [ {
content: $L("language") + ": ",
style: "width: 5.5rem; padding: .5rem 0;",
classes: "editlabel"
}, {
kind: "onyx.InputDecorator",
style: "width: 60%;",
components: [ {
name: "language",
kind: "onyx.Input",
placeholder: $L("language")
} ]
} ]
}, {
content: $L("parts"),
classes: "divider"
}, {
kind: "FittableColumns",
style: "margin: .5rem;",
components: [ {
kind: "onyx.InputDecorator",
fit: 1,
components: [ {
name: "editpart1",
kind: "onyx.Input",
placeholder: $L("part")
} ]
}, {
name: "addPartsButton",
kind: "onyx.IconButton",
src: Helper.iconPath() + "add.png",
style: "margin: .25rem 0 0 .5rem !important;",
ontap: "addPart"
} ]
}, {
name: "edittext1",
classes: "preview"
}, {
name: "parts"
} ]
} ]
}, {
kind: "FittableColumns",
classes: "enyo-fit",
components: [ {
name: "baseList",
kind: "List",
ondragfinish: "dragFinish",
style: "height: 100%; width: 5rem",
onSetupItem: "getBase",
components: [ {
name: "baseItem",
ontap: "addChord",
components: [ {
name: "baseTitle",
classes: "item"
} ]
} ]
}, {
name: "extenList",
kind: "List",
ondragfinish: "dragFinish",
style: "height: 100%; width: 5rem",
onSetupItem: "getExten",
components: [ {
name: "extenItem",
ontap: "addChord",
components: [ {
name: "extenTitle",
classes: "item"
} ]
} ]
} ]
}, {
kind: "enyo.Scroller",
fit: !0,
classes: "michote-scroller",
horizontal: "hidden",
components: [ {
name: "box",
kind: "FittableRows",
classes: "box-center",
components: [ {
name: "titlebox",
kind: "onyx.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
components: [ {
content: $L("Insert text to import here ...")
}, {
kind: "onyx.IconButton",
src: Helper.iconPath() + "help.png",
ontap: "openHelp",
classes: "editbutton"
} ]
}, {
name: "importHelp",
kind: "onyx.Drawer",
open: !1,
components: [ {
content: "The first single line is interpretted as the title.Subsequent single lines (followed by a blank line) can contain the properties values of the OpenLyrics specification: eg author(s), Release Date etc.<br><br>If the title line is present then a complete OpenLyrics song file is produced.<br><br>The lyrics blocks can optionally include chord lines. A chord line is defined as a line containing more than 50% of valid OpenLyrics chord names or two of them separated by a '/' . If present a chord line is expected to be followed by the corresponding lyrics line.<br><br>Chords can also be embedded in the lyrics lines in ChordPro format ie [A].<br><br>Verses are separated by a single blank line or a line containing [x] where x can be v, b, c, e, p under the OpenLyrics specification and will become a verse label which will have sequential numbers added to it to identify each verse. A blank line defaults to a [v] label.<br><br>The generator will also generate OpenLyrics lyrics blocks from OpenSong and ChordPro formatted lyric lists.",
allowHtml: !0,
style: "padding: .5rem; color: #fff; background-color: rgba(0,0,0,0.7); line-height: normal;"
} ]
}, {
kind: "onyx.InputDecorator",
style: "min-height: 20rem; max-width: 800px; font-family: Courier;",
alwaysLooksFocused: !0,
ontap: "importFocus",
components: [ {
name: "importText",
kind: "onyx.RichText",
allowHtml: !1
} ]
} ]
} ]
} ]
} ]
}, {
name: "footerToolbar",
kind: "onyx.Toolbar",
style: "text-align:center;",
components: [ {
name: "closeButton",
kind: "onyx.Button",
content: $L("Close"),
ontap: "closeClicked"
}, {
name: "deleteButton",
kind: "onyx.Button",
classes: "onyx-negative",
ontap: "deleteElement",
showing: !1
} ]
} ],
largePane: function() {
this.applyStyle("max-width", "16rem");
},
showMenu: function() {
this.log("show menu"), this.largePane(), this.$.Pane.setIndex(0), this.$.title.setContent($L("Menu"));
},
showAbout: function() {
this.log((this.$.about.open ? "close" : "open") + " aboutDrawer"), this.$.about.setOpen(!this.$.about.open);
},
showPreferences: function() {
this.log("opening Preferences"), this.owner.$.viewPane.$.preferences.setOldIndex(this.owner.$.viewPane.$.viewPanels.index), this.owner.$.viewPane.$.preferences.setPrefs(), this.owner.$.viewPane.$.viewPanels.setIndex(2), this.owner.$.infoPanels.setIndex(0), !Helper.phone() || this.owner.$.mainPanels.setIndex(1);
},
refresh: function() {
this.owner.refreshLibrary(), this.owner.$.infoPanels.setIndex(0);
},
newSong: function() {
this.log("create a new Song, opnening popup ..."), this.owner.openCreateSong(), this.owner.$.infoPanels.setIndex(0);
},
showHelp: function() {
this.log("show help panel"), this.owner.$.viewPane.$.viewPanels.setIndex(0), this.owner.$.infoPanels.setIndex(0), this.owner.setCurrentIndex(undefined), !Helper.phone() || this.owner.$.mainPanels.setIndex(1);
},
showInfo: function(e) {
this.log("show info panel"), this.largePane(), this.$.title.setContent($L("Song Info")), this.destroyInfo(), this.infoset(e), this.$.infoScroller.render(), this.$.Pane.setIndex(1);
},
destroyInfo: function() {
this.$.copybox.destroyClientControls(), this.$.authorbox.destroyClientControls(), this.$.songbox.destroyClientControls(), this.$.commentbox.destroyClientControls(), this.$.copyboxdiv.hide(), this.$.authorboxdiv.hide(), this.$.songboxdiv.hide(), this.$.commentboxdiv.hide();
},
addDiv: function(e, t, n) {
t && (this.log(t), this.$[e + "div"].show(), b = this.$[e], b.createComponent({
classes: "about",
allowHtml: !0,
content: n + $L(t)
}));
},
infoset: function(e) {
this.log(), e.released && this.addDiv("copybox", e.released + ":", "&copy; "), this.addDiv("copybox", e.copyright, ""), e.publisher !== e.copyright && this.addDiv("copybox", e.publisher, "");
var t = ParseXml.authorsToString(e.authors);
for (i = 0, l = t.length; i < l; i++) this.addDiv("authorbox", t[i], "");
for (j = 0, l = e.songbooks.length; j < l; j++) e.songbooks[j].no ? this.addDiv("songbox", e.songbooks[j].book + ": " + e.songbooks[j].no, "") : this.addDiv("songbox", e.songbooks[j].book, "");
this.addDiv("songbox", e.key, $L("key: ")), isNaN(e.tempo) ? this.addDiv("songbox", e.tempo, $L("tempo") + ": ") : this.addDiv("songbox", e.tempo, $L("tempo") + " (bpm): "), this.addDiv("songbox", e.duration, $L("duration") + ": "), this.addDiv("songbox", e.ccli, "CCLI: ");
for (k = 0, l = e.comments.length; k < l; k++) this.addDiv("commentbox", e.comments[k], "");
},
showFont: function() {
this.log("open Font Settings"), this.largePane(), this.$.Pane.setIndex(2), this.$.title.setContent($L("Font Settings")), this.$.size.rangeStart = this.css.fMin, this.$.size.rangeEnd = this.css.fMax, this.$.size.isSimple = !this.css.autoResize, this.$.autoSize.setValue(this.css.autoResize), this.$.size.refreshRangeSlider(), this.$.space.setValue(this.css.space);
},
sliderChanged: function(e, t) {
switch (e.name) {
case "space":
this.log(e.name + " changed to " + Math.round(e.getValue())), this.css[e.name] = Math.round(e.getValue());
break;
case "size":
this.$.size.isSimple ? (this.log(e.name + " end changed to " + Math.round(e.rangeEnd)), this.css.size = Math.round(e.rangeEnd), this.css.fMin = Math.round(e.rangeStart), this.css.fMax = Math.round(e.rangeEnd)) : (this.log(e.name + " start changed to " + Math.round(e.rangeStart)), this.log(e.name + " end changed to " + Math.round(e.rangeEnd)), t.startChanged ? this.css.size = Math.round(e.rangeStart) : this.css.size = Math.round(e.rangeEnd), this.css.fMin = Math.round(e.rangeStart), this.css.fMax = Math.round(e.rangeEnd));
}
this.owner.setFont(this.css);
},
sliderChanging: function(e, t) {
e.name === "size";
},
goToAdd: function(e) {
this.applyStyle("max-width", "10rem"), this.$.Pane.setIndex(3), this.$.title.setContent($L("Add new:")), this.back = e, this.$.addList.setCount(this[e + "List"].length), this.$.addList.refresh();
},
getAdd: function(e, t) {
var n = this[this.back + "List"][t.index], r = e.isSelected(t.index);
this.$.addItem.addRemoveClass("item-selected", r), this.$.addItem.addRemoveClass("item-not-selected", !r), this.$.addTitle.setContent($L(n));
},
addTab: function(e, t) {
this.log("add new:", this[this.back + "List"][t.rowIndex]), this.owner.$.viewPane.$.editToaster.$[this.back + "Pane"].addNew(this[this.back + "List"][t.rowIndex]), this.owner.$.infoPanels.setIndex(0);
},
editElement: function(e, t) {
this.$.title.setContent(t), this.$.Pane.setIndex(4), this.applyStyle("max-width", "18rem"), this.$.closeButton.setContent($L("Done")), this.$.deleteButton.setContent($L("delete element")), this.$.deleteButton.show(), this.setElement(e);
},
elementChanged: function() {
this.log("edit element:", this.element), this.parts = [ 1 ];
for (i in this.element) if (i === "lines") {
this.$.parts.destroyClientControls();
for (j = 0, le = this.element[i].length; j < le; j++) j > 0 && this.addPart("init"), this.$["editpart" + (j + 1)].setValue(this.element[i][j].part), this.$["edittext" + (j + 1)].setContent(this.element[i][j].text);
} else this.$[i].setValue(this.element[i]);
},
addPart: function(e) {
var t = this.parts.slice(-1)[0] + 1;
this.$.parts.createComponents([ {
name: "box" + t,
kind: "FittableColumns",
style: "margin: .5rem;",
components: [ {
kind: "onyx.InputDecorator",
fit: 1,
components: [ {
name: "editpart" + t,
kind: "onyx.Input",
owner: this,
placeholder: $L("part")
} ]
}, {
name: "delPB" + t,
kind: "onyx.IconButton",
src: Helper.iconPath() + "remove.png",
style: "margin: .25rem 0 0 .5rem !important;",
ontap: "delPart"
} ]
}, {
name: "edittext" + t,
classes: "preview"
} ], {
owner: this
}), e !== "init" && this.element.lines.push({
part: "",
text: ""
}), this.parts.push(t), this.$.parts.render();
},
delPart: function(e) {
var t = parseInt(e.name.replace("delPB", ""));
for (x in this.parts) this.parts[x] === t && (this.parts.splice(x, 1), this.$["box" + t].destroy(), this.$["edittext" + t].destroy(), this.$.parts.render());
},
deleteElement: function() {
this.log(this.$.Pane.getIndex());
switch (this.$.Pane.getIndex()) {
case 4:
this.owner.$.viewPane.$.editToaster.$.lyricsPane.deleteElement(), this.closeClicked();
break;
case 6:
this.$.closeButton.setContent($L("Close")), this.$.deleteButton.hide(), this.owner.$.infoPanels.setIndex(0);
}
},
getData: function() {
var e = {
elname: this.$.elname.getValue(),
language: this.$.language.getValue(),
lines: []
};
for (i in this.parts) e.lines.push({
part: this.$["editpart" + this.parts[i]].getValue(),
text: this.element.lines[this.parts[i] - 1].text
});
return e;
},
closeEdit: function() {
var e = this.getData(), t = e.elname;
e.language && (t = t + "_" + e.language), this.owner.$.viewPane.$.editToaster.$.lyricsPane.insertSamePlace(t, e);
},
openPicker: function() {
this.applyStyle("max-width", "10rem"), this.$.title.setContent($L("Chord Picker")), Helper.browser() || this.$.closeButton.setContent($L("Insert")), this.$.baseList.setCount(this.baseChord.length), this.$.baseList.refresh(), this.$.extenList.setCount(this.chordExten.length), this.$.extenList.refresh(), this.$.Pane.setIndex(5);
},
getBase: function(e, t) {
var n = this.baseChord[t.index], r = e.isSelected(t.index);
this.$.baseItem.addRemoveClass("item-selected", r), this.$.baseItem.addRemoveClass("item-not-selected-trans", !r), this.$.baseTitle.setContent(n);
},
getExten: function(e, t) {
var n = this.chordExten[t.index], r = e.isSelected(t.index);
this.$.extenItem.addRemoveClass("item-selected", r), this.$.extenItem.addRemoveClass("item-not-selected-trans", !r), this.$.extenTitle.setContent(n);
},
addChord: function(e, t) {
this.log(this[e.name === "baseItem" ? "baseChord" : "chordExten"][t.rowIndex]), this[e.name === "baseItem" ? "base" : "exten"] = this[e.name === "baseItem" ? "baseChord" : "chordExten"][t.rowIndex], this.owner.$.viewPane.$.editToaster.$.lyricsPane.setChord(this.getFullChord());
},
getFullChord: function() {
if (this.base) {
var e = "[" + this.base;
return this.exten && (e += this.exten), e + "]";
}
return !1;
},
restoreSelection: function(e, t) {
var n = t.el;
t.$[n].focus(), e && t.$[n].getSelection && (t.$[n].focus(), sel = t.$[n].getSelection(), sel.removeAllRanges(), sel.addRange(e));
},
closeChordSelect: function() {
var e = this.owner.$.viewPane.$.editToaster.$.lyricsPane;
e.$[e.el].focus(), this.restoreSelection(e.elrange, e), e.$[e.el].insertAtCursor(this.getFullChord()), e.el = undefined;
},
showImport: function() {
this.applyStyle("max-width", "100%"), this.$.closeButton.setContent($L("Import")), this.$.deleteButton.setContent($L("Cancel")), this.$.deleteButton.show(), this.$.Pane.setIndex(6), this.$.importText.setValue(""), this.$.title.setContent($L("Import"));
},
openHelp: function() {
this.$.importHelp.setOpen(!this.$.importHelp.getOpen());
},
importFocus: function() {
this.$.importText.focus();
},
"import": function() {
var e = this.$.importText.getValue();
e = e.replace(/<[\/]{0,1}(br|BR)[^><]*>/g, "\n"), e = e.replace(/<div>/g, "").replace(/<\/div>/g, "<br>").replace(/<br>/g, "\n").replace(/&nbsp;/g, " "), e = e.replace(/<[\/]{0,1}(span|SPAN)[^><]*>/g, ""), this.owner.importSong(convLyrics(e));
},
dragFinish: function(e, t) {
+t.dx > 120 && this.closeClicked();
},
toggle: function(e, t) {
this.log("toggled:", e.name, t.value), e.name === "autoSize" && (this.$.size.isSimple = !t.value, this.css.autoResize = t.value, this.$.size.isSimple ? this.$.size.rangeEnd = (this.css.fMin + this.css.fMax) / 2 : (this.$.size.rangeStart = this.css.fMin, this.$.size.rangeEnd = this.css.fMax), this.$.size.refreshRangeSlider());
},
closeClicked: function(e) {
this.log(this.$.Pane.getIndex());
switch (this.$.Pane.getIndex()) {
case 2:
this.$.size.isSimple ? this.css.size = Math.round(this.css.fMax) : this.css.size = Math.round((this.css.fMin + this.css.fMax) / 2), this.owner.saveCss(this.css), this.owner.$.viewPane.$.songViewPane.resizeLyrics();
break;
case 4:
this.$.closeButton.setContent($L("Close")), this.$.deleteButton.hide(), this.closeEdit();
break;
case 5:
this.$.closeButton.setContent($L("Close")), Helper.browser() || this.closeChordSelect(), this.owner.$.viewPane.$.editToaster.$.lyricsPane.setChord(undefined);
break;
case 6:
this.$.closeButton.setContent($L("Close")), this.$.deleteButton.hide(), this.import();
}
this.owner.$.infoPanels.setIndex(0);
}
});

// EditToaster.js

enyo.kind({
name: "Edit",
kind: "FittableRows",
published: {
file: undefined,
xml: undefined,
metadata: {},
lyrics: {}
},
components: [ {
name: "headerToolbar",
kind: "onyx.Toolbar",
components: [ {
kind: "FittableColumns",
style: "width: 100%; margin: 0; padding: 0;",
components: [ {
classes: "song title",
content: $L("Edit"),
classes: "side",
style: "text-align: left; padding: .25rem .375rem;"
}, {
kind: "FittableColumns",
classes: "middle",
style: "margin: 0; padding: 0; text-align: center;",
components: [ {
name: "meta",
kind: "onyx.ToggleIconButton",
src: Helper.iconPath() + "title.png",
ontap: "toggleMeta",
value: !0
}, {
name: "lyrics",
kind: "onyx.ToggleIconButton",
src: Helper.iconPath() + "lyrics.png",
ontap: "toggleLyrics"
} ]
}, {
name: "title",
content: $L("Title"),
classes: "song title side",
style: "text-align: right; padding: .25rem .375rem;"
} ]
} ]
}, {
name: "editPane",
kind: "Panels",
fit: !0,
arrangerKind: "CarouselArranger",
draggable: !1,
components: [ {
name: "metaPane",
kind: "EditMeta",
classes: "inner-panels"
}, {
name: "lyricsPane",
kind: "EditLyrics",
classes: "inner-panels"
} ]
}, {
name: "footerToolbar",
kind: "onyx.Toolbar",
style: "text-align:center;",
components: [ {
kind: "my.Grabber",
ontap: "grabber",
classes: "quer"
}, {
name: "chordpicker",
kind: "onyx.IconButton",
src: Helper.iconPath() + "chordpicker.png",
style: "float: left;",
onmousedown: "chordPick",
showing: !1
}, {
kind: "onyx.Button",
classes: "onyx-negative",
style: "width: " + (Helper.phone() ? "45%" : "10rem") + "; margin: 0;",
content: $L("Discard changes"),
ontap: "closeThis"
}, {
style: "width: " + (Helper.phone() ? .5 : 1.25) + "rem; margin: 0;"
}, {
kind: "onyx.Button",
classes: "onyx-affirmative",
style: "width:  " + (Helper.phone() ? "25%" : "8rem") + "; margin: 0;",
content: $L("Done"),
ontap: "saveClicked"
}, {
name: "add",
kind: "onyx.IconButton",
src: Helper.iconPath() + "add.png",
style: "float: right;",
ontap: "add"
} ]
} ],
toggleMeta: function() {
this.log(), this.$.editPane.setIndex(0), this.$.lyrics.setValue(!1), this.$.chordpicker.hide(), this.owner.owner.$.infoPanels.setIndex(0), this.$.lyricsPane.saveModifications();
},
toggleLyrics: function() {
this.log(), this.$.editPane.setIndex(1), this.$.meta.setValue(!1), this.$.chordpicker.show(), this.owner.owner.$.infoPanels.setIndex(0), this.$.metaPane.saveModifications();
},
chordPick: function() {
this.log(), !Helper.browser() && this.$.lyricsPane.el ? (this.$.lyricsPane.storeRange(), this.owner.owner.$.infoPanels.setIndex(1), this.owner.owner.$.sidePane.openPicker()) : (this.owner.owner.$.infoPanels.setIndex(1), this.owner.owner.$.sidePane.openPicker());
},
populate: function() {
this.log(), this.xml && (this.lyrics = ParseXml.editLyrics(this.xml), this.$.lyricsPane.setLyrics(this.lyrics), this.metadata = ParseXml.allMetadata(this.xml), this.$.metaPane.setMetadata(this.metadata), this.$.metaPane.setFile(this.file), this.$.title.setContent(this.metadata.titles[0].title));
},
add: function() {
this.owner.owner.$.infoPanels.setIndex(1), this.owner.owner.$.sidePane.goToAdd(this.$.editPane.getIndex() ? "lyrics" : "meta");
},
grabber: function() {
this.owner.owner.$.mainPanels.setIndex(this.owner.owner.$.mainPanels.index ? 0 : 1);
},
saveClicked: function(e) {
this.log(), this.$.metaPane.saveModifications(), this.$.lyricsPane.saveModifications(), this.$.lyricsPane.setChord(undefined);
var t = WriteXml.edit(this.xml, this.metadata, this.lyrics);
this.owner.owner.online && this.owner.owner.writeXml(this.file, t, this.metadata.titles[0].title);
var n = t.slice(t.indexOf("modifiedDate") + 14);
n = n.substring(0, n.indexOf('"', 1)), this.owner.owner.dbWriteXml(this.file, t, Date.parse(n), this.metadata.titles[0].title), this.owner.$.songViewPane.renderLyrics(), this.owner.$.viewPanels.setIndex(1), this.owner.owner.$.infoPanels.setIndex(0);
},
closeThis: function() {
this.log(), this.setXml(undefined), this.$.lyricsPane.setChord(undefined), this.owner.$.viewPanels.setIndex(1), this.owner.owner.$.infoPanels.setIndex(0);
}
});

// EditMeta.js

enyo.kind({
name: "EditMeta",
kind: "FittableRows",
classes: "enyo-fit",
single: [ "released", "copyright", "publisher", "key", "tempo", "transposition", "verseOrder", "duration" ],
titleCount: 1,
authorCount: 1,
songbookCount: 1,
commentCount: 1,
published: {
metadata: {},
button: [],
file: undefined
},
components: [ {
kind: "enyo.Scroller",
fit: !0,
classes: "michote-scroller",
horizontal: "hidden",
components: [ {
name: "box",
kind: "FittableRows",
classes: "box-center",
components: [ {
name: "titlebox",
kind: "onyx.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: $L("title")
}, {
name: "titlehflex1",
kind: "FittableColumns",
components: [ {
kind: "onyx.InputDecorator",
fit: !0,
components: [ {
name: "title1",
kind: "Input",
hint: $L("title")
} ]
}, {
kind: "onyx.InputDecorator",
style: "width: 5rem;",
components: [ {
name: "titlelang1",
kind: "Input",
placeholder: ""
} ]
} ]
} ]
}, {
name: "authorbox",
kind: "onyx.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: $L("author")
}, {
name: "authorhflex1",
kind: "FittableColumns",
components: [ {
kind: "onyx.InputDecorator",
fit: !0,
components: [ {
name: "author1",
kind: "Input",
placeholder: $L("author")
} ]
}, {
kind: "onyx.PickerDecorator",
classes: "author-picker",
components: [ {
style: "width: 100%; background: none; border: none; color: #333;"
}, {
name: "authorSwitch1",
kind: "onyx.Picker",
onSelect: "onchange_author",
components: [ {
name: "null1",
content: "",
value: "",
active: !0
}, {
name: "words1",
content: $L("words"),
value: "words"
}, {
name: "music1",
content: $L("music"),
value: "music"
}, {
name: "translation1",
content: $L("translation"),
value: "translation"
} ]
} ]
}, {
name: "authorDrawer1",
orient: "h",
kind: "onyx.Drawer",
open: !1,
components: [ {
kind: "onyx.InputDecorator",
style: "width: 3.875rem;",
components: [ {
name: "authorlang1",
kind: "Input",
placeholder: ""
} ]
} ]
} ]
} ]
}, {
kind: "onyx.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: $L("copyright")
}, {
kind: "FittableColumns",
components: [ {
content: $L("release date") + ":",
style: "padding: .25rem .5rem; line-height: normal; width: 5.5rem;",
classes: "editlabel"
}, {
kind: "onyx.InputDecorator",
style: "max-width: 20%;",
components: [ {
name: "released",
kind: "Input",
placeholder: $L("release date")
} ]
}, {
content: $L("copyright holder") + ":",
style: "padding: .25rem .5rem; line-height: normal; width: 5.5rem;",
classes: "editlabel"
}, {
kind: "onyx.InputDecorator",
fit: !0,
components: [ {
name: "copyright",
kind: "Input",
placeholder: $L("copyright holder")
} ]
} ]
}, {
kind: "FittableColumns",
components: [ {
content: $L("publisher") + ":",
style: "width: 7.5rem;",
classes: "editlabel"
}, {
kind: "onyx.InputDecorator",
fit: !0,
components: [ {
name: "publisher",
kind: "Input",
placeholder: $L("publisher")
} ]
} ]
} ]
}, {
name: "songbookbox",
kind: "onyx.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: $L("infos")
}, {
kind: "FittableColumns",
components: [ {
content: $L("transposition") + ":",
style: "width: 8.5rem;",
classes: "editlabel"
}, {
kind: "onyx.InputDecorator",
style: "max-width: 20%",
components: [ {
name: "transposition",
kind: "Input",
placeholder: $L("transposition")
} ]
}, {
content: $L("key") + ":",
style: "width: 4.5rem;",
classes: "editlabel"
}, {
kind: "onyx.InputDecorator",
fit: !0,
components: [ {
name: "key",
kind: "Input",
placeholder: $L("key")
} ]
} ]
}, {
kind: "FittableColumns",
components: [ {
content: $L("duration") + ":",
style: "width: 8.5rem;",
classes: "editlabel"
}, {
kind: "onyx.InputDecorator",
style: "max-width: 20%",
components: [ {
name: "duration",
kind: "Input",
placeholder: $L("duration")
} ]
}, {
content: $L("tempo") + ":",
style: "width: 4.5rem;",
classes: "editlabel"
}, {
kind: "onyx.InputDecorator",
fit: !0,
components: [ {
name: "tempo",
kind: "Input",
placeholder: $L("tempo")
} ]
} ]
}, {
kind: "FittableColumns",
fit: !0,
components: [ {
content: $L("verseorder") + ":",
style: "width: 7rem;",
classes: "editlabel"
}, {
kind: "onyx.InputDecorator",
fit: !0,
components: [ {
name: "verseOrder",
kind: "Input",
placeholder: $L("verseorder")
} ]
} ]
}, {
name: "versehflex",
kind: "FittableColumns",
style: "text-align:center; padding: .25rem;"
}, {
name: "songbookhflex1",
kind: "FittableColumns",
components: [ {
content: $L("songbook") + ":",
style: "width: 6.5rem;",
classes: "editlabel"
}, {
kind: "onyx.InputDecorator",
fit: !0,
components: [ {
name: "songbook1",
kind: "Input",
placeholder: $L("songbook")
} ]
}, {
content: $L("no.") + ":",
style: "width: 2.5rem;",
classes: "editlabel"
}, {
kind: "onyx.InputDecorator",
style: "max-width: 15%",
components: [ {
name: "no1",
kind: "Input",
placeholder: $L("number")
} ]
} ]
} ]
}, {
name: "commentbox",
kind: "onyx.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: $L("comments")
}, {
kind: "onyx.InputDecorator",
components: [ {
name: "comment1",
kind: "onyx.RichText",
placeholder: $L("comment")
} ]
} ]
}, {
tag: "br"
}, {
kind: "onyx.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: $L("Delete file"),
style: "background-color: rgba(158, 5, 8, 0.8)"
}, {
kind: "FittableColumns",
style: "padding: .5rem;",
components: [ {
fit: 1,
content: $L("Delete this songfile (irreversible!)")
}, {
name: "delete",
kind: "onyx.Button",
content: $L("Delete file"),
classes: "onyx-negative",
ontap: "deleteFile"
} ]
} ]
} ]
} ]
} ],
addNew: function(e) {
this.log(), this.saveModifications(), this.metadataChanged(), this["add" + e.charAt(0).toUpperCase() + e.slice(1)]();
},
addTitle: function() {
this.titleCount += 1, this.log(this.titleCount), this.$.titlebox.createComponent({
name: "titlehflex" + this.titleCount,
kind: "FittableColumns",
owner: this,
components: [ {
kind: "onyx.InputDecorator",
fit: !0,
components: [ {
name: "title" + this.titleCount,
kind: "Input",
placeholder: $L("title"),
owner: this
} ]
}, {
kind: "onyx.InputDecorator",
style: "width: 5rem;",
components: [ {
name: "titlelang" + this.titleCount,
kind: "Input",
placeholder: "",
owner: this
} ]
} ]
}), this.$["titlehflex" + this.titleCount].render();
},
addAuthor: function() {
this.authorCount += 1, this.log(this.authorCount), this.$.authorbox.createComponent({
name: "authorhflex" + this.authorCount,
kind: "FittableColumns",
owner: this,
components: [ {
kind: "onyx.InputDecorator",
fit: !0,
components: [ {
name: "author" + this.authorCount,
kind: "Input",
placeholder: $L("author"),
owner: this
} ]
}, {
kind: "onyx.PickerDecorator",
classes: "author-picker",
owner: this,
components: [ {
style: "width: 100%; background: none; border: none; color: #333;"
}, {
name: "authorSwitch" + this.authorCount,
kind: "onyx.Picker",
onSelect: "onchange_author",
owner: this,
components: [ {
content: "",
value: "",
active: !0
}, {
name: "words" + this.authorCount,
content: $L("words"),
value: "words"
}, {
name: "music" + this.authorCount,
content: $L("music"),
value: "music"
}, {
name: "translation" + this.authorCount,
content: $L("translation"),
value: "translation"
} ]
} ]
}, {
name: "authorDrawer" + this.authorCount,
orient: "h",
kind: "onyx.Drawer",
open: !1,
owner: this,
components: [ {
kind: "onyx.InputDecorator",
style: "width: 3.875rem;",
components: [ {
name: "authorlang" + this.authorCount,
kind: "Input",
placeholder: "",
owner: this
} ]
} ]
} ]
}), this.$["authorhflex" + this.authorCount].render();
},
onchange_author: function(e, t) {
var n = e.name.charAt(e.name.length - 1);
this.$["authorDrawer" + n].setOpen(t.selected.value === "translation" ? !0 : !1);
},
addSongbook: function() {
this.songbookCount += 1, this.log(this.songbookCount), this.$.songbookbox.createComponent({
name: "songbookhflex" + this.songbookCount,
kind: "FittableColumns",
owner: this,
components: [ {
content: $L("songbook") + ":",
style: "width: 6.5rem;",
classes: "editlabel"
}, {
kind: "onyx.InputDecorator",
fit: !0,
components: [ {
name: "songbook" + this.songbookCount,
kind: "Input",
placeholder: $L("songbook"),
owner: this
} ]
}, {
content: $L("no.") + ":",
style: "width: 2.5rem;",
classes: "editlabel"
}, {
kind: "onyx.InputDecorator",
style: "max-width: 15%",
components: [ {
name: "no" + this.songbookCount,
kind: "Input",
placeholder: $L("number"),
owner: this
} ]
} ]
}), this.$["songbookhflex" + this.songbookCount].render();
},
addComment: function() {
this.commentCount += 1, this.log(this.commentCount), this.$.commentbox.createComponent({
name: "commenthflex" + this.commentCount,
kind: "onyx.InputDecorator",
owner: this,
components: [ {
name: "comment" + this.commentCount,
kind: "onyx.RichText",
placeholder: $L("comment"),
owner: this
} ]
}), this.$["commenthflex" + this.commentCount].render();
},
metadataChanged: function() {
this.log(), this.clear();
for (i in this.single) this.metadata[this.single[i]] ? this.$[this.single[i]].setValue(this.metadata[this.single[i]]) : this.$[this.single[i]].setValue("");
var e = this.metadata.titles.length + 1;
for (i = 1; i < e; i++) i > 1 && this.addTitle(), this.$["title" + i].setValue(this.metadata.titles[i - 1].title), this.$["titlelang" + i].setValue(this.metadata.titles[i - 1].lang ? this.metadata.titles[i - 1].lang : "");
if (this.metadata.authors) {
e = this.metadata.authors.length + 1;
for (i = 1; i < e; i++) i > 1 && this.addAuthor(), this.$["author" + i].setValue(this.metadata.authors[i - 1].author), this.metadata.authors[i - 1].type && (this.$["authorSwitch" + i].setSelected(this.$[this.metadata.authors[i - 1].type + i]), this.metadata.authors[i - 1].type === "translation" && (this.$["authorDrawer" + i].setOpen(!0), this.$["authorlang" + i].setValue(this.metadata.authors[i - 1].lang)));
}
if (this.metadata.songbooks) {
e = this.metadata.songbooks.length + 1;
for (i = 1; i < e; i++) i > 1 && this.addSongbook(), this.$["songbook" + i].setValue(this.metadata.songbooks[i - 1].book), this.$["no" + i].setValue(this.metadata.songbooks[i - 1].no ? this.metadata.songbooks[i - 1].no : "");
}
var e = this.metadata.comments.length + 1;
for (i = 1; i < e; i++) i > 1 && this.addComment(), this.$["comment" + i].setValue(this.metadata.comments[i - 1]);
},
buttonChanged: function() {
this.log(), this.$.versehflex.destroyClientControls();
for (i in this.button) this.log("add button:", this.button[i]), this.$.versehflex.createComponent({
name: this.button[i],
kind: "onyx.Button",
content: this.button[i],
classes: "verse-button",
owner: this,
ontap: "verseButton"
});
this.$.versehflex.render();
},
verseButton: function(e) {
var t = this.$.verseOrder.hasNode().selectionStart, n = this.$.verseOrder.getValue(), r = n.charAt(t - 1);
if (t === 0 || r === " ") var i = ""; else var i = " ";
var s = n.charAt(t);
if (s === " " || t === n.length) var o = ""; else var o = " ";
this.$.verseOrder.setValue(n.substring(0, t) + i + e.name + o + n.substring(t, n.length));
},
clear: function() {
this.log();
for (j = 2; j < this.titleCount + 1; j++) this.$["titlehflex" + j].destroy();
this.titleCount = 1;
for (j = 2; j < this.authorCount + 1; j++) this.$["authorhflex" + j].destroy();
this.authorCount = 1, this.$.author1.setValue(""), this.$.authorDrawer1.setOpen(!1), this.$.authorSwitch1.setSelected(this.$.null1);
for (j = 2; j < this.songbookCount + 1; j++) this.$["songbookhflex" + j].destroy();
this.songbookCount = 1, this.$.songbook1.setValue(""), this.$.no1.setValue("");
for (j = 2; j < this.commentCount + 1; j++) this.$["commenthflex" + j].destroy();
this.commentCount = 1, this.$.comment1.setValue("");
},
getAllFields: function() {
this.log();
for (i in this.single) this.$[this.single[i]].getValue() && Helper.html(this.metadata[this.single[i]] = this.$[this.single[i]].getValue());
var e = [];
for (i = 1; i < this.titleCount + 1; i++) this.$["title" + i].getValue() && (this.$["titlelang" + i].getValue() ? e.push({
title: Helper.html(this.$["title" + i].getValue()),
lang: this.$["titlelang" + i].getValue()
}) : e.push({
title: Helper.html(this.$["title" + i].getValue()),
lang: null
}));
this.metadata.titles = e;
var t = [];
for (i = 1; i < this.authorCount + 1; i++) if (this.$["author" + i].getValue()) {
var n = this.$["authorSwitch" + i].getSelected().value;
n === "translation" ? t.push({
type: n,
author: Helper.html(this.$["author" + i].getValue()),
lang: this.$["authorlang" + i].getValue()
}) : t.push({
type: n,
author: Helper.html(this.$["author" + i].getValue())
});
}
this.metadata.authors = t;
var r = [];
for (i = 1; i < this.songbookCount + 1; i++) this.$["songbook" + i].getValue() && (this.$["no" + i].getValue() ? r.push({
book: Helper.html(this.$["songbook" + i].getValue()),
no: this.$["no" + i].getValue()
}) : r.push({
book: Helper.html(this.$["songbook" + i].getValue()),
no: null
}));
this.metadata.songbooks = r;
var s = [];
for (i = 1; i < this.commentCount + 1; i++) this.$["comment" + i].getValue() && s.push(Helper.html(this.$["comment" + i].getValue()));
return this.metadata.comments = s, !0;
},
deleteFile: function() {
this.log(), this.owner.owner.owner.deleteFile(this.file);
},
saveModifications: function() {
this.getAllFields(), this.log("save metadata modification"), this.owner.setMetadata(this.metadata);
}
});

// EditLyrics.js

enyo.kind({
name: "EditLyrics",
kind: "FittableRows",
classes: "enyo-fit",
published: {
lyrics: {},
element: undefined,
chord: undefined
},
components: [ {
kind: "enyo.Scroller",
fit: !0,
classes: "michote-scroller",
horizontal: "hidden",
components: [ {
name: "lyric",
kind: "FittableRows",
classes: "box-center"
} ]
} ],
lyricsChanged: function() {
this.$.lyric.destroyClientControls();
var e = [];
for (i in this.lyrics) {
var t = $L(this.lyrics[i].elname.charAt(0)) + " " + this.lyrics[i].elname.substring(1, this.lyrics[i].elname.length);
this.lyrics[i].language && (t = t + " (" + this.lyrics[i].language + ")"), this.$.lyric.createComponent({
name: i,
kind: "onyx.Groupbox",
owner: this,
components: [ {
kind: "onyx.GroupboxHeader",
components: [ {
content: t
}, {
name: "eB" + i,
kind: "onyx.IconButton",
src: Helper.iconPath() + "edit.png",
ontap: "openEdit",
classes: "editbutton"
} ]
} ]
});
for (j in this.lyrics[i].lines) this.lyrics[i].lines[j].part && this.$[i].createComponent({
style: "color: #9E0508; padding: .5rem;",
owner: this,
content: this.lyrics[i].lines[j].part
}), this.$[i].createComponent({
kind: "onyx.InputDecorator",
components: [ {
name: i + "text" + j,
kind: "onyx.RichText",
value: this.lyrics[i].lines[j].text,
placeholder: $L("type lyrics here"),
ontap: "storeEditEl",
owner: this
} ]
});
e.push(this.lyrics[i].elname);
}
e = Helper.removeDoubles(e), this.owner.$.metaPane.setButton(e), this.$.lyric.render();
},
addNew: function(e) {
this.log(e), this.saveModifications();
var t = [];
for (i in this.lyrics) e === i.charAt(0) && t.push(i);
if (!t.length) var n = ""; else if (t.slice(-1)[0].length === 1) var n = 1; else var n = parseInt(t.slice(-1)[0].substring(1, t.slice(-1)[0].length)) + 1;
this.lyrics[e + n] = {
elname: e + n,
language: null,
lines: [ {
part: "",
text: ""
} ]
}, this.lyricsChanged();
},
saveModifications: function() {
this.log("save lyrics modification");
for (i in this.lyrics) for (j in this.lyrics[i].lines) {
var e = this.$[i + "text" + j].getValue().replace(/<div>/g, "").replace(/<\/div>/g, "<br>");
e.substring(e.length - 4, e.length) === "<br>" ? e = e.substring(0, e.length - 4) : e = e, this.lyrics[i].lines[j].text = e;
}
this.owner.setLyrics(this.lyrics);
},
openEdit: function(e) {
this.log(), this.saveModifications();
var t = e.name.replace("eB", "");
this.el = t, this.owner.owner.owner.$.infoPanels.setIndex(1), this.owner.owner.owner.$.sidePane.editElement(this.lyrics[t], $L("Edit") + " " + $L(t.charAt(0)) + " " + t.substring(1, t.length));
},
insertSamePlace: function(e, t) {
this.setLyrics(Helper.insertSame(this.lyrics, e, t, this.el));
},
deleteElement: function() {
this.log(), delete this.lyrics[this.el], this.lyricsChanged();
},
storeEditEl: function(e) {
Helper.browser() ? !this.chord || e.insertAtCursor(this.chord) : (this.el = e.name, this.log(this.el));
},
storeRange: function() {
this.log();
if (this.el) {
var e = this.$[this.el];
e.focus();
if (e.getSelection) {
sel = e.getSelection();
if (sel.getRangeAt && sel.rangeCount) var t = sel.getRangeAt(0);
}
this.log(t), this.elrange = t;
}
}
});
