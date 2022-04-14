import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";

let outputPath = `./output`;

export default {
    input: './index.ts',
    output: {
        dir: outputPath,
        format: 'esm'
    },
    plugins: [
        nodeResolve(),
        typescript()
    ]
}