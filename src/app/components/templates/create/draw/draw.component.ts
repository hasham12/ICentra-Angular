import { Component, OnInit } from '@angular/core';
import {
	CreateGlobals
}
from '../create.globals';
declare const fabric: any;
declare var $: any;

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.css']
})
export class DrawComponent implements OnInit {
private vLinePatternBrush: any;
  private hLinePatternBrush: any;
  private squarePatternBrush: any;
  private diamondPatternBrush: any;
  private texturePatternBrush: any;
  props: any = {
      lineWidth: 0,
      shadowWidth: 0,
      shadowOffset: 0
  };

  constructor(private global: CreateGlobals) { }

  ngOnInit() {
    this.initdrawingbrushes();
    this.global.canceldrawingmode();
  }
  
  clearcanvas() {
        this.global.canvas.clear();        
  }

  drawingmode() {
    this.global.canvas.isDrawingMode = !this.global.canvas.isDrawingMode;
    if (this.global.canvas.isDrawingMode == true) {
       $("#drawingmode").text('Cancel drawing mode');
       $("#drawing-mode-options").show();
       $(".drawcomment").css("display","block");
       $(".linecol").css("background-color","#808080");
       $(".shadowcol").css("background-color","#808080");
    } else { 
        this.global.canceldrawingmode();
    }        
  }
    
    onChange(newval){
        if (newval == "hline") {
          this.global.canvas.freeDrawingBrush = this.vLinePatternBrush;
        }
        else if (newval == "vline") {
          this.global.canvas.freeDrawingBrush = this.hLinePatternBrush;
        }
        else if (newval == "square") {
          this.global.canvas.freeDrawingBrush = this.squarePatternBrush;
        }
        else if (newval == "diamond") {
          this.global.canvas.freeDrawingBrush = this.diamondPatternBrush;
        }
        else if (newval == "texture") {
          this.global.canvas.freeDrawingBrush = this.texturePatternBrush;
        }
        else {
          this.global.canvas.freeDrawingBrush = new fabric[newval + 'Brush'](this.global.canvas);
        }

        if (this.global.canvas.freeDrawingBrush) {
          this.global.canvas.freeDrawingBrush.color = $("#drawing-color").value;
          this.global.canvas.freeDrawingBrush.width = parseInt($("#drawing-line-width").value, 10) || 1;
          this.global.canvas.freeDrawingBrush.shadow = new fabric.Shadow({
            blur: parseInt($("#drawing-shadow-width").value, 10) || 0,
            offsetX: 0,
            offsetY: 0,
            affectStroke: true,
            color: $("#drawing-shadow-color").value,
          });
        }
    }

    drawinglinewidth(drawlinewid){
        this.global.canvas.freeDrawingBrush.width = parseInt(drawlinewid, 10) || 1;
    }

    drawingcolor() {
        this.global.canvas.freeDrawingBrush.color = this.props.line;
    }
   
    drawingshadowcolor() {
        this.global.canvas.freeDrawingBrush.shadow.color = this.props.shadow;
    }
  
    drawingshadowwidth(drawshadowwidth){
        this.global.canvas.freeDrawingBrush.shadow.blur = parseInt(drawshadowwidth, 10) || 0;
        //this.previousSibling.innerHTML = drawshadowwidth;
    }

    drawingshadowoffset(drawshadowoff){
        this.global.canvas.freeDrawingBrush.shadow.offsetX = parseInt(drawshadowoff, 10) || 0;
        this.global.canvas.freeDrawingBrush.shadow.offsetY = parseInt(drawshadowoff, 10) || 0;
       // this.previousSibling.innerHTML = drawshadowoff;
    }
     initdrawingbrushes() {
        if (fabric.PatternBrush) {

            this.vLinePatternBrush = new fabric.PatternBrush(this.global.canvas);
            this.vLinePatternBrush.getPatternSrc = function() {

              var patternCanvas = fabric.document.createElement('canvas');
              patternCanvas.width = patternCanvas.height = 10;
              var ctx = patternCanvas.getContext('2d');

              ctx.strokeStyle = this.color;
              ctx.lineWidth = 5;
              ctx.beginPath();
              ctx.moveTo(0, 5);
              ctx.lineTo(10, 5);
              ctx.closePath();
              ctx.stroke();

              return patternCanvas;
            };

            this.hLinePatternBrush = new fabric.PatternBrush(this.global.canvas);
            this.hLinePatternBrush.getPatternSrc = function() {

              var patternCanvas = fabric.document.createElement('canvas');
              patternCanvas.width = patternCanvas.height = 10;
              var ctx = patternCanvas.getContext('2d');

              ctx.strokeStyle = this.color;
              ctx.lineWidth = 5;
              ctx.beginPath();
              ctx.moveTo(5, 0);
              ctx.lineTo(5, 10);
              ctx.closePath();
              ctx.stroke();

              return patternCanvas;
            };

            this.squarePatternBrush = new fabric.PatternBrush(this.global.canvas);
            this.squarePatternBrush.getPatternSrc = function() {

              var squareWidth = 10, squareDistance = 2;

              var patternCanvas = fabric.document.createElement('canvas');
              patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
              var ctx = patternCanvas.getContext('2d');

              ctx.fillStyle = this.color;
              ctx.fillRect(0, 0, squareWidth, squareWidth);

              return patternCanvas;
            };

            this.diamondPatternBrush = new fabric.PatternBrush(this.global.canvas);
            this.diamondPatternBrush.getPatternSrc = function() {

              var squareWidth = 10, squareDistance = 5;
              var patternCanvas = fabric.document.createElement('canvas');
              var rect = new fabric.Rect({
                width: squareWidth,
                height: squareWidth,
                angle: 45,
                fill: this.color
              });

              var canvasWidth = rect.getBoundingRect().width;

              patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
              rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });

              var ctx = patternCanvas.getContext('2d');
              rect.render(ctx);

              return patternCanvas;
            };

            var img = new Image();
            img.src = '/assets/img/editor/3layouts.png';
            this.texturePatternBrush = new fabric.PatternBrush(this.global.canvas);
            this.texturePatternBrush.source = img;
        }
    }
}
