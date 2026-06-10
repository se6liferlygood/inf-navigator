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
                if(sum>=1 || sum<=-1) break;
            }
            sum = Math.round(sum*1000)/1000;
            if(sum>=1) {
                result += "+&infin;"
                anyInf = true;
            } else if(sum<=-1) {
                result += "-&infin;";
                anyInf = true;
            } else if(sum==0) {
                result += "0";
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

var rotations = [document.getElementById("R0"),document.getElementById("R1"),document.getElementById("R2")];
function rotationAutoFill() {
    let radians = [];
    for(let i = 0; i < 3; i++) {
        if(rotations[i].value=="") return;
        radians.push(rotations[i].value*Math.PI/180);
    }
    outputs[2].innerHTML =  "";
    let a = Math.cos(radians[0]),
        b = Math.sin(radians[0]),
        c = Math.cos(radians[1]),
        d = Math.sin(radians[1]),
        e = Math.cos(radians[2]),
        f = Math.sin(radians[2]),
    rotationMatrix = [
        [e*c+f*b*d, e*b*d-f*c, a*d],
        [f*a, e*a, -b],
        [f*b*c-e*d, f*d+e*b*c, a*c]
    ]
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            inputMatrices[2][i][j].value = Math.round(rotationMatrix[i][j]*1000)/1000;
        }
    }
}
