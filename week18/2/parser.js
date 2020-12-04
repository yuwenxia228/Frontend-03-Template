const css = require("css");

let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;
let stack;

let rules = [] //css规则

function match(element, selector){
    if(!selector || !element.attribute)//???
        return false;

    if(selector.charAt(0) === '#'){
        var attr = element.attribute.filter(attr => attr.name === 'id')[0];
        if(attr && attr.value === selector.replace('#', ''))
            return true;
    }else if(selector.charAt(0) === '.'){
        var attr = element.attribute.filter(attr => attr.name === 'class')[0];
        if(attr && attr.value === selector.replace('.', ''))
            return true;
    }else{
        if(element.tagName === selector){
            return true;
        }
    }
}

function addCssRules(text){
    var ast = css.parse(text);
    // console.log(JSON.stringify(ast, null, "   "))//????
    rules.push(...ast.stylesheet.rules);
}

function computeCss(element){
    // console.log(rules);
    // console.log("compute Css for element", element);
    var elements = stack.slice().reverse();//父元素
    if(!element.computedStyle){
        element.computedStyle = {};
    }

    for(let rule of rules){
        var selectorParts = rule.selectors[0].split(" ").reverse();

        if(!match(element, selectorParts[0]))
            continue;

        let matched = false;

        var j = 1;
        for(var i = 0; i < elements.length; i++){
            if(elements[i].tagName === selectorParts[j]){
                j++;
            }
        };
        if(j >= selectorParts.length)
            matched = true;

        if(matched){
            // console.log("Element",element,"matched rule", rule);
            var sp = specificity(rule.selectors[0]);

            var computedStyle = element.computedStyle;
            for(var declaration of rule.declarations){
                if(!computedStyle[declaration.property]){
                    computedStyle[declaration.property] = {};
                }

                if(!computedStyle[declaration.property].specificity){
                    computedStyle[declaration.property].value = declaration.value;
                    computedStyle[declaration.property].specificity = sp;
                }else if(compare(computedStyle[declaration.property].specificity, sp) < 0){
                    computedStyle[declaration.property].value = declaration.value;//???
                    computedStyle[declaration.property].specificity = sp;
                }
                // computedStyle[declaration.property].value = declaration.value//????
            }
            console.log(element.computedStyle);
        }
    }
}

function specificity(selector){
    var p = [0, 0, 0, 0];
    var selectorParts = selector.split(" ");
    for(var part of selectorParts){
        if(part.charAt(0) === '#'){
            p[1] += 1;
        }else if(part.charAt(0) === '.'){
            p[2] += 1;
        }else{
            p[3] += 1;
        }
    }
    return p;
}

function compare(sp1, sp2){
    if(sp1[0] - sp2[0]){
        return sp1[0] - sp2[0];
    }
    if(sp1[1] - sp2[1]){
        return sp1[1] - sp2[1];
    }
    if(sp1[2] - sp2[2]){
        return sp1[2] - sp2[2];
    }

    return sp1[3] - sp2[3]
}

function emit(token){
    // console.log(token);

    let top = stack[stack.length - 1];

    if(token.type === "startTag"){
        let element = {
            type: "element",
            children: [],
            attribute: []
        };
        element.tagName = token.tagName;

        for(let p in token){
            if(p !== "type" && p !== "tagName"){
                element.attribute.push({
                    name: p,
                    value: token[p]
                })
            }
        }

        computeCss(element);
        top.children.push(element);
        // element.parent = top;

        if(!token.isSelfClosing){
            stack.push(element);
        }

        currentTextNode = null;
    }else if(token.type === "endTag") {
        if(token.tagName !== top.tagName){
            throw new Error("Tag start end doesn't match");
        }else{
            if(token.tagName === "style"){
                addCssRules(top.children[0].content);
            }
            stack.pop();
        }
        currentTextNode = null;
    }else if(token.type === "text"){
        if(!currentTextNode){
            currentTextNode = {
                type: "text",
                content: ""
            };
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
    

}

const EOF = Symbol("EOF");//文件尾

function data(c){
    if(c === '<'){
        return tagOpen;
    }
    else if(c === EOF){
        emit({
            type: "EOF"
        })
        return;
    }
    else{
        emit({
            type: "text",
            content: c
        })
        return data;
    }
}

function tagOpen(c){
    if(c === '/'){
        return endTagOpen;
    }else if(c.match(/^[a-zA-Z]$/)){
        currentToken = {
            type: "startTag",
            tagName: ""
        }
        return tagName(c);
    }else{
        return data;
    }
}

function endTagOpen(c){
    if(c.match(/^[a-zA-Z]$/)){
        currentToken = {
            type: "endTag",
            tagName: ""
        }
        return tagName(c);
    }else if(c === ">"){
        return;
    }else if(c === EOF){
        return;
    }
}

function tagName(c){
    if(c.match(/^[\t\n\f ]$/)){ //有效的空白符：tab符、换行符、禁止符、空白符
        return beforeAttributeName;
    }else if(c === '/'){
        return selfClosingStartTag;
    }else if(c.match(/^[a-zA-Z]$/)){
        currentToken.tagName += c;
        return tagName;
    }else if(c === '>'){
        emit(currentToken);
        return data;
    }else{
        return tagName;
    }
}

function beforeAttributeName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    }else if(c === '>' || c === '/' || c === EOF){
        return afterAttributeName(c);
    }else if(c === '='){
        // return beforeAttributeValue;
    }else{
        currentAttribute = {
            name: "",
            value: ""
        }
        return attributeName(c);
    }
}

function attributeName(c){
    if(c === ' ' || c ==='>' || c===EOF || c.match(/^[\t\n\f ]$/)){
        return afterAttributeName(c);
    }else if(c === '='){
        return beforeAttributeValue;
    }else if(c === '/' || c ===  "'" || c === "<"){
        
    }else{
        currentAttribute.name += c;
        return attributeName;
    }
}

function beforeAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/) || c ==='/' || c === '>' || c === EOF){
        return beforeAttributeValue; //??????
    }else if(c === "\""){
        return doubleQuotedAttributeValue;
    }else if(c === "\'"){
        return singleQuotedAttributeValue;
    }else if(c === ">"){
        
    }else{
        return unQuotedAttributeValue;
    }
}

function doubleQuotedAttributeValue(c){
    if(c === "\""){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    }else if(c === "\u0000"){

    }else if(c === EOF){

    }else{
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function singleQuotedAttributeValue(c){
    if(c === "\'"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    }else if(c === "\u0000"){

    }else if(c === EOF){

    }else{
        currentAttribute.value += c;
        return singleQuotedAttributeValue;
    }
}

function afterQuotedAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    }else if(c === '/'){
        return selfClosingStartTag;
    }else if(c === '>'){
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    }else if(c === EOF){

    }else{
        throw new Error("unexpected character \"" + c + "\"");
    }
}

function unQuotedAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/)){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    }else if(c === '/'){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    }else if(c === '>'){
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    }else if(c === "\u0000"){

    }else if(c === EOF){

    }else{
        currentAttribute.value += c;
        return unQuotedAttributeValue;
    }
}

function afterAttributeName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return afterAttributeName;
    }else if(c == '/'){
        return selfClosingStartTag
    }else if(c === '='){
        return beforeAttributeValue;
    }else if(c === '>'){
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    }else if(c === EOF){

    }else{
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name: "",
            value: ""
        };
        return attributeName(c);
    }
}

function selfClosingStartTag(c){
    if(c === '>'){
        currentToken.isSelfClosing = true;
        emit(currentToken);
        return data;
    }else if(c === EOF){

    }else{

    }
}

export function parserHTML(html) {
    currentToken = null;
    currentAttribute = null;
    currentTextNode = null;
    stack = [{type: "doument", children: []}];
    let state = data;
    // console.log(html);
    for(let c of html){
        state = state(c);
    }
    state = state(EOF);
    return stack[0];
}