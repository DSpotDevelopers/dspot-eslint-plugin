"use strict";

module.exports = {
    captureFunctionalComponent: function (node) {
        //Check if the declaration is a functional component checking the result of the function
        if (node.body.type === "BlockStatement") {
            const returnStatement = node.body.body.find(statement => statement.type === "ReturnStatement");
            if (returnStatement && returnStatement.argument && returnStatement.argument.type === "JSXElement") {
                return node;
            }
        }

        return null;
    }
}