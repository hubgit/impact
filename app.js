var impactSources = [
	"http://impactstory.org/embed/v1/impactstory.js"
];

var addRenderers = function() {
	var head = document.getElementsByTagName("head")[0];

	impactSources.forEach(function(url) {
		var script = document.createElement("script");
		script.setAttribute("type", "application/javascript");
		script.setAttribute("src", url);

		head.appendChild(script);
	});
};

var renderItem = function(data, container) {
	var doi = data.doi;

	var itemContainer = document.createElement("article");

	var a = document.createElement("a");
	a.textContent = data.title;
	a.setAttribute("href", "http://dx.doi.org/" + doi);

	var header = document.createElement("h2");
	header.appendChild(a);
	itemContainer.appendChild(header);

	var bib = document.createElement("div");
	itemContainer.appendChild(bib);
	fetchCitation(doi, bib);

	var item = document.createElement("div");

	item.setAttribute("class", "altmetric-embed");
	item.setAttribute("data-badge-type", "medium-donut");
	item.setAttribute("data-badge-details", "right");
	item.setAttribute("data-doi", doi);

	itemContainer.appendChild(item);


	var item = document.createElement("div");

	item.setAttribute("class", "impactstory-embed");
	item.setAttribute("data-verbose-badges", "true");
	item.setAttribute("data-id-type", "doi");
	item.setAttribute("data-api-key", "eaton-0w99ho");
	item.setAttribute("data-id", doi);

	itemContainer.appendChild(item);

	container.appendChild(itemContainer);
};

var fetchCitation = function(doi, container) {
	var xhr = new XMLHttpRequest;
	xhr.open("GET", "http://data.crossref.org/" + doi);
	xhr.setRequestHeader("Accept", "text/bibliography; style=apa; locale=en-US");
	xhr.onload = function() {
		container.textContent = this.response;
	};
	xhr.send();
};

var finished = 0;

var fetchIndex = function(url, containerID) {
	var container = document.getElementById(containerID);

	var xhr = new XMLHttpRequest;
	xhr.open("GET", url);
	xhr.setRequestHeader("Accept", "application/json");
	xhr.onload = function() {
		var data = JSON.parse(this.response);

		data.items.forEach(function(item) {
			renderItem(item, container);
		});

		if (data._links.next) {
			fetchIndex(data._links.next.href, containerID);
		} else if (++finished === 2) {
			addRenderers();
			_altmetric_embed_init();
		}
	};
	xhr.send();
};

fetchIndex("https://peerj.com/articles/index.json", "article-metrics");
fetchIndex("https://peerj.com/preprints/index.json", "preprint-metrics");