
var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = 960 - margin.right - margin.left,
    height = 600 - margin.top - margin.bottom;
    
var i = 0,
    duration = 750,
    root ;

var tree = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//d3.json("dewey.json", function(error, dewey) {
//    console.log('go');
//    console.log(dewey);
  root = getData(); // flare; //getData();
  root.x0 = height / 2;
  root.y0 = 0;

  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  root.children.forEach(collapse);
  update(root);
//});

d3.select(self.frameElement).style("height", "800px");

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", click);

  nodeEnter.append("circle")
      .attr("r", 1e-6)
//      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; }) // CM
  ;

  nodeEnter.append("text")
      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
      .text(function(d) { return d.title; })
      .style("fill-opacity", 1e-6)
        .call(wrap, 150) // CM
    ;

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
      .attr("r", 4.5)
      //.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; }) // CM
  ;

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
//  console.log(root);
}

    
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
} 

function getData() {
    
    var data = [{ 'name': '_', 'title': 'Root'}
,{ 'name': '0', 'title': 'Computer science, information & general works', 'father': '_'}
,{ 'name': '1', 'title': 'Philosophy & psychology', 'father': '_'}
,{ 'name': '2', 'title': 'Religion', 'father': '_'}
,{ 'name': '3', 'title': 'Social sciences', 'father': '_'}
,{ 'name': '4', 'title': 'Language', 'father': '_'}
,{ 'name': '5', 'title': 'Science', 'father': '_'}
,{ 'name': '6', 'title': 'Technology', 'father': '_'}
,{ 'name': '7', 'title': 'Arts & recreation', 'father': '_'}
,{ 'name': '8', 'title': 'Literature', 'father': '_'}
,{ 'name': '9', 'title': 'History & geography', 'father': '_'}
,{ 'name': '00', 'title': 'Computer science, knowledge & systems', 'father': '0'}
,{ 'name': '01', 'title': 'Bibliographies', 'father': '0'}
,{ 'name': '02', 'title': 'Library & information sciences', 'father': '0'}
,{ 'name': '03', 'title': 'Encyclopedias & books of facts', 'father': '0'}
,{ 'name': '04', 'title': '[Unassigned]', 'father': '0'}
,{ 'name': '05', 'title': 'Magazines, journals & serials', 'father': '0'}
,{ 'name': '06', 'title': 'Associations, organizations & museums', 'father': '0'}
,{ 'name': '07', 'title': 'News media, journalism & publishing', 'father': '0'}
,{ 'name': '08', 'title': 'Quotations', 'father': '0'}
,{ 'name': '09', 'title': 'Manuscripts & rare books', 'father': '0'}
,{ 'name': '10', 'title': 'Philosophy', 'father': '1'}
,{ 'name': '11', 'title': 'Metaphysics', 'father': '1'}
,{ 'name': '12', 'title': 'Epistemology', 'father': '1'}
,{ 'name': '13', 'title': 'Parapsychology & occultism', 'father': '1'}
,{ 'name': '14', 'title': 'Philosophical schools of thought', 'father': '1'}
,{ 'name': '15', 'title': 'Psychology', 'father': '1'}
,{ 'name': '16', 'title': 'Logic', 'father': '1'}
,{ 'name': '17', 'title': 'Ethics', 'father': '1'}
,{ 'name': '18', 'title': 'Ancient, medieval & eastern philosophy', 'father': '1'}
,{ 'name': '19', 'title': 'Modern western philosophy', 'father': '1'}
,{ 'name': '20', 'title': 'Religion', 'father': '2'}
,{ 'name': '21', 'title': 'Philosophy & theory of religion', 'father': '2'}
,{ 'name': '22', 'title': 'The Bible', 'father': '2'}
,{ 'name': '23', 'title': 'Christianity & Christian theology', 'father': '2'}
,{ 'name': '24', 'title': 'Christian practice & observance', 'father': '2'}
,{ 'name': '25', 'title': 'Christian pastoral practice & religious orders', 'father': '2'}
,{ 'name': '26', 'title': 'Christian organization, social work & worship', 'father': '2'}
,{ 'name': '27', 'title': 'History of Christianity', 'father': '2'}
,{ 'name': '28', 'title': 'Christian denominations', 'father': '2'}
,{ 'name': '29', 'title': 'Other religions', 'father': '2'}
,{ 'name': '30', 'title': 'Social sciences, sociology & anthropology', 'father': '3'}
,{ 'name': '31', 'title': 'Statistics', 'father': '3'}
,{ 'name': '32', 'title': 'Political science', 'father': '3'}
,{ 'name': '33', 'title': 'Economics', 'father': '3'}
,{ 'name': '34', 'title': 'Law', 'father': '3'}
,{ 'name': '35', 'title': 'Public administration & military science', 'father': '3'}
,{ 'name': '36', 'title': 'Social problems & social services', 'father': '3'}
,{ 'name': '37', 'title': 'Education', 'father': '3'}
,{ 'name': '38', 'title': 'Commerce, communications & transportation', 'father': '3'}
,{ 'name': '39', 'title': 'Customs, etiquette & folklore', 'father': '3'}
,{ 'name': '40', 'title': 'Language', 'father': '4'}
,{ 'name': '41', 'title': 'Linguistics', 'father': '4'}
,{ 'name': '42', 'title': 'English & Old English languages', 'father': '4'}
,{ 'name': '43', 'title': 'German & related languages', 'father': '4'}
,{ 'name': '44', 'title': 'French & related languages', 'father': '4'}
,{ 'name': '45', 'title': 'Italian, Romanian & related languages', 'father': '4'}
,{ 'name': '46', 'title': 'Spanish & Portuguese languages', 'father': '4'}
,{ 'name': '47', 'title': 'Latin & Italic languages', 'father': '4'}
,{ 'name': '48', 'title': 'Classical & modern Greek languages', 'father': '4'}
,{ 'name': '49', 'title': 'Other languages', 'father': '4'}
,{ 'name': '50', 'title': 'Science', 'father': '5'}
,{ 'name': '51', 'title': 'Mathematics', 'father': '5'}
,{ 'name': '52', 'title': 'Astronomy', 'father': '5'}
,{ 'name': '53', 'title': 'Physics', 'father': '5'}
,{ 'name': '54', 'title': 'Chemistry', 'father': '5'}
,{ 'name': '55', 'title': 'Earth sciences & geology', 'father': '5'}
,{ 'name': '56', 'title': 'Fossils & prehistoric life', 'father': '5'}
,{ 'name': '57', 'title': 'Life sciences; biology', 'father': '5'}
,{ 'name': '58', 'title': 'Plants (Botany)', 'father': '5'}
,{ 'name': '59', 'title': 'Animals (Zoology)', 'father': '5'}
,{ 'name': '60', 'title': 'Technology', 'father': '6'}
,{ 'name': '61', 'title': 'Medicine & health', 'father': '6'}
,{ 'name': '62', 'title': 'Engineering', 'father': '6'}
,{ 'name': '63', 'title': 'Agriculture', 'father': '6'}
,{ 'name': '64', 'title': 'Home & family management', 'father': '6'}
,{ 'name': '65', 'title': 'Management & public relations', 'father': '6'}
,{ 'name': '66', 'title': 'Chemical engineering', 'father': '6'}
,{ 'name': '67', 'title': 'Manufacturing', 'father': '6'}
,{ 'name': '68', 'title': 'Manufacture for specific uses', 'father': '6'}
,{ 'name': '69', 'title': 'Building & construction', 'father': '6'}
,{ 'name': '70', 'title': 'Arts', 'father': '7'}
,{ 'name': '71', 'title': 'Landscaping & area planning', 'father': '7'}
,{ 'name': '72', 'title': 'Architecture', 'father': '7'}
,{ 'name': '73', 'title': 'Sculpture, ceramics & metalwork', 'father': '7'}
,{ 'name': '74', 'title': 'Drawing & decorative arts', 'father': '7'}
,{ 'name': '75', 'title': 'Painting', 'father': '7'}
,{ 'name': '76', 'title': 'Graphic arts', 'father': '7'}
,{ 'name': '77', 'title': 'Photography & computer art', 'father': '7'}
,{ 'name': '78', 'title': 'Music', 'father': '7'}
,{ 'name': '79', 'title': 'Sports, games & entertainment', 'father': '7'}
,{ 'name': '80', 'title': 'Literature, rhetoric & criticism', 'father': '8'}
,{ 'name': '81', 'title': 'American literature in English', 'father': '8'}
,{ 'name': '82', 'title': 'English & Old English literatures', 'father': '8'}
,{ 'name': '83', 'title': 'German & related literatures', 'father': '8'}
,{ 'name': '84', 'title': 'French & related literatures', 'father': '8'}
,{ 'name': '85', 'title': 'Italian, Romanian & related literatures', 'father': '8'}
,{ 'name': '86', 'title': 'Spanish & Portuguese literatures', 'father': '8'}
,{ 'name': '87', 'title': 'Latin & Italic literatures', 'father': '8'}
,{ 'name': '88', 'title': 'Classical & modern Greek literatures', 'father': '8'}
,{ 'name': '89', 'title': 'Other literatures', 'father': '8'}
,{ 'name': '90', 'title': 'History', 'father': '9'}
,{ 'name': '91', 'title': 'Geography & travel', 'father': '9'}
,{ 'name': '92', 'title': 'Biography & genealogy', 'father': '9'}
,{ 'name': '93', 'title': 'History of ancient world (to ca. 499)', 'father': '9'}
,{ 'name': '94', 'title': 'History of Europe', 'father': '9'}
,{ 'name': '95', 'title': 'History of Asia', 'father': '9'}
,{ 'name': '96', 'title': 'History of Africa', 'father': '9'}
,{ 'name': '97', 'title': 'History of North America', 'father': '9'}
,{ 'name': '98', 'title': 'History of South America', 'father': '9'}
,{ 'name': '99', 'title': 'History of other areas', 'father': '9'}
,{ 'name': '000', 'title': 'Computer science, information & general works', 'father': '00'}
,{ 'name': '001', 'title': 'Knowledge', 'father': '00'}
,{ 'name': '002', 'title': 'The book', 'father': '00'}
,{ 'name': '003', 'title': 'Systems', 'father': '00'}
,{ 'name': '004', 'title': 'Data processing & computer science', 'father': '00'}
,{ 'name': '005', 'title': 'Computer programming, programs & data', 'father': '00'}
,{ 'name': '006', 'title': 'Special computer methods', 'father': '00'}
,{ 'name': '007', 'title': '[Unassigned]', 'father': '00'}
,{ 'name': '008', 'title': '[Unassigned]', 'father': '00'}
,{ 'name': '009', 'title': '[Unassigned]', 'father': '00'}
,{ 'name': '010', 'title': 'Bibliography', 'father': '01'}
,{ 'name': '011', 'title': 'Bibliographies', 'father': '01'}
,{ 'name': '012', 'title': 'Bibliographies of individuals', 'father': '01'}
,{ 'name': '013', 'title': '[Unassigned]', 'father': '01'}
,{ 'name': '014', 'title': 'Bibliographies of anonymous & pseudonymous works', 'father': '01'}
,{ 'name': '015', 'title': 'Bibliographies of works from specific places', 'father': '01'}
,{ 'name': '016', 'title': 'Bibliographies of works on specific subjects', 'father': '01'}
,{ 'name': '017', 'title': 'General subject catalogs', 'father': '01'}
,{ 'name': '018', 'title': 'Catalogs arranged by author, date, etc.', 'father': '01'}
,{ 'name': '019', 'title': 'Dictionary catalogs', 'father': '01'}
,{ 'name': '020', 'title': 'Library & information sciences', 'father': '02'}
,{ 'name': '021', 'title': 'Library relationships', 'father': '02'}
,{ 'name': '022', 'title': 'Administration of physical plant', 'father': '02'}
,{ 'name': '023', 'title': 'Personnel management', 'father': '02'}
,{ 'name': '024', 'title': '[Unassigned]', 'father': '02'}
,{ 'name': '025', 'title': 'Library operations', 'father': '02'}
,{ 'name': '026', 'title': 'Libraries for specific subjects', 'father': '02'}
,{ 'name': '027', 'title': 'General libraries', 'father': '02'}
,{ 'name': '028', 'title': 'Reading & use of other information media', 'father': '02'}
,{ 'name': '029', 'title': '[Unassigned]', 'father': '02'}
,{ 'name': '030', 'title': 'General encyclopedic works', 'father': '03'}
,{ 'name': '031', 'title': 'Encyclopedias in American English', 'father': '03'}
,{ 'name': '032', 'title': 'Encyclopedias in English', 'father': '03'}
,{ 'name': '033', 'title': 'Encyclopedias in other Germanic languages', 'father': '03'}
,{ 'name': '034', 'title': 'Encyclopedias in French, Occitan & Catalan', 'father': '03'}
,{ 'name': '035', 'title': 'Encyclopedias in Italian, Romanian & related languages', 'father': '03'}
,{ 'name': '036', 'title': 'Encyclopedias in Spanish & Portuguese', 'father': '03'}
,{ 'name': '037', 'title': 'Encyclopedias in Slavic languages', 'father': '03'}
,{ 'name': '038', 'title': 'Encyclopedias in Scandinavian languages', 'father': '03'}
,{ 'name': '039', 'title': 'Encyclopedias in other languages', 'father': '03'}
,{ 'name': '040', 'title': '[Unassigned]', 'father': '04'}
,{ 'name': '041', 'title': '[Unassigned]', 'father': '04'}
,{ 'name': '042', 'title': '[Unassigned]', 'father': '04'}
,{ 'name': '043', 'title': '[Unassigned]', 'father': '04'}
,{ 'name': '044', 'title': '[Unassigned]', 'father': '04'}
,{ 'name': '045', 'title': '[Unassigned]', 'father': '04'}
,{ 'name': '046', 'title': '[Unassigned]', 'father': '04'}
,{ 'name': '047', 'title': '[Unassigned]', 'father': '04'}
,{ 'name': '048', 'title': '[Unassigned]', 'father': '04'}
,{ 'name': '049', 'title': '[Unassigned]', 'father': '04'}
,{ 'name': '050', 'title': 'General serial publications', 'father': '05'}
,{ 'name': '051', 'title': 'Serials in American English', 'father': '05'}
,{ 'name': '052', 'title': 'Serials in English', 'father': '05'}
,{ 'name': '053', 'title': 'Serials in other Germanic languages', 'father': '05'}
,{ 'name': '054', 'title': 'Serials in French, Occitan & Catalan', 'father': '05'}
,{ 'name': '055', 'title': 'Serials in Italian, Romanian & related languages', 'father': '05'}
,{ 'name': '056', 'title': 'Serials in Spanish & Portuguese', 'father': '05'}
,{ 'name': '057', 'title': 'Serials in Slavic languages', 'father': '05'}
,{ 'name': '058', 'title': 'Serials in Scandinavian languages', 'father': '05'}
,{ 'name': '059', 'title': 'Serials in other languages', 'father': '05'}
,{ 'name': '060', 'title': 'General organizations & museum science', 'father': '06'}
,{ 'name': '061', 'title': 'Organizations in North America', 'father': '06'}
,{ 'name': '062', 'title': 'Organizations in British Isles; in England', 'father': '06'}
,{ 'name': '063', 'title': 'Organizations in central Europe; in Germany', 'father': '06'}
,{ 'name': '064', 'title': 'Organizations in France & Monaco', 'father': '06'}
,{ 'name': '065', 'title': 'Organizations in Italy & adjacent islands', 'father': '06'}
,{ 'name': '066', 'title': 'Organizations in Iberian Peninsula & adjacent islands', 'father': '06'}
,{ 'name': '067', 'title': 'Organizations in eastern Europe; in Russia', 'father': '06'}
,{ 'name': '068', 'title': 'Organizations in other geographic areas', 'father': '06'}
,{ 'name': '069', 'title': 'Museum science', 'father': '06'}
,{ 'name': '070', 'title': 'News media, journalism & publishing', 'father': '07'}
,{ 'name': '071', 'title': 'Newspapers in North America', 'father': '07'}
,{ 'name': '072', 'title': 'Newspapers in British Isles; in England', 'father': '07'}
,{ 'name': '073', 'title': 'Newspapers in central Europe; in Germany', 'father': '07'}
,{ 'name': '074', 'title': 'Newspapers in France & Monaco', 'father': '07'}
,{ 'name': '075', 'title': 'Newspapers in Italy & adjacent islands', 'father': '07'}
,{ 'name': '076', 'title': 'Newspapers in Iberian Peninsula & adjacent islands', 'father': '07'}
,{ 'name': '077', 'title': 'Newspapers in eastern Europe; in Russia', 'father': '07'}
,{ 'name': '078', 'title': 'Newspapers in Scandinavia', 'father': '07'}
,{ 'name': '079', 'title': 'Newspapers in other geographic areas', 'father': '07'}
,{ 'name': '080', 'title': 'General collections', 'father': '08'}
,{ 'name': '081', 'title': 'Collections in American English', 'father': '08'}
,{ 'name': '082', 'title': 'Collections in English', 'father': '08'}
,{ 'name': '083', 'title': 'Collections in other Germanic languages', 'father': '08'}
,{ 'name': '084', 'title': 'Collections in French, Occitan & Catalan', 'father': '08'}
,{ 'name': '085', 'title': 'Collections in Italian, Romanian & related languages', 'father': '08'}
,{ 'name': '086', 'title': 'Collections in Spanish & Portuguese', 'father': '08'}
,{ 'name': '087', 'title': 'Collections in Slavic languages', 'father': '08'}
,{ 'name': '088', 'title': 'Collections in Scandinavian languages', 'father': '08'}
,{ 'name': '089', 'title': 'Collections in other languages', 'father': '08'}
,{ 'name': '090', 'title': 'Manuscripts & rare books', 'father': '09'}
,{ 'name': '091', 'title': 'Manuscripts', 'father': '09'}
,{ 'name': '092', 'title': 'Block books', 'father': '09'}
,{ 'name': '093', 'title': 'Incunabula', 'father': '09'}
,{ 'name': '094', 'title': 'Printed books', 'father': '09'}
,{ 'name': '095', 'title': 'Books notable for bindings', 'father': '09'}
,{ 'name': '096', 'title': 'Books notable for illustrations', 'father': '09'}
,{ 'name': '097', 'title': 'Books notable for ownership or origin', 'father': '09'}
,{ 'name': '098', 'title': 'Prohibited works, forgeries & hoaxes', 'father': '09'}
,{ 'name': '099', 'title': 'Books notable for format', 'father': '09'}
,{ 'name': '100', 'title': 'Philosophy & psychology', 'father': '10'}
,{ 'name': '101', 'title': 'Theory of philosophy', 'father': '10'}
,{ 'name': '102', 'title': 'Miscellany', 'father': '10'}
,{ 'name': '103', 'title': 'Dictionaries & encyclopedias', 'father': '10'}
,{ 'name': '104', 'title': '[Unassigned]', 'father': '10'}
,{ 'name': '105', 'title': 'Serial publications', 'father': '10'}
,{ 'name': '106', 'title': 'Organizations & management', 'father': '10'}
,{ 'name': '107', 'title': 'Education, research & related topics', 'father': '10'}
,{ 'name': '108', 'title': 'Kinds of persons treatment', 'father': '10'}
,{ 'name': '109', 'title': 'Historical & collected persons treatment', 'father': '10'}
,{ 'name': '110', 'title': 'Metaphysics', 'father': '11'}
,{ 'name': '111', 'title': 'Ontology', 'father': '11'}
,{ 'name': '112', 'title': '[Unassigned]', 'father': '11'}
,{ 'name': '113', 'title': 'Cosmology', 'father': '11'}
,{ 'name': '114', 'title': 'Space', 'father': '11'}
,{ 'name': '115', 'title': 'Time', 'father': '11'}
,{ 'name': '116', 'title': 'Change', 'father': '11'}
,{ 'name': '117', 'title': 'Structure', 'father': '11'}
,{ 'name': '118', 'title': 'Force & energy', 'father': '11'}
,{ 'name': '119', 'title': 'Number & quantity', 'father': '11'}
,{ 'name': '120', 'title': 'Epistemology, causation & humankind', 'father': '12'}
,{ 'name': '121', 'title': 'Epistemology', 'father': '12'}
,{ 'name': '122', 'title': 'Causation', 'father': '12'}
,{ 'name': '123', 'title': 'Determinism & indeterminism', 'father': '12'}
,{ 'name': '124', 'title': 'Teleology', 'father': '12'}
,{ 'name': '125', 'title': '[Unassigned]', 'father': '12'}
,{ 'name': '126', 'title': 'The self', 'father': '12'}
,{ 'name': '127', 'title': 'The unconscious & the subconscious', 'father': '12'}
,{ 'name': '128', 'title': 'Humankind', 'father': '12'}
,{ 'name': '129', 'title': 'Origin & destiny of individual souls', 'father': '12'}
,{ 'name': '130', 'title': 'Parapsychology & occultism', 'father': '13'}
,{ 'name': '131', 'title': 'Parapsychological & occult methods', 'father': '13'}
,{ 'name': '132', 'title': '[Unassigned]', 'father': '13'}
,{ 'name': '133', 'title': 'Specific topics in parapsychology & occultism', 'father': '13'}
,{ 'name': '134', 'title': '[Unassigned]', 'father': '13'}
,{ 'name': '135', 'title': 'Dreams & mysteries', 'father': '13'}
,{ 'name': '136', 'title': '[Unassigned]', 'father': '13'}
,{ 'name': '137', 'title': 'Divinatory graphology', 'father': '13'}
,{ 'name': '138', 'title': 'Physiognomy', 'father': '13'}
,{ 'name': '139', 'title': 'Phrenology', 'father': '13'}
,{ 'name': '140', 'title': 'Specific philosophical schools', 'father': '14'}
,{ 'name': '141', 'title': 'Idealism & related systems', 'father': '14'}
,{ 'name': '142', 'title': 'Critical philosophy', 'father': '14'}
,{ 'name': '143', 'title': 'Bergsonism & intuitionism', 'father': '14'}
,{ 'name': '144', 'title': 'Humanism & related systems', 'father': '14'}
,{ 'name': '145', 'title': 'Sensationalism', 'father': '14'}
,{ 'name': '146', 'title': 'Naturalism & related systems', 'father': '14'}
,{ 'name': '147', 'title': 'Pantheism & related systems', 'father': '14'}
,{ 'name': '148', 'title': 'Eclecticism, liberalism & traditionalism', 'father': '14'}
,{ 'name': '149', 'title': 'Other philosophical systems', 'father': '14'}
,{ 'name': '150', 'title': 'Psychology', 'father': '15'}
,{ 'name': '151', 'title': '[Unassigned]', 'father': '15'}
,{ 'name': '152', 'title': 'Perception, movement, emotions & drives', 'father': '15'}
,{ 'name': '153', 'title': 'Mental processes & intelligence', 'father': '15'}
,{ 'name': '154', 'title': 'Subconscious & altered states', 'father': '15'}
,{ 'name': '155', 'title': 'Differential & developmental psychology', 'father': '15'}
,{ 'name': '156', 'title': 'Comparative psychology', 'father': '15'}
,{ 'name': '157', 'title': '[Unassigned]', 'father': '15'}
,{ 'name': '158', 'title': 'Applied psychology', 'father': '15'}
,{ 'name': '159', 'title': '[Unassigned]', 'father': '15'}
,{ 'name': '160', 'title': 'Logic', 'father': '16'}
,{ 'name': '161', 'title': 'Induction', 'father': '16'}
,{ 'name': '162', 'title': 'Deduction', 'father': '16'}
,{ 'name': '163', 'title': '[Unassigned]', 'father': '16'}
,{ 'name': '164', 'title': '[Unassigned]', 'father': '16'}
,{ 'name': '165', 'title': 'Fallacies & sources of error', 'father': '16'}
,{ 'name': '166', 'title': 'Syllogisms', 'father': '16'}
,{ 'name': '167', 'title': 'Hypotheses', 'father': '16'}
,{ 'name': '168', 'title': 'Argument & persuasion', 'father': '16'}
,{ 'name': '169', 'title': 'Analogy', 'father': '16'}
,{ 'name': '170', 'title': 'Ethics', 'father': '17'}
,{ 'name': '171', 'title': 'Ethical systems', 'father': '17'}
,{ 'name': '172', 'title': 'Political ethics', 'father': '17'}
,{ 'name': '173', 'title': 'Ethics of family relationships', 'father': '17'}
,{ 'name': '174', 'title': 'Occupational ethics', 'father': '17'}
,{ 'name': '175', 'title': 'Ethics of recreation & leisure', 'father': '17'}
,{ 'name': '176', 'title': 'Ethics of sex & reproduction', 'father': '17'}
,{ 'name': '177', 'title': 'Ethics of social relations', 'father': '17'}
,{ 'name': '178', 'title': 'Ethics of consumption', 'father': '17'}
,{ 'name': '179', 'title': 'Other ethical norms', 'father': '17'}
,{ 'name': '180', 'title': 'Ancient, medieval & eastern philosophy', 'father': '18'}
,{ 'name': '181', 'title': 'Eastern philosophy', 'father': '18'}
,{ 'name': '182', 'title': 'Pre-Socratic Greek philosophies', 'father': '18'}
,{ 'name': '183', 'title': 'Socratic & related philosophies', 'father': '18'}
,{ 'name': '184', 'title': 'Platonic philosophy', 'father': '18'}
,{ 'name': '185', 'title': 'Aristotelian philosophy', 'father': '18'}
,{ 'name': '186', 'title': 'Skeptic & Neoplatonic philosophies', 'father': '18'}
,{ 'name': '187', 'title': 'Epicurean philosophy', 'father': '18'}
,{ 'name': '188', 'title': 'Stoic philosophy', 'father': '18'}
,{ 'name': '189', 'title': 'Medieval western philosophy', 'father': '18'}
,{ 'name': '190', 'title': 'Modern western philosophy', 'father': '19'}
,{ 'name': '191', 'title': 'Philosophy of United States & Canada', 'father': '19'}
,{ 'name': '192', 'title': 'Philosophy of British Isles', 'father': '19'}
,{ 'name': '193', 'title': 'Philosophy of Germany & Austria', 'father': '19'}
,{ 'name': '194', 'title': 'Philosophy of France', 'father': '19'}
,{ 'name': '195', 'title': 'Philosophy of Italy', 'father': '19'}
,{ 'name': '196', 'title': 'Philosophy of Spain & Portugal', 'father': '19'}
,{ 'name': '197', 'title': 'Philosophy of former Soviet Union', 'father': '19'}
,{ 'name': '198', 'title': 'Philosophy of Scandinavia', 'father': '19'}
,{ 'name': '199', 'title': 'Philosophy in other geographic areas', 'father': '19'}
,{ 'name': '200', 'title': 'Religion', 'father': '20'}
,{ 'name': '201', 'title': 'Religious mythology & social theology', 'father': '20'}
,{ 'name': '202', 'title': 'Doctrines', 'father': '20'}
,{ 'name': '203', 'title': 'Public worship & other practices', 'father': '20'}
,{ 'name': '204', 'title': 'Religious experience, life & practice', 'father': '20'}
,{ 'name': '205', 'title': 'Religious ethics', 'father': '20'}
,{ 'name': '206', 'title': 'Leaders & organization', 'father': '20'}
,{ 'name': '207', 'title': 'Missions & religious education', 'father': '20'}
,{ 'name': '208', 'title': 'Sources', 'father': '20'}
,{ 'name': '209', 'title': 'Sects & reform movements', 'father': '20'}
,{ 'name': '210', 'title': 'Philosophy & theory of religion', 'father': '21'}
,{ 'name': '211', 'title': 'Concepts of God', 'father': '21'}
,{ 'name': '212', 'title': 'Existence, knowability & attributes of God', 'father': '21'}
,{ 'name': '213', 'title': 'Creation', 'father': '21'}
,{ 'name': '214', 'title': 'Theodicy', 'father': '21'}
,{ 'name': '215', 'title': 'Science & religion', 'father': '21'}
,{ 'name': '216', 'title': '[Unassigned]', 'father': '21'}
,{ 'name': '217', 'title': '[Unassigned]', 'father': '21'}
,{ 'name': '218', 'title': 'Humankind', 'father': '21'}
,{ 'name': '219', 'title': '[Unassigned]', 'father': '21'}
,{ 'name': '220', 'title': 'Bible', 'father': '22'}
,{ 'name': '221', 'title': 'Old Testament (Tanakh)', 'father': '22'}
,{ 'name': '222', 'title': 'Historical books of Old Testament', 'father': '22'}
,{ 'name': '223', 'title': 'Poetic books of Old Testament', 'father': '22'}
,{ 'name': '224', 'title': 'Prophetic books of Old Testament', 'father': '22'}
,{ 'name': '225', 'title': 'New Testament', 'father': '22'}
,{ 'name': '226', 'title': 'Gospels & Acts', 'father': '22'}
,{ 'name': '227', 'title': 'Epistles', 'father': '22'}
,{ 'name': '228', 'title': 'Revelation (Apocalypse)', 'father': '22'}
,{ 'name': '229', 'title': 'Apocrypha & pseudepigrapha', 'father': '22'}
,{ 'name': '230', 'title': 'Christianity & Christian theology', 'father': '23'}
,{ 'name': '231', 'title': 'God', 'father': '23'}
,{ 'name': '232', 'title': 'Jesus Christ & his family', 'father': '23'}
,{ 'name': '233', 'title': 'Humankind', 'father': '23'}
,{ 'name': '234', 'title': 'Salvation & grace', 'father': '23'}
,{ 'name': '235', 'title': 'Spiritual beings', 'father': '23'}
,{ 'name': '236', 'title': 'Eschatology', 'father': '23'}
,{ 'name': '237', 'title': '[Unassigned]', 'father': '23'}
,{ 'name': '238', 'title': 'Creeds & catechisms', 'father': '23'}
,{ 'name': '239', 'title': 'Apologetics & polemics', 'father': '23'}
,{ 'name': '240', 'title': 'Christian moral & devotional theology', 'father': '24'}
,{ 'name': '241', 'title': 'Christian ethics', 'father': '24'}
,{ 'name': '242', 'title': 'Devotional literature', 'father': '24'}
,{ 'name': '243', 'title': 'Evangelistic writings for individuals', 'father': '24'}
,{ 'name': '244', 'title': '[Unassigned]', 'father': '24'}
,{ 'name': '245', 'title': '[Unassigned]', 'father': '24'}
,{ 'name': '246', 'title': 'Use of art in Christianity', 'father': '24'}
,{ 'name': '247', 'title': 'Church furnishings & articles', 'father': '24'}
,{ 'name': '248', 'title': 'Christian experience, practice & life', 'father': '24'}
,{ 'name': '249', 'title': 'Christian observances in family life', 'father': '24'}
,{ 'name': '250', 'title': 'Christian orders & local church', 'father': '25'}
,{ 'name': '251', 'title': 'Preaching', 'father': '25'}
,{ 'name': '252', 'title': 'Texts of sermons', 'father': '25'}
,{ 'name': '253', 'title': 'Pastoral office & work', 'father': '25'}
,{ 'name': '254', 'title': 'Parish administration', 'father': '25'}
,{ 'name': '255', 'title': 'Religious congregations & orders', 'father': '25'}
,{ 'name': '256', 'title': '[Unassigned]', 'father': '25'}
,{ 'name': '257', 'title': '[Unassigned]', 'father': '25'}
,{ 'name': '258', 'title': '[Unassigned]', 'father': '25'}
,{ 'name': '259', 'title': 'Pastoral care of families & kinds of persons', 'father': '25'}
,{ 'name': '260', 'title': 'Social & ecclesiastical theology', 'father': '26'}
,{ 'name': '261', 'title': 'Social theology', 'father': '26'}
,{ 'name': '262', 'title': 'Ecclesiology', 'father': '26'}
,{ 'name': '263', 'title': 'Days, times & places of observance', 'father': '26'}
,{ 'name': '264', 'title': 'Public worship', 'father': '26'}
,{ 'name': '265', 'title': 'Sacraments, other rites & acts', 'father': '26'}
,{ 'name': '266', 'title': 'Missions', 'father': '26'}
,{ 'name': '267', 'title': 'Associations for religious work', 'father': '26'}
,{ 'name': '268', 'title': 'Religious education', 'father': '26'}
,{ 'name': '269', 'title': 'Spiritual renewal', 'father': '26'}
,{ 'name': '270', 'title': 'History of Christianity & Christian church', 'father': '27'}
,{ 'name': '271', 'title': 'Religious orders in church history', 'father': '27'}
,{ 'name': '272', 'title': 'Persecutions in church history', 'father': '27'}
,{ 'name': '273', 'title': 'Doctrinal controversies & heresies', 'father': '27'}
,{ 'name': '274', 'title': 'History of Christianity in Europe', 'father': '27'}
,{ 'name': '275', 'title': 'History of Christianity in Asia', 'father': '27'}
,{ 'name': '276', 'title': 'History of Christianity in Africa', 'father': '27'}
,{ 'name': '277', 'title': 'History of Christianity in North America', 'father': '27'}
,{ 'name': '278', 'title': 'History of Christianity in South America', 'father': '27'}
,{ 'name': '279', 'title': 'History of Christianity in other areas', 'father': '27'}
,{ 'name': '280', 'title': 'Christian denominations & sects', 'father': '28'}
,{ 'name': '281', 'title': 'Early church & Eastern churches', 'father': '28'}
,{ 'name': '282', 'title': 'Roman Catholic Church', 'father': '28'}
,{ 'name': '283', 'title': 'Anglican churches', 'father': '28'}
,{ 'name': '284', 'title': 'Protestants of Continental origin', 'father': '28'}
,{ 'name': '285', 'title': 'Presbyterian, Reformed & Congregational', 'father': '28'}
,{ 'name': '286', 'title': 'Baptist, Disciples of Christ & Adventist', 'father': '28'}
,{ 'name': '287', 'title': 'Methodist & related churches', 'father': '28'}
,{ 'name': '288', 'title': '[Unassigned]', 'father': '28'}
,{ 'name': '289', 'title': 'Other denominations & sects', 'father': '28'}
,{ 'name': '290', 'title': 'Other religions', 'father': '29'}
,{ 'name': '291', 'title': '[Unassigned]', 'father': '29'}
,{ 'name': '292', 'title': 'Greek & Roman religion', 'father': '29'}
,{ 'name': '293', 'title': 'Germanic religion', 'father': '29'}
,{ 'name': '294', 'title': 'Religions of Indic origin', 'father': '29'}
,{ 'name': '295', 'title': 'Zoroastrianism', 'father': '29'}
,{ 'name': '296', 'title': 'Judaism', 'father': '29'}
,{ 'name': '297', 'title': 'Islam, Babism & Bahai Faith', 'father': '29'}
,{ 'name': '298', 'title': '(Optional number)', 'father': '29'}
,{ 'name': '299', 'title': 'Religions not provided for elsewhere', 'father': '29'}
,{ 'name': '300', 'title': 'Social sciences', 'father': '30'}
,{ 'name': '301', 'title': 'Sociology & anthropology', 'father': '30'}
,{ 'name': '302', 'title': 'Social interaction', 'father': '30'}
,{ 'name': '303', 'title': 'Social processes', 'father': '30'}
,{ 'name': '304', 'title': 'Factors affecting social behavior', 'father': '30'}
,{ 'name': '305', 'title': 'Social groups', 'father': '30'}
,{ 'name': '306', 'title': 'Culture & institutions', 'father': '30'}
,{ 'name': '307', 'title': 'Communities', 'father': '30'}
,{ 'name': '308', 'title': '[Unassigned]', 'father': '30'}
,{ 'name': '309', 'title': '[Unassigned]', 'father': '30'}
,{ 'name': '310', 'title': 'Collections of general statistics', 'father': '31'}
,{ 'name': '311', 'title': '[Unassigned]', 'father': '31'}
,{ 'name': '312', 'title': '[Unassigned]', 'father': '31'}
,{ 'name': '313', 'title': '[Unassigned]', 'father': '31'}
,{ 'name': '314', 'title': 'General statistics of Europe', 'father': '31'}
,{ 'name': '315', 'title': 'General statistics of Asia', 'father': '31'}
,{ 'name': '316', 'title': 'General statistics of Africa', 'father': '31'}
,{ 'name': '317', 'title': 'General statistics of North America', 'father': '31'}
,{ 'name': '318', 'title': 'General statistics of South America', 'father': '31'}
,{ 'name': '319', 'title': 'General statistics of other areas', 'father': '31'}
,{ 'name': '320', 'title': 'Political science', 'father': '32'}
,{ 'name': '321', 'title': 'Systems of governments & states', 'father': '32'}
,{ 'name': '322', 'title': 'Relation of state to organized groups', 'father': '32'}
,{ 'name': '323', 'title': 'Civil & political rights', 'father': '32'}
,{ 'name': '324', 'title': 'The political process', 'father': '32'}
,{ 'name': '325', 'title': 'International migration & colonization', 'father': '32'}
,{ 'name': '326', 'title': 'Slavery & emancipation', 'father': '32'}
,{ 'name': '327', 'title': 'International relations', 'father': '32'}
,{ 'name': '328', 'title': 'The legislative process', 'father': '32'}
,{ 'name': '329', 'title': '[Unassigned]', 'father': '32'}
,{ 'name': '330', 'title': 'Economics', 'father': '33'}
,{ 'name': '331', 'title': 'Labor economics', 'father': '33'}
,{ 'name': '332', 'title': 'Financial economics', 'father': '33'}
,{ 'name': '333', 'title': 'Economics of land & energy', 'father': '33'}
,{ 'name': '334', 'title': 'Cooperatives', 'father': '33'}
,{ 'name': '335', 'title': 'Socialism & related systems', 'father': '33'}
,{ 'name': '336', 'title': 'Public finance', 'father': '33'}
,{ 'name': '337', 'title': 'International economics', 'father': '33'}
,{ 'name': '338', 'title': 'Production', 'father': '33'}
,{ 'name': '339', 'title': 'Macroeconomics & related topics', 'father': '33'}
,{ 'name': '340', 'title': 'Law', 'father': '34'}
,{ 'name': '341', 'title': 'Law of nations', 'father': '34'}
,{ 'name': '342', 'title': 'Constitutional & administrative law', 'father': '34'}
,{ 'name': '343', 'title': 'Military, tax, trade & industrial law', 'father': '34'}
,{ 'name': '344', 'title': 'Labor, social, education & cultural law', 'father': '34'}
,{ 'name': '345', 'title': 'Criminal law', 'father': '34'}
,{ 'name': '346', 'title': 'Private law', 'father': '34'}
,{ 'name': '347', 'title': 'Civil procedure & courts', 'father': '34'}
,{ 'name': '348', 'title': 'Laws, regulations & cases', 'father': '34'}
,{ 'name': '349', 'title': 'Law of specific jurisdictions & areas', 'father': '34'}
,{ 'name': '350', 'title': 'Public administration & military science', 'father': '35'}
,{ 'name': '351', 'title': 'Public administration', 'father': '35'}
,{ 'name': '352', 'title': 'General considerations of public administration', 'father': '35'}
,{ 'name': '353', 'title': 'Specific fields of public administration', 'father': '35'}
,{ 'name': '354', 'title': 'Administration of economy & environment', 'father': '35'}
,{ 'name': '355', 'title': 'Military science', 'father': '35'}
,{ 'name': '356', 'title': 'Infantry forces & warfare', 'father': '35'}
,{ 'name': '357', 'title': 'Mounted forces & warfare', 'father': '35'}
,{ 'name': '358', 'title': 'Air & other specialized forces', 'father': '35'}
,{ 'name': '359', 'title': 'Sea forces & warfare', 'father': '35'}
,{ 'name': '360', 'title': 'Social problems & services; associations', 'father': '36'}
,{ 'name': '361', 'title': 'Social problems & social welfare in general', 'father': '36'}
,{ 'name': '362', 'title': 'Social welfare problems & services', 'father': '36'}
,{ 'name': '363', 'title': 'Other social problems & services', 'father': '36'}
,{ 'name': '364', 'title': 'Criminology', 'father': '36'}
,{ 'name': '365', 'title': 'Penal & related institutions', 'father': '36'}
,{ 'name': '366', 'title': 'Associations', 'father': '36'}
,{ 'name': '367', 'title': 'General clubs', 'father': '36'}
,{ 'name': '368', 'title': 'Insurance', 'father': '36'}
,{ 'name': '369', 'title': 'Miscellaneous kinds of associations', 'father': '36'}
,{ 'name': '370', 'title': 'Education', 'father': '37'}
,{ 'name': '371', 'title': 'Schools & their activities; special education', 'father': '37'}
,{ 'name': '372', 'title': 'Elementary education', 'father': '37'}
,{ 'name': '373', 'title': 'Secondary education', 'father': '37'}
,{ 'name': '374', 'title': 'Adult education', 'father': '37'}
,{ 'name': '375', 'title': 'Curricula', 'father': '37'}
,{ 'name': '376', 'title': '[Unassigned]', 'father': '37'}
,{ 'name': '377', 'title': '[Unassigned]', 'father': '37'}
,{ 'name': '378', 'title': 'Higher education', 'father': '37'}
,{ 'name': '379', 'title': 'Public policy issues in education', 'father': '37'}
,{ 'name': '380', 'title': 'Commerce, communications & transportation', 'father': '38'}
,{ 'name': '381', 'title': 'Commerce', 'father': '38'}
,{ 'name': '382', 'title': 'International commerce', 'father': '38'}
,{ 'name': '383', 'title': 'Postal communication', 'father': '38'}
,{ 'name': '384', 'title': 'Communications; telecommunication', 'father': '38'}
,{ 'name': '385', 'title': 'Railroad transportation', 'father': '38'}
,{ 'name': '386', 'title': 'Inland waterway & ferry transportation', 'father': '38'}
,{ 'name': '387', 'title': 'Water, air & space transportation', 'father': '38'}
,{ 'name': '388', 'title': 'Transportation; ground transportation', 'father': '38'}
,{ 'name': '389', 'title': 'Metrology & standardization', 'father': '38'}
,{ 'name': '390', 'title': 'Customs, etiquette & folklore', 'father': '39'}
,{ 'name': '391', 'title': 'Costume & personal appearance', 'father': '39'}
,{ 'name': '392', 'title': 'Customs of life cycle & domestic life', 'father': '39'}
,{ 'name': '393', 'title': 'Death customs', 'father': '39'}
,{ 'name': '394', 'title': 'General customs', 'father': '39'}
,{ 'name': '395', 'title': 'Etiquette (Manners)', 'father': '39'}
,{ 'name': '396', 'title': '[Unassigned]', 'father': '39'}
,{ 'name': '397', 'title': '[Unassigned]', 'father': '39'}
,{ 'name': '398', 'title': 'Folklore', 'father': '39'}
,{ 'name': '399', 'title': 'Customs of war & diplomacy', 'father': '39'}
,{ 'name': '400', 'title': 'Language', 'father': '40'}
,{ 'name': '401', 'title': 'Philosophy & theory', 'father': '40'}
,{ 'name': '402', 'title': 'Miscellany', 'father': '40'}
,{ 'name': '403', 'title': 'Dictionaries & encyclopedias', 'father': '40'}
,{ 'name': '404', 'title': 'Special topics', 'father': '40'}
,{ 'name': '405', 'title': 'Serial publications', 'father': '40'}
,{ 'name': '406', 'title': 'Organizations & management', 'father': '40'}
,{ 'name': '407', 'title': 'Education, research & related topics', 'father': '40'}
,{ 'name': '408', 'title': 'Kinds of persons treatment', 'father': '40'}
,{ 'name': '409', 'title': 'Geographic & persons treatment', 'father': '40'}
,{ 'name': '410', 'title': 'Linguistics', 'father': '41'}
,{ 'name': '411', 'title': 'Writing systems', 'father': '41'}
,{ 'name': '412', 'title': 'Etymology', 'father': '41'}
,{ 'name': '413', 'title': 'Dictionaries', 'father': '41'}
,{ 'name': '414', 'title': 'Phonology & phonetics', 'father': '41'}
,{ 'name': '415', 'title': 'Grammar', 'father': '41'}
,{ 'name': '416', 'title': '[Unassigned]', 'father': '41'}
,{ 'name': '417', 'title': 'Dialectology & historical linguistics', 'father': '41'}
,{ 'name': '418', 'title': 'Standard usage & applied linguistics', 'father': '41'}
,{ 'name': '419', 'title': 'Sign languages', 'father': '41'}
,{ 'name': '420', 'title': 'English & Old English', 'father': '42'}
,{ 'name': '421', 'title': 'English writing system & phonology', 'father': '42'}
,{ 'name': '422', 'title': 'English etymology', 'father': '42'}
,{ 'name': '423', 'title': 'English dictionaries', 'father': '42'}
,{ 'name': '424', 'title': '[Unassigned]', 'father': '42'}
,{ 'name': '425', 'title': 'English grammar', 'father': '42'}
,{ 'name': '426', 'title': '[Unassigned]', 'father': '42'}
,{ 'name': '427', 'title': 'English language variations', 'father': '42'}
,{ 'name': '428', 'title': 'Standard English usage', 'father': '42'}
,{ 'name': '429', 'title': 'Old English (Anglo-Saxon)', 'father': '42'}
,{ 'name': '430', 'title': 'Germanic languages; German', 'father': '43'}
,{ 'name': '431', 'title': 'German writing systems & phonology', 'father': '43'}
,{ 'name': '432', 'title': 'German etymology', 'father': '43'}
,{ 'name': '433', 'title': 'German dictionaries', 'father': '43'}
,{ 'name': '434', 'title': '[Unassigned]', 'father': '43'}
,{ 'name': '435', 'title': 'German grammar', 'father': '43'}
,{ 'name': '436', 'title': '[Unassigned]', 'father': '43'}
,{ 'name': '437', 'title': 'German language variations', 'father': '43'}
,{ 'name': '438', 'title': 'Standard German usage', 'father': '43'}
,{ 'name': '439', 'title': 'Other Germanic languages', 'father': '43'}
,{ 'name': '440', 'title': 'Romance languages; French', 'father': '44'}
,{ 'name': '441', 'title': 'French writing systems & phonology', 'father': '44'}
,{ 'name': '442', 'title': 'French etymology', 'father': '44'}
,{ 'name': '443', 'title': 'French dictionaries', 'father': '44'}
,{ 'name': '444', 'title': '[Unassigned]', 'father': '44'}
,{ 'name': '445', 'title': 'French grammar', 'father': '44'}
,{ 'name': '446', 'title': '[Unassigned]', 'father': '44'}
,{ 'name': '447', 'title': 'French language variations', 'father': '44'}
,{ 'name': '448', 'title': 'Standard French usage', 'father': '44'}
,{ 'name': '449', 'title': 'Occitan & Catalan', 'father': '44'}
,{ 'name': '450', 'title': 'Italian, Romanian & related languages', 'father': '45'}
,{ 'name': '451', 'title': 'Italian writing systems & phonology', 'father': '45'}
,{ 'name': '452', 'title': 'Italian etymology', 'father': '45'}
,{ 'name': '453', 'title': 'Italian dictionaries', 'father': '45'}
,{ 'name': '454', 'title': '[Unassigned]', 'father': '45'}
,{ 'name': '455', 'title': 'Italian grammar', 'father': '45'}
,{ 'name': '456', 'title': '[Unassigned]', 'father': '45'}
,{ 'name': '457', 'title': 'Italian language variations', 'father': '45'}
,{ 'name': '458', 'title': 'Standard Italian usage', 'father': '45'}
,{ 'name': '459', 'title': 'Romanian & related languages', 'father': '45'}
,{ 'name': '460', 'title': 'Spanish & Portuguese languages', 'father': '46'}
,{ 'name': '461', 'title': 'Spanish writing systems & phonology', 'father': '46'}
,{ 'name': '462', 'title': 'Spanish etymology', 'father': '46'}
,{ 'name': '463', 'title': 'Spanish dictionaries', 'father': '46'}
,{ 'name': '464', 'title': '[Unassigned]', 'father': '46'}
,{ 'name': '465', 'title': 'Spanish grammar', 'father': '46'}
,{ 'name': '466', 'title': '[Unassigned]', 'father': '46'}
,{ 'name': '467', 'title': 'Spanish language variations', 'father': '46'}
,{ 'name': '468', 'title': 'Standard Spanish usage', 'father': '46'}
,{ 'name': '469', 'title': 'Portuguese', 'father': '46'}
,{ 'name': '470', 'title': 'Italic languages; Latin', 'father': '47'}
,{ 'name': '471', 'title': 'Classical Latin writing & phonology', 'father': '47'}
,{ 'name': '472', 'title': 'Classical Latin etymology', 'father': '47'}
,{ 'name': '473', 'title': 'Classical Latin dictionaries', 'father': '47'}
,{ 'name': '474', 'title': '[Unassigned]', 'father': '47'}
,{ 'name': '475', 'title': 'Classical Latin grammar', 'father': '47'}
,{ 'name': '476', 'title': '[Unassigned]', 'father': '47'}
,{ 'name': '477', 'title': 'Old, postclassical & Vulgar Latin', 'father': '47'}
,{ 'name': '478', 'title': 'Classical Latin usage', 'father': '47'}
,{ 'name': '479', 'title': 'Other Italic languages', 'father': '47'}
,{ 'name': '480', 'title': 'Hellenic languages; classical Greek', 'father': '48'}
,{ 'name': '481', 'title': 'Classical Greek writing & phonology', 'father': '48'}
,{ 'name': '482', 'title': 'Classical Greek etymology', 'father': '48'}
,{ 'name': '483', 'title': 'Classical Greek dictionaries', 'father': '48'}
,{ 'name': '484', 'title': '[Unassigned]', 'father': '48'}
,{ 'name': '485', 'title': 'Classical Greek grammar', 'father': '48'}
,{ 'name': '486', 'title': '[Unassigned]', 'father': '48'}
,{ 'name': '487', 'title': 'Preclassical & postclassical Greek', 'father': '48'}
,{ 'name': '488', 'title': 'Classical Greek usage', 'father': '48'}
,{ 'name': '489', 'title': 'Other Hellenic languages', 'father': '48'}
,{ 'name': '490', 'title': 'Other languages', 'father': '49'}
,{ 'name': '491', 'title': 'East Indo-European & Celtic languages', 'father': '49'}
,{ 'name': '492', 'title': 'Afro-Asiatic languages; Semitic languages', 'father': '49'}
,{ 'name': '493', 'title': 'Non-Semitic Afro-Asiatic languages', 'father': '49'}
,{ 'name': '494', 'title': 'Altaic, Uralic, Hyperborean & Dravidian', 'father': '49'}
,{ 'name': '495', 'title': 'Languages of East & Southeast Asia', 'father': '49'}
,{ 'name': '496', 'title': 'African languages', 'father': '49'}
,{ 'name': '497', 'title': 'North American native languages', 'father': '49'}
,{ 'name': '498', 'title': 'South American native languages', 'father': '49'}
,{ 'name': '499', 'title': 'Austronesian & other languages', 'father': '49'}
,{ 'name': '500', 'title': 'Natural sciences & mathematics', 'father': '50'}
,{ 'name': '501', 'title': 'Philosophy & theory', 'father': '50'}
,{ 'name': '502', 'title': 'Miscellany', 'father': '50'}
,{ 'name': '503', 'title': 'Dictionaries & encyclopedias', 'father': '50'}
,{ 'name': '504', 'title': '[Unassigned]', 'father': '50'}
,{ 'name': '505', 'title': 'Serial publications', 'father': '50'}
,{ 'name': '506', 'title': 'Organizations & management', 'father': '50'}
,{ 'name': '507', 'title': 'Education, research & related topics', 'father': '50'}
,{ 'name': '508', 'title': 'Natural history', 'father': '50'}
,{ 'name': '509', 'title': 'Historical, geographic & persons treatment', 'father': '50'}
,{ 'name': '510', 'title': 'Mathematics', 'father': '51'}
,{ 'name': '511', 'title': 'General principles of mathematics', 'father': '51'}
,{ 'name': '512', 'title': 'Algebra', 'father': '51'}
,{ 'name': '513', 'title': 'Arithmetic', 'father': '51'}
,{ 'name': '514', 'title': 'Topology', 'father': '51'}
,{ 'name': '515', 'title': 'Analysis', 'father': '51'}
,{ 'name': '516', 'title': 'Geometry', 'father': '51'}
,{ 'name': '517', 'title': '[Unassigned]', 'father': '51'}
,{ 'name': '518', 'title': 'Numerical analysis', 'father': '51'}
,{ 'name': '519', 'title': 'Probabilities & applied mathematics', 'father': '51'}
,{ 'name': '520', 'title': 'Astronomy & allied sciences', 'father': '52'}
,{ 'name': '521', 'title': 'Celestial mechanics', 'father': '52'}
,{ 'name': '522', 'title': 'Techniques, equipment & materials', 'father': '52'}
,{ 'name': '523', 'title': 'Specific celestial bodies & phenomena', 'father': '52'}
,{ 'name': '524', 'title': '[Unassigned]', 'father': '52'}
,{ 'name': '525', 'title': 'Earth (Astronomical geography)', 'father': '52'}
,{ 'name': '526', 'title': 'Mathematical geography', 'father': '52'}
,{ 'name': '527', 'title': 'Celestial navigation', 'father': '52'}
,{ 'name': '528', 'title': 'Ephemerides', 'father': '52'}
,{ 'name': '529', 'title': 'Chronology', 'father': '52'}
,{ 'name': '530', 'title': 'Physics', 'father': '53'}
,{ 'name': '531', 'title': 'Classical mechanics; solid mechanics', 'father': '53'}
,{ 'name': '532', 'title': 'Fluid mechanics; liquid mechanics', 'father': '53'}
,{ 'name': '533', 'title': 'Gas mechanics', 'father': '53'}
,{ 'name': '534', 'title': 'Sound & related vibrations', 'father': '53'}
,{ 'name': '535', 'title': 'Light & infrared & ultraviolet phenomena', 'father': '53'}
,{ 'name': '536', 'title': 'Heat', 'father': '53'}
,{ 'name': '537', 'title': 'Electricity & electronics', 'father': '53'}
,{ 'name': '538', 'title': 'Magnetism', 'father': '53'}
,{ 'name': '539', 'title': 'Modern physics', 'father': '53'}
,{ 'name': '540', 'title': 'Chemistry & allied sciences', 'father': '54'}
,{ 'name': '541', 'title': 'Physical chemistry', 'father': '54'}
,{ 'name': '542', 'title': 'Techniques, equipment & materials', 'father': '54'}
,{ 'name': '543', 'title': 'Analytical chemistry', 'father': '54'}
,{ 'name': '544', 'title': '[Unassigned]', 'father': '54'}
,{ 'name': '545', 'title': '[Unassigned]', 'father': '54'}
,{ 'name': '546', 'title': 'Inorganic chemistry', 'father': '54'}
,{ 'name': '547', 'title': 'Organic chemistry', 'father': '54'}
,{ 'name': '548', 'title': 'Crystallography', 'father': '54'}
,{ 'name': '549', 'title': 'Mineralogy', 'father': '54'}
,{ 'name': '550', 'title': 'Earth sciences', 'father': '55'}
,{ 'name': '551', 'title': 'Geology, hydrology & meteorology', 'father': '55'}
,{ 'name': '552', 'title': 'Petrology', 'father': '55'}
,{ 'name': '553', 'title': 'Economic geology', 'father': '55'}
,{ 'name': '554', 'title': 'Earth sciences of Europe', 'father': '55'}
,{ 'name': '555', 'title': 'Earth sciences of Asia', 'father': '55'}
,{ 'name': '556', 'title': 'Earth sciences of Africa', 'father': '55'}
,{ 'name': '557', 'title': 'Earth sciences of North America', 'father': '55'}
,{ 'name': '558', 'title': 'Earth sciences of South America', 'father': '55'}
,{ 'name': '559', 'title': 'Earth sciences of other areas', 'father': '55'}
,{ 'name': '560', 'title': 'Paleontology; paleozoology', 'father': '56'}
,{ 'name': '561', 'title': 'Paleobotany; fossil microorganisms', 'father': '56'}
,{ 'name': '562', 'title': 'Fossil invertebrates', 'father': '56'}
,{ 'name': '563', 'title': 'Fossil marine & seashore invertebrates', 'father': '56'}
,{ 'name': '564', 'title': 'Fossil mollusks & molluscoids', 'father': '56'}
,{ 'name': '565', 'title': 'Fossil arthropods', 'father': '56'}
,{ 'name': '566', 'title': 'Fossil chordates', 'father': '56'}
,{ 'name': '567', 'title': 'Fossil cold-blooded vertebrates; fossil fishes', 'father': '56'}
,{ 'name': '568', 'title': 'Fossil birds', 'father': '56'}
,{ 'name': '569', 'title': 'Fossil mammals', 'father': '56'}
,{ 'name': '570', 'title': 'Life sciences; biology', 'father': '57'}
,{ 'name': '571', 'title': 'Physiology & related subjects', 'father': '57'}
,{ 'name': '572', 'title': 'Biochemistry', 'father': '57'}
,{ 'name': '573', 'title': 'Specific physiological systems in animals', 'father': '57'}
,{ 'name': '574', 'title': '[Unassigned]', 'father': '57'}
,{ 'name': '575', 'title': 'Specific parts of & systems in plants', 'father': '57'}
,{ 'name': '576', 'title': 'Genetics & evolution', 'father': '57'}
,{ 'name': '577', 'title': 'Ecology', 'father': '57'}
,{ 'name': '578', 'title': 'Natural history of organisms', 'father': '57'}
,{ 'name': '579', 'title': 'Microorganisms, fungi & algae', 'father': '57'}
,{ 'name': '580', 'title': 'Plants (Botany)', 'father': '58'}
,{ 'name': '581', 'title': 'Specific topics in natural history', 'father': '58'}
,{ 'name': '582', 'title': 'Plants noted for characteristics & flowers', 'father': '58'}
,{ 'name': '583', 'title': 'Dicotyledons', 'father': '58'}
,{ 'name': '584', 'title': 'Monocotyledons', 'father': '58'}
,{ 'name': '585', 'title': 'Gymnosperms; conifers', 'father': '58'}
,{ 'name': '586', 'title': 'Seedless plants', 'father': '58'}
,{ 'name': '587', 'title': 'Vascular seedless plants', 'father': '58'}
,{ 'name': '588', 'title': 'Bryophytes', 'father': '58'}
,{ 'name': '589', 'title': '[Unassigned]', 'father': '58'}
,{ 'name': '590', 'title': 'Animals (Zoology)', 'father': '59'}
,{ 'name': '591', 'title': 'Specific topics in natural history', 'father': '59'}
,{ 'name': '592', 'title': 'Invertebrates', 'father': '59'}
,{ 'name': '593', 'title': 'Marine & seashore invertebrates', 'father': '59'}
,{ 'name': '594', 'title': 'Mollusks & molluscoids', 'father': '59'}
,{ 'name': '595', 'title': 'Arthropods', 'father': '59'}
,{ 'name': '596', 'title': 'Chordates', 'father': '59'}
,{ 'name': '597', 'title': 'Cold-blooded vertebrates; fishes', 'father': '59'}
,{ 'name': '598', 'title': 'Birds', 'father': '59'}
,{ 'name': '599', 'title': 'Mammals', 'father': '59'}
,{ 'name': '600', 'title': 'Technology', 'father': '60'}
,{ 'name': '601', 'title': 'Philosophy & theory', 'father': '60'}
,{ 'name': '602', 'title': 'Miscellany', 'father': '60'}
,{ 'name': '603', 'title': 'Dictionaries & encyclopedias', 'father': '60'}
,{ 'name': '604', 'title': 'Special topics', 'father': '60'}
,{ 'name': '605', 'title': 'Serial publications', 'father': '60'}
,{ 'name': '606', 'title': 'Organizations', 'father': '60'}
,{ 'name': '607', 'title': 'Education, research & related topics', 'father': '60'}
,{ 'name': '608', 'title': 'Inventions & patents', 'father': '60'}
,{ 'name': '609', 'title': 'Historical, geographic & persons treatment', 'father': '60'}
,{ 'name': '610', 'title': 'Medicine & health', 'father': '61'}
,{ 'name': '611', 'title': 'Human anatomy, cytology & histology', 'father': '61'}
,{ 'name': '612', 'title': 'Human physiology', 'father': '61'}
,{ 'name': '613', 'title': 'Personal health & safety', 'father': '61'}
,{ 'name': '614', 'title': 'Incidence & prevention of disease', 'father': '61'}
,{ 'name': '615', 'title': 'Pharmacology & therapeutics', 'father': '61'}
,{ 'name': '616', 'title': 'Diseases', 'father': '61'}
,{ 'name': '617', 'title': 'Surgery & related medical specialties', 'father': '61'}
,{ 'name': '618', 'title': 'Gynecology, obstetrics, pediatrics & geriatrics', 'father': '61'}
,{ 'name': '619', 'title': '[Unassigned]', 'father': '61'}
,{ 'name': '620', 'title': 'Engineering & allied operations', 'father': '62'}
,{ 'name': '621', 'title': 'Applied physics', 'father': '62'}
,{ 'name': '622', 'title': 'Mining & related operations', 'father': '62'}
,{ 'name': '623', 'title': 'Military & nautical engineering', 'father': '62'}
,{ 'name': '624', 'title': 'Civil engineering', 'father': '62'}
,{ 'name': '625', 'title': 'Engineering of railroads & roads', 'father': '62'}
,{ 'name': '626', 'title': '[Unassigned]', 'father': '62'}
,{ 'name': '627', 'title': 'Hydraulic engineering', 'father': '62'}
,{ 'name': '628', 'title': 'Sanitary & municipal engineering', 'father': '62'}
,{ 'name': '629', 'title': 'Other branches of engineering', 'father': '62'}
,{ 'name': '630', 'title': 'Agriculture & related technologies', 'father': '63'}
,{ 'name': '631', 'title': 'Techniques, equipment & materials', 'father': '63'}
,{ 'name': '632', 'title': 'Plant injuries, diseases & pests', 'father': '63'}
,{ 'name': '633', 'title': 'Field & plantation crops', 'father': '63'}
,{ 'name': '634', 'title': 'Orchards, fruits & forestry', 'father': '63'}
,{ 'name': '635', 'title': 'Garden crops (Horticulture)', 'father': '63'}
,{ 'name': '636', 'title': 'Animal husbandry', 'father': '63'}
,{ 'name': '637', 'title': 'Processing dairy & related products', 'father': '63'}
,{ 'name': '638', 'title': 'Insect culture', 'father': '63'}
,{ 'name': '639', 'title': 'Hunting, fishing & conservation', 'father': '63'}
,{ 'name': '640', 'title': 'Home & family management', 'father': '64'}
,{ 'name': '641', 'title': 'Food & drink', 'father': '64'}
,{ 'name': '642', 'title': 'Meals & table service', 'father': '64'}
,{ 'name': '643', 'title': 'Housing & household equipment', 'father': '64'}
,{ 'name': '644', 'title': 'Household utilities', 'father': '64'}
,{ 'name': '645', 'title': 'Household furnishings', 'father': '64'}
,{ 'name': '646', 'title': 'Sewing, clothing & personal living', 'father': '64'}
,{ 'name': '647', 'title': 'Management of public households', 'father': '64'}
,{ 'name': '648', 'title': 'Housekeeping', 'father': '64'}
,{ 'name': '649', 'title': 'Child rearing & home care of persons', 'father': '64'}
,{ 'name': '650', 'title': 'Management & auxiliary services', 'father': '65'}
,{ 'name': '651', 'title': 'Office services', 'father': '65'}
,{ 'name': '652', 'title': 'Processes of written communication', 'father': '65'}
,{ 'name': '653', 'title': 'Shorthand', 'father': '65'}
,{ 'name': '654', 'title': '[Unassigned]', 'father': '65'}
,{ 'name': '655', 'title': '[Unassigned]', 'father': '65'}
,{ 'name': '656', 'title': '[Unassigned]', 'father': '65'}
,{ 'name': '657', 'title': 'Accounting', 'father': '65'}
,{ 'name': '658', 'title': 'General management', 'father': '65'}
,{ 'name': '659', 'title': 'Advertising & public relations', 'father': '65'}
,{ 'name': '660', 'title': 'Chemical engineering', 'father': '66'}
,{ 'name': '661', 'title': 'Industrial chemicals', 'father': '66'}
,{ 'name': '662', 'title': 'Explosives, fuels & related products', 'father': '66'}
,{ 'name': '663', 'title': 'Beverage technology', 'father': '66'}
,{ 'name': '664', 'title': 'Food technology', 'father': '66'}
,{ 'name': '665', 'title': 'Industrial oils, fats, waxes & gases', 'father': '66'}
,{ 'name': '666', 'title': 'Ceramic & allied technologies', 'father': '66'}
,{ 'name': '667', 'title': 'Cleaning, color & coating technologies', 'father': '66'}
,{ 'name': '668', 'title': 'Technology of other organic products', 'father': '66'}
,{ 'name': '669', 'title': 'Metallurgy', 'father': '66'}
,{ 'name': '670', 'title': 'Manufacturing', 'father': '67'}
,{ 'name': '671', 'title': 'Metalworking & primary metal products', 'father': '67'}
,{ 'name': '672', 'title': 'Iron, steel & other iron alloys', 'father': '67'}
,{ 'name': '673', 'title': 'Nonferrous metals', 'father': '67'}
,{ 'name': '674', 'title': 'Lumber processing, wood products & cork', 'father': '67'}
,{ 'name': '675', 'title': 'Leather & fur processing', 'father': '67'}
,{ 'name': '676', 'title': 'Pulp & paper technology', 'father': '67'}
,{ 'name': '677', 'title': 'Textiles', 'father': '67'}
,{ 'name': '678', 'title': 'Elastomers & elastomer products', 'father': '67'}
,{ 'name': '679', 'title': 'Other products of specific materials', 'father': '67'}
,{ 'name': '680', 'title': 'Manufacture for specific uses', 'father': '68'}
,{ 'name': '681', 'title': 'Precision instruments & other devices', 'father': '68'}
,{ 'name': '682', 'title': 'Small forge work (Blacksmithing)', 'father': '68'}
,{ 'name': '683', 'title': 'Hardware & household appliances', 'father': '68'}
,{ 'name': '684', 'title': 'Furnishings & home workshops', 'father': '68'}
,{ 'name': '685', 'title': 'Leather, fur goods & related products', 'father': '68'}
,{ 'name': '686', 'title': 'Printing & related activities', 'father': '68'}
,{ 'name': '687', 'title': 'Clothing & accessories', 'father': '68'}
,{ 'name': '688', 'title': 'Other final products & packaging', 'father': '68'}
,{ 'name': '689', 'title': '[Unassigned]', 'father': '68'}
,{ 'name': '690', 'title': 'Buildings', 'father': '69'}
,{ 'name': '691', 'title': 'Building materials', 'father': '69'}
,{ 'name': '692', 'title': 'Auxiliary construction practices', 'father': '69'}
,{ 'name': '693', 'title': 'Specific materials & purposes', 'father': '69'}
,{ 'name': '694', 'title': 'Wood construction & carpentry', 'father': '69'}
,{ 'name': '695', 'title': 'Roof covering', 'father': '69'}
,{ 'name': '696', 'title': 'Utilities', 'father': '69'}
,{ 'name': '697', 'title': 'Heating, ventilating & air-conditioning', 'father': '69'}
,{ 'name': '698', 'title': 'Detail finishing', 'father': '69'}
,{ 'name': '699', 'title': '[Unassigned]', 'father': '69'}
,{ 'name': '700', 'title': 'The arts; fine & decorative arts', 'father': '70'}
,{ 'name': '701', 'title': 'Philosophy of fine & decorative arts', 'father': '70'}
,{ 'name': '702', 'title': 'Miscellany of fine & decorative arts', 'father': '70'}
,{ 'name': '703', 'title': 'Dictionaries of fine & decorative arts', 'father': '70'}
,{ 'name': '704', 'title': 'Special topics in fine & decorative arts', 'father': '70'}
,{ 'name': '705', 'title': 'Serial publications of fine & decorative arts', 'father': '70'}
,{ 'name': '706', 'title': 'Organizations & management', 'father': '70'}
,{ 'name': '707', 'title': 'Education, research & related topics', 'father': '70'}
,{ 'name': '708', 'title': 'Galleries, museums & private collections', 'father': '70'}
,{ 'name': '709', 'title': 'Historical, geographic & persons treatment', 'father': '70'}
,{ 'name': '710', 'title': 'Civic & landscape art', 'father': '71'}
,{ 'name': '711', 'title': 'Area planning', 'father': '71'}
,{ 'name': '712', 'title': 'Landscape architecture', 'father': '71'}
,{ 'name': '713', 'title': 'Landscape architecture of trafficways', 'father': '71'}
,{ 'name': '714', 'title': 'Water features', 'father': '71'}
,{ 'name': '715', 'title': 'Woody plants', 'father': '71'}
,{ 'name': '716', 'title': 'Herbaceous plants', 'father': '71'}
,{ 'name': '717', 'title': 'Structures in landscape architecture', 'father': '71'}
,{ 'name': '718', 'title': 'Landscape design of cemeteries', 'father': '71'}
,{ 'name': '719', 'title': 'Natural landscapes', 'father': '71'}
,{ 'name': '720', 'title': 'Architecture', 'father': '72'}
,{ 'name': '721', 'title': 'Architectural structure', 'father': '72'}
,{ 'name': '722', 'title': 'Architecture to ca. 300', 'father': '72'}
,{ 'name': '723', 'title': 'Architecture from ca. 300 to 1399', 'father': '72'}
,{ 'name': '724', 'title': 'Architecture from 1400', 'father': '72'}
,{ 'name': '725', 'title': 'Public structures', 'father': '72'}
,{ 'name': '726', 'title': 'Buildings for religious purposes', 'father': '72'}
,{ 'name': '727', 'title': 'Buildings for education & research', 'father': '72'}
,{ 'name': '728', 'title': 'Residential & related buildings', 'father': '72'}
,{ 'name': '729', 'title': 'Design & decoration', 'father': '72'}
,{ 'name': '730', 'title': 'Plastic arts; sculpture', 'father': '73'}
,{ 'name': '731', 'title': 'Processes, forms & subjects of sculpture', 'father': '73'}
,{ 'name': '732', 'title': 'Sculpture to ca. 500', 'father': '73'}
,{ 'name': '733', 'title': 'Greek, Etruscan & Roman sculpture', 'father': '73'}
,{ 'name': '734', 'title': 'Sculpture from ca. 500 to 1399', 'father': '73'}
,{ 'name': '735', 'title': 'Sculpture from 1400', 'father': '73'}
,{ 'name': '736', 'title': 'Carving & carvings', 'father': '73'}
,{ 'name': '737', 'title': 'Numismatics & sigillography', 'father': '73'}
,{ 'name': '738', 'title': 'Ceramic arts', 'father': '73'}
,{ 'name': '739', 'title': 'Art metalwork', 'father': '73'}
,{ 'name': '740', 'title': 'Drawing & decorative arts', 'father': '74'}
,{ 'name': '741', 'title': 'Drawing & drawings', 'father': '74'}
,{ 'name': '742', 'title': 'Perspective', 'father': '74'}
,{ 'name': '743', 'title': 'Drawing & drawings by subject', 'father': '74'}
,{ 'name': '744', 'title': '[Unassigned]', 'father': '74'}
,{ 'name': '745', 'title': 'Decorative arts', 'father': '74'}
,{ 'name': '746', 'title': 'Textile arts', 'father': '74'}
,{ 'name': '747', 'title': 'Interior decoration', 'father': '74'}
,{ 'name': '748', 'title': 'Glass', 'father': '74'}
,{ 'name': '749', 'title': 'Furniture & accessories', 'father': '74'}
,{ 'name': '750', 'title': 'Painting & paintings', 'father': '75'}
,{ 'name': '751', 'title': 'Techniques, equipment, materials & forms', 'father': '75'}
,{ 'name': '752', 'title': 'Color', 'father': '75'}
,{ 'name': '753', 'title': 'Symbolism, allegory, mythology & legend', 'father': '75'}
,{ 'name': '754', 'title': 'Genre paintings', 'father': '75'}
,{ 'name': '755', 'title': 'Religion', 'father': '75'}
,{ 'name': '756', 'title': '[Unassigned]', 'father': '75'}
,{ 'name': '757', 'title': 'Human figures', 'father': '75'}
,{ 'name': '758', 'title': 'Other subjects', 'father': '75'}
,{ 'name': '759', 'title': 'Historical, geographic & persons treatment', 'father': '75'}
,{ 'name': '760', 'title': 'Graphic arts; printmaking & prints', 'father': '76'}
,{ 'name': '761', 'title': 'Relief processes (Block printing)', 'father': '76'}
,{ 'name': '762', 'title': '[Unassigned]', 'father': '76'}
,{ 'name': '763', 'title': 'Lithographic processes', 'father': '76'}
,{ 'name': '764', 'title': 'Chromolithography & serigraphy', 'father': '76'}
,{ 'name': '765', 'title': 'Metal engraving', 'father': '76'}
,{ 'name': '766', 'title': 'Mezzotinting, aquatinting & related processes', 'father': '76'}
,{ 'name': '767', 'title': 'Etching & drypoint', 'father': '76'}
,{ 'name': '768', 'title': '[Unassigned]', 'father': '76'}
,{ 'name': '769', 'title': 'Prints', 'father': '76'}
,{ 'name': '770', 'title': 'Photography, photographs & computer art', 'father': '77'}
,{ 'name': '771', 'title': 'Techniques, equipment & materials', 'father': '77'}
,{ 'name': '772', 'title': 'Metallic salt processes', 'father': '77'}
,{ 'name': '773', 'title': 'Pigment processes of printing', 'father': '77'}
,{ 'name': '774', 'title': 'Holography', 'father': '77'}
,{ 'name': '775', 'title': 'Digital photography', 'father': '77'}
,{ 'name': '776', 'title': 'Computer art (Digital art)', 'father': '77'}
,{ 'name': '777', 'title': '[Unassigned]', 'father': '77'}
,{ 'name': '778', 'title': 'Fields & kinds of photography', 'father': '77'}
,{ 'name': '779', 'title': 'Photographs', 'father': '77'}
,{ 'name': '780', 'title': 'Music', 'father': '78'}
,{ 'name': '781', 'title': 'General principles & musical forms', 'father': '78'}
,{ 'name': '782', 'title': 'Vocal music', 'father': '78'}
,{ 'name': '783', 'title': 'Music for single voices; the voice', 'father': '78'}
,{ 'name': '784', 'title': 'Instruments & instrumental ensembles', 'father': '78'}
,{ 'name': '785', 'title': 'Ensembles with one instrument per part', 'father': '78'}
,{ 'name': '786', 'title': 'Keyboard & other instruments', 'father': '78'}
,{ 'name': '787', 'title': 'Stringed instruments', 'father': '78'}
,{ 'name': '788', 'title': 'Wind instruments', 'father': '78'}
,{ 'name': '789', 'title': '(Optional number)', 'father': '78'}
,{ 'name': '790', 'title': 'Recreational & performing arts', 'father': '79'}
,{ 'name': '791', 'title': 'Public performances', 'father': '79'}
,{ 'name': '792', 'title': 'Stage presentations', 'father': '79'}
,{ 'name': '793', 'title': 'Indoor games & amusements', 'father': '79'}
,{ 'name': '794', 'title': 'Indoor games of skill', 'father': '79'}
,{ 'name': '795', 'title': 'Games of chance', 'father': '79'}
,{ 'name': '796', 'title': 'Athletic & outdoor sports & games', 'father': '79'}
,{ 'name': '797', 'title': 'Aquatic & air sports', 'father': '79'}
,{ 'name': '798', 'title': 'Equestrian sports & animal racing', 'father': '79'}
,{ 'name': '799', 'title': 'Fishing, hunting & shooting', 'father': '79'}
,{ 'name': '800', 'title': 'Literature & rhetoric', 'father': '80'}
,{ 'name': '801', 'title': 'Philosophy & theory', 'father': '80'}
,{ 'name': '802', 'title': 'Miscellany', 'father': '80'}
,{ 'name': '803', 'title': 'Dictionaries & encyclopedias', 'father': '80'}
,{ 'name': '804', 'title': '[Unassigned]', 'father': '80'}
,{ 'name': '805', 'title': 'Serial publications', 'father': '80'}
,{ 'name': '806', 'title': 'Organizations & management', 'father': '80'}
,{ 'name': '807', 'title': 'Education, research & related topics', 'father': '80'}
,{ 'name': '808', 'title': 'Rhetoric & collections of literature', 'father': '80'}
,{ 'name': '809', 'title': 'History, description & criticism', 'father': '80'}
,{ 'name': '810', 'title': 'American literature in English', 'father': '81'}
,{ 'name': '811', 'title': 'American poetry in English', 'father': '81'}
,{ 'name': '812', 'title': 'American drama in English', 'father': '81'}
,{ 'name': '813', 'title': 'American fiction in English', 'father': '81'}
,{ 'name': '814', 'title': 'American essays in English', 'father': '81'}
,{ 'name': '815', 'title': 'American speeches in English', 'father': '81'}
,{ 'name': '816', 'title': 'American letters in English', 'father': '81'}
,{ 'name': '817', 'title': 'American humor & satire in English', 'father': '81'}
,{ 'name': '818', 'title': 'American miscellaneous writings', 'father': '81'}
,{ 'name': '819', 'title': '(Optional number)', 'father': '81'}
,{ 'name': '820', 'title': 'English & Old English literatures', 'father': '82'}
,{ 'name': '821', 'title': 'English poetry', 'father': '82'}
,{ 'name': '822', 'title': 'English drama', 'father': '82'}
,{ 'name': '823', 'title': 'English fiction', 'father': '82'}
,{ 'name': '824', 'title': 'English essays', 'father': '82'}
,{ 'name': '825', 'title': 'English speeches', 'father': '82'}
,{ 'name': '826', 'title': 'English letters', 'father': '82'}
,{ 'name': '827', 'title': 'English humor & satire', 'father': '82'}
,{ 'name': '828', 'title': 'English miscellaneous writings', 'father': '82'}
,{ 'name': '829', 'title': 'Old English (Anglo-Saxon)', 'father': '82'}
,{ 'name': '830', 'title': 'Literatures of Germanic languages', 'father': '83'}
,{ 'name': '831', 'title': 'German poetry', 'father': '83'}
,{ 'name': '832', 'title': 'German drama', 'father': '83'}
,{ 'name': '833', 'title': 'German fiction', 'father': '83'}
,{ 'name': '834', 'title': 'German essays', 'father': '83'}
,{ 'name': '835', 'title': 'German speeches', 'father': '83'}
,{ 'name': '836', 'title': 'German letters', 'father': '83'}
,{ 'name': '837', 'title': 'German humor & satire', 'father': '83'}
,{ 'name': '838', 'title': 'German miscellaneous writings', 'father': '83'}
,{ 'name': '839', 'title': 'Other Germanic literatures', 'father': '83'}
,{ 'name': '840', 'title': 'Literatures of Romance languages', 'father': '84'}
,{ 'name': '841', 'title': 'French poetry', 'father': '84'}
,{ 'name': '842', 'title': 'French drama', 'father': '84'}
,{ 'name': '843', 'title': 'French fiction', 'father': '84'}
,{ 'name': '844', 'title': 'French essays', 'father': '84'}
,{ 'name': '845', 'title': 'French speeches', 'father': '84'}
,{ 'name': '846', 'title': 'French letters', 'father': '84'}
,{ 'name': '847', 'title': 'French humor & satire', 'father': '84'}
,{ 'name': '848', 'title': 'French miscellaneous writings', 'father': '84'}
,{ 'name': '849', 'title': 'Occitan & Catalan literatures', 'father': '84'}
,{ 'name': '850', 'title': 'Italian, Romanian & related literatures', 'father': '85'}
,{ 'name': '851', 'title': 'Italian poetry', 'father': '85'}
,{ 'name': '852', 'title': 'Italian drama', 'father': '85'}
,{ 'name': '853', 'title': 'Italian fiction', 'father': '85'}
,{ 'name': '854', 'title': 'Italian essays', 'father': '85'}
,{ 'name': '855', 'title': 'Italian speeches', 'father': '85'}
,{ 'name': '856', 'title': 'Italian letters', 'father': '85'}
,{ 'name': '857', 'title': 'Italian humor & satire', 'father': '85'}
,{ 'name': '858', 'title': 'Italian miscellaneous writings', 'father': '85'}
,{ 'name': '859', 'title': 'Romanian & related literatures', 'father': '85'}
,{ 'name': '860', 'title': 'Spanish & Portuguese literatures', 'father': '86'}
,{ 'name': '861', 'title': 'Spanish poetry', 'father': '86'}
,{ 'name': '862', 'title': 'Spanish drama', 'father': '86'}
,{ 'name': '863', 'title': 'Spanish fiction', 'father': '86'}
,{ 'name': '864', 'title': 'Spanish essays', 'father': '86'}
,{ 'name': '865', 'title': 'Spanish speeches', 'father': '86'}
,{ 'name': '866', 'title': 'Spanish letters', 'father': '86'}
,{ 'name': '867', 'title': 'Spanish humor & satire', 'father': '86'}
,{ 'name': '868', 'title': 'Spanish miscellaneous writings', 'father': '86'}
,{ 'name': '869', 'title': 'Portuguese literature', 'father': '86'}
,{ 'name': '870', 'title': 'Italic literatures; Latin literature', 'father': '87'}
,{ 'name': '871', 'title': 'Latin poetry', 'father': '87'}
,{ 'name': '872', 'title': 'Latin dramatic poetry & drama', 'father': '87'}
,{ 'name': '873', 'title': 'Latin epic poetry & fiction', 'father': '87'}
,{ 'name': '874', 'title': 'Latin lyric poetry', 'father': '87'}
,{ 'name': '875', 'title': 'Latin speeches', 'father': '87'}
,{ 'name': '876', 'title': 'Latin letters', 'father': '87'}
,{ 'name': '877', 'title': 'Latin humor & satire', 'father': '87'}
,{ 'name': '878', 'title': 'Latin miscellaneous writings', 'father': '87'}
,{ 'name': '879', 'title': 'Literatures of other Italic languages', 'father': '87'}
,{ 'name': '880', 'title': 'Hellenic literatures; classical Greek', 'father': '88'}
,{ 'name': '881', 'title': 'Classical Greek poetry', 'father': '88'}
,{ 'name': '882', 'title': 'Classical Greek dramatic poetry & drama', 'father': '88'}
,{ 'name': '883', 'title': 'Classical Greek epic poetry & fiction', 'father': '88'}
,{ 'name': '884', 'title': 'Classical Greek lyric poetry', 'father': '88'}
,{ 'name': '885', 'title': 'Classical Greek speeches', 'father': '88'}
,{ 'name': '886', 'title': 'Classical Greek letters', 'father': '88'}
,{ 'name': '887', 'title': 'Classical Greek humor & satire', 'father': '88'}
,{ 'name': '888', 'title': 'Classical Greek miscellaneous writings', 'father': '88'}
,{ 'name': '889', 'title': 'Modern Greek literature', 'father': '88'}
,{ 'name': '890', 'title': 'Literatures of other languages', 'father': '89'}
,{ 'name': '891', 'title': 'East Indo-European & Celtic literatures', 'father': '89'}
,{ 'name': '892', 'title': 'Afro-Asiatic literatures; Semitic literatures', 'father': '89'}
,{ 'name': '893', 'title': 'Non-Semitic Afro-Asiatic literatures', 'father': '89'}
,{ 'name': '894', 'title': 'Altaic, Uralic, Hyperborean & Dravidian', 'father': '89'}
,{ 'name': '895', 'title': 'Literatures of East & Southeast Asia', 'father': '89'}
,{ 'name': '896', 'title': 'African literatures', 'father': '89'}
,{ 'name': '897', 'title': 'North American native literatures', 'father': '89'}
,{ 'name': '898', 'title': 'South American native literatures', 'father': '89'}
,{ 'name': '899', 'title': 'Austronesian & other literatures', 'father': '89'}
,{ 'name': '900', 'title': 'History & geography', 'father': '90'}
,{ 'name': '901', 'title': 'Philosophy & theory', 'father': '90'}
,{ 'name': '902', 'title': 'Miscellany', 'father': '90'}
,{ 'name': '903', 'title': 'Dictionaries & encyclopedias', 'father': '90'}
,{ 'name': '904', 'title': 'Collected accounts of events', 'father': '90'}
,{ 'name': '905', 'title': 'Serial publications', 'father': '90'}
,{ 'name': '906', 'title': 'Organizations & management', 'father': '90'}
,{ 'name': '907', 'title': 'Education, research & related topics', 'father': '90'}
,{ 'name': '908', 'title': 'Kinds of persons treatment', 'father': '90'}
,{ 'name': '909', 'title': 'World history', 'father': '90'}
,{ 'name': '910', 'title': 'Geography & travel', 'father': '91'}
,{ 'name': '911', 'title': 'Historical geography', 'father': '91'}
,{ 'name': '912', 'title': 'Atlases, maps, charts & plans', 'father': '91'}
,{ 'name': '913', 'title': 'Geography of & travel in ancient world', 'father': '91'}
,{ 'name': '914', 'title': 'Geography of & travel in Europe', 'father': '91'}
,{ 'name': '915', 'title': 'Geography of & travel in Asia', 'father': '91'}
,{ 'name': '916', 'title': 'Geography of & travel in Africa', 'father': '91'}
,{ 'name': '917', 'title': 'Geography of & travel in North America', 'father': '91'}
,{ 'name': '918', 'title': 'Geography of & travel in South America', 'father': '91'}
,{ 'name': '919', 'title': 'Geography of & travel in other areas', 'father': '91'}
,{ 'name': '920', 'title': 'Biography, genealogy & insignia', 'father': '92'}
,{ 'name': '921', 'title': '(Optional number)', 'father': '92'}
,{ 'name': '922', 'title': '(Optional number)', 'father': '92'}
,{ 'name': '923', 'title': '(Optional number)', 'father': '92'}
,{ 'name': '924', 'title': '(Optional number)', 'father': '92'}
,{ 'name': '925', 'title': '(Optional number)', 'father': '92'}
,{ 'name': '926', 'title': '(Optional number)', 'father': '92'}
,{ 'name': '927', 'title': '(Optional number)', 'father': '92'}
,{ 'name': '928', 'title': '(Optional number)', 'father': '92'}
,{ 'name': '929', 'title': 'Genealogy, names & insignia', 'father': '92'}
,{ 'name': '930', 'title': 'History of ancient world to ca. 499', 'father': '93'}
,{ 'name': '931', 'title': 'China to 420', 'father': '93'}
,{ 'name': '932', 'title': 'Egypt to 640', 'father': '93'}
,{ 'name': '933', 'title': 'Palestine to 70', 'father': '93'}
,{ 'name': '934', 'title': 'India to 647', 'father': '93'}
,{ 'name': '935', 'title': 'Mesopotamia & Iranian Plateau to 637', 'father': '93'}
,{ 'name': '936', 'title': 'Europe north & west of Italy to ca. 499', 'father': '93'}
,{ 'name': '937', 'title': 'Italy & adjacent territories to 476', 'father': '93'}
,{ 'name': '938', 'title': 'Greece to 323', 'father': '93'}
,{ 'name': '939', 'title': 'Other parts of ancient world to ca. 640', 'father': '93'}
,{ 'name': '940', 'title': 'History of Europe', 'father': '94'}
,{ 'name': '941', 'title': 'British Isles', 'father': '94'}
,{ 'name': '942', 'title': 'England & Wales', 'father': '94'}
,{ 'name': '943', 'title': 'Central Europe; Germany', 'father': '94'}
,{ 'name': '944', 'title': 'France & Monaco', 'father': '94'}
,{ 'name': '945', 'title': 'Italian Peninsula & adjacent islands', 'father': '94'}
,{ 'name': '946', 'title': 'Iberian Peninsula & adjacent islands', 'father': '94'}
,{ 'name': '947', 'title': 'Eastern Europe; Russia', 'father': '94'}
,{ 'name': '948', 'title': 'Scandinavia', 'father': '94'}
,{ 'name': '949', 'title': 'Other parts of Europe', 'father': '94'}
,{ 'name': '950', 'title': 'History of Asia; Far East', 'father': '95'}
,{ 'name': '951', 'title': 'China & adjacent areas', 'father': '95'}
,{ 'name': '952', 'title': 'Japan', 'father': '95'}
,{ 'name': '953', 'title': 'Arabian Peninsula & adjacent areas', 'father': '95'}
,{ 'name': '954', 'title': 'South Asia; India', 'father': '95'}
,{ 'name': '955', 'title': 'Iran', 'father': '95'}
,{ 'name': '956', 'title': 'Middle East (Near East)', 'father': '95'}
,{ 'name': '957', 'title': 'Siberia (Asiatic Russia)', 'father': '95'}
,{ 'name': '958', 'title': 'Central Asia', 'father': '95'}
,{ 'name': '959', 'title': 'Southeast Asia', 'father': '95'}
,{ 'name': '960', 'title': 'History of Africa', 'father': '96'}
,{ 'name': '961', 'title': 'Tunisia & Libya', 'father': '96'}
,{ 'name': '962', 'title': 'Egypt & Sudan', 'father': '96'}
,{ 'name': '963', 'title': 'Ethiopia & Eritrea', 'father': '96'}
,{ 'name': '964', 'title': 'Northwest African coast & offshore islands', 'father': '96'}
,{ 'name': '965', 'title': 'Algeria', 'father': '96'}
,{ 'name': '966', 'title': 'West Africa & offshore islands', 'father': '96'}
,{ 'name': '967', 'title': 'Central Africa & offshore islands', 'father': '96'}
,{ 'name': '968', 'title': 'Southern Africa; Republic of South Africa', 'father': '96'}
,{ 'name': '969', 'title': 'South Indian Ocean islands', 'father': '96'}
,{ 'name': '970', 'title': 'History of North America', 'father': '97'}
,{ 'name': '971', 'title': 'Canada', 'father': '97'}
,{ 'name': '972', 'title': 'Middle America; Mexico', 'father': '97'}
,{ 'name': '973', 'title': 'United States', 'father': '97'}
,{ 'name': '974', 'title': 'Northeastern United States', 'father': '97'}
,{ 'name': '975', 'title': 'Southeastern United States', 'father': '97'}
,{ 'name': '976', 'title': 'South central United States', 'father': '97'}
,{ 'name': '977', 'title': 'North central United States', 'father': '97'}
,{ 'name': '978', 'title': 'Western United States', 'father': '97'}
,{ 'name': '979', 'title': 'Great Basin & Pacific Slope region', 'father': '97'}
,{ 'name': '980', 'title': 'History of South America', 'father': '98'}
,{ 'name': '981', 'title': 'Brazil', 'father': '98'}
,{ 'name': '982', 'title': 'Argentina', 'father': '98'}
,{ 'name': '983', 'title': 'Chile', 'father': '98'}
,{ 'name': '984', 'title': 'Bolivia', 'father': '98'}
,{ 'name': '985', 'title': 'Peru', 'father': '98'}
,{ 'name': '986', 'title': 'Colombia & Ecuador', 'father': '98'}
,{ 'name': '987', 'title': 'Venezuela', 'father': '98'}
,{ 'name': '988', 'title': 'Guiana', 'father': '98'}
,{ 'name': '989', 'title': 'Paraguay & Uruguay', 'father': '98'}
,{ 'name': '990', 'title': 'History of other areas', 'father': '99'}
,{ 'name': '991', 'title': '[Unassigned]', 'father': '99'}
,{ 'name': '992', 'title': '[Unassigned]', 'father': '99'}
,{ 'name': '993', 'title': 'New Zealand', 'father': '99'}
,{ 'name': '994', 'title': 'Australia', 'father': '99'}
,{ 'name': '995', 'title': 'Melanesia; New Guinea', 'father': '99'}
,{ 'name': '996', 'title': 'Other parts of Pacific; Polynesia', 'father': '99'}
,{ 'name': '997', 'title': 'Atlantic Ocean islands', 'father': '99'}
,{ 'name': '998', 'title': 'Arctic islands & Antarctica', 'father': '99'}
,{ 'name': '999', 'title': 'Extraterrestrial worlds', 'father': '99'}
,{ 'name': '000.1', 'title': 'Blah', 'father': '000'}
,{ 'name': '111.1', 'title': 'Blah', 'father': '111'}
,{ 'name': '222.1', 'title': 'Blah', 'father': '222'}
,{ 'name': '333.1', 'title': 'Blah', 'father': '336'}
,{ 'name': '444.1', 'title': 'Blah', 'father': '440'}
,{ 'name': '555.7', 'title': 'Blah', 'father': '550'}
,{ 'name': '666.8', 'title': 'Blah', 'father': '660'}
,{ 'name': '777.1', 'title': 'Blah', 'father': '770'}
,{ 'name': '888.2', 'title': 'Blah', 'father': '880'}];
    
    //// Code to turn data into hierarchical JSON format ////
    var dataMap = data.reduce(function(map, node) {
        map[node.name] = node;
        return map;
    }, {});

    // create the tree array
    var data2 = [];
    data.forEach(function(node) {
        // add to parent
        var father = dataMap[node.father];
        if (father) {
            // create child array if it doesn't exist
            (father.children || (father.children = []))
                // add node to child array
                .push(node);
        } else {
            // parent is null or missing
            data2.push(node);
        }
    });

    return data2[0];

};









