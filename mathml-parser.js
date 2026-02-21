class MathMLParser {
    constructor() { }
    parseMathML(mathmlJson) {
        mathmlJson = mathmlJson.content;
        const parseResult = this.parseExpression(mathmlJson, 0).parseResult;
        return parseResult;
    }
    read(mathmlJson, index) {
        return mathmlJson[index];
    }
    doneRead(mathmlJson, index, condition = x => true, pipeFunc = x => x) {
        if (condition(mathmlJson[index])) {
            const item = pipeFunc(mathmlJson[index]);
            return { item, index: ++index };
        }
        throw new Error('Invalid syntax');
    }
    parseExpression(mathmlJson, index) {
        const addSubArray = ['+', '-', '\u2212'];
        let parseResult = null, rightParseResult = null, operator = null;
        ({ parseResult, index } = this.parseTerm(mathmlJson, index));
        let readTrue = addSubArray.includes((readRes=>readRes?readRes.content[0].content:null)(this.read(mathmlJson, index)));
        while (readTrue) {
            const readResult = this.doneRead(mathmlJson, index, readPar => readPar.tagName === 'mo' && addSubArray.includes(readPar.content[0].content));
            readResult.operator = readResult.item.content[0].content;
            ({ operator, index } = readResult);
            const parseResultInner = this.parseTerm(mathmlJson, index);
            parseResultInner.rightParseResult = parseResultInner.parseResult;
            ({ rightParseResult, index } = parseResultInner);
            parseResult = {
                operator,
                left: parseResult,
                right: rightParseResult
            }
            readTrue = addSubArray.includes((readRes=>readRes?readRes.content[0].content:null)(this.read(mathmlJson, index)));
        }
        return { parseResult, index };
    }
    parseTerm(mathmlJson, index) {
        const mulDivArray = ['*', '/', '\xd7', '\xf7', '\u22c5'];
        let parseResult = null, rightParseResult = null, operator = null;
        ({ parseResult, index } = this.parseFactor(mathmlJson, index));
        let readTrue = mulDivArray.includes((readRes=>readRes?readRes.content[0].content:null)(this.read(mathmlJson, index)));
        while (readTrue) {
            const readResult = this.doneRead(mathmlJson, index, readPar => readPar.tagName === 'mo' && mulDivArray.includes(readPar.content[0].content));
            readResult.operator = readResult.item.content[0].content;
            ({ operator, index } = readResult);
            const parseResultInner = this.parseFactor(mathmlJson, index);
            parseResultInner.rightParseResult = parseResultInner.parseResult;
            ({ rightParseResult, index } = parseResultInner);
            parseResult = {
                operator,
                left: parseResult,
                right: rightParseResult
            }
            readTrue = mulDivArray.includes((readRes=>readRes?readRes.content[0].content:null)(this.read(mathmlJson, index)));
        }
        return { parseResult, index };
    }
    parseFactor(mathmlJson, index) {
        const jsonItem = this.read(mathmlJson, index);
        const tagName = jsonItem.tagName;
        if (tagName === 'mrow') {
            const jsonItemInner = this.parseExpression(jsonItem.content, 0);
            const parseResult = jsonItemInner.parseResult;
            return { parseResult, index: ++index };
        } else if (tagName === 'mfrac') {
            let parseResultInner1 = this.parseFactor(jsonItem.content, 0);
            const arg1 = parseResultInner1.parseResult;
            let parseResultInner2 = this.parseFactor(jsonItem.content, 1);
            const arg2 = parseResultInner2.parseResult;
            const structJson = {parseResult: { type: 'fraction', args: [arg1, arg2] }, index: ++index };
            return structJson;
        } else if (tagName === 'msup') {
            let parseResultInner1 = this.parseFactor(jsonItem.content, 0);
            const arg1 = parseResultInner1.parseResult;
            let parseResultInner2 = this.parseFactor(jsonItem.content, 1);
            const arg2 = parseResultInner2.parseResult;
            const structJson = {parseResult: { type: 'superscript', args: [arg1, arg2] }, index: ++index };
            return structJson;
        } else if (tagName === 'mo') {
            let parseResult;
            const jsonItemInner = jsonItem.content[0];
            if (jsonItemInner.type === 'text' && ['-', '\u2212'].includes(jsonItemInner.content)) {
                const nextContent = this.doneRead(mathmlJson, index, readPar => readPar.type === 'tag');
                index = nextContent.index;
                const content = this.parseFactor(mathmlJson, index);
                ({ parseResult, index } = content);
                return {parseResult: { type: 'unaryMinus', args: [parseResult] }, index }
            } else if (jsonItemInner.type === 'text' && ['('].includes(jsonItemInner.content)) {
                const nextContent = this.doneRead(mathmlJson, index, readPar => readPar.type === 'tag');
                index = nextContent.index;
                const parContent = this.parseExpression(mathmlJson, index);
                ({ parseResult, index } = parContent);
                const afterParContent = this.doneRead(mathmlJson, index, readPar => readPar.type === 'tag');
                index = afterParContent.index;
                return { parseResult, index };
            }
        } else if (tagName === 'mn') {
            let item = jsonItem.content[0].content;
            return {parseResult: { type: 'number', value: item }, index: ++index };
        } else if (tagName === 'mi') {
            let item = jsonItem.content[0].content;
            return {parseResult: { type: 'identifier', name: item }, index: ++index };
        }
    }
}
