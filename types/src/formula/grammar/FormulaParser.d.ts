declare const FormulaParser_base: any;
declare class FormulaParser extends FormulaParser_base {
    [x: string]: any;
    static grammarFileName: string;
    static literalNames: string[];
    static symbolicNames: string[];
    static ruleNames: string[];
    constructor(input: any);
    _interp: any;
    ruleNames: string[];
    literalNames: string[];
    symbolicNames: string[];
    lines(): LinesContext;
    state: number;
    expression(): ExpressionContext;
    returnExp(): ReturnExpContext;
    innerBlock(): InnerBlockContext;
    whileLoop(): WhileLoopContext;
    forLoop(): ForLoopContext;
    forInLoop(): ForInLoopContext;
    ifThenElse(): IfThenElseContext;
    functionDef(): FunctionDefContext;
    tryCatch(): TryCatchContext;
    throwExp(): ThrowExpContext;
    anonFunctionDef(): AnonFunctionDefContext;
    assignment(): AssignmentContext;
    assigned(): AssignedContext;
    logicalExpression(): LogicalExpressionContext;
    booleanXORExpression(): BooleanXORExpressionContext;
    booleanAndExpression(): BooleanAndExpressionContext;
    equalityExpression(): EqualityExpressionContext;
    relationalExpression(): RelationalExpressionContext;
    additiveExpression(): AdditiveExpressionContext;
    multiplicativeExpression(): MultiplicativeExpressionContext;
    arrayExpression(): ArrayExpressionContext;
    negationExpression(): NegationExpressionContext;
    powerExpression(): PowerExpressionContext;
    unaryOrNegate(): UnaryOrNegateContext;
    unaryExpression(): UnaryExpressionContext;
    innerPrimaryExpression(): InnerPrimaryExpressionContext;
    selectionExpression(): SelectionExpressionContext;
    funCall(): FunCallContext;
    primaryExpression(): PrimaryExpressionContext;
    value(): ValueContext;
    material(): MaterialContext;
    array(): ArrayContext;
    newObject(): NewObjectContext;
    defaultValue(): DefaultValueContext;
    selector(): SelectorContext;
    minarray(): MinarrayContext;
    dotselector(): DotselectorContext;
    arrayName(): ArrayNameContext;
    label(): LabelContext;
    number(): NumberContext;
    negnumber(): NegnumberContext;
    unitMultiplicativeExpression(): UnitMultiplicativeExpressionContext;
    unitInnerMultiplicativeExpression(): UnitInnerMultiplicativeExpressionContext;
    unitClump(): UnitClumpContext;
    unitPowerExpression(): UnitPowerExpressionContext;
    unit(): UnitContext;
    string(): StringContext;
}
declare namespace FormulaParser {
    export let EOF: any;
    export let T__0: number;
    export let T__1: number;
    export let T__2: number;
    export let T__3: number;
    export let T__4: number;
    export let T__5: number;
    export let T__6: number;
    export let T__7: number;
    export let COMMENT: number;
    export let LINE_COMMENT: number;
    export let R__: number;
    export let R_: number;
    export let NEWLINES: number;
    export let WHILESTATEMENT: number;
    export let FORSTATEMENT: number;
    export let FROMSTATEMENT: number;
    export let INSTATEMENT: number;
    export let TOSTATEMENT: number;
    export let BYSTATEMENT: number;
    export let LOOPSTATEMENT: number;
    export let IFSTATEMENT: number;
    export let THENSTATEMENT: number;
    export let ELSESTATEMENT: number;
    export let FUNCTIONSTATEMENT: number;
    export let ENDBLOCK: number;
    export let RETURNSTATEMENT: number;
    export let NEWSTATEMENT: number;
    export let TRYSTATEMENT: number;
    export let CATCHSTATEMENT: number;
    export let THROWSTATEMENT: number;
    export let OR: number;
    export let XOR: number;
    export let AND: number;
    export let EQUALS: number;
    export let NOTEQUALS: number;
    export let LT: number;
    export let LTEQ: number;
    export let GT: number;
    export let GTEQ: number;
    export let PLUS: number;
    export let MINUS: number;
    export let MULT: number;
    export let DIV: number;
    export let MOD: number;
    export let POW: number;
    export let LARR: number;
    export let RARR: number;
    export let LCURL: number;
    export let RCURL: number;
    export let INTEGER: number;
    export let FLOAT: number;
    export let BOOL: number;
    export let PER: number;
    export let SQUARED: number;
    export let CUBED: number;
    export let IDENT: number;
    export let PRIMITIVE: number;
    export let LBRACKET: number;
    export let RBRACKET: number;
    export let SPACE: number;
    export let STRING: number;
    export let RULE_lines: number;
    export let RULE_expression: number;
    export let RULE_returnExp: number;
    export let RULE_innerBlock: number;
    export let RULE_whileLoop: number;
    export let RULE_forLoop: number;
    export let RULE_forInLoop: number;
    export let RULE_ifThenElse: number;
    export let RULE_functionDef: number;
    export let RULE_tryCatch: number;
    export let RULE_throwExp: number;
    export let RULE_anonFunctionDef: number;
    export let RULE_assignment: number;
    export let RULE_assigned: number;
    export let RULE_logicalExpression: number;
    export let RULE_booleanXORExpression: number;
    export let RULE_booleanAndExpression: number;
    export let RULE_equalityExpression: number;
    export let RULE_relationalExpression: number;
    export let RULE_additiveExpression: number;
    export let RULE_multiplicativeExpression: number;
    export let RULE_arrayExpression: number;
    export let RULE_negationExpression: number;
    export let RULE_powerExpression: number;
    export let RULE_unaryOrNegate: number;
    export let RULE_unaryExpression: number;
    export let RULE_innerPrimaryExpression: number;
    export let RULE_selectionExpression: number;
    export let RULE_funCall: number;
    export let RULE_primaryExpression: number;
    export let RULE_value: number;
    export let RULE_material: number;
    export let RULE_array: number;
    export let RULE_newObject: number;
    export let RULE_defaultValue: number;
    export let RULE_selector: number;
    export let RULE_minarray: number;
    export let RULE_dotselector: number;
    export let RULE_arrayName: number;
    export let RULE_label: number;
    export let RULE_number: number;
    export let RULE_negnumber: number;
    export let RULE_unitMultiplicativeExpression: number;
    export let RULE_unitInnerMultiplicativeExpression: number;
    export let RULE_unitClump: number;
    export let RULE_unitPowerExpression: number;
    export let RULE_unit: number;
    export let RULE_string: number;
    export { LinesContext };
    export { ExpressionContext };
    export { ReturnExpContext };
    export { InnerBlockContext };
    export { WhileLoopContext };
    export { ForLoopContext };
    export { ForInLoopContext };
    export { IfThenElseContext };
    export { FunctionDefContext };
    export { TryCatchContext };
    export { ThrowExpContext };
    export { AnonFunctionDefContext };
    export { AssignmentContext };
    export { AssignedContext };
    export { LogicalExpressionContext };
    export { BooleanXORExpressionContext };
    export { BooleanAndExpressionContext };
    export { EqualityExpressionContext };
    export { RelationalExpressionContext };
    export { AdditiveExpressionContext };
    export { MultiplicativeExpressionContext };
    export { ArrayExpressionContext };
    export { NegationExpressionContext };
    export { PowerExpressionContext };
    export { UnaryOrNegateContext };
    export { UnaryExpressionContext };
    export { InnerPrimaryExpressionContext };
    export { SelectionExpressionContext };
    export { FunCallContext };
    export { PrimaryExpressionContext };
    export { ValueContext };
    export { MaterialContext };
    export { ArrayContext };
    export { NewObjectContext };
    export { DefaultValueContext };
    export { SelectorContext };
    export { MinarrayContext };
    export { DotselectorContext };
    export { ArrayNameContext };
    export { LabelContext };
    export { NumberContext };
    export { NegnumberContext };
    export { UnitMultiplicativeExpressionContext };
    export { UnitInnerMultiplicativeExpressionContext };
    export { UnitClumpContext };
    export { UnitPowerExpressionContext };
    export { UnitContext };
    export { StringContext };
}
export default FormulaParser;
declare const LinesContext_base: any;
declare class LinesContext extends LinesContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    EOF(): any;
    expression: (i: any) => any;
    R__: (i: any) => any;
    R_: (i: any) => any;
}
declare const ExpressionContext_base: any;
declare class ExpressionContext extends ExpressionContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    assignment(): any;
    logicalExpression(): any;
    whileLoop(): any;
    forLoop(): any;
    forInLoop(): any;
    ifThenElse(): any;
    functionDef(): any;
    returnExp(): any;
    tryCatch(): any;
    throwExp(): any;
}
declare const ReturnExpContext_base: any;
declare class ReturnExpContext extends ReturnExpContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    RETURNSTATEMENT(): any;
    logicalExpression(): any;
    R_: (i: any) => any;
}
declare const InnerBlockContext_base: any;
declare class InnerBlockContext extends InnerBlockContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    expression: (i: any) => any;
    R__: (i: any) => any;
    R_: (i: any) => any;
}
declare const WhileLoopContext_base: any;
declare class WhileLoopContext extends WhileLoopContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    WHILESTATEMENT(): any;
    logicalExpression(): any;
    R__: (i: any) => any;
    ENDBLOCK(): any;
    R_: (i: any) => any;
    LOOPSTATEMENT(): any;
    innerBlock(): any;
}
declare const ForLoopContext_base: any;
declare class ForLoopContext extends ForLoopContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    FORSTATEMENT(): any;
    R_: (i: any) => any;
    IDENT(): any;
    FROMSTATEMENT(): any;
    logicalExpression: (i: any) => any;
    TOSTATEMENT(): any;
    R__: (i: any) => any;
    ENDBLOCK(): any;
    LOOPSTATEMENT(): any;
    BYSTATEMENT(): any;
    innerBlock(): any;
}
declare const ForInLoopContext_base: any;
declare class ForInLoopContext extends ForInLoopContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    FORSTATEMENT(): any;
    R_: (i: any) => any;
    IDENT(): any;
    INSTATEMENT(): any;
    logicalExpression(): any;
    R__: (i: any) => any;
    ENDBLOCK(): any;
    LOOPSTATEMENT(): any;
    innerBlock(): any;
}
declare const IfThenElseContext_base: any;
declare class IfThenElseContext extends IfThenElseContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    IFSTATEMENT: (i: any) => any;
    logicalExpression: (i: any) => any;
    R__: (i: any) => any;
    ENDBLOCK(): any;
    R_: (i: any) => any;
    THENSTATEMENT: (i: any) => any;
    innerBlock: (i: any) => any;
    ELSESTATEMENT: (i: any) => any;
}
declare const FunctionDefContext_base: any;
declare class FunctionDefContext extends FunctionDefContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    FUNCTIONSTATEMENT: (i: any) => any;
    R_: (i: any) => any;
    IDENT: (i: any) => any;
    R__: (i: any) => any;
    ENDBLOCK(): any;
    innerBlock(): any;
    EQUALS: (i: any) => any;
    defaultValue: (i: any) => any;
}
declare const TryCatchContext_base: any;
declare class TryCatchContext extends TryCatchContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    TRYSTATEMENT: (i: any) => any;
    R__: (i: any) => any;
    CATCHSTATEMENT(): any;
    R_: (i: any) => any;
    IDENT(): any;
    ENDBLOCK(): any;
    innerBlock: (i: any) => any;
}
declare const ThrowExpContext_base: any;
declare class ThrowExpContext extends ThrowExpContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    THROWSTATEMENT(): any;
    R_(): any;
    primaryExpression(): any;
}
declare const AnonFunctionDefContext_base: any;
declare class AnonFunctionDefContext extends AnonFunctionDefContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    FUNCTIONSTATEMENT: (i: any) => any;
    expression(): any;
    IDENT: (i: any) => any;
    R__: (i: any) => any;
    ENDBLOCK(): any;
    R_: (i: any) => any;
    EQUALS: (i: any) => any;
    defaultValue: (i: any) => any;
    innerBlock(): any;
}
declare const AssignmentContext_base: any;
declare class AssignmentContext extends AssignmentContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    IDENT: (i: any) => any;
    logicalExpression(): any;
    R_: (i: any) => any;
    EQUALS: (i: any) => any;
    defaultValue: (i: any) => any;
    PRIMITIVE: (i: any) => any;
    assigned: (i: any) => any;
}
declare const AssignedContext_base: any;
declare class AssignedContext extends AssignedContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    IDENT(): any;
    selector(): any;
}
declare const LogicalExpressionContext_base: any;
declare class LogicalExpressionContext extends LogicalExpressionContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    booleanXORExpression: (i: any) => any;
    OR: (i: any) => any;
    R_: (i: any) => any;
}
declare const BooleanXORExpressionContext_base: any;
declare class BooleanXORExpressionContext extends BooleanXORExpressionContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    booleanAndExpression: (i: any) => any;
    XOR: (i: any) => any;
    R_: (i: any) => any;
}
declare const BooleanAndExpressionContext_base: any;
declare class BooleanAndExpressionContext extends BooleanAndExpressionContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    equalityExpression: (i: any) => any;
    AND: (i: any) => any;
    R_: (i: any) => any;
}
declare const EqualityExpressionContext_base: any;
declare class EqualityExpressionContext extends EqualityExpressionContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    relationalExpression: (i: any) => any;
    EQUALS: (i: any) => any;
    NOTEQUALS: (i: any) => any;
    R_: (i: any) => any;
}
declare const RelationalExpressionContext_base: any;
declare class RelationalExpressionContext extends RelationalExpressionContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    additiveExpression: (i: any) => any;
    LT: (i: any) => any;
    LTEQ: (i: any) => any;
    GT: (i: any) => any;
    GTEQ: (i: any) => any;
    R_: (i: any) => any;
}
declare const AdditiveExpressionContext_base: any;
declare class AdditiveExpressionContext extends AdditiveExpressionContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    multiplicativeExpression: (i: any) => any;
    PLUS: (i: any) => any;
    MINUS: (i: any) => any;
    R_: (i: any) => any;
}
declare const MultiplicativeExpressionContext_base: any;
declare class MultiplicativeExpressionContext extends MultiplicativeExpressionContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    arrayExpression: (i: any) => any;
    MULT: (i: any) => any;
    DIV: (i: any) => any;
    MOD: (i: any) => any;
    R_: (i: any) => any;
}
declare const ArrayExpressionContext_base: any;
declare class ArrayExpressionContext extends ArrayExpressionContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    negationExpression: (i: any) => any;
}
declare const NegationExpressionContext_base: any;
declare class NegationExpressionContext extends NegationExpressionContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    MINUS(): any;
    powerExpression(): any;
    R_: (i: any) => any;
}
declare const PowerExpressionContext_base: any;
declare class PowerExpressionContext extends PowerExpressionContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    unaryExpression(): any;
    POW: (i: any) => any;
    unaryOrNegate: (i: any) => any;
    R_: (i: any) => any;
}
declare const UnaryOrNegateContext_base: any;
declare class UnaryOrNegateContext extends UnaryOrNegateContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    MINUS(): any;
    unaryExpression(): any;
    R_: (i: any) => any;
}
declare const UnaryExpressionContext_base: any;
declare class UnaryExpressionContext extends UnaryExpressionContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    innerPrimaryExpression(): any;
    R_: (i: any) => any;
}
declare const InnerPrimaryExpressionContext_base: any;
declare class InnerPrimaryExpressionContext extends InnerPrimaryExpressionContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    selectionExpression(): any;
}
declare const SelectionExpressionContext_base: any;
declare class SelectionExpressionContext extends SelectionExpressionContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    primaryExpression(): any;
    selector: (i: any) => any;
    funCall: (i: any) => any;
}
declare const FunCallContext_base: any;
declare class FunCallContext extends FunCallContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    logicalExpression: (i: any) => any;
    R_: (i: any) => any;
}
declare const PrimaryExpressionContext_base: any;
declare class PrimaryExpressionContext extends PrimaryExpressionContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    logicalExpression(): any;
    R__: (i: any) => any;
    R_: (i: any) => any;
    value(): any;
}
declare const ValueContext_base: any;
declare class ValueContext extends ValueContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    number(): any;
    BOOL(): any;
    string(): any;
    material(): any;
    IDENT(): any;
    PRIMITIVE(): any;
    array(): any;
    anonFunctionDef(): any;
    newObject(): any;
}
declare const MaterialContext_base: any;
declare class MaterialContext extends MaterialContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    LCURL(): any;
    additiveExpression(): any;
    R_: (i: any) => any;
    unitMultiplicativeExpression(): any;
    RCURL(): any;
}
declare const ArrayContext_base: any;
declare class ArrayContext extends ArrayContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    LARR(): any;
    RARR(): any;
    label: (i: any) => any;
    R__: (i: any) => any;
    R_: (i: any) => any;
    LCURL(): any;
    RCURL(): any;
    logicalExpression: (i: any) => any;
}
declare const NewObjectContext_base: any;
declare class NewObjectContext extends NewObjectContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    NEWSTATEMENT(): any;
    R_(): any;
    IDENT(): any;
    funCall(): any;
}
declare const DefaultValueContext_base: any;
declare class DefaultValueContext extends DefaultValueContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    negnumber(): any;
    number(): any;
    BOOL(): any;
    string(): any;
    array(): any;
}
declare const SelectorContext_base: any;
declare class SelectorContext extends SelectorContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    minarray(): any;
    dotselector(): any;
}
declare const MinarrayContext_base: any;
declare class MinarrayContext extends MinarrayContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    LARR(): any;
    RARR(): any;
    logicalExpression: (i: any) => any;
    MULT: (i: any) => any;
    R_: (i: any) => any;
    LCURL(): any;
    RCURL(): any;
}
declare const DotselectorContext_base: any;
declare class DotselectorContext extends DotselectorContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    arrayName: (i: any) => any;
}
declare const ArrayNameContext_base: any;
declare class ArrayNameContext extends ArrayNameContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    IDENT(): any;
    STRING(): any;
    MULT(): any;
}
declare const LabelContext_base: any;
declare class LabelContext extends LabelContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    arrayName(): any;
    logicalExpression(): any;
    R__: (i: any) => any;
    R_: (i: any) => any;
}
declare const NumberContext_base: any;
declare class NumberContext extends NumberContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    INTEGER(): any;
    FLOAT(): any;
}
declare const NegnumberContext_base: any;
declare class NegnumberContext extends NegnumberContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    MINUS(): any;
    number(): any;
}
declare const UnitMultiplicativeExpressionContext_base: any;
declare class UnitMultiplicativeExpressionContext extends UnitMultiplicativeExpressionContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    unitInnerMultiplicativeExpression: (i: any) => any;
    R_: (i: any) => any;
    PER: (i: any) => any;
}
declare const UnitInnerMultiplicativeExpressionContext_base: any;
declare class UnitInnerMultiplicativeExpressionContext extends UnitInnerMultiplicativeExpressionContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    unitClump: (i: any) => any;
    MULT: (i: any) => any;
    DIV: (i: any) => any;
    R_: (i: any) => any;
}
declare const UnitClumpContext_base: any;
declare class UnitClumpContext extends UnitClumpContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    unitPowerExpression(): any;
    INTEGER(): any;
    DIV(): any;
    R_: (i: any) => any;
    CUBED(): any;
    SQUARED(): any;
}
declare const UnitPowerExpressionContext_base: any;
declare class UnitPowerExpressionContext extends UnitPowerExpressionContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    unit(): any;
    POW: (i: any) => any;
    INTEGER: (i: any) => any;
    FLOAT: (i: any) => any;
    MINUS: (i: any) => any;
    R_: (i: any) => any;
}
declare const UnitContext_base: any;
declare class UnitContext extends UnitContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    IDENT: (i: any) => any;
    R_: (i: any) => any;
    unitMultiplicativeExpression(): any;
}
declare const StringContext_base: any;
declare class StringContext extends StringContext_base {
    [x: string]: any;
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    STRING(): any;
}
