declare var $: any;
export class CreateUtils {
    static dragimgdata: any;
    static dragtemplate: any;
    static dragdataclass: any;
    static dragdatasrc: any;
    static dropPositionX: any;
    static dropPositionY: any;
    
    static extend(fabric, obj, id) {
        obj.toObject = (function(toObject) {
            return function() {
                return fabric.util.object.extend(toObject.call(this), {
                    id: id
                });
            };
        })(obj.toObject);
    }

    static initDraggable() {
        let lthis = this;
        $(".adminimg, .iconimg, .adminbgimg, .importimg, .shapeimg, .loadtemplate").css("zIndex", 10000);
        $(".adminimg, .iconimg, .adminbgimg, .importimg, .shapeimg, .loadtemplate").draggable({
            //revert: true,
            helper: 'clone',
            appendTo: '.icentra-editor',
            containment: "body",
            scroll: true,
            start: function(event, ui) {
                //$(ui.helper).css({"width":"100","position":"fixed"});
                lthis.dragimgdata = $(this).data("imgsrc");
                lthis.dragdatasrc = $(this).attr("src");
                lthis.dragdataclass = $(this).attr("class");
                lthis.dragtemplate = $(this).data("id");
                $(ui.helper).css({
                    "background-color": ""
                });
                $(this).data("startingScrollTop",$(document).scrollTop());
            },
            drag: function(event, ui) {
                var st = parseInt($(this).data("startingScrollTop"));
                ui.position.top -= st;
            }
        });
    }
    
    static showimports() {    
        this.refreshSection('importimgection');
    }
    
    static showshapes() {
        this.refreshSection('shapelist');
    }    

    static showbgimgs() {
        this.refreshSection('photos');
    }
    
    static showicons() {
        this.refreshSection('iconslist');
    }

    static showimages() {    
        this.refreshSection('imagesection');
    } 
    
    static showtemplates() {
        this.refreshSection('templatesection');
    }
    
    static showpages() {
        this.refreshSection('pageimgection');
    }

    static refreshSection(section) {
        setTimeout(function() {
            var $grid = $('#' + section);
            $grid.imagesLoaded().progress(function() {
                $grid.isotope('layout');
                $grid.isotope('reloadItems');
            });
        }, 200);
    }
}