const width = window.innerWidth;
const height = window.innerHeight;

var mylinks = JSON.parse(links);

function loopGrid(){

  var index = 0;
  var appendedIndex = 0;
  var tempImg = new Image();

  var tooltip = d3.select("body").append("div")
                .attr("class", "tooltip") //class was defined above to determine how tooltips appear
                .style("opacity", 0);

  //if image loads, append image to html doc
  tempImg.onload = function(){
    // console.log(tempImg.src);
     appendImage();
  }

  tempImg.onerror = function() {
    if (index<634) {
      index = index + 1;
      tryLoadImage(index);
    } else {
      //add carousel Indicators
      for (x = 0; x < Math.floor(appendedIndex/16); x++) {
        var li = document.createElement('li');
        li.setAttribute('data-target', "#myCarousel");
        li.setAttribute('data-slide-to', x.toString());
        if (x == 0) {
          li.className = "active";
        }
        else {}
        document.getElementById("carousel-indicator").appendChild(li);
      }
    }
  };

  //function to attempt to load image via file path and index
  var tryLoadImage = function( index ){
     tempImg.src = 'data/renderings/iso/' + index + '.png';
  }

  //function to append image
  var appendImage = function() {
    //find link details in links.JSON
    var link = mylinks.find(link => link.id == index);

    if (appendedIndex % 16 == 0) {
      // create first div
      var div1 = document.createElement('div');

      if (appendedIndex == 0) {
        div1.className = 'item active';
      }
      else {
        div1.className = 'item';
      }

      div1.id = 'item' + Math.floor(appendedIndex/16).toString();
      document.getElementById("carousel-grid").appendChild(div1);

      //create first row
      var div2 = document.createElement('div');
      div2.className = "row";
      div2.id = 'row' + Math.floor(appendedIndex/4).toString();
      document.getElementById('item' + Math.floor(appendedIndex/16).toString()).appendChild(div2);

      //attaches first image to first div
      var div3 = document.createElement('div');
      div3.className = "col-sm-3";
      div3.id = "col" + appendedIndex.toString();
      div3.onclick = function openLink() {
        window.open('https://grabcad.com/library/' + link.link_name, 'mywindow');
      };
      document.getElementById('row' + Math.floor(appendedIndex/4).toString()).appendChild(div3);

      var img = document.createElement('img');
      img.src = tempImg.src;
      document.getElementById("col" + appendedIndex.toString()).appendChild( img );

      var div4 = document.createElement('div');
      div4.className = 'text';
      var text = document.createTextNode("Designed By: "+ link.author);
      div4.appendChild(text);
      document.getElementById("col" + appendedIndex.toString()).appendChild(div4);
    }
    else {
      if (appendedIndex % 4 == 0) {
        //create row
        var div2 = document.createElement('div');
        div2.className = "row";
        div2.id = 'row' + Math.floor(appendedIndex/4).toString();
        document.getElementById('item' + Math.floor(appendedIndex/16).toString()).appendChild(div2);

        //attach image to row
        var div3 = document.createElement('div');
        div3.className = "col-sm-3";
        div3.id = "col" + appendedIndex.toString();
        div3.onclick = function openLink() {
          window.open('https://grabcad.com/library/' + link.link_name, 'mywindow');
        };
        document.getElementById('row' + Math.floor(appendedIndex/4).toString()).appendChild(div3);

        var img = document.createElement('img');
        img.src = tempImg.src;
        document.getElementById("col" + appendedIndex.toString()).appendChild( img );

        var div4 = document.createElement('div');
        div4.className = 'text';
        var text = document.createTextNode("Designed By: "+ link.author);
        div4.appendChild(text);
        document.getElementById("col" + appendedIndex.toString()).appendChild(div4);
      }
      else {
        //attach image
        var div3 = document.createElement('div');
        div3.className = "col-sm-3";
        div3.id = "col" + appendedIndex.toString();
        div3.onclick = function openLink() {
          window.open('https://grabcad.com/library/' + link.link_name, 'mywindow');
        };
        document.getElementById('row' + Math.floor(appendedIndex/4).toString()).appendChild(div3);

        var img = document.createElement('img');
        img.src = tempImg.src;
        document.getElementById("col" + appendedIndex.toString()).appendChild( img );

        var div4 = document.createElement('div');
        div4.className = 'text';
        var text = document.createTextNode("Designed By: "+ link.author);
        div4.appendChild(text);
        document.getElementById("col" + appendedIndex.toString()).appendChild(div4);
      }
    }

    appendedIndex = appendedIndex + 1;
    index = index + 1;
    tryLoadImage( index );
  }

  // activation of function attempt to load image
  tryLoadImage( index );

}


loopGrid();

// d3.csv("data/all_bracket_metadata.csv").then(function(data) {
//
//   img.on("mouseover", function(d, i) {
//         console.log("mouse detected");
//     tooltip.transition()
//     .duration(500) //animation technique makes the tooltips visible
//     .style("opacity", .9);
//    tooltip.html("Category: " + d.category +"<br/> Author "+ d.author + "<br/> Mass [g]: " + d.mass)
//     .style("left", (d3.event.pageX) + "px")
//     .style("top", (d3.event.pageY - 28) + "px");
//
//   });
//   img.on("mouseout", function(event, d) {
//     tooltip.transition()
//       .duration(300)
//       .style("opacity", 0);
//   });
// });
