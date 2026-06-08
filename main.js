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
            row.push(Number(inputMatrices[n][i][j].value));
            if(inputMatrices[n][i][j].value=="") return;
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
            }
            sum = Math.round(sum*1000)/1000;
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
                result += (Math.sign(sum)<0?"-":"+")+sum+"M";
            }
            if(b!=n) result += ", ";
        }
        if(anyInf) {
            outputs[n].innerHTML += count+". "+result+")<br>";
            count++;
        }
    }
}

function clearM(n) {
    for(let i = 0; i <= n; i++) {
        for(let j = 0; j < 3; j++) {
            inputMatrices[n][i][j].value = "";
        }
    }
    outputs[n].innerHTML = "";
}
