const dTr = Math.PI/180;

function getRotationMatrix(alpha,beta,gamma) {
    let a = Math.cos(alpha),
        b = Math.sin(alpha),
        c = Math.cos(beta),
        d = Math.sin(beta),
        e = Math.cos(gamma),
        f = Math.sin(gamma)
   return [
        [e*c+f*b*d, e*b*d-f*c, a*d],
        [f*a, e*a, -b],
        [f*b*c-e*d, f*d+e*b*c, a*c]
    ]
}

function matrixMulitply3x3AB(matrixA,matrixB) {
    let newMatrix = [
            [1,0,0],
            [0,1,0],
            [0,0,1]
        ]
    for(let a = 0; a < 3; a++) {
        for(let b = 0; b < 3; b++) {
            let sum = 0;
            for(let c = 0; c < 3; c++) {
                sum += matrixA[a][c]*matrixB[c][b];
            }
            newMatrix[a][b] = sum;
        }
    }
    return newMatrix;
}

function rotationMod(x) {
    return (x%360+360)%360;
}

var infNavInfo = document.getElementById("infNavInfo");
function InfCode(x,e=0) {
    if(typeof(x)=="object") {
        let str = "(";
        let fuckYou = x.length-1
        for(let i = 0; i <= fuckYou; i++) {
            str += InfCode(x[i],i)
            if(i!=fuckYou) str += ", ";
        }
        return str+")";
    } else return x==0?(e==0?"x":e==1?"y":"z"):x==1?"-&infin;":"+&infin;";
}
function infCodeM(M) {
    return (M>=-1&&M<=1)?0:M<0?1:2;
}
var colorA = 75, colorB = (255-colorA)/3;
function infColorCode(x) {
    return "rgb("+(x[0]*colorB+colorA)+","+(x[1]*colorB+colorA)+","+(x[2]*colorB+colorA)+")";
}

var infNumColorCodes = [];
let allInfNumCombinations = [-1,0,0];
let code = "";
for(let i = 0; i < 27; i++) {
    allInfNumCombinations[0]++;
    for(let j = 0; j < 3; j++) {
        if(allInfNumCombinations[j]>2) {
            allInfNumCombinations[j+1]++;
            allInfNumCombinations[j] = 0;
        }
    }
    code = "";
    for(let j = 0; j < 3; j++) {
        code += ""+allInfNumCombinations[j];
    }
    let color = infColorCode(allInfNumCombinations);
    infNavInfo.innerHTML += '<div style="background-color:'+color+'" class="infNavColorCode" onclick="infNavToggleColor(\''+code+'\')"><input type="checkbox" id="C'+code+'"></input>'+InfCode(allInfNumCombinations)+'</div>';
}

var allowedColor = new Map();
var allColorsAllowed = true;
function isColorAllowed(colorCode) {
    return allColorsAllowed?true:allowedColor.has(colorCode[0]+""+colorCode[1]+""+colorCode[2]);
}

function infNavToggleColor(colorCode) {
    let check = document.getElementById("C"+colorCode).checked;
    if(check) {
        allColorsAllowed = false;
        allowedColor.set(""+colorCode,true);
    } else {
        allowedColor.delete(""+colorCode);
        if(allowedColor.size==0) allColorsAllowed = true;
    }
    drawInfNavMap();
}

function clearInfNavColors() {
    for(let a = 0; a < 3; a++) {
        for(let b = 0; b < 3; b++) {
            for(let c = 0; c < 3; c++) {
                document.getElementById("C"+a+""+b+""+c).checked = false;
            }
        }
    }
    allowedColor.clear();
    allColorsAllowed = true;
    drawInfNavMap();
}

var viewMode = 0;
var view = 0;
var inc = 2;
var offset = 0;
var infNavCanvas = document.getElementById("infNavCanvas");
var infctx = infNavCanvas.getContext("2d");
infNavCanvas.width = 360;
infNavCanvas.height = 360;

var cursor = document.getElementById("cursor");
var cursorRect = cursor.getBoundingClientRect();
cursorRect = [cursorRect.width/2,cursorRect.height/2];

cursor.style.marginLeft = (infNavCanvas.offsetLeft-cursorRect[0])+"px";
cursor.style.marginTop = (infNavCanvas.offsetTop-cursorRect[1])+"px";

var mouse = [0,0];
infNavCanvas.addEventListener('click',(e)=>{
    let rect = infNavCanvas.getBoundingClientRect();
    cursor.style.marginLeft = (e.pageX-cursorRect[0])+"px";
    cursor.style.marginTop = (e.pageY-cursorRect[1])+"px";
    mouse = [
      Math.floor(360*(e.clientX-rect.left)/rect.width),
      Math.floor(360*(e.clientY-rect.top)/rect.height)
    ];
    updateSelectedRotation();
},false);

function matricesToHTML(matrices,extraAtStart="") {
    let str = '<div class="matrices">'+extraAtStart;
    for(let a = 0; a < matrices.length; a++) {
        str += '<div class="matrix"> <div class="eraser"></div> <div class="drawLine"></div> <table>'
        for(let b = 0; b < matrices[a].length; b++) {
            str += "<tr>";
            for(let c = 0; c < matrices[a][0].length; c++) {
                str += '<td>'+matrices[a][b][c]+'</td>';
            }
            str += "</tr>"
        }
        str += '</table> <div class="eraser"></div> </div>'
    }
    return str+'</div>';
}

function getCalcString(row,off,modifyRow=false) {
    let count = 0, str = "", sign = 1, toBeRemoved = [];
    for(let x = 0; x < row.length; x++) {
        sign = (off&(1<<x)?-1:1)
        if(row[x]==1 || row[x]==-1) {
            if(count == 0) {
                str += (row[x]*sign)<0?"-M":"M";
            } else {
                str += (row[x]*sign)<0?" - M":" + M"
            }
            count++;
        } else if(row[x]!=0) {
            if(count == 0) {
                str += (isFinite(row[x])?row[x]+"M":(row[x]<0?"-&infin;":"&infin;"));
            } else {
                str += row[x]<0?" - ":" + "
                str += (isFinite(row[x])?Math.abs(row[x])+"M":(row[x]<0?"-&infin;":"&infin;"));
            }
            count++;
        } else {
            toBeRemoved.push(x);
        }
        if(modifyRow) row[x] *= sign;
    }
    if(modifyRow) {
        for(let i = toBeRemoved.length-1; i >= 0; i--) {
            for(let j = toBeRemoved[i]; j < row.length; j++)  {
                row[j] = row[j+1];
            }
            row.pop();
        }
    }
    return str;
}

var calculationsProof = document.getElementById("calculationsProof");
var rotationOutput = document.getElementById("rotationOutput");
var offsetOutput = document.getElementById("offsetOutput");
var resultOutput = document.getElementById("resultOutput");
var selectedRotation = [0,0,0];
function updateSelectedRotation() {
    selectedRotation = viewMode==0?[mouse[0],view,mouse[1]]:viewMode==1?[view,mouse[0],mouse[1]]:[mouse[0],mouse[1],view]
    var radians = [selectedRotation[0]*dTr,selectedRotation[1]*dTr,selectedRotation[2]*dTr],
        matrix = getRotationMatrix(radians[0],radians[1],radians[2])
        resultMatrix = matrixMulitply3x3AB(rootRotationMarix,matrix),
        colorCode = [0,0,0],
        sum = 0,
        offsetMatrix = [[(offset&1?"-M":"M")],[(offset&2?"-M":"M")],[(offset&4?"-M":"M")]],
        calculations = "<h3>how the calculations were done for the rotation you selected</h3>"+matricesToHTML([resultMatrix,offsetMatrix]),
        calcArr = [];
    for(let y = 0; y < 3; y++) {
        calcArr.push([getCalcString(resultMatrix[y],offset,true)]);
    }
    calculations += matricesToHTML([calcArr],'<div class="equal">=</div>');
    calcArr = [];
    let notComplete = true;
    while(notComplete) {
        notComplete = false;
        for(let y = 0; y < 3; y++) {
            if(resultMatrix[y].length>1) {
                resultMatrix[y][0] += resultMatrix[y][1];
                resultMatrix[y][1] = resultMatrix[y][resultMatrix[y].length-1];
                if(resultMatrix[y][0]>1) {
                    resultMatrix[y][0] = Infinity;
                } else if(resultMatrix[y][0]<-1) {
                    resultMatrix[y][0] = -Infinity;
                }
                resultMatrix[y].pop();
                notComplete = true;
            }
            calcArr.push([getCalcString(resultMatrix[y],offset)]);
        }
        if(notComplete) {
            calculations += matricesToHTML([calcArr],'<div class="equal">=</div>');
            calcArr = [];
        }
    }
    rotationOutput.innerHTML = "("+selectedRotation[0]+", "+selectedRotation[1]+", "+selectedRotation[2]+")";
    for(let i = 0; i < 3; i++) {
        if(isFinite(resultMatrix[i][0])) {
            colorCode[i] = 0;
        } else if(resultMatrix[i][0]<0) {
            colorCode[i] = 1;
        } else {
            colorCode[i] = 2;
        }
    }
    resultOutput.innerHTML = "("+calcArr[0][0]+", "+calcArr[1][0]+", "+calcArr[2][0]+")";
    calculationsProof.innerHTML = calculations;
    let erasers = document.getElementsByClassName("eraser");
    for(let i = 0; i < erasers.length; i++) {
        let rect = erasers[i].getBoundingClientRect();
        erasers[i].style.position = "absolute";
        erasers[i].style.width = rect.width+"px";
        erasers[i].style.left = rect.left+"px";
        erasers[i].style.borderTop = "solid white 5px";
    }
}

var rootRotationOutput = document.getElementById("rootRotationOutput");
var rootRotations = [document.getElementById("RN0"),document.getElementById("RN1"),document.getElementById("RN2")];
var rootRotationMarix = [
    [1,0,0],
    [0,1,0],
    [0,0,1]
]
function performRootRotation() {
    let r = [];
    let num = 0
    for(let i = 0; i < 3; i++) {
        num = Number(rootRotations[i].value)%360;
        num = isFinite(num)?num:0;
        rootRotations[i].value = num;
        r.push(num);
    }
    rootRotationOutput.innerHTML = "("+rootRotations[0].value+", "+rootRotations[1].value+", "+rootRotations[2].value+")";
    rootRotationMarix = getRotationMatrix(r[0]*dTr,r[1]*dTr,r[2]*dTr);
    drawInfNavMap();
}

function clearRootRotation() {
    for(let i = 0; i < 3; i++) {
        rootRotations[i].value = 0;
    }
    performRootRotation();
}

function setRootRotationToCurrentRotation() {
    for(let i = 0; i < 3; i++) {
        rootRotations[i].value = selectedRotation[i];
    }
    performRootRotation();
}

var animating = false;
function drawInfNavMap(animationCall=false) {
    if(animating&&!animationCall) return;
    infctx.clearRect(0,0,infNavCanvas.width,infNavCanvas.height);
    for(let i = 0; i < infNavCanvas.height; i += inc) {
        for(let j = 0; j < infNavCanvas.width; j += inc) {
            let radians = viewMode==0?[j*dTr,view*dTr,i*dTr]:viewMode==1?[view*dTr,j*dTr,i*dTr]:[j*dTr,i*dTr,view*dTr],
                resultMatrix = matrixMulitply3x3AB(rootRotationMarix,getRotationMatrix(radians[0],radians[1],radians[2])),
                colorCode = [0,0,0],
                sum = 0;
            for(let y = 0; y < 3; y++) {
                sum = 0;
                for(let x = 0; x < 3; x++) {
                    sum += resultMatrix[y][x]*(offset&(1<<x)?-1:1);
                    if(sum>1 || sum<-1) break;
                }
                if(sum>1) {
                    colorCode[y] = 2;
                } else if(sum<-1) {
                    colorCode[y] = 1;
                } else {
                    colorCode[y] = 0;
                }
            }
            if(isColorAllowed(colorCode)) {
                infctx.fillStyle = infColorCode(colorCode);
                infctx.fillRect(j,i,inc,inc);
            }
        }
    }
    updateSelectedRotation();
}

var viewNum =  document.getElementById("infNavBeta");
var viewSlider = document.getElementById("infNavBetaSlider");
var animationToggle = document.getElementById("animationToggle");
var animationSpeed = 360/5000;
async function infNavAnimate() {
    if(animating) return;
    animating = true
    animationToggle.checked = true
    let then = performance.now();
    let passed = 0;
    let oldView = view;
    while(animating) {
        passed = performance.now()-then;
        view = (oldView+passed*animationSpeed)%360;
        viewNum.value = view;
        viewSlider.value = view;
        drawInfNavMap(true);
        await new Promise(requestAnimationFrame);
    }
    view = Math.floor(view);
    viewNum.value = view;
    viewSlider.value = view;
    drawInfNavMap();
    animationToggle.checked = false
}

drawInfNavMap();
