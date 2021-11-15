
document.getElementsByClassName("icol-3 ")[0].children[0].addEventListener('click',shopHanlder);
document.getElementsByClassName("icol-3 ")[0].children[1].addEventListener('click',downloadHandler);
document.getElementsByClassName("icol-3 ")[0].children[2].addEventListener('click',configureHandler);

function shopHanlder(){ alert('set'); }
function downloadHandler(){ alert('download'); }
function configureHandler(){
	const configureModal = document.getElementsByClassName("pro_li_plot_pop pop01")[0];
	configureModal.setAttribute('style','display:block;')
}	

var hmap_height;
//=========================heatmap=====================================//
const heatmap = d3.csv("/rdap/heatmap/heatmap_data").then(data => {
	/*
	rows : gene 이름
	items : 각 patients속 값
	columns : 각 patients의 번호 ex)pt1
	*/
	var alldata = data;
    
	const items = [];
    const rows = [];
    const columns = Object.keys(data[0]).filter(k => k !== "Symbol");
	
    for (const row of data) {
        const newRow = [];
        for (const [key, value] of Object.entries(row)) {
            if (key === "Symbol") {
                rows.push(value);
            } else {
                newRow.push(Number.parseFloat(value));
            }
        }
        items.push(newRow);
    }
	
	hmap_height = 25*rows.length;
	
    const heatmapElement = document.getElementById("heatmap");
		let heatmap = new UnipeptVisualizations.Heatmap(heatmapElement, items, rows, columns, {
			minColor: "#0033FF",
        	maxColor: "#FF3300",
            colorBuckets: 100,
            width: 900,
            height: hmap_height+(hmap_height * 0.1-200),
            dendrogramEnabled: true, //선
            enableTooltips: true,
            labelColor: "#000000",
            highlightSelection: true,
            highlightFontColor: "red",
            animationsEnabled: true
        });
        
        //heatmap.cluster();
        //heatmap.reset();
});					
//=========================heatmap=====================================//

//=================우측 상단 Linear===============//
var svg = d3.select("#heatmap_legend").append("svg")
	.attr("style", "overflow: visible;")
	.attr("width", 200)
	.attr("height", 200);

var linearV = d3.scaleLinear()
	.domain([-1,1])
	.range(['rgb(000,051,255)', 'rgb(255,051,000)']);
svg.append("g")
    .attr("class", "legendV")
    .attr("transform", "translate(10,50)");

var legendV = d3.legendColor()
	.shapeWidth(20)
	.cells(4)
	.title("Linear")
	.labelFormat(d3.format('.0f'))
	.scale(linearV);

svg.select(".legendV").call(legendV);
//=================우측 상단 Linear===============//

d3.select("#heatmap_legend").append("div").text("group").attr("style","margin-left:10px;");
var legend_svg = d3.select("#heatmap_legend").append("svg")
	.attr("width", 200)
	.attr("height", 200);

var keys = ["Progressive Disease", "Partial Response", "Complete Response"]

var color = d3.scaleOrdinal()
	.domain(keys)
	.range(["red", "blue", "green"]);

var size = 20
legend_svg.selectAll("mydots")
	.data(keys)
	.enter()
	.append("rect")
    .attr("x", 10)
    .attr("y", function(d,i){ return 15 + i*(size+5)})
    .attr("width", size)
    .attr("height", size)
    .style("fill", function(d){ return color(d)})

//=================우측 상단 Group===============//
legend_svg.selectAll("mylabels")
	.data(keys)
	.enter()
	.append("text")
    .attr("x", 10 + size*1.2)
    .attr("y", function(d,i){ return 15 + i*(size+5) + (size/2)})
    .style("fill", function(d){ return color(d)})
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")  
//=================우측 상단 Group===============//
//=================Group 색상 구분===============//

const groupinfo = d3.csv("/rdap/heatmap/heatmap_data2").then(data1 =>{
	var patId = [];
	var irinfo = [];
	
	for (const row of data1) {
        for (const [key, value] of Object.entries(row)) {
            if (key === "irRECIST") {
                irinfo.push(value);
            } 
			if (key === "Patient.ID") {
                patId.push(value);
            }
        }
    }
	
	colrbox = [];
	
	for(i=0; i<irinfo.length; i++){
		if(irinfo[i] == "Progressive Disease"){
			colrbox.push(0)		
		}
		if(irinfo[i] == "Partial Response"){
			colrbox.push(1)		
		}
		if(irinfo[i] == "Complete Response"){
			colrbox.push(2)		
		}
	}
	var color2 = d3.scaleOrdinal()
		.domain(colrbox)
		.range(["red", "blue", "green"])
	
	var gr_svg = d3.select("#group_color").append("svg")
		.attr("style", "overflow: visible;")
		.attr("width", 200)
		.attr("height", 20);
	gr_svg.selectAll("group_color")
		.data(colrbox)
		.enter()
		.append("rect")
		.attr("x", function(d, i) {return 100 - i*(size-47)})
		.attr("y", hmap_height+(hmap_height * 0.1-(hmap_height*0.013)))
		.attr("width", 25)
		.attr("height", 25)
		.style("fill", function(d){ return color2(d)})
});
//=================Group 색상 구분===============//