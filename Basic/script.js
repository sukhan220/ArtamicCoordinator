/**
 * Artamic Basic Coordinator
 * Moving SVG object drag or set new position from press keyboard 
 * 
 * start from load function
 * 
 * Here mainly two function. one is makeDraggable function 
 * this function call after click a svg element or click over the svg board
 * 
 * 
 * Other one is  newPositon function which work after keydown
 * for setting object new position from keyboard
 * 
 * 
 */


const board = document.querySelector(".board");

let targetObject;
let st ="";
let targetPositionX=0;
let targetPositionY=0;

/** All SVG object Create Function start From Here */
/**
 * createSVGElement Function create new element
 * 
 * @param {number} x -new element Horizontal Position 
 * @param {number} y -new element Vertical Position
 * @returns {object} return a svg group element which have two select dash line
 */

const createSVGElement=(x,y)=>{
    let newElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    let circle=circleCreate(x,y,10);
    let selectH = selectLineHorizontal(x,y);
    let selectV= selectLineVertical(x,y);
    newElement.append(selectH,selectV,circle);

    return newElement;
    
}

/**
 * Create a Vertical SVG Dash Line
 * @param {number} Xcoord - object center x
 * @param {number} YCoord - object enter y
 * @returns {object} - return a vertical dash line
 */

const selectLineVertical=(Xcoord,YCoord)=>{
    let x=Xcoord;
    let x1=x;
    let y=0;
    let y1=YCoord;
    let VLine =lineCreate(x,y,x1,y1);
    VLine.setAttribute('stroke-dasharray', '5');

    return VLine;  

}

/**
 * Create a Horizontal SVG Dash Line
 * @param {number} Xcoord - object center x
 * @param {number} YCoord - object enter y
 * @returns {object} - return a Horizontal dash line
 */

const selectLineHorizontal=(Xcoord,YCoord)=>{
    let x=0;
    let x1=Xcoord;
    let y=YCoord;
    let y1=y;
    let HLine= lineCreate(x,y,x1,y1);  
    HLine.setAttribute('stroke-dasharray', '5');

    return HLine;  

}


/**
 * CREATE IN LINE 
 * and reture this svg element
 * 
 * @param {number} x1 -starting point horizontal line axis
 * @param {number} y1 -starting point vertical line axis
 * @param {number} x2 - ending point horizontal line axis
 * @param {number} y2 - ending point vertical line asix
 * @returns {object} - svg line element 
 */
const lineCreate = (x1, y1, x2, y2) => { 
    let newElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    newElement.setAttribute('x1', x1);
    newElement.setAttribute('x2', x2);
    newElement.setAttribute('y1', y1);
    newElement.setAttribute('y2', y2);
    newElement.setAttribute('stroke', 'black');
    newElement.setAttribute('stroke-opacity', '0.5');
    newElement.setAttribute('stroke-width', '4');
    return newElement;
}





/**
 * CREATE A CIRCLE 
 * and return svg element 
 * 
 * @param {Number} x -circle Horizontal center position in artboard
 * @param {Number} y -circle vertical center position in artboard
 * @param {Number} r -Circle Radius
 * @returns{object} - svg circle element 
 */
const circleCreate = (x, y, r) => { 
    let newElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    newElement.setAttribute('cx', x);
    newElement.setAttribute('cy', y);
    newElement.setAttribute('r', r);
    newElement.setAttribute('stroke', 'black');
    newElement.setAttribute('stroke-opacity', '0.5');
    newElement.setAttribute('stroke-width', '4');
    return newElement;
}

/**
 * GET NEW POSITION
 * and calcuate presetn position to new position distance
 * 
 * @param {number} x -Horizontal new positon
 * @param {number} y -vertical new position
 * @returns {number} -after moving  return new distance or return distance 
 */

const distance =(x,y)=>{
    let r = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
    let objectToTarget = parseFloat(r.toFixed(2));
    return objectToTarget;
}



/**
 * cheack object point and target point distance
 * - if target ponint less than or equal 0 
 * object present position is target point
 * so this function will return false
 * - else object will be forwarded to targent point
 * 
 * 
 * @param {number} targetDistance -new position distance
 * @returns {boolean} - if distance less than or equal 0
 *  object gets at  target point
 */
const isMove=(targetDistance)=>{
    if(targetDistance<=0){
        return false;
    }
    else{
        return true;
    }

}








/**
 * 
 * Create object moving animation
 * Using requestAnimationFrame()
 * @param {number} dx -Horizontal tiny change from current position to target position
 * @param {number} dy - Vertical tiny change from current position to target position
 * 
 * get present positon then add dx and dy
 * then check target point and present point are some or not.
 * if present point is not target point then forward it to target point.
 */

const move =(dx,dy)=>{
    
    const start=()=>{
        // get object present position
        let presentPositionX =parseFloat(targetObject.getAttributeNS(null, "cx"));
        let presentPositionY =parseFloat(targetObject.getAttributeNS(null, "cy"));

        // added tiny change with present Positon
        presentPositionX+=dx;
        presentPositionY+=dy;

        // get difference of object from present position to target positon
        let differenceX= targetPositionX-presentPositionX;
        let differenceY= targetPositionY-presentPositionY;

        // get Present distance of object to target Point
        let presentDistance=distance(differenceX,differenceY);

        // Check object will move or not 
        //if object reached the target point isMove return false
        //then break recursive call
        if(!isMove(presentDistance)){
            
            return;
        }

        // set new position after adding tiny change
        targetObject.setAttributeNS(null, "cx", presentPositionX);
        targetObject.setAttributeNS(null, "cy", presentPositionY);

        // call start function recursively
        window.requestAnimationFrame(start);
 
    }
    const end=()=>{
        window.cancelAnimationFrame(animationID);
        
    }
    start();

}





const makeDraggable=e=>{
    
    targetObject =e.target;
    console.dir(targetObject);
    //slectedElemnet False;
    let selectedElement = false;
    //if select element is svg ignore it
    if(targetObject.localName !=="svg"){
        //find all draggable class
        //and remove all draggable class
        const allDragObject= document.querySelectorAll(".draggable");
        allDragObject.forEach(item=>{ 
            if(item.classList.contains('draggable')){
                item.classList.remove("draggable");
            }
        });
        //only tagret element will add draggable class
        targetObject.classList.add("draggable");

    }

   
    const startDrag=e=> {
        if (e.target.classList.contains('draggable')) {
            //Assign targetObject into selectedElement
            selectedElement = targetObject;
            let coordinate= getMousePosition(e);
        }
    }
    
    const drag=e=> { 
        // of any object select selectedElement will true
        if (selectedElement) {
            e.preventDefault();
            let coordinate= getMousePosition(e);
            let x = parseFloat(selectedElement.getAttributeNS(null, "cx"));
            let y = parseFloat(selectedElement.getAttributeNS(null, "cy"));
            selectedElement.setAttributeNS(null, "cx", coordinate.x);
            selectedElement.setAttributeNS(null, "cy", coordinate.y);
          }
    }
    const endDrag =e=> {
        targetObject=e.target;
        selectedElement = null;
    }


    // Get Mouse Point
    // Using CTM(Current Transformation Matrix)
    const getMousePosition=event=> {
        let CTM = targetObject.getScreenCTM();
        return {
          x: (event.clientX - CTM.e) / CTM.a,
          y: (event.clientY - CTM.f) / CTM.d
        };
      }     


    //All Drag event
    targetObject.onmousedown= startDrag;
    targetObject.onmousemove= drag;
    targetObject.onmouseup=endDrag;
    // targetObject.onmouseleave=endDrag;


}

const size=()=>{
    console.log(window.pageYOffset);
    let r=((window.pageYOffset/10000)*100);
    targetObject.setAttributeNS(null, "rx",`${r}%`);
    targetObject.setAttributeNS(null, "ry",`${r}%`);

   
}


const newPosition=e=>{
   
    //after press key 0-9 create a string
    if(e.keyCode>=48 && e.keyCode<=57){
        st +=e.key;

    }
    //after press key comma(,) convert this string to number 
    //for object X New Position
    if(e.keyCode===188){
        targetPositionX=parseInt(st);
        st="";
    }

    // after press enter key set new positon of object
    if(e.keyCode===13){
        e.preventDefault();
        // first get Y new position
        targetPositionY=parseInt(st);

        // calc tiny change 
        let dx=(targetPositionX-parseFloat(targetObject.getAttributeNS(null, "cx")))/100;
        let dy =(targetPositionY-parseFloat(targetObject.getAttributeNS(null, "cy")))/100;

        move(dx,dy);

        // st value empty for getting ready save next position.
        st="";
    }

    if(e.keyCode===65){
        e.preventDefault();
        if(targetObject.localName==="rect"){
            document.body.onscroll=size;
        }

        
       
    }



}


const load=()=>{
    
    // create two svg element and set it svg board
    board.append(createSVGElement(400,400));
    board.append(createSVGElement(200,200)); 
    board.onclick=makeDraggable;
    window.onkeydown=newPosition;


}

load();