const druglstwebbody="body"
const drugsrc="https://yaqqlin.github.io/druglistweb/data.json";
const instrsetsrc="https://yaqqlin.github.io/druglistweb/picdata1.json";
const appearset="https://yaqqlin.github.io/druglistweb/appeardata1.json"
const picsetsrc=[instrsetsrc,instrsetsrc,appearset];
const ditems=['許可證字號','中文品名','英文品名','適應症','劑型','主成分略述','申請商名稱','製造商名稱','用法用量']
const Ddata={};
let updatehtmltext="<div class='updatehtmltext'>使用說明：點選右上角重新查詢>>輸入關鍵字>>輸入在哪些條目裡搜尋關鍵字>>送出>>表格中會呈現搜尋結果</div>"
updatehtmltext+="<div class='updatehtmltext'>呈現結果後:</div>"
updatehtmltext+="<div class='updatehtmltext'>1.點選<span style='color:red'>重新查尋</span>查新的資料</div>"
updatehtmltext+="<div class='updatehtmltext'>2.點選<span style='color:red'>繼續查詢</span>由呈現的資料中繼續查詢</div>"
updatehtmltext+="<div class='updatehtmltext'>3.點選<span style='color:red'>下載清單</span>由呈現的資料存為csv檔(可由excel或記事本開啟)</div>"
updatehtmltext+="<div class='updatehtmltext'>4.點選<span style='color:red'>下載圖檔</span>所有呈現的資料將轉為超連結，點選連結即可下載圖檔(仿單、外盒、外觀)</div>"
updatehtmltext+="<div class='updatehtmltext'>5.點選索引值旁邊的+號加入<span style='color:red'>存檔清單</span>，可由下方存檔清單執行各項操作</div>"
window.constdata={};
function render(elementtag,classnam,elementid,Content,parentid){
    let elementold = document.querySelector("#"+elementid);
    if(elementold){
        document.querySelector("#"+parentid).removeChild(elementold)
    }
    let element=document.createElement(elementtag);
    element.className=classnam;
    element.id=elementid
    element.textContent=Content
    document.querySelector("#"+parentid).appendChild(element)
    return element
}
function getdata(src){
    return new Promise(function(resolve,reject){
            fetch(src).then(function(response){
            return response.json();
            }).then(function(data){
            resolve(data);
            postblock.textContent=data.content.head0.length+" 筆資料下載完成!\r\n"+postblock.textContent;
            })
        })
    }
async function excute(){
    box.style.display="none";
    let table1=document.createElement("table");
    table1.id="table1";
    document.querySelector(druglstwebbody).appendChild(table1);
    Ddata.data=await getdata(drugsrc);
    window.drugdata=Object.assign({},Ddata.data)
    let drugdata=window.drugdata;
    drugdata.downloadfhead=[];
    drugdata.searchdata=Object.assign({},Ddata.data.content)
    window.drugdata.searchdata.index=[]
    window.drugdata.searchdata.index=[...Array(drugdata.content.head0.length).keys()]
    drugdata.picsetdata=[]
    drugdata.shown=0;
    drugdata.showdata=[];
    drugdata.savedindex=[]
    btnblock.appendChild(btnsearch);
    btnbottom.appendChild(btnprevious);
    btnbottom.appendChild(btnnext);
    btnbottom.appendChild(savedbtn);
    showtitle=reposition()
    window.addEventListener("resize",reposition)
    //showpage(0,showtitle);
    return Ddata
};
function showpage(pageshownum,showtitle){
    let drugdata=window.drugdata;
    drugdata.shown+=pageshownum;
    let num=drugdata.shown;
    let content=drugdata.searchdata;
    let nummax=Object.keys(content.head0).length;
    if(num>=10){
        btnprevious.style="pointer-events:auto;opacity:1";
    }else{
        btnprevious.style="pointer-events:none;opacity:0.3";
    };
    if(nummax-num>10){
        postblock.textContent="共 "+nummax+" 筆資料，顯示 "+String(num)+" - "+String(num+10)+" 筆資料。\r\n"+postblock.textContent;
        btnnext.style="pointer-events:auto;opacity:1";
    }else{
        postblock.textContent="共 "+nummax+" 筆資料，顯示 "+String(num)+" - "+String(nummax)+" 筆資料。\r\n"+postblock.textContent;
        btnnext.style="pointer-events:none;opacity:0.3";
    };
    if(document.querySelector("#t1head")){
        document.querySelector("#table1").removeChild(document.querySelector("#t1head"))
    }
    render("tr","head","t1head","","table1");
    render("td","headtd","headtitle","index","t1head");
    for(i of showtitle){
        render("td","headtd","head"+String(i),drugdata.item[i],"t1head");
    };
    for(i=0;i<10;i++){
        if(document.querySelector("#row"+String(i+1))){
            document.querySelector("#table1").removeChild(document.querySelector("#row"+String(i+1)))
        }
        if(content["head0"][i+num]){
            drugdata.showdata=[]
            drugdata.showdata[i]=render("tr","contenttr","row"+String(i+1),"","table1");
            drugdata.showdata[i]["index"+String(i)]=render("td","headtd","row"+String(i+1)+"index",i+1+num,"row"+String(i+1));
            drugdata.showdata[i].ckeckindex=render("button","ckeckindex","row"+String(i+1)+"ckeckindex","","row"+String(i+1)+"index");
            drugdata.showdata[i].ckeckindex.textContent="+"
            drugdata.showdata[i].ckeckindex.value=drugdata.searchdata.index[num+i];
            drugdata.showdata[i].ckeckindex.addEventListener("click",saveindex)
            for(j of showtitle){
                drugdata.showdata[i]["head"+String(j)]=render("td","contenttd","row"+String(i+1)+"head"+String(j),content["head"+j][i+num],"row"+String(i+1));
            }
        }
    }
}
function nextpage(){
    showpage(10,showtitle)
}
function previouspage(){
    showpage(-10,showtitle)
}
function saveindex(){
    licontent.push(render("li","savedli","savedli"+String(window.drugdata.savedindex.length+1),window.drugdata.content.head2[this.value],"savedlst"));
    window.drugdata.savedindex.push(this.value)
    if(savedbox.contentbot.style.display=="none"){
        savedbox.contentbot.style.display="block";
    }
}
const customFilter = (arr, keyword) => {
    let result = [];
    arr.forEach((element, index) => {
        if (element.toString().toUpperCase().includes(keyword)) {
        result.push(index);
        }
    });
    
    return result;
}
function searchdata(){
    let searchdata=window.drugdata.searchdata;
    let keyword=window.constdata.inputBoxvar.input1.toUpperCase();
    let searchhead=window.constdata.inputBoxvar.input2;
    searchIndex=[];
    for(i of searchhead){
        let searchList =customFilter(searchdata["head"+String(i)],keyword)
        if (searchList.length > 0) {
            searchIndex.push(...searchList);
            searchIndex = [...new Set(searchIndex)].sort((a, b) => a - b);
            postblock.textContent="***搜尋<<<"+ditems[i]+">>>找到"+searchList.length+"筆符合藥品，所有項目累積找到"+searchIndex.length+"筆藥品***\r\n"+postblock.textContent;
        }else{
            //console.log("搜尋 "+ditems[i]+" 無符合藥品");
        };
        
    };
    searchdata.index=searchIndex.map(index=>searchdata.index[index]);
    for(i=0;i<ditems.length;i++){
        drugdata.searchdata["head"+String(i)]=searchIndex.map(index=>drugdata.searchdata["head"+String(i)][index]);
    }
    if(searchIndex.length>0){
        btnblock.appendChild(btnsearchmore);
    };
    window.drugdata.shown=0;
    showpage(0,showtitle);
    this.parentNode ?this.parentNode.style.transform="translate(120%,-70%) scale(0)":"";
}
function newdata(){
    window.drugdata.searchdata=Object.assign({},Ddata.data.content);
    window.drugdata.searchdata.index=[]
    window.drugdata.searchdata.index=[...Array(drugdata.content.head0.length).keys()]
    searchdata();
    btnblock.appendChild(btndownload);
    btnblock.appendChild(btnDpic);
    this.parentNode.style.transform="translate(120%,-70%) scale(0)";
}
function downloadcsv(dlindexs){
    if(window.constdata.inputBoxvar.input1 && window.constdata.inputBoxvar.input2.length>0){
        let drugdata=window.drugdata;
        let headindex=window.constdata.inputBoxvar.input2;
        let items=window.drugdata.item;
        let text="";
        let dlindex;
        drugdata.textout="";
        for(i=0;i<headindex.length;i++){
            text+=items[headindex[i]]+",";
        };
        drugdata.textout+="index"+","+text.slice(0,-1)+"\n";
        for(i=0;i<dlindexs.length;i++){
            text=""
            dlindex=parseInt(dlindexs[i]);
            for(item=0;item<headindex.length;item++){
                text+=drugdata.content["head"+headindex[item]][dlindex]+",";
            };
            drugdata.textout+=String(i+1)+","+text.slice(0,-1)+"\n";
        }
    }
    let filename=window.constdata.inputBoxvar.input1+".csv"
    let link = window.document.createElement("a");
    link.setAttribute("href", "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(window.drugdata.textout));
    link.setAttribute("download", filename);
    link.click();
    
}
function downloadText(){
    /*if(window.constdata.inputBoxvar.input1 && window.constdata.inputBoxvar.input2.length>0)
    textTOcsv();
    */
    downloadcsv(window.drugdata.searchdata.index)
}
window.constdata.inputBoxvar={};
window.constdata.inputBoxvar.input1=[];
window.constdata.inputBoxvar.input2=[];
let postblock=document.createElement("div");
postblock.id="postblock";
postblock.style="white-space: pre;"
document.querySelector(druglstwebbody).appendChild(postblock);
//btnblock>top
let openbox=function(element){
    window.constdata.inputBoxvar.input1=[];
    window.constdata.inputBoxvar.input2=[];
    element.style.transform="translate(0,0) scale(1)";
    let selectedelement=[...document.querySelectorAll(".btnarrselected")];
    selectedelement.map(element=>element.classList.remove("btnarrselected"));
    let selectedbox=[...document.querySelectorAll(".boxcontentselected")];
    selectedbox.map(element=>element.classList.remove("boxcontentselected"));
    let ckInvalue=[...document.querySelectorAll(".ckInvalue")]
    ckInvalue.map(element=>element.textContent="");
    if(element.children[5]){
        element.children[5].classList.add("submitban");
    }
}
let btnblockall=document.createElement("div");
btnblockall.id="btnblockall";
let btnblock=document.createElement("div");
btnblock.id="btnblock";
document.querySelector(druglstwebbody).appendChild(btnblockall).appendChild(btnblock);
let btnfold=document.createElement("botton");//
btnfold.id="btnfold"
btnfold.className="btn2";
btnfold.textContent="收合";
let openbtnblock=function(){
    if(btnblock.style.transform=="scale(0)"){
        btnblock.style.transform="scale(1)";
        btnfold.textContent="收合";
    }else{
        btnblock.style.transform="scale(0)";
        btnfold.textContent="展開";
    }
}
btnfold.addEventListener("click",openbtnblock);//
let btnsearch=document.createElement("botton");
btnsearch.className="btn2";
btnsearch.textContent="重新查詢";
let openSbox=function(){
    boxkeyword.value="";
    openbox(searchbox.box);
    searchbox.submit.addEventListener("click",newdata);
}
btnsearch.addEventListener("click",openSbox);
let btnsearchmore=document.createElement("botton");
btnsearchmore.className="btn2";
btnsearchmore.textContent="繼續查詢";
let openSboxold=function(){
    boxkeyword.value="";
    openbox(searchbox.box);
    searchbox.submit.removeEventListener("click",newdata);
    searchbox.submit.addEventListener("click",searchdata);
}
btnsearchmore.addEventListener("click",openSboxold);
let btndownload=document.createElement("botton");
btndownload.className="btn2";
btndownload.textContent="下載清單";
let openDbox=function(){
    openbox(downloadbox.box)
    downloadfname.value="";
    downloadbox.submit.addEventListener("click",downloadText);
};
btndownload.addEventListener("click",openDbox);
let btnDpic=document.createElement("botton");
btnDpic.className="btn2";
btnDpic.textContent="下載圖檔";
let openDPbox=function(){
    window.drugdata.inputBoxvar={};
    openbox(downloadPicbox.box);
    downloadPicbox.submit.addEventListener("click",downloadpicdata);
}
btnDpic.addEventListener("click",openDPbox);
let piclinkbtn=document.createElement("botton");
piclinkbtn.className="btn2";
piclinkbtn.textContent="圖檔連結";
let openPLbox=function(){
    openbox(hlinkbox.box);
}
piclinkbtn.addEventListener("click",openPLbox);
let savedbtn=document.createElement("botton");
savedbtn.className="btn1";
savedbtn.textContent="存檔清單";
let opensalbox=function(){
    if(savedbox.classList.contains("savedboxselected")){
        savedbox.classList.remove("savedboxselected")
    }else{
        savedbox.classList.add("savedboxselected")
    }
}
savedbtn.addEventListener("click",opensalbox);
//btnbottom
let btnbottom=document.createElement("div");
btnbottom.id="btnbottom";
document.querySelector(druglstwebbody).appendChild(btnbottom);
let btnnext=document.createElement("botton");
btnnext.className="btn1";
btnnext.textContent="下一頁";
btnnext.addEventListener("click",nextpage)
let btnprevious=document.createElement("botton");
btnprevious.className="btn1";
btnprevious.textContent="上一頁";
btnprevious.style="pointer-events:none;opacity:0.3";
btnprevious.addEventListener("click",previouspage);
//box
let box=document.createElement("div");
box.id="box";
let boxhead=document.createElement("div");
boxhead.id="boxhead";
boxhead.textContent="是否下載資料檔?";
let boxcontent=document.createElement("div");
boxcontent.id="boxcontent";
boxcontent.innerHTML="<center style='color:darkred;'>查詢藥品清單</center></br>開啟前須先下載資料檔  (約 17 MB)</br>";
boxcontent.innerHTML+=updatehtmltext
let boxconfirm=document.createElement("div");
boxconfirm.id="boxconfirm";
boxconfirm.textContent="確定!";
boxconfirm.addEventListener("click",excute);
let boxclose=document.createElement("div");
boxclose.id="boxclose";
boxclose.textContent="關閉"
let closeall=function(){window.close()}
boxclose.addEventListener("click",closeall)
document.querySelector(druglstwebbody).appendChild(box)
.appendChild(boxhead)
box.appendChild(boxcontent)
box.appendChild(boxconfirm)
box.appendChild(boxclose)
//inputbox"all"
let closebox=function(){
    this.parentNode.parentNode.style.transform="translate(120%,-70%) scale(0)";
}
let inputbox=function(boxname,title,content){
    this.box=document.createElement("div");
    this.box.id=boxname;
    this.box.className="inputbox"
    this.boxhead=document.createElement("div");
    this.boxhead.className="inputboxhead";
    this.boxhead.textContent=title
    this.boxclose=document.createElement("button");
    this.boxclose.className="inputboxclose";
    this.boxclose.textContent="X";
    this.boxclose.addEventListener("click",closebox);
    document.querySelector(druglstwebbody).appendChild(this.box).appendChild(this.boxhead).appendChild(this.boxclose);
    for(i=0;i<content.length;i++){
        this["content"+String(i)+"ti"]=document.createElement("div");
        this["content"+String(i)+"ti"].className="boxcontenti";
        this["content"+String(i)+"ti"].textContent=content[i];
        this.box.appendChild(this["content"+String(i)+"ti"]);
        this["content"+String(i)]=document.createElement("div");
        this["content"+String(i)].className="boxcontent";
        this.box.appendChild(this["content"+String(i)]);
    };
    this.submit=document.createElement("button");
    this.submit.className="inputsubmit submitban";
    this.submit.textContent="送出";
    this.box.appendChild(this.submit);
}
let inputbuttons=function(btnarr,btnbox,completeCk){
    let chooseop=function(){
        let inputBoxvar=window.constdata.inputBoxvar
        if(this.classList.contains("btnarrselected")){
            this.classList.remove("btnarrselected");
            let selectedindex=inputBoxvar.input2.indexOf(this.value)
            if(selectedindex!=-1){
                inputBoxvar.input2.splice(selectedindex,1)
            }
        }else{
            inputBoxvar.input2.push(this.value)
            this.classList.add("btnarrselected")
            if(completeCk.value){
            this.parentNode.parentNode.children[5].classList.remove("submitban")
            }
        }
    }
    for(i=0;i<btnarr.length;i++){
        this["option"+String(i)]=document.createElement("button");
        let optionv=this["option"+String(i)]
        optionv.id="option"+String(i)
        optionv.className="optionv"
        optionv.value=i
        optionv.textContent=btnarr[i]
        optionv.addEventListener("click",chooseop)
        btnbox.appendChild(optionv)
    }
}
let intextvalue=function(){
let regin=/[-!@#$&*"';/\}\)\>\<\(\{\|\\]+/
    window.constdata.inputBoxvar.input1="";
    if(regin.test(this.value)){
        this.parentNode.children[1].textContent="輸入錯誤";
        this.parentNode.parentNode.children[5].classList.add("submitban");
    }else{
        this.parentNode.children[1].textContent="ok";
        if(window.constdata.inputBoxvar.input2[0]){
            this.parentNode.parentNode.children[5].classList.remove("submitban");
        }else{
            this.parentNode.parentNode.children[5].classList.add("submitban");
        }
        window.constdata.inputBoxvar.input1=this.value;
    }
}
//searchbox
let searchbox=new inputbox("searchbox","查詢",["查詢關鍵字","搜尋項目"])
searchbox.boxkeyword=document.createElement("input");
let boxkeyword=searchbox.boxkeyword
boxkeyword.type="text";
boxkeyword.className="boxinput";
boxkeyword.placeholder="輸入關鍵字";
boxkeyword.addEventListener("change",intextvalue);
searchbox.content0.appendChild(boxkeyword);
let checkSinput=document.createElement("span");
checkSinput.className="ckInvalue";
searchbox.content0.appendChild(checkSinput);
searchbox.options=new inputbuttons(ditems,searchbox.content1,boxkeyword);
//downloadbox
let downloadbox=new inputbox("downloadbox","下載",["輸入檔名","清單顯示項目"])
let downloadfname=document.createElement("input");
downloadfname.type="text";
downloadfname.className="boxinput";
downloadfname.placeholder="輸入檔名";
downloadfname.addEventListener("change",intextvalue);
downloadbox.content0.appendChild(downloadfname);
let checkDinput=document.createElement("span");
checkDinput.className="ckInvalue";
downloadbox.content0.appendChild(checkDinput);
downloadbox.options=new inputbuttons(ditems,downloadbox.content1,downloadfname);
//downloadPicbox
let downloadPicbox=new inputbox("downloadPicbox","下載圖檔",["連結名稱","連結內容"]);
//content 0
let Pnamelicense=document.createElement("button");
Pnamelicense.textContent="許可證字號";
let Pnamechi=document.createElement("button");
Pnamechi.textContent="中文品名";
let Pnameen=document.createElement("button");
Pnameen.textContent="英文品名";
let Pnamebtns=[Pnamelicense,Pnamechi,Pnameen];
Pnamebtns.map(element=>element.className="optionv"/*"btnPname"*/);
Pnamebtns.map(element=>downloadPicbox.content0.appendChild(element));
Pnamebtns.forEach((element,index)=>{element.value=index});
let inputPname=function(){
    this.parentNode.classList.add("boxcontentselected");
    this.classList.add("btnarrselected");
    window.constdata.inputBoxvar.input1=this.value;
    if(window.constdata.inputBoxvar.input2.length>0){
        this.parentNode.parentNode.children[5].classList.remove("submitban");
    }
}
Pnamebtns.map(element=>element.addEventListener("click",inputPname))
//content 1
let instructionbtn=document.createElement("button");
instructionbtn.textContent="仿單";
instructionbtn.value=0//"./picdata1.json"
let boxappearbtn=document.createElement("button");
boxappearbtn.textContent="外盒";
boxappearbtn.value=1//"./picdata1.json"
let appearancebtn=document.createElement("button");
appearancebtn.textContent="藥品外觀";
appearancebtn.value=2//"./appeardata1.json"
let setbtn=[instructionbtn,boxappearbtn,appearancebtn];
setbtn.map(element=>element.className="optionv"/*"btnPname"*/)
setbtn.map(element=>downloadPicbox.content1.appendChild(element))
let inputset=function(){
    this.parentNode.classList.add("boxcontentselected");
    this.classList.add("btnarrselected");
    window.constdata.inputBoxvar.input2=this.value;
    if(window.constdata.inputBoxvar.input1.length>0){
        this.parentNode.parentNode.children[5].classList.remove("submitban");
    }
}
setbtn.map(element=>element.addEventListener("click",inputset));

let hlinkbox=new inputbox("hlinkbox","連結網址",["連結"]);
hlinkbox.submit.style="display:none";
hlinkbox.content0.style="display:block;height:60%;overflow:auto";
async function downloadpicdatas(downloadindex,element){
    let filename=window.constdata.inputBoxvar.input1;
    let inputsetsrc=window.constdata.inputBoxvar.input2;
    //檔案名稱filenamelist
    let filenamedata=window.drugdata.content["head"+String(filename)]
    let filenamelist=downloadindex.map(index=>filenamedata[parseInt(index)].replace(/\"/g,'').replace(/\”/g,'').replace(/\“/g,'').replace(/\//g,''))
    let fileli=downloadindex.map(index=>window.drugdata.content.head0[parseInt(index)])
    if(window.drugdata.picsetdata[inputsetsrc]!=true){
        window.drugdata.picsetdata[inputsetsrc]=await getdata(picsetsrc[inputsetsrc]);
    }
    let picsetdata=window.drugdata.picsetdata[inputsetsrc]
    picsetdata.itemno=[3,4,3];
    let piclinklst=picsetdata.content["head"+picsetdata.itemno[inputsetsrc]]
    let piclinks=fileli.map(li=>piclinklst[customFilter(picsetdata.content.head0,li)[0]])
    hlinkbox.content0.innerHTML=""
    for(i=0;i<filenamelist.length;i++){
        let link=document.createElement("a");
        link.style.display="block";
        link.style.marginBottom="20px";
        link.target="_blank";
        link.href=piclinks[i];
        link.innerHTML=filenamelist[i];
        hlinkbox.content0.appendChild(link);
    }
    element.parentNode.style.transform="translate(120%,-70%) scale(0)";
    btnblock.appendChild(piclinkbtn);
    hlinkbox.box.style.transform="translate(0,0) scale(1)";
}
function downloadpicdata(){
    downloadpicdatas(window.drugdata.searchdata.index,this)
}
function reposition(){
    if(innerWidth<1200){
        showtitle=[2];
        postblock.style.fontSize="14px";
        postblock.style.width="85%"
        btnblockall.appendChild(btnfold);
        btnblockall.style.width="80%"

    }else{
        showtitle=[2,3,5];
        postblock.style.fontSize="16px";
        postblock.style.width="70%"
        btnblockall.style.width="25%"
        if(document.querySelector("#btnfold")){
            btnblockall.removeChild(btnfold);
        }
    }
    showpage(0,showtitle)
    return  showtitle
}
//savedlstbox>>bottom
let savedbox=document.createElement("div");
savedbox.className="savedbox";
savedbox.boxhead=document.createElement("div");
savedbox.boxhead.className="inputboxhead";
savedbox.boxhead.textContent="已儲存的藥品"
savedbox.boxclose=document.createElement("button");
savedbox.boxclose.className="inputboxclose";
savedbox.boxclose.textContent="X";
let licontent=[];
let closesavedbox=function(){
    this.parentNode.parentNode.classList.remove("savedboxselected");
}
savedbox.boxclose.addEventListener("click",closesavedbox);
savedbox.content=document.createElement("div");
savedbox.content.id="savedboxcontent";
savedbox.savedlst=document.createElement("ol");
savedbox.savedlst.id="savedlst";
savedbox.contentbot=document.createElement("div");
savedbox.contentbot.id="savedboxbot";
savedbox.contentbot.style.display="none";
savedbox.btnsavelst=document.createElement("botton");
savedbox.btnsavelst.textContent="下載清單";
savedbox.btnsavelst.className="btn1";
let downloadsaved=function(){
    downloadcsv(window.drugdata.savedindex);
}
let openSLDbox=function(){
    openbox(downloadbox.box);
    downloadfname.value="";
    downloadbox.submit.addEventListener("click",downloadsaved);
};
savedbox.btnsavelst.addEventListener("click",openSLDbox)
savedbox.btnsavepiclst=document.createElement("botton");
savedbox.btnsavepiclst.textContent="下載圖檔";
savedbox.btnsavepiclst.className="btn1";
let savepiclst=function(){
    downloadpicdatas(window.drugdata.savedindex,this)
}
let opensavedDPbox=function(){
    window.drugdata.inputBoxvar={};
    openbox(downloadPicbox.box);
    downloadPicbox.submit.addEventListener("click",savepiclst);
}
savedbox.btnsavepiclst.addEventListener("click",opensavedDPbox)
savedbox.clearrepeated=document.createElement("botton");
savedbox.clearrepeated.textContent="刪除重複";
savedbox.clearrepeated.className="btn1";
let clearrepeat=function(){
    window.drugdata.savedindex = [...new Set(window.drugdata.savedindex)]
    let childrens=[...savedbox.savedlst.children]
    childrens.map(a=>savedbox.savedlst.removeChild(a));
    window.drugdata.savedindex.map(a=>render("li","savedli","savedli"+String(savedbox.savedlst.children.length),window.drugdata.content.head2[parseInt(a)],"savedlst"));
}
savedbox.clearrepeated.addEventListener("click",clearrepeat);
savedbox.clearall=document.createElement("botton");
savedbox.clearall.textContent="刪除全部";
savedbox.clearall.className="btn1";
let clearAll=function(){
    window.drugdata.savedindex = []
    let childrens=[...savedbox.savedlst.children]
    childrens.map(a=>savedbox.savedlst.removeChild(a));
    savedbox.contentbot.style.display="none";
}
savedbox.clearall.addEventListener("click",clearAll);
document.querySelector(druglstwebbody).appendChild(savedbox).appendChild(savedbox.boxhead).appendChild(savedbox.boxclose);
savedbox.appendChild(savedbox.content).appendChild(savedbox.savedlst);
savedbox.appendChild(savedbox.contentbot).appendChild(savedbox.btnsavelst);
savedbox.contentbot.appendChild(savedbox.btnsavepiclst);
savedbox.contentbot.appendChild(savedbox.clearrepeated);
savedbox.contentbot.appendChild(savedbox.clearall);
