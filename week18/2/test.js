var assert = require('assert');
import {parserHTML} from '../parser.js';

describe("parse html:", function(){
    it('<a></a>', function() {
        let tree = parserHTML('<a></a>');
        console.log(tree);
        assert.equal(tree.children[0].tagName, "a");
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<a href="www.baidu.com"></a>', function() {
        let tree = parserHTML('<a href="www.baidu.com"></a>');
        console.log(tree);
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<a href ></a>', function() {
        let tree = parserHTML('<a href ></a>');
        // console.log(tree);
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<a href id ></a>', function() {
        let tree = parserHTML('<a href id ></a>');
        // console.log(tree);
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<a href="abc" id ></a>', function() {
        let tree = parserHTML('<a href="abc" id ></a>');
        // console.log(tree);
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<a id=abc ></a>', function() {
        let tree = parserHTML('<a id=abc ></a>');
        // console.log(tree);
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<a />', function() {
        let tree = parserHTML('<a />');
        // console.log(tree);
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<a id=\'abc\' />', function() {
        let tree = parserHTML('<a id=\'abc\' />');
        // console.log(tree);
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<a id=abc />', function() {
        let tree = parserHTML('<a id=abc />');
        // console.log(tree);
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<A id=abc /> upper case', function() {
        let tree = parserHTML('<A id=abc />');
        // console.log(tree);
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });//覆盖率没变
    it('<>', function() {
        let tree = parserHTML('<>');
        console.log(tree);
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].type, "text");
    });
    it('<style>div{width:100px}</style>', function() {
        let tree = parserHTML('<style>div{width:100px}</style>');
        console.log(tree);
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 1);
    });
    it('<style>#parent{width:100px}</style>', function() {
        let tree = parserHTML('<style>#parent{width:100px}</style>');
        console.log(tree);
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 1);
    });
    it('<style>.parent{width:100px}</style>', function() {
        let tree = parserHTML('<style>.parent{width:100px}</style>');
        console.log(tree);
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 1);
    });
})
