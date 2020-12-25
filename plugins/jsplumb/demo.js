jsPlumbToolkit.ready(function() {
    var cdemos = document.querySelectorAll(".cdemo");
    cdemos.forEach(function(cdemo) {
        try {
            var json = JSON.parse(cdemo.innerText), epMap = {}, maxY = 0, maxX = 0,
                h = cdemo.getAttribute("height"),
                w = cdemo.getAttribute("width"),
                draggable = cdemo.getAttribute("draggable") === "true",
                border = cdemo.getAttribute("border") === "true";

            cdemo.innerHTML = "";
            var container = document.createElement("div");
            container.className = "demo-container";
            if (border) {
                container.classList.add("border");
            }

            cdemo.appendChild(container);
            var j = jsPlumb.getInstance({Container: container});
            json.nodes.forEach(function (node) {
                var d = document.createElement("div");
                d.className = "jtk-node";
                if (node.big) {
                    d.classList.add("big");
                }
                d.style.left = node.left + "px";
                d.style.top = node.top + "px";

                container.appendChild(d);

                if (draggable) {
                    j.draggable(d);
                }

                var s = j.getSize(d);
                var nMaxY = node.top + s[1], nMaxX = node.left + s[0];
                if (!isNaN(nMaxY)) {
                    maxY = Math.max(nMaxY, maxY);
                }

                if (!isNaN(nMaxX)) {
                    maxX = Math.max(nMaxX, maxX);
                }

                if (node.ep) {
                    node.ep.forEach(function (ep) {
                        var epId = ep.id || jsPlumbUtil.uuid();
                        ep.connectionsDetachable = false;
                        epMap[epId] = j.addEndpoint(d, ep);
                    })
                }

            });
            if (json.edges) {
                json.edges.forEach(function (edge) {
                    edge.source = epMap[edge.source];
                    edge.target = epMap[edge.target];
                    j.connect(edge);
                })
            }

            if (!h && maxY > 0) {
                cdemo.style.height = (maxY + 60) + "px";
            } else if (h) {
                cdemo.style.height = h;
            }

            if (!w && maxX > 0) {
                cdemo.style.width = (maxX + 60) + "px";
            } else if (w) {
                cdemo.style.width = w;
            }

            cdemo.classList.add("processed");
        }
        catch (e) {
            cdemo.parentNode.removeChild(cdemo);
        }

    });

    var tdemos = document.querySelectorAll(".tdemo"), dataToLoad = [];
    tdemos.forEach(function(tdemo) {
        try {
            eval("var json=" + tdemo.innerText);
            var //json = JSON.parse(tdemo.innerText),
                h = tdemo.getAttribute("height"),
                w = tdemo.getAttribute("width"),
                border = tdemo.getAttribute("border") === "true",
                title = tdemo.getAttribute("title");

            tdemo.innerHTML = "";

            if (title) {
                var t = document.createElement("h5");
                t.style.position = "absolute";
                t.style.top="-50px";
                t.innerHTML = title;
                tdemo.appendChild(t);
            }

            var container = document.createElement("div");
            container.className = "demo-container";
            if (border) {
                container.classList.add("border");
            }
            tdemo.appendChild(container);

            var tk = jsPlumbToolkit.newInstance(json.toolkitParams || {});

            tdemo.style.height = h;
            tdemo.style.width = w;
            tdemo.classList.add("processed");

            var surface = tk.render(jsPlumb.extend({
                container:container
            }, json.renderParams));

            if (json.data) {
                dataToLoad.push([
                    tk, json.data, surface, json.onload
                ]);
            }

        }
        catch (e) {
            tdemo.parentNode.removeChild(tdemo);
        }
    });

    setTimeout(function() {
        dataToLoad.forEach(function(d) {
            d[0].load({
                data:d[1],
                onload:function() {
                    d[2].zoomToFit();
                    d[3] && d[3](d[2]);
                }
            });
        });
    }, 0);

    jsPlumb.on(document, "click", ".launch-menu", function() {
        jsPlumb.toggleClass(document.querySelector(".toc"), "show-menu");
        jsPlumb.toggleClass(this, "visible");
    });
});
