/**
 * Extend given proto class with the target
 *
 * @param {Function} protoClass
 * @returns {ClassDecorator}
 * @constructor
 */

export const PrototypeFor = (protoClass: Function): ClassDecorator => {
    return (target: Function) => {
        protoClass.prototype = target.prototype;
    };
};