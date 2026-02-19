class MathMLParser {
    constructor() {}
    parseMathML(mathmlJson) {
        mathmlJson = mathmlJson.content;
        parseExpression(mathmlJson, 0);
    }
    read(mathmlJson, index) {
        return mathmlJson[index];
    }
    doneRead(mathmlJson, index, condition = x => true) {
        if (condition(mathmlJson[index])) {
            const item = mathmlJson[index];
            return {item, index: ++index};
        }
        throw new Error('Invalid syntax')
    }
    parseExpression(mathmlJson, index) {
        const addSubArray = ['+', '-', '\u2212'];
        let parseResult = null, rightParseResult = null, operator = null, index = 0;
        {parseResult, index} = this.parseTerm(mathmlJson, index);
        while (addSubArray.includes(this.read(mathmlJson, index))) {
            const readResult = this.doneRead(mathmlJson, index, readPar => addSubArray.includes(readPar));
            readResult.operator = readResult.item;
            {operator, index} = readResult;
            const parseResultInner = this.parseTerm(mathmlJson, index);
            parseResultInner.rightParseResult = parseResultInner.parseResult;
            {rightParseResult, index} = parseResultInner;
            parseResult = {
                operator,
                left: parseResult,
                right: rightParseResult
            }
        }
        return {parseResult, index};
    }
    parseTerm(mathmlJson, index) {
        const mulDivArray = ['*', '/', '\xd7', '\xf7', '\u22c5'];
        let parseResult = null, rightParseResult = null, operator = null, index = 0;
        {parseResult, index} = this.parseFactor(mathmlJson, index);
        while (mulDivArray.includes(this.read(mathmlJson, index))) {
            const readResult = this.doneRead(mathmlJson, index, readPar => mulDivArray.includes(readPar));
            readResult.operator = readResult.item;
            {operator, index} = readResult;
            const parseResultInner = this.parseFactor(mathmlJson, index);
            parseResultInner.rightParseResult = parseResultInner.parseResult;
            {rightParseResult, index} = parseResultInner;
            parseResult = {
                operator,
                left: parseResult,
                right: rightParseResult
            }
        }
        return {parseResult, index};
    }
    parseFactor(mathmlJson, index) {
    }
}