var ROCKIMG="img/asteroid.jpg";
var OBSTACLES=[];

function loadrock(s) {
    PATTERN = s.image(ROCKIMG,0,0,200,200).pattern(0,0,200,200);
    for (var i=1; i<=6; i++) Snap.load("data/rock"+i+".svg", function(fragment) {
	    OBSTACLES.push(new Rock(i,fragment));
    });
}

function Rock(i,fragment) {    
    var k;
    this.g=fragment.select("path");
    this.g.attr({
	fill: PATTERN,
	strokeWidth: 0,
	stroke: "#F00",
    });
    this.name="Asteroid #"+i;
    this.arraypts=[];
    for (k=0; k<this.g.getTotalLength(); k+=5) 
	this.arraypts.push(this.g.getPointAtLength(k));
    this.dragged=false;
    this.m=(new Snap.Matrix()).add(MT(300+Math.random()*300,100+600*Math.random())).add(MS(0.5,0.5));
    this.g.drag(this.dragmove.bind(this), 
		this.dragstart.bind(this),
		this.dragstop.bind(this));
    this.path="";
    this.g.hover(function() {this.g.attr({strokeWidth:4});}.bind(this),
		 function()  {this.g.attr({strokeWidth:0});}.bind(this));
    this.g.addClass("unit");
    this.show();
}

Rock.prototype = {
    getrangeallunits: function () { return Unit.prototype.getrangeallunits.call(this);},
    getrange: function(sh) { return Unit.prototype.getrange.call(this,sh); },
    gethitrangeallunits: function () {return [[],[],[],[]]},
    togglehitsector: function() {},
    togglerange: function() {},
    getOutlinePoints: function () {
	var k;
	var pts=[];
	if (this.m==this.mop) return this.op;
	for (k=0; k<this.arraypts.length; k++)
	    pts.push(transformPoint(this.m,this.arraypts[k]));
	this.op=pts;
	this.mop=this.m;
	pts.obstacle=true;
	return pts;
    },
    getBox: function() { },
    getOutline: function() {
	var k;
	this.path="M ";
	for (k=0; k<this.arraypts.length; k++) {
	    var p=transformPoint(this.m,this.arraypts[k]);
	    this.path+=p.x+" "+p.y+" ";
	    if (k==0) this.path+=" L ";
	}
	this.path+="Z";
	var out= s.path(this.path).attr({display:"none"});
	out.appendTo(s);
	return out;
    },
    turn: function(n) {
	this.m.add(MR(n,0,0));
	this.show();
    },
    unselect: function() { },
    select: function() { },
    dragmove: function(dx,dy,x,y) {
	var ddx=dx*900/$("#playmat").width();
	var ddy=dy*900/$("#playmat").height();
	this.dragMatrix=MT(ddx,ddy).add(this.m);
	this.dragged=true;
	this.g.transform(this.dragMatrix);
    },
    dragstart:function(x,y,a) { 
	this.dragged=false; 
	var a=activeunit;
	activeunit=this; 
	this.select();
	a.unselect();
    },
    dragstop: function(a) { 
	var k;
	if (this.dragged) { this.m=this.dragMatrix;} 
	this.dragged=false;
    },
    show: function() {
	this.g.transform(this.m);
	this.g.appendTo(s); // Put to front
    }
}