let targetObject;
let st ="";
let targetPositionX=0;
let targetPositionY=0;

/** All SVG object Create Function start From Here */
//LineCreate
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

// Circle Create
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


const distance =(x,y)=>{
    let r = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
    let objectToTarget = parseFloat(r.toFixed(2));
    return objectToTarget;
}

//cheack object point and target point
const isMove=(targetDistance)=>{
    // if distance less than or equal 0
    // object gets at  target point
    if(targetDistance<=0){
        return false;
    }
    else{
        return true;
    }

}

const getObjectAtt=()=>{

}

const setObjectAtt=()=>{

}

//create a move animation function
// Using requestAnimationFrame()
const move =(dx,dy)=>{
    
    const start=()=>{

        let presentPositionX =parseFloat(targetObject.getAttributeNS(null, "cx"));
        let presentPositionY =parseFloat(targetObject.getAttributeNS(null, "cy"));
        console.log(`present X : ${parseFloat(targetObject.getAttributeNS(null, "cx"))} present Y: ${parseFloat(targetObject.getAttributeNS(null, "cy"))} `)
        presentPositionX+=dx;
        presentPositionY+=dy;
        let differenceX= targetPositionX-presentPositionX;
        let differenceY= targetPositionY-presentPositionY;

        // get Present distance object to target Point
        let presentDistance=distance(differenceX,differenceY);

        // Check object will move or not
        if(!isMove(presentDistance)){
            return;
        }
    
        targetObject.setAttributeNS(null, "cx", presentPositionX);
        targetObject.setAttributeNS(null, "cy", presentPositionY);

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
        // remove this class
        const allDragObject= document.querySelectorAll(".draggable");
        allDragObject.forEach(item=>{
            if(item.classList.contains('draggable')){
                item.classList.remove("draggable");
            }
        });
        //only tagret element will add draggable class
        targetObject.classList.add("draggable")

    }

   
    const startDrag=e=> {
        if (e.target.classList.contains('draggable')) {
            //Assign targetObject into selectedElement
            selectedElement = targetObject;
            let coordinate= getMousePosition(e);
        }
    }
    
    const drag=e=> { 
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
   
    // let st="";
    if(e.keyCode>=48 && e.keyCode<=57){
        st +=e.key;

    }
    if(e.keyCode===188){
        targetPositionX=parseInt(st);
        st="";
    }
    if(e.keyCode===13){
        e.preventDefault();
        targetPositionY=parseInt(st);
        console.log(`present X : ${parseFloat(targetObject.getAttributeNS(null, "cx"))} present Y: ${parseFloat(targetObject.getAttributeNS(null, "cy"))} `)
        let dx=(targetPositionX-parseFloat(targetObject.getAttributeNS(null, "cx")))/100;
        let dy =(targetPositionY-parseFloat(targetObject.getAttributeNS(null, "cy")))/100;



        console.log(targetPositionX,targetPositionY);
        move(dx,dy);
        st="";
    }

    if(e.keyCode===65){
        e.preventDefault();
        if(targetObject.localName==="rect"){
            document.body.onscroll=size;
        }

        
       
    }


    // console.log(targetPositionX,targetPositionY);

}


const load=()=>{
    const board = document.querySelector(".board");

    board.append(lineCreate(10,100,100,100));
    board.append(circleCreate(100,100,10));
    board.append(circleCreate(200,100,20));

    // board.onclick=clickObject;
    board.onclick=makeDraggable;
    window.onkeydown=newPosition;
    // window.onscroll=size;

}

load();