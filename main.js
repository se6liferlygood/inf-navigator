var inputMatrices = [
    [
        [document.getElementById("000"),document.getElementById("001"),document.getElementById("002")]
    ],
    [
        [document.getElementById("100"),document.getElementById("101"),document.getElementById("102")],
        [document.getElementById("110"),document.getElementById("111"),document.getElementById("112")]
    ],
    [
        [document.getElementById("200"),document.getElementById("201"),document.getElementById("202")],
        [document.getElementById("210"),document.getElementById("211"),document.getElementById("212")],
        [document.getElementById("220"),document.getElementById("221"),document.getElementById("222")]
    ]
]

var outputs = [document.getElementById("output0"),document.getElementById("output1"),document.getElementById("output2")];

function findInfs(n) {
    let matrix = [];
    for(let i = 0; i <= n; i++) {
        let row = [];
        for(let j = 0; j < 3; j++) {
            if(inputMatrices[n][i][j].value=="") return;
            row.push(Number(inputMatrices[n][i][j].value));
        }
        matrix.push(row);
    }
    outputs[n].innerHTML = "";
    let count = 1;
    for(let a = 0; a < 8; a++) {
        let result = "(";
        for(let b = 0; b < 3; b++) {
            result += (a&(1<<b)?"-M":"+M");
            if(b!=2) result += ", "; 
        }
        result += ") &rarr; (";
        let anyInf = false;
        for(let b = 0; b <= n; b++) {
            let sum = 0;
            for(let c = 0; c < 3; c++) {
                sum += matrix[b][c]*(a&(1<<c)?-1:1);
                if(sum>1 || sum<-1) break;
            }
            if(sum>1) {
                result += "+&infin;"
                anyInf = true;
            } else if(sum<-1) {
                result += "-&infin;";
                anyInf = true;
            } else if(sum==0) {
                result += "0";
            } else if(sum==1) {
                result += "+M";
            } else if(sum==-1) {
                result += "-M";
            } else {
                result += (Math.sign(sum)>0?"+":"")+sum+"M";
            }
            if(b!=n) result += ", ";
        }
        if(anyInf) {
            outputs[n].innerHTML += count+". "+result+")<br>";
            count++;
        }
    }
    if(outputs[n].innerHTML=="") outputs[n].innerHTML += "NO &infin; FOUND";
}

function clearM(n) {
    for(let i = 0; i <= n; i++) {
        for(let j = 0; j < 3; j++) {
            inputMatrices[n][i][j].value = "";
        }
    }
    outputs[n].innerHTML = "";
    if(n==2) {
        for(let i = 0; i < 3; i++) {
            rotations[i].value = "";
        }
    }
}

function copyRow(n,m) {
    let whichMatrix = Number(prompt("copy which matrix?\nhow many rows does the matrix have?\n3 or 2 or 1"));
    if(!whichMatrix || whichMatrix<1 || whichMatrix>3 || Math.floor(whichMatrix)!=whichMatrix) return;
    let row = Number(prompt("what row in this matrix will you copy?\n1"+((n)=>{let str="";for(let a=2;a<=n;a++) str += " or "+a;return str})(whichMatrix)));
    if(row < 1 || row > whichMatrix || Math.floor(row)!=row) return;
    whichMatrix--;
    row--;
    for(let a = 0; a < 3; a++) {
        inputMatrices[n][m][a].value = inputMatrices[whichMatrix][row][a].value;
    }
}

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

function translateToRobloxAngle(x,e=0) {
    if(typeof(x)=="object") {
        let arr = []
        for(let i = 0; i < x.length; i++) {
            arr.push(translateToRobloxAngle(x[i]));
        }
        return arr;
    } else return x>180?x-360:x;
}

var rotations = [document.getElementById("R0"),document.getElementById("R1"),document.getElementById("R2")];
const dTr = Math.PI/180;
function rotationAutoFill() {
    let radians = [];
    for(let i = 0; i < 3; i++) {
        if(rotations[i].value=="") return;
        radians.push(rotations[i].value*dTr);
    }
    outputs[2].innerHTML =  "";
    rotationMatrix = getRotationMatrix(radians[0],radians[1],radians[2]);
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            inputMatrices[2][i][j].value = rotationMatrix[i][j];
        }
    }
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

var mouse = [0,0];
infNavCanvas.addEventListener('click',(e)=>{
    let rect = infNavCanvas.getBoundingClientRect();
    mouse = [
      Math.floor(360*(e.clientX-rect.left)/rect.width),
      Math.floor(360*(e.clientY-rect.top)/rect.height)
    ];
    updateSelectedRotation();
},false);

var infNavOuput = document.getElementById("infNavOutput");


var selectedRotation = [0,0,0];
function updateSelectedRotation() {
    selectedRotation = viewMode==0?[mouse[0],view,mouse[1]]:viewMode==1?[view,mouse[0],mouse[1]]:[mouse[0],mouse[1],view]
    var radians = [selectedRotation[0]*dTr,selectedRotation[1]*dTr,selectedRotation[2]*dTr],
        rotationMatrix = getRotationMatrix(radians[0],radians[1],radians[2]);
        colorCode = [0,0,0],
        sum = 0;
    for(let y = 0; y < 3; y++) {
        sum = 0;
        for(let x = 0; x < 3; x++) {
            sum += rotationMatrix[y][x]*(offset&(1<<x)?-1:1);
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
    infNavOuput.innerHTML = "rotation: ("+selectedRotation[0]+", "+selectedRotation[1]+", "+selectedRotation[2]+")<br>offset: ("+(offset&1?"-M, ":"+M, ")+(offset&2?"-M, ":"+M, ")+(offset&4?"-M":"+M")+')<br>result: <span class="infNavResult" style="background-color:'+infColorCode(colorCode)+'">'+InfCode(colorCode)+"</span>";
}

function copyRotation()  {
    clearM(2);
    for(let i = 0; i < 3; i++) {
        rotations[i].value = selectedRotation[i];
    }
}

function drawInfNavMap() {
    console.log("DRAWN!");
    infctx.clearRect(0,0,infNavCanvas.width,infNavCanvas.height);
    for(let i = 0; i < infNavCanvas.height; i += inc) {
        for(let j = 0; j < infNavCanvas.width; j += inc) {
            let radians = viewMode==0?[j*dTr,view*dTr,i*dTr]:viewMode==1?[view*dTr,j*dTr,i*dTr]:[j*dTr,i*dTr,view*dTr],
                rotationMatrix = getRotationMatrix(radians[0],radians[1],radians[2]),
                colorCode = [0,0,0],
                sum = 0;
            for(let y = 0; y < 3; y++) {
                sum = 0;
                for(let x = 0; x < 3; x++) {
                    sum += rotationMatrix[y][x]*(offset&(1<<x)?-1:1);
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
drawInfNavMap();
